(function () {
  'use strict';
  const B = Ink.BLUE, RD = Ink.RED, GR = Ink.GREEN, rgba = Ink.rgba, geo = Ink.geo;
  const HANDF = (s) => `400 ${s}px "Gloria Hallelujah", "Comic Sans MS", cursive`;
  const LABF = (s) => `600 ${s}px Fredoka, "Arial Rounded MT Bold", system-ui, sans-serif`;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const TAU = Math.PI * 2;
  const unit = (to, from) => { const dx = to[0] - from[0], dy = to[1] - from[1], d = Math.hypot(dx, dy) || 1; return [dx / d, dy / d]; };
  const add = (p, u, k) => [p[0] + u[0] * k, p[1] + u[1] * k];
  const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
  // solve f(v) = target for a monotonic f on [lo, hi]
  const bisect = (f, target, lo, hi) => { const up = f(hi) > f(lo); for (let i = 0; i < 34; i++) { const m = (lo + hi) / 2; if ((f(m) < target) === up) lo = m; else hi = m; } return (lo + hi) / 2; };

  // ---------- small drawing helpers (all in blue biro) ----------
  function text(x, s, px, py, o = {}) {
    x.save(); let size = o.size || 22; const f = o.font === 'hand' ? HANDF : LABF; x.font = f(size);
    if (o.max) while (size > 16 && x.measureText(s).width > o.max) { size--; x.font = f(size); }
    x.fillStyle = rgba(o.color || B, o.a ?? 0.92); x.textAlign = o.align || 'left'; x.textBaseline = 'alphabetic';
    x.fillText(s, px, py); x.restore();
  }
  const path = (x, P) => { x.beginPath(); P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.closePath(); };
  const eraseP = (x, P) => { x.save(); x.globalCompositeOperation = 'destination-out'; x.fillStyle = '#000'; path(x, P); x.fill(); x.restore(); };
  const eraseC = (x, p, r) => { x.save(); x.globalCompositeOperation = 'destination-out'; x.fillStyle = '#000'; x.beginPath(); x.arc(p[0], p[1], r, 0, 7); x.fill(); x.restore(); };
  const fillP = (x, P, style) => { x.save(); x.fillStyle = style; path(x, P); x.fill(); x.restore(); };
  const box = (x0, y0, w, h) => [[x0, y0], [x0 + w, y0], [x0 + w, y0 + h], [x0, y0 + h]];
  const closeP = (P) => P.concat([P[0]]);
  const ring = (x, p, r, o = {}) => { x.save(); x.strokeStyle = rgba(o.color || B, o.a ?? 0.95); x.lineWidth = o.w ?? 2.4; x.beginPath(); x.arc(p[0], p[1], r, 0, 7); x.stroke(); x.restore(); };
  const disc = (x, p, r, o = {}) => { x.save(); x.fillStyle = rgba(o.color || B, o.a ?? 0.95); x.beginPath(); x.arc(p[0], p[1], r, 0, 7); x.fill(); x.restore(); };
  const TINT = { blue: 'rgba(120,140,235,0.13)', red: 'rgba(235,90,90,0.16)', green: 'rgba(70,180,110,0.18)' };

  // a rigid bar from pivot A to pivot Bp, drawn in its own frame so the ink never shimmers or stretches
  function bar(x, A, Bp, o = {}) {
    const w = o.w ?? 20, e0 = o.ext0 ?? w / 2 + 3, e1 = o.ext1 ?? w / 2 + 3, L = dist(A, Bp);
    x.save(); x.translate(A[0], A[1]); x.rotate(Math.atan2(Bp[1] - A[1], Bp[0] - A[0]));
    const P = geo.rect(-e0, -w / 2, L + e0 + e1, w, w / 2 - 0.5);
    eraseP(x, P); fillP(x, P, o.tint || TINT.blue);
    if (o.hatch !== false) { x.save(); path(x, P); x.clip(); Ink.hatchFill(x, box(-e0, 1, L + e0 + e1, w / 2), 1, o.color || B, o.density ?? 0.8); x.restore(); }
    Ink.stroke(x, P, { w: o.lw ?? 2.2, seed: o.seed ?? 7, color: o.color || B, amp: 0.5 });
    x.restore();
  }
  // moving pivot = open circle
  function movPivot(x, p, r = 7.5) { eraseC(x, p, r); ring(x, p, r, { w: 2.4 }); }
  // fixed pivot = a pin through a hatched base block (base goes under the bars, pin on top)
  function baseBlock(x, p, s = 50) {
    const P = box(p[0] - s / 2, p[1] - s / 2, s, s);
    Ink.hatchShadow(x, P, 1, 5, 5); Ink.hatchFill(x, P, 1, B, 1.7); Ink.stroke(x, closeP(P), { w: 2.2, seed: 31, amp: 0.5 });
  }
  function pin(x, p) { eraseC(x, p, 9); ring(x, p, 9, { w: 2.2 }); disc(x, p, 5); }
  // a guide the bar slides through: two little hatched blocks
  function guide(x, g, vertical, gap = 13) {
    [-1, 1].forEach((s) => {
      const P = vertical ? box(g[0] + (s < 0 ? -gap - 14 : gap), g[1] - 17, 14, 34) : box(g[0] - 17, g[1] + (s < 0 ? -gap - 14 : gap), 34, 14);
      Ink.hatchFill(x, P, 1, B, 1.7); Ink.stroke(x, closeP(P), { w: 1.9, seed: 41 + s, amp: 0.4 });
    });
  }
  // the track a slider runs in: two thin hatched rails either side of the line a -> b
  function rail(x, a, b, half) {
    const vert = Math.abs(a[0] - b[0]) < 1;
    [-1, 1].forEach((s) => {
      const P = vert ? box(a[0] + (s < 0 ? -half - 9 : half), Math.min(a[1], b[1]), 9, Math.abs(b[1] - a[1])) : box(Math.min(a[0], b[0]), a[1] + (s < 0 ? -half - 9 : half), Math.abs(b[0] - a[0]), 9);
      Ink.hatchFill(x, P, 1, B, 1.8); Ink.stroke(x, closeP(P), { w: 1.8, seed: 43 + s, amp: 0.4 });
    });
  }
  // straight arrow from p along unit u
  function arrow(x, p, u, len, color, a = 1, w = 3.4) {
    if (a <= 0.02) return; const q = add(p, u, len), n = [-u[1], u[0]];
    x.save(); x.globalAlpha = a;
    Ink.stroke(x, [p, q], { w, color, seed: 3, amp: 0.4 });
    Ink.stroke(x, [add(add(q, u, -15), n, 10), q, add(add(q, u, -15), n, -10)], { w, color, seed: 5, amp: 0.3 });
    x.restore();
  }
  // curved arrow round centre c (for turning things); dir = +1 clockwise on screen
  function arcArrow(x, c, r, a0, span, dir, color, a = 1, w = 3.4) {
    if (a <= 0.02) return; const P = []; for (let i = 0; i <= 14; i++) { const an = a0 + dir * span * i / 14; P.push([c[0] + Math.cos(an) * r, c[1] + Math.sin(an) * r]); }
    const q = P[14], u = unit(q, P[12]), n = [-u[1], u[0]];
    x.save(); x.globalAlpha = a;
    Ink.stroke(x, P, { w, color, seed: 3, amp: 0.3 });
    Ink.stroke(x, [add(add(q, u, -15), n, 10), q, add(add(q, u, -15), n, -10)], { w, color, seed: 5, amp: 0.3 });
    x.restore();
  }
  // the red knob you drag (pulses until first touched)
  function grip(x, p, now, touched, r = 23) {
    eraseC(x, p, r); disc(x, p, r, { color: [235, 80, 80], a: 0.22 });
    x.save(); x.beginPath(); x.arc(p[0], p[1], r, 0, 7); x.clip(); Ink.hatchFill(x, box(p[0] - r, p[1], r * 2, r), 1, RD, 1.3); x.restore();
    ring(x, p, r, { color: RD, w: 2.8 }); ring(x, p, 6, { color: RD, w: 2 });
    if (!touched) { const ph = (now * 0.9) % 1; ring(x, p, r + 4 + ph * 16, { color: RD, w: 2.4, a: 0.8 * (1 - ph) }); }
  }
  // the green pad on the output end
  function pad(x, p, r = 17, piv = true) {
    const P = geo.rect(p[0] - r, p[1] - r, r * 2, r * 2, 6);
    eraseP(x, P); fillP(x, P, 'rgba(70,180,110,0.25)');
    x.save(); path(x, P); x.clip(); Ink.hatchFill(x, box(p[0] - r, p[1], r * 2, r), 1, GR, 1.3); x.restore();
    Ink.stroke(x, P, { w: 2.4, color: GR, seed: 9, amp: 0.4 });
    if (piv) movPivot(x, p, 5.5);
  }
  // remembers which way a point is moving so a direction arrow can be shown while it moves
  function Tracker() {
    const T = { u: [1, 0], a: 0, p: null, sp: 0 };
    T.step = (p, dt) => {
      if (T.p) { const d = dist(p, T.p), sp = d / Math.max(dt, 1e-3); T.sp += (sp - T.sp) * 0.3;
        if (sp > 12) { const u = unit(p, T.p); T.u = [T.u[0] * 0.5 + u[0] * 0.5, T.u[1] * 0.5 + u[1] * 0.5]; const m = Math.hypot(T.u[0], T.u[1]) || 1; T.u = [T.u[0] / m, T.u[1] / m]; T.a = Math.min(1, T.a + dt * 10); }
        else T.a = Math.max(0, T.a - dt * 1.6); }
      T.p = p; return T;
    };
    return T;
  }

  // ---------- an interactive canvas "stage" with an on-demand render loop and finger dragging ----------
  function Stage(ui, W, Hh) {
    const wrap = ui.el('div', 'exp'); wrap.style.cssText = 'position:relative;margin:0 0 14px';
    const c = document.createElement('canvas'); wrap.appendChild(c);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = Math.round(W * dpr); c.height = Math.round(Hh * dpr);
    Object.assign(c.style, { width: '100%', height: 'auto', aspectRatio: W + ' / ' + Hh, display: 'block', touchAction: 'pan-y', userSelect: 'none', webkitUserSelect: 'none', webkitTouchCallout: 'none' });
    const ctx = c.getContext('2d');
    const S = { c, ctx, W, H: Hh, wrap, render: () => false };
    S.pos = (e) => { const r = c.getBoundingClientRect(); return [((e.clientX - r.left) * W) / r.width, ((e.clientY - r.top) * Hh) / r.height]; };
    S.layer = (paint) => { const L = document.createElement('canvas'); L.width = Math.ceil(W * dpr); L.height = Math.ceil(Hh * dpr); const x = L.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.lineCap = 'round'; x.lineJoin = 'round'; paint(x); return L; };
    S.blit = (L) => ctx.drawImage(L, 0, 0, W, Hh);
    const hidden = () => { const p = c.closest('.page'); return !p || p.classList.contains('hidden'); };
    let raf = 0, wait = 0, last = 0, vis = true;
    if (window.IntersectionObserver) new IntersectionObserver((es) => { vis = es[es.length - 1].isIntersecting; if (vis) S.go(); }, { rootMargin: '120px' }).observe(c);
    const tick = (now) => {
      raf = 0;
      if (!vis) { last = 0; return; } // off screen: sleep until scrolled back into view
      if (hidden()) { last = 0; if (!wait) wait = setTimeout(() => { wait = 0; S.go(); }, 400); return; }
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60; last = now;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.globalCompositeOperation = 'source-over'; ctx.clearRect(0, 0, W, Hh);
      ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = 1; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      if (S.render(dt, now / 1000)) raf = requestAnimationFrame(tick); else last = 0;
    };
    S.go = () => { if (!raf) raf = requestAnimationFrame(tick); };
    // h.hit(px,py) -> a token (what was grabbed) or null; h.move(token,px,py,first); h.end(token)
    S.drag = (h) => {
      let tok = null, pid = null;
      c.addEventListener('touchstart', (e) => { const t = e.changedTouches[0]; const [px, py] = S.pos(t); if (h.hit(px, py) != null) e.preventDefault(); }, { passive: false });
      c.addEventListener('pointerdown', (e) => { if (tok != null) return; const [px, py] = S.pos(e); tok = h.hit(px, py); if (tok == null) return; pid = e.pointerId; try { c.setPointerCapture(pid); } catch (er) {} c.style.cursor = 'grabbing'; h.move(tok, px, py, true); S.go(); });
      c.addEventListener('pointermove', (e) => { if (tok == null) { const [px, py] = S.pos(e); c.style.cursor = h.hit(px, py) != null ? 'grab' : ''; return; } if (e.pointerId !== pid) return; const [px, py] = S.pos(e); h.move(tok, px, py, false); S.go(); });
      const up = (e) => { if (tok == null || e.pointerId !== pid) return; const t = tok; tok = null; c.style.cursor = ''; h.end && h.end(t); S.go(); };
      c.addEventListener('pointerup', up); c.addEventListener('pointercancel', up);
      S.dragging = () => tok != null;
    };
    if (document.fonts) document.fonts.ready.then(() => { S.onFonts && S.onFonts(); S.go(); });
    return S;
  }
  const frameAct = (d) => requestAnimationFrame(() => Ink.frame(d, { shadow: false, w: 2.2 }));
  const item = (id) => Book.state.items[id];
  const lock = (els, on) => els.forEach((e) => e.classList.toggle('peek-lock', on));

  // ======================================================================================
  Book.page({
    id: 'p07',
    title: 'Linkages: reverse & push–pull',
    build(ui) {
      ui.h('Linkages: part 1');
      ui.p('A <span class="key">linkage</span> is a set of levers (rigid bars) joined by <b>pivots</b>. It <b>transfers motion and force</b> from an <b class="red">input</b> to an <b style="color:var(--green)">output</b>.');
      ui.box('There are two kinds of pivot.<br><b>Fixed pivot:</b> attached to the frame or base. The bar turns about it, but the pivot <b>does not move</b>.<br><b>Moving pivot:</b> joins two bars together. It <b>moves with them</b>.', { tag: 'Notes' });

      // ================================================================ A. SPOT THE PIVOTS
      ui.p('<b>Watch this linkage rock.</b> It has six pivots, A to F. Decide which kind each one is.');
      const AW = 860, AH = 330, ARM = 80, AF1 = [310, 168], AF2 = [550, 168], AG1 = [165, 88], AG2 = [695, 88];
      const PV = [
        { k: 'A', fixed: false, off: [0, -20] }, { k: 'B', fixed: true, off: [-44, 9] }, { k: 'C', fixed: false, off: [0, 40] },
        { k: 'D', fixed: false, off: [0, 40] }, { k: 'E', fixed: true, off: [44, 9] }, { k: 'F', fixed: false, off: [0, -20] },
      ];
      const gA = (th) => {
        const s = Math.sin(th) * ARM, c = Math.cos(th) * ARM;
        const T1 = [AF1[0] + s, AF1[1] - c], B1 = [AF1[0] - s, AF1[1] + c], T2 = [AF2[0] + s, AF2[1] - c], B2 = [AF2[0] - s, AF2[1] + c];
        return { T1, B1, T2, B2, E1: add(T1, unit(AG1, T1), 210), E2: add(T2, unit(AG2, T2), 210), P: [T1, AF1, B1, B2, AF2, T2] };
      };
      const SA = Stage(ui, AW, AH);
      const rPiv = ui.record('p07.pivots', { label: 'Fixed or moving? (6 pivots on a rocking linkage)', type: 'identify', max: 6 });
      let solvedA = false, statA;
      const buildA = () => { statA = SA.layer((x) => { guide(x, AG1); guide(x, AG2); if (solvedA) { baseBlock(x, AF1); baseBlock(x, AF2); } }); };
      buildA();
      SA.render = (dt, now) => {
        const x = SA.ctx, g = gA(0.5 * Math.sin(now * 1.5));
        SA.blit(statA);
        bar(x, g.E1, g.T1, { tint: TINT.red, seed: 11, w: 18 }); bar(x, g.T2, g.E2, { tint: TINT.green, seed: 13, w: 18 });
        bar(x, g.B1, g.B2, { seed: 15, w: 18 });
        bar(x, g.T1, g.B1, { seed: 17, w: 22 }); bar(x, g.T2, g.B2, { seed: 19, w: 22 });
        PV.forEach((p, i) => {
          const q = g.P[i];
          if (!solvedA) { eraseC(x, q, 8.5); ring(x, q, 8.5); disc(x, q, 3); }
          else if (p.fixed) pin(x, q); else movPivot(x, q);
          text(x, p.k, q[0] + p.off[0], q[1] + p.off[1], { size: 25, align: 'center', color: solvedA && p.fixed ? RD : B });
        });
        return true;
      };
      SA.go();

      const pa = ui.el('div', 'act'); pa.dataset.id = 'p07.pivots'; frameAct(pa);
      ui.el('div', 'q', 'Tap <b>fixed</b> or <b>moving</b> for each pivot, then check.', pa);
      const pg = ui.el('div', '', '', pa); pg.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(215px,1fr));gap:10px 22px';
      const picks = {};
      const rows = PV.map((p) => {
        const r = ui.el('div', '', `<b style="font:700 25px Fredoka;width:24px;flex:0 0 auto">${p.k}</b>`, pg); r.style.cssText = 'display:flex;align-items:center;gap:8px';
        const bs = ['fixed', 'moving'].map((t) => { const b = ui.el('button', 'opt', t, r); b.type = 'button'; b.style.cssText = 'flex:1;text-align:center;padding:8px 6px';
          b.onclick = () => { bs.forEach((o) => o.classList.remove('sel', 'right', 'wrong')); b.classList.add('sel'); picks[p.k] = t; Book.sfx('tick', { gain: 0.5 }); chkA.disabled = PV.some((q) => !picks[q.k]); }; return b; });
        return bs;
      });
      const chkA = ui.el('button', 'btn', 'Check', pa); chkA.disabled = true;
      const fbA = ui.el('div', 'fb', '', pa);
      const legend = ui.p('In linkage diagrams a <b>fixed pivot</b> is drawn as a pin through a hatched base block, and a <b>moving pivot</b> as an open circle. You will see both below.');
      const markA = (final) => {
        let sc = 0;
        PV.forEach((p, i) => { const want = p.fixed ? 'fixed' : 'moving', ok = picks[p.k] === want; if (ok) sc++;
          rows[i].forEach((b) => { b.classList.remove('sel', 'right', 'wrong'); if (b.textContent === picks[p.k]) b.classList.add(ok ? 'right' : 'wrong'); if (final) { b.disabled = true; if (!ok && b.textContent === want) b.classList.add('right'); } }); });
        return sc;
      };
      const finishA = (sc) => {
        solvedA = true; buildA(); chkA.style.display = 'none'; lock([legend], false);
        fbA.className = 'fb on ' + (sc === 6 ? 'good' : 'bad');
        fbA.innerHTML = (sc === 6 ? '✓ Spot on. ' : `${sc}/6. `) + '<b>B</b> and <b>E</b> are <b>fixed</b>: they are pinned to the base and stay still while the levers turn about them. <b>A, C, D</b> and <b>F</b> are <b>moving</b> pivots: each one joins two bars and travels with them.';
      };
      chkA.onclick = () => {
        const sc = markA(false), n = (rPiv.get()?.attempts || 0) + 1;
        rPiv.set({ answer: PV.map((p) => `${p.k} ${picks[p.k]}${picks[p.k] === (p.fixed ? 'fixed' : 'moving') ? ' ✓' : ' ✗'}`).join(', '), correct: sc === 6, score: sc, max: 6, mis: sc === 6 ? '' : 'fixed-vs-moving', picks: Object.assign({}, picks) });
        Book.sfx(sc === 6 ? 'success' : 'error', { gain: 0.35 });
        if (sc === 6 || n >= 3) { markA(true); finishA(sc); }
        else { fbA.className = 'fb on bad'; fbA.innerHTML = `${sc}/6 right. Watch each red one again: does that pivot <b>stay in one place</b>, or does it <b>travel</b> with the bars?`; }
      };
      lock([legend], true);
      { const pv = rPiv.get(); if (pv && pv.picks) { Object.assign(picks, pv.picks); chkA.disabled = false; const sc = markA(pv.correct || pv.attempts >= 3); if (pv.correct || pv.attempts >= 3) finishA(sc); } }

      // ================================================================ B. REVERSE MOTION LINKAGE
      ui.el('h2', '', 'Reverse motion linkage');
      ui.p('One lever turns on a <b>fixed pivot</b>. <b>Drag the red handle</b> left and right, and watch what the green end does.');
      const BW = 860, BH = 540, LX = 430, YT = 120, LT = 320, HOLES = [80, 120, 160, 200, 240], RL = 250, EFF = 15;
      const sb = { a: 160, th: 0, thT: 0, unlocked: false, touched: false, tested: false, pinMoved: false, off: 0, end: false };
      const thMaxB = () => Math.asin(60 / Math.max(sb.a, LT - sb.a));
      const gB = (th) => {
        const F = [LX, YT + sb.a], s = Math.sin(th), c = Math.cos(th), b = LT - sb.a;
        const T = [F[0] + sb.a * s, F[1] - sb.a * c], Bm = [F[0] - b * s, F[1] + b * c];
        return { F, T, Bm, Hd: [T[0] - Math.sqrt(RL * RL - (T[1] - YT) ** 2), YT], E: [Bm[0] + Math.sqrt(RL * RL - (Bm[1] - YT - LT) ** 2), YT + LT] };
      };
      const SB = Stage(ui, BW, BH);
      const fbB = ui.el('div', 'fb'); fbB.style.marginBottom = 'var(--R)';
      const statB = SB.layer((x) => {
        rail(x, [LX - RL - 92, YT], [LX - RL + 92, YT], 27); rail(x, [LX + RL - 84, YT + LT], [LX + RL + 84, YT + LT], 21);
        for (let y = YT - 50; y < YT + LT + 50; y += 16) { x.strokeStyle = rgba(B, 0.4); x.lineWidth = 1.4; x.beginPath(); x.moveTo(LX, y); x.lineTo(LX, y + 8); x.stroke(); }
        const P = box(LX - 31, YT + 50, 62, 220); Ink.hatchShadow(x, P, 1, 6, 6); Ink.hatchFill(x, P, 1, B, 1.5); Ink.stroke(x, closeP(P), { w: 2.2, seed: 23, amp: 0.5 });
      });
      const tIn = Tracker(), tOut = Tracker();
      const rRev = ui.record('p07.reverse-predict', { label: 'Reverse linkage: pivot nearer output → force and movement? (predict, then test)', type: 'predict+check', max: 2 });
      SB.render = (dt, now) => {
        const x = SB.ctx;
        sb.th += (sb.thT - sb.th) * Math.min(1, dt * 24); if (Math.abs(sb.thT - sb.th) < 2e-4) sb.th = sb.thT;
        const g = gB(sb.th), b = LT - sb.a;
        SB.blit(statB);
        bar(x, g.Hd, g.T, { tint: TINT.red, seed: 11, w: 18 }); bar(x, g.Bm, g.E, { tint: TINT.green, seed: 13, w: 18 });
        bar(x, g.T, g.Bm, { seed: 17, w: 26 });
        const lu = unit(g.Bm, g.T);
        HOLES.forEach((h) => { if (h !== sb.a) { const p = add(g.T, lu, h); eraseC(x, p, 5.5); ring(x, p, 5.5, { w: 1.6, a: 0.75 }); } });
        movPivot(x, g.T); movPivot(x, g.Bm); pin(x, g.F);
        if (sb.unlocked && !sb.pinMoved) { const ph = (now * 0.9) % 1; ring(x, g.F, 14 + ph * 16, { color: RD, w: 2.4, a: 0.8 * (1 - ph) }); text(x, '↕ drag the pin', LX + 46, g.F[1] + 8, { size: 23, font: 'hand', color: RD }); }
        else text(x, 'fixed pivot', LX + 46, g.F[1] + 8, { size: 22, font: 'hand', a: 0.8 });
        grip(x, g.Hd, now, sb.touched); pad(x, g.E);
        tIn.step(g.Hd, dt); tOut.step(g.E, dt);
        arrow(x, [g.Hd[0] - Math.sign(tIn.u[0]) * 32, YT - 44], [Math.sign(tIn.u[0]) || 1, 0], 64, RD, tIn.a);
        arrow(x, [g.E[0] - Math.sign(tOut.u[0]) * 32, YT + LT - 44], [Math.sign(tOut.u[0]) || 1, 0], 64, GR, tOut.a);
        const dI = Math.round(sb.a * Math.abs(Math.sin(sb.th))), dO = Math.round(b * Math.abs(Math.sin(sb.th)));
        if (sb.unlocked) {
          // how far each end of the lever has moved from the dashed rest line
          [[g.T, YT - 30, RD], [g.Bm, YT + LT + 30, GR]].forEach(([p, y, col]) => { if (Math.abs(p[0] - LX) > 4) { Ink.stroke(x, [[LX, y], [p[0], y]], { w: 2.6, color: col, seed: 3, amp: 0.2 }); Ink.stroke(x, [[LX, y - 8], [LX, y + 8]], { w: 2, color: col, seed: 4, amp: 0.2 }); Ink.stroke(x, [[p[0], y - 8], [p[0], y + 8]], { w: 2, color: col, seed: 5, amp: 0.2 }); } });
          text(x, `INPUT: ${EFF} N push · end moved ${dI} mm`, 40, 40, { size: 24, color: RD, max: 560 });
          text(x, `OUTPUT: ${Math.round(EFF * sb.a / b)} N · end moved ${dO} mm`, BW - 40, BH - 22, { size: 24, color: GR, align: 'right', max: 560 });
        } else { text(x, 'INPUT', 40, 40, { size: 24, color: RD }); text(x, 'OUTPUT', BW - 40, BH - 22, { size: 24, color: GR, align: 'right' }); }
        if (!sb.touched) text(x, 'drag me', g.Hd[0], YT + 58, { size: 23, font: 'hand', color: RD, align: 'center' });
        if (sb.unlocked && !sb.tested && sb.a > LT / 2 && Math.abs(sb.th) >= 0.9 * thMaxB()) { sb.tested = true; testedB(true); }
        return !sb.touched || (sb.unlocked && !sb.pinMoved) || SB.dragging() || sb.th !== sb.thT || tIn.a > 0 || tOut.a > 0;
      };
      SB.drag({
        hit(px, py) {
          const g = gB(sb.th);
          if (dist([px, py], g.Hd) < 62 || (Math.abs(py - YT) < 42 && px > g.Hd[0] - 62 && px < g.T[0] - 34)) return 'h';
          if (sb.unlocked && Math.abs(px - LX) < 72 && py > YT + 40 && py < YT + LT - 40) return 'p';
          return null;
        },
        move(t, px, py, first) {
          if (t === 'h') {
            const m = thMaxB(), f = (th) => gB(th).Hd[0];
            if (first) sb.off = px - f(sb.thT);
            const want = px - sb.off, lo = f(-m), hi = f(m);
            sb.thT = bisect(f, clamp(want, lo, hi), -m, m);
            const end = want <= lo || want >= hi; if (end && !sb.end) Book.sfx('tock', { gain: 0.3 }); sb.end = end;
            if (!sb.touched) { sb.touched = true; }
          } else {
            const h = HOLES.reduce((q, v) => (Math.abs(v - (py - YT)) < Math.abs(q - (py - YT)) ? v : q), HOLES[0]);
            if (h !== sb.a) { sb.a = h; sb.th = sb.thT = 0; sb.pinMoved = true; Book.sfx('tick', { gain: 0.6 }); }
            else if (first) sb.thT = 0;
          }
        },
      });
      SB.go();

      // predict first
      const pb = ui.el('div', 'act'); pb.dataset.id = 'p07.reverse-predict'; frameAct(pb);
      const pickB = { force: null, move: null }, OPTS = ['bigger', 'smaller', 'the same'];
      const mkRow = (key, q) => {
        ui.el('div', 'q', q, pb); const r = ui.el('div', 'opts', '', pb); r.style.cssText = 'grid-template-columns:repeat(3,1fr);margin-bottom:12px';
        OPTS.forEach((t) => { const b = ui.el('button', 'opt', t, r); b.type = 'button'; b.style.textAlign = 'center';
          b.onclick = () => { r.querySelectorAll('.opt').forEach((o) => o.classList.remove('sel')); b.classList.add('sel'); pickB[key] = t; Book.scribble(0.12); goB.disabled = !(pickB.force && pickB.move); }; });
        return r;
      };
      const rowF = mkRow('force', '<b>Predict:</b> the fixed pivot is in the middle of the lever now. If it is moved <b>nearer the output end</b>, the output <b>force</b> will be…');
      const rowM = mkRow('move', '…and the distance the output <b>moves</b> will be…');
      const goB = ui.el('button', 'btn', 'Unlock the pivot pin ▸', pb); goB.disabled = true; goB.style.marginTop = '0';
      const notesB = ui.box('<b>Reverse motion linkage:</b> the output moves in the <span class="key">opposite direction</span> to the input. It is one lever turning on a fixed pivot.<br>Pivot in the <b>centre</b>: input and output forces and distances are equal.<br>Pivot <b>nearer the output</b>: the output force is <b>bigger</b> but its movement is <b>smaller</b> (and the other way round). You never get something for nothing.<br><span class="small">Used in: folding clothes airers, pop-up card mechanisms, some foot-pedal bins.</span>', { tag: 'Notes' });
      lock([notesB], true);
      const unlockB = () => {
        sb.unlocked = true; [rowF, rowM].forEach((r) => r.querySelectorAll('.opt').forEach((o) => { o.disabled = true; if (o.textContent === pickB[r === rowF ? 'force' : 'move']) o.classList.add('sel'); }));
        goB.style.display = 'none'; SB.go();
      };
      function testedB(fresh) {
        const a = pickB.force === 'bigger', m = pickB.move === 'smaller', sc = (a ? 1 : 0) + (m ? 1 : 0);
        fbB.className = 'fb on ' + (sc === 2 ? 'good' : 'bad');
        fbB.innerHTML = `<b>${sc}/2.</b> Force: you said <b>${pickB.force}</b> ${a ? '✓' : '✗ It gets <b>bigger</b>: the output end is closer to the pivot, so it pushes harder.'}<br>Movement: you said <b>${pickB.move}</b> ${m ? '✓' : '✗ It gets <b>smaller</b>: the short end of the lever swings through a smaller distance.'}<br><span style="color:var(--ink)">More force, less movement. Now try the pin <b>nearer the input</b> and read the numbers again.</span>`;
        lock([notesB], false);
        if (fresh) { Book.sfx(sc === 2 ? 'success' : 'error', { gain: 0.35 }); const it = rRev.get(); if (it) { it.tested = true; } }
      }
      goB.onclick = () => {
        if (!(pickB.force && pickB.move)) return;
        const a = pickB.force === 'bigger', m = pickB.move === 'smaller';
        rRev.set({ answer: `force: ${pickB.force} ${a ? '✓' : '✗ (bigger)'}, movement: ${pickB.move} ${m ? '✓' : '✗ (smaller)'}`, correct: a && m, score: (a ? 1 : 0) + (m ? 1 : 0), max: 2,
          mis: a && m ? '' : pickB.force === 'bigger' && pickB.move === 'bigger' ? 'ma-free-lunch' : 'moment-distance', pick: Object.assign({}, pickB) });
        unlockB(); Book.sfx('pop', { gain: 0.4 });
        fbB.className = 'fb on'; fbB.style.color = ''; fbB.innerHTML = '<b>Pin unlocked.</b> Drag the pin along the lever until it is <b>nearer the output end</b>, then push the red handle as far as it goes. Read the numbers.';
        SB.wrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
      };
      { const pv = rRev.get(); if (pv && pv.pick) { Object.assign(pickB, pv.pick); unlockB(); sb.touched = true; if (pv.tested) { sb.tested = true; sb.pinMoved = true; sb.a = 240; testedB(false); } else { fbB.className = 'fb on'; fbB.innerHTML = '<b>Pin unlocked.</b> Drag the pin <b>nearer the output end</b>, then push the red handle as far as it goes.'; } } }

      // ================================================================ C. PUSH–PULL LINKAGE
      ui.el('h2', '', 'Push–pull linkage');
      ui.p('This linkage joins <b>two</b> levers with a bar. <b>Drag the red handle</b> again. Compare the green end with last time.');
      const CW = 860, CH = 440, CA = 100, CF1 = [330, 220], CF2 = [570, 220], CY = 120, CR1 = 230, CR2 = 180, CM = Math.asin(60 / CA);
      const sc = { th: 0, thT: 0, touched: false, off: 0, end: false, lo: false, hi: false, done: false };
      const gC = (th) => {
        const s = Math.sin(th) * CA, c = Math.cos(th) * CA;
        const T1 = [CF1[0] + s, CF1[1] - c], B1 = [CF1[0] - s, CF1[1] + c], T2 = [CF2[0] + s, CF2[1] - c], B2 = [CF2[0] - s, CF2[1] + c];
        return { T1, B1, T2, B2, Hd: [T1[0] - Math.sqrt(CR1 * CR1 - (T1[1] - CY) ** 2), CY], E: [T2[0] + Math.sqrt(CR2 * CR2 - (T2[1] - CY) ** 2), CY] };
      };
      const SC = Stage(ui, CW, CH);
      const statC = SC.layer((x) => { rail(x, [CF1[0] - CR1 - 92, CY], [CF1[0] - CR1 + 92, CY], 27); rail(x, [CF2[0] + CR2 - 84, CY], [CF2[0] + CR2 + 84, CY], 21); baseBlock(x, CF1); baseBlock(x, CF2); });
      const uIn = Tracker(), uOut = Tracker();
      const rPP = ui.record('p07.pushpull', { label: 'Push–pull linkage: tried it', type: 'explore', max: 0 });
      const notesC = ui.box('<b>Push–pull linkage</b> (parallel motion): the output moves in the <span class="key">same direction</span> as the input, parallel to it. It uses <b>two fixed pivots</b>.<br><span class="small">Used in: tool-box trays that stay level as they open, moving-picture book tabs.</span>', { tag: 'Notes' });
      const doneC = (fresh) => { sc.done = true; lock([notesC], false); if (fresh) { rPP.set({ answer: 'moved the handle both ways', correct: null }); Book.sfx('pop', { gain: 0.35 }); } };
      SC.render = (dt, now) => {
        const x = SC.ctx;
        sc.th += (sc.thT - sc.th) * Math.min(1, dt * 24); if (Math.abs(sc.thT - sc.th) < 2e-4) sc.th = sc.thT;
        const g = gC(sc.th);
        SC.blit(statC);
        bar(x, g.Hd, g.T1, { tint: TINT.red, seed: 11, w: 18 }); bar(x, g.T2, g.E, { tint: TINT.green, seed: 13, w: 18 });
        bar(x, g.B1, g.B2, { seed: 15, w: 18 });
        bar(x, g.T1, g.B1, { seed: 17, w: 24 }); bar(x, g.T2, g.B2, { seed: 19, w: 24 });
        [g.T1, g.B1, g.T2, g.B2].forEach((p) => movPivot(x, p)); pin(x, CF1); pin(x, CF2);
        grip(x, g.Hd, now, sc.touched); pad(x, g.E);
        uIn.step(g.Hd, dt); uOut.step(g.E, dt);
        arrow(x, [g.Hd[0] - Math.sign(uIn.u[0]) * 32, 74], [Math.sign(uIn.u[0]) || 1, 0], 64, RD, uIn.a);
        arrow(x, [g.E[0] - Math.sign(uOut.u[0]) * 32, 74], [Math.sign(uOut.u[0]) || 1, 0], 64, GR, uOut.a);
        text(x, 'INPUT', 40, 40, { size: 24, color: RD }); text(x, 'OUTPUT', CW - 40, 40, { size: 24, color: GR, align: 'right' });
        if (!sc.touched) text(x, 'drag me', g.Hd[0], 178, { size: 23, font: 'hand', color: RD, align: 'center' });
        if (sc.th < -0.8 * CM) sc.lo = true; if (sc.th > 0.8 * CM) sc.hi = true;
        if (!sc.done && sc.lo && sc.hi) doneC(true);
        return !sc.touched || SC.dragging() || sc.th !== sc.thT || uIn.a > 0 || uOut.a > 0;
      };
      SC.drag({
        hit(px, py) { const g = gC(sc.th); return dist([px, py], g.Hd) < 62 || (Math.abs(py - 120) < 42 && px > g.Hd[0] - 62 && px < g.T1[0] - 34) ? 'h' : null; },
        move(t, px, py, first) {
          const f = (th) => gC(th).Hd[0]; if (first) sc.off = px - f(sc.thT);
          const want = px - sc.off, lo = f(-CM), hi = f(CM);
          sc.thT = bisect(f, clamp(want, lo, hi), -CM, CM);
          const end = want <= lo || want >= hi; if (end && !sc.end) Book.sfx('tock', { gain: 0.3 }); sc.end = end; sc.touched = true;
        },
      });
      SC.go();
      lock([notesC], true);
      if (rPP.get()) { sc.touched = true; doneC(false); }

      // ================================================================ CHECK
      ui.el('h2', '', 'Which linkage?');
      ui.p('<span class="small">The notes and diagrams above will blur while you answer. Recall them!</span>');
      const hide = [notesB, notesC, legend, fbA, fbB, pa, pb, SA.wrap, SB.wrap, SC.wrap];
      const which = ui.mcq({ id: 'p07.which', label: 'Choose a linkage: output opposite way, with more force', q: 'A designer needs the output to move the <b>opposite way</b> to the input, with <b>more force</b>. Which should she choose?',
        options: [
          { t: 'Reverse motion linkage, fixed pivot nearer the output', ok: true, why: 'Reverse motion gives the opposite direction, and a pivot nearer the output makes the output force bigger (but its movement smaller).' },
          { t: 'Reverse motion linkage, fixed pivot nearer the input', mis: 'moment-distance', why: 'Right linkage, wrong pivot position. That would give more movement but less force.' },
          { t: 'Push–pull linkage, fixed pivots nearer the output', mis: 'linkage-type', why: 'A push–pull linkage sends the output the same way as the input.' },
          { t: 'Push–pull linkage, fixed pivots nearer the input', mis: 'linkage-type', why: 'A push–pull linkage sends the output the same way as the input.' },
        ] });
      ui.hideWhile(which, 'p07.which', hide);
      const fill = ui.fill({ id: 'p07.check', label: 'Reverse vs push–pull: pivots and directions (4 blanks)', q: 'Fill in the blanks.',
        html: 'A reverse motion linkage is one lever turning on {{one|1|a|a single|single}} fixed pivot. Its output moves in the {{opposite|reverse|other|opposite way}} direction to the input.<br>A push–pull linkage uses {{two|2}} fixed pivots. Its output moves in the {{same}} direction as the input.',
        explain: 'Reverse motion: one fixed pivot, opposite direction. Push–pull: two fixed pivots, same direction.' });
      ui.hideWhile(fill, 'p07.check', hide.concat([which]));
    },
  });
})();
