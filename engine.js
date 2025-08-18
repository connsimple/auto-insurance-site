// engine.js

document.addEventListener("DOMContentLoaded", () => {
  const quoteForm = document.getElementById("quoteForm");
  const quoteSection = document.getElementById("quote");

  if (quoteForm) {
    quoteForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const state = document.getElementById("state").value;
      const plan = document.querySelector('input[name="plan"]:checked')?.value;
      const coverage = document.getElementById("coverage").value;

      if (!name || !email || !state || !plan || !coverage) {
        alert("Please fill in all fields.");
        return;
      }

      // Simple pricing logic (you can adjust numbers)
      let basePrice = plan === "6-month" ? 300 : 550;

      if (coverage === "standard") basePrice += 100;
      if (coverage === "premium") basePrice += 200;

      // Remove old results if they exist
      const oldResult = document.getElementById("quoteResult");
      if (oldResult) oldResult.remove();

      // Create results box
      const resultDiv = document.createElement("div");
      resultDiv.id = "quoteResult";
      resultDiv.style.marginTop = "2rem";
      resultDiv.style.padding = "1.5rem";
      resultDiv.style.border = "1px solid #ccc";
      resultDiv.style.borderRadius = "8px";
      resultDiv.style.background = "#f9f9f9";

      resultDiv.innerHTML = `
        <h3>Your Quote Results</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Plan:</strong> ${plan}</p>
        <p><strong>Coverage:</strong> ${coverage}</p>
        <p><strong>Total Price:</strong> $${basePrice}</p>
        <button id="proceedPayment" style="padding: 0.8rem 1.2rem; background:#004aad; color:white; border:none; cursor:pointer; border-radius:5px;">Proceed to Payment</button>
      `;

      quoteSection.appendChild(resultDiv);

      // Payment button event
      document.getElementById("proceedPayment").addEventListener("click", () => {
        alert("Redirecting to payment... (hook PayPal/Stripe here)");
        // Example: window.location.href = "/payment";
      });
    });
  }
});
