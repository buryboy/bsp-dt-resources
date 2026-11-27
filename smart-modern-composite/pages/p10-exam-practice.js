// Page 10 — Exam practice: AQA-style questions (State / Define / Name / Describe / Explain) + one multiple choice. 14 marks.
Book.page({
  id: 'p10',
  title: 'Exam practice',
  build(ui) {
    const RED = Ink.RED, GREEN = Ink.GREEN;
    ui.h('Exam practice');
    ui.p('These are written like real AQA questions. Answer them, then tap <b>Check my answer</b> and tick each mark-scheme point you <b>really</b> made. Be an honest examiner! <span class="key">14 marks</span>.');

    // ---- tip box + a pen animation of a 2-mark "explain" answer (about something NOT asked below) ----
    ui.box('<b>Command words.</b> <b>State</b> / <b>Name</b> / <b>Give</b> = a word or a short fact. <b>Define</b> = say exactly what the term means. <b>Describe</b> = say what it is or how it works. <b>Explain</b> = give a point, then <b>because</b> / <b>so</b>.<br>' +
      '<span class="small">The marks in brackets tell you <b>how many points</b> to make: a 2-mark <b>explain</b> needs a <b>point</b> and then a <b>reason</b> or <b>result</b>. Watch:</span>', { tag: 'Exam tip: one point per mark' });
    ui.anim({
      w: 860, h: 300, duration: 10,  poster: 1.6,
      draw(k) {
        k.text('Explain why metal foam is used in car crumple zones.  [2 marks]', 20, 40, 0.0, 1.4, { size: 23 });
        k.line([[20, 56], [820, 58]], 1.3, 1.6, { w: 1.4 });
        const L = ['It crumples in a crash,', 'so it absorbs the impact energy.'], tag = ['1. POINT', '2. SO…'];
        const c = k.ctx; c.save(); c.font = '400 26px "Gloria Hallelujah", "Comic Sans MS", cursive';
        const ws = L.map((s) => c.measureText(s).width); c.restore();
        L.forEach((s, i) => {
          const a = 1.8 + i * 3.2, y = 118 + i * 70;
          k.text(s, 40, y, a, a + 1.6, { size: 26 });
          k.arrow([[Math.max(640, 40 + ws[i] + 70), y - 10], [40 + ws[i] + 22, y - 10]], a + 1.7, a + 2.1, { color: RED, w: 2, head: 12 });
          k.text(tag[i], Math.max(654, 40 + ws[i] + 84), y, a + 2.0, a + 2.6, { size: 26, color: RED, font: 'bubble' });
        });
        if (k.t >= 8) { Ink.tick(k.ctx, 816, 122, 1.0, GREEN); }
        if (k.t >= 8.4) { Ink.tick(k.ctx, 816, 192, 1.0, GREEN); }
        k.text('one tick for each point = 2 marks', 40, 264, 8.6, 9.8, { size: 22 });
      },
      sound(k) {
        k.bed('room', 0, 10, { gain: 0.3 });
        k.play('stroke', 0, { material: 'pen', dur: 1.4, gain: 0.4 });
        [1.8, 5].forEach((a) => { k.play('stroke', a, { material: 'pen', dur: 1.6, gain: 0.45 }); k.play('stroke', a + 1.7, { material: 'pen', dur: 0.8, gain: 0.4 }); });
        k.play('success', 8, { f: 'E5', gain: 0.3 }); k.play('success', 8.4, { f: 'G5', gain: 0.35 });
        k.play('stroke', 8.6, { material: 'pen', dur: 1.2, gain: 0.35 });
      },
    });

    const n = (i) => `<b style="font-family:Fredoka">${i}.</b> `;

    ui.mcq({ id: 'p10.q1-mcq', label: 'MCQ: which one is a smart material [1]', shuffle: false,
      q: '<span class="marks">[1 mark]</span>' + n(1) + 'Which one of these is a <b>smart</b> material?',
      options: [
        { t: 'A   Carbon fibre reinforced plastic', mis: 'group-mixup', why: 'CFRP is a composite: carbon fibres held in epoxy resin. It does not change in response to a stimulus. Try again.' },
        { t: 'B   Thermochromic pigment', ok: true, why: 'Its colour changes with temperature and changes back when it cools: a reversible response to a stimulus.' },
        { t: 'C   Aluminium metal foam', mis: 'group-mixup', why: 'Metal foam is a modern material. It does not change in response to a stimulus. Try again.' },
        { t: 'D   Kevlar aramid fibre', mis: 'group-mixup', why: 'Kevlar is a technical textile. It does not change in response to a stimulus. Try again.' },
      ] });

    ui.write({ id: 'p10.q2-kevlar', label: 'State one use of Kevlar [1]', marks: 1, lines: 1,
      q: n(2) + '<b>State</b> one use of <b>Kevlar</b>.',
      scheme: ['Any one: bullet-proof (ballistic) vest / cut-resistant gloves / helmets / motorcycle clothing / sails / ropes / tyres'],
      model: 'Bullet-proof (ballistic) vests. (Also: cut-resistant gloves, helmets, motorcycle clothing, sails, ropes or tyres.)' });

    ui.write({ id: 'p10.q3-smart', label: 'Define a smart material [2]', marks: 2, lines: 3,
      q: n(3) + '<b>Define</b> the term <b>smart material</b>.',
      scheme: ['Its (physical) properties change in response to a change in its surroundings / an external stimulus (e.g. temperature, light, stress, moisture, pH)', 'The change is reversible: it changes back when the stimulus is removed'],
      model: 'A smart material is one whose physical properties <b>change in response to an external stimulus</b> (a change in its surroundings such as temperature, light, stress, moisture or pH). The change is <b>reversible</b>: it changes back when the stimulus is removed.' });

    ui.write({ id: 'p10.q4-thermo', label: 'One use of thermochromic pigment + how it works [2]', marks: 2, lines: 3,
      q: n(4) + '<b>Give</b> one use of a <b>thermochromic pigment</b> and <b>explain</b> how it works.',
      scheme: ['A use: baby spoon / kettle / bath toy that shows if too hot / battery tester / forehead thermometer strip / mug / novelty clothing / packaging that shows when a drink is cold enough', 'How: its colour changes when the temperature changes (and it changes back when it cools)'],
      model: 'A baby feeding spoon. The pigment <b>changes colour when the temperature changes</b>, so the spoon changes colour to warn that the food is too hot. It changes back when it cools.' });

    ui.write({ id: 'p10.q5-parts', label: 'Name the two parts of a composite + what each does [2]', marks: 2, lines: 3,
      q: n(5) + 'A composite such as GRP has two parts. <b>Name</b> the two parts and <b>state</b> what each one does.',
      scheme: ['Reinforcement (the fibres / particles): gives the strength', 'Matrix (e.g. the resin): binds the reinforcement and holds it in shape'],
      model: 'The <b>reinforcement</b> (fibres or particles, such as glass fibres) gives the strength. The <b>matrix</b> (such as polyester resin) binds the reinforcement together and holds it in shape.' });

    ui.write({ id: 'p10.q6-rebar', label: 'Explain why steel rods are put in concrete [2]', marks: 2, lines: 4,
      q: n(6) + '<b>Explain</b> why steel rods are cast inside concrete beams.',
      scheme: ['Concrete is strong in compression but weak in tension (pulling)', 'So the steel bars (rebar) carry the tension / stop the beam cracking where it is being stretched'],
      model: 'Concrete is very strong in compression but <b>weak in tension</b>. The steel bars (rebar) are cast inside to <b>carry the tension</b>, so the reinforced concrete beam does not crack where it is being pulled.' });

    ui.write({ id: 'p10.q7-titanium', label: 'Two properties of titanium for a hip replacement [2]', marks: 2, lines: 3,
      q: n(7) + '<b>Give</b> two properties of <b>titanium</b> that make it suitable for a hip replacement.',
      scheme: ['One of: biocompatible (not rejected by the body) / excellent corrosion resistance / very strong / lightweight', 'A second, different property from the same list'],
      model: 'Titanium is <b>biocompatible</b> (the body does not reject it) and has <b>excellent corrosion resistance</b>. (It is also very strong and lightweight.)' });

    ui.write({ id: 'p10.q8-microencap', label: 'Describe how micro-encapsulation works in a fabric [2]', marks: 2, lines: 4,
      q: n(8) + '<b>Describe</b> how <b>micro-encapsulation</b> works in a fabric.',
      scheme: ['Tiny capsules of a substance (e.g. scent, moisturiser, insect repellent, antibacterial) are trapped on the fibres', 'The capsules burst slowly with wear / friction, releasing the substance over time'],
      model: 'Tiny capsules of a substance, such as a scent or an antibacterial, are <b>trapped on the fibres</b>. As the fabric is worn, friction makes the capsules <b>burst slowly</b>, so the substance is released over time.' });

    ui.box('<b>Add up your marks</b> on the questions above (out of 14). For any point you missed, read the model answer again and spot the key word that you left out.', { tag: 'Self-assessment' });
  },
});
