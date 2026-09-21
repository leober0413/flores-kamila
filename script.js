/* ============================================================
   FLORES AMARILLAS — script.js
   ============================================================ */

'use strict';

/* ── State ───────────────────────────────────────────────── */
let currentScreen = 1;
let musicStarted  = false;
let musicPlaying  = false;

/* ── DOM refs ───────────────────────────────────────────── */
const audio      = document.getElementById('music');
const musicBtn   = document.getElementById('music-btn');
const startBtn   = document.getElementById('start-btn');
const revealBtn  = document.getElementById('reveal-btn');
const revealWrap = document.getElementById('reveal-wrap');
const revealContent = document.getElementById('reveal-content');

/* ── Reduced-motion helper ──────────────────────────────── */
const prefersReducedMotion =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============================================================
   FALLING PETALS (Canvas)
   ============================================================ */
(function initPetals() {
  const canvas = document.getElementById('petals-canvas');
  const ctx    = canvas.getContext('2d');

  const COLORS = ['#F4C430', '#FFE066', '#FFF176', '#DAA520', '#FFCA28'];
  const COUNT  = prefersReducedMotion ? 10 : 28;

  let petals = [];
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Petal {
    constructor(randomY) {
      this.reset(randomY);
    }

    reset(randomY) {
      this.x    = Math.random() * W;
      this.y    = randomY !== undefined ? Math.random() * H : -20;
      this.w    = Math.random() * 10 + 5;
      this.h    = this.w * 2.2;
      this.vx   = (Math.random() - 0.5) * 1.2;
      this.vy   = Math.random() * 1.4 + 0.5;
      this.rot  = Math.random() * Math.PI * 2;
      this.rotV = (Math.random() - 0.5) * 0.04;
      this.alpha = Math.random() * 0.45 + 0.2;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.swing = Math.random() * 0.015 + 0.005;
      this.phase = Math.random() * Math.PI * 2;
    }

    update() {
      this.phase += this.swing;
      this.x    += this.vx + Math.sin(this.phase) * 0.7;
      this.y    += this.vy;
      this.rot  += this.rotV;
      if (this.y > H + 20) this.reset();
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle   = this.color;
      ctx.beginPath();
      /* Petal shape: elongated ellipse */
      ctx.ellipse(0, 0, this.w / 2, this.h / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function init() {
    resize();
    petals = Array.from({ length: COUNT }, () => new Petal(true));
    window.addEventListener('resize', resize);
    loop();
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    petals.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  init();
})();


/* ============================================================
   FLOATING PHOTOS BACKGROUND
   ============================================================ */
(function initPhotoFloat() {
  if (prefersReducedMotion) return;

  const PHOTOS = [
    'assets/p01.jpg','assets/p02.jpg','assets/p03.jpg','assets/p04.jpg',
    'assets/p05.jpg','assets/p06.jpg','assets/p07.jpg','assets/p08.jpg',
    'assets/p09.jpg','assets/p10.jpg','assets/p11.jpg','assets/p12.jpg',
    'assets/p13.jpg','assets/p14.jpg','assets/p15.jpg','assets/p16.jpg',
    'assets/p17.jpg','assets/p18.jpg','assets/p19.jpg','assets/p20.jpg',
    'assets/p21.jpg','assets/p22.jpg','assets/p23.jpg','assets/p24.jpg',
    'assets/p25.jpg','assets/p26.jpg','assets/p27.jpg',
  ];

  const container = document.getElementById('photo-bg');
  const MAX_ACTIVE = 3;
  let active = 0;

  function spawn() {
    if (active >= MAX_ACTIVE) return;
    active++;

    const img = document.createElement('img');
    img.className = 'floating-photo';
    /* Try a random photo; on error silently skip */
    img.src = PHOTOS[Math.floor(Math.random() * PHOTOS.length)];
    img.onerror  = () => { img.remove(); active--; };
    img.onremove = () => { active--; };

    const vw   = window.innerWidth;
    const vh   = window.innerHeight;
    const size = 160 + Math.random() * 100;     /* 160–260 px */
    const dur  = 18 + Math.random() * 6;        /* 7–13 s */
    const rot  = (Math.random() - 0.5) * 20;   /* –10° to +10° */
    const peak = '0.90';

    /* Start: bottom edge, random horizontal */
    const startX = Math.random() * (vw - size);
    const startY = vh + size * 0.5;

    /* Drift: float upward + gentle horizontal sway */
    const tx = (Math.random() - 0.5) * 140;
    const ty = -(vh + size * 1.5);

    img.style.cssText = `
      width:${size}px;
      height:${size}px;
      left:${startX}px;
      top:${startY}px;
      --rot:${rot}deg;
      --tx:${tx}px;
      --ty:${ty}px;
      --peak-opacity:${peak};
      animation-duration:${dur}s;
    `;

    img.addEventListener('animationend', () => {
      img.remove();
      active--;
    });

    container.appendChild(img);
  }

  /* Stagger initial spawns then keep cycling */
  setTimeout(() => {
    for (let i = 0; i < 3; i++) setTimeout(spawn, i * 800);
    setInterval(spawn, 5000);
  }, 2000);
})();


/* ============================================================
   FLOWER SVG GENERATOR  (v3 — realistic hand-drawn bouquet)
   ============================================================ */
function buildFlowers() {
  const container = document.getElementById('flowers-container');
  const NS  = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 280 325');
  svg.setAttribute('xmlns',   NS);
  svg.setAttribute('aria-hidden', 'true');

  const defs = document.createElementNS(NS, 'defs');

  /* Hand-drawn wobble filter */
  const flt = document.createElementNS(NS, 'filter');
  flt.setAttribute('id', 'hd');
  flt.setAttribute('x', '-8%'); flt.setAttribute('y', '-8%');
  flt.setAttribute('width', '116%'); flt.setAttribute('height', '116%');
  const turb = document.createElementNS(NS, 'feTurbulence');
  turb.setAttribute('type', 'fractalNoise');
  turb.setAttribute('baseFrequency', '0.03');
  turb.setAttribute('numOctaves', '4');
  turb.setAttribute('seed', '12');
  turb.setAttribute('result', 'noise');
  const disp = document.createElementNS(NS, 'feDisplacementMap');
  disp.setAttribute('in', 'SourceGraphic');
  disp.setAttribute('in2', 'noise');
  disp.setAttribute('scale', '2.2');
  disp.setAttribute('xChannelSelector', 'R');
  disp.setAttribute('yChannelSelector', 'G');
  flt.appendChild(turb); flt.appendChild(disp);
  defs.appendChild(flt);

  /* Shared gradients */
  _linGrad(defs, NS, 'gStem', [['0%','#1B5E20'],['100%','#66BB6A']], false);
  _radGrad(defs, NS, 'gLeaf', [['0%','#A5D6A7'],['70%','#388E3C'],['100%','#1B5E20']]);
  _radGrad(defs, NS, 'gCtr',  [['0%','#1A0A00'],['40%','#4E342E'],['100%','#6D4C41']]);

  svg.appendChild(defs);

  const FLOWERS = [
    { cx: 76,  cy: 74,  stx: 136, sty: 284, sc: 0.87, delay:  90, tilt: -5 },
    { cx: 140, cy: 42,  stx: 140, sty: 292, sc: 1.00, delay:   0, tilt:  2 },
    { cx: 204, cy: 70,  stx: 144, sty: 284, sc: 0.87, delay: 170, tilt:  6 },
  ];

  FLOWERS.forEach(({ cx, cy, stx, sty, sc, delay, tilt }, fi) => {
    const g = document.createElementNS(NS, 'g');
    g.classList.add('flower-group');
    g.dataset.delay = delay;

    /* Per-flower petal radial gradient: gold center → pale tip */
    const pgId = `pg${fi}`, ipgId = `ipg${fi}`;
    _radGradUS(defs, NS, pgId,  cx, cy, (26+29)*sc*1.05,
      [['0%','#B8730A'],['20%','#D4920E'],['50%','#F4C430'],['100%','#FFFDE7']]);
    _radGradUS(defs, NS, ipgId, cx, cy, (15+19)*sc*1.05,
      [['0%','#C17F0C'],['35%','#F0B429'],['100%','#FFF9C4']]);

    /* Stem */
    const cpx = cx + (stx - cx) * 0.18 + (cx < 140 ? -7 : cx > 140 ? 7 : 0);
    const cpy = (cy + sty) * 0.5 + 12;
    const stem = document.createElementNS(NS, 'path');
    stem.setAttribute('d',
      `M ${stx} ${sty} C ${cpx} ${cpy} ${cx} ${cy+40*sc} ${cx} ${cy+27*sc}`
    );
    stem.setAttribute('stroke',        'url(#gStem)');
    stem.setAttribute('stroke-width',  sc >= 1 ? '5' : '4');
    stem.setAttribute('stroke-linecap','round');
    stem.setAttribute('fill',          'none');
    stem.classList.add('flower-stem');
    g.appendChild(stem);

    /* Leaves */
    [[0.38, -1], [0.63, 1]].forEach(([t, side], li) => {
      const lx = stx + (cx - stx) * t;
      const ly = sty + (cy - sty) * t;
      const leaf = _makeLeaf(NS, lx, ly, side, sc * 0.88);
      leaf.classList.add('flower-leaf');
      leaf.style.transformOrigin = `${lx}px ${ly}px`;
      leaf.style.transformBox    = 'view-box';
      leaf.style.transitionDelay = (delay + 510 + li * 165) + 'ms';
      g.appendChild(leaf);
    });

    /* Flower head (tilted, hand-drawn filter) */
    const hg = document.createElementNS(NS, 'g');
    hg.setAttribute('transform', `rotate(${tilt} ${cx} ${cy})`);
    hg.setAttribute('filter', 'url(#hd)');

    /* Outer petals: 16, cubic bezier, gradient, veins */
    _petalsCubic(hg, NS, cx, cy, {
      n: 16, R: 24*sc, W: 7*sc, H: 28*sc,
      fill: `url(#${pgId})`, stroke: '#B8860B', sw: 0.5,
      vein: true, base: delay + 800, step: 36,
    });

    /* Inner petals: 16, shorter, offset 11.25° */
    _petalsCubic(hg, NS, cx, cy, {
      n: 16, R: 14*sc, W: 4.8*sc, H: 18*sc,
      fill: `url(#${ipgId})`, stroke: '#DAA520', sw: 0.35,
      vein: false, base: delay + 808, step: 28, off: 11.25,
    });

    /* Center: shadow → gradient → inner dark ring */
    _circ(hg, NS, cx, cy, 13.5*sc, '#2E1503',    'flower-center', delay+1310);
    _circ(hg, NS, cx, cy, 12.5*sc, 'url(#gCtr)', 'flower-center', delay+1325);
    _circ(hg, NS, cx, cy,  9*sc,   '#1A0A00',    'flower-center', delay+1340);

    /* Seed dots: 3 concentric rings */
    let dI = 0;
    [[3.5*sc, 5], [6.5*sc, 9], [9.5*sc, 13]].forEach(([dr, cnt]) => {
      for (let di = 0; di < cnt; di++) {
        const da  = (di / cnt) * 360 + (dr > 5*sc ? 14 : 0);
        const dot = document.createElementNS(NS, 'circle');
        dot.setAttribute('cx',   n1(cx + Math.cos(da*Math.PI/180)*dr));
        dot.setAttribute('cy',   n1(cy + Math.sin(da*Math.PI/180)*dr));
        dot.setAttribute('r',    n1(1.3*sc));
        dot.setAttribute('fill', '#FDD835');
        dot.classList.add('flower-center');
        dot.style.transitionDelay = (delay + 1360 + dI * 10) + 'ms';
        hg.appendChild(dot); dI++;
      }
    });

    /* Glint */
    const hl = document.createElementNS(NS, 'circle');
    hl.setAttribute('cx', n1(cx - 3.5*sc));
    hl.setAttribute('cy', n1(cy - 3.5*sc));
    hl.setAttribute('r',  n1(2.8*sc));
    hl.setAttribute('fill', 'rgba(255,255,255,0.28)');
    hl.classList.add('flower-center');
    hl.style.transitionDelay = (delay+1540) + 'ms';
    hg.appendChild(hl);

    g.appendChild(hg);
    svg.appendChild(g);
  });

  /* Ribbon */
  const rg = document.createElementNS(NS, 'g');
  rg.classList.add('flower-group');
  rg.dataset.delay = 0;
  [
    ['M 122 271 Q 140 265 158 271 L 160 293 Q 140 299 120 293 Z', '#FFEE58', '#F9A825', '1.5', '1570'],
    ['M 135 281 Q 118 265 109 273 Q 115 287 135 281 Z',           '#FFD600', '#F9A825', '0.8', '1610'],
    ['M 145 281 Q 162 265 171 273 Q 165 287 145 281 Z',           '#FFD600', '#F9A825', '0.8', '1630'],
  ].forEach(([d, fill, str, sw, td]) => {
    const p = document.createElementNS(NS, 'path');
    p.setAttribute('d', d); p.setAttribute('fill', fill);
    p.setAttribute('stroke', str); p.setAttribute('stroke-width', sw);
    p.classList.add('flower-center');
    p.style.transitionDelay = td + 'ms';
    rg.appendChild(p);
  });
  const kn = document.createElementNS(NS, 'circle');
  kn.setAttribute('cx','140'); kn.setAttribute('cy','281'); kn.setAttribute('r','5.5');
  kn.setAttribute('fill','#F9A825'); kn.setAttribute('stroke','#E65100'); kn.setAttribute('stroke-width','0.8');
  kn.classList.add('flower-center'); kn.style.transitionDelay = '1650ms';
  rg.appendChild(kn);
  svg.appendChild(rg);

  container.appendChild(svg);

  requestAnimationFrame(() => {
    svg.querySelectorAll('.flower-stem').forEach(p => {
      const len = p.getTotalLength ? p.getTotalLength() : 200;
      p.style.strokeDasharray  = len;
      p.style.strokeDashoffset = len;
    });
  });
}

/* ── Helpers ─────────────────────────────────────────────── */

/**
 * Cubic-bezier petals: narrow base → wide at 38% → pointed tip.
 * Slight random size variation per petal for hand-drawn feel.
 */
function _petalsCubic(g, NS, cx, cy, { n, R, W, H, fill, stroke, sw, vein, base, step, off = 0 }) {
  for (let i = 0; i < n; i++) {
    const jitter = 1 + (Math.random() - 0.5) * 0.09; /* ±4.5% */
    const pH = H * jitter, pW = W * jitter;

    const deg  = (i / n) * 360 + off;
    const rad  = deg * Math.PI / 180;
    const dx   = Math.sin(rad),  dy = -Math.cos(rad);
    const px   = Math.cos(rad),  py =  Math.sin(rad);

    const bx = cx + R*dx,          by = cy + R*dy;         /* base */
    const tx = cx + (R+pH)*dx,     ty = cy + (R+pH)*dy;    /* tip  */
    const fw = 0.38 * pH;                                    /* widest point at 38% */

    /* Left side cubic */
    const lc1x = bx + pW*0.2*px  + pH*0.08*dx,  lc1y = by + pW*0.2*py  + pH*0.08*dy;
    const lc2x = bx + pW*px      + fw*dx,        lc2y = by + pW*py      + fw*dy;
    /* Tip slightly off-center (natural asymmetry) */
    const ltx  = tx + pW*0.05*px,                lty  = ty + pW*0.05*py;

    /* Right side cubic (mirror) */
    const rc1x = tx - pW*0.05*px,                rc1y = ty - pW*0.05*py;
    const rc2x = bx - pW*px      + fw*dx,        rc2y = by - pW*py      + fw*dy;
    const rc3x = bx - pW*0.2*px  + pH*0.08*dx,  rc3y = by - pW*0.2*py  + pH*0.08*dy;

    const pg = document.createElementNS(NS, 'g');

    const path = document.createElementNS(NS, 'path');
    path.setAttribute('d', [
      `M ${n1(bx)} ${n1(by)}`,
      `C ${n1(lc1x)} ${n1(lc1y)} ${n1(lc2x)} ${n1(lc2y)} ${n1(ltx)} ${n1(lty)}`,
      `C ${n1(rc1x)} ${n1(rc1y)} ${n1(rc2x)} ${n1(rc2y)} ${n1(rc3x)} ${n1(rc3y)}`,
      `L ${n1(bx)} ${n1(by)} Z`,
    ].join(' '));
    path.setAttribute('fill', fill);
    if (stroke) {
      path.setAttribute('stroke',        stroke);
      path.setAttribute('stroke-width',  sw);
      path.setAttribute('stroke-linejoin','round');
    }
    pg.appendChild(path);

    /* Midrib vein on outer petals */
    if (vein) {
      const mx = cx + (R + pH * 0.6) * dx;
      const my = cy + (R + pH * 0.6) * dy;
      const vn = document.createElementNS(NS, 'line');
      vn.setAttribute('x1', n1(bx)); vn.setAttribute('y1', n1(by));
      vn.setAttribute('x2', n1(mx)); vn.setAttribute('y2', n1(my));
      vn.setAttribute('stroke', '#A07000');
      vn.setAttribute('stroke-width', n1(sw * 0.8));
      vn.setAttribute('opacity', '0.35');
      vn.setAttribute('stroke-linecap', 'round');
      pg.appendChild(vn);
    }

    pg.classList.add('flower-petal');
    pg.style.transformOrigin = `${cx}px ${cy}px`;
    pg.style.transformBox    = 'view-box';
    pg.style.transitionDelay = (base + i * step) + 'ms';
    g.appendChild(pg);
  }
}

/** Leaf with midrib + two side veins */
function _makeLeaf(NS, x, y, side, sc) {
  const W = 14 * sc, H = 28 * sc;
  const angle = side * 48;
  const gLeaf = document.createElementNS(NS, 'g');
  gLeaf.setAttribute('transform', `rotate(${angle} ${x} ${y})`);

  const leaf = document.createElementNS(NS, 'path');
  leaf.setAttribute('d',
    `M ${n1(x)} ${n1(y)}
     C ${n1(x+W)} ${n1(y-H*0.25)} ${n1(x+W*0.7)} ${n1(y-H*0.75)} ${n1(x)} ${n1(y-H)}
     C ${n1(x-W*0.7)} ${n1(y-H*0.75)} ${n1(x-W)} ${n1(y-H*0.25)} ${n1(x)} ${n1(y)} Z`
  );
  leaf.setAttribute('fill', 'url(#gLeaf)');
  leaf.setAttribute('stroke', '#1B5E20');
  leaf.setAttribute('stroke-width', '0.5');
  leaf.setAttribute('stroke-opacity', '0.4');
  gLeaf.appendChild(leaf);

  /* Midrib */
  const mr = document.createElementNS(NS, 'line');
  mr.setAttribute('x1', x); mr.setAttribute('y1', y);
  mr.setAttribute('x2', x); mr.setAttribute('y2', n1(y-H));
  mr.setAttribute('stroke', '#1B5E20'); mr.setAttribute('stroke-width', '0.9');
  mr.setAttribute('opacity', '0.5'); mr.setAttribute('stroke-linecap', 'round');
  gLeaf.appendChild(mr);

  /* Two side veins */
  [0.35, 0.62].forEach(t => {
    [-1, 1].forEach(s => {
      const vx = x, vy = y - H*t;
      const vex = x + s * W * 0.55, vey = vy - H * 0.12;
      const vn = document.createElementNS(NS, 'line');
      vn.setAttribute('x1', vx); vn.setAttribute('y1', n1(vy));
      vn.setAttribute('x2', n1(vex)); vn.setAttribute('y2', n1(vey));
      vn.setAttribute('stroke', '#1B5E20'); vn.setAttribute('stroke-width', '0.5');
      vn.setAttribute('opacity', '0.35');
      gLeaf.appendChild(vn);
    });
  });

  return gLeaf;
}

function _circ(g, NS, cx, cy, r, fill, cls, delay) {
  const c = document.createElementNS(NS, 'circle');
  c.setAttribute('cx', cx); c.setAttribute('cy', cy);
  c.setAttribute('r',  r);  c.setAttribute('fill', fill);
  c.classList.add(cls);
  c.style.transitionDelay = delay + 'ms';
  g.appendChild(c);
}

function _linGrad(defs, NS, id, stops, horiz) {
  const g = document.createElementNS(NS, 'linearGradient');
  g.setAttribute('id', id);
  if (horiz) { g.setAttribute('x1','0');g.setAttribute('y1','0');g.setAttribute('x2','1');g.setAttribute('y2','0'); }
  stops.forEach(([o, c]) => {
    const s = document.createElementNS(NS, 'stop');
    s.setAttribute('offset', o); s.setAttribute('stop-color', c);
    g.appendChild(s);
  });
  defs.appendChild(g);
}

function _radGrad(defs, NS, id, stops) {
  const g = document.createElementNS(NS, 'radialGradient');
  g.setAttribute('id', id);
  stops.forEach(([o, c]) => {
    const s = document.createElementNS(NS, 'stop');
    s.setAttribute('offset', o); s.setAttribute('stop-color', c);
    g.appendChild(s);
  });
  defs.appendChild(g);
}

/* Radial gradient in user-space coordinates (for per-flower petal gradients) */
function _radGradUS(defs, NS, id, cx, cy, r, stops) {
  const g = document.createElementNS(NS, 'radialGradient');
  g.setAttribute('id', id);
  g.setAttribute('gradientUnits', 'userSpaceOnUse');
  g.setAttribute('cx', cx); g.setAttribute('cy', cy); g.setAttribute('r', r);
  stops.forEach(([o, c]) => {
    const s = document.createElementNS(NS, 'stop');
    s.setAttribute('offset', o); s.setAttribute('stop-color', c);
    g.appendChild(s);
  });
  defs.appendChild(g);
}

/** Round to 1 decimal */
function n1(v) { return Math.round(v * 10) / 10; }


/* ============================================================
   SCREEN NAVIGATION
   ============================================================ */
function showScreen(num) {
  const prev = document.getElementById(`screen-${currentScreen}`);
  const next = document.getElementById(`screen-${num}`);
  if (!next || num === currentScreen) return;

  /* Fade out current */
  prev.classList.remove('active');
  setTimeout(() => {
    prev.setAttribute('hidden', '');
  }, 600);

  /* Fade in next */
  next.removeAttribute('hidden');
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      next.classList.add('active');
      triggerFadeChildren(next);
      if (num === 2) triggerFlowers();
    });
  });

  currentScreen = num;
}

