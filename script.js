// ====== MOBILE NAVIGATION TOGGLE ======
document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".navbar");
  const toggle = document.createElement("button");
  toggle.innerText = "☰";
  toggle.classList.add("nav-toggle");
  document.querySelector(".header").prepend(toggle);

  toggle.addEventListener("click", () => {
    nav.classList.toggle("active");
  });
});

// ====== FORM VALIDATION ======
document.addEventListener("submit", (e) => {
  const form = e.target;

  // QUOTE FORM
  if (form.classList.contains("quote-form")) {
    const vin = form.querySelector("#vin").value.trim();
    if (vin.length < 11 || vin.length > 17) {
      alert("Please enter a valid VIN (11–17 characters).");
      e.preventDefault();
    }
  }

  // CONTACT FORM
  if (form.classList.contains("contact-form")) {
    const message = form.querySelector("#message").value.trim();
    if (message.length < 10) {
      alert("Message should be at least 10 characters.");
      e.preventDefault();
    }
  }
});

// ====== QUOTE PROGRESS BAR ======
document.addEventListener("input", () => {
  const form = document.querySelector(".quote-form");
  if (!form) return;

  const fields = form.querySelectorAll("input, select");
  const filled = [...fields].filter(f => f.value.trim() !== "").length;
  const progress = Math.round((filled / fields.length) * 100);

  let bar = document.querySelector(".progress-bar");
  if (!bar) {
    bar = document.createElement("div");
    bar.classList.add("progress-bar");
    form.prepend(bar);
  }
  bar.style.width = progress + "%";
  bar.innerText = progress + "% Complete";
});

// ====== SCROLL ANIMATIONS ======
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll(".content, .hero").forEach(section => {
  observer.observe(section);
});
