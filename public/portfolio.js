// Portfolio page — dark-to-light transition + banner mouse-follow

// Dark-to-light at 50% scroll
(function () {
  const body = document.body;
  if (!body.classList.contains("page-portfolio")) return;

  const navbar = document.getElementById("site-navbar");

  function updateTheme() {
    const scrollY = window.scrollY || window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollY / docHeight : 0;

    if (progress >= 0.5) {
      body.classList.add("pw-light");
      // Swap navbar logo to black
      const logo = navbar && navbar.querySelector(".hero-nav__logo");
      if (logo && logo.src.includes("white")) {
        logo.src = logo.src.replace("white", "black");
      }
    } else {
      body.classList.remove("pw-light");
      // Swap navbar logo to white
      const logo = navbar && navbar.querySelector(".hero-nav__logo");
      if (logo && logo.src.includes("black")) {
        logo.src = logo.src.replace("black", "white");
      }
    }
  }

  window.addEventListener("scroll", updateTheme, { passive: true });
  updateTheme();
})();

// Banner follows mouse Y position within image
(function () {
  if (!document.body.classList.contains("page-portfolio")) return;

  const rows = document.querySelectorAll(".pw-row");

  rows.forEach((row) => {
    const media = row.querySelector(".pw-row__media");
    const banner = row.querySelector(".pw-row__banner");
    if (!media || !banner) return;

    media.addEventListener("mousemove", (e) => {
      const rect = media.getBoundingClientRect();
      const relY = e.clientY - rect.top;
      // Clamp banner within image bounds (with some padding)
      const bannerH = banner.offsetHeight || 24;
      const minY = 8;
      const maxY = rect.height - bannerH - 8;
      const clampedY = Math.max(minY, Math.min(relY - bannerH / 2, maxY));
      banner.style.top = clampedY + "px";
    });
  });
})();
