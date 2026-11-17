// Page 6 — Technical textiles. Four pen-drawn test stations (conductive thread, flame test, Kevlar, micro-capsules):
// predict first, run the tests by touch, then say what you found. The notes for each textile only appear once its
// station is finished; a uses match (stations and notes blurred) ends the page.
(function () {
  'use strict';
  const B = Ink.BLUE, RD = Ink.RED, rgba = Ink.rgba, geo = Ink.geo;
  const LABF = (s) => `600 ${s}px Fredoka, "Arial Rounded MT Bold", system-ui, sans-serif`;
  const HANDF = (s) => `400 ${s}px "Gloria Hallelujah", "Comic Sans MS", cursive`;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const TAU = Math.PI * 2, W = 860;
  const PAPER = 'rgba(251,250,245,.97)', AMBER = [255, 176, 40], GREY = [96, 104, 128];
  const st = (x, pts, o) => Ink.stroke(x, pts, o);
  function text(x, s, px, py, o = {}) {
    x.save(); x.font = (o.font === 'hand' ? HANDF : LABF)(o.size || 22);
    x.fillStyle = rgba(o.color || B, o.a ?? 0.92); x.textAlign = o.align || 'center'; x.textBaseline = 'alphabetic';
    x.translate(px, py); if (o.rot) x.rotate(o.rot); x.fillText(s, 0, 0); x.restore();
  }
  const path = (x, P) => { x.beginPath(); P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.closePath(); };
  // opaque paper (or a tint) painted over what is underneath, so shapes can overlap
  function paper(x, P, style = PAPER) { x.save(); x.globalCompositeOperation = 'source-over'; x.fillStyle = style; path(x, P); x.fill(); x.restore(); }
  const tint = (x, P, style) => { x.save(); x.fillStyle = style; path(x, P); x.fill(); x.restore(); };
  const box = (x0, y0, w, h) => [[x0, y0], [x0 + w, y0], [x0 + w, y0 + h], [x0, y0 + h]];
  const closeP = (P) => P.concat([P[0]]);
  const disc = (x, cx, cy, r, col, a = 0.9) => { x.save(); x.fillStyle = rgba(col, a); x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill(); x.restore(); };
  const glow = (x, cx, cy, r, col, a) => {
    if (a <= 0.01) return; const g = x.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, rgba(col, 0.9 * a)); g.addColorStop(0.5, rgba(col, 0.35 * a)); g.addColorStop(1, rgba(col, 0));
    x.save(); x.fillStyle = g; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill(); x.restore();
  };
  // a row of sewing stitches along a line, sewn as far as p (0..1)
  function stitch(x, pts, p, col, w = 3) {
    if (p <= 0) return; const P = geo.seg(pts, 3), n = Math.max(2, Math.ceil(P.length * clamp(p)));
    x.save(); x.strokeStyle = rgba(col, 0.9); x.lineWidth = w; x.lineCap = 'round'; x.setLineDash([9, 8]);
    x.beginPath(); for (let i = 0; i < n; i++) (i ? x.lineTo(P[i][0], P[i][1]) : x.moveTo(P[i][0], P[i][1])); x.stroke(); x.restore();
  }

  if (!document.getElementById('p06-css')) {
    const s = document.createElement('style'); s.id = 'p06-css';
    s.textContent = `
      .p06-lab { position: relative; margin: 0 0 calc(var(--R) * .6); padding: 12px 16px 16px; background: rgba(251,250,245,.9); }
      .p06-lab > * { position: relative; }
      .p06-step { font: 700 14px Fredoka, system-ui; letter-spacing: .08em; text-transform: uppercase; color: var(--red); line-height: 22px; }
      .p06-task, .p06-q { font-size: 19px; line-height: 1.5; margin: 0 0 8px; }
      .p06-task b, .p06-q b { font-family: Fredoka, system-ui; font-weight: 600; }
      .p06-btns { display: flex; flex-wrap: wrap; gap: 10px; align-items: stretch; margin: 0 0 8px; }
      .p06-btns .opt { flex: 1 1 150px; text-align: center; min-height: 52px; }
      .p06-btns .btn { margin-top: 0; min-height: 50px; touch-action: manipulation; user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; }
      .p06-btns .btn.on { background: var(--ink); color: #fff; }
      .p06-btns .btn.hold { background: #fff; color: var(--red); border: 2px solid var(--red); box-shadow: 0 3px 0 rgba(120,20,26,.3); touch-action: none; }
      .p06-btns .btn.hold.down { transform: translateY(2px); box-shadow: 0 1px 0 rgba(120,20,26,.3); background: #fdeaea; }
      .p06-stage { margin: 0 0 6px; }
      .p06-log { display: flex; flex-wrap: wrap; gap: 6px 8px; align-items: center; min-height: 40px; margin: 2px 0 4px; font-size: 16px; line-height: 1.35; }
      .p06-chip { background: #fff; border: 2px solid rgba(30,46,150,.4); border-radius: 10px; padding: 3px 10px 4px; }
      .p06-chip b { font-family: Fredoka, system-ui; font-weight: 600; }
      .p06-conc { display: none; margin-top: 6px; padding-top: 6px; border-top: 2px dashed rgba(30,46,150,.3); }
      .p06-conc.on { display: block; }
      .p06-conc .opts { grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); }
      .p06-locked { font-size: 17px; opacity: .75; margin: 0; }
      .p06-notes p { margin: 0 0 6px; }
    `;
    document.head.appendChild(s);
  }

  // an interactive canvas with a render loop that sleeps off screen / when the page is hidden
  function Stage(parent, Hh) {
    const c = document.createElement('canvas'); parent.appendChild(c);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = Math.round(W * dpr); c.height = Math.round(Hh * dpr);
    Object.assign(c.style, { width: '100%', height: 'auto', aspectRatio: W + ' / ' + Hh, display: 'block', touchAction: 'pan-y', userSelect: 'none', webkitUserSelect: 'none', webkitTouchCallout: 'none', cursor: 'pointer' });
    const ctx = c.getContext('2d');
    const S = { c, ctx, H: Hh, render: () => false };
    S.layer = (paint) => { const L = document.createElement('canvas'); L.width = c.width; L.height = c.height; const x = L.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.lineCap = x.lineJoin = 'round'; paint(x); return L; };
    S.blit = (L) => ctx.drawImage(L, 0, 0, W, Hh);
    S.pos = (e) => { const r = c.getBoundingClientRect(); return [((e.clientX - r.left) * W) / r.width, ((e.clientY - r.top) * Hh) / r.height]; };
    const hidden = () => { const p = c.closest('.page'); return !p || p.classList.contains('hidden') || !c.offsetParent; };
    let raf = 0, wait = 0, last = 0, vis = true;
    if (window.IntersectionObserver) new IntersectionObserver((es) => { vis = es[es.length - 1].isIntersecting; if (vis) S.go(); }, { rootMargin: '120px' }).observe(c);
    const tick = (now) => {
      raf = 0;
      if (!vis) { last = 0; return; }
      if (hidden()) { last = 0; if (!wait) wait = setTimeout(() => { wait = 0; S.go(); }, 500); return; }
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60; last = now;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.globalCompositeOperation = 'source-over'; ctx.clearRect(0, 0, W, Hh);
      ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = 1; ctx.lineCap = ctx.lineJoin = 'round';
      if (S.render(dt, now / 1000)) raf = requestAnimationFrame(tick); else last = 0;
    };
    S.go = () => { if (!raf) raf = requestAnimationFrame(tick); };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { S.onFonts && S.onFonts(); S.go(); });
    return S;
  }
  // a press-and-hold button (works with a finger; releases if the finger slides off)
  function holdBtn(el, row, label, on) {
    const b = el('button', 'btn hold', label, row); b.type = 'button';
    const set = (v) => { b.classList.toggle('down', v); on(v); };
    b.addEventListener('pointerdown', (e) => { e.preventDefault(); try { b.setPointerCapture(e.pointerId); } catch (er) {} set(true); });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((n) => b.addEventListener(n, () => set(false)));
    b.addEventListener('contextmenu', (e) => e.preventDefault());
    return b;
  }

  // =========================================================================================================
  // Station 1: conductive thread (touchscreen glove + light-up badge)
  // =========================================================================================================
  const TOP = geo.curve([664, 128], [690, 56], [748, 56], [770, 128], 30), BOT = geo.curve([770, 160], [748, 232], [690, 232], [664, 160], 30);
  function drawGlove(x, tx, ty, kind) {
    const finger = geo.rect(tx, ty - 16, 104, 32, 15), palm = geo.rect(tx + 84, ty - 50, 114, 108, 26), thumb = geo.rect(tx + 100, ty - 80, 36, 58, 16), cuff = geo.rect(tx + 192, ty - 42, 44, 92, 6);
    [thumb, palm, finger].forEach((P, i) => { paper(x, P); if (kind === 0) Ink.hatchFill(x, P, 1, B, 0.7); st(x, P, { w: 2.6, seed: 31 + i * 4, amp: 0.5 }); });
    paper(x, cuff); st(x, cuff, { w: 2.6, seed: 47, amp: 0.4 });
    [-26, -8, 10, 28].forEach((d, i) => st(x, [[tx + 196, ty + d], [tx + 232, ty + d]], { w: 1.5, seed: 51 + i, retrace: false, amp: 0.3 }));
    if (kind === 1) {                                   // silver thread: a shiny fingertip pad and a line of stitches
      const pad = geo.rect(tx + 1, ty - 15, 30, 30, 14); tint(x, pad, 'rgba(150,160,190,.5)'); Ink.hatchFill(x, pad, 1, GREY, 2.2);
      stitch(x, [[tx + 30, ty], [tx + 96, ty], [tx + 150, ty + 18]], 1, GREY, 2.4);
      [[tx + 44, ty - 28], [tx + 20, ty + 32]].forEach(([sx, sy], i) => { st(x, [[sx - 6, sy], [sx + 6, sy]], { w: 1.4, seed: 61 + i, retrace: false, color: GREY }); st(x, [[sx, sy - 6], [sx, sy + 6]], { w: 1.4, seed: 63 + i, retrace: false, color: GREY }); });
    }
  }
  const sceneCond = {
    H: 310,
    init(S) { Object.assign(S, { glove: 0, pk: -1, poke: 0, taps: 0, ripple: 0, miss: 0, thread: -1, sew: 0, lit: 0 }); },
    paint(x) {
      const ph = geo.rect(70, 20, 170, 276, 20); Ink.hatchShadow(x, ph, 1, 7, 7); paper(x, ph); st(x, ph, { w: 3, seed: 3 });
      st(x, geo.rect(84, 50, 142, 208, 6), { w: 2.2, seed: 5 }); st(x, geo.ellipse(155, 277, 9, 9), { w: 1.8, seed: 7 }); st(x, [[136, 35], [174, 35]], { w: 2.6, seed: 9 });
      // the fabric badge with its battery and LED
      const pa = geo.rect(566, 30, 270, 240, 14); Ink.hatchShadow(x, pa, 1, 7, 7); paper(x, pa); st(x, pa, { w: 2.8, seed: 11 });
      stitch(x, closeP(box(578, 42, 246, 216)), 1, B, 1.6);
      const cell = geo.ellipse(636, 144, 30, 30); paper(x, cell); st(x, cell, { w: 2.8, seed: 13 }); st(x, geo.ellipse(636, 144, 22, 22), { w: 1.4, seed: 15, retrace: false });
      st(x, [[628, 144], [644, 144]], { w: 2.4, seed: 17 }); st(x, [[636, 136], [636, 152]], { w: 2.4, seed: 19 });
      text(x, 'battery', 636, 208, { size: 22 }); text(x, 'LED', 796, 208, { size: 22 });
      st(x, [[770, 128], [782, 136]], { w: 2.2, seed: 21 }); st(x, [[770, 160], [782, 152]], { w: 2.2, seed: 23 });
      text(x, 'fabric badge', 700, 296, { font: 'hand', size: 22 });
    },
    draw(x, S, dt, now) {
      let more = false;
      // ---- the poke ----
      if (S.pk >= 0) {
        const was = S.pk; S.pk += dt / 0.5; more = true;
        if (was < 0.5 && S.pk >= 0.5) {
          if (S.glove === 1) { S.taps++; S.ripple = 1; Book.sfx('pop', { gain: 0.5 }); S.mark('gs'); } else { S.miss = 1.6; Book.sfx('thud', { gain: 0.25 }); S.mark('gw'); }
        }
        if (S.pk >= 1) S.pk = -1;
      }
      S.poke = S.pk < 0 ? 0 : Math.sin(Math.PI * clamp(S.pk));
      if (S.ripple > 0) { S.ripple = Math.max(0, S.ripple - dt / 0.8); more = true; }
      if (S.miss > 0) { S.miss = Math.max(0, S.miss - dt); more = true; }
      // ---- the screen ----
      const on = S.taps % 2 === 1;
      if (on) glow(x, 155, 154, 70, AMBER, 0.8);
      st(x, geo.ellipse(155, 154, 40, 40), { w: 2.8, seed: 71, color: on ? RD : B });
      text(x, 'TAP', 155, 163, { size: 26, color: on ? RD : B });
      text(x, 'taps: ' + S.taps, 155, 88, { size: 22 });
      if (S.ripple > 0) { x.save(); x.strokeStyle = rgba(RD, S.ripple); x.lineWidth = 3; [0, 14].forEach((d) => { x.beginPath(); x.arc(155, 154, 44 + (1 - S.ripple) * 30 + d, 0, 7); x.stroke(); }); x.restore(); }
      if (S.miss > 0) text(x, 'nothing…', 155, 236, { font: 'hand', size: 22, color: RD, a: clamp(S.miss) });
      // ---- the glove ----
      drawGlove(x, 300 - 104 * S.poke, 154, S.glove);
      text(x, S.glove ? 'glove with silver thread' : 'woolly glove', 420, 266, { font: 'hand', size: 22 });
      // ---- the badge ----
      if (S.thread >= 0) {
        if (S.sew < 1) { S.sew = Math.min(1, S.sew + dt / 1.1); more = true; if (S.sew >= 1) { S.mark(S.thread ? 'ts' : 'tc'); if (S.thread) Book.sfx('pop', { gain: 0.5 }); } }
        const col = S.thread ? GREY : B, w = S.thread ? 3.6 : 2.6;
        stitch(x, TOP, clamp(S.sew * 2), col, w); stitch(x, BOT, clamp(S.sew * 2 - 1), col, w);
        text(x, S.thread ? 'silver thread' : 'cotton thread', 717, 252, { font: 'hand', size: 22, color: col });
      }
      const lit = S.thread === 1 && S.sew >= 1; S.lit = lerp(S.lit, lit ? 1 : 0, Math.min(1, dt * 8)); if (Math.abs(S.lit - (lit ? 1 : 0)) > 0.01) more = true;
      glow(x, 796, 144, 64, [240, 60, 60], S.lit);
      const led = geo.ellipse(796, 144, 17, 17); if (S.lit > 0.5) tint(x, led, 'rgba(240,70,70,.55)'); st(x, led, { w: 2.6, seed: 73, color: S.lit > 0.5 ? RD : B });
      if (S.lit > 0.5) for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * 0.6; st(x, [[796 + Math.cos(a) * 24, 144 + Math.sin(a) * 24], [796 + Math.cos(a) * 34, 144 + Math.sin(a) * 34]], { w: 2, seed: 75 + i, color: RD, retrace: false }); }
      return more;
    },
    down(S, px) { if (px < 560 && S.pk < 0) { S.pk = 0; } },
    controls(S, row, go, el) {
      const gb = [['Woolly glove', 0], ['Glove with silver thread', 1]].map(([t, k]) => { const b = el('button', 'btn ghost' + (k === 0 ? ' on' : ''), t, row); b.type = 'button'; b.onclick = () => { S.glove = k; gb.forEach((q, i) => q.classList.toggle('on', i === k)); Book.sfx('tick', { gain: 0.5 }); go(); }; return b; });
      const tap = el('button', 'btn', '☝ Tap the phone', row); tap.type = 'button'; tap.onclick = () => { if (S.pk < 0) S.pk = 0; go(); };
      [['Sew with cotton thread', 0], ['Sew with silver thread', 1]].forEach(([t, k]) => { const b = el('button', 'btn ghost', t, row); b.type = 'button'; b.onclick = () => { S.thread = k; S.sew = 0; Book.scribble(0.6); go(); }; });
    },
  };

  // =========================================================================================================
  // Station 2: the flame test
  // =========================================================================================================
  const FX = 300, RACK = [600, 705, 810], SWN = ['cotton', 'polyester', 'Nomex'];
  const freshSw = () => [0, 1, 2].map(() => ({ e: 0, out: 0, burn: 0, melt: 0, char: 0, alight: false, glow: 0 }));
  function drawSwatch(x, i, s, cx, top, now) {
    const w = 70, h = 90;
    if (i === 0) {                                                        // cotton: burns away from the bottom
      if (s.burn >= 1) { st(x, [[cx - 12, top + 2], [cx - 4, top + 9], [cx + 6, top + 4], [cx + 13, top + 10]], { w: 2, seed: 81 }); return; }
      const hh = h * (1 - s.burn), P = box(cx - w / 2, top, w, hh);
      paper(x, P); st(x, closeP(P), { w: 2.4, seed: 83, amp: 0.5 });
      [-18, 0, 18].forEach((d, k) => st(x, [[cx + d, top + 3], [cx + d, top + hh - 3]], { w: 1.1, seed: 85 + k, retrace: false, amp: 0.3 }));
      for (let yy = 18; yy < hh - 4; yy += 18) st(x, [[cx - w / 2 + 3, top + yy], [cx + w / 2 - 3, top + yy]], { w: 1.1, seed: 89 + yy, retrace: false, amp: 0.3 });
      if (s.burn > 0) { const ch = box(cx - w / 2, top + hh - Math.min(10, hh), w, Math.min(10, hh)); Ink.hatchFill(x, ch, 1, B, 2.6); Ink.hatchFill(x, ch, 1, B, 2); }
      if (s.alight) for (let k = 0; k < 5; k++) { const fx = cx - 28 + k * 14, fh = 20 + 12 * Math.sin(now * 13 + k * 2.1); st(x, [[fx - 6, top + hh], [fx - 2, top + hh - fh * 0.5], [fx, top + hh - fh], [fx + 3, top + hh - fh * 0.5], [fx + 6, top + hh]], { w: 2.2, seed: 91 + k + (Math.floor(now * 9) % 3), color: RD, retrace: false, amp: 0.6 }); }
    } else if (i === 1) {                                                 // polyester: shrinks, melts and drips
      const m = s.melt, hh = h * (1 - 0.62 * m), bw = w * (1 - 0.45 * m), by = top + hh;
      const P = [[cx - w / 2, top], [cx + w / 2, top], ...geo.curve([cx + w / 2, top], [cx + w / 2, top + hh * 0.5], [cx + bw / 2 + 4 * m, by - 8], [cx + bw / 2, by], 8),
        ...(m > 0.05 ? [[cx + bw * 0.3, by + 5 * m], [cx + bw * 0.16, by + 16 * m], [cx + bw * 0.05, by + 4 * m], [cx - bw * 0.14, by + 9 * m], [cx - bw * 0.26, by + 22 * m], [cx - bw * 0.36, by + 4 * m]] : []),
        ...geo.curve([cx - bw / 2, by], [cx - bw / 2 - 4 * m, by - 8], [cx - w / 2, top + hh * 0.5], [cx - w / 2, top], 8)];
      paper(x, P); tint(x, P, 'rgba(120,140,235,.12)'); st(x, closeP(P), { w: 2.4, seed: 101, amp: 0.4 });
      st(x, [[cx - 20, top + 12], [cx - 6, top + 30 * (1 - 0.5 * m)]], { w: 1.4, seed: 103, retrace: false }); st(x, [[cx - 8, top + 10], [cx + 2, top + 22 * (1 - 0.5 * m)]], { w: 1.4, seed: 105, retrace: false });
      if (m > 0.1) Ink.hatchFill(x, [[cx - bw / 2, by - 10], [cx + bw / 2, by - 10], [cx + bw * 0.3, by + 5 * m], [cx - bw * 0.3, by + 5 * m]], 1, B, 1.8);
    } else {                                                              // Nomex: chars a little, glows, goes out
      const P = box(cx - w / 2, top, w, h); paper(x, P); Ink.hatchFill(x, P, 1, B, 0.9); st(x, closeP(P), { w: 2.6, seed: 111, amp: 0.5 });
      if (s.char > 0.01) { const ch = box(cx - w / 2, top + h - 60 * s.char, w, 60 * s.char); Ink.hatchFill(x, ch, 1, B, 2.4); }
      if (s.glow > 0.03) { glow(x, cx, top + h, 40, [240, 80, 40], s.glow * 0.8); for (let k = 0; k < 4; k++) { const fx = cx - 24 + k * 16, fh = (8 + 5 * Math.sin(now * 14 + k)) * s.glow; st(x, [[fx - 4, top + h], [fx, top + h - fh], [fx + 4, top + h]], { w: 1.8, seed: 113 + k, color: RD, retrace: false }); } }
    }
  }
  const sceneFlame = {
    H: 320, always: true,
    init(S) { Object.assign(S, { sel: -1, hold: false, a: 0, sw: freshSw(), drips: [], blobs: [], dripT: 0 }); },
    paint(x) {
      st(x, [[20, 304], [540, 304]], { w: 2.6, seed: 3 });
      // Bunsen burner
      const tube = box(286, 228, 28, 62), base = geo.rect(252, 290, 96, 14, 5);
      paper(x, tube); Ink.hatchFill(x, box(300, 228, 14, 62), 1, B, 1.4); st(x, closeP(tube), { w: 2.6, seed: 5 });
      paper(x, base); Ink.hatchFill(x, base, 1, B, 1.6); st(x, base, { w: 2.6, seed: 7 });
      st(x, geo.rect(280, 262, 40, 12, 4), { w: 2, seed: 9 });
      st(x, geo.curve([348, 298], [420, 300], [440, 280], [540, 296], 20), { w: 3, seed: 11 });
      // the rack
      st(x, [[548, 50], [852, 50]], { w: 3, seed: 13 });
      st(x, [[556, 50], [556, 214]], { w: 2.6, seed: 15 }); st(x, [[846, 50], [846, 214]], { w: 2.6, seed: 17 });
      SWN.forEach((n, i) => { text(x, n, RACK[i], 190, { size: 22 }); st(x, [[RACK[i] - 8, 50], [RACK[i] - 8, 62]], { w: 2, seed: 19 + i, retrace: false }); st(x, [[RACK[i] + 8, 50], [RACK[i] + 8, 62]], { w: 2, seed: 23 + i, retrace: false }); });
      text(x, 'tap a swatch to pick it up', 700, 252, { font: 'hand', size: 22 });
    },
    draw(x, S, dt, now) {
      S.a = lerp(S.a, S.hold && S.sel >= 0 ? 1 : 0, Math.min(1, dt * 7));
      const inF = S.a > 0.75;
      // ---- what the heat does to each swatch ----
      S.sw.forEach((s, i) => {
        const hot = inF && i === S.sel;
        if (hot) { s.e += dt; s.out = 0; } else if (s.e > 0) s.out += dt;
        if (i === 0) { if (s.e > 0.6 && s.burn < 1) s.alight = true; if (s.alight) { s.burn = Math.min(1, s.burn + dt * 0.2); if (s.burn >= 1) s.alight = false; } if ((s.burn >= 0.45 && s.out > 0.8) || s.burn >= 1) S.mark('c'); }
        if (i === 1) { if (hot) s.melt = Math.min(1, s.melt + dt * 0.3); if ((hot || s.out < 0.9) && s.melt > 0.12 && s.melt < 1 && S.sel === 1) { S.dripT -= dt; if (S.dripT <= 0) { S.dripT = 0.38; const gx = lerp(150, FX, S.a); S.drips.push({ x: gx + (Math.random() - 0.5) * 24, y: lerp(52, 100, S.a) + 90 * (1 - 0.62 * s.melt) + 14, v: 40 }); } } if (s.melt > 0.45 && s.out > 0.9) S.mark('p'); }
        if (i === 2) { if (hot) s.char = Math.min(0.28, s.char + dt * 0.14); s.glow = lerp(s.glow, hot && s.e > 0.4 ? 1 : 0, Math.min(1, dt * (hot ? 4 : 7))); if (s.e > 1.5 && s.out > 0.9) S.mark('n'); }
      });
      S.drips.forEach((d) => { d.v += 900 * dt; d.y += d.v * dt; if (d.y >= 298 && !d.dead) { d.dead = true; if (S.blobs.length < 9) S.blobs.push(d.x); Book.sfx('tick', { gain: 0.2 }); } });
      S.drips = S.drips.filter((d) => !d.dead);
      // ---- the flame ----
      const sw = Math.sin(now * 9) * 5 + Math.sin(now * 23) * 2, tip = [FX + sw, 118 + Math.sin(now * 17) * 5];
      const F = [...geo.curve([FX, 226], [FX - 36, 204], [FX - 16, 160], tip, 14), ...geo.curve(tip, [FX + 16, 160], [FX + 36, 204], [FX, 226], 14)];
      glow(x, FX, 180, 90, AMBER, 0.55); tint(x, F, 'rgba(255,170,40,.35)'); st(x, F, { w: 2.4, seed: 31 + (Math.floor(now * 10) % 4), color: RD, amp: 1.2 });
      st(x, [...geo.curve([FX, 226], [FX - 14, 212], [FX - 6, 190], [FX + sw * 0.4, 176], 8), ...geo.curve([FX + sw * 0.4, 176], [FX + 6, 190], [FX + 14, 212], [FX, 226], 8)], { w: 1.8, seed: 37, amp: 0.6 });
      // ---- blobs of melted plastic on the bench, drips in the air ----
      S.blobs.forEach((bx, k) => { const E = geo.ellipse(bx, 300, 9 + (k % 3) * 2, 4, 0, TAU); tint(x, E, 'rgba(120,140,235,.35)'); st(x, closeP(E), { w: 1.6, seed: 41 + k, retrace: false }); });
      S.drips.forEach((d) => disc(x, d.x, d.y, 4.5, B, 0.75));
      // ---- the rack ----
      S.sw.forEach((s, i) => { if (i === S.sel) { x.save(); x.strokeStyle = rgba(B, 0.4); x.lineWidth = 2; x.setLineDash([6, 7]); x.strokeRect(RACK[i] - 35, 62, 70, 90); x.restore(); } else drawSwatch(x, i, s, RACK[i], 62, now); });
      // ---- the swatch in the tongs ----
      if (S.sel >= 0) {
        const gx = lerp(150, FX, S.a), gy = lerp(52, 100, S.a);
        drawSwatch(x, S.sel, S.sw[S.sel], gx, gy, now);
        st(x, [[gx - 230, gy - 44], [gx - 14, gy + 3]], { w: 3, seed: 51, amp: 0.3 }); st(x, [[gx - 234, gy - 22], [gx - 14, gy + 11]], { w: 3, seed: 53, amp: 0.3 });
        disc(x, gx - 12, gy + 7, 5, B);
        text(x, SWN[S.sel], 96, 150, { size: 24 });
      } else text(x, 'pick a swatch', 150, 120, { font: 'hand', size: 22 });
      return true;
    },
    down(S, px, py) { if (px > 548 && py < 215) { const i = RACK.findIndex((rx) => Math.abs(px - rx) < 52); if (i >= 0) { S.pick(i); return; } } if (px < 548 && S.sel >= 0) S.hold = true; },
    up(S) { if (!S.btnHold) S.hold = false; },
    controls(S, row, go, el) {
      const bs = SWN.map((n, i) => { const b = el('button', 'btn ghost', n[0].toUpperCase() + n.slice(1), row); b.type = 'button'; b.onclick = () => S.pick(i); return b; });
      S.pick = (i) => { S.sel = i; S.hold = false; bs.forEach((q, k) => q.classList.toggle('on', k === i)); Book.sfx('paper', { gain: 0.3, dur: 0.2 }); go(); };
      holdBtn(el, row, '🔥 Hold it in the flame (press and hold)', (v) => { if (v && S.sel < 0) { Book.toast('Pick a swatch first.'); return; } S.btnHold = v; S.hold = v; go(); });
      const nw = el('button', 'btn ghost', 'Fresh swatches', row); nw.type = 'button'; nw.onclick = () => { S.sw = freshSw(); S.blobs = []; S.drips = []; Book.sfx('paper', { gain: 0.3 }); go(); };
    },
  };

  // =========================================================================================================
  // Station 3: Kevlar (knife cut test + pull test)
  // =========================================================================================================
  const ROPES = [{ n: 'steel wire', x: 520, lim: 100, w: 1.6 }, { n: 'nylon rope', x: 645, lim: 150, w: 4.2 }, { n: 'Kevlar rope', x: 770, lim: 500, w: 4.2 }];
  const GASH = [[168, 196], [262, 238]];
  const sceneKev = {
    H: 330,
    init(S) { Object.assign(S, { glove: 0, sl: -1, cuts: [0, 0], load: 0, loading: false, snap: [0, 0, 0], fall: [0, 0, 0], said: -1 }); },
    paint(x) {
      const bd = geo.rect(40, 112, 360, 196, 10); Ink.hatchShadow(x, bd, 1, 7, 7); paper(x, bd); st(x, bd, { w: 2.8, seed: 3 });
      text(x, 'cut test', 54, 140, { font: 'hand', size: 22, align: 'left' });
      // the pull rig
      const beam = box(450, 44, 394, 16); paper(x, beam); Ink.hatchFill(x, beam, 1, B, 1.5); st(x, closeP(beam), { w: 2.8, seed: 5 });
      st(x, [[458, 60], [458, 272]], { w: 3, seed: 7 }); st(x, [[836, 60], [836, 272]], { w: 3, seed: 9 }); st(x, [[440, 272], [852, 272]], { w: 2.8, seed: 11 });
      ROPES.forEach((r) => text(x, r.n, r.x, 298, { size: 22 }));
      text(x, '(all three weigh the same)', 645, 324, { font: 'hand', size: 22 });
    },
    draw(x, S, dt, now) {
      let more = false;
      // ---- cut test ----
      const k = S.glove, palm = geo.rect(160, 174, 112, 96, 22), cuff = box(172, 264, 88, 30), thumb = geo.rect(262, 184, 54, 28, 13);
      const parts = [thumb, ...[0, 1, 2, 3].map((i) => geo.rect(162 + i * 28, 118 + [10, 0, 4, 16][i], 25, 76, 12)), palm, cuff];
      parts.forEach((P, i) => { paper(x, P); if (k) tint(x, P, 'rgba(240,200,60,.38)'); Ink.hatchFill(x, P, 1, B, k ? 1.5 : 0.5); st(x, i === 6 ? closeP(P) : P, { w: 2.6, seed: 21 + i * 3, amp: 0.4 }); });
      text(x, k ? 'Kevlar glove' : 'cotton glove', 392, 298, { size: 22, align: 'right' });
      if (S.sl >= 0) { const was = S.sl; S.sl += dt / 0.42; more = true; if (was < 0.6 && S.sl >= 0.6) { S.cuts[k]++; Book.sfx(k ? 'tick' : 'paper', { gain: 0.5, dur: 0.25 }); S.mark(k ? 'ck' : 'cc'); } if (S.sl >= 1.5) S.sl = -1; }
      const n = S.cuts[k];
      if (n && k === 0) {                               // cotton: sliced wide open
        const mid = [(GASH[0][0] + GASH[1][0]) / 2, (GASH[0][1] + GASH[1][1]) / 2], up = geo.curve(GASH[0], [mid[0] - 10, mid[1] - 22], [mid[0] + 14, mid[1] - 14], GASH[1], 12), dn = geo.curve(GASH[1], [mid[0] + 10, mid[1] + 20], [mid[0] - 16, mid[1] + 12], GASH[0], 12), G = up.concat(dn);
        paper(x, G); Ink.hatchFill(x, G, 1, RD, 2.4); st(x, closeP(G), { w: 2.4, seed: 41, color: RD });
        [0.25, 0.5, 0.75].forEach((u, i) => { const p = up[Math.floor(u * 12)]; st(x, [p, [p[0] + 5, p[1] + 9]], { w: 1.2, seed: 43 + i, retrace: false }); });
        text(x, 'sliced open!', 215, 98, { size: 24, color: RD });
      } else if (n) {                                   // Kevlar: only a scratch each time
        for (let i = 0; i < Math.min(n, 4); i++) st(x, [[GASH[0][0] + 6, GASH[0][1] + i * 7 - 4], [GASH[1][0] - 4, GASH[1][1] + i * 7 - 8]], { w: 1.1, seed: 47 + i, retrace: false, amp: 0.4 });
        text(x, n + (n > 1 ? ' slashes' : ' slash') + ': just a scratch', 215, 98, { size: 24 });
      }
      // the knife
      const u = S.sl < 0 ? 0 : clamp(S.sl), kx = lerp(96, 330, u), ky = lerp(84, 268, u) - (S.sl < 0 ? 26 : 0);
      x.save(); x.translate(kx, ky); x.rotate(0.67);
      const blade = [[40, 0], [-34, -17], [-46, -6], [-46, 7], [28, 7]], hd = geo.rect(-116, -10, 70, 19, 7);
      paper(x, blade); st(x, closeP(blade), { w: 2.2, seed: 51, amp: 0.3 }); st(x, [[-40, -2], [30, 3]], { w: 1, seed: 53, retrace: false });
      paper(x, hd); Ink.hatchFill(x, hd, 1, B, 2); st(x, hd, { w: 2.4, seed: 55, amp: 0.3 });
      x.restore();
      // ---- pull test ----
      if (S.loading && S.snap[2] === 0) { S.load = Math.min(520, S.load + dt * 70); more = true; }
      text(x, 'load on each rope: ' + Math.round(S.load / 5) * 5 + ' kg', 645, 30, { size: 24 });
      ROPES.forEach((r, i) => {
        if (!S.snap[i] && S.load >= r.lim) { S.snap[i] = r.lim; Book.sfx('thud', { gain: 0.6 }); S.mark('r' + i); }
        const sn = S.snap[i]; if (sn && S.fall[i] < 1) { S.fall[i] = Math.min(1, S.fall[i] + dt * 3.2); more = true; }
        const strain = sn ? 0 : clamp((S.load / r.lim - 0.8) / 0.2), jx = strain * Math.sin(now * 50 + i) * 1.4;
        const wy = 150 + S.fall[i] * S.fall[i] * 66, col = i === 2 ? [150, 110, 10] : B;
        const rope = (a, b2) => { if (i === 0) st(x, [a, b2], { w: r.w, seed: 61 + i, amp: 0.3, retrace: false }); else { st(x, [a, b2], { w: r.w, seed: 61 + i, amp: 0.5, color: col }); st(x, [[a[0] + 3, a[1]], [b2[0] + 3, b2[1]]], { w: 1.4, seed: 65 + i, amp: 0.5, color: col, retrace: false }); } };
        if (!sn) rope([r.x, 60], [r.x + jx, 150]);
        else { rope([r.x, 60], [r.x - 3, 96]); [-5, 0, 5].forEach((d, q) => st(x, [[r.x - 3, 96], [r.x - 3 + d, 106]], { w: 1.2, seed: 67 + q, retrace: false, color: col })); rope([r.x + 2, wy - 30], [r.x, wy]); text(x, 'SNAP!', r.x + 8, 128, { size: 22, color: RD, rot: -0.1 }); }
        const blk = geo.rect(r.x - 40, wy, 80, 54, 6); Ink.hatchShadow(x, blk, 1, 5, 4); paper(x, blk); Ink.hatchFill(x, box(r.x - 40, wy + 34, 80, 20), 1, B, 1.6); st(x, blk, { w: 2.6, seed: 71 + i, amp: 0.4 });
        if (sn) text(x, sn + ' kg', r.x, wy + 27, { size: 22, color: RD });
      });
      return more || S.loading;
    },
    down(S, px) { if (px < 420 && S.sl < 0) S.sl = 0; },
    controls(S, row, go, el) {
      const gb = [['Cotton glove', 0], ['Kevlar glove', 1]].map(([t, k]) => { const b = el('button', 'btn ghost' + (k === 0 ? ' on' : ''), t, row); b.type = 'button'; b.onclick = () => { S.glove = k; gb.forEach((q, i) => q.classList.toggle('on', i === k)); Book.sfx('tick', { gain: 0.5 }); go(); }; return b; });
      const sl = el('button', 'btn', '🔪 Slash it!', row); sl.type = 'button'; sl.onclick = () => { if (S.sl < 0) S.sl = 0; go(); };
      holdBtn(el, row, '⬇ Add load to the ropes (press and hold)', (v) => { S.loading = v; go(); });
      const nw = el('button', 'btn ghost', 'New ropes', row); nw.type = 'button'; nw.onclick = () => { S.load = 0; S.snap = [0, 0, 0]; S.fall = [0, 0, 0]; Book.sfx('paper', { gain: 0.3 }); go(); };
    },
  };

  // =========================================================================================================
  // Station 4: micro-encapsulation
  // =========================================================================================================
  const LX = 620, LY = 160, LR = 138, NCAP = 24;
  const CAPS = (() => { const rr = H.rng(61), o = []; for (let j = 0; j < 6; j++) { const y = LY + (j - 2.5) * 44; for (let q = 0; q < 4; q++) o.push({ x: LX + (q - 1.5) * 36 + rr.range(-6, 6), y: y - 13, fy: y }); } return o; })();
  const ORDERC = Book.shuffle(CAPS.map((_, i) => i), 23);
  const SOCK = [[120, 44], [216, 44], [216, 150], ...geo.curve([216, 150], [232, 180], [300, 176], [336, 206], 12), ...geo.curve([336, 206], [358, 238], [332, 270], [290, 270], 12), [150, 270], ...geo.curve([150, 270], [106, 264], [110, 212], [120, 180], 12), [120, 44]];
  const sceneCaps = {
    H: 320,
    init(S) { Object.assign(S, { gone: 0, burstAt: CAPS.map(() => -1), ev: 0, wears: 0, dist: 0, rubbing: null, wig: 0, t: 0 }); },
    paint(x) {
      Ink.hatchShadow(x, SOCK, 1, 7, 7); paper(x, SOCK); st(x, SOCK, { w: 3, seed: 3 });
      st(x, [[120, 72], [216, 72]], { w: 2, seed: 5 }); [136, 152, 168, 184, 200].forEach((px, i) => st(x, [[px, 48], [px, 68]], { w: 1.3, seed: 7 + i, retrace: false }));
      const toe = [[300, 190], ...geo.curve([336, 206], [358, 238], [332, 270], [290, 270], 10), [300, 190]]; Ink.hatchFill(x, toe, 1, B, 1.3); st(x, [[300, 188], [290, 270]], { w: 1.8, seed: 13 });
      const heel = [[150, 270], ...geo.curve([150, 270], [106, 264], [110, 212], [120, 180], 10), [156, 222], [150, 270]]; Ink.hatchFill(x, heel, 1, B, 1.3); st(x, [[120, 180], [156, 222], [150, 270]], { w: 1.8, seed: 15 });
      // the zoom lens
      st(x, geo.ellipse(246, 222, 15, 15), { w: 2.2, seed: 17 }); st(x, [[256, 211], [516, 68]], { w: 1.6, seed: 19, retrace: false }); st(x, [[256, 234], [528, 262]], { w: 1.6, seed: 21, retrace: false });
      const L = geo.ellipse(LX, LY, LR, LR, 0, TAU); paper(x, L);
      x.save(); path(x, L); x.clip();
      for (let j = 0; j < 6; j++) { const y = LY + (j - 2.5) * 44; [-6, 6].forEach((d, q) => { const P = []; for (let px = LX - LR; px <= LX + LR; px += 8) P.push([px, y + d + Math.sin(px * 0.045 + j) * 3]); st(x, P, { w: 2, seed: 23 + j * 2 + q, amp: 0.4 }); }); Ink.hatchFill(x, box(LX - LR, y - 5, LR * 2, 10), 1, B, 0.6); }
      x.restore();
      st(x, geo.ellipse(LX, LY, LR, LR), { w: 3.4, seed: 37 });
      text(x, 'zoomed in: microfibres', 620, 316, { font: 'hand', size: 22 });
      text(x, 'rub me!', 60, 112, { font: 'hand', size: 22, rot: -0.12 });
    },
    draw(x, S, dt) {
      S.t += dt; let more = false;
      if (S.wig > 0) { S.wig = Math.max(0, S.wig - dt); more = true; }
      CAPS.forEach((c, i) => {
        const b = S.burstAt[i], age = b < 0 ? -1 : S.t - b;
        if (b < 0) { const E = geo.ellipse(c.x, c.y, 10, 10, 0, TAU); paper(x, E); tint(x, E, 'rgba(235,110,160,.38)'); st(x, closeP(E), { w: 2, seed: 41 + i, amp: 0.3, color: RD }); disc(x, c.x - 3, c.y - 3, 1.8, RD, 0.6); }
        else {
          st(x, geo.ellipse(c.x - 3, c.y + 1, 9, 9, 1.9, 4.2), { w: 1.4, seed: 41 + i, retrace: false, color: RD }); st(x, geo.ellipse(c.x + 4, c.y + 2, 8, 8, -0.9, 1.0), { w: 1.4, seed: 43 + i, retrace: false, color: RD });
          if (age < 1.6) { more = true; const a = 1 - age / 1.6; x.save(); x.strokeStyle = rgba(RD, 0.8 * a); x.lineWidth = 2; x.lineCap = 'round'; [-7, 0, 7].forEach((d, q) => { x.beginPath(); for (let j = 0; j <= 10; j++) { const yy = c.y - 8 - j * 3 - age * 26; x.lineTo(c.x + d + Math.sin(j * 0.8 + q + age * 5) * 4, yy); } x.stroke(); }); x.restore(); }
        }
      });
      // scent rising off the sock itself (stronger just after a rub)
      const recent = Math.max(-9, ...S.burstAt.filter((b) => b >= 0)), sa = clamp(1 - (S.t - recent) / 2);
      if (sa > 0.02) { more = true; x.save(); x.strokeStyle = rgba(RD, 0.7 * sa); x.lineWidth = 2.2; x.lineCap = 'round'; [150, 190, 240, 290].forEach((px, q) => { x.beginPath(); for (let j = 0; j <= 12; j++) x.lineTo(px + Math.sin(j * 0.7 + S.t * 4 + q) * 6, (q < 2 ? 36 : 170) - j * 3 - (S.t - recent) * 12); x.stroke(); }); x.restore(); }
      // the rubbing finger
      const f = S.rubbing || (S.wig > 0 ? [200 + Math.sin(S.wig * 22) * 44, 150] : null);
      if (f) { const F = geo.rect(f[0] - 19, f[1] - 150, 38, 168, 19); paper(x, F); st(x, F, { w: 2.6, seed: 91, amp: 0.3 }); st(x, geo.rect(f[0] - 11, f[1] - 14, 22, 26, 9), { w: 1.4, seed: 93, retrace: false }); }
      const left = NCAP - S.gone;
      text(x, 'capsules left: ' + left + ' of ' + NCAP, 430, 300, { size: 24, color: left ? B : RD, align: 'right' });
      if (!left) text(x, 'no scent left', 620, 30, { size: 24, color: RD });
      return more || !!S.rubbing;
    },
    burst(S, n) {
      const k = Math.min(NCAP - S.gone, n); S.ev++;
      for (let i = 0; i < k; i++) S.burstAt[ORDERC[S.gone + i]] = S.t + i * 0.12;
      S.gone += k; if (k) Book.sfx('pop', { gain: 0.4 }); else Book.sfx('tick', { gain: 0.3 });
      S.lastK = k; if (S.ev >= 3) S.mark('r'); else S.note();
    },
    down(S, px, py) { if (px < 420) { S.rubbing = [px, py]; S.dist = 0; } },
    move(S, px, py) { if (!S.rubbing) return; S.dist += Math.abs(px - S.rubbing[0]) + Math.abs(py - S.rubbing[1]); S.rubbing = [Math.min(px, 420), py]; if (S.dist > 240) { S.dist = 0; sceneCaps.burst(S, 3 + (S.ev % 2)); } },
    up(S) { S.rubbing = null; },
    controls(S, row, go, el) {
      const rb = el('button', 'btn', '✋ Rub the sock', row); rb.type = 'button'; rb.onclick = () => { S.wig = 0.6; sceneCaps.burst(S, 3 + (S.ev % 2)); go(); };
      const wr = el('button', 'btn ghost', 'Wear it all day, then wash it', row); wr.type = 'button'; wr.onclick = () => { S.wears++; S.wig = 0.6; sceneCaps.burst(S, 4); go(); };
      const nw = el('button', 'btn ghost', 'New sock', row); nw.type = 'button'; nw.onclick = () => { S.gone = 0; S.burstAt = CAPS.map(() => -1); Book.sfx('paper', { gain: 0.3 }); go(); };
    },
  };

  // =========================================================================================================
  // one station: predict -> test by touch -> all tests done -> conclusion -> notes unlock
  // =========================================================================================================
  function Station(ui, cfg) {
    const el = ui.el, sc = cfg.scene, id = 'p06.' + cfg.key;
    const r = ui.record(id, { label: cfg.label, type: 'experiment', max: 1 });
    const prev = r.get() || {}, sv = prev.sv || {};
    const lab = el('div', 'p06-lab'); requestAnimationFrame(() => Ink.frame(lab, { shadow: false, w: 2.2 }));
    el('div', 'p06-step', cfg.step, lab);
    el('p', 'p06-task', cfg.task, lab);
    el('div', 'p06-q', `<b>Predict first.</b> ${cfg.predQ}`, lab);
    const predRow = el('div', 'p06-btns', '', lab);
    const S = Stage(el('div', 'p06-stage', '', lab), sc.H);
    const ctl = el('div', 'p06-btns', '', lab), log = el('div', 'p06-log', '', lab);
    const conc = el('div', 'p06-conc', `<div class="p06-q"><b>What did you find?</b> ${cfg.concQ}</div>`, lab), concRow = el('div', 'opts', '', conc), fb = el('div', 'fb', '', conc);
    const notes = ui.box('<div class="p06-notes"><p class="p06-locked">🔒 The notes for this textile appear here when you have finished the station above.</p></div>', { tag: 'Notes' });

    S.tests = Object.assign({}, sv.tests); S.pred = sv.pred || null; S.live = !!S.pred; S.done = !!sv.done; S.concTried = !!sv.concTried; S.mis = (sv.mis || []).slice();
    sc.init(S);
    const allDone = () => cfg.tests.every((t) => S.tests[t.k]);
    const doneText = () => cfg.tests.filter((t) => S.tests[t.k]).map((t) => t.short).join('; ');
    const state = () => ({ pred: S.pred, tests: S.tests, done: S.done, concTried: S.concTried, mis: S.mis });
    const showLog = () => {
      const d = cfg.tests.filter((t) => S.tests[t.k]), left = cfg.tests.length - d.length;
      log.innerHTML = d.map((t) => `<span class="p06-chip">${t.done}</span>`).join('') + (S.done ? '' : left ? `<span class="small">${d.length ? left + ' more to test.' : cfg.todo}${cfg.extra ? ' ' + cfg.extra(S) : ''}</span>` : '');
    };
    S.note = showLog;
    S.mark = (k) => {
      if (S.tests[k]) return; S.tests[k] = true; showLog();
      if (!S.concTried && !S.done) r.set({ answer: `predicted "${S.pred}"; tested: ${doneText()}`, correct: null, sv: state() });
      if (allDone() && !conc.classList.contains('on')) { conc.classList.add('on'); Book.sfx('paper', { gain: 0.4 }); }
    };

    // ---- canvas ----
    let staticL = null;
    S.onFonts = () => { staticL = null; };
    S.render = (dt, now) => {
      if (!staticL) staticL = S.layer((x) => sc.paint(x));
      S.blit(staticL);
      const more = sc.draw(S.ctx, S, dt, now);
      if (!S.live) { const V = box(0, 0, W, sc.H); S.ctx.save(); S.ctx.globalCompositeOperation = 'source-over'; S.ctx.fillStyle = 'rgba(251,250,245,.6)'; path(S.ctx, V); S.ctx.fill(); S.ctx.restore(); text(S.ctx, 'predict first!', W / 2, sc.H / 2, { font: 'hand', size: 34, color: RD, rot: -0.04 }); return false; }
      return more || !!sc.always;
    };
    const go = S.go;
    S.c.addEventListener('pointerdown', (e) => {
      if (!S.live) { Book.toast('Predict first: then the station opens.'); return; }
      const [px, py] = S.pos(e); try { S.c.setPointerCapture(e.pointerId); } catch (er) {}
      sc.down && sc.down(S, px, py); go();
    });
    S.c.addEventListener('pointermove', (e) => { if (sc.move && S.live) { const [px, py] = S.pos(e); sc.move(S, px, py); go(); } });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((n) => S.c.addEventListener(n, () => { sc.up && sc.up(S); go(); }));

    // ---- prediction ----
    const predBtns = cfg.predOpts.map((t) => {
      const b = el('button', 'opt', t, predRow); b.type = 'button'; if (S.pred === t) b.classList.add('sel');
      b.onclick = () => {
        if (S.done || Object.keys(S.tests).length) return;
        predBtns.forEach((q) => q.classList.remove('sel')); b.classList.add('sel'); S.pred = t;
        r.set({ answer: `predicted "${t}" (not tested yet)`, correct: null, sv: state() });
        Book.scribble(0.12); if (!S.live) { S.live = true; ctl.style.display = ''; log.style.display = ''; Book.sfx('pop', { gain: 0.5 }); } go();
      };
      return b;
    });
    sc.controls(S, ctl, go, el);

    // ---- conclusion ----
    function finish(quiet) {
      S.done = true; predBtns.forEach((b) => (b.disabled = true));
      notes.querySelector('.p06-notes').innerHTML = cfg.notes;
      showLog(); if (!quiet) Book.sfx('success', { gain: 0.35 });
    }
    const concBtns = Book.shuffle(cfg.concOpts, cfg.key.length * 7 + 3).map((o) => {
      const b = el('button', 'opt', Book.esc(o.t), concRow); b.type = 'button'; b._ok = !!o.ok;
      b.onclick = () => {
        S.concTried = true; if (o.ok) S.done = true; else if (o.mis && !S.mis.includes(o.mis)) S.mis.push(o.mis);
        b.classList.add(o.ok ? 'right' : 'wrong');
        r.set({ answer: `predicted "${S.pred}"; tested: ${doneText()}; concluded "${o.t}" ${o.ok ? '✓' : '✗'}`, correct: !!o.ok, score: o.ok ? 1 : 0, max: 1, mis: S.mis.join(','), sv: state() });
        if (o.ok) {
          concBtns.forEach((q) => (q.disabled = true));
          const pr = S.pred === cfg.predRight;
          fb.className = 'fb on good'; fb.innerHTML = `✓ ${cfg.right} ${pr ? 'Your prediction was spot on.' : `You predicted “${Book.esc(S.pred)}”: the test has put that right.`} The notes are unlocked below.`;
          finish();
        } else { Book.sfx('error', { gain: 0.3 }); fb.className = 'fb on bad'; fb.innerHTML = '✗ ' + o.why; }
      };
      return b;
    });

    // ---- restore ----
    if (!S.live) { ctl.style.display = 'none'; log.style.display = 'none'; }
    showLog();
    if (allDone()) conc.classList.add('on');
    if (S.done) { concBtns.forEach((q) => { q.disabled = true; if (q._ok) q.classList.add('right'); }); fb.className = 'fb on good'; fb.innerHTML = '✓ ' + cfg.right; finish(true); }
    go();
    return { lab, notes };
  }

  // =========================================================================================================
  Book.page({ id: 'p06', title: 'Technical textiles', build(ui, root) {
    ui.h('Technical textiles');
    ui.p('Most fabrics are chosen for how they <b>look</b> and feel. A <span class="key">technical textile</span> is engineered to do a <b>job</b>. Four test stations: at each one <b>predict</b>, test it yourself, then say what you found.');

    const s1 = Station(ui, {
      key: 'conductive', scene: sceneCond, step: 'Station 1 · the touchscreen glove', label: 'Conductive thread station: predict, 4 tests, conclusion',
      task: 'A phone, two gloves and a <b>fabric badge</b> with a battery and an LED that still need joining up with thread.',
      predQ: 'Which glove will work the phone’s <b>touchscreen</b>?', predOpts: ['the woolly glove', 'the silver-thread glove', 'both of them', 'neither of them'], predRight: 'the silver-thread glove',
      todo: 'Tap the phone with each glove, and sew the badge with each thread.',
      tests: [
        { k: 'gw', short: 'woolly glove: screen did not react', done: '<b>Woolly glove:</b> the screen did not react' },
        { k: 'gs', short: 'silver-thread glove: screen reacted', done: '<b>Silver-thread glove:</b> the screen reacted' },
        { k: 'tc', short: 'cotton thread: LED off', done: '<b>Cotton thread:</b> LED stayed off' },
        { k: 'ts', short: 'silver thread: LED lit', done: '<b>Silver thread:</b> LED lit up' },
      ],
      concQ: 'Why did the <b>silver thread</b> work when the ordinary wool and cotton did not?',
      concOpts: [
        { t: 'Electricity can flow through the silver thread', ok: true },
        { t: 'Silver thread makes the fabric much thinner', mis: 'tech-textile-mixup', why: 'Thickness is not the point. Think about the badge: what had to travel along the thread from the battery to the LED?' },
        { t: 'Silver thread keeps the fingertip much warmer', mis: 'tech-textile-mixup', why: 'Warmth did not light the LED. What had to travel along the thread from the battery to the LED?' },
        { t: 'Tiny capsules in the thread burst on the screen', mis: 'tech-textile-mixup', why: 'Nothing burst. Think about the badge: what had to travel along the thread from the battery to the LED?' },
      ],
      right: 'Silver is a metal, so electricity can flow through the thread: to the LED, and between your finger and the screen.',
      notes: `<p><span class="key">Conductive fabrics</span> contain conductive fibres or threads (e.g. <b>silver</b>, <b>copper</b>, <b>carbon</b> or stainless steel) so <b>electricity can flow through the fabric</b>.</p>
        <p><b>Uses:</b> gloves that work on touchscreens, heated clothing, wearable electronics with sensors (heart-rate shirts), light-up clothing.</p>`,
    });
    const s2 = Station(ui, {
      key: 'flame', scene: sceneFlame, step: 'Station 2 · the flame test', label: 'Flame test station: predict, 3 swatches, conclusion',
      task: 'Three swatches: <b>cotton</b>, <b>polyester</b> and <b>Nomex</b> (an aramid fibre). Pick one up, hold it in the flame for a few seconds, then <b>take it out and keep watching</b>.',
      predQ: 'Which swatch will <b>go out by itself</b> when you take it out of the flame?', predOpts: ['cotton', 'polyester', 'Nomex', 'none of them'], predRight: 'Nomex',
      todo: 'Test all three swatches: in the flame, then out again.',
      tests: [
        { k: 'c', short: 'cotton: caught fire and kept burning', done: '<b>Cotton:</b> caught fire and kept burning out of the flame' },
        { k: 'p', short: 'polyester: shrank, melted and dripped', done: '<b>Polyester:</b> shrank, melted and dripped' },
        { k: 'n', short: 'Nomex: charred a little, went out by itself', done: '<b>Nomex:</b> charred a little, then went out by itself' },
      ],
      concQ: 'Which fabric would you choose for a <b>firefighter’s suit</b>, and why?',
      concOpts: [
        { t: 'Nomex: it does not melt or drip, and it puts itself out', ok: true },
        { t: 'Cotton: it is a natural fibre, so it burns very slowly', mis: 'tech-textile-mixup', why: 'Look at your cotton result: it caught fire and carried on burning. Which swatch stopped by itself?' },
        { t: 'Polyester: it only melts, so it cannot burn the wearer', mis: 'tech-textile-mixup', why: 'Molten plastic dripping onto skin causes terrible burns. Which swatch neither burned away nor dripped?' },
        { t: 'Nomex: its capsules burst and soak the flame in water', mis: 'tech-textile-mixup', why: 'Right fabric, wrong reason: there are no capsules. The fibre itself resists flame. Look at what it did out of the flame.' },
      ],
      right: 'Nomex does not catch fire easily, does not melt or drip, and self-extinguishes.',
      notes: `<p><span class="key">Fire resistant fabrics</span> are made from fibres that are flame resistant in themselves (e.g. <b>Nomex</b>, an aramid) or are treated with a <b>flame retardant finish</b>. They <b>do not catch fire easily</b>, <b>do not melt or drip</b>, and <b>self-extinguish</b>.</p>
        <p><b>Uses:</b> firefighters’ suits, racing drivers’ overalls, oven gloves, furniture and theatre curtains, children’s nightwear (finish).</p>`,
    });
    const s3 = Station(ui, {
      key: 'kevlar', scene: sceneKev, step: 'Station 3 · Kevlar', label: 'Kevlar station: predict, cut test + pull test, conclusion',
      task: '<b>Cut test:</b> slash a cotton glove and a Kevlar glove with the knife. <b>Pull test:</b> three ropes that all <b>weigh the same</b> each hold a load. Keep adding load until all three have snapped.',
      predQ: 'Weight for weight, which rope will hold the <b>biggest load</b>?', predOpts: ['steel wire', 'nylon rope', 'Kevlar rope'], predRight: 'Kevlar rope',
      todo: 'Slash both gloves, then load the ropes until all three snap.',
      tests: [
        { k: 'cc', short: 'cotton glove: sliced open', done: '<b>Cotton glove:</b> sliced open' },
        { k: 'ck', short: 'Kevlar glove: only scratched', done: '<b>Kevlar glove:</b> only scratched' },
        { k: 'r0', short: 'steel wire snapped at 100 kg', done: '<b>Steel wire:</b> snapped at 100 kg' },
        { k: 'r1', short: 'nylon rope snapped at 150 kg', done: '<b>Nylon rope:</b> snapped at 150 kg' },
        { k: 'r2', short: 'Kevlar rope snapped at 500 kg', done: '<b>Kevlar rope:</b> snapped at 500 kg' },
      ],
      concQ: 'Which set of properties makes Kevlar right for a <b>police vest</b>?',
      concOpts: [
        { t: 'Very high tensile strength and cut resistant, yet light and flexible', ok: true },
        { t: 'Very hard and completely rigid, like a thick and heavy steel plate', mis: 'kevlar-props', why: 'Kevlar is a fibre: you just tested it as a glove and a rope. Was it heavy and rigid, or light and flexible?' },
        { t: 'Soft and very stretchy, and it gets even stronger out in sunlight', mis: 'kevlar-props', why: 'Kevlar is not stretchy, and sunlight (UV) actually damages it. What did the knife and the load tell you?' },
        { t: 'A good conductor of electricity that also releases a fresh scent', mis: 'tech-textile-mixup', why: 'Those are two other technical textiles. What did the knife and the load tell you about Kevlar?' },
      ],
      right: 'Your steel wire snapped at 100 kg and the Kevlar at 500 kg: about 5 times stronger for the same weight, and the knife only scratched it.',
      notes: `<p><span class="key">Kevlar</span> is an <b>aramid</b> synthetic fibre: very <b>high tensile strength</b> (about 5 times stronger than steel by weight), lightweight, <b>cut- and puncture-resistant</b>, flexible and heat resistant. It is damaged by UV light.</p>
        <p><b>Uses:</b> bullet-proof (ballistic) vests, cut-resistant gloves, helmets, motorcycle clothing, sails, ropes and tyres.</p>`,
    });
    const s4 = Station(ui, {
      key: 'capsules', scene: sceneCaps, step: 'Station 4 · the scented sock', label: 'Micro-encapsulation station: predict, rub tests, conclusion',
      task: 'This sports sock is made of <b>microfibres</b>. Stuck to the fibres are <b>24 tiny capsules</b> of scent (zoomed in on the right). <b>Rub the sock</b> with your finger, or wear it.',
      predQ: 'You rub the sock <b>once</b>. How many of its capsules will burst?', predOpts: ['all of them', 'a few of them', 'none of them'], predRight: 'a few of them',
      todo: 'Rub or wear the sock at least 3 times and watch the capsules.',
      extra: (S) => (S.ev ? `(${S.ev} so far: ${S.lastK} burst last time)` : ''),
      tests: [{ k: 'r', short: 'rubbed/wore the sock 3+ times: a few capsules burst each time', done: '<b>Each rub or wear:</b> a few capsules burst and gave off scent' }],
      concQ: 'How does a micro-encapsulated fabric <b>release</b> its scent?',
      concOpts: [
        { t: 'Friction from wear bursts a few capsules at a time', ok: true },
        { t: 'All of the capsules dissolve in the very first wash', mis: 'microencap', why: 'Count again: after one wear and wash most capsules were still there. What made a few burst each time?' },
        { t: 'The fibres soak the scent up and sweat it back out', mis: 'microencap', why: 'The scent is sealed inside capsules stuck on the fibres. What happened to a few of them each time you rubbed?' },
        { t: 'A tiny battery in the sock pumps the scent out slowly', mis: 'microencap', why: 'There is no battery or pump. Look at the zoomed-in capsules: what happened to a few of them each time you rubbed?' },
      ],
      right: 'Rubbing (friction) bursts a few capsules each time, so the scent is released slowly, over many wears.',
      notes: `<p><span class="key">Microfibres</span> are ultra-fine synthetic fibres (finer than silk). They make soft, light, breathable, quick-drying fabrics.</p>
        <p><span class="key">Micro-encapsulation</span> traps tiny capsules of a substance (scent, moisturiser, insect repellent, antibacterial, vitamins) on the fibres. The capsules <b>burst slowly with wear and friction</b>, releasing it over time.</p>
        <p><b>Uses:</b> scented or moisturising clothing, antibacterial sports socks, insect-repellent clothing, medical dressings, microfibre cleaning cloths.</p>`,
    });

    ui.h('Which textile?', { size: 40 });
    ui.p('Match each technical textile to a product made from it. <span class="small">The stations and notes blur while you match: recall them!</span>');
    const m = ui.match({ id: 'p06.uses', label: 'Match 4 technical textiles to their uses', q: 'Tap a textile, then tap the product it is used for.',
      pairs: [
        ['Conductive fabric', 'a running shirt with a built-in heart-rate sensor', 'tech-textile-mixup'],
        ['Fire resistant fabric', 'the overalls worn by a racing driver', 'tech-textile-mixup'],
        ['Kevlar', 'a bullet-proof vest for a police officer', 'kevlar-props'],
        ['Micro-encapsulated microfibre', 'socks that slowly release an antibacterial', 'microencap'],
      ] });
    ui.hideWhile(m, 'p06.uses', [s1.lab, s1.notes, s2.lab, s2.notes, s3.lab, s3.notes, s4.lab, s4.notes]);
  } });
})();
