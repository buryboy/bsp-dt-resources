/* Topic 2: Performance characteristics of materials (Edexcel 9DT0 topic 2) */
BOOKLETS.push({ id: 't2', topic: 2, title: 'Performance characteristics', pages: [

{ t: 'The key properties', spec: '2', blocks: [
 { notes: `<p class="lead">Topic 2 is the vocabulary for every materials answer in the paper. You need to define each property precisely, give an example of a material that has it, and link it to a product.</p>
 <table><tr><th>Property</th><th>Definition</th><th>Good example</th></tr>
 <tr><td><b>Electrical conductivity</b></td><td>How easily a material lets electricity flow through it</td><td>Copper wire; opposite: insulators like UF, PVC</td></tr>
 <tr><td><b>Thermal conductivity</b></td><td>How easily heat passes through a material</td><td>Aluminium saucepan; opposite: wool, foam, wood handles</td></tr>
 <tr><td><b>Strength</b></td><td>Ability to withstand a force without breaking or permanently deforming. Name the type: tensile (pulling), compressive (squashing), shear (sliding), bending, torsion (twisting)</td><td>Steel cable (tensile); concrete, cast iron (compressive)</td></tr>
 <tr><td><b>Elasticity</b></td><td>Ability to stretch or bend under a load and return to its original shape when the load is removed</td><td>Rubber, spring steel</td></tr>
 <tr><td><b>Plasticity</b></td><td>Ability to be permanently changed in shape without breaking</td><td>Clay, heated thermoplastics, lead</td></tr>
 <tr><td><b>Malleability</b></td><td>Ability to be pressed, hammered or rolled into shape without cracking</td><td>Aluminium (cans), gold, copper</td></tr>
 <tr><td><b>Ductility</b></td><td>Ability to be stretched or drawn out into a thin wire without breaking</td><td>Copper wire, mild steel</td></tr>
 <tr><td><b>Hardness</b></td><td>Resistance to scratching, wear, cutting and indentation</td><td>High carbon steel (files), ceramics, acrylic is harder than polythene</td></tr>
 <tr><td><b>Toughness</b></td><td>Ability to absorb energy (impact) without breaking or cracking. Opposite: brittle</td><td>Polycarbonate, ABS, mild steel, nylon</td></tr>
 <tr><td><b>Durability</b></td><td>Ability to withstand wear, weathering and deterioration over time</td><td>Stainless steel, uPVC windows, oak</td></tr>
 <tr><td><b>Biodegradability</b></td><td>Ability to be broken down naturally by micro-organisms (bacteria, fungi) into natural substances</td><td>Paper, wood, cotton, PLA (industrial composting)</td></tr></table>
 <p>These terms apply to <b>every material group</b>, not just metals and polymers: corrugated board is stiff for its weight; nylon fibre has high tensile strength; cotton and paper are biodegradable; oak is durable; CFRP is strong and stiff but fails in a brittle way.</p>
 <h4>Commonly confused</h4>
 <ul><li><b>Hard ≠ tough.</b> Glass is hard (scratch resistant) but brittle. Rubber is tough but soft.</li>
 <li><b>Strong ≠ stiff.</b> Stiffness is resistance to bending/flexing; a nylon rope is strong in tension but not stiff.</li>
 <li><b>Malleable</b> = compression (hammering, pressing). <b>Ductile</b> = tension (stretching into wire).</li>
 <li><b>Elastic</b> returns to shape; <b>plastic</b> stays deformed.</li></ul>` },
 { keys: [
  ['Tensile strength', 'Resistance to being pulled apart'],
  ['Compressive strength', 'Resistance to being squashed'],
  ['Elasticity', 'Returns to original shape after the load is removed'],
  ['Plasticity', 'Permanently changes shape without breaking'],
  ['Malleability', 'Can be hammered, pressed or rolled without cracking'],
  ['Ductility', 'Can be drawn out into a wire'],
  ['Hardness', 'Resists scratching, wear and indentation'],
  ['Toughness', 'Absorbs impact energy without breaking'],
  ['Durability', 'Withstands wear and weathering over time'],
  ['Biodegradability', 'Broken down naturally by micro-organisms'],
  ['Thermal conductivity', 'How easily heat passes through'],
  ['Brittleness', 'Breaks suddenly with little deformation; the opposite of tough'],
 ] },
 { mcq: [
  ['A file must cut steel without wearing. Which property matters most?', ['Toughness', 'Hardness', 'Ductility', 'Elasticity'], 1, 'Hardness resists wear and lets it cut softer metals.'],
  ['Safety glasses lenses must not shatter if hit. Which property?', ['Hardness', 'Toughness', 'Malleability', 'Conductivity'], 1, 'Toughness: absorb the impact energy without breaking. Polycarbonate is used.'],
  ['Copper can be drawn into thin wire because it is…', ['malleable', 'ductile', 'hard', 'elastic'], 1, 'Ductility is about stretching in tension; malleability is about pressing or hammering.'],
  ['A saucepan handle should have…', ['high thermal conductivity', 'low thermal conductivity', 'high ductility', 'high elasticity'], 1, 'Low conductivity so heat does not reach the hand.'],
  ['A drinks can is formed by pressing aluminium sheet. This relies on…', ['ductility', 'malleability', 'hardness', 'biodegradability'], 1, 'Pressing and rolling in compression needs malleability (deep drawing also needs some ductility).'],
  ['A bungee cord must stretch and return. Which property?', ['Plasticity', 'Elasticity', 'Hardness', 'Durability'], 1, 'Elastic materials return to their original shape.'],
  ['Which is a hard but brittle material?', ['Rubber', 'Glass', 'Nylon', 'Mild steel'], 1, 'Glass resists scratching but shatters on impact.'],
  ['A bridge cable is mainly loaded in…', ['compression', 'tension', 'torsion', 'shear'], 1, 'Cables are pulled, so tensile strength matters.'],
 ] },
 { tf: [
  ['A hard material is always tough.', false, 'Glass and ceramics are hard but brittle.'],
  ['Malleability and ductility mean exactly the same thing.', false, 'Malleable: deforms under compression (hammering, rolling). Ductile: stretches under tension (wire).'],
  ['Biodegradable materials are broken down by micro-organisms.', true, 'Bacteria and fungi break them down into natural substances.'],
  ['Elastic deformation is permanent.', false, 'Elastic deformation is temporary; plastic deformation is permanent.'],
  ['Wood is stronger along the grain than across it.', true, 'Fibres run along the grain, so it is much stronger in that direction.'],
 ] },
]},

{ t: 'Forces, stress and how materials fail', spec: '2', blocks: [
 { notes: `<h4>The five forces</h4>
 <table><tr><th>Force</th><th>What happens</th><th>Product example</th></tr>
 <tr><td><b>Tension</b></td><td>Pulling apart, stretching</td><td>Rope, guitar string, bike brake cable</td></tr>
 <tr><td><b>Compression</b></td><td>Squashing, pushing together</td><td>Table legs, columns, building foundations</td></tr>
 <tr><td><b>Bending</b></td><td>One face in tension, the other in compression</td><td>Shelf, diving board, beam</td></tr>
 <tr><td><b>Shear</b></td><td>Layers forced to slide past each other</td><td>Scissors cutting, a rivet or bolt in a joint</td></tr>
 <tr><td><b>Torsion</b></td><td>Twisting</td><td>Screwdriver shaft, drive shaft, turning a key</td></tr></table>
 <h4>Stress–strain behaviour (tensile test)</h4>
 <p>In a <b>tensile test</b> a standard test piece is pulled until it breaks while load and extension are measured.</p>
 <ul><li><b>Elastic region:</b> extension is proportional to load (Hooke’s law); remove the load and it returns to its length.</li>
 <li><b>Elastic limit / yield point:</b> beyond this, deformation is permanent.</li>
 <li><b>Plastic region:</b> the material stretches permanently; ductile materials like mild steel stretch a long way and <b>neck</b> before breaking.</li>
 <li><b>Ultimate tensile strength:</b> the maximum stress before failure.</li>
 <li><b>Brittle</b> materials (cast iron, acrylic) break with very little plastic deformation.</li></ul>
 <h4>Improving performance by design</h4>
 <p>Designers stiffen and strengthen products by shape as well as material: ribs and webs on mouldings, corrugations, folding sheet edges, triangulation in frames, tubes instead of solid bar, I-beams, laminating.</p>` },
 { match: { q: 'Which force is the main one acting on each part?', lh: 'Part', rh: 'Force', pairs: [['A climbing rope holding a climber', 'Tension'], ['The legs of a stool when sat on', 'Compression'], ['A loaded bookshelf', 'Bending'], ['The pin in a pair of scissors', 'Shear'], ['A screwdriver shaft in use', 'Torsion']] } },
 { order: { q: 'Put the stages of a tensile test on mild steel in order.', steps: ['The test piece stretches elastically: extension proportional to load', 'It reaches the yield point', 'It stretches plastically: permanent deformation', 'It reaches its maximum load (ultimate tensile strength)', 'It necks: the cross-section narrows in one place', 'It fractures'] } },
 { mcq: [
  ['Why are ribs moulded on the inside of a plastic casing?', ['For decoration', 'To increase stiffness without making the whole wall thicker', 'To make it lighter in colour', 'To help it biodegrade'], 1, 'Ribs add stiffness and strength with little extra material and keep wall sections even for moulding.'],
  ['Why are bike frames made from tubes rather than solid bar?', ['Tubes are cheaper per kilo', 'A tube resists bending and torsion almost as well as solid bar for much less weight', 'Tubes are easier to paint', 'Solid bar rusts'], 1, 'Material far from the centre does most of the work in bending; the centre adds weight but little stiffness.'],
  ['What does necking in a tensile test show?', ['The material is brittle', 'The material is ductile and is about to fail', 'It has reached the elastic limit', 'It is work hardening evenly'], 1, 'Necking is local thinning in ductile materials just before fracture.'],
 ] },
 { exam: [
  ['**Describe** what happens to a ductile metal during a tensile test.', 4, ['Stretches elastically, proportional to load, returns if load removed (1)', 'Reaches yield point/elastic limit (1)', 'Deforms plastically, permanently stretching; reaches ultimate tensile strength (1)', 'Necks then fractures (1)']],
  ['**Explain** two ways a designer could increase the stiffness of an injection-moulded polymer casing without increasing wall thickness.', 4, ['Add ribs/webs (1) which resist bending with little extra material (1)', 'Use curved/domed or folded forms (1) which spread loads and resist flexing (1)', 'Choose a stiffer polymer or add glass-fibre fill (1) raising modulus (1)']],
 ] },
]},

{ t: 'Testing materials', spec: '2', blocks: [
 { notes: `<h4>Industrial tests (standardised, give numbers you can compare)</h4>
 <table><tr><th>Test</th><th>Measures</th><th>How</th></tr>
 <tr><td><b>Tensile test</b> (tensometer)</td><td>Tensile strength, elasticity, ductility (% elongation)</td><td>Standard test piece pulled until it breaks; load and extension recorded</td></tr>
 <tr><td><b>Brinell / Vickers / Rockwell</b></td><td>Hardness</td><td>A hardened ball or diamond pyramid is pressed in with a set load; the size or depth of the dent gives the hardness number</td></tr>
 <tr><td><b>Izod / Charpy impact test</b></td><td>Toughness</td><td>A swinging pendulum hits a notched specimen; the energy it absorbs in breaking is measured</td></tr>
 <tr><td><b>Fatigue test</b></td><td>Resistance to repeated loading</td><td>Specimen loaded and unloaded or rotated many thousands of times until it fails</td></tr>
 <tr><td><b>Electrical / thermal tests</b></td><td>Conductivity</td><td>Measure resistance with a meter; measure heat flow through a sample</td></tr></table>
 <h4>Simple workshop tests (comparative)</h4>
 <ul><li><b>Hardness:</b> try to scratch with a file or scriber, or drop a ball bearing and compare the dent.</li>
 <li><b>Toughness:</b> clamp in a vice and strike with a hammer, or drop a weight from a set height; does it bend or snap? Wear eye protection and use a safety screen, because brittle samples can shatter.</li>
 <li><b>Elasticity/stiffness:</b> clamp as a cantilever, hang a weight, measure deflection, remove the weight and see if it returns.</li>
 <li><b>Ductility/malleability:</b> bend repeatedly or hammer flat and look for cracking.</li>
 <li><b>Conductivity:</b> put it in a simple circuit with a bulb or multimeter.</li></ul>
 <p>Make it a <b>fair test</b>: same size samples, same force, same method, repeat and average.</p>` },
 { match: { q: 'Match the test to what it measures.', lh: 'Test', rh: 'Measures', pairs: [['Charpy or Izod', 'Toughness (impact energy absorbed)'], ['Vickers or Brinell', 'Hardness (resistance to indentation)'], ['Tensile test', 'Tensile strength and ductility'], ['Repeated loading over many cycles', 'Fatigue resistance'], ['Multimeter in a circuit', 'Electrical conductivity']] } },
 { mcq: [
  ['Why is the specimen in an impact test notched?', ['To make it look standard', 'So it breaks at a known point and the test is repeatable', 'To make it lighter', 'To measure hardness'], 1, 'The notch concentrates stress so every specimen fails in the same place.'],
  ['To make a workshop test fair you should…', ['use different sized samples', 'keep sample size, force and method the same and repeat', 'test only once', 'use your strongest hammer blow'], 1, 'Control the variables and repeat to get reliable results.'],
 ] },
 { exam: [
  ['**Describe** a simple workshop test to compare the toughness of three polymers.', 4, ['Cut samples the same size and shape (1)', 'Clamp each in a vice / use a drop weight from the same height (1)', 'Strike with the same force / drop the same mass (1)', 'Compare whether each cracks, bends or snaps; repeat for reliability (1)', 'Accept as an alternative point: eye protection / safety screen, as samples may shatter (1)']],
  ['**Explain** why industrial tests such as the Vickers test are used rather than workshop tests when specifying materials.', 2, ['They are standardised and give numerical values (1) so materials can be compared accurately / to a specification or British Standard (1)']],
 ] },
]},

{ t: 'Properties in products: exam practice', spec: '2', blocks: [
 { notes: `<h4>The property chain</h4><p>For every product answer: <b>part of product → load or condition it faces → property needed → material that has it → benefit</b>.</p>
 <p>Example: <i>A hammer head is struck repeatedly against nails (impact). It needs to be hard so it does not dent, and tough so it does not shatter. Medium carbon steel, hardened and tempered, gives both, so the hammer lasts and is safe.</i></p>` },
 { match: { q: 'Which property is most important for each product part?', lh: 'Product part', rh: 'Property', pairs: [['Electrical wire core', 'Electrical conductivity'], ['Oven glove filling', 'Low thermal conductivity'], ['Disposable plates', 'Biodegradability'], ['Phone screen surface', 'Hardness (scratch resistance)'], ['Toddler’s toy that gets thrown', 'Toughness'], ['Car body panel pressed from sheet', 'Malleability'], ['Garden furniture left outside', 'Durability']] } },
 { exam: [
  ['**Explain** the difference between hardness and toughness. Give a material example for each.', 4, ['Hardness: resistance to scratching, wear or indentation (1), e.g. high carbon steel file, ceramic, glass (1)', 'Toughness: ability to absorb impact energy without breaking (1), e.g. polycarbonate, ABS, mild steel (1)']],
  ['**Explain** why copper is used for the tracks on a printed circuit board.', 2, ['Excellent electrical conductivity (1) so current flows with little resistance/heat loss; ductile, easily etched and soldered (1)']],
  ['**Discuss** the importance of biodegradability when selecting materials for single-use products.', 6, ['Single-use items become waste quickly, so biodegradable materials reduce landfill and litter/ocean plastic (1–2)', 'Examples: paper straws, PLA cups, card packaging (1)', 'But: many only break down in industrial composting, not landfill or sea (1); may perform worse (soggy straws, less barrier) (1); may contaminate plastic recycling streams (1)', 'Reducing or reusing may be better than biodegradable single use (1)']],
  ['A designer is choosing a material for the shaft of a screwdriver. **Explain** two performance characteristics it must have.', 4, ['Strength in torsion (1) so the shaft does not twist or shear when turning tight screws (1)', 'Hardness (1) so the tip does not wear or deform in the screw head (1)', 'Toughness (1) so it does not snap if used to lever (1)']],
 ] },
 { nea: 'Pick one part of your NEA prototype. Which forces will it face in use, and which performance characteristics does that mean the material must have? Could you test this in your evaluation?' },
 { eh: 'Exam-style questions: the real paper’s tariffs', exam: [
  ['**Explain** one reason why ductility is an important property of the copper used in electrical cables.', 3, ['Ductile materials can be drawn out without breaking (1), so copper can be pulled through dies into long, thin wire (1), and the finished cable can be bent around corners during installation without snapping (1)']],
  ['**Explain** two performance characteristics of polycarbonate that make it a suitable material for the visor of a cycle helmet.', 6, ['Tough / high impact strength (1), so it absorbs the energy of a stone or a fall without shattering (1), protecting the rider’s eyes from fragments (1)', 'Good optical clarity / transparent (1), so the rider’s vision is not distorted (1), which is essential for safety on the road (1)', 'Durable / weather resistant with UV stabiliser (1) so it does not degrade outdoors (1) and keeps its clarity for longer (1)']],
  ['Disposable cutlery can be made from the biodegradable polymer PLA instead of polystyrene. **Discuss** the factors a manufacturer should consider before making this change.', 6, ['Performance: PLA softens at a lower temperature, so hot food may be a problem; stiffness and toughness in use', 'Cost of material and whether existing injection moulds and machines can be used', 'End of life: PLA only composts in industrial conditions; contamination of plastic recycling', 'Source: renewable plant starch rather than oil; land use', 'Customer and legal pressure on single-use plastics; marketing value'],]
 ] },
]},

]});
