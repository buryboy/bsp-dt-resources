// Page 4 — Synthetic fibres. A pen animation of oil -> polymer chips -> spinneret -> filaments, then three lab rigs
// (each one: predict -> test -> conclude): the stretch rig (weights on polyester / polyamide / elastane yarns), the
// quick-dry race (wet swatches on a washing line with a clock) and the hot iron test (drag an iron over cotton and
// polyester). The notes for each rig only appear once it is finished. Then recall: uses, elastane %, environment.
(function () {
  'use strict';
  const B = Ink.BLUE, RD = Ink.RED, GR = Ink.GREEN, rgba = Ink.rgba, geo = Ink.geo;
  const LABF = (s) => `600 ${s}px Fredoka, "Arial Rounded MT Bold", system-ui, sans-serif`;
  const HANDF = (s) => `400 ${s}px "Gloria Hallelujah", "Comic Sans MS", cursive`;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const PAPER = 'rgba(251,250,245,.97)';
  const W = 860;

  if (!document.getElementById('tx4-css')) {
    const s = document.createElement('style'); s.id = 'tx4-css';
    s.textContent = `
      .tx4-lab { position: relative; margin: 0 0 calc(var(--R) * .6); padding: 12px 16px 16px; background: rgba(251,250,245,.9); }
      .tx4-lab > * { position: relative; }
      .tx4-step { font: 700 14px Fredoka, system-ui; letter-spacing: .08em; text-transform: uppercase; color: var(--red); line-height: 22px; }
      .tx4-task { font-size: 19px; line-height: 1.5; margin: 0 0 8px; }
      .tx4-task b, .tx4-q b, .tx4-status b { font-family: Fredoka, system-ui; font-weight: 600; }
      .tx4-q { font-size: 19px; line-height: 1.5; margin: 6px 0 8px; }
      .tx4-btns { display: flex; flex-wrap: wrap; gap: 10px; align-items: stretch; margin: 0 0 8px; }
      .tx4-btns .opt { flex: 1 1 150px; text-align: center; min-height: 52px; }
      .tx4-btns .btn { margin-top: 0; min-height: 50px; }
      .tx4-cv { display: block; width: 100%; height: auto; touch-action: pan-y; user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; cursor: pointer; }
      .tx4-status { font-size: 17px; line-height: 1.5; min-height: 26px; margin: 2px 0 6px; }
      .tx4-conc { display: none; margin-top: 6px; padding-top: 6px; border-top: 2px dashed rgba(30,46,150,.3); }
      .tx4-conc.on { display: block; }
      .tx4-locked { font-size: 17px; opacity: .75; margin: 0; }
      .tx4-nb p { margin: 0 0 6px; } .tx4-nb p:last-child { margin: 0; }
      .tx4-uses { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 8px 18px; margin-top: 6px; }
      .tx4-uses > div { font-size: 17px; line-height: 1.5; }
      .tx4-uses h4 { font: 700 20px Fredoka, system-ui; margin: 0; color: var(--ink); }
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
    const c = document.createElement('canvas'); c.className = 'tx4-cv'; parent.appendChild(c);
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
  // one lab rig: predict -> test (cfg.setup wires the canvas) -> conclude -> notes unlock
  // ======================================================================================
  function Lab(ui, cfg) {
    const el = ui.el, r = ui.record(cfg.id, { label: cfg.label, type: 'experiment', max: 1 });
    const lab = el('div', 'tx4-lab'); requestAnimationFrame(() => Ink.frame(lab, { shadow: false, w: 2.2 }));
    el('div', 'tx4-step', cfg.step, lab);
    el('p', 'tx4-task', cfg.task, lab);
    el('div', 'tx4-q', `<b>Predict first.</b> ${cfg.predQ}`, lab);
    const predRow = el('div', 'tx4-btns', '', lab);
    const prev = r.get() || {};
    const L = { el, lab, live: !!prev.pred, pred: prev.pred || null, locked: false, done: prev.correct === true };
    L.stg = Stage(lab, cfg.H);
    L.status = el('div', 'tx4-status', '', lab);
    L.ctl = el('div', 'tx4-btns', '', lab);
    const conc = el('div', 'tx4-conc', `<div class="tx4-q"><b>What did you find?</b> ${cfg.concQ}</div>`, lab), concRow = el('div', 'opts', '', conc), fb = el('div', 'fb', '', conc);
    const notes = ui.box(`<div class="tx4-nb"><p class="tx4-locked">🔒 ${cfg.lockMsg}</p></div>`, { tag: 'Notes' });
    L.lock = () => { if (!L.locked) { L.locked = true; predBtns.forEach((b) => (b.disabled = true)); } };
    L.openConc = () => { if (!conc.classList.contains('on')) { conc.classList.add('on'); Book.sfx('paper', { gain: 0.4 }); } };
    const predBtns = cfg.predOpts.map((t) => {
      const b = el('button', 'opt', t, predRow); b.type = 'button'; if (L.pred === t) b.classList.add('sel');
      b.onclick = () => {
        if (L.locked) return;
        predBtns.forEach((q) => q.classList.remove('sel')); b.classList.add('sel'); L.pred = t;
        r.set({ answer: `predicted "${t}" (not tested yet)`, correct: null, pred: t }); Book.scribble(0.12);
        if (!L.live) { L.live = true; L.status.style.visibility = ''; L.ctl.style.display = ''; Book.sfx('pop', { gain: 0.5 }); }
        L.say && L.say(); L.stg.render(0);
      };
      return b;
    });
    const finish = (quiet) => { L.done = true; notes.querySelector('.tx4-nb').innerHTML = cfg.notes; cfg.onDone && cfg.onDone(quiet); };
    const COPTS = Book.shuffle(cfg.concOpts, cfg.seed);
    const concBtns = COPTS.map((op) => {
      const b = el('button', 'opt', op.t, concRow); b.type = 'button';
      b.onclick = () => {
        const ok = !!op.ok; b.classList.add(ok ? 'right' : 'wrong');
        r.set({ answer: `predicted "${L.pred}"; ${cfg.summary}; concluded "${op.t}" ${ok ? '✓' : '✗'}`, correct: ok, score: ok ? 1 : 0, max: 1, mis: ok ? '' : op.mis || '', pred: L.pred });
        if (ok) {
          concBtns.forEach((q) => (q.disabled = true)); Book.sfx('success', { gain: 0.35 });
          fb.className = 'fb on good'; fb.innerHTML = `✓ ${cfg.right} ${L.pred === cfg.predRight ? 'Your prediction was spot on.' : `You predicted “${Book.esc(L.pred)}”: the test has put that right.`} The notes are unlocked below.`;
          finish();
        } else { Book.sfx('error', { gain: 0.3 }); fb.className = 'fb on bad'; fb.innerHTML = '✗ ' + op.why; }
      };
      return b;
    });
    cfg.setup(L);
    L.stg.init();
    if (!L.live) { L.status.style.visibility = 'hidden'; L.ctl.style.display = 'none'; }
    if (L.done) {
      L.lock(); conc.classList.add('on'); concBtns.forEach((q, i) => { q.disabled = true; if (COPTS[i].ok) q.classList.add('right'); });
      fb.className = 'fb on good'; fb.innerHTML = '✓ ' + cfg.right; finish(true);
    }
    L.say && L.say(); L.stg.render(0);
    return { lab, notes };
  }

  // ======================================================================================
  // rig 1: the stretch rig
  // ======================================================================================
  const fmtCm = (v) => (Math.abs(v - Math.round(v)) < 0.05 ? String(Math.round(v)) : v.toFixed(1));
  function stretchRig(L) {
    const stg = L.stg, c = stg.c;
    const X = [140, 360, 580], NAMES = ['polyester', 'polyamide (nylon)', 'elastane'];
    const F = [[1, 1.02, 1.04, 1.05], [1, 1.07, 1.14, 1.2], [1, 3, 4.8, 6]];        // length ÷ starting length, for 0-3 weights
    const Y0 = 60, CM = 4.4;
    const S = { n: [0, 0, 0], len: [1, 1, 1], v: [0, 0, 0], maxN: L.done ? [3, 3, 3] : [0, 0, 0], released: L.done };
    const off = L.el('button', 'btn ghost', 'Take all the weights off', L.ctl); off.type = 'button';
    L.say = () => {
      const all = S.maxN.every((m) => m === 3), any = S.n.some(Boolean);
      L.status.innerHTML = L.done ? 'Test finished. You can still hang weights on the yarns.'
        : !all ? `👉 <b>Tap a yarn</b> to hang a weight on it. Load <b>each</b> yarn with 3 weights. <span class="small">(${S.maxN.filter((m) => m === 3).length} of 3 done)</span>`
        : !S.released ? 'All three are loaded. Now <b>take all the weights off</b> and watch what each yarn does.' : 'Done: say what you found, below.';
      off.disabled = !any;
    };
    stg.paint = (x) => {
      const beam = geo.rect(20, 38, 720, 16, 4);
      Ink.hatchShadow(x, beam, 1, 6, 6); paper(x, beam); Ink.hatchFill(x, beam, 1, B, 1.4); Ink.stroke(x, beam, { w: 2.8, seed: 3 });
      [32, 728].forEach((px, i) => Ink.stroke(x, [[px, 56], [px, 430]], { w: 3, seed: 5 + i }));
      Ink.stroke(x, [[10, 432], [750, 432]], { w: 2.6, seed: 9 });
      NAMES.forEach((n, i) => text(x, n, X[i], 28, { size: 24, align: 'center' }));
      const R = geo.rect(766, Y0 - 10, 72, 334, 5); paper(x, R); Ink.stroke(x, R, { w: 2.4, seed: 12 });
      for (let cm = 0; cm <= 70; cm += 5) {
        const y = Y0 + cm * CM; Ink.stroke(x, [[766, y], [766 + (cm % 10 ? 10 : 18), y]], { w: 1.6, seed: 14 + cm, retrace: false });
        if (cm % 10 === 0) text(x, String(cm), 830, y + 8, { size: 22, align: 'right' });
      }
      text(x, 'cm', 802, 40, { size: 22, align: 'center' });
    };
    stg.draw = (ctx, t, dt) => {
      let more = false;
      for (let i = 0; i < 3; i++) {
        const tg = F[i][S.n[i]], d = tg - S.len[i];
        if (Math.abs(d) > 0.0015 || Math.abs(S.v[i]) > 0.01) { S.v[i] += (d * 110 - S.v[i] * 9) * dt; S.len[i] += S.v[i] * dt; more = true; } else { S.len[i] = tg; S.v[i] = 0; }
        const ye = Y0 + 10 * CM * S.len[i], thin = clamp((S.len[i] - 1) / 5);
        Ink.stroke(ctx, [[X[i], 54], [X[i], ye]], { w: lerp(4.4, 2.2, thin), seed: 21 + i, amp: 0.5 });
        ctx.fillStyle = rgba(B, 0.9); ctx.beginPath(); ctx.arc(X[i], 56, 5, 0, 7); ctx.fill();
        Ink.stroke(ctx, [[X[i], ye], [X[i] + 9, ye + 5], [X[i] + 7, ye + 12], [X[i] - 2, ye + 13]], { w: 2.4, seed: 31 + i, retrace: false, amp: 0.3 });
        for (let k = 0; k < S.n[i]; k++) {
          const M = geo.rect(X[i] - 30, ye + 14 + k * 26, 60, 23, 5);
          paper(ctx, M); Ink.hatchFill(ctx, M, 1, B, 1.3); Ink.stroke(ctx, M, { w: 2.4, seed: 40 + i * 5 + k });
        }
        if (L.live) {
          const cm = 10 * S.len[i];
          text(ctx, fmtCm(cm) + ' cm', X[i] + 42, ye + 2, { size: 24 });
          if (S.len[i] > 1.5) text(ctx, '×' + fmtCm(S.len[i]), X[i] + 42, ye + 32, { size: 26, color: RD });
          if (S.released && S.n[i] === 0 && S.maxN[i] === 3 && Math.abs(S.len[i] - 1) < 0.02) text(ctx, 'sprang back', X[i], 160, { font: 'hand', size: 22, align: 'center', color: GR, rot: -0.03 });
        }
      }
      if (!L.live) text(ctx, 'predict first!', 360, 250, { font: 'hand', size: 26, align: 'center', color: RD, rot: -0.03 });
      return more;
    };
    const check = () => { L.say(); if (S.maxN.every((m) => m === 3) && S.released) L.openConc(); };
    c.addEventListener('pointerdown', (e) => {
      if (!L.live) { Book.toast('Predict first: then you can hang the weights.'); return; }
      const [x] = stg.pos(e); let i = -1; X.forEach((px, k) => { if (Math.abs(x - px) < 110) i = k; });
      if (i < 0) return;
      L.lock();
      if (S.n[i] >= 3) { Book.toast('That yarn has all 3 weights on. Try another yarn.'); return; }
      S.n[i]++; S.maxN[i] = Math.max(S.maxN[i], S.n[i]); Book.sfx('thud', { gain: 0.45 }); check(); stg.go();
    });
    off.onclick = () => {
      if (S.maxN.every((m) => m === 3)) S.released = true;
      S.n = [0, 0, 0]; Book.sfx('pop', { gain: 0.45 }); check(); stg.go();
    };
  }

  // ======================================================================================
  // rig 2: the quick-dry race
  // ======================================================================================
  const fmtMin = (m) => (m < 60 ? m + ' min' : m % 60 ? `${(m / 60) | 0} h ${m % 60} min` : m / 60 + ' h');
  function dryRig(L) {
    const stg = L.stg, c = stg.c;
    const CX = [150, 400, 650], NAMES = ['cotton', 'polyester', 'polyamide (nylon)'], TD = [120, 35, 45];   // minutes until dry
    const SL = { x0: 130, x1: 600, y: 352 }, TOP = 66, SH = 160, CL = [762, 316];
    const S = { t: L.done ? 120 : 0, maxT: L.done ? 120 : 0, drag: false, run: false };
    const runBtn = L.el('button', 'btn ghost', '▶ Let time run', L.ctl), back = L.el('button', 'btn ghost', '↺ Back to the start', L.ctl); runBtn.type = back.type = 'button';
    L.say = () => {
      L.status.innerHTML = L.done ? 'Race finished. You can still drag the clock.'
        : S.maxT >= 120 ? 'All three are dry: say what you found, below.' : '👉 <b>Drag the clock slider</b> to let time pass. Keep going until <b>all three</b> are dry.';
    };
    stg.paint = (x) => {
      Ink.stroke(x, geo.curve([14, 48], [280, 60], [580, 60], [846, 48], 40), { w: 2.6, seed: 3 });
      NAMES.forEach((n, i) => {
        text(x, n, CX[i], 30, { size: 24, align: 'center' });
        const P = geo.rect(CX[i] - 85, TOP, 170, SH, 6); Ink.hatchShadow(x, P, 1, 6, 6); paper(x, P); Ink.stroke(x, P, { w: 2.8, seed: 7 + i * 3 });
        [-52, 52].forEach((dx, k) => { const G = geo.rect(CX[i] + dx - 7, 42, 14, 34, 3); paper(x, G); Ink.hatchFill(x, G, 1, B, 1.6); Ink.stroke(x, G, { w: 2, seed: 20 + i * 2 + k, retrace: false }); });
      });
      Ink.stroke(x, [[SL.x0, SL.y], [SL.x1, SL.y]], { w: 3.2, seed: 41 });
      for (let i = 0; i <= 8; i++) { const px = lerp(SL.x0, SL.x1, i / 8); Ink.stroke(x, [[px, SL.y - (i % 4 ? 6 : 11)], [px, SL.y + (i % 4 ? 6 : 11)]], { w: 1.6, seed: 50 + i, retrace: false }); }
      text(x, 'start', SL.x0 - 28, SL.y + 8, { size: 22, align: 'right' }); text(x, '2 h', SL.x1 + 28, SL.y + 8, { size: 22 });
      const F = geo.ellipse(CL[0], CL[1], 52, 52); Ink.hatchShadow(x, F, 1, 6, 6); paper(x, F); Ink.stroke(x, F, { w: 3, seed: 61 });
      for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; Ink.stroke(x, [[CL[0] + Math.cos(a) * 42, CL[1] + Math.sin(a) * 42], [CL[0] + Math.cos(a) * 48, CL[1] + Math.sin(a) * 48]], { w: i % 3 ? 1.4 : 2.4, seed: 63 + i, retrace: false }); }
    };
    stg.draw = (ctx, time, dt) => {
      let more = false;
      if (S.run) { S.t = Math.min(120, S.t + dt * 22); S.maxT = Math.max(S.maxT, S.t); more = true; if (S.t >= 120) { S.run = false; more = false; ready(); } }
      const T = S.t;
      NAMES.forEach((n, i) => {
        const w = clamp(1 - T / TD[i]);
        if (w > 0) {
          const y0 = TOP + SH * (1 - w) * 0.92, Wt = [[CX[i] - 82, y0], [CX[i] + 82, y0], [CX[i] + 82, TOP + SH - 3], [CX[i] - 82, TOP + SH - 3]];
          wash(ctx, Wt, `rgba(70,110,210,${0.14 + w * 0.16})`); Ink.hatchFill(ctx, Wt, 1, B, 0.7 + w * 0.9);
          const wv = []; for (let px = CX[i] - 82; px <= CX[i] + 82; px += 8) wv.push([px, y0 + Math.sin(px * 0.13 + i) * 2.5]); Ink.stroke(ctx, wv, { w: 1.8, seed: 70 + i, retrace: false, amp: 0.3 });
          const nd = Math.ceil(w * 3);                                      // drips
          for (let k = 0; k < nd; k++) {
            const ph = (T * 0.21 + time * 0.5 * (S.run || S.drag ? 1 : 0) + k * 0.37 + i * 0.2) % 1, dx = CX[i] - 50 + k * 50, dy = TOP + SH + 6 + ph * 44;
            ctx.fillStyle = rgba(B, 0.75 * (1 - ph * 0.6)); ctx.beginPath(); ctx.moveTo(dx, dy - 9); ctx.quadraticCurveTo(dx + 6, dy + 1, dx, dy + 5); ctx.quadraticCurveTo(dx - 6, dy + 1, dx, dy - 9); ctx.fill();
          }
          if (L.live) { const lb = geo.rect(CX[i] - 66, TOP + 12, 132, 34, 6); paper(ctx, lb); text(ctx, w > 0.6 ? 'soaking' : w > 0.25 ? 'wet' : 'damp', CX[i], TOP + 38, { font: 'hand', size: 24, align: 'center' }); }
        } else if (L.live) {
          Ink.tick(ctx, CX[i] - 62, TOP + 76, 1.1);
          text(ctx, 'dry!', CX[i] + 14, TOP + 80, { size: 30, align: 'center', color: GR });
          text(ctx, 'after ' + fmtMin(TD[i]), CX[i], TOP + 118, { font: 'hand', size: 22, align: 'center', color: GR });
        }
      });
      if (!L.live) text(ctx, 'predict first!', 365, 312, { font: 'hand', size: 26, align: 'center', color: RD, rot: -0.03 });
      else {
        text(ctx, T < 1 ? 'just pegged out' : 'time: ' + fmtMin(Math.round(T / 5) * 5), 365, 312, { size: 28, align: 'center' });
        const kx = lerp(SL.x0, SL.x1, T / 120), K = geo.ellipse(kx, SL.y, 19, 19);
        paper(ctx, K); Ink.hatchFill(ctx, K, 1, S.drag ? RD : B, 1.3); Ink.stroke(ctx, K, { w: 3, color: S.drag ? RD : B, seed: 77 });
      }
      // clock hands: it starts at 9 o'clock
      const am = (T / 60) * Math.PI * 2 - Math.PI / 2, ah = ((9 + T / 60) / 12) * Math.PI * 2 - Math.PI / 2;
      ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = rgba(B, 0.95);
      ctx.lineWidth = 4.5; ctx.beginPath(); ctx.moveTo(CL[0], CL[1]); ctx.lineTo(CL[0] + Math.cos(ah) * 24, CL[1] + Math.sin(ah) * 24); ctx.stroke();
      ctx.strokeStyle = rgba(RD, 0.95); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(CL[0], CL[1]); ctx.lineTo(CL[0] + Math.cos(am) * 38, CL[1] + Math.sin(am) * 38); ctx.stroke(); ctx.restore();
      return more || S.drag;
    };
    function ready() { L.say(); if (S.maxT >= 120) L.openConc(); }
    let lastTk = -1;
    const setFromX = (x) => {
      const old = S.t; S.t = Math.round((clamp((x - SL.x0) / (SL.x1 - SL.x0)) * 120) / 5) * 5; S.maxT = Math.max(S.maxT, S.t);
      if (S.t !== lastTk) { lastTk = S.t; Book.sfx(TD.some((d) => old < d && S.t >= d) ? 'success' : 'tick', { gain: 0.25 }); }
    };
    c.addEventListener('pointerdown', (e) => {
      if (!L.live) { Book.toast('Predict first: then the clock starts.'); return; }
      const [x, y] = stg.pos(e);
      if (Math.abs(y - SL.y) < 52 && x > SL.x0 - 44 && x < SL.x1 + 44) { L.lock(); S.run = false; S.drag = true; try { c.setPointerCapture(e.pointerId); } catch (er) {} setFromX(x); e.preventDefault(); stg.go(); }
    });
    c.addEventListener('pointermove', (e) => { if (!S.drag) return; setFromX(stg.pos(e)[0]); stg.go(); });
    const up = () => { if (!S.drag) return; S.drag = false; ready(); stg.go(); stg.render(0); };
    c.addEventListener('pointerup', up); c.addEventListener('pointercancel', up); c.addEventListener('lostpointercapture', up);
    runBtn.onclick = () => { L.lock(); if (S.t >= 120) S.t = 0; S.run = true; Book.sfx('tick', { gain: 0.4 }); stg.go(); };
    back.onclick = () => { S.run = false; S.t = 0; Book.sfx('paper', { gain: 0.3 }); stg.render(0); };
  }

  // ======================================================================================
  // rig 3: the hot iron test
  // ======================================================================================
  function ironRig(L) {
    const stg = L.stg, c = stg.c;
    const SW = [{ n: 'cotton', x: 96 }, { n: 'polyester', x: 474 }], SWW = 290, SY = 126, SHH = 150, NC = 12, CW = SWW / NC, IY = 201;
    const DOTS = ['●', '●●', '●●●'], HN = ['cool', 'warm', 'hot'];
    // per column: 'c' creased, 's' smooth, 'm' melted
    const S = { heat: L.done ? 3 : 1, x: 430, drag: false, cols: L.done ? ['s', 'm'].map((v) => Array(NC).fill(v)) : [0, 1].map(() => Array(NC).fill('c')), cov: [0, 1, 2].map(() => [new Set(), new Set()]) };
    if (L.done) for (let i = 0; i < NC; i++) { S.cov[2][0].add(i); S.cov[2][1].add(i); }
    const rr = H.rng(404), CREASE = [0, 1].map(() => Array.from({ length: NC }, () => [0, 1].map(() => ({ y: rr.range(14, SHH - 34), a: rr.range(-0.5, 0.5), l: rr.range(18, 30) }))));
    const tested = (h, s) => S.cov[h - 1][s].size >= NC - 2;
    const heatBtns = DOTS.map((d, i) => { const b = L.el('button', 'opt', `${d} ${HN[i]}`, L.ctl); b.type = 'button'; b.onclick = () => { S.heat = i + 1; Book.sfx('tick', { gain: 0.5 }); L.say(); stg.render(0); }; return b; });
    const fresh = L.el('button', 'btn ghost', 'Fresh fabric', L.ctl); fresh.type = 'button';
    fresh.onclick = () => { S.cols = [0, 1].map(() => Array(NC).fill('c')); Book.sfx('paper', { gain: 0.35 }); L.say(); stg.render(0); };
    const OBS = ['the creases stay in both fabrics', 'the polyester goes smooth; the cotton stays creased', 'the cotton goes smooth; the polyester goes shiny, puckers and sticks to the iron'];
    L.say = () => {
      heatBtns.forEach((b, i) => b.classList.toggle('sel', S.heat === i + 1));
      const seen = [1, 2, 3].filter((h) => tested(h, 0) && tested(h, 1)).map((h) => `<b>${DOTS[h - 1]} ${HN[h - 1]}:</b> ${OBS[h - 1]}.`).join(' ');
      const here = tested(S.heat, 0) && tested(S.heat, 1);
      L.status.innerHTML = (L.done ? 'Test finished. You can still iron. ' : !here ? `👉 Iron set to <b>${DOTS[S.heat - 1]} ${HN[S.heat - 1]}</b>. <b>Drag the iron</b> right across <b>both</b> fabrics. ` : S.heat < 3 ? 'Now turn the iron <b>up</b> and iron both again. ' : 'Say what you found, below. ') + seen;
    };
    stg.paint = (x) => {
      const Bd = geo.rect(24, 70, 812, 262, 60);
      Ink.hatchShadow(x, Bd, 1, 8, 8); paper(x, Bd); Ink.stroke(x, Bd, { w: 3, seed: 3 });
      text(x, 'ironing board (from above)', 430, 52, { font: 'hand', size: 22, align: 'center' });
      SW.forEach((s, i) => {
        text(x, s.n, s.x + SWW / 2, 112, { size: 24, align: 'center' });
        const P = geo.rect(s.x, SY, SWW, SHH, 5); paper(x, P, 'rgba(255,255,255,.96)'); Ink.stroke(x, P, { w: 2.8, seed: 9 + i * 4 });
      });
    };
    stg.draw = (ctx, time) => {
      SW.forEach((s, si) => {
        let nm = 0, ns = 0;
        for (let k = 0; k < NC; k++) {
          const st = S.cols[si][k], x0 = s.x + k * CW;
          if (st === 'c') {
            ctx.strokeStyle = rgba(B, 0.6); ctx.lineWidth = 1.5;
            CREASE[si][k].forEach((cr) => { const cx = x0 + CW / 2, cy = SY + cr.y + 10; ctx.beginPath(); ctx.moveTo(cx - Math.cos(cr.a) * cr.l * 0.5, cy - Math.sin(cr.a + 1.2) * cr.l * 0.5); ctx.lineTo(cx + 3, cy + 2); ctx.lineTo(cx + Math.cos(cr.a) * cr.l * 0.5, cy + Math.sin(cr.a + 1.2) * cr.l * 0.5); ctx.stroke(); });
          } else if (st === 'm') {
            nm++;
            wash(ctx, [[x0, SY + 3], [x0 + CW, SY + 3], [x0 + CW, SY + SHH - 3], [x0, SY + SHH - 3]], 'rgba(178,28,38,.16)');
            ctx.strokeStyle = rgba(RD, 0.8); ctx.lineWidth = 1.8; ctx.beginPath();
            for (let j = 0; j <= 10; j++) { const yy = SY + 10 + j * 13; ctx.lineTo(x0 + CW / 2 + Math.sin(j * 1.7 + k * 2.1) * 7, yy); } ctx.stroke();
            ctx.beginPath(); ctx.ellipse(x0 + CW / 2 + Math.sin(k * 5) * 4, SY + 30 + ((k * 37) % 90), 5, 8, k, 0, 7); ctx.stroke();
          } else ns++;
        }
        if (nm >= 3) text(ctx, 'shiny, puckered, stuck to the iron!', s.x + SWW / 2, 312, { font: 'hand', size: 22, align: 'center', color: RD, rot: -0.01 });
        else if (ns === NC) { Ink.tick(ctx, s.x + 70, 310, 0.9); text(ctx, 'smooth', s.x + SWW / 2 + 16, 312, { font: 'hand', size: 22, align: 'center', color: GR }); }
      });
      if (!L.live) { text(ctx, 'predict first!', 430, 312, { font: 'hand', size: 26, align: 'center', color: RD, rot: -0.03 }); }
      // the iron, seen from above, nose to the right
      const ix = S.x, hot = S.heat === 3, col = hot ? RD : B;
      const body = [[ix - 80, IY - 44], ...geo.curve([ix - 60, IY - 54], [ix + 20, IY - 56], [ix + 70, IY - 30], [ix + 92, IY], 14), ...geo.curve([ix + 92, IY], [ix + 70, IY + 30], [ix + 20, IY + 56], [ix - 60, IY + 54], 14), [ix - 80, IY + 44], [ix - 80, IY - 44]];
      Ink.stroke(ctx, geo.curve([ix - 80, IY], [ix - 130, IY - 10], [ix - 120, IY - 90], [ix - 190, IY - 130], 20), { w: 2.4, seed: 88, amp: 0.4 });
      Ink.hatchShadow(ctx, body, 1, 7, 7, col); paper(ctx, body); Ink.stroke(ctx, body, { w: 3.2, color: col, seed: 90, amp: 0.4 });
      const hd = geo.rect(ix - 56, IY - 15, 96, 30, 14); Ink.hatchFill(ctx, hd, 1, col, 1.3); Ink.stroke(ctx, hd, { w: 2.4, color: col, seed: 93, amp: 0.4 });
      for (let i = 0; i < S.heat; i++) { ctx.fillStyle = rgba(RD, 0.92); ctx.beginPath(); ctx.arc(ix - 40 + i * 20, IY + 34, 6, 0, 7); ctx.fill(); }
      if (S.heat >= 2 && S.drag) for (let i = 0; i < S.heat; i++) { const ph = (time * 0.9 + i / 3) % 1, sx = ix + 100 + i * 12, sy = IY - 20 + i * 20 - ph * 30; ctx.save(); ctx.globalAlpha = 1 - ph; Ink.stroke(ctx, geo.curve([sx, sy], [sx + 8, sy - 8], [sx - 6, sy - 16], [sx + 4, sy - 26], 8), { w: 1.8, color: col, seed: 96 + i, retrace: false }); ctx.restore(); }
      return S.drag;
    };
    const ready = () => { L.say(); if (tested(3, 0) && tested(3, 1)) L.openConc(); };
    let lastSnd = 0;
    const move = (x) => {
      S.x = clamp(x, 100, 760);
      let changed = false;
      SW.forEach((s, si) => { for (let k = 0; k < NC; k++) {
        const cx = s.x + (k + 0.5) * CW; if (cx < S.x - 78 || cx > S.x + 86) continue;
        S.cov[S.heat - 1][si].add(k);
        const st = S.cols[si][k]; let nu = st;
        if (S.heat === 2 && si === 1 && st === 'c') nu = 's';
        if (S.heat === 3) nu = si === 0 ? 's' : 'm';
        if (nu !== st) { S.cols[si][k] = nu; changed = true; }
      } });
      const now = performance.now();
      if (now - lastSnd > 260) { lastSnd = now; Book.sfx(changed && S.heat === 3 ? 'stroke' : 'paper', changed && S.heat === 3 ? { material: 'pen', dur: 0.3, gain: 0.6 } : { gain: 0.2, dur: 0.2 }); }
    };
    c.addEventListener('pointerdown', (e) => {
      if (!L.live) { Book.toast('Predict first: then you can pick up the iron.'); return; }
      const [x, y] = stg.pos(e); if (y < 70 || y > 334) return;
      L.lock(); S.drag = true; try { c.setPointerCapture(e.pointerId); } catch (er) {} move(x); e.preventDefault(); stg.go();
    });
    c.addEventListener('pointermove', (e) => { if (!S.drag) return; move(stg.pos(e)[0]); stg.go(); });
    const up = () => { if (!S.drag) return; S.drag = false; ready(); stg.render(0); };
    c.addEventListener('pointerup', up); c.addEventListener('pointercancel', up); c.addEventListener('lostpointercapture', up);
  }

  // ======================================================================================
  // pen animations
  // ======================================================================================
  function spinneretAnim(k) {
    // oil drum
    k.line(k.ellipse(90, 122, 48, 13), 0.2, 0.9); k.line([[42, 122], [42, 250]], 0.9, 1.2); k.line([[138, 122], [138, 250]], 1.2, 1.5);
    k.line(k.ellipse(90, 250, 48, 13, 0, Math.PI), 1.5, 1.9); k.line(k.ellipse(90, 186, 48, 13, 0, Math.PI), 1.9, 2.2, { w: 1.8 });
    k.hatch([[42, 134], [138, 134], [138, 258], [42, 258]], 2.0, 2.5, { density: 0.8 });
    k.text('crude oil', 90, 300, 2.0, 2.6, { size: 24, align: 'center' });
    k.arrow([[152, 180], [200, 180]], 2.6, 3.0);
    // hopper of polymer chips on a heated barrel
    k.line([[214, 92], [306, 92], [284, 150], [236, 150], [214, 92]], 3.0, 3.7);
    [[232, 104], [252, 100], [272, 106], [290, 100], [244, 120], [264, 122], [280, 118], [256, 138]].forEach(([x, y], i) => k.line(k.rect(x - 6, y - 5, 12, 10, 2), 3.7 + i * 0.07, 3.8 + i * 0.07, { w: 1.6, retrace: false }));
    k.text('polymer chips', 260, 76, 3.8, 4.5, { size: 22, align: 'center' });
    k.box(214, 150, 250, 60, 4.6, 5.4, { radius: 6 });
    const zz = []; for (let i = 0; i <= 12; i++) zz.push([226 + i * 19, i % 2 ? 196 : 164]); k.line(zz, 5.4, 6.0, { w: 1.8, retrace: false });
    [250, 300, 350, 400].forEach((fx, i) => k.line(k.curve([fx - 8, 244], [fx - 14, 228], [fx + 6, 232], [fx, 216], 10), 6.0 + i * 0.15, 6.2 + i * 0.15, { color: RD, w: 2.4 }));
    k.text('heated until it melts', 340, 300, 6.2, 7.0, { size: 22, align: 'center', color: RD });
    // the spinneret
    k.line([[464, 158], [500, 128], [500, 232], [464, 202]], 7.0, 7.7);
    k.line([[500, 124], [500, 236]], 7.7, 8.0, { w: 4 });
    [140, 160, 180, 200, 220].forEach((y, i) => k.dot(500, y, 4, 8.0 + i * 0.08, { color: RD }));
    k.text('spinneret: tiny holes', 520, 100, 7.8, 8.6, { size: 22, align: 'center' });
    // filaments
    [140, 160, 180, 200, 220].forEach((y, i) => k.line(k.curve([504, y], [580, y], [640, 180 + (y - 180) * 0.25], [720, 180], 30), 8.7 + i * 0.3, 9.6 + i * 0.3, { w: 1.8, retrace: false }));
    k.text('filaments', 610, 262, 10.2, 10.9, { size: 22, align: 'center' });
    // bobbin
    k.line([[720, 180], [748, 180]], 11.0, 11.2, { w: 2.4 });
    k.line(k.rect(748, 132, 16, 96, 4), 11.2, 11.7); k.line(k.rect(814, 132, 16, 96, 4), 11.7, 12.2);
    for (let i = 0; i < 6; i++) k.line([[764, 146 + i * 14], [814, 150 + i * 14]], 12.2 + i * 0.1, 12.32 + i * 0.1, { w: 1.8, retrace: false });
    k.text('yarn', 790, 262, 12.6, 13.1, { size: 22, align: 'center' });
  }
  function pleatAnim(k) {
    const zig = (x0, y, n, amp) => { const P = []; for (let i = 0; i <= n; i++) P.push([x0 + i * 17, y + (i % 2 ? -amp : amp)]); return P; };
    k.text('Pleats pressed in with a warm iron, then washed…', 20, 36, 0.2, 1.6, { size: 22 });
    [['polyester', 104, 22, true], ['cotton', 196, 3, false]].forEach(([name, y, after, ok], r) => {
      const t0 = 1.8 + r * 4.6;
      k.text(name, 20, y + 8, t0, t0 + 0.5, { size: 24, font: 'bubble' });
      k.line(zig(190, y, 10, 22), t0 + 0.5, t0 + 1.5);
      k.arrow([[384, y], [470, y]], t0 + 1.6, t0 + 2.0);
      k.text('wash', 427, y - 14, t0 + 1.6, t0 + 2.1, { size: 22, align: 'center' });
      k.line(zig(500, y, 10, after), t0 + 2.2, t0 + 3.2);
      if (k.t >= t0 + 3.3) { if (ok) Ink.tick(k.ctx, 692, y + 6, 1.1); else Ink.cross(k.ctx, 706, y, 1.1); }
      k.text(ok ? 'heat-set!' : 'fell out', 738, y + 8, t0 + 3.4, t0 + 4.0, { size: 22, color: ok ? GR : RD });
    });
  }

  // ======================================================================================
  Book.page({ id: 'p04', title: 'Synthetic fibres', build(ui, root) {
    ui.h('Synthetic fibres');
    ui.p('Cotton, linen, wool and silk are grown. <b>Synthetic</b> fibres are <b>made in a factory</b>: and the starting material is a surprise. Watch a fibre being made.');
    ui.anim({ w: 860, h: 320, duration: 13.6, poster: 2.7, draw: spinneretAnim,
      sound(k) { [0.2, 0.9, 1.5, 3.0, 4.6, 5.4, 7.0, 7.7, 8.7, 9.3, 9.9, 11.2, 11.7, 12.2].forEach((t) => k.play('stroke', t, { material: 'pen', dur: 0.5, gain: 0.5 })); k.play('success', 13.1, { gain: 0.25 }); } });
    const intro = ui.box(`<p style="margin:0 0 6px">Synthetic fibres are made from <span class="key">crude oil</span>: they are <b>polymers</b>. Oil is a <b>finite</b> resource (it will run out).</p>
      <p style="margin:0">As they are made, they are <b>filament</b> fibres: very long and continuous. Three to know: <b>polyester</b>, <b>polyamide (nylon)</b> and <b>elastane (Lycra)</b>.</p>`, { tag: 'Notes' });
    ui.p('<b>The fibre lab.</b> Three rigs. On each one: <b>predict</b>, test, then say what you found. Your notes unlock when a rig is finished.');

    const rig1 = Lab(ui, {
      id: 'p04.stretch', label: 'Stretch rig: polyester / polyamide / elastane (predict, test, conclude)', seed: 41, H: 440,
      step: 'Rig 1 · the stretch rig',
      task: 'Three yarns hang from a bar. Each one is <b>10 cm</b> long. You can hang up to three 100 g weights on each.',
      predQ: 'Which yarn will stretch the <b>most</b>?', predOpts: ['polyester', 'polyamide (nylon)', 'elastane'], predRight: 'elastane',
      lockMsg: 'Your notes on stretch appear here when you have finished the stretch rig.',
      setup: stretchRig,
      summary: 'with 3 weights: polyester 10→10.5 cm, polyamide 10→12 cm, elastane 10→60 cm; all sprang back',
      concQ: 'The <b>elastane</b> yarn…',
      concOpts: [
        { t: 'stretched to about 6 times its length, then sprang back', ok: true },
        { t: 'stretched to about 6 times its length and stayed stretched', mis: 'synthetic-mixup', why: 'Take all the weights off again and watch the elastane yarn closely.' },
        { t: 'stretched about as far as the polyamide, then sprang back', mis: 'synthetic-mixup', why: 'Compare the two lengths with 3 weights on each: read them off the ruler.' },
        { t: 'hardly stretched at all, just like the polyester yarn did', mis: 'synthetic-mixup', why: 'Load the elastane with all 3 weights and read its length.' },
      ],
      right: 'Elastane stretched to 6 times its length and sprang straight back. The polyamide gave a little; the polyester hardly moved.',
      notes: `<p><span class="key">Elastane (Lycra)</span>: <b>extremely stretchy</b>. It stretches to about <b>5–7 times</b> its length and <b>springs back</b>. Lightweight.</p>
        <p>It is <b>added in small amounts</b> (around 2–20%) to other fibres.</p>
        <p><span class="key">Polyamide (nylon)</span>: very <b>strong</b> and <b>hard-wearing</b>, elastic, smooth, lightweight.</p>`,
    });
    const rig2 = Lab(ui, {
      id: 'p04.dry', label: 'Quick-dry race: cotton / polyester / polyamide (predict, test, conclude)', seed: 52, H: 390,
      step: 'Rig 2 · the quick-dry race',
      task: 'Three swatches are soaked in water, then pegged on the line at the same moment.',
      predQ: 'Which swatch will take the <b>longest</b> to dry?', predOpts: ['cotton', 'polyester', 'polyamide (nylon)'], predRight: 'cotton',
      lockMsg: 'Your notes on drying appear here when you have finished the quick-dry race.',
      setup: dryRig,
      summary: 'dry after: polyester 35 min, polyamide 45 min, cotton 2 h',
      concQ: 'Pick the best conclusion.',
      concOpts: [
        { t: 'The two synthetics dried fast: they soak up very little water', ok: true },
        { t: 'The two synthetics dried fast: they soak up a lot of water', mis: 'property-word', why: 'A fibre that soaks up a lot of water holds on to it, so it dries slowly. Which swatch did that?' },
        { t: 'The cotton dried fastest: the water just ran straight off it', mis: 'property-word', why: 'Drag the clock again. Which swatch was still dripping after an hour?' },
        { t: 'All three dried at the same speed: the fibre does not matter', why: 'Drag the clock again and read the time under each “dry!”.' },
      ],
      right: 'Polyester and polyamide soak up very little water (low absorbency), so they dry quickly. Cotton soaks water right in, so it is slow to dry.',
      notes: `<p>Polyester and polyamide have <b>low absorbency</b>, so they are <span class="key">quick drying</span>.</p>
        <p>The catch: polyester is <b>not very breathable</b>, so it can feel sweaty.</p>
        <p class="small">Cotton is the opposite: absorbent and comfortable, but slow to dry.</p>`,
    });
    let pleatWrap = null;
    const rig3 = Lab(ui, {
      id: 'p04.iron', label: 'Hot iron test: cotton vs polyester (predict, test, conclude)', seed: 63, H: 350,
      step: 'Rig 3 · the hot iron test',
      task: 'Two creased swatches lie on the ironing board. The iron has three settings: start <b>cool</b> and work up.',
      predQ: 'When the iron is on its <b>hottest</b> setting (●●●), which fabric will be damaged?', predOpts: ['cotton', 'polyester', 'neither of them'], predRight: 'polyester',
      lockMsg: 'Your notes on heat appear here when you have finished the hot iron test.',
      setup: ironRig,
      summary: 'ironed both on ●●● hot: cotton went smooth, polyester went shiny and puckered',
      concQ: 'What does this tell you about <b>synthetic</b> fibres like polyester?',
      concOpts: [
        { t: 'They soften and melt with heat, so they need a cooler iron', ok: true },
        { t: 'They can take more heat than cotton, so iron them hotter', mis: 'synthetic-melt', why: 'Look at the two swatches after the ●●● setting. Which one was spoiled?' },
        { t: 'They react to heat just like cotton does: fibre is no factor', mis: 'synthetic-melt', why: 'Put fresh fabric on and iron both on ●●● again. Do they look the same?' },
        { t: 'They cannot be ironed on any setting without being spoiled', mis: 'synthetic-melt', why: 'Put fresh fabric on and try the ●● setting on the polyester.' },
      ],
      right: 'The hot iron melted the surface of the polyester. Cotton can take the heat (it needs it to lose its creases).',
      notes: `<p>Most synthetic fibres are <span class="key">thermoplastic</span>: they soften with heat, so they can <b>melt</b> if ironed too hot.</p>
        <p>The useful side: they can be <span class="key">heat-set</span>. Pleats pressed in with heat <b>stay in</b>. Watch below.</p>`,
      onDone: () => { if (pleatWrap) pleatWrap.style.display = ''; },
    });
    ui.anim({ w: 860, h: 300, duration: 11.4, poster: 1.7, draw: pleatAnim,
      sound(k) { [0.2, 2.3, 3.4, 4.0, 6.9, 8.0, 8.6].forEach((t) => k.play('stroke', t, { material: 'pen', dur: 0.6, gain: 0.5 })); k.play('success', 5.1, { gain: 0.25 }); k.play('error', 9.7, { gain: 0.2 }); } });
    pleatWrap = root.lastElementChild;
    if (!(Book.state.items['p04.iron'] || {}).correct) pleatWrap.style.display = 'none';

    const big = ui.box(`<p style="margin:0 0 4px">Synthetic fibres are generally <b>strong</b>, <b>durable</b> and <b>crease-resistant</b>. What they are used for:</p>
      <div class="tx4-uses">
        <div><h4>Polyester</h4>Cheap; often blended with cotton. Fleece jackets, duvet filling, sails, shirts, sportswear, bedding.</div>
        <div><h4>Polyamide (nylon)</h4>Tights and stockings, rope, parachutes, tents, toothbrush bristles, carpets, swimwear.</div>
        <div><h4>Elastane (Lycra)</h4>Leggings, stretch jeans, cycling shorts, underwear, sportswear, swimwear.</div>
      </div>`, { tag: 'Notes · what they are used for' });

    ui.h('Check what you know', { size: 40 });
    ui.p('The rigs and your notes will <b>blur</b> while you answer: recall them!');
    const hide = [rig1.lab, rig1.notes, rig2.lab, rig2.notes, rig3.lab, rig3.notes, pleatWrap, big];
    const m = ui.match({
      id: 'p04.uses', label: 'Match polyester / polyamide / elastane to properties and uses',
      q: 'Tap a fibre, then tap what it is like and what it is used for.',
      pairs: [
        ['Polyester', 'durable, crease-resistant, cheap: fleece jackets, duvet filling, sails', 'synthetic-mixup'],
        ['Polyamide (nylon)', 'hard-wearing, smooth, lightweight: tights, rope, parachutes, tents', 'synthetic-mixup'],
        ['Elastane (Lycra)', 'extremely stretchy, springs back: leggings, cycling shorts, stretch jeans', 'synthetic-mixup'],
      ],
    });
    ui.hideWhile(m, 'p04.uses', hide);
    const q = ui.mcq({
      id: 'p04.elastane', label: 'Why is elastane only a small % of leggings?',
      q: 'The label in a pair of leggings says <b>90% polyamide, 10% elastane</b>. Why is there so little elastane?',
      options: [
        { t: 'A small amount is enough to make the whole fabric stretch and spring back', ok: true, why: 'Yes. Elastane stretches so far that a little goes a long way: it is added in small amounts (around 2–20%) to another fibre, which does the rest of the job.' },
        { t: 'Elastane is normally used on its own: only cheap leggings mix it like this', mis: 'elastane-alone', why: 'Elastane is not used on its own. Think back to the stretch rig: how far did one thin yarn stretch?' },
        { t: 'Elastane hardly stretches, so adding any more would make leggings stiff', mis: 'synthetic-mixup', why: 'Think back to the stretch rig: which yarn went to 6 times its length?' },
        { t: 'Elastane is a natural fibre, so there is never enough of it to use more', mis: 'natural-synthetic', why: 'Elastane is synthetic: it is made from crude oil, like polyester and polyamide.' },
      ],
    });
    ui.hideWhile(q, 'p04.elastane', hide);

    ui.p('<b>Synthetics and the environment.</b> Two to think about. <span class="small">(You know what they are made from…)</span>');
    const t1 = ui.tf({ id: 'p04.biodeg', label: 'T/F: a polyester fleece biodegrades in landfill', mis: 'synthetic-melt',
      statement: 'A polyester fleece buried in landfill will <b>rot away</b> (biodegrade) in a few years, just as a wool jumper would.', answer: false,
      explain: 'False. Most synthetic fibres are <b>not biodegradable</b>. Natural fibres like wool are.' });
    const t2 = ui.tf({ id: 'p04.micro', label: 'T/F: washing synthetics sheds microfibres into water',
      statement: 'Every time synthetic clothes are washed, tiny <b>microfibres</b> break off and are carried away in the water.', answer: true,
      explain: 'True. Washing synthetic fabrics sheds <b>microfibres</b> into the water.' });
    const env = ui.box(`<p style="margin:0 0 6px">Synthetic fibres come from <b>crude oil</b>, a finite resource. Most are <span class="key">not biodegradable</span>.</p>
      <p style="margin:0 0 6px">Washing them sheds <span class="key">microfibres</span> into the water.</p>
      <p style="margin:0">Some good news: some can be <b>recycled</b>. Polyester can be made from old PET drinks bottles.</p>
      <p class="small" style="margin:6px 0 0">One more family to have heard of: <b>regenerated</b> fibres such as viscose, made from wood pulp cellulose treated with chemicals.</p>`, { tag: 'Notes · the environment' });
    const answered = () => !!Book.state.items['p04.biodeg'] && !!Book.state.items['p04.micro'];
    if (!answered()) { env.classList.add('peek-lock'); [t1, t2].forEach((t) => t.addEventListener('click', () => setTimeout(() => { if (answered()) env.classList.remove('peek-lock'); }, 50))); }
  } });
})();
