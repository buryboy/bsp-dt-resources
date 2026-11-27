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
        k.text('ferrous', 286, 80, 1.3, 1.6, { size: 26, align: 'center' });
        k.text('+', 350, 80, 1.6, 1.7, { size: 26, align: 'center' });
        k.text('non-ferrous', 452, 80, 1.7, 2.0, { size: 26, align: 'center' });
        k.text('+', 552, 80, 2.0, 2.1, { size: 26, align: 'center' });
        k.text('alloys', 612, 80, 2.1, 2.5, { size: 26, align: 'center' });
        k.text('= 10 Qs', 740, 80, 2.5, 3.0, { size: 26, align: 'center' });
        k.text('admit one (brain) to the next lesson', 516, 124, 3.0, 3.8, { size: 22, color: RED, align: 'center' });
      },
      sound(k) { k.play('stroke', 0, { material: 'pen', dur: 1, gain: 0.4 }); k.play('stroke', 1.0, { material: 'pen', dur: 2.8, gain: 0.35 }); k.play('stamp', 3.9, { gain: 0.3 }); },
    });

    // options are shuffled per question id here (so the right answer is not always in the same place)
    const hash = (s) => { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h % 100000; };
    const Q = (n, label, q, options) => { const id = 'p11.q' + String(n).padStart(2, '0'); return ui.mcq({ id, label: `Q${n}: ${label}`, q: `<b style="font-family:Fredoka">${n}.</b> ${q}`, shuffle: false, options: Book.shuffle(options, hash(id) + 17) }); };

    ui.el('h2', '', 'Where metals come from');
    Q(1, 'what ferrous means', 'What makes a metal a <b>ferrous</b> metal?', [
      { t: 'It contains iron', ok: true, why: 'Ferrous metals contain iron. Most are magnetic and will rust.' },
      { t: 'It contains carbon', mis: 'ferrous-meaning', why: 'Steels do contain carbon, but that is not what the word means. Ferrous = contains iron.' },
      { t: 'It contains no iron', mis: 'ferrous-meaning', why: 'That is a NON-ferrous metal. Ferrous = contains iron.' },
      { t: 'It is a pure metal', mis: 'ferrous-meaning', why: 'Ferrous is not about being pure: steel is ferrous and it is a mixture. Ferrous = contains iron.' },
    ]);
    Q(2, 'how aluminium is extracted', 'How is <b>aluminium</b> extracted?', [
      { t: 'From bauxite, by electrolysis', ok: true, why: 'Aluminium comes from bauxite and is extracted by electrolysis, which uses a huge amount of electricity.' },
      { t: 'From bauxite, in a blast furnace', mis: 'ore-extraction', why: 'The ore is right, but the blast furnace is for iron. Aluminium needs electrolysis.' },
      { t: 'From haematite, by electrolysis', mis: 'ore-extraction', why: 'The method is right, but haematite is iron ore. Aluminium comes from bauxite.' },
      { t: 'From haematite, in a blast furnace', mis: 'ore-extraction', why: 'That is how IRON is made. Aluminium comes from bauxite, by electrolysis.' },
    ]);
    Q(3, 'true statement about recycling metals', 'Which statement about <b>recycling</b> metals is true?', [
      { t: 'They can be recycled again and again with no loss of quality', ok: true, why: 'Metals can be recycled again and again without losing quality, and it saves a lot of energy.' },
      { t: 'They get a little weaker every time they are melted down', mis: 'finite-recycle', why: 'Metals do not lose quality when they are recycled: they can go round again and again.' },
      { t: 'It takes more energy than extracting new metal from ore', mis: 'finite-recycle', why: 'It is the other way round: recycling aluminium saves about 95% of the energy.' },
      { t: 'It is not really needed, as metal ores are a renewable resource', mis: 'finite-recycle', why: 'Metals are a finite (non-renewable) resource: the ores will run out.' },
    ]);

    ui.el('h2', '', 'Ferrous metals');
    Q(4, 'carbon rule: 0.2% vs 1.2% carbon', 'Steel <b>A</b> contains 0.2% carbon. Steel <b>B</b> contains 1.2% carbon. Which statement is true?', [
      { t: 'B is harder than A, but less ductile', ok: true, why: 'More carbon → harder and stronger, but less ductile and more brittle.' },
      { t: 'B is softer than A, and more ductile', mis: 'carbon-rule', why: 'It is the other way round: more carbon makes steel harder and LESS ductile.' },
      { t: 'B is harder than A, and more ductile', mis: 'carbon-rule', why: 'Harder is right, but you pay for it: more carbon makes steel LESS ductile and more brittle.' },
      { t: 'B is softer than A, but less ductile', mis: 'carbon-rule', why: 'Less ductile is right, but more carbon makes steel HARDER, not softer.' },
    ]);
    Q(5, 'pick the cast iron product', 'Which of these is most likely to be made from <b>cast iron</b>?', [
      { t: 'The body of a vice', ok: true, why: 'Cast iron is very strong in compression and pours well into a mould: ideal for a chunky vice body.' },
      { t: 'The blade of a saw', mis: 'steel-mixup', why: 'A saw blade must keep a sharp edge and flex a little: high carbon steel. Cast iron is too brittle.' },
      { t: 'The body of a car', mis: 'steel-mixup', why: 'Car bodies are pressed from sheets of low carbon steel, which is tough and malleable. Cast iron would crack.' },
      { t: 'The shaft of a nail', mis: 'steel-mixup', why: 'Nails are low carbon steel: tough enough to be hammered. Brittle cast iron would crack.' },
    ]);

    ui.el('h2', '', 'Non-ferrous metals and alloys');
    Q(6, 'metal that coats steel food cans', 'Which metal has a <b>very low melting point</b> and is used as a thin coating on steel food cans?', [
      { t: 'Tin', ok: true, why: 'Tin melts at only 232 °C, resists corrosion and is non-toxic: "tin cans" are steel with a thin tin coating.' },
      { t: 'Zinc', mis: 'nonferrous-mixup', why: 'Zinc also has a low melting point, but its coating job is galvanising (gates, buckets), not food cans.' },
      { t: 'Aluminium', mis: 'tin-can', why: 'Aluminium is used for drinks cans and foil, not as the coating on steel food cans.' },
      { t: 'Copper', mis: 'nonferrous-mixup', why: 'Copper has a high melting point (1083 °C). It is used for wires and pipes.' },
    ]);
    Q(7, 'why aluminium for aircraft bodies', 'Why is <b>aluminium</b> used for aircraft bodies?', [
      { t: 'It has a low density, so the aircraft is lighter', ok: true, why: 'Aluminium is lightweight: its density is about a third of that of steel. It also resists corrosion.' },
      { t: 'It has a high density, so the aircraft is stronger', mis: 'nonferrous-mixup', why: 'Aluminium has a LOW density, and a heavy aircraft would be a bad thing.' },
      { t: 'It is extremely hard, so the body cannot be dented', mis: 'nonferrous-mixup', why: 'Aluminium is a soft metal. It is chosen because it is light.' },
      { t: 'It is strongly magnetic, so panels are easy to join', mis: 'ferrous-meaning', why: 'Aluminium is non-ferrous, so it is not magnetic. It is chosen because it is light.' },
    ]);
    Q(8, 'what an alloy is', 'What is an <b>alloy</b>?', [
      { t: 'A mixture of two or more elements, at least one a metal', ok: true, why: 'An alloy is a mixture of two or more elements, at least one of them a metal, made to improve the properties.' },
      { t: 'A pure metal that has been refined from its natural ore', mis: 'alloy-meaning', why: 'An alloy is the opposite of a pure metal: it is a mixture.' },
      { t: 'A thin layer of one metal coated on top of another one', mis: 'alloy-meaning', why: 'That is plating or galvanising. In an alloy the elements are mixed all the way through.' },
      { t: 'A metal compound formed by reacting with air and water', mis: 'alloy-meaning', why: 'That is closer to rust. An alloy is a mixture of elements, made on purpose.' },
    ]);
    Q(9, 'what stainless steel is', '<b>Stainless steel</b> is…', [
      { t: 'a ferrous alloy: steel with chromium and nickel', ok: true, why: 'Stainless steel is steel with chromium and nickel added. It contains iron, so it is a ferrous alloy.' },
      { t: 'a non-ferrous alloy: copper mixed with zinc', mis: 'alloy-contents', why: 'Copper and zinc make brass. Stainless steel is steel with chromium and nickel.' },
      { t: 'a non-ferrous metal with no iron in it at all', mis: 'stainless-family', why: 'It is mostly steel, so it does contain iron: it is a ferrous alloy.' },
      { t: 'a ferrous alloy: steel with zinc and tin added', mis: 'alloy-contents', why: 'Ferrous alloy is right, but the added metals are chromium and nickel.' },
    ]);

    ui.el('h2', '', 'Rusting');
    Q(10, 'steel nail sealed in dry air', 'A steel nail is sealed in a tube of completely <b>dry air</b>. Will it rust?', [
      { t: 'No: rust needs both air and water', ok: true, why: 'Rust forms only when iron or steel meets BOTH oxygen (air) and water. Take either away and it does not rust.' },
      { t: 'Yes: rust needs only the oxygen in air', mis: 'rust-conditions', why: 'Oxygen alone is not enough: rust needs both oxygen and water.' },
      { t: 'Yes: steel rusts wherever it is kept', mis: 'rust-conditions', why: 'Steel only rusts when it meets both oxygen and water. Keep it dry and it stays clean.' },
      { t: 'No: rust needs only water, not air', mis: 'rust-conditions', why: 'It will not rust, but the reason is wrong: rust needs both water AND oxygen (air).' },
    ]);

    ui.el('h2', '', 'How do you feel?');
    ui.rate({ id: 'p11.conf-ferrous', label: 'Confidence: ferrous metals', q: 'How confident are you with <b>ferrous metals</b> (low carbon steel, high carbon steel, cast iron; the carbon rule; rusting and protection)?' });
    ui.rate({ id: 'p11.conf-nonferrous', label: 'Confidence: non-ferrous metals', q: 'How confident are you with <b>non-ferrous metals</b> (aluminium, copper, tin, zinc: properties and uses)?' });
    ui.rate({ id: 'p11.conf-alloys', label: 'Confidence: alloys', q: 'How confident are you with <b>alloys</b> (what an alloy is; brass, stainless steel, high speed steel)?' });
    ui.write({ id: 'p11.unsure', label: 'Still not sure about…', marks: 0, lines: 2,
      q: "What's one thing about metals and alloys you're still not sure about?",
      scheme: ['Any honest answer'] });
  },
});
