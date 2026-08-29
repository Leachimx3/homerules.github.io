/* =========================================================
   Lógica de la plantilla: diapositivas horizontales + animaciones
   ========================================================= */

// --- Año actual en el footer ---
document.getElementById("year").textContent = new Date().getFullYear();

// --- Menú móvil ---
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

// --- Animaciones de aparición (IntersectionObserver dentro del deck) ---
const revealEls = document.querySelectorAll(".reveal");
const deckEl = document.getElementById("deck");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    });
  },
  { threshold: 0.1, root: deckEl }   /* el deck es el contenedor con scroll */
);
revealEls.forEach((el) => revealObserver.observe(el));

/* =========================================================
   CARRUSEL / DIAPOSITIVAS HORIZONTALES
   ========================================================= */
const deck = document.getElementById("deck");
const slides = Array.from(deck.querySelectorAll(".slide"));
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const dotsWrap = document.getElementById("deckDots");
const progress = document.getElementById("deckProgress");

let current = 0;

// --- Crear puntos indicadores ---
slides.forEach((slide, i) => {
  const dot = document.createElement("button");
  dot.className = "deck__dot";
  dot.setAttribute("role", "tab");
  dot.setAttribute("aria-label", `Ir a la diapositiva ${i + 1}`);
  dot.addEventListener("click", () => goTo(i));
  dotsWrap.appendChild(dot);
});
const dots = Array.from(dotsWrap.children);

// --- Ir a una diapositiva concreta ---
function goTo(index) {
  current = Math.max(0, Math.min(index, slides.length - 1));
  slides[current].scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  // El scroll dispara updateUI() vía el listener de scroll
}

// --- Actualizar puntos, flechas y barra de progreso ---
function updateUI() {
  dots.forEach((d, i) => d.classList.toggle("is-active", i === current));
  prevBtn.disabled = current === 0;
  nextBtn.disabled = current === slides.length - 1;
  progress.style.width = `${((current + 1) / slides.length) * 100}%`;
}

// --- Detectar la diapositiva visible al hacer scroll ---
let scrollTimer;
deck.addEventListener("scroll", () => {
  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(() => {
    const idx = Math.round(deck.scrollLeft / deck.clientWidth);
    if (idx !== current) current = idx;
    updateUI();
  }, 60);
});

// --- Flechas ---
prevBtn.addEventListener("click", () => goTo(current - 1));
nextBtn.addEventListener("click", () => goTo(current + 1));

// --- Teclado: flechas y RePág/AvPág ---
window.addEventListener("keydown", (e) => {
  if (["ArrowRight", "PageDown"].includes(e.key)) { goTo(current + 1); e.preventDefault(); }
  if (["ArrowLeft", "PageUp"].includes(e.key)) { goTo(current - 1); e.preventDefault(); }
  if (e.key === "Home") { goTo(0); e.preventDefault(); }
  if (e.key === "End") { goTo(slides.length - 1); e.preventDefault(); }
});

// --- Rueda del mouse: convierte scroll vertical en avance horizontal ---
let wheelLock = false;
deck.addEventListener(
  "wheel",
  (e) => {
    // Si la diapositiva tiene scroll vertical interno pendiente, deja pasar
    const slide = slides[current];
    const canScrollDown = slide.scrollTop + slide.clientHeight < slide.scrollHeight - 2;
    const canScrollUp = slide.scrollTop > 2;
    const goingDown = e.deltaY > 0;
    if ((goingDown && canScrollDown) || (!goingDown && canScrollUp)) return;

    e.preventDefault();
    if (wheelLock) return;
    if (Math.abs(e.deltaY) < 10) return;
    wheelLock = true;
    goTo(current + (goingDown ? 1 : -1));
    setTimeout(() => (wheelLock = false), 600);
  },
  { passive: false }
);

// --- Swipe táctil ---
let touchX = null;
deck.addEventListener("touchstart", (e) => (touchX = e.touches[0].clientX), { passive: true });
deck.addEventListener("touchend", (e) => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) goTo(current + (dx < 0 ? 1 : -1));
  touchX = null;
});

// --- Enlaces del menú y botones internos que apuntan a #id ---
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const id = link.getAttribute("href").slice(1);
    const target = document.getElementById(id);
    if (target && slides.includes(target)) {
      e.preventDefault();
      goTo(slides.indexOf(target));
    }
  });
});

// --- Estado inicial ---
updateUI();


/* =========================================================
   MODAL de casos reales (sección Problema)
   ========================================================= */
const casosModal = document.getElementById("casosModal");
const openCasos = document.getElementById("openCasos");

if (casosModal && openCasos) {
  const openModal = () => {
    casosModal.classList.add("is-open");
    casosModal.setAttribute("aria-hidden", "false");
  };
  const closeModal = () => {
    casosModal.classList.remove("is-open");
    casosModal.setAttribute("aria-hidden", "true");
  };

  openCasos.addEventListener("click", openModal);

  // Cerrar con la X o al hacer clic en el fondo (elementos con data-close)
  casosModal.querySelectorAll("[data-close]").forEach((el) => {
    el.addEventListener("click", closeModal);
  });

  // Cerrar con la tecla Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && casosModal.classList.contains("is-open")) closeModal();
  });
}
