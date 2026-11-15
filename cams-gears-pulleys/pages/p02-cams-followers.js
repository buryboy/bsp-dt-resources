// Page 2 — Cams & followers. A working pear cam in an automaton box (drag it round), the motion conversion, a live
// follower-height graph (rise, fall, dwell, stroke), label-the-graph, and the three follower types working side by side.
(function () {
  'use strict';
  const B = Ink.BLUE, RD = Ink.RED, GR = Ink.GREEN, rgba = Ink.rgba, geo = Ink.geo;
  const HANDF = (s) => `400 ${s}px "Gloria Hallelujah", "Comic Sans MS", cursive`;
  const LABF = (s) => `600 ${s}px Fredoka, "Arial Rounded MT Bold", system-ui, sans-serif`;
  const TAU = Math.PI * 2;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const frac = (v) => v - Math.floor(v);
  const ease = (u) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2);
  const close = (P) => P.concat([P[0]]);

  function text(x, s, px, py, o = {}) {
    x.save(); x.font = (o.font === 'hand' ? HANDF : LABF)(o.size || 22);
    x.fillStyle = rgba(o.color || B, o.a ?? 0.92); x.textAlign = o.align || 'left'; x.textBaseline = 'alphabetic';
    x.translate(px, py); if (o.rot) x.rotate(o.rot); x.fillText(s, 0, 0); x.restore();
  }
  // a light pen line (cheap, no retrace)
  function pen(x, pts, o = {}) {
    const P = o.wob === false ? pts : geo.wob(geo.seg(pts, 3), o.seed ?? 11, o.amp ?? 0.6);
    x.save(); x.strokeStyle = rgba(o.color || B, o.a ?? 0.85); x.lineWidth = o.w ?? 1.6; x.lineCap = 'round'; x.lineJoin = 'round';
    if (o.dash) x.setLineDash(o.dash);
    x.beginPath(); P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); if (o.close) x.closePath(); x.stroke(); x.restore();
  }
  function dot(x, px, py, r, color = B, a = 0.9) { x.fillStyle = rgba(color, a); x.beginPath(); x.arc(px, py, r, 0, 7); x.fill(); }

  // an interactive canvas with an on-demand render loop (stops when the page is hidden)
  function Stage(parent, W, Hh) {
    const c = document.createElement('canvas'); c.className = 'cg-stage'; parent.appendChild(c);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = Math.round(W * dpr); c.height = Math.round(Hh * dpr);
    Object.assign(c.style, { width: '100%', height: 'auto', aspectRatio: W + ' / ' + Hh, display: 'block', touchAction: 'pan-y', userSelect: 'none', webkitUserSelect: 'none', webkitTouchCallout: 'none', cursor: 'pointer' });
    const ctx = c.getContext('2d');
    const S = { c, ctx, W, H: Hh, render: () => false };
    S.pos = (e) => { const r = c.getBoundingClientRect(); return [((e.clientX - r.left) * W) / r.width, ((e.clientY - r.top) * Hh) / r.height]; };
    S.layer = (w, h, paint) => { const L = document.createElement('canvas'); L.width = Math.ceil(w * dpr); L.height = Math.ceil(h * dpr); const x = L.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.lineCap = 'round'; x.lineJoin = 'round'; paint(x); L.w = w; L.h = h; return L; };
    S.blit = (L, px, py) => ctx.drawImage(L, px, py, L.w, L.h);
    S.rot = (L, cx, cy, ang, ox = L.w / 2, oy = L.h / 2) => { ctx.save(); ctx.translate(cx, cy); ctx.rotate(ang); ctx.drawImage(L, -ox, -oy, L.w, L.h); ctx.restore(); };
    const hidden = () => { const p = c.closest('.page'); return !p || p.classList.contains('hidden'); };
    let raf = 0, wait = 0, last = 0;
    const tick = (now) => {
      raf = 0;
      if (hidden()) { last = 0; if (!wait) wait = setTimeout(() => { wait = 0; S.go(); }, 400); return; }
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60; last = now;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.globalCompositeOperation = 'source-over'; ctx.clearRect(0, 0, W, Hh);
      ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = 1; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      if (S.render(dt, now / 1000)) raf = requestAnimationFrame(tick); else last = 0;
    };
    S.go = () => { if (!raf) raf = requestAnimationFrame(tick); };
    // drag inside a hit zone: that touch no longer scrolls the page; everywhere else a vertical swipe still scrolls
    S.drag = (hit, on) => {
      let id = null;
      c.addEventListener('touchstart', (e) => { if (hit(S.pos(e.changedTouches[0]))) e.preventDefault(); }, { passive: false });
      c.addEventListener('pointerdown', (e) => { const p = S.pos(e); if (id !== null || !hit(p)) return; id = e.pointerId; try { c.setPointerCapture(id); } catch (er) {} on.start && on.start(p); S.go(); });
      c.addEventListener('pointermove', (e) => { if (e.pointerId !== id) return; on.move && on.move(S.pos(e)); S.go(); });
      ['pointerup', 'pointercancel'].forEach((ev) => c.addEventListener(ev, (e) => { if (e.pointerId !== id) return; id = null; on.end && on.end(); S.go(); }));
      S.dragging = () => id !== null;
    };
    S.dragging = () => false;
    if (document.fonts) document.fonts.ready.then(() => { S.onFonts && S.onFonts(); S.go(); });
    return S;
  }

  // ======================================================================================
  // cam engine. A cam is a radius function P(u): the distance from the shaft to the edge at "phase" u (0..1 of a
  // turn). With the cam turned through angle a, the edge point of phase u sits at angle -90° - 360°u + a, so the
  // point directly above the shaft has phase a/360°. Follower positions are worked out from the real outline.
  // ======================================================================================
  const NP = 720;
  function makeCam(P, o = {}) {
    const cam = Object.assign({ P, lo: 1e9, hi: -1e9, r: new Float32Array(NP), th: new Float32Array(NP) }, o);
    for (let i = 0; i < NP; i++) { const r = P(i / NP); cam.r[i] = r; cam.th[i] = -Math.PI / 2 - (TAU * i) / NP; cam.lo = Math.min(cam.lo, r); cam.hi = Math.max(cam.hi, r); }
    cam.outline = (s = 1, step = 6) => { const o2 = []; for (let i = 0; i < NP; i += step) o2.push([cam.r[i] * s * Math.cos(cam.th[i]), cam.r[i] * s * Math.sin(cam.th[i])]); if (cam.step) o2.push([cam.r[NP - 1] * s * Math.cos(cam.th[NP - 1]), cam.r[NP - 1] * s * Math.sin(cam.th[NP - 1])]); return o2; };
    return cam;
  }
  const ECC = makeCam((u) => { const R = 62, e = 24, c = Math.cos(TAU * u), s = Math.sin(TAU * u); return -e * c + Math.sqrt(R * R - e * e * s * s); }, { mark: 0.5, centre: 24 });
  const PEAR = makeCam((u) => {
    // base circle + smaller nose circle joined by straight flanks (a real pear cam)
    const Rb = 46, d = 60, al = (78 * Math.PI) / 180, rn = Rb - d * Math.cos(al), un = 1 - al / TAU;
    let ps = Math.abs(TAU * (u - un)); if (ps > Math.PI) ps = TAU - ps;
    if (ps >= al) return Rb;
    const pt = Math.atan2(rn * Math.sin(al), d + rn * Math.cos(al));
    if (ps <= pt) return d * Math.cos(ps) + Math.sqrt(rn * rn - d * d * Math.sin(ps) * Math.sin(ps));
    return Rb / Math.cos(al - ps);
  }, { mark: 1 - 78 / 360 });
  const SNAIL = makeCam((u) => 40 + 48 * u, { step: true, mark: 0.6 });
  // height of the follower above the shaft: knife = the tip; flat = underside of the foot (half-width par);
  // roller = centre of the roller (radius par). s scales the cam.
  function lift(cam, a, type, par, s = 1) {
    if (type === 'knife') return cam.P(frac(a / TAU)) * s;
    let m = -1e9;
    for (let i = 0; i < NP; i++) {
      const r = cam.r[i] * s, an = cam.th[i] + a, px = r * Math.cos(an);
      if (px > par || px < -par) continue;
      const py = -r * Math.sin(an);
      if (type === 'flat') { if (py > m) m = py; } else { const q = py + Math.sqrt(par * par - px * px); if (q > m) m = q; }
    }
    return m;
  }
  // cam sprite (hatched, with the shaft and a red grip mark), centred in a square of side 2*half
  function camSprite(S, cam, s = 1, half = 0) {
    half = half || Math.ceil(cam.hi * s + 12);
    return S.layer(half * 2, half * 2, (x) => {
      x.translate(half, half);
      const O = cam.outline(s);
      Ink.hatchFill(x, O, 1, B, 0.75);
      Ink.stroke(x, close(O), { w: 2.6, seed: 7, amp: 0.35 });
      // shaft with a key
      x.save(); x.globalCompositeOperation = 'destination-out'; x.beginPath(); x.arc(0, 0, 11 * s, 0, 7); x.fill(); x.restore();
      Ink.stroke(x, geo.ellipse(0, 0, 11 * s, 11 * s), { w: 2.2, seed: 9, amp: 0.3 });
      pen(x, [[-4 * s, -11 * s], [-4 * s, -16 * s], [4 * s, -16 * s], [4 * s, -11 * s]], { w: 1.6, wob: false });
      dot(x, 0, 0, 2.4 * s);
      if (cam.centre) { const an = cam.th[Math.round(0.5 * NP)]; pen(x, [[cam.centre * s * Math.cos(an) - 5, cam.centre * s * Math.sin(an)], [cam.centre * s * Math.cos(an) + 5, cam.centre * s * Math.sin(an)]], { w: 1.4, wob: false, a: 0.7 }); pen(x, [[cam.centre * s * Math.cos(an), cam.centre * s * Math.sin(an) - 5], [cam.centre * s * Math.cos(an), cam.centre * s * Math.sin(an) + 5]], { w: 1.4, wob: false, a: 0.7 }); }
      const i = Math.round(cam.mark * NP) % NP, rr = cam.r[i] * s - 13 * s;
      x.save(); x.globalCompositeOperation = 'destination-out'; x.beginPath(); x.arc(rr * Math.cos(cam.th[i]), rr * Math.sin(cam.th[i]), 7 * s, 0, 7); x.fill(); x.restore();
      dot(x, rr * Math.cos(cam.th[i]), rr * Math.sin(cam.th[i]), 5 * s, RD, 0.85);
    });
  }
  // follower rod standing on the cam. yTip = y of the contact point (knife / flat) or of the roller centre.
  function drawFollower(x, cx, yTip, type, len, o = {}) {
    const hw = o.hw || 8, top = yTip - len, par = o.par || 0;
    let yRod = yTip;
    if (type === 'knife') { yRod = yTip - 20; Ink.stroke(x, [[cx - hw, yRod], [cx, yTip], [cx + hw, yRod]], { w: 2.4, seed: 21, amp: 0.25, retrace: false }); }
    else if (type === 'flat') { yRod = yTip - 9; const F = [[cx - par, yRod], [cx + par, yRod], [cx + par, yTip], [cx - par, yTip]]; Ink.hatchFill(x, F, 1, B, 2); Ink.stroke(x, close(F), { w: 2.2, seed: 22, amp: 0.25, retrace: false }); }
    else { yRod = yTip - par - 12; Ink.stroke(x, geo.ellipse(cx, yTip, par, par), { w: 2.4, seed: 23, amp: 0.25, retrace: false }); dot(x, cx, yTip, 3);
      pen(x, [[cx - hw, yRod], [cx - hw - 3, yTip + 2]], { w: 2.2, wob: false }); pen(x, [[cx + hw, yRod], [cx + hw + 3, yTip + 2]], { w: 2.2, wob: false }); pen(x, [[cx - hw, yRod], [cx + hw, yRod]], { w: 2, wob: false }); }
    Ink.stroke(x, [[cx - hw, yRod], [cx - hw, top]], { w: 2.4, seed: 24, amp: 0.3, retrace: false });
    Ink.stroke(x, [[cx + hw, yRod], [cx + hw, top]], { w: 2.4, seed: 25, amp: 0.3, retrace: false });
    pen(x, [[cx - hw, top], [cx + hw, top]], { w: 2.2, wob: false });
    return top;
  }
  // the guide: two hatched blocks either side of the rod
  function paintGuide(x, cx, y0, y1, hw = 8, bw = 26) {
    [-1, 1].forEach((sg) => { const xa = cx + sg * (hw + 3), xb = cx + sg * (hw + 3 + bw); const G = [[Math.min(xa, xb), y0], [Math.max(xa, xb), y0], [Math.max(xa, xb), y1], [Math.min(xa, xb), y1]]; Ink.hatchFill(x, G, 1, B, 1.8); Ink.stroke(x, close(G), { w: 2.2, seed: 31 + sg, amp: 0.3 }); });
  }
  // which parts of the turn have been seen (for the live graph)
  function Trace(n = 120) {
    const v = new Uint8Array(n); let count = 0;
    const T = { v, n, mark(a0, a1) { const k = Math.max(1, Math.ceil((Math.abs(a1 - a0) / TAU) * n * 2)); for (let i = 0; i <= k; i++) { const j = Math.floor(frac((a0 + ((a1 - a0) * i) / k) / TAU) * n) % n; if (!v[j]) { v[j] = 1; count++; } } },
      full: () => count >= n - 1, fill() { v.fill(1); count = n; }, frac: () => count / n };
    return T;
  }
  // height-against-angle graph. G = {x, y, w, h}; the curve is drawn only where the trace has been.
  function paintAxes(x, G, o = {}) {
    Ink.stroke(x, [[G.x, G.y - 14], [G.x, G.y + G.h + 8], [G.x + G.w + 16, G.y + G.h + 8]], { w: 2.4, seed: 41, amp: 0.5 });
    pen(x, [[G.x - 7, G.y - 4], [G.x, G.y - 16], [G.x + 7, G.y - 4]], { w: 2, wob: false });
    pen(x, [[G.x + G.w + 6, G.y + G.h + 1], [G.x + G.w + 18, G.y + G.h + 8], [G.x + G.w + 6, G.y + G.h + 15]], { w: 2, wob: false });
    for (let k = 0; k <= 4; k++) { const tx = G.x + (G.w * k) / 4; pen(x, [[tx, G.y + G.h + 2], [tx, G.y + G.h + 15]], { w: 1.6, wob: false }); if (k) pen(x, [[tx, G.y], [tx, G.y + G.h]], { w: 1, wob: false, a: 0.22, dash: [4, 7] }); text(x, k * 90 + '°', tx, G.y + G.h + 40, { size: o.size || 22, align: 'center' }); }
    if (o.xl !== false) text(x, 'angle the cam has turned', G.x + G.w / 2, G.y + G.h + 70, { size: o.size || 22, align: 'center', font: 'hand' });
    text(x, 'follower height', G.x - 16, G.y + G.h / 2, { size: o.size || 22, align: 'center', rot: -Math.PI / 2, font: 'hand' });
  }
  function drawCurve(x, G, cam, tr, o = {}) {
    const Y = (r) => G.y + G.h - ((r - cam.lo) / (cam.hi - cam.lo)) * G.h, X = (u) => G.x + u * G.w;
    x.save(); x.lineCap = 'round'; x.lineJoin = 'round';
    [[3.2, 0.8, 0], [1.4, 0.5, 0.9]].forEach(([w, al, off]) => {
      x.strokeStyle = rgba(o.color || RD, al); x.lineWidth = w; x.beginPath(); let on = false;
      for (let i = 0; i < tr.n; i++) {
        if (!tr.v[i]) { on = false; continue; }
        for (let j = 0; j <= 4; j++) { const u = Math.min(0.99999, (i + j / 4) / tr.n), px = X(u) + off, py = Y(cam.P(u)) - off; if (on) x.lineTo(px, py); else { x.moveTo(px, py); on = true; } }
      }
      if (cam.step && tr.v[tr.n - 1]) x.lineTo(X(1) + off, Y(cam.P(0)));
      x.stroke();
    });
    x.restore();
    if (o.u != null) { const px = X(o.u), py = Y(o.r != null ? o.r : cam.P(o.u)); pen(x, [[px, G.y + G.h + 6], [px, py]], { w: 1.2, wob: false, a: 0.45, dash: [3, 6] }); dot(x, px, py, 7, RD, 0.9); dot(x, px, py, 2.5, [255, 255, 255], 1); }
  }
  // drag a cam round: returns handlers for S.drag
  function spinner(cx, cy, get, set) {
    let pa = 0;
    return { start: (p) => { pa = Math.atan2(p[1] - cy(), p[0] - cx()); }, move: (p) => { const an = Math.atan2(p[1] - cy(), p[0] - cx()); let d = an - pa; if (d > Math.PI) d -= TAU; if (d < -Math.PI) d += TAU; pa = an; set(get() + d, d); } };
  }

  if (!document.getElementById('cg-css')) {
    const s = document.createElement('style'); s.id = 'cg-css';
    s.textContent = `
      .cg-lab { position: relative; margin: 0 0 calc(var(--R) * 1.2); padding: 12px 16px 16px; background: rgba(251,250,245,.9); }
      .cg-lab > * { position: relative; }
      .cg-step { font: 700 14px Fredoka, system-ui; letter-spacing: .08em; text-transform: uppercase; color: var(--red); line-height: 24px; margin-top: 4px; }
      .cg-task { font-size: 19px; line-height: 1.5; margin: 0 0 8px; }
      .cg-task b { font-family: Fredoka, system-ui; font-weight: 600; }
      .cg-row { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin: 6px 0 8px; }
      .cg-row .opt { flex: 1 1 120px; text-align: center; min-height: 52px; }
      .cg-row .btn { margin-top: 0; min-height: 52px; }
      .cg-row .opt.tiny { flex: 0 0 auto; min-width: 84px; font: 600 17px Fredoka, system-ui; }
      .cg-locked { opacity: .35; pointer-events: none; }
      .cg-msg { font-size: 17px; line-height: 1.45; margin: 4px 0; }
      .cg-hide { display: none !important; }
    `;
    document.head.appendChild(s);
  }

  // the automaton figure: 130 x 120, stands at (65, 118). Arms are drawn live.
  function paintFigure(x) {
    const body = [[46, 82], [84, 82], [92, 118], [38, 118]];
    Ink.hatchFill(x, body, 1, B, 1.1); Ink.stroke(x, close(body), { w: 2.2, seed: 3, amp: 0.4 });
    pen(x, [[56, 84], [65, 94], [74, 84]], { w: 1.6 });
    [98, 108].forEach((yy) => dot(x, 65, yy, 2.2, B, 0.9));
    Ink.stroke(x, geo.ellipse(65, 58, 23, 24), { w: 2.3, seed: 4, amp: 0.4 });
    const hat = [[46, 42], [66, 4], [86, 44]];
    Ink.hatchFill(x, hat, 1, RD, 2); Ink.stroke(x, close(hat), { w: 2, color: RD, seed: 5, amp: 0.4 });
    dot(x, 66, 5, 5, RD, 0.85);
    dot(x, 57, 56, 2.6); dot(x, 74, 56, 2.6);
    pen(x, geo.curve([54, 66], [60, 75], [72, 75], [77, 65], 10), { w: 2 });
    dot(x, 51, 64, 3.2, RD, 0.35); dot(x, 80, 63, 3.2, RD, 0.35);
  }
  function drawArms(x, bx, by, up) { // bx,by = the figure's feet; up 0..1
    const an = -0.9 + up * 2.0;
    [-1, 1].forEach((sg) => { const sx = bx + sg * 19, sy = by - 32, hx = sx + sg * 30 * Math.cos(an), hy = sy - 30 * Math.sin(an);
      Ink.stroke(x, [[sx, sy], [hx, hy]], { w: 2.4, seed: 51 + sg, amp: 0.3, retrace: false }); Ink.stroke(x, geo.ellipse(hx, hy, 5, 5), { w: 1.8, seed: 55 + sg, amp: 0.2, retrace: false }); });
  }

  // the "mystery" graph for the labelling activity: rise, dwell at the top, fall, dwell at the bottom
  const MYST = makeCam((u) => (u < 0.25 ? 40 + 44 * ease(u / 0.25) : u < 0.5 ? 84 : u < 0.75 ? 84 - 44 * ease((u - 0.5) / 0.25) : 40));

  Book.page({
    id: 'p02',
    title: 'Cams & followers',
    build(ui, root) {
      const got = (id) => Book.state.items[id];
      ui.h('Cams & followers');
      ui.p('Open up a mechanical toy (an <b>automaton</b>) and you will find an odd-shaped wheel on the handle. It is a <span class="key">cam</span>, and it makes the figure on top move.');
      ui.box('A <b>cam</b> is a specially shaped piece fixed to a rotating <b>shaft</b>.<br>A <b>follower</b> rests on the edge of the cam.<br>A <b>guide</b> (slide) holds the follower so it can only move up and down.', { tag: 'Notes' });

      // ------------------------------------------------------------------ 1: the automaton
      ui.p('<b>Drag the cam round</b> with your finger (the red dot is a handy grip). Watch the follower and the little figure.');
      let a = 0.3, turned = 0, auto = false;
      const tr = Trace(120);
      const W = 860, H1 = 500, C1 = [330, 388], ROD1 = 150;
      const st1 = ui.el('div', ''); st1.style.margin = '0 0 8px';
      const S1 = Stage(st1, W, H1);
      let camL, figL, stat1;
      function art1() {
        camL = camSprite(S1, PEAR); figL = S1.layer(130, 120, paintFigure);
        stat1 = S1.layer(W, H1, (x) => {
          // the automaton's box, with a hole in the lid for the guide
          const bx0 = 170, bx1 = 490, by0 = 212, by1 = 488, cx = C1[0];
          Ink.stroke(x, [[cx - 38, by0], [bx0, by0], [bx0, by1], [bx1, by1], [bx1, by0], [cx + 38, by0]], { w: 2.8, seed: 61, amp: 0.7 });
          Ink.hatchShadow(x, [[bx0, by0], [bx1, by0], [bx1, by1], [bx0, by1]], 1, 8, 8);
          paintGuide(x, cx, by0 - 6, by0 + 34);
          // the shaft's bearing line and a handle on the side
          pen(x, [[bx1, C1[1] - 5], [bx1 + 34, C1[1] - 5], [bx1 + 34, C1[1] + 42], [bx1 + 62, C1[1] + 42]], { w: 2.4, seed: 62 });
          pen(x, [[bx1, C1[1] + 5], [bx1 + 24, C1[1] + 5], [bx1 + 24, C1[1] + 52], [bx1 + 62, C1[1] + 52]], { w: 2.4, seed: 63 });
          const kn = geo.rect(bx1 + 62, C1[1] + 34, 34, 26, 8); Ink.hatchFill(x, kn, 1, B, 1.6); Ink.stroke(x, kn, { w: 2.2, seed: 64 });
          // labels
          const lab = (s, tx, ty, px, py) => { text(x, s, tx, ty, { size: 26 }); pen(x, [[tx - 8, ty - 9], [px, py]], { w: 1.5, seed: 65, a: 0.7 }); dot(x, px, py, 3); };
          lab('guide', 600, 190, cx + 40, by0 + 14);
          lab('follower', 600, 262, cx + 9, 268);
          lab('cam', 640, 336, cx + 30, C1[1] - 22);
          lab('shaft', 640, 470, cx + 4, C1[1] + 4);
        });
      }
      art1(); S1.onFonts = art1;
      S1.render = () => {
        const x = S1.ctx, h = lift(PEAR, a, 'knife'), yTip = C1[1] - h, up = (h - PEAR.lo) / (PEAR.hi - PEAR.lo);
        S1.blit(stat1, 0, 0);
        S1.rot(camL, C1[0], C1[1], a);
        const top = drawFollower(x, C1[0], yTip, 'knife', ROD1);
        pen(x, [[C1[0] - 30, top], [C1[0] + 30, top]], { w: 2.6, wob: false });
        S1.blit(figL, C1[0] - 65, top - 118); drawArms(x, C1[0], top, up);
        if (turned < 1.5) { // "drag me" hint
          const R = 122; pen(x, geo.ellipse(C1[0], C1[1], R, R, 2.5, 3.7), { w: 2.6, color: RD, a: 0.8, seed: 71 });
          const e = [C1[0] + R * Math.cos(3.7), C1[1] + R * Math.sin(3.7)]; pen(x, [[e[0] - 14, e[1] + 6], e, [e[0] + 4, e[1] + 16]], { w: 2.6, color: RD, wob: false });
          text(x, 'drag me round!', C1[0] - 152, C1[1] + 90, { font: 'hand', size: 22, color: RD, rot: -0.05 });
        }
        return S1.dragging();
      };
      const turn = (na) => { tr.mark(a, na); turned += Math.abs(na - a); a = na; if (Math.floor(turned / 0.5) !== Math.floor((turned - 0.02) / 0.5)) Book.sfx('tick', { gain: 0.25 }); S1.go(); S2.go(); gate(); };
      S1.drag((p) => Math.hypot(p[0] - C1[0], p[1] - C1[1]) < 175, spinner(() => C1[0], () => C1[1], () => a, (na, d) => { tick(d); turn(na); }));
      let tk = 0; function tick(d) { tk += Math.abs(d); if (tk > 0.5) { tk = 0; Book.sfx('tick', { gain: 0.3 }); } }

      const lock1 = ui.p('Turn the cam at least <b>one full turn</b>, then answer.', 'small red'); lock1.style.marginTop = '-4px';
      const motion = ui.mcq({ id: 'p02.motion', label: 'Cam and follower: motion conversion', q: 'You turned the cam and watched the follower. What does a cam and follower <b>change</b>?',
        options: [
          { t: 'Rotary motion into reciprocating motion', ok: true },
          { t: 'Rotary motion into oscillating motion', mis: 'cam-motion', why: 'Oscillating means swinging in an arc, like a pendulum. The follower went straight up and down in its guide.' },
          { t: 'Reciprocating motion into rotary motion', mis: 'cam-motion', why: 'Which part did YOU turn? That is the input. The follower is the output.' },
          { t: 'Rotary motion into linear motion', mis: 'cam-motion', why: 'Linear means one way in a straight line. The follower kept coming back again.' },
        ],
        explain: 'The cam turns round and round (rotary); the follower goes up and down, backwards and forwards in a straight line (reciprocating).' });

      // ------------------------------------------------------------------ 2: rise, fall, dwell + the live graph
      ui.el('h2', '', 'Rise, fall and dwell');
      const notes2 = ui.box('<b>Rise</b>: the follower moves up. &nbsp; <b>Fall</b>: the follower moves down.<br><b>Dwell</b>: the follower stays still while the cam keeps turning.<br><b>Stroke</b> (or lift): how far the follower moves from its lowest to its highest point.<br><span class="small">One full turn of the cam = one full cycle of the follower\'s movement.</span>', { tag: 'Notes' });
      ui.p('Now the same cam plots a <b>graph</b> of how high its follower is. Turn it one full turn (drag it, or press the button) and watch the red line.');
      const H2 = 430, C2 = [165, 300], ROD2 = 120, G2 = { x: 400, y: 96, w: 372, h: 190 };
      const st2 = ui.el('div', ''); st2.style.margin = '0 0 4px';
      const S2 = Stage(st2, W, H2);
      let camL2, stat2;
      function art2() {
        camL2 = camSprite(S2, PEAR);
        stat2 = S2.layer(W, H2, (x) => { paintGuide(x, C2[0], 150, 184); pen(x, [[40, 150], [C2[0] - 38, 150]], { w: 2.2, seed: 66 }); pen(x, [[C2[0] + 38, 150], [290, 150]], { w: 2.2, seed: 67 }); paintAxes(x, G2); });
      }
      art2(); S2.onFonts = art2;
      S2.render = (dt) => {
        const x = S2.ctx;
        if (auto) { const na = a + dt * TAU * 0.22; tr.mark(a, na); turned += na - a; a = na; S1.go(); gate(); }
        const h = lift(PEAR, a, 'knife'), yTip = C2[1] - h, u = frac(a / TAU);
        S2.blit(stat2, 0, 0); S2.rot(camL2, C2[0], C2[1], a);
        const top = drawFollower(x, C2[0], yTip, 'knife', ROD2);
        pen(x, [[C2[0] - 24, top], [C2[0] + 24, top]], { w: 2.6, wob: false });
        drawCurve(x, G2, PEAR, tr, { u });
        text(x, 'cam angle: ' + Math.round(u * 360) + '°', G2.x + G2.w, 50, { size: 24, align: 'right' });
        if (tr.full()) { // the stroke, marked once the whole turn has been plotted
          const xs = G2.x + G2.w + 30; pen(x, [[xs, G2.y], [xs, G2.y + G2.h]], { w: 2, color: B, wob: false });
          pen(x, [[xs - 6, G2.y + 10], [xs, G2.y], [xs + 6, G2.y + 10]], { w: 2, wob: false }); pen(x, [[xs - 6, G2.y + G2.h - 10], [xs, G2.y + G2.h], [xs + 6, G2.y + G2.h - 10]], { w: 2, wob: false });
          text(x, 'stroke', xs + 24, G2.y + G2.h / 2, { size: 22, align: 'center', rot: Math.PI / 2, font: 'hand' });
        }
        return auto || S2.dragging();
      };
      S2.drag((p) => Math.hypot(p[0] - C2[0], p[1] - C2[1]) < 150, spinner(() => C2[0], () => C2[1], () => a, (na, d) => { tick(d); turn(na); }));
      const row2 = ui.el('div', 'cg-row');
      const autoB = ui.el('button', 'btn', '▶ turn it for me', row2); autoB.type = 'button';
      autoB.onclick = () => { auto = !auto; autoB.textContent = auto ? '❚❚ stop' : '▶ turn it for me'; S2.go(); };
      const plotMsg = ui.el('span', 'small', '', row2); plotMsg.style.flex = '1 1 220px';

      // ---- label the graph
      const labWrap = ui.el('div', 'act'); labWrap.dataset.id = 'p02.labels'; requestAnimationFrame(() => Ink.frame(labWrap, { shadow: false, w: 2.2 }));
      ui.el('div', 'q', 'Here is the graph for a <b>different</b> cam. <b>Tap a part</b> of the graph (A, B, C or D), then tap what the follower is doing there. <span class="small">The notes above will blur while you work.</span>', labWrap);
      const rL = ui.record('p02.labels', { label: 'Label the cam graph: rise / fall / dwell (4 regions)', type: 'label', max: 4 });
      const KEY = ['rise', 'dwell', 'fall', 'dwell'], LET = 'ABCD';
      const pv = rL.get() || {}; const ans = (pv.labels || [null, null, null, null]).slice(); let sel = 0, marks = pv.marks || null;
      const H3 = 330, G3 = { x: 86, y: 92, w: 720, h: 130 };
      const st3 = ui.el('div', '', null, labWrap);
      const S3 = Stage(st3, W, H3); const tr3 = Trace(120); tr3.fill();
      let stat3; function art3() { stat3 = S3.layer(W, H3, (x) => { paintAxes(x, G3, { xl: false }); drawCurve(x, G3, MYST, tr3, { color: B }); }); } art3(); S3.onFonts = art3;
      S3.render = () => {
        const x = S3.ctx; S3.blit(stat3, 0, 0);
        for (let k = 0; k < 4; k++) {
          const x0 = G3.x + (G3.w * k) / 4, xm = x0 + G3.w / 8;
          if (k === sel && !doneL()) { const R = geo.rect(x0 + 5, 14, G3.w / 4 - 10, G3.y + G3.h - 2, 12); Ink.stroke(x, R, { w: 2.4, color: RD, seed: 80 + k, amp: 0.6, retrace: false }); }
          Ink.drawBubble(x, LET[k], xm, 56, 34, B, 1, 0, 'center');
          if (ans[k]) text(x, ans[k], xm, H3 - 16, { font: 'hand', size: 26, align: 'center', color: marks ? (marks[k] ? GR : RD) : B });
          else text(x, '?', xm, H3 - 16, { font: 'hand', size: 26, align: 'center', a: 0.4 });
          if (marks) (marks[k] ? Ink.tick(x, xm + 52, H3 - 22, 0.8) : Ink.cross(x, xm + 60, H3 - 26, 0.7));
        }
        return false;
      };
      const doneL = () => { const it = rL.get(); return !!(it && (it.correct === true)); };
      const lockL = (on) => notes2.classList.toggle('peek-lock', on);
      const started = () => { const it = rL.get(); if (!(it && (it.correct === true || it.attempts >= 3))) lockL(true); };
      S3.c.addEventListener('pointerdown', (e) => { if (doneL()) return; const p = S3.pos(e); const k = clamp(Math.floor(((p[0] - G3.x) / G3.w) * 4), 0, 3); sel = k; started(); Book.sfx('tick', { gain: 0.4 }); S3.go(); });
      const rowL = ui.el('div', 'cg-row', null, labWrap);
      const lb = ['rise', 'fall', 'dwell'].map((t) => { const b = ui.el('button', 'opt', t, rowL); b.type = 'button';
        b.onclick = () => { if (doneL()) return; started(); ans[sel] = t; marks = null; Book.scribble(0.12); const nx = [1, 2, 3, 4].map((d) => (sel + d) % 4).find((k) => !ans[k]); if (nx != null) sel = nx; chk.disabled = ans.some((v) => !v); S3.go(); }; return b; });
      const chk = ui.el('button', 'btn', 'Check', labWrap); chk.type = 'button'; chk.disabled = ans.some((v) => !v);
      const fbL = ui.el('div', 'fb', '', labWrap);
      const showL = () => {
        const it = rL.get(); if (!it || !marks) return; const ok = it.correct === true;
        fbL.className = 'fb on ' + (ok ? 'good' : 'bad');
        fbL.innerHTML = ok ? '✓ Line going up = rise, line going down = fall, flat line = dwell. A dwell can be at the top <b>or</b> the bottom: the cam is still turning, but the follower is not moving.'
          : `✗ ${it.score}/4. ` + (it.attempts >= 3 ? 'Answers: A rise, B dwell, C fall, D dwell. A dwell is any flat part: the follower stays still while the cam keeps turning.' : 'Read the graph from left to right. Is the follower getting higher, getting lower, or staying at the same height? Change the red ones and check again.');
        if (ok) { lb.forEach((b) => (b.disabled = true)); chk.disabled = true; }
        if (ok || it.attempts >= 3) lockL(false);
      };
      chk.onclick = () => {
        marks = ans.map((v, k) => v === KEY[k]); const score = marks.filter(Boolean).length, ok = score === 4;
        const dwellWrong = ans.some((v, k) => (v === 'dwell') !== (KEY[k] === 'dwell'));
        Book.sfx(ok ? 'success' : 'error', { gain: 0.35 });
        rL.set({ answer: ans.map((v, k) => `${LET[k]}=${v}${marks[k] ? ' ✓' : ' ✗'}`).join(', '), correct: ok, score, max: 4, mis: dwellWrong ? 'dwell-meaning' : '', labels: ans.slice(), marks: marks.slice() });
        showL(); S3.go();
      };
      showL(); S3.go();

      // ------------------------------------------------------------------ 3: follower types
      ui.el('h2', '', 'Three types of follower');
      ui.p('The same cam, three different followers. <b>Drag any cam round</b> (or press play) and look closely at where each follower touches.');
      const H4 = 345, FX = [150, 430, 710], FY = 232, SC = 0.8, TYPES = [['flat', 36], ['knife', 0], ['roller', 14]];
      const st4 = ui.el('div', ''); st4.style.margin = '0 0 4px';
      const S4 = Stage(st4, W, H4);
      let camL4, stat4, a4 = 0.6, auto4 = false, near = 0;
      function art4() {
        camL4 = camSprite(S4, PEAR, SC);
        stat4 = S4.layer(W, H4, (x) => FX.forEach((fx, k) => { paintGuide(x, fx, 72, 102, 7, 22); pen(x, [[fx - 90, 72], [fx - 32, 72]], { w: 2, seed: 68 + k }); pen(x, [[fx + 32, 72], [fx + 90, 72]], { w: 2, seed: 72 + k }); text(x, TYPES[k][0] + ' follower', fx, H4 - 12, { size: 24, align: 'center' }); }));
      }
      art4(); S4.onFonts = art4;
      S4.render = (dt) => {
        const x = S4.ctx; if (auto4) a4 += dt * TAU * 0.25;
        S4.blit(stat4, 0, 0);
        FX.forEach((fx, k) => { const [ty, par] = TYPES[k]; const h = lift(PEAR, a4, ty, par, SC); S4.rot(camL4, fx, FY, a4);
          const top = drawFollower(x, fx, FY - h, ty, 132, { hw: 7, par });
          pen(x, [[fx - 22, top], [fx + 22, top]], { w: 2.6, wob: false }); });
        return auto4 || S4.dragging();
      };
      S4.drag((p) => p[1] > 110 && p[1] < H4 - 36, { start: (p) => { near = FX.reduce((b, fx, k) => (Math.abs(p[0] - fx) < Math.abs(p[0] - FX[b]) ? k : b), 0); sp4.start(p); }, move: (p) => sp4.move(p) });
      const sp4 = spinner(() => FX[near], () => FY, () => a4, (na, d) => { a4 = na; tick(d); });
      const row4 = ui.el('div', 'cg-row');
      const autoB4 = ui.el('button', 'btn', '▶ play', row4); autoB4.type = 'button';
      autoB4.onclick = () => { auto4 = !auto4; autoB4.textContent = auto4 ? '❚❚ pause' : '▶ play'; S4.go(); };
      const notes3 = ui.box('<b>Flat follower</b>: a flat bottom. Copes with side load, but has more friction, and it cannot follow dips in a cam.<br><b>Knife (point) follower</b>: pointed. Follows the cam shape most accurately, but wears quickly.<br><b>Roller follower</b>: has a small wheel. Least friction and wear, so it runs smoothly at speed, but it is more expensive and complex.', { tag: 'Notes' });
      ui.p('<span class="small">Read the notes, then match. They will blur while you work.</span>');
      const match = ui.match({ id: 'p02.followers', label: 'Match the follower to its key property', q: 'Tap a follower, then tap its <b>key property</b>.',
        pairs: [
          ['Flat follower', 'Copes with side load, but has more friction', 'follower-type'],
          ['Knife follower', 'Most accurate, but its tip wears quickly', 'follower-type'],
          ['Roller follower', 'Least friction and wear, but costs more', 'follower-type'],
        ] });
      ui.hideWhile(match, 'p02.followers', [notes3]);
      ui.tf({ id: 'p02.reverse', label: 'T/F: the follower can drive the cam', statement: 'If you push the follower up and down, it will make the cam turn round.', answer: false, mis: 'cam-motion',
        explain: 'A cam and follower only works one way: the turning cam moves the follower. The follower cannot drive the cam.' });

      // ------------------------------------------------------------------ gating
      function gate() {
        const ok = turned >= TAU || !!got('p02.motion');
        motion.classList.toggle('cg-locked', !ok); lock1.style.display = ok ? 'none' : '';
        plotMsg.innerHTML = tr.full() ? 'Whole turn plotted ✓ Can you spot where this follower rises, falls and dwells?' : `Plotted: <b>${Math.round(tr.frac() * 100)}%</b> of one turn`;
      }
      gate(); S1.go(); S2.go(); S4.go();
    },
  });
})();
