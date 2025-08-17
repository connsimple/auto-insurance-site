/* ==============================
   Conn Simple — Phase 2 scripts
   ============================== */

// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navbar = document.querySelector('header');
menuToggle?.addEventListener('click', () => {
  navbar.classList.toggle('nav-open');
});

// Active nav highlighting (based on URL)
const navLinks = document.querySelectorAll('.nav-links a');
navLinks.forEach(link => {
  if (link.href === window.location.href) {
    link.classList.add('active');
  }
});

// Simple testimonial slider (manual)
let currentSlide = 0;
const dots = document.querySelectorAll('.dot');
const quotes = document.querySelectorAll('.testimonial-slider blockquote');

function showSlide(index) {
  quotes.forEach((q,i) => q.style.display = i === index ? 'block' : 'none');
  dots.forEach((d,i) => d.classList.toggle('active', i === index));
}
showSlide(currentSlide);

dots.forEach((dot,i) => {
  dot.addEventListener('click', () => {
    currentSlide = i;
    showSlide(currentSlide);
  });
});
