// Page 7 — Pulleys & belts: a belt drive you start or turn by hand (plain, then crossed), a "jam it" bench that
// compares a plain belt, a gear train and a toothed belt, velocity ratio with two calculations that echo the
// student's own working, and a belts-versus-gears sort.
(function () {
  'use strict';
  const B = Ink.BLUE, RD = Ink.RED, GR = Ink.GREEN, rgba = Ink.rgba, geo = Ink.geo;
  const HANDF = (s) => `400 ${s}px "Gloria Hallelujah", "Comic Sans MS", cursive`;
  const LABF = (s) => `600 ${s}px Fredoka, "Arial Rounded MT Bold", system-ui, sans-serif`;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const TAU = Math.PI * 2;
  const mod = (a, n) => ((a % n) + n) % n;
  const ease = (u) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2);
  const DPR = () => Math.min(2, window.devicePixelRatio || 1);

  // ---------- small drawing helpers (all in blue biro) ----------
  function text(x, s, px, py, o = {}) {
    x.save(); let size = o.size || 22; const f = o.font === 'hand' ? HANDF : LABF; x.font = f(size);
    if (o.max) while (size > 16 && x.measureText(s).width > o.max) { size--; x.font = f(size); }
    x.fillStyle = rgba(o.color || B, o.a ?? 0.92); x.textAlign = o.align || 'left'; x.textBaseline = 'alphabetic';
    if (o.rot) { x.translate(px, py); x.rotate(o.rot); x.fillText(s, 0, 0); } else x.fillText(s, px, py);
    x.restore();
  }
  const path = (x, P) => { x.beginPath(); P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.closePath(); };
  const eraseC = (x, p, r) => { x.save(); x.globalCompositeOperation = 'destination-out'; x.fillStyle = '#000'; x.beginPath(); x.arc(p[0], p[1], r, 0, 7); x.fill(); x.restore(); };
  const eraseP = (x, P) => { x.save(); x.globalCompositeOperation = 'destination-out'; x.fillStyle = '#000'; path(x, P); x.fill(); x.restore(); };
  const fillP = (x, P, style) => { x.save(); x.fillStyle = style; path(x, P); x.fill(); x.restore(); };
  const ring = (x, p, r, o = {}) => { x.save(); x.strokeStyle = rgba(o.color || B, o.a ?? 0.95); x.lineWidth = o.w ?? 2.4; x.beginPath(); x.arc(p[0], p[1], r, 0, 7); x.stroke(); x.restore(); };
  const disc = (x, p, r, o = {}) => { x.save(); x.fillStyle = o.style || rgba(o.color || B, o.a ?? 0.95); x.beginPath(); x.arc(p[0], p[1], r, 0, 7); x.fill(); x.restore(); };
  const box = (x0, y0, w, h) => [[x0, y0], [x0 + w, y0], [x0 + w, y0 + h], [x0, y0 + h]];
  const closeP = (P) => P.concat([P[0]]);
  // curved arrow round centre c; dir = +1 clockwise on screen
  function arcArrow(x, c, r, a0, span, dir, color, a = 1, w = 3.4) {
    if (a <= 0.02) return; const P = []; for (let i = 0; i <= 14; i++) { const an = a0 + dir * span * i / 14; P.push([c[0] + Math.cos(an) * r, c[1] + Math.sin(an) * r]); }
    const q = P[14], p = P[12], d = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1, u = [(q[0] - p[0]) / d, (q[1] - p[1]) / d], n = [-u[1], u[0]];
    x.save(); x.globalAlpha = a;
    Ink.stroke(x, P, { w, color, seed: 3, amp: 0.3 });
    Ink.stroke(x, [[q[0] - u[0] * 15 + n[0] * 10, q[1] - u[1] * 15 + n[1] * 10], q, [q[0] - u[0] * 15 - n[0] * 10, q[1] - u[1] * 15 - n[1] * 10]], { w, color, seed: 5, amp: 0.3 });
    x.restore();
  }

  // a wheel drawn once on its own little canvas, then spun (so the ink never shimmers)
  function sprite(size, paint) {
    const dpr = DPR(), c = document.createElement('canvas'); c.width = c.height = Math.ceil(size * dpr);
    const x = c.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.lineCap = 'round'; x.lineJoin = 'round'; x.translate(size / 2, size / 2); paint(x); c._s = size; return c;
  }
  function spin(x, sp, c, ang) { x.save(); x.translate(c[0], c[1]); x.rotate(ang); x.drawImage(sp, -sp._s / 2, -sp._s / 2, sp._s, sp._s); x.restore(); }
  function hubAndSpot(x, r, o = {}) {
    const holes = r > 60 ? 5 : r > 36 ? 4 : 0;
    for (let i = 0; i < holes; i++) { const a = (i + 0.5) * TAU / holes - Math.PI / 2; Ink.stroke(x, geo.ellipse(Math.cos(a) * r * 0.52, Math.sin(a) * r * 0.52, r * 0.17, r * 0.17), { w: 1.6, seed: 21 + i, amp: 0.3, retrace: false }); }
    Ink.stroke(x, geo.ellipse(0, 0, 9, 9), { w: 2, seed: 9, amp: 0.2 }); disc(x, [0, 0], 4);
    if (o.spot !== false) { x.strokeStyle = rgba(RD, 0.75); x.lineWidth = 2.2; x.beginPath(); x.moveTo(0, -11); x.lineTo(0, -(r - 20)); x.stroke(); disc(x, [0, -(r - 13)], 6.5, { color: RD, a: 0.92 }); }
  }
  // a pulley of belt radius r (the flange stands 5 px proud of the belt)
  function pulleySprite(r, o = {}) {
    return sprite(r * 2 + 26, (x) => {
      disc(x, [0, 0], r + 5, { style: 'rgba(120,140,235,0.10)' });
      Ink.stroke(x, geo.ellipse(0, 0, r + 5, r + 5), { w: 2.8, seed: 5 + (r | 0), amp: 0.5 });
      ring(x, [0, 0], r - 6, { w: 1.3, a: 0.55 });
      if (o.toothed) for (let i = 0; i < Math.round(r / 3.4); i++) { const a = i * TAU / Math.round(r / 3.4); x.strokeStyle = rgba(B, 0.8); x.lineWidth = 1.8; x.beginPath(); x.moveTo(Math.cos(a) * (r - 6), Math.sin(a) * (r - 6)); x.lineTo(Math.cos(a) * (r + 1), Math.sin(a) * (r + 1)); x.stroke(); }
      hubAndSpot(x, r, o);
    });
  }
  // a spur gear of pitch radius rp with n teeth (a gap is centred on angle 0)
  function gearSprite(rp, n, o = {}) {
    return sprite(rp * 2 + 30, (x) => {
      const P = [], st = TAU / n, r0 = rp - 5, r1 = rp + 5;
      for (let i = 0; i < n; i++) [[0.2, r0], [0.34, r1], [0.66, r1], [0.8, r0]].forEach(([f, r]) => { const a = (i + f) * st; P.push([Math.cos(a) * r, Math.sin(a) * r]); });
      fillP(x, P, 'rgba(120,140,235,0.10)');
      Ink.stroke(x, closeP(P), { w: 2.4, seed: 7 + n, amp: 0.35 });
      ring(x, [0, 0], rp - 13, { w: 1.2, a: 0.5 });
      hubAndSpot(x, rp - 6, o);
    });
  }

  // the belt as a closed path round two pulleys on the same level; it travels the way a clockwise driver (c1) pulls it
  function beltPath(c1, r1, c2, r2, crossed) {
    const d = c2[0] - c1[0], nx = (crossed ? r1 + r2 : r1 - r2) / d, al = Math.acos(nx), P = [];
    const arc = (c, r, a0, a1) => { const n = Math.max(8, Math.ceil(Math.abs(a1 - a0) * r / 4)); for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; P.push([c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r]); } };
    arc(c1, r1, al, TAU - al);
    const Q = geo.seg([P[P.length - 1], crossed ? [c2[0] - Math.cos(al) * r2, c2[1] + Math.sin(al) * r2] : [c2[0] + Math.cos(al) * r2, c2[1] - Math.sin(al) * r2]], 4); Q.slice(1, -1).forEach((p) => P.push(p));
    if (crossed) arc(c2, r2, Math.PI - al, -(Math.PI - al)); else arc(c2, r2, -al, al);
    const Q2 = geo.seg([P[P.length - 1], P[0]], 4); Q2.slice(1).forEach((p) => P.push(p));
    const L = [0]; for (let i = 1; i < P.length; i++) L.push(L[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]));
    const len = L[L.length - 1];
    const at = (s) => { s = mod(s, len); let lo = 0, hi = L.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (L[m] <= s) lo = m; else hi = m; }
      const f = (s - L[lo]) / Math.max(1e-6, L[hi] - L[lo]), a = P[lo], b = P[hi], dd = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return { p: [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f], u: [(b[0] - a[0]) / dd, (b[1] - a[1]) / dd] }; };
    return { P, len, at };
  }
  const HALF = 4.5;
  function beltBand(x, belt) {
    const P = belt.P, off = (k) => P.map((p, i) => { const a = P[Math.max(0, i - 1)], b = P[Math.min(P.length - 1, i + 1)], d = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [p[0] - (b[1] - a[1]) / d * k, p[1] + (b[0] - a[0]) / d * k]; });
    x.save(); x.strokeStyle = 'rgba(60,76,170,0.20)'; x.lineWidth = HALF * 2; x.lineJoin = 'round'; x.beginPath(); P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.stroke(); x.restore();
    Ink.stroke(x, off(HALF), { w: 2, seed: 13, amp: 0.35, retrace: false }); Ink.stroke(x, off(-HALF), { w: 2, seed: 17, amp: 0.35, retrace: false });
  }
  // the marks that travel with the belt (ribs; on a toothed belt, teeth on the inside)
  function beltTicks(x, belt, offset, toothed) {
    const sp = toothed ? 11 : 27, n = Math.max(1, Math.round(belt.len / sp)), step = belt.len / n;
    x.save(); x.strokeStyle = rgba(B, toothed ? 0.9 : 0.8); x.lineWidth = toothed ? 3.4 : 2; x.lineCap = toothed ? 'butt' : 'round'; x.beginPath();
    for (let i = 0; i < n; i++) { const q = belt.at(offset + i * step), nx = -q.u[1], ny = q.u[0];
      if (toothed) { x.moveTo(q.p[0] + nx * 3, q.p[1] + ny * 3); x.lineTo(q.p[0] + nx * 9.5, q.p[1] + ny * 9.5); }
      else { x.moveTo(q.p[0] - nx * 3.6 - q.u[0] * 2, q.p[1] - ny * 3.6 - q.u[1] * 2); x.lineTo(q.p[0] + nx * 3.6 + q.u[0] * 2, q.p[1] + ny * 3.6 + q.u[1] * 2); } }
    x.stroke(); x.restore();
  }
  // an electric motor whose shaft is at (cx, cy); the pulley or gear is drawn over its right-hand end
  function motor(x, cx, cy) {
    const P = geo.rect(cx - 150, cy - 46, 132, 92, 16);
    Ink.hatchShadow(x, P, 1, 6, 6); fillP(x, P, 'rgba(120,140,235,0.10)'); Ink.stroke(x, P, { w: 2.6, seed: 29, amp: 0.5 });
    for (let i = 0; i < 5; i++) Ink.stroke(x, [[cx - 138, cy - 30 + i * 15], [cx - 60, cy - 30 + i * 15]], { w: 1.5, seed: 31 + i, amp: 0.4, retrace: false });
    [[cx - 138, 0], [cx - 62, 0]].forEach(([fx], i) => { const F = box(fx, cy + 46, 30, 13); Ink.hatchFill(x, F, 1, B, 1.6); Ink.stroke(x, closeP(F), { w: 1.8, seed: 37 + i, amp: 0.3 }); });
  }
  function ground(x, x0, x1, y) {
    Ink.stroke(x, [[x0, y], [x1, y]], { w: 2.6, seed: 3, amp: 0.8 });
    x.save(); x.strokeStyle = rgba(B, 0.35); x.lineWidth = 1.1; x.beginPath(); for (let u = x0 + 6; u < x1; u += 13) { x.moveTo(u, y + 14); x.lineTo(u + 11, y + 3); } x.stroke(); x.restore();
  }
  function stand(x, c, y, half = 34) { Ink.stroke(x, [[c[0] - half, y], [c[0], c[1]], [c[0] + half, y]], { w: 2.6, seed: 41 + (c[0] | 0) % 9, amp: 0.5 }); }

  // ---------- an interactive canvas "stage" with an on-demand render loop and finger dragging ----------
  function Stage(ui, W, Hh) {
    const wrap = ui.el('div', 'exp'); wrap.style.cssText = 'position:relative;margin:0 0 14px';
    const c = document.createElement('canvas'); wrap.appendChild(c);
    const dpr = DPR();
    c.width = Math.round(W * dpr); c.height = Math.round(Hh * dpr);
    Object.assign(c.style, { width: '100%', height: 'auto', aspectRatio: W + ' / ' + Hh, display: 'block', touchAction: 'pan-y', userSelect: 'none', webkitUserSelect: 'none', webkitTouchCallout: 'none' });
    const ctx = c.getContext('2d');
    const S = { c, ctx, W, H: Hh, wrap, render: () => false };
    S.pos = (e) => { const r = c.getBoundingClientRect(); return [((e.clientX - r.left) * W) / r.width, ((e.clientY - r.top) * Hh) / r.height]; };
    S.layer = (paint) => { const L = document.createElement('canvas'); L.width = Math.ceil(W * dpr); L.height = Math.ceil(Hh * dpr); const x = L.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.lineCap = 'round'; x.lineJoin = 'round'; paint(x); return L; };
    S.blit = (L, dx = 0, dy = 0) => ctx.drawImage(L, dx, dy, W, Hh);
    const hidden = () => { const p = c.closest('.page'); return !p || p.classList.contains('hidden'); };
    let raf = 0, wait = 0, last = 0, vis = true;
    if (window.IntersectionObserver) new IntersectionObserver((es) => { vis = es[es.length - 1].isIntersecting; if (vis) S.go(); }, { rootMargin: '120px' }).observe(c);
    const tick = (now) => {
      raf = 0;
      if (!vis) { last = 0; return; }
      if (hidden()) { last = 0; if (!wait) wait = setTimeout(() => { wait = 0; S.go(); }, 400); return; }
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60; last = now;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.globalCompositeOperation = 'source-over'; ctx.clearRect(0, 0, W, Hh);
      ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = 1; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      if (S.render(dt, now / 1000)) raf = requestAnimationFrame(tick); else last = 0;
    };
    S.go = () => { if (!raf) raf = requestAnimationFrame(tick); };
    S.drag = (h) => {
      let tok = null, pid = null;
      c.addEventListener('touchstart', (e) => { const t = e.changedTouches[0]; const [px, py] = S.pos(t); if (h.hit(px, py) != null) e.preventDefault(); }, { passive: false });
      c.addEventListener('pointerdown', (e) => { if (tok != null) return; const [px, py] = S.pos(e); tok = h.hit(px, py); if (tok == null) return; pid = e.pointerId; try { c.setPointerCapture(pid); } catch (er) {} c.style.cursor = 'grabbing'; h.move(tok, px, py, true); S.go(); });
      c.addEventListener('pointermove', (e) => { if (tok == null) { const [px, py] = S.pos(e); c.style.cursor = h.hit(px, py) != null ? 'grab' : ''; return; } if (e.pointerId !== pid) return; const [px, py] = S.pos(e); h.move(tok, px, py, false); S.go(); });
      const up = (e) => { if (tok == null || e.pointerId !== pid) return; const t = tok; tok = null; c.style.cursor = ''; h.end && h.end(t); S.go(); };
      c.addEventListener('pointerup', up); c.addEventListener('pointercancel', up);
      S.dragging = () => tok != null;
    };
    S.dragging = () => false;
    if (document.fonts) document.fonts.ready.then(() => { S.onFonts && S.onFonts(); S.go(); });
    return S;
  }
  const frameAct = (d) => requestAnimationFrame(() => Ink.frame(d, { shadow: false, w: 2.2 }));
  const item = (id) => Book.state.items[id];
  const lock = (els, on) => els.forEach((e) => e.classList.toggle('peek-lock', on));

  // ======================================================================================
  Book.page({
    id: 'p07',
    title: 'Pulleys & belts',
    build(ui, root) {
      ui.h('Pulleys & belts');
      ui.p('Gears have to touch. So how do you drive a shaft that is <b>far away</b> from the motor? Join them with a <span class="key">belt</span>.');
      const nIntro = ui.box('A <b>pulley</b> is a wheel with a <b>groove</b> round its edge. A <b>belt</b> runs in the grooves.<br>The belt links the <b class="red">driver pulley</b> (input: turned by the motor) to the <b style="color:var(--green)">driven pulley</b> (output), some distance apart.', { tag: 'Notes' });

      // ================================================================ BENCH 1: WHICH WAY?
      ui.el('h2', '', 'Bench 1: which way does it turn?');
      const W1 = 860, H1 = 400, C1 = [245, 212], R1 = 55, C2 = [605, 212], R2 = 95, BASE1 = 350;
      const S1 = Stage(ui, W1, H1);
      const b1 = { th1: 0, th2: 0, off: 0, w: 0, motor: false, crossed: false, phase: 0, turned: 0, touched: false, aA: 0, dir: 1, prev: 0 };
      const sp1 = pulleySprite(R1), sp2 = pulleySprite(R2);
      let belt1, stat1, band1;
      const build1 = () => {
        belt1 = beltPath(C1, R1, C2, R2, b1.crossed);
        stat1 = S1.layer((x) => {
          ground(x, 40, 820, BASE1); motor(x, C1[0], C1[1]); stand(x, C2, BASE1, 46);
          [[C1, R1], [C2, R2]].forEach(([c, r]) => Ink.hatchShadow(x, geo.ellipse(c[0], c[1], r + 5, r + 5), 1, 7, 7));
          text(x, 'DRIVER pulley', C1[0], 48, { size: 24, align: 'center', color: RD });
          text(x, 'DRIVEN pulley', C2[0], 48, { size: 24, align: 'center', color: GR });
          text(x, b1.crossed ? 'crossed belt' : 'plain belt', (C1[0] + C2[0]) / 2 - 10, b1.crossed ? 108 : 122, { size: 23, font: 'hand', align: 'center' });
          text(x, 'motor', C1[0] - 96, C1[1] - 58, { size: 22, font: 'hand', align: 'center' });
        });
        band1 = S1.layer((x) => beltBand(x, belt1));
      };
      build1();
      const unlocked1 = () => b1.phase === 1 || b1.phase >= 3;
      const advance1 = (d) => {
        b1.th1 += d; b1.th2 += d * (R1 / R2) * (b1.crossed ? -1 : 1); b1.off += d * R1;
        if (b1.phase === 1 || b1.phase === 3) { b1.turned += Math.abs(d); if (b1.turned > TAU * 1.6) tested1(); }
      };
      S1.render = (dt, now) => {
        const x = S1.ctx;
        if (!S1.dragging()) { b1.w += ((b1.motor ? 1.9 : 0) - b1.w) * Math.min(1, dt * 3.5); if (Math.abs(b1.w) < 0.004 && !b1.motor) b1.w = 0; if (b1.w) advance1(b1.w * dt); }
        const moving = Math.abs(b1.w) > 0.12; if (moving) b1.dir = Math.sign(b1.w);
        b1.aA = clamp(b1.aA + (moving ? dt * 6 : -dt * 1.4));
        S1.blit(stat1);
        [[C1, R1, sp1, b1.th1], [C2, R2, sp2, b1.th2]].forEach(([c, r, sp, th]) => { eraseC(x, c, r + 5); spin(x, sp, c, th); });
        S1.blit(band1); beltTicks(x, belt1, b1.off);
        arcArrow(x, C1, R1 + 26, -2.5, 1.5, b1.dir, RD, b1.aA);
        arcArrow(x, C2, R2 + 24, -2.2, 1.0, b1.dir * (b1.crossed ? -1 : 1), GR, b1.aA);
        if (unlocked1() && !b1.touched) { const ph = (now * 0.9) % 1; ring(x, C1, R1 + 10 + ph * 18, { color: RD, w: 2.4, a: 0.8 * (1 - ph) }); text(x, 'turn me!', C1[0], C1[1] + R1 + 44, { size: 23, font: 'hand', color: RD, align: 'center' }); }
        if (!unlocked1()) text(x, 'predict first…', C1[0], C1[1] + R1 + 44, { size: 23, font: 'hand', align: 'center', a: 0.75 });
        return b1.motor || b1.w !== 0 || b1.aA > 0 || S1.dragging() || (unlocked1() && !b1.touched);
      };
      S1.drag({
        hit(px, py) { return unlocked1() && Math.hypot(px - C1[0], py - C1[1]) < R1 + 34 ? 'd' : null; },
        move(t, px, py, first) {
          const a = Math.atan2(py - C1[1], px - C1[0]);
          if (first) { b1.prev = a; b1.touched = true; if (b1.motor) setMotor(false); return; }
          let d = a - b1.prev; if (d > Math.PI) d -= TAU; if (d < -Math.PI) d += TAU; b1.prev = a;
          if (Math.hypot(px - C1[0], py - C1[1]) < 12) return;
          advance1(d); b1.w = b1.w * 0.6 + clamp(d * 60, -4, 4) * 0.4;
        },
      });
      const go1 = ui.el('button', 'btn', '▶ Start the motor'); go1.style.margin = '0 0 14px'; go1.disabled = true;
      function setMotor(on) { b1.motor = on; go1.textContent = on ? '■ Stop the motor' : '▶ Start the motor'; if (on) { b1.touched = true; Book.sfx('click', { gain: 0.5 }); } S1.go(); }
      go1.onclick = () => setMotor(!b1.motor);

      const rPred = ui.record('p07.dir-predict', { label: 'Predict: which way does the driven pulley turn? (plain belt, then crossed belt)', type: 'predict+check', max: 2 });
      const pa = ui.el('div', 'act'); pa.dataset.id = 'p07.dir-predict'; frameAct(pa);
      const qa = ui.el('div', 'q', '', pa), rowA = ui.el('div', 'opts', '', pa);
      const OPT = ['the SAME way as the driver', 'the OPPOSITE way to the driver', 'it depends on the pulley sizes'];
      const WANT = { plain: OPT[0], crossed: OPT[1] }, picks = { plain: null, crossed: null };
      const btnsA = OPT.map((t) => { const b = ui.el('button', 'opt', t, rowA); b.type = 'button'; b.onclick = () => pickA(t); return b; });
      const crossBtn = ui.el('button', 'btn', 'Now cross the belt ▸', pa); crossBtn.style.display = 'none';
      const fbA = ui.el('div', 'fb', '', pa);
      const nDir = ui.box('With a <b>plain belt</b>, both pulleys turn in the <span class="key">same direction</span>.<br>A <b>crossed belt</b> (twisted into a figure of 8) makes them turn in <span class="key">opposite directions</span>.<br><span class="small">Compare that with two meshed gears, which always turn opposite ways.</span>', { tag: 'Notes' });
      lock([nDir], true);
      const verdict = (k) => { const ok = picks[k] === WANT[k]; return `<span style="color:var(--${ok ? 'green' : 'red'})"><b>${k === 'plain' ? 'Plain' : 'Crossed'} belt:</b> you said “${picks[k]}” ${ok ? '✓' : '✗'} ${k === 'plain' ? 'The red spots went round the <b>same way</b>.' : 'Now the driven pulley turns the <b>opposite way</b> to the driver.'}</span>`; };
      const showPhase = () => {
        const p = b1.phase, asking = p === 0 || p === 2, k = p < 2 ? 'plain' : 'crossed';
        qa.innerHTML = p < 2 ? '<b>Predict first.</b> The motor turns the small driver pulley <b>clockwise</b>. With this plain belt, the big driven pulley will turn…'
          : '<b>Predict again.</b> The belt is now <b>crossed</b> into a figure of 8. The driver still turns clockwise. The driven pulley will turn…';
        btnsA.forEach((b) => { b.disabled = !asking; b.classList.toggle('sel', !asking && b.textContent === picks[k]); });
        go1.disabled = !unlocked1(); crossBtn.style.display = 'none';
        if (p === 1 || p === 3) { fbA.className = 'fb on'; fbA.style.color = 'var(--ink)'; fbA.innerHTML = (p === 3 ? verdict('plain') + '<br>' : '') + 'Prediction saved. Now <b>start the motor</b> (or turn the driver pulley round with your finger) and watch the two red spots.'; }
        else if (p === 2) { fbA.className = 'fb on'; fbA.style.color = 'var(--ink)'; fbA.innerHTML = verdict('plain'); }
        else if (p === 4) { const ok = picks.plain === WANT.plain && picks.crossed === WANT.crossed; fbA.style.color = ''; fbA.className = 'fb on ' + (ok ? 'good' : 'bad'); fbA.innerHTML = verdict('plain') + '<br>' + verdict('crossed'); lock([nDir], false); }
        else fbA.className = 'fb';
        S1.go();
      };
      const savePred = (done) => {
        const a = picks.plain === WANT.plain, c = picks.crossed === WANT.crossed;
        rPred.set({ answer: `plain belt: ${picks.plain} ${a ? '✓' : '✗'}` + (picks.crossed ? `; crossed belt: ${picks.crossed} ${c ? '✓' : '✗'}` : ''), correct: picks.crossed ? a && c : null, score: (a ? 1 : 0) + (picks.crossed && c ? 1 : 0), max: 2,
          mis: (!a || (picks.crossed && !c)) ? 'belt-direction' : '', picks: Object.assign({}, picks), stage: b1.phase });
      };
      function pickA(t) {
        if (b1.phase === 0) { picks.plain = t; b1.phase = 1; } else if (b1.phase === 2) { picks.crossed = t; b1.phase = 3; } else return;
        b1.turned = 0; b1.touched = false; Book.scribble(0.12); savePred(); showPhase();
      }
      function tested1() {
        if (b1.phase === 1) {
          b1.phase = 1.5; Book.sfx(picks.plain === WANT.plain ? 'success' : 'error', { gain: 0.3 });
          fbA.className = 'fb on'; fbA.style.color = 'var(--ink)'; fbA.innerHTML = verdict('plain'); crossBtn.style.display = '';
          const it = rPred.get(); if (it) it.stage = 1.5;
        } else if (b1.phase === 3) {
          b1.phase = 4; Book.sfx(picks.crossed === WANT.crossed ? 'success' : 'error', { gain: 0.3 });
          const it = rPred.get(); if (it) it.stage = 4; showPhase();
        }
      }
      crossBtn.onclick = () => { setMotor(false); b1.w = 0; b1.phase = 2; b1.crossed = true; build1(); Book.sfx('paper', { gain: 0.5 }); const it = rPred.get(); if (it) it.stage = 2; showPhase(); S1.wrap.scrollIntoView({ behavior: 'smooth', block: 'center' }); };
      { // come back to a half-finished bench
        const pv = rPred.get();
        if (pv && pv.picks) { Object.assign(picks, pv.picks); const s = pv.stage || 1; b1.phase = s >= 4 ? 4 : picks.crossed ? 3 : s >= 2 ? 2 : s >= 1.5 ? 1.5 : 1; b1.crossed = b1.phase >= 2; if (b1.crossed) build1(); b1.touched = b1.phase === 4; }
        showPhase(); if (b1.phase === 1.5) { fbA.className = 'fb on'; fbA.style.color = 'var(--ink)'; fbA.innerHTML = verdict('plain'); crossBtn.style.display = ''; btnsA.forEach((b) => (b.disabled = true)); }
      }

      const qDir = ui.mcq({
        id: 'p07.dir', label: 'Which belt makes the driven pulley turn the opposite way?',
        q: 'A motor pulley turns <b>clockwise</b>. The roller it drives must turn <b>anticlockwise</b>. Which belt drive does the job? <span class="small">(The bench and its notes blur while you answer.)</span>',
        options: [
          { t: 'A crossed belt, in a figure of 8', ok: true, why: 'Yes: crossing the belt reverses the driven pulley. A plain belt keeps both pulleys turning the same way.' },
          { t: 'A plain belt, in an open loop', mis: 'belt-direction', why: 'A plain belt pulls both pulleys round the same way, so the roller would turn clockwise too.' },
          { t: 'A plain belt on a bigger pulley', mis: 'belt-direction', why: 'Pulley size changes the speed, not the direction. With a plain belt both still turn the same way.' },
          { t: 'A longer belt, in an open loop', mis: 'belt-direction', why: 'A longer belt only lets the shafts sit further apart. Both pulleys would still turn the same way.' },
        ],
      });
      ui.hideWhile(qDir, 'p07.dir', [nDir, S1.wrap, pa]);

      // ================================================================ BENCH 2: JAM IT
      ui.el('h2', '', 'Bench 2: jam it!');
      ui.p('This motor drives a <b>machine</b>. Pick a drive, then make life hard for it: add a <b>heavy load</b>, or <b>jam</b> the machine solid. Watch the motor and its thermometer.');
      const W2 = 860, H2 = 430, CY = 196, M2 = [600, CY], RB = 84, RS = 42, CB = [205, CY], CG = [M2[0] - RB - RS, CY], GOFF = -Math.PI / 24, WD = 1.7;
      const S2 = Stage(ui, W2, H2);
      const b2 = { mode: 'plain', load: 0, th1: 0, th2: 0, off: 0, w2: 0, temp: 0, blockX: 0, stopped: false, hold: 0, heavyT: 0, seen: {}, started: false };
      const SP = {
        plain: [pulleySprite(RS), pulleySprite(RB)], toothed: [pulleySprite(RS, { toothed: true }), pulleySprite(RB, { toothed: true })],
        gear: [gearSprite(RS, 12), gearSprite(RB, 24)],
      };
      const rotor = sprite(280, (x) => { for (let i = 0; i < 4; i++) { x.save(); x.rotate(i * Math.PI / 2); const P = box(RB - 2, -12, 32, 24); fillP(x, P, 'rgba(120,140,235,0.12)'); Ink.hatchFill(x, box(RB + 14, -12, 16, 24), 1, B, 1.5); Ink.stroke(x, closeP(P), { w: 2.2, seed: 51, amp: 0.3 }); x.restore(); } });
      const belt2 = beltPath(CB, RS, M2, RB, false);
      const band2 = S2.layer((x) => beltBand(x, belt2));
      const motorL = S2.layer((x) => { motor(x, CB[0], CB[1]); text(x, 'motor', CB[0] - 96, CB[1] + 86, { size: 22, font: 'hand', align: 'center' });
        const T = geo.rect(CB[0] - 118, 40, 18, 84, 9); eraseP(x, T); Ink.stroke(x, T, { w: 2, seed: 61, amp: 0.3 }); eraseC(x, [CB[0] - 109, 132], 14); Ink.stroke(x, geo.ellipse(CB[0] - 109, 132, 14, 14), { w: 2, seed: 63, amp: 0.3 }); disc(x, [CB[0] - 109, 132], 9, { style: 'rgba(205,40,48,0.85)' });
        for (let i = 0; i < 4; i++) Ink.stroke(x, [[CB[0] - 96, 54 + i * 20], [CB[0] - 88, 54 + i * 20]], { w: 1.4, seed: 65 + i, retrace: false }); });
      const stat2 = S2.layer((x) => {
        ground(x, 30, 830, 350); stand(x, M2, 350, 60);
        const arc = []; for (let i = 0; i <= 40; i++) { const a = 0.5 + (TAU - 1.0) * i / 40 + Math.PI; arc.push([M2[0] + Math.cos(a) * 134, M2[1] + Math.sin(a) * 134]); }
        Ink.stroke(x, arc.filter((p) => p[1] < 350), { w: 2.2, seed: 71, amp: 0.6 });
        text(x, 'MACHINE', M2[0], 36, { size: 24, align: 'center', color: GR });
      });
      const dir2 = () => (b2.mode === 'gear' ? -1 : 1);
      const c1of = () => (b2.mode === 'gear' ? CG : CB);
      const squeal = (x, c, now) => {
        for (let i = 0; i < 5; i++) { const a = -2.6 + i * 0.5 + Math.sin(now * 23 + i) * 0.06, r0 = RS + 14, r1 = RS + 30 + 6 * Math.sin(now * 31 + i * 2);
          Ink.stroke(x, [[c[0] + Math.cos(a) * r0, c[1] + Math.sin(a) * r0], [c[0] + Math.cos(a + 0.07) * (r0 + r1) / 2, c[1] + Math.sin(a + 0.07) * (r0 + r1) / 2], [c[0] + Math.cos(a) * r1, c[1] + Math.sin(a) * r1]], { w: 2, color: RD, seed: 81 + i, amp: 0.2, retrace: false }); }
      };
      S2.render = (dt, now) => {
        const x = S2.ctx, d = dir2(), locked = b2.mode !== 'plain', c1 = c1of();
        if (b2.started) {
          if (b2.load === 2) {
            const stopA = -d * 0.25, rem = mod(d * (stopA - b2.th2), Math.PI / 2);
            if (!b2.stopped) { const st = Math.min(rem, WD * dt * 1.2); b2.th2 += d * st; if (locked) b2.off += st * RB; if (rem - st < 1e-3) { b2.stopped = true; b2.w2 = 0; Book.sfx('thud', { gain: 0.6 }); } }
            else b2.hold += dt;
          } else {
            const slip = b2.mode === 'plain' && b2.load === 1 ? 0.86 + 0.04 * Math.sin(now * 9) : 1;
            b2.w2 += (WD * slip - b2.w2) * Math.min(1, dt * 5); b2.th2 += d * b2.w2 * dt; b2.off += b2.w2 * RB * dt;
            if (b2.load === 1) b2.heavyT += dt;
          }
          if (b2.mode === 'plain') b2.th1 += WD * 2 * dt;
          else if (b2.mode === 'gear') b2.th1 = -(b2.th2 - GOFF) * 2; else b2.th1 = b2.th2 * 2;
          const stalled = locked && b2.load === 2 && b2.stopped, tT = stalled ? 1 : b2.load === 1 ? (locked ? 0.34 : 0.2) : b2.load === 2 ? 0.1 : 0.06;
          b2.temp += clamp(tT - b2.temp, -dt / 2.5, stalled ? dt / 3.2 : dt / 6);
          b2.blockX += ((b2.load === 2 ? 1 : 0) - b2.blockX) * Math.min(1, dt * 18);
          if (b2.load === 2 && b2.stopped) { if (!locked && b2.hold > 1.3) found('plain-jam'); if (locked && b2.temp > 0.8) found(b2.mode + '-jam'); }
          if (b2.load === 1 && b2.heavyT > 1.8) found(b2.mode + '-heavy');
        }
        const stalled = locked && b2.load === 2 && b2.stopped, jx = stalled ? Math.sin(now * 55) * 1.6 : 0, mdx = c1[0] - CB[0];
        S2.blit(stat2); S2.blit(motorL, mdx + jx, 0);
        // thermometer level + heat
        { const tx = c1[0] - 109 + jx, lv = clamp(b2.temp); x.fillStyle = 'rgba(205,40,48,0.85)'; x.fillRect(tx - 4.5, 124 - 76 * lv, 9, 76 * lv + 2);
          if (lv > 0.55) for (let i = 0; i < 3; i++) { const hx = c1[0] - 60 + i * 26, P = []; for (let j = 0; j <= 8; j++) P.push([hx + Math.sin(j * 1.1 + now * 6 + i) * 6, 138 - j * 9 - ((now * 22 + i * 9) % 12)]); x.save(); x.globalAlpha = clamp((lv - 0.55) * 3); Ink.stroke(x, P, { w: 2.2, color: RD, seed: 91 + i, amp: 0.2, retrace: false }); x.restore(); } }
        // the machine
        eraseC(x, M2, RB + 6); spin(x, rotor, M2, b2.th2); spin(x, SP[b2.mode][1], M2, b2.th2 + (b2.mode === 'gear' ? 0 : 0));
        eraseC(x, c1, RS + 6); spin(x, SP[b2.mode][0], c1, b2.th1);
        if (b2.mode !== 'gear') { S2.blit(band2); beltTicks(x, belt2, b2.off + (b2.mode === 'plain' && b2.load === 2 && b2.stopped ? Math.sin(now * 46) * 1.4 : 0), b2.mode === 'toothed'); }
        if (b2.mode === 'plain' && b2.stopped && b2.load === 2) { squeal(x, c1, now); text(x, 'squeeeal!', c1[0] + 4 + Math.sin(now * 30) * 1.5, CY - RS - 44, { size: 25, font: 'hand', color: RD, align: 'center', rot: -0.08 }); }
        if (b2.mode === 'plain' && b2.load === 1 && b2.started) text(x, 'squeak…', c1[0] + 4, CY - RS - 40, { size: 22, font: 'hand', color: RD, align: 'center', a: 0.55 + 0.35 * Math.sin(now * 9) });
        // the jamming block
        if (b2.blockX > 0.02) { const bx = 870 - 172 * b2.blockX, P = box(bx, CY - 15, 190, 30); eraseP(x, P); fillP(x, P, 'rgba(235,90,90,0.16)'); Ink.hatchFill(x, P, 1, RD, 1.4); Ink.stroke(x, closeP(P), { w: 2.6, color: RD, seed: 97, amp: 0.3 }); if (b2.stopped) text(x, 'JAMMED!', 770, CY - 28, { size: 24, color: RD, align: 'center' }); }
        if (b2.load === 1) { const P = box(752, 252, 92, 44); eraseP(x, P); fillP(x, P, 'rgba(120,140,235,0.14)'); Ink.hatchFill(x, P, 1, B, 1.5); Ink.stroke(x, closeP(P), { w: 2.2, seed: 99, amp: 0.3 }); text(x, 'HEAVY', 798, 283, { size: 22, align: 'center' }); }
        text(x, { plain: 'plain belt drive', gear: 'gear train', toothed: 'toothed belt drive' }[b2.mode], 834, 422, { size: 24, align: 'right' });
        if (!b2.started) text(x, 'press “Switch on” to start', 28, 398, { size: 23, font: 'hand', a: 0.8 });
        else {
          const sp = b2.load === 2 ? (b2.stopped ? 0 : null) : Math.round(100 * b2.w2 / WD);
          text(x, 'machine: ' + (sp == null ? '…' : sp === 0 ? 'STOPPED' : sp >= 99 ? 'full speed' : `only about ${Math.round(sp / 2) * 2}% of full speed`), 28, 392, { size: 23, color: sp === 0 || (sp != null && sp < 99) ? RD : B });
          text(x, 'motor: ' + (stalled ? (b2.temp > 0.8 ? 'STALLED and OVERHEATING!' : 'STALLED: it cannot turn!') : b2.temp > 0.28 ? 'turning, working hard' : 'turning, cool'), 28, 422, { size: 23, color: stalled ? RD : B });
        }
        return b2.started;
      };
      S2.go();
      const ctl = ui.el('div', ''); ctl.style.cssText = 'display:grid;grid-template-columns:auto 1fr;gap:8px 12px;align-items:center;margin:0 0 12px';
      const mkRow = (label, items, on) => {
        ui.el('b', '', label, ctl).style.cssText = 'font:700 18px Fredoka';
        const r = ui.el('div', '', '', ctl); r.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px';
        return items.map(([k, t]) => { const b = ui.el('button', 'opt', t, r); b.type = 'button'; b.style.cssText = 'flex:1 1 150px;text-align:center;padding:8px 10px'; b.onclick = () => on(k); b._k = k; return b; });
      };
      const dBtns = mkRow('Drive', [['plain', 'plain belt'], ['gear', 'gear train'], ['toothed', 'toothed belt 🔒']], (k) => setMode(k));
      const lBtns = mkRow('Load', [[0, 'normal load'], [1, 'heavy load'], [2, '✋ JAM IT!']], (k) => setLoad(k));
      const on2 = ui.el('button', 'btn', '▶ Switch on'); on2.style.margin = '0 0 12px';
      const log2 = ui.el('div', 'fb on'); log2.style.cssText = 'color:var(--ink);margin:0 0 var(--R)';
      const FOUND = {
        'plain-heavy': '<b>Plain belt, heavy load:</b> the belt slips a little, so the machine runs slower than it should.',
        'plain-jam': '<b>Plain belt, jammed:</b> the belt slips on the pulley (squeal!). The motor keeps turning and stays cool.',
        'gear-heavy': '<b>Gear train, heavy load:</b> no slip. The machine keeps its full speed and the motor works harder.',
        'gear-jam': '<b>Gear train, jammed:</b> the teeth are locked together, so the motor is stopped dead and overheats.',
        'toothed-heavy': '<b>Toothed belt, heavy load:</b> no slip. The machine keeps its full speed.',
        'toothed-jam': '<b>Toothed belt, jammed:</b> its teeth stop it slipping, so the motor stalls and overheats, just like with gears.',
      };
      const nSlip = ui.box('A plain belt grips its pulleys by <b>friction</b>, so it can <span class="key">slip</span>.<br><b>Slip can be useful:</b> if the machine jams, the belt slips instead of the motor burning out.<br><b>Slip can be a problem:</b> the drive is <b>not exact</b>.<br>A <span class="key">toothed belt</span> runs on toothed pulleys and <b>cannot slip</b>. <span class="small">Used for: a car timing belt, 3D printers.</span>', { tag: 'Notes' });
      lock([nSlip], true);
      const done2 = () => ['plain-jam', 'gear-jam', 'toothed-jam'].every((k) => b2.seen[k]);
      const paint2 = () => {
        const s = b2.seen, tooth = s['plain-jam'] && s['gear-jam'];
        dBtns.forEach((b) => { b.classList.toggle('sel', b._k === b2.mode); if (b._k === 'toothed') { b.disabled = !tooth; b.textContent = tooth ? 'toothed belt' : 'toothed belt 🔒'; } });
        lBtns.forEach((b) => { b.classList.toggle('sel', b._k === b2.load); b.disabled = !b2.started; });
        on2.style.display = b2.started ? 'none' : '';
        const next = !b2.started ? '' : !s['plain-jam'] ? 'Start with the <b>plain belt</b>: press <b>JAM IT!</b> and hold your nerve for a couple of seconds.' : !s['gear-jam'] ? 'Now swap to the <b>gear train</b> and jam it again. Watch the thermometer!' : !s['toothed-jam'] ? 'A new drive is unlocked: try the <b>toothed belt</b>, and jam that too.' : 'All three tested. Try a <b>heavy load</b> on each drive as well if you have not yet.';
        log2.innerHTML = Object.keys(FOUND).filter((k) => s[k]).map((k) => '• ' + FOUND[k]).join('<br>') + (next ? `<div style="color:var(--red);margin-top:4px">➜ ${next}</div>` : '');
        if (done2()) lock([nSlip], false);
      };
      function found(k) { if (b2.seen[k]) return; b2.seen[k] = true; try { sessionStorage.setItem('p07.jam', JSON.stringify(b2.seen)); } catch (e) {} Book.sfx(k.endsWith('jam') && k !== 'plain-jam' ? 'error' : 'pop', { gain: 0.35 }); paint2(); }
      function setMode(k) { if (k === b2.mode) return; b2.mode = k; b2.load = 0; b2.stopped = false; b2.hold = 0; b2.heavyT = 0; b2.temp = 0; b2.w2 = 0; b2.th2 = 0; b2.off = 0; Book.sfx('paper', { gain: 0.4 }); paint2(); S2.go(); }
      function setLoad(k) { if (!b2.started) return; b2.load = k; b2.stopped = false; b2.hold = 0; b2.heavyT = 0; Book.sfx('tick', { gain: 0.5 }); paint2(); }
      on2.onclick = () => { b2.started = true; Book.sfx('click', { gain: 0.5 }); paint2(); S2.go(); };
      try { Object.assign(b2.seen, JSON.parse(sessionStorage.getItem('p07.jam') || '{}')); } catch (e) {}
      if (item('p07.slip')) ['plain-jam', 'gear-jam', 'toothed-jam'].forEach((k) => (b2.seen[k] = true));
      paint2();

      const qSlip = ui.mcq({
        id: 'p07.slip', label: 'Belt slip: when is it useful, and what is a toothed belt for?',
        q: 'Which statement about belts is correct? <span class="small">(The bench and its notes blur while you answer.)</span>',
        options: [
          { t: 'Slip can save a jammed motor; a toothed belt is for drives that must stay exact', ok: true, why: 'Yes: a slipping belt protects the motor, but the drive is not exact. When nothing may slip, use a toothed belt.' },
          { t: 'Slip is always a fault; a toothed belt is for drives that must run more quietly', mis: 'belt-slip', why: 'Slip is not always bad: it protects the motor when a machine jams. A toothed belt is chosen because it cannot slip.' },
          { t: 'Slip can save a jammed motor; a toothed belt is for drives that should slip more', mis: 'belt-slip', why: 'The first half is right, but a toothed belt does the opposite: its teeth mean it cannot slip at all.' },
          { t: 'Plain belts never slip; a toothed belt is only for drives that turn very slowly', mis: 'belt-slip', why: 'Plain belts grip by friction, so they can slip. A toothed belt is the kind that cannot.' },
        ],
      });
      ui.hideWhile(qSlip, 'p07.slip', [nSlip, S2.wrap, log2]);

      // ================================================================ VELOCITY RATIO
      ui.el('h2', '', 'How fast? Velocity ratio');
      ui.p('With gears you counted <b>teeth</b>. Pulleys have no teeth, so you measure their <b>diameters</b> instead.');
      const nVR = ui.box('<b style="font:700 24px Fredoka">velocity ratio = diameter of DRIVEN pulley ÷ diameter of DRIVER pulley</b><br><b style="font:700 24px Fredoka">output speed = input speed ÷ velocity ratio</b><br>Speeds are in <b>rpm</b> (revolutions per minute). Same rule as gears:<br><b>small driver → big driven:</b> slower, but more torque. <b>Big driver → small driven:</b> faster, but less torque.', { tag: 'Notes' });
      ui.p('<b>Worked example.</b> Tap the drawing to watch it.');
      {
        const A1 = [205, 150], A2 = [575, 150], RA = 34, RBg = 102, belt = beltPath(A1, RA, A2, RBg, false);
        const turn = (t) => TAU * ease(clamp((t - 12.6) / 4.6));
        ui.anim({
          w: 860, h: 440, duration: 18.5, poster: 5.4,
          draw(k, t) {
            const th = turn(t);
            k.circle(A1[0], A1[1], RA + 4, 0.2, 0.8, { w: 3 }); k.circle(A1[0], A1[1], 7, 0.8, 1.0, { w: 2, retrace: false });
            k.circle(A2[0], A2[1], RBg + 4, 1.0, 2.0, { w: 3 }); k.circle(A2[0], A2[1], 9, 2.0, 2.2, { w: 2, retrace: false });
            k.circle(A2[0], A2[1], RBg - 12, 2.0, 2.4, { w: 1.4, retrace: false }); k.circle(A1[0], A1[1], RA - 9, 0.9, 1.0, { w: 1.2, retrace: false });
            k.line(belt.P, 2.3, 3.5, { w: 3.4, seed: 11 });
            [[A1, RA, th * 3], [A2, RBg, th]].forEach(([c, r, a], i) => { const s = Math.sin(a), co = Math.cos(a); k.line([[c[0] + s * 9, c[1] - co * 9], [c[0] + s * (r - 12), c[1] - co * (r - 12)]], 3.5, 3.7, { w: 1.8, color: RD, retrace: false, seed: 5 + i }); k.dot(c[0] + s * (r - 8), c[1] - co * (r - 8), 6, 3.6, { color: RD }); });
            k.text('driver', A1[0], 44, 3.7, 4.0, { size: 24, color: RD, align: 'center' });
            k.text('⌀ 40 mm', A1[0], 76, 4.0, 4.4, { size: 24, color: RD, align: 'center' });
            k.text('1500 rpm', A1[0], 232, 4.4, 4.8, { size: 24, color: RD, align: 'center' });
            k.text('driven', A2[0] + 196, 120, 4.8, 5.1, { size: 24, color: GR, align: 'center' });
            k.text('⌀ 120 mm', A2[0] + 196, 152, 5.1, 5.4, { size: 24, color: GR, align: 'center' });
            k.text('velocity ratio = driven ÷ driver = 120 ÷ 40 = 3', 30, 318, 5.9, 8.2, { size: 25 });
            k.text('(3:1)', 716, 318, 8.3, 8.8, { size: 25, color: RD });
            k.text('output speed = input ÷ ratio = 1500 ÷ 3 = 500 rpm', 30, 366, 9.0, 11.6, { size: 25 });
            k.text('500 rpm', A2[0] + 196, 190, 11.7, 12.2, { size: 24, color: GR, align: 'center' });
            if (t > 12.5) { const n = Math.min(3, Math.floor(th * 3 / TAU + 0.02)); k.text(`driver turns: ${n}`, 30, 414, 12.5, 12.9, { size: 25, color: RD }); k.text(`driven turns: ${th >= TAU - 0.01 ? 1 : 0}`, 330, 414, 12.7, 13.1, { size: 25, color: GR }); }
            k.text('slower,', A2[0] + 196, 232, 17.3, 17.7, { size: 24, align: 'center' }); k.text('more torque', A2[0] + 196, 264, 17.7, 18.2, { size: 24, align: 'center' });
          },
          sound(k) {
            const st = (t, d, g = 0.4) => k.play('stroke', t, { material: 'pen', dur: d, gain: g });
            st(0.2, 2.0); st(2.3, 1.2); st(3.7, 1.6); st(5.9, 2.3); st(8.3, 0.5); st(9.0, 2.6); st(11.7, 0.5);
            [0, 1, 2].forEach((i) => k.play('tick', 13.9 + i * 1.25, { gain: 0.5 })); k.play('success', 17.3, { gain: 0.3 });
          },
        });
      }
      const aVR = root.lastElementChild;

      // ---------------------------------------------------------------- calculations
      ui.el('h2', '', 'Your turn: two calculations');
      ui.p('<span class="small">The notes and the worked example blur while you work. Which diameter goes first?</span>');
      const echo = (act, k, word) => { const inp = act.querySelectorAll('input.blank')[k], outs = act.querySelectorAll('.echo'); const upd = () => outs.forEach((o) => (o.textContent = inp.value.trim() || word)); inp.addEventListener('input', upd); upd(); };
      const numeric = (act, idx) => act.querySelectorAll('input.blank').forEach((inp, i) => { if (idx.includes(i)) { inp.inputMode = 'decimal'; inp.style.width = '4.6em'; } else inp.style.width = '6.5em'; });
      const c1 = ui.fill({
        id: 'p07.calc1', label: 'Belt drive: driver 50 mm, driven 200 mm, 1200 rpm → ratio and output speed',
        q: '<b>1.</b> A motor turns at <b>1200&nbsp;rpm</b>. Its <b>driver</b> pulley is <b>50&nbsp;mm</b> across. The belt runs to a <b>driven</b> pulley <b>200&nbsp;mm</b> across.',
        html: 'Velocity ratio = {{200|200mm|200 mm}} ÷ {{50|50mm|50 mm}} = {{4|4.0|4:1}}<br>Output speed = input speed ÷ velocity ratio = 1200 ÷ <b class="echo"></b> = {{300|300.0|300rpm|300 rpm}} rpm',
        explain: 'Velocity ratio = driven ÷ driver = 200 ÷ 50 = <b>4</b> (4:1). Output speed = 1200 ÷ 4 = <b>300 rpm</b>: slower, with more torque.',
      });
      echo(c1, 2, '(your ratio)'); numeric(c1, [0, 1, 2, 3]);
      const c2 = ui.fill({
        id: 'p07.calc2', label: 'Gearing up: driver 120 mm, driven 60 mm, 450 rpm → ratio, speed, faster/less torque',
        q: '<b>2.</b> Now the big pulley does the driving. The <b>driver</b> pulley is <b>120&nbsp;mm</b> across and the <b>driven</b> pulley is <b>60&nbsp;mm</b> across. The driver turns at <b>450&nbsp;rpm</b>.',
        html: 'Velocity ratio = {{60|60mm|60 mm}} ÷ {{120|120mm|120 mm}} = {{0.5|.5|0,5|1/2|½|1:2|0.50}}<br>Output speed = 450 ÷ <b class="echo"></b> = {{900|900.0|900rpm|900 rpm}} rpm<br>So the driven pulley turns {{faster|quicker|fast}} than the driver, but with {{less|lower|smaller|reduced}} torque.',
        explain: 'Velocity ratio = 60 ÷ 120 = <b>0.5</b> (1:2). Output speed = 450 ÷ 0.5 = <b>900 rpm</b>. Faster, but you pay for it with less torque.',
      });
      echo(c2, 2, '(your ratio)'); numeric(c2, [0, 1, 2, 3]);
      ui.hideWhile(c1, 'p07.calc1', [nVR, aVR]); ui.hideWhile(c2, 'p07.calc2', [nVR, aVR]);

      // ================================================================ BELTS v GEARS
      ui.el('h2', '', 'Belt or gears?');
      const nBG = ui.box('<b>Belt drives</b> are quiet and cheap, need no lubrication, can link shafts that are far apart and absorb shocks. But a belt can slip, stretch and wear.<br><b>Gear trains</b> never slip (exact ratio), carry big forces and are compact. But gears are noisier, need lubrication, cost more, and the shafts must be close together.<br><span class="small">Belt drives: pillar drill, washing machine drum, car fan belt, sewing machine, lathe, vacuum cleaner brush.</span>', { tag: 'Notes' });
      ui.p('<span class="small">Read the notes once more: they blur as soon as you start sorting.</span>');
      const sv = ui.sort({
        id: 'p07.versus', label: 'Sort 10 properties: plain belt drive or gear train',
        q: 'Tap a card, then tap the drive it describes.',
        buckets: ['Belt drive (plain belt)', 'Gear train'],
        items: [
          { t: 'runs quietly', b: 0, mis: 'belt-vs-gear' },
          { t: 'links shafts that are far apart', b: 0, mis: 'belt-vs-gear' },
          { t: 'needs no lubrication', b: 0, mis: 'belt-vs-gear' },
          { t: 'slips if the machine jams', b: 0, mis: 'belt-slip' },
          { t: 'cheap, and absorbs shocks', b: 0, mis: 'belt-vs-gear' },
          { t: 'never slips: the ratio is exact', b: 1, mis: 'belt-slip' },
          { t: 'carries very big forces', b: 1, mis: 'belt-vs-gear' },
          { t: 'noisier, and needs oil or grease', b: 1, mis: 'belt-vs-gear' },
          { t: 'the shafts must be close together', b: 1, mis: 'belt-vs-gear' },
          { t: 'compact, but costs more', b: 1, mis: 'belt-vs-gear' },
        ],
        explain: 'All sorted. Belts: quiet, cheap, far apart, but they can slip. Gears: exact and strong, but noisy, oily and close together.',
      });
      ui.hideWhile(sv, 'p07.versus', [nBG, nSlip, S2.wrap, log2, nIntro]);
    },
  });
})();
