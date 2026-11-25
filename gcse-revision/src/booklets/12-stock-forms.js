/* 3.2.6 Stock forms, types and sizes (AQA 8552, specialist technical principles) */
SPEC.push(
 ['q12a', 12, '3.2.6', 'Stock forms and sizes', 'Commercially available types and sizes: sheet, roll, ply · planks, boards, mouldings · sheet, rod, bar, tube · powder, granules, foam, films · yarns, fabrics · sold by length, width, thickness, diameter, gauge, weight', '**Explain** two reasons why manufacturers buy materials in standard stock forms and sizes.', 4, ['They are made in large quantities by suppliers (1) so they are cheaper and quick to obtain (1)', 'Sizes are consistent and already close to what is needed (1) so less cutting, machining and waste, and parts fit standard components (1)']],
 ['q12b', 12, '3.2.6', 'Standard components', 'Fasteners, seals, bindings · woodscrews, hinges, KD fittings · rivets, machine screws, nuts, bolts · zips, press studs, velcro · E12 resistors, DIL ICs, PIC microcontrollers', '**Explain** why flat-pack furniture uses knock-down (KD) fittings.', 2, ['They let the customer assemble the furniture at home with simple tools such as a screwdriver or hex key (1)', 'so it can be sold and transported flat, which saves space and cost, and it can be taken apart again (1)']],
 ['q12c', 12, '3.2.6', 'Calculating quantities', 'Calculating quantities and sizes of materials · surface area and volume · nesting and minimising waste', 'Circles 100 mm in diameter are cut from a sheet 600 mm × 400 mm, arranged in straight rows and columns. **Calculate** how many circles can be cut and the area of the sheet that is wasted. (Use π = 3.14.)', 4, ['600 ÷ 100 = 6 and 400 ÷ 100 = 4, so 6 × 4 = 24 circles (1)', 'Area of one circle = 3.14 × 50² = 7850 mm² (1)', 'Total used = 24 × 7850 = 188 400 mm² (1)', 'Waste = 240 000 − 188 400 = 51 600 mm² (1)']],
);
BOOKLETS.push({ id: 'g12', topic: 12, title: 'Stock forms, types and sizes', pages: [

{ t: 'Overview and key words', blocks: [
 { notes: `<p class="lead">Materials are sold in <b>standard shapes and sizes</b> called <b>stock forms</b>. Designers design around them, because it is cheaper and quicker than having something specially made. Many joining parts are also bought ready-made as <b>standard components</b>.</p>
 <table><tr><th>Page</th><th>What it covers</th></tr>
 <tr><td>2</td><td>Stock forms and how each material is sold</td></tr>
 <tr><td>3</td><td>Standard components</td></tr>
 <tr><td>4</td><td>Calculating quantities, area, volume and waste, then exam practice</td></tr></table>
 <p>This topic carries a lot of the paper's <b>maths</b>. Show your working: there are marks for the method even if the final answer is wrong.</p>` },
 { keys: [
  ['Stock form', 'A standard shape and size in which a material is sold'],
  ['Standard component', 'A ready-made part, made in large numbers to standard sizes, such as a screw or a zip'],
  ['Gauge', 'A measure of thickness, used for sheet metal, wire and polymer film'],
  ['gsm', 'Grams per square metre: the weight of paper, board and fabric'],
  ['Ply', 'A layer. Used for the layers in board and plywood, and the strands twisted into a yarn'],
  ['PAR', 'Planed all round: timber that has been planed smooth on all four faces'],
  ['Moulding', 'A length of timber machined to a decorative or useful cross-section, such as skirting board or dowel'],
  ['KD fitting', 'Knock-down fitting: a joining component that lets furniture be put together and taken apart'],
  ['E12 series', 'The standard set of twelve resistor values in each decade'],
  ['DIL package', 'Dual in line: an integrated circuit with two parallel rows of legs'],
  ['Nesting', 'Arranging shapes close together on a sheet so that as little material as possible is wasted'],
  ['Tessellation', 'Shapes that fit together with no gaps'],
 ] },
]},

{ t: 'Stock forms and sizes', spec: '3.2.6', blocks: [
 { notes: `<table><tr><th>Material</th><th>Stock forms</th><th>Sold by</th><th>Examples</th></tr>
 <tr><td><b>Papers and boards</b></td><td>Sheet, roll, ply</td><td>Size (A-series, such as A3), thickness (microns), weight (gsm), colour</td><td>A3 cartridge paper 135 gsm; 3 mm corrugated card</td></tr>
 <tr><td><b>Timber</b></td><td>Planks, boards, standard mouldings (dowel, beading, skirting)</td><td>Length, width, thickness, diameter</td><td>Pine PAR 2400 × 94 × 18 mm; MDF sheet 2440 × 1220 × 12 mm; 9 mm dowel</td></tr>
 <tr><td><b>Metals</b></td><td>Sheet, rod, bar (flat, square, round, hexagonal), tube (round, square), angle</td><td>Length, width, thickness (or gauge), diameter</td><td>1 mm steel sheet; 6 mm round bar; 25 mm square tube</td></tr>
 <tr><td><b>Polymers</b></td><td>Sheet, rod, powder, granules, foam, films</td><td>Length, width, gauge (thickness), diameter</td><td>3 mm acrylic sheet 600 × 400 mm; polypropylene granules for injection moulding; 3D printer filament</td></tr>
 <tr><td><b>Textiles</b></td><td>Yarns, fabrics</td><td>Roll size, width, weight (gsm), ply</td><td>Cotton poplin 115 gsm on a roll 150 cm wide; 4-ply knitting yarn</td></tr>
 <tr><td><b>Electrical and mechanical components</b></td><td>Individual components</td><td>Quantity, voltage and current rating</td><td>A pack of 100 resistors; a 6 V, 1 A motor</td></tr></table>
 <h4>Useful facts</h4>
 <ul><li><b>A-series paper:</b> each size is half the one before. A4 is 210 × 297 mm; A3 is 297 × 420 mm.</li>
 <li><b>Timber:</b> “rough sawn” is cheaper but needs planing; <b>PAR</b> (planed all round) is ready to use but slightly smaller than its nominal size.</li>
 <li><b>Manufactured boards</b> come in sheets of 2440 × 1220 mm, in thicknesses such as 3, 6, 9, 12 and 18 mm.</li>
 <li><b>Polymers</b> for moulding are bought as <b>granules or powder</b>; for school work as <b>sheet, rod or filament</b>.</li></ul>
 <h4>Why use stock forms?</h4>
 <p>Cheaper (made in bulk); easy to obtain; consistent quality and size; less machining and less waste; they match standard components and tools.</p>` },
 { match: { q: 'Match each material to a stock form it is commonly sold in.', lh: 'Material', rh: 'Stock form', pairs: [['Polypropylene for injection moulding', 'Granules'], ['Mild steel for a frame', 'Square tube'], ['Pine for a shelf', 'Planed plank'], ['Cotton for a shirt', 'Fabric on a roll'], ['Cartridge paper', 'A-size sheets'], ['Acrylic for a laser cutter', 'Flat sheet']] } },
 { tf: [
  ['An A3 sheet is twice the area of an A4 sheet.', true, 'Each A size is half the one before.'],
  ['The weight of paper and fabric is measured in gsm.', true, 'Grams per square metre.'],
  ['Polymers for injection moulding are bought as large flat sheets.', false, 'They are bought as granules or powder.'],
 ] },
]},

{ t: 'Standard components', spec: '3.2.6', blocks: [
 { notes: `<p>A <b>standard component</b> is a part made in huge numbers to agreed sizes. Buying them is cheaper and quicker than making your own, the quality is consistent, and a replacement is easy to find.</p>
 <table><tr><th>Material area</th><th>Standard components</th><th>Notes</th></tr>
 <tr><td><b>Papers and boards</b></td><td>Fasteners, seals, bindings</td><td>Split pins, eyelets, staples, treasury tags; peel-and-seal strips, stickers; comb, spiral and wire binding</td></tr>
 <tr><td><b>Timber</b></td><td>Woodscrews, hinges, KD fittings</td><td>Screws are sold by length and gauge, with countersunk or round heads. Hinges: butt, flush, concealed. KD fittings: cam lock and dowel, corner block, cross dowel and bolt</td></tr>
 <tr><td><b>Metals</b></td><td>Rivets, machine screws, nuts, bolts</td><td>Pop rivets join sheet from one side. Machine screws and bolts have a parallel thread (such as M6 = 6 mm diameter) and take a nut and washer, so the joint can be undone</td></tr>
 <tr><td><b>Polymers</b></td><td>Screws, nuts and bolts, hinges</td><td>Self-tapping screws cut their own thread; nylon nuts and bolts; clip-on and moulded hinges</td></tr>
 <tr><td><b>Textiles</b></td><td>Zips, press studs, velcro</td><td>Also buttons, hooks and eyes, buckles, elastic</td></tr>
 <tr><td><b>Electronics</b></td><td>E12 resistor series, dual in line IC packages (DIL), microcontrollers (PIC)</td><td>See below</td></tr></table>
 <h4>Electronic components</h4>
 <ul><li><b>E12 resistors:</b> resistors are only made in certain values. The E12 series has twelve values in each decade: 10, 12, 15, 18, 22, 27, 33, 39, 47, 56, 68, 82 (then 100, 120, 150… and so on). You choose the nearest value to the one you calculated.</li>
 <li><b>DIL (dual in line) packages:</b> integrated circuits with two rows of legs, usually 8, 14, 16 or 18. They fit a socket or breadboard. A notch or dot shows which is pin 1.</li>
 <li><b>PIC microcontrollers:</b> programmable chips, often in a DIL package, bought ready-made and programmed for the product.</li></ul>
 <p><b>Temporary or permanent?</b> Screws, nuts and bolts, zips and KD fittings are <b>temporary</b>: the product can be taken apart. Rivets and adhesives are <b>permanent</b>.</p>` },
 { sort: { q: 'Which material area does each standard component belong to?', cats: ['Timber', 'Metals', 'Textiles', 'Electronics'], items: [['KD fitting', 0], ['Pop rivet', 1], ['Press stud', 2], ['DIL integrated circuit', 3], ['Woodscrew', 0], ['M6 nut and bolt', 1], ['Zip', 2], ['E12 resistor', 3]] } },
 { mcq: [
  ['A circuit calculation gives a resistor value of 320 Ω. Which E12 value is nearest?', ['270 Ω', '330 Ω', '390 Ω', '470 Ω'], 1, 'The E12 values around it are 270 and 330; 330 is closer.'],
  ['Which is an advantage of using standard components?', ['Each one is unique', 'They are cheap, consistent and easy to replace', 'They must be made in school', 'They cannot be bought in bulk'], 1, 'They are mass produced to standard sizes.'],
  ['Which fitting allows flat-pack furniture to be taken apart again?', ['PVA glue', 'A cam lock KD fitting', 'A nail', 'A pop rivet'], 1, 'KD stands for knock-down.'],
 ] },
]},

{ t: 'Calculating quantities and exam practice', spec: '3.2.6', blocks: [
 { notes: `<h4>Formulas to know</h4>
 <table><tr><th>Shape</th><th>Formula</th></tr>
 <tr><td>Area of a rectangle</td><td>length × width</td></tr>
 <tr><td>Area of a triangle</td><td>½ × base × height</td></tr>
 <tr><td>Area of a circle</td><td>π × radius² (the radius is half the diameter)</td></tr>
 <tr><td>Circumference of a circle</td><td>π × diameter</td></tr>
 <tr><td>Volume of a cuboid</td><td>length × width × height</td></tr>
 <tr><td>Volume of a cylinder</td><td>π × radius² × height</td></tr>
 <tr><td>Surface area of a cuboid</td><td>add up the areas of all six faces</td></tr></table>
 <p><b>Units:</b> keep everything in the same unit. 10 mm = 1 cm; 1000 mm = 1 m; 1 m² = 1 000 000 mm²; 1 cm³ = 1000 mm³.</p>
 <h4>How many parts from a sheet?</h4>
 <p>Divide the sheet length by the part length and <b>round down</b>. Do the same for the width. Multiply the two. (A part-piece is no use, so never round up.) If the question gives a gap or a saw-cut width, add it to each part first.</p>
 <h4>Waste</h4>
 <p><b>Waste = area of the sheet − total area of the parts.</b> As a percentage: waste ÷ sheet area × 100.</p>
 <h4>Nesting and tessellation</h4>
 <p>Arranging shapes so they fit closely (<b>nesting</b>) cuts waste. Shapes that <b>tessellate</b>, such as rectangles, triangles and hexagons, leave no gaps at all. Pattern pieces for garments are nested in a <b>lay plan</b>, keeping the grain line straight. CAD software can nest parts automatically.</p>` },
 { calc: [
  ['A shelf is 900 mm long and 200 mm wide. What is its area in mm²?', 180000, 0, 'mm²', '900 × 200 = 180 000 mm².'],
  ['How many 150 mm × 100 mm rectangles can be cut from a sheet 600 mm × 400 mm, with all the rectangles the same way round? (Ignore the width of the cut.)', 16, 0, '', '600 ÷ 150 = 4 and 400 ÷ 100 = 4. 4 × 4 = 16.'],
  ['A 2400 mm length of timber is cut into pieces 350 mm long. How many whole pieces can be cut? (Ignore the width of the saw cut.)', 6, 0, '', '2400 ÷ 350 = 6.86, so 6 whole pieces (round down). 300 mm is left over.'],
  ['A circular table top has a diameter of 800 mm. What is its area in mm²? Use π = 3.14.', 502400, 300, 'mm²', 'Radius = 400 mm. 3.14 × 400² = 3.14 × 160 000 = 502 400 mm².'],
  ['A block of timber is 200 mm × 50 mm × 40 mm. What is its volume in cm³?', 400, 0, 'cm³', 'In cm: 20 × 5 × 4 = 400 cm³. (Or 400 000 mm³ ÷ 1000.)'],
  ['Parts with a total area of 0.6 m² are cut from a sheet with an area of 0.8 m². What percentage of the sheet is wasted?', 25, 0.01, '%', 'Waste = 0.8 − 0.6 = 0.2 m². 0.2 ÷ 0.8 × 100 = 25%.'],
  ['An open-topped box is 300 mm long, 200 mm wide and 100 mm high. What area of material is needed for the base and four sides, in mm²?', 160000, 0, 'mm²', 'Base 300 × 200 = 60 000. Two long sides 2 × 300 × 100 = 60 000. Two short sides 2 × 200 × 100 = 40 000. Total 160 000 mm².'],
 ] },
 { exam: [
  ['**Name** two stock forms in which metal can be bought.', 2, ['Any two: sheet, rod, bar, tube, angle (1 each)']],
  ['**Explain** what is meant by nesting and why it is used.', 2, ['Arranging the shapes to be cut as close together as possible on the sheet / fabric (1)', 'so that less material is wasted and the cost of each product falls (1)']],
  ['A designer needs 20 acrylic panels, each 250 mm × 150 mm. Acrylic is sold in sheets 1000 mm × 600 mm costing £24.00 each. **Calculate** how many sheets are needed and the total cost.', 4, ['1000 ÷ 250 = 4 and 600 ÷ 150 = 4 (1)', '4 × 4 = 16 panels from one sheet (1)', '20 panels need 2 sheets (1)', '2 × £24.00 = £48.00 (1)']],
  ['**Explain** two advantages to a manufacturer of using standard components such as nuts and bolts.', 4, ['They are bought in bulk from a specialist supplier (1) so they cost less than making them and save production time (1)', 'They are made to standard sizes and quality (1) so they always fit, and a broken one is easily replaced by the customer (1)']],
 ] },
 { nea: 'Your NEA cutting list should give the stock form and size you started with for every part, the standard components you bought in, and a sketch showing how you nested parts to cut waste.' },
]},

]});
