/* 3.1.5 Mechanical devices (AQA 8552, core technical principles) */
SPEC.push(
 ['q5a', 5, '3.1.5', 'Types of movement', 'Linear · rotary · reciprocating · oscillating', '**Name** the type of motion of (a) a sewing machine needle and (b) a playground swing.', 2, ['(a) Reciprocating (1)', '(b) Oscillating (1)']],
 ['q5b', 5, '3.1.5', 'Levers', 'First order · second order · third order · changing the magnitude and direction of a force', '**Explain** why a wheelbarrow makes it easier to lift a heavy load.', 3, ['It is a second order (class) lever: the load is between the fulcrum (wheel) and the effort (handles) (1)', 'The effort is further from the fulcrum than the load is (1)', 'so a smaller effort lifts a larger load / it gives a mechanical advantage (1)']],
 ['q5c', 5, '3.1.5', 'Linkages', 'Bell cranks · push/pull linkages', '**Describe** what a bell crank linkage does. Give an example of where one is used.', 2, ['It changes the direction of a force or movement through 90° (round a corner) (1)', 'Example: bicycle brake mechanism / steering linkage (1)']],
 ['q5d', 5, '3.1.5', 'Gear trains, cams and pulleys', 'Cams and followers · simple gear trains · pulleys and belts', 'A driver gear with 12 teeth meshes with a driven gear with 36 teeth. **Calculate** the gear ratio and **state** what happens to the speed and direction of the driven gear.', 3, ['Gear ratio = driven ÷ driver = 36 ÷ 12 = 3, written 3:1 (1)', 'The driven gear turns three times slower than the driver (1)', 'and in the opposite direction (1)']],
);
BOOKLETS.push({ id: 'g5', topic: 5, title: 'Mechanical devices', pages: [

{ t: 'Overview and key words', blocks: [
 { notes: `<p class="lead">A <b>mechanism</b> takes an input movement and force and changes it into a different output movement and force. It can change the <b>type</b> of movement, its <b>direction</b>, or its <b>size</b> (magnitude).</p>
 <table><tr><th>Page</th><th>What it covers</th></tr>
 <tr><td>2</td><td>The four types of movement</td></tr>
 <tr><td>3</td><td>Levers: first, second and third order</td></tr>
 <tr><td>4</td><td>Linkages: bell cranks and push/pull</td></tr>
 <tr><td>5</td><td>Cams and followers</td></tr>
 <tr><td>6</td><td>Gear trains, pulleys and belts, with calculations</td></tr>
 <tr><td>7</td><td>Exam practice</td></tr></table>
 <p>This topic nearly always appears in Section A, often with a short calculation. Bring a calculator.</p>` },
 { keys: [
  ['Mechanism', 'A device that changes an input movement and force into a different output movement and force'],
  ['Linear motion', 'Movement in a straight line in one direction'],
  ['Rotary motion', 'Movement round in a circle'],
  ['Reciprocating motion', 'Movement backwards and forwards in a straight line'],
  ['Oscillating motion', 'Movement backwards and forwards in an arc, like a swing'],
  ['Fulcrum', 'The fixed point that a lever turns about; also called the pivot'],
  ['Effort', 'The force put into a mechanism'],
  ['Load', 'The force a mechanism has to move or overcome'],
  ['Mechanical advantage', 'How many times a mechanism multiplies the effort: load ÷ effort'],
  ['Linkage', 'A set of rods and pivots that passes movement from one place to another'],
  ['Cam', 'A shaped piece on a rotating shaft that pushes a follower up and down'],
  ['Follower', 'The part that rests on a cam and moves up and down as the cam turns'],
  ['Driver gear', 'The gear that is turned by the motor or handle: the input'],
  ['Driven gear', 'The gear that is turned by the driver: the output'],
  ['Idler gear', 'A gear placed between two others so that they turn in the same direction'],
 ] },
]},

{ t: 'Types of movement', spec: '3.1.5', blocks: [
 { notes: `<table><tr><th>Type</th><th>Description</th><th>Arrow symbol</th><th>Examples</th></tr>
 <tr><td><b>Linear</b></td><td>In a straight line, one way</td><td>A straight arrow with one head</td><td>A train on a straight track, a paper guillotine blade, a conveyor belt</td></tr>
 <tr><td><b>Rotary</b></td><td>Round and round in a circle</td><td>A curved arrow going round</td><td>A wheel, a drill chuck, the hands of a clock</td></tr>
 <tr><td><b>Reciprocating</b></td><td>Backwards and forwards in a straight line</td><td>A straight arrow with two heads</td><td>A sewing machine needle, a jigsaw blade, a piston in an engine</td></tr>
 <tr><td><b>Oscillating</b></td><td>Backwards and forwards in an arc</td><td>A curved arrow with two heads</td><td>A swing, a pendulum, a windscreen wiper</td></tr></table>
 <p>Mechanisms often <b>convert</b> one type into another. A cam turns rotary into reciprocating. A crank and slider (as in an engine) turns reciprocating into rotary. A rack and pinion turns rotary into linear.</p>` },
 { tip: '<b>Reciprocating or oscillating?</b> Both go back and forth. Reciprocating is in a <b>straight line</b>. Oscillating swings in a <b>curve</b> about a pivot.' },
 { sort: { q: 'What type of movement is it?', cats: ['Linear', 'Rotary', 'Reciprocating', 'Oscillating'], items: [['A playground swing', 3], ['A sewing machine needle', 2], ['A bicycle wheel', 1], ['A lift going up', 0], ['A windscreen wiper', 3], ['The blade of a scroll saw', 2], ['The chuck of a pillar drill', 1], ['A clock pendulum', 3]] } },
 { mcq: [
  ['A cam and follower converts…', ['linear to rotary', 'rotary to reciprocating', 'oscillating to rotary', 'reciprocating to linear'], 1, 'The cam rotates; the follower moves up and down.'],
  ['Which symbol shows reciprocating motion?', ['A straight arrow with one head', 'A straight arrow with a head at each end', 'A curved arrow going round', 'A curved arrow with a head at each end'], 1, 'Straight line, both ways.'],
 ] },
]},

{ t: 'Levers', spec: '3.1.5', blocks: [
 { notes: `<p>A <b>lever</b> is a rigid bar that turns about a <b>fulcrum</b> (pivot). An <b>effort</b> is applied to move a <b>load</b>. The three orders (classes) differ in which of the three is in the <b>middle</b>.</p>
 <table><tr><th>Order</th><th>In the middle</th><th>What it does</th><th>Examples</th></tr>
 <tr><td><b>First</b></td><td><b>F</b>ulcrum</td><td>Changes the direction of the force: push down, load goes up. Can multiply force if the effort is further from the fulcrum</td><td>Seesaw, scissors, pliers, crowbar, claw hammer pulling a nail</td></tr>
 <tr><td><b>Second</b></td><td><b>L</b>oad</td><td>Always multiplies force: the effort is further from the fulcrum than the load</td><td>Wheelbarrow, nutcracker, bottle opener, garlic press</td></tr>
 <tr><td><b>Third</b></td><td><b>E</b>ffort</td><td>Needs more effort than the load, but the load moves further and faster. Good for control and speed</td><td>Tweezers, tongs, fishing rod, the human forearm</td></tr></table>
 <p><b>Remember “FLE” for 1, 2, 3:</b> <b>F</b>ulcrum in the middle (first), <b>L</b>oad in the middle (second), <b>E</b>ffort in the middle (third).</p>
 <h4>Mechanical advantage</h4>
 <p style="font-size:19px"><b>Mechanical advantage (MA) = load ÷ effort</b></p>
 <p>It has no units. If MA is more than 1, the lever makes the job easier. Example: a 300 N load is lifted with a 100 N effort. MA = 300 ÷ 100 = <b>3</b>.</p>
 <h4>Balancing a lever</h4>
 <p style="font-size:19px"><b>effort × its distance from the fulcrum = load × its distance from the fulcrum</b></p>
 <p>Example: a load of 600 N is 0.5 m from the fulcrum. The effort is applied 2 m from the fulcrum. Effort × 2 = 600 × 0.5 = 300, so effort = 300 ÷ 2 = <b>150 N</b>. The longer the effort arm, the smaller the effort needed.</p>` },
 { sort: { q: 'Which order of lever?', cats: ['First order', 'Second order', 'Third order'], items: [['Scissors', 0], ['Wheelbarrow', 1], ['Tweezers', 2], ['Seesaw', 0], ['Nutcracker', 1], ['Fishing rod', 2], ['Crowbar', 0], ['Bottle opener', 1]] } },
 { calc: [
  ['A lever lifts a load of 400 N using an effort of 100 N. What is the mechanical advantage?', 4, 0, '', 'MA = load ÷ effort = 400 ÷ 100 = 4.'],
  ['A wheelbarrow has a mechanical advantage of 3. What effort, in newtons, is needed to lift a load of 450 N?', 150, 0, 'N', 'Effort = load ÷ MA = 450 ÷ 3 = 150 N.'],
  ['A load of 200 N is 0.3 m from the fulcrum of a first order lever. The effort is applied 1.2 m from the fulcrum. What effort, in newtons, is needed to balance it?', 50, 0, 'N', 'Effort × 1.2 = 200 × 0.3 = 60, so effort = 60 ÷ 1.2 = 50 N.'],
 ] },
 { exam: [
  ['**Explain** why tweezers are a third order lever, even though they do not make the job easier in terms of force.', 2, ['The effort (fingers) is applied between the fulcrum (the joined end) and the load (the tips) (1)', 'so the tips move further and with less force than the fingers, giving fine control / a gentle grip (1)']],
 ] },
]},

{ t: 'Linkages', spec: '3.1.5', blocks: [
 { notes: `<p>A <b>linkage</b> is a set of rigid bars joined by pivots. It carries movement and force from one place to another and can change the <b>direction</b> or the <b>size</b> of the movement.</p>
 <p>Two kinds of pivot: a <b>fixed pivot</b> is attached to the product and does not move (drawn as a circle with a triangle or filled dot); a <b>moving pivot</b> joins two bars and travels with them (drawn as an open circle).</p>
 <table><tr><th>Linkage</th><th>What it does</th><th>Examples</th></tr>
 <tr><td><b>Bell crank</b></td><td>An L-shaped lever on a fixed pivot at its corner. It turns the movement <b>through 90°</b>, round a corner. If the two arms are different lengths, it also changes the size of the force and movement</td><td>Bicycle brakes, steering systems, aircraft controls</td></tr>
 <tr><td><b>Push/pull linkage</b><br>(parallel motion)</td><td>Two bell cranks or levers joined by a bar. The output moves in the <b>same direction</b> as the input, but in a different place</td><td>Tool box with fold-out trays, pop-up cards, scissor lifts</td></tr>
 <tr><td><b>Reverse motion linkage</b></td><td>A bar on a central fixed pivot. The output moves the <b>opposite way</b> to the input. If the pivot is not central, the output is bigger or smaller than the input</td><td>Folding clothes airers, foot-pedal bins</td></tr></table>
 <p>The specification names <b>bell cranks</b> and <b>push/pull linkages</b>. The reverse motion linkage is included here because it helps you compare.</p>` },
 { match: { q: 'Match each linkage to what it does.', lh: 'Linkage', rh: 'What it does', pairs: [['Bell crank', 'Turns the movement through 90°'], ['Push/pull linkage', 'Output moves the same way as the input'], ['Reverse motion linkage', 'Output moves the opposite way to the input']] } },
 { tf: [
  ['A fixed pivot moves with the linkage.', false, 'A fixed pivot is attached to the product and stays still; moving pivots travel.'],
  ['A bell crank changes the direction of movement through 90°.', true, 'It carries movement round a corner.'],
  ['In a push/pull linkage the output moves in the opposite direction to the input.', false, 'Same direction. Opposite is a reverse motion linkage.'],
 ] },
]},

{ t: 'Cams and followers', spec: '3.1.5', blocks: [
 { notes: `<p>A <b>cam</b> is a shaped piece fixed to a rotating shaft. A <b>follower</b> rests on its edge. As the cam turns (<b>rotary</b> motion), the follower moves up and down (<b>reciprocating</b> motion).</p>
 <p>One turn of the cam can have three parts: the <b>rise</b> (follower goes up), the <b>fall</b> (it comes down) and the <b>dwell</b> (it stays still).</p>
 <table><tr><th>Cam</th><th>Shape</th><th>Movement of the follower</th><th>Example</th></tr>
 <tr><td><b>Circular (eccentric)</b></td><td>A circle with the shaft off-centre</td><td>Smooth, steady rise and fall with no dwell</td><td>Pumps, moving toys</td></tr>
 <tr><td><b>Pear</b></td><td>Egg or pear shaped</td><td>Stays still (dwell) for about half the turn, then rises and falls</td><td>Opening and closing valves in a car engine</td></tr>
 <tr><td><b>Snail (drop)</b></td><td>A spiral with a step</td><td>Slow rise, then a <b>sudden drop</b>. Can only turn in one direction</td><td>Hammer mechanisms, punching machines</td></tr>
 <tr><td><b>Heart</b></td><td>Heart shaped</td><td>Rises and falls at a steady speed with no dwell</td><td>Winding thread evenly on a bobbin</td></tr></table>
 <h4>Followers</h4>
 <ul><li><b>Flat:</b> copes with heavy loads, but more friction.</li><li><b>Knife (point):</b> follows the shape most accurately, but wears quickly.</li><li><b>Roller:</b> a small wheel that reduces friction and wear; used at higher speeds.</li></ul>` },
 { match: { q: 'Match each cam to the movement it gives the follower.', lh: 'Cam', rh: 'Follower movement', pairs: [['Circular (eccentric)', 'Smooth rise and fall, no dwell'], ['Pear', 'A long dwell, then a rise and fall'], ['Snail', 'A slow rise, then a sudden drop']] } },
 { mcq: [
  ['What does “dwell” mean?', ['The follower is rising', 'The follower is falling', 'The follower is not moving', 'The cam has stopped turning'], 2, 'The cam is still turning, but that part of its edge is a constant distance from the shaft.'],
  ['Which follower has the least friction?', ['Flat', 'Knife', 'Roller', 'They are all the same'], 2, 'A roller turns as the cam passes under it.'],
  ['Which cam must only be turned in one direction?', ['Circular', 'Pear', 'Snail', 'Heart'], 2, 'Turned backwards, the follower would jam against the step.'],
 ] },
]},

{ t: 'Gear trains, pulleys and belts', spec: '3.1.5', blocks: [
 { notes: `<h4>Simple gear trains</h4>
 <p>Gears are toothed wheels that <b>mesh</b>. The <b>driver</b> gear (input) turns the <b>driven</b> gear (output).</p>
 <ul><li>Two meshed gears turn in <b>opposite directions</b>.</li>
 <li>A <b>small</b> driver turning a <b>large</b> driven gear makes the output <b>slower</b>, with more turning force (torque).</li>
 <li>A <b>large</b> driver turning a <b>small</b> driven gear makes the output <b>faster</b>, with less turning force.</li>
 <li>An <b>idler</b> gear between them makes the driver and driven turn the <b>same way</b>. It does not change the gear ratio.</li></ul>
 <p style="font-size:19px"><b>Gear ratio = number of teeth on the driven gear ÷ number of teeth on the driver gear</b></p>
 <p style="font-size:19px"><b>Output speed = input speed ÷ gear ratio</b></p>
 <p>Example: driver 20 teeth, driven 60 teeth. Gear ratio = 60 ÷ 20 = 3, written <b>3:1</b>. If the driver turns at 120 rpm, the driven gear turns at 120 ÷ 3 = <b>40 rpm</b>.</p>
 <h4>Pulleys and belts</h4>
 <p>Two pulley wheels joined by a belt. Both turn the <b>same way</b> (unless the belt is crossed). A belt can <b>slip</b> if the machine jams, which protects the motor. A pillar drill uses stepped pulleys to change speed.</p>
 <p style="font-size:19px"><b>Velocity ratio = diameter of the driven pulley ÷ diameter of the driver pulley</b></p>
 <p style="font-size:19px"><b>Output speed = input speed ÷ velocity ratio</b></p>
 <p>Example: driver pulley 40 mm, driven pulley 120 mm. Velocity ratio = 120 ÷ 40 = 3. A motor at 1500 rpm gives an output of 1500 ÷ 3 = <b>500 rpm</b>.</p>
 <table><tr><th></th><th>Gears</th><th>Pulleys and belt</th></tr>
 <tr><td>Direction</td><td>Opposite</td><td>Same</td></tr>
 <tr><td>Slip</td><td>Cannot slip: exact timing</td><td>Can slip: protects the motor, but less precise</td></tr>
 <tr><td>Distance apart</td><td>Must touch</td><td>Can be far apart</td></tr>
 <tr><td>Noise and upkeep</td><td>Noisier; need lubricating</td><td>Quiet; belt wears and needs replacing</td></tr></table>` },
 { calc: [
  ['A driver gear has 15 teeth and the driven gear has 45 teeth. What is the gear ratio? (Give the first number of the ratio ?:1.)', 3, 0, '', 'Gear ratio = driven ÷ driver = 45 ÷ 15 = 3, so 3:1.'],
  ['The driver gear in that gear train turns at 240 rpm. What is the speed of the driven gear, in rpm?', 80, 0, 'rpm', 'Output speed = 240 ÷ 3 = 80 rpm.'],
  ['A driver gear with 40 teeth turns a driven gear with 10 teeth. The driver turns at 50 rpm. What is the speed of the driven gear, in rpm?', 200, 0, 'rpm', 'Gear ratio = 10 ÷ 40 = 0.25 (1:4). Output speed = 50 ÷ 0.25 = 200 rpm: a large driver makes a small gear turn faster.'],
  ['A motor pulley is 30 mm in diameter and turns at 1200 rpm. It drives a pulley 90 mm in diameter. What is the speed of the driven pulley, in rpm?', 400, 0, 'rpm', 'Velocity ratio = 90 ÷ 30 = 3. Output speed = 1200 ÷ 3 = 400 rpm.'],
 ] },
 { tf: [
  ['Two meshed gears turn in the same direction.', false, 'Opposite directions. An idler gear makes them turn the same way.'],
  ['An idler gear changes the gear ratio.', false, 'It only changes the direction.'],
  ['A belt drive can slip, which can protect a motor if the machine jams.', true, 'Gears cannot slip.'],
  ['A small driver gear turning a large driven gear gives a slower output.', true, 'The output is slower, with more turning force.'],
 ] },
]},

{ t: 'Exam practice', spec: '3.1.5', blocks: [
 { mcq: [
  ['Which is a second order lever?', ['Scissors', 'Tweezers', 'Wheelbarrow', 'Seesaw'], 2, 'The load is between the fulcrum (wheel) and the effort (handles).'],
  ['What type of motion does a pendulum have?', ['Linear', 'Rotary', 'Reciprocating', 'Oscillating'], 3, 'It swings in an arc.'],
  ['Which mechanism would change rotary motion into reciprocating motion?', ['Bell crank', 'Cam and follower', 'Simple gear train', 'Pulley and belt'], 1, 'The cam rotates; the follower reciprocates.'],
  ['A driver gear turns clockwise and meshes with a driven gear. An idler gear is then added between them. Which way does the driven gear turn now?', ['Clockwise', 'Anticlockwise', 'It does not turn', 'Both ways'], 0, 'Driver clockwise, idler anticlockwise, driven clockwise.'],
 ] },
 { exam: [
  ['**Give** one example of a product that uses a first order lever and **state** where the fulcrum is.', 2, ['Valid product, e.g. scissors, pliers, seesaw, crowbar (1)', 'Fulcrum correctly located, e.g. the rivet / pivot between the handles and blades; between the effort and the load (1)']],
  ['A pear-shaped cam is used in a moving toy. **Describe** the movement of the follower during one full turn of the cam.', 3, ['For about half the turn the follower stays still: the dwell (1)', 'It then rises as the pointed part of the cam comes round (1)', 'and falls back to its starting position (1)']],
  ['A pillar drill uses a pulley and belt drive rather than gears. **Explain** two reasons for this.', 4, ['The belt can slip if the drill bit jams (1) so the motor and the user are protected (1)', 'Moving the belt to different steps on the pulleys (1) changes the speed for different materials and drill sizes (1)', 'Accept: quieter and needs no lubrication (1) so it is cleaner and cheaper to maintain (1)']],
  ['A driver gear with 18 teeth turns at 300 rpm and meshes with a driven gear with 54 teeth. **Calculate** the speed of the driven gear. Show your working.', 3, ['Gear ratio = 54 ÷ 18 (1)', '= 3 (or 3:1) (1)', 'Output speed = 300 ÷ 3 = 100 rpm (1)', 'Full marks for the correct answer']],
 ] },
 { nea: 'If your NEA product has moving parts, name the mechanism properly, label the input and output motion with the correct arrows, and show any gear or lever calculation you used.' },
]},

]});
