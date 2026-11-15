// Page 9 — Mechanism detective: eight everyday products "taken apart" on case-file cards.
// For each: which lever order / linkage is it, and what does it do? Ends with a 2-mark written explanation.
Book.page({
  id: 'p09',
  title: 'Mechanism detective',
  build(ui, root) {
    const BLUE = Ink.BLUE, RED = Ink.RED;
    ui.h('Mechanism detective');
    ui.p('Designers learn a lot by <b>taking products apart</b>. Eight products are on your desk. For each case file, look at the drawing and the clues, then decide <b>which mechanism</b> it is and <b>what it does</b>.');
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

    // ---- product drawings (all inside x 26..274, y 88..236). No part is labelled. ----
    const mk = (a, b) => (u) => a + (b - a) * u;
    const barrow = (k, a, b) => {
      const m = mk(a, b);
      k.line([[24, 227], [276, 226]], m(0), m(0.1), { w: 1.6 });
      k.circle(66, 203, 22, m(0.05), m(0.25), { w: 3 }); k.circle(66, 203, 5, m(0.2), m(0.28), { w: 2 });
      k.line([[66, 203], [118, 185], [196, 181], [272, 150]], m(0.25), m(0.45), { w: 2.8 });
      k.line([[246, 160], [272, 150]], m(0.42), m(0.48), { w: 6 });
      const tray = [[84, 130], [214, 130], [192, 181], [112, 183], [84, 130]];
      k.line(tray, m(0.45), m(0.65), { w: 2.8 });
      k.line([[186, 182], [192, 225], [206, 225]], m(0.62), m(0.72), { w: 2.6 });
      const soil = k.curve([92, 130], [118, 96], [182, 98], [206, 130]);
      k.line(soil, m(0.7), m(0.85), { w: 2.4 });
      k.hatch(soil.concat([[92, 130]]), m(0.8), m(1), { density: 1.1 });
    };
    const scissors = (k, a, b) => {
      const m = mk(a, b);
      k.line([[128, 172], [264, 122], [160, 152], [128, 172]], m(0), m(0.22), { w: 2.6 });
      k.line([[128, 172], [100, 187]], m(0.2), m(0.27), { w: 4 });
      k.line(k.ellipse(74, 197, 28, 17), m(0.25), m(0.42), { w: 3 });
      k.line([[128, 148], [264, 198], [160, 168], [128, 148]], m(0.42), m(0.64), { w: 2.6 });
      k.line([[128, 148], [100, 133]], m(0.62), m(0.69), { w: 4 });
      k.line(k.ellipse(74, 123, 28, 17), m(0.67), m(0.84), { w: 3 });
      k.circle(147, 160, 6, m(0.84), m(0.92), { w: 2.2 }); k.dot(147, 160, 2, m(0.92));
      k.hatch([[160, 152], [264, 122], [200, 144]], m(0.88), m(1), { density: 1.2 });
    };
    const tweezers = (k, a, b) => {
      const m = mk(a, b), fl = (P) => P.map(([x, y]) => [x, 320 - y]);
      const up = [[38, 150], [140, 124], [234, 138], [266, 151], [264, 156], [232, 146], [140, 134], [48, 159]];
      k.line(up, m(0), m(0.35), { w: 2.6 });
      k.line(fl(up), m(0.35), m(0.7), { w: 2.6 });
      k.line([[34, 150], [56, 150], [56, 170], [34, 170], [34, 150]], m(0.68), m(0.78), { w: 2.4 });
      k.hatch([[34, 150], [56, 150], [56, 170], [34, 170]], m(0.75), m(0.85), { density: 1.4 });
      for (let i = 0; i < 5; i++) { const x = 122 + i * 9; k.line([[x, 121], [x + 2, 131]], m(0.8 + i * 0.02), m(0.83 + i * 0.02), { w: 1.8 }); k.line([[x, 199], [x + 2, 189]], m(0.8 + i * 0.02), m(0.83 + i * 0.02), { w: 1.8 }); }
      k.circle(268, 160, 4, m(0.92), m(1), { w: 2.2, color: RED });
    };
    const opener = (k, a, b) => {
      const m = mk(a, b);
      k.line([[72, 166], [72, 198], [58, 234]], m(0), m(0.12), { w: 2.6 }); k.line([[116, 166], [116, 198], [130, 234]], m(0.1), m(0.22), { w: 2.6 });
      const cap = [[64, 166], [66, 152], [122, 152], [124, 166]];
      k.line(cap, m(0.22), m(0.34), { w: 2.8 });
      k.line([[64, 166], [70, 170], [76, 166], [82, 170], [88, 166], [94, 170], [100, 166], [106, 170], [112, 166], [118, 170], [124, 166]], m(0.32), m(0.44), { w: 2 });
      const op = [[82, 139], [132, 139], [268, 104], [271, 117], [138, 153], [135, 172], [120, 174], [127, 163], [127, 146], [98, 146], [94, 152], [82, 152], [82, 139]];
      k.line(op, m(0.46), m(0.82), { w: 2.8 });
      k.circle(252, 114, 4, m(0.82), m(0.88), { w: 1.8 });
      k.hatch(op, m(0.84), m(1), { density: 0.8 });
    };
    const brake = (k, a, b) => {
      const m = mk(a, b);
      const tyre = [[130, 194], [130, 172]].concat(k.curve([130, 172], [130, 138], [170, 138], [170, 172]), [[170, 194]]);
      k.line(tyre, m(0), m(0.2), { w: 3 });
      k.line([[130, 194], [170, 194]], m(0.18), m(0.24), { w: 2 });
      k.line([[136, 194], [136, 236]], m(0.22), m(0.3), { w: 2.4 }); k.line([[164, 194], [164, 236]], m(0.24), m(0.32), { w: 2.4 });
      k.hatch(tyre, m(0.28), m(0.42), { density: 1.2 });
      const pl = k.rect(112, 202, 20, 14, 3), pr = k.rect(168, 202, 20, 14, 3);
      k.line(pl, m(0.4), m(0.48), { w: 2.4 }); k.line(pr, m(0.44), m(0.52), { w: 2.4 });
      k.line(k.curve([122, 202], [94, 164], [112, 130], [150, 122]), m(0.5), m(0.64), { w: 3.4 });
      k.line(k.curve([178, 202], [206, 164], [188, 130], [150, 122]), m(0.58), m(0.72), { w: 3.4 });
      k.line([[150, 122], [100, 114]], m(0.7), m(0.76), { w: 3.4 });
      k.circle(150, 122, 6, m(0.74), m(0.8), { w: 2.2 }); k.dot(150, 122, 2, m(0.8));
      k.line([[100, 114], [100, 88]], m(0.78), m(0.84), { w: 1.8 }); k.dot(100, 114, 3.4, m(0.8));
      k.arrow([[84, 116], [84, 92]], m(0.86), m(0.93), { color: RED, w: 2.2, head: 10 });
      k.arrow([[86, 209], [106, 209]], m(0.9), m(0.97), { color: RED, w: 2.2, head: 10 });
      k.arrow([[214, 209], [194, 209]], m(0.93), m(1), { color: RED, w: 2.2, head: 10 });
    };
    const wipers = (k, a, b) => {
      const m = mk(a, b);
      k.line([[56, 96], [244, 96], [266, 176], [34, 176], [56, 96]], m(0), m(0.25), { w: 2.6 });
      [[104, 0], [204, 0.06]].forEach(([px, d]) => {
        k.line([[px, 176], [px - 34, 118]], m(0.25 + d), m(0.33 + d), { w: 2.4 });
        k.line([[px - 16, 160], [px - 40, 118]], m(0.3 + d), m(0.38 + d), { w: 4.5 });
        k.line([[px, 176], [px, 206]], m(0.42 + d), m(0.47 + d), { w: 2.6 });
        k.dot(px, 176, 4, m(0.4 + d)); k.dot(px, 206, 3, m(0.47 + d));
      });
      k.line([[104, 206], [204, 206]], m(0.54), m(0.62), { w: 2.6 });
      k.circle(48, 210, 15, m(0.62), m(0.72), { w: 2.8 }); k.dot(48, 210, 2.4, m(0.72)); k.dot(58, 202, 3, m(0.72));
      k.line([[58, 202], [104, 206]], m(0.72), m(0.8), { w: 2.6 });
      const rot = k.ellipse(48, 210, 23, 23, 2.3, 5.2);
      k.arrow(rot, m(0.8), m(0.88), { color: RED, w: 2, head: 9 });
      [104, 204].forEach((px, i) => {
        const arc = k.ellipse(px, 176, 50, 50, -2.25, -0.95);
        k.arrow(arc, m(0.86 + i * 0.05), m(0.94 + i * 0.05), { color: RED, w: 2, head: 9 });
        k.line(k.head(arc.slice().reverse(), 9), m(0.92 + i * 0.05), m(0.95 + i * 0.05), { color: RED, w: 2 });
      });
    };
    const engine = (k, a, b) => {
      const m = mk(a, b);
      const wl = [[106, 90], [116, 90], [116, 170], [106, 170], [106, 90]], wr = [[184, 90], [194, 90], [194, 170], [184, 170], [184, 90]], top = [[106, 90], [194, 90], [194, 98], [106, 98]];
      k.line(wl, m(0), m(0.12), { w: 2.4 }); k.line(wr, m(0.08), m(0.2), { w: 2.4 }); k.line([[116, 98], [184, 98]], m(0.18), m(0.24), { w: 2.4 });
      k.hatch(wl, m(0.2), m(0.3), { density: 1.3 }); k.hatch(wr, m(0.22), m(0.32), { density: 1.3 }); k.hatch(top, m(0.24), m(0.34), { density: 1.3 });
      k.line(k.rect(119, 114, 62, 34, 4), m(0.34), m(0.48), { w: 2.8 });
      k.line([[121, 122], [179, 122]], m(0.46), m(0.5), { w: 1.6 }); k.line([[121, 128], [179, 128]], m(0.48), m(0.52), { w: 1.6 });
      k.circle(150, 208, 20, m(0.52), m(0.66), { w: 2.8 });
      k.line([[150, 208], [166, 198]], m(0.64), m(0.7), { w: 4 });
      k.line([[146, 138], [162, 198], [170, 196], [154, 138]], m(0.68), m(0.82), { w: 2.4 });
      k.dot(150, 138, 3.4, m(0.7)); k.dot(166, 198, 3.4, m(0.8)); k.dot(150, 208, 3, m(0.8));
      const up = [[210, 150], [210, 110]];
      k.arrow(up, m(0.84), m(0.92), { color: RED, w: 2.2, head: 10 }); k.line(k.head(up.slice().reverse(), 10), m(0.9), m(0.93), { color: RED, w: 2.2 });
      k.arrow(k.ellipse(150, 208, 31, 31, -0.9, 0.95), m(0.92), m(1), { color: RED, w: 2.2, head: 10 });
    };
    const lift = (k, a, b) => {
      const m = mk(a, b);
      k.line(k.rect(64, 212, 172, 12, 3), m(0), m(0.15), { w: 2.8 });
      k.circle(86, 229, 5, m(0.13), m(0.18), { w: 2.2 }); k.circle(214, 229, 5, m(0.15), m(0.2), { w: 2.2 });
      const hgt = (212 - 116) / 3;
      for (let i = 0; i < 3; i++) {
        const y1 = 212 - i * hgt, y0 = y1 - hgt, t0 = 0.2 + i * 0.16;
        k.line([[84, y1], [216, y0]], m(t0), m(t0 + 0.07), { w: 3 });
        k.line([[216, y1], [84, y0]], m(t0 + 0.07), m(t0 + 0.14), { w: 3 });
        k.dot(150, (y0 + y1) / 2, 3.6, m(t0 + 0.14)); k.dot(84, y0, 3.2, m(t0 + 0.14)); k.dot(216, y0, 3.2, m(t0 + 0.14));
      }
      k.dot(84, 212, 3.2, m(0.3)); k.dot(216, 212, 3.2, m(0.3));
      const plat = k.rect(60, 108, 180, 8, 2);
      k.line(plat, m(0.7), m(0.82), { w: 2.8 });
      k.line([[66, 108], [66, 90], [234, 90], [234, 108]], m(0.8), m(0.92), { w: 2.2 });
      k.line([[150, 90], [150, 108]], m(0.9), m(0.94), { w: 1.8 });
      k.hatch(plat, m(0.92), m(1), { density: 1.4 });
    };

    // ---- one case = card + two questions side by side ----
    const cols = {};
    const file = (n, key, title, clues, product, type, why) => {
      const row = ui.el('div', 'row p09-row');
      row.appendChild(caseFile(n, title, clues, product));
      const col = (cols[key] = ui.el('div', 'p09-qs', '', row));
      col.appendChild(mcq(Object.assign({ id: `p09.${key}-type`, q: '<b>Which mechanism</b> is it?' }, type)));
      col.appendChild(mcq(Object.assign({ id: `p09.${key}-why` }, why)));
    };
    const css = document.createElement('style');
    css.textContent = `.p09-row{gap:16px;margin-bottom:var(--R)}.p09-row>.p09-case{flex:0 0 250px;margin:0;position:sticky;top:8px}.p09-row>.p09-qs{flex:1 1 330px;min-width:0}.p09-qs .act{margin-bottom:calc(var(--R)*.8)}
      .p09-qs .opts{grid-template-columns:repeat(auto-fit,minmax(200px,1fr))}
      @media (max-width:760px){.p09-row>.p09-case{flex:0 0 100%;max-width:280px;position:static}}`;
    root.appendChild(css);

    file(1, 'barrow', 'wheelbarrow', ['Wheel at the front,', 'soil in the middle,', 'you lift the handles.'], barrow,
      { label: 'Wheelbarrow: which lever order', options: [
        { t: 'A second-order lever', ok: true, why: 'Yes. Now decide what that does for the gardener.' },
        { t: 'A first-order lever', mis: 'lever-order', why: 'A first-order lever has the fulcrum in the middle. Here the wheel (the fulcrum) is at one end. Use F – L – E → 1 – 2 – 3.' },
        { t: 'A third-order lever', mis: 'lever-order', why: 'A third-order lever has the effort in the middle. Here you lift at the far end. Use F – L – E → 1 – 2 – 3.' },
      ] },
      { label: 'Wheelbarrow: what it does', q: '<b>What does it do</b> for the gardener?', options: [
        { t: 'It multiplies force: the effort is less than the load', ok: true, why: 'Yes: the gardener lifts with less force than the weight of the soil.' },
        { t: 'It gives more force and more movement than you put in', mis: 'ma-free-lunch', why: 'You never get something for nothing. When a lever multiplies your force, your hands have to move further than the load.' },
        { t: 'It makes the load move further, but needs more effort', mis: 'third-order-ma', why: 'That describes a third-order lever such as tweezers. A wheelbarrow does the opposite.' },
      ] });

    file(2, 'scissors', 'scissors', ['Two blades joined by', 'a screw. Squeeze the', 'handles and they cut.'], scissors,
      { label: 'Scissors: which lever order', options: [
        { t: 'A pair of first-order levers', ok: true, why: 'Yes: each blade with its handle is one lever, and there are two of them.' },
        { t: 'A pair of second-order levers', mis: 'lever-order', why: 'A second-order lever has the load in the middle. On scissors the card being cut is out at one end.' },
        { t: 'A pair of third-order levers', mis: 'lever-order', why: 'A third-order lever has the effort in the middle. On scissors your fingers are out at one end.' },
      ] },
      { label: 'Scissors: where to cut thick card', q: 'You need to cut <b>thick card</b>. Where on the blades should you put it?', options: [
        { t: 'Near the screw: a load close to the fulcrum is easier', ok: true, why: 'Yes: the closer the load is to the fulcrum, the bigger the cutting force from the same squeeze.' },
        { t: 'At the tips: a load far from the fulcrum is easier', mis: 'moment-distance', why: 'It is the other way round. A load far from the fulcrum has a bigger turning effect, so it needs MORE effort.' },
        { t: 'Anywhere: the cutting force is the same all the way', mis: 'moment-distance', why: 'Distance from the fulcrum matters: moment = force × distance. The force at the blade changes along its length.' },
      ] });

    file(3, 'tweezers', 'tweezers', ['Joined at one end.', 'You squeeze the middle.', 'The tips grip.'], tweezers,
      { label: 'Tweezers: which lever order', options: [
        { t: 'A pair of third-order levers', ok: true, why: 'Yes. Now decide what that means at the tips.' },
        { t: 'A pair of first-order levers', mis: 'lever-order', why: 'A first-order lever has the fulcrum in the middle. On tweezers the fulcrum is the joined end.' },
        { t: 'A pair of second-order levers', mis: 'lever-order', why: 'A second-order lever has the load in the middle. On tweezers the load is at the tips.' },
      ] },
      { label: 'Tweezers: what they do', q: '<b>What do they do</b> at the tips?', options: [
        { t: 'The tips move further than your fingers, with less force', ok: true, why: 'Yes: the load moves further and faster, but you need more effort than the load. That gives small, precise movements.' },
        { t: 'The tips grip with far more force than your fingers give', mis: 'third-order-ma', why: 'Third-order levers do not multiply force: their mechanical advantage is less than 1.' },
        { t: 'The tips get more force and more movement than you give', mis: 'ma-free-lunch', why: 'You never get something for nothing: no lever gives more force AND more movement.' },
      ] });

    file(4, 'opener', 'bottle opener', ['Tip rests on the cap,', 'hook under its edge,', 'you lift the handle.'], opener,
      { label: 'Bottle opener: which lever order', options: [
        { t: 'A second-order lever', ok: true, why: 'Yes. Now find its three parts.' },
        { t: 'A first-order lever', mis: 'lever-order', why: 'A first-order lever has the fulcrum in the middle. Look again at which part of the opener is in the middle.' },
        { t: 'A third-order lever', mis: 'lever-order', why: 'A third-order lever has the effort in the middle. Here your hand is at the far end of the handle.' },
      ] },
      { label: 'Bottle opener: which part is the fulcrum', q: 'Which part is the <b>fulcrum</b>?', options: [
        { t: 'The tip resting on top of the cap', ok: true, why: 'Yes: the opener turns about the tip. The load is the cap edge and the effort is at the handle end.' },
        { t: 'The hook under the edge of the cap', mis: 'fulcrum-load-effort', why: 'The hook pulls the cap edge up: that is the load. The fulcrum is the point the opener turns about.' },
        { t: 'The end of the handle in your hand', mis: 'fulcrum-load-effort', why: 'Your hand applies the effort there. The fulcrum is the point the opener turns about.' },
      ] });

    file(5, 'brake', 'bike brake caliper', ['Squeeze the lever and', 'a cable pulls on the', 'caliper arms.'], brake,
      { label: 'Bike brake caliper: which linkage', options: [
        { t: 'A bell crank linkage', ok: true, why: 'Yes. Now say what it does to the pull of the cable.' },
        { t: 'A push–pull linkage', mis: 'linkage-type', why: 'In a push–pull linkage the output moves the same way as the input. Compare the red arrows.' },
        { t: 'A reverse motion linkage', mis: 'linkage-type', why: 'In a reverse motion linkage the output moves the opposite way to the input. Compare the red arrows.' },
      ] },
      { label: 'Bike brake caliper: what it does', q: '<b>What does it do</b> to the pull of the cable?', options: [
        { t: 'Turns it through 90° and multiplies the force', ok: true, why: 'Yes: the upward pull becomes a sideways squeeze on the rim, with more force.' },
        { t: 'Sends it back the opposite way to the cable', mis: 'linkage-type', why: 'That is what a reverse motion linkage does. The pads here do not move down when the cable moves up.' },
        { t: 'Keeps it going the same way as the cable', mis: 'linkage-type', why: 'That is what a push–pull linkage does. The pads here do not move up with the cable.' },
      ] });

    file(6, 'wipers', 'windscreen wipers', ['A motor turns a wheel.', 'A rod joins the wheel', 'to the wiper arms.'], wipers,
      { label: 'Windscreen wipers: which linkage', options: [
        { t: 'A treadle linkage', ok: true, why: 'Yes: it is a treadle-type linkage. Now name the two motions.' },
        { t: 'A crank and slider', mis: 'motion-conversion', why: 'A crank and slider has a slider moving in a straight guide. Nothing here slides in a straight line.' },
        { t: 'A bell crank linkage', mis: 'linkage-type', why: 'A bell crank only turns a motion round a corner. Here the type of motion changes.' },
      ] },
      { label: 'Windscreen wipers: motion in → motion out', q: 'Motion <b>in</b> (motor) → motion <b>out</b> (wipers)?', options: [
        { t: 'Rotary → oscillating', ok: true, why: 'Yes: the motor turns in a circle (rotary) and the wipers swing back and forth in an arc (oscillating).' },
        { t: 'Rotary → reciprocating', mis: 'recip-vs-oscill', why: 'Reciprocating is back and forth in a STRAIGHT line. The wipers swing in an arc.' },
        { t: 'Oscillating → rotary', mis: 'motion-conversion', why: 'That is the wrong way round: the input is the motor, which turns in a circle.' },
        { t: 'Linear → oscillating', mis: 'motion-conversion', why: 'Linear is a straight line in one direction. The motor turns in a circle.' },
      ] });

    file(7, 'engine', 'car engine', ['Burning fuel pushes', 'the piston. A rod joins', 'it to the crankshaft.'], engine,
      { label: 'Car engine piston: which mechanism', options: [
        { t: 'A crank and slider', ok: true, why: 'Yes: the piston is the slider and the cylinder is its guide. Now name the two motions.' },
        { t: 'A treadle linkage', mis: 'motion-conversion', why: 'A treadle has a part that rocks in an arc. The piston moves in a straight line inside the cylinder.' },
        { t: 'A reverse motion linkage', mis: 'linkage-type', why: 'A reverse motion linkage only changes direction. Here the type of motion changes.' },
      ] },
      { label: 'Car engine: motion in → motion out', q: 'Motion <b>in</b> (piston) → motion <b>out</b> (crankshaft)?', options: [
        { t: 'Reciprocating → rotary', ok: true, why: 'Yes: the piston goes back and forth in a straight line (reciprocating) and the crankshaft turns (rotary).' },
        { t: 'Oscillating → rotary', mis: 'recip-vs-oscill', why: 'Oscillating is swinging in an ARC. The piston goes back and forth in a straight line.' },
        { t: 'Linear → rotary', mis: 'linear-vs-recip', why: 'Linear is a straight line in ONE direction. The piston keeps going back and forth.' },
        { t: 'Rotary → reciprocating', mis: 'motion-conversion', why: 'That is the wrong way round for an engine: the piston is the input and the crankshaft is the output.' },
      ] });

    file(8, 'lift', 'scissor lift', ['Crossed bars joined', 'by pivots, stacked', 'up in a tower.'], lift,
      { label: 'Scissor lift: which linkage', options: [
        { t: 'Lazy tongs', ok: true, why: 'Yes: lazy tongs, also called a scissor linkage. Now say what they do.' },
        { t: 'A push–pull linkage', mis: 'linkage-type', why: 'A push–pull linkage is three bars in a Z shape on two fixed pivots. This is a stack of crossed levers.' },
        { t: 'A bell crank linkage', mis: 'linkage-type', why: 'A bell crank is one L-shaped lever on a fixed pivot. This is a stack of crossed levers.' },
      ] },
      { label: 'Scissor lift: what it does', q: '<b>What does it do?</b>', options: [
        { t: 'A small input movement gives a large extension', ok: true, why: 'Yes: several crossed levers extend a long way from a small input.' },
        { t: 'A small input gives more force and more movement', mis: 'ma-free-lunch', why: 'You never get something for nothing. The linkage gains movement, not force as well.' },
        { t: 'A rotary input is changed into an oscillating one', mis: 'motion-conversion', why: 'Nothing here turns in a circle or swings in an arc. The platform goes straight up and down.' },
      ] });

    // ---- case closed: an exam-style written explanation ----
    ui.el('h2', '', 'Case closed: write it up');
    ui.p('A good detective explains the evidence. Use the words <b>fulcrum</b>, <b>load</b> and <b>effort</b>.');
    const w = ui.write({ id: 'p09.explain', label: 'Explain why a wheelbarrow makes a heavy load easier to lift [2]', marks: 2, lines: 4,
      q: '<b>Explain</b> why a wheelbarrow makes a heavy load easier to lift.',
      scheme: ['The load is between the fulcrum (the wheel) and the effort (the handles) / it is a second-order lever', 'The effort is further from the fulcrum than the load, so less effort than the load is needed / it multiplies force / mechanical advantage is greater than 1'],
      model: 'A wheelbarrow is a <b>second-order lever</b>: the load is between the fulcrum (the wheel) and the effort (the handles). The effort is <b>further from the fulcrum</b> than the load, so the lever multiplies force and you need less effort than the weight of the load.' });
    // recall, not copy: case 1's feedback is blurred while this is being written, until it has been checked
    const checked = () => { const it = Book.state.items['p09.explain']; return !!(it && it.ticks); };
    w.querySelector('textarea').addEventListener('focus', () => { if (!checked()) cols.barrow.classList.add('peek-lock'); });
    w.addEventListener('click', () => setTimeout(() => { if (checked()) cols.barrow.classList.remove('peek-lock'); }, 50));
  },
});
