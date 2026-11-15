// Page 5 — Working properties: strength, hardness, toughness, malleability, ductility, elasticity.
// Six short pen-drawn animations (one per property), then blanks and two misconception checks.
(function () {
  'use strict';
  const B = Ink.BLUE, R = Ink.RED, G = Ink.GREEN, PALE = [120, 134, 200];
  const ALWAYS = [-2, -1]; // a stroke window that is always complete
  const ease = (u) => (u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u));
  const xf = (pts, th = 0, cx = 0, cy = 0, dx = 0, dy = 0) => { const c = Math.cos(th), s = Math.sin(th); return pts.map(([x, y]) => [cx + (x - cx) * c - (y - cy) * s + dx, cy + (x - cx) * s + (y - cy) * c + dy]); };
  const path = (ctx, pts) => { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); };
  // hatch a shape given in local coords, moved by (dx,dy) and/or rotated about (cx,cy): the pattern travels with the shape
  const hatchAt = (k, pts, p, o = {}) => { if (p <= 0) return; const c = k.ctx; c.save(); if (o.rot) { c.translate(o.cx, o.cy); c.rotate(o.rot); c.translate(-o.cx, -o.cy); } c.translate(o.dx || 0, o.dy || 0); Ink.hatchFill(c, pts, p, o.color || B, o.density || 1); c.restore(); };
  // hatch a fixed shape seen through a clip shape (stable pattern while the clip moves or grows)
  const hatchClip = (k, clipPts, fixedPts, o = {}) => { const c = k.ctx; c.save(); path(c, clipPts); c.clip(); Ink.hatchFill(c, fixedPts, o.p ?? 1, o.color || B, o.density || 1); c.restore(); };
  const HAND = (z) => `400 ${z}px "Gloria Hallelujah", "Comic Sans MS", cursive`;
  const fit = (k, s, maxW, size, min = 22) => { const c = k.ctx; c.save(); let z = size; for (; z > min; z--) { c.font = HAND(z); if (c.measureText(s).width <= maxW) break; } c.restore(); return z; };
  const txt = (k, s, x, y, a, b, o = {}) => k.text(s, x, y, a, b, Object.assign({ align: 'center' }, o, { size: fit(k, s, o.maxW || 840, o.size || 24) }));
  const tick = (k, x, y, a, s = 1) => k.line([[x, y], [x + 8 * s, y + 10 * s], [x + 26 * s, y - 14 * s]], a, a + 0.25, { color: G, w: 3.6, seed: 901 });
  const cross = (k, x, y, a, s = 1) => { k.line([[x - 11 * s, y - 11 * s], [x + 11 * s, y + 11 * s]], a, a + 0.12, { color: R, w: 3.6, seed: 902 }); k.line([[x + 11 * s, y - 11 * s], [x - 11 * s, y + 11 * s]], a + 0.12, a + 0.25, { color: R, w: 3.6, seed: 903 }); };
  const spring = (x0, y0, L, n, r) => { const P = [], F = Math.PI * 2 * n, a = L / F; for (let i = 0; i <= n * 20; i++) { const f = (i / (n * 20)) * F; P.push([x0 + a * f + r * 0.5 * Math.sin(f), y0 - r * Math.cos(f)]); } return P; };

  // a claw-less engineer's hammer. P = the hand end of the handle (pivot); th = 0 means the face is flat on the work.
  function hammer(k, P, th, a, seed = 500) {
    const m = (pts) => xf(pts.map(([x, y]) => [P[0] + x, P[1] + y]), th, P[0], P[1]);
    k.line(m([[0, -4], [-112, -4]]), a, a + 0.25, { w: 2.6, seed });
    k.line(m([[-112, 4], [0, 4], [0, -4]]), a + 0.2, a + 0.45, { w: 2.6, seed: seed + 1 });
    const head = k.rect(-144, -28, 32, 56, 4);
    k.line(m(head), a + 0.4, a + 0.75, { w: 3, seed: seed + 2 });
    hatchAt(k, head.map(([x, y]) => [x + P[0], y + P[1]]), k.win(a + 0.7, a + 1.0), { rot: th, cx: P[0], cy: P[1], density: 1.4 });
  }
  // swing angle: raised (up) between hits, 0 at each hit time
  const swing = (t, hits, up = 0.72, pre = 0.28, post = 0.5) => { let th = up; hits.forEach((c) => { if (t > c - pre && t <= c) { const u = (t - (c - pre)) / pre; th = up * (1 - u * u); } else if (t > c && t < c + post) th = up * ease((t - c) / post); }); return th; };
  const sparks = (k, x, y, c, n = 6, seed = 600, col = B) => { if (k.t < c || k.t > c + 0.55) return; const g = 1 + (k.t - c) * 1.2; for (let i = 0; i < n; i++) { const an = Math.PI + 0.25 + i * ((Math.PI - 0.5) / (n - 1)); k.line([[x + Math.cos(an) * 22 * g, y + Math.sin(an) * 14 * g], [x + Math.cos(an) * 36 * g, y + Math.sin(an) * 24 * g]], ...ALWAYS, { w: 2, seed: seed + i, color: col }); } };

  // ================= 1. STRENGTH: the five forces =================
  const strength = {
    w: 860, h: 352, duration: 11, poster: 2.1,
    draw(k, t) {
      const A = (i) => 0.4 + i * 1.8, CX = (i) => 86 + i * 172, cy = 182;
      const head = (i, name, sub) => { txt(k, name, CX(i), 40, A(i), A(i) + 0.35, { size: 26, color: R, maxW: 164 }); if (sub) txt(k, sub, i === 4 ? 762 : CX(i), 68, A(i) + 0.3, A(i) + 0.6, { size: 22, maxW: 190 }); };
      const pulse = (i) => (t > A(i) + 1.3 ? 4 + 4 * Math.sin((t - A(i)) * 6) : 0);
      [1, 2, 3, 4].forEach((i) => k.line([[i * 172, 100], [i * 172 + 1, 270]], A(i) - 0.1, A(i) + 0.1, { w: 1.2, color: PALE, seed: 30 + i, retrace: false }));

      // tension: a steel cable pulled from both ends
      let a = A(0), cx = CX(0), p = pulse(0);
      head(0, 'tension', '(pulling)');
      k.line([[cx - 46, cy - 9], [cx + 46, cy - 9]], a + 0.5, a + 0.75, { w: 2.4, seed: 41 });
      k.line([[cx - 46, cy + 9], [cx + 46, cy + 9]], a + 0.6, a + 0.85, { w: 2.4, seed: 42 });
      for (let x = -44; x < 42; x += 8) k.line([[cx + x, cy + 9], [cx + x + 9, cy - 9]], a + 0.8 + (x + 44) / 300, a + 0.85 + (x + 44) / 300, { w: 1.5, seed: 43 + x, retrace: false });
      k.arrow([[cx - 50 - p * 0.3, cy], [cx - 74 - p, cy]], a + 1.05, a + 1.3, { color: R, w: 3, head: 12, seed: 44 });
      k.arrow([[cx + 50 + p * 0.3, cy], [cx + 74 + p, cy]], a + 1.1, a + 1.35, { color: R, w: 3, head: 12, seed: 45 });
      txt(k, 'steel cable', cx, 250, a + 1.3, a + 1.7, { size: 22, maxW: 166 });

      // compression: a concrete column squashed from both ends
      a = A(1); cx = CX(1); p = pulse(1);
      head(1, 'compression', '(squashing)');
      const col = k.rect(cx - 24, cy - 42, 48, 84, 3);
      k.line(col, a + 0.5, a + 0.9, { w: 2.6, seed: 46 });
      if (t > a + 0.85) { const rr = H.rng(77); for (let j = 0; j < 26; j++) k.dot(cx - 18 + rr() * 36, cy - 36 + rr() * 72, 1.1 + rr() * 1.2, a + 0.85 + j * 0.01, { color: PALE }); }
      k.arrow([[cx, cy - 86 + p * 0.5], [cx, cy - 48 + p * 0.5]], a + 1.05, a + 1.3, { color: R, w: 3, head: 12, seed: 47 });
      k.arrow([[cx, cy + 86 - p * 0.5], [cx, cy + 48 - p * 0.5]], a + 1.1, a + 1.35, { color: R, w: 3, head: 12, seed: 48 });
      txt(k, 'concrete', cx + 2, 296, a + 1.3, a + 1.7, { size: 22, maxW: 166 });

      // bending: a beam on two supports with a load in the middle
      a = A(2); cx = CX(2);
      head(2, 'bending', '');
      const sag = t > a + 1.3 ? 9 + 3 * Math.sin((t - a) * 6) : 0;
      [-52, 52].forEach((dx, j) => k.line([[cx + dx - 13, cy + 44], [cx + dx, cy + 14], [cx + dx + 13, cy + 44], [cx + dx - 13, cy + 44]], a + 0.4 + j * 0.15, a + 0.6 + j * 0.15, { w: 2.4, seed: 50 + j }));
      const beam = (off) => k.curve([cx - 68, cy + off], [cx - 24, cy + off + sag * 1.35], [cx + 24, cy + off + sag * 1.35], [cx + 68, cy + off], 24);
      k.line([...beam(0), ...beam(13).reverse(), [cx - 68, cy]], a + 0.7, a + 1.05, { w: 2.6, seed: 52 });
      k.arrow([[cx, cy - 62], [cx, cy - 6 + sag]], a + 1.05, a + 1.3, { color: R, w: 3, head: 12, seed: 53 });

      // torsion: a bar twisted in opposite directions at each end
      a = A(3); cx = CX(3);
      head(3, 'torsion', '(twisting)');
      const tw = t > a + 1.3 ? 0.75 + 0.25 * Math.sin((t - a) * 6) : 0;
      k.line([[cx - 46, cy - 14], [cx + 46, cy - 14]], a + 0.45, a + 0.65, { w: 2.6, seed: 54 });
      k.line([[cx + 46, cy + 14], [cx - 46, cy + 14]], a + 0.55, a + 0.75, { w: 2.6, seed: 55 });
      k.line(k.ellipse(cx - 46, cy, 6, 14, 0, Math.PI * 2 + 0.2), a + 0.7, a + 0.85, { w: 2.2, seed: 56 });
      k.line(k.ellipse(cx + 46, cy, 6, 14, -Math.PI / 2, Math.PI / 2), a + 0.75, a + 0.9, { w: 2.2, seed: 57 });
      for (let j = 0; j < 5; j++) { const x = cx - 32 + j * 16; k.line([[x - 9 * tw, cy - 13], [x + 9 * tw, cy + 13]], a + 0.85 + j * 0.04, a + 0.9 + j * 0.04, { w: 1.5, seed: 58 + j, retrace: false }); }
      k.arrow(k.ellipse(cx - 62, cy, 9, 30, -1.9, 1.5), a + 1.05, a + 1.3, { color: R, w: 3, head: 11, seed: 64 });
      k.arrow(k.ellipse(cx + 64, cy, 9, 30, 1.2, -2.2), a + 1.1, a + 1.35, { color: R, w: 3, head: 11, seed: 65 });

      // shear: two bolted plates pulled in opposite directions try to slice the bolt
      a = A(4); cx = CX(4);
      head(4, 'shear', '(sliding/cutting)');
      const sl = t > a + 1.3 ? 2 + 2 * Math.sin((t - a) * 6) : 0;
      k.line(k.rect(cx - 52 - sl, cy - 14, 76, 14, 2), a + 0.45, a + 0.7, { w: 2.5, seed: 66 });
      k.line(k.rect(cx - 24 + sl, cy, 76, 14, 2), a + 0.6, a + 0.85, { w: 2.5, seed: 67 });
      k.line(k.rect(cx - 12, cy - 24, 24, 9, 2), a + 0.8, a + 0.92, { w: 2.3, seed: 68 });
      k.line(k.rect(cx - 12, cy + 15, 24, 9, 2), a + 0.86, a + 0.98, { w: 2.3, seed: 69 });
      k.line([[cx - 5, cy - 14], [cx - 5, cy + 14]], a + 0.92, a + 1.0, { w: 1.6, seed: 70, retrace: false });
      k.line([[cx + 5, cy - 14], [cx + 5, cy + 14]], a + 0.95, a + 1.03, { w: 1.6, seed: 71, retrace: false });
      k.arrow([[cx - 56 - sl, cy - 7], [cx - 80 - sl, cy - 7]], a + 1.05, a + 1.3, { color: R, w: 3, head: 12, seed: 72 });
      k.arrow([[cx + 56 + sl, cy + 7], [cx + 80 + sl, cy + 7]], a + 1.1, a + 1.35, { color: R, w: 3, head: 12, seed: 73 });
      txt(k, 'bolt', cx, 250, a + 1.3, a + 1.6, { size: 22 });

      txt(k, 'STRONG = no breaking, and no bending for good', 340, 334, 9.5, 10.8, { size: 25, color: R, maxW: 600 });
    },
    sound(k) {
      k.bed('room', 0, 11, { gain: 0.3 });
      [0, 1, 2, 3, 4].forEach((i) => { const a = 0.4 + i * 1.8; k.play('stroke', a, { material: 'pen', dur: 0.5, gain: 0.45 }); k.play('stroke', a + 0.5, { material: 'pen', dur: 0.6, gain: 0.5 }); k.play('swish', a + 1.1, { gain: 0.25 }); });
      k.play('stroke', 9.5, { material: 'pen', dur: 1.2, gain: 0.5 }); k.play('success', 10.7, { f: 'G5', gain: 0.4 });
    },
  };

  // a slab in simple 3D. Returns helpers for points on its top face.
  function slab(k, x, y, w, a, o = {}) {
    const dx = 44, dy = 32, hF = o.h || 40;
    const top = [[x, y], [x + dx, y - dy], [x + w + dx, y - dy], [x + w, y], [x, y]];
    const front = [[x, y], [x, y + hF], [x + w, y + hF], [x + w, y]];
    const side = [[x + w, y + hF], [x + w + dx, y + hF - dy], [x + w + dx, y - dy]];
    k.line(top, a, a + 0.5, { w: 2.8, seed: o.seed || 300 });
    k.line(front, a + 0.4, a + 0.75, { w: 2.8, seed: (o.seed || 300) + 1 });
    k.line(side, a + 0.7, a + 0.9, { w: 2.8, seed: (o.seed || 300) + 2 });
    if (o.hatch) { hatchAt(k, [...front, [x, y]], k.win(a + 0.85, a + 1.2), { density: 1.3 }); hatchAt(k, [[x + w, y], ...side], k.win(a + 0.95, a + 1.3), { density: 2 }); }
    if (o.glint) [[18, 30, 34, 8], [30, 32, 44, 12], [w - 40, 30, w - 26, 10]].forEach(([x0, y0, x1, y1], i) => k.line([[x + x0, y + y0], [x + x1, y + y1]], a + 0.9 + i * 0.08, a + 1.0 + i * 0.08, { w: 1.6, color: PALE, seed: 310 + i, retrace: false }));
    return (u, v) => [x + u * w + v * dx, y - v * dy];
  }

  // ================= 2. HARDNESS: scratch, dent, wear =================
  const hardness = {
    w: 860, h: 360, duration: 10, poster: 1.45,
    draw(k, t) {
      const TL = slab(k, 40, 226, 300, 0.2, { hatch: true, seed: 320 }), TR = slab(k, 462, 226, 300, 0.5, { glint: true, seed: 330 });
      txt(k, 'lead', 190, 308, 0.9, 1.2, { size: 26 }); txt(k, 'glass', 612, 308, 1.0, 1.3, { size: 26 });
      const stepLab = (s, x, a) => txt(k, s, x, 40, a, a + 0.35, { size: 25, color: t > 8.2 ? PALE : B });
      stepLab('1. scratch', 250, 1.5); stepLab('2. dent', 430, 3.9); stepLab('3. wear', 600, 6.0);

      // 1. scratch with a steel nail
      const sm = ease(k.win(1.9, 3.3));
      [TL, TR].forEach((T, i) => {
        const tip = T(0.1 + 0.5 * sm, 0.55);
        if (t > 1.5 && t < 3.8) { k.line([tip, [tip[0] - 5, tip[1] - 9], [tip[0] - 30, tip[1] - 92]], 1.5 + i * 0.1, 1.75 + i * 0.1, { w: 3.2, seed: 340 + i }); k.line([[tip[0] - 42, tip[1] - 87], [tip[0] - 18, tip[1] - 97]], 1.7 + i * 0.1, 1.85 + i * 0.1, { w: 4, seed: 342 + i }); }
        if (i === 0 && sm > 0) { k.line([T(0.1, 0.55), tip], ...ALWAYS, { w: 3, color: R, seed: 344 }); k.line([T(0.1, 0.5), [tip[0], tip[1] + 2]], ...ALWAYS, { w: 1.2, color: R, seed: 345, retrace: false }); }
      });
      // 2. dent with a steel ball pressed in
      const down = t < 4.3 ? 0 : t < 4.8 ? ease((t - 4.3) / 0.5) : t < 5.3 ? 1 : 1 - ease((t - 5.3) / 0.5);
      [TL, TR].forEach((T, i) => {
        const c = T(0.8, 0.5), by = c[1] - 96 + down * (78 + (i === 0 ? 7 : 0));
        if (i === 0 && t > 4.75) { const d = k.ellipse(c[0], c[1], 17, 7, 0, Math.PI * 2 + 0.2); k.line(d, 4.75, 4.95, { w: 2.4, color: R, seed: 350 }); hatchClip(k, d, k.rect(c[0] - 20, c[1] - 9, 40, 18), { color: R, density: 1.8 }); }
        if (t > 3.9 && t < 5.85) { const ball = k.ellipse(c[0], by, 18, 18); k.line(ball, 3.9 + i * 0.1, 4.2 + i * 0.1, { w: 2.8, seed: 352 + i }); hatchClip(k, k.ellipse(c[0] + 7, by + 7, 15, 15, 0, 6.3), k.rect(c[0] - 20, by - 20, 40, 40), { p: k.win(4.15, 4.3), density: 1.6 }); }
      });
      // 3. wear with abrasive paper rubbed back and forth
      const rub = k.win(6.5, 7.9), osc = 0.5 - 0.5 * Math.cos(rub * Math.PI * 6);
      [TL, TR].forEach((T, i) => {
        const c = T(0.2 + 0.3 * osc, 0.22);
        if (t > 6.0 && t < 8.2) { const blk = k.rect(c[0] - 38, c[1] - 30, 76, 26, 4); k.line(blk, 6.0 + i * 0.1, 6.35 + i * 0.1, { w: 2.8, seed: 360 + i }); for (let j = 0; j < 7; j++) k.dot(c[0] - 30 + j * 10, c[1] - 1, 1.8, 6.3, { color: B }); }
        if (i === 0 && rub > 0) { const rr = H.rng(91), n = Math.floor(rub * 22); for (let j = 0; j < n; j++) { const q = T(0.14 + rr() * 0.42, 0.1 + rr() * 0.22); k.line([q, [q[0] + 16 + rr() * 14, q[1] - 1]], ...ALWAYS, { w: 1.3, color: R, seed: 370 + j, retrace: false }); } }
      });
      // verdict
      txt(k, 'SOFT: marked every time', 205, 124, 8.3, 8.9, { size: 25, color: R, maxW: 300 }); cross(k, 34, 116, 8.8, 0.9);
      k.text('HARD', 560, 128, 8.6, 9.1, { font: 'bubble', size: 44, color: G, align: 'center' }); tick(k, 640, 118, 9.1, 1.3);
      txt(k, 'no scratch, no dent, no wear', 620, 166, 9.1, 9.7, { size: 22, color: G, maxW: 400 });
    },
    sound(k) {
      k.bed('room', 0, 10, { gain: 0.3 });
      k.play('stroke', 0.2, { material: 'pen', dur: 1.0, gain: 0.5 }); k.play('stroke', 1.5, { material: 'pen', dur: 0.4, gain: 0.5 });
      k.play('stroke', 1.9, { material: 'pen', dur: 1.4, gain: 0.7 });
      k.play('stroke', 3.9, { material: 'pen', dur: 0.4, gain: 0.5 }); k.play('thud', 4.8, { gain: 0.45 });
      [6.6, 6.85, 7.1, 7.35, 7.6].forEach((a) => k.play('erase', a, { gain: 0.3 }));
      k.play('error', 8.8, { f: 'F4', gain: 0.25 }); k.play('success', 9.1, { f: 'G5', gain: 0.4 });
    },
  };

  // ================= 3. TOUGHNESS: tough vs brittle =================
  const toughness = {
    w: 860, h: 410, duration: 10.5, poster: 2.45,
    draw(k, t) {
      const yT = 250, th = 13, H1 = 3.0, H2 = 5.6;
      const sup = (x, a, s) => k.line([[x - 16, yT + th + 34], [x, yT + th + 2], [x + 16, yT + th + 34], [x - 16, yT + th + 34]], a, a + 0.25, { w: 2.5, seed: s });
      k.line([[20, yT + th + 35], [410, yT + th + 37]], 0.1, 0.4, { w: 2.2, seed: 400 }); k.line([[450, yT + th + 36], [840, yT + th + 35]], 0.2, 0.5, { w: 2.2, seed: 401 });
      // --- left: polypropylene sheet flexes and springs back
      const xa = 60, w = 270, cxL = xa + w / 2;
      sup(xa + 26, 0.4, 402); sup(xa + w - 26, 0.5, 403);
      const dtL = t - H1, sag = dtL > 0 ? 20 * Math.exp(-dtL * 4.5) * Math.cos(dtL * 17) : 0;
      const edge = (off) => k.curve([xa, yT + off], [xa + w * 0.33, yT + off + sag * 1.35], [xa + w * 0.67, yT + off + sag * 1.35], [xa + w, yT + off], 30);
      k.line([...edge(0), ...edge(th).reverse(), [xa, yT]], 0.6, 1.1, { w: 2.8, seed: 404 });
      txt(k, 'polypropylene', cxL, 336, 0.9, 1.3, { size: 25 });
      hammer(k, [cxL + 128, yT - 28 + (dtL > 0 ? sag : 0)], swing(t, [H1], 0.5), 1.1, 410);
      sparks(k, cxL - 4, yT - 4, H1, 6, 420);
      k.text('TOUGH', cxL - 20, 74, 4.2, 4.7, { font: 'bubble', size: 42, color: G, align: 'center' }); tick(k, cxL + 82, 62, 4.7, 1.2);
      txt(k, 'it bends and absorbs the energy', cxL, 112, 3.5, 4.2, { size: 22, color: G, maxW: 330 });
      // --- right: a glass sheet shatters
      const xb = 480, cxR = xb + w / 2; let dt = t - H2;
      sup(xb + 26, 0.6, 405); sup(xb + w - 26, 0.7, 406);
      if (dt <= 0.3) {
        k.line([...k.rect(xb, yT, w, th, 2)], 0.8, 1.3, { w: 2.8, seed: 407 });
        if (dt > 0) [[-70, -46], [-24, -66], [34, -62], [76, -40], [-52, 26], [58, 30], [-96, 6], [100, -4]].forEach(([dx, dy], i) => k.line([[cxR - 4 + dx * 0.15, yT + 6 + dy * 0.1], [cxR - 4 + dx * 0.55, yT + 6 + dy * 0.12], [cxR - 4 + dx, yT + 6 + dy * 0.15]], H2, H2 + 0.15, { w: 2.2, color: R, seed: 440 + i }));
        [[30, 46], [40, 54], [196, 214]].forEach(([p, q], i) => k.line([[xb + p, yT + th - 3], [xb + q, yT + 3]], 1.2 + i * 0.05, 1.3 + i * 0.05, { w: 1.3, color: PALE, seed: 408 + i, retrace: false }));
      } else {
        // fragments fly apart and drop
        const dt0 = dt; dt = dt - 0.3;
        const cuts = [0, 34, 76, 112, 134, 158, 196, 236, 270], floor = yT + th + 30, rr = H.rng(53);
        for (let i = 0; i < cuts.length - 1; i++) {
          const x0 = cuts[i], x1 = cuts[i + 1], mx = (x0 + x1) / 2, near = 1 - Math.abs(mx - w / 2) / (w / 2);
          const vx = (mx - w / 2) * (0.9 + rr() * 0.8), vy = -40 - rr() * 90 + near * 260, om = (rr() - 0.5) * 9;
          let px = xb + mx + vx * dt, py = yT + th / 2 + vy * dt + 450 * dt * dt, an = om * dt;
          const sup0 = mx < 60 || mx > w - 60; // end pieces rest on the supports
          if (sup0) { px = xb + mx + (mx < 60 ? -1 : 1) * Math.min(10, dt * 30); py = yT + th / 2; an = (mx < 60 ? -1 : 1) * Math.min(0.12, dt * 0.5); }
          else if (py > floor) { py = floor; an = om * 0.12; px = xb + mx + vx * Math.min(dt, 0.42); }
          const hw = (x1 - x0) / 2 - 1, j = (i % 2 ? 5 : -5);
          k.line(xf([[-hw, -th / 2], [hw + j, -th / 2], [hw, th / 2], [-hw - j, th / 2], [-hw, -th / 2]], an, 0, 0, px, py), ...ALWAYS, { w: 2.4, seed: 430 + i });
        }
        dt = dt0;
      }
      txt(k, 'glass', cxR, 336, 1.0, 1.3, { size: 25 });
      hammer(k, [cxR + 128, yT - 28], swing(t, [H2], 0.5), 1.4, 450);
      k.text('BRITTLE', cxR - 10, 74, 6.8, 7.4, { font: 'bubble', size: 42, color: R, align: 'center' }); cross(k, cxR + 112, 60, 7.4, 1);
      txt(k, 'no give: it cracks and shatters', cxR, 112, 6.1, 6.8, { size: 22, color: R, maxW: 330 });
      txt(k, 'Glass is very HARD, but BRITTLE. Hard is not tough!', 350, 392, 8.2, 9.8, { size: 24, color: R, maxW: 620 });
    },
    sound(k) {
      k.bed('room', 0, 10.5, { gain: 0.3 });
      k.play('stroke', 0.4, { material: 'pen', dur: 0.9, gain: 0.5 }); k.play('stroke', 1.1, { material: 'pen', dur: 0.9, gain: 0.5 });
      k.play('whoosh', 2.75, { gain: 0.25 }); k.play('thud', 3.0, { gain: 0.6 }); k.play('success', 4.7, { f: 'G5', gain: 0.35 });
      k.play('whoosh', 5.35, { gain: 0.25 }); k.play('impact', 5.6, { gain: 0.5 }); k.play('sparkle', 5.62, { gain: 0.5 }); k.play('glitch', 5.6, { gain: 0.2 });
      k.play('error', 7.4, { f: 'F4', gain: 0.3 }); k.play('stroke', 8.2, { material: 'pen', dur: 1.5, gain: 0.5 });
    },
  };

  // ================= 4. MALLEABILITY: shaped by compression =================
  const malleability = {
    w: 860, h: 392, duration: 11, poster: 2.5,
    draw(k, t) {
      const hits = [2.6, 3.5, 4.4], cx = 240, yA = 236;
      // anvil
      const anvil = [[150, yA], [330, yA], [330, yA + 20], [286, yA + 32], [278, yA + 58], [306, yA + 68], [306, yA + 86], [164, yA + 86], [164, yA + 68], [192, yA + 58], [184, yA + 32], [150, yA + 22], [104, yA + 8], [150, yA]];
      k.line(anvil, 0.2, 1.0, { w: 3, seed: 500 }); hatchAt(k, anvil, k.win(0.9, 1.4), { density: 1.1 });
      // the copper block gets wider and thinner with every blow
      let s = 0; hits.forEach((c) => (s += ease((t - c) / 0.12) / 3));
      const w = 64 + 100 * s, h = 2880 / w, bx = cx - w / 2, by = yA - h - 2;
      k.line(k.rect(bx, by, w, h, 4), 1.0, 1.4, { w: 2.8, seed: 501 });
      txt(k, 'copper', 150, 196, 1.4, 1.7, { size: 24, align: 'right' });
      hammer(k, [cx + 150, by - 28], swing(t, hits), 1.5, 510);
      hits.forEach((c, i) => sparks(k, cx + 6, by, c, 6, 520 + i * 10));
      if (t > 5.0) {
        k.arrow([[cx, by - 64], [cx, by - 5]], 5.0, 5.3, { color: R, w: 3.2, head: 13, seed: 530 });
        txt(k, 'compression', 150, by - 56, 5.4, 5.9, { size: 25, color: R });
      }
      txt(k, 'hammering', 235, 356, 1.6, 2.0, { size: 24 });
      // rolling mill: two rollers squeeze a slab into thin sheet
      const rx = 640, r = 46, gap = 16, ym = 214, thick = 40;
      const adv = ease(k.win(6.8, 9.6)), xF = 598 + adv * 230, xT = 462 + adv * 104, rot = (xF - 598) / r;
      [[-1, 0], [1, 0.25]].forEach(([sg, da], i) => {
        const cyr = ym + sg * (r + gap / 2);
        k.line(k.ellipse(rx, cyr, r, r), 5.9 + da, 6.3 + da, { w: 3, seed: 540 + i });
        for (let j = 0; j < 3; j++) { const an = -sg * rot + j * Math.PI * 2 / 3 + i; k.line([[rx + Math.cos(an) * 8, cyr + Math.sin(an) * 8], [rx + Math.cos(an) * (r - 8), cyr + Math.sin(an) * (r - 8)]], 6.25 + da, 6.4 + da, { w: 1.8, seed: 542 + i * 3 + j, retrace: false }); }
        k.dot(rx, cyr, 4, 6.3 + da);
      });
      const slabP = [[xT, ym - thick / 2], [Math.min(xF, 606), ym - thick / 2]];
      if (xF > 606) { slabP.push([Math.min(xF, rx), ym - gap / 2 + (xF < rx ? (rx - xF) / (rx - 606) * (thick - gap) / 2 : 0)]); if (xF > rx) slabP.push([xF, ym - gap / 2], [xF, ym + gap / 2]); slabP.push([Math.min(xF, rx), ym + gap / 2 - (xF < rx ? (rx - xF) / (rx - 606) * (thick - gap) / 2 : 0)]); }
      slabP.push([Math.min(xF, 606), ym + thick / 2], [xT, ym + thick / 2], [xT, ym - thick / 2]);
      k.line(slabP, 6.3, 6.8, { w: 2.8, seed: 550 });
      k.arrow([[rx, 62], [rx, 100]], 7.0, 7.3, { color: R, w: 3.2, head: 13, seed: 551 });
      k.arrow([[rx, 366], [rx, 328]], 7.2, 7.5, { color: R, w: 3.2, head: 13, seed: 552 });
      k.arrow([[730, ym + 34], [790, ym + 34]], 7.6, 7.9, { w: 2.2, head: 11, seed: 553 });
      txt(k, 'thin sheet', 760, ym - 24, 9.0, 9.5, { size: 23 });
      txt(k, 'rolling', 520, 356, 6.4, 6.8, { size: 24 });
      txt(k, 'MALLEABLE = squashed into shape, no cracks', 420, 36, 9.6, 10.8, { size: 25, color: R, maxW: 760 });
    },
    sound(k) {
      k.bed('room', 0, 11, { gain: 0.3 });
      k.play('stroke', 0.2, { material: 'pen', dur: 1.2, gain: 0.5 }); k.play('stroke', 1.5, { material: 'pen', dur: 0.9, gain: 0.5 });
      [2.6, 3.5, 4.4].forEach((c) => { k.play('impact', c, { gain: 0.45 }); k.play('ding', c + 0.01, { gain: 0.15 }); });
      k.play('stroke', 5.0, { material: 'pen', dur: 0.8, gain: 0.5 }); k.play('stroke', 5.9, { material: 'pen', dur: 0.9, gain: 0.5 });
      k.play('roller', 6.8, { dur: 2.8, gain: 0.3 }); k.play('stroke', 9.6, { material: 'pen', dur: 1.1, gain: 0.5 }); k.play('success', 10.7, { f: 'G5', gain: 0.4 });
    },
  };

  // ================= 5. DUCTILITY: drawn through a die under tension =================
  const ductility = {
    w: 860, h: 340, duration: 10.5, poster: 2.6,
    draw(k, t) {
      const cy = 176, m = ease(k.win(3.4, 8.2)), xw = 470 + 300 * m, x0 = 60 + 14 * m;
      const dieT = [[330, cy - 92], [430, cy - 92], [430, cy - 5], [404, cy - 5], [330, cy - 24], [330, cy - 92]];
      const dieB = dieT.map(([x, y]) => [x, 2 * cy - y]);
      k.line(dieT, 0.2, 0.7, { w: 3, seed: 600 }); k.line(dieB, 0.5, 1.0, { w: 3, seed: 601 });
      hatchAt(k, dieT, k.win(0.9, 1.4), { density: 1.5 }); hatchAt(k, dieB, k.win(1.0, 1.5), { density: 1.5 });
      txt(k, 'die (hard steel)', 380, 52, 1.0, 1.5, { size: 23 });
      // thick rod going in, thin wire coming out
      k.line([[330, cy - 22], [x0, cy - 22], [x0, cy + 22], [330, cy + 22]], 1.3, 1.8, { w: 2.8, seed: 602 });
      k.line([[330, cy - 22], [404, cy - 4], [xw, cy - 4]], 1.7, 2.1, { w: 2.4, seed: 603 });
      k.line([[330, cy + 22], [404, cy + 4], [xw, cy + 4]], 1.8, 2.2, { w: 2.4, seed: 604 });
      txt(k, 'thick copper rod', 195, cy - 44, 1.8, 2.3, { size: 23 });
      // the grip that pulls the wire
      k.line(k.rect(xw - 4, cy - 17, 30, 12, 3), 2.2, 2.4, { w: 2.6, seed: 605 }); k.line(k.rect(xw - 4, cy + 5, 30, 12, 3), 2.3, 2.5, { w: 2.6, seed: 606 });
      const pl = t > 3.2 && m < 1 ? 3 * Math.sin(t * 8) : 0;
      k.arrow([[xw + 30, cy], [xw + 76 + pl, cy]], 2.6, 3.0, { color: R, w: 3.4, head: 14, seed: 607 });
      txt(k, 'tension (pulling)', Math.min(xw + 10, 720), cy + 62, 2.9, 3.4, { size: 24, color: R });
      // squeeze marks inside the die
      if (t > 3.4 && m < 1) [0, 1, 2].forEach((j) => { const u = ((t * 1.4 + j / 3) % 1), x = 336 + u * 62; k.line([[x, cy - 12 + u * 9], [x + 8, cy - 10 + u * 9]], ...ALWAYS, { w: 1.4, seed: 610 + j, retrace: false }); k.line([[x, cy + 12 - u * 9], [x + 8, cy + 10 - u * 9]], ...ALWAYS, { w: 1.4, seed: 613 + j, retrace: false }); });
      txt(k, 'long thin wire', 600, cy - 30, 8.3, 8.8, { size: 23 });
      txt(k, 'DUCTILE = pulled into a wire by tension, no snapping', 330, 316, 8.9, 10.2, { size: 25, color: R, maxW: 600 });
    },
    sound(k) {
      k.bed('room', 0, 10.5, { gain: 0.3 });
      k.play('stroke', 0.2, { material: 'pen', dur: 1.2, gain: 0.5 }); k.play('stroke', 1.3, { material: 'pen', dur: 0.9, gain: 0.5 }); k.play('stroke', 2.2, { material: 'pen', dur: 0.7, gain: 0.5 });
      k.play('riser', 3.4, { dur: 4.8, gain: 0.22 }); k.play('stroke', 8.9, { material: 'pen', dur: 1.2, gain: 0.5 }); k.play('success', 10.2, { f: 'G5', gain: 0.4 });
    },
  };

  // ================= 6. ELASTICITY: elastic vs plastic =================
  const elasticity = {
    w: 860, h: 408, duration: 11, poster: 2.2,
    draw(k, t) {
      const cy = 160, pull = ease(k.win(2.6, 4.0)), rel = t - 5.0;
      const wall = (x, a, s) => { k.line([[x, cy - 62], [x, cy + 62]], a, a + 0.25, { w: 3, seed: s }); for (let i = 0; i < 6; i++) k.line([[x, cy - 54 + i * 21], [x - 12, cy - 42 + i * 21]], a + 0.2 + i * 0.03, a + 0.25 + i * 0.03, { w: 1.5, seed: s + 1 + i, retrace: false }); };
      const marker = (x, a, s) => { for (let i = 0; i < 6; i++) k.line([[x, cy - 56 + i * 20], [x, cy - 46 + i * 20]], a + i * 0.04, a + 0.05 + i * 0.04, { w: 1.6, color: PALE, seed: s + i, retrace: false }); };
      // left: a steel spring
      const xL = 40, L0 = 170, LS = 110;
      wall(xL, 0.2, 700);
      let L = L0 + LS * pull; if (rel > 0) L = L0 + LS * Math.exp(-rel * 3) * Math.cos(rel * 13);
      k.line([...spring(xL, cy, L, 7, 24), [xL + L + 4, cy - 24], [xL + L + 14, cy - 12], [xL + L + 14, cy]], 0.5, 1.3, { w: 2.6, seed: 710 });
      marker(xL + L0 + 14, 1.3, 720);
      txt(k, 'spring steel', xL + 110, 262, 1.4, 1.8, { size: 25 });
      // right: a roll of plasticine
      const xR = 460, P0 = 150, PS = 110, th0 = 40;
      wall(xR, 0.4, 730);
      const PL = P0 + PS * pull, thk = th0 * P0 / PL, neck = pull * 5;
      const roll = [[0, -thk / 2], ...k.curve([0, -thk / 2], [PL * 0.3, -thk / 2 + neck], [PL * 0.6, -thk / 2 + neck], [PL - thk / 2, -thk / 2], 16), ...k.ellipse(PL - thk / 2, 0, thk / 2, thk / 2, -Math.PI / 2, Math.PI / 2), ...k.curve([PL - thk / 2, thk / 2], [PL * 0.6, thk / 2 - neck], [PL * 0.3, thk / 2 - neck], [0, thk / 2], 16)];
      k.line(roll.map(([x, y]) => [xR + x, cy + y]), 0.9, 1.5, { w: 2.8, seed: 740 });
      hatchAt(k, roll, k.win(1.4, 1.8), { dx: xR, dy: cy, density: 0.9 });
      marker(xR + P0 + 6, 1.5, 750);
      txt(k, 'plasticine', xR + 110, 262, 1.6, 2.0, { size: 25 });
      txt(k, 'start', 430, 96, 1.9, 2.2, { size: 22, color: PALE });
      k.arrow([[404, 100], [xL + L0 + 22, 108]], 2.1, 2.3, { w: 1.5, color: PALE, head: 9, seed: 760 }); k.arrow([[458, 100], [xR + P0 - 2, 108]], 2.15, 2.35, { w: 1.5, color: PALE, head: 9, seed: 761 });
      // pull both, then let go
      if (t > 2.3 && rel < 0) {
        const wob = pull >= 1 ? 2 * Math.sin(t * 9) : 0;
        k.arrow([[xL + L + 22, cy], [xL + L + 70 + wob, cy]], 2.3, 2.6, { color: R, w: 3.4, head: 14, seed: 770 });
        k.arrow([[xR + PL + 8, cy], [xR + PL + 56 + wob, cy]], 2.35, 2.65, { color: R, w: 3.4, head: 14, seed: 771 });
        txt(k, 'pull...', 430, 40, 2.4, 2.8, { size: 26, color: R });
      }
      if (rel > 0 && t < 6.6) txt(k, '...and let go!', 430, 40, 5.0, 5.3, { size: 26, color: R });
      // verdicts
      txt(k, 'springs back to its original shape', xL + 170, 300, 6.6, 7.3, { size: 22, color: G, maxW: 400 });
      k.text('ELASTIC', xL + 150, 350, 7.3, 7.8, { font: 'bubble', size: 40, color: G, align: 'center' }); tick(k, xL + 252, 338, 7.8, 1.2);
      txt(k, 'stays stretched (deformed)', xR + 170, 300, 7.0, 7.7, { size: 22, color: R, maxW: 390 });
      k.text('PLASTIC', xR + 130, 350, 7.7, 8.2, { font: 'bubble', size: 40, color: R, align: 'center' });
      txt(k, 'Both STRETCHED. Only one came BACK!', 430, 40, 8.8, 10.2, { size: 26, color: R, maxW: 620 });
    },
    sound(k) {
      k.bed('room', 0, 11, { gain: 0.3 });
      k.play('stroke', 0.2, { material: 'pen', dur: 1.1, gain: 0.5 }); k.play('stroke', 0.9, { material: 'pen', dur: 0.8, gain: 0.5 });
      k.play('riser', 2.6, { dur: 1.4, gain: 0.25 }); k.play('swish', 5.0, { gain: 0.4 }); k.play('pop', 5.05, { f: 500, gain: 0.3 });
      k.play('success', 7.8, { f: 'G5', gain: 0.35 }); k.play('error', 8.2, { f: 'F4', gain: 0.25 }); k.play('stroke', 8.8, { material: 'pen', dur: 1.3, gain: 0.5 });
    },
  };

  const DEFS = [
    ['Strength', 'the ability to <b>withstand a force without breaking or permanently bending</b>. The forces are <b>tension</b> (pulling), <b>compression</b> (squashing), <b>bending</b>, <b>torsion</b> (twisting) and <b>shear</b> (sliding / cutting).', 'steel cable (tension), concrete (compression)', 'paper, expanded polystyrene', strength],
    ['Hardness', 'the ability to <b>resist scratching, wear (abrasion) and indentation (denting)</b>. Careful: hard is not the same as strong.', 'glass, high-speed steel drill bit, tool steel', 'lead, softwood, LDPE', hardness],
    ['Toughness', 'the ability to <b>absorb energy / an impact without breaking or cracking</b>. The opposite of tough is <span class="key">brittle</span>.', 'low-carbon (mild) steel, polypropylene, rubber', 'glass, cast iron, acrylic (all brittle)', toughness],
    ['Malleability', 'the ability to be <b>permanently shaped by compression</b> (hammered, pressed, rolled) <b>without cracking</b>.', 'copper, aluminium, lead, gold', 'cast iron, glass', malleability],
    ['Ductility', 'the ability to be <b>stretched (drawn) out into a thin wire</b> under <b>tension</b> without breaking.', 'copper, aluminium', 'cast iron, glass', ductility],
    ['Elasticity', 'the ability to <b>return to its original shape</b> after the force is removed. Materials that stay deformed are <span class="key">plastic</span>.', 'rubber, spring steel, LDPE film (a little)', 'lead, clay, plasticine', elasticity],
  ];
  const WATCH = {
    Toughness: '<b>Hard or tough?</b> <span class="key">Hard</span> = resists scratches and dents. <span class="key">Tough</span> = takes a hit without cracking. Glass is very hard but <b>brittle</b>, so it is <b>not</b> tough.',
    Ductility: '<b>Malleable or ductile?</b> <span class="key">Malleable</span> = <b>squashed</b> into shape (compression: hammer, press, roll). <span class="key">Ductile</span> = <b>stretched</b> into a wire (tension: pull). <span class="small">Memory trick: <b>M</b>alleable = <b>M</b>allet. <b>D</b>uctile = <b>D</b>rawn out.</span>',
  };

  Book.page({
    id: 'p05',
    title: 'Working properties',
    build(ui) {
      ui.h('Working properties', { size: 52 });
      ui.p('Working properties are about how a material <b>behaves when a force is applied</b>. There are <b>six</b> to learn. Tap each picture to watch the forces at work.');
      DEFS.forEach(([name, def, good, poor, spec], i) => {
        ui.el('h2', '', `${i + 1}. ${name}`);
        ui.box(`<p style="margin:0 0 6px"><span class="key">${name}</span>: ${def}</p><p class="small" style="margin:0"><b class="green">Good:</b> ${good} &nbsp; <b class="red">Poor:</b> ${poor}</p>`);
        ui.anim(spec);
        if (WATCH[name]) ui.box(WATCH[name], { tag: 'Don\'t mix them up!', color: R });
      });

      ui.el('h2', '', 'Now check you\'ve got them');
      ui.fill({ id: 'p05.blanks', label: 'Working properties: fill the blanks (5)', q: '<b>Fill in the blanks.</b>',
        html: 'Malleable materials can be permanently shaped by {{compression|hammering|squashing|pressing|rolling|squeezing|compressing}} without cracking. Ductile materials can be drawn into a thin {{wire|wires}} under {{tension|stretching|pulling|tensile force}}. The opposite of tough is {{brittle}}. A material that returns to its original shape when the force is removed is {{elastic}}.',
        explain: 'All five right! Malleable = compression, ductile = tension into a wire, tough vs brittle, elastic = returns.' });
      ui.tf({ id: 'p05.tf-glass', label: 'T/F: glass is hard so it is tough', statement: 'Glass is very hard, so it must be tough as well.', answer: false, mis: 'hard-vs-tough',
        explain: '<b>False.</b> Hard means it resists scratches and dents. Tough means it absorbs an impact without cracking. Glass is hard but <b>brittle</b>: hit it and it shatters.' });
      ui.tf({ id: 'p05.tf-elastic', label: 'T/F: stretchy plasticine is elastic', statement: 'Plasticine stretches a long way, so it is very elastic.', answer: false, mis: 'elastic-vs-stretchy',
        explain: '<b>False.</b> Elastic means it <b>returns to its original shape</b> when you let go. Plasticine stays stretched: that is <b>plastic</b> behaviour, not elastic.' });
    },
  });
})();
