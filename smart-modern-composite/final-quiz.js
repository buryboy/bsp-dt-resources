// Final quiz: 20 questions, one go. a = correct answer, d = three wrong answers, mis = misconception tag (optional).
Book.finalQuiz({
  questions: [
    // the four groups
    { q: 'Which group of materials does <b>titanium</b> belong to?', a: 'Modern materials', d: ['Smart materials', 'Composite materials', 'Technical textiles'], mis: 'group-mixup' },
    { q: 'What is a <b>technical textile</b>?', a: 'A textile engineered for performance, not looks', d: ['A textile engineered for looks, not performance', 'A textile woven only from natural plant fibres', 'A textile that must be powered by a battery'], mis: 'group-mixup' },
    // modern materials
    { q: 'How are the carbon atoms in <b>graphene</b> arranged?', a: 'In a hexagonal (honeycomb) lattice', d: ['In a square grid, many layers thick', 'In long, tangled polymer chains', 'In a foam around bubbles of gas'], mis: 'graphene-structure' },
    { q: 'Which of these is a use of <b>metal foam</b>?', a: 'Car crumple zones', d: ['Flexible touch screens', 'Colour-change mugs', 'Touchscreen gloves'], mis: 'metal-foam' },
    { q: 'How does <b>titanium</b> compare with steel?', a: 'About half the density, and it resists corrosion', d: ['About twice the density, and it resists corrosion', 'About half the density, but it corrodes quickly', 'About the same density, and it is far cheaper'], mis: 'titanium-props' },
    { q: 'Titanium is <b>biocompatible</b>. What does that mean?', a: 'It is not rejected by the body', d: ['It breaks down safely in soil', 'It is made from living plants', 'It can be recycled many times'], mis: 'titanium-props' },
    // smart materials
    { q: 'Which of these is <b>not</b> a smart material?', a: 'An LED that changes colour when it is powered', d: ['A spoon that changes colour in hot food', 'A lens that darkens in bright sunlight', 'A wire that returns to shape when heated'], mis: 'smart-meaning' },
    { q: 'What is the stimulus for a <b>photochromic</b> pigment?', a: 'Light (UV / sunlight)', d: ['Temperature (heat)', 'Stress (a force)', 'Moisture (water)'], mis: 'stimulus-mixup' },
    { q: 'Which of these is a use of a <b>thermochromic</b> pigment?', a: 'A forehead thermometer strip', d: ['Lenses that darken outdoors', 'A wire for dental braces', 'A glove for touchscreens'], mis: 'stimulus-mixup' },
    { q: '<b>Nitinol</b> is a shape memory alloy. Which two metals is it made from?', a: 'Nickel and titanium', d: ['Nickel and tin', 'Iron and carbon', 'Copper and zinc'], mis: 'sma-mixup' },
    { q: 'What makes a shape memory alloy <b>actuator wire</b> shorten?', a: 'An electric current heats it', d: ['A bright light shines on it', 'Cold water cools it down', 'A weight stretches it out'], mis: 'sma-mixup' },
    // composites
    { q: 'What is a <b>composite</b> material?', a: 'Two or more materials combined, which stay separate', d: ['Two or more metals melted and mixed together', 'One material that changes with a stimulus', 'One textile engineered to do a special job'], mis: 'composite-meaning' },
    { q: 'In <b>concrete</b>, which material is the matrix that binds it together?', a: 'Cement', d: ['Gravel', 'Sand', 'Steel bars'], mis: 'matrix-reinforcement' },
    { q: 'Why are <b>steel bars</b> cast inside a concrete beam?', a: 'To carry the tension forces', d: ['To carry the compression forces', 'To make the beam weigh less', 'To stop the cement setting hard'], mis: 'concrete-tension' },
    { q: 'What is <b>GRP</b> (fibreglass) made from?', a: 'Polyester resin and glass fibres', d: ['Epoxy resin and carbon fibres', 'Cement, sand and gravel', 'Nickel and titanium'], mis: 'gfrp-cfrp' },
    { q: 'Which product is most likely to be made from <b>CFRP</b>?', a: 'A Formula 1 car body', d: ['A garden pond', 'A pavement', 'A water tank'], mis: 'gfrp-cfrp' },
    // technical textiles
    { q: 'What do <b>conductive fabrics</b> contain?', a: 'Threads of silver or copper', d: ['Glass fibres set in resin', 'Tiny capsules of scent', 'Pigments that sense heat'], mis: 'tech-textile-mixup' },
    { q: 'Which of these is a use of <b>Kevlar</b>?', a: 'Cut-resistant gloves', d: ['Touchscreen gloves', 'Scented sports socks', 'Colour-change T-shirts'], mis: 'kevlar-props' },
    { q: 'Which product uses a <b>fire resistant</b> fabric such as Nomex?', a: "A firefighter's suit", d: ['A heart-rate sensor shirt', 'An insect-repellent shirt', 'A pair of scented socks'], mis: 'tech-textile-mixup' },
    { q: 'Which product uses <b>micro-encapsulation</b>?', a: 'Antibacterial sports socks', d: ["A racing driver's overalls", 'A light-up cycling jacket', 'A bullet-proof police vest'], mis: 'microencap' },
  ],
});
