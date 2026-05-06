/* ── Header scroll state ── */
const header = document.querySelector(".site-header");

const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

updateHeader();
window.addEventListener("load", updateHeader);
window.addEventListener("hashchange", updateHeader);
window.addEventListener("scroll", updateHeader);

/* ── Insight Carousel ── */
(function () {
  const track    = document.getElementById("carouselTrack");
  const dotsWrap = document.getElementById("carouselDots");
  const prevBtn  = document.getElementById("prevBtn");
  const nextBtn  = document.getElementById("nextBtn");

  if (!track) return;

  const cards = Array.from(track.children);
  let current = 0;

  function visibleCount() {
    if (window.innerWidth <= 680)  return 1;
    if (window.innerWidth <= 980)  return 2;
    return 3;
  }

  function totalSlides() {
    return Math.max(1, cards.length - visibleCount() + 1);
  }

  function buildDots() {
    dotsWrap.innerHTML = "";
    for (let i = 0; i < totalSlides(); i++) {
      const btn = document.createElement("button");
      btn.className = "carousel-dot" + (i === current ? " active" : "");
      btn.setAttribute("aria-label", "Slide " + (i + 1));
      btn.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(btn);
    }
  }

  function goTo(index) {
    current = Math.max(0, Math.min(index, totalSlides() - 1));
    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = 18;
    track.style.transform = "translateX(-" + (current * (cardWidth + gap)) + "px)";

    dotsWrap.querySelectorAll(".carousel-dot").forEach((d, i) => {
      d.classList.toggle("active", i === current);
    });

    if (prevBtn) prevBtn.disabled = current === 0;
    if (nextBtn) nextBtn.disabled = current >= totalSlides() - 1;
  }

  if (prevBtn) prevBtn.addEventListener("click", () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => goTo(current + 1));

  let startX = 0;
  track.addEventListener("touchstart", e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener("touchend", e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
  });

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      buildDots();
      goTo(Math.min(current, totalSlides() - 1));
    }, 120);
  });

  buildDots();
  goTo(0);
})();
