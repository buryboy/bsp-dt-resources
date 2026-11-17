// Page 3 — Smart pigments. Two pen-drawn colour-changing labs, each predict → test → conclude:
//   thermochromic: a mug of tea and a baby spoon of soup on one temperature slider (write down readings), plus a
//                  battery tester strip to press and hold
//   photochromic:  glasses and a T-shirt on an indoors → cloudy → sunny slider, plus a UV torch to use indoors
// Notes appear after each conclusion. Then "is it smart?" (6 quick cases) and a match with everything blurred.
(function () {
  'use strict';
  const B = Ink.BLUE, RD = Ink.RED, rgba = Ink.rgba, geo = Ink.geo;
  const HANDF = (s) => `400 ${s}px "Gloria Hallelujah", "Comic Sans MS", cursive`;
  const LABF = (s) => `600 ${s}px Fredoka, "Arial Rounded MT Bold", system-ui, sans-serif`;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const sstep = (a, b, v) => { const u = clamp((v - a) / (b - a)); return u * u * (3 - 2 * u); };
  const close = (P) => P.concat([P[0]]);
  const arc = (cx, cy, rx, ry, a0, a1, n = 20) => { const o = []; for (let i = 0; i <= n; i++) { const a = a0 + ((a1 - a0) * i) / n; o.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); } return o; };
  const PAPER = '#fbfaf5', W = 860, HH = 380;

  if (!document.getElementById('p03-css')) {
    const s = document.createElement('style'); s.id = 'p03-css';
    s.textContent = `
      .sp3-lab { position: relative; margin: 0 0 calc(var(--R) * .6); padding: 12px 16px 16px; background: rgba(251,250,245,.9); }
      .sp3-lab > * { position: relative; }
      .sp3-step { font: 700 14px Fredoka, system-ui; letter-spacing: .08em; text-transform: uppercase; color: var(--red); line-height: 22px; }
      .sp3-task, .sp3-q { font-size: 19px; line-height: 1.5; margin: 0 0 8px; }
      .sp3-task b, .sp3-q b { font-family: Fredoka, system-ui; font-weight: 600; }
      .sp3-cvw { transition: opacity .3s; }
      .sp3-cvw.locked { opacity: .35; pointer-events: none; }
      .sp3-ctl { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; min-height: 52px; margin: 4px 0; font-size: 17px; }
      .sp3-ctl .btn { margin-top: 0; min-height: 50px; }
      .sp3-read { display: inline-flex; flex-direction: column; align-items: center; background: #fff; border: 2px solid rgba(30,46,150,.4); border-radius: 10px; padding: 3px 10px 4px; line-height: 1.25; }
      .sp3-read b { font: 700 18px Fredoka, system-ui; } .sp3-read i { font-style: normal; font-size: 14px; }
      .sp3-list { font-size: 17px; line-height: 1.5; margin: 4px 0; min-height: 26px; }
      .sp3-say { font-size: 18px; line-height: 1.5; margin: 0 0 4px; min-height: 27px; }
      .sp3-conc { display: none; margin-top: 6px; padding-top: 6px; border-top: 2px dashed rgba(30,46,150,.3); }
      .sp3-conc.on { display: block; }
      .sp3-conc .opts { grid-template-columns: 1fr 1fr; margin-bottom: 6px; }
      .sp3-locked { font-size: 17px; opacity: .75; }
      .sp3-notes p { margin: 0 0 4px; }
      .sp3-case { display: flex; flex-wrap: wrap; gap: 8px 12px; align-items: center; padding: 8px 0; border-top: 2px dashed rgba(30,46,150,.25); }
      .sp3-case:first-of-type { border-top: 0; }
      .sp3-case .tx { flex: 1 1 300px; font-size: 19px; line-height: 1.45; }
      .sp3-case .bt { display: flex; gap: 8px; }
      .sp3-case .opt { min-width: 112px; min-height: 48px; text-align: center; }
      .sp3-case .why { flex: 1 1 100%; font-size: 17px; line-height: 1.45; }
    `;
    document.head.appendChild(s);
  }

  // ---------- small drawing helpers ----------
  function text(x, s, px, py, o = {}) {
    x.save(); x.font = (o.font === 'hand' ? HANDF : LABF)(o.size || 22);
    x.fillStyle = rgba(o.color || B, o.a ?? 0.92); x.textAlign = o.align || 'center'; x.textBaseline = 'alphabetic';
    x.translate(px, py); if (o.rot) x.rotate(o.rot); x.fillText(s, 0, 0); x.restore();
  }
  function pen(x, pts, o = {}) {
    const P = o.wob === false ? pts : geo.wob(geo.seg(pts, 3), o.seed ?? 11, o.amp ?? 0.6);
    x.save(); x.strokeStyle = rgba(o.color || B, o.a ?? 0.85); x.lineWidth = o.w ?? 1.6; x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath();
    P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.stroke(); x.restore();
  }
  const dot = (x, px, py, r, a = 0.9, c = B) => { x.fillStyle = rgba(c, a); x.beginPath(); x.arc(px, py, r, 0, 7); x.fill(); };
  function fill(x, pts, style) { x.save(); x.fillStyle = style; x.beginPath(); pts.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.closePath(); x.fill(); x.restore(); }
  function paper(x, pts) { x.save(); x.globalCompositeOperation = 'source-over'; fill(x, pts, PAPER); x.restore(); }
  const hint = (x, s, px, py) => text(x, s, px, py, { font: 'hand', size: 22, color: RD });
  const steam = (x, sx, y, t, a, n = 3) => { for (let i = 0; i < n; i++) { const ph = t * 2.3 + i * 1.9; pen(x, [0, 1, 2, 3, 4].map((j) => [sx + i * 16 + Math.sin(ph + j * 1.3) * 5, y - j * 9]), { w: 1.8, a, wob: false }); } };
  function knob(x, kx, ky) {
    x.save(); x.globalCompositeOperation = 'source-over'; x.fillStyle = PAPER; x.beginPath(); x.arc(kx, ky, 19, 0, 7); x.fill(); x.restore();
    Ink.stroke(x, geo.ellipse(kx, ky, 19, 19), { w: 3, color: RD, seed: 9 }); dot(x, kx, ky, 6, 0.9, RD);
  }
  function track(x, x0, x1, y, n, seed) { Ink.stroke(x, [[x0, y], [x1, y]], { w: 3, seed }); for (let i = 0; i <= n; i++) { const tx = lerp(x0, x1, i / n); pen(x, [[tx, y - 7], [tx, y + 7]], { w: 1.5, wob: false, a: 0.7 }); } }

  // an interactive canvas with an on-demand render loop (stops when the page is hidden)
  function Stage(parent, Wd, Hh, touch) {
    const c = document.createElement('canvas'); c.className = 'lab-cv'; parent.appendChild(c);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = Math.round(Wd * dpr); c.height = Math.round(Hh * dpr);
    Object.assign(c.style, { width: '100%', height: 'auto', aspectRatio: Wd + ' / ' + Hh, display: 'block', touchAction: touch || 'manipulation', userSelect: 'none', webkitUserSelect: 'none', webkitTouchCallout: 'none', cursor: 'pointer' });
    const ctx = c.getContext('2d');
    const S = { c, ctx, W: Wd, H: Hh, dpr, render: () => false };
    S.pos = (e) => { const r = c.getBoundingClientRect(); return [((e.clientX - r.left) * Wd) / r.width, ((e.clientY - r.top) * Hh) / r.height]; };
    S.layer = (w, h, paint) => { const L = document.createElement('canvas'); L.width = Math.ceil(w * dpr); L.height = Math.ceil(h * dpr); const x = L.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.lineCap = 'round'; x.lineJoin = 'round'; paint(x); L.w = w; L.h = h; return L; };
    S.blit = (L, px, py) => ctx.drawImage(L, px, py, L.w, L.h);
    const hidden = () => { const p = c.closest('.page'); return !p || p.classList.contains('hidden'); };
    let raf = 0, wait = 0, last = 0;
    const tick = (now) => {
      raf = 0;
      if (hidden()) { last = 0; if (!wait) wait = setTimeout(() => { wait = 0; S.go(); }, 400); return; }
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60; last = now;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.globalCompositeOperation = 'source-over'; ctx.clearRect(0, 0, Wd, Hh);
      ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = 1; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      if (S.render(dt, now / 1000)) raf = requestAnimationFrame(tick); else last = 0;
    };
    S.go = () => { if (!raf) raf = requestAnimationFrame(tick); };
    c.addEventListener('contextmenu', (e) => e.preventDefault());
    if (document.fonts) document.fonts.ready.then(() => { S.onFonts && S.onFonts(); S.go(); });
    return S;
  }

  // ======================================================================================
  // Lab 1: thermochromic (mug + spoon on one temperature slider, battery tester to press)
  // ======================================================================================
  const MUG = (T) => sstep(44, 52, T), SPOON = (T) => sstep(37, 43, T);     // 0 = cool colour, 1 = hot colour (illustrative)
  const word = (v, a, b) => (v < 0.15 ? a : v > 0.85 ? b : 'changing');
  function sceneThermo(S, api) {
    const SL = { x0: 70, x1: 480, y: 344 }, BEN = 296;
    let T = 20, drag = false, moved = api.had('tester') || api.readings().length > 0, press = false, heat = 0, pressed = api.had('tester');
    api.temp = () => Math.round(T);
    let stat;
    const build = () => { stat = S.layer(W, HH, (x) => {
      Ink.stroke(x, [[14, BEN], [584, BEN]], { w: 2.8, seed: 3 });
      // kettle
      const kt = [[52, BEN - 2], [64, 172], [136, 172], [148, BEN - 2]]; paper(x, kt); Ink.hatchShadow(x, kt, 1, 5, 5); Ink.stroke(x, close(kt), { w: 2.6, seed: 4 });
      Ink.stroke(x, [[70, 172], [76, 158], [124, 158], [130, 172]], { w: 2.2, seed: 5 }); Ink.stroke(x, geo.ellipse(100, 152, 7, 5), { w: 1.8, seed: 6, retrace: false });
      Ink.stroke(x, [[138, 196], [166, 178], [172, 186], [142, 214]], { w: 2.2, seed: 7 });
      Ink.stroke(x, arc(58, 228, 26, 40, Math.PI * 0.52, Math.PI * 1.48, 14), { w: 2.6, seed: 8 }); pen(x, [[40, BEN - 2], [160, BEN - 2]], { w: 3 });
      // bowl of soup
      const bw = arc(430, 250, 88, 44, 0, Math.PI, 24); paper(x, bw); Ink.hatchFill(x, bw, 1, B, 0.5); Ink.stroke(x, bw, { w: 2.6, seed: 12 });
      const rim = geo.ellipse(430, 250, 88, 15); paper(x, rim); Ink.stroke(x, rim, { w: 2.4, seed: 13 }); pen(x, geo.ellipse(430, 252, 74, 10), { w: 1.3, a: 0.7 });
      pen(x, [[400, 250], [416, 248], [430, 252]], { w: 1.2, a: 0.6 }); pen(x, [[440, 256], [456, 253], [470, 256]], { w: 1.2, a: 0.6 });
      track(x, SL.x0, SL.x1, SL.y, 8, 15);
      // battery + tester strip
      text(x, 'battery tester', 735, 62);
      const bat = geo.rect(646, 92, 170, 54, 8); paper(x, bat); Ink.hatchShadow(x, bat, 1, 5, 5); Ink.stroke(x, bat, { w: 2.6, seed: 21 });
      Ink.hatchFill(x, [[656, 94], [760, 94], [760, 144], [656, 144]], 1, B, 1.1); Ink.stroke(x, [[816, 108], [826, 108], [826, 130], [816, 130]], { w: 2.2, seed: 22, retrace: false });
      text(x, '+', 792, 128, { size: 26 });
      const st = geo.rect(626, 196, 208, 48, 8); paper(x, st); Ink.stroke(x, st, { w: 2.4, seed: 23 });
      Ink.stroke(x, [[640, 208], [636, 160], [646, 122]], { w: 2, seed: 24, retrace: false }); Ink.stroke(x, [[820, 208], [836, 166], [826, 120]], { w: 2, seed: 25, retrace: false });
      [640, 820].forEach((px, i) => { paper(x, geo.ellipse(px, 220, 10, 10)); Ink.stroke(x, geo.ellipse(px, 220, 10, 10), { w: 2, seed: 26 + i, retrace: false }); });
    }); };
    build(); S.onFonts = build;
    S.render = (dt, t) => {
      const x = S.ctx; let busy = drag;
      const m = MUG(T), s = SPOON(T), hot = clamp((T - 50) / 40);
      // mug: dark coat when cool, warm colour + hidden picture when hot
      const mug = [[196, 222], [264, 222], [259, BEN - 2], [201, BEN - 2]];
      if (m > 0.02) fill(x, mug, `rgba(255,120,40,${0.6 * m})`);
      if (m < 0.98) { x.save(); x.globalAlpha = 1 - m; Ink.hatchFill(x, mug, 1, B, 2.2); Ink.hatchFill(x, mug.map(([a, b]) => [a + 0.5, b + 1]), 1, B, 1.4); x.restore(); }
      Ink.stroke(x, close(mug), { w: 2.6, seed: 31 }); Ink.stroke(x, arc(264, 258, 19, 22, -Math.PI * 0.42, Math.PI * 0.42, 14), { w: 2.6, seed: 32 });
      if (m > 0.2) { const a = clamp((m - 0.2) / 0.6); pen(x, geo.ellipse(230, 260, 13, 13), { w: 2.4, color: RD, a, wob: false });
        for (let i = 0; i < 8; i++) { const an = (i / 8) * 6.283; pen(x, [[230 + Math.cos(an) * 17, 260 + Math.sin(an) * 17], [230 + Math.cos(an) * 23, 260 + Math.sin(an) * 23]], { w: 2, color: RD, a, wob: false }); }
        pen(x, arc(230, 261, 7, 6, 0.3, Math.PI - 0.3, 8), { w: 1.8, color: RD, a, wob: false }); }
      if (hot > 0.02) { steam(x, 214, 212, t, 0.5 * hot); steam(x, 150, 168, t + 1, 0.5 * hot, 2); busy = true; }
      S.blit(stat, 0, 0);
      if (hot > 0.02) steam(x, 392, 226, t + 2, 0.45 * hot, 2);
      // baby spoon holding a little soup: red head when cool, white when hot
      const head = geo.ellipse(436, 196, 38, 15), hd = [[470, 188], [566, 140], [574, 152], [476, 202]];
      paper(x, hd); Ink.hatchFill(x, hd, 1, B, 0.8); Ink.stroke(x, close(hd), { w: 2.2, seed: 33 });
      paper(x, head); if (s < 0.98) fill(x, head, `rgba(222,40,44,${0.8 * (1 - s)})`);
      Ink.stroke(x, head, { w: 2.6, seed: 34 }); pen(x, geo.ellipse(434, 197, 24, 7), { w: 1.3, a: 0.7 });
      // slider
      knob(x, lerp(SL.x0, SL.x1, (T - 10) / 80), SL.y);
      text(x, Math.round(T) + ' °C', 506, 353, { size: 28, color: RD, align: 'left' });
      if (!moved) hint(x, 'drag to heat the tea and the soup', 290, 322);
      // battery tester: pressing lets a current flow, which warms the strip
      const hT = press ? 1 : 0; if (Math.abs(hT - heat) > 0.004) { heat += clamp(hT - heat, -dt / 1.6, dt / 1.2); busy = true; if (heat > 0.97 && press) { api.mark('tester'); api.say('Pressing both ends lets a small <b>current</b> flow through the strip. The current <b>warms</b> it, and the colour creeps along. Let go and it fades as it cools.'); } }
      const win = [[660, 208], [800, 208], [800, 232], [660, 232]];
      x.save(); x.beginPath(); x.rect(660, 208, 140 * heat, 24); x.clip(); fill(x, win, 'rgba(255,205,20,.9)'); x.restore();
      pen(x, close(win), { w: 1.6, wob: false }); pen(x, [[662, 220], [798, 210]], { w: 1.2, wob: false, a: 0.7 }); pen(x, [[662, 220], [798, 230]], { w: 1.2, wob: false, a: 0.7 });
      if (press) { [640, 820].forEach((px) => { const f = geo.ellipse(px, 232, 17, 22); paper(x, f); pen(x, f, { w: 2.4, color: RD, wob: false }); pen(x, arc(px, 226, 10, 9, Math.PI * 1.1, Math.PI * 1.9, 6), { w: 1.4, color: RD, wob: false }); });
        for (let i = 0; i < 3; i++) dot(x, lerp(640, 820, ((t * 0.6 + i / 3) % 1)), 250, 4, 0.8, RD); busy = true; }
      else if (!pressed) hint(x, 'press and hold', 730, 284);
      return busy;
    };
    const setT = (px) => { const nt = 10 + clamp((px - SL.x0) / (SL.x1 - SL.x0)) * 80; if (Math.round(nt / 5) !== Math.round(T / 5)) Book.sfx('tick', { gain: 0.25 }); T = nt; moved = true; };
    const zone = (px, py) => (px > 596 ? 'tester' : py > 300 ? 'slider' : '');
    S.c.addEventListener('pointerdown', (e) => { const [px, py] = S.pos(e), z = zone(px, py); if (!z) return;
      try { S.c.setPointerCapture(e.pointerId); } catch (er) {} e.preventDefault();
      if (z === 'slider') { drag = true; setT(px); } else { press = true; pressed = true; Book.sfx('press', { gain: 0.4 }); } S.go(); });
    S.c.addEventListener('pointermove', (e) => { if (drag) { setT(S.pos(e)[0]); S.go(); } });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((ev) => S.c.addEventListener(ev, () => { drag = false; press = false; S.go(); }));
  }

  // ======================================================================================
  // Lab 2: photochromic (glasses + T-shirt on an indoors/cloudy/sunny slider, UV torch)
  // ======================================================================================
  function scenePhoto(S, api) {
    const SL = { x0: 80, x1: 400, y: 350 }, GND = 300;
    let u = 0, drag = false, moved = api.had('sun'), torch = false, beenOut = api.had('sun');
    const dark = [0, 0]; let shirt = 0;
    let stat;
    const TEE = [[540, 150], [574, 132], [592, 144], [610, 148], [628, 144], [646, 132], [680, 150], [704, 196], [674, 212], [662, 196], [662, 292], [558, 292], [558, 196], [546, 212], [516, 196]];
    const STAR = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, r = i % 2 ? 15 : 34; STAR.push([610 + Math.cos(a) * r, 232 + Math.sin(a) * r]); }
    const build = () => { stat = S.layer(W, HH, (x) => {
      Ink.stroke(x, [[14, GND], [846, GND]], { w: 2.8, seed: 3 });
      track(x, SL.x0, SL.x1, SL.y, 4, 5);
      // T-shirt
      paper(x, TEE); Ink.hatchShadow(x, TEE, 1, 6, 6); Ink.stroke(x, close(TEE), { w: 2.6, seed: 7 }); pen(x, arc(610, 146, 18, 12, 0.1, Math.PI - 0.1, 10), { w: 2 });
      // torch body (points up-left at the left lens)
      x.save(); x.translate(452, 262); x.rotate(-2.55);
      const tb = [[-40, -12], [16, -12], [26, -20], [40, -20], [40, 20], [26, 20], [16, 12], [-40, 12]]; paper(x, tb); Ink.hatchFill(x, tb.slice(0, 2).concat(tb.slice(6)), 1, B, 1.3); Ink.stroke(x, close(tb), { w: 2.4, seed: 9 });
      Ink.stroke(x, geo.rect(-18, -6, 16, 12, 3), { w: 1.6, seed: 10, retrace: false });
      x.restore();
    }); };
    build(); S.onFonts = build;
    const uv = () => clamp((u - 0.2) / 0.6);
    S.render = (dt, t) => {
      const x = S.ctx; let busy = drag;
      const U = uv(), ind = 1 - sstep(0.08, 0.3, u), sun = sstep(0.55, 0.9, u), cl = sstep(0.2, 0.4, u) * (1 - sstep(0.6, 0.85, u));
      // sky: sun, cloud; or a ceiling with a lamp
      if (u > 0.2) { const sa = clamp((u - 0.2) / 0.3);
        x.save(); x.fillStyle = `rgba(255,214,40,${0.2 + 0.7 * sun})`; x.beginPath(); x.arc(770, 70, 28, 0, 7); x.fill(); x.restore();
        pen(x, geo.ellipse(770, 70, 28, 28), { w: 2.4, a: sa * 0.9, wob: false });
        if (sun > 0.05) for (let i = 0; i < 12; i++) { const a = (i / 12) * 6.283 + t * 0.12, r1 = 36 + (i % 2 ? 12 : 22) * sun; pen(x, [[770 + Math.cos(a) * 36, 70 + Math.sin(a) * 36], [770 + Math.cos(a) * r1, 70 + Math.sin(a) * r1]], { w: 2.4, a: sun, wob: false }); }
        if (cl > 0.03) { const C = arc(700, 92, 30, 22, Math.PI * 0.5, Math.PI * 1.5, 10).concat(arc(735, 66, 34, 28, Math.PI, Math.PI * 1.9, 10), arc(790, 70, 36, 30, Math.PI * 1.2, Math.PI * 2.1, 10), arc(826, 94, 24, 20, -Math.PI * 0.5, Math.PI * 0.5, 10));
          x.save(); x.globalAlpha = cl; paper(x, C); x.globalCompositeOperation = 'multiply'; Ink.hatchFill(x, C, 1, B, 0.6); pen(x, close(C), { w: 2.4, wob: false }); x.restore(); }
        if (sun > 0.3) busy = true;
      }
      if (ind > 0.03) { x.save(); x.globalAlpha = ind; pen(x, [[14, 22], [846, 22]], { w: 3, seed: 2 }); pen(x, [[14, 22], [14, GND]], { w: 3, seed: 3 }); pen(x, [[846, 22], [846, GND]], { w: 3, seed: 4 });
        pen(x, [[330, 22], [330, 50]], { w: 2, wob: false }); pen(x, [[306, 74], [318, 50], [342, 50], [354, 74], [306, 74]], { w: 2.4, wob: false }); x.restore(); }
      // lag: lenses darken fairly fast and clear slowly
      [0, 1].forEach((i) => { const tg = Math.max(U, torch && i === 0 ? 1 : 0); if (Math.abs(tg - dark[i]) > 0.004) { dark[i] += clamp(tg - dark[i], -dt * 0.45, dt * 1.1); busy = true; } });
      if (Math.abs(U - shirt) > 0.004) { shirt += clamp(U - shirt, -dt * 0.45, dt * 1.1); busy = true; }
      if (u > 0.85 && dark[1] > 0.85) { beenOut = true; api.mark('sun'); if (!api.had('back')) api.say('Out in the sun the lenses <b>went dark</b> and a pattern <b>appeared</b> on the white T-shirt. Now slide back indoors and wait.'); }
      if (beenOut && u < 0.1 && dark[1] < 0.12 && !torch) { api.mark('back'); if (!api.had('torch')) api.say('Indoors again, the lenses slowly <b>cleared</b> and the pattern <b>faded away</b>. Now tap the UV torch.'); }
      if (torch && u < 0.2 && dark[0] > 0.85) { api.mark('torch'); api.say('Indoors, the lens in the <b>UV beam</b> went dark. The other lens, out of the beam, stayed clear. The torch gives out UV light but hardly any heat.'); }
      // UV beam
      if (torch) { const bm = [[424, 240], [410, 258], [236, 240], [150, 172], [164, 160]]; fill(x, [[424, 240], [410, 258], [152, 244], [152, 168]], 'rgba(150,70,230,.28)'); void bm; busy = true;
        for (let i = 0; i < 4; i++) { const q = ((t * 0.9 + i / 4) % 1); pen(x, [[lerp(416, 160, q), lerp(250, 196 + (i - 1.5) * 16, q)], [lerp(416, 160, Math.min(1, q + 0.06)), lerp(250, 196 + (i - 1.5) * 16, Math.min(1, q + 0.06))]], { w: 2.4, color: [130, 50, 210], wob: false }); } }
      S.blit(stat, 0, 0);
      // T-shirt pattern
      if (shirt > 0.02) { fill(x, STAR, `rgba(200,40,170,${0.75 * shirt})`); pen(x, close(STAR), { w: 2.2, color: [150, 20, 130], a: shirt, wob: false }); }
      // glasses on a little stand
      [[152, 168], [262, 168]].forEach(([lx, ly], i) => { const L = geo.rect(lx, ly, 92, 72, 22); paper(x, L); if (dark[i] > 0.02) fill(x, L, `rgba(24,34,100,${0.82 * dark[i]})`); Ink.stroke(x, L, { w: 3, seed: 21 + i });
        if (dark[i] < 0.6) { pen(x, [[lx + 18, ly + 44], [lx + 40, ly + 16]], { w: 1.4, a: 0.5 * (1 - dark[i]), wob: false }); pen(x, [[lx + 30, ly + 50], [lx + 46, ly + 30]], { w: 1.2, a: 0.4 * (1 - dark[i]), wob: false }); } });
      pen(x, arc(253, 196, 10, 12, Math.PI, Math.PI * 2, 10), { w: 3 });
      Ink.stroke(x, [[152, 190], [130, 178], [120, 230]], { w: 2.4, seed: 23 }); Ink.stroke(x, [[354, 190], [376, 178], [386, 230]], { w: 2.4, seed: 24 });
      Ink.stroke(x, [[253, 240], [253, GND - 2]], { w: 2.6, seed: 25 }); Ink.stroke(x, [[218, GND - 2], [288, GND - 2]], { w: 4, seed: 26 });
      // labels + slider
      text(x, 'indoors', SL.x0 - 4, 326, { align: 'left' }); text(x, 'cloudy', (SL.x0 + SL.x1) / 2, 326); text(x, 'sunny', SL.x1 + 4, 326, { align: 'right' });
      text(x, 'UV torch', 478, 296 - 2 + 30, { size: 22 });
      knob(x, lerp(SL.x0, SL.x1, u), SL.y);
      if (!moved) hint(x, 'drag!', SL.x0 + 62, SL.y + 8);
      if (!api.had('torch') && !torch) hint(x, 'tap', 500, 262);
      return busy;
    };
    const setU = (px) => { const nu = clamp((px - SL.x0) / (SL.x1 - SL.x0)); if (Math.round(nu * 8) !== Math.round(u * 8)) Book.sfx('tick', { gain: 0.25 }); u = nu; moved = true; };
    const onSl = (px, py) => py > 304 && px < 440;
    S.c.addEventListener('pointerdown', (e) => { const [px, py] = S.pos(e); if (onSl(px, py)) { drag = true; try { S.c.setPointerCapture(e.pointerId); } catch (er) {} setU(px); e.preventDefault(); S.go(); } });
    S.c.addEventListener('pointermove', (e) => { if (drag) { setU(S.pos(e)[0]); S.go(); } });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((ev) => S.c.addEventListener(ev, () => { drag = false; S.go(); }));
    S.c.addEventListener('click', (e) => { const [px, py] = S.pos(e); if (onSl(px, py)) return; if (px > 380 && px < 540 && py > 190) { torch = !torch; Book.sfx('click', { gain: 0.5 }); S.go(); } });
  }

  // ======================================================================================
  // one lab: (ui.predict above) → test → two conclusion questions → notes
  // ======================================================================================
  function Lab(ui, cfg) {
    const el = ui.el, esc = Book.esc, got = (id) => Book.state.items[id];
    const pred = ui.predict({ id: cfg.predId, label: cfg.predLabel, q: '<b>Predict:</b> ' + cfg.predQ, options: cfg.predOpts, onPick: () => { show(); S.go(); } });
    const lab = el('div', 'sp3-lab'); requestAnimationFrame(() => Ink.frame(lab, { shadow: false, w: 2.2 }));
    el('div', 'sp3-step', cfg.step, lab); el('p', 'sp3-task', cfg.task, lab);
    const cvw = el('div', 'sp3-cvw', '', lab), S = Stage(cvw, W, HH, 'pan-y');
    const ctl = el('div', 'sp3-ctl', '', lab), list = el('div', 'sp3-list', '', lab), say = el('p', 'sp3-say', '', lab);
    const conc = el('div', 'sp3-conc', '', lab);
    const notes = ui.box(`<div class="sp3-notes"><p class="sp3-locked">🔒 Finish the ${cfg.short} lab to unlock these notes.</p></div>`, { tag: 'Notes: ' + cfg.name });

    const r = ui.record(cfg.id, { label: cfg.label, type: 'experiment', max: cfg.qs.length });
    const prev = r.get() || {};
    const st = { tests: (prev.tests || []).slice(), readings: (prev.readings || []).slice(), picks: (prev.picks || cfg.qs.map(() => ({ t: '', ok: false, tries: 0 }))).map((p) => Object.assign({}, p)) };
    const allOK = () => st.picks.every((p) => p.ok);
    const groupDone = (g) => (g.keys ? g.keys.every((k) => st.tests.includes(k)) : g.done(st));
    const needAll = () => cfg.tests.every(groupDone);
    const commit = () => {
      const any = st.picks.some((p) => p.tries), score = st.picks.filter((p) => p.ok).length;
      r.set({ answer: `tests done ${cfg.tests.filter(groupDone).length}/${cfg.tests.length}` + (cfg.readText && st.readings.length ? '; readings: ' + cfg.readText(st.readings) : '')
        + st.picks.map((p, i) => (p.tries ? `; ${cfg.qs[i].short}: "${p.t}" ${p.ok ? '✓' : '✗'}${p.tries > 1 ? ' (try ' + p.tries + ')' : ''}` : '')).join(''),
        correct: any ? allOK() : null, score, max: cfg.qs.length, mis: st.picks.map((p, i) => (p.tries && !p.ok ? p.mis || cfg.qs[i].mis : '')).filter(Boolean).join(','),
        tests: st.tests.slice(), readings: st.readings.slice(), picks: st.picks.map((p) => Object.assign({}, p)) });
    };
    const show = () => {
      const on = !!got(cfg.predId);
      list.innerHTML = cfg.tests.map((g) => `<b>${groupDone(g) ? '☑' : '☐'}</b> ${g.name}`).join(' &nbsp; ');
      cvw.classList.toggle('locked', !on); ctl.style.display = on ? '' : 'none';
      if (!on) say.innerHTML = '<span class="small red">Make your prediction first: then the lab unlocks.</span>';
      else if (!say.dataset.said) say.innerHTML = needAll() ? '<span class="small">All tests done. You can still play with the lab.</span>' : '<span class="small">' + cfg.start + '</span>';
      if (needAll()) conc.classList.add('on');
      if (st.tests.length || st.readings.length) pred.querySelectorAll('.opt').forEach((b) => (b.disabled = true));
      cfg.onShow && cfg.onShow(api, ctl);
    };
    const api = {
      had: (k) => st.tests.includes(k), readings: () => st.readings,
      mark(k) { if (st.tests.includes(k)) return; st.tests.push(k); if (!allOK()) commit(); if (needAll()) Book.sfx('paper', { gain: 0.4 }); show(); },
      say(html) { say.dataset.said = '1'; say.innerHTML = html; },
      addReading(rd) { st.readings.push(rd); if (st.readings.length > 6) st.readings.shift(); if (!allOK()) commit(); if (needAll()) Book.sfx('paper', { gain: 0.4 }); show(); },
    };
    // the conclusion questions, one after the other
    const qEls = cfg.qs.map((q, i) => {
      const d = el('div', '', '', conc); el('p', 'sp3-q', q.q, d); const row = el('div', 'opts', '', d), fb = el('div', 'fb', '', d); fb.style.marginBottom = '8px';
      const btns = Book.shuffle(q.opts, q.seed).map((op) => { const b = el('button', 'opt', esc(op.t), row); b.type = 'button'; b._op = op;
        b.onclick = () => { const p = st.picks[i]; p.t = op.t; p.ok = !!op.ok; p.tries++; p.mis = op.mis || ''; b.classList.add(op.ok ? 'right' : 'wrong'); commit();
          if (op.ok) { Book.sfx('success', { gain: 0.35 }); paint(); } else { Book.sfx('error', { gain: 0.3 }); fb.className = 'fb on bad'; fb.innerHTML = '✗ ' + op.why; } };
        return b; });
      return { d, fb, btns, q };
    });
    function paint() {
      qEls.forEach((Q, i) => {
        const p = st.picks[i]; Q.d.style.display = i === 0 || st.picks[i - 1].ok ? '' : 'none';
        if (p.ok) { Q.btns.forEach((b) => { b.disabled = true; if (b._op.ok) b.classList.add('right'); }); Q.fb.className = 'fb on good'; Q.fb.innerHTML = '✓ ' + Q.q.right; }
      });
      if (allOK()) {
        notes.querySelector('.sp3-notes').innerHTML = cfg.notes;
        const p = (got(cfg.predId) || {}).answer, last = qEls[qEls.length - 1];
        last.fb.innerHTML = '✓ ' + last.q.right + (p ? (p === cfg.predRight ? ' Your prediction was spot on.' : ` You predicted “${esc(p.toLowerCase())}”: the lab has put that right.`) : '') + ' The notes are unlocked below.';
      }
    }
    cfg.scene(S, api); cfg.controls && cfg.controls(ctl, api, el);
    paint(); show(); S.go();
    return { lab, notes };
  }

  // ======================================================================================
  Book.page({ id: 'p03', title: 'Smart pigments', build(ui, root) {
    ui.h('Smart pigments');
    ui.p('A <b>pigment</b> gives a material its colour. Some pigments are <b>smart</b>: mixed into a plastic, an ink or a dye, they change colour by themselves. Two labs. In each: <b>predict</b>, test, then say what you found.');

    // ---------------------------------------------------------------- thermochromic
    let logEl;
    const l1 = Lab(ui, {
      id: 'p03.thermo', predId: 'p03.thermo-predict', name: 'thermochromic pigment', short: 'first', step: 'Lab 1 · the mug, the spoon and the battery tester',
      predLabel: 'Lab 1 prediction: what makes the special mug change colour', label: 'Lab 1 (mug, spoon, tester): readings + what changed the colour + does it change back',
      predQ: 'this mug is printed with a special ink. What will make it change colour?', predRight: 'Pouring in a hot drink',
      predOpts: ['Shining a bright light on it', 'Pouring in a hot drink', 'Getting the outside wet', 'Squeezing it in your hand'],
      task: 'The mug, the baby spoon and the battery tester each contain a special pigment. <b>Drag the slider</b> to warm the tea and the soup, and write down readings. Then <b>press and hold</b> the battery tester.',
      start: 'Drag the temperature, then write down a reading. You need at least <b>3</b>: some cool, some hot.',
      tests: [{ name: '3+ readings, cool and hot', done: (s) => { const ts = s.readings.map((q) => q.T); return ts.length >= 3 && Math.min(...ts) <= 35 && Math.max(...ts) >= 55; } }, { name: 'press the battery tester', keys: ['tester'] }],
      readText: (rs) => rs.slice().sort((a, b) => a.T - b.T).map((q) => `${q.T} °C mug ${q.mug}, spoon ${q.spoon}`).join(' | '),
      scene: sceneThermo,
      controls(ctl, api, el) {
        const btn = el('button', 'btn', '✎ Write down this reading', ctl); btn.type = 'button'; logEl = el('span', '', '', ctl); logEl.style.cssText = 'display:contents';
        btn.onclick = () => {
          const T = api.temp(), rs = api.readings();
          if (rs.some((q) => Math.abs(q.T - T) < 4)) { Book.toast('Change the temperature first, then take another reading.'); Book.sfx('error', { gain: 0.25 }); return; }
          Book.scribble(0.2); api.addReading({ T, mug: word(MUG(T), 'dark', 'picture shows'), spoon: word(SPOON(T), 'red', 'white') });
          const ts = api.readings().map((q) => q.T);
          if (ts.length >= 3 && !(Math.min(...ts) <= 35 && Math.max(...ts) >= 55)) Book.toast(Math.max(...ts) < 55 ? 'Good. Now try something much hotter too.' : 'Good. Now try something much cooler too.');
        };
      },
      onShow(api) { if (logEl) logEl.innerHTML = api.readings().slice().sort((a, b) => a.T - b.T).map((q) => `<span class="sp3-read"><b>${q.T} °C</b><i>mug ${q.mug}</i><i>spoon ${q.spoon}</i></span>`).join(''); },
      qs: [
        { short: 'cause', seed: 4, mis: 'stimulus-mixup', q: 'What made the mug, the spoon and the tester strip <b>change colour</b>?', right: 'A change in temperature. Each pigment flipped as it warmed past a certain temperature.',
          opts: [
            { t: 'A change in their temperature', ok: true },
            { t: 'A change in the light level', why: 'The light never changed. Look at your readings: what was different each time a colour flipped?' },
            { t: 'The force of being pressed', why: 'Pressing the tester only let a current flow, and the current warmed the strip. Nobody pressed the mug or the spoon.' },
            { t: 'Getting wet from the liquid', why: 'The mug and the spoon were just as wet at 20 °C, and nothing changed. What did the slider alter?' },
          ] },
        { short: 'reversible?', seed: 6, mis: 'smart-meaning', q: 'When the tea, the soup and the strip <b>cooled down again</b>, the colours…', right: 'They changed back: the change is reversible.',
          opts: [
            { t: 'changed back to how they began', ok: true },
            { t: 'stayed changed for good', why: 'Slide the temperature back down and watch the mug and the spoon. And what did the tester do when you let go?' },
            { t: 'changed to a third, new colour', why: 'There are only two states. Slide the temperature back down and watch which one returns.' },
          ] },
      ],
      notes: `<p><span class="key">Thermochromic pigment</span>: its <b>colour changes with temperature</b> (heat). It <b>changes back</b> when it cools.</p>
        <p><b>Uses:</b> kettles, baby spoons and bath toys that show if something is too hot, battery testers, forehead thermometer strips, mugs and novelty clothing, food packaging that shows when a drink is cold enough.</p>`,
    });

    // ---------------------------------------------------------------- photochromic
    const l2 = Lab(ui, {
      id: 'p03.photo', predId: 'p03.photo-predict', name: 'photochromic pigment', short: 'second', step: 'Lab 2 · the glasses and the T-shirt',
      predLabel: 'Lab 2 prediction: when the special lenses go dark', label: 'Lab 2 (glasses, T-shirt, UV torch): what changed the colour + does it change back',
      predQ: 'these glasses have special lenses. When will the lenses go dark?', predRight: 'When you walk out into sunlight',
      predOpts: ['When they warm up on your face', 'When you walk out into sunlight', 'When you switch on a battery', 'When the room around goes dark'],
      task: 'The lenses and the print on the white T-shirt contain a different pigment. <b>Drag the slider</b> from indoors out into the sun and back again. Then stay indoors and <b>tap the UV torch</b>.',
      start: 'Drag the slider all the way to sunny and watch the lenses and the T-shirt.',
      tests: [{ name: 'out into the sun', keys: ['sun'] }, { name: 'back indoors (wait)', keys: ['back'] }, { name: 'UV torch indoors', keys: ['torch'] }],
      scene: scenePhoto,
      qs: [
        { short: 'cause', seed: 3, mis: 'stimulus-mixup', q: 'What made the lenses and the T-shirt print <b>change</b>?', right: 'UV light. Sunlight is full of it, and so is the beam from the torch.',
          opts: [
            { t: 'UV light, such as sunlight', ok: true },
            { t: 'Heat, such as a warm day', why: 'The torch is not hot, yet the lens in its beam went dark indoors. It is the light that matters, not the warmth.' },
            { t: 'Cold air from out of doors', why: 'The torch darkened a lens indoors, with no change in the air. What does a UV torch give out?' },
            { t: 'A battery inside the frame', mis: 'smart-meaning', why: 'There is no battery anywhere: the pigment reacts by itself. What reached the lenses outside, and from the torch?' },
          ] },
        { short: 'reversible?', seed: 8, mis: 'smart-meaning', q: 'Back indoors, <b>away from the light</b>, the lenses…', right: 'They cleared again: the change is reversible.',
          opts: [
            { t: 'slowly went clear once more', ok: true },
            { t: 'stayed dark from then on', why: 'Slide back to indoors, switch the torch off and wait a few seconds. Watch the lenses.' },
            { t: 'went even darker than before', why: 'Slide back to indoors, switch the torch off and wait a few seconds. Do the lenses get darker or lighter?' },
          ] },
      ],
      notes: `<p><span class="key">Photochromic pigment</span>: its <b>colour changes with light</b> (UV / sunlight). It <b>darkens in bright light</b> and clears when the light goes.</p>
        <p><b>Uses:</b> lenses in glasses that darken outside (reactions lenses), T-shirts and nail varnish that change colour in sunlight, security printing, window glass.</p>`,
    });

    // ---------------------------------------------------------------- is it smart?
    ui.h('Is it smart?', { size: 40 });
    ui.p('Both pigments are <b>smart</b>: they react <b>by themselves</b> to a change around them, and they can <b>change back</b>. Judge these six. One go each!');
    const CASES = [
      { k: 'mood ring', t: 'A mood ring that changes colour as your finger warms it', smart: true, why: 'Smart: the ring reacts to temperature by itself and changes back when it cools.' },
      { k: 'LED lamp', t: 'An LED lamp that changes colour when you press its remote', smart: false, why: 'Not smart: it only changes because it is powered and controlled by electronics.' },
      { k: 'melting chocolate', t: 'A chocolate bar that melts in a hot car', smart: false, why: 'Not smart: it just melts. It does not turn itself back into the same bar.' },
      { k: 'sunlight nail varnish', t: 'Nail varnish that turns pink in sunlight and clear again indoors', smart: true, why: 'Smart: it reacts to light by itself, and the change reverses.' },
      { k: 'traffic light', t: 'A traffic light changing from red to green', smart: false, why: 'Not smart: the lamps are powered and switched by a controller.' },
      { k: 'colour-change kettle', t: 'A kettle body that changes colour as the water heats, and back as it cools', smart: true, why: 'Smart: it reacts to temperature by itself, and the change reverses.' },
    ];
    const rS = ui.record('p03.smart', { label: 'Is it smart? 6 quick cases (smart / not smart)', type: 'custom', max: 6 });
    const picks = ((rS.get() || {}).picks || CASES.map(() => null)).slice();
    const smartAct = ui.el('div', 'act'); smartAct.dataset.id = 'p03.smart'; requestAnimationFrame(() => Ink.frame(smartAct, { shadow: false, w: 2.2 }));
    const tally = ui.el('div', 'fb', '', null);
    CASES.forEach((c, i) => {
      const row = ui.el('div', 'sp3-case', '', smartAct); ui.el('div', 'tx', `<b>${i + 1}.</b> ${c.t}`, row);
      const bt = ui.el('div', 'bt', '', row), why = ui.el('div', 'why', '', row); why.style.display = 'none';
      const bs = [['Smart', true], ['Not smart', false]].map(([t, v]) => { const b = ui.el('button', 'opt', t, bt); b.type = 'button'; b._v = v; b.onclick = () => { if (picks[i] != null) return; picks[i] = v; Book.sfx(v === c.smart ? 'success' : 'error', { gain: 0.3 }); paintCase(); saveCases(); }; return b; });
      const paintCase = () => { if (picks[i] == null) return; const ok = picks[i] === c.smart; bs.forEach((b) => { b.disabled = true; if (b._v === c.smart) b.classList.add('right'); else if (b._v === picks[i]) b.classList.add('wrong'); });
        why.style.display = ''; why.className = 'why ' + (ok ? 'green' : 'red'); why.textContent = (ok ? '✓ ' : '✗ ') + c.why; };
      paintCase();
    });
    smartAct.appendChild(tally);
    const paintTally = () => { const n = picks.filter((p) => p != null).length, sc = picks.filter((p, i) => p === CASES[i].smart).length; if (n === 6) { tally.className = 'fb on ' + (sc === 6 ? 'good' : 'bad'); tally.textContent = `${sc}/6. Smart means: reacts by itself to its surroundings, and the change reverses. Powered, controlled or one-way changes do not count.`; } };
    function saveCases() {
      const n = picks.filter((p) => p != null).length, sc = picks.filter((p, i) => p === CASES[i].smart).length, wrong = picks.some((p, i) => p != null && p !== CASES[i].smart);
      rS.set({ answer: CASES.map((c, i) => (picks[i] == null ? '' : `${i + 1} ${c.k}: ${picks[i] ? 'smart' : 'not smart'} ${picks[i] === c.smart ? '✓' : '✗'}`)).filter(Boolean).join('; '),
        correct: n === 6 ? sc === 6 : null, score: sc, max: 6, mis: wrong ? 'smart-meaning' : '', picks: picks.slice() });
      paintTally();
    }
    paintTally();

    // ---------------------------------------------------------------- uses
    ui.h('Which pigment?', { size: 40 });
    ui.p('Match each product to the pigment it needs, and why. <span class="small">The labs and notes blur while you match: recall them!</span>');
    const hide = [l1.notes, l2.notes, l1.lab, l2.lab];
    const m = ui.match({ id: 'p03.uses', label: 'Match 6 products to thermochromic / photochromic pigment', q: 'Tap a product, then tap the pigment that suits it.',
      pairs: [
        ['Baby feeding spoon', 'thermochromic: warns that food is too hot', 'stimulus-mixup'],
        ['Glasses for indoors and out', 'photochromic: lenses darken in sunlight', 'stimulus-mixup'],
        ['Battery tester strip', 'thermochromic: a current warms the strip', 'stimulus-mixup'],
        ['Security mark on a ticket', 'photochromic: shows up under UV light', 'stimulus-mixup'],
        ['Label on a drinks can', 'thermochromic: shows it is chilled enough', 'stimulus-mixup'],
        ['Self-tinting window glass', 'photochromic: shades the room on bright days', 'stimulus-mixup'],
      ] });
    const mDone = () => { const it = Book.state.items['p03.uses']; return !!it && (it.correct === true || it.correct === false); };
    const lock = (on) => hide.forEach((e) => e.classList.toggle('peek-lock', on));
    m.addEventListener('pointerdown', () => { if (!mDone()) lock(true); }, { passive: true });
    m.addEventListener('click', () => setTimeout(() => { if (mDone()) lock(false); }, 60));
  } });
})();
