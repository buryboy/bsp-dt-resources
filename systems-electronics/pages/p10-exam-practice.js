// Page 10 — Exam practice: AQA-style questions (Name / State / Describe / Explain) + one multiple choice. 12 marks.
Book.page({
  id: 'p10',
  title: 'Exam practice',
  build(ui) {
    const RED = Ink.RED, GREEN = Ink.GREEN;
    ui.h('Exam practice');
    ui.p('These are written like real AQA questions. Answer them, then tap <b>Check my answer</b> and tick each mark-scheme point you <b>really</b> made. Be an honest examiner! <span class="key">12 marks</span>.');

    // ---- tip box + a pen animation of a 2-mark "explain" answer (about something NOT asked below) ----
    ui.box('<b>Command words.</b> <b>Name</b> / <b>State</b> = a word or a short fact. <b>Describe</b> = say what it is or what it does. <b>Explain</b> = give a point, then say why: <b>because</b> / <b>so</b>.<br>' +
      '<span class="small">A 2-mark <b>explain</b> question wants <b>two linked parts</b>: a <b>point</b> (1 mark) and its <b>reason or result</b> (1 mark). A point on its own only earns half the marks. Watch:</span>', { tag: 'Exam tip: point + because' });
    ui.anim({
      w: 860, h: 250, duration: 9.4, poster: 1.6,
      draw(k) {
        k.text('Explain why a bike light uses an LED, not a filament lamp.  [2 marks]', 20, 40, 0.0, 1.4, { size: 23 });
        k.line([[20, 56], [830, 58]], 1.3, 1.6, { w: 1.4 });
        const L = ['An LED uses very little energy,', 'so the battery lasts longer.'], tag = ['1. POINT', '2. BECAUSE / SO'];
        const c = k.ctx; c.save(); c.font = '400 28px "Gloria Hallelujah", "Comic Sans MS", cursive';
        const ws = L.map((s) => c.measureText(s).width); c.restore();
        L.forEach((s, i) => {
          const a = 1.8 + i * 3, y = 118 + i * 66;
          k.text(s, 40, y, a, a + 1.5, { size: 28 });
          k.arrow([[590, y - 10], [Math.min(560, 40 + ws[i] + 20), y - 10]], a + 1.6, a + 2.0, { color: RED, w: 2, head: 12 });
          k.text(tag[i], 604, y, a + 1.9, a + 2.5, { size: 26, color: RED, font: 'bubble' });
        });
        if (k.t >= 7.6) Ink.tick(k.ctx, 560, 226, 1.0, GREEN);
        if (k.t >= 8.0) Ink.tick(k.ctx, 596, 226, 1.0, GREEN);
        k.text('point + because = both marks', 40, 232, 8.0, 9.2, { size: 22 });
      },
      sound(k) {
        k.bed('room', 0, 9.4, { gain: 0.3 });
        k.play('stroke', 0, { material: 'pen', dur: 1.4, gain: 0.4 });
        [1.8, 4.8].forEach((a) => { k.play('stroke', a, { material: 'pen', dur: 1.5, gain: 0.45 }); k.play('stroke', a + 1.6, { material: 'pen', dur: 0.9, gain: 0.4 }); });
        k.play('success', 7.6, { f: 'G5', gain: 0.35 });
        k.play('stroke', 8.0, { material: 'pen', dur: 1.2, gain: 0.35 });
      },
    });

    const n = (i) => `<b style="font-family:Fredoka">${i}.</b> `;

    ui.mcq({ id: 'p10.q1-mcq', label: 'MCQ: switch closed by a magnet [1]', shuffle: false,
      q: '<span class="marks">[1 mark]</span>' + n(1) + 'Which switch is closed by a <b>magnet</b> coming near it?',
      options: [
        { t: 'A   Tilt switch', mis: 'switch-type', why: 'A tilt switch turns on or off when it is tilted. No magnet is involved. Try again.' },
        { t: 'B   Micro switch', mis: 'switch-type', why: 'A micro switch is worked by a tiny movement or force, often through a lever. Try again.' },
        { t: 'C   Reed switch', ok: true, why: 'A reed switch is closed by a magnet coming near. It is used in door and window alarm sensors and bike speedometers.' },
        { t: 'D   Toggle switch', mis: 'switch-type', why: 'A toggle switch stays in the position you leave it, like a light switch. Try again.' },
      ] });

    ui.write({ id: 'p10.q2-light', label: 'Name the input device that detects light level [1]', marks: 1, lines: 1,
      q: n(2) + '<b>Name</b> the input device that detects changes in <b>light level</b>.',
      scheme: ['LDR / light-dependent resistor (light sensor)'],
      model: 'An LDR (light-dependent resistor).' });

    ui.write({ id: 'p10.q3-thermistor', label: 'State how thermistor resistance changes as it gets hotter [1]', marks: 1, lines: 1,
      q: n(3) + '<b>State</b> what happens to the <b>resistance</b> of a thermistor as it gets <b>hotter</b>.',
      scheme: ['The resistance decreases / gets lower / falls'],
      model: 'Its resistance gets lower (hotter → lower resistance; colder → higher resistance).' });

    ui.p('<span class="small">Question 4 is about this block diagram. The three boxes are empty: you fill them in with your answer.</span>');
    ui.anim({
      w: 860, h: 196, duration: 4.4, poster: 4.4,
      draw(k) {
        ['INPUT', 'PROCESS', 'OUTPUT'].forEach((s, i) => {
          const x = 70 + i * 270, a = i * 1.3;
          k.box(x, 22, 180, 70, a, a + 0.6, { w: 2.8 });
          k.text('?', x + 90, 70, a + 0.5, a + 0.7, { size: 34, align: 'center' });
          k.text(s, x + 90, 134, a + 0.6, a + 1.0, { size: 24, color: RED, font: 'bubble', align: 'center' });
          if (i < 2) k.arrow([[x + 192, 57], [x + 262, 57]], a + 1.0, a + 1.3, { w: 2.6, head: 14 });
        });
      },
      sound(k) { [0, 1.3, 2.6].forEach((a) => k.play('stroke', a, { material: 'pen', dur: 1.0, gain: 0.4 })); },
    });
    ui.write({ id: 'p10.q4-block', label: 'Complete the block diagram for a doorbell (input, process, output) [3]', marks: 3, lines: 5,
      q: n(4) + 'A doorbell sounds for <b>3 seconds</b> when a visitor presses it. <b>Complete</b> the block diagram: for each block, <b>name the part</b> and <b>describe its job</b>.',
      scheme: ['Input: a push-to-make switch (push switch / button) that sends a signal when the visitor presses it', 'Process: a microcontroller working as a timer, which keeps the output on for 3 seconds', 'Output: a buzzer (or speaker) that turns the signal into sound'],
      model: '<b>Input:</b> a push-to-make switch, which sends a signal when the visitor presses it. <b>Process:</b> a microcontroller working as a timer, which keeps the output on for 3 seconds. <b>Output:</b> a buzzer, which turns the electrical signal into sound.' });

    ui.write({ id: 'p10.q5-micro', label: 'Explain one advantage of using a microcontroller [2]', marks: 2, lines: 4,
      q: n(5) + '<b>Explain one</b> advantage of using a <b>microcontroller</b> in a product instead of a circuit made from separate components.',
      scheme: ['Point: it can be reprogrammed / one chip replaces many components / it can handle many inputs and outputs at once', 'Because / so: what the product does can be changed or improved without rebuilding it / the product is smaller, cheaper to assemble and more reliable'],
      model: 'A microcontroller can be <b>reprogrammed</b>, so the designer can change or improve what the product does <b>without rebuilding the circuit</b>. (Or: one chip replaces many separate components, so the product is smaller, cheaper to assemble and more reliable.)' });

    ui.write({ id: 'p10.q6-sound', label: 'Describe the difference between a buzzer and a speaker [2]', marks: 2, lines: 4,
      q: n(6) + '<b>Describe</b> the difference between a <b>buzzer</b> and a <b>speaker</b>.',
      scheme: ['A buzzer makes one fixed sound / tone when it is switched on (it just needs power)', 'A speaker can play a range of sounds, e.g. tunes, speech or music (it needs a changing signal)'],
      model: 'A buzzer makes <b>one fixed tone</b> when it is switched on: it just needs power. A speaker can play a <b>range of sounds</b>, such as tunes, speech and music, but it needs a changing signal from the microcontroller.' });

    // ---- a drawn flowchart to read ----
    ui.p('<span class="small">Question 7 is about this flowchart. Follow the arrows carefully, including the two that go <b>back</b>.</span>');
    ui.anim({
      w: 860, h: 370, duration: 14, poster: 14,
      draw(k) {
        const T = (s, x, y, a) => k.text(s, x, y, a, a + 0.5, { size: 22, align: 'center' });
        k.box(30, 84, 110, 52, 0, 0.6, { w: 2.6, radius: 26 }); T('START', 85, 118, 0.5);
        k.arrow([[142, 110], [198, 110]], 1.0, 1.4, { w: 2.4, head: 13 });
        k.line([[200, 110], [310, 44], [420, 110], [310, 176], [200, 110]], 1.4, 2.2, { w: 2.6 });
        T('Button', 310, 106, 2.1); T('pressed?', 310, 134, 2.4);
        k.arrow([[422, 110], [498, 110]], 3.0, 3.4, { w: 2.4, head: 13 }); k.text('Yes', 460, 100, 3.3, 3.6, { size: 22, align: 'center', color: RED });
        k.box(500, 82, 190, 56, 3.6, 4.3, { w: 2.6, radius: 3 }); T('Add 1 to count', 595, 118, 4.2);
        k.arrow([[595, 140], [595, 204]], 4.8, 5.2, { w: 2.4, head: 13 });
        k.line([[485, 272], [595, 206], [705, 272], [595, 338], [485, 272]], 5.2, 6.0, { w: 2.6 });
        T('Count', 595, 268, 5.9); T('= 10?', 595, 296, 6.2);
        k.arrow([[483, 272], [424, 272]], 6.8, 7.2, { w: 2.4, head: 13 }); k.text('Yes', 454, 262, 7.1, 7.4, { size: 22, align: 'center', color: RED });
        k.line([[256, 244], [420, 244], [404, 300], [240, 300], [256, 244]], 7.4, 8.2, { w: 2.6 }); T('Buzzer ON', 330, 280, 8.1);
        k.arrow([[246, 272], [164, 272]], 8.7, 9.1, { w: 2.4, head: 13 });
        k.box(50, 246, 110, 52, 9.1, 9.7, { w: 2.6, radius: 26 }); T('STOP', 105, 280, 9.6);
        // the two "No" loops back to just before the first question
        k.arrow([[310, 178], [310, 204], [182, 204], [182, 117]], 10.2, 11.2, { w: 2.4, head: 13 }); k.text('No', 330, 202, 11.1, 11.4, { size: 22, align: 'center', color: RED });
        k.arrow([[707, 272], [800, 272], [800, 22], [160, 22], [160, 103]], 11.6, 13.2, { w: 2.4, head: 13 }); k.text('No', 752, 262, 13.1, 13.4, { size: 22, align: 'center', color: RED });
      },
      sound(k) {
        k.bed('room', 0, 14, { gain: 0.3 });
        [0, 1.4, 3.6, 5.2, 7.4, 9.1].forEach((a) => k.play('stroke', a, { material: 'pen', dur: 0.9, gain: 0.4 }));
        k.play('stroke', 10.2, { material: 'pen', dur: 1.0, gain: 0.4 }); k.play('stroke', 11.6, { material: 'pen', dur: 1.6, gain: 0.4 });
      },
    });
    ui.write({ id: 'p10.q7-flow', label: 'Describe what the drawn counter flowchart does [2]', marks: 2, lines: 4,
      q: n(7) + 'The flowchart above is the program in a microcontroller. <b>Describe</b> what the program does.',
      scheme: ['It keeps checking the button and adds 1 to the count each time it is pressed / it counts the button presses', 'When the count reaches 10 the buzzer is switched on (and the program stops)'],
      model: 'The program keeps checking whether the button is pressed. Each time it is pressed, it <b>adds 1 to the count</b>, then goes back to check again. When the <b>count reaches 10</b>, it switches the <b>buzzer on</b> and stops.' });

    ui.box('<b>Add up your marks</b> on the questions above (out of 12). For any point you missed, read the model answer again and spot the key word, or the "because", that you left out.', { tag: 'Self-assessment' });
  },
});
