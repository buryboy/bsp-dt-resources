// Page 3 — Inputs: switches. Six working pen-drawn switches (push-to-make, push-to-break, toggle, tilt, reed, micro),
// each wired to a battery and a lamp. Play with each, answer its question, and its notes un-blur. Ends with a match.
(function () {
  'use strict';
  const B = Ink.BLUE, RD = Ink.RED, rgba = Ink.rgba, geo = Ink.geo;
  const HANDF = (s) => `400 ${s}px "Gloria Hallelujah", "Comic Sans MS", cursive`;
  const LABF = (s) => `600 ${s}px Fredoka, "Arial Rounded MT Bold", system-ui, sans-serif`;
  const PAPER = '#fbfaf5';
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const sstep = (a, b, v) => { const u = clamp((v - a) / (b - a)); return u * u * (3 - 2 * u); };
  const close = (P) => P.concat([P[0]]);
  const arc = (cx, cy, rx, ry, a0, a1, n = 24) => { const o = []; for (let i = 0; i <= n; i++) { const a = a0 + ((a1 - a0) * i) / n; o.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); } return o; };
  const box = (x0, y0, w, h) => [[x0, y0], [x0 + w, y0], [x0 + w, y0 + h], [x0, y0 + h]];

  function text(x, s, px, py, o = {}) {
    x.save(); const f = o.font === 'hand' ? HANDF : LABF; x.font = f(o.size || 22);
    x.fillStyle = rgba(o.color || B, o.a ?? 0.92); x.textAlign = o.align || 'left'; x.textBaseline = 'alphabetic';
    x.translate(px, py); if (o.rot) x.rotate(o.rot); x.fillText(s, 0, 0); x.restore();
  }
  function pen(x, pts, o = {}) {
    const P = o.wob === false ? pts : geo.wob(geo.seg(pts, 3), o.seed ?? 11, o.amp ?? 0.6);
    x.save(); x.strokeStyle = rgba(o.color || B, o.a ?? 0.8); x.lineWidth = o.w ?? 1.4; x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath();
    P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); if (o.close) x.closePath(); x.stroke(); x.restore();
  }
  const dot = (x, px, py, r, a = 0.9, c = B) => { x.fillStyle = rgba(c, a); x.beginPath(); x.arc(px, py, r, 0, 7); x.fill(); };
  const blank = (x, P) => { x.save(); x.globalCompositeOperation = 'source-over'; x.fillStyle = PAPER; x.beginPath(); P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.fill(); x.restore(); };
  // a solid piece of metal: hatched hard + outlined
  const metal = (x, P, seed = 3, col = B) => { blank(x, P); Ink.hatchFill(x, P, 1, col, 2.4); Ink.stroke(x, close(P), { w: 2, seed, color: col, retrace: false, amp: 0.4 }); };
  const wire = (x, pts, seed) => Ink.stroke(x, pts, { w: 2.5, seed, amp: 0.5 });
  const zig = (x0, y0, y1, n = 6, w = 11) => { const o = [[x0, y0]]; for (let i = 0; i < n; i++) o.push([x0 + (i % 2 ? -w : w), y0 + ((y1 - y0) * (i + 0.5)) / n]); o.push([x0, y1]); return o; };
  const hint = (x, s, px, py, o = {}) => text(x, s, px, py, Object.assign({ font: 'hand', size: 22, color: RD, align: 'center' }, o));

  const W = 430, HH = 270;
  function Stage(parent) {
    const c = document.createElement('canvas'); parent.appendChild(c);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = Math.round(W * dpr); c.height = Math.round(HH * dpr);
    Object.assign(c.style, { width: '100%', height: 'auto', aspectRatio: W + ' / ' + HH, display: 'block', touchAction: 'pan-y', userSelect: 'none', webkitUserSelect: 'none', webkitTouchCallout: 'none', cursor: 'pointer' });
    const ctx = c.getContext('2d');
    const S = { c, ctx, render: () => false };
    S.pos = (e) => { const r = c.getBoundingClientRect(); return [((e.clientX - r.left) * W) / r.width, ((e.clientY - r.top) * HH) / r.height]; };
    S.layer = (paint) => { const L = document.createElement('canvas'); L.width = Math.ceil(W * dpr); L.height = Math.ceil(HH * dpr); const x = L.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.lineCap = 'round'; x.lineJoin = 'round'; paint(x); return L; };
    const hidden = () => { const p = c.closest('.page'); return !p || p.classList.contains('hidden'); };
    let raf = 0, wait = 0, last = 0;
    const tick = (now) => {
      raf = 0;
      if (hidden()) { last = 0; if (!wait) wait = setTimeout(() => { wait = 0; S.go(); }, 400); return; }
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60; last = now;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.globalCompositeOperation = 'source-over'; ctx.clearRect(0, 0, W, HH);
      ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = 1; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      if (S.render(dt, now / 1000)) raf = requestAnimationFrame(tick); else last = 0;
    };
    S.go = () => { if (!raf) raf = requestAnimationFrame(tick); };
    c.addEventListener('contextmenu', (e) => e.preventDefault());
    return S;
  }

  // battery (top left) and lamp (top right) joined along the top; each switch adds its own two leads
  const LAMP = [352, 38];
  function paintBase(x) {
    const bat = geo.rect(28, 26, 66, 32, 5); Ink.hatchShadow(x, bat, 1, 4, 4); blank(x, bat); Ink.stroke(x, bat, { w: 2.3, seed: 3 });
    Ink.hatchFill(x, box(30, 28, 26, 28), 1, B, 1.8); metal(x, box(94, 36, 6, 12), 4);
    pen(x, [[74, 42], [86, 42]], { w: 2.2, wob: false }); pen(x, [[80, 36], [80, 48]], { w: 2.2, wob: false });
    wire(x, [[100, 42], [300, 42], [300, 62], [342, 62]], 5);
    metal(x, box(342, 56, 20, 12), 6);
    Ink.stroke(x, arc(LAMP[0], LAMP[1], 19, 19, Math.PI * 0.68, Math.PI * 2.32, 22), { w: 2.3, seed: 7 });
    pen(x, [[346, 56], [346, 44], [349, 36], [352, 44], [355, 36], [358, 44], [358, 56]], { w: 1.5, amp: 0.2 });
  }
  function drawLamp(x, g, t) {
    if (g < 0.03) return;
    const gr = x.createRadialGradient(LAMP[0], LAMP[1], 4, LAMP[0], LAMP[1], 62);
    gr.addColorStop(0, `rgba(255,220,30,${0.95 * g})`); gr.addColorStop(0.35, `rgba(255,228,70,${0.7 * g})`); gr.addColorStop(1, 'rgba(255,238,120,0)');
    x.fillStyle = gr; x.fillRect(LAMP[0] - 64, LAMP[1] - 64, 128, 128);
    for (let i = 0; i < 7; i++) { const a = Math.PI * (0.95 + (1.1 * i) / 6), r0 = 25, r1 = 35 + 3 * Math.sin(t * 6 + i * 2); pen(x, [[LAMP[0] + Math.cos(a) * r0, LAMP[1] + Math.sin(a) * r0], [LAMP[0] + Math.cos(a) * r1, LAMP[1] + Math.sin(a) * r1]], { w: 2.4, color: RD, wob: false, a: g }); }
  }
  const housing = (x) => { pen(x, [[190, 150], [128, 150], [128, 238], [302, 238], [302, 150], [240, 150]], { w: 2.6, seed: 21, a: 0.95 }); Ink.hatchFill(x, box(128, 228, 174, 10), 1, B, 1.6); };
  function plunger(x, d, by, st) {
    // spring (under the bar), bar, stem and cap
    pen(x, zig(215, by + 10 + d, 228, 6, 10), { w: 2, wob: false, a: 0.85 });
    metal(x, box(176, by + d, 78, 10), 31);
    const stem = box(208, 126 + d, 14, by - 126); blank(x, stem); Ink.stroke(x, close(stem), { w: 1.8, seed: 32, retrace: false, amp: 0.3 });
    const cap = geo.rect(180, 102 + d, 70, 26, 8); blank(x, cap); Ink.hatchFill(x, cap, 1, RD, 1.5); Ink.stroke(x, cap, { w: 2.4, seed: 33, color: RD });
    if (!st.played) hint(x, 'press & hold', 215, 92);
  }
  const pressSpec = (make) => ({
    init: () => ({ d: 0, down: false }),
    paint(x) {
      paintBase(x); housing(x);
      const py = make ? 202 : 172;
      wire(x, [[28, 42], [14, 42], [14, py + 3], [150, py + 3]], 8); wire(x, [[362, 62], [416, 62], [416, py + 3], [280, py + 3]], 9);
      metal(x, box(150, py, 46, 7), 10); metal(x, box(234, py, 46, 7), 11);
    },
    render(x, st, dt) {
      const tgt = st.down ? 20 : 0; let busy = false;
      if (Math.abs(tgt - st.d) > 0.3) { st.d += Math.sign(tgt - st.d) * Math.min(Math.abs(tgt - st.d), dt * 260); busy = true; } else st.d = tgt;
      plunger(x, st.d, make ? 172 : 179, st);
      st.on = make ? st.d >= 19.5 : st.d < 1.5;
      return busy;
    },
    bind(S, st) {
      S.c.addEventListener('pointerdown', (e) => { st.down = true; try { S.c.setPointerCapture(e.pointerId); } catch (er) {} S.go(); });
      ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((ev) => S.c.addEventListener(ev, () => { st.down = false; S.go(); }));
    },
  });

  const SPECS = {
    ptm: pressSpec(true),
    ptb: pressSpec(false),
    toggle: {
      init: () => ({ a: -0.5, pos: false }),
      paint(x) {
        paintBase(x);
        const h = geo.rect(140, 176, 150, 60, 8); Ink.hatchShadow(x, h, 1, 5, 5); blank(x, h); Ink.stroke(x, h, { w: 2.6, seed: 21 });
        wire(x, [[28, 42], [14, 42], [14, 210], [186, 210]], 8); metal(x, box(184, 204, 12, 12), 10);
        wire(x, [[362, 62], [416, 62], [416, 214], [262, 214], [220, 182]], 9);
      },
      render(x, st, dt) {
        const tgt = st.pos ? 0.5 : -0.5; let busy = false;
        if (Math.abs(tgt - st.a) > 0.01) { st.a += Math.sign(tgt - st.a) * Math.min(Math.abs(tgt - st.a), dt * 7); busy = true; } else st.a = tgt;
        const a = st.a, s = Math.sin(a), c = Math.cos(a), px = 215, py = 178;
        // inner contact arm, lever and ball
        Ink.stroke(x, [[px, py], [px - 30 * s, py + 30 * c]], { w: 4, seed: 41, amp: 0.2 });
        const lv = [[px - 6 * c, py - 6 * s], [px - 6 * c + 58 * s, py - 6 * s - 58 * c], [px + 6 * c + 58 * s, py + 6 * s - 58 * c], [px + 6 * c, py + 6 * s]];
        blank(x, lv); Ink.stroke(x, close(lv), { w: 2.2, seed: 42, amp: 0.3 });
        const ball = geo.ellipse(px + 68 * s, py - 68 * c, 15, 15); blank(x, ball); Ink.hatchFill(x, ball, 1, RD, 1.5); Ink.stroke(x, ball, { w: 2.4, seed: 43, color: RD });
        const pv = geo.ellipse(px, py, 8, 8); blank(x, pv); Ink.stroke(x, pv, { w: 2.2, seed: 44 }); dot(x, px, py, 2.5);
        if (!st.played) hint(x, 'tap to flip', 215, 96);
        st.on = st.a > 0.44;
        return busy;
      },
      bind(S, st) { S.c.addEventListener('click', () => { st.pos = !st.pos; Book.sfx('tick', { gain: 0.5 }); S.go(); }); },
    },
    tilt: {
      init: () => ({ th: -0.3, s: -78, v: 0, drag: null }),
      paint(x) { paintBase(x); wire(x, [[28, 42], [14, 42], [14, 120]], 8); wire(x, [[362, 62], [416, 62], [416, 120]], 9); },
      render(x, st, dt) {
        // the ball rolls downhill inside the tube
        let busy = !!st.drag;
        st.v += 1500 * Math.sin(st.th) * dt; st.v *= 1 - Math.min(1, dt * 1.2); st.s += st.v * dt;
        if (st.s > 57) { if (st.v > 60) Book.sfx('tick', { gain: 0.4 }); st.s = 57; st.v = st.v > 60 ? -st.v * 0.25 : 0; }
        if (st.s < -78) { if (st.v < -60) Book.sfx('tick', { gain: 0.3 }); st.s = -78; st.v = st.v < -60 ? -st.v * 0.25 : 0; }
        if (Math.abs(st.v) > 1 || (st.s > -78 && st.s < 57)) busy = true;
        const C = [215, 172], c = Math.cos(st.th), s = Math.sin(st.th), P = (u, v) => [C[0] + u * c - v * s, C[1] + u * s + v * c];
        // flexible leads to the two pins at the right-hand end
        const pA = P(96, -9), pB = P(96, 9);
        pen(x, geo.curve([416, 120], [420, 150], [pA[0] + 40, pA[1] - 6], pA, 20), { w: 2.6, a: 0.95, wob: false });
        pen(x, geo.curve([14, 120], [12, 262], [pB[0] + 66, Math.min(262, pB[1] + 70)], pB, 30), { w: 2.6, a: 0.95, wob: false });
        x.save(); x.translate(C[0], C[1]); x.rotate(st.th);
        const board = box(-112, 30, 224, 12); Ink.hatchFill(x, board, 1, B, 1.2); Ink.stroke(x, close(board), { w: 2.2, seed: 51, amp: 0.3 });
        pen(x, [[-80, 22], [-80, 30]], { w: 3, wob: false }); pen(x, [[80, 22], [80, 30]], { w: 3, wob: false });
        const tube = geo.rect(-96, -22, 192, 44, 21); blank(x, tube); Ink.stroke(x, tube, { w: 2.6, seed: 52 });
        metal(x, box(72, -12, 26, 6), 53); metal(x, box(72, 6, 26, 6), 54);
        const ball = geo.ellipse(st.s, 0, 15, 15); blank(x, ball); Ink.hatchFill(x, ball, 1, B, 2.2); Ink.stroke(x, ball, { w: 2.4, seed: 55 });
        pen(x, arc(st.s - 4, -4, 6, 6, 3.4, 4.6, 5), { w: 1.6, color: [251, 250, 245], a: 1, wob: false });
        x.restore();
        if (!st.played) { hint(x, 'drag to tilt', 215, 104); pen(x, [[130, 96], [112, 96]], { w: 2.2, color: RD }); pen(x, [[120, 90], [111, 96], [120, 102]], { w: 2.2, color: RD, wob: false }); pen(x, [[300, 96], [318, 96]], { w: 2.2, color: RD }); pen(x, [[310, 90], [319, 96], [310, 102]], { w: 2.2, color: RD, wob: false }); }
        st.on = st.s >= 56.5;
        return busy;
      },
      bind(S, st) {
        S.c.addEventListener('pointerdown', (e) => { st.drag = [S.pos(e)[0], st.th]; try { S.c.setPointerCapture(e.pointerId); } catch (er) {} S.go(); });
        S.c.addEventListener('pointermove', (e) => { if (st.drag) { st.th = clamp(st.drag[1] + (S.pos(e)[0] - st.drag[0]) * 0.006, -0.45, 0.45); S.go(); } });
        ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((ev) => S.c.addEventListener(ev, () => { st.drag = null; }));
      },
    },
    reed: {
      init: () => ({ mx: 76, drag: null }),
      paint(x) {
        paintBase(x);
        wire(x, [[28, 42], [14, 42], [14, 146], [158, 146]], 8); wire(x, [[362, 62], [416, 62], [416, 146], [342, 146]], 9);
        const g = geo.rect(150, 122, 200, 48, 23); Ink.stroke(x, g, { w: 2.4, seed: 21 }); pen(x, arc(250, 146, 88, 18, Math.PI * 1.08, Math.PI * 1.4, 12), { w: 1.2, a: 0.5 });
        pen(x, [[20, 252], [410, 252]], { w: 2, seed: 4 }); const rr = H.rng(5); for (let i = 0; i < 16; i++) { const gx = rr.range(24, 400); pen(x, [[gx, 256], [gx - 6, 264]], { w: 1, a: 0.4, wob: false }); }
      },
      render(x, st, dt, t) {
        const f = sstep(150, 205, st.mx), g = 7 * (1 - f);
        Ink.stroke(x, [[158, 146], [200, 146], [258, 146 - g]], { w: 4, seed: 61, amp: 0.2 });
        Ink.stroke(x, [[342, 146], [300, 146], [242, 148 + g]], { w: 4, seed: 62, amp: 0.2 });
        const m = st.mx, N = box(m - 50, 204, 50, 40), Sx = box(m, 204, 50, 40);
        Ink.hatchShadow(x, box(m - 50, 204, 100, 40), 1, 5, 5); blank(x, box(m - 50, 204, 100, 40));
        Ink.hatchFill(x, N, 1, RD, 1.3); Ink.stroke(x, close(N), { w: 2.4, seed: 63, color: RD, amp: 0.3 }); Ink.stroke(x, close(Sx), { w: 2.4, seed: 64, amp: 0.3 });
        text(x, 'N', m - 25, 233, { size: 26, color: RD, align: 'center' }); text(x, 'S', m + 25, 233, { size: 26, align: 'center' });
        if (f > 0.2) [0, 1, 2].forEach((i) => pen(x, arc(m, 204, 34 + i * 16, 22 + i * 12, Math.PI * 1.15, Math.PI * 1.85, 12), { w: 1.4, color: RD, a: 0.5 * f, wob: false }));
        if (!st.played) { hint(x, 'drag me', m + 106, 220, { align: 'left' }); pen(x, [[m + 62, 224], [m + 98, 224]], { w: 2.2, color: RD }); pen(x, [[m + 88, 217], [m + 99, 224], [m + 88, 231]], { w: 2.2, color: RD, wob: false }); }
        st.on = st.mx >= 203;
        return !!st.drag;
      },
      bind(S, st) {
        S.c.addEventListener('pointerdown', (e) => { st.drag = [S.pos(e)[0], st.mx]; try { S.c.setPointerCapture(e.pointerId); } catch (er) {} S.go(); });
        S.c.addEventListener('pointermove', (e) => { if (st.drag) { st.mx = clamp(st.drag[1] + (S.pos(e)[0] - st.drag[0]), 70, 262); S.go(); } });
        ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((ev) => S.c.addEventListener(ev, () => { st.drag = null; }));
      },
    },
    micro: {
      init: () => ({ xr: 120, drag: null, click: 0 }),
      paint(x) {
        paintBase(x);
        wire(x, [[362, 62], [416, 62], [416, 140], [372, 140]], 9); wire(x, [[28, 42], [14, 42], [14, 256], [398, 256], [398, 186], [372, 186]], 8);
        const body = geo.rect(270, 116, 96, 92, 6); Ink.hatchShadow(x, body, 1, 5, 5); blank(x, body); Ink.hatchFill(x, body, 1, B, 0.6); Ink.stroke(x, body, { w: 2.6, seed: 21 });
        metal(x, box(366, 135, 10, 10), 22); metal(x, box(366, 181, 10, 10), 23);
        Ink.stroke(x, geo.ellipse(292, 190, 6, 6), { w: 1.6, seed: 24, retrace: false }); Ink.stroke(x, geo.ellipse(346, 132, 6, 6), { w: 1.6, seed: 25, retrace: false });
        // the rail the sliding part runs on
        Ink.stroke(x, [[24, 214], [372, 214]], { w: 2.6, seed: 26 }); pen(x, [[24, 222], [372, 222]], { w: 1.6, seed: 27 });
        for (let i = 0; i < 15; i++) pen(x, [[34 + i * 23, 215], [28 + i * 23, 222]], { w: 1.3, wob: false, a: 0.6 });
      },
      render(x, st, dt) {
        const xr = st.xr, push = clamp((xr - 243) / 12), tipx = 249 + 12 * push;
        // button nub, lever (hinged at the top) and roller
        metal(x, box(262 + 5 * push, 158, 8 - 5 * push + 1, 10), 71);
        Ink.stroke(x, [[268, 120], [tipx, 186]], { w: 3.6, seed: 72, amp: 0.2 });
        const ro = geo.ellipse(tipx, 190, 6, 6); blank(x, ro); Ink.stroke(x, ro, { w: 2, seed: 73, retrace: false });
        dot(x, 268, 120, 4);
        // the sliding part (a 3D-printer carriage)
        const car = geo.rect(xr - 84, 150, 84, 54, 6); Ink.hatchShadow(x, car, 1, 5, 5); blank(x, car); Ink.hatchFill(x, car, 1, RD, 1.1); Ink.stroke(x, car, { w: 2.6, seed: 74, color: RD });
        [xr - 66, xr - 18].forEach((wx, i) => { const wh = geo.ellipse(wx, 207, 7, 7); blank(x, wh); Ink.stroke(x, wh, { w: 2, seed: 75 + i, color: RD, retrace: false }); });
        if (!st.played) { hint(x, 'slide me', xr - 42, 136); pen(x, [[xr + 6, 128], [xr + 40, 128]], { w: 2.2, color: RD }); pen(x, [[xr + 30, 121], [xr + 41, 128], [xr + 30, 135]], { w: 2.2, color: RD, wob: false }); }
        const on = xr >= 253;
        if (on && !st.on) st.click = 0.9;
        if (st.click > 0) { st.click -= dt; hint(x, 'click!', 316, 104, { size: 24 }); }
        st.on = on;
        return !!st.drag || st.click > 0;
      },
      bind(S, st) {
        S.c.addEventListener('pointerdown', (e) => { st.drag = [S.pos(e)[0], st.xr]; try { S.c.setPointerCapture(e.pointerId); } catch (er) {} S.go(); });
        S.c.addEventListener('pointermove', (e) => { if (st.drag) { st.xr = clamp(st.drag[1] + (S.pos(e)[0] - st.drag[0]), 112, 255); S.go(); } });
        ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((ev) => S.c.addEventListener(ev, () => { st.drag = null; }));
      },
    },
  };

  const SW = [
    { k: 'ptm', name: 'Push-to-make switch', todo: 'Press and hold the red button. Then let go.',
      label: 'Push-to-make: when is the lamp on?', q: 'When was the lamp <b>on</b>?',
      options: [
        { t: 'Only while I held the button down', ok: true },
        { t: 'Only while I was not touching it', mis: 'switch-type', why: 'Look again: before you touch it there is a gap between the two contacts, so the lamp is off.' },
        { t: 'It stayed on after I let go of it', mis: 'switch-type', why: 'Watch again: as soon as you let go, the spring pushes the bar back up and the gap opens.' },
      ],
      explain: 'Pressing pushes a metal bar across the gap and MAKES the circuit. Let go and the spring breaks it again.',
      note: '<b>Push-to-make (PTM):</b> the circuit is ON only while it is pressed. <i>Doorbell, keyboard key, game controller button.</i>' },
    { k: 'ptb', name: 'Push-to-break switch', todo: 'Press and hold the red button. Then let go.',
      label: 'Push-to-break: what pressing does', q: 'What does <b>pressing</b> this switch do?',
      options: [
        { t: 'It breaks the circuit: the lamp goes off', ok: true },
        { t: 'It makes the circuit: the lamp comes on', mis: 'switch-type', why: 'Try it again: the lamp is already on before you touch it. What changes while you hold the button down?' },
        { t: 'Nothing: the lamp stays on all the time', mis: 'switch-type', why: 'Hold the button right down and watch the metal bar and the lamp.' },
      ],
      explain: 'The metal bar normally joins the two contacts. Pressing pushes it away and BREAKS the circuit until you let go.',
      note: '<b>Push-to-break (PTB):</b> the circuit is OFF only while it is pressed. <i>Fridge door light: the shut door presses the switch, so the light is off.</i>' },
    { k: 'toggle', name: 'Toggle switch', todo: 'Tap the lever. Take your finger away. Tap again.',
      label: 'Toggle switch: best use', q: 'Which of these needs a switch that <b>stays where you leave it</b>, like this one?',
      options: [
        { t: 'The light switch on a bedroom wall', ok: true },
        { t: 'One of the keys on a keyboard', mis: 'switch-type', why: 'A key should only work while your finger is on it, then spring back. This switch does not spring back.' },
        { t: 'A fire button on a game controller', mis: 'switch-type', why: 'A fire button should only work while you press it, then spring back. This switch does not spring back.' },
      ],
      explain: 'A toggle switch latches: it stays on (or off) until you flip it back. Rocker and slide switches do the same.',
      note: '<b>Toggle switch</b> (also rocker or slide): stays in the position you leave it: it <b>latches</b>. <i>Light switch, power switch on a torch.</i>' },
    { k: 'tilt', name: 'Tilt switch', todo: 'Drag left and right to tilt the board. Watch the ball.',
      label: 'Tilt switch: best use', q: 'Which product could use a <b>tilt switch</b>?',
      options: [
        { t: 'An iron that turns off if it is knocked over', ok: true },
        { t: 'A lamp that turns on when the room is dark', mis: 'switch-type', why: 'That needs something that detects light. What did you have to do to this switch to make the ball move?' },
        { t: 'A keypad where every key types one number', mis: 'switch-type', why: 'Keys are pressed, not tipped. What did you have to do to this switch to make the ball move?' },
      ],
      explain: 'When the switch is tipped, the metal ball rolls on to (or off) the two contacts, so the circuit turns on or off.',
      note: '<b>Tilt switch:</b> turns on or off when it is tilted. <i>Alarm if a vending machine is tipped; an iron that switches off if it is knocked over.</i>' },
    { k: 'reed', name: 'Reed switch', todo: 'Drag the red and white bar towards the glass tube, then away.',
      label: 'Reed switch: best use', q: 'Which job could a <b>reed switch</b> do?',
      options: [
        { t: 'Count wheel turns as a magnet on a spoke passes', ok: true },
        { t: 'Turn a heater on when a room becomes too cold', mis: 'switch-type', why: 'That needs something that senses temperature. What did you bring near this switch to close it?' },
        { t: 'Play a note for as long as a piano key is held', mis: 'switch-type', why: 'Nothing pressed on this switch. What did you bring near it to close it?' },
      ],
      explain: 'A reed switch is closed by a magnet coming near: nothing has to touch it. That is how a bike speedometer counts wheel turns.',
      note: '<b>Reed switch:</b> closed by a magnet coming near. <i>Door and window alarm sensors, bike speedometer.</i>' },
    { k: 'micro', name: 'Micro switch', todo: 'Slide the red block along the rail until it meets the lever.',
      label: 'Micro switch: what is special', q: 'What is special about a <b>micro switch</b>?',
      options: [
        { t: 'It needs only a tiny movement or force to work', ok: true },
        { t: 'It works only when a magnet is brought close', mis: 'switch-type', why: 'No magnet here: the block touched the lever. How far did the lever move before the click?' },
        { t: 'It must be tipped over before it will switch on', mis: 'switch-type', why: 'Nothing was tipped: the block touched the lever. How far did the lever move before the click?' },
      ],
      explain: 'The lever only has to move a tiny bit before the switch clicks: ideal for detecting that something has arrived or closed.',
      note: '<b>Micro switch:</b> needs only a tiny movement or force; it often has a lever. <i>Detects a closed door or lid, microwave door, limit of travel on a 3D printer.</i>' },
  ];

  Book.page({
    id: 'p03',
    title: 'Inputs: switches',
    build(ui, root) {
      ui.h('Inputs: switches');
      ui.p('A <span class="key">switch</span> is the simplest input: it is either <b>on</b> or <b>off</b>. Here are six kinds, each wired to a battery and a lamp. The lamp lights when the circuit is complete.');
      ui.p('<b>Play</b> with each switch, then answer its question. <span class="small">The notes for each switch un-blur when you get its question right.</span>');
      const got = (id) => Book.state.items[id];
      const right = (id) => { const it = got(id); return !!(it && it.correct === true); };
      const wraps = [];

      SW.forEach((sw, i) => {
        const spec = SPECS[sw.k], id = 'p03.' + sw.k;
        const wrap = ui.el('div', ''); wrap.style.cssText = 'margin:0 0 calc(var(--R) * 1.2)'; wraps.push(wrap);
        const hd = ui.el('h2', '', `${i + 1}. ${sw.name}`, wrap); hd.style.marginBottom = '0';
        const todo = ui.el('p', '', sw.todo, wrap); todo.style.marginBottom = '6px';
        const flex = ui.el('div', '', '', wrap); flex.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px 18px;align-items:flex-start';
        const left = ui.el('div', '', '', flex); left.style.cssText = 'flex:1 1 330px;max-width:470px;min-width:0';
        const rightCol = ui.el('div', '', '', flex); rightCol.style.cssText = 'flex:1 1 300px;min-width:0';
        const S = Stage(left), st = spec.init(); st.played = right(id) || !!got(id); st.on = null;
        let art = S.layer(spec.paint), glow = 0;
        if (document.fonts) document.fonts.ready.then(() => { art = S.layer(spec.paint); S.go(); });
        const mcq = ui.mcq({ id, label: sw.label, q: sw.q, options: sw.options, explain: sw.explain }); rightCol.appendChild(mcq); mcq.style.marginBottom = '10px';
        const note = ui.el('p', 'small', sw.note, rightCol); note.style.cssText = 'margin:0;padding:0 4px';
        const gate = () => { const open = st.played; mcq.style.opacity = open ? 1 : 0.4; mcq.style.pointerEvents = open ? '' : 'none'; mcq.querySelectorAll('.opt').forEach((b) => { if (!right(id)) b.disabled = !open; }); note.classList.toggle('peek-lock', !right(id)); };
        mcq.addEventListener('click', () => setTimeout(gate, 60));
        let first = true;
        S.render = (dt, t) => {
          const x = S.ctx, was = st.on;
          // work out the state first (on a scratch pass the switch draws itself and sets st.on)
          x.save(); const busy = spec.render(x, st, dt, t); x.restore();
          if (st.on !== was) { if (!first) { Book.sfx('click', { gain: 0.5 }); if (!st.played) { st.played = true; gate(); } } first = false; }
          const tg = st.on ? 1 : 0, moving = Math.abs(tg - glow) > 0.02; glow = moving ? glow + (tg - glow) * Math.min(1, dt * 14) : tg;
          drawLamp(x, glow, t); x.drawImage(art, 0, 0, W, HH);
          return busy || moving || (st.on && (st.drag || st.down));
        };
        spec.bind(S, st); gate(); S.go();
      });

      const sum = ui.box('All six are <b>inputs</b>: each one tells the system that something has happened. A switch has just two states, <b>on</b> or <b>off</b>: that is called a <span class="key">digital</span> signal.', { tag: 'Notes' });

      ui.el('h2', '', 'Which switch for the job?');
      const match = ui.match({ id: 'p03.match', label: 'Match 6 products to the right switch type', q: 'Tap a product, then tap the switch it needs. <span class="small">(Everything above blurs while you match.)</span>',
        pairs: [
          ['Doorbell button', 'push-to-make', 'switch-type'],
          ['Fridge light: off when the door is shut', 'push-to-break', 'switch-type'],
          ['Power switch on a torch', 'toggle (or slide)', 'switch-type'],
          ['Window sensor on a burglar alarm', 'reed switch', 'switch-type'],
          ['Alarm if a vending machine is tipped', 'tilt switch', 'switch-type'],
          ['Checks that a microwave door is closed', 'micro switch', 'switch-type'],
        ] });
      const lockEls = wraps.concat([sum]);
      const matched = () => match.querySelectorAll('.card.right').length >= 12;
      match.addEventListener('pointerdown', () => { if (!matched()) lockEls.forEach((e) => e.classList.add('peek-lock')); }, { passive: true });
      match.addEventListener('click', () => setTimeout(() => { if (matched()) lockEls.forEach((e) => e.classList.remove('peek-lock')); }, 60));
    },
  });
})();
