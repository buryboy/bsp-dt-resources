// Page 3 — Density & absorbency: a float-or-sink tank, a density calculation and a water-drop absorbency test.
(function () {
  'use strict';
  const B = Ink.BLUE, RD = Ink.RED, GR = Ink.GREEN, rgba = Ink.rgba, geo = Ink.geo;
  const HANDF = (s) => `400 ${s}px "Gloria Hallelujah", "Comic Sans MS", cursive`;
  const LABF = (s) => `600 ${s}px Fredoka, "Arial Rounded MT Bold", system-ui, sans-serif`;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const easeIO = (u) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2);

  // ---------- small drawing helpers ----------
  function text(x, s, px, py, o = {}) {
    x.save(); let size = o.size || 22; const f = o.font === 'hand' ? HANDF : LABF; x.font = f(size);
    if (o.max) while (size > (o.min || 16) && x.measureText(s).width > o.max) { size--; x.font = f(size); }
    x.fillStyle = rgba(o.color || B, o.a ?? 0.92); x.textAlign = o.align || 'left'; x.textBaseline = 'alphabetic';
    x.translate(px, py); if (o.rot) x.rotate(o.rot); x.fillText(s, 0, 0); x.restore();
  }
  // a light pen line (cheap, no retrace) for textures and moving things
  function pen(x, pts, o = {}) {
    const P = o.wob === false ? pts : geo.wob(geo.seg(pts, 3), o.seed ?? 11, o.amp ?? 0.6);
    x.save(); x.strokeStyle = rgba(o.color || B, o.a ?? 0.8); x.lineWidth = o.w ?? 1.4; x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath();
    P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); if (o.close) x.closePath(); x.stroke(); x.restore();
  }
  function erase(x, pts, w = 3) { x.save(); x.globalCompositeOperation = 'destination-out'; x.strokeStyle = '#000'; x.lineWidth = w; x.lineCap = 'round'; x.beginPath(); pts.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.stroke(); x.restore(); }
  const close = (P) => P.concat([P[0]]);
  function clipPoly(x, P) { x.beginPath(); P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.closePath(); x.clip(); }
  function grain(x, x0, y0, w, h, n, seed, a = 0.55) {
    const r = H.rng(seed);
    for (let j = 0; j < n; j++) {
      const yy = y0 + (h * (j + 0.5 + r.range(-0.2, 0.2))) / n, amp = r.range(1, 3.2), fq = r.range(0.04, 0.09), ph = r() * 6;
      const pts = []; for (let xx = x0 + 3; xx <= x0 + w - 3; xx += 4) pts.push([xx, yy + Math.sin((xx - x0) * fq + ph) * amp]);
      pen(x, pts, { w: 1.1, a, seed: seed + j * 7 });
    }
  }
  function dots(x, P, n, seed, a = 0.7) {
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; P.forEach(([px, py]) => { x0 = Math.min(x0, px); x1 = Math.max(x1, px); y0 = Math.min(y0, py); y1 = Math.max(y1, py); });
    const r = H.rng(seed); x.save(); clipPoly(x, P); x.fillStyle = rgba(B, a);
    for (let i = 0; i < n; i++) { x.beginPath(); x.arc(r.range(x0, x1), r.range(y0, y1), r.range(0.7, 1.9), 0, 7); x.fill(); }
    x.restore();
  }

  // ---------- an interactive canvas "stage" with an on-demand render loop ----------
  function Stage(ui, W, Hh, o = {}) {
    const wrap = ui.el('div', 'exp'); wrap.style.cssText = 'position:relative;margin:0 0 14px';
    const c = document.createElement('canvas'); wrap.appendChild(c);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = Math.round(W * dpr); c.height = Math.round(Hh * dpr);
    Object.assign(c.style, { width: '100%', height: 'auto', aspectRatio: W + ' / ' + Hh, display: 'block', touchAction: o.touch || 'manipulation', userSelect: 'none', webkitUserSelect: 'none', cursor: 'pointer' });
    const ctx = c.getContext('2d');
    const S = { c, ctx, W, H: Hh, wrap, render: () => false };
    S.pos = (e) => { const r = c.getBoundingClientRect(); return [((e.clientX - r.left) * W) / r.width, ((e.clientY - r.top) * Hh) / r.height]; };
    S.layer = (w, h, paint) => { const L = document.createElement('canvas'); L.width = Math.ceil(w * dpr); L.height = Math.ceil(h * dpr); const x = L.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.lineCap = 'round'; x.lineJoin = 'round'; paint(x); L.w = w; L.h = h; return L; };
    S.blit = (L, px, py, w, h) => ctx.drawImage(L, px, py, w ?? L.w, h ?? L.h);
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
    if (document.fonts) document.fonts.ready.then(() => { S.onFonts && S.onFonts(); S.go(); });
    return S;
  }

  // ======================================================================================
  Book.page({
    id: 'p03',
    title: 'Density & absorbency',
    build(ui) {
      ui.h('Density & absorbency');
      ui.box('<b>Density</b> is the <span class="key">mass per unit volume</span> of a material: how heavy it is <b>for its size</b>.<br><b>density = mass ÷ volume</b>, measured in <b>g/cm³</b>.<br>Water is <b>1.00 g/cm³</b>. Less dense than water → it <b>floats</b>. More dense → it <b>sinks</b>.', { tag: 'Notes' });

      // ---------------------------------------------------------------- 1. Float or sink?
      ui.el('h2', '', 'Experiment 1: float or sink?');
      ui.p('Eight blocks, all <b>exactly the same size</b>. <b>Tap each block</b> to predict FLOAT or SINK. Then tap <b>Test it!</b>');
      const W = 860, HH = 700;
      const S0 = 64, DD = 12, TL = 30, TR = 830, RIM = 246, SURF = 314, BOT = 642, G = 1800;
      const MATS = {
        cork: { n: 'cork', d: 0.24 }, pine: { n: 'pine', d: 0.5 }, oak: { n: 'oak', d: 0.75 }, pp: { n: 'polypropylene', d: 0.9 },
        ebony: { n: 'ebony', d: 1.12 }, acrylic: { n: 'acrylic', d: 1.18 }, al: { n: 'aluminium', d: 2.7 }, steel: { n: 'steel', d: 7.85 },
      };
      const ORDER = ['oak', 'steel', 'cork', 'acrylic', 'pine', 'al', 'ebony', 'pp'];
      const Y0 = 90; // top of each block's front face on the start line
      const blocks = ORDER.map((k, i) => Object.assign({ k, i, cx: TL + 50 + 100 * i, y: Y0, vy: 0, pred: null, st: 'wait', tSplash: 0, landed: false, rest: false }, MATS[k]));
      blocks.forEach((b) => (b.restY = b.d < 1 ? SURF - S0 * (1 - b.d) : BOT - S0));
      const FS = Stage(ui, W, HH);
      const cap = ui.el('p', 'small', 'The numbers under the tank are each block\'s <b>density in g/cm³</b>. Water = 1.00 g/cm³.');
      cap.style.marginTop = '-6px';
      const row = ui.el('div', ''); row.style.cssText = 'display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin:0 0 20px';
      const testBtn = ui.el('button', 'btn', 'Test it! ▸', row); testBtn.disabled = true; testBtn.style.marginTop = '0';
      const hint = ui.el('span', 'small', 'Predict all 8 blocks first.', row);
      const fFb = ui.el('div', 'fb'); fFb.style.marginBottom = 'var(--R)';
      const rFloat = ui.record('p03.float-predict', { label: 'Float/sink predictions (8 blocks)', type: 'experiment', max: 8 });

      // block sprites (drawn once; moving them doesn't make the ink shimmer)
      const M = 6, SPW = S0 + DD + 2 * M;
      function paintBlock(x, k) {
        const fx = M, fy = M + DD, S = S0;
        const front = [[fx, fy], [fx + S, fy], [fx + S, fy + S], [fx, fy + S]];
        const top = [[fx, fy], [fx + DD, fy - DD], [fx + S + DD, fy - DD], [fx + S, fy]];
        const side = [[fx + S, fy], [fx + S + DD, fy - DD], [fx + S + DD, fy + S - DD], [fx + S, fy + S]];
        const wood = { pine: [4, 0.45], oak: [6, 0.6], ebony: [7, 0.7] }[k];
        x.save(); clipPoly(x, front);
        if (k === 'ebony') Ink.hatchFill(x, front, 1, B, 1.9);
        if (k === 'steel') Ink.hatchFill(x, front, 1, B, 1.35);
        if (k === 'al') Ink.hatchFill(x, front, 1, B, 0.55);
        if (k === 'oak') Ink.hatchFill(x, front, 1, B, 0.35);
        x.restore();
        if (wood) grain(x, fx, fy, S, S, wood[0], k.length * 13, wood[1]);
        if (k === 'oak') { const r = H.rng(5); for (let i = 0; i < 6; i++) { const px = fx + r.range(8, S - 12), py = fy + r.range(8, S - 8); pen(x, [[px, py], [px + 7, py + 0.5]], { w: 2, a: 0.7 }); } }
        if (k === 'cork') { dots(x, front, 70, 3, 0.75); dots(x, top, 14, 4, 0.6); }
        if (k === 'pp') { // recycling triangle with a 5
          const cx = fx + S / 2, cy = fy + S / 2 - 4; pen(x, [[cx, cy - 13], [cx + 13, cy + 9], [cx - 13, cy + 9], [cx, cy - 13]], { w: 1.6, a: 0.85 });
          text(x, '5', cx, cy + 6, { size: 13, align: 'center' }); text(x, 'PP', cx, cy + 25, { size: 12, align: 'center' });
        }
        if (k === 'al' || k === 'steel') { erase(x, [[fx + 10, fy + 30], [fx + 30, fy + 10]], 5); erase(x, [[fx + 14, fy + 44], [fx + 44, fy + 14]], 2.5); }
        if (k === 'acrylic') { pen(x, [[fx + 9, fy + 28], [fx + 28, fy + 9]], { w: 2, a: 0.7 }); pen(x, [[fx + 13, fy + 42], [fx + 42, fy + 13]], { w: 1.4, a: 0.55 }); pen(x, [[fx + 40, fy + 56], [fx + 56, fy + 40]], { w: 1.4, a: 0.45 }); }
        // shading: side face hatched, top face lightly for dark materials
        Ink.hatchFill(x, side, 1, B, k === 'ebony' || k === 'steel' ? 1.8 : 1.1);
        if (k === 'ebony' || k === 'steel') Ink.hatchFill(x, top, 1, B, 0.9);
        if (k === 'acrylic') pen(x, [[fx + S + 3, fy - 3], [fx + S + DD - 3, fy - DD + 3]], { w: 1.2, a: 0.5 });
        const ow = 2.1;
        Ink.stroke(x, close(front), { w: ow, seed: 3 + k.length });
        Ink.stroke(x, [[fx, fy], [fx + DD, fy - DD], [fx + S + DD, fy - DD], [fx + S + DD, fy + S - DD], [fx + S, fy + S]], { w: ow, seed: 9 + k.length });
        Ink.stroke(x, [[fx + S, fy], [fx + S + DD, fy - DD]], { w: 1.6, seed: 4 });
      }
      let sprites = {}, stat, tankL, waterL, tagL, tagSetL, tickL, crossL;
      function buildArt() {
        sprites = {}; Object.keys(MATS).forEach((k) => (sprites[k] = FS.layer(SPW, SPW, (x) => paintBlock(x, k))));
        stat = FS.layer(W, HH, (x) => {
          blocks.forEach((b) => text(x, b.n, b.cx, b.i % 2 ? 58 : 30, { size: 22, align: 'center' }));
        });
        tankL = FS.layer(W, HH, (x) => {
          Ink.stroke(x, [[TL, RIM - 6], [TL, BOT + 12], [TR, BOT + 12], [TR, RIM - 6]], { w: 3, seed: 21 });
          pen(x, [[TL + 7, RIM - 4], [TL + 7, BOT], [TR - 7, BOT], [TR - 7, RIM - 4]], { w: 1.4, a: 0.6, seed: 5 });
          Ink.stroke(x, [[TL - 5, RIM - 6], [TR + 5, RIM - 6]], { w: 2.2, seed: 22 });
          const base = [[TL, BOT], [TR, BOT], [TR, BOT + 12], [TL, BOT + 12]];
          Ink.hatchFill(x, base, 1, B, 1.2);
          // glass shine
          // glass shine: kept in the gaps between the block columns so it never crosses a block
          pen(x, [[742, BOT - 96], [730, BOT - 70]], { w: 2, a: 0.45 });
          pen(x, [[126, BOT - 40], [138, BOT - 66]], { w: 1.8, a: 0.4 });
        });
        waterL = FS.layer(W, HH, (x) => {
          const r = H.rng(77);
          for (let i = 0; i < 46; i++) { const px = r.range(TL + 20, TR - 60), py = r.range(SURF + 24, BOT - 14), L = r.range(18, 40); pen(x, [[px, py], [px + L * 0.5, py - 2], [px + L, py]], { w: 1.2, a: 0.3, seed: i }); }
        });
        tagL = FS.layer(96, 52, (x) => pen(x, close([[6, 6], [90, 6], [90, 44], [6, 44]]), { w: 1.4, a: 0.5, amp: 1, seed: 8 }));
        tagSetL = FS.layer(96, 52, (x) => { const P = geo.rect(6, 6, 82, 36, 6); Ink.hatchShadow(x, P, 1, 4, 4); Ink.stroke(x, P, { w: 2.2, seed: 31 }); });
        tickL = FS.layer(46, 40, (x) => Ink.tick(x, 6, 22, 1, GR));
        crossL = FS.layer(40, 40, (x) => Ink.cross(x, 20, 20, 0.9, RD));
      }
      buildArt(); FS.onFonts = buildArt;

      // water surface with ripples from each splash
      let ripples = [], drops = [], run = null, done = false;
      const surfY = (px, t) => {
        let y = SURF + Math.sin(px * 0.035 + t * 1.6) * 1.1;
        for (const r of ripples) { const a = t - r.t0, dx = Math.abs(px - r.x); if (a > 0) y += r.amp * Math.exp(-a * 1.3) * Math.exp(-dx / 170) * Math.sin(dx * 0.085 - a * 9); }
        return y;
      };
      function splash(b, t) {
        const v = Math.abs(b.vy), s = Math.min(1.4, v / 600), r = H.rng(b.i * 9 + 1);
        ripples.push({ x: b.cx, t0: t, amp: 3 + 7 * s });
        for (let i = 0; i < 9; i++) { const side = i % 2 ? 1 : -1; drops.push({ x: b.cx + side * r.range(10, 38), y: SURF - 2, vx: side * r.range(30, 170) * s, vy: -r.range(160, 420) * s, life: 1 }); }
        Book.sfx('slap', { gain: 0.18 + 0.2 * s }); Book.sfx('whoosh', { dur: 0.3, gain: 0.12 * s, top: 1400 });
      }
      function step(b, dt, t) {
        const n = 4, h = dt / n;
        for (let s = 0; s < n; s++) {
          const sub = clamp((b.y + S0 - SURF) / S0);
          // buoyancy + water drag; floaters get strong extra damping and a gentle pull to their float line so they settle in about a second
          const fl = b.d < 1 && b.tSplash;
          let a = G - (sub > 0 ? (G * sub) / b.d + 4.2 * sub * b.vy + 0.004 * sub * b.vy * Math.abs(b.vy) : 0);
          if (fl) a -= 5 * b.vy + 40 * (b.y - b.restY);
          b.vy += a * h; b.y += b.vy * h;
          if (b.y + S0 >= BOT) { b.y = BOT - S0; if (b.vy > 0) b.vy = 0; if (!b.landed) { b.landed = true; b.tLand = t; Book.sfx('thud', { gain: 0.2 + 0.25 * Math.min(1, b.d / 6), f: 150 }); } }
        }
        if (!b.tSplash && b.y + S0 > SURF) { b.tSplash = t; splash(b, t); }
        if (b.d < 1 && b.tSplash) {
          const since = t - b.tSplash;
          if (since > 1.6) { b.y += (b.restY - b.y) * Math.min(1, dt * 8); b.vy *= 0.7; } // ease the last wobble out
          if ((since > 0.8 && Math.abs(b.vy) < 8 && Math.abs(b.y - b.restY) < 1.2) || since > 2.4) { b.y = b.restY; b.vy = 0; b.rest = true; }
        }
        if (b.d > 1 && b.landed) b.rest = true;
      }
      const GAP = 0.85;
      FS.render = (dt, t) => {
        const x = FS.ctx; let busy = false;
        if (run) {
          if (!run.t0) run.t0 = t;
          blocks.forEach((b) => {
            if (b.st === 'wait' && t - run.t0 >= b.i * GAP) { b.st = 'drop'; b.vy = 0; Book.sfx('swish', { gain: 0.2 }); }
            if (b.st === 'drop' && !b.rest) step(b, dt, t);
            if (b.st === 'drop' && !b.shown && b.tSplash && (b.d < 1 ? b.rest || (t - b.tSplash > 0.9 && Math.abs(b.y - b.restY) < 8) : b.landed && t - b.tLand > 0.25)) { b.shown = t; Book.sfx(b.pred === (b.d < 1 ? 'float' : 'sink') ? 'success' : 'error', { gain: 0.12 }); }
          });
          // time cap: whatever the physics is doing, the results always appear
          if (t - run.t0 > 7 * GAP + 4.5) blocks.forEach((b) => { b.st = 'drop'; b.y = b.restY; b.vy = 0; b.rest = true; b.tSplash = b.tSplash || t; if (!b.shown) b.shown = t; });
          if (blocks.every((b) => b.rest && b.shown)) { run = null; finish(); } else busy = true;
        }
        ripples = ripples.filter((r) => t - r.t0 < 3.5); if (ripples.length) busy = true;
        drops.forEach((d) => { d.vy += G * 0.6 * dt; d.x += d.vx * dt; d.y += d.vy * dt; if (d.y > SURF + 2 && d.vy > 0) d.life = 0; });
        drops = drops.filter((d) => d.life > 0); if (drops.length) busy = true;

        FS.blit(stat, 0, 0);
        // tags (predictions) + verdicts
        blocks.forEach((b) => {
          FS.blit(b.pred ? tagSetL : tagL, b.cx - 48, 164);
          if (b.pred) text(x, b.pred === 'float' ? 'FLOAT' : 'SINK', b.cx - 2, 199, { size: 22, align: 'center' });
          else text(x, 'tap', b.cx, 197, { size: 20, align: 'center', a: 0.45, font: 'hand' });
          if (b.shown) {
            const ok = b.pred === (b.d < 1 ? 'float' : 'sink');
            FS.blit(ok ? tickL : crossL, b.cx + 26, 148);
            if (!ok) text(x, b.d < 1 ? 'floats!' : 'sinks!', b.cx, 234, { size: 20, align: 'center', color: RD, font: 'hand' });
            text(x, b.d.toFixed(2), b.cx, 684, { size: 24, align: 'center', color: ok ? B : RD });
          }
        });
        // blocks
        blocks.forEach((b) => FS.blit(sprites[b.k], b.cx - SPW / 2, b.y - DD - M));
        // water: tint under the live surface, then the static wave marks
        const SP = []; for (let px = TL + 7; px <= TR - 7; px += 8) SP.push([px, surfY(px, t)]);
        x.save(); x.beginPath(); SP.forEach(([a, c], i) => (i ? x.lineTo(a, c) : x.moveTo(a, c))); x.lineTo(TR - 7, BOT); x.lineTo(TL + 7, BOT); x.closePath();
        x.fillStyle = 'rgba(150,175,235,0.22)'; x.fill(); x.restore();
        FS.blit(waterL, 0, 0);
        pen(x, SP, { wob: false, w: 2.4, a: 0.85 });
        pen(x, SP.map(([a, c]) => [a, c + 4]).filter((_, i) => i % 3 !== 1), { wob: false, w: 1, a: 0.3 });
        // splash droplets
        x.save(); x.strokeStyle = rgba(B, 0.85); x.lineWidth = 2.2; x.lineCap = 'round';
        drops.forEach((d) => { x.beginPath(); x.moveTo(d.x, d.y); x.lineTo(d.x - d.vx * 0.02, d.y - d.vy * 0.02); x.stroke(); });
        x.restore();
        FS.blit(tankL, 0, 0);
        return busy;
      };

      const correctOf = (b) => (b.d < 1 ? 'float' : 'sink');
      function refreshBtn() {
        const n = blocks.filter((b) => b.pred).length;
        if (!done && !run) { testBtn.disabled = n < 8; hint.textContent = n < 8 ? `Predict all 8 blocks first (${n}/8).` : 'Ready? Drop them in!'; }
      }
      FS.c.addEventListener('click', (e) => {
        if (done || run) return;
        const [px, py] = FS.pos(e); if (py < 10 || py > 225) return;
        const b = blocks[Math.floor((px - TL) / 100)]; if (!b) return;
        b.pred = b.pred === 'float' ? 'sink' : 'float'; Book.sfx('tick', { gain: 0.5 }); Book.scribble(0.12);
        refreshBtn(); FS.go();
      });
      function startRun() {
        blocks.forEach((b) => Object.assign(b, { y: Y0, vy: 0, st: 'wait', tSplash: 0, landed: false, rest: false, shown: 0 }));
        ripples = []; drops = []; run = { t0: 0 }; testBtn.disabled = true; hint.textContent = 'Watch the tank…'; FS.go();
      }
      function score() {
        let sc = 0; const ans = [], mis = new Set();
        blocks.forEach((b) => {
          const ok = b.pred === correctOf(b); if (ok) sc++;
          ans.push(`${b.n}: ${b.pred} ${ok ? '✓' : '✗'}`);
          if (!ok && (['oak', 'pine', 'cork', 'pp'].includes(b.k) || b.k === 'al')) mis.add('density-vs-weight');
        });
        return { sc, ans: ans.join(', '), mis: [...mis].join(',') };
      }
      testBtn.onclick = () => {
        if (!done && blocks.some((b) => !b.pred)) return;
        if (!done && !rFloat.get()?.preds) {
          const s = score();
          rFloat.set({ answer: s.ans, correct: s.sc === 8, score: s.sc, max: 8, mis: s.mis, preds: blocks.map((b) => b.pred) });
        }
        startRun();
      };
      function finish() {
        done = true; testBtn.disabled = false; testBtn.textContent = '↻ Drop them again'; hint.textContent = '';
        const s = score(), wrong = blocks.filter((b) => b.pred !== correctOf(b));
        const why = wrong.map((b) => `✗ <b>${b.n}</b> (${b.d.toFixed(2)} g/cm³) ${b.d < 1 ? 'floats: it is <b>less</b> dense than water' : 'sinks: it is <b>more</b> dense than water'}${b.k === 'ebony' ? '. Not every wood floats!' : b.k === 'al' ? '. Aluminium feels light, but it is 2.7 times denser than water.' : '.'}`).join('<br>');
        fFb.className = 'fb on ' + (s.sc === 8 ? 'good' : 'bad');
        fFb.innerHTML = `<b>${s.sc}/8 predictions right.</b>${s.sc === 8 ? ' ✓ Brilliant!' : ''}<br>${why}${why ? '<br>' : ''}<span style="color:var(--ink)">Remember: a huge oak log is heavy but still floats. <span class="key">Density is mass for its SIZE</span>, not how heavy the whole thing is.</span>`;
        FS.go();
      }
      // returning to the page after a reload: show the saved result
      const prev = rFloat.get();
      if (prev && prev.preds) {
        blocks.forEach((b, i) => Object.assign(b, { pred: prev.preds[i], st: 'drop', y: b.restY, rest: true, shown: 1, tSplash: 1 }));
        finish();
      }
      refreshBtn(); FS.go();

      // ---------------------------------------------------------------- 2. Calculate a density
      ui.el('h2', '', 'Work it out');
      ui.anim({
        w: 860, h: 250, duration: 6, poster: 6,
        draw(k) {
          // digital scales
          k.box(250, 182, 300, 50, 0.1, 1.0, { w: 2.8 });
          k.line([[230, 182], [570, 182]], 0.9, 1.3, { w: 3 });
          k.box(395, 194, 120, 30, 1.2, 1.6, { w: 2, shadow: false, radius: 4 });
          k.text('21.6 g', 455, 218, 1.6, 2.2, { size: 22, align: 'center' });
          k.text('mass', 330, 216, 1.6, 2.0, { size: 20 });
          // the cube (2 cm each side)
          const fx = 345, fy = 92, s = 90, d = 24;
          k.hatch([[fx + s, fy], [fx + s + d, fy - d], [fx + s + d, fy + s - d], [fx + s, fy + s]], 2.2, 2.8);
          k.line([[fx, fy], [fx + s, fy], [fx + s, fy + s], [fx, fy + s], [fx, fy]], 2.0, 2.6, { w: 2.6 });
          k.line([[fx, fy], [fx + d, fy - d], [fx + s + d, fy - d], [fx + s + d, fy + s - d], [fx + s, fy + s]], 2.5, 2.9, { w: 2.6 });
          k.line([[fx + s, fy], [fx + s + d, fy - d]], 2.8, 2.9, { w: 2 });
          // dimension arrows
          const dim = (P, lab, lx, ly, a) => { k.arrow(P, a, a + 0.4, { w: 1.8, head: 10 }); k.arrow(P.slice().reverse(), a, a + 0.4, { w: 1.8, head: 10 }); k.text(lab, lx, ly, a + 0.3, a + 0.7, { size: 22, align: 'center', color: Ink.RED }); };
          dim([[fx - 22, fy], [fx - 22, fy + s]], '2 cm', fx - 62, fy + s / 2 + 8, 3.0);
          dim([[fx + 4, fy - d - 14], [fx + s + 4, fy - d - 14]], '2 cm', fx + 30, fy - d - 26, 3.6);
          dim([[fx + s + 14, fy + s + 2], [fx + s + d + 14, fy + s - d + 2]], '2 cm', fx + s + d + 50, fy + s - 6, 4.2);
          k.text('volume = 2 × 2 × 2', 640, 110, 4.8, 5.6, { size: 22 });
        },
        sound(k) { k.play('stroke', 0.1, { material: 'pen', dur: 1.4, gain: 0.45 }); k.play('stroke', 2, { material: 'pen', dur: 1, gain: 0.45 }); [3, 3.6, 4.2].forEach((a) => k.play('stroke', a, { material: 'pen', dur: 0.4, gain: 0.4 })); k.play('stroke', 4.8, { material: 'pen', dur: 0.8, gain: 0.4 }); },
      });
      ui.fill({
        id: 'p03.calc', label: 'Density calculation: 2 cm cube, 21.6 g',
        q: '<b>Calculate:</b> a block is <b>2 cm × 2 cm × 2 cm</b> and has a mass of <b>21.6 g</b>.',
        html: 'Volume = 2 × 2 × 2 = {{8|8.0}} cm³<br>Density = mass ÷ volume = 21.6 ÷ 8 = {{2.7|2.70}} g/cm³<br>Use the numbers under the tank: the block is made of {{aluminium|aluminum}}.',
        explain: '21.6 ÷ 8 = <b>2.7 g/cm³</b>, the density of <b>aluminium</b>. It is more than 1.00, so it sinks.',
      });

      // ---------------------------------------------------------------- 3. Absorbency drip test
      ui.el('h2', '', 'Experiment 2: the drip test');
      ui.box('<b>Absorbency</b> is how well a material <span class="key">soaks up moisture</span> (liquid). Paper, cotton, untreated softwood and MDF edges are very absorbent. Acrylic, glass, metals and polypropylene are not.', { tag: 'Notes' });
      ui.p('<b>Tap each sample</b> to drip a drop of water on it. Does it <b>soak in</b> or <b>bead up</b>?');
      const DW = 860, DH = 470, BENCH = 342;
      const SAMP = [
        { k: 'towel', n: ['paper towel'], abs: true, th: 7, dur: 0.9, R: 60 },
        { k: 'pine', n: ['untreated', 'pine'], abs: true, th: 36, dur: 2.6, R: 34 },
        { k: 'mdf', n: ['MDF', 'edge'], abs: true, th: 70, dur: 1.5, R: 46, edge: true },
        { k: 'acrylic', n: ['acrylic'], abs: false, th: 12 },
        { k: 'varn', n: ['varnished', 'pine'], abs: false, th: 36 },
      ];
      SAMP.forEach((s, i) => {
        s.i = i; s.cx = 86 + 172 * i; s.sy = BENCH - s.th; const dep = s.edge ? 12 : 26, sh = s.edge ? 9 : 18;
        s.top = [[s.cx - 66, s.sy], [s.cx + 56, s.sy], [s.cx + 56 + sh, s.sy - dep], [s.cx - 66 + sh, s.sy - dep]];
        s.front = [[s.cx - 66, s.sy], [s.cx + 56, s.sy], [s.cx + 56, BENCH], [s.cx - 66, BENCH]];
        s.lx = s.cx - 5 + sh / 2; s.ly = s.sy - dep / 2; s.t = 0; s.result = '';
      });
      const DS = Stage(ui, DW, DH);
      const rDrip = ui.record('p03.drip', { label: 'Drip test: samples tested', type: 'explore', max: 0 });
      function paintSample(x, s) {
        const { cx, sy, top, front } = s;
        if (s.k === 'towel') {
          // three soft sheets with a quilted dimple pattern
          for (let j = 0; j < 3; j++) pen(x, [[cx - 68, sy + 2 + j * 2.4], [cx - 30, sy + 3.2 + j * 2.4], [cx + 10, sy + 1.6 + j * 2.4], [cx + 58, sy + 2.8 + j * 2.4]], { w: 1.4, a: 0.75, seed: j + 2 });
          x.save(); clipPoly(x, top); x.fillStyle = rgba(B, 0.55);
          for (let r = 0; r < 4; r++) for (let c = 0; c < 12; c++) { const px = cx - 62 + c * 11 + r * 4.5 + 3, py = sy - 4 - r * 5.6; x.beginPath(); x.ellipse(px, py, 1.6, 0.9, 0, 0, 7); x.fill(); }
          x.restore();
          Ink.stroke(x, close(top), { w: 1.8, seed: 41, amp: 1.4 });
        } else {
          x.save(); clipPoly(x, front);
          if (s.k === 'pine' || s.k === 'varn') { grain(x, cx - 66, sy, 122, s.th, 4, 7 + s.i, 0.5); }
          if (s.k === 'mdf') { Ink.hatchFill(x, front, 1, B, 0.45); dots(x, front, 140, 12, 0.35); }
          x.restore();
          x.save(); clipPoly(x, top);
          if (s.k === 'pine' || s.k === 'varn') grain(x, top[0][0], top[3][1], 140, 26, 4, 19 + s.i, 0.5);
          if (s.k === 'mdf') dots(x, top, 70, 15, 0.75);
          x.restore();
          const side = [[top[1][0], top[1][1]], [top[2][0], top[2][1]], [top[2][0], BENCH - (top[1][1] - top[2][1])], [top[1][0], BENCH]];
          Ink.hatchFill(x, side, 1, B, s.k === 'acrylic' ? 0.5 : 1.1);
          if (s.k === 'acrylic') { pen(x, [[cx - 40, sy - 4], [cx - 22, sy - 20]], { w: 2, a: 0.6 }); pen(x, [[cx - 26, sy - 3], [cx - 12, sy - 15]], { w: 1.4, a: 0.5 }); pen(x, [[cx + 24, sy - 6], [cx + 36, sy - 18]], { w: 1.4, a: 0.45 }); }
          if (s.k === 'varn') { pen(x, [[cx - 44, sy - 6], [cx - 14, sy - 20]], { w: 2.4, a: 0.65 }); pen(x, [[cx - 30, sy - 4], [cx - 12, sy - 12]], { w: 1.5, a: 0.5 }); erase(x, [[cx + 14, sy - 8], [cx + 40, sy - 20]], 3); }
          Ink.stroke(x, close(front), { w: 2.2, seed: 50 + s.i });
          Ink.stroke(x, [top[0], top[3], top[2], [top[2][0], BENCH - (top[1][1] - top[2][1])]], { w: 2.2, seed: 60 + s.i });
          Ink.stroke(x, [top[1], top[2]], { w: 1.6, seed: 70 + s.i });
        }
        text(x, s.n[0], cx, 386, { size: 22, align: 'center', max: 166 }); if (s.n[1]) text(x, s.n[1], cx, 412, { size: 22, align: 'center' });
      }
      let dStat, pipL, stainL = {};
      const blob = (rx, ry, seed) => { const r = H.rng(seed), P = []; for (let i = 0; i < 28; i++) { const a = (i / 28) * Math.PI * 2, f = 0.82 + 0.18 * Math.sin(a * 3 + r() * 2) + r.range(-0.06, 0.06); P.push([Math.cos(a) * rx * f, Math.sin(a) * ry * f]); } return P; };
      function buildDrip() {
        dStat = DS.layer(DW, DH, (x) => {
          Ink.stroke(x, [[8, BENCH], [DW - 8, BENCH]], { w: 2.6, seed: 80 });
          Ink.hatchFill(x, [[8, BENCH], [DW - 8, BENCH], [DW - 8, BENCH + 12], [8, BENCH + 12]], 1, B, 0.9);
          SAMP.forEach((s) => paintSample(x, s));
        });
        pipL = DS.layer(70, 200, (x) => {
          const cx = 35; const bulb = geo.ellipse(cx, 44, 21, 32, 0, Math.PI * 2);
          Ink.hatchFill(x, bulb, 1, B, 1.6); erase(x, [[cx - 11, 30], [cx - 7, 52]], 4);
          Ink.stroke(x, close(bulb), { w: 2.4, seed: 90 });
          const glass = [[cx - 9, 78], [cx + 9, 78], [cx + 9, 152], [cx + 2.5, 184], [cx - 2.5, 184], [cx - 9, 152]];
          x.save(); clipPoly(x, glass); x.fillStyle = 'rgba(150,175,235,0.35)'; x.fillRect(cx - 10, 120, 20, 70); x.restore();
          pen(x, [[cx - 9, 120], [cx + 9, 120]], { w: 1.4, a: 0.7 });
          Ink.stroke(x, close(glass), { w: 2, seed: 91 });
          Ink.hatchFill(x, [[cx - 13, 70], [cx + 13, 70], [cx + 13, 80], [cx - 13, 80]], 1, B, 1.4);
          Ink.stroke(x, close([[cx - 13, 70], [cx + 13, 70], [cx + 13, 80], [cx - 13, 80]]), { w: 1.8, seed: 92 });
          pen(x, [[cx - 4, 90], [cx - 4, 140]], { w: 1.6, a: 0.45 });
        });
        SAMP.forEach((s) => { if (!s.abs) return; const rx = s.R, ry = s.R * (s.edge ? 0.14 : 0.32); stainL[s.k] = DS.layer(rx * 2 + 8, ry * 2 + 8, (x) => { const P = blob(rx, ry, s.i + 3).map(([a, b]) => [a + rx + 4, b + ry + 4]); x.fillStyle = 'rgba(120,140,215,0.28)'; x.beginPath(); P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.fill(); Ink.hatchFill(x, P, 1, B, 1.3); pen(x, close(P), { w: 1.2, a: 0.55, wob: false }); }); });
        stainL.mdfFront = DS.layer(80, 64, (x) => { const P = blob(34, 28, 12).map(([a, b]) => [a + 40, b + 4]); x.fillStyle = 'rgba(120,140,215,0.25)'; x.beginPath(); P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.fill(); Ink.hatchFill(x, P, 1, B, 1.1); });
      }
      buildDrip(); DS.onFonts = buildDrip;
      let pip = { x: 430, tx: 430, phase: 'idle', t: 0, target: null, dy: 0 }, queue = null;
      function drawBead(x, px, py, rx, ry) {
        if (rx < 0.6) return;
        x.save(); x.beginPath(); x.moveTo(px - rx, py); x.bezierCurveTo(px - rx, py - ry * 1.3, px + rx, py - ry * 1.3, px + rx, py); x.closePath();
        x.fillStyle = 'rgba(140,165,235,0.45)'; x.fill(); x.strokeStyle = rgba(B, 0.9); x.lineWidth = 2; x.stroke();
        x.globalCompositeOperation = 'destination-out'; x.lineWidth = Math.max(1, rx * 0.18); x.beginPath(); x.arc(px - rx * 0.25, py - ry * 0.55, rx * 0.35, Math.PI * 1.1, Math.PI * 1.6); x.stroke();
        x.restore();
      }
      DS.render = (dt, t) => {
        const x = DS.ctx; let busy = false;
        // pipette state machine: move -> squeeze a drop -> fall -> land
        if (pip.phase === 'idle' && queue) { pip.target = queue; queue = null; pip.tx = pip.target.lx; pip.phase = 'move'; }
        if (pip.phase === 'move') { const d = pip.tx - pip.x; pip.x += Math.sign(d) * Math.min(Math.abs(d), 900 * dt); if (Math.abs(d) < 0.5) { pip.phase = 'form'; pip.t = t; Book.sfx('tick', { gain: 0.3, f: 2400 }); } busy = true; }
        let dropR = 0;
        if (pip.phase === 'form') { dropR = 7 * clamp((t - pip.t) / 0.4); if (t - pip.t > 0.45) { pip.phase = 'fall'; pip.dy = 0; pip.vy = 0; } busy = true; }
        if (pip.phase === 'fall') {
          pip.vy += 1600 * dt; pip.dy += pip.vy * dt; busy = true; const s = pip.target;
          if (204 + pip.dy >= s.ly) {
            s.t = t; pip.phase = 'idle'; Book.sfx('pop', { f: s.abs ? 380 : 900, gain: 0.25 });
            const tested = SAMP.filter((q) => q.t);
            rDrip.set({ answer: tested.map((q) => `${q.n.join(' ')}: ${q.abs ? 'soaks in' : 'beads up'}`).join('; ') + ` (${tested.length}/5 tested)`, correct: null, score: null, max: 0 });
          }
        }
        DS.blit(dStat, 0, 0);
        SAMP.forEach((s) => {
          if (!s.t) return; const a = t - s.t;
          if (s.abs) {
            const u = clamp(a / s.dur), g = Math.sqrt(easeIO(u)); const L = stainL[s.k];
            x.save(); clipPoly(x, s.top); const sc = 0.15 + 0.85 * g; x.drawImage(L, s.lx - (L.w / 2) * sc, s.ly - (L.h / 2) * sc, L.w * sc, L.h * sc); x.restore();
            if (s.edge) { const F = stainL.mdfFront; x.save(); clipPoly(x, s.front); const k2 = clamp((a - 0.2) / s.dur); x.globalAlpha = k2; x.drawImage(F, s.lx - 40 * (0.4 + 0.6 * k2), s.sy - 2, 80 * (0.4 + 0.6 * k2), 64 * k2); x.restore(); x.globalAlpha = 1;
              if (u > 0.4) { const sw = clamp((u - 0.4) / 0.6) * 3.5, P = []; for (let px = s.lx - 34; px <= s.lx + 34; px += 3) P.push([px, s.sy - 12 - sw * (0.6 + 0.4 * Math.sin(px * 0.5)) * Math.cos(((px - s.lx) / 34) * 1.4)]); pen(x, P, { w: 1.5, a: 0.8, wob: false }); } }
            const sz = 1 - easeIO(clamp(a / (s.dur * 0.8)));
            drawBead(x, s.lx, s.ly, 13 * sz, 9 * sz);
            if (a < s.dur + 0.4) busy = true;
            if (a > s.dur * 0.8) text(x, s.edge ? 'soaks in & swells!' : 'soaks in!', s.cx, 450, { size: 22, align: 'center', color: RD, font: 'hand', max: 166 });
          } else {
            const e = Math.exp(-a * 7) * Math.cos(a * 28);
            drawBead(x, s.lx, s.ly, 13 + 5 * e, 9.5 - 3.5 * e); if (a < 0.8) busy = true;
            if (a > 0.6) text(x, 'beads up!', s.cx, 450, { size: 22, align: 'center', color: GR, font: 'hand' });
          }
        });
        // the dropper
        const py = pip.phase === 'form' ? -2 : 0;
        DS.blit(pipL, pip.x - 35, 10 + py);
        if (dropR > 0) drawBead(x, pip.x, 196 + dropR * 1.6, dropR, dropR * 1.6);
        if (pip.phase === 'fall') { const yy = 204 + pip.dy; x.save(); x.beginPath(); x.moveTo(pip.x, yy - 16); x.quadraticCurveTo(pip.x + 8, yy - 2, pip.x, yy + 2); x.quadraticCurveTo(pip.x - 8, yy - 2, pip.x, yy - 16); x.fillStyle = 'rgba(140,165,235,0.5)'; x.fill(); x.strokeStyle = rgba(B, 0.9); x.lineWidth = 2; x.stroke(); x.restore(); }
        if (!SAMP.some((s) => s.t) && pip.phase === 'idle') text(x, 'tap a sample ↓', 470, 120, { size: 22, font: 'hand', a: 0.6 });
        return busy;
      };
      DS.c.addEventListener('click', (e) => {
        const [px, py] = DS.pos(e); if (py < 150) return;
        const s = SAMP[Math.floor((px - 0) / 172)]; if (!s) return;
        if (pip.phase !== 'idle' && pip.target === s) return;
        s.t = 0; queue = s; Book.sfx('tick', { gain: 0.4 }); DS.go();
      });
      DS.go();

      ui.mcq({
        id: 'p03.absorb', label: 'Why is outdoor timber painted or varnished?',
        q: 'A garden shed is made from pine. <b>Why is it painted or varnished?</b>',
        options: [
          { t: 'The finish reduces absorbency, so the wood can\'t soak up rain, swell and rot', ok: true, why: 'Yes! Just like the varnished pine in the drip test: the water beads up instead of soaking in.' },
          { t: 'Just for colour: absorbency only matters for paper and fabrics', mis: 'absorbency', why: 'The untreated pine soaked up the drop. Wet timber outdoors swells and rots, so absorbency really matters for wood.' },
          { t: 'The finish makes the wood more absorbent, so rain soaks in and dries faster', mis: 'absorbency', why: 'It\'s the opposite: a finish reduces absorbency. Look how the drop beaded up on the varnished pine.' },
          { t: 'The paint makes the timber denser, so it is stronger', mis: 'density-vs-weight', why: 'A thin coat of paint doesn\'t change the density of the wood. It seals the surface so water can\'t soak in.' },
        ],
        explain: 'Paint, varnish and preservative <b>reduce absorbency</b>. That stops outdoor timber swelling and rotting.',
      });
    },
  });
})();
