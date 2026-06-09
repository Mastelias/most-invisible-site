// ─────────────────────────────────────────────────────────────────────────
// Site-wide client behaviour. All scroll/reveal animation lives here so there
// is a single shared line-splitter and no duplicated logic.
// ─────────────────────────────────────────────────────────────────────────

// Live clock in Montréal time (UTC−05:00), shown in the nav.
(function () {
  const el = document.getElementById("clock");
  if (!el) return;
  const fmt = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Toronto",
    hour12: false,
  });
  const tick = () => { el.textContent = `MTL · ${fmt.format(new Date())}`; };
  tick();
  setInterval(tick, 15000);
})();

// ── Line-by-line text reveals (shared helper) ──
// Both the work-lede (scroll-linked) and info-lede (entrance) reveals split a
// paragraph into visual lines. That splitting lives here once and is reused.
(function () {
  // Wrap each word in an inline span, measure, and group spans by visual line.
  // Leaves `el` emptied and ready for the caller to append line wrappers.
  function groupIntoLines(el) {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = "";
    el.style.display = "inline";

    const spans = words.map((w) => {
      const s = document.createElement("span");
      s.textContent = w + " ";
      s.style.display = "inline";
      el.appendChild(s);
      return s;
    });

    const lines = [];
    let current = [];
    let top = null;
    spans.forEach((s) => {
      const t = s.getBoundingClientRect().top;
      if (top === null || Math.abs(t - top) < 4) {
        current.push(s);
        if (top === null) top = t;
      } else {
        lines.push(current);
        current = [s];
        top = t;
      }
    });
    if (current.length) lines.push(current);

    el.innerHTML = "";
    el.style.display = "";
    return lines;
  }

  // Work lede — lines brighten as they pass through the middle of the viewport.
  (function () {
    const el = document.getElementById("work-lede");
    if (!el) return;

    function build() {
      return groupIntoLines(el).map((lineSpans) => {
        const wrapper = document.createElement("span");
        wrapper.style.display = "block";
        wrapper.style.opacity = "0.25";
        wrapper.style.transition = "opacity 0.5s ease-out";
        wrapper.style.willChange = "opacity";
        lineSpans.forEach((s) => wrapper.appendChild(s));
        el.appendChild(wrapper);
        return wrapper;
      });
    }

    let lineWrappers = build();

    function updateOpacities() {
      const viewH = window.innerHeight;
      lineWrappers.forEach((wrapper) => {
        const rect = wrapper.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const start = viewH * 0.15;
        const end = viewH * 0.55;
        let progress;
        if (center < start) progress = 1 - Math.min((start - center) / (viewH * 0.3), 1);
        else if (center > end) progress = 1 - Math.min((center - end) / (viewH * 0.3), 1);
        else progress = 1;
        wrapper.style.opacity = 0.25 + 0.75 * Math.max(0, Math.min(1, progress));
      });
    }

    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        lineWrappers = build();
        updateOpacities();
      }, 200);
    });

    window.addEventListener("scroll", updateOpacities, { passive: true });
    updateOpacities();
  })();

  // Info lede — one-shot slide-up entrance, line by line, plus the body below.
  (function () {
    const lede = document.getElementById("info-lede");
    if (!lede) return;
    const body = document.getElementById("info-body");

    function build() {
      groupIntoLines(lede).forEach((lineSpans, i) => {
        const outer = document.createElement("span");
        outer.className = "info-statement__line";
        const inner = document.createElement("span");
        inner.style.display = "block";
        inner.style.transform = "translateY(110%)";
        inner.style.opacity = "0";
        inner.style.animation = "infoSlideUp 1.2s var(--ease-out) forwards";
        inner.style.animationDelay = (0.15 + i * 0.15) + "s";
        lineSpans.forEach((s) => inner.appendChild(s));
        outer.appendChild(inner);
        lede.appendChild(outer);
      });
      lede.style.opacity = "1";

      if (body) {
        body.style.transform = "translateY(20px)";
        body.style.opacity = "0";
        body.style.animation = "infoSlideUp 1.2s var(--ease-out) forwards";
        body.style.animationDelay = (0.15 + lede.children.length * 0.15) + "s";
      }
    }

    build();

    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(build, 200);
    });
  })();
})();

