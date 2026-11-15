// Page 6 — The test lab: three hands-on test stations (scratch, hammer, pull) on real samples,
// then questions that use what the student saw.
(function () {
  'use strict';
  const B = Ink.BLUE, R = Ink.RED, G = Ink.GREEN, rgba = Ink.rgba, geo = Ink.geo;
  const PAPER = '#fbfaf5';
  const HAND = (s) => `400 ${s}px "Gloria Hallelujah", "Comic Sans MS", cursive`;
  const LAB = (s, w = 600) => `${w} ${s}px Fredoka, "Arial Rounded MT Bold", system-ui`;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  // ---------- page-scoped styles ----------
  function css() {
    if (document.getElementById('p06-css')) return;
    const s = document.createElement('style'); s.id = 'p06-css';
    s.textContent = `
      .p06-st { margin: 0 0 calc(var(--R) * 1.4); padding: 14px 18px 16px; }
      .p06-st h2 { margin: 0 0 4px; }
      .p06-st p { margin: 0 0 10px; }
      .p06-pick { display: flex; flex-wrap: wrap; gap: 8px; margin: 0 0 10px; }
      .p06-pick .opt { flex: 1 1 104px; text-align: center; min-height: 48px; padding: 6px 8px; font-size: 18px; }
      .p06-pick .opt.done::after { content: ' \\2713'; color: var(--green); font-family: Fredoka; }
      .p06-cv { position: relative; display: block; width: 100%; height: auto; touch-action: none; user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; cursor: pointer; }
      .p06-out { min-height: var(--R); font-size: 19px; line-height: 1.5; margin: 8px 0 0; }
      .p06-out b { font-family: Fredoka; font-weight: 600; }
      .p06-st .btn { margin-top: 0; }
    `;
    document.head.appendChild(s);
  }

  // ---------- canvas helpers ----------
  function stage(parent, w, h) {
    const c = document.createElement('canvas'); c.className = 'p06-cv'; parent.appendChild(c);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = w * dpr; c.height = h * dpr; c.style.aspectRatio = w + ' / ' + h;
    const ctx = c.getContext('2d');
    const S = { c, ctx, w, h, dpr, visible: true, dirty: true };
    S.pos = (e) => { const r = c.getBoundingClientRect(); return [(e.clientX - r.left) * w / r.width, (e.clientY - r.top) * h / r.height]; };
    S.layer = () => { const L = document.createElement('canvas'); L.width = w * dpr; L.height = h * dpr; const x = L.getContext('2d'); L.x = x; L.reset = () => { x.setTransform(1, 0, 0, 1, 0, 0); x.globalCompositeOperation = 'source-over'; x.clearRect(0, 0, L.width, L.height); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.globalCompositeOperation = 'multiply'; x.lineCap = x.lineJoin = 'round'; }; L.reset(); return L; };
    S.begin = () => { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'source-over'; ctx.clearRect(0, 0, c.width, c.height); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.globalCompositeOperation = 'multiply'; ctx.lineCap = ctx.lineJoin = 'round'; };
    S.blit = (L) => { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(L, 0, 0); ctx.restore(); };
    if (window.IntersectionObserver) new IntersectionObserver((es) => { S.visible = es[es.length - 1].isIntersecting; if (S.visible) S.dirty = true; }).observe(c);
    return S;
  }
  // one rAF loop per station; does no work while the page is hidden or the canvas is off screen
  function run(root, S, step) {
    let last = performance.now();
    const f = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const pg = root.closest('.page');
      if (!(pg && pg.classList.contains('hidden')) && S.visible) step(dt);
      requestAnimationFrame(f);
    };
    requestAnimationFrame(f);
  }
  function text(ctx, s, x, y, o = {}) {
    ctx.save(); ctx.globalCompositeOperation = 'multiply';
    ctx.font = o.font === 'lab' ? LAB(o.size || 22) : HAND(o.size || 22);
    ctx.fillStyle = rgba(o.color || B, o.a ?? 0.92); ctx.textAlign = o.align || 'left'; ctx.textBaseline = 'alphabetic';
    ctx.translate(x, y); if (o.rot) ctx.rotate(o.rot); ctx.fillText(s, 0, 0); ctx.restore();
  }
  function wrap(ctx, s, maxW, font) {
    ctx.save(); ctx.font = font; const out = []; let cur = '';
    s.split(' ').forEach((w) => { const t = cur ? cur + ' ' + w : w; if (ctx.measureText(t).width > maxW && cur) { out.push(cur); cur = w; } else cur = t; });
    if (cur) out.push(cur); ctx.restore(); return out;
  }
  const poly = (ctx, pts) => { ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); };
  // regular hatching anchored to the page (no shimmer when a shape changes size)
  function hatch(ctx, pts, col = B, a = 0.4, sp = 6, dir = 1, lw = 1) {
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; pts.forEach(([x, y]) => { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); });
    ctx.save(); poly(ctx, pts); ctx.clip(); ctx.strokeStyle = rgba(col, a); ctx.lineWidth = lw; ctx.beginPath();
    if (dir > 0) { for (let c = Math.floor((x0 + y0) / sp) * sp; c < x1 + y1 + sp; c += sp) { const j = ((c * 7919) % 7) / 7 - 0.5; ctx.moveTo(c - y0 + 2 + j, y0 - 2); ctx.lineTo(c - y1 - 2 + j, y1 + 2); } }
    else { for (let c = Math.floor((x0 - y1) / sp) * sp; c < x1 - y0 + sp; c += sp) { const j = ((c * 7919) % 7) / 7 - 0.5; ctx.moveTo(c + y0 - 2 + j, y0 - 2); ctx.lineTo(c + y1 + 2 + j, y1 + 2); } }
    ctx.stroke(); ctx.restore();
  }
  const paperFill = (ctx, pts) => { ctx.save(); ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = PAPER; poly(ctx, pts); ctx.fill(); ctx.restore(); };
  const line = (ctx, pts, o = {}) => Ink.stroke(ctx, pts, Object.assign({ w: 2.4 }, o));
  const close = (P) => P.concat([P[0], P[1] || P[0]]);
  // material "look" used by every station
  function fillMat(ctx, k, pts) {
    if (k === 'steel') hatch(ctx, pts, B, 0.38, 6, 1);
    else if (k === 'copper') { hatch(ctx, pts, R, 0.5, 5, 1); }
    else if (k === 'castiron') { hatch(ctx, pts, B, 0.45, 4.5, 1); hatch(ctx, pts, B, 0.3, 6, -1); }
    else if (k === 'rubber') { hatch(ctx, pts, B, 0.55, 3.6, 1); hatch(ctx, pts, B, 0.45, 4, -1); }
    else if (k === 'acrylic' || k === 'glass') {
      let x0 = 1e9, y0 = 1e9, x1 = -1e9; pts.forEach(([x, y]) => { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); });
      ctx.save(); poly(ctx, pts); ctx.clip(); ctx.strokeStyle = rgba(B, 0.55); ctx.lineWidth = 1.4;
      [[0.18, 14, 30], [0.3, 12, 18], [0.62, 40, 22]].forEach(([u, dy, len]) => { const x = x0 + (x1 - x0) * u; ctx.beginPath(); ctx.moveTo(x, y0 + dy + len); ctx.lineTo(x + len * 0.6, y0 + dy); ctx.stroke(); });
      ctx.restore();
    }
  }

  // =====================================================================================
  // Station 1: scratch test (hardness)
  // =====================================================================================
  function scratchStation(ui, root, host) {
    const rec = ui.record('p06.scratch', { label: 'Scratch test: samples tested (hardness)', type: 'experiment', max: 0 });
    const W = 860, Hh = 440, S = stage(host, W, Hh), out = ui.el('div', 'p06-out', 'Drag the nail across all five samples.', host);
    const TW = 156, TY = 64, TH = 220;
    const M = [
      { k: 'glass', name: 'glass', d: 'barely a mark', v: 'VERY HARD', snd: ['pencil', 0.5, 6200] },
      { k: 'steel', name: 'mild steel', d: 'a light scratch', v: 'HARD', snd: ['pen', 0.9] },
      { k: 'copper', name: 'copper', d: 'a clear groove', v: 'SOFTER', snd: ['marker', 0.6] },
      { k: 'acrylic', name: 'acrylic', d: 'deep scratches', v: 'SCRATCHES EASILY', snd: ['chalk', 0.55] },
      { k: 'rubber', name: 'rubber', d: 'squashes in, no groove', v: 'SOFT (dents easily)', snd: null },
    ];
    M.forEach((m, i) => { m.x = 8 + i * (TW + 13); m.dist = 0; m.done = false; m.P = geo.rect(m.x, TY, TW, TH, 10); });
    const prev = rec.get(); if (prev && prev.done) prev.done.forEach((k) => { const m = M.find((q) => q.k === k); if (m) { m.done = true; m.dist = 99; } });
    const segs = []; // grooves, kept so the layer can be repainted
    const L = S.layer();
    const REST = { x: 34, y: 32, a: 0 };
    let nail = { x: REST.x, y: REST.y, a: 0 }, drag = false, last = null, sndT = 0, squish = null, homing = 0, usedOnce = !!(prev && prev.done && prev.done.length);

    function paintStatic() {
      L.reset(); const x = L.x;
      M.forEach((m, i) => {
        Ink.hatchShadow(x, m.P, 1, 7, 7, B);
        paperFill(x, m.P);
        if (m.k === 'steel') Ink.hatchFill(x, m.P, 1, B, 0.6);
        else if (m.k === 'copper') Ink.hatchFill(x, m.P, 1, R, 0.75);
        else if (m.k === 'rubber') { Ink.hatchFill(x, m.P, 1, B, 1.7); hatch(x, m.P, B, 0.3, 4, -1); }
        else fillMat(x, m.k, m.P);
        line(x, m.P, { w: 2.6, seed: 40 + i });
        // masking-tape label
        const lw = Math.min(TW - 20, 30 + m.name.length * 12), lab = geo.rect(m.x + TW / 2 - lw / 2, TY + 12, lw, 34, 4);
        paperFill(x, lab); line(x, lab, { w: 1.6, seed: 60 + i });
        text(x, m.name, m.x + TW / 2, TY + 37, { font: 'lab', size: 22, align: 'center' });
      });
      segs.forEach((s) => groove(x, s[0], s[1], s[2], s[3]));
    }
    // draw one bit of groove straight onto the sample layer
    function groove(x, k, a, b, n) {
      const dx = b[0] - a[0], dy = b[1] - a[1], Ln = Math.hypot(dx, dy) || 1, nx = -dy / Ln, ny = dx / Ln;
      const ln = (off, lw, col, comp) => { x.globalCompositeOperation = comp; x.strokeStyle = col; x.lineWidth = lw; x.beginPath(); x.moveTo(a[0] + nx * off, a[1] + ny * off); x.lineTo(b[0] + nx * off, b[1] + ny * off); x.stroke(); };
      if (k === 'glass') ln(0, 0.8, rgba(B, 0.22), 'multiply');
      else if (k === 'steel') { ln(0, 2.6, PAPER, 'source-over'); ln(1.6, 1, rgba(B, 0.7), 'multiply'); }
      else if (k === 'copper') { ln(0, 5.5, PAPER, 'source-over'); ln(-2.8, 1.1, rgba(R, 0.8), 'multiply'); ln(2.9, 2, rgba(B, 0.8), 'multiply'); }
      else if (k === 'acrylic') {
        ln(0, 7, PAPER, 'source-over'); ln(-3.9, 1.4, rgba(B, 0.85), 'multiply'); ln(3.9, 1.6, rgba(B, 0.9), 'multiply');
        ln(-8, 0.7, rgba(B, 0.45), 'multiply'); ln(7.5, 0.6, rgba(B, 0.4), 'multiply');
        if ((n * 2654435761 >>> 0) % 7 === 0) { x.globalCompositeOperation = 'multiply'; x.strokeStyle = rgba(B, 0.7); x.lineWidth = 1; x.beginPath(); const s = (n >> 1) % 2 ? 1 : -1; x.moveTo(b[0] + nx * 4 * s, b[1] + ny * 4 * s); x.lineTo(b[0] + nx * 10 * s + dx * 0.4, b[1] + ny * 10 * s + dy * 0.4); x.stroke(); }
      }
      x.globalCompositeOperation = 'multiply';
    }
    const tileAt = (p) => M.find((m) => p[0] > m.x + 3 && p[0] < m.x + TW - 3 && p[1] > TY + 3 && p[1] < TY + TH - 3);

    function save() {
      const done = M.filter((m) => m.done);
      const all = done.length === M.length;
      rec.set({ answer: `scratched ${done.length}/5: ` + done.map((m) => `${m.name} (${m.d})`).join(', '), correct: all ? true : null, done: done.map((m) => m.k) });
      out.innerHTML = all ? '<b>All five tested!</b> Which one was hardest to scratch? Keep it in mind for the questions.' : `Tested ${done.length} of 5. Keep scratching!`;
    }
    let segN = 0;
    function moveTo(px, py) {
      // the nail is held with the point ahead of your finger so you can see it
      const a = 0.9, tip = [px - 70 * Math.cos(a), py - 70 * Math.sin(a)];
      nail = { x: tip[0], y: tip[1], a };
      if (last) {
        const d = Math.hypot(tip[0] - last[0], tip[1] - last[1]), n = Math.max(1, Math.ceil(d / 3));
        let p0 = last, hitK = null;
        for (let j = 1; j <= n; j++) {
          const p1 = [last[0] + (tip[0] - last[0]) * j / n, last[1] + (tip[1] - last[1]) * j / n], m0 = tileAt(p0), m1 = tileAt(p1);
          if (m0 && m0 === m1) {
            hitK = m1; m1.dist += Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
            if (m1.k !== 'rubber') { segs.push([m1.k, p0, p1, segN]); groove(L.x, m1.k, p0, p1, segN++); }
            if (!m1.done && m1.dist > 70) { m1.done = true; Book.sfx('tick', { gain: 0.6 }); Book.scribble(0.2); save(); }
          }
          p0 = p1;
        }
        const now = performance.now() / 1000;
        if (hitK && hitK.snd && now - sndT > 0.07 && d > 1) { sndT = now; Book.sfx('stroke', { material: hitK.snd[0], dur: 0.09, gain: hitK.snd[1] }); }
        if (hitK && hitK.k === 'rubber' && !squish) Book.sfx('pop', { f: 180, gain: 0.25 });
      }
      squish = tileAt(tip) && tileAt(tip).k === 'rubber' ? tip : null;
      last = tip; S.dirty = true;
    }
    S.c.addEventListener('pointerdown', (e) => { e.preventDefault(); try { S.c.setPointerCapture(e.pointerId); } catch (_) {} drag = true; usedOnce = true; last = null; homing = 0; const [x, y] = S.pos(e); moveTo(x, y); Book.sfx('tick', { gain: 0.4 }); });
    S.c.addEventListener('pointermove', (e) => { if (!drag) return; e.preventDefault(); const [x, y] = S.pos(e); moveTo(x, y); });
    const up = () => { if (!drag) return; drag = false; last = null; squish = null; homing = 1; S.dirty = true; };
    S.c.addEventListener('pointerup', up); S.c.addEventListener('pointercancel', up);

    function drawNail(ctx, x, y, a) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(a);
      const body = [[0, 0], [24, -4.5], [150, -4.5], [150, 4.5], [24, 4.5]];
      paperFill(ctx, body);
      hatch(ctx, [[24, 0.5], [150, 0.5], [150, 4.5], [24, 4.5]], B, 0.6, 3, 1);
      line(ctx, [[0, 0], [24, -4.5], [149, -4.5]], { w: 1.9, seed: 11 });
      line(ctx, [[0, 0], [24, 4.5], [149, 4.5]], { w: 1.9, seed: 12 });
      const hd = geo.rect(149, -13, 8, 26, 2); paperFill(ctx, hd); hatch(ctx, hd, B, 0.5, 3, -1); line(ctx, hd, { w: 2, seed: 13 });
      ctx.strokeStyle = rgba(B, 0.6); ctx.lineWidth = 1; ctx.beginPath(); for (let i = 0; i < 5; i++) { ctx.moveTo(128 + i * 4, -4); ctx.lineTo(126 + i * 4, 4); } ctx.stroke();
      ctx.restore();
    }
    function render() {
      S.begin(); const ctx = S.ctx; S.blit(L);
      if (!usedOnce) {
        text(ctx, '← drag the steel nail across each sample', 200, 40, { size: 24, color: R });
      }
      if (squish) {
        // the rubber squashes under the point instead of being cut
        const [x, y] = squish; ctx.save(); ctx.strokeStyle = rgba(PAPER, 1); ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = PAPER;
        ctx.beginPath(); ctx.ellipse(x, y + 4, 24, 11, 0, 0, 7); ctx.fill(); ctx.restore();
        line(ctx, geo.ellipse(x, y + 4, 24, 11, 0.1, Math.PI - 0.1), { w: 1.8, seed: 70 });
        line(ctx, geo.ellipse(x, y + 4, 36, 17, 0.3, Math.PI - 0.3), { w: 1.4, seed: 71 });
        text(ctx, 'squish!', x + 26, y - 14, { size: 22, color: R });
      }
      M.forEach((m) => {
        if (!m.done) return;
        const ls = wrap(ctx, m.d, TW - 4, HAND(22)), vs = wrap(ctx, m.v, TW - 4, LAB(22));
        let y = TY + TH + 34;
        ls.forEach((s) => { text(ctx, s, m.x + TW / 2, y, { size: 22, align: 'center' }); y += 28; });
        vs.forEach((s) => { text(ctx, s, m.x + TW / 2, y + 2, { font: 'lab', size: 22, align: 'center', color: R }); y += 26; });
        Ink.tick(ctx, m.x + TW - 26, TY + TH - 30, 0.9);
      });
      drawNail(ctx, nail.x, nail.y, nail.a);
    }
    run(root, S, (dt) => {
      if (homing > 0) { homing = Math.max(0, homing - dt * 4); const k = 1 - Math.pow(homing, 2); nail = { x: nail.x + (REST.x - nail.x) * k * 0.5, y: nail.y + (REST.y - nail.y) * k * 0.5, a: nail.a * (1 - k * 0.5) }; if (!homing) nail = { x: REST.x, y: REST.y, a: 0 }; S.dirty = true; }
      if (S.dirty) { S.dirty = false; render(); }
    });
    paintStatic();
    if (document.fonts) document.fonts.ready.then(() => { paintStatic(); S.dirty = true; });
    if (prev && prev.done && prev.done.length) out.textContent = `Tested ${prev.done.length} of 5.`;
  }

  // =====================================================================================
  // Station 2: hammer test (toughness / malleability / brittleness)
  // =====================================================================================
  function hammerStation(ui, root, host, pick) {
    const rec = ui.record('p06.hammer', { label: 'Hammer test: samples tested (toughness, malleability)', type: 'experiment', max: 0 });
    const W = 860, Hh = 500, S = stage(host, W, Hh), out = ui.el('div', 'p06-out', 'Pick a sample, then tap the picture to hit it with the hammer.', host);
    const CX = 335, XL = 300, XR = 370, JT = 275, SB = 352, Y0 = 195, FLOOR = 450;
    const PIV = [595, 161], HEAD = -260, FACE = 34, REST = 0.22;
    const MATS = {
      glass: { name: 'Glass', max: 1 }, steel: { name: 'Mild steel', max: 4 }, copper: { name: 'Copper', max: 4 }, castiron: { name: 'Cast iron', max: 2 }, rubber: { name: 'Rubber', max: 99 },
    };
    const RES = {
      glass: () => 'It <b>shattered</b>! Glass is very hard, but it is <b>brittle</b>, not tough.',
      steel: (h) => h >= 2 ? 'Dented, but still in <b>one piece</b>: mild steel is <b>tough</b>. It soaks up the blows without cracking.' : 'A dent, but no cracks. Hit it again!',
      copper: (h) => h >= 2 ? 'It <b>spreads out flat</b> without cracking: copper is <b>malleable</b> (it can be shaped by hammering).' : 'Look at the top: it is getting wider and flatter. Hit it again!',
      castiron: (h) => h >= 2 ? 'A chunk <b>snapped off</b>! Cast iron is <b>brittle</b>: it cracks instead of bending or denting.' : 'It <b>cracked</b>! No dent, no bending. Hit it again…',
      rubber: () => 'Boing! It squashed, then <b>sprang straight back</b> to its shape: rubber is <b>elastic</b>.',
    };
    const prev = rec.get(); const done = new Map((prev && prev.done) || []);
    let mat = 'glass', st, ang = REST, phase = 'rest', pt = 0, fromA = REST, toA = 0, words = [], used = done.size > 0;
    const fresh = () => ({ hits: 0, sq: 0, sqv: 0, shards: [], piece: null, cracked: false, broken: false });
    st = fresh();
    const L = S.layer();

    function vice(x) {
      // bench
      line(x, [[10, FLOOR], [850, FLOOR]], { w: 3, seed: 1 });
      line(x, [[10, FLOOR + 30], [850, FLOOR + 30]], { w: 2, seed: 2 });
      hatch(x, [[10, FLOOR + 2], [850, FLOOR + 2], [850, FLOOR + 28], [10, FLOOR + 28]], B, 0.28, 7, 1);
      // base plate + bolts
      const base = geo.rect(270, 432, 230, 18, 4); paperFill(x, base); hatch(x, base, B, 0.35, 5, 1); line(x, base, { w: 2.4, seed: 3 });
      [290, 480].forEach((bx, i) => line(x, geo.ellipse(bx, 441, 6, 5), { w: 1.8, seed: 4 + i }));
      // fixed body + fixed jaw + anvil
      const body = [[300, 350], [462, 350], [470, 432], [292, 432]];
      Ink.hatchShadow(x, body, 1, 7, 7, B); paperFill(x, body); Ink.hatchFill(x, body, 1, B, 0.75); line(x, close(body), { w: 2.8, seed: 6 });
      const fj = [[XR, JT], [440, JT], [440, 352], [XR, 352]]; paperFill(x, fj); Ink.hatchFill(x, fj, 1, B, 0.6); line(x, close(fj), { w: 2.8, seed: 7 });
      const anv = [[440, 300], [496, 300], [490, 340], [440, 340]]; paperFill(x, anv); hatch(x, anv, B, 0.35, 5, -1); line(x, close(anv), { w: 2.4, seed: 8 });
      // moving jaw with slide
      const mj = [[228, JT], [XL, JT], [XL, 360], [330, 360], [330, 388], [228, 388]]; Ink.hatchShadow(x, mj, 1, 6, 6, B); paperFill(x, mj); Ink.hatchFill(x, mj, 1, B, 0.6); line(x, close(mj), { w: 2.8, seed: 9 });
      // serrated jaw plates
      [[XL - 12, XL], [XR, XR + 12]].forEach(([a, b], i) => {
        const jp = [[a, JT], [b, JT], [b, JT + 38], [a, JT + 38]]; paperFill(x, jp); line(x, close(jp), { w: 1.8, seed: 10 + i });
        const zz = []; for (let y = JT + 2; y <= JT + 36; y += 5) zz.push([i ? b - 4 : a + 4, y], [i ? b - 9 : a + 9, y + 2.5]); line(x, zz, { w: 1.2, seed: 12 + i, retrace: false });
      });
      // main screw, collar and tommy bar
      const sc = [[150, 330], [228, 330], [228, 346], [150, 346]]; paperFill(x, sc); line(x, close(sc), { w: 2, seed: 14 });
      x.strokeStyle = rgba(B, 0.6); x.lineWidth = 1.2; x.beginPath(); for (let sx = 156; sx < 222; sx += 6) { x.moveTo(sx, 330); x.lineTo(sx + 5, 346); } x.stroke();
      const col = geo.rect(210, 322, 18, 32, 3); paperFill(x, col); hatch(x, col, B, 0.4, 4, 1); line(x, col, { w: 2, seed: 15 });
      const bar = geo.rect(146, 266, 9, 144, 4); paperFill(x, bar); line(x, bar, { w: 2, seed: 16 });
      [[150.5, 262], [150.5, 414]].forEach(([bx, by], i) => { const ball = geo.ellipse(bx, by, 10, 10); paperFill(x, ball); hatch(x, ball, B, 0.5, 3.5, 1); line(x, ball, { w: 2, seed: 17 + i }); });
      text(x, 'bench vice', 120, 478, { size: 22, a: 0.75 });
      text(x, 'anvil', 500, 330, { size: 22, a: 0.75 });
    }
    function paintStatic() { L.reset(); vice(L.x); }

    // shape of the sample above/between the jaws
    function topParams() {
      const h = st.hits;
      if (mat === 'copper') return { y: Y0 + 14 * h, w: 70 + 26 * h, b: Math.min(30, 9 * h), dent: 0 };
      if (mat === 'steel') return { y: Y0 + 3 * h, w: 70 + 4 * h, b: 3 * h, dent: h ? 3 + 3 * h : 0 };
      if (mat === 'rubber') return { y: Y0 + 34 * st.sq, w: 70 + 40 * st.sq, b: 24 * Math.max(0, st.sq), dent: 0 };
      return { y: Y0, w: 70, b: 0, dent: 0 };
    }
    function samplePoly() {
      const p = topParams(), hw = p.w / 2, o = [[XL, SB], [XL, p.y + p.b]];
      if (p.b > 1 || p.w > 71) {
        geo.curve([XL, p.y + p.b], [XL, p.y + p.b * 0.3], [CX - hw, p.y + p.b * 0.75], [CX - hw, p.y + 3], 10).slice(1).forEach((q) => o.push(q));
      } else o.push([XL, p.y]);
      for (let i = 0; i <= 16; i++) { const u = i / 16, x = CX - hw + p.w * u; o.push([x, p.y + p.dent * Math.exp(-Math.pow((u - 0.5) / 0.2, 2))]); }
      if (p.b > 1 || p.w > 71) geo.curve([CX + hw, p.y + 3], [CX + hw, p.y + p.b * 0.75], [XR, p.y + p.b * 0.3], [XR, p.y + p.b], 10).slice(1).forEach((q) => o.push(q));
      else o.push([XR, p.y]);
      o.push([XR, SB]); return o;
    }
    const CRACK = [[CX - 12, Y0], [CX - 4, Y0 + 11], [CX - 9, Y0 + 19], [CX + 6, Y0 + 31], [CX + 2, Y0 + 39], [CX + 18, Y0 + 49], [XR, Y0 + 55]];
    const STUB_GLASS = [[XL, SB], [XL, 266], [XL + 9, 256], [XL + 18, 266], [CX - 6, 252], [CX + 7, 264], [CX + 19, 255], [XR - 7, 266], [XR, 259], [XR, SB]];
    const topY = () => mat === 'glass' && st.broken ? 255 : mat === 'castiron' && st.broken ? Y0 + 2 : topParams().y + topParams().dent * 0.3;

    function contactAngle(y) { let th = 0; for (let i = 0; i < 6; i++) th = Math.asin(clamp((y - PIV[1] - FACE * Math.cos(th)) / HEAD, -1, 1)); return th; }

    function hit() {
      const s = st, m = MATS[mat];
      s.hits++;
      if (mat === 'glass') {
        if (s.broken) { Book.sfx('thud', { gain: 0.5 }); word('nothing left!', B); return; }
        s.broken = true; Book.sfx('impact', { gain: 0.7 }); Book.sfx('sparkle', { n: 12, gain: 1.4 }); Book.sfx('glitch', { gain: 0.6 }); word('SMASH!', R);
        const r = H.rng(77 + Math.floor(performance.now()) % 1000);
        for (let i = 0; i < 20; i++) {
          const x = XL + 6 + r() * 58, y = Y0 + 6 + r() * 56, sz = 7 + r() * 15;
          s.shards.push({ x, y, vx: (x - CX) * 9 + r.range(-160, 160), vy: r.range(-520, -120), a: r() * 6, va: r.range(-14, 14), pts: [[0, -sz], [sz * r.range(0.4, 0.9), sz * r.range(0.2, 0.8)], [-sz * r.range(0.3, 0.8), sz * r.range(0.1, 0.7)]], rest: false });
        }
      } else if (mat === 'castiron') {
        if (s.broken) { Book.sfx('thud', { gain: 0.6 }); word('CLONK', B); s.hits = 2; return; }
        if (!s.cracked) { s.cracked = true; Book.sfx('impact', { gain: 0.6 }); Book.sfx('click', { gain: 1.2 }); word('CRACK!', R); }
        else { s.broken = true; Book.sfx('impact', { gain: 0.8 }); Book.sfx('glitch', { gain: 0.4 }); word('SNAP!', R); s.piece = { dx: 0, dy: 0, vx: 170, vy: -260, a: 0, va: 5, rest: false }; }
      } else if (mat === 'rubber') { Book.sfx('thud', { f: 90, gain: 0.5 }); Book.sfx('jump', { gain: 0.8 }); word('BOING!', B); s.sqv = 9; }
      else {
        if (s.hits > m.max) { s.hits = m.max; Book.sfx('thud', { gain: 0.6 }); word(mat === 'copper' ? 'flat as it goes!' : 'still in one piece!', B); }
        else { Book.sfx('impact', { f: mat === 'copper' ? 110 : 150, gain: 0.55 }); Book.sfx('tock', { f: mat === 'copper' ? 500 : 1300, gain: 0.5 }); word(mat === 'copper' ? 'SPLAT!' : 'DINK!', mat === 'copper' ? R : B); }
      }
      done.set(mat, Math.max(done.get(mat) || 0, s.hits));
      out.innerHTML = RES[mat](s.hits);
      pick.querySelector(`[data-k="${mat}"]`).classList.add('done');
      saveRec();
    }
    function saveRec() {
      const say = { glass: 'shattered', steel: 'dented, stayed in one piece', copper: 'spread flat', castiron: 'cracked/snapped', rubber: 'bounced back' };
      const list = [...done.keys()];
      rec.set({ answer: `hit ${list.length}/5: ` + list.map((k) => `${MATS[k].name.toLowerCase()} (${say[k]})`).join(', '), correct: list.length === 5 ? true : null, done: [...done.entries()] });
    }
    function word(s, col) { words.push({ s, col, t: 0 }); }

    function strike() {
      if (phase !== 'rest') return;
      used = true; phase = 'wind'; pt = 0; fromA = ang; Book.sfx('whoosh', { dur: 0.25, gain: 0.35 });
    }
    S.c.addEventListener('pointerdown', (e) => { e.preventDefault(); strike(); });

    function drawHammer(ctx) {
      ctx.save(); ctx.translate(PIV[0], PIV[1]); ctx.rotate(ang);
      const hl = [[-236, -7], [-120, -7.5], [-20, -10], [38, -11], [44, 0], [38, 11], [-20, 10], [-120, 7.5], [-236, 7]];
      paperFill(ctx, hl); hatch(ctx, hl, B, 0.22, 7, -1); line(ctx, close(hl).slice(0, -1), { w: 2.4, seed: 21 });
      ctx.strokeStyle = rgba(B, 0.5); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-200, -2); ctx.bezierCurveTo(-130, -4, -60, 1, 20, -3); ctx.moveTo(-170, 3); ctx.bezierCurveTo(-90, 5, -40, 1, 10, 4); ctx.stroke();
      const hx = HEAD;
      const head = [[hx - 23, -28], [hx + 23, -28], [hx + 23, 25], [hx + 27, 30], [hx + 27, FACE], [hx - 27, FACE], [hx - 27, 30], [hx - 23, 25]];
      const neck = [[hx - 23, -28], [hx - 11, -40], [hx + 11, -40], [hx + 23, -28]];
      const ball = geo.ellipse(hx, -55, 17, 17);
      [ball, neck, head].forEach((p) => paperFill(ctx, p));
      hatch(ctx, head, B, 0.55, 3.6, 1); hatch(ctx, [[hx + 6, -28], [hx + 23, -28], [hx + 23, 25], [hx + 6, 25]], B, 0.4, 4, -1);
      hatch(ctx, ball, B, 0.4, 4, 1); hatch(ctx, neck, B, 0.4, 4, 1);
      line(ctx, close(head).slice(0, -1), { w: 2.6, seed: 22 }); line(ctx, [[hx - 23, -28], [hx - 11, -40], [hx + 11, -40], [hx + 23, -28]], { w: 2.4, seed: 23 });
      line(ctx, ball, { w: 2.4, seed: 24 });
      // wedge end of the handle showing through the eye
      line(ctx, [[hx - 23, -8], [hx - 23, 8]], { w: 1.6, seed: 25 }); line(ctx, [[hx - 22, 0], [hx - 18, 0]], { w: 1.3, seed: 26, retrace: false });
      ctx.restore();
    }
    function render() {
      S.begin(); const ctx = S.ctx; S.blit(L);
      // the sample
      let P;
      if (mat === 'glass' && st.broken) P = STUB_GLASS;
      else if (mat === 'castiron' && st.broken) P = [[XL, SB], [XL, Y0]].concat(CRACK).concat([[XR, SB]]);
      else P = samplePoly();
      paperFill(ctx, P); fillMat(ctx, mat, P); line(ctx, close(P).slice(0, -1), { w: 2.6, seed: 30 });
      if (mat === 'glass' && st.broken) { ctx.strokeStyle = rgba(B, 0.6); ctx.lineWidth = 1.1; ctx.beginPath(); [[CX - 6, 252, CX - 18, 290], [CX + 7, 264, CX + 14, 300], [CX + 7, 264, CX + 30, 285]].forEach(([a, b, c, d]) => { ctx.moveTo(a, b); ctx.lineTo(c, d); }); ctx.stroke(); }
      if (mat === 'castiron' && st.cracked && !st.broken) line(ctx, CRACK, { w: 2.2, color: R, seed: 31, retrace: false });
      if (mat === 'castiron' && st.piece) {
        const pc = st.piece, piece = CRACK.concat([[XR, Y0]]), cx = XR - 14, cy = Y0 + 16;
        ctx.save(); ctx.translate(cx + pc.dx, cy + pc.dy); ctx.rotate(pc.a); ctx.translate(-cx, -cy);
        paperFill(ctx, piece); fillMat(ctx, 'castiron', piece); line(ctx, close(piece).slice(0, -1), { w: 2.4, seed: 32 }); ctx.restore();
      }
      if (mat === 'steel' && st.hits) { // hammer-face marks on the dented top
        const p = topParams(); ctx.strokeStyle = rgba(B, 0.7); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(CX - 18, p.y + p.dent * 0.5 + 6); ctx.quadraticCurveTo(CX, p.y + p.dent + 9, CX + 18, p.y + p.dent * 0.5 + 6); ctx.stroke();
      }
      st.shards.forEach((s, i) => { ctx.save(); ctx.translate(s.x, s.y); ctx.rotate(s.a); paperFill(ctx, s.pts); line(ctx, close(s.pts).slice(0, -1), { w: 1.6, seed: 40 + i, retrace: false }); ctx.restore(); });
      Ink.drawBubble(ctx, MATS[mat].name, 24, 52, 36, B, 1, -0.02);
      drawHammer(ctx);
      if (phase === 'down') { ctx.strokeStyle = rgba(B, 0.5); ctx.lineWidth = 1.4; ctx.beginPath(); for (let i = 0; i < 3; i++) { ctx.moveTo(CX - 60 - i * 10, 90 + i * 22); ctx.lineTo(CX - 40 - i * 10, 120 + i * 22); } ctx.stroke(); }
      words.forEach((w) => { const p = clamp(w.t / 0.15, 0, 1), sc = 1 + 0.4 * (1 - p); ctx.save(); ctx.globalAlpha = clamp(1.6 - w.t, 0, 1); ctx.translate(650, 300); ctx.scale(sc, sc); Ink.drawBubble(ctx, w.s, 0, 0, w.s.length > 8 ? 30 : 46, w.col, 1, -0.06, 'center'); ctx.restore(); });
      if (!used) text(ctx, 'tap to hit it!', 610, 110, { size: 26, color: R, rot: -0.04 });
    }

    let anim = false;
    run(root, S, (dt) => {
      anim = false;
      if (phase === 'wind') { pt += dt / 0.1; ang = fromA + (REST + 0.16 - fromA) * Math.min(1, pt); anim = true; if (pt >= 1) { phase = 'down'; pt = 0; fromA = ang; toA = contactAngle(topY()); } }
      else if (phase === 'down') { pt += dt / 0.09; const k = Math.min(1, pt); ang = fromA + (toA - fromA) * k * k; anim = true; if (pt >= 1) { hit(); phase = 'up'; pt = 0; fromA = ang; } }
      else if (phase === 'up') { const bounce = mat === 'rubber'; pt += dt / (bounce ? 0.55 : 0.4); const k = Math.min(1, pt); ang = bounce ? (k < 0.45 ? toA + (REST + 0.3 - toA) * (1 - Math.pow(1 - k / 0.45, 2)) : REST + 0.3 - 0.3 * Math.pow((k - 0.45) / 0.55, 2)) : fromA + (REST - fromA) * (1 - Math.pow(1 - k, 3)); anim = true; if (pt >= 1) { phase = 'rest'; ang = REST; } }
      if (mat === 'rubber' && (Math.abs(st.sq) > 0.002 || Math.abs(st.sqv) > 0.01)) { st.sqv += (-90 * st.sq - 9 * st.sqv) * dt; st.sq += st.sqv * dt; st.sq = Math.max(-0.15, Math.min(1, st.sq)); anim = true; }
      st.shards.forEach((s) => { if (s.rest) return; s.vy += 1500 * dt; s.x += s.vx * dt; s.y += s.vy * dt; s.a += s.va * dt; if (s.y > FLOOR - 4) { s.y = FLOOR - 4; s.vy *= -0.25; s.vx *= 0.5; s.va *= 0.4; if (Math.abs(s.vy) < 40) { s.rest = true; } } anim = true; });
      const pc = st.piece; if (pc && !pc.rest) { pc.vy += 1500 * dt; pc.dx += pc.vx * dt; pc.dy += pc.vy * dt; pc.a += pc.va * dt; if (Y0 + 16 + pc.dy > FLOOR - 24) { pc.dy = FLOOR - 24 - Y0 - 16; if (Math.abs(pc.vy) < 120) { pc.rest = true; Book.sfx('thud', { f: 200, gain: 0.3 }); } pc.vy *= -0.3; pc.vx *= 0.5; pc.va *= 0.3; } anim = true; }
      words.forEach((w) => (w.t += dt)); words = words.filter((w) => w.t < 1.6); if (words.length) anim = true;
      if (anim || S.dirty) { S.dirty = false; render(); }
    });
    const choose = (k) => { mat = k; st = fresh(); phase = 'rest'; ang = REST; words = []; pick.querySelectorAll('.opt').forEach((b) => b.classList.toggle('sel', b.dataset.k === k)); Book.sfx('tock', { gain: 0.4 }); out.innerHTML = done.has(k) ? 'A fresh sample. Hit it again if you like!' : `A fresh piece of ${MATS[k].name.toLowerCase()} in the vice. Tap to hit it!`; S.dirty = true; };
    Object.keys(MATS).forEach((k) => { const b = ui.el('button', 'opt' + (done.has(k) ? ' done' : ''), MATS[k].name, pick); b.type = 'button'; b.dataset.k = k; b.onclick = () => choose(k); });
    pick.querySelector('[data-k="glass"]').classList.add('sel');
    paintStatic();
    if (document.fonts) document.fonts.ready.then(() => { paintStatic(); S.dirty = true; });
  }

  // =====================================================================================
  // Station 3: pull test (ductility / elasticity)
  // =====================================================================================
  function pullStation(ui, root, host, pick, resetBtn) {
    const rec = ui.record('p06.pull', { label: 'Pull test: samples tested (ductility, elasticity)', type: 'experiment', max: 0 });
    const W = 860, Hh = 580, S = stage(host, W, Hh), out = ui.el('div', 'p06-out', 'Pick a test piece, then drag <b>down</b> on the machine to pull it.', host);
    const MX = 220, L0 = 90, GT = 172, HW0 = 10;
    // force (0..1) against stretch s (%). E = elastic slope used when you let go.
    const PULL = {
      copper: { name: 'Copper', E: 0.8, su: 35, sb: 48, f: (s) => s <= 0.3 ? 0.8 * s : s <= 35 ? 0.24 + 0.21 * (1 - Math.pow(1 - (s - 0.3) / 34.7, 2)) : 0.45 - 0.09 * Math.pow((s - 35) / 13, 1.6) },
      rubber: { name: 'Rubber', elastic: true, sb: 1e9, f: (s) => 0.0018 * s + 0.0000045 * s * s },
      steel: { name: 'Mild steel', E: 1.5, su: 18, sb: 26, f: (s) => s <= 0.4 ? 1.5 * s : s <= 18 ? 0.6 + 0.2 * Math.sin((s - 0.4) / 17.6 * Math.PI / 2) : 0.8 - 0.18 * Math.pow((s - 18) / 8, 1.6) },
      castiron: { name: 'Cast iron', E: 1.0, brittle: true, sb: 0.9, f: (s) => s < 0.4 ? s : 0.4 + (s - 0.4) * 0.6 },
      glass: { name: 'Glass', E: 1.2, brittle: true, sb: 0.5, f: (s) => 1.2 * s },
    };
    const prev = rec.get(); const results = new Map((prev && prev.done) || []);
    const curves = {}; // finished curves kept on the graph
    let mat = 'copper', T;
    const fresh = () => ({ s: 0, sMax: 0, F: 0, path: [[0, 0]], broken: false, yb: 0, drag: null, spring: 0, v: 0, back: null, words: [] });
    T = fresh();
    const gx = (s) => 500 + s * (340 / 160), gy = (F) => 470 - F / 0.9 * 400;
    const L = S.layer();

    function machine(x) {
      // columns (lead screws)
      [78, 346].forEach((cx, i) => { const c = [[cx, 70], [cx + 16, 70], [cx + 16, 516], [cx, 516]]; paperFill(x, c); line(x, close(c).slice(0, -1), { w: 2.2, seed: 80 + i });
        x.strokeStyle = rgba(B, 0.45); x.lineWidth = 1; x.beginPath(); for (let y = 76; y < 512; y += 7) { x.moveTo(cx + 1, y); x.lineTo(cx + 15, y + 4); } x.stroke(); });
      // top crosshead
      const top = geo.rect(50, 30, 340, 42, 6); Ink.hatchShadow(x, top, 1, 7, 7, B); paperFill(x, top); Ink.hatchFill(x, top, 1, B, 0.7); line(x, top, { w: 2.8, seed: 82 });
      // load cell
      const lc = geo.rect(MX - 28, 72, 56, 28, 3); paperFill(x, lc); hatch(x, lc, B, 0.35, 4, -1); line(x, lc, { w: 2.2, seed: 83 });
      // base unit + screen
      const base = geo.rect(30, 516, 380, 56, 8); Ink.hatchShadow(x, base, 1, 7, 7, B); paperFill(x, base); Ink.hatchFill(x, base, 1, B, 0.55); line(x, base, { w: 2.8, seed: 84 });
      const scr = geo.rect(212, 524, 186, 40, 5); paperFill(x, scr); line(x, scr, { w: 2, seed: 85 });
      // graph axes
      line(x, [[gx(0), 62], [gx(0), gy(0)], [842, gy(0)]], { w: 2.6, seed: 86 });
      line(x, geo.head([[gx(0), 200], [gx(0), 62]], 13), { w: 2.4, seed: 87 }); line(x, geo.head([[700, gy(0)], [842, gy(0)]], 13), { w: 2.4, seed: 88 });
      text(x, 'force', gx(0) + 12, 70, { size: 22 });
      [0, 50, 100, 150].forEach((v) => { line(x, [[gx(v), gy(0)], [gx(v), gy(0) + 8]], { w: 1.6, seed: 90 + v }); text(x, v + '%', gx(v), gy(0) + 32, { font: 'lab', size: 22, align: 'center', a: 0.85 }); });
      text(x, 'stretch (extension)', 842, gy(0) + 64, { size: 22, align: 'right' });
    }
    function paintStatic() { L.reset(); machine(L.x); }

    // half-width of the test piece at height y (shoulders, fillets, gauge length with necking)
    function profile(s) {
      const m = PULL[mat], ext = s / 100 * L0, ge = GT + L0 + ext, hw = HW0 / Math.sqrt(1 + s / 100);
      let d = 0; if (m.su && s > m.su) d = clamp((s - m.su) / (m.sb - m.su), 0, 1);
      const ym = (GT + ge) / 2;
      const hwAt = (y) => {
        if (y < 160) return 20; if (y < GT) return hw + (20 - hw) * (0.5 + 0.5 * Math.cos((y - 160) / 12 * Math.PI));
        if (y <= ge) return hw * (1 - 0.6 * d * Math.exp(-Math.pow((y - ym) / 11, 2)));
        if (y < ge + 12) return hw + (20 - hw) * (0.5 - 0.5 * Math.cos((y - ge) / 12 * Math.PI));
        return 20;
      };
      return { hwAt, top: 112, bot: ge + 12 + 40, ym, ge, ext };
    }
    function piecePoly(pr, ya, yb, endA, endB) {
      const l = [], r = [];
      for (let y = ya; y < yb; y += 3) { const w = pr.hwAt(y); l.push([MX - w, y]); r.push([MX + w, y]); }
      const wb = pr.hwAt(yb); l.push([MX - wb, yb]); r.push([MX + wb, yb]);
      return (endA || []).concat(r).concat(endB ? endB : []).concat(l.reverse());
    }
    function fracture(pr, y, up) {
      const w = pr.hwAt(y), m = PULL[mat];
      if (m.brittle) { const z = []; for (let i = 0; i <= 6; i++) z.push([MX - w + 2 * w * i / 6, y + (i % 2 ? 2.5 : -2) * (up ? 1 : -1)]); return up ? z.reverse() : z; }
      // ductile cup-and-cone: a pointed / dished end
      return up ? [[MX + w, y], [MX, y + (up ? 4 : -4)], [MX - w, y]] : [[MX - w, y], [MX, y - 4], [MX + w, y]];
    }
    function drawPiece(ctx) {
      const pr = profile(T.s);
      if (!T.broken) {
        const P = piecePoly(pr, pr.top, pr.bot);
        paperFill(ctx, P); fillMat(ctx, mat, P); line(ctx, close(P).slice(0, -1), { w: 2.4, seed: 100 });
      } else {
        const gap = 6;
        const up = piecePoly(pr, pr.top, T.yb - gap, null, fracture(pr, T.yb - gap, true).slice(1, -1));
        const lower = piecePoly(pr, T.yb + gap, pr.bot, fracture(pr, T.yb + gap, false).slice(1, -1), null);
        [up, lower].forEach((P, i) => { paperFill(ctx, P); fillMat(ctx, mat, P); line(ctx, close(P).slice(0, -1), { w: 2.4, seed: 101 + i }); });
      }
      return pr;
    }
    function grips(ctx, ext) {
      // upper wedge grip (fixed)
      const ug = [[MX - 44, 100], [MX + 44, 100], [MX + 36, 166], [MX - 36, 166]];
      const jawL = [[MX - 36, 110], [MX - 20, 110], [MX - 20, 164], [MX - 30, 164]], jawR = [[MX + 20, 110], [MX + 36, 110], [MX + 30, 164], [MX + 20, 164]];
      // lower grip + moving crosshead
      const o = ext, lg = [[MX - 36, 266 + o], [MX + 36, 266 + o], [MX + 44, 334 + o], [MX - 44, 334 + o]];
      const jl2 = [[MX - 30, 268 + o], [MX - 20, 268 + o], [MX - 20, 322 + o], [MX - 36, 322 + o]], jr2 = [[MX + 20, 268 + o], [MX + 30, 268 + o], [MX + 36, 322 + o], [MX + 20, 322 + o]];
      const ch = geo.rect(50, 334 + o, 340, 36, 6);
      [[ug, 110], [lg, 111]].forEach(([P, sd]) => { line(ctx, close(P).slice(0, -1), { w: 2.6, seed: sd }); });
      [jawL, jawR, jl2, jr2].forEach((P, i) => { paperFill(ctx, P); hatch(ctx, P, B, 0.5, 3.5, i % 2 ? -1 : 1); line(ctx, close(P).slice(0, -1), { w: 2, seed: 112 + i }); });
      [ug, lg].forEach((P) => { hatch(ctx, [P[0], [P[0][0] + 10, P[0][1]], [P[3][0] + 6, P[3][1]], P[3]], B, 0.45, 4, 1); hatch(ctx, [[P[1][0] - 10, P[1][1]], P[1], P[2], [P[2][0] - 6, P[2][1]]], B, 0.45, 4, 1); });
      paperFill(ctx, ch); Ink.hatchShadow(ctx, ch, 1, 6, 6, B); paperFill(ctx, ch); hatch(ctx, ch, B, 0.4, 6, 1); line(ctx, ch, { w: 2.6, seed: 120 });
      [78, 346].forEach((cx, i) => { const col = geo.rect(cx - 6, 330 + o, 28, 44, 4); paperFill(ctx, col); line(ctx, col, { w: 2, seed: 121 + i }); });
    }
    function arrow(ctx, x, y0, y1, col, sd) { line(ctx, [[x, y0], [x, y1]], { w: 2.6, color: col, seed: sd }); line(ctx, geo.head([[x, y0], [x, (y0 + y1) / 2], [x, y1]], 13), { w: 2.6, color: col, seed: sd + 1 }); }
    function drawCurve(ctx, path, col, w, sd) {
      if (path.length < 2) return;
      Ink.stroke(ctx, path.map(([s, F]) => [gx(s), gy(F)]), { w, color: col, seed: sd, amp: 0.4 });
    }
    function render() {
      S.begin(); const ctx = S.ctx; S.blit(L);
      const pr = profile(T.s);
      grips(ctx, pr.ext);
      drawPiece(ctx);
      // force arrows (tension)
      if (T.F > 0.004 && !T.broken) { const len = 22 + 90 * T.F; arrow(ctx, 296, pr.ym - 8, pr.ym - 8 - len, R, 130); arrow(ctx, 296, pr.ym + 8, pr.ym + 8 + len, R, 132); text(ctx, 'force', 304, pr.ym + 8, { size: 22, color: R }); }
      // screen
      text(ctx, `stretch ${T.s < 2 && T.s > 0 ? T.s.toFixed(1) : Math.round(T.s)}%`, 305, 553, { font: 'lab', size: 22, align: 'center' });
      if (!T.sMax && !T.drag) { text(ctx, 'drag', 398, 386, { size: 22, color: R }); text(ctx, 'down', 398, 412, { size: 22, color: R }); arrow(ctx, 420, 424, 474, R, 134); }
      // graph
      Object.keys(curves).forEach((k, i) => { if (k === mat) return; const c = curves[k]; drawCurve(ctx, c, B, 1.6, 140 + i); const e = c.reduce((a, p) => (p[0] > a[0] ? p : a), c[0]); const lx = gx(e[0]); text(ctx, PULL[k].name.toLowerCase(), Math.min(780, lx + 8), Math.max(96, gy(e[1]) + (k === 'glass' ? 24 : k === 'castiron' ? -2 : -8)), { size: 22, a: 0.85 }); });
      drawCurve(ctx, T.path, R, 2.4, 150);
      if (!T.broken) { const p = T.path[T.path.length - 1]; ctx.fillStyle = rgba(R, 0.9); ctx.beginPath(); ctx.arc(gx(p[0]), gy(p[1]), 5, 0, 7); ctx.fill(); }
      Ink.drawBubble(ctx, PULL[mat].name, 842, 40, 30, R, 1, -0.02, 'right');
      T.words.forEach((w) => { const p = clamp(w.t / 0.15, 0, 1), sc = 1 + 0.5 * (1 - p); ctx.save(); ctx.globalAlpha = clamp(2 - w.t, 0, 1); ctx.translate(120, T.yb || 230); ctx.scale(sc, sc); Ink.drawBubble(ctx, w.s, 0, 0, 40, R, 1, -0.08, 'center'); ctx.restore(); });
    }

    const pushPt = (s, F) => { const l = T.path[T.path.length - 1]; if (Math.abs(s - l[0]) > 0.25 || Math.abs(F - l[1]) > 0.006) T.path.push([s, F]); };
    function forceAt(s) {
      const m = PULL[mat]; if (m.elastic) return m.f(s);
      return s >= T.sMax ? m.f(s) : Math.max(0, m.f(T.sMax) - m.E * (T.sMax - s));
    }
    function perm() { const m = PULL[mat]; return m.elastic ? 0 : Math.max(0, T.sMax - m.f(T.sMax) / m.E); }
    let creakT = 0;
    function setS(target) {
      const m = PULL[mat];
      target = clamp(target, perm(), 150);
      const steps = Math.max(1, Math.ceil(Math.abs(target - T.s) / 0.25));
      const s0 = T.s;
      for (let i = 1; i <= steps; i++) {
        const s = s0 + (target - s0) * i / steps;
        if (s > T.sMax) T.sMax = s;
        if (s >= m.sb) { breakNow(m.sb); return; }
        T.s = s; T.F = forceAt(s); pushPt(s, T.F);
      }
      const now = performance.now() / 1000;
      if (target > s0 + 0.2 && now - creakT > 0.12) { creakT = now; if (m.elastic) Book.sfx('stroke', { material: 'brush', dur: 0.1, gain: 0.6 }); else Book.sfx('tick', { f: 1800 + T.F * 3000, gain: 0.35 }); }
      if (T.s >= 150 && m.elastic) out.innerHTML = 'Rubber is still going! Now <b>let go</b> and watch.';
      S.dirty = true;
    }
    function breakNow(sb) {
      const m = PULL[mat], F = m.f(sb);
      T.s = sb; T.F = 0; T.sMax = sb; pushPt(sb, F); T.path.push([sb, F]); T.path.push([sb, 0]);
      T.broken = true; T.drag = null;
      const pr = profile(sb); T.yb = m.brittle ? GT + 30 + ((mat.length * 37) % 40) : pr.ym;
      T.words.push({ s: 'SNAP!', t: 0 });
      if (m.brittle) { Book.sfx('impact', { f: 220, gain: 0.6 }); Book.sfx(mat === 'glass' ? 'sparkle' : 'click', { n: 8, gain: 1 }); }
      else { Book.sfx('impact', { gain: 0.7 }); Book.sfx('ding', { f: 'A5', gain: 0.4 }); }
      finish();
    }
    function finish() {
      const m = PULL[mat];
      curves[mat] = T.path.slice();
      let msg, say;
      const sm = Math.round(T.sMax);
      if (T.broken) {
        if (mat === 'copper') { msg = `Copper stretched about <b>${sm}%</b> and <b>necked</b> (went thin in the middle) before it snapped. It is very <b>ductile</b>: perfect for drawing into wire.`; say = `stretched ${sm}%, necked, snapped`; }
        else if (mat === 'steel') { msg = `Mild steel stretched about <b>${sm}%</b>, necked, then snapped. Much less stretch than copper.`; say = `stretched ${sm}%, necked, snapped`; }
        else { msg = `${m.name} snapped <b>almost straight away</b>, with no stretching or necking. It is <b>brittle</b>.`; say = 'snapped straight away'; }
      } else if (m.elastic) { msg = `Rubber stretched <b>${sm}%</b> and sprang right back to its original length: it is <b>elastic</b>.`; say = `stretched ${sm}%, sprang back`; }
      else { const p = Math.round(perm()); msg = `You let go: ${m.name.toLowerCase()} stayed <b>${p}% longer</b>. It didn't spring back, so that stretch is permanent (not elastic). Drag again to keep pulling!`; say = `stretched ${sm}%, stayed ${p}% longer`; }
      out.innerHTML = msg;
      if (T.broken || m.elastic || T.sMax > 2) {
        results.set(mat, say);
        pick.querySelector(`[data-k="${mat}"]`).classList.add('done');
        const list = [...results.entries()];
        rec.set({ answer: `pulled ${list.length}/5: ` + list.map(([k, v]) => `${PULL[k].name.toLowerCase()} (${v})`).join(', '), correct: list.length === 5 ? true : null, done: list });
      }
      S.dirty = true;
    }
    S.c.addEventListener('pointerdown', (e) => {
      e.preventDefault(); if (T.broken) { out.innerHTML = 'That one has snapped! Tap <b>New test piece</b> or pick another material.'; Book.sfx('error', { gain: 0.2 }); return; }
      try { S.c.setPointerCapture(e.pointerId); } catch (_) {}
      const [, y] = S.pos(e); T.drag = { y0: y, s0: T.s }; T.back = null; T.spring = 0; Book.sfx('click', { gain: 0.5 }); S.dirty = true;
    });
    S.c.addEventListener('pointermove', (e) => { if (!T.drag) return; e.preventDefault(); const [, y] = S.pos(e); setS(T.drag.s0 + (y - T.drag.y0) * 1.0); });
    const up = () => {
      if (!T.drag) return; T.drag = null;
      if (T.broken) return;
      if (T.sMax < 0.05) { S.dirty = true; return; }
      const m = PULL[mat];
      if (m.elastic) { T.back = 'spring'; T.v = 0; Book.sfx('jump', { gain: 0.6 }); }
      else { T.back = { from: T.s, to: perm(), t: 0 }; }
    };
    S.c.addEventListener('pointerup', up); S.c.addEventListener('pointercancel', up);

    run(root, S, (dt) => {
      let anim = false;
      if (T.back === 'spring') {
        T.v += (-140 * T.s - 10 * T.v) * dt; let s = T.s + T.v * dt; if (s < 0) { s = 0; T.v = -T.v * 0.25; }
        T.s = s; T.F = PULL[mat].f(s); pushPt(s, T.F); anim = true;
        if (s < 0.3 && Math.abs(T.v) < 4) { T.s = 0; T.F = 0; T.path.push([0, 0]); T.back = null; finish(); }
      } else if (T.back) {
        T.back.t += dt / 0.3; const k = Math.min(1, T.back.t); T.s = T.back.from + (T.back.to - T.back.from) * k; T.F = forceAt(T.s); pushPt(T.s, T.F); anim = true;
        if (k >= 1) { T.back = null; T.F = 0; T.path.push([T.s, 0]); finish(); }
      }
      T.words.forEach((w) => (w.t += dt)); T.words = T.words.filter((w) => w.t < 2); if (T.words.length) anim = true;
      if (anim || S.dirty) { S.dirty = false; render(); }
    });
    const choose = (k) => { mat = k; T = fresh(); pick.querySelectorAll('.opt').forEach((b) => b.classList.toggle('sel', b.dataset.k === k)); Book.sfx('tock', { gain: 0.4 }); out.innerHTML = `A new ${PULL[k].name.toLowerCase()} test piece is in the grips. Drag <b>down</b> to pull.`; S.dirty = true; };
    Object.keys(PULL).forEach((k) => { const b = ui.el('button', 'opt' + (results.has(k) ? ' done' : ''), PULL[k].name, pick); b.type = 'button'; b.dataset.k = k; b.onclick = () => choose(k); });
    resetBtn.onclick = () => choose(mat);
    pick.querySelector('[data-k="copper"]').classList.add('sel');
    paintStatic();
    if (document.fonts) document.fonts.ready.then(() => { paintStatic(); S.dirty = true; });
  }

  // =====================================================================================
  Book.page({
    id: 'p06',
    title: 'The test lab',
    build(ui, root) {
      css();
      ui.h('The test lab');
      ui.p('Time to test some real samples. Use your finger at each of the three stations and <b>watch closely</b>: the questions at the bottom ask what you saw.');

      const station = (n, title, sub) => {
        const d = ui.el('div', 'box p06-st'); requestAnimationFrame(() => Ink.frame(d));
        ui.el('span', 'tag', 'Station ' + n, d); ui.el('h2', '', title, d); ui.el('p', '', sub, d);
        return d;
      };
      const s1 = station(1, 'Scratch test: <span class="key">hardness</span>', 'Drag a steel nail across each sample. The deeper the groove, the <b>softer</b> the material.');
      scratchStation(ui, root, s1);

      const s2 = station(2, 'Hammer test: <span class="key">toughness</span>', 'Pick a sample in the bench vice and tap to hit it with a ball-pein hammer. Does it shatter, crack, dent, spread or bounce?');
      const pk2 = ui.el('div', 'p06-pick', '', s2);
      hammerStation(ui, root, s2, pk2);

      const s3 = station(3, 'Pull test: <span class="key">ductility</span> &amp; <span class="key">elasticity</span>', 'A tensile test machine grips a test piece at both ends and pulls (tension). Drag down to pull, then let go. Watch the live graph.');
      const pk3 = ui.el('div', 'p06-pick', '', s3);
      const rb = ui.el('button', 'btn ghost', '↻ New test piece', null); rb.type = 'button';
      pullStation(ui, root, s3, pk3, rb);
      pk3.appendChild(rb); rb.style.flex = '1 1 160px'; rb.style.minHeight = '48px';

      ui.h('What did you find?', { size: 40 });
      ui.mcq({ id: 'p06.hardest', label: 'Test lab: which sample was hardest?', q: 'Which sample was the <b>hardest</b>, and why?',
        options: [
          { t: 'Glass: the steel nail barely marked it', ok: true, why: 'Yes! Hardness = resisting scratches, wear and dents. The nail barely marked the glass.' },
          { t: 'Mild steel: it survived the hammer without breaking', mis: 'hard-vs-tough', why: 'Surviving the hammer shows steel is TOUGH. Hardness is about resisting scratches and dents: the nail barely marked the glass.' },
          { t: 'Rubber: the nail didn’t leave a groove', why: 'The rubber just squashed out of the way, so it dents very easily: that makes it soft, not hard. The nail barely marked the glass.' },
          { t: 'Copper: it’s a metal, so it must be hard', why: 'The nail left a clear groove in copper, so it is quite soft. The glass was barely marked.' },
        ] });
      ui.mcq({ id: 'p06.toughest', label: 'Test lab: which sample was toughest?', q: 'In the hammer test, which sample was the <b>toughest</b>?',
        options: [
          { t: 'Mild steel: it dented but stayed in one piece', ok: true, why: 'Yes! Toughness = absorbing an impact without breaking or cracking.' },
          { t: 'Glass: it was the hardest to scratch', mis: 'hard-vs-tough', why: 'Glass is hard, but it shattered: it is BRITTLE, the opposite of tough. Hard and tough are different properties.' },
          { t: 'Cast iron: it’s a strong, heavy metal', mis: 'brittle-vs-weak', why: 'Cast iron is strong when squashed, but it cracked and snapped when hit: it is brittle, not tough.' },
        ] });
      ui.mcq({ id: 'p06.ductile', label: 'Test lab: which sample was most ductile?', q: 'Which sample was the most <b>ductile</b>, and what showed it?',
        options: [
          { t: 'Copper: it stretched a long way in the pull test before it snapped', ok: true, why: 'Yes! Ductile = can be stretched (drawn) out into a thin wire under tension. That’s why copper is used for wires.' },
          { t: 'Copper: it spread out flat when I hammered it', mis: 'malleable-vs-ductile', why: 'Right material, wrong reason! Spreading flat under the hammer shows copper is MALLEABLE (shaped by squashing). Ductile is about STRETCHING.' },
          { t: 'Rubber: it stretched the furthest', mis: 'elastic-vs-stretchy', why: 'Rubber stretched but sprang back: that’s ELASTIC. Ductile means it stays stretched out, like a wire.' },
          { t: 'Cast iron: it’s a metal, so it can be pulled into wire', why: 'Cast iron snapped almost straight away: it is brittle, not ductile.' },
        ] });
      ui.mcq({ id: 'p06.elastic', label: 'Test lab: which sample was elastic?', q: 'Which sample was the most <b>elastic</b>?',
        options: [
          { t: 'Rubber: it went back to its original length when I let go', ok: true, why: 'Yes! Elastic = returns to its original shape when the force is removed.' },
          { t: 'Copper: it stretched a really long way before it snapped', mis: 'elastic-vs-stretchy', why: 'Copper stretched a lot, but it STAYED stretched when you let go. Elastic means it springs back to its original shape, like the rubber.' },
          { t: 'Mild steel: it stretched, then necked', why: 'Mild steel stayed stretched (and got thin in the middle): that isn’t elastic. Rubber sprang back.' },
          { t: 'Glass: it didn’t change shape at all', why: 'Glass just snapped: it is brittle. Elastic means it stretches and then springs back, like rubber.' },
        ] });

      ui.box('<b>Glass</b>: very hard, but brittle (shatters). <b>Mild steel</b>: tough (dents, stays in one piece). <b>Copper</b>: malleable (spreads when hammered) and ductile (stretches a long way). <b>Cast iron</b>: brittle (cracks and snaps). <b>Rubber</b>: elastic (springs back).', { tag: 'Lab notes' });
    },
  });
})();
