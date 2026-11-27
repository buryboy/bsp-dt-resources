// Page 6 — The rust lab. (1) Four test tubes with a steel nail: predict which rusts first, drag the days 0-14,
// conclude what rust needs. (2) Protect a steel gate (nothing / paint / oil / galvanise / plastic coat), scratch it
// with a finger, fast-forward a year. (3) What is galvanising? Which metals rust?
(function () {
  'use strict';
  const B = Ink.BLUE, RD = Ink.RED, GR = Ink.GREEN, rgba = Ink.rgba, geo = Ink.geo;
  const LABF = (s) => `600 ${s}px Fredoka, "Arial Rounded MT Bold", system-ui, sans-serif`;
  const HANDF = (s) => `400 ${s}px "Gloria Hallelujah", "Comic Sans MS", cursive`;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const PAPER = 'rgba(251,250,245,.97)';
  const W = 860;

  if (!document.getElementById('ma6-css')) {
    const s = document.createElement('style'); s.id = 'ma6-css';
    s.textContent = `
      .ma6-lab { position: relative; margin: 0 0 calc(var(--R) * 1); padding: 12px 16px 16px; background: rgba(251,250,245,.9); }
      .ma6-lab > * { position: relative; }
      .ma6-step { font: 700 14px Fredoka, system-ui; letter-spacing: .08em; text-transform: uppercase; color: var(--red); line-height: 22px; }
      .ma6-task { font-size: 19px; line-height: 1.5; margin: 0 0 8px; }
      .ma6-task b, .ma6-q b, .ma6-status b { font-family: Fredoka, system-ui; font-weight: 600; }
      .ma6-q { font-size: 19px; line-height: 1.5; margin: 6px 0 8px; }
      .ma6-btns { display: flex; flex-wrap: wrap; gap: 10px; align-items: stretch; margin: 0 0 8px; }
      .ma6-btns .opt { flex: 1 1 130px; text-align: center; min-height: 52px; }
      .ma6-btns .btn { margin-top: 0; min-height: 50px; }
      .ma6-conc .ma6-btns .opt { flex: 1 1 300px; text-align: left; }
      .ma6-conc.short .ma6-btns .opt { flex: 1 1 130px; text-align: center; }
      .ma6-cv { display: block; width: 100%; height: auto; touch-action: pan-y; user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; cursor: pointer; }
      .ma6-status { font-size: 17px; line-height: 1.5; min-height: 26px; margin: 2px 0 6px; }
      .ma6-log { display: flex; flex-wrap: wrap; gap: 8px; margin: 0 0 6px; }
      .ma6-log span { display: inline-flex; flex-direction: column; background: #fff; border: 2px solid rgba(30,46,150,.4); border-radius: 10px; padding: 3px 12px 4px; font-size: 15px; line-height: 1.3; }
      .ma6-log b { font: 700 17px Fredoka, system-ui; }
      .ma6-conc { display: none; margin-top: 6px; padding-top: 6px; border-top: 2px dashed rgba(30,46,150,.3); }
      .ma6-conc.on { display: block; }
      .ma6-locked { font-size: 17px; opacity: .75; margin: 0; }
    `;
    document.head.appendChild(s);
  }

  function text(x, s, px, py, o = {}) {
    x.save(); x.font = (o.font === 'hand' ? HANDF : LABF)(o.size || 22);
    x.fillStyle = rgba(o.color || B, o.a ?? 0.92); x.textAlign = o.align || 'left'; x.textBaseline = 'alphabetic';
    x.translate(px, py); if (o.rot) x.rotate(o.rot); x.fillText(s, 0, 0); x.restore();
  }
  const path = (x, pts) => { x.beginPath(); pts.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.closePath(); };
  function paper(x, pts, style = PAPER) { x.save(); x.globalCompositeOperation = 'source-over'; x.fillStyle = style; path(x, pts); x.fill(); x.restore(); }
  function wash(x, pts, style) { x.save(); x.fillStyle = style; path(x, pts); x.fill(); x.restore(); }
  function slider(x, sl, l0, l1) {
    Ink.stroke(x, [[sl.x0, sl.y], [sl.x1, sl.y]], { w: 3.2, seed: 41 });
    for (let i = 0; i <= 14; i++) { const px = lerp(sl.x0, sl.x1, i / 14); Ink.stroke(x, [[px, sl.y - (i % 7 ? 6 : 11)], [px, sl.y + (i % 7 ? 6 : 11)]], { w: 1.6, seed: 50 + i, retrace: false }); }
    text(x, l0, sl.x0 - 28, sl.y + 8, { size: 22, align: 'right' }); text(x, l1, sl.x1 + 28, sl.y + 8, { size: 22 });
  }
  function knob(ctx, sl, v, hot) {
    const kx = lerp(sl.x0, sl.x1, clamp(v)), K = geo.ellipse(kx, sl.y, 19, 19);
    paper(ctx, K); Ink.hatchFill(ctx, K, 1, hot ? RD : B, 1.3); Ink.stroke(ctx, K, { w: 3, color: hot ? RD : B, seed: 77 });
  }
  function rainLines(ctx, t, y0, y1) { ctx.save(); ctx.strokeStyle = rgba(B, 0.5); ctx.lineWidth = 1.6; ctx.beginPath(); for (let i = 0; i < 50; i++) { const ph = (t * (1.3 + (i % 5) * 0.12) + i * 0.137) % 1, rx = 20 + ((i * 97) % 820), ry = y0 + ph * (y1 - y0); ctx.moveTo(rx, ry); ctx.lineTo(rx - 5, ry + 15); } ctx.stroke(); ctx.restore(); }

  function Stage(parent, HH) {
    const c = document.createElement('canvas'); c.className = 'ma6-cv'; parent.appendChild(c);
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
  // 1. the four test tubes
  // ======================================================================================
  const TUBES = [
    { k: 'A', l1: 'water + air', l2: '', rust: (d) => clamp((d - 3) / 10) * 0.75, end: 'rusty' },
    { k: 'B', l1: 'boiled water,', l2: 'oil on top: no air', rust: () => 0, end: 'no rust' },
    { k: 'C', l1: 'dry air only:', l2: 'no water', rust: () => 0, end: 'no rust' },
    { k: 'D', l1: 'salt water + air', l2: '', rust: (d) => clamp((d - 1) / 6), end: 'very rusty' },
  ];
  const PRED = ['A: water + air', 'B: water but no air', 'C: air but no water', 'D: salt water + air'];
  function Tubes(ui, onDone) {
    const el = ui.el, r = ui.record('p06.conclude', { label: 'Rust test tubes: what does rust need?', type: 'experiment', max: 1 });
    const pred = () => (Book.state.items['p06.predict'] || {}).answer || null;
    const lab = el('div', 'ma6-lab'); requestAnimationFrame(() => Ink.frame(lab, { shadow: false, w: 2.2 }));
    el('div', 'ma6-step', 'The nail experiment', lab);
    const HH = 392, stg = Stage(lab, HH), c = stg.c, SL = { x0: 170, x1: 560, y: 362 }, CX = (i) => 118 + i * 208, TOP = 62, BOT = 272, HW = 36;
    const status = el('div', 'ma6-status', '', lab);
    const conc = el('div', 'ma6-conc', '<div class="ma6-q"><b>What did you find?</b> Compare all four tubes. What does steel need to rust?</div>', lab), concRow = el('div', 'ma6-btns', '', conc), fb = el('div', 'fb', '', conc);
    const S = { live: !!pred(), d: 0, drag: false, full: false, locked: false, firstSeen: false };
    const say = () => { status.innerHTML = !S.live ? 'Make your prediction above: then the clock can start.' : S.full ? 'Two weeks are up. Compare the four nails.' : '👉 <b>Drag the knob</b> to let the days go by. Watch all four nails.'; };
    say();
    const tubeShape = (cx) => [[cx - HW, TOP], [cx - HW, BOT - HW], ...geo.ellipse(cx, BOT - HW, HW, HW, Math.PI, 0).slice(1, -1), [cx + HW, BOT - HW], [cx + HW, TOP]];
    const liquid = (cx, top) => [[cx - HW + 3, top], [cx - HW + 3, BOT - HW], ...geo.ellipse(cx, BOT - HW, HW - 3, HW - 3, Math.PI, 0).slice(1, -1), [cx + HW - 3, BOT - HW], [cx + HW - 3, top]];
    stg.paint = (x) => {
      Ink.stroke(x, [[20, BOT + 6], [840, BOT + 6]], { w: 2.8, seed: 3 });
      TUBES.forEach((T, i) => {
        const cx = CX(i);
        if (T.k === 'A' || T.k === 'D') { const L = liquid(cx, 168); wash(x, L, 'rgba(120,160,220,.22)'); Ink.hatchFill(x, L, 0.5, B, 0.5); Ink.stroke(x, [[cx - HW + 3, 168], [cx + HW - 3, 168]], { w: 2, seed: 10 + i }); }
        if (T.k === 'D') [[-18, 200], [10, 216], [-6, 240], [20, 190], [0, 256], [-22, 226], [22, 238]].forEach(([dx, y]) => { x.fillStyle = rgba(B, 0.75); x.fillRect(cx + dx, y, 3.5, 3.5); });
        if (T.k === 'B') { const L = liquid(cx, 104); wash(x, L, 'rgba(120,160,220,.22)'); Ink.hatchFill(x, L, 0.5, B, 0.5); const O = geo.rect(cx - HW + 3, 88, HW * 2 - 6, 16, 2); wash(x, O, 'rgba(220,180,40,.5)'); Ink.hatchFill(x, O, 1, B, 1.8); Ink.stroke(x, [[cx - HW + 3, 88], [cx + HW - 3, 88]], { w: 2, seed: 14 }); Ink.stroke(x, [[cx - HW + 3, 104], [cx + HW - 3, 104]], { w: 2, seed: 15 }); }
        if (T.k === 'C') {
          for (let q = 0; q < 9; q++) { const gx = cx - 20 + (q % 4) * 13 + ((q / 4) | 0) * 5, gy = 258 - ((q / 4) | 0) * 11; Ink.stroke(x, geo.ellipse(gx, gy, 6, 5), { w: 1.4, seed: 20 + q, retrace: false }); }
          const bung = [[cx - HW - 4, TOP - 14], [cx + HW + 4, TOP - 14], [cx + HW - 4, TOP + 16], [cx - HW + 4, TOP + 16]]; paper(x, bung); Ink.hatchFill(x, bung, 1, B, 1.5); Ink.stroke(x, [...bung, bung[0]], { w: 2.4, seed: 31 });
        }
        Ink.stroke(x, tubeShape(cx), { w: 3, seed: 34 + i * 3 });
        Ink.stroke(x, [[cx - HW - 6, TOP], [cx - HW, TOP]], { w: 3, seed: 36 + i }); Ink.stroke(x, [[cx + HW, TOP], [cx + HW + 6, TOP]], { w: 3, seed: 38 + i });
        Ink.drawBubble(x, T.k, cx - HW - 44, TOP + 44, 40, B, 1, 0, 'left');
        text(x, T.l1, cx, BOT + 34, { font: 'hand', size: 22, align: 'center' }); if (T.l2) text(x, T.l2, cx, BOT + 60, { font: 'hand', size: 22, align: 'center' });
      });
      slider(x, SL, 'day 0', 'day 14');
    };
    stg.draw = (ctx) => {
      TUBES.forEach((T, i) => {
        const cx = CX(i), rr = T.rust(S.d), top = T.k === 'B' ? 124 : 112, bot = T.k === 'C' ? 232 : 250;
        // the nail: head, shank, point (leaning a little)
        const N = [[cx - 9, top + 6], [cx - 1, top + 4], [cx + 9, bot - 14], [cx + 7, bot], [cx + 1, bot - 12]];
        paper(ctx, N); wash(ctx, N, 'rgba(120,126,146,.5)');
        if (rr > 0.02) { wash(ctx, N, `rgba(190,80,20,${0.75 * rr})`); const F = [[cx - 14, top + 2], [cx + 4, top], [cx + 15, bot - 12], [cx + 8, bot + 4], [cx - 5, bot - 10]]; Ink.hatchFill(ctx, F, rr, RD, 2.2); }
        Ink.stroke(ctx, [...N, N[0]], { w: 2.2, seed: 60 + i * 4, color: rr > 0.5 ? RD : B, retrace: false });
        Ink.stroke(ctx, [[cx - 16, top + 6], [cx + 4, top + 1]], { w: 4, seed: 62 + i * 4, color: rr > 0.5 ? RD : B });
        if (rr > 0.3) { const q = clamp((rr - 0.3) / 0.7), Cl = geo.ellipse(cx + 4, 256, 22, 9); wash(ctx, Cl, `rgba(190,90,30,${0.5 * q})`); for (let z = 0; z < 6; z++) { ctx.fillStyle = rgba(RD, 0.7 * q); ctx.fillRect(cx - 14 + z * 7, 252 + (z % 3) * 4, 3, 3); } }
        if (S.full) text(ctx, T.end, cx + 4, TOP - 24, { font: 'hand', size: 24, align: 'center', color: rr > 0 ? RD : GR, rot: -0.03 });
      });
      if (S.live) { text(ctx, 'day ' + Math.round(S.d), 838, SL.y + 10, { size: 30, align: 'right' }); knob(ctx, SL, S.d / 14, S.drag); }
      else text(ctx, 'predict first!', 760, SL.y + 8, { font: 'hand', size: 24, align: 'center', color: RD, rot: -0.03 });
      return S.drag;
    };
    let lastTick = -1;
    const setX = (x) => {
      S.d = clamp((x - SL.x0) / (SL.x1 - SL.x0)) * 14; const tk = Math.round(S.d); if (tk !== lastTick) { lastTick = tk; Book.sfx('tick', { gain: 0.25 }); }
      if (S.d >= 13.9 && !S.full) { S.full = true; S.d = 14; say(); if (!conc.classList.contains('on')) { conc.classList.add('on'); Book.sfx('paper', { gain: 0.4 }); } }
    };
    c.addEventListener('pointerdown', (e) => {
      if (!S.live) { Book.toast('Predict first: then the clock can start.'); return; }
      const [x, y] = stg.pos(e); if (Math.abs(y - SL.y) > 46 || x < SL.x0 - 44 || x > SL.x1 + 44) return;
      if (!S.locked) { S.locked = true; lockPred(); }
      S.drag = true; try { c.setPointerCapture(e.pointerId); } catch (er) {} e.preventDefault(); setX(x); stg.go();
    });
    c.addEventListener('pointermove', (e) => { if (!S.drag) return; setX(stg.pos(e)[0]); stg.go(); });
    const up = () => { if (S.drag) { S.drag = false; stg.go(); stg.render(0); } };
    c.addEventListener('pointerup', up); c.addEventListener('pointercancel', up); c.addEventListener('lostpointercapture', up);

    const RIGHT = 'Rust forms when steel meets <b>both air (oxygen) and water</b>. B had no air and C had no water: no rust in either. D rusted first, because <b>salt speeds rusting up</b>.';
    const COPTS = Book.shuffle([
      { t: 'air AND water together; salt makes it faster', ok: true },
      { t: 'only water; the air makes no difference', mis: 'rust-conditions', why: 'Tube B has plenty of water, but the oil keeps the air out. Did its nail rust?' },
      { t: 'only air; the water makes no difference', mis: 'rust-conditions', why: 'Tube C has plenty of air, but it is kept completely dry. Did its nail rust?' },
      { t: 'salt; with no salt there is no rust at all', mis: 'rust-conditions', why: 'Tube A has no salt in it. Look at its nail on day 14.' },
    ], 23);
    const concBtns = COPTS.map((op) => {
      const b = el('button', 'opt', op.t, concRow); b.type = 'button';
      b.onclick = () => {
        const ok = !!op.ok, p = pred(); b.classList.add(ok ? 'right' : 'wrong');
        r.set({ answer: `predicted first to rust "${p}"; day 14: A rusty, B no rust, C no rust, D very rusty; concluded rust needs "${op.t}" ${ok ? '✓' : '✗'}`, correct: ok, score: ok ? 1 : 0, max: 1, mis: ok ? '' : op.mis || '' });
        if (ok) { concBtns.forEach((q) => (q.disabled = true)); Book.sfx('success', { gain: 0.35 }); fb.className = 'fb on good'; fb.innerHTML = `✓ ${RIGHT} ${p === PRED[3] ? 'Your prediction was spot on.' : `You predicted “${Book.esc(p)}”: the experiment has put that right.`}`; onDone(); }
        else { Book.sfx('error', { gain: 0.3 }); fb.className = 'fb on bad'; fb.innerHTML = '✗ ' + op.why; }
      };
      return b;
    });
    let lockPred = () => {};
    stg.init();
    if ((r.get() || {}).correct === true) { S.full = S.locked = true; S.d = 14; say(); conc.classList.add('on'); concBtns.forEach((q, i) => { q.disabled = true; if (COPTS[i].ok) q.classList.add('right'); }); fb.className = 'fb on good'; fb.innerHTML = '✓ ' + RIGHT; stg.render(0); onDone(); }
    return { start() { if (!S.live) { S.live = true; Book.sfx('pop', { gain: 0.5 }); } say(); stg.render(0); }, setLock(fn) { lockPred = fn; if (S.locked) fn(); } };
  }

  // ======================================================================================
  // 2. the garden gate
  // ======================================================================================
  const COATS = [
    { k: 'nothing', t: 'nothing', wash: 'rgba(120,126,146,.34)', res: 'rust all over', line: 'No protection: air and water reach the steel everywhere. <b>Rust all over.</b>' },
    { k: 'paint', t: 'paint', wash: 'rgba(40,90,180,.40)', res: 'rust at the scratch', line: 'The paint kept air and water out, until the scratch let them in. <b>Rust at the scratch.</b>' },
    { k: 'oil', t: 'oil', wash: 'rgba(210,170,50,.34)', res: 'rust at the scratch', line: 'The oil was rubbed off at the scratch. <b>Rust at the scratch</b> (and oil wears off, so it has to be put back on).' },
    { k: 'galv', t: 'galvanise', wash: 'rgba(170,186,208,.44)', res: 'no rust, even scratched', line: 'Scratched right through, a whole year of rain… and <b>still no rust</b>.' },
    { k: 'plastic', t: 'plastic coat', wash: 'rgba(190,50,60,.32)', res: 'rust at the scratch', line: 'The plastic coat kept air and water out, until the scratch let them in. <b>Rust at the scratch.</b>' },
  ];
  function Gate(ui, onDone) {
    const el = ui.el, r = ui.record('p06.gate', { label: 'Protect, scratch and weather a steel gate', type: 'experiment', max: 1 });
    const lab = el('div', 'ma6-lab'); requestAnimationFrame(() => Ink.frame(lab, { shadow: false, w: 2.2 }));
    el('div', 'ma6-step', 'Protect the gate', lab);
    el('p', 'ma6-task', 'A new <b>steel</b> garden gate. <b>1.</b> Choose how to protect it. <b>2.</b> Life is rough: <b>scratch it</b> with your finger. <b>3.</b> Fast-forward a year of weather. Test at least three.', lab);
    const row = el('div', 'ma6-btns', '', lab);
    const HH = 340, stg = Stage(lab, HH), c = stg.c, G = { x0: 270, x1: 590, y0: 78, y1: 280 };
    const status = el('div', 'ma6-status', '', lab);
    const ctl = el('div', 'ma6-btns', '', lab), ff = el('button', 'btn', '⏩ Fast-forward 1 year', ctl); ff.type = 'button';
    const log = el('div', 'ma6-log', '', lab);
    const conc = el('div', 'ma6-conc short', '<div class="ma6-q"><b>What did you find?</b> Which protection kept working even after it was scratched?</div>', lab), concRow = el('div', 'ma6-btns', '', conc), fb = el('div', 'fb', '', conc);
    const prev = r.get() || {}, tested = Object.assign({}, prev.tested || {});
    const S = { coat: null, phase: 'choose', pts: [], len: 0, t: 0, drag: false };
    const coat = () => COATS.find((q) => q.k === S.coat);
    const summary = () => COATS.filter((q) => tested[q.k]).map((q) => `${q.t}: ${q.res}`).join('; ');
    const paintLog = () => { log.innerHTML = COATS.filter((q) => tested[q.k]).map((q) => `<span><b>${q.t}</b>${q.res}</span>`).join(''); };
    const nTested = () => Object.keys(tested).length;
    const say = () => {
      const C = coat();
      status.innerHTML = S.phase === 'choose' ? '👆 <b>Choose a protection</b> for the gate.' : S.phase === 'scratch' ? (S.coat === 'nothing' ? 'Bare steel: nothing to scratch through. Fast-forward and see.' : S.len > 60 ? 'Scratched! Now fast-forward a year.' : '👉 <b>Scratch the gate</b>: drag your finger across it.') : S.phase === 'run' ? 'A year of rain and air…' : C.line + (nTested() < 3 ? ` Now test another one (${nTested()} of 3).` : !tested.galv ? ' None of your tests has survived a scratch yet: keep testing.' : '');
      ff.disabled = !(S.phase === 'scratch' && (S.coat === 'nothing' || S.len > 60));
      c.style.touchAction = S.phase === 'scratch' && S.coat !== 'nothing' ? 'none' : 'pan-y';
    };
    const btns = COATS.map((C) => { const b = el('button', 'opt', C.t, row); b.type = 'button'; b.onclick = () => { if (S.phase === 'run') return; S.coat = C.k; S.phase = 'scratch'; S.pts = []; S.len = 0; S.t = 0; btns.forEach((q) => q.classList.remove('sel')); b.classList.add('sel'); Book.scribble(0.15); say(); stg.render(0); }; return b; });

    const PANEL = geo.rect(G.x0, G.y0, G.x1 - G.x0, G.y1 - G.y0, 6);
    stg.paint = (x) => {
      const Gr = []; for (let px = 14; px <= 846; px += 8) Gr.push([px, 300 + Math.sin(px * 0.05) * 1.5]); Ink.stroke(x, Gr, { w: 2.6, seed: 3 });
      for (let px = 24; px < 846; px += 30) if (px < 200 || px > 660) Ink.stroke(x, [[px, 300], [px + 5, 288]], { w: 1.4, seed: (px % 50) + 4, retrace: false });
      [[214, 0], [606, 1]].forEach(([px, i]) => { const P = geo.rect(px, 52, 40, 250, 5); Ink.hatchShadow(x, P, 1, 6, 6); paper(x, P); Ink.hatchFill(x, P, 1, B, 0.9); Ink.stroke(x, P, { w: 2.8, seed: 8 + i }); const cap = geo.rect(px - 5, 40, 50, 14, 4); paper(x, cap); Ink.stroke(x, cap, { w: 2.4, seed: 11 + i }); });
      text(x, 'steel gate', 430, 30, { font: 'hand', size: 22, align: 'center' });
    };
    stg.draw = (ctx, t, dt) => {
      let more = false;
      if (S.phase === 'run') { S.t += dt / 2.8; more = true; if (S.t >= 1) { S.t = 1; S.phase = 'result'; finishRun(); } }
      const C = coat(), v = S.t;
      paper(ctx, PANEL); wash(ctx, PANEL, C ? C.wash : 'rgba(120,126,146,.34)');
      if (S.coat === 'paint') Ink.hatchFill(ctx, PANEL, 1, B, 0.9);
      if (S.coat === 'galv') { ctx.save(); ctx.strokeStyle = rgba(B, 0.4); ctx.lineWidth = 1.2; ctx.beginPath(); for (let i = 0; i < 70; i++) { const gx = G.x0 + 12 + ((i * 73) % 296), gy = G.y0 + 10 + ((i * 41) % 182), a = i * 1.7; ctx.moveTo(gx, gy); ctx.lineTo(gx + Math.cos(a) * 9, gy + Math.sin(a) * 9); ctx.moveTo(gx, gy); ctx.lineTo(gx + Math.cos(a + 2) * 7, gy + Math.sin(a + 2) * 7); } ctx.stroke(); ctx.restore(); }
      if (S.coat === 'oil') { ctx.save(); ctx.strokeStyle = rgba(B, 0.5); ctx.lineWidth = 1.5; for (let i = 0; i < 14; i++) { const gx = G.x0 + 24 + ((i * 89) % 280), gy = G.y0 + 20 + ((i * 53) % 160); ctx.beginPath(); ctx.ellipse(gx, gy, 5, 8, 0, 0, 7); ctx.stroke(); } ctx.restore(); }
      if (S.coat === 'nothing' && v > 0) { wash(ctx, PANEL, `rgba(180,74,22,${0.6 * v})`); Ink.hatchFill(ctx, PANEL, v, RD, 1.6); }
      // frame, braces, hinges and latch
      Ink.stroke(ctx, PANEL, { w: S.coat === 'plastic' ? 5 : 3.2, seed: 20, color: S.coat === 'nothing' && v > 0.6 ? RD : B });
      Ink.stroke(ctx, geo.rect(G.x0 + 14, G.y0 + 14, G.x1 - G.x0 - 28, G.y1 - G.y0 - 28, 4), { w: 2, seed: 23, retrace: false });
      Ink.stroke(ctx, [[G.x0 + 14, G.y1 - 14], [G.x1 - 14, G.y0 + 14]], { w: 2.4, seed: 25 });
      [G.y0 + 30, G.y1 - 30].forEach((hy, i) => { const Hn = geo.rect(G.x0 - 20, hy - 7, 44, 14, 4); paper(ctx, Hn); Ink.stroke(ctx, Hn, { w: 2.2, seed: 27 + i }); });
      const La = geo.rect(G.x1 - 26, 170, 46, 12, 4); paper(ctx, La); Ink.stroke(ctx, La, { w: 2.2, seed: 30 });
      // the scratch (bare metal showing through), and what a year does to it
      if (S.pts.length > 1) {
        ctx.save(); path(ctx, PANEL); ctx.clip();
        ctx.save(); ctx.globalCompositeOperation = 'source-over'; ctx.strokeStyle = 'rgba(244,244,240,.98)'; ctx.lineWidth = 7; ctx.lineJoin = ctx.lineCap = 'round'; ctx.beginPath(); S.pts.forEach(([a, b], i) => (i ? ctx.lineTo(a, b) : ctx.moveTo(a, b))); ctx.stroke(); ctx.restore();
        ctx.strokeStyle = rgba(B, 0.75); ctx.lineWidth = 1.3; [-4, 4].forEach((o) => { ctx.beginPath(); S.pts.forEach(([a, b], i) => (i ? ctx.lineTo(a + o * 0.3, b + o) : ctx.moveTo(a + o * 0.3, b + o))); ctx.stroke(); });
        if (v > 0 && S.coat !== 'galv' && S.coat !== 'nothing') {
          let acc = 99; S.pts.forEach(([a, b], i) => { if (i) acc += Math.hypot(a - S.pts[i - 1][0], b - S.pts[i - 1][1]); if (acc < 15) return; acc = 0; const rr = 4 + (10 + (i % 3) * 4) * v, Bl = geo.ellipse(a, b, rr * 1.2, rr); wash(ctx, Bl, `rgba(186,76,22,${0.7 * v})`); Ink.hatchFill(ctx, Bl, v, RD, 2); if (v > 0.5 && i % 2) Ink.stroke(ctx, [[a, b + rr], [a + 1, b + rr + 16 * (v - 0.5) * 2]], { w: 2, color: RD, seed: 90 + (i % 7), retrace: false }); });
        }
        ctx.restore();
      }
      if (S.phase === 'run') rainLines(ctx, t, 40, 270);
      if (S.phase === 'run' || S.phase === 'result') text(ctx, v >= 1 ? '1 year later' : 'month ' + Math.max(1, Math.ceil(v * 12)), 836, 60, { size: 26, align: 'right' });
      if (S.phase === 'result') { const bad = S.coat !== 'galv'; const o = { font: 'hand', size: 24, align: 'center', color: bad ? RD : GR, rot: -0.04 }; if (bad && S.coat !== 'nothing') { text(ctx, 'rust at', 752, 138, o); text(ctx, 'the scratch!', 752, 170, o); } else text(ctx, bad ? 'rust all over!' : 'still no rust!', 752, 150, o); if (!bad) Ink.tick(ctx, 736, 196, 1.4); }
      if (S.phase === 'choose') text(ctx, 'bare steel', 430, 190, { font: 'hand', size: 24, align: 'center', a: 0.7 });
      return more || S.drag;
    };
    function finishRun() {
      tested[S.coat] = 1; Book.sfx(S.coat === 'galv' ? 'success' : 'error', { gain: 0.3 });
      if (!(prev.correct === true || (r.get() || {}).correct === true)) r.set({ answer: `tested: ${summary()} (no conclusion yet)`, correct: null, tested });
      else { const it = r.get(); it.tested = tested; }
      paintLog(); say(); if (nTested() >= 3 && tested.galv && !conc.classList.contains('on')) { conc.classList.add('on'); Book.sfx('paper', { gain: 0.4 }); }
    }
    ff.onclick = () => { if (ff.disabled) return; S.phase = 'run'; S.t = 0; Book.sfx('paper', { gain: 0.4, dur: 0.6 }); say(); stg.go(); };
    c.addEventListener('pointerdown', (e) => {
      if (S.phase === 'choose') { Book.toast('Choose a protection first.'); return; }
      if (S.phase !== 'scratch' || S.coat === 'nothing') return;
      const [x, y] = stg.pos(e); S.drag = true; S.pts = [[x, y]]; S.len = 0; try { c.setPointerCapture(e.pointerId); } catch (er) {} e.preventDefault(); stg.go();
    });
    c.addEventListener('pointermove', (e) => {
      if (!S.drag) return; const [x, y] = stg.pos(e), L = S.pts[S.pts.length - 1], d = Math.hypot(x - L[0], y - L[1]); if (d < 4) return;
      const inside = (p) => p[0] > G.x0 && p[0] < G.x1 && p[1] > G.y0 && p[1] < G.y1;
      if (inside([x, y]) && inside(L)) { const was = S.len; S.len += d; if (was <= 60 && S.len > 60) say(); if (((S.len / 30) | 0) !== ((was / 30) | 0)) Book.sfx('stroke', { material: 'pen', dur: 0.12, gain: 0.5 }); }
      S.pts.push([x, y]); stg.go();
    });
    const up = () => { if (S.drag) { S.drag = false; say(); stg.go(); stg.render(0); } };
    c.addEventListener('pointerup', up); c.addEventListener('pointercancel', up); c.addEventListener('lostpointercapture', up);

    const RIGHT = 'Paint, oil and a plastic coat are only <b>barriers</b>: scratch through them and the steel underneath rusts. The galvanised gate kept protecting the steel <b>even where it was scratched</b>.';
    const COPTS = [{ t: 'paint', k: 'paint' }, { t: 'oil', k: 'oil' }, { t: 'galvanising', k: 'galv', ok: true }, { t: 'a plastic coat', k: 'plastic' }];
    const concBtns = COPTS.map((op) => {
      const b = el('button', 'opt', op.t, concRow); b.type = 'button';
      b.onclick = () => {
        const ok = !!op.ok; b.classList.add(ok ? 'right' : 'wrong');
        r.set({ answer: `tested: ${summary()}; concluded "${op.t}" survives a scratch ${ok ? '✓' : '✗'}`, correct: ok, score: ok ? 1 : 0, max: 1, mis: '', tested });
        if (ok) { concBtns.forEach((q) => (q.disabled = true)); Book.sfx('success', { gain: 0.35 }); fb.className = 'fb on good'; fb.innerHTML = '✓ ' + RIGHT; onDone(); }
        else { Book.sfx('error', { gain: 0.3 }); fb.className = 'fb on bad'; fb.innerHTML = tested[op.k] ? '✗ Look at your results above: what happened at the scratch with that one?' : '✗ You have not tested that one yet. Try it: scratch it and fast-forward.'; }
      };
      return b;
    });
    stg.init(); paintLog(); say();
    if (nTested() >= 3 && tested.galv) conc.classList.add('on');
    if (prev.correct === true) { conc.classList.add('on'); concBtns.forEach((q, i) => { q.disabled = true; if (COPTS[i].ok) q.classList.add('right'); }); fb.className = 'fb on good'; fb.innerHTML = '✓ ' + RIGHT; onDone(); }
  }

  // ======================================================================================
  Book.page({ id: 'p06', title: 'The rust lab', build(ui, root) {
    ui.h('The rust lab');
    ui.p('Steel is cheap, strong and everywhere. Its big weakness: it <b>rusts</b>. So what exactly makes it rust? Four test tubes, each with a clean steel nail inside, are left for two weeks.');
    const pEl = ui.predict({
      id: 'p06.predict', label: 'Prediction: which nail rusts first?',
      q: '<b>Predict first.</b> Look at what is in each tube below. Which nail will rust <b>first</b>?',
      options: PRED, onPick: () => tubes.start(),
    });
    let n1 = null, n2 = null, d1 = false, d2 = false;
    const N1 = '<p style="margin:0"><span class="key">Rust</span> forms when iron or steel meets <b>both oxygen (air) and water</b>. Take either one away and it does not rust. <b>Salt</b> speeds it up.</p>';
    const N2 = `<p style="margin:0 0 6px"><b>Protecting steel:</b></p>
      <p style="margin:0 0 4px">• a <span class="key">barrier</span> that keeps air and water out: paint, oil or grease, a plastic dip coating, powder coating</p>
      <p style="margin:0 0 4px">• <span class="key">plating</span> with another metal: chromium or tin</p>
      <p style="margin:0 0 4px">• <span class="key">galvanising</span>: a coating of <b>zinc</b>. The zinc protects the steel even if it is scratched.</p>
      <p style="margin:0">• or choose a metal that does not rust: stainless steel, aluminium, brass.</p>`;
    const tubes = Tubes(ui, () => { d1 = true; if (n1) n1.querySelector('.ma6-n').innerHTML = N1; });
    tubes.setLock(() => pEl.querySelectorAll('.opt').forEach((b) => (b.disabled = true)));
    n1 = ui.box('<div class="ma6-n"><p class="ma6-locked">🔒 Your notes on rust appear here when you have finished the nail experiment.</p></div>', { tag: 'Notes' });
    if (d1) n1.querySelector('.ma6-n').innerHTML = N1;

    ui.p('So to stop rust, keep the <b>air and water away from the steel</b>. Which way works best?');
    Gate(ui, () => { d2 = true; if (n2) n2.querySelector('.ma6-n').innerHTML = N2; });
    n2 = ui.box('<div class="ma6-n"><p class="ma6-locked">🔒 Your notes on protecting steel appear here when you have finished testing the gate.</p></div>', { tag: 'Notes' });
    if (d2) n2.querySelector('.ma6-n').innerHTML = N2;

    ui.p('<b>Check what you know.</b> The notes above will <b>blur</b> while you answer.');
    const q1 = ui.mcq({
      id: 'p06.galv', label: 'What is galvanising?', q: 'What is <b>galvanising</b>?',
      options: [
        { t: 'Coating steel with a layer of zinc', ok: true, why: 'Yes: a zinc coating (buckets, gates, crash barriers). The zinc goes on protecting the steel even if it gets scratched.' },
        { t: 'Coating steel with a layer of tin', mis: 'galvanise-meaning', why: 'A tin coating is tinplate, used for food cans. Galvanising uses a different metal: check your non-ferrous notes.' },
        { t: 'Mixing zinc into the molten steel', mis: 'galvanise-meaning', why: 'Mixing metals together makes an alloy. Galvanising goes on the outside of finished steel.' },
        { t: 'Spraying steel with a layer of paint', mis: 'galvanise-meaning', why: 'Paint is a barrier, and it failed at the scratch. Galvanising is a metal coating.' },
      ],
    });
    ui.hideWhile(q1, 'p06.galv', [n2]);
    const q2 = ui.sort({
      id: 'p06.rusts', label: 'Sort 8 metals: rusts / does not rust',
      q: 'Left outside in the rain with no protection. Tap a metal, then tap its box.',
      buckets: ['Rusts', 'Does not rust'],
      items: [
        { t: 'low carbon steel', b: 0, mis: 'ferrous-meaning' }, { t: 'high carbon steel', b: 0, mis: 'ferrous-meaning' }, { t: 'cast iron', b: 0, mis: 'ferrous-meaning' },
        { t: 'aluminium', b: 1, mis: 'ferrous-meaning' }, { t: 'copper', b: 1, mis: 'ferrous-meaning' }, { t: 'zinc', b: 1, mis: 'ferrous-meaning' },
        { t: 'brass', b: 1, mis: 'ferrous-meaning' }, { t: 'stainless steel', b: 1, mis: 'alloy-mixup' },
      ],
      explain: 'Rust needs iron: the ferrous metals rust, the non-ferrous metals and brass do not. The exception is stainless steel: it is ferrous, but its chromium forms an invisible protective oxide layer.',
    });
    ui.hideWhile(q2, 'p06.rusts', [n2]);
  } });
})();
