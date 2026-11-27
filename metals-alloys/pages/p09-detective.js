// Page 9 — Metal detective: eight everyday products on case-file cards.
// For each: which metal is it, and why (which property)? Ends with a 2-mark written explanation.
Book.page({
  id: 'p09',
  title: 'Metal detective',
  build(ui, root) {
    const RED = Ink.RED;
    ui.h('Metal detective');
    ui.p('Eight products are on your desk. For each case file, look at the drawing and the <b>clues</b>, then decide <b>which metal</b> it is and <b>why</b> the designer chose it.');
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

    // ---- product drawings (all inside x 26..274, y 88..236). Nothing is labelled with its metal. ----
    const mk = (a, b) => (u) => a + (b - a) * u;
    // a light coloured-pencil wash once the outline is drawn (only where the clue names the colour)
    const wash = (k, at, col, path) => { if (k.t < at) return; const c = k.ctx; c.save(); c.fillStyle = col; c.beginPath(); path(c); c.fill('evenodd'); c.restore(); };
    const can = (k, a, b) => {
      const m = mk(a, b);
      k.line(k.ellipse(150, 104, 44, 11), m(0), m(0.18), { w: 2.6 });
      k.line(k.ellipse(150, 105, 37, 8), m(0.16), m(0.3), { w: 1.6 });
      k.line([[106, 104], [104, 116], [104, 214]], m(0.3), m(0.42), { w: 2.6 });
      k.line([[194, 104], [196, 116], [196, 214]], m(0.38), m(0.5), { w: 2.6 });
      k.line(k.ellipse(150, 214, 46, 12, 0, Math.PI), m(0.5), m(0.62), { w: 2.6 });
      k.line(k.ellipse(150, 222, 38, 9, 0.2, Math.PI - 0.2), m(0.6), m(0.68), { w: 1.8 });
      k.line(k.ellipse(142, 104, 12, 4), m(0.68), m(0.76), { w: 1.8 }); k.line(k.ellipse(164, 105, 7, 3), m(0.74), m(0.8), { w: 1.8 });
      k.line(k.curve([116, 132], [140, 150], [160, 150], [184, 132]), m(0.8), m(0.86), { w: 1.6 });
      k.line(k.curve([116, 188], [140, 206], [160, 206], [184, 188]), m(0.84), m(0.9), { w: 1.6 });
      k.hatch([[176, 118], [195, 116], [195, 216], [176, 224]], m(0.88), m(1), { density: 1.1 });
    };
    const bolt = (k, a, b) => {
      const m = mk(a, b);
      k.line(k.rect(40, 128, 40, 68, 4), m(0), m(0.16), { w: 2.8 });
      k.line([[42, 150], [78, 150]], m(0.14), m(0.19), { w: 1.6 }); k.line([[42, 174], [78, 174]], m(0.17), m(0.22), { w: 1.6 });
      k.line([[80, 146], [262, 146], [268, 152], [268, 172], [262, 178], [80, 178]], m(0.22), m(0.42), { w: 2.6 });
      for (let i = 0; i < 9; i++) { const x = 160 + i * 12, u = 0.42 + i * 0.022; if (x > 176 && x < 216) continue; k.line([[x, 146], [x + 7, 178]], m(u), m(u + 0.03), { w: 1.6 }); }
      k.line(k.rect(180, 122, 34, 80, 4), m(0.64), m(0.8), { w: 2.8 });
      k.line([[182, 148], [212, 148]], m(0.78), m(0.83), { w: 1.6 }); k.line([[182, 176], [212, 176]], m(0.81), m(0.86), { w: 1.6 });
      k.hatch([[42, 176], [78, 176], [78, 194], [42, 194]], m(0.86), m(0.93), { density: 1.3 });
      k.hatch([[182, 178], [212, 178], [212, 200], [182, 200]], m(0.9), m(1), { density: 1.3 });
    };
    const chisel = (k, a, b) => {
      const m = mk(a, b);
      const handle = [[32, 150], [40, 142], [116, 144], [124, 150], [124, 172], [116, 178], [40, 180], [32, 172], [32, 150]];
      k.line(handle, m(0), m(0.25), { w: 2.8 });
      k.line(k.curve([52, 150], [76, 156], [92, 148], [112, 152]), m(0.2), m(0.27), { w: 1.2 }); k.line(k.curve([48, 168], [70, 164], [96, 172], [114, 168]), m(0.24), m(0.31), { w: 1.2 });
      k.line(k.rect(124, 147, 14, 28, 2), m(0.3), m(0.4), { w: 2.6 });
      k.hatch([[124, 147], [138, 147], [138, 175], [124, 175]], m(0.38), m(0.46), { density: 1.5 });
      k.line([[138, 156], [156, 156], [166, 146], [268, 146], [268, 176], [166, 176], [156, 166], [138, 166]], m(0.46), m(0.78), { w: 2.8 });
      k.line([[244, 146], [244, 176]], m(0.78), m(0.84), { w: 1.8 });
      k.hatch([[244, 146], [268, 146], [268, 176], [244, 176]], m(0.84), m(0.94), { density: 1.4 });
      k.line([[176, 152], [234, 152]], m(0.92), m(1), { w: 1.2 });
    };
    const drain = (k, a, b) => {
      const m = mk(a, b);
      k.circle(150, 162, 72, m(0), m(0.25), { w: 3 });
      k.circle(150, 162, 62, m(0.22), m(0.42), { w: 1.8 });
      let i = 0;
      for (let gy = -2; gy <= 2; gy++) for (let gx = -2; gx <= 2; gx++) {
        if (Math.hypot(gx, gy) > 2.3) continue;
        const x = 150 + gx * 24 - 8, y = 162 + gy * 24 - 8, u = 0.42 + i * 0.02; i++;
        k.line(k.rect(x, y, 16, 16, 2), m(u), m(u + 0.035), { w: 1.8 });
      }
      k.line(k.rect(92, 158, 9, 8, 2), m(0.88), m(0.92), { w: 2.2 }); k.line(k.rect(199, 158, 9, 8, 2), m(0.9), m(0.94), { w: 2.2 });
      k.hatch(k.ellipse(150, 162, 72, 72, 0.2, 1.3).concat(k.ellipse(150, 162, 62, 62, 1.3, 0.2)), m(0.92), m(1), { density: 1.4 });
    };
    const pipe = (k, a, b) => {
      const m = mk(a, b);
      const outer = [[36, 216], [190, 216]].concat(k.curve([190, 216], [222, 216], [240, 198], [240, 166]), [[240, 100]]);
      const inner = [[36, 190], [186, 190]].concat(k.curve([186, 190], [204, 190], [214, 180], [214, 162]), [[214, 100]]);
      wash(k, m(0.6), 'rgba(196,104,52,0.26)', (c) => { outer.forEach(([x, y], j) => (j ? c.lineTo(x, y) : c.moveTo(x, y))); inner.slice().reverse().forEach(([x, y]) => c.lineTo(x, y)); c.closePath(); });
      k.line(outer, m(0), m(0.3), { w: 2.8 });
      k.line(inner, m(0.28), m(0.56), { w: 2.8 });
      k.line(k.ellipse(36, 203, 5, 13), m(0.56), m(0.64), { w: 2.2 });
      k.line(k.ellipse(227, 100, 13, 5), m(0.62), m(0.7), { w: 2.2 });
      k.line([[150, 186], [150, 220], [164, 220], [164, 186], [150, 186]], m(0.7), m(0.8), { w: 2.4 });
      k.line([[210, 136], [244, 136], [244, 150], [210, 150], [210, 136]], m(0.78), m(0.88), { w: 2.4 });
      k.hatch([[60, 208], [146, 208], [146, 215], [60, 215]], m(0.88), m(1), { density: 1.3 });
    };
    const foodcan = (k, a, b) => {
      const m = mk(a, b);
      k.line(k.ellipse(146, 132, 58, 14), m(0), m(0.18), { w: 2.6 });
      k.line([[88, 132], [88, 214]], m(0.18), m(0.26), { w: 2.6 }); k.line([[204, 132], [204, 214]], m(0.22), m(0.3), { w: 2.6 });
      k.line(k.ellipse(146, 214, 58, 14, 0, Math.PI), m(0.3), m(0.42), { w: 2.6 });
      [150, 160, 196, 206].forEach((y, i) => k.line(k.ellipse(146, y, 58, 14, 0.05, Math.PI - 0.05), m(0.42 + i * 0.05), m(0.48 + i * 0.05), { w: 1.4 }));
      // the lid, cut open and bent up
      const lid = k.ellipse(190, 106, 44, 12).map(([x, y]) => { const dx = x - 190, dy = y - 106, r = -0.5; return [190 + dx * Math.cos(r) - dy * Math.sin(r), 106 + dx * Math.sin(r) + dy * Math.cos(r)]; });
      k.line(lid, m(0.64), m(0.8), { w: 2.4 });
      k.line(k.ellipse(146, 133, 46, 9, 0.3, Math.PI - 0.3), m(0.8), m(0.88), { w: 1.6 });
      k.hatch([[184, 164], [203, 160], [203, 196], [184, 200]], m(0.88), m(1), { density: 1.2 });
    };
    const key = (k, a, b) => {
      const m = mk(a, b);
      const blade = [[112, 150], [264, 150], [272, 160], [264, 170], [252, 170], [246, 182], [238, 170], [226, 170], [220, 186], [212, 170], [200, 170], [194, 180], [186, 170], [172, 170], [166, 184], [158, 170], [112, 172]];
      wash(k, m(0.7), 'rgba(214,170,36,0.32)', (c) => { c.arc(78, 162, 40, 0, 7); c.closePath(); c.moveTo(72, 162); c.arc(60, 162, 12, 0, 7); c.closePath(); blade.forEach(([x, y], j) => (j ? c.lineTo(x, y) : c.moveTo(x, y))); c.closePath(); });
      k.circle(78, 162, 40, m(0), m(0.25), { w: 2.8 });
      k.circle(60, 162, 12, m(0.22), m(0.34), { w: 2.2 });
      k.line(blade, m(0.34), m(0.8), { w: 2.6 });
      k.line([[120, 158], [256, 158]], m(0.8), m(0.9), { w: 1.4 });
      k.hatch(k.ellipse(78, 162, 40, 40, 0.3, 1.5).concat(k.ellipse(78, 162, 30, 30, 1.5, 0.3)), m(0.9), m(1), { density: 1.3 });
    };
    const fork = (k, a, b) => {
      const m = mk(a, b);
      const top = [[30, 154]].concat(k.curve([30, 154], [90, 148], [130, 158], [168, 158]), k.curve([168, 158], [182, 158], [184, 134], [204, 132]), [[270, 136]]);
      const bot = [[30, 172]].concat(k.curve([30, 172], [90, 178], [130, 168], [168, 168]), k.curve([168, 168], [182, 168], [184, 192], [204, 194]), [[270, 190]]);
      k.line(top, m(0), m(0.3), { w: 2.6 });
      k.line(bot, m(0.3), m(0.6), { w: 2.6 });
      k.line(k.curve([30, 154], [22, 158], [22, 168], [30, 172]), m(0.58), m(0.64), { w: 2.6 });
      [[148, 156], [163, 170], [178, 0]].slice(0, 2).forEach(([y0, y1], i) => {
        k.line([[270, y0 - 12 + i * 3], [216, y0 - 6 + i * 2], [216, y0 + 2 + i], [270, y0 + i * 3 - 1]], m(0.64 + i * 0.07), m(0.72 + i * 0.07), { w: 2.2 });
      });
      k.line([[270, 177], [216, 176], [216, 182], [270, 187]], m(0.78), m(0.86), { w: 2.2 });
      k.line(k.curve([44, 160], [80, 157], [110, 163], [140, 163]), m(0.86), m(0.92), { w: 1.2 });
      k.hatch([[184, 176], [212, 172], [212, 190], [196, 190]], m(0.92), m(1), { density: 1.3 });
    };

    // ---- one case = card + two questions side by side ----
    const cols = {};
    const file = (n, key_, title, clues, product, metal, why) => {
      const row = ui.el('div', 'row p09-row');
      row.appendChild(caseFile(n, title, clues, product));
      const col = (cols[key_] = ui.el('div', 'p09-qs', '', row));
      col.appendChild(mcq(Object.assign({ id: `p09.${key_}-metal`, q: '<b>Which metal</b> is it?' }, metal)));
      col.appendChild(mcq(Object.assign({ id: `p09.${key_}-why` }, why)));
    };
    const css = document.createElement('style');
    css.textContent = `.p09-row{gap:16px;margin-bottom:var(--R)}.p09-row>.p09-case{flex:0 0 250px;margin:0;position:sticky;top:8px}.p09-row>.p09-qs{flex:1 1 330px;min-width:0}.p09-qs .act{margin-bottom:calc(var(--R)*.8)}
      .p09-qs .opts{grid-template-columns:repeat(auto-fit,minmax(200px,1fr))}
      @media (max-width:760px){.p09-row>.p09-case{flex:0 0 100%;max-width:280px;position:static}}`;
    root.appendChild(css);

    file(1, 'can', 'drinks can', ['Feels very light.', "A magnet won't stick.", 'Pressed from a disc.'], can,
      { label: 'Drinks can: which metal', options: [
        { t: 'Aluminium', ok: true, why: 'Yes. Now decide why it suits a can.' },
        { t: 'Low carbon steel', mis: 'ferrous-meaning', why: 'Steel is ferrous (it contains iron), so a magnet would stick to it. Look at the clues again.' },
        { t: 'Tin', mis: 'tin-can', why: 'Tin is not used for whole cans: it is soft and weak, and is used as a thin coating. Which metal is known for being light?' },
        { t: 'Zinc', mis: 'nonferrous-mixup', why: 'Zinc is fairly weak and brittle, so it would crack when pressed, and it is not a light metal. It is used for galvanising.' },
      ] },
      { label: 'Drinks can: why this metal', q: '<b>Why</b> does it suit a drinks can?', options: [
        { t: 'Low density, and malleable enough to press into shape', ok: true, why: 'Yes: it is lightweight and malleable. It is also corrosion-resistant, so the drink does not attack it.' },
        { t: 'Very hard, so the can keeps its shape when dropped', mis: 'nonferrous-mixup', why: 'This metal is soft, not hard: you can crush a can in one hand.' },
        { t: 'Very low melting point, so it is quick to cast', mis: 'nonferrous-mixup', why: 'The very low melting points belong to tin and zinc, and a can is pressed, not cast.' },
      ] });

    file(2, 'bolt', 'nut and bolt', ['A magnet sticks.', 'Cheap, made by the', 'million. Rusts if wet.'], bolt,
      { label: 'Nut and bolt: which metal', options: [
        { t: 'Low carbon steel', ok: true, why: 'Yes: also called mild steel. Now decide why.' },
        { t: 'High carbon steel', mis: 'steel-mixup', why: 'High carbon steel is very hard and more brittle: it is kept for cutting tools, and is much harder to machine.' },
        { t: 'Cast iron', mis: 'steel-mixup', why: 'Cast iron is brittle and is poured into moulds to make chunky shapes. A thin bolt of it would crack.' },
        { t: 'Aluminium', mis: 'ferrous-meaning', why: 'Aluminium is non-ferrous: a magnet would not stick, and it does not rust.' },
      ] },
      { label: 'Nut and bolt: why this metal', q: '<b>Why</b> is it the right choice?', options: [
        { t: 'It is tough, cheap and easy to cut and machine', ok: true, why: 'Yes: tough, cheap and easy to cut, bend, weld and machine. Its weakness is that it rusts easily.' },
        { t: 'It is very hard and keeps a sharp cutting edge', mis: 'steel-mixup', why: 'That describes high carbon steel, used for tools. A bolt does not need a cutting edge.' },
        { t: 'It will not rust when it is left out in the rain', mis: 'ferrous-meaning', why: 'It is a ferrous metal with no protection, so it does rust: the clue card says so.' },
      ] });

    file(3, 'chisel', 'chisel blade', ['A magnet sticks.', 'Hardened and tempered.', 'Snaps if you lever it.'], chisel,
      { label: 'Chisel blade: which metal', options: [
        { t: 'High carbon steel', ok: true, why: 'Yes: also called tool steel. Now decide why.' },
        { t: 'Low carbon steel', mis: 'steel-mixup', why: 'Low carbon steel is tough and ductile: it would bend rather than snap, and it is not hard enough for a cutting tool.' },
        { t: 'Cast iron', mis: 'steel-mixup', why: 'Cast iron is brittle, but it is shaped by casting, not hardened and tempered. It is used for the vice, not the chisel.' },
        { t: 'Brass', mis: 'ferrous-meaning', why: 'Brass is a non-ferrous alloy, so a magnet would not stick to it.' },
      ] },
      { label: 'Chisel blade: why this metal', q: '<b>Why</b> is it right for a chisel?', options: [
        { t: 'Very hard, so it keeps a sharp cutting edge', ok: true, why: 'Yes: more carbon makes steel harder, so the edge stays sharp. The price is that it is less ductile and more brittle.' },
        { t: 'Very ductile, so the blade bends, not snaps', mis: 'carbon-rule', why: 'More carbon makes steel LESS ductile and more brittle: that is why it snaps if you lever with it.' },
        { t: 'It does not rust, so it can be stored damp', mis: 'ferrous-meaning', why: 'It is a ferrous metal, so it does rust. Tools are kept dry or lightly oiled.' },
      ] });

    file(4, 'drain', 'drain cover', ['A magnet sticks.', 'Poured into a mould.', 'Cracked when dropped.'], drain,
      { label: 'Drain cover: which metal', options: [
        { t: 'Cast iron', ok: true, why: 'Yes. Now decide why it suits a drain cover.' },
        { t: 'Low carbon steel', mis: 'steel-mixup', why: 'Low carbon steel is tough: it dents or bends rather than cracks. It is usually cut, bent and welded, not poured.' },
        { t: 'High carbon steel', mis: 'steel-mixup', why: 'High carbon steel is for cutting tools such as chisels, files and saw blades, not big poured shapes.' },
        { t: 'Zinc', mis: 'ferrous-meaning', why: 'Zinc can be cast, but it is non-ferrous, so a magnet would not stick, and it is fairly weak.' },
      ] },
      { label: 'Drain cover: why this metal', q: '<b>Why</b> does it suit a drain cover?', options: [
        { t: 'Very strong in compression, so it takes the weight', ok: true, why: 'Yes: it is hard and very strong in compression, cheap, and pours well to make the shape.' },
        { t: 'Very tough, so it never cracks when it is hit hard', mis: 'property-word', why: 'It is hard but brittle, which is the opposite of tough: the clue card says it cracked.' },
        { t: 'It never rusts, so it needs no coating outdoors', mis: 'ferrous-meaning', why: 'It is a ferrous metal, so it does rust. It is simply thick enough to last.' },
      ] });

    file(5, 'pipe', 'water pipe', ['Reddish-brown.', "A magnet won't stick.", 'Old ones turn green.'], pipe,
      { label: 'Water pipe: which metal', options: [
        { t: 'Copper', ok: true, why: 'Yes: the green layer is called a patina. Now decide why it suits a pipe.' },
        { t: 'Brass', mis: 'alloy-mixup', why: 'Brass is golden yellow and harder. It is used for the taps and fittings on the pipe.' },
        { t: 'Aluminium', mis: 'nonferrous-mixup', why: 'Aluminium is silvery, and it does not turn green.' },
        { t: 'Low carbon steel', mis: 'ferrous-meaning', why: 'Steel is ferrous: a magnet would stick, and it would rust orange-brown, not turn green.' },
      ] },
      { label: 'Water pipe: why this metal', q: '<b>Why</b> does it suit a water pipe?', options: [
        { t: 'Malleable and ductile, and it resists corrosion', ok: true, why: 'Yes: it bends round corners without cracking, and water does not corrode it away.' },
        { t: 'Very hard and brittle, so it cannot be dented', mis: 'nonferrous-mixup', why: 'It is the opposite: very ductile and malleable, which is why plumbers can bend it.' },
        { t: 'The lowest density, so long pipes are light', mis: 'nonferrous-mixup', why: 'It is one of the densest metals you have met (8.9 g/cm³). The light one is aluminium.' },
      ] });

    file(6, 'foodcan', 'food can', ['A magnet sticks.', 'Bright silvery skin,', 'thinner than paper.'], foodcan,
      { label: 'Food can: what it is made of', q: '<b>What</b> is it made from?', options: [
        { t: 'Steel with a thin coating of tin', ok: true, why: 'Yes: it is called tinplate. Now decide what the coating is for.' },
        { t: 'Solid tin all the way through', mis: 'tin-can', why: 'A "tin can" is not solid tin: tin is soft and weak, and a magnet would not stick to it.' },
        { t: 'Steel with a thin coating of zinc', mis: 'galvanise-meaning', why: 'A zinc coating is galvanising: buckets, gates and crash barriers. Food cans use a different metal.' },
        { t: 'Aluminium with a coating of tin', mis: 'tin-can', why: 'A magnet sticks, so the body must be a ferrous metal. Aluminium is non-ferrous.' },
      ] },
      { label: 'Food can: why the coating', q: '<b>Why</b> is the coating there?', options: [
        { t: 'It is non-toxic and stops the steel from rusting', ok: true, why: 'Yes: tin is corrosion-resistant and non-toxic, so it keeps the wet food away from the steel.' },
        { t: 'It is very hard and makes the can much stronger', mis: 'nonferrous-mixup', why: 'The coating metal is soft and weak. The strength comes from the steel underneath.' },
        { t: 'It mixes with the steel and turns it into an alloy', mis: 'alloy-meaning', why: 'A coating is a layer on the surface. An alloy is a mixture all the way through.' },
      ] });

    file(7, 'key', 'door key', ['Golden yellow.', "A magnet won't stick.", 'Cut with fine grooves.'], key,
      { label: 'Door key: which metal', options: [
        { t: 'Brass', ok: true, why: 'Yes: an alloy of copper and zinc. Now decide why it beats pure copper.' },
        { t: 'Copper', mis: 'alloy-mixup', why: 'Copper is reddish-brown, not golden yellow, and it is softer.' },
        { t: 'Stainless steel', mis: 'alloy-mixup', why: 'Stainless steel is silvery and shiny, not golden yellow.' },
        { t: 'High carbon steel', mis: 'ferrous-meaning', why: 'High carbon steel is ferrous: a magnet would stick to it, and it is grey.' },
      ] },
      { label: 'Door key: why not pure copper', q: '<b>Why</b> is it better than pure copper for a key?', options: [
        { t: 'It is harder than copper, so it wears slowly', ok: true, why: 'Yes: alloying makes it harder than copper. It also machines well and resists corrosion.' },
        { t: 'It is softer than copper, so it is easy to turn', mis: 'alloy-mixup', why: 'Alloys are made to IMPROVE properties: this one is harder than copper, not softer.' },
        { t: 'It is a pure metal, so it can never wear out', mis: 'alloy-meaning', why: 'It is not a pure metal: it is an alloy, a mixture of two metals.' },
      ] });

    file(8, 'fork', 'fork', ['Shiny, hard and heavy.', 'Washed every day for', '20 years: no rust.'], fork,
      { label: 'Fork: which metal', options: [
        { t: 'Stainless steel', ok: true, why: 'Yes. Now decide why it does not rust.' },
        { t: 'Low carbon steel', mis: 'steel-mixup', why: 'Low carbon steel rusts easily: it would be brown after a few washes.' },
        { t: 'Aluminium', mis: 'nonferrous-mixup', why: 'Aluminium does not rust, but it is soft and very light. This fork is hard and heavy.' },
        { t: 'High speed steel', mis: 'alloy-mixup', why: 'High speed steel is for cutting tools that get very hot, such as drill bits and lathe tools.' },
      ] },
      { label: 'Fork: why it does not rust', q: '<b>Why</b> does it not rust?', options: [
        { t: 'Chromium in it forms a protective oxide layer', ok: true, why: 'Yes: the chromium forms an invisible oxide layer that protects the steel. It is hygienic too.' },
        { t: 'It contains no iron at all, so it cannot rust', mis: 'stainless-family', why: 'It is a FERROUS alloy: it is mostly steel, so it does contain iron. Something added to it protects it.' },
        { t: 'It has a zinc coating over ordinary steel', mis: 'galvanise-meaning', why: 'A zinc coating is galvanising. This metal is protected all the way through, not by a coating.' },
      ] });

    // ---- case closed: an exam-style written explanation ----
    ui.el('h2', '', 'Case closed: write it up');
    ui.p('One last case. The thick <b>overhead power cables</b> strung between pylons are made from <b>aluminium</b>, even though copper is the better conductor. A good detective explains the evidence.');
    const w = ui.write({ id: 'p09.explain', label: 'Explain why overhead power cables are aluminium rather than copper [2]', marks: 2, lines: 4,
      q: '<b>Explain</b> why overhead power cables are made from aluminium rather than copper.',
      scheme: ['Aluminium has a much lower density than copper / it is lightweight (lighter)', 'So the long cables weigh less for the pylons to hold up, and it is still a good conductor of electricity (also accept: it costs less than copper)'],
      model: 'Aluminium has a much <b>lower density</b> than copper (about 2.7 g/cm³ against 8.9 g/cm³), so the long cables are far <b>lighter</b> and the pylons have less weight to carry. Aluminium is still a <b>good conductor</b> of electricity, so it does the job.' });
    // recall, not copy: case 1's feedback is blurred while this is being written, until it has been checked
    const checked = () => { const it = Book.state.items['p09.explain']; return !!(it && it.ticks); };
    w.querySelector('textarea').addEventListener('focus', () => { if (!checked()) { cols.can.classList.add('peek-lock'); cols.pipe.classList.add('peek-lock'); } });
    w.addEventListener('click', () => setTimeout(() => { if (checked()) { cols.can.classList.remove('peek-lock'); cols.pipe.classList.remove('peek-lock'); } }, 50));
  },
});
