/* 3.3.7 to 3.3.11 Making: selection of materials and components, tolerances, material management, specialist tools and equipment, specialist techniques and processes (AQA 8552) */
SPEC.push(
 ['q22a', 22, '3.3.7', 'Selecting materials and working to tolerances', '3.3.7 Selecting materials and components for functional need, cost and availability · 3.3.8 Working accurately to tolerances: ± 2 mm, resistor tolerance, seam allowance', '**Explain** why tolerances are applied when parts of a product are made.', 3, ['No part can be made exactly to size every time, so a tolerance gives the acceptable upper and lower limits (1)', 'Parts within the limits will fit together and work properly (1)', 'while parts outside them are rejected, which controls quality without demanding costly perfection (1)']],
 ['q22b', 22, '3.3.9', 'Material management and marking out', '3.3.9 Cutting efficiently and minimising waste: nesting, cutting allowances, seam allowances, joint overlaps · marking out with data points, coordinates, reference surfaces, templates, jigs and patterns', '**Explain** why a seam allowance is added to a textile pattern piece.', 2, ['Extra fabric (typically 15 mm) is left outside the stitching line (1)', 'so the seam can be sewn without the stitches pulling out at the edge, and the finished piece is still the correct size (1)']],
 ['q22c', 22, '3.3.10', 'Tools, equipment and working safely', '3.3.10 Selecting and safely using hand tools, machinery, digital design and manufacture · 3.3.11 Techniques and processes; preparing and applying surface treatments and finishes', '**Explain** two safety precautions when using a pillar drill.', 4, ['Clamp the work in a machine vice or to the table (1) so it cannot spin round and injure the hand if the drill bit catches (1)', 'Wear eye protection and lower the guard (1) so swarf and chips cannot fly into the eyes (1)', 'Accept: tie back hair and remove loose clothing (1) so nothing is caught in the rotating chuck (1)']],
);
BOOKLETS.push({ id: 'g22', topic: 22, title: 'Making: materials, tolerances, tools and techniques', pages: [

{ t: 'Overview and key words', blocks: [
 { notes: `<p class="lead">Sections 3.3.7 to 3.3.11 are about <b>making your prototype well</b>: choosing the right materials, working accurately, wasting as little as possible, and using tools and processes skilfully and safely. They are examined on paper, but you learn them at the bench.</p>
 <table><tr><th>Spec</th><th>Title</th><th>In this booklet</th><th>Also see</th></tr>
 <tr><td>3.3.7</td><td>Selection of materials and components</td><td>Page 2</td><td>3.2.1 and 3.1.6</td></tr>
 <tr><td>3.3.8</td><td>Tolerances</td><td>Page 2</td><td>3.2.8</td></tr>
 <tr><td>3.3.9</td><td>Material management</td><td>Page 3</td><td>3.2.6</td></tr>
 <tr><td>3.3.10</td><td>Specialist tools and equipment</td><td>Page 4</td><td>3.2.5</td></tr>
 <tr><td>3.3.11</td><td>Specialist techniques and processes</td><td>Page 5</td><td>3.2.8 and 3.2.9</td></tr></table>
 <p>Much of the knowledge is the same as Section B. The difference in Section C is that questions are about <b>applying</b> it: “how would you…”, “explain why you would…”, often with a calculation or a drawing to complete.</p>` },
 { keys: [
  ['SI units', 'The international system of units: metre, kilogram, second, ampere and so on'],
  ['Tolerance', 'The allowed variation in a size or value, such as ± 2 mm'],
  ['Seam allowance', 'The extra fabric between the cutting line and the stitching line'],
  ['Kerf', 'The width of material removed by a saw blade or laser'],
  ['Datum', 'A reference point, edge or surface from which all measurements are taken'],
  ['Coordinates', 'A pair of numbers (x, y) that give the position of a point measured from a datum'],
  ['Nesting', 'Arranging parts closely on a sheet to minimise waste'],
  ['Risk assessment', 'Identifying hazards, deciding how likely and how serious the harm is, and putting controls in place'],
  ['PPE', 'Personal protective equipment, such as goggles, apron, gloves and a dust mask'],
  ['CNC', 'Computer numerical control: a machine that follows instructions from a computer'],
  ['Try square', 'A tool for marking and checking a 90° angle'],
  ['Scriber', 'A sharp steel point used to mark lines on metal and polymer'],
 ] },
]},

{ t: 'Selecting materials and working to tolerances', spec: '3.3.7', blocks: [
 { notes: `<h4>3.3.7 Selecting materials and components</h4>
 <p>Choose what is appropriate for the task, weighing three things:</p>
 <ul><li><b>Functional need:</b> the properties the job demands: strength, weight, heat resistance, flexibility, conductivity.</li>
 <li><b>Cost:</b> of the material, of working it, and of any waste.</li>
 <li><b>Availability:</b> can it be bought easily, in a suitable <b>stock form</b> and size?</li></ul>
 <h4>SI units</h4>
 <table><tr><th>Quantity</th><th>Unit</th><th>Symbol</th></tr>
 <tr><td>Length</td><td>metre (in D&T, usually millimetre)</td><td>m, mm</td></tr>
 <tr><td>Mass</td><td>kilogram, gram</td><td>kg, g</td></tr>
 <tr><td>Time</td><td>second</td><td>s</td></tr>
 <tr><td>Force</td><td>newton</td><td>N</td></tr>
 <tr><td>Electric current</td><td>ampere (amp)</td><td>A</td></tr>
 <tr><td>Voltage</td><td>volt</td><td>V</td></tr>
 <tr><td>Resistance</td><td>ohm</td><td>Ω</td></tr>
 <tr><td>Temperature</td><td>kelvin (degree Celsius in everyday and D&T use)</td><td>K, °C</td></tr>
 <tr><td>Area and volume</td><td>square and cubic metres or millimetres</td><td>m², mm², m³, mm³</td></tr></table>
 <p><b>Prefixes:</b> kilo (k) = × 1000; milli (m) = ÷ 1000; micro (µ) = ÷ 1 000 000; mega (M) = × 1 000 000. So 1 kΩ = 1000 Ω and 1 mm = 0.001 m.</p>
 <h4>Alloys you should be able to select</h4>
 <table><tr><th>Alloy</th><th>Made from</th><th>Choose it for</th></tr>
 <tr><td>Brass</td><td>Copper + zinc</td><td>Corrosion resistance, easy casting and machining, appearance</td></tr>
 <tr><td>Stainless steel</td><td>Steel + chromium (and nickel)</td><td>Parts that must not rust: cutlery, sinks</td></tr>
 <tr><td>High speed steel</td><td>Steel + tungsten, chromium, vanadium</td><td>Cutting tools that get hot</td></tr>
 <tr><td>Solder</td><td>Tin + copper (lead-free)</td><td>Joining electronic components: low melting point</td></tr></table>
 <h4>3.3.8 Tolerances</h4>
 <p>A tolerance is the amount of variation that is acceptable. It is applied because nothing can be made perfectly, and parts still have to <b>fit together</b>, <b>work</b> and be <b>interchangeable</b>.</p>
 <table><tr><th>Example in the specification</th><th>What it means</th></tr>
 <tr><td><b>± 2 mm</b> on a dimension</td><td>A 150 mm part is acceptable from 148 mm to 152 mm</td></tr>
 <tr><td><b>Resistor tolerance</b></td><td>The last band shows how far the real value may be from the marked value. Gold = ± 5%, silver = ± 10%. A 100 Ω ± 5% resistor is between 95 Ω and 105 Ω</td></tr>
 <tr><td><b>Seam allowance</b></td><td>The distance between the cut edge and the stitching line, normally 15 mm. If it varies, the garment comes out the wrong size</td></tr></table>` },
 { calc: [
  ['A panel is specified as 240 mm ± 2 mm. What is the smallest acceptable size, in mm?', 238, 0, 'mm', '240 − 2 = 238 mm (and the largest is 242 mm).'],
  ['A 220 Ω resistor has a tolerance of ± 5%. What is its maximum possible resistance, in ohms?', 231, 0.01, 'Ω', '5% of 220 = 11. 220 + 11 = 231 Ω.'],
  ['A 1 kΩ resistor has a tolerance of ± 10%. What is its minimum possible resistance, in ohms?', 900, 0, 'Ω', '1 kΩ = 1000 Ω. 10% of 1000 = 100. 1000 − 100 = 900 Ω.'],
  ['A finished fabric panel must be 300 mm wide. It has a 15 mm seam allowance on each side. How wide must the fabric be cut, in mm?', 330, 0, 'mm', '300 + 15 + 15 = 330 mm.'],
  ['Convert 2.5 m to millimetres.', 2500, 0, 'mm', '2.5 × 1000 = 2500 mm.'],
 ] },
 { mcq: [
  ['Which unit is used for force?', ['Kilogram', 'Newton', 'Volt', 'Ohm'], 1, 'Mass is in kilograms; force is in newtons.'],
  ['A resistor has a gold tolerance band. What does this mean?', ['Its value is exact', 'Its value may be up to 5% above or below the marked value', 'It is made of gold', 'It has a resistance of 5 Ω'], 1, 'Gold = ± 5%; silver = ± 10%.'],
 ] },
]},

{ t: 'Material management and marking out', spec: '3.3.9', blocks: [
 { notes: `<h4>Cutting efficiently and minimising waste</h4>
 <ul><li><b>Plan before you cut.</b> Make a cutting list, then lay the parts out on the stock material.</li>
 <li><b>Nest</b> the shapes: fit them close together, turning them where it helps, and share cut lines. Use shapes that <b>tessellate</b> where you can.</li>
 <li>Start from a <b>straight, square edge</b> and work from one corner, so the offcut is one useful piece rather than scraps.</li>
 <li>Keep <b>grain direction</b> in mind for timber and fabric.</li></ul>
 <h4>Allowances: do not forget them</h4>
 <table><tr><th>Allowance</th><th>Why it is needed</th></tr>
 <tr><td><b>Material removed by cutting</b> (the kerf)</td><td>A saw blade or laser beam turns a narrow strip into dust. Cut on the <b>waste side</b> of the line and leave a little to plane, file or sand back to size</td></tr>
 <tr><td><b>Seam allowance</b></td><td>Fabric outside the stitching line, usually 15 mm, plus extra for hems</td></tr>
 <tr><td><b>Joint overlaps</b></td><td>Material that goes inside a joint: the length of a tenon, a glue tab on a net, the overlap of a lap joint or riveted seam</td></tr></table>
 <h4>Marking out: why it matters</h4>
 <p>A product can only be as accurate as its marking out. “Measure twice, cut once.”</p>
 <ul><li><b>Datum:</b> take every measurement from the same <b>reference point, line or surface</b>: a face edge and face side on timber, one corner of a sheet. Errors then do not add up.</li>
 <li><b>Coordinates:</b> positions given as (x, y) distances from the datum. CAD, laser cutters and CNC machines all work this way.</li>
 <li><b>Templates, jigs and patterns</b> for repeated shapes and operations.</li></ul>
 <table><tr><th>Material</th><th>Marking-out tools</th></tr>
 <tr><td>Timber</td><td>Pencil, steel rule, try square, marking gauge, mortise gauge, marking knife, sliding bevel</td></tr>
 <tr><td>Metal</td><td>Scriber, engineer's square, centre punch (to start a drill), dividers, odd-leg callipers; marking blue to make the lines show</td></tr>
 <tr><td>Polymer</td><td>Fine marker or chinagraph pencil on the protective film; scriber</td></tr>
 <tr><td>Paper and board</td><td>Sharp pencil, rule, set square, compass</td></tr>
 <tr><td>Textiles</td><td>Tailor's chalk, pattern pieces and pins, tracing wheel, tape measure</td></tr></table>` },
 { match: { q: 'Match each marking-out tool to its job.', lh: 'Tool', rh: 'Job', pairs: [['Try square', 'Marking a line at 90° to an edge'], ['Marking gauge', 'Marking a line parallel to an edge on timber'], ['Scriber', 'Scratching a fine line on metal'], ['Centre punch', 'Making a dent to start a drill accurately'], ['Dividers', 'Marking circles and arcs on metal'], ['Tailor’s chalk', 'Marking fabric']] } },
 { calc: [
  ['Four parts, each 120 mm long, are cut from a length of bar. Each saw cut removes 2 mm. What is the minimum length of bar needed, in mm? (Three cuts are needed.)', 486, 0, 'mm', '4 × 120 = 480 mm, plus 3 cuts × 2 mm = 6 mm. Total 486 mm.'],
  ['Right-angled triangular parts tessellate perfectly, in pairs that make rectangles, on a sheet 500 mm × 300 mm. Each triangle has a base of 100 mm and a height of 50 mm. How many can be cut?', 60, 0, '', 'Sheet area = 150 000 mm². Triangle area = ½ × 100 × 50 = 2500 mm². 150 000 ÷ 2500 = 60.'],
  ['A hole must be drilled at the coordinates (40, 25) measured in mm from the bottom-left corner of a plate. A second hole is at (100, 25). How far apart are the centres of the holes, in mm?', 60, 0, 'mm', 'Both are 25 mm up, so they are on the same horizontal line. 100 − 40 = 60 mm.'],
 ] },
 { tf: [
  ['You should cut exactly on the marked line, in the middle of it.', false, 'Cut on the waste side, then finish back to the line.'],
  ['Measuring every feature from one datum edge is more accurate than measuring each from the last.', true, 'Errors do not build up.'],
  ['A centre punch is used on metal before drilling so the drill does not wander.', true, 'The dent locates the tip of the bit.'],
 ] },
]},

{ t: 'Tools, equipment and working safely', spec: '3.3.10', blocks: [
 { notes: `<h4>Selecting the right tool</h4>
 <p>You must be able to choose and use tools <b>appropriate to the material and the task</b>.</p>
 <table><tr><th></th><th>Examples</th><th>Good for</th></tr>
 <tr><td><b>Hand tools</b></td><td>Tenon saw, coping saw, hacksaw, chisels, plane, files, craft knife, scissors, needles, soldering iron</td><td>One-offs, fine control, small adjustments. Slower; accuracy depends on skill</td></tr>
 <tr><td><b>Machinery</b></td><td>Pillar drill, band saw, scroll saw, disc and belt sander, lathe, milling machine, sewing machine, line bender, vacuum former</td><td>Faster and more accurate than hand tools; repeated operations with a jig</td></tr>
 <tr><td><b>Digital design and manufacture</b></td><td>CAD software; laser cutter, 3D printer, CNC router, vinyl cutter, CNC embroidery machine</td><td>Complex shapes; very accurate and repeatable; identical batches. Needs a CAD file, set-up time and the right material</td></tr></table>
 <h4>Working safely: protect yourself and others</h4>
 <table><tr><th>Hazard</th><th>Control</th></tr>
 <tr><td>Flying chips, swarf, dust in the eyes</td><td>Safety glasses or goggles; machine guards in place</td></tr>
 <tr><td>Entanglement in rotating parts</td><td>Tie back long hair; no loose clothing, ties or jewellery; apron fastened; no gloves on rotating machines</td></tr>
 <tr><td>Work spinning or being thrown</td><td>Clamp the work: machine vice, G-clamp, jig. Never hold it by hand under a drill</td></tr>
 <tr><td>Dust and fumes</td><td>Extraction switched on; dust mask; good ventilation for adhesives, solder and finishes</td></tr>
 <tr><td>Cuts from blades and sharp edges</td><td>Cut away from the body; safety rule and cutting mat; keep tools sharp; remove burrs</td></tr>
 <tr><td>Burns from hot metal, polymer and tools</td><td>Heat-proof gloves and tongs; a stand for the soldering iron; label hot work</td></tr>
 <tr><td>Trips and collisions</td><td>Clear floor and bench; bags stored away; one person at a machine; no running</td></tr></table>
 <p>Know where the <b>emergency stop</b> buttons are. Only use a machine you have been trained on and have permission to use. Report damage and accidents.</p>
 <p>A <b>risk assessment</b> names the <b>hazard</b>, the <b>risk</b> (who could be hurt, how likely it is and how badly) and the <b>control measure</b>.</p>` },
 { tip: '<b>Safety answers must be specific.</b> “Wear goggles” scores less than “wear goggles <b>because</b> chips of acrylic can fly up from the drill”. “Be careful” scores nothing. Read whether the question wants precautions for <b>cutting</b>, for <b>heat</b>, or in general.' },
 { match: { q: 'Match each hazard to the best control measure.', lh: 'Hazard', rh: 'Control', pairs: [['Long hair near a pillar drill', 'Tie it back'], ['Fumes when soldering', 'Fume extraction at the bench'], ['Dust from sanding MDF', 'Dust extraction and a dust mask'], ['A small workpiece being drilled', 'Hold it in a machine vice'], ['Hot acrylic from the line bender', 'Wear heat-proof gloves'], ['Chips flying from a lathe', 'Eye protection and the guard in place']] } },
 { sort: { q: 'Hand tool, machine or digital manufacture?', cats: ['Hand tool', 'Machine', 'Digital manufacture'], items: [['Coping saw', 0], ['Pillar drill', 1], ['Laser cutter', 2], ['Bevel-edge chisel', 0], ['Band saw', 1], ['3D printer', 2], ['File', 0], ['CNC router', 2]] } },
 { mcq: [
  ['Why should gloves not be worn when using a pillar drill?', ['They make hands too warm', 'They can be caught by the rotating chuck and drag the hand in', 'They are too expensive', 'They stop you seeing the work'], 1, 'Entanglement is the main risk on rotating machines.'],
  ['Which is an advantage of a laser cutter over a coping saw for making 20 identical acrylic parts?', ['It needs no electricity', 'Every part is identical and accurate, cut straight from the CAD drawing', 'It is slower', 'It can cut any metal'], 1, 'Digital manufacture is accurate and repeatable.'],
 ] },
]},

{ t: 'Techniques, processes and finishes', spec: '3.3.11', blocks: [
 { notes: `<p>You should be able to choose techniques that suit the <b>material</b> and the <b>task</b>, and carry them out to the <b>level of accuracy</b> needed. The three groups are the same as in 3.2.8.</p>
 <table><tr><th>Group</th><th>Timber</th><th>Metal</th><th>Polymer</th><th>Papers and boards</th><th>Textiles</th></tr>
 <tr><td><b>Wastage</b></td><td>Saw, plane, chisel, drill, sand, turn, rout</td><td>Saw, file, drill, turn, mill, shear</td><td>Saw, file, drill, laser cut</td><td>Cut, score, perforate, die cut</td><td>Cut with shears or a rotary cutter</td></tr>
 <tr><td><b>Addition</b></td><td>Glue (PVA), laminate, screw, nail, dowel; joints such as butt, lap, housing, mortise and tenon, dovetail</td><td>Solder, braze, weld, rivet, nut and bolt</td><td>Solvent cement, epoxy, 3D print, heat weld</td><td>Glue, tape, tabs and slots, laminate</td><td>Sew seams, bond, appliqué, embroider</td></tr>
 <tr><td><b>Deforming and reforming</b></td><td>Steam bend, kerf bend, bend glued laminates round a former</td><td>Bend, fold, press, beat, cast</td><td>Line bend, vacuum form, drape form, press form, cast resin</td><td>Fold, crease, emboss</td><td>Pleat, gather, dart, press</td></tr></table>
 <h4>Choosing a joint or joining method</h4>
 <ul><li>Does it need to be <b>permanent</b> (glue, weld, rivet) or <b>temporary</b> (screws, bolts, KD fittings, zips)?</li>
 <li>How <b>strong</b> must it be, and which way is the force?</li>
 <li>Should it be <b>seen</b>? A dovetail is decorative; a dowel joint is hidden.</li>
 <li>What <b>tools and skills</b> do you have?</li></ul>
 <h4>Surface treatments and finishes</h4>
 <p>Applied for <b>functional</b> reasons (protection) and <b>aesthetic</b> reasons (appearance). Two steps:</p>
 <ol><li><b>Prepare:</b> the surface must be smooth, clean, dry and free from dust and grease. Sand timber with the grain through the grades; degrease and key metal; polish the edges of acrylic.</li>
 <li><b>Apply:</b> an appropriate finish in thin, even coats, rubbing down between coats: primer, undercoat, top coat; or sealer then varnish.</li></ol>
 <p><b>Corrosion and oxidation:</b> iron and steel rust when exposed to oxygen and water. A finish is a barrier (paint, powder coat, dip coat, galvanising, oil). See 3.2.9 for the detail.</p>` },
 { sort: { q: 'Wastage, addition, or deforming and reforming?', cats: ['Wastage', 'Addition', 'Deforming or reforming'], items: [['Filing a metal edge', 0], ['Brazing two steel tubes', 1], ['Line bending acrylic', 2], ['Laser cutting plywood', 0], ['Sewing a seam', 1], ['Vacuum forming HIPS', 2], ['Gluing a dowel joint', 1], ['Steam bending ash', 2]] } },
 { sort: { q: 'Is the joining method permanent or temporary?', cats: ['Permanent', 'Temporary'], items: [['PVA glue', 0], ['Nut and bolt', 1], ['Weld', 0], ['Wood screw', 1], ['Pop rivet', 0], ['Zip', 1], ['Solvent cement', 0], ['KD fitting', 1]] } },
 { order: { q: 'Put the stages of applying a varnish finish to a timber product in order.', steps: ['Sand with the grain using coarse, then fine, glass paper', 'Remove all dust with a brush or tack cloth', 'Apply a thin first coat of varnish along the grain', 'Leave it to dry fully', 'Rub down lightly with fine glass paper or wire wool', 'Apply the final coat'] } },
]},

{ t: 'Exam practice', spec: '3.3.7', blocks: [
 { mcq: [
  ['Which tool is used to mark a line parallel to the edge of a piece of timber?', ['Try square', 'Marking gauge', 'Centre punch', 'Scriber'], 1, 'It has a fence that runs along the edge.'],
  ['A part is specified as 60 mm ± 1 mm. Which measured size is acceptable?', ['58.5 mm', '59.2 mm', '61.5 mm', '62.0 mm'], 1, 'The range is 59 to 61 mm.'],
  ['Which is a temporary method of joining?', ['Brazing', 'Epoxy resin', 'Machine screw and nut', 'Welding'], 2, 'It can be undone with a spanner or screwdriver.'],
  ['What is the standard seam allowance on a commercial textile pattern?', ['5 mm', '15 mm', '50 mm', '150 mm'], 1, '15 mm (1.5 cm).'],
 ] },
 { exam: [
  ['**Name** a tool or piece of equipment you have used and **explain** how you used it safely.', 3, ['Appropriate named tool or machine, e.g. band saw, soldering iron, sewing machine (1)', 'A specific precaution, e.g. used a push stick and kept fingers away from the blade; guard adjusted just above the work (1)', 'The reason: what harm it prevents (1)']],
  ['**Explain** why a designer would nest the parts of a product on a sheet of material before cutting.', 2, ['The parts are arranged as closely as possible, sharing edges where they can (1)', 'so more parts are cut from each sheet, reducing waste and cost (1)']],
  ['**Explain** why it is important to mark out from a datum.', 2, ['All measurements are taken from the same reference edge or point (1)', 'so small errors do not add up, and holes and features end up in the correct position relative to each other (1)']],
  ['A 30 mm diameter hole must be drilled 12 mm deep in a batch of 10 timber blocks. **Explain** how you would make sure that all 10 holes are in the same position and to the same depth.', 4, ['Make a drilling jig or fix a fence and stop to the drill table (1) so each block is located in the same place without marking out (1)', 'Set the depth stop on the pillar drill to 12 mm (1) so the drill cannot go deeper, and check the first block with a rule or depth gauge before drilling the rest (1)']],
  ['**Describe** in detail how you would make a product from a material of your choice to a high standard of accuracy and finish. Refer to the tools, equipment and processes you would use.', 8, ['A named product and specific material, starting from a named stock form', 'Marking out from a datum with the correct tools for the material; allowances for cutting and joints', 'Cutting to the waste side of the line with a suitable hand tool, machine or laser cutter, with reasons', 'Shaping back to the line: planing, filing, sanding; checking with a rule, try square or callipers against a stated tolerance', 'Joining with a named, appropriate method; clamping and checking for square', 'Use of jigs, templates or CAD/CAM to improve accuracy', 'Surface preparation and a named finish applied in stages', 'Safety precautions that are specific to the processes; a logical order throughout']],
 ] },
 { nea: 'Your making diary is this topic in practice. For each stage record the tool, why you chose it, how you kept it accurate, how you kept it safe, and one photo.' },
]},

]});
