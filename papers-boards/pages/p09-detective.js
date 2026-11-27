// Page 9 — Paper detective: eight products and drawings on case-file cards.
// For each: which paper or board is it, and why? Ends with a 2-mark written explanation.
Book.page({
  id: 'p09',
  title: 'Paper detective',
  build(ui, root) {
    const RED = Ink.RED;
    ui.h('Paper detective');
    ui.p('Designers learn a lot by <b>looking closely at real products</b>. Eight pieces of evidence are on your desk. For each case file, look at the drawing and the clues, then decide <b>which paper or board</b> it is and <b>why</b> it was chosen.');
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

    // ---- evidence drawings (all inside x 26..274, y 88..236). Nothing is labelled with its name. ----
    const mk = (a, b) => (u) => a + (b - a) * u;
    const steam = (k, x, y, a, b) => k.line(k.curve([x, y], [x - 12, y - 12], [x + 12, y - 22], [x, y - 34]), a, b, { w: 1.6 });
    const pizza = (k, a, b) => {
      const m = mk(a, b);
      k.line([[40, 198], [200, 198], [200, 216], [40, 216], [40, 198]], m(0), m(0.14), { w: 2.6 });
      k.line([[40, 198], [66, 172], [226, 172], [200, 198]], m(0.12), m(0.26), { w: 2.6 });
      k.line([[226, 172], [226, 190], [200, 216]], m(0.24), m(0.3), { w: 2.4 });
      k.line([[66, 172], [78, 100], [238, 100], [226, 172]], m(0.3), m(0.46), { w: 2.6 });
      k.line(k.ellipse(133, 185, 58, 9), m(0.46), m(0.58), { w: 2.2 });
      [[108, 184], [132, 188], [156, 183], [140, 181]].forEach(([x, y], i) => k.dot(x, y, 2.6, m(0.58 + i * 0.01)));
      steam(k, 112, 166, m(0.6), m(0.66)); steam(k, 150, 162, m(0.64), m(0.7));
      // magnifier on the cut edge of the box
      k.circle(244, 208, 25, m(0.7), m(0.8), { w: 2.4, color: RED });
      k.line([[226, 190], [214, 200]], m(0.78), m(0.82), { w: 1.4, color: RED });
      k.line([[224, 196], [264, 196]], m(0.82), m(0.86), { w: 2.4 }); k.line([[224, 220], [264, 220]], m(0.84), m(0.88), { w: 2.4 });
      const wave = []; for (let x = 224; x <= 264; x += 2) wave.push([x, 208 + Math.sin((x - 224) / 40 * Math.PI * 6) * 10]);
      k.line(wave, m(0.88), m(1), { w: 2 });
    };
    const carton = (k, a, b) => {
      const m = mk(a, b);
      k.line([[52, 128], [196, 128], [196, 222], [52, 222], [52, 128]], m(0), m(0.2), { w: 2.6 });
      k.line([[52, 128], [76, 106], [220, 106], [196, 128]], m(0.18), m(0.3), { w: 2.6 });
      k.line([[220, 106], [220, 200], [196, 222]], m(0.28), m(0.36), { w: 2.6 });
      // printed front: a fish and a snowflake
      k.line(k.ellipse(116, 176, 34, 15), m(0.36), m(0.48), { w: 2.2 });
      k.line([[148, 176], [170, 162], [170, 190], [148, 176]], m(0.46), m(0.54), { w: 2.2 });
      k.dot(96, 172, 2.4, m(0.54));
      [[0, 9], [8, 4.5], [8, -4.5]].forEach(([dx, dy], i) => k.line([[80 - dx, 146 - dy], [80 + dx, 146 + dy]], m(0.55 + i * 0.02), m(0.58 + i * 0.02), { w: 1.8 }));
      // the end flap is open: the inside face is plain and darker
      const flap = [[220, 106], [262, 122], [262, 212], [220, 200], [220, 106]];
      k.line(flap, m(0.64), m(0.8), { w: 2.6 });
      k.hatch(flap, m(0.8), m(1), { density: 1.5 });
    };
    const perfume = (k, a, b) => {
      const m = mk(a, b);
      k.line(k.rect(48, 150, 96, 82, 3), m(0), m(0.18), { w: 2.6 });
      const lid = [[38, 124], [146, 104], [151, 128], [43, 148], [38, 124]];
      k.line(lid, m(0.18), m(0.34), { w: 2.6 });
      // printed pattern on the outside and on the inside of the lid
      [[70, 176], [120, 176], [95, 200], [70, 220], [120, 220]].forEach(([x, y], i) => {
        const t = m(0.34 + i * 0.03);
        k.line([[x - 7, y], [x + 7, y]], t, t + 0.02, { w: 1.6 }); k.line([[x, y - 7], [x, y + 7]], t + 0.01, t + 0.03, { w: 1.6 });
      });
      [[66, 132], [94, 127], [122, 122]].forEach(([x, y], i) => k.circle(x, y, 5, m(0.5 + i * 0.02), m(0.53 + i * 0.02), { w: 1.6 }));
      // the bottle
      k.line(k.rect(186, 152, 60, 80, 10), m(0.58), m(0.74), { w: 2.6 });
      k.line(k.rect(205, 134, 22, 18, 2), m(0.72), m(0.8), { w: 2.4 });
      const cap = k.rect(199, 108, 34, 26, 4);
      k.line(cap, m(0.78), m(0.88), { w: 2.6 });
      k.hatch(cap, m(0.86), m(0.94), { density: 1.3 });
      k.line([[196, 188], [236, 188]], m(0.92), m(0.96), { w: 1.6 }); k.line([[196, 200], [236, 200]], m(0.94), m(1), { w: 1.6 });
    };
    const tray = (k, a, b) => {
      const m = mk(a, b);
      k.line([[48, 172], [252, 172]], m(0), m(0.1), { w: 2.8 });
      k.line([[58, 172], [78, 230], [222, 230], [242, 172]], m(0.08), m(0.28), { w: 2.6 });
      k.line(k.curve([70, 190], [110, 198], [190, 184], [232, 192]), m(0.26), m(0.36), { w: 1.8 });
      // the lid: flat on the right, peeled up on the left
      k.line([[252, 165], [150, 165]], m(0.36), m(0.46), { w: 2.8 });
      const up = k.curve([150, 165], [116, 164], [84, 138], [72, 100]), un = k.curve([150, 171], [112, 170], [78, 142], [64, 102]);
      k.line(up, m(0.46), m(0.58), { w: 2.8 }); k.line(un, m(0.56), m(0.68), { w: 2.2 });
      k.line([[72, 100], [64, 102]], m(0.66), m(0.7), { w: 2.2 });
      // glints on the underside of the lid
      [[88, 150, 0], [104, 162, 1], [78, 128, 2]].forEach(([x, y, i]) => { const t = m(0.7 + i * 0.03); k.line([[x - 7, y + 6], [x + 5, y - 6]], t, t + 0.03, { w: 1.4, color: RED }); });
      steam(k, 112, 158, m(0.82), m(0.9)); steam(k, 136, 150, m(0.88), m(0.96)); steam(k, 160, 156, m(0.92), m(1));
    };
    const model = (k, a, b) => {
      const m = mk(a, b);
      k.line([[30, 214], [196, 214], [262, 190]], m(0), m(0.1), { w: 1.8 });
      k.line([[56, 150], [56, 212], [166, 212], [166, 150]], m(0.08), m(0.24), { w: 2.6 });
      k.line([[56, 150], [111, 104], [166, 150], [56, 150]], m(0.22), m(0.36), { w: 2.6 });
      k.line([[166, 212], [226, 192], [226, 134], [166, 150]], m(0.34), m(0.48), { w: 2.6 });
      k.line([[111, 104], [171, 90], [226, 134]], m(0.46), m(0.56), { w: 2.6 });
      k.line(k.rect(98, 172, 26, 40, 2), m(0.56), m(0.64), { w: 2 });
      k.line(k.rect(66, 164, 22, 22, 2), m(0.62), m(0.68), { w: 2 });
      k.line([[182, 160], [208, 153], [208, 180], [182, 187], [182, 160]], m(0.66), m(0.74), { w: 2 });
      // craft knife
      k.line([[190, 234], [244, 222]], m(0.76), m(0.86), { w: 7 });
      k.line([[244, 218], [270, 212], [258, 224], [244, 226]], m(0.86), m(0.94), { w: 2 });
    };
    const render = (k, a, b) => {
      const m = mk(a, b);
      k.line([[34, 100], [226, 96], [230, 222], [38, 226], [34, 100]], m(0), m(0.2), { w: 2.4 });
      const body = [[58, 186], [60, 166]].concat(k.curve([60, 166], [84, 160], [92, 134], [124, 132]), k.curve([124, 132], [158, 130], [168, 158], [204, 164]), [[208, 186], [58, 186]]);
      k.line(body, m(0.2), m(0.46), { w: 3 });
      k.circle(92, 188, 14, m(0.44), m(0.52), { w: 3 }); k.circle(174, 188, 14, m(0.5), m(0.58), { w: 3 });
      k.line([[104, 160], [112, 140], [150, 140], [164, 160], [104, 160]], m(0.56), m(0.66), { w: 2 });
      k.hatch(body, m(0.66), m(0.84), { density: 1.5, color: RED });
      // the marker pen
      k.line([[262, 100], [228, 170]], m(0.84), m(0.94), { w: 11 });
      k.line([[228, 170], [221, 184]], m(0.92), m(1), { w: 4, color: RED });
    };
    const layout = (k, a, b) => {
      const m = mk(a, b);
      k.line([[30, 112], [206, 106], [210, 230], [34, 234], [30, 112]], m(0), m(0.16), { w: 2 });
      k.line([[66, 94], [266, 92], [268, 222], [68, 226], [66, 94]], m(0.14), m(0.32), { w: 2.4 });
      // the idea on the sheet underneath, showing faintly through
      const fa = { w: 1.1 };
      k.line(k.rect(96, 136, 54, 60, 6), m(0.32), m(0.44), fa);
      k.line(k.curve([150, 150], [172, 150], [172, 182], [150, 182]), m(0.42), m(0.48), fa);
      // the new idea on top
      k.line([[120, 124], [200, 124], [190, 204], [130, 204], [120, 124]], m(0.5), m(0.7), { w: 3 });
      k.line(k.curve([199, 136], [236, 134], [230, 186], [192, 190]), m(0.68), m(0.8), { w: 3 });
      k.line(k.curve([122, 140], [146, 148], [174, 148], [198, 140]), m(0.78), m(0.86), { w: 2 });
      k.text('3', 250, 120, m(0.86), m(0.92), { size: 22, color: RED, align: 'center' });
      k.text('2', 46, 138, m(0.92), m(1), { size: 22, color: RED, align: 'center' });
    };
    const grid = (k, a, b) => {
      const m = mk(a, b), c = k.ctx;
      const sheet = [[36, 94], [264, 92], [266, 232], [38, 234], [36, 94]];
      k.line(sheet, m(0), m(0.16), { w: 2.4 });
      c.save(); c.beginPath(); c.rect(40, 97, 222, 132); c.clip(); c.globalAlpha = 0.45;
      const s = 0.577;
      for (let i = 0; i < 9; i++) {
        const y0 = 40 + i * 28, t = m(0.16 + i * 0.03);
        k.line([[36, y0 + 132], [266, y0 + 132 - 230 * s]], t, t + 0.04, { w: 0.8 });
        k.line([[36, y0 - 20], [266, y0 - 20 + 230 * s]], t + 0.02, t + 0.06, { w: 0.8 });
      }
      for (let i = 0; i < 10; i++) { const x = 53.6 + i * 24.25, t = m(0.44 + i * 0.015); k.line([[x, 94], [x, 234]], t, t + 0.03, { w: 0.8 }); }
      c.restore();
      // a box drawn along the printed lines
      const X = 150, Y = 204, w = 56, d = 44, h = 50;
      const A = [X, Y], B = [X + w, Y - w * s], C = [X - d, Y - d * s], up = (p) => [p[0], p[1] - h];
      const D = [B[0] - d, B[1] - d * s];
      k.line([C, A, B], m(0.62), m(0.72), { w: 3 });
      k.line([C, up(C), up(A), A], m(0.7), m(0.8), { w: 3 });
      k.line([up(A), up(B), B], m(0.78), m(0.88), { w: 3 });
      k.line([up(C), up(D), up(B)], m(0.86), m(0.96), { w: 3 });
      k.hatch([A, B, up(B), up(A)], m(0.94), m(1), { density: 1.2 });
    };

    // ---- one case = card + two questions side by side ----
    const cols = {};
    const file = (n, key, title, clues, product, type, why) => {
      const row = ui.el('div', 'row p09-row');
      row.appendChild(caseFile(n, title, clues, product));
      const col = (cols[key] = ui.el('div', 'p09-qs', '', row));
      col.appendChild(mcq(Object.assign({ id: `p09.${key}-type`, q: '<b>Which paper or board</b> is it?' }, type)));
      col.appendChild(mcq(Object.assign({ id: `p09.${key}-why` }, why)));
    };
    const css = document.createElement('style');
    css.textContent = `.p09-row{gap:16px;margin-bottom:var(--R)}.p09-row>.p09-case{flex:0 0 250px;margin:0;position:sticky;top:8px}.p09-row>.p09-qs{flex:1 1 330px;min-width:0}.p09-qs .act{margin-bottom:calc(var(--R)*.8)}
      .p09-qs .opts{grid-template-columns:repeat(auto-fit,minmax(200px,1fr))}
      @media (max-width:760px){.p09-row>.p09-case{flex:0 0 100%;max-width:280px;position:static}}`;
    root.appendChild(css);

    file(1, 'pizza', 'pizza delivery box', ['Look at the cut edge:', 'a wavy layer between', 'two flat sheets.'], pizza,
      { label: 'Pizza box: which board', options: [
        { t: 'Corrugated card', ok: true, why: 'Yes: the wavy layer is the fluted layer, and the flat sheets are the liners.' },
        { t: 'Foam core board', mis: 'board-mixup', why: 'Foam core has polystyrene foam in the middle, not a wavy layer of card.' },
        { t: 'Duplex board', mis: 'board-mixup', why: 'Duplex board is two flat layers: white on one side, grey on the other. It has no wavy layer.' },
        { t: 'Foil lined board', mis: 'board-mixup', why: 'Foil lined board has a thin layer of aluminium foil on it. There is no metal layer in this edge.' },
      ] },
      { label: 'Pizza box: why this board', q: '<b>Why</b> is it a good choice for delivering a hot pizza?', options: [
        { t: 'The fluted layer makes it stiff, light and insulating', ok: true, why: 'Yes: it is strong and stiff for its weight, it insulates, it absorbs knocks, and it is cheap and recyclable.' },
        { t: 'The fluted layer makes it waterproof and airtight', mis: 'corrugated-structure', why: 'The flutes are only card: they do not make a barrier. They make the board stiff, light and insulating.' },
        { t: 'The fluted layer gives a perfect surface for print', mis: 'corrugated-structure', why: 'The flutes are hidden inside. Their job is to make the board stiff, light, insulating and good at absorbing impacts.' },
      ] });

    file(2, 'carton', 'frozen-food carton', ['Printed white outside.', 'Plain grey inside.', 'Millions are made.'], carton,
      { label: 'Frozen-food carton: which board', options: [
        { t: 'Duplex board', ok: true, why: 'Yes: two layers, with one side white and coated for printing and the other grey.' },
        { t: 'Solid white board', mis: 'duplex-vs-solid', why: 'Solid white board is white all the way through, so the inside would not be grey.' },
        { t: 'Corrugated card', mis: 'board-mixup', why: 'Corrugated card has a wavy fluted layer between two liners. This carton is thin, flat board.' },
        { t: 'Ink jet card', mis: 'board-mixup', why: 'Ink jet card is bright white card made for an ink-jet printer, for jobs like printing photographs.' },
      ] },
      { label: 'Frozen-food carton: why one side is grey', q: '<b>Why</b> is only <b>one</b> side white and coated?', options: [
        { t: 'Only the outside is printed, which keeps the cost down', ok: true, why: 'Yes: it has a good print surface on the side that shows, and it is tough and lightweight.' },
        { t: 'The grey side is a barrier that keeps the moisture out', mis: 'board-mixup', why: 'The grey side is just uncoated board. A barrier against moisture needs a laminated layer such as foil.' },
        { t: 'The grey side is a foam layer that keeps the food cold', mis: 'board-mixup', why: 'There is no foam here: that is foam core board. The grey side is simply the cheaper, uncoated layer.' },
      ] });

    file(3, 'perfume', 'perfume gift box', ['A premium product.', 'White right through,', 'printed inside and out.'], perfume,
      { label: 'Perfume box: which board', options: [
        { t: 'Solid white board', ok: true, why: 'Yes: top-quality bleached board that is white all the way through.' },
        { t: 'Duplex board', mis: 'duplex-vs-solid', why: 'Duplex board is white on one side only: the other side is grey or brown.' },
        { t: 'Foam core board', mis: 'board-mixup', why: 'Foam core has polystyrene foam in the middle. It is used for models and mounting, not folded gift boxes.' },
        { t: 'Foil lined board', mis: 'board-mixup', why: 'Foil lined board has a layer of aluminium foil, used for jobs like takeaway lids.' },
      ] },
      { label: 'Perfume box: why this board', q: '<b>What</b> makes it right for premium packaging?', options: [
        { t: 'An excellent print surface on both of its sides', ok: true, why: 'Yes: it is strong, stiff and smooth, and it prints beautifully on both sides.' },
        { t: 'A good print surface on one side, and a low cost', mis: 'duplex-vs-solid', why: 'That describes duplex board. This box is printed inside as well as outside.' },
        { t: 'A foam centre that cushions the bottle inside it', mis: 'board-mixup', why: 'That would be foam core board. This board is the same bleached white material all the way through.' },
      ] });

    file(4, 'tray', 'takeaway tray lid', ['Lid of a hot curry.', 'Card on top, shiny', 'metal underneath.'], tray,
      { label: 'Takeaway lid: which board', options: [
        { t: 'Foil lined board', ok: true, why: 'Yes: board laminated with a thin layer of aluminium foil.' },
        { t: 'Solid white board', mis: 'board-mixup', why: 'Solid white board is white all the way through. It has no metal layer.' },
        { t: 'Corrugated card', mis: 'board-mixup', why: 'Corrugated card has a wavy fluted layer between two liners. It has no metal layer.' },
        { t: 'Duplex board', mis: 'board-mixup', why: 'Duplex board has a white side and a grey side. It has no metal layer.' },
      ] },
      { label: 'Takeaway lid: what the shiny layer does', q: '<b>What</b> is the shiny layer for?', options: [
        { t: 'It reflects heat back and keeps moisture out', ok: true, why: 'Yes: the foil reflects heat, so the food stays hot, and it is a barrier against moisture and oxygen.' },
        { t: 'It makes the lid stiff enough to be stacked', mis: 'foil-purpose', why: 'The foil is very thin: the board gives the stiffness. The foil reflects heat and is a barrier against moisture.' },
        { t: 'It gives a bright surface to print a logo on', mis: 'foil-purpose', why: 'The foil faces the food, where nobody sees it. It reflects heat and is a barrier against moisture.' },
      ] });

    file(5, 'model', "architect's model", ['Walls cut with a craft', 'knife. Rigid, but it', 'weighs almost nothing.'], model,
      { label: "Architect's model: which board", options: [
        { t: 'Foam core board', ok: true, why: 'Yes: very lightweight, rigid, smooth and easy to cut with a craft knife.' },
        { t: 'Corrugated card', mis: 'board-mixup', why: 'Corrugated card is light and stiff, but it is made for boxes and protective packaging, not smooth models.' },
        { t: 'Solid white board', mis: 'board-mixup', why: 'Solid white board is smooth and stiff, but it is used for premium packaging and book covers.' },
        { t: 'Ink jet card', mis: 'board-mixup', why: 'Ink jet card is coated for printing sharp images on an ink-jet printer.' },
      ] },
      { label: "Architect's model: what is inside the board", q: '<b>What</b> is in the middle of this board?', options: [
        { t: 'Polystyrene foam between two sheets of card', ok: true, why: 'Yes: that sandwich makes it rigid and very light. Its weakness is that it dents easily.' },
        { t: 'A wavy fluted layer between two flat liners', mis: 'board-mixup', why: 'That is corrugated card. This board has a foam centre.' },
        { t: 'A thin sheet of aluminium foil under the card', mis: 'board-mixup', why: 'That is foil lined board. This board has a foam centre.' },
      ] });

    file(6, 'render', 'marker rendering', ['Rich marker colour.', 'Crisp edges. Nothing', 'soaked through.'], render,
      { label: 'Marker rendering: which paper', options: [
        { t: 'Bleed proof paper', ok: true, why: 'Yes: smooth, hard paper with a special coating, made for marker rendering.' },
        { t: 'Cartridge paper', mis: 'bleed-meaning', why: 'Cartridge paper has a textured surface for pencil, pastel and paint. It is not coated to hold marker ink.' },
        { t: 'Layout paper', mis: 'bleed-meaning', why: 'Layout paper is thin paper for quick idea sketches. It is not coated to hold marker ink on the surface.' },
        { t: 'Tracing paper', mis: 'paper-mixup', why: 'Tracing paper is see-through paper for copying drawings, not for a final rendering.' },
      ] },
      { label: 'Marker rendering: what "bleed" means', q: '<b>What</b> does ink do when it "bleeds"?', options: [
        { t: 'It spreads out sideways and soaks through', ok: true, why: 'Yes. The coating on this paper keeps the ink on the surface, so edges stay crisp.' },
        { t: 'It fades to a paler colour while it dries', mis: 'bleed-meaning', why: 'Bleeding is not fading. It is ink spreading out and soaking through the paper.' },
        { t: 'It smudges when your hand rubs across it', mis: 'bleed-meaning', why: 'Bleeding is not smudging. It is ink spreading out and soaking through the paper.' },
      ] });

    file(7, 'ideas', "designer's idea pad", ['Idea 3 is drawn over', 'idea 2, which shows', 'faintly. A cheap pad.'], layout,
      { label: 'Idea pad: which paper', options: [
        { t: 'Layout paper', ok: true, why: 'Yes: thin, lightweight, smooth and cheap, for sketching and developing ideas.' },
        { t: 'Tracing paper', mis: 'layout-vs-tracing', why: 'Tracing paper is hard, strong and transparent, for copying drawings. The thin, cheap pad for developing ideas is different.' },
        { t: 'Cartridge paper', mis: 'paper-mixup', why: 'Cartridge paper is thick and opaque: the drawing underneath would not show.' },
        { t: 'Grid paper', mis: 'paper-mixup', why: 'Grid paper is printed with a faint grid of lines. This pad is plain.' },
      ] },
      { label: 'Idea pad: translucent / transparent / opaque', q: '<b>Which word</b> best describes this paper?', options: [
        { t: 'Translucent: a drawing shows through it', ok: true, why: 'Yes: you can see the last idea through it, so you can trace over it and improve the design.' },
        { t: 'Transparent: it is clear and see-through', mis: 'layout-vs-tracing', why: 'Transparent is the word for tracing paper. This paper only lets a drawing show through.' },
        { t: 'Opaque: no drawing can show through it', mis: 'paper-mixup', why: 'Opaque describes cartridge paper. Here the drawing underneath does show through.' },
      ] });

    file(8, 'grid', '3D working sketch', ['A neat 3D sketch.', 'Faint printed lines', 'guide every edge.'], grid,
      { label: '3D sketch: which paper', options: [
        { t: 'Grid paper', ok: true, why: 'Yes: it is printed with a faint grid of squares or isometric lines as a guide.' },
        { t: 'Cartridge paper', mis: 'paper-mixup', why: 'Cartridge paper is plain, with a slightly textured surface. It has no printed lines.' },
        { t: 'Layout paper', mis: 'paper-mixup', why: 'Layout paper is plain, thin and translucent. It has no printed lines.' },
        { t: 'Bleed proof paper', mis: 'paper-mixup', why: 'Bleed proof paper is plain, coated paper for markers. It has no printed lines.' },
      ] },
      { label: '3D sketch: jobs for this paper', q: '<b>Which jobs</b> is this paper best for?', options: [
        { t: 'Scale drawings, nets, graphs and isometric sketches', ok: true, why: 'Yes: the printed lines help you draw accurately and to scale.' },
        { t: 'Marker renderings and final presentation drawings', mis: 'paper-mixup', why: 'Those are jobs for bleed proof paper. Printed lines would spoil a final rendering.' },
        { t: 'Painting, pastel drawing and soft pencil shading', mis: 'paper-mixup', why: 'Those are jobs for cartridge paper, which has a textured surface that grips them.' },
      ] });

    // ---- case closed: an exam-style written explanation ----
    ui.el('h2', '', 'Case closed: write it up');
    ui.p('A good detective explains the evidence. Think about <b>which sides get printed</b> and about <b>cost</b>. <span class="small">(Cases 2 and 3 will blur while you write.)</span>');
    const w = ui.write({ id: 'p09.explain', label: 'Explain why a cereal box is duplex board, not solid white board [2]', marks: 2, lines: 4,
      q: '<b>Explain</b> why a cereal box is made from <b>duplex board</b> rather than <b>solid white board</b>.',
      scheme: ['A cereal box is only printed on the outside, and duplex board has one white, coated side for printing (the grey inside is not seen)', 'Duplex board is cheaper than solid white board (whose white, printable second side is not needed)'],
      model: 'A cereal box is only printed on the <b>outside</b>. Duplex board has one side that is white and coated for printing, and the grey side is hidden inside the box. It is <b>cheaper</b> than solid white board, which is white all the way through and prints well on both sides: quality that a cereal box does not need.' });
    // recall, not copy: the feedback of cases 2 and 3 is blurred while this is being written, until it has been checked
    const checked = () => { const it = Book.state.items['p09.explain']; return !!(it && it.ticks); };
    const lock = (on) => [cols.carton, cols.perfume].forEach((c) => c.classList.toggle('peek-lock', on));
    w.querySelector('textarea').addEventListener('focus', () => { if (!checked()) lock(true); });
    w.addEventListener('click', () => setTimeout(() => { if (checked()) lock(false); }, 50));
  },
});
