// Page 5 — Process: the microcontroller. A pen animation of a program being downloaded into a chip, then three
// mini-demos (a security light, a turnstile, a fan) that each show ONE job of a microcontroller without naming it;
// the student names the job after playing. Then notes, a sort, and questions on advantages / disadvantages.
(function () {
  'use strict';
  const B = Ink.BLUE, RD = Ink.RED, GR = Ink.GREEN, rgba = Ink.rgba, geo = Ink.geo;
  const LABF = (s) => `600 ${s}px Fredoka, "Arial Rounded MT Bold", system-ui, sans-serif`;
  const HANDF = (s) => `400 ${s}px "Gloria Hallelujah", "Comic Sans MS", cursive`;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const PAPER = 'rgba(251,250,245,.97)';
  const W = 860;

  if (!document.getElementById('p05-css')) {
    const s = document.createElement('style'); s.id = 'p05-css';
    s.textContent = `
      .p05-demo { position: relative; margin: 0 0 10px; padding: 10px 16px 12px; background: rgba(251,250,245,.9); }
      .p05-demo > * { position: relative; }
      .p05-step { font: 700 14px Fredoka, system-ui; letter-spacing: .08em; text-transform: uppercase; color: var(--red); line-height: 22px; }
      .p05-cap { font-size: 19px; line-height: 1.5; margin: 0 0 4px; min-height: 28px; }
      .p05-cap b { font-family: Fredoka, system-ui; font-weight: 600; }
      .p05-cv { display: block; width: 100%; height: auto; touch-action: pan-y; user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; cursor: pointer; }
      .act.p05-wait .opts { opacity: .35; pointer-events: none; }
      .p05-waitmsg { font-size: 17px; color: var(--red); margin: 0 0 6px; }
      .act:not(.p05-wait) .p05-waitmsg { display: none; }
      .p05-notes ul { margin: 2px 0 8px; padding-left: 24px; }
      .p05-notes li { margin: 0; }
      .p05-notes i { font-size: 17px; }
    `;
    document.head.appendChild(s);
  }

  // ---------- drawing helpers ----------
  function text(x, s, px, py, o = {}) {
    x.save(); x.font = (o.font === 'hand' ? HANDF : LABF)(o.size || 22);
    x.fillStyle = rgba(o.color || B, o.a ?? 0.92); x.textAlign = o.align || 'left'; x.textBaseline = 'alphabetic';
    x.translate(px, py); if (o.rot) x.rotate(o.rot); x.fillText(s, 0, 0); x.restore();
  }
  function paper(x, pts, style = PAPER) { x.save(); x.globalCompositeOperation = 'source-over'; x.fillStyle = style; x.beginPath(); pts.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.closePath(); x.fill(); x.restore(); }
  function tint(x, pts, style) { x.save(); x.fillStyle = style; x.beginPath(); pts.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.closePath(); x.fill(); x.restore(); }
  function arrow(x, pts, o = {}) { Ink.stroke(x, pts, Object.assign({ w: 2.6 }, o)); Ink.stroke(x, geo.head(pts, o.head || 15), Object.assign({ w: 2.6 }, o, { seed: (o.seed || 3) + 1 })); }
  // a little DIP chip, centred on (cx, cy)
  function chip(x, cx, cy, s = 1) {
    const w = 96 * s, h = 56 * s, R = geo.rect(cx - w / 2, cy - h / 2, w, h, 5);
    for (let i = 0; i < 4; i++) { const px = cx - w / 2 + (i + 0.5) * (w / 4); [[-1, cy - h / 2], [1, cy + h / 2]].forEach(([d, y0], j) => Ink.stroke(x, [[px, y0], [px, y0 + d * 14 * s], [px + 5 * s, y0 + d * 14 * s]], { w: 2.2, seed: 30 + i * 2 + j, retrace: false })); }
    Ink.hatchShadow(x, R, 1, 5, 5); paper(x, R); Ink.hatchFill(x, R, 1, B, 1.5); Ink.stroke(x, R, { w: 2.8, seed: 41 });
    Ink.stroke(x, geo.ellipse(cx - w / 2, cy, 8 * s, 8 * s, -Math.PI / 2, Math.PI / 2), { w: 2, seed: 43, retrace: false });
  }

  // ---------- a small interactive canvas with an on-demand render loop ----------
  function Demo(ui, o) {
    const box = ui.el('div', 'p05-demo'); requestAnimationFrame(() => Ink.frame(box, { shadow: false, w: 2.2 }));
    ui.el('div', 'p05-step', o.step, box);
    const cap = ui.el('p', 'p05-cap', o.cap, box);
    const c = document.createElement('canvas'); c.className = 'p05-cv'; box.appendChild(c);
    const Hh = o.h, dpr = Math.min(2, window.devicePixelRatio || 1); c.width = W * dpr; c.height = Hh * dpr; c.style.aspectRatio = W + ' / ' + Hh;
    const ctx = c.getContext('2d');
    const S = { c, cap, box, time: 0, used: false };
    let L = null, raf = 0, last = 0;
    const paint = () => { L = document.createElement('canvas'); L.width = W * dpr; L.height = Hh * dpr; const x = L.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.lineCap = x.lineJoin = 'round'; o.paint(x); };
    const draw = () => { ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, Hh); ctx.globalCompositeOperation = 'multiply'; ctx.lineCap = ctx.lineJoin = 'round'; ctx.drawImage(L, 0, 0, W, Hh); o.draw(ctx, S); };
    const hidden = () => { const p = c.closest('.page'); return !p || p.classList.contains('hidden'); };
    function frame(now) { raf = 0; if (hidden()) return; const dt = Math.min(0.05, (now - last) / 1000 || 0.016); last = now; S.time += dt; const more = o.step2(S, dt); draw(); if (more) raf = requestAnimationFrame(frame); }
    S.go = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } };
    S.pos = (e) => { const r = c.getBoundingClientRect(); return [((e.clientX - r.left) * W) / r.width, ((e.clientY - r.top) * Hh) / r.height]; };
    o.init(S);
    paint(); draw(); if (document.fonts) document.fonts.ready.then(() => { paint(); draw(); });
    c.addEventListener('pointerdown', (e) => { const [x, y] = S.pos(e); if (o.down(S, x, y, e) === 'capture') { try { c.setPointerCapture(e.pointerId); } catch (er) {} e.preventDefault(); } S.go(); });
    c.addEventListener('pointermove', (e) => { if (S.drag && o.move) { o.move(S, ...S.pos(e)); S.go(); } });
    const up = () => { if (S.drag) { S.drag = false; S.go(); } };
    c.addEventListener('pointerup', up); c.addEventListener('pointercancel', up);
    return S;
  }

  // ======================================================================================
  // demo 1: the security light (stays on for a set time after ONE press)
  // ======================================================================================
  const SETT = 5, LAMP = [712, 122];
  const demoLight = {
    step: 'Demo 1 · security light', h: 290, cap: '<b>Press the button once</b>, then hands off and watch the lamp.',
    init(S) { S.left = 0; S.on = false; S.pressT = 0; S.cycles = 0; },
    paint(x) {
      const hb = geo.rect(64, 168, 172, 78, 8); Ink.hatchShadow(x, hb, 1, 7, 7); paper(x, hb); Ink.hatchFill(x, hb, 0.6, B, 0.8); Ink.stroke(x, hb, { w: 2.8, seed: 5 });
      text(x, 'push button', 150, 278, { font: 'hand', size: 22, align: 'center' });
      arrow(x, [[246, 200], [372, 176]], { seed: 9 }); chip(x, 432, 168); arrow(x, [[494, 164], [606, 136]], { seed: 13 });
      text(x, 'microcontroller', 432, 240, { font: 'hand', size: 22, align: 'center' });
      // lamp: holder on a wall bracket
      const cap = geo.rect(LAMP[0] - 22, LAMP[1] + 44, 44, 34, 5); paper(x, cap); Ink.hatchFill(x, cap, 1, B, 1.6); Ink.stroke(x, cap, { w: 2.6, seed: 17 });
      Ink.stroke(x, [[LAMP[0], LAMP[1] + 78], [LAMP[0], 250], [LAMP[0] - 50, 250], [LAMP[0] + 50, 250]], { w: 3, seed: 19 });
      text(x, 'lamp', LAMP[0], 280, { font: 'hand', size: 22, align: 'center' });
    },
    draw(ctx, S) {
      // the button cap
      const dy = S.pressT > 0 ? 12 : 0, top = geo.ellipse(150, 140 + dy, 50, 15), side = [[100, 140 + dy], [100, 168], [200, 168], [200, 140 + dy]];
      paper(ctx, side); Ink.stroke(ctx, side, { w: 2.6, color: RD, seed: 51 }); paper(ctx, top); Ink.hatchFill(ctx, top, 1, RD, 1.2); Ink.stroke(ctx, top, { w: 2.8, color: RD, seed: 53 });
      if (!S.used) text(ctx, 'press!', 150, 104, { font: 'hand', size: 24, align: 'center', color: RD, rot: -0.05 });
      // the bulb
      const G = geo.ellipse(LAMP[0], LAMP[1], 46, 48);
      paper(ctx, G); if (S.on) tint(ctx, G, 'rgba(255,222,70,.75)');
      Ink.stroke(ctx, G, { w: 2.8, seed: 57 });
      Ink.stroke(ctx, [[LAMP[0] - 12, LAMP[1] + 44], [LAMP[0] - 14, LAMP[1] + 6], [LAMP[0] - 5, LAMP[1] - 8], [LAMP[0], LAMP[1] + 6], [LAMP[0] + 5, LAMP[1] - 8], [LAMP[0] + 14, LAMP[1] + 6], [LAMP[0] + 12, LAMP[1] + 44]], { w: 1.8, seed: 59, retrace: false, color: S.on ? RD : B });
      if (S.on) {
        for (let i = 0; i < 9; i++) { const a = Math.PI + 0.25 + (i / 8) * (Math.PI - 0.5), r0 = 60, r1 = 80 + (i % 2) * 10 + Math.sin(S.time * 6 + i) * 2; Ink.stroke(ctx, [[LAMP[0] + Math.cos(a) * r0, LAMP[1] + Math.sin(a) * r0], [LAMP[0] + Math.cos(a) * r1, LAMP[1] + Math.sin(a) * r1]], { w: 2.4, seed: 61 + i, retrace: false, amp: 0.4 }); }
        // five pips under the lamp, one crossed out each second
        const n = Math.ceil(S.left - 0.001);
        for (let i = 0; i < SETT; i++) { const px = 566 + i * 24, py = 226; ctx.save(); ctx.strokeStyle = rgba(RD, 0.9); ctx.fillStyle = rgba(RD, 0.9); ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(px, py, 8, 0, 7); i < n ? ctx.fill() : ctx.stroke(); ctx.restore(); }
      }
    },
    step2(S, dt) {
      if (S.pressT > 0) S.pressT -= dt;
      if (S.on) { const b = Math.ceil(S.left); S.left -= dt; if (Math.ceil(S.left) !== b && S.left > 0) Book.sfx('tick', { gain: 0.35 }); if (S.left <= 0) { S.on = false; S.cycles++; Book.sfx('pop', { gain: 0.4 }); S.cap.innerHTML = 'It switched itself off. <b>Press again:</b> is it the same every time?'; S.onUse && S.onUse(S.cycles); } }
      return S.on || S.pressT > 0;
    },
    down(S, x) { if (x > 300) return; S.used = true; S.pressT = 0.18; S.on = true; S.left = SETT; Book.sfx('tick', { gain: 0.6 }); S.cap.innerHTML = 'Hands off! Watch what the lamp does <b>on its own</b>.'; },
  };

  // ======================================================================================
  // demo 2: the turnstile (every person adds one to the display)
  // ======================================================================================
  const HUB = [330, 150];
  function person(ctx, px, ph, a = 1, seed = 1) {
    const sw = Math.sin(ph) * 14, y0 = 96;
    ctx.save(); ctx.globalAlpha = a;
    Ink.stroke(ctx, geo.ellipse(px, y0, 13, 14), { w: 2.4, seed: seed + 1 });
    Ink.stroke(ctx, [[px, y0 + 14], [px, y0 + 82]], { w: 2.6, seed: seed + 2 });
    Ink.stroke(ctx, [[px - 16 - sw * 0.4, y0 + 56], [px, y0 + 30], [px + 16 + sw * 0.4, y0 + 56]], { w: 2.2, seed: seed + 3, retrace: false });
    Ink.stroke(ctx, [[px - sw, y0 + 142], [px, y0 + 82], [px + sw, y0 + 142]], { w: 2.4, seed: seed + 4, retrace: false });
    ctx.restore();
  }
  const demoGate = {
    step: 'Demo 2 · stadium turnstile', h: 290, cap: '<b>Tap the drawing</b> to let people through, one at a time.',
    init(S) { S.count = 0; S.ang = 0; S.angT = 0; S.people = []; S.flash = 0; },
    paint(x) {
      Ink.stroke(x, [[20, 242], [520, 242]], { w: 2.6, seed: 3 });
      const post = geo.rect(HUB[0] - 16, HUB[1], 32, 92, 5); paper(x, post); Ink.hatchFill(x, post, 1, B, 1.4); Ink.stroke(x, post, { w: 2.8, seed: 7 });
      text(x, 'turnstile', HUB[0], 276, { font: 'hand', size: 22, align: 'center' });
      arrow(x, [[440, 170], [520, 170]], { seed: 15 }); chip(x, 580, 170, 0.9); arrow(x, [[634, 166], [690, 140]], { seed: 19 });
      text(x, 'microcontroller', 590, 240, { font: 'hand', size: 22, align: 'center' });
      const D = geo.rect(676, 40, 164, 92, 10); Ink.hatchShadow(x, D, 1, 7, 7); paper(x, D, 'rgba(232,238,226,.95)'); Ink.stroke(x, D, { w: 3, seed: 23 });
      text(x, 'display', 758, 162, { font: 'hand', size: 22, align: 'center' });
    },
    draw(ctx, S) {
      S.people.forEach((p) => person(ctx, p.x, p.x * 0.09, p.x > 430 ? clamp((500 - p.x) / 70) : 1, p.seed));
      for (let i = 0; i < 3; i++) { const a = S.ang + (i * Math.PI * 2) / 3, P = [[HUB[0], HUB[1]], [HUB[0] + Math.cos(a) * 78, HUB[1] + Math.sin(a) * 30]]; Ink.stroke(ctx, P, { w: 5, seed: 71 + i }); ctx.fillStyle = rgba(B, 0.9); ctx.beginPath(); ctx.arc(P[1][0], P[1][1], 6, 0, 7); ctx.fill(); }
      ctx.fillStyle = rgba(B, 0.95); ctx.beginPath(); ctx.arc(HUB[0], HUB[1], 9, 0, 7); ctx.fill();
      text(ctx, String(S.count).padStart(3, '0'), 758, 108, { size: 60, align: 'center', color: S.flash > 0 ? RD : B });
      if (!S.used) text(ctx, 'tap!', 130, 70, { font: 'hand', size: 24, align: 'center', color: RD, rot: -0.05 });
    },
    step2(S, dt) {
      S.people.forEach((p) => { const was = p.x; p.x += dt * 330; if (was < HUB[0] && p.x >= HUB[0]) { S.count++; S.angT += (Math.PI * 2) / 3; S.flash = 0.25; Book.sfx('tick', { gain: 0.6 }); S.onUse && S.onUse(S.count); if (S.count === 1) S.cap.innerHTML = 'Keep going: let <b>a few more</b> people in and watch the display.'; } });
      S.people = S.people.filter((p) => p.x < 500);
      if (S.flash > 0) S.flash -= dt;
      const d = S.angT - S.ang; if (Math.abs(d) > 0.004) S.ang += d * (1 - Math.exp(-dt * 9)); else S.ang = S.angT;
      return S.people.length > 0 || S.flash > 0 || S.ang !== S.angT;
    },
    down(S) { S.used = true; if (S.people.length < 6) { const lastX = S.people.reduce((m, p) => Math.min(m, p.x), 999); S.people.push({ x: Math.min(40, lastX - 60), seed: 80 + ((S.count + S.people.length) % 5) * 9 }); Book.sfx('pop', { gain: 0.3 }); } },
  };

  // ======================================================================================
  // demo 3: the fan (comes on when the temperature passes a set value)
  // ======================================================================================
  const TS = { x0: 70, x1: 430, y: 214, t0: 10, t1: 40, set: 25 }, FAN = [724, 132];
  const tx = (T) => lerp(TS.x0, TS.x1, (T - TS.t0) / (TS.t1 - TS.t0));
  const demoFan = {
    step: 'Demo 3 · desk fan', h: 290, cap: '<b>Drag the room temperature</b> up and down, slowly.',
    init(S) { S.T = 19; S.on = false; S.w = 0; S.ang = 0.4; S.flips = 0; },
    paint(x) {
      Ink.stroke(x, [[TS.x0, TS.y], [TS.x1, TS.y]], { w: 3.2, seed: 5 });
      for (let i = 0; i <= 30; i += 2) { const px = tx(TS.t0 + i), big = i % 10 === 0; Ink.stroke(x, [[px, TS.y - (big ? 12 : 6)], [px, TS.y + (big ? 12 : 6)]], { w: 1.6, seed: 10 + i, retrace: false }); if (big) text(x, TS.t0 + i + '°', px, TS.y + 42, { size: 22, align: 'center' }); }
      const sx = tx(TS.set); ctx_dash(x, [[sx, TS.y - 64], [sx, TS.y + 16]]);
      text(x, 'set value: 25 °C', sx, TS.y - 74, { size: 22, align: 'center', color: RD });
      text(x, 'temperature sensor', 250, 278, { font: 'hand', size: 22, align: 'center' });
      arrow(x, [[452, 196], [512, 178]], { seed: 15 }); chip(x, 566, 168, 0.9); arrow(x, [[620, 162], [654, 150]], { seed: 19, head: 12 });
      text(x, 'microcontroller', 566, 240, { font: 'hand', size: 22, align: 'center' });
      Ink.stroke(x, geo.ellipse(FAN[0], FAN[1], 66, 66), { w: 3, seed: 23 });
      Ink.stroke(x, [[FAN[0], FAN[1] + 66], [FAN[0], 244]], { w: 5, seed: 25 });
      const base = geo.rect(FAN[0] - 52, 244, 104, 14, 6); paper(x, base); Ink.hatchFill(x, base, 1, B, 1.5); Ink.stroke(x, base, { w: 2.6, seed: 27 });
      text(x, 'fan', FAN[0] + 78, 252, { font: 'hand', size: 22 });
    },
    draw(ctx, S) {
      text(ctx, S.T.toFixed(0) + ' °C', 70, 70, { size: 44, color: S.on ? RD : B });
      text(ctx, 'room', 70, 100, { font: 'hand', size: 22 });
      for (let i = 0; i < 3; i++) {
        const a = S.ang + (i * Math.PI * 2) / 3; ctx.save(); ctx.translate(FAN[0], FAN[1]); ctx.rotate(a);
        const Bl = geo.ellipse(32, 0, 26, 13); paper(ctx, Bl); Ink.hatchFill(ctx, Bl, 1, B, 1.3); Ink.stroke(ctx, Bl, { w: 2.4, seed: 60 + i }); ctx.restore();
      }
      ctx.fillStyle = rgba(B, 0.95); ctx.beginPath(); ctx.arc(FAN[0], FAN[1], 9, 0, 7); ctx.fill();
      if (S.w > 2) { ctx.save(); ctx.strokeStyle = rgba(B, 0.55); ctx.lineWidth = 2; for (let i = 0; i < 3; i++) { const a = S.ang * 0.5 + i * 2.1; ctx.beginPath(); ctx.arc(FAN[0], FAN[1], 46 + i * 5, a, a + 0.9); ctx.stroke(); } ctx.restore(); text(ctx, 'ON', FAN[0], 44, { size: 26, align: 'center', color: RD }); }
      const kx = tx(S.T), K = geo.ellipse(kx, TS.y, 20, 20); paper(ctx, K); Ink.hatchFill(ctx, K, 1, S.on ? RD : B, 1.3); Ink.stroke(ctx, K, { w: 3, color: S.on ? RD : B, seed: 77 });
      if (!S.used) text(ctx, 'drag!', kx, TS.y - 30, { font: 'hand', size: 24, align: 'center', color: RD, rot: -0.05 });
    },
    step2(S, dt) { const t = S.on ? 13 : 0; S.w += (t - S.w) * (1 - Math.exp(-dt * 2.2)); if (!S.on && S.w < 0.05) S.w = 0; S.ang += S.w * dt; return S.w > 0 || S.drag; },
    set(S, x) {
      S.T = clamp(TS.t0 + ((x - TS.x0) / (TS.x1 - TS.x0)) * (TS.t1 - TS.t0), TS.t0, TS.t1);
      const on = S.T > TS.set;
      if (on !== S.on) { S.on = on; S.flips++; Book.sfx('pop', { gain: 0.45 }); S.cap.innerHTML = S.flips < 2 ? 'Something changed! Now drag it <b>back the other way</b>.' : 'Find the exact temperature where the fan changes.'; S.onUse && S.onUse(S.flips); }
    },
    down(S, x, y) { if (Math.abs(y - TS.y) > 70 || x > TS.x1 + 50) return; S.used = true; S.drag = true; demoFan.set(S, x); return 'capture'; },
    move(S, x) { demoFan.set(S, x); },
  };
  function ctx_dash(x, P) { x.save(); x.strokeStyle = rgba(RD, 0.9); x.lineWidth = 2.6; x.setLineDash([8, 7]); x.lineCap = 'round'; x.beginPath(); x.moveTo(P[0][0], P[0][1]); x.lineTo(P[1][0], P[1][1]); x.stroke(); x.restore(); }

  // ======================================================================================
  Book.page({ id: 'p05', title: 'Process: the microcontroller', build(ui, root) {
    ui.h('Process: the microcontroller');
    ui.p('The <b>process</b> block is the “brain” of a system. In most modern products that brain is a <span class="key">microcontroller</span>.');

    // ---- the animation: a program travels from the laptop down the cable into the chip ----
    const cable = geo.curve([332, 226], [430, 316], [470, 110], [566, 150], 60);
    ui.anim({ w: 860, h: 356, duration: 14, poster: 8.5,
      draw(k, t) {
        const scr = k.rect(70, 44, 240, 160, 10);
        k.shadow(scr, 1.5, 1.9); k.line(scr, 0.2, 1.5); k.line(k.rect(86, 60, 208, 128, 4), 1.5, 2.2, { w: 2 });
        k.line([[70, 208], [40, 238], [340, 238], [310, 208]], 2.2, 3.0); k.line([[150, 224], [230, 224]], 3.0, 3.2, { w: 2 });
        [[110, 0], [150, 1], [90, 1], [130, 2], [70, 1], [120, 0]].forEach(([len, ind], i) => k.line([[100 + ind * 22, 80 + i * 19], [100 + ind * 22 + len, 80 + i * 19]], 3.3 + i * 0.22, 3.5 + i * 0.22, { w: 2.2, color: i === 3 ? RD : B, retrace: false }));
        k.text('1. write the program', 190, 280, 3.6, 4.6, { size: 24, align: 'center' });
        // the chip
        const body = k.rect(566, 100, 230, 104, 6);
        k.shadow(body, 5.9, 6.3); k.line(body, 4.8, 5.9, { w: 3 });
        k.line(k.ellipse(566, 152, 13, 13, -Math.PI / 2, Math.PI / 2), 5.9, 6.1, { w: 2.2 }); k.dot(590, 186, 5, 6.1);
        for (let i = 0; i < 7; i++) { const px = 590 + i * 30.5; k.line([[px, 100], [px, 80], [px + 7, 80]], 6.2 + i * 0.06, 6.3 + i * 0.06, { w: 2.4, retrace: false }); k.line([[px, 204], [px, 224], [px + 7, 224]], 6.7 + i * 0.06, 6.8 + i * 0.06, { w: 2.4, retrace: false }); }
        k.hatch(body, 7.1, 7.6, { density: 0.7 });
        k.text('microcontroller', 681, 262, 7.0, 7.8, { size: 26, align: 'center' });
        k.text('a tiny computer on one chip', 681, 294, 7.6, 8.4, { size: 22, align: 'center' });
        // the download cable + the program travelling down it
        k.line(cable, 7.8, 8.5, { w: 3.4 });
        k.text('2. download it', 452, 84, 8.7, 9.5, { size: 24, align: 'center', color: RD });
        for (let i = 0; i < 6; i++) {
          const u = k.win(8.9 + i * 0.45, 10.4 + i * 0.45); if (u <= 0 || u >= 1) continue;
          const p = cable[Math.round(u * (cable.length - 1))], c = k.ctx;
          c.save(); c.globalCompositeOperation = 'source-over'; c.fillStyle = PAPER; c.fillRect(p[0] - 11, p[1] - 11, 22, 22); c.restore();
          c.save(); c.strokeStyle = rgba(RD, 0.95); c.lineWidth = 2.6; c.strokeRect(p[0] - 10, p[1] - 10, 20, 20); c.fillStyle = rgba(RD, 0.9); c.font = LABF(15); c.textAlign = 'center'; c.fillText(i % 2 ? '1' : '0', p[0], p[1] + 5.5); c.restore();
        }
        k.hatch(body, 10.6, 12.6, { color: RD, density: 0.9 });
        k.text('programmed!', 681, 56, 12.4, 13.2, { font: 'bubble', size: 36, color: RD, align: 'center', rot: -0.03 });
        k.text('3. the chip now follows the program', 40, 338, 12.8, 13.9, { size: 24 });
      },
      sound(k) { [[0.2, 1.3], [1.5, 0.7], [2.2, 0.8], [4.8, 1.1], [7.8, 0.7]].forEach(([t, d]) => k.play('stroke', t, { material: 'pen', dur: d, gain: 0.5 })); for (let i = 0; i < 6; i++) { k.play('stroke', 3.3 + i * 0.22, { material: 'pen', dur: 0.18, gain: 0.4 }); k.play('pop', 10.4 + i * 0.45, { gain: 0.3 }); } k.play('success', 12.6, { gain: 0.35 }); },
    });
    const n1 = ui.box(`<p>A <span class="key">microcontroller</span> is a small, cheap <b>computer on a single chip</b> (an integrated circuit, <b>IC</b>) that can be <b>programmed</b>. Examples: PIC, Arduino, Crumble, the chip on a BBC micro:bit.</p>
      <p>It is a <span class="key">programmable component</span>: the program is written on a computer and downloaded to the chip. The program tells the chip how to respond to its inputs.</p>`, { tag: 'Notes' });

    // ---- three demos: play, then name the job ----
    ui.h('What is the chip doing?', { size: 40 });
    ui.p('A microcontroller can do three different jobs. Play with each demo, then decide which job the chip is doing.');
    const jobQ = (id, n, S, need, right, hint, okIx) => {
      const names = ['Timer', 'Counter', 'Decision-maker'];
      const act = ui.mcq({ id, label: `Demo ${n}: name the microcontroller’s job`, q: `<b>Demo ${n}.</b> Which job is the microcontroller doing here?`, shuffle: false,
        options: names.map((t, i) => (i === okIx ? { t, ok: true, why: right } : { t, mis: 'timer-counter-decision', why: hint })) });
      const done = () => { const it = Book.state.items[id]; return it && it.attempts; };
      if (!done()) {
        act.classList.add('p05-wait'); const m = document.createElement('div'); m.className = 'p05-waitmsg'; m.textContent = 'Play with the demo above first.'; act.insertBefore(m, act.querySelector('.opts'));
        S.onUse = (k) => { if (k >= need && act.classList.contains('p05-wait')) { act.classList.remove('p05-wait'); Book.sfx('paper', { gain: 0.3 }); } };
      }
      return act;
    };
    const d1 = Demo(ui, Object.assign({}, demoLight));
    jobQ('p05.job1', 1, d1, 1, 'It keeps the lamp on for a set time (5 seconds), then switches it off.', 'Not quite. Press once, take your hands away and watch what the lamp does by itself.', 0);
    const d2 = Demo(ui, Object.assign({}, demoGate));
    jobQ('p05.job2', 2, d2, 3, 'It adds 1 for every person who goes through and keeps the total.', 'Not quite. Watch the display each time one more person goes through.', 1);
    const d3 = Demo(ui, Object.assign({}, demoFan));
    jobQ('p05.job3', 3, d3, 2, 'It compares the temperature with the set value (25 °C) and chooses: fan on or fan off.', 'Not quite. Drag slowly past the red line: what does the chip have to work out each time?', 2);

    // ---- notes ----
    const n2 = ui.box(`<div class="p05-notes"><p><b>The three jobs of a microcontroller</b></p>
      <ul>
        <li><span class="key">Timer</span>: waits, or keeps something on, for a set time. <i>Egg timer, microwave countdown, 2-minute toothbrush timer.</i></li>
        <li><span class="key">Counter</span>: counts signals or events. <i>People through a door, laps, items on a conveyor, steps in a pedometer.</i></li>
        <li><span class="key">Decision-maker</span>: compares an input with a set value and chooses what to do. <i>IF it is dark THEN lamp on.</i></li>
      </ul>
      <p><b class="green">Advantages</b> (compared with a circuit of separate components): it can be <b>reprogrammed</b> to change what the product does <b>without rebuilding it</b>; one chip replaces many components, so the product is smaller, cheaper to assemble and more reliable; it handles many inputs and outputs at once; easy to update.</p>
      <p><b class="red">Disadvantages</b>: needs programming skill and equipment (computer, software, download cable); too costly (“overkill”) for a very simple circuit; a mistake in the program (a <b>bug</b>) stops the product working properly.</p></div>`, { tag: 'Notes' });
    ui.p('Read the notes, then try the questions. <span class="small">The notes blur as soon as you start, and come back when you have answered the last question.</span>');

    // the notes (and the demo answers) stay blurred from the first tap below until the last question is answered
    const hide = [n2, d1.box, d2.box, d3.box, ...root.querySelectorAll('.act')];
    const allDone = () => !!Book.state.items['p05.disadv'];
    const lock = (on) => hide.forEach((e) => e.classList.toggle('peek-lock', on));
    const guard = (act) => { act.addEventListener('pointerdown', () => { if (!allDone()) { lock(true); Ink.stopAll(root); } }, { passive: true }); act.addEventListener('click', () => setTimeout(() => { if (allDone()) lock(false); }, 60)); };

    guard(ui.sort({ id: 'p05.jobs', label: 'Sort 9 product functions: timer / counter / decision-maker',
      q: 'Which job is the microcontroller doing? Tap a card, then tap its box.', buckets: ['Timer', 'Counter', 'Decision-maker'],
      items: [
        { t: 'Microwave: stops after 2 minutes', b: 0, mis: 'timer-counter-decision' }, { t: 'Toothbrush: buzzes after 2 minutes', b: 0, mis: 'timer-counter-decision' }, { t: 'Egg timer: beeps after 4 minutes', b: 0, mis: 'timer-counter-decision' },
        { t: 'Pedometer: steps walked today', b: 1, mis: 'timer-counter-decision' }, { t: 'Shop door: customers so far', b: 1, mis: 'timer-counter-decision' }, { t: 'Conveyor: boxes packed this shift', b: 1, mis: 'timer-counter-decision' },
        { t: 'Night light: on only if it is dark', b: 2, mis: 'timer-counter-decision' }, { t: 'Heating: on if colder than 20 °C', b: 2, mis: 'timer-counter-decision' }, { t: 'Fire alarm: sounds if it is too hot', b: 2, mis: 'timer-counter-decision' },
      ],
      explain: 'All sorted. Timers work with time, counters keep a total, decision-makers compare with a set value.' }));

    guard(ui.mcq({ id: 'p05.reprogram', label: 'Big advantage of a microcontroller (reprogrammable)',
      q: 'A company wants its night light to <b>flash</b> instead of staying on. The night light uses a microcontroller. Why is that a big advantage here?',
      options: [
        { t: 'It can be reprogrammed, so the circuit need not be rebuilt', ok: true, why: 'Change the program, download it again: the same chip now does a new job.' },
        { t: 'Its program is fixed for ever, so nothing can go wrong', mis: 'micro-fixed', why: 'The opposite is true: a new program can be downloaded to the chip at any time.' },
        { t: 'It supplies the power, so the battery can be left out', mis: 'micro-fixed', why: 'A microcontroller is not a power supply. It is a tiny computer that still needs a battery.' },
        { t: 'It needs no programming skill or equipment to change it', why: 'Programming skill and equipment are needed: that is one of the drawbacks.' },
      ] }));

    guard(ui.tf({ id: 'p05.disadv', label: 'Disadvantage: overkill for a very simple circuit (torch)',
      statement: 'A basic torch (battery, switch, lamp) would be a better product if a microcontroller were added to it.', answer: false,
      explain: 'A torch only needs a switch. A microcontroller would add cost and need programming for no benefit: it is “overkill” for a very simple circuit.' }));
  } });
})();
