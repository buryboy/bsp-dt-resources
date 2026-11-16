// Page 4 — The thermoforming six: a test bench (drop, bend x20, scratch, see-through, chemical splash) on six
// sample sheets. The results table fills in as the student tests; conclusions, notes and a uses match follow.
(function () {
  'use strict';
  const B = Ink.BLUE, R = Ink.RED, G = Ink.GREEN, rgba = Ink.rgba, geo = Ink.geo;
  const PAPER = '#fbfaf5';
  const HAND = (s) => `400 ${s}px "Gloria Hallelujah", "Comic Sans MS", cursive`;
  const LAB = (s, w = 600) => `${w} ${s}px Fredoka, "Arial Rounded MT Bold", system-ui`;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  function css() {
    if (document.getElementById('p04-css')) return;
    const s = document.createElement('style'); s.id = 'p04-css';
    s.textContent = `
      .p04-bench { margin: 0 0 calc(var(--R) * 1.4); padding: 14px 18px 16px; }
      .p04-cv { display: block; width: 100%; height: auto; touch-action: none; user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; cursor: pointer; }
      .p04-out { min-height: 57px; font-size: 19px; line-height: 1.5; margin: 6px 0 8px; }
      .p04-out b { font-family: Fredoka; font-weight: 600; }
      .p04-tbl { display: grid; grid-template-columns: minmax(74px, .8fr) repeat(5, 1fr); gap: 5px; }
      .p04-tbl > * { min-height: 44px; display: flex; align-items: center; justify-content: center; text-align: center; font: 600 15px/1.2 Fredoka, system-ui; color: var(--ink); padding: 3px 4px; }
      .p04-tbl .hd { font-size: 15px; }
      .p04-tbl .nm { justify-content: flex-start; font-size: 17px; }
      .p04-tbl button { background: #fff; border: 2px solid rgba(30,46,150,.35); border-radius: 10px; cursor: pointer; font: 400 14px/1.2 'Gloria Hallelujah', cursive; color: rgba(30,46,150,.5); }
      .p04-tbl button.done { color: var(--ink); background: rgba(255,255,255,.6); }
      .p04-tbl button.bad { color: var(--red); }
      .p04-tbl button.sel { border-color: var(--red); border-width: 3px; background: rgba(255,235,90,.35); }
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

  // ---------- the data ----------
  const POLY = [
    { k: 'acrylic', name: 'Acrylic' }, { k: 'hips', name: 'HIPS' }, { k: 'hdpe', name: 'HDPE' },
    { k: 'pp', name: 'PP' }, { k: 'pvc', name: 'PVC' }, { k: 'pet', name: 'PET' },
  ];
  const TESTS = [
    { k: 'drop', name: 'Drop', how: 'tap to drop the steel ball' },
    { k: 'bend', name: 'Bend ×20', how: 'drag up and down to bend the strip 20 times' },
    { k: 'scratch', name: 'Scratch', how: 'drag the key across the sheet' },
    { k: 'see', name: 'See-through', how: 'drag the sheet over the card' },
    { k: 'chem', name: 'Chemical', how: 'tap to drip strong cleaner on the sheet' },
  ];
  // cell = what goes in the table, out = the sentence under the bench, bad = written in red
  const RES = {
    acrylic: {
      drop: { cell: 'CRACKED!', out: 'The acrylic sheet <b>cracked</b> right across when the ball hit it.', bad: 1, brk: 1 },
      bend: { cell: 'snapped on bend 1', out: 'The acrylic strip <b>snapped</b> on the very first bend.', bad: 1, brk: 1 },
      scratch: { cell: 'clear scratch', out: 'The key left a <b>clear scratch</b> on the shiny surface.', bad: 1, deep: 1 },
      see: { cell: 'clear', out: 'You can read the card straight through the sheet.', clear: 1 },
      chem: { cell: 'cloudy mark', out: 'The cleaner left a <b>cloudy mark</b> on the surface.', bad: 1, mark: 'cloudy mark' },
    },
    hips: {
      drop: { cell: 'no damage', out: 'The ball bounced off the HIPS sheet. No cracks.' },
      bend: { cell: 'white, split at 9', out: 'The HIPS strip went <b>white</b> along the bend, then <b>split</b> on bend 9.', bad: 1, white: 4, brk: 9 },
      scratch: { cell: 'faint mark', out: 'The key left only a faint mark.' },
      see: { cell: 'can’t see through', out: 'The card is hidden: you cannot see through this sheet.' },
      chem: { cell: 'dull patch', out: 'The cleaner left a <b>dull, sticky patch</b> on the surface.', bad: 1, mark: 'dull patch' },
    },
    hdpe: {
      drop: { cell: 'no damage', out: 'The ball bounced off the HDPE sheet. No cracks.' },
      bend: { cell: 'white crease', out: 'The HDPE strip lasted 20 bends, but it has a <b>white crease</b> along the bend.', white: 12 },
      scratch: { cell: 'faint mark', out: 'The key slid over the waxy surface and left a faint mark.' },
      see: { cell: 'can’t see through', out: 'The card is hidden: you cannot see through this sheet.' },
      chem: { cell: 'no change', out: 'The drops sat on top and wiped off. <b>No change</b> at all.' },
    },
    pp: {
      drop: { cell: 'no damage', out: 'The ball bounced off the PP sheet. No cracks.' },
      bend: { cell: '20 bends: perfect', out: '20 bends and the PP strip is <b>as good as new</b>. No white marks, no cracks.' },
      scratch: { cell: 'faint mark', out: 'The key left only a faint mark.' },
      see: { cell: 'can’t see through', out: 'The card is hidden: you cannot see through this sheet.' },
      chem: { cell: 'no change', out: 'The drops sat on top and wiped off. <b>No change</b> at all.' },
    },
    pvc: {
      drop: { cell: 'no damage', out: 'The ball bounced off the PVC sheet. No cracks.' },
      bend: { cell: 'white, split at 6', out: 'The rigid PVC strip went <b>white</b> along the bend, then <b>split</b> on bend 6.', bad: 1, white: 3, brk: 6 },
      scratch: { cell: 'faint mark', out: 'The key left only a faint mark.' },
      see: { cell: 'can’t see through', out: 'The card is hidden: you cannot see through this sheet.' },
      chem: { cell: 'no change', out: 'The drops sat on top and wiped off. <b>No change</b> at all.' },
    },
    pet: {
      drop: { cell: 'no damage', out: 'The ball bounced off the PET sheet. No cracks.' },
      bend: { cell: 'white, split at 13', out: 'The PET strip creased <b>white</b>, then <b>split</b> on bend 13.', bad: 1, white: 5, brk: 13 },
      scratch: { cell: 'faint mark', out: 'The key left only a faint mark.' },
      see: { cell: 'clear', out: 'You can read the card straight through the sheet.', clear: 1 },
      chem: { cell: 'faint mark', out: 'The cleaner left a <b>faint dull mark</b>.', bad: 1, mark: 'faint mark', faint: 1 },
    },
  };

  // =====================================================================================
  function bench(ui, root, host) {
    const rec = ui.record('p04.tests', { label: 'Test bench: which tests were run (6 polymers × 5 tests)', type: 'experiment', max: 0 });
    const W = 860, Hh = 330, S = stage(host, W, Hh, 'p04-cv');
    const out = ui.el('div', 'p04-out', '', host);
    const tbl = ui.el('div', 'p04-tbl', '', host);
    const done = new Set((rec.get() && rec.get().done) || []);
    let pi = 0, ti = 0, T = null;
    const cells = {};
    ui.el('div', 'hd', '', tbl);
    TESTS.forEach((t) => ui.el('div', 'hd', t.name, tbl));
    POLY.forEach((p, i) => {
      ui.el('div', 'nm', p.name, tbl);
      TESTS.forEach((t, j) => {
        const b = ui.el('button', '', '?', tbl); b.type = 'button'; b.setAttribute('aria-label', p.name + ' ' + t.name);
        b.dataset.p = p.k; b.dataset.t = t.k;
        b.onclick = () => { select(i, j); Book.sfx('tick', { gain: 0.5 }); };
        cells[p.k + ':' + t.k] = b;
      });
    });
    const paintCells = () => Object.keys(cells).forEach((id) => {
      const [p, t] = id.split(':'), b = cells[id], r = RES[p][t], d = done.has(id);
      b.textContent = d ? r.cell : '?'; b.classList.toggle('done', d); b.classList.toggle('bad', d && !!r.bad);
      b.classList.toggle('sel', p === POLY[pi].k && t === TESTS[ti].k);
    });
    const key = () => POLY[pi].k + ':' + TESTS[ti].k, res = () => RES[POLY[pi].k][TESTS[ti].k];
    function save() {
      const parts = POLY.map((p) => { const ts = TESTS.filter((t) => done.has(p.k + ':' + t.k)).map((t) => t.k); return ts.length ? p.name + ': ' + ts.join(', ') : ''; }).filter(Boolean);
      rec.set({ answer: `ran ${done.size}/30 tests. ` + parts.join('; '), correct: null, done: [...done] });
    }
    function finish() {
      if (T.done) return; T.done = true;
      const r = res(), first = !done.has(key());
      done.add(key()); if (first) save();
      Book.sfx(r.bad ? 'error' : 'success', { gain: 0.3 });
      out.innerHTML = `<b>${POLY[pi].name}, ${TESTS[ti].name.toLowerCase()} test:</b> ${r.out} <span class="small">(${done.size} of 30 boxes filled. Tap another box.)</span>`;
      paintCells();
    }
    function select(i, j) {
      pi = i; ti = j;
      T = { done: false, t: 0, by: 70, vy: 0, fall: false, flex: 0, fv: 0, broke: false, brT: 0, a: 0, ext: 0, n: 0, white: false, drag: false, path: [], dist: 0, last: null, sx: 40, grab: 0, drops: -1, tool: null };
      out.innerHTML = `<b>${POLY[i].name}, ${TESTS[j].name.toLowerCase()} test:</b> ${TESTS[j].how}.` + (done.has(key()) ? ' <span class="small">(You have already run this one. Run it again if you like.)</span>' : '');
      paintCells(); S.dirty = true;
    }

    // ----- pointer -----
    const SHIFT = 30; // most scenes are drawn 30 px higher than their coordinates (see render)
    const BY = 190; // strip height in the bend test
    S.c.addEventListener('pointerdown', (e) => {
      e.preventDefault(); try { S.c.setPointerCapture(e.pointerId); } catch (_) {}
      const k = TESTS[ti].k, q = S.pos(e), x = q[0], y = q[1] + (k === 'chem' ? 0 : SHIFT); T.drag = true; S.dirty = true;
      if (k === 'drop') { if (!T.fall && !T.done) { T.fall = true; Book.sfx('tick', { gain: 0.4 }); } else if (T.done && T.t > 1.2) select(pi, ti); }
      else if (k === 'chem') { if (T.drops < 0) { T.drops = 0; Book.sfx('pop', { gain: 0.3 }); } else if (T.done && T.t > 1.2) select(pi, ti); }
      else if (k === 'bend') { if (T.broke && T.brT > 1) select(pi, ti); else moveBend(y); }
      else if (k === 'scratch') { T.last = null; moveScratch(x, y); }
      else if (k === 'see') { T.grab = x - T.sx; }
    });
    S.c.addEventListener('pointermove', (e) => {
      if (!T.drag) return; e.preventDefault(); const k = TESTS[ti].k, q = S.pos(e), x = q[0], y = q[1] + (k === 'chem' ? 0 : SHIFT);
      if (k === 'bend') moveBend(y); else if (k === 'scratch') moveScratch(x, y);
      else if (k === 'see') { T.sx = clamp(x - T.grab, 40, 455); if (T.sx > 440) finish(); S.dirty = true; }
    });
    const up = () => { if (!T || !T.drag) return; T.drag = false; T.last = null; T.tool = null; if (TESTS[ti].k === 'see' && T.sx > 360) { T.sx = 455; finish(); } S.dirty = true; };
    S.c.addEventListener('pointerup', up); S.c.addEventListener('pointercancel', up);

    function moveBend(y) {
      if (T.broke) return;
      T.a = clamp((y - BY) / 130, -1, 1); S.dirty = true;
      const r = res(), s = T.a > 0.55 ? 1 : T.a < -0.55 ? -1 : 0;
      if (s && s !== T.ext && T.n < 20) {
        T.ext = s; T.n++; Book.sfx('tick', { gain: 0.35 });
        if (r.white && T.n >= r.white) T.white = true;
        if (r.brk && T.n >= r.brk) { T.broke = true; T.brT = 0; T.brA = T.a; Book.sfx('thud', { gain: 0.5 }); finish(); }
        else if (T.n >= 20) finish();
      }
    }
    const SR = [250, 90, 400, 210]; // sheet rect for scratch / chemical tests
    function moveScratch(x, y) {
      const tip = [x - 46, y - 40]; T.tool = tip;
      const inside = (p) => p[0] > SR[0] + 4 && p[0] < SR[0] + SR[2] - 4 && p[1] > SR[1] + 4 && p[1] < SR[1] + SR[3] - 4;
      if (T.last && inside(tip) && inside(T.last)) {
        const d = Math.hypot(tip[0] - T.last[0], tip[1] - T.last[1]);
        if (d > 2) { T.path.push([T.last, tip]); T.dist += d; if (T.path.length % 4 === 0) Book.sfx('stroke', { material: 'pen', dur: 0.08, gain: res().deep ? 0.8 : 0.3 }); T.last = tip; }
        if (T.dist > 170) finish();
      } else T.last = tip;
      S.dirty = true;
    }

    // ----- drawing -----
    function tag(ctx, s, x, y) {
      const w = 36 + s.length * 13, P = geo.rect(x - w / 2, y - 26, w, 36, 4);
      paperFill(ctx, P); line(ctx, P, { w: 1.6, seed: 61 }); text(ctx, s, x, y, { font: 'lab', size: 22, align: 'center' });
    }
    function sheetLook(ctx, P, seed) { Ink.hatchShadow(ctx, P, 1, 7, 7, B); paperFill(ctx, P); hatch(ctx, P, B, 0.22, 9, 1); line(ctx, closed(P), { w: 2.6, seed }); }
    function benchLine(ctx, y) { line(ctx, [[20, y], [840, y]], { w: 2.8, seed: 3 }); ctx.strokeStyle = rgba(B, 0.45); ctx.lineWidth = 1; ctx.beginPath(); for (let x = 30; x < 840; x += 16) { ctx.moveTo(x, y + 4); ctx.lineTo(x - 10, y + 16); } ctx.stroke(); }
    function hint(ctx, s, x, y) { if (!T.done && !(TESTS[ti].k === 'bend' && T.n > 0) && !T.fall && T.drops < 0 && T.dist < 5 && T.sx < 60) text(ctx, s, x, y, { size: 23, color: R, align: 'center' }); }

    function drawDrop(ctx) {
      const name = POLY[pi].name, r = res(), Y = 262, BYb = 340;
      benchLine(ctx, BYb);
      // two supports
      [[250, 300], [570, 300]].forEach(([x], i) => { const P = geo.rect(x, 276, 40, 64, 3); paperFill(ctx, P); hatch(ctx, P, B, 0.45, 5, i ? -1 : 1); line(ctx, P, { w: 2.4, seed: 20 + i }); });
      // release stand
      line(ctx, [[700, BYb], [700, 40], [455, 40]], { w: 3, seed: 5 }); line(ctx, [[455, 40], [455, 52]], { w: 2.4, seed: 6 });
      const base = geo.rect(660, 328, 80, 12, 3); paperFill(ctx, base); hatch(ctx, base, B, 0.5, 4, 1); line(ctx, base, { w: 2.2, seed: 7 });
      if (T.broke) {
        const a = Math.min(1, T.brT / 0.25) * 0.42;
        const L = rot([[232, Y], [428, Y], [420, Y + 7], [431, Y + 14], [232, Y + 14]], 270, Y + 14, a), Rr = rot([[628, Y], [432, Y], [440, Y + 6], [429, Y + 14], [628, Y + 14]], 590, Y + 14, -a);
        [L, Rr].forEach((P, i) => { paperFill(ctx, P); hatch(ctx, P, B, 0.22, 9, 1); line(ctx, closed(P), { w: 2.4, seed: 30 + i }); });
        const k = Math.min(1, T.brT / 0.5);
        [[-60, -50], [-25, -80], [30, -70], [70, -40]].forEach(([dx, dy], i) => { const x = 430 + dx * k, y = Y + 40 + dy * k * (1 - k) * 3 + 36 * k * k; line(ctx, [[x, y], [x + 9, y - 6], [x + 5, y + 5], [x, y]], { w: 1.6, color: B, seed: 40 + i }); });
        text(ctx, 'CRACK!', 500, 215, { size: 34, color: R, rot: -0.12 });
      } else {
        const f = T.flex, top = geo.curve([232, Y], [360, Y + f * 1.3], [500, Y + f * 1.3], [628, Y], 24), bot = top.map(([x, y]) => [x, y + 14]).reverse(), P = top.concat(bot);
        paperFill(ctx, P); hatch(ctx, P, B, 0.22, 9, 1); line(ctx, closed(P), { w: 2.4, seed: 31 });
      }
      // ball
      const bx = 455, by = T.by, ball = geo.ellipse(bx, by, 22, 22);
      paperFill(ctx, ball); hatch(ctx, geo.ellipse(bx + 4, by + 5, 17, 16), B, 0.55, 4, 1); line(ctx, ball, { w: 2.6, seed: 9 });
      text(ctx, 'steel ball', 490, 76, { size: 22 });
      tag(ctx, name + ' sheet', 150, 250);
      hint(ctx, 'tap to drop the ball ↑', 300, 130);
      if (T.done && !r.brk && T.t > 0.8) Ink.tick(ctx, 520, 240, 1.4);
    }

    function stripPts(a, s0, s1) {
      // centre line of the strip from distance s0 to s1 along it; the bend is concentrated just outside the vice
      const C = []; let x = 250, y = BY;
      for (let s = 0; s <= 330; s += 6) { const th = a * 1.1 * clamp((s - 14) / 60, 0, 1); if (s >= s0 && s <= s1) C.push([x, y, th]); x += Math.cos(th) * 6; y += Math.sin(th) * 6; }
      const up = C.map(([px, py, th]) => [px + Math.sin(th) * 6, py - Math.cos(th) * 6]), dn = C.map(([px, py, th]) => [px - Math.sin(th) * 6, py + Math.cos(th) * 6]).reverse();
      return up.concat(dn);
    }
    function drawBend(ctx) {
      const name = POLY[pi].name, r = res();
      benchLine(ctx, 340);
      // strip
      if (T.broke) {
        const stub = stripPts(T.brA, 0, 42); paperFill(ctx, stub); hatch(ctx, stub, B, 0.22, 9, 1); line(ctx, closed(stub), { w: 2.2, seed: 33 });
        const k = Math.min(1, T.brT / 0.45), y = BY + 40 + (326 - BY - 40) * k * k, P = rot(geo.rect(300, y - 6, 280, 12, 2), 440, y, 0.5 * (1 - k) * (T.brA > 0 ? 1 : -1));
        paperFill(ctx, P); hatch(ctx, P, B, 0.22, 9, 1); line(ctx, P, { w: 2.2, seed: 34 });
        text(ctx, 'SNAP!', 330, BY - 30, { size: 34, color: R, rot: -0.1 });
      } else {
        const P = stripPts(T.a, 0, 330); paperFill(ctx, P); hatch(ctx, P, B, 0.22, 9, 1); line(ctx, closed(P), { w: 2.2, seed: 33 });
      }
      if (T.white) {
        ctx.save(); ctx.strokeStyle = rgba(R, 0.8); ctx.lineWidth = 1.3; ctx.beginPath();
        for (let i = 0; i < 6; i++) { const x = 272 + i * 6; ctx.moveTo(x, BY - 9 + (i % 2) * 2); ctx.lineTo(x + 3, BY + 9 - (i % 2) * 3); } ctx.stroke(); ctx.restore();
        text(ctx, 'going white here', 250, BY + 78, { size: 21, color: R });
        line(ctx, [[300, BY + 56], [288, BY + 18]], { w: 1.6, color: R, seed: 44 });
      }
      // bench vice jaws gripping the strip
      [[170, BY - 62, 80, 54], [170, BY + 8, 80, 54]].forEach(([x, y, w, h], i) => { const P = geo.rect(x, y, w, h, 5); Ink.hatchShadow(ctx, P, 1, 6, 6, B); paperFill(ctx, P); hatch(ctx, P, B, 0.5, 5, i ? -1 : 1); line(ctx, P, { w: 2.6, seed: 50 + i }); });
      const post = geo.rect(190, BY + 62, 40, 278 - BY, 3); paperFill(ctx, post); hatch(ctx, post, B, 0.4, 6, 1); line(ctx, post, { w: 2.4, seed: 53 });
      text(ctx, 'vice', 186, BY - 72, { size: 22 });
      tag(ctx, name + ' strip', 110, 60);
      // counter
      text(ctx, 'bends', 740, 70, { size: 24, align: 'center' });
      Ink.drawBubble(ctx, String(T.n), 740, 130, 58, T.broke ? R : B, 1, 0, 'center');
      text(ctx, 'out of 20', 740, 162, { size: 21, align: 'center' });
      if (!T.broke && T.n === 0) { text(ctx, 'drag up and down', 520, 110, { size: 23, color: R, align: 'center' }); line(ctx, [[600, 130], [600, 250]], { w: 2, color: R, seed: 46 }); line(ctx, geo.head([[600, 130], [600, 250]], 14), { w: 2, color: R, seed: 47 }); line(ctx, geo.head([[600, 250], [600, 130]], 14), { w: 2, color: R, seed: 48 }); }
      if (T.done && !T.broke && !r.white) Ink.tick(ctx, 720, 215, 1.5);
    }

    function drawKey(ctx, x, y) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(0.72);
      const sh = [[0, 0], [10, -5], [64, -5], [64, 5], [52, 5], [48, 9], [42, 5], [34, 9], [28, 5], [10, 5]];
      paperFill(ctx, sh); hatch(ctx, sh, B, 0.5, 4, 1); line(ctx, closed(sh), { w: 1.8, seed: 70 });
      const bow = geo.ellipse(82, 0, 20, 17); paperFill(ctx, bow); line(ctx, bow, { w: 2.2, seed: 71 }); line(ctx, geo.ellipse(86, 0, 6, 6), { w: 1.6, seed: 72 });
      ctx.restore();
    }
    function drawScratch(ctx) {
      const P = geo.rect(SR[0], SR[1], SR[2], SR[3], 8), r = res();
      sheetLook(ctx, P, 35);
      ctx.save(); ctx.lineCap = 'round';
      T.path.forEach(([a, b]) => {
        if (r.deep) { ctx.globalCompositeOperation = 'source-over'; ctx.strokeStyle = PAPER; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.globalCompositeOperation = 'multiply'; ctx.strokeStyle = rgba(B, 0.9); ctx.lineWidth = 1.5; [-4, 4].forEach((o) => { ctx.beginPath(); ctx.moveTo(a[0], a[1] + o); ctx.lineTo(b[0], b[1] + o); ctx.stroke(); }); }
        else { ctx.strokeStyle = rgba(B, 0.3); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
      });
      ctx.restore();
      tag(ctx, POLY[pi].name + ' sheet', 120, 60);
      const k = T.tool || [150, 200]; drawKey(ctx, k[0], k[1]);
      if (!T.tool) text(ctx, 'steel key', 150, 300, { size: 22, align: 'center' });
      hint(ctx, 'drag the key across the sheet →', 450, 345);
    }

    function drawSee(ctx) {
      const r = res(), card = geo.rect(470, 110, 230, 180, 6);
      // the card with a drawing on it
      Ink.hatchShadow(ctx, card, 1, 6, 6, B); paperFill(ctx, card); line(ctx, card, { w: 2.2, seed: 80 });
      Ink.drawBubble(ctx, 'D&T', 585, 200, 62, R, 1, -0.05, 'center');
      const st = []; for (let i = 0; i <= 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? 11 : 26; st.push([585 + Math.cos(a) * rr, 250 + Math.sin(a) * rr]); } line(ctx, st, { w: 2, seed: 81 });
      if (T.sx < 250) text(ctx, 'card', 585, 100, { size: 22, align: 'center' });
      // the sheet
      const P = geo.rect(T.sx, 90, 260, 220, 8);
      Ink.hatchShadow(ctx, P, 1, 7, 7, B);
      if (!r.clear) { paperFill(ctx, P); hatch(ctx, P, B, 0.3, 6, 1); hatch(ctx, P, B, 0.16, 9, -1); }
      else { ctx.save(); poly(ctx, P); ctx.clip(); ctx.strokeStyle = rgba(B, 0.55); ctx.lineWidth = 1.6; [[0.12, 24, 46], [0.2, 20, 26], [0.74, 150, 40]].forEach(([u, dy, len]) => { const x = T.sx + 260 * u; ctx.beginPath(); ctx.moveTo(x, 90 + dy + len); ctx.lineTo(x + len * 0.6, 90 + dy); ctx.stroke(); }); ctx.restore(); }
      line(ctx, P, { w: 2.6, seed: 36 });
      tag(ctx, POLY[pi].name + ' sheet', T.sx + 130, 70);
      hint(ctx, 'drag the sheet over the card →', 400, 350);
    }

    function drawChem(ctx) {
      const P = geo.rect(SR[0], SR[1] + 60, SR[2], SR[3] - 50, 8), r = res(), cx = 450, cy = 250;
      sheetLook(ctx, P, 37);
      // pipette
      const pip = [[cx - 9, 20], [cx + 9, 20], [cx + 9, 78], [cx + 3, 104], [cx - 3, 104], [cx - 9, 78]], bulb = geo.ellipse(cx, 8, 15, 18);
      paperFill(ctx, pip); hatch(ctx, [[cx - 9, 48], [cx + 9, 48], [cx + 9, 78], [cx + 3, 104], [cx - 3, 104], [cx - 9, 78]], R, 0.5, 4, 1); line(ctx, closed(pip), { w: 2, seed: 90 });
      paperFill(ctx, bulb); hatch(ctx, bulb, B, 0.5, 4, -1); line(ctx, bulb, { w: 2.2, seed: 91 });
      text(ctx, 'strong cleaner', cx + 30, 60, { size: 22 });
      const spots = [[-40, 0], [10, -22], [38, 20]];
      if (T.drops >= 0 && T.drops < 0.5) spots.forEach(([dx, dy], i) => { const k = clamp(T.drops / 0.5 - i * 0.12, 0, 1), y = 112 + (cy + dy - 112) * k * k, x = cx + dx * k; line(ctx, [[x, y - 9], [x - 5, y + 2], [x, y + 7], [x + 5, y + 2], [x, y - 9]], { w: 1.8, color: R, seed: 92 + i }); });
      if (T.drops >= 0.5) {
        const k = clamp((T.drops - 0.5) / 0.8, 0, 1);
        if (r.mark) {
          const bl = geo.wob(geo.seg(geo.ellipse(cx + 2, cy, 40 + 34 * k, 22 + 20 * k), 6), 11, 5, 0.05);
          hatch(ctx, bl, R, r.faint ? 0.22 : 0.5, 5, 1); if (!r.faint) hatch(ctx, bl, R, 0.4, 6, -1); line(ctx, closed(bl), { w: r.faint ? 1.2 : 1.8, color: R, seed: 95, retrace: false });
          if (k >= 1) text(ctx, r.mark + '!', cx + 110, cy - 46, { size: 24, color: R });
        } else {
          spots.forEach(([dx, dy], i) => { const d = geo.ellipse(cx + dx, cy + dy, 13, 9); line(ctx, d, { w: 1.8, color: R, seed: 96 + i }); line(ctx, [[cx + dx - 6, cy + dy - 2], [cx + dx - 2, cy + dy - 5]], { w: 1.3, color: R, seed: 99 }); });
          if (k >= 1) { text(ctx, 'wipes clean', cx + 110, cy - 46, { size: 24, color: G }); Ink.tick(ctx, cx + 80, cy - 50, 1.1); }
        }
      }
      tag(ctx, POLY[pi].name + ' sheet', 120, 60);
      hint(ctx, 'tap to squeeze the pipette', 230, 110);
    }

    function render() {
      S.begin(); const ctx = S.ctx, k = TESTS[ti].k;
      ctx.save(); if (k !== 'chem') ctx.translate(0, -SHIFT);
      (k === 'drop' ? drawDrop : k === 'bend' ? drawBend : k === 'scratch' ? drawScratch : k === 'see' ? drawSee : drawChem)(ctx);
      ctx.restore();
      if (T.done && (k === 'drop' || k === 'chem' || (k === 'bend' && T.broke)) && T.t > 1.4) text(ctx, 'tap for a new sample', k === 'bend' ? 560 : 150, k === 'drop' ? 110 : k === 'bend' ? 250 : 300, { size: 20, align: 'center', a: 0.7 });
    }

    run(root, S, (dt) => {
      let anim = false; const k = TESTS[ti].k;
      if (T.done) { T.t += dt; if (T.t < 1.6) anim = true; }
      if (k === 'drop') {
        const hitY = 262 - 22, floor = 340 - 22;
        if (T.fall) {
          anim = true; T.vy += 2200 * dt; T.by += T.vy * dt;
          if (!T.broke && T.by >= hitY && T.vy > 0) {
            if (res().brk) { T.broke = true; T.brT = 0; T.vy *= 0.55; Book.sfx('thud', { gain: 0.7 }); finish(); }
            else { T.by = hitY; if (T.vy > 120) Book.sfx('thud', { gain: Math.min(0.6, T.vy / 1500) }); T.fv = T.vy * 0.03; T.vy = -T.vy * 0.5; if (!T.done) finish(); if (Math.abs(T.vy) < 70) { T.vy = 0; T.fall = false; } }
          }
          if (T.broke && T.by >= floor) { T.by = floor; if (T.vy > 150) { T.vy = -T.vy * 0.3; Book.sfx('thud', { gain: 0.3 }); } else { T.vy = 0; T.fall = false; } }
        }
        if (T.broke) { T.brT += dt; if (T.brT < 1) anim = true; }
        if (Math.abs(T.flex) > 0.05 || Math.abs(T.fv) > 0.05) { T.fv += (-700 * T.flex - 14 * T.fv) * dt; T.flex += T.fv * dt * 6; anim = true; } else T.flex = 0;
      } else if (k === 'bend') {
        if (T.broke) { T.brT += dt; if (T.brT < 1.2) anim = true; }
        else if (!T.drag && Math.abs(T.a) > 0.005) { T.a *= Math.pow(0.0005, dt); anim = true; }
      } else if (k === 'chem') {
        if (T.drops >= 0 && T.drops < 1.4) { T.drops += dt; anim = true; if (T.drops >= 1.3) finish(); }
      }
      if (anim || S.dirty) { S.dirty = false; render(); }
    });
    select(0, 0);
    if (document.fonts) document.fonts.ready.then(() => (S.dirty = true));
  }

  // =====================================================================================
  Book.page({
    id: 'p04',
    title: 'The thermoforming six',
    build(ui, root) {
      css();
      ui.h('The thermoforming six');
      ui.p('AQA wants you to know <b>six thermoforming polymers</b>: acrylic, HIPS, HDPE, PP, PVC and PET. They all soften when heated, but they do <b>not</b> behave the same. Here is a sample sheet of each. Test them!');

      const d = ui.el('div', 'box p04-bench'); requestAnimationFrame(() => Ink.frame(d));
      ui.el('span', 'tag', 'Test bench', d);
      ui.el('p', '', 'Tap a <b>?</b> box to pick a sample and a test, then run the test with your finger. You do not need all 30. Find out: <b>which one cracks</b> when hit, <b>which one survives 20 bends</b> with no damage, and <b>which two are see-through</b>.', d).style.margin = '0 0 8px';
      bench(ui, root, d);

      ui.h('What did you find?', { size: 40 });
      const qs = [];
      qs.push(ui.mcq({ id: 'p04.acrylic', label: 'Test bench: acrylic in the drop test (brittle)', q: 'Acrylic is hard and stiff. What happened to it in the <b>drop test</b>, and what does that show?',
        options: [
          { t: 'It cracked: acrylic is brittle', ok: true, why: 'Yes! Acrylic is hard and stiff, but brittle: a sudden impact cracks it.' },
          { t: 'It survived: acrylic is tough', mis: 'acrylic-tough', why: 'Run the drop test on acrylic again and watch the sheet. Hard is not the same as tough.' },
          { t: 'It dented: acrylic is soft', mis: 'property-word', why: 'It did not dent. Run the drop test on acrylic again and watch the sheet.' },
          { t: 'It bent: acrylic is flexible', mis: 'property-word', why: 'Acrylic is stiff, so it did not bend. Run the drop test on acrylic again and watch the sheet.' },
        ] }));
      qs.push(ui.mcq({ id: 'p04.hinge', label: 'Test bench: which polymer for a hinge (PP)', q: 'A lunch-box lid has a thin hinge that must bend <b>thousands of times</b>. Which polymer is the best choice?',
        options: [
          { t: 'Polypropylene (PP)', ok: true, why: 'Yes! PP resists fatigue: it can bend again and again without cracking. A thin PP hinge is called a “living hinge”.' },
          { t: 'Acrylic (PMMA)', mis: 'pp-hinge,acrylic-tough', why: 'Acrylic snapped on the very first bend. Which strip had no damage at all after 20 bends?' },
          { t: 'High impact polystyrene (HIPS)', mis: 'pp-hinge', why: 'HIPS went white and split after a few bends. Which strip had no damage at all after 20 bends?' },
          { t: 'Polyvinyl chloride (PVC)', mis: 'pp-hinge', why: 'Rigid PVC went white and split after a few bends. Which strip had no damage at all after 20 bends?' },
        ] }));
      qs.push(ui.mcq({ id: 'p04.clear', label: 'Test bench: which two are see-through (acrylic, PET)', q: 'Which <b>two</b> samples were see-through (transparent)?',
        options: [
          { t: 'Acrylic and PET', ok: true, why: 'Yes! Acrylic can be glass-clear (windows, light lenses) and PET is clear (drinks bottles).' },
          { t: 'HIPS and HDPE', mis: 'thermoform-mixup', why: 'Both of those hid the card. Try the see-through test on every sample.' },
          { t: 'PP and PVC', mis: 'thermoform-mixup', why: 'Both of those hid the card. Try the see-through test on every sample.' },
          { t: 'Acrylic and HDPE', mis: 'thermoform-mixup', why: 'One of those is right, but HDPE is opaque. Try the see-through test on every sample.' },
        ] }));

      ui.p('<span class="small">The notes un-blur when all three questions are right. Read them carefully: they blur again while you do the last activity.</span>');
      const notes = ui.box(`<b>Acrylic (PMMA)</b>: hard, stiff, shiny, transparent or brightly coloured, weather-resistant, but <span class="key">brittle</span> and scratches easily. <i>Shop signs, car light lenses, baths.</i><br>
        <b>HIPS</b> (high impact polystyrene): tough, lightweight, fairly rigid, cheap, <span class="key">very easy to vacuum form</span>, food safe. <i>Yoghurt pots, packaging trays, toy casings.</i><br>
        <b>HDPE</b> (high density polythene): stiff, strong, tough, <span class="key">chemical-resistant</span>, waxy feel, opaque. <i>Milk and bleach bottles, pipes, wheelie bins.</i><br>
        <b>PP</b> (polypropylene): tough, flexible, <span class="key">resists fatigue</span> (living hinge), chemical- and heat-resistant. <i>Hinged lunch-box lids, school chairs, crates, bottle caps.</i><br>
        <b>PVC</b> (polyvinyl chloride): hard and tough, rigid (uPVC) or made flexible with plasticiser, <span class="key">weather-resistant</span>, good electrical insulator. <i>Window frames, drain pipes, cable insulation.</i><br>
        <b>PET</b> (polyethylene terephthalate): <span class="key">clear</span>, tough, strong, lightweight, food safe, keeps the fizz in. <i>Fizzy drinks bottles, food trays, polyester fibre.</i>`, { tag: 'Notes: the thermoforming six' });

      const match = ui.match({ id: 'p04.uses', label: 'Match 12 products to the six thermoforming polymers', q: 'Tap a polymer, then tap the <b>two products</b> it is used for. (The notes blur while you do this.)',
        pairs: [
          ['Acrylic', 'shop sign + car light lens', 'thermoform-mixup'],
          ['HIPS', 'yoghurt pot + vacuum-formed tray', 'thermoform-mixup'],
          ['HDPE', 'milk bottle + wheelie bin', 'thermoform-mixup'],
          ['PP', 'hinged lunch-box lid + school chair', 'thermoform-mixup'],
          ['PVC', 'window frame + drain pipe', 'thermoform-mixup'],
          ['PET', 'fizzy drinks bottle + polyester fibre', 'thermoform-mixup'],
        ] });

      // notes are blurred until the three conclusions are right, and again while the match is in progress
      const it = (id) => Book.state.items[id];
      const qsRight = () => ['acrylic', 'hinge', 'clear'].every((k) => it('p04.' + k) && it('p04.' + k).correct === true);
      let matching = false;
      const sync = () => { const m = it('p04.uses'), mDone = m && m.correct != null; notes.classList.toggle('peek-lock', !qsRight() || (matching && !mDone)); };
      sync();
      qs.forEach((q) => q.addEventListener('click', () => setTimeout(sync, 50)));
      match.addEventListener('pointerdown', () => { matching = true; sync(); }, { passive: true });
      match.addEventListener('click', () => setTimeout(sync, 50));
    },
  });
})();
