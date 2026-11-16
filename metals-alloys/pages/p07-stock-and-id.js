// Page 7 — Name that metal. Eight unlabelled sample bars; the student tests each one on a pen-drawn bench (look closely,
// magnet, weigh, file) and then names it. The first guess for each bar is the one that scores. Then stock forms:
// match six drawn cross-sections to their names.
(function () {
  'use strict';
  const B = Ink.BLUE, RD = Ink.RED, GR = Ink.GREEN, rgba = Ink.rgba, geo = Ink.geo;
  const HANDF = (s) => `400 ${s}px "Gloria Hallelujah", "Comic Sans MS", cursive`;
  const LABF = (s) => `600 ${s}px Fredoka, "Arial Rounded MT Bold", system-ui, sans-serif`;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const TAU = Math.PI * 2;
  const PAPER = '#fbfaf5';
  function text(x, s, px, py, o = {}) {
    x.save(); x.font = (o.font === 'hand' ? HANDF : LABF)(o.size || 22);
    x.fillStyle = rgba(o.color || B, o.a ?? 0.92); x.textAlign = o.align || 'left'; x.textBaseline = 'alphabetic';
    x.fillText(s, px, py); x.restore();
  }
  // a quick wobbly biro line (cheap enough to redraw every frame)
  function pen(x, pts, o = {}) {
    const P = o.wob === false ? pts : geo.wob(geo.seg(pts, 4), o.seed ?? 11, o.amp ?? 0.7);
    x.save(); x.strokeStyle = rgba(o.color || B, o.a ?? 0.88); x.lineWidth = o.w ?? 2.2; x.lineCap = 'round'; x.lineJoin = 'round';
    x.beginPath(); P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); if (o.close) x.closePath(); x.stroke(); x.restore();
  }
  const path = (x, P) => { x.beginPath(); P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.closePath(); };
  const fillP = (x, P, style) => { x.save(); x.fillStyle = style; path(x, P); x.fill(); x.restore(); };
  const eraseP = (x, P) => { x.save(); x.globalCompositeOperation = 'destination-out'; x.fillStyle = '#000'; path(x, P); x.fill(); x.restore(); };
  const box = (x0, y0, w, h) => [[x0, y0], [x0 + w, y0], [x0 + w, y0 + h], [x0, y0 + h]];

  // ---------------------------------------------------------------------------------------------------------
  // the facts (docs/CONTENT.md). mass = density × 100 cm³. lvl = how deep the file cuts (0 = it skids).
  // ---------------------------------------------------------------------------------------------------------
  const MET = {
    al: { name: 'Aluminium', col: [196, 203, 212], fe: false, mass: 270, look: 'silvery', lvl: 4 },
    brass: { name: 'Brass', col: [226, 184, 58], fe: false, mass: 850, look: 'golden yellow', lvl: 2 },
    ci: { name: 'Cast iron', col: [92, 94, 102], fe: true, mass: 720, look: 'dark grey, rough and grainy', lvl: 1 },
    cu: { name: 'Copper', col: [202, 110, 70], fe: false, mass: 890, look: 'reddish-brown', lvl: 3 },
    hcs: { name: 'High carbon steel', col: [150, 153, 161], fe: true, mass: 780, look: 'plain grey, smooth', lvl: 0 },
    hss: { name: 'High speed steel', fe: true },
    lcs: { name: 'Low carbon steel', col: [150, 153, 161], fe: true, mass: 780, look: 'plain grey, smooth', lvl: 2 },
    ss: { name: 'Stainless steel', fe: true },
    sn: { name: 'Tin', col: [222, 227, 232], fe: false, mass: 730, look: 'bright silvery', lvl: 5 },
    zn: { name: 'Zinc', col: [146, 168, 198], fe: false, mass: 710, look: 'bluish-grey', lvl: 3 },
  };
  const NAMES = ['al', 'brass', 'ci', 'cu', 'hcs', 'hss', 'lcs', 'ss', 'sn', 'zn']; // alphabetical
  const BARS = [['A', 'zn'], ['B', 'hcs'], ['C', 'cu'], ['D', 'al'], ['E', 'ci'], ['F', 'sn'], ['G', 'brass'], ['H', 'lcs']];
  const FILEW = [
    ['The file skids: hardly a mark!', 'file skids, hardly a mark'],
    ['Very hard work: only a faint scratch.', 'very hard work, faint scratch'],
    ['Hard work: a shallow groove.', 'hard work, shallow groove'],
    ['Fairly easy: a clear groove.', 'fairly easy, clear groove'],
    ['Easy: a deep groove.', 'easy, deep groove'],
    ['Very easy: the file bites in really deep.', 'very easy, very deep groove'],
  ];
  const TESTS = ['look', 'magnet', 'weigh', 'file'];
  const TNAME = { look: 'Look closely', magnet: 'Magnet', weigh: 'Weigh', file: 'File it' };
  const HOWTO = {
    look: 'Drag the magnifying glass onto the bar (or tap it).',
    magnet: 'Drag the magnet down to the bar (or tap it).',
    weigh: 'Drag the bar onto the scales (or tap it).',
    file: 'Rub the file to and fro across the bar (or tap it).',
  };
  const logLine = (m, t) => ({ look: 'Looks: ' + MET[m].look, magnet: MET[m].fe ? 'Magnet: sticks' : 'Magnet: no pull', weigh: 'Mass: ' + MET[m].mass + ' g', file: 'File: ' + FILEW[MET[m].lvl][1] }[t]);
  const ferrousMix = (m) => ['lcs', 'hcs', 'ci'].includes(m);
  function misFor(truth, guess) {
    if (MET[truth].fe !== MET[guess].fe) return 'ferrous-meaning';
    if (MET[truth].fe) return ferrousMix(guess) ? 'steel-mixup' : 'alloy-mixup';
    return truth === 'brass' || guess === 'brass' ? 'alloy-mixup' : 'nonferrous-mixup';
  }
  function hintFor(truth, guess, done) {
    const not = (t) => !done.includes(t);
    if (MET[truth].fe !== MET[guess].fe) return not('magnet') ? 'You have not tried the magnet on this bar yet. It sorts the metals into two families.' : 'Think about the magnet test again: metals that contain iron stick, the others do not.';
    if (MET[truth].fe) return not('file') ? 'Right family! You have not filed this bar yet: remember the carbon rule.' : not('look') ? 'Right family! Now look closely at its surface.' : 'Right family! Think about the carbon rule: how hard did the file find it, and what does the surface look like?';
    const miss = ['look', 'weigh', 'file'].filter(not);
    return miss.length ? `Right family! You have not tried "${TNAME[miss[0]]}" on this bar yet.` : 'Right family! Compare its colour, its mass and how easily the file cut it.';
  }

  // ---------------------------------------------------------------------------------------------------------
  // drawing
  // ---------------------------------------------------------------------------------------------------------
  const BW = 260, BH = 46, DX = 22, DY = -16; // the sample bar: front face BW × BH, drawn in oblique view
  const stip = (() => { const r = H.rng(41), o = []; for (let i = 0; i < 150; i++) o.push([r(), r(), r.range(0.8, 1.9)]); return o; })();
  // o = { look: 0..1 (colour wash revealed), groove: 0..1, seed }
  function drawBar(x, m, o = {}) {
    const M = MET[m], lp = o.look || 0, sd = o.seed || 3, rough = m === 'ci' ? lp : 0;
    const front = box(0, 0, BW, BH), top = [[0, 0], [DX, DY], [BW + DX, DY], [BW, 0]], end = [[BW, 0], [BW + DX, DY], [BW + DX, BH + DY], [BW, BH]];
    if (lp > 0) {
      fillP(x, front, rgba(M.col, 0.62 * lp)); fillP(x, top, rgba(M.col, 0.34 * lp)); fillP(x, end, rgba(M.col, 0.85 * lp));
      if (rough) { x.save(); x.fillStyle = rgba([40, 42, 60], 0.5 * lp); stip.forEach(([u, v, r], i) => { const px = i % 3 ? u * BW : u * BW + v * DX, py = i % 3 ? v * BH : v * DY; x.beginPath(); x.arc(px, py, r, 0, 7); x.fill(); }); x.restore(); }
      if (m === 'sn') [[52, 9], [150, 12], [206, 8]].forEach(([gx, gy], i) => { pen(x, [[gx, gy + 20], [gx + 18, gy]], { seed: 21 + i, w: 1.5, a: 0.5 * lp }); pen(x, [[gx + 8, gy + 24], [gx + 22, gy + 8]], { seed: 25 + i, w: 1.2, a: 0.4 * lp }); });
    }
    const g = (o.groove || 0), d = M.lvl * 3.4 * g, gx = 128;
    if (g > 0 && M.lvl > 0) {
      const v = [[gx - 5 - d * 0.5, -0.5], [gx, d], [gx + 5 + d * 0.5, -0.5]];
      eraseP(x, v.concat([[gx + 5 + d * 0.5, -2], [gx - 5 - d * 0.5, -2]]));
      const hw = 5 + d * 0.5; fillP(x, [[gx - hw, 0], [gx + hw, 0], [gx + hw + DX, DY], [gx - hw + DX, DY]], rgba([30, 36, 90], 0.3));
      pen(x, v, { seed: 31, w: 2, amp: 0.3 }); pen(x, [[gx - hw, 0], [gx - hw + DX, DY]], { seed: 33, w: 1.3, amp: 0.3, a: 0.7 }); pen(x, [[gx + hw, 0], [gx + hw + DX, DY]], { seed: 35, w: 1.3, amp: 0.3, a: 0.7 });
    } else if (g > 0) {
      pen(x, [[gx - 8, -5], [gx + 4, -11]], { seed: 31, w: 1.1, a: 0.5 * g, color: RD, amp: 0.2 }); pen(x, [[gx + 4, -4], [gx + 14, -10]], { seed: 33, w: 1.1, a: 0.5 * g, color: RD, amp: 0.2 });
    }
    const amp = 0.6 + rough * 1.3;
    pen(x, front, { close: true, seed: sd, w: 2.4, amp }); pen(x, [[0, 0], [DX, DY], [BW + DX, DY], [BW, 0]], { seed: sd + 2, w: 2.2, amp }); pen(x, [[BW + DX, DY], [BW + DX, BH + DY], [BW, BH]], { seed: sd + 4, w: 2.2, amp });
    // a little pen shading on the end face so it reads as solid before it has been looked at
    x.save(); path(x, end); x.clip(); x.strokeStyle = rgba(B, 0.4); x.lineWidth = 1; x.beginPath(); for (let k = -BH; k < BH + 30; k += 6) { x.moveTo(BW - 4, k + BH); x.lineTo(BW + DX + 4, k + BH - 26); } x.stroke(); x.restore();
  }
  function drawMagnifier(x, tx, ty) {
    x.save(); x.translate(tx, ty);
    pen(x, geo.ellipse(0, 0, 44, 44), { seed: 5, w: 3 }); pen(x, geo.ellipse(0, 0, 38, 38, 3.4, 4.5), { seed: 7, w: 1.6, a: 0.5 });
    const h = [[30, 34], [36, 28], [78, 68], [70, 76]]; fillP(x, h, rgba(B, 0.3)); pen(x, h, { close: true, seed: 9, w: 2.2, amp: 0.4 });
    x.restore();
  }
  function drawMagnet(x, tx, ty) {
    x.save(); x.translate(tx, ty);
    const outer = [[-46, 40], [-46, -6]].concat(geo.ellipse(0, -6, 46, 40, Math.PI, TAU), [[46, 40], [20, 40], [20, -6]], geo.ellipse(0, -6, 20, 16, TAU, Math.PI), [[-20, 40]]);
    fillP(x, outer, rgba(RD, 0.42));
    [[-46, 22, 26, 18], [20, 22, 26, 18]].forEach(([a, b, w, h]) => { eraseP(x, box(a, b, w, h)); fillP(x, box(a, b, w, h), 'rgba(160,168,190,0.35)'); pen(x, [[a, b], [a + w, b]], { seed: 13, w: 1.6, color: RD, amp: 0.3 }); });
    pen(x, outer, { close: true, seed: 11, w: 2.6, color: RD, amp: 0.5 });
    x.restore();
  }
  function drawFile(x, tx, ty, shake) {
    x.save(); x.translate(tx, ty + (shake || 0)); x.rotate(-0.05);
    const body = box(-120, -9, 180, 18), handle = geo.rect(74, -14, 62, 28, 12);
    fillP(x, body, 'rgba(120,128,150,0.3)');
    x.save(); path(x, body); x.clip(); x.strokeStyle = rgba(B, 0.55); x.lineWidth = 1; x.beginPath(); for (let k = -130; k < 70; k += 7) { x.moveTo(k, 10); x.lineTo(k + 18, -10); x.moveTo(k + 18, 10); x.lineTo(k, -10); } x.stroke(); x.restore();
    pen(x, body, { close: true, seed: 15, w: 2.2, amp: 0.4 }); pen(x, [[60, -4], [74, -3]], { seed: 17, w: 2 }); pen(x, [[60, 4], [74, 3]], { seed: 19, w: 2 });
    fillP(x, handle, 'rgba(196,140,70,0.5)'); pen(x, handle, { seed: 21, w: 2.4, amp: 0.4 }); pen(x, [[84, -13], [84, 13]], { seed: 23, w: 1.4, a: 0.6 });
    x.restore();
  }
  function drawScale(x, cx, by, reading) {
    const base = box(cx - 112, by - 46, 224, 46), pan = box(cx - 138, by - 60, 276, 10);
    Ink.hatchShadow(x, base, 1, 6, 5); fillP(x, base, 'rgba(120,140,235,0.12)'); pen(x, base, { close: true, seed: 3, w: 2.4 });
    fillP(x, pan, 'rgba(120,140,235,0.22)'); pen(x, pan, { close: true, seed: 5, w: 2.2, amp: 0.4 }); pen(x, [[cx - 20, by - 50], [cx - 20, by - 46]], { seed: 7 }); pen(x, [[cx + 20, by - 50], [cx + 20, by - 46]], { seed: 9 });
    const win = box(cx - 62, by - 40, 124, 32); eraseP(x, win); fillP(x, win, 'rgba(200,220,200,0.45)'); pen(x, win, { close: true, seed: 11, w: 1.8, amp: 0.3 });
    text(x, reading == null ? '- - -' : Math.round(reading) + ' g', cx, by - 15, { size: 24, align: 'center' });
  }

  // an interactive canvas with an on-demand render loop (sleeps when the page is hidden)
  function Stage(parent, W, Hh) {
    const c = document.createElement('canvas'); parent.appendChild(c);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = Math.round(W * dpr); c.height = Math.round(Hh * dpr);
    Object.assign(c.style, { width: '100%', height: 'auto', aspectRatio: W + ' / ' + Hh, display: 'block', touchAction: 'pan-y', userSelect: 'none', webkitUserSelect: 'none', webkitTouchCallout: 'none', cursor: 'pointer' });
    const ctx = c.getContext('2d');
    const S = { c, ctx, W, H: Hh, render: () => false };
    S.pos = (e) => { const r = c.getBoundingClientRect(); return [((e.clientX - r.left) * W) / r.width, ((e.clientY - r.top) * Hh) / r.height]; };
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
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => S.go());
    return S;
  }

  // ---------------------------------------------------------------------------------------------------------
  // stock forms: a short length of each, drawn in oblique view with the cut end facing you
  // ---------------------------------------------------------------------------------------------------------
  const ngon = (n, r, rot = 0) => { const o = []; for (let i = 0; i < n; i++) { const a = rot + (i * TAU) / n; o.push([Math.cos(a) * r, Math.sin(a) * r]); } return o; };
  const STOCK = [
    ['sheet', 'Sheet', { poly: box(-50, -2.5, 100, 5), ext: [34, -34], at: [58, 66] }],
    ['round', 'Round bar', { poly: ngon(28, 19), ext: [62, -24], at: [44, 56], round: true }],
    ['square', 'Square bar', { poly: box(-17, -17, 34, 34), ext: [62, -24], at: [42, 56] }],
    ['hex', 'Hexagonal bar', { poly: ngon(6, 21), ext: [62, -24], at: [44, 56] }],
    ['tube', 'Tube', { poly: ngon(28, 20), hole: ngon(24, 13), ext: [62, -24], at: [44, 56], round: true }],
    ['angle', 'Angle', { poly: [[-20, -20], [-12, -20], [-12, 12], [20, 12], [20, 20], [-20, 20]], ext: [62, -24], at: [42, 54] }],
  ];
  function stockCanvas(spec) {
    const W = 150, Hh = 92, dpr = Math.min(2, window.devicePixelRatio || 1);
    const c = document.createElement('canvas'); c.width = W * dpr; c.height = Hh * dpr; c.className = 'p07-stockc';
    const x = c.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.lineCap = 'round'; x.lineJoin = 'round';
    x.translate(spec.at[0], spec.at[1]);
    const P = spec.poly, [ex, ey] = spec.ext, n = P.length;
    let area = 0; P.forEach((p, i) => { const q = P[(i + 1) % n]; area += p[0] * q[1] - q[0] * p[1]; });
    const sgn = area > 0 ? 1 : -1; // outward normal of edge p→q is sgn·(dy, −dx)
    const quads = [];
    P.forEach((p, i) => { const q = P[(i + 1) % n], nx = sgn * (q[1] - p[1]), ny = -sgn * (q[0] - p[0]); if (nx * ex + ny * ey > 0.01) quads.push([p, q, [q[0] + ex, q[1] + ey], [p[0] + ex, p[1] + ey]]); });
    quads.forEach((Q) => { fillP(x, Q, PAPER); fillP(x, Q, rgba(B, 0.1)); });
    if (spec.round) { // just the silhouette: two tangent lines and the far rim
      const r = Math.hypot(P[0][0], P[0][1]), L = Math.hypot(ex, ey), tx = (-ey / L) * r, ty = (ex / L) * r;
      pen(x, [[tx, ty], [tx + ex, ty + ey]], { seed: 3, w: 2 }); pen(x, [[-tx, -ty], [-tx + ex, -ty + ey]], { seed: 5, w: 2 });
      const a0 = Math.atan2(ty, tx); pen(x, geo.ellipse(ex, ey, r, r, a0 - Math.PI, a0), { seed: 7, w: 2 });
    } else quads.forEach((Q, i) => pen(x, Q, { close: true, seed: 3 + i * 2, w: 1.8, amp: 0.4 }));
    fillP(x, P, PAPER); Ink.hatchFill(x, P, 1, B, 1.5);
    if (spec.hole) { // look down the bore: paper, then the far inner wall
      fillP(x, spec.hole, PAPER);
      x.save(); path(x, spec.hole); x.clip(); const r = Math.hypot(spec.hole[0][0], spec.hole[0][1]); fillP(x, geo.ellipse(-ex * 0.16, -ey * 0.16, r, r, 0, TAU), rgba(B, 0.16)); pen(x, geo.ellipse(ex * 0.3, ey * 0.3, r, r, 0, TAU), { seed: 9, w: 1.4, a: 0.6 }); x.restore();
      pen(x, spec.hole, { close: true, seed: 13, w: 2, amp: 0.35 });
    }
    pen(x, P, { close: true, seed: 11, w: 2.4, amp: 0.4 });
    return c;
  }

  Book.page({
    id: 'p07',
    title: 'Name that metal',
    build(ui, root) {
      const css = document.createElement('style');
      css.textContent = `
        .p07-lab{position:relative;margin:0 0 calc(var(--R)*1.4);padding:12px 14px 14px;background:rgba(251,250,245,.9)}
        .p07-rack{display:grid;grid-template-columns:repeat(8,1fr);gap:6px;margin:0 0 10px}
        .p07-bar{background:#fff;border:2px solid rgba(30,46,150,.4);border-radius:10px;min-height:76px;padding:3px 2px 4px;cursor:pointer;font:700 17px Fredoka;color:var(--ink);line-height:1.15;display:flex;flex-direction:column;align-items:center;justify-content:center;touch-action:manipulation;min-width:0}
        .p07-bar canvas{width:100%;max-width:96px;height:auto;display:block}
        .p07-bar.on{background:#e8ecff;border-color:var(--ink);box-shadow:0 0 0 3px rgba(30,46,150,.18)}
        .p07-bar .nm{font:600 12.5px Fredoka;color:var(--green);min-height:15px;line-height:15px;text-align:center}
        .p07-bar.miss .nm{color:var(--red)}
        .p07-tools{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 6px}
        .p07-tool{flex:1 1 120px;font:700 17px Fredoka;color:var(--ink);background:#fff;border:2px solid rgba(30,46,150,.4);border-radius:12px;min-height:48px;padding:6px 10px;cursor:pointer;touch-action:manipulation}
        .p07-tool.on{background:var(--ink);color:#fff;border-color:var(--ink)}
        .p07-tool .tk{color:var(--green);margin-left:5px}.p07-tool.on .tk{color:#9df0b6}
        .p07-log{display:flex;flex-wrap:wrap;gap:6px;min-height:36px;margin:4px 0 10px;align-items:center}
        .p07-chip{font:600 15px Fredoka;color:var(--ink);background:rgba(255,236,120,.5);border-radius:8px;padding:3px 10px;line-height:1.5}
        .p07-log .none{font-size:16px;color:rgba(30,46,150,.65)}
        .p07-ask{font:700 18px Fredoka;margin:0 0 8px;line-height:1.4}
        .p07-names{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px}
        .p07-names .opt{min-height:48px;padding:8px 10px;font-size:17.5px;text-align:center}
        .p07-foot{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-top:12px}
        .p07-foot .btn{margin-top:0}
        .p07-score{font:600 16px Fredoka;color:var(--ink);flex:1 1 200px}
        .p07-clue{display:none;margin-top:12px;background:rgba(255,236,120,.38);border-left:5px solid rgba(240,200,60,.9);padding:8px 14px;font-size:17px;line-height:1.5}
        .p07-clue.on{display:block}.p07-clue ul{margin:4px 0 0;padding-left:20px}
        .p07-stockc{width:132px;height:81px;display:block;margin:0 auto}
        .p07-stock .pairs{grid-template-columns:1fr 1.2fr}
        .p07-stock .pairs .card{justify-content:center;min-height:92px}
        @media (max-width:900px){.p07-rack{grid-template-columns:repeat(4,1fr)}}`;
      root.appendChild(css);

      ui.h('Name that metal');
      ui.p('Eight metal bars in the store have <b>lost their labels</b>. They are all exactly the same size. Pick a bar, <b>test it</b> with the tools, then decide which metal it is.');
      ui.p('<span class="key">Your first guess for each bar is the one that scores</span>, so collect enough evidence before you name it!', 'small');

      const rec = ui.record('p07.id', { label: 'Identify 8 unlabelled metal bars from tests (first guess scores)', type: 'identify', max: 8 });
      const sv = rec.get() || {};
      const ST = {}; BARS.forEach(([L]) => { const o = (sv.bars || {})[L] || {}; ST[L] = { t: (o.t || []).slice(), g: (o.g || []).slice() }; });
      let clue = !!sv.clue;
      const truth = (L) => BARS.find((b) => b[0] === L)[1];
      const solved = (L) => ST[L].g.includes(truth(L));
      const firstOk = (L) => ST[L].g[0] === truth(L);
      const allDone = () => BARS.every(([L]) => solved(L));
      let cur = (BARS.find(([L]) => !solved(L)) || BARS[0])[0], mode = 'look';

      const lab = ui.el('div', 'p07-lab'); requestAnimationFrame(() => Ink.frame(lab, { w: 2.4 }));
      const rack = ui.el('div', 'p07-rack', '', lab), barEls = {};
      BARS.forEach(([L]) => {
        const b = ui.el('button', 'p07-bar', '', rack); b.type = 'button';
        const c = document.createElement('canvas'); c.width = 192; c.height = 64; b.appendChild(c);
        ui.el('span', '', 'Bar ' + L, b); ui.el('span', 'nm', '', b); barEls[L] = b;
        b.onclick = () => { if (cur === L) return; cur = L; Book.sfx('tick', { gain: 0.5 }); reset(); sync(); };
      });
      const tools = ui.el('div', 'p07-tools', '', lab), toolEls = {};
      TESTS.forEach((t) => { const b = ui.el('button', 'p07-tool', '', tools); b.type = 'button'; toolEls[t] = b; b.onclick = () => { mode = t; Book.sfx('tick', { gain: 0.5 }); reset(); sync(); }; });
      const stageWrap = ui.el('div', '', '', lab);
      const W = 860, Hh = 330, BENCH = 272, HOME = [70, BENCH - BH], SCX = 668, PANY = BENCH - 60;
      const S = Stage(stageWrap, W, Hh);
      const log = ui.el('div', 'p07-log', '', lab);
      const ask = ui.el('div', 'p07-ask', '', lab);
      const names = ui.el('div', 'p07-names', '', lab), nameEls = {};
      NAMES.forEach((m) => { const b = ui.el('button', 'opt', MET[m].name, names); b.type = 'button'; nameEls[m] = b; b.onclick = () => guess(m); });
      const fb = ui.el('div', 'fb', '', lab);
      const foot = ui.el('div', 'p07-foot', '', lab);
      const score = ui.el('span', 'p07-score', '', foot);
      const clueBtn = ui.el('button', 'btn ghost', 'Stuck? Clue card', foot); clueBtn.type = 'button';
      const clueBox = ui.el('div', 'p07-clue', `<b style="font-family:Fredoka">Clue card</b> (it does not say which bar is which!)<ul>
        <li><b>Ferrous</b> metals contain iron: a magnet picks them up. <b>Non-ferrous</b> metals: no pull.</li>
        <li>A steel bar this size has a mass of 780 g. Aluminium has about a third of the density of steel.</li>
        <li>The carbon rule: more carbon makes a ferrous metal harder. A file is made of high carbon steel, so it cannot cut a bar that is as hard as itself.</li>
        <li>Cast iron is poured into a mould, which leaves a rough, grainy skin.</li>
        <li>Colours: aluminium is silvery, tin is bright silvery, zinc is bluish-grey, copper is reddish-brown, brass is golden yellow.</li>
        <li>Tin is the softest metal here. Brass is harder than copper.</li></ul>`, lab);
      clueBtn.onclick = () => { const on = !clueBox.classList.contains('on'); clueBox.classList.toggle('on', on); clueBtn.textContent = on ? 'Hide the clue card' : 'Stuck? Clue card'; if (on && !clue) { clue = true; commit(); } Book.sfx('paper', { gain: 0.3, dur: 0.2 }); };

      const notes = ui.box(`<p><b>How to tell metals apart</b></p>
        <p><b>Magnet:</b> it picks up the <span class="key">ferrous</span> metals (they contain iron). <b>Colour:</b> copper is reddish-brown, brass is golden yellow, zinc is bluish-grey.</p>
        <p><b>Mass:</b> aluminium is very light (low density). <b>File:</b> soft metals such as tin cut easily; <span class="key">more carbon = harder</span>, so high carbon steel is too hard for the file.</p>`, { tag: 'Notes' });
      notes.style.display = 'none';

      function commit() {
        const n = BARS.filter(([L]) => firstOk(L)).length, done = allDone(), mis = [];
        BARS.forEach(([L]) => ST[L].g.forEach((g) => { if (g !== truth(L)) { const m = misFor(truth(L), g); if (!mis.includes(m)) mis.push(m); } }));
        const answer = BARS.map(([L]) => {
          const s = ST[L]; if (!s.t.length && !s.g.length) return L + ': not started';
          const gs = s.g.length ? s.g.map((g) => MET[g].name + (g === truth(L) ? ' ✓' : ' ✗')).join(' → ') : 'not named yet';
          return `${L}: ${gs} [tests: ${s.t.join(', ') || 'none'}]`;
        }).join('; ') + (clue ? ' | clue card used' : '');
        const bars = {}; BARS.forEach(([L]) => (bars[L] = { t: ST[L].t, g: ST[L].g }));
        rec.set({ answer, correct: done ? n === 8 : null, score: n, max: 8, mis: mis.join(','), bars, clue });
      }

      // ---- the bench: what moves ----
      let tool, bar, attached, onPan, reading, lookP, fileP, acc, auto, grab, shake, lastRub = 0, msg = null;
      function reset() {
        const s = ST[cur];
        tool = { x: 690, y: mode === 'file' ? 96 : 84, hx: 690, hy: mode === 'file' ? 96 : 84 };
        bar = { x: HOME[0], y: HOME[1], vy: 0 }; attached = false; onPan = false; reading = null; auto = null; grab = null; shake = 0; acc = 0;
        lookP = s.t.includes('look') ? 1 : 0; fileP = s.t.includes('file') ? 1 : 0; msg = null;
        S.go();
      }
      function result(t) {
        const s = ST[cur], m = truth(cur);
        msg = { look: ['It looks ' + MET[m].look + '.'], magnet: [MET[m].fe ? 'CLUNK! It sticks to the magnet.' : 'Nothing happens: no pull at all.'], weigh: ['Its mass is ' + MET[m].mass + ' g.', '(every bar is the same size: 100 cm³)'], file: [FILEW[MET[m].lvl][0]] }[t];
        if (!s.t.includes(t)) { s.t.push(t); commit(); Book.scribble(0.2); sync(); }
      }
      const barCx = () => bar.x + BW / 2 + DX / 2;
      S.render = (dt) => {
        const m = truth(cur), s = ST[cur]; let busy = !!grab;
        // --- automatic move after a tap ---
        if (auto) {
          auto.t += dt; busy = true; const k = clamp(auto.t / auto.dur), e = k * k * (3 - 2 * k);
          if (mode === 'weigh') { bar.x = HOME[0] + (SCX - BW / 2 - DX / 2 - HOME[0]) * e; bar.y = HOME[1] + (PANY - BH - HOME[1]) * e - Math.sin(k * Math.PI) * 50; }
          else if (mode === 'file') { tool.y = tool.hy + (bar.y - 13 - tool.hy) * clamp(auto.t / 0.35); const nx = barCx() + 20 + Math.sin(Math.max(0, auto.t - 0.35) * 7) * 70; if (auto.t > 0.35) rub(Math.abs(nx - tool.x)); tool.x = auto.t > 0.35 ? nx : tool.hx + (barCx() + 20 - tool.hx) * clamp(auto.t / 0.35); }
          else { tool.x = tool.hx + (auto.tx - tool.hx) * e; tool.y = tool.hy + (auto.ty - tool.hy) * e; }
          if (mode === 'file') { if ((acc >= 620 && auto.t > 1.2) || auto.t > 5) { auto = null; goHome = true; } } else if (k >= 1) { auto = null; goHome = mode !== 'weigh'; }
        }
        // --- each tool's physics ---
        if (mode === 'look') { if (lookP < 1 && (lookP > 0 || (Math.abs(tool.x - barCx()) < BW / 2 + 30 && Math.abs(tool.y - (bar.y + 14)) < 50))) { if (lookP === 0) Book.sfx('pop', { gain: 0.3 }); lookP = Math.min(1, lookP + dt * 1.6); busy = true; if (lookP >= 1) result('look'); } }
        if (mode === 'magnet') {
          const near = Math.abs(tool.x - barCx()) < BW / 2 + 10 && bar.y + DY / 2 - (tool.y + 40) < 26;
          if (!attached && near && bar.y === HOME[1] && !bar.dropping) { if (MET[m].fe) { attached = true; Book.sfx('thud', { gain: 0.6 }); bar.ox = bar.x - tool.x; } result('magnet'); }
          if (attached) { bar.x = tool.x + bar.ox; bar.y = tool.y + 40 - DY / 2; }
          else if (bar.y < HOME[1] || bar.dropping) { bar.dropping = true; bar.vy += dt * 2600; bar.y += bar.vy * dt; bar.x += (HOME[0] - bar.x) * Math.min(1, dt * 10); busy = true; if (bar.y >= HOME[1]) { bar.y = HOME[1]; bar.x = HOME[0]; bar.vy = 0; bar.dropping = false; Book.sfx('thud', { gain: 0.4 }); } }
        }
        if (mode === 'weigh') {
          const over = Math.abs(barCx() - SCX) < 120;
          if (!grab && !auto) {
            if (over && !onPan) { onPan = true; reading = 0; Book.sfx('thud', { gain: 0.4 }); }
            const tx = onPan ? SCX - BW / 2 - DX / 2 : HOME[0], ty = onPan ? PANY - BH : HOME[1];
            if (Math.abs(bar.x - tx) + Math.abs(bar.y - ty) > 0.5) { bar.x += (tx - bar.x) * Math.min(1, dt * 14); bar.y += (ty - bar.y) * Math.min(1, dt * 14); busy = true; } else { bar.x = tx; bar.y = ty; }
          } else if (grab) { onPan = false; reading = null; }
          if (onPan && reading != null && reading < MET[m].mass) { reading = Math.min(MET[m].mass, reading + dt * MET[m].mass * 1.6 + 1); busy = true; if (reading >= MET[m].mass) { Book.sfx('tick', { gain: 0.6 }); result('weigh'); } }
        }
        if (mode !== 'weigh' && !grab && !auto && !attached && goHome) { const dx = tool.hx - tool.x, dy = tool.hy - tool.y; if (Math.abs(dx) + Math.abs(dy) > 1) { tool.x += dx * Math.min(1, dt * 9); tool.y += dy * Math.min(1, dt * 9); busy = true; } else { tool.x = tool.hx; tool.y = tool.hy; goHome = false; } }
        shake = Math.max(0, shake - dt * 5); if (shake > 0) busy = true;
        // --- draw ---
        const x = S.ctx;
        pen(x, [[20, BENCH + 1], [W - 20, BENCH + 1]], { seed: 3, w: 2.6 });
        x.save(); x.strokeStyle = rgba(B, 0.3); x.lineWidth = 1; x.beginPath(); for (let k = 30; k < W - 20; k += 14) { x.moveTo(k, BENCH + 12); x.lineTo(k + 8, BENCH + 3); } x.stroke(); x.restore();
        if (mode === 'weigh') drawScale(x, SCX, BENCH, onPan ? reading : null);
        x.save(); x.translate(bar.x, bar.y); drawBar(x, m, { look: lookP, groove: fileP, seed: 3 }); x.restore();
        if (bar.y === HOME[1] && bar.x === HOME[0]) text(x, 'Bar ' + cur, HOME[0] + 4, BENCH + 34, { size: 24 });
        if (mode === 'look') { if (lookP > 0 && lookP < 1) { x.save(); x.globalAlpha = 0.5; pen(x, geo.ellipse(tool.x, tool.y, 52 + lookP * 10, 52 + lookP * 10), { seed: 41, w: 1.4, color: RD }); x.restore(); } drawMagnifier(x, tool.x, tool.y); }
        if (mode === 'magnet') drawMagnet(x, tool.x, tool.y);
        if (mode === 'file') {
          drawFile(x, tool.x, tool.y, shake ? Math.sin(performance.now() / 18) * 2 * shake : 0);
          if (shake > 0 && MET[m].lvl > 0) { const r = H.rng(Math.floor(performance.now() / 60)); x.save(); x.fillStyle = rgba(B, 0.6); for (let i = 0; i < 5; i++) { x.beginPath(); x.arc(bar.x + 128 + r.range(-16, 16), bar.y + r.range(4, 30), r.range(0.8, 1.8), 0, 7); x.fill(); } x.restore(); }
        }
        if (msg) msg.forEach((ln, i) => text(x, ln, 30, 46 + i * 32, { font: 'hand', size: i ? 22 : 25, color: i ? B : RD }));
        else if (!s.t.includes(mode)) text(x, HOWTO[mode], 30, 46, { font: 'hand', size: 22, a: 0.75 });
        else text(x, 'Done already: have another go if you like.', 30, 46, { font: 'hand', size: 22, a: 0.6 });
        return busy;
      };
      let goHome = false;
      function rub(d) {
        const m = truth(cur); acc += d; shake = 1;
        const now = performance.now(); if (now - lastRub > 130 && d > 0.5) { lastRub = now; Book.sfx(MET[m].lvl ? 'stroke' : 'tick', MET[m].lvl ? { material: 'pen', dur: 0.12, gain: 0.6 } : { gain: 0.35 }); }
        if (fileP < 1) { fileP = Math.min(1, acc / 620); if (fileP >= 1) result('file'); } else if (acc > 620) result('file');
      }
      // ---- touch: drag the tool (or the bar when weighing); a tap does the test for you ----
      const hitTool = (p) => mode !== 'weigh' && Math.abs(p[0] - tool.x - (mode === 'file' ? 0 : 10)) < (mode === 'file' ? 150 : 72) && Math.abs(p[1] - tool.y - (mode === 'file' ? 0 : 10)) < (mode === 'file' ? 44 : 72);
      const hitBar = (p) => p[0] > bar.x - 16 && p[0] < bar.x + BW + DX + 16 && p[1] > bar.y + DY - 22 && p[1] < bar.y + BH + 22;
      const hitScale = (p) => mode === 'weigh' && Math.abs(p[0] - SCX) < 140 && p[1] > PANY - 20 && p[1] < BENCH + 10;
      const hit = (p) => hitTool(p) || hitBar(p) || hitScale(p);
      S.c.addEventListener('touchstart', (e) => { if (hit(S.pos(e.changedTouches[0]))) e.preventDefault(); }, { passive: false });
      S.c.addEventListener('pointerdown', (e) => {
        const p = S.pos(e); if (grab || !hit(p)) return;
        const what = mode === 'weigh' ? (hitBar(p) ? 'bar' : 'tap') : hitTool(p) ? 'tool' : 'tap';
        const o = what === 'bar' ? bar : tool;
        grab = { id: e.pointerId, what, dx: o.x - p[0], dy: o.y - p[1], sx: p[0], sy: p[1], moved: false, lx: p[0] };
        if (what !== 'tap') { auto = null; goHome = false; }
        try { S.c.setPointerCapture(e.pointerId); } catch (er) {} S.go();
      });
      S.c.addEventListener('pointermove', (e) => {
        if (!grab || e.pointerId !== grab.id) return; const p = S.pos(e);
        if (Math.hypot(p[0] - grab.sx, p[1] - grab.sy) > 9) grab.moved = true;
        if (!grab.moved || grab.what === 'tap') return;
        if (grab.what === 'bar') { bar.x = clamp(p[0] + grab.dx, 10, W - BW - DX - 8); bar.y = clamp(p[1] + grab.dy, 60, BENCH - BH); }
        else {
          let nx = clamp(p[0] + grab.dx, 50, W - 50), ny = clamp(p[1] + grab.dy, 44, BENCH - 20);
          if (mode === 'magnet' && !attached) ny = Math.min(ny, Math.abs(nx - barCx()) < BW / 2 + 60 ? bar.y + DY / 2 - 40 - 2 : BENCH - 44);
          if (mode === 'magnet' && attached) ny = Math.min(ny, HOME[1] - 40 + DY / 2);
          if (mode === 'file') { const over = Math.abs(nx - 20 - barCx()) < BW / 2 + 96; ny = Math.min(ny, over ? bar.y - 13 : BENCH - 14); if (over && ny > bar.y - 40) { ny = bar.y - 13; rub(Math.abs(p[0] - grab.lx)); } }
          tool.x = nx; tool.y = ny;
        }
        grab.lx = p[0]; S.go();
      });
      ['pointerup', 'pointercancel'].forEach((ev) => S.c.addEventListener(ev, (e) => {
        if (!grab || e.pointerId !== grab.id) return; const g = grab; grab = null;
        if (!g.moved && ev === 'pointerup') { // a tap: do it automatically
          if (mode === 'weigh') { if (!onPan) { auto = { t: 0, dur: 0.7 }; bar.x = HOME[0]; bar.y = HOME[1]; } }
          else if (mode === 'file') { acc = fileP >= 1 ? 0 : acc; auto = { t: 0, dur: 9 }; tool.x = tool.hx; tool.y = tool.hy; }
          else if (attached) { attached = false; bar.dropping = true; bar.vy = 0; goHome = true; }
          else { auto = { t: 0, dur: 0.6, tx: barCx(), ty: mode === 'magnet' ? bar.y - 70 : bar.y + 14 }; }
          Book.sfx('tick', { gain: 0.4 });
        } else if (g.what === 'tool') { if (attached) { attached = false; bar.dropping = true; bar.vy = 0; } goHome = true; }
        S.go();
      }));

      // ---- naming ----
      function guess(m) {
        const s = ST[cur], tr = truth(cur);
        if (solved(cur) || s.g.includes(m)) return;
        if (!s.t.length) { fb.className = 'fb on bad'; fb.innerHTML = 'Test the bar first! Pick a tool and try it out on the bench.'; Book.sfx('error', { gain: 0.3 }); return; }
        s.g.push(m); commit();
        if (m === tr) Book.sfx('success', { gain: 0.4 }); else Book.sfx('error', { gain: 0.35 });
        sync();
        if (allDone()) { const sh = notes; requestAnimationFrame(() => Ink.frame(sh)); }
      }
      function paintThumb(L) {
        const c = barEls[L].querySelector('canvas'), x = c.getContext('2d'), s = ST[L];
        x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, 192, 64); x.lineCap = 'round'; x.lineJoin = 'round';
        x.setTransform(0.62, 0, 0, 0.62, 9, 20); drawBar(x, truth(L), { look: s.t.includes('look') ? 1 : 0, groove: s.t.includes('file') ? 1 : 0, seed: 3 });
      }
      function sync() {
        const s = ST[cur], tr = truth(cur), ok = solved(cur);
        BARS.forEach(([L]) => {
          const b = barEls[L], nm = b.querySelector('.nm'); b.classList.toggle('on', L === cur); b.classList.toggle('miss', solved(L) && !firstOk(L));
          nm.textContent = solved(L) ? MET[truth(L)].name : ''; paintThumb(L);
        });
        TESTS.forEach((t) => { toolEls[t].classList.toggle('on', t === mode); toolEls[t].innerHTML = TNAME[t] + (s.t.includes(t) ? '<span class="tk">✓</span>' : ''); });
        log.innerHTML = s.t.length ? TESTS.filter((t) => s.t.includes(t)).map((t) => `<span class="p07-chip">${logLine(tr, t)}</span>`).join('') : '<span class="none">Your test results for this bar will be written here.</span>';
        ask.textContent = ok ? `Bar ${cur} is ${MET[tr].name.toLowerCase()}.` : `What is bar ${cur} made of?`;
        NAMES.forEach((m) => { const b = nameEls[m]; b.classList.toggle('right', ok && m === tr); b.classList.toggle('wrong', s.g.includes(m) && m !== tr); b.disabled = ok || s.g.includes(m); });
        if (ok) {
          const why = { zn: 'Bluish-grey and no pull from the magnet.', hcs: 'Ferrous (the magnet picked it up) and so hard that the file skidded: lots of carbon.', cu: 'That reddish-brown colour gives it away, and it was the heaviest bar.', al: 'Silvery, no pull from the magnet, and far lighter than every other bar.', ci: 'Ferrous, hard, and that rough grainy skin comes from being cast in a mould.', sn: 'Bright silvery, no pull from the magnet, and the softest bar of all.', brass: 'Golden yellow, with no pull from the magnet.', lcs: 'Ferrous (the magnet picked it up), but the file could still cut it: not much carbon.' }[tr];
          fb.className = 'fb on good'; fb.innerHTML = (firstOk(cur) ? '✓ First time! ' : '✓ Got there. ') + why + (allDone() ? '' : ' Pick another bar.');
        } else if (s.g.length) {
          const g = s.g[s.g.length - 1]; fb.className = 'fb on bad'; fb.innerHTML = `✗ Not ${MET[g].name.toLowerCase()}. ` + hintFor(tr, g, s.t);
        } else { fb.className = 'fb'; fb.innerHTML = ''; }
        const nDone = BARS.filter(([L]) => solved(L)).length, nFirst = BARS.filter(([L]) => firstOk(L)).length;
        score.textContent = `Named ${nDone} of 8 · right first time: ${nFirst}`;
        if (allDone()) { notes.style.display = ''; score.textContent = `All 8 named! Right first time: ${nFirst} out of 8.`; }
        S.go();
      }
      reset(); sync();
      if (allDone()) requestAnimationFrame(() => Ink.frame(notes));

      // ---------------- stock forms ----------------
      ui.el('h2', '', 'Stock forms');
      ui.p('Metals are bought in standard shapes and sizes called <span class="key">stock forms</span>. Standard sizes keep the cost down. Each drawing shows a short length with the cut end facing you.');
      const mt = ui.match({
        id: 'p07.stock', label: 'Match 6 drawn cross-sections to stock form names',
        q: 'Tap a drawing, then tap the name of that stock form.',
        pairs: STOCK.map(([k, name]) => ['drawing of ' + name.toLowerCase(), name]),
      });
      mt.classList.add('p07-stock');
      const cards = [...mt.querySelectorAll('.pairs .card')].filter((c) => !c._def);
      cards.forEach((c, i) => { c.innerHTML = ''; c.setAttribute('aria-label', 'drawing ' + (i + 1)); c.appendChild(stockCanvas(STOCK[i][2])); });
    },
  });
})();
