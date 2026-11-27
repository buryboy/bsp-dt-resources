// Page 5 — Alloys: mixing metals. (1) Push the layers of atoms in a pure metal and in an alloy (predict -> push ->
// conclude). (2) The alloy kitchen: choose ingredients from the shelf, melt and pour to fill three orders (brass,
// stainless steel, high speed steel); the recipe card only appears after a correct mix. (3) Recall questions.
(function () {
  'use strict';
  const B = Ink.BLUE, RD = Ink.RED, GR = Ink.GREEN, rgba = Ink.rgba, geo = Ink.geo;
  const LABF = (s) => `600 ${s}px Fredoka, "Arial Rounded MT Bold", system-ui, sans-serif`;
  const HANDF = (s) => `400 ${s}px "Gloria Hallelujah", "Comic Sans MS", cursive`;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = (t) => t * t * (3 - 2 * t);
  const PAPER = 'rgba(251,250,245,.97)';
  const W = 860;

  if (!document.getElementById('ma5-css')) {
    const s = document.createElement('style'); s.id = 'ma5-css';
    s.textContent = `
      .ma5-lab { position: relative; margin: 0 0 calc(var(--R) * 1); padding: 12px 16px 16px; background: rgba(251,250,245,.9); }
      .ma5-lab > * { position: relative; }
      .ma5-step { font: 700 14px Fredoka, system-ui; letter-spacing: .08em; text-transform: uppercase; color: var(--red); line-height: 22px; }
      .ma5-task { font-size: 19px; line-height: 1.5; margin: 0 0 8px; }
      .ma5-task b, .ma5-q b, .ma5-status b { font-family: Fredoka, system-ui; font-weight: 600; }
      .ma5-q { font-size: 19px; line-height: 1.5; margin: 6px 0 8px; }
      .ma5-btns { display: flex; flex-wrap: wrap; gap: 10px; align-items: stretch; margin: 0 0 8px; }
      .ma5-btns .opt { flex: 1 1 150px; text-align: center; min-height: 52px; }
      .ma5-btns .btn { margin-top: 0; min-height: 50px; }
      .ma5-tabs .opt.done { border-color: var(--green); }
      .ma5-cv { display: block; width: 100%; height: auto; touch-action: pan-y; user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; cursor: pointer; }
      .ma5-status { font-size: 17px; line-height: 1.5; min-height: 26px; margin: 2px 0 6px; }
      .ma5-conc { display: none; margin-top: 6px; padding-top: 6px; border-top: 2px dashed rgba(30,46,150,.3); }
      .ma5-conc.on { display: block; }
      .ma5-locked { font-size: 17px; opacity: .75; margin: 0; }
      .ma5-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 10px 18px; }
      .ma5-cards > div { font-size: 17px; line-height: 1.5; }
      .ma5-cards h4 { font: 700 20px Fredoka, system-ui; margin: 0; color: var(--ink); }
      .ma5-cards i { font-style: normal; color: var(--red); font-family: Fredoka, system-ui; font-weight: 600; }
      .ma5-cards .rec { font-family: Fredoka, system-ui; font-weight: 600; }
    `;
    document.head.appendChild(s);
  }

  // ---------- small drawing helpers ----------
  function text(x, s, px, py, o = {}) {
    x.save(); x.font = (o.font === 'hand' ? HANDF : LABF)(o.size || 22);
    x.fillStyle = rgba(o.color || B, o.a ?? 0.92); x.textAlign = o.align || 'left'; x.textBaseline = 'alphabetic';
    x.translate(px, py); if (o.rot) x.rotate(o.rot); x.fillText(s, 0, 0); x.restore();
  }
  const path = (x, pts) => { x.beginPath(); pts.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.closePath(); };
  function paper(x, pts, style = PAPER) { x.save(); x.globalCompositeOperation = 'source-over'; x.fillStyle = style; path(x, pts); x.fill(); x.restore(); }
  function wash(x, pts, style) { x.save(); x.fillStyle = style; path(x, pts); x.fill(); x.restore(); }

  function Stage(parent, HH) {
    const c = document.createElement('canvas'); c.className = 'ma5-cv'; parent.appendChild(c);
    const dpr = Math.min(2, window.devicePixelRatio || 1); c.width = W * dpr; c.height = HH * dpr; c.style.aspectRatio = W + ' / ' + HH;
    const ctx = c.getContext('2d'), st = { c, time: 0, paint: null, draw: null };
    let staticL = null, raf = 0, last = 0;
    st.repaint = () => { staticL = document.createElement('canvas'); staticL.width = W * dpr; staticL.height = HH * dpr; const x = staticL.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.lineCap = x.lineJoin = 'round'; st.paint(x); };
    st.render = (dt) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, HH); ctx.globalCompositeOperation = 'multiply'; ctx.lineCap = ctx.lineJoin = 'round';
      ctx.drawImage(staticL, 0, 0, W, HH);
      return st.draw(ctx, st.time, dt || 0);
    };
    const hidden = () => { const p = c.closest('.page'); return !p || p.classList.contains('hidden'); };
    function frame(now) {
      raf = 0; if (hidden()) return;
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016); last = now; st.time += dt;
      if (st.render(dt)) raf = requestAnimationFrame(frame);
    }
    st.go = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } };
    st.pos = (e) => { const r = c.getBoundingClientRect(); return [((e.clientX - r.left) * W) / r.width, ((e.clientY - r.top) * HH) / r.height]; };
    st.init = () => { st.repaint(); st.render(0); if (document.fonts) document.fonts.ready.then(() => { st.repaint(); st.render(0); }); };
    return st;
  }

  // ======================================================================================
  // 1. push the layers: a pure metal block and an alloy block, drawn as rows of atoms
  // ======================================================================================
  function Layers(ui, onDone) {
    const el = ui.el, r = ui.record('p05.layers', { label: 'Push the layers of atoms: pure metal vs alloy', type: 'experiment', max: 1 });
    const lab = el('div', 'ma5-lab'); requestAnimationFrame(() => Ink.frame(lab, { shadow: false, w: 2.2 }));
    el('div', 'ma5-step', 'Up close · atoms in layers', lab);
    el('p', 'ma5-task', 'Zoom right in on two blocks of metal. The atoms sit in neat <b>layers</b>. The bottom layers are held still: you push the top ones sideways.', lab);
    el('div', 'ma5-q', '<b>Predict first.</b> Which block’s layers will slide more easily?', lab);
    const predRow = el('div', 'ma5-btns', '', lab);
    const prev = r.get() || {};
    const S = { live: !!prev.pred, pred: prev.pred || null, drag: null, locked: false, slid: false, jam: false, s: 0, base: 0, j: 0, jt: -9 };
    const HH = 300, stg = Stage(lab, HH), c = stg.c;
    const status = el('div', 'ma5-status', '', lab);
    const conc = el('div', 'ma5-conc', '<div class="ma5-q"><b>What did you find?</b> Mixing in atoms of a different size makes a metal…</div>', lab), concRow = el('div', 'ma5-btns', '', conc), fb = el('div', 'fb', '', conc);
    const say = () => { status.innerHTML = S.slid && S.jam ? 'You have pushed both.' : S.slid ? 'Now push the top layers of the <b>other</b> block.' : S.jam ? 'Now push the top layers of the <b>other</b> block.' : '👉 <b>Drag the top layers sideways</b> with your finger. Try both blocks.'; };
    say(); if (!S.live) status.style.visibility = 'hidden';

    const R = 16, SP = 34, ROWH = 29.4, Y0 = 116, PX = [34, 470], NR = 5, NC = 10;
    const BIG = { '0,7': 1, '1,3': 1, '2,6': 1, '3,2': 1, '4,8': 1 };
    const atom = (x, cx, cy, big) => {
      const rr = big ? 21 : R;
      x.save(); x.globalCompositeOperation = 'source-over'; x.fillStyle = PAPER; x.beginPath(); x.arc(cx, cy, rr, 0, 7); x.fill(); x.restore();
      x.fillStyle = big ? 'rgba(200,90,70,.34)' : 'rgba(150,165,200,.26)'; x.beginPath(); x.arc(cx, cy, rr, 0, 7); x.fill();
      x.strokeStyle = rgba(big ? RD : B, 0.9); x.lineWidth = 2.3; x.beginPath(); x.arc(cx, cy, rr - 0.5, -1.2, 5.3); x.stroke();
      x.strokeStyle = rgba(big ? RD : B, 0.45); x.lineWidth = 1.1; x.beginPath(); x.arc(cx + 0.8, cy + 0.6, rr - 1.6, 0.4, 3.6); x.stroke();
    };
    const rows = (x, p, from, to, off) => { for (let j = from; j < to; j++) for (let i = 0; i < NC; i++) { const big = p === 1 && BIG[j + ',' + i]; if (!big) atom(x, PX[p] + 20 + i * SP + (j % 2 ? SP / 2 : 0) + off, Y0 + j * ROWH, false); }
      if (p === 1) for (let j = from; j < to; j++) for (let i = 0; i < NC; i++) if (BIG[j + ',' + i]) atom(x, PX[p] + 20 + i * SP + (j % 2 ? SP / 2 : 0) + off, Y0 + j * ROWH, true); };
    stg.paint = (x) => {
      text(x, 'pure metal', PX[0] + 178, 36, { size: 26, align: 'center' }); text(x, 'every atom the same', PX[0] + 178, 68, { font: 'hand', size: 22, align: 'center' });
      text(x, 'alloy', PX[1] + 178, 36, { size: 26, align: 'center' }); text(x, 'different atoms mixed in', PX[1] + 178, 68, { font: 'hand', size: 22, align: 'center' });
      [0, 1].forEach((p) => {
        rows(x, p, 2, NR, 0);
        const G = [[PX[p] - 8, Y0 + 4 * ROWH + 20], [PX[p] + 372, Y0 + 4 * ROWH + 20], [PX[p] + 372, Y0 + 4 * ROWH + 36], [PX[p] - 8, Y0 + 4 * ROWH + 36]];
        Ink.hatchFill(x, G, 1, B, 1.5); Ink.stroke(x, [G[0], G[1]], { w: 2.8, seed: 5 + p });
      });
    };
    stg.draw = (ctx, t) => {
      const shake = t - S.jt < 0.35 ? Math.sin((t - S.jt) * 60) * 3 * (1 - (t - S.jt) / 0.35) : 0;
      rows(ctx, 0, 0, 2, S.s); rows(ctx, 1, 0, 2, S.j + shake);
      if (S.live) {
        if (S.slid) text(ctx, 'the layers slid!', PX[0] + 178, 286, { font: 'hand', size: 24, align: 'center', color: RD, rot: -0.02 });
        else text(ctx, '← push the top layers →', PX[0] + 178, 286, { font: 'hand', size: 22, align: 'center' });
        if (S.jam) text(ctx, 'jammed: they won’t slide', PX[1] + 178, 286, { font: 'hand', size: 24, align: 'center', color: RD, rot: -0.02 });
        else text(ctx, '← push the top layers →', PX[1] + 178, 286, { font: 'hand', size: 22, align: 'center' });
      } else text(ctx, 'predict first!', 430, 286, { font: 'hand', size: 24, align: 'center', color: RD, rot: -0.03 });
      if (S.drag) {                                         // the push arrow follows the finger
        const p = S.drag.p, dir = Math.sign(S.drag.dx) || 1, ax = clamp(S.drag.x, PX[p], PX[p] + 360), ay = Y0 - 34;
        const A = [[ax - dir * 46, ay], [ax + dir * 10, ay]]; Ink.stroke(ctx, A, { w: 4, color: RD, seed: 9 }); Ink.stroke(ctx, geo.head(A, 16), { w: 4, color: RD, seed: 11 });
      }
      return !!S.drag || t - S.jt < 0.4;
    };
    const check = () => { say(); if (S.slid && S.jam && !conc.classList.contains('on')) { conc.classList.add('on'); Book.sfx('paper', { gain: 0.4 }); } };
    c.addEventListener('pointerdown', (e) => {
      if (!S.live) { Book.toast('Predict first: then you can push.'); return; }
      if (!S.locked) { S.locked = true; predBtns.forEach((b) => (b.disabled = true)); }
      const [x, y] = stg.pos(e), p = x < 430 ? 0 : 1;
      if (y < 76 || y > 262) return;
      S.drag = { p, x0: x, x, dx: 0, beep: false }; try { c.setPointerCapture(e.pointerId); } catch (er) {} e.preventDefault(); stg.go();
    });
    c.addEventListener('pointermove', (e) => {
      const D = S.drag; if (!D) return; const [x] = stg.pos(e); D.x = x; D.dx = x - D.x0;
      if (D.p === 0) { S.s = clamp(S.base + D.dx, -SP * 2, SP * 2); if (Math.abs(S.s - S.base) > 24 && !S.slid) { S.slid = true; Book.sfx('stroke', { material: 'pen', dur: 0.3, gain: 0.6 }); check(); } }
      else { S.j = clamp(D.dx * 0.08, -5, 5); if (Math.abs(D.dx) > 26 && !D.beep) { D.beep = true; S.jam = true; S.jt = stg.time; Book.sfx('thud', { gain: 0.5 }); check(); } }
      stg.go();
    });
    const up = () => { const D = S.drag; if (!D) return; S.drag = null; if (D.p === 0) { S.s = Math.round(S.s / (SP / 2)) * (SP / 2); S.base = S.s; if (Math.abs(S.base) >= SP * 2) S.base = S.s = 0; } else S.j = 0; stg.go(); stg.render(0); };
    c.addEventListener('pointerup', up); c.addEventListener('pointercancel', up); c.addEventListener('lostpointercapture', up);

    const POPTS = ['the pure metal', 'the alloy', 'no difference'];
    const predBtns = POPTS.map((t) => {
      const b = el('button', 'opt', t, predRow); b.type = 'button'; if (S.pred === t) b.classList.add('sel');
      b.onclick = () => { predBtns.forEach((q) => q.classList.remove('sel')); b.classList.add('sel'); S.pred = t; r.set({ answer: `predicted "${t}" (not pushed yet)`, correct: null, pred: t }); Book.scribble(0.12); if (!S.live) { S.live = true; status.style.visibility = ''; Book.sfx('pop', { gain: 0.5 }); } stg.render(0); };
      return b;
    });
    const RIGHT = 'In a pure metal the layers of identical atoms slide over each other easily, so it is soft. In an alloy the different-sized atoms <b>disrupt the layers</b>: they cannot slide as easily, so the alloy is <b>harder and stronger</b>.';
    const COPTS = Book.shuffle([
      { t: 'harder and stronger', ok: true },
      { t: 'softer and weaker', mis: 'alloy-meaning', why: 'Which block refused to move when you pushed it? Layers that cannot slide make a metal hard to bend or dent.' },
      { t: 'easier to bend', mis: 'alloy-meaning', why: 'Bending needs the layers to slide. Which block’s layers jammed?' },
      { t: 'no different at all', why: 'Push both blocks again and compare what the top layers do.' },
    ], 31);
    const concBtns = COPTS.map((op) => {
      const b = el('button', 'opt', op.t, concRow); b.type = 'button';
      b.onclick = () => {
        const ok = !!op.ok; b.classList.add(ok ? 'right' : 'wrong');
        r.set({ answer: `predicted "${S.pred}" slides more easily; pushed both; concluded alloy is "${op.t}" ${ok ? '✓' : '✗'}`, correct: ok, score: ok ? 1 : 0, max: 1, mis: ok ? '' : op.mis || '' });
        if (ok) { concBtns.forEach((q) => (q.disabled = true)); Book.sfx('success', { gain: 0.35 }); fb.className = 'fb on good'; fb.innerHTML = `✓ ${RIGHT} ${S.pred === POPTS[0] ? 'Your prediction was spot on.' : `You predicted “${S.pred}”: the push test has put that right.`}`; onDone(); }
        else { Book.sfx('error', { gain: 0.3 }); fb.className = 'fb on bad'; fb.innerHTML = '✗ ' + op.why; }
      };
      return b;
    });
    stg.init();
    if (prev.correct === true) { S.slid = S.jam = S.locked = true; S.s = S.base = SP; say(); predBtns.forEach((q) => (q.disabled = true)); conc.classList.add('on'); concBtns.forEach((q, i) => { q.disabled = true; if (COPTS[i].ok) q.classList.add('right'); }); fb.className = 'fb on good'; fb.innerHTML = '✓ ' + RIGHT; stg.render(0); onDone(); }
  }

  // ======================================================================================
  // 2. the alloy kitchen
  // ======================================================================================
  const ING = [
    { k: 'copper', wash: 'rgba(200,112,66,.45)' }, { k: 'zinc', wash: 'rgba(140,160,196,.42)' }, { k: 'tin', wash: 'rgba(214,214,206,.36)' },
    { k: 'steel', wash: 'rgba(120,126,146,.46)' }, { k: 'chromium', wash: 'rgba(196,210,228,.40)' }, { k: 'nickel', wash: 'rgba(206,198,172,.42)' },
    { k: 'tungsten', wash: 'rgba(104,104,116,.46)' }, { k: 'vanadium', wash: 'rgba(160,172,194,.40)' }, { k: 'carbon', wash: 'rgba(40,40,52,.62)' },
  ];
  const ORDERS = [
    { key: 'brass', name: 'brass', label: 'Alloy kitchen: make brass', need: ['copper', 'zinc'], ingot: 'rgba(214,176,70,.5)',
      hint: 'Hint: brass has no steel in it. Both of its metals were on your test bench on the last page.',
      card: '<h4>Brass</h4><span class="rec">copper + zinc</span> (about 65% / 35%)<br>Harder than copper, corrosion-resistant, golden yellow, casts and machines well, good conductor.<br><i>Uses:</i> taps and plumbing fittings, door handles, locks and keys, musical instruments, pins of electrical plugs.' },
    { key: 'stainless', name: 'stainless steel', label: 'Alloy kitchen: make stainless steel', need: ['steel', 'chromium', 'nickel'], ingot: 'rgba(190,200,214,.5)',
      hint: 'Hint: start with steel (it already has its carbon). You do not need copper, zinc or tin.',
      card: '<h4>Stainless steel</h4><span class="rec">steel + chromium</span> (about 18%) <span class="rec">+ nickel</span> (about 8%)<br>Hard, tough, strong, <b>resists corrosion (does not rust)</b>, shiny, hygienic; hard to cut and shape; expensive. The chromium forms an invisible protective oxide layer.<br><i>Uses:</i> cutlery, kitchen sinks, saucepans, surgical instruments, kitchen equipment.' },
    { key: 'hss', name: 'high speed steel', label: 'Alloy kitchen: make high speed steel (HSS)', need: ['steel', 'tungsten', 'chromium', 'vanadium'], ingot: 'rgba(120,126,150,.55)',
      hint: 'Hint: start with steel, then add three more metals. No nickel, and nothing from the non-ferrous test bench.',
      card: '<h4>High speed steel (HSS)</h4><span class="rec">steel + tungsten + chromium + vanadium</span><br>Very hard, wear-resistant, <b>stays hard even when red hot</b> from friction.<br><i>Uses:</i> drill bits, lathe cutting tools, milling cutters, router bits.' },
  ];
  const sameSet = (a, b) => a.length === b.length && a.every((k) => b.includes(k));

  function Kitchen(ui, getBook) {
    const el = ui.el;
    const recs = ORDERS.map((o) => ui.record('p05.' + o.key, { label: o.label, type: 'experiment', max: 1 }));
    const lab = el('div', 'ma5-lab'); requestAnimationFrame(() => Ink.frame(lab, { shadow: false, w: 2.2 }));
    el('div', 'ma5-step', 'The alloy kitchen', lab);
    el('p', 'ma5-task', 'Three orders have come in. For each one, <b>tap jars on the shelf</b> to drop ingredients into the pot (tap again to take one out), then <b>melt &amp; pour</b>. Wrong mix? You get a clue: have another go.', lab);
    const tabs = el('div', 'ma5-btns ma5-tabs', '', lab);
    const HH = 380, stg = Stage(lab, HH), c = stg.c;
    const status = el('div', 'ma5-status', '', lab);
    const ctl = el('div', 'ma5-btns', '', lab);
    const pourBtn = el('button', 'btn', '🔥 Melt & pour', ctl), emptyBtn = el('button', 'btn ghost', 'Empty the pot', ctl); pourBtn.type = emptyBtn.type = 'button';
    const fb = el('div', 'fb', '', lab);

    const tries = recs.map((r) => ((r.get() || {}).tries || []).slice());
    const solved = recs.map((r) => (r.get() || {}).correct === true);
    let cur = Math.max(0, solved.indexOf(false)), sel = [], phase = 'idle', pt = 0, lastOk = false;
    const COLS = [84, 222, 360], ROWS = [16, 132, 248], POT = { x0: 540, x1: 680, top: 128, bot: 238 };
    const jarAt = (i) => [COLS[i % 3], ROWS[(i / 3) | 0]];

    const tabBtns = ORDERS.map((o, i) => { const b = el('button', 'opt', '', tabs); b.type = 'button'; b.onclick = () => { if (phase !== 'idle' && phase !== 'done') return; setOrder(i); Book.sfx('tick', { gain: 0.4 }); }; return b; });
    const paintTabs = () => tabBtns.forEach((b, i) => { b.innerHTML = `Order ${i + 1}: <b style="font-family:Fredoka">${ORDERS[i].name}</b>${solved[i] ? ' <span class="green">✓</span>' : ''}`; b.classList.toggle('sel', i === cur); b.classList.toggle('done', solved[i]); });
    const say = () => {
      const o = ORDERS[cur];
      status.innerHTML = solved[cur] ? `Order ${cur + 1} is done: the recipe card is in your recipe book below.${solved.every(Boolean) ? '' : ' Tap the next order.'}` : sel.length ? `In the pot: <b>${sel.join(' + ')}</b>` : `Make <b>${o.name}</b>: it needs <b>${o.need.length}</b> ingredients. The pot is empty.`;
      pourBtn.disabled = solved[cur] || phase === 'melt' || phase === 'pour' || phase === 'fail'; emptyBtn.disabled = pourBtn.disabled || !sel.length;
    };
    function setOrder(i) { cur = i; sel = []; phase = solved[i] ? 'done' : 'idle'; pt = 1; fb.className = 'fb'; fb.innerHTML = ''; paintTabs(); say(); stg.render(0); }
    const showCards = () => {
      const book = getBook(); if (!book) return;
      const done = ORDERS.filter((o, i) => solved[i]);
      book.querySelector('.ma5-book').innerHTML = done.length ? `<div class="ma5-cards">${done.map((o) => `<div>${o.card}</div>`).join('')}</div>` + (done.length < 3 ? `<p class="ma5-locked" style="margin-top:8px">🔒 ${3 - done.length} more recipe card${done.length === 2 ? '' : 's'} to earn.</p>` : '') : '<p class="ma5-locked">🔒 Recipe cards appear here as you fill each order in the alloy kitchen.</p>';
    };

    stg.paint = (x) => {
      ROWS.forEach((ry, j) => Ink.stroke(x, [[18, ry + 70], [428, ry + 70]], { w: 3, seed: 3 + j }));
      [22, 424].forEach((px, i) => Ink.stroke(x, [[px, 8], [px, ROWS[2] + 74]], { w: 2.4, seed: 7 + i }));
      ING.forEach((g, i) => {
        const [cx, y] = jarAt(i), J = [[cx - 50, y + 12], [cx - 54, y + 62], [cx - 48, y + 68], [cx + 48, y + 68], [cx + 54, y + 62], [cx + 50, y + 12]];
        paper(x, J);
        // lumps of the metal inside the jar
        [[-30, 46, 24, 18], [-2, 42, 28, 22], [26, 48, 20, 16], [-16, 26, 22, 16], [12, 24, 22, 16]].forEach(([dx, dy, w, h], q) => { const L = geo.rect(cx + dx - w / 2, y + dy, w, h, 4); wash(x, L, g.wash); Ink.stroke(x, L, { w: 1.5, seed: i * 7 + q, retrace: false }); });
        Ink.stroke(x, J, { w: 2.6, seed: 20 + i * 3 }); Ink.stroke(x, [[cx - 54, y + 10], [cx + 54, y + 10]], { w: 3.4, seed: 22 + i * 3 });
        text(x, g.k, cx, y + 96, { size: 22, align: 'center' });
      });
      // the pot (crucible) on its stand, and the mould
      const P = [[POT.x0 - 8, POT.top], [POT.x0 + 10, POT.bot - 14], [POT.x0 + 26, POT.bot], [POT.x1 - 26, POT.bot], [POT.x1 - 10, POT.bot - 14], [POT.x1 + 8, POT.top]];
      Ink.hatchShadow(x, [...P, P[0]], 1, 7, 7); paper(x, P); Ink.stroke(x, P, { w: 3.2, seed: 40 });
      Ink.stroke(x, [[POT.x1 + 8, POT.top], [POT.x1 + 26, POT.top - 6]], { w: 3, seed: 42 });
      [[POT.x0 + 14, POT.x0 - 6], [POT.x1 - 14, POT.x1 + 6]].forEach(([a, b], i) => Ink.stroke(x, [[a, POT.bot + 2], [b, 322]], { w: 3, seed: 44 + i }));
      Ink.stroke(x, [[POT.x0 - 20, 322], [POT.x1 + 20, 322]], { w: 2.6, seed: 47 });
      const burner = geo.rect(588, 296, 44, 26, 4); paper(x, burner); Ink.hatchFill(x, burner, 1, B, 1.4); Ink.stroke(x, burner, { w: 2.4, seed: 49 });
      text(x, 'the pot', 610, 356, { font: 'hand', size: 22, align: 'center' });
      const M = [[724, 286], [730, 322], [836, 322], [842, 286]]; paper(x, M); Ink.stroke(x, M, { w: 3, seed: 52 }); Ink.hatchShadow(x, [[724, 318], [842, 318], [842, 324], [724, 324]], 1, 6, 6);
      text(x, 'mould', 783, 356, { font: 'hand', size: 22, align: 'center' });
    };
    stg.draw = (ctx, t, dt) => {
      const o = ORDERS[cur]; let more = false;
      if (phase === 'melt' || phase === 'pour' || phase === 'fail') {
        pt += dt / (phase === 'melt' ? 1.2 : phase === 'pour' ? 1.3 : 1.1); more = true;
        if (pt >= 1) {
          if (phase === 'melt') { phase = lastOk ? 'pour' : 'fail'; pt = 0; Book.sfx(lastOk ? 'success' : 'error', { gain: 0.35 }); }
          else if (phase === 'pour') { phase = 'done'; pt = 1; finish(); }
          else { phase = 'idle'; pt = 0; finish(); }
        }
      }
      // order card
      text(ctx, 'ORDER ' + (cur + 1), 640, 34, { size: 22, align: 'center', color: RD });
      text(ctx, o.name, 640, 68, { size: 30, align: 'center' });
      if (solved[cur] && phase === 'done') { text(ctx, 'made it!', 652, 100, { font: 'hand', size: 24, align: 'center', color: GR }); Ink.tick(ctx, 574, 94, 0.9); }
      else text(ctx, o.need.length + ' ingredients', 640, 100, { font: 'hand', size: 22, align: 'center' });
      // ticks on the jars that are in the pot
      ING.forEach((g, i) => { if (!sel.includes(g.k)) return; const [cx, y] = jarAt(i); Ink.stroke(ctx, geo.rect(cx - 62, y + 2, 124, 74, 10), { w: 3, color: RD, seed: 60 + i }); Ink.tick(ctx, cx + 26, y + 30, 1); });
      // what is in the pot
      const melt = phase === 'melt' ? ease(clamp(pt)) : phase === 'pour' || phase === 'fail' ? 1 : 0, n = sel.length;
      if (n && melt < 1) sel.forEach((k, q) => { const g = ING.find((z) => z.k === k), col = q % 3, row = (q / 3) | 0, w = 32, h = lerp(24, 6, melt), bx = 558 + col * 36, by = POT.bot - 6 - row * 26 * (1 - melt) - h; const L = geo.rect(bx, by, w, h, 4); paper(ctx, L); wash(ctx, L, g.wash); Ink.stroke(ctx, L, { w: 2, seed: 80 + q * 3, retrace: false }); });
      if (n && melt > 0.2) {
        const lv = phase === 'pour' ? lerp(1, 0.15, ease(clamp(pt))) : 1, hh = (16 + Math.min(n, 5) * 9) * lv * clamp((melt - 0.2) / 0.8), L = [[POT.x0 + 12 - hh * 0.12, POT.bot - 4 - hh], [POT.x1 - 12 + hh * 0.12, POT.bot - 4 - hh], [POT.x1 - 24, POT.bot - 4], [POT.x0 + 24, POT.bot - 4]];
        const bad = phase === 'fail';
        wash(ctx, L, bad ? 'rgba(90,90,110,.4)' : 'rgba(236,128,40,.45)'); Ink.hatchFill(ctx, L, 1, bad ? B : RD, 1.5); Ink.stroke(ctx, [L[0], L[1]], { w: 2.4, color: bad ? B : RD, seed: 95 });
      }
      if (phase === 'melt' || phase === 'pour') for (let i = 0; i < 4; i++) { const fx = 594 + i * 11, fh = 18 + Math.sin(t * 14 + i * 2) * 7 + (i % 2) * 6; Ink.stroke(ctx, geo.curve([fx - 5, 296], [fx - 9, 296 - fh * 0.5], [fx + 3, 296 - fh * 0.6], [fx, 296 - fh], 8), { w: 2.4, color: RD, seed: 100 + i, retrace: false }); }
      if (phase === 'fail') { Ink.cross(ctx, 760, 220, 1.5); text(ctx, 'that’s not it!', 770, 262, { font: 'hand', size: 24, align: 'center', color: RD, rot: -0.04 }); }
      // the pour and the ingot
      if (phase === 'pour') { const p = clamp(pt * 2.2), Sx = geo.curve([POT.x1 + 24, POT.top - 6], [740, POT.top - 16], [778, 190], [782, 316], 30); Ink.stroke(ctx, Sx, { w: 5, color: RD, seed: 110, p: Math.max(0.05, p) }); }
      if (phase === 'pour' || (phase === 'done' && solved[cur])) {
        const f = phase === 'done' ? 1 : ease(clamp(pt)), top = 320 - 28 * f, I = [[727 + (320 - top) * -0.17 + 5, top], [839 - (320 - top) * -0.17 - 5, top], [834, 320], [732, 320]];
        wash(ctx, I, o.ingot); Ink.hatchFill(ctx, I, 1, phase === 'done' ? B : RD, 1.2); Ink.stroke(ctx, [I[0], I[1]], { w: 2.4, seed: 115, color: phase === 'done' ? B : RD });
      }
      return more;
    };
    c.addEventListener('pointerdown', (e) => {
      const [x, y] = stg.pos(e); if (x > 440) return;
      if (solved[cur]) { Book.toast(solved.every(Boolean) ? 'All three orders are done.' : 'This order is done: tap the next order.'); return; }
      if (phase !== 'idle') return;
      let best = -1; ING.forEach((g, i) => { const [cx, cy] = jarAt(i); if (Math.abs(x - cx) < 68 && y > cy - 6 && y < cy + 106) best = i; });
      if (best < 0) return;
      const k = ING[best].k; if (sel.includes(k)) { sel = sel.filter((z) => z !== k); Book.sfx('tick', { gain: 0.4 }); } else { sel.push(k); Book.sfx('thud', { gain: 0.4 }); }
      fb.className = 'fb'; say(); stg.render(0);
    });
    emptyBtn.onclick = () => { if (phase !== 'idle') return; sel = []; Book.sfx('paper', { gain: 0.3 }); say(); stg.render(0); };
    let pending = null;
    pourBtn.onclick = () => {
      if (phase !== 'idle' || solved[cur]) return;
      if (!sel.length) { Book.toast('The pot is empty: tap some jars first.'); return; }
      const o = ORDERS[cur], ok = sameSet(sel, o.need), T = tries[cur];
      T.push(sel.slice()); lastOk = ok;
      recs[cur].set({ answer: T.map((s, i) => `try ${i + 1}: ${s.join(' + ')} ${i === T.length - 1 && ok ? '✓' : '✗'}`).join('; '), correct: ok, score: ok ? 1 : 0, max: 1, mis: ok ? '' : 'alloy-contents', tries: T });
      const good = sel.filter((k) => o.need.includes(k)).length;
      pending = ok ? { ok, html: `✓ That is ${o.name}! ${T.length === 1 ? 'First time.' : `Got there on try ${T.length}.`} Its recipe card is in your recipe book below.` }
        : { ok, html: `✗ That is not ${o.name}. <b>${good}</b> of your ${sel.length} ingredient${sel.length === 1 ? '' : 's'} belong${sel.length === 1 && good === 1 ? 's' : ''} in it${sel.length !== o.need.length ? `, and it needs exactly ${o.need.length}` : ''}. ${T.length >= 4 ? `The recipe is <b>${o.need.join(' + ')}</b>: make it.` : T.length >= 2 ? o.hint : 'Change the mix and try again.'}` };
      phase = 'melt'; pt = 0; Book.sfx('stroke', { material: 'pen', dur: 0.8, gain: 0.5 }); say(); stg.go();
    };
    function finish() {
      if (!pending) return; const p = pending; pending = null;
      fb.className = 'fb on ' + (p.ok ? 'good' : 'bad'); fb.innerHTML = p.html;
      if (p.ok) { solved[cur] = true; sel = []; showCards(); paintTabs(); }
      say();
    }
    stg.init(); setOrder(cur);
    return { showCards };
  }

  // ======================================================================================
  Book.page({ id: 'p05', title: 'Alloys: mixing metals', build(ui, root) {
    ui.h('Alloys: mixing metals');
    ui.p('Pure metals are often <b>too soft</b> to be much use. So we rarely use them pure: we mix them. To see why that works, you need to zoom in a very long way…');

    let notes = null;
    const NOTES = `<p style="margin:0 0 6px">An <span class="key">alloy</span> is a <b>mixture of two or more elements, at least one of them a metal</b>.</p>
      <p style="margin:0 0 6px">Alloys are made to get <b>improved properties</b>: harder, stronger, more corrosion-resistant, a lower melting point…</p>
      <p style="margin:0" class="small">Why it works: the added atoms disrupt the regular layers, so the layers cannot slide as easily. Alloys can be <b>ferrous</b> (they contain iron) or <b>non-ferrous</b>.</p>`;
    const unlock = () => { if (notes) notes.querySelector('.ma5-nb').innerHTML = NOTES; };
    let layersDone = false;
    Layers(ui, () => { layersDone = true; unlock(); });
    notes = ui.box('<div class="ma5-nb"><p class="ma5-locked">🔒 Your notes on alloys appear here when you have finished the push test above.</p></div>', { tag: 'Notes' });
    if (layersDone) unlock();

    ui.p('Three alloys to know: <b>brass</b>, <b>stainless steel</b> and <b>high speed steel</b>. What goes into each one? Find out in the kitchen.');
    let book = null;
    const kitchen = Kitchen(ui, () => book);
    book = ui.box('<div class="ma5-book"></div>', { tag: 'Recipe book' });
    kitchen.showCards();

    ui.p('<b>Check what you know.</b> Your notes and recipe cards will <b>blur</b> while you answer.');
    const q1 = ui.mcq({
      id: 'p05.meaning', label: 'What is an alloy?', q: 'What is an <b>alloy</b>?',
      options: [
        { t: 'A mixture of two or more elements, at least one of them a metal', ok: true, why: 'Yes: a mixture, made to get better properties than the pure metal has.' },
        { t: 'A pure metal that has been heated until it becomes much harder', mis: 'alloy-meaning', why: 'An alloy is not pure. Think about what you did in the kitchen: how many ingredients went in the pot?' },
        { t: 'A thin coating of one metal put on top of another to protect it', mis: 'alloy-meaning', why: 'That is a coating (plating). In an alloy the ingredients are melted and mixed right through.' },
        { t: 'A new compound made when a metal reacts with oxygen in the air', mis: 'alloy-meaning', why: 'That describes corrosion. An alloy is made on purpose by melting ingredients together.' },
      ],
    });
    ui.hideWhile(q1, 'p05.meaning', [notes]);
    const q2 = ui.mcq({
      id: 'p05.family', label: 'Which family is stainless steel in?', q: 'Think about what you put in the pot. <b>Stainless steel</b> is…',
      options: [
        { t: 'a ferrous alloy, because it is mostly iron', ok: true, why: 'Yes. Its main ingredient is steel, and steel is mostly iron: so stainless steel is a ferrous alloy (and so is high speed steel). Brass has no iron: it is a non-ferrous alloy.' },
        { t: 'a non-ferrous alloy, because it does not rust', mis: 'stainless-family', why: 'It does not rust, but that is the chromium protecting it. Ferrous means “contains iron”: what was its main ingredient?' },
        { t: 'a pure metal, dug up as a shiny silver ore', mis: 'stainless-family', why: 'You mixed three ingredients to make it, so it cannot be a pure metal.' },
        { t: 'a non-ferrous metal, with a coating of zinc', mis: 'stainless-family', why: 'There is no zinc and no coating: the ingredients are mixed right through. What was its main ingredient?' },
      ],
    });
    ui.hideWhile(q2, 'p05.family', [notes, book]);
    const q3 = ui.match({
      id: 'p05.uses', label: 'Match each alloy to its properties and uses',
      q: 'Tap an alloy, then tap what it is like and what it is used for.',
      pairs: [
        ['Brass', 'golden yellow, casts and machines well: taps, door handles, keys', 'alloy-mixup'],
        ['Stainless steel', 'shiny, hygienic, does not rust: cutlery, sinks, surgical instruments', 'alloy-mixup'],
        ['High speed steel', 'stays hard even when red hot: drill bits, lathe cutting tools', 'alloy-mixup'],
      ],
    });
    ui.hideWhile(q3, 'p05.uses', [book]);
  } });
})();
