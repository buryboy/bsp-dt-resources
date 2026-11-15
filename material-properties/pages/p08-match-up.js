// Page 8 — Match up: definitions of the physical and working properties, plus opposites.
Book.page({
  id: 'p08',
  title: 'Match up',
  build(ui) {
    ui.h('Match up');
    ui.p('Time to check you know the <b>definitions</b>. Tap a property, then tap its meaning. Try to get them all <b>first time</b>: your teacher can see the wrong tries!');

    // ---- physical properties ----
    ui.el('h2', '', 'Physical properties <span class="small">(what a material <i>is like</i>)</span>');
    ui.match({
      id: 'p08.physical', label: 'Match 5 physical properties to definitions',
      q: 'Tap a <b>physical property</b>, then tap its meaning.',
      pairs: [
        ['Absorbency', 'How well a material soaks up moisture or liquid', 'absorbency'],
        ['Density', 'Mass per unit volume: how heavy it is for its size', 'density-vs-weight'],
        ['Fusibility', 'The ability to be changed into a liquid (molten) state when heated to its melting point'],
        ['Electrical conductivity', 'How well a material lets electricity flow through it', 'heat-vs-electricity'],
        ['Thermal conductivity', 'How well a material lets heat travel through it', 'heat-vs-electricity'],
      ],
    });

    // ---- working properties ----
    ui.el('h2', '', 'Working properties <span class="small">(how it <i>behaves</i> under a force)</span>');
    const workMatch = ui.match({
      id: 'p08.working', label: 'Match 6 working properties to definitions',
      q: 'Now the <b>working properties</b>. Careful: some of these look alike!',
      pairs: [
        ['Strength', 'The ability to withstand a force without breaking or permanently bending', 'strong-vs-hard'],
        ['Hardness', 'The ability to resist scratching, wear and indentation (denting)', 'hard-vs-tough'],
        ['Toughness', 'The ability to absorb energy or an impact without breaking or cracking', 'hard-vs-tough'],
        ['Malleability', 'The ability to be permanently shaped by compression (hammered, pressed or rolled) without cracking', 'malleable-vs-ductile'],
        ['Ductility', 'The ability to be stretched (drawn) out into a thin wire without breaking', 'malleable-vs-ductile'],
        ['Elasticity', 'The ability to return to its original shape after the force is removed', 'elastic-vs-stretchy'],
      ],
    });

    // ---- memory trick animation: malleable = mallet, ductile = drawn ----
    ui.p('The two that everyone mixes up are <span class="key">malleable</span> and <span class="key">ductile</span>. Tap to watch a memory trick. <span class="small">(It un-blurs when you have finished the working properties match above.)</span>');
    const blockDims = (t) => {
      // the metal block gets squashed flatter and wider by two hammer blows (area roughly constant)
      const s = [[0, 120, 70], [4.75, 175, 48], [5.95, 260, 32]];
      let d = s[0]; s.forEach((x) => { if (t >= x[0]) d = x; });
      return { w: d[1], h: d[2] };
    };
    const hammerY = (t) => {
      // 0 = touching the block top; positive = raised. Two blows at 4.75 s and 5.95 s.
      const blow = (t0) => { const u = (t - (t0 - 0.35)) / 0.35; return u >= 0 && u <= 1 ? 1 - u * u : u > 1 && u < 1.9 ? (u - 1) / 0.9 : 1; };
      if (t < 4.4) return 1; if (t < 5.6) return blow(4.75); return t < 6.85 ? blow(5.95) : 1;
    };
    ui.anim({
      w: 860, h: 520, duration: 14, poster: 3.4,
      draw(k, t) {
        const L = 215, R = 645, base = 330;
        // headings
        k.text('MALLEABLE', L, 46, 0.1, 0.9, { font: 'bubble', size: 38, align: 'center' });
        k.text('DUCTILE', R, 46, 7.4, 8.1, { font: 'bubble', size: 38, align: 'center' });
        k.line([[430, 20], [432, 440]], 0.0, 0.6, { w: 1.6 });
        // ---- left: bench + metal block + mallet ----
        k.line([[60, base], [370, base]], 0.9, 1.3, { w: 3 });
        k.hatch([[60, base], [370, base], [370, base + 18], [60, base + 18]], 1.2, 1.8, { density: 0.8 });
        const d = blockDims(t), bx = L - d.w / 2, by = base - d.h;
        const B = [[bx, by], [bx + d.w, by], [bx + d.w, base], [bx, base], [bx, by]];
        k.line(B, 1.4, 2.2, { w: 3, seed: 41 });
        k.hatch(B, 1.9, 2.8, { density: 0.9 });
        if (t < 6.5) k.text('metal block', L, base + 50, 2.2, 2.7, { size: 22, align: 'center' });
        // mallet seen from the side: head upright with its face down, handle sticking out sideways
        if (t >= 2.8) {
          const hy = by - 4 - hammerY(t) * 70; // striking face of the head
          const hd = [[L - 24, hy - 76], [L + 24, hy - 76], [L + 24, hy], [L - 24, hy], [L - 24, hy - 76]];
          k.line(hd, 2.8, 3.2, { w: 3, seed: 51 });
          k.hatch(hd, 3.0, 3.4, { density: 1.2 });
          k.line([[L + 24, hy - 46], [L + 175, hy - 58]], 3.2, 3.4, { w: 2.6, seed: 52 });
          k.line([[L + 24, hy - 32], [L + 175, hy - 44]], 3.25, 3.45, { w: 2.6, seed: 53 });
          k.line([[L + 175, hy - 58], [L + 177, hy - 44]], 3.4, 3.5, { w: 2.6, seed: 54 });
          if ((t > 4.6 && t < 4.95) || (t > 5.8 && t < 6.15)) {
            k.line([[bx - 12, base - 14], [bx - 38, base - 26]], -1, 0, { color: Ink.RED, w: 2.4, seed: 61 });
            k.line([[bx - 12, base - 30], [bx - 30, base - 48]], -1, 0, { color: Ink.RED, w: 2.4, seed: 63 });
          }
        }
        k.arrow([[L - 150, 150], [L - 150, 215]], 3.6, 4.2, { color: Ink.RED, w: 2.6 });
        k.text('squash', L - 150, 138, 3.6, 4.2, { size: 22, color: Ink.RED, align: 'center' });
        k.text('(compression)', L - 130, 248, 3.9, 4.4, { size: 22, color: Ink.RED, align: 'center' });
        k.text('flattened into a sheet,', L, 408, 6.6, 7.0, { size: 22, align: 'center' });
        k.text('no cracks', L, 434, 6.9, 7.2, { size: 22, align: 'center' });
        if (t >= 7.2) Ink.tick(k.ctx, L + 66, 430, 0.9);
        // ---- right: drawing a rod through a die into wire ----
        const dx = 600, dy = 170; // die block
        const D1 = [[dx, dy], [dx + 60, dy], [dx + 60, dy + 150], [dx, dy + 150], [dx, dy]];
        k.line(D1, 8.0, 8.6, { w: 3, seed: 71 });
        // tapered hole in the die (wide on the left, narrow on the right)
        k.hatch([[dx, dy], [dx + 60, dy], [dx + 60, dy + 70], [dx, dy + 56]], 8.5, 9.0, { density: 1.1 });
        k.hatch([[dx, dy + 94], [dx + 60, dy + 80], [dx + 60, dy + 150], [dx, dy + 150]], 8.6, 9.1, { density: 1.1 });
        k.line([[dx, dy + 56], [dx + 60, dy + 70]], 8.6, 8.8, { w: 2.4 });
        k.line([[dx, dy + 94], [dx + 60, dy + 80]], 8.7, 8.9, { w: 2.4 });
        k.text('die', dx + 30, dy - 10, 8.6, 8.9, { size: 22, align: 'center' });
        // thick rod on the left
        k.line([[470, dy + 58], [dx + 2, dy + 58]], 9.0, 9.4, { w: 3 });
        k.line([[470, dy + 92], [dx + 2, dy + 92]], 9.1, 9.5, { w: 3 });
        k.line(k.ellipse(470, dy + 75, 8, 17), 9.3, 9.6, { w: 2.4 });
        k.text('thick rod', 520, dy + 130, 9.4, 9.8, { size: 22, align: 'center' });
        // thin wire coming out, growing over time
        const wl = 40 + 140 * k.win(10.0, 11.6);
        if (t >= 9.8) {
          k.line([[dx + 60, dy + 72], [dx + 60 + wl, dy + 72]], -1, 0, { w: 2.2, seed: 81 });
          k.line([[dx + 60, dy + 79], [dx + 60 + wl, dy + 79]], -1, 0, { w: 2.2, seed: 82 });
        }
        k.arrow([[dx + 90, dy + 30], [dx + 200, dy + 30]], 10.0, 10.6, { color: Ink.RED, w: 2.6 });
        k.text('pull (tension)', dx + 150, dy + 12, 10.1, 10.7, { size: 22, color: Ink.RED, align: 'center' });
        k.text('thin wire', dx + 140, dy + 118, 11.0, 11.4, { size: 22, align: 'center' });
        k.text('stretched into wire,', R, 408, 11.4, 11.8, { size: 22, align: 'center' });
        k.text('no snapping', R, 434, 11.7, 12.0, { size: 22, align: 'center' });
        if (t >= 12.0) Ink.tick(k.ctx, R + 78, 430, 0.9);
        // memory hooks
        k.text('MALLeable = MALLet (squash)', L, 474, 12.2, 12.9, { size: 22, color: Ink.RED, align: 'center' });
        k.text('Ductile = Drawn into wire (pull)', R, 474, 12.8, 13.5, { size: 22, color: Ink.RED, align: 'center' });
      },
      sound(k) {
        k.bed('room', 0, 14, { gain: 0.3 });
        k.play('stroke', 0.1, { material: 'pen', dur: 0.8, gain: 0.45 });
        k.play('stroke', 1.2, { material: 'pen', dur: 1.5, gain: 0.45 });
        k.play('stroke', 2.8, { material: 'pen', dur: 0.7, gain: 0.45 });
        k.play('thud', 4.75, { gain: 0.5 }); k.play('thud', 5.95, { gain: 0.5 });
        k.play('success', 7.2, { f: 'E5', gain: 0.35 });
        k.play('stroke', 7.4, { material: 'pen', dur: 2.2, gain: 0.45 });
        k.play('riser', 10.0, { dur: 1.6, gain: 0.25 });
        k.play('success', 12.0, { f: 'G5', gain: 0.35 });
        k.play('stroke', 12.2, { material: 'pen', dur: 1.3, gain: 0.4 });
      },
    });

    // the memory trick shows two of the matches, so it stays blurred until the working properties match is finished
    { const trick = ui.root.lastElementChild, fin = () => { const it = Book.state.items['p08.working']; return !!(it && it.correct != null); };
      if (!fin()) { trick.classList.add('peek-lock'); workMatch.addEventListener('click', () => setTimeout(() => { if (fin()) trick.classList.remove('peek-lock'); }, 50)); } }

    // ---- opposites ----
    ui.el('h2', '', 'Opposites');
    ui.fill({
      id: 'p08.opposites', label: 'Opposites: tough / conductor / elastic',
      q: 'Write the <b>opposite</b> of each property.',
      html: '<div style="line-height:2.4">' +
        '<b>tough</b> &nbsp;⟷&nbsp; {{brittle|britle|brittel|brittal|brital|brittle material}} <span class="small">(snaps or shatters on impact, like glass)</span><br>' +
        '<b>conductor</b> &nbsp;⟷&nbsp; {{insulator|insulater|insulators|an insulator|insulater|insolator|insulator material}} <span class="small">(lets little heat or electricity through)</span><br>' +
        '<b>elastic</b> &nbsp;⟷&nbsp; {{plastic|plastik|plasticity|plastic deformation}} <span class="small">(stays in its new shape, like clay)</span></div>',
      explain: 'Tough ⟷ <b>brittle</b>, conductor ⟷ <b>insulator</b>, elastic ⟷ <b>plastic</b> (it stays in its new shape).',
    });
  },
});
