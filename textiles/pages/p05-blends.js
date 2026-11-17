// Page 5 — Blends & mixtures. (1) The blend mixer: cotton and polyester hoppers, a % slider and five property bars
// that only update when the student presses SPIN. Predict what 65/35 polycotton is like, test it, then fill an order
// for a school shirt (comfy + no ironing). (2) Stretch jeans: choose the second fibre from a shelf and how much of it,
// then pull-test the jeans. (3) Notes (the blend cards unlock with the challenges), blend vs mixture, why blend.
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

  if (!document.getElementById('tx5-css')) {
    const s = document.createElement('style'); s.id = 'tx5-css';
    s.textContent = `
      .tx5-lab { position: relative; margin: 0 0 calc(var(--R) * 1); padding: 12px 16px 16px; background: rgba(251,250,245,.9); }
      .tx5-lab > * { position: relative; }
      .tx5-step { font: 700 14px Fredoka, system-ui; letter-spacing: .08em; text-transform: uppercase; color: var(--red); line-height: 22px; }
      .tx5-task { font-size: 19px; line-height: 1.5; margin: 0 0 8px; }
      .tx5-task b, .tx5-q b, .tx5-status b, .tx5-order b { font-family: Fredoka, system-ui; font-weight: 600; }
      .tx5-q { font-size: 19px; line-height: 1.5; margin: 6px 0 8px; }
      .tx5-btns { display: flex; flex-wrap: wrap; gap: 10px; align-items: stretch; margin: 0 0 8px; }
      .tx5-btns .btn { margin-top: 0; min-height: 50px; }
      .tx5-cv { display: block; width: 100%; height: auto; touch-action: pan-y; user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; cursor: pointer; }
      .tx5-status { font-size: 17px; line-height: 1.5; min-height: 26px; margin: 2px 0 6px; }
      .tx5-order { display: none; margin-top: 8px; padding-top: 8px; border-top: 2px dashed rgba(30,46,150,.3); font-size: 19px; line-height: 1.5; }
      .tx5-order.on { display: block; }
      .tx5-order .hd { font: 700 14px Fredoka, system-ui; letter-spacing: .08em; text-transform: uppercase; color: var(--red); display: block; }
      .tx5-locked { font-size: 17px; opacity: .75; margin: 0; }
      .tx5-nb p { margin: 0 0 6px; }
      .tx5-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 8px 18px; margin-top: 4px; }
      .tx5-cards > div { font-size: 17px; line-height: 1.5; }
      .tx5-cards h4 { font: 700 20px Fredoka, system-ui; margin: 0; color: var(--ink); }
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
  // a fluffy cotton tuft (curly, blue) and a smooth polyester tuft (straight, red)
  function tuft(x, cx, cy, poly, rot = 0) {
    x.save(); x.translate(cx, cy); x.rotate(rot); x.lineWidth = 1.7; x.strokeStyle = rgba(poly ? RD : B, 0.85); x.beginPath();
    if (poly) { for (let i = -1; i <= 1; i++) { x.moveTo(-11, i * 4.5); x.quadraticCurveTo(0, i * 4.5 - 2.5, 11, i * 4.5); } }
    else { for (let a = 0; a <= 9.6; a += 0.4) { const r = 2 + a * 0.9; x.lineTo(Math.cos(a) * r, Math.sin(a) * r * 0.85); } }
    x.stroke(); x.restore();
  }

  function Stage(parent, HH) {
    const c = document.createElement('canvas'); c.className = 'tx5-cv'; parent.appendChild(c);
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
  // 1. the blend mixer (+ prediction + the school shirt order)
  // ======================================================================================
  // scores out of 10 for a cotton/polyester blend, p = fraction of polyester (illustrative model)
  const MODEL = [
    ['comfort & absorbency', (p) => 9 - 6 * p * p],
    ['crease resistance', (p) => 2 + 7 * (1 - (1 - p) * (1 - p))],
    ['drying speed', (p) => 3 + 6 * p],
    ['strength', (p) => 6 + 3 * p],
    ['cost', (p) => 8 - 5 * p],
  ];
  const NEED = [6, 7];                                            // school shirt: comfort >= 6 and crease resistance >= 7
  const POPTS = ['Just like cotton: comfy, but it creases badly', 'Just like polyester: tough, but it feels sweaty', 'A bit of both: fairly comfy and creases less', 'Worse than both of the fibres at everything'];

  function Mixer(ui, onC1) {
    const el = ui.el;
    const rP = ui.record('p05.predict', { label: 'Prediction: what will 65/35 polycotton be like?', type: 'predict', max: 0 });
    const r1 = ui.record('p05.c1', { label: 'Blend mixer order: school shirt, comfy + no ironing (accept 50–70% polyester)', type: 'experiment', max: 1 });
    const lab = el('div', 'tx5-lab'); requestAnimationFrame(() => Ink.frame(lab, { shadow: false, w: 2.2 }));
    el('div', 'tx5-step', 'The blend mixer', lab);
    el('p', 'tx5-task', 'Loose <b>cotton</b> and <b>polyester</b> fibres drop from the hoppers into the mixer, <b>before</b> they are spun into yarn. The slider sets how much of each. The bars only move when you press <b>SPIN</b>.', lab);
    el('div', 'tx5-q', '<b>Predict first.</b> <b>Polycotton</b> is 65% polyester and 35% cotton. What will it be like?', lab);
    const predRow = el('div', 'opts', '', lab); predRow.style.marginBottom = '10px';
    const prevP = rP.get() || {}, prev1 = r1.get() || {};
    const tries = (prev1.tries || []).slice();
    const S = { pred: prevP.pred || null, tested: !!prevP.tested, solved: prev1.correct === true, pct: 30, spun: null, spin: -1, drag: false, vals: null, shown: [0, 0, 0, 0, 0] };
    if (S.solved) S.pct = prev1.pct || 65; else if (S.tested) S.pct = 65;
    const vals = (pct) => MODEL.map((m) => m[1](pct / 100));
    if (S.tested || S.solved) { S.spun = S.pct; S.vals = vals(S.pct); S.shown = S.vals.slice(); }
    const HH = 444, stg = Stage(lab, HH), c = stg.c;
    const status = el('div', 'tx5-status', '', lab);
    const ctl = el('div', 'tx5-btns', '', lab);
    const spinBtn = el('button', 'btn', '🌀 SPIN', ctl), sendBtn = el('button', 'btn ghost', '📦 Send this blend to the customer', ctl); spinBtn.type = sendBtn.type = 'button';
    const reveal = el('div', 'fb', '', lab);
    const order = el('div', 'tx5-order', `<span class="hd">Order · school shirt</span>A uniform shop wants a shirt fabric that is <b>comfy</b> to wear all day <b>and</b> needs <b>no ironing</b>. The <span class="red">red markers</span> on the bars show the least it needs. Find a blend, <b>SPIN</b> it, then send it.`, lab), fb = el('div', 'fb', '', order);

    const SL = { x0: 60, x1: 410, y: 414 }, DC = [235, 262], DR = 72, BX = 500, BU = 30;
    const HOP = [125, 345];
    const SLOTS = [[-18, 136], [8, 136], [-36, 116], [-12, 116], [12, 116], [36, 116], [-48, 95], [-16, 95], [16, 95], [48, 95]];
    const DT = []; for (let i = 0; i < 9; i++) DT.push([Math.cos(i * 0.698) * 46, Math.sin(i * 0.698) * 46, i * 1.3]); for (let i = 0; i < 5; i++) DT.push([Math.cos(i * 1.257 + 0.4) * 18, Math.sin(i * 1.257 + 0.4) * 18, i * 2.1]);
    const isPoly = (i, n, N) => Math.floor(((i + 1) * n) / N) > Math.floor((i * n) / N);

    const say = () => {
      const live = !!S.pred, stale = S.spun !== S.pct;
      status.style.visibility = live ? '' : 'hidden'; ctl.style.display = live ? '' : 'none';
      sendBtn.style.display = S.tested ? '' : 'none'; sendBtn.disabled = S.solved || stale || S.spin >= 0; spinBtn.disabled = S.spin >= 0;
      status.innerHTML = !S.tested ? `👉 Test your prediction: <b>drag the slider to 65% polyester</b>, then press <b>SPIN</b>. <span class="small">(Now: ${S.pct}% polyester.)</span>`
        : S.solved ? 'Order sent. You can still mix and spin other blends.'
        : stale ? `Mixer set to <b>${S.pct}% polyester / ${100 - S.pct}% cotton</b>: press SPIN to test it.` : `Tested: <b>${S.pct}% polyester / ${100 - S.pct}% cotton</b>. Send it, or change the blend.`;
      order.classList.toggle('on', S.tested);
    };
    const showReveal = () => {
      reveal.className = 'fb on good';
      reveal.innerHTML = `<b style="font-family:Fredoka">Polycotton (65/35):</b> still fairly comfortable and absorbent, thanks to the cotton: but stronger, it creases less, dries faster and costs less, thanks to the polyester. ${S.pred === POPTS[2] ? 'Your prediction was spot on.' : `You predicted “${Book.esc(S.pred)}”: the mixer has put that right.`}`;
    };

    stg.paint = (x) => {
      text(x, 'cotton', HOP[0], 28, { size: 24, align: 'center' }); text(x, 'polyester', HOP[1], 28, { size: 24, align: 'center', color: RD });
      HOP.forEach((hx, i) => {
        const P = [[hx - 70, 76], [hx + 70, 76], [hx + 32, 152], [hx - 32, 152], [hx - 70, 76]];
        Ink.hatchShadow(x, P, 1, 6, 6); paper(x, P); Ink.stroke(x, P, { w: 2.8, seed: 5 + i * 3 });
        const dir = i ? -1 : 1;
        Ink.stroke(x, [[hx - 14, 152], [hx - 14 + dir * 62, 204]], { w: 2.4, seed: 11 + i }); Ink.stroke(x, [[hx + 14, 152], [hx + 14 + dir * 62, 196]], { w: 2.4, seed: 14 + i });
      });
      const D = geo.ellipse(DC[0], DC[1], DR, DR); Ink.hatchShadow(x, D, 1, 8, 8); paper(x, D); Ink.stroke(x, D, { w: 3.2, seed: 21 });
      Ink.stroke(x, geo.ellipse(DC[0], DC[1], DR - 8, DR - 8), { w: 1.4, seed: 23, retrace: false });
      [[-52, 68], [52, 68]].forEach(([dx, dy], i) => Ink.stroke(x, [[DC[0] + dx * 0.9, DC[1] + dy * 0.9], [DC[0] + dx * 1.25, DC[1] + 104]], { w: 3, seed: 25 + i }));
      Ink.stroke(x, [[DC[0] - 90, DC[1] + 105], [DC[0] + 90, DC[1] + 105]], { w: 2.6, seed: 28 });
      [[396, 300], [448, 300]].forEach(([bx, by], i) => { const R = geo.rect(bx, by, 12, 72, 3); paper(x, R); Ink.hatchFill(x, R, 1, B, 1.5); Ink.stroke(x, R, { w: 2.2, seed: 31 + i }); });
      Ink.stroke(x, [[SL.x0, SL.y], [SL.x1, SL.y]], { w: 3.2, seed: 41 });
      for (let i = 0; i <= 20; i++) { const px = lerp(SL.x0, SL.x1, i / 20), big = i % 5 === 0; Ink.stroke(x, [[px, SL.y - (big ? 11 : 6)], [px, SL.y + (big ? 11 : 6)]], { w: big ? 2 : 1.3, seed: 50 + i, retrace: false }); }
      text(x, '← more cotton', SL.x0 - 8, SL.y - 24, { size: 22 }); text(x, 'more polyester →', SL.x1 + 8, SL.y - 24, { size: 22, align: 'right', color: RD });
      MODEL.forEach((m, i) => {
        const y = 36 + i * 80; text(x, m[0] + (i === 4 ? '  (lower = cheaper)' : ''), BX, y, { size: 22 });
        const R = geo.rect(BX, y + 10, 300, 28, 4); paper(x, R); Ink.stroke(x, R, { w: 2.2, seed: 60 + i });
        for (let u = 1; u < 10; u++) Ink.stroke(x, [[BX + u * BU, y + 38], [BX + u * BU, y + (u === 5 ? 46 : 43)]], { w: 1.2, seed: 70 + u, retrace: false });
      });
    };
    stg.draw = (ctx, t, dt) => {
      let more = false;
      const live = !!S.pred, pct = S.pct, stale = S.spun !== pct, spinning = S.spin >= 0;
      if (spinning) {
        S.spin += dt / 1.5; more = true;
        if (S.spin >= 1) { S.spin = -1; S.spun = pct; S.vals = vals(pct); Book.sfx('pop', { gain: 0.5 }); spun(); }
      }
      // hoppers: % readouts and tufts
      text(ctx, (100 - pct) + '%', HOP[0], 62, { size: 32, align: 'center' }); text(ctx, pct + '%', HOP[1], 62, { size: 32, align: 'center', color: RD });
      const nC = Math.round((100 - pct) / 10), nP = Math.round(pct / 10);
      for (let i = 0; i < nC; i++) tuft(ctx, HOP[0] + SLOTS[i][0], SLOTS[i][1], false, i);
      for (let i = 0; i < nP; i++) tuft(ctx, HOP[1] + SLOTS[i][0], SLOTS[i][1], true, i * 0.5 - 1);
      // drum: paddle + the mixed fibres
      const ang = S.spin >= 0 ? ease(S.spin) * Math.PI * 6 : 0;
      ctx.save(); ctx.translate(DC[0], DC[1]); ctx.rotate(ang);
      ctx.strokeStyle = rgba(B, 0.55); ctx.lineWidth = 2; ctx.beginPath(); for (let i = 0; i < 3; i++) { const a = i * 2.094; ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * (DR - 12), Math.sin(a) * (DR - 12)); } ctx.stroke();
      if (live && (spinning || !stale)) { const n = Math.round((pct * DT.length) / 100); DT.forEach((d, i) => tuft(ctx, d[0], d[1], isPoly(i, n, DT.length), d[2])); }
      ctx.restore();
      ctx.fillStyle = rgba(B, 0.95); ctx.beginPath(); ctx.arc(DC[0], DC[1], 6, 0, 7); ctx.fill();
      if (spinning && S.spin < 0.4) {                                // fibres dropping down the chutes
        const f = S.spin / 0.4;
        if (nC) tuft(ctx, lerp(HOP[0], HOP[0] + 62, f), lerp(152, 204, f), false, f * 5); if (nP) tuft(ctx, lerp(HOP[1], HOP[1] - 62, f), lerp(152, 204, f), true, f * 5);
      }
      if (!live) text(ctx, 'predict first!', DC[0], DC[1] + 8, { font: 'hand', size: 24, align: 'center', color: RD, rot: -0.04 });
      else if (stale && !spinning) text(ctx, 'press SPIN', DC[0], DC[1] + 44, { font: 'hand', size: 22, align: 'center', color: RD, rot: -0.04 });
      // the blended yarn winding on to the bobbin
      if (live && !stale && !spinning) {
        const Y = geo.curve([DC[0] + DR - 4, DC[1] + 20], [340, 300], [360, 330], [408, 336], 20), n20 = Math.round(pct / 5);
        ctx.lineWidth = 3;
        for (let i = 0; i < 20; i++) { ctx.strokeStyle = rgba(isPoly(i, n20, 20) ? RD : B, 0.9); ctx.beginPath(); ctx.moveTo(Y[i][0], Y[i][1] + (i % 2 ? 1.5 : -1.5)); ctx.lineTo(Y[i + 1][0], Y[i + 1][1] + (i % 2 ? -1.5 : 1.5)); ctx.stroke(); }
        const n6 = Math.round((pct * 6) / 100);
        for (let i = 0; i < 6; i++) { ctx.strokeStyle = rgba(isPoly(i, n6, 6) ? RD : B, 0.9); ctx.beginPath(); ctx.moveTo(408, 310 + i * 10.5); ctx.lineTo(448, 313 + i * 10.5); ctx.stroke(); }
        text(ctx, pct === 0 || pct === 100 ? 'one fibre: not a blend' : 'blended yarn', 404, 236, { font: 'hand', size: 22, align: 'center', rot: -0.02 });
      }
      // slider knob
      if (live) { const kx = lerp(SL.x0, SL.x1, pct / 100), K = geo.ellipse(kx, SL.y, 19, 19); paper(ctx, K); Ink.hatchFill(ctx, K, 1, S.drag ? RD : B, 1.3); Ink.stroke(ctx, K, { w: 3, color: S.drag ? RD : B, seed: 77 }); }
      // property bars
      MODEL.forEach((m, i) => {
        const y = 36 + i * 80;
        if (S.vals) {
          const d = S.vals[i] - S.shown[i]; if (Math.abs(d) > 0.01) { S.shown[i] += d * (1 - Math.exp(-dt * 7)); more = true; } else S.shown[i] = S.vals[i];
          ctx.save(); if (stale || spinning) ctx.globalAlpha = 0.35;
          const w = Math.max(4, S.shown[i] * BU), R = [[BX + 2, y + 13], [BX + w, y + 13], [BX + w, y + 35], [BX + 2, y + 35]];
          ctx.fillStyle = 'rgba(70,110,210,.2)'; path(ctx, R); ctx.fill(); Ink.hatchFill(ctx, R, 1, B, 1.5); Ink.stroke(ctx, [[BX + w, y + 12], [BX + w, y + 36]], { w: 2.6, seed: 80 + i });
          text(ctx, S.shown[i].toFixed(1), BX + 312, y + 33, { size: 24 });
          ctx.restore();
        } else text(ctx, '?', BX + 312, y + 33, { size: 26 });
        if (S.tested && i < 2) {                                      // what the school shirt needs
          const nx = BX + NEED[i] * BU; ctx.strokeStyle = rgba(RD, 0.95); ctx.lineWidth = 3; ctx.setLineDash([6, 5]); ctx.beginPath(); ctx.moveTo(nx, y + 6); ctx.lineTo(nx, y + 44); ctx.stroke(); ctx.setLineDash([]);
          ctx.fillStyle = rgba(RD, 0.95); ctx.beginPath(); ctx.moveTo(nx - 8, y - 4 + 2); ctx.lineTo(nx + 8, y - 2); ctx.lineTo(nx, y + 9); ctx.closePath(); ctx.fill();
        }
      });
      return more || S.drag;
    };
    function spun() {
      if (S.pct === 65 && !S.tested) {
        S.tested = true; rP.set({ answer: `predicted: "${S.pred}"; then tested 65/35 in the mixer`, correct: null, pred: S.pred, tested: true });
        predBtns.forEach((b) => (b.disabled = true)); showReveal(); Book.sfx('paper', { gain: 0.4 });
      } else if (!S.tested) Book.toast('Now set the slider to 65% polyester and SPIN again.');
      say();
    }
    const setFromX = (x) => { const p = Math.round((clamp((x - SL.x0) / (SL.x1 - SL.x0)) * 100) / 5) * 5; if (p !== S.pct) { S.pct = p; Book.sfx('tick', { gain: 0.25 }); say(); } };
    c.addEventListener('pointerdown', (e) => {
      if (!S.pred) { Book.toast('Predict first: then the mixer switches on.'); return; }
      if (S.spin >= 0) return;
      const [x, y] = stg.pos(e);
      if (Math.abs(y - SL.y) < 50 && x > SL.x0 - 44 && x < SL.x1 + 44) { S.drag = true; try { c.setPointerCapture(e.pointerId); } catch (er) {} setFromX(x); e.preventDefault(); stg.go(); }
    });
    c.addEventListener('pointermove', (e) => { if (!S.drag) return; setFromX(stg.pos(e)[0]); stg.go(); });
    const up = () => { if (!S.drag) return; S.drag = false; stg.go(); stg.render(0); };
    c.addEventListener('pointerup', up); c.addEventListener('pointercancel', up); c.addEventListener('lostpointercapture', up);

    const predBtns = POPTS.map((t) => {
      const b = el('button', 'opt', t, predRow); b.type = 'button'; if (S.pred === t) b.classList.add('sel');
      b.onclick = () => {
        if (S.tested) return;
        predBtns.forEach((q) => q.classList.remove('sel')); b.classList.add('sel'); const first = !S.pred; S.pred = t;
        rP.set({ answer: `predicted: "${t}" (not tested yet)`, correct: null, pred: t }); Book.scribble(0.12); if (first) Book.sfx('pop', { gain: 0.5 });
        say(); stg.render(0);
      };
      return b;
    });
    spinBtn.onclick = () => { if (S.spin >= 0 || !S.pred) return; S.spin = 0; Book.sfx('stroke', { material: 'pen', dur: 1.2, gain: 0.5 }); say(); stg.go(); };
    sendBtn.onclick = () => {
      if (S.solved || S.spun !== S.pct) return;
      const p = S.pct, v = vals(p), ok = v[0] >= NEED[0] && v[1] >= NEED[1], low = v[1] < NEED[1];
      tries.push({ p, ok });
      r1.set({ answer: tries.map((q, i) => `try ${i + 1}: ${q.p}% polyester / ${100 - q.p}% cotton ${q.ok ? '✓' : q.p < 50 ? '✗ (creases)' : '✗ (not comfy)'}`).join('; '), correct: ok, score: ok ? 1 : 0, max: 1, mis: ok ? '' : 'polycotton-props', tries, pct: p });
      Book.sfx(ok ? 'success' : 'error', { gain: 0.35 });
      if (ok) { S.solved = true; fb.className = 'fb on good'; fb.innerHTML = `✓ Customer: “Comfy all day, and straight from the washing line to school!” ${p}% polyester works: enough cotton for comfort, enough polyester to stop the creases. ${tries.length === 1 ? 'First time.' : `Got there on try ${tries.length}.`}`; onC1(); }
      else { fb.className = 'fb on bad'; fb.innerHTML = (low ? '✗ Customer: “Lovely and comfy… but it came out of the wash creased. I had to iron it!” Look at the crease resistance bar and its red marker.' : '✗ Customer: “No ironing: great. But it feels sweaty and clammy by lunchtime.” Look at the comfort bar and its red marker.') + (tries.length >= 3 ? ' <b>Hint:</b> try somewhere between half and two-thirds polyester.' : ''); }
      say();
    };
    stg.init(); say();
    if (S.tested) { predBtns.forEach((b) => (b.disabled = true)); showReveal(); }
    if (S.solved) { fb.className = 'fb on good'; fb.innerHTML = `✓ Order filled with ${S.pct}% polyester / ${100 - S.pct}% cotton: comfy, and no ironing.`; }
    return lab;
  }

  // ======================================================================================
  // 2. stretch jeans: cotton + which second fibre, and how much?
  // ======================================================================================
  const SHELF = ['polyester', 'polyamide', 'elastane', 'linen'];
  function Jeans(ui, onC2) {
    const el = ui.el, r2 = ui.record('p05.c2', { label: 'Stretch jeans order: second fibre + % (cotton + 2–20% elastane)', type: 'experiment', max: 1 });
    const lab = el('div', 'tx5-lab'); requestAnimationFrame(() => Ink.frame(lab, { shadow: false, w: 2.2 }));
    el('div', 'tx5-step', 'Order · stretch jeans', lab);
    el('p', 'tx5-task', 'A jeans brand wants denim that <b>stretches to fit</b> and <b>keeps its shape</b>. The main fibre is cotton. <b>Tap a cone</b> on the shelf to choose the second fibre, <b>drag the slider</b> to set how much, then <b>pull-test</b> the jeans.', lab);
    const prev = r2.get() || {}, tries = (prev.tries || []).slice();
    const S = { solved: prev.correct === true, fib: -1, pct: 0, drag: false, test: -1, res: null };
    if (S.solved) { S.fib = 2; S.pct = prev.pct || 4; S.res = { ok: true, s: 0, txt: 'stretches, then springs back' }; }
    const HH = 390, stg = Stage(lab, HH), c = stg.c;
    const status = el('div', 'tx5-status', '', lab), ctl = el('div', 'tx5-btns', '', lab);
    const testBtn = el('button', 'btn', '↔ Pull-test the jeans', ctl); testBtn.type = 'button';
    const fb = el('div', 'fb', '', lab);
    const CX = [78, 196, 314, 432], SL = { x0: 84, x1: 420, y: 300 }, JX = 668;
    const say = () => {
      status.innerHTML = S.solved ? 'Order sent. You can still try other mixes.' : S.fib < 0 ? '👉 <b>Tap a cone</b> to choose the second fibre.' : `Blend: <b>${100 - S.pct}% cotton + ${S.pct}% ${SHELF[S.fib]}</b>. ${S.pct === 0 ? 'Drag the slider to add some.' : 'Pull-test it.'}`;
      testBtn.disabled = S.test >= 0;
    };
    stg.paint = (x) => {
      Ink.stroke(x, [[16, 150], [494, 150]], { w: 3.2, seed: 3 }); Ink.hatchShadow(x, [[16, 146], [494, 146], [494, 152], [16, 152]], 1, 6, 6);
      SHELF.forEach((n, i) => {
        const cx = CX[i], P = [[cx - 18, 52], [cx + 18, 52], [cx + 36, 146], [cx - 36, 146], [cx - 18, 52]];
        paper(x, P); Ink.stroke(x, P, { w: 2.6, seed: 7 + i * 3 });
        for (let k = 0; k < 7; k++) { const yy = 62 + k * 12, hw = 18 + ((yy - 52) / 94) * 18; Ink.stroke(x, [[cx - hw + 2, yy + 4], [cx + hw - 2, yy - 3]], { w: 1.5, seed: 20 + i * 8 + k, retrace: false, amp: 0.4 }); }
        Ink.stroke(x, [[cx - 7, 52], [cx - 5, 40], [cx + 5, 40], [cx + 7, 52]], { w: 2, seed: 60 + i, retrace: false });
        text(x, n, cx, 182, { size: 22, align: 'center' });
      });
      text(x, 'second fibre: tap a cone', 250, 28, { font: 'hand', size: 22, align: 'center' });
      Ink.stroke(x, [[SL.x0, SL.y], [SL.x1, SL.y]], { w: 3.2, seed: 41 });
      for (let i = 0; i <= 25; i++) { const px = lerp(SL.x0, SL.x1, i / 25), big = i % 5 === 0; Ink.stroke(x, [[px, SL.y - (big ? 11 : 6)], [px, SL.y + (big ? 11 : 6)]], { w: big ? 2 : 1.3, seed: 50 + i, retrace: false }); }
      text(x, '0%', SL.x0 - 28, SL.y + 8, { size: 22, align: 'right' }); text(x, '50%', SL.x1 + 28, SL.y + 8, { size: 22 });
      text(x, 'how much of the second fibre?', 250, 352, { font: 'hand', size: 22, align: 'center' });
    };
    const jeans = (ctx, s) => {
      ctx.save(); ctx.translate(JX, 0); ctx.scale(1 + s, 1); ctx.translate(-680, 0);
      const O = [[600, 46], [760, 46], [762, 70], [772, 332], [698, 332], [682, 150], [678, 150], [662, 332], [588, 332], [598, 70], [600, 46]];
      Ink.hatchShadow(ctx, O, 1, 7, 7); paper(ctx, O); Ink.hatchFill(ctx, O, 1, B, 0.55); Ink.stroke(ctx, O, { w: 3, seed: 81, amp: 0.5 });
      Ink.stroke(ctx, [[598, 70], [762, 70]], { w: 2.2, seed: 83 });
      Ink.stroke(ctx, [[680, 70], [680, 150]], { w: 1.8, seed: 85, retrace: false });
      Ink.stroke(ctx, geo.curve([612, 72], [614, 104], [636, 112], [652, 72], 12), { w: 1.8, seed: 87, retrace: false }); Ink.stroke(ctx, geo.curve([748, 72], [746, 104], [724, 112], [708, 72], 12), { w: 1.8, seed: 89, retrace: false });
      [618, 650, 710, 742].forEach((bx, i) => Ink.stroke(ctx, [[bx, 42], [bx, 72]], { w: 2.4, seed: 91 + i, retrace: false }));
      ctx.fillStyle = rgba(B, 0.9); ctx.beginPath(); ctx.arc(680, 58, 4.5, 0, 7); ctx.fill();
      ctx.restore();
    };
    stg.draw = (ctx, t, dt) => {
      let more = false, s = 0;
      if (S.test >= 0) {
        S.test += dt / 1.7; more = true; const R = S.pending;
        s = R.sag ? (S.test < 0.5 ? R.s * ease(S.test * 2) : lerp(R.s, R.sag, ease((S.test - 0.5) * 2))) : R.s * Math.sin(Math.PI * clamp(S.test));
        if (S.test >= 1) { S.test = -1; more = false; s = R.sag || 0; done(); }
      } else if (S.res) s = S.res.s;
      if (S.fib >= 0) { const cx = CX[S.fib]; Ink.stroke(ctx, geo.rect(cx - 50, 34, 100, 158, 12), { w: 3, color: RD, seed: 70 + S.fib }); Ink.tick(ctx, cx + 18, 122, 1, RD); }
      text(ctx, S.fib < 0 ? 'cotton + ?' : `${100 - S.pct}% cotton + ${S.pct}% ${SHELF[S.fib]}`, 250, 244, { size: 28, align: 'center' });
      const kx = lerp(SL.x0, SL.x1, S.pct / 50), K = geo.ellipse(kx, SL.y, 19, 19); paper(ctx, K); Ink.hatchFill(ctx, K, 1, S.drag ? RD : B, 1.3); Ink.stroke(ctx, K, { w: 3, color: S.drag ? RD : B, seed: 77 });
      jeans(ctx, s);
      if (S.test >= 0) {                                              // the two pull arrows
        const off = 96 * (1 + s) + 8, g = 16 + 14 * Math.sin(Math.PI * clamp(S.test));
        [[-1], [1]].forEach(([d], i) => { const A = [[JX + d * off, 210], [JX + d * (off + g), 210]]; Ink.stroke(ctx, A, { w: 4, color: RD, seed: 95 + i }); Ink.stroke(ctx, geo.head(A, 14), { w: 4, color: RD, seed: 97 + i }); });
      } else if (S.res) text(ctx, S.res.txt, JX, 372, { font: 'hand', size: 22, align: 'center', color: S.res.ok ? GR : RD, rot: -0.01 });
      return more || S.drag;
    };
    const judge = () => {
      const f = SHELF[S.fib], p = S.pct;
      if (p === 0) return { ok: false, s: 0.012, txt: 'no stretch at all', mis: '', why: 'That is 100% cotton denim: strong and comfortable, but it does not stretch. Add some of a second fibre.' };
      if (f === 'elastane') return p <= 20 ? { ok: true, s: 0.1 + p * 0.01, txt: 'stretches, then springs back' }
        : { ok: false, s: 0.42, sag: 0.15, txt: 'far too stretchy: gone baggy', mis: 'elastane-alone', why: `${p}% is far too much elastane: the jeans stretch like leggings and no longer feel like denim. Elastane is only ever added in <b>small</b> amounts.` };
      if (f === 'polyester') return { ok: false, s: 0.015, txt: 'no stretch', mis: 'synthetic-mixup', why: 'Cotton + polyester is polycotton: it creases less and dries faster, but it does not stretch to fit. Which synthetic fibre is the stretchy one?' };
      if (f === 'polyamide') return { ok: false, s: 0.035, txt: 'hardly any stretch', mis: 'synthetic-mixup', why: 'Polyamide makes them harder-wearing, but it gives only a tiny bit of stretch. Which fibre stretched to 6 times its length on the stretch rig?' };
      return { ok: false, s: 0.012, txt: 'no stretch, and creased', mis: 'natural-mixup', why: 'Linen is strong and cool, but it creases very easily and does not stretch. You need a fibre that stretches and springs back.' };
    };
    function done() {
      const R = S.pending; S.res = { ok: R.ok, s: R.sag || 0, txt: R.txt };
      tries.push({ f: SHELF[S.fib], p: S.pct, ok: R.ok });
      r2.set({ answer: tries.map((q, i) => `try ${i + 1}: cotton + ${q.p}% ${q.f} ${q.ok ? '✓' : '✗'}`).join('; '), correct: R.ok, score: R.ok ? 1 : 0, max: 1, mis: R.ok ? '' : R.mis || '', tries, pct: S.pct });
      Book.sfx(R.ok ? 'success' : 'error', { gain: 0.35 });
      if (R.ok) { const first = !S.solved; S.solved = true; fb.className = 'fb on good'; fb.innerHTML = `✓ Stretch jeans! Cotton with just ${S.pct}% elastane: comfortable, they stretch to fit and keep their shape. ${tries.length === 1 ? 'First time.' : `Got there on try ${tries.length}.`}`; if (first) onC2(); }
      else { fb.className = 'fb on bad'; fb.innerHTML = '✗ ' + R.why + (tries.length >= 4 && !S.solved ? ' <b>The recipe:</b> cotton + a small amount (2–20%) of elastane. Make it.' : ''); }
      say();
    }
    const setFromX = (x) => { const p = Math.round((clamp((x - SL.x0) / (SL.x1 - SL.x0)) * 50) / 2) * 2; if (p !== S.pct) { S.pct = p; S.res = null; Book.sfx('tick', { gain: 0.25 }); say(); } };
    c.addEventListener('pointerdown', (e) => {
      if (S.test >= 0) return;
      const [x, y] = stg.pos(e);
      if (y < 200 && x < 500) { let i = -1; CX.forEach((cx, k) => { if (Math.abs(x - cx) < 59) i = k; }); if (i >= 0 && i !== S.fib) { S.fib = i; S.res = null; Book.sfx('thud', { gain: 0.4 }); say(); stg.render(0); } return; }
      if (Math.abs(y - SL.y) < 50 && x > SL.x0 - 44 && x < SL.x1 + 44) {
        if (S.fib < 0) { Book.toast('Tap a cone first to choose the second fibre.'); return; }
        S.drag = true; try { c.setPointerCapture(e.pointerId); } catch (er) {} setFromX(x); e.preventDefault(); stg.go();
      }
    });
    c.addEventListener('pointermove', (e) => { if (!S.drag) return; setFromX(stg.pos(e)[0]); stg.go(); });
    const up = () => { if (!S.drag) return; S.drag = false; stg.go(); stg.render(0); };
    c.addEventListener('pointerup', up); c.addEventListener('pointercancel', up); c.addEventListener('lostpointercapture', up);
    testBtn.onclick = () => {
      if (S.test >= 0) return;
      if (S.fib < 0) { Book.toast('Tap a cone first to choose the second fibre.'); return; }
      S.pending = judge(); S.res = null; S.test = 0; fb.className = 'fb'; Book.sfx('stroke', { material: 'pen', dur: 0.9, gain: 0.5 }); say(); stg.go();
    };
    stg.init(); say();
    if (S.solved) { fb.className = 'fb on good'; fb.innerHTML = `✓ Stretch jeans: cotton with just ${S.pct}% elastane.`; }
    return lab;
  }

  // ======================================================================================
  // blend vs mixture, drawn
  // ======================================================================================
  function blendAnim(k) {
    const x = k.ctx;
    k.text('BLEND', 24, 46, 0.2, 0.9, { size: 32, font: 'bubble' });
    if (k.t > 1.0) { tuft(x, 60, 110, false, 0); tuft(x, 92, 122, false, 2); tuft(x, 66, 138, false, 4); }
    if (k.t > 1.4) { tuft(x, 62, 196, true, 0.2); tuft(x, 92, 210, true, -0.3); tuft(x, 66, 224, true, 0.5); }
    k.arrow([[112, 126], [158, 152]], 1.8, 2.2); k.arrow([[112, 208], [158, 182]], 2.2, 2.6);
    k.circle(204, 167, 40, 2.6, 3.3, { w: 2.2 });
    if (k.t > 3.3) [[190, 150, 0], [216, 156, 1], [196, 176, 1], [220, 182, 0], [204, 166, 0], [186, 190, 1]].forEach(([a, b, p], i) => tuft(x, a, b, !!p, i));
    k.text('mixed first…', 204, 236, 3.3, 4.0, { size: 22, align: 'center' });
    k.arrow([[250, 167], [286, 167]], 4.0, 4.4);
    const ya = [], yb = []; for (let i = 0; i <= 30; i++) { const px = 296 + i * 4.2; ya.push([px, 167 + Math.sin(i * 0.9) * 6]); yb.push([px, 167 - Math.sin(i * 0.9) * 6]); }
    k.line(ya, 4.4, 5.2, { w: 2.6 }); k.line(yb, 5.2, 6.0, { w: 2.6, color: RD });
    k.text('…then spun', 358, 132, 5.2, 5.8, { size: 22, align: 'center' });
    k.text('into ONE yarn', 358, 216, 5.8, 6.5, { size: 22, align: 'center' });
    k.line([[440, 20], [440, 270]], 6.5, 6.8, { w: 1.6, retrace: false });
    k.text('MIXTURE', 462, 46, 6.8, 7.6, { size: 32, font: 'bubble' });
    for (let i = 0; i < 6; i++) { const P = []; for (let j = 0; j <= 16; j++) P.push([486 + i * 30 + (j % 2 ? 2 : -2), 76 + j * 10]); k.line(P, 7.6 + i * 0.18, 7.8 + i * 0.18, { w: 2.6, retrace: false }); }
    for (let i = 0; i < 5; i++) { const P = []; for (let j = 0; j <= 18; j++) P.push([474 + j * 10, 96 + i * 30 + (j % 2 ? 2 : -2)]); k.line(P, 8.8 + i * 0.18, 9.0 + i * 0.18, { w: 2.6, color: RD, retrace: false }); }
    k.text('cotton yarns', 676, 110, 9.8, 10.4, { size: 22 });
    k.text('polyester yarns', 676, 170, 10.4, 11.0, { size: 22, color: RD });
    k.text('in one fabric', 676, 230, 11.0, 11.6, { size: 22 });
  }

  // ======================================================================================
  Book.page({ id: 'p05', title: 'Blends & mixtures', build(ui, root) {
    ui.h('Blends & mixtures');
    const intro = ui.p('No fibre is perfect. Cotton creases. Polyester can feel sweaty. So what happens if you put <b>two fibres in one fabric</b>? Read a shirt label: you will often find two.');

    let notes = null;
    const CARD = {
      c1: '<h4>Polycotton</h4>polyester + cotton, e.g. 65/35. Comfortable and absorbent like cotton, but <b>stronger</b>, <b>creases less</b>, <b>dries faster</b> and is <b>cheaper</b>. School shirts, bedsheets.',
      c2: '<h4>Cotton + elastane</h4>Stretch jeans: comfortable, and they keep their shape.',
      c3: '<h4>Wool + polyamide</h4>Hard-wearing socks and carpets.',
    };
    const done = { c1: (Book.state.items['p05.c1'] || {}).correct === true, c2: (Book.state.items['p05.c2'] || {}).correct === true };
    const cards = () => {
      if (!notes) return;
      notes.querySelector('.tx5-cards').innerHTML = `<div>${done.c1 ? CARD.c1 : '<p class="tx5-locked">🔒 Fill the school shirt order to earn this card.</p>'}</div><div>${done.c2 ? CARD.c2 : '<p class="tx5-locked">🔒 Fill the stretch jeans order to earn this card.</p>'}</div><div>${CARD.c3}</div>`;
    };
    const mixer = Mixer(ui, () => { done.c1 = true; cards(); });
    const jeans = Jeans(ui, () => { done.c2 = true; cards(); });

    notes = ui.box(`<div class="tx5-nb">
      <p>A <span class="key">blend</span> = two or more different <b>fibres</b> mixed together <b>before spinning</b> into <b>one yarn</b>. (The mixer made blends.)</p>
      <p>A <span class="key">mixture</span> = different <b>yarns</b> used in one fabric: for example cotton yarns down the fabric (the warp) and polyester yarns across it (the weft).</p>
      <p><b>Why?</b> To combine the good properties of each fibre and reduce the bad ones, to improve how the fabric looks and feels, and to reduce cost.</p>
      <div class="tx5-cards"></div></div>`, { tag: 'Notes' });
    cards();
    ui.anim({ w: 860, h: 310, duration: 12, draw: blendAnim,
      sound(k) { [0.2, 1.8, 2.6, 4.0, 4.4, 5.2, 6.8, 7.6, 8.2, 8.8, 9.4, 9.8, 10.4, 11].forEach((t) => k.play('stroke', t, { material: 'pen', dur: 0.5, gain: 0.5 })); } });
    const animWrap = root.lastElementChild;

    ui.p('<b>Check what you know.</b> The notes and the machines will <b>blur</b> while you answer.');
    const hide = [intro, notes, animWrap, mixer, jeans];
    const q1 = ui.mcq({
      id: 'p05.blend', label: 'Blend vs mixture: what is the difference?', q: 'What is the difference between a <b>blend</b> and a <b>mixture</b>?',
      options: [
        { t: 'Blend: fibres mixed before spinning into one yarn. Mixture: different yarns in one fabric.', ok: true, why: 'Yes. A blend is mixed at the fibre stage; a mixture is put together at the yarn stage.' },
        { t: 'Blend: different yarns woven into one fabric. Mixture: fibres mixed before being spun.', mis: 'blend-meaning', why: 'The other way round. Think of the mixer: were you mixing loose fibres or finished yarns?' },
        { t: 'Blend: two fabrics sewn together in layers. Mixture: fibres glued into a single sheet.', mis: 'blend-meaning', why: 'Neither is about layers or glue. Think about what went into the mixer, and at what stage.' },
        { t: 'Blend: only natural fibres are combined. Mixture: only synthetic fibres are combined.', mis: 'blend-meaning', why: 'It is not about which family the fibres are from. It is about when they are combined: before spinning, or as yarns.' },
      ],
    });
    ui.hideWhile(q1, 'p05.blend', hide);
    const q2 = ui.mcq({
      id: 'p05.why', label: 'Why do manufacturers blend fibres?', q: 'Why do manufacturers <b>blend</b> fibres?',
      options: [
        { t: 'To combine the good properties of each fibre, reduce the bad ones and cut cost', ok: true, why: 'Yes: the best of both (and often cheaper). That is why polycotton beats pure cotton for a school shirt.' },
        { t: 'Only to make the fabric cheaper: its properties stay just the same as before', mis: 'blend-meaning', why: 'Cost is one reason, but think what happened to the bars when you added polyester: the properties changed too.' },
        { t: 'To get every good property of one fibre and nothing at all from the other one', mis: 'polycotton-props', why: 'A blend is a compromise. In the mixer, adding polyester cut the creases but also lowered the comfort a little.' },
        { t: 'To make the fabric biodegradable, because blended fibres rot away more quickly', mis: 'synthetic-melt', why: 'Blending does not make synthetic fibres rot. Think about what changed on the bars in the mixer.' },
      ],
    });
    ui.hideWhile(q2, 'p05.why', hide);
  } });
})();