// Portfolio color inversion on scroll
(function () {
  const portfolio = document.querySelector(".portfolio");
  if (!portfolio) return;

  portfolio.style.transition = "background-color 0.4s ease, color 0.4s ease";

  function updateInversion() {
    const rect = portfolio.getBoundingClientRect();
    const sectionH = rect.height;
    const viewH = window.innerHeight;

    // How far we've scrolled into the section (0 = top just entered, 1 = fully past)
    const scrolled = (viewH - rect.top) / sectionH;

    if (scrolled >= 0.6) {
      portfolio.style.backgroundColor = "#101010";
      portfolio.style.color = "var(--light)";
      portfolio.querySelectorAll(".portfolio__label").forEach(l => l.style.color = "rgba(255,255,255,0.55)");
      portfolio.querySelector(".portfolio__title").style.color = "var(--light)";
    } else {
      portfolio.style.backgroundColor = "";
      portfolio.style.color = "";
      portfolio.querySelectorAll(".portfolio__label").forEach(l => l.style.color = "");
      portfolio.querySelector(".portfolio__title").style.color = "";
    }
  }

  window.addEventListener("scroll", updateInversion, { passive: true });
  updateInversion();
})();

// About section — dark to light transition on scroll into capabilities
(function () {
  const section = document.querySelector(".about");
  const capIntro = document.querySelector(".capabilities__intro");
  if (!section || !capIntro) return;

  function updateAboutTransition() {
    const rect = capIntro.getBoundingClientRect();
    const viewH = window.innerHeight;

    if (rect.top < viewH * 0.7) {
      section.style.backgroundColor = "var(--light)";
      section.style.color = "var(--dark)";
      section.querySelectorAll(".capabilities__lead").forEach(el => el.style.color = "var(--dark)");
      section.querySelectorAll(".capabilities__label").forEach(el => el.style.color = "var(--dark)");
      section.querySelectorAll(".capabilities__list li").forEach(el => {
        el.style.color = "var(--dark)";
        el.style.borderColor = "rgba(0,0,0,0.12)";
      });
      section.querySelectorAll(".capabilities__num").forEach(el => el.style.color = "rgba(0,0,0,0.4)");
    } else {
      section.style.backgroundColor = "";
      section.style.color = "";
      section.querySelectorAll(".capabilities__lead").forEach(el => el.style.color = "");
      section.querySelectorAll(".capabilities__label").forEach(el => el.style.color = "");
      section.querySelectorAll(".capabilities__list li").forEach(el => {
        el.style.color = "";
        el.style.borderColor = "";
      });
      section.querySelectorAll(".capabilities__num").forEach(el => el.style.color = "");
    }
  }

  window.addEventListener("scroll", updateAboutTransition, { passive: true });
  updateAboutTransition();
})();

// Heading reveal — slide every h1/h2/h3 up from a mask as it enters view.
// Light, transform-only, automatic (no manual line breaks). Pairs with
// reveal.css and the inline `reveal-on` class set in <head>.
(function () {
  const root = document.documentElement;

  // Respect reduced-motion: undo the pre-paint gate and show everything.
  if (!window.matchMedia || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    root.classList.remove("reveal-on");
    return;
  }

  try {
    const EXCLUDE = ".hero__display, .ct-hero__display";   // own entrance/sizing logic
    const COMPLEX = ".pw-hero__display, .portfolio__title"; // bespoke layout — don't wrap

    const targets = [];
    document.querySelectorAll("h1, h2, h3").forEach((h) => {
      if (h.matches(EXCLUDE)) return;
      if (h.getAttribute("data-reveal") === "off") return;
      if (h.classList.contains("reveal")) return;

      if (h.matches(COMPLEX)) {
        h.classList.add("reveal", "reveal--simple");
      } else {
        const inner = document.createElement("span");
        inner.className = "reveal__inner";
        while (h.firstChild) inner.appendChild(h.firstChild);
        h.appendChild(inner);
        h.classList.add("reveal", "reveal--mask");
      }
      targets.push(h);
    });

    if (!("IntersectionObserver" in window)) {
      targets.forEach((t) => t.classList.add("is-revealed"));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-revealed");
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });

    targets.forEach((t) => io.observe(t));
  } catch (err) {
    root.classList.remove("reveal-on"); // never leave headings hidden
  }
})();

