/* Topic 3: Processes, techniques and specialist tools (Edexcel 9DT0 3.1–3.5) */
BOOKLETS.push({ id: 't3', topic: 3, title: 'Manufacturing processes', pages: [

{ t: 'How to use this booklet', blocks: [
 { notes: `<p class="lead">Topic 3 is the biggest in the paper. For each process you need to be able to <b>describe the stages in order</b>, name the <b>materials</b> it suits, give <b>products</b> made by it, and explain its <b>advantages and disadvantages</b>, especially the link to <b>scale of production</b>.</p>
 <table><tr><th>Page</th><th>Spec</th><th>Covers</th></tr>
 <tr><td>2</td><td>3.1</td><td>Heat treatment and alloying</td></tr>
 <tr><td>3</td><td>3.1</td><td>Printing processes</td></tr>
 <tr><td>4</td><td>3.1</td><td>Casting</td></tr>
 <tr><td>5</td><td>3.1</td><td>Machining and sheet forming</td></tr>
 <tr><td>6</td><td>3.1</td><td>Moulding, extrusion and lamination</td></tr>
 <tr><td>7</td><td>3.2</td><td>Marking out, measuring, jigs and quality control</td></tr>
 <tr><td>8</td><td>3.3</td><td>Communicating design</td></tr>
 <tr><td>9</td><td>3.4</td><td>Joining</td></tr>
 <tr><td>10</td><td>3.5</td><td>Finishing and preservation</td></tr>
 <tr><td>11</td><td>All</td><td>Choosing a process: mixed exam practice</td></tr></table>
 <div class="tip"><b>The 4-mark “describe a process” question</b> wants the stages in the right order with the key technical words: name the equipment (die, pattern, mould, parison, sprue, ejector pins), say what happens to the material (heated, forced, cooled, removed). Practise saying each process out loud in five steps.</div>` },
 { keys: [
  ['One-off', 'A single product made to order, usually by hand; high unit cost'],
  ['Batch production', 'A set quantity of identical products made, then the line changes to another product'],
  ['Mass production', 'Large numbers made continuously on a production line; low unit cost'],
  ['Tooling', 'Moulds, dies, jigs and patterns made specially for a product; high set-up cost'],
  ['Unit cost', 'The cost of making one product'],
  ['Tolerance', 'The acceptable range above and below a stated size'],
  ['Draft angle', 'A slight taper on the sides of a mould or pattern so the part can be removed'],
 ] },
]},

{ t: 'Heat treatment and alloying', spec: '3.1', blocks: [
 { notes: `<h4>Why heat treat?</h4><p>Heating and cooling a metal in a controlled way changes its grain structure, and so its properties: making it harder, tougher, softer or easier to work.</p>
 <table><tr><th>Process</th><th>Method</th><th>Result</th><th>Used for</th></tr>
 <tr><td><b>Annealing</b></td><td>Heat to just above the upper critical temperature (steel: red hot); soak; cool <b>very slowly</b> (in the furnace or in ash). Copper: heat to dull red, cool in air or quench. Aluminium: heat until soap marks turn black, cool in air</td><td>Softest, most ductile state; removes work hardening and internal stress</td><td>Before bending, beating or spinning metal; between stages of forming</td></tr>
 <tr><td><b>Normalising</b></td><td>Heat steel just above the upper critical temperature; cool <b>in still air</b></td><td>Refines the grain, relieves stresses from forging or welding; tougher and more uniform than annealed, not as soft</td><td>Steel after forging or welding</td></tr>
 <tr><td><b>Hardening</b></td><td>Medium/high carbon steel only. Heat to cherry red (above upper critical); <b>quench</b> rapidly in water or oil</td><td>Very hard but brittle</td><td>First stage for chisels, drills, springs</td></tr>
 <tr><td><b>Tempering</b></td><td>After hardening: clean to bright metal; reheat gently (about 230–300°C) until the right oxide colour appears; quench</td><td>Removes some brittleness, adds toughness while keeping most hardness</td><td>Tools: pale straw (about 230°C) for scribers and lathe tools; brown/purple (about 260–270°C) for chisels and axes; blue (about 300°C) for springs and screwdrivers</td></tr>
 <tr><td><b>Case hardening</b></td><td>Low carbon (mild) steel. Heat to red, dip in carbon-rich powder (carburising) so the surface absorbs carbon; repeat; reheat and quench</td><td>Hard, wear-resistant <b>skin</b> with a tough, soft <b>core</b></td><td>Gears, cams, shafts, vice jaws, door hinges</td></tr></table>
 <h4>Work hardening</h4><p>Bending, hammering or rolling cold metal makes it harder and more brittle (try bending a paperclip back and forth). Annealing reverses this.</p>
 <h4>Alloying</h4><p>Adding other elements changes properties: <b>chromium</b> and nickel make steel stainless; <b>carbon</b> makes steel harder; <b>copper</b> makes aluminium stronger (duralumin); <b>zinc</b> with copper gives brass, which casts well. Alloys can also lower melting point (solder).</p>` },
 { order: { q: 'Put the stages of hardening and tempering a carbon steel chisel in order.', steps: ['Heat the tip to cherry red (above the upper critical temperature)', 'Quench in water or oil: now hard but brittle', 'Clean the blade back to bright metal with emery cloth', 'Reheat gently away from the tip and watch the oxide colours move', 'When brown/purple reaches the tip, quench again'] } },
 { match: { q: 'Match the heat treatment to its result.', lh: 'Process', rh: 'Result', pairs: [['Annealing', 'Softest and most ductile, stresses removed'], ['Normalising', 'Refined grain, stresses relieved after forging'], ['Hardening', 'Very hard but brittle'], ['Tempering', 'Less brittle, tougher, still hard'], ['Case hardening', 'Hard skin with a tough core']] } },
 { mcq: [
  ['Which steel can be hardened by heating and quenching?', ['Mild steel', 'High carbon steel', 'Stainless steel only', 'Wrought iron'], 1, 'At least about 0.4% carbon is needed. Mild steel can only be case hardened.'],
  ['The main difference between annealing and normalising is…', ['the temperature reached', 'the rate of cooling: very slow for annealing, still air for normalising', 'the metal used', 'quenching in oil'], 1, 'Annealing cools very slowly for maximum softness; normalising cools in air.'],
  ['Why are gear teeth case hardened?', ['To make them lighter', 'A hard surface resists wear, while the tough core resists shock loads', 'To stop rust', 'To make them easier to machine'], 1, 'Best of both: wear resistance outside, toughness inside.'],
  ['Which tempering colour suits a spring?', ['Pale straw', 'Dark straw', 'Blue', 'No tempering needed'], 2, 'Blue (about 300°C) gives the most toughness and springiness.'],
 ] },
 { exam: [
  ['**Describe** how a carbon steel chisel is hardened and tempered.', 4, ['Heat to cherry red / above upper critical temperature and quench in water/oil: hard but brittle (1)(1)', 'Clean to bright metal and reheat gently until correct oxide colour (brown/purple) (1)', 'Quench again: brittleness reduced, toughness increased, edge stays hard (1)']],
  ['**Explain** why a metalworker would anneal a sheet of copper while beating it into a bowl.', 3, ['Beating causes work hardening (1)', 'the copper becomes hard and brittle and would crack (1)', 'annealing softens it/restores malleability so it can be shaped further (1)']],
  ['**Explain** why case hardening is used for a mild steel component rather than hardening it fully.', 3, ['Mild steel has too little carbon to be hardened directly (1)', 'Case hardening adds carbon to the surface so only the skin hardens (1)', 'Gives a wear-resistant surface with a tough core that will not shatter (1)']],
 ] },
]},

{ t: 'Printing processes', spec: '3.1', blocks: [
 { notes: `<table><tr><th>Process</th><th>How it works</th><th>Advantages</th><th>Disadvantages</th><th>Products</th></tr>
 <tr><td><b>Offset lithography</b></td><td>Based on oil and water not mixing. Image areas on an aluminium plate attract oily ink; non-image areas are wetted with water. Ink transfers (offsets) from plate → rubber blanket cylinder → paper. One plate per colour (CMYK)</td><td>High quality, fast, consistent; plates cheap; low unit cost on medium–long runs</td><td>Set-up time and waste at the start; not economic for very short runs</td><td>Magazines, books, brochures, posters, leaflets, packaging</td></tr>
 <tr><td><b>Flexography</b></td><td>Flexible rubber/photopolymer <b>relief</b> plates (raised image) on rotating cylinders; fast-drying, often water-based inks</td><td>Prints on almost anything: plastic film, foil, corrugated board; very fast, continuous rolls</td><td>Lower detail and quality than litho or gravure</td><td>Plastic carrier bags, food packaging, labels, corrugated boxes, wallpaper</td></tr>
 <tr><td><b>Gravure</b></td><td>Image <b>etched</b> as tiny cells into a copper-plated cylinder. Ink fills the cells; a doctor blade wipes the surface clean; paper pressed on picks up the ink</td><td>Very high quality, consistent over huge runs, fast</td><td>Cylinders very expensive, so only for very long runs</td><td>High-circulation magazines and catalogues, postage stamps, high-quality flexible packaging, wallpaper</td></tr>
 <tr><td><b>Screen printing</b></td><td>Ink forced through a fine mesh with a squeegee; a stencil blocks non-image areas. One screen per colour</td><td>Prints on almost any surface, including curved and fabrics; thick, vivid, opaque ink; cheap set-up</td><td>Slow; one colour at a time; registration hard; limited fine detail</td><td>T-shirts, posters, signs, printed circuit boards, short runs</td></tr></table>
 <h4>Quality control in printing</h4>
 <ul><li><b>Registration marks</b> check each colour plate lines up.</li>
 <li><b>Colour bars</b> are measured with a <b>densitometer</b> to check ink density is consistent.</li>
 <li><b>Crop marks</b> show where to trim; <b>bleed</b> extends the image beyond the trim line.</li></ul>` },
 { match: { q: 'Match the printing process to the product.', lh: 'Process', rh: 'Product', pairs: [['Offset lithography', 'A school prospectus run of 5,000'], ['Flexography', 'A printed plastic carrier bag'], ['Gravure', 'Postage stamps printed in millions'], ['Screen printing', '30 band T-shirts']] } },
 { mcq: [
  ['Offset lithography works because…', ['the image is raised', 'oil-based ink and water repel each other', 'ink is forced through a mesh', 'the image is etched into cells'], 1, 'The plate is flat: grease-loving image areas take ink, water-loving areas do not.'],
  ['Why is the ink “offset” onto a rubber blanket first?', ['To dry it', 'The soft blanket presses the ink evenly onto the paper and protects the plate from wear', 'To reverse the colours', 'To add varnish'], 1, 'The blanket adapts to the paper surface and the plate lasts longer.'],
  ['Which process has the highest set-up cost?', ['Screen printing', 'Flexography', 'Gravure', 'Digital printing'], 2, 'Engraved cylinders are expensive, so gravure only pays on very long runs.'],
  ['What is a densitometer used for?', ['Measuring paper thickness', 'Measuring ink density on colour bars for consistent quality', 'Checking registration', 'Counting sheets'], 1, 'It measures how much light the printed colour reflects or absorbs.'],
 ] },
 { exam: [
  ['**Explain** why offset lithography is used to print magazines.', 2, ['Fast with cheap plates, so low unit cost on long runs (1)', 'High-quality, consistent colour on coated paper (1)']],
  ['**Describe** the screen printing process.', 4, ['Stencil made on a fine mesh screen to block non-image areas (1)', 'Screen placed on the material, ink placed at one end (1)', 'Squeegee drawn across to force ink through open areas (1)', 'Screen lifted, print dried; separate screen for each colour, registered (1)']],
  ['**Compare** flexography and gravure for printing crisp packets.', 4, ['Flexography: cheaper plates, prints on plastic/foil film, fast (1); lower quality (1)', 'Gravure: very high quality, consistent over very long runs (1); expensive cylinders, only economic for huge runs (1)']],
 ] },
]},

{ t: 'Casting', spec: '3.1', blocks: [
 { notes: `<h4>Sand casting</h4>
 <ol><li>A <b>pattern</b> (often jelutong or MDF, with <b>draft angles</b> and slightly oversized to allow for shrinkage) is placed in the bottom box, the <b>drag</b>.</li>
 <li>Casting sand is rammed around it. The drag is turned over, parting powder added, the top box (<b>cope</b>) added with <b>sprue</b> and <b>riser</b> pins, and rammed.</li>
 <li>The boxes are separated, the pattern and pins removed, and a <b>runner</b> cut to the cavity. Boxes are reassembled.</li>
 <li>Molten metal (often aluminium) is poured into the sprue until it rises up the riser (which shows the mould is full and feeds metal as it shrinks).</li>
 <li>When cool, the sand is broken away, sprue and riser are cut off, and the casting is <b>fettled</b> (cleaned up) and machined.</li></ol>
 <p><b>Safety:</b> the mould and tools must be completely dry; wear a face shield, leather apron, gauntlets and stout footwear; pour over a sand tray.</p>
 <p>✔ Cheap moulds, large parts, one-off and batch. ✘ Rough surface, poor accuracy, mould destroyed each time, needs machining.</p>
 <h4>Investment casting (lost wax)</h4>
 <ol><li>A <b>wax pattern</b> is made (often injection moulded), several joined on a wax “tree”.</li>
 <li>The tree is dipped repeatedly in <b>ceramic slurry</b> and sand to build a shell.</li>
 <li>It is heated: the wax melts out (lost), and the shell is fired hard.</li>
 <li>Molten metal is poured into the hot shell.</li>
 <li>The ceramic is broken off and parts cut from the tree.</li></ol>
 <p>✔ Very accurate, excellent finish, complex shapes and fine detail, high-melting-point metals. ✘ Slow, many stages, new pattern and shell every time.</p>
 <p><b>Products:</b> jewellery, turbine blades, golf club heads, dental crowns, medical implants.</p>
 <h4>Die casting</h4>
 <p>Molten <b>non-ferrous</b> metal (zinc, aluminium, magnesium alloys) is forced under <b>high pressure</b> into a split <b>steel die</b>, cooled, and ejected by ejector pins. Gravity die casting simply pours metal into the die.</p>
 <p>✔ Very fast, high volume, accurate, excellent finish, thin walls, little finishing. ✘ Steel dies very expensive; limited to lower-melting-point metals.</p>
 <p><b>Products:</b> toy cars, engine and gearbox casings, laptop and phone frames, taps, door handles.</p>
 <h4>Resin casting and plaster of Paris</h4>
 <p><b>Resin casting:</b> a master model is used to make a flexible <b>silicone mould</b>; two-part polyurethane or polyester resin is mixed and poured in, then removed when cured. Ideal for prototypes and short runs with fine detail.</p>
 <p><b>Plaster of Paris:</b> mixed with water and poured; sets quickly. Used to make moulds for <b>slip casting</b> ceramics (porous plaster draws water from the slip), to cast models, and (only when completely dried out, because damp plaster makes steam that can spit molten metal) for casting low-melting-point metals such as pewter.</p>` },
 { order: { q: 'Put the stages of sand casting in order.', steps: ['Place the pattern in the drag and ram sand around it', 'Add the cope with sprue and riser pins and ram sand', 'Separate the boxes, remove the pattern and pins, cut a runner', 'Reassemble and pour molten metal into the sprue until it shows in the riser', 'Allow to cool, break away the sand', 'Cut off sprue and riser and fettle the casting'] } },
 { order: { h: 'Investment casting', q: 'Put the stages of investment (lost wax) casting in order.', steps: ['Make wax patterns and attach them to a wax tree', 'Dip the tree in ceramic slurry and sand to build a shell', 'Heat to melt out the wax and fire the shell', 'Pour molten metal into the hot shell', 'Break off the ceramic and cut parts from the tree'] } },
 { match: { q: 'Which casting process?', lh: 'Product', rh: 'Process', pairs: [['10,000 die-cast model cars', 'Die casting'], ['A one-off aluminium bracket for a sculpture', 'Sand casting'], ['A silver ring with fine detail', 'Investment casting'], ['20 prototype phone cases to test grip', 'Resin casting in a silicone mould'], ['A batch of ceramic mugs', 'Slip casting in plaster of Paris moulds']] } },
 { mcq: [
  ['Why does a sand casting pattern have draft angles?', ['To save sand', 'So the pattern can be removed without damaging the mould', 'To make the casting stronger', 'For decoration'], 1, 'A slight taper lets the pattern lift cleanly out of the sand.'],
  ['What is the purpose of the riser?', ['To let air in', 'To show the mould is full and to feed metal as the casting shrinks', 'To cool the metal', 'To hold the pattern'], 1, 'Metal rising up the riser shows the cavity is full.'],
  ['Why is die casting limited mainly to non-ferrous metals?', ['They are lighter', 'Their lower melting points do not destroy the steel dies', 'Ferrous metals are too expensive', 'Ferrous metals cannot be cast'], 1, 'Steel and iron would erode and damage steel dies.'],
 ] },
 { exam: [
  ['**Describe** the process of sand casting an aluminium part.', 4, ['Pattern placed in drag, sand rammed; cope added with sprue and riser pins (1)', 'Pattern and pins removed, runner cut, cope and drag rejoined (1)', 'Molten aluminium poured into sprue until it appears in the riser (1)', 'Cooled, sand broken away, sprue/riser removed, casting fettled (1)']],
  ['**Explain** two reasons why pressure die casting is used for mass-produced laptop casings.', 4, ['High initial die cost spread over many units, low unit cost (1)(1)', 'Fast cycle time, high output (1)(1)', 'Accurate, thin walls, fine detail, good finish so little machining (1)(1)']],
  ['**Evaluate** the use of investment casting for producing turbine blades for jet engines.', 6, ['Very accurate and complex internal shapes (cooling channels) possible (1–2)', 'Works with high-melting-point superalloys; excellent surface finish (1)', 'Slow and expensive per part, many stages, new wax and shell each time (1–2)', 'Justified because performance and safety are critical and volumes are moderate (1)']],
 ] },
]},

{ t: 'Machining and sheet forming', spec: '3.1', blocks: [
 { notes: `<p>Machining is a <b>wasting</b> process: material is removed to leave the shape.</p>
 <table><tr><th>Process</th><th>How it works</th><th>Makes</th></tr>
 <tr><td><b>Turning</b> (centre lathe / CNC lathe)</td><td>The <b>workpiece rotates</b> in a chuck; a fixed single-point cutting tool moves along or across it. Operations: facing, parallel turning, taper turning, drilling, boring, knurling, parting off, thread cutting</td><td>Cylindrical parts: shafts, bolts, pins, handles, bowls (wood lathe)</td></tr>
 <tr><td><b>Milling</b> (vertical / horizontal / CNC)</td><td>A <b>multi-toothed cutter rotates</b>; the work is clamped to a table that moves in X, Y and Z</td><td>Flat faces, slots, pockets, steps, profiles, gear teeth</td></tr>
 <tr><td><b>Routing</b> (CNC router)</td><td>High-speed rotating cutter moving in X, Y, Z over sheet material</td><td>Profiles and pockets in wood, MDF, acrylic, foam; furniture parts, signs, moulds</td></tr>
 <tr><td><b>Drilling</b> (pillar drill / CNC)</td><td>Rotating twist drill, Forstner bit, flat bit or hole saw fed into clamped work</td><td>Holes, countersinks, counterbores</td></tr></table>
 <h4>Sheet forming</h4>
 <table><tr><th>Process</th><th>How it works</th><th>Makes</th></tr>
 <tr><td><b>Stamping</b> (blanking and piercing)</td><td>A <b>punch</b> forces sheet into a matching <b>die</b>, shearing out a shape (blanking keeps the piece; piercing keeps the sheet with a hole). Embossing and coining also stamp</td><td>Washers, coins, brackets, electrical contacts</td></tr>
 <tr><td><b>Press forming</b></td><td>Sheet metal is pressed between a male and female die (deep drawing pulls it into a cup shape)</td><td>Car body panels, sinks, drinks cans, saucepans</td></tr>
 <tr><td><b>Bending / folding</b></td><td>Sheet folded in a press brake or folding bars</td><td>Brackets, enclosures, sheet metal boxes</td></tr></table>
 <p>Presses run at high speed with expensive dies, so stamping and pressing suit <b>high-volume</b> production with low unit cost.</p>` },
 { sort: { h: 'Turning or milling?', q: 'Which machine would make each feature?', cats: ['Turning (lathe)', 'Milling'], items: [['A screw thread cut on a one-off steel bar', 0], ['A slot along a flat bar', 1], ['A knurled grip on a handle', 0], ['A square pocket in a block', 1], ['A tapered shaft', 0], ['Flat faces on a vice jaw', 1]] } },
 { mcq: [
  ['The key difference between turning and milling is…', ['milling is for wood only', 'in turning the work rotates; in milling the cutter rotates', 'turning is only CNC', 'milling makes cylinders'], 1, 'Turning: work spins against a fixed tool. Milling: cutter spins, work moves.'],
  ['Which process makes a car door panel?', ['Turning', 'Press forming', 'Sand casting', 'Routing'], 1, 'Sheet steel or aluminium is pressed between dies.'],
  ['Blanking means…', ['the piece cut out is the product', 'the sheet with the hole is the product', 'cutting threads', 'bending sheet'], 0, 'Blanking keeps the blank; piercing keeps the sheet.'],
  ['Which tool cuts a clean flat-bottomed hole in wood?', ['Twist drill', 'Forstner bit', 'Countersink', 'Tap'], 1, 'Forstner bits leave flat-bottomed holes, e.g. for concealed hinges.'],
 ] },
 { exam: [
  ['**Explain** one difference between turning and milling.', 2, ['Turning: workpiece rotates against a fixed tool, makes cylindrical parts (1)', 'Milling: cutter rotates and work is moved under it, makes flat faces/slots (1)']],
  ['**Describe** how a sheet steel washer is produced in high volume.', 3, ['Steel strip fed into a press (1)', 'punch pierces the centre hole (1)', 'second punch blanks out the outer circle: progression die / one stroke per washer (1)']],
  ['**Discuss** the use of CNC routing compared with hand cutting for producing batches of furniture parts in MDF.', 6, ['CNC: accurate, repeatable parts so they fit every time (1–2); fast, less skilled labour; complex shapes, nesting reduces waste (1–2)', 'Against: high machine cost, programming time; not economical for a single part (1)', 'Hand: flexible for one-offs, low equipment cost but slow and variable (1)', 'Judgement for batch production (1)']],
 ] },
]},

{ t: 'Moulding, extrusion and lamination', spec: '3.1', blocks: [
 { notes: `<h4>Injection moulding</h4>
 <ol><li>Thermoplastic granules (with colour masterbatch) are fed from a <b>hopper</b>.</li>
 <li>A rotating <b>screw</b> carries them through a heated barrel, melting them.</li>
 <li>The screw acts as a ram, forcing the melt under high pressure into a closed, cooled <b>steel mould</b>.</li>
 <li>Pressure is held while the part cools and solidifies.</li>
 <li>The mould opens and <b>ejector pins</b> push the part out. Sprue and runners are trimmed and recycled.</li></ol>
 <p>✔ Very fast, accurate, complex 3D shapes with ribs, bosses and clips, excellent finish, low unit cost. ✘ Moulds very expensive (often tens of thousands of pounds), long lead time. <b>Products:</b> phone cases, LEGO, bottle tops, casings, chairs.</p>
 <p>Look for <b>evidence</b> on products: ejector pin marks, sprue mark, split lines, ribs, constant wall thickness, draft angles.</p>
 <h4>Blow moulding</h4>
 <p>A hot tube of plastic (<b>parison</b>) is extruded or injection moulded (a <b>preform</b>). The mould closes around it and compressed air blows it out against the cold walls. <b>Products:</b> bottles, containers, watering cans. ✔ Fast, hollow parts. ✘ Only hollow shapes, uneven wall thickness, expensive moulds.</p>
 <h4>Vacuum forming</h4>
 <p>A thermoplastic sheet (HIPS, ABS, PETG, acrylic) is clamped and <b>heated</b> until soft. The <b>mould</b> (former) is raised into it and air is <b>sucked out</b>, so atmospheric pressure pushes the sheet onto the mould. It cools and is trimmed. Moulds need <b>draft angles</b>, rounded corners, no undercuts and vent holes.</p>
 <p>✔ Cheap moulds (wood, MDF, resin), quick; good for prototypes and batch. ✘ Only simple shallow shapes, thin walls, trimming waste. <b>Products:</b> packaging inserts and blister packs, trays, baths, masks.</p>
 <h4>Extrusion</h4>
 <p>Material (polymer granules, or a heated aluminium billet) is forced through a shaped <b>die</b>, producing a continuous length with a constant <b>cross-section (profile)</b>, then cooled and cut to length.</p>
 <p>✔ Continuous, very high output, complex profiles. ✘ Only constant cross-sections. <b>Products:</b> pipes, window frames, curtain rails, rods, cable insulation, aluminium frame sections.</p>
 <h4>Rotational moulding</h4>
 <p>Measured polymer <b>powder</b> is put in a hollow metal mould which is heated while <b>rotating on two axes</b>. The powder melts and coats the inside evenly; it is cooled while still rotating, then opened.</p>
 <p>✔ Large, hollow, seamless parts with even walls, cheap moulds, little waste. ✘ Slow cycle times. <b>Products:</b> kayaks, traffic cones, water tanks, playground slides, large storage bins and road barriers.</p>
 <h4>Lamination</h4>
 <ul><li><b>Wood laminating:</b> thin veneers are glued and clamped over a <b>former</b> (or in a vacuum bag) until the glue sets, holding a curve. Products: laminated (bent-ply) chair frames, skateboard decks, curved furniture.</li>
 <li><b>Composite lay-up:</b> layers of glass or carbon fibre mat are laid in a mould and wetted with resin, then rolled to remove air. Products: GRP boat hulls, car panels.</li>
 <li><b>Paper and board laminating:</b> a thin plastic film is bonded to the surface to protect it and add gloss or matt.</li></ul>` },
 { order: { q: 'Put the stages of injection moulding in order.', steps: ['Granules are fed from the hopper', 'The rotating screw carries them through the heated barrel and melts them', 'The screw rams the melt under pressure into the closed mould', 'Pressure is held while the part cools in the mould', 'The mould opens and ejector pins push the part out'] } },
 { order: { h: 'Vacuum forming', q: 'Put the stages of vacuum forming in order.', steps: ['Place the mould on the platen and clamp the sheet in the frame', 'Heat the sheet until it sags and is soft', 'Raise the mould into the softened sheet', 'Switch on the vacuum to suck the sheet onto the mould', 'Allow to cool, remove, and trim off the waste'] } },
 { match: { q: 'Which moulding process?', lh: 'Product', rh: 'Process', pairs: [['A 1.5 m water butt, seamless', 'Rotational moulding'], ['A PET drinks bottle', 'Blow moulding'], ['A uPVC window frame section', 'Extrusion'], ['A chocolate box insert tray', 'Vacuum forming'], ['A TV remote control casing', 'Injection moulding'], ['A curved plywood chair back', 'Lamination over a former']] } },
 { mcq: [
  ['Why must a vacuum-forming mould have draft angles?', ['To make it stronger', 'So the formed sheet can be removed from the mould', 'To speed up heating', 'To save plastic'], 1, 'Without a taper the cooled sheet grips the mould.'],
  ['Which of these is evidence that a product was injection moulded?', ['A seam down the middle and a pinch-off at the base', 'Small circular ejector pin marks inside', 'Layer lines', 'Uniform cross-section along its length'], 1, 'Ejector pin marks are a clear sign of injection moulding. A pinch-off suggests blow moulding.'],
  ['Why is rotational moulding used for kayaks rather than injection moulding?', ['It is faster', 'It makes large hollow seamless parts with cheap moulds; volumes are low', 'It gives thinner walls', 'Kayaks are made from thermosets'], 1, 'Huge injection moulds would be impossibly expensive for a large hollow part made in modest numbers.'],
  ['Extrusion can only make products with…', ['a hollow inside', 'a constant cross-section along their length', 'a curved shape', 'thermosetting polymers'], 1, 'The die sets the profile; length is cut to suit.'],
 ] },
 { exam: [
  ['**Explain** why injection moulding is used for high volumes of phone cases.', 4, ['Mould expensive but cost spread over many units (1), low unit cost (1)', 'Short automated cycle (1), very high output (1)', 'Accurate, repeatable, complex details e.g. clips (1), good finish, little finishing (1)']],
  ['**Describe** the process of blow moulding a plastic bottle.', 4, ['Parison/preform of thermoplastic made by extrusion or injection moulding (1)', 'Heated parison placed/clamped in a split mould (1)', 'Compressed air blown in, forcing plastic against the cold mould walls (1)', 'Cools, mould opens, bottle ejected, flash trimmed (1)']],
  ['**Evaluate** vacuum forming for producing a batch of 200 trays for a café.', 6, ['Low mould cost (MDF/resin) suits a batch of 200 (1–2)', 'Quick cycle, simple process, thermoplastic can be recycled (1)', 'Limitations: thin walls, simple shapes, no undercuts, trimming waste, may be less durable than injection moulded (1–2)', 'Judgement: suitable for 200 because injection mould cost would not be justified (1)']],
  ['**Explain** how a curved plywood chair back is produced by laminating.', 4, ['Thin veneers cut and glue (PVA/UF/resin) applied (1)', 'Placed over/in a former with the grain arranged (1)', 'Clamped or vacuum bagged until glue sets (1)', 'Removed, holds the curve, trimmed and finished (1)']],
 ] },
]},

{ t: 'Marking out, measuring and quality control tools', spec: '3.2', blocks: [
 { notes: `<h4>Marking out</h4>
 <table><tr><th>Material</th><th>Tools</th></tr>
 <tr><td><b>Wood</b></td><td>Pencil, try square, sliding bevel, <b>marking gauge</b> (line parallel to an edge, with the grain), <b>cutting gauge</b> (across the grain), <b>mortise gauge</b> (two parallel lines for mortise and tenon), marking knife</td></tr>
 <tr><td><b>Metal</b></td><td>Engineer’s blue / marking fluid, <b>scriber</b>, engineer’s square, <b>odd-leg callipers</b> (line parallel to an edge), <b>dividers</b> (circles and arcs), centre punch, surface plate and surface gauge</td></tr>
 <tr><td><b>Polymers</b></td><td>Leave the protective film on; spirit-based marker or chinagraph pencil; scriber for fine lines</td></tr>
 <tr><td><b>Paper and board</b></td><td>Pencil, steel rule, cutting mat, compasses, templates; registration and crop marks in print</td></tr></table>
 <h4>Measuring</h4>
 <table><tr><th>Tool</th><th>Accuracy and use</th></tr>
 <tr><td>Steel rule</td><td>About 0.5 mm: general lengths</td></tr>
 <tr><td>Internal and external (spring) callipers</td><td>Transfer an inside or outside size to a rule when it cannot be measured directly, e.g. a turned diameter or a bore</td></tr>
 <tr><td>Squares</td><td>Try square (90° on wood), engineer’s square (90° on metal, more accurate), mitre square (45°), set squares (30°/60° and 45°, for drawing)</td></tr>
 <tr><td><b>Vernier callipers</b></td><td>To 0.02–0.05 mm: inside, outside and depth measurements</td></tr>
 <tr><td><b>Micrometer</b></td><td>To 0.01 mm (or better): very precise outside diameters and thicknesses</td></tr>
 <tr><td>Digital callipers</td><td>Easy to read to 0.01 mm; can switch mm/inch and zero</td></tr>
 <tr><td><b>Densitometer</b></td><td>Measures colour/ink density on printed colour bars</td></tr></table>
 <h4>Jigs, fixtures and templates</h4>
 <ul><li>A <b>jig</b> holds the work <b>and guides the tool</b>, e.g. a drilling jig with a hardened bush so every hole is in the same place.</li>
 <li>A <b>fixture</b> holds and locates the work securely in the same position for machining or assembly, but does not guide the tool.</li>
 <li>A <b>template</b> is a pattern to draw round or cut round, for repeated shapes.</li>
 <li>✔ Speed, accuracy, repeatability, less skilled labour, less waste. ✘ Time and cost to make, only worthwhile for batches.</li></ul>
 <h4>Gauges and tolerance</h4>
 <p>A <b>tolerance</b> such as 25 ± 0.1 mm means anything from 24.9 to 25.1 mm is acceptable. A <b>go/no-go gauge</b> has ends at the upper and lower limits: a good part fits the “go” end and does not fit the “no-go” end. It is a quick, simple check with no reading needed.</p>` },
 { match: { q: 'Match the tool to the job.', lh: 'Tool', rh: 'Job', pairs: [['Marking gauge', 'A line parallel to the edge of a board, along the grain'], ['Odd-leg callipers', 'A line parallel to the edge of a metal bar'], ['Dividers', 'Scribing a circle on sheet steel'], ['Micrometer', 'Measuring a shaft diameter to 0.01 mm'], ['Mortise gauge', 'Two parallel lines for a mortise'], ['Centre punch', 'Marking where to drill on metal'], ['Densitometer', 'Checking ink density on a print run']] } },
 { mcq: [
  ['The difference between a jig and a fixture is…', ['there is no difference', 'a jig guides the tool; a fixture only holds and locates the work', 'a fixture guides the tool', 'a jig is for wood only'], 1, 'Jigs guide; fixtures hold.'],
  ['A part is specified 40 ± 0.2 mm. Which measurement is out of tolerance?', ['39.85 mm', '40.15 mm', '40.25 mm', '39.95 mm'], 2, 'Acceptable range: 39.8 to 40.2 mm.'],
  ['Why use a go/no-go gauge rather than a vernier on a production line?', ['It is more accurate', 'It is quick, needs no reading or skill, so many parts can be checked fast', 'It records results', 'It measures depth'], 1, 'Pass/fail in seconds.'],
 ] },
 { calc: [
  ['A dowel is specified as 12 mm ± 0.15 mm. What is the largest acceptable diameter, in mm?', 12.15, 0.001, 'mm', '12 + 0.15 = 12.15 mm (smallest is 11.85 mm).'],
  ['A batch of 400 parts is checked; 18 fail the go/no-go test. What percentage pass? (to 1 d.p.)', 95.5, 0.05, '%', '(400 − 18) ÷ 400 × 100 = 95.5%'],
 ] },
 { exam: [
  ['**Explain** how a go/no-go gauge is used to check parts in batch production.', 3, ['Two ends made to the upper and lower tolerance limits (1)', 'A good part fits the go end and does not fit the no-go end (1)', 'Quick check with no reading, so many parts checked fast by any worker (1)']],
  ['**Explain** two benefits of using a drilling jig when making a batch of 50 brackets.', 4, ['Every hole is in exactly the same place (1) so parts are interchangeable / fit (1)', 'No marking out needed (1) so it is much quicker (1)', 'Less skilled labour / fewer errors and less waste (1)(1)']],
 ] },
]},

{ t: 'Communicating design', spec: '3.3', blocks: [
 { notes: `<table><tr><th>Method</th><th>Key features</th><th>Used for</th></tr>
 <tr><td><b>Isometric</b></td><td>3D; vertical lines stay vertical; horizontal edges drawn at <b>30°</b>; no vanishing points, so true lengths can be measured along the axes</td><td>Clear 3D views, assembly and exploded drawings, technical illustration</td></tr>
 <tr><td><b>Two-point perspective</b></td><td>3D; two <b>vanishing points</b> on a horizon line (eye level); objects get smaller with distance, so it looks realistic</td><td>Presentation drawings and concept sketches for clients</td></tr>
 <tr><td><b>Third angle orthographic</b></td><td>2D views: <b>front</b> view, <b>plan</b> drawn <b>above</b> it, <b>end</b> view drawn to the <b>right</b> (beside the end it shows). Drawn to scale with dimensions to <b>BS 8888</b>, with the third angle symbol. Line types: thick outlines, thin dashed hidden detail, thin chain centre lines</td><td>Working drawings for manufacture</td></tr>
 <tr><td><b>Sectional views</b></td><td>Object drawn as if cut through; cut surfaces hatched at 45°</td><td>Showing internal details</td></tr>
 <tr><td><b>Exploded views</b></td><td>Parts separated along their assembly lines</td><td>Assembly instructions, showing how parts fit</td></tr>
 <tr><td><b>Nets (developments)</b></td><td>A 3D shape opened out flat; solid lines to cut, dashed lines to fold, glue tabs</td><td>Packaging, sheet metal parts</td></tr>
 <tr><td><b>Triangulation</b></td><td>Dividing a surface into triangles to find true lengths, so the net of a shape such as a transition piece or truncated cone can be developed</td><td>Developing nets of complex sheet metal and card shapes</td></tr>
 <tr><td><b>Reports and modelling</b></td><td>Written reports, annotated sketches, CAD renders, physical models and prototypes</td><td>Communicating to clients, manufacturers and teams</td></tr></table>
 <h4>Translating between drawing types</h4><p>You may be asked to turn an orthographic drawing into an isometric (or the reverse). Work from the front view; take every measurement along the 30° axes; draw a light crate (bounding box) first, then cut away.</p>` },
 { match: { q: 'Which drawing would you use?', lh: 'Purpose', rh: 'Drawing', pairs: [['Telling a manufacturer exact sizes', 'Third angle orthographic'], ['A realistic view for a client presentation', 'Two-point perspective'], ['Showing how flat-pack parts go together', 'Exploded view'], ['Showing the inside wall thickness of a moulding', 'Sectional view'], ['Laying out a carton to be cut and folded', 'Net (development)']] } },
 { tf: [
  ['In third angle projection the plan is drawn above the front view.', true, 'Third angle: plan above, end view next to the side it shows.'],
  ['Isometric drawing uses two vanishing points.', false, 'That is two-point perspective. Isometric uses 30° lines and no vanishing points.'],
  ['Hidden detail is shown with thin dashed lines.', true, 'BS 8888 convention.'],
  ['Centre lines are drawn as thick continuous lines.', false, 'Centre lines are thin chain (long dash, short dash) lines.'],
 ] },
 { exam: [
  ['**Explain** why a manufacturer needs a third angle orthographic drawing rather than a perspective sketch.', 2, ['Shows true shape and size of each view with dimensions to a standard (BS 8888) (1)', 'so the part can be made accurately and understood by anyone in the supply chain (1)']],
  ['**Describe** the layout of a third angle orthographic drawing.', 3, ['Front view (elevation) in the centre/bottom left (1)', 'Plan view drawn directly above the front view (1)', 'End view drawn to the side of the front view it shows; third angle symbol and dimensions (1)']],
 ] },
]},

{ t: 'Joining', spec: '3.4', blocks: [
 { notes: `<h4>Permanent and temporary</h4><p><b>Permanent:</b> cannot be taken apart without damage (welding, adhesives, rivets). <b>Temporary/semi-permanent:</b> can be taken apart (nuts and bolts, screws, knock-down fittings).</p>
 <h4>Adhesives</h4>
 <table><tr><th>Adhesive</th><th>Use</th></tr>
 <tr><td>PVA</td><td>Wood and manufactured boards; water-based; clamp until set</td></tr>
 <tr><td>Epoxy resin (two-part)</td><td>Strong; joins dissimilar materials (metal, wood, polymers, ceramics)</td></tr>
 <tr><td>Contact adhesive</td><td>Apply to both surfaces, leave touch-dry, press together: laminates, fabrics, leather</td></tr>
 <tr><td>Solvent cement (e.g. Tensol)</td><td>Acrylic: dissolves the surfaces so they fuse</td></tr>
 <tr><td>Cyanoacrylate (superglue)</td><td>Instant bonds on small parts, many materials</td></tr>
 <tr><td>Polystyrene cement</td><td>Solvent that fuses polystyrene (HIPS) parts: models, vacuum-formed parts</td></tr>
 <tr><td>Hot melt glue</td><td>Quick, low strength: models, card, prototypes</td></tr></table>
 <h4>Mechanical fixings</h4>
 <ul><li><b>Screws:</b> wood screws (countersunk, round head), self-tapping screws for sheet metal and plastics, machine screws.</li>
 <li><b>Nuts and bolts:</b> strong, temporary; washers spread the load; locknuts resist vibration.</li>
 <li><b>Rivets:</b> permanent; solid rivets need access to both sides; <b>pop (blind) rivets</b> are fitted from one side.</li>
 <li><b>Press (interference) fit:</b> a part is forced into a slightly smaller hole and held by friction, e.g. bearings into housings, dowel pins.</li>
 <li><b>Knock-down (KD) fittings:</b> cam locks, cross dowels, corner blocks, threaded inserts: for flat-pack furniture assembled with simple tools.</li></ul>
 <h4>Heat processes for metals</h4>
 <table><tr><th>Process</th><th>How</th><th>Notes</th></tr>
 <tr><td><b>Oxy-acetylene welding</b></td><td>Gas flame (about 3,200°C) melts the edges of both parts; a filler rod adds metal; they fuse</td><td>Very strong, permanent; portable; needs skill; fire risk</td></tr>
 <tr><td><b>MIG welding</b></td><td>Electric arc between a continuously fed wire electrode and the work; inert/active <b>shielding gas</b> protects the weld</td><td>Fast, easier to learn, used in fabrication and car repair; can be automated with robots</td></tr>
 <tr><td><b>Spot (resistance) welding</b></td><td>Current through two electrodes clamping overlapping sheets melts a spot</td><td>Car bodies on robot lines</td></tr>
 <tr><td><b>Brazing</b></td><td>Brass spelter melts (about 850–900°C) and flows into the joint with flux; parent metal does not melt</td><td>Stronger than soldering; bike frames, joining steel tube</td></tr>
 <tr><td><b>Soldering</b></td><td>Soft solder (tin alloy, about 180–230°C) for electronics; hard (silver) solder (about 600–800°C) for jewellery and copper</td><td>Parent metal does not melt; flux keeps joint clean</td></tr></table>
 <h4>Wood joints</h4>
 <table><tr><th>Joint</th><th>Strength and use</th></tr>
 <tr><td>Butt</td><td>Weakest: needs glue plus pins/screws; simple boxes</td></tr>
 <tr><td>Dowel / biscuit</td><td>Hidden, good strength; manufactured boards and frames</td></tr>
 <tr><td>Housing</td><td>Shelves into the sides of a cabinet</td></tr>
 <tr><td>Mortise and tenon</td><td>Very strong frame joint: tables, chairs, doors</td></tr>
 <tr><td>Dovetail</td><td>Very strong, resists pulling apart, decorative: drawer fronts, quality boxes</td></tr>
 <tr><td>Comb (finger)</td><td>Large glue area, strong: boxes</td></tr>
 <tr><td>Mitre</td><td>Hides end grain, weak unless reinforced: picture frames</td></tr>
 <tr><td>Halving / lap</td><td>Simple, strong-ish frame joints</td></tr></table>` },
 { sort: { h: 'Permanent or temporary?', q: 'Sort each joining method.', cats: ['Permanent', 'Temporary'], items: [['MIG welding', 0], ['Nut and bolt', 1], ['Pop rivet', 0], ['Cam lock fitting', 1], ['Epoxy resin', 0], ['Machine screw into threaded insert', 1], ['Brazing', 0], ['Wood screws', 1]] } },
 { match: { q: 'Choose the best joining method.', lh: 'Job', rh: 'Method', pairs: [['Joining two pieces of acrylic invisibly', 'Solvent cement (Tensol)'], ['Fixing sheet aluminium when you can only reach one side', 'Pop rivets'], ['Strong drawer front joint that shows craftsmanship', 'Dovetail joint'], ['Shelves in a flat-pack bookcase that can be taken apart', 'Knock-down fittings'], ['Car body panels on a robot line', 'Spot welding'], ['Components onto a circuit board', 'Soft soldering'], ['Laminate onto a worktop', 'Contact adhesive']] } },
 { mcq: [
  ['How does brazing differ from welding?', ['Brazing uses no heat', 'In brazing the parent metal does not melt; a lower-melting filler flows into the joint', 'Brazing is stronger', 'Welding uses flux'], 1, 'Welding melts and fuses the parent metals; brazing and soldering do not.'],
  ['What does the shielding gas do in MIG welding?', ['Cools the weld', 'Keeps oxygen and nitrogen away from the molten weld to stop it becoming porous and weak', 'Adds filler metal', 'Lights the arc'], 1, 'Protects the weld pool from the atmosphere.'],
  ['Why is flux used in soldering and brazing?', ['To colour the joint', 'To clean and stop oxides forming so the filler can flow and bond', 'To cool the joint', 'To make it waterproof'], 1, 'Oxides stop solder wetting the surface.'],
 ] },
 { exam: [
  ['**Explain** one advantage of using knock-down fittings in flat-pack furniture.', 2, ['Sold flat-packed (1) so cheaper and easier to store and transport (1)', 'Or: assembled with simple tools by the user / can be taken apart to move (1)(1)']],
  ['**Describe** the process of MIG welding two mild steel plates.', 4, ['Clean plates and clamp in position; PPE: welding mask, gloves (1)', 'Earth clamp attached; trigger feeds wire electrode and shielding gas (1)', 'Arc formed between wire and work melts wire and edges of plates (1)', 'Weld run along the joint; molten metal fuses and solidifies; clean off spatter with a wire brush (1)']],
  ['**Evaluate** the use of adhesives rather than mechanical fixings in mass-produced products.', 6, ['For: spread load over the whole area, join dissimilar materials, invisible, no holes, light, can be automated (1–2)', 'Against: permanent so harder to repair/recycle (design for disassembly), curing time, surface prep, fumes/VOCs, can fail with heat (1–2)', 'Mechanical fixings: easy to disassemble, inspect and repair, but add parts and weight, need holes (1–2)', 'Judgement in context (1)']],
 ] },
]},

{ t: 'Finishing and preservation', spec: '3.5', blocks: [
 { notes: `<p>Finishes <b>protect</b> (from moisture, rust, rot, UV, wear) and <b>improve appearance</b> (colour, texture, gloss). Good preparation (sanding, degreasing, priming) is essential.</p>
 <h4>Woods</h4>
 <table><tr><th>Finish</th><th>Notes</th></tr>
 <tr><td>Paint</td><td>Primer → undercoat → topcoat; opaque, colourful, protects</td></tr>
 <tr><td>Varnish (e.g. polyurethane)</td><td>Clear, hard, waterproof coating; shows the grain</td></tr>
 <tr><td>Sealants (sanding sealer, shellac)</td><td>Seal the grain so later coats do not soak in; silicone sealants also keep water out of joints</td></tr>
 <tr><td>Wood stain</td><td>Changes colour, shows grain; little protection on its own</td></tr>
 <tr><td>Oil (Danish, teak) and wax</td><td>Soaks in, enhances grain, natural look; needs reapplying</td></tr>
 <tr><td>Preservatives</td><td>Protect outdoor timber from rot and insects: pressure treatment (tanalising) forces preservative deep into the wood; also brush-on treatments</td></tr></table>
 <h4>Metals</h4>
 <table><tr><th>Finish</th><th>How it works</th><th>Used for</th></tr>
 <tr><td><b>Painting</b></td><td>Degrease, primer, topcoats; barrier against air and water</td><td>Car bodies, railings</td></tr>
 <tr><td><b>Powder coating</b></td><td>Polymer powder is sprayed onto the metal, which is electrically earthed so the charged powder sticks <b>electrostatically</b>; baked in an oven (about 200°C) so it melts and flows into a tough, even coat</td><td>Bike frames, garden furniture, appliances, radiators</td></tr>
 <tr><td><b>Galvanising</b></td><td>Steel <b>dipped in molten zinc</b>; zinc forms a barrier and corrodes <b>sacrificially</b> to protect the steel even if scratched</td><td>Crash barriers, fencing, nails, buckets, steel structures outdoors</td></tr>
 <tr><td><b>Electroplating</b></td><td>The product is the <b>cathode</b> in an electrolyte; current deposits a thin layer of another metal (chrome, nickel, zinc, gold, silver)</td><td>Taps, cutlery, jewellery, bike parts</td></tr>
 <tr><td><b>Anodising</b></td><td><b>Mainly aluminium</b> (also titanium). The part is the <b>anode</b> in an acid bath; current thickens the natural oxide layer, which can be <b>dyed</b> before sealing</td><td>Phone and laptop cases, torches, carabiners, drinks bottles</td></tr>
 <tr><td><b>Oiling</b></td><td>Thin film of oil keeps out moisture; temporary</td><td>Tools, machine parts, mild steel in storage</td></tr>
 <tr><td><b>Cathodic protection</b></td><td>A more reactive metal (zinc, magnesium) is connected as a <b>sacrificial anode</b>; it corrodes instead of the steel</td><td>Ship hulls, pipelines, oil rigs, boat outboards</td></tr></table>
 <h4>Polymers</h4><p>Usually <b>self-finishing</b>: colour is added as masterbatch and the mould gives the surface texture. Edges of acrylic can be scraped, wet-and-dried, buffed or flame polished. Vinyl decals and printing can be added.</p>
 <h4>Papers and boards</h4>
 <table><tr><th>Finish</th><th>Effect</th></tr>
 <tr><td><b>Laminating</b></td><td>Thin plastic film bonded on: protects, waterproofs, adds gloss or matt</td></tr>
 <tr><td><b>Varnishing</b> (including UV and spot varnish)</td><td>Gloss or matt coat; spot varnish highlights selected areas such as a logo</td></tr>
 <tr><td><b>Foil blocking</b></td><td>Heated die presses metallic foil onto the surface: luxury effect</td></tr>
 <tr><td><b>Embossing / debossing</b></td><td>Male and female dies press a raised (or sunken) design into the board: tactile, premium</td></tr></table>` },
 { match: { q: 'Choose the finish.', lh: 'Product', rh: 'Finish', pairs: [['Coloured aluminium torch body', 'Anodising'], ['Steel motorway crash barrier', 'Galvanising'], ['Chrome-look bathroom tap', 'Electroplating'], ['Steel garden chair in bright red', 'Powder coating'], ['A ship’s steel hull', 'Cathodic protection with sacrificial anodes'], ['Fence posts in the ground', 'Pressure-treated preservative'], ['A shiny gold logo on a perfume box', 'Foil blocking'], ['A raised logo you can feel on a business card', 'Embossing']] } },
 { tf: [
  ['Anodising can be used on mild steel.', false, 'Anodising only works on aluminium (and some other non-ferrous metals like titanium).'],
  ['In electroplating the product is the cathode.', true, 'Metal ions are attracted to and deposited on the negative cathode.'],
  ['Galvanising still protects steel if the zinc coating is scratched.', true, 'Zinc is more reactive, so it corrodes sacrificially.'],
  ['Polymers usually need painting to protect them from corrosion.', false, 'Polymers do not corrode like metals and are usually self-finishing.'],
  ['Powder coating is cured by baking in an oven.', true, 'Heat melts the powder into a continuous film.'],
 ] },
 { exam: [
  ['**Explain** how galvanising protects mild steel.', 3, ['Steel dipped in molten zinc, forming a coating (1)', 'Barrier keeps air and water off the steel (1)', 'Zinc is more reactive so it corrodes sacrificially even when scratched (1)']],
  ['**Describe** the process of powder coating a steel bicycle frame.', 4, ['Frame degreased/shot blasted and cleaned (1)', 'Frame earthed; electrostatically charged powder sprayed on and attracted to it (1)', 'Frame baked in an oven, about 200°C (1)', 'Powder melts and flows into a smooth, tough, even coat, then cools (1)']],
  ['**Explain** why aluminium laptop cases are often anodised.', 4, ['Thickens the protective oxide layer (1) improving corrosion and scratch/wear resistance (1)', 'Can be dyed (1) giving a durable, premium coloured finish that will not peel because it is part of the surface (1)']],
 ] },
]},

{ t: 'Choosing a process: mixed exam practice', spec: '3.1–3.5', blocks: [
 { notes: `<h4>Matching process to scale of production</h4>
 <table><tr><th>Scale</th><th>Typical processes</th></tr>
 <tr><td><b>One-off / prototype</b></td><td>Hand tools, CNC routing/laser cutting, 3D printing, sand casting, fabrication and welding, vacuum forming, resin casting</td></tr>
 <tr><td><b>Batch</b></td><td>Jigs and fixtures, CNC machining, vacuum forming, rotational moulding, screen printing, sand/investment casting, lamination</td></tr>
 <tr><td><b>Mass / high volume</b></td><td>Injection and blow moulding, die casting, extrusion, stamping and press forming, offset lithography, gravure, flexography</td></tr></table>
 <div class="tip">For high-volume processes, the argument is almost always: <b>high tooling cost</b> is spread over <b>many units</b>, so the <b>unit cost is low</b>, plus <b>speed, accuracy and repeatability</b>.</div>` },
 { sort: { h: 'Low or high tooling cost?', q: 'Sort the processes by the cost of their tooling.', cats: ['Low tooling cost', 'High tooling cost'], items: [['Injection moulding', 1], ['Vacuum forming', 0], ['Sand casting', 0], ['Pressure die casting', 1], ['Screen printing', 0], ['Gravure printing', 1], ['Rotational moulding', 0], ['Press forming car panels', 1]] } },
 { mcq: [
  ['Best process for 500,000 identical bottle caps?', ['3D printing', 'Injection moulding', 'Vacuum forming', 'Sand casting'], 1, 'Mould cost is tiny per cap at this volume; very fast cycles with multi-cavity moulds.'],
  ['Best process for 25 custom architectural model parts with fine detail?', ['Injection moulding', 'Die casting', '3D printing or resin casting', 'Extrusion'], 2, 'No expensive tooling; ideal for low numbers and complex detail.'],
  ['Best process for continuous lengths of plastic garden hose?', ['Extrusion', 'Blow moulding', 'Rotational moulding', 'Vacuum forming'], 0, 'Constant cross-section, continuous length.'],
  ['Best process for 50,000 zinc alloy toy car bodies?', ['Sand casting', 'Pressure die casting', 'Investment casting', 'Turning'], 1, 'Fast, accurate, fine detail, good finish: perfect for zinc at volume.'],
 ] },
 { exam: [
  ['A company plans to make 100,000 polypropylene food containers with lids. **Justify** the choice of injection moulding.', 6, ['High volume so mould cost spread, low unit cost (1–2)', 'Fast automated cycles, multi-cavity moulds (1)', 'Accurate, so lids fit containers every time; PP living hinge possible (1–2)', 'Good finish, food safe, no further finishing; scrap reground (1)', 'Alternatives (vacuum forming) less accurate/thin; conclusion (1)']],
  ['**Discuss** the advantages and disadvantages of using CAM processes such as laser cutting for batch production in a small company.', 9, ['Advantages: accuracy and repeatability, complex shapes, quick changes from CAD, nesting reduces waste, less skilled labour, 24/7 running (3–4)', 'Disadvantages: high capital cost, maintenance, training/programming, material limits and thickness, fumes/safety, scorched edges (3–4)', 'Context: small company, batch: flexibility valuable; cost justified if machine used often (1)', 'Supported conclusion (1)']],
 ] },
 { nea: 'Which manufacturing processes did you use (or will you use) for your NEA prototype? If your product went into production at 10,000 units a year, which processes would you change to, and why? This makes a strong section in your final evaluation.' },
]},

]});
