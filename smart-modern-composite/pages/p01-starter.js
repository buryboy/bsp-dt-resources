// Page 1 — Starter: the mystery objects. Predict whether a material can change by itself, then poke five unlabelled
// objects on a pen-drawn "museum of the future" table (hot tea in a mug, glasses in the sun, a bent wire in hot water,
// a bike frame on a balance, a glove in a flame). The four group names only appear in the reveal afterwards.
(function () {
  'use strict';
  const B = Ink.BLUE, RD = Ink.RED, GR = Ink.GREEN, rgba = Ink.rgba, geo = Ink.geo;
  const HANDF = (s) => `400 ${s}px "Gloria Hallelujah", "Comic Sans MS", cursive`;
  const LABF = (s) => `600 ${s}px Fredoka, "Arial Rounded MT Bold", system-ui, sans-serif`;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const close = (P) => P.concat([P[0]]);
  const arc = (cx, cy, rx, ry, a0, a1, n = 20) => { const o = []; for (let i = 0; i <= n; i++) { const a = a0 + ((a1 - a0) * i) / n; o.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); } return o; };
  const PAPER = '#fbfaf5';

  function text(x, s, px, py, o = {}) {
    x.save(); x.font = (o.font === 'hand' ? HANDF : LABF)(o.size || 22);
    x.fillStyle = rgba(o.color || B, o.a ?? 0.92); x.textAlign = o.align || 'left'; x.textBaseline = 'alphabetic';
    x.translate(px, py); if (o.rot) x.rotate(o.rot); x.fillText(s, 0, 0); x.restore();
  }
  function pen(x, pts, o = {}) {
    const P = o.wob === false ? pts : geo.wob(geo.seg(pts, 3), o.seed ?? 11, o.amp ?? 0.6);
    x.save(); x.strokeStyle = rgba(o.color || B, o.a ?? 0.85); x.lineWidth = o.w ?? 1.6; x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath();
    P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.stroke(); x.restore();
  }
  function fill(x, pts, style) { x.save(); x.fillStyle = style; x.beginPath(); pts.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.closePath(); x.fill(); x.restore(); }
  function paper(x, pts) { x.save(); x.globalCompositeOperation = 'source-over'; fill(x, pts, PAPER); x.restore(); }

  // an interactive canvas with an on-demand render loop (stops when the page is hidden)
  function Stage(parent, W, Hh, touch) {
    const c = document.createElement('canvas'); c.className = 'lab-cv'; parent.appendChild(c);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = Math.round(W * dpr); c.height = Math.round(Hh * dpr);
    Object.assign(c.style, { width: '100%', height: 'auto', aspectRatio: W + ' / ' + Hh, display: 'block', touchAction: touch || 'manipulation', userSelect: 'none', webkitUserSelect: 'none', webkitTouchCallout: 'none', cursor: 'pointer' });
    const ctx = c.getContext('2d');
    const S = { c, ctx, W, H: Hh, dpr, render: () => false };
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
    c.addEventListener('contextmenu', (e) => e.preventDefault());
    if (document.fonts) document.fonts.ready.then(() => { S.onFonts && S.onFonts(); S.go(); });
    return S;
  }

  Book.page({
    id: 'p01',
    title: 'Starter: the mystery objects',
    build(ui, root) {
      ui.h('The mystery objects');
      ui.p('Five objects sit on a table in the <b>museum of the future</b>. None of them has a battery, a plug or a switch. Your job: find out what is odd about each one.');

      const got = (id) => Book.state.items[id];
      const YES = 'Yes: some materials react on their own';
      const pred = ui.predict({ id: 'p01.predict', label: 'Starter prediction: can a material change itself without electricity?',
        q: '<b>Predict:</b> can a material <b>change itself</b> (its colour or its shape) with no electricity at all?',
        options: [YES, 'No: something must power the change', 'Only living things can change like that', 'Only if a person reshapes it by hand'], onPick: () => unlockLab() });

      ui.el('h2', '', 'Now investigate');
      const how = ui.p('<b>Tap each object</b> to test it: pour hot tea into the mug (A), <b>drag the sun slider</b> over the glasses (B), bend the wire then dip it in hot water (C), lift the bike frame on the balance (D) and hold the glove in the flame (E).');
      const lab = ui.el('div', ''); lab.style.cssText = 'position:relative;margin:0 0 10px;transition:opacity .3s';
      const lockMsg = ui.el('p', 'small red', 'Make your prediction first: then the table unlocks.'); lockMsg.style.marginTop = '-6px';
      const stat = ui.el('p', 'small', ''); stat.style.margin = '0 0 var(--R)';

      const W = 860, HH = 540, TY = 404, YO = 96;      // the top YO px of the drawing are empty, so the canvas is cropped
      const CX = [100, 262, 432, 606, 776], KEYS = ['A', 'B', 'C', 'D', 'E'];
      const SL = { x0: 200, x1: 324, y: 262 };
      const S = Stage(lab, W, HH - YO, 'pan-y'); { const p0 = S.pos; S.pos = (e) => { const q = p0(e); return [q[0], q[1] + YO]; }; }
      const r = ui.record('p01.try', { label: 'Mystery objects: tested each of the 5 objects', type: 'experiment', max: 5 });
      const done = Object.assign({ A: false, B: false, C: false, D: false, E: false }, (r.get() || {}).done || {});
      const NAMES = { A: 'mug in hot tea', B: 'glasses in the sun', C: 'bent wire in hot water', D: 'bike frame weighed', E: 'glove in the flame' };

      // live state of each object
      const A = { ph: 0, tm: 0, h: 0, tilt: 0 };
      const G = { u: 0, uT: 0, d: 0, drag: false, moved: done.B };
      const Wr = { ph: 0, tm: 0, bend: 0, off: 0 };          // 0 straight, 1 bending, 2 bent, 3 lowering, 4 springing back, 5 lifting
      const D = { up: false, L: 0 };
      const E = { ph: 0, tm: 0, off: 0 };                     // 0 out, 1 lowering, 2 in the flame, 3 lifting

      let sprStat;
      function buildArt() {
        sprStat = S.layer(W, HH, (x) => {
          // the table
          Ink.stroke(x, [[8, TY], [W - 8, TY]], { w: 3, seed: 51 }); pen(x, [[10, TY + 13], [W - 10, TY + 13]], { w: 1.5, seed: 4 });
          const ap = [[10, TY + 2], [W - 10, TY + 2], [W - 10, TY + 12], [10, TY + 12]]; Ink.hatchFill(x, ap, 1, B, 0.9);
          Ink.stroke(x, [[40, TY + 13], [36, HH - 4]], { w: 2.4, seed: 52 }); Ink.stroke(x, [[W - 40, TY + 13], [W - 36, HH - 4]], { w: 2.4, seed: 53 });
          KEYS.forEach((k, i) => Ink.drawBubble(x, k, CX[i], 474, 40, B, 1, -0.02, 'center'));
          // B: the book the glasses rest on + the slider track
          const bk = geo.rect(206, 380, 112, 24, 4); Ink.hatchFill(x, bk, 1, B, 0.6); Ink.stroke(x, bk, { w: 2.2, seed: 21 });
          pen(x, [[214, 386], [310, 386]], { w: 1.1, a: 0.6 });
          Ink.stroke(x, [[SL.x0, SL.y], [SL.x1, SL.y]], { w: 3, seed: 22 });
          for (let i = 0; i <= 4; i++) { const tx = SL.x0 + ((SL.x1 - SL.x0) * i) / 4; pen(x, [[tx, SL.y - 7], [tx, SL.y + 7]], { w: 1.5, wob: false, a: 0.7 }); }
          text(x, 'indoors', 184, 304, { size: 22 }); text(x, 'sunny', 340, 304, { size: 22, align: 'right' });
          // C: beaker of hot water + the stand post
          const bkr = [[400, 290], [400, 396], [407, 403], [457, 403], [464, 396], [464, 290]];
          Ink.stroke(x, bkr, { w: 2.4, seed: 31 }); pen(x, [[394, 288], [400, 290]], { w: 2 }); pen(x, [[464, 290], [470, 288]], { w: 2 });
          pen(x, [[402, 308], [462, 308]], { w: 1.4, seed: 6 });
          const wat = [[402, 310], [462, 310], [462, 396], [456, 401], [408, 401], [402, 396]]; Ink.hatchFill(x, wat, 1, B, 0.45);
          [[440, 330], [448, 352], [442, 376]].forEach(([a, b], i) => Ink.stroke(x, geo.ellipse(a + 8, b, 3, 3), { w: 1.2, seed: 60 + i, retrace: false }));
          Ink.stroke(x, [[496, 120], [496, TY]], { w: 3, seed: 32 }); Ink.stroke(x, [[478, TY], [514, TY]], { w: 4, seed: 33 });
          // D: the gallows the balance hangs from
          Ink.stroke(x, [[676, TY], [676, 120], [586, 120]], { w: 3, seed: 41 }); pen(x, [[676, 150], [646, 120]], { w: 2 });
          Ink.stroke(x, [[658, TY], [692, TY]], { w: 4, seed: 42 });
          // E: the burner
          const base = [[748, TY], [752, 390], [800, 390], [804, TY]]; Ink.hatchFill(x, base, 1, B, 1.4); Ink.stroke(x, close(base), { w: 2.2, seed: 45 });
          const tube = [[768, 390], [768, 342], [784, 342], [784, 390]]; Ink.stroke(x, tube, { w: 2.2, seed: 46 }); pen(x, [[764, 372], [788, 372]], { w: 2.4 });
          pen(x, [[804, 398], [840, 398], [846, TY]], { w: 2.4, seed: 8 });
        });
      }
      buildArt(); S.onFonts = buildArt;

      // ---- the five objects (drawn live) ----
      function drawMug(x, t) {
        const h = A.h;
        // teapot (tilts to pour)
        x.save(); x.translate(50, 232); x.rotate(A.tilt * 0.6); x.translate(-50, -232);
        const pot = geo.ellipse(50, 236, 34, 26); paper(x, pot); Ink.hatchShadow(x, pot, 1, 5, 5); Ink.stroke(x, pot, { w: 2.4, seed: 3 });
        Ink.stroke(x, [[26, 214], [74, 214]], { w: 2, seed: 4, retrace: false }); Ink.stroke(x, geo.ellipse(50, 207, 6, 5), { w: 1.8, seed: 5, retrace: false });
        Ink.stroke(x, [[80, 240], [92, 226], [104, 206], [96, 204], [82, 222]], { w: 2.2, seed: 6 });
        Ink.stroke(x, arc(18, 234, 13, 16, Math.PI * 0.45, Math.PI * 1.55, 12), { w: 2.4, seed: 7 });
        x.restore();
        if (A.ph === 1 && A.tm > 0.3) { const sx = 109, wv = Math.sin(t * 30) * 1.2; pen(x, [[sx, 243], [sx - 2 + wv, 280], [sx - 3, 324]], { w: 4, a: 0.7, seed: 2 }); pen(x, [[sx + 4, 246], [sx + 1 - wv, 290], [sx, 324]], { w: 2, a: 0.5, seed: 3 }); }
        // the mug: a dark coat when cold, a warm colour and a hidden picture when hot
        const mug = [[72, 322], [136, 322], [132, TY - 1], [76, TY - 1]];
        if (h > 0.02) fill(x, mug, `rgba(255,120,40,${0.6 * h})`);
        if (h < 0.98) { x.save(); x.globalAlpha = 1 - h; Ink.hatchFill(x, mug, 1, B, 2.2); Ink.hatchFill(x, mug.map(([a, b]) => [a + 0.5, b + 1]), 1, B, 1.4); x.restore(); }
        Ink.stroke(x, close(mug), { w: 2.6, seed: 8 });
        Ink.stroke(x, arc(136, 360, 20, 24, -Math.PI * 0.42, Math.PI * 0.42, 14), { w: 2.6, seed: 9 }); pen(x, arc(136, 360, 12, 15, -Math.PI * 0.4, Math.PI * 0.4, 10), { w: 1.4 });
        if (h > 0.25) { // the hidden picture: a smiling sun
          const a = clamp((h - 0.25) / 0.5);
          pen(x, geo.ellipse(104, 362, 13, 13), { w: 2.4, color: RD, a, wob: false });
          for (let i = 0; i < 8; i++) { const an = (i / 8) * 6.283; pen(x, [[104 + Math.cos(an) * 17, 362 + Math.sin(an) * 17], [104 + Math.cos(an) * 23, 362 + Math.sin(an) * 23]], { w: 2, color: RD, a, wob: false }); }
          pen(x, arc(104, 363, 7, 6, 0.3, Math.PI - 0.3, 8), { w: 1.8, color: RD, a, wob: false });
        }
        if (h > 0.3) for (let i = 0; i < 3; i++) { const sx = 88 + i * 16, ph = t * 2.4 + i * 1.9; pen(x, [0, 1, 2, 3, 4].map((j) => [sx + Math.sin(ph + j * 1.3) * 5, 314 - j * 9]), { w: 1.8, a: 0.5 * h, wob: false }); }
      }
      function drawGlasses(x, t) {
        const u = G.u, d = G.d;
        // the sun (grows with the slider)
        if (u > 0.03) { x.save(); x.fillStyle = `rgba(255,214,40,${0.85 * u})`; x.beginPath(); x.arc(262, 186, 22, 0, 7); x.fill(); x.restore(); }
        pen(x, geo.ellipse(262, 186, 22, 22), { w: 2.2, a: 0.25 + 0.7 * u, wob: false });
        for (let i = 0; i < 10; i++) { const an = (i / 10) * 6.283 + t * 0.15 * u, r1 = 28 + 16 * u * (i % 2 ? 0.7 : 1); if (u > 0.08) pen(x, [[262 + Math.cos(an) * 28, 186 + Math.sin(an) * 28], [262 + Math.cos(an) * r1, 186 + Math.sin(an) * r1]], { w: 2.2, a: u, wob: false }); }
        // lenses
        [[212, 342], [268, 342]].forEach(([lx, ly], i) => {
          const L = geo.rect(lx, ly, 44, 36, 12);
          if (d > 0.02) { fill(x, L, `rgba(24,34,100,${0.8 * d})`); }
          Ink.stroke(x, L, { w: 2.6, seed: 12 + i });
          if (d < 0.6) pen(x, [[lx + 9, ly + 22], [lx + 19, ly + 9]], { w: 1.3, a: 0.5 * (1 - d), wob: false });
        });
        pen(x, arc(262, 356, 6, 7, Math.PI, Math.PI * 2, 8), { w: 2.6 });
        Ink.stroke(x, [[212, 352], [200, 344], [196, 368]], { w: 2.2, seed: 15, retrace: false }); Ink.stroke(x, [[312, 352], [324, 344], [328, 368]], { w: 2.2, seed: 16, retrace: false });
        // slider knob
        const kx = lerp(SL.x0, SL.x1, u);
        x.save(); x.globalCompositeOperation = 'source-over'; x.fillStyle = PAPER; x.beginPath(); x.arc(kx, SL.y, 19, 0, 7); x.fill(); x.restore();
        Ink.stroke(x, geo.ellipse(kx, SL.y, 19, 19), { w: 3, color: RD, seed: 9 }); x.fillStyle = rgba(RD, 0.9); x.beginPath(); x.arc(kx, SL.y, 6, 0, 7); x.fill();
      }
      function drawWire(x, t) {
        const off = Wr.off, b = Wr.bend, top = 156 + off, L = 120;
        // the sliding arm and clip
        Ink.stroke(x, [[496, 150 + off], [432, 150 + off]], { w: 3, seed: 34 });
        const cl = geo.rect(424, 142 + off, 16, 16, 3); paper(x, cl); Ink.stroke(x, cl, { w: 2, seed: 35, retrace: false });
        const sl = geo.rect(488, 141 + off, 16, 18, 3); paper(x, sl); Ink.stroke(x, sl, { w: 2, seed: 36, retrace: false });
        // the wire: straight, or bent into a squiggle
        const P = []; for (let i = 0; i <= 40; i++) { const s = i / 40; P.push([432 + b * 24 * Math.sin(s * Math.PI * 3.5) * Math.sin(Math.min(1, s * 4) * 1.57), top + s * L * (1 - 0.18 * b)]); }
        const wig = Wr.ph === 4 ? Math.sin(t * 40) * 2.5 * b : 0;
        pen(x, P.map(([a, c]) => [a + wig, c]), { w: 3.4, a: 0.95, wob: false }); pen(x, P.map(([a, c]) => [a + wig + 1.2, c]), { w: 1.2, a: 0.5, wob: false });
        // steam off the hot water
        for (let i = 0; i < 2; i++) { const sx = 412 + i * 40, ph = t * 2.2 + i * 2.3; pen(x, [0, 1, 2, 3].map((j) => [sx + Math.sin(ph + j * 1.3) * 5, 282 - j * 9]), { w: 1.8, a: 0.45, wob: false }); }
      }
      function drawBike(x) {
        const y0 = 244 - 46 * D.L, hx = 596, hy = y0 + 78;
        pen(x, [[hx, 120], [hx, y0]], { w: 2, wob: false });
        const bal = geo.rect(hx - 14, y0, 28, 64, 5); paper(x, bal); Ink.stroke(x, bal, { w: 2.2, seed: 43 });
        for (let i = 0; i < 6; i++) pen(x, [[hx - 8, y0 + 12 + i * 8], [hx - (i % 2 ? 3 : 0), y0 + 12 + i * 8]], { w: 1.2, wob: false });
        const py = y0 + 13 + 5 * clamp((D.L - 0.15) / 0.5); pen(x, [[hx + 2, py], [hx + 11, py]], { w: 3, color: RD, wob: false });
        pen(x, [[hx, y0 + 64], [hx, hy - 4]].concat(arc(hx, hy + 2, 6, 6, -Math.PI / 2, Math.PI * 0.9, 8)), { w: 2.2, wob: false });
        // the diamond frame: black woven tubes
        const Sx = [hx - 34, hy + 6], H1 = [hx + 40, hy + 2], H2 = [hx + 45, hy + 24], BB = [hx - 14, hy + 72], R = [hx - 66, hy + 66], F = [hx + 62, hy + 76];
        const tube = (p, q, w, sd) => { Ink.stroke(x, [p, q], { w, seed: sd }); pen(x, [[p[0] + 1, p[1] + 2.5], [q[0] + 1, q[1] + 2.5]], { w: 1.6, a: 0.8, seed: sd }); };
        tube(Sx, H1, 4.2, 71); tube(H2, BB, 4.6, 72); tube([hx - 37, hy - 8], BB, 4.2, 73); tube(Sx, R, 3, 74); tube(BB, R, 3, 75); tube(H1, H2, 5, 76); tube(H2, F, 3, 77);
        Ink.stroke(x, geo.ellipse(BB[0], BB[1], 6, 6), { w: 2, seed: 78, retrace: false }); pen(x, [[hx - 44, hy - 9], [hx - 30, hy - 9]], { w: 3 });
        if (D.L > 0.9) text(x, '0.9 kg', 586, TY - 12, { size: 26, color: RD, align: 'center' });
      }
      function glovePts(gx, gy) {
        const P = [[gx - 24, gy], [gx + 24, gy], [gx + 26, gy + 20], [gx + 29, gy + 56]], tips = [84, 96, 92, 80];
        for (let i = 0; i < 4; i++) { const x1 = gx + 29 - i * 14.5, x0 = x1 - 14.5, ty = gy + tips[i] - 7; P.push([x1, ty], ...arc((x0 + x1) / 2, ty, 7.25, 7.25, 0, Math.PI, 6), [x0, gy + 60]); }
        P.push([gx - 29, gy + 50], [gx - 42, gy + 66], ...arc(gx - 47, gy + 62, 6, 6, 0.8, 3.9, 6), [gx - 34, gy + 34], [gx - 26, gy + 20]);
        return P;
      }
      function drawGlove(x, t) {
        const gx = 776, gy = 150 + E.off, inF = E.ph === 2;
        // flame (bigger and wrapping round the glove while it is held in)
        const fh = (inF ? 74 : 44) + Math.sin(t * 17) * 4 + Math.sin(t * 29) * 3, fw = inF ? 30 : 13, sway = Math.sin(t * 9) * 3;
        const fl = geo.curve([776 - fw, 342], [776 - fw - 4, 342 - fh * 0.5], [776 + sway - 4, 342 - fh * 0.7], [776 + sway, 342 - fh], 12).concat(geo.curve([776 + sway, 342 - fh], [776 + sway + 5, 342 - fh * 0.7], [776 + fw + 4, 342 - fh * 0.5], [776 + fw, 342], 12));
        fill(x, fl, 'rgba(255,170,30,.55)'); pen(x, close(fl), { w: 2.4, color: RD, wob: false });
        pen(x, geo.curve([770, 342], [768, 326], [776, 318], [776 + sway * 0.5, 308], 8).concat(geo.curve([776 + sway * 0.5, 308], [778, 318], [784, 326], [782, 342], 8)), { w: 1.6, wob: false, a: 0.7 });
        // tongs and glove
        pen(x, [[850, gy - 34], [800, gy + 6]], { w: 3.4, wob: false }); pen(x, [[850, gy - 22], [802, gy + 14]], { w: 2, wob: false });
        const P = glovePts(gx, gy); paper(x, P); Ink.hatchFill(x, P.slice(0, 3).concat([[gx - 26, gy + 20], [gx - 24, gy]]), 1, B, 1.5);
        Ink.stroke(x, close(P), { w: 2.6, seed: 81 }); pen(x, [[gx - 26, gy + 20], [gx + 26, gy + 20]], { w: 1.6, seed: 5 });
        pen(x, [[gx - 14, gy + 30], [gx + 16, gy + 30]], { w: 1.1, a: 0.5 }); pen(x, [[gx - 12, gy + 40], [gx + 18, gy + 40]], { w: 1.1, a: 0.5 });
        if (inF) { // flames licking in front of the fingers
          [-22, -6, 12, 24].forEach((dx, i) => { const hh = 26 + Math.sin(t * 15 + i * 2) * 8; pen(x, geo.curve([gx + dx - 6, 342], [gx + dx - 8, 342 - hh * 0.6], [gx + dx, 342 - hh * 0.8], [gx + dx + Math.sin(t * 11 + i) * 3, 342 - hh], 8), { w: 2, color: RD, wob: false, a: 0.85 }); });
          text(x, Math.min(3, Math.floor(E.tm) + 1) + ' s', 712, 250, { size: 28, color: RD });
        }
      }

      const HINTS = () => ['pour tea', 'slide the sun', Wr.ph >= 2 ? 'dip it' : 'bend it', 'lift it', 'flame it'];
      S.render = (dt, t) => {
        const x = S.ctx; let busy = false; x.translate(0, -YO);
        // --- A: tea pours, the mug warms, then cools
        if (A.ph === 1) { A.tm += dt; A.tilt = clamp(A.tm / 0.3); A.h = clamp((A.tm - 0.4) / 0.9); if (A.tm > 1.5) { A.ph = 2; A.tm = 0; } }
        else if (A.ph === 2) { A.tm += dt; A.tilt = clamp(1 - A.tm / 0.3); if (A.tm > 2.4) { A.ph = 3; A.tm = 0; } }
        else if (A.ph === 3) { A.h = Math.max(0, A.h - dt / 2.6); if (A.h <= 0) { A.ph = 0; mark('A'); } }
        if (A.ph) busy = true;
        // --- B: lenses follow the sun with a lag
        if (!G.drag && Math.abs(G.uT - G.u) > 0.004) { G.u += clamp(G.uT - G.u, -dt * 1.6, dt * 1.6); busy = true; }
        const dT = clamp((G.u - 0.15) / 0.6); if (Math.abs(dT - G.d) > 0.004) { G.d += clamp(dT - G.d, -dt * 0.7, dt * 1.3); busy = true; }
        if (G.d > 0.8) mark('B'); if (G.u > 0.05) busy = true;
        // --- C: bend, dip, spring back
        if (Wr.ph === 1) { Wr.bend = Math.min(1, Wr.bend + dt / 0.35); if (Wr.bend >= 1) Wr.ph = 2; }
        else if (Wr.ph === 3) { Wr.off = Math.min(110, Wr.off + dt * 190); if (Wr.off >= 110) { Wr.ph = 4; Wr.tm = 0; Book.sfx('pop', { gain: 0.4 }); } }
        else if (Wr.ph === 4) { Wr.tm += dt; Wr.bend = Math.max(0, 1 - Wr.tm / 0.7); if (Wr.tm > 1.3) Wr.ph = 5; }
        else if (Wr.ph === 5) { Wr.off = Math.max(0, Wr.off - dt * 190); if (Wr.off <= 0) { Wr.ph = 0; mark('C'); } }
        busy = true; // steam always drifts
        // --- D: lift
        const LT = D.up ? 1 : 0; if (Math.abs(LT - D.L) > 0.004) { D.L += clamp(LT - D.L, -dt * 1.8, dt * 1.8); if (D.L > 0.97 && D.up) mark('D'); }
        // --- E: glove into the flame for 3 s
        if (E.ph === 1) { E.off = Math.min(84, E.off + dt * 150); if (E.off >= 84) { E.ph = 2; E.tm = 0; } }
        else if (E.ph === 2) { E.tm += dt; if (E.tm >= 3) E.ph = 3; }
        else if (E.ph === 3) { E.off = Math.max(0, E.off - dt * 150); if (E.off <= 0) { E.ph = 0; mark('E'); } }

        drawMug(x, t); drawGlasses(x, t); drawWire(x, t); S.blit(sprStat, 0, 0); drawBike(x); drawGlove(x, t);
        // ticks and hints
        const hints = HINTS();
        KEYS.forEach((k, i) => {
          if (done[k]) Ink.tick(x, CX[i] + 26, 468, 0.9);
          else text(x, hints[i], CX[i], 522, { font: 'hand', size: 22, color: RD, align: 'center' });
        });
        return busy;
      };

      const LINES = {
        A: 'Hot tea went in and the mug <b>changed colour</b>. As it cooled, it <b>changed back</b>.',
        B: 'In the sun the lenses <b>went dark by themselves</b>. Slide back indoors and they clear again.',
        C: 'You bent the wire out of shape. In hot water it <b>sprang back</b> to how it started.',
        D: 'The whole bike frame weighs about <b>0.9 kg</b>, less than a bag of sugar, yet it is strong enough to race on.',
        E: 'Three seconds in the flame: the glove did <b>not</b> catch fire, melt or drip.',
      };
      function mark(k) {
        if (done[k]) return; done[k] = true; Book.sfx('success', { gain: 0.25 });
        const n = KEYS.filter((q) => done[q]).length;
        r.set({ answer: `tested ${n}/5: ` + KEYS.map((q) => NAMES[q] + (done[q] ? ' ✓' : ' ✗')).join(', '), correct: n === 5 ? true : null, score: n, max: 5, done: Object.assign({}, done) });
        pred.querySelectorAll('.opt').forEach((b) => (b.disabled = true)); // no changing the prediction after testing
        status(k);
      }

      // pointer: the sun slider drags; everything else is a tap
      const setU = (px) => { G.u = G.uT = clamp((px - SL.x0) / (SL.x1 - SL.x0)); G.moved = true; };
      const onSlider = (px, py) => px > 176 && px < 348 && py > 222 && py < 310;
      S.c.addEventListener('pointerdown', (e) => { const [px, py] = S.pos(e); if (onSlider(px, py)) { G.drag = true; try { S.c.setPointerCapture(e.pointerId); } catch (er) {} setU(px); e.preventDefault(); S.go(); } });
      S.c.addEventListener('pointermove', (e) => { if (G.drag) { setU(S.pos(e)[0]); S.go(); } });
      ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((ev) => S.c.addEventListener(ev, () => { G.drag = false; S.go(); }));
      S.c.addEventListener('click', (e) => {
        const [px, py] = S.pos(e); if (onSlider(px, py)) return;
        if (px < 180) { if (A.ph === 0) { A.ph = 1; A.tm = 0; Book.sfx('whoosh', { gain: 0.3 }); } }
        else if (px < 348) { G.uT = G.u > 0.5 ? 0 : 1; Book.sfx('tick', { gain: 0.4 }); }
        else if (px < 518) { if (Wr.ph === 0) { Wr.ph = 1; Book.sfx('tick', { gain: 0.5 }); } else if (Wr.ph === 2) { Wr.ph = 3; Book.sfx('tick', { gain: 0.5 }); } }
        else if (px < 692) { D.up = !D.up; Book.sfx('click', { gain: 0.4 }); }
        else if (E.ph === 0) { E.ph = 1; Book.sfx('whoosh', { gain: 0.3 }); }
        S.go();
      });

      // ------------------------------------------------------------------ after the experiment
      const rest = ui.el('div', '');
      const add = (e) => { rest.appendChild(e); return e; };
      add(ui.el('h2', '', 'What you found'));
      const found = add(ui.box('', { tag: 'What you found' }));
      add(ui.el('h2', '', 'Four groups of new materials'));
      add(ui.box(`Designers sort new materials like these into four groups:
        <p style="margin:6px 0 0"><span class="key">Smart materials</span>: the mug (A), the glasses (B) and the wire (C).</p>
        <p style="margin:0"><span class="key">Composite materials</span>: the bike frame (D). Two or more different materials <b>combined</b> to make a new one with improved properties.</p>
        <p style="margin:0"><span class="key">Technical textiles</span>: the glove (E). Textiles engineered for <b>performance</b>, not for how they look.</p>
        <p style="margin:0"><span class="key">Modern materials</span>: made possible by <b>new or improved processes</b>. None on this table: you meet three on the next page.</p>`, { tag: 'The big idea' }));
      add(ui.mcq({ id: 'p01.check', label: 'What the three smart objects had in common', q: 'Think about what the mug, the glasses and the wire did. What do those three <b>smart</b> objects have in common?',
        options: [
          { t: 'They respond by themselves to heat or light around them', ok: true, why: 'Yes: no battery, no chip, no switch. The material itself reacted.' },
          { t: 'They respond when a hidden battery switches them on', mis: 'smart-meaning', why: 'Nothing on the table was powered. The mug only needed hot tea, the lenses only needed sunlight and the wire only needed hot water.' },
          { t: 'They contain a tiny computer chip that controls them', mis: 'smart-meaning', why: '"Smart" does not mean electronic here. There is no chip: the material itself reacted to the tea, the sunlight and the hot water.' },
          { t: 'They are far stronger and lighter than steel would be', mis: 'smart-meaning', why: 'That sounds more like the bike frame. Being strong or light does not make a material smart. What did A, B and C each react to?' },
        ],
        explain: 'A <b>smart material</b> changes one of its properties when something in its <b>surroundings</b> changes (a <b>stimulus</b> such as temperature or light). It needs no electrical control, and the change is <b>reversible</b>.' }));
      add(ui.rate({ id: 'p01.conf', label: 'Confidence: the four groups of new materials', q: 'How confident are you that you could say which of the four groups a new material belongs to?' }));

      function status() {
        const n = KEYS.filter((k) => done[k]).length, all = n === 5;
        stat.innerHTML = KEYS.map((k) => `<b>${done[k] ? '☑' : '☐'}</b> ${k}`).join(' &nbsp; ') + (all ? '' : ' &nbsp; Test all five to carry on.')
          + KEYS.filter((k) => done[k]).map((k) => `<br><b>${k}:</b> ${LINES[k]}`).join('');
        rest.style.display = all ? '' : 'none';
        if (!all) return;
        const p = (got('p01.predict') || {}).answer, ok = p === YES;
        found.innerHTML = '<span class="tag">What you found</span>Nothing here had a battery, a plug or a switch. Yet the mug and the lenses <b>changed colour</b> by themselves and then changed back, and the bent wire <b>straightened itself</b>. The frame was amazingly light and the glove shrugged off a flame.'
          + (p ? `<br>You predicted “${Book.esc(p.toLowerCase())}”: <b class="${ok ? 'green' : 'red'}">${ok ? '✓ spot on' : '✗ the table says otherwise'}</b>.` : '');
        requestAnimationFrame(() => Ink.frame(found));
      }
      function unlockLab() {
        const on = !!got('p01.predict');
        lab.style.opacity = on ? 1 : 0.35; lab.style.pointerEvents = on ? '' : 'none';
        lockMsg.style.display = on ? 'none' : ''; how.style.opacity = on ? 1 : 0.5;
        if (r.get()) pred.querySelectorAll('.opt').forEach((b) => (b.disabled = true));
      }
      unlockLab(); status(); S.go();
    },
  });
})();
