# Systems & electronics — content sheet (AQA GCSE D&T 8552, 3.1.4 Systems approach to designing)

Year 10, one-hour lesson. Every fact on a page must come from this sheet (or be plainly consistent with it). Keep to GCSE D&T depth: NO Ohm's law, NO potential dividers, NO transistor theory, NO resistor colour codes.

## 1. The systems approach
- A **system** is a set of parts that work together to do a job. Designers split it into three blocks: **INPUT → PROCESS → OUTPUT**.
- **Input**: senses a change in the surroundings (light, heat, pressure, a person pressing something) and turns it into an electrical signal.
- **Process**: decides what to do with the signal (the "brain"): times, counts, compares, decides.
- **Output**: turns the electrical signal into something we can see, hear or use (light, sound, movement).
- A **block diagram** (system diagram) shows the blocks as boxes joined by arrows; the arrows are **signals** flowing left to right. It shows WHAT each part does, not HOW it is wired (that is a circuit diagram).
- A system needs a power supply (battery/mains) but that is not one of the three blocks.
- A **subsystem** is a smaller system inside a bigger one (e.g. the doorbell inside a house).
- Examples: automatic night light = light sensor → microcontroller decides "is it dark?" → lamp. Doorbell = push switch → microcontroller → buzzer/speaker. Fridge alarm = temperature sensor / door switch → timer → buzzer.

## 2. Input devices
### Switches (on/off inputs)
- **Push-to-make (PTM)**: circuit is ON only while pressed (doorbell, keyboard key, game controller button).
- **Push-to-break (PTB)**: circuit is OFF only while pressed (fridge door light switch: door shut presses the switch, light off).
- **Toggle / rocker / slide switch**: stays in the position you leave it (latching) (light switch, power switch on a torch).
- **Tilt switch**: turns on/off when tilted (alarm if a vending machine is tipped; iron that switches off if knocked over).
- **Reed switch**: closed by a magnet coming near (door/window alarm sensors, bike speedometer).
- **Micro switch**: needs only a tiny movement/force; often with a lever (detect a closed door or lid, microwave door, limit of travel on a 3D printer).
### Sensors (give a changing signal)
- **Light sensor = LDR (light-dependent resistor)**: resistance changes with light. **Brighter light → LOWER resistance; dark → HIGH resistance.** Used in automatic street lights, night lights, phone screen auto-brightness, camera exposure.
- **Temperature sensor = thermistor**: resistance changes with temperature. For the usual (NTC) type: **hotter → LOWER resistance; colder → HIGHER resistance.** Used in digital thermometers, central-heating thermostats, fridges, ovens, fire alarms, car engine temperature.
- **Pressure sensor (force sensor / pressure pad)**: detects a force pressing on it; **more pressure → LOWER resistance** (for a force-sensitive resistor). Used in digital bathroom/kitchen scales, pressure mats in burglar alarms, car seat occupancy (seat-belt warning), touch-sensitive controls.
- (Mention only) moisture sensor (plant waterer), sound sensor (clap light), PIR motion sensor (security light). Not core.
- Resistance is measured in **ohms (Ω)**. High resistance = hard for current to flow; low resistance = easy.
- Switches give two states (on/off) = a **digital** signal. Sensors give a range of values = an **analogue** signal. (Light touch only.)

## 3. Process devices: the microcontroller
- A **microcontroller** is a small, cheap computer on a single chip (an integrated circuit, IC) that can be **programmed**. Examples: PIC, the chip on a BBC micro:bit, Arduino, Crumble.
- It is a **programmable component**: the program (written on a computer and downloaded to the chip) tells it how to respond to its inputs.
- Three jobs AQA names:
  - **Timer**: waits or keeps something on for a set time (egg timer; security light stays on 30 s; microwave countdown; toothbrush 2-minute timer).
  - **Counter**: counts signals/events (people through a door, laps, items on a conveyor, steps in a pedometer, reps).
  - **Decision-maker**: compares an input with a set value and chooses what to do (IF it is dark THEN lamp on; IF temperature > 25 °C THEN fan on).
