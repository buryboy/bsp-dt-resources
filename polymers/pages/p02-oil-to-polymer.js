// Page 2 — From oil to polymer. A four-stop pen-drawn journey the student operates by touch: drill for crude oil,
// heat the fractionating column (naphtha comes off), crack long molecules into monomers, then build a polymer chain
// one monomer at a time. Then the notes and the journey blur for a recall quiz (order, monomer, additives, finite oil).
(function () {
  'use strict';
  const B = Ink.BLUE, RD = Ink.RED, rgba = Ink.rgba, geo = Ink.geo;
  const PAPER = '#fbfaf5';
  const HANDF = (s) => `400 ${s}px "Gloria Hallelujah", "Comic Sans MS", cursive`;
  const LABF = (s) => `600 ${s}px Fredoka, "Arial Rounded MT Bold", system-ui, sans-serif`;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const sstep = (a, b, v) => { const u = clamp((v - a) / (b - a)); return u * u * (3 - 2 * u); };
  const close = (P) => P.concat([P[0]]);

  function text(x, s, px, py, o = {}) {
    x.save(); x.font = (o.font === 'hand' ? HANDF : LABF)(o.size || 22);
    x.fillStyle = rgba(o.color || B, o.a ?? 0.92); x.textAlign = o.align || 'left'; x.textBaseline = 'alphabetic';
    x.translate(px, py); if (o.rot) x.rotate(o.rot); x.fillText(s, 0, 0); x.restore();
  }
  function pen(x, pts, o = {}) {
    const P = o.wob === false ? pts : geo.wob(geo.seg(pts, 3), o.seed ?? 11, o.amp ?? 0.6);
    x.save(); x.strokeStyle = rgba(o.color || B, o.a ?? 0.85); x.lineWidth = o.w ?? 1.6; x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath();
    P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); if (o.close) x.closePath(); x.stroke(); x.restore();
  }
  const dot = (x, px, py, r, a = 0.9, c = B) => { x.fillStyle = rgba(c, a); x.beginPath(); x.arc(px, py, r, 0, 7); x.fill(); };
  function paper(x, pts) {
    x.save(); x.globalCompositeOperation = 'source-over'; x.fillStyle = PAPER; x.beginPath();
    pts.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.closePath(); x.fill(); x.restore();
  }
  function arrow(x, pts, o = {}) { Ink.stroke(x, pts, Object.assign({ w: 2.4, retrace: false }, o)); Ink.stroke(x, geo.head(geo.seg(pts, 4), 14, 0.5), Object.assign({ w: 2.4, retrace: false }, o)); }
  function flame(x, fx, base, h, w = 9) {
    const top = base - h;
    const F = geo.curve([fx - w, base], [fx - w - 2, base - h * 0.5], [fx - 2, top + 8], [fx + 1, top], 8).concat(geo.curve([fx + 1, top], [fx + 5, top + h * 0.4], [fx + w + 2, base - h * 0.4], [fx + w, base], 8));
    x.fillStyle = 'rgba(255,170,40,.75)'; x.beginPath(); F.forEach(([a, b], j) => (j ? x.lineTo(a, b) : x.moveTo(a, b))); x.fill();
    pen(x, F, { w: 2, color: RD, wob: false, a: 0.9 });
  }
  // a small molecule: two beads joined by a double bond
  function mono(x, cx, cy, ang, col = B, r = 9) {
    const dx = Math.cos(ang) * 12, dy = Math.sin(ang) * 12, nx = -Math.sin(ang) * 3, ny = Math.cos(ang) * 3;
    x.save(); x.strokeStyle = rgba(col, 0.9); x.lineWidth = 2; x.beginPath();
    x.moveTo(cx - dx + nx, cy - dy + ny); x.lineTo(cx + dx + nx, cy + dy + ny); x.moveTo(cx - dx - nx, cy - dy - ny); x.lineTo(cx + dx - nx, cy + dy - ny); x.stroke();
    [[-1], [1]].forEach(([s]) => { x.globalCompositeOperation = 'source-over'; x.fillStyle = PAPER; x.beginPath(); x.arc(cx + dx * s, cy + dy * s, r, 0, 7); x.fill(); x.globalCompositeOperation = 'multiply'; x.fillStyle = rgba(col, 0.22); x.fill(); x.lineWidth = 2.2; x.stroke(); });
    x.restore();
  }
  function Stage(parent, W, Hh, touch) {
    const c = document.createElement('canvas'); parent.appendChild(c);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = Math.round(W * dpr); c.height = Math.round(Hh * dpr);
    Object.assign(c.style, { width: '100%', height: 'auto', aspectRatio: W + ' / ' + Hh, display: 'block', touchAction: touch || 'manipulation', userSelect: 'none', webkitUserSelect: 'none', webkitTouchCallout: 'none', cursor: 'pointer' });
    const ctx = c.getContext('2d');
    const S = { c, ctx, W, H: Hh, dpr, render: () => false };
    S.pos = (e) => { const r = c.getBoundingClientRect(); return [((e.clientX - r.left) * W) / r.width, ((e.clientY - r.top) * Hh) / r.height]; };
    S.layer = (w, h, paint) => { const L = document.createElement('canvas'); L.width = Math.ceil(w * dpr); L.height = Math.ceil(h * dpr); const x = L.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.lineCap = 'round'; x.lineJoin = 'round'; paint(x); L.w = w; L.h = h; return L; };
    S.blit = (L, px, py) => ctx.drawImage(L, px, py, L.w, L.h);
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
    c.addEventListener('contextmenu', (e) => e.preventDefault());
    if (document.fonts) document.fonts.ready.then(() => { S.onFonts && S.onFonts(); S.go(); });
    return S;
  }

  Book.page({
    id: 'p02',
    title: 'From oil to polymer',
    build(ui, root) {
      ui.h('From oil to polymer');
      ui.p('Almost every plastic starts as thick, black <b>crude oil</b> deep underground. Follow it through <b>four stops</b> and do each job yourself.');

      const got = (id) => Book.state.items[id];
      const r = ui.record('p02.journey', { label: 'Oil-to-polymer journey: stops completed (drill, distil, crack, polymerise)', type: 'experiment', max: 4 });
      const prev = r.get() || {};
      const done = [0, 1, 2, 3].map((i) => !!(prev.done && prev.done[i]));
      const STOPS = ['Oil rig', 'Refinery', 'Cracker', 'Reactor'];

      const journey = ui.el('div', ''); journey.style.cssText = 'position:relative;margin:0 0 var(--R)';
      const tabs = ui.el('div', '', '', journey); tabs.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;margin:0 0 8px';
      const tabB = STOPS.map((s, i) => { const b = ui.el('button', 'btn ghost', `${i + 1}. ${s}`, tabs); b.type = 'button'; b.style.cssText = 'margin-top:0;flex:1 1 130px;min-height:48px'; b.onclick = () => show(i); return b; });
      const lab = ui.el('div', '', '', journey);
      const W = 860, HH = 440;
      const S = Stage(lab, W, HH, 'manipulation');
      const cap = ui.el('p', '', '', journey); cap.style.cssText = 'min-height:calc(var(--R) * 2);margin:6px 0 0';
      const nextB = ui.el('button', 'btn', 'Next stop ▶', journey); nextB.type = 'button'; nextB.onclick = () => show(Math.min(3, cur + 1));

      let cur = Math.max(0, done.indexOf(false)); if (done.every(Boolean)) cur = 3;
      // ---- per-stop state
      const rig = { tgt: done[0] ? 1 : 0, p: done[0] ? 1 : 0, taps: 0 };
      const col = { heat: done[1] ? 1 : 0, shown: done[1] ? 1 : 0, sep: done[1] ? 1 : 0 };
      const rr0 = H.rng(77);
      const LEV = [66, 136, 206, 276, 384], THR = [1.0, 0.8, 0.6, 0.4, 9];
      const parts = []; for (let i = 0; i < 46; i++) { const c = i % 5; parts.push({ c, x: 356 + rr0() * 98, ph: rr0() * 6.3, j: rr0.range(-12, 12) }); }
      const LONG = [[300, 130, 0.12], [420, 215, -0.1], [290, 300, 0.06]];
      const crk = LONG.map(([cx, cy, an], i) => ({ cx, cy, an, done: done[2], t: done[2] ? 1 : 0, out: [0, 1, 2, 3].map((j) => ({ x: 540 + ((i * 4 + j) % 3) * 58 + (j % 2) * 14, y: 100 + ((i * 4 + j) * 61) % 230, an: (i * 4 + j) * 1.3 })) }));
      const rr1 = H.rng(5);
      const MON = []; for (let i = 0; i < 12; i++) MON.push({ x: 90 + (i % 6) * 128 + rr1.range(-26, 26), y: 150 + Math.floor(i / 6) * 84 + rr1.range(-20, 20), an: rr1() * 3.1, slot: done[3] ? i : -1, t: done[3] ? 1 : 0 });
      const slot = (i) => [72 + i * 65, 352 + 16 * Math.sin(i * 1.15), 0.5 * Math.cos(i * 1.15) * 0.5];
      const poly = { joined: done[3] ? 12 : 0, run: done[3] ? 1 : 0, running: false };

      // ---- static art per stop
      let art = [];
      function buildArt() {
        art = [
          S.layer(W, HH, (x) => { // oil rig
            const sea = []; for (let i = 0; i <= 42; i++) sea.push([10 + i * 20, 172 + Math.sin(i * 0.9) * 4]);
            Ink.stroke(x, sea, { w: 2.2, seed: 3, retrace: false });
            for (let i = 0; i < 9; i++) pen(x, [[40 + i * 95, 196 + (i % 3) * 22], [70 + i * 95, 192 + (i % 3) * 22], [96 + i * 95, 197 + (i % 3) * 22]], { w: 1.3, a: 0.5, seed: i });
            // platform: deck, legs, braces
            const deck = [[296, 96], [524, 96], [524, 114], [296, 114]]; paper(x, deck); Ink.hatchFill(x, deck, 1, B, 1.4); Ink.stroke(x, close(deck), { w: 2.6, seed: 5 });
            [[318, 300], [502, 520]].forEach(([a, b], i) => { Ink.stroke(x, [[a, 114], [b, 304]], { w: 3, seed: 6 + i }); });
            pen(x, [[316, 140], [504, 140]], { w: 1.8 }); pen(x, [[311, 200], [509, 200]], { w: 1.8, seed: 2 }); pen(x, [[316, 140], [509, 200]], { w: 1.4, a: 0.6 }); pen(x, [[504, 140], [311, 200]], { w: 1.4, a: 0.6, seed: 4 });
            // derrick
            Ink.stroke(x, [[376, 96], [404, 18], [416, 18], [444, 96]], { w: 2.6, seed: 9 });
            for (let i = 0; i < 4; i++) { const y0 = 96 - i * 19, y1 = y0 - 19, w0 = 34 - i * 7, w1 = 34 - (i + 1) * 7; pen(x, [[410 - w0, y0], [410 + w1, y1]], { w: 1.4, wob: false }); pen(x, [[410 + w0, y0], [410 - w1, y1]], { w: 1.4, wob: false }); pen(x, [[410 - w1, y1], [410 + w1, y1]], { w: 1.4, wob: false }); }
            // crew cabin + flare boom
            const cab = geo.rect(456, 62, 58, 34, 4); Ink.stroke(x, cab, { w: 2, seed: 12, retrace: false }); pen(x, [[466, 72], [480, 72], [480, 84], [466, 84], [466, 72]], { w: 1.4, wob: false }); pen(x, [[490, 72], [504, 72], [504, 84], [490, 84], [490, 72]], { w: 1.4, wob: false });
            Ink.stroke(x, [[300, 96], [236, 52]], { w: 2.4, seed: 13 });
            // sea bed and rock layers
            const bed = []; for (let i = 0; i <= 42; i++) bed.push([10 + i * 20, 304 + Math.sin(i * 0.5 + 1) * 5]);
            Ink.stroke(x, bed, { w: 2.8, seed: 15 });
            const l2 = geo.curve([10, 352], [240, 300], [580, 300], [850, 356], 40); Ink.stroke(x, l2, { w: 2, seed: 16, retrace: false });
            const rr = H.rng(4); for (let i = 0; i < 60; i++) { const px = rr.range(20, 840), py = rr.range(312, 432); if (Math.hypot((px - 410) / 190, (py - 386) / 40) < 1) continue; dot(x, px, py, 1.5, 0.5); }
            for (let i = 0; i < 12; i++) { const px = 30 + i * 72, py = 318 + (i % 2) * 8; pen(x, [[px, py], [px + 26, py + 2]], { w: 1.2, a: 0.5, wob: false }); }
            // the oil pocket under a dome of rock
            const oil = geo.ellipse(410, 388, 170, 30); Ink.hatchFill(x, oil, 1, B, 2.6); Ink.hatchFill(x, oil.map(([a, b]) => [a + 2, b]), 1, B, 2.2); Ink.stroke(x, oil, { w: 2.4, seed: 18 });
            // pipe ashore
            arrow(x, [[524, 104], [690, 104], [770, 80]], { seed: 21 });
            text(x, 'to the refinery', 716, 60, { font: 'hand', size: 22, align: 'center' });
            text(x, 'sea', 60, 160, { font: 'hand', size: 22 }); text(x, 'rock', 40, 424, { font: 'hand', size: 22 });
          }),
          S.layer(W, HH, (x) => { // furnace + fractionating column
            arrow(x, [[16, 352], [66, 352]], { seed: 3 }); text(x, 'crude', 6, 330, { font: 'hand', size: 22 }); text(x, 'oil', 22, 396, { font: 'hand', size: 22 });
            const fur = geo.rect(70, 290, 140, 124, 8); Ink.hatchShadow(x, fur, 1, 6, 6); Ink.stroke(x, fur, { w: 2.8, seed: 4 });
            text(x, 'FURNACE', 140, 284, { size: 22, align: 'center' });
            pen(x, [[84, 396], [196, 396]], { w: 2, seed: 2 });
            Ink.stroke(x, [[210, 352], [344, 352]], { w: 2.6, seed: 6 }); Ink.stroke(x, [[210, 366], [344, 366]], { w: 2.6, seed: 7 });
            const tower = geo.rect(344, 24, 122, 396, 28); Ink.hatchShadow(x, tower, 1, 7, 7); Ink.stroke(x, tower, { w: 3, seed: 8 });
            [101, 171, 241, 311].forEach((ty, i) => { pen(x, [[346, ty], [386, ty]], { w: 2.2, seed: i }); pen(x, [[404, ty], [464, ty]], { w: 2.2, seed: i + 5 }); pen(x, [[386, ty], [386, ty - 9]], { w: 1.8, wob: false }); pen(x, [[404, ty], [404, ty - 9]], { w: 1.8, wob: false }); pen(x, [[380, ty - 12], [410, ty - 12]], { w: 1.8, wob: false }); });
            LEV.forEach((ly, i) => { const y = i === 4 ? 400 : ly + 20; Ink.stroke(x, [[466, y], [552, y]], { w: 2.4, seed: 20 + i, retrace: false }); Ink.stroke(x, [[466, y + 12], [552, y + 12]], { w: 2.4, seed: 30 + i, retrace: false }); });
            // thermometer
            Ink.stroke(x, geo.rect(248, 60, 22, 190, 11), { w: 2.2, seed: 40, retrace: false }); Ink.stroke(x, geo.ellipse(259, 262, 17, 17), { w: 2.2, seed: 41, retrace: false });
            for (let i = 0; i <= 5; i++) pen(x, [[274, 240 - i * 34], [286, 240 - i * 34]], { w: 1.6, wob: false });
            text(x, 'cool', 480, 46, { font: 'hand', size: 22 }); text(x, 'hot', 300, 410, { font: 'hand', size: 22, align: 'right' });
          }),
          S.layer(W, HH, (x) => { // the cracker
            const ves = geo.rect(150, 44, 560, 322, 40); Ink.hatchShadow(x, ves, 1, 7, 7); Ink.stroke(x, ves, { w: 3, seed: 5 });
            Ink.stroke(x, [[40, 200], [150, 200]], { w: 2.6, seed: 6 }); Ink.stroke(x, [[40, 220], [150, 220]], { w: 2.6, seed: 7 });
            Ink.stroke(x, [[710, 200], [820, 200]], { w: 2.6, seed: 8 }); Ink.stroke(x, [[710, 220], [820, 220]], { w: 2.6, seed: 9 });
            arrow(x, [[52, 180], [128, 180]], { seed: 10 }); arrow(x, [[728, 180], [806, 180]], { seed: 11 });
            text(x, 'naphtha', 88, 160, { font: 'hand', size: 22, align: 'center' }); text(x, 'in', 88, 254, { font: 'hand', size: 22, align: 'center' });
            const burn = geo.rect(250, 410, 360, 16, 6); Ink.hatchFill(x, burn, 1, B, 1.6); Ink.stroke(x, burn, { w: 2.2, seed: 12 });
            text(x, 'CRACKER', 430, 36, { size: 24, align: 'center' });
          }),
          S.layer(W, HH, (x) => { // the reactor
            const ves = geo.rect(16, 76, 828, 348, 30); Ink.hatchShadow(x, ves, 1, 6, 6); Ink.stroke(x, ves, { w: 3, seed: 5 });
            text(x, 'REACTOR', 24, 60, { size: 24 });
          }),
        ];
      }
      buildArt(); S.onFonts = buildArt;

      const CAPS = [
        ['<b>Tap the rig</b> to drill down through the sea bed. Keep tapping!', '<b>Crude oil</b> is drilled from deep underground. It is a <b>fossil fuel</b>, and it is <b>finite</b>: once it is used up, it is gone.'],
        ['<b>Tap the furnace</b> to heat the crude oil. Watch what the vapours do in the tall column.', 'This is <b>fractional distillation</b>. The hot vapours rise and separate into <b>fractions</b> at different heights. The fraction used to make polymers is <b>naphtha</b>.'],
        ['Naphtha is made of long molecules. <b>Tap each long molecule</b> to hit it with heat.', 'This is <b>cracking</b>: heat breaks the long naphtha molecules into small molecules called <b>monomers</b> (ethene is one).'],
        ['<b>Tap the monomers</b> one at a time to join them, end to end.', 'This is <b>polymerisation</b>: <b>thousands</b> of monomers join into one long chain called a <b>polymer</b>. <i>Mono</i> = one, <i>poly</i> = many.'],
      ];
      function setCap() {
        let h = CAPS[cur][done[cur] ? 1 : 0];
        if (cur === 3 && !done[3] && poly.joined >= 12) h = 'Twelve joined, but real chains are far longer. <b>Tap the reactor</b> to let it run.';
        cap.innerHTML = h;
        tabB.forEach((b, i) => { const open = i === 0 || done[i - 1]; b.disabled = !open; b.classList.toggle('ghost', i !== cur); b.textContent = `${done[i] ? '✓ ' : ''}${i + 1}. ${STOPS[i]}`; });
        nextB.style.display = done[cur] && cur < 3 ? '' : 'none';
      }
      function finish(i) {
        if (done[i]) return; done[i] = true; Book.sfx('success', { gain: 0.3 });
        const n = done.filter(Boolean).length;
        r.set({ answer: 'completed: ' + STOPS.map((s, k) => `${s} ${done[k] ? '✓' : '✗'}`).join(', '), correct: n === 4 ? true : null, score: n, max: 4, done: done.slice() });
        setCap(); after();
      }
      function show(i) { cur = i; setCap(); Book.sfx('paper', { gain: 0.3 }); S.go(); }

      S.render = (dt, t) => {
        const x = S.ctx; S.blit(art[cur], 0, 0);
        if (cur === 0) {
          rig.p += (rig.tgt - rig.p) * Math.min(1, dt * 5);
          const tip = 114 + rig.p * (380 - 114), spin = Math.sin(t * 30) * (Math.abs(rig.tgt - rig.p) > 0.01 ? 2 : 0);
          flame(x, 234, 52, 20 + 5 * Math.sin(t * 11), 6);
          Ink.stroke(x, [[410, 22], [410 + spin * 0.3, tip]], { w: 3.4, seed: 31 });
          pen(x, [[402 + spin, tip - 2], [410, tip + 14], [418 + spin, tip - 2], [402 + spin, tip - 2]], { w: 2.4, wob: false });
          if (rig.p > 0.97) { // oil comes up the pipe and along to shore
            for (let i = 0; i < 7; i++) { const q = (t * 0.5 + i / 7) % 1; dot(x, 410, 380 - q * 270, 5, 0.95); }
            for (let i = 0; i < 5; i++) { const q = (t * 0.5 + i / 5) % 1; dot(x, 530 + q * 160, 104, 5, 0.95); }
            if (!done[0]) finish(0);
          } else if (!rig.taps) { text(x, 'tap to drill!', 560, 150, { font: 'hand', size: 24, color: RD }); }
          else text(x, 'keep tapping!', 560, 150, { font: 'hand', size: 24, color: RD });
          if (done[0]) text(x, 'oil!', 600, 396, { font: 'hand', size: 24, color: RD });
        } else if (cur === 1) {
          col.shown += (col.heat - col.shown) * Math.min(1, dt * 1.6);
          const h = col.shown;
          // furnace flames grow with heat; thermometer
          for (let i = 0; i < 5; i++) flame(x, 96 + i * 22, 396, 10 + h * 56 + 6 * Math.sin(t * 10 + i * 2) * (0.3 + h), 8);
          x.fillStyle = 'rgba(214,40,40,.75)'; x.fillRect(254, 246 - h * 176, 10, h * 176 + 6); x.beginPath(); x.arc(259, 262, 12, 0, 7); x.fill();
          // liquid oil sitting in the bottom, vapour particles rising to their own levels
          parts.forEach((p) => {
            const up = sstep(0, 1, clamp(h / THR[p.c])), y = 384 - (384 - LEV[p.c]) * (p.c === 4 ? 0 : up) + Math.sin(t * 3 + p.ph) * (3 + 5 * h) + p.j * 0.8;
            const nap = p.c === 2 && col.sep > 0.5;
            dot(x, p.x + Math.sin(t * 2 + p.ph) * 4, y, p.c === 4 ? 6 : 5, 0.85, nap ? RD : B);
          });
          if (h > 0.985 && col.sep < 1) col.sep = Math.min(1, col.sep + dt * 0.8);
          if (col.sep > 0) {
            const N = ['gases', 'petrol', 'NAPHTHA', 'diesel', 'bitumen'];
            N.forEach((n, i) => { const y = (i === 4 ? 400 : LEV[i] + 20) + 14, a = sstep(i * 0.15, i * 0.15 + 0.4, col.sep); if (a <= 0) return;
              for (let k = 0; k < 3; k++) { const q = (t * 0.6 + k / 3) % 1; dot(x, 470 + q * 80, y - 8, 4, 0.9 * a, i === 2 ? RD : B); }
              if (i === 2) { Ink.drawBubble(x, n, 566, y + 4, 34, RD, a, -0.02); if (a >= 1) text(x, '← the one for polymers', 566, y + 34, { font: 'hand', size: 22, color: RD }); }
              else text(x, n, 566, y, { size: 24, a: 0.92 * a }); });
            if (col.sep >= 1 && !done[1]) finish(1);
          }
          if (!col.heat) { text(x, 'tap to heat!', 140, 250, { font: 'hand', size: 24, color: RD, align: 'center' }); }
        } else if (cur === 2) {
          for (let i = 0; i < 12; i++) flame(x, 268 + i * 29.5, 410, 22 + 8 * Math.sin(t * 9 + i * 1.7), 8);
          crk.forEach((m, i) => {
            if (m.done && m.t < 1) m.t = Math.min(1, m.t + dt * 1.3);
            const bob = Math.sin(t * 1.6 + i * 2) * 6, e = sstep(0, 1, m.t);
            const st = [0, 1, 2, 3].map((j) => { const off = (j - 1.5) * 46; return [m.cx + Math.cos(m.an) * off, m.cy + bob + Math.sin(m.an) * off + (j % 2 ? -1 : 1) * 9, m.an + (j % 2 ? 0.4 : -0.4)]; });
            if (!m.done) for (let j = 0; j < 3; j++) { const [ax, ay, aa] = st[j], [bx, by, ba] = st[j + 1]; pen(x, [[ax + Math.cos(aa) * 21, ay + Math.sin(aa) * 21], [bx - Math.cos(ba) * 21, by - Math.sin(ba) * 21]], { w: 2.4, wob: false }); }
            for (let j = 0; j < 4; j++) {
              const [sx, sy, sa] = st[j], o = m.out[j], ex = o.x + Math.sin(t * 1.3 + j + i) * 5, ey = o.y + Math.cos(t * 1.1 + j * 2 + i) * 5;
              mono(x, sx + (ex - sx) * e, sy + (ey - sy) * e, sa + (o.an - sa) * e, m.done ? RD : B);
            }
            if (m.done && m.t < 0.6) text(x, 'crack!', m.cx, m.cy - 34, { font: 'hand', size: 26, color: RD, align: 'center', a: 1 - m.t / 0.6 });
          });
          if (!crk.some((m) => m.done)) text(x, 'tap a long molecule', 300, 84, { font: 'hand', size: 23, color: RD, align: 'center' });
          if (crk.every((m) => m.done && m.t >= 1) && !done[2]) finish(2);
          if (done[2]) text(x, 'monomers', 600, 84, { font: 'hand', size: 24, color: RD, align: 'center' });
        } else {
          // the growing chain
          MON.forEach((m) => { if (m.slot >= 0 && m.t < 1) m.t = Math.min(1, m.t + dt * 2.6); });
          const zoom = sstep(0, 0.35, poly.run);
          for (let i = 0; i < poly.joined - 1; i++) { const a = MON.find((m) => m.slot === i), b = MON.find((m) => m.slot === i + 1); if (a.t >= 1 && b.t >= 1) { const [ax, ay] = slot(i), [bx, by] = slot(i + 1); pen(x, [[ax + 21, ay], [bx - 21, by]], { w: 2.4, wob: false, color: RD }); } }
          MON.forEach((m, i) => {
            if (m.slot < 0) { mono(x, m.x + Math.sin(t * 1.4 + i) * 6, m.y + Math.cos(t * 1.2 + i * 2) * 6, m.an + Math.sin(t + i) * 0.3, B); return; }
            const [sx, sy, sa] = slot(m.slot), e = sstep(0, 1, m.t);
            mono(x, m.x + (sx - m.x) * e, m.y + (sy - m.y) * e, m.an + (sa - m.an) * e, RD);
          });
          if (poly.running) { poly.run = Math.min(1, poly.run + dt / 3.4); if (poly.run >= 1) { poly.running = false; finish(3); } }
          if (poly.run > 0) { // the chain races on, far too long to draw full size
            const P = [], n = Math.floor(600 * sstep(0.05, 1, poly.run));
            for (let i = 0; i <= n; i++) { const u = i / 600, row = Math.floor(u * 4), f = u * 4 - row, px = row % 2 ? 100 + f * 660 : 760 - f * 660; P.push([px + Math.sin(i * 0.5) * 3, 300 - row * 54 + Math.sin(f * 30) * 9 + (f > 0.93 ? -(f - 0.93) / 0.07 * 27 : f < 0.07 && row ? (0.07 - f) / 0.07 * 27 : 0)]); }
            if (P.length > 1) { pen(x, P, { w: 2.4, wob: false, color: RD, a: 0.9 * zoom }); for (let i = 0; i < P.length; i += 6) dot(x, P[i][0], P[i][1], 3, 0.9, RD); }
          }
          const count = poly.run > 0 ? Math.round(12 * Math.pow(5000 / 12, sstep(0, 1, poly.run))) : poly.joined;
          Ink.drawBubble(x, 'units in the chain: ' + (poly.run >= 1 ? '5000+' : count), 836, 56, 34, RD, 1, 0, 'right');
          if (!poly.joined) text(x, 'tap a monomer to start the chain', 430, 110, { font: 'hand', size: 23, color: RD, align: 'center' });
          if (poly.joined >= 12 && !poly.run) text(x, 'tap here: let the reactor run!', 430, 200, { font: 'hand', size: 26, color: RD, align: 'center' });
          if (done[3]) text(x, 'poly = many', 430, 412, { font: 'hand', size: 24, color: RD, align: 'center' });
        }
        return true;
      };

      S.c.addEventListener('click', (e) => {
        const [px, py] = S.pos(e);
        if (cur === 0) { if (rig.tgt < 1) { rig.taps++; rig.tgt = Math.min(1, rig.tgt + 0.2); Book.sfx('thud', { gain: 0.35 }); } }
        else if (cur === 1) { if (col.heat < 1) { col.heat = Math.min(1, col.heat + 0.2); Book.sfx('pop', { gain: 0.35 }); } }
        else if (cur === 2) {
          const m = crk.filter((q) => !q.done).sort((a, b) => Math.abs(py - a.cy) - Math.abs(py - b.cy))[0];
          if (m && Math.abs(px - m.cx) < 130 && Math.abs(py - m.cy) < 56) { m.done = true; Book.sfx('error', { gain: 0.25 }); Book.scribble(0.2); }
        } else {
          if (poly.joined >= 12) { if (!poly.run && !poly.running) { poly.running = true; poly.run = 0.001; Book.scribble(1.2); setCap(); } return; }
          const free = MON.filter((m) => m.slot < 0).map((m) => [Math.hypot(px - m.x, py - m.y), m]).sort((a, b) => a[0] - b[0])[0];
          if (free && free[0] < 62) { free[1].slot = poly.joined++; Book.sfx('tick', { gain: 0.6 }); if (poly.joined >= 12) setCap(); }
        }
        S.go();
      });

      // ------------------------------------------------------------------ notes, then the recall quiz
      const rest = ui.el('div', '');
      const add = (e) => { rest.appendChild(e); return e; };
      add(ui.el('h2', '', 'The journey in four steps'));
      const notes = add(ui.box('<b>1.</b> <span class="key">Crude oil</span> is drilled from underground. It is a <b>finite</b> (non-renewable) <b>fossil fuel</b>.<br>'
        + '<b>2.</b> <span class="key">Fractional distillation</span> at a refinery separates the oil into fractions. One fraction is <b>naphtha</b>.<br>'
        + '<b>3.</b> <span class="key">Cracking</span> breaks naphtha into small molecules called <b>monomers</b>.<br>'
        + '<b>4.</b> <span class="key">Polymerisation</span> joins thousands of monomers into long chains called <b>polymers</b>.', { tag: 'Notes' }));
      const notes2 = add(ui.box('Before a polymer is sold (as granules, powders, sheets, rods, films or foams), <b>additives</b> are mixed in:<br>'
        + '<span class="key">Pigments</span> give it its <b>colour</b>.<br>'
        + '<span class="key">Plasticisers</span> make it <b>softer and more flexible</b>.<br>'
        + '<span class="key">Stabilisers</span> help it resist <b>UV sunlight</b>.', { tag: 'Additives' }));
      const startP = add(ui.el('p', '', 'Read the notes, then test yourself. <b>The notes and the journey will blur</b> until you have answered all four questions.'));
      const startB = add(ui.el('button', 'btn', 'I have read them: quiz me ▶')); startB.type = 'button'; startB.style.margin = '0 0 var(--R)';
      const quiz = add(ui.el('div', ''));
      const qadd = (e) => { quiz.appendChild(e); return e; };
      qadd(ui.sort({ id: 'p02.sequence', label: 'Order the four stages from crude oil to polymer', q: 'Put the four stages in order. Tap a card, then tap its place.',
        buckets: ['1st', '2nd', '3rd', '4th'],
        items: [
          { t: 'Drilling for crude oil', b: 0, mis: 'polymer-source' },
          { t: 'Fractional distillation', b: 1, mis: 'polymer-source' },
          { t: 'Cracking', b: 2, mis: 'polymer-source' },
          { t: 'Polymerisation', b: 3, mis: 'polymer-source' },
        ],
        explain: 'Drill the crude oil, distil it into fractions, crack the naphtha into monomers, then polymerise the monomers into chains.' }));
      qadd(ui.mcq({ id: 'p02.mono', label: 'What is a monomer?', q: 'What is a <b>monomer</b>?',
        options: [
          { t: 'A small molecule that can join into a long chain', ok: true },
          { t: 'A long chain made from thousands of joined units', mis: 'monomer-polymer', why: 'That is the polymer (poly = many). The monomer is the single small unit (mono = one) that the chain is built from.' },
          { t: 'A fraction of crude oil from the tall column', mis: 'polymer-source', why: 'That fraction is naphtha. It has to be cracked into much smaller molecules first: those are the monomers.' },
          { t: 'A substance mixed in to give the plastic colour', mis: 'additive-mixup', why: 'That is a pigment, one of the additives. A monomer is one of the small molecules that the chain itself is made from.' },
        ],
        explain: 'Mono = one. Monomers are the small molecules made by cracking; polymerisation joins thousands of them into a polymer.' }));
      qadd(ui.match({ id: 'p02.additives', label: 'Match each additive to its job (pigment, plasticiser, stabiliser)', q: 'Tap an additive, then tap the job it does.',
        pairs: [
          ['Pigment', 'Gives the polymer its colour', 'additive-mixup'],
          ['Plasticiser', 'Makes it softer and more flexible', 'additive-mixup'],
          ['Stabiliser', 'Helps it resist UV sunlight', 'additive-mixup'],
        ] }));
      qadd(ui.tf({ id: 'p02.finite', label: 'True/false: crude oil is a renewable resource', statement: 'Crude oil is a renewable resource, so we will never run out of it.', answer: false, mis: 'oil-renewable',
        explain: 'Crude oil is a <b>finite</b> (non-renewable) fossil fuel. That is one reason why reducing, reusing and recycling plastics matters.' }));
      const doneMsg = add(ui.el('p', 'green', '✓ All four answered: your notes are back.'));

      const QIDS = ['p02.sequence', 'p02.mono', 'p02.additives', 'p02.finite'];
      const qDone = (id) => { const it = got(id); if (!it) return false; if (id === 'p02.additives') return it.correct === true || it.correct === false; if (id === 'p02.finite') return true; return it.correct === true || it.attempts >= 3; };
      let started = QIDS.some((id) => got(id));
      function gate() {
        const all = QIDS.every(qDone), lock = started && !all;
        [journey, notes, notes2].forEach((e) => e.classList.toggle('peek-lock', lock));
        quiz.style.display = started ? '' : 'none'; startB.style.display = started ? 'none' : ''; startP.style.display = started ? 'none' : '';
        doneMsg.style.display = started && all ? '' : 'none';
      }
      startB.onclick = () => { started = true; Book.sfx('paper', { gain: 0.4 }); gate(); };
      quiz.addEventListener('click', () => setTimeout(gate, 80));
      function after() { rest.style.display = done.every(Boolean) ? '' : 'none'; }
      after(); gate(); setCap(); S.go();
    },
  });
})();
