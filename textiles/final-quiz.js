// Final quiz: 20 questions, one go. a = correct answer, d = three wrong answers, mis = misconception tag (optional).
Book.finalQuiz({
  questions: [
    // fibres → yarns → fabrics
    { q: 'What is a <b>fibre</b>?', a: 'A very fine, hair-like strand', d: ['A thread made by twisting strands', 'A sheet made by weaving threads', 'A firm edge that does not fray'], mis: 'fibre-yarn-fabric' },
    { q: 'Which word describes <b>short</b> fibres, such as cotton and wool?', a: 'Staple', d: ['Filament', 'Selvedge', 'Bonded'], mis: 'fibre-yarn-fabric' },
    // natural fibres
    { q: 'Where does <b>cotton</b> come from?', a: 'The seed pod of a plant', d: ['The stem of a flax plant', 'The fleece of a sheep', 'The cocoon of a silkworm'], mis: 'plant-animal' },
    { q: 'Which of these is a <b>plant</b> (cellulose) fibre?', a: 'Linen', d: ['Wool', 'Silk', 'Polyamide'], mis: 'plant-animal' },
    { q: 'Which fibre is absorbent and <b>stronger when wet</b>, so it is used for towels?', a: 'Cotton', d: ['Silk', 'Polyester', 'Polyamide'], mis: 'natural-mixup' },
    { q: 'Which fibre is naturally <b>flame resistant</b>: it smoulders but does not flare?', a: 'Wool', d: ['Cotton', 'Linen', 'Polyester'], mis: 'cotton-wool' },
    { q: 'Which fibre is <b>lustrous</b> (shiny), drapes well and is used for ties and wedding dresses?', a: 'Silk', d: ['Linen', 'Wool', 'Cotton'], mis: 'natural-mixup' },
    // synthetic fibres
    { q: 'What are <b>synthetic</b> fibres such as polyester made from?', a: 'Crude oil', d: ['Flax plants', 'Sheep fleece', 'Cotton bolls'], mis: 'natural-synthetic' },
    { q: 'Which fibre stretches to about <b>5–7 times</b> its length and springs back?', a: 'Elastane', d: ['Polyester', 'Polyamide', 'Cotton'], mis: 'synthetic-mixup' },
    { q: 'Pleats can be <b>heat-set</b> into a polyester skirt because polyester is…', a: 'thermoplastic', d: ['biodegradable', 'very absorbent', 'a staple fibre'], mis: 'synthetic-melt' },
    { q: 'What happens each time <b>synthetic</b> clothes are washed?', a: 'They shed microfibres into the water', d: ['They biodegrade a little in the water', 'They shrink and felt into a thick mat', 'They soak up water and get stronger'], mis: 'synthetic-melt' },
    // blends and mixtures
    { q: 'A fabric has a <b>cotton warp</b> and a <b>polyester weft</b>. What is it?', a: 'A mixture', d: ['A blend', 'A felt', 'A warp knit'], mis: 'blend-meaning' },
    { q: 'Why are fibres <b>blended</b>?', a: 'To combine good properties and cut cost', d: ['Only ever to make the fabric cheaper', 'To make the fabric biodegrade faster', 'To stop the cut edges from fraying'], mis: 'blend-meaning' },
    // woven
    { q: 'Which way do the <b>weft</b> yarns run in a woven fabric?', a: 'Across the fabric, from side to side', d: ['Lengthways, along the whole fabric', 'Diagonally, at 45° to the edges', 'Round in loops, one row at a time'], mis: 'warp-weft' },
    { q: 'What is the <b>selvedge</b>?', a: 'The firm side edge that does not fray', d: ['The cut edge that frays very easily', 'The diagonal direction with stretch', 'The yarn that goes from side to side'], mis: 'selvedge' },
    { q: 'In a <b>plain weave</b>, the weft goes…', a: 'over one, under one', d: ['over two, under one', 'over four, under one', 'over two, under two'], mis: 'weave-type' },
    { q: '<b>Denim</b> shows diagonal lines. Which construction is it?', a: 'Twill weave', d: ['Plain weave', 'Satin weave', 'Weft knit'], mis: 'weave-type' },
    // knitted and non-woven
    { q: 'Which fabric is <b>machine made only</b> and does not ladder or unravel?', a: 'Warp knit', d: ['Weft knit', 'Plain weave', 'Wool felt'], mis: 'knit-type' },
    { q: 'Compared with a woven fabric, a <b>knitted</b> fabric is…', a: 'stretchier, and does not fray easily', d: ['less stretchy, and frays at cut edges', 'stiffer, and creases far more easily', 'weaker, because it contains no yarns'], mis: 'woven-vs-knit' },
    { q: 'Disposable face masks and interfacing are made from which fabric?', a: 'Bonded fabric', d: ['Twill weave', 'Weft knit', 'Wool felt'], mis: 'nonwoven' },
  ],
});
