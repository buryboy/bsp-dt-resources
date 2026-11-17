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
        k.text('fibres', 286, 80, 1.3, 1.6, { size: 26, align: 'center' });
        k.text('+', 350, 80, 1.6, 1.7, { size: 26, align: 'center' });
        k.text('blends', 416, 80, 1.7, 2.0, { size: 26, align: 'center' });
        k.text('+', 482, 80, 2.0, 2.1, { size: 26, align: 'center' });
        k.text('fabrics', 552, 80, 2.1, 2.5, { size: 26, align: 'center' });
        k.text('= 10 Qs', 722, 80, 2.5, 3.0, { size: 26, align: 'center' });
        k.text('admit one (brain) to the next lesson', 516, 124, 3.0, 3.8, { size: 22, color: RED, align: 'center' });
      },
      sound(k) { k.play('stroke', 0, { material: 'pen', dur: 1, gain: 0.4 }); k.play('stroke', 1.0, { material: 'pen', dur: 2.8, gain: 0.35 }); k.play('stamp', 3.9, { gain: 0.3 }); },
    });

    // options are shuffled per question id here (so the right answer is not always in the same place)
    const hash = (s) => { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h % 100000; };
    const Q = (n, label, q, options) => { const id = 'p11.q' + String(n).padStart(2, '0'); return ui.mcq({ id, label: `Q${n}: ${label}`, q: `<b style="font-family:Fredoka">${n}.</b> ${q}`, shuffle: false, options: Book.shuffle(options, hash(id) + 17) }); };

    ui.el('h2', '', 'Fibres');
    Q(1, 'order: fibre, yarn, fabric', 'Which shows the correct order for making a woven shirt?', [
      { t: 'Fibre → yarn → fabric', ok: true, why: 'Fibres are spun (twisted together) into a yarn, then yarns are woven or knitted into a fabric.' },
      { t: 'Yarn → fibre → fabric', mis: 'fibre-yarn-fabric', why: 'A fibre is the very fine, hair-like strand you start with. Fibres are spun into a yarn, not the other way round.' },
      { t: 'Fibre → fabric → yarn', mis: 'fibre-yarn-fabric', why: 'The yarn comes before the fabric: fibres are spun into a yarn, then yarns are woven into a fabric.' },
      { t: 'Fabric → yarn → fibre', mis: 'fibre-yarn-fabric', why: 'That is backwards. The fibre comes first, then the yarn, then the fabric.' },
    ]);
    Q(2, 'pick the two plant fibres', 'Which pair are both <b>plant</b> (cellulose) fibres?', [
      { t: 'Cotton and linen', ok: true, why: 'Cotton comes from the seed pod of the cotton plant and linen from the stem of the flax plant.' },
      { t: 'Wool and silk', mis: 'plant-animal', why: 'Those are the two ANIMAL (protein) fibres: wool from sheep and silk from the silkworm.' },
      { t: 'Cotton and wool', mis: 'plant-animal', why: 'Cotton is a plant fibre, but wool is an animal fibre from the fleece of sheep.' },
      { t: 'Linen and silk', mis: 'plant-animal', why: 'Linen is a plant fibre, but silk is an animal fibre from the cocoon of the silkworm.' },
    ]);
    Q(3, 'why wool suits a winter coat', 'Why is <b>wool</b> a good choice for a winter coat?', [
      { t: 'Its fibres trap air, so it insulates well', ok: true, why: 'Wool is warm because its fibres trap air, which makes it a good insulator.' },
      { t: 'It is cool and crisp against the skin', mis: 'cotton-wool', why: 'Cool and crisp describes linen (and cotton is cool too). Wool is the warm one: its fibres trap air.' },
      { t: 'It dries fast and has low absorbency', mis: 'natural-synthetic', why: 'That describes synthetic fibres. Wool is absorbent and slow to dry, but warm because its fibres trap air.' },
      { t: 'It is smooth and shiny, and drapes well', mis: 'natural-mixup', why: 'That describes silk. Wool is warm because its fibres trap air.' },
    ]);
    Q(4, 'polyester ironed too hot', 'You iron a <b>polyester</b> shirt far too hot. What is likely to happen?', [
      { t: 'It melts, because it is thermoplastic', ok: true, why: 'Most synthetic fibres are thermoplastic: they can be heat-set, but they can melt if ironed too hot.' },
      { t: 'It felts, because the fibres mat up', mis: 'natural-synthetic', why: 'Felting is what wool does in a hot wash. Polyester is a thermoplastic synthetic fibre: it can melt.' },
      { t: 'Nothing, because heat cannot harm it', mis: 'synthetic-melt', why: 'Most synthetic fibres are thermoplastic, so they can melt if ironed too hot.' },
      { t: 'It rots, because it is biodegradable', mis: 'synthetic-melt', why: 'Most synthetic fibres are NOT biodegradable, and heat does not rot them: it can melt them.' },
    ]);
    Q(5, 'how elastane is used in leggings', 'How is <b>elastane</b> used in a pair of leggings?', [
      { t: 'A small amount is added to other fibres', ok: true, why: 'Elastane is added in small amounts (around 2–20%) to other fibres to give stretch.' },
      { t: 'It is used alone, as 100% of the fabric', mis: 'elastane-alone', why: 'Elastane is not used on its own. A small amount (around 2–20%) is added to other fibres.' },
      { t: 'It is sprayed on afterwards as a finish', mis: 'elastane-alone', why: 'Elastane is a fibre, not a finish. A small amount is added to the other fibres.' },
      { t: 'It replaces the cotton in the cheap ones', mis: 'elastane-alone', why: 'Elastane does not replace the main fibre. A small amount is added to it to give stretch.' },
    ]);

    ui.el('h2', '', 'Blends');
    Q(6, 'what a blend is', 'What is a <b>blend</b>?', [
      { t: 'Different fibres mixed before spinning into one yarn', ok: true, why: 'A blend is two or more different fibres mixed together before spinning into one yarn.' },
      { t: 'Different yarns that are used together in one fabric', mis: 'blend-meaning', why: 'That is a MIXTURE (e.g. a cotton warp and a polyester weft). In a blend the fibres are mixed before spinning.' },
      { t: 'A cheaper fibre used to replace an expensive one', mis: 'blend-meaning', why: 'Blending can reduce cost, but a blend means different fibres mixed together before spinning into one yarn.' },
      { t: 'A finish added to a fabric to improve how it looks', mis: 'blend-meaning', why: 'A finish is added to a fabric afterwards. A blend is different fibres mixed before spinning into one yarn.' },
    ]);
    Q(7, 'polycotton compared with pure cotton', 'Compared with a pure cotton shirt, a <b>polycotton</b> shirt…', [
      { t: 'creases less and dries faster', ok: true, why: 'Polycotton is comfortable and absorbent like cotton, but stronger, creases less, dries faster and is cheaper.' },
      { t: 'creases more and dries slower', mis: 'polycotton-props', why: 'It is the other way round: the polyester makes the shirt crease less and dry faster.' },
      { t: 'costs more and is much weaker', mis: 'polycotton-props', why: 'Polycotton is stronger and cheaper than pure cotton.' },
      { t: 'stretches more and feels warmer', mis: 'polycotton-props', why: 'Stretch comes from elastane and warmth from wool. Polyester makes the shirt crease less and dry faster.' },
    ]);

    ui.el('h2', '', 'Fabric construction');
    Q(8, 'which yarns are the warp', 'In a woven fabric, which yarns are the <b>warp</b>?', [
      { t: 'The yarns that run lengthways along the fabric', ok: true, why: 'Warp yarns run lengthways and are held on the loom. Weft yarns run across, from side to side.' },
      { t: 'The yarns that run across, from side to side', mis: 'warp-weft', why: 'Those are the WEFT yarns. The warp yarns run lengthways.' },
      { t: 'The yarns that run at 45° to the two edges', mis: 'warp-weft', why: '45° is the bias: no yarns run that way. The warp yarns run lengthways.' },
      { t: 'The firm yarns at the edge that do not fray', mis: 'selvedge', why: 'That is the selvedge. The warp yarns run lengthways, all the way across the fabric width.' },
    ]);
    Q(9, 'weft floats over four or more: which weave', 'In one weave the weft <b>floats over four or more</b> warp yarns. Which weave is it, and what is the fabric like?', [
      { t: 'Satin: smooth and shiny, but it can snag', ok: true, why: 'The long floats give satin its smooth, shiny surface, but they can snag and are less hard-wearing.' },
      { t: 'Twill: smooth and shiny, but it can snag', mis: 'weave-type', why: 'The description is right but the name is wrong: twill goes over two, under one and shows diagonal lines.' },
      { t: 'Twill: diagonal lines, strong, hides dirt', mis: 'weave-type', why: 'Twill goes over two (or more), under one, stepping along each row. Floats over four or more make satin.' },
      { t: 'Plain: firm and strong, same both sides', mis: 'weave-type', why: 'A plain weave goes over one, under one. Floats over four or more make satin.' },
    ]);
    Q(10, 'which fabric ladders', 'One stitch breaks and a <b>ladder</b> runs down the fabric. Which fabric is it?', [
      { t: 'A weft knit', ok: true, why: 'A weft knit is one continuous yarn looped in rows, so it ladders and unravels if a stitch breaks.' },
      { t: 'A warp knit', mis: 'knit-type', why: 'A warp knit has many yarns looping vertically. It does not ladder or unravel.' },
      { t: 'A twill weave', mis: 'woven-vs-knit', why: 'Woven fabrics fray at cut edges, but they do not ladder: they have no loops.' },
      { t: 'A bonded web', mis: 'nonwoven', why: 'A bonded fabric is a web of fibres with no yarn and no loops, so it cannot ladder.' },
    ]);

    ui.el('h2', '', 'How do you feel?');
    ui.rate({ id: 'p11.conf-fibres', label: 'Confidence: fibres', q: 'How confident are you with <b>fibres</b> (natural: cotton, linen, wool, silk; synthetic: polyester, polyamide, elastane; their properties and uses)?' });
    ui.rate({ id: 'p11.conf-blends', label: 'Confidence: blends', q: 'How confident are you with <b>blends and mixtures</b> (what they are, why fibres are blended, polycotton)?' });
    ui.rate({ id: 'p11.conf-construction', label: 'Confidence: fabric construction', q: 'How confident are you with <b>fabric construction</b> (plain, twill and satin weaves; warp, weft and selvedge; weft and warp knits; felt and bonded fabrics)?' });
    ui.write({ id: 'p11.unsure', label: 'Still not sure about…', marks: 0, lines: 2,
      q: "What's one thing about fibres, blends or fabrics you're still not sure about?",
      scheme: ['Any honest answer'] });
  },
});
