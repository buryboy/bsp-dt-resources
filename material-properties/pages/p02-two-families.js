// Page 2 — Two families of properties: physical (what a material IS like) vs working (how it BEHAVES under a force).
(function () {
  'use strict';
  const B = Ink.BLUE, R = Ink.RED, G = Ink.GREEN;
  const ALWAYS = [-2, -1]; // a stroke window that is always complete
  const ease = (u) => (u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  // rotate points about (cx, cy) by th, then shift
  const xf = (pts, th = 0, cx = 0, cy = 0, dx = 0, dy = 0) => { const c = Math.cos(th), s = Math.sin(th); return pts.map(([x, y]) => [cx + (x - cx) * c - (y - cy) * s + dx, cy + (x - cx) * s + (y - cy) * c + dy]); };
  const path = (ctx, pts) => { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); };
  // hatch a fixed shape, seen only through a (moving / growing) clip shape: the hatch pattern never "boils"
  const hatchClip = (k, clipPts, fixedPts, o = {}) => { const c = k.ctx; c.save(); path(c, clipPts); c.clip(); Ink.hatchFill(c, fixedPts, o.p ?? 1, o.color || B, o.density || 1); c.restore(); };
  const HAND = (z) => `400 ${z}px "Gloria Hallelujah", "Comic Sans MS", cursive`;
  const fit = (k, s, maxW, size, min = 22) => { const c = k.ctx; c.save(); let z = size; for (; z > min; z--) { c.font = HAND(z); if (c.measureText(s).width <= maxW) break; } c.restore(); return z; };

  // little spring drawn as loops (prolate cycloid) from x0 to x0+L
  const spring = (x0, y0, L, n = 6, r = 9) => { const P = [], F = Math.PI * 2 * n, a = L / F; for (let i = 0; i <= n * 18; i++) { const f = (i / (n * 18)) * F; P.push([x0 + a * f + r * 0.55 * Math.sin(f), y0 - r * Math.cos(f) + r]); } return P; };

  // ---------- the 11 doodles ----------
  // Each doodle is drawn in a 120 x 76 local box, scaled by S. d gives: L (line), A (arrow), M (map a point),
  // hc (hatch a fixed local shape seen through a local clip), hat (hatch a local shape, optionally rotated about a pivot).
  const S = 1.15;
  const DOODLES = {
    absorbency(k, d, a, t) {
      const { L, M, hc } = d;
      const blk = k.rect(8, 42, 104, 30, 6);
      L(blk, a, a + 0.45, { w: 2.4, seed: 11 });
      L([[16, 52], [104, 52]], a + 0.3, a + 0.45, { w: 1.3, seed: 12 });
      L([[16, 62], [104, 62]], a + 0.35, a + 0.5, { w: 1.3, seed: 13 });
      // a drop falls in and soaks in
      const drop = (cx, cy) => [...k.curve([cx, cy - 13], [cx - 3, cy - 6], [cx - 9, cy + 1], [cx - 8, cy + 5], 10), ...k.curve([cx - 8, cy + 5], [cx - 6, cy + 12], [cx + 6, cy + 12], [cx + 8, cy + 5], 10).slice(1), ...k.curve([cx + 8, cy + 5], [cx + 9, cy + 1], [cx + 3, cy - 6], [cx, cy - 13], 10).slice(1)];
      if (t < a + 1.0) { const f = ease(k.win(a + 0.65, a + 1.0)); L(drop(60, 10 + f * 26), a + 0.45, a + 0.65, { w: 2.2, seed: 14 }); }
      const sp = ease(k.win(a + 1.0, a + 2.4));
      if (sp > 0) {
        const c = k.ctx; c.save(); c.translate(...M(0, 0)); c.scale(S, S); path(c, blk); c.clip();
        path(c, k.ellipse(60, 42, 8 + 30 * sp, 3 + 22 * sp, 0, Math.PI * 2)); c.clip(); Ink.hatchFill(c, blk, 1, B, 1.5); c.restore();
        if (t > a + 1.0 && t < a + 1.5) [[-1, -1], [1, -1], [-1.6, -0.3], [1.6, -0.3]].forEach(([u, v], i) => L([[60 + u * 10, 40 + v * 6], [60 + u * 16, 40 + v * 11]], a + 1.0, a + 1.08, { w: 1.6, seed: 15 + i }));
      }
    },
    density(k, d, a, t) {
      const { L } = d;
      L([[30, 74], [90, 74]], a, a + 0.15, { w: 2.4, seed: 21 });
      L([[48, 74], [60, 42], [72, 74]], a + 0.1, a + 0.35, { w: 2.4, seed: 22 });
      const th = -0.2 * ease(k.win(a + 1.0, a + 1.7)); // the heavier (denser) block's side goes down
      const rot = (pts) => xf(pts, th, 60, 40);
      L(rot([[6, 40], [114, 40]]), a + 0.3, a + 0.5, { w: 2.8, seed: 23 });
      const cubeL = k.rect(8, 15, 24, 24, 3), cubeR = k.rect(88, 15, 24, 24, 3);
      L(rot(cubeL), a + 0.5, a + 0.7, { w: 2.3, seed: 24 });
      L(rot(cubeR), a + 0.65, a + 0.85, { w: 2.3, seed: 25 });
      d.hat(cubeL, k.win(a + 0.75, a + 1.0), { density: 1.8, rot: th, cx: 60, cy: 40 });
    },
    fusibility(k, d, a, t) {
      const { L } = d;
      L([[4, 60], [116, 60]], a, a + 0.2, { w: 2.6, seed: 31 });
      const fl = Math.sin(t * 11) * 1.5;
      L([[50, 78], ...k.curve([50, 78], [44, 71], [56, 68], [60 + fl, 63], 10), ...k.curve([60 + fl, 63], [64, 68], [76, 71], [70, 78], 10)], a + 0.15, a + 0.4, { w: 2.2, color: R, seed: 32 });
      const m = 0.62 * ease(k.win(a + 0.9, a + 2.5));
      const w = 40 + 10 * m, h = 36 * (1 - m) + 2, x0 = 60 - w / 2, x1 = 60 + w / 2, top = 60 - h, rr = Math.min(h * 0.9, 3 + 16 * m);
      const blk = [[x0, 60], [x0, top + rr], ...k.curve([x0, top + rr], [x0, top], [x0 + rr, top], [x0 + rr * 1.3, top], 6), [x1 - rr * 1.3, top], ...k.curve([x1 - rr * 1.3, top], [x1 - rr, top], [x1, top], [x1, top + rr], 6), [x1, 60]];
      L(blk, a + 0.25, a + 0.6, { w: 2.4, seed: 33 });
      if (m > 0) {
        const rx = 22 + 34 * m, ry = 2 + 4 * m, pud = k.ellipse(60, 60, rx, ry, Math.PI, Math.PI * 2);
        L(pud, ...ALWAYS, { w: 2, seed: 34 });
        d.hc([...pud, [60 + rx, 60]], k.rect(2, 46, 116, 15), { density: 1.5 });
        // drips running down the sides
        if (m > 0.2) [[x0 + 2, 1], [x1 - 3, -1]].forEach(([x, s], i) => L([[x, top + rr + 2], [x + s, top + rr + 6 + 6 * m]], ...ALWAYS, { w: 2, seed: 35 + i }));
      }
    },
    electrical(k, d, a, t) {
      const { L, M } = d;
      const wA = [[16, 40], [16, 10], [62, 10], [62, 50], [84, 50]], wB = [[98, 50], [110, 50], [110, 70], [16, 70], [16, 50]];
      L([[5, 40], [27, 40]], a, a + 0.1, { w: 2.4, seed: 41 });
      L([[10, 50], [22, 50]], a + 0.08, a + 0.16, { w: 4.6, seed: 42 });
      L(wA, a + 0.15, a + 0.45, { w: 2, seed: 43 });
      L(wB, a + 0.4, a + 0.65, { w: 2, seed: 44 });
      L(k.ellipse(91, 27, 14, 15, 1.9, 1.9 + Math.PI * 1.62), a + 0.6, a + 0.85, { w: 2.3, seed: 45 });
      L(k.rect(84, 42, 14, 12, 2), a + 0.8, a + 0.95, { w: 2.1, seed: 46 });
      const lit = t > a + 1.05;
      L([[86, 42], [88, 28], [91, 33], [94, 28], [96, 42]], a + 0.9, a + 1.05, { w: 1.6, seed: 47, color: lit ? R : B });
      if (lit) {
        const pulse = 0.5 + 0.5 * Math.sin((t - a) * 9);
        for (let i = 0; i < 7; i++) {
          const an = -Math.PI * 0.95 + i * (Math.PI * 0.9 / 6), r0 = 19, r1 = 25 + pulse * 4;
          L([[91 + Math.cos(an) * r0, 27 + Math.sin(an) * r0], [91 + Math.cos(an) * r1, 27 + Math.sin(an) * r1]], a + 1.05 + i * 0.03, a + 1.12 + i * 0.03, { w: 1.8, color: R, seed: 48 + i });
        }
        // charge flowing round the circuit
        const loop = [...wA, ...wB];
        const seglen = []; let tot = 0; for (let i = 0; i < loop.length - 1; i++) { const q = Math.hypot(loop[i + 1][0] - loop[i][0], loop[i + 1][1] - loop[i][1]); seglen.push(q); tot += q; }
        for (let s = ((t - a) * 40) % 20; s < tot; s += 20) {
          let rem = s, i = 0; while (i < seglen.length - 1 && rem > seglen[i]) { rem -= seglen[i]; i++; }
          const u = rem / (seglen[i] || 1), p = [loop[i][0] + (loop[i + 1][0] - loop[i][0]) * u, loop[i][1] + (loop[i + 1][1] - loop[i][1]) * u];
          if (Math.abs(p[0] - 91) < 8 && p[1] < 56) continue;
          k.dot(...M(p[0], p[1]), 2.4, a, { color: R });
        }
      }
    },
    thermal(k, d, a, t) {
      const { L } = d;
      const rod = k.rect(8, 32, 106, 13, 5);
      L(rod, a, a + 0.4, { w: 2.4, seed: 51 });
      const fl = Math.sin(t * 12) * 1.5;
      L([[16, 76], ...k.curve([16, 76], [10, 67], [22, 64], [24 + fl, 52], 10), ...k.curve([24 + fl, 52], [28, 64], [38, 67], [32, 76], 10)], a + 0.35, a + 0.6, { w: 2.2, color: R, seed: 52 });
      const hp = k.win(a + 0.8, a + 2.4);
      if (hp > 0) {
        d.hc(k.rect(6, 28, 4 + 108 * hp, 20, 2), rod, { color: R, density: 1.4 });
        for (let j = 0; j < 5; j++) {
          const u = j / 4; if (u > hp + 0.01) break;
          const x = 18 + u * 84, bob = Math.sin(t * 6 + j) * 2;
          L([[x - 7, 22 + bob], [x - 2, 14 + bob], [x + 3, 22 + bob], [x + 8, 14 + bob]], a + 0.8 + u * 1.5, a + 0.95 + u * 1.5, { w: 1.8, color: R, seed: 53 + j });
        }
      }
    },
    strength(k, d, a, t) {
      const { L, A } = d;
      const pull = t > a + 0.9 ? 3 + 3 * Math.sin((t - a) * 7) : 0;
      L([[26, 31], [94, 31]], a, a + 0.25, { w: 2.2, seed: 61 });
      L([[26, 43], [94, 43]], a + 0.1, a + 0.35, { w: 2.2, seed: 62 });
      for (let x = 28; x < 92; x += 6) L([[x, 43], [x + 6, 31]], a + 0.3 + (x - 28) / 260, a + 0.34 + (x - 28) / 260, { w: 1.4, seed: 63 + x, retrace: false });
      A([[24 - pull * 0.3, 37], [2 - pull, 37]], a + 0.6, a + 0.85, { color: R, w: 2.6, head: 10, seed: 64 });
      A([[96 + pull * 0.3, 37], [118 + pull, 37]], a + 0.7, a + 0.95, { color: R, w: 2.6, head: 10, seed: 65 });
    },
    hardness(k, d, a, t) {
      const { L } = d;
      const slab = k.rect(4, 50, 112, 20, 4);
      L(slab, a, a + 0.35, { w: 2.4, seed: 71 });
      L([[12, 56], [24, 56]], a + 0.3, a + 0.4, { w: 1.4, seed: 72 }); L([[88, 64], [106, 64]], a + 0.35, a + 0.45, { w: 1.4, seed: 73 });
      const m = ease(k.win(a + 0.9, a + 1.7)), tx = 18 + m * 64, ty = 49;
      // a nail held at an angle: point, shaft, head
      const nail = [[[0, 0], [-4, -6], [-18, -38]], [[-11, -40], [-25, -33]], [[0, 0], [-7, -3]]];
      nail.forEach((p, i) => L(p.map(([x, y]) => [tx + x, ty + y]), a + 0.4 + i * 0.15, a + 0.55 + i * 0.15, { w: i === 1 ? 3.4 : 2.4, seed: 74 + i }));
      if (m > 0) L([[18, 49], [tx, 49]], ...ALWAYS, { w: 0.8, seed: 79, color: [150, 160, 210], retrace: false });
      if (t > a + 1.8) L([[96, 20], [102, 28], [116, 12]], a + 1.8, a + 2.0, { w: 3, color: G, seed: 76 });
    },
    toughness(k, d, a, t) {
      const { L } = d;
      L(k.rect(18, 52, 80, 18, 4), a, a + 0.35, { w: 2.4, seed: 81 });
      const sw = k.win(a + 0.9, a + 1.12), back = k.win(a + 1.12, a + 1.5);
      const th = t < a + 1.12 ? 0.5 * (1 - sw * sw) : 0.16 * Math.sin(back * Math.PI) * (1 - back * 0.3);
      const P = [116, 37];
      const hm = (pts) => xf(pts.map(([x, y]) => [P[0] + x, P[1] + y]), th, P[0], P[1]);
      L(hm([[0, -2.5], [-52, -2.5]]), a + 0.35, a + 0.5, { w: 2.2, seed: 82 });
      L(hm([[0, 2.5], [-52, 2.5]]), a + 0.4, a + 0.55, { w: 2.2, seed: 89 });
      const head = k.rect(-66, -15, 16, 30, 3);
      L(hm(head), a + 0.5, a + 0.75, { w: 2.4, seed: 83 });
      d.hat(head.map(([x, y]) => [x + P[0], y + P[1]]), k.win(a + 0.7, a + 0.9), { rot: th, cx: P[0], cy: P[1], density: 1.5 });
      if (t > a + 1.12 && t < a + 1.9) for (let i = 0; i < 5; i++) { const an = Math.PI + 0.3 + i * 0.62, r0 = 16, r1 = 25; L([[58 + Math.cos(an) * r0, 52 + Math.sin(an) * r0 * 0.8], [58 + Math.cos(an) * r1, 52 + Math.sin(an) * r1 * 0.8]], a + 1.12, a + 1.2, { w: 1.8, seed: 84 + i }); }
      if (t > a + 1.6) L([[2, 30], [8, 38], [22, 22]], a + 1.6, a + 1.8, { w: 3, color: G, seed: 88 });
    },
    malleability(k, d, a, t) {
      const { L } = d;
      L([[2, 70], [118, 70]], a, a + 0.2, { w: 2.6, seed: 91 });
      const s = ease(k.win(a + 0.95, a + 1.1)) * 0.5 + ease(k.win(a + 1.55, a + 1.7)) * 0.5;
      const w = 40 + 64 * s, h = 1200 / w, bx = 60 - w / 2, by = 70 - h;
      L(k.rect(bx, by, w, h, 3), a + 0.15, a + 0.45, { w: 2.4, seed: 92 });
      d.hat(k.rect(0, 0, w, h, 3), k.win(a + 0.45, a + 0.7), { dx: bx, dy: by, density: 1.2 });
      // the hammer head comes down on the block at each hit
      const hit = (c) => { const q = (t - c) / 0.22; return q < -1 || q > 1.6 ? 0 : q < 0 ? 1 + q : Math.max(0, 1 - q / 1.6); };
      const down = Math.max(hit(a + 1.1), hit(a + 1.7)), face = 70 - h - 1 - (1 - down) * 16, hy = face - 14;
      L([[46, hy], [74, hy], [74, face], [46, face], [46, hy + 1]], a + 0.5, a + 0.7, { w: 2.4, seed: 93 });
      L([[68, hy], [104, hy - 22]], a + 0.65, a + 0.8, { w: 3.4, seed: 94 });
      [a + 1.1, a + 1.7].forEach((c, i) => { if (t > c && t < c + 0.4) { L([[bx - 5, 64], [bx - 14, 58]], ...ALWAYS, { w: 1.6, seed: 95 + i }); L([[bx + w + 5, 64], [bx + w + 14, 58]], ...ALWAYS, { w: 1.6, seed: 97 + i }); } });
    },
    ductility(k, d, a, t) {
      const { L, A } = d;
      const m = ease(k.win(a + 0.9, a + 2.2)), x0 = 4 + 10 * m;
      L([[40, 29], [x0, 29], [x0, 45], [40, 45]], a, a + 0.3, { w: 2.4, seed: 101 });
      // a die: two blocks with a tapered hole
      const top = [[40, 8], [56, 8], [56, 35], [52, 35], [40, 29], [40, 8]], bot = [[40, 66], [56, 66], [56, 39], [52, 39], [40, 45], [40, 66]];
      L(top, a + 0.25, a + 0.4, { w: 2.3, seed: 102 });
      L(bot, a + 0.3, a + 0.45, { w: 2.3, seed: 103 });
      d.hat(top, k.win(a + 0.4, a + 0.6), { density: 1.5 }); d.hat(bot, k.win(a + 0.4, a + 0.6), { density: 1.5 });
      L([[40, 29], [52, 35]], ...(t > a + 0.3 ? ALWAYS : [9e9, 9e9]), { w: 1.4, seed: 106 });
      const Lw = 6 + 36 * m;
      L([[56, 37], [56 + Lw, 37]], a + 0.45, a + 0.6, { w: 2.2, seed: 104 });
      if (t > a + 0.7) A([[60 + Lw, 37], [76 + Lw, 37]], a + 0.7, a + 0.9, { color: R, w: 2.6, head: 9, seed: 105 });
    },
    elasticity(k, d, a, t) {
      const { L, A } = d;
      L([[8, 14], [8, 62]], a, a + 0.15, { w: 2.6, seed: 111 });
      for (let i = 0; i < 4; i++) L([[8, 18 + i * 12], [2, 24 + i * 12]], a + 0.12 + i * 0.02, a + 0.16 + i * 0.02, { w: 1.4, seed: 112 + i, retrace: false });
      const pull = ease(k.win(a + 0.9, a + 1.3)), rel = t - (a + 1.55);
      let Ls = 52 + 34 * pull;
      if (rel > 0) Ls = 52 + 34 * Math.exp(-rel * 3.2) * Math.cos(rel * 14);
      L(spring(8, 29, Ls, 6, 8), a + 0.15, a + 0.6, { w: 2, seed: 117 });
      if (t > a + 0.85 && rel < 0) A([[12 + Ls, 37], [30 + Ls, 37]], a + 0.85, a + 0.95, { color: R, w: 2.6, head: 9, seed: 118 });
      if (rel > 0.6) L([[92, 22], [98, 30], [112, 14]], a + 2.15, a + 2.35, { w: 3, color: G, seed: 119 });
    },
  };
  // the drawing helpers handed to each doodle (local coords → canvas coords)
  function kitFor(k, ox, oy) {
    const M = (x, y) => [ox + x * S, oy + y * S];
    const map = (pts) => pts.map(([x, y]) => M(x, y));
    return {
      M,
      L: (pts, a, b, o) => k.line(map(pts), a, b, o),
      A: (pts, a, b, o = {}) => k.arrow(map(pts), a, b, o),
      // hatch a fixed local shape, seen through a local clip shape (stable pattern while the clip grows)
      hc(clipPts, fixedPts, o = {}) { const c = k.ctx; c.save(); c.translate(ox, oy); c.scale(S, S); path(c, clipPts); c.clip(); Ink.hatchFill(c, fixedPts, 1, o.color || B, o.density || 1); c.restore(); },
      // hatch a local shape, optionally shifted (dx, dy) or rotated by rot about (cx, cy)
      hat(pts, p, o = {}) { if (p <= 0) return; const c = k.ctx; c.save(); c.translate(ox, oy); c.scale(S, S); if (o.rot) { c.translate(o.cx, o.cy); c.rotate(o.rot); c.translate(-o.cx, -o.cy); } if (o.dx || o.dy) c.translate(o.dx || 0, o.dy || 0); Ink.hatchFill(c, pts, p, o.color || B, o.density || 1); c.restore(); },
    };
  }

  const PHYS = [
    ['absorbency', 'soaks up liquid', 'absorbency'],
    ['density', 'mass for its size', 'density'],
    ['fusibility', 'melts when heated', 'fusibility'],
    ['electrical\nconductivity', 'lets electricity flow', 'electrical'],
    ['thermal\nconductivity', 'lets heat pass through', 'thermal'],
  ];
  const WORK = [
    ['strength', 'won\'t break or bend', 'strength'],
    ['hardness', 'hard to scratch or dent', 'hardness'],
    ['toughness', 'takes a hit, no cracks', 'toughness'],
    ['malleability', 'squashed, doesn\'t crack', 'malleability'],
    ['ductility', 'pulls out into a wire', 'ductility'],
    ['elasticity', 'springs back to shape', 'elasticity'],
  ];
  const W = 860, H = 728, T_PHYS = 3.4, T_WORK = 10.0, STEP = 1.25, DUR = 19, TOP = 132;

  function drawFamilies(k, t, hint) {
    // the divider and the two headings
    k.line([[430, 16], [431, 350], [429, 700]], 0.15, 0.9, { w: 2.6, seed: 3 });
    k.text('PHYSICAL', 215, 56, 0.4, 1.1, { font: 'bubble', size: 44, align: 'center' });
    k.text('what a material IS like', 215, 92, 1.1, 1.6, { size: 23, align: 'center' });
    k.text('(its make-up)', 215, 117, 1.5, 1.8, { size: 22, align: 'center' });
    k.text('WORKING', 645, 56, 1.7, 2.4, { font: 'bubble', size: 44, align: 'center' });
    k.text('how it BEHAVES when a force', 645, 92, 2.3, 2.8, { size: 23, align: 'center' });
    k.text('is applied or it is worked', 645, 117, 2.7, 3.0, { size: 22, align: 'center' });
    k.line([[110, 128], [215, 131], [320, 127]], 1.75, 1.95, { color: R, w: 2.2, seed: 5 });
    k.line([[500, 128], [645, 131], [790, 127]], 2.95, 3.15, { color: R, w: 2.2, seed: 6 });

    const rows = (list, colX, rowH, t0) => list.forEach(([name, cap, key], i) => {
      const a = t0 + i * STEP, rt = TOP + i * rowH, ox = colX + 12, oy = rt + (rowH - 76 * S) / 2;
      if (t >= a) DOODLES[key](k, kitFor(k, ox, oy), a, t);
      else if (hint) { // before the first play: empty slots waiting to be filled
        k.text('?', ox + 60 * S, rt + rowH / 2 + 12, ...ALWAYS, { size: 38, align: 'center', color: [150, 160, 210] });
        k.line([[colX + 176, rt + rowH / 2 + 8], [colX + 330, rt + rowH / 2 + 8]], ...ALWAYS, { w: 1.4, color: [150, 160, 210], seed: 200 + i + colX, retrace: false });
      }
      const tx = colX + 12 + 120 * S + 12, maxW = 430 - (tx - colX) - 4;
      const lines = name.split('\n'), mid = rt + rowH / 2, y0 = mid - (lines.length - 1) * 14 - 4;
      lines.forEach((ln, j) => k.text(ln, tx, y0 + j * 28, a + 0.55 + j * 0.2, a + 0.8 + j * 0.2, { size: fit(k, ln, maxW, 27, 22) }));
      k.text(cap, tx, y0 + (lines.length - 1) * 28 + 29, a + 0.9, a + 1.3, { size: fit(k, cap, maxW, 22, 20), color: [70, 84, 170] });
    });
    rows(PHYS, 0, 112, T_PHYS);
    rows(WORK, 430, 94, T_WORK);
  }

  Book.page({
    id: 'p02',
    title: 'Two families of properties',
    build(ui) {
      ui.h('Two families', { size: 54 });

      const hook = ui.box('<p class="lede" style="margin:0 0 10px">Why can\'t we make a <b>saucepan out of chocolate</b>, or a <b>bike tyre out of glass</b>?</p>' +
        '<p class="small" style="margin:0">Think of a reason for each. Then tap the button.</p>', { tag: 'Think first' });
      const rb = ui.el('button', 'btn', 'Show me why', hook);
      const ans = ui.el('div', '', '<p style="margin:12px 0 8px"><b>Chocolate saucepan:</b> it would melt on the hob. How easily a material melts is about what it <i>is like</i>: a <span class="key">physical</span> property (fusibility).</p>' +
        '<p style="margin:0"><b>Glass tyre:</b> the first pothole would shatter it, and it can\'t squash and spring back like rubber. That\'s about how it <i>behaves when a force hits it</i>: <span class="key">working</span> properties (toughness, elasticity).</p>', hook);
      ans.style.display = 'none';
      rb.onclick = () => { ans.style.display = ''; rb.remove(); Book.sfx('paper', { gain: 0.4 }); Book.scribble(0.3); };

      let played = false;
      ui.p('So properties come in <b>two families</b>. Tap the picture to watch every property get drawn in its family.');
      ui.anim({
        w: W, h: H, duration: DUR, poster: 3.3,
        draw: (k, t) => drawFamilies(k, t, !played),
        onPlay: () => { played = true; },
        sound(k) {
          k.bed('room', 0, DUR, { gain: 0.3 });
          k.play('stroke', 0.15, { material: 'pen', dur: 0.75, gain: 0.45 });
          k.play('stroke', 0.4, { material: 'pen', dur: 0.7, gain: 0.5 });
          k.play('stroke', 1.7, { material: 'pen', dur: 0.7, gain: 0.5 });
          [...PHYS.map((_, i) => T_PHYS + i * STEP), ...WORK.map((_, i) => T_WORK + i * STEP)].forEach((a) => { k.play('stroke', a, { material: 'pen', dur: 0.8, gain: 0.45 }); k.play('stroke', a + 0.6, { material: 'pen', dur: 0.6, gain: 0.35 }); });
          k.play('pop', T_PHYS + 1.0, { f: 900, gain: 0.35 });
          k.play('blip', T_PHYS + 3 * STEP + 1.05, { gain: 0.25 });
          k.play('thud', T_WORK + 2 * STEP + 1.12, { gain: 0.4 });
          k.play('thud', T_WORK + 3 * STEP + 1.1, { gain: 0.3 }); k.play('thud', T_WORK + 3 * STEP + 1.7, { gain: 0.3 });
          k.play('swish', T_WORK + 5 * STEP + 1.55, { gain: 0.3 });
          k.play('success', DUR - 0.6, { f: 'G5', gain: 0.4 });
        },
      });

      const famNotes = ui.box('<p style="margin:0 0 10px"><span class="key">Physical properties</span> describe what a material <b>is like</b> (its make-up), whatever you do to it: absorbency, density, fusibility, electrical conductivity and thermal conductivity.</p>' +
        '<p style="margin:0 0 10px"><span class="key">Working properties</span> (sometimes called <i>mechanical</i> properties) describe how a material <b>behaves when a force is applied or it is worked</b>: strength, hardness, toughness, malleability, ductility and elasticity.</p>' +
        '<p class="small" style="margin:0">Quick test: if you have to <b>push, pull, hit, bend or shape</b> it to find out, it\'s a working property.</p>', { tag: 'Notes' });

      const flat = (n) => n.replace(/\n/g, ' ');
      const all = [...PHYS.map(([n]) => ({ t: flat(n), b: 0, mis: 'physical-vs-working' })), ...WORK.map(([n]) => ({ t: flat(n), b: 1, mis: 'physical-vs-working' }))];
      ui.p('<span class="small">Read the notes first. When you start sorting, the notes and the drawing <b>blur out</b> until you get all 11 right (or after 3 checks).</span>');
      const famSort = ui.sort({ id: 'p02.families', label: 'Sort 11 properties: physical or working', q: '<b>Sort them!</b> Tap a property, then tap its family.',
        buckets: ['Physical: what it IS like', 'Working: how it BEHAVES under a force'], items: all,
        explain: 'All 11 sorted! 5 physical, 6 working.' });
      ui.hideWhile(famSort, 'p02.families', [famNotes, ...ui.root.querySelectorAll('canvas.ink-anim')]);

      ui.mcq({ id: 'p02.dent', label: 'Which family: "will it dent if a child drops it?"',
        q: 'A designer asks: <i>"Will it dent if a child drops it?"</i> Which family is that question about?',
        options: [
          { t: 'Working properties: it\'s about how the material behaves when a force hits it', ok: true, why: 'Yes! Dropping it applies a force (an impact). Resisting dents is hardness, and taking the knock without cracking is toughness: both working properties.' },
          { t: 'Physical properties: it\'s about what the material is made of', mis: 'physical-vs-working', why: 'Every property depends on what the material is made of! The clue is the force: dropping it is an impact, so this is about how it behaves. That makes it a working property.' },
          { t: 'Physical properties: heavier, denser materials dent more', mis: 'density-vs-weight', why: 'Density is mass for its size. It doesn\'t tell you if something dents. Resisting dents is hardness, a working property.' },
        ] });
    },
  });
})();
