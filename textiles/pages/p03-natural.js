// Page 3 — Natural fibres. Explore four pen-drawn sources (burst a cotton boll, pull flax, shear a sheep, unwind a
// cocoon), then run four tests on four swatches (warmth, water drop, scrunch, shine): predict → test → conclude.
// The notes only appear after the tests, and blur again for the plant/animal sort and the uses match.
(function () {
  'use strict';
  const B = Ink.BLUE, RD = Ink.RED, GR = Ink.GREEN, rgba = Ink.rgba, geo = Ink.geo;
  const PAPER = '#fbfaf5';
  const HANDF = (s) => `400 ${s}px "Gloria Hallelujah", "Comic Sans MS", cursive`;
  const LABF = (s) => `600 ${s}px Fredoka, "Arial Rounded MT Bold", system-ui, sans-serif`;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const close = (P) => P.concat([P[0]]);

  function text(x, s, px, py, o = {}) {
    x.save(); x.font = (o.font === 'hand' ? HANDF : LABF)(o.size || 22);
    x.fillStyle = rgba(o.color || B, o.a ?? 0.92); x.textAlign = o.align || 'left'; x.textBaseline = 'alphabetic';
    x.translate(px, py); if (o.rot) x.rotate(o.rot); x.fillText(s, 0, 0); x.restore();
  }
  function pen(x, pts, o = {}) {
    const P = o.wob === false ? pts : geo.wob(geo.seg(pts, 3), o.seed ?? 11, o.amp ?? 0.6);
    x.save(); x.strokeStyle = rgba(o.color || B, o.a ?? 0.8); x.lineWidth = o.w ?? 1.4; x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath();
    P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.stroke(); x.restore();
  }
  const dot = (x, px, py, r, a = 0.9, c = B) => { x.fillStyle = rgba(c, a); x.beginPath(); x.arc(px, py, r, 0, 7); x.fill(); };
  function paper(x, P) { x.save(); x.globalCompositeOperation = 'source-over'; x.fillStyle = PAPER; x.beginPath(); P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.closePath(); x.fill(); x.restore(); }
  // a fluffy cloud outline: bumps round an ellipse
  function fluff(cx, cy, rx, ry, n, br, seed = 1) {
    const r = H.rng(seed), out = [];
    for (let i = 0; i < n; i++) { const a = (i / n) * 6.283, bx = cx + Math.cos(a) * rx, by = cy + Math.sin(a) * ry, q = br * r.range(0.85, 1.15); for (let j = 0; j <= 7; j++) { const b = a - 1.45 + (j / 7) * 2.9; out.push([bx + Math.cos(b) * q, by + Math.sin(b) * q]); } }
    return out;
  }

  function Stage(parent, W, Hh, touch) {
    const c = document.createElement('canvas'); parent.appendChild(c);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = Math.round(W * dpr); c.height = Math.round(Hh * dpr);
    Object.assign(c.style, { width: '100%', height: 'auto', aspectRatio: W + ' / ' + Hh, display: 'block', touchAction: touch || 'manipulation', userSelect: 'none', webkitUserSelect: 'none', webkitTouchCallout: 'none', cursor: 'pointer' });
    const ctx = c.getContext('2d');
    const S = { c, ctx, W, H: Hh, dpr, render: () => false };
    S.pos = (e) => { const r = c.getBoundingClientRect(); return [((e.clientX - r.left) * W) / r.width, ((e.clientY - r.top) * Hh) / r.height]; };
    S.layer = (w, h, paint) => { const L = document.createElement('canvas'); L.width = Math.ceil(w * dpr); L.height = Math.ceil(h * dpr); const x = L.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.lineCap = 'round'; x.lineJoin = 'round'; paint(x); L.w = w; L.h = h; return L; };
    S.blit = (L, px, py, s = 1) => ctx.drawImage(L, px, py, L.w * s, L.h * s);
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

  const FIB = ['cotton', 'linen', 'wool', 'silk'];

  // ------------------------------------------------------------------ the four sources, drawn at progress p (0..1)
  const SRC = [
    { name: 'COTTON', from: 'seed pod (boll)', hint: 'tap it open' },
    { name: 'LINEN', from: 'flax plant stem', hint: 'drag to pull' },
    { name: 'WOOL', from: 'sheep’s fleece', hint: 'rub to shear' },
    { name: 'SILK', from: 'silkworm cocoon', hint: 'drag to unwind' },
  ];
  function drawSource(x, i, cx, p) {
    const G = 236; // ground line
    if (i === 0) { // cotton plant: a boll on a stem that bursts open into fluff
      pen(x, geo.curve([cx - 6, G], [cx - 10, 200], [cx + 4, 180], [cx, 150], 12), { w: 2.6, seed: 3 });
      [[-1, 206], [1, 188]].forEach(([m, y]) => { const L = [[cx - 4 * m, y], [cx + m * 30, y - 16], [cx + m * 46, y - 4], [cx + m * 26, y + 6], [cx - 4 * m, y]]; pen(x, L, { w: 1.8, seed: 5 + m }); });
      const open = clamp(p * 1.2);
      for (let k = 0; k < 4; k++) { // the pod splits into four pointed pieces that fold back
        const a = -Math.PI / 2 + (k - 1.5) * (0.28 + open * 0.62), len = 46 - open * 8, bx = cx + Math.cos(a) * 6, by = 150 + Math.sin(a) * 6, tx = cx + Math.cos(a) * len, ty = 150 + Math.sin(a) * len * (1 - open * 0.25) + open * 22;
        const nx = -Math.sin(a) * 9, ny = Math.cos(a) * 9, L = [[bx, by], [(bx + tx) / 2 + nx, (by + ty) / 2 + ny], [tx, ty], [(bx + tx) / 2 - nx, (by + ty) / 2 - ny], [bx, by]];
        if (open < 0.15) paper(x, L); Ink.hatchFill(x, L, 1, B, 1.3); pen(x, L, { w: 2, seed: 20 + k, a: 0.9 });
      }
      if (open > 0.1) { const r = 14 + open * 30, F = fluff(cx, 118 - open * 8, r, r * 0.8, 9, 9 + open * 7, 4); paper(x, F); pen(x, close(F), { w: 2.2, seed: 9, a: 0.9, wob: false }); for (let k = 0; k < 6; k++) { const a = k * 1.1, d = r * 0.5; pen(x, geo.ellipse(cx + Math.cos(a) * d, 118 - open * 8 + Math.sin(a) * d * 0.7, 7, 5, a, a + 2.6), { w: 1.1, wob: false, a: 0.5 }); } }
    } else if (i === 1) { // flax: tall thin stems pulled out of the ground, then long fibres stripped from the stems
      const up = clamp(p / 0.45), strip = clamp((p - 0.45) / 0.55);
      for (let k = 0; k < 5; k++) {
        const bx = cx + 6 + k * 15 + strip * 14, top = 44 + (k % 2) * 12 - up * 26, bot = G - up * 26, lean = (k - 2) * 3;
        pen(x, [[bx, bot], [bx + lean, top]], { w: 2.2, seed: 30 + k, a: 0.9 });
        for (let j = 0; j < 4; j++) { const y = bot - 40 - j * 34, m = j % 2 ? 1 : -1, xx = bx + lean * ((bot - y) / (bot - top)); pen(x, [[xx, y], [xx + m * 12, y - 10]], { w: 1.4, wob: false }); }
        Ink.stroke(x, geo.ellipse(bx + lean, top - 5, 5, 5), { w: 1.4, seed: 40 + k, retrace: false });
        if (up > 0.2) [-1, 0, 1].forEach((m) => pen(x, [[bx, bot], [bx + m * 5, bot + 12 * up]], { w: 1.2, wob: false, a: 0.8 })); // roots
      }
      if (strip > 0.02) for (let k = 0; k < 9; k++) { const fx = cx - 78 + k * 7, pts = []; for (let u = 0; u <= 170 * strip; u += 8) pts.push([fx + 4 * Math.sin(u / 26 + k), G - 14 - u]); if (pts.length > 1) pen(x, pts, { w: 1.3, wob: false, a: 0.85 }); }
    } else if (i === 2) { // a sheep: rub the fleece off, it piles up beside her
      const bx = cx + 14, by = 150;
      [[-30, 0], [-14, 0], [16, 0], [32, 0]].forEach(([dx], k) => pen(x, [[bx + dx, by + 30], [bx + dx - 2, G]], { w: 2.6, seed: 50 + k }));
      const body = geo.ellipse(bx, by, 50 - p * 8, 34 - p * 6); paper(x, body); Ink.stroke(x, body, { w: p > 0.95 ? 2.4 : 1.4, seed: 55, retrace: false });
      const n = 12, F = fluff(bx, by, 52, 36, n, 13, 6), per = F.length / n;
      for (let k = 0; k < n; k++) { if ((k + 0.5) / n <= p) continue; const seg = F.slice(k * per, (k + 1) * per); paper(x, seg); pen(x, seg, { w: 2.2, wob: false, a: 0.9 }); }
      if (p < 0.95) for (let k = 0; k < 7; k++) { if (k / 7 < p) continue; const a = k * 0.9; pen(x, geo.ellipse(bx + Math.cos(a) * 24, by + Math.sin(a) * 14, 8, 6, a, a + 2.6), { w: 1.1, wob: false, a: 0.5 }); }
      const hd = geo.ellipse(bx - 58, by - 22, 17, 13); paper(x, hd); Ink.hatchFill(x, hd, 1, B, 1.3); Ink.stroke(x, hd, { w: 2.2, seed: 57 });
      pen(x, [[bx - 50, by - 34], [bx - 40, by - 42]], { w: 2.2 }); dot(x, bx - 63, by - 25, 2.2, 1, [251, 250, 245]);
      if (p > 0.08) { const r = 8 + p * 22, P2 = fluff(cx - 62, G - r * 0.6, r, r * 0.6, 8, 5 + p * 6, 8); paper(x, P2); pen(x, close(P2), { w: 2, wob: false, a: 0.9 }); }
    } else { // a cocoon: the single thread winds off onto a reel
      const r = 1 - p * 0.35, co = geo.ellipse(cx - 34, 178, 40 * r, 26 * r); Ink.hatchShadow(x, co, 1, 5, 5); paper(x, co); Ink.stroke(x, co, { w: 2.4, seed: 60 });
      for (let k = 0; k < Math.round(8 - p * 5); k++) { const u = (-30 + k * 9) * r; pen(x, geo.curve([cx - 34 + u, 178 - 22 * r], [cx - 24 + u, 172], [cx - 44 + u, 186], [cx - 30 + u, 178 + 22 * r], 8), { w: 1.1, wob: false, a: 0.55 }); }
      const rx = cx + 44, ry = 84; // the reel
      pen(x, [[rx, ry], [rx, G]], { w: 2.6, seed: 62 }); pen(x, [[rx - 22, G], [rx + 22, G]], { w: 2.6, seed: 63 });
      const reel = geo.rect(rx - 24, ry - 30, 48, 60, 6); paper(x, reel); Ink.stroke(x, reel, { w: 2.2, seed: 64 });
      for (let k = 0; k < Math.round(p * 12); k++) pen(x, [[rx - 22, ry - 25 + k * 4.4], [rx + 22, ry - 22 + k * 4.4]], { w: 1.3, wob: false, a: 0.85 });
      if (p > 0.02) pen(x, geo.curve([cx - 20, 160], [cx, 120], [cx + 6, 110], [rx - 24, ry + 6], 12), { w: 1.4, a: 0.9, seed: 66 });
    }
    pen(x, [[cx - 92, G], [cx + 92, G]], { w: 1.6, seed: 70 + i, a: 0.7 });
  }

  // ------------------------------------------------------------------ swatches and the four tests
  function drawSwatch(x, i, s = 110) {
    const R = [[3, 3], [s - 3, 3], [s - 3, s - 3], [3, s - 3]]; paper(x, R);
    const r = H.rng(40 + i);
    if (i === 0) { for (let u = 12; u < s - 4; u += 9) { pen(x, [[u, 5], [u, s - 5]], { w: 1, a: 0.4, seed: u }); pen(x, [[5, u], [s - 5, u]], { w: 1, a: 0.4, seed: u + 2 }); } }
    if (i === 1) { for (let u = 13; u < s - 4; u += 13) { pen(x, [[u, 5], [u, s - 5]], { w: 1.5, a: 0.55, seed: u, amp: 1.2 }); pen(x, [[5, u], [s - 5, u]], { w: 1.5, a: 0.55, seed: u + 2, amp: 1.2 }); } for (let k = 0; k < 6; k++) { const a = r.range(12, s - 30), b = r.range(12, s - 12); pen(x, [[a, b], [a + 14, b]], { w: 3, a: 0.5, wob: false }); } }
    if (i === 2) { Ink.hatchFill(x, R, 1, B, 0.7); for (let k = 0; k < 22; k++) { const a = r.range(14, s - 14), b = r.range(14, s - 14), q = r.range(0, 6); pen(x, geo.ellipse(a, b, 8, 6, q, q + 2.8), { w: 1.2, wob: false, a: 0.6 }); } }
    if (i === 3) { [22, 52, 84].forEach((u, k) => pen(x, geo.curve([u, 6], [u + 12, 36], [u - 10, 70], [u + 6, s - 6], 12), { w: 1, a: 0.35, seed: k })); }
    Ink.stroke(x, close(R), { w: 2.4, seed: 21 + i });
  }

  const TESTS = [
    { id: 'p03.warm', label: 'Warmth test: predicted, tested 4 swatches, concluded which is warmest and why', title: 'Test 1: keeping warm',
      intro: 'A warm hand is tucked under each swatch, next to a thermometer. The higher the red line, the more heat the swatch keeps in.',
      predQ: 'which swatch will keep the hand <b>warmest</b>?', preds: FIB, predOk: 'wool',
      words: ['cool', 'coolest', 'warmest', 'quite warm'], lev: [0.42, 0.3, 0.92, 0.62],
      concQ: 'Which swatch kept the most heat in, and <b>why</b>?',
      conc: [
        { t: 'Wool: its fibres trap air, which is a good insulator', ok: true },
        { t: 'Cotton: its fibres trap air, which is a good insulator', mis: 'cotton-wool', why: 'Check the thermometers again: cotton stayed cool. That is why it is comfortable in warm weather.' },
        { t: 'Wool: it soaks up the most water from the skin', mis: 'property-word', why: 'Right swatch, wrong reason. Soaking up water is not what keeps heat in: think about what the fluffy fibres hold between them.' },
        { t: 'Silk: its fibres are the smoothest and the shiniest', mis: 'natural-mixup', why: 'Silk was quite warm, but not the warmest, and being smooth is not what keeps heat in. Look at the tallest red line.' },
      ], done: 'Wool is <b>warm</b> because its fibres trap air: a good insulator. Cotton and linen feel <b>cool</b>.' },
    { id: 'p03.absorb', label: 'Water-drop test: predicted, tested 4 swatches, concluded with the right property word', title: 'Test 2: a drop of water',
      intro: 'A pipette lets one drop of water fall on each swatch. Watch what happens to the drop.',
      predQ: 'which swatches will <b>soak up</b> the water drop?', preds: ['Only the cotton', 'Cotton and linen', 'Wool and silk', 'All four of them'], predOk: 'All four of them',
      words: ['soaks in at once', 'soaks in fast', 'soaks in slowly', 'soaks in'],
      concQ: 'All four soaked up the water. Which <b>property word</b> describes a fabric that soaks up water (or sweat)?',
      conc: [
        { t: 'absorbent', ok: true },
        { t: 'breathable', mis: 'property-word', why: 'Breathable means air and moisture vapour can pass through the fabric. Soaking up liquid water has a different name.' },
        { t: 'insulating', mis: 'property-word', why: 'Insulating means keeping heat in (like the wool in test 1). Soaking up water has a different name.' },
        { t: 'resilient', mis: 'property-word', why: 'Resilient means springing back into shape. Soaking up water has a different name.' },
      ], done: 'All four natural fibres are <b>absorbent</b>. Cotton is the one used for towels.' },
    { id: 'p03.crease', label: 'Scrunch test: predicted, tested 4 swatches, concluded which springs back and why', title: 'Test 3: scrunch and let go',
      intro: 'Each swatch gets scrunched up tight in a fist, then let go.',
      predQ: 'which swatch will come out the <b>most creased</b>?', preds: FIB, predOk: 'linen',
      words: ['creased', 'badly creased', 'springs back', 'a few soft folds'], n: [6, 11, 0, 2],
      concQ: 'One swatch came out smooth. Which one, and <b>why</b>?',
      conc: [
        { t: 'Wool: its fibres are elastic, so creases drop out', ok: true },
        { t: 'Linen: its fibres are stiff, so creases drop out', mis: 'natural-mixup', why: 'Look again: linen came out the most creased of all. Stiff fibres stay bent. Which swatch had no creases?' },
        { t: 'Cotton: its fibres are soft, so creases drop out', mis: 'cotton-wool', why: 'Cotton came out creased: it creases easily. Which swatch sprang back with no creases at all?' },
        { t: 'Wool: its fibres are crisp, so creases stay put', mis: 'property-word', why: 'Right swatch, but the creases did not stay: they dropped out. Crisp describes linen. What word means springy?' },
      ], done: 'Wool is <b>elastic</b> (resilient): creases drop out. Linen <b>creases very easily</b>, and cotton creases easily too.' },
    { id: 'p03.shine', label: 'Shine test: predicted, tested 4 swatches, concluded which is lustrous', title: 'Test 4: catch the light',
      intro: 'A torch shines across each swatch. Does the surface bounce the light back?',
      predQ: 'which swatch will <b>reflect the most light</b>?', preds: FIB, predOk: 'silk',
      words: ['dull', 'dull', 'dull', 'shines!'],
      concQ: 'Which swatch shone, and what is the proper <b>word</b> for it?',
      conc: [
        { t: 'Silk: it is lustrous', ok: true },
        { t: 'Silk: it is resilient', mis: 'property-word', why: 'Right swatch, wrong word. Resilient means it springs back into shape. Which word means shiny?' },
        { t: 'Linen: it is lustrous', mis: 'natural-mixup', why: 'Lustrous is the right word for shiny, but linen stayed dull. Which swatch bounced the light back?' },
        { t: 'Wool: it is lustrous', mis: 'natural-mixup', why: 'Lustrous is the right word for shiny, but fluffy wool stayed dull. Which swatch bounced the light back?' },
      ], done: 'Silk is very smooth, so it is <b>lustrous</b> (shiny). That is why it is used for luxury clothes.' },
  ];

  Book.page({
    id: 'p03',
    title: 'Natural fibres',
    build(ui, root) {
      ui.h('Natural fibres');
      ui.p('Four fibres come straight from <b>nature</b>. Find out where each one comes from: <b>tap, drag or rub</b> each drawing until its name appears.');
      const got = (id) => Book.state.items[id];

      // ================================================================== where does it come from?
      const srcWrap = ui.el('div', ''); srcWrap.style.cssText = 'position:relative;margin:0 0 var(--R)';
      const W = 860, HH = 318, PWID = 213, scx = (i) => 110 + i * PWID;
      const S = Stage(srcWrap, W, HH, 'none');
      const sr = ui.record('p03.sources', { label: 'Sources: explored where cotton, linen, wool and silk come from', type: 'experiment', max: 0 });
      const prog = ((sr.get() || {}).done || []).reduce((a, i) => { a[i] = 1; return a; }, [0, 0, 0, 0]);
      const shown = prog.slice(); let act = -1, lastPt = null;
      const nDone = () => prog.filter((p) => p >= 1).length;
      S.render = (dt) => {
        const x = S.ctx; let busy = act >= 0;
        for (let i = 0; i < 4; i++) {
          if (Math.abs(prog[i] - shown[i]) > 0.004) { shown[i] += (prog[i] - shown[i]) * Math.min(1, dt * 10); busy = true; } else shown[i] = prog[i];
          if (i) pen(x, [[i * PWID + 3, 14], [i * PWID + 3, HH - 14]], { w: 1.3, a: 0.35, seed: i });
          drawSource(x, i, scx(i), shown[i]);
          if (prog[i] >= 1) { Ink.drawBubble(x, SRC[i].name, scx(i), HH - 40, 30, RD, 1, -0.02, 'center'); text(x, SRC[i].from, scx(i), HH - 10, { font: 'hand', size: 22, align: 'center' }); }
          else text(x, SRC[i].hint, scx(i), HH - 24, { font: 'hand', size: 24, align: 'center', color: RD });
        }
        return busy;
      };
      const bump = (i, d) => {
        if (i < 0 || prog[i] >= 1) return; const before = prog[i]; prog[i] = Math.min(1, prog[i] + d);
        if (((prog[i] * 5) | 0) !== ((before * 5) | 0)) Book.sfx(prog[i] >= 1 ? 'success' : 'tick', { gain: 0.3 });
        if (prog[i] >= 1) { const d2 = [0, 1, 2, 3].filter((k) => prog[k] >= 1); sr.set({ answer: `explored ${d2.length}/4: ` + d2.map((k) => SRC[k].name.toLowerCase()).join(', '), correct: d2.length === 4 ? true : null, done: d2 }); }
        S.go();
      };
      S.c.addEventListener('pointerdown', (e) => { const [px, py] = S.pos(e); act = clamp(Math.floor(px / PWID), 0, 3); lastPt = [px, py]; try { S.c.setPointerCapture(e.pointerId); } catch (er) {} bump(act, act === 0 ? 0.34 : 0.12); });
      S.c.addEventListener('pointermove', (e) => { if (act < 0) return; const [px, py] = S.pos(e), d = Math.hypot(px - lastPt[0], py - lastPt[1]); if (d > 4) { lastPt = [px, py]; bump(act, d / (act === 0 ? 300 : 520)); } });
      ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((ev) => S.c.addEventListener(ev, () => { act = -1; }));

      // ================================================================== the test bench
      ui.el('h2', '', 'The fibre test bench');
      ui.p('Here is a swatch of each fibre. Run four tests. Each time: <b>predict</b>, then <b>tap each swatch</b> to test it, then say what you found.');
      const BW = 860, BH = 258, SW = 110, SY = 66, bcx = (i) => 108 + i * 214;
      const state = TESTS.map((T) => { const p = (got(T.id) || {}); return { pred: p.pred || '', tested: (p.tested || [false, false, false, false]).slice(), conc: p.conc || '', ok: !!p.ok, tries: p.tries || 0 }; });
      const rr = H.rng(91), CREASE = FIB.map(() => Array.from({ length: 12 }, () => [rr.range(14, 76), rr.range(16, 94), rr.range(-0.8, 0.8)]));
      const allTested = (st) => st.tested.every(Boolean);

      TESTS.forEach((T, ti) => {
        const st = state[ti];
        const rec = ui.record(T.id, { label: T.label, type: 'experiment', max: 1 });
        const d = ui.el('div', 'act'); d.dataset.id = T.id; requestAnimationFrame(() => Ink.frame(d, { shadow: false, w: 2.2 }));
        ui.el('div', 'q', `<b>${T.title}.</b> ${T.intro}<br><b>Predict:</b> ${T.predQ}`, d);
        const pbox = ui.el('div', 'opts', '', d); pbox.style.gridTemplateColumns = 'repeat(auto-fit, minmax(150px, 1fr))';
        const pb = T.preds.map((t) => { const b = ui.el('button', 'opt', t, pbox); b.type = 'button'; if (st.pred === t) b.classList.add('sel');
          b.onclick = () => { if (st.tested.some(Boolean)) return; pb.forEach((q) => q.classList.remove('sel')); b.classList.add('sel'); st.pred = t; Book.scribble(0.12); commit(); gate(); }; return b; });
        const lab = ui.el('div', '', '', d); lab.style.cssText = 'position:relative;margin:10px 0 0;transition:opacity .3s';
        const C = Stage(lab, BW, BH, 'manipulation');
        const an = st.tested.map((v) => (v ? 1 : 0)), run = [false, false, false, false];
        const stat = ui.el('div', 'small', '', d); stat.style.margin = '4px 0 0';
        const cwrap = ui.el('div', '', '', d); cwrap.style.marginTop = '10px';
        ui.el('div', 'q', `<b>Conclude:</b> ${T.concQ}`, cwrap);
        const cbox = ui.el('div', 'opts', '', cwrap), fb = ui.el('div', 'fb', '', cwrap);
        const copts = Book.shuffle(T.conc, 11 + ti * 7);
        const showFb = (ok, html) => { fb.className = 'fb on ' + (ok ? 'good' : 'bad'); fb.innerHTML = html; };
        const cb = copts.map((op) => { const b = ui.el('button', 'opt', op.t, cbox); b.type = 'button';
          b.onclick = () => { const ok = !!op.ok; st.conc = op.t; st.tries++; if (ok) st.ok = true; Book.sfx(ok ? 'success' : 'error', { gain: 0.35 }); b.classList.add(ok ? 'right' : 'wrong');
            commit(op); showFb(ok, ok ? '✓ ' + T.done : '✗ ' + op.why); if (ok) { cb.forEach((q) => (q.disabled = true)); gateNotes(); } };
          if (st.ok && op.ok) { b.classList.add('right'); } return b; });
        if (st.ok) { cb.forEach((q) => (q.disabled = true)); showFb(true, '✓ ' + T.done); }
        function commit(op) {
          const n = st.tested.filter(Boolean).length, pOk = st.pred === T.predOk;
          rec.set({ answer: `predicted "${st.pred}"${n === 4 ? (pOk ? ' ✓' : ' ✗') : ''}; tested ${n}/4` + (st.conc ? `; concluded "${st.conc}" ${op ? (op.ok ? '✓' : '✗') : st.ok ? '✓' : '✗'}` : ''),
            correct: op ? !!op.ok : st.ok ? true : null, score: (op ? op.ok : st.ok) ? 1 : 0, max: 1, mis: op && !op.ok ? op.mis || '' : '', pred: st.pred, tested: st.tested.slice(), conc: st.conc, ok: st.ok, tries: st.tries });
        }
        function gate() {
          const on = !!st.pred, n = st.tested.filter(Boolean).length;
          lab.style.opacity = on ? 1 : 0.35; lab.style.pointerEvents = on ? '' : 'none';
          if (n) pb.forEach((b) => (b.disabled = true));
          cwrap.style.display = n === 4 ? '' : 'none';
          stat.innerHTML = !on ? '<span class="red">Make your prediction first: then the test unlocks.</span>' : n < 4 ? `Tap each swatch to test it. (${n}/4 tested)` : `You predicted “${Book.esc(st.pred.toLowerCase())}”: <b class="${st.pred === T.predOk ? 'green' : 'red'}">${st.pred === T.predOk ? '✓ good prediction' : '✗ not this time'}</b>.`;
        }
        let spr;
        const build = () => { spr = FIB.map((_, i) => C.layer(SW, SW, (x) => drawSwatch(x, i, SW))); };
        build(); C.onFonts = build;
        C.render = (dt, t) => {
          const x = C.ctx; let busy = false;
          for (let i = 0; i < 4; i++) {
            if (run[i]) { an[i] = Math.min(1, an[i] + dt / 1.7); busy = true; if (an[i] >= 1) { run[i] = false; st.tested[i] = true; Book.sfx('pop', { gain: 0.3 }); commit(); gate(); } }
            const cx = bcx(i), p = an[i], x0 = cx - SW / 2;
            const sw = (s = 1) => { x.globalCompositeOperation = 'source-over'; C.blit(spr[i], cx - (SW * s) / 2, SY + SW / 2 - (SW * s) / 2, s); x.globalCompositeOperation = 'multiply'; };
            if (ti === 0) { // a hand under the swatch and a thermometer beside it
              [0, 1, 2, 3].forEach((k) => Ink.stroke(x, geo.ellipse(x0 + 20 + k * 23, SY + SW + 2, 9, 15, 0, Math.PI), { w: 1.8, seed: 5 + k, retrace: false }));
              sw();
              const tx = cx + 76, ty0 = SY - 6, ty1 = SY + SW - 6;
              Ink.stroke(x, [[tx - 6, ty1], [tx - 6, ty0], [tx + 6, ty0], [tx + 6, ty1]], { w: 1.8, seed: 9, retrace: false }); Ink.stroke(x, geo.ellipse(tx, ty1 + 9, 11, 11), { w: 1.8, seed: 10, retrace: false });
              dot(x, tx, ty1 + 9, 7.5, 0.85, RD);
              const lv = 0.12 + (T.lev[i] - 0.12) * (1 - Math.pow(1 - p, 2)); x.fillStyle = rgba(RD, 0.85); x.fillRect(tx - 3, ty1 - (ty1 - ty0 - 6) * lv, 6, (ty1 - ty0 - 6) * lv + 4);
            } else if (ti === 1) { // pipette, falling drop, then the water soaks in (wool: sits as a bead first)
              sw();
              pen(x, [[cx - 5, 6], [cx - 5, 30], [cx, 40], [cx + 5, 30], [cx + 5, 6]], { w: 1.8, seed: 3 }); Ink.stroke(x, geo.ellipse(cx, 2, 8, 6), { w: 1.6, seed: 4, retrace: false });
              const drop = (yy, q = 1) => { const D = [[cx, yy - 9 * q], [cx + 6 * q, yy], [cx, yy + 6 * q], [cx - 6 * q, yy], [cx, yy - 9 * q]]; pen(x, D, { w: 2, wob: false, a: 0.9 }); };
              const cy = SY + SW / 2, fall = clamp(p / 0.22);
              if (p > 0 && fall < 1) drop(46 + (cy - 52) * fall * fall);
              const sp = [[0.22, 0.42, 46], [0.22, 0.52, 40], [0.62, 1, 27], [0.22, 0.75, 32]][i], q = clamp((p - sp[0]) / (sp[1] - sp[0]));
              if (i === 2 && p >= 0.22 && p < 0.62) { Ink.stroke(x, geo.ellipse(cx, cy, 12, 9), { w: 2, seed: 6, retrace: false }); pen(x, geo.ellipse(cx - 3, cy - 2, 5, 3, 3.4, 5), { w: 1.3, wob: false }); }
              if (q > 0.02) { const E = geo.ellipse(cx, cy, sp[2] * q, sp[2] * 0.8 * q); Ink.hatchFill(x, E, 1, B, 2.6); pen(x, E, { w: 1.3, a: 0.6, seed: 8 }); }
            } else if (ti === 2) { // scrunch into a ball, then let go
              const sq = p <= 0 ? 0 : p < 0.45 ? p / 0.45 : 1 - clamp((p - 0.45) / 0.3), s = 1 - 0.52 * sq;
              sw(s);
              if (sq > 0.05) for (let k = 0; k < 8; k++) { const a = (k / 8) * 6.283 + 0.3, r0 = SW * s * 0.12, r1 = SW * s * 0.46, cy = SY + SW / 2; pen(x, [[cx + Math.cos(a) * r0, cy + Math.sin(a) * r0], [cx + Math.cos(a + 0.25) * (r0 + r1) / 2, cy + Math.sin(a + 0.25) * (r0 + r1) / 2], [cx + Math.cos(a) * r1, cy + Math.sin(a) * r1]], { w: 1.6, wob: false, a: sq }); }
              if (p > 0.5) { const al = clamp((p - 0.5) / 0.2); CREASE[i].slice(0, T.n[i]).forEach(([a, b, an2]) => { const c2 = Math.cos(an2), s2 = Math.sin(an2), L = [[0, 0], [6, -6], [12, 3], [18, -5], [24, 2]].map(([u, v]) => [x0 + a + u * c2 - v * s2, SY + b + u * s2 + v * c2]); pen(x, L, { w: 1.8, wob: false, a: 0.85 * al }); }); }
            } else { // a torch shines across the swatch
              if (p > 0.02) { const lit = clamp(p / 0.3); x.save(); x.fillStyle = `rgba(255,226,60,${0.5 * lit})`; x.beginPath(); x.moveTo(x0 - 14, SY - 22); x.lineTo(x0 + SW, SY + 18); x.lineTo(x0 + SW, SY + SW); x.lineTo(x0 + 22, SY + SW); x.closePath(); x.fill(); x.restore(); }
              sw();
              const tb = [[x0 - 34, SY - 46], [x0 - 4, SY - 26], [x0 - 14, SY - 10], [x0 - 44, SY - 30]]; paper(x, tb); Ink.hatchFill(x, tb, 1, B, 1.6); Ink.stroke(x, close(tb), { w: 2, seed: 7 });
              if (i === 3 && p > 0.3) { const al = clamp((p - 0.3) / 0.3), tw = 0.8 + 0.2 * Math.sin(t * 6);
                [[30, 34, 13], [70, 58, 17], [44, 84, 11], [86, 26, 9]].forEach(([a, b, q]) => { const px = x0 + a, py = SY + b, r = q * tw; pen(x, [[px - r, py], [px + r, py]], { w: 2.4, color: RD, wob: false, a: al }); pen(x, [[px, py - r], [px, py + r]], { w: 2.4, color: RD, wob: false, a: al }); });
                [[0.5, -1], [0.75, -0.8], [0.95, -0.5]].forEach(([dx, dy], k) => pen(x, [[x0 + SW * 0.6 + k * 6, SY + 14], [x0 + SW * 0.6 + dx * 46 + k * 6, SY + 14 + dy * 46]], { w: 2, color: RD, wob: false, a: al }));
                if (run[i] || p >= 1) busy = busy || run[i]; }
            }
            text(x, FIB[i], cx, SY + SW + 46, { size: 24, align: 'center' });
            if (st.tested[i]) text(x, T.words[i], cx, BH - 8, { font: 'hand', size: 22, align: 'center', color: RD });
            else if (!run[i]) text(x, 'tap to test', cx, BH - 8, { font: 'hand', size: 22, align: 'center', a: 0.5 });
          }
          return busy;
        };
        C.c.addEventListener('click', (e) => {
          const [px] = C.pos(e), i = clamp(Math.round((px - 108) / 214), 0, 3);
          if (!st.pred || run[i]) return; an[i] = 0; run[i] = true; Book.sfx('tick', { gain: 0.5 }); Book.scribble(0.3); C.go();
        });
        gate(); C.go();
      });

      // ================================================================== notes (after the tests), then recall
      const notes = ui.box('', { tag: 'Notes' });
      const NOTES = '<span class="tag">Notes</span><b>Plant</b> fibres are made of <span class="key">cellulose</span>; <b>animal</b> fibres are made of <span class="key">protein</span>.<br>'
        + '<span class="key">Cotton</span> (seed pod of the cotton plant): soft, strong, <b>absorbent</b>, cool to wear; creases easily, slow to dry. <i>Jeans, T-shirts, towels.</i><br>'
        + '<span class="key">Linen</span> (stem of the flax plant): very strong, absorbent, <b>cool</b> and crisp; <b>creases very easily</b>. <i>Summer clothing, tablecloths, tea towels.</i><br>'
        + '<span class="key">Wool</span> (fleece of sheep): <b>warm</b> (fibres trap air), soft, elastic (creases drop out); can shrink, can feel itchy. <i>Jumpers, coats, carpets, blankets.</i><br>'
        + '<span class="key">Silk</span> (cocoon of the silkworm): very smooth, <b>lustrous</b> (shiny), drapes well; expensive. <i>Ties, scarves, wedding dresses.</i><br>'
        + '<span class="small">Natural fibres are <b>renewable</b> and <b>biodegradable</b>, but growing cotton uses a lot of water.</span>';
      function gateNotes() {
        const n = state.filter((s) => s.ok).length;
        notes.innerHTML = n === 4 ? NOTES : `<span class="tag">Notes</span><span class="small">🔒 Your notes appear here when you have finished all four tests (${n}/4 done).</span>`;
        requestAnimationFrame(() => Ink.frame(notes));
      }
      gateNotes();
      ui.el('h2', '', 'Now without looking');
      ui.p('<span class="small">The notes and the drawings at the top go blurry while you answer. No peeking!</span>');
      const hide = [notes, srcWrap];
      const fam = ui.sort({ id: 'p03.family', label: 'Sort 10 cards: plant fibre or animal fibre', q: '<b>Plant or animal?</b> Tap a card, then tap the box it belongs in.',
        buckets: ['PLANT fibres', 'ANIMAL fibres'],
        items: [
          { t: 'cotton', b: 0, mis: 'plant-animal' }, { t: 'linen', b: 0, mis: 'plant-animal' }, { t: 'wool', b: 1, mis: 'plant-animal' }, { t: 'silk', b: 1, mis: 'plant-animal' },
          { t: 'comes from a boll', b: 0, mis: 'plant-animal' }, { t: 'comes from flax', b: 0, mis: 'plant-animal' }, { t: 'comes from a fleece', b: 1, mis: 'plant-animal' }, { t: 'comes from a cocoon', b: 1, mis: 'plant-animal' },
          { t: 'made of cellulose', b: 0, mis: 'plant-animal' }, { t: 'made of protein', b: 1, mis: 'plant-animal' },
        ],
        explain: 'Cotton (boll) and linen (flax) are plant fibres made of cellulose. Wool (fleece) and silk (cocoon) are animal fibres made of protein.' });
      ui.hideWhile(fam, 'p03.family', hide);
      const uses = ui.match({ id: 'p03.uses', label: 'Match the 4 natural fibres to their uses', q: 'Tap a fibre, then tap what it is used for.',
        pairs: [
          ['cotton', 'jeans, T-shirts and towels', 'natural-mixup'],
          ['linen', 'summer clothing and tea towels', 'natural-mixup'],
          ['wool', 'jumpers, coats and carpets', 'natural-mixup'],
          ['silk', 'ties, scarves and wedding dresses', 'natural-mixup'],
        ] });
      ui.hideWhile(uses, 'p03.uses', hide);
      S.go();
    },
  });
})();
