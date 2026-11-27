// Page 5 — Composites. (1) Mud brick v mud-and-straw brick pull test: matrix + reinforcement. (2) The concrete beam
// lab: a pillar that takes any squash, a beam that cracks from the bottom, steel bars dragged into the top or bottom.
// (3) Lay-up workshop: pick a matrix and a reinforcement for a canoe and a racing bike, then test strength / weight /
// cost. Predict → test → conclude; the notes for a bench only appear once it is finished.
(function () {
  'use strict';
  const B = Ink.BLUE, RD = Ink.RED, GR = Ink.GREEN, rgba = Ink.rgba, geo = Ink.geo;
  const LABF = (s) => `600 ${s}px ${Ink.FONTS.bubble}, sans-serif`;
  const HANDF = (s) => `400 ${s}px ${Ink.FONTS.hand}`;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const PAPER = 'rgba(251,250,245,.97)';
  const W = 860;

  if (!document.getElementById('cmp-css')) {
    const s = document.createElement('style'); s.id = 'cmp-css';
    s.textContent = `
      .cmp-lab { position: relative; margin: 0 0 calc(var(--R) * .6); padding: 12px 16px 16px; background: rgba(251,250,245,.9); }
      .cmp-lab > * { position: relative; }
      .cmp-step { font: 700 14px Fredoka, system-ui; letter-spacing: .08em; text-transform: uppercase; color: var(--red); line-height: 22px; }
      .cmp-task { font-size: 19px; line-height: 1.5; margin: 0 0 8px; }
      .cmp-task b, .cmp-q b { font-family: Fredoka, system-ui; font-weight: 600; }
      .cmp-q { font-size: 19px; line-height: 1.5; margin: 6px 0 8px; }
      .cmp-btns { display: flex; flex-wrap: wrap; gap: 10px; align-items: stretch; margin: 0 0 8px; }
      .cmp-btns .opt { flex: 1 1 170px; text-align: center; min-height: 52px; }
      .cmp-btns .btn { margin-top: 0; min-height: 52px; }
      .cmp-cv { display: block; width: 100%; height: auto; touch-action: pan-y; user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; cursor: pointer; }
      .cmp-conc { display: none; margin-top: 6px; padding-top: 6px; border-top: 2px dashed rgba(30,46,150,.3); }
      .cmp-conc.on { display: block; }
      .cmp-locked { font-size: 17px; opacity: .75; }
      .cmp-notes p { margin: 0 0 6px; }
      .cmp-shelf { display: flex; flex-wrap: wrap; gap: 10px; margin: 0 0 10px; }
      .cmp-shelf .opt { flex: 1 1 150px; text-align: center; min-height: 54px; font-family: Fredoka, system-ui; font-weight: 600; font-size: 18px; }
      .cmp-shelf .opt.picked { border-color: var(--red); background: #fff3f0; transform: translateY(-3px); box-shadow: 0 4px 0 rgba(178,28,38,.35); }
      .cmp-slots { display: flex; gap: 12px; margin: 0 0 10px; }
      .cmp-slot { flex: 1 1 0; min-width: 0; min-height: 84px; border: 2.5px dashed rgba(30,46,150,.55); border-radius: 12px; background: #fff; padding: 6px 8px 8px; text-align: center; cursor: pointer; font: 600 19px Fredoka, system-ui; color: var(--ink); line-height: 1.3; }
      .cmp-slot small { display: block; font: 700 13px Fredoka, system-ui; letter-spacing: .08em; color: var(--red); margin-bottom: 4px; }
      .cmp-slot i { font-style: normal; font-weight: 400; opacity: .55; font-size: 16px; }
      .cmp-slot.full { border-style: solid; background: #eef1ff; }
      .cmp-plus { align-self: center; font: 700 26px Fredoka, system-ui; color: var(--ink); }
    `;
    document.head.appendChild(s);
  }

  // ---------- small drawing helpers ----------
  function text(x, s, px, py, o = {}) {
    x.save(); x.font = (o.font === 'hand' ? HANDF : LABF)(o.size || 22);
    x.fillStyle = rgba(o.color || B, o.a ?? 0.92); x.textAlign = o.align || 'left'; x.textBaseline = 'alphabetic';
    x.translate(px, py); if (o.rot) x.rotate(o.rot); if (o.max) x.fillText(s, 0, 0, o.max); else x.fillText(s, 0, 0); x.restore();
  }
  function paper(x, pts, style = PAPER) { x.save(); x.globalCompositeOperation = 'source-over'; x.fillStyle = style; x.beginPath(); pts.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.closePath(); x.fill(); x.restore(); }
  const shift = (P, dx, dy) => P.map(([a, b]) => [a + dx, b + dy]);
  const rotP = (P, cx, cy, an) => { const c = Math.cos(an), s = Math.sin(an); return P.map(([a, b]) => [cx + (a - cx) * c - (b - cy) * s, cy + (a - cx) * s + (b - cy) * c]); };
  const arrow = (x, P, o) => { Ink.stroke(x, P, o); Ink.stroke(x, geo.head(P, o.head || 12), Object.assign({}, o, { seed: (o.seed || 1) + 1 })); };
  const rng = (seed) => { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); };

  function Stage(parent, H) {
    const c = document.createElement('canvas'); c.className = 'cmp-cv'; parent.appendChild(c);
    const dpr = Math.min(2, window.devicePixelRatio || 1); c.width = W * dpr; c.height = H * dpr; c.style.aspectRatio = W + ' / ' + H;
    const ctx = c.getContext('2d'), S = { c, ctx, H, time: 0 };
    let layer = null, raf = 0, last = 0;
    S.repaint = () => { layer = document.createElement('canvas'); layer.width = W * dpr; layer.height = H * dpr; const x = layer.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.lineCap = x.lineJoin = 'round'; if (S.paint) S.paint(x); S.draw(); };
    S.draw = () => { ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H); ctx.globalCompositeOperation = 'multiply'; ctx.lineCap = ctx.lineJoin = 'round'; if (layer) ctx.drawImage(layer, 0, 0, W, H); if (S.render) S.render(ctx, S.time); };
    const hidden = () => { const p = c.closest('.page'); return !p || p.classList.contains('hidden'); };
    function frame(now) { raf = 0; if (hidden()) return; const dt = Math.min(0.05, (now - last) / 1000 || 0.016); last = now; S.time += dt; const more = S.step ? S.step(dt) : false; S.draw(); if (more) raf = requestAnimationFrame(frame); }
    S.go = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } };
    S.pos = (e) => { const r = c.getBoundingClientRect(); return [((e.clientX - r.left) * W) / r.width, ((e.clientY - r.top) * H) / r.height]; };
    S.start = () => { S.repaint(); if (document.fonts && document.fonts.ready) document.fonts.ready.then(S.repaint); };
    S.drag = (hit, down, move, up) => {
      let on = false;
      c.addEventListener('touchstart', (e) => { const [x, y] = S.pos(e.changedTouches[0]); if (hit(x, y)) e.preventDefault(); }, { passive: false });
      c.addEventListener('pointerdown', (e) => { const [x, y] = S.pos(e); if (!hit(x, y)) { down(x, y, false); return; } on = true; try { c.setPointerCapture(e.pointerId); } catch (er) {} down(x, y, true); e.preventDefault(); S.go(); });
      c.addEventListener('pointermove', (e) => { if (!on) return; const [x, y] = S.pos(e); move(x, y); S.go(); });
      const end = () => { if (!on) return; on = false; up(); S.go(); };
      c.addEventListener('pointerup', end); c.addEventListener('pointercancel', end); c.addEventListener('lostpointercapture', end);
    };
    return S;
  }

  function Shell(ui, o) {
    const el = ui.el;
    const lab = el('div', 'cmp-lab'); requestAnimationFrame(() => Ink.frame(lab, { shadow: false, w: 2.2 }));
    el('div', 'cmp-step', o.step, lab);
    el('p', 'cmp-task', o.task, lab);
    let predRow = null;
    if (o.predQ) { el('div', 'cmp-q', `<b>Predict first.</b> ${o.predQ}`, lab); predRow = el('div', 'cmp-btns', '', lab); }
    const body = el('div', '', '', lab);
    const conc = el('div', 'cmp-conc', o.concQ ? `<div class="cmp-q"><b>What did you find?</b> ${o.concQ}</div>` : '', lab), concRow = el('div', 'cmp-btns', '', conc), fb = el('div', 'fb', '', conc);
    const notes = ui.box(`<div class="cmp-notes"><p class="cmp-locked">🔒 The notes for this bench appear here when you have finished it.</p></div>`, { tag: 'Notes' });
    const sh = { lab, body, predRow, conc, notes, pred: null, done: false };
    sh.predict = (opts, cur, onPick, locked) => {
      sh.pred = cur || null;
      const bs = opts.map((t) => { const b = el('button', 'opt', t, predRow); b.type = 'button'; if (cur === t) b.classList.add('sel');
        b.onclick = () => { if (locked()) return; bs.forEach((q) => q.classList.remove('sel')); b.classList.add('sel'); sh.pred = t; Book.scribble(0.12); onPick(t); }; return b; });
      sh.lockPred = () => bs.forEach((b) => (b.disabled = true));
    };
    sh.conclude = (opts, seed, onAnswer, rightMsg) => {
      const order = Book.shuffle(opts, seed);
      const bs = order.map((op) => { const b = el('button', 'opt', Book.esc(op.t), concRow); b.type = 'button'; b._op = op;
        b.onclick = () => {
          b.classList.add(op.ok ? 'right' : 'wrong'); onAnswer(op);
          if (op.ok) { bs.forEach((q) => (q.disabled = true)); fb.className = 'fb on good'; fb.innerHTML = '✓ ' + rightMsg() + ' The notes are unlocked below.'; sh.finish(); }
          else { Book.sfx('error', { gain: 0.3 }); fb.className = 'fb on bad'; fb.innerHTML = '✗ ' + op.why; }
        }; return b; });
      sh.showConc = (quiet) => { if (!conc.classList.contains('on')) { conc.classList.add('on'); if (!quiet) Book.sfx('paper', { gain: 0.4 }); } };
      sh.restoreDone = () => { conc.classList.add('on'); bs.forEach((q) => { q.disabled = true; if (q._op.ok) q.classList.add('right'); }); fb.className = 'fb on good'; fb.innerHTML = '✓ ' + rightMsg(); sh.finish(true); };
    };
    sh.finish = (quiet) => { sh.done = true; if (sh.lockPred) sh.lockPred(); notes.querySelector('.cmp-notes').innerHTML = o.notes; if (!quiet) Book.sfx('success', { gain: 0.35 }); };
    return sh;
  }

  // ======================================================================================
  // bench 1: mud brick v mud-and-straw brick, pulled apart
  // ======================================================================================
  function benchBrick(ui) {
    const H = 292, BX = 72, BL = 400, BH = 68, Y = [48, 186], RING = 610, DMAX = 170, SNAP = 0.4;
    const r = ui.record('p05.brick', { label: 'Mud v mud-and-straw brick pull test → why did the straw brick hold?', type: 'experiment', max: 1 });
    const prev = r.get() || {};
    const sh = Shell(ui, {
      step: 'Bench 1 · the oldest trick in building',
      task: 'Two sun-dried bricks. <b>A</b> is just mud. <b>B</b> is the same mud with chopped straw mixed in. <b>Drag each ring to the right</b> to pull the brick as hard as you can.',
      concQ: 'Why did brick B hold when brick A snapped?',
      notes: `<p>A <span class="key">composite</span> is made by <b>combining two or more different materials</b> to get a new material with <b>improved properties</b>.</p>
        <p>Usually a <span class="key">reinforcement</span> (fibres or particles: <b>gives strength</b>) is held in a <span class="key">matrix</span> (<b>binds it and holds it in shape</b>). In the brick: straw = reinforcement, mud = matrix.</p>
        <p>The materials <b>stay separate</b>: they are not chemically mixed like the metals in an alloy. <span class="small">Straw + mud bricks are an early composite. Plywood and MDF are composites too.</span></p>`,
    });
    const S = Stage(sh.body, H);
    const st = [{ d: 0, max: 0, broken: !!prev.a, gap: prev.a ? 26 : 0 }, { d: 0, max: prev.b ? 1 : 0, broken: false, gap: 0 }];
    let grab = -1;
    const specks = [0, 1].map((k) => { const q = rng(77 + k * 31), o = []; for (let i = 0; i < 46; i++) o.push([q() * (BL - 16) + 8, q() * (BH - 14) + 7]); return o; });
    const straws = (() => { const q = rng(1234), o = []; for (let i = 0; i < 22; i++) { const x = 14 + q() * (BL - 70), y = 9 + q() * (BH - 18), l = 30 + q() * 34, a = (q() - 0.5) * 0.7; o.push([[x, y], [x + Math.cos(a) * l, clamp(y + Math.sin(a) * l, 5, BH - 5)]]); } return o; })();
    const JAG = [[200, 0], [191, 15], [206, 31], [193, 49], [203, BH]];
    S.paint = (x) => {
      const wall = geo.rect(26, 14, 46, H - 28, 3); paper(x, wall); Ink.hatchFill(x, wall, 1, B, 1.5); Ink.stroke(x, wall, { w: 2.8, seed: 3 });
      text(x, 'A: mud only', BX + 12, Y[0] - 10, { size: 24 }); text(x, 'B: mud + straw', BX + 12, Y[1] - 10, { size: 24 });
    };
    function brick(ctx, k) {
      const b = st[k], y = Y[k], p = b.d / DMAX, str = b.broken ? 0 : p * 5;
      const drawPart = (x0, x1, dx, jagL, jagR, seed) => {
        const top = [[x0, 0], [x1, 0]], P = [...(jagL ? JAG.slice() : [[x0, 0], [x0, BH]]).reverse(), ...(jagR ? JAG : [[x1, 0], [x1, BH]])];
        const Q = shift(P, BX + dx, y); void top;
        paper(ctx, Q); Ink.hatchFill(ctx, Q, 0.55, B, 0.6); Ink.stroke(ctx, [...Q, Q[0]], { w: 3, seed });
        ctx.fillStyle = rgba(B, 0.6); specks[k].forEach(([sx, sy]) => { const inP = jagL ? sx > 212 : jagR ? sx < 186 : true; if (inP && sx >= x0 && sx <= x1) { ctx.beginPath(); ctx.arc(BX + dx + sx, y + sy, 1.6, 0, 7); ctx.fill(); } });
      };
      if (b.broken) { drawPart(0, 200, 0, false, true, 11 + k); drawPart(200, BL, b.gap, true, false, 15 + k); }
      else drawPart(0, BL, 0, false, false, 11 + k);
      if (k === 1) {
        straws.forEach((s, i) => Ink.stroke(ctx, shift(s, BX, y), { w: 2, seed: 30 + i, retrace: false, amp: 0.4 }));
        if (b.max > SNAP) [[150, 0, 26], [262, BH, -30]].forEach(([cx, cy, dy], i) => Ink.stroke(ctx, [[BX + cx, y + cy], [BX + cx + 5, y + cy + dy * 0.5], [BX + cx - 3, y + cy + dy]], { w: 1.8, color: RD, seed: 60 + i, retrace: false, amp: 0.5 }));
      }
      // end clamp, spring balance and ring
      const ex = BX + BL + (b.broken ? b.gap : str), rx = RING + b.d;
      const cl = geo.rect(ex - 4, y + 6, 26, BH - 12, 4); paper(ctx, cl); Ink.hatchFill(ctx, cl, 1, B, 1.6); Ink.stroke(ctx, cl, { w: 2.6, seed: 21 + k });
      const x0 = ex + 22, x1 = rx - 26, Z = [[x0, y + BH / 2], [x0 + 10, y + BH / 2]]; const n = 9; for (let i = 0; i < n; i++) Z.push([lerp(x0 + 10, x1 - 10, (i + 0.5) / n), y + BH / 2 + (i % 2 ? 13 : -13)]); Z.push([x1 - 10, y + BH / 2], [x1, y + BH / 2]);
      Ink.stroke(ctx, Z, { w: 2.4, seed: 25 + k, amp: 0.3, color: !b.broken && p > 0.3 ? RD : B });
      const ring = geo.ellipse(rx, y + BH / 2, 25, 25); paper(ctx, ring); Ink.stroke(ctx, ring, { w: 4, seed: 27 + k, color: grab === k ? RD : B });
      if (b.d < 4 && grab !== k && !(k === 0 ? b.broken : b.max >= 0.97)) { const P = [[rx + 40, y + BH / 2], [rx + 110, y + BH / 2]]; arrow(ctx, P, { w: 3, color: RD, seed: 71 + k, head: 15 }); text(ctx, 'pull', rx + 122, y + BH / 2 + 8, { size: 22, color: RD }); }
      if (k === 0 && b.broken) text(ctx, 'snapped!', BX + 330, y - 10, { font: 'hand', size: 24, color: RD, rot: -0.03 });
      if (k === 1 && b.max >= 0.97) text(ctx, grab === 1 ? 'full pull… it holds!' : 'held the full pull', BX + 330, y - 10, { font: 'hand', size: 24, color: GR, rot: -0.03, max: 250 });
    }
    S.render = (ctx) => { brick(ctx, 0); brick(ctx, 1); };
    S.step = (dt) => { let more = grab >= 0; st.forEach((b, k) => { if (k !== grab) { const rest = b.broken ? b.gap : 0; if (b.d > rest) { b.d = Math.max(rest, b.d - dt * 900); more = true; } } }); return more; };
    const which = (x, y) => { for (let k = 0; k < 2; k++) if (Math.hypot(x - (RING + st[k].d), y - (Y[k] + BH / 2)) < 54) return k; return -1; };
    let off = 0;
    S.drag((x, y) => which(x, y) >= 0,
      (x, y, hit) => { if (hit) { grab = which(x, y); off = st[grab].d - x; Book.sfx('tick', { gain: 0.4 }); } },
      (x) => {
        const b = st[grab]; if (!b) return; b.d = clamp(x + off, b.broken ? b.gap : 0, DMAX); const p = b.d / DMAX; const m0 = b.max; b.max = Math.max(b.max, p);
        if (grab === 0 && !b.broken && p > SNAP) { b.broken = true; b.gap = 26; Book.sfx('thud', { gain: 0.6 }); save(null); }
        if (grab === 0 && b.broken) b.gap = Math.max(26, Math.min(b.d, 60));
        if (grab === 1 && m0 <= SNAP && b.max > SNAP) Book.sfx('tick', { gain: 0.5 });
        if (grab === 1 && m0 < 0.97 && b.max >= 0.97) { Book.sfx('pop', { gain: 0.5 }); save(null); }
      },
      () => { grab = -1; if (st[0].broken && st[1].max >= 0.97) sh.showConc(); else if (st[1].max > 0.1 && st[1].max < 0.97 && !st[0].broken) Book.toast('Pull harder: drag the ring all the way to the right.'); });
    const save = (op) => {
      const base = `brick A (mud): ${st[0].broken ? 'snapped at a small pull' : 'not tested'}; brick B (mud + straw): ${st[1].max >= 0.97 ? 'held the full pull' : 'not fully tested'}`;
      if (!op) r.set({ answer: base, correct: sh.done ? true : null, a: st[0].broken, b: st[1].max >= 0.97 });
      else r.set({ answer: `${base}; concluded "${op.t}" ${op.ok ? '✓' : '✗'}`, correct: op.ok, score: op.ok ? 1 : 0, max: 1, mis: op.ok ? '' : op.mis, a: true, b: true });
    };
    sh.conclude([
      { t: 'Straw fibres carry the pull while the mud holds them in place', ok: true },
      { t: 'Straw soaks up water, so the mud around it dries much harder', mis: 'composite-meaning', why: 'The mud is the same in both bricks. Look at the small cracks in B: what is bridging them and taking the pull?' },
      { t: 'Straw and mud react to make one brand-new, stronger material', mis: 'composite-meaning', why: 'Nothing has reacted: you can still see the straw and the mud. They stay separate, and each does its own job.' },
    ], 23, save, () => 'Two materials, two jobs: the fibres give strength, the mud binds them and gives the shape.');
    S.start();
    if (prev.correct === true) sh.restoreDone(); else if (prev.a && prev.b) sh.showConc(true);
    return sh;
  }

  // ======================================================================================
  // bench 2: the concrete beam lab
  // ======================================================================================
  function benchBeam(ui) {
    const H = 400, GROUND = 356, PX = 104, PTOP = 252, XL = 270, XR = 810, BT = 236, BD = 54, SL = 304, SR = 776, MID = 540, WH = 22, NMAX = 8;
    const rPred = ui.record('p05.beam-predict', { label: 'Concrete beam: prediction (where will the first crack start?)', type: 'predict', max: 0 });
    const r = ui.record('p05.beam', { label: 'Concrete beam lab: pillar, plain beam, steel bar top/bottom → why does rebar work?', type: 'experiment', max: 1 });
    const prev = r.get() || {}, prevP = rPred.get() || {};
    const sh = Shell(ui, {
      step: 'Bench 2 · the concrete lab',
      task: 'Same concrete, two tests. A short <b>pillar</b> (weights squash it) and a <b>beam</b> resting on two supports (weights bend it). Load them both.',
      predQ: 'You keep adding weights to the middle of the beam. Where will the <b>first crack</b> start?',
      concQ: 'Why does a steel bar near the <b>bottom</b> stop the beam cracking?',
      notes: `<p><span class="key">Concrete</span> = <b>cement</b> (the matrix: it binds) + <b>aggregate</b> (sand and gravel / stones) + <b>water</b>. It sets hard by a chemical reaction.</p>
        <p>It is very <b>strong in compression</b> (squashing) but <b>weak in tension</b> (pulling). Cheap, durable, fire-resistant, and can be cast into any shape.</p>
        <p><span class="key">Reinforced concrete</span> has <b>steel bars (rebar)</b> cast inside to <b>carry the tension</b>. Used for buildings, bridges, foundations, roads and dams.</p>`,
    });
    const stepP = ui.el('p', 'cmp-q', '', sh.body);
    const S = Stage(sh.body, H);
    const F = Object.assign({ pillarMax: 0, brokePlain: false, brokeTop: false, held: false }, prev.f || {});
    const M = { live: !!prevP.answer, nP: 0, nB: 0, bar: null, crack: 0, crackT: 0, broken: false, brk: 0, dragBar: null, msg: '', msgC: B };
    const cap = () => (M.bar === 'bottom' ? 99 : 4);
    const specks = (() => { const q = rng(99), o = []; for (let i = 0; i < 70; i++) o.push([XL + 8 + q() * (XR - XL - 16), 6 + q() * (BD - 12), 1.4 + q() * 2.6]); return o; })();
    S.paint = (x) => {
      Ink.stroke(x, [[20, GROUND], [W - 20, GROUND]], { w: 2.6, seed: 3 });
      const pil = geo.rect(PX - 40, PTOP, 80, GROUND - PTOP, 3); Ink.hatchShadow(x, pil, 1, 7, 0); paper(x, pil); Ink.hatchFill(x, pil, 0.45, B, 0.6); Ink.stroke(x, pil, { w: 3, seed: 5 });
      const q = rng(5); x.fillStyle = rgba(B, 0.55); for (let i = 0; i < 26; i++) { x.beginPath(); x.arc(PX - 32 + q() * 64, PTOP + 8 + q() * (GROUND - PTOP - 16), 1.4 + q() * 2.4, 0, 7); x.fill(); }
      [SL, SR].forEach((sx, i) => { const T = [[sx, BT + BD + 2], [sx + 34, GROUND], [sx - 34, GROUND], [sx, BT + BD + 2]]; paper(x, T); Ink.hatchFill(x, T, 1, B, 1.4); Ink.stroke(x, T, { w: 2.8, seed: 7 + i }); });
      text(x, 'pillar', PX, GROUND + 30, { size: 24, align: 'center' }); text(x, 'beam', MID, GROUND + 30, { size: 24, align: 'center' });
    };
    const sagAt = (x) => (M.broken ? 0 : M.nB * (M.bar === 'bottom' ? 0.55 : 1.5) * Math.sin(Math.PI * clamp((x - SL) / (SR - SL))));
    function weight(ctx, cx, y, i, tilt) {
      let P = geo.rect(cx - 48 + (i % 2) * 5, y, 96, WH - 2, 5); if (tilt) P = rotP(P, cx, y + WH / 2, tilt);
      paper(ctx, P); Ink.hatchFill(ctx, P, 0.9, B, 1.5); Ink.stroke(ctx, P, { w: 2.4, seed: 40 + i * 3 });
    }
    function rack(ctx) {
      for (let i = 0; i < 3; i++) Ink.stroke(ctx, [[628, 24 + i * 11], [832, 24 + i * 11]], { w: 4, seed: 80 + i, amp: 0.3 });
      Ink.stroke(ctx, [[640, 16], [640, 56]], { w: 2, seed: 85, retrace: false }); Ink.stroke(ctx, [[818, 16], [818, 56]], { w: 2, seed: 86, retrace: false });
      text(ctx, 'steel bars: drag one in', 832, 82, { size: 22, align: 'right', color: !M.bar && !M.dragBar ? RD : B });
    }
    function beamHalf(ctx, x0, x1, pivot, ang) {
      const top = [], bot = []; for (let i = 0; i <= 18; i++) { const x = lerp(x0, x1, i / 18), d = sagAt(x); top.push([x, BT + d]); bot.push([x, BT + BD + d]); }
      let P = [...top, ...bot.reverse()]; const tr = (Q) => (ang ? rotP(Q, pivot, BT + BD, ang) : Q);
      P = tr(P); paper(ctx, P); Ink.hatchFill(ctx, P, 0.4, B, 0.55); Ink.stroke(ctx, [...P, P[0]], { w: 3, seed: x0 | 0 });
      ctx.fillStyle = rgba(B, 0.55); specks.forEach(([sx, sy, sr]) => { if (sx > x0 + 4 && sx < x1 - 4) { const [[px, py]] = tr([[sx, BT + sy + sagAt(sx)]]); ctx.beginPath(); ctx.arc(px, py, sr, 0, 7); ctx.fill(); } });
      if (M.bar) { const yy = M.bar === 'top' ? 11 : BD - 11, L = []; for (let i = 0; i <= 12; i++) { const x = lerp(Math.max(x0, XL + 14), Math.min(x1, XR - 14), i / 12); L.push([x, BT + yy + sagAt(x)]); } Ink.stroke(ctx, tr(L), { w: 5.5, seed: 91, amp: 0.3, color: [20, 28, 90] }); }
    }
    S.render = (ctx) => {
      // pillar weights
      for (let i = 0; i < M.nP; i++) weight(ctx, PX, PTOP - (i + 1) * WH, i);
      if (M.nP) text(ctx, '×' + M.nP, PX + 62, PTOP - M.nP * WH + 20, { size: 24 });
      if (M.nP) { arrow(ctx, [[PX - 58, PTOP + 14], [PX - 58, PTOP + 50]], { w: 2.6, color: RD, seed: 51, head: 11 }); arrow(ctx, [[PX - 58, GROUND - 10], [PX - 58, GROUND - 46]], { w: 2.6, color: RD, seed: 53, head: 11 }); }
      // beam
      const a = 0.2 * M.brk;
      if (M.broken) { beamHalf(ctx, XL, MID, SL, a); beamHalf(ctx, MID, XR, SR, -a); }
      else beamHalf(ctx, XL, XR, 0, 0);
      const d = sagAt(MID);
      if (!M.broken && M.crack > 0.01) { const h = BD * M.crack, C = [[MID, BT + BD + d], [MID - 5, BT + BD + d - h * 0.35], [MID + 5, BT + BD + d - h * 0.7], [MID - 2, BT + BD + d - h]]; Ink.stroke(ctx, C, { w: 2.8, color: RD, seed: 57, amp: 0.4 }); }
      if (!M.broken && M.nB > 0) {                          // what the beam feels: top squashed, bottom stretched
        const yt = BT + d + 14, yb = BT + BD + d - 14;
        if (M.bar !== 'top') { arrow(ctx, [[MID - 200, yt], [MID - 130, yt]], { w: 2.6, color: RD, seed: 61, head: 11 }); arrow(ctx, [[MID + 200, yt], [MID + 130, yt]], { w: 2.6, color: RD, seed: 63, head: 11 }); }
        if (M.bar !== 'bottom') { arrow(ctx, [[MID - 130, yb], [MID - 200, yb]], { w: 2.6, color: RD, seed: 65, head: 11 }); arrow(ctx, [[MID + 130, yb], [MID + 200, yb]], { w: 2.6, color: RD, seed: 67, head: 11 }); }
        text(ctx, 'top: squashed → ←    bottom: stretched ← →', MID, BT + BD + 44, { size: 22, align: 'center', color: RD, max: 400 });
      }
      const drop = M.broken ? 46 * M.brk : d;
      for (let i = 0; i < M.nB; i++) weight(ctx, MID, BT + drop - (i + 1) * WH, i, M.broken ? (i % 2 ? 0.1 : -0.12) * M.brk : 0);
      if (M.nB) text(ctx, '×' + M.nB, MID - 60, BT + drop - M.nB * WH + 20, { size: 24, align: 'right' });
      if (F.brokePlain) rack(ctx);
      if (M.dragBar) Ink.stroke(ctx, [[M.dragBar[0] - 250, M.dragBar[1]], [M.dragBar[0] + 250, M.dragBar[1]]], { w: 5.5, seed: 91, amp: 0.3, color: RD });
      if (!M.live) text(ctx, 'predict first!', 180, 40, { font: 'hand', size: 24, color: RD, rot: -0.02 });
      else if (M.msg) text(ctx, M.msg, 176, 40, { font: 'hand', size: 23, color: M.msgC, rot: -0.01, max: 430 });
    };
    S.step = (dt) => {
      let more = false;
      if (M.crackT > M.crack) { M.crack = Math.min(M.crackT, M.crack + dt * 1.6); more = true; }
      if (M.broken && M.brk < 1) { M.brk = Math.min(1, M.brk + dt * 3.2); more = true; }
      return more || !!M.dragBar;
    };
    // ---- steel bar dragging ----
    const inRack = (x, y) => F.brokePlain && x > 600 && y < 92;
    const inBeam = (x, y) => x > XL && x < XR && y > BT - 24 && y < BT + BD + 24;
    const canBar = () => !M.broken && M.nB === 0;
    S.drag((x, y) => M.live && canBar() && ((inRack(x, y) && !M.bar) || (M.bar && inBeam(x, y))),
      (x, y, hit) => {
        if (!hit) { if (!M.live) Book.toast('Predict first: then you can load the beam.'); else if ((inRack(x, y) || (M.bar && inBeam(x, y))) && !canBar()) Book.toast(M.broken ? 'Cast a new beam first.' : 'Take the weights off before you move a steel bar.'); else if (inRack(x, y) && M.bar) Book.toast('One bar is enough: drag the bar inside the beam to move it.'); return; }
        M.bar = null; M.dragBar = [clamp(x, 290, 570), y]; Book.sfx('tick', { gain: 0.4 });
      },
      (x, y) => { M.dragBar = [clamp(x, 290, 570), clamp(y, 20, GROUND - 10)]; },
      () => { const [, y] = M.dragBar; M.dragBar = null; if (y > BT - 40 && y < BT + BD + 40) { M.bar = y < BT + BD / 2 ? 'top' : 'bottom'; Book.sfx('thud', { gain: 0.4 }); M.msg = `bar cast in near the ${M.bar}: now load the beam`; M.msgC = B; } else { M.msg = 'drop the bar inside the beam: top or bottom'; M.msgC = RD; } upd(); });
    // ---- buttons ----
    const row = ui.el('div', 'cmp-btns', '', sh.body);
    const bP = ui.el('button', 'btn ghost', '+ Weight on the pillar', row), bB = ui.el('button', 'btn ghost', '+ Weight on the beam', row), bC = ui.el('button', 'btn ghost', 'Clear the weights', row);
    [bP, bB, bC].forEach((b) => (b.type = 'button'));
    const need = () => { if (!M.live) { Book.toast('Predict first: then you can load them.'); return true; } return false; };
    bP.onclick = () => { if (need() || M.nP >= NMAX) return; M.nP++; F.pillarMax = Math.max(F.pillarMax, M.nP); Book.sfx('thud', { gain: 0.45 }); if (M.nP === NMAX) { M.msg = 'the pillar takes all 8: no cracks at all'; M.msgC = GR; save(null); } upd(); };
    bB.onclick = () => {
      if (need() || M.broken || M.nB >= NMAX) return; M.nB++; Book.sfx('thud', { gain: 0.45 });
      if (M.nB >= cap()) { M.broken = true; M.brk = 0; Book.sfx('error', { gain: 0.4 }); if (M.bar === 'top') { F.brokeTop = true; M.msg = 'broke again! The bar at the top did not help'; } else { F.brokePlain = true; M.msg = 'SNAP! The crack ran up from the bottom'; } M.msgC = RD; save(null); }
      else if (M.nB === cap() - 1) { M.crackT = 0.62; M.msg = 'a crack… look where it starts'; M.msgC = RD; }
      else if (M.bar === 'bottom' && M.nB === NMAX) { F.held = true; M.msg = 'all 8 weights and no crack!'; M.msgC = GR; Book.sfx('pop', { gain: 0.5 }); save(null); }
      upd();
    };
    bC.onclick = () => { if (need()) return; const was = M.broken; M.nB = 0; M.nP = 0; M.crack = M.crackT = 0; M.broken = false; M.brk = 0; if (was) { M.bar = null; M.msg = F.brokePlain ? 'new beam cast: drag a steel bar into it' : ''; M.msgC = B; } Book.sfx('paper', { gain: 0.4 }); upd(); };
    function upd() {
      bB.disabled = M.broken || M.nB >= NMAX; bP.disabled = M.nP >= NMAX; bC.textContent = M.broken ? 'Cast a new beam' : 'Clear the weights';
      stepP.innerHTML = !M.live ? '' : sh.done ? '<b>Finished.</b> You can keep testing: try the bar in the other position.'
        : !F.brokePlain ? `<b>Step 1.</b> Stack weights on the pillar and on the beam. Which one gives up first?${F.pillarMax >= NMAX ? '' : ' <span class="small">(Try all 8 on the pillar.)</span>'}`
        : !F.held ? `<b>Step 2.</b> Cast a new beam, then <b>drag a steel bar</b> into it: near the top or near the bottom? Load it again.${F.brokeTop ? ' <span class="small">The top did not work. Clear, then move the bar.</span>' : ''}`
        : '<b>Step 3.</b> Answer the question below.';
      if (F.brokePlain && F.held) sh.showConc();
      S.draw(); S.go();
    }
    const save = (op) => {
      const base = `predicted first crack "${sh.pred}"; pillar held ${F.pillarMax} weights with no crack; plain beam ${F.brokePlain ? 'cracked from the bottom at 3 weights and broke at 4' : 'not broken yet'}; steel bar at top: ${F.brokeTop ? 'still broke at 4' : 'not tried'}; steel bar at bottom: ${F.held ? 'held all 8' : 'not tested to 8'}`;
      if (!op) r.set({ answer: base, correct: sh.done ? true : null, f: F });
      else r.set({ answer: `${base}; concluded "${op.t}" ${op.ok ? '✓' : '✗'}`, correct: op.ok, score: op.ok ? 1 : 0, max: 1, mis: op.ok ? '' : op.mis, f: F });
    };
    const PRED = ['at the top, in the middle', 'at the bottom, in the middle', 'at the ends, over the supports'];
    sh.predict(PRED, prevP.answer, (t) => { rPred.set({ answer: t, correct: null }); M.live = true; Book.sfx('pop', { gain: 0.45 }); upd(); }, () => F.brokePlain || sh.done);
    sh.conclude([
      { t: 'Concrete is weak in tension; the steel carries the stretch at the bottom', ok: true },
      { t: 'Concrete is weak in compression; the steel carries the squash at the bottom', mis: 'concrete-tension', why: 'The pillar took every weight you had in pure squash: concrete is strong in compression. Look at the arrows: what is happening to the bottom of the beam?' },
      { t: 'Concrete is too light by itself; the steel adds weight to hold the beam down', mis: 'concrete-tension', why: 'Extra weight would not stop a crack opening. Look at the arrows on the beam: what is happening to the bottom edge, and what could resist that?' },
    ], 31, save, () => `The bottom of a loaded beam is in tension, where concrete is weak, so that is where the steel must go. ${sh.pred === PRED[1] ? 'Your prediction was right.' : `You predicted “${Book.esc(sh.pred)}”: the test showed it starts at the bottom.`}`);
    S.start();
    if (prev.correct === true) { M.bar = 'bottom'; sh.restoreDone(); }
    upd();
    return sh;
  }

  // ======================================================================================
  // bench 3: the lay-up workshop (GRP v CFRP)
  // ======================================================================================
  const ITEMS = { poly: { t: 'polyester resin', kind: 'resin' }, epoxy: { t: 'epoxy resin', kind: 'resin' }, glass: { t: 'glass fibre mat', kind: 'fibre' }, carbon: { t: 'carbon fibre cloth', kind: 'fibre' } };
  const GAUGE = { grp: [0.55, 0.6, 0.25], cfrp: [0.95, 0.25, 0.95] };          // strength for weight, weight, cost (illustrative)
  const BRIEFS = [
    { key: 'canoe', want: 'grp', html: '<b>Brief 1: a canoe</b> for a school outdoor centre. They need a whole fleet, so it must be <b>cheap</b>, as well as strong, waterproof and easy to mould.',
      ok: '<b>GRP</b> (glass reinforced plastic, “fibreglass”): strong, light enough, waterproof, will not rot, and cheap enough for a whole fleet.',
      no: 'A superb canoe… but look at the <b>cost</b> bar. The outdoor centre cannot afford a fleet of these. Try the other recipe.' },
    { key: 'bike', want: 'cfrp', html: '<b>Brief 2: a racing bike frame</b> for a professional team. It must be as <b>light and stiff</b> as possible. Cost does not matter.',
      ok: '<b>CFRP</b> (carbon fibre reinforced plastic): extremely strong and stiff for its weight, and very light. Expensive, but this is a race bike.',
      no: 'It works, but it is heavier and less stiff than the other teams’ frames. Money is no object here: try the other recipe.' },
  ];
  function benchLayup(ui) {
    const H = 280;
    const r = ui.record('p05.layup', { label: 'Lay-up workshop: matrix + reinforcement for a canoe (GRP) and a racing bike (CFRP)', type: 'experiment', max: 2 });
    const prev = r.get() || {};
    const sh = Shell(ui, {
      step: 'Bench 3 · the lay-up workshop',
      task: 'Modern composites use the same idea as the straw brick: <b>fibres</b> laid in a mould and soaked in liquid <b>resin</b>, which sets hard. Tap an item on the shelf, then tap the slot it belongs in. Then test your product.',
      notes: `<p><span class="key">GRP</span> (glass reinforced plastic, fibreglass) = <b>polyester resin</b> (matrix) + <b>glass fibres</b> (reinforcement). Strong, lightweight, moulds into large complex shapes, waterproof, does not rot or corrode, and <b>cheaper than CFRP</b>. <span class="small">Boat hulls, canoes, car body panels, helmets, water tanks.</span></p>
        <p><span class="key">CFRP</span> (carbon fibre reinforced plastic) = <b>epoxy resin</b> (matrix) + <b>carbon fibres</b> (reinforcement). <b>Extremely strong and stiff for its weight</b>, very lightweight, but <b>expensive</b> and hard to recycle. <span class="small">Formula 1 car bodies, racing bikes, aircraft parts, tennis racquets.</span></p>`,
    });
    const L = { stage: prev.stage || 0, log: prev.log || [[], []], first: prev.first || [null, null], slot: [null, null], picked: null, made: null, lay: 0, q: 0 };
    const briefP = ui.el('p', 'cmp-q', '', sh.body);
    const shelf = ui.el('div', 'cmp-shelf', '', sh.body);
    const chips = Object.keys(ITEMS).map((k) => { const b = ui.el('button', 'opt', ITEMS[k].t, shelf); b.type = 'button'; b._k = k; return b; });
    // fixed shelf order that does not pair the answers up
    [chips[2], chips[1], chips[3], chips[0]].forEach((c) => shelf.appendChild(c));
    const slotsRow = ui.el('div', 'cmp-slots', '', sh.body);
    const slotEls = ['MATRIX', 'REINFORCEMENT'].map((nm, i) => { if (i) ui.el('span', 'cmp-plus', '+', slotsRow); const d = ui.el('div', 'cmp-slot', '', slotsRow); d._i = i; d._nm = nm; return d; });
    const S = Stage(sh.body, H);
    const fb = ui.el('div', 'fb', '', sh.body);
    const row = ui.el('div', 'cmp-btns', '', sh.body); row.style.marginTop = '10px';
    const bTest = ui.el('button', 'btn', 'Lay it up + test ▸', row), bNext = ui.el('button', 'btn ghost', 'Next brief ▸', row); bTest.type = bNext.type = 'button';

    // ---- drawings ----
    const CANOE = (() => { const top = geo.curve([40, 104], [150, 128], [390, 128], [500, 104], 24), bot = geo.curve([500, 104], [440, 196], [100, 196], [40, 104], 30); return [...top, ...bot]; })();
    const tube = (a, b, w) => { const dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy), nx = (-dy / d) * w, ny = (dx / d) * w; return [[a[0] + nx, a[1] + ny], [b[0] + nx, b[1] + ny], [b[0] - nx, b[1] - ny], [a[0] - nx, a[1] - ny]]; };
    const BK = { bb: [262, 196], seat: [222, 84], head: [372, 76], headB: [384, 116], rear: [142, 180], front: [424, 180] };
    const TUBES = [tube(BK.seat, BK.head, 8), tube(BK.bb, BK.headB, 9), tube(BK.bb, [216, 68], 8), tube(BK.rear, BK.seat, 5), tube(BK.rear, BK.bb, 5), tube(BK.head, BK.headB, 9)];
    function weave(ctx, P, kind, p, seed) {
      if (p <= 0) return;
      let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; P.forEach(([a, b]) => { x0 = Math.min(x0, a); x1 = Math.max(x1, a); y0 = Math.min(y0, b); y1 = Math.max(y1, b); });
      ctx.save(); ctx.beginPath(); P.forEach(([a, b], i) => (i ? ctx.lineTo(a, b) : ctx.moveTo(a, b))); ctx.closePath(); ctx.clip();
      ctx.beginPath(); ctx.rect(x0 - 2, y0 - 2, (x1 - x0 + 4) * p, y1 - y0 + 4); ctx.clip();
      if (kind === 'carbon') { ctx.strokeStyle = rgba([16, 22, 80], 0.8); ctx.lineWidth = 2.2; ctx.beginPath(); for (let d = x0 - (y1 - y0); d < x1 + 8; d += 7) { ctx.moveTo(d, y0); ctx.lineTo(d + (y1 - y0), y1); ctx.moveTo(d + (y1 - y0), y0); ctx.lineTo(d, y1); } ctx.stroke(); }
      else { const q = rng(seed); ctx.strokeStyle = rgba(B, 0.55); ctx.lineWidth = 1.3; ctx.beginPath(); const n = Math.round(((x1 - x0) * (y1 - y0)) / 110); for (let i = 0; i < n; i++) { const x = x0 + q() * (x1 - x0), y = y0 + q() * (y1 - y0), a = q() * Math.PI, l = 9 + q() * 12; ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); } ctx.stroke(); }
      ctx.restore();
    }
    S.paint = (x) => {
      ['strength for its weight', 'weight', 'cost'].forEach((t, i) => { text(x, t, 572, 46 + i * 82, { size: 22 }); const R = geo.rect(572, 56 + i * 82, 262, 26, 5); paper(x, R); Ink.stroke(x, R, { w: 2.2, seed: 21 + i }); });
      text(x, 'low', 572, 272, { size: 22, a: 0.6 }); text(x, 'high', 834, 272, { size: 22, align: 'right', a: 0.6 });
    };
    S.render = (ctx) => {
      const br = BRIEFS[Math.min(L.stage, 1)], fibre = L.made && L.made.fibre, solid = L.made && L.lay >= 1;
      const dash = (P) => { ctx.save(); ctx.setLineDash([8, 8]); ctx.strokeStyle = rgba(B, 0.6); ctx.lineWidth = 2; ctx.beginPath(); P.forEach(([a, b], i) => (i ? ctx.lineTo(a, b) : ctx.moveTo(a, b))); ctx.closePath(); ctx.stroke(); ctx.restore(); };
      if (br.key === 'canoe') {
        [[150, 0], [390, 1]].forEach(([tx, i]) => { Ink.stroke(ctx, [[tx - 34, 256], [tx + 26, 176]], { w: 2.6, seed: 31 + i }); Ink.stroke(ctx, [[tx + 34, 256], [tx - 26, 176]], { w: 2.6, seed: 33 + i }); });
        Ink.stroke(ctx, [[30, 256], [520, 256]], { w: 2.4, seed: 37 });
        paper(ctx, CANOE);
        if (L.made) weave(ctx, CANOE, fibre, clamp(L.lay), 5);
        if (solid) { Ink.stroke(ctx, [...CANOE, CANOE[0]], { w: 3.4, seed: 41 }); Ink.stroke(ctx, geo.curve([70, 112], [170, 132], [370, 132], [470, 112], 20), { w: 1.8, seed: 43, retrace: false }); } else dash(CANOE);
      } else {
        [BK.rear, BK.front].forEach((c, i) => { Ink.stroke(ctx, geo.ellipse(c[0], c[1], 74, 74), { w: 2.4, seed: 51 + i }); Ink.stroke(ctx, geo.ellipse(c[0], c[1], 6, 6), { w: 2, seed: 55 + i, retrace: false }); });
        Ink.stroke(ctx, [BK.headB, BK.front], { w: 4, seed: 57 }); Ink.stroke(ctx, [[196, 66], [240, 66]], { w: 5, seed: 59 }); Ink.stroke(ctx, [BK.head, [366, 56], [392, 50]], { w: 4, seed: 61 });
        Ink.stroke(ctx, geo.ellipse(BK.bb[0], BK.bb[1], 12, 12), { w: 2.4, seed: 63 });
        Ink.stroke(ctx, [[20, 256], [530, 256]], { w: 2.4, seed: 37 });
        TUBES.forEach((T, i) => { paper(ctx, T); if (L.made) weave(ctx, T, fibre, clamp(L.lay), 9 + i); if (solid) Ink.stroke(ctx, [...T, T[0]], { w: 2.6, seed: 71 + i * 3 }); else dash(T); });
      }
      if (!L.made) text(ctx, 'empty mould', 275, 40, { font: 'hand', size: 24, align: 'center', a: 0.7 });
      else text(ctx, L.lay < 1 ? 'laying up…' : L.made.name, 275, 40, { font: 'hand', size: 24, align: 'center', color: L.lay < 1 ? B : L.made.ok ? GR : RD });
      if (L.made && L.made.g) L.made.g.forEach((v, i) => { const wv = 258 * v * clamp(L.q); if (wv > 2) { const R = geo.rect(574, 58 + i * 82, wv, 22, 4); Ink.hatchFill(ctx, R, 1, i === 0 ? GR : RD, 2.2); Ink.stroke(ctx, [[574 + wv, 58 + i * 82], [574 + wv, 80 + i * 82]], { w: 2.6, color: i === 0 ? GR : RD, seed: 81 + i, retrace: false }); } });
    };
    S.step = (dt) => { if (!L.made) return false; if (L.lay < 1) { L.lay = Math.min(1, L.lay + dt / 1.3); if (L.lay >= 1) verdict(); return true; } if (L.made.g && L.q < 1) { L.q = Math.min(1, L.q + dt / 0.8); return true; } return false; };

    // ---- shelf + slots ----
    function upd() {
      const done = L.stage >= 2, br = BRIEFS[Math.min(L.stage, 1)];
      briefP.innerHTML = done ? '<b>Both briefs solved.</b>' : br.html;
      chips.forEach((c) => { c.classList.toggle('picked', L.picked === c._k); c.disabled = done || L.slot.includes(c._k); });
      slotEls.forEach((d) => { const k = L.slot[d._i]; d.classList.toggle('full', !!k); d.innerHTML = `<small>${d._nm}</small>` + (k ? ITEMS[k].t : '<i>tap to fill</i>'); });
      bTest.disabled = done || !!L.solved || !L.slot[0] || !L.slot[1] || !!(L.made && L.lay < 1); bTest.style.display = done ? 'none' : '';
      bNext.style.display = !done && L.solved ? '' : 'none';
      S.draw();
    }
    chips.forEach((c) => (c.onclick = () => { L.picked = L.picked === c._k ? null : c._k; Book.sfx('tick', { gain: 0.5 }); upd(); }));
    slotEls.forEach((d) => (d.onclick = () => {
      if (L.stage >= 2 || L.solved) return;
      if (L.picked) { L.slot[d._i] = L.picked; L.picked = null; Book.scribble(0.12); } else if (L.slot[d._i]) { L.slot[d._i] = null; Book.sfx('tick', { gain: 0.4 }); } else Book.toast('Tap something on the shelf first.');
      L.made = null; fb.className = 'fb'; upd();
    }));
    function judge() {
      const m = ITEMS[L.slot[0]], f = ITEMS[L.slot[1]], br = BRIEFS[L.stage];
      if (m.kind !== 'resin' || f.kind !== 'fibre') {
        const msg = m.kind === 'fibre' && f.kind === 'resin' ? 'Swapped! A fibre cannot bind anything, and a resin is not a reinforcement. Which one sets hard around the other?' : m.kind === 'fibre' ? 'Two lots of dry fibre and nothing to bind them: it is just a floppy cloth. One slot needs something that sets hard.' : 'Resin with no fibres in it: a brittle lump of plastic. One slot needs fibres to give the strength.';
        return { ok: false, mis: 'matrix-reinforcement', name: 'that will not work', msg, fibre: f.kind === 'fibre' ? L.slot[1] : m.kind === 'fibre' ? L.slot[0] : 'glass', g: null };
      }
      const kind = L.slot[0] === 'poly' && L.slot[1] === 'glass' ? 'grp' : L.slot[0] === 'epoxy' && L.slot[1] === 'carbon' ? 'cfrp' : null;
      if (!kind) return { ok: false, mis: 'gfrp-cfrp', name: 'not a standard recipe', msg: 'That pairing is not GRP or CFRP. Glass fibre and carbon fibre each have their own resin: swap one item and test again.', fibre: L.slot[1], g: null };
      const ok = kind === br.want;
      return { ok, mis: ok ? '' : 'gfrp-cfrp', name: kind === 'grp' ? 'GRP' : 'CFRP', msg: ok ? br.ok : br.no, fibre: L.slot[1], g: GAUGE[kind] };
    }
    function verdict() {
      const v = L.made; fb.className = 'fb on ' + (v.ok ? 'good' : 'bad'); fb.innerHTML = (v.ok ? '✓ ' : '✗ ') + v.msg;
      Book.sfx(v.ok ? 'success' : 'error', { gain: 0.35 });
      if (v.ok) { L.solved = true; if (L.stage === 1) { L.stage = 2; save(); sh.finish(); fb.innerHTML += ' The notes are unlocked below.'; } }
      upd();
    }
    const save = () => {
      const part = (i) => `${BRIEFS[i].key}: ${L.log[i].length ? L.log[i].join(', ') : 'not tried'}`;
      const score = (L.first[0] ? 1 : 0) + (L.first[1] ? 1 : 0), mis = [...new Set(L.misAll || [])].join(',');
      r.set({ answer: part(0) + '; ' + part(1), correct: L.stage >= 2 ? score === 2 : null, score, max: 2, mis, stage: L.stage + (L.solved && L.stage < 2 ? 1 : 0), log: L.log, first: L.first, misAll: L.misAll });
    };
    L.misAll = prev.misAll || [];
    bTest.onclick = () => {
      if (bTest.disabled) return; const v = judge(), i = L.stage;
      L.log[i].push(`[matrix: ${ITEMS[L.slot[0]].t} + reinforcement: ${ITEMS[L.slot[1]].t}] ${v.ok ? '✓' : '✗'}`);
      if (L.first[i] == null) L.first[i] = v.ok; if (v.mis) L.misAll.push(v.mis);
      L.made = v; L.lay = 0; L.q = 0; fb.className = 'fb'; Book.sfx('paper', { gain: 0.45, dur: 0.9 });
      if (v.ok && i === 0) L.solved = true; save(); if (v.ok && i === 0) L.solved = false;
      upd(); S.go();
    };
    bNext.onclick = () => { L.stage = 1; L.solved = false; L.slot = [null, null]; L.made = null; fb.className = 'fb'; Book.sfx('paper', { gain: 0.4 }); upd(); };
    S.start();
    if (L.stage >= 2) { L.slot = ['epoxy', 'carbon']; L.made = { ok: true, name: 'CFRP', fibre: 'carbon', g: GAUGE.cfrp }; L.lay = 1; L.q = 1; fb.className = 'fb on good'; fb.innerHTML = '✓ ' + BRIEFS[1].ok; sh.finish(true); }
    upd();
    return sh;
  }

  // ======================================================================================
  Book.page({ id: 'p05', title: 'Composites', build(ui, root) {
    ui.h('Composites');
    ui.p('Some materials are a <b>team</b>: two different materials, each doing the job it is best at. Three benches: test first, the notes for each bench appear when you finish it.');
    const b1 = benchBrick(ui);
    const b2 = benchBeam(ui);
    const b3 = benchLayup(ui);

    ui.h('Matrix or reinforcement?', { size: 40 });
    ui.p('Sort the ingredients by the job they do in their composite. <span class="small">The notes and benches blur while you sort: recall them!</span>');
    const hide = [b1.notes, b2.notes, b3.notes, b3.lab];
    const sort = ui.sort({ id: 'p05.parts', label: 'Sort 7 composite ingredients: matrix or reinforcement',
      q: 'Tap an ingredient, then tap its job.', buckets: ['Matrix (binds, gives the shape)', 'Reinforcement (gives the strength)'],
      items: [
        { t: 'Cement', b: 0, mis: 'matrix-reinforcement' }, { t: 'Polyester resin', b: 0, mis: 'matrix-reinforcement' }, { t: 'Epoxy resin', b: 0, mis: 'matrix-reinforcement' },
        { t: 'Aggregate (sand + gravel)', b: 1, mis: 'matrix-reinforcement' }, { t: 'Steel rebar', b: 1, mis: 'matrix-reinforcement' }, { t: 'Glass fibre', b: 1, mis: 'matrix-reinforcement' }, { t: 'Carbon fibre', b: 1, mis: 'matrix-reinforcement' },
      ],
      explain: 'Cement and the two resins bind; the particles, bars and fibres held inside them give the strength.' });
    ui.hideWhile(sort, 'p05.parts', hide);

    const mcq = ui.mcq({ id: 'p05.alloy', label: 'How is a composite different from an alloy?',
      q: '<b>Brass is an alloy. GRP is a composite.</b> What makes a composite different from an alloy?',
      options: [
        { t: 'Its materials stay separate inside it, not chemically mixed', ok: true, why: 'Yes: in a composite you can still find the fibres and the matrix, each doing its own job.' },
        { t: 'Its materials are melted together into one new metal', mis: 'composite-meaning', why: 'That describes an alloy. In a composite the two materials are combined but stay separate.' },
        { t: 'It is always made from one pure material, never two', mis: 'composite-meaning', why: 'The opposite: a composite always combines two or more different materials.' },
        { t: 'It is any strong material that has carbon fibres in it', mis: 'composite-meaning', why: 'Concrete, GRP and plywood are composites with no carbon fibre at all. Think about how the materials are combined.' },
      ] });
    ui.hideWhile(mcq, 'p05.alloy', hide);
  } });
})();
