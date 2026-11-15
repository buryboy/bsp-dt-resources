// Page 9 — Choose the material: a design agency answers client briefs (material + justifying property).
Book.page({
  id: 'p09',
  title: 'Choose the material',
  build(ui, root) {
    const BLUE = Ink.BLUE, RED = Ink.RED;
    ui.h('Choose the material');
    ui.p('You work at a <b>design agency</b>. Clients have stuck their briefs on your desk. For each one, pick the <b>material</b>, then the <b>property</b> that justifies it. That reason is what earns marks in the exam!');

    // ---- a pen-drawn sticky note that draws itself when it scrolls into view ----
    const SW = 300, SH = 330;
    const stickyNote = (n, title, lines, product) => {
      const api = ui.anim({
        w: SW, h: SH, duration: 2.6, poster: 0.001,
        draw(k, t) {
          const c = k.ctx, rot = (n % 2 ? -1 : 1) * 0.025;
          const P = [[18, 20], [SW - 16, 16], [SW - 12, SH - 18], [22, SH - 14], [18, 20]].map(([x, y]) => [x + Math.sin(rot) * (y - SH / 2), y - Math.sin(rot) * (x - SW / 2)]);
          k.shadow(P, 0, 0.3);
          c.save(); c.fillStyle = 'rgba(255,236,120,0.42)'; c.beginPath(); P.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y))); c.fill();
          c.fillStyle = 'rgba(240,210,90,0.28)'; c.beginPath(); c.moveTo(P[0][0], P[0][1]); c.lineTo(P[1][0], P[1][1]); c.lineTo(P[1][0], P[1][1] + 34); c.lineTo(P[0][0], P[0][1] + 34); c.fill(); c.restore();
          k.line(P, 0, 0.45, { w: 2.4, seed: 7 + n });
          k.text('BRIEF #' + n, 34, 58, 0.3, 0.6, { size: 22, color: RED });
          k.text(title, 152, 58, 0.4, 0.8, { size: 22 });
          product(k, 0.6, 1.8);
          lines.forEach((s, i) => k.text(s, SW / 2, 236 + i * 29, 1.7 + i * 0.25, 1.95 + i * 0.25, { size: 22, align: 'center' }));
        },
        sound(k) { k.play('stroke', 0, { material: 'pen', dur: 0.5, gain: 0.3 }); k.play('stroke', 0.6, { material: 'pen', dur: 1.1, gain: 0.3 }); k.play('stroke', 1.7, { material: 'pen', dur: 0.8, gain: 0.25 }); },
      });
      const wrap = root.lastElementChild; wrap.classList.add('p09-sticky');
      wrap.querySelector('.ink-play').style.display = 'none';
      if (window.IntersectionObserver) new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting && api.t < api.duration - 0.01) api.play(); }), { threshold: 0.35 }).observe(wrap);
      else api.seek(api.duration);
      return wrap;
    };

    // ---- product drawings (all in the box x 30..270, y 80..200) ----
    const pan = (hl) => (k, a, b) => {
      const m = (u) => a + (b - a) * u;
      const body = [[60, 110], [64, 178], [70, 188], [176, 188], [182, 178], [186, 110]];
      k.line(body, m(0), m(0.35), { w: 3 });
      k.line(k.ellipse(123, 110, 63, 9, 0, Math.PI * 2 + 0.2), m(0.3), m(0.5), { w: 2.2 });
      const H = [[186, 118], [262, 106], [266, 116], [188, 130]];
      k.line(H.concat([[186, 118]]), m(0.5), m(0.7), { w: 2.8 });
      if (hl === 'body') k.hatch(body.concat([[60, 110]]), m(0.6), m(0.9), { density: 0.9 });
      if (hl === 'handle') { k.hatch(H, m(0.6), m(0.85), { density: 1.2 }); k.line(k.ellipse(225, 118, 54, 26), m(0.8), m(1), { color: RED, w: 2.2 }); }
      if (hl === 'body') [[90, 0], [123, 1], [156, 2]].forEach(([x, i]) => k.line([[x - 8, 210], [x - 2, 196], [x + 2, 204], [x + 8, 194]], m(0.75 + i * 0.07), m(0.85 + i * 0.07), { color: RED, w: 2.2 }));
      else [[100, 0], [140, 1]].forEach(([x, i]) => k.line(k.curve([x, 100], [x - 10, 90], [x + 10, 80], [x, 70]), m(0.8 + i * 0.1), m(0.95 + i * 0.05), { w: 1.8 }));
    };
    const cable = (hl) => (k, a, b) => {
      const m = (u) => a + (b - a) * u;
      // sheath (insulation) on the left, stripped copper strands sticking out on the right, cross-section at the left end
      k.line([[70, 120], [200, 120]], m(0), m(0.2), { w: 3 }); k.line([[70, 168], [200, 168]], m(0.05), m(0.25), { w: 3 });
      k.line(k.ellipse(70, 144, 12, 24), m(0.2), m(0.35), { w: 2.6 });
      k.line(k.ellipse(70, 144, 6, 11), m(0.3), m(0.4), { w: 2 });
      k.line([[200, 120], [200, 168]], m(0.35), m(0.45), { w: 2.6 });
      [-8, -3, 2, 7].forEach((o, i) => k.line([[200, 144 + o], [236, 140 + o * 1.6], [262, 136 + o * 2.4]], m(0.45 + i * 0.05), m(0.6 + i * 0.05), { w: 1.8, color: hl === 'core' ? RED : BLUE }));
      if (hl === 'insul') k.hatch([[76, 120], [200, 120], [200, 168], [76, 168]], m(0.65), m(0.95), { density: 0.9 });
      k.text(hl === 'core' ? 'core' : 'insulation', hl === 'core' ? 236 : 136, hl === 'core' ? 186 : 108, m(0.85), m(1), { size: 22, color: RED, align: 'center' });
    };
    const drill = (k, a, b) => {
      const m = (u) => a + (b - a) * u;
      k.line([[40, 132], [130, 132], [130, 160], [40, 160], [40, 132]], m(0), m(0.25), { w: 2.8 }); // round shank
      k.line([[130, 130], [232, 130], [262, 146], [232, 162], [130, 162]], m(0.25), m(0.5), { w: 2.8 }); // fluted body + 118° point
      for (let i = 0; i < 6; i++) k.line(k.curve([140 + i * 17, 162], [146 + i * 17, 150], [150 + i * 17, 142], [156 + i * 17, 130]), m(0.5 + i * 0.05), m(0.6 + i * 0.05), { w: 2 });
      k.hatch([[40, 148], [130, 148], [130, 160], [40, 160]], m(0.8), m(1), { density: 1.1 });
      k.text('cutting edges', 180, 198, m(0.85), m(1), { size: 22, color: RED, align: 'center' });
      k.arrow([[214, 178], [236, 156]], m(0.85), m(1), { color: RED, w: 1.8, head: 10 });
    };
    const car = (k, a, b) => {
      const m = (u) => a + (b - a) * u;
      const out = [[34, 170], [36, 140], [70, 132], [104, 104], [190, 104], [226, 132], [262, 138], [266, 170], [34, 170]];
      k.line(out, m(0), m(0.4), { w: 2.8 });
      k.circle(84, 172, 18, m(0.4), m(0.55), { w: 2.8 }); k.circle(216, 172, 18, m(0.45), m(0.6), { w: 2.8 });
      const door = [[110, 136], [182, 136], [182, 166], [110, 166], [110, 136]];
      k.line(door, m(0.55), m(0.7), { w: 2.2 });
      k.line([[112, 108], [146, 108], [146, 132], [80, 132], [112, 108]], m(0.6), m(0.75), { w: 2 });
      k.hatch(door, m(0.75), m(1), { density: 1 });
    };
    const bungee = (k, a, b) => {
      const m = (u) => a + (b - a) * u, pts = [];
      for (let i = 0; i <= 40; i++) pts.push([70 + i * 4, 150 + Math.sin(i * 0.9) * 3]);
      k.line(pts, m(0), m(0.4), { w: 4 });
      k.line([[70, 150], [50, 150], [42, 160], [48, 170], [58, 166]], m(0.4), m(0.55), { w: 2.6 });
      k.line([[230, 150], [250, 150], [258, 160], [252, 170], [242, 166]], m(0.45), m(0.6), { w: 2.6 });
      k.arrow([[120, 186], [60, 186]], m(0.65), m(0.8), { color: RED, w: 2.2 }); k.arrow([[180, 186], [240, 186]], m(0.65), m(0.8), { color: RED, w: 2.2 });
      k.text('stretch', 150, 124, m(0.8), m(1), { size: 22, color: RED, align: 'center' });
    };
    const kayak = (k, a, b) => {
      const m = (u) => a + (b - a) * u;
      k.ctx.save(); k.ctx.translate(0, -14);
      const hull = k.curve([30, 150], [90, 186], [210, 186], [270, 146]).concat(k.curve([270, 146], [210, 136], [90, 136], [30, 150]));
      k.line(hull, m(0), m(0.35), { w: 2.8 });
      k.line(k.ellipse(150, 140, 30, 6), m(0.35), m(0.45), { w: 2 });
      k.line([[120, 100], [184, 176]], m(0.45), m(0.55), { w: 2.4 });
      k.line(k.ellipse(117, 96, 6, 12, 0, 7), m(0.5), m(0.58), { w: 2 });
      k.line(k.ellipse(187, 180, 6, 12, 0, 7), m(0.52), m(0.6), { w: 2 });
      const wave = []; for (let i = 0; i <= 60; i++) wave.push([20 + i * 4.3, 168 + Math.sin(i * 0.7) * 3]);
      k.line(wave, m(0.6), m(0.8), { w: 1.8 });
      k.line([[210, 200], [222, 186], [242, 184], [256, 200]], m(0.8), m(0.92), { w: 2.4 });
      k.hatch([[210, 200], [222, 186], [242, 184], [256, 200]], m(0.88), m(1), { density: 1.3 });
      k.text('rocks!', 196, 204, m(0.9), m(1), { size: 22, color: RED, align: 'right' });
      k.ctx.restore();
    };

    // ---- one brief = sticky note + two questions side by side ----
    const brief = (n, key, title, lines, product, material, property) => {
      const row = ui.el('div', 'row p09-brief');
      row.appendChild(stickyNote(n, title, lines, product));
      const col = ui.el('div', 'p09-qs', '', row);
      col.appendChild(ui.mcq(Object.assign({ id: `p09.${key}-material`, q: '<b>Material:</b> which would you choose?' }, material)));
      col.appendChild(ui.mcq(Object.assign({ id: `p09.${key}-property`, q: '<b>Justify it:</b> which property makes it right?' }, property)));
    };
    const css = document.createElement('style');
    css.textContent = `.p09-brief{gap:16px;margin-bottom:var(--R)}.p09-brief>.p09-sticky{flex:0 0 250px;margin:0;position:sticky;top:8px}.p09-brief>.p09-qs{flex:1 1 330px;min-width:0}.p09-qs .act{margin-bottom:calc(var(--R)*.8)}
      .p09-qs .opts{grid-template-columns:repeat(auto-fit,minmax(200px,1fr))}
      @media (max-width:760px){.p09-brief>.p09-sticky{flex:0 0 100%;max-width:280px;position:static}}`;
    root.appendChild(css);

    brief(1, 'pan', 'saucepan', ['"The pan must heat', 'the soup quickly', 'on the hob."'], pan('body'),
      { label: 'Saucepan body: material', options: [
        { t: 'Aluminium', ok: true, why: 'Good choice: aluminium (or stainless steel) is used for pan bodies. Now justify it.' },
        { t: 'Polypropylene', why: 'Polypropylene is a thermal insulator and melts at about 160 °C: it would melt on the hob.' },
        { t: 'Oak', why: 'Wood is a thermal insulator (slow to heat) and it burns.' },
      ] },
      { label: 'Saucepan body: justifying property', options: [
        { t: 'High thermal conductivity', ok: true, why: 'Heat travels through it quickly, so the food heats up fast. Its high melting point helps too.' },
        { t: 'High electrical conductivity', mis: 'heat-vs-electricity', why: 'That is about electricity flowing. Cooking needs HEAT to travel: thermal conductivity.' },
        { t: 'High density, so it holds the heat', mis: 'density-vs-weight', why: 'Density is mass per unit volume. It does not decide how quickly heat travels through the pan.' },
      ] });

    brief(2, 'handle', 'pan handle', ['"Customers must be able', 'to hold the handle', 'while it cooks."'], pan('handle'),
      { label: 'Saucepan handle: material', options: [
        { t: 'Phenol formaldehyde (a thermosetting polymer)', ok: true, why: 'Good choice: phenol formaldehyde, a thermoset (wood also works). Now justify it.' },
        { t: 'Polypropylene (a thermoforming polymer)', mis: 'fusibility-thermoset', why: 'Polypropylene is fusible: it melts at about 160 °C, so it could soften right next to the hot pan.' },
        { t: 'Aluminium', why: 'Aluminium is a good thermal conductor: the handle would get hot.' },
      ] },
      { label: 'Saucepan handle: justifying property', options: [
        { t: 'Low thermal conductivity, and a thermoset does not soften when hot', ok: true, why: 'It is a thermal insulator, so the handle stays cool, and a thermoset does not melt (it chars).' },
        { t: 'It is an electrical insulator', mis: 'heat-vs-electricity', why: 'True, but the hob problem is HEAT. The key property is low thermal conductivity.' },
        { t: 'High fusibility, so it melts and seals onto the pan', mis: 'fusibility-thermoset', why: 'Thermosets are not fusible: they char instead of melting. That is exactly why they suit hot handles.' },
      ] });

    brief(3, 'core', 'cable', ['"Carry electricity to', 'a lamp along a thin,', 'bendy wire."'], cable('core'),
      { label: 'Cable core: material', options: [
        { t: 'Copper', ok: true, why: 'Good choice: copper is used for wires. Now justify it.' },
        { t: 'PVC', mis: 'conductor-insulator', why: 'PVC is an electrical insulator: electricity cannot flow through it. It goes on the OUTSIDE.' },
        { t: 'Glass', mis: 'conductor-insulator', why: 'Glass is an electrical insulator, and brittle too.' },
      ] },
      { label: 'Cable core: justifying property', options: [
        { t: 'High electrical conductivity, and ductile (can be drawn into wire)', ok: true, why: 'Electricity flows through it easily, and it can be drawn out into thin wire.' },
        { t: 'Malleable, so it can be drawn into wire', mis: 'malleable-vs-ductile', why: 'Drawing into wire is DUCTILITY (pulling, tension). Malleable is squashing/hammering (compression).' },
        { t: 'High thermal conductivity, so electricity flows', mis: 'heat-vs-electricity', why: 'Thermal conductivity is about heat. Electricity flowing is ELECTRICAL conductivity.' },
        { t: 'High density, so it carries more electricity', mis: 'density-vs-weight', why: 'Density is mass for its size: it does not decide how well electricity flows.' },
      ] });

    brief(4, 'insul', 'cable', ['"Cover the wire so', 'nobody gets a shock,', 'and let it bend."'], cable('insul'),
      { label: 'Cable insulation: material', options: [
        { t: 'PVC', ok: true, why: 'Good choice: PVC is the usual cable insulation. Now justify it.' },
        { t: 'Aluminium', mis: 'conductor-insulator', why: 'Aluminium is a metal: all metals conduct electricity, so it would not protect you.' },
        { t: 'Glass', why: 'Glass is an electrical insulator, but it is brittle and cannot bend with the cable.' },
      ] },
      { label: 'Cable insulation: justifying property', options: [
        { t: 'Electrical insulator, and flexible', ok: true, why: 'Electricity cannot flow through it, so you do not get a shock, and it bends with the wire.' },
        { t: 'Good electrical conductor, so the current flows safely', mis: 'conductor-insulator', why: 'The outside must be an INSULATOR. A conductor on the outside would give you a shock.' },
        { t: 'Low thermal conductivity, which stops the electricity', mis: 'heat-vs-electricity', why: 'Thermal conductivity is about heat. Stopping electricity needs an ELECTRICAL insulator.' },
      ] });

    brief(5, 'drill', 'drill bit', ['"Drill holes in steel', 'and stay sharp for', 'a long time."'], drill,
      { label: 'Drill bit: material', options: [
        { t: 'High-speed steel', ok: true, why: 'Good choice: high-speed steel (HSS) is used for drill bits. Now justify it.' },
        { t: 'Lead', why: 'Lead is very soft (low hardness): it would be blunt straight away.' },
        { t: 'Acrylic', why: 'Acrylic is brittle and much softer than steel: it would snap or wear away.' },
      ] },
      { label: 'Drill bit: justifying property', options: [
        { t: 'Hardness: resists wear, so it stays sharp', ok: true, why: 'Hardness is resisting scratching, wear and indentation, so the cutting edges stay sharp.' },
        { t: 'Toughness', mis: 'hard-vs-tough', why: 'Toughness is absorbing an impact without breaking. Staying sharp (resisting wear) is HARDNESS.' },
        { t: 'Strength', mis: 'strong-vs-hard', why: 'Strength is withstanding a force without breaking. Resisting wear is HARDNESS.' },
      ] });

    brief(6, 'panel', 'car door', ['"Press a flat sheet', 'into a curved door', 'with no cracks."'], car,
      { label: 'Car body panel: material', options: [
        { t: 'Low-carbon (mild) steel', ok: true, why: 'Good choice: low-carbon steel (or aluminium) sheet is used for car panels. Now justify it.' },
        { t: 'Cast iron', why: 'Cast iron is not malleable: it would crack when pressed.' },
        { t: 'Glass', why: 'Glass is not malleable and is brittle: it would crack.' },
      ] },
      { label: 'Car body panel: justifying property', options: [
        { t: 'Malleable: can be pressed into shape without cracking', ok: true, why: 'Pressing is compression, and malleable materials take the new shape without cracking. Steel is also tough.' },
        { t: 'Ductile', mis: 'malleable-vs-ductile', why: 'Ductile is stretching into wire (tension). Pressing a sheet is compression: MALLEABLE.' },
        { t: 'Elastic', mis: 'elastic-vs-stretchy', why: 'An elastic material springs back to its original shape: the door would go flat again!' },
      ] });

    brief(7, 'bungee', 'bungee cord', ['"Stretch round the', 'luggage, then spring', 'back every time."'], bungee,
      { label: 'Bungee cord: material', options: [
        { t: 'Rubber', ok: true, why: 'Good choice: rubber is used for bungee cords and bike tyres. Now justify it.' },
        { t: 'Lead', mis: 'elastic-vs-stretchy', why: 'Lead bends easily but stays bent: it does not spring back.' },
        { t: 'Copper wire', mis: 'elastic-vs-stretchy', why: 'Copper can be drawn into wire (ductile), but stretched copper stays stretched.' },
      ] },
      { label: 'Bungee cord: justifying property', options: [
        { t: 'Elasticity: returns to its original shape', ok: true, why: 'Elastic means it returns to its original shape when the force is removed.' },
        { t: 'It stretches a long way', mis: 'elastic-vs-stretchy', why: 'Stretching is not enough: plasticine stretches but stays stretched. Elastic means it RETURNS to shape.' },
        { t: 'Ductility', mis: 'elastic-vs-stretchy', why: 'Ductile means it can be drawn into wire and stays that way. Springing back is ELASTICITY.' },
      ] });

    // ---- final brief: the kayak, as an exam-style written answer ----
    const row = ui.el('div', 'row p09-brief');
    row.appendChild(stickyNote(8, 'kayak', ['"It will bump into', 'rocks on the river', 'and must float."'], kayak));
    const col = ui.el('div', 'p09-qs', '', row);
    col.appendChild(ui.html('<p style="margin:0 0 12px">The team picked <b>HDPE</b> (high-density polyethylene, density <b>0.95 g/cm³</b>). Write the justification for the client, like an exam answer: give a <b>property</b> and say <b>why</b> it matters.</p>'));
    col.appendChild(ui.write({ id: 'p09.kayak', label: 'Explain why HDPE suits a kayak [2]', marks: 2, lines: 4,
      q: 'Explain why HDPE is a good material for a kayak.',
      scheme: ['It is <b>tough</b>, so it can absorb impacts (e.g. hitting rocks) without cracking or breaking', 'It has a <b>low density</b> (0.95 g/cm³, less than water) so it floats / is light to carry', '(Also accept) it is waterproof / does not absorb water'],
      model: 'HDPE is <b>tough</b>, so it absorbs the impact when the kayak hits rocks without cracking. It also has a <b>low density</b> (less than water), so the kayak floats and is light to carry.' }));
  },
});
