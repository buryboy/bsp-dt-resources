// Page 7 — Polymers & the planet: a recycling-centre conveyor (flick each item into the right bin by its code),
// a landfill time-lapse slider (predict first), then reduce / reuse / recycle, bio-polymers and two true/false checks.
(function () {
  'use strict';
  const B = Ink.BLUE, RD = Ink.RED, GR = Ink.GREEN, rgba = Ink.rgba, geo = Ink.geo;
  const HANDF = (s) => `400 ${s}px "Gloria Hallelujah", "Comic Sans MS", cursive`;
  const LABF = (s) => `600 ${s}px Fredoka, "Arial Rounded MT Bold", system-ui, sans-serif`;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const TAU = Math.PI * 2;
  function text(x, s, px, py, o = {}) {
    x.save(); x.font = (o.font === 'hand' ? HANDF : LABF)(o.size || 22);
    x.fillStyle = rgba(o.color || B, o.a ?? 0.92); x.textAlign = o.align || 'center'; x.textBaseline = 'alphabetic';
    x.fillText(s, px, py); x.restore();
  }
  const path = (x, P) => { x.beginPath(); P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.closePath(); };
  const fillP = (x, P, style) => { x.save(); x.fillStyle = style; path(x, P); x.fill(); x.restore(); };
  const box = (x0, y0, w, h) => [[x0, y0], [x0 + w, y0], [x0 + w, y0 + h], [x0, y0 + h]];
  const closeP = (P) => P.concat([P[0]]);
  const disc = (x, cx, cy, r, col, a = 0.9) => { x.save(); x.fillStyle = rgba(col, a); x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill(); x.restore(); };
  const st = (x, pts, o = {}) => Ink.stroke(x, pts, Object.assign({ amp: 0.4, w: 2.2 }, o));
  const TINT = 'rgba(120,140,235,0.12)';

  // an interactive canvas with a render loop that sleeps off screen / when the page is hidden
  function Stage(parent, W, Hh, touch) {
    const c = document.createElement('canvas'); parent.appendChild(c);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = Math.round(W * dpr); c.height = Math.round(Hh * dpr);
    Object.assign(c.style, { width: '100%', height: 'auto', aspectRatio: W + ' / ' + Hh, display: 'block', touchAction: touch || 'manipulation', userSelect: 'none', webkitUserSelect: 'none', webkitTouchCallout: 'none' });
    const ctx = c.getContext('2d');
    const S = { c, ctx, W, H: Hh, render: () => false };
    S.pos = (e) => { const r = c.getBoundingClientRect(); return [(e.clientX - r.left) * W / r.width, (e.clientY - r.top) * Hh / r.height]; };
    S.layer = (paint) => { const L = document.createElement('canvas'); L.width = Math.ceil(W * dpr); L.height = Math.ceil(Hh * dpr); const x = L.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.lineCap = 'round'; x.lineJoin = 'round'; paint(x); return L; };
    S.blit = (L) => ctx.drawImage(L, 0, 0, W, Hh);
    const hidden = () => { const p = c.closest('.page'); return !p || p.classList.contains('hidden') || !c.offsetParent; };
    let raf = 0, wait = 0, last = 0, vis = true;
    if (window.IntersectionObserver) new IntersectionObserver((es) => { vis = es[es.length - 1].isIntersecting; if (vis) S.go(); }, { rootMargin: '120px' }).observe(c);
    const tick = (now) => {
      raf = 0;
      if (!vis) { last = 0; return; }
      if (hidden()) { last = 0; if (!wait) wait = setTimeout(() => { wait = 0; S.go(); }, 500); return; }
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60; last = now;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.globalCompositeOperation = 'source-over'; ctx.clearRect(0, 0, W, Hh);
      ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = 1; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      if (S.render(dt, now / 1000)) raf = requestAnimationFrame(tick); else last = 0;
    };
    S.go = () => { if (!raf) raf = requestAnimationFrame(tick); };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { S.onFonts && S.onFonts(); S.go(); });
    return S;
  }

  // =========================================================================================================
  // the things on the conveyor: each is drawn standing on (0,0), about 90 wide and up to 100 tall
  // =========================================================================================================
  const D = {
    bottle(x, o) {
      const P = [[-17, 0], [-19, -8], [-19, -56], [-8, -78], [-8, -90], [8, -90], [8, -78], [19, -56], [19, -8], [17, 0], [-17, 0]];
      fillP(x, P, TINT); st(x, P, { seed: 3 });
      const cap = box(-9, -99, 18, 9); Ink.hatchFill(x, cap, 1, B, 2.4); st(x, closeP(cap), { seed: 5, w: 1.8 });
      st(x, [[-19, -46], [19, -46]], { seed: 7, w: 1.6 }); st(x, [[-19, -24], [19, -24]], { seed: 9, w: 1.6 });
      if (o === 'fizz') [[-8, -62], [5, -56], [-2, -70], [9, -14], [-9, -10], [0, -16]].forEach(([a, b]) => st(x, geo.ellipse(a, b, 2.6, 2.6), { seed: 11, w: 1.2, retrace: false }));
      else [-12, -8, -4].forEach((y, i) => st(x, [[-19, y], [19, y]], { seed: 13 + i, w: 1.2, retrace: false }));
    },
    milk(x) {
      const P = [[-26, 0], [-28, -58], [-14, -78], [-9, -78], [-9, -90], [11, -90], [11, -78], [22, -72], [29, -54], [28, 0], [-26, 0]];
      fillP(x, P, TINT); st(x, P, { seed: 3 });
      const cap = box(-11, -99, 24, 9); Ink.hatchFill(x, cap, 1, B, 2.4); st(x, closeP(cap), { seed: 5, w: 1.8 });
      st(x, geo.ellipse(15, -48, 6, 15), { seed: 7, w: 1.8 });
      st(x, closeP(box(-22, -40, 26, 26)), { seed: 9, w: 1.4, retrace: false });
    },
    bleach(x) {
      const P = [[-22, 0], [-22, -62], [-6, -80], [-6, -92], [10, -92], [10, -80], [22, -66], [22, 0], [-22, 0]];
      fillP(x, P, TINT); st(x, P, { seed: 3 });
      const cap = box(-8, -101, 20, 9); Ink.hatchFill(x, cap, 1, RD, 2.4); st(x, closeP(cap), { seed: 5, w: 1.8, color: RD });
      st(x, closeP([[0, -52], [15, -34], [0, -16], [-15, -34]]), { seed: 7, w: 1.6, color: RD });
      st(x, [[-5, -39], [5, -29]], { seed: 9, w: 1.6, color: RD, retrace: false }); st(x, [[5, -39], [-5, -29]], { seed: 11, w: 1.6, color: RD, retrace: false });
    },
    pipe(x) {
      st(x, [[-40, -52], [32, -52]], { seed: 3 }); st(x, [[-40, -8], [32, -8]], { seed: 5 });
      st(x, geo.ellipse(-40, -30, 9, 22), { seed: 7 }); st(x, geo.ellipse(32, -30, 9, 22), { seed: 9 });
      const inner = geo.ellipse(32, -30, 5.5, 16, 0, TAU); Ink.hatchFill(x, inner, 1, B, 2.6); st(x, closeP(inner), { seed: 11, w: 1.4 });
      st(x, geo.ellipse(-8, -30, 10, 25, -1.6, 1.6), { seed: 13, w: 1.8 }); st(x, geo.ellipse(-2, -30, 10, 25, -1.6, 1.6), { seed: 15, w: 1.8 });
    },
    lunch(x) {
      const b = box(-38, -40, 76, 40); fillP(x, b, TINT); st(x, closeP(b), { seed: 3 });
      st(x, [[-38, -30], [38, -30]], { seed: 5, w: 1.4, retrace: false });
      const lid = [[-38, -42], [34, -72], [37, -63], [-35, -33]]; fillP(x, lid, TINT); st(x, closeP(lid), { seed: 7 });
      st(x, geo.ellipse(-38, -40, 4, 4), { seed: 9, w: 1.6 });
      st(x, geo.rect(-8, -22, 16, 10, 3), { seed: 11, w: 1.6 });
    },
    crate(x) {
      const b = [[-42, -58], [42, -58], [38, 0], [-38, 0]]; fillP(x, b, TINT); st(x, closeP(b), { seed: 3 });
      st(x, [[-42, -48], [42, -48]], { seed: 5, w: 1.6 });
      [-26, 0, 26].forEach((cx, i) => [-34, -14].forEach((cy, j) => st(x, geo.rect(cx - 9, cy - 6, 18, 12, 3), { seed: 7 + i * 2 + j, w: 1.5, retrace: false })));
    },
    pot(x) {
      const P = [[-16, 0], [-24, -54], [24, -54], [16, 0]]; fillP(x, P, TINT); st(x, closeP(P), { seed: 3 });
      st(x, [[-27, -58], [27, -58]], { seed: 5, w: 2.6 });
      st(x, geo.curve([27, -58], [38, -66], [42, -80], [30, -84], 12), { seed: 7, w: 1.8 });
      st(x, geo.ellipse(0, -28, 11, 11), { seed: 9, w: 1.5 }); st(x, [[2, -39], [6, -45]], { seed: 11, w: 1.4, retrace: false });
    },
    tray(x) {
      const P = [[-46, -6], [-34, -46], [46, -46], [34, -6]]; fillP(x, P, TINT); st(x, closeP(P), { seed: 3 });
      [[-22, -34], [2, -34], [26, -34], [-28, -16], [-4, -16], [20, -16]].forEach(([cx, cy], i) => st(x, geo.ellipse(cx, cy, 8, 5.5), { seed: 5 + i, w: 1.5, retrace: false }));
      st(x, [[-46, -6], [-44, 0], [36, 0], [34, -6]], { seed: 13, w: 1.8 });
    },
    plug(x) {
      const b = geo.rect(-28, -80, 56, 62, 14); fillP(x, b, TINT); st(x, b, { seed: 3 });
      [box(-5, -70, 10, 18), box(-19, -42, 13, 8), box(6, -42, 13, 8)].forEach((p, i) => { Ink.hatchFill(x, p, 1, B, 2.6); st(x, closeP(p), { seed: 5 + i, w: 1.6 }); });
      st(x, geo.curve([0, -18], [0, -6], [14, -6], [22, 0], 12), { seed: 11, w: 3 });
    },
    handle(x) {
      const h = geo.rect(-46, -40, 70, 18, 9); Ink.hatchFill(x, h, 1, B, 2.2); Ink.hatchFill(x, h, 1, B, 1.4); st(x, h, { seed: 3 });
      st(x, geo.ellipse(-36, -31, 4, 4), { seed: 5, w: 1.6 });
      const br = box(24, -46, 14, 30); st(x, closeP(br), { seed: 7, w: 1.8 }); disc(x, 31, -38, 2.2, B); disc(x, 31, -24, 2.2, B);
      st(x, [[38, -31], [46, -31]], { seed: 9, w: 2.6 });
    },
    plate(x) {
      st(x, geo.ellipse(0, -18, 44, 15), { seed: 3 }); st(x, geo.ellipse(0, -19, 29, 9), { seed: 5, w: 1.6 });
      for (let i = 0; i < 10; i++) { const a = i * TAU / 10 + 0.3; disc(x, Math.cos(a) * 36.5, -18.5 + Math.sin(a) * 12, 2, RD, 0.75); }
      st(x, geo.ellipse(0, -14, 44, 15, 0.15, Math.PI - 0.15), { seed: 7, w: 1.6 });
    },
  };
  // code 0 = no stamp. bin: where it belongs.
  const ITEMS = [
    { id: 'fizzy', name: 'fizzy drink bottle', code: 1, bin: 'PET', d: 'bottle', o: 'fizz' },
    { id: 'milk', name: 'milk bottle', code: 2, bin: 'HDPE', d: 'milk' },
    { id: 'plug', name: 'electrical plug', code: 0, bin: 'NO', d: 'plug' },
    { id: 'pot', name: 'yoghurt pot', code: 6, bin: 'PS', d: 'pot' },
    { id: 'lunch', name: 'lunch box', code: 5, bin: 'PP', d: 'lunch' },
    { id: 'pipe', name: 'drain pipe', code: 3, bin: 'PVC', d: 'pipe' },
    { id: 'water', name: 'water bottle', code: 1, bin: 'PET', d: 'bottle' },
    { id: 'handle', name: 'saucepan handle', code: 0, bin: 'NO', d: 'handle' },
    { id: 'bleach', name: 'bleach bottle', code: 2, bin: 'HDPE', d: 'bleach' },
    { id: 'tray', name: 'packaging tray', code: 6, bin: 'PS', d: 'tray' },
    { id: 'crate', name: 'bottle crate', code: 5, bin: 'PP', d: 'crate' },
    { id: 'plate', name: 'picnic plate', code: 0, bin: 'NO', d: 'plate' },
  ];
  const IT = {}; ITEMS.forEach((i) => (IT[i.id] = i));
  const BINS = ['HDPE', 'PS', 'PET', 'NO', 'PP', 'PVC']; // mixed on purpose: not in code order
  const BINLAB = { HDPE: 'HDPE', PS: 'PS', PET: 'PET', PP: 'PP', PVC: 'PVC', NO: 'cannot be remelted' };
  const GW = 860, GH = 470, BELT = 190, BINY = 300, BELTEND = 716;
  const binX = (i) => 10 + i * 142, binCx = (i) => binX(i) + 65;
  const binAt = (px) => { const i = Math.floor((px - 4) / 142); return i >= 0 && i < 6 ? i : -1; };

  function stamp(x, cx, cy, code) {
    if (!code) { text(x, 'no', cx, cy - 2, { font: 'hand', size: 22, color: RD }); text(x, 'code', cx, cy + 22, { font: 'hand', size: 22, color: RD }); return; }
    const R = 36, V = [0, 1, 2].map((i) => { const a = -Math.PI / 2 + i * TAU / 3; return [cx + Math.cos(a) * R, cy + 5 + Math.sin(a) * R]; });
    for (let i = 0; i < 3; i++) {
      const a = V[i], b = V[(i + 1) % 3], L = (u) => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u], seg = [L(0.2), L(0.84)];
      st(x, seg, { seed: 31 + i, w: 2.2, color: RD, amp: 0.2 }); st(x, geo.head(seg, 9, 0.6), { seed: 37 + i, w: 2.2, color: RD, amp: 0.2, retrace: false });
    }
    text(x, String(code), cx, cy + 17, { size: 28, color: RD });
  }
  function drawItem(x, it, px, py, s = 1, a = 1) {
    x.save(); x.translate(px, py); x.scale(s, s); x.globalAlpha = a;
    D[it.d](x, it.o); stamp(x, 74, -58, it.code);
    x.font = HANDF(22); const half = x.measureText(it.name).width / 2 + 10; // keep the name on the canvas as the item rolls in
    text(x, it.name, s === 1 ? clamp(px + 8, half, GW - half) - px : 8, -116, { font: 'hand', size: 22 });
    x.restore();
  }

  // =========================================================================================================
  // the landfill time-lapse (860 × 300)
  // =========================================================================================================
  const WEEKS = 26000; // slider runs from 1 week to 500 years on a log scale
  const LIFE = { apple: 9, paper: 6, can: 2600, bottle: 23400 }; // weeks: about 2 months, 6 weeks, 50 years, 450 years
  const tOf = (u) => Math.pow(WEEKS, u);
  const U100 = Math.log(5200) / Math.log(WEEKS);
  const tWord = (w) => (w < 8 ? `${Math.max(1, Math.round(w))} week${Math.round(w) > 1 ? 's' : ''}` : w < 104 ? `${Math.round(w / 4.345)} months` : `${w >= 25900 ? 500 : Math.round(w / 52)} years`);
  const left = (w, life) => 1 - clamp(Math.log(Math.max(1, w)) / Math.log(life));
  function landfill(x, w, now) {
    st(x, [[20, 214], [200, 210], [430, 216], [640, 211], [840, 215]], { seed: 3, w: 2.6 });
    [[60, 232], [248, 240], [452, 236], [660, 242], [800, 232]].forEach(([a, b], i) => st(x, geo.ellipse(a, b, 9, 4), { seed: 5 + i, w: 1.3, retrace: false }));
    text(x, 'after ' + tWord(w), 430, 44, { size: 34 });
    const names = [['apple core', 'apple'], ['newspaper', 'paper'], ['steel can', 'can'], ['plastic bottle', 'bottle']];
    names.forEach(([nm, k], i) => {
      const cx = 115 + i * 210, f = left(w, LIFE[k]);
      text(x, nm, cx, 262, { font: 'hand', size: 22 });
      text(x, f > 0 ? 'still here' : k === 'bottle' ? 'tiny bits, still here' : 'gone', cx, 290, { size: 22, color: f > 0 || k === 'bottle' ? RD : GR });
      x.save(); x.translate(cx, 208); x.scale(1.45, 1.45);
      if (k === 'apple') {
        if (f > 0) { const s = 0.45 + 0.55 * f; x.scale(s, s); x.globalAlpha = 0.4 + 0.6 * f;
          const P = geo.curve([-20, -62], [-4, -50], [-4, -22], [-20, -6], 14).concat(geo.curve([-20, -6], [0, 2], [20, -6], [20, -6], 6), geo.curve([20, -6], [4, -22], [4, -50], [20, -62], 14), geo.curve([20, -62], [6, -70], [-6, -70], [-20, -62], 8));
          Ink.hatchFill(x, P, 1, [130, 80, 40], 0.4 + 2.4 * (1 - f)); st(x, P, { seed: 3 });
          st(x, [[0, -66], [4, -80]], { seed: 5, w: 2.4 }); disc(x, -1, -40, 2.2, B); disc(x, 1, -28, 2.2, B);
        } else [[-14, -3], [-2, -6], [10, -2]].forEach(([a, b]) => disc(x, a, b, 1.8, [130, 80, 40], 0.7));
      } else if (k === 'paper') {
        if (f > 0) { x.globalAlpha = 0.4 + 0.6 * f; const n = Math.max(1, Math.ceil(f * 5));
          for (let j = 0; j < n; j++) { const y0 = -8 - j * 11, sh = (1 - f) * ((j * 37) % 17 - 8); const P = box(-44 + sh, y0 - 9, 88, 9); fillP(x, P, TINT); st(x, closeP(P), { seed: 3 + j, w: 1.6 }); st(x, [[-36 + sh, y0 - 4], [34 + sh, y0 - 4]], { seed: 9 + j, w: 1.1, retrace: false }); }
        } else [[-20, -3], [0, -5], [18, -2]].forEach(([a, b]) => st(x, [[a - 4, b], [a + 4, b - 2]], { seed: 3, w: 1.2, retrace: false }));
      } else if (k === 'can') {
        if (f > 0) { x.globalAlpha = 0.45 + 0.55 * f;
          const body = [[-24, -64], [-24, -6]].concat(geo.ellipse(0, -6, 24, 7, Math.PI, 0), [[24, -64]]);
          Ink.hatchFill(x, body, 1, RD, 0.2 + 3 * (1 - f)); st(x, body, { seed: 3 }); st(x, geo.ellipse(0, -64, 24, 7), { seed: 5 });
          [-48, -22].forEach((y, j) => st(x, geo.ellipse(0, y, 24, 7, Math.PI, 0), { seed: 7 + j, w: 1.3, retrace: false }));
          if (f < 0.45) [[-8, -40, 7], [10, -24, 5], [6, -52, 4]].forEach(([a, b, r], j) => { if (f < 0.45 - j * 0.12) { const hole = geo.ellipse(a, b, r, r * 1.2, 0, TAU); Ink.hatchFill(x, hole, 1, RD, 3); st(x, closeP(hole), { seed: 11 + j, w: 1.5, color: RD }); } });
        } else for (let j = 0; j < 7; j++) disc(x, -24 + j * 8, -3 - (j % 2) * 3, 2, RD, 0.6);
      } else {
        if (f > 0) { x.translate(0, -22); x.rotate(-Math.PI / 2 + 0.06); x.translate(0, 50); D.bottle(x, 'plain');
          if (f < 0.42) [[-14, -60, 10, -40], [8, -30, -12, -14], [-6, -76, 6, -64]].forEach(([a, b, c, d], j) => { if (f < 0.42 - j * 0.1) st(x, [[a, b], [(a + c) / 2 + 5, (b + d) / 2 - 3], [c, d]], { seed: 21 + j, w: 1.8, color: RD, retrace: false }); });
        } else { const r = H.rng(77); for (let j = 0; j < 16; j++) { const a = r.range(-58, 58), b = r.range(-22, -3), q = r.range(2.5, 6), an = r.range(0, 3); st(x, closeP([[a - q, b], [a + Math.cos(an) * q, b - q * 0.7], [a + q * 0.6, b + q * 0.4]]), { seed: 23 + j, w: 1.4, retrace: false, amp: 0.1 }); } }
      }
      x.restore();
    });
  }

  Book.page({
    id: 'p07',
    title: 'Polymers & the planet',
    build(ui, root) {
      const css = document.createElement('style');
      css.textContent = `
        .p07-game{position:relative;margin:0 0 calc(var(--R)*1.4);padding:10px 12px 14px;background:rgba(251,250,245,.9)}
        .p07-game canvas{cursor:grab}
        .p07-row{display:flex;flex-wrap:wrap;gap:10px 14px;align-items:center}
        .p07-row .btn{margin-top:0}
        .p07-msg{flex:1 1 240px;font-size:18px;line-height:1.45;min-height:26px}
        .p07-msg.good{color:var(--green)}.p07-msg.bad{color:var(--red)}
        .p07-codes{display:flex;flex-wrap:wrap;gap:8px;margin:6px 0 8px}
        .p07-codes span{font:600 18px Fredoka;border:2px solid rgba(178,28,38,.55);color:var(--red);border-radius:10px;padding:2px 10px;background:#fff;white-space:nowrap}
        .p07-codes span b{font-size:22px;margin-right:4px}
        .p07-range{-webkit-appearance:none;appearance:none;width:100%;height:52px;background:transparent;margin:0;touch-action:pan-x;cursor:pointer}
        .p07-range::-webkit-slider-runnable-track{height:10px;border-radius:6px;background:rgba(30,46,150,.25);border:1.5px solid rgba(30,46,150,.55)}
        .p07-range::-moz-range-track{height:10px;border-radius:6px;background:rgba(30,46,150,.25);border:1.5px solid rgba(30,46,150,.55)}
        .p07-range::-webkit-slider-thumb{-webkit-appearance:none;width:46px;height:46px;border-radius:50%;background:#fff;border:4px solid var(--ink);margin-top:-20px;box-shadow:0 3px 0 #0c1660}
        .p07-range::-moz-range-thumb{width:40px;height:40px;border-radius:50%;background:#fff;border:4px solid var(--ink);box-shadow:0 3px 0 #0c1660}
        .p07-range:disabled{opacity:.35}
        .p07-ends{display:flex;justify-content:space-between;font:600 15px Fredoka;line-height:20px;margin:-6px 4px 6px}
        .p07-lives{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:6px 14px;margin:6px 0 0;font-size:18px;line-height:1.4}
        .p07-lives b{font-family:Fredoka;font-weight:600}`;
      root.appendChild(css);
      const items = Book.state.items;

      ui.h('Polymers & the planet');
      ui.p('Polymers are brilliant materials, but they cause problems when we throw them away. First job: you are working at the <b>recycling centre</b>.');

      // ------------------------------------------------------------------ 1. the conveyor ------------------------------------------------------------------
      const codes = ui.box(`Thermoforming polymers can be <b>recycled</b>: collected, <b>sorted by type</b>, shredded, melted and made into new products. To help with sorting, each one is stamped with a <b>code</b>: a number in a triangle of arrows.
        <div class="p07-codes"><span><b>1</b>PET</span><span><b>2</b>HDPE</span><span><b>3</b>PVC</span><span><b>4</b>LDPE</span><span><b>5</b>PP</span><span><b>6</b>PS (polystyrene)</span><span><b>7</b>other</span></div>
        <b>Thermosetting</b> polymers have no code: they <b>cannot be remelted</b>.`, { tag: 'Notes: learn the codes' });
      ui.p('Learn the codes, then start the belt. <b>Flick or drag</b> each item into the right bin (or just tap the bin). <span class="small">The notes blur while the belt is running, and your <b>first run</b> is the one that is marked.</span>');

      const game = ui.el('div', 'p07-game'); requestAnimationFrame(() => Ink.frame(game, { w: 2.4 }));
      const S = Stage(game, GW, GH, 'none');
      const row = ui.el('div', 'p07-row', '', game);
      const startBtn = ui.el('button', 'btn', '', row); startBtn.type = 'button';
      const msg = ui.el('div', 'p07-msg', '', row);
      const rec = ui.record('p07.sort', { label: 'Recycling conveyor: 12 items into the right bin (first run)', type: 'game', max: ITEMS.length });
      const sv = rec.get() || {};
      const res = (sv.res || []).filter((r) => IT[r.id]).slice(), practice = (sv.practice || []).slice();
      let run = null;
      const firstDone = () => res.length >= ITEMS.length;
      const say = (cls, html) => { msg.className = 'p07-msg ' + cls; msg.innerHTML = html; };
      function commit() {
        const score = res.filter((r) => r.ok).length, done = firstDone();
        const wrong = res.filter((r) => !r.ok).map((r) => `${IT[r.id].name} (${IT[r.id].code ? 'code ' + IT[r.id].code : 'no code'})→${BINLAB[r.bin]}`);
        rec.set({ answer: `${score}/${res.length}${done ? '' : ' so far'}` + (wrong.length ? '. Wrong: ' + wrong.join('; ') : done ? ', all right first time' : '') + (practice.length ? '. Practice runs: ' + practice.join(', ') : ''),
          correct: done ? score === ITEMS.length : null, score, max: ITEMS.length, mis: [...new Set(res.filter((r) => !r.ok).map((r) => r.mis))].join(','), res, practice });
      }
      function idle() {
        run = null; codes.classList.remove('peek-lock'); startBtn.style.display = '';
        startBtn.textContent = firstDone() ? '↻ Sort them again (practice)' : res.length ? '▶ Carry on sorting' : '▶ Start the belt';
        if (firstDone() && !msg.innerHTML) { const sc = res.filter((r) => r.ok).length; say(sc === ITEMS.length ? 'good' : '', `Your marked run: <b>${sc} / ${ITEMS.length}</b> in the right bin.` + (practice.length ? ` Practice: ${practice.join(', ')}.` : '')); }
        S.go();
      }
      function start() {
        const pr = firstDone();
        run = { pr, out: pr ? [] : res, queue: (pr ? ITEMS : ITEMS.filter((i) => !res.find((r) => r.id === i.id))).map((i) => i.id), it: null, phase: 'gap', t: 0, pops: [], tread: 0, total: ITEMS.length };
        codes.classList.add('peek-lock'); startBtn.style.display = 'none'; say('', 'Here they come…'); Book.sfx('click', { gain: 0.6 }); S.go();
      }
      startBtn.onclick = start;
      function judge(bi) {
        const r = run, it = IT[r.it.id], chosen = BINS[bi], ok = chosen === it.bin;
        const mis = ok ? '' : it.bin === 'NO' ? 'thermoset-recycle' : chosen === 'NO' ? 'thermo-swap' : 'code-mixup';
        r.out.push({ id: it.id, bin: chosen, ok, mis }); r.pops.push({ x: binCx(bi), ok, t: 0 });
        Book.sfx(ok ? 'success' : 'error', { gain: 0.35 });
        if (ok) say('good', it.code ? `✓ Code ${it.code} is ${it.bin}.` : `✓ No code: the ${it.name} is a thermosetting polymer. It cannot be remelted.`);
        else say('bad', '✗ ' + (it.bin === 'NO' ? `No code: the ${it.name} is a <b>thermosetting</b> polymer. It chars instead of melting, so it cannot be remelted.` : chosen === 'NO' ? `It has a code, so it is a thermoforming polymer and <b>can</b> be remelted. Code ${it.code} is <b>${it.bin}</b>.` : `Code ${it.code} is <b>${it.bin}</b>, not ${chosen}.`) + ' <span class="small">(The red pen has moved it.)</span>');
        if (!r.pr) commit();
        if (ok) { r.phase = 'drop'; r.t = 0; } else { r.phase = 'hop'; r.t = 0; r.from = [binCx(bi), BINY + 8]; r.to = [binCx(BINS.indexOf(it.bin)), BINY + 8]; }
      }
      function flyTo(bi) { const r = run; r.phase = 'fly'; r.t = 0; r.bi = bi; r.from = [r.it.x, r.it.y]; r.to = [binCx(bi), BINY + 8]; Book.sfx('paper', { gain: 0.3, dur: 0.15 }); S.go(); }
      function finish() {
        const r = run, sc = r.out.filter((q) => q.ok).length;
        if (r.pr) { practice.push(`${sc}/${ITEMS.length}`); commit(); }
        say(sc === ITEMS.length ? 'good' : '', (r.pr ? 'Practice run: ' : 'Your marked run: ') + `<b>${sc} / ${ITEMS.length}</b> in the right bin.` + (sc === ITEMS.length ? ' Perfect sorting!' : ' Check the codes again in the notes above.'));
        idle();
      }
      // pointer: drag / flick the item, or tap a bin
      let grab = null, tapBin = -1;
      const cv = S.c;
      cv.addEventListener('pointerdown', (e) => {
        if (!run) return; const p = S.pos(e), r = run; tapBin = -1;
        if (r.phase === 'belt' && Math.abs(p[0] - r.it.x - 8) < 78 && p[1] > BELT - 150 && p[1] < BELT + 36) {
          e.preventDefault(); try { cv.setPointerCapture(e.pointerId); } catch (_) {}
          grab = { id: e.pointerId, dx: r.it.x - p[0], dy: r.it.y - p[1], h: [[p[0], p[1], performance.now()]] }; r.phase = 'drag'; cv.style.cursor = 'grabbing'; Book.sfx('tick', { gain: 0.4 }); S.go();
        } else if (p[1] > BINY - 12) tapBin = binAt(p[0]);
      });
      cv.addEventListener('pointermove', (e) => {
        if (!grab || e.pointerId !== grab.id || !run) return; const p = S.pos(e);
        run.it.x = clamp(p[0] + grab.dx, 20, GW - 20); run.it.y = clamp(p[1] + grab.dy, 110, BINY + 60);
        grab.h.push([p[0], p[1], performance.now()]); if (grab.h.length > 6) grab.h.shift();
      });
      const release = (e, cancel) => {
        const r = run;
        if (grab && e.pointerId === grab.id) {
          const h = grab.h, a = h[0], b = h[h.length - 1], dt = Math.max(0.016, (b[2] - a[2]) / 1000), vx = (b[0] - a[0]) / dt, vy = (b[1] - a[1]) / dt;
          grab = null; cv.style.cursor = '';
          if (!r || r.phase !== 'drag') return;
          let bi = -1;
          if (!cancel) { if (r.it.y > BINY - 6) bi = binAt(r.it.x); else if (vy > 420) bi = binAt(r.it.x + vx * ((BINY + 20 - r.it.y) / vy)); }
          if (bi >= 0) flyTo(bi); else { r.phase = 'belt'; r.it.x = clamp(r.it.x, 30, BELTEND - 40); r.it.y = BELT; }
        } else if (r && !cancel && tapBin >= 0 && r.phase === 'belt' && r.it.x > 24) { const p = S.pos(e); if (binAt(p[0]) === tapBin && p[1] > BINY - 12) flyTo(tapBin); }
        tapBin = -1;
      };
      cv.addEventListener('pointerup', (e) => release(e, false));
      cv.addEventListener('pointercancel', (e) => release(e, true));

      let bg = null; S.onFonts = () => { bg = null; };
      const paintBg = (x) => {
        // the belt
        const belt = geo.rect(-20, BELT, BELTEND + 20, 22, 11); st(x, belt, { seed: 3, w: 2.6 });
        [40, 250, 470, 690].forEach((cx, i) => { st(x, geo.ellipse(cx, BELT + 11, 8, 8), { seed: 5 + i, w: 1.8 }); disc(x, cx, BELT + 11, 2, B); });
        [[110, 0], [600, 1]].forEach(([cx, i]) => { st(x, [[cx - 14, BELT + 22], [cx - 22, BINY - 14]], { seed: 11 + i, w: 2.4 }); st(x, [[cx + 14, BELT + 22], [cx + 22, BINY - 14]], { seed: 13 + i, w: 2.4 }); });
        // the "round again" chute at the end of the belt
        st(x, [[BELTEND + 8, BELT + 6], [BELTEND + 40, BELT + 40], [BELTEND + 40, BELT + 84]], { seed: 17, w: 2.2 }); st(x, [[GW - 14, BELT - 40], [GW - 14, BELT + 84]], { seed: 19, w: 2.2 });
        text(x, 'round', BELTEND + 86, BELT + 54, { font: 'hand', size: 22, a: 0.7 }); text(x, 'again', BELTEND + 86, BELT + 80, { font: 'hand', size: 22, a: 0.7 });
        // the bins
        BINS.forEach((b, i) => {
          const x0 = binX(i), P = [[x0 + 3, BINY + 8], [x0 + 127, BINY + 8], [x0 + 117, GH - 16], [x0 + 13, GH - 16]];
          Ink.hatchShadow(x, P, 1, 6, 6); fillP(x, P, 'rgba(120,140,235,0.08)');
          Ink.hatchFill(x, [[x0 + 11, GH - 44], [x0 + 119, GH - 44], [x0 + 117, GH - 16], [x0 + 13, GH - 16]], 1, B, 1.6);
          st(x, closeP(P), { seed: 21 + i, w: 2.6 });
          const rim = geo.rect(x0 - 1, BINY - 4, 132, 14, 6); st(x, rim, { seed: 31 + i, w: 2.4 });
          if (b === 'NO') { text(x, 'cannot be', x0 + 65, BINY + 62, { size: 22, color: RD }); text(x, 'remelted', x0 + 65, BINY + 90, { size: 22, color: RD }); }
          else text(x, b, x0 + 65, BINY + 82, { size: 34 });
        });
      };
      S.render = (dt, now) => {
        const x = S.ctx; if (!bg) bg = S.layer(paintBg); S.blit(bg);
        const r = run;
        // belt treads
        const off = r ? (r.tread = (r.tread + (r.phase === 'drag' ? 0 : 46) * dt) % 44) : 0;
        x.save(); x.strokeStyle = rgba(B, 0.55); x.lineWidth = 2; x.beginPath(); for (let tx = off - 10; tx < BELTEND - 8; tx += 44) if (tx > 0) { x.moveTo(tx, BELT + 4); x.lineTo(tx - 7, BELT + 18); } x.stroke(); x.restore();
        if (!r) {
          if (firstDone()) { Ink.drawBubble(x, 'All sorted!', 300, 130, 56, B, 1, -0.02, 'center'); Ink.tick(x, 500, 120, 2); }
          else { const nxt = ITEMS.find((i) => !res.find((q) => q.id === i.id)); drawItem(x, nxt, 120, BELT); text(x, res.length ? `${res.length} sorted, ${ITEMS.length - res.length} to go` : `${ITEMS.length} items to sort`, 470, 110, { font: 'hand', size: 26 }); }
          return false;
        }
        r.t += dt;
        if (r.phase === 'gap' && r.t > 0.45) { if (!r.queue.length) { finish(); return true; } r.it = { id: r.queue.shift(), x: -60, y: BELT }; r.phase = 'belt'; }
        const it = r.it; let s = 1, al = 1;
        if (it) {
          if (r.phase === 'belt') { it.x += 46 * dt; it.y = BELT; if (it.x > BELTEND + 14) { r.phase = 'fall'; r.t = 0; r.queue.push(it.id); say('', 'Missed that one: it will come round again.'); Book.sfx('thud', { gain: 0.3 }); } }
          else if (r.phase === 'fall') { it.y += (120 + 700 * r.t) * dt; it.x += 30 * dt; al = clamp(1 - r.t / 0.45); if (r.t > 0.45) { r.it = null; r.phase = 'gap'; r.t = 0; } }
          else if (r.phase === 'fly') { const u = clamp(r.t / 0.22); it.x = r.from[0] + (r.to[0] - r.from[0]) * u; it.y = r.from[1] + (r.to[1] - r.from[1]) * u - Math.sin(u * Math.PI) * 26; s = 1 - 0.25 * u; if (u >= 1) judge(r.bi); }
          else if (r.phase === 'hop') { const u = clamp(r.t / 0.75); it.x = r.from[0] + (r.to[0] - r.from[0]) * u; it.y = r.from[1] - Math.sin(u * Math.PI) * 120; s = 0.75; if (u >= 1) { r.phase = 'drop'; r.t = 0; r.pops.push({ x: r.to[0], ok: true, t: 0, soft: true }); } }
          else if (r.phase === 'drop') { const u = clamp(r.t / 0.3); it.y = BINY + 8 + u * 50; s = 0.75 - 0.3 * u; al = 1 - u; if (u >= 1) { r.it = null; r.phase = 'gap'; r.t = 0; } }
        }
        if (r.it) drawItem(x, IT[r.it.id], r.it.x, r.it.y, s, al);
        if (r.phase === 'hop') { const P = geo.rect(r.to[0] - 70, BINY - 10, 140, GH - BINY, 10); st(x, P, { seed: 5, w: 3, color: RD }); }
        r.pops = r.pops.filter((p) => (p.t += dt) < 1.1);
        r.pops.forEach((p) => { x.save(); x.globalAlpha = clamp((1.1 - p.t) * 3); const y = BINY - 34 - p.t * 26; if (p.ok) Ink.tick(x, p.x - 10, y, 1.5, p.soft ? RD : GR); else Ink.cross(x, p.x, y, 1.6); x.restore(); });
        const done = r.out.length, good = r.out.filter((q) => q.ok).length;
        text(x, `${r.pr ? 'practice: ' : ''}item ${Math.min(r.total, done + 1)} of ${r.total}`, 16, 30, { size: 22, align: 'left' });
        text(x, `✓ ${good}   ✗ ${done - good}`, GW - 16, 30, { size: 22, align: 'right', color: done - good ? RD : GR });
        return true;
      };
      idle();

      // ------------------------------------------------------------------ 2. landfill time-lapse ------------------------------------------------------------------
      ui.h('How long does rubbish last?', { size: 40 });
      ui.p('Four bits of litter are buried in a <b>landfill</b> site: an apple core, a newspaper, a steel can and a plastic bottle. <b>Predict first</b>, then drag the time slider to dig them up again.');
      const tl = ui.record('p07.timelapse', { label: 'Landfill time-lapse: how far the slider was dragged', type: 'explore', max: 0 });
      const OPT = ['Only the steel can', 'Only the plastic bottle', 'The can and the bottle', 'None: all four have gone'], RIGHT = OPT[1];
      let lifeBox = null, tlFb = null, notes1 = null, range = null, wrapTL = null;
      let maxU = (tl.get() || {}).maxU || 0;
      const predicted = () => (items['p07.predict'] || {}).answer;
      ui.predict({ id: 'p07.predict', label: 'Prediction: what is still in the landfill after 100 years?', q: 'After <b>100 years</b>, which of the four will still be there?', options: OPT,
        onPick() { range.disabled = false; wrapTL.classList.remove('peek-lock'); reveal(); } });
      wrapTL = ui.el('div', 'p07-game'); requestAnimationFrame(() => Ink.frame(wrapTL, { w: 2.4 }));
      const T = Stage(wrapTL, 860, 300, 'pan-y');
      range = ui.el('input', 'p07-range', null, wrapTL); range.type = 'range'; range.min = 0; range.max = 1000; range.step = 1; range.value = Math.round(maxU * 1000); range.setAttribute('aria-label', 'time');
      ui.el('div', 'p07-ends', '<span>1 week</span><span>drag ▸ time passes</span><span>500 years</span>', wrapTL);
      tlFb = ui.el('div', 'fb', '', wrapTL);
      lifeBox = ui.el('div', 'p07-lives', '<span>apple core: about <b>2 months</b></span><span>newspaper: about <b>6 weeks</b></span><span>steel can: about <b>50 years</b></span><span>plastic bottle: about <b>450 years</b>, and then only into tiny bits</span>', wrapTL);
      lifeBox.style.display = 'none';
      T.render = () => { landfill(T.ctx, tOf(range.value / 1000), 0); return false; };
      notes1 = ui.box('Most polymers are <b>not biodegradable</b>. They last for <b>hundreds of years</b> in landfill, litter the oceans and slowly break up into tiny pieces called <span class="key">microplastics</span>.<br>They are also made from <b>crude oil</b>, a <b>finite</b> fossil fuel, and making them uses energy and releases <b>CO<sub>2</sub></b>.', { tag: 'Notes: the problem' });
      function reveal() {
        const p = predicted();
        if (p && maxU >= U100 - 0.002) { const ok = p === RIGHT; tlFb.className = 'fb on ' + (ok ? 'good' : 'bad'); tlFb.innerHTML = (ok ? '✓ ' : '✗ ') + `After 100 years only the <b>plastic bottle</b> is left: even the steel can has rusted away. You predicted: "${Book.esc(p)}".`; }
        const end = !!p && maxU >= 0.985; lifeBox.style.display = end ? '' : 'none'; notes1.style.display = end ? '' : 'none';
      }
      let tlTimer = 0;
      const saveTL = () => { const p = predicted(), seen = maxU >= U100 - 0.002; tl.set({ answer: `dragged to ${tWord(tOf(maxU))}` + (p && seen ? `; predicted "${p}" (${p === RIGHT ? 'right' : 'wrong'})` : ''), correct: null, maxU, mis: seen && p === OPT[3] ? 'oil-renewable' : '' }); };
      range.addEventListener('input', () => { const u = range.value / 1000; if (u > maxU) { maxU = u; clearTimeout(tlTimer); tlTimer = setTimeout(saveTL, 500); } reveal(); T.go(); });
      range.addEventListener('change', () => { clearTimeout(tlTimer); if ((tl.get() || {}).maxU !== maxU && maxU > 0) saveTL(); });
      if (!predicted()) { range.disabled = true; wrapTL.classList.add('peek-lock'); }
      reveal(); T.go();

      // ------------------------------------------------------------------ 3. what can designers do? ------------------------------------------------------------------
      ui.h('What can we do about it?', { size: 40 });
      const notes2 = ui.box(`<b>Reduce:</b> use less polymer in the first place (for example, less packaging).<br><b>Reuse:</b> use the same product again and again (for example, refill bottles).<br><b>Recycle:</b> collect, sort, shred and melt thermoforming polymers into new products. Designers <b>label each part with its code</b> so it can be taken apart and sorted (design for disassembly).<br><b>Bio-polymers</b> such as <span class="key">PLA</span> are made from <b>plants</b> like corn starch, and they are <b>biodegradable</b>.<br>Thermosets cannot be remelted: at best they are ground up and used as a filler.`, { tag: 'Notes: reduce, reuse, recycle' });
      ui.p('Read the notes, then answer from memory. <span class="small">(The notes on this page blur until you have finished the last four questions.)</span>');
      const zone = ui.el('div', '');
      const mount = (e) => zone.appendChild(e);
      mount(ui.sort({ id: 'p07.actions', label: 'Sort 6 actions: reduce / reuse / recycle', q: 'Which of the three is each idea? Tap a card, then tap its box.', buckets: ['Reduce', 'Reuse', 'Recycle'], items: [
        { t: 'Sell apples loose, not on a plastic tray', b: 0 }, { t: 'Design a bottle with thinner walls', b: 0 },
        { t: 'Fill the same water bottle every morning', b: 1 }, { t: 'Keep screws in an old ice-cream tub', b: 1 },
        { t: 'Shred old milk bottles and melt them into pipes', b: 2 }, { t: 'Stamp a 5 on a PP lid so it can be sorted', b: 2 },
      ], explain: 'All sorted! Reduce comes first: the best waste is the waste you never make.' }));
      mount(ui.mcq({ id: 'p07.bio', label: 'Bio-polymers: how PLA differs from PET', q: '<b>PLA</b> is a bio-polymer. How is it different from a polymer like PET?', options: [
        { t: 'It is made from plants, and it is biodegradable', ok: true, why: 'PLA is made from plants like corn starch, not crude oil, and it is biodegradable.' },
        { t: 'It is made from crude oil, but it is biodegradable', mis: 'polymer-source', why: 'Bio-polymers are not made from crude oil. Think about what "bio" tells you.' },
        { t: 'It is made from plants, but it lasts for centuries', mis: 'oil-renewable', why: 'Half right: it does come from plants. But what happens to it after it is thrown away?' },
        { t: 'It is made from old bottles, and it cannot be melted', mis: 'thermoset-recycle', why: 'That mixes up recycling and thermosets. A bio-polymer is about where the material comes from.' },
      ] }));
      mount(ui.tf({ id: 'p07.tf-micro', label: 'T/F: a plastic bottle in the sea rots away in a few years', statement: 'A plastic bottle dropped in the sea will rot away completely within a few years.', answer: false, mis: 'oil-renewable',
        explain: 'Most polymers are not biodegradable. The bottle lasts for hundreds of years and only breaks up into tiny microplastics.' }));
      mount(ui.tf({ id: 'p07.tf-thermoset', label: 'T/F: old thermoset plugs can be melted into new plugs', statement: 'Old electrical plugs can be shredded, melted and moulded into new plugs.', answer: false, mis: 'thermoset-recycle',
        explain: 'Plugs are a thermosetting polymer: it cannot be remelted. At best it is ground up and used as a filler.' }));
      // blur every note on the page while the last four questions are being answered
      const fin = (id, one) => { const it = items[id]; return !!it && (it.correct === true || it.attempts >= (one ? 1 : 3)); };
      const allDone = () => fin('p07.actions') && fin('p07.bio') && fin('p07.tf-micro', true) && fin('p07.tf-thermoset', true);
      const lock = (on) => [codes, notes1, notes2, wrapTL].forEach((e) => { if (e === codes && run) return; if (e === wrapTL && !predicted()) return; e.classList.toggle('peek-lock', on); });
      zone.addEventListener('pointerdown', () => { if (!allDone()) lock(true); }, { passive: true });
      zone.addEventListener('click', () => setTimeout(() => { if (allDone()) lock(false); }, 60));
    },
  });
})();
