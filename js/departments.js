/* =====================================================================
   ODYSSEY — Departments page controller
   Planet-orbit carousel + synchronized glass detail card.
   Pure vanilla JS. No external libraries.
   ===================================================================== */
(function () {
  'use strict';

  const DEPARTMENTS = [
    {
      name: 'Software & AI',
      subtitle: 'Intelligence Behind the Mission',
      accent: '#38bdf8',
      glow: 'rgba(56, 189, 248, 0.5)',
      desc: 'The autonomy crew turns raw sensor data into decisions. We build the perception, navigation and control stack that lets a rover map unknown terrain and drive itself — from computer-vision pipelines to SLAM, path-planning and the ROS 2 nodes that tie every subsystem together.',
      chips: ['Autonomy Stack', 'Computer Vision', 'SLAM & Path-Planning', 'Embedded ML', 'ROS 2']
    },
    {
      name: 'Electronics',
      subtitle: 'Powering Every Connection',
      accent: '#8b5cf6',
      glow: 'rgba(139, 92, 246, 0.5)',
      desc: 'Electronics keeps the machine alive and talking. We design the power systems and custom PCBs, tune motor-control loops, integrate the sensor suite and engineer reliable comms and telemetry so commands reach the rover and data streams back — even at the edge of range.',
      chips: ['Power Systems', 'PCB Design', 'Motor Control', 'Sensor Integration', 'Comms & Telemetry']
    },
    {
      name: 'Mechanical',
      subtitle: 'Engineering Motion Into Reality',
      accent: '#f97316',
      glow: 'rgba(249, 115, 22, 0.5)',
      desc: 'Mechanical gives the mission a body. From chassis and suspension geometry to drivetrain design, we model everything in CAD, validate it with structural analysis, then machine and fabricate the parts in-house so the platform survives rough terrain and keeps rolling.',
      chips: ['Chassis & Suspension', 'CAD', 'Manufacturing', 'Drivetrain', 'Structural Analysis']
    },
    {
      name: 'PR & Management',
      subtitle: 'Connecting Ideas, People & Possibilities',
      accent: '#fbbf24',
      glow: 'rgba(251, 191, 36, 0.5)',
      desc: 'PR & Management is the crew that carries the mission outward. We run outreach and events, secure sponsorships, shape the brand and voice, and keep documentation and logistics tight — so the engineering behind ODYSSEY reaches the people and partners who help it fly.',
      chips: ['Outreach', 'Sponsorships', 'Branding', 'Events', 'Documentation & Logistics']
    }
  ];

  const N = DEPARTMENTS.length;
  const mod = (n, m) => ((n % m) + m) % m;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- DOM ----
  const hero = document.getElementById('deptHero');
  const planets = [0, 1, 2, 3].map((i) => document.getElementById('planet-' + i));
  const glow = planets.map((p) => p.querySelector('.planet-glow'));
  const panel = document.getElementById('glassPanel');
  const deptKicker = document.getElementById('deptKicker');
  const deptName = document.getElementById('deptName');
  const deptSubtitle = document.getElementById('deptSubtitle');
  const indicatorText = document.getElementById('indicatorText');
  const dotsWrap = document.getElementById('deptDots');

  const detailCard = document.getElementById('detailCard');
  const detailInner = document.getElementById('detailInner');
  const detailIndex = document.getElementById('detailIndex');
  const detailEyebrow = document.getElementById('detailEyebrow');
  const detailName = document.getElementById('detailName');
  const detailDesc = document.getElementById('detailDesc');
  const detailChips = document.getElementById('detailChips');
  const nebula = document.getElementById('nebula');
  const stars1 = document.getElementById('stars1');
  const stars2 = document.getElementById('stars2');

  let current = 0;
  let animating = false;

  // ---- Build dot rail ----
  const dots = DEPARTMENTS.map((d, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-label', d.name);
    b.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(b);
    return b;
  });

  // Paint each planet's glow with its department accent once.
  planets.forEach((p, i) => {
    glow[i].style.background =
      'radial-gradient(circle, ' + DEPARTMENTS[i].glow + ' 0%, transparent 70%)';
  });

  // ---- Layout the orbiting planets ----
  function positionPlanets() {
    const w = hero.clientWidth;
    const h = hero.clientHeight;
    const activeSize = Math.min(w * 1.1, h * 1.2);
    const sideSize = activeSize * 0.28;

    planets.forEach((p, i) => {
      const offset = mod(i - current, N);
      p.classList.toggle('is-active', offset === 0);
      if (offset === 0) {
        // Active: large, rising from bottom-center
        p.style.width = p.style.height = activeSize + 'px';
        p.style.left = (w / 2 - activeSize / 2) + 'px';
        p.style.top = (h - activeSize * 0.45) + 'px';
        p.style.opacity = '1';
        p.style.filter = 'brightness(1.12)';
        glow[i].style.opacity = '0.9';
      } else if (offset === 1) {
        // Right shoulder
        p.style.width = p.style.height = sideSize + 'px';
        p.style.left = (w - sideSize * 0.7) + 'px';
        p.style.top = (h * 0.55) + 'px';
        p.style.opacity = '0.6';
        p.style.filter = 'brightness(0.7)';
        glow[i].style.opacity = '0.35';
      } else if (offset === N - 1) {
        // Left shoulder
        p.style.width = p.style.height = sideSize + 'px';
        p.style.left = (-sideSize * 0.3) + 'px';
        p.style.top = (h * 0.55) + 'px';
        p.style.opacity = '0.6';
        p.style.filter = 'brightness(0.7)';
        glow[i].style.opacity = '0.35';
      } else {
        // Hidden (behind, below the fold)
        p.style.width = p.style.height = (sideSize * 0.5) + 'px';
        p.style.left = (w / 2) + 'px';
        p.style.top = (h + 100) + 'px';
        p.style.opacity = '0';
        p.style.filter = 'brightness(0.5)';
        glow[i].style.opacity = '0';
      }
    });
  }

  // ---- Apply active accent everywhere ----
  function applyAccent(d) {
    document.documentElement.style.setProperty('--accent', d.accent);
    document.documentElement.style.setProperty('--accent-glow', d.glow);
  }

  // ---- Update the glass hero panel + indicator + dots ----
  function updateHeroText() {
    const d = DEPARTMENTS[current];
    deptKicker.textContent = 'Department 0' + (current + 1);
    deptName.textContent = d.name;
    deptSubtitle.textContent = d.subtitle;
    indicatorText.innerHTML = '0' + (current + 1) + ' / 04';
    dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
  }

  // ---- Update the synchronized detail card ----
  function updateDetail() {
    const d = DEPARTMENTS[current];
    detailIndex.textContent = '0' + (current + 1);
    detailEyebrow.textContent = d.name;
    detailName.textContent = d.name;
    detailDesc.textContent = d.desc;
    detailChips.innerHTML = '';
    d.chips.forEach((c) => {
      const span = document.createElement('span');
      span.className = 'detail-chip';
      span.textContent = c;
      detailChips.appendChild(span);
    });
  }

  // Refresh everything that depends on `current`.
  function refresh() {
    applyAccent(DEPARTMENTS[current]);
    updateHeroText();
    updateDetail();
    positionPlanets();
  }

  // ---- Transition to a department ----
  function goTo(index) {
    index = mod(index, N);
    if (animating || index === current) return;
    animating = true;

    panel.classList.add('swapping');
    detailInner.classList.add('swapping');

    window.setTimeout(() => {
      current = index;
      applyAccent(DEPARTMENTS[current]);
      positionPlanets();
      updateDetail();
      // let the detail card fade back in with fresh content
      detailInner.classList.remove('swapping');

      window.setTimeout(() => {
        updateHeroText();
        panel.classList.remove('swapping');
        animating = false;
      }, reduceMotion ? 0 : 300);
    }, reduceMotion ? 0 : 260);
  }

  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);

  // ---- Controls ----
  document.getElementById('nextBtn').addEventListener('click', next);
  document.getElementById('prevBtn').addEventListener('click', prev);

  planets.forEach((p, i) => {
    p.addEventListener('click', () => { if (i !== current) goTo(i); });
  });

  // Keyboard — only when the hero scene is in view (don't hijack page scroll).
  function heroInView() {
    const r = hero.getBoundingClientRect();
    return r.bottom > window.innerHeight * 0.35 && r.top < window.innerHeight * 0.65;
  }
  document.addEventListener('keydown', (e) => {
    if (!heroInView()) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
  });

  // Swipe (scoped to the hero).
  let touchStartX = 0;
  let touchStartY = 0;
  hero.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  hero.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      dx < 0 ? next() : prev();
    }
  }, { passive: true });

  // ---- Parallax starfield (enhancement; skipped under reduced motion) ----
  if (!reduceMotion) {
    hero.addEventListener('mousemove', (e) => {
      const r = hero.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      const y = ((e.clientY - r.top) / r.height - 0.5) * 2;
      stars1.style.transform = 'translate(' + (x * 6) + 'px,' + (y * 5) + 'px)';
      stars2.style.transform = 'translate(' + (x * 12) + 'px,' + (y * 9) + 'px)';
      nebula.style.transform = 'translate(' + (x * 18) + 'px,' + (y * 14) + 'px)';
    });
  }

  // ---- Init ----
  refresh();
  window.addEventListener('resize', positionPlanets, { passive: true });
})();