- **Advantages** of a microcontroller over a circuit of separate components: can be **reprogrammed** to change what the product does without rebuilding it; one chip replaces many components so the product is **smaller, cheaper to assemble and more reliable**; can handle many inputs and outputs at once; easy to update/improve.
- **Disadvantages**: needs programming skill and equipment (computer, software, download cable); overkill/too costly for a very simple circuit (e.g. a torch); a program error (bug) stops the product working properly.
- Programs can be written as **flowcharts**, block code or text code.
### Flowchart symbols
- **Terminator** (rounded box / "pill"): START or STOP.
- **Input/Output** (parallelogram): read a sensor/switch, or switch an output on/off.
- **Process** (rectangle): do something, e.g. "wait 5 seconds", "add 1 to count".
- **Decision** (diamond): a yes/no question, e.g. "Is it dark?"; has TWO exits labelled Yes and No.
- **Arrows** show the order (flow); a loop goes back to an earlier step so the program keeps checking.
- Example (night light): START → [Read light sensor] → <Is it dark?> — Yes → [Lamp ON] → back to read; No → [Lamp OFF] → back to read.
- Example (counter): START → <Button pressed?> No → loop back; Yes → [Add 1 to count] → <Count = 10?> No → back; Yes → [Buzzer ON] → STOP.

## 4. Output devices
- **Lamp** (filament bulb): gives light (and wastes a lot of energy as heat). Torches, older car lights, indicator lamps.
- **LED (light-emitting diode)**: gives light using very little energy, long life, stays cool, many colours; only works one way round. Standby lights, displays, modern torches and bike lights. (AQA names "lamps"; LED is the modern lamp.)
- **Buzzer**: makes ONE fixed sound/tone when switched on. Simple and cheap. Alarms, microwave beep, smoke alarm, timers, game buzzers.
- **Speaker**: turns a changing electrical signal into sound; can play a RANGE of sounds: tunes, speech, music. Radios, phones, musical doorbells, talking toys.
- **Buzzer vs speaker**: buzzer = one tone, just needs power; speaker = any sound, needs a changing signal from the microcontroller/amplifier.
- (Mention only) **Motor**: gives rotary movement (fan, toy car, electric toothbrush).
- Choosing an output: what does the user need — to SEE it (lamp/LED), HEAR it (buzzer/speaker), or have something MOVE (motor)? E.g. an alarm for a deaf user needs a flashing light or vibration, not a buzzer.

## 5. Whole systems (products to use)
| Product | Input | Process | Output |
|---|---|---|---|
| Automatic night light / street light | LDR (light sensor) | decision: is it dark? | lamp / LED |
| Doorbell | push-to-make switch | timer / plays tune | buzzer or speaker |
| Fridge door alarm | micro switch or PTB switch on door | timer: open > 60 s? | buzzer |
| Digital kitchen scales | pressure sensor | decision / convert to grams | display (LEDs/LCD) |
| Central heating thermostat | thermistor | decision: colder than set? | heater on (boiler) |
| Fire alarm (heat type) | thermistor | decision: too hot? | buzzer/siren + lamp |
| Burglar alarm | reed switch on window, pressure mat | decision + timer | siren (speaker), flashing lamp |
| Turnstile / shop door counter | switch or sensor | counter | display |
| Bike light that comes on at dusk | LDR | decision | LED |
| Electric toothbrush timer | push switch | timer (2 min) | motor + buzz |
| Quiz buzzer | push-to-make switches | decision: who was first? | lamp + buzzer |

## Misconception tags (use these exact ids)
- `ipo-order` — puts input/process/output blocks in the wrong order or role
- `input-vs-output` — thinks a sensor/switch is an output, or a lamp/buzzer is an input
- `process-role` — thinks the process block senses or produces (not decides/times/counts)
- `block-vs-circuit` — confuses a block (system) diagram with a circuit diagram
- `ldr-backwards` — thinks an LDR's resistance goes UP in bright light
- `thermistor-backwards` — thinks a thermistor's resistance goes UP when hot
- `sensor-mixup` — picks the wrong sensor for the quantity (LDR for heat, thermistor for light, etc.)
- `switch-type` — mixes up push-to-make, push-to-break, toggle, tilt, reed, micro
- `timer-counter-decision` — mixes up timing, counting and decision-making
- `micro-fixed` — thinks a microcontroller cannot be changed / is just a battery or a switch
- `flow-symbol` — uses the wrong flowchart symbol (e.g. rectangle for a decision)
- `flow-loop` — misreads the order/loop of a flowchart (forgets it goes back and checks again)
- `buzzer-vs-speaker` — thinks a buzzer can play tunes/speech or that they are the same
- `output-choice` — picks an output that doesn't suit the user's need
