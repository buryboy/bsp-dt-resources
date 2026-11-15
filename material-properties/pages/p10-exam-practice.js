// Page 10 — Exam practice: AQA-style written questions (State / Describe / Explain / Compare) + one multiple choice.
Book.page({
  id: 'p10',
  title: 'Exam practice',
  build(ui) {
    const RED = Ink.RED, GREEN = Ink.GREEN;
    ui.h('Exam practice');
    ui.p('These are written like real AQA questions. Answer in full sentences, then tap <b>Check my answer</b> and tick each mark-scheme point you <b>really</b> made. Be an honest examiner! <span class="key">About 12 marks</span>.');

    // ---- tip box with a pen animation of how an 'explain' answer earns 2 marks ----
    ui.box('<b>Command words.</b> <b>State</b> = a short fact or definition. <b>Describe</b> = say what it is like. <b>Explain</b> = give a point, then <b>because</b> / <b>so</b> to say why it matters. <b>Compare</b> = say how both things are similar or different, using words like <i>harder than</i>, <i>whereas</i>.<br>' +
      '<span class="small">For an <b>explain</b> question, each mark is usually a <b>point + reason</b>. Watch:</span>', { tag: 'Exam tip: point + because / so' });
    ui.anim({
      w: 860, h: 300, duration: 11, poster: 1.6,
      draw(k) {
        k.text('Explain why HDPE is a good material for a kayak.  [2 marks]', 20, 40, 0.0, 1.4, { size: 23 });
        k.line([[20, 56], [820, 58]], 1.3, 1.6, { w: 1.4 });
        // the student's answer, written in two parts
        k.text('HDPE has a low density,', 40, 118, 1.8, 3.6, { size: 26 });
        k.text('so the kayak floats and is light to carry.', 40, 178, 5.0, 7.0, { size: 26 });
        // examiner's red pen (positions follow the real width of the handwriting)
        const c = k.ctx; c.save(); c.font = '400 26px "Gloria Hallelujah", "Comic Sans MS", cursive';
        const w1 = c.measureText('HDPE has a low density,').width, w2 = c.measureText('so the kayak floats and is light to carry.').width; c.restore();
        k.line(k.ellipse(40 + w1 / 2, 108, w1 / 2 + 22, 30), 3.8, 4.4, { color: RED, w: 2.2 });
        k.text('POINT', 40 + w1 + 50, 118, 4.2, 4.6, { size: 28, color: RED, font: 'bubble' });
        if (k.t >= 4.7) Ink.tick(k.ctx, 40 + w1 + 170, 110, 1, GREEN);
        k.line(k.ellipse(40 + w2 / 2, 168, w2 / 2 + 22, 30), 7.4, 8.0, { color: RED, w: 2.2 });
        k.text('SO... (why)', 40 + w2 + 50, 178, 7.8, 8.3, { size: 28, color: RED, font: 'bubble' });
        if (k.t >= 8.4) Ink.tick(k.ctx, Math.min(830, 40 + w2 + 270), 170, 1, GREEN);
        k.text('point + reason = 2 marks', 430, 262, 8.8, 10.0, { size: 30, color: RED, align: 'center', font: 'bubble' });
        k.line([[260, 276], [600, 278]], 9.9, 10.3, { color: RED, w: 2.4 });
      },
      sound(k) {
        k.bed('room', 0, 11, { gain: 0.3 });
        k.play('stroke', 0, { material: 'pen', dur: 1.4, gain: 0.4 });
        k.play('stroke', 1.8, { material: 'pen', dur: 1.8, gain: 0.45 });
        k.play('stroke', 3.8, { material: 'pen', dur: 0.6, gain: 0.45 });
        k.play('success', 4.7, { f: 'E5', gain: 0.35 });
        k.play('stroke', 5.0, { material: 'pen', dur: 2.0, gain: 0.45 });
        k.play('stroke', 7.2, { material: 'pen', dur: 0.8, gain: 0.45 });
        k.play('success', 8.4, { f: 'G5', gain: 0.35 });
        k.play('stamp', 10.0, { gain: 0.35 });
      },
    });

    const n = (i) => `<b style="font-family:Fredoka">${i}.</b> `;

    ui.mcq({ id: 'p10.q6-mcq', label: 'MCQ: property = resist scratching, wear, indentation [1]', shuffle: false,
      q: '<span class="marks">[1 mark]</span>' + n(1) + 'Which property describes the ability of a material to resist scratching, wear and indentation?',
      options: [
        { t: 'A   Toughness', mis: 'hard-vs-tough', why: 'Not toughness: that is about a sudden blow, not about marking the surface. Try again.' },
        { t: 'B   Hardness', ok: true, why: 'Hardness = resisting scratching, wear (abrasion) and indentation (denting).' },
        { t: 'C   Strength', mis: 'strong-vs-hard', why: 'Strength is withstanding a force without breaking or permanently bending. Try again.' },
        { t: 'D   Malleability', why: 'Not malleability: that is about being shaped on purpose, not about resisting marks. Try again.' },
      ] });

    ui.write({ id: 'p10.q1-toughness', label: "State what is meant by 'toughness' [1]", marks: 1, lines: 2,
      q: n(2) + "<b>State</b> what is meant by 'toughness'.",
      scheme: ['The ability to absorb energy / an impact (a sudden force) without breaking or cracking'],
      model: 'Toughness is the ability of a material to absorb energy or an impact without breaking or cracking.' });

    ui.write({ id: 'p10.q2-malleable-ductile', label: 'Describe malleable vs ductile [2]', marks: 2, lines: 3,
      q: n(3) + 'Describe the difference between a <b>malleable</b> material and a <b>ductile</b> material.',
      scheme: ['Malleable: can be permanently shaped by compression (hammered, pressed or rolled) without cracking', 'Ductile: can be stretched / drawn out into a thin wire (under tension) without breaking'],
      model: 'A malleable material can be hammered, pressed or rolled into a new shape (compression) without cracking, whereas a ductile material can be stretched (drawn) out into a thin wire without breaking.' });

    ui.write({ id: 'p10.q3-copper', label: 'Explain why copper is used for cable cores [2]', marks: 2, lines: 3,
      q: n(4) + '<b>Explain</b> why copper is used for the core of electrical cables.',
      scheme: ['Copper has high electrical conductivity, so electricity flows through it easily', 'Copper is ductile, so it can be drawn out into thin wire'],
      model: 'Copper has a high electrical conductivity, so electricity flows through it easily. It is also ductile, so it can be drawn out into thin wire for the cable.' });

    ui.write({ id: 'p10.q4-handle', label: 'Explain why saucepan handles are thermoset [2]', marks: 2, lines: 3,
      q: n(5) + '<b>Explain</b> why saucepan handles are often made from a thermosetting polymer.',
      scheme: ['Low thermal conductivity / a thermal insulator, so the handle stays cool enough to hold', 'A thermoset does not soften or melt when heated (it chars instead), so the handle keeps its shape next to the hot pan'],
      model: 'A thermosetting polymer such as phenol formaldehyde has a low thermal conductivity, so heat does not travel along the handle and it stays cool to hold. Also, thermosets do not soften or melt when they get hot, so the handle keeps its shape near the hob.' });

    ui.write({ id: 'p10.q5-compare', label: 'Compare hardness + toughness of glass and mild steel [4]', marks: 4, lines: 5,
      q: n(6) + '<b>Compare</b> the hardness and toughness of <b>glass</b> and <b>mild (low-carbon) steel</b>.',
      scheme: ['Glass is very hard: it resists scratching and wear', 'Glass is brittle (not tough): it cracks or shatters on impact', 'Mild steel is tough: it absorbs an impact without breaking', 'A comparison is made for both properties, e.g. glass is harder than mild steel, whereas mild steel is much tougher than glass'],
      model: 'Glass is harder than mild steel, so it resists scratches better. However, glass is brittle, so it cracks or shatters when it is hit, whereas mild steel is tough and absorbs the impact without breaking. So glass is the harder material but mild steel is the tougher one.' });

    ui.box('<b>Add up your marks</b> on the questions above (out of 12). For any point you missed, read the model answer again and spot the key word you left out.', { tag: 'Self-assessment' });
  },
});
