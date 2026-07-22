# ODYSSEY — Rovers & Drones Team Website

Official site for **ODYSSEY**, the Rovers & Drones Team of K. J. Somaiya School of Engineering.

A static, multi-page site — no build step required.

## Pages
| File | Description |
|------|-------------|
| `index.html` | Home — scroll-driven rover animation, hero, pillars, CTA |
| `about.html` | About Us — story, mission, vision, values |
| `departments.html` | Departments — planet-orbit carousel (Software & AI, Electronics, Mechanical, PR & Management) |
| `team.html` | Team — wormhole emergence animation of team members |

## Run locally
Because pages load images/video via relative paths, serve over HTTP (not `file://`):

```bash
cd site
python3 -m http.server 8000
# open http://localhost:8000
```

## Structure
```
site/
├── index.html · about.html · departments.html · team.html
└── assets/
    ├── css/    main.css (design system + liquid-glass nav), home/about/departments/team.css
    ├── js/     nav.js (shared nav + footer), home.js, departments.js, team.js
    ├── frames/ 240-frame rover scroll sequence
    ├── img/    hero images, planets/, team/ photos
    └── video/  team-bg.mp4
```

## Editing team members
Team data is a clearly-marked array at the top of `assets/js/team.js`
(`// ====== EDIT TEAM MEMBERS HERE ======`). Swap the photo path, name, role,
and LinkedIn/GitHub links there — no HTML changes needed. Photos live in `assets/img/team/`.

## Dependencies
Loaded from CDN at runtime (needs internet on first load):
- Google Fonts — Outfit + Fraunces
- GSAP 3.12.5 (team page animation only)

Everything else is bundled.
