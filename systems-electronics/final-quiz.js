// Final quiz: 20 questions, one go. a = correct answer, d = three wrong answers, mis = misconception tag (optional).
Book.finalQuiz({
  questions: [
    // systems and block diagrams
    { q: 'What does the <b>process</b> block of a system do?', a: 'Decides what to do with the signal', d: ['Senses a change in the surroundings', 'Turns the signal into light or sound', 'Supplies the power to the other blocks'], mis: 'process-role' },
    { q: 'A doorbell has a push switch, a microcontroller and a buzzer. Which block is the <b>buzzer</b>?', a: 'The output', d: ['The input', 'The process', 'The signal'], mis: 'input-vs-output' },
    { q: 'In a <b>block diagram</b>, what do the arrows between the boxes show?', a: 'Signals flowing from block to block', d: ['Wires soldered between components', 'Current flowing back to the battery', 'The order the parts were assembled'], mis: 'block-vs-circuit' },
    // switches
    { q: 'A <b>game controller</b> button must send a signal only while it is held down. Which switch does this?', a: 'Push-to-make switch', d: ['Push-to-break switch', 'Toggle switch', 'Tilt switch'], mis: 'switch-type' },
    { q: 'A fridge light must go <b>off</b> when the closed door presses on its switch. Which switch does this?', a: 'Push-to-break switch', d: ['Push-to-make switch', 'Toggle switch', 'Reed switch'], mis: 'switch-type' },
    { q: 'Which switch <b>stays in the position you leave it</b>, like a light switch on a wall?', a: 'Toggle switch', d: ['Push-to-make switch', 'Micro switch', 'Reed switch'], mis: 'switch-type' },
    { q: 'An <b>iron</b> must switch itself off if it is knocked over. Which input device detects this?', a: 'Tilt switch', d: ['Reed switch', 'Toggle switch', 'Thermistor'], mis: 'switch-type' },
    { q: 'A bike speedometer has a <b>magnet</b> on the wheel. Which switch does the magnet close each time it passes?', a: 'Reed switch', d: ['Tilt switch', 'Micro switch', 'Toggle switch'], mis: 'switch-type' },
    { q: 'Which switch needs only a <b>tiny movement</b>, often through a small lever, to detect that a microwave door is closed?', a: 'Micro switch', d: ['Reed switch', 'Tilt switch', 'Toggle switch'], mis: 'switch-type' },
    // sensors
    { q: 'A phone is carried from a dark room into <b>bright sunshine</b>. What happens to the resistance of its LDR?', a: 'It gets lower', d: ['It gets higher', 'It stays the same', 'It rises, then falls'], mis: 'ldr-backwards' },
    { q: 'The food in a freezer gets <b>colder</b>. What happens to the resistance of the thermistor inside?', a: 'It gets higher', d: ['It gets lower', 'It stays the same', 'It falls, then rises'], mis: 'thermistor-backwards' },
    { q: 'A car must detect that someone is <b>sitting on a seat</b> (for the seat-belt warning). Which input device suits this?', a: 'Pressure sensor', d: ['Thermistor', 'Light sensor (LDR)', 'Reed switch'], mis: 'sensor-mixup' },
    // microcontroller
    { q: 'One microcontroller chip can <b>replace many separate components</b>. What advantage does this give?', a: 'The product is smaller and more reliable', d: ['The product no longer needs a program', 'The product can never have a bug', 'The product works without a battery'], mis: 'micro-fixed' },
    { q: 'A security light stays on for <b>30 seconds</b> and then switches off. Which microcontroller job is this?', a: 'Timer', d: ['Counter', 'Decision-maker', 'Sensor'], mis: 'timer-counter-decision' },
    { q: 'Which of these is a <b>disadvantage</b> of using a microcontroller?', a: 'It needs programming skill and equipment', d: ['It cannot be changed once it is fitted', 'It makes the finished product larger', 'It can only work with a single input'], mis: 'micro-fixed' },
    // flowcharts
    { q: 'Which flowchart symbol is used for a step such as <b>"wait 5 seconds"</b>?', a: 'A rectangle', d: ['A diamond', 'A parallelogram', 'A rounded box'], mis: 'flow-symbol' },
    { q: 'A program: <b>START → Button pressed? (No: check again) → Yes: add 1 to count → Count = 3? (No: go back and check the button) → Yes: buzzer ON → STOP</b>. You press the button <b>twice</b>. What has happened?', a: 'Count is 2 and the buzzer is still off', d: ['Count is 2 and the buzzer is now on', 'Count is 1 and the program has stopped', 'Count is 3 and the buzzer is now on'], mis: 'flow-loop' },
    // outputs and choosing parts
    { q: 'Which statement about a <b>buzzer</b> is correct?', a: 'It makes one fixed tone when switched on', d: ['It can play tunes, speech and music', 'It needs a changing signal to work', 'It turns sound into an electrical signal'], mis: 'buzzer-vs-speaker' },
    { q: 'A fire alarm is being designed for a <b>deaf</b> user. Which output suits this user?', a: 'A flashing light', d: ['A louder buzzer', 'A musical speaker', 'A push switch'], mis: 'output-choice' },
    { q: 'Which set of parts would make an <b>automatic night light</b> that comes on when it gets dark?', a: 'LDR → microcontroller → LED', d: ['Thermistor → microcontroller → LED', 'LED → microcontroller → LDR', 'LDR → microcontroller → buzzer'], mis: 'sensor-mixup' },
  ],
});
