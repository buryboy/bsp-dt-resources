/* 3.3.6 Prototype development (AQA 8552, designing and making principles) */
SPEC.push(
 ['q21a', 21, '3.3.6', 'What a prototype should do', 'Satisfy the requirements of the brief · respond to client wants and needs · demonstrate innovation · be functional · consider aesthetics · be potentially marketable', '**Explain** two reasons why designers make prototypes.', 4, ['To test whether the design works as intended (1) so faults in function, strength or size are found before money is spent on production (1)', 'To show the client and users a real version (1) so their feedback can be used to improve the design (1)']],
 ['q21b', 21, '3.3.6', 'Evaluating prototypes', 'Reflect critically and respond to feedback · suggest modifications · assess whether the prototype is fit for purpose', '**Explain** what is meant by “fit for purpose”.', 2, ['The product does the job it was designed to do (1)', 'for the intended user, meeting the brief and specification, e.g. it is safe, works properly and lasts (1)']],
);
BOOKLETS.push({ id: 'g21', topic: 21, title: 'Prototype development', pages: [

{ t: 'Overview and key words', blocks: [
 { notes: `<p class="lead">A <b>prototype</b> is a working version of a design, made to find out whether the idea is right before it is manufactured. Your NEA product is a prototype.</p>
 <p>The specification lists <b>six things a prototype should do</b>, and three things you must be able to do when <b>evaluating</b> one.</p>
 <table><tr><th>A prototype should…</th><th>When evaluating, you should…</th></tr>
 <tr><td><ol style="margin:0;padding-left:20px"><li>satisfy the requirements of the brief</li><li>respond to client wants and needs</li><li>demonstrate innovation</li><li>be functional</li><li>consider aesthetics</li><li>be potentially marketable</li></ol></td>
 <td><ul style="margin:0;padding-left:20px"><li>reflect critically and respond to feedback</li><li>suggest modifications</li><li>assess whether the prototype is fit for purpose</li></ul></td></tr></table>
 <p>A recent paper asked how prototyping tests fitness for purpose, for 6 marks.</p>` },
 { keys: [
  ['Prototype', 'A first working version of a product, made to test the design before manufacture'],
  ['Model', 'A simplified version of a design, often not working and not in the final materials'],
  ['Fit for purpose', 'Able to do the job it was designed for, for the intended user'],
  ['Innovation', 'A new idea, or a new way of doing something, that improves on what exists'],
  ['Functional', 'It works: it does what it is supposed to do'],
  ['Marketable', 'Likely to sell: people would want it and could afford it'],
  ['Evaluation', 'Judging how well a product meets its specification, using evidence from testing'],
  ['Feedback', 'Opinions and information from clients, users and experts'],
  ['Modification', 'A change made to improve a design'],
  ['Third-party testing', 'Testing done by someone other than the designer, such as the user or an expert'],
  ['Destructive testing', 'Testing a product until it breaks, to find its limits'],
  ['Critical reflection', 'Looking honestly at what worked and what did not, and why'],
 ] },
]},

{ t: 'What a prototype should do', spec: '3.3.6', blocks: [
 { notes: `<table><tr><th>A prototype should…</th><th>Meaning</th><th>Questions to ask</th></tr>
 <tr><td><b>Satisfy the requirements of the brief</b></td><td>It solves the problem that was set</td><td>Does it do what the brief asked? Does it meet each point of the specification?</td></tr>
 <tr><td><b>Respond to client wants and needs</b></td><td>It suits the particular client and user</td><td>Is it the right size for them? Can they use it easily? Do they like it?</td></tr>
 <tr><td><b>Demonstrate innovation</b></td><td>It includes something new or better than existing products</td><td>What is different about it? A new feature, material, mechanism or way of using it?</td></tr>
 <tr><td><b>Be functional</b></td><td>It actually works</td><td>Does it do its job reliably? Is it strong, stable and safe?</td></tr>
 <tr><td><b>Consider aesthetics</b></td><td>It looks and feels right for the user</td><td>Are the shape, colour, texture, proportion and finish attractive to the target market?</td></tr>
 <tr><td><b>Be potentially marketable</b></td><td>It could be sold</td><td>Would people buy it? At what price? Could it be manufactured in quantity?</td></tr></table>
 <h4>Models and prototypes</h4>
 <p>Development usually moves from quick, cheap versions to accurate ones:</p>
 <ol><li><b>Sketch models</b> in card, foam or clay: is the idea worth pursuing?</li>
 <li><b>Scale or block models:</b> the look and size, but not working.</li>
 <li><b>Working models</b> or test rigs: one mechanism or joint, to see if it works.</li>
 <li><b>CAD models</b> and 3D prints: accurate shape and fit.</li>
 <li>The <b>final prototype:</b> full size, working, in the real materials or close to them.</li></ol>
 <h4>Why prototype?</h4>
 <ul><li>To <b>test</b> function, strength, safety, size and ergonomics.</li>
 <li>To get <b>feedback</b> from the client and users on something real.</li>
 <li>To find and fix <b>problems</b> before paying for expensive tooling.</li>
 <li>To check how it could be <b>manufactured</b> and what it would cost.</li>
 <li>To show <b>investors</b> or buyers.</li></ul>` },
 { match: { q: 'Match each requirement of a prototype to the question it answers.', lh: 'Requirement', rh: 'Question', pairs: [['Functional', 'Does it work?'], ['Aesthetics', 'Does it look and feel right?'], ['Marketable', 'Would people buy it?'], ['Innovation', 'What is new about it?'], ['Satisfies the brief', 'Does it solve the problem that was set?'], ['Responds to the client', 'Does it suit this particular user?']] } },
 { tf: [
  ['A prototype is made after the product has gone into mass production.', false, 'It is made before, to test the design.'],
  ['A prototype lets users give feedback on a real object.', true, 'Much better than a drawing.'],
  ['A prototype must always be made from the final production material.', false, 'Early prototypes are often card, foam or 3D-printed.'],
 ] },
 { mcq: [
  ['Which is the best example of innovation in a prototype?', ['It is painted blue', 'It includes a new folding mechanism that existing products do not have', 'It is made of pine', 'It has a logo'], 1, 'Innovation means something new or improved.'],
  ['“Potentially marketable” means the prototype…', ['has been advertised on TV', 'could be developed into a product that people would want to buy', 'was cheap to make', 'has been sold already'], 1, 'There is a likely market for it.'],
 ] },
]},

{ t: 'Evaluating prototypes', spec: '3.3.6', blocks: [
 { notes: `<h4>Testing</h4>
 <p>Evaluation needs <b>evidence</b>, and evidence comes from testing.</p>
 <table><tr><th>Type of test</th><th>What it involves</th></tr>
 <tr><td><b>Testing against the specification</b></td><td>Go through every point: is it met, partly met or not met, and how do you know?</td></tr>
 <tr><td><b>Functional testing</b></td><td>Use it as intended: load a shelf, time a mechanism, wash a garment, run a circuit for an hour</td></tr>
 <tr><td><b>User testing</b></td><td>The real user tries it in the place it will be used, and you watch and ask questions</td></tr>
 <tr><td><b>Third-party feedback</b></td><td>Opinions from the client, an expert or a focus group: they are more objective than you are</td></tr>
 <tr><td><b>Measuring</b></td><td>Check sizes against the working drawing and tolerances</td></tr></table>
 <p><b>Quantitative</b> results are numbers (it held 8 kg; 7 out of 10 users could open it). <b>Qualitative</b> results are opinions (“the handle feels too thin”). A good evaluation uses both, and presents the data in a table or chart.</p>
 <h4>Reflect critically and respond to feedback</h4>
 <p>Be honest about weaknesses as well as strengths, and say <b>why</b>. Do not just describe what you made. When feedback suggests a change, <b>act on it</b>, or explain why you did not.</p>
 <h4>Suggest modifications</h4>
 <p>Modifications can be suggested at every stage, from first idea (<b>inception</b>) to <b>manufacture</b>. A good modification is specific and justified:</p>
 <table><tr><th>Weak</th><th>Strong</th></tr>
 <tr><td>“I would make it better.”</td><td>“Users found the lid hard to open, so I would add a 20 mm finger recess on the front edge.”</td></tr>
 <tr><td>“I would use a different material.”</td><td>“The MDF base chipped when dropped, so I would change to 9 mm birch plywood, which is tougher.”</td></tr></table>
 <p>Also think about how it would change for <b>commercial manufacture</b>: injection moulding instead of 3D printing, jigs for a batch, fewer parts.</p>
 <h4>Is it fit for purpose?</h4>
 <p>The final judgement. Does it do the job, for this user, safely and reliably, and does it meet the brief and specification? Back it up with your test results.</p>` },
 { sort: { q: 'Quantitative or qualitative data?', cats: ['Quantitative', 'Qualitative'], items: [['The shelf supported 12 kg', 0], ['“I like the colour.”', 1], ['8 out of 10 users could reach the switch', 0], ['“It feels a bit flimsy.”', 1], ['The box is 2 mm wider than the drawing', 0], ['“The strap is comfortable.”', 1]] } },
 { order: { q: 'Put the stages of evaluating a prototype in order.', steps: ['Test the prototype against each point of the specification', 'Ask the client and users to try it and give feedback', 'Record the results, in numbers and comments', 'Identify the strengths and weaknesses', 'Suggest specific modifications', 'Judge whether it is fit for purpose'] } },
 { mcq: [
  ['Why is feedback from the client more valuable than the designer’s own opinion?', ['The client is always right', 'It is more objective, and the client is the person the product is for', 'It is quicker to collect', 'It does not need recording'], 1, 'Designers find it hard to judge their own work.'],
  ['Which is the best suggested modification?', ['“Make it nicer.”', '“Change some things.”', '“Round the corners to a 5 mm radius, because a tester caught a sleeve on the sharp edge.”', '“Use better glue.”'], 2, 'It is specific and justified by evidence.'],
 ] },
 { exam: [
  ['**Give** two methods of testing a prototype.', 2, ['Any two: testing against the specification; user trials; asking the client or an expert for feedback; load or strength testing; measuring against the drawing (1 each)']],
 ] },
]},

{ t: 'Exam practice', spec: '3.3.6', blocks: [
 { tip: '<b>Product comparison questions.</b> Section C often shows two products and asks you to analyse and evaluate them (for example, suitability for the user, or ergonomics). Write about <b>both</b> products, point out specific features you can see, say whether each is good or bad for the user and why, and finish by saying which is better.' },
 { exam: [
  ['**State** three things that a prototype should demonstrate.', 3, ['Any three: satisfies the brief; responds to client wants and needs; shows innovation; is functional; considers aesthetics; is potentially marketable (1 each)']],
  ['**Explain** why feedback from users is collected when a prototype is tested.', 2, ['Users are the people who will actually use the product, so they notice problems the designer has missed (1)', 'Their feedback is used to modify the design so that it better meets their needs before it is manufactured (1)']],
  ['**Explain** how a designer could test whether a prototype of a child’s high chair is functional and safe.', 4, ['Load it with more than a child’s weight / push it sideways (1) to check that it is strong and stable and will not tip (1)', 'Check for sharp edges, finger traps and small parts, and that the harness and tray lock (1), observing a parent and child using it to see that it can be used easily and safely (1)']],
  ['**Explain** how making and testing prototypes helps a designer to check that a product is fit for purpose.', 6, ['A prototype is a real, full-size version, so it can be used as the final product would be', 'Function can be tested: does it do its job, is it strong, stable and reliable?', 'Users and the client try it, so ergonomics, ease of use and appearance are judged by the people it is for', 'It is checked against each point of the specification, giving evidence rather than opinion', 'Faults are found and modifications made, then it is tested again (iterative)', 'Problems are solved before expensive tooling is bought, saving money and avoiding unsafe products reaching customers', 'Specific examples, e.g. load-testing a shelf, a wearer trial of a garment, a focus group handling a 3D-printed case']],
  ['A company has developed two prototype water bottles for cyclists: one is a rigid aluminium bottle with a screw cap, the other a squeezable polymer bottle with a push-pull valve. **Analyse** and **evaluate** the suitability of each for use while cycling.', 6, ['Aluminium: durable, keeps its shape, does not taint, easily recycled; but dents, and is heavier', 'Aluminium: the screw cap needs two hands, so the rider must stop or ride with no hands, which is unsafe', 'Polymer: light and squeezable, so water can be squirted into the mouth with one hand without tipping the head back', 'Polymer: the push-pull valve opens with the teeth; grips the bottle cage and is easy to pull out', 'Polymer: may wear out sooner and can hold tastes; recyclable if one polymer is used', 'A justified judgement, e.g. the polymer bottle is more suitable because one-handed use while moving matters most']],
 ] },
 { nea: 'Your NEA evaluation should test against every specification point, include feedback from your client in their own words, show data, and end with specific, justified modifications.' },
]},

]});
