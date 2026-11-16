// Page 10 — Exam practice: AQA-style questions (State / Name / Give / Describe / Explain) + one multiple choice. 14 marks.
Book.page({
  id: 'p10',
  title: 'Exam practice',
  build(ui) {
    const RED = Ink.RED, GREEN = Ink.GREEN;
    ui.h('Exam practice');
    ui.p('These are written like real AQA questions. Answer them, then tap <b>Check my answer</b> and tick each mark-scheme point you <b>really</b> made. Be an honest examiner! <span class="key">14 marks</span>.');

    // ---- tip box + a pen animation of an "explain" answer set out for full marks (about something NOT asked below) ----
    ui.box('<b>Command words.</b> <b>Name</b> / <b>State</b> / <b>Give</b> = a word or a short fact. <b>Describe</b> = say what it is or what it does. <b>Explain</b> = give a point, then <b>because</b> / <b>so</b>.<br>' +
      '<span class="small">For an <b>explain</b> question, a property on its own earns one mark. The second mark is for saying <b>why that property matters</b> for the product. Watch:</span>', { tag: 'Exam tip: point, then "so…"' });
    ui.anim({
      w: 860, h: 300, duration: 10.4, poster: 1.6,
      draw(k) {
        k.text('Explain why a milk bottle is made from HDPE.  [2 marks]', 20, 40, 0.0, 1.4, { size: 23 });
        k.line([[20, 56], [820, 58]], 1.3, 1.6, { w: 1.4 });
        const L = ['HDPE is tough,', 'so the bottle will not split if it is dropped.'], tag = ['1. POINT', '2. SO…'];
        const c = k.ctx; c.save(); c.font = '400 26px "Gloria Hallelujah", "Comic Sans MS", cursive';
        const ws = L.map((s) => c.measureText(s).width); c.restore();
        L.forEach((s, i) => {
          const a = 1.8 + i * 3, y = 116 + i * 64, end = Math.min(40 + ws[i], 640);
          k.text(s, 40, y, a, a + 1.4, { size: 26 });
          k.arrow([[end + 76, y - 10], [end + 20, y - 10]], a + 1.5, a + 1.9, { color: RED, w: 2, head: 12 });
          k.text(tag[i], end + 88, y, a + 1.8, a + 2.3, { size: 26, color: RED, font: 'bubble' });
        });
        if (k.t >= 8.2) { Ink.tick(k.ctx, 60, 244, 1.0, GREEN); Ink.tick(k.ctx, 96, 244, 1.0, GREEN); }
        k.text('a property + why it matters here = 2 marks', 130, 252, 8.4, 10.2, { size: 23 });
      },
      sound(k) {
        k.bed('room', 0, 10.4, { gain: 0.3 });
        k.play('stroke', 0, { material: 'pen', dur: 1.4, gain: 0.4 });
        [1.8, 4.8].forEach((a) => { k.play('stroke', a, { material: 'pen', dur: 1.4, gain: 0.45 }); k.play('stroke', a + 1.5, { material: 'pen', dur: 0.8, gain: 0.4 }); });
        k.play('success', 8.2, { f: 'G5', gain: 0.35 });
        k.play('stroke', 8.4, { material: 'pen', dur: 1.6, gain: 0.35 });
      },
    });

    const n = (i) => `<b style="font-family:Fredoka">${i}.</b> `;

    ui.mcq({ id: 'p10.q1-mcq', label: 'MCQ: pick the thermosetting polymer [1]', shuffle: false,
      q: '<span class="marks">[1 mark]</span>' + n(1) + 'Which one of these is a <b>thermosetting</b> polymer?',
      options: [
        { t: 'A   Polypropylene', mis: 'thermo-swap', why: 'Polypropylene softens when heated and can be reshaped: it is a thermoforming polymer. Try again.' },
        { t: 'B   Polyvinyl chloride', mis: 'thermo-swap', why: 'PVC softens when heated and can be recycled (code 3): it is a thermoforming polymer. Try again.' },
        { t: 'C   Urea formaldehyde', ok: true, why: 'Urea formaldehyde is a thermosetting polymer: once set, it cannot be softened or reshaped by heating.' },
        { t: 'D   High impact polystyrene', mis: 'thermo-swap', why: 'HIPS softens when heated (that is how it is vacuum formed): it is a thermoforming polymer. Try again.' },
      ] });

    ui.write({ id: 'p10.q2-source', label: 'State the raw material most polymers come from [1]', marks: 1, lines: 1,
      q: n(2) + '<b>State</b> the raw material that most polymers are made from.',
      scheme: ['Crude oil (accept: oil)'],
      model: 'Crude oil. (It is a finite, non-renewable fossil fuel.)' });

    ui.write({ id: 'p10.q3-families', label: 'Describe the difference between thermoforming and thermosetting polymers [2]', marks: 2, lines: 4,
      q: n(3) + '<b>Describe</b> the difference between <b>thermoforming</b> and <b>thermosetting</b> polymers.',
      scheme: ['Thermoforming polymers soften when heated and can be shaped (and harden when cooled), again and again', 'Thermosetting polymers are shaped once and set permanently: they cannot be softened or reshaped by heating'],
      model: 'A thermoforming polymer softens when it is heated, so it can be shaped, and hardens when it cools. This can be repeated again and again. A thermosetting polymer is shaped once: it sets permanently and cannot be softened or reshaped by heating (it chars instead).' });

    ui.write({ id: 'p10.q4-yoghurt', label: 'Name a thermoforming polymer for a vacuum-formed yoghurt pot + reason [2]', marks: 2, lines: 3,
      q: n(4) + '<b>Name</b> a thermoforming polymer suitable for a <b>vacuum-formed yoghurt pot</b> and <b>give one reason</b> for your choice.',
      scheme: ['High impact polystyrene / HIPS (also accept polypropylene or PET with a matching reason)', 'A reason that fits the pot: e.g. very easy to vacuum form / food safe / lightweight / cheap / tough'],
      model: 'High impact polystyrene (HIPS), because it is very easy to vacuum form into the pot shape. (It is also food safe, lightweight, cheap and tough.)' });

    ui.write({ id: 'p10.q5-thermoset-recycle', label: 'Explain why thermosetting polymers cannot be recycled by melting [2]', marks: 2, lines: 4,
      q: n(5) + '<b>Explain</b> why thermosetting polymers <b>cannot be recycled by melting</b>.',
      scheme: ['Their chains are joined by strong cross-links (formed when they set)', 'So heating cannot make the chains slide / they cannot soften or melt: they char or burn instead'],
      model: 'When a thermosetting polymer sets, strong cross-links form between its chains. The chains are locked together permanently, so heating cannot make them slide: the polymer does not soften or melt, it chars and burns instead. It cannot be melted down to make new products.' });

    ui.write({ id: 'p10.q6-environment', label: 'Explain two environmental problems caused by polymers [4]', marks: 4, lines: 6,
      q: n(6) + '<b>Explain two</b> environmental problems caused by polymers.',
      scheme: ['Problem 1 stated: e.g. made from crude oil / not biodegradable / litter in the oceans / making them uses energy', 'Problem 1 explained: e.g. crude oil is finite so it will run out / they last hundreds of years in landfill / they break into microplastics / CO2 is released', 'Problem 2 stated: a different problem from the list above', 'Problem 2 explained: its own "so…" or "because…"'],
      model: 'Most polymers are made from <b>crude oil</b>, which is a finite (non-renewable) resource, so it will run out; making them also uses energy and releases CO2. Most polymers are <b>not biodegradable</b>, so they last for hundreds of years in landfill, litter the oceans and break up into microplastics.' });

    ui.write({ id: 'p10.q7-acrylic', label: 'Give two properties that make acrylic suitable for a shop sign [2]', marks: 2, lines: 2,
      q: n(7) + '<b>Give two</b> properties of <b>acrylic</b> that make it suitable for a shop sign.',
      scheme: ['One suitable property: weather-resistant / can be brightly coloured (or transparent) / shiny / hard / stiff', 'A second, different property from that list'],
      model: 'Any two of: it is weather-resistant (it can stay outdoors), it can be brightly coloured, it is shiny, it is hard and it is stiff. (Not "tough": acrylic is brittle.)' });

    ui.box('<b>Add up your marks</b> on the questions above (out of 14). For any point you missed, read the model answer again and spot the key word, or the "so…", that you left out.', { tag: 'Self-assessment' });
  },
});
