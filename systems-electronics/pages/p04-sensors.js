// Page 4 — Inputs: sensors. The sensor lab: three pen-drawn benches (LDR under a torch, thermistor in a beaker,
// pressure sensor under weights), each wired to a resistance meter. Predict first, then experiment, write down at
// least three readings and draw a conclusion; the rule and the uses appear only once the experiment is done.
(function () {
  'use strict';
  const B = Ink.BLUE, RD = Ink.RED, GR = Ink.GREEN, rgba = Ink.rgba, geo = Ink.geo;
  const LABF = (s) => `600 ${s}px Fredoka, "Arial Rounded MT Bold", system-ui, sans-serif`;
  const HANDF = (s) => `400 ${s}px "Gloria Hallelujah", "Comic Sans MS", cursive`;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const PAPER = 'rgba(251,250,245,.97)';
  const W = 860, HH = 380, BENCH = 306;
  const SL = { x0: 120, x1: 430, y: 346 };                 // the pen-drawn slider on benches 1 and 2

  if (!document.getElementById('p04-css')) {
    const s = document.createElement('style'); s.id = 'p04-css';
    s.textContent = `
      .p04-lab { position: relative; margin: 0 0 calc(var(--R) * .6); padding: 12px 16px 16px; background: rgba(251,250,245,.9); }
      .p04-lab > * { position: relative; }
      .p04-step { font: 700 14px Fredoka, system-ui; letter-spacing: .08em; text-transform: uppercase; color: var(--red); line-height: 22px; }
      .p04-task { font-size: 19px; line-height: 1.5; margin: 0 0 8px; }
      .p04-task b, .p04-q b { font-family: Fredoka, system-ui; font-weight: 600; }
      .p04-q { font-size: 19px; line-height: 1.5; margin: 6px 0 8px; }
      .p04-btns { display: flex; flex-wrap: wrap; gap: 10px; align-items: stretch; margin: 0 0 8px; }
      .p04-btns .opt { flex: 1 1 150px; text-align: center; min-height: 52px; }
      .p04-btns .btn { margin-top: 0; min-height: 50px; }
      .p04-cv { display: block; width: 100%; height: auto; touch-action: pan-y; user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; cursor: pointer; }
      .p04-log { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; min-height: 50px; margin: 4px 0 4px; font-size: 17px; }
      .p04-log .hd { font: 600 16px Fredoka, system-ui; margin-right: 4px; }
      .p04-read { display: inline-flex; flex-direction: column; align-items: center; background: #fff; border: 2px solid rgba(30,46,150,.4); border-radius: 10px; padding: 3px 12px 4px; line-height: 1.25; }
      .p04-read i { font-style: normal; font-size: 15px; }
      .p04-read b { font: 700 19px Fredoka, system-ui; }
      .p04-conc { display: none; margin-top: 6px; padding-top: 6px; border-top: 2px dashed rgba(30,46,150,.3); }
      .p04-conc.on { display: block; }
      .p04-locked { font-size: 17px; opacity: .75; }
      .p04-notes ul { margin: 4px 0 0; padding-left: 22px; }
      .p04-notes li { margin: 0; }
    `;
    document.head.appendChild(s);
  }

  // ---------- small drawing helpers ----------
  function text(x, s, px, py, o = {}) {
    x.save(); x.font = (o.font === 'hand' ? HANDF : LABF)(o.size || 22);
    x.fillStyle = rgba(o.color || B, o.a ?? 0.92); x.textAlign = o.align || 'left'; x.textBaseline = 'alphabetic';
    x.translate(px, py); if (o.rot) x.rotate(o.rot); x.fillText(s, 0, 0); x.restore();
  }
  function paper(x, pts, style = PAPER) { x.save(); x.globalCompositeOperation = 'source-over'; x.fillStyle = style; x.beginPath(); pts.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.closePath(); x.fill(); x.restore(); }
  const shift = (P, dx, dy) => P.map(([a, b]) => [a + dx, b + dy]);
  function fmtR(R) {
    if (R >= 995000) return (R / 1e6).toFixed(2) + ' MΩ';
    if (R >= 99500) return Math.round(R / 1000) + ' kΩ';
    if (R >= 1000) return (R / 1000).toFixed(1) + ' kΩ';
    return Math.round(R) + ' Ω';
  }
  const fmtOhms = (R) => '= ' + String(Math.round(+R.toPrecision(3))).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' Ω';

  // ======================================================================================
  // the resistance meter (right-hand side of every bench)
  // ======================================================================================
  const MX = 572, MC = [706, 316], MR = 92, A0 = Math.PI + 0.32, A1 = Math.PI * 2 - 0.32;
  function paintMeter(x) {
    const R = geo.rect(MX, 22, 268, 322, 14);
    Ink.hatchShadow(x, R, 1, 8, 8); paper(x, R); Ink.stroke(x, R, { w: 3, seed: 5 });
    text(x, 'resistance meter', MX + 134, 56, { font: 'hand', size: 22, align: 'center' });
    const L = geo.rect(MX + 20, 68, 228, 68, 8);
    paper(x, L, 'rgba(232,238,226,.95)'); Ink.stroke(x, L, { w: 2.4, seed: 9 });
    Ink.stroke(x, geo.ellipse(MC[0], MC[1], MR, MR, A0, A1), { w: 2.6, seed: 14 });
    for (let i = 0; i <= 6; i++) {
      const a = lerp(A0, A1, i / 6), r0 = MR + 3, r1 = MR + (i % 3 === 0 ? 16 : 9);
      Ink.stroke(x, [[MC[0] + Math.cos(a) * r0, MC[1] + Math.sin(a) * r0], [MC[0] + Math.cos(a) * r1, MC[1] + Math.sin(a) * r1]], { w: 2, seed: 20 + i, retrace: false });
    }
    text(x, 'low', MX + 14, 332, { size: 22 }); text(x, 'high', MX + 254, 332, { size: 22, align: 'right' });
    x.fillStyle = rgba(B, 0.95); x.beginPath(); x.arc(MC[0], MC[1], 7, 0, 7); x.fill();
  }
  function drawMeter(ctx, S) {
    if (!S.live) {
      text(ctx, '– – –', MX + 134, 120, { size: 44, align: 'center', a: 0.55 });
      text(ctx, 'predict first!', MX + 134, 176, { font: 'hand', size: 24, align: 'center', color: RD, rot: -0.04 });
    } else {
      const R = Math.pow(10, S.lr);
      text(ctx, fmtR(R), MX + 134, 120, { size: 44, align: 'center' });
      text(ctx, fmtOhms(R), MX + 134, 174, { font: 'hand', size: 22, align: 'center' });
    }
    const f = S.live ? clamp((S.lr - S.cfg.lmin) / (S.cfg.lmax - S.cfg.lmin)) : -0.06, a = lerp(A0, A1, f);
    const tip = [MC[0] + Math.cos(a) * (MR - 8), MC[1] + Math.sin(a) * (MR - 8)];
    ctx.save(); ctx.strokeStyle = rgba(RD, 0.92); ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(MC[0], MC[1]); ctx.lineTo(tip[0], tip[1]); ctx.stroke();
    ctx.lineWidth = 1.4; ctx.strokeStyle = rgba(RD, 0.5); ctx.beginPath(); ctx.moveTo(MC[0] + 1.5, MC[1] - 1); ctx.lineTo(tip[0] + 1, tip[1] + 1.5); ctx.stroke(); ctx.restore();
  }
  function paintSlider(x, l0, l1) {
    Ink.stroke(x, [[SL.x0, SL.y], [SL.x1, SL.y]], { w: 3.2, seed: 41 });
    for (let i = 0; i <= 10; i++) { const px = lerp(SL.x0, SL.x1, i / 10); Ink.stroke(x, [[px, SL.y - (i % 5 ? 6 : 11)], [px, SL.y + (i % 5 ? 6 : 11)]], { w: 1.6, seed: 50 + i, retrace: false }); }
    text(x, l0, SL.x0 - 28, SL.y + 8, { size: 22, align: 'right' }); text(x, l1, SL.x1 + 28, SL.y + 8, { size: 22 });
  }
  function drawKnob(ctx, v, hot) {
    const kx = lerp(SL.x0, SL.x1, clamp(v)), K = geo.ellipse(kx, SL.y, 19, 19);
    paper(ctx, K); Ink.hatchFill(ctx, K, 1, hot ? RD : B, 1.3); Ink.stroke(ctx, K, { w: 3, color: hot ? RD : B, seed: 77 });
  }
  const wires = (x, a, b) => { Ink.stroke(x, a, { w: 2.6, seed: 61 }); Ink.stroke(x, b, { w: 2.6, seed: 67, color: RD }); };

  // ======================================================================================
  // the three scenes
  // ======================================================================================
  // ---- 1. LDR under a torch ----
  const LDR = [440, 150];
  const HANDP = (() => { const P = []; [[-58, -70, 116, 96, 26]].forEach((r) => P.push(geo.rect(...r))); [-56, -27, 2, 31].forEach((fx, i) => P.push(geo.rect(fx, 8, 25, 62 + [0, 12, 8, -6][i], 12))); P.push(geo.rect(-84, -58, 32, 62, 14)); P.push(geo.rect(-36, -330, 72, 270, 6)); return P; })();
  const sceneLDR = {
    lmin: 3, lmax: 6, v0: 0.5, slider: true,
    R: (S) => (S.cov > 0.5 ? 1e6 : 4e5 * Math.pow(1e3 / 4e5, clamp(S.v))),
    key: (S) => (S.cover ? -0.3 : S.v),
    label: (S) => (S.cover ? 'covered by hand' : S.v < 0.03 ? 'torch off' : S.v > 0.97 ? 'full beam' : 'torch ' + Math.round(S.v * 100) + '%'),
    paint(x) {
      Ink.stroke(x, [[20, BENCH], [552, BENCH]], { w: 2.6, seed: 3 });
      // torch
      const body = geo.rect(34, 128, 118, 44, 10), headP = [[152, 124], [192, 106], [192, 194], [152, 176], [152, 124]];
      Ink.hatchShadow(x, body, 1, 6, 6); paper(x, body); Ink.hatchFill(x, body, 0.8, B, 1.1); Ink.stroke(x, body, { w: 2.8, seed: 12 });
      paper(x, headP); Ink.stroke(x, headP, { w: 2.8, seed: 15 }); Ink.stroke(x, geo.curve([192, 108], [204, 130], [204, 170], [192, 192]), { w: 2.2, seed: 17 });
      Ink.stroke(x, geo.rect(76, 118, 30, 10, 4), { w: 2, seed: 19, retrace: false });
      [58, 70].forEach((px, i) => Ink.stroke(x, [[px, 132], [px, 168]], { w: 1.4, seed: 22 + i, retrace: false }));
      text(x, 'torch', 92, 212, { font: 'hand', size: 22, align: 'center' });
      // LDR: disc with the wiggly track, two legs into a terminal block
      const D = geo.ellipse(LDR[0], LDR[1], 44, 44);
      Ink.hatchShadow(x, D, 1, 6, 6); paper(x, D); Ink.stroke(x, D, { w: 3, seed: 25 });
      const Z = []; for (let i = 0; i < 7; i++) { const yy = LDR[1] - 27 + i * 9, hw = Math.sqrt(Math.max(0, 36 * 36 - (yy - LDR[1]) ** 2)) - 3; Z.push(i % 2 ? [LDR[0] + hw, yy] : [LDR[0] - hw, yy], i % 2 ? [LDR[0] - hw, yy] : [LDR[0] + hw, yy]); }
      Ink.stroke(x, Z, { w: 2.2, seed: 27, amp: 0.5 });
      Ink.stroke(x, [[428, 193], [428, 262]], { w: 2.4, seed: 31 }); Ink.stroke(x, [[452, 193], [452, 262]], { w: 2.4, seed: 33 });
      const blk = geo.rect(400, 262, 80, 44, 5); paper(x, blk); Ink.hatchFill(x, blk, 0.7, B, 0.8); Ink.stroke(x, blk, { w: 2.6, seed: 35 });
      text(x, 'LDR', 496, 132, { size: 24 });
      wires(x, [[480, 274], ...geo.curve([500, 274], [540, 274], [530, 250], [MX, 250], 16)], [[480, 292], ...geo.curve([500, 292], [545, 292], [540, 270], [MX, 270], 16)]);
      paintSlider(x, 'off', 'bright');
    },
    draw(ctx, S) {
      // light rays from the torch: more, longer and bolder as the brightness goes up
      const L = clamp(S.v), n = L < 0.03 ? 0 : 3 + Math.round(L * 6);
      for (let i = 0; i < n; i++) {
        const a = n === 1 ? 0 : lerp(-0.3, 0.3, i / (n - 1)), len = (60 + 150 * L) * (S.cov > 0.02 ? lerp(1, 0.62, S.cov) : 1);
        const p0 = [208 + Math.cos(a) * 4, 150 + Math.sin(a) * 40], p1 = [p0[0] + Math.cos(a) * len, p0[1] + Math.sin(a) * len];
        Ink.stroke(ctx, [p0, p1], { w: 1.6 + L * 1.6, seed: 90 + i, retrace: false, amp: 0.5 });
      }
      if (S.live) drawKnob(ctx, S.v, S.drag);
      // the hand that slides down over the LDR
      if (S.cov > 0.005) {
        const hy = lerp(-150, 138, S.cov * S.cov * (3 - 2 * S.cov));
        HANDP.slice().reverse().forEach((P, i) => { const Q = shift(P, LDR[0], hy); paper(ctx, Q); Ink.stroke(ctx, Q, { w: 2.6, seed: 100 + i * 4 }); });
        Ink.hatchFill(ctx, shift(HANDP[6], LDR[0], hy), 0.7, B, 0.7);
      }
    },
    anim: (S, dt) => { const t = S.cover ? 1 : 0; if (Math.abs(S.cov - t) < 0.002) { S.cov = t; return false; } S.cov = clamp(S.cov + Math.sign(t - S.cov) * dt / 0.35); return true; },
    buttons: (S, row, go, el) => {
      const b = el('button', 'btn ghost', 'Cover it with your hand', row); b.type = 'button';
      b.onclick = () => { S.cover = !S.cover; b.textContent = S.cover ? 'Take your hand away' : 'Cover it with your hand'; Book.sfx('paper', { gain: 0.35, dur: 0.25 }); go(); };
    },
  };

  // ---- 2. thermistor in a beaker ----
  const sceneTherm = {
    lmin: 3, lmax: 4.5, v0: 0.2, slider: true,
    R: (S) => 3e4 * Math.pow(30, -clamp(S.v)),
    key: (S) => S.v,
    label: (S) => Math.round(S.v * 100) + ' °C',
    paint(x) {
      Ink.stroke(x, [[20, BENCH], [552, BENCH]], { w: 2.6, seed: 3 });
      // beaker
      const G = [[178, 64], [192, 74], [192, 280], [204, 294], [396, 294], [408, 280], [408, 74], [420, 64]];
      Ink.hatchShadow(x, [[192, 290], [408, 290], [408, 296], [192, 296]], 1, 8, 7);
      Ink.stroke(x, G, { w: 3, seed: 8 });
      [130, 170, 210, 250].forEach((yy, i) => Ink.stroke(x, [[386, yy], [406, yy]], { w: 1.6, seed: 12 + i, retrace: false }));
      const water = [[194, 116], [406, 116], [406, 280], [396, 292], [204, 292], [194, 280]];
      Ink.hatchFill(x, water, 0.55, B, 0.55);
      const wv = []; for (let px = 194; px <= 406; px += 6) wv.push([px, 114 + Math.sin(px * 0.11) * 2.2]); Ink.stroke(x, wv, { w: 2, seed: 16, amp: 0.4 });
      // thermometer
      const T = geo.rect(232, 34, 16, 226, 8); paper(x, T); Ink.stroke(x, T, { w: 2.2, seed: 18 });
      for (let i = 0; i <= 10; i++) Ink.stroke(x, [[250, 244 - i * 19.4], [i % 5 ? 256 : 261, 244 - i * 19.4]], { w: 1.3, seed: 20 + i, retrace: false });
      // thermistor bead on two long leads
      const bead = geo.ellipse(340, 226, 15, 19); paper(x, bead); Ink.hatchFill(x, bead, 1, B, 1.8); Ink.stroke(x, bead, { w: 2.8, seed: 31 });
      wires(x, [[334, 208], [334, 50], ...geo.curve([334, 50], [334, 14], [552, 10], [552, 120], 26), [552, 236], [MX, 250]],
        [[347, 208], [347, 56], ...geo.curve([347, 56], [350, 30], [538, 26], [538, 124], 26), [538, 262], [MX, 270]]);
      text(x, 'thermistor', 422, 210, { size: 22 }); Ink.stroke(x, [[420, 214], [362, 224]], { w: 1.6, seed: 37, retrace: false }); Ink.stroke(x, geo.head([[420, 214], [362, 224]], 10), { w: 1.6, seed: 38, retrace: false });
      text(x, 'water', 96, 96, { font: 'hand', size: 22, align: 'center' });
      paintSlider(x, '0 °C', '100 °C');
    },
    draw(ctx, S, time) {
      const T = clamp(S.v) * 100;
      // red thermometer column + bulb
      const top = 244 - T * 1.94;
      ctx.save(); ctx.fillStyle = rgba(RD, 0.85); ctx.beginPath(); ctx.roundRect(236.5, top, 7, 262 - top, 3); ctx.fill(); ctx.beginPath(); ctx.arc(240, 266, 11, 0, 7); ctx.fill(); ctx.restore();
      Ink.stroke(ctx, geo.ellipse(240, 266, 12, 12), { w: 2, seed: 44, retrace: false });
      text(ctx, Math.round(T) + ' °C', 96, 140, { size: 38, align: 'center', color: T > 60 ? RD : B });
      // ice cubes when cold
      if (T < 14) { const a = clamp((14 - T) / 10); ctx.save(); ctx.globalAlpha = a; [[280, 100, -0.2], [318, 104, 0.25], [366, 99, 0.1]].forEach(([cx, cy, r], i) => { ctx.save(); ctx.translate(cx, cy + Math.sin(time * 1.6 + i) * 1.5); ctx.rotate(r); const Q = geo.rect(-13, -13, 26, 26, 4); paper(ctx, Q); Ink.stroke(ctx, Q, { w: 2.2, seed: 50 + i }); Ink.stroke(ctx, [[-6, 4], [4, -6]], { w: 1.2, seed: 54 + i, retrace: false }); ctx.restore(); }); ctx.restore(); }
      // bubbles and steam when hot
      if (T > 55) {
        const k = clamp((T - 55) / 45), n = Math.round(3 + k * 9);
        ctx.save(); ctx.strokeStyle = rgba(B, 0.75); ctx.lineWidth = 1.8;
        for (let i = 0; i < n; i++) { const ph = (time * (0.35 + (i % 4) * 0.09) + i * 0.37) % 1, bx = 268 + ((i * 53) % 120) + Math.sin(time * 3 + i) * 3, by = 284 - ph * 160; ctx.beginPath(); ctx.arc(bx, by, 3 + (i % 3) * 1.6, 0, 7); ctx.stroke(); }
        if (T > 78) for (let i = 0; i < 3; i++) { const ph = (time * 0.4 + i / 3) % 1, sx = 270 + i * 44, sy = 96 - ph * 70; ctx.globalAlpha = (1 - ph) * clamp((T - 78) / 14); ctx.beginPath(); for (let j = 0; j <= 12; j++) { const yy = sy - j * 3; ctx.lineTo(sx + Math.sin(j * 0.7 + time * 2 + i) * 6, yy); } ctx.stroke(); }
        ctx.restore();
      }
      if (S.live) drawKnob(ctx, S.v, S.drag || T > 60);
    },
    anim: (S, dt) => {
      let more = S.v * 100 > 55 || S.v * 100 < 14;
      if (S.vt != null) { const d = S.vt - S.v; if (Math.abs(d) < 0.004) { S.v = S.vt; S.vt = null; } else { S.v += Math.sign(d) * Math.min(Math.abs(d), dt * 0.45); more = true; } }
      return more;
    },
    buttons: (S, row, go, el) => {
      [['Add ice', 0, 'pop'], ['Pour in kettle water', 1, 'paper']].forEach(([t, v, sn]) => { const b = el('button', 'btn ghost', t, row); b.type = 'button'; b.onclick = () => { S.vt = v; Book.sfx(sn, { gain: 0.4 }); go(); }; });
    },
  };

  // ---- 3. pressure sensor under weights ----
  const PADY = 288, WT = 36, PX = 310;
  const RPTS = [[0, 6], [0.2, 4.477], [0.4, 4.079], [0.6, 3.778], [0.8, 3.544], [1, 3.301]];      // log10 Ω against force
  const scenePress = {
    lmin: 3.3, lmax: 6, v0: 0, slider: false, pressable: true,
    force: (S) => clamp(S.n / 5 + 0.45 * S.pr),
    R: (S) => { const f = scenePress.force(S); let i = 0; while (i < RPTS.length - 2 && f > RPTS[i + 1][0]) i++; const [a, la] = RPTS[i], [b, lb] = RPTS[i + 1]; return Math.pow(10, lerp(la, lb, clamp((f - a) / (b - a)))); },
    key: (S) => scenePress.force(S),
    label: (S) => { const fing = S.pr > 0.3; return S.n ? S.n * 100 + ' g' + (fing ? ' + finger' : '') : fing ? 'finger press' : 'nothing on it'; },
    paint(x) {
      Ink.stroke(x, [[20, BENCH], [552, BENCH]], { w: 2.6, seed: 3 });
      const base = geo.rect(196, PADY + 6, 228, 12, 3); paper(x, base); Ink.hatchFill(x, base, 1, B, 1.6); Ink.stroke(x, base, { w: 2.4, seed: 9 });
      Ink.stroke(x, [[424, PADY + 12], [468, PADY + 12]], { w: 5, seed: 13 });
      const blk = geo.rect(468, 268, 56, 38, 5); paper(x, blk); Ink.hatchFill(x, blk, 0.7, B, 0.8); Ink.stroke(x, blk, { w: 2.6, seed: 15 });
      wires(x, [[524, 278], ...geo.curve([536, 278], [556, 278], [548, 250], [MX, 250], 14)], [[524, 294], ...geo.curve([540, 294], [560, 294], [556, 270], [MX, 270], 14)]);
      text(x, 'pressure sensor', 40, 344, { size: 22 }); Ink.stroke(x, [[150, 322], [204, 304]], { w: 1.6, seed: 21, retrace: false }); Ink.stroke(x, geo.head([[150, 322], [204, 304]], 10), { w: 1.6, seed: 22, retrace: false });
      text(x, 'press here, or stack weights', 548, 354, { font: 'hand', size: 22, align: 'right' });
    },
    draw(ctx, S) {
      const f = scenePress.force(S), sq = 1 + f * 3;
      const pad = geo.rect(206, PADY - 6 + sq, 208, 12 - sq * 0.6, 4); paper(ctx, pad); Ink.stroke(ctx, pad, { w: 2.6, seed: 30, color: S.live ? RD : B });
      for (let i = 0; i < S.n; i++) {
        const y = PADY - 6 + sq - (i + 1) * WT, M = geo.rect(PX - 64 + (i % 2) * 5, y, 128, WT - 3, 6);
        Ink.hatchShadow(ctx, M, 1, 5, 4); paper(ctx, M); Ink.hatchFill(ctx, M, 0.8, B, 1.2); Ink.stroke(ctx, M, { w: 2.6, seed: 40 + i * 3 });
        const lb = geo.rect(PX - 36 + (i % 2) * 5, y + 4, 72, WT - 11, 5); paper(ctx, lb); text(ctx, '100 g', PX + (i % 2) * 5, y + WT - 12, { size: 22, align: 'center' });
      }
      const top = PADY - 6 + sq - S.n * WT;
      if (S.pr > 0.01) {                                              // the pressing finger
        const ty = top - 6 + S.pr * 5, F = geo.rect(PX - 21, ty - 190, 42, 190, 20), N = geo.rect(PX - 12, ty - 40, 24, 30, 9);
        paper(ctx, F); Ink.stroke(ctx, F, { w: 2.8, seed: 60 }); Ink.stroke(ctx, N, { w: 1.6, seed: 63, retrace: false });
        Ink.stroke(ctx, [[PX - 14, ty - 78], [PX + 14, ty - 78]], { w: 1.3, seed: 65, retrace: false });
      }
      if (f > 0.02) {                                                 // force arrow: bigger = more force
        const len = 40 + f * 150, ax = 120, P = [[ax, 280 - len], [ax, 280]];
        Ink.stroke(ctx, P, { w: 2.5 + f * 3, color: RD, seed: 70 }); Ink.stroke(ctx, geo.head(P, 14 + f * 10), { w: 2.5 + f * 3, color: RD, seed: 72 });
        text(ctx, 'force', ax, 268 - len, { size: 22, align: 'center', color: RD });
      }
    },
    anim: (S, dt) => { const t = S.press ? 1 : 0; if (Math.abs(S.pr - t) < 0.003) { S.pr = t; return S.press; } S.pr = clamp(S.pr + Math.sign(t - S.pr) * dt / (S.press ? 0.9 : 0.25)); return true; },
    buttons: (S, row, go, el) => {
      const add = el('button', 'btn ghost', '+ Add a 100 g weight', row), sub = el('button', 'btn ghost', '− Take one off', row); add.type = sub.type = 'button';
      const upd = () => { add.disabled = S.n >= 5; sub.disabled = S.n <= 0; };
      add.onclick = () => { if (S.n < 5) { S.n++; Book.sfx('thud', { gain: 0.45 }); upd(); go(); } };
      sub.onclick = () => { if (S.n > 0) { S.n--; Book.sfx('tick', { gain: 0.5 }); upd(); go(); } };
      upd();
    },
  };

  // ======================================================================================
  // one bench: predict -> experiment (meter goes live) -> 3+ readings -> conclusion -> notes unlock
  // ======================================================================================
  function Bench(ui, cfg) {
    const el = ui.el, sc = cfg.scene, id = 'p04.' + cfg.key;
    const rPred = ui.record(id + '-predict', { label: cfg.predLabel, type: 'predict', max: 0 });
    const rConc = ui.record(id, { label: cfg.concLabel, type: 'experiment', max: 1 });
    const lab = el('div', 'p04-lab'); requestAnimationFrame(() => Ink.frame(lab, { shadow: false, w: 2.2 }));
    el('div', 'p04-step', cfg.step, lab);
    el('p', 'p04-task', cfg.task, lab);
    el('div', 'p04-q', `<b>Predict first.</b> ${cfg.predQ}`, lab);
    const predRow = el('div', 'p04-btns', '', lab);
    const c = document.createElement('canvas'); c.className = 'p04-cv'; lab.appendChild(c);
    const dpr = Math.min(2, window.devicePixelRatio || 1); c.width = W * dpr; c.height = HH * dpr; c.style.aspectRatio = W + ' / ' + HH;
    const ctx = c.getContext('2d');
    const ctl = el('div', 'p04-btns', '', lab);
    const log = el('div', 'p04-log', '', lab);
    const conc = el('div', 'p04-conc', `<div class="p04-q"><b>What did you find?</b> ${cfg.concQ}</div>`, lab), concRow = el('div', 'p04-btns', '', conc), fb = el('div', 'fb', '', conc);
    const notes = ui.box(`<div class="p04-notes"><p class="p04-locked">🔒 The notes for this sensor appear here when you have finished the experiment above.</p></div>`, { tag: 'Notes' });

    const S = { cfg: sc, live: false, done: false, v: sc.v0, vt: null, lr: 0, cover: false, cov: 0, n: 0, press: false, pr: 0, drag: false, readings: [] };
    S.lr = Math.log10(sc.R(S));
    const prev = rPred.get(), prevC = rConc.get();
    let pred = prev ? prev.answer : null;

    // ---- canvas ----
    let staticL = null, raf = 0, last = 0, time = 0;
    const paintStatic = () => { staticL = document.createElement('canvas'); staticL.width = W * dpr; staticL.height = HH * dpr; const x = staticL.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.lineCap = x.lineJoin = 'round'; sc.paint(x); paintMeter(x); };
    function draw() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, HH); ctx.globalCompositeOperation = 'multiply'; ctx.lineCap = ctx.lineJoin = 'round';
      ctx.drawImage(staticL, 0, 0, W, HH);
      sc.draw(ctx, S, time); drawMeter(ctx, S);
    }
    const hidden = () => { const p = c.closest('.page'); return !p || p.classList.contains('hidden'); };
    function frame(now) {
      raf = 0; if (hidden()) return;
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016); last = now; time += dt;
      let more = sc.anim ? sc.anim(S, dt) : false;
      const tl = Math.log10(sc.R(S)), d = tl - S.lr;
      if (Math.abs(d) > 0.0015) { S.lr += d * (1 - Math.exp(-dt * 10)); more = true; } else S.lr = tl;
      draw();
      if (more || S.drag) raf = requestAnimationFrame(frame);
    }
    function go() { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } }
    paintStatic(); draw();
    if (document.fonts) document.fonts.ready.then(() => { paintStatic(); draw(); });

    const pos = (e) => { const r = c.getBoundingClientRect(); return [((e.clientX - r.left) * W) / r.width, ((e.clientY - r.top) * HH) / r.height]; };
    const setFromX = (x) => { S.v = clamp((x - SL.x0) / (SL.x1 - SL.x0)); S.vt = null; };
    let lastTick = -1;
    c.addEventListener('pointerdown', (e) => {
      if (!S.live) { Book.toast('Predict first: then the meter switches on.'); return; }
      const [x, y] = pos(e);
      if (sc.slider && Math.abs(y - SL.y) < 48 && x > SL.x0 - 40 && x < SL.x1 + 40) { S.drag = true; try { c.setPointerCapture(e.pointerId); } catch (er) {} setFromX(x); e.preventDefault(); }
      else if (sc.pressable && x < MX) { S.press = true; try { c.setPointerCapture(e.pointerId); } catch (er) {} Book.sfx('pop', { gain: 0.3 }); }
      go();
    });
    c.addEventListener('pointermove', (e) => { if (!S.drag) return; setFromX(pos(e)[0]); const tk = Math.round(S.v * 10); if (tk !== lastTick) { lastTick = tk; Book.sfx('tick', { gain: 0.25 }); } go(); });
    const up = () => { S.drag = false; S.press = false; go(); };
    c.addEventListener('pointerup', up); c.addEventListener('pointercancel', up); c.addEventListener('lostpointercapture', up);

    // ---- prediction ----
    const OPTS = ['go UP', 'go DOWN', 'stay the same'];
    const predBtns = OPTS.map((t) => { const b = el('button', 'opt', t, predRow); b.type = 'button'; if (pred === t) b.classList.add('sel');
      b.onclick = () => { if (S.readings.length || S.done) return; predBtns.forEach((q) => q.classList.remove('sel')); b.classList.add('sel'); pred = t; rPred.set({ answer: t, correct: null }); Book.scribble(0.12); golive(true); }; return b; });
    function golive(sound) {
      if (!S.live) { S.live = true; ctl.style.display = ''; log.style.display = ''; if (sound) Book.sfx('pop', { gain: 0.5 }); }
      go(); draw();
    }

    // ---- controls + readings ----
    sc.buttons(S, ctl, go, el);
    const logBtn = el('button', 'btn', '✎ Write down this reading', ctl); logBtn.type = 'button';
    const showLog = () => {
      const rs = S.readings.slice().sort((a, b) => a.k - b.k);
      log.innerHTML = rs.length ? `<span class="hd">${cfg.logHead}</span>` + rs.map((r) => `<span class="p04-read"><i>${Book.esc(r.label)}</i><b>${Book.esc(r.R)}</b></span>`).join('') : `<span class="small">Change the ${cfg.thing}, then write down a reading. You need at least <b>3 different</b> readings.</span>`;
    };
    const ready = () => { const ks = S.readings.map((r) => r.k); return S.readings.length >= 3 && Math.max(...ks) - Math.min(...ks) >= 0.35; };
    logBtn.onclick = () => {
      const k = sc.key(S), R = fmtR(sc.R(S));
      if (S.readings.some((r) => Math.abs(r.k - k) < 0.07)) { Book.toast(`Change the ${cfg.thing} first, then take another reading.`); Book.sfx('error', { gain: 0.25 }); return; }
      if (S.readings.length >= 6) S.readings.shift();
      S.readings.push({ k, label: sc.label(S), R }); Book.scribble(0.2); showLog();
      if (ready()) { if (!conc.classList.contains('on')) { conc.classList.add('on'); Book.sfx('paper', { gain: 0.4 }); } }
      else if (S.readings.length >= 3) Book.toast(`Good. Now try a very different ${cfg.thing} too.`);
    };
    showLog();

    // ---- conclusion ----
    const COPTS = [['goes up', 'up'], ['goes down', 'down'], ['stays the same', 'same']];
    const predKey = () => (pred === 'go UP' ? 'up' : pred === 'go DOWN' ? 'down' : 'same');
    function finish(quiet) {
      S.done = true; predBtns.forEach((b) => (b.disabled = true));
      notes.querySelector('.p04-notes').innerHTML = cfg.notes;
      if (!quiet) { Book.sfx('success', { gain: 0.35 }); }
    }
    const concBtns = COPTS.map(([t, k]) => { const b = el('button', 'opt', t, concRow); b.type = 'button';
      b.onclick = () => {
        const ok = k === 'down'; b.classList.add(ok ? 'right' : 'wrong');
        const rs = S.readings.slice().sort((a, q) => a.k - q.k).map((r) => r.label + ' = ' + r.R).join(', ');
        rConc.set({ answer: `predicted "${pred}"; readings: ${rs}; concluded "${t}" ${ok ? '✓' : '✗'}`, correct: ok, score: ok ? 1 : 0, max: 1, mis: ok ? '' : k === 'up' ? cfg.mis || '' : '' });
        if (ok) {
          concBtns.forEach((q) => (q.disabled = true));
          fb.className = 'fb on good'; fb.innerHTML = `✓ ${cfg.right} ${predKey() === 'down' ? 'Your prediction was spot on.' : `You predicted it would “${Book.esc(pred)}”: the experiment has put that right.`} The notes are unlocked below.`;
          finish();
        } else { Book.sfx('error', { gain: 0.3 }); fb.className = 'fb on bad'; fb.innerHTML = `✗ Look again at your readings, from left to right. ${cfg.hint}`; }
      }; return b; });

    // ---- restore a finished / started bench ----
    if (!pred) { ctl.style.display = 'none'; log.style.display = 'none'; } else S.live = true;
    if (prevC && prevC.correct) { conc.classList.add('on'); concBtns[1].classList.add('right'); concBtns.forEach((q) => (q.disabled = true)); fb.className = 'fb on good'; fb.innerHTML = '✓ ' + cfg.right; log.innerHTML = '<span class="small">Experiment finished. You can still play with it.</span>'; finish(true); }
    draw();
    return { lab, notes };
  }

  // ======================================================================================
  Book.page({ id: 'p04', title: 'Inputs: sensors', build(ui, root) {
    ui.h('Inputs: sensors');
    ui.p('A switch is only ever on or off. A <b>sensor</b> is an input that gives a <b>changing</b> signal: it tells the system <i>how</i> bright, <i>how</i> hot or <i>how</i> hard something is pressed.');
    const intro = ui.box(`<p>Sensors work by changing their <span class="key">resistance</span>, measured in <b>ohms (Ω)</b>. <b>High</b> resistance = hard for current to flow. <b>Low</b> resistance = easy.</p>
      <p class="small">1 kΩ = 1 000 Ω &nbsp;·&nbsp; 1 MΩ = 1 000 000 Ω. A switch has two states (a <b>digital</b> signal); a sensor gives a range of values (an <b>analogue</b> signal).</p>`, { tag: 'Notes' });
    ui.p('<b>The sensor lab.</b> Three benches, each with a sensor wired to a resistance meter. On each one: <b>predict</b>, experiment, write down at least 3 readings, then say what you found. <span class="small">(The values are typical ones for these sensors.)</span>');

    const b1 = Bench(ui, {
      key: 'ldr', scene: sceneLDR, step: 'Bench 1 · light sensor', thing: 'light', logHead: 'darker → brighter:',
      task: 'An <b>LDR</b> sits in front of a torch. You can drag the torch brightness and cover the LDR with your hand.',
      predQ: 'As the light on the LDR gets <b>brighter</b>, its resistance will…', predLabel: 'LDR: prediction (brighter light → resistance?)',
      concQ: 'As the light gets <b>brighter</b>, the resistance of the LDR…', concLabel: 'LDR experiment: conclusion from 3+ readings', mis: 'ldr-backwards',
      hint: 'Is the number getting bigger or smaller as the light gets brighter? (Careful: MΩ is bigger than kΩ.)',
      right: 'Brighter light, lower resistance.',
      notes: `<p><span class="key">LDR</span> = <b>light-dependent resistor</b>, a light sensor. <b>Brighter light → LOWER resistance. Dark → HIGH resistance.</b></p>
        <p>Used in: automatic street lights, night lights, phone screen auto-brightness, camera exposure.</p>`,
    });
    const b2 = Bench(ui, {
      key: 'therm', scene: sceneTherm, step: 'Bench 2 · temperature sensor', thing: 'temperature', logHead: 'colder → hotter:',
      task: 'A <b>thermistor</b> is dipped in a beaker of water. Drag the temperature, add ice or pour in water from the kettle.',
      predQ: 'As the water gets <b>hotter</b>, the resistance of the thermistor will…', predLabel: 'Thermistor: prediction (hotter → resistance?)',
      concQ: 'As the water gets <b>hotter</b>, the resistance of the thermistor…', concLabel: 'Thermistor experiment: conclusion from 3+ readings', mis: 'thermistor-backwards',
      hint: 'Compare the coldest reading with the hottest one.',
      right: 'Hotter, lower resistance.',
      notes: `<p><span class="key">Thermistor</span> = a temperature sensor. For the usual type: <b>hotter → LOWER resistance. Colder → HIGHER resistance.</b></p>
        <p>Used in: digital thermometers, central-heating thermostats, fridges, ovens, fire alarms, car engine temperature.</p>`,
    });
    const b3 = Bench(ui, {
      key: 'press', scene: scenePress, step: 'Bench 3 · pressure sensor', thing: 'load', logHead: 'less force → more force:',
      task: 'A <b>pressure sensor</b> (a force-sensitive pad) lies on the bench. Press it with a finger (press and hold the drawing) or stack weights on it.',
      predQ: 'As the pad is pressed <b>harder</b>, its resistance will…', predLabel: 'Pressure sensor: prediction (more pressure → resistance?)',
      concQ: 'As the <b>pressure</b> on the pad increases, its resistance…', concLabel: 'Pressure sensor experiment: conclusion from 3+ readings', mis: '',
      hint: 'Compare “nothing on it” with the heaviest load you tried.',
      right: 'More pressure, lower resistance.',
      notes: `<p><span class="key">Pressure sensor</span> (force sensor / pressure pad): detects a force pressing on it. <b>More pressure → LOWER resistance.</b></p>
        <p>Used in: digital bathroom and kitchen scales, pressure mats in burglar alarms, car seats (seat-belt warning), touch-sensitive controls.</p>`,
    });
    ui.p('<span class="small">Other sensors you may meet: moisture (plant waterer), sound (clap light), PIR motion (security light).</span>');

    ui.h('Which sensor?', { size: 40 });
    ui.p('Choose the sensor each product needs. <span class="small">The notes and benches blur while you sort: recall them!</span>');
    const hide = [intro, b1.notes, b2.notes, b3.notes, b1.lab, b2.lab, b3.lab];
    const sort = ui.sort({ id: 'p04.uses', label: 'Sort 8 products by the sensor they use',
      q: 'Tap a product, then tap the sensor it needs.', buckets: ['LDR', 'Thermistor', 'Pressure sensor'],
      items: [
        { t: 'Street light that comes on at dusk', b: 0, mis: 'sensor-mixup' }, { t: 'Phone screen that dims in a dark room', b: 0, mis: 'sensor-mixup' }, { t: 'Camera working out the exposure', b: 0, mis: 'sensor-mixup' },
        { t: 'Digital thermometer', b: 1, mis: 'sensor-mixup' }, { t: 'Central-heating thermostat', b: 1, mis: 'sensor-mixup' }, { t: 'Oven that holds 180 °C', b: 1, mis: 'sensor-mixup' },
        { t: 'Digital bathroom scales', b: 2, mis: 'sensor-mixup' }, { t: 'Car that knows someone is in the seat', b: 2, mis: 'sensor-mixup' },
      ],
      explain: 'All sorted: light → LDR, temperature → thermistor, force → pressure sensor.' });
    ui.hideWhile(sort, 'p04.uses', hide);

    const fill = ui.fill({ id: 'p04.blanks', label: 'Sensor rules: fill the blanks (6)',
      q: '<b>Fill in the blanks.</b> One word in each gap.',
      html: `An LDR senses {{light|brightness|the light|light level|light levels}}. In bright light its resistance is {{low|lower|small|smaller|less}}; in the dark it is {{high|higher|big|bigger|large|larger|more}}.<br>
        A thermistor senses {{temperature|heat|temp|temperatures|the temperature}}. When it gets hotter, its resistance goes {{down|lower|low|downwards}}.<br>
        Resistance is measured in {{ohms|ohm|Ω}}.`,
      explain: 'Bright or hot or pressed hard: the resistance drops.' });
    ui.hideWhile(fill, 'p04.blanks', hide);
  } });
})();
