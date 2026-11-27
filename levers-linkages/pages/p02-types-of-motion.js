// Page 2 — Four types of motion: four looping pen sketches (train, jigsaw, wheel, pendulum), a sort and the arrow symbols.
(function () {
  'use strict';
  const B = Ink.BLUE, RD = Ink.RED, rgba = Ink.rgba, geo = Ink.geo;
  const TAU = Math.PI * 2;
  function pen(x, pts, o = {}) {
    const P = o.wob === false ? pts : geo.wob(geo.seg(pts, 3), o.seed ?? 11, o.amp ?? 0.6);
    x.save(); x.strokeStyle = rgba(o.color || B, o.a ?? 0.8); x.lineWidth = o.w ?? 1.4; x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath();
    P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); if (o.close) x.closePath(); x.stroke(); x.restore();
  }
  const close = (P) => P.concat([P[0]]);
  const arc = (cx, cy, r, a0, a1, n = 28) => { const o = []; for (let i = 0; i <= n; i++) { const a = a0 + ((a1 - a0) * i) / n; o.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } return o; };
  const dot = (x, px, py, r, a = 0.9, c = B) => { x.fillStyle = rgba(c, a); x.beginPath(); x.arc(px, py, r, 0, 7); x.fill(); };

  // ---------- the four motion-arrow symbols ----------
  function drawSym(x, kind, cx, cy, col, s = 1) {
    const o = { color: col, w: 3, retrace: false }, hd = (P, sd) => Ink.stroke(x, geo.head(P, 13 * s, 0.55), Object.assign({ seed: sd }, o));
    if (kind === 'linear' || kind === 'recip') {
      const P = [[cx - 30 * s, cy], [cx + 30 * s, cy]];
      Ink.stroke(x, P, Object.assign({ seed: 3 }, o)); hd(geo.seg(P, 4), 4);
      if (kind === 'recip') hd(geo.seg(P.slice().reverse(), 4), 5);
    } else if (kind === 'rotary') {
      const P = arc(cx, cy, 17 * s, -1.25, 3.5, 30);
      Ink.stroke(x, P, Object.assign({ seed: 6 }, o)); hd(P, 7);
    } else {
      const P = arc(cx, cy - 34 * s, 46 * s, Math.PI / 2 + 0.72, Math.PI / 2 - 0.72, 24);
      Ink.stroke(x, P, Object.assign({ seed: 8 }, o)); hd(P, 9); hd(P.slice().reverse(), 10);
    }
  }
  function symCanvas(kind, col, w = 84, h = 52, s = 1) {
    const c = document.createElement('canvas'), dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = w * dpr; c.height = h * dpr; c.style.cssText = `width:${w}px;height:${h}px;flex:none;pointer-events:none`;
    const x = c.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.lineCap = 'round'; x.lineJoin = 'round';
    drawSym(x, kind, w / 2, kind === 'oscill' ? h / 2 - 5 * s : h / 2, col, s);
    return c;
  }

  // ---------- a small looping sketch ----------
  const W = 420, HH = 240;
  function Mini(parent, spec) {
    const wrap = document.createElement('div'); wrap.className = 'ink-anim-wrap'; wrap.style.margin = '0 0 6px'; parent.appendChild(wrap);
    const c = document.createElement('canvas'); wrap.appendChild(c);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = Math.round(W * dpr); c.height = Math.round(HH * dpr);
    Object.assign(c.style, { width: '100%', height: 'auto', aspectRatio: W + ' / ' + HH, display: 'block', touchAction: 'manipulation', cursor: 'pointer' });
    const btn = document.createElement('button'); btn.className = 'ink-play'; btn.type = 'button'; wrap.appendChild(btn);
    const ctx = c.getContext('2d');
    const layer = (w, h, paint) => { const L = document.createElement('canvas'); L.width = Math.ceil(w * dpr); L.height = Math.ceil(h * dpr); const x = L.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.lineCap = 'round'; x.lineJoin = 'round'; paint(x); L.w = w; L.h = h; return L; };
    let art = spec.art(layer), playing = false, ph = spec.poster || 0, played = 0, raf = 0, last = 0;
    const frame = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.globalCompositeOperation = 'source-over'; ctx.clearRect(0, 0, W, HH);
      ctx.globalCompositeOperation = 'multiply'; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      spec.draw(ctx, ph, art, (L, px, py) => ctx.drawImage(L, px, py, L.w, L.h));
    };
    const setBtn = () => { btn.textContent = playing ? '❚❚ pause' : '▶ play'; };
    const stop = () => { playing = false; cancelAnimationFrame(raf); raf = 0; setBtn(); };
    const tick = (now) => {
      raf = 0; if (!playing) return;
      const pg = c.closest('.page');
      if (!pg || pg.classList.contains('hidden') || wrap.closest('.peek-lock')) return stop(); // page turned or notes blurred
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60; last = now; ph += dt; played += dt;
      frame();
      if (played > 24) return stop(); // don't run for ever
      raf = requestAnimationFrame(tick);
    };
    const toggle = () => { if (playing) return stop(); playing = true; played = 0; last = 0; setBtn(); Book.sfx('tick', { gain: 0.4 }); raf = requestAnimationFrame(tick); };
    btn.onclick = toggle; c.addEventListener('click', toggle);
    frame(); setBtn();
    if (document.fonts) document.fonts.ready.then(() => { art = spec.art(layer); frame(); });
    return { wrap, stop };
  }

  // ---------- the four scenes ----------
  const SCENES = {
    linear: {
      poster: 1.72,
      art(layer) {
        return {
          bg: layer(W, HH, (x) => {
            Ink.stroke(x, [[8, 190], [412, 190]], { w: 2.4, seed: 3 }); pen(x, [[8, 201], [412, 201]], { w: 1.6, seed: 4 });
            for (let i = 0; i < 17; i++) pen(x, [[18 + i * 24, 191], [12 + i * 24, 201]], { w: 1.5, wob: false, a: 0.7 });
            const rr = H.rng(4); for (let i = 0; i < 14; i++) { const gx = rr.range(14, 400); pen(x, [[gx, 208], [gx - 7, 216]], { w: 1, a: 0.4, wob: false }); }
          }),
          train: layer(170, 110, (x) => {
            const boiler = geo.rect(56, 40, 82, 34, 10), cab = [[16, 20], [56, 20], [56, 76], [16, 76]];
            Ink.hatchFill(x, boiler, 1, B, 0.9); Ink.stroke(x, boiler, { w: 2.3, seed: 5 });
            Ink.hatchFill(x, cab, 1, B, 1.5);
            x.save(); x.globalCompositeOperation = 'destination-out'; x.fillRect(24, 28, 22, 18); x.restore();
            Ink.stroke(x, close(cab), { w: 2.3, seed: 6 }); Ink.stroke(x, close([[24, 28], [46, 28], [46, 46], [24, 46]]), { w: 1.8, seed: 7, retrace: false });
            Ink.stroke(x, [[8, 20], [62, 20]], { w: 2.6, seed: 8 });
            Ink.stroke(x, [[112, 40], [112, 20], [108, 14], [128, 14], [124, 20], [124, 40]], { w: 2.1, seed: 9 });
            Ink.stroke(x, arc(88, 40, 9, Math.PI, TAU, 10), { w: 2, seed: 10, retrace: false });
            Ink.stroke(x, [[10, 77], [142, 77]], { w: 2.4, seed: 11 });
            Ink.stroke(x, [[138, 62], [158, 88], [138, 88]], { w: 2.1, seed: 12 }); pen(x, [[142, 70], [142, 88]], { w: 1.3 }); pen(x, [[148, 77], [148, 88]], { w: 1.3 });
            [[32, 88, 13], [72, 90, 11], [108, 90, 11]].forEach(([a, b, r], i) => { Ink.stroke(x, geo.ellipse(a, b, r, r), { w: 2.3, seed: 13 + i }); dot(x, a, b, 2.4); });
          }),
        };
      },
      draw(x, ph, A, blit) {
        blit(A.bg, 0, 0);
        const u = (ph / 3.4) % 1, tx = -180 + 620 * u, ty = 190 - 102;
        blit(A.train, tx, ty);
        for (let i = 0; i < 3; i++) { const q = ((ph * 1.4 + i / 3) % 1), sx = tx + 118 - q * 62, sy = ty + 6 - q * 34; pen(x, geo.ellipse(sx, sy, 5 + q * 9, 4 + q * 7), { w: 1.5, a: 0.75 * (1 - q), wob: false }); }
        [0, 1, 2].forEach((i) => pen(x, [[tx - 8 - i * 4, ty + 34 + i * 16], [tx - 44 - i * 10, ty + 34 + i * 16]], { w: 1.6, a: 0.55, wob: false }));
      },
    },
    recip: {
      poster: 0.16,
      art(layer) {
        return {
          bg: layer(W, HH, (x) => {
            // the board being cut (end on) and the two trestles it rests on
            const bd = [[30, 150], [390, 150], [390, 170], [30, 170]];
            Ink.stroke(x, close(bd), { w: 2.3, seed: 3 });
            pen(x, [[40, 157], [200, 158]], { w: 1, a: 0.5, seed: 2 }); pen(x, [[230, 164], [380, 163]], { w: 1, a: 0.5, seed: 6 }); pen(x, [[60, 165], [150, 164]], { w: 1, a: 0.5, seed: 8 });
            [[64, 0], [236, 0]].forEach(([bx]) => { Ink.stroke(x, [[bx - 14, 232], [bx, 172], [bx + 14, 232]], { w: 2, seed: bx }); pen(x, [[bx - 8, 206], [bx + 8, 206]], { w: 1.4 }); });
            // the jigsaw
            const sole = [[168, 140], [316, 140], [320, 150], [164, 150]];
            Ink.hatchFill(x, sole, 1, B, 2); Ink.stroke(x, close(sole), { w: 2, seed: 4 });
            const body = [[184, 140], [182, 92], [196, 58], [232, 44], [286, 46], [304, 64], [306, 140]];
            Ink.hatchFill(x, body, 1, B, 0.8);
            const hole = geo.rect(212, 62, 66, 20, 9);
            x.save(); x.globalCompositeOperation = 'destination-out'; x.beginPath(); hole.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.fill(); x.restore();
            Ink.stroke(x, close(body), { w: 2.4, seed: 5 }); Ink.stroke(x, hole, { w: 1.9, seed: 7, retrace: false });
            pen(x, [[190, 104], [300, 104]], { w: 1.4 }); [0, 1, 2, 3].forEach((i) => pen(x, [[200 + i * 9, 114], [200 + i * 9, 130]], { w: 1.4, wob: false, a: 0.7 }));
            Ink.stroke(x, close([[280, 104], [300, 104], [300, 140], [280, 140]]), { w: 1.8, seed: 9, retrace: false });
            pen(x, geo.curve([184, 110], [140, 112], [150, 60], [96, 70], 24), { w: 2, a: 0.85 }); pen(x, geo.curve([96, 70], [60, 76], [50, 40], [14, 46], 20), { w: 2, a: 0.85 });
          }),
          blade: layer(24, 110, (x) => {
            const P = [[7, 2], [15, 2], [15, 12]]; for (let y = 12; y < 96; y += 8) P.push([19, y + 5], [15, y + 8]); P.push([13, 104], [7, 96]);
            Ink.stroke(x, close(P), { w: 1.7, seed: 3, retrace: false, amp: 0.3 });
          }),
        };
      },
      draw(x, ph, A, blit) {
        blit(A.bg, 0, 0);
        const off = Math.sin(ph * TAU * 1.5) * 15;
        x.save(); x.beginPath(); x.rect(270, 150.5, 60, 90); x.clip(); blit(A.blade, 279, 118 + off); x.restore();
        const rr = H.rng(Math.floor(ph * 12) + 3);
        for (let i = 0; i < 5; i++) dot(x, 300 + rr.range(0, 26), 176 + rr.range(0, 30), rr.range(0.8, 1.6), 0.6);
      },
    },
    rotary: {
      poster: 0.3,
      art(layer) {
        return {
          bg: layer(W, HH, (x) => {
            Ink.stroke(x, [[20, 212], [400, 212]], { w: 2.4, seed: 3 });
            const rr = H.rng(6); for (let i = 0; i < 14; i++) { const gx = rr.range(24, 396); pen(x, [[gx, 217], [gx - 7, 226]], { w: 1, a: 0.4, wob: false }); }
            // front fork holding the axle
            Ink.stroke(x, [[204, 122], [232, 30], [240, 8]], { w: 2.6, seed: 4 }); Ink.stroke(x, [[214, 124], [242, 32], [250, 10]], { w: 2.6, seed: 5 });
            Ink.stroke(x, geo.ellipse(210, 122, 9, 9), { w: 2.2, seed: 6 }); dot(x, 210, 122, 3);
          }),
          wheel: layer(190, 190, (x) => {
            Ink.stroke(x, geo.ellipse(95, 95, 88, 88), { w: 3, seed: 7 }); Ink.stroke(x, geo.ellipse(95, 95, 76, 76), { w: 1.8, seed: 8, retrace: false });
            for (let i = 0; i < 14; i++) { const a = (i / 14) * TAU, b = a + 0.5; pen(x, [[95 + Math.cos(b) * 9, 95 + Math.sin(b) * 9], [95 + Math.cos(a) * 75, 95 + Math.sin(a) * 75]], { w: 1.2, wob: false, a: 0.75 }); }
            for (let i = 0; i < 30; i++) { const a = (i / 30) * TAU; pen(x, [[95 + Math.cos(a) * 80, 95 + Math.sin(a) * 80], [95 + Math.cos(a + 0.06) * 87, 95 + Math.sin(a + 0.06) * 87]], { w: 1.2, wob: false, a: 0.6 }); }
            // valve and a spoke reflector so you can see it turning
            Ink.stroke(x, [[95, 20], [95, 34]], { w: 3, seed: 9, color: RD });
            const rf = [[128, 118], [150, 132], [144, 142], [122, 128]]; Ink.hatchFill(x, rf, 1, RD, 2.4); Ink.stroke(x, close(rf), { w: 1.6, color: RD, seed: 10, retrace: false });
          }),
        };
      },
      draw(x, ph, A, blit) {
        blit(A.bg, 0, 0);
        x.save(); x.translate(210, 122); x.rotate(ph * TAU * 0.3); x.drawImage(A.wheel, -95, -95, 190, 190); x.restore();
      },
    },
    oscill: {
      poster: 0.32,
      art(layer) {
        return {
          bg: layer(W, HH, (x) => {
            const pl = geo.rect(168, 6, 84, 20, 5); Ink.hatchFill(x, pl, 1, B, 1.6); Ink.stroke(x, pl, { w: 2.3, seed: 3 });
            dot(x, 182, 16, 2.6, 0.9); dot(x, 238, 16, 2.6, 0.9);
            // dotted path of the bob
            const P = arc(210, 26, 196, Math.PI / 2 + 0.62, Math.PI / 2 - 0.62, 26);
            for (let i = 0; i < P.length - 1; i += 2) pen(x, [P[i], P[i + 1]], { w: 1.6, a: 0.55, wob: false });
          }),
          bob: layer(60, 190, (x) => {
            Ink.stroke(x, [[28, 4], [28, 140]], { w: 2.2, seed: 4, amp: 0.4 }); Ink.stroke(x, [[32, 4], [32, 140]], { w: 2.2, seed: 5, amp: 0.4 });
            const b = geo.ellipse(30, 160, 24, 24); Ink.hatchFill(x, b, 1, B, 1.3); Ink.stroke(x, b, { w: 2.6, seed: 6 });
          }),
        };
      },
      draw(x, ph, A, blit) {
        blit(A.bg, 0, 0);
        const th = Math.sin(ph * TAU / 1.9) * 0.56;
        x.save(); x.translate(210, 26); x.rotate(th); x.drawImage(A.bob, -30, -8, 60, 190); x.restore();
        Ink.stroke(x, geo.ellipse(210, 26, 6, 6), { w: 2, seed: 7, retrace: false });
      },
    },
  };
  const INFO = [
    ['linear', 'Linear', 'Moving in a <b>straight line in one direction</b>.', 'a train on a straight track'],
    ['recip', 'Reciprocating', 'Moving <b>backwards and forwards in a straight line</b>.', 'a jigsaw blade'],
    ['rotary', 'Rotary', 'Turning <b>round in a circle</b> about an axis.', 'a wheel'],
    ['oscill', 'Oscillating', '<b>Swinging backwards and forwards in an arc</b>.', 'a pendulum'],
  ];

  Book.page({
    id: 'p02',
    title: 'Four types of motion',
    build(ui) {
      ui.h('Four types of motion');
      ui.p('Everything that moves does it in one of <b>four ways</b>. <b>Tap each sketch</b> to set it moving. The <span class="red">red arrow</span> is the symbol for that motion.');

      const grid = ui.el('div', ''); grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:22px 22px;margin:0 0 calc(var(--R) * 1.2)';
      INFO.forEach(([k, name, def, eg]) => {
        const card = ui.el('div', 'box', '', grid); card.style.cssText = 'margin:0;padding:10px 14px 12px';
        Mini(card, SCENES[k]);
        const head = ui.el('div', '', '', card); head.style.cssText = 'display:flex;align-items:center;gap:8px;line-height:1.2';
        head.appendChild(symCanvas(k, RD));
        ui.el('b', '', name, head).style.cssText = 'font:700 25px Fredoka';
        ui.el('div', '', `${def} <span class="small">(${eg})</span>`, card).style.cssText = 'font-size:18px;line-height:1.5;margin-top:2px';
        requestAnimationFrame(() => Ink.frame(card));
      });

      const notes = ui.box('A <span class="key">mechanism</span> changes an <b>input</b> motion and force into a different <b>output</b> motion and force. It can even change one <b>type</b> of motion into another.<br><b class="red">Don\'t mix these two up!</b> <b>Reciprocating</b> is back-and-forth in a <b>straight line</b>. <b>Oscillating</b> is back-and-forth along a <b>curve (arc)</b>.', { tag: 'Notes' });

      ui.p('Now sort these everyday examples. <span class="small">(The sketches and notes blur as soon as you start, so picture each one moving!)</span>');
      const sort = ui.sort({ id: 'p02.sort', label: 'Sort 10 everyday examples into the four motions', q: 'Tap a card, then tap the type of motion it shows.',
        buckets: ['Linear', 'Reciprocating', 'Rotary', 'Oscillating'],
        items: [
          { t: 'a box carried along a conveyor belt', b: 0, mis: 'linear-vs-recip' },
          { t: 'a paper trimmer blade sliding', b: 0, mis: 'linear-vs-recip' },
          { t: 'a sewing-machine needle', b: 1, mis: 'linear-vs-recip' },
          { t: 'a piston in an engine', b: 1, mis: 'linear-vs-recip' },
          { t: 'a hand saw cutting wood', b: 1, mis: 'recip-vs-oscill' },
          { t: 'a drill bit', b: 2 },
          { t: 'the hands of a clock', b: 2 },
          { t: 'a child on a swing', b: 3, mis: 'recip-vs-oscill' },
          { t: 'windscreen wipers', b: 3, mis: 'recip-vs-oscill' },
          { t: 'a metronome', b: 3, mis: 'recip-vs-oscill' },
        ],
        explain: 'All sorted! One way in a straight line = linear. There and back in a straight line = reciprocating. Round and round = rotary. Swinging in an arc = oscillating.' });
      sort.querySelector('.buckets').style.gridTemplateColumns = 'repeat(auto-fit, minmax(168px, 1fr))';
      ui.hideWhile(sort, 'p02.sort', [grid, notes]);

      const KINDS = ['linear', 'recip', 'rotary', 'oscill'];
      const DESC = ['straight arrow with one head', 'straight arrow with two heads', 'circular arrow', 'curved arrow with two heads'];
      const match = ui.match({ id: 'p02.symbols', label: 'Match each motion to its arrow symbol', q: 'Each motion has its own <b>arrow symbol</b>. Tap a motion, then tap its symbol.',
        pairs: [['Linear', DESC[0], 'linear-vs-recip'], ['Reciprocating', DESC[1], 'recip-vs-oscill'], ['Rotary', DESC[2]], ['Oscillating', DESC[3], 'recip-vs-oscill']] });
      match.querySelectorAll('.pairs .card').forEach((c) => {
        const i = DESC.indexOf(c.textContent); if (!c._def || i < 0) return;
        c.innerHTML = `<span style="position:absolute;width:1px;height:1px;overflow:hidden;opacity:0">${DESC[i]}</span>`;
        c.style.justifyContent = 'center'; c.style.minHeight = '76px'; c.style.padding = '2px 12px'; c.setAttribute('aria-label', DESC[i]);
        c.appendChild(symCanvas(KINDS[i], B, 130, 66, 1.45));
      });
      ui.hideWhile(match, 'p02.symbols', [grid, notes]);

      const mcq = ui.mcq({ id: 'p02.check', label: 'Reciprocating vs oscillating: the difference', q: 'A <b>jigsaw blade</b> and a <b>pendulum</b> both go backwards and forwards. So what is the difference?',
        options: [
          { t: 'The blade moves in a straight line, but the pendulum swings in an arc', ok: true },
          { t: 'The blade swings in an arc, but the pendulum moves in a straight line', mis: 'recip-vs-oscill', why: 'Other way round. Picture the blade: straight up and down. The pendulum follows a curve.' },
          { t: 'The blade only moves one way, but the pendulum goes there and back', mis: 'linear-vs-recip', why: 'The blade goes down AND back up again, over and over. One way only would be linear.' },
          { t: 'The blade moves very fast, but the pendulum always moves slowly', why: 'Speed does not decide the type of motion. Think about the shape of the path each one follows.' },
        ],
        explain: 'Straight line there and back = reciprocating (the blade). Along an arc there and back = oscillating (the pendulum).' });
      ui.hideWhile(mcq, 'p02.check', [grid, notes]);
    },
  });
})();
