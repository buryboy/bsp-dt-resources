// Page 4 — Gears: driver & driven. Three benches: (1) drag the driver and see which way the driven gear turns,
// (2) tap an idler gear in and out and compare turn counters, (3) swap the driven gear on a winch and watch
// speed against torque. Notes un-blur after each bench; a fill-in-the-blanks check at the end.
//
// This file also defines window.GearKit: the pen-drawn involute gear drawing kit shared with p05 and p06.
(function () {
  'use strict';
  if (window.GearKit) return;
  const G = (window.GearKit = {});
  const B = Ink.BLUE, RD = Ink.RED, rgba = Ink.rgba, geo = Ink.geo;
  const TAU = Math.PI * 2, PA = (20 * Math.PI) / 180, inv = (a) => Math.tan(a) - a;
  G.TAU = TAU;
  G.LABF = (s) => `600 ${s}px Fredoka, "Arial Rounded MT Bold", system-ui, sans-serif`;
  G.HANDF = (s) => `400 ${s}px "Gloria Hallelujah", "Comic Sans MS", cursive`;
  G.text = (x, s, px, py, o = {}) => {
    x.save(); x.font = (o.font === 'hand' ? G.HANDF : G.LABF)(o.size || 22);
    x.fillStyle = rgba(o.color || B, o.a ?? 0.92); x.textAlign = o.align || 'left'; x.textBaseline = 'alphabetic';
    x.fillText(s, px, py); x.restore();
  };
  const path = (x, P) => { x.beginPath(); P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.closePath(); };
  G.path = path;

  // ---- geometry: a real involute spur gear. N teeth, module m (pitch diameter = N × m). Tooth 0 points along +x.
  G.R = (N, m) => (N * m) / 2;                    // pitch radius
  G.tipR = (N, m) => (N * m) / 2 + 0.92 * m;
  function dims(N, m) {
    const r = (N * m) / 2, rb = r * Math.cos(PA), ra = r + 0.92 * m, rr = r - 1.2 * m;
    const base = (Math.PI / (2 * N)) * 0.93 + inv(PA);                                   // 7% backlash so the ink lines don't touch
    const half = (R) => (R <= rb ? base : Math.max(0.006, base - inv(Math.acos(rb / R))));
    const Rs = [rr]; if (rb > rr + 0.6) Rs.push(rb);
    const lo = Math.max(rr, rb); for (let i = 1; i <= 5; i++) Rs.push(lo + ((ra - lo) * i) / 5);
    return { r, rb, ra, rr, half, Rs };
  }
  const pol = (R, a) => [R * Math.cos(a), R * Math.sin(a)];
  G.tooth = (N, m, i = 0) => {                                                            // one tooth as a closed polygon
    const d = dims(N, m), c = (i * TAU) / N, P = [];
    d.Rs.forEach((R) => P.push(pol(R, c - d.half(R))));
    d.Rs.slice().reverse().forEach((R) => P.push(pol(R, c + d.half(R))));
    return P;
  };
  G.outline = (N, m) => {
    const d = dims(N, m), P = [];
    for (let i = 0; i < N; i++) {
      const c = (i * TAU) / N;
      d.Rs.forEach((R) => P.push(pol(R, c - d.half(R))));
      d.Rs.slice().reverse().forEach((R) => P.push(pol(R, c + d.half(R))));
      P.push(pol(d.rr, c + Math.PI / N));
    }
    P.push(P[0]);
    return P;
  };
  // the rest of the gear (hub, holes) as simple figures, so ink animations can draw the same gear the sprites show
  G.parts = (N, m) => {
    const d = dims(N, m), hub = Math.max(5, Math.min(d.rr * 0.34, 20)), n = N < 16 ? 0 : N < 26 ? 4 : N < 44 ? 5 : 6;
    const ringR = (hub + d.rr) / 2 + 1, holeR = n ? Math.min((d.rr - hub) * 0.3, ringR * Math.sin(Math.PI / n) * 0.62) : 0;
    const holes = []; for (let i = 0; i < n; i++) holes.push([ringR * Math.cos(((i + 0.5) * TAU) / n), ringR * Math.sin(((i + 0.5) * TAU) / n), holeR]);
    return { hub, holes, rr: d.rr, ra: d.ra, r: d.r, dot: [d.rr - Math.max(4.5, m * 0.9), 0, Math.max(2.6, Math.min(5, m * 0.55))] };
  };
  // angle of gear B (NB teeth) so that it meshes with gear A (NA teeth, angle a) when B sits in direction phi from A
  G.mesh = (a, NA, NB, phi) => phi + Math.PI + Math.PI / NB - ((a - phi) * NA) / NB;

  // ---- sprites: each gear is inked once into an offscreen canvas, then rotated ----
  const DPR = () => Math.min(2, window.devicePixelRatio || 1);
  G.layer = (w, h, paint) => {
    const dpr = DPR(), L = document.createElement('canvas'); L.width = Math.ceil(w * dpr); L.height = Math.ceil(h * dpr);
    const x = L.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.lineCap = x.lineJoin = 'round'; paint(x); L.w = w; L.h = h; return L;
  };
  // paint a gear centred on the current origin of x
  G.paint = (x, N, m, o = {}) => {
    const col = o.color || B, O = G.outline(N, m), p = G.parts(N, m);
    x.save(); x.fillStyle = rgba(col, 0.07); path(x, O); x.fill(); x.restore();
    if (o.hatch !== false) Ink.hatchFill(x, O, 0.55, col, o.density || 0.75);
    const punch = (cx, cy, r) => { x.save(); x.globalCompositeOperation = 'destination-out'; x.fillStyle = '#000'; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill(); x.restore(); };
    p.holes.forEach(([hx, hy, hr], i) => { punch(hx, hy, hr); Ink.stroke(x, geo.ellipse(hx, hy, hr, hr), { w: 1.7, color: col, seed: 40 + i, amp: 0.4, retrace: false }); });
    if (o.mark !== false) {                                                                 // one red tooth + a red spot: shows the turning
      const T = G.tooth(N, m, 0);
      x.save(); x.globalCompositeOperation = 'destination-out'; x.fillStyle = '#000'; path(x, T); x.fill(); x.restore();
      x.save(); x.fillStyle = rgba(RD, 0.78); path(x, T); x.fill(); x.restore();
      punch(p.dot[0], p.dot[1], p.dot[2] + 1.5);
      x.save(); x.fillStyle = rgba(RD, 0.92); x.beginPath(); x.arc(p.dot[0], p.dot[1], p.dot[2], 0, 7); x.fill(); x.restore();
    }
    Ink.stroke(x, O, { w: o.w || 2.1, color: col, seed: N * 3 + 1, amp: 0.3 });
    if (N >= 16) Ink.stroke(x, geo.ellipse(0, 0, p.rr - m * 0.75, p.rr - m * 0.75), { w: 1.2, color: col, seed: N + 5, amp: 0.4, retrace: false });
    punch(0, 0, p.hub);
    Ink.stroke(x, geo.ellipse(0, 0, p.hub, p.hub), { w: 1.9, color: col, seed: N + 9, amp: 0.4, retrace: false });
    x.save(); x.fillStyle = rgba(col, 0.92); x.beginPath(); x.arc(0, 0, Math.max(2.4, p.hub * 0.42), 0, 7); x.fill(); x.restore();   // the shaft
  };
  const cache = {};
  G.sprite = (N, m, o = {}) => {
    const key = [N, m, o.mark !== false, (o.color || B).join('.')].join('|');
    if (cache[key]) return cache[key];
    const S = Math.ceil(G.tipR(N, m) * 2 + 14);
    return (cache[key] = G.layer(S, S, (x) => { x.translate(S / 2, S / 2); G.paint(x, N, m, o); }));
  };
  G.draw = (ctx, sp, x, y, a) => { ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.drawImage(sp, -sp.w / 2, -sp.h / 2, sp.w, sp.h); ctx.restore(); };
  // a curved red arrow round a gear: dir > 0 = clockwise on the page
  G.arc = (ctx, cx, cy, R, a0, a1, dir, o = {}) => {
    const P = geo.ellipse(cx, cy, R, R, dir > 0 ? a0 : a1, dir > 0 ? a1 : a0);
    Ink.stroke(ctx, P, { w: o.w || 3, color: o.color || RD, seed: o.seed || 3, amp: 0.5 });
    Ink.stroke(ctx, geo.head(P, o.head || 14, 0.55), { w: o.w || 3, color: o.color || RD, seed: (o.seed || 3) + 1, amp: 0.3 });
  };

  // ---- a canvas with an on-demand render loop: render(ctx, dt) returns true while it still needs frames ----
  G.stage = (parent, W, Hh, render) => {
    const c = document.createElement('canvas'); c.className = 'cgp-cv'; parent.appendChild(c);
    const dpr = DPR(); c.width = W * dpr; c.height = Hh * dpr; c.style.aspectRatio = W + ' / ' + Hh;
    const ctx = c.getContext('2d');
    let vis = true;
    if (window.IntersectionObserver) new IntersectionObserver((es) => { vis = es[es.length - 1].isIntersecting; if (vis) go(); }, { rootMargin: '160px' }).observe(c);
    const hidden = () => { const p = c.closest('.page'); return !p || p.classList.contains('hidden'); };
    let raf = 0, last = 0, wait = 0;
    function tick(now) {
      raf = 0;
      if (hidden() || !vis) { last = 0; if (!wait && vis) wait = setTimeout(() => { wait = 0; go(); }, 400); return; }
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60; last = now;
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'source-over'; ctx.clearRect(0, 0, c.width, c.height);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.globalCompositeOperation = 'multiply'; ctx.lineCap = ctx.lineJoin = 'round';
      if (render(ctx, dt)) raf = requestAnimationFrame(tick); else last = 0;
    }
    function go() { if (!raf) raf = requestAnimationFrame(tick); }
    const pos = (e) => { const r = c.getBoundingClientRect(); return [((e.clientX - r.left) * W) / r.width, ((e.clientY - r.top) * Hh) / r.height]; };
    if (document.fonts) document.fonts.ready.then(go);
    go();
    return { c, ctx, go, pos, W, H: Hh };
  };
  // a round, touch-only handle laid over a gear (so the rest of the canvas still scrolls the page)
  G.handle = (wrap, W, Hh, cx, cy, R) => {
    const h = document.createElement('div'); h.className = 'cgp-handle';
    const put = (x, y, r) => Object.assign(h.style, { left: ((x - r) / W) * 100 + '%', top: ((y - r) / Hh) * 100 + '%', width: ((2 * r) / W) * 100 + '%', height: ((2 * r) / Hh) * 100 + '%' });
    put(cx, cy, R); wrap.appendChild(h); h.put = put; return h;
  };
  G.shell = (ui, o = {}) => {
    const d = ui.el('div', 'cgp-lab'); requestAnimationFrame(() => Ink.frame(d));
    const step = ui.el('div', 'cgp-step', o.step || '', d), task = ui.el('div', 'cgp-task', o.task || '', d);
    const cv = ui.el('div', 'cgp-cvwrap', '', d), btns = ui.el('div', 'cgp-btns', '', d), res = ui.el('div', 'cgp-res', '', d);
    return { d, step, task, cv, btns, res };
  };
  G.button = (ui, cls, label, parent) => { const b = ui.el('button', cls, label, parent); b.type = 'button'; return b; };

  const s = document.createElement('style'); s.id = 'cgp-css';
  s.textContent = `
    .cgp-lab { position: relative; margin: 0 0 calc(var(--R) * 1.4); padding: 12px 16px 16px; background: rgba(251,250,245,.9); }
    .cgp-lab > * { position: relative; }
    .cgp-cvwrap { position: relative; }
    .cgp-cv { display: block; width: 100%; height: auto; user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; touch-action: pan-y; }
    .cgp-handle { position: absolute; border-radius: 50%; touch-action: none; cursor: grab; -webkit-tap-highlight-color: transparent; }
    .cgp-handle.off { pointer-events: none; }
    .cgp-step { font: 700 14px Fredoka, system-ui; letter-spacing: .08em; text-transform: uppercase; color: var(--red); line-height: 22px; }
    .cgp-task { font-size: 19px; line-height: 1.5; margin: 0 0 4px; }
    .cgp-task b { font-family: Fredoka, system-ui; font-weight: 600; }
    .cgp-btns { display: flex; flex-wrap: wrap; gap: 10px; align-items: stretch; margin-top: 8px; }
    .cgp-btns .btn { margin-top: 0; min-height: 50px; }
    .cgp-btns .opt { flex: 1 1 130px; text-align: center; min-height: 52px; font-family: Fredoka, system-ui; font-weight: 600; }
    .cgp-res { display: none; margin-top: 10px; font-size: 18px; line-height: 1.5; }
    .cgp-res.on { display: block; }
    .cgp-res.good { color: var(--green); } .cgp-res.bad { color: var(--red); }
    .cgp-wait { font-size: 16px; line-height: 1.5; margin: 0 0 var(--R); color: var(--red); }
    .cgp-tbl { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 18px; line-height: 1.4; background: #fff; }
    .cgp-tbl th { font: 700 14px Fredoka, system-ui; text-transform: uppercase; letter-spacing: .05em; color: var(--red); text-align: left; }
    .cgp-tbl th, .cgp-tbl td { border: 2px solid rgba(30,46,150,.3); padding: 5px 10px; }
    .cgp-tbl td b { font-family: Fredoka, system-ui; font-weight: 600; }
    .cgp-echo { font-family: 'Gloria Hallelujah', cursive; font-weight: 400; color: var(--ink); border-bottom: 2px solid rgba(30,46,150,.25); padding: 0 4px; }
  `;
  document.head.appendChild(s);
})();

