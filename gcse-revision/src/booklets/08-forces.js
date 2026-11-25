/* 3.2.2 Forces and stresses (AQA 8552, specialist technical principles) */
SPEC.push(
 ['q8a', 8, '3.2.2', 'Forces: tension, compression, bending, torsion and shear', 'How materials and objects are manipulated to resist and work with forces', '**Name** the force acting on (a) the rope in a tug of war and (b) the legs of a chair when someone sits on it.', 2, ['(a) Tension (1)', '(b) Compression (1)']],
 ['q8b', 8, '3.2.2', 'Enhancing materials to resist forces', 'Reinforcing, stiffening or making more flexible: lamination, bending, folding, webbing, fabric interfacing', '**Explain** how folding or corrugating a thin sheet material makes it stiffer.', 2, ['The folds give the sheet depth, like many small beams or triangles side by side (1)', 'so it resists bending across the folds without adding much weight or material, e.g. corrugated card or a corrugated steel roof (1)']],
);
BOOKLETS.push({ id: 'g8', topic: 8, title: 'Forces and stresses', pages: [

{ t: 'Overview and key words', blocks: [
 { notes: `<p class="lead">Every product has forces acting on it. Designers must know <b>which forces</b> act, and how to make a material or a shape <b>resist</b> them.</p>
 <table><tr><th>Force</th><th>What it does</th><th>Picture it</th></tr>
 <tr><td><b>Tension</b></td><td>Pulls apart; stretches</td><td>A rope in a tug of war</td></tr>
 <tr><td><b>Compression</b></td><td>Pushes together; squashes</td><td>The legs of a chair being sat on</td></tr>
 <tr><td><b>Bending</b></td><td>Makes it curve: one side is stretched and the other is squashed</td><td>A shelf loaded with books</td></tr>
 <tr><td><b>Torsion</b></td><td>Twists</td><td>A screwdriver being turned</td></tr>
 <tr><td><b>Shear</b></td><td>Two forces slide past each other in opposite directions, trying to cut</td><td>Scissors cutting paper; a rivet holding two plates that are pulled apart</td></tr></table>` },
 { keys: [
  ['Tension', 'A pulling force that stretches a material'],
  ['Compression', 'A pushing force that squashes a material'],
  ['Bending', 'A force that makes a material curve, with tension on one side and compression on the other'],
  ['Torsion', 'A twisting force'],
  ['Shear', 'Forces acting in opposite directions across a material, trying to slide one part past the other'],
  ['Static load', 'A force that does not move, such as a book resting on a shelf'],
  ['Dynamic load', 'A force that moves or changes, such as a person jumping on a floor'],
  ['Lamination', 'Bonding thin layers together to make a stronger, stiffer material'],
  ['Webbing', 'Strong woven strips used to support and spread a load'],
  ['Interfacing', 'An extra layer of fabric added inside a textile product to stiffen or strengthen it'],
  ['Triangulation', 'Using triangles in a frame so that it cannot change shape'],
  ['Rib', 'A raised ridge moulded or pressed into a thin part to stiffen it'],
 ] },
]},

{ t: 'The five forces', spec: '3.2.2', blocks: [
 { notes: `<table><tr><th>Force</th><th>Where you find it</th><th>Materials and shapes that resist it</th></tr>
 <tr><td><b>Tension</b></td><td>Guitar strings, suspension bridge cables, a bag strap, a tent guy rope</td><td>Steel cable, rope, nylon webbing, Kevlar. Fibres and wires are strong in tension</td></tr>
 <tr><td><b>Compression</b></td><td>Table and chair legs, building columns, the sole of a shoe, a car jack</td><td>Concrete, brick, cast iron, timber along the grain. Thick, short columns resist best</td></tr>
 <tr><td><b>Bending</b></td><td>A shelf, a diving board, a bridge deck, a fishing rod</td><td>Deep sections (an I-beam, a plank on edge), plywood, laminated beams. The top is in compression and the bottom is in tension</td></tr>
 <tr><td><b>Torsion</b></td><td>A screwdriver shaft, a drive shaft, a door handle, wringing out a cloth</td><td>Round bar and tube; tough steels</td></tr>
 <tr><td><b>Shear</b></td><td>Rivets and bolts in a joint, scissors, a guillotine, a hole punch</td><td>Hard, strong steel pins; larger cross-section fixings</td></tr></table>
 <p>Most products feel <b>several forces at once</b>. On a bicycle: the frame tubes are in compression and tension, the pedal cranks are bending, the handlebar stem is in torsion when you steer, and the bolt holding the wheel is in shear.</p>
 <p>A <b>static</b> load stays still (a vase on a shelf). A <b>dynamic</b> load moves or changes (a child jumping on a bed). Dynamic loads are harder to design for.</p>
 <p><b>Working with forces.</b> Sometimes the designer <b>uses</b> a force: a spring stores energy when compressed, scissors use shear to cut, and a clothes peg uses torsion in its spring.</p>` },
 { match: { q: 'Which force is acting?', lh: 'Situation', rh: 'Force', pairs: [['The cable holding up a lift', 'Tension'], ['The legs of a stool with someone sitting on it', 'Compression'], ['A plank used as a bridge across a stream', 'Bending'], ['The shaft of a screwdriver being turned', 'Torsion'], ['A bolt joining two plates that are pulled in opposite directions', 'Shear']] } },
 { mcq: [
  ['When a shelf bends under a load, what happens to its top surface?', ['It is in tension', 'It is in compression', 'It is in torsion', 'Nothing'], 1, 'The top is squashed and the bottom is stretched.'],
  ['Which is the best example of a dynamic load?', ['A lamp standing on a table', 'A roof covered in snow', 'A person bouncing on a trampoline', 'Books on a shelf'], 2, 'The force keeps changing.'],
  ['Which force does a pair of tin snips use to cut sheet metal?', ['Tension', 'Torsion', 'Shear', 'Compression'], 2, 'The two blades slide past each other.'],
 ] },
]},

{ t: 'Enhancing materials to resist forces', spec: '3.2.2', blocks: [
 { notes: `<p>Materials can be <b>reinforced</b>, <b>stiffened</b> or made <b>more flexible</b> so that a product works better. The specification names five methods.</p>
 <table><tr><th>Method</th><th>How it works</th><th>Examples</th></tr>
 <tr><td><b>Lamination</b></td><td>Thin layers are bonded together. The result is stronger and stiffer than one layer, and can be curved</td><td>Plywood; laminated (glulam) roof beams; curved chair frames; laminated safety glass; card laminated with polymer film</td></tr>
 <tr><td><b>Bending</b></td><td>Bending a flat sheet into a curve or an angle gives it depth, so it resists force far better</td><td>A steel angle bracket; a tube made from flat sheet; the curved body of a drinks can; a line-bent acrylic stand</td></tr>
 <tr><td><b>Folding</b></td><td>Folds and corrugations act like many small beams</td><td>Corrugated card; corrugated steel roofing; folded edges on a sheet-metal tray; pleats</td></tr>
 <tr><td><b>Webbing</b></td><td>Strong woven strips carry tension and spread a load. In moulded parts, a web is a thin wall or rib that braces the part</td><td>Seat belts, rucksack straps, the support under a sofa seat; ribs inside a polymer chair or casing</td></tr>
 <tr><td><b>Fabric interfacing</b></td><td>A layer of fabric sewn or ironed (fused) inside a textile product to stiffen and strengthen one area</td><td>Shirt collars and cuffs, waistbands, button bands, bag bases</td></tr></table>
 <h4>Other ways designers add strength</h4>
 <ul><li><b>Triangulation:</b> a triangle cannot change shape, so a diagonal brace or gusset makes a frame rigid (bike frames, roof trusses, shelf brackets).</li>
 <li><b>Ribs and flanges</b> moulded into thin polymer parts.</li>
 <li><b>Reinforcing with another material:</b> steel bars in concrete, glass fibre in resin.</li></ul>
 <h4>Making a material more flexible</h4>
 <ul><li><b>Kerfing:</b> a row of saw cuts part-way through timber or MDF lets it bend into a curve.</li>
 <li>Adding a <b>plasticiser</b> to PVC, or <b>elastane</b> to a fabric.</li>
 <li>A thin <b>living hinge</b> moulded into polypropylene.</li></ul>` },
 { match: { q: 'Match each product to the way it has been strengthened or stiffened.', lh: 'Product', rh: 'Method', pairs: [['A shirt collar that keeps its shape', 'Fabric interfacing'], ['A skateboard deck made from thin veneers', 'Lamination'], ['A cardboard box with a wavy middle layer', 'Folding (corrugating)'], ['A rucksack strap', 'Webbing'], ['A metal shelf bracket with a diagonal strut', 'Triangulation']] } },
 { tf: [
  ['A flat sheet of steel is stiffer than the same sheet folded into an L shape.', false, 'Folding gives it depth, which resists bending.'],
  ['Laminating thin layers of wood allows a strong curved shape to be made.', true, 'Each thin layer bends easily; glued together they hold the curve.'],
  ['Interfacing is used to make part of a garment stiffer.', true, 'Collars, cuffs and waistbands.'],
 ] },
 { exam: [
  ['**Explain** why a shelf bracket has a diagonal strut.', 2, ['The strut makes a triangle with the two arms of the bracket (1)', 'A triangle cannot change shape, so the bracket does not bend down under the load (1)']],
 ] },
]},

{ t: 'Exam practice', spec: '3.2.2', blocks: [
 { mcq: [
  ['Which force twists a material?', ['Shear', 'Tension', 'Torsion', 'Compression'], 2, 'Torsion is twisting.'],
  ['The chains of a playground swing are mainly in…', ['compression', 'tension', 'torsion', 'shear'], 1, 'They are pulled by the weight of the seat and child.'],
  ['Which method stiffens a textile product?', ['Kerfing', 'Interfacing', 'Galvanising', 'Annealing'], 1, 'A layer added inside the fabric.'],
 ] },
 { exam: [
  ['**Describe** what happens to a beam when it bends under a load.', 2, ['The top surface is squashed: it is in compression (1)', 'The bottom surface is stretched: it is in tension (1)']],
  ['**Explain** two ways that a thin sheet material can be made stiffer without making it thicker.', 4, ['Folding or corrugating it (1) so the folds act like small beams and resist bending (1)', 'Laminating it to other layers (1) so the bonded layers share the load and cannot slide over each other (1)', 'Accept: bending into a curve or tube; adding ribs; forming a rolled or folded edge']],
  ['A designer is developing a folding camping chair with a metal tube frame and a fabric seat. **Explain** the forces acting on the chair when it is in use and how the design resists them.', 6, ['The legs are in compression from the person’s weight; tube is used because it resists compression and bending for little weight', 'The fabric seat is in tension; a strong woven fabric such as polyester or nylon is used, with the weave resisting stretch', 'Seams and edges are reinforced with webbing or double stitching where the load is concentrated', 'The pivots (rivets or bolts) are in shear; steel fixings of a large enough diameter are used', 'Crossed legs form triangles, so the frame cannot fold or sway sideways in use', 'A dynamic load when someone drops into the chair is much larger than the static load, so there must be a safety margin']],
 ] },
 { nea: 'On your NEA drawings, mark where each force acts on your product with labelled arrows, and say how your design resists it. It is quick to do and shows real technical understanding.' },
]},

]});
