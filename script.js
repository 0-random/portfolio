const intro = document.getElementById("intro");
const year = document.getElementById("year");
const revealEls = document.querySelectorAll(".reveal");

if (year) {
  year.textContent = String(new Date().getFullYear());
}

window.addEventListener("load", () => {
  window.setTimeout(() => {
    intro?.classList.add("intro--done");
  }, 1500);
});

if (!("IntersectionObserver" in window)) {
  revealEls.forEach((el) => el.classList.add("visible"));
} else {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          continue;
        }

        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    },
    {
      threshold: 0.18,
    }
  );

  revealEls.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 70, 280)}ms`;
    observer.observe(el);
  });
}
