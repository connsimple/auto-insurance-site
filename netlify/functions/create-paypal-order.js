// netlify/functions/create-paypal-order.js
const fetch = require("node-fetch");

exports.handler = async (event) => {
  try {
    const { plan, state, customerName, email } = JSON.parse(event.body);

    // Example plan pricing (adjust numbers as needed)
    const prices = {
      basic: "100.00",
      plus: "150.00",
      premium: "200.00"
    };

    const price = prices[plan] || "100.00";

    // PayPal credentials from your environment variables
    const PAYPAL_CLIENT = process.env.PAYPAL_CLIENT_ID;
    const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
    const PAYPAL_API = "https://api-m.sandbox.paypal.com"; // change to live later

    // Get access token
    const auth = Buffer.from(`${PAYPAL_CLIENT}:${PAYPAL_SECRET}`).toString("base64");
    const tokenRes = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials"
    });
    const { access_token } = await tokenRes.json();

    // Create order
    const orderRes = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: price,
            },
            description: `${plan.toUpperCase()} Plan for ${customerName} (${state})`
          }
        ]
      })
    });

    const order = await orderRes.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ id: order.id })
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: "Order creation failed" }) };
  }
};
