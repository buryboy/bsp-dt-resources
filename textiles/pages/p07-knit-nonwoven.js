// Page 7 — Knitted & non-woven. Pull a broken stitch in a weft knit (it ladders) and a warp knit (it holds); stretch a
// woven and a knitted swatch; make felt in a bowl (heat, moisture, pressure, friction); bond a fibre web with a hot
// roller; then recall with an MCQ and a ten-card sort.
(function () {
  'use strict';
  const B = Ink.BLUE, RD = Ink.RED, GR = Ink.GREEN, rgba = Ink.rgba, geo = Ink.geo;
  const HANDF = (s) => `400 ${s}px "Gloria Hallelujah", "Comic Sans MS", cursive`;
  const LABF = (s) => `600 ${s}px Fredoka, "Arial Rounded MT Bold", system-ui, sans-serif`;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const mod = (a, n) => ((a % n) + n) % n;
  const ease = (u) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2);
  const got = (id) => Book.state.items[id];

  function text(x, s, px, py, o = {}) {
    x.save(); x.font = (o.font === 'hand' ? HANDF : LABF)(o.size || 22);
    x.fillStyle = rgba(o.color || B, o.a ?? 0.92); x.textAlign = o.align || 'left'; x.textBaseline = 'alphabetic';
    x.translate(px, py); if (o.rot) x.rotate(o.rot); x.fillText(s, 0, 0); x.restore();
  }
  function pen(x, pts, o = {}) {
    const P = o.wob === false ? pts : geo.wob(geo.seg(pts, 3), o.seed ?? 11, o.amp ?? 0.6);
    x.save(); x.strokeStyle = rgba(o.color || B, o.a ?? 0.85); x.lineWidth = o.w ?? 1.6; x.lineCap = 'round'; x.lineJoin = 'round';
    if (o.dash) x.setLineDash(o.dash);
    x.beginPath(); P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); if (o.close) x.closePath(); x.stroke(); x.restore();
  }
  const box4 = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]];

  // an interactive canvas with an on-demand render loop (stops when the page is hidden)
  function Stage(parent, W, Hh) {
    const c = document.createElement('canvas'); c.className = 'tk7-stage'; parent.appendChild(c);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = Math.round(W * dpr); c.height = Math.round(Hh * dpr);
    Object.assign(c.style, { width: '100%', height: 'auto', aspectRatio: W + ' / ' + Hh, display: 'block', touchAction: 'pan-y', userSelect: 'none', webkitUserSelect: 'none', webkitTouchCallout: 'none', cursor: 'pointer' });
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
    // drag inside a hit zone (that touch no longer scrolls the page); a touch that hardly moves is a tap
    S.drag = (hit, on) => {
      let id = null, p0 = null, moved = 0, tgt = null;
      c.addEventListener('touchstart', (e) => { if (hit(S.pos(e.changedTouches[0]))) e.preventDefault(); }, { passive: false });
      c.addEventListener('pointerdown', (e) => { const p = S.pos(e); tgt = hit(p); if (id !== null || !tgt) return; id = e.pointerId; p0 = p; moved = 0; try { c.setPointerCapture(id); } catch (er) {} on.start && on.start(p, tgt); S.go(); });
      c.addEventListener('pointermove', (e) => { if (e.pointerId !== id) return; const p = S.pos(e); moved += Math.hypot(p[0] - p0[0], p[1] - p0[1]); on.move && on.move(p, p0, tgt); p0 = p; S.go(); });
      ['pointerup', 'pointercancel'].forEach((ev) => c.addEventListener(ev, (e) => { if (e.pointerId !== id) return; id = null; S.dragged = performance.now(); on.end && on.end(moved < 10, tgt); S.go(); }));
      S.dragging = () => id !== null;
    };
    S.dragging = () => false; S.dragged = 0;
    // a plain tap that was not part of a drag
    S.tap = (fn) => c.addEventListener('click', (e) => { if (performance.now() - S.dragged < 350) return; fn(S.pos(e)); S.go(); });
    if (document.fonts) document.fonts.ready.then(() => { S.onFonts && S.onFonts(); S.go(); });
    return S;
  }

  function css() {
    if (document.getElementById('tk7-css')) return;
    const s = document.createElement('style'); s.id = 'tk7-css';
    s.textContent = `
      .tk7-lab { position: relative; margin: 0 0 calc(var(--R) * 1.2); padding: 12px 14px 14px; background: rgba(251,250,245,.9); }
      .tk7-step { font: 700 14px Fredoka, system-ui; letter-spacing: .08em; text-transform: uppercase; color: var(--red); line-height: 24px; margin-top: 4px; }
      .tk7-task { font-size: 18px; line-height: 1.45; margin: 2px 0 8px; }
      .tk7-task b { font-family: Fredoka, system-ui; font-weight: 600; }
      .tk7-row { display: flex; flex-wrap: wrap; gap: 10px; align-items: stretch; margin: 6px 0 8px; }
      .tk7-row .opt { flex: 1 1 170px; text-align: center; min-height: 52px; }
      .tk7-col .opt { display: block; width: 100%; margin: 0 0 8px; }
      .tk7-msg { font-size: 18px; line-height: 1.45; margin: 4px 0; color: var(--red); }
      .tk7-hide { display: none !important; }
    `;
    document.head.appendChild(s);
  }
  const TAU = Math.PI * 2;
  const frame = (el) => requestAnimationFrame(() => Ink.frame(el, { shadow: false, w: 2.2 }));

  // a little multiple-choice block whose answer goes into a bench's own record
  function quiz(ui, parent, o) {
    const d = ui.el('div', '', null, parent); ui.el('div', 'tk7-task', o.q, d);
    const col = ui.el('div', 'tk7-col', null, d), fb = ui.el('div', 'fb', '', d);
    const opts = Book.shuffle(o.options, o.seed || 3);
    const bs = opts.map((op) => {
      const b = ui.el('button', 'opt', Book.esc(op.t), col); b.type = 'button';
      const mark = (ok) => { b.classList.add(ok ? 'right' : 'wrong'); if (ok) bs.forEach((q) => (q.disabled = true)); fb.className = 'fb on ' + (ok ? 'good' : 'bad'); fb.innerHTML = (ok ? '✓ ' : '✗ ') + op.why; };
      b.onclick = () => { const ok = !!op.ok; Book.sfx(ok ? 'success' : 'error', { gain: 0.35 }); mark(ok); o.onPick(op, ok); };
      if (o.prev && o.prev.ok && o.prev.said === op.t) setTimeout(() => mark(true));
      return b;
    });
    return d;
  }

  // ---------- knitted structures (plain canvas paths: they are redrawn while the student pulls) ----------
  // weft knit: each row is ONE yarn making a loop in every column. drop(r, c) = 0..1 how far that loop has run out.
  function weftKnit(x, x0, y0, sw, rh, cols, rows, drop, o = {}) {
    for (let r = 0; r < rows; r++) {
      const y = y0 + r * rh, yb = y + rh * 0.55;
      x.strokeStyle = rgba(o.color || B, 0.9); x.lineWidth = o.w || 2.4; x.beginPath(); x.moveTo(x0, yb);
      for (let c = 0; c < cols; c++) {
        const px = x0 + c * sw, d = drop ? drop(r, c) : 0, yt = yb - rh * 1.3 * (1 - d);
        if (d >= 1) { x.lineTo(px + sw, yb); continue; }
        x.bezierCurveTo(px + sw * 0.42, yb, px + sw * 0.08, yt, px + sw * 0.5, yt);
        x.bezierCurveTo(px + sw * 0.92, yt, px + sw * 0.58, yb, px + sw, yb);
      }
      x.stroke();
    }
  }
  // warp knit: MANY yarns; each one zig-zags up the fabric, making a loop in one column, then the next column
  function warpKnit(x, x0, y0, sw, rh, cols, rows, sag) {
    for (let i = 0; i < cols - 1; i++) {
      x.strokeStyle = rgba(B, 0.9); x.lineWidth = 2.2; x.beginPath();
      for (let r = 0; r < rows; r++) {
        const xc = x0 + (i + 0.5 + (r % 2)) * sw, s = sag ? sag(r, i) : 0, y = y0 + r * rh + s, yb = y + rh * 0.5, yt = y - rh * 0.72;
        if (r === 0) x.moveTo(xc - sw * 0.28, yb); else x.lineTo(xc - sw * 0.28, yb);
        x.bezierCurveTo(xc - sw * 0.5, yt + 4, xc - sw * 0.2, yt, xc, yt);
        x.bezierCurveTo(xc + sw * 0.2, yt, xc + sw * 0.5, yt + 4, xc + sw * 0.28, yb);
      }
      x.stroke();
    }
  }

  // ======================================================================================
  // bench 1: the ladder test
  // ======================================================================================
  function ladderBench(ui, lab, onChange) {
    const W = 860, H = 430, sw = 36, rh = 26, cols = 8, rows = 10, AX = 70, BX = 500, Y0 = 130, cb = 4, rb = 2;
    const rec = ui.record('p07.ladder', { label: 'Ladder test: weft knit v warp knit (predict, pull, conclude)', type: 'bench', max: 1 });
    const it = got('p07.ladder') || {};
    const s = { pred: it.pred || '', a: it.a ? 1 : 0, b: it.b ? 1 : 0, said: it.said || '', ok: it.correct === true };
    const save = () => rec.set({ answer: (s.pred ? 'predicted: ' + s.pred : 'no prediction') + (s.a ? '; pulled A: it laddered' : '') + (s.b ? '; pulled B: it held' : '') + (s.said ? `; concluded: "${s.said}" ${s.ok ? '✓' : '✗'}` : ''),
      correct: s.said ? s.ok : null, score: s.ok ? 1 : 0, max: 1, mis: s.said && !s.ok ? 'knit-type' : '', pred: s.pred, a: !!s.a, b: !!s.b, said: s.said });
    ui.el('div', 'tk7-step', '1 · Predict', lab);
    ui.el('div', 'tk7-task', 'Two knitted fabrics. In each one, <b>one stitch has snapped</b>. You are going to pull the broken loop. What will happen?', lab);
    const prow = ui.el('div', 'tk7-row', null, lab);
    const PRED = ['A unravels, B holds', 'B unravels, A holds', 'Both unravel', 'Both hold'];
    const pb = PRED.map((t) => { const b = ui.el('button', 'opt', t, prow); b.type = 'button'; if (s.pred === t) b.classList.add('sel');
      b.onclick = () => { if (s.a || s.b) return; s.pred = t; pb.forEach((q) => q.classList.remove('sel')); b.classList.add('sel'); Book.scribble(0.12); save(); sync(); }; return b; });
    ui.el('div', 'tk7-step', '2 · Test', lab);
    const task = ui.el('div', 'tk7-task', '', lab);
    const box = ui.el('div', '', null, lab), S = Stage(box, W, H);
    const conc = ui.el('div', '', null, lab);
    ui.el('div', 'tk7-step', '3 · What did you find?', conc);
    quiz(ui, conc, { q: 'Which is true?', seed: 11, prev: s, options: [
      { t: 'The weft knit laddered: its one yarn ran out loop by loop', ok: true, why: 'Yes. In a weft knit every loop hangs from the loop above, all on one yarn, so one broken stitch lets a whole column drop: a ladder.' },
      { t: 'The warp knit laddered: its many yarns slid out one by one', why: 'Look at the bench again: fabric B (the warp knit) held. Which fabric got the ladder?' },
      { t: 'Both laddered: every knitted fabric runs when a loop snaps', why: 'Look at the bench again: only one of them ran. Which one held?' },
    ], onPick(op, ok) { s.said = op.t; s.ok = ok; save(); sync(); } });
    // state of the pulls: run = how many rows of A have dropped (float), hold = 0..1 strain on B
    let run = s.a ? rows - rb - 1 : 0, running = !!s.a && false, pullA = 0, pullB = s.b ? 0.0001 : 0, shake = 0, grab = null, at = null;
    const hA = [AX + cb * sw + sw / 2, Y0 + rb * rh - 4], hB = [BX + 3.5 * sw, Y0 + rb * rh - 4];
    let base = null;
    function art() {
      base = S.layer(W, H, (x) => {
        text(x, 'A · weft knit', AX, 34, { size: 26 }); text(x, 'ONE yarn loops across, row by row', AX, 64, { font: 'hand', size: 22 });
        text(x, 'B · warp knit', BX, 34, { size: 26 }); text(x, 'MANY yarns, each looping up', BX, 64, { font: 'hand', size: 22 });
      });
    }
    art(); S.onFonts = art;
    S.drag((p) => { if (!s.pred) return null; if (!s.a && Math.hypot(p[0] - hA[0], p[1] - hA[1]) < 48) return 'A'; if (!s.b && Math.hypot(p[0] - hB[0], p[1] - hB[1]) < 48) return 'B'; return null; }, {
      start(p, tgt) { grab = tgt; at = p; },
      move(p, p0, tgt) {
        at = p;
        if (tgt === 'A') { pullA = clamp((p[1] - hA[1]) / 70, 0, 1); if (pullA >= 1 && !running) startRun(); }
        if (tgt === 'B') { const b = pullB; pullB = clamp((p[1] - hB[1]) / 70, 0, 1); if (pullB >= 1 && b < 1) heldB(); }
      },
      end(tap, tgt) { grab = null; if (tap && tgt === 'A' && !running) { pullA = 1; startRun(); } if (tap && tgt === 'B' && !s.b) { pullB = 1; heldB(); } if (tgt === 'B') pullB = s.b ? 0.0001 : 0; if (tgt === 'A' && !running) pullA = 0; },
    });
    function startRun() { running = true; Book.sfx('pop', { gain: 0.4 }); }
    function heldB() { s.b = 1; shake = 0.35; Book.sfx('thud', { gain: 0.4 }); save(); sync(); }
    S.render = (dt, t) => {
      const x = S.ctx; let busy = S.dragging();
      S.blit(base, 0, 0);
      if (running && run < rows - rb - 1) { const b = Math.floor(run); run = Math.min(rows - rb - 1, run + dt * 5); busy = true; if (Math.floor(run) !== b) Book.sfx('tick', { gain: 0.5 }); if (run >= rows - rb - 1) { running = false; s.a = 1; Book.sfx('error', { gain: 0.3 }); save(); sync(); } }
      // A: rows below the break drop one after another in column cb
      weftKnit(x, AX, Y0, sw, rh, cols, rows, (r, c) => (c !== cb ? 0 : r === rb ? 1 : r > rb ? clamp(run - (r - rb - 1)) : 0));
      // the snapped ends
      const end = (px, py, dx) => { x.strokeStyle = rgba(RD, 0.95); x.lineWidth = 3; x.beginPath(); x.moveTo(px, py); x.quadraticCurveTo(px + dx * 8, py - 16, px + dx * 16, py - 10); x.stroke(); };
      const ya = Y0 + rb * rh + rh * 0.55; end(AX + cb * sw + 2, ya, 1); end(AX + (cb + 1) * sw - 2, ya, -1);
      if (run > 0) for (let r = rb + 1; r < rows; r++) { const d = clamp(run - (r - rb - 1)); if (d >= 1) { const yb = Y0 + r * rh + rh * 0.55; x.strokeStyle = rgba(RD, 0.9); x.lineWidth = 3; x.beginPath(); x.moveTo(AX + cb * sw, yb); x.lineTo(AX + (cb + 1) * sw, yb); x.stroke(); } }
      // B: the neighbours take the strain; nothing runs
      const sx = shake > 0 ? Math.sin(t * 70) * 2 : 0; if (shake > 0) { shake -= dt; busy = true; }
      x.save(); x.translate(sx, 0);
      warpKnit(x, BX, Y0, sw, rh, cols, rows, (r, i) => (grab === 'B' && Math.abs(i - 3) <= 1 && r >= rb && r <= rb + 2 ? pullB * 5 * (1 - Math.abs(r - rb - 1) / 2) : 0));
      // one snapped loop: blank it out and show two red ends
      x.save(); x.globalCompositeOperation = 'destination-out'; x.beginPath(); x.arc(hB[0], hB[1] - 8, 9, 0, 7); x.fill(); x.restore();
      end(hB[0] - 9, hB[1] - 4, -1); end(hB[0] + 9, hB[1] - 4, 1);
      x.restore();
      // pull handles
      const handle = (h, on, lab2) => { if (!on) return; const py = grab && at && ((grab === 'A' && h === hA) || (grab === 'B' && h === hB)) ? clamp(at[1], h[1], h[1] + 80) : h[1];
        if (py > h[1]) { x.strokeStyle = rgba(RD, 0.9); x.lineWidth = 2.6; x.beginPath(); x.moveTo(h[0], h[1]); x.lineTo(h[0], py); x.stroke(); }
        x.save(); x.globalCompositeOperation = 'source-over'; x.fillStyle = 'rgba(255,243,176,.92)'; x.beginPath(); x.arc(h[0], py, 23, 0, 7); x.fill(); x.restore();
        Ink.stroke(x, geo.ellipse(h[0], py, 23, 23), { w: 3, color: RD, seed: 9, amp: 0.4, retrace: false });
        pen(x, [[h[0], py - 10], [h[0], py + 10]], { w: 3, color: RD, wob: false }); pen(x, [[h[0] - 8, py + 2], [h[0], py + 11], [h[0] + 8, py + 2]], { w: 3, color: RD, wob: false });
        text(x, lab2, h[0] + 34, h[1] - 30, { font: 'hand', size: 22, color: RD }); };
      handle(hA, s.pred && !s.a && !running, 'pull me'); handle(hB, s.pred && !s.b, 'pull me');
      if (s.a) Ink.drawBubble(x, 'it laddered!', AX + cols * sw / 2, H - 16, 36, RD, 1, -0.02, 'center');
      if (s.b) Ink.drawBubble(x, 'it held', BX + cols * sw / 2, H - 16, 36, GR, 1, 0.02, 'center');
      return busy;
    };
    function sync() {
      task.innerHTML = !s.pred ? '<span class="tk7-msg">Make your prediction first: then you can pull.</span>' : !(s.a && s.b) ? 'Drag each red broken loop <b>downwards</b> (or tap it).' : 'Both tested.';
      if (s.a || s.b) pb.forEach((q) => (q.disabled = true));
      conc.classList.toggle('tk7-hide', !(s.a && s.b));
      S.go(); onChange();
    }
    sync();
    return { done: () => s.ok, started: () => !!(s.a || s.b) };
  }

  // ======================================================================================
  // bench 2: stretch a woven and a knitted swatch
  // ======================================================================================
  function stretchBench(ui, lab, onChange) {
    const W = 860, H = 440, X0 = 150, W0 = 300, MAXW = 0.03, MAXK = 0.6;
    const rec = ui.record('p07.stretch', { label: 'Stretch test: woven v knitted (pull, conclude)', type: 'bench', max: 1 });
    const it = got('p07.stretch') || {};
    const s = { w: it.w || 0, k: it.k || 0, said: it.said || '', ok: it.correct === true };
    const pc = (v) => Math.round(v * 100);
    const tested = () => s.w >= MAXW && s.k >= 0.4;
    const save = () => rec.set({ answer: `pulled woven: +${pc(s.w)}%; pulled knitted: +${pc(s.k)}%` + (s.said ? `; concluded: "${s.said}" ${s.ok ? '✓' : '✗'}` : ''), correct: s.said ? s.ok : null, score: s.ok ? 1 : 0, max: 1, mis: s.said && !s.ok ? 'woven-vs-knit' : '', w: s.w, k: s.k, said: s.said });
    ui.el('div', 'tk7-step', '1 · Test', lab);
    const task = ui.el('div', 'tk7-task', 'Grab each red handle and <b>pull it sideways</b> as far as it will go. Then let go.', lab);
    const box = ui.el('div', '', null, lab), S = Stage(box, W, H);
    const conc = ui.el('div', '', null, lab);
    ui.el('div', 'tk7-step', '2 · What did you find?', conc);
    quiz(ui, conc, { q: 'Which fabric stretched more, and why?', seed: 7, prev: s, options: [
      { t: 'The knitted one: its loops can open out and change shape', ok: true, why: 'Yes. Loops can straighten and open, so knitted fabric stretches (a comfortable, good fit). The straight yarns of a woven fabric have nowhere to go.' },
      { t: 'The woven one: its straight yarns can slide apart easily', why: 'Check the bench again: the woven swatch hardly moved. Woven fabric has little stretch.' },
      { t: 'The knitted one: its yarn must be made of stretchy rubber', why: 'It did stretch more, but not because of the fibre: both swatches use the same yarn. Look at the shape the yarn makes.' },
      { t: 'Neither: both fabrics stretched by about the same amount', why: 'Check the readings again: one hardly moved and one grew a lot.' },
    ], onPick(op, ok) { s.said = op.t; s.ok = ok; save(); sync(); } });
    const SW = [{ key: 'w', name: 'woven', y: 60, max: MAXW, e: 0 }, { key: 'k', name: 'knitted', y: 250, max: MAXK, e: 0 }];
    const HH = 130; let grab = null, hit = 0, base = null;
    function art() {
      base = S.layer(W, H, (x) => {
        SW.forEach((q, i) => {
          const P = geo.rect(X0 - 46, q.y - 12, 46, HH + 24, 6); Ink.hatchFill(x, P, 1, B, 0.9); Ink.stroke(x, P, { w: 2.6, seed: 5 + i, amp: 0.5 });
          text(x, q.name, 8, q.y + 40, { size: 26 }); text(x, 'clamped', 8, q.y + 70, { font: 'hand', size: 22 });
          pen(x, [[X0 + W0, q.y - 10], [X0 + W0, q.y + HH + 22]], { w: 1.6, dash: [6, 6], wob: false, a: 0.6 }); if (i) text(x, 'start', X0 + W0, q.y + HH + 46, { size: 22, align: 'center', a: 0.7 });
        });
      });
    }
    art(); S.onFonts = art;
    const hx = (q) => X0 + W0 * (1 + q.e);
    S.drag((p) => { const i = SW.findIndex((q) => Math.abs(p[0] - (hx(q) + 26)) < 52 && p[1] > q.y - 20 && p[1] < q.y + HH + 20); return i < 0 ? null : SW[i]; }, {
      start(p, q) { grab = q; q.off = p[0] - hx(q); },
      move(p, p0, q) {
        const want = (p[0] - q.off - X0) / W0 - 1; q.e = clamp(want, 0, q.max);
        if (want > q.max + 0.04 && performance.now() - hit > 700) { hit = performance.now(); Book.sfx('thud', { gain: 0.35 }); }
        if (q.e > s[q.key]) s[q.key] = Math.round(q.e * 100) / 100;
      },
      end(tap, q) { grab = null; save(); sync(); },
    });
    S.render = (dt, t) => {
      const x = S.ctx; let busy = S.dragging();
      S.blit(base, 0, 0);
      SW.forEach((q) => {
        if (grab !== q && q.e > 0) { q.e = Math.max(0, q.e - dt * (0.4 + q.e * 5)); busy = true; }
        const w = W0 * (1 + q.e), y = q.y, jam = grab === q && q.e >= q.max && performance.now() - hit < 250 ? Math.sin(t * 80) * 1.5 : 0;
        if (jam) busy = true;
        if (q.key === 'w') {
          x.strokeStyle = rgba(B, 0.85); x.lineWidth = 2; x.beginPath();
          for (let i = 0; i <= 20; i++) { const px = X0 + (w * i) / 20; x.moveTo(px, y); x.lineTo(px, y + HH); }
          x.stroke(); x.strokeStyle = rgba(RD, 0.8); x.beginPath();
          for (let j = 0; j <= 9; j++) { const py = y + (HH * j) / 9 + jam; x.moveTo(X0, py); x.lineTo(X0 + w, py); }
          x.stroke();
        } else {
          const rh = 24 * (1 - 0.28 * q.e), rws = 5, top = y + HH / 2 - (rws * rh) / 2 + rh * 0.4;
          weftKnit(x, X0, top, w / 9, rh, 9, rws, null, { color: RD, w: 2.6 });
        }
        // handle
        const px = X0 + w, P = geo.rect(px, y - 12, 52, HH + 24, 8);
        x.save(); x.globalCompositeOperation = 'source-over'; x.fillStyle = 'rgba(255,243,176,.9)'; x.fillRect(px + 2, y - 10, 48, HH + 20); x.restore();
        Ink.stroke(x, P, { w: 3, color: RD, seed: 14, amp: 0.4, retrace: false });
        pen(x, [[px + 14, y + HH / 2], [px + 40, y + HH / 2]], { w: 3, color: RD, wob: false }); pen(x, [[px + 31, y + HH / 2 - 9], [px + 41, y + HH / 2], [px + 31, y + HH / 2 + 9]], { w: 3, color: RD, wob: false });
        text(x, 'stretch: +' + pc(q.e) + '%', X0, y - 22, { size: 24 });
        if (s[q.key] > 0) text(x, 'furthest: +' + pc(s[q.key]) + '%', X0 + 250, y - 22, { size: 24, color: q.key === 'w' ? B : RD });
        if (q.key === 'w' && grab === q && q.e >= q.max) text(x, 'it will not give!', px + 66, y + HH / 2 + 8, { font: 'hand', size: 24, color: RD });
      });
      return busy;
    };
    function sync() { conc.classList.toggle('tk7-hide', !tested()); task.innerHTML = tested() ? 'Both tested. (You can pull them again.)' : 'Grab each red handle and <b>pull it sideways</b> as far as it will go. Then let go.'; S.go(); onChange(); }
    sync();
    return { done: () => s.ok, started: () => s.w > 0 || s.k > 0 };
  }

  // ======================================================================================
  // felt workshop
  // ======================================================================================
  function feltLab(ui, lab, onChange) {
    const W = 860, H = 440, CX = 290, CY = 232, RR = 185;
    const rec = ui.record('p07.feltwork', { label: 'Felt workshop: made felt in the bowl', type: 'demo', max: 0 });
    const it = got('p07.feltwork') || {};
    let wet = it.wet ? 1 : 0, pouring = 0, m = it.done ? 1 : 0, dry = 0, at = null, tried = !!it.tried;
    const save = () => rec.set({ answer: m >= 1 ? 'made felt: hot soapy water, then rubbed until the fibres matted' + (tried ? ' (first tried rubbing dry)' : '') : wet ? 'added hot soapy water; rubbing ' + Math.round(m * 100) + '%' : tried ? 'rubbed the dry fibres only' : '', correct: null, wet: !!wet, done: m >= 1, tried });
    const R = window.H.rng(77);
    const F = Array.from({ length: 110 }, () => {
      const a = R() * TAU, d = Math.sqrt(R()) * (RR - 30), a2 = R() * TAU, d2 = Math.sqrt(R());
      return { x0: CX + Math.cos(a) * d, y0: CY + Math.sin(a) * d, x1: CX + Math.cos(a2) * d2 * 92, y1: CY + Math.sin(a2) * d2 * 64, an: R() * TAU, an1: R() * TAU, len: R.range(26, 44), cv: R.range(-14, 14), ph: R() * 9 };
    });
    const S = Stage(lab, W, H);
    let base = null;
    const KET = [640, 108];
    function art() {
      base = S.layer(W, H, (x) => {
        Ink.hatchShadow(x, geo.ellipse(CX, CY, RR + 14, RR + 14), 1, 9, 9);
        x.fillStyle = 'rgba(255,255,255,.9)'; x.beginPath(); x.arc(CX, CY, RR + 14, 0, 7); x.fill();
        Ink.stroke(x, geo.ellipse(CX, CY, RR + 14, RR + 14), { w: 3, seed: 3, amp: 0.8 }); Ink.stroke(x, geo.ellipse(CX, CY, RR, RR), { w: 2, seed: 4, amp: 0.6, retrace: false });
        // kettle
        const [kx, ky] = KET, body = [[kx - 50, ky + 52], [kx - 44, ky - 22], [kx - 26, ky - 40], [kx + 26, ky - 40], [kx + 44, ky - 22], [kx + 50, ky + 52], [kx - 50, ky + 52]];
        x.fillStyle = '#fff'; x.beginPath(); body.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.fill();
        Ink.hatchFill(x, body, 1, B, 0.6); Ink.stroke(x, body, { w: 2.8, seed: 21, amp: 0.5 });
        Ink.stroke(x, [[kx - 46, ky - 8], [kx - 84, ky - 34], [kx - 92, ky - 26]], { w: 2.8, seed: 22, amp: 0.4 }); Ink.stroke(x, [[kx - 48, ky + 16], [kx - 92, ky - 26]], { w: 2.4, seed: 23, amp: 0.4 });
        Ink.stroke(x, geo.curve([kx + 44, ky - 22], [kx + 92, ky - 30], [kx + 92, ky + 40], [kx + 49, ky + 36], 20), { w: 3, seed: 24, amp: 0.5 });
        Ink.stroke(x, [[kx - 12, ky - 40], [kx - 8, ky - 52], [kx + 8, ky - 52], [kx + 12, ky - 40]], { w: 2.4, seed: 25, amp: 0.3 });
        [-18, 0, 18].forEach((o, i) => pen(x, geo.curve([kx + o, ky - 62], [kx + o - 9, ky - 74], [kx + o + 9, ky - 84], [kx + o, ky - 96], 10), { w: 1.8, a: 0.6, seed: 30 + i }));
        text(x, 'hot, soapy', kx + 100, ky - 10, { font: 'hand', size: 22 }); text(x, 'water', kx + 100, ky + 18, { font: 'hand', size: 22 });
      });
    }
    art(); S.onFonts = art;
    const CHECK = [['heat', () => wet], ['moisture', () => wet], ['pressure', () => wet && m > 0.04], ['friction', () => wet && m > 0.04]];
    S.tap((p) => { if (!wet && !pouring && Math.hypot(p[0] - KET[0], p[1] - KET[1]) < 100) { pouring = 0.001; Book.sfx('pop', { gain: 0.4 }); } });
    S.drag((p) => (m < 1 && Math.hypot(p[0] - CX, p[1] - CY) < RR ? 'rub' : null), {
      start(p) { at = p; },
      move(p, p0) {
        at = p; const d = Math.hypot(p[0] - p0[0], p[1] - p0[1]);
        if (!wet) { dry += d; if (dry > 500 && !tried) { tried = true; Book.sfx('error', { gain: 0.3 }); save(); } return; }
        const b = m; m = Math.min(1, m + d / 5200);
        if (Math.floor(b * 8) !== Math.floor(m * 8)) Book.sfx('stroke', { material: 'pen', dur: 0.2, gain: 0.4 });
        if (b <= 0.04 && m > 0.04) save();
        if (m >= 1 && b < 1) { Book.sfx('success', { gain: 0.35 }); save(); onChange(); }
      },
      end() { at = null; },
    });
    S.render = (dt, t) => {
      const x = S.ctx; let busy = S.dragging();
      S.blit(base, 0, 0);
      if (pouring) { pouring += dt / 1.1; busy = true; if (pouring >= 1) { pouring = 0; wet = 1; Book.sfx('paper', { gain: 0.3 }); save(); } }
      const wl = wet ? 1 : pouring;
      if (wl > 0) {
        x.fillStyle = rgba(B, 0.1 * wl); x.beginPath(); x.arc(CX, CY, RR - 2, 0, 7); x.fill();
        const Rb = window.H.rng(5); x.strokeStyle = rgba(B, 0.6 * wl); x.lineWidth = 1.6;
        for (let i = 0; i < 26; i++) { const a = Rb() * TAU, d = Math.sqrt(Rb()) * (RR - 16), r = Rb.range(4, 11); x.beginPath(); x.arc(CX + Math.cos(a) * d, CY + Math.sin(a) * d, r, 0, 7); x.stroke(); }
        if (pouring) pen(x, geo.curve([KET[0] - 92, KET[1] - 26], [KET[0] - 150, KET[1] - 20], [KET[0] - 200, KET[1] + 30], [CX + 90, CY - 40], 16), { w: 5, a: 0.6, seed: 2 });
      }
      // the fibres: loose and scattered -> tangled into one pad
      const e = ease(m), stir = S.dragging() ? 1 : 0;
      x.lineWidth = 1.8; x.strokeStyle = rgba(B, 0.85); x.beginPath();
      F.forEach((f) => {
        let px = f.x0 + (f.x1 - f.x0) * e, py = f.y0 + (f.y1 - f.y0) * e; const an = f.an + (f.an1 - f.an) * e + stir * Math.sin(t * 9 + f.ph) * 0.25;
        if (stir && at) { const dd = Math.hypot(px - at[0], py - at[1]); if (dd < 90) { px += Math.sin(t * 14 + f.ph) * 5; py += Math.cos(t * 12 + f.ph) * 5; } }
        const dx = Math.cos(an) * f.len / 2, dy = Math.sin(an) * f.len / 2;
        x.moveTo(px - dx, py - dy); x.quadraticCurveTo(px - dy * (f.cv / 20), py + dx * (f.cv / 20), px + dx, py + dy);
      });
      x.stroke();
      if (m >= 1) { Ink.stroke(x, geo.ellipse(CX, CY, 118, 86), { w: 3, seed: 8, amp: 2.2 }); Ink.drawBubble(x, 'FELT!', CX, CY + 150, 44, GR, 1, -0.03, 'center'); }
      if (at && S.dragging()) Ink.stroke(x, geo.ellipse(at[0], at[1], 28, 28), { w: 2, seed: (t * 20) | 0, amp: 1.5, retrace: false, color: RD });
      // checklist
      text(x, 'felt needs:', 560, 236, { size: 24 });
      CHECK.forEach(([nm, on], i) => { const y = 276 + i * 40; pen(x, box4(562, y - 22, 26, 26), { w: 2, seed: 40 + i }); if (on()) { Ink.tick(x, 566, y - 6, 0.8); text(x, nm, 602, y, { size: 24 }); } else text(x, '?', 602, y, { size: 24, a: 0.5 }); });
      if (!wet && !pouring) { text(x, tried ? 'Dry, cold fibres just slide about.' : 'Loose wool fibres. Rub them!', CX, 28, { font: 'hand', size: 22, align: 'center', color: tried ? RD : B }); if (tried) text(x, 'tap the kettle ▸', 500, 60, { font: 'hand', size: 22, color: RD, align: 'center' }); }
      else if (m < 1) { text(x, 'Now rub hard, back and forth…', CX, 28, { font: 'hand', size: 22, align: 'center' }); pen(x, box4(560, 190, 240, 16), { w: 1.8, seed: 9 }); x.fillStyle = rgba(B, 0.45); x.fillRect(562, 192, 236 * m, 12); }
      return busy;
    };
    S.go();
    return { done: () => m >= 1 };
  }

  // ======================================================================================
  // bonded fabric: a web of fibres under a hot roller
  // ======================================================================================
  function bondLab(ui, lab, onChange) {
    const W = 860, H = 290, XA = 110, XB = 760, YB = 214;
    const rec = ui.record('p07.bond', { label: 'Bonded fabric demo: hot roller over the fibre web', type: 'demo', max: 0 });
    const it = got('p07.bond') || {};
    let rx = it.done ? XB : XA, far = rx, done = !!it.done;
    const R = window.H.rng(31);
    const F = Array.from({ length: 230 }, () => ({ x: R.range(XA - 30, XB + 40), h: R.range(8, 62), an: R.range(-1.2, 1.2), len: R.range(20, 44), cv: R.range(-10, 10) }));
    const S = Stage(lab, W, H);
    S.drag((p) => (!done && Math.abs(p[0] - rx) < 70 && p[1] > 60 && p[1] < 240 ? 'r' : null), {
      move(p) { rx = clamp(p[0], XA, XB); if (rx > far) { if (Math.floor(rx / 60) !== Math.floor(far / 60)) Book.sfx('stroke', { material: 'pen', dur: 0.2, gain: 0.35 }); far = rx; } if (far >= XB - 4 && !done) { done = true; far = XB; Book.sfx('success', { gain: 0.35 }); rec.set({ answer: 'rolled the hot roller across: the web bonded into a sheet', correct: null, done: true }); onChange(); } },
    });
    S.render = (dt, t) => {
      const x = S.ctx;
      pen(x, [[40, YB + 2], [W - 30, YB + 2]], { w: 2.6, seed: 2 }); for (let q = 60; q < W - 40; q += 70) Ink.stroke(x, geo.ellipse(q, YB + 16, 11, 11), { w: 1.8, seed: q % 17, amp: 0.3, retrace: false });
      // loose web ahead of the roller, flat bonded sheet behind it
      x.strokeStyle = rgba(B, 0.8); x.lineWidth = 1.5; x.beginPath();
      F.forEach((f) => {
        const flat = f.x < far - 30, py = flat ? YB - 7 : YB - f.h, an = flat ? f.an * 0.08 : f.an, dx = Math.cos(an) * f.len / 2, dy = Math.sin(an) * f.len / 2;
        x.moveTo(f.x - dx, py - dy); x.quadraticCurveTo(f.x, py + (flat ? 0 : f.cv), f.x + dx, py + dy);
      });
      x.stroke();
      if (far > XA + 10) { const l = XA - 44, r = far - 30; x.fillStyle = rgba(B, 0.14); x.fillRect(l, YB - 14, r - l, 14); pen(x, [[l, YB - 14], [r, YB - 14]], { w: 2.2, wob: false }); x.fillStyle = rgba(B, 0.8); for (let q = l + 10; q < r - 4; q += 14) { x.beginPath(); x.arc(q, YB - 7, 1.8, 0, 7); x.fill(); } }
      // the roller
      const cy = YB - 14 - 46;
      x.save(); x.globalCompositeOperation = 'source-over'; x.fillStyle = 'rgba(255,243,176,.92)'; x.beginPath(); x.arc(rx, cy, 46, 0, 7); x.fill(); x.restore();
      Ink.stroke(x, geo.ellipse(rx, cy, 46, 46), { w: 3.2, color: RD, seed: 6, amp: 0.5 });
      const ro = (rx - XA) / 46; for (let i = 0; i < 4; i++) { const a = ro + (i * TAU) / 4; pen(x, [[rx + Math.cos(a) * 12, cy + Math.sin(a) * 12], [rx + Math.cos(a) * 38, cy + Math.sin(a) * 38]], { w: 2, color: RD, wob: false }); }
      [-20, 0, 20].forEach((o, i) => pen(x, geo.curve([rx + o, cy - 54], [rx + o - 8, cy - 64], [rx + o + 8, cy - 72], [rx + o, cy - 82], 8), { w: 1.8, color: RD, a: 0.7, seed: 12 + i }));
      text(x, 'HOT roller', rx, cy - 92, { size: 22, color: RD, align: rx > 600 ? 'right' : 'left' });
      if (!done) { text(x, far <= XA + 10 ? 'A loose web of synthetic fibres (no yarn!). Drag the roller across ▸' : 'Keep rolling ▸', 40, 270, { font: 'hand', size: 22 }); }
      else text(x, 'The heat melted the fibres together: a bonded fabric.', 40, 270, { font: 'hand', size: 22, color: GR });
      return S.dragging();
    };
    S.go();
    return { done: () => done };
  }

  // ======================================================================================
  Book.page({
    id: 'p07', title: 'Knitted & non-woven',
    build(ui, root) {
      css();
      ui.h('Knitted & non-woven');
      const intro = ui.p('Not every fabric is woven. A <span class="key">knitted</span> fabric is made from yarn formed into interlocking <b>loops</b>.');
      const anim = ui.anim({ w: 860, h: 330, duration: 12, poster: 3.4,
        draw(k, t) {
          const x0 = 150, sw = 70, yb = [276, 218, 160];
          const rowPts = (r) => { const P = []; for (let c = 0; c < 8; c++) { const px = x0 + c * sw, b = yb[r], tp = b - 92; P.push(...k.curve([px, b], [px + sw * 0.42, b], [px + sw * 0.08, tp], [px + sw * 0.5, tp], 10), ...k.curve([px + sw * 0.5, tp], [px + sw * 0.92, tp], [px + sw * 0.58, b], [px + sw, b], 10)); } return P; };
          k.line(rowPts(0), 0.2, 3, { w: 3 });
          k.text('one yarn makes a row of loops', 150, 316, 0.6, 2.6, { size: 24, font: 'hand' });
          k.line(rowPts(1).reverse(), 3.8, 6.8, { w: 3, color: Ink.RED });
          k.text('each new loop is pulled through the loop below', 150, 40, 4.2, 6.6, { size: 24, font: 'hand', color: Ink.RED });
          k.line(rowPts(2), 7.4, 10.2, { w: 3 });
          k.arrow([[90, 290], [90, 150]], 10.3, 11, { w: 2.6 }); k.text('rows', 30, 230, 10.6, 11.4, { size: 24 });
        },
        sound(k) { [0.2, 3.8, 7.4].forEach((a) => k.play('stroke', a, { material: 'pen', dur: 2.6, gain: 0.4 })); },
      });

      ui.el('h2', '', 'The ladder test');
      const lab1 = ui.el('div', 'tk7-lab'); frame(lab1);
      const lab2 = ui.el('div', 'tk7-lab');
      const notesK = ui.box('<b>Knitted fabrics</b> are <b>stretchy</b> (comfortable, a good fit), warm (the loops trap air) and <b>crease-resistant</b>. They do not fray easily, but they can <b>ladder / unravel</b> and can lose their shape.<br><b>Weft knit</b>: <b>one continuous yarn</b> loops across the fabric in rows (it can be done by hand). Very stretchy; <b>ladders</b> if a stitch breaks. E.g. jumpers, T-shirt jersey, socks, hats.<br><b>Warp knit</b>: <b>many yarns</b> loop vertically; <b>machine made only</b>. Less stretchy, more stable; <b>does not ladder</b> or unravel. E.g. swimwear, sportswear, lingerie, net curtains, fleece.', { tag: 'Notes' });
      let b1, b2;
      const upK = () => { if (b1 && b2) notesK.classList.toggle('tk7-hide', !(b1.done() && b2.done())); };
      b1 = ladderBench(ui, lab1, upK);
      root.insertBefore(ui.el('h2', '', 'The stretch test'), lab2); root.insertBefore(ui.el('p', '', 'A <b>woven</b> swatch and a <b>knitted</b> swatch, made from the same yarn.'), lab2); frame(lab2);
      b2 = stretchBench(ui, lab2, upK); upK();

      ui.el('h2', '', 'Non-woven fabrics');
      const p3 = ui.p('Some fabrics skip the yarn stage: they are made <b>straight from fibres</b>. First, make some <span class="key">felt</span>.');
      const lab3 = ui.el('div', 'tk7-lab'); frame(lab3);
      const p4 = ui.p('Now a <span class="key">bonded</span> fabric.');
      const lab4 = ui.el('div', 'tk7-lab'); frame(lab4);
      const notesN = ui.box('<b>Non-woven fabrics</b> are made <b>directly from fibres</b>, without spinning them into yarn. They <b>do not fray</b> and are cheap, but are generally weaker, with little drape and no stretch.<br><b>Felt</b>: wool fibres matted together using <b>heat, moisture, pressure and friction</b> (the scales on wool fibres lock together). Warm, can be moulded; but weak, not washable, and it pills. E.g. hats, craft, snooker table covers, insulation.<br><b>Bonded fabric</b>: a web of fibres (often synthetic) held together by <b>adhesive</b>, by <b>heat</b> (melting thermoplastic fibres) or by needle-punching / stitching. Cheap and quick to make. E.g. interfacing, disposable face masks and medical gowns, cleaning cloths, tea bags, wet wipes.', { tag: 'Notes' });
      let f1, f2;
      const upN = () => { if (f1 && f2) notesN.classList.toggle('tk7-hide', !(f1.done() && f2.done())); };
      f1 = feltLab(ui, lab3, upN); f2 = bondLab(ui, lab4, upN); upN();

      ui.el('h2', '', 'Check it');
      ui.p('<span class="small">The benches and notes above will blur while you answer.</span>');
      const all = [intro, anim && root.querySelector('.ink-anim'), lab1, lab2, notesK, p3, lab3, p4, lab4, notesN].filter(Boolean);
      const q = ui.mcq({ id: 'p07.felt', label: 'How felt is made', q: 'How are wool fibres turned into <b>felt</b>?', options: [
        { t: 'Matted together using heat, moisture, pressure and friction', ok: true, why: 'Yes: hot soapy water and rubbing make the scales on the wool fibres lock together.' },
        { t: 'Spun into a yarn, then looped together in rows by a machine', mis: 'nonwoven', why: 'That describes knitting. Felt is non-woven: it is made straight from fibres, with no yarn.' },
        { t: 'Laid out in a loose web, then stuck together with adhesive', mis: 'nonwoven', why: 'That describes a bonded fabric. Think about what you did to the wool in the bowl.' },
        { t: 'Interlaced over and under at right angles on a wooden loom', mis: 'nonwoven', why: 'That describes weaving. Felt is non-woven: it is made straight from fibres, with no yarn.' },
      ] });
      ui.hideWhile(q, 'p07.felt', all);
      const srt = ui.sort({ id: 'p07.sort', label: 'Sort 10 products / properties by fabric construction', q: 'Tap a card, then tap the type of fabric it belongs to.',
        buckets: ['Woven', 'Weft knit', 'Warp knit', 'Felt', 'Bonded'],
        items: [
          { t: 'denim for jeans', b: 0, mis: 'weave-type' }, { t: 'frays at cut edges', b: 0, mis: 'woven-vs-knit' },
          { t: 'hand-knitted jumper', b: 1, mis: 'knit-type' }, { t: 'ladders if a stitch breaks', b: 1, mis: 'knit-type' },
          { t: 'swimwear fabric', b: 2, mis: 'knit-type' }, { t: 'machine made only; does not ladder', b: 2, mis: 'knit-type' },
          { t: 'snooker table cover', b: 3, mis: 'nonwoven' }, { t: 'wool fibres matted together', b: 3, mis: 'nonwoven' },
          { t: 'disposable face mask', b: 4, mis: 'nonwoven' }, { t: 'interfacing', b: 4, mis: 'nonwoven' },
        ], explain: 'All sorted: woven, knitted and non-woven fabrics each have their own jobs.' });
      ui.hideWhile(srt, 'p07.sort', all);
    },
  });
})();