(function () {
  'use strict';
  const G = window.GearKit, B = Ink.BLUE, RD = Ink.RED, rgba = Ink.rgba, geo = Ink.geo, TAU = Math.PI * 2;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const W = 860;

  // dragging a gear round: calls turn(dAngle) as the finger moves round the centre, then lets it spin down
  function spinner(handle, stage, centre, S) {
    let drag = null;
    const ang = (e) => { const [x, y] = stage.pos(e), [cx, cy] = centre(); return Math.atan2(y - cy, x - cx); };
    handle.addEventListener('pointerdown', (e) => {
      if (S.locked) return; e.preventDefault(); try { handle.setPointerCapture(e.pointerId); } catch (_) {}
      drag = { a: ang(e), t: performance.now() }; S.vel = 0; S.auto = 0; S.held = true; stage.go();
    });
    handle.addEventListener('pointermove', (e) => {
      if (!drag) return; e.preventDefault();
      const a = ang(e), now = performance.now(); let d = a - drag.a; if (d > Math.PI) d -= TAU; if (d < -Math.PI) d += TAU;
      const dt = Math.max(0.004, (now - drag.t) / 1000);
      S.vel = clamp(0.6 * S.vel + 0.4 * (d / dt), -9, 9); drag.a = a; drag.t = now;
      S.turn(d); stage.go();
    });
    const up = () => { if (!drag) return; if (performance.now() - drag.t > 120) S.vel = 0; drag = null; S.held = false; stage.go(); };
    handle.addEventListener('pointerup', up); handle.addEventListener('pointercancel', up);
  }
  // one soft click per tooth that passes
  function clicker(N) { let acc = 0, lastT = 0; return (d) => { acc += Math.abs(d); const p = TAU / N; if (acc >= p) { acc %= p; const now = performance.now(); if (now - lastT > 45) { lastT = now; Book.sfx('tick', { gain: 0.22 }); } } }; }

  Book.page({
    id: 'p04',
    title: 'Gears: driver & driven',
    build(ui, root) {
      const items = Book.state.items;
      const done = (id) => { const it = items[id]; return !!it && (it.correct === true || it.attempts >= 3); };
      const locks = [];                                   // [element, () => stillLocked]
      let recalling = false;                              // true while the final blanks are being filled in
      const refresh = () => locks.forEach(([e, f, recall]) => { const w = e.closest('.ink-anim-wrap') || e; w.classList.toggle('peek-lock', f() || recalling); });
      const gate = (e, f, recall) => { locks.push([e, f, recall]); return e; };
      const no = () => false;

      ui.h('Gears: driver & driven');
      ui.p('Bikes, clocks, drills and car gearboxes all use <b>gears</b> to pass turning (rotary) motion from one shaft to another. <b>Tap the drawing</b> to watch a pair being drawn.');

      // ---------------------------------------------------------------- the words
      const m0 = 8, NA0 = 14, NB0 = 22, ax0 = 262, ay0 = 168, bx0 = ax0 + G.R(NA0, m0) + G.R(NB0, m0);
      const shift = (P, dx, dy, a = 0) => P.map(([x, y]) => [dx + x * Math.cos(a) - y * Math.sin(a), dy + x * Math.sin(a) + y * Math.cos(a)]);
      const a0 = -0.9, b0 = G.mesh(a0, NA0, NB0, 0);
      const OA = shift(G.outline(NA0, m0), ax0, ay0, a0), OB = shift(G.outline(NB0, m0), bx0, ay0, b0), pA = G.parts(NA0, m0), pB = G.parts(NB0, m0);
      ui.anim({
        w: W, h: 340, duration: 13, poster: 13,
        draw(k) {
          k.line(OA, 0.2, 2.4, { w: 2.2, amp: 0.3, seed: 43 });
          k.hatch(OA, 2.2, 2.8, { density: 0.75 });
          k.circle(ax0, ay0, pA.hub, 2.4, 2.7, { w: 1.9, retrace: false }); k.dot(ax0, ay0, 4.5, 2.7);
          k.line(OB, 2.9, 5.6, { w: 2.2, amp: 0.3, seed: 67 });
          k.hatch(OB, 5.4, 6.0, { density: 0.75 });
          k.circle(bx0, ay0, pB.hub, 5.6, 5.9, { w: 1.9, retrace: false }); k.dot(bx0, ay0, 4.5, 5.9);
          shift(pB.holes.map((h) => [h[0], h[1]]), bx0, ay0, b0).forEach(([hx, hy], i) => k.circle(hx, hy, pB.holes[0][2], 5.9 + i * 0.1, 6.1 + i * 0.1, { w: 1.6, retrace: false, seed: 11 + i }));
          // labels
          k.text('teeth', 40, 96, 6.4, 6.8, { size: 26, color: RD });
          k.arrow([[118, 100], [ax0 - 60, ay0 - 30]], 6.7, 7.1, { color: RD, w: 2.4, head: 12, seed: 5 });
          const mx = ax0 + G.R(NA0, m0);
          k.text('the teeth mesh', mx - 60, 318, 7.3, 8.0, { size: 26, color: RD, align: 'center' });
          k.arrow([[mx - 20, 292], [mx - 2, ay0 + 22]], 7.9, 8.3, { color: RD, w: 2.4, head: 12, seed: 6 });
          k.text('DRIVER gear', ax0 - 40, 40, 8.5, 9.1, { size: 26, align: 'center' });
          k.text('(input)', 60, 232, 9.0, 9.4, { size: 24 });
          k.text('DRIVEN gear', bx0 + 60, 40, 9.6, 10.2, { size: 26, align: 'center' });
          k.text('(output)', bx0 + 118, 232, 10.1, 10.5, { size: 24 });
          k.text('a gear', 716, 104, 10.8, 11.2, { size: 30, color: RD });
          k.text('train', 724, 142, 11.2, 11.6, { size: 30, color: RD });
          k.text('spur gears:', 640, 232, 11.8, 12.2, { size: 22 }); k.text('straight teeth', 640, 262, 12.2, 12.8, { size: 22 });
        },
        sound(k) {
          const st = (t, d, g = 0.4) => k.play('stroke', t, { material: 'pen', dur: d, gain: g });
          st(0.2, 2.5); st(2.9, 3.1); st(6.4, 0.7); st(7.3, 1.0); st(8.5, 0.9); st(9.6, 0.9); st(10.8, 0.8); st(11.8, 1.0);
        },
      });
      const introAnim = gate(root.lastElementChild, no);
      const introBox = gate(ui.box('A <b>gear</b> is a wheel with <b>teeth</b> around its edge. The standard straight-toothed gear is a <b>spur gear</b>.<br>The teeth <span class="key">mesh</span> (interlock), so gears <b>cannot slip</b>.<br>Two or more meshed gears make a <span class="key">gear train</span>.<br>The <b>driver gear</b> is the <b>input</b> (turned by the motor or your effort). The <b>driven gear</b> is the <b>output</b>.', { tag: 'Notes' }), no);

      // ================================================================ bench 1: direction
      ui.el('h2', '', 'Bench 1: which way does it turn?');
      const predict1 = ui.predict({
        id: 'p04.dir-predict', label: 'Predict: which way will the driven gear turn?',
        q: '<b>Predict first.</b> You are about to turn the driver gear with your finger. Which way will the driven gear turn?',
        options: ['The same way as the driver', 'The opposite way to the driver', 'It will not turn at all'],
        onPick: () => { b1.locked = false; h1.classList.remove('off'); s1.go(); sh1.task.innerHTML = T1b; },
      });
      const T1a = 'Make your prediction above to unlock the gears.', T1b = '<b>Put a finger on the driver gear and drag it round</b>, one way then the other. Watch the red tooth on each gear.';
      const sh1 = G.shell(ui, { step: 'Bench 1', task: items['p04.dir-predict'] ? T1b : T1a });
      const m1 = 9, N1 = 18, R1 = G.R(N1, m1), ax = 430 - R1, bx = 430 + R1, cy1 = 150, H1 = 312;
      const spA = G.sprite(N1, m1), spB = G.sprite(N1, m1);
      const b1 = { a: -2.0, vel: 0, total: 0, dir: 0, locked: !items['p04.dir-predict'], held: false, tested: false };
      const click1 = clicker(N1);
      b1.turn = (d) => {
        b1.a += d; b1.total += Math.abs(d); click1(d);
        if (Math.abs(d) > 1e-4) b1.dir = Math.sign(d);
        if (!b1.tested && b1.total > TAU * 0.75) { b1.tested = true; reveal1(); }
      };
      const s1 = G.stage(sh1.cv, W, H1, (ctx, dt) => {
        let more = false;
        if (!b1.held && Math.abs(b1.vel) > 0.05) { b1.turn(b1.vel * dt); b1.vel *= Math.exp(-2.2 * dt); more = true; }
        G.draw(ctx, spA, ax, cy1, b1.a); G.draw(ctx, spB, bx, cy1, G.mesh(b1.a, N1, N1, 0));
        G.text(ctx, 'DRIVER', ax, H1 - 34, { size: 24, align: 'center' }); G.text(ctx, 'you turn this', ax, H1 - 8, { font: 'hand', size: 22, align: 'center' });
        G.text(ctx, 'DRIVEN', bx, H1 - 34, { size: 24, align: 'center' }); G.text(ctx, 'watch this', bx, H1 - 8, { font: 'hand', size: 22, align: 'center' });
        if (b1.locked) { G.text(ctx, 'predict', 60, 130, { font: 'hand', size: 28, color: RD }); G.text(ctx, 'first!', 68, 166, { font: 'hand', size: 28, color: RD }); }
        else if (!b1.dir) {
          G.text(ctx, 'drag me', 62, 118, { font: 'hand', size: 26, color: RD }); G.text(ctx, 'round!', 72, 152, { font: 'hand', size: 26, color: RD });
          Ink.stroke(ctx, [[176, 128], [ax - R1 - 18, 140]], { w: 2.4, color: RD, seed: 8 }); Ink.stroke(ctx, geo.head([[176, 128], [ax - R1 - 18, 140]], 12), { w: 2.4, color: RD, seed: 9 });
        } else {                                              // what it is doing right now
          G.arc(ctx, ax, cy1, R1 + 24, -2.3, -0.95, b1.dir, { seed: 21 });
          G.arc(ctx, bx, cy1, R1 + 24, -2.2, -0.85, -b1.dir, { seed: 25 });
        }
        return more;
      });
      const h1 = G.handle(sh1.cv, W, H1, ax, cy1, R1 + 22); if (b1.locked) h1.classList.add('off');
      spinner(h1, s1, () => [ax, cy1], b1);

      const wait1 = ui.el('div', 'cgp-wait', 'Turn the driver gear on the bench to unlock the question.');
      const q1 = ui.mcq({
        id: 'p04.dir', label: 'Bench 1: two meshed gears turn…',
        q: '<b>What did you see?</b> When two gears mesh, the driven gear turns…',
        options: [
          { t: 'the opposite way to the driver', ok: true, why: 'Yes: each tooth pushes its neighbour the other way, so clockwise becomes anticlockwise.' },
          { t: 'the same way as the driver', mis: 'gear-direction', why: 'Look again at the red teeth. Where the teeth touch they move together, so the two wheels must spin opposite ways.' },
          { t: 'the same way first, then it swaps', mis: 'gear-direction', why: 'It never swaps on its own. Drag the driver slowly and watch the red tooth on each gear.' },
        ],
      });
      const reveal1 = () => { wait1.style.display = 'none'; q1.style.display = ''; };
      if (items['p04.dir']) reveal1(); else q1.style.display = 'none';
      const n1 = gate(ui.box('Two meshed gears always turn in <span class="key">opposite directions</span>.<br>If the driver turns clockwise, the driven gear turns anticlockwise.', { tag: 'Notes' }), () => !done('p04.dir'));
      q1.addEventListener('click', () => setTimeout(refresh, 60));

      // ================================================================ bench 2: the idler
      ui.el('h2', '', 'Bench 2: add an idler gear');
      ui.p('An <b>idler</b> is an extra gear put <b>between</b> the driver and the driven gear. First turn the driver <b>2 full turns</b> without it and read the turn counters.');
      const predict2 = ui.predict({
        id: 'p04.idler-predict', label: 'Predict: driven gear direction and speed with an idler',
        q: '<b>Predict</b> what the driven gear will do once the idler is in. <span class="small">(Then the idler button unlocks.)</span>',
        options: ['Turns the same way as the driver, at the same speed as before', 'Turns the same way as the driver, but slower than before', 'Still turns the opposite way, at the same speed as before', 'Still turns the opposite way, but slower than before'],
        onPick: () => { idBtn.disabled = false; setIdBtn(); },
      });
      const sh2 = G.shell(ui, { step: 'Bench 2', task: '<b>Drag the driver round</b> (or use the button). Each counter shows how many turns its gear has made.' });
      const m2 = 7, NA2 = 15, NI2 = 10, NB2 = 30, RA2 = G.R(NA2, m2), RI2 = G.R(NI2, m2), RB2 = G.R(NB2, m2), H2 = 336, cy2 = 204, ax2 = 266;
      const spA2 = G.sprite(NA2, m2), spI2 = G.sprite(NI2, m2), spB2 = G.sprite(NB2, m2);
      const b2 = { a: 2.3, a0: 2.3, vel: 0, held: false, locked: false, auto: 0, idler: false, u: 0, bAng: 0, bOff: 0, testedWith: false, dir: 0 };
      const click2 = clicker(NA2);
      const turnsA = () => (b2.a - b2.a0) / TAU;
      b2.turn = (d) => {
        if (b2.u > 0 && b2.u < 1) return;
        b2.a += d; click2(d); if (Math.abs(d) > 1e-4) b2.dir = Math.sign(d);
        if (b2.idler && !b2.testedWith && Math.abs(turnsA()) >= 1) { b2.testedWith = true; reveal2(); }
      };
      const counter = (ctx, x, y, label, turns, dir) => {
        const P = geo.rect(x - 74, y - 30, 148, 40, 8);
        ctx.save(); ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = 'rgba(255,255,255,.9)'; G.path(ctx, P); ctx.fill(); ctx.restore();
        Ink.stroke(ctx, P, { w: 2, seed: 12 + (x | 0) % 7, amp: 0.5, retrace: false });
        G.text(ctx, label, x, y - 38, { size: 20, align: 'center' });
        const n = Math.abs(turns);
        G.text(ctx, (Math.floor(n * 10 + 1e-6) / 10).toFixed(1) + (n >= 0.95 && n < 1.05 ? ' turn' : ' turns'), x - 8, y - 2, { size: 23, align: 'center' });
        if (dir) G.text(ctx, dir > 0 ? '↻' : '↺', x + 56, y, { size: 26, align: 'center', color: RD });
      };
      const s2 = G.stage(sh2.cv, W, H2, (ctx, dt) => {
        let more = false;
        if (b2.auto) { const d = Math.min(Math.abs(b2.auto), 3.6 * dt) * Math.sign(b2.auto); b2.auto -= d; b2.turn(d); more = Math.abs(b2.auto) > 1e-6; if (!more) b2.auto = 0; }
        else if (!b2.held && Math.abs(b2.vel) > 0.05) { b2.turn(b2.vel * dt); b2.vel *= Math.exp(-2.2 * dt); more = true; }
        const tgt = b2.idler ? 1 : 0;
        if (b2.u !== tgt) { b2.u = clamp(b2.u + (tgt ? 1 : -1) * dt / 0.45); more = true; if (b2.u === tgt) Book.sfx('pop', { gain: 0.4 }); }
        const e = b2.u * b2.u * (3 - 2 * b2.u);
        const bx2 = ax2 + RA2 + RB2 + 2 * RI2 * e, ix = ax2 + RA2 + RI2;
        const aI = G.mesh(b2.a, NA2, NI2, 0);
        const want = b2.idler ? G.mesh(aI, NI2, NB2, 0) : G.mesh(b2.a, NA2, NB2, 0);
        let aB = want;
        if (b2.u > 0 && b2.u < 1) {                                             // sliding: ease the driven gear onto its new teeth
          const p = TAU / NB2; let d = (want - b2.bAng) % p; if (d > p / 2) d -= p; if (d < -p / 2) d += p;
          aB = b2.bAng + d * (b2.idler ? e : 1 - e);
        } else b2.bAng = want;
        // the slotted base the shafts sit in
        Ink.stroke(ctx, geo.rect(ax2 - 24, cy2 - 7, 2 * (RA2 + RI2) + RB2 + 60, 14, 7), { w: 1.4, seed: 3, amp: 0.5, retrace: false });
        G.draw(ctx, spA2, ax2, cy2, b2.a);
        if (b2.u > 0) { ctx.save(); ctx.globalAlpha = e; G.draw(ctx, spI2, ix, cy2 - (1 - e) * 70, aI); ctx.restore(); }
        G.draw(ctx, spB2, bx2, cy2, aB);
        const tA = turnsA(), settled = b2.u === 0 || b2.u === 1, sgn = b2.idler ? 1 : -1;
        counter(ctx, ax2, 62, 'DRIVER · ' + NA2 + ' teeth', tA, Math.abs(tA) > 0.02 ? Math.sign(tA) : 0);
        if (settled) counter(ctx, bx2, 62, 'DRIVEN · ' + NB2 + ' teeth', (tA * NA2) / NB2, Math.abs(tA) > 0.02 ? sgn * Math.sign(tA) : 0);
        if (b2.u === 1) G.text(ctx, 'idler · ' + NI2 + ' teeth', ix - 6, cy2 - RI2 - 22, { font: 'hand', size: 22, align: 'center', color: RD });
        if (!b2.dir && !b2.auto) G.text(ctx, 'drag me!', ax2 - 6, cy2 + RA2 + 44, { font: 'hand', size: 24, color: RD, align: 'center' });
        return more;
      });
      const h2 = G.handle(sh2.cv, W, H2, ax2, cy2, RA2 + 24);
      spinner(h2, s2, () => [ax2, cy2], b2);
      const idBtn = G.button(ui, 'btn', '', sh2.btns), autoBtn = G.button(ui, 'btn ghost', '▶ Turn the driver 2 turns', sh2.btns), zeroBtn = G.button(ui, 'btn ghost', '↺ Zero the counters', sh2.btns);
      const setIdBtn = () => { idBtn.textContent = idBtn.disabled ? '🔒 Idler gear (predict first)' : b2.idler ? '− Take the idler out' : '＋ Put the idler gear in'; };
      idBtn.disabled = !items['p04.idler-predict']; setIdBtn();
      const zero = () => { b2.a0 = b2.a; b2.vel = 0; b2.auto = 0; s2.go(); };
      idBtn.onclick = () => { if (b2.u > 0 && b2.u < 1) return; b2.idler = !b2.idler; zero(); setIdBtn(); Book.sfx('tick', { gain: 0.5 }); s2.go(); };
      autoBtn.onclick = () => { if (b2.u > 0 && b2.u < 1) return; zero(); b2.auto = 2 * TAU; s2.go(); };
      zeroBtn.onclick = () => { zero(); Book.sfx('tick', { gain: 0.4 }); };

      const wait2 = ui.el('div', 'cgp-wait', 'Put the idler in and turn the driver at least one full turn to unlock the question.');
      const q2 = ui.mcq({
        id: 'p04.idler', label: 'Bench 2: what does an idler gear do?',
        q: '<b>What does an idler gear do</b> to the driven gear?',
        options: [
          { t: 'Makes it turn the same way as the driver, without changing its speed', ok: true, why: 'Yes: the idler flips the direction once more, and the counters showed the same number of turns as before.' },
          { t: 'Makes it turn the same way as the driver, and also slows it down', mis: 'idler-ratio', why: 'The direction is right, but check the counters: for 2 turns of the driver, the driven gear turned the same amount with and without the idler.' },
          { t: 'Makes it turn faster, but still the opposite way to the driver', mis: 'idler-ratio,gear-direction', why: 'Test it again. The counters show the same number of turns as before, and the arrows now point the same way.' },
          { t: 'Makes it turn slower, but still the opposite way to the driver', mis: 'idler-ratio,gear-direction', why: 'Test it again. The counters show the same number of turns as before, and the arrows now point the same way.' },
        ],
      });
      const reveal2 = () => { wait2.style.display = 'none'; q2.style.display = ''; };
      if (items['p04.idler']) reveal2(); else q2.style.display = 'none';
      const n2 = gate(ui.box('An <span class="key">idler gear</span> sits between the driver and the driven gear. It makes them turn in the <b>same direction</b>.<br>The idler does <b>not</b> change the speed of the driven gear, however many teeth it has.', { tag: 'Notes' }), () => !done('p04.idler'));
      q2.addEventListener('click', () => setTimeout(refresh, 60));

      // ================================================================ bench 3: size, speed and torque
      ui.el('h2', '', 'Bench 3: change the driven gear');
      ui.p('<b>Torque</b> is turning force. This motor always turns the small driver gear at the same speed, with the same torque. The driven gear winds a <b>winch</b>: each time, it is loaded with the <b>heaviest weight it can just lift</b>.');
      const sh3 = G.shell(ui, { step: 'Bench 3', task: '<b>Tap a driven gear</b>, then run the winch. Test all three sizes.' });
      const m3 = 5, ND = 12, RD3 = G.R(ND, m3), SIZES = [{ N: 12, name: 'Small', kg: 1 }, { N: 24, name: 'Medium', kg: 2 }, { N: 48, name: 'Large', kg: 4 }];
      const H3 = 400, gx = 372, gy = 214, DRUM = 26, RX = 752, RY = 92, RR = 15, FLOOR = 374, LIFT = 118, RPM = 120;
      const spD3 = G.sprite(ND, m3);
      const motorL = G.layer(170, 110, (x) => {
        const P = geo.rect(12, 16, 118, 74, 10);
        Ink.hatchShadow(x, P, 1, 6, 6); Ink.hatchFill(x, P, 0.5, B, 0.7); Ink.stroke(x, P, { w: 2.4, seed: 4 });
        for (let i = 0; i < 4; i++) Ink.stroke(x, [[30 + i * 16, 26], [30 + i * 16, 80]], { w: 1.4, seed: 30 + i, retrace: false });
      });
      const drumL = G.layer(70, 70, (x) => {
        x.translate(35, 35);
        x.save(); x.globalCompositeOperation = 'source-over'; x.fillStyle = 'rgba(251,250,245,.95)'; x.beginPath(); x.arc(0, 0, DRUM, 0, 7); x.fill(); x.restore();
        Ink.stroke(x, geo.ellipse(0, 0, DRUM, DRUM), { w: 2.4, seed: 14, amp: 0.4 });
        Ink.stroke(x, geo.ellipse(0, 0, DRUM - 6, DRUM - 6), { w: 1.3, seed: 15, amp: 0.4, retrace: false });
        Ink.stroke(x, geo.ellipse(0, 0, DRUM - 11, DRUM - 11), { w: 1.3, seed: 16, amp: 0.4, retrace: false });
        x.fillStyle = rgba(B, 0.92); x.beginPath(); x.arc(0, 0, 5, 0, 7); x.fill();
        x.fillStyle = rgba(RD, 0.9); x.beginPath(); x.arc(DRUM - 16, 0, 3.4, 0, 7); x.fill();
      });
      const wSize = { 0: [58, 52], 1: [46, 40], 2: [60, 54], 4: [80, 72] };
      const wL = {};
      const weight = (kg) => wL[kg] || (wL[kg] = G.layer(110, 110, (x) => {
        const [w, h] = wSize[kg], P = geo.rect(55 - w / 2, 100 - h, w, h, 6);
        Ink.stroke(x, geo.ellipse(55, 100 - h - 6, 6, 6), { w: 2, seed: 3 + kg, retrace: false });
        Ink.hatchShadow(x, P, 1, 5, 5); Ink.hatchFill(x, P, 0.5 + kg * 0.1, B, 0.6 + kg * 0.25); Ink.stroke(x, P, { w: 2.6, seed: 7 + kg });
        x.save(); x.globalCompositeOperation = 'source-over'; x.fillStyle = 'rgba(251,250,245,.94)'; x.beginPath(); x.roundRect(55 - w / 2 + 4, 100 - h / 2 - 14, w - 8, 28, 6); x.fill(); x.restore();
        G.text(x, kg ? kg + ' kg' : '?', 55, 100 - h / 2 + 8, { size: 22, align: 'center', color: kg ? B : RD });
      }));
      const b3 = { sel: 1, a: 0.3, phase: 'idle', u: 0, shown: false, needle: 0, tested: {} };
      const rec3 = ((items['p04.size'] || {}).answer != null);
      if (rec3) SIZES.forEach((_, i) => (b3.tested[i] = true));
      const s3 = G.stage(sh3.cv, W, H3, (ctx, dt) => {
        let more = false;
        const sz = SIZES[b3.sel], Rn = G.R(sz.N, m3), ratio = sz.N / ND, dx = gx - Rn - RD3;
        if (b3.phase === 'lift') {
          const w = TAU * 0.8; b3.a += w * dt; clk3(w * dt);
          b3.u = Math.min(1, b3.u + ((w / ratio) * DRUM * dt) / LIFT); more = true;
          if (b3.u >= 1) { b3.phase = 'top'; more = false; finish3(); }
        }
        const aN = G.mesh(b3.a, ND, sz.N, 0);
        ctx.drawImage(motorL, dx - 130, gy - 53, 170, 110);
        G.draw(ctx, spD3, dx, gy, b3.a);
        G.draw(ctx, G.sprite(sz.N, m3), gx, gy, aN);
        G.draw(ctx, drumL, gx, gy, aN);
        // rope: off the top of the drum, over the roller, down to the weight
        const wy = FLOOR - b3.u * LIFT, kg = b3.shown ? sz.kg : 0, top = wy - wSize[kg][1] - 12;
        ctx.save(); ctx.strokeStyle = rgba(B, 0.9); ctx.lineWidth = 2.4;
        ctx.beginPath(); ctx.moveTo(gx, gy - DRUM); ctx.lineTo(RX, RY - RR); ctx.arc(RX, RY, RR, -Math.PI / 2, 0); ctx.lineTo(RX + RR, top); ctx.stroke(); ctx.restore();
        Ink.stroke(ctx, geo.ellipse(RX, RY, RR - 4, RR - 4), { w: 2, seed: 5, amp: 0.3, retrace: false });
        Ink.stroke(ctx, [[RX, RY], [RX, 22], [RX - 40, 22], [RX + 40, 22]], { w: 2.2, seed: 6, retrace: false });
        Ink.stroke(ctx, [[640, FLOOR + 2], [W - 14, FLOOR + 2]], { w: 2.2, seed: 7 });
        ctx.drawImage(weight(kg), RX + RR - 55, wy - 100, 110, 110);
        // labels
        G.text(ctx, 'MOTOR', dx - 62, gy - 60, { size: 22, align: 'center' });
        G.text(ctx, RPM + ' rpm', dx - 62, gy + 82, { size: 22, align: 'center' });
        G.text(ctx, 'driver: ' + ND + ' teeth', dx - 40, gy + 110, { font: 'hand', size: 22, align: 'center' });
        G.text(ctx, 'driven: ' + sz.N + ' teeth', gx, Math.min(H3 - 10, gy + Rn + 36), { font: 'hand', size: 22, align: 'center' });
        G.text(ctx, 'winch drum', gx + 40, gy - Rn - 14 < 30 ? 30 : gy - Rn - 14, { font: 'hand', size: 22 });
        // output rev counter + torque dial: only once this size has been run
        const P = geo.rect(520, 26, 170, 44, 8);
        ctx.save(); ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = 'rgba(255,255,255,.9)'; G.path(ctx, P); ctx.fill(); ctx.restore();
        Ink.stroke(ctx, P, { w: 2, seed: 13, amp: 0.5, retrace: false });
        G.text(ctx, 'OUTPUT SPEED', 605, 20, { size: 20, align: 'center' });
        G.text(ctx, b3.shown ? RPM / ratio + ' rpm' : '? rpm', 605, 58, { size: 26, align: 'center', color: b3.shown ? B : RD });
        const DX = 588, DY = 346, DR = 62;
        Ink.stroke(ctx, geo.ellipse(DX, DY, DR, DR, Math.PI, TAU), { w: 2.4, seed: 17, amp: 0.4 });
        Ink.stroke(ctx, [[DX - DR - 6, DY], [DX + DR + 6, DY]], { w: 2.2, seed: 18 });
        for (let i = 0; i <= 8; i++) { const an = Math.PI + (i * Math.PI) / 8; Ink.stroke(ctx, [[DX + Math.cos(an) * (DR - 9), DY + Math.sin(an) * (DR - 9)], [DX + Math.cos(an) * (DR - 2), DY + Math.sin(an) * (DR - 2)]], { w: 1.6, seed: 20 + i, retrace: false, amp: 0 }); }
        G.text(ctx, 'TORQUE', DX, DY + 22, { size: 20, align: 'center' });
        G.text(ctx, 'low', DX - DR - 4, DY - DR + 6, { font: 'hand', size: 21, align: 'right' }); G.text(ctx, 'high', DX + DR + 2, DY - DR + 6, { font: 'hand', size: 21 });
        const tgtN = b3.shown ? ratio / 4.6 : 0;
        if (Math.abs(b3.needle - tgtN) > 0.002) { b3.needle += (tgtN - b3.needle) * Math.min(1, dt * 5); more = true; }
        const na = Math.PI + 0.12 + b3.needle * (Math.PI - 0.24);
        ctx.save(); ctx.strokeStyle = rgba(RD, 0.92); ctx.lineWidth = 3.4; ctx.beginPath(); ctx.moveTo(DX, DY - 2); ctx.lineTo(DX + Math.cos(na) * (DR - 14), DY - 2 + Math.sin(na) * (DR - 14)); ctx.stroke();
        ctx.fillStyle = rgba(RD, 0.95); ctx.beginPath(); ctx.arc(DX, DY - 2, 5, 0, 7); ctx.fill(); ctx.restore();
        return more;
      });
      const clk3 = clicker(ND);
      const sizeBtns = SIZES.map((sz, i) => { const b = G.button(ui, 'opt', `${sz.name}<br><span class="small">${sz.N} teeth</span>`, sh3.btns); b.onclick = () => pick3(i); return b; });
      const run3 = G.button(ui, 'btn', '▶ Run the winch', sh3.btns);
      const tbl = ui.el('table', 'cgp-tbl', '', sh3.d);
      const drawTbl = () => {
        tbl.innerHTML = '<tr><th>Driven gear</th><th>Output speed</th><th>Heaviest load lifted</th><th>Lift</th></tr>' +
          SIZES.map((sz, i) => `<tr><td><b>${sz.name}</b> (${sz.N} teeth)</td>` + (b3.tested[i] ? `<td>${RPM / (sz.N / ND)} rpm</td><td>${sz.kg} kg</td><td>${['fast', 'slower', 'very slow'][i]}</td>` : '<td>?</td><td>?</td><td>?</td>') + '</tr>').join('');
      };
      const pick3 = (i) => {
        if (b3.phase === 'lift') return;
        b3.sel = i; b3.phase = 'idle'; b3.u = 0; b3.shown = false; run3.disabled = false;
        sizeBtns.forEach((b, j) => b.classList.toggle('sel', j === i)); Book.sfx('tick', { gain: 0.5 }); s3.go();
      };
      run3.onclick = () => { if (b3.phase === 'lift') return; b3.phase = 'lift'; b3.u = 0; b3.shown = true; run3.disabled = true; Book.sfx('pop', { gain: 0.45 }); s3.go(); };
      const finish3 = () => {
        b3.tested[b3.sel] = true; drawTbl(); Book.sfx('thud', { gain: 0.35 }); run3.disabled = false;
        if (SIZES.every((_, i) => b3.tested[i])) reveal3();
      };
      sizeBtns[1].classList.add('sel'); drawTbl();

      const wait3 = ui.el('div', 'cgp-wait', 'Run the winch with all three driven gears to unlock the question.');
      const q3 = ui.mcq({
        id: 'p04.size', label: 'Bench 3: small driver → big driven gives…',
        q: 'A <b>small driver</b> gear turns a <b>big driven</b> gear. Compared with the driver, the driven gear turns…',
        options: [
          { t: 'slower, but with more torque', ok: true, why: 'Yes: the large gear was the slowest, but it lifted the heaviest load. This is called gearing down.' },
          { t: 'faster, but with less torque', mis: 'big-is-fast', why: 'Check your table: the large driven gear had the lowest output speed and lifted the heaviest load.' },
          { t: 'faster, and with more torque', mis: 'big-is-fast,speed-torque', why: 'You never get something for nothing. Check your table: the gear that lifted the most was also the slowest.' },
          { t: 'slower, and with less torque', mis: 'speed-torque', why: 'Half right. It is slower, but check your table: the slowest gear lifted the heaviest load.' },
        ],
      });
      const reveal3 = () => { wait3.style.display = 'none'; q3.style.display = ''; };
      if (items['p04.size']) reveal3(); else q3.style.display = 'none';
      const n3 = gate(ui.box('<b>Small driver → big driven</b>: the output is <span class="key">slower but has more torque</span>. This is <b>gearing down</b> (a winch, a food mixer, low gear on a bike for hills).<br><b>Big driver → small driven</b>: the output is <span class="key">faster but has less torque</span>. This is <b>gearing up</b> (a hand whisk, top gear on a bike).<br>You never get something for nothing: more speed <b>or</b> more torque, never both.', { tag: 'Notes' }), () => !done('p04.size'));
      q3.addEventListener('click', () => setTimeout(refresh, 60));

      // ================================================================ check
      const above = [...root.children];                    // everything before the check blurs while the gaps are filled in
      ui.el('h2', '', 'Check: fill the gaps');
      ui.p('<span class="small">From memory! Everything above blurs while you fill these in.</span>');
      const fill = ui.fill({
        id: 'p04.blanks', label: 'Gears: fill the gaps (8 blanks)',
        html: 'A gear is a wheel with {{teeth|tooth|teeths}} around its edge. The teeth {{mesh|interlock|meshed|meshes|lock|mesh together}} so the gears cannot slip.<br>' +
          'The gear turned by the motor is the {{driver|drive|driving|input}} gear. The output gear is the {{driven|output}} gear.<br>' +
          'Two meshed gears turn in {{opposite|different|opposing}} directions. An {{idler|idle|idler gear}} gear between them makes them turn the {{same}} way.<br>' +
          'A small driver turning a big driven gear gives a slower output with more {{torque|turning force|force}}.',
        explain: 'Teeth mesh so gears cannot slip; driver = input, driven = output; meshed gears turn opposite ways; an idler makes them turn the same way; gearing down gives more torque.',
      });
      void predict1; void predict2;
      const recall = (on) => { recalling = on; above.forEach((e) => e.classList.toggle('peek-lock', on)); if (!on) refresh(); };
      const fillDone = () => done('p04.blanks');
      fill.addEventListener('pointerdown', () => { if (!fillDone() && !recalling) { Ink.stopAll(root); recall(true); } }, { passive: true });
      fill.addEventListener('click', () => setTimeout(() => { if (fillDone() && recalling) recall(false); }, 60));
      refresh();
      void introAnim; void introBox; void n1; void n2; void n3;
    },
  });
})();
