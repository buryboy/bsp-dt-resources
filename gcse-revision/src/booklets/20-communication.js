/* 3.3.5 Communication of design ideas (AQA 8552, designing and making principles) */
SPEC.push(
 ['q20a', 20, '3.3.5', 'Sketching and 3D drawing', 'Freehand sketching · isometric and perspective drawing · 2D and 3D drawings · annotated drawings', '**Describe** two differences between an isometric drawing and a two-point perspective drawing.', 2, ['Isometric: sloping lines are drawn at 30° and stay parallel; perspective: lines going back converge to vanishing points on a horizon line (1)', 'Isometric can be drawn to scale and measured; perspective looks more realistic because objects get smaller with distance, but cannot be measured (1)']],
 ['q20b', 20, '3.3.5', 'Working drawings and exploded diagrams', 'Working drawings: third angle orthographic, using conventions, dimensions and drawn to scale · exploded diagrams · system and schematic diagrams', '**Explain** why a manufacturer needs a third angle orthographic drawing rather than a 3D sketch.', 2, ['It shows the front, plan and side views flat-on, with the true shape and exact dimensions, drawn to scale (1)', 'so the product can be made accurately by someone else, using standard conventions that everyone understands (1)']],
 ['q20c', 20, '3.3.5', 'Modelling and other techniques', 'Modelling: card, toiles, breadboards · mathematical modelling · computer-based tools · audio and visual recordings', '**Explain** two advantages of making a card model before making a product in its final material.', 4, ['Card is cheap and quick to cut and change (1) so several ideas can be tried and mistakes cost little (1)', 'The model shows size, proportion and how parts fit or move (1) so problems are found and the client can give feedback before expensive materials are used (1)']],
);
BOOKLETS.push({ id: 'g20', topic: 20, title: 'Communication of design ideas', pages: [

{ t: 'Overview and key words', blocks: [
 { notes: `<p class="lead">Designers must get ideas out of their head so that they can <b>develop</b> them, <b>record</b> them, <b>explain</b> them to a client and <b>instruct</b> a manufacturer. Different techniques suit different jobs.</p>
 <table><tr><th>Technique</th><th>Best for</th></tr>
 <tr><td>Freehand sketching</td><td>Getting first ideas down quickly</td></tr>
 <tr><td>Isometric and perspective drawing</td><td>Showing what the product looks like in 3D</td></tr>
 <tr><td>Annotated drawings</td><td>Explaining and justifying an idea</td></tr>
 <tr><td>Exploded diagrams</td><td>Showing how parts go together</td></tr>
 <tr><td>System and schematic diagrams</td><td>Showing how a system or circuit works</td></tr>
 <tr><td>Working drawings (third angle orthographic)</td><td>Giving exact sizes for manufacture</td></tr>
 <tr><td>Modelling: card, toiles, breadboards</td><td>Testing size, fit and function</td></tr>
 <tr><td>Mathematical modelling and computer-based tools</td><td>Predicting, testing and presenting on screen</td></tr>
 <tr><td>Audio and visual recordings</td><td>Capturing what users say and do</td></tr></table>
 <p><b>This topic has drawing questions.</b> Recent papers asked candidates to complete an orthographic view and an exploded isometric drawing. Take a sharp pencil, a ruler and a rubber into the exam, and practise on paper.</p>` },
 { keys: [
  ['Isometric drawing', 'A 3D drawing with vertical lines upright and all other lines at 30° to the horizontal'],
  ['Perspective drawing', 'A 3D drawing in which lines going away from the viewer meet at one or more vanishing points'],
  ['Vanishing point', 'The point on the horizon line where receding lines appear to meet'],
  ['Orthographic drawing', 'A set of flat 2D views of a product: front, plan (top) and side'],
  ['Third angle projection', 'The standard layout: plan above the front view, and each side view on the side it is seen from'],
  ['Annotation', 'Notes added to a drawing to explain and justify the design'],
  ['Exploded diagram', 'A drawing showing the parts of a product separated but lined up, to show how they fit together'],
  ['Schematic diagram', 'A diagram using standard symbols to show how a circuit or system is connected'],
  ['Scale', 'The ratio between the size of a drawing and the real object, such as 1:2'],
  ['Dimension', 'A measurement written on a drawing'],
  ['Toile', 'A test version of a garment made in cheap fabric to check the fit'],
  ['Breadboard', 'A board for building and testing a circuit without soldering'],
 ] },
]},

{ t: 'Sketching and 3D drawing', spec: '3.3.5', blocks: [
 { notes: `<h4>Freehand sketching</h4>
 <p>Quick drawing with no ruler. Used to get ideas down fast and explore lots of possibilities. Start with light construction lines and simple shapes (“crating”: draw a box, then the object inside it), then firm up the outline.</p>
 <h4>2D and 3D drawings</h4>
 <p>A <b>2D</b> drawing shows one flat view (a front view, a net, a pattern piece). A <b>3D</b> drawing shows three faces at once, so it looks solid.</p>
 <table><tr><th></th><th>Isometric</th><th>One-point perspective</th><th>Two-point perspective</th></tr>
 <tr><td><b>How</b></td><td>Verticals stay vertical. All other lines are at <b>30°</b> to the horizontal. Parallel lines stay parallel</td><td>The front face is drawn flat. Lines going back all meet at <b>one vanishing point</b> on the horizon line</td><td>A vertical corner is drawn first. Lines going left and right meet at <b>two vanishing points</b> on the horizon line</td></tr>
 <tr><td><b>For</b></td><td>Can be drawn to scale and measured; quick with isometric grid paper; shows three faces equally</td><td>Good for rooms, interiors and views straight down a street</td><td>The most realistic: how the eye really sees an object</td></tr>
 <tr><td><b>Against</b></td><td>Looks slightly distorted, as far edges do not get smaller</td><td>Shows only one face well</td><td>Cannot be measured; takes longer to set up</td></tr></table>
 <h4>Annotated drawings</h4>
 <p>Annotation turns a picture into a piece of design thinking. Good notes <b>explain and justify</b>: materials and why, how parts are made and joined, sizes, how it meets the specification, what the user said, what you would change. “Made of wood” is a label; “beech, because it will not splinter in a child's hands” is annotation.</p>
 <p>Early (<b>conceptual</b>) sketches carry short notes on the idea. Later (<b>development</b>) drawings carry detailed notes on construction and decisions.</p>
 <h4>Rendering</h4>
 <p>Adding tone, colour and texture makes a drawing look solid and shows the material: darker on the side away from the light, a highlight on shiny surfaces, grain lines for wood. A thicker outline round the outside makes the object stand out.</p>` },
 { sort: { q: 'Isometric or perspective?', cats: ['Isometric', 'Perspective'], items: [['Lines are drawn at 30° to the horizontal', 0], ['Lines meet at a vanishing point', 1], ['Parallel edges stay parallel', 0], ['Objects look smaller the further away they are', 1], ['Can be drawn to scale and measured', 0], ['Uses a horizon line', 1]] } },
 { mcq: [
  ['At what angle to the horizontal are the sloping lines drawn in an isometric drawing?', ['15°', '30°', '45°', '60°'], 1, '30° to the horizontal, on both sides.'],
  ['How many vanishing points does a two-point perspective drawing have?', ['None', 'One', 'Two', 'Three'], 2, 'One to the left and one to the right, on the horizon line.'],
  ['Which is the best annotation?', ['“Handle”', '“Looks good”', '“Rubber grip, 30 mm diameter, so it is comfortable and does not slip in a wet hand”', '“Blue”'], 2, 'It names the feature, gives a size and justifies it.'],
 ] },
 { exam: [
  ['On isometric grid paper, **draw** a cuboid 60 mm long, 40 mm wide and 20 mm high.', 3, ['Vertical edges drawn vertical and sloping edges at 30° (1)', 'All three dimensions correct: 60, 40 and 20 mm (1)', 'Neat, complete drawing with all nine visible edges and no hidden edges shown (1)'], 'sketch'],
 ] },
]},

{ t: 'Working drawings and diagrams', spec: '3.3.5', blocks: [
 { notes: `<h4>Third angle orthographic projection</h4>
 <p>A <b>working drawing</b> gives a manufacturer everything needed to make the product. It shows separate, flat views, drawn accurately <b>to scale</b> and lined up with each other.</p>
 <ul><li><b>Front view</b> (front elevation) in the lower left.</li>
 <li><b>Plan</b> (the view from above) <b>directly above</b> the front view.</li>
 <li><b>Side view</b> (end elevation) <b>beside</b> the front view, on the side it is seen from.</li></ul>
 <p>The symbol for third angle projection is a <b>truncated cone</b> seen from the side, with <b>two concentric circles</b> (one inside the other) to its left.</p>
 <h4>Line conventions (British Standards)</h4>
 <table><tr><th>Line</th><th>Looks like</th><th>Used for</th></tr>
 <tr><td>Outline</td><td>Thick, continuous</td><td>Edges you can see</td></tr>
 <tr><td>Hidden detail</td><td>Thin, short dashes</td><td>Edges that are hidden behind a surface</td></tr>
 <tr><td>Centre line</td><td>Thin, long dash then short dash</td><td>The centre of a circle or a symmetrical part</td></tr>
 <tr><td>Construction / projection line</td><td>Very thin, faint, continuous</td><td>Lining up the views</td></tr>
 <tr><td>Dimension line</td><td>Thin, continuous, with an arrowhead at each end</td><td>Showing a measurement</td></tr></table>
 <h4>Dimensioning rules</h4>
 <ul><li>All sizes in <b>millimetres</b>; write the number only, not “mm”.</li>
 <li>The number sits <b>above the middle</b> of the dimension line, and is read from the bottom or the right of the page.</li>
 <li>Dimension lines stand <b>off</b> the object, between thin extension lines that do not touch the outline.</li>
 <li>Diameter is shown as <b>Ø</b> and radius as <b>R</b>: Ø20, R5.</li>
 <li>Give each size <b>once</b>, and state the <b>scale</b> (such as 1:2) in the title block.</li></ul>
 <h4>Scale</h4>
 <p><b>1:1</b> is full size. <b>1:2</b> is half size (10 mm on paper = 20 mm real). <b>2:1</b> is twice full size, for small parts. <b>1:50</b> is common for rooms.</p>
 <h4>Exploded diagrams</h4>
 <p>The parts are drawn <b>pulled apart</b> along the lines on which they fit together, usually in isometric, with thin lines linking them. They show <b>constructional detail</b> and the <b>order of assembly</b>: think of flat-pack furniture instructions.</p>
 <h4>System and schematic diagrams</h4>
 <p>A <b>systems (block) diagram</b> shows input → process → output as boxes and arrows. A <b>schematic diagram</b> uses simple standard symbols to show how a system is connected, leaving out what it really looks like: a circuit diagram is one, and so is the London Underground map. A <b>flowchart</b> shows the steps of a program or a process.</p>` },
 { match: { q: 'Match each line type to its use on a working drawing.', lh: 'Line', rh: 'Use', pairs: [['Thick continuous line', 'An edge you can see'], ['Thin short dashes', 'A hidden edge'], ['Thin long-dash, short-dash line', 'The centre of a hole or symmetrical part'], ['Thin line with arrowheads', 'A dimension']] } },
 { calc: [
  ['A drawing is made at a scale of 1:2. A line on the drawing is 45 mm long. How long is the real part, in mm?', 90, 0, 'mm', '1:2 means the real part is twice the drawing: 45 × 2 = 90 mm.'],
  ['A shelf 900 mm long is drawn at a scale of 1:5. How long is it on the drawing, in mm?', 180, 0, 'mm', '900 ÷ 5 = 180 mm.'],
  ['A room 4 m long is drawn at 1:50. How long is it on the drawing, in mm?', 80, 0, 'mm', '4 m = 4000 mm. 4000 ÷ 50 = 80 mm.'],
  ['A small part 8 mm wide is drawn at a scale of 5:1. How wide is it on the drawing, in mm?', 40, 0, 'mm', '5:1 means five times full size: 8 × 5 = 40 mm.'],
 ] },
 { tf: [
  ['In third angle projection, the plan view is drawn directly above the front view.', true, 'And the side views are placed on the side they are seen from.'],
  ['Dimensions on a working drawing are normally given in centimetres.', false, 'Millimetres, with no unit written.'],
  ['A hidden edge is shown with a dashed line.', true, 'Thin, short dashes.'],
  ['An exploded diagram shows how the parts of a product fit together.', true, 'The parts are separated but kept in line.'],
 ] },
]},

{ t: 'Modelling and other techniques', spec: '3.3.5', blocks: [
 { notes: `<h4>Modelling using materials and components</h4>
 <table><tr><th>Model</th><th>What it is</th><th>What it tests</th></tr>
 <tr><td><b>Card modelling</b></td><td>Quick models in card, foam board, Styrofoam or corrugated card, to scale or full size</td><td>Size, proportion, shape, how parts fit and move; ergonomics; how a net folds</td></tr>
 <tr><td><b>Toile</b></td><td>A test garment in cheap fabric such as calico, made from the pattern before cutting the real fabric</td><td>Fit, drape and how the pattern pieces go together; changes are marked on it and transferred to the pattern</td></tr>
 <tr><td><b>Breadboard</b></td><td>Components are pushed into a board with rows of connected holes, so a circuit is built with no soldering</td><td>Whether the circuit works; component values can be swapped easily before a PCB is made</td></tr></table>
 <p><b>Why model?</b> It is cheap and quick, it finds problems early, the user can hold it and give feedback, and it shows things a drawing cannot.</p>
 <h4>Computer-based tools</h4>
 <ul><li><b>2D CAD</b> for accurate drawings, nets and laser-cutter files. <b>3D CAD</b> for solid models that can be turned, sectioned, rendered and animated.</li>
 <li><b>Simulation:</b> the model is tested on screen for strength, moving parts or how a circuit behaves.</li>
 <li>Files can be <b>edited</b> quickly, <b>shared</b> by email or the cloud, and sent straight to <b>CAM</b> machines (laser cutter, 3D printer, CNC router).</li>
 <li>Drawbacks: the cost of software and computers, the training needed, and work can be lost or copied.</li></ul>
 <h4>Mathematical modelling</h4>
 <p>Using <b>numbers and calculations</b> to predict how a design will behave before it is made: working out costs in a spreadsheet, material quantities, the load a shelf will carry, gear ratios, or the best layout to cut waste. Change one number and see the effect.</p>
 <h4>Audio and visual recordings</h4>
 <p><b>Recording interviews</b> with a client or users, and <b>filming</b> people using a product or prototype. The designer keeps the exact words and can watch again to spot problems the user did not mention. Photographs and video also <b>record</b> models and tests and can be used to <b>present</b> an idea. (In the exam, sketching does not count as an audio or visual recording.)</p>` },
 { match: { q: 'Choose the best technique for each job.', lh: 'Job', rh: 'Technique', pairs: [['Checking that a jacket fits before cutting expensive fabric', 'Toile'], ['Testing a circuit before soldering it', 'Breadboard'], ['Checking the size and proportion of a product idea quickly', 'Card model'], ['Working out the cost of different quantities', 'Mathematical modelling in a spreadsheet'], ['Keeping an accurate record of what a client said', 'Audio recording of the interview'], ['Showing a client a realistic 3D view that can be turned round', '3D CAD model']] } },
 { mcq: [
  ['What is a toile?', ['A type of weave', 'A test garment made from cheap fabric', 'A sewing machine foot', 'A fabric finish'], 1, 'It checks fit before the real fabric is cut.'],
  ['Which is an advantage of 3D CAD over hand drawing?', ['It needs no training', 'The design can be viewed from any angle and edited quickly', 'It never needs a computer', 'It cannot be shared'], 1, 'Models can be rotated, changed and sent to CAM.'],
 ] },
 { exam: [
  ['**Explain** two advantages of using audio or visual recordings when developing design ideas with a client.', 4, ['An interview can be replayed, so the client’s exact words and tone are kept (1) and nothing is forgotten or misremembered (1)', 'Video of a user handling a prototype (1) shows difficulties the user did not mention, so the design can be improved (1)']],
 ] },
]},

{ t: 'Exam practice', spec: '3.3.5', blocks: [
 { tip: '<b>Drawing questions:</b> use a sharp pencil and a ruler. Line your views up with faint projection lines. Leave your construction lines in: they show your method. If you are asked to complete a view, check every edge on the given views has a matching line on yours, including hidden detail.' },
 { mcq: [
  ['Which drawing would be sent to a manufacturer to make a product?', ['A freehand sketch', 'A mood board', 'A dimensioned third angle orthographic drawing', 'A two-point perspective'], 2, 'It gives true shapes and exact sizes.'],
  ['What does “Ø12” mean on a drawing?', ['A radius of 12 mm', 'A diameter of 12 mm', '12 holes', 'A scale of 1:12'], 1, 'Ø is the symbol for diameter; R is radius.'],
  ['Which type of drawing shows the parts of a product separated to show how it is assembled?', ['Orthographic', 'Exploded', 'Schematic', 'Perspective'], 1, 'An exploded diagram.'],
 ] },
 { exam: [
  ['**Name** the type of drawing that shows a front view, a plan and a side view of a product.', 1, ['Third angle orthographic (projection) / orthographic drawing / working drawing (1)']],
  ['**Give** two reasons why designers annotate their sketches.', 2, ['To explain features that the drawing alone cannot show, such as materials, sizes and how it is made (1)', 'To justify decisions and show how the idea meets the specification / to record feedback (1)']],
  ['A simple block is 80 mm long, 40 mm wide and 30 mm high. **Draw** a third angle orthographic drawing of it at a scale of 1:1, showing the front view, plan and one side view. Add three dimensions.', 5, ['Front view correct size: 80 × 30 mm (1)', 'Plan directly above the front view: 80 × 40 mm (1)', 'Side view beside the front view and level with it: 40 × 30 mm (1)', 'Views lined up using projection lines (1)', 'Three dimensions added correctly, with dimension lines off the object, arrowheads and numbers in mm without units (1)'], 'sketch'],
  ['**Draw** an exploded isometric view of a simple box with a separate lid.', 4, ['Box drawn in isometric with sloping lines at 30° (1)', 'Lid drawn separately, directly above the box and in line with it (1)', 'Thin lines linking the corners of the lid to the box to show how it fits (1)', 'Neat, in proportion, with the thickness of the material shown (1)'], 'sketch'],
  ['**Compare** the use of card modelling and 3D CAD modelling when developing a design for a desk tidy.', 6, ['Card: cheap, quick, needs no special equipment; gives a real object that the user can hold, fill with pens and test for size', 'Card: less accurate; hard to show the final material and finish; a new model is needed for each change', 'CAD: accurate and to scale; easy to edit, copy and try different sizes or colours; realistic renders for the client', 'CAD: can be sent to a laser cutter or 3D printer; parts can be checked for fit on screen', 'CAD: needs software, hardware and skill; the user cannot handle it unless it is printed', 'A supported conclusion, e.g. card first for quick ideas and testing with the user, CAD later for accuracy and manufacture']],
 ] },
 { nea: 'Your NEA should show a range of these techniques: freehand sketches, at least one 3D drawing, annotated development, models, CAD and a dimensioned working drawing that someone else could make from.' },
]},

]});
