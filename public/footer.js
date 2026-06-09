// Shared footer component — include on every page
// Usage: <div id="site-footer"></div>
// Then: <script src="footer.js"></script>
(function () {
  const container = document.getElementById("site-footer");
  if (!container) return;

  container.innerHTML = `
  <footer class="footer" id="contact" data-screen-label="07 Footer" data-nav-theme="light">
    <div class="footer__brand">
      <h2 class="footer__logo">Most Invisible<sup class="footer__reg">&reg;</sup></h2>
    </div>

    <div class="footer__nav">
      <div class="footer__nav-col">
        <a href="/">Home</a>
        <a href="/work">Selected Work (06)</a>
      </div>
      <div class="footer__nav-col">
        <a href="/info">Services</a>
        <a href="/blog">Blog</a>
        <a href="/contact">Contact</a>
      </div>
      <div class="footer__nav-col">
        <a href="#">Instagram</a>
        <a href="#">LinkedIn</a>
        <a href="#">Etsy</a>
      </div>
      <div class="footer__nav-col">
        <span>Montr&eacute;al, Canada</span>
        <a href="mailto:contact@mostinvisible.com">contact@mostinvisible.com</a>
        <span class="footer__legal">Legal Terms</span>
      </div>
    </div>

    <div class="footer__marquee">
      <div class="footer__marquee-track">
        <span class="footer__marquee-text">Building a future where design thrives.</span>
        <span class="footer__marquee-text">The design house brands trust.</span>
        <span class="footer__marquee-text">Building a future where design thrives.</span>
        <span class="footer__marquee-text">The design house brands trust.</span>
      </div>
    </div>
  </footer>
  `;
})();
