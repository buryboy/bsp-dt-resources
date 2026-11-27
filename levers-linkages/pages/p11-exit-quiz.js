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
        k.text('motion', 290, 80, 1.3, 1.6, { size: 26, align: 'center' });
        k.text('+', 356, 80, 1.6, 1.7, { size: 26, align: 'center' });
        k.text('levers', 420, 80, 1.7, 2.0, { size: 26, align: 'center' });
        k.text('+', 484, 80, 2.0, 2.1, { size: 26, align: 'center' });
        k.text('linkages', 562, 80, 2.1, 2.5, { size: 26, align: 'center' });
        k.text('= 10 Qs', 722, 80, 2.5, 3.0, { size: 26, align: 'center' });
        k.text('admit one (brain) to the next lesson', 516, 124, 3.0, 3.8, { size: 22, color: RED, align: 'center' });
      },
      sound(k) { k.play('stroke', 0, { material: 'pen', dur: 1, gain: 0.4 }); k.play('stroke', 1.0, { material: 'pen', dur: 2.8, gain: 0.35 }); k.play('stamp', 3.9, { gain: 0.3 }); },
    });

    // options are shuffled per question id here (so the right answer is not always in the same place)
    const hash = (s) => { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h % 100000; };
    const Q = (n, label, q, options) => { const id = 'p11.q' + String(n).padStart(2, '0'); return ui.mcq({ id, label: `Q${n}: ${label}`, q: `<b style="font-family:Fredoka">${n}.</b> ${q}`, shuffle: false, options: Book.shuffle(options, hash(id) + 17) }); };

    ui.el('h2', '', 'Motion and levers');
    Q(1, 'motion of a jigsaw blade', 'The blade of a <b>jigsaw</b> moves quickly up and down to cut wood. Which answer names and describes its motion?', [
      { t: 'Reciprocating: back and forth in a straight line', ok: true, why: 'Reciprocating = backwards and forwards in a straight line, like a jigsaw blade or a sewing-machine needle.' },
      { t: 'Oscillating: back and forth in a straight line', mis: 'recip-vs-oscill', why: 'The description fits the blade, but the name is wrong. Oscillating means swinging in an ARC, like a pendulum.' },
      { t: 'Oscillating: it swings back and forth in an arc', mis: 'recip-vs-oscill', why: 'The blade does not swing in an arc: it goes up and down in a straight line. That is reciprocating.' },
      { t: 'Linear: it moves along a straight line all the time', mis: 'linear-vs-recip', why: 'Linear is a straight line in ONE direction. The blade keeps coming back, so it is reciprocating.' },
    ]);
    Q(2, 'what the fulcrum is', 'What is the <b>fulcrum</b> of a lever?', [
      { t: 'The fixed point that the lever turns about', ok: true, why: 'The fulcrum (or pivot) is the fixed point that the lever turns about.' },
      { t: 'The input force that you apply to the lever', mis: 'fulcrum-load-effort', why: 'That is the effort. The fulcrum is the fixed point that the lever turns about.' },
      { t: 'The output force, or the thing being moved', mis: 'fulcrum-load-effort', why: 'That is the load. The fulcrum is the fixed point that the lever turns about.' },
      { t: 'The point where the load rests on the lever', mis: 'fulcrum-load-effort', why: 'The load can sit anywhere along a lever. The fulcrum is the fixed point that the lever turns about.' },
    ]);
    Q(3, 'pick the third-order lever', 'Which of these is a <b>third-order</b> lever?', [
      { t: 'A fishing rod', ok: true, why: 'On a fishing rod the effort (your pulling hand) is in the middle, between the fulcrum and the fish: third order.' },
      { t: 'A wheelbarrow', mis: 'lever-order', why: 'A wheelbarrow has the LOAD in the middle (between the wheel and the handles): second order.' },
      { t: 'A nutcracker', mis: 'lever-order', why: 'A nutcracker has the LOAD (the nut) in the middle, between the hinge and your hand: second order.' },
      { t: 'A crowbar', mis: 'lever-order', why: 'A crowbar has the FULCRUM in the middle, between the effort and the load: first order.' },
    ]);

    ui.el('h2', '', 'Mechanical advantage and balance');
    Q(4, 'MA for load 900 N, effort 300 N', 'A lever lifts a load of <b>900 N</b> with an effort of <b>300 N</b>. Which answer is correct?', [
      { t: 'MA = 3, and your hand moves further than the load', ok: true, why: 'MA = load ÷ effort = 900 ÷ 300 = 3. The lever multiplies your force, but your hand has to move further than the load.' },
      { t: 'MA = 3, and your hand moves less far than the load', mis: 'ma-free-lunch', why: 'The 3 is right, but you never get something for nothing: more force means your hand moves FURTHER than the load.' },
      { t: 'MA = 0.33, and your hand moves further than the load', mis: 'ma-upside-down', why: 'That is effort ÷ load. Mechanical advantage = load ÷ effort = 900 ÷ 300 = 3.' },
      { t: 'MA = 0.33, and your hand moves less far than the load', mis: 'ma-upside-down', why: 'That is effort ÷ load. Mechanical advantage = load ÷ effort = 900 ÷ 300 = 3.' },
    ]);
    Q(5, 'MA of tongs (third order)', 'Kitchen <b>tongs</b> are third-order levers. Which statement is true?', [
      { t: 'MA is less than 1: you need more effort than the load', ok: true, why: 'Third-order levers have a mechanical advantage of less than 1, but the load moves further and faster.' },
      { t: 'MA is more than 1: you need less effort than the load', mis: 'third-order-ma', why: 'Third-order levers do not multiply force. Their mechanical advantage is less than 1.' },
      { t: 'MA is more than 1, like every lever that has a fulcrum', mis: 'third-order-ma', why: 'Not every lever multiplies force. A third-order lever has a mechanical advantage of less than 1.' },
      { t: 'The tips get both more force and more movement', mis: 'ma-free-lunch', why: 'You never get something for nothing. The tips move further, so they get LESS force.' },
    ]);
    Q(6, 'balance: 300 N at 2 m, effort at 4 m', 'A <b>300 N</b> load sits <b>2 m</b> from the fulcrum of a see-saw. What effort balances it from <b>4 m</b> away on the other side?', [
      { t: '150 N, because 150 × 4 = 300 × 2', ok: true, why: 'Effort × its distance = load × its distance: effort × 4 = 300 × 2 = 600, so effort = 150 N.' },
      { t: '300 N, because the forces must be equal', mis: 'moment-distance', why: 'Force alone does not decide balance. The MOMENTS must be equal: effort × 4 = 300 × 2, so effort = 150 N.' },
      { t: '600 N, because 300 × 2 = 600', mis: 'moment-distance', why: '600 is the moment of the load (in Nm), not the effort. Divide by the effort\'s distance: 600 ÷ 4 = 150 N.' },
      { t: 'None: both distances must be equal', mis: 'moment-distance', why: 'It can balance: further from the fulcrum, a smaller force has the same moment. Effort × 4 = 300 × 2, so effort = 150 N.' },
    ]);

    ui.el('h2', '', 'Linkages');
    Q(7, 'reverse motion linkage, central pivot', 'A <b>reverse motion</b> linkage has its fixed pivot in the <b>centre</b>. You push the input <b>2 cm to the right</b>. What does the output do?', [
      { t: 'It moves 2 cm to the left', ok: true, why: 'The output moves the opposite way. With the fixed pivot in the centre, input and output distances are equal.' },
      { t: 'It moves 2 cm to the right', mis: 'linkage-type', why: 'Same direction is what a push–pull linkage does. A reverse motion linkage sends the output the opposite way.' },
      { t: 'It moves 2 cm upwards', mis: 'linkage-type', why: 'A reverse motion linkage does not turn the motion round a corner: the output goes straight back the opposite way.' },
      { t: 'It moves 4 cm to the left', mis: 'ma-free-lunch', why: 'The direction is right, but with the pivot in the centre the distances are equal: 2 cm. Movement is not gained for free.' },
    ]);
    Q(8, 'linkage that turns motion through 90°', 'Which linkage turns a motion through <b>90°</b> (round a corner)?', [
      { t: 'Bell crank linkage', ok: true, why: 'A bell crank is an L-shaped lever on a fixed pivot at its corner. It turns the motion through 90°.' },
      { t: 'Push–pull linkage', mis: 'linkage-type', why: 'A push–pull linkage keeps the output moving in the same direction as the input.' },
      { t: 'Reverse motion linkage', mis: 'linkage-type', why: 'A reverse motion linkage sends the output in the opposite direction (180°, not 90°).' },
      { t: 'Lazy tongs linkage', mis: 'linkage-type', why: 'Lazy tongs (a scissor linkage) extend a long way from a small input. They do not turn a corner.' },
    ]);
    Q(9, 'what a crank and slider converts', 'What does a <b>crank and slider</b> convert?', [
      { t: 'Rotary motion into reciprocating motion', ok: true, why: 'A crank and slider converts rotary into reciprocating motion (or the other way round, as in a car engine).' },
      { t: 'Rotary motion into oscillating motion', mis: 'recip-vs-oscill', why: 'The slider moves in a STRAIGHT guide, so its motion is reciprocating. Oscillating is swinging in an arc.' },
      { t: 'Oscillating motion into rotary motion', mis: 'motion-conversion', why: 'That is a treadle linkage. A crank and slider converts rotary motion into reciprocating motion.' },
      { t: 'Rotary motion into linear motion', mis: 'linear-vs-recip', why: 'The slider goes back and forth, so it is reciprocating. Linear is one direction only.' },
    ]);
    Q(10, 'what a moving pivot is', 'In a linkage, what is a <b>moving pivot</b>?', [
      { t: 'It joins two bars together and moves with them', ok: true, why: 'A moving pivot joins two bars and moves with them. A fixed pivot is attached to the frame and stays put.' },
      { t: 'It is attached to the frame and does not move', mis: 'fixed-vs-moving', why: 'That is a FIXED pivot. A moving pivot joins two bars together and moves with them.' },
      { t: 'It holds one bar to the base while the bar turns', mis: 'fixed-vs-moving', why: 'A pivot on the base is a FIXED pivot. A moving pivot joins two bars together and moves with them.' },
      { t: 'It is a fixed pivot once the linkage is moving', mis: 'fixed-vs-moving', why: 'They are two different kinds of pivot. A fixed pivot never moves; a moving pivot joins two bars and travels with them.' },
    ]);

    ui.el('h2', '', 'How do you feel?');
    ui.rate({ id: 'p11.conf-levers', label: 'Confidence: levers', q: 'How confident are you with <b>levers</b> (fulcrum, effort and load; first, second and third order; mechanical advantage and balancing)?' });
    ui.rate({ id: 'p11.conf-linkages', label: 'Confidence: linkages', q: 'How confident are you with <b>linkages</b> (reverse motion, push–pull, bell crank, crank and slider, treadle; fixed and moving pivots)?' });
    ui.write({ id: 'p11.unsure', label: 'Still not sure about…', marks: 0, lines: 2,
      q: "What's one thing about motion, levers or linkages you're still not sure about?",
      scheme: ['Any honest answer'] });
  },
});
