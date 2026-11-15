// Page 11 — Exit quiz: 10 multiple-choice questions across both families, confidence ratings and one open question.
Book.page({
  id: 'p11',
  title: 'Exit quiz',
  build(ui) {
    const RED = Ink.RED;
    ui.h('Exit quiz');
    ui.p('Ten quick questions on <b>everything</b> from today. Go with your first answer: your <b>first</b> tap is what counts. If you get one wrong, read why, then try again.');

    // a little pen-drawn exit ticket
    ui.anim({
      w: 860, h: 200, duration: 4, poster: 4,
      draw(k) {
        const T = [[40, 22], [820, 22], [820, 62], [806, 82], [820, 102], [820, 148], [40, 148], [40, 102], [54, 82], [40, 62], [40, 22]];
        k.shadow(T, 0.6, 1.0); k.line(T, 0, 0.8, { w: 2.8 });
        k.line([[214, 30], [214, 140]], 0.8, 1.0, { w: 1.6 });
        for (let y = 36; y < 140; y += 12) k.dot(214, y, 1.6, 0.9);
        k.text('EXIT', 127, 76, 1.0, 1.2, { size: 26, color: RED, align: 'center', font: 'bubble' }); k.text('TICKET', 127, 112, 1.2, 1.4, { size: 26, color: RED, align: 'center', font: 'bubble' });
        k.text('physical', 340, 80, 1.3, 1.8, { size: 26, align: 'center' });
        k.text('+', 434, 80, 1.8, 1.9, { size: 26, align: 'center' });
        k.text('working', 520, 80, 1.9, 2.4, { size: 26, align: 'center' });
        k.text('= 10 questions', 686, 80, 2.4, 3.0, { size: 26, align: 'center' });
        k.text('admit one (brain) to the next lesson', 516, 124, 3.0, 3.8, { size: 22, color: RED, align: 'center' });
      },
      sound(k) { k.play('stroke', 0, { material: 'pen', dur: 1, gain: 0.4 }); k.play('stroke', 1.0, { material: 'pen', dur: 2.8, gain: 0.35 }); k.play('stamp', 3.9, { gain: 0.3 }); },
    });

    const Q = (n, label, q, options, explain) => ui.mcq({ id: 'p11.q' + String(n).padStart(2, '0'), label: `Q${n}: ${label}`, q: `<b style="font-family:Fredoka">${n}.</b> ${q}`, options, explain });

    ui.el('h2', '', 'Physical properties');
    Q(1, 'which is a physical property?', 'Which of these is a <b>physical</b> property?', [
      { t: 'Density', ok: true, why: 'Density is a physical property: it describes what the material is like (mass per unit volume).' },
      { t: 'Hardness', mis: 'physical-vs-working', why: 'Hardness is a WORKING property: it is about how the material behaves when a force (scratching, denting) is applied.' },
      { t: 'Toughness', mis: 'physical-vs-working', why: 'Toughness is a WORKING property: it is how the material behaves when it is hit.' },
      { t: 'Elasticity', mis: 'physical-vs-working', why: 'Elasticity is a WORKING property: it is how the material behaves when a force is applied and removed.' },
    ]);
    Q(2, 'big pine log in water', 'A huge, heavy log of <b>pine</b> (density 0.50 g/cm³) is dropped in a river (water = 1.00 g/cm³). What happens?', [
      { t: 'It floats, because its density is less than water', ok: true, why: 'Floating depends on density (mass for its size), not on how heavy the log is. 0.50 < 1.00, so it floats.' },
      { t: 'It sinks, because it is very heavy', mis: 'density-vs-weight', why: 'Heavy is not the same as dense. A big log is heavy, but pine (0.50 g/cm³) is less dense than water, so it floats.' },
      { t: 'It sinks, because big objects are denser', mis: 'density-vs-weight', why: 'Density does not change with size: every piece of pine is 0.50 g/cm³, big or small. It floats.' },
      { t: 'Only a small piece would float', mis: 'density-vs-weight', why: 'Big and small pieces of pine have the same density (0.50 g/cm³), so both float.' },
    ]);
    Q(3, 'why metal spoon feels cold', 'A metal spoon and a wooden spoon have been in the same drawer all day. The metal one <b>feels</b> colder. Why?', [
      { t: 'Metal has a high thermal conductivity, so it conducts heat away from your hand faster', ok: true, why: 'Both spoons are at room temperature. The metal conducts heat away from your hand quickly, so it feels cold.' },
      { t: 'The metal spoon really is at a lower temperature', mis: 'metal-feels-cold', why: 'They have been in the same drawer, so both are at room temperature. It is about how fast heat leaves your hand.' },
      { t: 'Wood makes its own warmth', mis: 'metal-feels-cold', why: 'Wood does not make heat. It is a thermal insulator, so it takes heat from your hand slowly and feels warm.' },
      { t: 'Metal is denser, so it holds more cold', mis: 'density-vs-weight', why: 'Density is mass per unit volume, and "cold" is not something a material holds. Metal conducts heat away from your hand faster.' },
    ]);
    Q(4, 'why PVC on cables', 'Why is the outside of an electrical cable made from <b>PVC</b>?', [
      { t: 'PVC is an electrical insulator, so electricity cannot flow through it and give you a shock', ok: true, why: 'PVC is an electrical insulator (and flexible), so it keeps the electricity inside the copper core.' },
      { t: 'PVC is a good electrical conductor, so the current flows well', mis: 'conductor-insulator', why: 'Polymers like PVC are INSULATORS. The copper inside is the conductor.' },
      { t: 'PVC has a low thermal conductivity, which stops electricity', mis: 'heat-vs-electricity', why: 'Thermal conductivity is about heat. Stopping electricity needs an ELECTRICAL insulator.' },
      { t: 'PVC is tough, so electricity cannot get through it', mis: 'physical-vs-working', why: 'Toughness is a working property (absorbing impacts). Letting electricity through or not is a physical property: electrical conductivity.' },
    ]);
    Q(5, 'heating a thermoset', 'What happens when a <b>thermosetting polymer</b> (e.g. phenol formaldehyde) is heated strongly?', [
      { t: 'It does not melt: it chars (burns)', ok: true, why: 'Thermosets are not fusible: they char instead of melting, which is why they are used for pan handles.' },
      { t: 'It melts and can be cast into a new shape', mis: 'fusibility-thermoset', why: 'That is true for thermoforming polymers like polypropylene (melts at about 160 °C), NOT thermosets. Thermosets char.' },
      { t: 'It melts at a low temperature, like solder', mis: 'fusibility-thermoset', why: 'Solder melts at about 183–220 °C, but thermosets do not melt at all: they char.' },
      { t: 'It conducts the heat away quickly, like copper', mis: 'conductor-insulator', why: 'Polymers are thermal insulators (about as poor at conducting heat as wood). And thermosets char, they do not melt.' },
    ]);
    Q(6, 'painting a garden shed', 'Why is the pine timber of a garden shed painted or treated with preservative?', [
      { t: 'To reduce its absorbency, so it does not soak up rain and rot', ok: true, why: 'The finish reduces absorbency, so the wood does not soak up water, swell and rot.' },
      { t: 'Only for colour: absorbency only matters for paper and fabrics', mis: 'absorbency', why: 'Absorbency matters for timber outdoors too: wet wood swells and rots. The finish reduces absorbency.' },
      { t: 'To make the wood denser, so it is stronger', mis: 'density-vs-weight', why: 'Paint does not change the density of the wood, and dense does not mean strong. It reduces absorbency.' },
      { t: 'To make it more absorbent, so it stays waterproof', mis: 'absorbency', why: 'More absorbent means it soaks up MORE water. The finish makes it LESS absorbent.' },
    ]);

    ui.el('h2', '', 'Working properties');
    Q(7, 'glass: hard but brittle', 'Glass is very <b>hard</b>. Which statement is correct?', [
      { t: 'Glass resists scratches, but it is brittle, so it can shatter on impact', ok: true, why: 'Hard (resists scratches and wear) is not the same as tough (absorbs impact). Glass is hard but brittle.' },
      { t: 'Glass is tough, because it is hard', mis: 'hard-vs-tough', why: 'Hard does not mean tough. Glass is hard but brittle: it cannot absorb an impact without shattering.' },
      { t: 'Glass is brittle, so it is weak and cannot hold any load', mis: 'brittle-vs-weak', why: 'Brittle does not mean weak. Brittle materials can be strong in compression; they snap or shatter under impact.' },
      { t: 'Glass is brittle because it is soft', mis: 'hard-vs-tough', why: 'Glass is very hard. Brittle is the opposite of TOUGH, not of hard: glass is hard AND brittle.' },
    ]);
    Q(8, 'pressing a car panel', 'A flat sheet of low-carbon steel is <b>pressed</b> into a curved car door without cracking. Which property makes this possible?', [
      { t: 'Malleability', ok: true, why: 'Malleable = permanently shaped by compression (hammered, pressed, rolled) without cracking.' },
      { t: 'Ductility', mis: 'malleable-vs-ductile', why: 'Ductility is being stretched (drawn) into a thin wire under tension. Pressing is compression: malleability.' },
      { t: 'Elasticity', mis: 'elastic-vs-stretchy', why: 'An elastic material returns to its original shape. The door must STAY curved, so it is malleability.' },
      { t: 'Thermal conductivity', mis: 'physical-vs-working', why: 'Thermal conductivity is a physical property about heat. Being shaped by a force is a working property: malleability.' },
    ]);
    Q(9, 'best elastic material', 'Which is the best example of an <b>elastic</b> material?', [
      { t: 'Rubber in a bungee cord', ok: true, why: 'Elastic = returns to its original shape after the force is removed. Rubber springs back every time.' },
      { t: 'Plasticine, because it stretches a long way', mis: 'elastic-vs-stretchy', why: 'Plasticine stretches but STAYS stretched (plastic). Elastic means it returns to its original shape.' },
      { t: 'Lead, because it bends easily', mis: 'elastic-vs-stretchy', why: 'Lead bends easily but stays bent. That is plastic, not elastic.' },
      { t: 'Copper, because it can be drawn out into wire', mis: 'elastic-vs-stretchy', why: 'That is ductility: the wire stays long and thin. Elastic means it returns to its original shape.' },
    ]);
    Q(10, 'steel lift cable', 'A lift hangs from a steel cable that is being <b>pulled</b> (tension). Which property matters most?', [
      { t: 'Strength', ok: true, why: 'Strength = withstanding a force (here tension) without breaking or permanently stretching.' },
      { t: 'Hardness', mis: 'strong-vs-hard', why: 'Hardness is resisting scratching, wear and denting. Holding a pulling force without breaking is STRENGTH.' },
      { t: 'Density', mis: 'density-vs-weight', why: 'Density is mass per unit volume: a denser material is not automatically stronger.' },
      { t: 'Electrical conductivity', mis: 'physical-vs-working', why: 'That is a physical property about electricity. Holding a force is a working property: strength.' },
    ]);

    ui.el('h2', '', 'How do you feel?');
    ui.rate({ id: 'p11.conf-physical', label: 'Confidence: physical properties', q: 'How confident are you with the <b>physical properties</b> (absorbency, density, fusibility, electrical and thermal conductivity)?' });
    ui.rate({ id: 'p11.conf-working', label: 'Confidence: working properties', q: 'How confident are you with the <b>working properties</b> (strength, hardness, toughness, malleability, ductility, elasticity)?' });
    ui.write({ id: 'p11.unsure', label: 'Still not sure about…', marks: 0, lines: 2,
      q: "What's one thing about material properties you're still not sure about?",
      scheme: ['Any honest answer'] });
  },
});
