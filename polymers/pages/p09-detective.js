// Page 9 — Polymer detective: eight everyday products on case-file cards.
// For each: which polymer is it, plus one question on why / what follows. Ends with a 2-mark written explanation.
Book.page({
  id: 'p09',
  title: 'Polymer detective',
  build(ui, root) {
    const RED = Ink.RED;
    ui.h('Polymer detective');
    ui.p('Designers learn a lot by <b>looking closely at products</b>. Eight products are on your desk. For each case file, look at the drawing and the clues, then decide <b>which polymer</b> it is made from and answer the follow-up.');
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

    // ---- product drawings (all inside x 26..274, y 88..236). No part is labelled with a polymer or a property. ----
    const mk = (a, b) => (u) => a + (b - a) * u;
    const fizzy = (k, a, b) => {
      const m = mk(a, b);
      k.line(k.rect(138, 90, 24, 11, 2), m(0), m(0.1), { w: 2.4 });
      k.hatch(k.rect(138, 90, 24, 11, 2), m(0.08), m(0.16), { density: 1.5 });
      const L = [[141, 101], [141, 110]].concat(k.curve([141, 110], [138, 128], [116, 126], [114, 148]), [[114, 160], [117, 166], [114, 172], [114, 214]], k.curve([114, 214], [114, 226], [118, 234], [126, 234]));
      const R = L.map(([x, y]) => [300 - x, y]);
      k.line(L, m(0.14), m(0.4), { w: 2.6 }); k.line(R, m(0.3), m(0.56), { w: 2.6 });
      k.line([[126, 234], [133, 228], [141, 234], [150, 228], [159, 234], [167, 228], [174, 234]], m(0.54), m(0.62), { w: 2.2 });
      k.line([[114, 172], [186, 172]], m(0.6), m(0.65), { w: 1.8 }); k.line([[114, 202], [186, 202]], m(0.63), m(0.68), { w: 1.8 });
      k.text('cola', 150, 195, m(0.66), m(0.76), { size: 22, align: 'center' });
      k.line(k.curve([118, 140], [134, 135], [166, 145], [182, 139]), m(0.74), m(0.8), { w: 1.6 });
      [[132, 156, 4], [162, 150, 3], [148, 162, 3.4], [170, 164, 2.6], [128, 216, 3], [156, 220, 3.6], [172, 212, 2.6]].forEach(([x, y, r], i) => k.circle(x, y, r, m(0.8 + i * 0.02), m(0.84 + i * 0.02), { w: 1.4 }));
      k.line([[196, 150], [196, 222]], m(0.94), m(1), { w: 1.2 });
    };
    const flipcap = (k, a, b) => {
      const m = mk(a, b);
      k.line(k.curve([70, 236], [72, 200], [98, 196], [100, 180]), m(0), m(0.12), { w: 2.6 });
      k.line(k.curve([210, 236], [208, 200], [182, 196], [180, 180]), m(0.08), m(0.2), { w: 2.6 });
      const body = [[96, 180], [96, 142], [184, 142], [184, 180], [96, 180]];
      k.line(body, m(0.2), m(0.38), { w: 2.8 });
      for (let x = 104; x < 184; x += 10) k.line([[x, 148], [x, 176]], m(0.36 + (x - 104) * 0.001), m(0.4 + (x - 104) * 0.001), { w: 1.3 });
      k.line([[132, 142], [134, 130], [146, 130], [148, 142]], m(0.44), m(0.52), { w: 2.4 });
      // the open lid, tipped back, joined by a thin strip
      const lid = [[196, 138], [236, 92], [262, 114], [222, 160], [196, 138]];
      k.line(lid, m(0.54), m(0.76), { w: 2.8 });
      k.line([[203, 139], [239, 99]], m(0.74), m(0.8), { w: 1.4 });
      k.line(k.curve([184, 146], [189, 150], [194, 146], [198, 140]), m(0.8), m(0.88), { w: 1.8 });
      k.circle(190, 146, 13, m(0.88), m(0.96), { w: 2, color: RED });
      const arc = k.ellipse(184, 142, 62, 62, -1.35, -0.55);
      k.arrow(arc, m(0.92), m(1), { color: RED, w: 2, head: 9 }); k.line(k.head(arc.slice().reverse(), 9), m(0.97), m(1), { color: RED, w: 2 });
    };
    const sign = (k, a, b) => {
      const m = mk(a, b);
      k.line([[40, 98], [260, 98]], m(0), m(0.12), { w: 3.4 });
      k.line([[40, 92], [40, 132]], m(0.1), m(0.16), { w: 3.4 });
      k.line([[84, 98], [84, 122]], m(0.16), m(0.2), { w: 1.8 }); k.line([[226, 98], [226, 122]], m(0.18), m(0.22), { w: 1.8 });
      const B = k.rect(62, 122, 186, 84, 10);
      k.shadow(B, m(0.22), m(0.36)); k.line(B, m(0.22), m(0.44), { w: 2.8 });
      k.text('CAFE', 155, 180, m(0.46), m(0.74), { size: 46, align: 'center', font: 'bubble', color: RED });
      k.line([[76, 136], [98, 130]], m(0.76), m(0.8), { w: 1.6 }); k.line([[76, 146], [90, 142]], m(0.78), m(0.82), { w: 1.6 });
      [[60, 214], [112, 222], [176, 216], [236, 224], [272, 150], [30, 170]].forEach(([x, y], i) => k.line([[x, y], [x - 5, y + 13]], m(0.84 + i * 0.02), m(0.87 + i * 0.02), { w: 1.4 }));
    };
    const bleach = (k, a, b) => {
      const m = mk(a, b);
      k.line(k.rect(110, 90, 30, 14, 3), m(0), m(0.1), { w: 2.4 });
      for (let x = 115; x < 140; x += 6) k.line([[x, 92], [x, 102]], m(0.08), m(0.12), { w: 1.2 });
      const out = [[112, 104], [112, 114]].concat(k.curve([112, 114], [92, 120], [86, 132], [86, 150]), [[86, 222]], k.curve([86, 222], [86, 234], [92, 236], [102, 236]), [[198, 236]], k.curve([198, 236], [212, 236], [214, 228], [214, 220]), [[214, 150]], k.curve([214, 150], [214, 118], [176, 110], [138, 114]), [[138, 104]]);
      k.line(out, m(0.12), m(0.5), { w: 2.8 });
      k.line(k.rect(176, 134, 22, 50, 10), m(0.5), m(0.62), { w: 2.4 });
      k.line(k.rect(98, 150, 64, 62, 4), m(0.62), m(0.74), { w: 1.8 });
      k.text('BLEACH', 130, 172, m(0.72), m(0.82), { size: 15, align: 'center' });
      k.line([[130, 180], [146, 194], [130, 208], [114, 194], [130, 180]], m(0.8), m(0.88), { w: 2, color: RED });
      k.text('!', 130, 202, m(0.86), m(0.9), { size: 18, align: 'center', color: RED });
      // the stamp underneath: a triangle of arrows with the number hidden
      k.line([[236, 226], [250, 202], [264, 226], [236, 226]], m(0.88), m(0.96), { w: 2 });
      k.text('?', 250, 224, m(0.95), m(1), { size: 17, align: 'center', color: RED });
    };
    const windowFrame = (k, a, b) => {
      const m = mk(a, b);
      const O = [[70, 92], [230, 92], [230, 216], [70, 216], [70, 92]];
      k.line(O, m(0), m(0.22), { w: 3 });
      k.line([[82, 104], [218, 104], [218, 204], [82, 204], [82, 104]], m(0.2), m(0.4), { w: 2.2 });
      k.line([[146, 104], [146, 204]], m(0.4), m(0.46), { w: 2.2 }); k.line([[154, 104], [154, 204]], m(0.42), m(0.48), { w: 2.2 });
      k.line([[58, 216], [242, 216], [246, 228], [54, 228], [58, 216]], m(0.48), m(0.6), { w: 2.6 });
      k.hatch([[58, 216], [242, 216], [246, 228], [54, 228]], m(0.58), m(0.66), { density: 1.3 });
      k.line([[94, 150], [124, 118]], m(0.66), m(0.7), { w: 1.4 }); k.line([[98, 164], [112, 150]], m(0.68), m(0.72), { w: 1.4 });
      k.line([[166, 150], [196, 118]], m(0.7), m(0.74), { w: 1.4 });
      k.line(k.rect(158, 150, 8, 22, 3), m(0.74), m(0.8), { w: 1.8 });
      // sun and rain: out in all weathers
      k.circle(46, 110, 11, m(0.8), m(0.88), { w: 1.8 });
      [[28, 110, 20, 110], [46, 92, 46, 86], [33, 97, 28, 92], [33, 123, 28, 128]].forEach(([x0, y0, x1, y1], i) => k.line([[x0, y0], [x1, y1]], m(0.86 + i * 0.01), m(0.89 + i * 0.01), { w: 1.4 }));
      [[250, 110], [262, 136], [248, 162], [264, 188]].forEach(([x, y], i) => k.line([[x, y], [x - 5, y + 13]], m(0.9 + i * 0.02), m(0.93 + i * 0.02), { w: 1.4 }));
    };
    const pan = (k, a, b) => {
      const m = mk(a, b);
      k.line([[30, 208], [200, 208]], m(0), m(0.08), { w: 3 });
      k.line([[40, 208], [40, 232]], m(0.06), m(0.1), { w: 2 }); k.line([[190, 208], [190, 232]], m(0.08), m(0.12), { w: 2 });
      [70, 96, 122, 148].forEach((x, i) => k.line(k.curve([x, 204], [x - 8, 194], [x + 8, 190], [x, 178]), m(0.12 + i * 0.03), m(0.17 + i * 0.03), { w: 1.8, color: RED }));
      const P = [[52, 122], [168, 122], [162, 176], [58, 176], [52, 122]];
      k.line(P, m(0.26), m(0.46), { w: 2.8 });
      k.line([[48, 122], [172, 122]], m(0.44), m(0.5), { w: 3.2 });
      k.line([[66, 132], [70, 166]], m(0.5), m(0.54), { w: 1.4 });
      k.line([[168, 128], [182, 128], [182, 140], [167, 140]], m(0.54), m(0.62), { w: 2.2 });
      const Hd = [[182, 124], [262, 118], [270, 126], [270, 138], [262, 146], [182, 144], [182, 124]];
      k.line(Hd, m(0.62), m(0.8), { w: 2.8 });
      k.hatch(Hd, m(0.78), m(0.92), { density: 2.2 });
      k.circle(256, 132, 4, m(0.9), m(0.94), { w: 1.6 });
      [88, 112, 136].forEach((x, i) => k.line(k.curve([x, 114], [x - 7, 104], [x + 7, 100], [x, 90]), m(0.92 + i * 0.02), m(0.96 + i * 0.02), { w: 1.3 }));
    };
    const hull = (k, a, b) => {
      const m = mk(a, b);
      const Hl = [[36, 150]].concat(k.curve([36, 150], [50, 196], [90, 204], [150, 204]), k.curve([150, 204], [210, 204], [246, 190], [268, 144]), [[36, 150]]);
      k.line(Hl, m(0), m(0.3), { w: 2.8 });
      k.line(k.curve([44, 162], [100, 172], [200, 170], [262, 156]), m(0.28), m(0.36), { w: 1.6 });
      k.line([[112, 148], [120, 118], [190, 116], [204, 146]], m(0.36), m(0.48), { w: 2.4 });
      k.line(k.rect(134, 124, 20, 14, 3), m(0.46), m(0.52), { w: 1.6 }); k.line(k.rect(162, 124, 20, 14, 3), m(0.5), m(0.56), { w: 1.6 });
      k.line([[150, 116], [150, 92]], m(0.56), m(0.6), { w: 1.8 }); k.line([[150, 92], [172, 98], [150, 104]], m(0.6), m(0.66), { w: 1.6, color: RED });
      // a cut-away patch showing the woven mat inside the hull wall
      const C = k.rect(66, 168, 46, 28, 6);
      k.line(C, m(0.66), m(0.74), { w: 1.6, color: RED });
      for (let i = 0; i < 5; i++) { k.line([[70 + i * 9, 170], [70 + i * 9, 194]], m(0.74 + i * 0.01), m(0.77 + i * 0.01), { w: 1.1 }); }
      for (let i = 0; i < 3; i++) { k.line([[68, 175 + i * 8], [110, 175 + i * 8]], m(0.78 + i * 0.01), m(0.81 + i * 0.01), { w: 1.1 }); }
      const wave = (x0, y) => k.curve([x0, y], [x0 + 10, y - 8], [x0 + 20, y + 8], [x0 + 30, y]);
      [[26, 214], [60, 218], [96, 222], [200, 220], [236, 214], [140, 226]].forEach(([x, y], i) => k.line(wave(x, y), m(0.84 + i * 0.02), m(0.88 + i * 0.02), { w: 1.6 }));
    };
    const plate = (k, a, b) => {
      const m = mk(a, b);
      k.line(k.ellipse(142, 178, 92, 44), m(0), m(0.24), { w: 2.8 });
      k.line(k.ellipse(142, 176, 62, 28), m(0.22), m(0.4), { w: 1.8 });
      // bright pattern round the rim
      for (let i = 0; i < 10; i++) { const an = i * Math.PI / 5 + 0.2; k.circle(142 + Math.cos(an) * 77, 177 + Math.sin(an) * 36, 4, m(0.4 + i * 0.015), m(0.43 + i * 0.015), { w: 1.6, color: RED }); }
      // hot food
      const F = k.curve([112, 180], [116, 150], [170, 150], [174, 180]);
      k.line(F, m(0.56), m(0.66), { w: 2.2 }); k.line([[112, 180], [174, 180]], m(0.64), m(0.68), { w: 1.6 });
      k.hatch(F.concat([[112, 180]]), m(0.66), m(0.76), { density: 1.1 });
      [124, 144, 164].forEach((x, i) => k.line(k.curve([x, 146], [x - 8, 132], [x + 8, 122], [x, 106]), m(0.76 + i * 0.03), m(0.82 + i * 0.03), { w: 1.5 }));
      // a knife beside it
      k.line([[250, 110], [258, 110], [260, 176], [250, 176], [250, 110]], m(0.86), m(0.94), { w: 2 });
      k.line([[251, 176], [251, 230], [259, 230], [259, 176]], m(0.92), m(1), { w: 2.4 });
    };

    // ---- one case = card + two questions side by side ----
    const cols = {};
    const file = (n, key, title, clues, product, type, why) => {
      const row = ui.el('div', 'row p09-row');
      row.appendChild(caseFile(n, title, clues, product));
      const col = (cols[key] = ui.el('div', 'p09-qs', '', row));
      col.appendChild(mcq(Object.assign({ id: `p09.${key}-type`, q: '<b>Which polymer</b> is it made from?' }, type)));
      col.appendChild(mcq(Object.assign({ id: `p09.${key}-why` }, why)));
    };
    const css = document.createElement('style');
    css.textContent = `.p09-row{gap:16px;margin-bottom:var(--R)}.p09-row>.p09-case{flex:0 0 250px;margin:0;position:sticky;top:8px}.p09-row>.p09-qs{flex:1 1 330px;min-width:0}.p09-qs .act{margin-bottom:calc(var(--R)*.8)}
      .p09-qs .opts{grid-template-columns:repeat(auto-fit,minmax(200px,1fr))}
      @media (max-width:760px){.p09-row>.p09-case{flex:0 0 100%;max-width:280px;position:static}}`;
    root.appendChild(css);

    file(1, 'fizzy', 'fizzy drinks bottle', ['See-through and light.', 'Survives being dropped.', 'Fizzy for weeks.'], fizzy,
      { label: 'Fizzy drinks bottle: which polymer', options: [
        { t: 'Polyethylene terephthalate (PET)', ok: true, why: 'Yes: PET. Now say why it suits the job.' },
        { t: 'High density polythene (HDPE)', mis: 'thermoform-mixup', why: 'HDPE is opaque and waxy: think of a milk bottle. You can see straight through this one.' },
        { t: 'Acrylic (PMMA)', mis: 'thermoform-mixup', why: 'Acrylic can be clear, but it is not the drinks-bottle polymer. Think of recycling code 1.' },
        { t: 'High impact polystyrene (HIPS)', mis: 'thermoform-mixup', why: 'HIPS is used for vacuum-formed pots and trays. It is not the clear bottle polymer.' },
      ] },
      { label: 'Fizzy drinks bottle: why this polymer', q: '<b>Why</b> is it a good choice for this bottle?', options: [
        { t: 'Clear and tough, and a good barrier that keeps the gas in', ok: true, why: 'Yes: PET is clear, tough, strong, lightweight and food safe, and it is a good barrier, so the drink stays fizzy.' },
        { t: 'Hard and glass-clear, and its brittleness keeps the gas in', mis: 'property-word', why: 'Brittle means it cracks easily: bad news for a bottle. This polymer is tough, and a good barrier.' },
        { t: 'Stiff and waxy, and its opaque walls keep the gas in', mis: 'thermoform-mixup', why: 'Stiff, waxy and opaque describes HDPE. This bottle is clear.' },
      ] });

    file(2, 'cap', 'flip-top sauce cap', ['Lid joined to the cap', 'by one thin strip.', 'Flipped open every day.'], flipcap,
      { label: 'Flip-top cap: which polymer', options: [
        { t: 'Polypropylene (PP)', ok: true, why: 'Yes: PP. Now name the property that makes the thin strip work.' },
        { t: 'High impact polystyrene (HIPS)', mis: 'pp-hinge', why: 'A thin strip of HIPS whitens and cracks when it is bent back and forth. Which polymer survived the bend test?' },
        { t: 'Acrylic (PMMA)', mis: 'pp-hinge', why: 'A thin strip of acrylic would not survive being flipped open every day. Which polymer survived the bend test?' },
        { t: 'Polyvinyl chloride (PVC)', mis: 'pp-hinge', why: 'PVC is used for window frames, pipes and cable insulation. Which polymer is famous for its hinge?' },
      ] },
      { label: 'Flip-top cap: property of the thin strip', q: 'Which <b>property</b> lets the thin strip do its job?', options: [
        { t: 'It resists fatigue: it can bend many times', ok: true, why: 'Yes: polypropylene resists fatigue, so the thin strip is a "living hinge" that can bend again and again.' },
        { t: 'It is very hard: it resists scratches and dents', mis: 'property-word', why: 'Hardness is about scratches and dents. A hinge has to bend over and over without breaking.' },
        { t: 'It is very rigid: it will not bend out of shape', mis: 'property-word', why: 'A hinge that will not bend is no use! It has to bend over and over without breaking.' },
      ] });

    file(3, 'sign', 'shop sign', ['Bright, shiny, stiff.', 'Letters cut by laser.', 'Outdoors all year.'], sign,
      { label: 'Shop sign: which polymer', options: [
        { t: 'Acrylic (PMMA)', ok: true, why: 'Yes: acrylic. It is hard, stiff, shiny, brightly coloured and weather-resistant. Now its weak point.' },
        { t: 'Polypropylene (PP)', mis: 'thermoform-mixup', why: 'PP is flexible and used for lids, chairs and crates. This sign is hard, stiff and shiny.' },
        { t: 'High density polythene (HDPE)', mis: 'thermoform-mixup', why: 'HDPE feels waxy and is used for bottles, bins and buckets. This sign is hard and shiny.' },
        { t: 'Polyethylene terephthalate (PET)', mis: 'thermoform-mixup', why: 'PET is the drinks-bottle polymer. Think about what you laser cut at school.' },
      ] },
      { label: 'Shop sign: weakness of this polymer', q: 'What is the <b>weakness</b> of this polymer?', options: [
        { t: 'It is brittle, and it scratches easily', ok: true, why: 'Yes: acrylic is hard and stiff, but it is brittle (it cracks if hit) and it scratches easily.' },
        { t: 'It is tough, but it rots in the rain', mis: 'acrylic-tough', why: 'Acrylic is not tough: it cracks if it is hit. And it is weather-resistant: polymers do not rot.' },
        { t: 'It is flexible, so it sags in the sun', mis: 'thermoform-mixup', why: 'Acrylic is stiff, not flexible. Its problem is what happens when it is hit or rubbed.' },
      ] });

    file(4, 'bleach', 'bleach bottle', ['Waxy, not see-through.', 'Stiff and hard to split.', 'Bleach cannot harm it.'], bleach,
      { label: 'Bleach bottle: which polymer', options: [
        { t: 'High density polythene (HDPE)', ok: true, why: 'Yes: HDPE is stiff, strong, tough, chemical-resistant, waxy and opaque. Now find its code.' },
        { t: 'Polyethylene terephthalate (PET)', mis: 'thermoform-mixup', why: 'PET is the clear polymer of fizzy drinks bottles. This bottle is waxy and you cannot see through it.' },
        { t: 'Acrylic (PMMA)', mis: 'thermoform-mixup', why: 'Acrylic is shiny, not waxy, and it is not used for chemical bottles.' },
        { t: 'High impact polystyrene (HIPS)', mis: 'thermoform-mixup', why: 'HIPS is used for vacuum-formed pots and trays, not waxy bottles for chemicals.' },
      ] },
      { label: 'Bleach bottle: recycling code', q: 'Which <b>recycling code</b> is stamped underneath it?', options: [
        { t: '2', ok: true, why: 'Yes: 1 PET, 2 HDPE, 3 PVC, 4 LDPE, 5 PP, 6 PS, 7 other.' },
        { t: '1', mis: 'code-mixup', why: 'Code 1 is PET, the fizzy drinks bottle polymer.' },
        { t: '3', mis: 'code-mixup', why: 'Code 3 is PVC.' },
        { t: '5', mis: 'code-mixup', why: 'Code 5 is polypropylene (PP).' },
      ] });

    file(5, 'window', 'window frame', ['Rigid and white.', 'Sun and rain for years.', 'Also coats cables.'], windowFrame,
      { label: 'Window frame: which polymer', options: [
        { t: 'Polyvinyl chloride (PVC)', ok: true, why: 'Yes: rigid PVC (uPVC) is hard, tough and weather-resistant. Now explain the cable.' },
        { t: 'Acrylic (PMMA)', mis: 'thermoform-mixup', why: 'Acrylic is weather-resistant, but it is not the polymer that insulates electrical cables.' },
        { t: 'High impact polystyrene (HIPS)', mis: 'thermoform-mixup', why: 'HIPS is for vacuum-formed pots, trays and casings, not frames, gutters and cables.' },
        { t: 'Polyethylene terephthalate (PET)', mis: 'thermoform-mixup', why: 'PET is for drinks bottles and food trays, not frames, gutters and cables.' },
      ] },
      { label: 'Window frame: what makes the cable version flexible', q: 'On a cable the <b>same polymer</b> is soft and bendy. What was added?', options: [
        { t: 'A plasticiser', ok: true, why: 'Yes: a plasticiser makes a polymer softer and more flexible. Without it, PVC is rigid (uPVC).' },
        { t: 'A stabiliser', mis: 'additive-mixup', why: 'A stabiliser helps a polymer resist UV sunlight. It does not make it bendy.' },
        { t: 'A pigment', mis: 'additive-mixup', why: 'A pigment only adds colour. It does not make a polymer bendy.' },
      ] });

    file(6, 'pan', 'saucepan handle', ['Dark and glossy.', 'Inches from the flame.', 'Never goes soft.'], pan,
      { label: 'Saucepan handle: which polymer', options: [
        { t: 'Phenol formaldehyde (PF)', ok: true, why: 'Yes: PF is hard, very heat-resistant and only comes in dark colours. Now say why it never softens.' },
        { t: 'Urea formaldehyde (UF)', mis: 'thermoset-mixup', why: 'Close, but urea formaldehyde comes in white and pale colours. This handle is dark.' },
        { t: 'Melamine formaldehyde (MF)', mis: 'thermoset-mixup', why: 'Close, but melamine formaldehyde is the brightly coloured one for worktops and tableware.' },
        { t: 'Polyester resin (PR)', mis: 'thermoset-mixup', why: 'Close, but polyester resin is a liquid resin that is set in a mould, for hulls and panels.' },
      ] },
      { label: 'Saucepan handle: why it never softens', q: '<b>Why</b> does it never go soft next to the heat?', options: [
        { t: 'Cross-links lock its chains, so they cannot slide', ok: true, why: 'Yes: it is a thermosetting polymer. Strong cross-links set the chains permanently, so heat cannot soften it.' },
        { t: 'With no cross-links, its chains cannot ever slide', mis: 'crosslink', why: 'It is the other way round: chains with NO cross-links can slide when heated. That is a thermoforming polymer.' },
        { t: 'It softens when hot, then hardens again as it cools', mis: 'thermo-swap', why: 'That describes a thermoforming polymer. A handle like that would droop over the hob.' },
      ] });

    file(7, 'hull', 'boat hull', ['Liquid resin brushed', 'over a woven mat', 'in a mould. It set hard.'], hull,
      { label: 'Boat hull: which polymer', options: [
        { t: 'Polyester resin (PR)', ok: true, why: 'Yes: polyester resin is a liquid set with a catalyst. Now think about the mat.' },
        { t: 'Melamine formaldehyde (MF)', mis: 'thermoset-mixup', why: 'Melamine formaldehyde is for worktop laminates and tableware. It is not brushed on as a liquid resin.' },
        { t: 'Phenol formaldehyde (PF)', mis: 'thermoset-mixup', why: 'Phenol formaldehyde is the dark polymer of pan handles and knobs, not of boat hulls.' },
        { t: 'Urea formaldehyde (UF)', mis: 'thermoset-mixup', why: 'Urea formaldehyde is not brushed on as a liquid resin over a mat in a mould.' },
      ] },
      { label: 'Boat hull: why the glass fibre mat is added', q: 'The mat is <b>glass fibre</b>. Why is it added?', options: [
        { t: 'The resin alone is brittle: fibre makes it strong', ok: true, why: 'Yes: the resin is hard and stiff but brittle alone. Reinforced with glass fibre it becomes GRP (fibreglass): strong and light.' },
        { t: 'The resin alone is rigid: fibre lets it be remelted', mis: 'thermoset-recycle', why: 'Nothing lets a thermoset be remelted. The fibre is there to reinforce the brittle resin.' },
        { t: 'The resin alone stays liquid: fibre makes it set', mis: 'thermoset-mixup', why: 'A catalyst makes the resin set, not the fibre. The fibre is there to reinforce the brittle resin.' },
      ] });

    file(8, 'plate', 'picnic plate', ['Bright colours.', 'Knives leave no marks.', 'Hot food is no problem.'], plate,
      { label: 'Picnic plate: which polymer', options: [
        { t: 'Melamine formaldehyde (MF)', ok: true, why: 'Yes: MF is hard, scratch-, heat- and stain-resistant, food safe and takes bright colours.' },
        { t: 'Phenol formaldehyde (PF)', mis: 'thermoset-mixup', why: 'Phenol formaldehyde only comes in dark colours. This plate is brightly coloured.' },
        { t: 'Polyester resin (PR)', mis: 'thermoset-mixup', why: 'Polyester resin is the liquid resin of hulls and car body panels, not tableware.' },
        { t: 'Epoxy resin (ER)', mis: 'thermoset-mixup', why: 'Epoxy resin is for two-part adhesives and circuit boards, not tableware.' },
      ] },
      { label: 'Picnic plate: can a broken one be melted and recycled', q: 'The plate cracks. Can it be <b>melted down</b> and moulded into a new one?', options: [
        { t: 'No: a thermoset cannot be softened by heat', ok: true, why: 'Yes: thermosetting polymers are shaped once. They cannot be remelted (they may be ground up as filler).' },
        { t: 'Yes: every polymer softens when it is heated', mis: 'thermoset-recycle', why: 'Only thermoforming polymers soften when heated. This plate is a thermoset: it would char, not melt.' },
        { t: 'Yes: but only once, because it is a thermoset', mis: 'thermoset-recycle,thermo-swap', why: 'A thermoset is shaped once when it is MADE. After that, heating will never soften it again.' },
      ] });

    // ---- case closed: an exam-style written explanation ----
    ui.el('h2', '', 'Case closed: write it up');
    ui.p('A good detective explains the evidence. One more product: the <b>electrical plug</b> on a kettle lead. Use the <b>properties</b> of the polymer in your answer.');
    const w = ui.write({ id: 'p09.explain', label: 'Explain why electrical plugs are made from urea formaldehyde [2]', marks: 2, lines: 4,
      q: '<b>Explain</b> why electrical plugs are made from <b>urea formaldehyde</b>.',
      scheme: ['It is a good electrical insulator, so the electricity cannot reach your hand / you do not get a shock', 'It is heat-resistant / a thermosetting polymer, so it will not soften or melt if the plug gets hot (also accept: hard and stiff, so the plug keeps its shape)'],
      model: 'Urea formaldehyde is a <b>good electrical insulator</b>, so electricity cannot pass through the plug to your hand. It is a <b>thermosetting</b> polymer that is <b>heat-resistant</b>, so the plug will not soften or lose its shape if it gets hot.' });
    // recall, not copy: the feedback on the thermoset cases is blurred while this is being written, until it has been checked
    const lock = ['pan', 'hull', 'plate'];
    const checked = () => { const it = Book.state.items['p09.explain']; return !!(it && it.ticks); };
    w.querySelector('textarea').addEventListener('focus', () => { if (!checked()) lock.forEach((c) => cols[c].classList.add('peek-lock')); });
    w.addEventListener('click', () => setTimeout(() => { if (checked()) lock.forEach((c) => cols[c].classList.remove('peek-lock')); }, 50));
  },
});
