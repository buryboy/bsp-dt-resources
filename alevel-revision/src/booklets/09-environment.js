/* Topic 9: Designing for maintenance and the cleaner environment (Edexcel 9DT0 9.1–9.2) */
BOOKLETS.push({ id: 't9', topic: 9, title: 'Designing for maintenance and the cleaner environment', pages: [

{ t: 'Overview and key words', blocks: [
 { notes: `<p class="lead">Topic 9 follows a product through its whole <b>life cycle</b> and asks, at each stage, how “<b>cleaner</b>” design and technology can reduce its impact. For each stage you need the characteristics, applications, advantages and disadvantages.</p>
 <table><tr><th>Page</th><th>Spec</th><th>Life-cycle stage</th></tr>
 <tr><td>2</td><td>9.1a</td><td>Material selection: source, quantity, quality, range, recyclability, biodegradability</td></tr>
 <tr><td>3</td><td>9.1b</td><td>Manufacture: energy, simpler processes, optimum use of materials</td></tr>
 <tr><td>4</td><td>9.1c</td><td>Distribution: packaging, transport, alternatives to fossil fuels</td></tr>
 <tr><td>5</td><td>9.1d–e</td><td>Use, repair and maintenance</td></tr>
 <tr><td>6</td><td>9.1f</td><td>End of life: disassembly, recovery, re-processing, energy recovery, landfill</td></tr>
 <tr><td>7</td><td>9.2</td><td>Wider issues: cost implications and sustainability</td></tr>
 <tr><td>8</td><td>9</td><td>Mixed exam practice</td></tr></table>
 <h4>Life cycle assessment (LCA)</h4>
 <p>An LCA measures a product’s environmental impact at every stage, “from cradle to grave”: raw materials → manufacture → distribution → use → end of life. It adds up the energy and materials used and the emissions and waste produced, so designers can see where the biggest impact is and compare alternatives. For a kettle or a car, most of the impact is in <b>use</b>; for a carrier bag, it is in materials and disposal.</p>` },
 { tip: '<b>Exam tip:</b> always say <b>which stage</b> of the life cycle a design decision improves, and what it reduces: <b>materials</b>, <b>energy</b>, <b>emissions</b> or <b>waste</b>. “It is better for the environment” on its own earns nothing.' },
 { keys: [
  ['Sustainability', 'Meeting today’s needs without reducing the ability of future generations to meet theirs'],
  ['Life cycle assessment', 'Measuring a product’s environmental impact at every stage of its life'],
  ['Finite resource', 'A resource that will run out, e.g. oil, metal ores'],
  ['Renewable resource', 'A resource that can be replaced naturally in a short time, e.g. managed timber, plant-based polymers'],
  ['Embodied energy', 'The total energy used to extract, process, make and transport a material or product'],
  ['Biodegradable', 'Broken down naturally by micro-organisms'],
  ['Design for disassembly', 'Designing a product so it can be taken apart easily for repair, reuse and recycling'],
  ['Modular construction', 'A product built from separate units that can be removed, replaced or upgraded individually'],
  ['Energy recovery', 'Burning waste to generate heat or electricity'],
  ['Carbon footprint', 'The total greenhouse gases released by a product or activity, measured as CO₂ equivalent'],
  ['Primary recycling', 'Reusing a product as it is, or for another purpose, without re-processing'],
  ['Tertiary recycling', 'Breaking a material down chemically into raw materials to make new products'],
 ] },
]},

{ t: 'Material selection', spec: '9.1a', blocks: [
 { notes: `<p>The spec lists six things to consider: <b>source, quantity, quality, range, recyclability, biodegradability</b>.</p>
 <table><tr><th>Factor</th><th>Cleaner design means…</th><th>Example</th></tr>
 <tr><td><b>Source</b></td><td>Renewable or recycled rather than finite, virgin materials; responsibly and locally sourced; avoiding toxic or conflict materials</td><td>FSC-certified timber; recycled aluminium, which needs only about 5% of the energy of new aluminium; bio-based polymers</td></tr>
 <tr><td><b>Quantity</b></td><td>Using less: thinner walls, hollow or ribbed sections, lightweighting, smaller products</td><td>Drinks cans and bottles are far lighter than 30 years ago; ribbed mouldings instead of thick walls</td></tr>
 <tr><td><b>Quality</b></td><td>Material good enough to last and to do the job, so the product is not replaced early; but not over-specified</td><td>Stainless steel fixings outdoors; avoiding a premium material where a recycled grade will do</td></tr>
 <tr><td><b>Range</b></td><td>Fewer different materials in one product, and avoiding bonded mixtures, so it is easier to sort and recycle</td><td>A chair made only of polypropylene; packaging from one polymer instead of laminated layers</td></tr>
 <tr><td><b>Recyclability</b></td><td>Materials that are widely collected and re-processed; parts marked with identification codes</td><td>Aluminium, steel, glass, PET and HDPE; thermoplastics rather than thermosets or composites</td></tr>
 <tr><td><b>Biodegradability</b></td><td>Materials that break down naturally where recycling is unlikely</td><td>Paper, card, cotton, wood; PLA and starch-based polymers for food packaging</td></tr></table>
 <h4>Advantages and disadvantages</h4>
 <table><tr><th>Advantages</th><th>Disadvantages</th></tr>
 <tr><td>Conserves finite resources; less mining, drilling and deforestation</td><td>Recycled and bio-based materials can cost more or vary in quality and colour</td></tr>
 <tr><td>Lower embodied energy and carbon footprint</td><td>Lightweighting can reduce strength or durability</td></tr>
 <tr><td>Less waste to landfill; meets legislation and customer expectations</td><td>Biodegradable polymers often need industrial composting, and can contaminate recycling</td></tr>
 <tr><td>Using less material also cuts cost and transport weight</td><td>A single material may not give the best performance for every part</td></tr></table>
 <h4>Polymer identification codes</h4>
 <p>1 PET · 2 HDPE · 3 PVC · 4 LDPE · 5 PP · 6 PS · 7 other. Moulded onto parts so they can be sorted.</p>` },
 { match: { q: 'Which material-selection factor does each decision address?', lh: 'Decision', rh: 'Factor', pairs: [['Using timber from an FSC-certified forest', 'Source'], ['Reducing the wall thickness of a bottle', 'Quantity'], ['Making a whole product from one polymer', 'Range'], ['Choosing PET because it is collected everywhere', 'Recyclability'], ['Using moulded paper pulp for a takeaway tray', 'Biodegradability'], ['Specifying a grade of steel that will last the product’s full life', 'Quality']] } },
 { sort: { h: 'Finite or renewable?', q: 'Sort each source.', cats: ['Finite', 'Renewable'], items: [['Crude oil for polymers', 0], ['Managed softwood forest', 1], ['Bauxite for aluminium', 0], ['Cotton', 1], ['Iron ore', 0], ['Corn starch for PLA', 1], ['Bamboo', 1]] } },
 { mcq: [
  ['Why does using recycled aluminium have a lower environmental impact than new aluminium?', ['It is stronger', 'Re-melting uses only a small fraction of the energy needed to extract aluminium from bauxite', 'It is lighter', 'It never needs sorting'], 1, 'Around 95% of the energy is saved.'],
  ['Why does reducing the range of materials in a product help the environment?', ['It makes the product heavier', 'Fewer, unmixed materials are easier to separate and recycle at the end of life', 'It uses more energy', 'It makes the product biodegradable'], 1, 'Bonded mixtures often cannot be recycled at all.'],
  ['What is a drawback of biodegradable polymers such as PLA?', ['They are made from oil', 'They usually need industrial composting and can contaminate plastic recycling', 'They cannot be moulded', 'They are toxic'], 1, 'In landfill or the sea they break down very slowly.'],
 ] },
 { exam: [
  ['**Explain** two ways a designer can reduce the environmental impact of a product through the selection of materials.', 4, ['Use recycled or renewable materials (1) so fewer finite resources are extracted (1)', 'Use less material / fewer types of material (1) so less energy is used and the product is easier to recycle (1)', 'Choose recyclable or biodegradable materials (1) so less waste goes to landfill (1)']],
  ['**Explain** one disadvantage of using recycled polymers in a new product.', 3, ['Recycled polymer can be contaminated or made of mixed grades (1), so its properties and colour are less consistent (1), which may limit it to darker, lower-performance or non-food parts (1)']],
 ] },
]},

{ t: 'Manufacture', spec: '9.1b', blocks: [
 { notes: `<p>The spec lists: <b>minimising energy use</b>, <b>simplification of processes</b>, and <b>achieving optimum use of materials and components</b>, giving consideration to <b>material form, cost and scale of production</b>.</p>
 <h4>Minimising energy use</h4>
 <ul><li>Efficient machines and motors; switching off when idle; insulating ovens and moulds; recovering waste heat.</li>
 <li>Lower-temperature processes and materials; shorter cycle times.</li>
 <li>Renewable energy: solar panels, wind, biomass.</li>
 <li>Good scheduling so machines run full and are not heated up for small runs.</li></ul>
 <h4>Simplification of processes</h4>
 <ul><li>Fewer parts and fewer operations: one moulding with clips and living hinges instead of several parts with screws.</li>
 <li><b>Self-finishing</b> materials (coloured polymers, anodised aluminium) so no painting, solvents or drying ovens.</li>
 <li>Near-net-shape processes (die casting, injection moulding, 3D printing) that need little machining.</li>
 <li>Standard and bought-in components.</li></ul>
 <h4>Optimum use of materials and components</h4>
 <ul><li><b>Nesting</b> and <b>tessellating</b> parts on sheet material with CAD/CAM to cut waste.</li>
 <li>Designing to <b>standard stock sizes and forms</b> (sheet, bar, tube) so there are few offcuts.</li>
 <li>Re-grinding sprues and runners; recycling swarf and offcuts back into production.</li>
 <li>Accurate processes and quality assurance: fewer rejects.</li>
 <li>Lean manufacturing and JIT: no over-production or obsolete stock.</li></ul>
 <h4>Material form, cost and scale</h4>
 <p>The cleanest method depends on the <b>form</b> the material comes in and the <b>scale</b>: machining a part from solid bar wastes material but suits a one-off; a die or mould wastes almost nothing but its cost and embodied energy are only justified by high volume. Reducing waste and energy usually <b>saves money</b> as well.</p>
 <table><tr><th>Advantages</th><th>Disadvantages</th></tr>
 <tr><td>Lower energy bills, material costs and waste-disposal costs</td><td>New efficient machinery and renewable energy need investment</td></tr>
 <tr><td>Lower emissions; easier to meet regulations and targets</td><td>Redesigning products and processes takes time</td></tr>
 <tr><td>Simpler products are quicker to assemble and to disassemble</td><td>Integrating parts can make repair harder if one feature fails</td></tr></table>` },
 { sort: { h: 'Which principle?', q: 'Sort each action.', cats: ['Minimising energy', 'Simplifying processes', 'Optimum use of materials'], items: [['Nesting parts closely on a sheet before laser cutting', 2], ['Moulding a casing in a coloured polymer so it needs no painting', 1], ['Fitting solar panels to the factory roof', 0], ['Re-grinding sprues and runners into new mouldings', 2], ['Replacing four screwed parts with one clip-together moulding', 1], ['Recovering heat from ovens to warm the building', 0], ['Designing a shelf to be cut from a standard 2440 × 1220 mm sheet with no offcut', 2]] } },
 { calc: [
  ['A sheet 1200 mm × 600 mm is used to cut 8 panels, each 290 mm × 280 mm. What percentage of the sheet is wasted? (to 1 d.p.)', 9.8, 0.05, '%', 'Sheet: 720,000 mm². Panels: 8 × 81,200 = 649,600 mm². Waste: 70,400 ÷ 720,000 × 100 = 9.8%.'],
  ['After nesting is improved, 12 parts are cut from a sheet instead of 10. By what percentage has the number of parts per sheet increased?', 20, 0.01, '%', '(12 − 10) ÷ 10 × 100 = 20%.'],
  ['An injection moulding weighs 48 g and its sprue and runner weigh 12 g. What percentage of each shot is sprue and runner?', 20, 0.01, '%', '12 ÷ (48 + 12) × 100 = 20%. Re-grinding it avoids this waste.'],
 ] },
 { mcq: [
  ['How does using a self-finishing material make manufacture cleaner?', ['It uses more paint', 'No separate finishing process is needed, saving energy, solvents and time', 'It makes the product heavier', 'It needs extra parts'], 1, 'No paint shop, solvents or drying ovens.'],
  ['Why does designing to standard stock sizes reduce waste?', ['Stock sizes are cheaper to paint', 'Parts can be cut with few or no offcuts', 'Standard sizes are stronger', 'It removes the need for quality control'], 1, 'Also fewer cutting operations.'],
 ] },
 { exam: [
  ['**Explain** two ways a manufacturer could reduce the environmental impact of producing injection-moulded products.', 4, ['Re-grind and reuse sprues, runners and rejects (1) so less new polymer is needed and less waste is produced (1)', 'Use energy-efficient (e.g. electric) machines / insulate barrels / renewable electricity (1) to reduce energy use and emissions (1)', 'Use coloured polymer so no painting is needed (1) avoiding solvents and a further process (1)']],
  ['**Explain** how simplifying the design of a product can make its manufacture cleaner.', 3, ['Fewer parts and operations are needed (1), so less energy, tooling and material are used (1), and there is less handling, transport between processes and scrap (1)']],
 ] },
]},

{ t: 'Distribution', spec: '9.1c', blocks: [
 { notes: `<p>The spec lists: <b>efficient use of packaging</b>, <b>reduction of transport</b> and <b>alternatives to fossil fuels</b>.</p>
 <h4>Efficient use of packaging</h4>
 <ul><li><b>Reduce:</b> the minimum packaging that still protects, informs and sells; no oversized boxes or unnecessary layers; lightweighting.</li>
 <li><b>Reuse:</b> returnable crates, pallets and totes; refillable containers.</li>
 <li><b>Recycle:</b> one easily recycled material (card) instead of mixed card, foam and film; recycled content; moulded pulp instead of expanded polystyrene.</li>
 <li><b>Shape:</b> packs that tessellate and stack with no wasted space, so more fit on a pallet and in a lorry.</li>
 <li>Packaging still has a job: without it, damaged products are a bigger waste than the packaging itself.</li></ul>
 <h4>Reduction of transport</h4>
 <ul><li><b>Flat-pack</b> and nesting or stacking designs: more products per load.</li>
 <li>Lighter, smaller, more concentrated products.</li>
 <li><b>Local</b> sourcing and manufacture close to the market; regional distribution centres.</li>
 <li>Full loads, efficient route planning, no empty return journeys; selling direct to customers.</li>
 <li>Slower, more efficient modes: ship and rail produce far less CO₂ per tonne-kilometre than road, and air freight is by far the worst.</li>
 <li>Digital distribution where possible (manuals, software, music).</li></ul>
 <h4>Alternatives to fossil fuels</h4>
 <ul><li><b>Electric</b> vans and lorries (cleanest when charged from renewable electricity); cargo bikes for city deliveries.</li>
 <li><b>Hydrogen</b> fuel cells for heavy vehicles; <b>biofuels</b> (biodiesel, bioethanol, biomethane).</li>
 <li>Electrified rail; wind-assisted and cleaner-fuelled ships.</li></ul>
 <table><tr><th>Advantages</th><th>Disadvantages</th></tr>
 <tr><td>Lower fuel use, emissions and congestion; lower transport cost per product</td><td>Electric and hydrogen vehicles are expensive, with limited range and charging or refuelling networks</td></tr>
 <tr><td>Less packaging to buy and to dispose of</td><td>Too little packaging risks damage and returns</td></tr>
 <tr><td>Flat-pack lowers storage costs for manufacturer and retailer</td><td>Flat-pack moves assembly to the customer; biofuels compete with food crops for land</td></tr></table>` },
 { sort: { h: 'Which strategy?', q: 'Sort each action.', cats: ['Efficient packaging', 'Reducing transport', 'Alternative to fossil fuels'], items: [['Replacing polystyrene inserts with moulded card pulp', 0], ['Designing furniture to be flat-packed', 1], ['Delivering by electric van', 2], ['Making the product in the country where it is sold', 1], ['Using returnable plastic crates instead of single-use boxes', 0], ['Running lorries on biomethane', 2], ['Resizing a box so 20% more fit on a pallet', 1]] } },
 { calc: [
  ['A lorry carries 120 assembled chairs. Flat-packed, it carries 480. By what factor has the number of chairs per journey increased?', 4, 0, 'times', '480 ÷ 120 = 4 times, so a quarter of the journeys are needed.'],
  ['A pallet holds 48 boxes. Redesigning the box lets it hold 60. How many fewer pallets are needed to ship 4,800 boxes?', 20, 0, 'pallets', 'Before: 4,800 ÷ 48 = 100. After: 4,800 ÷ 60 = 80. Saving: 20 pallets.'],
 ] },
 { mcq: [
  ['Why does flat-packing reduce environmental impact?', ['It uses more packaging', 'More products fit in each vehicle, so fewer journeys and less fuel', 'It makes products stronger', 'It avoids all packaging'], 1, 'It also reduces storage space.'],
  ['Which transport mode produces the most CO₂ per tonne carried per kilometre?', ['Container ship', 'Rail', 'Air freight', 'Canal barge'], 2, 'Air freight is many times worse than shipping.'],
  ['Why can reducing packaging too far be worse for the environment?', ['Packaging is always recyclable', 'Damaged products are wasted and must be replaced and transported again', 'Customers prefer more packaging', 'It makes lorries heavier'], 1, 'The product usually has a much bigger footprint than its packaging.'],
 ] },
 { exam: [
  ['**Explain** two ways a designer could reduce the environmental impact of distributing a product.', 4, ['Reduce packaging or design it to flat-pack (1) so more fit in each load and fewer journeys are needed (1)', 'Make it lighter or make it closer to the market (1) cutting fuel use and emissions (1)', 'Recyclable/biodegradable packaging (1) with reason (1)']],
  ['**Discuss** the use of electric vehicles to distribute products from a regional warehouse to shops.', 6, ['No exhaust emissions in towns; lower running and maintenance costs; quiet for night deliveries', 'Lower carbon footprint if charged from renewable electricity', 'High purchase cost; limited range and payload because of battery weight; charging time and infrastructure', 'Environmental and ethical cost of battery materials; electricity may come from fossil fuels', 'Suits short, predictable routes from a warehouse'],],
 ] },
]},

{ t: 'Use, repair and maintenance', spec: '9.1d–e', blocks: [
 { notes: `<h4>Use (9.1d): repair versus replacement, energy efficiency, efficiency ratings</h4>
 <ul><li><b>Repair versus replacement:</b> repairing keeps the materials and embodied energy in use and avoids waste. But replacement can be the cleaner choice if a new product is <b>much more energy efficient</b> in use (an old fridge or boiler), or if the repair costs more than a new product. Designers influence this by making repair easy and spare parts available.</li>
 <li><b>Energy efficiency:</b> for products that use energy, the use stage is usually the largest part of the footprint. Design features: LED lighting, efficient motors, insulation, eco modes, automatic standby and switch-off, sensors and timers, rechargeable batteries, low water use.</li>
 <li><b>Efficiency ratings:</b> energy labels grade appliances from <b>A</b> (most efficient, green) to <b>G</b> (least, red) and show yearly energy use, so buyers can compare running costs. Cars have CO₂ and fuel-economy ratings; buildings have energy performance certificates. Ratings push manufacturers to improve.</li></ul>
 <h4>Repair and maintenance (9.1e): standardisation, modular construction, bought-in parts</h4>
 <table><tr><th>Approach</th><th>How it helps</th><th>Example</th></tr>
 <tr><td><b>Standardisation</b></td><td>Standard fixings, batteries, bulbs and fittings can be replaced with common tools and parts from any supplier</td><td>M-series screws, AA batteries, USB-C chargers, standard bike components</td></tr>
 <tr><td><b>Modular construction</b></td><td>The product is built from separate modules; a faulty or outdated module is swapped without replacing the whole product</td><td>Fairphone; desktop PCs; modular sofas; printer cartridges; power-tool battery systems</td></tr>
 <tr><td><b>Bought-in parts</b></td><td>Components from specialist suppliers are widely available as spares for years, at low cost</td><td>Motors, bearings, switches, castors</td></tr></table>
 <p>Also: access panels and screws rather than glue or welds; clear service manuals and exploded diagrams; wear parts (filters, belts, blades, seals) that are easy to reach; self-diagnosis and fault codes.</p>
 <table><tr><th>Advantages of designing for maintenance</th><th>Disadvantages</th></tr>
 <tr><td>Longer product life: less waste and fewer new products needed</td><td>Screws, joints and modules can add size, weight, parts and cost</td></tr>
 <tr><td>Lower lifetime cost for the user; upgrades possible</td><td>Fewer replacement sales for the manufacturer</td></tr>
 <tr><td>Builds reputation; meets right-to-repair laws</td><td>Spare parts must be stocked for years; harder to seal against water and dust</td></tr></table>` },
 { sort: { h: 'Repair or replace?', q: 'For the environment, which is usually the better choice?', cats: ['Repair', 'Replace'], items: [['A bike with a worn chain', 0], ['A 25-year-old fridge rated far below modern efficiency', 1], ['A laptop with a failed battery that unclips', 0], ['An old, inefficient gas boiler that needs a major new part', 1], ['A chair with a loose joint', 0], ['Filament light bulbs still working in a house', 1]] } },
 { match: { q: 'Match the design feature to how it helps maintenance.', lh: 'Feature', rh: 'Benefit', pairs: [['Standard screws instead of glue', 'The casing can be opened with common tools'], ['Modular construction', 'A faulty unit can be swapped without replacing the whole product'], ['Bought-in bearings', 'Spares are available from many suppliers for years'], ['Fault codes on a display', 'The problem is identified quickly'], ['An exploded diagram in the manual', 'Users and repairers can see how parts fit together']] } },
 { calc: [
  ['An old fridge uses 420 kWh a year; a new A-rated one uses 110 kWh. How many kWh are saved in 10 years?', 3100, 0, 'kWh', '(420 − 110) × 10 = 3,100 kWh.'],
  ['At €0.25 per kWh, how much money does that save over the 10 years?', 775, 0.01, '€', '3,100 × 0.25 = €775.'],
 ] },
 { exam: [
  ['**Explain** how modular construction makes a product easier to maintain.', 3, ['The product is made from separate self-contained units (1), so a faulty or worn module can be removed and replaced on its own (1), which is quicker and cheaper than repairing or replacing the whole product (1)']],
  ['**Explain** two benefits to the consumer of energy efficiency ratings on domestic appliances.', 4, ['Shows how efficient the appliance is on a simple A to G scale (1) so products can be compared easily before buying (1)', 'Shows energy used per year (1) so running costs / environmental impact can be estimated (1)']],
  ['A manufacturer is designing a new cordless vacuum cleaner. **Discuss** the factors it should consider when deciding whether to design the product to be repaired or replaced.', 6, ['Environmental: repair extends life and reduces e-waste and resource use; batteries and motors are the parts most likely to fail', 'Design: screws and modules instead of glue; effect on size, weight, sealing and appearance', 'Cost: more parts and assembly time; stocking spares; lost replacement sales against reputation and loyalty', 'Legal and market: right-to-repair rules, repairability scores, customer expectations', 'Users’ skills and tools; safety of battery replacement'],],
 ] },
]},

{ t: 'End of life', spec: '9.1f', blocks: [
 { notes: `<p>The spec lists: <b>design for disassembly</b>, <b>recovered material collection, sorting and re-processing methods</b>, <b>energy recovery</b>, and the <b>environmental implications of disposal to landfill</b>.</p>
 <h4>Design for disassembly</h4>
 <ul><li>Fewer parts and fewer different materials.</li>
 <li>Mechanical fixings (screws, clips, snap fits) instead of adhesives, welds or over-moulding; the same type and size of fixing throughout.</li>
 <li>Parts marked with material identification codes.</li>
 <li>Hazardous or valuable parts (batteries, circuit boards) easy to find and remove.</li>
 <li>No paint or labels that contaminate the material.</li></ul>
 <h4>Collection</h4><p>Kerbside collections, bottle banks, recycling centres, retailer take-back schemes, deposit-return schemes. Producers of electrical goods, batteries, vehicles and packaging are legally responsible for funding collection and recycling (for example the WEEE rules for electrical equipment).</p>
 <h4>Sorting</h4>
 <table><tr><th>Method</th><th>Separates</th></tr>
 <tr><td>Magnets</td><td>Steel and iron</td></tr>
 <tr><td>Eddy current separators</td><td>Aluminium and other non-ferrous metals</td></tr>
 <tr><td>Near-infrared (optical) sorters with air jets</td><td>Different polymers; colours of glass</td></tr>
 <tr><td>Float–sink tanks</td><td>Polymers by density</td></tr>
 <tr><td>Screens, air blowers, hand picking</td><td>Paper, card, film; contamination</td></tr></table>
 <h4>Re-processing</h4>
 <table><tr><th>Type</th><th>Meaning</th><th>Example</th></tr>
 <tr><td><b>Primary</b> recycling</td><td>The product is reused as it is, or for another purpose</td><td>Refilled bottles; charity shops; reclaimed timber</td></tr>
 <tr><td><b>Secondary</b> (mechanical) recycling</td><td>The material is shredded, melted and re-formed, usually into a lower-grade product</td><td>PET bottles → fleece; aluminium cans → new cans</td></tr>
 <tr><td><b>Tertiary</b> (chemical) recycling</td><td>The material is broken down chemically into raw materials</td><td>Polymers back into monomers or oil</td></tr></table>
 <p>Metals and glass can be recycled again and again with no loss of quality; paper fibres shorten each time; polymers usually degrade (“downcycling”); thermosets and composites are very hard to recycle.</p>
 <h4>Energy recovery</h4>
 <p>Waste that cannot be recycled is burnt in an <b>energy-from-waste</b> plant to generate electricity and heat. ✔ Recovers energy; cuts the volume going to landfill by about 90%. ✘ Releases CO₂; the materials are lost for good; emissions must be cleaned; can discourage recycling.</p>
 <h4>Environmental implications of landfill</h4>
 <ul><li>Materials and their embodied energy are <b>lost</b>.</li>
 <li>Rotting waste produces <b>methane</b>, a powerful greenhouse gas.</li>
 <li><b>Leachate</b>: toxic liquid that can pollute soil and groundwater (heavy metals from batteries and electronics).</li>
 <li>Polymers take hundreds of years to break down; land is used up; smell, vermin and visual impact.</li>
 <li>Landfill tax makes it increasingly expensive.</li></ul>
 <h4>The waste hierarchy</h4><p>Prevent → reuse → recycle → recover energy → dispose. Choose the highest option possible.</p>` },
 { order: { q: 'Put the waste hierarchy in order, best option first.', steps: ['Prevent waste: reduce what is used', 'Reuse the product', 'Recycle the materials', 'Recover energy by burning', 'Dispose of in landfill'] } },
 { match: { q: 'Match the sorting method to what it separates.', lh: 'Method', rh: 'Separates', pairs: [['Magnet', 'Steel cans'], ['Eddy current separator', 'Aluminium cans'], ['Near-infrared sorter', 'Different types of polymer'], ['Float–sink tank', 'Polymers of different density']] } },
 { sort: { h: 'Primary, secondary or tertiary?', q: 'Sort each example of recycling.', cats: ['Primary', 'Secondary', 'Tertiary'], items: [['A glass milk bottle washed and refilled', 0], ['HDPE bottles shredded and moulded into garden furniture', 1], ['Waste polymer broken down chemically into oil', 2], ['A wooden pallet turned into a planter', 0], ['Steel cans melted to make new steel', 1], ['Nylon carpet depolymerised to make new nylon', 2]] } },
 { tf: [
  ['Using glue instead of screws makes a product easier to disassemble.', false, 'Adhesives make parts hard to separate cleanly.'],
  ['Energy recovery means burning waste to generate heat or electricity.', true, 'It is better than landfill but below recycling in the hierarchy.'],
  ['Landfill produces methane.', true, 'Methane is a powerful greenhouse gas; some sites capture it for fuel.'],
  ['Thermosetting polymers are easy to recycle by melting.', false, 'They do not melt; they are very difficult to recycle.'],
 ] },
 { exam: [
  ['**Explain** how designing for disassembly reduces environmental impact.', 3, ['Parts are held with mechanical fixings rather than glue, so they can be separated (1)', 'Materials can be sorted and recycled, or parts reused (1)', 'Faulty parts can be replaced, so the product lasts longer and less goes to landfill (1)']],
  ['**Explain** two environmental implications of disposing of electronic products in landfill.', 6, ['Valuable finite materials such as copper and gold are buried (1), so more must be mined (1), using energy and damaging habitats (1)', 'Heavy metals and chemicals from batteries and circuit boards leak out as leachate (1), contaminating soil and groundwater (1), harming wildlife and drinking water (1)']],
  ['**Evaluate** energy recovery as a method of dealing with products at the end of their life.', 9, ['Recovers useful heat and electricity from waste that cannot be recycled; reduces landfill volume and methane', 'Releases CO₂ and needs emission controls; ash to dispose of; public opposition', 'Materials are destroyed, so finite resources are lost; below reuse and recycling in the waste hierarchy; may reduce the incentive to recycle', 'Suitable for mixed, contaminated or composite waste', 'A reasoned judgement'],],
 ] },
]},

{ t: 'Wider issues: cost and sustainability', spec: '9.2', blocks: [
 { notes: `<h4>Cost implications of cleaner technologies (9.2a)</h4>
 <table><tr><th></th><th>Costs</th><th>Savings and benefits</th></tr>
 <tr><td><b>Manufacturer</b></td><td>Research and redesign; new tooling and efficient machinery; recycled, certified or bio-based materials may cost more; testing and certification; setting up take-back and recycling</td><td>Less material and energy used; lower waste-disposal costs and landfill tax; avoiding fines and meeting legislation; green image attracts customers and investors; can charge a premium; ready for future regulation</td></tr>
 <tr><td><b>Consumer</b></td><td>Often a higher purchase price (an electric car, an A-rated appliance, a repairable product)</td><td>Lower running costs through energy and water efficiency; longer product life; repair instead of replacement; better resale value; over the product’s life the total cost is often lower</td></tr></table>
 <p>Key idea: <b>purchase price is not the same as lifetime cost</b>. Cleaner products often cost more to buy and less to own. Not every consumer can afford the higher price up front, and some products are sold as “green” without real evidence (<b>greenwashing</b>).</p>
 <h4>Sustainability (9.2b)</h4>
 <p>The spec defines it as designing <b>without jeopardising the potential for people in the future to meet their needs</b>. It has three sides:</p>
 <ul><li><b>Environmental:</b> conserve finite resources, use renewable materials and energy, cut pollution and carbon emissions, protect habitats.</li>
 <li><b>Social:</b> fair pay and safe conditions; products that improve lives; healthy communities.</li>
 <li><b>Economic:</b> businesses must stay profitable to keep employing people and investing.</li></ul>
 <h4>The designer’s toolkit: the 6 Rs</h4>
 <table><tr><th>R</th><th>Question for the designer</th></tr>
 <tr><td><b>Rethink</b></td><td>Is there a better way to meet this need? Does the product need to exist?</td></tr>
 <tr><td><b>Refuse</b></td><td>Can unsustainable materials, processes or packaging be rejected?</td></tr>
 <tr><td><b>Reduce</b></td><td>Can less material and energy be used?</td></tr>
 <tr><td><b>Reuse</b></td><td>Can the product or its parts be used again?</td></tr>
 <tr><td><b>Repair</b></td><td>Can it be fixed easily when it fails?</td></tr>
 <tr><td><b>Recycle</b></td><td>Can the materials be recovered at the end of life?</td></tr></table>
 <p>The <b>circular economy</b> (Topic 12) takes this further: products and materials are kept in use, and waste is designed out.</p>` },
 { sort: { h: 'Cost or saving?', q: 'For a manufacturer adopting cleaner technology, is each a cost or a saving?', cats: ['Cost', 'Saving or benefit'], items: [['Buying new energy-efficient machinery', 0], ['Lower electricity bills', 1], ['Paying less landfill tax', 1], ['Redesigning the product and tooling', 0], ['A greener brand image that attracts customers', 1], ['Certification and testing fees', 0]] } },
 { match: { q: 'Match each of the 6 Rs to an example.', lh: 'R', rh: 'Example', pairs: [['Rethink', 'Offering a tool-hire service instead of selling drills'], ['Refuse', 'Deciding not to use PVC in a product range'], ['Reduce', 'Thinner packaging and lighter parts'], ['Reuse', 'A refillable deodorant case'], ['Repair', 'Supplying spare parts and a service manual'], ['Recycle', 'Marking polymers and using a single material']] } },
 { mcq: [
  ['Why might a cleaner product have a higher purchase price but a lower lifetime cost?', ['It is taxed more', 'It costs more to develop and make, but uses less energy and lasts longer', 'It is always imported', 'It needs more repairs'], 1, 'Running costs and product life matter as much as the price tag.'],
  ['What is greenwashing?', ['Cleaning products with water', 'Making a product seem more environmentally friendly than it really is', 'Painting products green', 'Recycling water in a factory'], 1, 'It misleads consumers and damages trust.'],
  ['Which statement best describes sustainability?', ['Using only natural materials', 'Meeting today’s needs without preventing future generations from meeting theirs', 'Making products as cheaply as possible', 'Recycling everything'], 1, 'It balances environmental, social and economic needs.'],
 ] },
 { exam: [
  ['**Discuss** the cost implications for a manufacturer of making its products more sustainable.', 6, ['Higher costs: recycled or certified materials, new tooling, testing', 'Savings: less material and energy, less waste and disposal cost', 'Market: green image can justify a higher price; legislation may require it anyway', 'Depends on scale, product and customers’ willingness to pay'],],
  ['**Explain** two cost implications for a consumer of buying an A-rated washing machine rather than a cheaper, less efficient model.', 6, ['Higher purchase price (1), because efficient motors, sensors and insulation cost more to make (1), so more money is needed up front (1)', 'Lower running costs (1), because it uses less electricity and water in each wash (1), so the extra cost is paid back over its life (1)']],
 ] },
]},

{ t: 'Mixed exam practice', spec: '9.1–9.2', blocks: [
 { exam: [
  ['**State** two ways in which a product can be designed for disassembly.', 2, ['Any two: mechanical fixings/clips instead of adhesive; fewer parts; fewer materials; standard fixings; marked materials; accessible batteries/components (1)(1)']],
  ['**Explain** three ways in which the designer of a flat-pack bookcase could reduce its impact on the environment.', 9, ['Specify FSC-certified or recycled-fibre board (1), so the timber comes from a renewable, managed source (1), protecting forests and their habitats (1)', 'Design the panels to nest on standard sheets and pack flat (1), so there is less offcut waste and more units per lorry (1), reducing material use and transport emissions (1)', 'Use knock-down fittings rather than glue (1), so the bookcase can be taken apart, repaired or moved (1), extending its life and allowing materials to be separated for recycling (1)']],
  ['A company makes single-use coffee pods from a mixture of aluminium and polymer. **Evaluate** the environmental impact of this product across its life cycle.', 12, ['Materials: aluminium has high embodied energy and comes from mined bauxite; polymer from oil; small quantity per pod but billions made', 'Manufacture and distribution: efficient high-volume production; light, compact product; but individual packaging', 'Use: a pod machine heats only the water needed and wastes little coffee, which can reduce energy and food waste compared with other methods', 'End of life: mixed, bonded materials and wet coffee make recycling difficult; most go to landfill or incineration unless there is a take-back scheme; alternatives: all-aluminium, compostable or refillable pods', 'Wider: convenience drives consumption; manufacturer responsibility', 'A reasoned overall judgement'],],
 ] },
 { nea: 'Carry out a quick life cycle check on your NEA product: for each stage (materials, manufacture, distribution, use, repair, end of life), note one decision you made, or could make, to reduce its impact. A short table like this is good evidence in your specification and evaluation.' },
]},

]});
