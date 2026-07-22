/* Shared navigation + footer injector, scroll state, reveal-on-scroll */
(function () {
  const LINKS = [
    { href: 'index.html', label: 'Home' },
    { href: 'about.html', label: 'About Us' },
    { href: 'departments.html', label: 'Departments' },
    { href: 'team.html', label: 'Team' },
  ];

  const path = location.pathname.split('/').pop() || 'index.html';
  const isActive = (href) => href === path;

  /* ---- Navigation ---- */
  const linksHtml = LINKS.map(
    (l) => `<a href="${l.href}" class="${isActive(l.href) ? 'active' : ''}">${l.label}</a>`
  ).join('');

  const nav = document.createElement('div');
  nav.className = 'nav-shell';
  nav.innerHTML = `
    <nav class="liquid-nav" id="liquidNav" aria-label="Primary">
      <a href="index.html" class="nav-brand"><span class="dot"></span>ODYSSEY</a>
      <div class="nav-links">${linksHtml}</div>
      <a href="mailto:odyssey.rovers@somaiya.edu" class="nav-cta">Contact ↗</a>
      <button class="nav-toggle" id="navToggle" aria-label="Menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </nav>
    <div class="mobile-menu" id="mobileMenu">
      ${LINKS.map((l) => `<a href="${l.href}" class="${isActive(l.href) ? 'active' : ''}">${l.label}</a>`).join('')}
      <a href="mailto:odyssey.rovers@somaiya.edu" class="btn btn-primary">Contact Us ↗</a>
    </div>`;
  document.body.prepend(nav);

  const liquidNav = document.getElementById('liquidNav');
  const toggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  const onScroll = () => {
    if (window.scrollY > 24) liquidNav.classList.add('scrolled');
    else liquidNav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });
  mobileMenu.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.classList.remove('open');
    })
  );

  /* ---- Footer ---- */
  const footer = document.querySelector('[data-footer]');
  if (footer) {
    footer.innerHTML = `
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <span class="footer-logo"><span class="dot"></span>ODYSSEY</span>
            <p>The official Rovers &amp; Drones Team of K. J. Somaiya School of Engineering — engineering autonomous systems that explore the frontier.</p>
          </div>
          <div class="footer-col">
            <h4>Explore</h4>
            <a href="index.html">Home</a>
            <a href="about.html">About Us</a>
            <a href="departments.html">Departments</a>
            <a href="team.html">Team</a>
          </div>
          <div class="footer-col">
            <h4>Institution</h4>
            <a href="https://somaiya.edu" target="_blank" rel="noopener">K. J. Somaiya School of Engineering</a>
            <a href="https://somaiya.edu" target="_blank" rel="noopener">Somaiya Vidyavihar University</a>
          </div>
          <div class="footer-col">
            <h4>Connect</h4>
            <a href="mailto:odyssey.rovers@somaiya.edu">Email</a>
            <a href="#" target="_blank" rel="noopener">LinkedIn</a>
            <a href="#" target="_blank" rel="noopener">Instagram</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="container">
          <p>© ${new Date().getFullYear()} ODYSSEY · Rovers &amp; Drones Team. Engineering the future of autonomous exploration.</p>
        </div>
      </div>`;
  }

  /* ---- Reveal-on-scroll ---- */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.style.transitionDelay = (e.target.dataset.delay || '0') + 'ms';
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.14 }
    );
    revealEls.forEach((el) => io.observe(el));
  }
})();
