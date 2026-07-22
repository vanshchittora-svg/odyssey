/* =====================================================================
   ODYSSEY — Team page logic
   Renders the pods, then runs the GSAP "wormhole emergence" timeline.
   ===================================================================== */
(function () {
  'use strict';

  // ====== EDIT TEAM MEMBERS HERE ======
  // Swap images (assets/img/team/*), names, roles or links freely.
  // variant: 'captain' (gold), 'co' (teal), '' -> lead (amber).
  const TEAM = {
    // Leadership row — 2, centered, larger
    leadership: [
      {
        name: 'Atharv',
        role: 'CAPTAIN',
        img: 'assets/img/team/atharv.webp',
        variant: 'captain',
        linkedin: 'https://linkedin.com/in/atharv',
        github: 'https://github.com/atharv',
      },
      {
        name: 'Prem',
        role: 'CHIEF OPERATING OFFICER',
        img: 'assets/img/team/prem.png',
        variant: 'co',
        linkedin: 'https://linkedin.com/in/prem',
        github: 'https://github.com/prem',
      },
    ],
    // Core leads row — 5
    leads: [
      {
        name: 'Ishaan',
        role: 'ELECTRONICS LEAD',
        img: 'assets/img/team/ishan.webp',
        linkedin: 'https://linkedin.com/in/ishaan',
        github: 'https://github.com/ishaan',
      },
      {
        name: 'Soham',
        role: 'SOFTWARE & AI LEAD',
        img: 'assets/img/team/soham.webp',
        linkedin: 'https://www.linkedin.com/in/soham-tikam-4533b341a',
        github: 'https://github.com/SohamTikam',
      },
      {
        name: 'Dharmil',
        role: 'TESTING & VALIDATION LEAD',
        img: 'assets/img/team/dharmil.webp',
        linkedin: 'https://www.linkedin.com/in/dharmilgathani/',
        github: 'https://github.com/dharmil',
      },
      {
        name: 'Mustafa',
        role: 'MECHANICAL LEAD',
        img: 'assets/img/team/mustafa.webp',
        linkedin: 'https://www.linkedin.com/in/mustafa-jawadwala-628b25274/',
        github: 'https://github.com/mustafahj-droid',
      },
      {
        name: 'Shaurya',
        role: 'PR & MANAGEMENT',
        img: 'assets/img/team/shaurya.webp',
        linkedin: 'https://www.linkedin.com/in/shaurya-shah-ab44b51b8',
        github: 'https://github.com/shaurya',
      },
    ],
  };
  // ====== END TEAM DATA ======

  // Inline SVG icons (paths copied from the source TeamPod.jsx)
  const LINKEDIN_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>';
  const GITHUB_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>';

  function variantClass(variant) {
    if (variant === 'captain') return 'pod-captain';
    if (variant === 'co') return 'pod-co';
    return 'pod-lead';
  }

  // Build one pod's DOM
  function buildPod(member, isLeader) {
    const pod = document.createElement('div');
    pod.className = 'pod ' + variantClass(member.variant) + (isLeader ? ' pod-leader' : '');

    const socials = [];
    if (member.linkedin) {
      socials.push(
        `<a class="social-link social-link-linkedin" href="${member.linkedin}" target="_blank" rel="noopener noreferrer" aria-label="${member.name} on LinkedIn">${LINKEDIN_SVG}</a>`
      );
    }
    if (member.github) {
      socials.push(
        `<a class="social-link social-link-github" href="${member.github}" target="_blank" rel="noopener noreferrer" aria-label="${member.name} on GitHub">${GITHUB_SVG}</a>`
      );
    }

    pod.innerHTML = `
      <div class="energy-packet"><span class="packet-core"></span></div>
      <div class="pod-photo">
        <div class="avatar-bar avatar-bar-top"></div>
        <div class="avatar-bar avatar-bar-bottom"></div>
        <div class="avatar-unwind"><img src="${member.img}" alt="${member.name}" loading="eager" /></div>
      </div>
      <div class="pod-info">
        <span class="pod-role">${member.role}</span>
        <h3 class="pod-name">${member.name}</h3>
        <div class="pod-socials">${socials.join('')}</div>
      </div>`;
    return pod;
  }

  function render() {
    const rowLead = document.getElementById('rowLeadership');
    const rowLeads = document.getElementById('rowLeads');
    if (!rowLead || !rowLeads) return;
    TEAM.leadership.forEach((m) => rowLead.appendChild(buildPod(m, true)));
    TEAM.leads.forEach((m) => rowLeads.appendChild(buildPod(m, false)));
  }

  // ---- Emergence timeline ---------------------------------------------
  function animate() {
    const stage = document.getElementById('stage');
    const wormhole = document.getElementById('wormhole');
    const pods = Array.prototype.slice.call(document.querySelectorAll('.pod'));
    if (!stage || !pods.length || typeof gsap === 'undefined') return;

    const packets = document.querySelectorAll('.energy-packet');
    const unwinds = document.querySelectorAll('.avatar-unwind');
    const infos = document.querySelectorAll('.pod-info');
    const topBars = document.querySelectorAll('.avatar-bar-top');
    const bottomBars = document.querySelectorAll('.avatar-bar-bottom');

    const reduce =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Reduced motion: jump straight to the final resting state.
    if (reduce) {
      gsap.set(packets, { opacity: 0 });
      gsap.set(unwinds, { scaleY: 1 });
      gsap.set(infos, { opacity: 1, y: 0 });
      gsap.set([topBars, bottomBars], { opacity: 0 });
      return;
    }

    // Recompute the portal origin from the ACTUAL layout.
    const stageRect = stage.getBoundingClientRect();
    const whRect = wormhole.getBoundingClientRect();
    const portalX = whRect.left - stageRect.left + whRect.width / 2;
    const portalY = whRect.top - stageRect.top + whRect.height / 2;

    // 1. Seed each energy packet down at the wormhole core (scale 0.2).
    pods.forEach(function (pod, i) {
      const podRect = pod.getBoundingClientRect();
      const packetCenterX = podRect.left - stageRect.left + podRect.width / 2;
      // The packet sits near the photo (top ~46% of the pod), approximate its Y.
      const packetCenterY = podRect.top - stageRect.top + podRect.height * 0.46;
      const pkg = packets[i];
      if (pkg) {
        gsap.set(pkg, {
          x: portalX - packetCenterX,
          y: portalY - packetCenterY,
          scale: 0.2,
          opacity: 1,
          transformOrigin: 'center center',
        });
      }
    });

    // Hide the pod contents; keep the glass frame visible as the "landing pad".
    gsap.set(unwinds, { scaleY: 0, transformOrigin: 'center center' });
    gsap.set(infos, { opacity: 0, y: 16 });
    gsap.set(topBars, { top: '50%', yPercent: -50, scaleX: 0, opacity: 0 });
    gsap.set(bottomBars, { top: '50%', yPercent: -50, scaleX: 0, opacity: 0 });
    gsap.set(pods, { opacity: 0, y: 20, scale: 0.96 });

    const tl = gsap.timeline({ delay: 0.2 });

    // Glass frames fade in first (the destination pads).
    tl.to(pods, {
      duration: 0.6,
      opacity: 1,
      y: 0,
      scale: 1,
      stagger: 0.07,
      ease: 'power2.out',
    }, 0);

    // Step 1 — packets shoot up out of the wormhole to each node position.
    tl.to(packets, {
      duration: 1.0,
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
      stagger: 0.1,
      ease: 'power2.out',
    }, 0.15);

    // Step 2 — each packet arrives and BURSTS (scale up + fade).
    tl.to(packets, {
      duration: 0.35,
      scale: 2.4,
      opacity: 0,
      stagger: 0.08,
      ease: 'power1.out',
    }, '+=0.05');

    // Info text + social icons fade up from the burst.
    tl.to(infos, {
      duration: 0.42,
      opacity: 1,
      y: 0,
      stagger: 0.08,
      ease: 'power2.out',
    }, '<+=0.05');

    // Step 3 — laser edge bars expand at photo center.
    tl.to([topBars, bottomBars], {
      duration: 0.3,
      scaleX: 1,
      opacity: 1,
      stagger: 0.04,
      ease: 'power2.out',
    }, '+=0.02');

    // Step 4 — photo UNWINDS vertically while bars track the opening edges.
    tl.to(unwinds, {
      duration: 0.75,
      scaleY: 1,
      stagger: 0.06,
      ease: 'expo.out',
    }, '-=0.12');
    tl.to(topBars, {
      duration: 0.75,
      top: '0%',
      yPercent: 0,
      stagger: 0.06,
      ease: 'expo.out',
    }, '<');
    tl.to(bottomBars, {
      duration: 0.75,
      top: '100%',
      yPercent: -100,
      stagger: 0.06,
      ease: 'expo.out',
    }, '<');

    // Step 5 — fade the laser bars out once the photos are open.
    tl.to([topBars, bottomBars], {
      duration: 0.4,
      opacity: 0,
      ease: 'power1.inOut',
    }, '-=0.25');
  }

  function init() {
    render();
    // Ensure layout is settled before measuring positions.
    requestAnimationFrame(function () {
      requestAnimationFrame(animate);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
