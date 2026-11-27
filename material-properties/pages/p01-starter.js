// Page 1 — Starter: which spoon gets hot? (sample page: shows the conventions for the other page files)
Book.page({
  id: 'p01',
  title: 'Starter: which spoon gets hot?',
  build(ui) {
    ui.h('Which spoon gets hot?');
    ui.p('Three spoons are left standing in a mug of hot tea for <b>two minutes</b>: one <b>stainless steel</b>, one <b>wooden</b> and one <b>polypropylene</b> (plastic).');

    ui.predict({ id: 'p01.predict', label: 'Starter prediction: which spoon handle gets hottest?', q: '<b>Predict:</b> which spoon handle will feel hottest?',
      options: ['Stainless steel', 'Wood', 'Polypropylene', 'They will all be the same'] });

    ui.p('Now watch what happens. Tap the picture to play.');
    const mug = (k, x0) => {
      const P = [[x0, 200], [x0 + 10, 380], [x0 + 230, 380], [x0 + 240, 200]];
      k.line(P, 0.1, 0.9, { w: 3.2 });
      k.line(k.ellipse(x0 + 120, 200, 120, 18, 0, Math.PI * 2 + 0.2), 0.8, 1.2, { w: 2.6 });
      k.line(k.curve([x0 + 240, 240], [x0 + 300, 236], [x0 + 300, 330], [x0 + 236, 330]), 1.1, 1.4, { w: 3 });
      // steam
      [0, 1, 2].forEach((i) => k.line(k.curve([x0 + 70 + i * 50, 170], [x0 + 50 + i * 50, 140], [x0 + 90 + i * 50, 120], [x0 + 70 + i * 50, 90]), 1.4 + i * 0.15, 1.8 + i * 0.15, { w: 2 }));
    };
    ui.anim({
      w: 860, h: 440, duration: 12, poster: 1.9,
      draw(k, t) {
        mug(k, 300);
        // three spoons leaning in the mug
        const sp = [
          { x: 360, lab: 'steel', hot: true, col: Ink.BLUE },
          { x: 420, lab: 'wood', hot: false },
          { x: 480, lab: 'polypropylene', hot: false },
        ];
        sp.forEach((s, i) => {
          const a = 2 + i * 0.5;
          const P = [[s.x + 10, 330], [s.x - 60 + i * 60, 40]];
          k.line(P, a, a + 0.5, { w: i === 1 ? 5 : 3.4 });
          k.text(s.lab, s.x - 120 + i * 120 + (i === 2 ? 40 : 0), 30, a + 0.4, a + 0.8, { size: 24, align: 'center' });
        });
        // heat travelling up the steel spoon: red wiggles climbing
        const hp = k.win(4.5, 8.5);
        if (hp > 0) {
          const x1 = 370, y1 = 330, x2 = 300, y2 = 40;
          for (let j = 0; j < 9; j++) {
            const u = j / 9; if (u > hp) break;
            const x = x1 + (x2 - x1) * u, y = y1 + (y2 - y1) * u;
            k.line([[x - 14, y + 4], [x - 6, y - 4], [x + 2, y + 4], [x + 10, y - 4]], 4.5 + u * 4, 4.7 + u * 4, { color: Ink.RED, w: 2 });
          }
        }
        k.text('ouch!', 230, 90, 8.6, 9.0, { size: 34, color: Ink.RED, font: 'bubble' });
        k.text('still cool', 560, 110, 9.2, 9.8, { size: 26 });
        k.arrow(k.curve([600, 120], [640, 150], [640, 200], [610, 230]), 9.6, 10.2, { w: 2 });
        k.text('Only the METAL handle got hot. Why?', 430, 425, 10.2, 11.6, { size: 26, align: 'center', color: Ink.RED });
      },
      sound(k) {
        k.bed('room', 0, 12, { gain: 0.35 });
        k.play('stroke', 0.1, { material: 'pen', dur: 1.2, gain: 0.5 });
        [2, 2.5, 3].forEach((a) => k.play('stroke', a, { material: 'pen', dur: 0.5, gain: 0.6 }));
        k.play('riser', 4.5, { dur: 4, gain: 0.35 });
        k.play('error', 8.6, { f: 'F4', gain: 0.4 });
        k.play('stroke', 10.2, { material: 'pen', dur: 1.4, gain: 0.5 });
        k.play('success', 11.6, { f: 'G5', gain: 0.5 });
      },
    });


    const check = ui.mcq({ id: 'p01.check', label: 'Why does the steel spoon get hot?', q: 'So, why did the steel spoon handle get hot? <span class="small">(Work it out from what you saw. The notes below un-blur when you get it right.)</span>',
      options: [
        { t: 'Steel has high thermal conductivity: heat travels along it fast', ok: true },
        { t: 'Steel is a hard material, so it heats up more than wood', mis: 'physical-vs-working', why: 'Hardness is about resisting scratches and dents, not heat.' },
        { t: 'Steel is heavier (denser) than wood, so it holds more heat', mis: 'density-vs-weight', why: 'Density is mass for its size: it doesn\'t decide how heat travels.' },
        { t: 'Metal is naturally warmer than wood or polypropylene', mis: 'metal-feels-cold', why: 'All three started at room temperature. It\'s about how fast heat moves.' },
      ] });
    const notes = ui.box('<b>Why?</b> Heat travels through some materials much faster than others. This is a <span class="key">physical property</span> called <span class="key">thermal conductivity</span>. Metals like steel are good <b>thermal conductors</b>. Wood and polymers are <b>thermal insulators</b>, which is why pan handles are often made from them.<br><span class="small">Fun fact: a metal spoon in a cold drawer feels colder than a wooden one, but they are the same temperature! The metal conducts heat away from your hand faster.</span>', { tag: 'Notes' });
    // the notes give the answer away, so they stay blurred until the question has been answered correctly
    const answered = () => { const it = Book.state.items['p01.check']; return !!(it && it.correct === true); };
    if (!answered()) { notes.classList.add('peek-lock'); check.addEventListener('click', () => setTimeout(() => { if (answered()) notes.classList.remove('peek-lock'); }, 50)); }
    ui.rate({ id: 'p01.conf', label: 'Confidence: I can explain thermal conductivity', q: 'How confident do you feel explaining this to a friend?' });
  },
});
