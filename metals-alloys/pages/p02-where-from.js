// Page 2 — From rock to metal. Charge a pen-drawn blast furnace (drag in iron ore, coke and limestone), blast hot
// air in and tap off the molten iron and the slag; hold the power on an electrolysis cell and watch the meter race;
// order the four stages; match the ores; predict then test the energy saved by recycling aluminium; two true/false.
(function () {
  'use strict';
  const B = Ink.BLUE, RD = Ink.RED, rgba = Ink.rgba, geo = Ink.geo;
  const HANDF = (s) => `400 ${s}px "Gloria Hallelujah", "Comic Sans MS", cursive`;
  const LABF = (s) => `600 ${s}px Fredoka, "Arial Rounded MT Bold", system-ui, sans-serif`;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const close = (P) => P.concat([P[0]]);
  const PAPER = '#fbfaf5';

  function text(x, s, px, py, o = {}) {
    x.save(); x.font = (o.font === 'hand' ? HANDF : LABF)(o.size || 22);
    x.fillStyle = rgba(o.color || B, o.a ?? 0.92); x.textAlign = o.align || 'left'; x.textBaseline = 'alphabetic';
    x.translate(px, py); if (o.rot) x.rotate(o.rot); x.fillText(s, 0, 0); x.restore();
  }
  function pen(x, pts, o = {}) {
    const P = o.wob === false ? pts : geo.wob(geo.seg(pts, 3), o.seed ?? 11, o.amp ?? 0.6);
    x.save(); x.strokeStyle = rgba(o.color || B, o.a ?? 0.85); x.lineWidth = o.w ?? 1.6; x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath();
    P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); if (o.close) x.closePath(); x.stroke(); x.restore();
  }
  // a flat felt-tip wash inside a closed shape (drawn before the ink so the ink sits on top)
  function wash(x, pts, css) { x.save(); x.fillStyle = css; x.beginPath(); pts.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.closePath(); x.fill(); x.restore(); }

  // an interactive canvas with an on-demand render loop (stops when the page is hidden)
  function Stage(parent, W, Hh) {
    const c = document.createElement('canvas'); parent.appendChild(c);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = Math.round(W * dpr); c.height = Math.round(Hh * dpr);
    Object.assign(c.style, { width: '100%', height: 'auto', aspectRatio: W + ' / ' + Hh, display: 'block', touchAction: 'pan-y', userSelect: 'none', webkitUserSelect: 'none', webkitTouchCallout: 'none', cursor: 'pointer' });
    const ctx = c.getContext('2d');
    const S = { c, ctx, W, H: Hh, render: () => false };
    S.pos = (e) => { const r = c.getBoundingClientRect(); return [((e.clientX - r.left) * W) / r.width, ((e.clientY - r.top) * Hh) / r.height]; };
    S.layer = (w, h, paint) => { const L = document.createElement('canvas'); L.width = Math.ceil(w * dpr); L.height = Math.ceil(h * dpr); const x = L.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.lineCap = 'round'; x.lineJoin = 'round'; paint(x); L.w = w; L.h = h; return L; };
    S.blit = (L, px, py) => ctx.drawImage(L, px, py, L.w, L.h);
    const hidden = () => { const p = c.closest('.page'); return !p || p.classList.contains('hidden'); };
    let raf = 0, wait = 0, last = 0;
    const tick = (now) => {
      raf = 0;
      if (hidden()) { last = 0; if (!wait) wait = setTimeout(() => { wait = 0; S.go(); }, 400); return; }
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60; last = now;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.globalCompositeOperation = 'source-over'; ctx.clearRect(0, 0, W, Hh);
      ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = 1; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      if (S.render(dt, now / 1000)) raf = requestAnimationFrame(tick); else last = 0;
    };
    S.go = () => { if (!raf) raf = requestAnimationFrame(tick); };
    // drag inside a hit zone: that touch no longer scrolls the page; everywhere else a vertical swipe still scrolls
    S.drag = (hit, on) => {
      let id = null;
      c.addEventListener('touchstart', (e) => { if (hit(S.pos(e.changedTouches[0]))) e.preventDefault(); }, { passive: false });
      c.addEventListener('pointerdown', (e) => { const p = S.pos(e); if (id !== null || !hit(p)) return; id = e.pointerId; try { c.setPointerCapture(id); } catch (er) {} on.start && on.start(p); S.go(); });
      c.addEventListener('pointermove', (e) => { if (e.pointerId !== id) return; on.move && on.move(S.pos(e)); S.go(); });
      ['pointerup', 'pointercancel'].forEach((ev) => c.addEventListener(ev, (e) => { if (e.pointerId !== id) return; id = null; on.end && on.end(S.pos(e)); S.go(); }));
      S.dragging = () => id !== null;
    };
    S.dragging = () => false;
    c.addEventListener('contextmenu', (e) => e.preventDefault());
    if (document.fonts) document.fonts.ready.then(() => { S.onFonts && S.onFonts(); S.go(); });
    return S;
  }

  const dot = (x, px, py, r, c = B, a = 0.9) => { x.fillStyle = rgba(c, a); x.beginPath(); x.arc(px, py, r, 0, 7); x.fill(); };
  const sstep = (a, b, v) => { const u = clamp((v - a) / (b - a)); return u * u * (3 - 2 * u); };
  const path = (x, pts) => { x.beginPath(); pts.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.closePath(); };
  const IRON = 'rgba(255,150,20,.82)', SLAG = 'rgba(150,112,70,.5)', ALU = 'rgba(160,180,200,.55)';
  if (!document.getElementById('ma2-css')) {
    const s = document.createElement('style'); s.id = 'ma2-css';
    s.textContent = `
      .ma-lab { position: relative; margin: 0 0 var(--R); }
      .ma-stat { font-size: 19px; line-height: 1.5; margin: 6px 0 12px; min-height: 58px; }
      .ma-stat b { font-family: Fredoka, system-ui; font-weight: 600; }
      .ma-row { display: flex; flex-wrap: wrap; gap: 14px; align-items: center; margin: 0 0 12px; }
      .ma-row .btn { margin-top: 0; min-height: 60px; min-width: 240px; font-size: 20px; touch-action: none; user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; }
      .ma-hide { display: none !important; }
    `;
    document.head.appendChild(s);
  }

  // a lump of rock: an irregular little polygon
  function lump(x, cx, cy, r, seed, kind) {
    const rr = H.rng(seed), P = []; const n = 6 + (seed % 2);
    for (let i = 0; i < n; i++) { const a = (i / n) * 6.283 + rr.range(-0.2, 0.2), q = r * rr.range(0.72, 1.08); P.push([cx + Math.cos(a) * q, cy + Math.sin(a) * q * 0.82]); }
    wash(x, P, PAPER);
    if (kind === 'ore') { wash(x, P, 'rgba(196,96,64,.36)'); Ink.hatchFill(x, P, 1, B, 1.1); }
    else if (kind === 'coke') { wash(x, P, 'rgba(30,46,150,.45)'); Ink.hatchFill(x, P, 1, B, 3.4); }
    else { pen(x, [[cx - r * 0.3, cy - r * 0.1], [cx + r * 0.1, cy + r * 0.2]], { w: 1, a: 0.5, wob: false }); }
    pen(x, close(P), { w: 1.7, wob: false, a: 0.95 });
  }
  const MAT = [
    { k: 'ore', name: 'iron ore', by: 150 },
    { k: 'coke', name: 'coke', by: 300 },
    { k: 'lime', name: 'limestone', by: 448 },
  ];

  Book.page({
    id: 'p02',
    title: 'From rock to metal',
    build(ui, root) {
      const got = (id) => Book.state.items[id];
      ui.h('From rock to metal');
      const intro = ui.box('You cannot dig up a steel girder. Metals are found in the <b>Earth\'s crust</b> as <span class="key">ores</span>: rock that contains a metal compound.<br>The ore is <b>mined</b> (or quarried). Then the metal is <b>extracted</b> from the ore, and finally it is <b>refined</b>.', { tag: 'Notes' });

      // =========================================================================================== 1. blast furnace
      const hF = ui.el('h2', '', 'Make iron: work the blast furnace');
      const fWrap = ui.el('div', 'ma-lab');
      const W = 860, HH = 570, FX = 470, GY = 540, TOP = 86, FLOOR = 478;
      const hw = (y) => (y <= TOP ? 46 : y <= 350 ? 46 + ((y - TOP) / 264) * 54 : y <= 420 ? 100 - ((y - 350) / 70) * 24 : 76);
      const side = (sg, off, y0, y1) => { const o = []; for (let y = y0; y <= y1; y += 8) o.push([FX + sg * (hw(y) + off), y]); o.push([FX + sg * (hw(y1) + off), y1]); return o; };
      const INNER = side(-1, 0, TOP, FLOOR).concat(side(1, 0, TOP, FLOOR).reverse());
      const S = Stage(fWrap, W, HH);
      const fStat = ui.el('div', 'ma-stat', '', fWrap);
      const rF = ui.record('p02.furnace', { label: 'Blast furnace: charged it, blasted air, tapped the iron', type: 'experiment', max: 1 });
      const pf = rF.get() || {};
      const charged = (pf.charged || []).filter((k) => MAT.some((m) => m.k === k));
      let blasted = !!pf.blasted, tapped = !!pf.tapped, bT = blasted ? 1 : 0, qT = tapped ? 1 : 0, blasting = false, tapping = false;
      let carry = null, fly = null, hintT = 0;
      const stage = () => (tapped ? 'done' : tapping ? 'tapping' : blasted ? 'molten' : blasting ? 'blasting' : charged.length === 3 ? 'ready' : 'charge');
      function saveF() {
        rF.set({ answer: `charged: ${charged.map((k) => MAT.find((m) => m.k === k).name).join(', ') || 'nothing yet'}; blasted hot air in: ${blasted ? 'yes' : 'no'}; tapped the molten iron: ${tapped ? 'yes' : 'no'}`,
          correct: tapped ? true : null, score: tapped ? 1 : 0, max: 1, charged: charged.slice(), blasted, tapped });
      }
      let sprF, sprHeap = {}, sprLoad = {}, sprBand = {};
      function artF() {
        MAT.forEach((m, mi) => {
          sprHeap[m.k] = S.layer(170, 80, (x) => { const rr = H.rng(31 + mi); [[30, 62, 17], [62, 64, 18], [96, 63, 18], [130, 64, 16], [46, 42, 17], [80, 40, 19], [114, 44, 17], [64, 22, 15], [96, 22, 15]].forEach(([a, b, r], i) => lump(x, a + 6 + rr.range(-3, 3), b + rr.range(-2, 2), r, 7 * mi + i + 3, m.k)); });
          sprLoad[m.k] = S.layer(90, 64, (x) => { [[24, 44, 15], [52, 46, 16], [70, 40, 13], [38, 24, 14], [60, 22, 13]].forEach(([a, b, r], i) => lump(x, a, b, r, 11 * mi + i + 5, m.k)); });
          sprBand[m.k] = S.layer(240, 84, (x) => { const rr = H.rng(71 + mi); for (let row = 0; row < 3; row++) for (let c = 0; c < 8; c++) lump(x, 14 + c * 30 + (row % 2) * 14 + rr.range(-4, 4), 16 + row * 26 + rr.range(-3, 3), rr.range(13, 17), 13 * mi + row * 8 + c + 9, m.k); });
        });
        sprF = S.layer(W, HH, (x) => {
          Ink.stroke(x, [[8, GY], [W - 8, GY]], { w: 2.8, seed: 51 });
          // foundation
          const fd = [[FX - 128, 494], [FX + 128, 494], [FX + 128, GY], [FX - 128, GY]]; Ink.hatchFill(x, fd, 1, B, 0.7); Ink.stroke(x, close(fd), { w: 2.4, seed: 3 });
          // the brick lining: the gap between the inner and the outer skin is hatched
          [-1, 1].forEach((sg) => {
            const inn = side(sg, 0, TOP, FLOOR), out = side(sg, 16, TOP, 494);
            const wall = inn.concat([[FX + sg * 76, 494]], out.slice().reverse()); Ink.hatchFill(x, wall, 1, B, 1.5);
            Ink.stroke(x, inn, { w: 2.4, seed: 5 + sg, amp: 0.5 }); Ink.stroke(x, out, { w: 2.8, seed: 8 + sg, amp: 0.5 });
            for (let y = 110; y < 480; y += 26) pen(x, [[FX + sg * hw(y), y], [FX + sg * (hw(y) + 16), y]], { w: 1.2, wob: false, a: 0.7 });
            // charging hopper
            Ink.stroke(x, [[FX + sg * 96, 40], [FX + sg * 62, TOP], [FX + sg * 46, TOP]], { w: 2.4, seed: 12 + sg, amp: 0.4 });
          });
          Ink.stroke(x, [[FX - 76, FLOOR], [FX + 76, FLOOR]], { w: 2.4, seed: 15 }); Ink.stroke(x, [[FX - 92, 494], [FX + 92, 494]], { w: 2.4, seed: 16 });
          // hot-air pipe from the blower, and the blower itself
          Ink.stroke(x, [[FX + 93, 408], [700, 408]], { w: 2.2, seed: 21 }); Ink.stroke(x, [[FX + 93, 424], [700, 424]], { w: 2.2, seed: 22 });
          const bl = geo.rect(700, 352, 136, 96, 10); wash(x, bl, PAPER); Ink.hatchShadow(x, bl, 1, 6, 6); Ink.stroke(x, bl, { w: 2.8, seed: 23 });
          Ink.stroke(x, geo.ellipse(742, 416, 22, 22), { w: 2, seed: 24, retrace: false });
          text(x, 'hot air', 768, 382, { size: 22, align: 'center' });
          // runners (little channels) for the iron and the slag, a ladle and a slag pot
          Ink.stroke(x, [[FX + 93, 476], [664, 492]], { w: 2.2, seed: 31 }); pen(x, [[FX + 93, 464], [664, 480]], { w: 1.4, a: 0.6 });
          Ink.stroke(x, [[648, 496], [656, GY], [744, GY], [752, 496]], { w: 2.8, seed: 32 }); pen(x, [[640, 496], [760, 496]], { w: 2.2 });
          Ink.stroke(x, [[FX - 93, 452], [322, 478]], { w: 2.2, seed: 33 }); pen(x, [[FX - 93, 440], [322, 466]], { w: 1.4, a: 0.6 });
          Ink.stroke(x, [[238, 484], [248, GY], [308, GY], [318, 484]], { w: 2.8, seed: 34 }); pen(x, [[230, 484], [326, 484]], { w: 2.2 });
          // the three stock piles and their names
          MAT.forEach((m, i) => { pen(x, [[22, m.by], [200, m.by]], { w: 2, seed: 40 + i }); text(x, m.name, 110, m.by + 28, { size: 23, align: 'center' }); });
        });
      }
      artF(); S.onFonts = artF;
      const stockTop = () => 400 - charged.length * 80;

      S.render = (dt, t) => {
        const x = S.ctx; let busy = S.dragging() || !!fly;
        if (blasting) { bT = Math.min(1, bT + dt / 3.6); busy = true; if (bT >= 1) { blasting = false; blasted = true; Book.sfx('success', { gain: 0.3 }); saveF(); paintF(); } }
        if (tapping) { qT = Math.min(1, qT + dt / 3.2); busy = true; if (qT >= 1) { tapping = false; tapped = true; Book.sfx('success', { gain: 0.35 }); saveF(); paintF(); } }
        const st = stage(), hot = bT > 0;
        // ---- inside the furnace (clipped to the inner skin)
        x.save(); path(x, INNER); x.clip();
        if (hot) { const g = x.createRadialGradient(FX, 420, 10, FX, 420, 60 + 150 * bT); g.addColorStop(0, `rgba(255,170,30,${0.75 * bT})`); g.addColorStop(0.6, `rgba(255,205,70,${0.4 * bT})`); g.addColorStop(1, 'rgba(255,225,120,0)'); x.fillStyle = g; x.fillRect(FX - 130, 150, 260, 340); }
        const sink = 30 * sstep(0, 1, bT) + 14 * qT;
        charged.forEach((k, i) => { x.save(); x.beginPath(); x.rect(FX - 120, 0, 240, 436); x.clip(); S.blit(sprBand[k], FX - 120, 400 - (i + 1) * 80 + sink - 2); x.restore(); });
        if (hot) {
          const lvI = bT * (1 - 0.72 * qT), lvS = bT * (1 - 0.8 * qT), yi = FLOOR - 26 * lvI, ys = yi - 13 * lvS;
          x.fillStyle = IRON; x.fillRect(FX - 80, yi, 160, FLOOR - yi);
          x.fillStyle = SLAG; x.fillRect(FX - 80, ys, 160, yi - ys);
          if (yi - ys > 3) Ink.hatchFill(x, [[FX - 80, ys], [FX + 80, ys], [FX + 80, yi], [FX - 80, yi]], 1, B, 1.2);
          pen(x, [[FX - 78, yi], [FX + 78, yi]], { w: 1.6, seed: 3 + ((t * 6) | 0) % 3, color: RD }); pen(x, [[FX - 78, ys], [FX + 78, ys]], { w: 1.6, seed: 5 + ((t * 5) | 0) % 3 });
          // flames licking up through the charge while the air is on
          if (blasting || (blasted && !tapped)) { for (let i = 0; i < 6; i++) { const fx = FX - 62 + i * 25, ph = t * 7 + i * 1.9, top = 372 - 26 * (0.5 + 0.5 * Math.sin(ph)) * (blasting ? 1 : 0.5); pen(x, geo.curve([fx, 432], [fx - 12, 410], [fx + 12, 396], [fx + 4 * Math.sin(ph), top], 10), { w: 2.4, color: RD, a: 0.8, wob: false }); } busy = true; }
        }
        x.restore();
        S.blit(sprF, 0, 0);
        // ---- heaps (a pile shrinks to a scatter once its load has gone in)
        MAT.forEach((m) => { const gone = charged.includes(m.k) || (carry && carry.k === m.k) || (fly && fly.k === m.k); x.save(); if (gone) x.globalAlpha = 0.22; S.blit(sprHeap[m.k], 25, m.by - 80); x.restore(); });
        if (st === 'charge' && !carry && !fly) { hintT += dt; const m = MAT.find((q) => !charged.includes(q.k)); if (m) { const a = 0.5 + 0.5 * Math.sin(t * 4); pen(x, geo.curve([196, m.by - 50], [270, m.by - 120], [360, 30], [FX - 20, 44], 24), { w: 2.2, color: RD, a: 0.35 + 0.4 * a, wob: false }); pen(x, [[FX - 36, 34], [FX - 18, 44], [FX - 34, 56]], { w: 2.4, color: RD, a: 0.35 + 0.4 * a, wob: false }); text(x, 'drag in', 250, m.by - 96, { font: 'hand', size: 24, color: RD }); busy = true; } }
        // ---- blower: the fan spins and red dashes rush down the pipe while it blasts
        const spin = blasting ? t * 14 : blasted && !tapped ? t * 3 : 0;
        for (let i = 0; i < 4; i++) { const a = spin + (i * Math.PI) / 2; pen(x, [[742, 416], [742 + Math.cos(a) * 19, 416 + Math.sin(a) * 19]], { w: 2.6, wob: false }); }
        dot(x, 742, 416, 4);
        if (blasting || (blasted && !tapped)) { for (let i = 0; i < 5; i++) { const u = (t * (blasting ? 1.6 : 0.6) + i / 5) % 1, px = 696 - u * 126; pen(x, [[px, 416], [px - 16, 416]], { w: 3, color: RD, wob: false, a: 0.9 }); } }
        if (st === 'ready') { const a = 0.5 + 0.5 * Math.sin(t * 5); Ink.stroke(x, geo.ellipse(768, 400, 82 + a * 4, 62 + a * 4), { w: 2.6, color: RD, seed: 77, retrace: false }); text(x, 'tap to blast!', 768, 330, { font: 'hand', size: 24, color: RD, align: 'center' }); busy = true; }
        if (blasting) Ink.drawBubble(x, 'WHOOSH!', 650, 386, 28, RD, 1, -0.05, 'center');
        // ---- tap hole plug, streams, ladle and slag pot
        const PX = FX + 96, PY = 470;
        if (st === 'molten') { const a = 0.5 + 0.5 * Math.sin(t * 5); dot(x, PX, PY, 9, RD, 0.95); Ink.stroke(x, geo.ellipse(PX, PY, 22 + a * 5, 22 + a * 5), { w: 2.6, color: RD, seed: 78, retrace: false }); text(x, 'tap the plug!', PX + 30, PY - 16, { font: 'hand', size: 24, color: RD }); busy = true; }
        else if (!hot || st === 'blasting') dot(x, PX, PY, 8, B, 0.9);
        if (qT > 0) {
          const run = tapping, fill = sstep(0.1, 1, qT);
          x.save(); x.lineCap = 'round';
          if (run) { // molten iron down its runner, slag down the other
            x.strokeStyle = IRON; x.lineWidth = 9; x.beginPath(); x.moveTo(PX, 471); x.lineTo(662, 487); x.lineTo(676, 500 + 34 * (1 - fill)); x.stroke();
            x.strokeStyle = SLAG; x.lineWidth = 8; x.beginPath(); x.moveTo(FX - 94, 447); x.lineTo(324, 473); x.lineTo(310, 490 + 40 * (1 - fill)); x.stroke();
            pen(x, [[PX, 471], [662, 487]], { w: 1.4, color: RD, seed: ((t * 8) | 0) % 4 });
          }
          const li = GY - 3 - 36 * fill, ladle = [[651 + (li - 496) * 0.18, li], [749 - (li - 496) * 0.18, li], [743, GY - 3], [657, GY - 3]]; wash(x, ladle, IRON); pen(x, [ladle[0], ladle[1]], { w: 1.6, color: RD });
          const ls = GY - 3 - 30 * fill, pot = [[241 + (ls - 484) * 0.18, ls], [315 - (ls - 484) * 0.18, ls], [306, GY - 3], [250, GY - 3]]; wash(x, pot, SLAG); Ink.hatchFill(x, pot, 1, B, 1.2); pen(x, [pot[0], pot[1]], { w: 1.6 });
          x.restore();
        }
        if (tapped) {
          text(x, 'molten iron', 700, 484, { size: 23, align: 'center', color: RD });
          text(x, 'slag', 278, 572 - 104, { size: 23, align: 'center' });
        }
        // ---- a load on the move
        if (fly) {
          fly.t += dt / fly.dur; const u = Math.min(1, fly.t); let px, py;
          if (u < 0.7) { const v = u / 0.7; px = fly.x0 + (FX - fly.x0) * v; py = fly.y0 + (30 - fly.y0) * v - Math.sin(v * Math.PI) * 60; }
          else { const v = (u - 0.7) / 0.3; px = FX; py = 30 + (stockTop() - 40 - 30) * v * v; }
          S.blit(sprLoad[fly.k], px - 45, py - 32);
          if (u >= 1) { charged.push(fly.k); fly = null; Book.sfx('thud', { gain: 0.45 }); saveF(); paintF(); }
        } else if (carry) S.blit(sprLoad[carry.k], carry.x - 45, carry.y - 44);
        return busy;
      };
      const heapAt = (p) => MAT.find((m) => !charged.includes(m.k) && Math.abs(p[0] - 110) < 92 && p[1] > m.by - 86 && p[1] < m.by + 40);
      S.drag((p) => stage() === 'charge' && !fly && !!heapAt(p), {
        start: (p) => { const m = heapAt(p); carry = { k: m.k, x: p[0], y: p[1], x0: p[0], y0: p[1], far: 0 }; Book.sfx('tick', { gain: 0.5 }); },
        move: (p) => { if (!carry) return; carry.far = Math.max(carry.far, Math.hypot(p[0] - carry.x0, p[1] - carry.y0)); carry.x = p[0]; carry.y = p[1]; },
        end: () => {
          if (!carry) return; const c = carry; carry = null;
          if (c.far < 14) fly = { k: c.k, x0: 110, y0: MAT.find((m) => m.k === c.k).by - 40, t: 0, dur: 1.0 };      // a tap: it flies in by itself
          else if (Math.abs(c.x - FX) < 130 && c.y < 440) fly = { k: c.k, x0: c.x, y0: c.y, t: 0.62, dur: 1.0 };   // dropped over the furnace
          else Book.sfx('error', { gain: 0.2 });
        },
      });
      S.c.addEventListener('click', (e) => {
        const [px, py] = S.pos(e), st = stage();
        if (st === 'ready' && px > 670 && py > 320 && py < 470) { blasting = true; Book.sfx('stroke', { material: 'pen', dur: 1.4, gain: 0.6 }); Book.sfx('pop', { gain: 0.4 }); paintF(); S.go(); }
        else if (st === 'molten' && Math.hypot(px - (FX + 96), py - 470) < 62) { tapping = true; Book.sfx('pop', { gain: 0.5 }); paintF(); S.go(); }
      });
      const notesF = ui.box('<b>Iron</b> comes from <b>iron ore</b> (haematite). The ore is heated in a <span class="key">blast furnace</span> with <b>coke</b> (carbon) and <b>limestone</b>, and hot air is blasted in.<br>Molten iron (“pig iron”) runs out at the bottom. The impurities float off as <b>slag</b>.<br>Iron is then turned into <b>steel</b> by removing most of the carbon (oxygen is blown through it).', { tag: 'Notes: iron' });
      function paintF() {
        const st = stage(), tk = (k) => (charged.includes(k) ? '☑' : '☐');
        fStat.innerHTML = st === 'charge' ? `<b>Step 1: charge the furnace.</b> Drag each pile into the top (or tap it): ${tk('ore')} iron ore &nbsp; ${tk('coke')} coke &nbsp; ${tk('lime')} limestone`
          : st === 'ready' ? '<b>Step 2:</b> all three are in. Now <b>tap the blower</b> to blast hot air in near the bottom.'
          : st === 'blasting' ? 'The coke burns fiercely in the blast of air, and the ore starts to melt…'
          : st === 'molten' ? '<b>Step 3:</b> two liquids have collected at the bottom, one floating on the other. <b>Tap the red plug</b> to let them out.'
          : st === 'tapping' ? 'Out it comes…'
          : '<span class="green">✓ Done.</span> The <b>molten iron</b> ran out at the bottom into the ladle. The impurities, called <b>slag</b>, were floating on top of the iron, so they ran off separately.';
        notesF.classList.toggle('ma-hide', !tapped);
        if (tapped) requestAnimationFrame(() => Ink.frame(notesF));
        S.go();
      }

      // =========================================================================================== 2. electrolysis cell
      const hC = ui.el('h2', '', 'Make aluminium: switch on the cell');
      const cIntro = ui.p('Aluminium will not come out of its ore in a furnace like that. It takes something else. <b>Press and hold</b> the power button, and keep an eye on the meter.');
      const cWrap = ui.el('div', 'ma-lab');
      const W2 = 860, H2 = 330, CG = 292;
      const S2 = Stage(cWrap, W2, H2);
      const row = ui.el('div', 'ma-row', '', cWrap);
      const hold = ui.el('button', 'btn', '⚡ Hold for power', row); hold.type = 'button';
      const cStat = ui.el('span', 'ma-stat', '', row); cStat.style.cssText = 'flex:1 1 260px;margin:0;min-height:0';
      const rC = ui.record('p02.cell', { label: 'Electrolysis cell: ran it until aluminium collected', type: 'experiment', max: 1 });
      const KWH = 15000;
      let cp = (rC.get() || {}).done ? 1 : 0, cDone = cp >= 1, power = false, ingT = cDone ? 1 : 0, sprC;
      function artC() {
        sprC = S2.layer(W2, H2, (x) => {
          Ink.stroke(x, [[8, CG], [W2 - 8, CG]], { w: 2.6, seed: 51 });
          // power supply
          const pb = geo.rect(28, 120, 150, 130, 10); wash(x, pb, PAPER); Ink.hatchShadow(x, pb, 1, 6, 6); Ink.stroke(x, pb, { w: 2.8, seed: 3 });
          text(x, 'power', 103, 152, { size: 23, align: 'center' });
          pen(x, [[60, 250], [60, CG]], { w: 2.2, wob: false }); pen(x, [[146, 250], [146, CG]], { w: 2.2, wob: false });
          // cables: power → bus bar, and tank → meter → back
          Ink.stroke(x, geo.curve([150, 120], [150, 60], [230, 62], [300, 64], 20), { w: 2.6, seed: 5 });
          const bar = [[296, 56], [614, 56], [614, 72], [296, 72]]; Ink.hatchFill(x, bar, 1, B, 2.2); Ink.stroke(x, close(bar), { w: 2.2, seed: 6, amp: 0.3 });
          // the tank (a steel box with a thick lining)
          const tank = [[282, 150], [282, CG - 4], [628, CG - 4], [628, 150]]; Ink.stroke(x, tank, { w: 3, seed: 8 });
          const lin = [[298, 150], [298, 272], [612, 272], [612, 150]]; Ink.stroke(x, lin, { w: 2, seed: 9 });
          Ink.hatchFill(x, [[282, 150], [298, 150], [298, 272], [612, 272], [612, 150], [628, 150], [628, CG - 4], [282, CG - 4]], 1, B, 1.5);
          // three carbon blocks hanging in the liquid
          [334, 425, 516].forEach((ax, i) => { pen(x, [[ax + 30, 72], [ax + 30, 124]], { w: 3, wob: false }); const bk = geo.rect(ax, 124, 60, 104, 5); wash(x, bk, PAPER); wash(x, bk, 'rgba(30,46,150,.3)'); Ink.hatchFill(x, bk, 1, B, 2.6); Ink.stroke(x, bk, { w: 2.2, seed: 11 + i, amp: 0.3 }); });
          // sack of ore
          const sack = [[196, CG], [190, 226], [204, 204], [258, 204], [272, 226], [266, CG]]; wash(x, sack, PAPER); wash(x, sack, 'rgba(196,96,64,.25)'); Ink.stroke(x, close(sack), { w: 2.2, seed: 15 });
          pen(x, [[206, 204], [214, 192], [248, 192], [256, 204]], { w: 2 });
          text(x, 'bauxite', 231, 256, { size: 22, align: 'center' });
          Ink.stroke(x, geo.curve([236, 186], [240, 140], [262, 126], [296, 134], 14), { w: 2, seed: 16, retrace: false }); pen(x, [[284, 124], [297, 134], [283, 142]], { w: 2, wob: false });
          // the meter
          Ink.stroke(x, geo.curve([628, 250], [660, 250], [690, 230], [700, 178], 16), { w: 2.6, seed: 18 });
          const mb = geo.rect(650, 44, 184, 134, 10); wash(x, mb, PAPER); Ink.hatchShadow(x, mb, 1, 6, 6); Ink.stroke(x, mb, { w: 2.8, seed: 19 });
          text(x, 'electricity meter', 742, 72, { size: 22, align: 'center' });
          Ink.stroke(x, geo.rect(664, 84, 156, 46, 5), { w: 2, seed: 20, retrace: false });
          text(x, 'kWh', 742, 166, { size: 22, align: 'center' });
        });
      }
      artC(); S2.onFonts = artC;
      S2.render = (dt, t) => {
        const x = S2.ctx; let busy = false; const run = power && !cDone;
        if (run) { cp = Math.min(1, cp + dt / 6); busy = true; if (cp >= 1) { cDone = true; power = false; Book.sfx('success', { gain: 0.35 }); rC.set({ answer: 'ran the cell until aluminium collected: yes', correct: true, score: 1, max: 1, done: true }); paintC(); } }
        if (cDone && ingT < 1) { ingT = Math.min(1, ingT + dt / 1.2); busy = true; }
        // the molten bath, and the pool of aluminium growing on the floor of the tank
        const bath = [[298, 172], [612, 172], [612, 272], [298, 272]]; wash(x, bath, run ? 'rgba(255,190,70,.4)' : 'rgba(255,205,110,.22)');
        pen(x, [[298, 172], [612, 172]], { w: 1.6, seed: run ? 3 + ((t * 8) | 0) % 4 : 3 });
        const ya = 272 - 24 * cp * (1 - 0.75 * ingT); if (cp > 0.02) { wash(x, [[298, ya], [612, ya], [612, 272], [298, 272]], ALU); Ink.hatchFill(x, [[298, ya], [612, ya], [612, 272], [298, 272]], 1, B, 1.6); pen(x, [[298, ya], [612, ya]], { w: 1.8 }); }
        S2.blit(sprC, 0, 0);
        if (run) { // bubbles round the blocks and sparks along the cable
          for (let i = 0; i < 12; i++) { const bx = 322 + ((i * 53) % 280), u = (t * 1.3 + i * 0.37) % 1; pen(x, geo.ellipse(bx, 262 - u * 84, 3.5, 3.5), { w: 1.3, wob: false, a: 1 - u }); }
          for (let i = 0; i < 3; i++) { const u = (t * 2 + i / 3) % 1, P = geo.curve([150, 120], [150, 60], [230, 62], [300, 64], 20), q = P[Math.floor(u * 20)]; pen(x, [[q[0] - 7, q[1] - 7], [q[0] + 2, q[1] - 1], [q[0] - 3, q[1] + 2], [q[0] + 7, q[1] + 8]], { w: 2.4, color: RD, wob: false }); }
        }
        // the big button on the power box
        const on = power && !cDone; x.save(); x.fillStyle = on ? 'rgba(178,28,38,.75)' : 'rgba(178,28,38,.18)'; x.beginPath(); x.arc(103, 200, 30, 0, 7); x.fill(); x.restore();
        Ink.stroke(x, geo.ellipse(103, 200, 30, 30), { w: 2.6, color: RD, seed: 41, retrace: false });
        pen(x, [[108, 182], [96, 202], [108, 200], [98, 218]], { w: 2.8, color: on ? [251, 250, 245] : RD, wob: false });
        if (!cDone && !power && cp === 0) text(x, 'hold!', 103, 110, { font: 'hand', size: 24, color: RD, align: 'center' });
        // meter digits (they race while the power is on)
        const n = Math.round(cp * KWH), sdig = String(n).padStart(5, '0');
        for (let i = 0; i < 5; i++) { const dx = 680 + i * 31; pen(x, [[dx + 15, 86], [dx + 15, 128]], { w: 1, a: i < 4 ? 0.4 : 0, wob: false }); const jit = run && i >= 2 ? Math.sin(t * 40 + i) * 3 : 0; text(x, run && i >= 3 ? String((Math.random() * 10) | 0) : sdig[i], dx, 119 + jit, { size: 30, align: 'center', color: run ? RD : B }); }
        if (cp > 0 && !cDone) text(x, Math.round(cp * 100) + '%', 455, 30, { size: 24, align: 'center' });
        // the finished ingot
        if (cDone) {
          const ix = 668 + 40 * (1 - sstep(0, 1, ingT)), ing = [[ix + 12, 232], [ix + 148, 232], [ix + 162, CG - 2], [ix, CG - 2]];
          wash(x, ing, PAPER); wash(x, ing, ALU); Ink.hatchShadow(x, ing, ingT, 5, 5); Ink.stroke(x, close(ing), { w: 2.6, seed: 61 });
          text(x, 'aluminium', ix + 81, 272, { size: 23, align: 'center' });
        }
        return busy;
      };
      const pOn = (e) => { if (cDone) return; if (e) e.preventDefault(); power = true; Book.sfx('tick', { gain: 0.5 }); paintC(); S2.go(); }, pOff = () => { if (!power) return; power = false; paintC(); S2.go(); };
      hold.addEventListener('pointerdown', (e) => { try { hold.setPointerCapture(e.pointerId); } catch (er) {} pOn(e); });
      ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((ev) => hold.addEventListener(ev, pOff));
      hold.addEventListener('contextmenu', (e) => e.preventDefault());
      hold.addEventListener('keydown', (e) => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) pOn(e); }); hold.addEventListener('keyup', pOff);
      S2.drag((p) => !cDone && Math.hypot(p[0] - 103, p[1] - 190) < 80, { start: () => pOn(), end: pOff });
      const notesC = ui.box('<b>Aluminium</b> comes from an ore called <span class="key">bauxite</span>. It is extracted by <span class="key">electrolysis</span>, which uses a <b>huge amount of electricity</b>. That makes it expensive.<br><b>Copper</b> comes from copper ore. It is smelted, then purified by electrolysis.', { tag: 'Notes: aluminium and copper' });
      function paintC() {
        hold.disabled = cDone; hold.textContent = cDone ? '✓ Aluminium made' : power ? '⚡ Power ON…' : cp > 0 ? '⚡ Keep holding!' : '⚡ Hold for power';
        cStat.innerHTML = cDone ? `<span class="green">✓</span> A big block of aluminium (about a tonne), and roughly <b>${KWH.toLocaleString('en-GB')} kWh</b> on the meter. This way of getting a metal out of its ore using electricity is called <b>electrolysis</b>.`
          : power ? 'Electricity is pouring through the molten ore…' : cp > 0 ? 'Let go and it stops. No electricity, no aluminium.' : '';
        notesC.classList.toggle('ma-hide', !cDone);
        if (cDone) requestAnimationFrame(() => Ink.frame(notesC));
      }

      // =========================================================================================== 3. check
      ui.el('h2', '', 'Check: rock to metal');
      ui.p('<span class="small">The notes and drawings above will blur while you answer these two.</span>');
      const blurThese = [intro, hF, hC, fWrap, notesF, cIntro, cWrap, notesC];
      const seq = ui.sort({ id: 'p02.sequence', label: 'Order the 4 stages: ore, mine, extract, refine', q: 'Put the four stages in order. Tap a card, then tap its box.',
        buckets: ['1st', '2nd', '3rd', '4th'],
        items: [
          { t: 'Ore lies in the Earth\'s crust', b: 0 },
          { t: 'The ore is mined or quarried', b: 1 },
          { t: 'The metal is extracted from the ore', b: 2 },
          { t: 'The metal is refined', b: 3 },
        ],
        explain: 'Ore in the ground → mined → metal extracted → metal refined.' });
      ui.hideWhile(seq, 'p02.sequence', blurThese);
      const ores = ui.match({ id: 'p02.ores', label: 'Match ores and extraction words to their meanings (6)', q: 'Tap a word on the left, then tap what goes with it.',
        pairs: [
          ['Iron ore (haematite)', 'heated in a blast furnace with coke and limestone', 'ore-extraction'],
          ['Bauxite', 'the ore that aluminium is extracted from', 'ore-extraction'],
          ['Electrolysis', 'extracting a metal using a huge amount of electricity', 'ore-extraction'],
          ['Slag', 'the impurities that float on top of the molten iron'],
          ['Coke', 'a form of carbon that is burned in the furnace'],
          ['Steel', 'iron that has had most of its carbon removed'],
        ] });
      ui.hideWhile(ores, 'p02.ores', blurThese);

      // =========================================================================================== 4. recycling
      ui.el('h2', '', 'Or skip the ore altogether');
      ui.p('Old drinks cans can be melted down and made into new ones. How much <b>energy</b> does that take, compared with making a can from bauxite? <b>Drag the red marker</b> along the lower bar to show your prediction, then test it.');
      const rWrap = ui.el('div', 'ma-lab');
      const W3 = 860, H3 = 304, X0 = 70, X1 = 790, YA = 62, YB = 172, BH = 38;
      const S3 = Stage(rWrap, W3, H3);
      const row3 = ui.el('div', 'ma-row', '', rWrap);
      const goB = ui.el('button', 'btn', '♻ Melt the old cans', row3); goB.type = 'button'; goB.style.touchAction = 'manipulation';
      const rStat = ui.el('span', 'ma-stat', '', row3); rStat.style.cssText = 'flex:1 1 260px;margin:0;min-height:0';
      const rR = ui.record('p02.recycle', { label: 'Recycling aluminium: predicted the energy needed, then tested', type: 'predict', max: 0 });
      const pr = rR.get() || {};
      let guess = pr.guess ?? 100, set = pr.guess != null, ran = !!pr.ran, running = false, fillT = ran ? 1 : 0, sprR;
      const GX = (pc) => X0 + ((X1 - X0) * pc) / 100;
      function artR() {
        sprR = S3.layer(W3, H3, (x) => {
          text(x, 'Energy to make a can from bauxite', X0, YA - 14, { size: 23 });
          const a = [[X0, YA], [X1, YA], [X1, YA + BH], [X0, YA + BH]]; wash(x, a, 'rgba(255,205,70,.5)'); Ink.hatchFill(x, a, 1, B, 1.3); Ink.stroke(x, close(a), { w: 2.6, seed: 3, amp: 0.4 });
          text(x, 'Energy to make a can from recycled cans', X0, YB - 14, { size: 23 });
          Ink.stroke(x, close([[X0, YB], [X1, YB], [X1, YB + BH], [X0, YB + BH]]), { w: 2.6, seed: 5, amp: 0.4 });
          for (let k = 0; k <= 10; k++) { const tx = GX(k * 10); pen(x, [[tx, YB + BH], [tx, YB + BH + (k % 5 ? 6 : 11)]], { w: 1.4, wob: false, a: 0.7 }); }
        });
      }
      artR(); S3.onFonts = artR;
      S3.render = (dt, t) => {
        const x = S3.ctx; let busy = S3.dragging();
        if (running) { fillT = Math.min(1, fillT + dt / 2.2); busy = true; if (Math.random() < 0.3) Book.sfx('tick', { gain: 0.15 }); if (fillT >= 1) { running = false; ran = true; saveR(); Book.sfx('pop', { gain: 0.5 }); paintR(); } }
        const pc = 5 * sstep(0, 0.55, fillT);
        if (pc > 0) { const b = [[X0, YB], [GX(pc), YB], [GX(pc), YB + BH], [X0, YB + BH]]; wash(x, b, 'rgba(255,205,70,.7)'); Ink.hatchFill(x, b, 1, B, 2.4); pen(x, [[GX(pc), YB], [GX(pc), YB + BH]], { w: 2.4, wob: false }); }
        S3.blit(sprR, 0, 0);
        text(x, '100%', X1, YA - 14, { size: 23, align: 'right' });
        // the student's marker
        const gx = GX(guess);
        if (!ran && !running) {
          pen(x, [[gx, YB - 8], [gx, YB + BH + 8]], { w: 3.2, color: RD, wob: false });
          x.save(); x.globalCompositeOperation = 'source-over'; x.fillStyle = PAPER; x.beginPath(); x.arc(gx, YB + BH / 2, 19, 0, 7); x.fill(); x.restore();
          Ink.stroke(x, geo.ellipse(gx, YB + BH / 2, 19, 19), { w: 3, color: RD, seed: 9 }); dot(x, gx, YB + BH / 2, 6, RD);
          if (!set) text(x, '← drag me', gx - 30, YB + BH + 46, { font: 'hand', size: 24, color: RD, align: 'right' });
          else text(x, `my prediction: ${guess}%`, clamp(gx, 190, W3 - 190), YB + BH + 50, { font: 'hand', size: 24, color: RD, align: 'center' });
        } else {
          pen(x, [[gx, YB - 8], [gx, YB + BH + 8]], { w: 2.4, color: RD, wob: false, a: 0.55 });
          text(x, `my prediction: ${guess}%`, clamp(gx, 190, W3 - 190), YB + BH + 74, { font: 'hand', size: 22, color: RD, align: 'center', a: 0.75 });
        }
        if (fillT > 0.6) { // the reveal: it stopped at about 5%
          const p = sstep(0.6, 1, fillT), bx0 = GX(5) + 6, bx1 = bx0 + (X1 - bx0) * p, by = YB + BH + 22;
          pen(x, [[bx0, by - 7], [bx0, by], [bx1, by], [bx1, by - 7]], { w: 2.4, wob: false });
          if (p >= 1) { text(x, 'about 95% of the energy saved', (bx0 + X1) / 2, by + 30, { size: 24, align: 'center' }); text(x, 'only about 5%!', GX(5) + 16, YB + 28, { font: 'hand', size: 24, color: RD }); }
        }
        return busy;
      };
      const setGuess = (p) => { if (ran || running) return; guess = Math.round(clamp((p[0] - X0) / (X1 - X0)) * 20) * 5; set = true; paintR(); };
      S3.drag((p) => !ran && !running && p[1] > YB - 34 && p[1] < YB + BH + 40 && p[0] > X0 - 30 && p[0] < X1 + 30, { start: setGuess, move: setGuess, end: () => { if (set) saveR(); } });
      function saveR() {
        const saving = 100 - guess, ok = ran ? guess <= 15 : null;
        rR.set({ answer: `predicted the recycled can needs ${guess}% of the energy (a saving of ${saving}%)` + (ran ? `; tested: it needs only about 5% (saves about 95%) ${ok ? '✓ close' : '✗ not close'}` : '; not tested yet'), correct: ok, guess, ran });
      }
      goB.onclick = () => { if (!set || ran || running) return; running = true; fillT = 0; Book.scribble(0.5); paintR(); S3.go(); };
      function paintR() {
        goB.disabled = !set || ran || running; goB.textContent = ran ? '✓ Tested' : '♻ Melt the old cans';
        rStat.innerHTML = ran ? `The bar stopped almost straight away. Recycling aluminium saves about <b class="key">95%</b> of the energy needed to make it from bauxite. You predicted it would need <b>${guess}%</b>: <b class="${guess <= 15 ? 'green' : 'red'}">${guess <= 15 ? '✓ very close' : '✗ it is far less than that'}</b>.`
          : running ? 'Melting…' : set ? `Your prediction: the recycled can needs <b>${guess}%</b> of the energy. Happy? Then press the button.` : 'Set your prediction first: drag the red marker along the lower bar.';
        tfs.classList.toggle('ma-hide', !ran);
        S3.go();
      }

      // =========================================================================================== 5. finite / recycle
      const tfs = ui.el('div', '');
      const tf1 = ui.tf({ id: 'p02.finite', label: 'T/F: metal ores are renewable', statement: 'Metal ores are a renewable resource: the Earth replaces them as fast as we mine them.', answer: false, mis: 'finite-recycle',
        explain: 'Metals are a <b>finite</b> (non-renewable) resource. Once an ore has been mined and used up, there is no more.' });
      const tf2 = ui.tf({ id: 'p02.quality', label: 'T/F: metals can be recycled again and again without losing quality', statement: 'A metal can be recycled again and again without losing its quality.', answer: true, mis: 'finite-recycle',
        explain: 'Melt a metal down and you get the same metal back, just as good as before, however many times you do it.' });
      tfs.appendChild(tf1); tfs.appendChild(tf2);
      const notesE = ui.box('Metals are a <span class="key">finite</span> (non-renewable) resource. Mining <b>scars the landscape</b> and <b>destroys habitats</b>, and extraction uses lots of energy and releases <b>CO₂</b>.<br>Metals can be <span class="key">recycled</span> again and again without losing quality. Recycling aluminium saves about <b>95%</b> of the energy. Steel is separated for recycling with <b>magnets</b>.', { tag: 'Notes: metals and the planet' });
      tfs.appendChild(notesE);
      const paintE = () => { const both = !!(got('p02.finite') && got('p02.quality')); notesE.classList.toggle('ma-hide', !both); if (both) requestAnimationFrame(() => Ink.frame(notesE)); };
      tfs.addEventListener('click', () => setTimeout(paintE, 60));

      paintF(); paintC(); paintR(); paintE(); S.go(); S2.go(); S3.go();
    },
  });
})();
