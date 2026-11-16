// Final quiz: 20 questions, one go. a = correct answer, d = three wrong answers, mis = misconception tag (optional).
Book.finalQuiz({
  questions: [
    // where metals come from
    { q: 'Rock that contains a metal compound, dug out of the Earth\'s crust, is called…', a: 'an ore', d: ['a slag', 'a coke', 'an alloy'], mis: 'ore-extraction' },
    { q: 'How is <b>iron</b> extracted from iron ore?', a: 'It is heated in a blast furnace', d: ['It is split up by electrolysis', 'It is dipped in molten zinc', 'It is melted and poured in a mould'], mis: 'ore-extraction' },
    { q: 'In a blast furnace, the impurities float on top of the molten iron. What are they called?', a: 'Slag', d: ['Coke', 'Bauxite', 'Limestone'], mis: 'ore-extraction' },
    { q: 'Recycling <b>aluminium</b> saves about how much of the energy needed to make it from bauxite?', a: 'About 95%', d: ['About 5%', 'About 25%', 'About 50%'], mis: 'finite-recycle' },
    { q: 'Metals are a <b>finite</b> resource. What does this mean?', a: 'There is a limited amount, so they can run out', d: ['They can only be recycled a few times over', 'They lose some quality each time they are used', 'They can be grown again to replace what is used'], mis: 'finite-recycle' },
    // families
    { q: 'Which of these is a <b>non-ferrous</b> metal?', a: 'Zinc', d: ['Cast iron', 'Stainless steel', 'High carbon steel'], mis: 'ferrous-meaning' },
    { q: 'Which statement is true of <b>most ferrous metals</b>?', a: 'Magnetic, and they rust in air and water', d: ['Magnetic, and they never rust at all', 'Not magnetic, and they never rust at all', 'Not magnetic, but they rust in air and water'], mis: 'ferrous-meaning' },
    // ferrous metals
    { q: 'Which of these contains the <b>most carbon</b>?', a: 'Cast iron', d: ['Low carbon steel', 'High carbon steel', 'Pure iron'], mis: 'steel-mixup' },
    { q: 'Car body panels are pressed from sheet metal that must be tough, malleable and cheap. Which metal is used?', a: 'Low carbon steel', d: ['High carbon steel', 'High speed steel', 'Cast iron'], mis: 'steel-mixup' },
    { q: 'A cast-iron pan is dropped on a stone floor and <b>cracks</b>. Which word describes cast iron?', a: 'Brittle', d: ['Ductile', 'Malleable', 'Tough'], mis: 'property-word' },
    // non-ferrous metals
    { q: 'Which metal is used for electrical wire because it is an excellent conductor and very ductile?', a: 'Copper', d: ['Tin', 'Zinc', 'Cast iron'], mis: 'nonferrous-mixup' },
    { q: 'Why does <b>aluminium</b> resist corrosion?', a: 'A thin oxide layer on its surface protects it', d: ['A thin zinc layer on its surface protects it', 'A little iron inside it reacts very slowly', 'A thin tin layer is added when it is made'], mis: 'nonferrous-mixup' },
    { q: 'What is <b>galvanising</b>?', a: 'Coating steel with zinc', d: ['Coating steel with tin', 'Mixing steel with zinc', 'Coating steel with paint'], mis: 'galvanise-meaning' },
    { q: 'What is a "tin can" of soup really made from?', a: 'Steel with a thin coating of tin', d: ['Solid tin rolled into a thin sheet', 'Aluminium with a thin coating of tin', 'Steel with a thin coating of zinc'], mis: 'tin-can' },
    // alloys
    { q: 'Why is an alloy usually <b>harder</b> than the pure metal?', a: 'Different-sized atoms stop the layers sliding easily', d: ['Different-sized atoms help the layers slide easily', 'The atoms react together to form a new compound', 'The atoms form a hard coating over the surface'], mis: 'alloy-meaning' },
    { q: '<b>Brass</b> is an alloy of which two metals?', a: 'Copper and zinc', d: ['Copper and tin', 'Steel and zinc', 'Steel and chromium'], mis: 'alloy-contents' },
    { q: 'Why is <b>high speed steel</b> used for drill bits?', a: 'It stays hard even when it is red hot', d: ['It stays cool even at very high speed', 'It stays shiny even when it gets wet', 'It stays soft so that it cannot snap'], mis: 'alloy-mixup' },
    { q: 'Which metal is used for <b>surgical instruments</b> because it is hard, hygienic and does not rust?', a: 'Stainless steel', d: ['High speed steel', 'Low carbon steel', 'Brass'], mis: 'alloy-mixup' },
    // rusting
    { q: 'Four steel nails are left for two weeks. Which one rusts <b>fastest</b>?', a: 'The one in salt water, open to the air', d: ['The one in boiled water under a layer of oil', 'The one in dry air with a drying agent', 'The one in tap water, open to the air'], mis: 'rust-conditions' },
    { q: 'A <b>galvanised</b> steel gate gets a deep scratch. What happens next?', a: 'The zinc still protects the steel underneath', d: ['The steel rusts quickly along the scratch', 'The whole gate rusts as fast as bare steel', 'The zinc turns into an alloy with the steel'], mis: 'galvanise-meaning' },
  ],
});
