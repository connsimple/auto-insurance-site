// netlify/functions/create-paypal-order.js
const fetch = require("node-fetch");

// Server-side trusted pricing
const MONTHLY_RATES = {
  basic: 90,
  standard: 130,
  full: 175
};

function computePayInFull(coverage, termMonths) {
  const monthly = MONTHLY_RATES[coverage];
  if (!monthly) throw new Error("Invalid coverage tier");

  if (termMonths === 6) {
    return (monthly * 6).toFixed(2);
  }
  if (termMonths === 12) {
    // 25% off yearly if paid in full
    return (monthly * 12 * 0.75).toFixed(2);
  }
  throw new Error("Invalid term months (use 6 or 12)");
}

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const coverage = (body.coverage || "").toLowerCase(); // "basic" | "standard" | "full"
    const termMonths = Number(body.termMonths);            // 6 | 12

    const total = computePayInFull(coverage, termMonths);

    // PayPal creds
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_SECRET;

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    // Get access token
    const tokenRes = await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });
    const { access_token } = await tokenRes.json();

    // Create order (one-time)
    const orderRes = await fetch("https://api-m.sandbox.paypal.com/v2/checkout/orders", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            description: `Conn Simple ${coverage} plan - ${termMonths} months (Pay in Full)`,
            amount: { currency_code: "USD", value: total }
          }
        ],
        application_context: {
          brand_name: "Conn Simple Insurance",
          user_action: "PAY_NOW",
          return_url: "https://www.connsimple.com/success",
          cancel_url: "https://www.connsimple.com/cancel"
        }
      }),
    });

    const order = await orderRes.json();
    return { statusCode: 200, body: JSON.stringify(order) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: String(err) }) };
  }
};
