// Page 4 — The five papers. A test desk with the five AQA papers side by side: marker (bleed), see-through,
// pencil (texture), close-up (surface) and weigh (gsm). A results table fills in as the student tests; then three
// conclusion questions, the notes, and a sort of eight design-studio jobs onto the right paper.
(function () {
  'use strict';
  const B = Ink.BLUE, RD = Ink.RED, rgba = Ink.rgba, geo = Ink.geo;
  const HANDF = (s) => `400 ${s}px "Gloria Hallelujah", "Comic Sans MS", cursive`;
  const LABF = (s) => `600 ${s}px Fredoka, "Arial Rounded MT Bold", system-ui, sans-serif`;
  const MARK = [226, 92, 30], GRAPH = [62, 62, 74];
  const W = 860, HH = 450, SW = 156, SH = 196, SY = 56;
  const SX = (i) => 16 + i * 168;

  // name, fill, see-through (0..1), marker spread, marker soak-through, gsm of this sample
  const PAPERS = [
    { k: 'layout', name: 'Layout', full: 'Layout paper', fill: 'rgba(255,255,255,0.72)', see: 0.42, spread: 0.3, soak: 0.5, gsm: 50 },
    { k: 'tracing', name: 'Tracing', full: 'Tracing paper', fill: 'rgba(212,223,232,0.55)', see: 0.92, spread: 0, soak: 0.35, streak: true, gsm: 90 },
    { k: 'bleed', name: 'Bleed proof', full: 'Bleed proof paper', fill: 'rgba(255,255,255,0.97)', see: 0.1, spread: 0, soak: 0, gsm: 70 },
    { k: 'cart', name: 'Cartridge', full: 'Cartridge paper', fill: 'rgba(247,241,224,1)', see: 0, spread: 0.7, soak: 0.1, gsm: 140 },
    { k: 'grid', name: 'Grid', full: 'Grid paper', fill: 'rgba(255,255,255,0.95)', see: 0.05, spread: 1, soak: 0.7, gsm: 80 },
  ];
  const TESTS = [
    { k: 'marker', name: 'Marker', col: 'Marker line', hint: 'Drag the <b>marker</b> across all five sheets. Then look at the backs.' },
    { k: 'see', name: 'See-through', col: 'Drawing underneath', hint: 'Drag the <b>drawing</b> (red handle) under each sheet. Can you still see it?' },
    { k: 'pencil', name: 'Pencil', col: 'Pencil shading', hint: 'Scribble some <b>pencil shading</b> on every sheet.' },
    { k: 'surface', name: 'Close-up', col: 'Surface', hint: 'Drag the <b>magnifier</b> over each sheet to see its surface.' },
    { k: 'weigh', name: 'Weigh', col: 'Weight', hint: 'Tap a sheet to put <b>1 m²</b> of that paper on the balance.' },
  ];
  const CELL = {
    marker: ['fuzzy edge, shows on back', 'streaky, seen through sheet', 'crisp edge, back clean', 'fuzzy, soaks into sheet', 'spreads, soaks through'],
    see: ['faint', 'clear', 'very faint', 'nothing', 'hardly'],
    pencil: ['smooth, even', 'smooth, even', 'smooth, even', 'dark, grainy', 'smooth, even'],
    surface: ['smooth', 'smooth, hard', 'very smooth', 'slightly rough', 'printed squares'],
    weigh: PAPERS.map((p) => p.gsm + ' gsm'),
  };

  function css() {
    if (document.getElementById('p04-css')) return;
    const s = document.createElement('style'); s.id = 'p04-css';
    s.textContent = `
      .p04-st { position: relative; margin: 0 0 calc(var(--R) * 1.4); padding: 14px 18px 16px; background: rgba(251,250,245,.9); }
      .p04-st .tag { font: 700 14px Fredoka; letter-spacing: .08em; text-transform: uppercase; color: var(--red); display: block; line-height: 20px; }
      .p04-tools { display: flex; flex-wrap: wrap; gap: 8px; margin: 6px 0 8px; position: relative; }
      .p04-tools .opt { flex: 1 1 96px; text-align: center; min-height: 48px; padding: 6px 6px; font-size: 18px; }
      .p04-tools .opt.done::after { content: ' \\2713'; color: var(--green); font-family: Fredoka; }
      .p04-hint { position: relative; font-size: 18px; line-height: 1.45; margin: 0 0 8px; min-height: 52px; }
      .p04-hint b { font-family: Fredoka; font-weight: 600; }
      .p04-cv { position: relative; display: block; width: 100%; height: auto; touch-action: pan-y; user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; cursor: pointer; }
      .p04-tbl { position: relative; width: 100%; border-collapse: collapse; margin: 10px 0 0; table-layout: fixed; }
      .p04-tbl th { font: 600 15px Fredoka; padding: 4px 4px; border-bottom: 2px solid rgba(30,46,150,.6); line-height: 1.2; vertical-align: bottom; }
      .p04-tbl th:first-child, .p04-tbl td:first-child { text-align: left; width: 17%; font: 600 15px Fredoka; }
      .p04-tbl td { font-size: 15.5px; line-height: 1.25; padding: 5px 4px; text-align: center; border-bottom: 1px dashed rgba(30,46,150,.3); height: 44px; }
      .p04-tbl td.q { color: rgba(30,46,150,.35); }
      .p04-tbl td.new { animation: p04pop .5s; }
      @keyframes p04pop { 0% { background: rgba(255,235,90,.9); transform: scale(1.12); } 100% { background: transparent; transform: none; } }
      .p04-wait { color: var(--red); font-size: 18px; }
      .p04-notes p { margin: 0 0 8px; line-height: 1.5; font-size: 18.5px; }
      @media (max-width: 760px) { .p04-tbl td { font-size: 13px; } .p04-tbl th, .p04-tbl th:first-child, .p04-tbl td:first-child { font-size: 13.5px; } .p04-st { padding: 12px 10px 14px; } }
    `;
    document.head.appendChild(s);
  }

  // interactive canvas with an on-demand render loop (stops when the page is hidden)
  function Stage(parent, w, h) {
    const c = document.createElement('canvas'); c.className = 'p04-cv'; parent.appendChild(c);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); c.style.aspectRatio = w + ' / ' + h;
    const ctx = c.getContext('2d');
    const S = { c, ctx, dpr, render: () => false };
    S.pos = (e) => { const r = c.getBoundingClientRect(); return [((e.clientX - r.left) * w) / r.width, ((e.clientY - r.top) * h) / r.height]; };
    S.layer = () => { const L = document.createElement('canvas'); L.width = c.width; L.height = c.height; const x = L.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.lineCap = x.lineJoin = 'round'; L.x = x; return L; };
    S.blit = (L, a = 1) => { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a; ctx.drawImage(L, 0, 0); ctx.restore(); };
    const hidden = () => { const p = c.closest('.page'); return !p || p.classList.contains('hidden'); };
    let raf = 0, wait = 0;
    const tick = (now) => {
      raf = 0;
      if (hidden()) { if (!wait) wait = setTimeout(() => { wait = 0; S.go(); }, 400); return; }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; ctx.clearRect(0, 0, w, h);
      ctx.lineCap = ctx.lineJoin = 'round';
      if (S.render(now / 1000)) raf = requestAnimationFrame(tick);
    };
    S.go = () => { if (!raf) raf = requestAnimationFrame(tick); };
    S.drag = (hit, on) => {
      let id = null;
      c.addEventListener('touchstart', (e) => { if (hit(S.pos(e.changedTouches[0]))) e.preventDefault(); }, { passive: false });
      c.addEventListener('pointerdown', (e) => { const p = S.pos(e); if (id !== null || !hit(p)) return; id = e.pointerId; try { c.setPointerCapture(id); } catch (er) {} on.start(p); S.go(); });
      c.addEventListener('pointermove', (e) => { if (e.pointerId !== id) return; on.move(S.pos(e)); S.go(); });
      ['pointerup', 'pointercancel'].forEach((ev) => c.addEventListener(ev, (e) => { if (e.pointerId !== id) return; id = null; on.end(); S.go(); }));
      S.dragging = () => id !== null;
    };
    if (document.fonts) document.fonts.ready.then(() => { S.onFonts && S.onFonts(); S.go(); });
    return S;
  }
  const text = (x, s, px, py, o = {}) => { x.save(); x.font = (o.font === 'hand' ? HANDF : LABF)(o.size || 22); x.fillStyle = rgba(o.color || B, o.a ?? 0.92); x.textAlign = o.align || 'left'; x.fillText(s, px, py); x.restore(); };
  const sheetAt = (p) => { for (let i = 0; i < 5; i++) if (p[0] >= SX(i) && p[0] <= SX(i) + SW && p[1] >= SY && p[1] <= SY + SH) return i; return -1; };
  const path = (x, P) => { x.beginPath(); P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); };

  Book.page({
    id: 'p04',
    title: 'The five papers',
    build(ui, root) {
      css();
      ui.h('The five papers');
      ui.p('A design studio keeps <b>five kinds of paper</b>. They look alike in the pad, but each is made for a different job. Put all five through the tests and fill in the results table.');

      // ------------------------------------------------------------------ the test desk
      const st = ui.el('div', 'p04-st'); requestAnimationFrame(() => Ink.frame(st));
      ui.el('span', 'tag', 'Test desk', st);
      const tools = ui.el('div', 'p04-tools', '', st), hint = ui.el('div', 'p04-hint', '', st);
      const S = Stage(st, W, HH);
      const rec = ui.record('p04.tests', { label: 'Paper test desk: tests carried out (5 tests × 5 papers)', type: 'experiment', max: 0 });
      const prev = rec.get() || {};
      const done = {}; TESTS.forEach((t) => (done[t.k] = new Set((prev.done && prev.done[t.k]) || [])));
      let mode = 'marker';

      // results table
      const tbl = ui.el('table', 'p04-tbl', '', st);
      tbl.innerHTML = '<tr><th>Paper</th>' + TESTS.map((t) => `<th>${t.col}</th>`).join('') + '</tr>' +
        PAPERS.map((p, i) => `<tr><td>${p.name}</td>` + TESTS.map((t) => `<td data-c="${t.k}-${i}" class="q">?</td>`).join('') + '</tr>').join('');
      const cell = (k, i) => tbl.querySelector(`[data-c="${k}-${i}"]`);
      const fillCell = (k, i, pop) => { const td = cell(k, i); td.textContent = CELL[k][i]; td.classList.remove('q'); if (pop) { td.classList.remove('new'); void td.offsetWidth; td.classList.add('new'); } };
      const btns = {};
      const refreshBtns = () => TESTS.forEach((t) => { btns[t.k].classList.toggle('sel', t.k === mode); btns[t.k].classList.toggle('done', done[t.k].size === 5); });
      let onProgress = () => {};
      const mark = (k, i) => {
        if (i < 0 || done[k].has(i)) return;
        done[k].add(i); fillCell(k, i, true); Book.sfx('pop', { gain: 0.4 });
        const full = TESTS.filter((t) => done[t.k].size === 5).length;
        const d = {}; TESTS.forEach((t) => (d[t.k] = [...done[t.k]]));
        rec.set({ answer: TESTS.map((t) => `${t.name} ${done[t.k].size}/5`).join(', '), correct: null, done: d });
        if (done[k].size === 5) { Book.sfx('success', { gain: 0.3 }); const nx = TESTS.find((t) => done[t.k].size < 5); hint.innerHTML = full === 5 ? '<span class="green">✓ All five tests done. Read your table, then answer the questions below.</span>' : `<span class="green">✓ ${TESTS.find((t) => t.k === k).name} test done.</span> Now try the <b>${nx.name}</b> test.`; }
        refreshBtns(); onProgress();
      };
      TESTS.forEach((t) => { const b = ui.el('button', 'opt', t.name, tools); b.type = 'button'; btns[t.k] = b; b.onclick = () => { mode = t.k; hint.innerHTML = t.hint; refreshBtns(); resetProps(); Book.sfx('tick', { gain: 0.5 }); S.go(); }; });
      TESTS.forEach((t) => done[t.k].forEach((i) => fillCell(t.k, i)));

      // ---- layers ----
      const base = S.layer(), mkCore = S.layer(), mkHalo = S.layer(), mkBack = S.layer(), pcSmooth = S.layer(), pcGrain = S.layer(), card = S.layer();
      function paintBase() {
        const x = base.x; x.clearRect(0, 0, W, HH);
        PAPERS.forEach((p, i) => {
          const X = SX(i), R = geo.rect(X, SY, SW, SH, 5);
          x.globalCompositeOperation = 'source-over';
          Ink.hatchShadow(x, R, 1, p.k === 'cart' ? 9 : 5, p.k === 'cart' ? 9 : 5);
          x.fillStyle = p.fill; path(x, R); x.fill();
          x.globalCompositeOperation = 'multiply';
          if (p.k === 'grid') { x.strokeStyle = rgba(B, 0.2); x.lineWidth = 1; x.beginPath(); for (let g = 13; g < SW; g += 13) { x.moveTo(X + g, SY + 3); x.lineTo(X + g, SY + SH - 3); } for (let g = 13; g < SH; g += 13) { x.moveTo(X + 3, SY + g); x.lineTo(X + SW - 3, SY + g); } x.stroke(); }
          if (p.k === 'cart') { const r = H.rng(5); x.fillStyle = rgba(B, 0.13); for (let n = 0; n < 420; n++) { x.beginPath(); x.arc(X + 4 + r() * (SW - 8), SY + 4 + r() * (SH - 8), 0.9, 0, 7); x.fill(); } Ink.stroke(x, [[X + 3, SY + SH + 4], [X + SW + 3, SY + SH + 4]], { w: 1.6, seed: 3, retrace: false }); }
          if (p.k === 'tracing') { x.strokeStyle = rgba(B, 0.25); x.lineWidth = 1.4; x.beginPath(); x.moveTo(X + 16, SY + 40); x.lineTo(X + 40, SY + 14); x.moveTo(X + 22, SY + 54); x.lineTo(X + 56, SY + 16); x.stroke(); }
          Ink.stroke(x, R, { w: p.k === 'cart' ? 3 : 2.2, seed: 11 + i * 5, amp: 0.5 });
          text(x, p.name, X + SW / 2, SY - 16, { size: 23, align: 'center' });
        });
      }
      // the drawing that goes under the sheets (a bold logo)
      const CARD = 124;
      function paintCard() {
        const x = card.x; x.clearRect(0, 0, W, HH); x.globalCompositeOperation = 'multiply';
        const c0 = CARD / 2;
        Ink.stroke(x, geo.ellipse(c0, c0, 54, 54), { w: 4.5, seed: 4 });
        const star = []; for (let n = 0; n <= 10; n++) { const a = -Math.PI / 2 + (n * Math.PI) / 5, r = n % 2 ? 19 : 44; star.push([c0 + Math.cos(a) * r, c0 + Math.sin(a) * r]); }
        Ink.hatchFill(x, star, 1, B, 2.2); Ink.stroke(x, star, { w: 4.5, seed: 9, amp: 0.4 });
      }
      paintBase(); paintCard();
      S.onFonts = paintBase;

      // ---- moving things ----
      const HOME = [430, 366];
      let obj = HOME.slice(), tool = null, fly = null, shown = -1, last = null;
      const lens = { r: 74 };
      function resetProps() { obj = HOME.slice(); tool = null; fly = null; }

      // marker + pencil strokes are painted into layers as the finger moves
      const mkLen = [0, 0, 0, 0, 0], pcLen = [0, 0, 0, 0, 0];
      let seedN = 1;
      function clipSheet(x, i) { x.save(); x.beginPath(); x.rect(SX(i) + 2, SY + 2, SW - 4, SH - 4); x.clip(); }
      function seg(x, a, b, w, col) { x.strokeStyle = col; x.lineWidth = w; x.beginPath(); x.moveTo(a[0], a[1]); x.lineTo(b[0], b[1]); x.stroke(); }
      function markerSeg(a, b) {
        const L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 0.5) return;
        const nx = -(b[1] - a[1]) / L, ny = (b[0] - a[0]) / L, r = H.rng(seedN++);
        PAPERS.forEach((p, i) => {
          if (Math.max(a[0], b[0]) < SX(i) - 30 || Math.min(a[0], b[0]) > SX(i) + SW + 30) return;
          clipSheet(mkCore.x, i); seg(mkCore.x, a, b, 14, rgba(MARK, 1));
          if (p.streak) { mkCore.x.globalCompositeOperation = 'destination-out'; [-4, 1, 5].forEach((o) => seg(mkCore.x, [a[0] + nx * o, a[1] + ny * o], [b[0] + nx * o, b[1] + ny * o], 1.6, 'rgba(0,0,0,.75)')); mkCore.x.globalCompositeOperation = 'source-over'; }
          if (p.spread) {
            // feathering: fine hairs of ink creeping out along the fibres
            for (let d = 0; d < L; d += 2.2) {
              if (!r.chance(0.55)) continue;
              const px = a[0] + ((b[0] - a[0]) * d) / L, py = a[1] + ((b[1] - a[1]) * d) / L, sg = r.chance(0.5) ? 1 : -1, len = 7 + r() * 24 * p.spread, sk = r.range(-0.5, 0.5);
              seg(mkCore.x, [px + nx * sg * 5, py + ny * sg * 5], [px + nx * sg * (7 + len) + ny * sk * len, py + ny * sg * (7 + len) - nx * sk * len], 1 + r() * 1.6 * p.spread, rgba(MARK, 0.75));
            }
          }
          mkCore.x.restore();
          if (p.spread) { clipSheet(mkHalo.x, i); seg(mkHalo.x, a, b, 14 + 26 * p.spread, rgba(MARK, 1)); mkHalo.x.restore(); }
          // the back of the sheet: mirrored, in a thumbnail under the sheet
          if (p.soak) {
            const x = mkBack.x, k = BK, cx = SX(i) + SW / 2;
            x.save(); x.beginPath(); x.rect(cx - (SW * k) / 2 + 1, BY + 1, SW * k - 2, SH * k - 2); x.clip();
            x.translate(cx, BY); x.scale(-k, k); x.translate(-cx, -SY);
            seg(x, a, b, 14 + 20 * p.spread, rgba(MARK, 1)); x.restore();
          }
          const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
          if (sheetAt(m) === i) { mkLen[i] += L; if (mkLen[i] > 70) mark('marker', i); }
        });
      }
      function pencilSeg(a, b) {
        const L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 0.5) return;
        const nx = -(b[1] - a[1]) / L, ny = (b[0] - a[0]) / L, r = H.rng(seedN++);
        PAPERS.forEach((p, i) => {
          if (Math.max(a[0], b[0]) < SX(i) - 20 || Math.min(a[0], b[0]) > SX(i) + SW + 20) return;
          if (p.k === 'cart') {
            // the tooth of the paper catches the graphite: a broken, grainy, darker mark
            const x = pcGrain.x; clipSheet(x, i); x.fillStyle = rgba(GRAPH, 1);
            for (let d = 0; d < L; d += 1.1) { const px = a[0] + ((b[0] - a[0]) * d) / L, py = a[1] + ((b[1] - a[1]) * d) / L; for (let n = 0; n < 3; n++) { const o = r.range(-8, 8); x.beginPath(); x.arc(px + nx * o + r.range(-1, 1), py + ny * o + r.range(-1, 1), 0.8 + r() * 1.5, 0, 7); x.fill(); } }
            x.restore();
          } else { clipSheet(pcSmooth.x, i); seg(pcSmooth.x, a, b, 8, rgba(GRAPH, 1)); pcSmooth.x.restore(); }
          const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
          if (sheetAt(m) === i) { pcLen[i] += L; if (pcLen[i] > 110) mark('pencil', i); }
        });
      }
      const BK = 0.56, BY = 322;

      S.drag((p) => {
        if (mode === 'marker' || mode === 'pencil') return p[1] > SY - 6 && p[1] < SY + SH + 8;
        if (mode === 'see' || mode === 'surface') return Math.hypot(p[0] - obj[0], p[1] - obj[1]) < 92;
        return false;
      }, {
        start(p) { last = p; tool = p; if (mode === 'marker' || mode === 'pencil') Book.sfx('stroke', { material: 'pen', dur: 0.3, gain: 0.4 }); },
        move(p) {
          if (mode === 'marker') { markerSeg(last, p); tool = p; }
          else if (mode === 'pencil') { pencilSeg(last, p); tool = p; }
          else { obj = [Math.max(50, Math.min(W - 50, obj[0] + p[0] - last[0])), Math.max(SY + 40, Math.min(HH - 60, obj[1] + p[1] - last[1]))]; const i = sheetAt(obj); if (i >= 0) mark(mode, i); }
          last = p;
        },
        end() { tool = null; },
      });
      S.c.addEventListener('click', (e) => {
        if (mode !== 'weigh' || fly) return;
        const i = sheetAt(S.pos(e)); if (i < 0) return;
        fly = { i, t0: performance.now() / 1000 }; shown = -1; Book.sfx('paper', { gain: 0.5 }); S.go();
      });

      // ---- drawing helpers for the props ----
      function drawTool(x, p, kind) {
        x.save(); x.globalCompositeOperation = 'source-over'; x.translate(p[0], p[1]); x.rotate(-0.9);
        if (kind === 'marker') { x.fillStyle = rgba(MARK, 1); x.fillRect(-2, -6, 16, 12); x.fillStyle = '#2b2f3a'; x.beginPath(); x.roundRect(14, -12, 120, 24, 6); x.fill(); x.fillStyle = rgba(MARK, 1); x.fillRect(108, -12, 14, 24); }
        else { x.fillStyle = '#3e3e4a'; x.beginPath(); x.moveTo(0, 0); x.lineTo(10, -3.5); x.lineTo(10, 3.5); x.fill(); x.fillStyle = '#e9c98f'; x.beginPath(); x.moveTo(10, -3.5); x.lineTo(26, -8); x.lineTo(26, 8); x.lineTo(10, 3.5); x.fill(); x.fillStyle = '#e0b020'; x.fillRect(26, -8, 120, 16); x.fillStyle = 'rgba(0,0,0,.15)'; x.fillRect(26, 2, 120, 6); }
        x.restore();
      }
      function drawLens(x, p) {
        const i = sheetAt(p), r = lens.r;
        x.save(); x.globalCompositeOperation = 'source-over';
        x.beginPath(); x.arc(p[0], p[1], r, 0, 7); x.fillStyle = i < 0 ? 'rgba(251,250,245,.75)' : i === 3 ? '#f7f1e0' : i === 1 ? '#e6edf2' : '#ffffff'; x.fill(); x.clip();
        x.globalCompositeOperation = 'multiply';
        const rr = H.rng(31 + i * 7);
        if (i === 0) { x.strokeStyle = rgba(B, 0.22); x.lineWidth = 1.2; for (let n = 0; n < 7; n++) { const y = p[1] - r + rr() * 2 * r, x0 = p[0] - r + rr() * r; x.beginPath(); x.moveTo(x0, y); x.quadraticCurveTo(x0 + 30, y + rr.range(-12, 12), x0 + 60 + rr() * 40, y + rr.range(-6, 6)); x.stroke(); } }
        if (i === 1) { x.strokeStyle = rgba(B, 0.35); x.lineWidth = 3; x.beginPath(); x.moveTo(p[0] - 40, p[1] - 6); x.lineTo(p[0] - 8, p[1] - 44); x.moveTo(p[0] - 30, p[1] + 14); x.lineTo(p[0] + 12, p[1] - 38); x.stroke(); }
        if (i === 2) { x.strokeStyle = rgba(B, 0.12); x.lineWidth = 9; x.beginPath(); x.moveTo(p[0] - 70, p[1] + 30); x.lineTo(p[0] + 30, p[1] - 70); x.stroke(); }
        if (i === 3) { x.strokeStyle = rgba(B, 0.55); x.lineWidth = 1.6; for (let n = 0; n < 90; n++) { const a = rr() * 7, d = Math.sqrt(rr()) * r, cx = p[0] + Math.cos(a) * d, cy = p[1] + Math.sin(a) * d, s = 4 + rr() * 6; x.beginPath(); x.arc(cx, cy, s, Math.PI * 1.1, Math.PI * 1.9); x.stroke(); x.fillStyle = rgba(B, 0.14); x.beginPath(); x.ellipse(cx + 2, cy + 2, s, s * 0.5, 0, 0, Math.PI); x.fill(); } }
        if (i === 4) { x.strokeStyle = rgba(B, 0.5); x.lineWidth = 1.8; x.beginPath(); for (let g = -3; g <= 3; g++) { const o = g * 36 - ((p[0] * 2.7) % 36) + 18; x.moveTo(p[0] + o, p[1] - r); x.lineTo(p[0] + o, p[1] + r); const o2 = g * 36 - ((p[1] * 2.7) % 36) + 18; x.moveTo(p[0] - r, p[1] + o2); x.lineTo(p[0] + r, p[1] + o2); } x.stroke(); }
        x.restore();
        x.save(); x.globalCompositeOperation = 'multiply';
        Ink.stroke(x, geo.ellipse(p[0], p[1], r, r), { w: 4.2, seed: 5, amp: 0.3 });
        Ink.stroke(x, geo.ellipse(p[0], p[1], r + 6, r + 6), { w: 2, seed: 8, amp: 0.3, retrace: false });
        const hx = p[0] + (r + 6) * 0.71, hy = p[1] + (r + 6) * 0.71, HP = [[hx - 7, hy + 7], [hx + 7, hy - 7], [hx + 50, hy + 36], [hx + 36, hy + 50], [hx - 7, hy + 7]];
        Ink.hatchFill(x, HP, 1, B, 2); Ink.stroke(x, HP, { w: 2.4, seed: 6, amp: 0.3 });
        x.restore();
      }
      function drawScale(x, now) {
        const cx = 430, py = 352;
        x.save(); x.globalCompositeOperation = 'multiply';
        const body = [[cx - 150, 438], [cx - 130, 386], [cx + 130, 386], [cx + 150, 438], [cx - 150, 438]];
        Ink.hatchShadow(x, body, 1, 6, 6); Ink.stroke(x, body, { w: 2.6, seed: 14 });
        const pan = [[cx - 170, py + 4], [cx + 170, py + 4], [cx + 150, py + 20], [cx - 150, py + 20], [cx - 170, py + 4]];
        Ink.hatchFill(x, pan, 1, B, 1.3); Ink.stroke(x, pan, { w: 2.6, seed: 15 });
        Ink.stroke(x, [[cx - 14, py + 20], [cx - 14, 386]], { w: 2, seed: 16, retrace: false }); Ink.stroke(x, [[cx + 14, py + 20], [cx + 14, 386]], { w: 2, seed: 17, retrace: false });
        Ink.stroke(x, geo.rect(cx - 74, 394, 148, 38, 5), { w: 2.2, seed: 18 });
        x.restore();
        let i = shown, u = 1;
        if (fly) { u = Math.min(1, (now - fly.t0) / 0.55); i = fly.i; }
        if (i >= 0) {
          const e = u * u * (3 - 2 * u), x0 = SX(i) + SW / 2, y0 = SY + SH / 2, px = x0 + (cx - x0) * e, pyy = y0 + (py - 10 - y0) * e - Math.sin(e * Math.PI) * 30, sw = SW * (1 - 0.1 * e), sh = SH * (1 - 0.86 * e);
          x.save(); x.globalCompositeOperation = 'source-over'; x.fillStyle = i === 3 ? '#f7f1e0' : i === 1 ? 'rgba(214,224,232,.9)' : '#fff'; x.fillRect(px - sw / 2, pyy - sh / 2, sw, sh);
          x.globalCompositeOperation = 'multiply'; Ink.stroke(x, geo.rect(px - sw / 2, pyy - sh / 2, sw, sh, 3), { w: 2.2, seed: 20 + i, amp: 0.4 }); x.restore();
          if (u >= 1) {
            if (fly) { fly = null; shown = i; Book.sfx('thud', { gain: 0.35 }); mark('weigh', i); }
            text(x, PAPERS[i].gsm + ' g', cx, 424, { size: 30, align: 'center', color: RD });
            text(x, '1 m² of ' + PAPERS[i].full.toLowerCase(), cx + 170, 420, { size: 22, font: 'hand' });
          }
        } else text(x, '0 g', cx, 424, { size: 30, align: 'center', a: 0.5 });
        return !!fly;
      }

      S.render = (now) => {
        const x = S.ctx; let again = false;
        S.blit(base);
        if (mode === 'marker') {
          S.blit(mkHalo, 0.28); S.blit(mkCore, 0.86);
          text(x, 'the back of each sheet:', 16, 302, { size: 22, font: 'hand' });
          PAPERS.forEach((p, i) => { const cx = SX(i) + SW / 2, R = geo.rect(cx - (SW * BK) / 2, BY, SW * BK, SH * BK, 4); x.fillStyle = p.fill; path(x, R); x.fill(); });
          // each back shows the ink at its own strength
          PAPERS.forEach((p, i) => { if (!p.soak) return; x.save(); x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = p.soak; const d = S.dpr, cx = SX(i) + SW / 2, bx = (cx - (SW * BK) / 2) * d, bw = SW * BK * d; x.drawImage(mkBack, bx, BY * d, bw, SH * BK * d, bx, BY * d, bw, SH * BK * d); x.restore(); });
          x.save(); x.globalCompositeOperation = 'multiply'; PAPERS.forEach((p, i) => { const cx = SX(i) + SW / 2; Ink.stroke(x, geo.rect(cx - (SW * BK) / 2, BY, SW * BK, SH * BK, 4), { w: 2, seed: 40 + i, amp: 0.4, retrace: false }); }); x.restore();
          if (tool) drawTool(x, tool, 'marker'); else if (!mkLen.some((v) => v > 0)) drawTool(x, [60, SY + SH / 2 + 10], 'marker');
        } else if (mode === 'pencil') {
          S.blit(pcSmooth, 0.5); S.blit(pcGrain, 0.92);
          if (tool) drawTool(x, tool, 'pencil'); else if (!pcLen.some((v) => v > 0)) drawTool(x, [60, SY + SH / 2 + 10], 'pencil');
          text(x, 'shade on all five: which one grips?', 430, 370, { size: 24, font: 'hand', align: 'center', a: 0.75 });
        } else if (mode === 'see') {
          // the drawing is seen in full on the desk, and at each paper's own strength through a sheet
          const d = S.dpr, ox = obj[0] - CARD / 2, oy = obj[1] - CARD / 2;
          const put = (a, clip) => { x.save(); if (clip) { x.beginPath(); clip(); x.clip('evenodd'); } x.globalAlpha = a; x.globalCompositeOperation = 'multiply'; x.drawImage(card, 0, 0, CARD * d, CARD * d, ox, oy, CARD, CARD); x.restore(); };
          put(1, () => { x.rect(0, 0, W, HH); PAPERS.forEach((p, i) => x.rect(SX(i), SY, SW, SH)); });
          PAPERS.forEach((p, i) => { if (p.see > 0) put(p.see, () => x.rect(SX(i), SY, SW, SH)); });
          // red drag handle so the drawing can always be found
          x.save(); x.globalCompositeOperation = 'multiply'; Ink.stroke(x, geo.ellipse(obj[0], obj[1] + 84, 15, 15), { w: 3, color: RD, seed: 3, amp: 0.3 }); Ink.stroke(x, [[obj[0], obj[1] + 68], [obj[0], obj[1] + 58]], { w: 2.4, color: RD, retrace: false }); x.restore();
          if (!done.see.size && !(S.dragging && S.dragging())) text(x, 'drag me up, under the sheets', obj[0] + 80, obj[1] + 10, { size: 24, font: 'hand', color: RD });
        } else if (mode === 'surface') {
          drawLens(x, obj);
          if (!done.surface.size && !(S.dragging && S.dragging())) text(x, 'drag me over a sheet', obj[0] + 130, obj[1] + 8, { size: 24, font: 'hand', color: RD });
        } else if (mode === 'weigh') { again = drawScale(x, now); }
        return again;
      };
      hint.innerHTML = TESTS[0].hint; refreshBtns(); S.go();

      // ------------------------------------------------------------------ conclusions
      ui.el('h2', '', 'What do your results show?');
      const wait = ui.p('Finish the <b>Marker</b>, <b>See-through</b> and <b>Pencil</b> tests to unlock these questions.', 'p04-wait');
      const qs = [
        ui.mcq({
          id: 'p04.marker', label: 'Conclusion: what bleed proof means',
          q: 'Look at your marker results. What does <b>bleed proof</b> mean?',
          options: [
            { t: 'A coating keeps marker ink on the surface, so it cannot spread or soak through', ok: true },
            { t: 'The paper is extra thick, so marker ink soaks deep in and cannot reach the back', mis: 'bleed-meaning', why: 'Bleed proof paper is thin (about 70 gsm). It is a special coating that stops the ink spreading, not thickness.' },
            { t: 'The paper is waterproof, so marker ink can be wiped off its surface afterwards', mis: 'bleed-meaning', why: 'The ink still dries on the paper. "Bleed" means ink spreading out or soaking through, and this paper stops that.' },
            { t: 'The ink soaks evenly through the sheet, so the drawing shows on both of its sides', mis: 'bleed-meaning', why: 'That is bleeding! In your test the back of the bleed proof sheet stayed clean.' },
          ],
          explain: 'Bleed proof paper is coated so marker ink stays on the surface: crisp edges and a clean back. Designers use it for marker rendering.',
        }),
        ui.mcq({
          id: 'p04.trace', label: 'Conclusion: layout paper vs tracing paper',
          q: 'You could see the drawing through two of the papers. What is the difference between them?',
          options: [
            { t: 'Tracing paper is transparent (a clear view); layout paper is translucent (a fainter view)', ok: true },
            { t: 'Layout paper is transparent (a clear view); tracing paper is translucent (a fainter view)', mis: 'layout-vs-tracing', why: 'Other way round: in your test the drawing was clearest through the tracing paper.' },
            { t: 'They are the same paper: "layout" is only the name for bigger sheets of tracing paper', mis: 'layout-vs-tracing', why: 'They are two different papers, and in your test the drawing did not look the same through both.' },
            { t: 'Tracing paper is thick and opaque (no view); layout paper is the only see-through one', mis: 'layout-vs-tracing', why: 'Look at your table again: tracing paper gave the clearest view of all.' },
          ],
          explain: 'Tracing paper is transparent, so it is used for copying drawings exactly. Layout paper is translucent and cheap, so it is used for sketching and developing ideas.',
        }),
        ui.mcq({
          id: 'p04.sketch', label: 'Conclusion: paper for pencil, pastel and watercolour',
          q: 'Which paper is best for pencil, crayon, pastel and watercolour drawings, and why?',
          options: [
            { t: 'Cartridge paper: thick, with a slightly textured surface that grips the pencil', ok: true },
            { t: 'Bleed proof paper: thick, with a rough coated surface that grips the pencil', mis: 'paper-mixup', why: 'Bleed proof paper is thin and smooth: it is made for markers. Which sheet shaded dark and grainy?' },
            { t: 'Tracing paper: thin, with a hard smooth surface that the pencil slides across', mis: 'paper-mixup', why: 'Hard and smooth suits tracing, but pastel and paint need a thicker, textured sheet.' },
            { t: 'Layout paper: thin, with a cheap smooth surface that soaks up the wet paint', mis: 'paper-mixup', why: 'Layout paper is for quick sketches. Which sheet was the heaviest and gripped the pencil?' },
          ],
          explain: 'Cartridge paper is thick, opaque and slightly textured, so it grips pencil, crayon, pastel, ink and watercolour.',
        }),
      ];

      // ------------------------------------------------------------------ notes (after the conclusions)
      const notes = ui.box(`<div class="p04-notes">
        <p><span class="key">Layout paper</span> (about 50 gsm): thin, lightweight, smooth, <b>translucent</b> and cheap. For sketching and developing ideas; you can trace through it to refine a design.</p>
        <p><span class="key">Tracing paper</span> (about 60–90 gsm): thin, <b>transparent</b>, hard, smooth and strong. For copying and tracing drawings, and overlays.</p>
        <p><span class="key">Bleed proof paper</span> (about 70 gsm): smooth, hard and <b>coated so marker ink stays on the surface</b>: it does not spread (bleed) or soak through. For marker rendering and presentation drawings.</p>
        <p><span class="key">Cartridge paper</span> (about 120–150 gsm): thick, good quality, opaque, with a <b>slightly textured</b> surface that grips pencil, crayon, pastel, ink and watercolour. For drawing, sketching and painting.</p>
        <p><span class="key">Grid paper</span> (about 80 gsm): printed with a faint grid of <b>squares or isometric</b> lines as a guide. For scale and working drawings, isometric (3D) sketches, graphs and nets.</p></div>`, { tag: 'Notes: the five papers' });
      const item = (id) => Book.state.items[id];
      const concOK = () => ['p04.marker', 'p04.trace', 'p04.sketch'].every((id) => item(id) && item(id).correct === true);
      const testsOK = () => ['marker', 'see', 'pencil'].every((k) => done[k].size === 5);
      const sync = () => {
        const t = testsOK() || qs.some((q) => item(q.dataset.id));
        wait.style.display = t ? 'none' : ''; qs.forEach((q) => q.classList.toggle('peek-lock', !t));
        notes.classList.toggle('peek-lock', !concOK());
      };
      onProgress = sync; sync();
      qs.forEach((q) => q.addEventListener('click', () => setTimeout(sync, 60)));
      ui.p('<span class="small">The notes un-blur when all three questions are right. Read them carefully: they blur again while you do the last activity.</span>');

      // ------------------------------------------------------------------ jobs → paper
      const sort = ui.sort({
        id: 'p04.uses', label: 'Design-studio jobs sorted onto the right paper (8)',
        q: '<b>Which paper for which job?</b> Tap a job, then tap the paper you would use.',
        buckets: ['Layout', 'Tracing', 'Bleed proof', 'Cartridge', 'Grid'],
        items: [
          { t: 'Sketching lots of quick first ideas, cheaply', b: 0, mis: 'paper-mixup' },
          { t: 'Making an exact copy of a drawing', b: 1, mis: 'layout-vs-tracing' },
          { t: 'A clear overlay sheet on top of a drawing', b: 1, mis: 'layout-vs-tracing' },
          { t: 'Colouring a final design with marker pens', b: 2, mis: 'bleed-meaning' },
          { t: 'A watercolour painting of the product', b: 3, mis: 'paper-mixup' },
          { t: 'A pastel and crayon drawing', b: 3, mis: 'paper-mixup' },
          { t: 'An isometric (3D) sketch using guide lines', b: 4, mis: 'paper-mixup' },
          { t: 'A scale drawing of the net for a box', b: 4, mis: 'paper-mixup' },
        ],
        explain: 'All sorted! Each paper is made for its job.',
      });
      ui.hideWhile(sort, 'p04.uses', [notes, st, ...qs]);
    },
  });
})();
