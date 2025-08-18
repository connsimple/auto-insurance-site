// netlify/functions/capture-paypal-order.js
const fetch = require("node-fetch");

exports.handler = async (event) => {
  try {
    const { orderId } = JSON.parse(event.body);

    const PAYPAL_CLIENT = process.env.PAYPAL_CLIENT_ID;
    const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
    const PAYPAL_API = "https://api-m.sandbox.paypal.com"; // change to live later

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

    // Capture the order
    const captureRes = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json"
      }
    });

    const data = await captureRes.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: "Order capture failed" }) };
  }
};
