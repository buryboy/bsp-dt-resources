// Page 9 — Material detective: eight products on case-file cards.
// For each: which material is it, and why does it suit the job? Ends with a 2-mark written explanation.
Book.page({
  id: 'p09',
  title: 'Material detective',
  build(ui, root) {
    const RED = Ink.RED;
    ui.h('Material detective');
    ui.p('Designers pick a material for a <b>reason</b>. Eight products are on your desk. For each case file, look at the drawing and the clues, then decide <b>which material</b> it is and <b>why</b> it suits the job.');
    ui.p('<span class="small">No notes on this page: it is all from memory. If you get one wrong, read why, then try again.</span>');

    // options are shuffled per question id here (so the right answer is not always in the same place)
    const hash = (s) => { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h % 100000; };
    const mcq = (o) => ui.mcq(Object.assign({}, o, { shuffle: false, options: Book.shuffle(o.options, hash(o.id) + 50) }));

    // ---- a pen-drawn case-file card (a folder with a tab) that draws itself when it scrolls into view ----
    const SW = 300, SH = 370;
    const caseFile = (n, title, clues, product) => {
      const api = ui.anim({
        w: SW, h: SH, duration: 3.2, poster: 0.001,
        draw(k) {
          const c = k.ctx;
          const P = [[14, 48], [18, 14], [124, 12], [134, 46], [286, 44], [288, 354], [14, 356], [14, 48]];
          k.shadow(P, 0, 0.3);
          c.save(); c.fillStyle = 'rgba(226,190,120,0.34)'; c.beginPath(); P.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y))); c.fill(); c.restore();
          k.line(P, 0, 0.45, { w: 2.4, seed: 11 + n });
          k.line([[14, 48], [134, 46]], 0.4, 0.5, { w: 1.4 });
          k.text('CASE ' + n, 28, 40, 0.3, 0.6, { size: 22, color: RED });
          k.text(title, SW / 2, 78, 0.45, 0.85, { size: 23, align: 'center' });
          product(k, 0.7, 2.2);
          clues.forEach((s, i) => k.text(s, SW / 2, 264 + i * 29, 2.1 + i * 0.25, 2.35 + i * 0.25, { size: 22, align: 'center' }));
        },
        sound(k) { k.play('stroke', 0, { material: 'pen', dur: 0.5, gain: 0.3 }); k.play('stroke', 0.7, { material: 'pen', dur: 1.4, gain: 0.3 }); k.play('stroke', 2.1, { material: 'pen', dur: 0.9, gain: 0.25 }); },
      });
      const wrap = root.lastElementChild; wrap.classList.add('p09-case');
      wrap.querySelector('.ink-play').style.display = 'none';
      if (window.IntersectionObserver) new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting && api.t < api.duration - 0.01) api.play(); }), { threshold: 0.35 }).observe(wrap);
      else api.seek(api.duration);
      return wrap;
    };

    // ---- product drawings (all inside x 26..274, y 88..236). No material is labelled. ----
    const mk = (a, b) => (u) => a + (b - a) * u;
    const canoe = (k, a, b) => {
      const m = mk(a, b);
      const top = k.curve([30, 142], [90, 160], [210, 160], [270, 142]), bot = k.curve([30, 142], [84, 204], [216, 204], [270, 142]);
      k.line(top, m(0), m(0.25), { w: 2.8 }); k.line(bot, m(0.2), m(0.5), { w: 2.8 });
      k.line(k.ellipse(150, 158, 30, 7), m(0.5), m(0.62), { w: 2.2 });
      k.hatch(top.concat(bot.slice().reverse()), m(0.55), m(0.75), { density: 0.7 });
      k.line([[104, 100], [200, 216]], m(0.72), m(0.82), { w: 3 });
      k.line(k.ellipse(98, 94, 9, 16), m(0.8), m(0.88), { w: 2.2 }); k.line(k.ellipse(206, 222, 9, 16), m(0.84), m(0.92), { w: 2.2 });
      [[26, 70], [226, 274]].forEach(([x0, x1], i) => { const P = []; for (let x = x0; x <= x1; x += 4) P.push([x, 196 + Math.sin(x * 0.3) * 3]); k.line(P, m(0.9 + i * 0.04), m(0.96 + i * 0.04), { w: 1.6 }); });
    };
    const glasses = (k, a, b) => {
      const m = mk(a, b);
      k.line(k.rect(48, 138, 82, 56, 16), m(0), m(0.22), { w: 3 });
      k.line(k.rect(170, 138, 82, 56, 16), m(0.2), m(0.42), { w: 3 });
      k.line(k.curve([130, 158], [140, 144], [160, 144], [170, 158]), m(0.42), m(0.5), { w: 3 });
      k.line([[48, 150], [36, 142], [30, 112]], m(0.5), m(0.6), { w: 2.8 });
      // the other arm has been bent right over
      k.line(k.curve([252, 150], [272, 150], [278, 128], [258, 118]).concat(k.curve([258, 118], [236, 108], [246, 92], [268, 96])), m(0.6), m(0.78), { w: 2.8 });
      k.line([[62, 150], [76, 172]], m(0.78), m(0.82), { w: 1.4 }); k.line([[184, 150], [198, 172]], m(0.8), m(0.84), { w: 1.4 });
      k.arrow(k.ellipse(232, 110, 22, 22, 2.6, 4.6), m(0.86), m(1), { color: RED, w: 2.2, head: 10 });
      k.text('!', 206, 118, m(0.9), m(1), { size: 26, color: RED });
    };
    const gloves = (k, a, b) => {
      const m = mk(a, b);
      k.line(k.rect(176, 94, 86, 140, 10), m(0), m(0.22), { w: 2.8 });
      k.line(k.rect(184, 106, 70, 106, 3), m(0.2), m(0.36), { w: 1.8 });
      k.circle(219, 223, 4, m(0.34), m(0.4), { w: 1.6 });
      // a gloved hand, pointing
      const hand = [[26, 150], [70, 144], [96, 150]].concat(k.curve([96, 150], [130, 148], [170, 146], [196, 150]), k.curve([196, 150], [204, 156], [204, 164], [196, 168]), [[120, 172]], k.curve([120, 172], [128, 196], [112, 212], [84, 212]), [[30, 214]]);
      k.line(hand, m(0.4), m(0.72), { w: 2.8 });
      k.line([[40, 146], [42, 216]], m(0.7), m(0.76), { w: 2 }); k.line([[52, 146], [54, 214]], m(0.72), m(0.78), { w: 2 });
      k.hatch([[176, 149], [198, 151], [202, 160], [196, 168], [176, 169]], m(0.76), m(0.86), { density: 1.8, color: RED });
      k.line(k.ellipse(206, 160, 12, 12, -1.1, 1.1), m(0.86), m(0.92), { w: 1.8, color: RED });
      k.line(k.ellipse(206, 160, 22, 22, -1, 1), m(0.92), m(1), { w: 1.8, color: RED });
    };
    const tshirt = (k, a, b) => {
      const m = mk(a, b);
      const neck = k.curve([122, 108], [134, 128], [166, 128], [178, 108]);
      const body = [[122, 108], [92, 114], [50, 146], [72, 174], [94, 158], [94, 234], [206, 234], [206, 158], [228, 174], [250, 146], [208, 114], [178, 108]];
      k.line(body, m(0), m(0.45), { w: 2.8 }); k.line(neck, m(0.42), m(0.52), { w: 2.6 });
      const star = []; for (let i = 0; i <= 10; i++) { const r = i % 2 ? 11 : 26, an = -Math.PI / 2 + i * Math.PI / 5; star.push([150 + Math.cos(an) * r, 184 + Math.sin(an) * r]); }
      k.line(star, m(0.55), m(0.75), { w: 2.2, color: RED }); k.hatch(star, m(0.72), m(0.86), { density: 1.4, color: RED });
      k.circle(46, 108, 12, m(0.84), m(0.92), { w: 2.2 });
      for (let i = 0; i < 8; i++) { const an = i * Math.PI / 4; k.line([[46 + Math.cos(an) * 16, 108 + Math.sin(an) * 16], [46 + Math.cos(an) * 23, 108 + Math.sin(an) * 23]], m(0.9 + i * 0.01), m(0.93 + i * 0.01), { w: 1.8 }); }
    };
    const overalls = (k, a, b) => {
      const m = mk(a, b);
      k.circle(150, 106, 17, m(0), m(0.14), { w: 2.8 });
      k.line([[138, 100], [164, 100], [164, 110], [138, 110], [138, 100]], m(0.12), m(0.2), { w: 1.8 });
      const suit = [[134, 124], [112, 130], [96, 178], [108, 182], [124, 150], [126, 190], [118, 234], [140, 234], [150, 198], [160, 234], [182, 234], [174, 190], [176, 150], [192, 182], [204, 178], [188, 130], [166, 124], [134, 124]];
      k.line(suit, m(0.2), m(0.62), { w: 2.8 });
      k.line([[150, 126], [150, 186]], m(0.6), m(0.66), { w: 1.6 }); k.line([[126, 188], [174, 188]], m(0.64), m(0.7), { w: 2 });
      k.line([[130, 140], [144, 140]], m(0.68), m(0.71), { w: 1.6 }); k.line([[156, 140], [170, 140]], m(0.7), m(0.73), { w: 1.6 });
      const flame = (x, s) => k.curve([x - 14 * s, 234], [x - 20 * s, 204], [x - 2 * s, 204], [x, 176]).concat(k.curve([x, 176], [x + 6 * s, 198], [x + 20 * s, 206], [x + 14 * s, 234]));
      k.line(flame(62, 1), m(0.74), m(0.84), { w: 2.2, color: RED }); k.line(flame(238, 1), m(0.8), m(0.9), { w: 2.2, color: RED });
      k.line(flame(84, 0.6), m(0.86), m(0.93), { w: 2, color: RED }); k.line(flame(216, 0.6), m(0.9), m(0.97), { w: 2, color: RED });
      k.line([[26, 235], [274, 235]], m(0.94), m(1), { w: 1.6 });
    };
    const bumper = (k, a, b) => {
      const m = mk(a, b);
      k.line([[30, 138], [62, 138]], m(0), m(0.05), { w: 3 }); k.line([[30, 192], [62, 192]], m(0.03), m(0.08), { w: 3 });
      k.line(k.rect(62, 118, 138, 94, 4), m(0.08), m(0.3), { w: 2.8 });
      const R = H.rng(31);
      for (let i = 0; i < 18; i++) { const cx = 76 + (i % 6) * 22 + R() * 6, cy = 132 + Math.floor(i / 6) * 28 + R() * 8, r = 5 + R() * 6; k.circle(cx, cy, r, m(0.3 + i * 0.02), m(0.34 + i * 0.02), { w: 1.6 }); }
      k.line(k.curve([204, 98], [228, 128], [228, 200], [204, 232]), m(0.68), m(0.8), { w: 3.4 });
      k.line(k.curve([214, 100], [238, 130], [238, 198], [214, 230]), m(0.74), m(0.86), { w: 1.8 });
      k.arrow([[274, 165], [244, 165]], m(0.88), m(0.96), { color: RED, w: 2.6, head: 12 });
      k.line([[262, 144], [252, 150]], m(0.94), m(0.97), { color: RED, w: 1.8 }); k.line([[262, 186], [252, 180]], m(0.96), m(1), { color: RED, w: 1.8 });
    };
    const blade = (k, a, b) => {
      const m = mk(a, b);
      k.line([[128, 88], [124, 104]], m(0), m(0.05), { w: 2.4 }); k.line([[172, 88], [176, 104]], m(0.03), m(0.08), { w: 2.4 });
      const cup = [[118, 104], [182, 104], [172, 150], [130, 150], [118, 104]];
      k.line(cup, m(0.08), m(0.28), { w: 2.8 }); k.hatch(cup, m(0.26), m(0.4), { density: 0.9 });
      const c1 = k.curve([166, 150], [214, 170], [214, 222], [140, 228]).concat([[92, 222]]);
      const c2 = k.curve([156, 150], [200, 174], [198, 214], [140, 219]).concat([[94, 214]]);
      k.line(c1, m(0.4), m(0.62), { w: 3 }); k.line(c2, m(0.56), m(0.78), { w: 3 }); k.line([[92, 222], [94, 214]], m(0.78), m(0.8), { w: 3 });
      k.line([[26, 233], [274, 233]], m(0.8), m(0.88), { w: 1.6 });
    };
    const screen = (k, a, b) => {
      const m = mk(a, b);
      const sheet = [[40, 126], [196, 104]].concat(k.curve([196, 104], [226, 110], [226, 196], [196, 208]), [[40, 226], [40, 126]]);
      k.line(sheet, m(0), m(0.4), { w: 2.8 });
      // the right-hand end is rolled up
      k.line(k.curve([196, 104], [176, 120], [176, 192], [196, 208]), m(0.38), m(0.5), { w: 2 });
      k.line(k.ellipse(202, 156, 8, 26, 0.6, 5.4), m(0.48), m(0.58), { w: 1.6 });
      for (let i = 0; i < 6; i++) { const x = 58 + (i % 3) * 36, y = 144 + Math.floor(i / 3) * 38 - (i % 3) * 5; k.line(k.rect(x, y, 22, 22, 5), m(0.58 + i * 0.05), m(0.63 + i * 0.05), { w: 1.8 }); }
      k.line([[56, 122], [56, 132]], m(0.9), m(0.92), { w: 1.4 });
      k.arrow(k.ellipse(236, 156, 20, 44, -1.1, 1.1), m(0.9), m(1), { color: RED, w: 2, head: 9 });
    };

    // ---- one case = card + two questions side by side ----
    const cols = {};
    const file = (n, key, title, clues, product, mat, why) => {
      const row = ui.el('div', 'row p09-row');
      row.appendChild(caseFile(n, title, clues, product));
      const col = (cols[key] = ui.el('div', 'p09-qs', '', row));
      col.appendChild(mcq(Object.assign({ id: `p09.${key}-mat`, q: '<b>Which material</b> is it?' }, mat)));
      col.appendChild(mcq(Object.assign({ id: `p09.${key}-why` }, why)));
    };
    const css = document.createElement('style');
    css.textContent = `.p09-row{gap:16px;margin-bottom:var(--R)}.p09-row>.p09-case{flex:0 0 250px;margin:0;position:sticky;top:8px}.p09-row>.p09-qs{flex:1 1 330px;min-width:0}.p09-qs .act{margin-bottom:calc(var(--R)*.8)}
      .p09-qs .opts{grid-template-columns:repeat(auto-fit,minmax(200px,1fr))}
      @media (max-width:760px){.p09-row>.p09-case{flex:0 0 100%;max-width:280px;position:static}}`;
    root.appendChild(css);

    file(1, 'canoe', 'club canoe', ['Hull moulded in one', 'piece. Never rots. Cheap', 'enough for a club.'], canoe,
      { label: 'Club canoe: which material', options: [
        { t: 'Glass reinforced plastic (GRP)', ok: true, why: 'Yes: GRP (fibreglass). Now say what it is made from.' },
        { t: 'Carbon fibre reinforced plastic (CFRP)', mis: 'gfrp-cfrp', why: 'CFRP would be strong and light, but it is expensive. Read the last clue again.' },
        { t: 'Aluminium metal foam (a modern material)', mis: 'modern-mixup', why: 'Metal foam is used to absorb impacts and for light panels. A hull moulded in one waterproof piece is a job for a fibre composite.' },
      ] },
      { label: 'Club canoe: matrix + reinforcement', q: 'What is it <b>made from</b>?', options: [
        { t: 'Polyester resin holding glass fibres', ok: true, why: 'Yes: polyester resin is the matrix and glass fibres are the reinforcement.' },
        { t: 'Epoxy resin holding carbon fibres', mis: 'gfrp-cfrp', why: 'That is CFRP, the expensive one. The cheaper composite uses a different resin and a different fibre.' },
        { t: 'Glass holding fibres of polyester', mis: 'matrix-reinforcement', why: 'That is the wrong way round. The resin is the matrix that binds; the fibres are the reinforcement.' },
      ] });

    file(2, 'frame', 'glasses frame', ['Sat on by accident!', 'Bent right over, then', 'sprang back by itself.'], glasses,
      { label: 'Glasses frame: which material', options: [
        { t: 'A shape memory alloy (nitinol)', ok: true, why: 'Yes: this type of shape memory alloy is superelastic. It bends a long way and springs back.' },
        { t: 'A carbon fibre composite (CFRP)', mis: 'sma-mixup', why: 'CFRP is very stiff, and it fails in a brittle way: it would not bend right over and spring back.' },
        { t: 'A photochromic pigment (in a coating)', mis: 'stimulus-mixup', why: 'A photochromic pigment changes colour in light. It does nothing to the shape of the frame.' },
      ] },
      { label: 'Shape memory alloy: how to recover its shape', q: 'A wire of the same material is bent when cool and <b>stays bent</b>. How do you get its shape back?', options: [
        { t: 'Heat it: it returns to the shape it remembers', ok: true, why: 'Yes: heated above its transition temperature, it returns to its original "remembered" shape.' },
        { t: 'Shine a bright light on it: light resets it', mis: 'stimulus-mixup', why: 'Light is the stimulus for photochromic pigments. This material responds to a different stimulus.' },
        { t: 'Nothing works: a bent wire stays bent', mis: 'sma-mixup', why: 'This material is smart: its shape change can be reversed by the right stimulus.' },
      ] });

    file(3, 'gloves', 'winter gloves', ['Your phone screen', 'still works with them', 'on. Shiny fingertips.'], gloves,
      { label: 'Touchscreen gloves: which material', options: [
        { t: 'A conductive fabric', ok: true, why: 'Yes. Now say why the screen responds.' },
        { t: 'A Kevlar fabric', mis: 'kevlar-props', why: 'Kevlar is chosen for its strength and cut resistance. That does not help a touchscreen to work.' },
        { t: 'A micro-encapsulated fabric', mis: 'tech-textile-mixup', why: 'A micro-encapsulated fabric slowly releases a substance such as a scent. That does not work a touchscreen.' },
      ] },
      { label: 'Touchscreen gloves: why the screen responds', q: '<b>Why</b> does the screen respond?', options: [
        { t: 'Metal threads let electricity flow through the glove', ok: true, why: 'Yes: conductive threads (such as silver or copper) let electricity flow through the fabric.' },
        { t: 'Tiny capsules burst and release a substance onto it', mis: 'tech-textile-mixup', why: 'That is micro-encapsulation. It releases a substance; it does not carry electricity.' },
        { t: 'Aramid fibres in the fingertips resist being cut', mis: 'tech-textile-mixup', why: 'That describes Kevlar. Cut resistance does not make a touchscreen respond.' },
      ] });

    file(4, 'tshirt', 'T-shirt', ['Plain white indoors.', 'In sunshine, even on a', 'cold day, a star shows.'], tshirt,
      { label: 'Colour-change T-shirt: which material', options: [
        { t: 'A photochromic pigment', ok: true, why: 'Yes: the stimulus is light (UV in sunlight). Now say what happens indoors.' },
        { t: 'A thermochromic pigment', mis: 'stimulus-mixup', why: 'Thermochromic pigments respond to temperature. The clue says it works even on a cold day, so heat is not the stimulus.' },
        { t: 'A conductive fabric', mis: 'tech-textile-mixup', why: 'A conductive fabric lets electricity flow through it. Nothing here is powered.' },
      ] },
      { label: 'Colour-change T-shirt: what happens indoors', q: 'What happens when the wearer goes <b>back indoors</b>?', options: [
        { t: 'The star fades: the change reverses', ok: true, why: 'Yes: a smart material changes back when the stimulus is removed.' },
        { t: 'The star stays: the change is permanent', mis: 'smart-meaning', why: 'A smart material responds to a stimulus and changes back when the stimulus goes.' },
        { t: 'The star stays until a battery runs out', mis: 'smart-meaning', why: 'Smart materials need no electrical control. They respond to their surroundings by themselves.' },
      ] });

    file(5, 'overalls', 'racing overalls', ['Worn by the driver in', 'every race. Protects', 'in a fuel fire.'], overalls,
      { label: 'Racing overalls: which material', options: [
        { t: 'A fire resistant fabric', ok: true, why: 'Yes, for example Nomex. Now say what it does in a flame.' },
        { t: 'A conductive fabric', mis: 'tech-textile-mixup', why: 'A conductive fabric lets electricity flow through it. That does not protect from fire.' },
        { t: 'A micro-encapsulated fabric', mis: 'tech-textile-mixup', why: 'A micro-encapsulated fabric slowly releases a substance such as a scent. That does not protect from fire.' },
      ] },
      { label: 'Racing overalls: behaviour in a flame', q: 'What does this fabric do <b>in a flame</b>?', options: [
        { t: 'It does not melt or drip, and it self-extinguishes', ok: true, why: 'Yes: it does not catch fire easily, does not melt or drip, and puts itself out.' },
        { t: 'It melts and drips away, which carries off the heat', mis: 'tech-textile-mixup', why: 'Melting, dripping fabric would burn the driver. This fabric does not melt or drip.' },
        { t: 'It catches fire easily, but burns out very quickly', mis: 'tech-textile-mixup', why: 'It does not catch fire easily, and if it does it self-extinguishes.' },
      ] });

    file(6, 'bumper', 'car bumper beam', ['Hidden behind the', 'bumper. Very light. Full', 'of tiny gas bubbles.'], bumper,
      { label: 'Bumper beam: which material', options: [
        { t: 'Aluminium metal foam', ok: true, why: 'Yes. Now say why that is good in a crash.' },
        { t: 'Sheets of graphene', mis: 'modern-mixup', why: 'Graphene is a layer of carbon one atom thick. It is not a block full of bubbles.' },
        { t: 'Solid titanium alloy', mis: 'modern-mixup', why: 'Titanium is a solid metal with no bubbles in it, and it is expensive.' },
      ] },
      { label: 'Bumper beam: why it is good in a crash', q: '<b>Why</b> is that good in a crash?', options: [
        { t: 'It crumples, which absorbs the impact energy', ok: true, why: 'Yes: the foam crumples and absorbs the energy of the impact.' },
        { t: 'It stays rigid, which passes on the impact energy', mis: 'metal-foam', why: 'Passing the energy on would hurt the passengers. This material crumples instead.' },
        { t: 'It springs back, which returns the impact energy', mis: 'metal-foam', why: 'It does not bounce the car back. It crumples and stays crumpled, absorbing the energy.' },
      ] });

    file(7, 'blade', 'running blade', ['Woven black cloth set', 'in resin. Very light,', 'very stiff, very costly.'], blade,
      { label: 'Running blade: which material', options: [
        { t: 'Carbon fibre reinforced plastic (CFRP)', ok: true, why: 'Yes: extremely strong and stiff for its weight, but expensive. Now think about its two parts.' },
        { t: 'Glass reinforced plastic (GRP)', mis: 'gfrp-cfrp', why: 'GRP is the cheaper composite, and its fibres are glass. Read the clues again.' },
        { t: 'Titanium (a modern material)', mis: 'group-mixup', why: 'Titanium is light, strong and expensive, but it is a metal. Cloth set in resin is a composite.' },
      ] },
      { label: 'Running blade: what the matrix is and does', q: 'Which part is the <b>matrix</b>, and what does it do?', options: [
        { t: 'The resin: it binds the fibres and holds the shape', ok: true, why: 'Yes: the resin is the matrix. The fibres are the reinforcement, which gives the strength.' },
        { t: 'The fibres: they bind the resin and hold the shape', mis: 'matrix-reinforcement', why: 'The fibres are the reinforcement: they give strength. The matrix is the part that binds them.' },
        { t: 'The resin: it gives the blade most of its strength', mis: 'matrix-reinforcement', why: 'The resin is the matrix, but strength is the job of the reinforcement. The matrix binds and holds the shape.' },
      ] });

    file(8, 'screen', 'roll-up touch screen', ['Still being developed.', 'Bends, is almost clear,', 'and carries electricity.'], screen,
      { label: 'Roll-up screen: which material', options: [
        { t: 'Graphene', ok: true, why: 'Yes: flexible, almost transparent and an excellent conductor. Now say what it is.' },
        { t: 'Titanium', mis: 'modern-mixup', why: 'Titanium is a strong, light metal. It is not transparent.' },
        { t: 'Metal foam', mis: 'modern-mixup', why: 'Metal foam is a metal full of gas bubbles. It is not transparent or flexible.' },
      ] },
      { label: 'Roll-up screen: what the material is', q: 'What is this material <b>made of</b>?', options: [
        { t: 'A single layer of carbon atoms, one atom thick', ok: true, why: 'Yes: one layer of carbon atoms in a hexagonal (honeycomb) lattice.' },
        { t: 'A thin sheet of metal with gas bubbles in it', mis: 'graphene-structure', why: 'That describes a metal foam. This material is not a metal.' },
        { t: 'A thick stack of clear, bendy plastic layers', mis: 'graphene-structure', why: 'It is not a plastic, and it is not thick: it is as thin as a material can be.' },
      ] });

    // ---- case closed: an exam-style written explanation ----
    ui.el('h2', '', 'Case closed: write it up');
    ui.p('A good detective explains the evidence. Use the words <b>heat</b> (or warmth) and <b>shape</b>.');
    const w = ui.write({ id: 'p09.explain', label: 'Explain how a shape memory alloy is used in dental braces [2]', marks: 2, lines: 4,
      q: '<b>Explain</b> how a <b>shape memory alloy</b> is used in dental braces.',
      scheme: ['The SMA (nitinol) wire is bent / deformed when cool to fit the crooked teeth', 'The warmth of the mouth heats the wire, so it tries to return to its original ("remembered") shape, which pulls the teeth into line'],
      model: 'The brace wire is made from a shape memory alloy such as <b>nitinol</b>. It is bent to fit the crooked teeth. The <b>warmth of the mouth</b> heats the wire, so it tries to return to its original <b>"remembered" shape</b>, and this gently pulls the teeth into line.' });
    // recall, not copy: case 2's feedback is blurred while this is being written, until it has been checked
    const checked = () => { const it = Book.state.items['p09.explain']; return !!(it && it.ticks); };
    w.querySelector('textarea').addEventListener('focus', () => { if (!checked()) cols.frame.classList.add('peek-lock'); });
    w.addEventListener('click', () => setTimeout(() => { if (checked()) cols.frame.classList.remove('peek-lock'); }, 50));
  },
});
