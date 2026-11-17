// Page 9 — Label detective: eight products with their care labels on case-file cards.
// For each: which fibre / construction is it, and why? Ends with a 2-mark written explanation.
Book.page({
  id: 'p09',
  title: 'Label detective',
  build(ui, root) {
    const RED = Ink.RED;
    ui.h('Label detective');
    ui.p('Every textile product has a <b>care label</b> sewn inside. Eight products are on your desk. For each case file, read the label and look at the drawing, then work out the <b>fibre</b> or the <b>construction</b>, and <b>why</b> it was chosen.');
    ui.p('<span class="small">No notes on this page: it is all from memory. If you get one wrong, read why, then try again.</span>');

    // options are shuffled per question id here (so the right answer is not always in the same place)
    const hash = (s) => { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h % 100000; };
    const mcq = (o) => ui.mcq(Object.assign({}, o, { shuffle: false, options: Book.shuffle(o.options, hash(o.id) + 50) }));

    // ---- a pen-drawn case-file card (a folder with a tab) that draws itself when it scrolls into view ----
    // The lower part is the care label: a sewn-in tag with three lines of writing ('? ? ?' = a smudged fibre name).
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
          product(k, 0.7, 2.0);
          // the care label: a white tag stitched on along its top edge
          const T = [[24, 244], [276, 243], [277, 344], [24, 345], [24, 244]];
          if (k.t >= 1.9) { c.save(); c.globalCompositeOperation = 'source-over'; c.fillStyle = 'rgba(255,255,255,0.72)'; c.beginPath(); T.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y))); c.fill(); c.restore(); }
          k.line(T, 1.9, 2.15, { w: 1.8, seed: 5 + n });
          for (let i = 0; i < 12; i++) k.line([[34 + i * 20, 250], [44 + i * 20, 250]], 2.1, 2.2, { w: 1.4, color: RED });
          clues.forEach((s, i) => k.text(s, SW / 2, 278 + i * 27, 2.15 + i * 0.25, 2.4 + i * 0.25, { size: 22, align: 'center', color: /\?/.test(s) ? RED : undefined }));
        },
        sound(k) { k.play('stroke', 0, { material: 'pen', dur: 0.5, gain: 0.3 }); k.play('stroke', 0.7, { material: 'pen', dur: 1.3, gain: 0.3 }); k.play('stroke', 2.1, { material: 'pen', dur: 0.9, gain: 0.25 }); },
      });
      const wrap = root.lastElementChild; wrap.classList.add('p09-case');
      wrap.querySelector('.ink-play').style.display = 'none';
      if (window.IntersectionObserver) new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting && api.t < api.duration - 0.01) api.play(); }), { threshold: 0.35 }).observe(wrap);
      else api.seek(api.duration);
      return wrap;
    };

    // ---- product drawings (all inside x 26..274, y 88..236). Nothing is labelled. ----
    const mk = (a, b) => (u) => a + (b - a) * u;
    const fl = (P) => P.map(([x, y]) => [300 - x, y]); // mirror left ↔ right
    const jeans = (k, a, b) => {
      const m = mk(a, b);
      k.line(k.rect(100, 92, 100, 13, 2), m(0), m(0.14), { w: 2.6 });
      [112, 134, 166, 188].forEach((x, i) => k.line([[x, 90], [x, 107]], m(0.12 + i * 0.01), m(0.15 + i * 0.01), { w: 2.2 }));
      const out = [[100, 105], [92, 232], [138, 233], [150, 144], [162, 233], [208, 232], [200, 105]];
      k.line(out, m(0.16), m(0.5), { w: 2.8 });
      k.line([[150, 105], [150, 144]], m(0.5), m(0.55), { w: 1.8 });
      k.line(k.curve([150, 107], [160, 122], [160, 134], [150, 142]), m(0.53), m(0.59), { w: 1.4 });
      k.line(k.curve([104, 108], [108, 126], [120, 130], [132, 108]), m(0.58), m(0.66), { w: 1.8 });
      k.line(fl(k.curve([104, 108], [108, 126], [120, 130], [132, 108])), m(0.64), m(0.72), { w: 1.8 });
      k.dot(150, 99, 2.6, m(0.7));
      k.line([[94, 224], [137, 225]], m(0.7), m(0.74), { w: 1.4 }); k.line([[163, 225], [206, 224]], m(0.72), m(0.76), { w: 1.4 });
      // the fine diagonal lines of the cloth
      k.hatch([[100, 134], [146, 146], [137, 222], [94, 221]], m(0.76), m(0.9), { density: 1.5 });
      k.hatch([[154, 146], [200, 134], [206, 221], [163, 222]], m(0.86), m(1), { density: 1.5 });
    };
    const shirtBody = (k, m, sleeve) => {
      k.line([[112, 114], [111, 232], [189, 232], [188, 114]], m(0), m(0.2), { w: 2.8 });
      k.line(sleeve, m(0.2), m(0.34), { w: 2.8 }); k.line(fl(sleeve), m(0.34), m(0.48), { w: 2.8 });
      // collar
      k.line([[112, 114], [132, 96], [150, 118], [168, 96], [188, 114]], m(0.48), m(0.6), { w: 2.6 });
      k.line([[132, 96], [126, 122], [150, 118], [174, 122], [168, 96]], m(0.58), m(0.7), { w: 2.2 });
      k.line(k.curve([132, 96], [142, 104], [158, 104], [168, 96]), m(0.68), m(0.73), { w: 1.6 });
      k.line([[150, 118], [150, 232]], m(0.72), m(0.8), { w: 1.6 });
      [138, 162, 186, 210].forEach((y, i) => k.dot(155, y, 2.4, m(0.8 + i * 0.02)));
    };
    const schoolShirt = (k, a, b) => {
      const m = mk(a, b);
      shirtBody(k, m, [[112, 114], [74, 130], [52, 214], [74, 221], [94, 156], [112, 164]]);
      k.line([[55, 204], [76, 211]], m(0.86), m(0.9), { w: 1.6 }); k.line(fl([[55, 204], [76, 211]]), m(0.88), m(0.92), { w: 1.6 });
      k.line(k.rect(120, 140, 22, 24, 2), m(0.9), m(1), { w: 1.8 });
    };
    const summerShirt = (k, a, b) => {
      const m = mk(a, b);
      shirtBody(k, m, [[112, 114], [78, 128], [68, 164], [94, 171], [112, 152]]);
      // creases
      [[[120, 150], [128, 144], [134, 152], [142, 146]], [[160, 176], [168, 170], [174, 178], [182, 172]], [[118, 204], [126, 198], [132, 206], [140, 200]], [[162, 214], [170, 208], [176, 216], [184, 210]], [[76, 146], [84, 142], [88, 150]], [[212, 150], [216, 142], [224, 146]]]
        .forEach((P, i) => k.line(P, m(0.86 + i * 0.02), m(0.89 + i * 0.02), { w: 1.6 }));
    };
    const jumper = (k, a, b) => {
      const m = mk(a, b);
      const sl = [[110, 108], [68, 128], [48, 218], [76, 226], [94, 160], [108, 168]];
      k.line([[108, 108], [107, 230], [193, 230], [192, 108]], m(0), m(0.2), { w: 2.8 });
      k.line(sl, m(0.2), m(0.36), { w: 2.8 }); k.line(fl(sl), m(0.36), m(0.52), { w: 2.8 });
      k.line([[110, 108], [130, 98]], m(0.5), m(0.53), { w: 2.8 }); k.line([[170, 98], [190, 108]], m(0.52), m(0.55), { w: 2.8 });
      k.line(k.curve([130, 98], [136, 118], [164, 118], [170, 98]), m(0.54), m(0.62), { w: 2.6 });
      k.line(k.curve([124, 100], [132, 128], [168, 128], [176, 100]), m(0.6), m(0.68), { w: 1.8 });
      // ribbed hem and cuffs
      k.line([[108, 216], [192, 216]], m(0.68), m(0.72), { w: 1.6 });
      for (let i = 0; i < 11; i++) k.line([[114 + i * 7.4, 218], [114 + i * 7.4, 229]], m(0.72 + i * 0.008), m(0.74 + i * 0.008), { w: 1.4 });
      k.line([[51, 206], [79, 214]], m(0.8), m(0.83), { w: 1.6 }); k.line(fl([[51, 206], [79, 214]]), m(0.82), m(0.85), { w: 1.6 });
      // a chunky zig-zag band across the chest
      const z = []; for (let i = 0; i <= 10; i++) z.push([110 + i * 8, i % 2 ? 148 : 160]);
      k.line(z, m(0.85), m(0.93), { w: 2, color: RED });
      k.line(z.map(([x, y]) => [x, y + 14]), m(0.92), m(1), { w: 2 });
    };
    const swimsuit = (k, a, b) => {
      const m = mk(a, b);
      const L = [[134, 92], [124, 92], [121, 128], [112, 158], [113, 194]];
      k.line(L, m(0), m(0.2), { w: 2.8 }); k.line(fl(L), m(0.2), m(0.4), { w: 2.8 });
      k.line(k.curve([134, 92], [136, 126], [164, 126], [166, 92]), m(0.4), m(0.52), { w: 2.6 });
      const leg = k.curve([113, 194], [128, 200], [138, 214], [140, 232]);
      k.line(leg, m(0.52), m(0.62), { w: 2.6 }); k.line(fl(leg), m(0.6), m(0.7), { w: 2.6 });
      k.line([[140, 232], [160, 232]], m(0.7), m(0.73), { w: 2.6 });
      // side stripes
      const s1 = k.curve([126, 100], [124, 140], [116, 160], [120, 196]), s2 = k.curve([131, 108], [130, 144], [123, 164], [128, 200]);
      k.line(s1, m(0.74), m(0.82), { w: 2, color: RED }); k.line(s2, m(0.8), m(0.88), { w: 2, color: RED });
      k.line(fl(s1), m(0.86), m(0.94), { w: 2, color: RED }); k.line(fl(s2), m(0.92), m(1), { w: 2, color: RED });
    };
    const mask = (k, a, b) => {
      const m = mk(a, b);
      const R = [[88, 126], [212, 125], [213, 204], [88, 205], [88, 126]];
      k.line(R, m(0), m(0.3), { w: 2.8 });
      k.line([[108, 132], [192, 132]], m(0.3), m(0.36), { w: 3.4 });
      [150, 166, 182].forEach((y, i) => { k.line([[88, y], [212, y - 1]], m(0.38 + i * 0.07), m(0.44 + i * 0.07), { w: 1.8 }); k.line([[88, y + 5], [212, y + 4]], m(0.41 + i * 0.07), m(0.47 + i * 0.07), { w: 1.2 }); });
      const loop = k.curve([88, 134], [34, 124], [34, 206], [88, 196]);
      k.line(loop, m(0.62), m(0.78), { w: 2 }); k.line(fl(loop), m(0.78), m(0.94), { w: 2 });
      k.line([[96, 126], [96, 204]], m(0.94), m(0.97), { w: 1.2 }); k.line([[204, 126], [204, 204]], m(0.96), m(1), { w: 1.2 });
    };
    const dress = (k, a, b) => {
      const m = mk(a, b);
      const L = [[134, 90], [131, 112], [126, 138], [136, 152], [84, 232]];
      k.line(L, m(0), m(0.22), { w: 2.8 }); k.line(fl(L), m(0.22), m(0.44), { w: 2.8 });
      k.line(k.curve([131, 112], [140, 126], [146, 126], [150, 118]), m(0.44), m(0.5), { w: 2.4 });
      k.line(k.curve([150, 118], [154, 126], [160, 126], [169, 112]), m(0.48), m(0.54), { w: 2.4 });
      k.line(k.curve([84, 232], [120, 240], [180, 240], [216, 232]), m(0.54), m(0.64), { w: 2.8 });
      k.line([[136, 152], [164, 152]], m(0.64), m(0.67), { w: 2 });
      // folds of the skirt
      [[[142, 156], [122, 232]], [[150, 156], [150, 236]], [[158, 156], [178, 232]]].forEach((P, i) => k.line(P, m(0.68 + i * 0.05), m(0.73 + i * 0.05), { w: 1.4 }));
      // glints of light
      [[112, 196], [186, 206], [144, 138]].forEach(([x, y], i) => {
        const t0 = m(0.84 + i * 0.05), t1 = m(0.89 + i * 0.05);
        k.line([[x - 8, y], [x + 8, y]], t0, t1, { w: 1.8, color: RED }); k.line([[x, y - 8], [x, y + 8]], t0, t1, { w: 1.8, color: RED });
      });
    };
    const hat = (k, a, b) => {
      const m = mk(a, b);
      const crown = [[102, 196], [108, 132]].concat(k.curve([108, 132], [118, 108], [138, 110], [150, 120]), k.curve([150, 120], [162, 110], [182, 108], [192, 132]), [[198, 196]]);
      k.line(crown, m(0), m(0.35), { w: 2.8 });
      k.line(k.ellipse(150, 204, 104, 24, Math.PI, Math.PI * 2), m(0.35), m(0.5), { w: 1.6 });
      k.line(k.ellipse(150, 204, 104, 24, 0, Math.PI), m(0.48), m(0.66), { w: 2.8 });
      const b1 = k.curve([104, 176], [130, 186], [170, 186], [196, 176]), b2 = k.curve([102, 194], [130, 204], [170, 204], [198, 194]);
      k.line(b1, m(0.66), m(0.74), { w: 2 }); k.line(b2, m(0.72), m(0.8), { w: 2 });
      k.hatch(b1.concat(b2.slice().reverse()), m(0.8), m(0.94), { density: 1.5 });
      k.line(k.curve([150, 120], [146, 136], [152, 146], [150, 160]), m(0.92), m(1), { w: 1.4 });
    };

    // ---- one case = card + two questions side by side ----
    const cols = {};
    const file = (n, key, title, clues, product, type, why) => {
      const row = ui.el('div', 'row p09-row');
      row.appendChild(caseFile(n, title, clues, product));
      const col = (cols[key] = ui.el('div', 'p09-qs', '', row));
      col.appendChild(mcq(Object.assign({ id: `p09.${key}-type` }, type)));
      col.appendChild(mcq(Object.assign({ id: `p09.${key}-why` }, why)));
    };
    const css = document.createElement('style');
    css.textContent = `.p09-row{gap:16px;margin-bottom:var(--R)}.p09-row>.p09-case{flex:0 0 250px;margin:0;position:sticky;top:8px}.p09-row>.p09-qs{flex:1 1 330px;min-width:0}.p09-qs .act{margin-bottom:calc(var(--R)*.8)}
      .p09-qs .opts{grid-template-columns:repeat(auto-fit,minmax(200px,1fr))}
      @media (max-width:760px){.p09-row>.p09-case{flex:0 0 100%;max-width:280px;position:static}}`;
    root.appendChild(css);

    file(1, 'jeans', 'stretch jeans', ['98% cotton', '2% elastane', 'Fine diagonal lines.'], jeans,
      { label: 'Stretch jeans (denim): which construction', q: 'The cloth is denim. <b>Which construction</b> is it?', options: [
        { t: 'Twill weave', ok: true, why: 'Yes: in a twill weave the pattern shifts one step each row, which gives the diagonal lines of denim.' },
        { t: 'Plain weave', mis: 'weave-type', why: 'A plain weave looks the same both sides, with no diagonal lines. Read the last line of the label again.' },
        { t: 'Satin weave', mis: 'weave-type', why: 'A satin weave is smooth and shiny, and it snags. Denim is hard-wearing with diagonal lines.' },
        { t: 'Weft knit', mis: 'woven-vs-knit', why: 'Denim is not made of loops: it is woven on a loom. Look for the weave that gives diagonal lines.' },
      ] },
      { label: 'Stretch jeans: what the 2% elastane is for', q: '<b>Why</b> is there 2% elastane in the cotton?', options: [
        { t: 'For stretch: comfy jeans that keep their shape', ok: true, why: 'Yes: a small amount of elastane gives stretch, so the jeans are comfortable and keep their shape.' },
        { t: 'For warmth: it traps air, so the jeans insulate', mis: 'synthetic-mixup', why: 'Elastane is not added for warmth. Think about what elastane does that no other fibre does so well.' },
        { t: 'For drying: it stops the cotton soaking up water', mis: 'synthetic-mixup', why: '2% of a fibre cannot stop cotton being absorbent. Think about what elastane is famous for.' },
      ] });

    file(2, 'shirt', 'school shirt', ['65% polyester', '35% cotton', 'Needs little ironing.'], schoolShirt,
      { label: 'School shirt (polycotton): blend or mixture', q: 'The two fibres were mixed <b>before spinning</b>, so both are in every yarn. <b>What is this called?</b>', options: [
        { t: 'A blend', ok: true, why: 'Yes: a blend is two or more fibres mixed together before they are spun into one yarn. This one is polycotton.' },
        { t: 'A mixture', mis: 'blend-meaning', why: 'A mixture uses different YARNS in one fabric, for example a cotton warp and a polyester weft.' },
        { t: 'A bonded fabric', mis: 'nonwoven', why: 'A bonded fabric is a non-woven: it has no yarns at all. This shirt is woven from yarns.' },
      ] },
      { label: 'School shirt: what the polyester adds', q: '<b>Why</b> is polyester added to the cotton?', options: [
        { t: 'The shirt creases less, dries faster and is stronger', ok: true, why: 'Yes: polycotton stays comfortable and absorbent like cotton, but it is stronger, creases less, dries faster and is cheaper.' },
        { t: 'The shirt soaks up more sweat and feels cooler', mis: 'polycotton-props', why: 'That is what the COTTON gives. Polyester has low absorbency.' },
        { t: 'The shirt stretches to five times its length', mis: 'synthetic-mixup', why: 'That is elastane. Polyester is strong and durable, not very stretchy.' },
      ] });

    file(3, 'jumper', 'winter jumper', ['100% ? ? ?', 'Hand wash cool. Hot', 'wash: shrinks, felts.'], jumper,
      { label: 'Winter jumper: which fibre (shrinks and felts if washed hot)', q: 'The fibre name has rubbed off. <b>Which fibre</b> is it?', options: [
        { t: 'Wool', ok: true, why: 'Yes: wool can shrink and felt if it is washed hot.' },
        { t: 'Cotton', mis: 'cotton-wool', why: 'Cotton can shrink, but it does not felt. Which fibre mats together into felt?' },
        { t: 'Linen', mis: 'natural-mixup', why: 'Linen is a cool, crisp fibre for summer clothes, and it does not felt.' },
        { t: 'Silk', mis: 'natural-mixup', why: 'Silk needs careful washing, but it does not felt, and it is used for luxury dresses, ties and scarves.' },
      ] },
      { label: 'Winter jumper: why the fibre is warm', q: '<b>Why</b> does this fibre keep you warm?', options: [
        { t: 'Its fibres trap air, and air is a good insulator', ok: true, why: 'Yes: the fibres trap air, which makes the fabric a good insulator.' },
        { t: 'Its fibres soak up sweat, and that heats the skin', mis: 'property-word', why: 'Being absorbent is not what keeps you warm. Think about what is held between the fibres.' },
        { t: 'Its fibres are smooth and shiny, so heat bounces off', mis: 'natural-mixup', why: 'Smooth and shiny (lustrous) describes silk, and it is not why a jumper is warm.' },
      ] });

    file(4, 'linen', 'summer shirt', ['100% ? ? ?', 'From a plant stem.', 'Creases very easily.'], summerShirt,
      { label: 'Summer shirt: which fibre (plant stem, creases very easily)', q: 'The fibre name has rubbed off. <b>Which fibre</b> is it?', options: [
        { t: 'Linen', ok: true, why: 'Yes: linen comes from the stem of the flax plant, and it creases very easily.' },
        { t: 'Cotton', mis: 'natural-mixup', why: 'Cotton does crease, but it comes from the seed pod (boll) of the cotton plant, not from a stem.' },
        { t: 'Wool', mis: 'plant-animal', why: 'Wool is an animal fibre, from the fleece of sheep. Its creases drop out.' },
        { t: 'Silk', mis: 'plant-animal', why: 'Silk is an animal fibre, from the cocoon of the silkworm.' },
      ] },
      { label: 'Summer shirt: why the fibre suits hot weather', q: '<b>Why</b> is it a good choice for a hot holiday?', options: [
        { t: 'It is cool, absorbent and fresh to wear', ok: true, why: 'Yes: it is absorbent, cool and crisp, so it feels fresh in hot weather.' },
        { t: 'It traps lots of air, so it insulates well', mis: 'cotton-wool', why: 'Trapping air keeps you WARM: that is wool. In hot weather you want a cool fibre.' },
        { t: 'It has low absorbency and never creases', mis: 'property-word', why: 'That sounds like a synthetic fibre. The label tells you this one creases very easily.' },
      ] });

    file(5, 'swim', 'swimsuit', ['80% polyamide', '20% elastane', 'Stretchy: no ladders.'], swimsuit,
      { label: 'Swimsuit: which construction (stretchy, does not ladder)', q: '<b>Which construction</b> is it?', options: [
        { t: 'Warp knit', ok: true, why: 'Yes: a warp knit is machine made from many yarns looping vertically. It does not ladder or unravel.' },
        { t: 'Weft knit', mis: 'knit-type', why: 'A weft knit is very stretchy, but it ladders and unravels if a stitch breaks. Read the label again.' },
        { t: 'Plain weave', mis: 'woven-vs-knit', why: 'A woven fabric has little stretch and frays at cut edges. A swimsuit needs a stretchy, close fit.' },
        { t: 'Felt', mis: 'nonwoven', why: 'Felt is a weak non-woven that is not stretchy and cannot be washed.' },
      ] },
      { label: 'Swimsuit: why polyamide is the main fibre', q: '<b>Why</b> is polyamide a good main fibre here?', options: [
        { t: 'Strong, quick drying, with low absorbency', ok: true, why: 'Yes: polyamide (nylon) is very strong and hard-wearing, lightweight and quick drying, with low absorbency.' },
        { t: 'Soft, slow drying, with high absorbency', mis: 'property-word', why: 'That describes cotton. A swimsuit should not soak up water and stay wet.' },
        { t: 'Warm, a little itchy, and it felts in water', mis: 'natural-synthetic', why: 'That describes wool, a natural fibre. Polyamide is a synthetic fibre.' },
      ] });

    file(6, 'mask', 'disposable face mask', ['100% synthetic', 'No yarn: a fibre web', 'joined by heat.'], mask,
      { label: 'Disposable face mask: which construction (no yarn, web joined by heat)', q: '<b>Which construction</b> is it?', options: [
        { t: 'Bonded fabric', ok: true, why: 'Yes: a bonded fabric is a web of fibres held together by adhesive, by heat or by needle-punching.' },
        { t: 'Felted fabric', mis: 'nonwoven', why: 'Felt is also a non-woven, but it is made from WOOL fibres matted together. The label says synthetic.' },
        { t: 'Warp knit', mis: 'nonwoven', why: 'All knitted fabrics are made from yarn formed into loops. The label says there is no yarn.' },
        { t: 'Plain weave', mis: 'nonwoven', why: 'All woven fabrics are made from two sets of yarns. The label says there is no yarn.' },
      ] },
      { label: 'Disposable face mask: why this construction suits single use', q: '<b>Why</b> does this construction suit a mask you wear once?', options: [
        { t: 'It is cheap, quick to make and does not fray', ok: true, why: 'Yes: it is cheap and quick to make, and it does not fray. It is generally weaker, which matters less for single use.' },
        { t: 'It is strong, stretchy and drapes very well', mis: 'nonwoven', why: 'Non-woven fabrics are generally weaker, with little drape and no stretch.' },
        { t: 'It is warm, washable and lasts for years', mis: 'nonwoven', why: 'A disposable product does not need to last or be washed. Think about cost and speed.' },
      ] });

    file(7, 'dress', 'evening dress', ['100% silk', 'Smooth, shiny face.', 'Snags. Wash gently.'], dress,
      { label: 'Evening dress: which construction (smooth, shiny, snags)', q: '<b>Which construction</b> is it?', options: [
        { t: 'Satin weave', ok: true, why: 'Yes: a satin weave has a smooth, shiny (lustrous) surface, but it can snag and is less hard-wearing.' },
        { t: 'Twill weave', mis: 'weave-type', why: 'A twill weave has diagonal lines and is strong and hard-wearing, like denim.' },
        { t: 'Plain weave', mis: 'weave-type', why: 'A plain weave is firm, strong and hard-wearing. It does not have a shiny face that snags.' },
      ] },
      { label: 'Evening dress: why silk needs careful washing', q: '<b>Why</b> does silk need careful washing?', options: [
        { t: 'Silk is weaker when it is wet', ok: true, why: 'Yes: silk is strong for its weight when dry, but weaker when wet, so it needs careful washing.' },
        { t: 'Silk is stronger when it is wet', mis: 'natural-mixup', why: 'That is cotton. Silk is the other way round.' },
        { t: 'Silk melts when it is wet', mis: 'natural-synthetic', why: 'Melting is a problem for synthetic fibres under a hot iron. Silk is a natural fibre.' },
      ] });

    file(8, 'hat', 'trilby hat', ['100% wool', 'No yarn: matted', 'fibres. Do not wash.'], hat,
      { label: 'Trilby hat: which construction (wool, no yarn, matted)', q: '<b>Which construction</b> is it?', options: [
        { t: 'Felted fabric', ok: true, why: 'Yes: felt is wool fibres matted together. It is warm, does not fray and can be moulded into a hat shape.' },
        { t: 'Bonded fabric', mis: 'nonwoven', why: 'A bonded fabric is also a non-woven, but it is a web of (often synthetic) fibres held together, not matted wool.' },
        { t: 'Weft knit', mis: 'nonwoven', why: 'A weft knit is made from one continuous yarn in loops. The label says there is no yarn.' },
        { t: 'Twill weave', mis: 'nonwoven', why: 'A twill weave is made from warp and weft yarns. The label says there is no yarn.' },
      ] },
      { label: 'Trilby hat: how the fibres are locked together', q: '<b>How</b> were the fibres locked together?', options: [
        { t: 'With heat, moisture, pressure and friction', ok: true, why: 'Yes: heat, moisture, pressure and friction make the scales on the wool fibres lock together.' },
        { t: 'With adhesive sprayed on a web of fibres', mis: 'nonwoven', why: 'That is one way of making a bonded fabric. Wool fibres lock together by themselves when they are agitated.' },
        { t: 'With a weft passed over and under a warp', mis: 'nonwoven', why: 'That is weaving, which needs yarns. This fabric is made directly from fibres.' },
      ] });

    // ---- case closed: an exam-style written explanation ----
    ui.el('h2', '', 'Case closed: write it up');
    ui.p('A good detective explains the evidence. Say what the fibre <b>does</b>, then why that <b>matters</b> for a swimmer.');
    const w = ui.write({ id: 'p09.explain', label: 'Explain why elastane is added to swimwear [2]', marks: 2, lines: 4,
      q: '<b>Explain</b> why elastane is added to swimwear.',
      scheme: ['Elastane is extremely stretchy / stretches to about 5–7 times its length and springs back', 'So the swimsuit fits closely / is comfortable to move in / keeps its shape'],
      model: 'Elastane is <b>extremely stretchy</b>: it stretches to about 5–7 times its length and <b>springs back</b>. Adding a small amount to another fibre means the swimsuit stretches for a close, comfortable fit and <b>keeps its shape</b>.' });
    // recall, not copy: the feedback of the two elastane cases is blurred while this is being written, until it has been checked
    const checked = () => { const it = Book.state.items['p09.explain']; return !!(it && it.ticks); };
    const lock = (on) => [cols.jeans, cols.swim].forEach((c) => c.classList.toggle('peek-lock', on));
    w.querySelector('textarea').addEventListener('focus', () => { if (!checked()) lock(true); });
    w.addEventListener('click', () => setTimeout(() => { if (checked()) lock(false); }, 50));
  },
});
