/* ============================================================
   IDLE SCREENSAVER SETTINGS
   Tweak these two numbers to change behavior.
   ============================================================ */

const IDLE_TIMEOUT_MS = 25000;   // how long with no touch before it appears (25s)
const SLIDE_INTERVAL_MS = 15000;  // how long each slide stays up (15s)

/* ============================================================
   CONTENT BANK
   Mix of quotes, fun facts, and calls-to-action. Add, remove, or
   edit freely — the rotation adjusts automatically.
   Each item is one of:
     { type: "quote", text, author }
     { type: "fact",  text }
     { type: "cta",   title, sub }
   ============================================================ */

const SLIDES = [
  { type: "image", src: "images/logos/7.png", alt: "College of Business logo" },
  { type: "image", src: "images/logos/8.png", alt: "College of Business logo" },
  { type: "image", src: "images/logos/9.png", alt: "College of Business logo" },
  { type: "cta", title: "Tap a Tile to Get Started", sub: "Career Finder, Job Postings, Faculty, and more" },
  { type: "fact", text: "The average successful founder is 45 years old when starting their breakout company \u2014 not in their early 20s." },
  { type: "quote", text: "It is not the strongest that survive, but those most responsive to change.", author: "Often attributed to Charles Darwin" },
  { type: "fact", text: "There are over 200 distinct career paths within a typical College of Business \u2014 far more than finance, marketing, and accounting alone." },
  { type: "quote", text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
  { type: "quote", text: "Price is what you pay. Value is what you get.", author: "Warren Buffett" },
  { type: "quote", text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
  { type: "cta", title: "New Jobs Posted Every Monday", sub: "Check the Job Opportunities tile for this week's openings" }
];

/* ============================================================
   RENDER + IDLE-DETECTION LOGIC — no need to touch below this line
   ============================================================ */

let idleTimer = null;
let slideTimer = null;
let currentSlide = 0;
let overlay, contentEl, dotsEl;

function buildSlideHTML(slide) {
  if (slide.type === "image") {
    return `<img class="ss-image" src="${slide.src}" alt="${slide.alt}">`;
  }
  if (slide.type === "quote") {
    return `
      <p class="ss-quote">&ldquo;${slide.text}&rdquo;</p>
      <p class="ss-author">&mdash; ${slide.author}</p>
    `;
  }
  if (slide.type === "fact") {
    return `
      <p class="ss-fact-label">Did You Know</p>
      <p class="ss-quote">${slide.text}</p>
    `;
  }
  // cta
  return `
    <p class="ss-cta-title">${slide.title}</p>
    <p class="ss-cta-sub">${slide.sub}</p>
  `;
}

function buildDots() {
  dotsEl.innerHTML = SLIDES.map((_, i) =>
    `<span class="ss-dot${i === currentSlide ? " active" : ""}"></span>`
  ).join("");
}

function showSlide(index) {
  currentSlide = index;
  contentEl.classList.remove("in");
  overlay.classList.toggle("image-slide", SLIDES[currentSlide].type === "image");
  setTimeout(() => {
    contentEl.innerHTML = buildSlideHTML(SLIDES[currentSlide]);
    buildDots();
    // force reflow so the transition replays
    void contentEl.offsetWidth;
    contentEl.classList.add("in");
  }, 250);
}

function shuffleSlides() {
  for (let index = SLIDES.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [SLIDES[index], SLIDES[randomIndex]] = [SLIDES[randomIndex], SLIDES[index]];
  }
}

function startSlideshow() {
  shuffleSlides();
  showSlide(0);
  slideTimer = setInterval(() => {
    const next = (currentSlide + 1) % SLIDES.length;
    showSlide(next);
  }, SLIDE_INTERVAL_MS);
}

function stopSlideshow() {
  clearInterval(slideTimer);
  slideTimer = null;
}

function showScreensaver() {
  overlay.classList.add("visible");
  overlay.setAttribute("aria-hidden", "false");
  startSlideshow();
}

function hideScreensaver() {
  overlay.classList.remove("visible");
  overlay.setAttribute("aria-hidden", "true");
  stopSlideshow();
}

function resetIdleTimer() {
  clearTimeout(idleTimer);
  if (overlay.classList.contains("visible")) {
    hideScreensaver();
  }
  idleTimer = setTimeout(showScreensaver, IDLE_TIMEOUT_MS);
}

function init() {
  overlay = document.getElementById("screensaver");
  contentEl = document.getElementById("ss-content");
  dotsEl = document.getElementById("ss-dots");

  // any interaction resets the idle clock and dismisses the screensaver
  ["touchstart", "mousedown", "mousemove", "keydown", "click"].forEach(evt => {
    document.addEventListener(evt, resetIdleTimer, { passive: true });
  });

  resetIdleTimer();
}

init();
