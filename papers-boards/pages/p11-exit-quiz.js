// Page 11 — Exit quiz: 10 multiple-choice questions across the whole lesson, confidence ratings and one open question.
Book.page({
  id: 'p11',
  title: 'Exit quiz',
  build(ui) {
    const RED = Ink.RED;
    ui.h('Exit quiz');
    ui.p('Ten quick questions on <b>everything</b> from today. Go with your first answer: your <b>first</b> tap is what counts. If you get one wrong, read why, then try again.');

    // a little pen-drawn exit ticket
    ui.anim({
      w: 860, h: 200, duration: 4, poster: 4,
      draw(k) {
        const T = [[40, 22], [820, 22], [820, 62], [806, 82], [820, 102], [820, 148], [40, 148], [40, 102], [54, 82], [40, 62], [40, 22]];
        k.shadow(T, 0.6, 1.0); k.line(T, 0, 0.8, { w: 2.8 });
        k.line([[214, 30], [214, 140]], 0.8, 1.0, { w: 1.6 });
        for (let y = 36; y < 140; y += 12) k.dot(214, y, 1.6, 0.9);
        k.text('EXIT', 127, 76, 1.0, 1.2, { size: 26, color: RED, align: 'center', font: 'bubble' }); k.text('TICKET', 127, 112, 1.2, 1.4, { size: 26, color: RED, align: 'center', font: 'bubble' });
        k.text('papers', 290, 80, 1.3, 1.6, { size: 26, align: 'center' });
        k.text('+', 356, 80, 1.6, 1.7, { size: 26, align: 'center' });
        k.text('boards', 420, 80, 1.7, 2.0, { size: 26, align: 'center' });
        k.text('+', 484, 80, 2.0, 2.1, { size: 26, align: 'center' });
        k.text('sizes', 548, 80, 2.1, 2.5, { size: 26, align: 'center' });
        k.text('= 10 Qs', 722, 80, 2.5, 3.0, { size: 26, align: 'center' });
        k.text('admit one (brain) to the next lesson', 516, 124, 3.0, 3.8, { size: 22, color: RED, align: 'center' });
      },
      sound(k) { k.play('stroke', 0, { material: 'pen', dur: 1, gain: 0.4 }); k.play('stroke', 1.0, { material: 'pen', dur: 2.8, gain: 0.35 }); k.play('stamp', 3.9, { gain: 0.3 }); },
    });

    // options are shuffled per question id here (so the right answer is not always in the same place)
    const hash = (s) => { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h % 100000; };
    const Q = (n, label, q, options) => { const id = 'p11.q' + String(n).padStart(2, '0'); return ui.mcq({ id, label: `Q${n}: ${label}`, q: `<b style="font-family:Fredoka">${n}.</b> ${q}`, shuffle: false, options: Book.shuffle(options, hash(id) + 17) }); };

    ui.el('h2', '', 'Where paper comes from');
    Q(1, 'where the fibres come from', 'Most paper is made from cellulose fibres. Where do they <b>mostly</b> come from?', [
      { t: 'Fast-growing softwood trees such as pine', ok: true, why: 'Paper is made from wood pulp, mainly from fast-growing softwood trees such as pine and spruce.' },
      { t: 'Slow-growing hardwood trees such as oak', mis: 'paper-source', why: 'Paper pulp comes mainly from fast-growing SOFTWOOD trees such as pine and spruce.' },
      { t: 'Crude oil that is pumped out of the ground', mis: 'paper-source', why: 'Paper is not made from oil. Its fibres come from wood pulp, mainly softwood trees.' },
      { t: 'Any green plants that are cut down on farms', mis: 'paper-source', why: 'The fibres come mostly from wood pulp: fast-growing softwood trees such as pine and spruce.' },
    ]);
    Q(2, 'why paper cannot be recycled forever', 'Paper can only be recycled about <b>5–7 times</b>. Why?', [
      { t: 'The fibres get shorter and weaker each time', ok: true, why: 'Every time paper is pulped again its fibres get shorter and weaker, so new fibres are often mixed in.' },
      { t: 'The fibres get longer and tangle up each time', mis: 'recycle-forever', why: 'It is the other way round: the fibres get SHORTER and weaker each time paper is pulped.' },
      { t: 'The old ink can no longer be washed out of it', mis: 'recycle-forever', why: 'De-inking is not the limit. The fibres get shorter and weaker each time paper is pulped.' },
      { t: 'The bleach in the paper wears off a bit more', mis: 'recycle-forever', why: 'Bleach is not the limit. The fibres get shorter and weaker each time paper is pulped.' },
    ]);

    ui.el('h2', '', 'Weight, thickness and size');
    Q(3, 'what 80 gsm means', 'A pack of paper is labelled <b>80 gsm</b>. What does that tell you?', [
      { t: 'A 1 m × 1 m sheet has a mass of 80 g', ok: true, why: 'gsm = grams per square metre: the mass of one sheet measuring 1 m × 1 m.' },
      { t: 'A single A4 sheet has a mass of 80 g', mis: 'gsm-meaning', why: 'gsm is grams per SQUARE METRE, not per sheet. An A4 sheet is only 1/16 of a square metre.' },
      { t: 'Each sheet is exactly 80 microns thick', mis: 'gsm-meaning', why: 'gsm is a weight, not a thickness: grams per square metre.' },
      { t: 'A full pack of it has a mass of 80 g', mis: 'gsm-meaning', why: 'gsm is grams per SQUARE METRE of paper, not the mass of the pack.' },
    ]);
    Q(4, '400 microns in mm', 'A sheet of board is <b>400 microns</b> thick. What is that in millimetres?', [
      { t: '0.4 mm', ok: true, why: '1000 microns = 1 mm, so 400 ÷ 1000 = 0.4 mm.' },
      { t: '4 mm', mis: 'micron-convert', why: 'That is dividing by 100. There are 1000 microns in 1 mm: 400 ÷ 1000 = 0.4 mm.' },
      { t: '0.04 mm', mis: 'micron-convert', why: 'That is dividing by 10 000. There are 1000 microns in 1 mm: 400 ÷ 1000 = 0.4 mm.' },
      { t: '40 mm', mis: 'micron-convert', why: 'That is dividing by 10. There are 1000 microns in 1 mm: 400 ÷ 1000 = 0.4 mm.' },
    ]);
    Q(5, 'A3 compared with A4', 'Which statement about <b>A sizes</b> is correct?', [
      { t: 'A3 has twice the area of A4', ok: true, why: 'Each size is half the one before, so A3 is two A4 sheets side by side.' },
      { t: 'A5 has twice the area of A4', mis: 'a-size', why: 'The bigger the number, the SMALLER the sheet: A5 is half of A4.' },
      { t: 'A4 has twice the area of A3', mis: 'a-size', why: 'The bigger the number, the SMALLER the sheet: A4 is half of A3.' },
      { t: 'A3 has four times the area of A4', mis: 'a-size', why: 'Each step is a halving, not a quartering: A3 is twice the area of A4.' },
    ]);

    ui.el('h2', '', 'Papers');
    Q(6, 'paper for developing ideas', 'Which paper is <b>thin, cheap and translucent</b>, and is used for <b>developing ideas</b>?', [
      { t: 'Layout paper', ok: true, why: 'Layout paper is thin, lightweight, cheap and translucent, so you can trace through to refine a design.' },
      { t: 'Tracing paper', mis: 'layout-vs-tracing', why: 'Tracing paper is transparent, hard and strong, for copying drawings. The thin, cheap, translucent one is layout paper.' },
      { t: 'Cartridge paper', mis: 'paper-mixup', why: 'Cartridge paper is thick and opaque. The thin, translucent one is layout paper.' },
      { t: 'Bleed proof paper', mis: 'paper-mixup', why: 'Bleed proof paper is coated for marker rendering. The thin, translucent one is layout paper.' },
    ]);
    Q(7, 'paper with a textured surface', 'Which paper has a <b>slightly textured</b> surface that grips pencil, pastel and watercolour?', [
      { t: 'Cartridge paper', ok: true, why: 'Cartridge paper is thick, good-quality and opaque, with a slightly textured surface for drawing and painting.' },
      { t: 'Bleed proof paper', mis: 'paper-mixup', why: 'Bleed proof paper is smooth and hard, with a coating for markers. The textured one is cartridge paper.' },
      { t: 'Tracing paper', mis: 'paper-mixup', why: 'Tracing paper is hard and smooth. The textured one is cartridge paper.' },
      { t: 'Layout paper', mis: 'paper-mixup', why: 'Layout paper is thin and smooth. The textured one is cartridge paper.' },
    ]);

    ui.el('h2', '', 'Boards');
    Q(8, 'structure of corrugated card', 'How is <b>corrugated card</b> made up?', [
      { t: 'A fluted layer glued between two flat liners', ok: true, why: 'The wavy fluted layer between two liners makes it strong and stiff for its weight, and good at absorbing impacts.' },
      { t: 'A foam layer glued between two sheets of card', mis: 'board-mixup', why: 'That is foam core board. Corrugated card has a wavy fluted layer between two flat liners.' },
      { t: 'A foil layer laminated on to a sheet of board', mis: 'board-mixup', why: 'That is foil lined board. Corrugated card has a wavy fluted layer between two flat liners.' },
      { t: 'A stack of flat sheets pressed into a solid slab', mis: 'corrugated-structure', why: 'It is not solid: a wavy fluted layer sits between two flat liners, which keeps it light.' },
    ]);
    Q(9, 'board that prints well on both sides', 'Which board is <b>white all the way through</b>, with an excellent print surface on <b>both</b> sides?', [
      { t: 'Solid white board', ok: true, why: 'Solid white board is top-quality bleached board, used for premium packaging and book covers.' },
      { t: 'Duplex board', mis: 'duplex-vs-solid', why: 'Duplex board is white and coated on ONE side only: the other side is grey or brown.' },
      { t: 'Ink jet card', mis: 'board-mixup', why: 'Ink jet card is coated so ink-jet ink dries on the surface. The premium board that is white throughout is solid white board.' },
      { t: 'Foam core board', mis: 'board-mixup', why: 'Foam core has polystyrene foam in the middle, so it is not the same all the way through.' },
    ]);
    Q(10, 'what the foil in a juice carton does', 'The board of a <b>juice carton</b> is lined with aluminium foil. What is the foil for?', [
      { t: 'It is a barrier against moisture and oxygen', ok: true, why: 'Foil is a barrier against moisture and oxygen, so the juice stays in and stays fresh.' },
      { t: 'It makes the carton much stiffer to hold', mis: 'foil-purpose', why: 'The foil is very thin: the board gives the stiffness. The foil is a barrier against moisture and oxygen.' },
      { t: 'It gives the printed design a shiny finish', mis: 'foil-purpose', why: 'The foil is on the inside. It is a barrier against moisture and oxygen.' },
      { t: 'It makes the carton far easier to recycle', mis: 'foil-purpose', why: 'The foil is not there for recycling. It is a barrier against moisture and oxygen.' },
    ]);

    ui.el('h2', '', 'How do you feel?');
    ui.rate({ id: 'p11.conf-papers', label: 'Confidence: papers', q: 'How confident are you with the <b>five papers</b> (layout, tracing, bleed proof, cartridge and grid) and what each is used for?' });
    ui.rate({ id: 'p11.conf-boards', label: 'Confidence: boards', q: 'How confident are you with the <b>six boards</b> (corrugated, duplex, foil lined, foam core, ink jet card and solid white) and what each is used for?' });
    ui.rate({ id: 'p11.conf-sizes', label: 'Confidence: gsm, microns and A sizes', q: 'How confident are you with <b>gsm, microns and A sizes</b>, including the calculations?' });
    ui.write({ id: 'p11.unsure', label: 'Still not sure about…', marks: 0, lines: 2,
      q: "What's one thing about papers, boards or paper sizes you're still not sure about?",
      scheme: ['Any honest answer'] });
  },
});
