const intro = document.getElementById("intro");
const year = document.getElementById("year");
const revealEls = document.querySelectorAll(".reveal");
const clipIframes = document.querySelectorAll('.clip-card iframe[src*="youtube.com/embed/"]');

if (year) {
  year.textContent = String(new Date().getFullYear());
}

if (clipIframes.length > 0) {
  if (window.location.protocol === "file:") {
    clipIframes.forEach((iframe) => {
      const match = iframe.src.match(/\/embed\/([^?&/]+)/);
      const videoId = match ? match[1] : "";

      const fallback = document.createElement("div");
      fallback.className = "clip-fallback";

      if (videoId) {
        const link = document.createElement("a");
        link.className = "clip-fallback__link";
        link.href = `https://www.youtube.com/watch?v=${videoId}`;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "Open clip on YouTube";
        fallback.appendChild(link);
      } else {
        fallback.textContent = "Video preview unavailable in local file mode.";
      }

      iframe.replaceWith(fallback);
    });
  } else {
    clipIframes.forEach((iframe) => {
      try {
        const url = new URL(iframe.src);
        if (!url.searchParams.has("origin")) {
          url.searchParams.set("origin", window.location.origin);
          iframe.src = url.toString();
        }
      } catch {
        // Keep the existing src when URL parsing fails.
      }
    });
  }
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
