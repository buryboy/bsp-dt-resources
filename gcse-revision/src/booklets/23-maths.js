/* Maths for GCSE Design & Technology (AQA 8552: at least 15% of the paper). Not a numbered topic: shown as a Skills card on Home. */
BOOKLETS.push({ id: 'gmaths', topic: 'Maths', tag: 'Maths', title: 'Maths for Design & Technology', blurb: 'At least 15 of the 100 marks on the paper are maths. Every question here is set in a D&T context.', pages: [

{ t: 'Maths in the exam', blocks: [
 { notes: `<p class="lead"><b>At least 15%</b> of the marks on the paper test maths, and at least 10% test science. That is 15 marks or more: often the difference of a whole grade. The maths is no harder than your Maths GCSE, but it is hidden inside a D&T question.</p>
 <table><tr><th>Page</th><th>Skill</th><th>Typical question</th></tr>
 <tr><td>2</td><td>Number: decimals, rounding, standard form, fractions, percentages, ratio</td><td>Percentage waste; resistor tolerance; scaling a recipe of parts</td></tr>
 <tr><td>3</td><td>Area, surface area and volume</td><td>How much material is needed</td></tr>
 <tr><td>4</td><td>Handling data: tables, charts, averages</td><td>Pie chart angles; reading a survey</td></tr>
 <tr><td>5</td><td>Angles, scale and tessellation</td><td>Scale drawings; how many parts from a sheet</td></tr>
 <tr><td>6</td><td>Maths from real papers</td><td>Hole spacing, hoops, hexagons, levers</td></tr>
 <tr><td>7</td><td>Costs, then mixed exam questions</td><td>Cost of the materials for a batch</td></tr></table>
 <h4>How the marks work</h4>
 <ul><li>There are marks for each <b>step</b>, so <b>show your working</b>. A wrong final answer can still score 2 out of 3.</li>
 <li>If you use your own wrong answer correctly in the next step, you still get that mark.</li>
 <li>Write the <b>units</b>. Check whether the question wants mm, cm or m; mm² or m²; £ or p.</li>
 <li>Round only at the <b>end</b>, and to what the question asks.</li>
 <li>Bring a <b>calculator</b>, a <b>ruler</b> and a <b>protractor</b>.</li></ul>` },
 { tip: '<b>Does my answer make sense?</b> If a chair leg comes out as 4 km long or a T-shirt costs £0.0003, you have a units or decimal-point error. A ten-second sanity check saves marks.' },
]},

{ t: 'Number', blocks: [
 { notes: `<h4>Decimals and rounding</h4>
 <p><b>Decimal places:</b> 12.846 to 1 d.p. is 12.8; to 2 d.p. is 12.85. <b>Significant figures:</b> 12.846 to 2 s.f. is 13; 0.004 37 to 2 s.f. is 0.0044. Look at the next digit: 5 or more rounds up.</p>
 <h4>Standard form</h4>
 <p>A way of writing very large or very small numbers: <b>a × 10<sup>n</sup></b>, where a is between 1 and 10.</p>
 <ul><li>4 500 000 = 4.5 × 10<sup>6</sup> (the point moves 6 places).</li>
 <li>0.000 03 = 3 × 10<sup>−5</sup> (a negative power for a number smaller than 1).</li>
 <li>A nanometre is 1 × 10<sup>−9</sup> m.</li></ul>
 <h4>Fractions, decimals and percentages</h4>
 <p>½ = 0.5 = 50%; ¼ = 0.25 = 25%; ¾ = 0.75 = 75%; ⅕ = 0.2 = 20%; ⅒ = 0.1 = 10%.</p>
 <h4>Percentages</h4>
 <ul><li><b>A percentage of an amount:</b> 15% of 80 = 0.15 × 80 = 12.</li>
 <li><b>One number as a percentage of another:</b> 6 out of 40 = 6 ÷ 40 × 100 = 15%.</li>
 <li><b>Increase or decrease:</b> £20 plus 15% = 20 × 1.15 = £23. £20 less 15% = 20 × 0.85 = £17.</li>
 <li><b>Percentage waste</b> = waste ÷ original amount × 100.</li></ul>
 <h4>Ratio</h4>
 <p>A ratio compares parts. Epoxy mixed 2:1 means 2 parts resin to 1 part hardener: 3 parts altogether. For 60 g of mix, one part is 60 ÷ 3 = 20 g, so 40 g resin and 20 g hardener.</p>` },
 { calc: [
  ['Round 37.846 mm to 1 decimal place.', 37.8, 0.001, 'mm', 'The next digit is 4, so it stays 37.8.'],
  ['A sheet costs £12.40. The supplier adds 20% VAT. What is the total cost, in pounds?', 14.88, 0.001, '£', '12.40 × 1.20 = £14.88.'],
  ['A designer cuts parts with a total area of 1800 cm² from a sheet of 2400 cm². What percentage of the sheet is wasted?', 25, 0.01, '%', 'Waste = 2400 − 1800 = 600 cm². 600 ÷ 2400 × 100 = 25%.'],
  ['In a batch of 250 mouldings, 10 are rejected. What percentage is rejected?', 4, 0.01, '%', '10 ÷ 250 × 100 = 4%.'],
  ['Concrete is mixed with cement, sand and gravel in the ratio 1:2:3. How many kilograms of sand are needed for 30 kg of mix?', 10, 0, 'kg', '1 + 2 + 3 = 6 parts. 30 ÷ 6 = 5 kg per part. Sand = 2 × 5 = 10 kg.'],
  ['A casting resin is mixed 5 parts resin to 1 part hardener. How many grams of hardener are needed for 150 g of resin?', 30, 0, 'g', '150 ÷ 5 = 30 g.'],
  ['A jacket costs £45.00 to make and is sold with a 40% mark-up. What is the selling price, in pounds?', 63, 0.001, '£', '45 × 1.40 = £63.00.'],
 ] },
 { mcq: [
  ['Which is 0.000 25 in standard form?', ['2.5 × 10⁴', '2.5 × 10⁻⁴', '25 × 10⁻⁵', '2.5 × 10⁻³'], 1, 'The point moves four places to the right, so the power is −4. 25 × 10⁻⁵ has the same value but is not standard form, because 25 is not between 1 and 10.'],
  ['Which is 6.2 × 10³ as an ordinary number?', ['62', '620', '6200', '62 000'], 2, 'Move the point three places: 6200.'],
  ['What is ⅗ as a percentage?', ['35%', '53%', '60%', '65%'], 2, '3 ÷ 5 = 0.6 = 60%.'],
 ] },
]},

{ t: 'Area, surface area and volume', blocks: [
 { notes: `<table><tr><th>Shape</th><th>Formula</th></tr>
 <tr><td>Rectangle: area</td><td>length × width</td></tr>
 <tr><td>Triangle: area</td><td>½ × base × height</td></tr>
 <tr><td>Circle: area</td><td>π × r² (r is the radius = half the diameter)</td></tr>
 <tr><td>Circle: circumference</td><td>π × diameter</td></tr>
 <tr><td>Cuboid: volume</td><td>length × width × height</td></tr>
 <tr><td>Cylinder: volume</td><td>π × r² × height</td></tr>
 <tr><td>Cuboid: surface area</td><td>2 × (l × w + l × h + w × h)</td></tr></table>
 <p><b>Compound shapes:</b> split them into rectangles, triangles and circles, work out each, then add. For a shape with a hole, <b>subtract</b> the hole.</p>
 <p><b>Units matter.</b> Convert every length to the same unit <b>before</b> multiplying.</p>
 <ul><li>1 cm = 10 mm, so 1 cm² = 100 mm² and 1 cm³ = 1000 mm³.</li>
 <li>1 m = 1000 mm, so 1 m² = 1 000 000 mm².</li>
 <li>1 litre = 1000 cm³.</li></ul>
 <p>Use the π button, or 3.14 if the question says so.</p>` },
 { calc: [
  ['A table top is 1.2 m long and 0.6 m wide. What is its area in m²?', 0.72, 0.001, 'm²', '1.2 × 0.6 = 0.72 m².'],
  ['A triangular bracket has a base of 120 mm and a height of 80 mm. What is its area in mm²?', 4800, 0, 'mm²', '½ × 120 × 80 = 4800 mm².'],
  ['A circular clock face has a diameter of 300 mm. What is its area in mm²? Use π = 3.14.', 70650, 60, 'mm²', 'Radius = 150 mm. 3.14 × 150² = 3.14 × 22 500 = 70 650 mm².'],
  ['A 200 mm × 150 mm acrylic panel has a circular hole of radius 40 mm cut in it. What area of acrylic is left, in mm²? Use π = 3.14.', 24976, 10, 'mm²', 'Panel = 30 000 mm². Hole = 3.14 × 40² = 5024 mm². 30 000 − 5024 = 24 976 mm².'],
  ['An edging strip is glued round the edge of a circular table 800 mm in diameter. What length of strip is needed, in mm? Use π = 3.14.', 2512, 3, 'mm', 'Circumference = π × d = 3.14 × 800 = 2512 mm.'],
  ['A storage box is 400 mm long, 250 mm wide and 200 mm high. What is its volume in litres?', 20, 0.01, 'litres', 'In cm: 40 × 25 × 20 = 20 000 cm³. ÷ 1000 = 20 litres.'],
  ['A solid steel bar is a cylinder of radius 10 mm and length 500 mm. What is its volume in mm³? Use π = 3.14.', 157000, 150, 'mm³', '3.14 × 10² × 500 = 3.14 × 100 × 500 = 157 000 mm³.'],
  ['A closed box is 300 mm × 200 mm × 100 mm. What is its total outside surface area in mm²?', 220000, 0, 'mm²', '2 × (300 × 200 + 300 × 100 + 200 × 100) = 2 × (60 000 + 30 000 + 20 000) = 220 000 mm².'],
  ['How many mm² are there in 1 cm²?', 100, 0, 'mm²', '10 mm × 10 mm = 100 mm².'],
 ] },
]},

{ t: 'Handling data', blocks: [
 { notes: `<h4>Averages and range</h4>
 <ul><li><b>Mean:</b> add the values and divide by how many there are.</li>
 <li><b>Median:</b> the middle value when they are in order (for an even number, halfway between the middle two).</li>
 <li><b>Mode:</b> the value that occurs most often.</li>
 <li><b>Range:</b> largest − smallest.</li></ul>
 <h4>Charts</h4>
 <ul><li><b>Bar chart:</b> compares categories. Bars the same width, with gaps; label both axes; give a title.</li>
 <li><b>Pie chart:</b> shows shares of a whole. <b>Angle = value ÷ total × 360°.</b> So 1% = 3.6°. Draw the angles with a protractor (you are usually allowed ± 2°) and add a key.</li>
 <li><b>Line graph:</b> shows how something changes, for example sales over time.</li>
 <li><b>Frequency table:</b> lists each answer and how many times it occurred.</li></ul>
 <h4>Reading data</h4>
 <p>Read the title, the axis labels and the scale before you answer. Check whether the question wants a number or a percentage.</p>
 <h4>Percentiles</h4>
 <p>For anthropometric data: the 5th percentile is the value that 5% of people fall below, and the 95th is the value that 95% fall below. The range between them covers 90% of people.</p>` },
 { calc: [
  ['Six people rate a chair for comfort out of 10: 7, 8, 6, 9, 8, 4. What is the mean score?', 7, 0.01, '', '(7 + 8 + 6 + 9 + 8 + 4) ÷ 6 = 42 ÷ 6 = 7.'],
  ['For the same scores (7, 8, 6, 9, 8, 4), what is the range?', 5, 0, '', '9 − 4 = 5.'],
  ['For the same scores, what is the median?', 7.5, 0.01, '', 'In order: 4, 6, 7, 8, 8, 9. The middle two are 7 and 8, so the median is 7.5.'],
  ['In a survey of 120 people, 30 chose wood as their preferred material. What angle represents wood on a pie chart, in degrees?', 90, 0.5, '°', '30 ÷ 120 × 360 = 90°.'],
  ['In a survey, 15% of car buyers chose a hybrid. What angle represents this on a pie chart, in degrees?', 54, 0.5, '°', '15 × 3.6 = 54°.'],
  ['A pie chart sector has an angle of 72°. The survey asked 200 people. How many people does the sector represent?', 40, 0, '', '72 ÷ 360 × 200 = 40.'],
  ['The 5th percentile sitting height for a group is 795 mm and the 95th percentile is 965 mm. What is the adjustment range a headrest needs, in mm?', 170, 0, 'mm', '965 − 795 = 170 mm.'],
 ] },
 { mcq: [
  ['Sales of a product over six months are best shown on a…', ['pie chart', 'line graph', 'tally chart', 'flowchart'], 1, 'A line graph shows change over time.'],
  ['Which average is the most common value?', ['Mean', 'Median', 'Mode', 'Range'], 2, 'Mode: think “most”.'],
 ] },
]},

{ t: 'Angles, scale and tessellation', blocks: [
 { notes: `<h4>Angles</h4>
 <ul><li>Angles on a straight line add up to <b>180°</b>; angles at a point add up to <b>360°</b>.</li>
 <li>Angles in a triangle add up to <b>180°</b>; in a quadrilateral, <b>360°</b>.</li>
 <li>A right angle is 90°. Isometric drawings use 30°. A mitre joint for a square frame is cut at 45°.</li>
 <li>To divide a circle into equal parts: 360° ÷ the number of parts.</li></ul>
 <h4>Scale</h4>
 <p>A scale of <b>1:5</b> means 1 mm on the drawing is 5 mm in real life.</p>
 <ul><li><b>Drawing to real:</b> multiply by the scale. 30 mm at 1:5 is 150 mm.</li>
 <li><b>Real to drawing:</b> divide by the scale. 400 mm at 1:5 is 80 mm.</li>
 <li><b>2:1</b> means the drawing is twice full size.</li></ul>
 <h4>How many from a sheet or a length?</h4>
 <ul><li>Divide and <b>round down</b>: you cannot use a part-piece.</li>
 <li>For a sheet, do the length and the width separately, then multiply.</li>
 <li>Try the part turned through 90° as well: sometimes more will fit.</li>
 <li>Add any <b>saw cut</b> or <b>gap</b> the question mentions.</li></ul>
 <h4>Tessellation</h4>
 <p>Shapes that fit together with no gaps (rectangles, triangles, hexagons) give no waste between them. Circles do not tessellate, so cutting circles always wastes material.</p>
 <h4>Coordinates</h4>
 <p>A point is given as (x, y): x along from the datum, then y up. CNC machines and laser cutters use coordinates to know where to cut.</p>` },
 { calc: [
  ['Two angles of a triangular bracket are 90° and 35°. What is the third angle, in degrees?', 55, 0, '°', '180 − 90 − 35 = 55°.'],
  ['Eight equally spaced holes are drilled on a circle. What is the angle between one hole and the next, in degrees?', 45, 0, '°', '360 ÷ 8 = 45°.'],
  ['A drawing is at a scale of 1:10. A cupboard is 65 mm tall on the drawing. How tall is the real cupboard, in mm?', 650, 0, 'mm', '65 × 10 = 650 mm.'],
  ['A garden bench 1800 mm long is drawn at 1:20. How long is it on the drawing, in mm?', 90, 0, 'mm', '1800 ÷ 20 = 90 mm.'],
  ['Square coasters 95 mm × 95 mm are cut from a sheet 600 mm × 300 mm. How many can be cut? (Ignore the width of the cut.)', 18, 0, '', '600 ÷ 95 = 6.3, so 6. 300 ÷ 95 = 3.2, so 3. 6 × 3 = 18.'],
  ['Rectangles 220 mm × 90 mm are cut from a sheet 600 mm × 450 mm, all the same way round with the 220 mm side along the 600 mm edge. How many can be cut?', 10, 0, '', '600 ÷ 220 = 2.7, so 2. 450 ÷ 90 = 5. 2 × 5 = 10.'],
  ['Now the same 220 mm × 90 mm rectangles are turned so the 90 mm side runs along the 600 mm edge. How many can be cut?', 12, 0, '', '600 ÷ 90 = 6.7, so 6. 450 ÷ 220 = 2.05, so 2. 6 × 2 = 12: two more than before.'],
  ['Shelves 450 mm long are cut from a 2400 mm plank. Each saw cut removes 3 mm. How many whole shelves can be cut?', 5, 0, '', 'Five shelves need 5 × 450 = 2250 mm plus 4 cuts × 3 mm = 12 mm: 2262 mm, which fits. Six would need 2700 mm.'],
 ] },
]},

{ t: 'Maths from real papers', blocks: [
 { notes: `<p class="lead">These are the kinds of maths that have appeared in recent papers and in AQA's guide to maths in D&T. Each is ordinary maths wrapped in a design problem.</p>
 <h4>Levers and movement</h4>
 <p>The two ends of a lever move in proportion to their distances from the pivot. If end A is 10 mm from the pivot and end B is 40 mm from it, B moves <b>four times</b> as far as A, in the opposite direction.</p>
 <h4>Equally spaced holes</h4>
 <p>If a strip has 7 holes equally spaced from each other <b>and from each end</b>, there are 7 + 1 = <b>8 equal gaps</b>. Spacing = length ÷ 8. The gap between the edges of two holes = spacing − one diameter. The centre line of a strip is half its width from either edge.</p>
 <h4>Circles, arcs and hoops</h4>
 <p>Circumference = π × diameter (or 2πr). A semicircular hoop is <b>half</b> a circumference; a quarter bend is a quarter. Add any straight sections. Watch the rounding instruction: “to the nearest whole millimetre”.</p>
 <h4>Angles in shapes</h4>
 <ul><li>Interior angles of a polygon add up to (number of sides − 2) × 180°.</li>
 <li>A <b>regular hexagon</b>: 720° ÷ 6 = <b>120°</b> at each corner. It is made of six equilateral triangles, so the distance across opposite corners is <b>twice the side length</b>.</li>
 <li>Square: 90°. Equilateral triangle: 60°. Regular octagon: 135°.</li></ul>
 <h4>Sharing in a ratio</h4>
 <p>Solar to other renewables in the ratio 1:10 means 11 parts altogether. Solar = total ÷ 11.</p>
 <h4>Pythagoras and trigonometry</h4>
 <p>For a right-angled triangle: <b>a² + b² = c²</b>, where c is the longest side (the hypotenuse). Use it to find the length of a diagonal brace or a sloping edge. <b>sin = opposite ÷ hypotenuse; cos = adjacent ÷ hypotenuse; tan = opposite ÷ adjacent</b> (SOH CAH TOA) links a side to an angle.</p>
 <h4>Efficiency</h4>
 <p>Efficiency = useful output ÷ total input × 100%.</p>
 <h4>Charts</h4>
 <p>A <b>bar chart</b> is for separate categories (favourite colour). A <b>histogram</b> is for continuous measurements grouped into ranges (hand widths of 70–75 mm, 75–80 mm…), with no gaps between the bars.</p>
 <h4>Units</h4>
 <p>10 mm = 1 cm; 100 cm = 1 m; 1000 mm = 1 m. Some materials are still sold in <b>imperial</b> sizes: 1 inch = 25.4 mm, and a “2 by 4” timber is roughly 50 × 100 mm.</p>` },
 { calc: [
  ['A lever in a toy pivots at one point. End A is 15 mm from the pivot and end B is 60 mm from the pivot. End A moves 8 mm. How far does end B move, in mm?', 32, 0, 'mm', '60 ÷ 15 = 4, so B moves 4 times as far: 8 × 4 = 32 mm.'],
  ['A strip 180 mm long has 5 holes, equally spaced from each other and from each end. What is the distance between the centres of neighbouring holes, in mm?', 30, 0, 'mm', '5 holes give 6 equal gaps. 180 ÷ 6 = 30 mm.'],
  ['The holes in that strip are 8 mm in diameter. What is the shortest distance between the edges of two neighbouring holes, in mm?', 22, 0, 'mm', 'Centre to centre is 30 mm. Take off half a diameter at each end: 30 − 8 = 22 mm.'],
  ['A hoop is a semicircle with a diameter of 300 mm. What length of rod is needed to make it, to the nearest whole millimetre? Use the π button.', 471, 0.6, 'mm', 'Full circumference = π × 300 = 942.48 mm. Half = 471.24, so 471 mm.'],
  ['A plant support is made from three straight legs, each 400 mm long, and one full circular hoop of diameter 200 mm. What total length of rod is needed, to the nearest whole centimetre?', 183, 0.6, 'cm', 'Legs: 3 × 400 = 1200 mm. Hoop: π × 200 = 628.3 mm. Total 1828.3 mm = 182.8 cm, so 183 cm.'],
  ['What is the size of each interior angle of a regular hexagon, in degrees?', 120, 0, '°', '(6 − 2) × 180 = 720°. 720 ÷ 6 = 120°.'],
  ['A regular hexagonal template measures 90 mm between two opposite corners. What is the length of one side, in mm?', 45, 0, 'mm', 'A regular hexagon is six equilateral triangles, so corner to corner is twice the side: 90 ÷ 2 = 45 mm.'],
  ['A country generated 88 TWh of renewable energy. The ratio of solar to all other renewable sources was 1:10. How much was solar, in TWh?', 8, 0.01, 'TWh', '1 + 10 = 11 parts. 88 ÷ 11 = 8 TWh.'],
  ['A survey asked 240 children about colour schemes. 102 chose primary colours. What percentage is this?', 42.5, 0.01, '%', '102 ÷ 240 × 100 = 42.5%.'],
  ['A rectangular frame is 300 mm wide and 400 mm high. What length of diagonal brace is needed, corner to corner, in mm?', 500, 0, 'mm', '300² + 400² = 90 000 + 160 000 = 250 000. √250 000 = 500 mm.'],
  ['A motor takes in 50 J of electrical energy and gives out 40 J of useful movement energy. What is its efficiency, as a percentage?', 80, 0.01, '%', '40 ÷ 50 × 100 = 80%.'],
  ['A piece of material is 60 mm × 40 mm. Six right-angled triangles, each with a base of 18 mm and a height of 18 mm, are cut from it. What area is wasted, in mm²?', 1428, 0, 'mm²', 'Sheet = 60 × 40 = 2400 mm². One triangle = ½ × 18 × 18 = 162 mm². Six = 972 mm². Waste = 2400 − 972 = 1428 mm².'],
  ['A coat needs four buttons and one spare. Buttons cost 14p each. What is the cost of buttons for 1200 coats, in pounds?', 840, 0.001, '£', '5 buttons × 14p = 70p per coat. 0.70 × 1200 = £840.00.'],
 ] },
]},

{ t: 'Costs and mixed exam questions', blocks: [
 { notes: `<h4>Costing</h4>
 <ul><li><b>Cost of part of a sheet or length:</b> fraction used × price. Or work out the price per unit (per metre, per m², per part) first.</li>
 <li><b>Material cost of one product:</b> add the cost of each material and component.</li>
 <li><b>Batch cost:</b> cost of one × number made.</li>
 <li><b>Whole sheets:</b> you cannot buy part of a sheet, so <b>round up</b> the number of sheets.</li>
 <li><b>Profit</b> = selling price − total cost.</li></ul>
 <p>Give money answers to <b>2 decimal places</b>: £4.50, not £4.5.</p>` },
 { calc: [
  ['A coat has 6 buttons costing £0.35 each. What is the cost of the buttons for 1500 coats, in pounds?', 3150, 0.01, '£', '6 × 0.35 = £2.10 per coat. 2.10 × 1500 = £3150.00.'],
  ['MDF costs £18.00 for a 2440 mm × 1220 mm sheet. A product uses one quarter of a sheet. What is the cost of the MDF for one product, in pounds?', 4.5, 0.001, '£', '18.00 ÷ 4 = £4.50.'],
  ['Each product needs 0.4 m of aluminium tube. The tube is sold in 3 m lengths at £7.50 each. How many lengths must be bought to make 20 products?', 3, 0, '', '20 × 0.4 = 8 m. 8 ÷ 3 = 2.67, so 3 lengths (round up).'],
  ['Using the answer above, what is the total cost of the tube, in pounds?', 22.5, 0.001, '£', '3 × 7.50 = £22.50.'],
  ['A product costs £6.20 in materials and £3.80 in labour, and sells for £15.00. What is the profit on each one, in pounds?', 5, 0.001, '£', '15.00 − (6.20 + 3.80) = 15.00 − 10.00 = £5.00.'],
  ['Fabric costs £8.00 per metre. A bag needs 0.75 m of fabric, a zip at £1.20 and thread costing £0.30. What is the material cost of one bag, in pounds?', 7.5, 0.001, '£', '0.75 × 8.00 = £6.00. 6.00 + 1.20 + 0.30 = £7.50.'],
 ] },
 { exam: [
  ['A sheet of plywood is 1200 mm × 600 mm. A student cuts four panels from it, each 500 mm × 250 mm. **Calculate** the percentage of the sheet that is wasted. Give your answer to 1 decimal place.', 4, ['Sheet area = 1200 × 600 = 720 000 mm² (1)', 'Panels = 4 × 500 × 250 = 500 000 mm² (1)', 'Waste = 720 000 − 500 000 = 220 000 mm² (1)', '220 000 ÷ 720 000 × 100 = 30.6% (1)']],
  ['A survey of 80 students asked which colour they preferred for a product: red 20, blue 36, green 16, yellow 8. **Calculate** the angle of each sector for a pie chart.', 4, ['Method: 360 ÷ 80 = 4.5° per student, or value ÷ 80 × 360 (1)', 'Red = 90° (1)', 'Blue = 162° (1)', 'Green = 72° and yellow = 36° (1)']],
  ['A hole is specified as 25 mm ± 0.5 mm in diameter. **State** the minimum and maximum acceptable diameters of the hole.', 1, ['Minimum 24.5 mm and maximum 25.5 mm (1) (both needed)']],
  ['A cylindrical candle mould has an internal diameter of 60 mm and a height of 100 mm. **Calculate** the volume of wax needed to fill it, in cm³. Use π = 3.14.', 3, ['Radius = 3 cm and height = 10 cm (or 30 mm and 100 mm) (1)', 'Volume = 3.14 × 3² × 10 (1)', '= 282.6 cm³ (1)']],
  ['A company makes 400 wooden toys. Each uses 0.02 m² of beech at £45.00 per m², four wheels at £0.12 each and paint costing £0.25. **Calculate** the total material cost of the batch.', 4, ['Beech: 0.02 × 45.00 = £0.90 (1)', 'Wheels: 4 × 0.12 = £0.48 (1)', 'One toy: 0.90 + 0.48 + 0.25 = £1.63 (1)', 'Batch: 1.63 × 400 = £652.00 (1)']],
 ] },
]},

]});
