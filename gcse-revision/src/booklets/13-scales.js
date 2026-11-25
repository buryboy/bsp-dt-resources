/* 3.2.7 Scales of production (AQA 8552, specialist technical principles) */
SPEC.push(
 ['q13a', 13, '3.2.7', 'Prototype and batch production', 'How products are produced in different volumes · prototype (one-off) · batch', '**Explain** why batch production is used to make a range of 500 identical wooden chairs.', 3, ['A set number is made together, so jigs, templates and machines can be set up once for each part (1)', 'which makes the chairs quicker, cheaper and more consistent than making them one at a time (1)', 'and the equipment can then be changed to make a different design when the batch is finished (1)']],
 ['q13b', 13, '3.2.7', 'Mass and continuous production', 'Mass production · continuous production · why different methods suit different volumes', '**Explain** why injection-moulded bottle caps are made by mass or continuous production.', 3, ['Millions of identical caps are needed (1)', 'The mould and machine are very expensive, but that cost is shared over a huge number, so each cap costs very little (1)', 'The process is automated and runs non-stop with very little labour (1)']],
);
BOOKLETS.push({ id: 'g13', topic: 13, title: 'Scales of production', pages: [

{ t: 'Overview and key words', blocks: [
 { notes: `<p class="lead">How a product is made depends on <b>how many</b> are needed. The specification names four scales of production.</p>
 <table><tr><th>Scale</th><th>How many</th><th>In one line</th></tr>
 <tr><td><b>Prototype</b> (one-off)</td><td>One</td><td>A single product made by skilled people, often by hand</td></tr>
 <tr><td><b>Batch</b></td><td>A set number, from tens to thousands</td><td>A group made together, then the equipment is changed for the next batch</td></tr>
 <tr><td><b>Mass</b></td><td>Thousands to millions</td><td>A production line making one product in very large numbers</td></tr>
 <tr><td><b>Continuous</b></td><td>Non-stop</td><td>Runs 24 hours a day, 7 days a week, making one thing</td></tr></table>
 <p><b>The pattern to remember:</b> as the quantity goes up, the <b>set-up cost goes up</b>, the <b>cost of each product goes down</b>, the <b>skill of the workers goes down</b>, and <b>flexibility goes down</b>.</p>` },
 { keys: [
  ['Prototype', 'A first, single version of a product made to test an idea; also used for a one-off product'],
  ['One-off production', 'Making a single, unique product, usually to a customer’s order'],
  ['Batch production', 'Making a set number of identical products together, then changing over to make something else'],
  ['Mass production', 'Making very large numbers of identical products on a production line'],
  ['Continuous production', 'Non-stop production of one product, 24 hours a day'],
  ['Production line', 'A sequence of workstations or machines that a product passes along as it is made'],
  ['Unit cost', 'The cost of making one product'],
  ['Economies of scale', 'The saving made on each product when very large numbers are made'],
  ['Jig', 'A device that holds the work and guides the tool so every part is made the same'],
  ['Downtime', 'Time when machines are stopped, for example while being changed over between batches'],
  ['Automation', 'Machines and robots doing the work with little human help'],
  ['Bespoke', 'Made specially for one customer'],
 ] },
]},

{ t: 'Prototype and batch production', spec: '3.2.7', blocks: [
 { notes: `<h4>Prototype (one-off) production</h4>
 <p>One product is made, either to test a design before it goes into production, or as a unique item for one customer (<b>bespoke</b>).</p>
 <table><tr><th>Features</th><th>Advantages</th><th>Disadvantages</th><th>Examples</th></tr>
 <tr><td>Highly skilled workers; general-purpose tools and machines; a lot of hand work; often uses 3D printing or laser cutting for prototypes</td><td>Exactly what the customer wants; high quality; design can be changed as it is made</td><td>Slow; very high cost for each product; depends on skilled labour</td><td>A wedding dress, a made-to-measure kitchen, a bridge, a prototype of a new phone, your NEA product</td></tr></table>
 <h4>Batch production</h4>
 <p>A set quantity is made in one go. The workers and machines then <b>change over</b> to make a batch of something else.</p>
 <table><tr><th>Features</th><th>Advantages</th><th>Disadvantages</th><th>Examples</th></tr>
 <tr><td>Flexible machines; <b>jigs, templates and patterns</b> make parts identical; semi-skilled workers; often organised in work cells</td><td>Cheaper for each product than one-off; consistent; can respond to seasons and fashion; different sizes, colours or flavours from the same equipment</td><td><b>Downtime</b> during change-over earns nothing; finished batches must be stored; less efficient than mass production</td><td>Bread and cakes in a bakery, a clothing range in several sizes, furniture, a limited-edition trainer, school D&T projects made by a class</td></tr></table>` },
 { sort: { q: 'One-off (prototype) or batch?', cats: ['One-off or prototype', 'Batch'], items: [['A made-to-measure suit', 0], ['200 school jumpers in five sizes', 1], ['A concept car for a motor show', 0], ['A tray of 48 croissants', 1], ['A stained-glass window for a church', 0], ['A run of 1000 printed posters', 1]] } },
 { mcq: [
  ['What is the main disadvantage of one-off production?', ['Low quality', 'High cost for each product', 'The product cannot be customised', 'It needs a production line'], 1, 'One product carries all the design and skilled labour cost.'],
  ['Why are jigs used in batch production?', ['To make each product different', 'To make sure every part is made the same, quickly', 'To slow production down', 'To replace the materials'], 1, 'A jig holds the work and guides the tool.'],
  ['What is “downtime” in batch production?', ['Time when workers are on holiday', 'Time lost while machines are changed over for the next batch', 'The time a product spends in a shop', 'The time taken to design the product'], 1, 'Nothing is being made, so it costs money.'],
 ] },
]},

{ t: 'Mass and continuous production', spec: '3.2.7', blocks: [
 { notes: `<h4>Mass production</h4>
 <p>One product is made in very large numbers on a <b>production line</b>. The product moves from one stage to the next; each worker or robot does one task.</p>
 <table><tr><th>Features</th><th>Advantages</th><th>Disadvantages</th><th>Examples</th></tr>
 <tr><td>Specialised machines and expensive tooling (moulds, dies); a lot of automation and robots; mostly unskilled or semi-skilled workers; standard components bought in</td><td>Very low cost for each product (<b>economies of scale</b>); fast; consistent quality</td><td>Very high set-up cost; inflexible, so a design change is expensive; a breakdown stops the whole line; repetitive work</td><td>Cars, phones, washing machines, trainers, drinks cans, injection-moulded toys</td></tr></table>
 <h4>Continuous production</h4>
 <p>The process <b>never stops</b>: 24 hours a day, 7 days a week, often for years. It is used for products in constant, huge demand and for processes that are too costly to stop and restart.</p>
 <table><tr><th>Features</th><th>Advantages</th><th>Disadvantages</th><th>Examples</th></tr>
 <tr><td>Fully automated; a few highly trained staff monitor and maintain it; workers on shifts</td><td>The lowest cost for each product; maximum output</td><td>The highest set-up cost; no flexibility at all; stopping the plant is very expensive</td><td>Steel, oil refining and polymer granules, paper, float glass, extruded pipe, wire, screws</td></tr></table>
 <h4>Comparing the four</h4>
 <table><tr><th></th><th>Prototype</th><th>Batch</th><th>Mass</th><th>Continuous</th></tr>
 <tr><td>Number made</td><td>1</td><td>10s to 1000s</td><td>1000s to millions</td><td>Non-stop</td></tr>
 <tr><td>Set-up cost</td><td>Low</td><td>Medium</td><td>High</td><td>Very high</td></tr>
 <tr><td>Cost of each product</td><td>Very high</td><td>Medium</td><td>Low</td><td>Very low</td></tr>
 <tr><td>Worker skill</td><td>High</td><td>Medium</td><td>Low</td><td>Low on the line; high for maintenance</td></tr>
 <tr><td>Flexibility</td><td>High</td><td>Medium</td><td>Low</td><td>None</td></tr></table>` },
 { match: { q: 'Match each product to its most likely scale of production.', lh: 'Product', rh: 'Scale', pairs: [['A crown for a king', 'One-off'], ['A bakery’s morning loaves', 'Batch'], ['A family car', 'Mass'], ['Rolls of paper at a paper mill', 'Continuous']] } },
 { tf: [
  ['Mass production gives a low cost for each product because the set-up cost is shared over a very large number.', true, 'This is economies of scale.'],
  ['Continuous production is the most flexible scale of production.', false, 'It is the least flexible: it makes one thing, non-stop.'],
  ['One-off production needs the most highly skilled workers.', true, 'They make the whole product, often by hand.'],
  ['In mass production a breakdown at one stage can stop the whole line.', true, 'Each stage depends on the one before.'],
 ] },
]},

{ t: 'Exam practice', spec: '3.2.7', blocks: [
 { tip: '<b>Link the scale to the process.</b> Injection moulding and die casting only make sense for very large quantities (large batch or mass production) because the tooling costs many thousands of pounds. Laser cutting, 3D printing and hand tools suit one-off and small batches because there is no tooling to pay for.' },
 { mcq: [
  ['Which scale of production would be used to make polymer granules?', ['One-off', 'Batch', 'Mass', 'Continuous'], 3, 'Refining and polymer production run non-stop.'],
  ['Which scale of production has the highest cost for each product?', ['One-off', 'Batch', 'Mass', 'Continuous'], 0, 'All the cost falls on a single product.'],
  ['A company makes garden gnomes: 300 of one design, then 300 of another. Which scale is this?', ['One-off', 'Batch', 'Mass', 'Continuous'], 1, 'A set number, then a change-over.'],
 ] },
 { exam: [
  ['**Give** two features of mass production.', 2, ['Any two: production line; high level of automation / robots; specialised machines and tooling; very large numbers; low unit cost; mostly unskilled labour (1 each)']],
  ['**Explain** why a prototype of a new product is usually made before it goes into mass production.', 2, ['It lets the design be tested and shown to users, and faults found and corrected (1)', 'before the company spends a very large amount on tooling that would be costly to change (1)']],
  ['**Explain** two disadvantages of batch production.', 4, ['Machines must be reset and jigs changed between batches (1) so there is downtime when nothing is produced (1)', 'Batches are made before they are sold (1) so they must be stored, which costs money and space (1)']],
  ['**Evaluate** the advantages and disadvantages of producing products in large quantities. Refer to different scales of production in your answer.', 8, ['Advantage: economies of scale; materials are bought in bulk and tooling cost is shared, so each product is cheap', 'Advantage: automation and jigs give fast, consistent, accurate products with less skilled labour', 'Advantage: affordable products for consumers, e.g. phones, cars, flat-pack furniture', 'Disadvantage: very high set-up cost for moulds, dies and production lines; only worth it if enough are sold', 'Disadvantage: inflexible; every product is the same; a design change is slow and costly; a breakdown stops everything', 'Disadvantage: repetitive, low-skilled work; fewer jobs; unsold stock is wasted; more resources used', 'Contrast with one-off and batch: more choice, customising and skilled work, but higher cost for each product', 'Judgement, e.g. large quantities suit standard everyday products; batch or one-off suits fashion, seasonal or bespoke items']],
 ] },
 { nea: 'Your NEA product is a one-off prototype. In your evaluation, explain how it would be made differently in a batch of 100 or by mass production: which processes, jigs or moulds would change, and why.' },
]},

]});
