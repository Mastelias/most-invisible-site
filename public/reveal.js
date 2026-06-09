// Heading reveal — slide every h1/h2/h3 up from a mask as it enters the
// viewport, matching the Services h1 feel. Light, transform-only, automatic
// (no manual line breaks). Pairs with reveal.css + the inline `reveal-on`
// class set in <head>.
(function () {
  var root = document.documentElement;

  // Respect reduced-motion: undo the pre-paint gate and show everything.
  if (!window.matchMedia || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    root.classList.remove("reveal-on");
    return;
  }

  try {
    // Headings we never touch (own entrance / sizing logic).
    var EXCLUDE = ".hero__display, .ct-hero__display";
    // Display headings with bespoke inner layout — animate without wrapping.
    var COMPLEX = ".pw-hero__display, .portfolio__title";

    var targets = [];
    var heads = document.querySelectorAll("h1, h2, h3");

    for (var i = 0; i < heads.length; i++) {
      var h = heads[i];
      if (h.matches(EXCLUDE)) continue;
      if (h.getAttribute("data-reveal") === "off") continue;
      if (h.classList.contains("reveal")) continue;

      if (h.matches(COMPLEX)) {
        h.classList.add("reveal", "reveal--simple");
      } else {
        var inner = document.createElement("span");
        inner.className = "reveal__inner";
        while (h.firstChild) inner.appendChild(h.firstChild);
        h.appendChild(inner);
        h.classList.add("reveal", "reveal--mask");
      }
      targets.push(h);
    }

    if (!("IntersectionObserver" in window)) {
      // No IO support — just reveal everything.
      targets.forEach(function (t) { t.classList.add("is-revealed"); });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-revealed");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

    targets.forEach(function (t) { io.observe(t); });
  } catch (err) {
    // On any failure, never leave headings hidden.
    root.classList.remove("reveal-on");
  }
})();
