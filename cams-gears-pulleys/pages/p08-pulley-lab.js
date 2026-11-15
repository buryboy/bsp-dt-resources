// Page 8 — The pulley lab: set up a pillar drill's stepped cone pulleys for three jobs, lift a crate with a single
// fixed pulley and with a fixed + moving pulley (predict, then measure), then choose the drive for five briefs.
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

  // a plain pulley wheel seen face-on (for the lifting rigs)
  function wheel(r) {
    return sprite(r * 2 + 26, (x) => { disc(x, [0, 0], r + 4, { style: 'rgba(120,140,235,0.10)' }); Ink.stroke(x, geo.ellipse(0, 0, r + 4, r + 4), { w: 2.8, seed: 5 + (r | 0), amp: 0.5 }); ring(x, [0, 0], r - 5, { w: 1.3, a: 0.55 }); hubAndSpot(x, r, { spot: false }); });
  }
  const dashes = (x, a, b, color = B, al = 0.6) => { const d = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(d / 14)); x.save(); x.strokeStyle = rgba(color, al); x.lineWidth = 1.6; x.beginPath(); for (let i = 0; i < n; i++) { const f0 = i / n, f1 = (i + 0.55) / n; x.moveTo(a[0] + (b[0] - a[0]) * f0, a[1] + (b[1] - a[1]) * f0); x.lineTo(a[0] + (b[0] - a[0]) * f1, a[1] + (b[1] - a[1]) * f1); } x.stroke(); x.restore(); };
  const shape = (x, P, o = {}) => { if (o.erase !== false) eraseP(x, P); if (o.shadow) Ink.hatchShadow(x, P, 1, 6, 6); fillP(x, P, o.tint || 'rgba(120,140,235,0.10)'); if (o.hatch) Ink.hatchFill(x, o.hatchP || P, 1, o.color || B, o.hatch); Ink.stroke(x, closeP(P), { w: o.w ?? 2.4, seed: o.seed ?? 7, amp: o.amp ?? 0.4, color: o.color || B }); };

  // ======================================================================================
  Book.page({
    id: 'p08',
    title: 'The pulley lab',
    build(ui, root) {
      ui.h('The pulley lab');
      ui.p('Two machines to set up: a <b>pillar drill</b> that changes speed with its belt, and a <b>hoist</b> that lifts with pulleys.');

      // ================================================================ LAB A: THE PILLAR DRILL
      ui.el('h2', '', 'Lab A: set up the pillar drill');
      ui.p('Lift the belt cover of a pillar drill and you find two <span class="key">stepped cone pulleys</span>: several pulley sizes on each shaft, one cone upside down. The motor always turns at <b>900&nbsp;rpm</b>. To change the spindle speed, you move the belt to another step.');
      const DM = [40, 80, 120, 160], DS = [160, 120, 80, 40], MOTOR = 900, SPEED = DM.map((d, i) => (MOTOR * d) / DS[i]);
      const JOBS = [
        { bit: 25, bw: 18, mat: 'steel', need: 225, html: 'A <b>big 25&nbsp;mm bit</b> into <b>steel</b>. Big bits and hard metals need the <b>SLOWEST</b> speed this drill has.' },
        { bit: 3, bw: 4, mat: 'pine', need: 3600, html: 'A <b>tiny 3&nbsp;mm bit</b> into <b>pine</b>. Small bits and wood need the <b>FASTEST</b> speed this drill has.' },
        { bit: 10, bw: 9, mat: 'aluminium', need: 600, html: 'A <b>10&nbsp;mm bit</b> into <b>aluminium</b>. The chart on the drill says <b>exactly 600&nbsp;rpm</b>. Work it out before you run!' },
      ];
      const IDS = ['p08.drill1', 'p08.drill2', 'p08.drill3'];
      const recs = [
        ui.record(IDS[0], { label: 'Drill job 1: belt step for the SLOWEST speed (25 mm bit in steel)', type: 'lab', max: 1 }),
        ui.record(IDS[1], { label: 'Drill job 2: belt step for the FASTEST speed (3 mm bit in pine)', type: 'lab', max: 1 }),
        ui.record(IDS[2], { label: 'Drill job 3: belt step for exactly 600 rpm (motor 900 rpm)', type: 'lab', max: 1 }),
      ];
      const jobEl = ui.el('div', 'act'); jobEl.dataset.id = 'p08.drill'; frameAct(jobEl);
      const jobQ = ui.el('div', 'q', '', jobEl); jobQ.style.margin = '0';
      const WA = 860, HA = 560, K = 0.85, XS = 540, XM = 750, Y0 = 100, RH = 60, BX = 185, RUNB = [486, 396, 310, 62];
      const SA = Stage(ui, WA, HA);
      const fbD = ui.el('div', 'fb'); fbD.style.margin = '0 0 10px';
      const nextBtn = ui.el('button', 'btn', 'Next job ▸'); nextBtn.style.cssText = 'margin:0 0 14px;display:none';
      const a = { job: 0, row: 2, by: 2, run: null, shown: null, verdict: null, hole: { d: 0, cls: null }, runs: [[], [], []], done: [false, false, false], off: 0, ph: 0, touched: false };
      IDS.forEach((id, j) => { const it = item(id); if (it && it.runs) { a.runs[j] = it.runs.slice(); a.done[j] = !!it.done; } });
      a.job = a.done.indexOf(false); if (a.job < 0) a.job = 3;
      const J = () => JOBS[Math.min(a.job, 2)];
      let statA;
      const buildA = () => {
        statA = SA.layer((x) => {
          const j = J();
          shape(x, box(48, 518, 326, 22), { shadow: true, hatch: 1.5, seed: 3 });                               // base
          shape(x, box(298, 140, 24, 378), { hatch: 1.2, hatchP: box(310, 140, 12, 378), seed: 5 });            // column
          shape(x, box(96, 400, 204, 15), { hatch: 1.2, seed: 9 }); shape(x, box(288, 390, 44, 34), { hatch: 1.6, seed: 11 });   // table + collar
          // the workpiece
          const wp = box(128, 350, 114, 50);
          if (j.mat === 'steel') shape(x, wp, { hatch: 2.1, seed: 13 });
          else if (j.mat === 'aluminium') shape(x, wp, { hatch: 0.7, seed: 13 });
          else { shape(x, wp, { tint: 'rgba(214,160,84,0.22)', seed: 13 }); for (let i = 0; i < 4; i++) Ink.stroke(x, [[132, 359 + i * 11], [170, 356 + i * 11 + (i % 2) * 4], [205, 361 + i * 11], [238, 357 + i * 11]], { w: 1.2, seed: 15 + i, amp: 1.4, retrace: false }); }
          text(x, j.mat, BX, 446, { size: 23, font: 'hand', align: 'center' });
          text(x, `${j.bit} mm bit`, 22, 300, { size: 23, font: 'hand' });
          // motor, head, belt housing with its cover lifted
          const mot = geo.rect(338, 164, 72, 118, 10); shape(x, mot, { shadow: true, seed: 17 }); for (let i = 0; i < 6; i++) Ink.stroke(x, [[348, 184 + i * 16], [400, 184 + i * 16]], { w: 1.4, seed: 19 + i, amp: 0.4, retrace: false });
          text(x, 'motor', 374, 310, { size: 22, font: 'hand', align: 'center' });
          shape(x, geo.rect(128, 150, 222, 80, 10), { shadow: true, hatch: 1.1, hatchP: box(128, 196, 222, 34), seed: 21 });
          shape(x, box(118, 100, 296, 50), { seed: 23, tint: 'rgba(255,255,255,0)' });
          shape(x, [[118, 100], [84, 26], [93, 22], [128, 100]], { hatch: 1.6, seed: 25 });
          text(x, 'cover open', 108, 44, { size: 22, font: 'hand' });
          for (let i = 0; i < 4; i++) { [[BX, DS[i]], [374, DM[i]]].forEach(([cx, d], n) => { const P = box(cx - d * 0.15, 105 + i * 10, d * 0.3, 10); fillP(x, P, 'rgba(120,140,235,0.18)'); Ink.stroke(x, closeP(P), { w: 1.4, seed: 27 + i + n * 5, amp: 0.2, retrace: false }); }); }
          // zoomed view of the cone pulleys
          dashes(x, [414, 100], [432, 22]); dashes(x, [414, 150], [432, 382]);
          Ink.stroke(x, geo.rect(432, 22, 420, 360, 14), { w: 2.4, seed: 31, amp: 0.7 });
          text(x, 'SPINDLE pulley', XS, 54, { size: 24, align: 'center', color: GR }); text(x, 'MOTOR pulley', XM, 54, { size: 24, align: 'center', color: RD });
          text(x, 'driver · 900 rpm', XM, 82, { size: 22, align: 'center', color: RD });
          [[XS, DS, 41], [XM, DM, 51]].forEach(([cx, D, sd]) => {
            Ink.stroke(x, [[cx - 7, Y0 + 4 * RH], [cx - 7, 350]], { w: 2, seed: sd, amp: 0.3 }); Ink.stroke(x, [[cx + 7, Y0 + 4 * RH], [cx + 7, 350]], { w: 2, seed: sd + 1, amp: 0.3 });
            D.forEach((d, i) => { const w = d * K, P = box(cx - w / 2, Y0 + i * RH, w, RH); shape(x, P, { erase: false, hatch: 1.2, hatchP: box(cx + w / 4, Y0 + i * RH, w / 4, RH), seed: sd + 3 + i, w: 2.2 }); text(x, String(d), cx, Y0 + i * RH + 25, { size: 22, align: 'center' }); });
          });
          text(x, 'diameters in mm', (XS + XM) / 2, 373, { size: 22, font: 'hand', align: 'center', a: 0.8 });
        });
      };
      buildA();
      const rowW = (D, f) => { const i = clamp(Math.floor(f), 0, 3), k = clamp(Math.ceil(f), 0, 3), u = f - Math.floor(f); return (D[i] + (D[k] - D[i]) * u); };
      const curl = (x, cx, cy, s, seed, color) => { const P = []; for (let i = 0; i <= 16; i++) { const th = i * 0.55, r = 1.5 + th * 0.9; P.push([cx + Math.cos(th) * r * s, cy - Math.sin(th) * r]); } Ink.stroke(x, P, { w: 1.6, seed, amp: 0.2, retrace: false, color }); };
      SA.render = (dt, now) => {
        const x = SA.ctx, j = J(), free = a.job >= 3;
        a.by += (a.row - a.by) * Math.min(1, dt * 14); if (Math.abs(a.row - a.by) < 0.003) a.by = a.row;
        let f = 0, sv = 0, jx = 0;
        if (a.run) {
          const R = a.run; R.t += dt; const t = R.t;
          sv = clamp(t / 0.5) * (t > 3.0 ? clamp((3.6 - t) / 0.6) : 1);
          f = t < 0.6 ? 0 : t < 2.2 ? ease((t - 0.6) / 1.6) : t < 2.7 ? 1 : 1 - ease(clamp((t - 2.7) / 0.8));
          a.shown = Math.round(R.speed * clamp(t / 0.5));
          a.hole.cls = R.cls; a.hole.d = Math.max(a.hole.d, clamp((45 * f - 20) / 25));
          if (R.cls === 'slow' && f > 0.4 && t < 2.7) jx = Math.sin(now * 48) * 2.6;
          if (t >= 2.2 && !R.done) { R.done = true; commitRun(R); }
          if (t >= 3.6) a.run = null;
          const w = sv * (0.6 + Math.log2(R.speed / 225) * 0.35); a.ph += w * dt * 16; a.off += w * dt * 110;
        }
        SA.blit(statA);
        // the hole and what the speed did to it
        const bw = j.bw + (a.hole.cls === 'slow' ? 6 : 2), dep = 25 * a.hole.d;
        if (dep > 0.5) {
          const P = box(BX - bw / 2, 350, bw, dep); eraseP(x, P); fillP(x, P, 'rgba(30,46,150,0.30)');
          if (a.hole.cls === 'ok') for (let i = 0; i < Math.floor(a.hole.d * 6.01); i++) { const s = i % 2 ? 1 : -1; curl(x, BX + s * (bw / 2 + 9 + (i >> 1) * 15), 343 - (i >> 1) * 2, s, 61 + i); }
          if (a.hole.cls === 'fast') {
            [-1, 1].forEach((s) => { const Q = box(BX + (s < 0 ? -bw / 2 - 16 : bw / 2 + 2), 350, 14, 6 + dep * 0.7); fillP(x, Q, 'rgba(205,40,48,0.20)'); Ink.hatchFill(x, Q, 1, RD, 2); });
            for (let i = 0; i < 3; i++) { const hx = BX - 46 + i * 46 + (i === 1 ? 0 : 0), P2 = []; const live = a.run ? now * 6 : 0; for (let q = 0; q <= 7; q++) P2.push([hx + (i === 1 ? 30 : 0) + Math.sin(q * 1.1 + live + i) * 5, 342 - q * 8]); if (i !== 1 || j.bw < 12) Ink.stroke(x, P2, { w: 2, color: RD, seed: 71 + i, amp: 0.2, retrace: false }); }
          }
          if (a.hole.cls === 'slow') [-1, 1].forEach((s) => { const P2 = []; for (let q = 0; q <= 6; q++) P2.push([BX + s * (bw / 2 + (q % 2 ? 7 : 0)), 350 + (dep * q) / 6]); Ink.stroke(x, P2, { w: 1.8, color: RD, seed: 75 + s, amp: 0.2, retrace: false }); Ink.stroke(x, [[BX + s * (bw / 2 + 2), 350], [BX + s * (bw / 2 + 11), 338]], { w: 1.8, color: RD, seed: 77 + s, amp: 0.2, retrace: false }); Ink.stroke(x, [[BX + s * (bw / 2 + 12), 350], [BX + s * (bw / 2 + 24), 342]], { w: 1.6, color: RD, seed: 79 + s, amp: 0.2, retrace: false }); });
        }
        // quill, chuck and bit
        const fy = 45 * f, cx = BX + jx;
        shape(x, box(cx - 12, 228, 24, 18 + fy), { seed: 81, w: 2 });
        const ch = [[cx - 17, 246 + fy], [cx + 17, 246 + fy], [cx + 11, 272 + fy], [cx - 11, 272 + fy]]; shape(x, ch, { seed: 83, w: 2.2 });
        x.save(); path(x, ch); x.clip(); x.strokeStyle = rgba(B, 0.7); x.lineWidth = 1.6; x.beginPath(); for (let i = -1; i < 4; i++) { const u = cx - 17 + mod(i * 11 + a.ph * 9, 44) - 4; x.moveTo(u, 246 + fy); x.lineTo(u, 272 + fy); } x.stroke(); x.restore();
        const hw = j.bw / 2, bit = [[cx - hw, 272 + fy], [cx + hw, 272 + fy], [cx + hw, 322 + fy], [cx, 330 + fy], [cx - hw, 322 + fy]];
        eraseP(x, bit); fillP(x, bit, a.hole.cls === 'fast' && a.run && f > 0.3 ? 'rgba(205,40,48,0.35)' : 'rgba(120,140,235,0.22)');
        x.save(); path(x, bit); x.clip(); x.strokeStyle = rgba(B, 0.8); x.lineWidth = 1.5; x.beginPath(); for (let i = -2; i < 9; i++) { const v = 266 + fy + mod(i * 9 + a.ph * 9, 72); x.moveTo(cx - hw - 1, v + 5); x.lineTo(cx + hw + 1, v - 5); } x.stroke(); x.restore();
        Ink.stroke(x, closeP(bit), { w: 1.8, seed: 85, amp: 0.2, retrace: false });
        // feed handle
        { const hc = [262, 196], an = f * 2.3; eraseC(x, hc, 11); for (let i = 0; i < 3; i++) { const q = an + 0.5 + i * TAU / 3, e = [hc[0] + Math.cos(q) * 46, hc[1] + Math.sin(q) * 46]; Ink.stroke(x, [hc, e], { w: 2.6, seed: 87 + i, amp: 0.3 }); disc(x, e, 6); } ring(x, hc, 10, { w: 2.2 }); disc(x, hc, 4); }
        // the belt: tiny in the housing, big in the zoomed view
        { const y = 110 + a.by * 10, xl = BX - rowW(DS, a.by) * 0.15 - 2, xr = 374 + rowW(DM, a.by) * 0.15 + 2; x.save(); x.strokeStyle = rgba(B, 0.95); x.lineWidth = 3.2; x.beginPath(); x.moveTo(xl, y); x.lineTo(xr, y); x.stroke(); x.restore(); }
        { const yc = Y0 + a.by * RH + 44, xl = XS - rowW(DS, a.by) * K / 2 - 6, xr = XM + rowW(DM, a.by) * K / 2 + 6, P = geo.rect(xl, yc - 9, xr - xl, 18, 8);
          eraseP(x, P); fillP(x, P, 'rgba(60,76,170,0.26)'); Ink.stroke(x, P, { w: 2.2, seed: 91, amp: 0.3 });
          x.save(); path(x, P); x.clip(); x.strokeStyle = rgba(B, 0.75); x.lineWidth = 1.8; x.beginPath(); for (let u = xl - 30 + mod(-a.off, 26); u < xr + 10; u += 26) { x.moveTo(u + 4, yc - 9); x.lineTo(u - 4, yc + 9); } x.stroke(); x.restore();
          if (!a.touched && !free) { const ph = (now * 0.9) % 1; x.save(); x.strokeStyle = rgba(RD, 0.75 * (1 - ph)); x.lineWidth = 2.4; x.beginPath(); x.roundRect(xl - 4 - ph * 10, yc - 13 - ph * 10, xr - xl + 8 + ph * 20, 26 + ph * 20, 12); x.stroke(); x.restore(); } }
        text(x, 'driven · ' + (a.shown == null ? '? rpm' : a.shown + ' rpm'), XS, 82, { size: 22, align: 'center', color: GR });
        // RUN button + read-out
        { const [bx, by2, bw2, bh] = RUNB, P = geo.rect(bx, by2, bw2, bh, 14), busy = !!a.run, off = free || a.done[a.job];
          if (!off && !busy) Ink.hatchShadow(x, P, 1, 6, 6, GR); fillP(x, P, off || busy ? 'rgba(120,140,235,0.08)' : 'rgba(70,180,110,0.22)'); Ink.stroke(x, P, { w: 2.8, seed: 93, color: off || busy ? B : GR, amp: 0.5 });
          text(x, free ? '✓ all three jobs done' : off ? '✓ job done' : busy ? 'drilling…' : '▶ RUN the drill', bx + bw2 / 2, by2 + 40, { size: 27, align: 'center', color: off || busy ? B : GR, a: off || busy ? 0.6 : 0.95 }); }
        text(x, 'spindle speed: ' + (a.shown == null ? '? (press RUN)' : a.shown + ' rpm'), 641, 502, { size: 25, align: 'center' });
        if (a.verdict) text(x, a.verdict.t, 641, 540, { size: 27, align: 'center', color: a.verdict.ok ? GR : RD });
        if (!a.touched && !free) text(x, 'tap a step to move the belt', 641, 540, { size: 23, font: 'hand', align: 'center', color: RD });
        return !!a.run || a.by !== a.row || (!a.touched && !free);
      };
      const showJob = () => {
        if (a.job >= 3) { jobQ.innerHTML = '<b>All three jobs done.</b> The drill is set up three different ways with one motor and one belt.'; nextBtn.style.display = 'none'; lockAll(); return; }
        jobQ.innerHTML = `<b>Job ${a.job + 1} of 3.</b> ${J().html}<br><span class="small">Tap a step on the cone pulleys to move the belt, then press RUN. <b>Only your first RUN on each job scores</b>, so think first!</span>`;
      };
      function commitRun(R) {
        const jn = a.job, j = JOBS[jn], runs = a.runs[jn]; runs.push(R.row);
        const ok = R.cls === 'ok', n = runs.length, firstOK = SPEED[runs[0]] === j.need, mis = [];
        runs.forEach((r) => { if (SPEED[r] === j.need) return; if (jn === 0 && r === 3) mis.push('big-is-fast'); if (jn === 1 && r === 0) mis.push('big-is-fast'); if (jn === 2 && r === 2) mis.push('ratio-upside-down', 'speed-multiply'); });
        const fin = ok || n >= 3;
        recs[jn].set({ answer: runs.map((r, k) => `run ${k + 1}: motor ⌀${DM[r]} → spindle ⌀${DS[r]} = ${SPEED[r]} rpm ${SPEED[r] === j.need ? '✓' : '✗'}`).join('; '), correct: firstOK, score: firstOK ? 1 : 0, max: 1, mis: [...new Set(mis)].join(','), runs: runs.slice(), done: fin });
        Book.sfx(ok ? 'success' : 'error', { gain: 0.35 });
        a.verdict = { ok, t: ok ? 'CLEAN HOLE ✓' : R.cls === 'fast' ? 'TOO FAST: it burns!' : 'TOO SLOW: it chatters!' };
        const best = SPEED.indexOf(j.need), sp = R.speed;
        const M = [
          [`<b>${sp} rpm</b> ✓ Slow and steady: a clean hole, with plenty of torque to turn the big bit.`, `<b>${sp} rpm</b> ✗ Too fast for a big bit in steel: it overheats and burns. Which step makes the spindle turn <b>slowest</b>?`],
          [`<b>${sp} rpm</b> ✓ Flat out: the tiny bit cuts the pine cleanly.`, `<b>${sp} rpm</b> ✗ Too slow for a tiny bit in wood: it chatters and tears the grain. Which step makes the spindle turn <b>fastest</b>?`],
          [`<b>${sp} rpm</b> ✓ Exactly right. Velocity ratio = 120 ÷ 80 = 1.5, and 900 ÷ 1.5 = 600&nbsp;rpm.`, `<b>${sp} rpm</b> ✗ ${sp > 600 ? 'Too fast' : 'Too slow'}: the chart says 600&nbsp;rpm. Velocity ratio = <b>driven</b> ÷ <b>driver</b>, then <b>divide</b> the motor speed by it.`],
        ][jn];
        fbD.className = 'fb on ' + (ok ? 'good' : 'bad');
        fbD.innerHTML = M[ok ? 0 : 1] + (ok ? (n > 1 ? ` <span style="color:var(--ink)">(Run ${n}: only the first run scored.)</span>` : '') : fin ? `<br><span style="color:var(--ink)">That was run 3. The right step was motor <b>⌀${DM[best]}</b> driving spindle <b>⌀${DS[best]}</b>: ${j.need}&nbsp;rpm.</span>` : ` <span style="color:var(--ink)">Move the belt and run again.</span>`);
        if (fin) { a.done[jn] = true; nextBtn.textContent = jn < 2 ? 'Next job ▸' : 'Finish the drill lab ▸'; nextBtn.style.display = ''; }
      }
      nextBtn.onclick = () => { a.job++; a.hole = { d: 0, cls: null }; a.verdict = null; a.shown = null; a.run = null; nextBtn.style.display = 'none'; fbD.className = 'fb'; buildA(); showJob(); Book.sfx('paper', { gain: 0.4 }); SA.go(); if (a.job < 3) jobEl.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
      SA.drag({
        hit(px, py) {
          if (a.run || a.job >= 3) return null;
          if (!a.done[a.job] && px > RUNB[0] && px < RUNB[0] + RUNB[2] && py > RUNB[1] - 6 && py < RUNB[1] + RUNB[3] + 6) return 'run';
          if (!a.done[a.job] && px > 436 && px < 850 && py > Y0 && py < Y0 + 4 * RH) return 'r' + Math.floor((py - Y0) / RH);
          return null;
        },
        move(t, px, py, first) {
          if (!first) return; a.touched = true;
          if (t === 'run') { const sp = SPEED[a.row], need = J().need; a.hole = { d: 0, cls: null }; a.verdict = null; a.run = { t: 0, row: a.row, speed: sp, cls: sp === need ? 'ok' : sp > need ? 'fast' : 'slow' }; fbD.className = 'fb'; Book.sfx('click', { gain: 0.5 }); }
          else { const r = +t.slice(1); if (r !== a.row) { a.row = r; a.shown = null; a.verdict = null; a.hole = { d: 0, cls: null }; Book.sfx('tick', { gain: 0.6 }); } }
        },
      });
      SA.go();
      const nDrill = ui.box('A <span class="key">stepped cone pulley</span> has several pulley sizes on each shaft. Moving the belt to another step changes the speed: quick, and no tools needed.<br><b>Smallest driver → biggest driven:</b> the slowest speed, with the most torque. <b>Biggest driver → smallest driven:</b> the fastest speed, with the least torque.<br><b>Big drill bits and hard metals</b> need a <b>slow</b> speed. <b>Small bits and wood</b> need a <b>fast</b> speed.', { tag: 'Notes' });

      // ================================================================ LAB B: LIFTING
      ui.el('h2', '', 'Lab B: lifting with pulleys');
      ui.p('Pulleys do not only pass on rotation. With a rope, they <b>lift</b>. Here are two ways to hoist the same <b>200&nbsp;N</b> crate.');
      const WB = 860, HB = 578, FLOOR = 505, GY0 = 250, PMAX = 200, CW = 96, CH = 76, FY = 120;
      const RIG = [{ cx: 150, F: [192, FY], RF: 42, gx: 234, k: 1, N: 200, mid: 190 }, { cx: 560, F: [636, FY], RF: 38, RM: 38, gx: 674, k: 0.5, N: 100, mid: 610 }];
      const SB = Stage(ui, WB, HB);
      const bs = { pull: [0, 0], unlocked: false, touched: [false, false], full: [false, false], tested: false, off: 0, step: [0, 0] };
      const wF = [wheel(42), wheel(38)], wM = wheel(38);
      const statB = SB.layer((x) => {
        shape(x, box(40, 44, 780, 20), { hatch: 1.6, shadow: true, seed: 3 });
        ground(x, 40, 820, FLOOR);
        text(x, '1 · single fixed pulley', RIG[0].mid, 30, { size: 24, align: 'center' }); text(x, '2 · fixed + moving pulley', RIG[1].mid, 30, { size: 24, align: 'center' });
        RIG.forEach((r, i) => { Ink.stroke(x, [[r.F[0] - 7, 64], [r.F[0] - 7, r.F[1]]], { w: 2.2, seed: 11 + i, amp: 0.3 }); Ink.stroke(x, [[r.F[0] + 7, 64], [r.F[0] + 7, r.F[1]]], { w: 2.2, seed: 13 + i, amp: 0.3 }); });
        const ax = RIG[1].cx - RIG[1].RM; Ink.stroke(x, geo.ellipse(ax, 70, 6, 6), { w: 2.2, seed: 17, amp: 0.2 });
      });
      const crate = sprite(140, (x) => {
        const P = box(-CW / 2, -CH / 2, CW, CH); Ink.hatchShadow(x, P, 1, 6, 6); fillP(x, P, 'rgba(214,160,84,0.20)'); Ink.stroke(x, closeP(P), { w: 2.6, seed: 21, amp: 0.5 });
        Ink.stroke(x, [[-CW / 2 + 12, -CH / 2], [-CW / 2 + 12, CH / 2]], { w: 1.6, seed: 23, retrace: false }); Ink.stroke(x, [[CW / 2 - 12, -CH / 2], [CW / 2 - 12, CH / 2]], { w: 1.6, seed: 25, retrace: false });
        Ink.stroke(x, [[-CW / 2 + 12, CH / 2 - 4], [CW / 2 - 12, -CH / 2 + 4]], { w: 1.4, seed: 27, retrace: false, amp: 0.4 });
        const L = box(-34, -15, 68, 30); eraseP(x, L); fillP(x, L, 'rgba(255,255,255,0.6)'); text(x, '200 N', 0, 9, { size: 24, align: 'center' });
      });
      const rope = (x, P, seed) => Ink.stroke(x, P, { w: 3.2, seed, amp: 0.35 });
      const arcP = (c, r, a0, a1) => { const P = []; for (let i = 0; i <= 18; i++) { const q = a0 + (a1 - a0) * i / 18; P.push([c[0] + Math.cos(q) * r, c[1] + Math.sin(q) * r]); } return P; };
      SB.render = (dt, now) => {
        const x = SB.ctx; SB.blit(statB);
        RIG.forEach((r, i) => {
          const pull = bs.pull[i], rise = pull * r.k, top = FLOOR - CH - rise, gy = GY0 + pull, hookY = top - 16;
          if (rise > 3) { const G = box(r.cx - CW / 2, FLOOR - CH, CW, CH); for (let s = 0; s < 4; s++) dashes(x, G[s], G[(s + 1) % 4], B, 0.4); }
          if (pull > 3) dashes(x, [r.gx - 34, GY0], [r.gx + 34, GY0], RD, 0.6);
          // sling + crate
          Ink.stroke(x, [[r.cx - 30, top], [r.cx, hookY], [r.cx + 30, top]], { w: 2.2, seed: 31 + i, amp: 0.3 });
          x.save(); x.translate(r.cx, top + CH / 2); x.drawImage(crate, -70, -70, 140, 140); x.restore();
          if (i === 0) rope(x, [[r.cx, r.F[1]], [r.cx, hookY]], 41);
          else {
            const my = top - 62, M = [r.cx, my], ax = r.cx - r.RM;
            rope(x, [[ax, 76], [ax, my]], 43); rope(x, [[r.F[0] - r.RF, r.F[1]], [r.cx + r.RM, my]], 45);
            eraseC(x, M, r.RM + 4); spin(x, wM, M, (-rise) / r.RM); rope(x, arcP(M, r.RM, Math.PI, 0), 47);
            Ink.stroke(x, [[r.cx, my + 6], [r.cx, hookY]], { w: 3, seed: 49, amp: 0.2 }); ring(x, [r.cx, hookY], 5, { w: 2.2 });
          }
          eraseC(x, r.F, r.RF + 4); spin(x, wF[i], r.F, pull / r.RF); rope(x, arcP(r.F, r.RF, Math.PI, TAU), 51 + i);
          // rope down to the force meter and the handle
          rope(x, [[r.gx, r.F[1]], [r.gx, gy - 92]], 53 + i);
          const mb = geo.rect(r.gx - 14, gy - 92, 28, 58, 8); shape(x, mb, { tint: 'rgba(255,255,255,0.5)', seed: 55 + i, w: 2 });
          for (let q = 0; q < 5; q++) { x.strokeStyle = rgba(B, 0.7); x.lineWidth = 1.3; x.beginPath(); x.moveTo(r.gx + 3, gy - 82 + q * 10); x.lineTo(r.gx + 10, gy - 82 + q * 10); x.stroke(); }
          const F = bs.unlocked && pull > 3 ? r.N : 0, py = gy - 82 + (F / 200) * 40;
          x.strokeStyle = rgba(RD, 0.95); x.lineWidth = 3; x.beginPath(); x.moveTo(r.gx - 9, py); x.lineTo(r.gx + 2, py); x.stroke();
          Ink.stroke(x, [[r.gx, gy - 34], [r.gx, gy - 20]], { w: 3, seed: 57 + i, amp: 0.2 });
          const gp = [r.gx, gy], col = bs.unlocked ? RD : B;
          eraseC(x, gp, 22); disc(x, gp, 22, { style: bs.unlocked ? 'rgba(235,80,80,0.22)' : 'rgba(120,140,235,0.12)' });
          x.save(); x.beginPath(); x.arc(gp[0], gp[1], 22, 0, 7); x.clip(); Ink.hatchFill(x, box(gp[0] - 22, gp[1], 44, 22), 1, col, 1.3); x.restore();
          ring(x, gp, 22, { color: col, w: 2.8 }); ring(x, gp, 6, { color: col, w: 2 });
          if (bs.unlocked) {
            if (!bs.touched[i]) { const ph = (now * 0.9 + i * 0.5) % 1; ring(x, gp, 26 + ph * 16, { color: RD, w: 2.4, a: 0.8 * (1 - ph) }); text(x, 'pull down', r.gx + 34, gy + 8, { size: 23, font: 'hand', color: RD }); }
            text(x, `effort: ${F} N`, r.gx + 26, gy - 54, { size: 25, color: RD });
            text(x, `rope pulled: ${(pull / 200).toFixed(2)} m`, r.mid, 540, { size: 23, align: 'center', color: RD });
            text(x, `crate rose: ${(rise / 200).toFixed(2)} m`, r.mid, 570, { size: 23, align: 'center' });
          } else if (i === 0) text(x, 'predict first…', 430, 300, { size: 23, font: 'hand', align: 'center', a: 0.75 });
        });
        return SB.dragging() || (bs.unlocked && (!bs.touched[0] || !bs.touched[1]));
      };
      SB.drag({
        hit(px, py) { if (!bs.unlocked) return null; for (let i = 0; i < 2; i++) { const gy = GY0 + bs.pull[i]; if (Math.abs(px - RIG[i].gx) < 58 && py > gy - 100 && py < gy + 60) return i; } return null; },
        move(i, px, py, first) {
          if (first) { bs.off = py - bs.pull[i]; bs.touched[i] = true; }
          const p = clamp(py - bs.off, 0, PMAX); bs.pull[i] = p;
          const st = Math.floor(p / 25); if (st !== bs.step[i]) { bs.step[i] = st; Book.sfx('tick', { gain: 0.35 }); }
          if (p >= PMAX - 2 && !bs.full[i]) { bs.full[i] = true; Book.sfx('tock', { gain: 0.4 }); if (bs.full[0] && bs.full[1] && !bs.tested) testedB(true); }
        },
      });
      SB.go();
      const fbB = ui.el('div', 'fb'); fbB.style.margin = '0 0 var(--R)';
      const rLP = ui.record('p08.lift-predict', { label: 'Predict the effort to lift 200 N: single fixed pulley, then fixed + moving', type: 'predict+check', max: 2 });
      const pb = ui.el('div', 'act'); pb.dataset.id = 'p08.lift-predict'; frameAct(pb);
      const pk = { one: null, two: null }, NOPT = ['50 N', '100 N', '200 N', '400 N'];
      const mkRow = (key, q) => {
        ui.el('div', 'q', q, pb); const r = ui.el('div', 'opts', '', pb); r.style.cssText = 'grid-template-columns:repeat(4,1fr);margin-bottom:12px';
        NOPT.forEach((t) => { const b = ui.el('button', 'opt', t, r); b.type = 'button'; b.style.cssText = 'text-align:center;padding:8px 4px';
          b.onclick = () => { r.querySelectorAll('.opt').forEach((o) => o.classList.remove('sel')); b.classList.add('sel'); pk[key] = t; Book.scribble(0.12); goB.disabled = !(pk.one && pk.two); }; });
        return r;
      };
      const row1 = mkRow('one', '<b>Predict first.</b> The crate weighs <b>200&nbsp;N</b>. With rig 1 (one fixed pulley), the <b>effort</b> you need on the rope will be…');
      const row2 = mkRow('two', '…and with rig 2 (a fixed pulley, plus a <b>moving</b> pulley hooked to the crate), the effort will be…');
      const goB = ui.el('button', 'btn', 'Unlock the ropes ▸', pb); goB.disabled = true; goB.style.marginTop = '0';
      const unlockB = () => { bs.unlocked = true; [[row1, 'one'], [row2, 'two']].forEach(([r, k]) => r.querySelectorAll('.opt').forEach((o) => { o.disabled = true; o.classList.toggle('sel', o.textContent === pk[k]); })); goB.style.display = 'none'; SB.go(); };
      function testedB(fresh) {
        bs.tested = true; const o1 = pk.one === '200 N', o2 = pk.two === '100 N', sc = (o1 ? 1 : 0) + (o2 ? 1 : 0);
        const ln = (ok, s) => `<span style="color:var(--${ok ? 'green' : 'red'})">${s}</span>`;
        fbB.className = 'fb on'; fbB.style.color = 'var(--ink)';
        fbB.innerHTML = `<b>${sc}/2 predicted.</b><br>` + ln(o1, `<b>Rig 1:</b> you said ${pk.one} ${o1 ? '✓' : '✗'} The meter read <b>200&nbsp;N</b>: the same as the load. The fixed pulley only turned your pull round, so pulling <b>down</b> lifts the crate <b>up</b>. 1.00&nbsp;m of rope lifted it 1.00&nbsp;m.`) + '<br>' +
          ln(o2, `<b>Rig 2:</b> you said ${pk.two} ${o2 ? '✓' : '✗'} The meter read <b>100&nbsp;N</b>: two ropes hold up the moving pulley, so each carries half the load. The catch: 1.00&nbsp;m of rope lifted the crate only 0.50&nbsp;m.`);
        if (fresh) { Book.sfx(sc === 2 ? 'success' : 'error', { gain: 0.35 }); const it = rLP.get(); if (it) it.tested = true; }
        relock();
      }
      goB.onclick = () => {
        if (!(pk.one && pk.two)) return; const o1 = pk.one === '200 N', o2 = pk.two === '100 N';
        rLP.set({ answer: `single fixed pulley: ${pk.one} ${o1 ? '✓' : '✗ (200 N)'}; fixed + moving: ${pk.two} ${o2 ? '✓' : '✗ (100 N)'}`, correct: o1 && o2, score: (o1 ? 1 : 0) + (o2 ? 1 : 0), max: 2,
          mis: parseInt(pk.one, 10) < 200 ? 'pulley-lift' : '', pick: Object.assign({}, pk) });
        unlockB(); Book.sfx('pop', { gain: 0.4 });
        fbB.className = 'fb on'; fbB.style.color = 'var(--ink)'; fbB.innerHTML = '<b>Ropes unlocked.</b> Drag each red handle <b>all the way down</b>. Watch the force meter, and compare how much rope you pull with how far the crate rises.';
        SB.wrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
      };

      const fl = ui.fill({
        id: 'p08.lift', label: 'Lifting a 600 N engine 2 m: effort and rope pulled (fixed pulley; fixed + moving)',
        q: 'Use what you measured. A garage must lift an <b>engine weighing 600&nbsp;N</b> up by <b>2&nbsp;m</b>.',
        html: '<b>With a single fixed pulley:</b> effort = {{600|600n|600 n|600.0}} N, and the mechanic pulls {{2|2m|2 m|2.0|2.00}} m of rope.<br><b>With a fixed + a moving pulley:</b> effort = {{300|300n|300 n|300.0}} N, and the mechanic pulls {{4|4m|4 m|4.0|4.00}} m of rope.',
        explain: 'Fixed pulley: effort = load = <b>600 N</b>, rope = lift = <b>2 m</b>. Add a moving pulley: half the effort (<b>300 N</b>), but twice the rope (<b>4 m</b>).',
      });
      fl.querySelectorAll('input.blank').forEach((inp) => { inp.inputMode = 'decimal'; inp.style.width = '4.6em'; });
      const nLift = ui.box('A <span class="key">single fixed pulley</span> only changes the <b>direction</b> of the force: pull down to lift up. Effort = load, so its mechanical advantage is <b>1</b>. <span class="small">Used on: a flagpole, a window blind.</span><br>Adding <span class="key">one moving pulley</span> (two ropes holding the load) <b>halves the effort</b>: mechanical advantage <b>2</b>. But you must pull <b>twice as much rope</b>. <span class="small">Used in: the block and tackle on cranes, engine hoists, sailing boats.</span><br>More force, less movement: you never get something for nothing.', { tag: 'Notes' });

      // ================================================================ CHOOSE THE DRIVE
      ui.el('h2', '', 'Choose the drive');
      ui.p('Five design briefs, five drives. <span class="small">Every set of notes on this page blurs until all five are matched.</span>');
      const mt = ui.match({
        id: 'p08.choose', label: 'Choose the drive for 5 design briefs',
        q: 'Tap a <b>design brief</b>, then tap the best <b>drive</b> for it.',
        pairs: [
          ['A clock: its hands must keep exact time for years, inside a small case', 'gear train', 'belt-vs-gear'],
          ['A washing-machine drum, turned quietly by a motor 40 cm away', 'plain belt and two pulleys', 'belt-slip'],
          ['A 3D printer axis, driven from a motor some way off, that must never slip', 'toothed belt', 'belt-slip'],
          ['A pillar drill whose speed must be quick and easy to change', 'stepped cone pulleys and a belt', 'belt-vs-gear'],
          ['A flagpole: pull down on the rope and the flag goes up', 'single fixed pulley', 'pulley-lift'],
        ],
      });
      mt.querySelector('.pairs').style.gridTemplateColumns = '1.75fr 1fr';
      mt.querySelectorAll('.pairs .card b').forEach((b) => (b.style.cssText = 'font:inherit;font-weight:400'));

      // ---------------------------------------------------------------- what is blurred when
      const fin = (id) => { const it = item(id); return !!it && (it.correct === true || it.attempts >= 3); };
      const chooseDone = () => { const it = item('p08.choose'); return !!it && it.correct != null; };
      let choosing = false;
      function relock() {
        const busy = choosing && !chooseDone();
        nDrill.classList.toggle('peek-lock', a.job < 3 || busy);
        nLift.classList.toggle('peek-lock', !fin('p08.lift') || busy);
        [fbD, fbB].forEach((e) => e.classList.toggle('peek-lock', busy));
        fl.classList.toggle('peek-lock', !bs.tested);
      }
      function lockAll() { relock(); }
      fl.querySelector('button.btn').addEventListener('click', () => {
        const it = item('p08.lift'); if (!it) return; const v = String(it.answer || '').split(' | ').map((s) => parseFloat(s)), m = [];
        if (v[0] !== 600) m.push('pulley-lift'); if (v[3] !== 4 || v[1] !== 2) m.push('speed-torque'); it.mis = it.correct ? '' : m.join(',');
        relock();
      });
      mt.addEventListener('pointerdown', () => { if (!chooseDone()) { choosing = true; relock(); } }, { passive: true });
      mt.addEventListener('click', () => setTimeout(relock, 60));
      { const pv = rLP.get(); if (pv && pv.pick) { Object.assign(pk, pv.pick); unlockB(); if (pv.tested) { bs.pull = [PMAX, PMAX]; bs.touched = [true, true]; bs.full = [true, true]; testedB(false); } else { fbB.className = 'fb on'; fbB.style.color = 'var(--ink)'; fbB.innerHTML = '<b>Ropes unlocked.</b> Drag each red handle <b>all the way down</b> and watch the force meter.'; } } }
      showJob(); relock();
    },
  });
})();
