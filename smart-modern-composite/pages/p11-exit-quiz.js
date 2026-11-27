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
        k.text('modern + smart + composite', 420, 78, 1.3, 2.2, { size: 23, align: 'center' });
        k.text('+ textiles', 660, 78, 2.2, 2.6, { size: 23, align: 'center' });
        k.text('= 10', 764, 78, 2.6, 3.0, { size: 23, align: 'center' });
        k.text('admit one (brain) to the next lesson', 516, 124, 3.0, 3.8, { size: 22, color: RED, align: 'center' });
      },
      sound(k) { k.play('stroke', 0, { material: 'pen', dur: 1, gain: 0.4 }); k.play('stroke', 1.0, { material: 'pen', dur: 2.8, gain: 0.35 }); k.play('stamp', 3.9, { gain: 0.3 }); },
    });

    // options are shuffled per question id here (so the right answer is not always in the same place)
    const hash = (s) => { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h % 100000; };
    const Q = (n, label, q, options) => { const id = 'p11.q' + String(n).padStart(2, '0'); return ui.mcq({ id, label: `Q${n}: ${label}`, q: `<b style="font-family:Fredoka">${n}.</b> ${q}`, shuffle: false, options: Book.shuffle(options, hash(id) + 17) }); };

    ui.el('h2', '', 'Modern materials');
    Q(1, 'what graphene is', 'What is <b>graphene</b>?', [
      { t: 'A single layer of carbon atoms, one atom thick', ok: true, why: 'Graphene is one layer of carbon atoms arranged in a hexagonal (honeycomb) lattice.' },
      { t: 'A lightweight metal full of trapped gas bubbles', mis: 'modern-mixup', why: 'That is a metal foam. Graphene is a single layer of carbon atoms, one atom thick.' },
      { t: 'A thin sheet of metal that conducts electricity', mis: 'graphene-structure', why: 'Graphene conducts, but it is not a metal. It is a single layer of carbon atoms.' },
      { t: 'A strong plastic reinforced with carbon fibres', mis: 'graphene-structure', why: 'That is CFRP, a composite. Graphene is a single layer of carbon atoms.' },
    ]);
    Q(2, 'why aluminium foam is lightweight', 'Why is <b>aluminium foam</b> so lightweight?', [
      { t: 'It is full of gas-filled pores, so its density is low', ok: true, why: 'A metal foam has lots of gas bubbles (pores) trapped in it, so its density is low. Some even float on water.' },
      { t: 'It is only one atom thick, so it has very little mass', mis: 'modern-mixup', why: 'That is graphene. A metal foam is light because it is full of gas-filled pores.' },
      { t: 'Its aluminium is swapped for a much lighter plastic', mis: 'metal-foam', why: 'It is still metal. It is light because it is full of gas-filled pores.' },
      { t: 'It is rolled out into very thin sheets, like kitchen foil', mis: 'metal-foam', why: 'Foam is not foil. A metal foam is light because it is full of gas-filled pores.' },
    ]);
    Q(3, 'why titanium for a hip replacement', 'Why is <b>titanium</b> used for hip replacements?', [
      { t: 'It is biocompatible and resists corrosion', ok: true, why: 'Titanium is not rejected by the body (biocompatible) and has excellent corrosion resistance. It is also strong and lightweight.' },
      { t: 'It is cheap and very easy to process', mis: 'titanium-props', why: 'Titanium is expensive and hard to process. It is used because it is biocompatible, strong, light and resists corrosion.' },
      { t: 'It is heavy, so the joint stays in place', mis: 'titanium-props', why: 'Titanium is lightweight: about half the density of steel.' },
      { t: 'It crumples, so it absorbs any impacts', mis: 'modern-mixup', why: 'That is metal foam. Titanium is used because it is biocompatible, strong, light and resists corrosion.' },
    ]);

    ui.el('h2', '', 'Smart materials');
    Q(4, 'what makes a material smart', 'Which statement describes a <b>smart</b> material?', [
      { t: 'It changes with a stimulus, then changes back', ok: true, why: 'A smart material\'s properties change in response to a stimulus (such as temperature or light) and change back when it is removed.' },
      { t: 'It has a microchip and needs a battery to work', mis: 'smart-meaning', why: 'Smart does not mean electronic. Smart materials need no electrical control: they respond to their surroundings.' },
      { t: 'It was developed recently by a brand new process', mis: 'group-mixup', why: 'That describes a modern material. A smart material changes in response to a stimulus, then changes back.' },
      { t: 'It is two or more materials combined together', mis: 'group-mixup', why: 'That describes a composite. A smart material changes in response to a stimulus, then changes back.' },
    ]);
    Q(5, 'kettle that changes colour as it heats', 'A kettle <b>changes colour as it heats up</b>. Which answer names the pigment and its stimulus?', [
      { t: 'Thermochromic: it responds to temperature', ok: true, why: 'Thermochromic pigment changes colour with temperature, and changes back when it cools.' },
      { t: 'Photochromic: it responds to temperature', mis: 'stimulus-mixup', why: 'The stimulus is right, but the name is wrong. Photo = light. The pigment that responds to temperature is thermochromic.' },
      { t: 'Photochromic: it responds to bright light', mis: 'stimulus-mixup', why: 'Photochromic pigments do respond to light, but the kettle changes because it heats up: that is thermochromic.' },
      { t: 'Thermochromic: it responds to bright light', mis: 'stimulus-mixup', why: 'The name is right, but thermo = heat. Thermochromic pigment responds to temperature.' },
    ]);
    Q(6, 'what makes nitinol return to its shape', 'A <b>nitinol</b> wire is bent while it is cool. What makes it return to its remembered shape?', [
      { t: 'Heating it above its transition temperature', ok: true, why: 'A shape memory alloy returns to its original "remembered" shape when heated above its transition temperature.' },
      { t: 'Shining a bright ultraviolet light onto it', mis: 'stimulus-mixup', why: 'Light is the stimulus for photochromic pigments. A shape memory alloy responds to heat.' },
      { t: 'Cooling it far below room temperature', mis: 'sma-mixup', why: 'It can be bent when cool. It is heating that makes it return to its remembered shape.' },
      { t: 'Leaving it to rest for a day in the dark', mis: 'sma-mixup', why: 'It will not recover by resting. It must be heated above its transition temperature.' },
    ]);

    ui.el('h2', '', 'Composites');
    Q(7, 'plain concrete in compression and tension', 'Which statement about <b>plain concrete</b> (no steel inside) is true?', [
      { t: 'Strong in compression, weak in tension', ok: true, why: 'Concrete is very strong when squashed (compression) but weak when pulled (tension). Steel bars are added to carry the tension.' },
      { t: 'Strong in tension, weak in compression', mis: 'concrete-tension', why: 'It is the other way round: concrete is strong in compression and weak in tension.' },
      { t: 'Strong in compression and in tension', mis: 'concrete-tension', why: 'Concrete is weak in tension. That is why steel bars (rebar) are cast inside it.' },
      { t: 'Weak in compression and in tension', mis: 'concrete-tension', why: 'Concrete is very strong in compression. It is only weak in tension.' },
    ]);
    Q(8, 'composite vs alloy', 'How is a <b>composite</b> different from an <b>alloy</b>?', [
      { t: 'Its materials stay separate, not chemically mixed', ok: true, why: 'In a composite the materials stay separate (for example fibres held in resin). They are not chemically mixed like an alloy.' },
      { t: 'Its materials are melted and mixed into one', mis: 'composite-meaning', why: 'That is closer to an alloy. In a composite the materials stay separate.' },
      { t: 'It is always made from two different metals', mis: 'composite-meaning', why: 'Composites are usually a reinforcement in a matrix, such as glass fibres in resin. They need not contain metal.' },
      { t: 'It is one pure material with nothing added', mis: 'composite-meaning', why: 'A composite combines two or more different materials to improve the properties.' },
    ]);

    ui.el('h2', '', 'Technical textiles');
    Q(9, 'why Kevlar suits a bullet-proof vest', 'Which property makes <b>Kevlar</b> suitable for a bullet-proof vest?', [
      { t: 'Very high tensile strength for its weight', ok: true, why: 'Kevlar has very high tensile strength (about 5 times stronger than steel by weight) and is lightweight and puncture-resistant.' },
      { t: 'It lets electricity flow through the vest', mis: 'tech-textile-mixup', why: 'That is a conductive fabric. Kevlar is used for its very high tensile strength.' },
      { t: 'It slowly releases a substance when rubbed', mis: 'tech-textile-mixup', why: 'That is micro-encapsulation. Kevlar is used for its very high tensile strength.' },
      { t: 'It is very heavy, which stops the bullet', mis: 'kevlar-props', why: 'Kevlar is lightweight. It stops a bullet because of its very high tensile strength.' },
    ]);
    Q(10, 'how micro-capsules release their substance', 'How does a <b>micro-encapsulated</b> fabric release its scent?', [
      { t: 'The capsules burst slowly with wear and friction', ok: true, why: 'Tiny capsules on the fibres burst slowly with wear and friction, releasing the substance over time.' },
      { t: 'The capsules all melt together in the first wash', mis: 'microencap', why: 'They do not all go at once. The capsules burst slowly with wear and friction.' },
      { t: 'The capsules open when an electric current flows', mis: 'microencap', why: 'No electricity is needed. The capsules burst slowly with wear and friction.' },
      { t: 'The capsules refill themselves from the air around', mis: 'microencap', why: 'They do not refill. The capsules burst slowly with wear and friction until they are used up.' },
    ]);

    ui.el('h2', '', 'How do you feel?');
    ui.rate({ id: 'p11.conf-modern', label: 'Confidence: modern materials', q: 'How confident are you with <b>modern materials</b> (graphene, metal foams, titanium)?' });
    ui.rate({ id: 'p11.conf-smart', label: 'Confidence: smart materials', q: 'How confident are you with <b>smart materials</b> (shape memory alloys, thermochromic and photochromic pigments)?' });
    ui.rate({ id: 'p11.conf-composite', label: 'Confidence: composites', q: 'How confident are you with <b>composites</b> (matrix and reinforcement; concrete, GRP, CFRP)?' });
    ui.rate({ id: 'p11.conf-textiles', label: 'Confidence: technical textiles', q: 'How confident are you with <b>technical textiles</b> (conductive, fire resistant, Kevlar, micro-encapsulation)?' });
    ui.write({ id: 'p11.unsure', label: 'Still not sure about…', marks: 0, lines: 2,
      q: "What's one thing about smart, modern or composite materials you're still not sure about?",
      scheme: ['Any honest answer'] });
  },
});
