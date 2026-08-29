/* =========================================================
   Lógica de la plantilla: navegación, animaciones y galería
   ========================================================= */

// --- Año actual en el footer ---
document.getElementById("year").textContent = new Date().getFullYear();

// --- Menú móvil ---
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});
// Cerrar el menú al pulsar un enlace
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

// --- Ocultar/mostrar navbar al hacer scroll ---
const nav = document.getElementById("nav");
let lastScroll = 0;
window.addEventListener("scroll", () => {
  const current = window.scrollY;
  if (current > lastScroll && current > 120) {
    nav.classList.add("nav--hidden");
  } else {
    nav.classList.remove("nav--hidden");
  }
  lastScroll = current;
});

// --- Animaciones al hacer scroll (IntersectionObserver) ---
const revealEls = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealEls.forEach((el) => observer.observe(el));
