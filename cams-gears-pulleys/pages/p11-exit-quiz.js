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
        k.text('cams', 282, 80, 1.3, 1.6, { size: 26, align: 'center' });
        k.text('+', 344, 80, 1.6, 1.7, { size: 26, align: 'center' });
        k.text('gears', 410, 80, 1.7, 2.0, { size: 26, align: 'center' });
        k.text('+', 476, 80, 2.0, 2.1, { size: 26, align: 'center' });
        k.text('pulleys', 556, 80, 2.1, 2.5, { size: 26, align: 'center' });
        k.text('= 10 Qs', 722, 80, 2.5, 3.0, { size: 26, align: 'center' });
        k.text('admit one (brain) to the next lesson', 516, 124, 3.0, 3.8, { size: 22, color: RED, align: 'center' });
      },
      sound(k) { k.play('stroke', 0, { material: 'pen', dur: 1, gain: 0.4 }); k.play('stroke', 1.0, { material: 'pen', dur: 2.8, gain: 0.35 }); k.play('stamp', 3.9, { gain: 0.3 }); },
    });

    // options are shuffled per question id here (so the right answer is not always in the same place)
    const hash = (s) => { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h % 100000; };
    const Q = (n, label, q, options) => { const id = 'p11.q' + String(n).padStart(2, '0'); return ui.mcq({ id, label: `Q${n}: ${label}`, q: `<b style="font-family:Fredoka">${n}.</b> ${q}`, shuffle: false, options: Book.shuffle(options, hash(id) + 17) }); };

    ui.el('h2', '', 'Cams and followers');
    Q(1, 'what a cam and follower converts', 'What does a <b>cam and follower</b> change?', [
      { t: 'Rotary motion into reciprocating motion', ok: true, why: 'The cam turns (rotary) and the follower goes up and down in a straight line (reciprocating).' },
      { t: 'Rotary motion into oscillating motion', mis: 'cam-motion', why: 'Oscillating is swinging in an arc. The follower is held in a guide, so it goes up and down in a straight line: reciprocating.' },
      { t: 'Reciprocating motion into rotary motion', mis: 'cam-motion', why: 'That is the wrong way round. The cam is the input: a follower cannot drive its cam.' },
      { t: 'Rotary motion into faster rotary motion', mis: 'cam-motion', why: 'The follower does not rotate. It is held in a guide and goes up and down in a straight line: reciprocating.' },
    ]);
    Q(2, 'what dwell means', 'What happens during the <b>dwell</b> of a cam?', [
      { t: 'The follower stays still while the cam turns', ok: true, why: 'Dwell = the follower stays still even though the cam is still turning.' },
      { t: 'The cam stops turning while the follower moves', mis: 'dwell-meaning', why: 'The cam never stops. During the dwell it keeps turning, and it is the FOLLOWER that stays still.' },
      { t: 'The follower moves down towards the cam shaft', mis: 'dwell-meaning', why: 'Moving down is the fall. During the dwell the follower stays still while the cam turns.' },
      { t: 'The follower moves from its lowest to its highest', mis: 'dwell-meaning', why: 'Moving up is the rise (how far it moves is the stroke). During the dwell the follower stays still.' },
    ]);
    Q(3, 'cam that rises slowly then drops suddenly', 'A follower <b>rises slowly and steadily</b>, then <b>drops suddenly</b>. Which cam is it on?', [
      { t: 'A snail cam', ok: true, why: 'A snail (drop) cam is a spiral: a slow, steady rise, then a sudden drop off the step.' },
      { t: 'A pear cam', mis: 'cam-shape', why: 'On a pear cam the follower dwells for about half the turn, then rises and falls smoothly. There is no sudden drop.' },
      { t: 'An eccentric cam', mis: 'cam-shape', why: 'On an eccentric cam the follower rises and falls smoothly all the time. There is no sudden drop.' },
      { t: 'A heart cam', mis: 'cam-shape', why: 'On a heart-shaped cam the follower rises and falls at a constant speed. There is no sudden drop.' },
    ]);
    Q(4, 'follower with least friction and wear', 'Which follower has the <b>least friction and wear</b> and runs smoothly at speed?', [
      { t: 'A roller follower', ok: true, why: 'A roller follower has a small wheel, so it has the least friction and wear. It costs more and is more complex.' },
      { t: 'A knife follower', mis: 'follower-type', why: 'A knife (point) follower follows the cam shape most accurately, but its point wears quickly.' },
      { t: 'A flat follower', mis: 'follower-type', why: 'A flat follower copes with side load, but it has more friction than the others.' },
    ]);

    ui.el('h2', '', 'Gears');
    Q(5, 'driver–idler–driven: direction and ratio', 'Three gears mesh in a row: <b>driver, idler, driven</b>. The driver turns <b>clockwise</b>. What is true of the driven gear?', [
      { t: 'Clockwise: the idler does not change the ratio', ok: true, why: 'An idler makes the driven gear turn the same way as the driver. It does not change the gear ratio or the speed.' },
      { t: 'Anticlockwise: the idler does not change the ratio', mis: 'idler-ratio', why: 'Right about the ratio, but the idler restores the direction: driver clockwise, idler anticlockwise, driven clockwise.' },
      { t: 'Clockwise: the idler makes it turn more slowly', mis: 'idler-ratio', why: 'The direction is right, but an idler never changes the speed or the gear ratio.' },
      { t: 'Anticlockwise: the idler makes it turn more slowly', mis: 'idler-ratio,gear-direction', why: 'Each meshed pair reverses, so the driven gear ends up clockwise again. And an idler never changes the speed or the ratio.' },
    ]);
    Q(6, 'gear ratio: driver 15 teeth, driven 60 teeth', 'A <b>driver</b> gear with <b>15 teeth</b> meshes with a <b>driven</b> gear with <b>60 teeth</b>. Which answer is correct?', [
      { t: 'Ratio 4:1, and the driven gear turns slower', ok: true, why: 'Gear ratio = driven ÷ driver = 60 ÷ 15 = 4, so 4:1. The driver turns 4 times for each turn of the bigger driven gear.' },
      { t: 'Ratio 4:1, and the driven gear turns faster', mis: 'big-is-fast', why: 'The 4:1 is right, but a bigger driven gear turns SLOWER: the driver turns 4 times for each turn of the driven gear.' },
      { t: 'Ratio 1:4, and the driven gear turns slower', mis: 'ratio-upside-down', why: 'That is driver ÷ driven. Gear ratio = driven ÷ driver = 60 ÷ 15 = 4, so 4:1.' },
      { t: 'Ratio 1:4, and the driven gear turns faster', mis: 'ratio-upside-down,big-is-fast', why: 'That is driver ÷ driven. Gear ratio = driven ÷ driver = 60 ÷ 15 = 4, so 4:1, and the bigger driven gear turns slower.' },
    ]);

    ui.el('h2', '', 'Pulleys and belts');
    Q(7, 'belt that reverses the direction', 'A motor pulley turns <b>clockwise</b>. Which belt makes the driven pulley turn <b>anticlockwise</b>?', [
      { t: 'A crossed belt, in a figure of 8', ok: true, why: 'A crossed belt (figure of 8) makes the two pulleys turn in opposite directions.' },
      { t: 'A plain belt that is not crossed', mis: 'belt-direction', why: 'With an open (uncrossed) belt both pulleys turn the SAME way. Only a crossed belt reverses the direction.' },
      { t: 'A toothed belt that is not crossed', mis: 'belt-direction', why: 'Teeth stop a belt slipping, but they do not change the direction. Only a crossed belt reverses it.' },
      { t: 'Any belt: pulleys always reverse', mis: 'belt-direction', why: 'That is gears: two meshed gears turn opposite ways. Pulleys on an open belt turn the same way.' },
    ]);
    Q(8, 'belt output speed: 50 mm at 1200 rpm → 150 mm', 'A <b>50 mm</b> motor pulley turns at <b>1200 rpm</b>. A belt links it to a <b>150 mm</b> driven pulley. What is true of the driven pulley?', [
      { t: '400 rpm, with more torque than the motor', ok: true, why: 'Velocity ratio = 150 ÷ 50 = 3. Output speed = 1200 ÷ 3 = 400 rpm. Slower output = more torque.' },
      { t: '400 rpm, with less torque than the motor', mis: 'speed-torque', why: 'The speed is right (1200 ÷ 3 = 400 rpm), but speed is traded for torque: a slower output has MORE torque.' },
      { t: '3600 rpm, with more torque than the motor', mis: 'speed-multiply,speed-torque', why: 'Divide by the velocity ratio, do not multiply: 1200 ÷ 3 = 400 rpm. And you can never gain speed AND torque.' },
      { t: '3600 rpm, with less torque than the motor', mis: 'speed-multiply,big-is-fast', why: 'Divide by the velocity ratio, do not multiply: 1200 ÷ 3 = 400 rpm. A bigger driven pulley turns slower, with more torque.' },
    ]);
    Q(9, 'belt slip when a drill jams', 'A pillar drill <b>jams</b> and its plain belt <b>slips</b>. Which statement is true?', [
      { t: 'The slip protects the motor from burning out', ok: true, why: 'Belts work by friction, so they can slip. That is useful: the belt slips instead of the motor burning out.' },
      { t: 'The slip shows that the belt drive has broken', mis: 'belt-slip', why: 'Slip is not always bad. Here it is useful protection: the belt slips instead of the motor burning out.' },
      { t: 'A gear train would have slipped in the same way', mis: 'belt-slip', why: 'Gears never slip: their teeth mesh. Only a friction drive like a plain belt can slip.' },
      { t: 'A toothed belt would have slipped just as easily', mis: 'belt-slip', why: 'A toothed belt on toothed pulleys cannot slip. Only a plain belt, which works by friction, can slip.' },
    ]);
    Q(10, 'single fixed pulley: effort and load', 'A bucket is lifted with a <b>single fixed pulley</b>. Which statement is true?', [
      { t: 'Effort equals load: only the direction changes', ok: true, why: 'A single fixed pulley only changes the direction of the force: you pull down to lift up. Effort = load (MA = 1).' },
      { t: 'Effort is half the load: the pulley shares it', mis: 'pulley-lift', why: 'A single fixed pulley does not reduce the effort. It takes a MOVING pulley, with two ropes holding the load, to halve it.' },
      { t: 'Effort is half the load, with twice the rope', mis: 'pulley-lift', why: 'That describes one MOVING pulley. A single fixed pulley only changes the direction: effort = load.' },
      { t: 'Effort is double the load: the rope adds drag', mis: 'pulley-lift', why: 'A single fixed pulley does not change the size of the force at all. It only changes its direction: effort = load.' },
    ]);

    ui.el('h2', '', 'How do you feel?');
    ui.rate({ id: 'p11.conf-cams', label: 'Confidence: cams and followers', q: 'How confident are you with <b>cams and followers</b> (rise, fall, dwell and stroke; eccentric, pear and snail cams; flat, knife and roller followers)?' });
    ui.rate({ id: 'p11.conf-gears', label: 'Confidence: gears', q: 'How confident are you with <b>gears</b> (driver and driven; direction and idlers; gear ratio and output speed; speed and torque)?' });
    ui.rate({ id: 'p11.conf-pulleys', label: 'Confidence: pulleys and belts', q: 'How confident are you with <b>pulleys and belts</b> (direction; velocity ratio; slip and toothed belts; belts or gears; lifting pulleys)?' });
    ui.write({ id: 'p11.unsure', label: 'Still not sure about…', marks: 0, lines: 2,
      q: "What's one thing about cams, gears or pulleys you're still not sure about?",
      scheme: ['Any honest answer'] });
  },
});