function triggerFadeChildren(screen) {
  const children = screen.querySelectorAll('.fade-child');
  children.forEach(el => {
    /* Reset first (in case revisited) */
    el.classList.remove('visible');
    requestAnimationFrame(() => {
      el.classList.add('visible');
    });
  });
}

function triggerFlowers() {
  const groups = document.querySelectorAll('.flower-group');
  groups.forEach(g => {
    const delay = parseInt(g.dataset.delay) || 0;
    setTimeout(() => {
      g.classList.add('bloomed');
    }, delay + 100);
  });
}


/* ============================================================
   AUDIO
   ============================================================ */
function startMusic() {
  if (musicStarted) return;
  musicStarted = true;

  audio.volume = 0;
  const playPromise = audio.play();

  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        musicPlaying = true;
        musicBtn.removeAttribute('hidden');
        /* Fade-in volume */
        fadeVolume(audio, 0, 0.55, 2500);
      })
      .catch(() => {
        /* Audio blocked — silently continue */
        musicBtn.setAttribute('hidden', '');
      });
  }
}

function fadeVolume(audioEl, from, to, durationMs) {
  const steps    = 50;
  const stepTime = durationMs / steps;
  const delta    = (to - from) / steps;
  let   vol      = from;

  const interval = setInterval(() => {
    vol += delta;
    if ((delta > 0 && vol >= to) || (delta < 0 && vol <= to)) {
      audioEl.volume = Math.max(0, Math.min(1, to));
      clearInterval(interval);
    } else {
      audioEl.volume = Math.max(0, Math.min(1, vol));
    }
  }, stepTime);
}

