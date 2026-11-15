// Page 2 — Input → process → output: a block diagram that draws itself, build-the-block-diagram for three products
// (each one "runs" when it is right), a ten-card sort and block diagram vs circuit diagram.
(function () {
  'use strict';
  const B = Ink.BLUE, RD = Ink.RED, GR = Ink.GREEN, rgba = Ink.rgba, geo = Ink.geo;
  const HANDF = (s) => `400 ${s}px "Gloria Hallelujah", "Comic Sans MS", cursive`;
  const LABF = (s) => `600 ${s}px Fredoka, "Arial Rounded MT Bold", system-ui, sans-serif`;
  const PAPER = '#fbfaf5';
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const win = (t, a, b) => clamp((t - a) / (b - a));
  const close = (P) => P.concat([P[0]]);
  const arc = (cx, cy, rx, ry, a0, a1, n = 24) => { const o = []; for (let i = 0; i <= n; i++) { const a = a0 + ((a1 - a0) * i) / n; o.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); } return o; };

  function text(x, s, px, py, o = {}) {
    x.save(); const f = o.font === 'hand' ? HANDF : LABF; x.font = f(o.size || 22);
    x.fillStyle = rgba(o.color || B, o.a ?? 0.92); x.textAlign = o.align || 'left'; x.textBaseline = 'alphabetic';
    x.translate(px, py); if (o.rot) x.rotate(o.rot); x.fillText(s, 0, 0); x.restore();
  }
  function wrap(x, s, maxW, size) {
    x.save(); x.font = HANDF(size); const out = []; let line = '';
    s.split(' ').forEach((w) => { const t = line ? line + ' ' + w : w; if (line && x.measureText(t).width > maxW) { out.push(line); line = w; } else line = t; });
    if (line) out.push(line); x.restore(); return out;
  }
  function pen(x, pts, o = {}) {
    const P = o.wob === false ? pts : geo.wob(geo.seg(pts, 3), o.seed ?? 11, o.amp ?? 0.6);
    x.save(); x.strokeStyle = rgba(o.color || B, o.a ?? 0.8); x.lineWidth = o.w ?? 1.4; x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath();
    P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); if (o.close) x.closePath(); x.stroke(); x.restore();
  }
  const dot = (x, px, py, r, a = 0.9, c = B) => { x.fillStyle = rgba(c, a); x.beginPath(); x.arc(px, py, r, 0, 7); x.fill(); };
  const blank = (x, P) => { x.save(); x.globalCompositeOperation = 'source-over'; x.fillStyle = PAPER; x.beginPath(); P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.fill(); x.restore(); };
  // a pointing finger whose tip is at (tx, ty)
  function finger(x, tx, ty, an, sc = 1) {
    x.save(); x.translate(tx, ty); x.rotate(an); x.scale(sc, sc);
    const FP = [[120, -17]].concat(arc(6, 0, 17, 17, Math.PI * 1.5, Math.PI * 0.5, 12), [[120, 17]]);
    blank(x, FP); Ink.stroke(x, FP, { w: 2.4, seed: 61 });
    pen(x, arc(8, 0, 10, 10, Math.PI * 1.35, Math.PI * 0.65, 8).concat([[22, 8], [22, -8], [2, -8]]), { w: 1.4, seed: 4, amp: 0.3 });
    pen(x, [[58, -11], [62, 0], [58, 11]], { w: 1.2, a: 0.6 }); x.restore();
  }
  function note(x, cx, cy, s = 1, col = RD) {
    x.save(); x.translate(cx, cy); x.rotate(-0.35); x.fillStyle = rgba(col, 0.9); x.beginPath(); x.ellipse(0, 0, 7 * s, 5 * s, 0, 0, 7); x.fill(); x.restore();
    pen(x, [[cx + 6 * s, cy - 2 * s], [cx + 6 * s, cy - 26 * s], [cx + 16 * s, cy - 18 * s]], { w: 2.2, color: col, wob: false, a: 0.95 });
  }

  function Stage(parent, W, Hh, touch) {
    const c = document.createElement('canvas'); parent.appendChild(c);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = Math.round(W * dpr); c.height = Math.round(Hh * dpr);
    Object.assign(c.style, { width: '100%', height: 'auto', aspectRatio: W + ' / ' + Hh, display: 'block', touchAction: touch || 'manipulation', userSelect: 'none', webkitUserSelect: 'none', cursor: 'pointer' });
    const ctx = c.getContext('2d');
    const S = { c, ctx, W, H: Hh, render: () => false };
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
    if (document.fonts) document.fonts.ready.then(() => { S.onFonts && S.onFonts(); S.go(); });
    return S;
  }

  // ------------------------------------------------------------------ the three products
  const SLOT = ['INPUT', 'PROCESS', 'OUTPUT'];
  const PRODUCTS = [
    { id: 'doorbell', name: 'Doorbell', blurb: 'A visitor presses the button by the door and a tune plays in the hall.', order: [2, 0, 1],
      cards: [{ t: 'push switch', hint: 'The push switch notices a person pressing it. Is that sensing, deciding, or something you can hear?' },
        { t: 'chip that plays the tune', hint: 'The chip works out what to do when a signal arrives. Which block does the thinking?' },
        { t: 'speaker', hint: 'The speaker turns a signal into sound you can hear. Which block gives us something we can use?' }],
      ran: 'Press → signal → the chip plays its tune → signal → sound from the speaker.',
      paint(x) {
        const door = [[18, 26], [128, 26], [128, 250], [18, 250]]; Ink.stroke(x, close(door), { w: 2.6, seed: 3 });
        [[32, 42, 82, 84], [32, 142, 82, 92]].forEach(([a, b, w, h], i) => { const p = geo.rect(a, b, w, h, 4); Ink.hatchFill(x, p, 1, B, 0.5); Ink.stroke(x, p, { w: 1.7, seed: 5 + i, retrace: false }); });
        Ink.stroke(x, geo.ellipse(116, 136, 5, 5), { w: 1.8, seed: 7, retrace: false }); pen(x, [[8, 250], [226, 250]], { w: 2.2, seed: 2 });
        const pl = geo.rect(156, 96, 54, 84, 8); Ink.hatchShadow(x, pl, 1, 5, 5); blank(x, pl); Ink.stroke(x, pl, { w: 2.3, seed: 8 });
        Ink.stroke(x, geo.ellipse(183, 144, 14, 14), { w: 2.2, seed: 9 }); pen(x, arc(183, 118, 9, 8, Math.PI, Math.PI * 2, 10).concat([[194, 124], [172, 124], [174, 118]]), { w: 1.5, wob: false });
      },
      live(x, u, t) {
        const press = u > 0 && u < 1.1 ? Math.min(1, u / 0.25) : 0;
        dot(x, 183, 144, press ? 9 : 6, 0.85, press ? RD : B);
        if (press) finger(x, 190 + (1 - press) * 26, 150 + (1 - press) * 20, 0.7, 0.8);
      },
      out(x, cx, y, u, t) { [-62, -8, 50].forEach((dx, i) => { const k = win(u, i * 0.18, i * 0.18 + 0.3); if (k > 0) note(x, cx + dx, y + 26 - Math.sin(t * 4 + i) * 4, 1.1); }); if (u > 0.5) text(x, 'ding dong!', cx + 4, y + 60, { font: 'hand', size: 22, color: RD, align: 'center' }); } },
    { id: 'fridge', name: 'Fridge door alarm', blurb: 'Leave the fridge door open for more than a minute and it beeps at you.', order: [1, 2, 0],
      cards: [{ t: 'door switch', hint: 'The door switch notices whether the door is shut. Is that sensing, deciding, or something you can hear?' },
        { t: 'timer: open over 60 s?', hint: 'The timer waits and then decides whether to raise the alarm. Which block does the thinking?' },
        { t: 'buzzer', hint: 'The buzzer turns a signal into a beep you can hear. Which block gives us something we can use?' }],
      ran: 'Door open → signal → the timer counts past 60 s → signal → beep from the buzzer.',
      paint(x) {
        const body = geo.rect(30, 22, 118, 228, 8); Ink.hatchShadow(x, body, 1, 6, 6); blank(x, body); Ink.stroke(x, body, { w: 2.6, seed: 3 });
        pen(x, [[30, 92], [148, 92]], { w: 2.2, seed: 4 }); pen(x, [[136, 44], [136, 76]], { w: 3, wob: false });
        [128, 168, 208].forEach((y, i) => pen(x, [[40, y], [138, y]], { w: 1.4, seed: 5 + i, a: 0.7 }));
        Ink.stroke(x, close([[52, 128], [52, 106], [58, 100], [58, 94], [66, 94], [66, 100], [72, 106], [72, 128]]), { w: 1.6, seed: 9, retrace: false });
        Ink.stroke(x, geo.ellipse(104, 156, 12, 11), { w: 1.6, seed: 10, retrace: false }); Ink.stroke(x, geo.rect(48, 184, 36, 24, 3), { w: 1.6, seed: 11, retrace: false });
        const leaf = [[148, 94], [206, 110], [206, 262], [148, 250]]; Ink.hatchFill(x, leaf, 1, B, 0.7); Ink.stroke(x, close(leaf), { w: 2.4, seed: 12 });
        pen(x, [[196, 136], [196, 176]], { w: 3, wob: false }); pen(x, [[8, 252], [226, 252]], { w: 2, seed: 2 });
      },
      live(x, u, t) { if (u > 0) { const s = Math.min(61, Math.floor(50 + u * 5.5)); text(x, s + ' s', 188, 62, { size: 26, color: RD, align: 'center' }); pen(x, geo.ellipse(188, 52, 36, 26), { w: 2, color: RD, a: 0.9 }); } },
      out(x, cx, y, u, t) { const on = Math.sin(t * 9) > -0.3; [-1, 1].forEach((s) => [0, 1].forEach((i) => pen(x, arc(cx + s * 74, y + 24, 10 + i * 10, 14 + i * 10, s > 0 ? -0.8 : Math.PI - 0.8, s > 0 ? 0.8 : Math.PI + 0.8, 8), { w: 2.2, color: RD, wob: false, a: on ? 0.95 : 0.3 }))); text(x, 'BEEP!', cx, y + 32, { size: 26, color: RD, align: 'center' }); } },
    { id: 'scales', name: 'Digital kitchen scales', blurb: 'Put some food on top and its weight appears in grams.', order: [0, 2, 1],
      cards: [{ t: 'pressure sensor', hint: 'The pressure sensor notices the force pressing down on it. Is that sensing, deciding, or something you can see?' },
        { t: 'chip that works out the grams', hint: 'The chip turns the signal into a number of grams. Which block does the working out?' },
        { t: 'number display', hint: 'The display turns a signal into numbers you can see. Which block gives us something we can use?' }],
      ran: 'Food pressing down → signal → the chip works out the grams → signal → numbers on the display.',
      paint(x) {
        const base = [[24, 188], [212, 188], [200, 246], [36, 246]]; Ink.hatchShadow(x, base, 1, 6, 6); blank(x, base); Ink.stroke(x, close(base), { w: 2.6, seed: 3 });
        const dsp = geo.rect(74, 200, 88, 34, 5); Ink.stroke(x, dsp, { w: 2, seed: 4 });
        const pan = [[30, 160], [206, 160], [198, 172], [38, 172]]; Ink.hatchFill(x, pan, 1, B, 1.4); Ink.stroke(x, close(pan), { w: 2.4, seed: 5 });
        pen(x, [[104, 172], [104, 188]], { w: 2.2, wob: false }); pen(x, [[132, 172], [132, 188]], { w: 2.2, wob: false }); pen(x, [[8, 250], [226, 250]], { w: 2, seed: 2 });
      },
      live(x, u, t) {
        text(x, u > 0.55 ? '182 g' : '0 g', 118, 226, { size: 24, align: 'center', color: u > 0.55 ? RD : B });
        if (u > 0) { const k = Math.min(1, u / 0.5), ay = 40 + k * k * 96 - (u > 0.5 && u < 0.7 ? Math.sin((u - 0.5) * 15.7) * 6 : 0);
          const ap = geo.ellipse(118, ay, 24, 22); blank(x, ap); Ink.stroke(x, ap, { w: 2.3, seed: 21 }); pen(x, [[118, ay - 20], [122, ay - 32]], { w: 2.2 }); pen(x, geo.curve([122, ay - 30], [132, ay - 40], [142, ay - 34], [140, ay - 26], 8).concat([[122, ay - 30]]), { w: 1.6 }); pen(x, arc(118, ay, 15, 14, 3.4, 4.3, 6), { w: 1.3, a: 0.6 }); }
      },
      out(x, cx, y, u, t) { const r = geo.rect(cx - 62, y + 2, 124, 40, 6); Ink.stroke(x, r, { w: 2.2, color: RD, seed: 7 }); text(x, '182 g', cx, y + 32, { size: 26, color: RD, align: 'center' }); } },
  ];

  Book.page({
    id: 'p02',
    title: 'Input → process → output',
    build(ui, root) {
      ui.h('Input → process → output');
      ui.p('A <span class="key">system</span> is a set of parts that work together to do a job. Designers do not start with wires: they split the system into <b>three blocks</b> and draw a <span class="key">block diagram</span>. Watch one being drawn for the night light.');
      const got = (id) => Book.state.items[id];

      // ------------------------------------------------------------------ the block diagram draws itself
      const BXS = [26, 328, 630], BWD = 204, BYT = 128, BHT = 120, MID = BYT + BHT / 2;
      ui.anim({ w: 860, h: 400, duration: 16, poster: 3.4,
        draw(k, t) {
          const x = k.ctx;
          k.text('the night light as a block diagram', 430, 44, 0.1, 1.2, { size: 24, align: 'center' });
          const T0 = [1.3, 4.6, 7.9];
          const names = ['INPUT', 'PROCESS', 'OUTPUT'], inside = [['light sensor'], ['microcontroller:', 'is it dark?'], ['lamp']], job = [['senses a change,', 'makes a signal'], ['decides what', 'to do'], ['turns the signal', 'into light']];
          BXS.forEach((bx, i) => {
            const a = T0[i];
            k.box(bx, BYT, BWD, BHT, a, a + 0.9, { w: 3, seed: 3 + i });
            k.text(names[i], bx + BWD / 2, BYT - 16, a + 0.9, a + 1.5, { font: 'bubble', size: 32, color: RD, align: 'center' });
            inside[i].forEach((s, j) => k.text(s, bx + BWD / 2, MID + 8 + (j - (inside[i].length - 1) / 2) * 32, a + 1.5 + j * 0.4, a + 2.0 + j * 0.4, { size: 24, align: 'center' }));
            job[i].forEach((s, j) => k.text(s, bx + BWD / 2, BYT + BHT + 44 + j * 30, 11.2 + i * 0.5 + j * 0.25, 11.7 + i * 0.5 + j * 0.25, { size: 22, align: 'center' }));
            if (i < 2) { const ax = bx + BWD + 8, a2 = T0[i + 1] - 0.75; k.arrow([[ax, MID], [ax + 82, MID]], a2, a2 + 0.5, { w: 3, seed: 9 + i }); k.text('signal', ax + 40, MID - 16, a2 + 0.3, a2 + 0.7, { size: 22, align: 'center' }); }
          });
          k.text('signals flow left to right', 430, 376, 13, 14, { size: 22, align: 'center', color: RD });
          // signal pulses run along the arrows, and the lamp lights
          if (t > 13.2) {
            const q = ((t - 13.2) * 0.9) % 1.6;
            [0, 1].forEach((i) => { const u = q - i * 0.6; if (u > 0 && u < 0.5) dot(x, BXS[i] + BWD + 8 + (u / 0.5) * 80, MID, 8, 0.95, RD); });
            if (q > 1.05 || t > 15.4) { const cx = BXS[2] + BWD / 2; for (let j = 0; j < 7; j++) { const a = Math.PI * (1.08 + (0.84 * j) / 6); pen(x, [[cx + Math.cos(a) * 62, MID + 34 + Math.sin(a) * 30], [cx + Math.cos(a) * 80, MID + 34 + Math.sin(a) * 44]], { w: 2.4, color: RD, wob: false }); } }
          }
        },
        sound(k) {
          [1.3, 4.6, 7.9].forEach((a) => { k.play('stroke', a, { material: 'pen', dur: 0.9, gain: 0.5 }); k.play('pop', a + 0.9, { gain: 0.25 }); k.play('stroke', a + 1.5, { material: 'pen', dur: 0.6, gain: 0.4 }); });
          k.play('stroke', 3.9, { material: 'pen', dur: 0.4, gain: 0.5 }); k.play('stroke', 7.2, { material: 'pen', dur: 0.4, gain: 0.5 });
          k.play('stroke', 11.2, { material: 'pen', dur: 1.6, gain: 0.4 }); [13.3, 13.9, 15.0, 15.6].forEach((a) => k.play('tick', a, { gain: 0.35 })); k.play('success', 14.4, { gain: 0.3 });
        },
      });
      const animC = root.querySelector('canvas.ink-anim');

      const notes = ui.box('<b>Input</b>: senses a change in the surroundings (light, heat, pressure, a person pressing something) and turns it into an electrical <span class="key">signal</span>.<br>'
        + '<b>Process</b>: decides what to do with the signal. It can time, count, compare and decide.<br>'
        + '<b>Output</b>: turns the signal into something we can see, hear or use (light, sound, movement).<br>'
        + 'A <b>block diagram</b> shows the blocks as boxes joined by arrows. The arrows are the signals, flowing left to right. It shows <b>what</b> each part does, not <b>how</b> it is wired: that is a circuit diagram.<br>'
        + '<span class="small">A system also needs a power supply (battery or mains), but that is not one of the three blocks. A <b>subsystem</b> is a smaller system inside a bigger one, like the doorbell inside a house.</span>', { tag: 'Notes' });

      // ------------------------------------------------------------------ build the block diagram
      ui.el('h2', '', 'Build the block diagram');
      ui.p('Three products, three parts each. <b>Drag</b> each part into the right box (or tap a part, then tap a box) and press <b>Check</b>. Get it right and the product runs! <span class="small">(Your notes and the night light diagram blur while you work.)</span>');
      const buildWrap = ui.el('div', '');
      const r = ui.record('p02.build', { label: 'Build block diagrams: doorbell, fridge alarm, kitchen scales (9 parts)', type: 'build', max: 9 });
      const saved = (r.get() || {}).prods || {};
      const lockEls = [notes, animC.closest('.ink-anim-wrap')];
      const allDone = () => units.every((U) => U.done);
      const lock = (on) => lockEls.forEach((e) => e.classList.toggle('peek-lock', on));
      const began = () => { if (!allDone()) { lock(true); Ink.stopAll(root); } };

      const W = 860, HH = 284, SX = [262, 472, 682], SW = 164, SY = 70, SH = 132, SM = SY + SH / 2, RUN = 3.4;
      const units = PRODUCTS.map((P, pi) => {
        const sv = saved[P.id] || {};
        const U = { P, slots: [null, null, null], marks: [null, null, null], tries: sv.n || 0, done: !!sv.done, score: sv.sc ?? null, wrong: sv.wrong || '', run: sv.done ? RUN + 1 : 0, running: false, sel: null };
        if (U.done) { U.slots = [0, 1, 2]; U.marks = sv.sc === 3 || sv.fixed ? [true, true, true] : ['c', 'c', 'c']; }
        const d = ui.el('div', 'act', '', buildWrap); requestAnimationFrame(() => Ink.frame(d, { shadow: false, w: 2.2 }));
        ui.el('div', 'q', `<b>${pi + 1}. ${P.name}.</b> ${P.blurb}`, d);
        const S = Stage(d, W, HH, 'manipulation');
        const row = ui.el('div', '', '', d); row.style.cssText = 'display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:10px;min-height:52px';
        const cards = P.order.map((ci) => { const c = ui.el('span', 'card', Book.esc(P.cards[ci].t), row); c._i = ci; c.style.cssText = 'touch-action:none;min-height:48px;padding:8px 14px'; return c; });
        const chk = ui.el('button', 'btn', 'Check', row); chk.style.cssText = 'margin:0 0 0 auto';
        const f = ui.el('div', 'fb', '', d);
        let art;
        const mkArt = () => { art = S.layer(W, HH, (x) => {
          P.paint(x);
          SLOT.forEach((s, i) => text(x, s, SX[i] + SW / 2, SY - 16, { size: 24, align: 'center' }));
          [0, 1].forEach((i) => { const a = [[SX[i] + SW + 6, SM], [SX[i + 1] - 7, SM]]; Ink.stroke(x, a, { w: 2.8, seed: 31 + i }); Ink.stroke(x, geo.head(geo.seg(a, 3), 12, 0.55), { w: 2.8, seed: 33 + i, retrace: false }); });
        }); };
        mkArt(); S.onFonts = mkArt;
        const sync = () => {
          cards.forEach((c) => { const used = U.slots.includes(c._i); c.style.visibility = used ? 'hidden' : ''; c.classList.toggle('picked', U.sel === c._i && !used); c.style.pointerEvents = U.done ? 'none' : ''; });
          row.style.display = U.done ? 'none' : 'flex'; chk.disabled = U.slots.includes(null);
          S.go();
        };
        S.render = (dt, t) => {
          const x = S.ctx; let busy = false;
          if (U.running) { U.run += dt; busy = true; if (U.run > RUN + 2.2) U.running = false; }
          const u = U.run;
          S.blit(art, 0, 0);
          P.live(x, u, t);
          SX.forEach((sx, i) => {
            const R = geo.rect(sx, SY, SW, SH, 10), ci = U.slots[i], m = U.marks[i];
            const hot = u > 0 && u < RUN && Math.abs(u - (0.9 + i * 1.0)) < 0.35;
            if (ci == null) {
              x.save(); x.setLineDash([9, 8]); x.strokeStyle = rgba(U.sel != null ? RD : B, U.sel != null ? 0.9 : 0.55); x.lineWidth = U.sel != null ? 2.6 : 2; x.beginPath(); R.forEach(([a, b], j) => (j ? x.lineTo(a, b) : x.moveTo(a, b))); x.stroke(); x.restore();
              text(x, U.sel != null ? 'tap here' : '?', sx + SW / 2, SM + (U.sel != null ? 8 : 14), { font: U.sel != null ? 'hand' : undefined, size: U.sel != null ? 22 : 40, align: 'center', color: U.sel != null ? RD : B, a: U.sel != null ? 0.9 : 0.35 });
              return;
            }
            const col = m === true ? GR : m === false ? RD : B;
            Ink.hatchShadow(x, R, 1, 6, 6, hot ? RD : B); blank(x, R);
            if (hot) { x.save(); x.fillStyle = 'rgba(255,225,60,.6)'; x.beginPath(); R.forEach(([a, b], j) => (j ? x.lineTo(a, b) : x.moveTo(a, b))); x.fill(); x.restore(); }
            Ink.stroke(x, R, { w: 2.8, seed: 41 + i, color: hot ? RD : col });
            const L = wrap(x, P.cards[ci].t, SW - 18, 22);
            L.forEach((s, j) => text(x, s, sx + SW / 2, SM + 8 + (j - (L.length - 1) / 2) * 28, { font: 'hand', size: 22, align: 'center' }));
            if (m === true) Ink.tick(x, sx + SW - 30, SY + 18, 0.8); else if (m === false) Ink.cross(x, sx + SW - 18, SY + 16, 0.8);
          });
          // the run: signals travel along the arrows, then the output does its thing
          if (u > 0) {
            [0, 1].forEach((i) => { const q = win(u, 1.25 + i * 1.0, 1.65 + i * 1.0); if (q > 0 && q < 1) dot(x, SX[i] + SW + 6 + q * (SX[i + 1] - SX[i] - SW - 12), SM, 8, 0.95, RD); });
            if (u > 2.9) P.out(x, SX[2] + SW / 2, SY + SH + 14, u - 2.9, t);
          }
          return busy;
        };
        const place = (ci, si) => { if (U.done || ci == null) return; began(); const from = U.slots.indexOf(ci); if (from >= 0) U.slots[from] = null; U.slots[si] = ci; U.marks = [null, null, null]; U.sel = null; Book.scribble(0.14); sync(); };
        const slotAt = (px, py) => SX.findIndex((sx) => px > sx - 16 && px < sx + SW + 16 && py > SY - 34 && py < SY + SH + 30);
        S.c.addEventListener('click', (e) => {
          if (U.done) { if (!U.running) { U.run = 0.01; U.running = true; S.go(); } return; }
          const [px, py] = S.pos(e), si = slotAt(px, py); if (si < 0) return;
          if (U.sel != null) place(U.sel, si);
          else if (U.slots[si] != null) { U.slots[si] = null; U.marks = [null, null, null]; Book.sfx('tick', { gain: 0.4 }); sync(); }
        });
        // cards: tap to pick, or drag onto a box
        cards.forEach((c) => {
          let st = null, ghost = null;
          c.addEventListener('pointerdown', (e) => { if (U.done) return; st = [e.clientX, e.clientY]; try { c.setPointerCapture(e.pointerId); } catch (er) {} });
          c.addEventListener('pointermove', (e) => {
            if (!st) return;
            if (!ghost && Math.hypot(e.clientX - st[0], e.clientY - st[1]) > 9) { ghost = c.cloneNode(true); ghost.style.cssText += ';position:fixed;z-index:60;pointer-events:none;transform:translate(-50%,-60%) rotate(-3deg);box-shadow:0 8px 18px rgba(30,46,150,.3);visibility:visible'; document.body.appendChild(ghost); c.style.opacity = 0.3; U.sel = c._i; began(); S.go(); }
            if (ghost) { ghost.style.left = e.clientX + 'px'; ghost.style.top = e.clientY + 'px'; }
          });
          const end = (e) => {
            if (!st) return; const wasDrag = !!ghost; st = null; c.style.opacity = '';
            if (ghost) { ghost.remove(); ghost = null; const rc = S.c.getBoundingClientRect(), si = slotAt(((e.clientX - rc.left) * W) / rc.width, ((e.clientY - rc.top) * HH) / rc.height); if (si >= 0 && e.type === 'pointerup') place(c._i, si); else { U.sel = null; sync(); } }
            else if (e.type === 'pointerup' && !wasDrag) { U.sel = U.sel === c._i ? null : c._i; began(); Book.sfx('tick', { gain: 0.5 }); sync(); }
          };
          c.addEventListener('pointerup', end); c.addEventListener('pointercancel', end);
        });
        chk.onclick = () => {
          if (U.done || U.slots.includes(null)) return;
          U.tries++; U.marks = U.slots.map((ci, si) => ci === si);
          const n = U.marks.filter(Boolean).length, ok = n === 3;
          if (U.score == null) { U.score = n; U.wrong = U.slots.map((ci, si) => (ci === si ? '' : P.cards[ci].t + '→' + SLOT[si])).filter(Boolean).join(', '); U.mis = []; if (n < 3) U.mis.push('ipo-order'); if (U.slots[0] === 2 || U.slots[2] === 0) U.mis.push('input-vs-output'); }
          if (ok) { U.done = true; U.run = 0.01; U.running = true; Book.sfx('success', { gain: 0.35 }); f.className = 'fb on good'; f.innerHTML = '✓ It works! ' + P.ran + ' <span class="small">(Tap the diagram to run it again.)</span>'; }
          else if (U.tries >= 3) { U.done = true; U.fixed = true; U.slots = [0, 1, 2]; U.marks = ['c', 'c', 'c']; U.run = 0.01; U.running = true; Book.sfx('error', { gain: 0.3 }); f.className = 'fb on bad'; f.innerHTML = '✗ Here is the right diagram: ' + P.ran; }
          else { Book.sfx('error', { gain: 0.35 }); const bad = U.slots.filter((ci, si) => ci !== si); f.className = 'fb on bad'; f.innerHTML = `✗ ${n}/3 in the right box. ` + P.cards[bad[0]].hint + ' Move the crossed ones and check again.';
            setTimeout(() => { if (U.done) return; U.slots = U.slots.map((ci, si) => (ci === si ? ci : null)); U.marks = U.marks.map((m) => (m === true ? true : null)); sync(); }, 1400); }
          commit(); sync();
        };
        if (U.done) { f.className = 'fb on ' + (U.score === 3 ? 'good' : 'bad'); f.innerHTML = (U.score === 3 ? '✓ ' : '') + P.ran + ' <span class="small">(Tap the diagram to run it.)</span>'; }
        U.sync = sync; U.S = S; sync();
        return U;
      });
      function commit() {
        const tried = units.filter((U) => U.score != null), score = tried.reduce((a, U) => a + U.score, 0), mis = [...new Set(units.flatMap((U) => U.mis || []))];
        const prods = {}; units.forEach((U) => { if (U.score != null) prods[U.P.id] = { sc: U.score, n: U.tries, done: U.done, wrong: U.wrong, fixed: !!U.fixed }; });
        r.set({ answer: units.map((U) => U.P.name + ': ' + (U.score == null ? 'not tried' : `${U.score}/3 on first check${U.wrong ? ' (' + U.wrong + ')' : ''}, ${U.tries} check${U.tries > 1 ? 's' : ''}${U.done ? '' : ', not finished'}`)).join('; '),
          correct: allDone() ? score === 9 : null, score, max: 9, mis: mis.join(','), prods });
        if (allDone()) lock(false);
      }

      // ------------------------------------------------------------------ recall
      ui.el('h2', '', 'Input, process or output?');
      const sort = ui.sort({ id: 'p02.sort', label: 'Sort 10 devices: input / process / output', q: 'Sort the ten parts. <span class="small">(Tap a card, then tap its box. Your notes and diagrams blur while you sort.)</span>',
        buckets: ['INPUT', 'PROCESS', 'OUTPUT'],
        items: [
          { t: 'LDR (light sensor)', b: 0, mis: 'input-vs-output' }, { t: 'thermistor (temperature sensor)', b: 0, mis: 'input-vs-output' }, { t: 'push switch', b: 0, mis: 'input-vs-output' }, { t: 'pressure sensor', b: 0, mis: 'input-vs-output' },
          { t: 'microcontroller', b: 1, mis: 'process-role' }, { t: 'timer', b: 1, mis: 'process-role' }, { t: 'counter', b: 1, mis: 'process-role' },
          { t: 'lamp', b: 2, mis: 'input-vs-output' }, { t: 'buzzer', b: 2, mis: 'input-vs-output' }, { t: 'speaker', b: 2, mis: 'input-vs-output' },
        ],
        explain: 'Inputs sense (switches and sensors). The process decides, times or counts. Outputs give light, sound or movement.' });
      ui.hideWhile(sort, 'p02.sort', [notes, animC, buildWrap]);
      const dia = ui.mcq({ id: 'p02.diagram', label: 'What a block diagram shows (vs a circuit diagram)', q: 'What does a <b>block diagram</b> show?',
        options: [
          { t: 'What job each part does, and the order the signals flow in', ok: true },
          { t: 'How each component is wired up, drawn with circuit symbols', mis: 'block-vs-circuit', why: 'That describes a circuit diagram. A block diagram has no wiring in it: just boxes and arrows.' },
          { t: 'The exact size and shape of the product, drawn to scale', why: 'That would be a working drawing. A block diagram is only boxes joined by arrows.' },
          { t: 'Every step of the program, with a yes or no at each choice', why: 'That describes a flowchart for the program. A block diagram covers the whole system in just a few boxes.' },
        ],
        explain: 'A block diagram shows WHAT each part does (input → process → output). HOW it is wired comes later, in a circuit diagram.' });
      ui.hideWhile(dia, 'p02.diagram', [notes]);
    },
  });
})();
