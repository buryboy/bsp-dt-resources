// Final quiz: 20 questions, one go. a = correct answer, d = three wrong answers, mis = misconception tag (optional).
Book.finalQuiz({
  questions: [
    // where polymers come from
    { q: 'Most polymers are <b>synthetic</b>. Which raw material are they made from?', a: 'Crude oil', d: ['Corn starch', 'Tree latex', 'Cellulose'], mis: 'polymer-source' },
    { q: 'Crude oil is a <b>finite</b> resource. What does that mean?', a: 'It is non-renewable and will run out', d: ['It can be regrown like a crop each year', 'It biodegrades quickly once it is used', 'It is renewable and will never run out'], mis: 'oil-renewable' },
    { q: 'Which process <b>separates</b> crude oil into fractions such as naphtha?', a: 'Fractional distillation', d: ['Cracking', 'Polymerisation', 'Vacuum forming'], mis: 'polymer-source' },
    { q: 'What happens during <b>polymerisation</b>?', a: 'Thousands of monomers join into long chains', d: ['Long chains are broken into small monomers', 'Crude oil is separated into its fractions', 'Naphtha is broken down into small molecules'], mis: 'monomer-polymer' },
    { q: 'PLA is a <b>bio-polymer</b>. What is it made from?', a: 'Plants such as corn starch', d: ['Naphtha from crude oil', 'Glass fibre and resin', 'Ground-up thermosets'], mis: 'polymer-source' },
    // additives
    { q: 'Which additive makes a polymer <b>softer and more flexible</b>?', a: 'Plasticiser', d: ['Stabiliser', 'Pigment', 'Filler'], mis: 'additive-mixup' },
    { q: 'Which additive helps a polymer resist <b>UV sunlight</b>?', a: 'Stabiliser', d: ['Plasticiser', 'Pigment', 'Filler'], mis: 'additive-mixup' },
    // two families
    { q: 'Which polymers can be softened by heating and reshaped <b>again and again</b>?', a: 'Thermoforming polymers', d: ['Thermosetting polymers', 'Both families of polymer', 'Neither family of polymer'], mis: 'thermo-swap' },
    { q: 'Which describes the chains in a <b>thermoforming</b> polymer?', a: 'Tangled, but not joined to each other', d: ['Locked together by strong cross-links', 'Set by a hardener into a rigid network', 'Joined to each other when first heated'], mis: 'crosslink' },
    { q: 'A vacuum-formed sheet is reheated and tries to go <b>flat</b> again. What is this called?', a: 'Plastic memory', d: ['Cross-linking', 'Polymerisation', 'Fatigue resistance'] },
    { q: 'A <b>thermosetting</b> polymer is heated strongly. What happens to it?', a: 'It chars and burns without softening', d: ['It softens so it can be reshaped', 'It melts so it can be recycled', 'It returns to being a flat sheet'], mis: 'thermo-swap' },
    // thermoforming polymers
    { q: 'Which polymer is <b>very easy to vacuum form</b> into yoghurt pots and packaging trays?', a: 'High impact polystyrene (HIPS)', d: ['High density polythene (HDPE)', 'Polyvinyl chloride (PVC)', 'Acrylic (PMMA)'], mis: 'thermoform-mixup' },
    { q: 'Which polymer is used for <b>milk bottles, wheelie bins and chopping boards</b>?', a: 'High density polythene (HDPE)', d: ['High impact polystyrene (HIPS)', 'Polyethylene terephthalate (PET)', 'Acrylic (PMMA)'], mis: 'thermoform-mixup' },
    { q: 'An <b>acrylic</b> sign is hit hard by a football. What is most likely to happen?', a: 'It cracks, because acrylic is brittle', d: ['It survives, because acrylic is tough', 'It bends, because acrylic is flexible', 'It dents, because acrylic is very soft'], mis: 'acrylic-tough' },
    { q: 'Which polymer can bend many times without snapping, so it is used for a <b>"living hinge"</b>?', a: 'Polypropylene (PP)', d: ['High impact polystyrene (HIPS)', 'Polyvinyl chloride (PVC)', 'Acrylic (PMMA)'], mis: 'pp-hinge' },
    // thermosetting polymers
    { q: 'Which polymer is used for <b>saucepan handles</b> and only comes in dark colours?', a: 'Phenol formaldehyde (PF)', d: ['Urea formaldehyde (UF)', 'Melamine formaldehyde (MF)', 'Epoxy resin (ER)'], mis: 'thermoset-mixup' },
    { q: 'Which polymer is mixed from a <b>resin and a hardener</b> to make a very strong adhesive?', a: 'Epoxy resin (ER)', d: ['Melamine formaldehyde (MF)', 'Phenol formaldehyde (PF)', 'Polypropylene (PP)'], mis: 'thermoset-mixup' },
    { q: 'What is <b>GRP</b> (fibreglass)?', a: 'Polyester resin reinforced with glass fibre', d: ['Epoxy resin mixed with a hardener', 'Polypropylene with plasticiser added', 'Melamine formaldehyde on a worktop'], mis: 'thermoset-mixup' },
    // environment
    { q: 'Which polymer has recycling code <b>5</b>?', a: 'PP', d: ['PET', 'HDPE', 'PVC'], mis: 'code-mixup' },
    { q: 'What can be done with waste <b>thermosetting</b> polymers?', a: 'They can be ground up and used as filler', d: ['They can be melted down and remoulded', 'They can be softened and vacuum formed', 'They can be shredded, melted and reused'], mis: 'thermoset-recycle' },
  ],
});
