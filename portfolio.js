// ---- background video: some mobile browsers need a user gesture ----
document.addEventListener("touchstart", () => {
  const video = document.querySelector(".bc-video video");
  if (video) video.play();
}, { once: true });

// ---- typing effect on the hero heading ----
document.addEventListener("DOMContentLoaded", () => {
  const texts = [
    "Lakshya Makkar",
  ];

  const element = document.querySelector(".heading");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (element && reduceMotion) {
    element.textContent = "Lakshya Makkar";
  } else if (element) {
    let i = 0;
    let j = 0;
    const speed = 100;

    function typeEffect() {
      if (j < texts[i].length) {
        element.textContent = texts[i].slice(0, j + 1);
        j++;
        setTimeout(typeEffect, speed);
      } else {
        setTimeout(() => {
          j = 0;
          i = (i + 1) % texts.length;
          typeEffect();
        }, 1500);
      }
    }

    typeEffect();
  }

  // ---- footer year ----
  const copyright = document.querySelector(".copyright");
  if (copyright) {
    copyright.textContent = `© ${new Date().getFullYear()} Lakshya — All Rights Reserved`;
  }

  // ---- scroll progress / scrub bar ----
  const scrubFill = document.getElementById("scrubFill");
  const scrubHead = document.getElementById("scrubHead");

  function updateScrub() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (scrubFill) scrubFill.style.width = pct + "%";
    if (scrubHead) scrubHead.style.left = pct + "%";
  }
  updateScrub();
  window.addEventListener("scroll", updateScrub, { passive: true });
  window.addEventListener("resize", updateScrub);

  // ---- click-to-expand lightbox ----
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = document.getElementById("lightboxClose");
  let lastFocused = null;

  function openLightbox(img) {
    lastFocused = document.activeElement;
    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt || "";
    lightbox.hidden = false;
    lightboxClose.focus();
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImg.src = "";
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll(".expandable").forEach((img) => {
    img.addEventListener("click", () => openLightbox(img));
    img.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(img);
      }
    });
  });

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
  });

  // ---- gentle reveal-on-scroll for cards/chips ----
  if (!reduceMotion && "IntersectionObserver" in window) {
    const revealTargets = document.querySelectorAll(".card, .chip");
    revealTargets.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(16px)";
      el.style.transition = "opacity .5s ease, transform .5s ease";
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealTargets.forEach((el) => observer.observe(el));
  }
});
