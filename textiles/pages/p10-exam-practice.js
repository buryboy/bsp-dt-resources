// Page 10 — Exam practice: AQA-style questions (Name / State / Give / Describe / Explain) + one multiple choice. 13 marks.
Book.page({
  id: 'p10',
  title: 'Exam practice',
  build(ui) {
    const RED = Ink.RED, GREEN = Ink.GREEN;
    ui.h('Exam practice');
    ui.p('These are written like real AQA questions. Answer them, then tap <b>Check my answer</b> and tick each mark-scheme point you <b>really</b> made. Be an honest examiner! <span class="key">13 marks</span>.');

    // ---- tip box + a pen animation of an "explain" answer set out for full marks (about something NOT asked below) ----
    ui.box('<b>Command words.</b> <b>Name</b> / <b>State</b> / <b>Give</b> = a word or a short fact. <b>Describe</b> = say what it is or how it is made. <b>Explain</b> = give a point, then <b>because</b> / <b>so</b>.<br>' +
      '<span class="small">For a 2-mark <b>explain</b> question, a property on its own earns only 1 mark. Link it to the <b>product</b> to earn the second. Watch:</span>', { tag: 'Exam tip: point, then "so…"' });
    ui.anim({
      w: 860, h: 300, duration: 10.4, poster: 1.6,
      draw(k) {
        k.text('Explain why cotton is used for bath towels.  [2 marks]', 20, 40, 0.0, 1.4, { size: 23 });
        k.line([[20, 56], [820, 58]], 1.3, 1.6, { w: 1.4 });
        const L = ['Cotton is absorbent,', 'so it soaks up the water', 'from your skin.'], tag = ['1. POINT', '2. SO…  (link it)', ''];
        const c = k.ctx; c.save(); c.font = '400 28px "Gloria Hallelujah", "Comic Sans MS", cursive';
        const ws = L.map((s) => c.measureText(s).width); c.restore();
        L.forEach((s, i) => {
          const a = 1.8 + i * 2.7, y = 112 + i * 58;
          k.text(s, 40, y, a, a + 1.2, { size: 28 });
          if (!tag[i]) return;
          k.arrow([[540, y - 10], [Math.min(516, 40 + ws[i] + 24), y - 10]], a + 1.3, a + 1.7, { color: RED, w: 2, head: 12 });
          k.text(tag[i], 556, y, a + 1.6, a + 2.1, { size: 26, color: RED, font: 'bubble' });
        });
        if (k.t >= 8.6) Ink.tick(k.ctx, 430, 222, 1.0, GREEN);
        if (k.t >= 9.0) Ink.tick(k.ctx, 474, 222, 1.0, GREEN);
        k.text('property  +  why it matters  =  2 marks', 40, 282, 9.2, 10.3, { size: 22 });
      },
      sound(k) {
        k.bed('room', 0, 10.4, { gain: 0.3 });
        k.play('stroke', 0, { material: 'pen', dur: 1.4, gain: 0.4 });
        [1.8, 4.5].forEach((a) => { k.play('stroke', a, { material: 'pen', dur: 1.2, gain: 0.45 }); k.play('stroke', a + 1.3, { material: 'pen', dur: 0.8, gain: 0.4 }); });
        k.play('stroke', 7.2, { material: 'pen', dur: 1.2, gain: 0.45 });
        k.play('success', 8.6, { f: 'G5', gain: 0.35 });
        k.play('stroke', 9.2, { material: 'pen', dur: 1.1, gain: 0.35 });
      },
    });

    const n = (i) => `<b style="font-family:Fredoka">${i}.</b> `;

    ui.mcq({ id: 'p10.q1-mcq', label: 'MCQ: which fabric is non-woven [1]', shuffle: false,
      q: '<span class="marks">[1 mark]</span>' + n(1) + 'Which of these fabrics is a <b>non-woven</b> fabric?',
      options: [
        { t: 'A   Denim', mis: 'nonwoven', why: 'Denim is woven from yarns on a loom. A non-woven is made directly from fibres. Try again.' },
        { t: 'B   Felt', ok: true, why: 'Felt is a non-woven: wool fibres are matted together without being spun into yarn first.' },
        { t: 'C   Jersey', mis: 'nonwoven', why: 'T-shirt jersey is knitted from yarn. A non-woven is made directly from fibres. Try again.' },
        { t: 'D   Poplin', mis: 'nonwoven', why: 'Poplin is woven from yarns on a loom. A non-woven is made directly from fibres. Try again.' },
      ] });

    ui.write({ id: 'p10.q2-animal-fibre', label: 'Name a natural fibre that comes from an animal [1]', marks: 1, lines: 1,
      q: n(2) + '<b>Name</b> a natural fibre that comes from an <b>animal</b>.',
      scheme: ['Wool (or silk)'],
      model: 'Wool (from the fleece of sheep). Silk (from the cocoon of the silkworm) is also correct.' });

    ui.write({ id: 'p10.q3-wool', label: 'Give two properties of wool that suit a jumper [2]', marks: 2, lines: 3,
      q: n(3) + '<b>Give two</b> properties of wool that make it suitable for a winter jumper.',
      scheme: ['One of: warm / a good insulator (the fibres trap air) · soft · elastic / resilient, so creases drop out · absorbent · naturally flame resistant', 'A second, different property from that list'],
      model: 'Wool is <b>warm</b>, because its fibres trap air and make it a good insulator. It is also <b>elastic</b> (resilient), so creases drop out and the jumper keeps looking good. (Soft, absorbent and naturally flame resistant are also correct.)' });

    ui.write({ id: 'p10.q4-blend-mixture', label: 'Describe the difference between a blend and a mixture [2]', marks: 2, lines: 4,
      q: n(4) + '<b>Describe</b> the difference between a <b>blend</b> and a <b>mixture</b>.',
      scheme: ['Blend: two or more different fibres are mixed together before spinning, into one yarn', 'Mixture: different yarns are used together in one fabric (e.g. a cotton warp and a polyester weft)'],
      model: 'In a blend, two or more different fibres are mixed together <b>before spinning</b>, so every yarn contains both fibres (for example polycotton). In a mixture, <b>different yarns</b> are used in one fabric, for example a cotton warp and a polyester weft.' });

    ui.write({ id: 'p10.q5-plain-weave', label: 'Describe how a plain weave is constructed [2]', marks: 2, lines: 4,
      q: n(5) + '<b>Describe</b> how a <b>plain weave</b> fabric is constructed. <span class="small">(You could sketch it in your book first.)</span>',
      scheme: ['Two sets of yarns (warp and weft) are interlaced at right angles (on a loom)', 'The weft passes over one warp yarn, then under one'],
      model: 'A plain weave is made on a loom by interlacing two sets of yarns at right angles. The warp yarns run lengthways and the weft yarn passes across them, going <b>over one, under one</b>.' });

    ui.write({ id: 'p10.q6-knit-sport', label: 'Explain one advantage of knitted fabric for sportswear [2]', marks: 2, lines: 4,
      q: n(6) + '<b>Explain one</b> advantage of using a <b>knitted</b> fabric for sportswear.',
      scheme: ['Point: a knitted fabric is stretchy (it is made of interlocking loops) / crease-resistant', 'Linked reason: so it gives a good, comfortable fit and lets the athlete move freely / so the kit still looks smart after being packed in a bag'],
      model: 'A knitted fabric is made from interlocking loops, so it is <b>stretchy</b>. This means the sportswear gives a good, comfortable fit and stretches with the body as the athlete moves.' });

    ui.write({ id: 'p10.q7-environment', label: 'Explain one environmental issue with synthetic fibres [2]', marks: 2, lines: 4,
      q: n(7) + '<b>Explain one</b> environmental issue with <b>synthetic</b> fibres.',
      scheme: ['Issue: they are made from crude oil / most are not biodegradable / washing them sheds microfibres', 'Developed: oil is a finite resource, so it will run out / the waste does not rot away / the microfibres end up in water'],
      model: 'Synthetic fibres are made from <b>crude oil</b>, which is a <b>finite resource</b>, so it will run out. (Also correct: most are not biodegradable, so old clothes do not rot away; or washing them sheds microfibres into water.)' });

    ui.write({ id: 'p10.q8-selvedge', label: 'State what a selvedge is [1]', marks: 1, lines: 2,
      q: n(8) + '<b>State</b> what the <b>selvedge</b> of a woven fabric is.',
      scheme: ['The firm, self-finished edge (down each side, parallel to the warp) that does not fray'],
      model: 'The selvedge is the firm, self-finished edge of a woven fabric that does not fray. It runs down both sides, parallel to the warp.' });

    ui.box('<b>Add up your marks</b> on the questions above (out of 13). For any point you missed, read the model answer again and spot the key word, or the "so…", that you left out.', { tag: 'Self-assessment' });
  },
});
