/* Topic 12: Further processes and techniques (Edexcel 9DT0 12.1–12.3). The critical path workbook (12.2a in depth) is a separate page, listed by 12-critical-path.js */
BOOKLETS.push({ id: 't12', topic: 12, title: 'Further processes and techniques', short: 'Booklet', pages: [

{ t: 'Overview and key words', blocks: [
 { notes: `<p class="lead">Topic 12 covers the <b>strategies</b> designers and companies use: ways of approaching design (12.1), ways of managing projects (12.2), and how a product’s costs, sales and profits change over its <b>life cycle</b> (12.3).</p>
 <table><tr><th>Page</th><th>Spec</th><th>Covers</th></tr>
 <tr><td>2</td><td>12.1a</td><td>User-centred design: framework, problem solving, user needs, limitations</td></tr>
 <tr><td>3</td><td>12.1b</td><td>Circular economy</td></tr>
 <tr><td>4</td><td>12.1c</td><td>Systems thinking</td></tr>
 <tr><td>5</td><td>12.2a</td><td>Critical path analysis (summary; full workbook on the Home page)</td></tr>
 <tr><td>6</td><td>12.2b</td><td>Scrum</td></tr>
 <tr><td>7</td><td>12.2c</td><td>Six Sigma</td></tr>
 <tr><td>8</td><td>12.3</td><td>The product life cycle: introduction, growth, maturity, decline</td></tr>
 <tr><td>9</td><td>12</td><td>Mixed exam practice</td></tr></table>` },
 { keys: [
  ['User-centred design', 'A design approach in which users’ needs are researched, designed for and tested at every stage'],
  ['Iteration', 'Repeating a cycle of design, test and improve'],
  ['Circular economy', 'A system in which products and materials are kept in use and waste and pollution are designed out'],
  ['Linear economy', 'Take, make, use, dispose'],
  ['Systems thinking', 'Looking at how all the parts of a system affect each other, rather than at one part in isolation'],
  ['Critical path', 'The longest sequence of dependent activities, which sets the shortest time a project can take'],
  ['Scrum', 'A flexible way of managing a project in short, repeated cycles called sprints'],
  ['Sprint', 'A fixed period, usually one to four weeks, in which a scrum team completes a set of tasks'],
  ['Six Sigma', 'A data-driven method for improving the quality of a process by finding and removing the causes of defects'],
  ['DMAIC', 'Define, Measure, Analyse, Improve, Control: the Six Sigma improvement cycle'],
  ['Product life cycle', 'The stages a product passes through in the market: introduction, growth, maturity, decline'],
  ['Extension strategy', 'An action taken to lengthen the maturity stage and delay decline'],
 ] },
]},

{ t: 'User-centred design', spec: '12.1a', blocks: [
 { notes: `<p>Topic 5 looked at <b>why</b> user-centred design (UCD) matters. Here the spec asks for it as a <b>strategy</b>: the framework process, problem solving, user needs, wants and values, and its limitations.</p>
 <h4>The framework process</h4>
 <p>UCD is an <b>iterative</b> cycle, set out in the international standard ISO 9241-210:</p>
 <ol><li><b>Understand the context of use:</b> who the users are, what they are trying to do, and where (research: observation, interviews, personas).</li>
 <li><b>Specify the user requirements:</b> turn the research into clear needs the design must meet.</li>
 <li><b>Produce design solutions:</b> sketches, models and prototypes, from rough to refined.</li>
 <li><b>Evaluate against the requirements:</b> test with real users.</li>
 <li><b>Iterate:</b> go back and improve until the requirements are met.</li></ol>
 <h4>Problem solving</h4>
 <ul><li>Start from the user’s <b>problem</b>, not from a product: “people struggle to open jars” rather than “design a jar opener”.</li>
 <li>Empathy tools: user journeys, task analysis, simulation (e.g. gloves and glasses that mimic reduced grip or sight).</li>
 <li>Generate many ideas, prototype quickly and cheaply, test, learn and repeat.</li>
 <li><b>Co-design:</b> users take part in generating and choosing ideas.</li></ul>
 <h4>User needs, wants and values</h4>
 <p><b>Needs</b> are essential; <b>wants</b> are desirable; <b>values</b> are the beliefs that shape what users will accept and buy (sustainability, ethics, culture, cost, brand). A strategy that only meets needs produces a product that works but nobody chooses.</p>
 <h4>Limitations of end-user consideration</h4>
 <ul><li><b>Time and cost:</b> research, prototypes and repeated testing lengthen development.</li>
 <li><b>Users cannot always say what they want</b>, or imagine something radically new; relying only on users tends to give small improvements, not breakthroughs.</li>
 <li><b>Small or unrepresentative samples</b> give misleading results; what people say and what they do differ.</li>
 <li><b>Conflicting needs</b> between different users; designing for a narrow group can exclude others.</li>
 <li>Users’ wishes may conflict with <b>cost, manufacture, safety, legislation or sustainability</b>, and with the needs of other stakeholders (client, manufacturer, retailer).</li>
 <li>Too much feedback can lead to compromise designs and “feature creep”.</li></ul>` },
 { order: { q: 'Put the stages of the user-centred design framework in order.', steps: ['Understand the context of use: who, what, where', 'Specify the user requirements', 'Produce design solutions and prototypes', 'Evaluate the designs with users against the requirements', 'Iterate: improve and test again'] } },
 { sort: { h: 'Strength or limitation?', q: 'Is each a strength or a limitation of user-centred design?', cats: ['Strength', 'Limitation'], items: [['Problems are found early through user testing', 0], ['Research and testing add time and cost', 1], ['The product is more likely to meet real needs', 0], ['Users may not be able to imagine a radically new product', 1], ['Different users may want conflicting things', 1], ['Products are easier and safer to use', 0], ['A small sample may not represent the whole market', 1]] } },
 { mcq: [
  ['Why is user-centred design described as iterative?', ['It is done once at the start', 'The cycle of designing, testing with users and improving is repeated', 'It ignores feedback', 'It uses only computers'], 1, 'Each loop brings the design closer to the requirements.'],
  ['Which is a limitation of relying only on what users ask for?', ['Products become easier to use', 'It tends to produce small improvements rather than radical innovations', 'It reduces testing', 'It removes the need for a specification'], 1, 'Users describe what they know.'],
 ] },
 { exam: [
  ['**Outline** the framework process of user-centred design.', 4, ['Research and understand the users and the context of use (1)', 'Specify the user requirements (1)', 'Produce design solutions/prototypes (1)', 'Evaluate with users against the requirements and iterate (1)']],
  ['**Explain** two limitations of user-centred design as a design strategy.', 6, ['Research, prototyping and repeated user testing are needed (1), which lengthen development (1), increasing cost and delaying the launch (1)', 'Users can only comment on what they know (1), so feedback tends to suggest small improvements (1), which may hold back radical innovation (1)', 'Accept conflicting needs or unrepresentative samples with two linked justifications']],
 ] },
]},

{ t: 'Circular economy', spec: '12.1b', blocks: [
 { notes: `<p>The spec asks for the circular economy as <b>biologically-based systems</b> and an understanding of how <b>waste and pollution can be eliminated</b>.</p>
 <h4>Linear versus circular</h4>
 <p>The <b>linear</b> economy: <b>take → make → use → dispose</b>. It depends on a constant supply of finite resources and creates waste at every stage. The <b>circular</b> economy copies <b>living systems</b>, where there is no waste: one organism’s waste is another’s food, and everything is powered by the sun.</p>
 <h4>Three principles</h4>
 <ol><li><b>Eliminate waste and pollution</b>, by design. Waste is treated as a design fault.</li>
 <li><b>Circulate products and materials</b> at their highest value: keep them in use.</li>
 <li><b>Regenerate nature</b>: return nutrients to the soil; use renewable energy.</li></ol>
 <h4>Two cycles</h4>
 <table><tr><th></th><th>Biological cycle</th><th>Technical cycle</th></tr>
 <tr><td><b>Materials</b></td><td>Biodegradable, non-toxic materials: wood, cotton, wool, paper, food, bio-based polymers</td><td>Materials that do not biodegrade: metals, polymers, glass, electronics</td></tr>
 <tr><td><b>What happens</b></td><td>Used (consumed), then returned safely to the earth by composting or anaerobic digestion, feeding new growth</td><td>Kept in use in loops, the tighter the better: <b>maintain</b> and share → <b>reuse</b> and redistribute → <b>refurbish</b> and <b>remanufacture</b> → <b>recycle</b> as the last loop</td></tr>
 <tr><td><b>Design rule</b></td><td>No toxic dyes, coatings or mixtures that stop safe composting</td><td>Durable, repairable, modular, easy to disassemble; pure, separable materials</td></tr></table>
 <h4>How designers and companies apply it</h4>
 <ul><li><b>Design for durability, repair, upgrade and disassembly</b> (Topic 9).</li>
 <li><b>Product as a service:</b> the customer pays for use, not ownership (leased lighting, washing machines, jeans, tool libraries, bike-share), so the maker keeps the materials and has a reason to make products last.</li>
 <li><b>Take-back and remanufacture:</b> used products are returned, rebuilt to as-new standard and resold (engines, photocopiers, phones).</li>
 <li><b>Industrial symbiosis:</b> one factory’s waste heat or by-product becomes another’s resource.</li>
 <li><b>Cradle to cradle</b> design (McDonough and Braungart): every material is a “nutrient” for another cycle.</li></ul>
 <table><tr><th>Advantages</th><th>Disadvantages and barriers</th></tr>
 <tr><td>Less demand for finite resources; less waste and pollution; lower emissions</td><td>Products must be redesigned; collection and reverse logistics are costly to set up</td></tr>
 <tr><td>Protects companies from rising material prices and shortages; new income from services and refurbishment</td><td>Consumers may prefer to own new products; leasing does not suit everything</td></tr>
 <tr><td>Closer relationship with customers; jobs in repair and remanufacture</td><td>Many existing products mix materials that cannot be separated; recycling often downgrades quality</td></tr></table>` },
 { sort: { h: 'Biological or technical cycle?', q: 'Which cycle does each material belong to?', cats: ['Biological cycle', 'Technical cycle'], items: [['Untreated cotton', 0], ['Aluminium', 1], ['Food waste', 0], ['Glass', 1], ['Wood shavings', 0], ['ABS casing', 1], ['Copper wire', 1], ['Paper pulp packaging', 0]] } },
 { order: { h: 'Technical loops', q: 'Put the technical-cycle loops in order, the most valuable (tightest) first.', steps: ['Maintain and prolong the product’s life', 'Reuse or redistribute it to another user', 'Refurbish or remanufacture it', 'Recycle the materials'] } },
 { mcq: [
  ['How does a circular economy treat waste?', ['As unavoidable', 'As a design fault to be eliminated', 'As a source of landfill income', 'As the consumer’s responsibility only'], 1, 'Waste and pollution are designed out from the start.'],
  ['Why does “product as a service” encourage durable design?', ['Customers pay more for weak products', 'The manufacturer keeps ownership, so longer-lasting, repairable products earn it more', 'It is required by law', 'Products are thrown away sooner'], 1, 'The incentive shifts from selling more to lasting longer.'],
  ['In the biological cycle, what must a designer avoid?', ['Natural fibres', 'Toxic finishes and mixed materials that prevent safe composting', 'Renewable energy', 'Biodegradable materials'], 1, 'The material must return safely to the soil.'],
 ] },
 { exam: [
  ['**Explain** how a circular economy differs from a linear economy.', 3, ['Linear: take, make, use, throw away (1)', 'Circular: materials kept in use through reuse, repair, remanufacture and recycling (1)', 'Waste and pollution are designed out; biological materials return safely to nature (1)']],
  ['**Explain** two ways a manufacturer of office chairs could apply the principles of a circular economy.', 6, ['Design the chair in modules with mechanical fixings (1), so worn parts such as castors and fabric can be replaced (1), keeping the chair in use for longer (1)', 'Lease chairs or offer a take-back scheme (1), so used chairs are returned and remanufactured (1), keeping the materials in the technical cycle instead of landfill (1)']],
  ['**Discuss** the barriers to adopting a circular economy for a manufacturer of consumer electronics.', 6, ['Products use many bonded, mixed and hazardous materials that are hard to separate', 'Cost of redesign for repair and disassembly, and of collection and reverse logistics', 'Fast technological change and consumer desire for new models; business models built on replacement sales', 'Global supply chains; quality of recycled materials', 'Drivers that help: right-to-repair laws, material costs, brand reputation'],],
 ] },
]},

{ t: 'Systems thinking', spec: '12.1c', blocks: [
 { notes: `<p>The spec: “the influence of systems on commercial activity to enable <b>all elements of a manufacturing enterprise to work together</b>”.</p>
 <h4>What it is</h4>
 <p>A <b>system</b> is a set of connected parts working towards a purpose, with <b>inputs</b>, <b>processes</b>, <b>outputs</b> and <b>feedback</b>. <b>Systems thinking</b> means looking at the <b>whole</b> and at how the parts affect each other, rather than improving one part on its own. A change in one place has consequences elsewhere.</p>
 <h4>A manufacturing enterprise as a system</h4>
 <p>Marketing, design, purchasing, production, quality, logistics, sales, finance, human resources and after-sales service are sub-systems. Outside the company, suppliers, retailers, customers and regulators are part of the wider system.</p>
 <table><tr><th>Decision made in isolation</th><th>Effect elsewhere in the system</th></tr>
 <tr><td>Purchasing buys a cheaper component</td><td>More rejects in production; more warranty returns; damage to the brand</td></tr>
 <tr><td>Design adds a new feature late</td><td>Tooling changes; launch delayed; marketing campaign mistimed</td></tr>
 <tr><td>Sales runs a big promotion</td><td>Production cannot keep up; suppliers run out; customers wait</td></tr>
 <tr><td>Production makes large batches to cut unit cost</td><td>Warehouses fill; cash is tied up; unsold stock is scrapped</td></tr></table>
 <h4>How enterprises make the elements work together</h4>
 <ul><li><b>Shared information:</b> ERP and PDM systems give every department the same real-time data (Topic 8).</li>
 <li><b>Cross-functional teams</b> and concurrent manufacturing: designers, engineers, production and marketing plan together.</li>
 <li><b>Feedback loops:</b> quality data, sales figures and customer comments flow back to design and production.</li>
 <li><b>Whole-system methods:</b> lean manufacturing, JIT and TQM only work when every department and supplier takes part.</li>
 <li>Mapping tools: flow charts, system diagrams, value-stream maps.</li></ul>
 <table><tr><th>Advantages</th><th>Disadvantages</th></tr>
 <tr><td>Fewer unintended consequences; problems solved at their cause</td><td>Complex and time-consuming to analyse; needs good data</td></tr>
 <tr><td>Less waste and duplication; smoother flow; faster response to customers</td><td>Needs investment in IT and training, and a culture of sharing between departments</td></tr>
 <tr><td>Better products: easier to make, sell, service and recycle</td><td>Decisions can be slower when everyone is consulted</td></tr></table>
 <p>Systems thinking also applies to <b>products</b>: a phone is part of a system of chargers, networks, apps, repair services and recycling.</p>` },
 { match: { q: 'Match each part of a system to an example from a bicycle factory.', lh: 'Part of the system', rh: 'Example', pairs: [['Input', 'Steel tube, components, energy and labour'], ['Process', 'Cutting, welding, painting and assembly'], ['Output', 'Finished bicycles, plus waste and emissions'], ['Feedback', 'Warranty data showing which welds fail']] } },
 { mcq: [
  ['Which statement best describes systems thinking?', ['Improving one department at a time', 'Considering how all the parts of an enterprise affect one another', 'Using robots for every task', 'Designing electronic systems only'], 1, 'The whole is considered, not just the part.'],
  ['A purchasing manager saves money with a cheaper bearing, and warranty claims rise. What does this show?', ['Purchasing should be closed', 'A decision that looks good for one part can harm the system as a whole', 'Bearings are unimportant', 'Warranties should be shortened'], 1, 'Systems thinking would have considered quality and after-sales costs.'],
  ['What is the role of feedback in a system?', ['To slow it down', 'Information about the output is used to adjust the inputs and processes', 'To increase waste', 'To replace managers'], 1, 'For example, quality data fed back to design.'],
 ] },
 { exam: [
  ['**Explain** what is meant by systems thinking in a manufacturing enterprise.', 3, ['The enterprise is seen as a whole made of connected parts (design, production, purchasing, sales, etc.) (1)', 'so the effect of a decision in one area on all the others is considered (1)', 'allowing all elements to work together efficiently towards the same goal (1)']],
  ['**Explain** two ways a company can make sure that its departments work together as a system.', 6, ['Use an integrated data system such as ERP (1), so all departments see the same live orders, stock and schedules (1), and their decisions are coordinated (1)', 'Set up cross-functional project teams (1), so designers, production engineers and marketing plan a product together (1), avoiding late changes and delays (1)']],
 ] },
]},

{ t: 'Critical path analysis (summary)', spec: '12.2a', blocks: [
 { notes: `<p>The spec: critical path analysis (CPA) is for “the handling of <b>complex and time-sensitive</b> operations”. The full workbook, with networks to complete and a planner for your own NEA, is on the Home page under Topic 12.</p>
 <h4>The process</h4>
 <ol><li><b>List all the activities</b> in the project (a work breakdown).</li>
 <li>Estimate the <b>duration</b> of each activity.</li>
 <li>Work out the <b>dependencies</b>: which activities must finish before others can start, and which can run at the same time (in parallel).</li>
 <li>Draw the <b>network diagram</b> of nodes and arrows; identify <b>milestones</b>.</li>
 <li><b>Forward pass:</b> find the earliest start time (EST) at each node.</li>
 <li><b>Backward pass:</b> find the latest finish time (LFT) at each node.</li>
 <li>Identify the <b>critical path</b>: the longest route through the network, where there is no spare time. It gives the <b>minimum project duration</b>.</li>
 <li>Calculate <b>float</b> for non-critical activities: float = LFT − EST − duration.</li></ol>
 <table><tr><th>Advantages</th><th>Disadvantages</th></tr>
 <tr><td>Shows the shortest time the project can take, and a realistic completion date</td><td>Depends on accurate estimates of durations</td></tr>
 <tr><td>Identifies the critical activities, so resources can be focused on them</td><td>Complex networks are hard to draw and read without software</td></tr>
 <tr><td>Shows which activities can run in parallel and where there is float</td><td>Must be updated whenever anything changes</td></tr>
 <tr><td>Supports JIT ordering and monitoring of progress</td><td>Does not show resources or guarantee quality</td></tr></table>` },
 { order: { q: 'Put the stages of critical path analysis in order.', steps: ['List all the activities', 'Estimate the duration of each activity', 'Work out which activities depend on others', 'Draw the network and do the forward pass (EST)', 'Do the backward pass (LFT)', 'Identify the critical path and calculate float'] } },
 { calc: [
  ['An activity lasts 4 days. Its start node has EST 6 and its end node has LFT 15. What is its float?', 5, 0, 'days', 'Float = LFT − EST − duration = 15 − 6 − 4 = 5 days.'],
  ['The critical activities in a project last 3, 5, 2 and 6 days. What is the minimum project duration?', 16, 0, 'days', '3 + 5 + 2 + 6 = 16 days.'],
  ['A critical activity is delayed by 2 days on a 16-day project. What is the new project duration?', 18, 0, 'days', 'Critical activities have no float, so the whole project is 2 days late: 18 days.'],
 ] },
 { tf: [
  ['The critical path is the shortest route through the network.', false, 'It is the longest route, which sets the minimum project time.'],
  ['Activities on the critical path have zero float.', true, 'Any delay to them delays the whole project.'],
  ['CPA shows which activities can be carried out at the same time.', true, 'Parallel activities shorten the project.'],
 ] },
 { exam: [
  ['**Outline** the process of critical path analysis.', 4, ['List all the activities needed (1)', 'Estimate the duration of each (1)', 'Determine the dependencies/links between activities (1)', 'Identify milestones / draw the network and find the longest (critical) path (1)']],
  ['**Explain** one benefit to a manufacturer of using critical path analysis when launching a new product.', 3, ['It identifies the activities that cannot be delayed (1), so managers can concentrate staff and resources on them (1), making it more likely that the product reaches the market on the planned date (1)']],
 ] },
]},

{ t: 'Scrum', spec: '12.2b', blocks: [
 { notes: `<p>The spec: scrum is “how <b>flexible, holistic product development</b> is achieved”. It is an <b>agile</b> method. The idea came from a 1986 study of how manufacturers developed new products; it was then formalised for software and is now widely used for physical products too. Instead of planning everything at the start, the team works in short cycles and adapts as it learns.</p>
 <h4>The team</h4>
 <table><tr><th>Role</th><th>Responsibility</th></tr>
 <tr><td><b>Product owner</b></td><td>Represents the customer and the business; decides what is most valuable; manages and prioritises the product backlog</td></tr>
 <tr><td><b>Scrum master</b></td><td>Coaches the team in the scrum process; removes obstacles; protects the team from interruptions. Not a traditional boss</td></tr>
 <tr><td><b>Development team</b></td><td>A small (typically under ten), <b>cross-functional, self-organising</b> group, e.g. designers, engineers, marketing, production, who do the work and decide how</td></tr></table>
 <h4>The process</h4>
 <ol><li><b>Product backlog:</b> a prioritised list of everything the product needs (features, tasks, fixes).</li>
 <li><b>Sprint planning:</b> the team chooses the items it can complete in the next sprint: the <b>sprint backlog</b>.</li>
 <li><b>Sprint:</b> a fixed period of <b>one to four weeks</b> of focused work.</li>
 <li><b>Daily scrum:</b> a short stand-up meeting (about 15 minutes): what did I do, what will I do, what is in my way?</li>
 <li><b>Sprint review:</b> the team shows the working result (an <b>increment</b>, such as a tested prototype) to the product owner and stakeholders for feedback.</li>
 <li><b>Sprint retrospective:</b> the team reflects on how it worked and how to improve.</li>
 <li>The backlog is updated and the next sprint begins.</li></ol>
 <h4>Why “flexible” and “holistic”?</h4>
 <ul><li><b>Flexible:</b> priorities are reviewed every sprint, so the team can respond to feedback, new technology or changes in the market.</li>
 <li><b>Holistic:</b> one multi-skilled team takes the whole product forward together, like a rugby scrum moving the ball as a unit, instead of passing it from department to department.</li></ul>
 <table><tr><th>Advantages</th><th>Disadvantages</th></tr>
 <tr><td>Adapts quickly to change and feedback</td><td>Hard to predict the final cost and completion date</td></tr>
 <tr><td>Working results early and often; problems found early</td><td>Needs an experienced, committed, self-disciplined team</td></tr>
 <tr><td>Customer involved throughout; better fit to needs</td><td>Scope can grow if the backlog is not controlled (“scope creep”)</td></tr>
 <tr><td>Motivated teams; daily communication</td><td>Less suited to large teams or to projects with fixed sequences and long lead times, such as tooling and construction</td></tr></table>
 <h4>Scrum or critical path analysis?</h4>
 <p><b>CPA</b> suits projects where the tasks, their order and their durations are known in advance. <b>Scrum</b> suits development work where the requirements are uncertain and are discovered along the way.</p>` },
 { match: { q: 'Match the scrum term to its meaning.', lh: 'Term', rh: 'Meaning', pairs: [['Product backlog', 'Prioritised list of everything the product needs'], ['Sprint', 'Fixed period of one to four weeks of focused work'], ['Daily scrum', 'Short stand-up meeting to coordinate the day'], ['Sprint review', 'The result is shown to stakeholders for feedback'], ['Sprint retrospective', 'The team reflects on how to improve its way of working'], ['Product owner', 'Represents the customer and sets priorities'], ['Scrum master', 'Coaches the team and removes obstacles']] } },
 { order: { q: 'Put the events of one scrum cycle in order.', steps: ['Product owner prioritises the product backlog', 'Sprint planning: the team selects the sprint backlog', 'The sprint: work with a daily scrum each day', 'Sprint review with stakeholders', 'Sprint retrospective'] } },
 { sort: { h: 'Scrum or CPA?', q: 'Which project management strategy suits each project better?', cats: ['Scrum', 'Critical path analysis'], items: [['Developing the app and interface for a smart thermostat, with requirements still changing', 0], ['Installing a new production line with fixed, known stages', 1], ['Building a factory extension', 1], ['Exploring concepts for a new wearable with frequent user testing', 0], ['Coordinating tooling, packaging and shipping for a trade-show launch', 1]] } },
 { exam: [
  ['**Explain** two characteristics of scrum as a project management strategy.', 6, ['Work is done in short, fixed sprints of one to four weeks (1), each producing a working result that is reviewed (1), so feedback is acted on quickly and priorities can change (1)', 'A small cross-functional, self-organising team develops the whole product together (1), meeting daily to coordinate (1), so problems are solved quickly without waiting for other departments (1)']],
  ['**Discuss** the suitability of scrum for a company developing a new electric scooter.', 6, ['Suits uncertain, evolving requirements: user feedback on prototypes each sprint; software and electronics change quickly', 'Cross-functional team integrates styling, mechanics, electronics and marketing', 'Hardware constraints: tooling lead times, safety testing and certification need fixed long-term planning', 'Harder to forecast cost and launch date; needs an experienced team', 'A hybrid is likely: scrum for concept and software, CPA for tooling and launch'],],
 ] },
]},

{ t: 'Six Sigma', spec: '12.2c', blocks: [
 { notes: `<p>The spec: Six Sigma is “the improvement of <b>output quality of a process</b> by <b>identifying and removing the causes of defects</b>” and setting value targets.</p>
 <h4>What it is</h4>
 <ul><li>A <b>data-driven</b> improvement method, developed at Motorola in the 1980s and made famous by General Electric.</li>
 <li>Sigma (σ) is the statistical symbol for <b>standard deviation</b>, a measure of variation. The less a process varies, the fewer products fall outside the tolerance.</li>
 <li>A process working at “six sigma” produces no more than <b>3.4 defects per million opportunities</b>: 99.99966% right.</li>
 <li>It attacks <b>variation</b> in the process, rather than inspecting out bad products afterwards.</li></ul>
 <h4>DMAIC: the improvement cycle</h4>
 <table><tr><th>Stage</th><th>What happens</th></tr>
 <tr><td><b>D</b>efine</td><td>The problem, the customer’s requirements and the project goals</td></tr>
 <tr><td><b>M</b>easure</td><td>Collect data on how the process performs now</td></tr>
 <tr><td><b>A</b>nalyse</td><td>Find the root causes of defects and variation</td></tr>
 <tr><td><b>I</b>mprove</td><td>Develop, test and implement solutions</td></tr>
 <tr><td><b>C</b>ontrol</td><td>Monitor the improved process so the gains are kept</td></tr></table>
 <p>Projects are led by trained specialists ranked like martial arts: <b>Green Belts</b>, <b>Black Belts</b> and <b>Master Black Belts</b>.</p>
 <h4>The value targets in the specification</h4>
 <table><tr><th>Target</th><th>How removing defects achieves it</th></tr>
 <tr><td><b>Reduce process cycle time</b></td><td>No stoppages, rework or re-inspection, so products flow through faster</td></tr>
 <tr><td><b>Reduce pollution</b></td><td>Less scrap, wasted material and wasted energy; fewer emissions from remaking parts</td></tr>
 <tr><td><b>Reduce costs</b></td><td>Less scrap, rework, warranty claims and inspection</td></tr>
 <tr><td><b>Increase customer satisfaction</b></td><td>Products are consistent and reliable, delivered on time</td></tr>
 <tr><td><b>Increase profits</b></td><td>Lower costs and more repeat sales</td></tr></table>
 <table><tr><th>Advantages</th><th>Disadvantages</th></tr>
 <tr><td>Decisions based on measured data, not opinion</td><td>Training Belts and collecting data is expensive and slow</td></tr>
 <tr><td>Large, lasting reductions in defects and cost</td><td>Can become bureaucratic; heavy on statistics</td></tr>
 <tr><td>Clear structure and measurable targets</td><td>Focus on reducing variation can discourage creativity and risk-taking</td></tr>
 <tr><td>Improves reputation and customer loyalty</td><td>Less benefit for small firms or low-volume, one-off work</td></tr></table>
 <p><b>Lean Six Sigma</b> combines lean’s removal of waste with Six Sigma’s removal of variation.</p>` },
 { order: { q: 'Put the DMAIC stages in order.', steps: ['Define the problem and the goal', 'Measure current performance', 'Analyse the data to find root causes', 'Improve the process', 'Control the process to keep the gains'] } },
 { calc: [
  ['A process makes 250,000 parts with 40 defects. How many defects is that per million parts?', 160, 0, 'per million', '40 ÷ 250,000 × 1,000,000 = 160 defects per million.'],
  ['After a Six Sigma project the defect rate falls from 2.5% to 0.5%. On a run of 80,000 parts, how many fewer defective parts are made?', 1600, 0, 'parts', '2.5% of 80,000 = 2,000; 0.5% of 80,000 = 400; 2,000 − 400 = 1,600 fewer.'],
  ['Each defective part costs €3.50 to scrap. How much does that reduction of 1,600 parts save?', 5600, 0.01, '€', '1,600 × 3.50 = €5,600.'],
 ] },
 { sort: { h: 'Spec value targets', q: 'Is each one of the Six Sigma value targets named in the specification?', cats: ['Yes', 'No'], items: [['Reduce process cycle time', 0], ['Reduce pollution', 0], ['Increase the number of employees', 1], ['Reduce costs', 0], ['Increase customer satisfaction', 0], ['Increase the range of products', 1], ['Increase profits', 0]] } },
 { mcq: [
  ['What does Six Sigma mainly try to reduce?', ['The number of employees', 'Variation in a process, and so the number of defects', 'The price of materials', 'The size of the factory'], 1, 'Less variation means fewer parts outside tolerance.'],
  ['A “six sigma” process produces at most…', ['3.4 defects per hundred', '3.4 defects per thousand', '3.4 defects per million opportunities', 'zero defects ever'], 2, '99.99966% defect-free.'],
 ] },
 { exam: [
  ['**Explain** how Six Sigma benefits a manufacturer.', 2, ['Uses data to reduce defects and variation (1)', 'so less waste and fewer returns, lowering costs and raising customer satisfaction and profit (1)']],
  ['**Explain** three value targets that a manufacturer could set when introducing Six Sigma.', 9, ['Reduce process cycle time (1): removing the causes of defects means less rework and fewer stoppages (1), so products are completed and delivered sooner (1)', 'Reduce costs (1): fewer rejects means less scrap material and wasted labour (1), so the cost of making each product falls (1)', 'Increase customer satisfaction (1): products are more consistent and reliable (1), leading to fewer complaints and more repeat orders (1)', 'Accept reduce pollution or increase profits with two linked justifications']],
 ] },
]},

{ t: 'The product life cycle', spec: '12.3', blocks: [
 { notes: `<p>The spec: the <b>cost, sales, profit and market implications</b>, for the designer and the manufacturer, of the four stages. (Do not confuse this <b>marketing</b> life cycle with the environmental life cycle assessment in Topic 9.)</p>
 <table><tr><th></th><th>Introduction</th><th>Growth</th><th>Maturity</th><th>Decline</th></tr>
 <tr><td><b>Sales</b></td><td>Low; slow to rise</td><td>Rising rapidly</td><td>Peak, then level off</td><td>Falling</td></tr>
 <tr><td><b>Costs</b></td><td>Very high: development, tooling and launch marketing to recover; high unit cost at low volume</td><td>Unit cost falls with economies of scale; still investing in capacity and promotion</td><td>Lowest unit cost; costs shift to defending market share</td><td>Spending cut; unit cost may rise as volume falls</td></tr>
 <tr><td><b>Profit</b></td><td>Usually a <b>loss</b></td><td>Profits begin and rise</td><td><b>Highest</b> total profit, then squeezed by price competition</td><td>Falling; eventually a loss</td></tr>
 <tr><td><b>Market</b></td><td>Few or no competitors; buyers are “innovators” and “early adopters”; price may be high (skimming) or low to win share (penetration)</td><td>Competitors enter; market widening; brand building</td><td>Market <b>saturated</b>; many competitors; price cuts and promotions; weaker firms leave</td><td>Tastes change or new technology replaces the product; retailers stop stocking it</td></tr>
 <tr><td><b>Designer</b></td><td>Fix early faults using feedback; support the launch</td><td>Develop variants, improve design for manufacture to cut cost</td><td>Restyle and add features; begin designing the replacement</td><td>Little design input; new product should be ready</td></tr>
 <tr><td><b>Manufacturer</b></td><td>Low-volume or batch production; build awareness</td><td>Scale up production; widen distribution</td><td>Maximise efficiency; extension strategies</td><td>Reduce or stop production; sell off stock; withdraw, or serve a niche</td></tr></table>
 <h4>Extension strategies</h4>
 <p>Used during maturity to delay decline:</p>
 <ul><li><b>Restyle or redesign:</b> new colours, a “facelift”, updated packaging.</li>
 <li><b>Add features or improve performance</b>; limited and special editions.</li>
 <li><b>New markets:</b> export, or target a different group of users.</li>
 <li><b>New uses</b> for the product.</li>
 <li><b>Price cuts and promotions</b>; new advertising; bundles.</li>
 <li><b>Widen the range:</b> different sizes and versions.</li></ul>
 <h4>Why it matters</h4>
 <ul><li>Life cycles are getting <b>shorter</b>, especially in electronics and fashion, so development costs must be recovered quickly.</li>
 <li>Profits from mature products pay for the development of new ones, so companies manage a <b>portfolio</b> of products at different stages.</li>
 <li>Development work on the replacement must start well before decline.</li></ul>` },
 { order: { q: 'Put the stages of the product life cycle in order.', steps: ['Introduction', 'Growth', 'Maturity', 'Decline'] } },
 { sort: { h: 'Which stage?', q: 'Which stage of the product life cycle does each statement describe?', cats: ['Introduction', 'Growth', 'Maturity', 'Decline'], items: [['Sales are low and the product makes a loss', 0], ['Sales rise rapidly and competitors enter the market', 1], ['Sales peak and the market is saturated', 2], ['Sales fall as new technology takes over', 3], ['Heavy spending on launch advertising', 0], ['Extension strategies are used', 2], ['Production is scaled up and unit costs fall', 1], ['Stock is sold off cheaply and the product is withdrawn', 3]] } },
 { sort: { h: 'Extension strategy?', q: 'Is each a product life cycle extension strategy?', cats: ['Yes', 'No'], items: [['Launching the product in a new country', 0], ['Releasing a restyled version in new colours', 0], ['Closing the factory', 1], ['Adding new features', 0], ['Running a price promotion', 0], ['Stopping all advertising', 1]] } },
 { mcq: [
  ['Why does a product usually make a loss during the introduction stage?', ['It is sold too cheaply', 'Development, tooling and launch costs are high while sales are still low', 'It is poor quality', 'There are too many competitors'], 1, 'The investment is recovered later, in growth and maturity.'],
  ['At which stage is total profit usually highest?', ['Introduction', 'Growth', 'Maturity', 'Decline'], 2, 'Sales are at their peak and development costs have been recovered.'],
  ['Why are shortening product life cycles a challenge for manufacturers?', ['Products become too cheap to make', 'There is less time to recover development and tooling costs before sales decline', 'Customers stop buying anything', 'Tooling lasts longer'], 1, 'It pushes companies to develop faster and to share parts between models.'],
 ] },
 { exam: [
  ['**Describe** what happens to sales and profit at the maturity stage, and **explain** one action a company could take.', 4, ['Sales peak and level off (1)', 'Profit is high as development costs are paid back, but competition grows and prices may fall (1)', 'Action: restyle, add features, cut price or market to new users (1) to extend the life cycle and delay decline (1)']],
  ['**Explain** two implications for a manufacturer of the introduction stage of the product life cycle.', 6, ['Costs are very high (1), because research, development, tooling and launch marketing have been paid for (1), while low sales mean the product makes a loss at first (1)', 'Sales volumes are low and uncertain (1), so production is in small batches with a high unit cost (1), and the company must decide between a high price to recover costs or a low price to win market share (1)']],
  ['Sales of a company’s best-selling cordless vacuum cleaner have levelled off after five years. **Evaluate** the options open to the company.', 12, ['The product is at maturity: sales at peak, market saturated, competitors and price pressure', 'Extension strategies: restyle, new colours, improved battery or attachments, special editions, price promotions, new markets; relatively cheap and quick, use existing tooling, but effect is temporary', 'Develop a replacement: high cost and risk, long development, but needed to stay competitive as technology moves on; should begin before decline', 'Do nothing or withdraw: saves investment but profits will fall and customers go elsewhere', 'Funding new development from current profits; timing matters', 'A reasoned judgement, e.g. extend now while developing the successor'],],
 ] },
]},

{ t: 'Mixed exam practice', spec: '12.1–12.3', blocks: [
 { match: { q: 'Match each strategy to what it is best used for.', lh: 'Strategy', rh: 'Best used for', pairs: [['Critical path analysis', 'Planning complex, time-sensitive projects with known tasks'], ['Scrum', 'Flexible development where requirements keep changing'], ['Six Sigma', 'Reducing defects and variation in an existing process'], ['Circular economy', 'Designing out waste and keeping materials in use'], ['User-centred design', 'Making sure a product meets the needs of the people who use it'], ['Systems thinking', 'Getting all parts of an enterprise to work together']] } },
 { exam: [
  ['**State** the four stages of the product life cycle.', 2, ['Introduction, growth, maturity, decline: all four for 2 marks; two or three for 1 mark']],
  ['**Explain** one difference between scrum and critical path analysis.', 3, ['CPA plans all activities, durations and dependencies before the project starts (1), whereas scrum plans only the next short sprint and re-prioritises after each one (1), so scrum copes better with changing requirements while CPA suits projects with a fixed, known sequence (1)']],
  ['**Explain** three ways in which adopting a circular economy approach would change the way a furniture manufacturer designs its products.', 9, ['Design for disassembly using mechanical fixings (1), so parts can be separated (1) and reused, replaced or recycled at the end of life (1)', 'Choose durable, repairable, non-toxic and single materials (1), so products last longer and materials stay pure (1) and can re-enter the technical or biological cycle (1)', 'Design for a take-back or leasing model (1), with modular, refurbishable parts (1), so the company can remanufacture and resell them (1)']],
  ['A company that makes kitchen appliances wants to improve the way it develops and manufactures its products. **Evaluate** the use of scrum and Six Sigma to achieve this.', 12, ['Scrum: suits product development; flexible, user feedback every sprint, cross-functional teams, faster concepts; less predictable cost and dates; hardware and tooling constraints', 'Six Sigma: suits manufacture; data-driven reduction of defects and variation (DMAIC); meets targets on cycle time, cost, pollution, satisfaction and profit; cost of training and data collection; may limit creativity', 'They address different parts of the business and can complement each other', 'Depends on the company’s main problem: slow innovation or poor quality; size and culture of the company', 'A reasoned overall judgement'],],
 ] },
 { nea: 'Which of these strategies have you actually used in your NEA? Note how you applied user-centred design (who tested what, and what changed), and how you planned your time. If you worked in short cycles of make–test–improve, you were working in sprints.' },
]},

]});
