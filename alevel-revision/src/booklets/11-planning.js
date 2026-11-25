/* Topic 11: Information handling, modelling and forward planning (Edexcel 9DT0 11.1–11.4) */
BOOKLETS.push({ id: 't11', topic: 11, title: 'Information, modelling and forward planning', pages: [

{ t: 'Overview and key words', blocks: [
 { notes: `<p class="lead">Topic 11 is about the business side of design: finding out what the market wants, deciding whether an idea is worth making, costing and planning it, protecting it, and making sure it meets standards.</p>
 <table><tr><th>Page</th><th>Spec</th><th>Covers</th></tr>
 <tr><td>2</td><td>11.1</td><td>Market research and marketing analysis</td></tr>
 <tr><td>3</td><td>11.1</td><td>Innovation management and feasibility studies</td></tr>
 <tr><td>4</td><td>11.2</td><td>Costing, budgets and forecasts</td></tr>
 <tr><td>5</td><td>11.2</td><td>Planning production: staff, materials, scale, processes</td></tr>
 <tr><td>6</td><td>11.3</td><td>Intellectual property</td></tr>
 <tr><td>7</td><td>11.4</td><td>Standards: BSI, CEN, CE, ISO</td></tr>
 <tr><td>8</td><td>All</td><td>Mixed exam practice</td></tr></table>` },
 { keys: [
  ['Primary research', 'Information you collect first-hand, e.g. surveys, interviews, focus groups, observation'],
  ['Secondary research', 'Information others have already collected, e.g. reports, websites, sales data, books'],
  ['Target market', 'The group of people a product is aimed at'],
  ['Market segmentation', 'Dividing a market into groups by age, income, lifestyle, location, etc.'],
  ['Feasibility study', 'An investigation into whether a product can be made and sold successfully'],
  ['Fixed costs', 'Costs that do not change with the number made, e.g. rent, tooling, salaries'],
  ['Variable costs', 'Costs that rise with each unit made, e.g. materials, packaging'],
  ['Break-even point', 'The number of sales where income equals total costs: no profit, no loss'],
  ['Intellectual property', 'Creations of the mind that the law lets the owner protect, e.g. inventions, designs, brands'],
  ['Patent', 'Protects a new invention: how it works or what it does'],
  ['Kitemark', 'BSI mark showing a product has been independently tested to a British Standard'],
  ['CE marking', 'Manufacturer’s declaration that a product meets EU safety, health and environmental requirements'],
 ] },
]},

{ t: 'Market research and marketing analysis', spec: '11.1', blocks: [
 { notes: `<h4>Why research the market?</h4><p>To reduce the risk of designing something nobody wants: identify <b>needs and wants</b>, the <b>target market</b>, <b>competitors</b>, gaps in the market, acceptable <b>price</b>, and trends.</p>
 <h4>Primary research</h4>
 <table><tr><th>Method</th><th>Strength</th><th>Weakness</th></tr>
 <tr><td>Questionnaire / survey</td><td>Reaches many people cheaply; easy to analyse (quantitative)</td><td>Closed questions miss detail; people may not answer honestly</td></tr>
 <tr><td>Interview</td><td>Rich detail; can follow up answers (qualitative)</td><td>Time consuming; small sample</td></tr>
 <tr><td>Focus group</td><td>Discussion reveals opinions and ideas; test concepts</td><td>Dominant voices; small sample; expensive</td></tr>
 <tr><td>Observation / user trials</td><td>See what people actually do, not what they say</td><td>Time consuming; behaviour may change when watched</td></tr></table>
 <h4>Secondary research</h4><p>Market reports (e.g. Mintel), sales figures, government statistics, trade journals, competitor websites and reviews, patents. Quick and cheap, but may be out of date, not specific, or biased.</p>
 <h4>Quantitative and qualitative</h4><p><b>Quantitative</b> data is numbers (68% would pay over £30) and is easy to chart. <b>Qualitative</b> data is opinions and feelings (“the handle feels cheap”) and explains <i>why</i>.</p>
 <p><b>Raw data</b> is the unprocessed results (individual questionnaire answers, tally charts). <b>Analysed data</b> has been processed into totals, percentages, averages, charts and conclusions that decisions can be based on.</p>
 <h4>Marketing analysis</h4>
 <ul><li><b>Market segmentation:</b> by age, gender, income, location, lifestyle, values.</li>
 <li><b>Competitor / product analysis:</b> compare existing products on price, function, quality, aesthetics.</li>
 <li><b>Market pull</b> (consumer demand drives a new product) vs <b>technology push</b> (a new technology or material makes a new product possible).</li>
 <li><b>The 4 Ps</b> (marketing mix): Product, Price, Place, Promotion.</li>
 <li><b>SWOT</b>: strengths, weaknesses, opportunities, threats.</li></ul>` },
 { sort: { h: 'Primary or secondary?', q: 'Sort each research method.', cats: ['Primary', 'Secondary'], items: [['Interviewing gym users about water bottles', 0], ['Reading a Mintel market report', 1], ['Observing children using a playground', 0], ['Analysing a competitor’s sales figures online', 1], ['Running a focus group to test three concepts', 0], ['Reading Amazon reviews of rival products', 1], ['Posting your own questionnaire to a target group', 0]] } },
 { sort: { h: 'Quantitative or qualitative?', q: 'Sort each piece of data.', cats: ['Quantitative', 'Qualitative'], items: [['72% of users charge their phone overnight', 0], ['“The grip feels slippery when wet”', 1], ['Average price paid was £24.50', 0], ['“I’d buy it because it looks premium”', 1], ['3 out of 10 testers dropped it', 0]] } },
 { mcq: [
  ['Which is an example of technology push?', ['A new lunch box because parents asked for one', 'Products using OLED screens once the technology became available', 'A bigger handle because users complained', 'A cheaper version for students'], 1, 'The technology came first and made new products possible.'],
  ['Why might a company use a focus group rather than a questionnaire?', ['It is cheaper per person', 'Discussion gives in-depth opinions and reactions to concepts', 'It gives larger samples', 'It is quicker to analyse'], 1, 'Focus groups are qualitative and explore why people think what they do.'],
  ['A weakness of secondary research is that it…', ['is expensive', 'may be out of date or not specific to your product', 'takes a long time to collect', 'always uses small samples'], 1, 'It was collected for someone else’s purpose.'],
 ] },
 { exam: [
  ['**Explain** two benefits to a company of carrying out primary market research before developing a new product.', 4, ['Find out the specific needs/wants of the target market (1) so the product is more likely to sell (1)', 'Up-to-date and specific to the product (1) reducing the risk of costly failure (1)', 'Find an acceptable price point / gap in the market (1)(1)']],
  ['**Discuss** the use of online reviews of competitor products as a source of market research.', 6, ['For: free, quick, large volume, real users’ experiences, reveal common faults and opportunities (1–2)', 'Against: may be fake or biased, extremes over-represented, not your target market, not your product (1–2)', 'Should be combined with primary research such as user trials (1–2)']],
 ] },
]},

{ t: 'Innovation management and feasibility', spec: '11.1', blocks: [
 { notes: `<h4>Innovation management</h4><p>The way a company organises the process of turning ideas into successful products: generating ideas, choosing which to develop, allocating budget and people, managing risk, and getting to market quickly.</p>
 <ul><li><b>Research and development (R&D):</b> investing in new materials, technologies and products.</li>
 <li><b>Stage-gate process:</b> development is split into stages (idea → concept → development → testing → launch); at each gate managers decide go, kill, hold or recycle. This stops money being wasted on weak ideas.</li>
 <li><b>Incremental innovation:</b> small improvements to existing products (a new phone model). <b>Radical / disruptive innovation:</b> a completely new product or way of doing things (the first smartphone).</li>
 <li><b>Open innovation:</b> using ideas from outside the company: customers, universities, start-ups, crowdsourcing.</li>
 <li><b>Cooperation between management, designers and production engineers</b> (cross-functional teams, concurrent working), so that designs can be made, costed and resourced from the start.</li>
 <li><b>Encouraging creativity:</b> design thinking, time and budget for ideas, prototyping early and often, accepting some failure.</li></ul>
 <h4>Feasibility studies</h4><p>Before committing large amounts of money, a feasibility study asks whether the product <b>can</b> and <b>should</b> be made. One way to remember the areas is <b>TELOS</b>:</p>
 <table><tr><th>Area</th><th>Question</th></tr>
 <tr><td><b>T</b>echnical</td><td>Can it be made with available materials, technology, skills and processes?</td></tr>
 <tr><td><b>E</b>conomic</td><td>Will it make a profit? Costs, selling price, break-even, investment needed</td></tr>
 <tr><td><b>L</b>egal</td><td>Does it meet standards and regulations? Does it infringe someone else’s patent?</td></tr>
 <tr><td><b>O</b>perational</td><td>Can the company produce, distribute and support it?</td></tr>
 <tr><td><b>S</b>chedule</td><td>Can it be ready in time, e.g. for a trade show or season?</td></tr></table>
 <p>Feasibility models and prototypes (sketch models, CAD simulation, test rigs) are used to check that a concept works before full development.</p>` },
 { match: { q: 'Which feasibility question is each?', lh: 'Question', rh: 'Area', pairs: [['Can our factory injection mould a part this size?', 'Technical'], ['Will it sell enough to cover the tooling cost?', 'Economic'], ['Does a competitor already hold a patent on the mechanism?', 'Legal'], ['Will it be ready for the Christmas market?', 'Schedule'], ['Do we have the staff and distribution network to support it?', 'Operational']] } },
 { mcq: [
  ['The main purpose of a stage-gate process is to…', ['speed up manufacturing', 'decide at each stage whether a project continues, so money is not wasted on weak ideas', 'protect intellectual property', 'reduce material costs'], 1, 'Go / kill / hold / recycle decisions at each gate.'],
  ['Which is radical innovation?', ['A new colour of an existing kettle', 'The first commercially successful smartphone', 'A slightly larger battery in a phone', 'A cheaper material in an existing chair'], 1, 'It created a whole new category and changed behaviour.'],
 ] },
 { exam: [
  ['**Explain** the purpose of a feasibility study.', 2, ['Checks whether a product is technically possible and can be made and sold at a profit (1)', 'before large sums are invested, reducing risk (1)']],
  ['**Explain** two ways a company can manage innovation effectively.', 4, ['Stage-gate reviews (1) so resources only go to promising ideas (1)', 'Invest in R&D / cross-functional teams (1) so new ideas are generated and developed quickly (1)', 'Open innovation / user involvement (1) brings in outside ideas, reduces risk (1)', 'Managers, designers and production engineers working together from the start (1) so designs are manufacturable and fewer late changes are needed (1)']],
 ] },
]},

{ t: 'Costing, budgets and forecasts', spec: '11.2', blocks: [
 { notes: `<h4>Costs</h4>
 <ul><li><b>Fixed costs</b> stay the same however many are made: rent, machinery, tooling (moulds, dies), salaries, insurance, design.</li>
 <li><b>Variable costs</b> rise with each unit: materials, components, packaging, energy for production, piece-rate labour.</li>
 <li><b>Total cost</b> = fixed costs + (variable cost per unit × number made).</li>
 <li><b>Unit cost</b> = total cost ÷ number made. It falls as volume rises because fixed costs are spread over more units: <b>economies of scale</b>.</li></ul>
 <h4>Selling price</h4><p>Selling price = manufacturing cost + overheads + profit (+ retailer’s mark-up + VAT). Prices are also set by what the market will pay and competitors’ prices.</p>
 <h4>Break-even</h4>
 <p><b>Break-even point (units) = fixed costs ÷ (selling price − variable cost per unit)</b>.</p>
 <p>(Selling price − variable cost) is the <b>contribution</b> each sale makes towards fixed costs. After break-even, each sale contributes profit.</p>
 <p><b>Profit</b> = (selling price × units sold) − total cost.</p>
 <h4>Budgets and forecasts</h4>
 <ul><li>A <b>budget</b> is a plan of how much money is available and how it will be spent (development, tooling, marketing, production).</li>
 <li>A <b>sales forecast</b> predicts how many units will sell and when, from market research and past sales. It drives decisions on scale of production, materials ordering, staffing and cash flow.</li>
 <li>Forecasts can be wrong: too high leaves unsold stock and wasted money; too low means lost sales and unhappy customers.</li></ul>` },
 { sort: { h: 'Fixed or variable cost?', q: 'Sort each cost for a company making lamps.', cats: ['Fixed', 'Variable'], items: [['Factory rent', 0], ['Aluminium for each lamp shade', 1], ['Injection mould for the base', 0], ['LED module in each lamp', 1], ['Designer’s salary', 0], ['Packaging for each lamp', 1], ['Insurance', 0]] } },
 { calc: [
  ['Fixed costs are £24,000. Each product sells for £40 and has a variable cost of £16. How many must be sold to break even?', 1000, 0, 'units', '£24,000 ÷ (£40 − £16) = £24,000 ÷ £24 = 1,000 units.'],
  ['Using the same figures, what profit is made if 1,500 are sold?', 12000, 0, '£', 'Income £40 × 1,500 = £60,000. Total cost £24,000 + (£16 × 1,500) = £48,000. Profit = £12,000. (Or: 500 units past break-even × £24 contribution = £12,000.)'],
  ['A mould costs £30,000. Each part costs £0.40 in material. What is the unit cost if 50,000 parts are made?', 1, 0.001, '£', '(£30,000 + £0.40 × 50,000) ÷ 50,000 = £50,000 ÷ 50,000 = £1.00 per part.'],
  ['The same mould, but only 5,000 parts are made. What is the unit cost?', 6.4, 0.001, '£', '(£30,000 + £2,000) ÷ 5,000 = £6.40. This is why moulding only pays at high volume.'],
  ['A stool costs £18 to make. The company adds a 40% mark-up on cost. What is the selling price before VAT?', 25.2, 0.001, '£', '£18 × 1.4 = £25.20.'],
 ] },
 { mcq: [
  ['Why does unit cost fall as production volume rises?', ['Materials get cheaper every year', 'Fixed costs are spread over more units (and bulk buying lowers material cost)', 'Workers work faster', 'VAT is lower'], 1, 'Economies of scale.'],
  ['If the selling price rises and costs stay the same, the break-even point…', ['rises', 'falls', 'stays the same', 'becomes zero'], 1, 'Each sale contributes more, so fewer sales are needed.'],
  ['What is the main risk of an over-optimistic sales forecast?', ['Lost sales', 'Too much stock is made and money is tied up or wasted', 'Higher selling price', 'Patent problems'], 1, 'Unsold stock costs money to make and store.'],
 ] },
 { exam: [
  ['**Explain** the difference between fixed and variable costs. Give an example of each.', 4, ['Fixed costs do not change with output (1), e.g. rent, tooling, salaries (1)', 'Variable costs rise with each unit made (1), e.g. materials, packaging (1)']],
  ['A company has fixed costs of £45,000. The product sells for £25 and costs £10 per unit to make. **Calculate** the break-even point. Show your working.', 2, ['£25 − £10 = £15 contribution per unit (1)', '£45,000 ÷ £15 = 3,000 units (1)']],
  ['**Discuss** how a sales forecast affects the planning of a new product’s manufacture.', 6, ['Sets the scale of production, which decides processes and tooling (e.g. injection moulding only if high) (1–2)', 'Determines materials ordering, stock levels, staffing and shifts (1–2)', 'Affects cash flow and budgets, pricing and break-even timing (1)', 'Risk if wrong: overstock or shortages; need to review and adjust (1)']],
 ] },
]},

{ t: 'Planning production', spec: '11.2', blocks: [
 { notes: `<h4>Planning considerations</h4>
 <table><tr><th>Factor</th><th>What has to be planned</th></tr>
 <tr><td><b>Staff</b></td><td>How many people, what skills, training needed, shifts, whether to automate, labour cost</td></tr>
 <tr><td><b>Materials</b></td><td>Which materials and components, stock forms and sizes, suppliers and lead times, bulk purchase, minimising waste, just-in-time or stockholding</td></tr>
 <tr><td><b>Scale of production</b></td><td>One-off, batch or mass production, set by the sales forecast; this decides almost everything else</td></tr>
 <tr><td><b>Tools, machines and processes</b></td><td>Choose processes that suit the material, the scale, the accuracy and finish needed and the budget; whether to buy machines or outsource; tooling lead times</td></tr>
 <tr><td><b>Time</b></td><td>Production schedules, Gantt charts and critical path analysis to plan the order of tasks and meet deadlines</td></tr>
 <tr><td><b>Quality</b></td><td>Where quality control checks happen; tolerances; quality assurance systems</td></tr></table>
 <h4>Selecting a process: the key questions</h4>
 <ol><li>What material is it? (Injection moulding is used mainly for thermoplastics; pressure die casting is used for non-ferrous alloys.)</li>
 <li>How many? (High tooling cost only pays at high volume.)</li>
 <li>What shape and size? (Hollow → blow or rotational moulding; constant section → extrusion.)</li>
 <li>What accuracy and finish are needed?</li>
 <li>What can we afford, and what equipment and skills do we already have?</li></ol>
 <p>See the <b>Manufacturing processes</b> booklet (Topic 3) and the <b>Critical path</b> workbook (12.2) for detail.</p>` },
 { mcq: [
  ['A start-up expects to sell 300 units in its first year. Which is the most sensible approach?', ['Buy an injection moulding machine', 'Batch production using low-cost tooling or outsourcing', 'Mass production on a dedicated line', 'Gravure printing'], 1, 'Low volume cannot justify expensive tooling or machines.'],
  ['Which planning tool shows the order of tasks and which ones cannot be delayed?', ['SWOT analysis', 'Critical path analysis', 'Focus group', 'Kitemark'], 1, 'CPA identifies the critical path and float.'],
  ['Why might a company outsource manufacture?', ['To keep full control of quality', 'To avoid buying expensive equipment and use a specialist’s skills and capacity', 'Because it is always cheaper', 'To protect its patent'], 1, 'Outsourcing reduces capital cost but means less direct control.'],
 ] },
 { exam: [
  ['**Explain** two factors a manufacturer considers when selecting a production process.', 4, ['Scale of production (1), e.g. injection moulding only economic at high volume (1)', 'Material (1), e.g. thermoplastic can be injection moulded (1)', 'Tooling cost, skills, accuracy or finish needed (1) with reason (1)']],
  ['**Explain** how the choice of scale of production affects the staff a company needs.', 4, ['One-off/batch: skilled, flexible workers who can do many tasks (1)(1)', 'Mass production: fewer skilled operators, more automation, workers doing repetitive tasks or supervising machines; maintenance technicians (1)(1)']],
 ] },
]},

{ t: 'Intellectual property', spec: '11.3', blocks: [
 { notes: `<p>Intellectual property (IP) law lets designers and companies benefit from their ideas and stops others copying them. In the UK it is administered by the <b>Intellectual Property Office (IPO)</b>.</p>
 <table><tr><th>Type</th><th>Protects</th><th>How you get it</th><th>How long (UK)</th><th>Symbol / example</th></tr>
 <tr><td><b>Patent</b></td><td>A new <b>invention</b>: how something works, what it does, how it is made. Must be new, involve an inventive step, and be capable of industrial application</td><td>Apply and pay; examined; you must <b>not reveal it publicly before applying</b></td><td>Up to <b>20 years</b> (annual renewal fees)</td><td>e.g. Dyson cyclone technology</td></tr>
 <tr><td><b>Registered design</b></td><td>The <b>appearance</b>: shape, contours, colours, texture, materials, ornamentation</td><td>Apply and pay</td><td>Up to <b>25 years</b>, renewed every 5</td><td>e.g. the shape of a chair or bottle</td></tr>
 <tr><td><b>Design right</b> (unregistered)</td><td>The <b>shape and configuration</b> of a 3D object</td><td><b>Automatic</b></td><td>15 years from creation, or 10 years from first sale if sold within the first 5 years; others can ask for a licence in the last 5 years</td><td>Harder to prove in court</td></tr>
 <tr><td><b>Copyright</b></td><td>Original written, artistic, musical and recorded work: drawings, photos, text, software, music</td><td><b>Automatic</b> once recorded</td><td>Life of the creator + <b>70 years</b> (for most works)</td><td>©</td></tr>
 <tr><td><b>Trademark</b></td><td><b>Brand identity</b>: names, logos, slogans, sounds, distinctive shapes and colours</td><td>™ can be used without registering; ® only once registered</td><td>10 years, renewable indefinitely</td><td>™ ® e.g. Nike swoosh</td></tr></table>
 <h4>Why IP matters</h4>
 <ul><li>Rewards investment in R&D and design; stops competitors copying.</li>
 <li>Can be <b>licensed</b> or sold for income.</li>
 <li>Designers must check they do not <b>infringe</b> others’ IP (patent searches).</li>
 <li>Limitations: costly to register and to defend in court; protection is national (separate applications abroad); patents publish the details for all to see.</li></ul>` },
 { match: { q: 'Which type of IP protects…', lh: 'Thing to protect', rh: 'IP type', pairs: [['A new mechanism inside a self-closing bin', 'Patent'], ['The distinctive shape and pattern of a perfume bottle', 'Registered design'], ['The company’s logo and name', 'Trademark'], ['The instruction booklet text and photos', 'Copyright'], ['The 3D shape of a new bracket, automatically, without applying', 'Design right']] } },
 { tf: [
  ['Copyright must be applied for at the Intellectual Property Office.', false, 'Copyright is automatic once the work is recorded.'],
  ['You should not show your invention publicly before applying for a patent.', true, 'It must be new: public disclosure can make it unpatentable.'],
  ['A patent lasts forever as long as it is renewed.', false, 'Maximum 20 years. Trademarks can be renewed indefinitely.'],
  ['The ® symbol can be used on a trademark that has not been registered.', false, 'Only ™ can be used before registration; misusing ® is an offence.'],
 ] },
 { exam: [
  ['**Explain** the difference between a patent and a registered design.', 4, ['Patent protects a new invention: how it works/function (1); must be applied for and lasts up to 20 years (1)', 'Registered design protects appearance/shape (1); up to 25 years with renewals (1)']],
  ['**Discuss** the benefits and drawbacks for a small design company of patenting a new product.', 6, ['Benefits: monopoly for up to 20 years, stops copying, can license for income, adds value to the company/attracts investors (1–3)', 'Drawbacks: expensive to apply and renew, especially abroad; must defend in court at own cost; publishes the details for competitors; competitors may design around it (1–3)']],
 ] },
]},

{ t: 'Standards', spec: '11.4', blocks: [
 { notes: `<table><tr><th>Body / mark</th><th>What it is</th></tr>
 <tr><td><b>BSI</b> (British Standards Institution)</td><td>The UK’s national standards body. Writes <b>British Standards</b> (BS), e.g. BS 8888 technical drawing, BS 1363 plugs and sockets, BS EN 71 toy safety, BS 4800 colours</td></tr>
 <tr><td><b>Kitemark</b></td><td>A BSI certification mark: the product has been <b>independently tested</b> to the relevant standard, and the manufacturer is regularly audited. Builds consumer trust. Voluntary</td></tr>
 <tr><td><b>CEN</b> (European Committee for Standardization)</td><td>Writes <b>European Norms (EN)</b> used across Europe; when adopted in the UK they become <b>BS EN</b> standards</td></tr>
 <tr><td><b>CE marking</b></td><td>The manufacturer’s declaration that a product meets the <b>EU’s</b> health, safety and environmental requirements. <b>Required by law</b> to sell certain products (toys, electrical goods, machinery, PPE) in the EU/EEA. Often self-certified. (Great Britain has its own UKCA mark; CE-marked goods are still accepted in Great Britain for most product types, including toys)</td></tr>
 <tr><td><b>ISO</b> (International Organization for Standardization)</td><td>Worldwide standards. <b>ISO 9001</b>: quality management systems. <b>ISO 14001</b>: environmental management. Others cover sizes (A4 paper, ISO 216), screw threads and more</td></tr></table>
 <h4>Why standards matter</h4>
 <ul><li><b>Safety:</b> products are tested so they do not harm users.</li>
 <li><b>Compatibility:</b> parts fit together (plugs, batteries, screw threads, paper sizes).</li>
 <li><b>Quality and trust:</b> consumers recognise marks.</li>
 <li><b>Trade:</b> common standards let products be sold across countries.</li>
 <li><b>Legal:</b> some standards are required by law; following them protects the company if something goes wrong.</li></ul>` },
 { match: { q: 'Match each to its description.', lh: 'Standard or mark', rh: 'Description', pairs: [['Kitemark', 'Independently tested by BSI to a British Standard'], ['CE mark', 'Manufacturer’s declaration of EU compliance, legally required for some products'], ['ISO 9001', 'International standard for quality management systems'], ['ISO 14001', 'International standard for environmental management'], ['BS 8888', 'British Standard for technical product drawings'], ['BS EN 71', 'Safety of toys']] } },
 { mcq: [
  ['The main difference between the Kitemark and CE marking is…', ['there is none', 'the Kitemark involves independent testing and is voluntary; CE is often self-declared and legally required', 'CE is British, Kitemark is European', 'Kitemark is only for toys'], 1, 'That difference is a favourite exam question.'],
  ['ISO 9001 certification shows that a company…', ['makes the safest products', 'has an effective quality management system', 'has low carbon emissions', 'has patented its products'], 1, 'It is about the system for managing quality, not a specific product.'],
 ] },
 { exam: [
  ['**Explain** one benefit to a consumer of buying a product with the BSI Kitemark.', 2, ['Independently tested to a British Standard (1)', 'so the consumer can trust it is safe/good quality (1)']],
  ['**Explain** why a UK toy manufacturer must make sure its products carry the CE (or UKCA) mark.', 3, ['It is a legal requirement: toys need CE marking to be sold in the EU, and CE or UKCA marking in Great Britain (1)', 'Shows the toy meets safety requirements, e.g. EN 71: small parts, toxicity, flammability (1)', 'Without it products can be withdrawn and the company fined/sued; affects reputation (1)']],
  ['**Discuss** the benefits to a manufacturer of gaining ISO 9001 certification.', 6, ['Consistent quality, fewer defects and returns, lower cost (1–2)', 'Customers and big retailers often require it: more contracts, international trade (1–2)', 'Marketing and reputation (1)', 'Costs: time, paperwork, audits, fees; does not guarantee product quality on its own (1–2)']],
 ] },
]},

{ t: 'Mixed exam practice', spec: '11.1–11.4', blocks: [
 { exam: [
  ['**State** two methods of primary market research.', 2, ['Any two: questionnaire/survey, interview, focus group, observation, user trial (1)(1)']],
  ['**Explain** why a designer might carry out a patent search early in the design process.', 2, ['To check the idea is new / not already protected (1)', 'so they do not infringe someone else’s patent, avoiding legal action and wasted development cost (1)']],
  ['A company plans to launch a reusable water bottle. Fixed costs are £60,000; variable cost £3.50 per bottle; selling price £11.50. **Calculate** the number of bottles that must be sold to break even.', 2, ['£11.50 − £3.50 = £8 contribution (1)', '£60,000 ÷ £8 = 7,500 bottles (1)']],
  ['**Evaluate** the importance of market research and feasibility studies in reducing the risk of launching a new product.', 9, ['Market research: identifies needs, target market, price, competitors; reduces risk of product nobody wants (2–3)', 'Feasibility: technical, economic, legal, operational and schedule checks before investment; stage-gate (2–3)', 'Limitations: cost and time; research can be wrong or out of date; radical innovations may not be wanted until people see them; markets change (2)', 'Supported judgement: greatly reduces but cannot remove risk; must continue through development (1)']],
 ] },
 { nea: 'How have you used market research, costing or standards in your NEA? For example: who was your client or user, what primary research did you do, which British Standards or anthropometric data apply to your product, and roughly what would it cost to make?' },
 { eh: 'Exam-style questions: the real paper’s tariffs', exam: [
  ['**Explain** one benefit to a designer of registering the design of a new chair.', 3, ['Registration gives the designer the exclusive legal right to the chair’s appearance (1), so competitors cannot make or sell copies (1), which protects sales and allows the design to be licensed for income (1)']],
  ['**Explain** two reasons why a company would carry out a feasibility study before developing a new product.', 6, ['To check the product can be made with available technology, materials and skills (1), so technical problems are found early (1), before money is spent on tooling (1)', 'To estimate costs, selling price and likely sales (1), so the company knows whether it will make a profit (1), and can decide whether to go ahead, change or cancel the project (1)']],
  ['A start-up company has designed an innovative folding bicycle lock. It must decide whether to patent the design and manufacture the lock itself, or license the design to an established manufacturer. **Evaluate** these two options.', 12, ['Patent: protection for up to 20 years, needed for either option; cost of application, renewal and defending it', 'Manufacture itself: keeps control of quality, brand and all the profit; but needs large investment in tooling, premises, staff, stock and distribution; high risk; slow to scale', 'License: royalty income with little investment or risk; uses the partner’s factories, expertise and sales network; faster to market', 'License negatives: smaller share of profit; less control over quality, price and marketing; dependence on the partner', 'Market research, feasibility and break-even evidence should inform the decision', 'A reasoned judgement for a start-up with limited funds'],]
 ] },
]},

]});
