// Page 4 — Heat, electricity & melting: wax-and-pin race, a conductivity tester circuit and a melting-point furnace.
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
  function pen(x, pts, o = {}) {
    const P = o.wob === false ? pts : geo.wob(geo.seg(pts, 3), o.seed ?? 11, o.amp ?? 0.6);
    x.save(); x.strokeStyle = rgba(o.color || B, o.a ?? 0.8); x.lineWidth = o.w ?? 1.4; x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath();
    P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); if (o.close) x.closePath(); x.stroke(); x.restore();
  }
  function erase(x, pts, w = 3) { x.save(); x.globalCompositeOperation = 'destination-out'; x.strokeStyle = '#000'; x.lineWidth = w; x.lineCap = 'round'; x.beginPath(); pts.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.stroke(); x.restore(); }
  const close = (P) => P.concat([P[0]]);
  const box = (x0, y0, w, h) => [[x0, y0], [x0 + w, y0], [x0 + w, y0 + h], [x0, y0 + h]];
  function clipPoly(x, P) { x.beginPath(); P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.closePath(); x.clip(); }
  function fillPoly(x, P, style) { x.save(); x.fillStyle = style; x.beginPath(); P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.closePath(); x.fill(); x.restore(); }
  function grain(x, x0, y0, w, h, n, seed, a = 0.55) {
    const r = H.rng(seed);
    for (let j = 0; j < n; j++) {
      const yy = y0 + (h * (j + 0.5 + r.range(-0.2, 0.2))) / n, amp = r.range(0.5, 1.6), fq = r.range(0.03, 0.07), ph = r() * 6;
      const pts = []; for (let xx = x0 + 3; xx <= x0 + w - 3; xx += 5) pts.push([xx, yy + Math.sin((xx - x0) * fq + ph) * amp]);
      pen(x, pts, { w: 1.1, a, seed: seed + j * 7 });
    }
  }
  // texture for a bar of material inside polygon P (used by rods, strips and ingots)
  function matFill(x, k, P, seed = 1) {
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; P.forEach(([a, b]) => { x0 = Math.min(x0, a); x1 = Math.max(x1, a); y0 = Math.min(y0, b); y1 = Math.max(y1, b); });
    const w = x1 - x0, h = y1 - y0; x.save(); clipPoly(x, P);
    if (k === 'copper') { Ink.hatchFill(x, P, 1, B, 1.0); erase(x, [[x0 + 4, y0 + h * 0.3], [x1 - 4, y0 + h * 0.3]], Math.max(1.5, h * 0.14)); }
    if (k === 'steel') { Ink.hatchFill(x, P, 1, B, 1.8); erase(x, [[x0 + 4, y0 + h * 0.28], [x1 - 4, y0 + h * 0.28]], Math.max(1.2, h * 0.1)); }
    if (k === 'aluminium') { Ink.hatchFill(x, P, 1, B, 0.5); erase(x, [[x0 + 4, y0 + h * 0.3], [x1 - 4, y0 + h * 0.3]], Math.max(1.5, h * 0.16)); }
    if (k === 'wood') grain(x, x0, y0, w, h, Math.max(2, Math.round(h / 5)), 31 + seed, 0.6);
    if (k === 'glass' || k === 'acrylic') { for (let i = 0; i < Math.max(2, w / 70); i++) { const px = x0 + 14 + i * 64 + (k === 'acrylic' ? 20 : 0); pen(x, [[px, y1 - 2], [px + h * 0.9, y0 + 2]], { w: 1.3, a: 0.5 }); pen(x, [[px + 7, y1 - 2], [px + 7 + h * 0.9, y0 + 2]], { w: 1, a: 0.35 }); } }
    if (k === 'solder') Ink.hatchFill(x, P, 1, B, 0.8);
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
  const frameAct = (d) => requestAnimationFrame(() => Ink.frame(d, { shadow: false, w: 2.2 }));

  // ======================================================================================
  Book.page({
    id: 'p04',
    title: 'Heat, electricity & melting',
    build(ui) {
      ui.h('Heat, electricity & melting');
      ui.p('Three more <b>physical properties</b>, and three experiments to test them.');

      // ================================================================ 1. WAX-AND-PIN RACE
      ui.el('h2', '', 'Experiment 1: the wax-and-pin race');
      ui.p('Five rods poke out of a tank of water. <b>Drawing pins</b> are stuck along each rod with blobs of <b>wax</b>. A Bunsen flame heats the tank, so one end of every rod gets hot. When heat reaches a pin, the wax melts and the pin drops.');
      const RODS = [
        { k: 'steel', n: 'steel', kv: '≈50', c: 50 }, { k: 'glass', n: 'glass', kv: '≈1', c: 1 }, { k: 'copper', n: 'copper', kv: '≈400', c: 400 },
        { k: 'wood', n: 'wood', kv: '≈0.15', c: 0.15 }, { k: 'aluminium', n: 'aluminium', kv: '≈205', c: 205 },
      ];
      // prediction
      const rRace = ui.record('p04.race-predict', { label: 'Wax-and-pin race: predicted fastest and slowest rod', type: 'predict+check', max: 2 });
      const pa = ui.el('div', 'act'); pa.dataset.id = 'p04.race-predict'; frameAct(pa);
      const pick = { first: null, last: null };
      const mkRow = (key, q) => {
        ui.el('div', 'q', q, pa); const r = ui.el('div', 'opts', '', pa); r.style.cssText = 'grid-template-columns:repeat(auto-fit,minmax(120px,1fr));margin-bottom:12px';
        RODS.forEach((rd) => { const b = ui.el('button', 'opt', rd.n, r); b.type = 'button'; b.style.textAlign = 'center';
          b.onclick = () => { if (race.st !== 'idle') return; r.querySelectorAll('.opt').forEach((o) => o.classList.remove('sel')); b.classList.add('sel'); pick[key] = rd.k; Book.scribble(0.12); upd(); }; });
        return r;
      };
      const rowA = mkRow('first', '<b>Predict:</b> which rod will drop its pins <b>first</b>?');
      const rowB = mkRow('last', 'Which rod will heat up the <b>slowest</b>?');
      const goBtn = ui.el('button', 'btn', 'Light the Bunsen burner ▸', pa); goBtn.disabled = true; goBtn.style.marginTop = '0';

      const W = 860, RH = 610, TX0 = 40, TX1 = 138, X0 = 138, X1 = 690, LEN = X1 - X0, PF = [0.18, 0.38, 0.58, 0.78], DUR = 13.5;
      RODS.forEach((r, j) => {
        r.y = 96 + j * 82; r.rad = r.k === 'wood' ? 8 : 6; r.a = 0.224 * Math.pow(r.c / 400, 0.5);
        r.pins = PF.map((f, i) => ({ f, x: X0 + f * LEN, melt: 0, st: 'on', dy: 0, vy: 0, rot: 0, i }));
        r.first = 0; r.rank = 0;
      });
      const front = (r, t) => Math.min(1, r.a * Math.pow(Math.max(0, t) * 1.45, 0.6));
      const RS = Stage(ui, W, RH);
      const rFb = ui.el('div', 'fb'); rFb.style.marginBottom = 'var(--R)';
      const race = { st: 'idle', t: 0 };
      let rStat, pinL, heatL = {}, bubbles = [];
      const rodPoly = (r) => box(X0, r.y - r.rad, LEN, r.rad * 2);
      function buildRace() {
        rStat = RS.layer(W, RH, (x) => {
          // bench
          Ink.stroke(x, [[10, 600], [W - 10, 600]], { w: 2.6, seed: 3 });
          // tank of water (metal, on a tripod with gauze)
          const T = box(TX0, 48, TX1 - TX0, 424);
          Ink.hatchFill(x, box(TX0, 48, 18, 424), 1, B, 0.8);
          Ink.hatchShadow(x, T, 1, 6, 6);
          Ink.stroke(x, close(T), { w: 3, seed: 5 });
          pen(x, [[TX0 + 6, 70], [TX0 + 30, 68], [TX0 + 60, 71], [TX1 - 6, 69]], { w: 1.6, a: 0.8, seed: 2 });
          text(x, 'water', TX0 + 50, 40, { size: 22, align: 'center' });
          // tripod + gauze
          Ink.stroke(x, [[TX0 - 14, 476], [TX1 + 14, 476]], { w: 3.2, seed: 7 });
          for (let i = 0; i < 12; i++) pen(x, [[TX0 - 8 + i * 10, 473], [TX0 - 4 + i * 10, 479]], { w: 1, a: 0.7 });
          Ink.stroke(x, [[TX0 - 10, 478], [TX0 - 26, 598]], { w: 2.6, seed: 8 });
          Ink.stroke(x, [[TX1 + 10, 478], [TX1 + 26, 598]], { w: 2.6, seed: 9 });
          // Bunsen burner
          const bx = (TX0 + TX1) / 2;
          Ink.stroke(x, close(box(bx - 8, 528, 16, 58)), { w: 2.2, seed: 10 });
          Ink.hatchFill(x, box(bx + 2, 528, 6, 58), 1, B, 1.4);
          Ink.stroke(x, close(box(bx - 11, 558, 22, 10)), { w: 1.8, seed: 12 });
          x.fillStyle = rgba(B, 0.85); x.beginPath(); x.arc(bx - 3, 563, 2.4, 0, 7); x.fill();
          Ink.stroke(x, close([[bx - 30, 598], [bx - 22, 586], [bx + 22, 586], [bx + 30, 598]]), { w: 2.4, seed: 13 });
          Ink.stroke(x, geo.curve([bx + 26, 594], [bx + 60, 590], [bx + 70, 604], [bx + 110, 596]), { w: 2.4, seed: 14 });
          // rods, wax and trays
          RODS.forEach((r, j) => {
            const P = rodPoly(r);
            matFill(x, r.k, P, j);
            Ink.stroke(x, [[X0, r.y - r.rad], [X1, r.y - r.rad]], { w: 2, seed: 20 + j });
            Ink.stroke(x, [[X0, r.y + r.rad], [X1, r.y + r.rad]], { w: 2, seed: 30 + j });
            Ink.stroke(x, geo.ellipse(X1, r.y, 3.2, r.rad, 0, Math.PI * 2 + 0.2), { w: 1.6, seed: 40 + j });
            Ink.stroke(x, close(box(X0 - 3, r.y - r.rad - 4, 7, r.rad * 2 + 8)), { w: 1.6, seed: 45 + j });
            pen(x, [[X0 + 20, r.y + 50], [X1 - 6, r.y + 50]], { w: 1.3, a: 0.5, seed: 50 + j });
            text(x, r.n, 704, r.y - 2, { size: 22 });
          });
          text(x, 'drawing pin stuck on with wax', 262, 556, { size: 22, font: 'hand', a: 0.8 });
          Ink.stroke(x, geo.curve([256, 548], [238, 544], [232, 528], [236, 502]), { w: 1.6, seed: 61 }); Ink.stroke(x, geo.head(geo.curve([256, 548], [238, 544], [232, 528], [236, 502]), 9), { w: 1.6, seed: 62 });
        });
        pinL = RS.layer(30, 34, (x) => { // hanging drawing pin, point up
          Ink.stroke(x, [[15, 2], [15, 24]], { w: 1.6, seed: 2, retrace: false });
          const hd = [[4, 24], [26, 24], [24, 29], [6, 29]]; Ink.hatchFill(x, hd, 1, B, 1.8); Ink.stroke(x, close(hd), { w: 1.6, seed: 4, retrace: false });
        });
        RODS.forEach((r) => (heatL[r.k] = RS.layer(LEN, 20, (x) => { const P = box(0, 10 - r.rad + 1, LEN, r.rad * 2 - 2); Ink.hatchFill(x, P, 1, RD, 2.2); fillPoly(x, P, 'rgba(240,90,60,0.28)'); })));
      }
      buildRace(); RS.onFonts = buildRace;

      function resetRace() { RODS.forEach((r) => { r.first = 0; r.rank = 0; r.pins.forEach((p) => Object.assign(p, { melt: 0, st: 'on', dy: 0, vy: 0, rot: 0 })); }); bubbles = []; }
      let nRank = 0;
      RS.render = (dt, now) => {
        const x = RS.ctx; let busy = false;
        if (race.st === 'run') {
          race.t += dt; busy = true;
          RODS.forEach((r) => {
            const f = front(r, race.t);
            r.pins.forEach((p) => {
              if (p.st === 'on' && f >= p.f) { p.melt += dt / 0.55; if (p.melt >= 1) { p.st = 'fall'; Book.sfx('tick', { gain: 0.35, f: 3200 }); if (!r.first) { r.first = race.t; r.rank = ++nRank; } } }
              if (p.st === 'fall') { p.vy += 900 * dt; p.dy += p.vy * dt; p.rot = Math.min(1.45, p.rot + 9 * dt); if (p.dy >= 22) { p.dy = 22; p.st = 'down'; Book.sfx('tock', { f: 2100 + p.i * 150, gain: 0.3 }); } }
            });
          });
          if (Math.random() < dt * 9) bubbles.push({ x: TX0 + 26 + Math.random() * 60, y: 462, r: 2 + Math.random() * 3 });
          bubbles.forEach((b) => (b.y -= (50 + b.r * 12) * dt)); bubbles = bubbles.filter((b) => b.y > 74);
          if (race.t >= DUR) { race.st = 'done'; raceDone(); }
        }
        const lit = race.st !== 'idle', t = race.st === 'idle' ? 0 : race.t;
        RS.blit(rStat, 0, 0);
        // heat creeping along each rod (red)
        RODS.forEach((r) => {
          const f = lit ? front(r, t) : 0; if (f <= 0.003) return;
          const wpx = Math.max(3, f * LEN);
          x.save(); x.beginPath(); x.rect(X0, r.y - 12, wpx, 24); x.clip(); x.globalAlpha = 0.9; RS.blit(heatL[r.k], X0, r.y - 10); x.restore();
          if (race.st === 'run') for (let q = 30; q < wpx; q += 70) { const hx = X0 + q, ph = (now * 1.3 + q * 0.013) % 1, yy = r.y - r.rad - 5 - ph * 12; pen(x, [[hx - 6, yy], [hx - 2, yy - 4], [hx + 2, yy], [hx + 6, yy - 4]], { wob: false, w: 1.5, a: 0.6 * (1 - ph), color: RD }); }
        });
        // wax + pins
        RODS.forEach((r) => r.pins.forEach((p) => {
          const top = r.y + r.rad, m = clamp(p.melt);
          if (p.st === 'on') {
            const rw = 9 * (1 - 0.35 * m), rh = 6 + 3 * m;
            x.save(); x.beginPath(); x.ellipse(p.x, top + rh * 0.55, rw, rh, 0, 0, 7); x.fillStyle = 'rgba(150,170,230,0.5)'; x.fill(); x.strokeStyle = rgba(B, 0.9); x.lineWidth = 1.6; x.stroke(); x.restore();
            if (m > 0.15) { const dy = top + 8 + m * 30; x.save(); x.fillStyle = rgba(B, 0.7); x.beginPath(); x.ellipse(p.x + 7, dy, 1.8, 3, 0, 0, 7); x.fill(); x.restore(); }
            RS.blit(pinL, p.x - 15, top + 3 + m * 3);
          } else {
            pen(x, [[p.x - 7, top + 1.5], [p.x - 2, top + 4], [p.x + 3, top + 2], [p.x + 7, top + 1.5]], { wob: false, w: 1.8, a: 0.7 });
            x.save(); x.translate(p.x + p.rot * 6, top + 20 + p.dy); x.rotate(p.rot); RS.blit(pinL, -15, -17); x.restore();
          }
        }));
        // flame, bubbles, steam
        if (lit) {
          const bx = (TX0 + TX1) / 2, fl = race.st === 'run' ? Math.sin(now * 23) * 2 + Math.sin(now * 37) * 1.5 : 0;
          const F = [[bx - 9, 527], [bx - 13, 508 + fl], [bx - 5, 494], [bx + fl * 0.7, 480 - Math.abs(fl)], [bx + 6, 495], [bx + 13, 509 - fl], [bx + 9, 527]];
          x.save(); x.beginPath(); x.moveTo(F[0][0], F[0][1]); for (let i = 1; i < F.length; i++) x.lineTo(F[i][0], F[i][1]); x.closePath(); x.fillStyle = 'rgba(250,150,70,0.45)'; x.fill(); x.restore();
          pen(x, F, { wob: false, w: 2.2, a: 0.9, color: RD }); pen(x, [[bx - 4, 527], [bx, 505 + fl * 0.5], [bx + 4, 527]], { wob: false, w: 1.6, a: 0.9 });
          x.save(); x.strokeStyle = rgba(B, 0.75); x.lineWidth = 1.3; bubbles.forEach((b) => { x.beginPath(); x.arc(b.x + Math.sin(b.y * 0.1) * 3, b.y, b.r, 0, 7); x.stroke(); }); x.restore();
          [0, 1, 2].forEach((i) => { const sx = TX0 + 22 + i * 28, ph = now * 0.8 + i; pen(x, [[sx, 22], [sx - 5 + Math.sin(ph) * 3, 12], [sx + 5 + Math.sin(ph + 1) * 3, 2]], { wob: false, w: 1.4, a: 0.5 }); });
        }
        // ranks + conductivity numbers
        RODS.forEach((r) => {
          if (r.rank) { text(x, ['1st', '2nd', '3rd'][r.rank - 1], 836, r.y + 26, { size: 22, align: 'right', color: RD }); }
          if (race.st === 'done') { text(x, r.kv, 704, r.y + 26, { size: 22, color: r.c > 10 ? RD : B }); if (!r.rank) text(x, 'no pins', 846, r.y + 26, { size: 20, align: 'right', a: 0.75, font: 'hand' }); }
        });
        if (race.st === 'done') text(x, 'red numbers = thermal conductivity in W/m·K', 262, 590, { size: 22, color: RD, font: 'hand', max: 580 });
        return busy;
      };
      function upd() { goBtn.disabled = !(pick.first && pick.last) || race.st === 'run'; }
      const nameOf = (k) => RODS.find((r) => r.k === k).n;
      function raceDone() {
        goBtn.disabled = false; goBtn.textContent = '↻ Run the race again';
        const a = pick.first === 'copper', b = pick.last === 'wood', sc = (a ? 1 : 0) + (b ? 1 : 0);
        rFb.className = 'fb on ' + (sc === 2 ? 'good' : 'bad');
        rFb.innerHTML = `<b>${sc}/2.</b> Fastest: you said <b>${nameOf(pick.first)}</b> ${a ? '✓' : '✗ It was <b>copper</b>: the best thermal conductor here.'}<br>Slowest: you said <b>${nameOf(pick.last)}</b> ${b ? '✓' : pick.last === 'glass' ? '✗ Close! Glass barely warmed up, but <b>wood</b> is even slower (≈0.15 against ≈1).' : '✗ It was <b>wood</b>. Metals are all good thermal conductors; wood and glass barely warmed up.'}<br><span style="color:var(--ink)">The order was <b>copper → aluminium → steel</b>. Glass and wood did not drop a single pin.</span>`;
        RS.go();
      }
      goBtn.onclick = () => {
        if (!(pick.first && pick.last) || race.st === 'run') return;
        if (!rRace.get()?.pick) {
          const a = pick.first === 'copper', b = pick.last === 'wood', metal = (k) => ['copper', 'aluminium', 'steel'].includes(k);
          rRace.set({ answer: `first: ${nameOf(pick.first)} ${a ? '✓' : '✗ (copper)'}, slowest: ${nameOf(pick.last)} ${b ? '✓' : '✗ (wood)'}`, correct: a && b, score: (a ? 1 : 0) + (b ? 1 : 0), max: 2, mis: !metal(pick.first) || metal(pick.last) ? 'conductor-insulator' : '', pick: { first: pick.first, last: pick.last } });
        }
        [rowA, rowB].forEach((r) => r.querySelectorAll('.opt').forEach((o) => (o.disabled = true)));
        resetRace(); nRank = 0; race.st = 'run'; race.t = 0; goBtn.disabled = true; rFb.className = 'fb'; Book.sfx('whoosh', { dur: 0.5, gain: 0.3 }); RS.go();
      };
      const prevRace = rRace.get();
      if (prevRace && prevRace.pick) {
        Object.assign(pick, prevRace.pick);
        [[rowA, pick.first], [rowB, pick.last]].forEach(([r, k]) => r.querySelectorAll('.opt').forEach((o) => { o.disabled = true; if (o.textContent === nameOf(k)) o.classList.add('sel'); }));
        race.st = 'done'; race.t = DUR;
        RODS.forEach((r) => r.pins.forEach((p) => { if (front(r, DUR - 0.6) >= p.f) Object.assign(p, { st: 'down', dy: 22, rot: 1.45, melt: 1 }); }));
        [...RODS].sort((p, q) => q.c - p.c).forEach((r, i) => { if (r.pins.some((p) => p.st === 'down')) r.rank = i + 1; });
        raceDone();
      }
      RS.go();
      ui.box('<b>Thermal conductivity</b> is how well a material lets <span class="key">heat travel through it</span>.<br>Metals are good thermal conductors: <b>copper &gt; aluminium &gt; steel</b>. Wood, polymers, glass and air are <b>thermal insulators</b>.', { tag: 'Notes' });

      // ================================================================ 2. ELECTRICAL CONDUCTIVITY TESTER
      ui.el('h2', '', 'Experiment 2: does it conduct electricity?');
      ui.box('<b>Electrical conductivity</b> is how well a material lets <span class="key">electricity flow through it</span>. A material that does not let electricity through is an <b>insulator</b>.', { tag: 'Notes' });
      ui.p('<b>Tap a sample</b> to clip it into the gap in the circuit. If it conducts, the bulb lights.');
      const EW = 860, EH = 520, GX = 250, GY = 404;
      const SMP = [
        { k: 'copper', n: 'copper', c: true }, { k: 'pp', n: 'polypropylene', c: false }, { k: 'wood', n: 'wood', c: false }, { k: 'steel', n: 'steel', c: true },
        { k: 'glass', n: 'glass', c: false }, { k: 'aluminium', n: 'aluminium', c: true }, { k: 'acrylic', n: 'acrylic', c: false },
      ];
      SMP.forEach((s, i) => { s.y = 74 + i * 62; s.tested = false; });
      const ES = Stage(ui, EW, EH);
      const rTest = ui.record('p04.tester', { label: 'Conductivity tester: samples tested', type: 'explore', max: 0 });
      const wA = geo.curve([218, 196], [110, 200], [60, 330], [106, GY]), wB = geo.curve([394, GY], [436, 420], [446, 386], [432, 356]), wC = geo.curve([432, 204], [432, 150], [340, 150], [284, 194]);
      const path = [].concat(wC, [[282, 196], [218, 196]], wA, [[106, GY], [394, GY]], wB);
      const plen = []; { let L = 0; path.forEach((p, i) => { if (i) L += Math.hypot(p[0] - path[i - 1][0], p[1] - path[i - 1][1]); plen.push(L); }); }
      const along = (d) => { const L = plen[plen.length - 1]; d = ((d % L) + L) % L; let i = 1; while (plen[i] < d) i++; const u = (d - plen[i - 1]) / (plen[i] - plen[i - 1] || 1); return [path[i - 1][0] + (path[i][0] - path[i - 1][0]) * u, path[i - 1][1] + (path[i][1] - path[i - 1][1]) * u]; };
      let eStat, clipL = {}, stripL = {}, glowL, tickE, crossE;
      const SW = 150, SH = 18;
      function paintClip(x, open) { // jaws point right; pivot near (64, 20)
        const sleeve = [[4, 12], [50, 9], [58, 13], [58, 27], [50, 31], [4, 28]];
        Ink.hatchFill(x, sleeve, 1, B, 1.5); Ink.stroke(x, close(sleeve), { w: 2, seed: 3 });
        const jaw = (sgn) => { const a = open ? 0.3 * sgn : 0.06 * sgn, P = []; for (let i = 0; i <= 8; i++) { const u = i / 8, lx = 58 + u * 44, ly = sgn * (7 - u * 2 + (i % 2 ? 0 : -2.2)); P.push([58 + (lx - 58) * Math.cos(a) - ly * Math.sin(a) * 0 , 20 + ly + (lx - 58) * Math.sin(a)]); } Ink.stroke(x, P, { w: 2, seed: 5 + sgn, retrace: false }); Ink.stroke(x, [[58, 20 + sgn * 11], [P[8][0], P[8][1] + sgn * 5]], { w: 2.2, seed: 8 + sgn }); };
        jaw(-1); jaw(1);
        Ink.stroke(x, geo.ellipse(62, 20, 4, 4, 0, Math.PI * 2 + 0.3), { w: 1.4, seed: 12, retrace: false });
      }
      function paintStrip(x, k) {
        const P = geo.rect(4, 4, SW, SH, k === 'acrylic' || k === 'pp' ? 5 : 2);
        if (k === 'pp') { for (let i = 0; i < 3; i++) text(x, 'PP', 30 + i * 46, 19, { size: 12, a: 0.6 }); }
        else matFill(x, k, box(4, 4, SW, SH), 3);
        Ink.stroke(x, P, { w: 2, seed: 15 + k.length });
      }
      function buildElec() {
        eStat = ES.layer(EW, EH, (x) => {
          // wires
          [wA, wB, wC].forEach((w, i) => Ink.stroke(x, w, { w: 3.2, seed: 70 + i }));
          // bulb holder + base
          const hold = box(204, 180, 92, 28); Ink.hatchShadow(x, hold, 1, 5, 5); Ink.hatchFill(x, box(204, 196, 92, 12), 1, B, 0.9); Ink.stroke(x, close(hold), { w: 2.4, seed: 72 });
          [218, 282].forEach((px) => { Ink.stroke(x, geo.ellipse(px, 194, 5, 5, 0, Math.PI * 2 + 0.3), { w: 1.6, seed: px, retrace: false }); pen(x, [[px - 3, 194], [px + 3, 194]], { w: 1.4 }); });
          const scr = box(234, 150, 32, 30); Ink.hatchFill(x, box(252, 150, 14, 30), 1, B, 1.2); Ink.stroke(x, close(scr), { w: 2, seed: 74 });
          for (let i = 0; i < 4; i++) pen(x, [[234, 156 + i * 7], [266, 153 + i * 7]], { w: 1.3, a: 0.8 });
          // glass bulb
          Ink.stroke(x, geo.ellipse(250, 104, 42, 44, Math.PI * 0.62, Math.PI * 2.38), { w: 2.4, seed: 76 });
          pen(x, [[224, 86], [232, 72], [244, 66]], { w: 1.6, a: 0.55 });
          pen(x, [[242, 150], [240, 118]], { w: 1.4 }); pen(x, [[258, 150], [260, 118]], { w: 1.4 });
          // battery (a cell standing up)
          const cell = box(406, 216, 52, 138); Ink.hatchShadow(x, cell, 1, 6, 6); Ink.hatchFill(x, box(440, 216, 18, 138), 1, B, 1.2); Ink.hatchFill(x, box(406, 318, 52, 36), 1, B, 1.4);
          Ink.stroke(x, close(cell), { w: 2.6, seed: 78 }); Ink.stroke(x, close(box(423, 204, 18, 12)), { w: 2, seed: 79 }); Ink.stroke(x, [[406, 318], [458, 318]], { w: 1.6, seed: 80 });
          text(x, '+', 424, 250, { size: 26, align: 'center', color: RD }); text(x, '1.5 V', 424, 296, { size: 17, align: 'center' });
          text(x, 'battery', 398, 300, { size: 22, align: 'right', font: 'hand' }); text(x, 'bulb', 318, 100, { size: 22, font: 'hand' });
          text(x, 'crocodile clips', GX, 462, { size: 22, align: 'center', font: 'hand' });
          text(x, 'samples', 690, 34, { size: 22, align: 'center' });
          SMP.forEach((s) => text(x, s.n, 676, s.y + 8, { size: 22, max: 176 }));
        });
        clipL.open = ES.layer(112, 40, (x) => paintClip(x, true)); clipL.shut = ES.layer(112, 40, (x) => paintClip(x, false));
        SMP.forEach((s) => (stripL[s.k] = ES.layer(SW + 8, SH + 8, (x) => paintStrip(x, s.k))));
        glowL = ES.layer(240, 240, (x) => {
          const g = x.createRadialGradient(120, 120, 10, 120, 120, 118); g.addColorStop(0, 'rgba(255,214,40,0.95)'); g.addColorStop(0.45, 'rgba(255,225,80,0.55)'); g.addColorStop(1, 'rgba(255,235,120,0)');
          x.fillStyle = g; x.fillRect(0, 0, 240, 240);
          for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2 - 0.3; if (a > 1.0 && a < 2.2) continue; Ink.stroke(x, [[120 + Math.cos(a) * 58, 120 + Math.sin(a) * 60], [120 + Math.cos(a) * (i % 2 ? 84 : 96), 120 + Math.sin(a) * (i % 2 ? 86 : 98)]], { w: 2.4, color: RD, seed: i + 2 }); }
        });
        tickE = ES.layer(46, 40, (x) => Ink.tick(x, 6, 22, 0.9, GR)); crossE = ES.layer(40, 40, (x) => Ink.cross(x, 20, 20, 0.8, RD));
      }
      buildElec(); ES.onFonts = buildElec;
      const listRect = (s) => ({ x: 566, y: s.y - 6, w: 100, h: 12 }), gapRect = { x: GX - SW / 2, y: GY - SH / 2, w: SW, h: SH };
      let cur = null, fly = null, lit = 0, shutT = 0; // fly: { s, from, to, t0, dur, back }
      ES.render = (dt, now) => {
        const x = ES.ctx; let busy = false;
        if (fly) {
          const u = clamp((now - fly.t0) / fly.dur); busy = true;
          if (u >= 1) {
            if (fly.back) { const nx = fly.next; fly = nx ? { s: nx, t0: now, dur: 0.45 } : null; }
            else { cur = fly.s; fly = null; shutT = now; cur.tested = true; Book.sfx('click', { gain: 0.6 }); if (cur.c) Book.sfx('ding', { f: 'A5', gain: 0.25 }); else Book.sfx('tock', { f: 260, gain: 0.35 });
              rTest.set({ answer: SMP.filter((q) => q.tested).map((q) => `${q.n}: ${q.c ? 'bulb lights' : 'no light'}`).join('; ') + ` (${SMP.filter((q) => q.tested).length}/7 tested)`, correct: null, score: null, max: 0 }); }
          }
        }
        const on = cur && cur.c && !fly; lit += ((on ? 1 : 0) - lit) * Math.min(1, dt * 12); if (Math.abs((on ? 1 : 0) - lit) > 0.01) busy = true; else lit = on ? 1 : 0;
        if (lit > 0.01) { x.save(); x.globalAlpha = lit; ES.blit(glowL, 250 - 120, 104 - 120); x.restore(); }
        ES.blit(eStat, 0, 0);
        // filament
        pen(x, [[240, 118], [244, 104], [248, 114], [252, 104], [256, 114], [260, 118]], { wob: false, w: lit > 0.5 ? 2.6 : 1.5, color: lit > 0.5 ? RD : B, a: 0.9 });
        // clips
        const shut = !!cur && !fly;
        ES.blit(shut ? clipL.shut : clipL.open, 102, GY - 20);
        x.save(); x.translate(398, GY - 20); x.scale(-1, 1); ES.blit(shut ? clipL.shut : clipL.open, 0, 0); x.restore();
        // sample list
        SMP.forEach((s) => {
          const r = listRect(s), away = s === cur || (fly && fly.s === s);
          if (away) pen(x, close(box(r.x, r.y, r.w, r.h)), { w: 1.2, a: 0.35 }); else ES.blit(stripL[s.k], r.x - 3, r.y - 3, r.w + 6, r.h + 5);
          if (s.tested) ES.blit(s.c ? tickE : crossE, s.c ? 522 : 526, s.y - 22);
        });
        // sample in the gap / flying
        const drawAt = (s, R) => ES.blit(stripL[s.k], R.x - 4 * (R.w / SW), R.y - 4 * (R.h / SH), (SW + 8) * (R.w / SW), (SH + 8) * (R.h / SH));
        if (fly) { const u = easeIO(clamp((now - fly.t0) / fly.dur)), A = fly.back ? gapRect : listRect(fly.s), Z = fly.back ? listRect(fly.s) : gapRect; drawAt(fly.s, { x: A.x + (Z.x - A.x) * u, y: A.y + (Z.y - A.y) * u - Math.sin(u * Math.PI) * 40, w: A.w + (Z.w - A.w) * u, h: A.h + (Z.h - A.h) * u }); }
        else if (cur) drawAt(cur, gapRect);
        // current flowing (red dots round the loop) or a message
        if (lit > 0.5) { busy = true; x.save(); x.fillStyle = rgba(RD, 0.85); for (let d = (now * 110) % 46; d < plen[plen.length - 1]; d += 46) { const [px, py] = along(d); if (px > 400 && py > 200 && py < 360) continue; x.beginPath(); x.arc(px, py, 3.4, 0, 7); x.fill(); } x.restore(); text(x, 'it lights!', 14, 78, { size: 26, color: GR, font: 'hand', rot: -0.08 }); }
        else if (cur && !fly) { text(x, 'no light', 14, 78, { size: 26, color: RD, font: 'hand', rot: -0.08 }); text(x, cur.n + ' is an insulator', GX, 500, { size: 22, align: 'center', color: RD, font: 'hand' }); }
        if (lit > 0.5 && cur) text(x, cur.n + ' is a conductor', GX, 500, { size: 22, align: 'center', color: GR, font: 'hand' });
        if (!cur && !fly) text(x, 'gap', GX, GY + 8, { size: 22, align: 'center', a: 0.5, font: 'hand' });
        return busy;
      };
      ES.c.addEventListener('click', (e) => {
        const [px, py] = ES.pos(e); if (px < 506 || fly) return;
        const s = SMP.find((q) => Math.abs(py - q.y) <= 31); if (!s || s === cur) return;
        Book.sfx('tick', { gain: 0.4 });
        const t0 = performance.now() / 1000;
        if (cur) { fly = { s: cur, back: true, next: s, t0, dur: 0.3 }; cur = null; } else fly = { s, t0, dur: 0.45 };
        ES.go();
      });
      ES.go();
      ui.p('<span class="small">Test every sample first. When you start sorting, the tester <b>blurs out</b> until you get them all right (or after 3 checks).</span>');
      const condSort = ui.sort({
        id: 'p04.conductors', label: 'Sort: electrical conductors vs insulators', q: 'Sort the materials. <b>Tap a card</b>, then tap the box it belongs in.',
        buckets: ['Conductors (bulb lights)', 'Insulators (no light)'],
        items: [
          { t: 'copper', b: 0, mis: 'conductor-insulator' }, { t: 'steel', b: 0, mis: 'conductor-insulator' }, { t: 'aluminium', b: 0, mis: 'conductor-insulator' }, { t: 'solder', b: 0, mis: 'conductor-insulator' },
          { t: 'polypropylene', b: 1, mis: 'conductor-insulator' }, { t: 'wood', b: 1, mis: 'conductor-insulator' }, { t: 'glass', b: 1, mis: 'conductor-insulator' }, { t: 'acrylic', b: 1, mis: 'conductor-insulator' }, { t: 'PVC', b: 1, mis: 'conductor-insulator' },
        ],
        explain: 'All metals conduct electricity (and heat). Polymers, wood, glass and ceramics are insulators. That is why copper cable is covered in PVC.',
      });
      ui.hideWhile(condSort, 'p04.conductors', [ES.wrap]);

      ui.tf({
        id: 'p04.heat-vs-elec', label: 'T/F: the wax-and-pin race tests electrical conductivity',
        statement: 'The wax-and-pin race tests <b>electrical</b> conductivity.',
        answer: false, mis: 'heat-vs-electricity',
        explain: 'The race tests <b>thermal</b> conductivity: how well <b>heat</b> travels along each rod. The battery-and-bulb circuit tests <b>electrical</b> conductivity: whether <b>electricity</b> can flow.',
      });

      // ================================================================ 3. FUSIBILITY FURNACE
      ui.el('h2', '', 'Experiment 3: turn up the heat');
      ui.box('<b>Fusibility</b> is the ability of a material to be changed into a <span class="key">liquid (molten) state</span> when it is heated to its <b>melting point</b>, so it can be joined or cast.', { tag: 'Notes' });
      ui.p('<b>Drag the slider</b> to heat the samples from 0 to 1600 °C. Which melt? Which one never does?');
      const FW = 860, FH = 486, SL0 = 70, SL1 = 790, SLY = 432, BASE = 246;
      const FU = [
        { k: 'solder', n: ['solder'], a: 183, b: 220, mp: '≈183–220 °C', metal: true },
        { k: 'pp', n: ['poly-', 'propylene'], a: 160, b: 175, mp: '≈160 °C' },
        { k: 'aluminium', n: ['aluminium'], a: 660, b: 690, mp: '660 °C', metal: true },
        { k: 'copper', n: ['copper'], a: 1085, b: 1115, mp: '1085 °C', metal: true },
        { k: 'steel', n: ['steel'], a: 1400, b: 1500, mp: '≈1400–1500 °C', metal: true },
        { k: 'mel', n: ['melamine', 'plate'], char: true },
      ];
      FU.forEach((s, i) => { s.cx = 76 + 141.5 * i; s.m = 0; s.tgt = 0; });
      const HS = Stage(ui, FW, FH, { touch: 'pan-y' });
      const rMelt = ui.record('p04.melt', { label: 'Furnace: hottest temperature tried and what melted', type: 'explore', max: 0 });
      let T = 20, maxT = 20, drag = false, hStat, solidL = {}, pudL = {}, charL, knobL;
      const SPW = 124, SPH = 96, SB = 86; // sprite box; SB = base line inside the sprite
      function paintSolid(x, k) {
        const c = SPW / 2;
        if (k === 'solder') { // a coil of solder wire
          for (let i = 0; i < 7; i++) Ink.stroke(x, geo.ellipse(c - 30 + i * 10, SB - 22, 9, 21, 0, Math.PI * 2 + 0.2), { w: 1.8, seed: 3 + i, retrace: false });
          Ink.stroke(x, geo.curve([c + 34, SB - 8], [c + 46, SB - 2], [c + 50, SB - 2], [c + 56, SB - 1]), { w: 2, seed: 20 });
        } else if (k === 'mel') { // a plate seen from the side
          const rim = geo.ellipse(c, SB - 22, 52, 11, 0, Math.PI * 2);
          Ink.stroke(x, close(rim), { w: 2.2, seed: 31 }); Ink.stroke(x, geo.ellipse(c, SB - 21, 34, 6, 0, Math.PI * 2 + 0.2), { w: 1.4, seed: 32, retrace: false });
          Ink.stroke(x, [[c - 52, SB - 22], [c - 26, SB - 2], [c + 26, SB - 2], [c + 52, SB - 22]], { w: 2.2, seed: 33 });
          Ink.hatchFill(x, [[c + 10, SB - 11], [c + 50, SB - 20], [c + 26, SB - 2], [c + 8, SB - 2]], 1, B, 1);
          for (let i = 0; i < 9; i++) { const a = Math.PI * (0.08 + i * 0.105); x.fillStyle = rgba(B, 0.7); x.beginPath(); x.arc(c - Math.cos(a) * 43, SB - 22 + Math.sin(a) * 8.6, 1.5, 0, 7); x.fill(); }
        } else { // ingot / block
          const w = k === 'pp' ? 62 : 84, h = k === 'pp' ? 38 : k === 'steel' ? 28 : 32, ins = k === 'pp' ? 0 : 9, d = 12;
          const f = [[c - w / 2, SB], [c - w / 2 + ins, SB - h], [c + w / 2 - ins, SB - h], [c + w / 2, SB]];
          const top = [f[1], [f[1][0] + d, f[1][1] - d], [f[2][0] + d, f[2][1] - d], f[2]], side = [f[2], [f[2][0] + d, f[2][1] - d], [f[3][0] + d, f[3][1] - d * 0.8], f[3]];
          if (k === 'pp') { text(x, 'PP', c, SB - 12, { size: 14, align: 'center', a: 0.7 }); } else matFill(x, k, f, 2);
          Ink.hatchFill(x, side, 1, B, k === 'steel' ? 2 : 1.2); if (k === 'steel') Ink.hatchFill(x, top, 1, B, 0.8);
          Ink.stroke(x, close(f), { w: 2.2, seed: 40 + k.length }); Ink.stroke(x, [f[1], top[1], top[2], side[2], f[3]], { w: 2.2, seed: 50 + k.length }); Ink.stroke(x, [f[2], top[2]], { w: 1.6, seed: 55 });
        }
      }
      function paintPuddle(x, k) {
        const c = SPW / 2, rx = k === 'solder' ? 36 : 54, ry = k === 'solder' ? 9 : 10, r = H.rng(k.length * 5), P = [];
        for (let i = 0; i < 40; i++) { const a = (i / 40) * Math.PI * 2, f = 0.9 + 0.1 * Math.sin(a * 4 + r() * 2) + r.range(-0.03, 0.03); P.push([c + Math.cos(a) * rx * f, SB - ry + 2 + Math.sin(a) * ry * f]); }
        fillPoly(x, P, k === 'pp' ? 'rgba(150,170,235,0.18)' : 'rgba(150,170,235,0.3)');
        if (k !== 'pp') { x.save(); clipPoly(x, P); Ink.hatchFill(x, P, 1, B, k === 'steel' ? 1.7 : k === 'copper' ? 1.1 : 0.6); x.restore(); erase(x, [[c - rx * 0.55, SB - ry - 1], [c - rx * 0.1, SB - ry - 3]], 3); }
        else pen(x, [[c - 26, SB - ry], [c - 8, SB - ry - 2]], { w: 1.6, a: 0.6 });
        Ink.stroke(x, close(P), { w: 2.2, seed: 60 + k.length, amp: 0.5 });
      }
      function buildFurn() {
        hStat = HS.layer(FW, FH, (x) => {
          // heat-proof slab
          const topF = [[14, BASE + 8], [846, BASE + 8], [834, BASE - 14], [26, BASE - 14]];
          pen(x, [topF[3], topF[2]], { w: 1.4, a: 0.6 });
          Ink.stroke(x, [[14, BASE + 8], [846, BASE + 8]], { w: 2.6, seed: 3 });
          Ink.hatchFill(x, box(14, BASE + 8, 832, 12), 1, B, 1); Ink.stroke(x, [[14, BASE + 8], [14, BASE + 20], [846, BASE + 20], [846, BASE + 8]], { w: 2, seed: 4 });
          Ink.stroke(x, [[14, BASE + 8], [26, BASE - 14]], { w: 1.8, seed: 5 }); Ink.stroke(x, [[846, BASE + 8], [834, BASE - 14]], { w: 1.8, seed: 6 });
          FU.forEach((s) => { text(x, s.n[0], s.cx, 318, { size: 22, align: 'center', max: 136 }); if (s.n[1]) text(x, s.n[1], s.cx, 342, { size: 22, align: 'center', max: 136 }); });
          // slider track + scale
          Ink.stroke(x, [[SL0, SLY], [SL1, SLY]], { w: 3.4, seed: 8 });
          for (let v = 0; v <= 1600; v += 200) { const px = SL0 + ((SL1 - SL0) * v) / 1600; Ink.stroke(x, [[px, SLY - (v % 400 ? 7 : 11)], [px, SLY + (v % 400 ? 7 : 11)]], { w: 2, seed: v + 1, retrace: false }); if (v % 400 === 0) text(x, v + (v === 1600 ? ' °C' : ''), px, SLY + 42, { size: 22, align: 'center' }); }
        });
        FU.forEach((s) => { solidL[s.k] = HS.layer(SPW, SPH, (x) => paintSolid(x, s.k)); if (!s.char) pudL[s.k] = HS.layer(SPW, SPH, (x) => paintPuddle(x, s.k)); });
        charL = HS.layer(SPW, SPH, (x) => {
          const c = SPW / 2, body = [[c - 52, SB - 22], [c - 44, SB - 30], [c, SB - 33], [c + 44, SB - 30], [c + 52, SB - 22], [c + 26, SB - 2], [c - 26, SB - 2]];
          x.save(); clipPoly(x, body); Ink.hatchFill(x, body, 1, B, 2.6); x.save(); x.translate(SPW, 0); x.scale(-1, 1); Ink.hatchFill(x, body, 1, B, 2.2); x.restore(); fillPoly(x, body, 'rgba(40,45,90,0.55)'); x.restore();
          [[c - 30, SB - 28, c - 18, SB - 14, c - 26, SB - 6], [c + 6, SB - 30, c + 14, SB - 18, c + 4, SB - 8], [c + 34, SB - 26, c + 26, SB - 16, c + 32, SB - 10]].forEach((q) => erase(x, [[q[0], q[1]], [q[2], q[3]], [q[4], q[5]]], 2));
        });
        knobL = HS.layer(60, 60, (x) => { const P = geo.ellipse(30, 30, 21, 21, 0, Math.PI * 2); x.fillStyle = '#fbfaf5'; x.beginPath(); x.arc(30, 30, 21, 0, 7); x.fill(); Ink.hatchShadow(x, P, 1, 4, 4); Ink.hatchFill(x, P, 1, RD, 1.2); Ink.stroke(x, close(P), { w: 2.8, color: RD, seed: 2 }); });
      }
      buildFurn(); HS.onFonts = buildFurn;
      HS.render = (dt, now) => {
        const x = HS.ctx; let busy = drag;
        FU.forEach((s) => {
          const tg = s.char ? clamp((T - 350) / 450) : clamp((T - s.a) / (s.b - s.a)); s.tgt = Math.max(s.tgt, tg);
          if (s.m < s.tgt) { const was = s.m; s.m = Math.min(s.tgt, s.m + dt * (s.char ? 0.9 : 1.3)); busy = true; if (was < 1 && s.m >= 1) Book.sfx(s.char ? 'error' : 'pop', { gain: 0.25, f: 300 }); }
        });
        HS.blit(hStat, 0, 0);
        // heating element glow under the slab
        const hot = clamp(T / 1600);
        for (let i = 0; i < 2; i++) { const P = []; for (let px = 30; px <= 830; px += 16) P.push([px, BASE + 30 + i * 10 + ((px / 16) % 2 ? 4 : -4)]); pen(x, P, { wob: false, w: 2, color: hot > 0.04 ? RD : B, a: 0.3 + 0.65 * hot }); }
        FU.forEach((s) => {
          const X = s.cx - SPW / 2, Y = BASE - SB;
          if (s.metal && T > 520) { const g = clamp((T - 520) / 900) * 0.55; const gr = x.createRadialGradient(s.cx, BASE - 14, 4, s.cx, BASE - 14, 70); gr.addColorStop(0, `rgba(255,110,50,${g})`); gr.addColorStop(1, 'rgba(255,140,60,0)'); x.fillStyle = gr; x.fillRect(s.cx - 72, BASE - 86, 144, 100); }
          if (s.char) {
            x.globalAlpha = 1 - 0.75 * s.m; HS.blit(solidL.mel, X, Y); x.globalAlpha = s.m; HS.blit(charL, X, Y); x.globalAlpha = 1;
            if (T > 350) { busy = true; for (let i = 0; i < 3; i++) { const ph = (now * 0.5 + i * 0.37) % 1, sx = s.cx - 24 + i * 24, yy = BASE - 40 - ph * 70; pen(x, [[sx, yy + 16], [sx - 6 + Math.sin(now * 2 + i) * 3, yy + 8], [sx + 6, yy], [sx - 3, yy - 9]], { wob: false, w: 1.8, a: 0.6 * (1 - ph) * clamp((T - 350) / 300) }); } }
          } else {
            const m = s.m, e = easeIO(m);
            if (m < 1) { x.globalAlpha = 1 - e * e; const sx = 1 + 0.3 * e, sy = 1 - 0.78 * e; x.drawImage(solidL[s.k], s.cx - (SPW * sx) / 2, BASE - SB * sy, SPW * sx, SPH * sy); }
            if (m > 0) { x.globalAlpha = e; const sx = 0.45 + 0.55 * e; x.drawImage(pudL[s.k], s.cx - (SPW * sx) / 2, Y, SPW * sx, SPH); }
            x.globalAlpha = 1;
          }
          // status
          if (s.char) { if (s.m > 0.05) { text(x, s.m >= 1 ? 'charred!' : 'charring…', s.cx, 376, { size: 22, align: 'center', color: RD, font: 'hand' }); text(x, 'never melts', s.cx, 402, { size: 20, align: 'center', color: RD, font: 'hand', max: 136 }); } }
          else if (s.m > 0) { text(x, s.m >= 1 ? 'melted!' : 'melting…', s.cx, 376, { size: 22, align: 'center', color: RD, font: 'hand' }); text(x, s.mp, s.cx, 402, { size: 20, align: 'center', color: RD, max: 138, min: 14 }); }
        });
        // readout + knob
        text(x, 'Temperature:', 20, 44, { size: 26 }); text(x, Math.round(T / 10) * 10 + ' °C', 190, 46, { size: 34, color: T > 100 ? RD : B });
        const kx = SL0 + ((SL1 - SL0) * T) / 1600;
        pen(x, [[SL0, SLY], [kx, SLY]], { wob: false, w: 6, color: RD, a: 0.55 });
        x.save(); x.globalCompositeOperation = 'source-over'; HS.blit(knobL, kx - 30, SLY - 30); x.restore();
        if (maxT < 60 && !drag) text(x, '← drag →', kx + 34, SLY - 14, { size: 22, font: 'hand', a: 0.6 });
        return busy;
      };
      const setT = (e) => { const [px] = HS.pos(e); T = clamp((px - SL0) / (SL1 - SL0)) * 1600; if (T > maxT) maxT = T; HS.go(); };
      const saveMelt = () => { const ml = FU.filter((s) => !s.char && s.tgt >= 1).map((s) => s.n.join('').replace('-', '')); rMelt.set({ answer: `heated to ${Math.round(maxT / 10) * 10} °C; melted: ${ml.length ? ml.join(', ') : 'nothing'}; melamine ${FU[5].tgt >= 1 ? 'charred' : FU[5].tgt > 0 ? 'starting to char' : 'unchanged'}`, correct: null, score: null, max: 0 }); };
      const grip = document.createElement('div'); HS.wrap.appendChild(grip);
      grip.style.cssText = `position:absolute;left:0;right:0;top:${((SLY - 50) / FH) * 100}%;bottom:0;touch-action:none;cursor:ew-resize;-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent`;
      grip.addEventListener('pointerdown', (e) => { drag = true; try { grip.setPointerCapture(e.pointerId); } catch (er) {} setT(e); Book.sfx('tick', { gain: 0.3 }); e.preventDefault(); });
      grip.addEventListener('pointermove', (e) => { if (drag) { setT(e); e.preventDefault(); } });
      const endDrag = () => { if (!drag) return; drag = false; saveMelt(); HS.go(); };
      grip.addEventListener('pointerup', endDrag); grip.addEventListener('pointercancel', endDrag);
      const reset = ui.el('button', 'btn ghost', '↻ New samples'); reset.style.cssText = 'margin:0 0 var(--R)';
      reset.onclick = () => { T = 20; FU.forEach((s) => { s.m = 0; s.tgt = 0; }); Book.sfx('paper', { gain: 0.4 }); HS.go(); };
      HS.go();

      ui.mcq({
        id: 'p04.fusibility', label: 'Why can\'t a melamine (thermosetting) plate be melted and recycled?',
        q: 'Polypropylene melted at about 160 °C, so it can be melted and remoulded. <b>Why can\'t the melamine plate be melted down and recycled the same way?</b>',
        options: [
          { t: 'Melamine is a thermosetting polymer: when heated it chars and burns instead of melting', ok: true, why: 'Exactly. Thermosetting polymers have no melting point, so they cannot be melted and remoulded.' },
          { t: 'Melamine has a higher melting point than steel: it just needs a hotter furnace', mis: 'fusibility-thermoset', why: 'Even at 1600 °C (hotter than molten steel) it only charred. Thermosetting polymers never melt.' },
          { t: 'Melamine is a thermoforming polymer: when heated it only softens a little', mis: 'fusibility-thermoset', why: 'Thermoforming polymers like polypropylene DO melt. Melamine is a thermosetting polymer: it chars instead.' },
          { t: 'Melamine is too dense: a material that heavy for its size cannot become a liquid', mis: 'fusibility-thermoset', why: 'Density does not decide this: steel is far denser and it melted. Thermosetting polymers char instead of melting.' },
        ],
        explain: 'This is also why saucepan handles are made from thermosetting polymers: they don\'t soften when hot.',
      });
      ui.tf({
        id: 'p04.solder', label: 'T/F: solder joins electronics because it melts at a low temperature and conducts',
        statement: 'Solder is used to join electronic components because it melts at a low temperature and conducts electricity.',
        answer: true,
        explain: 'Solder is <b>fusible at a low temperature</b> (≈183–220 °C), so it melts easily to make the joint, and it <b>conducts electricity</b> so current can flow through it.',
      });
    },
  });
})();
