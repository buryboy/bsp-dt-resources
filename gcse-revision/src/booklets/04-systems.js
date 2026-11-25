/* 3.1.4 Systems approach to designing (AQA 8552, core technical principles) */
SPEC.push(
 ['q4a', 4, '3.1.4', 'Inputs', 'Light sensors · temperature sensors · pressure sensors · switches', '**Name** a suitable input component for a night light that switches on when it gets dark, and **explain** how it works.', 3, ['Light dependent resistor (LDR) / light sensor (1)', 'Its resistance changes with the light level: high resistance in the dark, low in the light (1)', 'so the signal to the process block changes when it gets dark and the lamp is switched on (1)']],
 ['q4b', 4, '3.1.4', 'Processes', 'Programming microcontrollers as counters, timers and decision-making devices', '**Explain** two advantages of using a microcontroller rather than separate components to control a product.', 4, ['It can be reprogrammed (1) so the way the product works can be changed without rebuilding the circuit (1)', 'One chip replaces many components (1) so the circuit is smaller, cheaper and more reliable (1)']],
 ['q4c', 4, '3.1.4', 'Outputs', 'Buzzers · speakers · lamps', '**Describe** the difference between a buzzer and a speaker as output devices.', 2, ['A buzzer makes one fixed sound when it is switched on (1)', 'A speaker turns a changing electrical signal into sound, so it can play different notes, music or speech (1)']],
);
BOOKLETS.push({ id: 'g4', topic: 4, title: 'Systems approach to designing', pages: [

{ t: 'Overview and key words', blocks: [
 { notes: `<p class="lead">Any electronic product can be described as a <b>system</b> with three parts. You do not need to know how every component works inside: think of each part as a box that does a job.</p>
 <p style="font-size:20px;text-align:center"><b>INPUT → PROCESS → OUTPUT</b></p>
 <table><tr><th>Stage</th><th>Job</th><th>Components you must know</th></tr>
 <tr><td><b>Input</b></td><td>Senses a change in the surroundings, or a person, and sends a signal</td><td>Light sensors, temperature sensors, pressure sensors, switches</td></tr>
 <tr><td><b>Process</b></td><td>Decides what to do with the signal</td><td>Microcontrollers programmed as counters, timers and decision-making devices</td></tr>
 <tr><td><b>Output</b></td><td>Does something a person can see or hear</td><td>Buzzers, speakers, lamps</td></tr></table>
 <p>A drawing of these boxes joined by arrows is called a <b>systems diagram</b> or <b>block diagram</b>. Section A often asks you to complete one.</p>` },
 { keys: [
  ['System', 'A set of parts that work together to do a job'],
  ['Input', 'The part of a system that senses a change and sends a signal in'],
  ['Process', 'The part of a system that decides what the output should do'],
  ['Output', 'The part of a system that produces light, sound or movement'],
  ['Sensor', 'An input component that detects a change such as light, heat or pressure'],
  ['LDR', 'Light dependent resistor: its resistance falls as the light gets brighter'],
  ['Thermistor', 'A resistor whose resistance changes with temperature'],
  ['Microcontroller', 'A small programmable computer on a single chip, such as a PIC'],
  ['Program', 'A set of instructions that tells a microcontroller what to do'],
  ['Feedback', 'Information from the output that is sent back to the input to control the system'],
  ['Analogue', 'A signal that can have any value in a range, such as a light level'],
  ['Digital', 'A signal that is only on or off (1 or 0)'],
 ] },
]},

{ t: 'Inputs', spec: '3.1.4', blocks: [
 { notes: `<table><tr><th>Input</th><th>Component</th><th>How it works</th><th>Used in</th></tr>
 <tr><td><b>Light sensor</b></td><td>Light dependent resistor (LDR)</td><td>Resistance is <b>high in the dark</b> and <b>low in the light</b></td><td>Street lights and night lights that come on at dusk; automatic screen brightness</td></tr>
 <tr><td><b>Temperature sensor</b></td><td>Thermistor</td><td>Resistance changes with temperature. In the usual type it <b>falls as it gets hotter</b></td><td>Central heating thermostats, fridge alarms, fire alarms, digital thermometers</td></tr>
 <tr><td><b>Pressure sensor</b></td><td>Pressure pad or piezo sensor</td><td>Sends a signal when it is pressed or squeezed</td><td>Burglar alarm mats, digital scales, car seat-belt warnings</td></tr>
 <tr><td><b>Switch</b></td><td>See below</td><td>Makes or breaks a circuit when a person or object operates it</td><td>Almost every product</td></tr></table>
 <h4>Types of switch</h4>
 <table><tr><th>Switch</th><th>What it does</th><th>Example</th></tr>
 <tr><td>Push to make (PTM)</td><td>On only while it is pressed</td><td>Doorbell, keyboard key</td></tr>
 <tr><td>Push to break (PTB)</td><td>Off only while it is pressed</td><td>Fridge door light</td></tr>
 <tr><td>Toggle, slide, rocker</td><td>Stays on or off until moved again</td><td>Light switch, power switch</td></tr>
 <tr><td>Micro switch</td><td>Operated by a small movement of a lever</td><td>Detecting a closed door or a guard on a machine</td></tr>
 <tr><td>Tilt switch</td><td>Switches when it is tipped over</td><td>Heater that turns off if knocked over</td></tr>
 <tr><td>Reed switch</td><td>Operated by a magnet coming near</td><td>Door and window alarm sensors</td></tr></table>
 <p>Sensors such as the LDR and thermistor give an <b>analogue</b> signal (any value). A switch gives a <b>digital</b> signal (on or off).</p>` },
 { match: { q: 'Choose the best input for each product.', lh: 'Product', rh: 'Input', pairs: [['A light that comes on at dusk', 'Light sensor (LDR)'], ['A greenhouse fan that starts when it is too hot', 'Temperature sensor (thermistor)'], ['A mat that sounds an alarm when stepped on', 'Pressure sensor'], ['A doorbell', 'Push to make switch'], ['An alarm that sounds when a window opens', 'Reed switch and magnet']] } },
 { tf: [
  ['The resistance of an LDR is high in the dark.', true, 'And low in bright light.'],
  ['A thermistor detects changes in pressure.', false, 'It detects temperature.'],
  ['A push to make switch stays on after you let go.', false, 'It is on only while pressed.'],
  ['A switch gives a digital signal: on or off.', true, 'Sensors such as LDRs give an analogue signal.'],
 ] },
]},

{ t: 'Processes', spec: '3.1.4', blocks: [
 { notes: `<p>The process block takes the input signal and decides what the output does. In modern products this is nearly always a <b>microcontroller</b>: a tiny programmable computer on one chip (a <b>PIC</b> is a common type). In school you might use a micro:bit, PICAXE, Arduino or Crumble: they are all built around a microcontroller.</p>
 <h4>Three things a microcontroller can be programmed to do</h4>
 <table><tr><th>As a…</th><th>What it does</th><th>Example</th></tr>
 <tr><td><b>Counter</b></td><td>Counts how many times an input is triggered, and can act when a number is reached</td><td>A step counter; counting products on a conveyor; a scoreboard</td></tr>
 <tr><td><b>Timer</b></td><td>Waits for a set time, or keeps an output on for a set time</td><td>A light that stays on for 30 seconds; an egg timer; a time delay on a pedestrian crossing</td></tr>
 <tr><td><b>Decision-making device</b></td><td>Compares the input with a set value and chooses what to do: <b>IF</b> this, <b>THEN</b> that, <b>ELSE</b> something else</td><td>IF it is dark AND movement is detected THEN switch the lamp on</td></tr></table>
 <p>Programs are usually planned as a <b>flowchart</b>: a rounded box for start and stop, a rectangle for a process (such as “wait 5 seconds”), a parallelogram for an input or output, and a diamond for a decision (a yes or no question).</p>
 <h4>Why use a microcontroller?</h4>
 <ul><li>It can be <b>reprogrammed</b>, so the product can be changed or updated without a new circuit.</li>
 <li>One chip <b>replaces many separate components</b>, so the circuit is smaller, cheaper to assemble and more reliable.</li>
 <li>It can handle <b>several inputs and outputs</b> at once.</li></ul>
 <p>Drawbacks: it must be programmed (which needs software and skill), and for a very simple circuit it can cost more than a few basic components.</p>
 <h4>Feedback</h4>
 <p>In a system with <b>feedback</b>, the output affects the input. A heating system is the classic example: the heater warms the room, the temperature sensor detects this, and the microcontroller switches the heater off. This is a <b>closed loop</b> system. A system with no feedback, such as a toaster on a timer, is <b>open loop</b>.</p>` },
 { sort: { q: 'Is the microcontroller working as a counter, a timer or a decision maker?', cats: ['Counter', 'Timer', 'Decision maker'], items: [['A security light stays on for one minute', 1], ['A turnstile records how many people enter', 0], ['IF the temperature is below 18 °C THEN turn the heater on', 2], ['A microwave runs for 90 seconds', 1], ['A machine stops after 500 parts are made', 0], ['IF the door is open THEN sound the buzzer', 2]] } },
 { mcq: [
  ['Which flowchart symbol is used for a decision?', ['Rectangle', 'Diamond', 'Circle', 'Parallelogram'], 1, 'A decision has two ways out: yes and no.'],
  ['Which is an advantage of a microcontroller?', ['It never needs a power supply', 'It can be reprogrammed to change how the product works', 'It is an output device', 'It senses light'], 1, 'Reprogramming is the big advantage.'],
  ['A room heater switches itself off when the room reaches 21 °C. What is this an example of?', ['An open loop system', 'Feedback', 'A counter', 'An output'], 1, 'The output (heat) is sensed and changes what the system does.'],
 ] },
]},

{ t: 'Outputs and exam practice', spec: '3.1.4', blocks: [
 { notes: `<table><tr><th>Output</th><th>What it does</th><th>Notes</th></tr>
 <tr><td><b>Buzzer</b></td><td>Makes a single fixed tone when current flows</td><td>Simple and cheap: alarms, timers, warning beeps. It has a positive and negative leg and must be connected the right way round</td></tr>
 <tr><td><b>Speaker</b></td><td>Turns a changing electrical signal into sound</td><td>Can play different notes, music and speech: doorbells with tunes, radios, toys. Needs a signal from the microcontroller or an amplifier</td></tr>
 <tr><td><b>Lamp</b></td><td>Gives out light</td><td>Filament bulbs get hot and waste energy. <b>LEDs</b> (light emitting diodes) use far less power, last much longer, come in many colours and must be connected the right way round with a resistor to protect them</td></tr></table>
 <p>Other outputs you will have used: <b>motors</b> (rotary movement) and <b>solenoids</b> (a short linear push or pull, as in a door lock).</p>
 <h4>Putting a system together</h4>
 <table><tr><th>Product</th><th>Input</th><th>Process</th><th>Output</th></tr>
 <tr><td>Night light</td><td>Light sensor</td><td>Microcontroller decides: IF dark THEN lamp on</td><td>Lamp (LED)</td></tr>
 <tr><td>Fridge door alarm</td><td>Switch on the door</td><td>Microcontroller as a timer: door open for 30 seconds</td><td>Buzzer</td></tr>
 <tr><td>Steady hand game</td><td>Wire loop touches the track (a switch)</td><td>Microcontroller counts the touches</td><td>Buzzer and lamp</td></tr>
 <tr><td>Bike alarm</td><td>Tilt switch</td><td>Microcontroller decides and times the alarm</td><td>Speaker (siren)</td></tr></table>` },
 { sort: { q: 'Input, process or output?', cats: ['Input', 'Process', 'Output'], items: [['Buzzer', 2], ['LDR', 0], ['Microcontroller', 1], ['Lamp', 2], ['Thermistor', 0], ['Speaker', 2], ['Push switch', 0], ['Pressure pad', 0]] } },
 { gap: { text: 'In a burglar alarm, a pressure pad under the carpet is the {{input}}. The signal goes to a {{microcontroller}}, which is the {{process}} block. It switches on a {{buzzer}}, which is the output, and keeps it on for five minutes by working as a {{timer}}.', extra: ['counter', 'thermistor', 'feedback'] } },
 { mcq: [
  ['Which component is an output?', ['Thermistor', 'Push switch', 'Speaker', 'LDR'], 2, 'A speaker produces sound.'],
  ['Which input would be used in a fire alarm to detect heat?', ['LDR', 'Thermistor', 'Reed switch', 'Buzzer'], 1, 'A thermistor senses temperature.'],
  ['What is the main advantage of an LED over a filament lamp?', ['It gets hotter', 'It uses much less energy and lasts longer', 'It works either way round', 'It is an input'], 1, 'LEDs are efficient and long-lasting.'],
 ] },
 { exam: [
  ['**Complete** the system for an automatic porch light by naming one suitable input component and one suitable output component.', 2, ['Input: light sensor / LDR (accept a movement sensor) (1)', 'Output: lamp / LED (1)']],
  ['**Explain** how a microcontroller could be used as a timer in a hand dryer.', 2, ['When the input sensor detects hands, the program switches the heater and fan on (1)', 'and keeps them on for a set time, e.g. 20 seconds, before switching off (1)']],
  ['**Describe** how feedback is used in a central heating system.', 3, ['A temperature sensor measures the temperature of the room (1)', 'The microcontroller compares it with the temperature that has been set (1)', 'and switches the heating off when it is reached, and on again when the room cools (1)']],
  ['A designer is developing a toy for young children that plays a tune when it is picked up. **Explain** the input, process and output the toy could use.', 6, ['Input: a tilt switch or pressure sensor detects that the toy has been picked up or squeezed, and sends a signal', 'Process: a microcontroller is programmed to decide: IF the input is triggered THEN play the tune', 'Process: it can work as a timer so the tune stops after a set time, or a counter so a different tune plays each time', 'Output: a speaker, because it can play different notes; a buzzer could only make one tone', 'Output: LEDs could flash in time; low power, so batteries last', 'Reasons linked to the user: no small switches for a young child to operate; reprogrammable, so tunes can be changed']],
 ] },
 { nea: 'If your NEA includes electronics, draw it as an input, process, output diagram and explain each choice. A flowchart of your program is easy evidence of development.' },
]},

]});
