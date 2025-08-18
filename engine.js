// engine.js
document.addEventListener("DOMContentLoaded", () => {
  const quoteForm = document.getElementById("quoteForm");

  if (!quoteForm) {
    console.error("⚠️ quoteForm not found. Make sure your form has id='quoteForm'");
    return;
  }

  quoteForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Collect form data (adjust IDs if your inputs differ)
    const plan = document.querySelector("input[name='plan']:checked")?.value;
    const state = document.getElementById("state").value;
    const customerName = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    if (!plan || !state || !customerName || !email) {
      alert("Please complete all required fields.");
      return;
    }

    try {
      // Step 1: Create PayPal order via Netlify serverless function
      const createRes = await fetch("/.netlify/functions/create-paypal-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, state, customerName, email })
      });

      const { id: orderId } = await createRes.json();

      // Step 2: Capture payment (subscription-style flow can be extended here)
      const captureRes = await fetch("/.netlify/functions/capture-paypal-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId })
      });

      const result = await captureRes.json();

      if (result.status === "COMPLETED") {
        alert("✅ Payment successful! Your binder + ID card will be emailed.");
        // TODO: trigger PDF generation + email/send here
      } else {
        alert("❌ Payment failed. Please try again.");
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert("Something went wrong with checkout.");
    }
  });
});
