// Mobile nav toggle
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".navbar");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.style.display = nav.style.display === "flex" ? "none" : "flex";
      nav.style.flexDirection = "column";
      nav.style.gap = "10px";
      nav.style.marginLeft = "0";
      nav.style.background = "rgba(0,0,0,0.15)";
      nav.style.padding = "10px";
      nav.style.borderRadius = "8px";
    });
  }
});

// Quote form validation + progress
(function(){
  const form = document.querySelector(".quote-form");
  if(!form) return;

  const fields = Array.from(form.querySelectorAll("input, select, textarea"));
  const bar = form.querySelector(".progress-bar");

  function progress(){
    const filled = fields.filter(f => (f.type === "file") ? f.files.length > 0 : f.value.trim() !== "").length;
    const pct = Math.round((filled / fields.length) * 100);
    if (bar){
      bar.style.width = Math.max(5, pct) + "%";
      bar.textContent = pct + "% Complete";
    }
  }

  fields.forEach(f => {
    f.addEventListener("input", progress);
    f.addEventListener("change", progress);
  });
  progress();

  form.addEventListener("submit", (e) => {
    const vin = form.querySelector("#vin")?.value.trim() || "";
    if (vin.length < 11 || vin.length > 17){
      alert("Please enter a valid VIN (11–17 characters).");
      e.preventDefault();
      return;
    }
    const dl = form.querySelector("#dl")?.value.trim() || "";
    if (dl.length < 3){
      alert("Please enter a valid Driver License number.");
      e.preventDefault();
      return;
    }
    const file = form.querySelector("#license");
    if (!file || file.files.length === 0){
      alert("Please upload a photo or PDF of your driver’s license.");
      e.preventDefault();
      return;
    }
  });
})();

// Simple scroll reveal
const reveal = (els) => {
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) en.target.classList.add("reveal");
    });
  }, {threshold: 0.15});
  els.forEach(el => io.observe(el));
};
document.addEventListener("DOMContentLoaded", () => {
  reveal(document.querySelectorAll(".card, .t-card, .stat, .hero-inner, .content"));
});
