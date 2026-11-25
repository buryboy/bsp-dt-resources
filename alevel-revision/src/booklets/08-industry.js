/* Topic 8: Features of manufacturing industries (Edexcel 9DT0 8.1–8.3) */
BOOKLETS.push({ id: 't8', topic: 8, title: 'Features of manufacturing industries', pages: [

{ t: 'Overview and key words', blocks: [
 { notes: `<p class="lead">Topic 8 is about how industry is organised to make products <b>accurately and efficiently</b>: the scale of production, how quality is monitored, and the modern systems that keep factories running.</p>
 <table><tr><th>Page</th><th>Spec</th><th>Covers</th></tr>
 <tr><td>2</td><td>8.1</td><td>Methods of production: one-off, batch, high-volume</td></tr>
 <tr><td>3</td><td>8.2a</td><td>Quality control: inspection, testing, computer-aided testing</td></tr>
 <tr><td>4</td><td>8.2b–c</td><td>Quality assurance and Total Quality Management, ISO 9000</td></tr>
 <tr><td>5</td><td>8.3a–c</td><td>Scheduling and logistics, robotics, materials handling (ASRS, AGVs)</td></tr>
 <tr><td>6</td><td>8.3d–e</td><td>Flexible manufacturing, cell production, lean manufacturing and JIT</td></tr>
 <tr><td>7</td><td>8.3f–i</td><td>Standardised parts, QRM, data integration (PDM, ERP), concurrent manufacturing</td></tr>
 <tr><td>8</td><td>8</td><td>Mixed exam practice</td></tr></table>` },
 { keys: [
  ['One-off production', 'A single product made to a customer’s specification'],
  ['Batch production', 'A set number of identical products made together, before the equipment is changed over to make something else'],
  ['High-volume production', 'Very large numbers made on dedicated, often automated, lines (mass or continuous production)'],
  ['Quality control (QC)', 'Checking products by inspection and testing, during and after manufacture, to make sure they are within tolerance'],
  ['Quality assurance (QA)', 'A planned system covering every stage, from design to customer, to make sure quality is built in'],
  ['TQM', 'Total Quality Management: everyone in the organisation is responsible for quality and for continuous improvement'],
  ['Tolerance', 'The permitted variation from a stated size, e.g. 50 mm ± 0.2 mm'],
  ['Lean manufacturing', 'Organising production to eliminate every kind of waste'],
  ['Just-in-time (JIT)', 'Materials and parts arrive, and products are made, only when they are needed'],
  ['FMS', 'Flexible manufacturing system: computer-controlled machines, robots and handling that can switch quickly between products'],
  ['AGV', 'Automatic guided vehicle: a driverless vehicle that moves materials around a factory'],
  ['ASRS', 'Automated storage and retrieval system: computer-controlled cranes or shuttles that store and fetch stock'],
  ['Lead time', 'The time from receiving an order to delivering the product'],
  ['Downtime', 'Time when a machine or line is not producing'],
 ] },
]},

{ t: 'Methods of production', spec: '8.1', blocks: [
 { notes: `<table><tr><th></th><th>One-off (bespoke, jobbing)</th><th>Batch</th><th>High-volume (mass / continuous)</th></tr>
 <tr><td><b>Quantity</b></td><td>One, or very few</td><td>Tens to thousands, in repeated runs</td><td>Tens of thousands to millions</td></tr>
 <tr><td><b>Workers</b></td><td>Highly skilled, flexible craftspeople</td><td>Skilled and semi-skilled; flexible</td><td>Mostly semi-skilled or unskilled operators plus technicians; highly automated</td></tr>
 <tr><td><b>Equipment</b></td><td>General-purpose machines and hand tools</td><td>Flexible machines, CNC, <b>jigs, fixtures, templates and moulds</b> that are changed between batches</td><td>Dedicated, specialised machines, robots and tooling on a production line</td></tr>
 <tr><td><b>Set-up cost</b></td><td>Low</td><td>Medium</td><td>Very high (tooling, automation)</td></tr>
 <tr><td><b>Unit cost</b></td><td>Very high</td><td>Medium</td><td>Very low (economies of scale)</td></tr>
 <tr><td><b>Flexibility</b></td><td>Total: made to the client’s exact needs</td><td>Good: products and quantities can change with demand</td><td>Low: changes are slow and expensive</td></tr>
 <tr><td><b>Examples</b></td><td>Bespoke furniture, wedding dress, prototype, bridge, satellite</td><td>Furniture ranges, bakery goods, seasonal clothing, limited editions</td><td>Cars, phones, bottles, screws; continuous: steel, paper, chemicals</td></tr></table>
 <h4>Stages</h4>
 <ul><li><b>One-off:</b> client brief → design and agreement with the client → materials ordered → made by one person or a small team, often in one place → fitted, checked with the client and delivered.</li>
 <li><b>Batch:</b> production planned from orders or forecasts → machines set up and jigs or moulds fitted → the whole batch goes through each stage together → quality checks → <b>changeover</b> (downtime) → next batch. Stock is stored until sold.</li>
 <li><b>High-volume:</b> large investment in a dedicated line → parts and sub-assemblies fed to the line → product moves from station to station, each adding one operation → automated inspection → packing and distribution, often running 24 hours a day.</li></ul>
 <h4>Choosing a scale</h4><p>It depends on <b>demand</b> (how many will sell, and whether demand is steady or seasonal), the <b>selling price</b>, the <b>complexity</b> of the product and the <b>investment</b> available.</p>` },
 { sort: { h: 'Which method?', q: 'Sort each product by the most likely method of production.', cats: ['One-off', 'Batch', 'High-volume'], items: [['A made-to-measure staircase', 0], ['Plastic bottle tops', 2], ['A range of 500 garden benches for spring', 1], ['A Formula 1 car chassis', 0], ['Smartphone circuit boards', 2], ['A limited edition of 2,000 trainers', 1], ['Self-tapping screws', 2], ['Loaves in a local bakery', 1]] } },
 { sort: { h: 'Characteristics', q: 'Which method does each statement describe?', cats: ['One-off', 'Batch', 'High-volume'], items: [['Highest unit cost', 0], ['Jigs and moulds are changed over between runs', 1], ['Dedicated production line with very high set-up cost', 2], ['Made to the client’s exact requirements', 0], ['Lowest unit cost', 2], ['Downtime while machines are reset for the next product', 1]] } },
 { mcq: [
  ['Why is the unit cost of a one-off product high?', ['Poor-quality materials are used', 'Skilled labour time is long and no economies of scale are possible', 'It is made by robots', 'Tooling is expensive'], 1, 'One product carries all the design and labour cost.'],
  ['What is the main disadvantage of batch production compared with high-volume production?', ['It cannot change products', 'Downtime during changeovers and higher unit cost', 'It needs more investment', 'Workers need no skills'], 1, 'Resetting machines between batches is lost production time.'],
  ['Why is high-volume production inflexible?', ['Workers refuse to change', 'Dedicated machines and tooling are designed for one product and are costly to change', 'It uses hand tools', 'It has no quality control'], 1, 'A new product can mean new tooling and re-laying the line.'],
 ] },
 { exam: [
  ['**Explain** why batch production suits a manufacturer of seasonal garden furniture.', 2, ['A set quantity is made, then machines and jigs are changed over (1)', 'so output can follow seasonal demand and the range can change each year (1)']],
  ['**Explain** two reasons why one-off production results in a high-cost product.', 4, ['Highly skilled labour is needed for a long time (1), and labour is charged at a high rate (1)', 'No economies of scale (1): materials are bought in small quantities and design/set-up costs are carried by one product (1)']],
  ['**Explain** two characteristics of high-volume production.', 6, ['Dedicated, automated machinery and tooling (1), with very high initial cost (1) that is only recovered by selling very large numbers (1)', 'The product moves along a line with the work divided into simple operations (1), so output is fast and consistent (1), giving a very low unit cost (1)']],
 ] },
]},

{ t: 'Quality control', spec: '8.2a', blocks: [
 { notes: `<p>The spec defines <b>quality control</b> as monitoring and achieving high standards and the required <b>degree of tolerance</b> by <b>inspection and testing</b>, including <b>computer-aided testing</b>. QC <i>detects</i> faults.</p>
 <h4>Tolerance</h4><p>No two parts are identical. A tolerance sets the acceptable range: 25.0 ± 0.1 mm means 24.9 to 25.1 mm. Tight tolerances cost more to achieve, so they are only specified where parts must fit or function.</p>
 <h4>Inspection</h4>
 <ul><li>Checks at critical points: incoming materials, during production, final product.</li>
 <li><b>Sampling:</b> checking, for example, 1 in every 100, because inspecting every part is slow and costly (and impossible if the test destroys the part).</li>
 <li>Tools: visual checks, <b>go/no-go gauges</b>, vernier callipers, micrometers, depth and thread gauges, colour swatches and a densitometer in printing.</li></ul>
 <h4>Testing</h4>
 <ul><li><b>Non-destructive testing (NDT):</b> the part can still be used: dimensional checks, X-ray and ultrasonic testing of welds and castings, dye penetrant for cracks, electrical safety tests.</li>
 <li><b>Destructive testing:</b> a sample is tested to failure: tensile, impact, fatigue, crash and drop tests.</li></ul>
 <h4>Computer-aided testing</h4>
 <ul><li><b>Coordinate measuring machine (CMM):</b> a probe touches the part at many points and compares the measurements with the CAD model.</li>
 <li><b>Laser and optical scanners, machine vision:</b> cameras and software check size, shape, colour, labels or missing parts at line speed, on every product.</li>
 <li><b>In-process sensors and probes:</b> machines measure parts as they are made and adjust automatically.</li>
 <li>✔ Fast, very accurate, consistent, can check 100% of products, records data automatically. ✘ High cost, programming, calibration.</li></ul>
 <h4>Statistical process control (SPC)</h4><p>Sample measurements are plotted on a <b>control chart</b>. A trend drifting towards a limit shows a problem (such as tool wear) so it can be corrected <b>before</b> parts go out of tolerance.</p>
 <table><tr><th>Advantages of QC</th><th>Disadvantages of QC</th></tr>
 <tr><td>Faulty products are stopped before they reach the customer</td><td>Finds faults after they have been made: scrap and rework waste material, time and money</td></tr>
 <tr><td>Data shows where problems occur</td><td>Inspectors and equipment are a cost; sampling can miss faults</td></tr>
 <tr><td>Protects reputation and safety</td><td>Workers may feel quality is “the inspector’s job”</td></tr></table>` },
 { sort: { h: 'Destructive or non-destructive?', q: 'Sort each test.', cats: ['Non-destructive', 'Destructive'], items: [['Ultrasonic test of a weld', 0], ['Tensile test to failure', 1], ['Checking a diameter with a go/no-go gauge', 0], ['Car crash test', 1], ['X-ray of a casting', 0], ['Drop test of a phone until it breaks', 1], ['Machine-vision check of a printed label', 0]] } },
 { calc: [
  ['A shaft is specified as 30.00 mm ± 0.05 mm. What is the smallest acceptable diameter, in mm?', 29.95, 0.001, 'mm', '30.00 − 0.05 = 29.95 mm (largest is 30.05 mm).'],
  ['In a sample of 250 mouldings, 6 are rejected. What is the reject rate as a percentage?', 2.4, 0.01, '%', '6 ÷ 250 × 100 = 2.4%.'],
  ['If that 2.4% reject rate continues, how many rejects would you expect in a run of 12,000?', 288, 0, 'parts', '12,000 × 0.024 = 288.'],
  ['A manufacturer inspects 1 part in every 40. How many parts are inspected in a batch of 5,000?', 125, 0, 'parts', '5,000 ÷ 40 = 125.'],
 ] },
 { mcq: [
  ['Why is sampling used instead of inspecting every product?', ['It is more accurate', 'Checking every item is slow and costly, and impossible for destructive tests', 'It is required by law', 'Samples are never faulty'], 1, 'Though automated vision systems now allow 100% inspection of some features.'],
  ['What does a coordinate measuring machine do?', ['Cuts parts to size', 'Probes a part and compares its dimensions with the CAD data', 'Moves materials around the factory', 'Prints control charts'], 1, 'It is a computer-aided testing tool.'],
  ['What is the purpose of a control chart in SPC?', ['To record wages', 'To show trends so a process can be corrected before parts go out of tolerance', 'To list suppliers', 'To schedule deliveries'], 1, 'It prevents defects rather than just finding them.'],
 ] },
 { exam: [
  ['**Explain** one advantage of using computer-aided testing to check the dimensions of injection-moulded parts.', 3, ['A vision system or CMM measures quickly and automatically (1), so every part can be checked at production speed rather than a sample (1), meaning no out-of-tolerance parts reach assembly or the customer (1)']],
  ['**Explain** why tolerances are specified on working drawings.', 2, ['Exact sizes cannot be achieved every time, so a tolerance gives the acceptable range (1)', 'which ensures parts made at different times or places will still fit and function (1)']],
 ] },
]},

{ t: 'Quality assurance and TQM', spec: '8.2b–c', blocks: [
 { notes: `<h4>Quality assurance (QA)</h4>
 <p>The spec defines QA as monitoring the quality of a product from its <b>design and development</b> stage, through its <b>manufacture</b>, to its <b>end-use performance</b> and the degree of <b>customer satisfaction</b>. QA <i>prevents</i> faults; quality control is one part of it.</p>
 <table><tr><th>Stage</th><th>QA activities</th></tr>
 <tr><td>Design and development</td><td>Clear specification; design reviews; prototypes and testing; designing for manufacture; choosing standards to meet</td></tr>
 <tr><td>Suppliers</td><td>Approved suppliers; materials certified and checked on arrival</td></tr>
 <tr><td>Manufacture</td><td>Documented procedures; trained staff; maintained and calibrated machines; QC checks at critical points; traceability (batch numbers)</td></tr>
 <tr><td>End use and customer</td><td>Guarantees; customer feedback, returns and complaints analysed; product recalls if needed; improvements fed back to design</td></tr></table>
 <p>✔ “Right first time”: less scrap and rework, consistent products, customer confidence. ✘ Takes time, paperwork and training to set up and keep going.</p>
 <h4>Total Quality Management (TQM)</h4>
 <p>TQM applies quality assurance to the <b>whole organisation</b>. The spec stresses its <b>impact on employees at every stage</b> of production.</p>
 <ul><li><b>Everyone</b> is responsible for quality, from directors to operators, cleaners and suppliers.</li>
 <li>Each stage treats the next as its <b>customer</b> and passes on only good work.</li>
 <li><b>Continuous improvement</b> (kaizen): many small improvements suggested by the people doing the job.</li>
 <li><b>Quality circles:</b> small groups of workers meet regularly to solve quality problems.</li>
 <li>Workers are <b>empowered</b> to stop the line when they see a fault, and are trained to check their own work.</li>
 <li>The aim is <b>zero defects</b> and total customer satisfaction.</li></ul>
 <table><tr><th>Impact on employees: positive</th><th>Impact on employees: negative</th></tr>
 <tr><td>More responsibility, involvement and job satisfaction; training and new skills; teamwork</td><td>More pressure and accountability; time needed for training and meetings; some resist change; needs commitment from management to work</td></tr></table>
 <h4>ISO 9000</h4>
 <p>The international family of standards for <b>quality management systems</b>. A company certified to <b>ISO 9001</b> has been independently audited to show it has documented procedures, keeps records, meets customer requirements and improves continually. Many large customers will only buy from certified suppliers. It certifies the <b>system</b>, not an individual product.</p>` },
 { sort: { h: 'QC or QA?', q: 'Is each activity mainly quality control or quality assurance?', cats: ['Quality control', 'Quality assurance'], items: [['Measuring a sample of parts with a micrometer', 0], ['Training operators before they use a new machine', 1], ['Rejecting a moulding with a sink mark', 0], ['Choosing an approved supplier with certified materials', 1], ['A go/no-go check at the end of the line', 0], ['Writing a documented procedure for each process', 1], ['Analysing customer returns to improve the design', 1]] } },
 { tf: [
  ['In TQM, quality is the responsibility of the inspection department only.', false, 'Everyone in the organisation is responsible.'],
  ['Quality assurance aims to prevent faults; quality control detects them.', true, 'QC is one of the tools used within QA.'],
  ['ISO 9001 certification guarantees that every product a company makes is perfect.', false, 'It shows the company has an audited quality management system.'],
  ['A quality circle is a group of workers who meet to solve quality problems.', true, 'It is part of continuous improvement.'],
 ] },
 { exam: [
  ['**Explain** the difference between quality control and quality assurance.', 4, ['QC: inspecting and testing products at set stages (1) to find faults and reject parts out of tolerance (1)', 'QA: a system covering the whole process from design to customer (1) to prevent faults happening, e.g. procedures, training, supplier approval (1)']],
  ['**Explain** two ways in which Total Quality Management affects the employees of a manufacturing company.', 6, ['Every employee is responsible for the quality of their own work (1), so they check it before passing it on (1), which gives more involvement and job satisfaction but also more accountability (1)', 'Employees take part in quality circles / suggest improvements (1), so problems are solved by those who know the job (1), which needs time and training provided by the company (1)']],
  ['**Discuss** the benefits and drawbacks to a furniture manufacturer of gaining ISO 9001 certification.', 6, ['Consistent quality, fewer defects and returns, lower costs', 'Customers and large retailers may require it; access to contracts and export markets; marketing value', 'Clear procedures and records help training and tracing faults', 'Costs: time, paperwork, audits and fees; staff resistance; does not itself guarantee a good product'],],
 ] },
]},

{ t: 'Scheduling, logistics, robotics and materials handling', spec: '8.3a–c', blocks: [
 { notes: `<h4>Production scheduling and production logistics (8.3a)</h4>
 <ul><li><b>Scheduling</b> plans <b>what</b> is made, <b>when</b>, on <b>which</b> machines and by <b>whom</b>, so that orders are met on time and machines and people are not idle. Tools: Gantt charts, critical path analysis, MRP/ERP software, a <b>master production schedule</b>.</li>
 <li>It must balance orders and forecasts, machine capacity, staff, material deliveries, changeover times and maintenance.</li>
 <li><b>Logistics</b> is the movement and storage of materials, parts and finished goods: from suppliers (inbound), through the factory, and out to warehouses, shops and customers (outbound). It includes transport, warehousing, stock control, barcodes and RFID tracking.</li>
 <li>✔ Fewer delays and bottlenecks, lower stock, on-time delivery. ✘ Depends on accurate data and reliable suppliers; easily upset by breakdowns or late deliveries.</li></ul>
 <h4>Robotics in production (8.3b)</h4>
 <p>Robots work on <b>fully automated production and assembly lines and cells</b>: welding, spray painting, pick-and-place, palletising, assembly, machine loading, inspection.</p>
 <table><tr><th>Advantages</th><th>Disadvantages</th></tr>
 <tr><td>Accurate and consistent: the same quality every time</td><td>Very high purchase, installation and programming cost</td></tr>
 <tr><td>Work 24 hours a day without breaks, so high output</td><td>Skilled technicians needed; breakdowns stop the line</td></tr>
 <tr><td>Do dangerous, dirty, heavy or repetitive jobs: safer for people</td><td>Fewer manual jobs; retraining needed</td></tr>
 <tr><td>Can be reprogrammed for a new product</td><td>Less adaptable than people to unexpected problems; guarding needed to keep people safe</td></tr></table>
 <h4>Materials handling systems (8.3c)</h4>
 <ul><li><b>ASRS</b> (automated storage and retrieval systems): computer-controlled cranes or shuttles put pallets and bins into high racking and fetch them when needed. ✔ Uses the full height of the building, fast, accurate stock records, fewer staff, less damage. ✘ Very expensive; a failure can stop the whole warehouse.</li>
 <li><b>AGVs</b> (automatic guided vehicles): driverless vehicles that follow wires, magnetic tape, lasers or maps to carry materials between stores, machines and dispatch. ✔ Run continuously, safe (sensors stop them), routes can be reprogrammed. ✘ High cost; need clear routes and maintenance.</li>
 <li>Also conveyors, robots and overhead cranes.</li></ul>` },
 { match: { q: 'Match the system to what it does.', lh: 'System', rh: 'Job', pairs: [['ASRS', 'Stores and fetches pallets in high racking automatically'], ['AGV', 'Carries parts between workstations without a driver'], ['Production schedule', 'Sets what is made, when and on which machines'], ['Logistics', 'Manages the movement and storage of materials and finished goods'], ['Welding robot', 'Joins car body panels with the same accuracy every time']] } },
 { sort: { h: 'Robots', q: 'Is each an advantage or a disadvantage of using robots?', cats: ['Advantage', 'Disadvantage'], items: [['Consistent accuracy', 0], ['High initial cost', 1], ['Can work 24 hours a day', 0], ['Loss of manual jobs', 1], ['Take over hazardous tasks such as spraying', 0], ['A breakdown can stop the whole line', 1]] } },
 { mcq: [
  ['What is a bottleneck in production?', ['A type of mould', 'A stage that is slower than the others and holds up the whole process', 'A quality check', 'A storage system'], 1, 'Scheduling aims to remove or manage bottlenecks.'],
  ['Why do factories use AGVs rather than fork-lift trucks with drivers?', ['They are cheaper to buy', 'They run continuously, follow programmed routes safely and need no driver', 'They lift heavier loads', 'They need no maintenance'], 1, 'They link stores, cells and dispatch automatically.'],
 ] },
 { exam: [
  ['**Explain** one benefit of using robots on a car production line.', 2, ['Robots work continuously and consistently (1) so output is higher and quality repeatable (1)', 'Or: they do dangerous or repetitive jobs such as welding and spraying (1), improving safety (1)']],
  ['**Explain** two benefits to a manufacturer of using an automated storage and retrieval system.', 6, ['Stock is stored in high racking by computer-controlled cranes (1), so the full height of the building is used (1), reducing the floor space and cost of the warehouse (1)', 'The computer records exactly what is stored and where (1), so parts are retrieved quickly and accurately (1), keeping production supplied without delays (1)']],
  ['**Explain** why accurate production scheduling is important to a manufacturer.', 3, ['It plans when each product is made and on which machines (1), so materials, staff and machines are ready when needed (1), meaning orders are delivered on time without idle machines or excess stock (1)']],
 ] },
]},

{ t: 'Flexible manufacturing, cells, lean and JIT', spec: '8.3d–e', blocks: [
 { notes: `<h4>Flexible manufacturing systems (FMS)</h4>
 <p>A group of <b>CNC machines and robots</b>, linked by automated handling (conveyors, AGVs) and controlled by a <b>central computer</b>. Programs and tools change automatically, so the system can make a <b>range of different parts in small batches</b> with very little changeover time.</p>
 <p>✔ Quick response to changes in demand or design; small batches made economically; less stock; high machine use. ✘ Very high investment; complex to program and maintain; needs skilled staff.</p>
 <h4>Modular / cell production</h4>
 <p>The factory is divided into <b>cells</b>: a team of multi-skilled workers and a group of machines, often arranged in a U shape, that make a complete product or sub-assembly (a module). The team is responsible for its own quality, output and maintenance.</p>
 <p>✔ Motivation and teamwork; quality problems are spotted and solved quickly; less movement of work; flexible. ✘ Training cost; may not match the output of a dedicated line; a weak team affects the whole module.</p>
 <h4>Lean manufacturing</h4>
 <p>Developed from the <b>Toyota Production System</b>. The aim is to give the customer what they want with the minimum of <b>waste</b>. The seven wastes:</p>
 <table><tr><th>Waste</th><th>Example</th></tr>
 <tr><td>Transport</td><td>Moving parts further than necessary</td></tr>
 <tr><td>Inventory</td><td>Stock sitting in stores, tying up money</td></tr>
 <tr><td>Motion</td><td>Workers reaching, walking or searching for tools</td></tr>
 <tr><td>Waiting</td><td>People or machines idle</td></tr>
 <tr><td>Over-production</td><td>Making more than has been ordered</td></tr>
 <tr><td>Over-processing</td><td>A finer finish or tighter tolerance than is needed</td></tr>
 <tr><td>Defects</td><td>Scrap and rework</td></tr></table>
 <p>Lean tools: <b>kaizen</b> (continuous improvement), <b>kanban</b> (cards or signals that trigger the supply of parts only when needed), <b>5S</b> workplace organisation, <b>poka-yoke</b> (mistake-proofing), cell production and <b>JIT</b>.</p>
 <h4>Just-in-time (JIT)</h4>
 <p>Materials and components are delivered <b>exactly when needed</b>, in the right quantity, and products are made <b>to order</b> (demand “pulls” production) rather than for stock.</p>
 <table><tr><th>Advantages</th><th>Disadvantages</th></tr>
 <tr><td>Little money tied up in stock; less storage space</td><td>Totally dependent on reliable suppliers and transport: one late delivery stops production</td></tr>
 <tr><td>Less waste from damaged, obsolete or unsold stock</td><td>No buffer stock to cope with a sudden rise in demand or a quality problem</td></tr>
 <tr><td>Faults show up at once, so quality improves</td><td>Many small deliveries: transport cost and emissions; less bulk-buying discount</td></tr>
 <tr><td>Quick response to changes in design or demand</td><td>Needs excellent planning, IT links and close relationships with suppliers</td></tr></table>` },
 { match: { q: 'Match the lean term to its meaning.', lh: 'Term', rh: 'Meaning', pairs: [['Kaizen', 'Continuous small improvements'], ['Kanban', 'A signal that triggers the supply of parts when needed'], ['Poka-yoke', 'Designing a process so mistakes cannot be made'], ['Pull system', 'Production is started by a customer order, not a forecast'], ['Buffer stock', 'Extra stock held in case of delays, which JIT aims to remove']] } },
 { sort: { h: 'The seven wastes', q: 'Which waste is each example?', cats: ['Inventory', 'Waiting', 'Defects', 'Over-production'], items: [['A warehouse full of unsold products', 0], ['An assembly team idle because parts are late', 1], ['Mouldings scrapped for short shots', 2], ['Making 5,000 when only 3,000 were ordered', 3], ['Pallets of components bought six months early', 0], ['Parts reworked after failing inspection', 2]] } },
 { mcq: [
  ['What makes a manufacturing system “flexible”?', ['Workers can choose their hours', 'Computer-controlled machines change programs and tools quickly to make different parts', 'It uses flexible materials', 'It has no quality checks'], 1, 'Small batches of varied parts are made with little changeover time.'],
  ['What is the biggest risk of JIT?', ['Too much stock', 'Production stops if a supplier delivers late', 'Poor quality from suppliers is hidden', 'It needs larger warehouses'], 1, 'There is no buffer stock.'],
  ['Why can cell production improve quality?', ['Inspectors work faster', 'The team is responsible for its own work and spots problems immediately', 'Robots replace all workers', 'Products are not checked'], 1, 'Ownership and quick feedback.'],
 ] },
 { exam: [
  ['**Discuss** the advantages and disadvantages of just-in-time for a manufacturer.', 6, ['Little stock, so less storage space and money tied up; less waste and obsolete stock', 'Faults found quickly; responsive to design changes and demand', 'Depends on reliable suppliers and transport; one late delivery stops production; no buffer for sudden demand', 'Frequent deliveries: cost and emissions; needs strong supplier relationships and IT'],],
  ['**Explain** two advantages of a flexible manufacturing system for a company that makes a wide range of products in small batches.', 6, ['Programs and tooling are changed automatically by the central computer (1), so changeover time between products is very short (1), making small batches economic (1)', 'Products can be made to order (1), so less finished stock is held (1), reducing storage cost and the risk of unsold products (1)']],
  ['**Explain** what is meant by lean manufacturing.', 2, ['An approach that aims to eliminate all forms of waste (e.g. excess stock, waiting, defects, over-production) (1)', 'so the customer gets what they want using the least time, material and cost (1)']],
 ] },
]},

{ t: 'Standard parts, QRM, data integration and concurrent manufacturing', spec: '8.3f–i', blocks: [
 { notes: `<h4>Standardised parts and bought-in components (8.3f)</h4>
 <ul><li><b>Standardised parts</b> are made to agreed standard sizes and specifications: nuts, bolts, screws, bearings, batteries, bulbs, electronic components.</li>
 <li><b>Bought-in components</b> are made by specialist suppliers rather than in-house: motors, switches, hinges, castors, zips, circuit boards.</li></ul>
 <table><tr><th>Advantages</th><th>Disadvantages</th></tr>
 <tr><td>Cheaper: suppliers make them in huge volumes</td><td>Dependence on suppliers for delivery and quality</td></tr>
 <tr><td>No need to design, tool up or make them; faster development</td><td>Design is constrained by the sizes available</td></tr>
 <tr><td>Guaranteed quality and known specification; interchangeable</td><td>Less distinctive product; competitors can buy the same parts</td></tr>
 <tr><td>Easy repair and maintenance: replacements readily available</td><td>Supplier may change or discontinue a part</td></tr></table>
 <h4>Quick response manufacturing (QRM) (8.3g)</h4>
 <p>A strategy that competes on <b>speed</b>: it aims to cut <b>lead times</b> in every part of the business, from quotation and design to manufacture and delivery. It suits companies making a wide variety of products in low volumes, or customised products.</p>
 <ul><li>Organised into flexible <b>cells</b> of multi-skilled people.</li>
 <li>Some <b>spare capacity</b> is kept so that urgent orders are not held in a queue.</li>
 <li><b>Sales data is shared electronically</b> (e.g. from shop tills) so production responds to what is actually selling. In fashion and retail this lets suppliers restock best-sellers in days.</li>
 <li>✔ Fast delivery wins customers; less stock and fewer unsold goods. ✘ Spare capacity and flexibility cost money; relies on IT links and responsive suppliers.</li></ul>
 <h4>Data integration (8.3h)</h4>
 <table><tr><th>System</th><th>What it does</th><th>Benefits</th></tr>
 <tr><td><b>PDM</b> (product data management)</td><td>One secure, central store for all <b>product</b> data: CAD models, drawings, specifications, parts lists (bills of materials), with <b>version control</b> and access rights</td><td>Everyone works from the latest version; changes are tracked; no duplicated or lost files; teams in different places can collaborate</td></tr>
 <tr><td><b>ERP</b> (enterprise resource planning)</td><td>One integrated system for the whole <b>business</b>: sales orders, purchasing, stock, production planning, finance, HR, distribution</td><td>Real-time information for decisions; an order automatically triggers purchasing and scheduling; supports JIT; less paperwork and duplication</td></tr></table>
 <p>✘ Both are expensive and slow to introduce, need training, and make the company dependent on the system and its security.</p>
 <h4>Concurrent manufacturing (8.3i)</h4>
 <p>Also called concurrent or simultaneous engineering. Instead of each department finishing before the next begins (“over the wall”), design, engineering, production planning, tooling, purchasing and marketing work <b>at the same time</b> in a <b>multi-disciplinary team</b>, sharing data.</p>
 <p>✔ Much shorter <b>time to market</b>; manufacturing problems found and solved at the design stage; fewer costly late changes; better quality and lower cost. ✘ Needs excellent communication and data management; more people involved early; a late design change affects everyone.</p>` },
 { sort: { h: 'PDM or ERP?', q: 'Which system handles each task?', cats: ['PDM', 'ERP'], items: [['Storing the latest version of a CAD model', 0], ['Raising a purchase order when stock falls low', 1], ['Controlling who can change a drawing', 0], ['Linking a sales order to production planning and invoicing', 1], ['Keeping the bill of materials for a product', 0], ['Showing managers real-time stock and finance figures', 1]] } },
 { match: { q: 'Match each approach to its main aim.', lh: 'Approach', rh: 'Main aim', pairs: [['Quick response manufacturing', 'Cut lead times throughout the business'], ['Concurrent manufacturing', 'Overlap design and production planning to reach the market sooner'], ['Standardised parts', 'Use interchangeable components made to agreed sizes'], ['Lean manufacturing', 'Eliminate waste'], ['Total Quality Management', 'Make everyone responsible for quality']] } },
 { mcq: [
  ['Why might a designer specify a bought-in electric motor rather than designing one?', ['To make the product unique', 'A specialist supplier makes it cheaper, to a known quality, with no development cost', 'Bought-in parts are always smaller', 'To avoid using standards'], 1, 'Development time and tooling are saved.'],
  ['In concurrent manufacturing, when do production engineers get involved?', ['After the design is finished', 'From the start, alongside the designers', 'Only when faults appear', 'After the product is launched'], 1, 'So the design can be manufactured without late changes.'],
  ['How does QRM use sales data?', ['It ignores it', 'It is shared electronically so production follows what is actually selling', 'It is posted monthly', 'It sets workers’ pay'], 1, 'Fast information is needed for fast response.'],
 ] },
 { exam: [
  ['**Give** two benefits, other than cost, of using bought-in components.', 2, ['Any two: no need to design/make them; saves development time; known quality/specification; readily available; easy replacement for repair (1)(1)']],
  ['**Explain** how concurrent manufacturing reduces the time to market.', 2, ['Design, tooling and production planning run at the same time, not one after another (1)', 'so stages overlap, problems are found earlier and the product launches sooner (1)']],
  ['**Explain** two benefits to a manufacturer of using an enterprise resource planning system.', 6, ['All departments share one set of real-time data (1), so a sales order automatically updates stock, purchasing and the production schedule (1), reducing delays, errors and duplicated work (1)', 'Managers can see stock levels, costs and progress instantly (1), so decisions are based on accurate information (1), which supports JIT and reduces money tied up in stock (1)']],
 ] },
]},

{ t: 'Mixed exam practice', spec: '8.1–8.3', blocks: [
 { tip: 'Spec 8.3 stresses <b>accuracy of production</b> and <b>efficiency</b> when <b>designing for manufacture</b> at small, medium and large scale. In longer answers, link each system to one of those: does it make production more <b>accurate</b>, more <b>efficient</b>, or both, and at what <b>scale</b> is it worth the investment?' },
 { calc: [
  ['A line runs for 7.5 hours a day and must produce 900 units a day. How many seconds are available to make each unit (the takt time)?', 30, 0.01, 'seconds', '7.5 h = 27,000 s. 27,000 ÷ 900 = 30 seconds per unit.'],
  ['A changeover between batches takes 45 minutes. A factory makes 4 changeovers a day. How many hours of production are lost each 5-day week?', 15, 0.001, 'hours', '45 × 4 × 5 = 900 minutes = 15 hours.'],
 ] },
 { exam: [
  ['**State** two characteristics of batch production.', 2, ['Any two: set quantity made together; jigs/moulds/templates used; machines reset between batches; flexible to demand; stock stored (1)(1)']],
  ['**Explain** three ways in which a manufacturer of kitchen appliances could use modern manufacturing systems to improve efficiency.', 9, ['JIT delivery of components (1), so little stock is held (1), reducing storage cost and money tied up (1)', 'Robots on the assembly line (1), which work continuously with consistent accuracy (1), raising output and reducing defects (1)', 'An ERP system (1) links orders, stock and scheduling (1), so production follows demand without delays (1)', 'Accept FMS, cell production, AGVs/ASRS, standardised parts, concurrent manufacturing, each with two linked justifications']],
  ['A company that makes office chairs in batches is considering investing in a fully automated, robotic production line. **Evaluate** this proposal.', 12, ['Benefits: higher output, 24-hour running, consistent accuracy and quality, lower labour cost per chair, safer for heavy or repetitive tasks', 'Costs and risks: very high investment in robots, tooling, programming and maintenance; skilled technicians; breakdowns stop everything; redundancies and retraining', 'Flexibility: a dedicated line suits steady high demand for few models; batch production copes better with many variants and changing fashion; FMS or cells as a middle route', 'Depends on sales forecast, product range, payback period and competitors', 'A reasoned overall judgement'],],
 ] },
 { nea: 'If your NEA product went into production, which scale would suit it and why? Name two quality control checks you would build in, with the tolerance for one critical dimension, and one standard or bought-in component you have used. This makes a strong “design for manufacture” paragraph.' },
]},

]});
