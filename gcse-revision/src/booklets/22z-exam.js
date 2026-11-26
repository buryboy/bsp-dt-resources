/* The exam paper: how it works (AQA 8552 written paper). Not a numbered topic: shown as a Skills card on Home.
   Built from the layout and question styles of the June 2022 and June 2023 papers and the specimen paper.
   Every question here is our own, written in the style of the real ones; none is copied from AQA. */
BOOKLETS.push({ id: 'gexam', topic: 'Exam', tag: 'Exam', title: 'The exam paper: how it works', blurb: 'What the real paper looks like, what each command word wants, and practice at the question types that come up every year.', pages: [

{ t: 'How the paper is laid out', blocks: [
 { notes: `<p class="lead">One written paper: <b>2 hours, 100 marks, 50% of your GCSE</b>. You answer <b>every</b> question, in the spaces on the paper.</p>
 <table><tr><th>Section</th><th>What it tests</th><th>Marks</th><th>What it looks like</th></tr>
 <tr><td><b>A</b></td><td>Core technical principles (3.1)</td><td>20</td><td>Questions 1 to 10 are <b>multiple choice</b>, 1 mark each. Then a few short answers of 1 to 4 marks</td></tr>
 <tr><td><b>B</b></td><td>Specialist technical principles (3.2)</td><td>30</td><td>Short answers of 1 to 5 marks, often where you <b>choose one</b> material, process or product from a table, and <b>one long answer</b> of 8 or 10 marks</td></tr>
 <tr><td><b>C</b></td><td>Designing and making principles (3.3)</td><td>50</td><td>A mix: products to <b>analyse and evaluate</b>, <b>calculations</b>, <b>drawings to complete</b>, and explanations of 2 to 6 marks</td></tr></table>
 <h4>Time</h4>
 <p>120 minutes for 100 marks is just over <b>a minute a mark</b>. A sensible plan: Section A about 20 minutes, Section B about 35, Section C about 55, leaving 10 to check. A 6-mark answer deserves about 7 minutes; a 1-mark answer deserves one line.</p>
 <h4>What to bring</h4>
 <ul><li>Black pens, and a <b>pencil</b> for drawing (drawings must be in pencil).</li>
 <li>A <b>ruler</b>, a rubber and a sharpener.</li>
 <li>A <b>calculator</b> and a <b>protractor</b>: both are listed on the front of the paper.</li></ul>
 <h4>Things that cost marks every year</h4>
 <ul><li>Leaving a multiple-choice question blank. There is no penalty for a wrong answer, so always choose one.</li>
 <li>Giving one-word reasons such as “cheap” or “strong”.</li>
 <li>Not using the <b>number of marks</b> and the <b>size of the answer space</b> as a guide to how much to write.</li>
 <li>Ignoring an instruction: “<b>Give examples</b> in your answer”, “<b>Show your working</b>”, “Give your answer in <b>£</b>”, “to the nearest whole millimetre”.</li>
 <li>Writing about only one product when the question says <b>both</b>.</li></ul>` },
 { tip: '<b>“Give examples in your answer.”</b> When a question says this, an answer with no examples cannot reach the top marks, however good the explanation is. Name a real product, material or process every time.' },
 { mcq: [
  ['How many marks is Section C worth?', ['20', '30', '50', '100'], 2, 'Section C is half the paper: 50 marks.'],
  ['Which two pieces of equipment are listed on the front of the paper, as well as normal writing and drawing instruments?', ['A compass and a set square', 'A calculator and a protractor', 'A dictionary and a calculator', 'Scissors and glue'], 1, 'You will need them for the maths and the pie chart or angle questions.'],
  ['Roughly how long should you spend on a 6-mark question?', ['1 minute', '3 minutes', '7 minutes', '20 minutes'], 2, 'A little over a minute a mark.'],
  ['What should you do if you do not know the answer to a multiple-choice question?', ['Leave it blank', 'Choose the most likely answer', 'Shade two answers', 'Write a note to the examiner'], 1, 'A blank scores nothing; a guess has a one in four chance.'],
 ] },
]},

{ t: 'Command words', blocks: [
 { notes: `<p class="lead">The <b>command word</b> tells you what kind of answer the examiner wants. These are the ones used in recent papers, with what to do for each. The meanings are in our own words.</p>
 <table><tr><th>Command word</th><th>What to do</th><th>Typical marks</th></tr>
 <tr><td><b>Which one… / Identify</b></td><td>Pick the correct answer from those given</td><td>1</td></tr>
 <tr><td><b>Name</b></td><td>Give the correct term. Be specific: “beech”, not “wood”</td><td>1</td></tr>
 <tr><td><b>State</b></td><td>A short, clear fact. No explanation needed</td><td>1 each</td></tr>
 <tr><td><b>Give</b></td><td>A short answer. “Give two advantages” for 2 marks means two brief points. “Give two reasons” for 4 marks means two points, each with some detail</td><td>1 or 2 each</td></tr>
 <tr><td><b>Define</b></td><td>Say exactly what the term means</td><td>1 or 2</td></tr>
 <tr><td><b>Describe</b></td><td>Say what something is like, or what happens, step by step. No reasons needed</td><td>2 to 6</td></tr>
 <tr><td><b>Explain</b></td><td>Make a point <b>and give the reason</b>: use “because”, “so that”, “which means”</td><td>2 to 6</td></tr>
 <tr><td><b>Calculate / Work out</b></td><td>Do the maths. Show every step and give the unit</td><td>1 to 4</td></tr>
 <tr><td><b>Complete</b></td><td>Finish a drawing, table or chart that has been started for you</td><td>1 to 5</td></tr>
 <tr><td><b>Use notes and/or sketches to describe…</b></td><td>Draw the process in stages and label every stage. A good labelled sketch can earn as much as a paragraph</td><td>5</td></tr>
 <tr><td><b>Discuss</b></td><td>Look at the issue from more than one side: advantages <b>and</b> disadvantages, with examples</td><td>8</td></tr>
 <tr><td><b>Analyse</b></td><td>Break it down: pick out the features and say what each one does</td><td rowspan="2">4 to 10, usually together as “Analyse and evaluate”</td></tr>
 <tr><td><b>Evaluate</b></td><td>Judge it: how well does it work, for whom, and what is good and bad about it? Reach a conclusion</td></tr></table>
 <h4>How short answers are marked</h4>
 <p>For most 2-mark questions: <b>1 mark for a simple, correct point; 2 marks for a point that is explained in detail</b>. Where a question says “2 × 2 marks” or “2 × 3 marks”, each of the two parts is marked separately in the same way.</p>
 <h4>How long answers are marked</h4>
 <p>Answers worth 6 marks or more are marked by <b>band</b>. The examiner reads the whole answer and decides which description fits best: basic, good, or detailed and thorough. More points do not automatically mean more marks: <b>detail, examples and (for evaluate) judgement</b> move you up a band.</p>` },
 { match: { q: 'Match each command word to what it asks for.', lh: 'Command word', rh: 'What to do', pairs: [['Name', 'Give the correct term'], ['Describe', 'Say what happens, step by step'], ['Explain', 'Make a point and give the reason for it'], ['Evaluate', 'Judge how well it works and reach a conclusion'], ['Calculate', 'Do the maths and show the working'], ['Discuss', 'Give advantages and disadvantages, with examples'], ['Complete', 'Finish a drawing, table or chart']] } },
 { sort: { q: 'A question says “Explain one advantage of using manufactured boards. [2 marks]”. Would each answer get 1 mark or 2?', cats: ['1 mark', '2 marks'], items: [['“They come in big sheets.”', 0], ['“They come in large sheets, so wide panels can be made without joining boards together.”', 1], ['“They are stable.”', 0], ['“They are stable because the layers or fibres run in all directions, so they do not warp like solid timber.”', 1], ['“They use waste wood.”', 0], ['“They are made from wood chips and fibres that would otherwise be wasted, which makes them cheaper than solid timber.”', 1]] } },
 { tf: [
  ['For “Describe”, you must always give reasons.', false, 'Describe wants what it is like or what happens. Reasons are for Explain.'],
  ['In a 6-mark answer, the examiner counts six separate points.', false, 'It is marked by band: the best-fitting description of the whole answer.'],
  ['“Analyse and evaluate” answers should say what is good and bad, not just list features.', true, 'A list of features is analysis only. Judging them is the evaluation.'],
  ['A labelled sketch can earn marks when a question says “use notes and/or sketches”.', true, 'Labels are essential: an unlabelled sketch earns little.'],
 ] },
]},

{ t: 'Choose-one questions and describing a process', blocks: [
 { notes: `<h4>“Choose one from the table”</h4>
 <p>Sections B and C often give a <b>table of options</b>, one for each material area, and ask you to choose one and answer about it. For example: a table of commercial processes (die cutting, turning, casting, extrusion, weaving, pick and place), of products (a metal toy car, a birthday card, a polymer toothbrush, a cotton skirt, a plywood chair) or of equipment (laser cutter, overlocker, vacuum former, 3D printer, centre lathe).</p>
 <ul><li><b>Choose the one you know best</b>, usually from the material area you have made things in. It does not have to be the first in the table.</li>
 <li><b>Write your choice</b> in the space provided. If you do not, the examiner may not be able to credit your answer.</li>
 <li><b>Stick to it</b> for every part of the question. The parts follow on: name a material, name its stock form, give two reasons.</li>
 <li>Be <b>specific</b>: “HIPS sheet”, not “plastic”; “1 mm low carbon steel sheet”, not “metal”.</li></ul>
 <h4>“Using notes and/or sketches, describe the process in detail” (5 marks)</h4>
 <p>This comes up nearly every year, for a cutting, forming or commercial process, or for how a material gets from its source to a stock form. To score well:</p>
 <ol><li><b>Draw three or four simple stage diagrams</b>, in order. Boxes and arrows are fine: it is not an art test.</li>
 <li><b>Label everything:</b> the machine parts, the material, the tool, the direction of movement, heat, pressure.</li>
 <li><b>Number the stages</b> and add a short note to each.</li>
 <li>Include <b>how the work is held</b>, <b>safety</b> and <b>how quality or accuracy is controlled</b>.</li>
 <li>Use the <b>correct technical words</b>: mould, die, platen, chuck, parison, former.</li></ol>
 <p>Processes worth being able to draw from memory: <b>vacuum forming, injection moulding, extrusion, blow moulding, die cutting, laser cutting, turning on a lathe, sand casting, line bending, offset lithography, screen printing</b>, and the route from source to stock form for your material (timber: fell, convert, season; polymers: distil, crack, polymerise; paper: pulp, form, press, dry).</p>` },
 { order: { q: 'A good answer to “describe vacuum forming using notes and sketches” shows these stages. Put them in order.', steps: ['The mould is placed on the platen and lowered', 'A sheet of HIPS is clamped over the top', 'The heater is pulled across until the sheet softens and sags', 'The platen is raised so the mould pushes into the soft sheet', 'The vacuum pump is switched on and the sheet is pulled tightly over the mould', 'The sheet cools, the mould is released and the waste is trimmed off'] } },
 { exam: [
  ['Choose **one** commercial process: die cutting (paper and board), turning (wood), casting (metal), extrusion (polymer), weaving (textile), pick and place assembly (electronics). **Name** a specific main material used with your chosen process.', 1, ['A specific material that suits the process, e.g. die cutting: solid white board or corrugated card; turning: beech or ash; casting: aluminium or cast iron; extrusion: PVC or HDPE; weaving: cotton or polyester yarn; pick and place: surface-mount resistors on a copper-clad PCB (1)', 'Not creditworthy: “wood”, “metal”, “plastic”']],
  ['For the same process, **name** a stock form of the material used.', 1, ['A stock form that matches, e.g. die cutting: sheet or roll; turning: square-section length or blank; casting: ingot; extrusion: granules or powder; weaving: yarn on cones; pick and place: components on reels (1)']],
  ['For the same process, **give** two reasons that make it suitable for commercial manufacture.', 4, ['Two reasons, each worth up to 2 marks: 1 for a simple point, 2 if it is explained', 'e.g. Extrusion runs continuously (1), so very long lengths are made quickly with little labour (1)', 'e.g. Every length has exactly the same cross-section because it is formed by the die (1), so quality is consistent and parts fit together (1)', 'e.g. Die cutting cuts and creases a whole net in one press (1), so thousands of identical boxes are made per hour (1)']],
  ['Choose **one** process: turning, die cutting, laser cutting, cutting by shearing. Using notes and/or sketches, **describe** the process in detail.', 5, ['A clear sequence of labelled stage sketches and notes for the chosen process', 'How the material is held or positioned, e.g. in a chuck or between centres; under the die on the press bed; flat on the honeycomb bed', 'What does the cutting and how it moves, e.g. tool fed along the rotating work; steel rule pressed through the board; laser beam following the CAD path', 'How accuracy is controlled, e.g. callipers, settings for power and speed, a back stop', 'Safety, e.g. guard, extraction, eye protection', 'Top marks: fully coherent, in the right order, with correct technical terms'], 'sketch'],
  ['Choose **one** piece of equipment: laser cutter, overlocker, vacuum former, 3D printer, centre lathe. **Describe** how it is used.', 3, ['A thorough description for 3 marks; some understanding for 2; a basic point for 1', 'e.g. 3D printer: a CAD model is exported and sliced into layers (1); the filament is loaded and the bed levelled and heated (1); the nozzle lays down melted polymer layer by layer, then the part is removed and supports cut away (1)']],
  ['For the same equipment, **explain** the checks you would make to ensure it produces a quality outcome.', 3, ['Detailed explanation of checks for 3 marks; some for 2; one simple check for 1', 'e.g. Laser cutter: check the material is flat and the lens is clean and focused; choose the correct power and speed for the material and thickness; run a small test cut and measure it before cutting the whole job', 'e.g. Centre lathe: check the work is centred and tight in the chuck; the tool is sharp and at centre height; the speed suits the material; measure with callipers during cutting']],
 ] },
]},

{ t: 'Analysing and evaluating products', blocks: [
 { notes: `<p class="lead">Section C nearly always shows <b>one or two products with a specification</b> and asks you to <b>analyse and evaluate</b> them under a heading: suitability for the user, functionality, aesthetics, ergonomics, anthropometrics. These are worth 4 to 6 marks <b>each</b>, so 12 marks or more in total.</p>
 <h4>A method that works</h4>
 <ol><li><b>Read the heading</b> and stick to it. If it says ergonomics, do not write about cost.</li>
 <li><b>Use the picture and the specification.</b> Every bullet in the specification is a ready-made point.</li>
 <li>For each point use three steps: <b>feature → what it does → judgement for this user</b>.</li>
 <li>Cover <b>both</b> products if there are two, and <b>compare</b> them.</li>
 <li>Include <b>negatives</b> as well as positives, and finish with a short <b>conclusion</b>.</li></ol>
 <table><tr><th>Weak</th><th>Strong</th></tr>
 <tr><td>“It has adjustable straps.” (feature only)</td><td>“The adjustable straps let the rucksack fit children of different heights, so it sits properly on the back and can be used for several years. The drawstring bag has thin cords that cannot be adjusted and would dig into the shoulders when it is full.”</td></tr></table>
 <h4>What the headings mean</h4>
 <table><tr><th>Heading</th><th>Write about</th></tr>
 <tr><td><b>Suitability for the user</b></td><td>Does it meet the needs and wants of this particular user: age, activity, safety, ease of use, cost, durability?</td></tr>
 <tr><td><b>Functionality</b></td><td>How well does it do its job? Materials, strength, weather resistance, assembly, storage, transport</td></tr>
 <tr><td><b>Aesthetics</b></td><td>Colour, shape, texture, style, finish: is it attractive to the target market?</td></tr>
 <tr><td><b>Ergonomics</b></td><td>How it fits and suits the body in use: comfort, grip, weight, reach, ease of adjustment, controls</td></tr>
 <tr><td><b>Anthropometrics</b></td><td>The body measurements used: hand width, wrist circumference, shoulder width, back length, and the 5th to 95th percentile range</td></tr></table>` },
 { sort: { q: 'Is the statement analysis (it identifies a feature) or evaluation (it makes a judgement)?', cats: ['Analysis', 'Evaluation'], items: [['The rucksack has two padded straps.', 0], ['The padded straps spread the load, so it is comfortable for a child to carry heavy books.', 1], ['The bag is made from polyester.', 0], ['Polyester is a good choice because it is light and dries quickly if the child is caught in the rain.', 1], ['The drawstring bag has one compartment.', 0], ['One large compartment makes small items hard to find, which is a weakness for a school bag.', 1]] } },
 { exam: [
  ['A cycle helmet for children aged 5 to 8 has this specification: lightweight polystyrene liner with a thin polymer shell; bright colours and reflective strips; adjustable chin strap with a quick-release buckle; a dial at the back to change the fit; air vents. **Analyse** and **evaluate** the helmet in terms of its suitability for the user.', 6, ['The polystyrene liner absorbs impact, protecting the head in a fall, which is the main need', 'Lightweight, so it does not strain a young child’s neck and they are more willing to wear it', 'Bright colours appeal to the age group and, with reflective strips, make the child visible to drivers', 'The quick-release buckle can be worked by small hands, though a young child may need help to fasten it correctly', 'The dial adjusts the fit as the child grows, so parents do not need to buy a new one each year', 'Vents keep the head cool; a negative such as the shell scratching, or the helmet needing replacing after any impact', 'A judgement on overall suitability']],
  ['**Analyse** and **evaluate** the same helmet in terms of ergonomics and anthropometrics.', 6, ['Anthropometric data: head circumference of 5 to 8 year olds, 5th to 95th percentile, sets the size range of the shell', 'The dial adjusts within that range, so one helmet fits most children and stays snug', 'Chin strap length is based on the measurement under the chin; adjustable so it is neither loose nor tight', 'Buckle sized for a child’s finger strength and for an adult’s larger fingers', 'Low weight and padding make it comfortable for long periods; vents reduce heat', 'A weakness, e.g. the dial is behind the head where the child cannot see it; straps can twist', 'Correct use of the terms: anthropometrics is the data, ergonomics is how the helmet fits and feels']],
  ['The specification for an adult running watch includes: lightweight; waterproof; rechargeable battery lasting three weeks; touchscreen; GPS. **Evaluate** the watch in terms of its ergonomics.', 4, ['Light, so it does not bounce on the wrist or tire the arm on a long run (1–2)', 'A soft, flexible strap with many holes fits a range of wrist sizes and stays comfortable when the wrist swells with heat (1–2)', 'A touchscreen is hard to use with sweaty or gloved fingers while moving, so physical buttons would be better (1–2)', 'A large, clear display can be read at a glance without stopping (1–2)', 'Up to 2 marks for each developed point, to a maximum of 4']],
  ['**Give** four changes or additions to the running watch’s specification to make it suitable for a child aged 9 to 11, and **explain** how each would suit the new user. Do not refer to colour.', 8, ['Four changes, each worth up to 2 marks: 1 for the change, 1 for the explanation', 'A smaller case and shorter strap (1), based on the wrist sizes of 9 to 11 year olds, so it does not slide round (1)', 'A tougher, shock-resistant body and scratch-proof screen (1), because children are rougher with products (1)', 'Larger, simpler buttons or icons with fewer functions (1), so it is easy to use without reading instructions (1)', 'Games, step challenges or activity modes other than running (1), to keep a child interested (1)', 'A parental tracking or SOS function (1), for safety (1); lower price (1), as it may be lost or outgrown (1)']],
 ] },
]},

{ t: 'Long answers: 8 and 10 marks', blocks: [
 { notes: `<p class="lead">Section B ends with one long question worth <b>8 marks</b> (or 10 on the specimen paper). Recent ones: the advantages and disadvantages of manufacturing in quantity; what contributes to a product's carbon footprint from raw material to disposal; whether fair trade, recycled and biodegradable materials are the ethical choice.</p>
 <p>They draw on <b>3.2.3 Ecological and social footprint</b>, <b>3.2.7 Scales of production</b> and <b>3.2.1 Selection of materials</b>, so know those topics well.</p>
 <h4>A plan for an 8-mark answer (about 10 minutes)</h4>
 <ol><li><b>One minute to plan.</b> Jot down three or four points on each side, and two examples.</li>
 <li><b>Opening sentence</b> that shows you understand the question.</li>
 <li><b>Three or four paragraphs.</b> Each one: a point, the explanation, an example. Use the headings the question gives you (such as “prototype, batch, mass, continuous” or “raw material, manufacture, distribution, use, disposal”).</li>
 <li><b>Both sides.</b> “On the other hand…”, “However…”.</li>
 <li><b>A conclusion</b> that makes a judgement: “Overall…”.</li></ol>
 <table><tr><th>Band</th><th>What it takes</th></tr>
 <tr><td>Top (7–8)</td><td>Detailed points on both sides, each explained; the different stages or methods all considered; relevant examples throughout; a judgement</td></tr>
 <tr><td>Good (5–6)</td><td>Good points on both sides, mostly explained; some examples</td></tr>
 <tr><td>Basic (3–4)</td><td>Some relevant points but little explanation; no real judgement; few or no examples</td></tr>
 <tr><td>Limited (1–2)</td><td>One or two simple points</td></tr></table>` },
 { tip: '<b>PEE: Point, Explain, Example.</b> “Mass production lowers the cost of each product (point), because the cost of the mould is shared over millions (explain). This is why an injection-moulded bottle cap costs a fraction of a penny (example).”' },
 { order: { q: 'Put the parts of a good 8-mark answer in order.', steps: ['A quick plan of points for and against', 'An opening sentence that shows you understand the question', 'Points on one side, each explained with an example', 'Points on the other side, each explained with an example', 'A conclusion that makes a judgement'] } },
 { exam: [
  ['Carbon dioxide is released when a product is made, transported, used and thrown away. **Analyse** and **evaluate** the factors that contribute to the carbon footprint of a product, from raw material source to final disposal. Give examples in your answer.', 8, ['Raw materials: extraction by mining, drilling or logging uses fuel; deforestation removes trees that absorb carbon dioxide', 'Processing: refining metals and polymers needs very high temperatures, usually from fossil fuels, e.g. aluminium smelting', 'Manufacture: energy for machines, heating and lighting; waste material that must be reprocessed', 'Distribution: materials and products shipped between countries; air freight is far worse than sea or rail; heavy or bulky packaging', 'Use: products that consume electricity or fuel over years, e.g. a car or a tumble dryer, may release most of their carbon in use', 'Disposal: transport to landfill or incineration; burning releases carbon dioxide; recycling saves most of the energy of making new material', 'Evaluation: which stage is largest for a given product, and how it can be reduced: local sourcing, renewable energy, efficient design, design for long life and recycling', 'Relevant examples throughout']],
  ['Designers sometimes choose materials for their impact on society and the environment, such as fair trade cotton, recycled components and biodegradable packaging. **Evaluate** how far the use of such materials can be seen as the ethical choice.', 10, ['Fair trade cotton: farmers get a fair, stable price and a premium for their community; safer conditions; no child labour', 'But: it costs more, so the product costs more; it does not by itself reduce the water and transport involved', 'Recycled components: less mining, drilling and energy; less waste to landfill; less pollution', 'But: collection and reprocessing still use energy; quality can be lower; supply may be limited', 'Biodegradable packaging: breaks down instead of lasting for centuries; less harm to wildlife and oceans', 'But: often only breaks down in industrial composting; may be made from crops grown on land that could grow food; can be weaker', 'Wider view: an ethical material in a product that is thrown away quickly is still wasteful; “greenwashing”; consumers may pay more and feel better without much real benefit', 'A supported judgement: these are more ethical choices, most effective when combined with reducing, re-using and designing products to last', 'Specific examples throughout']],
 ] },
]},

{ t: 'Drawing questions and a final checklist', blocks: [
 { notes: `<p class="lead">Section C has had a <b>drawing to complete</b> on every recent paper, worth 4 or 5 marks each time: adding detail to the <b>side view of an orthographic drawing</b>, finishing a <b>one-point perspective</b>, drawing an <b>exploded isometric</b> view of two parts, adding a front view and an isometric view.</p>
 <h4>How the marks are given</h4>
 <p>One mark for each correct feature. On an orthographic view that typically means: the outline in the right place; hidden edges shown as <b>dashed lines</b>; <b>centre lines</b> through holes and round parts; and the whole thing in proportion and lined up with the other views.</p>
 <h4>Method</h4>
 <ul><li><b>Orthographic:</b> rule faint <b>projection lines</b> across from the view you are given. Every edge in one view must appear in the others, either as a solid line (visible) or a dashed line (hidden).</li>
 <li><b>One-point perspective:</b> the front face is drawn flat. Rule a faint line from <b>each corner to the vanishing point</b>, then draw the back edges parallel to the front ones.</li>
 <li><b>Isometric:</b> verticals stay vertical; everything else is at 30°. Use the grid if one is printed.</li>
 <li><b>Exploded:</b> keep the parts <b>in line</b> along the direction they fit together, with a gap between them.</li>
 <li>Work lightly first, then go over the final lines firmly. Leave your construction lines in.</li></ul>
 <h4>Final checklist for the exam</h4>
 <ul><li>Have I answered <b>every</b> question, including all ten multiple-choice?</li>
 <li>Where I chose from a table, have I <b>written down my choice</b>?</li>
 <li>Have I given <b>examples</b> wherever the question asked?</li>
 <li>Calculations: <b>working shown</b>, <b>units</b> written, rounded as asked?</li>
 <li>Long answers: <b>both sides</b> and a <b>conclusion</b>?</li>
 <li>Drawings: in <b>pencil</b>, with hidden detail and centre lines?</li></ul>` },
 { mcq: [
  ['On an orthographic drawing, how is an edge that cannot be seen from that view shown?', ['It is left out', 'As a dashed line', 'As a thick line', 'As a wavy line'], 1, 'Hidden detail is shown with thin dashed lines.'],
  ['In a one-point perspective drawing, where do the lines going back from the front face lead?', ['To the nearest corner of the page', 'To the vanishing point', 'They stay parallel at 30°', 'To the centre of the object'], 1, 'All receding lines meet at the single vanishing point.'],
  ['What is a datum point?', ['The most expensive part of a product', 'A fixed reference point from which measurements are taken', 'The last hole to be drilled', 'A mistake in marking out'], 1, 'Measuring everything from one datum stops errors adding up.'],
 ] },
 { exam: [
  ['**Define** the term “datum point”.', 1, ['A fixed reference point (or edge or surface) from which all measurements are taken (1)']],
  ['**Explain** why datum points are used during manufacturing.', 2, ['All measurements start from the same place, so small errors do not add up (1)', 'which keeps parts accurate and consistent, and gives CNC machines and laser cutters a known starting position (1)']],
  ['**Explain** where and why exploded drawings are used. Give examples in your answer.', 4, ['Where: assembly instructions for flat-pack furniture and model kits; maintenance and parts manuals; presenting a design to a client or manufacturer (1–2)', 'Why: they show every part, including hidden ones, and how and in what order the parts fit together, without needing words, so they can be followed in any language (1–2)', 'Top band: both where and why, with examples']],
  ['**Describe** one advantage and one disadvantage of freehand sketching compared with CAD drawing.', 4, ['Advantage: quick, needs only a pencil and paper, so many ideas can be recorded and changed as they occur (up to 2)', 'Disadvantage: less accurate and not to scale; cannot easily be edited, copied, shared electronically or sent to a CAM machine (up to 2)']],
  ['On plain paper, **draw** a one-point perspective view of a cuboid. Mark the vanishing point with a cross.', 3, ['Front face drawn as a true rectangle (1)', 'Faint lines from the corners of the front face to the vanishing point (1)', 'Back edges drawn parallel to the front edges, giving a convincing solid (1)'], 'sketch'],
 ] },
]},

]});
