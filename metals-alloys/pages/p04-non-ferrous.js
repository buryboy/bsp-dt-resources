// Page 4 — Non-ferrous metals. A test bench for aluminium, copper, tin and zinc (with a steel block to compare):
// weigh same-size blocks, melt them, measure conductivity, leave them out in the rain for a year.
// Each test: predict -> test (the student operates the pen-drawn rig) -> conclude. Notes unlock after all four.
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

  // densities (g/cm3) and melting points (deg C) are from CONTENT.md; cond = illustrative conductivity score (copper = 100)
  const M = {
    al: { n: 'aluminium', d: 2.7, mp: 660, cond: 61, wash: 'rgba(176,186,200,.30)' },
    cu: { n: 'copper', d: 8.9, mp: 1083, cond: 100, wash: 'rgba(200,112,66,.42)' },
    sn: { n: 'tin', d: 7.3, mp: 232, cond: 15, wash: 'rgba(214,214,206,.34)' },
    zn: { n: 'zinc', d: 7.1, mp: 420, cond: 28, wash: 'rgba(140,160,196,.40)' },
    st: { n: 'steel', d: 7.8, cond: 12, wash: 'rgba(120,126,146,.44)' },
  };
  const VOL = 10;                                             // every block is 10 cm3
  const mass = (k) => Math.round(M[k].d * VOL);

  if (!document.getElementById('ma4-css')) {
    const s = document.createElement('style'); s.id = 'ma4-css';
    s.textContent = `
      .ma4-lab { position: relative; margin: 0 0 calc(var(--R) * 1); padding: 12px 16px 16px; background: rgba(251,250,245,.9); }
      .ma4-lab > * { position: relative; }
      .ma4-step { font: 700 14px Fredoka, system-ui; letter-spacing: .08em; text-transform: uppercase; color: var(--red); line-height: 22px; }
      .ma4-task { font-size: 19px; line-height: 1.5; margin: 0 0 8px; }
      .ma4-task b, .ma4-q b { font-family: Fredoka, system-ui; font-weight: 600; }
      .ma4-q { font-size: 19px; line-height: 1.5; margin: 6px 0 8px; }
      .ma4-btns { display: flex; flex-wrap: wrap; gap: 10px; align-items: stretch; margin: 0 0 8px; }
      .ma4-btns .opt { flex: 1 1 130px; text-align: center; min-height: 52px; }
      .ma4-cv { display: block; width: 100%; height: auto; touch-action: pan-y; user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; cursor: pointer; }
      .ma4-status { font-size: 17px; line-height: 1.5; min-height: 26px; margin: 2px 0 4px; }
      .ma4-status b { font-family: Fredoka, system-ui; font-weight: 600; }
      .ma4-conc { display: none; margin-top: 6px; padding-top: 6px; border-top: 2px dashed rgba(30,46,150,.3); }
      .ma4-conc.on { display: block; }
      .ma4-locked { font-size: 17px; opacity: .75; margin: 0; }
      .ma4-notes { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 6px 22px; }
      .ma4-notes > div { font-size: 17px; line-height: 1.5; }
      .ma4-notes h4 { font: 700 20px Fredoka, system-ui; margin: 0; color: var(--ink); }
      .act[data-id="p04.uses"] .buckets { grid-template-columns: repeat(4, 1fr); }
      @media (max-width: 900px) { .act[data-id="p04.uses"] .buckets { grid-template-columns: repeat(2, 1fr); } }
      .ma4-notes i { font-style: normal; color: var(--red); font-family: Fredoka, system-ui; font-weight: 600; }
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
  // a little metal block drawn in 3D: front face, top and right side. o.tint adds an extra wash, o.seed keeps lines steady
  function block(x, cx, by, k, o = {}) {
    const w = o.w || 64, h = o.h || 44, d = o.d || 13, x0 = cx - w / 2, y0 = by - h;
    const F = geo.rect(x0, y0, w, h, 3), T = [[x0, y0], [x0 + d, y0 - d], [x0 + w + d, y0 - d], [x0 + w, y0]], Sd = [[x0 + w, y0], [x0 + w + d, y0 - d], [x0 + w + d, by - d], [x0 + w, by]];
    const sd = o.seed || 11;
    paper(x, F); paper(x, T); paper(x, Sd);
    [F, T, Sd].forEach((P) => wash(x, P, M[k].wash));
    if (o.tint) [F, T, Sd].forEach((P) => wash(x, P, o.tint));
    Ink.hatchFill(x, Sd, 1, B, 1.3);
    if (o.hatch) Ink.hatchFill(x, F, o.hatch, o.hatchCol || B, o.hatchDen || 1);
    Ink.stroke(x, F, { w: 2.6, seed: sd }); Ink.stroke(x, [...T, T[0]], { w: 2.2, seed: sd + 3, retrace: false }); Ink.stroke(x, Sd.slice(1), { w: 2.2, seed: sd + 5, retrace: false });
    return { F, T, Sd };
  }
  function slider(x, sl, l0, l1) {
    Ink.stroke(x, [[sl.x0, sl.y], [sl.x1, sl.y]], { w: 3.2, seed: 41 });
    for (let i = 0; i <= 12; i++) { const px = lerp(sl.x0, sl.x1, i / 12); Ink.stroke(x, [[px, sl.y - (i % 3 ? 6 : 11)], [px, sl.y + (i % 3 ? 6 : 11)]], { w: 1.6, seed: 50 + i, retrace: false }); }
    text(x, l0, sl.x0 - 28, sl.y + 8, { size: 22, align: 'right' }); text(x, l1, sl.x1 + 28, sl.y + 8, { size: 22 });
  }
  function knob(ctx, sl, v, hot) {
    const kx = lerp(sl.x0, sl.x1, clamp(v)), K = geo.ellipse(kx, sl.y, 19, 19);
    paper(ctx, K); Ink.hatchFill(ctx, K, 1, hot ? RD : B, 1.3); Ink.stroke(ctx, K, { w: 3, color: hot ? RD : B, seed: 77 });
  }
  const onSlider = (sl, x, y) => Math.abs(y - sl.y) < 46 && x > sl.x0 - 44 && x < sl.x1 + 44;

  // ---------- a canvas with a cached static layer and a loop that only runs while something moves ----------
  function Stage(parent, HH) {
    const c = document.createElement('canvas'); c.className = 'ma4-cv'; parent.appendChild(c);
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
  // (a) the balance: same-size blocks, tap one to weigh it
  // ======================================================================================
  function sceneWeigh(api) {
    const S = api.S, ORDER = ['cu', 'al', 'st', 'sn', 'zn'], HX = (i) => 66 + i * 112, BY = 168, PAN = [738, 122];
    const pos = {}, seen = {}; ORDER.forEach((k) => (pos[k] = 0)); let on = null, shown = 0;
    const count = () => ORDER.filter((k) => seen[k]).length;
    const say = () => api.status(count() >= 5 ? 'All five weighed.' : count() ? `Weighed <b>${count()} of 5</b>. Tap the next block.` : '👆 <b>Tap a block</b> to put it on the balance. Weigh all five.');
    say();
    return {
      h: 256,
      paint(x) {
        Ink.stroke(x, [[14, BY + 2], [600, BY + 2]], { w: 2.6, seed: 3 });
        text(x, 'five blocks, all exactly the same size', 290, 30, { font: 'hand', size: 22, align: 'center' });
        ORDER.forEach((k, i) => text(x, M[k].n, HX(i), BY + 34, { size: 22, align: 'center' }));
        // the balance: pan, stem, body with a display
        Ink.stroke(x, [[652, PAN[1] + 4], [824, PAN[1] + 4]], { w: 4.5, seed: 7 });
        Ink.stroke(x, [[738, PAN[1] + 6], [738, BY - 18]], { w: 4, seed: 9 });
        const body = geo.rect(644, BY - 18, 188, 72, 10);
        Ink.hatchShadow(x, body, 1, 7, 7); paper(x, body); Ink.stroke(x, body, { w: 3, seed: 12 });
        const disp = geo.rect(662, BY - 6, 152, 48, 6); paper(x, disp, 'rgba(232,238,226,.95)'); Ink.stroke(x, disp, { w: 2.2, seed: 15 });
        text(x, 'balance', 738, BY + 80, { font: 'hand', size: 22, align: 'center' });
      },
      draw(ctx, t, dt) {
        let more = false;
        ORDER.forEach((k, i) => {
          const tg = on === k ? 1 : 0;
          if (pos[k] !== tg) {
            pos[k] = clamp(pos[k] + Math.sign(tg - pos[k]) * dt / 0.42); more = true;
            if (pos[k] === 1) { Book.sfx('thud', { gain: 0.4 }); if (!seen[k]) { seen[k] = 1; say(); if (count() >= 5) api.ready(); } }
          }
          const e = ease(pos[k]);
          block(ctx, lerp(HX(i), PAN[0], e), lerp(BY, PAN[1], e) - Math.sin(e * Math.PI) * 46, k, { seed: 20 + i * 9 });
          if (seen[k]) text(ctx, mass(k) + ' g', HX(i), BY + 68, { font: 'hand', size: 24, align: 'center', color: RD });
        });
        const target = on && pos[on] === 1 ? mass(on) : 0;
        if (Math.abs(target - shown) > 0.4) { shown += (target - shown) * (1 - Math.exp(-dt * 10)); more = true; } else shown = target;
        if (S.live) text(ctx, Math.round(shown) + ' g', 738, BY + 31, { size: 36, align: 'center' });
        else { text(ctx, '– – –', 738, BY + 30, { size: 34, align: 'center', a: 0.5 }); text(ctx, 'predict first!', 738, 74, { font: 'hand', size: 24, align: 'center', color: RD, rot: -0.04 }); }
        return more;
      },
      down(x, y) {
        const i = Math.round((x - 66) / 112);
        if (i >= 0 && i < 5 && Math.abs(x - HX(i)) < 56 && y > 70 && x < 600) { on = on === ORDER[i] ? null : ORDER[i]; Book.sfx('tick', { gain: 0.4 }); }
        else if (x > 620 && on) { on = null; Book.sfx('tick', { gain: 0.4 }); }
        return false;
      },
      summary: () => 'weighed: ' + ORDER.filter((k) => seen[k]).map((k) => `${M[k].n} ${mass(k)} g`).join(', '),
      finish() { ORDER.forEach((k) => (seen[k] = 1)); say(); },
    };
  }

  // ======================================================================================
  // (b) the hot plate: drag the heat up, watch which metal slumps into a puddle first
  // ======================================================================================
  function sceneMelt(api) {
    const S = api.S, ORDER = ['zn', 'cu', 'sn', 'al'], CX = (i) => 112 + i * 136, SL = { x0: 150, x1: 520, y: 300 }, T0 = 20, T1 = 1200, PY = 212;
    const f = {}, seen = {}; ORDER.forEach((k) => (f[k] = 0)); let T = T0, target = T0;
    const count = () => ORDER.filter((k) => seen[k]).length;
    const say = () => api.status(count() >= 4 ? 'All four have melted.' : count() ? `<b>${count()} of 4</b> melted so far. Keep heating.` : '👉 <b>Drag the heat knob</b> to the right, slowly, and watch the thermometer.');
    say();
    return {
      h: 330,
      paint(x) {
        const slab = geo.rect(36, PY, 564, 18, 4); Ink.hatchShadow(x, slab, 1, 6, 6); paper(x, slab); Ink.stroke(x, slab, { w: 2.8, seed: 4 });
        [70, 566].forEach((px, i) => Ink.stroke(x, [[px, PY + 18], [px, PY + 34]], { w: 4, seed: 6 + i }));
        ORDER.forEach((k, i) => {
          const cx = CX(i);
          Ink.stroke(x, [[cx - 50, PY - 56], [cx - 43, PY - 8], [cx - 36, PY - 1], [cx + 36, PY - 1], [cx + 43, PY - 8], [cx + 50, PY - 56]], { w: 3, seed: 10 + i * 3 });
          text(x, M[k].n, cx, PY + 50, { size: 22, align: 'center' });
        });
        text(x, 'hot plate', 318, 40, { font: 'hand', size: 22, align: 'center' });
        slider(x, SL, '20 °C', '1200 °C');
        text(x, 'thermometer', 742, 34, { font: 'hand', size: 22, align: 'center' });
        const L = geo.rect(650, 44, 184, 70, 8); Ink.hatchShadow(x, L, 1, 6, 6); paper(x, L, 'rgba(232,238,226,.95)'); Ink.stroke(x, L, { w: 2.6, seed: 31 });
      },
      draw(ctx, t, dt) {
        let more = false;
        if (T !== target) { const d = target - T; T += Math.sign(d) * Math.min(Math.abs(d), dt * 1100); more = true; }
        const heat = clamp((T - T0) / (T1 - T0));
        if (heat > 0.02) Ink.hatchFill(ctx, geo.rect(36, PY, 564, 18, 4), 1, RD, 0.6 + heat * 2.6);
        ORDER.forEach((k, i) => {
          const tg = T >= M[k].mp ? 1 : 0;
          if (f[k] !== tg) { f[k] = clamp(f[k] + Math.sign(tg - f[k]) * dt / 0.7); more = true; }
          if (tg && !seen[k]) { seen[k] = 1; Book.sfx('pop', { gain: 0.45 }); say(); if (count() >= 4) api.ready(); }
          const cx = CX(i), e = ease(f[k]), w = lerp(40, 70, e), h = lerp(34, 10, e);
          const P = geo.rect(cx - w / 2, PY - 3 - h, w, h, lerp(3, 5, e));
          paper(ctx, P); wash(ctx, P, M[k].wash);
          if (e > 0.05) { wash(ctx, P, `rgba(230,120,40,${0.3 * e})`); Ink.hatchFill(ctx, P, e, RD, 1.2); }
          Ink.stroke(ctx, P, { w: 2.6, seed: 40 + i * 5, color: e > 0.6 ? RD : B });
          if (e > 0.6) for (let j = 0; j < 3; j++) { const ph = (t * 0.7 + j / 3 + i * 0.2) % 1, sx = cx - 22 + j * 22, sy = PY - 22 - ph * 34; ctx.save(); ctx.globalAlpha = (1 - ph) * 0.8; ctx.strokeStyle = rgba(RD, 0.8); ctx.lineWidth = 1.8; ctx.beginPath(); for (let q = 0; q <= 8; q++) ctx.lineTo(sx + Math.sin(q * 0.9 + t * 3 + j) * 4, sy - q * 3); ctx.stroke(); ctx.restore(); more = true; }
        });
        if (S.live) {
          text(ctx, Math.round(T) + ' °C', 742, 94, { size: 38, align: 'center', color: T > 500 ? RD : B });
          const got = ORDER.filter((k) => seen[k]).sort((a, b) => M[a].mp - M[b].mp);
          if (got.length) text(ctx, 'melted at:', 650, 150, { size: 22 });
          got.forEach((k, j) => text(ctx, `${M[k].n} ${M[k].mp} °C`, 650, 184 + j * 32, { font: 'hand', size: 22, color: RD }));
          knob(ctx, SL, heat, S.drag || T > 500);
        } else { text(ctx, '– – –', 742, 94, { size: 36, align: 'center', a: 0.5 }); text(ctx, 'predict first!', 742, 160, { font: 'hand', size: 24, align: 'center', color: RD, rot: -0.04 }); }
        return more;
      },
      down(x, y) { if (!onSlider(SL, x, y)) return false; this.move(x); return true; },
      move(x) { target = Math.round(lerp(T0, T1, clamp((x - SL.x0) / (SL.x1 - SL.x0)))); },
      summary: () => 'melted: ' + ORDER.filter((k) => seen[k]).sort((a, b) => M[a].mp - M[b].mp).map((k) => `${M[k].n} ${M[k].mp} °C`).join(', '),
      finish() { ORDER.forEach((k) => (seen[k] = 1)); say(); },
    };
  }

  // ======================================================================================
  // (c) the conductivity meter: tap a rod to clip it into the circuit
  // ======================================================================================
  function sceneConduct(api) {
    const S = api.S, ORDER = ['zn', 'st', 'cu', 'sn', 'al'], HX = (i) => 66 + i * 112, RY = 246, GAP = [350, 76];
    const MC = [745, 152], MR = 76, A0 = Math.PI + 0.3, A1 = Math.PI * 2 - 0.3;
    const pos = {}, seen = {}; ORDER.forEach((k) => (pos[k] = 0)); let on = null, shown = 0;
    const count = () => ORDER.filter((k) => seen[k]).length;
    const say = () => api.status(count() >= 5 ? 'All five tested.' : count() ? `Tested <b>${count()} of 5</b>. Tap the next rod.` : '👆 <b>Tap a rod</b> to clip it into the gap in the circuit. Test all five.');
    say();
    const rod = (x, cx, cy, k, sd) => { const P = geo.rect(cx - 44, cy - 8, 88, 16, 4); paper(x, P); wash(x, P, M[k].wash); Ink.stroke(x, P, { w: 2.4, seed: sd }); Ink.stroke(x, [[cx - 36, cy - 3], [cx + 30, cy - 3]], { w: 1.2, seed: sd + 2, retrace: false }); };
    return {
      h: 320,
      paint(x) {
        // battery
        const bat = geo.rect(30, 58, 84, 50, 6); Ink.hatchShadow(x, bat, 1, 6, 6); paper(x, bat); Ink.hatchFill(x, geo.rect(30, 58, 30, 50, 6), 1, B, 1.4); Ink.stroke(x, bat, { w: 2.8, seed: 5 });
        text(x, '+', 96, 92, { size: 26, align: 'center' }); text(x, 'battery', 72, 42, { font: 'hand', size: 22, align: 'center' });
        // top wire with the gap and two clips, bulb, meter; return wire underneath
        Ink.stroke(x, [[114, 76], [282, 76]], { w: 2.8, seed: 8, color: RD });
        Ink.stroke(x, [[418, 76], [506, 76]], { w: 2.8, seed: 9, color: RD });
        [[282, 1], [418, -1]].forEach(([cx, s], i) => { Ink.stroke(x, [[cx, 76], [cx + s * 24, 62], [cx + s * 24, 90], [cx, 76]], { w: 2.6, seed: 12 + i }); });
        Ink.stroke(x, [[554, 76], [650, 76]], { w: 2.8, seed: 14, color: RD });
        Ink.stroke(x, [[650, 140], [72, 140], [72, 108]], { w: 2.8, seed: 16 });
        const base = geo.rect(516, 82, 28, 18, 3); paper(x, base); Ink.hatchFill(x, base, 1, B, 1.6); Ink.stroke(x, base, { w: 2.2, seed: 18 });
        const bulb = geo.ellipse(530, 62, 24, 24); paper(x, bulb); Ink.stroke(x, bulb, { w: 2.6, seed: 20 });
        Ink.stroke(x, [[522, 82], [524, 64], [530, 72], [536, 64], [538, 82]], { w: 1.6, seed: 22, retrace: false });
        text(x, 'the gap', 350, 118, { font: 'hand', size: 22, align: 'center' });
        const box = geo.rect(650, 22, 190, 150, 12); Ink.hatchShadow(x, box, 1, 7, 7); paper(x, box); Ink.stroke(x, box, { w: 3, seed: 25 });
        text(x, 'conductivity', 745, 52, { size: 22, align: 'center' });
        Ink.stroke(x, geo.ellipse(MC[0], MC[1], MR, MR, A0, A1), { w: 2.4, seed: 27 });
        for (let i = 0; i <= 10; i++) { const a = lerp(A0, A1, i / 10), r1 = MR + (i % 5 ? 7 : 13); Ink.stroke(x, [[MC[0] + Math.cos(a) * (MR + 2), MC[1] + Math.sin(a) * (MR + 2)], [MC[0] + Math.cos(a) * r1, MC[1] + Math.sin(a) * r1]], { w: 1.6, seed: 30 + i, retrace: false }); }
        text(x, 'out of 100', 745, 250, { font: 'hand', size: 22, align: 'center' });
        Ink.stroke(x, [[14, RY + 12], [600, RY + 12]], { w: 2.6, seed: 3 });
        ORDER.forEach((k, i) => text(x, M[k].n, HX(i), RY + 42, { size: 22, align: 'center' }));
      },
      draw(ctx, t, dt) {
        let more = false;
        ORDER.forEach((k, i) => {
          const tg = on === k ? 1 : 0;
          if (pos[k] !== tg) {
            pos[k] = clamp(pos[k] + Math.sign(tg - pos[k]) * dt / 0.4); more = true;
            if (pos[k] === 1) { Book.sfx('tick', { gain: 0.5 }); if (!seen[k]) { seen[k] = 1; say(); if (count() >= 5) api.ready(); } }
          }
          const e = ease(pos[k]);
          rod(ctx, lerp(HX(i), GAP[0], e), lerp(RY, GAP[1], e) - Math.sin(e * Math.PI) * 30, k, 60 + i * 7);
          if (seen[k]) text(ctx, String(M[k].cond), HX(i), RY + 72, { font: 'hand', size: 24, align: 'center', color: RD });
        });
        const target = on && pos[on] === 1 ? M[on].cond : 0;
        if (Math.abs(target - shown) > 0.3) { shown += (target - shown) * (1 - Math.exp(-dt * 7)); more = true; } else shown = target;
        const v = shown / 100, a = lerp(A0, A1, S.live ? v : -0.04), tip = [MC[0] + Math.cos(a) * (MR - 8), MC[1] + Math.sin(a) * (MR - 8)];
        ctx.save(); ctx.strokeStyle = rgba(RD, 0.92); ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(MC[0], MC[1]); ctx.lineTo(tip[0], tip[1]); ctx.stroke();
        ctx.fillStyle = rgba(B, 0.95); ctx.beginPath(); ctx.arc(MC[0], MC[1], 7, 0, 7); ctx.fill(); ctx.restore();
        // the bulb glows more with a better conductor
        const n = v < 0.03 ? 0 : 4 + Math.round(v * 8);
        for (let i = 0; i < n; i++) { const an = -Math.PI * 1.15 + (Math.PI * 1.3 * i) / Math.max(1, n - 1), r0 = 30, r1 = 34 + v * 30; Ink.stroke(ctx, [[530 + Math.cos(an) * r0, 62 + Math.sin(an) * r0], [530 + Math.cos(an) * r1, 62 + Math.sin(an) * r1]], { w: 1.4 + v * 1.8, seed: 90 + i, retrace: false, amp: 0.4, color: RD }); }
        if (S.live) text(ctx, String(Math.round(shown)), 745, 218, { size: 38, align: 'center' });
        else { text(ctx, '– – –', 745, 216, { size: 34, align: 'center', a: 0.5 }); text(ctx, 'predict first!', 350, 180, { font: 'hand', size: 24, align: 'center', color: RD, rot: -0.04 }); }
        return more;
      },
      down(x, y) {
        const i = Math.round((x - 66) / 112);
        if (i >= 0 && i < 5 && Math.abs(x - HX(i)) < 56 && y > 196 && x < 600) { on = on === ORDER[i] ? null : ORDER[i]; Book.sfx('pop', { gain: 0.3 }); }
        else if (y < 130 && x > 260 && x < 440 && on) { on = null; Book.sfx('tick', { gain: 0.4 }); }
        return false;
      },
      summary: () => 'meter readings (out of 100): ' + ORDER.filter((k) => seen[k]).sort((a, b) => M[b].cond - M[a].cond).map((k) => `${M[k].n} ${M[k].cond}`).join(', '),
      finish() { ORDER.forEach((k) => (seen[k] = 1)); say(); },
    };
  }

  // ======================================================================================
  // (d) a year outside in the rain: drag the months along
  // ======================================================================================
  function sceneRain(api) {
    const S = api.S, ORDER = ['al', 'st', 'cu', 'sn', 'zn'], BX = (i) => 100 + i * 162, GY = 232, SL = { x0: 230, x1: 630, y: 302 };
    const NOTE = { al: 'a bit duller', st: 'RUST!', cu: 'going green', sn: 'still shiny', zn: 'a bit duller' };
    let v = 0, lastMove = -9, full = false, lastTick = -1;
    const say = () => api.status(full ? 'One year has gone by. Look closely at each block.' : '👉 <b>Drag the knob</b> to let a whole year of weather go by.');
    say();
    return {
      h: 330,
      paint(x) {
        const G = []; for (let px = 14; px <= 846; px += 8) G.push([px, GY + 2 + Math.sin(px * 0.05) * 1.5]); Ink.stroke(x, G, { w: 2.6, seed: 3 });
        for (let px = 24; px < 846; px += 34) Ink.stroke(x, [[px, GY + 2], [px + 5, GY - 9]], { w: 1.4, seed: (px % 50) + 4, retrace: false });
        ORDER.forEach((k, i) => text(x, M[k].n, BX(i), GY + 34, { size: 22, align: 'center' }));
        [[130, 44, 1], [400, 36, 1.2], [650, 46, 0.9]].forEach(([cx, cy, s], i) => {
          const C = [...geo.ellipse(cx - 34 * s, cy + 6, 26 * s, 17 * s, Math.PI * 0.5, Math.PI * 1.5), ...geo.ellipse(cx, cy - 8, 32 * s, 22 * s, Math.PI, Math.PI * 2), ...geo.ellipse(cx + 36 * s, cy + 6, 24 * s, 17 * s, -Math.PI * 0.5, Math.PI * 0.5)];
          C.push(C[0]); Ink.stroke(x, C, { w: 2.4, seed: 8 + i * 3 }); Ink.hatchFill(x, C, 0.7, B, 0.8);
        });
        slider(x, SL, 'new', '1 year');
      },
      draw(ctx, t, dt) {
        const raining = S.live && t - lastMove < 0.9 && v > 0.01 && v < 0.995;
        if (raining) { ctx.save(); ctx.strokeStyle = rgba(B, 0.55); ctx.lineWidth = 1.6; ctx.beginPath(); for (let i = 0; i < 46; i++) { const ph = (t * (1.3 + (i % 5) * 0.12) + i * 0.137) % 1, rx = 30 + ((i * 97) % 800), ry = 70 + ph * 150; ctx.moveTo(rx, ry); ctx.lineTo(rx - 5, ry + 15); } ctx.stroke(); ctx.restore(); }
        ORDER.forEach((k, i) => {
          const cx = BX(i), o = { w: 84, h: 54, d: 15, seed: 30 + i * 9 };
          if (k === 'st') { o.tint = `rgba(176,74,22,${0.62 * v})`; o.hatch = v; o.hatchCol = RD; o.hatchDen = 1.7; }
          else if (k === 'cu') { const g = clamp((v - 0.55) / 0.45); o.tint = g > 0 ? `rgba(70,150,120,${0.34 * g})` : `rgba(110,70,40,${0.25 * v})`; if (g > 0) { o.hatch = g * 0.7; o.hatchCol = GR; o.hatchDen = 0.9; } }
          else if (k !== 'sn') o.tint = `rgba(120,126,140,${0.2 * v})`;
          block(ctx, cx, GY, k, o);
          if (k === 'st' && v > 0.45) { const q = clamp((v - 0.45) / 0.55); [[-26, 0], [6, 1], [30, 2]].forEach(([dx, s]) => Ink.stroke(ctx, [[cx + dx, GY - 2], [cx + dx + 2, GY + 5 + q * 9]], { w: 2.2, color: RD, seed: 70 + s, retrace: false })); }
          if (full) text(ctx, NOTE[k], cx + 6, GY - 86, { font: 'hand', size: 22, align: 'center', color: k === 'st' ? RD : k === 'cu' ? GR : B, rot: -0.03 });
        });
        if (S.live) { text(ctx, v < 0.02 ? 'day 1' : 'month ' + Math.max(1, Math.round(v * 12)), 836, 100, { size: 28, align: 'right' }); knob(ctx, SL, v, S.drag); }
        else text(ctx, 'predict first!', 430, 120, { font: 'hand', size: 24, align: 'center', color: RD, rot: -0.04 });
        return raining || S.drag;
      },
      down(x, y) { if (!onSlider(SL, x, y)) return false; this.move(x); return true; },
      move(x) {
        v = clamp((x - SL.x0) / (SL.x1 - SL.x0)); lastMove = api.stg.time;
        const tk = Math.round(v * 12); if (tk !== lastTick) { lastTick = tk; Book.sfx('tick', { gain: 0.25 }); }
        if (v >= 0.995 && !full) { full = true; say(); api.ready(); }
      },
      summary: () => (full ? 'after 1 year: steel rusted; copper going green; aluminium, tin, zinc not rusted' : 'time-lapse not finished'),
      finish() { full = true; v = 1; say(); },
    };
  }

  // ======================================================================================
  // one test: predict -> operate the rig -> conclusion
  // ======================================================================================
  function Test(ui, cfg, onDone) {
    const el = ui.el, id = 'p04.' + cfg.key;
    const r = ui.record(id, { label: cfg.label, type: 'experiment', max: 1 });
    const lab = el('div', 'ma4-lab'); requestAnimationFrame(() => Ink.frame(lab, { shadow: false, w: 2.2 }));
    el('div', 'ma4-step', cfg.step, lab);
    el('p', 'ma4-task', cfg.task, lab);
    el('div', 'ma4-q', `<b>Predict first.</b> ${cfg.predQ}`, lab);
    const predRow = el('div', 'ma4-btns', '', lab);
    const prev = r.get() || {};
    const S = { live: !!prev.pred, pred: prev.pred || null, drag: false, locked: false, done: false };
    const status = document.createElement('div'); status.className = 'ma4-status';
    const conc = document.createElement('div'); conc.className = 'ma4-conc';
    const api = { S, stg: null, status: (h) => (status.innerHTML = h), ready: () => { if (!conc.classList.contains('on')) { conc.classList.add('on'); Book.sfx('paper', { gain: 0.4 }); } } };
    const sc = cfg.scene(api);
    const stg = (api.stg = Stage(lab, sc.h)); stg.paint = (x) => sc.paint(x); stg.draw = (ctx, t, dt) => sc.draw(ctx, t, dt);
    lab.appendChild(status); lab.appendChild(conc);
    conc.innerHTML = `<div class="ma4-q"><b>What did you find?</b> ${cfg.concQ}</div>`;
    const concRow = el('div', 'ma4-btns', '', conc), fb = el('div', 'fb', '', conc);
    if (!S.live) status.style.visibility = 'hidden';

    const c = stg.c;
    c.addEventListener('pointerdown', (e) => {
      if (!S.live) { Book.toast('Predict first: then the test switches on.'); return; }
      if (!S.locked) { S.locked = true; predBtns.forEach((b) => (b.disabled = true)); }
      const [x, y] = stg.pos(e);
      if (sc.down(x, y)) { S.drag = true; try { c.setPointerCapture(e.pointerId); } catch (er) {} e.preventDefault(); }
      stg.go();
    });
    c.addEventListener('pointermove', (e) => { if (!S.drag) return; const [x, y] = stg.pos(e); sc.move(x, y); stg.go(); });
    const up = () => { if (S.drag) { S.drag = false; stg.go(); } };
    c.addEventListener('pointerup', up); c.addEventListener('pointercancel', up); c.addEventListener('lostpointercapture', up);

    const predBtns = cfg.predOpts.map((t) => {
      const b = el('button', 'opt', t, predRow); b.type = 'button'; if (S.pred === t) b.classList.add('sel');
      b.onclick = () => {
        predBtns.forEach((q) => q.classList.remove('sel')); b.classList.add('sel'); S.pred = t;
        r.set({ answer: `predicted "${t}" (test not finished yet)`, correct: null, pred: t });
        Book.scribble(0.12); if (!S.live) { S.live = true; status.style.visibility = ''; Book.sfx('pop', { gain: 0.5 }); } stg.render(0); stg.go();
      };
      return b;
    });

    const verdict = () => (S.pred === cfg.predRight ? 'Your prediction was spot on.' : `You predicted “${Book.esc(S.pred)}”: the test has put that right.`);
    const concOpts = Book.shuffle(cfg.concOpts, cfg.key.length * 7 + cfg.key.charCodeAt(0));
    const concBtns = concOpts.map((op) => {
      const b = el('button', 'opt', Book.esc(op.t), concRow); b.type = 'button';
      b.onclick = () => {
        const ok = !!op.ok; b.classList.add(ok ? 'right' : 'wrong');
        r.set({ answer: `predicted "${S.pred}"; ${sc.summary()}; concluded "${op.t}" ${ok ? '✓' : '✗'}`, correct: ok, score: ok ? 1 : 0, max: 1, mis: ok ? '' : op.mis || '' });
        if (ok) {
          concBtns.forEach((q) => (q.disabled = true)); Book.sfx('success', { gain: 0.35 });
          fb.className = 'fb on good'; fb.innerHTML = `✓ ${cfg.right} ${verdict()}`;
          S.done = true; predBtns.forEach((q) => (q.disabled = true)); onDone();
        } else { Book.sfx('error', { gain: 0.3 }); fb.className = 'fb on bad'; fb.innerHTML = `✗ ${op.why || 'Look again at your results.'}`; }
      };
      return b;
    });

    stg.init();
    if (prev.correct === true) {                      // restore a finished test
      sc.finish(); S.done = S.locked = true; predBtns.forEach((q) => (q.disabled = true));
      conc.classList.add('on'); concBtns.forEach((q, i) => { q.disabled = true; if (concOpts[i].ok) q.classList.add('right'); });
      fb.className = 'fb on good'; fb.innerHTML = '✓ ' + cfg.right; stg.render(0); onDone(true);
    }
    return lab;
  }

  const NOTES = `<p style="margin:0 0 6px"><span class="key">Non-ferrous metals</span> contain <b>no iron</b>. They are <b>not magnetic</b> and they <b>do not rust</b> (some tarnish or oxidise on the surface).</p>
    <div class="ma4-notes">
      <div><h4>Aluminium</h4>Lightweight (low density: about a third of steel), soft, malleable, ductile, good conductor of heat and electricity, corrosion-resistant (a thin oxide layer protects it), silvery. Melts at 660 °C.<br><i>Uses:</i> drinks cans, kitchen foil, aircraft bodies, window frames, bike frames, saucepans, overhead power cables.</div>
      <div><h4>Copper</h4>Excellent conductor of electricity and heat, very ductile and malleable, corrosion-resistant (slowly turns green: a patina), reddish-brown. Melts at 1083 °C.<br><i>Uses:</i> electrical wire and cables, water pipes, printed circuit boards, saucepan bases, roofing.</div>
      <div><h4>Tin</h4>Soft, weak, very low melting point (232 °C), corrosion-resistant, non-toxic, bright silvery.<br><i>Uses:</i> a thin coating on steel food cans (“tin cans” are tinplate), solder (with other metals).</div>
      <div><h4>Zinc</h4>Corrosion-resistant, low melting point (420 °C), fairly weak and brittle, bluish-grey.<br><i>Uses:</i> galvanising steel (a zinc coating on buckets, gates, crash barriers, wheelbarrows), die-cast parts, batteries.</div>
    </div>`;

  Book.page({ id: 'p04', title: 'Non-ferrous metals', build(ui, root) {
    ui.h('Non-ferrous metals');
    ui.p('<b>Non-ferrous</b> metals contain <b>no iron</b>. You need to know four: <b>aluminium</b>, <b>copper</b>, <b>tin</b> and <b>zinc</b>. So what are they like? Put them on the test bench, with a block of <b>steel</b> to compare.');
    ui.p('Four tests. Each time: <b>predict</b>, run the test with your finger, then say what you found. <span class="small">(Your notes for this page unlock when all four are done.)</span>');

    let done = 0, notes = null;
    const onDone = () => { done++; if (done >= 4 && notes) unlock(); };
    const unlock = () => { notes.querySelector('.ma4-body').innerHTML = NOTES; };

    Test(ui, {
      key: 'weigh', scene: sceneWeigh, step: 'Test 1 · the balance', label: 'Test 1: weigh same-size blocks (density)',
      task: 'Five blocks, all <b>exactly the same size</b>. Does that mean they weigh the same?',
      predQ: 'Which block will be the <b>lightest</b>?', predOpts: ['aluminium', 'copper', 'tin', 'zinc', 'steel'], predRight: 'aluminium',
      concQ: 'Compare the aluminium block with the steel block. The aluminium has about…',
      concOpts: [
        { t: 'a third of the mass', ok: true },
        { t: 'half of the mass', why: 'Close, but look at the two numbers again: how many aluminium blocks would balance one steel block?' },
        { t: 'the same mass', mis: 'nonferrous-mixup', why: 'Same size, but not the same mass. Read the two numbers under the blocks again.' },
        { t: 'double the mass', mis: 'nonferrous-mixup', why: 'Other way round: which of the two numbers is bigger?' },
      ],
      right: 'Same size, far less mass: aluminium has a <b>low density</b>, about a third of steel. Copper was the heaviest block.',
    }, onDone);

    Test(ui, {
      key: 'melt', scene: sceneMelt, step: 'Test 2 · the hot plate', label: 'Test 2: melt test (melting points)',
      task: 'A lump of each non-ferrous metal sits in its own dish on a hot plate. You control the heat.',
      predQ: 'Which metal will <b>melt first</b>?', predOpts: ['aluminium', 'copper', 'tin', 'zinc'], predRight: 'tin',
      concQ: 'Which melted first, and which needed the most heat?',
      concOpts: [
        { t: 'tin first, copper last', ok: true },
        { t: 'zinc first, copper last', mis: 'nonferrous-mixup', why: 'Zinc melted early, but one metal went before it. Check the “melted at” list.' },
        { t: 'tin first, aluminium last', mis: 'nonferrous-mixup', why: 'Right about the first one. But one metal was still solid after the aluminium had melted.' },
        { t: 'aluminium first, tin last', mis: 'nonferrous-mixup', why: 'Look at the “melted at” list: the lowest temperature is the one that melted first.' },
      ],
      right: 'Tin has a very low melting point (232 °C) and zinc a low one (420 °C). Aluminium melts at 660 °C and copper not until 1083 °C.',
    }, onDone);

    Test(ui, {
      key: 'conduct', scene: sceneConduct, step: 'Test 3 · the conductivity meter', label: 'Test 3: electrical conductivity meter',
      task: 'A circuit with a gap in it. Clip a metal rod into the gap: the better it conducts electricity, the higher the meter reads and the brighter the bulb.',
      predQ: 'Which metal will be the <b>best conductor</b> of electricity?', predOpts: ['aluminium', 'copper', 'tin', 'zinc', 'steel'], predRight: 'copper',
      concQ: 'Which two were the best conductors (best one first)?',
      concOpts: [
        { t: 'copper, then aluminium', ok: true },
        { t: 'aluminium, then copper', mis: 'nonferrous-mixup', why: 'The right two metals, but check which one had the higher reading.' },
        { t: 'copper, then zinc', mis: 'nonferrous-mixup', why: 'Right about the best one. Check the readings again for second place.' },
        { t: 'steel, then copper', mis: 'nonferrous-mixup', why: 'Look at the red numbers under the rods: where does steel come?' },
      ],
      right: 'Copper is an <b>excellent conductor</b> of electricity and aluminium is a good one. <span class="small">(The meter numbers are typical scores, with the best conductor here set at 100.)</span>',
    }, onDone);

    Test(ui, {
      key: 'rain', scene: sceneRain, step: 'Test 4 · a year in the rain', label: 'Test 4: one year outside in the rain (corrosion)',
      task: 'All five blocks are left outside for a whole year: rain, air, the lot.',
      predQ: 'After a year, which will have <b>rusted</b>?', predOpts: ['all five of them', 'only the steel', 'steel and copper', 'none of them'], predRight: 'only the steel',
      concQ: 'Only the steel block rusted. What is different about steel?',
      concOpts: [
        { t: 'steel contains iron', ok: true },
        { t: 'steel got much wetter', mis: 'rust-conditions', why: 'All five blocks sat in the same rain and the same air. Think about what steel is made from.' },
        { t: 'steel is the heaviest', mis: 'ferrous-meaning', why: 'It is not (check Test 1), and mass does not cause rust. Think about what steel is made from.' },
        { t: 'steel is a poor conductor', mis: 'ferrous-meaning', why: 'True, but that is not why it rusts. Think about what steel is made from.' },
      ],
      right: 'Rust only forms on metals that contain <b>iron</b>. Non-ferrous metals do not rust: they just go dull (tarnish), and copper slowly turns green (a <b>patina</b>).',
    }, onDone);

    notes = ui.box('<div class="ma4-body"><p class="ma4-locked">🔒 Your notes on aluminium, copper, tin and zinc appear here when you have finished all four tests.</p></div>', { tag: 'Notes' });
    if (done >= 4) unlock();

    ui.p('<b>Which metal for the job?</b> Read the notes first: they will <b>blur</b> as soon as you start sorting.');
    const sort = ui.sort({
      id: 'p04.uses', label: 'Sort 8 products by non-ferrous metal',
      q: 'Tap a product, then tap the metal it is made from (or coated with). Two for each metal.',
      buckets: ['Aluminium', 'Copper', 'Tin', 'Zinc'],
      items: [
        { t: 'kitchen foil', b: 0, mis: 'tin-can' },
        { t: 'aircraft body', b: 0, mis: 'nonferrous-mixup' },
        { t: 'electrical wire', b: 1, mis: 'nonferrous-mixup' },
        { t: 'water pipes', b: 1, mis: 'nonferrous-mixup' },
        { t: 'thin coating inside a steel food can', b: 2, mis: 'tin-can' },
        { t: 'solder', b: 2, mis: 'nonferrous-mixup' },
        { t: 'coating on a galvanised bucket', b: 3, mis: 'galvanise-meaning' },
        { t: 'die-cast parts', b: 3, mis: 'nonferrous-mixup' },
      ],
      explain: 'Aluminium: light. Copper: the best conductor, and good for pipes. Tin: the coating on “tin” cans, and solder. Zinc: galvanising and die-casting.',
    });
    ui.hideWhile(sort, 'p04.uses', [notes]);
  } });
})();
