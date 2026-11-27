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
        k.text('input', 280, 80, 1.3, 1.6, { size: 26, align: 'center' });
        k.arrow([[326, 72], [366, 72]], 1.6, 1.7, { w: 2.2, head: 11 });
        k.text('process', 434, 80, 1.7, 2.0, { size: 26, align: 'center' });
        k.arrow([[500, 72], [540, 72]], 2.0, 2.1, { w: 2.2, head: 11 });
        k.text('output', 596, 80, 2.1, 2.5, { size: 26, align: 'center' });
        k.text('= 10 Qs', 738, 80, 2.5, 3.0, { size: 26, align: 'center' });
        k.text('admit one (brain) to the next lesson', 516, 124, 3.0, 3.8, { size: 22, color: RED, align: 'center' });
      },
      sound(k) { k.play('stroke', 0, { material: 'pen', dur: 1, gain: 0.4 }); k.play('stroke', 1.0, { material: 'pen', dur: 2.8, gain: 0.35 }); k.play('stamp', 3.9, { gain: 0.3 }); },
    });

    // options are shuffled per question id here (so the right answer is not always in the same place)
    const hash = (s) => { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h % 100000; };
    const Q = (n, label, q, options) => { const id = 'p11.q' + String(n).padStart(2, '0'); return ui.mcq({ id, label: `Q${n}: ${label}`, q: `<b style="font-family:Fredoka">${n}.</b> ${q}`, shuffle: false, options: Book.shuffle(options, hash(id) + 17) }); };

    ui.el('h2', '', 'Systems and inputs');
    Q(1, 'order of the three blocks', 'Which shows the three blocks of a system in the <b>correct order</b>?', [
      { t: 'Input → process → output', ok: true, why: 'The input senses a change, the process decides what to do, and the output does something we can see, hear or use.' },
      { t: 'Process → input → output', mis: 'ipo-order', why: 'The process block cannot decide anything until a signal arrives from the input. Input comes first.' },
      { t: 'Input → output → process', mis: 'ipo-order', why: 'The output comes last: it acts on what the process block has decided.' },
      { t: 'Output → process → input', mis: 'ipo-order', why: 'That is backwards. Signals flow from the input, through the process, to the output.' },
    ]);
    Q(2, 'what a block diagram shows', 'What does a <b>block diagram</b> of a system show?', [
      { t: 'What each part does, joined by signal arrows', ok: true, why: 'A block diagram shows WHAT each part does, as boxes joined by arrows. The arrows are signals.' },
      { t: 'How each component is wired to the battery', mis: 'block-vs-circuit', why: 'That is a circuit diagram. A block diagram shows what each part does, not how it is wired.' },
      { t: 'Where each component sits on the circuit board', mis: 'block-vs-circuit', why: 'A block diagram is not a layout or a wiring plan. It shows what each part does.' },
      { t: 'Which component symbols the circuit will use', mis: 'block-vs-circuit', why: 'Component symbols belong on a circuit diagram. A block diagram uses plain boxes and arrows.' },
    ]);
    Q(3, 'how a push-to-make switch behaves', 'You press a <b>push-to-make</b> switch, then let go. What does its circuit do?', [
      { t: 'ON while you press, OFF when you let go', ok: true, why: 'A push-to-make switch is ON only while it is pressed, like a doorbell button.' },
      { t: 'OFF while you press, ON when you let go', mis: 'switch-type', why: 'That is a push-to-BREAK switch, like the one for a fridge door light.' },
      { t: 'ON when you press, and ON after you let go', mis: 'switch-type', why: 'Staying where you leave it is what a toggle switch does. A push-to-make switch springs back to OFF.' },
      { t: 'ON only if you tip the switch on its side', mis: 'switch-type', why: 'That is a tilt switch. A push-to-make switch is ON only while it is pressed.' },
    ]);
    Q(4, 'LDR resistance in the dark', 'It gets <b>dark</b> outside. What happens to the resistance of an <b>LDR</b>?', [
      { t: 'It goes up: dark means high resistance', ok: true, why: 'Dark → HIGH resistance. Brighter light → LOWER resistance.' },
      { t: 'It goes down: dark means low resistance', mis: 'ldr-backwards', why: 'It is the other way round. Bright light gives LOW resistance, so dark gives HIGH resistance.' },
      { t: 'It stays the same: only heat changes it', mis: 'sensor-mixup', why: 'Heat changes a thermistor. An LDR is the LIGHT sensor: dark gives high resistance.' },
      { t: 'It stays the same: only force changes it', mis: 'sensor-mixup', why: 'Force changes a pressure sensor. An LDR is the LIGHT sensor: dark gives high resistance.' },
    ]);
    Q(5, 'sensor for a thermometer + its rule', 'Which sensor suits a <b>digital thermometer</b>, and how does it behave?', [
      { t: 'Thermistor: resistance falls as it gets hotter', ok: true, why: 'A thermistor is the temperature sensor. Hotter → LOWER resistance; colder → HIGHER resistance.' },
      { t: 'Thermistor: resistance rises as it gets hotter', mis: 'thermistor-backwards', why: 'The sensor is right but the rule is backwards. Hotter → LOWER resistance.' },
      { t: 'LDR: its resistance falls as it gets hotter', mis: 'sensor-mixup', why: 'An LDR responds to light, not heat. The temperature sensor is the thermistor.' },
      { t: 'LDR: its resistance rises as it gets hotter', mis: 'sensor-mixup', why: 'An LDR responds to light, not heat. The temperature sensor is the thermistor.' },
    ]);

    ui.el('h2', '', 'The microcontroller and flowcharts');
    Q(6, 'microcontroller job in a pedometer', 'A <b>pedometer</b> adds 1 every time you take a step. Which microcontroller job is this?', [
      { t: 'Counter', ok: true, why: 'A counter counts signals or events: steps, laps, people through a door.' },
      { t: 'Timer', mis: 'timer-counter-decision', why: 'A timer waits, or keeps something on, for a set time. Adding 1 for each step is counting.' },
      { t: 'Decision-maker', mis: 'timer-counter-decision', why: 'A decision-maker compares an input with a set value and chooses. Adding 1 for each step is counting.' },
      { t: 'Sensor', mis: 'process-role', why: 'A sensor is an INPUT device: it detects the step. The microcontroller then counts the signals.' },
    ]);
    Q(7, 'advantage of a microcontroller', 'Why might a designer choose a <b>microcontroller</b> instead of many separate components?', [
      { t: 'It can be reprogrammed to change what the product does', ok: true, why: 'A microcontroller is programmable: the product can be changed or improved without rebuilding the circuit.' },
      { t: 'It works without a program, so it is quicker to set up', mis: 'micro-fixed', why: 'A microcontroller does nothing until it is programmed. Being programmable is its big advantage.' },
      { t: 'It is fixed at the factory, so nobody can ever change it', mis: 'micro-fixed', why: 'It is the opposite: a microcontroller can be reprogrammed again and again.' },
      { t: 'It supplies the power, so the product needs no battery', mis: 'micro-fixed', why: 'A microcontroller is a small computer on a chip, not a battery. The system still needs a power supply.' },
    ]);
    Q(8, 'flowchart symbol for a yes/no question', 'Which flowchart symbol is used for a <b>yes/no question</b> such as "Is it dark?"', [
      { t: 'A diamond', ok: true, why: 'A decision is drawn as a diamond. It has two exits, labelled Yes and No.' },
      { t: 'A rectangle', mis: 'flow-symbol', why: 'A rectangle is a process: do something, such as "wait 5 seconds". A question needs two exits.' },
      { t: 'A parallelogram', mis: 'flow-symbol', why: 'A parallelogram is input/output: read a sensor or switch an output. A question needs two exits.' },
      { t: 'A rounded box', mis: 'flow-symbol', why: 'A rounded box is a terminator: START or STOP. A question needs two exits.' },
    ]);
    Q(9, 'reading a loop (night light)', 'A night-light program: <b>START → read light sensor → Is it dark? → Yes: lamp ON / No: lamp OFF → back to "read light sensor"</b>. It is night and the lamp is ON. What happens when the <b>sun comes up</b>?', [
      { t: 'It reads the sensor again and turns the lamp OFF', ok: true, why: 'The loop goes back and keeps checking. When the answer changes to No, the program switches the lamp OFF.' },
      { t: 'Nothing: the program ended when the lamp came ON', mis: 'flow-loop', why: 'There is no STOP after "lamp ON". The arrow loops back, so the program keeps checking the sensor.' },
      { t: 'The lamp stays ON, as it has already answered Yes', mis: 'flow-loop', why: 'The question is asked again every time round the loop. A new reading can give a new answer.' },
      { t: 'The lamp stays ON until the program is restarted', mis: 'flow-loop', why: 'No restart is needed: the loop goes back by itself and checks the sensor again and again.' },
    ]);

    ui.el('h2', '', 'Outputs');
    Q(10, 'output for a talking toy', 'A <b>talking toy</b> must say several different phrases. Which output does it need?', [
      { t: 'A speaker: it can play a range of sounds', ok: true, why: 'A speaker turns a changing signal into any sound: tunes, speech or music.' },
      { t: 'A buzzer: it can play a range of sounds', mis: 'buzzer-vs-speaker', why: 'A buzzer makes ONE fixed tone. It cannot play speech or tunes.' },
      { t: 'A buzzer: one fixed tone is all it needs', mis: 'output-choice', why: 'One fixed tone cannot be speech. The output must suit what the user needs to hear.' },
      { t: 'An LED: it uses very little energy to run', mis: 'output-choice', why: 'True about LEDs, but an LED gives light. The user needs to HEAR the phrases.' },
    ]);

    ui.el('h2', '', 'How do you feel?');
    ui.rate({ id: 'p11.conf-inputs', label: 'Confidence: inputs', q: 'How confident are you with <b>inputs</b> (the six switches; LDR, thermistor and pressure sensor, and how their resistance changes)?' });
    ui.rate({ id: 'p11.conf-process', label: 'Confidence: process', q: 'How confident are you with the <b>process</b> block (the microcontroller as timer, counter and decision-maker; flowcharts)?' });
    ui.rate({ id: 'p11.conf-outputs', label: 'Confidence: outputs', q: 'How confident are you with <b>outputs</b> (lamp, LED, buzzer, speaker, and choosing one to suit the user)?' });
    ui.write({ id: 'p11.unsure', label: 'Still not sure about…', marks: 0, lines: 2,
      q: "What's one thing about systems, inputs, the microcontroller or outputs you're still not sure about?",
      scheme: ['Any honest answer'] });
  },
});