musicBtn.addEventListener('click', () => {
  if (musicPlaying) {
    fadeVolume(audio, audio.volume, 0, 600);
    setTimeout(() => audio.pause(), 650);
    musicPlaying = false;
    musicBtn.setAttribute('aria-label', 'Reanudar música');
    musicBtn.querySelector('.music-icon').textContent = '⏸';
  } else {
    audio.play().catch(() => {});
    fadeVolume(audio, 0, 0.55, 800);
    musicPlaying = true;
    musicBtn.setAttribute('aria-label', 'Pausar música');
    musicBtn.querySelector('.music-icon').textContent = '♪';
  }
});


/* ============================================================
   EVENT LISTENERS
   ============================================================ */

/* Screen 1 → 2 + start music */
startBtn.addEventListener('click', () => {
  startMusic();
  showScreen(2);
});

/* "Siguiente" buttons */
document.addEventListener('click', e => {
  const btn = e.target.closest('[data-next]');
  if (btn) {
    showScreen(parseInt(btn.dataset.next));
  }
});

/* Reveal button on screen 5 */
revealBtn.addEventListener('click', () => {
  revealBtn.style.opacity = '0';
  revealBtn.style.pointerEvents = 'none';

  setTimeout(() => {
    revealWrap.setAttribute('hidden', '');
    revealContent.removeAttribute('hidden');

    requestAnimationFrame(() => {
      const inner = revealContent.querySelector('.fade-child');
      if (inner) {
        requestAnimationFrame(() => inner.classList.add('visible'));
      }
    });
  }, 300);
});

/* Audio error fallback: page still works */
audio.addEventListener('error', () => {
  musicBtn.setAttribute('hidden', '');
  musicStarted = true; /* don't retry */
});


/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  buildFlowers();

  /* Trigger fade children on screen 1 immediately */
  const s1 = document.getElementById('screen-1');
  triggerFadeChildren(s1);
});
