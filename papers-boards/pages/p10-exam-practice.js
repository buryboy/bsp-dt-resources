// Page 10 — Exam practice: AQA-style questions (State / Name / Describe / Calculate / Explain) + one multiple choice. 13 marks.
Book.page({
  id: 'p10',
  title: 'Exam practice',
  build(ui) {
    const RED = Ink.RED, GREEN = Ink.GREEN;
    ui.h('Exam practice');
    ui.p('These are written like real AQA questions. Answer them, then tap <b>Check my answer</b> and tick each mark-scheme point you <b>really</b> made. Be an honest examiner! <span class="key">13 marks</span>.');

    // ---- tip box + a pen animation of a calculation set out for full marks (about something NOT asked below) ----
    ui.box('<b>Command words.</b> <b>State</b> / <b>Name</b> = a word or a short fact. <b>Describe</b> = say what it is like or what it does. <b>Explain</b> = give a point, then <b>because</b> / <b>so</b>. <b>Calculate</b> = work out a number.<br>' +
      '<span class="small">For a <b>calculate</b> question, always <b>show your working</b>: write the <b>rule</b>, <b>substitute</b> the numbers, then give the <b>answer</b> with its <b>unit</b>. Working can earn a mark even if you slip up. Watch:</span>', { tag: 'Exam tip: show your working' });
    ui.anim({
      w: 860, h: 320, duration: 11.6, poster: 1.6,
      draw(k) {
        k.text('A board is 350 microns thick. Calculate this in mm.  [2 marks]', 20, 40, 0.0, 1.4, { size: 23 });
        k.line([[20, 56], [820, 58]], 1.3, 1.6, { w: 1.4 });
        const L = ['mm = microns ÷ 1000', '= 350 ÷ 1000', '= 0.35 mm'], tag = ['1. RULE', '2. SUBSTITUTE', '3. ANSWER + UNIT'];
        const c = k.ctx; c.save(); c.font = '400 28px "Gloria Hallelujah", "Comic Sans MS", cursive';
        const eq = c.measureText('mm ').width; const ws = L.map((s) => c.measureText(s).width); c.restore();
        L.forEach((s, i) => {
          const a = 1.8 + i * 2.7, y = 112 + i * 58, x = i ? 40 + eq : 40;
          k.text(s, x, y, a, a + 1.2, { size: 28 });
          k.arrow([[530, y - 10], [x + ws[i] + 24, y - 10]], a + 1.3, a + 1.7, { color: RED, w: 2, head: 12 });
          k.text(tag[i], 546, y, a + 1.6, a + 2.1, { size: 26, color: RED, font: 'bubble' });
        });
        if (k.t >= 9.4) { const u = 40 + eq + ws[2]; k.line(k.ellipse(u - 24, 218, 34, 23), 9.4, 9.9, { color: RED, w: 2.2 }); }
        if (k.t >= 10) Ink.tick(k.ctx, 806, 222, 1.1, GREEN);
        k.text('(1000 microns = 1 mm)', 40, 292, 10.2, 11.4, { size: 22 });
      },
      sound(k) {
        k.bed('room', 0, 11.6, { gain: 0.3 });
        k.play('stroke', 0, { material: 'pen', dur: 1.4, gain: 0.4 });
        [1.8, 4.5, 7.2].forEach((a) => { k.play('stroke', a, { material: 'pen', dur: 1.2, gain: 0.45 }); k.play('stroke', a + 1.3, { material: 'pen', dur: 0.8, gain: 0.4 }); });
        k.play('stroke', 9.4, { material: 'pen', dur: 0.5, gain: 0.45 });
        k.play('success', 10, { f: 'G5', gain: 0.35 });
        k.play('stroke', 10.2, { material: 'pen', dur: 1.2, gain: 0.35 });
      },
    });

    const n = (i) => `<b style="font-family:Fredoka">${i}.</b> `;

    ui.mcq({ id: 'p10.q1-mcq', label: 'MCQ: paper size with half the area of A3 [1]', shuffle: false,
      q: '<span class="marks">[1 mark]</span>' + n(1) + 'Which paper size has exactly <b>half</b> the area of <b>A3</b>?',
      options: [
        { t: 'A   A1', mis: 'a-size', why: 'The bigger the number, the SMALLER the sheet. A1 is much bigger than A3. Try again.' },
        { t: 'B   A2', mis: 'a-size', why: 'A2 is twice the area of A3, not half: the bigger the number, the SMALLER the sheet. Try again.' },
        { t: 'C   A4', ok: true, why: 'Each size is half the one before, so cutting an A3 sheet in half gives two A4 sheets.' },
        { t: 'D   A5', mis: 'a-size', why: 'A5 is half of A4, so it is only a quarter of A3. Try again.' },
      ] });

    ui.write({ id: 'p10.q2-gsm', label: 'State what gsm stands for [1]', marks: 1, lines: 1,
      q: n(2) + 'The weight of paper is given in <b>gsm</b>. <b>State</b> what gsm stands for.',
      scheme: ['Grams per square metre'],
      model: 'Grams per square metre: the mass of one sheet that measures 1 m × 1 m.' });

    ui.write({ id: 'p10.q3-marker', label: 'Name a paper for marker rendering + reason [2]', marks: 2, lines: 3,
      q: n(3) + 'A designer is going to colour a final drawing with <b>marker pens</b>. <b>Name</b> a suitable paper and give <b>one reason</b> for your choice.',
      scheme: ['Bleed proof paper', 'It is coated so the marker ink stays on the surface / the ink does not spread (bleed) or soak through'],
      model: '<b>Bleed proof paper</b>. It is specially coated so that the marker ink stays on the surface: it does not spread (bleed) or soak through, so the edges stay crisp.' });

    ui.write({ id: 'p10.q4-corrugated', label: 'Describe the structure of corrugated card [2]', marks: 2, lines: 3,
      q: n(4) + '<b>Describe</b> the structure of <b>corrugated card</b>.',
      scheme: ['A wavy / fluted layer in the middle…', '…glued between two flat layers (liners)'],
      model: 'Corrugated card has a wavy <b>fluted</b> layer glued between two flat sheets called <b>liners</b>.' });

    ui.write({ id: 'p10.q5-calc', label: 'Calculate weight of 40 sheets of A4, 120 gsm [2]', marks: 2, lines: 3,
      q: n(5) + 'A pad holds <b>40 sheets</b> of <b>A4</b> cartridge paper. The paper is <b>120 gsm</b>, and one A4 sheet is <b>1/16</b> of a square metre. <b>Calculate</b> the weight of the paper in the pad. Show your working.',
      scheme: ['Working: one sheet = 120 ÷ 16 (= 7.5 g), then × 40', 'Answer: 300 g (with the unit)'],
      model: 'One A4 sheet = 120 ÷ 16 = 7.5 g. Forty sheets = 7.5 × 40 = <b>300 g</b>.' });

    ui.write({ id: 'p10.q6-foil', label: 'Explain why foil lined board is used for takeaway lids [2]', marks: 2, lines: 4,
      q: n(6) + '<b>Explain</b> why <b>foil lined board</b> is used for the lids of takeaway containers.',
      scheme: ['The foil reflects heat, so the food stays hot', 'The foil is a barrier against moisture (and oxygen), so steam and sauce cannot soak into the board'],
      model: 'The aluminium foil <b>reflects heat</b> back into the container, so the food stays hot. The foil is also a <b>barrier against moisture and oxygen</b>, so steam and sauce cannot soak into the board.' });

    ui.write({ id: 'p10.q7-recycled', label: 'Explain an advantage and a disadvantage of recycled paper [3]', marks: 3, lines: 5,
      q: n(7) + '<b>Explain</b> one <b>advantage</b> and one <b>disadvantage</b> of using <b>recycled</b> paper.',
      scheme: ['Advantage: it saves trees / saves energy / less waste goes to landfill', 'Disadvantage: each time paper is recycled, the fibres get shorter and weaker', 'So it can only be recycled about 5–7 times / new (virgin) fibres often have to be mixed in'],
      model: 'An advantage is that recycling <b>saves trees, energy and landfill space</b>, because waste paper is pulped and used again. A disadvantage is that the fibres get <b>shorter and weaker</b> each time, so paper can only be recycled about 5–7 times and recycled pulp is often mixed with new (virgin) fibres.' });

    ui.box('<b>Add up your marks</b> on the questions above (out of 13). For any point you missed, read the model answer again and spot the key word, or the line of working, that you left out.', { tag: 'Self-assessment' });
  },
});
