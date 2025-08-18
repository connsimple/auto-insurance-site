// netlify/functions/create-paypal-subscription.js
const fetch = require("node-fetch");

// Trusted monthly rates (server-side)
const MONTHLY_RATES = {
  basic: 90,
  standard: 130,
  full: 175
};

async function getAccessToken(clientId, clientSecret) {
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const data = await res.json();
  if (!data.access_token) throw new Error("PayPal auth failed");
  return data.access_token;
}

async function createProduct(accessToken) {
  const res = await fetch("https://api-m.sandbox.paypal.com/v1/catalogs/products", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "Conn Simple Auto Insurance",
      type: "SERVICE",
      category: "INSURANCE",
      description: "Monthly auto insurance subscription"
    }),
  });
  const data = await res.json();
  if (!data.id) throw new Error("Failed to create product");
  return data.id;
}

async function createPlan(accessToken, productId, coverage, termMonths, monthlyPrice) {
  const planName = `Conn Simple ${coverage.toUpperCase()} ${termMonths}m Monthly`;
  const res = await fetch("https://api-m.sandbox.paypal.com/v1/billing/plans", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      product_id: productId,
      name: planName,
      status: "ACTIVE",
      billing_cycles: [
        {
          frequency: { interval_unit: "MONTH", interval_count: 1 },
          tenure_type: "REGULAR",
          sequence: 1,
          total_cycles: termMonths, // ends after 6 or 12 charges
          pricing_scheme: {
            fixed_price: { currency_code: "USD", value: monthlyPrice.toFixed(2) }
          }
        }
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee_failure_action: "CONTINUE",
        payment_failure_threshold: 3
      }
    }),
  });
  const data = await res.json();
  if (!data.id) throw new Error("Failed to create plan");
  return data.id;
}

exports.handler = async (event) => {
  try {
    const { coverage, termMonths } = JSON.parse(event.body || "{}");
    const cov = (coverage || "").toLowerCase();
    const term = Number(termMonths);

    if (!["basic","standard","full"].includes(cov)) throw new Error("Invalid coverage tier");
    if (![6,12].includes(term)) throw new Error("Invalid term (6 or 12)");

    const monthlyPrice = MONTHLY_RATES[cov];

    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_SECRET;

    const accessToken = await getAccessToken(clientId, clientSecret);

    // create product + plan on the fly
    const productId = await createProduct(accessToken);
    const planId = await createPlan(accessToken, productId, cov, term, monthlyPrice);

    // Create subscription
    const subRes = await fetch("https://api-m.sandbox.paypal.com/v1/billing/subscriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        plan_id: planId,
        application_context: {
          brand_name: "Conn Simple Insurance",
          user_action: "SUBSCRIBE_NOW",
          return_url: "https://www.connsimple.com/success",
          cancel_url: "https://www.connsimple.com/cancel"
        }
      }),
    });

    const subData = await subRes.json();
    return { statusCode: 200, body: JSON.stringify(subData) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: String(err) }) };
  }
};
