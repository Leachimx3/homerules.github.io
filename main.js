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
// Cada botón de advertencia abre su propio modal (botón -> id de modal)
const modalPairs = [
  { btn: "openCasos", modal: "casosModal" },
  { btn: "openCasosMovil", modal: "casosModalMovil" },
];

const openModal = (modal) => {
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
};
const closeModal = (modal) => {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
};

modalPairs.forEach(({ btn, modal }) => {
  const btnEl = document.getElementById(btn);
  const modalEl = document.getElementById(modal);
  if (!btnEl || !modalEl) return;

  btnEl.addEventListener("click", () => openModal(modalEl));

  // Cerrar con la X o al hacer clic en el fondo (elementos con data-close)
  modalEl.querySelectorAll("[data-close]").forEach((el) => {
    el.addEventListener("click", () => closeModal(modalEl));
  });
});

// Cerrar cualquier modal abierto con la tecla Escape
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  document.querySelectorAll(".modal.is-open").forEach((m) => closeModal(m));
});


/* =========================================================
   SOLUCIÓN: intro animada (frases) que da paso al contenido
   ========================================================= */
const solutionSlide = document.querySelector("[data-solution]");
const solIntro = document.getElementById("solIntro");
if (solutionSlide) {
  const TOTAL = 6200; // duración total de las 2 frases (ms), coincide con el CSS
  let timer = null;

  const finishIntro = () => {
    clearTimeout(timer);
    solutionSlide.classList.add("is-done");
  };

  const runIntro = () => {
    // Reinicia: quita is-done y reinicia las animaciones de las frases
    clearTimeout(timer);
    solutionSlide.classList.remove("is-done");
    if (solIntro) {
      solIntro.querySelectorAll(".sol-intro__phrase").forEach((el) => {
        el.style.animation = "none";
        void el.offsetWidth;      // fuerza reflow para reiniciar la animación
        el.style.animation = "";
      });
    }
    timer = setTimeout(finishIntro, TOTAL);
  };

  // Arranca (o reinicia) la secuencia cada vez que la diapositiva entra en vista
  const solObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) runIntro();
      });
    },
    { threshold: 0.5, root: document.getElementById("deck") }
  );
  solObserver.observe(solutionSlide);

  // Permitir saltar la intro con un clic
  if (solIntro) solIntro.addEventListener("click", finishIntro);
}
