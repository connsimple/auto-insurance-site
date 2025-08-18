const fetch = require("node-fetch");

exports.handler = async (event) => {
  try {
    const { plan, price } = JSON.parse(event.body);

    // Get PayPal access token
    const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`).toString("base64");
    const tokenRes = await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });
    const { access_token } = await tokenRes.json();

    // Create order
    const orderRes = await fetch("https://api-m.sandbox.paypal.com/v2/checkout/orders", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            description: plan,
            amount: {
              currency_code: "USD",
              value: price,
            },
          },
        ],
      }),
    });

    const order = await orderRes.json();
    return {
      statusCode: 200,
      body: JSON.stringify(order),
    };
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
};
