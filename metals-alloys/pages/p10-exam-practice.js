// Page 10 — Exam practice: AQA-style questions (one multiple choice, then Define / Name / Describe / Explain). 13 marks.
Book.page({
  id: 'p10',
  title: 'Exam practice',
  build(ui) {
    const RED = Ink.RED, GREEN = Ink.GREEN;
    ui.h('Exam practice');
    ui.p('These are written like real AQA questions. Answer them, then tap <b>Check my answer</b> and tick each mark-scheme point you <b>really</b> made. Be an honest examiner! <span class="key">13 marks</span>.');

    // ---- tip box + a pen animation of an "explain" answer built for full marks (about something NOT asked below) ----
    ui.box('<b>Command words.</b> <b>Define</b> = say exactly what the word means. <b>Name</b> / <b>State</b> = a word or a short fact. <b>Describe</b> = say what it is or how it is done. <b>Explain</b> = give a point, then <b>because</b> / <b>so</b>.<br>' +
      '<span class="small">For an <b>explain</b> question worth 2 marks, do not just name a property: say what that property <b>does for the product</b>. Use the exact property word (hard is not the same as tough). Watch:</span>', { tag: 'Exam tip: point, then "so"' });
    ui.anim({
      w: 860, h: 320, duration: 11.6, poster: 1.6,
      draw(k) {
        k.text('Explain why cast iron is used for the body of a vice.  [2 marks]', 20, 40, 0.0, 1.4, { size: 23 });
        k.line([[20, 56], [830, 58]], 1.3, 1.6, { w: 1.4 });
        const L = ['Cast iron is very strong', 'in compression,', 'so it takes the squeezing force.'], tag = ['1. THE PROPERTY', '', '2. SO… (the job)'];
        const c = k.ctx; c.save(); c.font = '400 26px "Gloria Hallelujah", "Comic Sans MS", cursive'; const ws = L.map((s) => c.measureText(s).width); c.restore();
        L.forEach((s, i) => {
          const a = 1.8 + i * 2.5, y = 112 + i * 52;
          k.text(s, 40, y, a, a + 1.2, { size: 26 });
          if (!tag[i]) return;
          k.arrow([[572, y - 10], [Math.min(552, 40 + ws[i] + 20), y - 10]], a + 1.3, a + 1.7, { color: RED, w: 2, head: 12 });
          k.text(tag[i], 584, y, a + 1.6, a + 2.1, { size: 24, color: RED, font: 'bubble' });
        });
        if (k.t >= 4.2) Ink.tick(k.ctx, 822, 118, 1.0, GREEN);
        if (k.t >= 9.2) Ink.tick(k.ctx, 822, 222, 1.0, GREEN);
        k.text('"It is strong" on its own = 1 mark at most.', 40, 290, 9.6, 11.2, { size: 22, color: RED });
      },
      sound(k) {
        k.bed('room', 0, 11.6, { gain: 0.3 });
        k.play('stroke', 0, { material: 'pen', dur: 1.4, gain: 0.4 });
        [1.8, 4.3, 6.8].forEach((a) => { k.play('stroke', a, { material: 'pen', dur: 1.2, gain: 0.45 }); });
        k.play('stroke', 3.1, { material: 'pen', dur: 0.8, gain: 0.4 }); k.play('stroke', 8.1, { material: 'pen', dur: 0.8, gain: 0.4 });
        k.play('success', 4.2, { f: 'E5', gain: 0.3 }); k.play('success', 9.2, { f: 'G5', gain: 0.35 });
        k.play('stroke', 9.6, { material: 'pen', dur: 1.5, gain: 0.35 });
      },
    });

    const n = (i) => `<b style="font-family:Fredoka">${i}.</b> `;

    ui.mcq({ id: 'p10.q1-mcq', label: 'MCQ: metal extracted from bauxite [1]', shuffle: false,
      q: '<span class="marks">[1 mark]</span>' + n(1) + 'Which metal is extracted from the ore <b>bauxite</b>?',
      options: [
        { t: 'A   Iron', mis: 'ore-extraction', why: 'Iron comes from iron ore (haematite), heated in a blast furnace. Try again.' },
        { t: 'B   Copper', mis: 'ore-extraction', why: 'Copper comes from copper ore: it is smelted, then purified. Try again.' },
        { t: 'C   Aluminium', ok: true, why: 'Aluminium comes from bauxite. It is extracted by electrolysis, which uses a huge amount of electricity.' },
        { t: 'D   Zinc', mis: 'ore-extraction', why: 'Bauxite is not the ore of zinc. Think of the metal that needs a huge amount of electricity. Try again.' },
      ] });

    ui.write({ id: 'p10.q2-ferrous', label: 'Define ferrous metal [1]', marks: 1, lines: 2,
      q: n(2) + '<b>Define</b> the term <b>ferrous metal</b>.',
      scheme: ['A metal that contains iron'],
      model: 'A ferrous metal is a metal that <b>contains iron</b>. (Most ferrous metals are magnetic and will rust, but that is not the definition.)' });

    ui.write({ id: 'p10.q3-nonferrous', label: 'Name a non-ferrous metal and give a use [2]', marks: 2, lines: 2,
      q: n(3) + '<b>Name</b> one <b>non-ferrous metal</b> and <b>give</b> one use for it.',
      scheme: ['A correct non-ferrous metal: aluminium, copper, tin or zinc', 'A correct use for THAT metal, e.g. aluminium: drinks cans, foil, aircraft bodies / copper: electrical wire, water pipes / tin: coating on steel food cans, solder / zinc: galvanising steel, die-cast parts, batteries'],
      model: 'For example: <b>copper</b>, used for electrical wire. (Or aluminium for drinks cans; tin for coating steel food cans; zinc for galvanising steel.)' });

    ui.write({ id: 'p10.q4-alloy', label: 'What an alloy is and why alloys are made [2]', marks: 2, lines: 4,
      q: n(4) + '<b>State</b> what an <b>alloy</b> is, and <b>explain</b> why alloys are made.',
      scheme: ['A mixture of two or more elements, at least one of which is a metal', 'To get improved properties, e.g. harder / stronger / more corrosion-resistant / lower melting point (pure metals are often too soft)'],
      model: 'An alloy is a <b>mixture of two or more elements, at least one of which is a metal</b>. Alloys are made to get <b>improved properties</b>: pure metals are often too soft, and an alloy can be harder, stronger or more corrosion-resistant.' });

    ui.write({ id: 'p10.q5-chisel', label: 'Explain why high carbon steel is used for a chisel [2]', marks: 2, lines: 4,
      q: n(5) + 'The blade of a chisel is made from <b>high carbon steel</b>. <b>Explain</b> why this metal is used.',
      scheme: ['It is very hard (and strong) / it can be hardened and tempered (because of its higher carbon content)', 'So the blade keeps a sharp cutting edge / does not go blunt or wear quickly'],
      model: 'High carbon steel is <b>very hard</b> (it has more carbon than low carbon steel, and it can be hardened and tempered), <b>so</b> the blade <b>keeps a sharp cutting edge</b> and does not go blunt quickly.' });

    ui.write({ id: 'p10.q6-rust', label: 'Describe how steel can be protected from rusting [2]', marks: 2, lines: 4,
      q: n(6) + 'A steel garden gate will rust outdoors. <b>Describe</b> one way the steel can be protected from rusting.',
      scheme: ['A correct method: paint / oil or grease / plastic dip coating / powder coating / plating / galvanising (a zinc coating)', 'How it works: it is a barrier that keeps air (oxygen) and water away from the steel (galvanising: the zinc protects the steel even if it is scratched)'],
      model: 'The gate could be <b>galvanised</b>: coated with zinc. The coating <b>keeps air and water away from the steel</b>, and the zinc goes on protecting the steel even if it gets scratched. (Paint or a plastic coating also work as a barrier, until they are chipped.)' });

    ui.write({ id: 'p10.q7-environment', label: 'Environmental impact of extracting metals + benefit of recycling [3]', marks: 3, lines: 5,
      q: n(7) + '<b>Explain</b> one environmental impact of <b>extracting</b> metals from their ores, and one benefit of <b>recycling</b> metals.',
      scheme: ['An impact of extracting: mining scars the landscape / destroys habitats / extraction uses a lot of energy / it releases CO2 / ores are finite and are being used up', 'A benefit of recycling: it saves energy (aluminium: about 95%) / less ore has to be mined / metals can be recycled again and again without losing quality', 'One of the two points is developed with a "so" or "because", e.g. less energy so less CO2 is released / less mining so fewer habitats are destroyed / so the finite ores last longer'],
      model: 'Mining ore <b>scars the landscape and destroys habitats</b>, and extracting the metal uses a lot of energy and releases CO2. Recycling <b>saves energy</b> (about 95% for aluminium), <b>so</b> less CO2 is released and less ore has to be mined. Metals can be recycled again and again without losing quality.' });

    ui.box('<b>Add up your marks</b> on the questions above (out of 13). For any point you missed, read the model answer again and spot the key word, or the "so…", that you left out.', { tag: 'Self-assessment' });
  },
});
