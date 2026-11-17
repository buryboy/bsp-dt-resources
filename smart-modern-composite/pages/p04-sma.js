// Page 4 — Shape memory alloys. The nitinol lab: (1) bend a wire with a finger, warm it with a hairdryer and watch
// it spring back; (2) "program" a new remembered shape; (3) sit on two pairs of glasses; (4) an SMA wire actuator
// lifting a weight. Predict → test → conclude each time; the notes for a bench only appear once it is finished.
(function () {
  'use strict';
  const B = Ink.BLUE, RD = Ink.RED, GR = Ink.GREEN, rgba = Ink.rgba, geo = Ink.geo;
  const LABF = (s) => `600 ${s}px ${Ink.FONTS.bubble}, sans-serif`;
  const HANDF = (s) => `400 ${s}px ${Ink.FONTS.hand}`;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = (t) => { t = clamp(t); return t * t * (3 - 2 * t); };
  const wrap = (a) => { while (a > Math.PI) a -= Math.PI * 2; while (a < -Math.PI) a += Math.PI * 2; return a; };
  const mix = (c0, c1, t) => [lerp(c0[0], c1[0], t), lerp(c0[1], c1[1], t), lerp(c0[2], c1[2], t)];
  const PAPER = 'rgba(251,250,245,.97)';
  const W = 860;

  if (!document.getElementById('sma-css')) {
    const s = document.createElement('style'); s.id = 'sma-css';
    s.textContent = `
      .sma-lab { position: relative; margin: 0 0 calc(var(--R) * .6); padding: 12px 16px 16px; background: rgba(251,250,245,.9); }
      .sma-lab > * { position: relative; }
      .sma-step { font: 700 14px Fredoka, system-ui; letter-spacing: .08em; text-transform: uppercase; color: var(--red); line-height: 22px; }
      .sma-task { font-size: 19px; line-height: 1.5; margin: 0 0 8px; }
      .sma-task b, .sma-q b { font-family: Fredoka, system-ui; font-weight: 600; }
      .sma-q { font-size: 19px; line-height: 1.5; margin: 6px 0 8px; }
      .sma-btns { display: flex; flex-wrap: wrap; gap: 10px; align-items: stretch; margin: 0 0 8px; }
      .sma-btns .opt { flex: 1 1 170px; text-align: center; min-height: 52px; }
      .sma-btns .btn { margin-top: 0; min-height: 52px; }
      .sma-hold { touch-action: none; user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; min-width: 240px; font-size: 20px; }
      .sma-hold.down { transform: translateY(3px); box-shadow: none; background: var(--red); }
      .sma-cv { display: block; width: 100%; height: auto; touch-action: pan-y; user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; cursor: pointer; }
      .sma-conc { display: none; margin-top: 6px; padding-top: 6px; border-top: 2px dashed rgba(30,46,150,.3); }
      .sma-conc.on { display: block; }
      .sma-locked { font-size: 17px; opacity: .75; }
      .sma-notes p { margin: 0 0 6px; }
      .sma-notes ul { margin: 4px 0 0; padding-left: 22px; }
      .sma-notes li { margin: 0; }
    `;
    document.head.appendChild(s);
  }

  // ---------- small drawing helpers ----------
  function text(x, s, px, py, o = {}) {
    x.save(); x.font = (o.font === 'hand' ? HANDF : LABF)(o.size || 22);
    x.fillStyle = rgba(o.color || B, o.a ?? 0.92); x.textAlign = o.align || 'left'; x.textBaseline = 'alphabetic';
    x.translate(px, py); if (o.rot) x.rotate(o.rot); if (o.max) x.fillText(s, 0, 0, o.max); else x.fillText(s, 0, 0); x.restore();
  }
  function paper(x, pts, style = PAPER) { x.save(); x.globalCompositeOperation = 'source-over'; x.fillStyle = style; x.beginPath(); pts.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.closePath(); x.fill(); x.restore(); }
  const shift = (P, dx, dy) => P.map(([a, b]) => [a + dx, b + dy]);
  const rotP = (P, cx, cy, an) => { const c = Math.cos(an), s = Math.sin(an); return P.map(([a, b]) => [cx + (a - cx) * c - (b - cy) * s, cy + (a - cx) * s + (b - cy) * c]); };
  const wavy = (x0, y0, x1, y1, amp, n, ph) => { const P = [], d = Math.hypot(x1 - x0, y1 - y0) || 1, nx = -(y1 - y0) / d, ny = (x1 - x0) / d; for (let i = 0; i <= 24; i++) { const t = i / 24, o = Math.sin(t * n * Math.PI * 2 + ph) * amp * Math.sin(t * Math.PI); P.push([lerp(x0, x1, t) + nx * o, lerp(y0, y1, t) + ny * o]); } return P; };

  // a canvas with a cached static layer and a render loop that only runs while something moves
  function Stage(parent, H) {
    const c = document.createElement('canvas'); c.className = 'sma-cv'; parent.appendChild(c);
    const dpr = Math.min(2, window.devicePixelRatio || 1); c.width = W * dpr; c.height = H * dpr; c.style.aspectRatio = W + ' / ' + H;
    const ctx = c.getContext('2d'), S = { c, ctx, H, time: 0 };
    let layer = null, raf = 0, last = 0;
    S.repaint = () => { layer = document.createElement('canvas'); layer.width = W * dpr; layer.height = H * dpr; const x = layer.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.lineCap = x.lineJoin = 'round'; if (S.paint) S.paint(x); S.draw(); };
    S.draw = () => { ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H); ctx.globalCompositeOperation = 'multiply'; ctx.lineCap = ctx.lineJoin = 'round'; if (layer) ctx.drawImage(layer, 0, 0, W, H); if (S.render) S.render(ctx, S.time); };
    const hidden = () => { const p = c.closest('.page'); return !p || p.classList.contains('hidden'); };
    function frame(now) { raf = 0; if (hidden()) return; const dt = Math.min(0.05, (now - last) / 1000 || 0.016); last = now; S.time += dt; const more = S.step ? S.step(dt) : false; S.draw(); if (more) raf = requestAnimationFrame(frame); }
    S.go = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } };
    S.pos = (e) => { const r = c.getBoundingClientRect(); return [((e.clientX - r.left) * W) / r.width, ((e.clientY - r.top) * H) / r.height]; };
    S.start = () => { S.repaint(); if (document.fonts && document.fonts.ready) document.fonts.ready.then(S.repaint); };
    // drags: hit(x, y) says if a finger landing there starts a drag (so the page does not scroll)
    S.drag = (hit, down, move, up) => {
      let on = false;
      c.addEventListener('touchstart', (e) => { const [x, y] = S.pos(e.changedTouches[0]); if (hit(x, y)) e.preventDefault(); }, { passive: false });
      c.addEventListener('pointerdown', (e) => { const [x, y] = S.pos(e); if (!hit(x, y)) { down(x, y, false); return; } on = true; try { c.setPointerCapture(e.pointerId); } catch (er) {} down(x, y, true); e.preventDefault(); S.go(); });
      c.addEventListener('pointermove', (e) => { if (!on) return; const [x, y] = S.pos(e); move(x, y); S.go(); });
      const end = () => { if (!on) return; on = false; up(); S.go(); };
      c.addEventListener('pointerup', end); c.addEventListener('pointercancel', end); c.addEventListener('lostpointercapture', end);
    };
    return S;
  }

  // a lab shell: step title, task, optional prediction row, canvas area, conclusion question, locked notes box
  function Shell(ui, o) {
    const el = ui.el;
    const lab = el('div', 'sma-lab'); requestAnimationFrame(() => Ink.frame(lab, { shadow: false, w: 2.2 }));
    el('div', 'sma-step', o.step, lab);
    el('p', 'sma-task', o.task, lab);
    let predRow = null;
    if (o.predQ) { el('div', 'sma-q', `<b>Predict first.</b> ${o.predQ}`, lab); predRow = el('div', 'sma-btns', '', lab); }
    const body = el('div', '', '', lab);
    const conc = el('div', 'sma-conc', `<div class="sma-q"><b>What did you find?</b> ${o.concQ}</div>`, lab), concRow = el('div', 'sma-btns', '', conc), fb = el('div', 'fb', '', conc);
    const notes = ui.box(`<div class="sma-notes"><p class="sma-locked">🔒 The notes for this bench appear here when you have finished it.</p></div>`, { tag: 'Notes' });
    const sh = { lab, body, predRow, conc, notes, pred: null, done: false };
    sh.predict = (opts, cur, onPick, locked) => {
      sh.pred = cur || null;
      const bs = opts.map((t) => { const b = el('button', 'opt', t, predRow); b.type = 'button'; if (cur === t) b.classList.add('sel');
        b.onclick = () => { if (locked()) return; bs.forEach((q) => q.classList.remove('sel')); b.classList.add('sel'); sh.pred = t; Book.scribble(0.12); onPick(t); }; return b; });
      sh.lockPred = () => bs.forEach((b) => (b.disabled = true));
    };
    // conclusion: opts = [{t, ok, why, mis}], onAnswer(opt) records; correct answer unlocks the notes
    sh.conclude = (opts, seed, onAnswer, rightMsg) => {
      const order = Book.shuffle(opts, seed);
      const bs = order.map((op) => { const b = el('button', 'opt', Book.esc(op.t), concRow); b.type = 'button'; b._op = op;
        b.onclick = () => {
          b.classList.add(op.ok ? 'right' : 'wrong'); onAnswer(op);
          if (op.ok) { bs.forEach((q) => (q.disabled = true)); fb.className = 'fb on good'; fb.innerHTML = '✓ ' + rightMsg() + ' The notes are unlocked below.'; sh.finish(); }
          else { Book.sfx('error', { gain: 0.3 }); fb.className = 'fb on bad'; fb.innerHTML = '✗ ' + op.why; }
        }; return b; });
      sh.showConc = (quiet) => { if (!conc.classList.contains('on')) { conc.classList.add('on'); if (!quiet) Book.sfx('paper', { gain: 0.4 }); } };
      sh.restoreDone = () => { conc.classList.add('on'); bs.forEach((q) => { q.disabled = true; if (q._op.ok) q.classList.add('right'); }); fb.className = 'fb on good'; fb.innerHTML = '✓ ' + rightMsg(); sh.finish(true); };
    };
    sh.finish = (quiet) => { sh.done = true; if (sh.lockPred) sh.lockPred(); notes.querySelector('.sma-notes').innerHTML = o.notes; if (!quiet) Book.sfx('success', { gain: 0.35 }); if (sh.onDone) sh.onDone(); };
    return sh;
  }

  // ======================================================================================
  // the wire rig: a clamped nitinol wire you bend with a finger + a hairdryer you drag over it
  // ======================================================================================
  const RH = 340, BENCH = 300, AX = 150, AY = 170, NSEG = 26, SEG = 15, ZR = 88;
  function Rig(parent, opt) {
    const S = Stage(parent, RH);
    const R = { S, live: false, dryerOK: true, a: new Array(NSEG).fill(0), m: new Array(NSEG).fill(0), v: new Array(NSEG).fill(0), T: 0, hx: 730, hy: 150, on: false, grab: -1, rec: false, wasBent: false, bake: 0, pins: null, msg: '', msgC: B, ghost: false };
    const pts = (ang) => { const P = [[AX, AY]]; for (let i = 0; i < NSEG; i++) P.push([P[i][0] + Math.cos(ang[i]) * SEG, P[i][1] + Math.sin(ang[i]) * SEG]); return P; };
    R.pts = () => pts(R.a);
    R.bend = () => { const P = pts(R.a), Q = pts(R.m); let d = 0; for (let i = 0; i <= NSEG; i++) d = Math.max(d, Math.hypot(P[i][0] - Q[i][0], P[i][1] - Q[i][1])); return d; };
    R.isBent = () => R.bend() > 85;
    const inside = (P) => P.every(([x, y]) => x > 24 && x < W - 24 && y > 22 && y < BENCH - 8);

    S.paint = (x) => {
      Ink.stroke(x, [[20, BENCH], [W - 20, BENCH]], { w: 2.6, seed: 3 });
      // clamp stand: base, post, boss and jaws gripping the wire
      const base = geo.rect(34, BENCH - 16, 132, 16, 4); Ink.hatchShadow(x, base, 1, 7, 6); paper(x, base); Ink.hatchFill(x, base, 0.9, B, 1.4); Ink.stroke(x, base, { w: 2.8, seed: 7 });
      const post = geo.rect(64, 64, 14, BENCH - 80, 4); paper(x, post); Ink.stroke(x, post, { w: 2.6, seed: 9 });
      const boss = geo.rect(52, AY - 22, 38, 44, 6); paper(x, boss); Ink.hatchFill(x, boss, 0.9, B, 1.6); Ink.stroke(x, boss, { w: 2.6, seed: 11 });
      Ink.stroke(x, [[90, AY], [112, AY]], { w: 5, seed: 13 });
      const j1 = geo.rect(110, AY - 20, 42, 16, 4), j2 = geo.rect(110, AY + 4, 42, 16, 4);
      [j1, j2].forEach((J, i) => { paper(x, J); Ink.hatchFill(x, J, 0.8, B, 1.3); Ink.stroke(x, J, { w: 2.4, seed: 15 + i * 2 }); });
      text(x, 'clamp', 108, AY - 34, { font: 'hand', size: 22, align: 'center' });
    };
    function drawDryer(ctx, time) {
      const x = R.hx, y = R.hy, a = R.dryerOK ? 1 : 0.35;
      ctx.save(); ctx.globalAlpha = a;
      const handle = geo.rect(x - 16, y + 30, 32, 92, 10), noz = [[x - 40, y - 24], [x - 104, y - 20], [x - 104, y + 20], [x - 40, y + 24]], body = geo.ellipse(x, y, 46, 44);
      Ink.stroke(ctx, geo.curve([x, y + 122], [x + 6, y + 170], [x + 70, y + 110], [W - 22, BENCH - 4], 24), { w: 2.2, seed: 31, retrace: false });
      paper(ctx, handle); Ink.hatchFill(ctx, handle, 0.8, B, 1.1); Ink.stroke(ctx, handle, { w: 2.8, seed: 33 });
      paper(ctx, noz); Ink.stroke(ctx, [...noz, noz[0]], { w: 2.8, seed: 35 });
      paper(ctx, body); Ink.stroke(ctx, body, { w: 3, seed: 37 });
      Ink.stroke(ctx, geo.ellipse(x + 6, y, 20, 20), { w: 1.8, seed: 39, retrace: false });
      [-8, 0, 8].forEach((d, i) => Ink.stroke(ctx, [[x - 6, y + d], [x + 18, y + d]], { w: 1.4, seed: 41 + i, retrace: false }));
      const sw = geo.rect(x - 7, y + 52, 14, 22, 5); paper(ctx, sw); Ink.stroke(ctx, sw, { w: 1.8, seed: 45, color: R.on ? RD : B, retrace: false });
      if (R.on) for (let i = 0; i < 4; i++) Ink.stroke(ctx, wavy(x - 110, y - 15 + i * 10, x - 110 - 96 - (i % 2) * 16, y - 24 + i * 16, 5, 2.5, time * 9 + i * 1.7), { w: 2, color: RD, seed: 50 + i, retrace: false, amp: 0.3 });
      ctx.restore();
      if (!R.dryerOK && opt.dryerLater) text(ctx, opt.dryerLater, x - 20, y - 58, { font: 'hand', size: 22, align: 'center', a: 0.6 });
    }
    S.render = (ctx, time) => {
      const P = R.pts();
      if (R.ghost) { ctx.save(); ctx.setLineDash([7, 9]); ctx.strokeStyle = rgba(GR, 0.75); ctx.lineWidth = 2.4; ctx.beginPath(); pts(R.m).forEach(([a, b], i) => (i ? ctx.lineTo(a, b) : ctx.moveTo(a, b))); ctx.stroke(); ctx.restore(); }
      const hot = clamp(Math.max(R.T, R.bake > 0 ? 1 : 0));
      if (R.bake > 0) {                                        // the "very hot" treatment: pins hold the shape, flames underneath
        for (let i = 3; i <= NSEG; i += 4) { const [px, py] = P[i]; const fl = 16 + 7 * Math.sin(time * 17 + i); const F = [[px - 9, py + 34], ...geo.curve([px - 9, py + 34], [px - 12, py + 20], [px - 3, py + 22], [px + 1, py + 34 - fl - 18], 8), ...geo.curve([px + 1, py + 34 - fl - 18], [px + 5, py + 22], [px + 13, py + 22], [px + 9, py + 34], 8), [px - 9, py + 34]]; Ink.hatchFill(ctx, F, 0.9, RD, 1.5); Ink.stroke(ctx, F, { w: 2, color: RD, seed: 60 + i, retrace: false, amp: 0.4 }); }
      }
      if (R.pins) R.pins.forEach(([px, py], i) => { const C = geo.ellipse(px, py - 9, 6, 6); paper(ctx, C); Ink.stroke(ctx, C, { w: 2, seed: 70 + i, retrace: false }); const D = geo.ellipse(px, py + 9, 6, 6); paper(ctx, D); Ink.stroke(ctx, D, { w: 2, seed: 80 + i, retrace: false }); });
      // the wire
      Ink.stroke(ctx, P, { w: 3.6 + hot * 0.8, color: mix(B, RD, hot), seed: 21, amp: 0.35 });
      const tip = P[NSEG]; ctx.fillStyle = rgba(mix(B, RD, hot), 0.95); ctx.beginPath(); ctx.arc(tip[0], tip[1], 4.5, 0, 7); ctx.fill();
      if (hot > 0.35 && !R.bake) for (let i = 4; i < NSEG; i += 6) { const [px, py] = P[i]; Ink.stroke(ctx, wavy(px, py - 12, px + 3, py - 12 - 26 * hot, 4, 1.5, time * 8 + i), { w: 1.6, color: RD, seed: 90 + i, retrace: false, amp: 0.2 }); }
      drawDryer(ctx, time);
      text(ctx, 'wire: ' + (R.bake > 0 ? 'VERY hot!' : R.T > 0.6 ? 'hot' : R.T > 0.25 ? 'warm' : 'cool'), W - 30, 40, { size: 24, align: 'right', color: hot > 0.25 ? RD : B });
      if (R.msg) text(ctx, R.msg, 180, 40, { font: 'hand', size: 23, color: R.msgC, rot: -0.01, max: 500 });
    };
    S.step = (dt) => {
      let more = false;
      if (R.bake > 0) { R.bake -= dt; more = true; if (R.bake <= 0) { R.bake = 0; R.T = 0.2; opt.onBaked && opt.onBaked(); } return more; }
      // heating: is any part of the wire in the hot air?
      let inAir = false;
      if (R.on) { const zx = R.hx - 190, zy = R.hy; inAir = R.pts().some(([x, y]) => Math.hypot(x - zx, y - zy) < ZR || (x > R.hx - 200 && x < R.hx - 100 && Math.abs(y - R.hy) < 46)); more = true; }
      const T0 = R.T; R.T = clamp(R.T + (inAir ? dt / 0.9 : -dt / 2.2)); if (R.T > 0) more = true;
      if (inAir && T0 <= 0.6 && R.T > 0.6) { R.wasBent = R.isBent(); if (R.wasBent) { R.rec = true; Book.sfx('pop', { gain: 0.45 }); } }
      if (R.T > 0.6 && R.grab < 0) {                           // above the transition temperature: spring to the remembered shape
        let far = 0;
        for (let i = 0; i < NSEG; i++) { const d = wrap(R.a[i] - R.m[i]); R.v[i] += (-70 * d - 9 * R.v[i]) * dt; R.a[i] = R.m[i] + d + R.v[i] * dt; far = Math.max(far, Math.abs(d), Math.abs(R.v[i]) * 0.1); }
        if (far < 0.012) { for (let i = 0; i < NSEG; i++) { R.a[i] = R.m[i]; R.v[i] = 0; } if (R.rec) { R.rec = false; opt.onRecover && opt.onRecover(); } }
        else more = true;
      } else R.v.fill(0);
      return more || R.grab >= 0;
    };

    // ---- dragging: the wire (rope-style, then joint limits) or the hairdryer ----
    let mode = '', off = [0, 0];
    const hitDryer = (x, y) => x > R.hx - 112 && x < R.hx + 56 && y > R.hy - 52 && y < R.hy + 128;
    const nearest = (x, y) => { const P = R.pts(); let bi = -1, bd = 46; for (let i = 3; i <= NSEG; i++) { const d = Math.hypot(P[i][0] - x, P[i][1] - y); if (d < bd) { bd = d; bi = i; } } return bi; };
    function pull(j, tx, ty) {
      const P = R.pts(); tx = clamp(tx, 30, W - 30); ty = clamp(ty, 28, BENCH - 14);
      const to = (p, q) => { const dx = p[0] - q[0], dy = p[1] - q[1], d = Math.hypot(dx, dy) || 1; return [q[0] + (dx / d) * SEG, q[1] + (dy / d) * SEG]; };
      for (let it = 0; it < 3; it++) {
        P[j] = [tx, ty];
        for (let i = j - 1; i >= 2; i--) P[i] = to(P[i], P[i + 1]);
        P[0] = [AX, AY]; P[1] = [AX + SEG, AY];
        for (let i = 2; i <= j; i++) P[i] = to(P[i], P[i - 1]);
      }
      for (let i = j + 1; i <= NSEG; i++) P[i] = to(P[i], P[i - 1]);
      const a = [0]; for (let i = 1; i < NSEG; i++) { const raw = Math.atan2(P[i + 1][1] - P[i][1], P[i + 1][0] - P[i][0]); a[i] = a[i - 1] + clamp(wrap(raw - a[i - 1]), -0.62, 0.62); }
      if (inside(pts(a))) R.a = a;
    }
    S.drag(
      (x, y) => R.live && !R.bake && ((R.dryerOK && hitDryer(x, y)) || (!R.locked && nearest(x, y) >= 0)),
      (x, y, hit) => {
        if (!hit) { if (!R.live) Book.toast(opt.lockedMsg || 'Predict first.'); else if (hitDryer(x, y) && !R.dryerOK) Book.toast(opt.dryerMsg || 'The hairdryer comes later.'); return; }
        if (R.dryerOK && hitDryer(x, y)) { mode = 'dryer'; off = [R.hx - x, R.hy - y]; R.on = true; Book.sfx('paper', { gain: 0.3, dur: 0.5 }); }
        else { mode = 'wire'; R.grab = nearest(x, y); Book.sfx('tick', { gain: 0.4 }); }
      },
      (x, y) => { if (mode === 'dryer') { R.hx = clamp(x + off[0], 250, W - 60); R.hy = clamp(y + off[1], 60, 190); } else if (mode === 'wire' && R.grab >= 0) pull(R.grab, x, y); },
      () => { if (mode === 'wire') { R.grab = -1; opt.onBend && opt.onBend(); } if (mode === 'dryer') { R.on = false; } mode = ''; }
    );
    R.setShape = (a) => { R.a = a.slice(); R.v.fill(0); };
    R.refresh = () => { S.draw(); S.go(); };
    S.start();
    return R;
  }
  const HOOK = (() => { const a = []; for (let i = 0; i < NSEG; i++) a.push(i < 8 ? 0 : -clamp((i - 7) * 0.3, 0, 4.2)); return a; })();

  // ======================================================================================
  // bench 1: bend it, warm it, watch it spring back
  // ======================================================================================
  function benchRecover(ui) {
    const r = ui.record('p04.recover', { label: 'Nitinol wire: predict, bend, warm → conclusion (what made it recover?)', type: 'experiment', max: 1 });
    const prev = r.get() || {};
    let n = prev.n || 0;
    const sh = Shell(ui, {
      step: 'Bench 1 · the wire that remembers',
      task: 'This thin wire is <b>nitinol</b>, a metal alloy. It is clamped at one end. You are going to <b>bend it</b> out of shape with your finger, then <b>warm it</b> with the hairdryer.',
      predQ: 'When the bent wire is warmed, it will…',
      concQ: 'What made the wire go back to its first shape?',
      notes: `<p><span class="key">Shape memory alloy (SMA)</span>: a <b>smart material</b>. Example: <b>nitinol</b> (nickel + titanium).</p>
        <p>It can be <b>bent when cool</b>. When it is <b>heated</b> above its <b>transition temperature</b> it <b>returns to its original “remembered” shape</b>.</p>
        <p class="small">Stimulus = heat. Change = shape.</p>`,
    });
    const R = Rig(sh.body, { lockedMsg: 'Predict first: then you can bend the wire.',
      onBend: () => { if (R.isBent() && !n) { R.msg = 'now drag the hairdryer onto the wire'; R.msgC = RD; } },
      onRecover: () => { n++; R.msg = 'it sprang back! (try another shape if you like)'; R.msgC = GR; rec(null); sh.showConc(); } });
    const rec = (op) => {
      const base = `predicted "${sh.pred}"; bent the wire and warmed it ${n}×: it sprang back straight each time`;
      if (!op) r.set({ answer: base + (sh.done ? '' : '; no conclusion yet'), correct: sh.done ? true : null, n, pred: sh.pred });
      else r.set({ answer: `${base}; concluded "${op.t}" ${op.ok ? '✓' : '✗'}`, correct: op.ok, score: op.ok ? 1 : 0, max: 1, mis: op.ok ? '' : op.mis, n, pred: sh.pred });
    };
    sh.predict(['stay in its bent shape', 'spring back to straight', 'go soft and droop down'], prev.pred, (t) => { r.set({ answer: `predicted "${t}" (not tested yet)`, correct: null, pred: t, n }); live(); Book.sfx('pop', { gain: 0.45 }); }, () => n > 0 || sh.done);
    sh.conclude([
      { t: 'Heating it up', ok: true },
      { t: 'Letting go of it', mis: 'sma-mixup', why: 'When you let go, the wire stayed bent. Nothing happened until the hot air reached it.' },
      { t: 'Air pushing on it', mis: 'sma-mixup', why: 'Moving air is far too weak to straighten a metal wire. Think about what else the hairdryer gives out.' },
    ], 41, rec, () => `Heat is the stimulus. ${sh.pred === 'spring back to straight' ? 'Your prediction was spot on.' : `You predicted it would “${Book.esc(sh.pred)}”: the test has put that right.`}`);
    function live() { R.live = true; if (!n) { R.msg = 'drag the wire: bend it right out of shape'; R.msgC = B; } R.refresh(); }
    if (prev.pred) live();
    if (prev.correct === true) { R.msg = 'finished: you can still bend it and warm it'; R.msgC = GR; sh.restoreDone(); R.refresh(); }
    else if (n > 0) sh.showConc(true);
    return sh;
  }

  // ======================================================================================
  // bench 2: program a new remembered shape
  // ======================================================================================
  function benchProgram(ui) {
    const r = ui.record('p04.program', { label: 'Programming an SMA: bake in a new shape, predict, test → how is it programmed?', type: 'experiment', max: 1 });
    const prev = r.get() || {};
    const PRED = ['the straight line it started as', 'the new shape you baked in', 'nowhere: it stays as you left it'];
    let stage = 0, pred = null;               // 0 bend, 1 baking, 2 bend again, 3 predict, 4 warm it, 5 seen
    const sh = Shell(ui, {
      step: 'Bench 2 · teach it a new shape',
      task: 'Same wire. Can its memory be changed? Follow the steps: <b>bend → hold + heat very hot → cool → bend again → warm</b>.',
      concQ: 'How do you give a shape memory alloy a new remembered shape?',
      notes: `<p>An SMA can be <b>“programmed”</b>: <b>hold it in the new shape and heat it to a high temperature</b>. When it cools, that is the shape it remembers.</p>
        <p class="small">After that, gentle heat (above the transition temperature) always takes it back to the programmed shape.</p>`,
    });
    const stepP = ui.el('p', 'sma-q', '', sh.body);
    const R = Rig(sh.body, { dryerLater: 'later…', dryerMsg: 'Not yet: follow the steps under the drawing.',
      onBend: () => upd(),
      onBaked: () => { R.pins = null; R.m = R.a.slice(); R.locked = false; Book.sfx('paper', { gain: 0.4 }); if (sh.done) { stage = 5; R.msg = 'new shape baked in: bend it, then warm it'; R.msgC = GR; } else { stage = 2; R.msg = 'cooled down. It looks just the same…'; R.msgC = B; } upd(); },
      onRecover: () => { if (stage === 4) { stage = 5; R.msg = 'it went to the baked-in shape!'; R.msgC = GR; R.ghost = true; save(null); sh.showConc(); upd(); } } });
    const ctl = ui.el('div', 'sma-btns', '', sh.body);
    const bake = ui.el('button', 'btn', '🔥 Hold it in this shape + heat it VERY hot', ctl); bake.type = 'button';
    const predBox = ui.el('div', '', `<div class="sma-q"><b>Predict.</b> When you warm it with the hairdryer now, the wire will go to…</div>`, sh.body), predRow = ui.el('div', 'sma-btns', '', predBox);
    const pb = PRED.map((t) => { const b = ui.el('button', 'opt', t, predRow); b.type = 'button'; b.onclick = () => { if (stage !== 3) return; pb.forEach((q) => q.classList.remove('sel')); b.classList.add('sel'); pred = t; stage = 4; Book.scribble(0.12); save(null); upd(); }; return b; });
    const save = (op) => {
      const base = `baked a new shape into the wire; predicted "${pred || '-'}"` + (stage >= 5 ? '; saw it return to the baked-in shape' : '');
      if (!op) r.set({ answer: base, correct: sh.done ? true : null, pred, mem: stage >= 5 ? R.m.map((v) => +v.toFixed(2)) : undefined });
      else r.set({ answer: `${base}; concluded "${op.t}" ${op.ok ? '✓' : '✗'}`, correct: op.ok, score: op.ok ? 1 : 0, max: 1, mis: op.ok ? '' : op.mis, pred, mem: R.m.map((v) => +v.toFixed(2)) });
    };
    function upd() {
      R.live = true; R.locked = stage === 1; R.dryerOK = stage >= 4;
      bake.style.display = stage <= 1 || sh.done ? '' : 'none'; bake.disabled = stage === 1 || !(R.isBent() || (sh.done && R.bend() > 40));
      predBox.style.display = stage === 3 || stage === 4 ? '' : 'none';
      if (stage === 2 && R.isBent()) stage = 3, predBox.style.display = '';
      stepP.innerHTML = sh.done ? '<b>Finished.</b> Free play: bend it, warm it, or bake in another shape.'
        : stage === 0 ? `<b>Step 1.</b> Drag the wire into a <b>new shape</b> (a hook, a wave, a zigzag…). ${R.isBent() ? 'Good: now press the button.' : ''}`
        : stage === 1 ? '<b>Step 2.</b> Pins hold the shape while it is heated <b>very hot</b>…'
        : stage === 2 ? '<b>Step 3.</b> Now drag the wire into a <b>different</b> shape (try pulling it straight).'
        : stage === 3 ? '<b>Step 4.</b> Predict, below.' : stage === 4 ? '<b>Step 5.</b> Drag the hairdryer and warm the wire.' : '<b>Seen it?</b> Answer the question below.';
      if (stage === 0 && !sh.done) { R.msg = 'drag the wire into a new shape'; R.msgC = B; }
      R.refresh();
    }
    bake.onclick = () => { if (bake.disabled) return; if (sh.done) { R.ghost = true; } stage = sh.done ? stage : 1; R.locked = true; R.pins = R.pts().filter((p, i) => i % 5 === 3 || i === NSEG); R.bake = 2.8; R.msg = 'held by pins + heated VERY hot…'; R.msgC = RD; Book.sfx('paper', { gain: 0.5, dur: 1.2 }); if (!sh.done) upd(); else { bake.disabled = true; R.refresh(); } };
    sh.conclude([
      { t: 'Hold it in the shape and heat it very hot', ok: true },
      { t: 'Bend it into the shape again and again', mis: 'sma-mixup', why: 'Bending alone did not change its memory: on bench 1 it sprang straight back however you bent it.' },
      { t: 'Hold it in the shape while it stays cold', mis: 'sma-mixup', why: 'Holding it cold does nothing to its memory. What did you do to the wire while the pins held it?' },
    ], 53, save, () => `A high temperature while it is held sets the new memory. ${pred === PRED[1] ? 'You predicted that correctly.' : pred ? `You predicted “${Book.esc(pred)}”: now you know.` : ''}`);
    if (prev.correct === true) {
      pred = prev.pred || null; stage = 5; if (Array.isArray(prev.mem) && prev.mem.length === NSEG) { R.m = prev.mem.slice(); R.setShape(prev.mem); } else { R.m = HOOK.slice(); R.setShape(HOOK); }
      R.ghost = true; R.msg = 'this is the shape it remembers now'; R.msgC = GR; sh.restoreDone();
    }
    upd();
    return sh;
  }

  // ======================================================================================
  // bench 3: two pairs of glasses and someone sitting down
  // ======================================================================================
  function benchGlasses(ui) {
    const H = 330, SEAT = 286, GX = [250, 610];
    const r = ui.record('p04.glasses', { label: 'Glasses sat on: which frame is nitinol, and how can you tell?', type: 'experiment', max: 1 });
    const prev = r.get() || {};
    let sits = prev.sits || 0;
    const sh = Shell(ui, {
      step: 'Bench 3 · oops, the sofa',
      task: 'Two pairs of glasses were left on the sofa. One frame is ordinary <b>steel wire</b>, the other is <b>nitinol</b>. <b>Drag the person down</b> to sit on them, then let go.',
      concQ: 'Which frame is nitinol, and how can you tell?',
      notes: `<p>Some SMAs are <span class="key">superelastic</span>: they can <b>bend a long way and spring straight back</b>, with no heating needed.</p>
        <p>Used for <b>glasses frames that spring back if they are sat on</b>.</p>`,
    });
    const S = Stage(sh.body, H);
    const G = { y: 20, max: 0, sA: sits ? 1 : 0, sB: 0, vB: 0, down: false };            // y = top of the sitter block
    const BH = 96, YMAX = SEAT - BH - 14, Y0 = 20;
    const squash = () => clamp((G.y + BH - (SEAT - 78)) / (78 - 14));
    S.paint = (x) => {
      const seat = [[60, SEAT], [800, SEAT], [812, SEAT + 30], [48, SEAT + 30]];
      Ink.hatchShadow(x, seat, 1, 6, 6); paper(x, seat); Ink.hatchFill(x, seat, 0.7, B, 0.7); Ink.stroke(x, [...seat, seat[0]], { w: 2.8, seed: 5 });
      text(x, 'frame A', GX[0], SEAT + 26, { size: 24, align: 'center' }); text(x, 'frame B', GX[1], SEAT + 26, { size: 24, align: 'center' });
    };
    function glasses(ctx, cx, s, seed) {
      const ry = 31 * (1 - 0.74 * s), cy = SEAT - ry - 3, tw = 0.42 * s;
      [-1, 1].forEach((sd, i) => {
        const lx = cx + sd * (50 + 8 * s), L = rotP(geo.ellipse(lx, cy, 40 + 5 * s, ry), lx, cy, sd * tw * (seed % 2 ? 1 : -1));
        Ink.stroke(ctx, L, { w: 3.2, seed: seed + i * 3 });
        const ex = lx + sd * (40 + 5 * s), arm = [[ex, cy], [ex + sd * (26 + 20 * s), cy - 16 * (1 - s) + 6 * s], [ex + sd * (62 + 26 * s), cy - 10 * (1 - s) + (SEAT - 4 - cy) * s]];
        Ink.stroke(ctx, arm, { w: 2.8, seed: seed + 7 + i * 3 });
      });
      Ink.stroke(ctx, geo.curve([cx - 12 - 4 * s, cy - 4], [cx - 5, cy - 12 + 16 * s], [cx + 5, cy - 12 + 16 * s], [cx + 12 + 4 * s, cy - 4], 10), { w: 2.8, seed: seed + 13 });
    }
    S.render = (ctx) => {
      glasses(ctx, GX[0], G.sA, 21); glasses(ctx, GX[1], G.sB, 40);
      // the sitter: a big soft block coming down
      const Bk = [[120, G.y + 10], ...geo.curve([120, G.y + 10], [300, G.y - 6], [560, G.y - 6], [740, G.y + 10], 14), ...geo.curve([740, G.y + 10], [770, G.y + 60], [720, G.y + BH], [610, G.y + BH], 12), ...geo.curve([610, G.y + BH], [520, G.y + BH + 4], [470, G.y + BH - 26], [430, G.y + BH - 26], 10), ...geo.curve([430, G.y + BH - 26], [390, G.y + BH - 26], [340, G.y + BH + 4], [250, G.y + BH], 10), ...geo.curve([250, G.y + BH], [140, G.y + BH], [90, G.y + 60], [120, G.y + 10], 12)];
      paper(ctx, Bk); Ink.hatchFill(ctx, Bk, 0.5, B, 0.6); Ink.stroke(ctx, Bk, { w: 3, seed: 61 });
      text(ctx, 'someone sitting down', 430, G.y + 46, { font: 'hand', size: 24, align: 'center' });
      if (!G.down && G.y < Y0 + 4) { const P = [[790, 40], [790, 110]]; Ink.stroke(ctx, P, { w: 3, color: RD, seed: 71 }); Ink.stroke(ctx, geo.head(P, 16), { w: 3, color: RD, seed: 73 }); text(ctx, 'drag', 790, 30, { size: 22, align: 'center', color: RD }); }
      if (sits && !G.down && G.y < Y0 + 30) {
        text(ctx, G.sA > 0.5 ? 'still bent!' : '', GX[0], SEAT - 62, { font: 'hand', size: 24, align: 'center', color: RD, rot: -0.04 });
        if (G.sB < 0.05) text(ctx, 'sprang back', GX[1], SEAT - 78, { font: 'hand', size: 24, align: 'center', color: GR, rot: 0.03 });
      }
    };
    S.step = (dt) => {
      let more = false;
      if (G.down) { const s = squash(); G.sA = Math.max(G.sA, s); G.sB = s; G.vB = 0; G.max = Math.max(G.max, s); return true; }
      if (G.y > Y0) { G.y = Math.max(Y0, G.y - dt * 520); more = true; }
      const s = squash();
      if (G.sB > s || Math.abs(G.vB) > 0.01) { G.vB += (-120 * (G.sB - s) - 9 * G.vB) * dt; G.sB = Math.max(s, G.sB + G.vB * dt); if (Math.abs(G.sB - s) < 0.004 && Math.abs(G.vB) < 0.05) { G.sB = s; G.vB = 0; } more = true; }
      return more;
    };
    let off = 0;
    S.drag((x, y) => x > 90 && x < 800 && y > G.y - 10 && y < G.y + BH + 14,
      (x, y, hit) => { if (hit) { G.down = true; off = G.y - y; G.max = 0; } },
      (x, y) => { const y1 = clamp(y + off, Y0, YMAX); if (squash() < 0.05 && clamp((y1 + BH - (SEAT - 78)) / 64) >= 0.05) Book.sfx('thud', { gain: 0.35 }); G.y = y1; },
      () => { G.down = false; if (G.max > 0.8) { sits++; Book.sfx('pop', { gain: 0.45 }); save(null); sh.showConc(); } else if (G.max < 0.05) Book.toast('Drag it all the way down onto the glasses.'); });
    const save = (op) => {
      const base = `sat on both frames ${sits}×: A stayed bent, B sprang back`;
      if (!op) r.set({ answer: base, correct: sh.done ? true : null, sits });
      else r.set({ answer: `${base}; answered "${op.t}" ${op.ok ? '✓' : '✗'}`, correct: op.ok, score: op.ok ? 1 : 0, max: 1, mis: op.ok ? '' : op.mis, sits });
    };
    sh.conclude([
      { t: 'Frame B: it sprang back by itself', ok: true },
      { t: 'Frame A: it kept its new shape', mis: 'sma-mixup', why: 'Staying bent is what ordinary steel wire does. Nitinol is the one that recovers its shape.' },
      { t: 'Frame B: it did not bend at all', mis: 'sma-mixup', why: 'Look again while you sit on them: frame B bends a long way too. Watch what it does when you get up.' },
    ], 67, save, () => 'Frame B bent a long way, then sprang back with no heat at all.');
    S.start();
    if (prev.correct === true) sh.restoreDone(); else if (sits) sh.showConc(true);
    return sh;
  }

  // ======================================================================================
  // bench 4: the actuator: an SMA wire lifting a weight when a current heats it
  // ======================================================================================
  function benchActuator(ui) {
    const H = 380, GROUND = 344, TOP = 46, WX = 300, LONG = 190, SHORT = 138;
    const r = ui.record('p04.actuator', { label: 'SMA actuator: predict, switch on, watch the weight → why did it rise?', type: 'experiment', max: 1 });
    const prev = r.get() || {};
    let lifts = prev.lifts || 0;
    const sh = Shell(ui, {
      step: 'Bench 4 · a wire that works like a muscle',
      task: 'A thin SMA wire hangs from a stand with a <b>weight</b> on the end. It was programmed <b>short</b>; the weight has stretched it while cool. The switch sends a small <b>electric current</b> through the wire, which <b>heats</b> it.',
      predQ: 'When the switch is held down, the weight will…',
      concQ: 'Why did the weight rise?',
      notes: `<p>An SMA wire can be an <span class="key">actuator</span> (it makes movement): the wire <b>shortens when an electric current heats it</b>, and pulls. When it cools, the load stretches it again.</p>
        <p class="small">The current is only a handy way to <b>heat</b> the wire.</p>`,
    });
    const S = Stage(sh.body, H);
    const A = { on: false, T: 0, len: LONG, top: false, live: false, best: LONG };
    S.paint = (x) => {
      Ink.stroke(x, [[20, GROUND], [W - 20, GROUND]], { w: 2.6, seed: 3 });
      const base = geo.rect(96, GROUND - 16, 290, 16, 4); Ink.hatchShadow(x, base, 1, 7, 6); paper(x, base); Ink.hatchFill(x, base, 0.9, B, 1.4); Ink.stroke(x, base, { w: 2.8, seed: 5 });
      const post = geo.rect(130, TOP - 12, 14, GROUND - TOP - 4, 4); paper(x, post); Ink.stroke(x, post, { w: 2.6, seed: 7 });
      const arm = geo.rect(130, TOP - 12, 196, 14, 4); paper(x, arm); Ink.hatchFill(x, arm, 0.8, B, 1.3); Ink.stroke(x, arm, { w: 2.6, seed: 9 });
      Ink.stroke(x, [[144, 96], [200, TOP]], { w: 2.2, seed: 11, retrace: false });
      // ruler
      const ru = geo.rect(392, 60, 30, 268, 3); paper(x, ru); Ink.stroke(x, ru, { w: 2.2, seed: 13 });
      for (let i = 0; i <= 26; i++) Ink.stroke(x, [[392, 66 + i * 10], [i % 5 ? 402 : 410, 66 + i * 10]], { w: 1.3, seed: 15 + i, retrace: false });
      text(x, 'ruler', 407, 52, { font: 'hand', size: 22, align: 'center' });
      // battery
      const bat = geo.rect(604, 70, 176, 78, 10); Ink.hatchShadow(x, bat, 1, 7, 7); paper(x, bat); Ink.stroke(x, bat, { w: 3, seed: 43 });
      const cap = geo.rect(780, 92, 14, 34, 3); paper(x, cap); Ink.hatchFill(x, cap, 1, B, 1.6); Ink.stroke(x, cap, { w: 2.2, seed: 45 });
      Ink.hatchFill(x, geo.rect(604, 70, 54, 78, 10), 0.8, B, 1.2);
      text(x, '+', 754, 120, { size: 34, align: 'center', color: RD }); text(x, '−', 632, 120, { size: 34, align: 'center' }); text(x, 'battery', 700, 118, { font: 'hand', size: 22, align: 'center' });
      // fixed wiring: battery + → top of the SMA wire; battery − → switch
      Ink.stroke(x, [[794, 108], ...geo.curve([812, 108], [840, 100], [836, 18], [760, 16], 14), [360, 16], ...geo.curve([340, 16], [306, 16], [WX, 20], [WX, TOP], 8)], { w: 2.6, seed: 47, color: RD });
      Ink.stroke(x, [[604, 110], ...geo.curve([580, 110], [548, 112], [548, 190], [572, 244], 12), [588, 268]], { w: 2.6, seed: 49 });
      text(x, 'switch', 646, 318, { font: 'hand', size: 22, align: 'center' });
      [[588, 268], [700, 268]].forEach(([px, py], i) => { const C = geo.ellipse(px, py, 7, 7); paper(x, C); Ink.stroke(x, C, { w: 2.2, seed: 51 + i, retrace: false }); });
      text(x, 'SMA wire', 212, 150, { size: 22, align: 'right' }); Ink.stroke(x, [[218, 144], [WX - 10, 140]], { w: 1.6, seed: 55, retrace: false }); Ink.stroke(x, geo.head([[218, 144], [WX - 10, 140]], 10), { w: 1.6, seed: 56, retrace: false });
    };
    S.render = (ctx, time) => {
      const yb = TOP + A.len, hot = clamp(A.T);
      // switch arm
      const sa = A.on ? 0 : -0.5; Ink.stroke(ctx, [[588, 268], [588 + Math.cos(sa) * 112, 268 + Math.sin(sa) * 112]], { w: 3.4, seed: 60, color: A.on ? RD : B });
      // lead from the switch to the bottom of the SMA wire (it moves with the weight)
      Ink.stroke(ctx, geo.curve([700, 268], [750, 268], [640, GROUND - 6], [540, GROUND - 7], 20).concat([[440, GROUND - 7]], geo.curve([440, GROUND - 7], [372, GROUND - 8], [372, yb + 10], [WX + 7, yb + 8], 18)), { w: 2.4, seed: 62, retrace: false });
      // the SMA wire
      Ink.stroke(ctx, [[WX, TOP], [WX, yb]], { w: 3 + hot, color: mix(B, RD, hot), seed: 64, amp: 0.3 });
      if (hot > 0.3) for (let i = 0; i < 3; i++) { const py = TOP + 30 + i * (A.len - 50) / 2; Ink.stroke(ctx, wavy(WX + 12, py, WX + 12 + 26 * hot, py - 6, 4, 1.5, time * 8 + i * 2), { w: 1.6, color: RD, seed: 66 + i, retrace: false, amp: 0.2 }); }
      if (A.on) for (let i = 0; i < 3; i++) { const py = TOP + ((time * 90 + i * (A.len / 3)) % A.len); Ink.stroke(ctx, [[WX - 8, py - 7], [WX, py + 2], [WX + 8, py - 7]], { w: 2, color: RD, seed: 70 + i, retrace: false, amp: 0.2 }); }
      // hook + weight
      Ink.stroke(ctx, geo.ellipse(WX, yb + 9, 7, 9), { w: 2.2, seed: 74, retrace: false });
      const Wt = [[WX - 26, yb + 18], [WX + 26, yb + 18], [WX + 40, yb + 78], [WX - 40, yb + 78], [WX - 26, yb + 18]];
      Ink.hatchShadow(ctx, Wt, 1, 6, 5); paper(ctx, Wt); Ink.hatchFill(ctx, Wt, 0.9, B, 1.5); Ink.stroke(ctx, Wt, { w: 3, seed: 76 });
      // pointer on the ruler, and a mark for the highest point reached
      Ink.stroke(ctx, [[WX + 42, yb + 48], [388, yb + 48]], { w: 2.4, color: RD, seed: 78, retrace: false }); Ink.stroke(ctx, geo.head([[WX + 42, yb + 48], [388, yb + 48]], 10), { w: 2.4, color: RD, seed: 79, retrace: false });
      if (A.best < LONG - 4) Ink.stroke(ctx, [[424, TOP + A.best + 48], [448, TOP + A.best + 48]], { w: 2.4, color: GR, seed: 81, retrace: false });
      if (A.best < LONG - 4) text(ctx, 'highest', 454, TOP + A.best + 56, { size: 22, color: GR });
      text(ctx, !A.live ? 'predict first!' : A.on ? 'current ON: wire heating' : hot > 0.2 ? 'OFF: wire cooling' : 'switch off', 580, 200, { font: 'hand', size: 22, color: A.on || !A.live ? RD : B, rot: -0.02, max: 262 });
    };
    S.step = (dt) => {
      A.T = clamp(A.T + (A.on ? dt / 1.1 : -dt / 1.9));
      const target = lerp(LONG, SHORT, smooth((A.T - 0.35) / 0.4)); A.len += (target - A.len) * (1 - Math.exp(-dt * 9));
      A.best = Math.min(A.best, A.len);
      if (!A.top && A.len < SHORT + 4) { A.top = true; Book.sfx('pop', { gain: 0.4 }); }
      if (A.top && A.len > LONG - 5) { A.top = false; lifts++; save(null); sh.showConc(); }
      return A.on || A.T > 0 || Math.abs(target - A.len) > 0.2;
    };
    const row = ui.el('div', 'sma-btns', '', sh.body);
    const hold = ui.el('button', 'btn sma-hold', 'Hold down to switch ON', row); hold.type = 'button';
    const tip = ui.el('span', 'small', 'Hold until the weight stops moving, then let go and watch again.', row); tip.style.alignSelf = 'center';
    const set = (v) => { if (v && !A.live) { Book.toast('Predict first: then the switch works.'); return; } if (A.on === v) return; A.on = v; hold.classList.toggle('down', v); Book.sfx('tick', { gain: 0.5 }); S.go(); };
    hold.addEventListener('pointerdown', (e) => { e.preventDefault(); try { hold.setPointerCapture(e.pointerId); } catch (er) {} set(true); });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((ev) => hold.addEventListener(ev, () => set(false)));
    hold.addEventListener('contextmenu', (e) => e.preventDefault());
    const save = (op) => {
      const base = `predicted "${sh.pred}"; ran the actuator ${lifts}×: weight rose when the current heated the wire, dropped back as it cooled`;
      if (!op) r.set({ answer: base, correct: sh.done ? true : null, lifts, pred: sh.pred });
      else r.set({ answer: `${base}; concluded "${op.t}" ${op.ok ? '✓' : '✗'}`, correct: op.ok, score: op.ok ? 1 : 0, max: 1, mis: op.ok ? '' : op.mis, lifts, pred: sh.pred });
    };
    sh.predict(['rise up', 'drop lower', 'stay still'], prev.pred, (t) => { A.live = true; r.set({ answer: `predicted "${t}" (not tested yet)`, correct: null, pred: t, lifts }); Book.sfx('pop', { gain: 0.45 }); S.draw(); }, () => lifts > 0 || sh.done);
    sh.conclude([
      { t: 'Heat made the wire shrink back to its short remembered length', ok: true },
      { t: 'Heat made the wire expand, so it got longer and pushed upwards', mis: 'sma-mixup', why: 'Check the ruler: the wire got shorter, not longer. (And a thin wire cannot push.) Why would an SMA change length when heated?' },
      { t: 'The current turned the wire into a magnet that pulled it upwards', mis: 'sma-mixup', why: 'There is no magnet here. The current only heats the wire: think about what heat does to a shape memory alloy.' },
    ], 79, save, () => `The current heats the wire; the heat makes it return to its remembered (short) shape. ${sh.pred === 'rise up' ? 'Your prediction was right.' : `You predicted “${Book.esc(sh.pred)}”: the test has put that right.`}`);
    if (prev.pred) A.live = true;
    S.start();
    if (prev.correct === true) sh.restoreDone(); else if (lifts) sh.showConc(true);
    return sh;
  }

  // ======================================================================================
  Book.page({ id: 'p04', title: 'Shape memory alloys', build(ui, root) {
    ui.h('Shape memory alloys');
    ui.p('Smart pigments change <b>colour</b>. This smart material changes <b>shape</b>. Four quick benches: on each one <b>predict</b>, test it with your finger, then say what you found. <span class="small">The notes for a bench appear when you finish it.</span>');
    const b1 = benchRecover(ui);
    const b2 = benchProgram(ui);
    const b3 = benchGlasses(ui);
    const b4 = benchActuator(ui);

    ui.h('Where SMAs are used', { size: 40 });
    const USES = `<ul style="margin:0;padding-left:22px">
      <li><b>Dental braces</b> (orthodontic wire): the warmth of the mouth makes the wire pull the teeth.</li>
      <li><b>Stents</b>: open up inside a blood vessel.</li>
      <li><b>Glasses frames</b>: spring back if they are sat on.</li>
      <li><b>Fire sprinkler / safety valves</b> and <b>anti-scald valves</b> in showers: heat makes them act.</li>
      <li><b>Actuators</b>: a wire that shortens when a current heats it.</li></ul>`;
    const uses = ui.box('<div class="sma-uses"><p class="sma-locked">🔒 This list appears when you have finished all four benches.</p></div>', { tag: 'Notes' });
    const benches = [b1, b2, b3, b4];
    const unlock = () => { if (benches.every((b) => b.done)) uses.querySelector('.sma-uses').innerHTML = USES; };
    benches.forEach((b) => (b.onDone = unlock)); unlock();
    ui.p('Match each product to what the SMA does in it. <span class="small">The notes and benches blur while you match: recall them!</span>');
    const match = ui.match({ id: 'p04.uses', label: 'Match 5 SMA products to what the SMA does', q: 'Tap a product, then tap what the SMA does.',
      pairs: [
        ['Dental braces', 'warmed by the mouth, the wire pulls teeth into line', 'sma-mixup'],
        ['Stent', 'put in small, then opens up inside a blood vessel', 'sma-mixup'],
        ['Glasses frame', 'bends a long way when sat on, then springs back', 'sma-mixup'],
        ['Fire sprinkler valve', 'the heat of a fire makes it open and let water out', 'sma-mixup'],
        ['Anti-scald shower valve', 'water that is too hot makes it close off the flow', 'sma-mixup'],
      ] });
    ui.hideWhile(match, 'p04.uses', [uses, b1.notes, b2.notes, b3.notes, b4.notes, b3.lab]);

    ui.tf({ id: 'p04.battery', label: 'T/F: an SMA needs a battery to change shape', mis: 'smart-meaning',
      statement: 'A shape memory alloy only changes shape if it is connected to a battery.', answer: false,
      explain: 'False. Its stimulus is <b>heat</b>: a hairdryer, hot water or a warm mouth all work. Smart materials respond to their surroundings by themselves; in the actuator the current was just a way to heat the wire.' });
  } });
})();
