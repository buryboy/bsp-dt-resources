/* 3.2.3 Ecological and social footprint (AQA 8552, specialist technical principles) */
SPEC.push(
 ['q9a', 9, '3.2.3', 'Ecological issues', 'Deforestation, mining, drilling and farming · mileage of a product from raw material to final disposal · carbon produced during manufacture', '**Explain** two ecological problems caused by deforestation.', 4, ['Trees absorb carbon dioxide, so with fewer trees more stays in the air (1), which adds to global warming (1)', 'The habitat of animals and plants is destroyed (1), so species decline or become extinct (1)', 'Accept: roots no longer hold the soil (1), causing soil erosion, landslides and flooding (1)']],
 ['q9b', 9, '3.2.3', 'The six Rs', 'Reduce · refuse · re-use · repair · recycle · rethink', '**Explain** how a designer of a drinks bottle could apply two of the six Rs.', 4, ['Reduce: make the walls thinner / the bottle smaller (1) so less polymer and energy is used for each one (1)', 'Recycle: make it from one polymer such as PET and mark it with the recycling symbol (1) so it can be collected and remade into new products (1)', 'Accept any two of reduce, refuse, re-use, repair, recycle, rethink, each applied to the bottle with a reason']],
 ['q9c', 9, '3.2.3', 'Social issues', 'Safe working conditions · reducing oceanic and atmospheric pollution · reducing the detrimental impact on others', '**Explain** why a company should make sure that the factories that supply it have safe working conditions.', 2, ['Workers should not be injured or made ill by machines, chemicals, dust or long hours (1)', 'It is ethically right and protects the company’s reputation with customers / avoids accidents that stop production (1)']],
);
BOOKLETS.push({ id: 'g9', topic: 9, title: 'Ecological and social footprint', pages: [

{ t: 'Overview and key words', blocks: [
 { notes: `<p class="lead">Every product leaves a <b>footprint</b>: a mark on the planet (<b>ecological</b>) and on people (<b>social</b>). Designers are expected to make both as small as they can.</p>
 <table><tr><th>Page</th><th>What it covers</th></tr>
 <tr><td>2</td><td>Ecological issues: getting the raw materials, product miles and carbon</td></tr>
 <tr><td>3</td><td>The six Rs</td></tr>
 <tr><td>4</td><td>Social issues, then exam practice</td></tr></table>
 <p>This topic is a favourite for the <b>long-answer question</b> in Section B. You need facts, examples and both sides of the argument.</p>` },
 { keys: [
  ['Ecological footprint', 'The impact a product has on the environment over its whole life'],
  ['Social footprint', 'The impact a product has on people and communities'],
  ['Carbon footprint', 'The amount of carbon dioxide released in making, transporting, using and disposing of a product'],
  ['Deforestation', 'Cutting down forests without replacing the trees'],
  ['Product miles', 'The total distance a product and its materials travel, from raw material to disposal'],
  ['Life cycle assessment', 'A study of a product’s environmental impact at every stage of its life'],
  ['Reduce', 'Use less material and energy'],
  ['Refuse', 'Say no to materials or products that are not needed or are harmful'],
  ['Re-use', 'Use a product again, for the same or a different job, without reprocessing it'],
  ['Repair', 'Mend a product instead of throwing it away'],
  ['Recycle', 'Reprocess the material of a used product into something new'],
  ['Rethink', 'Find a better way to design the product or do the job'],
 ] },
]},

{ t: 'Ecological issues', spec: '3.2.3', blocks: [
 { notes: `<h4>Getting the raw materials</h4>
 <table><tr><th>Activity</th><th>For which materials</th><th>Ecological problems</th></tr>
 <tr><td><b>Deforestation</b></td><td>Timber, paper and board; clearing land for farming</td><td>Less carbon dioxide absorbed, so more global warming; habitats destroyed; soil erosion and flooding</td></tr>
 <tr><td><b>Mining</b></td><td>Metal ores (iron, bauxite for aluminium, copper), coal</td><td>Large scars on the landscape; habitats lost; waste rock; toxic chemicals can pollute rivers; heavy use of energy and water</td></tr>
 <tr><td><b>Drilling</b></td><td>Crude oil and gas, for polymers, synthetic fibres and fuel</td><td>Oil spills kill wildlife; a finite resource is used up; burning releases carbon dioxide</td></tr>
 <tr><td><b>Farming</b></td><td>Cotton, wool, leather, crops for bio-based polymers</td><td>Cotton needs huge amounts of water, pesticides and fertiliser; land is cleared; chemicals run off into rivers</td></tr></table>
 <h4>Product miles</h4>
 <p>Count the distance at every stage: <b>raw material source → manufacture → distribution → user location → final disposal</b>. A T-shirt may be grown in India, woven in China, sewn in Bangladesh and sold in France. Every journey burns fuel and releases carbon dioxide.</p>
 <p><b>To reduce it:</b> source materials locally, make the product near where it is sold, ship flat-packed so more fit in each lorry, and use sea or rail instead of air.</p>
 <h4>Carbon produced during manufacture</h4>
 <p>Extracting, refining and processing materials uses a lot of energy, mostly from fossil fuels. Making new aluminium or steel, firing bricks and making cement are among the worst. <b>To reduce it:</b> use recycled material (recycled aluminium needs only about 5% of the energy of new), use renewable energy in the factory, and choose efficient processes.</p>` },
 { match: { q: 'Match each raw material to how it is obtained.', lh: 'Material', rh: 'Obtained by', pairs: [['Aluminium', 'Mining bauxite ore'], ['Polypropylene', 'Drilling for crude oil'], ['Cotton', 'Farming'], ['Pine', 'Felling trees'], ['Wool', 'Rearing sheep']] } },
 { order: { q: 'Put the stages that add to a product’s mileage in order.', steps: ['Raw material source', 'Manufacture', 'Distribution to shops or warehouses', 'User location', 'Final disposal'] } },
 { mcq: [
  ['Which change would most reduce the carbon footprint of an aluminium can?', ['Painting it a different colour', 'Making it from recycled aluminium', 'Making it heavier', 'Shipping it by air'], 1, 'Recycling aluminium uses about 5% of the energy of making it from ore.'],
  ['Which crop is known for needing very large amounts of water and pesticides?', ['Cotton', 'Larch', 'Bamboo', 'Hemp'], 0, 'Conventional cotton farming is very thirsty.'],
 ] },
]},

{ t: 'The six Rs', spec: '3.2.3', blocks: [
 { notes: `<table><tr><th>R</th><th>What it means</th><th>What a designer can do</th><th>What a consumer can do</th></tr>
 <tr><td><b>Reduce</b></td><td>Use less</td><td>Thinner walls, fewer parts, less packaging, less energy in use</td><td>Buy fewer, longer-lasting products</td></tr>
 <tr><td><b>Refuse</b></td><td>Say no</td><td>Refuse to use toxic, unsustainable or unnecessary materials</td><td>Refuse carrier bags and over-packaged goods</td></tr>
 <tr><td><b>Re-use</b></td><td>Use again without reprocessing</td><td>Design refillable containers and products with a second use</td><td>Refill a water bottle; pass clothes on; use a jar for storage</td></tr>
 <tr><td><b>Repair</b></td><td>Mend it</td><td>Use screws not glue; sell spare parts; make it easy to take apart</td><td>Fix it instead of replacing it</td></tr>
 <tr><td><b>Recycle</b></td><td>Reprocess the material</td><td>Use one material where possible; label polymers; make parts easy to separate</td><td>Sort waste into the right bins</td></tr>
 <tr><td><b>Rethink</b></td><td>Find a better way</td><td>Question the whole design: is there a way to do the job with less harm?</td><td>Ask “do I really need this?”</td></tr></table>
 <p><b>Re-use is better than recycle.</b> Recycling still needs energy to collect, sort and reprocess. Re-using needs almost none.</p>
 <p><b>Three kinds of recycling:</b> <i>primary</i> is passing a product on to be used again (charity shops); <i>secondary</i> is reprocessing the material into something new (bottles into fleece); <i>tertiary</i> is breaking it down chemically into raw materials.</p>` },
 { match: { q: 'Which of the six Rs is it?', lh: 'Action', rh: 'R', pairs: [['Making a bottle with thinner walls', 'Reduce'], ['Not using a toxic paint', 'Refuse'], ['Refilling a shampoo bottle at a shop', 'Re-use'], ['Replacing a cracked phone screen', 'Repair'], ['Melting old cans to make new ones', 'Recycle'], ['Selling the product as a download instead of on a disc', 'Rethink']] } },
 { tf: [
  ['Recycling uses no energy.', false, 'Collecting, sorting and reprocessing all use energy, though usually far less than making new material.'],
  ['Re-using a product is generally better for the environment than recycling it.', true, 'No reprocessing is needed.'],
  ['Designing a product so it can be taken apart with a screwdriver helps both repair and recycling.', true, 'Parts can be replaced, and materials separated.'],
 ] },
 { exam: [
  ['**Explain** the difference between re-using and recycling a glass bottle.', 2, ['Re-use: the bottle is washed and filled again as it is (1)', 'Recycle: it is crushed, melted and made into a new glass product, which uses more energy (1)']],
 ] },
]},

{ t: 'Social issues and exam practice', spec: '3.2.3', blocks: [
 { notes: `<table><tr><th>Social issue</th><th>What it means</th><th>What can be done</th></tr>
 <tr><td><b>Safe working conditions</b></td><td>People who make products should not be harmed: no dangerous machines without guards, toxic fumes, unsafe buildings, excessive hours or child labour</td><td>Buy from audited suppliers; Fairtrade; follow health and safety law; pay a fair wage</td></tr>
 <tr><td><b>Reducing oceanic pollution</b></td><td>Polymer waste and microfibres from synthetic clothing end up in the sea, where they harm wildlife and enter the food chain. Factory waste and dyes pollute rivers</td><td>Less single-use polymer; biodegradable or recyclable packaging; treating waste water</td></tr>
 <tr><td><b>Reducing atmospheric pollution</b></td><td>Factories and transport release carbon dioxide, smoke and other gases that cause global warming, acid rain and breathing problems</td><td>Renewable energy; filters on chimneys; local manufacture; efficient machines</td></tr>
 <tr><td><b>Reducing the detrimental impact on others</b></td><td>A product should not make life worse for other people: noise, litter, traffic, communities moved for a mine or dam</td><td>Consult local people; design quieter, cleaner products; plan for disposal</td></tr></table>
 <p>The <b>ecological</b> footprint is about the planet. The <b>social</b> footprint is about people. Many issues, such as pollution, affect both.</p>` },
 { sort: { q: 'Mainly an ecological issue or mainly a social issue?', cats: ['Ecological', 'Social'], items: [['Rainforest cleared for timber', 0], ['Workers paid less than a living wage', 1], ['Carbon dioxide from shipping goods by air', 0], ['A factory with no fire exits', 1], ['An open-cast mine destroying a habitat', 0], ['Children working instead of going to school', 1]] } },
 { mcq: [
  ['Which of the six Rs means “find a better way of doing the job”?', ['Reduce', 'Refuse', 'Rethink', 'Repair'], 2, 'Rethink questions the whole design.'],
  ['Which is a social footprint issue?', ['Soil erosion', 'Unsafe working conditions in a factory', 'Loss of animal habitat', 'Use of a finite resource'], 1, 'It is about the effect on people.'],
  ['Synthetic clothing can pollute the oceans because…', ['it is made from cotton', 'tiny fibres wash out in the laundry and do not biodegrade', 'it dissolves in sea water', 'it is heavier than water'], 1, 'Microfibres pass through water treatment and into the sea.'],
 ] },
 { exam: [
  ['**Give** two ways a manufacturer could reduce the number of miles a product travels.', 2, ['Source raw materials locally (1)', 'Manufacture the product in or near the country where it is sold (1)', 'Accept: flat-pack so fewer journeys are needed (1)']],
  ['**Explain** how the mining of metal ores can damage the environment.', 3, ['Large areas of land are dug up, destroying habitats and scarring the landscape (1)', 'Waste rock and chemicals used in extraction can pollute soil and rivers (1)', 'Extraction and refining use a great deal of energy, releasing carbon dioxide (1)']],
  ['**Analyse** and **evaluate** the ecological and social footprint of a cotton T-shirt that is grown and made overseas and sold cheaply in Europe.', 8, ['Farming: cotton uses very large amounts of water, pesticides and fertiliser; land may be cleared for it', 'Manufacture: dyeing and finishing use chemicals and water that can pollute rivers; energy from fossil fuels', 'Product miles: fibre, fabric and garment are often made in different countries, then shipped; carbon dioxide from transport', 'Social: low wages, long hours and unsafe factories are possible where the price is forced down', 'Social: on the other hand, the industry gives jobs and income; Fairtrade and audited suppliers improve conditions', 'End of life: cheap “fast fashion” is worn a few times and thrown away, though cotton is biodegradable and can be re-used or recycled', 'Improvements: organic or Fairtrade cotton, local manufacture, better quality so it lasts, take-back schemes', 'Judgement on whether the low price is worth the footprint']],
 ] },
 { nea: 'A short life cycle assessment of your NEA product (materials, making, transport, use, disposal) with one improvement at each stage is a strong addition to your evaluation.' },
]},

]});
