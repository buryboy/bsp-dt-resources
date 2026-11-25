/* 3.1.2 Energy generation and storage (AQA 8552, core technical principles) */
SPEC.push(
 ['q2a', 2, '3.1.2', 'Fossil fuels and nuclear power', 'How power is generated from coal, gas and oil · nuclear power · arguments for and against', '**Explain** one advantage and one disadvantage of generating electricity from fossil fuels.', 4, ['Advantage: reliable, can generate at any time and output can be raised to meet demand (1), so supply does not depend on the weather (1)', 'Disadvantage: burning them releases carbon dioxide (1), which contributes to global warming (1)', 'Accept: finite, so will run out and prices rise; sulfur dioxide causes acid rain']],
 ['q2b', 2, '3.1.2', 'Renewable energy', 'Wind, solar, tidal, hydro-electrical and biomass · arguments for and against', '**Explain** one advantage and one disadvantage of using wind turbines to generate electricity.', 4, ['Advantage: wind is non-finite and free (1) and no carbon dioxide is released while generating (1)', 'Disadvantage: output depends on the wind, so it is not reliable (1) and a backup or storage is needed (1)', 'Accept: visual and noise impact; can harm birds and bats; high set-up cost']],
 ['q2c', 2, '3.1.2', 'Storage systems and batteries', 'Kinetic pumped storage · alkaline and rechargeable batteries', '**Explain** why a cordless drill uses a rechargeable battery rather than alkaline batteries.', 2, ['It can be recharged and reused hundreds of times (1)', 'so it costs less over the life of the drill and fewer batteries are thrown away (1)', 'Accept: lithium-ion delivers the high current a motor needs (1)']],
);
BOOKLETS.push({ id: 'g2', topic: 2, title: 'Energy generation and storage', pages: [

{ t: 'Overview and key words', blocks: [
 { notes: `<p class="lead">Every product needs energy: to make it, to move it and often to use it. You need to know <b>how electricity is generated</b>, the arguments <b>for and against</b> each source, and how energy is <b>stored</b>.</p>
 <table><tr><th>Page</th><th>What it covers</th></tr>
 <tr><td>2</td><td>Fossil fuels and nuclear power</td></tr>
 <tr><td>3</td><td>Renewable energy: wind, solar, tidal, hydro-electric, biomass</td></tr>
 <tr><td>4</td><td>Energy storage systems and batteries, then exam practice</td></tr></table>
 <h4>How most power stations work</h4>
 <p>Nearly every source does the same job in the end: it <b>spins a turbine</b>, the turbine <b>turns a generator</b>, and the generator makes electricity.</p>
 <p><b>Fuel is burned (or atoms are split) → heats water into steam → steam spins a turbine → turbine turns a generator → electricity.</b></p>
 <p>Wind, tidal and hydro-electric power spin the turbine directly, with no steam. Solar panels are the exception: they have no turbine at all.</p>` },
 { keys: [
  ['Fossil fuel', 'Coal, oil or natural gas, formed over millions of years from dead plants and animals'],
  ['Renewable energy', 'Energy from a source that will not run out, such as wind, sun or moving water'],
  ['Turbine', 'A set of blades that spins when steam, water or wind pushes past it'],
  ['Generator', 'A machine that turns the spinning movement of a turbine into electricity'],
  ['Nuclear fission', 'Splitting uranium atoms to release a large amount of heat'],
  ['Biomass', 'Plant or animal material, such as wood pellets or crops, burned as fuel'],
  ['Photovoltaic (PV) cell', 'A solar cell that turns light straight into electricity'],
  ['Pumped storage', 'Water is pumped uphill when electricity is spare, then released through turbines when it is needed'],
  ['Alkaline battery', 'A single-use battery that is thrown away when flat'],
  ['Rechargeable battery', 'A battery that can be charged and used again many times'],
  ['Carbon dioxide', 'A greenhouse gas released when fossil fuels and biomass are burned'],
 ] },
]},

{ t: 'Fossil fuels and nuclear power', spec: '3.1.2', blocks: [
 { notes: `<h4>Fossil fuels: coal, gas and oil</h4>
 <p>The fuel is burned to boil water. The steam spins a turbine connected to a generator.</p>
 <table><tr><th>Arguments for</th><th>Arguments against</th></tr>
 <tr><td><ul><li><b>Reliable:</b> works day and night, whatever the weather</li><li>Output can be turned up quickly when demand rises (especially gas)</li><li>The power stations and supply network already exist</li><li>A lot of energy from a small amount of fuel</li></ul></td>
 <td><ul><li><b>Finite:</b> they will run out</li><li>Burning releases <b>carbon dioxide</b>, which adds to global warming</li><li>Coal and oil also release sulfur dioxide, which causes acid rain</li><li>Mining and drilling damage the landscape; oil spills harm wildlife</li></ul></td></tr></table>
 <p>Coal is the dirtiest of the three; gas is the cleanest, but still releases carbon dioxide.</p>
 <h4>Nuclear power</h4>
 <p>Uranium atoms are split in a reactor (<b>nuclear fission</b>). This releases heat, which boils water. From there it is the same: steam, turbine, generator.</p>
 <table><tr><th>Arguments for</th><th>Arguments against</th></tr>
 <tr><td><ul><li>No carbon dioxide is released while generating</li><li>Reliable: runs all the time</li><li>A tiny amount of fuel gives a huge amount of energy</li></ul></td>
 <td><ul><li><b>Radioactive waste</b> stays dangerous for thousands of years and must be stored safely</li><li>Very expensive to build and to take apart (decommission) at the end of its life</li><li>An accident could be catastrophic</li><li>Uranium is finite</li></ul></td></tr></table>` },
 { tip: '<b>Common mistake:</b> nuclear power is <b>not</b> renewable (uranium is finite) and it does <b>not</b> burn anything. The risk is radioactive waste and accidents, not smoke.' },
 { order: { q: 'Put the stages of a coal-fired power station in order.', steps: ['Coal is burned in a furnace', 'The heat boils water to make steam', 'Steam at high pressure spins a turbine', 'The turbine turns a generator', 'Electricity is sent to the National Grid'] } },
 { tf: [
  ['Burning natural gas releases no carbon dioxide.', false, 'It releases less than coal, but it is still a fossil fuel.'],
  ['A nuclear power station releases carbon dioxide while generating.', false, 'Fission is not burning. The problem is radioactive waste.'],
  ['Fossil fuel power stations can generate on a calm, dark night.', true, 'They do not depend on the weather, which is their main advantage.'],
  ['Uranium is a renewable fuel.', false, 'It is mined and will eventually run out.'],
 ] },
 { exam: [
  ['**Give** two disadvantages of nuclear power.', 2, ['Radioactive waste is dangerous for thousands of years / hard to store (1)', 'Power stations are very expensive to build and decommission (1)', 'Accept: risk of a serious accident (1)']],
 ] },
]},

{ t: 'Renewable energy', spec: '3.1.2', blocks: [
 { notes: `<table><tr><th>Source</th><th>How it generates power</th><th>Arguments for</th><th>Arguments against</th></tr>
 <tr><td><b>Wind</b></td><td>Wind turns the blades of a turbine, which turns a generator</td><td>Free, non-finite; no emissions when running; can be built at sea</td><td>Only works when it is windy (not too little, not too much); some people find turbines ugly or noisy; can harm birds</td></tr>
 <tr><td><b>Solar</b></td><td>Photovoltaic cells turn light straight into electricity</td><td>No moving parts, silent; fits on roofs; good for remote places and small products</td><td>No output at night and less in cloud or winter; panels are costly and need a large area</td></tr>
 <tr><td><b>Tidal</b></td><td>The rising and falling tide flows through turbines in a barrage or on the sea bed</td><td>Tides are predictable, twice a day, for ever</td><td>Very expensive to build; few suitable sites; changes the habitat of sea and river life</td></tr>
 <tr><td><b>Hydro-electrical</b></td><td>Water held behind a dam falls through turbines</td><td>Reliable; output can be changed in seconds; lasts a very long time</td><td>The dam floods a valley, destroying habitats and homes; expensive; needs mountains and rain</td></tr>
 <tr><td><b>Biomass</b></td><td>Wood, crops or waste are burned to make steam, like a fossil fuel station</td><td>Renewable if replanted; uses waste; works whatever the weather</td><td>Burning still releases carbon dioxide; large areas of land are needed to grow the fuel</td></tr></table>
 <p><b>Biomass and carbon dioxide:</b> the plants absorbed carbon dioxide while they grew, so if new ones are planted the overall effect is much smaller than fossil fuels. It is sometimes called “carbon neutral”, but only if the fuel is replanted and not transported far.</p>` },
 { match: { q: 'Match each energy source to its main disadvantage.', lh: 'Source', rh: 'Main disadvantage', pairs: [['Wind', 'No output on a calm day'], ['Solar', 'No output at night'], ['Hydro-electrical', 'A valley has to be flooded'], ['Biomass', 'Still releases carbon dioxide when burned'], ['Tidal', 'Very few suitable sites'], ['Nuclear', 'Radioactive waste']] } },
 { mcq: [
  ['Which renewable source is the most predictable?', ['Wind', 'Solar', 'Tidal', 'Biomass'], 2, 'The times and heights of tides are known years ahead.'],
  ['Which source would best power a calculator?', ['Biomass', 'Solar', 'Tidal', 'Hydro-electrical'], 1, 'A small photovoltaic cell needs no fuel or moving parts.'],
  ['Which statement about biomass is correct?', ['It releases no carbon dioxide', 'It is a fossil fuel', 'It is renewable as long as the crop is replanted', 'It only works when the sun shines'], 2, 'New plants take in carbon dioxide and replace the fuel.'],
  ['A remote village in the mountains has a fast river. Which source is most suitable?', ['Tidal', 'Hydro-electrical', 'Nuclear', 'Coal'], 1, 'Falling water can drive a small turbine all year.'],
 ] },
 { exam: [
  ['**Explain** one disadvantage of relying on solar panels to power a home.', 2, ['They generate nothing at night and little in cloudy weather or winter (1)', 'so a battery or a mains supply is still needed (1)']],
  ['**Give** two arguments for building a hydro-electric dam.', 2, ['Reliable, non-finite source / no carbon dioxide when running (1)', 'Output can be raised quickly to meet demand (1)', 'Accept: can also store energy (pumped storage); long life (1)']],
 ] },
]},

{ t: 'Energy storage, batteries and exam practice', spec: '3.1.2', blocks: [
 { notes: `<p>Electricity is hard to store, and wind and solar do not generate exactly when it is needed. So energy is stored in other forms.</p>
 <h4>Kinetic pumped storage</h4>
 <p>A pumped storage station has two reservoirs, one high and one low.</p>
 <ul><li>When there is <b>spare electricity</b> (at night, or on a very windy day), it is used to <b>pump water up</b> to the top reservoir.</li>
 <li>When <b>demand is high</b>, the water is <b>released</b>. It falls through turbines and generates electricity within seconds.</li></ul>
 <p>The energy is stored as the <b>potential energy</b> of the raised water and becomes <b>kinetic</b> (movement) energy as it falls. It can only be built where there are hills and plenty of water.</p>
 <p>A <b>flywheel</b> is another kinetic store: a heavy wheel is spun up and keeps spinning, and its movement is turned back into electricity when needed.</p>
 <h4>Batteries</h4>
 <table><tr><th></th><th>Alkaline</th><th>Rechargeable</th></tr>
 <tr><td><b>Use</b></td><td>Single use: thrown away when flat</td><td>Charged and reused hundreds of times</td></tr>
 <tr><td><b>Types</b></td><td>AA, AAA, 9 V (PP3)</td><td>Lithium-ion (phones, laptops, power tools, cars); nickel-metal hydride (rechargeable AA)</td></tr>
 <tr><td><b>For</b></td><td>Cheap to buy; ready to use; hold their charge for years on the shelf</td><td>Cheaper over time; far less waste; can deliver the high current a motor needs</td></tr>
 <tr><td><b>Against</b></td><td>Expensive over time; a lot of waste; contain chemicals that must not go to landfill</td><td>Cost more at first; need a charger; slowly lose capacity; lithium is mined and finite</td></tr>
 <tr><td><b>Suits</b></td><td>Low-power products used now and then: TV remote, smoke alarm, clock</td><td>Products used every day or needing lots of power: phone, drill, e-bike</td></tr></table>
 <p>All batteries should be <b>recycled</b>, not put in a bin: they contain metals and chemicals that pollute soil and water.</p>` },
 { sort: { q: 'Which type of battery suits each product best?', cats: ['Alkaline', 'Rechargeable'], items: [['Smoke alarm', 0], ['Mobile phone', 1], ['Cordless drill', 1], ['TV remote control', 0], ['Electric scooter', 1], ['Wall clock', 0]] } },
 { gap: { text: 'In a pumped storage system, spare electricity is used to pump water {{up}} to a high reservoir. When demand is {{high}}, the water is released and falls through {{turbines}}, which turn {{generators}} to make electricity.', extra: ['down', 'low', 'batteries'] } },
 { mcq: [
  ['Which energy source does not use a turbine?', ['Wind', 'Solar (photovoltaic)', 'Coal', 'Hydro-electrical'], 1, 'PV cells turn light straight into electricity.'],
  ['Which of these is a fossil fuel?', ['Biomass', 'Uranium', 'Natural gas', 'Wood pellets'], 2, 'Coal, oil and natural gas are the fossil fuels.'],
  ['Why are alkaline batteries a poor choice for a power tool?', ['They are too heavy to lift', 'They cannot be recharged and cannot supply the high current needed for long', 'They are radioactive', 'They only work in sunlight'], 1, 'A motor drains them quickly, so they would be replaced constantly.'],
 ] },
 { exam: [
  ['**Describe** how a pumped storage system stores energy.', 3, ['Spare / cheap electricity is used to pump water to a higher reservoir (1)', 'The energy is stored in the raised water (potential energy) (1)', 'When needed, the water is released through turbines that drive generators (1)']],
  ['**Explain** why disposable batteries should not be thrown in a household bin.', 2, ['They contain metals and chemicals that are toxic (1)', 'which can leak in landfill and pollute soil and water / the materials could be recycled instead (1)']],
  ['**Evaluate** the use of renewable energy sources compared with fossil fuels to generate electricity for a country.', 8, ['Renewables: non-finite, so they will not run out; fuel is free once built', 'Renewables: little or no carbon dioxide when running, so less global warming and air pollution', 'Renewables: wind and solar depend on the weather, so storage or a backup is needed', 'Renewables: high set-up cost; need large areas or particular sites; visual impact and effect on habitats', 'Fossil fuels: reliable and can be turned up to meet demand; stations already exist', 'Fossil fuels: finite, and burning them releases carbon dioxide and causes acid rain', 'Examples used, e.g. offshore wind farms, a hydro-electric dam, gas power stations for peak demand', 'Judgement, e.g. a mix is needed now, moving to renewables with storage as it improves']],
 ] },
 { nea: 'If your NEA product uses power, say why you chose that source: mains, a rechargeable battery, alkaline cells or solar. Link it to how often the product is used and where.' },
]},

]});
