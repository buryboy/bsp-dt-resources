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
        k.text('oil', 262, 80, 1.3, 1.5, { size: 26, align: 'center' });
        k.text('+', 304, 80, 1.5, 1.6, { size: 26, align: 'center' });
        k.text('2 families', 392, 80, 1.6, 2.0, { size: 26, align: 'center' });
        k.text('+', 482, 80, 2.0, 2.1, { size: 26, align: 'center' });
        k.text('11 polymers', 580, 80, 2.1, 2.5, { size: 26, align: 'center' });
        k.text('= 10 Qs', 740, 80, 2.5, 3.0, { size: 26, align: 'center' });
        k.text('admit one (brain) to the next lesson', 516, 124, 3.0, 3.8, { size: 22, color: RED, align: 'center' });
      },
      sound(k) { k.play('stroke', 0, { material: 'pen', dur: 1, gain: 0.4 }); k.play('stroke', 1.0, { material: 'pen', dur: 2.8, gain: 0.35 }); k.play('stamp', 3.9, { gain: 0.3 }); },
    });

    // options are shuffled per question id here (so the right answer is not always in the same place)
    const hash = (s) => { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h % 100000; };
    const Q = (n, label, q, options) => { const id = 'p11.q' + String(n).padStart(2, '0'); return ui.mcq({ id, label: `Q${n}: ${label}`, q: `<b style="font-family:Fredoka">${n}.</b> ${q}`, shuffle: false, options: Book.shuffle(options, hash(id) + 17) }); };

    ui.el('h2', '', 'From oil to polymer');
    Q(1, 'order of the stages from crude oil', 'Which is the correct <b>order</b> for turning crude oil into a polymer?', [
      { t: 'Fractional distillation → cracking → polymerisation', ok: true, why: 'Distillation separates the oil into fractions (one is naphtha), cracking breaks naphtha into monomers, polymerisation joins them into chains.' },
      { t: 'Cracking → fractional distillation → polymerisation', mis: 'polymer-source', why: 'The oil has to be separated into fractions first: it is the naphtha fraction that gets cracked.' },
      { t: 'Polymerisation → cracking → fractional distillation', mis: 'polymer-source', why: 'Polymerisation is the LAST step: it joins the monomers into long chains.' },
      { t: 'Fractional distillation → polymerisation → cracking', mis: 'polymer-source', why: 'Cracking comes before polymerisation: it makes the monomers that are then joined into chains.' },
    ]);
    Q(2, 'what a monomer is', 'What is a <b>monomer</b>?', [
      { t: 'A small molecule that joins with others to make a chain', ok: true, why: '"Mono" = one. Thousands of monomers (e.g. ethene) join to make a long chain: a polymer.' },
      { t: 'A long chain that is made from thousands of molecules', mis: 'monomer-polymer', why: 'That is a polymer ("poly" = many). A monomer is one of the small molecules it is built from.' },
      { t: 'A fraction of crude oil that is separated at a refinery', mis: 'polymer-source', why: 'That describes naphtha. Monomers are the small molecules made when naphtha is cracked.' },
      { t: 'An additive that is mixed in to give a polymer colour', mis: 'additive-mixup', why: 'That is a pigment. A monomer is one of the small molecules that join to make the polymer chain.' },
    ]);

    ui.el('h2', '', 'The two families');
    Q(3, 'what heating does to a thermoforming polymer', 'A <b>thermoforming</b> polymer is heated. What happens?', [
      { t: 'It softens and can be reshaped, again and again', ok: true, why: 'Thermoforming polymers soften when heated, harden when cooled, and this can be repeated.' },
      { t: 'It sets hard, and can never be softened again', mis: 'thermo-swap', why: 'That is a thermosetting polymer. Thermoforming polymers soften every time they are heated.' },
      { t: 'It stays rigid, then chars without going soft', mis: 'thermo-swap', why: 'That is what a thermosetting polymer does. Thermoforming polymers soften when heated.' },
      { t: 'It softens once only, then stays hard for good', mis: 'thermo-swap', why: 'It can be softened over and over: that is why thermoforming polymers can be recycled by melting.' },
    ]);
    Q(4, 'why a thermoset cannot be reshaped', 'Why can a <b>thermosetting</b> polymer <b>not</b> be reshaped by heating?', [
      { t: 'Strong cross-links lock its chains together', ok: true, why: 'When a thermoset sets, strong cross-links form between the chains, so heat cannot make them slide.' },
      { t: 'Its tangled chains have no cross-links at all', mis: 'crosslink', why: 'Chains with no cross-links CAN slide when heated: that is a thermoforming polymer.' },
      { t: 'Its chains slide past each other when it is hot', mis: 'thermo-swap', why: 'Sliding chains are what let a thermoforming polymer soften. In a thermoset the chains are locked.' },
      { t: 'Its monomers never joined up into long chains', mis: 'monomer-polymer', why: 'Every polymer is made of long chains of monomers. In a thermoset the chains are also cross-linked.' },
    ]);
    Q(5, 'which family can be recycled by melting', 'Which statement about <b>recycling by melting</b> is true?', [
      { t: 'Only thermoforming polymers can be recycled this way', ok: true, why: 'Thermoforming polymers can be sorted, shredded and melted into new products. Thermosets cannot be remelted.' },
      { t: 'Only thermosetting polymers can be recycled this way', mis: 'thermoset-recycle,thermo-swap', why: 'It is the other way round: thermosets cannot be softened by heating, so they cannot be remelted.' },
      { t: 'Both families of polymer can be recycled this way', mis: 'thermoset-recycle', why: 'Thermosets cannot be softened by heating, so they cannot be remelted (they may be ground up as filler).' },
      { t: 'Neither family of polymer can be recycled this way', mis: 'thermo-swap', why: 'Thermoforming polymers soften when heated, so they CAN be melted and made into new products.' },
    ]);

    ui.el('h2', '', 'The right polymer');
    Q(6, 'describe acrylic', 'Which description fits <b>acrylic</b>?', [
      { t: 'Hard and shiny, but brittle and easily scratched', ok: true, why: 'Acrylic is hard, stiff and shiny, but it is brittle and scratches easily.' },
      { t: 'Tough and shiny, so it survives knocks and drops', mis: 'acrylic-tough', why: 'Acrylic is not tough: it is brittle, so it cracks when it is hit.' },
      { t: 'Flexible and waxy, and it resists most chemicals', mis: 'thermoform-mixup', why: 'Waxy and chemical-resistant describes HDPE. Acrylic is hard, stiff and shiny.' },
      { t: 'Soft and bendy, so it is used to insulate cables', mis: 'thermoform-mixup', why: 'That is PVC with plasticiser added. Acrylic is hard, stiff and shiny.' },
    ]);
    Q(7, 'why PP suits a living hinge', 'A lunch-box lid is joined to the box by a thin "living hinge". Why is <b>polypropylene</b> used?', [
      { t: 'It resists fatigue, so it can bend many times', ok: true, why: 'Polypropylene resists fatigue: a thin strip can bend again and again without snapping.' },
      { t: 'It is very hard, so the hinge will not scratch', mis: 'pp-hinge,property-word', why: 'Hardness is about scratches and dents. A hinge has to bend over and over without breaking.' },
      { t: 'It is very rigid, so the hinge cannot bend', mis: 'pp-hinge,property-word', why: 'A hinge that cannot bend is no use! PP is flexible and resists fatigue.' },
      { t: 'It is brittle, so the hinge snaps shut neatly', mis: 'pp-hinge,property-word', why: 'Brittle means it cracks easily. PP is tough and flexible and resists fatigue.' },
    ]);
    Q(8, 'polymer for window frames, guttering, cable insulation', 'Which polymer is used for <b>window frames, guttering and electrical cable insulation</b>?', [
      { t: 'Polyvinyl chloride (PVC)', ok: true, why: 'PVC is rigid (uPVC) for frames and guttering, or made flexible with plasticiser for cable insulation.' },
      { t: 'Polyethylene terephthalate (PET)', mis: 'thermoform-mixup', why: 'PET is used for fizzy drinks bottles, food trays and polyester fibre.' },
      { t: 'High impact polystyrene (HIPS)', mis: 'thermoform-mixup', why: 'HIPS is used for yoghurt pots, vacuum-formed trays and casings.' },
      { t: 'Acrylic (PMMA)', mis: 'thermoform-mixup', why: 'Acrylic is used for shop signs, display stands and baths.' },
    ]);
    Q(9, 'polymer for a kitchen worktop laminate', 'Which polymer is used for brightly coloured <b>kitchen worktop laminates</b>?', [
      { t: 'Melamine formaldehyde (MF)', ok: true, why: 'MF is hard, scratch-, heat- and stain-resistant, food safe and takes bright colours.' },
      { t: 'Phenol formaldehyde (PF)', mis: 'thermoset-mixup', why: 'PF only comes in dark colours: it is used for saucepan handles and knobs.' },
      { t: 'Polyester resin (PR)', mis: 'thermoset-mixup', why: 'Polyester resin is reinforced with glass fibre (GRP) for boat hulls and car body panels.' },
      { t: 'Epoxy resin (ER)', mis: 'thermoset-mixup', why: 'Epoxy resin is used for two-part adhesives and printed circuit boards.' },
    ]);
    Q(10, 'recycling code 1', 'A bottle is stamped with recycling code <b>1</b>. Which polymer is it?', [
      { t: 'PET', ok: true, why: '1 PET, 2 HDPE, 3 PVC, 4 LDPE, 5 PP, 6 PS, 7 other.' },
      { t: 'HDPE', mis: 'code-mixup', why: 'HDPE is code 2. Code 1 is PET.' },
      { t: 'PVC', mis: 'code-mixup', why: 'PVC is code 3. Code 1 is PET.' },
      { t: 'PP', mis: 'code-mixup', why: 'PP is code 5. Code 1 is PET.' },
    ]);

    ui.el('h2', '', 'How do you feel?');
    ui.rate({ id: 'p11.conf-families', label: 'Confidence: the two families', q: 'How confident are you with the <b>two families</b> (thermoforming and thermosetting; chains and cross-links; which can be recycled)?' });
    ui.rate({ id: 'p11.conf-thermoforming', label: 'Confidence: thermoforming polymers', q: 'How confident are you with the <b>thermoforming</b> polymers (acrylic, HIPS, HDPE, PP, PVC, PET: properties and uses)?' });
    ui.rate({ id: 'p11.conf-thermosetting', label: 'Confidence: thermosetting polymers', q: 'How confident are you with the <b>thermosetting</b> polymers (ER, MF, PF, PR, UF: properties and uses)?' });
    ui.write({ id: 'p11.unsure', label: 'Still not sure about…', marks: 0, lines: 2,
      q: "What's one thing about polymers you're still not sure about?",
      scheme: ['Any honest answer'] });
  },
});
