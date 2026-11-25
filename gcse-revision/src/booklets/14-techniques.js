/* 3.2.8 Specialist techniques and processes (AQA 8552, specialist technical principles) */
SPEC.push(
 ['q14a', 14, '3.2.8', 'Production aids and tolerances', 'Measurement and reference points · templates, jigs and patterns · working to a tolerance: minimum and maximum measurements', '**Explain** why a drilling jig is used when making a batch of identical parts.', 2, ['The jig holds each part in the same position and guides the drill (1)', 'so every hole is in exactly the same place without marking out each one, which is quicker and more accurate (1)']],
 ['q14b', 14, '3.2.8', 'Wastage processes', 'Die cutting, perforation, turning, sawing, milling, drilling, cutting and shearing', '**Describe** the difference between turning and milling.', 2, ['Turning: the workpiece rotates in a lathe and a non-rotating cutting tool is fed against it, producing round (cylindrical) shapes (1)', 'Milling: a rotating cutter removes material from a workpiece that is clamped to a moving table, producing flat surfaces, slots and pockets (1)']],
 ['q14c', 14, '3.2.8', 'Addition processes', 'Brazing, welding, lamination, soldering, 3D printing, batik, sewing, bonding, printing', '**Describe** how a 3D printer builds up a part.', 3, ['A CAD model is sliced into thin layers by software (1)', 'A heated nozzle melts polymer filament and lays down the first layer on the bed (1)', 'It builds the part one layer on top of another until it is complete (1)']],
 ['q14d', 14, '3.2.8', 'Deforming and reforming processes', 'Vacuum forming, creasing, pressing, drape forming, bending, folding, blow moulding, casting, injection moulding, extrusion', '**Describe** the process of vacuum forming.', 4, ['A mould (former) is placed on the platen and a thermoforming sheet such as HIPS is clamped above it (1)', 'The sheet is heated until it is soft and flexible (1)', 'The mould is raised into the sheet and the air is sucked out, so the sheet is pulled tightly over the mould (1)', 'It is cooled, the mould is removed and the waste is trimmed off (1)']],
 ['q14e', 14, '3.2.8', 'Commercial processes and quality control', 'Offset lithography, die cutting · routing, turning · milling, casting · injection moulding, extrusion · weaving, dyeing, printing · pick and place, flow soldering · quality control checks', '**Explain** how a go/no go gauge is used for quality control.', 3, ['It has two ends (or slots) made to the largest and smallest sizes allowed by the tolerance (1)', 'A correct part fits the “go” end but not the “no go” end (1)', 'so parts are checked very quickly without measuring, and any outside the tolerance are rejected (1)']],
);
BOOKLETS.push({ id: 'g14', topic: 14, title: 'Specialist techniques and processes', pages: [

{ t: 'Overview and key words', blocks: [
 { notes: `<p class="lead">How things are actually made, in school and in industry. Processes are grouped by what they do to the material.</p>
 <table><tr><th>Group</th><th>What happens</th><th>Examples</th></tr>
 <tr><td><b>Wastage</b></td><td>Material is <b>removed</b></td><td>Sawing, drilling, turning, milling, die cutting</td></tr>
 <tr><td><b>Addition</b></td><td>Material is <b>added or joined</b></td><td>Welding, brazing, soldering, sewing, 3D printing</td></tr>
 <tr><td><b>Deforming and reforming</b></td><td>The <b>shape is changed</b> without adding or removing material. Deforming works on solid material; reforming melts it and shapes it in a mould</td><td>Bending, pressing, vacuum forming; casting, injection moulding, extrusion</td></tr></table>
 <table><tr><th>Page</th><th>What it covers</th></tr>
 <tr><td>2</td><td>Production aids and working to a tolerance</td></tr>
 <tr><td>3</td><td>Wastage processes</td></tr>
 <tr><td>4</td><td>Addition processes</td></tr>
 <tr><td>5</td><td>Deforming and reforming processes</td></tr>
 <tr><td>6</td><td>Commercial processes</td></tr>
 <tr><td>7</td><td>Quality control and exam practice</td></tr></table>` },
 { keys: [
  ['Datum', 'A reference point, line or face that all measurements are taken from'],
  ['Template', 'A shape that is drawn or cut round to mark out identical parts'],
  ['Jig', 'A device that holds the work and guides the tool so that a process is repeated accurately'],
  ['Pattern', 'A copy of the product used to make a mould for casting; in textiles, the paper shapes used to cut fabric'],
  ['Tolerance', 'The amount a measurement is allowed to vary: the minimum and maximum acceptable sizes'],
  ['Wastage', 'Shaping by removing material'],
  ['Addition', 'Shaping or joining by adding material'],
  ['Deforming', 'Changing the shape of a solid material by bending, pressing or stretching it'],
  ['Reforming', 'Melting a material and shaping it in a mould'],
  ['Die', 'A shaped tool that cuts or forms material: a sharp blade for die cutting, a shaped hole for extrusion'],
  ['Quality control', 'Checks and measurements made during manufacture to make sure products meet the specification'],
  ['Registration marks', 'Small printed marks used to check that each colour in a print is lined up correctly'],
 ] },
]},

{ t: 'Production aids and tolerances', spec: '3.2.8', blocks: [
 { notes: `<h4>Production aids</h4>
 <table><tr><th>Aid</th><th>What it is</th><th>Why it is used</th></tr>
 <tr><td><b>Measurement and reference points</b></td><td>A <b>datum</b>: one corner, edge or face that every measurement is taken from</td><td>Errors do not add up. Measuring each hole from the last one lets small mistakes build; measuring them all from the datum does not</td></tr>
 <tr><td><b>Template</b></td><td>A shape in card, MDF, acrylic or thin metal that you draw or cut round</td><td>Marks out identical shapes quickly, especially curves; no measuring each time</td></tr>
 <tr><td><b>Jig</b></td><td>A device that holds the work in position and guides the tool: a drilling jig, a sawing jig, a bending jig</td><td>Every part is made the same; faster; less skill needed; no marking out</td></tr>
 <tr><td><b>Pattern</b></td><td>In casting, a model of the product used to make the mould. In textiles, paper pieces pinned to the fabric and cut round</td><td>Gives the mould or the fabric pieces the correct shape and size, again and again</td></tr></table>
 <p>Production aids take time to make, so they are worth it for <b>batches</b>, not for a single product.</p>
 <h4>Working to a tolerance</h4>
 <p>Nothing can be made perfectly to size. A <b>tolerance</b> is the amount of error that is allowed. It is written with a ± sign.</p>
 <p style="font-size:19px"><b>50 mm ± 0.5 mm</b> means the part is acceptable from <b>49.5 mm (minimum)</b> to <b>50.5 mm (maximum)</b>.</p>
 <ul><li><b>Maximum</b> = size + tolerance. <b>Minimum</b> = size − tolerance.</li>
 <li>A <b>tight</b> (small) tolerance is needed where parts must fit together, such as a shaft in a bearing. It costs more because it needs better machines and more checking.</li>
 <li>A <b>loose</b> (large) tolerance is fine where exact size does not matter, such as the length of a fence post.</li></ul>` },
 { calc: [
  ['A dowel must be 12 mm ± 0.2 mm in diameter. What is the maximum acceptable diameter, in mm?', 12.2, 0.001, 'mm', '12 + 0.2 = 12.2 mm.'],
  ['A panel is specified as 300 mm ± 2 mm. What is the minimum acceptable length, in mm?', 298, 0, 'mm', '300 − 2 = 298 mm.'],
  ['A part is specified as 75.0 mm ± 0.5 mm. Five parts measure 74.4, 74.8, 75.0, 75.5 and 75.6 mm. How many are within tolerance?', 3, 0, '', 'Acceptable range is 74.5 to 75.5 mm. 74.8, 75.0 and 75.5 pass; 74.4 and 75.6 fail.'],
 ] },
 { match: { q: 'Match each production aid to its job.', lh: 'Aid', rh: 'Job', pairs: [['Datum', 'The point all measurements are taken from'], ['Template', 'Drawn or cut round to mark out a shape'], ['Jig', 'Holds the work and guides the tool'], ['Pattern', 'Used to make the mould for a casting']] } },
 { tf: [
  ['A jig is worth making for a single one-off product.', false, 'It takes time to make, so it pays off over a batch.'],
  ['Measuring every hole from the same datum edge stops errors adding up.', true, 'This is why a datum is used.'],
  ['A tight tolerance is cheaper to achieve than a loose one.', false, 'It needs more accurate machines and more checking.'],
 ] },
]},

{ t: 'Wastage processes', spec: '3.2.8', blocks: [
 { notes: `<table><tr><th>Process</th><th>What happens</th><th>Used for</th></tr>
 <tr><td><b>Sawing</b></td><td>A toothed blade cuts a narrow slot (the kerf). Tenon saw for straight cuts in timber, coping saw for curves, hacksaw for metal; band saw and scroll saw are powered</td><td>Cutting timber, metal and polymers to size and shape</td></tr>
 <tr><td><b>Drilling</b></td><td>A rotating drill bit cuts a round hole. Twist bits for general use; flat and Forstner bits for larger holes in timber; a countersink bit lets a screw head sit flush</td><td>Holes for screws, bolts, dowels and components</td></tr>
 <tr><td><b>Turning</b></td><td>The work spins in a <b>lathe</b> and a cutting tool is moved against it</td><td>Round parts: chair legs, bowls, handles; metal shafts and threads</td></tr>
 <tr><td><b>Milling</b></td><td>A rotating multi-toothed cutter removes material from work clamped to a moving table. A <b>router</b> does the same job on timber</td><td>Flat surfaces, slots, grooves and pockets; CNC milling and routing make complex shapes</td></tr>
 <tr><td><b>Cutting and shearing</b></td><td>Blades slice the material: craft knife, scissors, tin snips, guillotine. A laser cutter cuts by burning or vaporising a narrow line</td><td>Paper, card, fabric, thin sheet metal and polymer sheet</td></tr>
 <tr><td><b>Die cutting</b></td><td>A shaped steel blade set in a board (a <b>die</b>, or cutting forme) is pressed through the material like a pastry cutter. Blunt rules in the same die make creases</td><td>Cutting and creasing packaging nets, labels, leather, fabric, gaskets: thousands the same</td></tr>
 <tr><td><b>Perforation</b></td><td>A row of small holes or slits is punched through the material</td><td>Tear-off tickets and vouchers, stamps, easy-open packaging</td></tr></table>
 <p><b>Abrading</b> (filing, sanding, grinding) also removes material and is used to smooth and finish.</p>
 <p>The drawback of every wastage process is in the name: the material removed is <b>waste</b>, which costs money and must be recycled or disposed of.</p>` },
 { match: { q: 'Choose the best wastage process for each job.', lh: 'Job', rh: 'Process', pairs: [['Making a round wooden chair leg', 'Turning'], ['Cutting a slot in a block of aluminium', 'Milling'], ['Cutting out 5000 identical card box nets', 'Die cutting'], ['Making a ticket with a tear-off stub', 'Perforation'], ['Cutting a curve in thin plywood by hand', 'Sawing with a coping saw'], ['Cutting thin sheet steel by hand', 'Shearing with tin snips']] } },
 { mcq: [
  ['In which process does the workpiece rotate?', ['Milling', 'Turning', 'Drilling', 'Die cutting'], 1, 'On a lathe the work spins and the tool is fed in.'],
  ['What is the “kerf”?', ['A type of saw', 'The slot removed by a saw blade', 'A reference edge', 'A kind of jig'], 1, 'It must be allowed for when marking out.'],
 ] },
]},

{ t: 'Addition processes', spec: '3.2.8', blocks: [
 { notes: `<table><tr><th>Process</th><th>What happens</th><th>Used for</th></tr>
 <tr><td><b>Soldering</b></td><td>Solder (a tin alloy with a low melting point) is melted with a soldering iron to join metal parts. The parts themselves do not melt</td><td>Electronic components on a PCB; small joints in copper and brass</td></tr>
 <tr><td><b>Brazing</b></td><td>The joint is heated with a gas torch to about 900 °C and a brass filler rod (spelter) is melted into it, with flux to keep it clean</td><td>Joining steel and copper: bike frames, brackets. Stronger than solder, weaker than a weld</td></tr>
 <tr><td><b>Welding</b></td><td>The edges of the parts are <b>melted so they fuse</b>, usually with a filler. MIG welding uses an electric arc and a shielding gas. Polymers can be welded with heat or solvent</td><td>Very strong permanent joints in steel frames, car bodies, gates</td></tr>
 <tr><td><b>Bonding</b></td><td>An adhesive joins the surfaces: PVA for timber, contact adhesive for sheet materials, epoxy for different materials, solvent cement for acrylic. Textiles are bonded with a fusible web</td><td>Permanent joints with no visible fixings</td></tr>
 <tr><td><b>Lamination</b></td><td>Layers are bonded together: veneers into plywood or a curved shape; a polymer film onto card; layers of fabric</td><td>Strength, stiffness, curved forms, protection</td></tr>
 <tr><td><b>Sewing</b></td><td>Thread is passed through layers of fabric to join them: plain seam, French seam, overlocked edge</td><td>Garments, bags, upholstery</td></tr>
 <tr><td><b>3D printing</b></td><td>A CAD model is sliced into layers and built up one layer at a time, usually by melting polymer filament through a nozzle</td><td>Prototypes, one-off and complex parts with no tooling. Slow for large numbers</td></tr>
 <tr><td><b>Printing</b></td><td>Ink or dye is added to the surface: screen printing, block printing, digital (ink-jet) printing, transfer printing</td><td>Graphics on paper, card, fabric and polymer</td></tr>
 <tr><td><b>Batik</b></td><td>Hot wax is applied to fabric as a <b>resist</b>. The fabric is dyed, and the waxed areas stay undyed. The wax is then removed</td><td>Decorative patterns on fabric</td></tr></table>
 <p><b>Soldering, brazing and welding compared:</b> the temperature and the strength both go up in that order. Only welding melts the parts being joined.</p>` },
 { order: { q: 'Put the stages of batik in order.', steps: ['Draw the design on the fabric', 'Apply hot wax to the areas that must stay undyed', 'Dye the fabric', 'Leave it to dry', 'Remove the wax by ironing between sheets of paper'] } },
 { sort: { q: 'Which joining process?', cats: ['Soldering', 'Brazing', 'Welding'], items: [['Joining a resistor to a circuit board', 0], ['The parts being joined melt and fuse', 2], ['A brass filler rod is used at about 900 °C', 1], ['The strongest of the three', 2], ['The lowest temperature of the three', 0], ['Stronger than soldering, but the parts being joined do not melt', 1]] } },
 { mcq: [
  ['Which adhesive is normally used to join two pieces of pine?', ['Solvent cement', 'PVA', 'Superglue', 'Hot-melt glue'], 1, 'PVA soaks into the wood fibres and sets strong when clamped.'],
  ['What is the main advantage of 3D printing for a prototype?', ['It is the fastest way to make thousands', 'No mould or tooling is needed, so a complex one-off can be made straight from CAD', 'It uses no energy', 'It only works with metals'], 1, 'There is no tooling cost.'],
 ] },
]},

{ t: 'Deforming and reforming processes', spec: '3.2.8', blocks: [
 { notes: `<h4>Deforming: the material stays solid</h4>
 <table><tr><th>Process</th><th>What happens</th><th>Used for</th></tr>
 <tr><td><b>Bending and folding</b></td><td>Sheet metal is bent in a vice or folding machine. Acrylic is heated along a line on a <b>line bender</b> (strip heater) and bent, often round a jig. Timber can be steam bent</td><td>Brackets, boxes, trays, acrylic stands</td></tr>
 <tr><td><b>Creasing</b></td><td>A line is pressed into paper or card so it folds cleanly without cracking</td><td>Cartons, greetings cards, folders</td></tr>
 <tr><td><b>Pressing</b></td><td>Sheet material is squeezed between two shaped dies in a press</td><td>Car body panels, steel sinks, baking trays; pressing garments</td></tr>
 <tr><td><b>Drape forming</b></td><td>A heated polymer sheet is laid over a former and takes its shape under its own weight (or is pressed down by hand)</td><td>Simple curves: acrylic trays, visors, shallow dishes</td></tr>
 <tr><td><b>Vacuum forming</b></td><td>A heated thermoforming sheet (often HIPS) is pulled down over a mould by sucking out the air. The mould needs sloping sides (a <b>draft angle</b>), rounded corners and small vent holes</td><td>Packaging trays, blister packs, yoghurt pots, masks, baths</td></tr></table>
 <h4>Reforming: the material is melted and shaped in a mould</h4>
 <table><tr><th>Process</th><th>What happens</th><th>Used for</th></tr>
 <tr><td><b>Casting</b></td><td>Molten metal is poured into a mould and left to solidify. In <b>sand casting</b> a pattern makes the hollow in the sand. <b>Die casting</b> forces metal into a steel mould. Resin can be cast cold</td><td>Complex solid shapes: engine blocks, vices, door handles, jewellery</td></tr>
 <tr><td><b>Injection moulding</b></td><td>Polymer granules are melted in a heated barrel and a screw forces the melt into a closed steel mould. It cools, the mould opens and the part is ejected</td><td>Very large numbers of complex, accurate parts: bottle caps, chairs, casings, toy bricks. The mould is very expensive</td></tr>
 <tr><td><b>Blow moulding</b></td><td>A tube of hot polymer (a parison) is clamped in a mould and air is blown in, so it expands to the shape of the mould</td><td>Hollow products: bottles, fuel tanks, watering cans</td></tr>
 <tr><td><b>Extrusion</b></td><td>Melted polymer is pushed by a screw (or a hot aluminium billet is pushed by a ram) through a shaped hole called a die, like toothpaste from a tube, giving a long length with the same cross-section</td><td>Pipes, guttering, window frames, curtain track, cable insulation</td></tr></table>` },
 { order: { q: 'Put the stages of injection moulding in order.', steps: ['Polymer granules are fed from the hopper into the barrel', 'Heaters melt the granules as the screw turns', 'The screw pushes the molten polymer into the closed mould', 'The polymer cools and solidifies in the mould', 'The mould opens and ejector pins push the part out'] } },
 { match: { q: 'Choose the process used to make each product.', lh: 'Product', rh: 'Process', pairs: [['A fizzy drinks bottle', 'Blow moulding'], ['A length of plastic drainpipe', 'Extrusion'], ['A plastic bottle cap', 'Injection moulding'], ['A chocolate box tray', 'Vacuum forming'], ['A cast-iron bench vice', 'Casting'], ['A steel car door panel', 'Pressing']] } },
 { tf: [
  ['A vacuum forming mould should have vertical sides and sharp corners.', false, 'It needs a draft angle and rounded corners so the sheet does not thin and the mould can be removed.'],
  ['Extrusion makes long lengths with the same cross-section.', true, 'Pipes, tubes and window frame sections.'],
  ['Injection moulding is economical for making ten products.', false, 'The mould costs thousands of pounds, so it suits very large numbers.'],
 ] },
]},

{ t: 'Commercial processes', spec: '3.2.8', blocks: [
 { notes: `<p>The specification names two commercial processes for each material area. Learn the pair for your area in detail.</p>
 <table><tr><th>Material area</th><th>Process</th><th>How it works</th></tr>
 <tr><td rowspan="2"><b>Papers and boards</b></td><td><b>Offset lithography</b></td><td>The image is on an aluminium plate. It works because oil and water do not mix: the image area takes up oily ink and the damp non-image area repels it. The inked image is transferred (offset) to a rubber blanket cylinder and then to the paper. Four plates print cyan, magenta, yellow and black (CMYK). Fast, high quality; suits runs of 1000 or more: magazines, leaflets, packaging</td></tr>
 <tr><td><b>Die cutting</b></td><td>A die with sharp steel rules cuts the shape and blunt rules crease the folds, in one press</td></tr>
 <tr><td rowspan="2"><b>Timber</b></td><td><b>Routing</b></td><td>A high-speed rotating cutter shapes edges and cuts grooves, slots and profiles. CNC routers cut whole sets of parts from sheets</td></tr>
 <tr><td><b>Turning</b></td><td>Copy and CNC lathes turn identical legs, spindles and handles</td></tr>
 <tr><td rowspan="2"><b>Metals</b></td><td><b>Milling</b></td><td>CNC milling machines cut parts accurately from a block or casting</td></tr>
 <tr><td><b>Casting</b></td><td>Sand casting for large or low-volume parts; die casting for large numbers of accurate parts in aluminium or zinc</td></tr>
 <tr><td rowspan="2"><b>Polymers</b></td><td><b>Injection moulding</b></td><td>See the previous page: complex parts in very large numbers</td></tr>
 <tr><td><b>Extrusion</b></td><td>Continuous lengths of constant cross-section</td></tr>
 <tr><td rowspan="3"><b>Textiles</b></td><td><b>Weaving</b></td><td>Industrial looms interlace warp and weft yarns at high speed</td></tr>
 <tr><td><b>Dyeing</b></td><td>Colour is added to the fibre, the yarn, the fabric (piece dyeing) or the finished garment in large vats</td></tr>
 <tr><td><b>Printing</b></td><td>Rotary screen printing uses a cylindrical screen for each colour; digital printing sprays dye straight from a computer file</td></tr>
 <tr><td rowspan="2"><b>Systems</b></td><td><b>Pick and place assembly</b></td><td>A robot picks surface-mount components from reels and places them on the PCB at very high speed and accuracy</td></tr>
 <tr><td><b>Flow soldering</b></td><td>The populated PCB passes over a wave of molten solder, which solders every joint at once</td></tr></table>` },
 { gap: { text: 'Offset lithography works because {{oil}} and water do not mix. The image is transferred from the plate to a rubber {{blanket}} and then to the paper. Full colour is printed using four inks: cyan, magenta, yellow and {{black}}. It is best for {{long}} print runs.', extra: ['short', 'red', 'steel'] } },
 { mcq: [
  ['Which process places components on a circuit board in industry?', ['Flow soldering', 'Pick and place', 'Die cutting', 'Extrusion'], 1, 'Flow soldering then solders them.'],
  ['Which commercial process would be used to print 50,000 leaflets?', ['Batik', 'Offset lithography', 'Block printing', '3D printing'], 1, 'Fast and cheap per copy on long runs.'],
  ['Which two commercial processes are named for polymers?', ['Routing and turning', 'Milling and casting', 'Injection moulding and extrusion', 'Weaving and dyeing'], 2, 'Learn the pair for your material area.'],
 ] },
]},

{ t: 'Quality control and exam practice', spec: '3.2.8', blocks: [
 { notes: `<p><b>Quality control (QC)</b> means checking the product <b>during manufacture</b>, using measurements and numbers, so that faults are found before more are made.</p>
 <table><tr><th>Material area</th><th>QC check in the specification</th><th>How it works</th></tr>
 <tr><td><b>Papers and boards</b></td><td><b>Registration marks</b></td><td>Small crosses printed in every colour outside the image area. If the colours are lined up, the marks sit exactly on top of each other. Colour bars check the ink density</td></tr>
 <tr><td><b>Timber</b></td><td><b>Go/no go fixture</b> for dimensional accuracy</td><td>A gauge made to the largest and smallest sizes allowed. A good part fits “go” but not “no go”. Much faster than measuring</td></tr>
 <tr><td><b>Metals</b></td><td><b>Depth stop</b> for dimensional accuracy</td><td>A stop on the drill or machine prevents it cutting deeper than a set depth, so every hole or cut is the same</td></tr>
 <tr><td><b>Polymers</b></td><td><b>Correct laser settings</b> for dimensional accuracy</td><td>Power and speed are set for the material and thickness, so the cut is clean, goes right through and is the right size. A test cut is made first</td></tr>
 <tr><td><b>Textiles</b></td><td><b>Checking a repeating print against an original sample</b></td><td>The printed fabric is compared with the approved sample for colour, position and the size of the repeat</td></tr>
 <tr><td><b>Systems</b></td><td><b>UV exposure, developing and etching times</b> in PCB manufacture</td><td>Each stage is timed. Too long in the etch tank and the tracks are eaten away; too short and unwanted copper remains</td></tr></table>
 <p>Other QC tools: steel rule, try square, <b>vernier callipers</b> and <b>micrometers</b> for accurate measuring; visual checks; testing a sample from each batch.</p>` },
 { match: { q: 'Match each quality control check to what it controls.', lh: 'Check', rh: 'Controls', pairs: [['Registration marks', 'Whether the printed colours line up'], ['Go/no go gauge', 'Whether a part is within its size tolerance'], ['Depth stop', 'How deep a hole is drilled'], ['Timing the etch tank', 'Whether PCB tracks are fully formed'], ['Comparing with an approved sample', 'Colour and repeat of a printed fabric']] } },
 { exam: [
  ['**State** the minimum and maximum acceptable sizes for a part that is 120 mm ± 1.5 mm.', 1, ['Minimum 118.5 mm and maximum 121.5 mm (1) (both needed)']],
  ['**Explain** why a template is used when marking out a batch of curved chair backs.', 2, ['The template is drawn round, so the same shape is marked each time without measuring (1)', 'which is quicker and makes every part identical, especially for curves that are hard to measure (1)']],
  ['**Explain** why a vacuum forming mould needs a draft angle.', 2, ['The sides slope inwards slightly towards the top (1)', 'so the formed sheet can be lifted off the mould without sticking or tearing (1)']],
  ['**Describe** the process of extrusion.', 3, ['Polymer granules are melted in a heated barrel (1)', 'A rotating screw forces the molten polymer through a shaped die (1)', 'The continuous length is cooled, usually in water, and cut to length (1)']],
  ['For a product made from a material you have studied, **describe** in detail how it would be manufactured in a batch of 100. Include the production aids and quality control checks that would be used.', 8, ['A named product and specific material, with the stock form it starts as', 'Marking out using a datum and a template, or parts cut by CNC or laser from a CAD file', 'Wastage processes named correctly, with the tools or machines used', 'Jigs for repeated operations such as drilling, bending or assembly, and why', 'Deforming, reforming or addition processes named correctly, e.g. line bending on a former, brazing, sewing with a seam allowance', 'Tolerance stated for a critical dimension and how it is checked, e.g. go/no go gauge, depth stop, callipers', 'Finishing, and a final quality check against the specification', 'Steps in a logical order, with safety noted where relevant']],
 ] },
 { nea: 'Photograph every jig, template and former you make for your NEA and say why it improved accuracy. State the tolerance you worked to on at least one critical dimension and show yourself checking it.' },
]},

]});
