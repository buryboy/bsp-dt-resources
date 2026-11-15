// Page 9 — System detective: eight everyday products "opened up" on case-file cards.
// For each: which INPUT device is inside, and what does the PROCESS do / which OUTPUT suits it? Ends with a 2-mark explanation.
Book.page({
  id: 'p09',
  title: 'System detective',
  build(ui, root) {
    const RED = Ink.RED;
    ui.h('System detective');
    ui.p('<b>What\'s inside?</b> Eight products are on your desk, but you cannot open them. For each case file, look at the drawing and read the clues, then work out the <b>input device</b> hidden inside and what the rest of the system does.');
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

    // ---- product drawings (all inside x 26..274, y 88..236). The hidden parts are never labelled. ----
    const mk = (a, b) => (u) => a + (b - a) * u;
    const streetLight = (k, a, b) => {
      const m = mk(a, b);
      k.line([[24, 231], [276, 230]], m(0), m(0.08), { w: 1.6 });
      k.line(k.rect(74, 214, 26, 16, 3), m(0.06), m(0.16), { w: 2.4 });
      k.line([[83, 214], [83, 130]].concat(k.curve([83, 130], [84, 100], [108, 96], [146, 98])), m(0.14), m(0.36), { w: 2.8 });
      k.line([[91, 214], [91, 132]].concat(k.curve([91, 132], [92, 108], [112, 104], [142, 104])), m(0.3), m(0.48), { w: 2.2 });
      const hd = [[142, 92], [208, 92], [216, 106], [136, 106], [142, 92]];
      k.line(hd, m(0.46), m(0.6), { w: 2.8 });
      k.hatch(hd, m(0.58), m(0.68), { density: 1.2 });
      k.line(k.ellipse(176, 92, 8, 7, Math.PI, Math.PI * 2), m(0.62), m(0.68), { w: 2.2 });
      [[146, 124, 190], [164, 150, 198], [188, 190, 198], [206, 232, 190]].forEach(([x0, x1, y1], i) => k.line([[x0, 112], [x1, y1]], m(0.7 + i * 0.04), m(0.76 + i * 0.04), { w: 1.6, color: RED }));
      k.line(k.ellipse(48, 112, 14, 14, 0.6, 5.0), m(0.86), m(0.93), { w: 2.2 });
      k.line(k.curve([59.5, 120], [46, 116], [44, 104], [52, 98.6]), m(0.92), m(0.97), { w: 2 });
      [[244, 110], [258, 140], [34, 160]].forEach(([x, y], i) => { k.line([[x - 5, y], [x + 5, y]], m(0.95), m(0.98), { w: 1.6 }); k.line([[x, y - 5], [x, y + 5]], m(0.97), m(1), { w: 1.6 }); });
    };
    const scales = (k, a, b) => {
      const m = mk(a, b);
      k.line(k.rect(50, 188, 200, 42, 10), m(0), m(0.2), { w: 2.8 });
      k.line(k.rect(106, 197, 88, 26, 4), m(0.18), m(0.3), { w: 2.2 });
      k.text('250 g', 150, 218, m(0.3), m(0.42), { size: 22, align: 'center' });
      const plate = k.rect(66, 174, 168, 12, 4);
      k.line(plate, m(0.42), m(0.54), { w: 2.6 });
      k.hatch(plate, m(0.52), m(0.6), { density: 1.3 });
      k.line([[88, 132], [212, 132]], m(0.6), m(0.66), { w: 2.4 });
      k.line([[92, 132], [106, 172], [194, 172], [208, 132]], m(0.64), m(0.78), { w: 2.6 });
      const flour = k.curve([104, 132], [126, 96], [174, 98], [196, 132]);
      k.line(flour, m(0.78), m(0.9), { w: 2.2 });
      [[130, 122], [150, 112], [168, 124], [142, 126], [160, 116]].forEach(([x, y]) => k.dot(x, y, 1.8, m(0.92)));
      k.circle(222, 210, 7, m(0.92), m(1), { w: 2 });
    };
    const windowAlarm = (k, a, b) => {
      const m = mk(a, b);
      k.line(k.rect(36, 96, 136, 136, 4), m(0), m(0.18), { w: 2.8 });
      k.line(k.rect(48, 108, 108, 112, 2), m(0.16), m(0.32), { w: 2.2 });
      k.line([[102, 108], [102, 220]], m(0.3), m(0.36), { w: 1.8 }); k.line([[48, 164], [156, 164]], m(0.34), m(0.4), { w: 1.8 });
      [[60, 140, 78, 120], [114, 196, 132, 176], [66, 206, 78, 192]].forEach(([x0, y0, x1, y1], i) => k.line([[x0, y0], [x1, y1]], m(0.4 + i * 0.02), m(0.43 + i * 0.02), { w: 1.4 }));
      const mag = k.rect(140, 124, 13, 24, 2), part = k.rect(157, 124, 13, 24, 2);
      k.line(mag, m(0.48), m(0.56), { w: 2.2 }); k.hatch(mag, m(0.54), m(0.6), { density: 1.5 });
      k.line(part, m(0.58), m(0.66), { w: 2.2 });
      k.line(k.curve([170, 136], [194, 136], [192, 160], [216, 160]), m(0.66), m(0.74), { w: 1.8 });
      k.line(k.rect(216, 136, 50, 50, 6), m(0.74), m(0.86), { w: 2.6 });
      k.circle(241, 161, 14, m(0.84), m(0.9), { w: 2 }); k.dot(241, 161, 3, m(0.9));
      [16, 26].forEach((r, i) => k.line(k.ellipse(241, 134, r, r, -2.45, -0.7), m(0.9 + i * 0.05), m(0.95 + i * 0.05), { w: 2.2, color: RED }));
    };
    const thermostat = (k, a, b) => {
      const m = mk(a, b);
      k.line(k.rect(30, 100, 116, 122, 12), m(0), m(0.18), { w: 2.8 });
      k.text('20 °C', 88, 132, m(0.18), m(0.3), { size: 22, align: 'center' });
      k.circle(88, 176, 30, m(0.3), m(0.42), { w: 2.6 });
      for (let i = 0; i < 7; i++) { const an = Math.PI * (1.0 + i / 6); k.line([[88 + Math.cos(an) * 34, 176 + Math.sin(an) * 34], [88 + Math.cos(an) * 40, 176 + Math.sin(an) * 40]], m(0.42 + i * 0.01), m(0.44 + i * 0.01), { w: 1.6 }); }
      k.line([[88, 176], [104, 156]], m(0.5), m(0.54), { w: 3 }); k.dot(88, 176, 3.4, m(0.54));
      for (let i = 0; i < 5; i++) k.line(k.rect(176 + i * 18, 136, 14, 82, 6), m(0.56 + i * 0.05), m(0.63 + i * 0.05), { w: 2.4 });
      k.line([[180, 218], [180, 232]], m(0.82), m(0.85), { w: 2.2 }); k.line([[258, 218], [258, 232]], m(0.84), m(0.87), { w: 2.2 });
      [192, 221, 250].forEach((x, i) => k.line(k.curve([x, 128], [x - 10, 118], [x + 10, 108], [x, 96]), m(0.88 + i * 0.03), m(0.94 + i * 0.03), { w: 2, color: RED }));
    };
    const shopDoor = (k, a, b) => {
      const m = mk(a, b);
      k.line([[24, 235], [276, 234]], m(0), m(0.08), { w: 1.6 });
      k.line([[56, 234], [56, 94], [164, 94], [164, 234]], m(0.06), m(0.24), { w: 3 });
      const door = [[62, 100], [128, 116], [128, 222], [62, 233], [62, 100]];
      k.line(door, m(0.24), m(0.42), { w: 2.6 });
      k.line([[72, 118], [118, 128], [118, 166], [72, 162], [72, 118]], m(0.4), m(0.5), { w: 1.8 });
      k.line([[118, 178], [118, 196]], m(0.5), m(0.53), { w: 4 });
      k.line(k.rect(138, 98, 22, 15, 2), m(0.54), m(0.62), { w: 2.2 });
      k.line([[144, 113], [127, 121]], m(0.62), m(0.66), { w: 2.2 }); k.dot(127, 121, 3, m(0.66));
      k.line(k.curve([160, 104], [178, 96], [178, 124], [196, 124]), m(0.66), m(0.72), { w: 1.8 });
      k.line(k.rect(196, 102, 72, 44, 6), m(0.72), m(0.82), { w: 2.6 });
      k.text('0147', 232, 133, m(0.82), m(0.9), { size: 22, align: 'center' });
      k.circle(226, 176, 9, m(0.9), m(0.94), { w: 2.2 });
      k.line([[226, 185], [226, 210], [216, 233]], m(0.93), m(0.97), { w: 2.2 }); k.line([[226, 210], [238, 233]], m(0.96), m(0.99), { w: 2.2 });
      k.line([[212, 202], [226, 192], [240, 200]], m(0.97), m(1), { w: 2.2 });
    };
    const toothbrush = (k, a, b) => {
      const m = mk(a, b);
      const handle = k.rect(30, 148, 156, 42, 20);
      k.line(handle, m(0), m(0.25), { w: 2.8 });
      for (let i = 0; i < 4; i++) k.line([[122 + i * 12, 156], [122 + i * 12, 182]], m(0.24 + i * 0.02), m(0.27 + i * 0.02), { w: 1.6 });
      k.circle(78, 169, 11, m(0.34), m(0.42), { w: 2.6 }); k.circle(78, 169, 4, m(0.42), m(0.46), { w: 1.8 });
      k.line([[186, 160], [236, 164], [236, 176], [186, 180]], m(0.46), m(0.58), { w: 2.4 });
      const head = k.rect(234, 158, 36, 22, 8);
      k.line(head, m(0.58), m(0.68), { w: 2.6 });
      for (let i = 0; i < 8; i++) k.line([[239 + i * 4, 157], [239 + i * 4, 138]], m(0.68 + i * 0.02), m(0.71 + i * 0.02), { w: 1.8 });
      k.hatch(head, m(0.82), m(0.88), { density: 1.2 });
      [[12, 6], [22, 11]].forEach(([rx, ry], i) => k.line(k.ellipse(253, 132, rx, ry, Math.PI * 1.12, Math.PI * 1.88), m(0.88 + i * 0.05), m(0.94 + i * 0.05), { w: 2, color: RED }));
      k.line(k.curve([30, 200], [80, 214], [140, 214], [186, 200]), m(0.94), m(1), { w: 1.4 });
    };
    const fridge = (k, a, b) => {
      const m = mk(a, b);
      k.line([[24, 235], [276, 234]], m(0), m(0.06), { w: 1.6 });
      k.line(k.rect(96, 100, 100, 133, 6), m(0.05), m(0.25), { w: 2.8 });
      [128, 162, 196].forEach((y, i) => k.line([[102, y], [190, y]], m(0.25 + i * 0.03), m(0.29 + i * 0.03), { w: 1.6 }));
      k.line(k.rect(112, 136, 12, 26, 3), m(0.36), m(0.42), { w: 1.8 }); k.line(k.rect(150, 176, 28, 20, 3), m(0.4), m(0.46), { w: 1.8 });
      k.circle(140, 119, 8, m(0.44), m(0.49), { w: 1.8 });
      const door = [[196, 102], [256, 116], [256, 222], [196, 233], [196, 102]];
      k.line(door, m(0.5), m(0.68), { w: 2.8 });
      k.line([[203, 150], [249, 158]], m(0.68), m(0.71), { w: 1.6 }); k.line([[203, 196], [249, 198]], m(0.7), m(0.73), { w: 1.6 });
      k.line([[249, 134], [249, 176]], m(0.73), m(0.77), { w: 4 });
      k.line(k.rect(184, 105, 9, 12, 2), m(0.78), m(0.84), { w: 2 }); k.dot(195, 111, 2.6, m(0.84));
      k.text('beep!', 28, 126, m(0.86), m(0.96), { size: 22, color: RED, rot: -0.12 });
      k.line([[36, 136], [78, 130]], m(0.96), m(1), { w: 1.8, color: RED });
    };
    const vending = (k, a, b) => {
      const m = mk(a, b), th = 0.2, co = Math.cos(th), si = Math.sin(th);
      const T = (pts) => pts.map(([x, y]) => { const dx = x - 204, dy = y - 232; return [204 + dx * co - dy * si, 232 + dx * si + dy * co]; });
      k.line([[24, 233], [276, 232]], m(0), m(0.06), { w: 1.6 });
      const body = T(k.rect(104, 112, 100, 120, 6));
      k.line(body, m(0.06), m(0.3), { w: 2.8 });
      k.line(T(k.rect(112, 122, 60, 76, 3)), m(0.3), m(0.44), { w: 2.2 });
      [146, 172].forEach((y, i) => k.line(T([[112, y], [172, y]]), m(0.44 + i * 0.02), m(0.47 + i * 0.02), { w: 1.6 }));
      [[122, 138], [140, 138], [158, 138], [122, 164], [140, 164], [158, 164], [131, 188], [152, 188]].forEach(([x, y], i) => { const [p] = T([[x, y]]); k.circle(p[0], p[1], 5, m(0.48 + i * 0.015), m(0.5 + i * 0.015), { w: 1.6 }); });
      k.line(T(k.rect(180, 126, 16, 30, 2)), m(0.62), m(0.7), { w: 2 });
      k.line(T([[184, 164], [192, 164]]), m(0.7), m(0.72), { w: 3 });
      const flap = T(k.rect(114, 206, 56, 18, 3));
      k.line(flap, m(0.72), m(0.8), { w: 2.2 }); k.hatch(flap, m(0.78), m(0.84), { density: 1.3 });
      const rock = k.curve([62, 178], [60, 140], [78, 112], [108, 96]);
      k.arrow(rock, m(0.84), m(0.93), { color: RED, w: 2.2, head: 11 });
      k.line(k.head(rock.slice().reverse(), 11), m(0.92), m(0.95), { color: RED, w: 2.2 });
    };

    // ---- one case = card + two questions side by side ----
    const file = (n, key, title, clues, product, q1, q2) => {
      const row = ui.el('div', 'row p09-row');
      row.appendChild(caseFile(n, title, clues, product));
      const col = ui.el('div', 'p09-qs', '', row);
      col.appendChild(mcq(Object.assign({ id: `p09.${key}-input`, q: 'Which <b>input device</b> is hidden inside?' }, q1)));
      col.appendChild(mcq(q2));
    };
    const css = document.createElement('style');
    css.textContent = `.p09-row{gap:16px;margin-bottom:var(--R)}.p09-row>.p09-case{flex:0 0 250px;margin:0;position:sticky;top:8px}.p09-row>.p09-qs{flex:1 1 330px;min-width:0}.p09-qs .act{margin-bottom:calc(var(--R)*.8)}
      .p09-qs .opts{grid-template-columns:repeat(auto-fit,minmax(200px,1fr))}
      @media (max-width:760px){.p09-row>.p09-case{flex:0 0 100%;max-width:280px;position:static}}`;
    root.appendChild(css);

    file(1, 'street', 'street light', ['Nobody switches it on.', 'It lights up at dusk', 'and goes off at dawn.'], streetLight,
      { label: 'Street light: input device', options: [
        { t: 'An LDR', ok: true, why: 'Yes: an LDR is a light sensor, so it can tell day from night. Now decide what the process block does.' },
        { t: 'A thermistor', mis: 'sensor-mixup', why: 'A thermistor senses temperature. A cold afternoon is not the same as night: this product must sense light.' },
        { t: 'A tilt switch', mis: 'switch-type', why: 'A tilt switch only changes when it is tipped over. A street light stands still: it must sense light.' },
        { t: 'A pressure sensor', mis: 'sensor-mixup', why: 'A pressure sensor detects a force pressing on it. Nothing presses on a street light at dusk: it must sense light.' },
      ] },
      { id: 'p09.street-process', label: 'Street light: what the process block does', q: 'What does the <b>process</b> block (the microcontroller) do?', options: [
        { t: 'It decides: is it dark enough yet?', ok: true, why: 'Yes: it is a decision-maker. It compares the input signal with a set value and chooses lamp ON or lamp OFF.' },
        { t: 'It senses how bright the daylight is', mis: 'process-role', why: 'Sensing is the job of the INPUT block. The process block takes that signal and decides what to do with it.' },
        { t: 'It gives out the light for the road', mis: 'process-role', why: 'Giving out light is the job of the OUTPUT block (the lamp). The process block decides when to switch it on.' },
        { t: 'It counts the cars that drive past', mis: 'timer-counter-decision', why: 'Nothing here needs counting. The lamp depends on a yes/no question about the light level.' },
      ] });

    file(2, 'scales', 'digital kitchen scales', ['Flour goes on the top.', 'The more you add, the', 'bigger the number.'], scales,
      { label: 'Kitchen scales: input device', options: [
        { t: 'A pressure sensor', ok: true, why: 'Yes: the weight of the flour presses down on it, and more force gives a different signal. Now choose the output.' },
        { t: 'A thermistor', mis: 'sensor-mixup', why: 'A thermistor senses temperature. Scales need to detect how hard the food presses down.' },
        { t: 'A tilt switch', mis: 'switch-type', why: 'A switch is only on or off, and a tilt switch only reacts to being tipped. Scales need a signal that changes with the force.' },
        { t: 'An LDR', mis: 'sensor-mixup', why: 'An LDR senses light. Scales need to detect how hard the food presses down.' },
      ] },
      { id: 'p09.scales-output', label: 'Kitchen scales: output that suits the cook', q: 'The cook needs to know <b>how many grams</b>. Which <b>output</b> suits that?', options: [
        { t: 'A display that shows numbers', ok: true, why: 'Yes: the cook needs to SEE a value, so the output is a display (made of LEDs or an LCD).' },
        { t: 'A buzzer that makes one tone', mis: 'output-choice', why: 'A buzzer makes one fixed sound. It cannot tell the cook whether there are 50 g or 500 g.' },
        { t: 'A single lamp that lights up', mis: 'output-choice', why: 'One lamp is just on or off. It cannot tell the cook whether there are 50 g or 500 g.' },
        { t: 'A push switch on the front', mis: 'input-vs-output', why: 'A switch is an INPUT: it sends a signal into the system. An output is something the user can see, hear or use.' },
      ] });

    file(3, 'alarm', 'burglar alarm', ['Magnet on the window,', 'a part on the frame.', 'Open it: loud siren!'], windowAlarm,
      { label: 'Burglar alarm (window): input device', options: [
        { t: 'A reed switch', ok: true, why: 'Yes: a reed switch is worked by a magnet coming near. Opening the window moves the magnet away. Now choose the output.' },
        { t: 'A tilt switch', mis: 'switch-type', why: 'A tilt switch works when it is tipped over. It does not need a magnet: read the first clue again.' },
        { t: 'A toggle switch', mis: 'switch-type', why: 'A toggle switch stays where a person leaves it, like a light switch. A burglar would not flick it for you!' },
        { t: 'A push-to-make switch', mis: 'switch-type', why: 'A push-to-make switch is on only while something presses it. It does not need a magnet: read the first clue again.' },
      ] },
      { id: 'p09.alarm-output', label: 'Burglar alarm: output that warns the street', q: 'The alarm must warn <b>everyone in the street</b>, day or night. Which <b>output</b> suits that?', options: [
        { t: 'A loud siren and a flashing lamp', ok: true, why: 'Yes: people can HEAR the siren and SEE the flashing lamp from a distance.' },
        { t: 'A tiny LED on the control box', mis: 'output-choice', why: 'Nobody outside the house could see it. The output has to suit the people who need the warning.' },
        { t: 'A display showing the time', mis: 'output-choice', why: 'A display has to be read close up. It would not warn anyone in the street.' },
        { t: 'A pressure mat under the carpet', mis: 'input-vs-output', why: 'A pressure mat is another INPUT: it detects a burglar stepping on it. It cannot warn anyone.' },
      ] });

    file(4, 'heating', 'heating thermostat', ['You set 20 °C. When', 'the room gets colder', 'the heating comes on.'], thermostat,
      { label: 'Heating thermostat: input device', options: [
        { t: 'A thermistor', ok: true, why: 'Yes: a thermistor is a temperature sensor. Now decide which job the microcontroller is doing.' },
        { t: 'An LDR', mis: 'sensor-mixup', why: 'An LDR senses light. A bright room can still be a cold room: this product must sense temperature.' },
        { t: 'A reed switch', mis: 'switch-type', why: 'A reed switch is worked by a magnet coming near. There is no magnet here: this product must sense temperature.' },
        { t: 'A pressure sensor', mis: 'sensor-mixup', why: 'A pressure sensor detects a force pressing on it. This product must sense temperature.' },
      ] },
      { id: 'p09.heating-process', label: 'Heating thermostat: which microcontroller job', q: 'The microcontroller <b>compares</b> the room with the 20 °C you set. Which <b>job</b> is that?', options: [
        { t: 'Decision-maker', ok: true, why: 'Yes: IF the room is colder than the set value THEN heating on. Comparing and choosing is decision-making.' },
        { t: 'Counter', mis: 'timer-counter-decision', why: 'A counter counts events, like people through a door. Here it compares a reading with a set value and chooses.' },
        { t: 'Timer', mis: 'timer-counter-decision', why: 'A timer waits, or keeps something on, for a set time. Here it compares a reading with a set value and chooses.' },
      ] });

    file(5, 'door', 'shop door counter', ['The door nudges a tiny', 'lever as it opens. The', 'screen shows a total.'], shopDoor,
      { label: 'Shop door counter: input device', options: [
        { t: 'A micro switch', ok: true, why: 'Yes: a micro switch needs only a tiny movement and often has a little lever. Now decide what the microcontroller does.' },
        { t: 'A reed switch', mis: 'switch-type', why: 'A reed switch is worked by a magnet coming near. The clue is a tiny lever being nudged, not a magnet.' },
        { t: 'A tilt switch', mis: 'switch-type', why: 'A tilt switch works when it is tipped over. The clue is a tiny lever being nudged.' },
        { t: 'A toggle switch', mis: 'switch-type', why: 'A toggle switch stays where it is left, so it would not reset for the next customer. The clue is a tiny lever.' },
      ] },
      { id: 'p09.door-process', label: 'Shop door counter: what the microcontroller does', q: 'What does the <b>microcontroller</b> do with each signal?', options: [
        { t: 'It adds 1 to a running total each time', ok: true, why: 'Yes: it is working as a counter. Each signal from the door adds 1, and the display shows the total.' },
        { t: 'It times how long the door is open', mis: 'timer-counter-decision', why: 'That would be a timer. The screen shows a total of door openings, so the events are being counted.' },
        { t: 'It detects the door moving by itself', mis: 'process-role', why: 'Detecting is the job of the INPUT device on the door frame. The process block works on the signal it sends.' },
        { t: 'It lights up the numbers on the screen', mis: 'process-role', why: 'Showing the numbers is the job of the OUTPUT (the display). The process block works out what to show.' },
      ] });

    file(6, 'brush', 'electric toothbrush', ['Press the button and', 'let go. It runs, then', 'buzzes at 2 minutes.'], toothbrush,
      { label: 'Electric toothbrush: input device', options: [
        { t: 'A push-to-make switch', ok: true, why: 'Yes: pressing it makes the circuit and sends a signal. The microcontroller remembers the press after you let go.' },
        { t: 'A push-to-break switch', mis: 'switch-type', why: 'A push-to-break switch turns its circuit OFF while pressed. This button sends a signal when you press it.' },
        { t: 'A tilt switch', mis: 'switch-type', why: 'A tilt switch works when it is tipped. A toothbrush is tipped all the time while you brush! The clue is a button.' },
        { t: 'A reed switch', mis: 'switch-type', why: 'A reed switch is worked by a magnet coming near. The clue is a button that you press.' },
      ] },
      { id: 'p09.brush-process', label: 'Electric toothbrush: what the microcontroller does', q: 'What does the <b>microcontroller</b> do after the press?', options: [
        { t: 'Keeps it running for a set time', ok: true, why: 'Yes: it is working as a timer. It keeps the motor on, and after 2 minutes it gives the signal to buzz.' },
        { t: 'Counts each tooth that is brushed', mis: 'timer-counter-decision', why: 'Nothing is being counted. The clue is "2 minutes": the brush runs for a set length of time.' },
        { t: 'Checks if the teeth are clean yet', mis: 'timer-counter-decision', why: 'That would be a decision, and it has no sensor for clean teeth. The clue is "2 minutes": a set length of time.' },
        { t: 'Spins the brush head round itself', mis: 'process-role', why: 'Movement is the job of an OUTPUT (the motor). The process block controls when the motor is on.' },
      ] });

    file(7, 'fridge', 'fridge door alarm', ['Door shut: it presses', 'a switch. Left open', 'too long: it beeps.'], fridge,
      { id: 'p09.fridge-input', label: 'Fridge door alarm: input device', q: 'The alarm circuit must be <b>off while the shut door presses the switch</b>. Which <b>input device</b> is it?', options: [
        { t: 'A push-to-break switch', ok: true, why: 'Yes: push-to-break is OFF only while it is pressed. Open the door, the switch is released and the circuit is on. Now choose the output.' },
        { t: 'A push-to-make switch', mis: 'switch-type', why: 'Push-to-make is ON only while pressed, so this alarm would be on with the door SHUT. It needs the opposite.' },
        { t: 'A toggle switch', mis: 'switch-type', why: 'A toggle switch stays where it is left. This switch must spring back by itself when the door opens.' },
        { t: 'A tilt switch', mis: 'switch-type', why: 'A tilt switch works when it is tipped over. The clue says the door PRESSES this switch.' },
      ] },
      { id: 'p09.fridge-output', label: 'Fridge door alarm: simplest output', q: 'It only has to make <b>one simple beep</b>. Which <b>output</b> is the simplest, cheapest choice?', options: [
        { t: 'A buzzer', ok: true, why: 'Yes: a buzzer makes one fixed tone as soon as it is switched on. It is simple and cheap.' },
        { t: 'A speaker', mis: 'buzzer-vs-speaker', why: 'A speaker can play any sound, but it needs a changing signal. That is more than one simple beep needs.' },
        { t: 'A lamp', mis: 'output-choice', why: 'You would have to be looking at the fridge to notice a lamp. A sound reaches you across the kitchen.' },
        { t: 'A motor', mis: 'output-choice', why: 'A motor gives movement, not a beep. The user needs to HEAR this warning.' },
      ] });

    file(8, 'vending', 'vending machine alarm', ['Someone tips it to', 'shake out a snack:', 'the alarm goes off.'], vending,
      { label: 'Vending machine alarm: input device', options: [
        { t: 'A tilt switch', ok: true, why: 'Yes: a tilt switch turns on or off when it is tilted. Now choose the output.' },
        { t: 'A reed switch', mis: 'switch-type', why: 'A reed switch is worked by a magnet coming near. Nothing here brings a magnet close: the machine is tipped.' },
        { t: 'A micro switch', mis: 'switch-type', why: 'A micro switch needs something to nudge it, like a door or a lid. Here the whole machine is tipped.' },
        { t: 'A thermistor', mis: 'sensor-mixup', why: 'A thermistor senses temperature. Tipping the machine does not change how hot it is.' },
      ] },
      { id: 'p09.vending-output', label: 'Vending machine alarm: output for a deaf shopkeeper', q: 'The shopkeeper is <b>deaf</b>. Which <b>output</b> suits this user?', options: [
        { t: 'A flashing lamp by the till', ok: true, why: 'Yes: choose the output to suit the user. A deaf user needs to SEE the warning (or feel a vibration).' },
        { t: 'A buzzer with one loud tone', mis: 'output-choice', why: 'However loud it is, this user cannot hear it. The output has to suit the user.' },
        { t: 'A speaker that plays speech', mis: 'output-choice', why: 'A speaker makes sound, and this user cannot hear it. The output has to suit the user.' },
        { t: 'A second switch by the till', mis: 'input-vs-output', why: 'A switch is an INPUT: it sends a signal into the system. It cannot warn anyone.' },
      ] });

    // ---- case closed: an exam-style written explanation ----
    ui.el('h2', '', 'Case closed: write it up');
    ui.p('A good detective explains the evidence. Think back to the <b>burglar alarm</b> in case 3. Its "brain" is a microcontroller. Give a <b>point</b>, then say <b>why it matters</b>.');
    ui.write({ id: 'p09.explain', label: 'Explain why a designer would use a microcontroller in a burglar alarm [2]', marks: 2, lines: 4,
      q: '<b>Explain</b> why a designer would use a <b>microcontroller</b> in the burglar alarm rather than a circuit of separate components.',
      scheme: ['A correct point: it can be reprogrammed / one chip replaces many components / it can handle many inputs and outputs at once (several windows, a siren and a lamp)', 'Developed (because / so): the alarm can be changed or updated without rebuilding it (e.g. how long the siren sounds) / the alarm is smaller, cheaper to assemble and more reliable'],
      model: 'A microcontroller can be <b>reprogrammed</b>, so the designer can change what the alarm does (for example, how long the siren sounds) <b>without rebuilding the circuit</b>. Also, one chip replaces many separate components, so the alarm is smaller, cheaper to assemble and more reliable, and it can handle several window switches, the siren and the lamp at once.' });
  },
});
