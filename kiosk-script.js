/* =========================================================
   EDIT THIS SECTION to point each tile at your real page/URL.
   Keys must match the data-key attributes in kiosk.html
   ========================================================= */
const LINKS = {
  faculty:      "https://cheryljoehub.github.io/fac2edition/",
  careerFinder: "career.html",       // the career finder quiz page
  jobs:         "https://cheryljoehub.github.io/posting_1edition/",
  wouldYouRather: "wyr.html",
  programs:     "degree.html"
};

/* ========================================================= */

function goBack() {
  window.history.back();
}

document.querySelectorAll(".tile").forEach(tile => {
  tile.addEventListener("click", () => {
    const key = tile.dataset.key;
    const url = LINKS[key];

    if (!url) {
      console.warn(`No link set for "${key}" yet. Edit LINKS in kiosk-script.js.`);
      return;
    }

    window.location.href = url;
  });
});

/* Simple live clock and date in the footer */
function updateClock() {
  const el = document.getElementById("clock");
  if (!el) return;
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const date = now.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
  el.textContent = `${time} • ${date}`;
}
updateClock();
setInterval(updateClock, 15000);
