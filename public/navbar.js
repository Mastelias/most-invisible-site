// Shared navbar component — include on every page
// Usage: <div id="site-navbar"></div>
// Then: <script src="navbar.js"></script>
//
// Uses mix-blend-mode: difference (in CSS) so text/logo
// automatically inverts over any background.
(function () {
  const container = document.getElementById("site-navbar");
  if (!container) return;

  const n = parseInt(container.dataset.workCount || "0", 10);
  const count = n ? "[" + String(n).padStart(2, "0") + "]" : "";

  container.innerHTML = `
    <header class="hero-nav" data-screen-label="Nav">
      <a class="hero-nav__mark" href="/" aria-label="Most Invisible home">
        <img src="/assets/logo-horizontal-white.svg" alt="Most Invisible" class="hero-nav__logo" style="width: 150px; height: 48px; object-fit: contain" />
      </a>
      <a class="hero-nav__link" href="/work">
        Selected work <span class="hero-nav__count">${count}</span>
      </a>
      <span class="hero-nav__link hero-nav__link-group">
        <a href="/info">Services</a>, <a href="/blog">blog</a>, <a href="/contact">contact</a>
      </span>
      <a class="hero-nav__link hero-nav__link--right" href="mailto:contact@mostinvisible.com">
        contact@mostinvisible.com
      </a>
      <button class="hero-nav__burger" aria-label="Open menu" aria-expanded="false">
        <span></span><span></span>
      </button>
    </header>

    <nav class="mobile-menu" id="mobile-menu" aria-hidden="true">
      <div class="mobile-menu__inner">
        <a class="mobile-menu__link" href="/">Home</a>
        <a class="mobile-menu__link" href="/work">Selected work</a>
        <a class="mobile-menu__link" href="/info">Info</a>
        <a class="mobile-menu__link" href="/blog">Blog</a>
        <a class="mobile-menu__link" href="/contact">Contact</a>
      </div>
    </nav>
  `;

  // ── Hamburger toggle ──
  const burger = container.querySelector(".hero-nav__burger");
  const menu = container.querySelector("#mobile-menu");

  // Move the menu out of #site-navbar (which uses mix-blend-mode: difference)
  // so its semi-transparent background renders normally instead of being
  // cancelled out by the blend mode.
  if (menu) document.body.appendChild(menu);

  function openMenu() {
    burger.setAttribute("aria-expanded", "true");
    menu.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeMenu() {
    burger.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  burger.addEventListener("click", () => {
    burger.getAttribute("aria-expanded") === "true" ? closeMenu() : openMenu();
  });

  menu.querySelectorAll(".mobile-menu__link").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && burger.getAttribute("aria-expanded") === "true") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) closeMenu();
  });
})();
