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

  // a spoked wheel turning about fixed centre O; spoke 0 (at angle phi) carries the crank pin
  function wheel(x, O, R, phi, seed = 51) {
    x.save(); x.translate(O[0], O[1]); x.rotate(phi);
    x.save(); x.globalCompositeOperation = 'destination-out'; x.beginPath(); x.arc(0, 0, R, 0, 7); x.arc(0, 0, R - 14, 0, 7, true); x.fill('evenodd'); x.restore();
    x.save(); x.fillStyle = TINT.blue; x.beginPath(); x.arc(0, 0, R, 0, 7); x.arc(0, 0, R - 14, 0, 7, true); x.fill('evenodd'); x.restore();
    Ink.stroke(x, geo.ellipse(0, 0, R, R, 0.3, 0.3 + TAU + 0.12), { w: 2.4, seed, amp: 0.5 });
    Ink.stroke(x, geo.ellipse(0, 0, R - 14, R - 14, 1.1, 1.1 + TAU + 0.12), { w: 1.9, seed: seed + 1, amp: 0.4 });
    for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2; bar(x, [0, 0], [Math.cos(a) * (R - 15), Math.sin(a) * (R - 15)], { w: k ? 11 : 16, ext0: 0, ext1: 0, hatch: !k, seed: seed + 3 + k, lw: 1.8 }); }
    x.restore();
  }
  // a periodic value fn(phi) with one maximum and one minimum per turn (a slider or a rocker driven by a crank).
  // solve() finds the crank angle for a wanted value; at each end of the stroke it swaps to the other half of the
  // turn, so pushing back and forth keeps the crank going round the same way (as a flywheel does).
  function Cyc(fn, eps = 0.05) {
    const N = 2880; let vmin = 1e9, vmax = -1e9, pmin = 0, pmax = 0;
    for (let i = 0; i < N; i++) { const p = (i / N) * TAU, v = fn(p); if (v < vmin) { vmin = v; pmin = p; } if (v > vmax) { vmax = v; pmax = p; } }
    const C = { vmin, vmax, pmin, pmax, br: 0 };
    const mod = (p) => ((p % TAU) + TAU) % TAU;
    C.from = (phi) => { const a = mod(phi - pmin), b = mod(pmax - pmin); C.br = a <= b ? 0 : 1; };
    C.solve = (phiNow, target) => {
      const near = (p) => p + TAU * Math.round((phiNow - p) / TAU), e = (vmax - vmin) * eps;
      if (target >= vmax - e) { C.br = 1; return near(pmax); }
      if (target <= vmin + e) { C.br = 0; return near(pmin); }
      let a = C.br ? pmax : pmin, b = C.br ? pmin : pmax; if (b < a) b += TAU;
      return near(bisect(fn, target, a, b));
    };
    return C;
  }
  const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));
  // intersection of circle (A, ra) and circle (C, rc); side = +1 or -1 picks which of the two
  const circ2 = (A, ra, C, rc, side) => { const d = dist(A, C), u = unit(C, A), a = (ra * ra - rc * rc + d * d) / (2 * d), h = Math.sqrt(Math.max(0, ra * ra - a * a)); return [A[0] + u[0] * a - u[1] * h * side, A[1] + u[1] * a + u[0] * h * side]; };

  const MOTIONS = ['linear', 'reciprocating', 'rotary', 'oscillating'];
  const MDEF = { linear: 'Linear means a straight line in <b>one direction only</b>.', reciprocating: 'Reciprocating means backwards and forwards in a <b>straight line</b>.', rotary: 'Rotary means turning <b>round in a full circle</b>.', oscillating: 'Oscillating means swinging backwards and forwards in an <b>arc</b>.' };
  // "what motion goes in / comes out?" two rows of taps, then Check
  function motionQ(ui, o) {
    const r = ui.record(o.id, { label: o.label, type: 'input/output motion', max: 2 });
    const d = ui.el('div', 'act'); d.dataset.id = o.id; frameAct(d);
    ui.el('div', 'q', o.q, d);
    const pick = [null, null];
    const rows = o.parts.map((p, i) => {
      ui.el('div', 'q', `<b>${p.name}</b>`, d).style.margin = '0 0 6px';
      const row = ui.el('div', 'opts', '', d); row.style.cssText = 'grid-template-columns:repeat(auto-fit,minmax(150px,1fr));margin-bottom:12px';
      MOTIONS.forEach((m) => { const b = ui.el('button', 'opt', m, row); b.type = 'button'; b.style.textAlign = 'center';
        b.onclick = () => { row.querySelectorAll('.opt').forEach((q) => q.classList.remove('sel', 'right', 'wrong')); b.classList.add('sel'); pick[i] = m; Book.scribble(0.12); btn.disabled = !(pick[0] && pick[1]); }; });
      return row;
    });
    const btn = ui.el('button', 'btn', 'Check', d); btn.disabled = true; btn.style.marginTop = '0';
    const f = ui.el('div', 'fb', '', d);
    const mark = (final) => o.parts.map((p, i) => { const ok = pick[i] === p.ans; rows[i].querySelectorAll('.opt').forEach((b) => { b.classList.remove('sel', 'right', 'wrong'); if (b.textContent === pick[i]) b.classList.add(ok ? 'right' : 'wrong'); if (final) { b.disabled = true; if (b.textContent === p.ans) b.classList.add('right'); } }); return ok; });
    const finish = (oks) => { btn.style.display = 'none'; const all = oks.every(Boolean); f.className = 'fb on ' + (all ? 'good' : 'bad'); f.innerHTML = (all ? '✓ ' : '') + o.explain; o.onDone && o.onDone(); };
    btn.onclick = () => {
      const oks = mark(false), sc = oks.filter(Boolean).length, n = (r.get()?.attempts || 0) + 1, mis = [];
      o.parts.forEach((p, i) => { if (oks[i]) return; const pr = [p.ans, pick[i]].sort().join('+'); mis.push(pr === 'oscillating+reciprocating' ? 'recip-vs-oscill' : pr === 'linear+reciprocating' ? 'linear-vs-recip' : 'motion-conversion'); });
      r.set({ answer: o.parts.map((p, i) => `${p.short}: ${pick[i]} ${oks[i] ? '✓' : '✗ (' + p.ans + ')'}`).join(', '), correct: sc === 2, score: sc, max: 2, mis: [...new Set(mis)].join(','), pick: pick.slice() });
      Book.sfx(sc === 2 ? 'success' : 'error', { gain: 0.35 });
      if (sc === 2 || n >= 3) { finish(mark(true)); return; }
      f.className = 'fb on bad';
      f.innerHTML = o.parts.map((p, i) => (oks[i] ? '' : `✗ ${p.short}: ${MDEF[pick[i]]} Is that what ${p.thing} did? Look again.`)).filter(Boolean).join('<br>');
    };
    const pv = r.get(); if (pv && pv.pick) { pick[0] = pv.pick[0]; pick[1] = pv.pick[1]; btn.disabled = false; const fin = pv.correct || pv.attempts >= 3; const oks = mark(fin); if (fin) finish(oks); }
    return d;
  }
  // keep a question blurred until the student has actually played with the linkage above it
  function gate(actEl, id) {
    if (item(id)) return () => {};
    const note = document.createElement('p'); note.className = 'small'; note.innerHTML = '<b>Play with the linkage first.</b> The question unlocks when you have tried it properly.';
    actEl.parentNode.insertBefore(note, actEl); actEl.classList.add('peek-lock');
    return () => { if (!note.parentNode) return; note.remove(); actEl.classList.remove('peek-lock'); Book.sfx('pop', { gain: 0.35 }); };
  }
  const answered = (id) => { const it = item(id); return !!(it && (it.correct === true || it.attempts >= 3)); };

  // ======================================================================================
  Book.page({
    id: 'p08',
    title: 'Linkages: changing the motion',
    build(ui) {
      ui.h('Linkages: part 2');
      ui.p('Some linkages do more than pass a movement along: they <b>change</b> it. Play with each one, then say what it does.');
      const extras = new Set(), rEx = ui.record('p08.extras', { label: 'Extras tried (wipers, lazy tongs)', type: 'explore', max: 0 });
      const tried = (k) => { if (extras.has(k)) return; extras.add(k); rEx.set({ answer: [...extras].join(', '), correct: null }); };
      { const pv = rEx.get(); if (pv && pv.answer) pv.answer.split(', ').forEach((k) => extras.add(k)); }

      // ================================================================ 1. BELL CRANK
      ui.el('h2', '', 'Bell crank');
      ui.p('A <b>bell crank</b> is an L-shaped lever with a <b>fixed pivot at its corner</b>. Bicycle brake calipers use one. <b>Drag the red handle</b> and watch the green end.');
      const LW = 860, LH = 450, LC = [470, 300], LA = 140, LY = 160, LXO = LC[0] + LA - 7, LRI = 280, LRO = 190, LM = 0.45;
      const sl = { th: 0, thT: 0, touched: !!item('p08.bell'), off: 0, end: false, lo: false, hi: false };
      const gL = (th) => { const s = Math.sin(th) * LA, c = Math.cos(th) * LA, T = [LC[0] + s, LC[1] - c], R = [LC[0] + c, LC[1] + s]; return { T, R, Hd: [T[0] - Math.sqrt(LRI * LRI - (T[1] - LY) ** 2), LY], E: [LXO, R[1] - Math.sqrt(LRO * LRO - (R[0] - LXO) ** 2)] }; };
      const SL = Stage(ui, LW, LH);
      const statL = SL.layer((x) => { rail(x, [LC[0] - LRI - 92, LY], [LC[0] - LRI + 92, LY], 27); rail(x, [LXO, LC[1] - LRO - 84], [LXO, LC[1] - LRO + 84], 21); baseBlock(x, LC, 56); });
      const lIn = Tracker(), lOut = Tracker();
      SL.render = (dt, now) => {
        const x = SL.ctx;
        sl.th += (sl.thT - sl.th) * Math.min(1, dt * 24); if (Math.abs(sl.thT - sl.th) < 2e-4) sl.th = sl.thT;
        const g = gL(sl.th);
        SL.blit(statL);
        bar(x, g.Hd, g.T, { tint: TINT.red, seed: 11, w: 18 }); bar(x, g.R, g.E, { tint: TINT.green, seed: 13, w: 18 });
        bar(x, LC, g.T, { seed: 17, w: 26 }); bar(x, LC, g.R, { seed: 19, w: 26 });
        // tidy the corner so the two arms read as one L-shaped piece
        x.save(); x.translate(LC[0], LC[1]); x.rotate(sl.th); const K = [[-11, -22], [11, -22], [22, -11], [22, 11], [-11, 11]]; eraseP(x, K); fillP(x, K, TINT.blue); x.restore();
        movPivot(x, g.T); movPivot(x, g.R); pin(x, LC);
        grip(x, g.Hd, now, sl.touched); pad(x, g.E);
        lIn.step(g.Hd, dt); lOut.step(g.E, dt);
        arrow(x, [g.Hd[0] - Math.sign(lIn.u[0]) * 32, 114], [Math.sign(lIn.u[0]) || 1, 0], 64, RD, lIn.a);
        arrow(x, [g.E[0] + 52, g.E[1] - Math.sign(lOut.u[1]) * 32], [0, Math.sign(lOut.u[1]) || 1], 64, GR, lOut.a);
        text(x, 'INPUT', 40, 62, { size: 24, color: RD }); text(x, 'OUTPUT', 700, 118, { size: 24, color: GR });
        text(x, 'fixed pivot', LC[0] - 44, LC[1] + 66, { size: 22, font: 'hand', a: 0.8 });
        if (!sl.touched) text(x, 'drag me', g.Hd[0], 220, { size: 23, font: 'hand', color: RD, align: 'center' });
        if (sl.th < -0.8 * LM) sl.lo = true; if (sl.th > 0.8 * LM) sl.hi = true;
        if (sl.lo && sl.hi) openBell();
        return !sl.touched || SL.dragging() || sl.th !== sl.thT || lIn.a > 0 || lOut.a > 0;
      };
      SL.drag({
        hit(px, py) { const g = gL(sl.th); return dist([px, py], g.Hd) < 62 || (Math.abs(py - 160) < 42 && px > g.Hd[0] - 62 && px < g.T[0] - 34) ? 'h' : null; },
        move(t, px, py, first) {
          const f = (th) => gL(th).Hd[0]; if (first) sl.off = px - f(sl.thT);
          const want = px - sl.off, lo = f(-LM), hi = f(LM);
          sl.thT = bisect(f, clamp(want, lo, hi), -LM, LM);
          const end = want <= lo || want >= hi; if (end && !sl.end) Book.sfx('tock', { gain: 0.3 }); sl.end = end; sl.touched = true;
        },
      });
      SL.go();
      const bell = ui.mcq({ id: 'p08.bell', label: 'What does a bell crank do to the motion?', q: 'What does the bell crank do to the motion?',
        options: [
          { t: 'Turns it through 90°, round a corner', ok: true, why: 'The input went sideways and the output went up and down: the motion was turned through 90°.' },
          { t: 'Reverses it, to go the opposite way', mis: 'linkage-type', why: 'That is a reverse motion linkage. Look at the green end again: is it moving along the same line as the handle?' },
          { t: 'Keeps it going the same way, in parallel', mis: 'linkage-type', why: 'That is a push–pull linkage. Look at the green end again: is it moving along the same line as the handle?' },
          { t: 'Changes it into a full spinning motion', mis: 'motion-conversion', why: 'Nothing here goes all the way round. The L-shaped lever only rocks a little on its pivot.' },
        ] });
      const openBell = gate(bell, 'p08.bell');
      const notesL = ui.box('<b>Bell crank linkage:</b> turns the motion through <span class="key">90°</span> (round a corner). It is an L-shaped lever on a fixed pivot at the corner.<br><span class="small">Used in: bicycle brake calipers (the pull of the cable is turned through 90°), steering linkages.</span>', { tag: 'Notes' });
      if (!answered('p08.bell')) { lock([notesL], true); bell.addEventListener('click', () => setTimeout(() => { if (answered('p08.bell')) lock([notesL], false); }, 50)); }

      // ================================================================ 2. CRANK AND SLIDER
      ui.el('h2', '', 'Crank and slider');
      ui.p('A wheel (the <b>crank</b>), a <b>connecting rod</b> and a <b>slider</b> that runs in a guide. <b>Turn the wheel with your finger</b>, or tap Spin.');
      const KW = 860, KH = 400, KO = [215, 205], KR = 104, Kr = 74, Kl = 300;
      const kx = (p) => KO[0] + Kr * Math.cos(p) + Math.sqrt(Kl * Kl - Kr * Kr * Math.sin(p) * Math.sin(p));
      const kc = Cyc(kx, 0.03);
      const sk = { ph: -0.9, phT: -0.9, touched: !!item('p08.crank'), spin: false, drv: 'w', la: 0, off: 0, turned: 0, om: 0, oa: 0 };
      const SK = Stage(ui, KW, KH);
      const statK = SK.layer((x) => {
        baseBlock(x, KO, 56);
        [box(398, KO[1] - 31 - 18, 300, 18), box(398, KO[1] + 31, 300, 18)].forEach((P, i) => { Ink.hatchFill(x, P, 1, B, 1.7); Ink.stroke(x, closeP(P), { w: 2.1, seed: 61 + i, amp: 0.5 }); });
        text(x, 'guide', 700, KO[1] + 78, { size: 22, font: 'hand', a: 0.8, align: 'right' });
      });
      const kOut = Tracker();
      SK.render = (dt, now) => {
        const x = SK.ctx;
        if (sk.spin && !SK.dragging()) sk.phT += dt * 2.6;
        const d = (sk.phT - sk.ph) * Math.min(1, dt * 22); sk.ph += d; if (Math.abs(sk.phT - sk.ph) < 2e-4) sk.ph = sk.phT;
        sk.turned += Math.abs(d); if (sk.turned > TAU * 1.2) openCrank();
        sk.om += (d / Math.max(dt, 1e-3) - sk.om) * 0.3; if (Math.abs(sk.om) > 0.25) sk.oa = Math.min(1, sk.oa + dt * 10); else sk.oa = Math.max(0, sk.oa - dt * 1.6);
        const P = [KO[0] + Kr * Math.cos(sk.ph), KO[1] + Kr * Math.sin(sk.ph)], Sx = [kx(sk.ph), KO[1]];
        SK.blit(statK);
        wheel(x, KO, KR, sk.ph);
        const SP = geo.rect(Sx[0] - 50, Sx[1] - 30, 100, 60, 7);
        eraseP(x, SP); fillP(x, SP, TINT.green); x.save(); path(x, SP); x.clip(); Ink.hatchFill(x, box(Sx[0] - 50, Sx[1] + 4, 100, 26), 1, GR, 1.1); x.restore(); Ink.stroke(x, SP, { w: 2.4, color: GR, seed: 71, amp: 0.4 });
        bar(x, P, Sx, { seed: 15, w: 18 });
        pin(x, KO); movPivot(x, Sx); grip(x, P, now, sk.touched, 20);
        kOut.step(Sx, dt);
        const wCol = sk.drv === 'w' ? RD : GR, sCol = sk.drv === 'w' ? GR : RD, dir = sk.om >= 0 ? 1 : -1;
        arcArrow(x, KO, KR + 18, -2.3 - dir * 0.5, 1.0, dir, wCol, sk.oa);
        arrow(x, [Sx[0] - Math.sign(kOut.u[0]) * 32, KO[1] - 76], [Math.sign(kOut.u[0]) || 1, 0], 64, sCol, kOut.a);
        text(x, sk.drv === 'w' ? 'INPUT' : 'OUTPUT', 40, 40, { size: 24, color: wCol }); text(x, sk.drv === 'w' ? 'OUTPUT' : 'INPUT', KW - 40, 40, { size: 24, color: sCol, align: 'right' });
        if (!sk.touched) text(x, 'turn me', KO[0], KH - 18, { size: 23, font: 'hand', color: RD, align: 'center' });
        return !sk.touched || sk.spin || SK.dragging() || sk.ph !== sk.phT || sk.oa > 0 || kOut.a > 0;
      };
      SK.drag({
        hit(px, py) { if (dist([px, py], KO) < KR + 22) return 'w'; const sx = kx(sk.ph); return Math.abs(px - sx) < 70 && Math.abs(py - KO[1]) < 58 ? 's' : null; },
        move(t, px, py, first) {
          sk.touched = true;
          if (t === 'w') { const a = Math.atan2(py - KO[1], px - KO[0]); if (first || sk.drv !== 'w') { sk.la = a; sk.drv = 'w'; sk.phT = sk.ph; } sk.phT += wrap(a - sk.la); sk.la = a; }
          else { if (first) { sk.drv = 's'; sk.phT = sk.ph; kc.from(sk.ph); sk.off = px - kx(sk.ph); } const was = kc.br; sk.phT = kc.solve(sk.phT, px - sk.off); if (kc.br !== was) Book.sfx('tock', { gain: 0.25 }); }
        },
      });
      SK.go();
      const spinB = ui.el('button', 'btn ghost', '▶ Spin the wheel'); spinB.style.margin = '0 0 var(--R)';
      spinB.onclick = () => { sk.spin = !sk.spin; sk.drv = 'w'; sk.touched = true; spinB.textContent = sk.spin ? '❚❚ Stop the wheel' : '▶ Spin the wheel'; Book.sfx('tick', { gain: 0.5 }); SK.go(); };
      const notesK = ui.box('<b>Crank and slider:</b> converts <span class="key">rotary</span> motion into <span class="key">reciprocating</span> motion, or the other way round.<br>A <b>car engine</b> runs it backwards: the pistons reciprocate and turn the crankshaft (reciprocating → rotary). Try it: push the green slider to and fro.<br><span class="small">Also used in: pumps, jigsaws, mechanical toys.</span>', { tag: 'Notes' });
      const crankQ = motionQ(ui, { id: 'p08.crank', label: 'Crank and slider: input and output motion', q: 'You <b>turn the wheel</b>. What type of motion goes in, and what type comes out?',
        parts: [{ name: 'Input: the wheel', short: 'input', thing: 'the wheel', ans: 'rotary' }, { name: 'Output: the slider', short: 'output', thing: 'the slider', ans: 'reciprocating' }],
        explain: 'The wheel turns round and round (<b>rotary</b>). The slider goes backwards and forwards in a straight line (<b>reciprocating</b>).', onDone: () => lock([notesK], false) });
      ui.root.insertBefore(crankQ, notesK);
      const openCrank = gate(crankQ, 'p08.crank');
      if (!answered('p08.crank')) lock([notesK], true);

      // ================================================================ 3. TREADLE
      ui.el('h2', '', 'Treadle linkage');
      ui.p('Old sewing machines and potter’s wheels are driven by a foot pedal called a <b>treadle</b>. <b>Rock the red end of the pedal</b> up and down, all the way each time, and keep the wheel going.');
      const TW = 860, TH = 520, TA = [330, 420], TO = [585, 152], TR = 106, Tr = 55, TK = 230, Tl = 265, TF = 150;
      const tB = (p) => circ2(TA, TK, [TO[0] + Tr * Math.cos(p), TO[1] + Tr * Math.sin(p)], Tl, 1);
      const tpsi = (p) => { const b = tB(p); return Math.atan2(b[1] - TA[1], b[0] - TA[0]); };
      const tc = Cyc(tpsi, 0.06);
      const stt = { ph: 0.6, phT: 0.6, touched: !!item('p08.treadle'), auto: false, off: 0, turned: 0, om: 0, oa: 0 };
      const ST = Stage(ui, TW, TH);
      const statT = ST.layer((x) => {
        Ink.stroke(x, [[20, 506], [TW - 20, 506]], { w: 2.6, seed: 3 });
        for (let i = 0; i < 40; i++) { x.strokeStyle = rgba(B, 0.5); x.lineWidth = 1.2; x.beginPath(); x.moveTo(30 + i * 20.5, 508); x.lineTo(20 + i * 20.5, 518); x.stroke(); }
        const post = box(TA[0] - 13, TA[1] + 20, 26, 86); Ink.hatchFill(x, post, 1, B, 1.7); Ink.stroke(x, closeP(post), { w: 2, seed: 33, amp: 0.4 });
        baseBlock(x, TA, 52); baseBlock(x, TO, 56);
      });
      const tIn2 = Tracker();
      ST.render = (dt, now) => {
        const x = ST.ctx;
        if (stt.auto && !ST.dragging()) stt.phT += dt * 2.6;
        const d = (stt.phT - stt.ph) * Math.min(1, dt * 16); stt.ph += d; if (Math.abs(stt.phT - stt.ph) < 2e-4) stt.ph = stt.phT;
        stt.turned += Math.abs(d); if (stt.turned > TAU * 1.5) openTreadle();
        stt.om += (d / Math.max(dt, 1e-3) - stt.om) * 0.3; if (Math.abs(stt.om) > 0.25) stt.oa = Math.min(1, stt.oa + dt * 10); else stt.oa = Math.max(0, stt.oa - dt * 1.6);
        const C = [TO[0] + Tr * Math.cos(stt.ph), TO[1] + Tr * Math.sin(stt.ph)], Bp = tB(stt.ph), u = unit(Bp, TA), Ft = add(TA, u, -TF);
        ST.blit(statT);
        wheel(x, TO, TR, stt.ph);
        bar(x, Ft, Bp, { tint: TINT.red, seed: 17, w: 26 });
        bar(x, Bp, C, { seed: 15, w: 18 });
        pin(x, TO); pin(x, TA); movPivot(x, Bp); movPivot(x, C);
        grip(x, Ft, now, stt.touched);
        tIn2.step(Ft, dt);
        const dir = stt.om >= 0 ? 1 : -1;
        arcArrow(x, TO, TR + 18, -0.6 - dir * 0.5, 1.0, dir, GR, stt.oa);
        arrow(x, [Ft[0] - 52, Ft[1] - Math.sign(tIn2.u[1]) * 32], [0, Math.sign(tIn2.u[1]) || 1], 64, RD, tIn2.a);
        text(x, 'INPUT', 40, 300, { size: 24, color: RD }); text(x, 'OUTPUT', TW - 40, 40, { size: 24, color: GR, align: 'right' });
        if (!stt.touched) text(x, 'rock me', Ft[0] + 6, Ft[1] - 44, { size: 23, font: 'hand', color: RD, align: 'center' });
        return !stt.touched || stt.auto || ST.dragging() || stt.ph !== stt.phT || stt.oa > 0 || tIn2.a > 0;
      };
      ST.drag({
        hit(px, py) { const u = unit(tB(stt.ph), TA), Ft = add(TA, u, -TF); return dist([px, py], Ft) < 75 || (px < TA[0] - 30 && px > Ft[0] - 60 && Math.abs(py - (TA[1] + (px - TA[0]) * (u[1] / u[0]))) < 48) ? 'p' : null; },
        move(t, px, py, first) {
          const a = Math.atan2(TA[1] - py, Math.max(20, TA[0] - px));
          if (first) { stt.phT = stt.ph; tc.from(stt.ph); stt.off = a - tpsi(stt.ph); }
          const was = tc.br; stt.phT = tc.solve(stt.phT, a - stt.off); if (tc.br !== was) Book.sfx('tock', { gain: 0.25 }); stt.touched = true;
        },
      });
      ST.go();
      const autoB = ui.el('button', 'btn ghost', '▶ Pedal for me'); autoB.style.margin = '0 0 var(--R)';
      autoB.onclick = () => { stt.auto = !stt.auto; stt.touched = true; autoB.textContent = stt.auto ? '❚❚ Stop pedalling' : '▶ Pedal for me'; Book.sfx('tick', { gain: 0.5 }); ST.go(); };
      const notesT = ui.box('<b>Treadle linkage:</b> converts <span class="key">oscillating</span> motion (a foot pedal rocking) into <span class="key">rotary</span> motion, or rotary into oscillating.<br><b>Windscreen wipers</b> use it that second way: the motor’s rotary motion becomes the oscillating motion of the wipers.', { tag: 'Notes' });
      const treadQ = motionQ(ui, { id: 'p08.treadle', label: 'Treadle linkage: input and output motion', q: 'You <b>rock the pedal</b>. What type of motion goes in, and what type comes out?',
        parts: [{ name: 'Input: the pedal', short: 'input', thing: 'the pedal', ans: 'oscillating' }, { name: 'Output: the wheel', short: 'output', thing: 'the wheel', ans: 'rotary' }],
        explain: 'The pedal swings up and down in an arc about its pivot (<b>oscillating</b>). The wheel turns round and round (<b>rotary</b>).', onDone: () => lock([notesT], false) });
      ui.root.insertBefore(treadQ, notesT);
      const openTreadle = gate(treadQ, 'p08.treadle');
      if (!answered('p08.treadle')) lock([notesT], true);

      // ---------------- the same linkage the other way round: a windscreen wiper
      ui.p('A windscreen wiper uses the same linkage the other way round. <b>Start the motor</b> (or turn it with your finger) and clear the rain.');
      const VW = 860, VH = 420, VA = [540, 282], VK = 64, VO = [300, 346], Vr = 42, Vl = 240, VB = 236;
      const vB = (p) => { const C = [VO[0] + Vr * Math.cos(p), VO[1] + Vr * Math.sin(p)], a = circ2(VA, VK, C, Vl, 1), b = circ2(VA, VK, C, Vl, -1); return a[1] > b[1] ? a : b; };
      const vang = (p) => { const b = vB(p); return Math.atan2(VA[1] - b[1], VA[0] - b[0]); }; // direction of the blade (pointing up the screen)
      const vc = Cyc(vang);
      const sv = { ph: 2, phT: 2, touched: extras.has('wipers'), on: false, la: 0, turned: 0, last: null };
      const rr = H.rng(77), drops = []; for (let i = 0; i < 70; i++) drops.push({ a: vc.vmin - 0.05 + rr() * (vc.vmax - vc.vmin + 0.1), r: 74 + rr() * (VB - 78), t: -9, s: 0.7 + rr() * 0.6 });
      const SV = Stage(ui, VW, VH);
      const statV = SV.layer((x) => {
        const a0 = vc.vmin - 0.09, a1 = vc.vmax + 0.09, arc = (r) => { const P = []; for (let i = 0; i <= 30; i++) { const a = a0 + (a1 - a0) * i / 30; P.push([VA[0] + Math.cos(a) * r, VA[1] + Math.sin(a) * r]); } return P; };
        const o = arc(VB + 8), n = arc(62);
        Ink.stroke(x, o, { w: 2.4, seed: 81, amp: 0.6 }); Ink.stroke(x, n, { w: 2, seed: 82, amp: 0.4 }); Ink.stroke(x, [n[0], o[0]], { w: 2.2, seed: 83 }); Ink.stroke(x, [n[30], o[30]], { w: 2.2, seed: 84 });
        text(x, 'windscreen', VA[0] + 150, 52, { size: 22, font: 'hand', a: 0.8 }); text(x, 'motor', VO[0] - 118, VO[1] - 46, { size: 22, font: 'hand', a: 0.8 });
        baseBlock(x, VA, 46); baseBlock(x, VO, 46);
      });
      SV.render = (dt, now) => {
        const x = SV.ctx;
        if (sv.on && !SV.dragging()) sv.phT += dt * 3.2;
        const d = (sv.phT - sv.ph) * Math.min(1, dt * 22); sv.ph += d; if (Math.abs(sv.phT - sv.ph) < 2e-4) sv.ph = sv.phT;
        sv.turned += Math.abs(d); if (sv.turned > TAU) tried('wipers');
        const C = [VO[0] + Vr * Math.cos(sv.ph), VO[1] + Vr * Math.sin(sv.ph)], Bp = vB(sv.ph), an = vang(sv.ph), tip = [VA[0] + Math.cos(an) * VB, VA[1] + Math.sin(an) * VB];
        if (sv.last != null) { const lo = Math.min(sv.last, an) - 0.02, hi = Math.max(sv.last, an) + 0.02; drops.forEach((q) => { if (q.a >= lo && q.a <= hi) q.t = now; }); }
        sv.last = an;
        SV.blit(statV);
        x.save(); x.strokeStyle = rgba(B, 0.75); x.lineWidth = 1.6; x.fillStyle = 'rgba(120,150,240,0.3)';
        drops.forEach((q) => { const age = now - q.t; if (age < 2.2) return; const k = Math.min(1, (age - 2.2) / 0.6) * q.s, px = VA[0] + Math.cos(q.a) * q.r, py = VA[1] + Math.sin(q.a) * q.r; x.beginPath(); x.moveTo(px, py - 8 * k); x.quadraticCurveTo(px + 6 * k, py + 2 * k, px, py + 5 * k); x.quadraticCurveTo(px - 6 * k, py + 2 * k, px, py - 8 * k); x.fill(); x.stroke(); });
        x.restore();
        wheel(x, VO, 60, sv.ph, 91);
        bar(x, Bp, tip, { seed: 17, w: 14, hatch: false });
        { const u = unit(tip, VA), n = [-u[1], u[0]]; Ink.stroke(x, [add(add(VA, u, 70), n, 10), add(add(VA, u, VB), n, 10)], { w: 4.2, seed: 21, amp: 0.2 }); }
        bar(x, C, Bp, { seed: 15, w: 16 });
        pin(x, VO); pin(x, VA); movPivot(x, Bp, 6.5); grip(x, C, now, sv.touched, 17);
        if (!sv.touched) text(x, 'turn me', VO[0] - 118, VO[1] + 62, { size: 23, font: 'hand', color: RD, align: 'center' });
        return !sv.touched || sv.on || SV.dragging() || sv.ph !== sv.phT || drops.some((q) => now - q.t < 2.9);
      };
      SV.drag({
        hit(px, py) { return dist([px, py], VO) < 92 ? 'w' : null; },
        move(t, px, py, first) { const a = Math.atan2(py - VO[1], px - VO[0]); if (first) { sv.la = a; sv.phT = sv.ph; } sv.phT += wrap(a - sv.la); sv.la = a; sv.touched = true; },
      });
      SV.go();
      const motB = ui.el('button', 'btn ghost', '▶ Start the motor'); motB.style.margin = '0 0 var(--R)';
      motB.onclick = () => { sv.on = !sv.on; sv.touched = true; motB.textContent = sv.on ? '❚❚ Stop the motor' : '▶ Start the motor'; Book.sfx('tick', { gain: 0.5 }); SV.go(); };

      // ================================================================ 4. LAZY TONGS (quick extra)
      ui.el('h2', '', 'Extra: lazy tongs');
      ui.p('<b>Lazy tongs</b> (a scissor linkage) are several crossed levers. <b>Squeeze the red handle</b> up and down, or pull the green end.');
      const ZW = 860, ZH = 300, ZC = [180, 150], Zh = 52, ZN = 5, ZD = 88, ZA0 = 0.3, ZA1 = 1.25;
      const sz = { al: 1.25, alT: 1.25, touched: extras.has('lazy tongs'), off: 0, lo: false, hi: false };
      const SZ = Stage(ui, ZW, ZH);
      const statZ = SZ.layer((x) => { baseBlock(x, ZC, 46); });
      const zIn = Tracker(), zOut = Tracker();
      const zTip = (al) => ZC[0] + (2 * ZN - 1) * Zh * Math.cos(al);
      SZ.render = (dt, now) => {
        const x = SZ.ctx;
        sz.al += (sz.alT - sz.al) * Math.min(1, dt * 24); if (Math.abs(sz.alT - sz.al) < 2e-4) sz.al = sz.alT;
        const c = Math.cos(sz.al), s = Math.sin(sz.al);
        SZ.blit(statZ);
        const ctr = (i) => [ZC[0] + i * 2 * Zh * c, ZC[1]];
        for (let i = ZN - 1; i >= 0; i--) { const q = ctr(i), bk = i ? Zh : ZD; bar(x, [q[0] - bk * c, q[1] + bk * s], [q[0] + Zh * c, q[1] - Zh * s], { seed: 15 + i, w: 16 }); }
        for (let i = ZN - 1; i >= 0; i--) { const q = ctr(i), bk = i ? Zh : ZD; bar(x, [q[0] - bk * c, q[1] - bk * s], [q[0] + Zh * c, q[1] + Zh * s], { seed: 25 + i, w: 16 }); }
        for (let i = 0; i < ZN; i++) { const q = ctr(i); if (i) movPivot(x, q, 6.5); if (i < ZN - 1) { movPivot(x, [q[0] + Zh * c, q[1] - Zh * s], 6.5); movPivot(x, [q[0] + Zh * c, q[1] + Zh * s], 6.5); } }
        pin(x, ZC);
        const last = ctr(ZN - 1), e1 = [last[0] + Zh * c, last[1] - Zh * s], e2 = [last[0] + Zh * c, last[1] + Zh * s], hd = [ZC[0] - ZD * c, ZC[1] - ZD * s], hd2 = [ZC[0] - ZD * c, ZC[1] + ZD * s];
        pad(x, e1, 12); pad(x, e2, 12); grip(x, hd, now, sz.touched, 20); grip(x, hd2, now, true, 20);
        zIn.step(hd, dt); zOut.step(e1, dt);
        arrow(x, [hd[0] - 46, hd[1] - Math.sign(zIn.u[1]) * 24], [0, Math.sign(zIn.u[1]) || 1], 48, RD, zIn.a);
        arrow(x, [last[0] + Zh * c - Math.sign(zOut.u[0]) * 32 + 4, 40], [Math.sign(zOut.u[0]) || 1, 0], 64, GR, zOut.a);
        text(x, 'INPUT', 28, 34, { size: 24, color: RD }); text(x, 'OUTPUT', ZW - 30, ZH - 20, { size: 24, color: GR, align: 'right' });
        if (sz.al < ZA0 + 0.15) sz.lo = true; if (sz.al > ZA1 - 0.15) sz.hi = true; if (sz.lo && sz.hi) tried('lazy tongs');
        return !sz.touched || SZ.dragging() || sz.al !== sz.alT || zIn.a > 0 || zOut.a > 0;
      };
      SZ.drag({
        hit(px, py) { const c = Math.cos(sz.al), s = Math.sin(sz.al); if (dist([px, py], [ZC[0] - ZD * c, ZC[1] - ZD * s]) < 58) return 'u'; if (dist([px, py], [ZC[0] - ZD * c, ZC[1] + ZD * s]) < 58) return 'd'; return px > ZC[0] + 20 && px < zTip(sz.al) + 60 && Math.abs(py - ZC[1]) < 90 ? 't' : null; },
        move(t, px, py, first) {
          sz.touched = true;
          if (t === 't') { if (first) sz.off = px - zTip(sz.alT); sz.alT = Math.acos(clamp((px - sz.off - ZC[0]) / ((2 * ZN - 1) * Zh), Math.cos(ZA1), Math.cos(ZA0))); }
          else { const dy = t === 'u' ? ZC[1] - py : py - ZC[1]; if (first) sz.off = dy - ZD * Math.sin(sz.alT); sz.alT = Math.asin(clamp((dy - sz.off) / ZD, Math.sin(ZA0), Math.sin(ZA1))); }
        },
      });
      SZ.go();
      const notesZ = ui.box('<b>Lazy tongs</b> (scissor linkage): several crossed levers that <span class="key">extend a long way</span> from a small input.<br><span class="small">Used in: scissor lifts, extending mirrors, grabber toys.</span>', { tag: 'Notes' });

      // ================================================================ MATCH UP
      ui.el('h2', '', 'Match them up');
      ui.p('<span class="small">Six linkages from the last two pages. The notes and your answers above will blur while you match.</span>');
      const match = ui.match({ id: 'p08.match', label: 'Match 6 linkages to what they do', q: 'Tap a linkage, then tap what it does.',
        pairs: [
          ['Reverse motion', 'output goes the opposite way to the input', 'linkage-type'],
          ['Push–pull', 'output goes the same way as the input', 'linkage-type'],
          ['Bell crank', 'turns the motion through 90°', 'linkage-type'],
          ['Crank and slider', 'rotary ↔ reciprocating', 'motion-conversion'],
          ['Treadle', 'oscillating ↔ rotary', 'motion-conversion'],
          ['Lazy tongs', 'a small input extends a long way', 'linkage-type'],
        ] });
      ui.hideWhile(match, 'p08.match', [notesL, notesK, notesT, notesZ, bell, crankQ, treadQ]);
    },
  });
})();
