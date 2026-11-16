// Page 6 — Name that plastic: eight unlabelled everyday items, five tools (look & feel, flex, heat, float, recycling
// stamp). The student gathers clues with the tools, then names the polymer each item is made from.
(function () {
  'use strict';
  const B = Ink.BLUE, R = Ink.RED, G = Ink.GREEN, rgba = Ink.rgba, geo = Ink.geo;
  const PAPER = '#fbfaf5';
  const HAND = (s) => `400 ${s}px "Gloria Hallelujah", "Comic Sans MS", cursive`;
  const LAB = (s, w = 600) => `${w} ${s}px Fredoka, "Arial Rounded MT Bold", system-ui`;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  function css() {
    if (document.getElementById('p06p-css')) return;
    const s = document.createElement('style'); s.id = 'p06p-css';
    s.textContent = `
      .p06p-lab { margin: 0 0 calc(var(--R) * 1.4); padding: 14px 18px 16px; }
      .p06p-cv { display: block; width: 100%; height: auto; touch-action: none; user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; cursor: pointer; }
      .p06p-row { display: flex; flex-wrap: wrap; gap: 6px; margin: 0 0 8px; }
      .p06p-row .opt { flex: 1 1 92px; text-align: center; min-height: 46px; padding: 4px 4px; font-size: 16px; line-height: 1.2; }
      .p06p-row.tools .opt { flex: 1 1 120px; font-family: Fredoka, system-ui; font-weight: 600; }
      .p06p-row .opt.ok { border-color: var(--green); background: rgba(24,110,60,.1); }
      .p06p-row .opt.no { border-color: var(--red); background: rgba(178,28,38,.08); }
      .p06p-row .opt.used::after { content: ' \\2713'; color: var(--green); font-family: Fredoka; }
      .p06p-clues { font-size: 17px; line-height: 1.45; margin: 6px 0 10px; }
      .p06p-clues b { font-family: Fredoka; font-weight: 600; }
      .p06p-clues .q { color: rgba(30,46,150,.45); }
      .p06p-ask { font: 600 19px Fredoka, system-ui; margin: 0 0 6px; }
      .p06p-ans .opt { flex: 1 1 100px; font-family: Fredoka, system-ui; font-weight: 600; font-size: 17px; }
      .p06p-score { font: 600 19px Fredoka, system-ui; margin: 8px 0 0; }
    `;
    document.head.appendChild(s);
  }

  // ---------- canvas helpers ----------
  function stage(parent, w, h, cls) {
    const c = document.createElement('canvas'); c.className = cls; parent.appendChild(c);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = w * dpr; c.height = h * dpr; c.style.aspectRatio = w + ' / ' + h;
    const ctx = c.getContext('2d');
    const S = { c, ctx, w, h, visible: true, dirty: true };
    S.pos = (e) => { const r = c.getBoundingClientRect(); return [(e.clientX - r.left) * w / r.width, (e.clientY - r.top) * h / r.height]; };
    S.begin = () => { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'source-over'; ctx.clearRect(0, 0, c.width, c.height); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.globalCompositeOperation = 'multiply'; ctx.lineCap = ctx.lineJoin = 'round'; };
    if (window.IntersectionObserver) new IntersectionObserver((es) => { S.visible = es[es.length - 1].isIntersecting; if (S.visible) S.dirty = true; }).observe(c);
    return S;
  }
  function run(root, S, step) {
    let last = performance.now();
    const f = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const pg = root.closest('.page');
      if (!(pg && pg.classList.contains('hidden')) && S.visible) step(dt);
      requestAnimationFrame(f);
    };
    requestAnimationFrame(f);
  }
  function text(ctx, s, x, y, o = {}) {
    ctx.save(); ctx.globalCompositeOperation = 'multiply';
    ctx.font = o.font === 'lab' ? LAB(o.size || 22) : HAND(o.size || 22);
    ctx.fillStyle = rgba(o.color || B, o.a ?? 0.92); ctx.textAlign = o.align || 'left'; ctx.textBaseline = 'alphabetic';
    ctx.translate(x, y); if (o.rot) ctx.rotate(o.rot); ctx.fillText(s, 0, 0); ctx.restore();
  }
  const poly = (ctx, pts) => { ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); };
  function hatch(ctx, pts, col = B, a = 0.4, sp = 6, dir = 1, lw = 1) {
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; pts.forEach(([x, y]) => { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); });
    ctx.save(); poly(ctx, pts); ctx.clip(); ctx.strokeStyle = rgba(col, a); ctx.lineWidth = lw; ctx.beginPath();
    if (dir > 0) { for (let c = Math.floor((x0 + y0) / sp) * sp; c < x1 + y1 + sp; c += sp) { const j = ((c * 7919) % 7) / 7 - 0.5; ctx.moveTo(c - y0 + 2 + j, y0 - 2); ctx.lineTo(c - y1 - 2 + j, y1 + 2); } }
    else { for (let c = Math.floor((x0 - y1) / sp) * sp; c < x1 - y0 + sp; c += sp) { const j = ((c * 7919) % 7) / 7 - 0.5; ctx.moveTo(c + y0 - 2 + j, y0 - 2); ctx.lineTo(c + y1 + 2 + j, y1 + 2); } }
    ctx.stroke(); ctx.restore();
  }
  const paperFill = (ctx, pts) => { ctx.save(); ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = PAPER; poly(ctx, pts); ctx.fill(); ctx.restore(); };
  const line = (ctx, pts, o = {}) => Ink.stroke(ctx, pts, Object.assign({ w: 2.4 }, o));
  const rot = (pts, cx, cy, a) => pts.map(([x, y]) => { const dx = x - cx, dy = y - cy; return [cx + dx * Math.cos(a) - dy * Math.sin(a), cy + dx * Math.sin(a) + dy * Math.cos(a)]; });
  const closed = (P) => P.concat([P[0]]);

  function wrap(ctx, s, maxW, font) {
    ctx.save(); ctx.font = font; const out = []; let cur = '';
    s.split(' ').forEach((w) => { const t = cur ? cur + ' ' + w : w; if (ctx.measureText(t).width > maxW && cur) { out.push(cur); cur = w; } else cur = t; });
    if (cur) out.push(cur); ctx.restore(); return out;
  }
  const wavy = (x, y0, y1, amp, ph) => { const o = []; for (let y = y0; y >= y1; y -= 6) o.push([x + Math.sin((y0 - y) * 0.09 + ph) * amp, y]); return o; };

  // ---------- the data ----------
  const POL = [
    { k: 'acrylic', name: 'Acrylic', fam: 'tf', trait: 'Acrylic is hard, stiff and shiny, but brittle' },
    { k: 'hips', name: 'HIPS', fam: 'tf', trait: 'HIPS is lightweight, fairly rigid and very easy to vacuum form' },
    { k: 'hdpe', name: 'HDPE', fam: 'tf', trait: 'HDPE is stiff, tough and opaque, with a waxy feel' },
    { k: 'pp', name: 'PP', fam: 'tf', trait: 'PP is tough and flexible, and can bend again and again' },
    { k: 'pvc', name: 'PVC', fam: 'tf', trait: 'PVC is hard, tough and weather-resistant' },
    { k: 'pet', name: 'PET', fam: 'tf', trait: 'PET is clear, tough and lightweight, and keeps fizz in' },
    { k: 'er', name: 'ER', fam: 'ts', trait: 'Epoxy resin is the two-part adhesive, also used for circuit boards' },
    { k: 'mf', name: 'MF', fam: 'ts', trait: 'Melamine formaldehyde is scratch-, heat- and stain-resistant, in bright colours' },
    { k: 'pf', name: 'PF', fam: 'ts', trait: 'Phenol formaldehyde is very heat-resistant and only comes in dark colours' },
    { k: 'pr', name: 'PR', fam: 'ts', trait: 'Polyester resin is the one reinforced with glass fibre to make GRP' },
    { k: 'uf', name: 'UF', fam: 'ts', trait: 'Urea formaldehyde is a white or pale electrical insulator' },
  ];
  const TOOLS = [
    { k: 'look', name: 'Look & feel', how: 'tap to pick the item up' },
    { k: 'flex', name: 'Flex', how: 'drag up and down to bend a piece' },
    { k: 'heat', name: 'Heat', how: 'press and hold to heat a piece' },
    { k: 'float', name: 'Float', how: 'tap to drop a piece in water' },
    { k: 'stamp', name: 'Stamp?', how: 'tap to turn it over and look' },
  ];
  const SOFT = 'It softens and sags. Let it cool and it goes hard again.', HARD = 'It does not soften at all. It only scorches.';
  const FLOATS = 'It floats: less dense than water.', SINKS = 'It sinks: more dense than water.';
  const ITEMS = [
    { k: 'milk', name: 'Milk bottle', ans: 'hdpe', look: 'Cloudy white with a waxy feel. Thin walls: stiff but squeezy.', fm: 'spring', flex: 'It squashes and springs back. No cracks.', soft: 1, floats: 1, code: 2,
      yes: 'HDPE: stiff, tough, opaque and waxy, and it floats. Milk bottles are a classic HDPE product.' },
    { k: 'fizzy', name: 'Fizzy bottle', ans: 'pet', look: 'Crystal clear, thin and very lightweight. It is strong enough to hold the fizz in.', fm: 'spring', flex: 'It squeezes in and pops back. Tough.', soft: 1, floats: 0, code: 1,
      yes: 'PET: clear, tough, lightweight and it keeps the fizz in. It sinks, unlike HDPE and PP.' },
    { k: 'pot', name: 'Yoghurt pot', ans: 'hips', look: 'White, thin, lightweight and fairly rigid. Rounded corners: it was vacuum formed.', fm: 'crease', flex: 'It bends, then creases white and splits.', soft: 1, floats: 0, code: 6,
      yes: 'HIPS: lightweight, fairly rigid, food safe and very easy to vacuum form. Code 6 is polystyrene.' },
    { k: 'lid', name: 'Lunch-box lid', ans: 'pp', look: 'Tough, flexible and slightly waxy. The hinge is just a thin line of the same plastic.', fm: 'hinge', flex: 'The hinge bends again and again. No white marks, no cracks.', soft: 1, floats: 1, code: 5,
      yes: 'PP: tough, flexible and it resists fatigue, so it makes a “living hinge”. It floats too.' },
    { k: 'pipe', name: 'Drain pipe', ans: 'pvc', look: 'Grey, hard and rigid. It lives outdoors in all weathers for years.', fm: 'stiff', flex: 'Very stiff. It barely bends, but it does not snap.', soft: 1, floats: 0, code: 3,
      yes: 'PVC (rigid uPVC): hard, tough, weather- and chemical-resistant. Used for drain pipes and window frames.' },
    { k: 'sign', name: 'Shop sign', ans: 'acrylic', look: 'Brightly coloured, hard, stiff and glossy. There are fine scratches on the surface.', fm: 'snap', flex: 'It is stiff… then it snaps. Brittle!', soft: 1, floats: 0, code: 7,
      yes: 'Acrylic: hard, stiff, shiny and brightly coloured, but brittle and easily scratched. Code 7 means “other”.' },
    { k: 'plug', name: 'Plug', ans: 'uf', look: 'White, hard, stiff and glossy. It carries mains electricity safely.', fm: 'rigid', flex: 'It will not bend at all. Hard and stiff.', soft: 0, floats: 0, code: 0,
      yes: 'Urea formaldehyde (UF): a hard, stiff, heat-resistant thermoset that is a good electrical insulator, in white.' },
    { k: 'top', name: 'Worktop', ans: 'mf', look: 'A hard, glossy, patterned surface layer. Hot pans and knives leave no marks on it.', fm: 'rigid', flex: 'It will not bend at all. Hard and stiff.', soft: 0, floats: 0, code: 0,
      yes: 'Melamine formaldehyde (MF): a hard thermoset that resists scratches, heat and stains. Used for worktop laminates.' },
  ];
  const clue = (it, t) => t === 'look' ? it.look : t === 'flex' ? it.flex : t === 'heat' ? (it.soft ? SOFT : HARD) : t === 'float' ? (it.floats ? FLOATS : SINKS)
    : it.code ? `Yes: a recycling triangle with the number ${it.code}.` : 'No recycling stamp anywhere on it.';

  // ---------- item drawings (centred near 160, 165) ----------
  const DRAW = {
    milk(ctx) {
      const P = [[120, 70], [200, 70], [200, 96], [236, 130], [236, 268], [84, 268], [84, 130], [120, 96]];
      Ink.hatchShadow(ctx, P, 1, 7, 7, B); paperFill(ctx, P); hatch(ctx, P, B, 0.18, 9, 1); line(ctx, closed(P), { w: 2.6, seed: 3 });
      const cap = geo.rect(116, 46, 88, 26, 5); paperFill(ctx, cap); hatch(ctx, cap, B, 0.6, 3.6, 1, 1.2); line(ctx, cap, { w: 2.2, seed: 4 });
      const hole = geo.rect(182, 142, 34, 62, 14); paperFill(ctx, hole); line(ctx, hole, { w: 2, seed: 5 });
      const lb = geo.rect(98, 190, 74, 56, 4); line(ctx, lb, { w: 1.6, seed: 6 }); text(ctx, 'MILK', 135, 226, { font: 'lab', size: 22, align: 'center' });
    },
    fizzy(ctx) {
      const P = geo.curve([140, 62], [140, 100], [108, 104], [108, 150], 12).concat([[108, 256]], [[116, 274], [132, 266], [148, 276], [164, 266], [180, 276], [196, 266], [212, 274]], [[220, 256]], geo.curve([220, 150], [220, 104], [188, 100], [188, 62], 12));
      Ink.hatchShadow(ctx, P, 1, 7, 7, B); paperFill(ctx, P); line(ctx, closed(P), { w: 2.6, seed: 3 });
      ctx.save(); ctx.strokeStyle = rgba(B, 0.55); ctx.lineWidth = 1.5; [[122, 150, 22], [130, 144, 12], [200, 236, 18]].forEach(([x, y, l]) => { ctx.beginPath(); ctx.moveTo(x, y + l); ctx.lineTo(x + l * 0.5, y); ctx.stroke(); }); ctx.restore();
      const cap = geo.rect(136, 40, 56, 24, 4); paperFill(ctx, cap); hatch(ctx, cap, R, 0.6, 3.6, 1, 1.2); line(ctx, cap, { w: 2.2, color: R, seed: 4 });
      const lb = [[108, 168], [220, 168], [220, 214], [108, 214]]; paperFill(ctx, lb); hatch(ctx, lb, R, 0.3, 6, 1); line(ctx, closed(lb), { w: 1.8, color: R, seed: 6 }); text(ctx, 'FIZZ', 164, 200, { font: 'lab', size: 24, align: 'center', color: R });
      [[150, 240], [176, 232], [162, 252]].forEach(([x, y], i) => line(ctx, geo.ellipse(x, y, 4, 4), { w: 1.2, seed: 8 + i, retrace: false }));
    },
    pot(ctx) {
      const P = [[92, 112], [228, 112], [210, 262], [110, 262]];
      Ink.hatchShadow(ctx, P, 1, 7, 7, B); paperFill(ctx, P); hatch(ctx, P, B, 0.16, 10, 1); line(ctx, closed(P), { w: 2.6, seed: 3 });
      const rim = geo.rect(82, 100, 156, 14, 6); paperFill(ctx, rim); line(ctx, rim, { w: 2.2, seed: 4 });
      const foil = [[84, 100], [150, 100], [118, 60], [70, 74]]; paperFill(ctx, foil); hatch(ctx, foil, B, 0.4, 5, -1); line(ctx, closed(foil), { w: 1.8, seed: 5 });
      text(ctx, 'yoghurt', 160, 196, { size: 24, align: 'center', rot: -0.06 });
      line(ctx, geo.ellipse(160, 228, 12, 12), { w: 1.6, color: R, seed: 7 });
    },
    lid(ctx) {
      const box = [[70, 190], [250, 190], [240, 270], [80, 270]], lid = [[70, 186], [250, 186], [262, 96], [82, 96]];
      Ink.hatchShadow(ctx, box, 1, 7, 7, B); paperFill(ctx, box); hatch(ctx, box, B, 0.25, 8, 1); line(ctx, closed(box), { w: 2.6, seed: 3 });
      paperFill(ctx, lid); hatch(ctx, lid, B, 0.14, 10, -1); line(ctx, closed(lid), { w: 2.4, seed: 4 });
      line(ctx, [[66, 188], [254, 188]], { w: 1.4, color: R, seed: 5, retrace: false });
      text(ctx, 'hinge', 286, 180, { size: 21, color: R }); line(ctx, [[282, 176], [258, 186]], { w: 1.4, color: R, seed: 6, retrace: false });
      const clip = geo.rect(140, 84, 48, 14, 4); paperFill(ctx, clip); line(ctx, clip, { w: 1.8, seed: 7 });
    },
    pipe(ctx) {
      ctx.save(); ctx.translate(160, 165); ctx.rotate(-0.35); ctx.translate(-160, -165);
      const body = [[50, 135], [250, 135], [250, 195], [50, 195]];
      Ink.hatchShadow(ctx, body, 1, 7, 7, B); paperFill(ctx, body); hatch(ctx, body, B, 0.38, 6, 1); line(ctx, [[50, 135], [250, 135]], { w: 2.6, seed: 3 }); line(ctx, [[50, 195], [250, 195]], { w: 2.6, seed: 4 });
      const col = [[226, 126], [270, 126], [270, 204], [226, 204]]; paperFill(ctx, col); hatch(ctx, col, B, 0.45, 5, -1); line(ctx, closed(col), { w: 2.4, seed: 5 });
      const e1 = geo.ellipse(270, 165, 12, 39); paperFill(ctx, e1); line(ctx, e1, { w: 2.4, seed: 6 }); line(ctx, geo.ellipse(270, 165, 8, 30), { w: 1.6, seed: 7 });
      line(ctx, geo.ellipse(50, 165, 9, 30, 1.6, 4.7), { w: 2.4, seed: 8 });
      ctx.restore();
    },
    sign(ctx) {
      line(ctx, [[90, 60], [90, 100]], { w: 2.2, seed: 3 }); line(ctx, [[230, 60], [230, 100]], { w: 2.2, seed: 4 }); line(ctx, [[60, 58], [260, 58]], { w: 3.2, seed: 5 });
      const P = geo.rect(50, 100, 220, 120, 12); Ink.hatchShadow(ctx, P, 1, 8, 8, B); paperFill(ctx, P); hatch(ctx, P, R, 0.3, 6, 1); line(ctx, P, { w: 2.8, color: R, seed: 6 });
      Ink.drawBubble(ctx, 'OPEN', 160, 180, 50, R, 1, 0, 'center');
      ctx.save(); ctx.strokeStyle = rgba(B, 0.5); ctx.lineWidth = 1; [[70, 124, 26], [224, 196, 20], [84, 200, 14]].forEach(([x, y, l]) => { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + l, y - l * 0.4); ctx.stroke(); }); ctx.restore();
    },
    plug(ctx) {
      const P = [[92, 120], [228, 120], [244, 150], [244, 232], [200, 262], [120, 262], [76, 232], [76, 150]];
      [[150, 60, 20, 62], [100, 84, 16, 40], [204, 84, 16, 40]].forEach(([x, y, w, h], i) => { const pin = geo.rect(x, y, w, h, 2); paperFill(ctx, pin); hatch(ctx, pin, B, 0.55, 3.6, 1, 1.1); line(ctx, pin, { w: 2, seed: 10 + i }); });
      Ink.hatchShadow(ctx, P, 1, 7, 7, B); paperFill(ctx, P); line(ctx, closed(P), { w: 2.8, seed: 3 });
      line(ctx, geo.ellipse(160, 186, 10, 10), { w: 1.8, seed: 4 }); line(ctx, [[153, 186], [167, 186]], { w: 1.6, seed: 5 });
      line(ctx, geo.curve([160, 262], [160, 300], [200, 300], [250, 310], 16), { w: 4.5, seed: 6 });
    },
    top(ctx) {
      const topF = [[50, 150], [220, 110], [280, 150], [110, 194]], front = [[50, 150], [110, 194], [110, 236], [50, 190]], side = [[110, 194], [280, 150], [280, 190], [110, 236]];
      Ink.hatchShadow(ctx, [[50, 150], [220, 110], [280, 150], [280, 190], [110, 236], [50, 190]], 1, 7, 7, B);
      paperFill(ctx, topF); paperFill(ctx, front); paperFill(ctx, side); hatch(ctx, front, B, 0.4, 5, 1); hatch(ctx, side, B, 0.3, 6, -1);
      line(ctx, closed(topF), { w: 2.6, seed: 3 }); line(ctx, [[50, 150], [50, 190], [110, 236], [280, 190], [280, 150]], { w: 2.6, seed: 4 }); line(ctx, [[110, 194], [110, 236]], { w: 2.2, seed: 5 });
      line(ctx, [[50, 157], [110, 201], [280, 157]], { w: 1.3, color: R, seed: 6, retrace: false });
      ctx.save(); ctx.fillStyle = rgba(B, 0.6); for (let i = 0; i < 38; i++) { const u = ((i * 37) % 100) / 100, v = ((i * 61) % 100) / 100, x = 50 + 170 * u + 60 * v, y = 150 - 40 * u + 44 * v; ctx.beginPath(); ctx.arc(x, y, 1.2 + (i % 3) * 0.6, 0, 7); ctx.fill(); } ctx.restore();
      text(ctx, 'surface layer', 150, 92, { size: 21, color: R }); line(ctx, [[170, 98], [160, 126]], { w: 1.4, color: R, seed: 8, retrace: false });
    },
  };

  // =====================================================================================
  function lab(ui, root, host, onProgress) {
    const rec = ui.record('p06.id', { label: 'Name that plastic: 8 items identified from test clues', type: 'game', max: 8 });
    const prev = rec.get() || {};
    const tests = prev.tests || {}, tries = prev.tries || {}; // tests[item] = [tool...], tries[item] = [polymer...]
    ITEMS.forEach((it) => { tests[it.k] = tests[it.k] || []; tries[it.k] = tries[it.k] || []; });
    const itemRow = ui.el('div', 'p06p-row', '', host), toolRow = ui.el('div', 'p06p-row tools', '', host);
    const W = 860, Hh = 300, S = stage(host, W, Hh, 'p06p-cv');
    const clues = ui.el('div', 'p06p-clues', '', host);
    const ask = ui.el('div', 'p06p-ask', '', host), ansRow = ui.el('div', 'p06p-row p06p-ans', '', host), fb = ui.el('div', 'fb', '', host), score = ui.el('div', 'p06p-score', '', host);
    let ii = 0, ti = 0, T;
    const item = () => ITEMS[ii], tool = () => TOOLS[ti].k;
    const solved = (it) => tries[it.k].includes(it.ans), failed = (it) => !solved(it) && tries[it.k].length >= 3, closedIt = (it) => solved(it) || failed(it);
    const marks = (it) => { const n = tries[it.k].indexOf(it.ans); return n >= 0 && n <= 1 ? 1 : 0; };
    const name = (k) => POL.find((p) => p.k === k).name;
    function save() {
      const sc = ITEMS.reduce((a, it) => a + marks(it), 0), all = ITEMS.every(closedIt), mis = new Set();
      ITEMS.forEach((it) => tries[it.k].forEach((k) => { if (k !== it.ans) mis.add(misFor(it, k)); }));
      const ans = ITEMS.filter((it) => tries[it.k].length || tests[it.k].length).map((it) => `${it.name}: ${tries[it.k].map((k) => name(k) + (k === it.ans ? '✓' : '✗')).join(' ') || 'no answer'} (${tests[it.k].length} tests)`).join('; ');
      rec.set({ answer: ans, correct: all ? sc === 8 : null, score: sc, max: 8, mis: [...mis].join(','), tests, tries });
      onProgress(all);
    }
    const fam = (k) => POL.find((p) => p.k === k).fam;
    const misFor = (it, k) => fam(k) !== fam(it.ans) ? 'thermo-swap' : fam(k) === 'tf' ? 'thermoform-mixup' : 'thermoset-mixup';
    function whyWrong(it, k) {
      const p = POL.find((q) => q.k === k);
      if (p.fam !== fam(it.ans)) return p.fam === 'ts' ? `${p.name} is a thermosetting polymer: it would never soften with heat, and it would have no recycling stamp. What did the heat test show?` : `${p.name} is a thermoforming polymer: it would soften with heat. What did the heat test show?`;
      return `${p.trait}. Does that fit all of your clues?`;
    }

    const iBtns = ITEMS.map((it, i) => { const b = ui.el('button', 'opt', `${i + 1}. ${it.name}`, itemRow); b.type = 'button'; b.onclick = () => { select(i, ti); Book.sfx('tick', { gain: 0.5 }); }; return b; });
    const tBtns = TOOLS.map((t, i) => { const b = ui.el('button', 'opt', t.name, toolRow); b.type = 'button'; b.onclick = () => { select(ii, i); Book.sfx('tick', { gain: 0.5 }); }; return b; });
    const aBtns = POL.map((p) => { const b = ui.el('button', 'opt', p.name, ansRow); b.type = 'button'; b.onclick = () => answer(p.k, b); return b; });
    function paint() {
      const it = item();
      iBtns.forEach((b, i) => { b.classList.toggle('sel', i === ii); b.classList.toggle('ok', solved(ITEMS[i])); b.classList.toggle('no', failed(ITEMS[i])); });
      tBtns.forEach((b, i) => { b.classList.toggle('sel', i === ti); b.classList.toggle('used', tests[it.k].includes(TOOLS[i].k)); });
      clues.innerHTML = TOOLS.map((t) => `<b>${t.name.replace('?', '')}:</b> ` + (tests[it.k].includes(t.k) ? clue(it, t.k) : '<span class="q">not tested yet</span>')).join('<br>');
      ask.textContent = `Item ${ii + 1}, the ${it.name.toLowerCase()}: which polymer is it?`;
      aBtns.forEach((b, i) => { const k = POL[i].k, tried = tries[it.k].includes(k); b.className = 'opt' + (tried ? (k === it.ans ? ' right' : ' wrong') : '') + (failed(it) && k === it.ans ? ' right' : ''); b.disabled = closedIt(it) || tried; });
      if (solved(it)) { fb.className = 'fb on good'; fb.innerHTML = '✓ ' + it.yes; }
      else if (failed(it)) { fb.className = 'fb on bad'; fb.innerHTML = `✗ Three tries used. It is <b>${name(it.ans)}</b>. ` + it.yes; }
      else if (tries[it.k].length) { const k = tries[it.k][tries[it.k].length - 1]; fb.className = 'fb on bad'; fb.innerHTML = '✗ ' + whyWrong(it, k) + ` <span class="small">(${3 - tries[it.k].length} ${tries[it.k].length === 2 ? 'try' : 'tries'} left)</span>`; }
      else { fb.className = 'fb'; fb.innerHTML = ''; }
      const nd = ITEMS.filter(closedIt).length; score.textContent = `Identified: ${ITEMS.filter(solved).length} of 8` + (nd === 8 ? '. Case closed!' : '');
    }
    function answer(k, b) {
      const it = item(); if (closedIt(it) || tries[it.k].includes(k)) return;
      tries[it.k].push(k); const ok = k === it.ans; Book.sfx(ok ? 'success' : 'error', { gain: 0.35 }); Book.scribble(0.15);
      save(); paint();
    }
    function finish() {
      if (T.done) return; T.done = true; T.dt = 0;
      const it = item(); if (!tests[it.k].includes(tool())) { tests[it.k].push(tool()); save(); }
      Book.sfx('pop', { gain: 0.3 }); paint();
    }
    function select(i, j) {
      ii = i; ti = j;
      T = { done: false, dt: 0, a: 0, ext: 0, n: 0, moved: 0, lastY: null, drag: false, broke: false, brT: 0, white: false, heat: 0, drop: -1, y: 60, vy: 0, flip: -1, up: false };
      paint(); S.dirty = true;
    }

    const SY = 150; // strip height for flex and heat
    S.c.addEventListener('pointerdown', (e) => {
      e.preventDefault(); try { S.c.setPointerCapture(e.pointerId); } catch (_) {}
      const [, y] = S.pos(e), k = tool(); T.drag = true; S.dirty = true;
      if (k === 'look') { if (!T.up) { T.up = true; T.flip = 0; } }
      else if (k === 'stamp') { if (T.flip < 0) T.flip = 0; }
      else if (k === 'float') { if (T.drop < 0) { T.drop = 0; Book.sfx('tick', { gain: 0.4 }); } else if (T.done && T.dt > 1) select(ii, ti); }
      else if (k === 'flex') { if (T.broke && T.brT > 1) select(ii, ti); else { T.lastY = y; bend(y); } }
    });
    S.c.addEventListener('pointermove', (e) => { if (!T.drag) return; e.preventDefault(); const [, y] = S.pos(e); if (tool() === 'flex') bend(y); });
    const up = () => { T.drag = false; T.lastY = null; S.dirty = true; };
    S.c.addEventListener('pointerup', up); S.c.addEventListener('pointercancel', up);
    function bend(y) {
      if (T.broke) return; const m = item().fm, lim = m === 'rigid' ? 0.03 : m === 'stiff' ? 0.16 : 1;
      const raw = clamp((y - SY) / 120, -1, 1); T.a = raw * lim; if (T.lastY != null) T.moved += Math.abs(y - T.lastY); T.lastY = y; S.dirty = true;
      const s = raw > 0.55 ? 1 : raw < -0.55 ? -1 : 0;
      if (s && s !== T.ext) {
        T.ext = s; T.n++; Book.sfx('tick', { gain: 0.3 });
        if (m === 'snap') { T.broke = true; T.brA = T.a; Book.sfx('thud', { gain: 0.5 }); finish(); }
        else if (m === 'crease') { if (T.n >= 2) T.white = true; if (T.n >= 4) { T.broke = true; T.brA = T.a; Book.sfx('thud', { gain: 0.4 }); finish(); } }
        else if (T.n >= (m === 'hinge' ? 6 : 3)) finish();
      }
    }

    // ---------- drawing ----------
    function stripPts(a, s0, s1, hingeAt) {
      const C = []; let x = 500, y = SY;
      for (let s = 0; s <= 280; s += 6) { const th = a * 1.1 * clamp((s - hingeAt) / 50, 0, 1); if (s >= s0 && s <= s1) C.push([x, y, th]); x += Math.cos(th) * 6; y += Math.sin(th) * 6; }
      return C.map(([px, py, th]) => [px + Math.sin(th) * 6, py - Math.cos(th) * 6]).concat(C.map(([px, py, th]) => [px - Math.sin(th) * 6, py + Math.cos(th) * 6]).reverse());
    }
    function clampJaws(ctx) {
      [[420, SY - 58, 80, 50], [420, SY + 8, 80, 50]].forEach(([x, y, w, h], i) => { const P = geo.rect(x, y, w, h, 5); Ink.hatchShadow(ctx, P, 1, 6, 6, B); paperFill(ctx, P); hatch(ctx, P, B, 0.5, 5, i ? -1 : 1); line(ctx, P, { w: 2.6, seed: 50 + i }); });
      const post = geo.rect(440, SY + 58, 40, 280 - SY - 58, 3); paperFill(ctx, post); hatch(ctx, post, B, 0.4, 6, 1); line(ctx, post, { w: 2.4, seed: 53 });
      line(ctx, [[360, 280], [840, 280]], { w: 2.8, seed: 54 });
    }
    const strip = (ctx, P, seed) => { paperFill(ctx, P); hatch(ctx, P, B, 0.22, 9, 1); line(ctx, closed(P), { w: 2.2, seed }); };
    function hint(ctx, s) { text(ctx, s, 620, 28, { size: 23, color: R, align: 'center' }); }
    function drawFlex(ctx) {
      const m = item().fm;
      if (T.broke) { strip(ctx, stripPts(T.brA, 0, 48, 20), 33); const k = Math.min(1, T.brT / 0.45), y = SY + 40 + (266 - SY - 40) * k * k; strip(ctx, rot(geo.rect(560, y - 6, 220, 12, 2), 670, y, 0.5 * (1 - k) * (T.brA > 0 ? 1 : -1)), 34); text(ctx, m === 'snap' ? 'SNAP!' : 'SPLIT!', 600, SY - 40, { size: 32, color: R, rot: -0.1 }); }
      else strip(ctx, stripPts(T.a, 0, 280, m === 'hinge' ? 60 : 20), 33);
      if (m === 'hinge' && !T.broke) text(ctx, 'hinge', 566, SY - 60, { size: 20, color: R });
      if (T.white) { ctx.save(); ctx.strokeStyle = rgba(R, 0.8); ctx.lineWidth = 1.3; ctx.beginPath(); for (let i = 0; i < 6; i++) { const x = 524 + i * 6; ctx.moveTo(x, SY - 9); ctx.lineTo(x + 3, SY + 9); } ctx.stroke(); ctx.restore(); text(ctx, 'white crease', 520, SY + 70, { size: 20, color: R }); }
      clampJaws(ctx);
      if (T.n === 0 && T.moved < 20) hint(ctx, 'drag up and down to bend it');
      if (T.done && !T.broke) { if (m === 'rigid' || m === 'stiff') text(ctx, m === 'rigid' ? 'it will not bend!' : 'it barely bends', 660, SY - 40, { size: 23, align: 'center' }); else Ink.tick(ctx, 760, 90, 1.3); }
    }
    function drawHeat(ctx) {
      const it = item(), h = T.heat, now = performance.now() / 1000;
      const P = stripPts(it.soft ? clamp((h - 0.35) / 0.65, 0, 1) * 0.55 : 0, 0, 280, 20); paperFill(ctx, P); hatch(ctx, P, B, 0.22, 9, 1);
      if (!it.soft && h > 0.55) { const Q = stripPts(0, 96, 200, 20); hatch(ctx, Q, B, (h - 0.55) * 2, 3, 1, 1.2); hatch(ctx, Q, B, (h - 0.55) * 1.6, 3.4, -1, 1.2); }
      line(ctx, closed(P), { w: 2.2, seed: 33 });
      clampJaws(ctx);
      // heat gun below, pointing up
      const gun = [[610, 262], [660, 262], [668, 226], [644, 206], [626, 206], [602, 226]]; paperFill(ctx, gun); hatch(ctx, gun, B, 0.45, 5, 1); line(ctx, closed(gun), { w: 2.4, seed: 60 }); const hd = geo.rect(650, 240, 80, 24, 8); paperFill(ctx, hd); hatch(ctx, hd, B, 0.4, 6, -1); line(ctx, hd, { w: 2.2, seed: 61 });
      if (T.drag && h < 1) [0, 1, 2].forEach((i) => line(ctx, wavy(620 + i * 15, 200, SY + 22, 4, i * 2 + now * 8), { w: 1.6, color: R, seed: 62 + i, retrace: false }));
      const bar = geo.rect(520, 40, 240, 18, 6); line(ctx, bar, { w: 2, seed: 65 }); if (h > 0.02) hatch(ctx, geo.rect(522, 42, 236 * h, 14, 4), R, 0.75, 3.4, 1, 1.3);
      text(ctx, 'cool', 470, 56, { size: 20 }); text(ctx, 'hot', 770, 56, { size: 20, color: R });
      if (h === 0 && !T.drag) text(ctx, 'press and hold to heat', 640, 100, { size: 23, color: R, align: 'center' });
      if (T.done) text(ctx, it.soft ? 'soft: it sags' : 'still rigid: scorched', 800, 100, { size: 23, color: it.soft ? B : R, align: 'right' });
    }
    function drawFloat(ctx) {
      const it = item(), now = performance.now() / 1000, tank = [[470, 90], [470, 284], [790, 284], [790, 90]];
      line(ctx, tank, { w: 3, seed: 70 });
      const wl = []; for (let x = 472; x <= 788; x += 8) wl.push([x, 130 + Math.sin(x * 0.05 + now * 2) * 2.5]); line(ctx, wl, { w: 1.8, seed: 71, retrace: false });
      hatch(ctx, [[472, 132], [788, 132], [788, 282], [472, 282]], B, 0.14, 12, -1);
      const P = rot(geo.rect(600, T.y - 7, 60, 14, 2), 630, T.y, T.drop < 0 ? 0.1 : Math.sin(now * 2) * 0.06);
      paperFill(ctx, P); hatch(ctx, P, B, 0.3, 6, 1); line(ctx, P, { w: 2.2, seed: 72 });
      text(ctx, 'water', 800, 190, { size: 21 });
      if (T.drop < 0) hint(ctx, 'tap to drop a piece in');
      if (T.done) text(ctx, it.floats ? 'it floats!' : 'it sinks', 630, 70, { size: 26, color: it.floats ? G : B, align: 'center' });
    }
    function drawStamp(ctx) {
      const it = item(), cx = 620, cy = 140, k = clamp(T.flip / 0.6, 0, 1);
      line(ctx, [[cx + 74, cy + 74], [cx + 150, cy + 150]], { w: 9, seed: 80 });
      const lens = geo.ellipse(cx, cy, 104, 104); paperFill(ctx, lens); line(ctx, lens, { w: 4, seed: 81 }); line(ctx, geo.ellipse(cx, cy, 96, 96), { w: 1.4, seed: 82, retrace: false });
      if (k >= 1) {
        if (it.code) {
          const tri = [0, 1, 2].map((i) => { const a = -Math.PI / 2 + i * Math.PI * 2 / 3; return [cx + Math.cos(a) * 70, cy + 12 + Math.sin(a) * 70]; });
          [0, 1, 2].forEach((i) => { const a = tri[i], b = tri[(i + 1) % 3], p0 = [a[0] + (b[0] - a[0]) * 0.16, a[1] + (b[1] - a[1]) * 0.16], p1 = [a[0] + (b[0] - a[0]) * 0.84, a[1] + (b[1] - a[1]) * 0.84]; line(ctx, [p0, p1], { w: 3.4, seed: 84 + i }); line(ctx, geo.head([p0, p1], 16, 0.55), { w: 3, seed: 87 + i }); });
          text(ctx, String(it.code), cx, cy + 38, { font: 'lab', size: 58, align: 'center' });
        } else { text(ctx, 'no stamp', cx, cy + 4, { size: 26, color: R, align: 'center' }); text(ctx, 'anywhere', cx, cy + 34, { size: 22, color: R, align: 'center' }); }
      } else if (T.flip < 0) { text(ctx, '?', cx, cy + 22, { size: 64, align: 'center', a: 0.35 }); hint(ctx, 'tap to look for a stamp'); }
    }
    function drawLook(ctx) {
      const card = geo.rect(400, 50, 430, 200, 8), it = item();
      Ink.hatchShadow(ctx, card, 1, 7, 7, B); paperFill(ctx, card); line(ctx, card, { w: 2.2, seed: 90 });
      text(ctx, 'LOOK & FEEL', 420, 84, { font: 'lab', size: 20, color: R });
      if (T.up && T.flip >= 0.3) wrap(ctx, it.look, 390, HAND(23)).forEach((l, i) => text(ctx, l, 420, 122 + i * 34, { size: 23 }));
      else { text(ctx, '?', 615, 190, { size: 70, align: 'center', a: 0.3 }); text(ctx, 'tap to pick the item up', 615, 280, { size: 23, color: R, align: 'center' }); }
    }
    function render() {
      S.begin(); const ctx = S.ctx, k = tool(), it = item();
      // the item, on the left
      ctx.save(); const lift = k === 'look' && T.up ? -10 : 0, fl = k === 'stamp' && T.flip >= 0 ? Math.sin(clamp(T.flip / 0.6, 0, 1) * Math.PI) * 0.25 : 0;
      ctx.translate(160, 165 + lift); ctx.rotate(fl); ctx.translate(-160, -165); DRAW[it.k](ctx); ctx.restore();
      text(ctx, `item ${ii + 1}`, 20, 30, { font: 'lab', size: 22 });
      if (k === 'flex' || k === 'heat' || k === 'float') text(ctx, 'a piece cut from it →', 370, 296, { size: 19, a: 0.7, align: 'center' });
      (k === 'look' ? drawLook : k === 'flex' ? drawFlex : k === 'heat' ? drawHeat : k === 'float' ? drawFloat : drawStamp)(ctx);
    }
    run(root, S, (dt) => {
      let anim = false; const k = tool(), it = item();
      if (T.done) { T.dt += dt; if (T.dt < 1.2) anim = true; }
      if (k === 'flex') { if (T.broke) { T.brT += dt; if (T.brT < 1.2) anim = true; } else { if (!T.drag && Math.abs(T.a) > 0.005) { T.a *= Math.pow(0.0005, dt); anim = true; } if (!T.done && (it.fm === 'rigid' || it.fm === 'stiff') && T.moved > 260) finish(); } }
      else if (k === 'heat') { if (T.drag && T.heat < 1) { T.heat = Math.min(1, T.heat + dt / 2.6); anim = true; if (T.heat >= 1) finish(); } }
      else if (k === 'float') {
        const surf = 128, floor = 274;
        if (T.drop >= 0) {
          T.drop += dt; anim = true;
          if (T.y < surf) { T.vy += 1500 * dt; T.y += T.vy * dt; if (T.y >= surf) { Book.sfx('pop', { gain: 0.4 }); T.vy *= 0.25; } }
          else if (it.floats) { T.vy += ((surf + 2 - T.y) * 60 - T.vy * 5) * dt; T.y += T.vy * dt; if (T.drop > 1.3) finish(); }
          else { const v = it.k === 'pot' ? 70 : 120; T.y = Math.min(floor, T.y + v * dt); if (T.y >= floor) finish(); }
          if (T.done && T.dt > 1.5 && !it.floats) anim = false;
        }
      }
      else if (T.flip >= 0 && T.flip < 0.7) { T.flip += dt; anim = true; if (T.flip >= 0.6) finish(); }
      if (anim || S.dirty) { S.dirty = false; render(); }
    });
    select(0, 0); onProgress(ITEMS.every(closedIt));
    if (document.fonts) document.fonts.ready.then(() => (S.dirty = true));
  }

  // =====================================================================================
  Book.page({
    id: 'p06',
    title: 'Name that plastic',
    build(ui, root) {
      css();
      ui.h('Name that plastic');
      ui.p('Eight everyday items, and nobody has labelled the plastic. Be the <b>polymer detective</b>: use the tools to collect clues, then name the polymer. You get <b>three tries</b> per item, so test before you guess!');
      ui.box(`<b>Softens when heated?</b> Then it is a thermoforming polymer. If it only scorches, it is a thermoset.<br>
        <b>Floats in water?</b> Only <span class="key">HDPE and PP</span> float: they are less dense than water. PET, PVC, acrylic, HIPS and the thermosets sink.<br>
        <b>Recycling stamp?</b> Only thermoforming polymers carry one, because only they can be remelted.`, { tag: 'Detective tips' });
      const d = ui.el('div', 'box p06p-lab'); requestAnimationFrame(() => Ink.frame(d));
      ui.el('span', 'tag', 'ID lab', d);
      ui.el('p', '', 'Pick an <b>item</b>, pick a <b>tool</b>, then use it on the drawing. Clues collect underneath.', d).style.margin = '0 0 8px';
      let key = null;
      lab(ui, root, d, (all) => { if (key) key.classList.toggle('peek-lock', !all); else requestAnimationFrame(() => key && key.classList.toggle('peek-lock', !all)); });
      ui.p('<span class="small">The case file un-blurs when you have finished all eight items.</span>');
      key = ui.box(`<b>1 Milk bottle</b>: HDPE (code 2). <b>2 Fizzy bottle</b>: PET (code 1). <b>3 Yoghurt pot</b>: HIPS (code 6, polystyrene). <b>4 Lunch-box lid</b>: PP (code 5). <b>5 Drain pipe</b>: PVC (code 3). <b>6 Shop sign</b>: acrylic (code 7, other).<br>
        <b>7 Plug</b>: urea formaldehyde, UF. <b>8 Worktop</b>: melamine formaldehyde, MF. Both are thermosets: no softening, no stamp.`, { tag: 'Case file' });
    },
  });
})();
