// ink.js — the Ballpoint Notebook look for the interactive exercise book.
// Ported from the Ballpoint Notebook style (styles/ballpoint-notebook in papercraft-explainer-kit): pressure-varied
// Bic strokes with ink blobs, wobble, retrace, 45° hatching, hatched drop shadows and bubble lettering.
//
//   Ink.BLUE, Ink.RED, Ink.GREEN                         ink colours ([r,g,b])
//   Ink.bubble(text, { size, color, rot })               -> <canvas> bubble-letter heading with hatched shadow
//   Ink.frame(el, { color, shadow, radius, seed })        hand-drawn wobbly border (+ hatched shadow) behind a DOM box
//   Ink.underline(el) / Ink.circle(el)                    hand-drawn emphasis around an element
//   Ink.anim(canvas, { duration, draw(k, t), sound(k), loop, autoplay })
//        -> animated pen-drawn scene with a play/replay control. In draw(k, t), k is a drawing kit:
//           k.line(pts, a, b, { color, w, retrace })   pen draws pts between times a..b
//           k.text(str, x, y, a, b, { size, color, align, font:'hand'|'bubble', rot })
//           k.arrow(pts, a, b, opts)  k.box(x,y,w,h,a,b,opts)  k.circle(cx,cy,r,a,b,opts)  k.dot(x,y,r,a,opts)
//           k.hatch(pts, a, b, { color, density })    hatch-fill a closed shape over a..b
//           k.shadow(pts, a, b)                        hatched drop shadow behind a closed shape
//           k.rect(x,y,w,h) k.ellipse(cx,cy,rx,ry) k.curve(p0,p1,p2,p3) -> point lists
//           k.t (time), k.W, k.H, k.ctx (raw 2D context, already in multiply mode)
//        Logical size is the canvas's width/height attributes; it scales with CSS. The pen is drawn automatically
//        at whatever stroke is in progress. Returns { play(), seek(t), stop() }.
(function () {
  'use strict';
  const Ink = (window.Ink = {});
  const BLUE = (Ink.BLUE = [30, 46, 150]), RED = (Ink.RED = [178, 28, 38]), GREEN = (Ink.GREEN = [24, 110, 60]);
  const rgba = (c, a) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
  Ink.rgba = rgba;
  const nz = H.makeNoise(57);
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const win = (t, a, b) => clamp((t - a) / Math.max(1e-6, b - a));
  Ink.win = win;

  // ---------- geometry ----------
  const seg = (pts, step = 2.5) => {
    const out = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
      const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / step));
      for (let j = 0; j < n; j++) out.push([x0 + (x1 - x0) * j / n, y0 + (y1 - y0) * j / n]);
    }
    out.push(pts[pts.length - 1]);
    return out;
  };
  const normals = (P) => P.map((p, i) => {
    const a = P[Math.max(0, i - 1)], b = P[Math.min(P.length - 1, i + 1)];
    const dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1;
    return [-dy / d, dx / d];
  });
  const wob = (pts, seed, amp = 1.0, freq = 0.02) => {
    const N = normals(pts); let L = 0;
    return pts.map((p, i) => {
      if (i) L += Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]);
      const o = nz.n2(L * freq + seed * 1.37, seed * 0.71) * amp + nz.n2(L * freq * 6 + seed, seed + 3.3) * amp * 0.3;
      return [p[0] + N[i][0] * o, p[1] + N[i][1] * o];
    });
  };
  const ellipse = (cx, cy, rx, ry, a0 = -1.4, a1 = a0 + Math.PI * 2 + 0.25) => {
    const n = Math.max(16, Math.ceil(Math.abs(a1 - a0) * Math.max(rx, ry) / 4)), o = [];
    for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; o.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); }
    return o;
  };
  const rect = (x, y, w, h, r = 8) => {
    const o = [[x + r, y], [x + w - r, y]], arc = (cx, cy, s, e) => { for (let i = 1; i <= 5; i++) { const a = s + (e - s) * i / 5; o.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } };
    arc(x + w - r, y + r, -Math.PI / 2, 0); o.push([x + w, y + h - r]); arc(x + w - r, y + h - r, 0, Math.PI / 2);
    o.push([x + r, y + h]); arc(x + r, y + h - r, Math.PI / 2, Math.PI); o.push([x, y + r]); arc(x + r, y + r, Math.PI, Math.PI * 1.5);
    o.push([x + r + 6, y - 1]); return o;
  };
  const curve = (p0, p1, p2, p3, n = 40) => {
    const o = []; for (let i = 0; i <= n; i++) { const t = i / n, m = 1 - t; o.push([m * m * m * p0[0] + 3 * m * m * t * p1[0] + 3 * m * t * t * p2[0] + t * t * t * p3[0], m * m * m * p0[1] + 3 * m * m * t * p1[1] + 3 * m * t * t * p2[1] + t * t * t * p3[1]]); } return o;
  };
  const head = (P, len = 18, spread = 0.5) => {
    const a = P[P.length - 1], b = P[Math.max(0, P.length - 4)], an = Math.atan2(a[1] - b[1], a[0] - b[0]);
    return [[a[0] - Math.cos(an - spread) * len, a[1] - Math.sin(an - spread) * len], a, [a[0] - Math.cos(an + spread) * len, a[1] - Math.sin(an + spread) * len]];
  };
  Ink.geo = { seg, wob, ellipse, rect, curve, head };

  // ---------- the ballpoint stroke ----------
  function bpl(ctx, pts, seed, w, a, rgb, done = true) {
    const n = pts.length; if (n < 2) return;
    const rr = H.rng(seed);
    const skip = rr.chance(0.25) ? Math.floor(rr.range(0.2, 0.8) * n) : -1;
    for (let i = 0; i < n - 1; i += 2) {
      if (skip >= 0 && i >= skip && i < skip + 2) continue;
      const nv = 0.5 + 0.5 * (0.75 * nz.n2(i * 0.022 + seed * 0.3, seed * 0.11) + 0.25 * Math.sin(i * 0.19 + seed * 1.7));
      const pr = 0.55 + 0.45 * nv;
      ctx.strokeStyle = rgba(rgb, a * pr); ctx.lineWidth = w * (0.7 + 0.42 * pr);
      ctx.beginPath(); ctx.moveTo(pts[i][0], pts[i][1]); ctx.lineTo(pts[i + 1][0], pts[i + 1][1]);
      if (pts[i + 2]) ctx.lineTo(pts[i + 2][0], pts[i + 2][1]);
      ctx.stroke();
    }
    if (rr.chance(0.8)) { const r0 = w * rr.range(1.0, 1.7); ctx.fillStyle = rgba(rgb, 0.9); ctx.beginPath(); ctx.ellipse(pts[0][0] + 0.3, pts[0][1], r0, r0 * 0.85, rr() * 3, 0, 7); ctx.fill(); }
    if (done && rr.chance(0.4)) { const q = pts[n - 1]; ctx.fillStyle = rgba(rgb, 0.8); ctx.beginPath(); ctx.arc(q[0], q[1], w * 1.2 * rr.range(0.7, 1), 0, 7); ctx.fill(); }
  }
  Ink.stroke = (ctx, pts, opts = {}) => {
    const seed = opts.seed ?? (((pts[0][0] * 13 + pts[0][1] * 7) | 0) + 5);
    const P = wob(seg(pts, 2.5), seed % 83, opts.amp ?? 0.9);
    const W0 = (opts.w ?? 2.6) * 1.25;
    const p = opts.p ?? 1, Q = p < 1 ? P.slice(0, Math.max(2, Math.ceil(P.length * p))) : P;
    const w = W0, rgb = opts.color || BLUE;
    bpl(ctx, Q, seed, Math.max(1.2, w * 0.55), 0.95, rgb, p >= 1);
    if (opts.retrace !== false && w >= 2.4) bpl(ctx, wob(seg(pts, 2.5), (seed + 7) % 83, 1.2).slice(0, Q.length), seed + 1, Math.max(0.9, w * 0.28), 0.6, rgb, false);
    return Q[Q.length - 1];
  };

  // hatched fill inside a closed shape (lit from top-left), p = 0..1 build-up
  Ink.hatchFill = (ctx, pts, p = 1, rgb = BLUE, density = 1) => {
    if (p <= 0) return;
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; pts.forEach(([x, y]) => { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); });
    const w = x1 - x0, h = y1 - y0, L = w + h, rr = H.rng(((x0 * 11 + y0 * 3) | 0) + 17);
    ctx.save(); ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.clip();
    const layer = (dir, uMin, sp, al, pp) => {
      if (pp <= 0) return; ctx.strokeStyle = rgba(rgb, al); ctx.lineWidth = 1; ctx.beginPath();
      sp /= density;
      if (dir === 0) {
        for (let o = uMin * L; o < L * (uMin + (1 - uMin) * pp); o += sp * (0.85 + rr() * 0.3)) {
          const c = x0 + y0 + o; let sx = Math.max(x0 - 4, c - y1 - 4); const bx = Math.min(x1 + 4, c - y0 + 4);
          while (sx < bx) { const ex = Math.min(bx, sx + rr.range(26, 70)), j = rr.range(-0.9, 0.9); ctx.moveTo(sx + j, c - sx); ctx.lineTo(ex + j, c - ex); sx = ex + rr.range(-3, 1.5); }
        }
      } else {
        const cut = x0 + y0 + uMin * L;
        for (let o = -h; o < w; o += sp * (0.85 + rr() * 0.3)) {
          const k = x0 - y0 + o, sxa = Math.max(x0 - 4, y0 - 4 + k, (cut + k) / 2), sxb = Math.min(x1 + 4, y1 + 4 + k), span = sxb - sxa;
          if (span < 3) continue; const ex = sxa + span * Math.min(1, pp * 1.3); let sx = sxa;
          while (sx < ex) { const e2 = Math.min(ex, sx + rr.range(22, 60)), j = rr.range(-0.9, 0.9); ctx.moveTo(sx, sx - k + j); ctx.lineTo(e2, e2 - k + j); sx = e2 + rr.range(-3, 1.5); }
        }
      }
      ctx.stroke();
    };
    layer(0, 0.0, 6.0, 0.36, win(p, 0, 0.6));
    layer(1, 0.45, 6.4, 0.34, win(p, 0.35, 1));
    ctx.restore();
  };
  // hatched drop shadow behind a closed shape
  Ink.hatchShadow = (ctx, pts, p = 1, dx = 8, dy = 8, rgb = BLUE) => {
    if (p <= 0) return;
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; pts.forEach(([x, y]) => { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); });
    ctx.save();
    ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x + dx, y + dy) : ctx.moveTo(x + dx, y + dy))); ctx.closePath(); ctx.clip();
    ctx.beginPath(); ctx.rect(x0 - 50, y0 - 50, x1 - x0 + 100 + dx, y1 - y0 + 100 + dy);
    pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.clip('evenodd');
    const rr = H.rng((x0 * 7) | 0), span = (x1 - x0 + y1 - y0 + 2 * (dx + dy)) * p;
    ctx.strokeStyle = rgba(rgb, 0.6); ctx.lineWidth = 1.2; ctx.beginPath();
    for (let o = 0; o < span; o += 4.4) { const j = rr.range(-1, 1); ctx.moveTo(x0 + o - (y1 - y0) - dy + j, y1 + dy + 4); ctx.lineTo(x0 + o + 4 + j, y0 - 4); }
    ctx.stroke(); ctx.restore();
  };

  // ---------- bubble lettering ----------
  // drawBubble(ctx, s, x, y, size, rgb, p, rot, align) — p reveals letters left to right
  Ink.drawBubble = (ctx, s, x, y, size, rgb = BLUE, p = 1, rot = 0, align = 'left') => {
    const font = `700 ${size}px "Fredoka", "Arial Rounded MT Bold", system-ui`;
    ctx.save(); ctx.font = font;
    const pos = []; let px = 0;
    for (let i = 0; i < s.length; i++) { pos.push(px); px += ctx.measureText(s[i]).width + size * 0.06; }
    const w = px, x0 = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x, n = Math.ceil(s.length * p), off = size * 0.08;
    // shadow mask on an offscreen layer, then hatch through it
    const M = document.createElement('canvas'); M.width = Math.ceil(w + off + 30); M.height = Math.ceil(size * 1.6 + off);
    const mc = M.getContext('2d'); mc.font = font; mc.translate(10, size * 1.15);
    mc.fillStyle = '#000'; for (let i = 0; i < n; i++) if (s[i] !== ' ') mc.fillText(s[i], pos[i] + off, off);
    mc.globalCompositeOperation = 'destination-out'; mc.lineWidth = 3;
    for (let i = 0; i < n; i++) if (s[i] !== ' ') { mc.fillText(s[i], pos[i], 0); mc.strokeText(s[i], pos[i], 0); }
    mc.globalCompositeOperation = 'source-in'; mc.setTransform(1, 0, 0, 1, 0, 0);
    mc.strokeStyle = rgba(rgb, 0.85); mc.lineWidth = 1.1; mc.beginPath();
    for (let o = -M.height; o < M.width + M.height; o += 3.6) { mc.moveTo(o, M.height); mc.lineTo(o + M.height * 0.9, 0); } mc.stroke();
    ctx.translate(x0, y); ctx.rotate(rot);
    ctx.drawImage(M, -10, -size * 1.15);
    ctx.lineJoin = 'round';
    [[0, 0, Math.max(1.6, size / 40), 1.0], [0.8, -0.6, Math.max(1, size / 70), 0.8]].forEach(([dx, dy, lw, a]) => {
      ctx.strokeStyle = rgba(rgb, a); ctx.lineWidth = lw;
      for (let i = 0; i < n; i++) if (s[i] !== ' ') ctx.strokeText(s[i], pos[i] + dx, dy);
    });
    ctx.restore();
    return { w, tip: [x0 + (pos[Math.min(n, pos.length - 1)] || w), y - size * 0.4] };
  };
  // A <canvas> heading in bubble letters (crisp on retina). Width fits the text.
  Ink.bubble = (s, opts = {}) => {
    const size = opts.size || 54, rgb = opts.color || BLUE, dpr = Math.min(2, window.devicePixelRatio || 1);
    const c = document.createElement('canvas');
    c.className = 'ink-bubble'; c.setAttribute('role', 'heading'); c.setAttribute('aria-label', s);
    const draw = () => {
      const m = c.getContext('2d'); m.setTransform(1, 0, 0, 1, 0, 0); m.font = `700 ${size}px "Fredoka", "Arial Rounded MT Bold", system-ui`;
      let w = 0; for (const ch of s) w += m.measureText(ch).width + size * 0.06; w += size * 0.3 + 24; const h = size * 1.45;
      c.width = Math.ceil(w * dpr); c.height = Math.ceil(h * dpr); c.style.width = Math.ceil(w) + 'px';
      const x = c.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, w, h); Ink.drawBubble(x, s, 8, size * 1.05, size, rgb, 1, opts.rot || -0.012);
    };
    draw(); if (document.fonts) document.fonts.ready.then(draw);
    return c;
  };

  // ---------- DOM decorations: hand-drawn frame / underline / circle ----------
  // Draws into a canvas absolutely positioned behind/over `el` (el must be position:relative). Redraws on resize.
  function overlay(el, cls, paint, pad = 14) {
    let c = el.querySelector(':scope > canvas.' + cls);
    if (!c) { c = document.createElement('canvas'); c.className = 'ink-ov ' + cls; el.prepend(c); }
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const go = () => {
      const w = el.offsetWidth + pad * 2, h = el.offsetHeight + pad * 2; if (w < 4 || h < 4) return;
      c.width = Math.ceil(w * dpr); c.height = Math.ceil(h * dpr);
      Object.assign(c.style, { position: 'absolute', left: -pad + 'px', top: -pad + 'px', width: w + 'px', height: h + 'px', pointerEvents: 'none', zIndex: 0 });
      const x = c.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, w, h);
      x.globalCompositeOperation = 'multiply'; x.lineCap = 'round'; x.lineJoin = 'round'; x.translate(pad, pad);
      paint(x, el.offsetWidth, el.offsetHeight);
    };
    go(); if (window.ResizeObserver) { const ro = new ResizeObserver(go); ro.observe(el); }
    return go;
  }
  Ink.frame = (el, o = {}) => overlay(el, 'ink-frame', (x, w, h) => {
    const P = rect(2, 2, w - 4, h - 4, o.radius ?? 10);
    if (o.shadow !== false) Ink.hatchShadow(x, P, 1, 7, 7, o.color || BLUE);
    Ink.stroke(x, P, { color: o.color || BLUE, w: o.w || 2.8, seed: o.seed || (w * 3 + h) | 0 });
  });
  Ink.underline = (el, o = {}) => overlay(el, 'ink-ul', (x, w, h) => {
    Ink.stroke(x, [[0, h + 2], [w * 0.5, h + 4], [w, h + 1]], { color: o.color || BLUE, w: 2.6, seed: (w | 0) + 3 });
  }, 8);
  Ink.circle = (el, o = {}) => overlay(el, 'ink-circ', (x, w, h) => {
    Ink.stroke(x, ellipse(w / 2, h / 2, w / 2 + 8, h / 2 + 6), { color: o.color || RED, w: 2.6, seed: (w | 0) + 9 });
  }, 16);
  Ink.tick = (ctx, x, y, s = 1, rgb = GREEN) => Ink.stroke(ctx, [[x, y], [x + 8 * s, y + 10 * s], [x + 26 * s, y - 14 * s]], { color: rgb, w: 3.4 });
  Ink.cross = (ctx, x, y, s = 1, rgb = RED) => { Ink.stroke(ctx, [[x - 10 * s, y - 10 * s], [x + 10 * s, y + 10 * s]], { color: rgb, w: 3.4 }); Ink.stroke(ctx, [[x + 10 * s, y - 10 * s], [x - 10 * s, y + 10 * s]], { color: rgb, w: 3.4 }); };

  // ---------- the pen ----------
  Ink.pen = (ctx, tx, ty, rgb = BLUE) => {
    const ang = 0.85, len = 240;
    ctx.save(); ctx.globalCompositeOperation = 'source-over';
    ctx.save(); ctx.filter = 'blur(5px)'; ctx.fillStyle = 'rgba(40,40,60,0.22)'; ctx.translate(tx + 16, ty + 20); ctx.rotate(ang + 0.04); ctx.beginPath(); ctx.roundRect(20, -7, len, 14, 6); ctx.fill(); ctx.restore();
    ctx.translate(tx, ty); ctx.rotate(ang);
    ctx.fillStyle = '#b8b8b0'; ctx.beginPath(); ctx.arc(0.5, 0, 1.4, 0, 7); ctx.fill();
    const cg = ctx.createLinearGradient(0, -6, 0, 6); cg.addColorStop(0, '#ffffff'); cg.addColorStop(1, '#c9c9c2');
    ctx.fillStyle = cg; ctx.beginPath(); ctx.moveTo(1.5, -1.5); ctx.lineTo(24, -6); ctx.lineTo(24, 6); ctx.lineTo(1.5, 1.5); ctx.closePath(); ctx.fill();
    const bg = ctx.createLinearGradient(0, -8, 0, 8); bg.addColorStop(0, 'rgba(250,252,255,0.95)'); bg.addColorStop(0.5, 'rgba(215,222,232,0.92)'); bg.addColorStop(1, 'rgba(160,170,185,0.95)');
    ctx.fillStyle = bg; ctx.fillRect(24, -7.5, len - 46, 15);
    ctx.fillStyle = rgba(rgb, 0.85); ctx.fillRect(28, -1.7, len - 64, 3.4);
    ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.fillRect(28, -5.6, len - 56, 1.4);
    ctx.fillStyle = rgba(H.mix(rgb, '#ffffff', 0.1), 1); ctx.beginPath(); ctx.roundRect(len - 24, -6.5, 24, 13, 4); ctx.fill();
    ctx.restore();
  };

  // ---------- animated scenes ----------
  Ink.anim = function (canvas, spec) {
    const W = canvas.width, Hh = canvas.height, dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = W * dpr; canvas.height = Hh * dpr; canvas.classList.add('ink-anim');
    if (!canvas.style.width) canvas.style.width = '100%';
    canvas.style.aspectRatio = W + ' / ' + Hh;
    const ctx = canvas.getContext('2d');
    const D = spec.duration || 10;
    let t = spec.start ?? 0, playing = false, last = 0, raf = 0, stopSound = null;
    // play control
    const wrap = document.createElement('div'); wrap.className = 'ink-anim-wrap';
    canvas.parentNode.insertBefore(wrap, canvas); wrap.appendChild(canvas);
    const btn = document.createElement('button'); btn.className = 'ink-play'; btn.type = 'button'; wrap.appendChild(btn);
    let started = false;
    const setBtn = () => { btn.textContent = playing ? '❚❚ pause' : !started ? '▶ watch it drawn' : t >= D - 0.01 ? '↻ replay' : '▶ play'; };
    function frame(tt) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, Hh);
      ctx.globalCompositeOperation = 'multiply'; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      let tip = null, tipColor = BLUE;
      const k = {
        t: tt, W, H: Hh, ctx, win: (a, b) => win(tt, a, b), rect, ellipse, curve, head,
        line(pts, a, b, o = {}) {
          const p = win(tt, a, b); if (p <= 0) return;
          const e = Ink.stroke(ctx, pts, Object.assign({}, o, { p }));
          if (p < 1) { tip = e; tipColor = o.color || BLUE; }
        },
        arrow(pts, a, b, o = {}) { const m = a + (b - a) * 0.85; k.line(pts, a, m, o); k.line(head(pts, o.head || 16), m, b, o); },
        box(x, y, w, h, a, b, o = {}) { const P = rect(x, y, w, h, o.radius ?? 8); if (o.shadow !== false) Ink.hatchShadow(ctx, P, win(tt, b, b + 0.35), 7, 7, o.color || BLUE); k.line(P, a, b, o); return P; },
        circle(cx, cy, r, a, b, o = {}) { k.line(ellipse(cx, cy, r, o.ry || r), a, b, o); },
        dot(x, y, r, a, o = {}) { if (tt < a) return; ctx.fillStyle = rgba(o.color || BLUE, 0.9); ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); },
        hatch(pts, a, b, o = {}) { Ink.hatchFill(ctx, pts, win(tt, a, b), o.color || BLUE, o.density || 1); },
        shadow(pts, a, b, o = {}) { Ink.hatchShadow(ctx, pts, win(tt, a, b), 7, 7, o.color || BLUE); },
        text(s, x, y, a, b, o = {}) {
          const p = win(tt, a, b); if (p <= 0) return;
          const rgb = o.color || BLUE, size = o.size || 28;
          if (o.font === 'bubble') { const r = Ink.drawBubble(ctx, s, x, y, size, rgb, p, o.rot || 0, o.align || 'left'); if (p < 1) { tip = r.tip; tipColor = rgb; } return; }
          ctx.save(); ctx.font = `400 ${size}px "Gloria Hallelujah", "Comic Sans MS", cursive`; ctx.fillStyle = rgba(rgb, 0.92);
          const full = ctx.measureText(s).width, part = s.slice(0, Math.ceil(s.length * p));
          const x0 = o.align === 'center' ? x - full / 2 : o.align === 'right' ? x - full : x;
          ctx.translate(x0, y); ctx.rotate(o.rot || 0); ctx.fillText(part, 0, 0);
          if (p < 1) { tip = [x0 + ctx.measureText(part).width, y - size * 0.3]; tipColor = rgb; }
          ctx.restore();
        },
      };
      spec.draw(k, tt);
      if (tip && spec.pen !== false && playing) Ink.pen(ctx, tip[0], tip[1], tipColor);
    }
    function tickFn(now) {
      if (!playing) return;
      t = Math.min(D, t + (now - last) / 1000); last = now; frame(t);
      if (t >= D) {
        if (spec.loop) { t = 0; restartSound(); }
        else { playing = false; stopSnd(); setBtn(); spec.onEnd && spec.onEnd(); return; }
      }
      raf = requestAnimationFrame(tickFn);
    }
    function stopSnd() { if (stopSound) { stopSound(); stopSound = null; } }
    function restartSound() { stopSnd(); if (spec.sound && window.SOUND && !Ink.muted) try { stopSound = SOUND.live(spec.sound, t, {}); } catch (e) {} }
    const api = {
      play() { if (t >= D - 0.01 || !started) t = 0; started = true; playing = true; last = performance.now(); restartSound(); setBtn(); raf = requestAnimationFrame(tickFn); spec.onPlay && spec.onPlay(); },
      stop() { playing = false; cancelAnimationFrame(raf); stopSnd(); setBtn(); },
      seek(tt) { t = clamp(tt, 0, D); frame(t); setBtn(); },
      get t() { return t; }, duration: D,
    };
    btn.onclick = () => (playing ? api.stop() : api.play());
    canvas.addEventListener('click', () => (playing ? api.stop() : api.play()));
    if (spec.poster != null && spec.start == null) t = spec.poster; else if (spec.start == null) t = D;
    const first = () => { frame(t); setBtn(); };
    first(); if (document.fonts) document.fonts.ready.then(() => { if (!playing) frame(t); });
    // pause when the page is turned away
    canvas._inkAnim = api;
    if (spec.autoplay) setTimeout(() => api.play(), 300);
    return api;
  };
  Ink.stopAll = (root) => (root || document).querySelectorAll('canvas.ink-anim').forEach((c) => c._inkAnim && c._inkAnim.stop());
})();
