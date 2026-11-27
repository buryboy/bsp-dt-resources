// Page 10 — Exam practice: AQA-style questions (State / Describe / Calculate / Explain / Give) + one multiple choice. 14 marks.
Book.page({
  id: 'p10',
  title: 'Exam practice',
  build(ui) {
    const RED = Ink.RED, GREEN = Ink.GREEN;
    ui.h('Exam practice');
    ui.p('These are written like real AQA questions. Answer them, then tap <b>Check my answer</b> and tick each mark-scheme point you <b>really</b> made. Be an honest examiner! <span class="key">14 marks</span>.');

    // ---- tip box + a pen animation of a calculation set out for full marks (about something NOT asked below) ----
    ui.box('<b>Command words.</b> <b>State</b> / <b>Give</b> = a word or a short fact. <b>Describe</b> = say what happens. <b>Explain</b> = give a point, then <b>because</b> / <b>so</b>. <b>Calculate</b> = work out a number.<br>' +
      '<span class="small">For a <b>calculate</b> question, always <b>show your working</b>: write the <b>formula</b>, <b>substitute</b> the numbers, then give the <b>answer</b> with its <b>unit</b>. A <b>ratio has no unit</b>; a <b>speed</b> is in <b>rpm</b>. Working can earn a mark even if you slip up. Watch this one from last lesson:</span>', { tag: 'Exam tip: show your working' });
    ui.anim({
      w: 860, h: 320, duration: 11.6, poster: 1.6,
      draw(k) {
        k.text('A lever lifts a 1000 N load with a 200 N effort.', 20, 34, 0.0, 0.8, { size: 23 });
        k.text('Calculate its mechanical advantage.  [2 marks]', 20, 66, 0.7, 1.4, { size: 23 });
        k.line([[20, 80], [820, 82]], 1.3, 1.6, { w: 1.4 });
        const L = ['MA = load ÷ effort', '= 1000 ÷ 200', '= 5'], tag = ['1. FORMULA', '2. SUBSTITUTE', '3. ANSWER + UNIT?'];
        const c = k.ctx; c.save(); c.font = '400 28px "Gloria Hallelujah", "Comic Sans MS", cursive';
        const eq = c.measureText('MA ').width; const ws = L.map((s) => c.measureText(s).width); c.restore();
        L.forEach((s, i) => {
          const a = 1.8 + i * 2.7, y = 126 + i * 56, x = i ? 40 + eq : 40;
          k.text(s, x, y, a, a + 1.2, { size: 28 });
          k.arrow([[510, y - 10], [x + ws[i] + 24, y - 10]], a + 1.3, a + 1.7, { color: RED, w: 2, head: 12 });
          k.text(tag[i], 526, y, a + 1.6, a + 2.1, { size: 26, color: RED, font: 'bubble' });
        });
        if (k.t >= 9.4) { const u = 40 + eq + ws[2]; k.line(k.ellipse(u - 9, 228, 22, 22), 9.4, 9.9, { color: RED, w: 2.2 }); }
        if (k.t >= 10) Ink.tick(k.ctx, 816, 232, 1.1, GREEN);
        k.text('(no unit this time: mechanical advantage is a ratio)', 40, 296, 10.2, 11.4, { size: 22 });
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

    ui.mcq({ id: 'p10.q1-mcq', label: 'MCQ: effort with one moving pulley, 400 N load [1]', shuffle: false,
      q: '<span class="marks">[1 mark]</span>' + n(1) + 'A <b>400 N</b> load hangs from <b>one moving pulley</b>, so two ropes hold the load. What effort is needed to lift it?',
      options: [
        { t: 'A   100 N', mis: 'pulley-lift', why: 'One moving pulley has two ropes holding the load, so it halves the effort (it does not quarter it). Try again.' },
        { t: 'B   200 N', ok: true, why: 'One moving pulley halves the effort: 400 ÷ 2 = 200 N (MA = 2). In return you pull twice as much rope.' },
        { t: 'C   400 N', mis: 'pulley-lift', why: 'Effort = load is true for a single FIXED pulley, which only changes direction. A moving pulley does more. Try again.' },
        { t: 'D   800 N', mis: 'pulley-lift', why: 'A lifting pulley never makes the job harder. Two ropes share the load here. Try again.' },
      ] });

    ui.write({ id: 'p10.q2-follower', label: 'State the motion of a cam follower [1]', marks: 1, lines: 1,
      q: n(2) + 'A cam turns on a shaft. <b>State</b> the type of motion made by its <b>follower</b>.',
      scheme: ['Reciprocating (motion)'],
      model: 'Reciprocating motion: the follower moves up and down in a straight line.' });

    ui.write({ id: 'p10.q3-pear', label: 'Describe the follower on a pear cam for one turn [2]', marks: 2, lines: 3,
      q: n(3) + '<b>Describe</b> the movement of the follower on a <b>pear cam</b> during one full turn of the cam.',
      scheme: ['The follower stays still (dwells) for about half of the turn', 'Then it rises and falls (smoothly) during the rest of the turn'],
      model: 'For about half of the turn the follower stays still (this is the dwell). During the other half it rises smoothly and then falls smoothly back to where it started.' });

    ui.write({ id: 'p10.q4-ratio', label: 'Calculate gear ratio: driver 12 teeth, driven 48 teeth [2]', marks: 2, lines: 3,
      q: n(4) + 'A <b>driver</b> gear with <b>12 teeth</b> meshes with a <b>driven</b> gear with <b>48 teeth</b>. <b>Calculate</b> the gear ratio. Show your working.',
      scheme: ['Formula / substitution: gear ratio = teeth on driven ÷ teeth on driver = 48 ÷ 12', 'Answer: 4 (written 4:1; no unit because it is a ratio)'],
      model: 'Gear ratio = teeth on driven gear ÷ teeth on driver gear = 48 ÷ 12 = 4, written <b>4:1</b>. (There is no unit because it is a ratio.)' });

    ui.write({ id: 'p10.q5-speed', label: 'Calculate output speed: Q4 gear train, input 600 rpm [2]', marks: 2, lines: 3,
      q: n(5) + 'The driver gear in question 4 turns at <b>600 rpm</b>. Use <b>your</b> gear ratio to <b>calculate</b> the speed of the driven gear. Show your working.',
      scheme: ['Formula / substitution: output speed = input speed ÷ gear ratio = 600 ÷ 4', 'Answer: 150 rpm (with the unit)'],
      model: 'Output speed = input speed ÷ gear ratio = 600 ÷ 4 = <b>150 rpm</b>.' });

    ui.write({ id: 'p10.q6-idler', label: 'Explain why an idler gear is used [2]', marks: 2, lines: 4,
      q: n(6) + '<b>Explain</b> why an <b>idler gear</b> is sometimes put between a driver gear and a driven gear.',
      scheme: ['Two gears that mesh turn in opposite directions', 'The idler makes the driven gear turn in the same direction as the driver (without changing the gear ratio or the speed)'],
      model: 'Two meshed gears turn in opposite directions. Putting an idler gear between them makes the driven gear turn in the <b>same direction</b> as the driver. The idler does not change the gear ratio or the output speed.' });

    ui.write({ id: 'p10.q7-belt', label: 'Calculate belt output speed: 60 mm driver at 1200 rpm, 180 mm driven [2]', marks: 2, lines: 4,
      q: n(7) + 'A motor pulley of diameter <b>60 mm</b> turns at <b>1200 rpm</b>. A belt links it to a driven pulley of diameter <b>180 mm</b>. <b>Calculate</b> the speed of the driven pulley. Show your working.',
      scheme: ['Working: velocity ratio = driven diameter ÷ driver diameter = 180 ÷ 60 = 3 (or 1200 × 60 ÷ 180)', 'Answer: output speed = 1200 ÷ 3 = 400 rpm (with the unit)'],
      model: 'Velocity ratio = diameter of driven pulley ÷ diameter of driver pulley = 180 ÷ 60 = 3. Output speed = input speed ÷ velocity ratio = 1200 ÷ 3 = <b>400 rpm</b>.' });

    ui.write({ id: 'p10.q8-belt-vs-gears', label: 'Give one advantage and one disadvantage of a belt drive vs gears [2]', marks: 2, lines: 4,
      q: n(8) + '<b>Give</b> one <b>advantage</b> and one <b>disadvantage</b> of a belt drive compared with gears.',
      scheme: ['Advantage (any one): quieter / cheaper / needs no lubrication / can link shafts that are far apart / absorbs shock / can slip to protect the motor if the machine jams', 'Disadvantage (any one): the belt can slip, so the drive is not exact / the belt can stretch / the belt wears'],
      model: 'Advantage: a belt drive is quieter than gears (it is also cheaper, needs no lubrication and can link shafts that are far apart). Disadvantage: a belt can slip, so the ratio is not exact (belts also stretch and wear).' });

    ui.box('<b>Add up your marks</b> on the questions above (out of 14). For any point you missed, read the model answer again and spot the key word, or the line of working, that you left out.', { tag: 'Self-assessment' });
  },
});
