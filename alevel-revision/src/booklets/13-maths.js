/* Maths for Product Design (Edexcel 9DT0 Appendix 1: mathematical skills a–g). Not a numbered topic: shown as a Skills card on Home. */
BOOKLETS.push({ id: 'maths', topic: 'Maths', tag: 'Maths', title: 'Maths for Product Design', blurb: 'The calculation skills in Appendix 1 of the specification: around 15 marks on the paper.', pages: [

{ t: 'Maths in the exam', blocks: [
 { notes: `<p class="lead">The Paper 1 exam includes calculation questions at <b>higher-tier GCSE Maths</b> level, set in design contexts. In the sample paper they are worth about 16 of the 120 marks, including one 8-mark calculation. You <b>must</b> take a calculator and a ruler.</p>
 <table><tr><th>Page</th><th>Skill (specification Appendix 1)</th><th>Used for</th></tr>
 <tr><td>2</td><td>a. Number and percentages</td><td>Quantities of materials, costs, waste, profit</td></tr>
 <tr><td>3</td><td>a, g. Percentiles and statistics</td><td>Anthropometric data, user needs</td></tr>
 <tr><td>4</td><td>b. Ratios</td><td>Scale drawings, mixes, gears</td></tr>
 <tr><td>5</td><td>c. Surface area and volume</td><td>Quantities of material, mass, waste</td></tr>
 <tr><td>6</td><td>d. Trigonometry</td><td>Sides and angles in products and jigs</td></tr>
 <tr><td>7</td><td>e. Graphs and charts</td><td>Presenting and reading market and test data</td></tr>
 <tr><td>8</td><td>f. Coordinates and geometry</td><td>Datum points, setting out, CNC</td></tr>
 <tr><td>9</td><td>g. Probability</td><td>Likelihood of faults, estimating demand</td></tr>
 <tr><td>10</td><td>All</td><td>Exam-style multi-step questions</td></tr></table>
 <h4>How to pick up every mark</h4>
 <ol><li><b>Show all your working.</b> Most of the marks are for the method: you can score 6 or 7 out of 8 with a wrong final answer.</li>
 <li>Write the <b>formula</b>, then substitute the numbers, then calculate.</li>
 <li>Keep units the same: change everything to mm (or everything to m) <b>before</b> you start.</li>
 <li>Do not round until the end; keep the full value in your calculator.</li>
 <li>Give the answer to the accuracy asked for (1 decimal place, 2 significant figures, nearest whole number) and include the <b>units</b>.</li>
 <li>Check: is the answer sensible?</li></ol>
 <h4>Formulas to know (none are given in the paper)</h4>
 <table><tr><th>Quantity</th><th>Formula</th></tr>
 <tr><td>Percentage of an amount</td><td>(part ÷ whole) × 100</td></tr>
 <tr><td>Percentage change</td><td>(change ÷ original) × 100</td></tr>
 <tr><td>Area of rectangle / triangle / circle</td><td>l × w &nbsp;/&nbsp; ½ × b × h &nbsp;/&nbsp; π r²</td></tr>
 <tr><td>Circumference of a circle</td><td>π d &nbsp;(or 2 π r)</td></tr>
 <tr><td>Volume of cuboid / cylinder / any prism</td><td>l × w × h &nbsp;/&nbsp; π r² h &nbsp;/&nbsp; area of cross-section × length</td></tr>
 <tr><td>Density</td><td>mass ÷ volume &nbsp;(so mass = density × volume)</td></tr>
 <tr><td>Pythagoras</td><td>a² + b² = c² &nbsp;(c is the hypotenuse)</td></tr>
 <tr><td>Trigonometry</td><td>sin = opp ÷ hyp · cos = adj ÷ hyp · tan = opp ÷ adj &nbsp;(SOH CAH TOA)</td></tr>
 <tr><td>Mean</td><td>total of the values ÷ number of values</td></tr>
 <tr><td>Probability</td><td>number of ways it can happen ÷ total number of outcomes</td></tr></table>
 <p>Unit facts: 1 m = 1000 mm · 1 m² = 1,000,000 mm² · 1 cm³ = 1000 mm³ · 1 litre = 1000 cm³.</p>` },
 { tip: 'Each question on the following pages checks your final answer and then shows the full working. Work it out on paper first, exactly as you would in the exam. Make sure your calculator is in <b>degrees</b> (D or DEG), not radians.' },
]},

{ t: 'Number and percentages', spec: 'a', blocks: [
 { notes: `<h4>Percentage of an amount</h4><p>15% of 240 = 240 × 0.15 = 36.</p>
 <h4>One quantity as a percentage of another</h4><p>18 rejects out of 400 = 18 ÷ 400 × 100 = 4.5%.</p>
 <h4>Percentage increase and decrease: use a multiplier</h4><p>Increase by 8%: × 1.08. Decrease by 15%: × 0.85. Add 20% VAT: × 1.2.</p>
 <h4>Reverse percentages</h4><p>A price <i>including</i> 20% VAT is €54. The original is 54 ÷ 1.2 = €45. (Do not take 20% off €54.)</p>
 <h4>Percentage change</h4><p>(new − old) ÷ old × 100.</p>
 <h4>Percentage waste</h4><p>waste ÷ original × 100, where waste = original − amount used. This is the calculation in the 8-mark sample question.</p>
 <h4>Costing</h4><p>Add up materials, components and labour for one product, add its share of overheads, then add profit with a multiplier.</p>` },
 { calc: [
  ['A product costs €12.50 to make and sells for €20.00. What is the profit as a percentage of the cost?', 60, 0.01, '%', 'Profit = 20.00 − 12.50 = 7.50. 7.50 ÷ 12.50 × 100 = 60%.'],
  ['A sheet of acrylic costs €45. The supplier raises the price by 8%. What is the new price?', 48.6, 0.005, '€', '45 × 1.08 = €48.60.'],
  ['A frame needs 7 pieces of timber, each 450 mm long. Allow 10% extra for waste. The timber costs €6.80 per metre. What is the cost of the timber, to the nearest cent?', 23.56, 0.006, '€', '7 × 450 = 3150 mm = 3.15 m. With waste: 3.15 × 1.1 = 3.465 m. 3.465 × 6.80 = €23.56.'],
  ['A block of 480,000 mm³ is machined to leave a part of 312,000 mm³. What percentage of the block is removed as waste?', 35, 0.01, '%', 'Removed = 480,000 − 312,000 = 168,000 mm³. 168,000 ÷ 480,000 × 100 = 35%.'],
  ['A cordless drill costs €54 including 20% VAT. What is the price before VAT?', 45, 0.005, '€', '54 ÷ 1.2 = €45.'],
  ['In a batch of 1,250 mouldings, 4% are rejected. How many good mouldings are there?', 1200, 0, 'mouldings', '1,250 × 0.96 = 1,200 (or 4% of 1,250 = 50 rejected; 1,250 − 50 = 1,200).'],
  ['Sales rise from 3,200 units to 3,680 units. What is the percentage increase?', 15, 0.01, '%', '(3,680 − 3,200) ÷ 3,200 × 100 = 480 ÷ 3,200 × 100 = 15%.'],
 ] },
]},

{ t: 'Percentiles and statistics', spec: 'a, g', blocks: [
 { notes: `<h4>Averages and spread</h4>
 <ul><li><b>Mean</b> = total ÷ number of values.</li>
 <li><b>Median</b> = the middle value when they are put in order.</li>
 <li><b>Mode</b> = the most common value.</li>
 <li><b>Range</b> = largest − smallest.</li></ul>
 <h4>Percentiles</h4>
 <p>The <b>n</b>th percentile is the value below which <b>n%</b> of the sample falls. Designers usually design for the <b>5th to 95th percentile</b>: the middle <b>90%</b>.</p>
 <p>To find a percentile from a frequency table: work out which person it is (5% of 200 people = the 10th person), then add up the frequencies (a <b>cumulative frequency</b>) until you reach that person.</p>
 <h4>Data for the questions below: hand-grip sizes of 200 people</h4>
 <table><tr><th>Grip size (mm)</th><td>40</td><td>42</td><td>44</td><td>46</td><td>48</td><td>50</td><td>52</td><td>54</td><td>56</td></tr>
 <tr><th>Number of people</th><td>6</td><td>10</td><td>24</td><td>40</td><td>50</td><td>36</td><td>20</td><td>10</td><td>4</td></tr>
 <tr><th>Cumulative total</th><td>6</td><td>16</td><td>40</td><td>80</td><td>130</td><td>166</td><td>186</td><td>196</td><td>200</td></tr></table>` },
 { calc: [
  ['Seven students’ hand lengths are 172, 180, 165, 190, 178, 185 and 176 mm. What is the mean?', 178, 0.01, 'mm', 'Total = 1246. 1246 ÷ 7 = 178 mm.'],
  ['For the same seven hand lengths, what is the median?', 178, 0, 'mm', 'In order: 165, 172, 176, 178, 180, 185, 190. The middle (4th) value is 178 mm.'],
  ['For the same seven hand lengths, what is the range?', 25, 0, 'mm', '190 − 165 = 25 mm.'],
  ['Using the grip-size table: a handle is designed to suit 90% of the sample. How many of the 200 people is that?', 180, 0, 'people', '200 × 0.90 = 180 people.'],
  ['Using the table: what grip size is the 5th percentile?', 42, 0, 'mm', '5% of 200 = the 10th person. Cumulative totals: 6 people up to 40 mm, 16 up to 42 mm. The 10th person is in the 42 mm group.'],
  ['Using the table: what grip size is the 95th percentile?', 54, 0, 'mm', '95% of 200 = the 190th person. Cumulative totals: 186 up to 52 mm, 196 up to 54 mm. The 190th person is in the 54 mm group.'],
  ['Using the table: what is the modal grip size?', 48, 0, 'mm', 'The group with the most people (50) is 48 mm.'],
 ] },
 { mcq: [
  ['A designer sets the height of a doorway. Which percentile of stature should be used?', ['5th', '50th', '95th', 'The mean'], 2, 'Clearance: if the tallest users fit, so does nearly everyone else.'],
  ['A designer sets the height of a control that must be reached. Which percentile of reach should be used?', ['5th', '50th', '95th', '100th'], 0, 'Reach: if the smallest users can reach it, so can everyone else.'],
  ['Why is the 50th percentile (the average) often a poor choice for a clearance dimension?', ['It is hard to calculate', 'About half of users would be too large to fit', 'It is always the same as the mode', 'It only applies to children'], 1, 'Designing for the average excludes many people.'],
 ] },
]},

{ t: 'Ratios and scale', spec: 'b', blocks: [
 { notes: `<h4>Scale drawings</h4>
 <p>A scale of <b>1 : 5</b> means 1 mm on the drawing represents 5 mm in real life (the drawing is smaller). A scale of <b>2 : 1</b> means the drawing is twice full size.</p>
 <ul><li>Real size → drawing size: <b>divide</b> by the scale factor (1 : 5 → ÷ 5).</li>
 <li>Drawing size → real size: <b>multiply</b> by the scale factor.</li></ul>
 <p>The sample paper asks for an <b>isometric drawing to a scale of 1 : 10</b> on a grid: convert every dimension first, then draw.</p>
 <h4>Sharing in a ratio</h4>
 <p>Epoxy mixed 5 : 1 (resin : hardener) has 5 + 1 = 6 parts. For 180 g in total, one part = 180 ÷ 6 = 30 g, so resin = 150 g and hardener = 30 g.</p>
 <h4>Gear and pulley ratios</h4>
 <p>Gear ratio = teeth on <b>driven</b> gear ÷ teeth on <b>driver</b> gear. Output speed = input speed ÷ gear ratio.</p>
 <h4>Enlarging and reducing</h4><p>An enlargement of 250% multiplies every length by 2.5. Areas are multiplied by the scale factor <b>squared</b>, and volumes by the scale factor <b>cubed</b>.</p>` },
 { calc: [
  ['A table is 850 mm high. How high is it on a 1 : 5 scale drawing?', 170, 0, 'mm', '850 ÷ 5 = 170 mm.'],
  ['A wall measures 62 mm on a 1 : 20 drawing. What is its real length?', 1240, 0, 'mm', '62 × 20 = 1240 mm.'],
  ['A 1 : 10 scale model is made of a chair with a seat height of 450 mm. What is the seat height of the model?', 45, 0, 'mm', '450 ÷ 10 = 45 mm.'],
  ['Epoxy resin is mixed 5 : 1 by mass (resin : hardener). How much resin is needed to make 180 g of mixed epoxy?', 150, 0, 'g', '6 parts in total. 180 ÷ 6 = 30 g per part. Resin = 5 × 30 = 150 g.'],
  ['A driver gear with 20 teeth turns a driven gear with 60 teeth. The driver turns at 240 rpm. What is the speed of the driven gear?', 80, 0, 'rpm', 'Gear ratio = 60 ÷ 20 = 3. Output speed = 240 ÷ 3 = 80 rpm.'],
  ['A logo 36 mm wide is enlarged to 250%. How wide is it now?', 90, 0, 'mm', '36 × 2.5 = 90 mm.'],
  ['A model is made at a scale of 1 : 2. By what number is the volume of material divided compared with the full-size product?', 8, 0, '', 'Volume scales with the cube of the scale factor: 2³ = 8, so the model uses one eighth of the material.'],
 ] },
 { exam: [
  ['A box is 800 mm long, 500 mm wide and 300 mm high. **Draw** an accurate isometric view of the box to a scale of 1 : 10 on isometric grid paper.', 4, ['Dimensions converted correctly: 80 mm × 50 mm × 30 mm (1)', 'Vertical edges drawn vertical; length and width drawn along the 30° grid lines (1)', 'All three visible faces complete, with parallel edges equal in length (1)', 'Accurate to within about 1 mm and neatly drawn; no hidden detail needed (1)'], 'sketch'],
 ] },
]},

{ t: 'Surface area and volume', spec: 'c', blocks: [
 { notes: `<h4>Area</h4>
 <ul><li>Rectangle: l × w &nbsp;·&nbsp; Triangle: ½ × base × height &nbsp;·&nbsp; Circle: π r² (remember r = d ÷ 2).</li>
 <li><b>Compound shapes:</b> split into simple shapes and add, or take the whole and subtract the cut-outs.</li></ul>
 <h4>Surface area</h4><p>Add the areas of all the faces. A closed box has 6 faces in 3 equal pairs: 2(lw + lh + wh). An open-topped box has only 5.</p>
 <h4>Volume</h4>
 <ul><li>Cuboid: l × w × h &nbsp;·&nbsp; Cylinder: π r² h.</li>
 <li><b>Any prism</b> (a constant cross-section, like an extrusion): area of the cross-section × length.</li>
 <li><b>Material removed:</b> a hole is a cylinder; a slot is a cuboid. Subtract them from the block.</li></ul>
 <h4>Mass</h4><p>mass = density × volume. Make the units match: if the density is in g/cm³, the volume must be in cm³ (divide mm³ by 1000).</p>
 <h4>Percentage waste</h4><p>(volume or area removed ÷ original) × 100.</p>` },
 { calc: [
  ['A table top is 1.2 m long and 0.75 m wide. What is its area?', 0.9, 0.001, 'm²', '1.2 × 0.75 = 0.9 m².'],
  ['A triangular gusset has a base of 240 mm and a height of 150 mm. What is its area?', 18000, 0, 'mm²', '½ × 240 × 150 = 18,000 mm².'],
  ['A disc has a diameter of 300 mm. What is its area, to the nearest mm²?', 70686, 5, 'mm²', 'r = 150. π × 150² = 70,686 mm².'],
  ['A closed box measures 300 mm × 200 mm × 100 mm. What is its total surface area?', 220000, 0, 'mm²', '2 × (300×200 + 300×100 + 200×100) = 2 × 110,000 = 220,000 mm².'],
  ['A cylinder has a diameter of 80 mm and a height of 150 mm. What is its volume in cm³, to 1 decimal place?', 754, 0.1, 'cm³', 'r = 40 mm. π × 40² × 150 = 753,982 mm³ = 754.0 cm³.'],
  ['An aluminium block measures 100 mm × 50 mm × 20 mm. The density of aluminium is 2.7 g/cm³. What is its mass?', 270, 0.01, 'g', 'Volume = 100,000 mm³ = 100 cm³. Mass = 2.7 × 100 = 270 g.'],
  ['A disc of diameter 100 mm is cut from a 100 mm × 100 mm square of sheet. What percentage of the square is wasted, to 1 decimal place?', 21.5, 0.05, '%', 'Square = 10,000 mm². Disc = π × 50² = 7,854 mm². Waste = 2,146 mm². 2,146 ÷ 10,000 × 100 = 21.5%.'],
  ['An aluminium extrusion has a cross-sectional area of 320 mm² and is 2.5 m long. What is its volume in cm³?', 800, 0.01, 'cm³', '2.5 m = 2500 mm. 320 × 2500 = 800,000 mm³ = 800 cm³.'],
 ] },
]},

{ t: 'Trigonometry', spec: 'd', blocks: [
 { notes: `<h4>Pythagoras: right-angled triangle, two sides known, find the third</h4>
 <p>a² + b² = c², where c is the <b>hypotenuse</b> (the longest side, opposite the right angle). To find a shorter side: a² = c² − b².</p>
 <h4>Trigonometry: right-angled triangle with an angle involved</h4>
 <ol><li>Label the sides from the angle: <b>opposite</b> (facing the angle), <b>adjacent</b> (next to it), <b>hypotenuse</b>.</li>
 <li>Choose the ratio that uses the two sides in the question: <b>SOH CAH TOA</b>.<br>sin θ = opp ÷ hyp &nbsp;·&nbsp; cos θ = adj ÷ hyp &nbsp;·&nbsp; tan θ = opp ÷ adj</li>
 <li>To find a <b>side</b>: rearrange and calculate, e.g. opp = hyp × sin θ; hyp = adj ÷ cos θ.</li>
 <li>To find an <b>angle</b>: use the inverse function, e.g. θ = tan⁻¹(opp ÷ adj).</li></ol>
 <p>Typical contexts: the angle of a jig or ramp, the length of a splayed leg or a diagonal brace, the height reached by an adjustable arm.</p>
 <p><b>Significant figures:</b> 17.354° to 2 significant figures is 17°.</p>` },
 { calc: [
  ['A rectangular frame is 600 mm wide and 800 mm high. What length of diagonal brace is needed?', 1000, 0.5, 'mm', '√(600² + 800²) = √1,000,000 = 1000 mm.'],
  ['A ramp rises 250 mm over a horizontal distance of 800 mm. What angle does it make with the ground, to 2 significant figures?', 17, 0.5, '°', 'tan θ = 250 ÷ 800. θ = tan⁻¹(0.3125) = 17.35° = 17° (2 s.f.).'],
  ['A table leg is splayed at 12° from the vertical. The table top is 450 mm above the floor. How long is the leg, to the nearest mm?', 460, 0.6, 'mm', 'The vertical height is adjacent to the 12° angle; the leg is the hypotenuse. hyp = 450 ÷ cos 12° = 460 mm.'],
  ['A 300 mm strut is fixed at 35° to the horizontal. What vertical height does it reach, to the nearest mm?', 172, 0.6, 'mm', 'opp = hyp × sin θ = 300 × sin 35° = 172 mm.'],
  ['A lamp arm 400 mm long is set at 40° above the horizontal. What is its horizontal reach, to the nearest mm?', 306, 0.6, 'mm', 'adj = hyp × cos θ = 400 × cos 40° = 306 mm.'],
  ['A shelf support is 260 mm long and its top is 120 mm above its base. What angle does it make with the horizontal, to 1 decimal place?', 27.5, 0.06, '°', 'sin θ = 120 ÷ 260. θ = sin⁻¹(0.4615) = 27.5°.'],
  ['A ladder-style bookcase leans against a wall. Its foot is 550 mm from the wall and it is 1950 mm long. How high up the wall does it reach, to the nearest mm?', 1871, 0.6, 'mm', '√(1950² − 550²) = √3,500,000 = 1871 mm.'],
 ] },
]},

{ t: 'Graphs and charts', spec: 'e', blocks: [
 { notes: `<h4>Choosing the right chart</h4>
 <table><tr><th>Chart</th><th>Best for</th></tr>
 <tr><td><b>Bar chart</b></td><td>Comparing separate categories: favourite colours, sales by product</td></tr>
 <tr><td><b>Pie chart</b></td><td>Showing the share of a whole: market share, survey responses as proportions</td></tr>
 <tr><td><b>Line graph</b></td><td>Change over time: monthly sales, temperature during a test</td></tr>
 <tr><td><b>Histogram / frequency chart</b></td><td>The distribution of measured data: hand sizes, weights</td></tr>
 <tr><td><b>Scatter graph</b></td><td>Whether two variables are related: price against sales</td></tr></table>
 <h4>Pie charts</h4><p>Angle = (frequency ÷ total) × 360°.</p>
 <h4>Line graphs</h4>
 <ul><li><b>Gradient</b> = change in vertical ÷ change in horizontal. On a cost graph, the gradient is the variable cost per unit.</li>
 <li>The point where a line crosses the vertical axis is the value at zero, e.g. the fixed costs.</li>
 <li>On a break-even chart, the break-even point is where the <b>revenue</b> line crosses the <b>total cost</b> line.</li></ul>
 <h4>Reading charts in the exam</h4><p>Read the title, the axis labels and the <b>scale</b> carefully; quote values from the chart in your answer and include units.</p>` },
 { match: { q: 'Which chart would you choose?', lh: 'Data', rh: 'Chart', pairs: [['Share of a market held by five brands', 'Pie chart'], ['Monthly sales of a product over two years', 'Line graph'], ['Number of people with each hand span in a sample', 'Histogram or frequency chart'], ['Whether a higher price reduces the number sold', 'Scatter graph'], ['Number of votes for each of four colourways', 'Bar chart']] } },
 { calc: [
  ['In a survey of 120 people, 45 prefer the blue colourway. What angle represents them on a pie chart?', 135, 0, '°', '45 ÷ 120 × 360 = 135°.'],
  ['Sales were 200 in January, 260 in February, 340 in March and 300 in April. What is the mean monthly sales figure?', 275, 0, 'units', '(200 + 260 + 340 + 300) ÷ 4 = 1100 ÷ 4 = 275.'],
  ['Using those figures, what is the percentage increase in sales from January to March?', 70, 0.01, '%', '(340 − 200) ÷ 200 × 100 = 70%.'],
  ['A total-cost line on a graph passes through (0 units, €4,000) and (500 units, €9,000). What is the variable cost per unit?', 10, 0.001, '€', 'Gradient = (9,000 − 4,000) ÷ (500 − 0) = 5,000 ÷ 500 = €10 per unit. The fixed cost is €4,000.'],
  ['Using that cost line, and a selling price of €18 per unit, how many units must be sold to break even?', 500, 0, 'units', 'Break-even = fixed costs ÷ (price − variable cost) = 4,000 ÷ (18 − 10) = 500 units.'],
  ['A pie chart sector for “would buy” is 252°. If 150 people were surveyed, how many said they would buy?', 105, 0, 'people', '252 ÷ 360 × 150 = 105 people.'],
 ] },
]},

{ t: 'Coordinates and geometry', spec: 'f', blocks: [
 { notes: `<h4>Datum points and coordinates</h4>
 <ul><li>A <b>datum</b> is the fixed point, edge or face that all measurements are taken from. Measuring every feature from one datum avoids errors adding up.</li>
 <li>Positions are given as <b>coordinates (x, y)</b>, or (x, y, z) in three dimensions. CNC machines and CAD drawings work this way.</li>
 <li><b>Absolute</b> coordinates are measured from the datum. <b>Incremental</b> coordinates are measured from the last position.</li>
 <li>Distance between two points: use Pythagoras on the difference in x and the difference in y.</li>
 <li>Midpoint: the mean of the x values and the mean of the y values.</li></ul>
 <h4>Geometry facts</h4>
 <ul><li>Angles in a triangle add up to 180°; in a quadrilateral, 360°.</li>
 <li>Exterior angle of a regular polygon = 360° ÷ number of sides. Interior angle = 180° − exterior.</li>
 <li>Holes equally spaced round a circle (a pitch circle): angle between them = 360° ÷ number of holes.</li>
 <li>Circumference = π d. One turn of a wheel moves it forward by its circumference.</li>
 <li><b>Tessellation and nesting:</b> to find how many parts fit on a sheet, divide each side of the sheet by each side of the part, <b>round down</b>, then multiply.</li></ul>` },
 { calc: [
  ['A CNC router moves in a straight line from (20, 30) to (80, 110), in mm. How far does the cutter travel?', 100, 0.01, 'mm', 'Change in x = 60; change in y = 80. √(60² + 80²) = 100 mm.'],
  ['Two holes are at (10, 40) and (70, 100). What is the x-coordinate of the point midway between them?', 40, 0, 'mm', '(10 + 70) ÷ 2 = 40. (The y-coordinate is (40 + 100) ÷ 2 = 70.)'],
  ['What is the interior angle of a regular hexagon?', 120, 0, '°', 'Exterior angle = 360 ÷ 6 = 60°. Interior = 180 − 60 = 120°.'],
  ['Five holes are equally spaced around a pitch circle. What is the angle between neighbouring holes, measured at the centre?', 72, 0, '°', '360 ÷ 5 = 72°.'],
  ['A wheel has a diameter of 60 mm. How far does it travel in one revolution, to 1 decimal place?', 188.5, 0.06, 'mm', 'Circumference = π × 60 = 188.5 mm.'],
  ['How many 45 mm × 45 mm tiles can be cut from a 300 mm × 200 mm sheet? (Ignore the width of the cut.)', 24, 0, 'tiles', '300 ÷ 45 = 6.67 → 6 across. 200 ÷ 45 = 4.44 → 4 down. 6 × 4 = 24 tiles.'],
  ['A hole is at absolute position (65, 40). The next hole is at an incremental move of (25, −15). What is the absolute y-coordinate of the second hole?', 25, 0, 'mm', 'y = 40 + (−15) = 25. (x = 65 + 25 = 90.)'],
 ] },
 { mcq: [
  ['Why are all dimensions on a part usually taken from one datum?', ['It looks neater', 'Small errors do not add up from one feature to the next', 'It uses less ink', 'It makes the part stronger'], 1, 'Chain dimensioning lets tolerances accumulate.'],
 ] },
]},

{ t: 'Probability', spec: 'g', blocks: [
 { notes: `<p>The spec asks for statistics and probability “as a measure of <b>likelihood</b>”: how likely a fault is, how many users will want a feature, how many products will sell.</p>
 <ul><li>Probability is a number from <b>0</b> (impossible) to <b>1</b> (certain). It can be written as a fraction, decimal or percentage.</li>
 <li><b>Probability = number of times it happens ÷ total number of trials</b> (from data), e.g. 12 defective in 1,000 gives 12 ÷ 1,000 = 0.012.</li>
 <li><b>Expected number</b> = probability × number of trials.</li>
 <li>Probability it does <b>not</b> happen = 1 − probability it does.</li>
 <li>For <b>independent</b> events that must <b>both</b> happen, <b>multiply</b> the probabilities. A product with two components works only if both work.</li>
 <li><b>Using a sample to estimate a market:</b> if 64 of 80 people surveyed would buy, estimate 80% of the whole market, but remember that small or biased samples are unreliable.</li></ul>
 <p>This links to <b>risk assessment</b> (likelihood × severity, Topic 7) and to <b>quality control</b> sampling (Topic 8).</p>` },
 { calc: [
  ['In a run of 1,000 parts, 12 are defective. What is the probability that a part chosen at random is defective? Give a decimal.', 0.012, 0.0001, '', '12 ÷ 1,000 = 0.012 (1.2%).'],
  ['The probability that a switch is faulty is 0.004. How many faulty switches would you expect in a batch of 25,000?', 100, 0, 'switches', '0.004 × 25,000 = 100.'],
  ['A torch works only if both its LED and its switch work. The probability the LED works is 0.98 and the probability the switch works is 0.95. What is the probability that the torch works?', 0.931, 0.0005, '', '0.98 × 0.95 = 0.931.'],
  ['For the same torch, what is the probability that it does not work?', 0.069, 0.0005, '', '1 − 0.931 = 0.069.'],
  ['In a survey, 64 of 80 users prefer design B. If the market is 15,000 customers, how many would you estimate prefer design B?', 12000, 0, 'customers', '64 ÷ 80 = 0.8. 0.8 × 15,000 = 12,000.'],
  ['A machine has a 2% chance of producing a reject on each cycle. What is the probability that a part is good? Give a decimal.', 0.98, 0.0001, '', '1 − 0.02 = 0.98.'],
 ] },
 { tf: [
  ['A probability of 1.2 is possible.', false, 'Probabilities are always between 0 and 1.'],
  ['A larger sample generally gives a more reliable estimate.', true, 'Small samples can be unrepresentative.'],
  ['If two independent parts each have a 0.9 chance of working, the chance both work is 0.9.', false, '0.9 × 0.9 = 0.81.'],
 ] },
]},

{ t: 'Exam-style multi-step questions', spec: 'a–g', blocks: [
 { tip: 'These are longer questions like the 8-mark calculation in the sample paper. Set your working out in clear steps on paper, with units, before you check the answer. In the exam, each correct step earns a mark.' },
 { calc: [
  ['A block of beech measures 180 mm × 60 mm × 40 mm. A rectangular slot 120 mm × 20 mm is cut right through the 40 mm thickness, and two holes of diameter 20 mm are drilled right through the 40 mm thickness. Calculate the percentage of the block removed as waste. Give your answer to 1 decimal place.', 28, 0.06, '%', 'Block: 180 × 60 × 40 = 432,000 mm³. Slot: 120 × 20 × 40 = 96,000 mm³. One hole: π × 10² × 40 = 12,566 mm³; two holes: 25,133 mm³. Removed: 96,000 + 25,133 = 121,133 mm³. 121,133 ÷ 432,000 × 100 = 28.0%.'],
  ['A batch of 250 stools is made. Each stool uses 0.35 m² of plywood at €18.40 per m², four legs at €1.15 each and €6.20 of labour. Overheads for the batch are €900. The company adds 35% profit. Calculate the selling price of one stool, to the nearest cent.', 28.13, 0.006, '€', 'Plywood: 0.35 × 18.40 = 6.44. Legs: 4 × 1.15 = 4.60. Labour: 6.20. Overheads: 900 ÷ 250 = 3.60. Cost = 20.84. Selling price = 20.84 × 1.35 = €28.13.'],
  ['A welding jig must hold a tube so that its end is 250 mm higher over a horizontal distance of 420 mm. Calculate the angle of the tube to the horizontal. Give your answer to 2 significant figures.', 31, 0.5, '°', 'tan θ = 250 ÷ 420 = 0.5952. θ = tan⁻¹(0.5952) = 30.76° = 31° (2 s.f.).'],
  ['An acrylic rod has a diameter of 25 mm and a length of 2 m. The density of acrylic is 1.18 g/cm³. Calculate the mass of the rod in kg, to 2 decimal places.', 1.16, 0.006, 'kg', 'r = 1.25 cm; length = 200 cm. Volume = π × 1.25² × 200 = 981.7 cm³. Mass = 981.7 × 1.18 = 1158 g = 1.16 kg.'],
  ['On a 1 : 50 floor plan, a workshop measures 84 mm × 62 mm. Calculate the real floor area in m².', 13.02, 0.005, 'm²', 'Real size: 84 × 50 = 4200 mm = 4.2 m; 62 × 50 = 3100 mm = 3.1 m. Area = 4.2 × 3.1 = 13.02 m².'],
  ['A product has fixed costs of €18,000, a variable cost of €7.50 per unit and sells for €19.50. Calculate the profit if 2,400 units are sold.', 10800, 0.01, '€', 'Contribution per unit = 19.50 − 7.50 = 12.00. 2,400 × 12 = 28,800. Profit = 28,800 − 18,000 = €10,800. (Break-even is 1,500 units.)'],
  ['Parts 95 mm × 60 mm are cut from a sheet 1220 mm × 610 mm, all the same way round. Calculate the percentage of the sheet that is wasted, to 1 decimal place. (Ignore the width of the cut.)', 8.1, 0.06, '%', 'Along 1220: 1220 ÷ 95 = 12.8 → 12 parts. Along 610: 610 ÷ 60 = 10.2 → 10 parts. 120 parts × 5,700 mm² = 684,000 mm². Sheet = 744,200 mm². Waste = 60,200 ÷ 744,200 × 100 = 8.1%.'],
 ] },
 { nea: 'Where have you used maths in your NEA? For example: scaling a drawing, calculating the material you needed and its cost, using percentile data for a key dimension, or working out an angle. Showing the calculation in your portfolio is good evidence of applying mathematical skills.' },
]},

]});
