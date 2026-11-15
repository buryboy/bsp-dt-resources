// Page 9 — Machine detective: "lift the cover" on eight everyday machines, drawn on case-file cards.
// For each: which rotary mechanism is inside, and what it does / why it was chosen. Ends with a 2-mark written explanation.
Book.page({
  id: 'p09',
  title: 'Machine detective',
  build(ui, root) {
    const RED = Ink.RED;
    ui.h('Machine detective');
    ui.p('Designers learn a lot by <b>lifting the cover</b> off a machine. Eight machines are on your desk with their covers off. For each case file, look at the drawing and the clues, then decide <b>which mechanism</b> is inside and <b>what it does</b>.');
    ui.p('<span class="small">No notes on this page: it is all from memory. If you get one wrong, read why, then try again.</span>');

    // options are shuffled per question id here (so the right answer is not always in the same place)
    const hash = (s) => { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h % 100000; };
    const mcq = (o) => ui.mcq(Object.assign({}, o, { shuffle: false, options: Book.shuffle(o.options, hash(o.id) + 50) }));

    // ---- a pen-drawn case-file card (a folder with a tab) that draws itself when it scrolls into view ----
    const SW = 300, SH = 370;
    const caseFile = (n, title, clues, product) => {
      const api = ui.anim({
        w: SW, h: SH, duration: 3.2, poster: 0.001,
        draw(k) {
          const c = k.ctx;
          const P = [[14, 48], [18, 14], [124, 12], [134, 46], [286, 44], [288, 354], [14, 356], [14, 48]];
          k.shadow(P, 0, 0.3);
          c.save(); c.fillStyle = 'rgba(226,190,120,0.34)'; c.beginPath(); P.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y))); c.fill(); c.restore();
          k.line(P, 0, 0.45, { w: 2.4, seed: 11 + n });
          k.line([[14, 48], [134, 46]], 0.4, 0.5, { w: 1.4 });
          k.text('CASE ' + n, 28, 40, 0.3, 0.6, { size: 22, color: RED });
          k.text(title, SW / 2, 78, 0.45, 0.85, { size: 23, align: 'center' });
          product(k, 0.7, 2.2);
          clues.forEach((s, i) => k.text(s, SW / 2, 264 + i * 29, 2.1 + i * 0.25, 2.35 + i * 0.25, { size: 22, align: 'center' }));
        },
        sound(k) { k.play('stroke', 0, { material: 'pen', dur: 0.5, gain: 0.3 }); k.play('stroke', 0.7, { material: 'pen', dur: 1.4, gain: 0.3 }); k.play('stroke', 2.1, { material: 'pen', dur: 0.9, gain: 0.25 }); },
      });
      const wrap = root.lastElementChild; wrap.classList.add('p09-case');
      wrap.querySelector('.ink-play').style.display = 'none';
      if (window.IntersectionObserver) new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting && api.t < api.duration - 0.01) api.play(); }), { threshold: 0.35 }).observe(wrap);
      else api.seek(api.duration);
      return wrap;
    };

    // ---- drawing helpers ----
    const mk = (a, b) => (u) => a + (b - a) * u;
    const polar = (cx, cy, r, an) => [cx + Math.cos(an) * r, cy + Math.sin(an) * r];
    // a toothed wheel outline: square teeth of height th around radius r
    const gearPts = (cx, cy, r, n, th = 5, ph = 0) => {
      const o = [];
      for (let i = 0; i <= n; i++) { const a0 = ph + (i / n) * Math.PI * 2, s = (Math.PI * 2) / n; o.push(polar(cx, cy, r, a0), polar(cx, cy, r + th, a0 + s * 0.12), polar(cx, cy, r + th, a0 + s * 0.45), polar(cx, cy, r, a0 + s * 0.57)); }
      return o;
    };
    // an open belt wrapped round two wheels (closed path)
    const beltPts = (k, x1, y1, r1, x2, y2, r2) => {
      const ph = Math.atan2(y2 - y1, x2 - x1), be = Math.acos((r1 - r2) / Math.hypot(x2 - x1, y2 - y1));
      return [polar(x1, y1, r1, ph - be)].concat(k.ellipse(x2, y2, r2, r2, ph - be, ph + be), k.ellipse(x1, y1, r1, r1, ph + be, ph - be + Math.PI * 2));
    };
    const updown = (k, x, y0, y1, a, b) => { const P = [[x, y1], [x, y0]]; k.arrow(P, a, b, { color: RED, w: 2.2, head: 10 }); k.line(k.head(P.slice().reverse(), 10), b - 0.02, b, { color: RED, w: 2.2 }); };

    // ---- the machines (all inside x 26..274, y 88..236). No mechanism is named on a drawing. ----
    const valve = (k, a, b) => {
      const m = mk(a, b), cx = 150, cy = 122, lobe = [];
      for (let i = 0; i <= 60; i++) { const an = (i / 60) * Math.PI * 2 + 0.6, d = Math.cos(an + 0.75), r = 22 + 17 * Math.pow(Math.max(0, d), 1.6); lobe.push(polar(cx, cy, r, an)); }
      k.line(lobe, m(0), m(0.22), { w: 2.8 });
      k.circle(cx, cy, 7, m(0.2), m(0.27), { w: 2.2 }); k.dot(cx, cy, 2, m(0.27));
      k.hatch(lobe, m(0.24), m(0.36), { density: 0.8 });
      k.line(k.rect(126, 145, 48, 10, 3), m(0.34), m(0.44), { w: 2.6 });
      k.line([[147, 155], [147, 222]], m(0.44), m(0.52), { w: 2.2 }); k.line([[153, 155], [153, 222]], m(0.46), m(0.54), { w: 2.2 });
      const sp = []; for (let i = 0; i <= 8; i++) sp.push([i % 2 ? 168 : 132, 158 + i * 4.6]);
      k.line(sp, m(0.54), m(0.68), { w: 2 });
      const hl = [[60, 196], [140, 196], [140, 214], [122, 228], [60, 228], [60, 196]], hr = [[240, 196], [160, 196], [160, 214], [178, 228], [240, 228], [240, 196]];
      k.line(hl, m(0.66), m(0.76), { w: 2.4 }); k.line(hr, m(0.7), m(0.8), { w: 2.4 });
      k.hatch(hl, m(0.76), m(0.86), { density: 1.2 }); k.hatch(hr, m(0.78), m(0.88), { density: 1.2 });
      k.line([[150, 222], [124, 232], [176, 232], [150, 222]], m(0.84), m(0.92), { w: 2.6 });
      k.arrow(k.ellipse(cx, cy, 48, 40, -2.5, -1.2), m(0.9), m(0.96), { color: RED, w: 2.2, head: 10 });
      updown(k, 222, 150, 188, m(0.94), m(1));
    };
    const whisk = (k, a, b) => {
      const m = mk(a, b);
      k.line(k.rect(126, 88, 48, 14, 6), m(0), m(0.1), { w: 2.6 });
      k.line([[150, 102], [150, 108]], m(0.1), m(0.13), { w: 3 });
      k.line(gearPts(150, 138, 28, 22, 4), m(0.12), m(0.4), { w: 2.2 });
      k.circle(150, 138, 5, m(0.38), m(0.43), { w: 2 });
      k.line([[150, 138], [214, 118]], m(0.42), m(0.5), { w: 4 });
      k.line(k.rect(208, 104, 13, 26, 5), m(0.48), m(0.56), { w: 2.4 });
      [[130, 0], [170, 0.14]].forEach(([x, d]) => {
        k.line(gearPts(x, 176, 7, 7, 3.5, 0.3), m(0.56 + d), m(0.64 + d), { w: 2 });
        k.line([[x, 186], [x, 192]], m(0.63 + d), m(0.65 + d), { w: 2.6 });
        k.line(k.ellipse(x, 213, 13, 21, -1.57, 4.9), m(0.64 + d), m(0.72 + d), { w: 2.2 });
        k.line(k.ellipse(x, 213, 5, 21, -1.57, 4.9), m(0.68 + d), m(0.74 + d), { w: 1.8 });
      });
      k.arrow(k.ellipse(150, 138, 44, 44, -2.9, -1.9), m(0.9), m(1), { color: RED, w: 2.2, head: 10 });
    };
    const drill = (k, a, b) => {
      const m = mk(a, b);
      k.line(k.rect(62, 226, 176, 9, 3), m(0), m(0.1), { w: 2.6 });
      k.line([[196, 226], [196, 138]], m(0.08), m(0.16), { w: 2.4 }); k.line([[208, 226], [208, 138]], m(0.1), m(0.18), { w: 2.4 });
      k.line(k.rect(84, 198, 112, 8, 2), m(0.16), m(0.24), { w: 2.4 });
      // head casing (cover lifted) with the two stacks of wheels
      k.line([[70, 138], [236, 138], [236, 128], [70, 128], [70, 138]], m(0.22), m(0.34), { w: 2.4 });
      const stack = (x, ws, t0) => ws.forEach((w, i) => k.line(k.rect(x - w / 2, 118 - i * 10, w, 10, 2), m(t0 + i * 0.05), m(t0 + 0.05 + i * 0.05), { w: 2.2 }));
      stack(108, [52, 36, 20], 0.34); stack(204, [20, 36, 52], 0.42);
      const belt = [[92, 109], [220, 109], [220, 117], [92, 117], [92, 109]];
      k.line(belt, m(0.58), m(0.68), { w: 2 }); k.hatch(belt, m(0.66), m(0.74), { density: 2 });
      // spindle, chuck and bit
      k.line([[104, 138], [104, 152], [98, 156], [102, 170], [114, 170], [118, 156], [112, 152], [112, 138]], m(0.72), m(0.84), { w: 2.4 });
      k.line([[108, 170], [108, 192]], m(0.84), m(0.9), { w: 2.6 });
      k.line([[105, 176], [111, 180], [105, 184], [111, 188]], m(0.88), m(0.94), { w: 1.4 });
      k.line([[236, 132], [262, 132], [262, 158], [208, 158]], m(0.9), m(1), { w: 2.2 });
    };
    const washer = (k, a, b) => {
      const m = mk(a, b);
      k.line(k.rect(56, 90, 188, 138, 8), m(0), m(0.2), { w: 2.6 });
      k.line([[72, 228], [72, 235], [88, 235], [88, 228]], m(0.18), m(0.23), { w: 2 }); k.line([[212, 228], [212, 235], [228, 235], [228, 228]], m(0.2), m(0.25), { w: 2 });
      k.circle(140, 148, 40, m(0.24), m(0.42), { w: 2.8 });
      k.circle(140, 148, 6, m(0.4), m(0.45), { w: 2 });
      for (let i = 0; i < 3; i++) { const an = 0.5 + i * 2.094; k.line([polar(140, 148, 7, an), polar(140, 148, 38, an)], m(0.44 + i * 0.03), m(0.48 + i * 0.03), { w: 2 }); }
      k.line(k.rect(184, 192, 44, 26, 5), m(0.52), m(0.62), { w: 2.2 });
      k.circle(204, 205, 8, m(0.6), m(0.68), { w: 2.6 }); k.dot(204, 205, 2, m(0.68));
      k.line(beltPts(k, 140, 148, 45, 204, 205, 12), m(0.68), m(0.92), { w: 2.4 });
      k.arrow(k.ellipse(140, 148, 26, 26, -2.6, -0.9), m(0.92), m(1), { color: RED, w: 2.2, head: 9 });
    };
    const clock = (k, a, b) => {
      const m = mk(a, b);
      k.circle(148, 160, 64, m(0), m(0.22), { w: 2.8 });
      k.circle(148, 160, 57, m(0.18), m(0.34), { w: 1.6 });
      k.line([[104, 214], [94, 234]], m(0.3), m(0.34), { w: 3 }); k.line([[192, 214], [202, 234]], m(0.32), m(0.36), { w: 3 });
      k.line(k.ellipse(148, 91, 9, 6), m(0.34), m(0.4), { w: 2.2 });
      k.line(gearPts(128, 172, 25, 20, 4), m(0.4), m(0.62), { w: 2 }); k.circle(128, 172, 4, m(0.6), m(0.64), { w: 1.8 });
      k.line(gearPts(165, 146, 14, 12, 4, 0.2), m(0.62), m(0.78), { w: 2 }); k.circle(165, 146, 3, m(0.76), m(0.8), { w: 1.8 });
      k.line(gearPts(184, 166, 8, 7, 3.5, 0.1), m(0.78), m(0.9), { w: 2 }); k.dot(184, 166, 2, m(0.9));
      for (let i = 0; i < 4; i++) { const an = 0.3 + i * 1.571; k.line([polar(128, 172, 6, an), polar(128, 172, 22, an)], m(0.9 + i * 0.02), m(0.93 + i * 0.02), { w: 1.6 }); }
    };
    const hammer = (k, a, b) => {
      const m = mk(a, b), cx = 118, cy = 198, th0 = -Math.PI / 2 + 0.35, cam = [];
      for (let i = 0; i <= 60; i++) { const u = i / 60; cam.push(polar(cx, cy, 11 + 19 * u, th0 + u * Math.PI * 2)); }
      cam.push(cam[0]);
      k.line([[52, 234], [52, 152], [106, 152]], m(0), m(0.12), { w: 2.6 }); k.line([[130, 152], [236, 152], [236, 234], [52, 234]], m(0.1), m(0.26), { w: 2.6 });
      k.line(cam, m(0.26), m(0.5), { w: 2.8 }); k.circle(cx, cy, 5, m(0.48), m(0.53), { w: 2 }); k.dot(cx, cy, 1.8, m(0.53));
      k.hatch(cam, m(0.5), m(0.6), { density: 0.8 });
      k.line([[52, 198], [32, 198], [32, 178]], m(0.58), m(0.66), { w: 3 }); k.line(k.rect(26, 164, 12, 16, 4), m(0.64), m(0.7), { w: 2.2 });
      k.line([[108, 168], [128, 168]], m(0.7), m(0.73), { w: 3 });
      k.line([[114, 168], [114, 118]], m(0.72), m(0.78), { w: 2.2 }); k.line([[122, 168], [122, 118]], m(0.74), m(0.8), { w: 2.2 });
      const hd = k.rect(100, 98, 76, 20, 4);
      k.line(hd, m(0.8), m(0.88), { w: 2.8 }); k.hatch(hd, m(0.86), m(0.92), { density: 1.2 });
      k.line(k.rect(146, 134, 40, 18, 2), m(0.88), m(0.94), { w: 2.4 });
      k.arrow(k.ellipse(cx, cy, 40, 30, 0.9, 0.05), m(0.94), m(1), { color: RED, w: 2.2, head: 10 });
    };
    const timing = (k, a, b) => {
      const m = mk(a, b);
      k.line(gearPts(150, 128, 26, 18, 4), m(0), m(0.24), { w: 2 }); k.circle(150, 128, 7, m(0.22), m(0.28), { w: 2 });
      for (let i = 0; i < 4; i++) { const an = 0.4 + i * 1.571; k.circle(...polar(150, 128, 15, an), 4, m(0.26 + i * 0.02), m(0.3 + i * 0.02), { w: 1.6 }); }
      k.line(gearPts(150, 210, 12, 9, 4, 0.2), m(0.34), m(0.48), { w: 2 }); k.circle(150, 210, 4, m(0.46), m(0.5), { w: 2 });
      k.line(beltPts(k, 150, 128, 32, 150, 210, 18), m(0.5), m(0.72), { w: 2.2 });
      k.line(beltPts(k, 150, 128, 37, 150, 210, 23), m(0.68), m(0.9), { w: 2.2 });
      // ridges on the straight runs of the belt
      for (let i = 0; i < 7; i++) { const u = 0.12 + i * 0.125, t = m(0.88 + i * 0.012); [-1, 1].forEach((s) => { const x0 = 150 + s * (32 - 14 * u), y = 134 + 70 * u; k.line([[x0, y], [x0 + s * 5, y + 1]], t, t + 0.03, { w: 1.6 }); }); }
      k.line([[232, 96], [232, 232]], m(0.9), m(0.96), { w: 1.6 }); k.line([[68, 96], [68, 232]], m(0.92), m(0.98), { w: 1.6 });
    };
    const flag = (k, a, b) => {
      const m = mk(a, b);
      k.line([[40, 234], [260, 233]], m(0), m(0.08), { w: 1.8 });
      k.line([[94, 234], [94, 96]], m(0.06), m(0.2), { w: 2.6 }); k.line([[102, 234], [102, 104]], m(0.1), m(0.24), { w: 2.6 });
      k.line([[94, 96], [130, 98]], m(0.22), m(0.28), { w: 3 });
      k.circle(130, 100, 11, m(0.28), m(0.38), { w: 2.8 }); k.dot(130, 100, 2.4, m(0.38));
      k.line([[119, 100], [118, 206], [102, 212]], m(0.4), m(0.54), { w: 1.8 });
      k.line([[141, 100], [142, 206], [102, 214]], m(0.5), m(0.64), { w: 1.8 });
      const fl = [[142, 116]].concat(k.curve([142, 116], [166, 106], [190, 126], [216, 114]), k.curve([216, 158], [190, 170], [166, 150], [142, 160]), [[142, 116]]);
      k.line(fl, m(0.64), m(0.84), { w: 2.6 });
      k.hatch(fl, m(0.82), m(0.92), { density: 0.9 });
      k.arrow([[108, 150], [108, 190]], m(0.9), m(0.96), { color: RED, w: 2.2, head: 10 });
      k.arrow([[232, 160], [232, 120]], m(0.94), m(1), { color: RED, w: 2.2, head: 10 });
    };

    // ---- one case = card + two questions side by side ----
    const file = (n, key, title, clues, product, type, why) => {
      const row = ui.el('div', 'row p09-row');
      row.appendChild(caseFile(n, title, clues, product));
      const col = ui.el('div', 'p09-qs', '', row);
      col.appendChild(mcq(Object.assign({ id: `p09.${key}-type`, q: '<b>Which mechanism</b> is inside?' }, type)));
      col.appendChild(mcq(Object.assign({ id: `p09.${key}-why` }, why)));
    };
    const css = document.createElement('style');
    css.textContent = `.p09-row{gap:16px;margin-bottom:var(--R)}.p09-row>.p09-case{flex:0 0 250px;margin:0;position:sticky;top:8px}.p09-row>.p09-qs{flex:1 1 330px;min-width:0}.p09-qs .act{margin-bottom:calc(var(--R)*.8)}
      .p09-qs .opts{grid-template-columns:repeat(auto-fit,minmax(200px,1fr))}
      @media (max-width:760px){.p09-row>.p09-case{flex:0 0 100%;max-width:280px;position:static}}`;
    root.appendChild(css);

    file(1, 'valve', 'car engine valve', ['A lobe spins on a shaft.', 'The valve stays shut', 'for half of every turn.'], valve,
      { label: 'Engine valve: which cam', options: [
        { t: 'A pear cam and follower', ok: true, why: 'Yes: the still part of the turn is the clue. Now name the two motions.' },
        { t: 'An eccentric cam and follower', mis: 'cam-shape', why: 'An eccentric cam keeps its follower moving all the time, with no dwell. This valve stays still for half of every turn.' },
        { t: 'A snail cam and follower', mis: 'cam-shape', why: 'A snail cam lifts its follower slowly and then drops it suddenly. This valve stays still for half of every turn.' },
      ] },
      { label: 'Engine valve: motion in → motion out', q: 'Motion <b>in</b> (camshaft) → motion <b>out</b> (valve)?', options: [
        { t: 'Rotary → reciprocating', ok: true, why: 'Yes: the camshaft turns (rotary) and the valve goes up and down in a straight line (reciprocating).' },
        { t: 'Rotary → oscillating', mis: 'cam-motion', why: 'Oscillating is swinging in an arc. The valve is held in a guide, so it can only go up and down in a straight line.' },
        { t: 'Reciprocating → rotary', mis: 'cam-motion', why: 'That is the wrong way round. The cam is the input: a follower cannot drive its cam.' },
        { t: 'Rotary → rotary', mis: 'cam-motion', why: 'The valve does not go round. It is held in a guide, so it can only go up and down in a straight line.' },
      ] });

    file(2, 'whisk', 'hand whisk', ['Turn the handle slowly.', 'The beaters spin', 'much faster.'], whisk,
      { label: 'Hand whisk: which mechanism', options: [
        { t: 'A gear train that gears up', ok: true, why: 'Yes: toothed wheels that mesh, with a faster output. Now decide how.' },
        { t: 'A gear train that gears down', mis: 'big-is-fast', why: 'Gearing down makes the output SLOWER than the input. Read the clues again: which part is faster?' },
        { t: 'A cam and follower system', mis: 'cam-motion', why: 'A cam and follower gives up-and-down (reciprocating) motion. The beaters go round and round.' },
      ] },
      { label: 'Hand whisk: why the beaters spin faster', q: '<b>Why</b> do the beaters spin faster than the handle?', options: [
        { t: 'A big driver gear turns small driven gears', ok: true, why: 'Yes: big driver → small driven gears up. The beaters are faster, but they have less torque.' },
        { t: 'A small driver gear turns big driven gears', mis: 'big-is-fast', why: 'Small driver → big driven makes the output SLOWER. Look at which wheel the handle is fixed to.' },
        { t: 'An idler gear in the middle adds speed', mis: 'idler-ratio', why: 'An idler gear never changes the speed or the gear ratio. It only changes the direction.' },
      ] });

    file(3, 'drill', 'pillar drill', ['A belt on two stacks', 'of wheels. Move the', 'belt to change speed.'], drill,
      { label: 'Pillar drill: which mechanism', options: [
        { t: 'Stepped cone pulleys and a belt', ok: true, why: 'Yes: several pulley sizes on each shaft. Now choose a setting.' },
        { t: 'A gear train with an idler gear', mis: 'belt-vs-gear', why: 'Gears have teeth that mesh, and an idler does not change the speed. Here a belt is moved between wheels of different sizes.' },
        { t: 'A crossed belt on two pulleys', mis: 'belt-direction', why: 'A crossed belt makes a figure of 8 to reverse the direction. This belt is not crossed: it is moved to change the speed.' },
      ] },
      { label: 'Pillar drill: setting for a big bit in hard metal', q: 'A <b>big drill bit</b> in <b>hard metal</b> needs which belt setting?', options: [
        { t: 'Slow: small motor pulley, big spindle pulley', ok: true, why: 'Yes: big bits and hard metals need a slow speed, and small driver → big driven is slower.' },
        { t: 'Slow: big motor pulley, small spindle pulley', mis: 'big-is-fast', why: 'Slow is right, but big driver → small driven makes the spindle FASTER, not slower.' },
        { t: 'Fast: small motor pulley, big spindle pulley', mis: 'big-is-fast', why: 'Small driver → big driven makes the spindle slower, not faster. And a big bit in hard metal needs a slow speed.' },
        { t: 'Fast: big motor pulley, small spindle pulley', why: 'That setting is fast, but big bits and hard metals need a SLOW speed. Fast is for small bits and for wood.' },
      ] });

    file(4, 'washer', 'washing machine', ['A small wheel on the', 'motor. A big wheel', 'on the drum.'], washer,
      { label: 'Washing machine: which mechanism', options: [
        { t: 'A belt and pulley drive', ok: true, why: 'Yes: a driver pulley on the motor and a driven pulley on the drum. Now decide what it does.' },
        { t: 'A simple gear train', mis: 'belt-vs-gear', why: 'Gears have teeth that mesh together. Look at what joins the two wheels here.' },
        { t: 'A cam and follower', mis: 'cam-motion', why: 'A cam and follower gives up-and-down (reciprocating) motion. The drum goes round and round.' },
      ] },
      { label: 'Washing machine: what the pulley sizes do', q: '<b>What does</b> small motor wheel → big drum wheel do?', options: [
        { t: 'The drum turns slower, with more torque', ok: true, why: 'Yes: small driver → big driven is slower, with more torque to turn a drum full of wet washing.' },
        { t: 'The drum turns faster, with more torque', mis: 'speed-torque', why: 'You never get something for nothing: you cannot gain speed AND torque. A bigger driven wheel turns slower.' },
        { t: 'The drum turns faster, with less torque', mis: 'big-is-fast', why: 'A bigger driven wheel turns SLOWER than its driver, not faster.' },
        { t: 'The drum turns slower, with less torque', mis: 'speed-torque', why: 'Slower is right, but speed is traded for torque: a slower output has MORE torque.' },
      ] });

    file(5, 'clock', 'clock', ['Toothed wheels of', 'different sizes turn', 'the hands. Exact time!'], clock,
      { label: 'Clock: which mechanism', options: [
        { t: 'A simple gear train', ok: true, why: 'Yes: toothed wheels that mesh. Now decide why a clock needs them.' },
        { t: 'A toothed belt drive', mis: 'belt-vs-gear', why: 'There is no belt here. The toothed wheels touch and mesh with each other.' },
        { t: 'A stepped cone pulley', mis: 'belt-vs-gear', why: 'Stepped cone pulleys are smooth wheels joined by a belt. These wheels have teeth that mesh.' },
      ] },
      { label: 'Clock: why this mechanism suits it', q: '<b>Why</b> does this mechanism suit a clock?', options: [
        { t: 'The teeth mesh, so the ratio stays exact', ok: true, why: 'Yes: gears cannot slip, so they slow the rotation by exactly the right amount.' },
        { t: 'The teeth slip a little, so it runs smoothly', mis: 'belt-slip', why: 'Gears cannot slip: their teeth mesh. A drive that slipped would make the clock lose time.' },
        { t: 'The wheels gain both speed and torque', mis: 'speed-torque', why: 'You never get something for nothing: no gear train gains speed AND torque.' },
      ] });

    file(6, 'hammer', 'hammer toy', ['Turn the handle. The', 'hammer lifts slowly,', 'then drops: BANG!'], hammer,
      { label: 'Hammer toy: which cam', options: [
        { t: 'A snail cam and follower', ok: true, why: 'Yes: a slow, steady rise and then a sudden drop. Now think about how it turns.' },
        { t: 'A pear cam and follower', mis: 'cam-shape', why: 'A pear cam lets its follower rise and fall smoothly after a dwell. It cannot give a sudden drop.' },
        { t: 'An eccentric cam and follower', mis: 'cam-shape', why: 'An eccentric cam makes its follower rise and fall smoothly all the time. It cannot give a sudden drop.' },
      ] },
      { label: 'Hammer toy: why it turns one way only', q: 'The handle must only be turned <b>one way</b>. Why?', options: [
        { t: 'Turned backwards, the follower jams on the cam', ok: true, why: 'Yes: the follower would hit the step of the cam and jam. This cam only works in one direction.' },
        { t: 'Turned backwards, the follower dwells all the time', mis: 'dwell-meaning', why: 'Dwell means the follower stays still while the cam turns. Backwards, this cam does not turn at all: the follower jams against its step.' },
        { t: 'Turned backwards, the follower drives the cam', mis: 'cam-motion', why: 'A follower can never drive its cam. Backwards, the follower jams against the step of the cam.' },
      ] });

    file(7, 'timing', 'car timing belt', ['This belt has ridges', 'that fit notches in', 'its two wheels.'], timing,
      { label: 'Timing belt: which mechanism', options: [
        { t: 'A toothed belt and pulleys', ok: true, why: 'Yes. Now decide why an engine needs this kind of belt.' },
        { t: 'A plain belt and pulleys', mis: 'belt-slip', why: 'A plain belt is smooth and grips by friction alone. Read the clues again.' },
        { t: 'A crossed belt and pulleys', mis: 'belt-direction', why: 'A crossed belt makes a figure of 8. This belt runs straight from one wheel to the other.' },
      ] },
      { label: 'Timing belt: why it is used', q: '<b>Why</b> is this kind of belt used here?', options: [
        { t: 'It cannot slip, so the timing stays exact', ok: true, why: 'Yes: a toothed belt cannot slip, so the engine valves always open at exactly the right moment.' },
        { t: 'It slips easily, so the engine runs smoothly', mis: 'belt-slip', why: 'This belt cannot slip: its ridges lock into the wheels. If it slipped, the valves would open at the wrong moment.' },
        { t: 'It makes the two wheels turn opposite ways', mis: 'belt-direction', why: 'Only a crossed belt reverses the direction. With this belt both wheels turn the same way.' },
      ] });

    file(8, 'flag', 'flagpole', ['One wheel fixed at the', 'top. Pull the rope', 'down: flag goes up.'], flag,
      { label: 'Flagpole: which mechanism', options: [
        { t: 'A single fixed pulley', ok: true, why: 'Yes: the pulley stays where it is at the top. Now decide what it does.' },
        { t: 'A single moving pulley', mis: 'pulley-lift', why: 'A moving pulley travels up with the load. This wheel stays at the top of the pole.' },
        { t: 'A belt and pulley drive', why: 'A belt drive links a driver pulley to a driven pulley. Here there is one wheel and a rope that lifts a load.' },
      ] },
      { label: 'Flagpole: what the pulley does', q: '<b>What does it do</b> for the person pulling?', options: [
        { t: 'It changes the direction of the pull only', ok: true, why: 'Yes: you pull down to lift up. The effort equals the load, so the mechanical advantage is 1.' },
        { t: 'It halves the effort needed to lift the flag', mis: 'pulley-lift', why: 'A single fixed pulley does not reduce the effort: effort = load. It takes a MOVING pulley to halve the effort.' },
        { t: 'It doubles the force that pulls on the flag', mis: 'pulley-lift', why: 'A single fixed pulley does not multiply force: effort = load. It only changes the direction.' },
      ] });

    // ---- case closed: an exam-style written explanation ----
    ui.el('h2', '', 'Case closed: write it up');
    ui.p('A good detective explains the evidence. Think back to case 4, and to what you know about <b>belts</b> and <b>gears</b>.');
    ui.write({ id: 'p09.explain', label: 'Explain why a washing machine uses a belt drive rather than gears [2]', marks: 2, lines: 4,
      q: '<b>Explain</b> why a washing machine uses a <b>belt drive</b> rather than gears to turn the drum.',
      scheme: ['One correct reason: a belt drive is quieter / is cheaper / needs no lubrication / absorbs shock / can link a motor and drum that are some distance apart',
        'A second reason, or the first one explained: e.g. the belt can slip if the drum jams, so the motor does not burn out / gears would be noisier, cost more and need lubrication'],
      model: 'A belt drive is <b>quiet and cheap</b> and needs <b>no lubrication</b>, and it can link the motor to the drum even though they are some distance apart. Because a belt works by friction it can <b>slip</b> if the drum jams, which protects the motor from burning out. Gears would be noisier, cost more and need lubrication.' });
  },
});
