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

// Line-by-line reveal for the work lede paragraph
(function () {
  const el = document.getElementById("work-lede");
  if (!el) return;

  // Split text into words, wrap each word in a span
  const text = el.textContent.trim();
  const words = text.split(/\s+/);
  el.innerHTML = "";
  el.style.display = "inline";

  // We'll group words into visual lines after layout
  const spans = words.map((w) => {
    const s = document.createElement("span");
    s.textContent = w + " ";
    s.style.display = "inline";
    el.appendChild(s);
    return s;
  });

  // Group spans by visual line (same offsetTop)
  function getLines() {
    const lines = [];
    let currentLine = [];
    let currentTop = null;
    spans.forEach((s) => {
      const top = s.getBoundingClientRect().top;
      if (currentTop === null || Math.abs(top - currentTop) < 4) {
        currentLine.push(s);
        if (currentTop === null) currentTop = top;
      } else {
        lines.push(currentLine);
        currentLine = [s];
        currentTop = top;
      }
    });
    if (currentLine.length) lines.push(currentLine);
    return lines;
  }

  // Wrap each visual line in a container span for opacity control
  function wrapLines() {
    const lines = getLines();
    el.innerHTML = "";
    el.style.display = "";
    return lines.map((lineSpans) => {
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

  let lineWrappers = wrapLines();

  // Re-wrap on resize
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Unwrap back to raw words
      el.innerHTML = "";
      el.style.display = "inline";
      spans.forEach((s) => el.appendChild(s));
      lineWrappers = wrapLines();
      updateOpacities();
    }, 200);
  });

  function updateOpacities() {
    const viewH = window.innerHeight;
    lineWrappers.forEach((wrapper) => {
      const rect = wrapper.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      // Reveal zone: tighter — lines only fully reveal in the middle of viewport
      const start = viewH * 0.15;
      const end = viewH * 0.55;
      let progress;
      if (center < start) {
        progress = 1 - Math.min((start - center) / (viewH * 0.3), 1);
      } else if (center > end) {
        progress = 1 - Math.min((center - end) / (viewH * 0.3), 1);
      } else {
        progress = 1;
      }
      const opacity = 0.25 + 0.75 * Math.max(0, Math.min(1, progress));
      wrapper.style.opacity = opacity;
    });
  }

  window.addEventListener("scroll", updateOpacities, { passive: true });
  updateOpacities();
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
