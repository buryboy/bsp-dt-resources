/* 3.2.5 Using and working with materials (AQA 8552, specialist technical principles) */
SPEC.push(
 ['q11a', 11, '3.2.5', 'Properties in commercial products', 'How properties influence use and affect performance: flyers and food packaging · toys and flat-pack furniture · cooking utensils and hand tools · polymer seating and electrical fittings · sportswear and furnishings · motor vehicles and domestic appliances', '**Explain** why beech is a suitable timber for a traditional wooden toy.', 2, ['It is hard and tough with a close grain (1)', 'so it does not dent or splinter when dropped or chewed, and takes a smooth, safe finish (1)']],
 ['q11b', 11, '3.2.5', 'Modification of properties', 'Additives to prevent moisture transfer · seasoning · annealing · stabilisers to resist UV · flame retardants · photosensitive PCB board · anodising aluminium', '**Explain** why UV stabilisers are added to the polymer used for garden furniture.', 2, ['Ultraviolet light from the sun breaks down the polymer chains (1)', 'so without a stabiliser the chair would fade and become brittle and crack; the stabiliser slows this and the chair lasts longer (1)']],
 ['q11c', 11, '3.2.5', 'Shaping and forming', 'Cutting, abrasion and addition: cut, crease, score, fold, perforate · cut, drill, chisel, sand, plane · turn, mill, cast, braze, weld · deform, print · sew, pleat, gather, quilt, pipe · solder', '**Describe** the difference between scoring and perforating card.', 2, ['Scoring: a line is cut or pressed part-way into the card so that it folds cleanly and accurately (1)', 'Perforating: a row of small holes or slits is cut through the card so that it can be torn off neatly (1)']],
);
BOOKLETS.push({ id: 'g11', topic: 11, title: 'Using and working with materials', pages: [

{ t: 'Overview and key words', blocks: [
 { notes: `<p class="lead">Three linked ideas: how a material's <b>properties</b> decide where it is used in real products; how those properties can be <b>modified</b>; and how the material is <b>shaped and formed</b>.</p>
 <table><tr><th>Page</th><th>What it covers</th></tr>
 <tr><td>2</td><td>Properties of materials in commercial products</td></tr>
 <tr><td>3</td><td>Modification of properties</td></tr>
 <tr><td>4</td><td>Shaping and forming, then exam practice</td></tr></table>
 <p>The specification gives two <b>commercial products</b> for each material area. Learn the pair for the area you will write about, and be able to explain why each material suits them.</p>` },
 { keys: [
  ['Physical property', 'What a material is like, such as its density or conductivity'],
  ['Mechanical property', 'How a material behaves under a force, such as its strength or toughness'],
  ['Additive', 'A substance mixed into a material to change its properties'],
  ['Annealing', 'Heating a metal and cooling it slowly to make it softer and easier to shape'],
  ['Work hardening', 'A metal becoming harder and more brittle as it is bent or hammered'],
  ['Stabiliser', 'An additive that stops a polymer breaking down in sunlight'],
  ['Flame retardant', 'A chemical treatment that makes a material harder to set alight and slower to burn'],
  ['Anodising', 'Using electricity to thicken the oxide layer on aluminium so it is harder and resists corrosion'],
  ['Wasting', 'Shaping by removing material, as in sawing, drilling and sanding'],
  ['Addition', 'Shaping by joining or adding material, as in welding, sewing and 3D printing'],
  ['Deforming', 'Changing the shape of a material without removing any, as in bending and vacuum forming'],
  ['Abrasion', 'Wearing a surface away by rubbing, as in sanding and filing'],
 ] },
]},

{ t: 'Properties in commercial products', spec: '3.2.5', blocks: [
 { notes: `<table><tr><th>Material area</th><th>Product</th><th>Material and the properties that matter</th></tr>
 <tr><td rowspan="2"><b>Papers and boards</b></td><td>Flyers and leaflets</td><td>Coated paper, about 130 to 170 gsm: light and cheap for thousands of copies; smooth surface prints sharp, bright colour; folds without cracking; recyclable</td></tr>
 <tr><td>Card-based food packaging</td><td>Folding boxboard, solid white or foil-lined board: stiff enough to protect and stack; food safe; prints well; can be cut, creased and glued by machine; a coating or foil resists grease and moisture</td></tr>
 <tr><td rowspan="2"><b>Timber</b></td><td>Traditional children's toys</td><td>Beech: hard, tough, close grained, does not splinter; safe with a non-toxic finish; pleasant to hold</td></tr>
 <tr><td>Flat-pack furniture</td><td>Chipboard and MDF with a veneer or laminate: cheap; large flat, stable sheets; machined accurately by CNC so the parts fit; joined with knock-down fittings</td></tr>
 <tr><td rowspan="2"><b>Metals</b></td><td>Cooking utensils</td><td>Stainless steel: does not rust or taint food, hard, easy to clean. Aluminium and copper pan bases: good thermal conductors, so heat spreads evenly</td></tr>
 <tr><td>Hand tools</td><td>High carbon (tool) steel: can be hardened and tempered so it is hard enough to keep an edge and tough enough not to shatter. Chrome plating resists rust</td></tr>
 <tr><td rowspan="2"><b>Polymers</b></td><td>Polymer seating</td><td>Polypropylene: tough, flexes without snapping, light, resists chemicals and weather; colour moulded in; injection moulded in one piece</td></tr>
 <tr><td>Electrical fittings</td><td>Urea formaldehyde: electrical insulator; hard and rigid; thermosetting, so it does not soften if it gets hot</td></tr>
 <tr><td rowspan="2"><b>Textiles</b></td><td>Sportswear</td><td>Polyester and polyamide with elastane: light, strong, stretch and recover; wick sweat away and dry fast</td></tr>
 <tr><td>Furnishings</td><td>Hard-wearing woven fabrics (wool, cotton, polyester blends): resist abrasion and fading; treated to be flame retardant and stain resistant</td></tr>
 <tr><td rowspan="2"><b>Systems</b></td><td>Motor vehicles</td><td>Steel body: strong, tough, pressed to shape. Aluminium and composites to save weight. Sensors and microcontrollers manage the engine, brakes and safety systems</td></tr>
 <tr><td>Domestic appliances</td><td>Polymer casings insulate and are easily moulded; copper wiring conducts; motors, heating elements, sensors and microcontrollers do the work</td></tr></table>` },
 { match: { q: 'Match each product to the property that matters most.', lh: 'Product', rh: 'Key property', pairs: [['A plug socket', 'Electrical insulator that does not soften with heat'], ['The base of a saucepan', 'Good thermal conductor'], ['A wood chisel blade', 'Hard enough to keep a sharp edge'], ['A stacking school chair', 'Tough and flexes without snapping'], ['Cycling shorts', 'Stretches and returns to shape'], ['A baby’s wooden rattle', 'Does not splinter']] } },
 { mcq: [
  ['Why is stainless steel preferred to low carbon steel for a kitchen whisk?', ['It is cheaper', 'It does not rust and is easy to keep clean', 'It is a better insulator', 'It is softer'], 1, 'It will be wet and washed every day.'],
  ['Why is flat-pack furniture usually made from manufactured boards?', ['They have an attractive natural grain', 'They come in large, stable, flat sheets and are cheap', 'They are stronger than oak', 'They are waterproof'], 1, 'They are consistent, so CNC machining gives parts that fit.'],
 ] },
]},

{ t: 'Modification of properties', spec: '3.2.5', blocks: [
 { notes: `<p>A material's properties can be <b>changed</b> to suit a purpose. The specification gives one example for each area.</p>
 <table><tr><th>Material area</th><th>Modification</th><th>What it does and why</th></tr>
 <tr><td><b>Papers and boards</b></td><td><b>Additives to prevent moisture transfer</b></td><td>“Sizing” agents such as starch or resin are added to the pulp, or a wax or polymer coating is applied. The fibres absorb less, so ink does not spread and the board resists water and grease: cups, food cartons</td></tr>
 <tr><td><b>Timber</b></td><td><b>Seasoning to reduce moisture content</b></td><td>Drying in air or a kiln makes timber stronger, more stable and less likely to warp, split or rot</td></tr>
 <tr><td><b>Metals</b></td><td><b>Annealing to soften and improve malleability</b></td><td>As metal is bent or beaten it <b>work hardens</b> and may crack. Heating it and letting it cool slowly makes it soft and malleable again, so shaping can continue. Used on copper, brass, aluminium and steel</td></tr>
 <tr><td><b>Polymers</b></td><td><b>Stabilisers to resist UV degradation</b></td><td>Sunlight makes many polymers fade, go brittle and crack. UV stabilisers slow this down: garden furniture, window frames, playground slides</td></tr>
 <tr><td><b>Textiles</b></td><td><b>Flame retardants to reduce combustion and fire hazards</b></td><td>A chemical finish makes the fabric harder to light and slower to burn: children's nightwear, furniture coverings, curtains in public buildings</td></tr>
 <tr><td rowspan="2"><b>Systems</b></td><td><b>Photosensitive PCB board</b></td><td>Copper-clad board is coated with a light-sensitive layer. The track pattern is exposed with UV light through a mask, developed, and the unwanted copper is etched away, leaving accurate tracks</td></tr>
 <tr><td><b>Anodising aluminium</b></td><td>The aluminium is made the positive electrode in an acid bath. The natural oxide layer thickens, giving a hard, corrosion-resistant surface that can be dyed: torch bodies, phone cases, climbing equipment</td></tr></table>
 <p>Other modifications you may know: <b>hardening and tempering</b> steel; adding a <b>plasticiser</b> to PVC; adding <b>pigments</b> for colour; <b>alloying</b> metals.</p>` },
 { match: { q: 'Match each modification to its purpose.', lh: 'Modification', rh: 'Purpose', pairs: [['Annealing copper', 'Makes it soft and malleable again'], ['Seasoning timber', 'Reduces the moisture content'], ['Adding a UV stabiliser', 'Stops a polymer going brittle in sunlight'], ['Applying a flame retardant', 'Makes a fabric slower to catch fire'], ['Anodising aluminium', 'Gives a harder, corrosion-resistant surface'], ['Adding size to paper pulp', 'Stops moisture soaking in']] } },
 { tf: [
  ['Annealing makes a metal harder.', false, 'It makes it softer and more malleable.'],
  ['Work hardening happens when a metal is repeatedly bent or hammered.', true, 'It can then crack unless it is annealed.'],
  ['An anodised surface can be dyed a colour.', true, 'The oxide layer absorbs dye before it is sealed.'],
 ] },
 { exam: [
  ['**Explain** why a metalworker anneals a piece of copper several times while beating it into a bowl.', 3, ['Hammering work hardens the copper, making it hard and brittle (1)', 'Annealing (heating and cooling) makes it soft and malleable again (1)', 'so it can be shaped further without cracking (1)']],
 ] },
]},

{ t: 'Shaping, forming and exam practice', spec: '3.2.5', blocks: [
 { notes: `<p>Materials are shaped by <b>cutting</b> and <b>abrasion</b> (removing material) and by <b>addition</b> (joining or adding material).</p>
 <table><tr><th>Material area</th><th>Processes named in the specification</th><th>Typical tools</th></tr>
 <tr><td><b>Papers and boards</b></td><td>Cut, crease, score, fold, perforate</td><td>Craft knife and safety rule, scissors, rotary cutter, creasing bar, laser cutter, die cutter</td></tr>
 <tr><td><b>Timber</b></td><td>Cut, drill, chisel, sand, plane</td><td>Tenon saw, coping saw, band saw; pillar drill; bevel-edge chisel and mallet; glass paper, disc sander; smoothing plane</td></tr>
 <tr><td><b>Metals</b></td><td>Cut, drill, turn, mill, cast, braze, weld</td><td>Hacksaw, tin snips; pillar drill; centre lathe; milling machine; casting in sand moulds; brazing hearth; MIG welder</td></tr>
 <tr><td><b>Polymers</b></td><td>Cut, drill, cast, deform, print, weld</td><td>Coping saw, laser cutter; pillar drill; casting resin; line bender and vacuum former; 3D printer; solvent (plastic) welding</td></tr>
 <tr><td><b>Textiles</b></td><td>Sew, pleat, gather, quilt, pipe</td><td>Sewing machine, overlocker, needles, pins, iron</td></tr>
 <tr><td><b>Systems</b></td><td>Cut, drill, solder</td><td>PCB shears or saw, PCB drill, soldering iron</td></tr></table>
 <h4>Some terms to be sure of</h4>
 <ul><li><b>Crease / score:</b> a line pressed or part-cut into card so that it folds neatly. <b>Perforate:</b> a row of small holes so that it tears off.</li>
 <li><b>Turn:</b> the work spins in a lathe and a tool cuts it, making round parts. <b>Mill:</b> a spinning cutter removes material from work that is held still, making flat faces and slots.</li>
 <li><b>Braze:</b> join steel or copper with a melted brass filler rod. <b>Weld:</b> melt the edges of the parts themselves so they fuse.</li>
 <li><b>Pleat:</b> fold fabric back on itself and stitch it. <b>Gather:</b> draw fabric up along a thread to add fullness. <b>Quilt:</b> stitch through two layers with wadding between for warmth and padding. <b>Pipe:</b> insert a covered cord into a seam to strengthen and decorate the edge.</li></ul>` },
 { sort: { q: 'Is the process cutting or abrasion (removing material), or addition (adding or joining)?', cats: ['Cutting or abrasion', 'Addition'], items: [['Planing', 0], ['Welding', 1], ['Drilling', 0], ['Soldering', 1], ['Sanding', 0], ['Sewing', 1], ['Milling', 0], ['3D printing', 1], ['Brazing', 1], ['Chiselling', 0]] } },
 { match: { q: 'Match each textile technique to its description.', lh: 'Technique', rh: 'Description', pairs: [['Pleating', 'Folding the fabric back on itself and stitching the fold'], ['Gathering', 'Drawing the fabric up along a line of stitching'], ['Quilting', 'Stitching through two layers with wadding between'], ['Piping', 'Inserting a covered cord into a seam']] } },
 { mcq: [
  ['Which machine would be used to turn a round table leg?', ['Milling machine', 'Lathe', 'Band saw', 'Pillar drill'], 1, 'In turning, the work rotates.'],
  ['Which process joins two pieces of steel by melting a brass filler rod between them?', ['Welding', 'Soldering', 'Brazing', 'Riveting'], 2, 'In welding the steel itself melts; in brazing only the filler does.'],
 ] },
 { exam: [
  ['**Name** two hand tools used to shape timber and **state** what each is used for.', 4, ['Tenon saw (1): cutting straight lines / joints (1)', 'Chisel (1): removing waste from joints / paring (1)', 'Accept: coping saw for curves; plane for flattening and smoothing; rasp or file for shaping; glass paper for smoothing']],
  ['**Explain** why polypropylene is used to make school chairs.', 3, ['It is tough and slightly flexible, so it does not crack when people lean back or drop it (1)', 'It is light, so chairs are easy to move and stack (1)', 'It can be injection moulded in one piece with the colour moulded in, so chairs are cheap and never need painting (1)']],
  ['For a commercial product made from a material you have studied, **explain** how the properties of the material make it suitable and how the material has been shaped.', 6, ['A named product and a specific material, e.g. a beech toy train, a stainless steel saucepan, a polypropylene chair, a polyester sports top', 'Two or more properties, each linked to how the product is used', 'Any modification that improves it, e.g. seasoning, annealing, UV stabiliser, flame retardant, non-toxic finish', 'How it is shaped, with correct process names, e.g. sawn, turned and sanded; pressed and spun; injection moulded; cut, sewn and overlocked', 'Why that process suits the material and the number being made', 'Clear, specific detail rather than general words such as “strong”']],
 ] },
 { nea: 'In your making diary, name each process with the correct term (wasting, addition, deforming) and say why you chose that tool. Examiners look for the vocabulary on this page.' },
]},

]});
