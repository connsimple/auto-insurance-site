// Navbar highlighting
const currentPage = window.location.pathname.split("/").pop();
document.querySelectorAll(".nav-links a").forEach(link => {
  if(link.getAttribute("href") === currentPage) {
    link.classList.add("active");
  }
});

// Quote form handler
const quoteForm = document.getElementById("quoteForm");
if (quoteForm) {
  quoteForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const coverage = this.querySelector("select").value;
    let price = 0;
    if (coverage === "basic") price = 80;
    if (coverage === "standard") price = 120;
    if (coverage === "premium") price = 180;
    document.getElementById("quoteResult").innerText = 
      `Estimated Monthly Price: $${price}`;
  });
}

// Contact form handler
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", function(e) {
    e.preventDefault();
    alert("Thank you for contacting Conn Simple! We will respond soon.");
    contactForm.reset();
  });
}
