// Page 1 — Starter: the wardrobe challenge. Six unlabelled garments on a rail, each with a "feel card". Predict, then
// dress three people (hot PE lesson, freezing winter walk, posh party), press GO and read the comfort meters and
// thought bubbles. The fibre names only appear in the reveal afterwards.
(function () {
  'use strict';
  const B = Ink.BLUE, RD = Ink.RED, GR = Ink.GREEN, rgba = Ink.rgba, geo = Ink.geo;
  const PAPER = '#fbfaf5';
  const HANDF = (s) => `400 ${s}px "Gloria Hallelujah", "Comic Sans MS", cursive`;
  const LABF = (s) => `600 ${s}px Fredoka, "Arial Rounded MT Bold", system-ui, sans-serif`;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const close = (P) => P.concat([P[0]]);
  const mirror = (L) => L.concat(L.slice().reverse().map(([x, y]) => [-x, y]));
  const at = (P, cx, cy, s = 1) => P.map(([x, y]) => [cx + x * s, cy + y * s]);

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
  function wrap(x, s, maxW, size) {
    x.save(); x.font = HANDF(size); const out = []; let line = '';
    s.split(' ').forEach((w) => { const t = line ? line + ' ' + w : w; if (x.measureText(t).width > maxW && line) { out.push(line); line = w; } else line = t; });
    if (line) out.push(line); x.restore(); return out;
  }

  // an interactive canvas with an on-demand render loop (stops when the page is hidden)
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

  // ------------------------------------------------------------------ the six garments (no fibre names here!)
  // outlines are half shapes (neck centre → left side → hem centre), mirrored. Origin = centre of the neckline.
  const SHAPE = {
    tee: mirror([[0, 10], [-14, 0], [-34, 4], [-56, 26], [-44, 40], [-32, 30], [-32, 100], [0, 100]]),
    jumper: mirror([[0, 10], [-16, 0], [-38, 6], [-64, 84], [-48, 90], [-34, 44], [-34, 104], [0, 104]]),
    vest: mirror([[0, 24], [-12, 0], [-25, 0], [-27, 20], [-30, 36], [-30, 100], [0, 100]]),
    silk: mirror([[0, 12], [-13, 0], [-36, 6], [-60, 86], [-45, 91], [-33, 44], [-31, 104], [0, 108]]),
    legs: [[-26, 0], [26, 0], [30, 112], [10, 112], [0, 34], [-10, 112], [-30, 112]],
    linen: mirror([[0, 12], [-13, 0], [-35, 5], [-55, 30], [-43, 42], [-32, 32], [-32, 102], [0, 102]]),
  };
  const GARMENTS = [
    { k: 'A', shape: 'tee', what: 'T-shirt', feel: 'Soft, and cool on the skin. Soaks up water like a sponge, then stays wet for ages. Creases.', name: 'cotton T-shirt', fibre: 'cotton', why: 'soft, cool and <b>absorbent</b>, but slow to dry' },
    { k: 'B', shape: 'jumper', what: 'jumper', feel: 'Thick, soft and springy. The fluffy fibres trap lots of air. Can feel a bit itchy.', name: 'wool jumper', fibre: 'wool', why: '<b>warm</b>: its fibres trap air' },
    { k: 'C', shape: 'vest', what: 'sports top', feel: 'Smooth and tough. Hardly soaks up any water, so it dries fast. Does not crease.', name: 'polyester sports top', fibre: 'polyester', why: 'strong, <b>quick drying</b> and crease-resistant' },
    { k: 'D', shape: 'silk', what: 'shirt', feel: 'Very smooth and shiny. Hangs in soft folds. Delicate: needs careful washing.', name: 'silk shirt', fibre: 'silk', why: 'very smooth, <b>lustrous</b> (shiny) and drapes well' },
    { k: 'E', shape: 'legs', what: 'leggings', feel: 'Smooth, light and super stretchy: springs straight back. Dries fast.', name: 'polyamide (nylon) + elastane leggings', fibre: 'nylon + elastane', why: 'lightweight, quick drying and <b>extremely stretchy</b>' },
    { k: 'F', shape: 'linen', what: 'shirt', feel: 'Crisp, stiff and cool. Soaks up water. Creases as soon as you look at it.', name: 'linen shirt', fibre: 'linen', why: '<b>cool</b> and crisp in hot weather, but creases very easily' },
  ];
  const G = (k) => GARMENTS.find((g) => g.k === k);

  function drawGarment(x, g, cx, cy, s = 1) {
    const P = at(SHAPE[g.shape], cx, cy, s), sd = g.k.charCodeAt(0);
    const L = (pts, o = {}) => pen(x, at(pts, cx, cy, s), Object.assign({ w: 1.5, seed: sd }, o));
    paper(x, P);
    if (g.shape === 'jumper') Ink.hatchFill(x, P, 1, B, 0.75);
    if (g.shape === 'legs') Ink.hatchFill(x, P, 1, B, 1.1);
    Ink.stroke(x, close(P), { w: 2.5, seed: sd * 3 });
    if (g.shape === 'tee') { L([[-14, 0], [-7, 12], [0, 15], [7, 12], [14, 0]]); L([[-32, 92], [32, 92]], { a: 0.5 }); L([[10, 34], [24, 34], [24, 48], [10, 48], [10, 34]], { a: 0.6 }); }
    if (g.shape === 'jumper') {
      for (let i = -30; i <= 30; i += 6) L([[i, 95], [i, 104]], { wob: false, w: 1.3 });
      [-1, 1].forEach((m) => { for (let i = 0; i < 3; i++) L([[m * (51 + i * 4.5), 80 + i * 1.5], [m * (53 + i * 4.5), 88 + i * 1.2]], { wob: false, w: 1.3 }); });
      L([[-16, 0], [-8, 11], [0, 14], [8, 11], [16, 0]], { w: 2 }); L([[-34, 94], [34, 94]], { a: 0.7 });
    }
    if (g.shape === 'vest') { L([[-30, 62], [30, 44]], { w: 2.2 }); L([[-30, 72], [30, 54]], { w: 2.2 }); L([[-12, 0], [-7, 18], [0, 27], [7, 18], [12, 0]], { a: 0.6 }); }
    if (g.shape === 'silk' || g.shape === 'linen') {
      L([[-13, 0], [-7, 17], [0, 12], [7, 17], [13, 0]], { w: 2 }); L([[0, 12], [0, g.shape === 'silk' ? 106 : 100]], { a: 0.7 });
      for (let i = 0; i < 4; i++) dot(x, cx + 4 * s, cy + (28 + i * 20) * s, 1.8 * s, 0.85);
    }
    if (g.shape === 'silk') { // shine: little four-point sparkles and soft drape lines
      [[-18, 34], [16, 62], [-40, 60]].forEach(([a, b]) => { L([[a - 6, b], [a + 6, b]], { wob: false, w: 1.5 }); L([[a, b - 6], [a, b + 6]], { wob: false, w: 1.5 }); });
      L(geo.curve([-22, 50], [-18, 70], [-24, 88], [-20, 102], 10), { a: 0.5 }); L(geo.curve([18, 74], [22, 86], [16, 96], [20, 104], 10), { a: 0.5 });
    }
    if (g.shape === 'linen') [[-24, 44], [8, 62], [-20, 80]].forEach(([a, b], i) => L([[a, b], [a + 5, b - 5], [a + 10, b + 2], [a + 15, b - 4], [a + 20, b + 1]], { wob: false, a: 0.75, seed: i }));
    if (g.shape === 'legs') { L([[-26, 8], [26, 8]], { w: 1.8 }); L([[-27, 12], [-29, 110]], { a: 0.6 }); L([[27, 12], [29, 110]], { a: 0.6 }); }
  }

  // ------------------------------------------------------------------ the three days, and how each garment does
  const SC = [
    { k: 'pe', title: 'PE lesson', sub: 'hot and sweaty', good: 'CE' },
    { k: 'winter', title: 'Winter walk', sub: 'freezing cold', good: 'B' },
    { k: 'party', title: 'Posh party', sub: 'look your best', good: 'D' },
  ];
  // s = comfort (0-100, for the meter only), fx = what you see, say = the thought bubble
  const RES = {
    pe: {
      A: { s: 50, fx: 'wet', say: 'Comfy at first… now it is soaked with sweat and will not dry.' },
      B: { s: 8, fx: 'hot', say: 'Far too hot! It traps all my body heat.' },
      C: { s: 92, fx: 'good', say: 'Sweat does not soak in, and it dries fast. Perfect!' },
      D: { s: 25, fx: 'wet', say: 'Too delicate: sweat marks, and it needs careful washing.' },
      E: { s: 90, fx: 'good', say: 'Stretches with every move and dries fast. Perfect!' },
      F: { s: 40, fx: 'crease', say: 'Cool… but stiff, and creased to bits already.' },
    },
    winter: {
      A: { s: 15, fx: 'cold', say: 'Brrr! Thin and cool: no good in the frost.' },
      B: { s: 95, fx: 'good', say: 'Toasty! All that trapped air keeps me warm. Perfect!' },
      C: { s: 22, fx: 'cold', say: 'Shivering! This thin top does not trap much warm air.' },
      D: { s: 35, fx: 'cold', say: 'Lovely and smooth, but far too thin on its own.' },
      E: { s: 20, fx: 'cold', say: 'Shivering! Thin and stretchy is not warm.' },
      F: { s: 10, fx: 'cold', say: 'Freezing! This one is made for hot summer days.' },
    },
    party: {
      A: { s: 40, fx: 'crease', say: 'Comfy, but creased and far too casual.' },
      B: { s: 30, fx: 'hot', say: 'Too hot and itchy for a party.' },
      C: { s: 20, fx: 'plain', say: 'I look like I am on my way to PE!' },
      D: { s: 95, fx: 'good', say: 'Smooth, shiny and hangs beautifully. Perfect!' },
      E: { s: 15, fx: 'plain', say: 'Sports kit at a posh party? Awkward.' },
      F: { s: 55, fx: 'crease', say: 'Smart at first… but look at all these creases!' },
    },
  };

  Book.page({
    id: 'p01',
    title: 'Starter: the wardrobe challenge',
    build(ui, root) {
      ui.h('The wardrobe challenge');
      ui.p('Six things hang in the wardrobe. They look fairly alike, but each one is made of something <b>different</b>. You have three very different days to dress for.');
      const got = (id) => Book.state.items[id];
      const pred = ui.predict({ id: 'p01.predict', label: 'Starter prediction: does what a fabric is made of affect comfort?',
        q: '<b>Predict:</b> does what a fabric is <b>made of</b> matter for how comfortable you feel?',
        options: ['Yes: it makes a big difference', 'A little, but not very much', 'No: only the thickness matters', 'No: only the style matters'], onPick: () => unlock() });

      ui.el('h2', '', 'Dress them for the day');
      const how = ui.p('<b>Tap a garment</b> to read its feel card. <b>Drag it</b> onto a person (or tap the garment, then tap the person). Dress all three, then press <b>GO</b>. Not comfy? Swap and try again.');
      const lab = ui.el('div', ''); lab.style.cssText = 'position:relative;margin:0 0 10px;transition:opacity .3s';
      const lockMsg = ui.el('p', 'small red', 'Make your prediction first: then the wardrobe unlocks.'); lockMsg.style.marginTop = '-4px';

      const W = 860, HH = 632, RAIL = 28, GY = 58, PX = [14, 292, 570], PW = 276, PY = 226, FY = 292, FS = 0.92;
      const gx = (i) => 82 + i * 139, pcx = (j) => PX[j] + 104;
      const S = Stage(lab, W, HH, 'pan-y');
      const r = ui.record('p01.try', { label: 'Wardrobe challenge: a comfortable garment found for each of 3 days', type: 'experiment', max: 3 });
      const prev = r.get() || {};
      const worn = Object.assign({ pe: '', winter: '', party: '' }, prev.worn || {});       // what each person has on now
      const shown = Object.assign({ pe: '', winter: '', party: '' }, prev.shown || {});     // the garment whose result is on show
      const tried = { pe: (prev.tried || {}).pe || '', winter: (prev.tried || {}).winter || '', party: (prev.tried || {}).party || '' };
      let goes = prev.goes || 0, sel = '', drag = null, revealed = false;
      const meter = { pe: 0, winter: 0, party: 0 };
      SC.forEach((s) => { if (shown[s.k]) meter[s.k] = RES[s.k][shown[s.k]].s; });
      const solved = (s) => [...s.good].some((k) => tried[s.k].includes(k));
      const nSolved = () => SC.filter(solved).length;
      const canReveal = () => nSolved() === 3 || goes >= 5;

      const row = ui.el('div', ''); row.style.cssText = 'display:flex;gap:14px;align-items:stretch;flex-wrap:wrap;margin:0 0 var(--R)';
      const go = ui.el('button', 'btn', 'GO!', row); go.style.cssText = 'margin-top:0;min-width:120px;min-height:64px;font-size:26px';
      const card = ui.el('div', 'small', '', row); card.style.cssText = 'flex:1 1 300px;min-height:64px;padding:8px 14px;border:2px dashed rgba(30,46,150,.4);border-radius:12px;background:rgba(255,255,255,.6);line-height:1.5';
      const stat = ui.el('p', 'small', ''); stat.style.marginTop = '-10px';
      const showCard = () => { const g = G(sel); card.innerHTML = g ? `<b style="font-family:Fredoka">Feel card ${g.k} (${g.what}):</b> ${g.feel}` : '<b style="font-family:Fredoka">Feel card:</b> tap a garment to find out how it feels.'; };

      let sprStat, spr = {};
      function buildArt() {
        GARMENTS.forEach((g) => { spr[g.k] = S.layer(150, 124, (x) => drawGarment(x, g, 75, 6, 1)); });
        sprStat = S.layer(W, HH, (x) => {
          // the rail and six hangers
          Ink.stroke(x, [[10, RAIL], [W - 10, RAIL]], { w: 3.2, seed: 5 });
          pen(x, [[10, RAIL - 12], [10, RAIL + 12]], { w: 3 }); pen(x, [[W - 10, RAIL - 12], [W - 10, RAIL + 12]], { w: 3 });
          GARMENTS.forEach((g, i) => {
            const cx = gx(i);
            pen(x, geo.curve([cx + 7, RAIL - 6], [cx - 9, RAIL - 12], [cx - 9, RAIL + 8], [cx, RAIL + 12], 10), { w: 2, seed: i });
            pen(x, [[cx, RAIL + 12], [cx, GY - 6]], { w: 2, wob: false });
            Ink.stroke(x, [[cx - 40, GY + 12], [cx, GY - 6], [cx + 40, GY + 12]], { w: 2, seed: 20 + i, retrace: false });
            Ink.drawBubble(x, g.k, cx, 208, 30, B, 1, -0.03, 'center');
          });
          // three people on three very different days
          SC.forEach((s, j) => {
            const x0 = PX[j];
            Ink.stroke(x, geo.rect(x0, PY, PW, HH - PY - 6, 14), { w: 2.2, seed: 31 + j });
            Ink.drawBubble(x, s.title, x0 + 14, PY + 38, 28, B, 1, -0.015);
            text(x, s.sub, x0 + 16, PY + 62, { font: 'hand', size: 22, a: 0.8 });
            if (j === 0) { // blazing sun
              const sx = x0 + 232, sy = PY + 44; Ink.stroke(x, geo.ellipse(sx, sy, 15, 15), { w: 2, seed: 3, retrace: false });
              for (let i = 0; i < 9; i++) { const a = (i / 9) * 6.283; pen(x, [[sx + Math.cos(a) * 20, sy + Math.sin(a) * 20], [sx + Math.cos(a) * 29, sy + Math.sin(a) * 29]], { w: 1.8, wob: false }); }
            } else if (j === 1) { // snowflakes
              [[224, 34, 11], [250, 62, 8], [200, 66, 7], [28, 120, 8], [252, 130, 9], [22, 220, 7]].forEach(([a, b, q]) => { for (let i = 0; i < 3; i++) { const an = (i / 3) * Math.PI; pen(x, [[x0 + a - Math.cos(an) * q, PY + b - Math.sin(an) * q], [x0 + a + Math.cos(an) * q, PY + b + Math.sin(an) * q]], { w: 1.5, wob: false }); } });
            } else { // bunting and a few stars
              const y0 = PY + 16; pen(x, geo.curve([x0 + 172, y0 - 4], [x0 + 200, y0 + 12], [x0 + 236, y0 + 12], [x0 + 266, y0 - 2], 16), { w: 1.6 });
              [180, 201, 222, 243].forEach((a, i) => { const T = [[x0 + a, y0 + 1 + (i === 1 || i === 2 ? 4 : 0)], [x0 + a + 16, y0 + 2 + (i === 1 || i === 2 ? 4 : 0)], [x0 + a + 8, y0 + 22 + (i === 1 || i === 2 ? 4 : 0)]]; if (i % 2) Ink.hatchFill(x, T, 1, B, 2); pen(x, close(T), { w: 1.5, wob: false }); });
              [[24, 122], [30, 226], [188, 250]].forEach(([a, b]) => { pen(x, [[x0 + a - 8, PY + b], [x0 + a + 8, PY + b]], { w: 1.6, wob: false }); pen(x, [[x0 + a, PY + b - 8], [x0 + a, PY + b + 8]], { w: 1.6, wob: false }); });
            }
            // the person (drawn without clothes detail: a simple pen figure)
            const cx = pcx(j), F = (pts) => at(pts, cx, FY, FS);
            Ink.stroke(x, F(geo.ellipse(0, 22, 20, 21)), { w: 2.4, seed: 41 + j });
            pen(x, F([[0, 43], [0, 52]]), { w: 2.2 });
            const body = F([[-30, 54], [30, 54], [24, 150], [-24, 150]]); Ink.stroke(x, close(body), { w: 2, seed: 44 + j, retrace: false });
            [-1, 1].forEach((m) => {
              pen(x, F([[m * 32, 58], [m * 62, 120]]), { w: 2.4, seed: 5 + m }); Ink.stroke(x, F(geo.ellipse(m * 64, 125, 6, 6)), { w: 1.6, seed: 8 + m, retrace: false });
              pen(x, F([[m * 13, 150], [m * 19, 238]]), { w: 2.4, seed: 7 + m }); pen(x, F([[m * 19, 238], [m * 32, 241]]), { w: 2.4 });
            });
            // comfort meter
            const mx = x0 + 214, my = FY + 34, mh = 176;
            Ink.stroke(x, geo.rect(mx, my, 34, mh, 6), { w: 2.2, seed: 51 + j });
            for (let i = 1; i < 4; i++) pen(x, [[mx, my + (mh * i) / 4], [mx + 9, my + (mh * i) / 4]], { w: 1.4, wob: false, a: 0.7 });
            text(x, 'comfort', mx + 17, my - 10, { size: 22, align: 'center' });
          });
        });
      }
      buildArt(); S.onFonts = buildArt;

      const face = (x, j, res, t) => {
        const cx = pcx(j), F = (pts) => at(pts, cx, FY, FS), sc = res ? res.s : -1, fx = res ? res.fx : '';
        dot(x, cx - 7 * FS, FY + 18 * FS, 2.2); dot(x, cx + 7 * FS, FY + 18 * FS, 2.2);
        const m = sc < 0 ? 0 : sc >= 85 ? 6 : sc >= 45 ? 0 : -5;
        pen(x, F(geo.curve([-8, 30], [-4, 30 + m], [4, 30 + m], [8, 30], 8)), { w: 2, wob: false });
        if (fx === 'good') { Ink.tick(x, cx + 34, FY + 30, 1.1); }
        if (fx === 'hot') { [-1, 0, 1].forEach((i) => pen(x, geo.curve([cx + i * 16, FY - 6], [cx + i * 16 - 6, FY - 14], [cx + i * 16 + 6, FY - 22], [cx + i * 16, FY - 30 - 3 * Math.sin(t * 4 + i)], 8), { w: 2, color: RD, wob: false })); }
        if (fx === 'hot' || fx === 'wet') [[-26, 14], [27, 20], [-30, 34]].forEach(([a, b], i) => { const yy = FY + b * FS + ((t * 16 + i * 7) % 14); const D = [[cx + a, yy - 7], [cx + a + 4, yy], [cx + a, yy + 4], [cx + a - 4, yy], [cx + a, yy - 7]]; pen(x, D, { w: 1.8, color: RD, wob: false }); });
        if (fx === 'wet') [[-12, 84], [10, 104], [-4, 126], [16, 76]].forEach(([a, b]) => { const D = F([[a, b - 7], [a + 4, b], [a, b + 4], [a - 4, b], [a, b - 7]]); pen(x, D, { w: 1.6, color: RD, wob: false }); });
        if (fx === 'cold') { const sh = Math.sin(t * 30) * 2; [-1, 1].forEach((m2) => [70, 110, 170].forEach((b) => pen(x, F([[m2 * 78 + sh, b], [m2 * 84 + sh, b + 6], [m2 * 78 + sh, b + 12], [m2 * 84 + sh, b + 18]]), { w: 2, color: RD, wob: false }))); }
        if (fx === 'crease') [[-16, 78], [4, 100], [-10, 124]].forEach(([a, b]) => pen(x, F([[a, b], [a + 5, b - 6], [a + 10, b + 3], [a + 15, b - 5], [a + 20, b + 2]]), { w: 2, color: RD, wob: false }));
        if (fx === 'plain') Ink.drawBubble(x, '?', cx + 34, FY + 10, 34, RD, 1, 0.1, 'center');
      };

      S.render = (dt, t) => {
        const x = S.ctx; let busy = !!drag;
        S.blit(sprStat, 0, 0);
        const src = (L, px, py, s) => { x.globalCompositeOperation = 'source-over'; S.blit(L, px, py, s); x.globalCompositeOperation = 'multiply'; };
        const wornBy = (k) => SC.find((s) => worn[s.k] === k);
        // garments still on the rail
        GARMENTS.forEach((g, i) => {
          if (wornBy(g.k) || (drag && drag.k === g.k && drag.moved)) return;
          src(spr[g.k], gx(i) - 75, GY - 6, 1);
          if (sel === g.k) Ink.stroke(x, geo.rect(gx(i) - 68, GY - 24, 136, 156, 16), { w: 2.4, color: RD, seed: 71 });
          if (revealed) text(x, g.fibre, gx(i), 180, { size: 22, align: 'center', color: RD });
        });
        if (revealed) GARMENTS.forEach((g, i) => { if (wornBy(g.k)) text(x, g.fibre, gx(i), 180, { size: 22, align: 'center', color: RD }); });
        // the people
        SC.forEach((s, j) => {
          const k = worn[s.k], g = k && G(k), res = shown[s.k] && shown[s.k] === k ? RES[s.k][k] : null, cx = pcx(j);
          if (g && !(drag && drag.k === k && drag.moved)) {
            if (g.shape === 'legs') src(spr[k], cx - 75 * 0.86, FY + 146 * FS - 6 * 0.86, 0.86); else src(spr[k], cx - 75, FY + 48 * FS - 6, 1);
            if (sel === k) Ink.stroke(x, geo.ellipse(cx, FY + 130, 84, 124), { w: 2.2, color: RD, seed: 73 });
          }
          face(x, j, res, t);
          if (res && (res.fx === 'hot' || res.fx === 'wet' || res.fx === 'cold')) busy = true;
          // meter
          const tgt = res ? res.s : 0; if (Math.abs(tgt - meter[s.k]) > 0.5) { meter[s.k] += (tgt - meter[s.k]) * Math.min(1, dt * 5); busy = true; } else meter[s.k] = tgt;
          const mx = PX[j] + 214, my = FY + 34, mh = 176, v = meter[s.k] / 100;
          if (v > 0.01) { const col = meter[s.k] >= 85 ? GR : meter[s.k] >= 45 ? B : RD, R = [[mx + 3, my + mh - 3], [mx + 31, my + mh - 3], [mx + 31, my + mh - 3 - (mh - 6) * v], [mx + 3, my + mh - 3 - (mh - 6) * v]]; Ink.hatchFill(x, R, 1, col, 2.4); pen(x, [R[3], R[2]], { w: 2.4, color: col, wob: false }); }
          // thought bubble
          const by = FY + 244, bh = HH - by - 14;
          if (res) {
            const col = res.s >= 85 ? GR : B;
            Ink.stroke(x, geo.rect(PX[j] + 8, by, PW - 16, bh, 14), { w: 2, seed: 81 + j, color: col });
            const lines = wrap(x, res.say, PW - 36, 20), lh = 25, y0 = by + bh / 2 - ((lines.length - 1) * lh) / 2 + 7;
            lines.forEach((ln, i) => text(x, ln, PX[j] + PW / 2, y0 + i * lh, { font: 'hand', size: 20, align: 'center', color: col }));
          } else text(x, k ? 'press GO to find out' : 'drop a garment on me', PX[j] + PW / 2, by + bh / 2 + 7, { font: 'hand', size: 20, align: 'center', a: 0.55 });
        });
        if (drag && drag.moved) { x.globalAlpha = 0.92; src(spr[drag.k], drag.x - 75, drag.y - 56, 1); x.globalAlpha = 1; }
        return busy;
      };

      // ------------------------------------------------------------------ pointer: tap = feel card / place, drag = move
      const hitGarment = (px, py) => {
        for (let j = 0; j < 3; j++) { const k = worn[SC[j].k]; if (k && Math.abs(px - pcx(j)) < 74 && py > FY + 30 && py < FY + 236) return k; }
        if (py < 214) { const i = Math.round((px - 82) / 139); if (i >= 0 && i < 6 && Math.abs(px - gx(i)) < 66 && !SC.some((s) => worn[s.k] === GARMENTS[i].k)) return GARMENTS[i].k; }
        return '';
      };
      const hitPanel = (px, py) => (py < PY - 6 ? -1 : PX.findIndex((x0) => px >= x0 && px <= x0 + PW));
      const place = (k, j) => {
        SC.forEach((s) => { if (worn[s.k] === k) { worn[s.k] = ''; } });
        if (j >= 0) { worn[SC[j].k] = k; Book.sfx('paper', { gain: 0.4 }); Book.scribble(0.15); }
        sel = ''; showCard(); status();
      };
      S.c.addEventListener('touchstart', (e) => { const t = e.touches[0]; if (t && hitGarment(...S.pos(t))) e.preventDefault(); }, { passive: false });
      S.c.addEventListener('pointerdown', (e) => {
        const [px, py] = S.pos(e), k = hitGarment(px, py);
        if (k) { drag = { k, x: px, y: py, x0: px, y0: py, moved: false }; try { S.c.setPointerCapture(e.pointerId); } catch (er) {} }
        else drag = null;
        S.go();
      });
      S.c.addEventListener('pointermove', (e) => {
        if (!drag) return; const [px, py] = S.pos(e); drag.x = px; drag.y = py;
        if (!drag.moved && Math.hypot(px - drag.x0, py - drag.y0) > 12) { drag.moved = true; sel = drag.k; showCard(); }
        S.go();
      });
      S.c.addEventListener('pointerup', (e) => {
        const [px, py] = S.pos(e), d = drag; drag = null;
        if (d && d.moved) place(d.k, hitPanel(px, py));
        else if (d) { // a tap on a garment: show its feel card (tap again to put it down)
          sel = sel === d.k ? '' : d.k; showCard(); Book.sfx('tick', { gain: 0.5 });
        } else if (sel) { const j = hitPanel(px, py); if (j >= 0) place(sel, j); else if (py < 214) place(sel, -1); }
        S.go();
      });
      S.c.addEventListener('pointercancel', () => { drag = null; S.go(); });

      go.onclick = () => {
        if (SC.some((s) => !worn[s.k])) return;
        goes++;
        SC.forEach((s) => { const k = worn[s.k]; shown[s.k] = k; if (!tried[s.k].includes(k)) tried[s.k] += k; });
        const allGood = SC.every((s) => RES[s.k][worn[s.k]].s >= 85);
        Book.sfx(allGood ? 'success' : 'pop', { gain: 0.4 });
        pred.querySelectorAll('.opt').forEach((b) => (b.disabled = true)); // no changing the prediction after testing
        const n = nSolved();
        r.set({ answer: `pressed GO ${goes}×; ` + SC.map((s) => `${s.title}: tried ${[...tried[s.k]].join(', ')} ${solved(s) ? '✓' : '✗'}`).join('; '),
          correct: n === 3, score: n, max: 3, worn: Object.assign({}, worn), shown: Object.assign({}, shown), tried: Object.assign({}, tried), goes });
        sel = ''; showCard(); status(); S.go();
      };

      // ------------------------------------------------------------------ after the challenge: the reveal
      const rest = ui.el('div', '');
      const add = (e) => { rest.appendChild(e); return e; };
      add(ui.el('h2', '', 'What were they made of?'));
      const found = add(ui.box('', { tag: 'What you found' }));
      add(ui.box('The hair-like strands a fabric is made from are called <span class="key">fibres</span>. Every fibre has its own <b>properties</b>: warm or cool, absorbent or quick drying, stretchy, shiny, easy to crease.<br>Designers <b>choose fibres and fabrics for their properties</b>: the right one depends on the job.', { tag: 'The big idea' }));
      add(ui.mcq({ id: 'p01.check', label: 'Why did the same person feel so different in each garment?', q: 'Why did each garment feel so different to wear?',
        options: [
          { t: 'Each fibre has its own properties, so it suits different jobs', ok: true },
          { t: 'Thicker garments are always more comfortable than thin ones', why: 'The thick jumper was perfect in the frost, but far too hot in PE. Thickness was not what decided it: think about what each garment was made of.' },
          { t: 'The shape of a garment decides how warm or cool it will be', why: 'Garments D and F were both shirts, yet one suited the party and the other creased. The shape was the same: what was different?' },
          { t: 'Fibres from plants and animals always beat the man-made ones', why: 'The man-made sports top and leggings were the best choices for PE. No fibre is best at everything: it depends on the job.' },
        ],
        explain: 'Each fibre has its own properties, so a designer picks the fibre that suits the job.' }));
      add(ui.rate({ id: 'p01.conf', label: 'Confidence: choosing a fibre for a job', q: 'How confident are you that you could pick a good fibre for a product and say why?' }));

      function status() {
        const n = SC.filter((s) => worn[s.k]).length;
        go.disabled = n < 3 || !got('p01.predict');
        const done = canReveal();
        stat.innerHTML = goes === 0 ? (n < 3 ? `Dress all three people, then press GO. (${n}/3 dressed)` : 'All dressed: press <b>GO</b>!')
          : SC.map((s) => `<b>${solved(s) ? '☑' : '☐'}</b> ${s.title}`).join(' &nbsp; ') + (nSolved() === 3 ? ' &nbsp; <b class="green">All three comfortable!</b>' : done ? '' : '<br>Swap garments and press GO again until all three are comfortable.');
        rest.style.display = done ? '' : 'none'; revealed = done;
        if (!done) return;
        const p = (got('p01.predict') || {}).answer;
        found.innerHTML = '<span class="tag">What you found</span>' + GARMENTS.map((g) => `<b style="font-family:Fredoka">${g.k}</b> = <b>${g.name}</b>: ${g.why}.`).join('<br>')
          + `<br>Best picks: <b>PE</b> → C or E, <b>winter walk</b> → B, <b>posh party</b> → D.`
          + (p ? `<br>You predicted “${Book.esc(p.toLowerCase())}”: what a fabric is made of made a <b>big</b> difference.` : '');
        requestAnimationFrame(() => Ink.frame(found));
      }
      function unlock() {
        const on = !!got('p01.predict');
        lab.style.opacity = on ? 1 : 0.35; lab.style.pointerEvents = on ? '' : 'none';
        lockMsg.style.display = on ? 'none' : ''; how.style.opacity = on ? 1 : 0.5;
        if (r.get()) pred.querySelectorAll('.opt').forEach((b) => (b.disabled = true));
        status();
      }
      showCard(); unlock(); S.go();
    },
  });
})();
