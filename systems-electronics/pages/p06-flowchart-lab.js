// Page 6 — The flowchart lab. The four flowchart symbols (pen animation of the night-light flowchart with a token
// running round it), a symbol match, then three flowcharts with gaps: the student picks blocks (shape AND text
// matter) from a tray, presses RUN and watches a token follow the flow while a little product responds.
(function () {
  'use strict';
  const B = Ink.BLUE, RD = Ink.RED, GR = Ink.GREEN, rgba = Ink.rgba, geo = Ink.geo;
  const LABF = (s) => `600 ${s}px Fredoka, "Arial Rounded MT Bold", system-ui, sans-serif`;
  const HANDF = (s) => `400 ${s}px "Gloria Hallelujah", "Comic Sans MS", cursive`;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const PAPER = 'rgba(251,250,245,.97)', GLOW = 'rgba(255,222,70,.75)';
  const W = 860, SPEED = 560;

  if (!document.getElementById('p06-css')) {
    const s = document.createElement('style'); s.id = 'p06-css';
    s.textContent = `
      .p06-lab { position: relative; margin: 0 0 calc(var(--R) * 1.2); padding: 12px 16px 16px; background: rgba(251,250,245,.9); }
      .p06-lab > * { position: relative; }
      .p06-step { font: 700 14px Fredoka, system-ui; letter-spacing: .08em; text-transform: uppercase; color: var(--red); line-height: 22px; }
      .p06-task { font-size: 19px; line-height: 1.5; margin: 0 0 6px; }
      .p06-task b { font-family: Fredoka, system-ui; font-weight: 600; }
      .p06-cv { display: block; width: 100%; height: auto; touch-action: pan-y; user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; cursor: pointer; }
      .p06-trayhd { font: 600 16px Fredoka, system-ui; margin: 4px 0 2px; }
      .p06-tray { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; padding: 8px; border: 2px dashed rgba(30,46,150,.3); border-radius: 12px; margin: 0 0 8px; }
      .p06-blk { background: #fff; border: 2px solid rgba(30,46,150,.3); border-radius: 12px; padding: 4px 6px; cursor: pointer; min-height: 52px; line-height: 0; }
      .p06-blk canvas { display: block; width: 178px; height: auto; }
      .p06-blk.used { opacity: .22; pointer-events: none; }
      .p06-blk:disabled { cursor: default; }
      .p06-btns { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
      .p06-btns .btn { margin-top: 0; min-height: 52px; }
      .p06-btns .btn.run { font-size: 21px; padding: 10px 28px; }
      .p06-sym { display: inline-block; vertical-align: middle; width: 112px; height: auto; margin-right: 10px; }
      .p06-notes p { margin: 0 0 6px; display: flex; align-items: center; }
      .p06-notes p > span { flex: 1; }
      .pairs .card .p06-sym { margin: 0 auto; }
      .p06-static { display: block; width: 100%; height: auto; margin: 0 0 8px; }
      @media (max-width: 700px) { .p06-blk canvas { width: 150px; } }
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
  const DIM = { pill: [150, 46], para: [200, 56], rect: [200, 56], diamond: [190, 96] };
  const SHAPE = { pill: 'rounded box', para: 'parallelogram', rect: 'rectangle', diamond: 'diamond' };
  function shapePts(shape, cx, cy, w, h) {
    const x0 = cx - w / 2, y0 = cy - h / 2;
    if (shape === 'pill') return geo.rect(x0, y0, w, h, h / 2 - 1);
    if (shape === 'rect') return geo.rect(x0, y0, w, h, 3);
    if (shape === 'para') { const k = 15; return [[x0 + k, y0], [x0 + w, y0], [x0 + w - k, y0 + h], [x0, y0 + h], [x0 + k, y0], [x0 + k + 9, y0]]; }
    return [[cx, y0], [cx + w / 2, cy], [cx, y0 + h], [cx - w / 2, cy], [cx, y0], [cx + 9, y0 + 4.5]];
  }
  const dims = (b) => [b.w || DIM[b.shape][0], b.h || DIM[b.shape][1]];
  function drawBlock(x, b, cx, cy, o = {}) {
    const [w, h] = dims(b), P = shapePts(b.shape, cx, cy, w, h), col = o.color || B;
    if (o.shadow !== false) Ink.hatchShadow(x, P, 1, 5, 5, col);
    paper(x, P); if (o.tint) tint(x, P, o.tint);
    Ink.stroke(x, P, { w: 2.8, color: col, seed: o.seed ?? (((cx * 3 + cy) | 0) % 61) + 3 });
    const lines = b.text.split('\n'); lines.forEach((s, i) => text(x, s, cx, cy + 8 + (i - (lines.length - 1) / 2) * 25, { size: 22, align: 'center', color: col }));
  }
  function chevron(x, a, b, o = {}) {
    const d = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, ux = (b[0] - a[0]) / d, uy = (b[1] - a[1]) / d, m = [(a[0] + b[0]) / 2 + ux * 6, (a[1] + b[1]) / 2 + uy * 6];
    Ink.stroke(x, [[m[0] - ux * 13 - uy * 8, m[1] - uy * 13 + ux * 8], m, [m[0] - ux * 13 + uy * 8, m[1] - uy * 13 - ux * 8]], { w: 2.6, seed: o.seed || 5, retrace: false, amp: 0.3 });
  }
  function drawEdges(x, prog) {
    prog.edges.forEach((e, i) => {
      const P = e.draw ? e.pts.slice(0, e.draw) : e.pts; Ink.stroke(x, P, { w: 2.4, seed: 11 + i * 3 });
      let ch = e.ch; if (!ch) { let best = 0, bl = 0; for (let k = 0; k < P.length - 1; k++) { const l = Math.hypot(P[k + 1][0] - P[k][0], P[k + 1][1] - P[k][1]); if (l > bl) { bl = l; best = k; } } ch = [best]; }
      ch.forEach((k) => chevron(x, e.pts[k], e.pts[k + 1], { seed: 40 + i + k }));
      if (e.label) text(x, e.exit === 'yes' ? 'Yes' : 'No', e.label[0], e.label[1], { font: 'hand', size: 22, align: 'center' });
    });
  }
  const pathLen = (P) => P.slice(1).reduce((t, p, i) => t + Math.hypot(p[0] - P[i][0], p[1] - P[i][1]), 0);
  function along(P, u) { let d = clamp(u) * pathLen(P); for (let i = 0; i < P.length - 1; i++) { const l = Math.hypot(P[i + 1][0] - P[i][0], P[i + 1][1] - P[i][1]); if (d <= l || i === P.length - 2) { const f = l ? Math.min(1, d / l) : 0; return [lerp(P[i][0], P[i + 1][0], f), lerp(P[i][1], P[i + 1][1], f)]; } d -= l; } return P[P.length - 1]; }
  function token(ctx, p, col = RD) { ctx.save(); ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(p[0], p[1], 13, 0, 7); ctx.fill(); ctx.fillStyle = rgba(col, 0.95); ctx.beginPath(); ctx.arc(p[0], p[1], 9.5, 0, 7); ctx.fill(); ctx.restore(); }
  function bulb(ctx, cx, cy, r, on, time, seed = 60) {
    const G = geo.ellipse(cx, cy, r, r * 1.05), cap = geo.rect(cx - r * 0.45, cy + r * 0.92, r * 0.9, r * 0.6, 4);
    paper(ctx, cap); Ink.hatchFill(ctx, cap, 1, B, 1.6); Ink.stroke(ctx, cap, { w: 2.4, seed: seed + 1 });
    paper(ctx, G); if (on) tint(ctx, G, GLOW); Ink.stroke(ctx, G, { w: 2.8, seed });
    Ink.stroke(ctx, [[cx - r * 0.26, cy + r * 0.9], [cx - r * 0.3, cy + 4], [cx - r * 0.1, cy - r * 0.2], [cx, cy + 4], [cx + r * 0.1, cy - r * 0.2], [cx + r * 0.3, cy + 4], [cx + r * 0.26, cy + r * 0.9]], { w: 1.8, seed: seed + 2, retrace: false, color: on ? RD : B });
    if (on) for (let i = 0; i < 9; i++) { const a = Math.PI + 0.2 + (i / 8) * (Math.PI - 0.4), r0 = r + 12, r1 = r + 28 + (i % 2) * 8 + Math.sin(time * 6 + i) * 2; Ink.stroke(ctx, [[cx + Math.cos(a) * r0, cy + Math.sin(a) * r0], [cx + Math.cos(a) * r1, cy + Math.sin(a) * r1]], { w: 2.2, seed: seed + 5 + i, retrace: false, amp: 0.4 }); }
  }
  function person(ctx, px, gy, ph, a = 1) {
    const sw = Math.sin(ph) * 13, y0 = gy - 142;
    ctx.save(); ctx.globalAlpha = a;
    Ink.stroke(ctx, geo.ellipse(px, y0, 13, 14), { w: 2.4, seed: 81 });
    Ink.stroke(ctx, [[px, y0 + 14], [px, y0 + 82]], { w: 2.6, seed: 82 });
    Ink.stroke(ctx, [[px - 15 - sw * 0.4, y0 + 58], [px, y0 + 30], [px + 15 + sw * 0.4, y0 + 58]], { w: 2.2, seed: 83, retrace: false });
    Ink.stroke(ctx, [[px - sw, y0 + 142], [px, y0 + 82], [px + sw, y0 + 142]], { w: 2.4, seed: 84, retrace: false });
    ctx.restore();
  }
  // a small pen-drawn symbol on its own canvas (notes + the matching activity)
  function symCanvas(kind) {
    const c = document.createElement('canvas'), dpr = Math.min(2, window.devicePixelRatio || 1), w = 124, h = 70; c.className = 'p06-sym'; c.width = w * dpr; c.height = h * dpr; c.style.aspectRatio = w + ' / ' + h;
    const x = c.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.lineCap = x.lineJoin = 'round'; x.globalCompositeOperation = 'multiply';
    if (kind === 'arrow') { Ink.stroke(x, [[18, 35], [104, 35]], { w: 3, seed: 7 }); Ink.stroke(x, geo.head([[18, 35], [104, 35]], 16), { w: 3, seed: 9 }); }
    else if (kind === 'loop') { Ink.stroke(x, [[78, 5], [78, 66]], { w: 2.6, seed: 4 }); const P = [[78, 54], [30, 54], [30, 18], [72, 18]]; Ink.stroke(x, P, { w: 3, seed: 7 }); Ink.stroke(x, geo.head(P, 13), { w: 3, seed: 9 }); }
    else { const P = shapePts(kind, 62, 35, kind === 'diamond' ? 96 : 104, kind === 'diamond' ? 56 : kind === 'pill' ? 40 : 46); Ink.hatchShadow(x, P, 1, 4, 4); Ink.stroke(x, P, { w: 2.8, seed: 13 }); }
    return c;
  }

  // ======================================================================================
  // the three programs
  // ======================================================================================
  const BLK = {
    dark: { shape: 'diamond', text: 'Is it\ndark?', kind: 'decision', cond: (E) => E.dark },
    darkR: { shape: 'rect', text: 'Is it dark?', bad: '“Is it dark?” is a yes / no question. A rectangle has only one way out, so it cannot ask a question.' },
    on: { shape: 'para', text: 'Lamp ON', kind: 'act', act: (E) => { if (!E.lamp) Book.sfx('pop', { gain: 0.35 }); E.lamp = true; E.everOn = true; } },
    off: { shape: 'para', text: 'Lamp OFF', kind: 'act', act: (E) => { E.lamp = false; } },
    onR: { shape: 'rect', text: 'Lamp ON', bad: '“Lamp ON” switches an output. Switching an output needs the input / output symbol, not a rectangle.' },
    stop: { shape: 'pill', text: 'STOP', kind: 'stop' },
    add: { shape: 'rect', text: 'Add 1 to count', kind: 'act', act: (E) => { E.count++; } },
    addP: { shape: 'para', text: 'Add 1 to count', bad: '“Add 1 to count” is something the chip does inside itself: a process. It does not read an input or switch an output, so a parallelogram is the wrong symbol.' },
    cnt10: { shape: 'diamond', text: 'Count\n= 10?', kind: 'decision', cond: (E) => E.count === 10 },
    cnt1: { shape: 'diamond', text: 'Count\n= 1?', kind: 'decision', cond: (E) => E.count === 1 },
    cntR: { shape: 'rect', text: 'Count = 10?', bad: '“Count = 10?” is a yes / no question. A rectangle has only one way out, so it cannot ask a question.' },
    wait10: { shape: 'rect', text: 'Wait 10 s', kind: 'wait', secs: 10 },
    wait30: { shape: 'rect', text: 'Wait 30 s', kind: 'wait', secs: 30 },
    waitD: { shape: 'diamond', text: 'Wait\n30 s', bad: '“Wait 30 s” is not a question, so it cannot be a decision.' },
  };
  Object.keys(BLK).forEach((k) => (BLK[k].id = k));

  // ---- (a) night light: decision + loop ----
  const progA = {
    id: 'p06.prog1', n: 1, H: 480, name: 'Night light', label: 'Flowchart lab 1: night light (decision + loop)',
    task: 'An automatic <b>night light</b>: the lamp must be ON whenever it is dark and OFF whenever it is light, for ever.',
    nodes: { s: { x: 170, y: 40, shape: 'pill', text: 'START', w: 130, kind: 'pass' }, r: { x: 170, y: 128, shape: 'para', text: 'Read light sensor', w: 240, kind: 'pass' }, d: { x: 170, y: 240, slot: 1 }, y: { x: 170, y: 370, slot: 1 }, n: { x: 400, y: 370, slot: 1 } },
    slots: ['d', 'y', 'n'], solution: { d: 'dark', y: 'on', n: 'off' }, tray: ['on', 'darkR', 'stop', 'dark', 'onR', 'off'],
    edges: [
      { from: 's', to: 'r', pts: [[170, 40], [170, 128]] }, { from: 'r', to: 'd', pts: [[170, 128], [170, 240]] },
      { from: 'd', to: 'y', exit: 'yes', pts: [[170, 240], [170, 370]], label: [210, 328] },
      { from: 'd', to: 'n', exit: 'no', pts: [[170, 240], [400, 240], [400, 370]], label: [318, 230], ch: [1] },
      { from: 'y', to: 'r', pts: [[170, 370], [170, 440], [30, 440], [30, 82], [170, 82], [170, 128]], ch: [2, 3] },
      { from: 'n', to: 'r', pts: [[400, 370], [400, 440], [170, 440], [30, 440], [30, 82], [170, 82], [170, 128]], draw: 3, ch: [1] },
    ],
    env() {
      const PH = [[false, 3.2], [true, 4.6], [false, 4.2], [true, 4]];
      const E = { speed: 1, dark: false, lamp: false, t: 0, i: 0, result: null };
      E.tick = (dt) => {
        if (E.result) return; E.t += dt;
        if (E.t < PH[E.i][1]) return;
        if (E.lamp !== E.dark) { E.result = { ok: false, mis: '', msg: E.dark ? 'It is dark, but the lamp is OFF. Follow the token: which way does it leave the decision when it is dark?' : 'It is daylight, but the lamp is ON. Follow the token: which way does it leave the decision when it is light?' }; return; }
        if (E.i === PH.length - 1) { E.result = { ok: true, msg: 'The lamp comes on every night and goes off every morning. The loop keeps the program checking for ever.' }; return; }
        E.i++; E.t = 0; E.dark = PH[E.i][0]; Book.sfx('paper', { gain: 0.3, dur: 0.3 });
      };
      E.stop = () => ({ ok: false, mis: 'flow-loop', msg: 'The program reached STOP, so it never reads the light sensor again. A night light has to loop back and keep checking.' });
      E.draw = (ctx, time) => {
        const R = geo.rect(580, 36, 240, 176, 6);
        paper(ctx, R); if (E.dark) { Ink.hatchFill(ctx, R, 1, B, 2.4); Ink.hatchFill(ctx, geo.rect(582, 38, 236, 172, 4), 1, B, 2.0); }
        const sun = geo.ellipse(760, 88, 24, 24);
        if (E.dark) { paper(ctx, sun); paper(ctx, geo.ellipse(772, 80, 21, 21), 'rgba(170,178,215,1)'); Ink.stroke(ctx, geo.ellipse(760, 88, 24, 24, 0.5, 4.6), { w: 2.4, seed: 21 }); }
        else { tint(ctx, sun, GLOW); Ink.stroke(ctx, sun, { w: 2.6, seed: 23 }); for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2 + time * 0.3; Ink.stroke(ctx, [[760 + Math.cos(a) * 32, 88 + Math.sin(a) * 32], [760 + Math.cos(a) * 44, 88 + Math.sin(a) * 44]], { w: 2, seed: 25 + i, retrace: false, amp: 0.3 }); } }
        Ink.stroke(ctx, R, { w: 3.2, seed: 29 }); Ink.stroke(ctx, [[700, 36], [700, 212]], { w: 2.4, seed: 31 }); Ink.stroke(ctx, [[580, 124], [820, 124]], { w: 2.4, seed: 33 });
        text(ctx, E.dark ? 'night: dark' : 'day: light', 700, 248, { size: 26, align: 'center', color: E.dark ? B : RD });
        bulb(ctx, 700, 326, 40, E.lamp, time);
        text(ctx, 'night light', 700, 416, { font: 'hand', size: 22, align: 'center' });
      };
      return E;
    },
  };

  // ---- (b) count 10 presses, then buzz ----
  const progB = {
    id: 'p06.prog2', n: 2, H: 540, name: 'Press counter', label: 'Flowchart lab 2: count 10 presses then buzz (counter)',
    task: 'A <b>press counter</b>: count the button presses. After exactly <b>10</b> presses, sound the buzzer and stop.',
    nodes: { s: { x: 190, y: 40, shape: 'pill', text: 'START', w: 130, kind: 'pass' }, d1: { x: 190, y: 150, shape: 'diamond', text: 'Button\npressed?', kind: 'decision', cond: (E) => E.take() }, g1: { x: 190, y: 268, slot: 1 }, g2: { x: 190, y: 388, slot: 1 },
      bz: { x: 440, y: 388, shape: 'para', text: 'Buzzer ON', w: 180, kind: 'act', act: (E) => { E.buzz = true; E.buzzAt = E.presses; Book.sfx('error', { gain: 0.4 }); } }, g3: { x: 440, y: 486, slot: 1 } },
    slots: ['g1', 'g2', 'g3'], solution: { g1: 'add', g2: 'cnt10', g3: 'stop' }, tray: ['cnt1', 'addP', 'stop', 'add', 'cntR', 'cnt10', 'wait10'],
    edges: [
      { from: 's', to: 'd1', pts: [[190, 40], [190, 150]] },
      { from: 'd1', to: 'd1', exit: 'no', pts: [[190, 150], [30, 150], [30, 84], [190, 84], [190, 150]], label: [62, 140], ch: [1] },
      { from: 'd1', to: 'g1', exit: 'yes', pts: [[190, 150], [190, 268]], label: [232, 232] },
      { from: 'g1', to: 'g2', pts: [[190, 268], [190, 388]] },
      { from: 'g2', to: 'd1', exit: 'no', pts: [[190, 388], [30, 388], [30, 150], [30, 84], [190, 84], [190, 150]], draw: 3, label: [62, 378], ch: [1] },
      { from: 'g2', to: 'bz', exit: 'yes', pts: [[190, 388], [440, 388]], label: [318, 378] },
      { from: 'bz', to: 'g3', pts: [[440, 388], [440, 486]] },
    ],
    env() {
      const E = { speed: 1, count: 0, pending: false, armed: false, presses: 0, buzz: false, cool: 0.7, finger: 0, result: null };
      E.take = () => { if (!E.pending) { E.armed = true; return false; } E.pending = false; E.armed = false; E.cool = 0.4; return true; };
      E.tick = (dt) => {
        if (E.result) return; E.finger = Math.max(0, E.finger - dt);
        if (E.pending || E.buzz || !E.armed) return;
        E.cool -= dt * E.speed; if (E.cool > 0) return;
        if (E.presses >= 12) { E.result = { ok: false, mis: '', msg: `The button has now been pressed 12 times and the buzzer has not sounded (the count shows ${E.count}). What should happen to the count on every press?` }; return; }
        E.pending = true; E.presses++; E.finger = 0.22; Book.sfx('tick', { gain: 0.55 }); if (E.presses >= 2) E.speed = 3.2;
      };
      E.stop = () => (E.buzz && E.buzzAt === 10 ? { ok: true, msg: 'Ten presses, then the buzzer sounds and the program stops.' }
        : E.buzz ? { ok: false, mis: '', msg: `The buzzer sounded after only ${E.buzzAt} press${E.buzzAt === 1 ? '' : 'es'}, not 10. Check the question in your decision.` }
        : { ok: false, mis: 'flow-loop', msg: 'The program reached STOP before the buzzer had sounded. STOP belongs at the very end.' });
      E.draw = (ctx, time) => {
        const dy = E.finger > 0 ? 12 : 0, hb = geo.rect(590, 142, 130, 44, 6), side = [[612, 124 + dy], [612, 142], [698, 142], [698, 124 + dy]], top = geo.ellipse(655, 124 + dy, 43, 12);
        paper(ctx, hb); Ink.hatchFill(ctx, hb, 0.6, B, 0.8); Ink.stroke(ctx, hb, { w: 2.6, seed: 21 });
        paper(ctx, side); Ink.stroke(ctx, side, { w: 2.4, color: RD, seed: 23 }); paper(ctx, top); Ink.hatchFill(ctx, top, 1, RD, 1.2); Ink.stroke(ctx, top, { w: 2.6, color: RD, seed: 25 });
        const ty = 86 + dy * 2, F = geo.rect(637, ty - 110, 36, 124, 17); paper(ctx, F); Ink.stroke(ctx, F, { w: 2.6, seed: 27 }); Ink.stroke(ctx, geo.rect(645, ty - 18, 20, 24, 8), { w: 1.4, seed: 28, retrace: false });
        text(ctx, 'presses: ' + E.presses, 736, 172, { size: 22 });
        const D = geo.rect(600, 232, 200, 92, 10); Ink.hatchShadow(ctx, D, 1, 6, 6); paper(ctx, D, 'rgba(232,238,226,.95)'); Ink.stroke(ctx, D, { w: 3, seed: 31 });
        text(ctx, String(E.count).padStart(2, '0'), 700, 300, { size: 60, align: 'center' });
        text(ctx, 'count', 700, 354, { font: 'hand', size: 22, align: 'center' });
        const Z = geo.ellipse(700, 416, 36, 36); paper(ctx, Z); if (E.buzz) tint(ctx, Z, GLOW); Ink.hatchFill(ctx, Z, 1, B, 1.0); Ink.stroke(ctx, Z, { w: 2.8, seed: 35 }); ctx.fillStyle = rgba(B, 0.9); ctx.beginPath(); ctx.arc(700, 416, 6, 0, 7); ctx.fill();
        if (E.buzz) { for (let i = 0; i < 3; i++) { const r = 48 + i * 13 + Math.sin(time * 18 + i) * 2; [[-0.6, 0.6], [Math.PI - 0.6, Math.PI + 0.6]].forEach(([a0, a1], j) => Ink.stroke(ctx, geo.ellipse(700, 416, r, r, a0, a1), { w: 2.4, color: RD, seed: 41 + i * 2 + j, retrace: false })); } }
        text(ctx, E.buzz ? 'buzzer: BZZZ!' : 'buzzer', 700, 484, { font: 'hand', size: 22, align: 'center', color: E.buzz ? RD : B });
      };
      return E;
    },
  };

  // ---- (c) security light: lamp on for 30 s after the sensor is triggered, then back to checking ----
  const progC = {
    id: 'p06.prog3', n: 3, H: 556, name: 'Security light', label: 'Flowchart lab 3: security light (timer + loop)',
    task: 'A <b>security light</b>: when the sensor is triggered, the lamp must come on, stay on for <b>30 seconds</b>, go off, then be ready for the next visitor.',
    nodes: { s: { x: 200, y: 40, shape: 'pill', text: 'START', w: 130, kind: 'pass' }, d: { x: 200, y: 150, shape: 'diamond', text: 'Sensor\ntriggered?', w: 204, kind: 'decision', cond: (E) => E.take() }, g1: { x: 200, y: 268, slot: 1 }, g2: { x: 200, y: 366, slot: 1 }, g3: { x: 200, y: 464, slot: 1 } },
    slots: ['g1', 'g2', 'g3'], solution: { g1: 'on', g2: 'wait30', g3: 'off' }, tray: ['off', 'waitD', 'wait30', 'stop', 'on', 'onR'],
    edges: [
      { from: 's', to: 'd', pts: [[200, 40], [200, 150]] },
      { from: 'd', to: 'd', exit: 'no', pts: [[200, 150], [34, 150], [34, 84], [200, 84], [200, 150]], label: [66, 140], ch: [1] },
      { from: 'd', to: 'g1', exit: 'yes', pts: [[200, 150], [200, 268]], label: [242, 232] },
      { from: 'g1', to: 'g2', pts: [[200, 268], [200, 366]] }, { from: 'g2', to: 'g3', pts: [[200, 366], [200, 464]] },
      { from: 'g3', to: 'd', pts: [[200, 464], [200, 528], [372, 528], [372, 84], [200, 84], [200, 150]], ch: [2, 3] },
    ],
    env() {
      const GY = 470, SENS = 610;
      const E = { speed: 1, lamp: false, pending: false, cycle: 0, inCycle: false, onDur: 0, everOn: false, wx: 0, walking: false, nextWalk: 0.9, clock: null, shown: 0, result: null };
      E.take = () => { if (!E.pending) return false; E.pending = false; E.inCycle = true; E.onDur = 0; E.everOn = false; return true; };
      E.wait = (secs, dur) => { E.clock = { p: 0, dur, secs }; if (E.lamp) E.onDur += secs; };
      E.tick = (dt) => {
        if (E.result) return;
        if (!E.walking && E.nextWalk != null) { E.nextWalk -= dt; if (E.nextWalk <= 0) { E.walking = true; E.wx = 430; E.nextWalk = null; } }
        if (E.walking) { const was = E.wx; E.wx += dt * 105; if (was < SENS && E.wx >= SENS) { E.pending = true; Book.sfx('tick', { gain: 0.6 }); } if (E.wx > 760) E.walking = false; }
        if (E.clock) { E.clock.p += dt / E.clock.dur; E.shown = Math.min(E.clock.secs, Math.round(E.clock.p * E.clock.secs)); if (E.clock.p >= 1) E.clock = null; }
      };
      E.arrive = (id) => {
        if (id !== 'd' || !E.inCycle) return; E.inCycle = false;
        if (E.lamp) { E.result = { ok: false, mis: 'flow-loop', msg: 'The visitor has gone but the lamp is still ON: it never switches off. Check the order of your three steps.' }; return; }
        if (!E.onDur) { E.result = { ok: false, mis: 'flow-loop', msg: E.everOn ? 'The lamp only blinked: ON, then straight OFF again. It did not stay on for 30 seconds. Check the order of your three steps.' : 'The lamp never came on. Check your three steps.' }; return; }
        E.cycle++; if (E.cycle >= 2) E.result = { ok: true, msg: 'Lamp on for 30 seconds, off, then back round the loop ready for the next visitor.' }; else { E.nextWalk = 0.5; E.shown = 0; }
      };
      E.stop = () => ({ ok: false, mis: 'flow-loop', msg: 'The program reached STOP. The next visitor will get no light: a security light has to loop back and keep checking the sensor.' });
      E.draw = (ctx, time) => {
        Ink.stroke(ctx, [[410, GY], [846, GY]], { w: 2.6, seed: 21 });
        if (E.lamp) tint(ctx, [[724, 182], [792, 182], [760, GY], [520, GY]], 'rgba(255,222,70,.5)');
        Ink.stroke(ctx, [[800, GY], [800, 140]], { w: 5, seed: 23 });
        const head = [[716, 140], [800, 140], [800, 180], [716, 180], [716, 140]]; paper(ctx, head); if (E.lamp) tint(ctx, head, GLOW); Ink.hatchFill(ctx, head, 0.6, B, 1.0); Ink.stroke(ctx, head, { w: 2.8, seed: 25 });
        if (E.lamp) for (let i = 0; i < 6; i++) { const px = 726 + i * 12, P = [[px, 190], [px - 16 - i * 2, 222 + Math.sin(time * 6 + i) * 2]]; Ink.stroke(ctx, P, { w: 2.2, seed: 61 + i, retrace: false, amp: 0.3 }); }
        text(ctx, E.lamp ? 'lamp ON' : 'lamp off', 758, 124, { size: 22, align: 'center', color: E.lamp ? RD : B });
        const sb = geo.rect(786, 290, 28, 40, 4); paper(ctx, sb); Ink.hatchFill(ctx, sb, 1, B, 1.4); Ink.stroke(ctx, sb, { w: 2.4, seed: 27 }); Ink.stroke(ctx, geo.ellipse(786, 310, 9, 12, Math.PI / 2, Math.PI * 1.5), { w: 2, seed: 29, retrace: false });
        text(ctx, 'sensor', 772, 350, { font: 'hand', size: 22, align: 'right' });
        if (E.pending || (E.walking && E.wx > SENS - 30 && E.wx < SENS + 60)) [0, 1, 2].forEach((i) => Ink.stroke(ctx, geo.ellipse(776, 310, 14 + i * 11, 18 + i * 12, Math.PI * 0.75, Math.PI * 1.25), { w: 2.2, color: RD, seed: 31 + i, retrace: false }));
        if (E.walking) person(ctx, E.wx, GY, E.wx * 0.09, E.wx > 700 ? clamp((760 - E.wx) / 60) : 1);
        // stopwatch
        const C = [510, 130], dial = geo.ellipse(C[0], C[1], 46, 46); paper(ctx, dial); Ink.stroke(ctx, dial, { w: 2.8, seed: 41 }); Ink.stroke(ctx, geo.rect(C[0] - 8, C[1] - 60, 16, 12, 3), { w: 2, seed: 43, retrace: false });
        for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; Ink.stroke(ctx, [[C[0] + Math.cos(a) * 38, C[1] + Math.sin(a) * 38], [C[0] + Math.cos(a) * 44, C[1] + Math.sin(a) * 44]], { w: 1.4, seed: 45 + i, retrace: false, amp: 0.2 }); }
        const ha = -Math.PI / 2 + (E.clock ? E.clock.p : 0) * Math.PI * 2; ctx.save(); ctx.strokeStyle = rgba(RD, 0.92); ctx.lineWidth = 3.4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(C[0], C[1]); ctx.lineTo(C[0] + Math.cos(ha) * 34, C[1] + Math.sin(ha) * 34); ctx.stroke(); ctx.restore();
        text(ctx, E.shown + ' s', C[0], C[1] + 82, { size: 26, align: 'center', color: E.clock ? RD : B });
        text(ctx, 'visitors: ' + (E.cycle + (E.inCycle ? 1 : 0)), 430, 40, { size: 22 });
      };
      return E;
    },
  };

  // ---- the flowchart for the last question (all boxes fixed; never run) ----
  const progT = {
    H: 470, nodes: { s: { x: 320, y: 40, shape: 'pill', text: 'START', w: 130 }, r: { x: 320, y: 128, shape: 'para', text: 'Read temperature', w: 240 }, d: { x: 320, y: 244, shape: 'diamond', text: 'Hotter than\n25 °C?', w: 226, h: 110 }, y: { x: 320, y: 376, shape: 'para', text: 'Fan ON' }, n: { x: 560, y: 376, shape: 'para', text: 'Fan OFF' } },
    edges: [
      { pts: [[320, 40], [320, 128]] }, { pts: [[320, 128], [320, 244]] }, { exit: 'yes', pts: [[320, 244], [320, 376]], label: [364, 338] }, { exit: 'no', pts: [[320, 244], [560, 244], [560, 376]], label: [476, 234], ch: [1] },
      { pts: [[320, 376], [320, 440], [150, 440], [150, 82], [320, 82], [320, 128]], ch: [2, 3] }, { pts: [[560, 376], [560, 440], [320, 440]], ch: [1] },
    ],
  };

  // ======================================================================================
  // one lab: flowchart with gaps + tray + RUN
  // ======================================================================================
  function Lab(ui, prog, hooks) {
    const el = ui.el, Hh = prog.H;
    const r = ui.record(prog.id, { label: prog.label, type: 'flowchart', max: 1 });
    const lab = el('div', 'p06-lab'); requestAnimationFrame(() => Ink.frame(lab, { shadow: false, w: 2.2 }));
    el('div', 'p06-step', `Program ${prog.n} · ${prog.name}`, lab);
    el('p', 'p06-task', prog.task + ' Tap a gap, then tap the block that belongs there. <b>The shape matters as well as the words.</b>', lab);
    const c = document.createElement('canvas'); c.className = 'p06-cv'; lab.appendChild(c);
    const dpr = Math.min(2, window.devicePixelRatio || 1); c.width = W * dpr; c.height = Hh * dpr; c.style.aspectRatio = W + ' / ' + Hh;
    const ctx = c.getContext('2d');
    el('div', 'p06-trayhd', 'Blocks:', lab);
    const tray = el('div', 'p06-tray', '', lab);
    const btns = el('div', 'p06-btns', '', lab), runB = el('button', 'btn run', '▶ RUN', btns), clrB = el('button', 'btn ghost', 'Clear', btns); runB.type = clrB.type = 'button';
    const fb = el('div', 'fb', '', lab);

    const placed = {}; let sel = prog.slots[0], running = false, solved = false, runs = 0, env = prog.env(), R = null, res = null, errAt = null;
    const prev = r.get(); if (prev) runs = prev.runs || 0;
    const full = () => prog.slots.every((s) => placed[s]);
    const outs = (id) => prog.edges.filter((e) => e.from === id);

    // ---- canvas ----
    let L = null, raf = 0, last = 0, time = 0;
    function paint() {
      L = document.createElement('canvas'); L.width = W * dpr; L.height = Hh * dpr; const x = L.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.lineCap = x.lineJoin = 'round';
      drawEdges(x, prog);
      Object.entries(prog.nodes).forEach(([id, n]) => {
        if (!n.slot) return drawBlock(x, n, n.x, n.y);
        if (placed[id]) return drawBlock(x, BLK[placed[id]], n.x, n.y);
        const P = geo.rect(n.x - 100, n.y - 32, 200, 64, 14); paper(x, P);
        x.save(); x.strokeStyle = rgba(B, 0.7); x.lineWidth = 2.4; x.setLineDash([9, 8]); x.beginPath(); x.roundRect(n.x - 100, n.y - 32, 200, 64, 14); x.stroke(); x.restore();
        text(x, '?', n.x, n.y + 11, { size: 32, align: 'center', a: 0.6 });
      });
    }
    function draw() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, Hh); ctx.globalCompositeOperation = 'multiply'; ctx.lineCap = ctx.lineJoin = 'round';
      ctx.drawImage(L, 0, 0, W, Hh);
      if (sel && !running && !solved) { const n = prog.nodes[sel], hh = placed[sel] && BLK[placed[sel]].shape === 'diamond' ? 58 : 42; ctx.save(); ctx.strokeStyle = rgba(RD, 0.9); ctx.lineWidth = 3.4; ctx.setLineDash([10, 8]); ctx.beginPath(); ctx.roundRect(n.x - 110, n.y - hh, 220, hh * 2, 16); ctx.stroke(); ctx.restore(); }
      env.draw(ctx, time);
      if (R) {
        if (R.phase === 'dwell') { const n = prog.nodes[R.at], b = n.slot ? BLK[placed[R.at]] : n; if (b) { const [w, h] = dims(b); tint(ctx, shapePts(b.shape, n.x, n.y, w, h), errAt ? 'rgba(240,120,120,.55)' : GLOW); } token(ctx, [n.x - dims(b || { shape: 'rect' })[0] / 2 + 4, n.y]); }
        else token(ctx, along(R.edge.pts, R.u));
        if (errAt) { const n = prog.nodes[errAt]; Ink.cross(ctx, n.x + 122, n.y, 1.5); }
      }
      if (res) Ink.drawBubble(ctx, res.ok ? 'it works!' : 'not yet…', prog === progC ? 600 : 700, Hh - 10, 34, res.ok ? GR : RD, 1, -0.03, 'center');
    }
    const hidden = () => { const p = c.closest('.page'); return !p || p.classList.contains('hidden'); };
    function frame(now) {
      raf = 0; if (hidden()) { if (running) { running = false; R = null; env = prog.env(); sync(); draw(); } return; }
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016); last = now; time += dt;
      if (running) step(dt);
      draw();
      if (running) raf = requestAnimationFrame(frame);
    }
    function go() { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } }

    // ---- the interpreter ----
    function arrive(id) {
      R.at = id; R.phase = 'dwell'; R.dwell = 0.26; R.exit = null;
      const n = prog.nodes[id], b = n.slot ? BLK[placed[id]] : n, o = outs(id);
      if (n.slot) {
        if (b.kind === 'stop') return end(env.stop());
        let msg = null;
        if (o.length === 2 && b.shape !== 'diamond') msg = `“${b.text.replace('\n', ' ')}” is in a ${SHAPE[b.shape]}, but this step has two ways out (Yes and No). Only one symbol can ask a question.`;
        else if (o.length < 2 && b.shape === 'diamond') msg = `A diamond is a decision: it needs two ways out, Yes and No. This step has only one way out.`;
        else if (b.bad) msg = b.bad;
        else if (!o.length) msg = 'There is nothing after this step. A program that finishes must end with the terminator symbol.';
        if (msg) { errAt = id; return end({ ok: false, mis: 'flow-symbol', msg }); }
      }
      env.arrive && env.arrive(id);
      if (b.kind === 'decision') R.exit = b.cond(env) ? 'yes' : 'no';
      if (b.kind === 'act') b.act(env);
      if (b.kind === 'wait') { R.dwell = b.secs / 10; env.wait && env.wait(b.secs, R.dwell); Book.sfx('tick', { gain: 0.4 }); }
    }
    function step(dt) {
      env.tick(dt); if (env.result) return end(env.result);
      if (R.phase === 'dwell') {
        R.dwell -= dt * env.speed; if (R.dwell > 0) return;
        const o = outs(R.at); R.edge = o.length === 1 ? o[0] : o.find((e) => e.exit === R.exit); R.len = pathLen(R.edge.pts); R.u = 0; R.phase = 'move';
      } else { R.u += (dt * SPEED * env.speed) / R.len; if (R.u >= 1) arrive(R.edge.to); }
    }
    function end(v) {
      running = false; res = v; solved = !!v.ok;
      const ans = prog.slots.map((s, i) => `gap ${i + 1} = ${SHAPE[BLK[placed[s]].shape]} “${BLK[placed[s]].text.replace('\n', ' ')}”`).join(', ');
      r.set({ answer: `run ${runs}: ${ans} → ${v.ok ? 'works ✓' : 'does not work ✗'}`, correct: !!v.ok, score: v.ok ? 1 : 0, max: 1, mis: v.ok ? '' : v.mis || '', runs, blocks: prog.slots.map((s) => placed[s]) });
      Book.sfx(v.ok ? 'success' : 'error', { gain: 0.4 });
      fb.className = 'fb on ' + (v.ok ? 'good' : 'bad'); fb.innerHTML = (v.ok ? '✓ ' : '✗ ') + v.msg + (v.ok ? '' : ' <b>Tap a block in the flowchart to change it</b>, then run it again.');
      sync(); draw(); hooks.onRun && hooks.onRun();
    }
    function start() {
      if (running || !full()) return;
      runs++; env = prog.env(); res = null; errAt = null; sel = null; running = true; fb.className = 'fb';
      R = { at: 's', phase: 'dwell', dwell: 0.35, exit: null, edge: null, u: 0, len: 1 };
      Book.sfx('pop', { gain: 0.5 }); sync(); go();
    }

    // ---- tray + editing ----
    const blkBtns = {};
    prog.tray.forEach((k) => {
      const b = BLK[k], bt = el('button', 'p06-blk', '', tray), cv = document.createElement('canvas'), [w, h] = dims(b), cw = 214, chh = h + 18; bt.type = 'button'; bt.setAttribute('aria-label', SHAPE[b.shape] + ': ' + b.text.replace('\n', ' ')); bt.dataset.k = k;
      cv.width = cw * dpr; cv.height = chh * dpr; cv.style.aspectRatio = cw + ' / ' + chh; bt.appendChild(cv);
      const paintB = () => { const x = cv.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, cw, chh); x.lineCap = x.lineJoin = 'round'; x.globalCompositeOperation = 'multiply'; drawBlock(x, b, cw / 2 - 2, chh / 2 - 2, { seed: 7 + k.length * 3 }); };
      paintB(); if (document.fonts) document.fonts.ready.then(paintB);
      bt.onclick = () => {
        if (running || solved) return;
        if (!sel) sel = prog.slots.find((s) => !placed[s]); if (!sel) { Book.toast('Tap a block in the flowchart first to swap it.'); return; }
        placed[sel] = k; Book.sfx('stamp', { gain: 0.4 }); res = null; errAt = null; R = null; env = prog.env();
        sel = prog.slots.find((s) => !placed[s]) || null; paint(); sync(); draw(); go();
      };
      blkBtns[k] = bt;
    });
    function sync() {
      const used = Object.values(placed);
      Object.entries(blkBtns).forEach(([k, bt]) => { bt.classList.toggle('used', used.includes(k)); bt.disabled = running || solved; });
      runB.disabled = running || !full(); runB.textContent = running ? 'running…' : solved ? '▶ RUN again' : '▶ RUN'; clrB.disabled = running || solved || !used.length;
    }
    const pos = (e) => { const q = c.getBoundingClientRect(); return [((e.clientX - q.left) * W) / q.width, ((e.clientY - q.top) * Hh) / q.height]; };
    c.addEventListener('click', (e) => {
      if (running || solved) return; const [x, y] = pos(e);
      const hit = prog.slots.find((s) => Math.abs(x - prog.nodes[s].x) < 112 && Math.abs(y - prog.nodes[s].y) < 50);
      if (!hit) return;
      if (placed[hit]) { delete placed[hit]; res = null; errAt = null; R = null; env = prog.env(); fb.className = 'fb'; paint(); }
      sel = hit; Book.sfx('tick', { gain: 0.5 }); sync(); draw(); go();
    });
    runB.onclick = start;
    clrB.onclick = () => { prog.slots.forEach((s) => delete placed[s]); sel = prog.slots[0]; res = null; errAt = null; R = null; env = prog.env(); fb.className = 'fb'; paint(); sync(); draw(); go(); };

    if (prev && prev.correct) { Object.assign(placed, prog.solution); solved = true; sel = null; res = { ok: true }; fb.className = 'fb on good'; fb.innerHTML = '✓ You got this program working.'; }
    paint(); sync(); draw(); if (document.fonts) document.fonts.ready.then(() => { paint(); draw(); });
    lab.addEventListener('pointerdown', () => hooks.onTouch && hooks.onTouch(), { passive: true });
    return { lab, done: () => { const it = r.get(); return !!it && (it.correct === true || it.attempts >= 3); }, go };
  }

  // ======================================================================================
  Book.page({ id: 'p06', title: 'The flowchart lab', build(ui, root) {
    ui.h('The flowchart lab');
    ui.p('A microcontroller only does what its <b>program</b> tells it. One way to write a program is as a <span class="key">flowchart</span>: boxes joined by arrows. Watch the night-light program being drawn, then follow the red token round it.');

    // ---- the animation: the night-light flowchart draws itself, then a token runs round it ----
    const cx = 250, NIGHT = [[cx, 125], [cx, 235], [cx, 365], [cx, 432], [60, 432], [60, 82], [cx, 82], [cx, 125]], DAY = [[cx, 125], [cx, 235], [500, 235], [500, 365], [500, 432], [60, 432], [60, 82], [cx, 82], [cx, 125]];
    const tOn = 9.6 + 5.4 * ((110 + 130) / pathLen(NIGHT)), tOff = 15.4 + 5.6 * ((110 + 250 + 130) / pathLen(DAY));
    const anim = ui.anim({ w: 860, h: 480, duration: 22, poster: 9.2,
      draw(k, t) {
        const S = (shape, x, y, w, h) => shapePts(shape, x, y, w, h), TX = (s, x, y, a, b) => k.text(s, x, y + 8, a, b, { size: 23, align: 'center' });
        const st = S('pill', cx, 40, 130, 44); k.shadow(st, 0.9, 1.1); k.line(st, 0.2, 0.9); TX('START', cx, 40, 0.6, 1.0);
        k.arrow([[cx, 62], [cx, 97]], 1.1, 1.4);
        const rd = S('para', cx, 125, 250, 54); k.shadow(rd, 2.2, 2.4); k.line(rd, 1.4, 2.2); TX('Read light sensor', cx, 125, 1.8, 2.5);
        k.arrow([[cx, 152], [cx, 183]], 2.5, 2.8);
        const dm = S('diamond', cx, 235, 210, 100); k.shadow(dm, 3.7, 3.9); k.line(dm, 2.8, 3.7); TX('Is it dark?', cx, 235, 3.3, 3.9);
        k.arrow([[cx, 285], [cx, 336]], 4.0, 4.4); k.text('Yes', cx + 14, 320, 4.2, 4.5, { size: 22 });
        const on = S('para', cx, 365, 190, 54); k.shadow(on, 5.1, 5.3); k.line(on, 4.4, 5.1); TX('Lamp ON', cx, 365, 4.8, 5.3);
        k.arrow([[355, 235], [500, 235], [500, 336]], 5.4, 6.0); k.text('No', 420, 262, 5.6, 5.9, { size: 22 });
        const of = S('para', 500, 365, 190, 54); k.shadow(of, 6.7, 6.9); k.line(of, 6.0, 6.7); TX('Lamp OFF', 500, 365, 6.4, 6.9);
        k.line([[500, 392], [500, 432], [cx, 432]], 7.0, 7.4); k.arrow([[cx, 392], [cx, 432], [60, 432], [60, 82], [cx - 4, 82]], 7.2, 8.2);
        // red pen: what each symbol is
        k.text('terminator', 332, 48, 8.2, 8.5, { size: 22, color: RD }); k.text('input / output', 392, 118, 8.4, 8.8, { size: 22, color: RD });
        k.text('decision: 2 exits', 366, 206, 8.6, 9.0, { size: 22, color: RD }); k.text('loop: go back and check again', 78, 468, 8.8, 9.2, { size: 22, color: RD });
        // the product + the token
        if (t >= 9.2) {
          const c = k.ctx, dark = t < 15.4, lampOn = t >= tOn && t < tOff;
          text(c, dark ? 'it is dark' : 'it is light', 740, 150, { font: 'hand', size: 26, align: 'center', color: dark ? B : RD });
          bulb(c, 740, 236, 44, lampOn, t); text(c, 'lamp', 740, 330, { font: 'hand', size: 22, align: 'center' });
          if (t >= 9.6 && t < 21) token(c, dark ? along(NIGHT, (t - 9.6) / 5.4) : along(DAY, (t - 15.4) / 5.6));
        }
        k.text('…for ever!', 420, 468, 21, 21.8, { size: 22 });
      },
      sound(k) { [[0.2, 0.7], [1.4, 0.8], [2.8, 0.9], [4.4, 0.7], [6.0, 0.7], [7.2, 1.0]].forEach(([t, d]) => k.play('stroke', t, { material: 'pen', dur: d, gain: 0.5 })); k.play('pop', tOn, { gain: 0.4 }); k.play('pop', tOff, { gain: 0.3 }); k.play('paper', 15.4, { gain: 0.3 }); },
    });

    const notes = ui.box(`<div class="p06-notes">
      <p><i data-s="pill"></i><span><span class="key">Terminator</span> (rounded box): <b>START</b> or <b>STOP</b>.</span></p>
      <p><i data-s="para"></i><span><span class="key">Input / output</span> (parallelogram): read a sensor or switch, or switch an output on or off.</span></p>
      <p><i data-s="rect"></i><span><span class="key">Process</span> (rectangle): do something, e.g. “wait 5 seconds”, “add 1 to count”.</span></p>
      <p><i data-s="diamond"></i><span><span class="key">Decision</span> (diamond): a yes / no question, e.g. “Is it dark?”. It has <b>two exits</b>: Yes and No.</span></p>
      <p><i data-s="arrow"></i><span><span class="key">Arrows</span> show the order (the flow). A <b>loop</b> goes back to an earlier step, so the program keeps checking.</span></p></div>`, { tag: 'Notes' });
    notes.querySelectorAll('i[data-s]').forEach((i) => i.replaceWith(symCanvas(i.dataset.s)));

    ui.p('Now match each symbol to its job. <span class="small">The notes and the animation blur while you work.</span>');
    const hide = [notes, root.querySelector('canvas.ink-anim')];
    const match = ui.match({ id: 'p06.symbols', label: 'Match 6 flowchart symbols to their meaning', q: 'Tap a symbol, then tap what it means.',
      pairs: [['rounded box', 'START or STOP', 'flow-symbol'], ['parallelogram', 'Read a sensor, or switch an output on or off', 'flow-symbol'], ['rectangle', 'Do something: wait 5 seconds, add 1 to count', 'flow-symbol'],
        ['diamond', 'Ask a yes / no question (two exits)', 'flow-symbol'], ['arrow', 'Shows the order of the steps', 'flow-symbol'], ['arrow going back', 'Go back to an earlier step and check again', 'flow-loop']] });
    const kinds = ['pill', 'para', 'rect', 'diamond', 'arrow', 'loop'];
    [...match.querySelectorAll('.pairs .card')].filter((c, i) => i % 2 === 0).forEach((c, i) => { c.innerHTML = ''; c.setAttribute('aria-label', kinds[i]); c.appendChild(symCanvas(kinds[i])); });
    ui.hideWhile(match, 'p06.symbols', hide);

    // ---- the lab ----
    ui.h('Program the chip', { size: 40 });
    ui.p('Three programs have boxes missing. Finish each one, then press <b>RUN</b>: the red token follows your flowchart and the product does exactly what your program says, right or wrong.');
    const labs = []; let cur = null;
    const lock = (on) => hide.forEach((e) => (e.closest('.ink-anim-wrap') || e).classList.toggle('peek-lock', on));
    [progA, progB, progC].forEach((p, i) => {
      const lb = Lab(ui, p, {
        onTouch: () => { if (!lb.done()) { cur = lb; lock(true); Ink.stopAll(root); } },
        onRun: () => { if (cur === lb && lb.done()) lock(false); },
      });
      labs.push(lb);
    });

    // ---- check: trace a flowchart ----
    ui.h('Follow the flow', { size: 40 });
    ui.p('This flowchart controls a desk fan.');
    const sc = document.createElement('canvas'), dpr = Math.min(2, window.devicePixelRatio || 1); sc.className = 'p06-static'; sc.width = W * dpr; sc.height = progT.H * dpr; sc.style.aspectRatio = W + ' / ' + progT.H; root.appendChild(sc);
    const paintT = () => { const x = sc.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, W, progT.H); x.lineCap = x.lineJoin = 'round'; x.globalCompositeOperation = 'multiply'; drawEdges(x, progT); Object.values(progT.nodes).forEach((n) => drawBlock(x, n, n.x, n.y)); };
    paintT(); if (document.fonts) document.fonts.ready.then(paintT);
    ui.mcq({ id: 'p06.trace', label: 'Trace the fan flowchart: what happens after Fan ON?',
      q: 'The room is at <b>30 °C</b> and the program has just reached <b>Fan ON</b>. What does the program do next?',
      options: [
        { t: 'Goes back and reads the temperature again', ok: true, why: 'The arrow from Fan ON loops back to “Read temperature”, so the program keeps checking. When the room cools below 25 °C it will take the No exit and switch the fan off.' },
        { t: 'Stops, because the fan is now switched on', mis: 'flow-loop', why: 'There is no STOP box here. Follow the arrow that leaves Fan ON: where does it go?' },
        { t: 'Moves across to Fan OFF and switches it off', mis: 'flow-loop', why: 'No arrow joins Fan ON to Fan OFF. Follow the arrow that leaves Fan ON: where does it go?' },
        { t: 'Waits at Fan ON until the room has cooled', mis: 'flow-loop', why: 'A program never waits unless a box tells it to. Follow the arrow that leaves Fan ON: where does it go?' },
      ] });
  } });
})();
