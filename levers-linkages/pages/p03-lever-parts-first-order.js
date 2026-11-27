// Page 3 — Levers: the three parts. A crowbar animation, a "label it" activity on three levers, then first order levers.
(function () {
  'use strict';
  const B = Ink.BLUE, RD = Ink.RED, GR = Ink.GREEN, rgba = Ink.rgba, geo = Ink.geo;
  const HANDF = (s) => `400 ${s}px "Gloria Hallelujah", "Comic Sans MS", cursive`;
  const LABF = (s) => `700 ${s}px Fredoka, "Arial Rounded MT Bold", system-ui, sans-serif`;
  const ease = (u) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2);
  function pen(x, pts, o = {}) {
    const P = o.wob === false ? pts : geo.wob(geo.seg(pts, 3), o.seed ?? 11, o.amp ?? 0.6);
    x.save(); x.strokeStyle = rgba(o.color || B, o.a ?? 0.8); x.lineWidth = o.w ?? 1.4; x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath();
    P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); if (o.close) x.closePath(); x.stroke(); x.restore();
  }
  const close = (P) => P.concat([P[0]]);
  const dot = (x, px, py, r, a = 0.9, c = B) => { x.fillStyle = rgba(c, a); x.beginPath(); x.arc(px, py, r, 0, 7); x.fill(); };
  const punch = (x, P) => { x.save(); x.globalCompositeOperation = 'destination-out'; x.beginPath(); P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.closePath(); x.fill(); x.restore(); };
  // a straight bar from a to b, half-width h0 at a and h1 at b -> closed outline
  const bar = (a, b, h0, h1 = h0) => { const d = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, nx = -(b[1] - a[1]) / d, ny = (b[0] - a[0]) / d; return [[a[0] + nx * h0, a[1] + ny * h0], [b[0] + nx * h1, b[1] + ny * h1], [b[0] - nx * h1, b[1] - ny * h1], [a[0] - nx * h0, a[1] - ny * h0]]; };
  const rotE = (cx, cy, rx, ry, ang, n = 30) => { const o = []; for (let i = 0; i <= n; i++) { const t = (i / n) * Math.PI * 2 - 1.2, ex = Math.cos(t) * rx, ey = Math.sin(t) * ry; o.push([cx + ex * Math.cos(ang) - ey * Math.sin(ang), cy + ex * Math.sin(ang) + ey * Math.cos(ang)]); } return o; };
  // a fist gripping something at (cx,cy), knuckles along angle ang
  function fist(x, cx, cy, ang, s = 1, seed = 3) {
    const P = rotE(cx, cy, 20 * s, 15 * s, ang);
    punch(x, P); Ink.stroke(x, P, { w: 2.2, seed });
    for (let i = -1; i <= 1; i++) { const ox = Math.cos(ang) * i * 9 * s, oy = Math.sin(ang) * i * 9 * s, px = -Math.sin(ang), py = Math.cos(ang); pen(x, [[cx + ox - px * 13 * s, cy + oy - py * 13 * s], [cx + ox + px * 3 * s, cy + oy + py * 3 * s]], { w: 1.4, wob: false, a: 0.75 }); }
  }

  // ---------- the three levers to label (860 wide). Each returns its hotspots. ----------
  const LEVERS = [
    {
      id: 'seesaw', name: 'A see-saw', h: 344,
      blurb: 'A hand pushes one end down to lift the child.',
      spots: [{ x: 84, y: 66, to: [150, 104], ans: 'L' }, { x: 430, y: 304, to: [430, 268], ans: 'F' }, { x: 628, y: 122, to: [690, 196], ans: 'E' }],
      right: 'The hand <b>pushes</b> (effort), the plank turns on the <b>triangle</b> (fulcrum) and the <b>child</b> is lifted (load).',
      paint(x) {
        Ink.stroke(x, [[30, 262], [830, 262]], { w: 2.4, seed: 3 });
        const rr = H.rng(5); for (let i = 0; i < 30; i++) { const gx = rr.range(36, 820); pen(x, [[gx, 267], [gx - 8, 277]], { w: 1, a: 0.4, wob: false }); }
        const tri = [[392, 262], [430, 194], [468, 262]]; Ink.hatchShadow(x, tri, 1, 6, 6); Ink.hatchFill(x, tri, 1, B, 1.1); Ink.stroke(x, close(tri), { w: 2.6, seed: 4 });
        const pl = bar([138, 146], [722, 234], 6); Ink.stroke(x, close(pl), { w: 2.5, seed: 6 });
        pen(x, [[200, 157], [380, 184]], { w: 1, a: 0.5 }); pen(x, [[470, 199], [660, 227]], { w: 1, a: 0.5, seed: 4 });
        // the child sitting on the high end, holding the handle
        Ink.stroke(x, [[214, 150], [214, 118]], { w: 2.4, seed: 7 }); Ink.stroke(x, [[204, 118], [224, 118]], { w: 2.6, seed: 8 });
        const body = [[166, 100], [192, 100], [196, 146], [164, 144]]; Ink.hatchFill(x, body, 1, B, 1.1); Ink.stroke(x, close(body), { w: 2.2, seed: 9 });
        Ink.stroke(x, [[188, 108], [204, 126], [213, 120]], { w: 2.2, seed: 10 });
        Ink.stroke(x, [[170, 142], [206, 150], [204, 190]], { w: 2.3, seed: 11 }); Ink.stroke(x, [[178, 150], [196, 156], [194, 190]], { w: 2, seed: 12 });
        Ink.stroke(x, [[194, 190], [212, 192]], { w: 2.4, seed: 13 });
        Ink.stroke(x, geo.ellipse(180, 78, 19, 20), { w: 2.3, seed: 14 });
        pen(x, [[162, 74], [150, 82], [146, 98]], { w: 2, a: 0.9 }); pen(x, [[163, 66], [170, 56], [182, 56], [194, 62], [198, 72]], { w: 2, a: 0.9 });
        dot(x, 184, 76, 2); dot(x, 193, 76, 2); pen(x, geo.curve([182, 86], [186, 90], [191, 90], [194, 85], 8), { w: 1.6 });
        // the pushing hand on the low end
        const arm = bar([842, 122], [716, 214], 15, 13); Ink.stroke(x, [arm[0], arm[1]], { w: 2.3, seed: 15 }); Ink.stroke(x, [arm[3], arm[2]], { w: 2.3, seed: 16 });
        pen(x, [[800, 134], [790, 162]], { w: 1.5 }); pen(x, [[806, 136], [796, 164]], { w: 1.5 });
        fist(x, 704, 218, 0.15, 1.1, 17);
        [[742, 250], [756, 244], [730, 256]].forEach(([a, b], i) => pen(x, [[a, b - 16], [a, b]], { w: 1.6, wob: false, a: 0.6 }));
      },
    },
    {
      id: 'scissors', name: 'Scissors', h: 344,
      blurb: 'Fingers squeeze the handles and the blades cut the card.',
      spots: [{ x: 66, y: 172, to: [226, 172], ans: 'L' }, { x: 420, y: 300, to: [420, 190], ans: 'F' }, { x: 806, y: 172, to: [756, 172], ans: 'E', fork: [[744, 112], [744, 232]] }],
      right: 'Your fingers squeeze the <b>handles</b> (effort), each half turns on the <b>screw</b> (fulcrum) and the <b>card</b> resists the blades (load).',
      paint(x) {
        const pv = [420, 172];
        // the strip of card being cut
        const card = [[236, 62], [278, 58], [282, 284], [240, 288]];
        Ink.hatchFill(x, card, 1, B, 0.45); Ink.stroke(x, close(card), { w: 2, seed: 3 });
        const half = (tip, loop, seed) => {
          const bl = bar(pv, tip, 15, 2); Ink.hatchFill(x, bl, 1, B, 0.7); Ink.stroke(x, close(bl), { w: 2.3, seed });
          const hd = bar(pv, loop, 13, 9); Ink.stroke(x, [hd[0], hd[1]], { w: 2.3, seed: seed + 1 }); Ink.stroke(x, [hd[3], hd[2]], { w: 2.3, seed: seed + 2 });
          const ang = Math.atan2(loop[1] - pv[1], loop[0] - pv[0]);
          const out = rotE(loop[0] + Math.cos(ang) * 30, loop[1] + Math.sin(ang) * 30, 52, 31, ang), inn = rotE(loop[0] + Math.cos(ang) * 30, loop[1] + Math.sin(ang) * 30, 37, 17, ang);
          punch(x, out); Ink.hatchFill(x, out, 1, B, 1.3); punch(x, inn); Ink.stroke(x, out, { w: 2.4, seed: seed + 3 }); Ink.stroke(x, inn, { w: 1.8, seed: seed + 4, retrace: false });
        };
        half([150, 126], [660, 222], 5); half([150, 218], [660, 122], 20);
        const sc = geo.ellipse(pv[0], pv[1], 9, 9); punch(x, sc); Ink.stroke(x, sc, { w: 2.2, seed: 40 }); pen(x, [[414, 168], [426, 176]], { w: 1.8, wob: false });
        // squeeze arrows on the handles
        Ink.stroke(x, [[690, 52], [690, 76]], { w: 2.4, seed: 41 }); Ink.stroke(x, [[682, 66], [690, 78], [698, 66]], { w: 2.4, seed: 42, retrace: false });
        Ink.stroke(x, [[690, 292], [690, 268]], { w: 2.4, seed: 43 }); Ink.stroke(x, [[682, 278], [690, 266], [698, 278]], { w: 2.4, seed: 44, retrace: false });
      },
    },
    {
      id: 'hammer', name: 'A claw hammer pulling out a nail', h: 384,
      blurb: 'A hand pulls the handle and the claw drags the nail out of the wood.',
      spots: [{ x: 150, y: 176, to: [282, 212], ans: 'L' }, { x: 640, y: 246, to: [455, 296], ans: 'F' }, { x: 280, y: 50, to: [410, 62], ans: 'E' }],
      right: 'The hand pulls the <b>handle</b> (effort), the hammer head rocks on the <b>wood</b> (fulcrum) and the <b>nail</b> is pulled out (load).',
      paint(x) {
        const WY = 300, S = 1.5, th = (18 * Math.PI) / 180, u = [Math.cos(th), Math.sin(th)], hv = [Math.sin(th), -Math.cos(th)];
        const O = [380, WY - S * (u[1] * 52 - hv[1] * 19) + 1], P = (s, n) => [O[0] + S * (u[0] * s + hv[0] * n), O[1] + S * (u[1] * s + hv[1] * n)];
        const claw = (s) => 0.003 * (s + 18) * (s + 18);
        // the block of wood
        const wd = [[60, WY], [800, WY], [800, 362], [60, 362]]; Ink.stroke(x, close(wd), { w: 2.4, seed: 3 });
        const rr = H.rng(8); for (let j = 0; j < 5; j++) { const yy = WY + 8 + j * 11, pts = [], ph = rr() * 6; for (let xx = 66; xx <= 794; xx += 8) pts.push([xx, yy + Math.sin(xx * 0.02 + ph) * 2.5]); pen(x, pts, { w: 1, a: 0.5, seed: j }); }
        Ink.hatchFill(x, [[780, WY], [800, WY], [800, 362], [780, 362]], 1, B, 1.4);
        // the handle (wooden, with a rubber grip) and the hand pulling it
        const hl = [P(-8, 14), P(-7, 60), P(-10, 150)], hr = [P(8, 14), P(7, 60), P(10, 150)];
        Ink.stroke(x, hl, { w: 2.5, seed: 4 }); Ink.stroke(x, hr, { w: 2.5, seed: 5 });
        Ink.stroke(x, geo.curve(hl[2], P(-9, 158), P(9, 158), hr[2], 10), { w: 2.5, seed: 6 });
        pen(x, [P(-8, 96), P(8, 96)], { w: 1.4 });
        for (let n = 100; n < 150; n += 7) pen(x, [P(-8, n), P(8, n + 4)], { w: 1.1, wob: false, a: 0.55 });
        const arm = bar(P(118, 128), P(16, 128), 15, 13); Ink.stroke(x, [arm[0], arm[1]], { w: 2.3, seed: 7 }); Ink.stroke(x, [arm[3], arm[2]], { w: 2.3, seed: 8 });
        fist(x, P(0, 128)[0], P(0, 128)[1], th - Math.PI / 2, 1.3, 9);
        // the head: striking face on the right, curved claw on the left
        const top = [], bot = [];
        for (let s = -18; s >= -92; s -= 6) { const c = claw(s), t = 2 + 13 * Math.pow(1 - (-18 - s) / 74, 0.8); top.push(P(s, c + t)); bot.push(P(s, c - t)); }
        const all = [P(50, -19), P(58, -16), P(58, 16), P(50, 19), P(40, 13), P(24, 15)].concat(top, bot.slice().reverse(), [P(24, -15), P(40, -13)]);
        punch(x, all); Ink.hatchFill(x, all, 1, B, 1.5); Ink.stroke(x, close(all), { w: 2.6, seed: 10 });
        pen(x, [P(40, -13), P(40, 13)], { w: 1.5 }); pen(x, [P(50, -19), P(50, 19)], { w: 1.5 });
        // the nail, part way out, its head caught in the claw
        const sN = -62, nh = P(sN, claw(sN) + 7), nx = nh[0];
        Ink.stroke(x, [[nx - 14, nh[1] - 4], [nx + 14, nh[1] - 4]], { w: 3.6, seed: 11 });
        const bt = P(sN, claw(sN) - 6)[1];
        Ink.stroke(x, [[nx - 3.5, bt + 2], [nx - 3.5, WY]], { w: 1.9, seed: 12, retrace: false }); Ink.stroke(x, [[nx + 3.5, bt], [nx + 3.5, WY]], { w: 1.9, seed: 13, retrace: false });
        pen(x, [[nx - 14, WY - 5], [nx - 6, WY + 1]], { w: 1.4 }); pen(x, [[nx + 14, WY - 5], [nx + 6, WY + 1]], { w: 1.4 });
        // pull arrow above the arm
        const a0 = P(34, 150), a1 = P(96, 150); Ink.stroke(x, [a0, a1], { w: 2.4, seed: 14 }); Ink.stroke(x, geo.head(geo.seg([a0, a1], 4), 13, 0.55), { w: 2.4, seed: 15, retrace: false });
      },
    },
  ];
  const WORD = { F: 'fulcrum', E: 'effort', L: 'load' };
  const DEFN = { F: 'The <b>fulcrum</b> is the fixed point the lever turns about.', E: 'The <b>effort</b> is the force you put in.', L: 'The <b>load</b> is the thing being moved or cut.' };

  Book.page({
    id: 'p03',
    title: 'Levers: the three parts',
    build(ui, root) {
      const got = (id) => Book.state.items[id];
      ui.h('Levers: the three parts');
      const notes = ui.box('A <span class="key">lever</span> is a rigid bar that turns about a fixed point. Every lever has <b>three parts</b>:<br><b class="red">Fulcrum</b> (or <b>pivot</b>): the fixed point the lever turns about.<br><b class="red">Effort</b>: the input force you apply.<br><b class="red">Load</b>: the output force, the thing being moved.', { tag: 'Notes' });
      ui.p('Watch a <b>crowbar</b> lift a heavy crate. Tap the picture to play.');

      // ------------------------------------------------------------------ the crowbar animation
      const PV = [345, 316], TIP = [250, 347], END = [770, 177], C0 = [100, 350];
      const anim = ui.anim({
        w: 860, h: 440, duration: 15, poster: 4.4,
        draw(k, t) {
          const x = k.ctx, a = ease(k.win(10, 11.8)) * 0.17;
          const rise = (PV[0] - TIP[0]) * Math.sin(a) + (TIP[1] - PV[1]) * (1 - Math.cos(a)), b = -Math.asin(Math.min(1, rise / 150));
          k.line([[30, 350], [830, 350]], 0.1, 0.8, { w: 2.4, seed: 3 });
          // the crate (tips up about its far corner)
          x.save(); x.translate(C0[0], C0[1]); x.rotate(b); x.translate(-C0[0], -C0[1]);
          const cr = [[100, 210], [250, 210], [250, 350], [100, 350]];
          k.line(close(cr), 0.7, 1.6, { w: 2.8, seed: 4 });
          k.line([[100, 232], [250, 232]], 1.5, 1.7, { w: 1.8, seed: 5, retrace: false }); k.line([[100, 328], [250, 328]], 1.6, 1.8, { w: 1.8, seed: 6, retrace: false });
          k.line([[122, 232], [122, 328]], 1.7, 1.85, { w: 1.6, seed: 7, retrace: false }); k.line([[228, 232], [228, 328]], 1.8, 1.95, { w: 1.6, seed: 8, retrace: false });
          k.hatch([[100, 210], [250, 210], [250, 232], [100, 232]], 2.0, 2.4, { density: 0.9 }); k.hatch([[100, 328], [250, 328], [250, 350], [100, 350]], 2.1, 2.5, { density: 0.9 });
          k.text('200 kg', 175, 292, 2.2, 2.6, { size: 24, align: 'center' });
          x.restore();
          // the block the bar rests on
          const bl = [[318, 320], [372, 320], [376, 350], [314, 350]];
          k.hatch(bl, 2.9, 3.3, { density: 1.4 }); k.line(close(bl), 2.6, 3.0, { w: 2.6, seed: 11 });
          // the crowbar (turns about the top of the block)
          x.save(); x.translate(PV[0], PV[1]); x.rotate(a); x.translate(-PV[0], -PV[1]);
          const bp = bar(TIP, END, 5);
          k.line([[236, 354], [244, 345], bp[0], bp[1], bp[2], bp[3], [244, 353], [236, 354]], 3.0, 3.9, { w: 2.5, seed: 12 });
          // the hand on the far end
          if (t > 3.9) { const p = k.win(3.9, 4.3); x.globalAlpha = p; fist(x, END[0] - 8, END[1] - 2, -0.32, 1.15, 13); x.globalAlpha = 1; }
          k.line([[784, 160], [850, 150]], 4.0, 4.2, { w: 2.3, seed: 14 }); k.line([[790, 188], [852, 180]], 4.1, 4.3, { w: 2.3, seed: 15 });
          x.restore();
          // effort arrow follows the hand down
          const ey = (END[0] - PV[0]) * Math.sin(a) + (END[1] - PV[1]) * (Math.cos(a) - 1);
          k.arrow([[764, 70 + ey], [764, 146 + ey]], 6.9, 7.5, { color: RD, w: 3.2, seed: 16 });
          // labels
          k.circle(PV[0], PV[1] + 2, 20, 4.8, 5.3, { color: RD, w: 2.4 });
          k.arrow([[345, 388], [345, 344]], 5.2, 5.6, { color: RD, w: 2.8, seed: 17 });
          k.text('FULCRUM', 345, 420, 5.4, 6.0, { font: 'bubble', size: 32, color: RD, align: 'center' });
          k.text('(pivot) the fixed point', 446, 400, 5.9, 6.5, { size: 22 }); k.text('it turns about', 446, 428, 6.4, 6.8, { size: 22 });
          k.text('EFFORT', 748, 60, 7.3, 7.9, { font: 'bubble', size: 32, color: RD, align: 'right' });
          k.text('the force you put in', 748, 92, 7.8, 8.4, { size: 22, align: 'right' });
          k.arrow([[175, 124], [175, 198]], 8.6, 9.1, { color: RD, w: 3.2, seed: 18 });
          k.text('LOAD', 175, 66, 8.9, 9.4, { font: 'bubble', size: 32, color: RD, align: 'center' });
          k.text('the thing being moved', 175, 102, 9.3, 9.9, { size: 22, align: 'center' });
          k.text('push DOWN here… the crate goes UP!', 640, 336, 12.2, 13.8, { size: 22, align: 'center', color: RD });
          if (a > 0.01) [0, 1, 2].forEach((i) => pen(x, [[262 + i * 12, 352], [262 + i * 12, 352 - rise * 0.8]], { w: 1.4, wob: false, a: 0.5 }));
        },
        sound(k) {
          k.play('stroke', 0.1, { material: 'pen', dur: 0.7, gain: 0.5 }); k.play('stroke', 0.7, { material: 'pen', dur: 1.6, gain: 0.5 });
          k.play('stroke', 2.6, { material: 'pen', dur: 0.5, gain: 0.5 }); k.play('stroke', 3.0, { material: 'pen', dur: 0.9, gain: 0.5 });
          [5.4, 7.3, 8.9].forEach((a) => { k.play('pop', a - 0.5, { gain: 0.3 }); k.play('stroke', a, { material: 'pen', dur: 0.6, gain: 0.5 }); });
          k.play('riser', 10, { dur: 1.8, gain: 0.3 }); k.play('thud', 11.8, { gain: 0.3 });
          k.play('stroke', 12.2, { material: 'pen', dur: 1.5, gain: 0.5 }); k.play('success', 13.9, { f: 'G5', gain: 0.45 });
        },
      });
      const animWrap = root.querySelector('.ink-anim-wrap');

      // ------------------------------------------------------------------ label it
      ui.el('h2', '', 'Label it!');
      ui.p('Three more levers. On each one, tap where the <b>fulcrum (F)</b>, <b>effort (E)</b> and <b>load (L)</b> are, then check. <span class="small">(The notes and the crowbar blur while you work.)</span>');
      const labWrap = ui.el('div', '');
      const r = ui.record('p03.label', { label: 'Label fulcrum / effort / load on 3 levers (see-saw, scissors, claw hammer)', type: 'label', max: 9 });
      const saved = (r.get() || {}).levers || {};
      let labelStarted = !!r.get(), recallStarted = !!(got('p03.blanks') || got('p03.tf'));
      const W = 860, dpr = Math.min(2, window.devicePixelRatio || 1);
      const units = LEVERS.map((L, li) => {
        const sv = saved[L.id] || {};
        const U = { L, tries: sv.n || 0, done: !!sv.done, score: sv.sc ?? null, vals: [null, null, null], marks: [null, null, null], sel: null, last: sv.last || '' };
        if (U.done) { U.vals = L.spots.map((s) => s.ans); U.marks = U.score === 3 ? [true, true, true] : ['c', 'c', 'c']; }
        const d = ui.el('div', 'act', '', labWrap); requestAnimationFrame(() => Ink.frame(d, { shadow: false, w: 2.2 }));
        ui.el('div', 'q', `<b>${li + 1}. ${L.name}.</b> ${L.blurb}`, d);
        const c = document.createElement('canvas'); d.appendChild(c); c.width = W * dpr; c.height = L.h * dpr;
        Object.assign(c.style, { width: '100%', height: 'auto', aspectRatio: W + ' / ' + L.h, display: 'block', touchAction: 'manipulation', userSelect: 'none', webkitUserSelect: 'none', cursor: 'pointer' });
        const ctx = c.getContext('2d');
        let art = null;
        const mkArt = () => { art = document.createElement('canvas'); art.width = W * dpr; art.height = L.h * dpr; const x = art.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.lineCap = 'round'; x.lineJoin = 'round'; L.paint(x); };
        const row = ui.el('div', '', '', d); row.style.cssText = 'display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:8px';
        const toks = {};
        ['F', 'E', 'L'].forEach((k) => { const b = ui.el('button', 'opt', `<b style="font:700 22px Fredoka">${k}</b> ${WORD[k]}`, row); b.type = 'button'; b.style.cssText = 'flex:0 0 auto;min-width:118px;text-align:center;padding:6px 12px'; toks[k] = b; b.onclick = () => tapTok(k); });
        const chk = ui.el('button', 'btn', 'Check', row); chk.style.marginTop = '0';
        const prompt = ui.el('div', 'small', '', d); prompt.style.cssText = 'margin-top:6px;min-height:26px';
        const f = ui.el('div', 'fb', '', d);

        const placed = (k) => U.vals.indexOf(k);
        function draw() {
          if (!art) mkArt();
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.globalCompositeOperation = 'source-over'; ctx.clearRect(0, 0, W, L.h);
          ctx.globalCompositeOperation = 'multiply'; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
          ctx.drawImage(art, 0, 0, W, L.h);
          L.spots.forEach((s, i) => {
            const v = U.vals[i], m = U.marks[i], col = m === true ? GR : m === false || m === 'c' ? RD : B, R = 32;
            // leader line from the circle to the part
            const dd = Math.hypot(s.to[0] - s.x, s.to[1] - s.y), st = [s.x + ((s.to[0] - s.x) / dd) * (R + 3), s.y + ((s.to[1] - s.y) / dd) * (R + 3)];
            pen(ctx, [st, s.to], { w: 1.8, color: RD, seed: 5 + i, a: 0.85 });
            if (s.fork) s.fork.forEach((q, j) => pen(ctx, [s.to, q], { w: 1.8, color: RD, seed: 9 + j, a: 0.85 })); else dot(ctx, s.to[0], s.to[1], 3.4, 0.9, RD);
            const P = geo.ellipse(s.x, s.y, R, R);
            if (v) { Ink.hatchShadow(ctx, P, 1, 5, 5, col); Ink.stroke(ctx, P, { w: 2.8, color: col, seed: 20 + i });
              ctx.font = LABF(38); ctx.textAlign = 'center'; ctx.fillStyle = rgba(col, 0.95); ctx.fillText(v, s.x, s.y + 13);
              if (m === true) Ink.tick(ctx, s.x + 22, s.y - 24, 0.9); if (m === false) Ink.cross(ctx, s.x + 30, s.y - 28, 0.8);
            } else {
              for (let q = 0; q < P.length - 2; q += 4) pen(ctx, [P[q], P[q + 2]], { w: 2, wob: false, a: 0.7 });
              ctx.font = HANDF(30); ctx.textAlign = 'center'; ctx.fillStyle = rgba(B, 0.45); ctx.fillText('?', s.x, s.y + 11);
            }
          });
        }
        function ui2() {
          ['F', 'E', 'L'].forEach((k) => { toks[k].classList.toggle('sel', U.sel === k && !U.done); toks[k].style.opacity = placed(k) >= 0 ? 0.4 : 1; toks[k].disabled = U.done; });
          chk.disabled = U.done || U.vals.includes(null);
          prompt.innerHTML = U.done ? '' : U.sel ? `Now tap the circle that points to the <b>${WORD[U.sel]}</b>.` : U.vals.includes(null) ? 'Tap a label, then tap a circle.' : 'All three placed. Tap a circle to change it, or <b>Check</b>.';
          draw();
        }
        const nextTok = () => ['F', 'E', 'L'].find((k) => placed(k) < 0) || null;
        const touched = () => { if (!labelStarted) { labelStarted = true; } U.marks = U.marks.map((m, i) => (U.vals[i] ? m : null)); sync(); };
        function tapTok(k) {
          if (U.done) return; Book.sfx('tick', { gain: 0.5 });
          const i = placed(k); if (i >= 0) { U.vals[i] = null; U.marks[i] = null; }
          U.sel = k; touched(); ui2();
        }
        c.addEventListener('pointerdown', () => { if (!U.done && !labelStarted) { labelStarted = true; sync(); } }, { passive: true });
        c.addEventListener('click', (e) => {
          if (U.done) return;
          const rc = c.getBoundingClientRect(), px = ((e.clientX - rc.left) * W) / rc.width, py = ((e.clientY - rc.top) * L.h) / rc.height;
          let best = -1, bd = 58; L.spots.forEach((s, i) => { const q = Math.hypot(px - s.x, py - s.y); if (q < bd) { bd = q; best = i; } });
          if (best < 0) return;
          if (U.vals[best]) { U.sel = U.vals[best]; U.vals[best] = null; U.marks[best] = null; Book.sfx('tick', { gain: 0.5 }); }
          else { if (!U.sel) U.sel = nextTok(); U.vals[best] = U.sel; U.marks[best] = null; U.sel = nextTok(); Book.scribble(0.14); }
          touched(); ui2();
        });
        chk.onclick = () => {
          if (U.done || U.vals.includes(null)) return;
          U.tries++; U.marks = L.spots.map((s, i) => U.vals[i] === s.ans); U.score = U.marks.filter(Boolean).length;
          const ok = U.score === 3; Book.sfx(ok ? 'success' : 'error', { gain: 0.35 });
          U.last = L.spots.map((s, i) => `${WORD[s.ans]} ${U.marks[i] ? '✓' : '✗(' + U.vals[i] + ')'}`).join(' ');
          if (ok) { U.done = true; f.className = 'fb on good'; f.innerHTML = '✓ ' + L.right; }
          else if (U.tries >= 2) { // show the answers after two goes
            U.done = true; U.vals = L.spots.map((s) => s.ans); U.marks = ['c', 'c', 'c'];
            f.className = 'fb on bad'; f.innerHTML = `✗ ${U.score}/3 that time, so here are the answers. ` + L.right;
          } else {
            const bad = L.spots.filter((s, i) => !U.marks[i]).map((s) => s.ans);
            f.className = 'fb on bad'; f.innerHTML = `✗ ${U.score}/3. Tap the red ones to move them. ` + ['F', 'E', 'L'].filter((k) => bad.includes(k)).slice(0, 2).map((k) => DEFN[k]).join(' ');
          }
          U.sel = null; commit(!ok); ui2(); sync();
        };
        if (U.done) { f.className = 'fb on ' + (U.score === 3 ? 'good' : 'bad'); f.innerHTML = (U.score === 3 ? '✓ ' : 'The answers: ') + L.right; }
        U.refresh = () => { art = null; ui2(); };
        ui2();
        return U;
      });
      if (document.fonts) document.fonts.ready.then(() => units.forEach((U) => U.refresh()));
      function commit(wrong) {
        const checked = units.filter((U) => U.tries > 0), all = units.every((U) => U.done), score = units.reduce((s, U) => s + (U.score || 0), 0);
        const levers = {}; units.forEach((U) => (levers[U.L.id] = { n: U.tries, done: U.done, sc: U.score, last: U.last }));
        const old = (r.get() || {}).mis || '';
        r.set({ answer: checked.map((U) => `${U.L.id}: ${U.last}${U.tries > 1 ? ' (2nd go)' : ''}`).join('; '), correct: all ? score === 9 : null, score, max: 9, mis: wrong || old ? 'fulcrum-load-effort' : '', levers });
      }

      // ------------------------------------------------------------------ first order
      ui.el('h2', '', 'Spot the pattern');
      const order = ui.box('Look where the <b>fulcrum</b> was every time: <b>in the middle</b>, between the effort and the load. That makes all of these <span class="key">first order levers</span>.<br>The <b>order</b> (or class) of a lever depends on <b>which part is in the middle</b>.<br>A first order lever <b>changes the direction</b> of the force: push down and the load goes up. It can also <b>multiply your force</b>, if the effort is further from the fulcrum than the load is.<br><span class="small">More first order levers: pliers, balance scales. Scissors are two first order levers sharing one fulcrum.</span>', { tag: 'Notes' });
      const orderHint = ui.el('p', 'small red', 'Finish labelling all three levers to un-blur these notes.'); orderHint.style.marginTop = '-18px';

      const fill = ui.fill({ id: 'p03.blanks', label: 'Lever parts and first order levers (5 blanks)', q: 'Fill in the missing words. <span class="small">(Everything above blurs while you answer these last two.)</span>',
        html: 'A lever is a rigid bar that turns about a fixed point called the {{fulcrum|pivot|fulcrum (pivot)|the fulcrum}}. The input force you apply is the {{effort}}. The output force, the thing being moved, is the {{load}}. A see-saw, a crowbar and scissors are all {{first|1st|first-order|1st-order|first order}} order levers, because the fixed point is in the {{middle|centre|center}}.',
        explain: 'Spot on: fulcrum, effort, load, and first order means the fulcrum is in the middle.' });
      const tf = ui.tf({ id: 'p03.tf', label: 'T/F: first order lever, load moves the same way as the effort', statement: 'With a first order lever, the load moves in the <b>same direction</b> as your effort.', answer: false, mis: 'lever-order',
        explain: 'False. A first order lever <b>changes the direction</b> of the force: push down on one side of the fulcrum and the load on the other side goes <b>up</b>.' });

      // ------------------------------------------------------------------ what is blurred when
      function sync() {
        const labelDone = units.every((U) => U.done);
        const fi = got('p03.blanks'), recallDone = !!(fi && (fi.correct === true || fi.attempts >= 3)) && !!got('p03.tf');
        const recall = recallStarted && !recallDone, labelling = labelStarted && !labelDone;
        const set = (e, on) => { if (on && !e.classList.contains('peek-lock') && e === animWrap) anim.stop(); e.classList.toggle('peek-lock', on); };
        set(notes, labelling || recall); set(animWrap, labelling || recall);
        set(labWrap, recall); set(order, !labelDone || recall);
        orderHint.style.display = labelDone ? 'none' : '';
      }
      [fill, tf].forEach((e) => {
        e.addEventListener('pointerdown', () => { if (!recallStarted) { recallStarted = true; sync(); } }, { passive: true });
        e.addEventListener('focusin', () => { if (!recallStarted) { recallStarted = true; sync(); } });
        e.addEventListener('click', () => setTimeout(sync, 60));
      });
      sync();
    },
  });
})();
