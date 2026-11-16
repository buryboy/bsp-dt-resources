// Final quiz: 20 questions, one go. a = correct answer, d = three wrong answers, mis = misconception tag (optional).
Book.finalQuiz({
  questions: [
    // where paper comes from
    { q: 'What are the tiny <b>fibres</b> that paper and board are made from?', a: 'Cellulose', d: ['Polystyrene', 'Polythene', 'Aluminium'], mis: 'paper-source' },
    { q: 'In a paper mill, what happens when paper is <b>calendered</b>?', a: 'It is polished between smooth rollers', d: ['It is stripped of its bark before chipping', 'It is made white by adding chemicals', 'It is drained of water on a wire mesh'], mis: 'paper-source' },
    { q: 'What does the <b>FSC</b> logo on a pack of paper show?', a: 'The wood came from responsibly managed forests', d: ['The paper was made from recycled fibres only', 'The paper was made without using any bleach', 'The paper is heavy enough to be called board'], mis: 'renewable-mix' },
    { q: 'About how many times can paper be <b>recycled</b>?', a: '5–7 times', d: ['1–2 times', '50–70 times', 'Any number of times'], mis: 'recycle-forever' },
    { q: 'Why is paper called a <b>renewable</b> material?', a: 'New trees can be planted to replace those felled', d: ['It is made from oil, which will never run out', 'It never rots away after it has been thrown out', 'It needs no water or energy when it is made'], mis: 'renewable-mix' },
    // weight, thickness and size
    { q: 'What does <b>gsm</b> stand for?', a: 'Grams per square metre', d: ['Grams per single sheet', 'Grams per square millimetre', 'Gauge of sheet in microns'], mis: 'gsm-meaning' },
    { q: 'Above about what weight is paper called <b>board</b>?', a: '200 gsm', d: ['50 gsm', '80 gsm', '1000 gsm'], mis: 'gsm-meaning' },
    { q: 'What does one <b>A0</b> sheet (1 m²) of <b>120 gsm</b> paper weigh?', a: '120 g', d: ['7.5 g', '60 g', '1920 g'], mis: 'gsm-meaning' },
    { q: 'An A4 sheet is 1/16 of A0. What does one <b>A4</b> sheet of <b>160 gsm</b> paper weigh?', a: '10 g', d: ['16 g', '160 g', '2560 g'], mis: 'gsm-meaning' },
    { q: 'A sheet of card is <b>250 microns</b> thick. What is that in millimetres?', a: '0.25 mm', d: ['2.5 mm', '25 mm', '0.025 mm'], mis: 'micron-convert' },
    { q: 'A sheet of board is <b>2 mm</b> thick. What is that in microns?', a: '2000 microns', d: ['200 microns', '20 microns', '0.002 microns'], mis: 'micron-convert' },
    { q: 'What are the dimensions of a sheet of <b>A3</b> paper?', a: '297 × 420 mm', d: ['210 × 297 mm', '148 × 210 mm', '420 × 594 mm'], mis: 'a-size' },
    { q: 'How many <b>A4</b> sheets can be cut from one <b>A2</b> sheet?', a: '4', d: ['2', '8', '16'], mis: 'a-size' },
    // papers
    { q: 'Which paper is <b>transparent</b>, hard and strong, and is used for copying drawings and overlays?', a: 'Tracing paper', d: ['Layout paper', 'Cartridge paper', 'Grid paper'], mis: 'layout-vs-tracing' },
    { q: '<b>Bleed proof</b> paper has a special coating. What does the coating do to marker ink?', a: 'Keeps it on the surface so it cannot spread', d: ['Soaks it in quickly to give a deeper colour', 'Lets it show through to the sheet underneath', 'Lets it be rubbed out again once it has dried'], mis: 'bleed-meaning' },
    { q: 'Which paper is the best choice for drawing the <b>net</b> of a box accurately to scale?', a: 'Grid paper', d: ['Tracing paper', 'Bleed proof paper', 'Cartridge paper'], mis: 'paper-mixup' },
    // boards
    { q: 'Which board has <b>one</b> white, coated side for printing and a grey or brown back?', a: 'Duplex board', d: ['Solid white board', 'Foam core board', 'Corrugated card'], mis: 'duplex-vs-solid' },
    { q: 'What is sandwiched in the middle of <b>foam core</b> board?', a: 'Polystyrene foam', d: ['Fluted paper', 'Aluminium foil', 'Polythene film'], mis: 'board-mixup' },
    { q: 'Why does <b>corrugated card</b> protect a parcel so well?', a: 'Its fluted layer absorbs impacts', d: ['Its foil layer reflects impacts', 'Its foam layer cushions impacts', 'Its coated layer resists impacts'], mis: 'corrugated-structure' },
    { q: 'The lid of a ready meal is made from <b>foil lined</b> board. What does the foil do?', a: 'Reflects heat and keeps out moisture', d: ['Adds strength and stops the lid bending', 'Gives a bright white surface for printing', 'Cuts the cost and the weight of the lid'], mis: 'foil-purpose' },
  ],
});
