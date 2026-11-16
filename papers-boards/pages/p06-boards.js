// Page 6 — The six boards. A cross-section explorer: for each board the student peels a corner of the sample back
// (or, for ink jet card, prints ink dots on it) and a magnifier shows the layers in the cut edge, labelled in plain
// words. Then a question on its structure / key property, then the notes. Ends with eight products to sort.
(function () {
  'use strict';
  const B = Ink.BLUE, RD = Ink.RED, rgba = Ink.rgba, geo = Ink.geo;
  const HANDF = (s) => `400 ${s}px "Gloria Hallelujah", "Comic Sans MS", cursive`;
  const W = 860, HH = 290;
  const R = { x: 24, y: 44, w: 270, h: 206 }, LX = 438, LY = 146, LR = 116;
  const KRAFT = 'rgba(206,172,122,0.62)', GREY = 'rgba(150,143,130,0.6)', WHITE = 'rgba(255,255,255,0.96)', CREAM = 'rgba(244,238,222,0.96)';
  const CYAN = [0, 150, 200];
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));

  function css() {
    if (document.getElementById('p06-css')) return;
    const s = document.createElement('style'); s.id = 'p06-css';
    s.textContent = `
      .p06-cv { position: relative; display: block; width: 100%; height: auto; touch-action: pan-y; user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; cursor: pointer; margin: 0 0 6px; }
      .p06-h { margin: calc(var(--R) * .6) 0 0 !important; }
      .p06-h small { font: 600 17px Fredoka; color: var(--red); margin-right: 8px; }
      .p06-do { margin: 0 0 4px !important; font-size: 18.5px; line-height: 1.5; }
      .p06-note { display: none; }
      .p06-note.on { display: block; animation: p06in .5s; }
      .p06-note p { margin: 0 0 6px; line-height: 1.5; font-size: 18.5px; }
      @keyframes p06in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
    `;
    document.head.appendChild(s);
  }
  const text = (x, s, px, py, o = {}) => { x.save(); x.font = HANDF(o.size || 23); x.fillStyle = rgba(o.color || B, o.a ?? 0.92); x.textAlign = o.align || 'left'; x.fillText(s, px, py); x.restore(); };
  const path = (x, P) => { x.beginPath(); P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.closePath(); };
  // keep the part of polygon P where (p - M)·d has the given sign
  function clipHalf(P, M, d, sign) {
    const out = [], f = (p) => ((p[0] - M[0]) * d[0] + (p[1] - M[1]) * d[1]) * sign;
    for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length], fa = f(a), fb = f(b); if (fa >= 0) out.push(a); if ((fa >= 0) !== (fb >= 0)) { const t = fa / (fa - fb); out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); } }
    return out;
  }
  const speck = (x, n, seed, a, x0, y0, w, h) => { const r = H.rng(seed); x.fillStyle = rgba(B, a); for (let i = 0; i < n; i++) { x.beginPath(); x.arc(x0 + r() * w, y0 + r() * h, 0.7 + r() * 0.8, 0, 7); x.fill(); } };
  const glint = (x, px, py, s = 1) => { x.strokeStyle = rgba(B, 0.22); x.lineWidth = 1.6; x.beginPath(); x.moveTo(px, py + 30 * s); x.lineTo(px + 26 * s, py); x.moveTo(px + 8 * s, py + 46 * s); x.lineTo(px + 46 * s, py + 2 * s); x.stroke(); };
  const band = (x, y0, y1, fill) => { x.save(); x.globalCompositeOperation = 'source-over'; x.fillStyle = fill; x.fillRect(LX - LR, y0, LR * 2, y1 - y0); x.restore(); };
  const hline = (x, y, q, o = {}) => Ink.stroke(x, [[LX - LR, y], [LX + LR, y]], Object.assign({ w: 2.4, amp: 0.5, retrace: false, p: q, seed: (y | 0) + 3 }, o));

  // top(x) paints the face; inner(x) what is under the peeled layer; sect(x, q, t) the magnified cut edge
  const BOARDS = [
    { k: 'corrugated', name: 'Corrugated card', top: KRAFT, under: KRAFT,
      face(x) { text(x, 'THIS WAY UP', R.x + 22, R.y + 42, { size: 22, a: 0.45 }); Ink.stroke(x, [[R.x + 40, R.y + 110], [R.x + 40, R.y + 62], [R.x + 28, R.y + 76]], { w: 2, retrace: false }); Ink.stroke(x, [[R.x + 40, R.y + 62], [R.x + 52, R.y + 76]], { w: 2, retrace: false }); },
      inner(x) { x.fillStyle = 'rgba(206,172,122,0.45)'; x.fillRect(R.x, R.y, R.w, R.h); for (let u = 0; u < R.w; u += 14) { x.fillStyle = rgba(B, 0.16); x.fillRect(R.x + u + 7, R.y, 7, R.h); x.strokeStyle = rgba(B, 0.55); x.lineWidth = 1.4; x.beginPath(); x.moveTo(R.x + u, R.y); x.lineTo(R.x + u, R.y + R.h); x.stroke(); } },
      sect(x, q) { band(x, LY - 56, LY + 56, 'rgba(206,172,122,0.3)'); hline(x, LY - 62, q, { w: 4 }); hline(x, LY + 62, q, { w: 4 });
        const P = []; for (let u = -LR; u <= LR; u += 4) P.push([LX + u, LY + Math.cos(u * 0.098) * 54]); Ink.stroke(x, P, { w: 3.4, amp: 0.3, p: q, seed: 4 }); },
      labels: [['flat sheet', LY - 62], ['wavy layer', LY + 4], ['flat sheet', LY + 62]],
      q: { id: 'p06.corrugated', label: 'Corrugated card: structure', q: 'How is corrugated card built?', options: [
        { t: 'A wavy fluted layer glued between two flat liners', ok: true },
        { t: 'One thick sheet with wavy grooves pressed into it', mis: 'corrugated-structure', why: 'You peeled a separate flat sheet off the top: it is three layers, not one.' },
        { t: 'Two fluted layers glued either side of a flat liner', mis: 'corrugated-structure', why: 'Other way round: look at the cut edge again. The wavy layer is in the middle.' },
        { t: 'A polystyrene foam layer between two flat liners', mis: 'board-mixup', why: 'That is foam core board. The middle of corrugated card is a wavy sheet of paper.' },
      ], explain: 'The wavy layer is called fluting and the flat sheets are liners.' },
      note: '<p><span class="key">Corrugated card</span>: a wavy <b>fluted</b> layer glued between two flat <b>liners</b>.</p><p>Strong and stiff for its weight, lightweight, <b>absorbs impacts</b>, insulates, cheap and recyclable.</p><p>Used for shipping and packaging boxes, pizza boxes and protective packaging.</p>' },
    { k: 'duplex', name: 'Duplex board', top: WHITE, under: 'rgba(238,236,230,0.96)',
      face(x) { glint(x, R.x + 20, R.y + 16); const s = geo.ellipse(R.x + 92, R.y + 128, 40, 40); Ink.hatchFill(x, s, 1, RD, 1.4); Ink.stroke(x, s, { w: 2.4, color: RD }); text(x, 'CRUNCH!', R.x + 34, R.y + 62, { size: 26, color: RD }); },
      inner(x) { x.fillStyle = GREY; x.fillRect(R.x, R.y, R.w, R.h); speck(x, 500, 3, 0.3, R.x, R.y, R.w, R.h); },
      sect(x, q) { band(x, LY - 50, LY - 22, '#fff'); band(x, LY - 22, LY + 54, GREY); x.save(); x.beginPath(); x.rect(LX - LR, LY - 22, LR * 2 * q, 76); x.clip(); Ink.hatchFill(x, [[LX - LR, LY - 22], [LX + LR, LY - 22], [LX + LR, LY + 54], [LX - LR, LY + 54]], 1, B, 1); x.restore();
        hline(x, LY - 52, q, { w: 4.2 }); hline(x, LY - 22, q, { w: 1.6 }); hline(x, LY + 54, q, { w: 2.4 }); },
      labels: [['smooth white top layer', LY - 44], ['grey-brown layer below', LY + 26]],
      q: { id: 'p06.duplex', label: 'Duplex board: structure', q: 'What did the peel show about duplex board?', options: [
        { t: 'Two layers: a white coated printing face on a grey-brown back', ok: true },
        { t: 'One layer: white all the way through, coated on both of its faces', mis: 'duplex-vs-solid', why: 'That describes solid white board. Under the white face of duplex board you found a grey-brown layer.' },
        { t: 'Two layers: a grey-brown printing face on a white coated back', mis: 'duplex-vs-solid', why: 'Other way round: the white coated side is the one that is printed, and the grey-brown side is hidden inside the box.' },
        { t: 'Three layers: two white faces with a grey foam core in between', mis: 'board-mixup', why: 'There is no foam in duplex board: it is card, white on one side and grey-brown on the other.' },
      ], explain: 'Only one side is white and coated for printing, which makes duplex board cheaper than solid white board.' },
      note: '<p><span class="key">Duplex board</span>: two layers. One side is <b>white and coated for printing</b>; the other is grey/brown. It is <b>cheaper than solid white board</b>.</p><p>Tough, lightweight, with a good print surface on one side.</p><p>Used for food packaging such as cereal boxes and frozen-food cartons.</p>' },
    { k: 'solid', name: 'Solid white board', top: WHITE, under: WHITE,
      face(x) { glint(x, R.x + 20, R.y + 16); text(x, 'parfum', R.x + 60, R.y + 120, { size: 30, a: 0.75 }); Ink.stroke(x, [[R.x + 56, R.y + 132], [R.x + 170, R.y + 130]], { w: 1.6, retrace: false }); },
      inner(x) { x.fillStyle = '#fff'; x.fillRect(R.x, R.y, R.w, R.h); speck(x, 60, 8, 0.2, R.x, R.y, R.w, R.h); },
      sect(x, q) { band(x, LY - 50, LY + 54, '#fff'); x.globalAlpha = q; speck(x, 50, 5, 0.25, LX - LR, LY - 44, LR * 2, 92); x.globalAlpha = 1; hline(x, LY - 52, q, { w: 4.2 }); hline(x, LY + 56, q, { w: 4.2 }); },
      labels: [['smooth white face', LY - 48], ['white right through', LY + 8], ['smooth white face', LY + 62]],
      q: { id: 'p06.solid', label: 'Solid white board: why it is chosen', q: 'A perfume box is printed inside and out. Why choose solid white board, not duplex?', options: [
        { t: 'It is white all through, with an excellent print surface on both sides', ok: true },
        { t: 'It is the cheaper of the two, with one white side that can be printed', mis: 'duplex-vs-solid', why: 'That is duplex board: cheaper, and white on one side only. This box is printed on both sides.' },
        { t: 'It has a grey-brown back, which hides any marks inside the perfume box', mis: 'duplex-vs-solid', why: 'The grey-brown back belongs to duplex board. This sample was white right through.' },
        { t: 'It has a light foam centre, which makes the box rigid and easy to cut', mis: 'board-mixup', why: 'A foam centre is foam core board. This sample was the same white card all the way through.' },
      ], explain: 'Solid white board is top-quality bleached board: strong, stiff, smooth and printable on both sides.' },
      note: '<p><span class="key">Solid white board</span>: top-quality <b>bleached</b> board, white all the way through.</p><p>Strong, stiff and smooth, with an <b>excellent print surface on both sides</b>.</p><p>Used for book covers, premium packaging (perfume, cosmetics, chocolates) and greetings cards.</p>' },
    { k: 'foil', name: 'Foil lined board', top: WHITE, under: CREAM, anim: true,
      face(x) { glint(x, R.x + 20, R.y + 16); text(x, 'chicken curry', R.x + 36, R.y + 110, { size: 26, color: RD }); text(x, 'lid', R.x + 36, R.y + 142, { size: 22, a: 0.5 }); },
      inner(x) { const g = x.createLinearGradient(R.x, R.y, R.x + R.w, R.y + R.h); [0, 0.25, 0.4, 0.6, 0.8, 1].forEach((s, i) => g.addColorStop(s, i % 2 ? 'rgba(250,250,252,1)' : 'rgba(176,182,192,1)')); x.fillStyle = g; x.fillRect(R.x, R.y, R.w, R.h); x.strokeStyle = 'rgba(255,255,255,.9)'; x.lineWidth = 3; x.beginPath(); x.moveTo(R.x + 150, R.y + 180); x.lineTo(R.x + 250, R.y + 60); x.stroke(); },
      sect(x, q, t) { band(x, LY - 64, LY - 16, CREAM); x.save(); x.beginPath(); x.rect(LX - LR, LY - 64, LR * 2 * q, 48); x.clip(); Ink.hatchFill(x, [[LX - LR, LY - 64], [LX + LR, LY - 64], [LX + LR, LY - 16], [LX - LR, LY - 16]], 1, B, 0.7); x.restore();
        hline(x, LY - 66, q, { w: 2.4 }); band(x, LY - 16, LY - 9, 'rgba(120,128,142,' + q + ')'); x.save(); x.globalCompositeOperation = 'source-over'; x.strokeStyle = 'rgba(255,255,255,' + 0.9 * q + ')'; x.lineWidth = 2; x.setLineDash([16, 22]); x.beginPath(); x.moveTo(LX - LR, LY - 13); x.lineTo(LX + LR, LY - 13); x.stroke(); x.restore();
        if (q < 1) return;
        // heat (red arrows) rises from the hot food, meets the shiny layer and goes back down; steam drops stop at it
        [-64, -6, 52].forEach((ox, n) => { const u = (t * 0.45 + n * 0.33) % 1, x0 = LX + ox, yb = LY + 104, yt = LY - 4, up = u < 0.5, v = up ? u * 2 : (u - 0.5) * 2, y = up ? yb + (yt - yb) * v : yt + (yb - yt) * v, xx = x0 + (up ? 0 : 22);
          Ink.stroke(x, up ? [[x0, yb], [x0, y]] : [[x0, yb], [x0, yt], [xx, yt + 6], [xx, y]], { color: RD, w: 2.4, amp: 0.3, retrace: false, seed: 5 + n });
          const dir = up ? -1 : 1; Ink.stroke(x, [[xx - 8, y - dir * 10], [xx, y], [xx + 8, y - dir * 10]], { color: RD, w: 2.4, amp: 0.2, retrace: false, seed: 9 }); });
        [-92, -34, 26, 84].forEach((ox, n) => { const u = (t * 0.3 + n * 0.27) % 1, y = LY + 100 - u * 92; x.fillStyle = rgba(CYAN, 0.55); x.beginPath(); x.arc(LX + ox, Math.max(LY + 2, y), 5, 0, 7); x.fill(); });
      },
      labels: [['card', LY - 38], ['thin shiny metal layer', LY - 6], ['heat (red) and steam', LY + 58], ['(blue) from hot food', LY + 88]],
      q: { id: 'p06.foil', label: 'Foil lined board: what the foil is for', q: 'What is the thin layer of aluminium foil for?', options: [
        { t: 'A barrier to moisture and oxygen that also reflects heat back', ok: true },
        { t: 'A stiff metal skin that stops the thin card lid from bending', mis: 'foil-purpose', why: 'The foil is far too thin to add stiffness. Watch the magnifier: what happens to the heat and the steam when they reach it?' },
        { t: 'A shiny finish that makes the pack look attractive in the shop', mis: 'foil-purpose', why: 'The foil is on the inside, facing the food, where shoppers never see it. Watch what it does to the heat and the steam.' },
        { t: 'A smooth surface that lets the lid be printed in bright colours', mis: 'foil-purpose', why: 'The printing goes on the card side. The foil faces the food: watch what it does to the heat and the steam.' },
      ], explain: 'The foil keeps moisture and oxygen from passing through, and reflects heat so the food stays hot.' },
      note: '<p><span class="key">Foil lined board</span>: board <b>laminated</b> with a thin layer of <b>aluminium foil</b>.</p><p>The foil is a <b>barrier against moisture and oxygen</b>, and it <b>reflects heat</b> (keeps food hot).</p><p>Used for takeaway and ready-meal container lids, and drinks/juice cartons.</p>' },
    { k: 'foam', name: 'Foam core board', top: WHITE, under: WHITE,
      face(x) { Ink.stroke(x, [[R.x + 40, R.y + 150], [R.x + 40, R.y + 70], [R.x + 100, R.y + 40], [R.x + 160, R.y + 70], [R.x + 160, R.y + 150], [R.x + 40, R.y + 150]], { w: 2, retrace: false }); Ink.stroke(x, geo.rect(R.x + 84, R.y + 100, 32, 50, 2), { w: 1.6, retrace: false }); text(x, 'model wall', R.x + 36, R.y + 184, { size: 22, a: 0.5 }); },
      inner(x) { x.fillStyle = '#fff'; x.fillRect(R.x, R.y, R.w, R.h); const r = H.rng(6); x.strokeStyle = rgba(B, 0.4); x.lineWidth = 1.1; for (let i = 0; i < 420; i++) { x.beginPath(); x.arc(R.x + r() * R.w, R.y + r() * R.h, 2 + r() * 3.4, 0, 7); x.stroke(); } },
      sect(x, q) { band(x, LY - 62, LY + 62, '#fff'); const r = H.rng(2); x.save(); x.strokeStyle = rgba(B, 0.5); x.lineWidth = 1.4; x.beginPath(); x.rect(LX - LR, LY - 54, LR * 2 * q, 108); x.clip(); for (let i = 0; i < 150; i++) { x.beginPath(); x.arc(LX - LR + r() * LR * 2, LY - 48 + r() * 96, 4 + r() * 7, 0, 7); x.stroke(); } x.restore();
        hline(x, LY - 62, q, { w: 2.2 }); hline(x, LY - 55, q, { w: 2.2 }); hline(x, LY + 55, q, { w: 2.2 }); hline(x, LY + 62, q, { w: 2.2 }); },
      labels: [['thin card', LY - 58], ['light bubbly foam', LY + 6], ['thin card', LY + 66]],
      q: { id: 'p06.foam', label: 'Foam core board: structure', q: 'What is foam core board made of?', options: [
        { t: 'Polystyrene foam sandwiched between two sheets of card', ok: true },
        { t: 'A wavy fluted layer sandwiched between two flat liners', mis: 'board-mixup', why: 'That is corrugated card. In this sample the middle was a thick layer of bubbly foam.' },
        { t: 'Solid bleached card that is white all the way through', mis: 'board-mixup', why: 'That is solid white board. This sample had thin card faces with something much lighter in between.' },
        { t: 'Thick card laminated with a layer of aluminium foil', mis: 'board-mixup', why: 'That is foil lined board. This sample had a thick, light, bubbly middle.' },
      ], explain: 'The foam middle makes the board very lightweight but rigid.' },
      note: '<p><span class="key">Foam core board</span>: <b>polystyrene foam</b> sandwiched between two sheets of card or paper.</p><p><b>Very lightweight</b>, rigid and smooth; easy to cut with a craft knife, but it dents easily.</p><p>Used for architectural and design models, mounting photos and artwork, and point-of-sale displays.</p>' },
    { k: 'inkjet', name: 'Ink jet card', ink: true,
      labels: [],
      q: { id: 'p06.inkjet', label: 'Ink jet card: key property', q: 'What makes ink jet card different from ordinary card?', options: [
        { t: 'It is coated so the ink dries on the surface without bleeding', ok: true },
        { t: 'It is extra thick so the ink can soak deep down into its fibres', mis: 'board-mixup', why: 'Soaking in is what happened on the ordinary card, and the dots went fuzzy. Look at where the ink stayed on the ink jet card.' },
        { t: 'It has a foil layer inside that stops the ink soaking through', mis: 'board-mixup', why: 'There is no foil in ink jet card. Look at the magnifier: the ink never gets into the card at all.' },
        { t: 'It is grey inside, which makes the printed colours look brighter', mis: 'board-mixup', why: 'Ink jet card is bright white. It is what happens at the surface that keeps the dots crisp.' },
      ], explain: 'The dots stay small and crisp, so printed images are sharp and vivid.' },
      note: '<p><span class="key">Ink jet card</span>: card treated/coated so ink-jet ink <b>dries on the surface without bleeding</b>.</p><p>Bright white; gives sharp, vivid printed images.</p><p>Used for printing photographs, presentation work and greetings cards on an ink-jet printer.</p>' },
  ];

  Book.page({
    id: 'p06',
    title: 'The six boards',
    build(ui, root) {
      css();
      ui.h('The six boards');
      ui.p('Above about 200 gsm, paper is called <b>board</b>. Six kinds are on the bench. They look similar from the top, so <b>take each one apart</b>: the magnifier shows you the cut edge.');

      const rec = ui.record('p06.explore', { label: 'Board samples taken apart and explored (6)', type: 'experiment', max: 0 });
      const explored = new Set((rec.get() && rec.get().done) || []);
      const item = (id) => Book.state.items[id];
      const blurList = [];

      BOARDS.forEach((bd, n) => {
        ui.el('h2', 'p06-h', `<small>Sample ${n + 1}</small>${bd.name}`);
        const doP = ui.p(bd.ink ? 'Tap each piece of card a few times to <b>print ink dots</b> on it.' : 'Drag the <b>red corner</b> to peel the top layer back.', 'p06-do');
        const c = document.createElement('canvas'); c.className = 'p06-cv'; root.appendChild(c);
        const dpr = Math.min(2, window.devicePixelRatio || 1); c.width = W * dpr; c.height = HH * dpr; c.style.aspectRatio = W + ' / ' + HH;
        const x = c.getContext('2d');
        const pos = (e) => { const r = c.getBoundingClientRect(); return [((e.clientX - r.left) * W) / r.width, ((e.clientY - r.top) * HH) / r.height]; };
        const C = [R.x + R.w, R.y + R.h], RECT = [[R.x, R.y], [R.x + R.w, R.y], C, [R.x, R.y + R.h]];
        let F = explored.has(bd.k) ? [R.x + R.w * 0.34, R.y + R.h * 0.3] : C.slice(), open = explored.has(bd.k), t0 = 0, raf = 0, dragId = null;
        const dots = [[], []]; let lastSw = 1;
        if (bd.ink && open) { const r = H.rng(4); for (let s = 0; s < 2; s++) for (let i = 0; i < 4; i++) dots[s].push([30 + r() * 80, 40 + r() * 130, 9]); }

        const mcq = ui.mcq(bd.q);
        const note = ui.box(`<div>${bd.note}</div>`, { tag: 'Notes' }); note.classList.add('p06-note');
        blurList.push(c, note);
        const sync = () => {
          const it = item(bd.q.id), ans = !!it;
          mcq.classList.toggle('peek-lock', !open && !ans);
          note.classList.toggle('on', !!(it && it.correct));
          if (open) doP.innerHTML = bd.ink ? 'Ordinary card on the left, ink jet card on the right. Compare the dots and the cut edges.' : 'Look at the cut edge in the magnifier, then answer.';
        };
        mcq.addEventListener('click', () => setTimeout(sync, 60));
        const setOpen = () => { if (open) return; open = true; explored.add(bd.k); t0 = performance.now() / 1000; Book.sfx('pop', { gain: 0.4 }); rec.set({ answer: 'explored: ' + BOARDS.filter((b) => explored.has(b.k)).map((b) => b.name).join(', '), correct: null, done: [...explored] }); sync(); };

        // ---- drawing ----
        function lens(q, t) {
          x.save(); x.globalCompositeOperation = 'multiply';
          // zoom lines from the cut edge of the sample to the magnifier
          const ex = bd.ink ? SW2(lastSw) + SWW - 14 : R.x + R.w, ey = R.y + R.h * 0.5;
          x.strokeStyle = rgba(B, 0.35); x.lineWidth = 1.4; x.setLineDash([7, 7]); x.beginPath(); x.moveTo(ex + 4, ey - 12); x.lineTo(LX - 30, LY - LR + 4); x.moveTo(ex + 4, ey + 12); x.lineTo(LX - 30, LY + LR - 4); x.stroke(); x.setLineDash([]);
          x.restore();
          x.save(); x.beginPath(); x.arc(LX, LY, LR, 0, 7); x.globalCompositeOperation = 'source-over'; x.fillStyle = 'rgba(251,250,245,.9)'; x.fill(); x.clip(); x.globalCompositeOperation = 'multiply';
          if (q > 0) (bd.ink ? inkSect : bd.sect)(x, q, t); else text(x, '?', LX, LY + 22, { size: 64, align: 'center', a: 0.3 });
          x.restore();
          x.save(); x.globalCompositeOperation = 'multiply';
          Ink.stroke(x, geo.ellipse(LX, LY, LR, LR), { w: 4.4, seed: 5, amp: 0.4 }); Ink.stroke(x, geo.ellipse(LX, LY, LR + 7, LR + 7), { w: 1.8, seed: 9, amp: 0.4, retrace: false });
          if (q >= 1) (bd.ink ? INKLAB[lastSw] : bd.labels).forEach(([s, y]) => { if (!s.startsWith('(') && !s.startsWith('heat')) { const dx = Math.sqrt(Math.max(0, LR * LR - (y - LY) * (y - LY))); Ink.stroke(x, [[LX + dx - 26, y - 4], [572, y - 6]], { w: 1.4, retrace: false, amp: 0.4, seed: y | 0 }); } text(x, s, 578, y, { size: 23 }); });
          else if (!bd.ink) text(x, 'the cut edge, magnified', 572, LY + 6, { size: 23, a: 0.45 });
          x.restore();
        }
        function peelScene() {
          const dx = C[0] - F[0], dy = C[1] - F[1], L = Math.hypot(dx, dy), p = clamp(L / 240);
          const shadow = geo.rect(R.x, R.y, R.w, R.h, 3);
          x.save(); x.globalCompositeOperation = 'multiply'; Ink.hatchShadow(x, shadow, 1, 7, 7); x.restore();
          let stay = RECT, lift = null, flap = null;
          if (L > 3) { const d = [dx / L, dy / L], M = [(C[0] + F[0]) / 2, (C[1] + F[1]) / 2]; stay = clipHalf(RECT, M, d, -1); lift = clipHalf(RECT, M, d, 1); flap = lift.map((q) => { const k = (q[0] - M[0]) * d[0] + (q[1] - M[1]) * d[1]; return [q[0] - 2 * k * d[0], q[1] - 2 * k * d[1]]; }); }
          if (lift && lift.length > 2) { x.save(); path(x, lift); x.clip(); x.globalCompositeOperation = 'source-over'; bd.inner(x); x.restore(); }
          if (stay.length > 2) { x.save(); path(x, stay); x.clip(); x.globalCompositeOperation = 'source-over'; x.fillStyle = bd.top; x.fillRect(R.x, R.y, R.w, R.h); x.globalCompositeOperation = 'multiply'; bd.face(x); x.restore(); }
          x.save(); x.globalCompositeOperation = 'multiply'; Ink.stroke(x, RECT.concat([RECT[0]]), { w: 2.8, seed: 13 + n, amp: 0.5 }); x.restore();
          if (flap && flap.length > 2) {
            x.save(); x.globalCompositeOperation = 'multiply'; Ink.hatchShadow(x, flap, 1, 6, 8); x.restore();
            x.save(); x.globalCompositeOperation = 'source-over'; x.fillStyle = bd.under.replace(/[\d.]+\)$/, '1)'); path(x, flap); x.fill(); x.fillStyle = 'rgba(255,255,255,.35)'; x.fill();
            x.globalCompositeOperation = 'multiply'; Ink.stroke(x, flap.concat([flap[0]]), { w: 2.4, seed: 17, amp: 0.5 }); x.restore();
          }
          // red corner tab
          x.save(); x.globalCompositeOperation = 'multiply';
          Ink.stroke(x, geo.ellipse(F[0], F[1], 15, 15), { w: 3.2, color: RD, seed: 3, amp: 0.3 });
          if (!open && dragId === null) { text(x, 'peel', F[0] - 104, F[1] + 30, { size: 24, color: RD }); Ink.stroke(x, [[F[0] - 22, F[1] - 22], [F[0] - 70, F[1] - 66]], { w: 2.6, color: RD, retrace: false }); Ink.stroke(x, [[F[0] - 52, F[1] - 64], [F[0] - 70, F[1] - 66], [F[0] - 68, F[1] - 48]], { w: 2.6, color: RD, retrace: false }); }
          x.restore();
          return open ? 1 : clamp((p - 0.12) / 0.5);
        }
        // ink jet card: two pieces of card, ordinary (left) and ink jet (right); taps print dots
        const SW2 = (s) => 22 + s * 144, SWW = 132, SWH = 206;
        const INKLAB = [[['ink soaks in', LY - 30], ['and spreads out', LY], ['along the fibres', LY + 30]], [['a thin coating', LY - 30], ['ink dries on top:', LY], ['a small, crisp dot', LY + 30]]];
        function inkSect(xx, q, t) {
          const now = performance.now() / 1000, age = clamp((now - t0) / 1.2);
          if (lastSw === 0) { band(xx, LY - 30, LY + 70, CREAM); const r = H.rng(7); xx.strokeStyle = rgba(B, 0.3); xx.lineWidth = 1.2; for (let i = 0; i < 46; i++) { const fx = LX - LR + r() * LR * 2, fy = LY - 24 + r() * 88; xx.beginPath(); xx.moveTo(fx, fy); xx.lineTo(fx + r.range(14, 40), fy + r.range(-5, 5)); xx.stroke(); }
            hline(xx, LY - 30, 1, { w: 2.4 });
            const wd = 30 + 70 * age, dp = 70 * age; xx.fillStyle = rgba(CYAN, 0.6); xx.beginPath(); xx.moveTo(LX - wd, LY - 30); xx.quadraticCurveTo(LX - wd * 0.8, LY - 30 + dp, LX, LY - 30 + dp * 1.1); xx.quadraticCurveTo(LX + wd * 0.8, LY - 30 + dp, LX + wd, LY - 30); xx.fill();
            xx.fillStyle = rgba(CYAN, 0.75 * (1 - age)); xx.beginPath(); xx.ellipse(LX, LY - 34, 30, 14 * (1 - age) + 1, 0, Math.PI, 0); xx.fill(); }
          else { band(xx, LY - 22, LY + 70, CREAM); band(xx, LY - 30, LY - 22, '#fff'); hline(xx, LY - 30, 1, { w: 3.6 }); hline(xx, LY - 22, 1, { w: 1.4 });
            xx.fillStyle = rgba(CYAN, 0.8); xx.beginPath(); xx.ellipse(LX, LY - 32, 30, 16 - 9 * age, 0, Math.PI, 0); xx.fill(); }
        }
        function inkScene() {
          const now = performance.now() / 1000;
          ['ordinary', 'ink jet'].forEach((nm, s) => {
            const X0 = SW2(s), P = geo.rect(X0, R.y, SWW, SWH, 3);
            x.save(); x.globalCompositeOperation = 'multiply'; Ink.hatchShadow(x, P, 1, 6, 6); x.restore();
            x.save(); x.globalCompositeOperation = 'source-over'; x.fillStyle = s ? '#fff' : CREAM; path(x, P); x.fill();
            x.beginPath(); x.rect(X0, R.y, SWW, SWH); x.clip(); x.globalCompositeOperation = 'multiply';
            dots[s].forEach(([px, py, r0, born], i) => { const age = born ? clamp((now - born) / 1.2) : 1, rr = H.rng(i * 7 + 3);
              if (s === 0) { const rad = r0 * (1 + 1.1 * age); x.fillStyle = rgba(CYAN, 0.75 - 0.4 * age); x.beginPath(); for (let a = 0; a <= 24; a++) { const an = (a / 24) * 6.283, q = rad * (1 + (rr() - 0.5) * 0.7 * age); a ? x.lineTo(X0 + px + Math.cos(an) * q, R.y + py + Math.sin(an) * q) : x.moveTo(X0 + px + Math.cos(an) * q, R.y + py + Math.sin(an) * q); } x.fill(); }
              else { x.fillStyle = rgba(CYAN, 0.9); x.beginPath(); x.arc(X0 + px, R.y + py, r0 * 0.8, 0, 7); x.fill(); } });
            Ink.stroke(x, P, { w: 2.6, seed: 21 + s, amp: 0.5 }); x.restore();
            text(x, nm, X0 + SWW / 2, R.y + SWH + 30, { size: 22, align: 'center' });
            if (dots[s].length < 3) text(x, 'tap ×' + (3 - dots[s].length), X0 + SWW / 2, R.y + SWH / 2, { size: 24, align: 'center', color: RD });
          });
          return dots[0].length + dots[1].length ? 1 : 0;
        }
        const hidden = () => { const p = c.closest('.page'); return !p || p.classList.contains('hidden'); };
        function frame(now) {
          raf = 0; if (hidden()) return;
          const t = now / 1000;
          x.setTransform(dpr, 0, 0, dpr, 0, 0); x.globalCompositeOperation = 'source-over'; x.globalAlpha = 1; x.clearRect(0, 0, W, HH); x.lineCap = x.lineJoin = 'round';
          const q = bd.ink ? inkScene() : peelScene();
          lens(q, t - t0);
          // keep animating: the heat on the foil sample (for a while after opening), spreading ink dots
          if ((bd.anim && open && t - t0 < 14) || (bd.ink && t - t0 < 1.4)) go();
        }
        function go() { if (!raf) raf = requestAnimationFrame(frame); }

        if (bd.ink) {
          c.addEventListener('click', (e) => { const p = pos(e); for (let s = 0; s < 2; s++) if (p[0] >= SW2(s) && p[0] <= SW2(s) + SWW && p[1] >= R.y && p[1] <= R.y + SWH) { dots[s].push([p[0] - SW2(s), p[1] - R.y, 8 + (dots[s].length % 3) * 2, performance.now() / 1000]); lastSw = s; t0 = performance.now() / 1000; Book.sfx('tick', { gain: 0.5 }); if (dots[0].length >= 3 && dots[1].length >= 3) { const was = t0; setOpen(); t0 = was; } go(); } });
        } else {
          const near = (p) => Math.hypot(p[0] - F[0], p[1] - F[1]) < 64;
          c.addEventListener('touchstart', (e) => { if (near(pos(e.changedTouches[0]))) e.preventDefault(); }, { passive: false });
          c.addEventListener('pointerdown', (e) => { if (dragId !== null || !near(pos(e))) return; dragId = e.pointerId; try { c.setPointerCapture(dragId); } catch (er) {} Book.sfx('paper', { gain: 0.4 }); go(); });
          c.addEventListener('pointermove', (e) => { if (e.pointerId !== dragId) return; const p = pos(e); F = [clamp(p[0], R.x - 30, C[0]), clamp(p[1], R.y - 20, C[1])]; if (Math.hypot(C[0] - F[0], C[1] - F[1]) > 150) setOpen(); go(); });
          ['pointerup', 'pointercancel'].forEach((ev) => c.addEventListener(ev, (e) => { if (e.pointerId !== dragId) return; dragId = null; if (!open) F = C.slice(); go(); }));
          if (bd.anim) c.addEventListener('click', () => { if (open) { t0 = performance.now() / 1000 - 0.01; go(); } });
        }
        if (bd.anim && open) t0 = performance.now() / 1000;
        if (document.fonts) document.fonts.ready.then(go);
        if (window.IntersectionObserver) new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { if (bd.anim && open) t0 = performance.now() / 1000; go(); } })).observe(c);
        sync(); go();
      });

      // ------------------------------------------------------------------ products → board
      ui.el('h2', 'p06-h', 'Which board for which product?');
      ui.p('<span class="small">The samples and notes above blur while you sort: this one is from memory.</span>');
      const sort = ui.sort({
        id: 'p06.uses', label: 'Products sorted onto the right board (8)',
        q: 'Tap a product, then tap the board it is made from.',
        buckets: ['Corrugated card', 'Duplex board', 'Solid white board', 'Foil lined board', 'Foam core board', 'Ink jet card'],
        items: [
          { t: 'Box for posting a pair of trainers', b: 0, mis: 'board-mixup' },
          { t: 'Pizza delivery box', b: 0, mis: 'board-mixup' },
          { t: 'Cereal box', b: 1, mis: 'duplex-vs-solid' },
          { t: 'Perfume box, printed inside and out', b: 2, mis: 'duplex-vs-solid' },
          { t: 'Lid of a hot takeaway container', b: 3, mis: 'foil-purpose' },
          { t: 'Juice carton', b: 3, mis: 'foil-purpose' },
          { t: 'Architect\'s model of a house', b: 4, mis: 'board-mixup' },
          { t: 'A photograph printed at home', b: 5, mis: 'board-mixup' },
        ],
        explain: 'All sorted! Each board\'s structure suits its job.',
      });
      ui.hideWhile(sort, 'p06.uses', blurList);
    },
  });
})();
