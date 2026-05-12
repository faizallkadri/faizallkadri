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

/* ── Activity Gallery Slider ── */
(function () {
  const stage = document.getElementById("galleryStage");
  const title = document.getElementById("galleryTitle");
  const text = document.getElementById("galleryText");
  const main = document.getElementById("galleryMain");
  const top = document.getElementById("galleryTop");
  const side = document.getElementById("gallerySide");
  const fourth = document.getElementById("galleryFourth");
  const prev = document.getElementById("galleryPrev");
  const next = document.getElementById("galleryNext");
  const progress = document.querySelectorAll(".gallery-progress span");
  const lightbox = document.getElementById("galleryLightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxCounter = document.getElementById("lightboxCounter");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");

  if (!stage || !title || !main || !top || !side || !fourth) return;

  const slides = [
    {
      title: "Gathering ABC Express 2025.",
      text: "Kegiatan mempererat kekompakan dan solidaritas untuk menyatukan visi dan misi.",
      images: [
        ["gallery-abc-gathering-2025-1.jpg", "Foto bersama Gathering ABC Express 2025"],
        ["gallery-abc-gathering-2025-2.jpg", "Aktivitas team building Gathering ABC Express 2025"],
        ["gallery-abc-gathering-2025-3.jpg", "Dokumentasi kebersamaan Gathering ABC Express 2025"],
        ["gallery-abc-gathering-2025-4.jpg", "Momen peserta Gathering ABC Express 2025"]
      ]
    },
    {
      title: "Momen belajar, berbagi, dan bertumbuh bersama.",
      text: "Galeri ini dapat kamu isi dengan dokumentasi onboarding, sesi pengembangan karyawan, atau aktivitas komunitas yang relevan dengan HR dan karier.",
      images: [
        ["https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1000&q=80", "Kegiatan meeting tim"],
        ["https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=900&q=80", "Koordinasi kerja profesional"],
        ["https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80", "Kolaborasi lintas fungsi"],
        ["https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=900&q=80", "Diskusi tim profesional"]
      ]
    },
    {
      title: "Cerita visual di balik proses people development.",
      text: "Tambahkan foto kegiatan nyata agar pengunjung melihat pengalaman, suasana kerja, dan pendekatan human-first yang kamu bawa.",
      images: [
        ["https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=80", "Sesi kolaborasi profesional"],
        ["https://images.unsplash.com/photo-1573497491208-6b1acb260507?auto=format&fit=crop&w=900&q=80", "Diskusi pengembangan karier"],
        ["https://images.unsplash.com/photo-1558403194-611308249627?auto=format&fit=crop&w=900&q=80", "Sesi sharing bersama tim"],
        ["https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80", "Workshop pengembangan tim"]
      ]
    }
  ];

  let current = 0;
  let lightboxIndex = 0;
  let autoplayTimer;

  function render(index) {
    current = (index + slides.length) % slides.length;
    const slide = slides[current];
    title.textContent = slide.title;
    text.textContent = slide.text;
    [main, top, side, fourth].forEach((img, i) => {
      img.src = slide.images[i][0];
      img.alt = slide.images[i][1];
    });
    progress.forEach((bar, i) => bar.classList.toggle("active", i === current));
  }

  function restartAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(() => render(current + 1), 10000);
  }

  function navigate(index) {
    render(index);
    restartAutoplay();
  }

  function currentImages() {
    return slides[current].images;
  }

  function openLightbox(index) {
    if (!lightbox || !lightboxImage || !lightboxCounter) return;
    lightboxIndex = index;
    const image = currentImages()[lightboxIndex];
    lightboxImage.src = image[0];
    lightboxImage.alt = image[1];
    lightboxCounter.textContent = (lightboxIndex + 1) + " / " + currentImages().length;
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function moveLightbox(step) {
    openLightbox((lightboxIndex + step + currentImages().length) % currentImages().length);
  }

  if (prev) prev.addEventListener("click", () => navigate(current - 1));
  if (next) next.addEventListener("click", () => navigate(current + 1));

  [main, top, side, fourth].forEach((img, index) => {
    img.addEventListener("click", () => openLightbox(index));
  });

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener("click", () => moveLightbox(-1));
  if (lightboxNext) lightboxNext.addEventListener("click", () => moveLightbox(1));
  if (lightbox) {
    lightbox.addEventListener("click", e => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  let startX = 0;
  stage.addEventListener("touchstart", e => { startX = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener("touchend", e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) navigate(diff > 0 ? current + 1 : current - 1);
  });

  window.addEventListener("keydown", e => {
    if (!lightbox || !lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") moveLightbox(-1);
    if (e.key === "ArrowRight") moveLightbox(1);
  });

  render(0);
  restartAutoplay();
})();
