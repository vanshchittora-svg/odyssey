/* Home — preloader + scroll-driven frame-sequence canvas */
document.addEventListener('DOMContentLoaded', () => {
  const TOTAL = 240;
  const framePath = (i) => `assets/frames/ezgif-frame-${String(i).padStart(3, '0')}.jpg`;
  const images = new Array(TOTAL + 1);
  let loaded = 0;
  let lastFrame = -1;

  const canvas = document.getElementById('cine-canvas');
  const ctx = canvas.getContext('2d');
  const section = document.getElementById('cinematic');

  const draw = (i) => {
    const img = images[i];
    if (!img || !img.complete || !img.naturalWidth) return;
    const cw = canvas.width, ch = canvas.height;
    const cr = cw / ch, ir = img.naturalWidth / img.naturalHeight;
    let w, h, x, y;
    if (ir > cr) { h = ch; w = ch * ir; x = (cw - w) / 2; y = 0; }
    else { w = cw; h = cw / ir; x = 0; y = (ch - h) / 2; }
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, x, y, w, h);
    lastFrame = i;
  };

  const resize = () => {
    const p = canvas.parentElement;
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = p.clientWidth * scale;
    canvas.height = p.clientHeight * scale;
    if (lastFrame >= 0) draw(lastFrame);
  };

  const onScroll = () => {
    const top = section.offsetTop;
    const max = section.scrollHeight - window.innerHeight;
    let p = (window.scrollY - top) / max;
    p = Math.max(0, Math.min(1, p));
    const frame = Math.min(TOTAL, Math.max(1, Math.round(p * (TOTAL - 1)) + 1));
    if (frame !== lastFrame) requestAnimationFrame(() => draw(frame));
  };

  const start = () => {
    resize();
    draw(1);
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  };

  // Load frames in background, start immediately
  for (let i = 1; i <= TOTAL; i++) {
    const img = new Image();
    img.onload = () => { loaded++; };
    img.onerror = () => { loaded++; };
    img.src = framePath(i);
    images[i] = img;
  }

  start();
});