// Page 8 — Design a system: the system-builder workbench. For each brief the student taps an INPUT device, a PROCESS
// job and an OUTPUT device into a block diagram, presses TEST, and pokes a pen-drawn scene to see the system work
// (or fail in a way that shows why). Then a 3-mark written answer.
(function () {
  'use strict';
  const B = Ink.BLUE, RD = Ink.RED, GR = Ink.GREEN, rgba = Ink.rgba, geo = Ink.geo;
  const HANDF = (s) => `400 ${s}px "Gloria Hallelujah", "Comic Sans MS", cursive`;
  const LABF = (s) => `600 ${s}px Fredoka, "Arial Rounded MT Bold", system-ui, sans-serif`;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const TAU = Math.PI * 2;
  const AMBER = [255, 196, 40];
  function text(x, s, px, py, o = {}) {
    x.save(); x.font = (o.font === 'hand' ? HANDF : LABF)(o.size || 22);
    x.fillStyle = rgba(o.color || B, o.a ?? 0.92); x.textAlign = o.align || 'center'; x.textBaseline = o.base || 'alphabetic';
    x.fillText(s, px, py); x.restore();
  }
  const path = (x, P) => { x.beginPath(); P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.closePath(); };
  const fillP = (x, P, style) => { x.save(); x.fillStyle = style; path(x, P); x.fill(); x.restore(); };
  const eraseP = (x, P) => { x.save(); x.globalCompositeOperation = 'destination-out'; x.fillStyle = '#000'; path(x, P); x.fill(); x.restore(); };
  const box = (x0, y0, w, h) => [[x0, y0], [x0 + w, y0], [x0 + w, y0 + h], [x0, y0 + h]];
  const closeP = (P) => P.concat([P[0]]);
  const disc = (x, cx, cy, r, col, a = 0.9) => { x.save(); x.fillStyle = rgba(col, a); x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill(); x.restore(); };
  const glow = (x, cx, cy, r, col, a) => {
    if (a <= 0.01) return; const g = x.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, rgba(col, 0.95 * a)); g.addColorStop(0.45, rgba(col, 0.4 * a)); g.addColorStop(1, rgba(col, 0));
    x.save(); x.fillStyle = g; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill(); x.restore();
  };
  // pen stroke whose width is corrected for the current drawing scale (LW)
  let LW = 1;
  const st = (x, pts, o = {}) => Ink.stroke(x, pts, Object.assign({ amp: 0.4 }, o, { w: (o.w || 2.2) * LW }));
  const arcs = (x, cx, cy, ph, col, n = 3) => { x.save(); x.strokeStyle = rgba(col, 1); x.lineWidth = 2 * LW; x.lineCap = 'round'; for (let i = 0; i < n; i++) { const r = 7 + ((i * 7 + ph) % (n * 7)); x.globalAlpha = clamp(1 - r / (n * 7 + 6)) * 0.95; x.beginPath(); x.arc(cx, cy, r, -0.7, 0.7); x.stroke(); } x.restore(); };

  // =========================================================================================================
  // the 15 parts. Each draw(x, s) draws the device around (0,0) inside about ±34 × ±26; s = { on, now, n, spin, icon }
  // =========================================================================================================
  const SEG = { 0: 'abcdef', 1: 'bc', 2: 'abged', 3: 'abgcd', 4: 'fgbc', 5: 'afgcd', 6: 'afgedc', 7: 'abc', 8: 'abcdefg', 9: 'abfgcd' };
  const digit = (x, d, ox) => {
    const L = { a: [1, -11, 11, -11], b: [12, -10, 12, -1], c: [12, 1, 12, 10], d: [1, 11, 11, 11], e: [0, 1, 0, 10], f: [0, -10, 0, -1], g: [1, 0, 11, 0] };
    x.save(); x.lineCap = 'round'; x.lineWidth = 3.2;
    Object.keys(L).forEach((k) => { const lit = d != null && SEG[d].includes(k), q = L[k]; x.strokeStyle = lit ? rgba(RD, 0.95) : rgba(B, 0.1); x.beginPath(); x.moveTo(ox + q[0], q[1]); x.lineTo(ox + q[2], q[3]); x.stroke(); });
    x.restore();
  };
  const PARTS = {
    push: { name: 'Push switch', kind: 'in', draw(x, s) {
      const d = s.on ? 6 : 0, base = box(-24, 8, 48, 13);
      Ink.hatchFill(x, base, 1, B, 1.6); st(x, closeP(base), { seed: 3 });
      st(x, closeP(box(-7, -6 + d, 14, 14 - d)), { seed: 5, w: 1.8 });
      const cap = geo.rect(-15, -15 + d, 30, 9, 4); fillP(x, cap, 'rgba(235,90,90,0.3)'); st(x, cap, { seed: 7, color: RD });
      st(x, [[-16, 21], [-16, 27]], { seed: 9 }); st(x, [[16, 21], [16, 27]], { seed: 11 });
    } },
    micro: { name: 'Micro switch', kind: 'in', draw(x, s) {
      const b = box(-26, -1, 52, 20); Ink.hatchFill(x, box(-26, 9, 52, 10), 1, B, 1.6); st(x, closeP(b), { seed: 3 });
      const ty = s.on ? -5 : -17; st(x, [[-22, -5], [20, ty]], { seed: 5, w: 2.4 }); st(x, geo.ellipse(23, ty - 1, 4, 4), { seed: 7, w: 1.6 });
      st(x, closeP(box(2, -6, 8, 5)), { seed: 9, w: 1.6, color: RD }); disc(x, -22, -5, 2.4, B);
      [-16, 0, 16].forEach((px, i) => st(x, [[px, 19], [px, 26]], { seed: 11 + i }));
    } },
    reed: { name: 'Reed switch', kind: 'in', draw(x, s) {
      const cap = geo.rect(-22, -3, 44, 16, 8); fillP(x, cap, 'rgba(120,140,235,0.12)'); st(x, cap, { seed: 3 });
      st(x, [[-34, 5], [-22, 5]], { seed: 5 }); st(x, [[22, 5], [34, 5]], { seed: 7 });
      st(x, [[-22, 5], [4, s.on ? 5 : 2]], { seed: 9, w: 1.8 }); st(x, [[22, 5], [-4, s.on ? 5 : 8]], { seed: 11, w: 1.8 });
      if (s.on || s.icon) { const m = box(-14, -24, 28, 11); st(x, closeP(m), { seed: 13, color: RD, w: 1.8 }); Ink.hatchFill(x, box(-14, -24, 14, 11), 1, RD, 2); st(x, [[0, -24], [0, -13]], { seed: 15, color: RD, w: 1.4, retrace: false }); }
    } },
    ldr: { name: 'LDR', kind: 'in', draw(x, s) {
      st(x, geo.ellipse(2, -3, 19, 19), { seed: 3 });
      st(x, [[-9, -13], [12, -13], [12, -8], [-9, -8], [-9, -3], [12, -3], [12, 2], [-9, 2], [-9, 7], [13, 7]], { seed: 5, w: 1.6, color: RD, retrace: false });
      st(x, [[-5, 16], [-5, 27]], { seed: 7 }); st(x, [[9, 16], [9, 27]], { seed: 9 });
      [[-33, -25], [-34, -13]].forEach(([ax, ay], i) => { st(x, [[ax, ay], [ax + 10, ay + 7]], { seed: 11 + i, w: 1.6, retrace: false }); st(x, [[ax + 4, ay + 7], [ax + 10, ay + 7], [ax + 9, ay + 1]], { seed: 13 + i, w: 1.6, retrace: false }); });
    } },
    therm: { name: 'Thermistor', kind: 'in', draw(x, s) {
      const d = geo.ellipse(0, -8, 12, 14, 0, TAU); fillP(x, d, s.on ? 'rgba(235,70,70,0.45)' : 'rgba(120,140,235,0.15)'); Ink.hatchFill(x, d, 1, B, 2); st(x, closeP(d), { seed: 3 });
      st(x, [[-5, 5], [-8, 27]], { seed: 5 }); st(x, [[5, 5], [8, 27]], { seed: 7 });
      st(x, [[24, -20], [24, -2]], { seed: 9, w: 1.6, color: RD, retrace: false }); st(x, geo.ellipse(24, 3, 4, 4), { seed: 11, w: 1.6, color: RD }); disc(x, 24, 3, 2.2, RD);
    } },
    press: { name: 'Pressure sensor', kind: 'in', draw(x, s) {
      const p = box(-17, -22, 34, 30); fillP(x, p, 'rgba(120,140,235,0.12)'); st(x, closeP(p), { seed: 3 });
      [-17, -10, -3, 4].forEach((y, i) => { st(x, [[-13, y], [8, y]], { seed: 5 + i, w: 1.4, retrace: false }); st(x, [[13, y + 3.5], [-8, y + 3.5]], { seed: 9 + i, w: 1.4, retrace: false, color: RD }); });
      st(x, [[-6, 8], [-6, 27]], { seed: 15 }); st(x, [[6, 8], [6, 27]], { seed: 17 });
      if (s.on) { st(x, [[28, -26], [28, -12]], { seed: 19, color: RD }); st(x, [[23, -17], [28, -11], [33, -17]], { seed: 21, color: RD }); }
    } },
    tilt: { name: 'Tilt switch', kind: 'in', draw(x, s) {
      x.save(); x.rotate(s.on ? 0.75 : -0.22);
      const b = geo.rect(-20, -9, 40, 18, 8); fillP(x, b, 'rgba(120,140,235,0.12)'); st(x, b, { seed: 3 });
      disc(x, s.on ? 11 : -11, 0, 5.5, B, 0.85);
      st(x, [[20, -4], [31, -4]], { seed: 5 }); st(x, [[20, 4], [31, 4]], { seed: 7 });
      x.restore();
      st(x, [[-30, 24], [30, 24]], { seed: 9, w: 1.4, retrace: false });
    } },
    timer: { name: 'Timer', kind: 'proc', draw(x, s) {
      st(x, geo.ellipse(0, 4, 19, 19), { seed: 3 }); st(x, closeP(box(-4, -22, 8, 6)), { seed: 5, w: 1.8 }); st(x, [[14, -12], [18, -16]], { seed: 7 });
      for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2; st(x, [[Math.cos(a) * 14, 4 + Math.sin(a) * 14], [Math.cos(a) * 17, 4 + Math.sin(a) * 17]], { seed: 9 + i, w: 1.4, retrace: false }); }
      st(x, [[0, 4], [7, -7]], { seed: 15, color: RD }); disc(x, 0, 4, 2, RD);
    } },
    count: { name: 'Counter', kind: 'proc', draw(x, s) {
      [-22, -14, -6, 2].forEach((px, i) => st(x, [[px, -13], [px + 1, 13]], { seed: 3 + i, w: 2.4 }));
      st(x, [[-28, 10], [8, -10]], { seed: 9, w: 2.4 });
      text(x, '+1', 23, 8, { size: 19, color: RD });
    } },
    decide: { name: 'Decision-maker', kind: 'proc', draw(x, s) {
      st(x, closeP([[0, -23], [28, 0], [0, 23], [-28, 0]]), { seed: 3 });
      text(x, '?', 0, 9, { size: 26, color: RD });
    } },
    lamp: { name: 'Lamp / LED', kind: 'out', draw(x, s) {
      if (s.on) glow(x, 0, -8, 40, AMBER, 1);
      st(x, geo.ellipse(0, -8, 15, 15, 1.95, 1.95 + TAU - 0.75), { seed: 3 });
      const cap = box(-7, 7, 14, 11); Ink.hatchFill(x, cap, 1, B, 2); st(x, closeP(cap), { seed: 5, w: 1.8 });
      st(x, [[-4, 7], [-4, -4], [0, -9], [4, -4], [4, 7]], { seed: 7, w: 1.4, color: s.on ? [226, 120, 20] : B, retrace: false });
      st(x, [[0, 18], [0, 26]], { seed: 9 });
      if (s.on) for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * 0.55; st(x, [[Math.cos(a) * 21, -8 + Math.sin(a) * 21], [Math.cos(a) * 29, -8 + Math.sin(a) * 29]], { seed: 11 + i, w: 1.8, color: [226, 120, 20], retrace: false }); }
    } },
    buzz: { name: 'Buzzer', kind: 'out', draw(x, s) {
      const body = geo.ellipse(-4, 8, 20, 7, 0, Math.PI).concat([[-24, -8]], geo.ellipse(-4, -8, 20, 7, Math.PI, TAU));
      fillP(x, body, 'rgba(60,75,170,0.2)'); Ink.hatchFill(x, body, 1, B, 2.4);
      st(x, [[-24, -8], [-24, 8]], { seed: 3 }); st(x, [[16, -8], [16, 8]], { seed: 5 }); st(x, geo.ellipse(-4, 8, 20, 7, 0, Math.PI), { seed: 7 });
      const top = geo.ellipse(-4, -8, 20, 7, 0, TAU); eraseP(x, top); fillP(x, top, 'rgba(60,75,170,0.08)'); st(x, closeP(top), { seed: 9 });
      disc(x, -4, -8, 3, B); st(x, [[-12, 15], [-12, 26]], { seed: 11 }); st(x, [[4, 15], [4, 26]], { seed: 13 });
      if (s.on) arcs(x, 16, -6, (s.now || 0) * 40, RD);
    } },
    spk: { name: 'Speaker', kind: 'out', draw(x, s) {
      const dx = s.on ? Math.sin((s.now || 0) * 50) * 1.6 : 0;
      const m = box(-26, -9, 11, 18); Ink.hatchFill(x, m, 1, B, 2.4); st(x, closeP(m), { seed: 3 });
      const cone = [[6, -22], [-15 + dx, -6], [-15 + dx, 6], [6, 22]]; fillP(x, cone, 'rgba(120,140,235,0.14)'); st(x, cone, { seed: 5 });
      const rim = box(6, -24, 5, 48); Ink.hatchFill(x, rim, 1, B, 2); st(x, closeP(rim), { seed: 7, w: 1.8 });
      if (s.on) arcs(x, 12, 0, (s.now || 0) * 40, B, 3);
    } },
    motor: { name: 'Motor', kind: 'out', draw(x, s) {
      const b = geo.rect(-30, -13, 34, 26, 6); fillP(x, b, 'rgba(120,140,235,0.12)'); Ink.hatchFill(x, box(-30, 1, 34, 12), 1, B, 2); st(x, b, { seed: 3 });
      st(x, [[-22, -13], [-22, 13]], { seed: 5, w: 1.4, retrace: false });
      st(x, [[4, 0], [14, 0]], { seed: 7, w: 2.6 }); st(x, [[-30, -5], [-35, -5]], { seed: 9 }); st(x, [[-30, 5], [-35, 5]], { seed: 11 });
      const sp = s.spin || 0.4;
      for (let k = 0; k < 3; k++) { const a = sp + k * TAU / 3, c = Math.cos(a), sn = Math.sin(a); const bl = geo.ellipse(11, 0, 10, 4.6, 0, TAU).map(([px, py]) => [16 + px * c - py * sn, px * sn + py * c]); fillP(x, bl, 'rgba(120,140,235,0.2)'); st(x, closeP(bl), { seed: 13 + k, w: 1.8, amp: 0.2 }); }
      disc(x, 16, 0, 3, B);
    } },
    disp: { name: 'Display', kind: 'out', draw(x, s) {
      const b = geo.rect(-26, -19, 52, 38, 5); Ink.hatchShadow(x, b, 1, 3, 3); fillP(x, b, 'rgba(120,140,235,0.1)'); st(x, b, { seed: 3 });
      const n = s.n == null ? (s.icon ? 88 : null) : Math.min(99, s.n);
      digit(x, n == null ? null : n >= 10 ? Math.floor(n / 10) : null, -17); digit(x, n == null ? null : n % 10, 4);
    } },
  };
  const ORDER = ['buzz', 'ldr', 'timer', 'push', 'motor', 'therm', 'count', 'lamp', 'reed', 'spk', 'press', 'decide', 'micro', 'disp', 'tilt']; // mixed on purpose
  const kind = (id) => (PARTS[id] || {}).kind;
  const KINDNAME = { in: 'INPUT', proc: 'PROCESS', out: 'OUTPUT' };
  function drawPart(x, id, cx, cy, s, state) {
    x.save(); x.translate(cx, cy); x.scale(s, s); const old = LW; LW = 1.15 / s; PARTS[id].draw(x, state || {}); LW = old; x.restore();
  }
  function iconCanvas(id) {
    const c = document.createElement('canvas'); c.width = 152; c.height = 120; c.className = 'p08-ic';
    const x = c.getContext('2d'); x.lineCap = 'round'; x.lineJoin = 'round'; drawPart(x, id, 76, 60, 2, { icon: true });
    return c;
  }

  // what makes each input react when it is NOT the thing the scene naturally triggers
  const DIRECT = {
    push: { label: 'Press the switch', hold: 1.4, w: ['not pressed', 'pressed'], react: 'someone presses it' },
    micro: { label: 'Push its lever', hold: 1.4, w: ['lever free', 'lever pushed'], react: 'something pushes its lever' },
    reed: { label: ['Bring a magnet near', 'Take the magnet away'], w: ['no magnet', 'magnet near'], react: 'a magnet comes near it' },
    ldr: { label: ['Cover the LDR', 'Uncover the LDR'], w: ['light', 'dark'], react: 'the light level changes' },
    therm: { label: ['Warm the thermistor', 'Let it cool'], w: ['cool', 'hot'], react: 'the temperature changes' },
    press: { label: 'Press on the sensor', hold: 1.4, w: ['no force', 'pressed'], react: 'something presses on it' },
    tilt: { label: ['Tilt it', 'Stand it level'], w: ['level', 'tilted'], react: 'it is tilted' },
  };
  const BR = {
    1: { tab: 'Night light', short: 'night light', text: 'A <b>night light</b> that comes on <b>by itself</b> when the bedroom gets <b>dark</b>.', in: ['ldr'], proc: 'decide', out: ['lamp'], natural: ['ldr'],
      hint: 'Make it dark and watch what your system does.', inSpot: [352, 128], outSpot: [520, 172],
      win: 'It works! The light came on by itself when it got dark. Make it light again and it switches off.' },
    2: { tab: 'Fridge alarm', short: 'fridge alarm', text: 'An <b>alarm</b> that sounds if the <b>fridge</b> is left open for <b>over a minute</b>.', in: ['micro', 'push', 'reed', 'press', 'ldr'], proc: 'timer', out: ['buzz', 'spk'], natural: ['micro', 'push', 'reed', 'press', 'ldr'],
      hint: 'Open the fridge door and leave it open. (Time is speeded up.)', inSpot: [226, 92], outSpot: [716, 112],
      win: 'It works! A quick look in the fridge is fine, but leave the door open for a minute and the alarm sounds.' },
    3: { tab: 'Shop door', short: 'shop door', text: 'A sign that <b>shows how many customers</b> have walked into the shop today.', in: ['press', 'micro', 'push', 'reed', 'ldr'], proc: 'count', out: ['disp'], natural: ['press', 'micro', 'push', 'reed', 'ldr'],
      hint: 'Walk three customers in and watch what your system does.', inSpot: [358, 196], outSpot: [706, 102],
      win: 'It works! Every customer who walks in adds one to the number on show.' },
    4: { tab: 'Greenhouse', short: 'greenhouse fan', text: 'A <b>fan</b> that comes on <b>by itself</b> when the greenhouse gets <b>too hot</b>.', in: ['therm'], proc: 'decide', out: ['motor'], natural: ['therm', 'ldr'],
      hint: 'Heat the greenhouse up and watch what your system does.', inSpot: [292, 212], outSpot: [490, 108],
      win: 'It works! When the greenhouse got too hot the fan came on by itself, and the plants perked up.' },
    0: { tab: 'Free build', short: 'free build', text: '<b>Free build</b> (optional): invent a system of your own and try it out on the test bench.', natural: [], hint: 'Poke the input and watch the signal go through your system.', inSpot: [172, 178], outSpot: [688, 178] },
  };
  const EXTRA = { // a friendly word about the alternative inputs that also work
    2: { reed: 'A magnet on the door closes the reed switch, just like a burglar alarm sensor.', ldr: 'Clever: light floods in when the door opens, and the LDR senses it.', press: 'The shut door squeezes the sensor; opening it lets go.', spk: 'A speaker works. A buzzer would do the same job more simply.' },
    3: { ldr: 'A light beam across the doorway: each customer blocks it for a moment.', press: 'A pressure mat: each customer steps on it.', micro: 'It adds one every time the door swings open.', push: 'It adds one every time the door swings open.', reed: 'A magnet on the door: it adds one every time the door swings open.' },
  };
  function judge(b, c) {
    const R = BR[b], n = (id) => PARTS[id].name, fails = [];
    const need = { 1: 'Which input senses how light or dark it is?', 2: 'What could sense the door itself opening?', 3: 'What could sense a customer coming through the door?', 4: 'Which input senses temperature?' }[b];
    // --- the INPUT box ---
    if (kind(c.in) === 'out') fails.push(['input-vs-output', `<b>${n(c.in)}</b> is an OUTPUT device: it gives something out. It cannot sense anything, so no signal was ever sent. The INPUT box needs a switch or a sensor.`]);
    else if (kind(c.in) === 'proc') fails.push(['ipo-order', `<b>${n(c.in)}</b> is a job the microcontroller does, so it belongs in the PROCESS box. Nothing sensed anything, so no signal was ever sent. The INPUT box needs a switch or a sensor.`]);
    else if (!R.in.includes(c.in)) {
      let m;
      if (b === 1) m = c.in === 'therm' ? 'It got dark and nothing happened. A thermistor senses <b>temperature</b>, not light (warm it and see!).' : `It got dark and nothing happened. A ${n(c.in).toLowerCase()} only reacts when ${DIRECT[c.in].react}, and the light must come on <b>by itself</b>.`;
      if (b === 2) m = c.in === 'therm' ? 'A thermistor senses temperature. The inside of the fridge warms up far too slowly for it to notice the open door in time.' : 'A tilt switch only reacts when it is tipped over. A fridge door swings sideways: nothing tilts.';
      if (b === 3) m = c.in === 'therm' ? 'A thermistor senses temperature. A customer walking in does not change that, so nobody was detected.' : 'A tilt switch only reacts when it is tipped over. Nothing tilts when a customer walks in, so nobody was detected.';
      if (b === 4) m = c.in === 'ldr' ? 'An LDR senses <b>light</b>, not heat. Your system reacted to how bright it was, even when the greenhouse was cool (make it dark and see!).' : `It got hot and nothing happened. A ${n(c.in).toLowerCase()} only reacts when ${DIRECT[c.in].react}.`;
      fails.push(['sensor-mixup', m + ' ' + need]);
    }
    // --- the PROCESS box ---
    if (kind(c.proc) !== 'proc') fails.push(['process-role', `The PROCESS box is the microcontroller's job: timing, counting or deciding. <b>${n(c.proc)}</b> is an ${kind(c.proc) === 'in' ? 'input' : 'output'} device, so nothing worked out what to do with the signal.`]);
    else if (c.proc !== R.proc) {
      const M = {
        1: { timer: 'The signal arrived, but a timer only knows about time: it kept the output on for its set time and then switched off, although it was still dark. Which job keeps checking "is it dark?"', count: 'A counter just adds 1 each time it gets dark. That gives a number, not something that stays on all night. Which job keeps checking "is it dark?"' },
        2: { decide: 'The output came on the instant the door opened: nobody could even get the milk out in peace! Which job can measure whether the door stays open for a whole minute?', count: 'The counter added 1 when the door opened, but it has no idea how LONG the door has been open. Which job can measure a whole minute?' },
        3: { timer: 'The timer kept the output on for a few seconds after each customer, then forgot all about them. Which job keeps a running total?', decide: 'It can tell that someone is in the doorway right now, but it forgets each customer as soon as they have gone. Which job keeps a running total?' },
        4: { timer: 'The timer ran the output for its set time and then stopped, although the greenhouse was still too hot. Which job keeps checking "is it too hot?"', count: 'A counter just adds 1 each time it gets hot. That gives a number, not cooling. Which job keeps checking "is it too hot?"' },
      };
      fails.push(['timer-counter-decision', M[b][c.proc]]);
    }
    // --- the OUTPUT box ---
    if (kind(c.out) === 'in') fails.push(['input-vs-output', `<b>${n(c.out)}</b> is an INPUT device: it senses. It cannot give out light, sound or movement, so the user got nothing. What belongs in the OUTPUT box?`]);
    else if (kind(c.out) === 'proc') fails.push(['ipo-order', `<b>${n(c.out)}</b> is a job the microcontroller does, so it belongs in the PROCESS box. The OUTPUT box needs something the user can see, hear or use.`]);
    else if (!R.out.includes(c.out)) {
      const snd = c.out === 'buzz' || c.out === 'spk';
      const M = {
        1: snd ? 'Your system spotted the dark, but then it made a noise: not much help at bedtime! The user needs to SEE. Which output gives light?' : c.out === 'motor' ? 'Your system spotted the dark, but then a motor spun round. The user needs to SEE. Which output gives light?' : 'Your system spotted the dark, but a display only shows numbers: it will not light up a bedroom. Which output gives light?',
        2: c.out === 'lamp' ? 'After a minute a lamp came on, but nobody in the next room would notice it. An alarm has to be HEARD. Which output gives sound?' : c.out === 'motor' ? 'After a minute a motor spun round, but that warns nobody. An alarm has to be HEARD. Which output gives sound?' : 'After a minute the display changed, silently. An alarm has to be HEARD. Which output gives sound?',
        3: c.out === 'lamp' ? 'The lamp flashed as each customer came in, but a lamp cannot show HOW MANY. Which output can show a number?' : snd ? 'It made a sound as each customer came in, but a sound cannot show HOW MANY there have been. Which output can show a number?' : 'The motor twitched as each customer came in, but that cannot show HOW MANY. Which output can show a number?',
        4: c.out === 'lamp' ? 'When it got too hot a lamp came on. That cools nothing: the plants are still wilting! A fan has to SPIN. Which output gives movement?' : snd ? 'When it got too hot it made a noise. That cools nothing: the plants are still wilting! A fan has to SPIN. Which output gives movement?' : 'When it got too hot the display changed. That cools nothing: the plants are still wilting! A fan has to SPIN. Which output gives movement?',
      };
      fails.push(['output-choice', M[b]]);
    }
    return fails;
  }

  // an interactive canvas with a render loop that sleeps off screen / when the page is hidden
  function Stage(parent, W, Hh) {
    const c = document.createElement('canvas'); parent.appendChild(c);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = Math.round(W * dpr); c.height = Math.round(Hh * dpr);
    Object.assign(c.style, { width: '100%', height: 'auto', aspectRatio: W + ' / ' + Hh, display: 'block', touchAction: 'manipulation', userSelect: 'none', webkitUserSelect: 'none' });
    const ctx = c.getContext('2d');
    const S = { c, ctx, W, H: Hh, render: () => false };
    S.layer = (paint) => { const L = document.createElement('canvas'); L.width = Math.ceil(W * dpr); L.height = Math.ceil(Hh * dpr); const x = L.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.lineCap = 'round'; x.lineJoin = 'round'; paint(x); return L; };
    S.blit = (L) => ctx.drawImage(L, 0, 0, W, Hh);
    const hidden = () => { const p = c.closest('.page'); return !p || p.classList.contains('hidden') || !c.offsetParent; };
    let raf = 0, wait = 0, last = 0, vis = true;
    if (window.IntersectionObserver) new IntersectionObserver((es) => { vis = es[es.length - 1].isIntersecting; if (vis) S.go(); }, { rootMargin: '120px' }).observe(c);
    const tick = (now) => {
      raf = 0;
      if (!vis) { last = 0; return; }
      if (hidden()) { last = 0; if (!wait) wait = setTimeout(() => { wait = 0; S.go(); }, 500); return; }
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60; last = now;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.globalCompositeOperation = 'source-over'; ctx.clearRect(0, 0, W, Hh);
      ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = 1; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      if (S.render(dt, now / 1000)) raf = requestAnimationFrame(tick); else last = 0;
    };
    S.go = () => { if (!raf) raf = requestAnimationFrame(tick); };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { S.onFonts && S.onFonts(); S.go(); });
    return S;
  }

  // sound for the outputs: plain WebAudio, started by the student's tap, silent when the book is muted
  let ac = null, master = null;
  function tone(f, dur, type, gain) {
    if (Book.muted) return;
    try {
      if (!ac) { ac = new (window.AudioContext || window.webkitAudioContext)(); master = ac.createGain(); master.gain.value = 0.5; master.connect(ac.destination); }
      if (ac.state === 'suspended') ac.resume();
      const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + 0.01; o.type = type; o.frequency.value = f;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(gain, t + 0.012); g.gain.setValueAtTime(gain, t + Math.max(0.03, dur - 0.05)); g.gain.linearRampToValueAtTime(0, t + dur);
      let node = o; if (type === 'square') { const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3200; o.connect(lp); node = lp; }
      node.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.05);
    } catch (e) {}
  }

  // =========================================================================================================
  // the scenes (860 × 340). paint = the still parts (cached); live = what moves.
  // =========================================================================================================
  const W = 860, Hh = 340;
  const ov = document.createElement('canvas'); ov.width = 430; ov.height = 170;
  function darkness(x, a, holes) {
    if (a < 0.01) return; const o = ov.getContext('2d');
    o.globalCompositeOperation = 'source-over'; o.clearRect(0, 0, 430, 170); o.fillStyle = `rgba(22,30,100,${0.46 * a})`; o.fillRect(0, 0, 430, 170);
    o.globalCompositeOperation = 'destination-out';
    holes.forEach(([hx, hy, hr, ha]) => { const g = o.createRadialGradient(hx / 2, hy / 2, 0, hx / 2, hy / 2, hr / 2); g.addColorStop(0, `rgba(0,0,0,${ha})`); g.addColorStop(0.5, `rgba(0,0,0,${ha * 0.7})`); g.addColorStop(1, 'rgba(0,0,0,0)'); o.fillStyle = g; o.fillRect(0, 0, 430, 170); });
    x.drawImage(ov, 0, 0, W, Hh);
  }
  const sun = (x, cx, cy) => { glow(x, cx, cy, 46, AMBER, 0.8); st(x, geo.ellipse(cx, cy, 19, 19), { seed: 3, w: 2.2 }); for (let i = 0; i < 8; i++) { const a = i * TAU / 8 + 0.2; st(x, [[cx + Math.cos(a) * 26, cy + Math.sin(a) * 26], [cx + Math.cos(a) * 36, cy + Math.sin(a) * 36]], { seed: 5 + i, w: 1.8, retrace: false }); } };
  const moon = (x, cx, cy) => { st(x, geo.ellipse(cx, cy, 18, 18, 0.9, 0.9 + Math.PI * 1.25), { seed: 3, w: 2.2 }); st(x, geo.curve([cx + 11, cy + 14], [cx - 2, cy + 6], [cx - 6, cy - 8], [cx + 3, cy - 18], 14), { seed: 5, w: 2 }); [[-34, -16], [30, 26], [-22, 24]].forEach(([dx, dy], i) => { st(x, [[cx + dx - 4, cy + dy], [cx + dx + 4, cy + dy]], { seed: 7 + i, w: 1.4, retrace: false }); st(x, [[cx + dx, cy + dy - 4], [cx + dx, cy + dy + 4]], { seed: 11 + i, w: 1.4, retrace: false }); }); };
  const tag = (x, s, px, py, a, b) => { text(x, s, px, py, { font: 'hand', size: 22, color: RD }); st(x, [a, b], { seed: 3, w: 1.6, color: RD, retrace: false }); };

  const SCENES = {
    // ---- 1: bedroom ----
    1: {
      paint(x, env) {
        st(x, [[20, 300], [840, 300]], { seed: 3, w: 2.4 });
        const win = box(52, 42, 206, 166);
        if (env.dark) { Ink.hatchFill(x, win, 1, B, 2.4); Ink.hatchFill(x, win, 1, B, 1.3); eraseP(x, geo.ellipse(204, 92, 30, 30, 0, TAU)); moon(x, 204, 92); } else { sun(x, 204, 92); st(x, geo.curve([76, 110], [80, 88], [106, 86], [110, 100], 10).concat(geo.curve([110, 100], [118, 84], [142, 90], [140, 110], 10), [[76, 110]]), { seed: 9, w: 1.8 }); }
        st(x, closeP(box(50, 40, 210, 170)), { seed: 11, w: 2.8 }); st(x, [[155, 40], [155, 210]], { seed: 13 }); st(x, [[50, 125], [260, 125]], { seed: 15 });
        const sill = box(40, 210, 230, 12); Ink.hatchFill(x, sill, 1, B, 1.6); st(x, closeP(sill), { seed: 17 });
        [[32, 1], [278, -1]].forEach(([cx, d], i) => { st(x, [[cx, 34], [cx - 6 * d, 120], [cx + 2 * d, 222]], { seed: 19 + i }); st(x, [[cx + 14 * d, 34], [cx + 10 * d, 120], [cx + 16 * d, 222]], { seed: 23 + i, w: 1.6 }); });
        st(x, [[18, 32], [292, 32]], { seed: 27, w: 2.6 });
        // bedside table
        const top = box(452, 214, 136, 12), body = box(464, 226, 112, 74); Ink.hatchShadow(x, body, 1, 6, 0); Ink.hatchFill(x, top, 1, B, 1.6); st(x, closeP(top), { seed: 29 }); st(x, closeP(body), { seed: 31 });
        st(x, [[464, 258], [576, 258]], { seed: 33, w: 1.6 }); disc(x, 520, 243, 3, B); disc(x, 520, 278, 3, B);
        // bed with a sleeper
        const mat = box(622, 238, 214, 32); st(x, closeP(mat), { seed: 35, w: 2.4 }); st(x, [[632, 270], [632, 300]], { seed: 37, w: 2.6 }); st(x, [[826, 270], [826, 300]], { seed: 39, w: 2.6 });
        const hb = box(832, 176, 10, 124); Ink.hatchFill(x, hb, 1, B, 2); st(x, closeP(hb), { seed: 41 });
        st(x, geo.rect(764, 216, 64, 22, 9), { seed: 43 }); st(x, geo.ellipse(796, 206, 13, 12), { seed: 45 }); st(x, [[785, 200], [792, 194], [803, 195], [808, 201]], { seed: 47, w: 1.6, retrace: false }); st(x, [[790, 208], [794, 210]], { seed: 49, w: 1.4, retrace: false });
        const bl = geo.curve([624, 238], [660, 206], [730, 204], [778, 226], 20).concat([[778, 238]]); Ink.hatchFill(x, bl.concat([[624, 238]]), 1, B, 0.9); st(x, bl, { seed: 51 });
        // a picture on the wall
        st(x, closeP(box(660, 60, 96, 66)), { seed: 53 }); st(x, [[668, 116], [692, 84], [708, 104], [722, 90], [748, 116]], { seed: 55, w: 1.6, retrace: false });
        tag(x, 'input', 352, 58, [352, 66], [352, 82]); tag(x, 'output', 520, 104, [520, 112], [520, 126]);
      },
      live(x, sim, now) { if (sim.env.dark) text(x, 'z z z', 772 + Math.sin(now * 1.5) * 4, 168, { font: 'hand', size: 24, a: 0.75 }); },
    },
    // ---- 2: kitchen with a fridge ----
    2: {
      paint(x) {
        st(x, [[20, 312], [840, 312]], { seed: 3, w: 2.4 });
        // worktop, cupboards and a kettle
        const wt = box(20, 204, 296, 10); Ink.hatchFill(x, wt, 1, B, 1.8); st(x, closeP(wt), { seed: 5 }); st(x, [[30, 214], [30, 312]], { seed: 7 }); st(x, [[306, 214], [306, 312]], { seed: 9 });
        [122, 214].forEach((px, i) => st(x, [[px, 222], [px, 304]], { seed: 11 + i, w: 1.6 })); [104, 140, 232].forEach((px) => disc(x, px, 256, 3, B));
        const ket = [[52, 204], [58, 166], [98, 166], [104, 204]]; st(x, closeP(ket), { seed: 15 }); Ink.hatchFill(x, [[80, 204], [80, 166], [98, 166], [104, 204]], 1, B, 1.4); st(x, [[58, 172], [44, 164], [48, 178]], { seed: 17, w: 1.8 }); st(x, geo.curve([100, 172], [122, 170], [122, 196], [103, 196], 12), { seed: 19 }); st(x, [[72, 166], [76, 160], [80, 160], [84, 166]], { seed: 21, w: 1.6, retrace: false });
        // the fridge body and what is inside
        const fr = box(330, 40, 190, 272); Ink.hatchShadow(x, fr, 1, 8, 0); st(x, closeP(fr), { seed: 23, w: 3 });
        st(x, closeP(box(340, 50, 170, 250)), { seed: 25, w: 1.6, retrace: false });
        [118, 188, 252].forEach((y, i) => st(x, [[340, y], [510, y]], { seed: 27 + i, w: 1.8 }));
        const milk = [[354, 188], [354, 148], [365, 136], [376, 148], [376, 188]]; st(x, closeP(milk), { seed: 31, w: 1.8 }); st(x, [[354, 148], [376, 148]], { seed: 33, w: 1.4, retrace: false }); Ink.hatchFill(x, box(354, 160, 22, 14), 1, B, 2);
        st(x, [[396, 188], [396, 158], [401, 150], [401, 138], [409, 138], [409, 150], [414, 158], [414, 188], [396, 188]], { seed: 35, w: 1.8 });
        st(x, closeP([[440, 188], [488, 188], [488, 164]]), { seed: 37, w: 1.8 }); disc(x, 470, 182, 2, B); disc(x, 480, 176, 2, B);
        [360, 378, 396, 414].forEach((px, i) => st(x, geo.ellipse(px, 109, 7, 9), { seed: 39 + i, w: 1.5, retrace: false }));
        st(x, geo.ellipse(466, 102, 15, 15), { seed: 45, w: 1.8 }); st(x, [[466, 88], [470, 80]], { seed: 47, w: 1.6, retrace: false });
        st(x, geo.rect(352, 208, 60, 44, 6), { seed: 49, w: 1.8 }); st(x, [[352, 220], [412, 220]], { seed: 51, w: 1.4, retrace: false });
        st(x, geo.ellipse(452, 238, 12, 13), { seed: 53, w: 1.6 }); st(x, geo.ellipse(482, 240, 11, 11), { seed: 55, w: 1.6 });
        const dr = box(346, 262, 158, 34); st(x, closeP(dr), { seed: 57, w: 1.8 }); Ink.hatchFill(x, dr, 1, B, 0.8);
        st(x, [[262, 100], [300, 66], [330, 56]], { seed: 59, w: 1.5, retrace: false });
        st(x, [[676, 150], [660, 170], [660, 312]], { seed: 61, w: 1.5, retrace: false });
        tag(x, 'input', 226, 30, [226, 36], [226, 48]); tag(x, 'output', 806, 190, [796, 170], [776, 150]);
      },
      live(x, sim, now) {
        const th = sim.env.doorA * 2.0, ex = 520 - 190 * Math.cos(th), yo = 24 * Math.sin(th) * (ex > 520 ? 1 : 0.5);
        const P = [[520, 40], [ex, 40 + yo], [ex, 312 + yo], [520, 312]];
        if (Math.abs(ex - 520) > 3) {
          eraseP(x, P); fillP(x, P, 'rgba(120,140,235,0.1)'); st(x, closeP(P), { seed: 71, w: 2.8, amp: 0.3 });
          const f = (u, y) => [ex + (520 - ex) * u, y + yo * (1 - u)];
          if (ex < 520) { st(x, [f(0.1, 120), f(0.1, 200)], { seed: 73, w: 3.4, amp: 0.2 }); if (ex < 400) { st(x, closeP([f(0.45, 80), f(0.75, 80), f(0.75, 112), f(0.45, 112)]), { seed: 75, w: 1.6, retrace: false, amp: 0.2 }); st(x, [f(0.3, 150), f(0.6, 140)], { seed: 77, w: 1.4, color: RD, retrace: false, amp: 0.2 }); } }
          else { [110, 190, 262].forEach((y, i) => st(x, [f(0.12, y), f(0.9, y)], { seed: 79 + i, w: 1.8, amp: 0.2 })); }
        }
        if (sim.env.openSim > 0.5) { text(x, 'door open for', 716, 232, { size: 22 }); text(x, Math.min(99, Math.floor(sim.env.openSim)) + ' s', 716, 272, { size: 36, color: sim.env.openSim >= 60 ? RD : B }); }
      },
      under(x, sim) { glow(x, 425, 150, 190, AMBER, sim.env.doorA * 0.55); },
    },
    // ---- 3: shop front ----
    3: {
      paint(x) {
        st(x, [[20, 300], [840, 300]], { seed: 3, w: 2.4 });
        const wall = box(300, 50, 524, 250); Ink.hatchShadow(x, wall, 1, 8, 0); st(x, closeP(wall), { seed: 5, w: 2.8 });
        const sign = geo.rect(326, 62, 270, 52, 8); fillP(x, sign, 'rgba(120,140,235,0.12)'); st(x, sign, { seed: 7, w: 2.4 }); text(x, 'CORNER SHOP', 461, 98, { size: 28 });
        const door = box(420, 136, 110, 164); Ink.hatchFill(x, door, 1, B, 1.1); st(x, closeP(door), { seed: 9, w: 2.8 });
        const w = box(580, 176, 214, 88); st(x, closeP(w), { seed: 11, w: 2.4 }); st(x, [[687, 176], [687, 264]], { seed: 13, w: 1.6 });
        const sl = box(572, 264, 230, 9); Ink.hatchFill(x, sl, 1, B, 1.8); st(x, closeP(sl), { seed: 15 });
        [[600, 22], [630, 30], [716, 26], [750, 20]].forEach(([px, h], i) => { st(x, [[px, 262], [px, 262 - h], [px + 5, 262 - h - 8], [px + 5, 262 - h - 16], [px + 11, 262 - h - 16], [px + 11, 262 - h - 8], [px + 16, 262 - h], [px + 16, 262]], { seed: 17 + i, w: 1.6, retrace: false }); });
        st(x, geo.ellipse(668, 248, 12, 12), { seed: 23, w: 1.6 }); st(x, [[600, 196], [620, 186]], { seed: 25, w: 1.3, retrace: false }); st(x, [[606, 208], [636, 192]], { seed: 27, w: 1.3, retrace: false });
        const mat = [[384, 303], [458, 303], [448, 318], [372, 318]]; Ink.hatchFill(x, mat, 1, B, 2.2); st(x, closeP(mat), { seed: 29, w: 1.8 });
        // a tree for company
        st(x, [[150, 300], [152, 236]], { seed: 31, w: 3 }); st(x, [[166, 300], [164, 236]], { seed: 33, w: 3 });
        const cr = geo.curve([120, 236], [84, 216], [100, 160], [140, 164], 12).concat(geo.curve([140, 164], [150, 130], [200, 136], [200, 168], 12), geo.curve([200, 168], [236, 176], [232, 232], [196, 236], 12), [[120, 236]]); Ink.hatchFill(x, cr, 1, B, 0.7); st(x, cr, { seed: 35, w: 2.2 });
        tag(x, 'input', 358, 138, [358, 144], [358, 152]); tag(x, 'output', 800, 156, [792, 136], [766, 118]);
      },
      wire(x, sim) {
        const id = sim.parts.in; if (kind(id) !== 'in') return;
        if (id === 'press') st(x, [[358, 236], [364, 290], [388, 306]], { seed: 61, w: 1.5, retrace: false });
        else if (id === 'ldr') { st(x, [[380, 232], [416, 262]], { seed: 61, w: 1.5, retrace: false }); const blocked = sim.env.atDoor; x.save(); x.strokeStyle = rgba(RD, 0.8); x.lineWidth = 2.2; x.setLineDash([7, 6]); x.beginPath(); x.moveTo(528, 262); x.lineTo(blocked ? 476 : 422, 262); x.stroke(); x.restore(); disc(x, 530, 262, 5, RD); }
        else st(x, [[392, 200], [420, 190]], { seed: 61, w: 1.5, retrace: false });
      },
      live(x, sim, now) {
        const E = sim.env;
        // the customers
        E.people.forEach((p) => {
          const a = clamp((478 - p.x) / 30), ph = p.x * 0.09, s = Math.sin(ph) * 10;
          x.save(); x.globalAlpha = a; x.strokeStyle = rgba(B, 0.92); x.lineWidth = 2.8; x.lineCap = 'round'; x.lineJoin = 'round';
          x.beginPath(); x.arc(p.x, 222 + Math.abs(Math.cos(ph)) * 2, 11, 0, 7); x.stroke();
          x.beginPath(); x.moveTo(p.x, 234); x.lineTo(p.x, 270); x.moveTo(p.x, 270); x.lineTo(p.x + s, 300); x.moveTo(p.x, 270); x.lineTo(p.x - s, 300); x.moveTo(p.x, 244); x.lineTo(p.x - s * 0.8, 262); x.moveTo(p.x, 244); x.lineTo(p.x + s * 0.8, 262); x.stroke();
          if (p.bag) { x.strokeRect(p.x + s * 0.8 - 6, 262, 12, 12); }
          x.restore();
        });
        // the door swings inwards as each one passes
        const th = E.doorA * 1.3, ex = 530 - 108 * Math.cos(th), yo = -10 * Math.sin(th);
        const P = [[530, 137], [ex, 137 - yo * 0.4], [ex, 299 + yo], [530, 299]];
        eraseP(x, P); fillP(x, P, 'rgba(120,140,235,0.14)'); st(x, closeP(P), { seed: 71, w: 2.4, amp: 0.25 });
        if (E.doorA < 0.5) { st(x, closeP([[436, 152], [514, 152], [514, 226], [436, 226]]), { seed: 73, w: 1.6, retrace: false }); st(x, [[434, 240], [434, 262]], { seed: 75, w: 3 }); }
        text(x, 'really walked in:', 30, 52, { size: 22, align: 'left' });
        for (let i = 0; i < E.entered; i++) { const gx = 36 + i * 11 + Math.floor(i / 5) * 12; if (i % 5 === 4) st(x, [[gx - 50, 96], [gx - 4, 70]], { seed: 81 + i, w: 2.4 }); else st(x, [[gx, 66], [gx + 1, 98]], { seed: 81 + i, w: 2.4 }); }
      },
    },
    // ---- 4: greenhouse ----
    4: {
      paint(x, env) {
        st(x, [[20, 300], [840, 300]], { seed: 3, w: 2.4 });
        if (env.dark) moon(x, 96, 84); else sun(x, 96, 84);
        const base = box(220, 270, 540, 30); Ink.hatchFill(x, base, 1, B, 1.5); st(x, closeP(base), { seed: 5, w: 2.4 });
        st(x, [[220, 270], [220, 150], [490, 52], [760, 150], [760, 270]], { seed: 7, w: 2.8 }); st(x, [[220, 150], [760, 150]], { seed: 9, w: 2.2 });
        [[310, 117], [400, 85], [580, 85], [670, 117]].forEach(([px, y], i) => st(x, [[px, 270], [px, y]], { seed: 11 + i, w: 1.6 })); st(x, [[490, 150], [490, 270]], { seed: 17, w: 1.6 });
        [[236, 176, 250, 160], [596, 180, 614, 160], [700, 196, 724, 168], [706, 208, 716, 196]].forEach(([a, b, c, d], i) => st(x, [[a, b], [c, d]], { seed: 19 + i, w: 1.2, retrace: false }));
        [404, 474, 544].forEach((px, i) => { const pot = [[px - 16, 240], [px + 16, 240], [px + 11, 268], [px - 11, 268]]; eraseP(x, pot); Ink.hatchFill(x, pot, 1, B, 1.8); st(x, closeP(pot), { seed: 25 + i }); });
        st(x, [[376, 269], [572, 269]], { seed: 31, w: 2.2 });
        // thermometer
        st(x, [[684, 250], [684, 174], [690, 167], [696, 174], [696, 250]], { seed: 33, w: 1.8 }); st(x, geo.ellipse(690, 258, 11, 11, -1.1, -1.1 + TAU - 0.9), { seed: 35, w: 1.8 });
        tag(x, 'input', 150, 216, [186, 210], [234, 212]); tag(x, 'output', 640, 62, [606, 62], [548, 92]);
      },
      live(x, sim, now) {
        const E = sim.env, T = E.temp, hotA = clamp((T - 24) / 8);
        x.save(); x.fillStyle = rgba([225, 50, 50], 0.8); x.beginPath(); x.arc(690, 258, 7.5, 0, 7); x.fill(); const h = 10 + clamp((T - 10) / 30) * 66; x.fillRect(687, 252 - h, 6, h + 2); x.restore();
        text(x, Math.round(T) + ' °C', 690, 148, { size: 24, color: T > 25 ? RD : B });
        if (hotA > 0.05) { x.save(); x.strokeStyle = rgba(RD, 0.55 * hotA); x.lineWidth = 2.2; [356, 440, 510, 612, 646].forEach((px, i) => { x.beginPath(); for (let y = 232; y >= 168; y -= 4) { const q = px + Math.sin(y * 0.16 + now * 6 + i * 1.9) * 5; if (y === 232) x.moveTo(q, y); else x.lineTo(q, y); } x.stroke(); }); x.restore(); }
        // tomato plants droop when it is too hot
        const w = E.wilt;
        [404, 474, 544].forEach((px, i) => {
          const tipX = px + w * 30 * (i % 2 ? -1 : 1), tipY = 168 + w * 40, stem = geo.curve([px, 240], [px, 214], [px + (tipX - px) * 0.3, 190], [tipX, tipY], 14);
          st(x, stem, { seed: 41 + i, w: 2.2, color: GR, amp: 0.2 });
          [[4, -1], [8, 1], [12, -1]].forEach(([k, d], j) => { const q = stem[k], lx = q[0] + d * 20, ly = q[1] - 8 + w * 20; st(x, [q, [(q[0] + lx) / 2, q[1] - 10 + w * 12], [lx, ly], [(q[0] + lx) / 2, q[1] + 2 + w * 8], q], { seed: 51 + i * 3 + j, w: 1.6, color: GR, amp: 0.2, retrace: false }); });
          disc(x, stem[6][0] + 7, stem[6][1] + 8, 5, RD, 0.75); disc(x, stem[10][0] - 7, stem[10][1] + 9, 4.5, RD, 0.75);
        });
        if (sim.outOn && sim.parts.out === 'motor') { x.save(); x.strokeStyle = rgba(B, 0.7); x.lineWidth = 2; x.setLineDash([10, 12]); x.lineDashOffset = -now * 90; [-16, 0, 16].forEach((dy) => { x.beginPath(); x.moveTo(556, 112 + dy); x.lineTo(604, 112 + dy * 1.6); x.stroke(); }); x.restore(); }
      },
    },
    // ---- 0: free-build test bench ----
    0: {
      paint(x) {
        st(x, [[30, 268], [830, 268]], { seed: 3, w: 2.6 }); const edge = box(30, 268, 800, 12); Ink.hatchFill(x, edge, 1, B, 1.6); st(x, closeP(edge), { seed: 5 });
        st(x, [[70, 280], [64, 332]], { seed: 7, w: 2.6 }); st(x, [[790, 280], [796, 332]], { seed: 9, w: 2.6 });
        const chip = box(376, 146, 108, 64); Ink.hatchShadow(x, chip, 1, 6, 6); fillP(x, chip, 'rgba(60,75,170,0.16)'); Ink.hatchFill(x, chip, 1, B, 1.4); st(x, closeP(chip), { seed: 11, w: 2.6 });
        for (let i = 0; i < 5; i++) { st(x, [[390 + i * 20, 146], [390 + i * 20, 132]], { seed: 13 + i, w: 2.2 }); st(x, [[390 + i * 20, 210], [390 + i * 20, 224]], { seed: 19 + i, w: 2.2 }); }
        st(x, geo.ellipse(376, 178, 7, 7, -Math.PI / 2, Math.PI / 2), { seed: 25, w: 1.6 });
        text(x, 'microcontroller', 430, 250, { font: 'hand', size: 22 });
        [[250, 366], [494, 610]].forEach(([a, b], i) => { st(x, [[a, 178], [b, 178]], { seed: 27 + i, w: 2.4 }); st(x, [[b - 14, 168], [b, 178], [b - 14, 188]], { seed: 31 + i, w: 2.4 }); });
        text(x, 'TEST BENCH', 430, 56, { size: 30 });
        tag(x, 'input', 172, 92, [172, 99], [172, 114]); tag(x, 'output', 688, 92, [688, 99], [688, 114]);
      },
      live(x, sim, now) {
        if (sim.trig) { const u = (now * 1.6) % 1; disc(x, 256 + u * 100, 178, 6, RD, 0.9); }
        if (sim.outOn) { const u = (now * 1.6 + 0.4) % 1; disc(x, 500 + u * 100, 178, 6, RD, 0.9); }
      },
    },
  };

  Book.page({
    id: 'p08',
    title: 'Design a system',
    build(ui, root) {
      const css = document.createElement('style');
      css.textContent = `
        .p08-bench{position:relative;margin:0 0 calc(var(--R)*1.4);padding:12px 14px 14px;background:rgba(251,250,245,.9)}
        .p08-tabs{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 10px}
        .p08-tab{font:700 16px Fredoka;color:var(--ink);background:#fff;border:2px solid rgba(30,46,150,.4);border-radius:12px 12px 4px 4px;min-height:46px;padding:6px 12px;cursor:pointer;line-height:1.2;touch-action:manipulation}
        .p08-tab.on{background:var(--ink);color:#fff;border-color:var(--ink)}
        .p08-tab .tk{color:var(--green);margin-left:4px}.p08-tab.on .tk{color:#9df0b6}
        .p08-brief{display:flex;gap:12px;align-items:center;background:rgba(255,236,120,.45);border-left:5px solid rgba(240,200,60,.9);padding:8px 14px;margin:0 0 12px;line-height:1.45;font-size:19px;transform:rotate(-.3deg)}
        .p08-brief .n{font:700 15px Fredoka;color:var(--red);white-space:nowrap;letter-spacing:.06em}
        .p08-diag{display:flex;align-items:stretch;gap:4px;margin:0 0 12px}
        .p08-slot{flex:1 1 0;min-width:0;border:2.5px dashed rgba(30,46,150,.5);border-radius:12px;background:#fff;padding:5px 6px 6px;text-align:center;cursor:pointer;min-height:118px;display:flex;flex-direction:column;align-items:center;touch-action:manipulation;position:relative}
        .p08-slot.full{border-style:solid;border-color:var(--ink)}
        .p08-slot.hot{background:#eef1ff;box-shadow:0 0 0 3px rgba(30,46,150,.18)}
        .p08-slot.sig{background:#fff3c4}
        .p08-slot .cap{font:700 14px Fredoka;letter-spacing:.1em;color:var(--red);line-height:20px}
        .p08-slot .hold{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:15px;line-height:1.3;color:rgba(30,46,150,.6)}
        .p08-slot .hold b{font:600 16px Fredoka;color:var(--ink);line-height:1.2}
        .p08-slot .stat{font:600 15px Fredoka;color:var(--ink);line-height:20px;min-height:20px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
        .p08-ic{width:76px;height:60px;display:block}
        .p08-arr{flex:0 0 34px;display:flex;align-items:center;justify-content:center;font:700 30px Fredoka;color:var(--ink);opacity:.55}
        .p08-arr.sig{color:var(--red);opacity:1}
        .p08-tray{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px;margin:0 0 6px}
        .p08-card{display:flex;align-items:center;gap:4px;background:#fff;border:2px solid rgba(30,46,150,.4);border-radius:10px;padding:2px 8px 2px 2px;min-height:64px;cursor:pointer;font:600 15.5px Fredoka;color:var(--ink);text-align:left;line-height:1.15;touch-action:manipulation}
        .p08-card .p08-ic{flex:0 0 62px;width:62px;height:49px}
        .p08-card.picked{border-color:var(--ink);background:#e8ecff;transform:rotate(-1.5deg) scale(1.04);box-shadow:0 4px 10px rgba(30,46,150,.25)}
        .p08-card.used{opacity:.42}
        .p08-row{display:flex;flex-wrap:wrap;gap:10px;align-items:center}
        .p08-row .btn{margin-top:0}.p08-pokes{flex:1 1 auto}
        .p08-go{font-size:20px!important;padding:10px 26px!important}
        .p08-tip{font-size:16px;color:rgba(30,46,150,.75);line-height:1.4;flex:1 1 220px}
        .p08-stagewrap{position:relative;margin:0 0 8px}
        .p08-stamp{position:absolute;right:10px;top:8px;font:700 26px Fredoka;letter-spacing:.04em;padding:2px 14px;border:4px solid;border-radius:10px;transform:rotate(-7deg) scale(0);transition:transform .25s cubic-bezier(.3,1.6,.5,1);background:rgba(251,250,245,.85);pointer-events:none}
        .p08-stamp.on{transform:rotate(-7deg) scale(1)}.p08-stamp.good{color:var(--green)}.p08-stamp.bad{color:var(--red)}
        .p08-poke{font:700 16.5px Fredoka;color:var(--red);background:#fff;border:2px solid var(--red);border-radius:12px;min-height:48px;padding:8px 14px;cursor:pointer;line-height:1.2;box-shadow:0 3px 0 rgba(120,20,26,.3);touch-action:manipulation}
        .p08-poke:active{transform:translateY(2px);box-shadow:0 1px 0 rgba(120,20,26,.3)}
        .p08-poke.pulse{animation:p08p 1.1s ease-in-out infinite}
        @keyframes p08p{50%{box-shadow:0 3px 0 rgba(120,20,26,.3),0 0 0 7px rgba(178,28,38,.18)}}
        .p08-hint{font-size:17px;line-height:1.4;margin:8px 0 0;color:rgba(30,46,150,.85)}.p08-hint:empty{display:none}
        .p08-bench .fb{font-size:18px}
        .p08-bench.recall .stat,.p08-bench.recall .fb,.p08-bench.recall .p08-stagewrap,.p08-bench.recall .p08-hint{filter:blur(7px);opacity:.5;pointer-events:none}
        @media (max-width:700px){.p08-card{font-size:14.5px}.p08-slot .hold b{font-size:15px}.p08-brief{font-size:18px}}`;
      root.appendChild(css);

      ui.h('Design a system');
      ui.p('Now <b>you</b> are the designer. For each brief, build a system: tap a card, then tap the box it belongs in. <b>INPUT → PROCESS → OUTPUT.</b> Then press <b>TEST</b> and poke the scene to see whether it really works.');
      ui.p('If it fails, watch <b>why</b>, change a part and test again. <span class="key">Your first test of each brief is the one that is marked</span>, so think before you press!', 'small');

      const recs = {}; [1, 2, 3, 4].forEach((b) => (recs[b] = ui.record('p08.brief' + b, { label: `Brief ${b}: ${BR[b].short} (input → process → output)`, type: 'build', max: 1 })));
      recs[0] = ui.record('p08.free', { label: 'Free build (optional): systems tried', type: 'explore', max: 0 });
      const saved = (b) => recs[b].get() || {};
      const ST = {}; [1, 2, 3, 4, 0].forEach((b) => (ST[b] = { sel: Object.assign({ in: null, proc: null, out: null }, saved(b).sel || {}), tries: (saved(b).tries || []).slice(), mis: (saved(b).mis || '').split(',').filter(Boolean) }));
      const solved = (b) => ST[b].tries.some((t) => t.ok);
      let cur = [1, 2, 3, 4].find((b) => !solved(b)) || 1, picked = null, testing = false, sim = null;

      const bench = ui.el('div', 'p08-bench'); requestAnimationFrame(() => Ink.frame(bench, { w: 2.4 }));
      const tabs = ui.el('div', 'p08-tabs', '', bench);
      const tabEls = {}; [1, 2, 3, 4, 0].forEach((b) => { const t = ui.el('button', 'p08-tab', '', tabs); t.type = 'button'; tabEls[b] = t; t.onclick = () => { if (b === cur) return; Book.sfx('paper', { gain: 0.3, dur: 0.2 }); cur = b; picked = null; stopTest(); sync(); }; });
      const brief = ui.el('div', 'p08-brief', '', bench);
      const diag = ui.el('div', 'p08-diag', '', bench);
      const slots = {}, arrows = [];
      ['in', 'proc', 'out'].forEach((k, i) => {
        if (i) arrows.push(ui.el('div', 'p08-arr', '➜', diag));
        const s = ui.el('div', 'p08-slot', `<div class="cap">${KINDNAME[k]}</div><div class="hold"></div><div class="stat"></div>`, diag);
        s.setAttribute('role', 'button'); s.dataset.k = k; slots[k] = s;
        s.onclick = () => {
          const sel = ST[cur].sel;
          if (testing) { stopTest(); sync(); return; }
          if (picked) { ['in', 'proc', 'out'].forEach((q) => { if (sel[q] === picked) sel[q] = null; }); sel[k] = picked; picked = null; Book.scribble(0.14); Book.sfx('tock', { gain: 0.35 }); }
          else if (sel[k]) { sel[k] = null; Book.sfx('tick', { gain: 0.4 }); }
          sync();
        };
      });
      const tray = ui.el('div', 'p08-tray', '', bench);
      const cardEls = {};
      ORDER.forEach((id) => {
        const c = ui.el('button', 'p08-card', '', tray); c.type = 'button'; c.appendChild(iconCanvas(id)); ui.el('span', '', PARTS[id].name, c); cardEls[id] = c;
        c.onclick = () => { picked = picked === id ? null : id; Book.sfx('tick', { gain: 0.5 }); sync(); };
      });
      const row = ui.el('div', 'p08-row', '', bench);
      const goBtn = ui.el('button', 'btn p08-go', 'TEST IT ▸', row); goBtn.type = 'button';
      const tip = ui.el('span', 'p08-tip', '', row);
      // --- test area ---
      const testWrap = ui.el('div', '', '', bench); testWrap.style.display = 'none';
      const stageWrap = ui.el('div', 'p08-stagewrap', '', testWrap);
      const S = Stage(stageWrap, W, Hh);
      const stamp = ui.el('div', 'p08-stamp', '', stageWrap);
      const row2 = ui.el('div', 'p08-row', '', testWrap);
      const pokes = ui.el('div', 'p08-row p08-pokes', '', row2);
      const chBtn = ui.el('button', 'btn ghost', '◂ Change a part', row2); chBtn.type = 'button';
      const nextBtn = ui.el('button', 'btn', 'Next brief ▸', row2); nextBtn.type = 'button';
      const hint = ui.el('p', 'p08-hint', '', testWrap);
      const fb = ui.el('div', 'fb', '', testWrap);
      chBtn.onclick = () => { stopTest(); sync(); };
      nextBtn.onclick = () => { const n = [1, 2, 3, 4].find((b) => !solved(b)); cur = n == null ? 0 : n; picked = null; stopTest(); sync(); bench.scrollIntoView({ block: 'start', behavior: 'smooth' }); };

      const comboText = (c) => ['in', 'proc', 'out'].map((k) => PARTS[c[k]].name).join(' → ');
      function commit(b) {
        const s = ST[b];
        if (b === 0) { recs[0].set({ answer: s.tries.map((t) => t.c).join('; '), correct: null, tries: s.tries, sel: s.sel }); return; }
        const ok = solved(b);
        recs[b].set({ answer: s.tries.map((t, i) => `${i + 1}) ${t.c} ${t.ok ? '✓ works' : '✗ fails'}`).join('; '), correct: ok, score: ok ? 1 : 0, max: 1, mis: s.mis.join(','), tries: s.tries, sel: s.sel });
      }
      const setStat = (k, t) => { const e = slots[k].querySelector('.stat'); if (e.textContent !== t) e.textContent = t; };

      function sync() {
        const sel = ST[cur].sel;
        [1, 2, 3, 4, 0].forEach((b) => { tabEls[b].innerHTML = (b ? b + '. ' : '★ ') + BR[b].tab + (b && solved(b) ? '<span class="tk">✓</span>' : ''); tabEls[b].classList.toggle('on', b === cur); });
        brief.innerHTML = `<span class="n">${cur ? 'BRIEF ' + cur : 'YOUR IDEA'}</span><span>${BR[cur].text}</span>`;
        ['in', 'proc', 'out'].forEach((k) => {
          const s = slots[k], h = s.querySelector('.hold'), id = sel[k];
          s.classList.toggle('full', !!id); s.classList.toggle('hot', !!picked && !testing);
          if (s._id !== id) { s._id = id; h.innerHTML = ''; if (id) { h.appendChild(iconCanvas(id)); ui.el('b', '', PARTS[id].name, h); } else h.textContent = 'tap a card, then tap here'; }
          if (!testing) { setStat(k, ''); s.classList.remove('sig'); }
        });
        if (!testing) arrows.forEach((a) => a.classList.remove('sig'));
        ORDER.forEach((id) => { cardEls[id].classList.toggle('picked', picked === id); cardEls[id].classList.toggle('used', Object.values(sel).includes(id) && picked !== id); });
        const full = sel.in && sel.proc && sel.out;
        tray.style.display = row.style.display = testing ? 'none' : ''; testWrap.style.display = testing ? '' : 'none';
        goBtn.disabled = !full;
        tip.textContent = picked ? 'Now tap the box where "' + PARTS[picked].name + '" belongs.' : full ? 'Happy with it? Press TEST. (Tap a box to empty it.)' : 'Fill all three boxes, then test.';
      }

      // ------------------------------------------------------------------ the test ------------------------------------------------------------------
      let layers = {};
      S.onFonts = () => { layers = {}; };
      function stopTest() { testing = false; sim = null; stamp.className = 'p08-stamp'; }
      function startTest() {
        const b = cur, s = ST[b], c = Object.assign({}, s.sel);
        if (!(c.in && c.proc && c.out)) return;
        const fails = b ? judge(b, c) : [], ok = !fails.length, ct = comboText(c);
        if (!s.tries.length || s.tries[s.tries.length - 1].c !== ct) s.tries.push({ c: ct, ok: b ? ok : null });
        fails.forEach(([m]) => { if (!s.mis.includes(m)) s.mis.push(m); });
        commit(b);
        testing = true; picked = null;
        sim = { b, parts: c, ok, fails, t: 0, trig: false, prev: false, count: 0, out: false, outOn: false, held: 0, hold: 0, timedOut: false, pulse: 0, spin: 0.4, ev: 0, verdict: false, beeps: 0, nextBeep: 0, lastOut: false,
          valid: { in: kind(c.in) === 'in', proc: kind(c.proc) === 'proc', out: kind(c.out) === 'out' },
          env: { dark: false, darkA: 0, hot: false, temp: b === 2 ? 4 : 18, wilt: 0, door: false, doorA: 0, openSim: 0, people: [], entered: 0, atDoor: false, direct: false, directUntil: 0 } };
        sim.natural = sim.valid.in && BR[b].natural.includes(c.in);
        fb.className = 'fb'; fb.innerHTML = ''; stamp.className = 'p08-stamp'; nextBtn.style.display = 'none';
        hint.textContent = BR[b].hint;
        buildPokes(); sync(); Book.sfx('stamp', { gain: 0.5 }); S.go();
        requestAnimationFrame(() => { const r = bench.getBoundingClientRect(), sh = bench.closest('.sheet'); if (sh && (r.top < 0 || r.bottom > innerHeight - 60)) sh.scrollTop += r.top - 12; });
      }
      goBtn.onclick = startTest;
      function buildPokes() {
        pokes.innerHTML = ''; const E = sim.env, b = sim.b;
        const add = (label, fn, pulse) => { const p = ui.el('button', 'p08-poke' + (pulse ? ' pulse' : ''), '', pokes); p.type = 'button'; const lab = () => (p.textContent = typeof label === 'function' ? label() : label); lab(); p.onclick = () => { p.classList.remove('pulse'); fn(); lab(); Book.sfx('tick', { gain: 0.5 }); S.go(); }; return p; };
        if (b === 1) add(() => (E.dark ? 'Make it light' : 'Make it dark'), () => { E.dark = !E.dark; }, true);
        if (b === 2) add(() => (E.door ? 'Shut the door' : 'Open the fridge door'), () => { E.door = !E.door; Book.sfx(E.door ? 'pop' : 'thud', { gain: 0.4 }); }, true);
        if (b === 3) add('Walk a customer in', () => { if (E.people.length < 6) E.people.push({ x: Math.min(24, ...E.people.map((p) => p.x - 62)), bag: (E.entered + E.people.length) % 2 === 1 }); }, true);
        if (b === 4) { add(() => (E.hot ? 'Cool it down' : 'Heat it up'), () => { E.hot = !E.hot; }, true); add(() => (E.dark ? 'Make it light' : 'Make it dark'), () => { E.dark = !E.dark; }); }
        if (sim.valid.in && !sim.natural) { const D = DIRECT[sim.parts.in]; add(() => (Array.isArray(D.label) ? D.label[E.direct ? 1 : 0] : D.label), () => { if (D.hold) { E.direct = true; E.directUntil = sim.t + D.hold; } else E.direct = !E.direct; }, b === 0); }
      }
      function inWord() {
        const id = sim.parts.in, b = sim.b, tr = sim.trig;
        if (!sim.valid.in) return '(senses nothing)';
        if (!sim.natural) return DIRECT[id].w[tr ? 1 : 0];
        if (id === 'therm') return Math.round(sim.env.temp) + ' °C';
        if (id === 'ldr') return b === 3 ? (tr ? 'beam blocked' : 'beam shining') : (b === 1 ? !tr : tr) ? 'senses: light' : 'senses: dark';
        if (id === 'reed') return tr ? 'magnet gone' : 'magnet near';
        if (id === 'press' && b === 3) return tr ? 'stepped on' : 'no force';
        return tr ? 'let go' : 'held in by door';
      }
      function procWord() {
        const p = sim.parts.proc;
        if (!sim.valid.proc) return '(not a process)';
        if (p === 'decide') return sim.trig ? 'YES → output ON' : 'NO → output off';
        if (p === 'count') return 'count = ' + sim.count;
        if (sim.b === 2) return sim.held >= 60 ? '60 s up → ON' : sim.held > 0 ? 'timing… ' + Math.floor(sim.held) + ' s' : 'waiting';
        return sim.hold > 0 ? 'ON for ' + Math.ceil(sim.hold) + ' s more' : sim.timedOut ? "time's up → off" : 'waiting';
      }
      function verdict() {
        sim.verdict = true; const b = sim.b;
        if (sim.ok) {
          const ex = (EXTRA[b] || {}), extra = [ex[sim.parts.in], ex[sim.parts.out]].filter(Boolean).join(' ');
          fb.className = 'fb on good'; fb.innerHTML = '✓ ' + BR[b].win + (extra ? ' <span class="small">' + extra + '</span>' : '');
          stamp.textContent = 'IT WORKS!'; stamp.className = 'p08-stamp on good'; Book.sfx('success', { gain: 0.45 });
          nextBtn.style.display = ''; nextBtn.textContent = [1, 2, 3, 4].every(solved) ? 'Try a free build ▸' : 'Next brief ▸';
          hint.textContent = '';
        } else {
          const more = sim.fails.length - 1;
          fb.className = 'fb on bad'; fb.innerHTML = '✗ ' + sim.fails[0][1] + (more ? ` <span class="small">(Fix this first: ${more === 1 ? 'one more part needs' : more + ' more parts need'} another look too.)</span>` : '');
          stamp.textContent = 'NOT YET…'; stamp.className = 'p08-stamp on bad'; Book.sfx('error', { gain: 0.4 });
          hint.textContent = '';
        }
        sync();
      }

      S.render = (dt, now) => {
        if (!testing || !sim) return false;
        const E = sim.env, b = sim.b, c = sim.parts, ease = (v, to, r) => v + (to - v) * Math.min(1, dt * r);
        sim.t += dt;
        // ---- the world ----
        if (E.direct && E.directUntil && sim.t > E.directUntil) { E.direct = false; E.directUntil = 0; }
        E.darkA = ease(E.darkA, E.dark ? 1 : 0, 5); E.doorA = b === 2 ? ease(E.doorA, E.door ? 1 : 0, 6) : E.doorA;
        if (b === 2) E.openSim = E.door ? E.openSim + dt * 12 : 0;
        if (b === 3) { E.atDoor = false; let near = false; E.people.forEach((p) => { p.x += dt * 150; if (p.x > 412 && p.x < 444) E.atDoor = true; if (p.x > 386 && p.x < 470) near = true; }); const n = E.people.length; E.people = E.people.filter((p) => p.x < 478); if (E.people.length < n) { E.entered += n - E.people.length; } E.doorA = ease(E.doorA, near ? 1 : 0, 9); }
        if (b === 4) { const fan = sim.outOn && c.out === 'motor'; E.temp = ease(E.temp, (E.hot ? 34 : 18) - (fan ? 5 : 0), 0.9); E.wilt = ease(E.wilt, fan ? 0 : clamp((E.temp - 27) / 5), 1.2); }
        // ---- input ----
        let tr = false;
        if (sim.valid.in) {
          if (!sim.natural) tr = E.direct;
          else if (b === 1) tr = E.dark;
          else if (b === 2) tr = E.door && E.doorA > 0.25;
          else if (b === 3) tr = E.atDoor;
          else if (b === 4) tr = c.in === 'therm' ? E.temp > 25 : !E.dark;
        }
        const rising = tr && !sim.prev; sim.prev = tr; sim.trig = tr;
        // ---- process ----
        let out = false;
        if (sim.valid.proc) {
          if (c.proc === 'decide') out = tr;
          else if (c.proc === 'count') { if (rising) { sim.count++; sim.pulse = 0.5; Book.sfx('tick', { gain: 0.6 }); } sim.pulse -= dt; out = sim.pulse > 0; }
          else if (b === 2) { sim.held = tr ? sim.held + dt * 12 : 0; out = sim.held >= 60; }
          else { if (rising) { sim.hold = 10; sim.timedOut = false; } if (sim.hold > 0) { sim.hold -= dt * 4; if (sim.hold <= 0) { sim.hold = 0; sim.timedOut = true; } } if (!tr && sim.hold <= 0) sim.timedOut = false; out = sim.hold > 0; }
        }
        sim.out = out; sim.outOn = out && sim.valid.out;
        // ---- output sounds ----
        if (sim.outOn !== sim.lastOut) { sim.lastOut = sim.outOn; if (sim.outOn) { sim.beeps = 0; sim.nextBeep = 0; if (c.out === 'lamp' || c.out === 'motor') Book.sfx('click', { gain: 0.9 }); } }
        if (sim.outOn && sim.t >= sim.nextBeep && sim.beeps < 10) { if (c.out === 'buzz') { tone(1175, 0.2, 'square', 0.07); sim.nextBeep = sim.t + 0.42; sim.beeps++; } else if (c.out === 'spk') { tone(sim.beeps % 2 ? 660 : 880, 0.3, 'triangle', 0.22); sim.nextBeep = sim.t + 0.32; sim.beeps++; } }
        if (sim.outOn && c.out === 'motor') sim.spin += dt * 16;
        // ---- has the student seen enough for a verdict? ----
        if (b && !sim.verdict) {
          if (b === 1) sim.ev = E.dark ? sim.ev + dt : 0; else if (b === 2) sim.ev = E.door ? sim.ev + dt : 0; else if (b === 3) sim.ev = E.entered >= 3 && !E.people.length ? sim.ev + dt : 0; else sim.ev = E.hot ? sim.ev + dt : 0;
          if (sim.ev >= { 1: 3.6, 2: 5.8, 3: 0.9, 4: 4 }[b]) verdict();
        }
        // ---- the live block diagram ----
        setStat('in', inWord()); setStat('proc', procWord());
        const n = sim.valid.proc && c.proc === 'count' ? sim.count : sim.out ? 1 : 0;
        setStat('out', !sim.valid.out ? '(gives nothing out)' : c.out === 'disp' ? 'shows ' + n : sim.outOn ? 'ON' : 'off');
        slots.in.classList.toggle('sig', tr); slots.proc.classList.toggle('sig', sim.valid.proc && (out || (c.proc === 'timer' && (sim.held > 0 || sim.hold > 0)))); slots.out.classList.toggle('sig', sim.outOn);
        arrows[0].classList.toggle('sig', tr); arrows[1].classList.toggle('sig', out);
        // ---- draw ----
        const x = S.ctx, sc = SCENES[b], key = b + (E.dark ? 'd' : 'l');
        const lampOn = sim.outOn && c.out === 'lamp', [ix, iy] = BR[b].inSpot, [ox, oy] = BR[b].outSpot, s = b === 0 ? 2.1 : 1.5;
        if (!layers[key]) { LW = 1; layers[key] = S.layer((lx) => { sc.paint(lx, E); [[ix, iy], [ox, oy]].forEach(([cx, cy]) => eraseP(lx, geo.rect(cx - 36 * s, cy - 28 * s, 72 * s, 58 * s, 10))); }); }
        if (sc.under) sc.under(x, sim);
        if (lampOn) glow(x, ox, oy - 12, b === 0 ? 150 : 190, AMBER, 1);
        S.blit(layers[key]);
        LW = 1; if (sc.wire) sc.wire(x, sim);
        sc.live(x, sim, now);
        // the chosen input and output, drawn where they are fitted
        const phys = sim.valid.in && (sim.natural && (b === 2 || b === 3) && ['micro', 'push', 'press', 'reed'].includes(c.in) && !(c.in === 'press' && b === 3) ? !tr : (c.in === 'ldr' ? false : tr));
        drawPart(x, c.in, ix, iy, s, { on: phys, now, icon: c.in === 'reed' && phys });
        drawPart(x, c.out, ox, oy, s, { on: sim.outOn, now, n: sim.valid.out && c.out === 'disp' ? n : null, spin: sim.spin });
        if (sim.valid.in && tr) { x.save(); x.strokeStyle = rgba(RD, 0.5 + 0.4 * Math.sin(now * 9)); x.lineWidth = 3; x.setLineDash([6, 7]); path(x, geo.rect(ix - 38 * s, iy - 30 * s, 76 * s, 62 * s, 12)); x.stroke(); x.restore(); }
        if (b === 1 || b === 4) darkness(x, E.darkA, lampOn ? [[ox, oy - 8, 250, 1]] : []);
        return true;
      };

      sync();

      // ------------------------------------------------------------------ written answer ------------------------------------------------------------------
      ui.p('Finally, explain one of your systems in words. <span class="small">(The test results blur while you write.)</span>');
      const wr = ui.write({
        id: 'p08.explain', label: 'Describe the input, process and output of one system', marks: 3, lines: 5,
        q: 'Choose <b>one</b> of the systems you built. Describe its <b>input</b>, its <b>process</b> and its <b>output</b>, and say <b>what each one does</b>.',
        scheme: ['I named a suitable <b>input</b> device and said what it senses (for example light, temperature, or a door opening)', 'I said what the <b>process</b> does: it times, counts or decides', 'I named a suitable <b>output</b> device and said what it gives (light, sound, movement or a number on show)'],
        model: 'For a different system, a doorbell: the input is a push switch, which senses a person pressing it. The process is a timer: the microcontroller keeps the sound on for a set time. The output is a buzzer, which gives sound so the people indoors can hear it.',
      });
      const ta = wr.querySelector('textarea'), wb = wr.querySelector('.btn');
      ta.addEventListener('focus', () => { if (!wr.querySelector('.scheme.on')) bench.classList.add('recall'); });
      ta.addEventListener('blur', () => { if (!ta.value.trim()) bench.classList.remove('recall'); });
      wb.addEventListener('click', () => setTimeout(() => { if (wr.querySelector('.scheme.on')) bench.classList.remove('recall'); }, 30));
    },
  });
})();
