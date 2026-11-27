// Page 3 — The cam shape lab. Three benches (eccentric, pear, snail): predict the graph, spin the cam, watch the
// follower-height graph being drawn, describe the movement; then pick the right cam for five design needs.
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


  // a small smiley that rides on top of each follower: 60 x 50, sits at (30, 48)
  function paintRider(x) {
    Ink.stroke(x, geo.ellipse(30, 27, 19, 19), { w: 2.2, seed: 4, amp: 0.35 });
    dot(x, 23, 23, 2.4); dot(x, 37, 23, 2.4);
    pen(x, geo.curve([21, 31], [26, 39], [35, 39], [39, 30], 10), { w: 2 });
    pen(x, [[24, 9], [22, 2]], { w: 1.8 }); pen(x, [[30, 8], [31, 0]], { w: 1.8 }); pen(x, [[36, 9], [40, 3]], { w: 1.8 });
  }
  const W = 860, HB = 400, CX = 190, CY = 286, ROD = 120, G = { x: 430, y: 92, w: 370, h: 180 };
  const SHAPES = [{ cam: PEAR, name: 'flat, then a hump' }, { cam: SNAIL, name: 'steady ramp, then a drop' }, { cam: ECC, name: 'smooth wave' }];
  function thumb(btn, k) {
    const c = document.createElement('canvas'), dpr = Math.min(2, window.devicePixelRatio || 1), w = 230, h = 130;
    c.width = w * dpr; c.height = h * dpr; c.style.cssText = 'display:block;width:100%;height:auto;pointer-events:none';
    const x = c.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.lineCap = 'round'; x.lineJoin = 'round'; x.globalCompositeOperation = 'multiply';
    Ink.stroke(x, [[34, 14], [34, 108], [216, 108]], { w: 2, seed: 3 + k, amp: 0.5 });
    const cam = SHAPES[k].cam, P = []; for (let i = 0; i <= 60; i++) { const u = Math.min(0.9999, i / 60); P.push([40 + 168 * u, 100 - ((cam.P(u) - cam.lo) / (cam.hi - cam.lo)) * 70]); }
    if (cam.step) P.push([208, 100]);
    Ink.stroke(x, P, { w: 2.8, color: RD, seed: 9 + k, amp: 0.5 });
    btn.appendChild(c);
    const l = document.createElement('div'); l.style.cssText = 'font:700 20px Fredoka,system-ui;text-align:center;line-height:1.2'; l.textContent = 'Graph ' + 'ABC'[k]; btn.appendChild(l);
  }

  Book.page({
    id: 'p03',
    title: 'The cam shape lab',
    build(ui, root) {
      const got = (id) => Book.state.items[id];
      ui.h('The cam shape lab');
      ui.p('Change the <b>shape</b> of a cam and you change the way its follower moves. Three benches, three cams. For each one: <b>predict</b> the graph, <b>spin</b> the cam, then <b>describe</b> what you saw.');
      const benches = ui.el('div', '');
      const DESC = {
        ecc: 'It rises and falls smoothly all the time, never stopping',
        pear: 'It stays still for about half the turn, then rises and falls',
        snail: 'It rises slowly and steadily, then drops all at once',
      };

      function bench(o) {
        const cam = o.cam, lab = ui.el('div', 'cg-lab', null, benches); requestAnimationFrame(() => Ink.frame(lab));
        ui.el('div', '', `<b style="font:700 24px Fredoka,system-ui">Bench ${o.n}: ${o.title}</b>`, lab);
        const rP = ui.record(o.pid, { label: o.plabel, type: 'predict', max: 0 });
        const pv = rP.get() || {}; let pick = pv.pick ?? null, ran = !!pv.ran, jammed = !!pv.jam;
        // ---- 1 predict
        ui.el('div', 'cg-step', '1 · Predict', lab);
        ui.el('div', 'cg-task', o.ask + ' Which graph of <b>follower height</b> will it draw in one full turn?', lab);
        const prow = ui.el('div', 'cg-row', null, lab);
        const pb = SHAPES.map((sh, k) => { const b = ui.el('button', 'opt', '', prow); b.type = 'button'; b.style.padding = '6px 8px'; thumb(b, k); if (pick === k) b.classList.add('sel');
          b.onclick = () => { if (ran || turned > 0.4) return; pick = k; pb.forEach((q) => q.classList.remove('sel')); b.classList.add('sel'); Book.scribble(0.12); savePred(); unlock(); }; return b; });
        const savePred = () => rP.set({ answer: pick == null ? '' : `Graph ${'ABC'[pick]} (${SHAPES[pick].name})` + (ran ? (SHAPES[pick].cam === cam ? ': matched ✓' : ': did not match ✗') : '') + (o.rev && jammed ? '; found it jams in reverse' : ''), correct: null, pick, ran, jam: jammed });
        // ---- 2 test
        ui.el('div', 'cg-step', '2 · Test', lab);
        const task2 = ui.el('div', 'cg-task', o.rev ? 'Press <b>play</b> (or drag the cam) for one full turn. Then try the <b>reverse</b> button.' : 'Press <b>play</b> (or drag the cam round) until the graph shows one full turn.', lab);
        const test = ui.el('div', '', null, lab);
        const S = Stage(test, W, HB);
        const tr = Trace(120); if (ran) tr.fill();
        let a = o.a0 * TAU, turned = 0, playing = false, dir = 1, speed = 0.3, hv = null, jamT = -9, landT = -9, camL, riderL, stat;
        function art() {
          camL = camSprite(S, cam); riderL = S.layer(60, 50, paintRider);
          stat = S.layer(W, HB, (x) => { paintGuide(x, CX, 150, 184); pen(x, [[50, 150], [CX - 38, 150]], { w: 2.2, seed: 66 }); pen(x, [[CX + 38, 150], [330, 150]], { w: 2.2, seed: 67 }); paintAxes(x, G); });
        }
        art(); S.onFonts = art;
        function advance(da, t) {
          let na = a + da;
          if (cam.step && da < 0 && Math.floor(na / TAU) < Math.floor(a / TAU)) { // the follower meets the step: it cannot climb it
            na = Math.floor(a / TAU) * TAU + 0.0006;
            if (t - jamT > 1.2) { jamT = t; playing = false; setPlay(); Book.sfx('error', { gain: 0.35 }); Book.sfx('thud', { gain: 0.3 }); if (!jammed) { jammed = true; savePred(); } check(); }
          }
          tr.mark(a, na); turned += Math.abs(na - a); a = na;
          if (!ran && tr.full()) { ran = true; savePred(); Book.sfx('success', { gain: 0.3 }); check(); }
        }
        S.render = (dt, t) => {
          const x = S.ctx; let busy = playing || S.dragging();
          if (playing) advance(dir * speed * TAU * dt, t);
          const h = lift(cam, a, 'knife');
          if (hv == null || !cam.step || h >= hv || hv - h < 6) hv = h; else { hv = Math.max(h, hv - 1300 * dt); busy = true; if (hv === h) { landT = t; Book.sfx('thud', { gain: 0.35 }); } }
          const jam = t - jamT < 0.9, shake = jam ? Math.sin(t * 60) * 0.025 : 0; if (jam || t - landT < 0.25) busy = true;
          S.blit(stat, 0, 0); S.rot(camL, CX, CY, a + shake);
          const top = drawFollower(x, CX, CY - hv, 'knife', ROD);
          pen(x, [[CX - 26, top], [CX + 26, top]], { w: 2.6, wob: false });
          S.blit(riderL, CX - 30, top - 48 + (t - landT < 0.12 ? 3 : 0));
          if (t - landT < 0.25) [-1, 1].forEach((sg) => pen(x, [[CX + sg * 16, CY - hv - 4], [CX + sg * 30, CY - hv - 12]], { w: 2, color: RD, wob: false }));
          // which way it is turning
          const R = cam.hi + 16, a0 = dir > 0 ? 2.5 : 3.5, a1 = dir > 0 ? 3.5 : 2.5; pen(x, geo.ellipse(CX, CY, R, R, a0, a1), { w: 2.2, a: 0.6, seed: 73 });
          const e = [CX + R * Math.cos(a1), CY + R * Math.sin(a1)], tg = a1 + (dir > 0 ? Math.PI / 2 : -Math.PI / 2); pen(x, [[e[0] - 12 * Math.cos(tg - 0.5), e[1] - 12 * Math.sin(tg - 0.5)], e, [e[0] - 12 * Math.cos(tg + 0.5), e[1] - 12 * Math.sin(tg + 0.5)]], { w: 2.2, a: 0.7, wob: false });
          const u = frac(a / TAU);
          drawCurve(x, G, cam, tr, { u, r: hv });
          text(x, 'cam angle: ' + Math.round(u * 360) + '°', G.x + G.w, 48, { size: 24, align: 'right' });
          if (jam || (jammed && dir < 0 && !playing && frac(a / TAU) < 0.01)) { Ink.drawBubble(x, 'JAMMED!', CX + 150, 60, 40, RD, 1, -0.04, 'center'); text(x, 'the follower cannot climb the step', 30, HB - 8, { font: 'hand', size: 22, color: RD }); }
          return busy;
        };
        S.drag((p) => Math.hypot(p[0] - CX, p[1] - CY) < 150, spinner(() => CX, () => CY, () => a, (na, d) => { if (pick == null) return; advance(d, performance.now() / 1000); if (turned > 0.4) pb.forEach((q) => (q.disabled = true)); }));
        const ctl = ui.el('div', 'cg-row', null, lab);
        const playB = ui.el('button', 'btn', '▶ play', ctl); playB.type = 'button'; playB.style.minWidth = '120px';
        const setPlay = () => { playB.textContent = playing ? '❚❚ pause' : '▶ play'; };
        playB.onclick = () => { playing = !playing; if (playing) pb.forEach((q) => (q.disabled = true)); setPlay(); S.go(); };
        const sp = [['slow', 0.12], ['medium', 0.3], ['fast', 0.75]].map(([t, v]) => { const b = ui.el('button', 'opt tiny' + (v === speed ? ' sel' : ''), t, ctl); b.type = 'button'; b.onclick = () => { speed = v; sp.forEach((q) => q.classList.remove('sel')); b.classList.add('sel'); Book.sfx('tick', { gain: 0.4 }); }; return b; });
        let revB = null;
        if (o.rev) { revB = ui.el('button', 'btn ghost', '⇄ reverse', ctl); revB.type = 'button'; revB.onclick = () => { dir = -dir; revB.textContent = dir > 0 ? '⇄ reverse' : '⇄ forwards'; playing = true; setPlay(); Book.sfx('tick', { gain: 0.5 }); S.go(); }; }
        const lockMsg = ui.el('div', 'cg-msg red', 'Make your prediction first: then the bench switches on.', lab);
        // ---- 3 conclude
        const conc = ui.el('div', '', null, lab);
        ui.el('div', 'cg-step', '3 · What did you see?', conc);
        const cmp = ui.el('div', 'cg-task', '', conc);
        const others = Object.keys(DESC).filter((k) => k !== o.key);
        const mcq = ui.mcq({ id: o.id, label: o.label, q: `In words: how does the follower on this cam move during one turn?`,
          options: [{ t: DESC[o.key], ok: true }, { t: DESC[others[0]], mis: 'cam-shape', why: o.why }, { t: DESC[others[1]], mis: 'cam-shape', why: o.why }, { t: o.extra, mis: 'cam-shape', why: o.why }], explain: o.explain });
        conc.appendChild(mcq);
        const notes = ui.box(o.notes, { tag: 'Notes' }); conc.appendChild(notes);
        mcq.addEventListener('click', () => setTimeout(check, 60));
        function unlock() { const on = pick != null; [test, ctl].forEach((e) => { e.style.pointerEvents = on ? '' : 'none'; }); ctl.style.opacity = on ? 1 : 0.4; lockMsg.classList.toggle('cg-hide', on); }
        function check() {
          const done = ran && (!o.rev || jammed);
          conc.classList.toggle('cg-hide', !done);
          task2.innerHTML = ran && o.rev && !jammed ? 'One full turn plotted ✓ Now press <b>⇄ reverse</b> and watch what happens.' : task2.innerHTML;
          if (ran) pb.forEach((q) => (q.disabled = true));
          if (done && pick != null) { const ok = SHAPES[pick].cam === cam; cmp.innerHTML = `You predicted <b>Graph ${'ABC'[pick]}</b>: <b class="${ok ? 'green' : 'red'}">${ok ? '✓ that is what it drew' : '✗ it drew Graph ' + 'ABC'[SHAPES.findIndex((q) => q.cam === cam)]}</b>.`; }
          const it = got(o.id); notes.classList.toggle('cg-hide', !(it && it.correct === true));
        }
        unlock(); check(); S.go();
      }

      bench({ n: 1, key: 'ecc', cam: ECC, a0: 0.04, title: 'the eccentric cam', pid: 'p03.ecc-predict', plabel: 'Eccentric cam: predicted graph shape', id: 'p03.ecc', label: 'Eccentric cam: describe the follower movement',
        ask: 'This cam is a <b>circle</b>, but its shaft is not in the middle.', extra: 'It rises quickly, then stays at the top for half the turn',
        why: 'Look again at the red line this cam drew. Is there any flat part? Any sudden drop?', explain: 'The graph is one smooth wave: the follower is always either rising or falling.',
        notes: '<b>Eccentric cam</b>: a circle with the shaft <b>off-centre</b>. The follower rises and falls <b>smoothly and continuously</b>, with <b>no dwell</b>.<br>Used in pumps (e.g. a fuel pump) and steam engines.' });
      bench({ n: 2, key: 'pear', cam: PEAR, a0: 0.03, title: 'the pear cam', pid: 'p03.pear-predict', plabel: 'Pear cam: predicted graph shape', id: 'p03.pear', label: 'Pear cam: describe the follower movement',
        ask: 'This cam is shaped like a <b>pear</b> (or an egg): round at one end, with a bump at the other.', extra: 'It rises and falls twice in every turn, without stopping',
        why: 'Look again at the red line this cam drew. Where is it flat, and for how much of the turn?', explain: 'The flat part of the graph is a dwell: the round part of the cam is passing under the follower, so it does not move.',
        notes: '<b>Pear cam</b>: pear (egg) shaped. The follower <b>dwells for about half the turn</b>, then rises and falls smoothly (the rise matches the fall: it is symmetrical).<br>Used to open and close the valves in a car engine (on the <b>camshaft</b>).' });
      bench({ n: 3, key: 'snail', cam: SNAIL, a0: 0.12, rev: true, title: 'the snail cam', pid: 'p03.snail-predict', plabel: 'Snail cam: predicted graph shape (+ reverse test)', id: 'p03.snail', label: 'Snail cam: describe the follower movement',
        ask: 'This cam is a <b>spiral</b>, like a snail shell, with one sharp step.', extra: 'It drops slowly and steadily, then jumps up all at once',
        why: 'Look again at the red line this cam drew (turning forwards). Which part is slow and which part is sudden?', explain: 'The spiral lifts the follower a little at a time, then the step lets it fall.',
        notes: '<b>Snail (drop) cam</b>: a spiral, like a snail shell. The follower <b>rises slowly and steadily, then drops suddenly</b>.<br>It must only turn <b>one way</b>: the other way it jams.<br>Used in hammers and stamping machines, striking mechanisms, and toys where something drops or snaps.' });
      ui.p('<span class="small">There are other shapes too. A <b>heart-shaped cam</b> rises and falls at a constant speed with no dwell (it winds thread evenly onto a bobbin).</span>');

      // ------------------------------------------------------------------ pick the cam
      ui.el('h2', '', 'Pick the cam');
      ui.p('You are the designer. Which cam does each job need? <span class="small">The benches and their notes will blur while you work.</span>');
      const sort = ui.sort({ id: 'p03.choose', label: 'Pick the cam for 5 design needs', q: 'Tap a job, then tap the cam that would do it.',
        buckets: ['Eccentric cam', 'Pear cam', 'Snail cam'],
        items: [
          { t: 'A toy hammer that lifts slowly, then bangs down', b: 2, mis: 'cam-shape' },
          { t: 'An engine valve that stays shut for half of every turn', b: 1, mis: 'dwell-meaning' },
          { t: 'A pump that moves smoothly up and down all the time', b: 0, mis: 'cam-shape' },
          { t: 'A toy rabbit that pops up, goes down, then stays down a while', b: 1, mis: 'dwell-meaning' },
          { t: 'A stamping machine that raises its stamp, then lets it drop', b: 2, mis: 'cam-shape' },
        ],
        explain: 'Smooth and non-stop = eccentric. A pause (dwell) = pear. Slow lift then sudden drop = snail.' });
      ui.hideWhile(sort, 'p03.choose', [benches]);
    },
  });
})();