// Custom crosshair cursor with X/Y coordinates (desktop only)
(function () {
  if (window.matchMedia("(pointer: coarse)").matches) return;

  // Hide default cursor
  document.documentElement.style.cursor = "none";

  // Create elements
  const lineH = document.createElement("div");
  const lineV = document.createElement("div");
  const coords = document.createElement("div");

  const shared = {
    position: "fixed",
    pointerEvents: "none",
    zIndex: "99999",
    background: "rgba(255,255,255,0.22)",
    mixBlendMode: "difference",
  };

  Object.assign(lineH.style, shared, {
    top: "0", left: "0",
    width: "100vw", height: "1px",
    transform: "translateY(0)",
  });

  Object.assign(lineV.style, shared, {
    top: "0", left: "0",
    width: "1px", height: "100vh",
    transform: "translateX(0)",
  });

  Object.assign(coords.style, {
    position: "fixed",
    pointerEvents: "none",
    zIndex: "99999",
    fontFamily: "var(--font-mono, monospace)",
    fontSize: "9px",
    letterSpacing: "0.06em",
    color: "rgba(255,255,255,0.7)",
    mixBlendMode: "difference",
    padding: "6px 8px",
    whiteSpace: "nowrap",
  });

  // Center cross — bold 2px lines, 8px each direction
  const crossH = document.createElement("div");
  const crossV = document.createElement("div");
  const crossShared = {
    position: "fixed",
    pointerEvents: "none",
    zIndex: "99999",
    background: "rgba(255,255,255,0.9)",
    mixBlendMode: "difference",
  };
  Object.assign(crossH.style, crossShared, {
    width: "16px", height: "2px",
    transform: "translate(-8px, -1px)",
  });
  Object.assign(crossV.style, crossShared, {
    width: "2px", height: "16px",
    transform: "translate(-1px, -8px)",
  });

  document.body.appendChild(lineH);
  document.body.appendChild(lineV);
  document.body.appendChild(coords);
  document.body.appendChild(crossH);
  document.body.appendChild(crossV);

  let mx = -100, my = -100;

  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    lineH.style.transform = "translateY(" + my + "px)";
    lineV.style.transform = "translateX(" + mx + "px)";
    crossH.style.left = mx + "px";
    crossH.style.top = my + "px";
    crossV.style.left = mx + "px";
    crossV.style.top = my + "px";
    coords.style.left = (mx + 14) + "px";
    coords.style.top = (my + 14) + "px";
    coords.textContent = "X : " + Math.round(mx) + "  Y : " + Math.round(my);
  });

  document.addEventListener("mouseleave", () => {
    lineH.style.opacity = "0";
    lineV.style.opacity = "0";
    coords.style.opacity = "0";
    crossH.style.opacity = "0";
    crossV.style.opacity = "0";
  });

  document.addEventListener("mouseenter", () => {
    lineH.style.opacity = "1";
    lineV.style.opacity = "1";
    coords.style.opacity = "1";
    crossH.style.opacity = "1";
    crossV.style.opacity = "1";
  });

  // Ensure all interactive elements still show pointer
  const style = document.createElement("style");
  style.textContent = "a, button, [role='button'], input, select, textarea, label, [onclick] { cursor: none !important; }";
  document.head.appendChild(style);
})();
