// Page 10 — Exam practice: AQA-style questions (Name / Describe / Calculate / Explain) + one multiple choice. 13 marks.
Book.page({
  id: 'p10',
  title: 'Exam practice',
  build(ui) {
    const RED = Ink.RED, GREEN = Ink.GREEN;
    ui.h('Exam practice');
    ui.p('These are written like real AQA questions. Answer them, then tap <b>Check my answer</b> and tick each mark-scheme point you <b>really</b> made. Be an honest examiner! <span class="key">13 marks</span>.');

    // ---- tip box + a pen animation of a calculation set out for full marks (about something NOT asked below) ----
    ui.box('<b>Command words.</b> <b>Name</b> / <b>State</b> = a word or a short fact. <b>Describe</b> = say what it is or what it does. <b>Explain</b> = give a point, then <b>because</b> / <b>so</b>. <b>Calculate</b> = work out a number.<br>' +
      '<span class="small">For a <b>calculate</b> question, always <b>show your working</b>: write the <b>formula</b>, <b>substitute</b> the numbers, then give the <b>answer</b> with its <b>unit</b> (if it has one). Working can earn a mark even if you slip up. Watch:</span>', { tag: 'Exam tip: show your working' });
    ui.anim({
      w: 860, h: 320, duration: 11.6, poster: 1.6,
      draw(k) {
        k.text('Calculate the weight of a 25 kg bag of cement.  [2 marks]', 20, 40, 0.0, 1.4, { size: 23 });
        k.line([[20, 56], [820, 58]], 1.3, 1.6, { w: 1.4 });
        const L = ['weight = mass × 10', '= 25 × 10', '= 250 N'], tag = ['1. FORMULA', '2. SUBSTITUTE', '3. ANSWER + UNIT'];
        const c = k.ctx; c.save(); c.font = '400 28px "Gloria Hallelujah", "Comic Sans MS", cursive';
        const eq = c.measureText('weight ').width; const ws = L.map((s) => c.measureText(s).width); c.restore();
        L.forEach((s, i) => {
          const a = 1.8 + i * 2.7, y = 112 + i * 58, x = i ? 40 + eq : 40;
          k.text(s, x, y, a, a + 1.2, { size: 28 });
          k.arrow([[530, y - 10], [x + ws[i] + 24, y - 10]], a + 1.3, a + 1.7, { color: RED, w: 2, head: 12 });
          k.text(tag[i], 546, y, a + 1.6, a + 2.1, { size: 26, color: RED, font: 'bubble' });
        });
        if (k.t >= 9.4) { const u = 40 + eq + ws[2]; k.line(k.ellipse(u - 11, 218, 23, 23), 9.4, 9.9, { color: RED, w: 2.2 }); }
        if (k.t >= 10) Ink.tick(k.ctx, 806, 222, 1.1, GREEN);
        k.text('(1 kg weighs about 10 N)', 40, 292, 10.2, 11.4, { size: 22 });
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

    ui.mcq({ id: 'p10.q1-mcq', label: 'MCQ: linkage with output opposite to input [1]', shuffle: false,
      q: '<span class="marks">[1 mark]</span>' + n(1) + 'Which linkage makes the output move in the <b>opposite direction</b> to the input?',
      options: [
        { t: 'A   Push–pull linkage', mis: 'linkage-type', why: 'In a push–pull linkage the output moves in the SAME direction as the input. Try again.' },
        { t: 'B   Bell crank linkage', mis: 'linkage-type', why: 'A bell crank turns the motion through 90° (round a corner). Try again.' },
        { t: 'C   Reverse motion linkage', ok: true, why: 'A reverse motion linkage is one lever on a fixed pivot: push one end in and the other end comes out the other way.' },
        { t: 'D   Crank and slider', mis: 'linkage-type', why: 'A crank and slider changes the TYPE of motion, not just its direction. Try again.' },
      ] });

    ui.write({ id: 'p10.q2-pendulum', label: 'Name the motion of a pendulum [1]', marks: 1, lines: 1,
      q: n(2) + '<b>Name</b> the type of motion shown by a swinging pendulum.',
      scheme: ['Oscillating (motion)'],
      model: 'Oscillating motion: the pendulum swings backwards and forwards in an arc.' });

    ui.write({ id: 'p10.q3-lever-parts', label: 'Describe fulcrum, effort and load [3]', marks: 3, lines: 4,
      q: n(3) + 'A lever has three parts: the <b>fulcrum</b>, the <b>effort</b> and the <b>load</b>. <b>Describe</b> what each one is.',
      scheme: ['Fulcrum (pivot): the fixed point that the lever turns about', 'Effort: the input force that you apply to the lever', 'Load: the output force / the thing being moved (the resistance)'],
      model: 'The fulcrum is the fixed point that the lever turns about. The effort is the input force that you apply. The load is the output force: the thing that is being moved.' });

    ui.write({ id: 'p10.q4-ma', label: 'Calculate MA: load 800 N, effort 200 N [2]', marks: 2, lines: 3,
      q: n(4) + 'A crowbar lifts a load of <b>800 N</b> using an effort of <b>200 N</b>. <b>Calculate</b> the mechanical advantage of the crowbar. Show your working.',
      scheme: ['Formula / substitution: mechanical advantage = load ÷ effort = 800 ÷ 200', 'Answer: 4 (no unit: it is a ratio)'],
      model: 'Mechanical advantage = load ÷ effort = 800 ÷ 200 = <b>4</b>. (There is no unit because it is a ratio.)' });

    ui.write({ id: 'p10.q5-moments', label: 'Calculate balancing effort: 600 N at 0.5 m, effort at 1.5 m [2]', marks: 2, lines: 3,
      q: n(5) + 'A load of <b>600 N</b> sits <b>0.5 m</b> from the fulcrum of a lever. <b>Calculate</b> the effort needed to balance it from <b>1.5 m</b> away on the other side of the fulcrum. Show your working.',
      scheme: ['Working: effort × its distance = load × its distance, so effort × 1.5 = 600 × 0.5 (= 300)', 'Answer: effort = 300 ÷ 1.5 = 200 N (with the unit)'],
      model: 'effort × distance = load × distance, so effort × 1.5 = 600 × 0.5 = 300. Effort = 300 ÷ 1.5 = <b>200 N</b>.' });

    ui.write({ id: 'p10.q6-tweezers', label: 'Explain tweezers as a third-order lever + effect on effort [2]', marks: 2, lines: 4,
      q: n(6) + 'Tweezers are a <b>third-order</b> lever. <b>Explain</b> what this means, and how it affects the effort needed.',
      scheme: ['The effort is in the middle, between the fulcrum (the joined end) and the load (the tips)', 'So the effort needed is bigger than the load / the mechanical advantage is less than 1 (in return the tips move further and faster)'],
      model: 'In a third-order lever the effort is in the middle, between the fulcrum (the joined end of the tweezers) and the load (at the tips). This means you need more effort than the load (the mechanical advantage is less than 1), but the tips move further and faster, which gives precise control.' });

    ui.write({ id: 'p10.q7-crank-slider', label: 'Describe what a crank and slider does [2]', marks: 2, lines: 3,
      q: n(7) + '<b>Describe</b> what a <b>crank and slider</b> mechanism does.',
      scheme: ['It converts rotary motion (the turning crank)…', '…into reciprocating motion (the slider going back and forth in a straight line), or the other way round'],
      model: 'A crank and slider converts rotary motion into reciprocating motion: as the crank turns, the connecting rod pushes and pulls the slider back and forth in a straight line. It also works the other way round, as in a car engine, where the reciprocating pistons turn the crankshaft.' });

    ui.box('<b>Add up your marks</b> on the questions above (out of 13). For any point you missed, read the model answer again and spot the key word, or the line of working, that you left out.', { tag: 'Self-assessment' });
  },
});
