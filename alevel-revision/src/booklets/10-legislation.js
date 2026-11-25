/* Topic 10: Current legislation (Edexcel 9DT0 10.1–10.2) */
BOOKLETS.push({ id: 't10', topic: 10, title: 'Current legislation', pages: [

{ t: 'Overview and key words', blocks: [
 { notes: `<p class="lead">Topic 10 covers two areas of UK law: <b>consumer rights</b> (what buyers are entitled to, and what that means for manufacturers) and <b>health and safety</b> (how people are protected at work, and what happens when the law is ignored).</p>
 <table><tr><th>Page</th><th>Spec</th><th>Covers</th></tr>
 <tr><td>2</td><td>10.1a</td><td>Consumer Rights Act 2015</td></tr>
 <tr><td>3</td><td>10.1b</td><td>Sale of Goods Act 1979, and implications for consumers and manufacturers</td></tr>
 <tr><td>4</td><td>10.2a</td><td>The Health and Safety Executive and regulations relevant to manufacturing</td></tr>
 <tr><td>5</td><td>10.2b</td><td>Health and Safety at Work etc Act 1974: PPE, signage, warning symbols</td></tr>
 <tr><td>6</td><td>10.2c</td><td>COSHH: storing and using solvent-based substances containing VOCs</td></tr>
 <tr><td>7</td><td>10.2</td><td>Impact on designing and making; consequences of non-adherence</td></tr>
 <tr><td>8</td><td>10</td><td>Mixed exam practice</td></tr></table>
 <p>This is UK law, because the exam is set in the UK. The same principles apply in France and across the EU, under different names.</p>` },
 { tip: '<b>Exam tip:</b> give the <b>full name and year</b> of an Act the first time you use it, then say what it <b>requires</b> and what that <b>means</b> for the person in the question (consumer, retailer, manufacturer, employer or employee).' },
 { keys: [
  ['Legislation', 'Laws made by Parliament (Acts) and the regulations made under them'],
  ['Consumer', 'A person who buys goods or services for their own private use'],
  ['Satisfactory quality', 'The standard a reasonable person would expect, considering price, description, durability, safety and finish'],
  ['Fit for purpose', 'Able to do the job it is sold for, including any purpose the buyer told the seller about'],
  ['As described', 'Matching the description, packaging, sample or model shown'],
  ['HSE', 'Health and Safety Executive: the UK body that enforces health and safety law at work'],
  ['HASAWA', 'Health and Safety at Work etc Act 1974: the main Act setting out duties of employers and employees'],
  ['COSHH', 'Control of Substances Hazardous to Health regulations'],
  ['VOC', 'Volatile organic compound: a carbon-based chemical that evaporates easily at room temperature, e.g. in solvent-based paints and adhesives'],
  ['Safety data sheet', 'The supplier’s document listing a substance’s hazards, safe handling, storage and first aid'],
  ['Improvement notice', 'An HSE order to put a fault right within a set time'],
  ['Prohibition notice', 'An HSE order to stop a dangerous activity immediately'],
 ] },
]},

{ t: 'Consumer Rights Act 2015', spec: '10.1a', blocks: [
 { notes: `<p>The Consumer Rights Act came into force on <b>1 October 2015</b>. It brought together and simplified earlier consumer laws, including the Sale of Goods Act for consumer sales, and added rights for <b>digital content</b>. The contract is with the <b>retailer</b> (seller), not the manufacturer.</p>
 <h4>What goods must be</h4>
 <table><tr><th>Requirement</th><th>Meaning</th><th>Example of a breach</th></tr>
 <tr><td><b>Of satisfactory quality</b></td><td>Free from faults, safe, durable and with an acceptable appearance and finish, taking the price and description into account</td><td>A scooter whose handlebar clamp cracks after a month</td></tr>
 <tr><td><b>Fit for purpose</b></td><td>Fit for the purpose goods of that kind are normally used for, and for any particular purpose the buyer made known</td><td>A buyer says they need a drill for brick; the one the shop recommends can only drill wood</td></tr>
 <tr><td><b>As described</b></td><td>Matching the description, photos, sample or display model</td><td>A table advertised as solid oak that is veneered chipboard</td></tr></table>
 <p>Goods must also be installed correctly if installation is part of the contract, and the seller must have the right to sell them.</p>
 <h4>The consumer’s remedies</h4>
 <table><tr><th>When</th><th>Right</th></tr>
 <tr><td><b>Within 30 days</b></td><td>The <b>short-term right to reject</b>: return the faulty goods for a <b>full refund</b></td></tr>
 <tr><td><b>After 30 days</b></td><td>The retailer has <b>one opportunity to repair or replace</b> the goods, at no cost to the consumer</td></tr>
 <tr><td><b>If that fails</b></td><td>The consumer can ask for a <b>price reduction</b> and keep the goods, or use the <b>final right to reject</b> for a refund (which may be reduced for use after six months)</td></tr>
 <tr><td><b>First 6 months</b></td><td>A fault is <b>presumed to have been there when the goods were sold</b>, unless the retailer can prove otherwise</td></tr>
 <tr><td><b>After 6 months</b></td><td>The consumer has to show the fault was there from the start</td></tr>
 <tr><td><b>Up to 6 years</b> (5 in Scotland)</td><td>A claim can be brought through the courts, if the goods could reasonably be expected to last that long</td></tr></table>
 <h4>Digital content and services</h4>
 <ul><li><b>Digital content</b> (apps, downloads, games, e-books) must also be of satisfactory quality, fit for purpose and as described; the consumer can have it repaired or replaced, and be compensated if it damages their device.</li>
 <li><b>Services</b> (e.g. fitting a kitchen) must be carried out with <b>reasonable care and skill</b>, in a reasonable time and for a reasonable price.</li></ul>
 <p>The Act does not cover fair wear and tear, accidental damage, faults pointed out before purchase, or simply changing your mind (in a shop).</p>` },
 { match: { q: 'Which requirement of the Consumer Rights Act has been broken?', lh: 'Situation', rh: 'Requirement', pairs: [['A kettle’s lid hinge snaps after two weeks of normal use', 'Satisfactory quality'], ['A customer asks for a drill bit to drill brick; the bit the shop recommends only cuts wood', 'Fit for purpose'], ['A phone case arrives in blue when the listing showed red', 'As described'], ['A fitter installs a worktop that is not level', 'Service with reasonable care and skill']] } },
 { order: { q: 'Put the consumer’s remedies for a faulty product in the order they apply.', steps: ['Within 30 days: reject the goods for a full refund', 'After 30 days: the retailer gets one chance to repair or replace', 'If the repair or replacement fails: price reduction, or final right to reject'] } },
 { tf: [
  ['Under the Consumer Rights Act, the consumer’s claim is against the manufacturer.', false, 'The contract is with the retailer who sold the goods.'],
  ['A fault found in the first six months is presumed to have been present when the product was sold.', true, 'It is for the retailer to prove otherwise.'],
  ['The Act gives a right to a refund if you simply change your mind about goods bought in a shop.', false, 'The rights apply to faulty, unfit or misdescribed goods.'],
  ['Digital content such as apps is covered by the Act.', true, 'This was new in 2015.'],
  ['A full refund can be demanded at any time within six years.', false, 'A full refund is automatic only within 30 days; after that the retailer may repair or replace first.'],
 ] },
 { mcq: [
  ['A toaster stops working after three months. What must the retailer be allowed to do first?', ['Nothing: it is out of guarantee', 'Repair or replace it', 'Give a full refund immediately', 'Send the customer to the manufacturer'], 1, 'After 30 days the retailer has one chance to repair or replace.'],
  ['Which is NOT a requirement of goods under the Act?', ['Satisfactory quality', 'Fit for purpose', 'The cheapest available', 'As described'], 2, 'Price is considered when judging quality, but there is no price requirement.'],
 ] },
 { exam: [
  ['**State** two requirements of the Consumer Rights Act 2015 that apply to the sale of a bicycle.', 2, ['Any two: of satisfactory quality; fit for purpose; as described (1)(1)']],
  ['**Describe** the rights of a consumer who buys a faulty product under the Consumer Rights Act 2015.', 3, ['Goods must be of satisfactory quality, fit for purpose and as described (1)', 'Full refund if rejected within 30 days (1)', 'After that, the retailer gets one chance to repair or replace before a refund or price reduction (1)']],
 ] },
]},

{ t: 'Sale of Goods Act 1979 and implications', spec: '10.1b', blocks: [
 { notes: `<h4>Sale of Goods Act 1979</h4>
 <ul><li>The law that, for over 30 years, required goods to be <b>of satisfactory quality</b> (originally “merchantable quality”), <b>fit for purpose</b> and <b>as described</b>.</li>
 <li>The buyer could reject faulty goods within a “<b>reasonable time</b>”, which was never defined and caused disputes.</li>
 <li>For <b>consumer</b> purchases made on or after 1 October 2015 it has been replaced by the Consumer Rights Act. It <b>still applies</b> to <b>business-to-business</b> sales and to goods bought by consumers <b>before</b> that date.</li></ul>
 <table><tr><th></th><th>Sale of Goods Act 1979</th><th>Consumer Rights Act 2015</th></tr>
 <tr><td>Applies to</td><td>Business-to-business sales; consumer sales before October 2015</td><td>Consumer purchases from a trader since October 2015</td></tr>
 <tr><td>Core requirements</td><td>Satisfactory quality, fit for purpose, as described</td><td>The same three</td></tr>
 <tr><td>Time to reject</td><td>“Reasonable time” (unclear)</td><td>A clear <b>30 days</b></td></tr>
 <tr><td>Repairs</td><td>Number of attempts not fixed</td><td><b>One</b> repair or replacement, then refund or price reduction</td></tr>
 <tr><td>Digital content</td><td>Not covered</td><td>Covered</td></tr></table>
 <h4>Implications for consumers</h4>
 <ul><li>Confidence to buy: clear legal rights that cannot be removed by a shop’s own terms (“no refunds” signs have no effect on faulty goods).</li>
 <li>Clear time limits and remedies; rights in addition to any manufacturer’s guarantee.</li>
 <li>Consumers still need proof of purchase and must act promptly.</li></ul>
 <h4>Implications for manufacturers (and designers and retailers)</h4>
 <ul><li>Products must be <b>designed and tested</b> to be safe, durable and able to do everything claimed: materials, tolerances, prototypes, user trials, testing to standards.</li>
 <li><b>Quality assurance and quality control</b> are essential, because retailers pass the cost of faulty goods back to the manufacturer.</li>
 <li><b>Descriptions, packaging, advertising and instructions must be accurate</b>: no exaggerated claims.</li>
 <li>Costs of getting it wrong: refunds, repairs, replacements, <b>product recalls</b>, legal action, lost contracts with retailers and a damaged reputation.</li>
 <li>Encourages spare parts, repair services and clear guarantees; records and batch traceability.</li></ul>` },
 { sort: { h: 'Which Act applies?', q: 'Which Act covers each sale?', cats: ['Consumer Rights Act 2015', 'Sale of Goods Act 1979'], items: [['A student buys headphones from a shop in 2026', 0], ['A furniture maker buys timber from a merchant for its business', 1], ['A parent downloads a paid app for a tablet', 0], ['A factory buys bearings from a supplier', 1], ['A family bought a sofa from a retailer in 2012', 1], ['A cyclist buys a helmet online from a UK retailer today', 0]] } },
 { sort: { h: 'Who is affected?', q: 'Is each mainly an implication for the consumer or for the manufacturer?', cats: ['Consumer', 'Manufacturer'], items: [['Can reject faulty goods within 30 days', 0], ['Must test products so they do what is claimed', 1], ['Bears the cost of recalls and returned goods', 1], ['Has rights that a “no refunds” sign cannot remove', 0], ['Must make sure packaging claims are accurate', 1], ['Can buy with more confidence', 0]] } },
 { mcq: [
  ['What was the main weakness of the Sale of Goods Act for consumers?', ['It did not require goods to be fit for purpose', 'The time allowed to reject faulty goods was an undefined “reasonable time”', 'It only applied to food', 'It banned refunds'], 1, 'The Consumer Rights Act set a clear 30 days.'],
  ['How does consumer law affect the way a product is designed?', ['It has no effect', 'The product must be durable, safe and able to do what is claimed, so it needs thorough testing', 'Products must be made in the UK', 'Products must be sold with a 10-year guarantee'], 1, 'A design that fails early generates refunds and recalls.'],
 ] },
 { exam: [
  ['**Explain** two implications of consumer rights legislation for the manufacturer of a child’s scooter.', 6, ['The scooter must be of satisfactory quality (1), so materials, joints and bearings must be tested for durability and safety (1), otherwise faulty products will be returned at the manufacturer’s cost (1)', 'It must be as described (1), so claims on the packaging such as maximum rider weight must be accurate (1), or the company risks refunds, legal action and damage to its reputation (1)']],
  ['**Explain** one difference between the Consumer Rights Act 2015 and the Sale of Goods Act 1979.', 2, ['The 2015 Act gives a clear 30-day right to reject faulty goods (1) whereas the 1979 Act only gave an undefined “reasonable time” (1)', 'Or: the 2015 Act covers digital content (1), which the 1979 Act did not (1)']],
 ] },
]},

{ t: 'The HSE and health and safety regulations', spec: '10.2a', blocks: [
 { notes: `<h4>The Health and Safety Executive (HSE)</h4>
 <p>The government body responsible for enforcing health and safety law in workplaces such as factories. It:</p>
 <ul><li>publishes <b>guidance</b> and approved codes of practice;</li>
 <li><b>inspects</b> workplaces, with or without warning;</li>
 <li><b>investigates</b> serious accidents, ill health and complaints;</li>
 <li>can issue an <b>improvement notice</b> (put it right by a deadline) or a <b>prohibition notice</b> (stop the activity now);</li>
 <li>can <b>prosecute</b> companies and individuals, leading to unlimited fines and imprisonment.</li></ul>
 <h4>Regulations relevant to manufacturing</h4>
 <p>Regulations made under the Health and Safety at Work Act set out detailed duties. You need an <b>awareness</b> of the main ones:</p>
 <table><tr><th>Regulations</th><th>What they require</th></tr>
 <tr><td><b>Management of Health and Safety at Work</b> Regulations 1999</td><td><b>Risk assessments</b>; arrangements for managing safety; training</td></tr>
 <tr><td><b>PUWER</b>: Provision and Use of Work Equipment Regulations 1998</td><td>Machines and tools must be suitable, maintained, <b>guarded</b>, with emergency stops; users trained</td></tr>
 <tr><td><b>COSHH</b>: Control of Substances Hazardous to Health Regulations 2002</td><td>Assess and control exposure to hazardous substances (page 6)</td></tr>
 <tr><td><b>Personal Protective Equipment at Work</b> Regulations</td><td>Suitable PPE provided free, maintained, with training</td></tr>
 <tr><td><b>Manual Handling Operations</b> Regulations 1992</td><td>Avoid hazardous lifting; assess and reduce the risk; lifting aids</td></tr>
 <tr><td><b>Control of Noise at Work</b> Regulations 2005</td><td>Reduce noise; hearing protection provided at 80 dB(A) and compulsory at 85 dB(A)</td></tr>
 <tr><td><b>RIDDOR</b> 2013</td><td>Report serious injuries, diseases and dangerous occurrences to the HSE</td></tr>
 <tr><td><b>Display Screen Equipment</b> Regulations 1992</td><td>Workstation assessments and breaks for computer users</td></tr>
 <tr><td><b>Safety Signs and Signals</b> Regulations 1996</td><td>Standard safety signs where risks remain</td></tr></table>` },
 { match: { q: 'Match the regulations to what they cover.', lh: 'Regulations', rh: 'Covers', pairs: [['PUWER', 'Safe, guarded and maintained machinery'], ['COSHH', 'Hazardous substances such as solvents and dust'], ['RIDDOR', 'Reporting serious accidents to the HSE'], ['Manual Handling Operations Regulations', 'Lifting and carrying'], ['Control of Noise at Work Regulations', 'Hearing protection'], ['Management of Health and Safety at Work Regulations', 'Risk assessments']] } },
 { sort: { h: 'HSE notices', q: 'Which notice would an HSE inspector issue?', cats: ['Improvement notice', 'Prohibition notice'], items: [['Risk assessments are out of date and must be redone within a month', 0], ['A power press is being used with its guard removed', 1], ['Extraction needs testing and certifying', 0], ['Workers are on a roof with no edge protection', 1], ['Safety signs are missing from the paint store', 0]] } },
 { mcq: [
  ['What is the role of the HSE?', ['To sell safety equipment', 'To enforce health and safety law through guidance, inspection, investigation and prosecution', 'To test consumer products', 'To write British Standards'], 1, 'It is the regulator for workplaces.'],
  ['What does a prohibition notice do?', ['Gives a company a month to improve', 'Stops a dangerous activity immediately until it is made safe', 'Fines every employee', 'Closes the company permanently'], 1, 'It is used where there is a risk of serious injury.'],
 ] },
 { exam: [
  ['**Describe** the role of the Health and Safety Executive.', 3, ['Provides guidance and codes of practice on working safely (1)', 'Inspects workplaces and investigates accidents (1)', 'Enforces the law: improvement/prohibition notices and prosecution (1)']],
  ['**Explain** one way in which the Provision and Use of Work Equipment Regulations affect a furniture manufacturer.', 3, ['Machines such as saws and routers must be suitable, maintained and fitted with guards and emergency stops (1), so the company must inspect and service them regularly and keep records (1), and may only allow trained operators to use them (1)']],
 ] },
]},

{ t: 'Health and Safety at Work etc Act 1974', spec: '10.2b', blocks: [
 { notes: `<p>The Health and Safety at Work etc Act 1974 (<b>HASAWA</b>) is the main piece of UK health and safety law. The spec calls it “the procedures to safeguard the risk of injury to people”. It places duties on everyone at work.</p>
 <h4>Employers’ duties</h4>
 <p>To ensure, “so far as is reasonably practicable”, the health, safety and welfare of employees, and of others affected (visitors, contractors, the public):</p>
 <ul><li>safe <b>machinery and systems of work</b>, properly maintained;</li>
 <li>safe <b>use, handling, storage and transport</b> of materials and substances;</li>
 <li><b>information, instruction, training and supervision</b>;</li>
 <li>a safe <b>workplace</b>, with safe ways in and out;</li>
 <li>a healthy working environment and <b>welfare</b> facilities (toilets, washing, drinking water, first aid);</li>
 <li>a written <b>health and safety policy</b> (five or more employees);</li>
 <li><b>PPE provided free of charge</b>.</li></ul>
 <h4>Employees’ duties</h4>
 <ul><li>Take <b>reasonable care</b> of their own health and safety and that of others.</li>
 <li><b>Cooperate</b> with the employer: follow training and procedures, wear the PPE provided.</li>
 <li><b>Not interfere with or misuse</b> anything provided for safety, such as guards and fire extinguishers.</li>
 <li>Report hazards and accidents.</li></ul>
 <p>Designers, manufacturers and suppliers of equipment and substances for use at work also have a duty to make sure they are safe and come with information.</p>
 <h4>Personal protective equipment (PPE)</h4>
 <table><tr><th>PPE</th><th>Protects against</th></tr>
 <tr><td>Safety glasses, goggles, face shield, welding mask</td><td>Flying particles, splashes, sparks, UV light</td></tr>
 <tr><td>Ear defenders, ear plugs</td><td>Noise</td></tr>
 <tr><td>Dust mask, respirator</td><td>Dust, fumes, vapours</td></tr>
 <tr><td>Gloves (leather, heat-proof, chemical-resistant, cut-resistant)</td><td>Heat, chemicals, sharp edges</td></tr>
 <tr><td>Safety boots, hard hat, apron, overalls, high-visibility clothing</td><td>Falling objects, spills, heat, vehicles</td></tr></table>
 <p>PPE is the <b>last resort</b>, used when a risk cannot be controlled in another way. It must be suitable, fit properly, be maintained and stored, and workers must be trained to use it.</p>
 <h4>Signage</h4>
 <table><tr><th>Sign</th><th>Appearance</th><th>Meaning</th></tr>
 <tr><td>Prohibition</td><td>Red circle with diagonal line</td><td>Must not</td></tr>
 <tr><td>Mandatory</td><td>Blue circle</td><td>Must do</td></tr>
 <tr><td>Warning</td><td>Yellow triangle, black border</td><td>Hazard</td></tr>
 <tr><td>Safe condition</td><td>Green rectangle</td><td>Exits, first aid</td></tr>
 <tr><td>Fire equipment</td><td>Red rectangle</td><td>Extinguishers, alarms</td></tr></table>
 <h4>Warning symbols on substances</h4>
 <p>Hazardous chemicals carry <b>red-bordered diamond pictograms</b> with a black symbol: <b>flame</b> (flammable), <b>flame over circle</b> (oxidising), <b>skull and crossbones</b> (acutely toxic), <b>corrosion</b> (corrosive), <b>exclamation mark</b> (irritant, harmful), <b>health hazard</b> silhouette (long-term harm such as cancer or breathing damage), <b>exploding bomb</b> (explosive), <b>gas cylinder</b> (gas under pressure), <b>dead tree and fish</b> (harmful to the environment).</p>` },
 { sort: { h: 'Whose duty?', q: 'Under HASAWA, is each a duty of the employer or the employee?', cats: ['Employer', 'Employee'], items: [['Provide PPE free of charge', 0], ['Wear the PPE provided', 1], ['Provide training and supervision', 0], ['Not remove or misuse guards', 1], ['Maintain machinery in a safe condition', 0], ['Take reasonable care of others at work', 1], ['Provide first-aid and welfare facilities', 0], ['Follow safe working procedures', 1]] } },
 { match: { q: 'Match the warning pictogram to its meaning.', lh: 'Pictogram', rh: 'Meaning', pairs: [['Flame', 'Flammable'], ['Skull and crossbones', 'Acutely toxic'], ['Liquid dripping onto a hand and a surface', 'Corrosive'], ['Exclamation mark', 'Irritant or harmful'], ['Dead tree and fish', 'Harmful to the environment'], ['Flame over a circle', 'Oxidising']] } },
 { mcq: [
  ['Who pays for PPE that is needed at work?', ['The employee', 'The employer', 'The HSE', 'The supplier'], 1, 'Employers must provide it free of charge.'],
  ['What does “so far as is reasonably practicable” mean?', ['Only if it is free', 'The employer must weigh the risk against the cost, time and effort of reducing it', 'Only when inspectors visit', 'Safety is optional'], 1, 'Serious risks justify significant expense.'],
  ['An employee removes a machine guard to work faster and is injured. Who has broken the law?', ['Nobody', 'The employee, and possibly the employer too if supervision and training were poor', 'Only the employer', 'The machine manufacturer'], 1, 'Employees must not interfere with safety equipment; employers must supervise.'],
 ] },
 { exam: [
  ['**State** two duties of an employee under the Health and Safety at Work etc Act 1974.', 2, ['Any two: take reasonable care of own and others’ safety; cooperate with the employer/follow training; not misuse safety equipment; wear PPE provided; report hazards (1)(1)']],
  ['**Explain** two ways in which the Health and Safety at Work etc Act 1974 affects an employer in a manufacturing company.', 6, ['Must provide and maintain safe machinery (1), so guards, emergency stops and regular servicing are needed (1), which costs money and production time but prevents injuries (1)', 'Must provide information, training and supervision (1), so new staff are trained before using machines and records are kept (1), reducing accidents and protecting the company from prosecution (1)', 'Accept PPE, safe storage of substances, safe workplace/welfare, each with two linked justifications']],
  ['**Explain** why safety signs use standard colours and shapes.', 2, ['They are recognised instantly without reading, whatever language the worker speaks (1)', 'so the type of instruction or hazard is understood quickly and consistently in every workplace (1)']],
 ] },
]},

{ t: 'COSHH and VOCs', spec: '10.2c', blocks: [
 { notes: `<h4>COSHH</h4>
 <p>The Control of Substances Hazardous to Health Regulations require employers to protect people from hazardous substances: chemicals, fumes, vapours, dusts (including wood dust), gases and biological agents. The employer must:</p>
 <ol><li><b>Assess</b> the risks: which substances, who is exposed, how and for how long (a COSHH assessment, using the supplier’s <b>safety data sheet</b>).</li>
 <li><b>Prevent</b> exposure where possible: eliminate the substance or <b>substitute</b> a safer one.</li>
 <li><b>Control</b> exposure where it cannot be prevented: enclosure, extraction (LEV), ventilation, safe procedures, then PPE.</li>
 <li><b>Maintain</b> and test the controls (LEV at least every 14 months).</li>
 <li><b>Monitor</b> exposure and provide <b>health surveillance</b> where needed.</li>
 <li><b>Inform, instruct and train</b> employees; plan for spills and emergencies.</li></ol>
 <h4>Volatile organic compounds (VOCs)</h4>
 <p>VOCs are carbon-based chemicals that <b>evaporate easily at room temperature</b>. They are the solvents in <b>solvent-based</b> paints, varnishes, lacquers, wood stains, spray paints, contact and solvent adhesives, polyester resin (styrene), thinners, white spirit and cleaning fluids.</p>
 <table><tr><th>Hazard</th><th>Detail</th></tr>
 <tr><td><b>Health: short term</b></td><td>Headaches, dizziness, nausea, drowsiness; irritation of eyes, nose, throat and skin</td></tr>
 <tr><td><b>Health: long term</b></td><td>Damage to the liver, kidneys and nervous system; asthma and dermatitis; some are linked to cancer</td></tr>
 <tr><td><b>Fire and explosion</b></td><td>Vapours are highly flammable and heavier than air, so they collect at low level</td></tr>
 <tr><td><b>Environment</b></td><td>React in sunlight to form ground-level ozone and smog; pollute water if poured away</td></tr></table>
 <h4>Storage of solvent-based substances</h4>
 <ul><li>In a <b>locked, labelled, fire-resistant (metal) cabinet</b>, with ventilation, away from heat and sources of ignition.</li>
 <li>In the <b>original, sealed, labelled containers</b>; lids replaced at once; never decanted into unlabelled bottles.</li>
 <li><b>Minimum quantities</b> kept; stock recorded; safety data sheets and COSHH assessments available.</li>
 <li>Spill kit and the correct fire extinguisher nearby; bunded shelves to contain leaks.</li></ul>
 <h4>Use of solvent-based substances</h4>
 <ul><li><b>Substitute</b> first: water-based, low-VOC, powder coating or UV-cured finishes.</li>
 <li>Use in a <b>spray booth, fume cupboard or with local exhaust ventilation</b>; good general ventilation.</li>
 <li>No naked flames, sparks or smoking; small quantities; lids on.</li>
 <li>PPE: correct <b>respirator</b> (a dust mask does not stop vapour), chemical-resistant gloves, goggles, overalls.</li>
 <li>Limit the time each person is exposed; wash hands; no eating or drinking.</li>
 <li><b>Dispose</b> of waste, rags and empty containers as hazardous waste: never down the drain. Solvent-soaked rags go in a closed metal bin.</li></ul>
 <p>VOC limits in paints and finishes are also set by law, which is why most decorative paints are now water-based.</p>` },
 { order: { q: 'Put the COSHH steps in a sensible order.', steps: ['Assess the risks from the substance', 'Prevent exposure: eliminate or substitute', 'Control remaining exposure with extraction and safe procedures', 'Maintain and test the control measures', 'Monitor exposure and workers’ health', 'Review the assessment regularly'] } },
 { sort: { h: 'Contains VOCs?', q: 'Is each product likely to release significant VOCs?', cats: ['High in VOCs', 'Low or no VOCs'], items: [['Cellulose spray lacquer', 0], ['Water-based acrylic varnish', 1], ['Contact adhesive', 0], ['PVA wood glue', 1], ['White spirit', 0], ['Powder coating', 1], ['Polyester resin', 0]] } },
 { tf: [
  ['A paper dust mask gives good protection against solvent vapour.', false, 'A respirator with the correct filter is needed; a dust mask only stops particles.'],
  ['Solvent vapours are heavier than air and can collect at floor level.', true, 'This is why ventilation and keeping ignition sources away matter.'],
  ['Under COSHH, the first choice is to give workers PPE.', false, 'Eliminate or substitute first; PPE is the last resort.'],
  ['Solvent-based finishes should be stored in a locked, fire-resistant cabinet.', true, 'With labels, sealed lids and ventilation.'],
  ['Leftover thinners can safely be poured down the sink.', false, 'They must be disposed of as hazardous waste.'],
 ] },
 { exam: [
  ['**Describe** how COSHH regulations affect the use of solvent-based finishes in a school workshop.', 3, ['The risks of the substance, e.g. VOC fumes, must be assessed (1)', 'Stored in a labelled, locked, fire-resistant cupboard (1)', 'Used with ventilation or extraction and PPE such as gloves and a mask (1)', 'Accept: substitute a water-based / low-VOC finish where possible (1)']],
  ['**Explain** two hazards of using solvent-based adhesives that contain VOCs.', 4, ['Vapour is breathed in (1), causing headaches and dizziness, and long-term organ damage (1)', 'Vapour is highly flammable (1), so a spark or flame could cause a fire or explosion (1)', 'Accept environmental harm: VOCs contribute to ground-level ozone/smog (1)(1)']],
  ['A manufacturer of wooden toys sprays its products with a solvent-based lacquer. **Discuss** how the company could meet its responsibilities under the COSHH regulations.', 6, ['COSHH assessment using safety data sheets: who is exposed and how', 'Prevent: change to water-based lacquer, which also suits toy safety standards', 'Control: enclosed or automated spray booth with extraction; ventilation; limited exposure time', 'Storage: locked, fire-resistant, ventilated cabinet; minimum stock; labelled containers', 'PPE: respirators, gloves, overalls; training; health surveillance; maintenance and testing of extraction; safe disposal'],],
 ] },
]},

{ t: 'Impact on designing and making; consequences of non-adherence', spec: '10.2', blocks: [
 { notes: `<h4>Impact on the designing process</h4>
 <ul><li>Designers must design products that can be <b>made safely</b>: avoiding hazardous materials, finishes and processes where a safer alternative exists (water-based finishes, mechanical fixings instead of solvent adhesives).</li>
 <li>Products for use at work, and machines, must be designed to be safe: guards, interlocks, emergency stops, clear controls, warning labels and instructions.</li>
 <li>Risk assessment is built into design and planning; designers working at screens are covered too.</li>
 <li>Safer choices can limit materials and finishes, and add cost and development time.</li></ul>
 <h4>Impact on the making process</h4>
 <ul><li>Risk assessments and COSHH assessments before work starts.</li>
 <li>Investment in guarding, extraction, PPE, signage, storage, training and maintenance.</li>
 <li>Safe procedures can slow production, but fewer accidents mean less lost time, lower insurance costs and a more motivated workforce.</li>
 <li>Records must be kept: training, maintenance, inspections, accidents.</li></ul>
 <h4>Consequences of non-adherence</h4>
 <table><tr><th>For…</th><th>Consequences</th></tr>
 <tr><td><b>Employees</b></td><td>Injury, long-term ill health or death; loss of earnings; they can also be disciplined, dismissed or prosecuted for breaking safety rules</td></tr>
 <tr><td><b>The company</b></td><td>HSE improvement or prohibition notices; production stopped; <b>prosecution</b> with <b>unlimited fines</b>; compensation claims; higher insurance premiums; lost orders and <b>damaged reputation</b>; difficulty recruiting; in the worst cases closure, or a charge of corporate manslaughter</td></tr>
 <tr><td><b>Directors and managers</b></td><td>Personal prosecution; fines; <b>imprisonment</b>; disqualification from being a director</td></tr>
 <tr><td><b>Society</b></td><td>Cost of healthcare and benefits; harm to families and communities; environmental damage from spills and emissions</td></tr></table>` },
 { sort: { h: 'Who bears the consequence?', q: 'Sort each consequence of ignoring health and safety law.', cats: ['Employee', 'Company', 'Director or manager'], items: [['Long-term lung damage from dust', 0], ['An unlimited fine imposed on the business after prosecution', 1], ['A prison sentence for gross negligence', 2], ['Production halted by a prohibition notice', 1], ['Loss of earnings while injured', 0], ['Disqualification from running a company', 2], ['Higher insurance premiums', 1]] } },
 { mcq: [
  ['How can health and safety law influence a designer’s choice of finish?', ['It cannot', 'A water-based or powder finish may be chosen to avoid VOCs and the controls they need', 'Only solvent-based finishes are legal', 'Finishes are not covered by the law'], 1, 'Substitution is the preferred control under COSHH.'],
  ['Which is a benefit to a company of following health and safety law?', ['Slower production with no gain', 'Fewer accidents, less lost time and lower insurance and legal costs', 'Fewer orders', 'Higher fines'], 1, 'Good safety is good business.'],
 ] },
 { exam: [
  ['**Explain** three consequences for a manufacturing company of failing to follow health and safety legislation.', 9, ['The HSE can issue a prohibition notice (1), stopping the process or the whole site (1), so orders are delayed and income is lost (1)', 'The company can be prosecuted (1) and given an unlimited fine, with managers facing imprisonment (1), which may threaten the survival of the business (1)', 'An injured employee can claim compensation (1), and insurance premiums rise (1), while the damage to its reputation loses customers and makes recruitment harder (1)']],
  ['**Discuss** the impact of health and safety legislation on the manufacture of products.', 6, ['Costs: guarding, extraction, PPE, training, assessments, record keeping, slower processes', 'Benefits: fewer injuries and illness, less lost time, lower insurance and legal costs, better morale and reputation', 'Affects choice of materials, finishes and processes: substitution of hazardous substances', 'Consequences of ignoring it: notices, fines, imprisonment, closure'],],
 ] },
]},

{ t: 'Mixed exam practice', spec: '10.1–10.2', blocks: [
 { exam: [
  ['**Give** the meaning of the abbreviation COSHH.', 1, ['Control of Substances Hazardous to Health (1)']],
  ['A customer buys a cordless drill. After four months the battery will no longer hold its charge. **Explain** the customer’s rights under the Consumer Rights Act 2015.', 3, ['The drill is not of satisfactory quality / not durable (1)', 'As it is within six months, the fault is presumed to have been present at purchase (1)', 'It is after 30 days, so the retailer has one opportunity to repair or replace it; if that fails the customer can have a price reduction or a refund (1)']],
  ['**Explain** two reasons why a manufacturer displays mandatory safety signs next to its machines.', 4, ['To instruct workers which PPE or action is required, e.g. eye protection (1), reducing the chance of injury (1)', 'To meet its legal duty to inform employees of risks (1), protecting the company from prosecution or claims (1)']],
  ['A small company makes skateboards. It laminates maple veneers with epoxy resin and sprays the decks with solvent-based lacquer. **Evaluate** how current legislation affects the way the company designs and makes its products.', 12, ['Consumer law: decks must be of satisfactory quality, fit for purpose and as described: testing of strength and durability, accurate claims, QA; refunds and recalls if not', 'HASAWA: safe machines (presses, routers, sanders), guarding, training, PPE, signage; duties of employees', 'COSHH: assessments for epoxy resin, lacquer and wood dust; substitution with water-based finishes; extraction and spray booth; storage in fire-resistant cabinet; respirators and gloves; health surveillance', 'Costs and constraints for a small company against benefits: safe workforce, reputation, fewer returns, avoiding prosecution', 'Design changes prompted by the law, e.g. different finish or adhesive', 'A reasoned overall judgement'],],
 ] },
 { nea: 'Which legislation applies to your own NEA? Note one way consumer law affects your product (what must it be fit for, and how did you test that?) and one COSHH or workshop safety precaution you took while making it.' },
]},

]});
