// Page 8 — Choose the material. Six design briefs: the student picks any material from the lesson and presses TEST;
// a pen-drawn scene then shows it working or failing in a way that shows why (every test is recorded, every
// sensible answer is accepted). Ends with a 3-mark written answer on CFRP bike frames.
(function () {
  'use strict';
  const B = Ink.BLUE, RD = Ink.RED, GR = Ink.GREEN, rgba = Ink.rgba, geo = Ink.geo;
  const LABF = (s) => `600 ${s}px Fredoka, "Arial Rounded MT Bold", system-ui, sans-serif`;
  const HANDF = (s) => `400 ${s}px "Gloria Hallelujah", "Comic Sans MS", cursive`;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = (u) => { u = clamp(u); return u * u * (3 - 2 * u); };
  const TAU = Math.PI * 2, W = 860, HH = 300, PAPER = 'rgba(251,250,245,.97)', AMBER = [255, 176, 40];
  const st = (x, pts, o) => Ink.stroke(x, pts, Object.assign({ amp: 0.5 }, o));
  function text(x, s, px, py, o = {}) {
    x.save(); x.font = (o.font === 'hand' ? HANDF : LABF)(o.size || 22);
    x.fillStyle = rgba(o.color || B, o.a ?? 0.92); x.textAlign = o.align || 'center'; x.textBaseline = 'alphabetic';
    x.translate(px, py); if (o.rot) x.rotate(o.rot); x.fillText(s, 0, 0); x.restore();
  }
  const path = (x, P) => { x.beginPath(); P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.closePath(); };
  function paper(x, P, style = PAPER) { x.save(); x.globalCompositeOperation = 'source-over'; x.fillStyle = style; path(x, P); x.fill(); x.restore(); }
  const tint = (x, P, style) => { x.save(); x.fillStyle = style; path(x, P); x.fill(); x.restore(); };
  const box = (x0, y0, w, h) => [[x0, y0], [x0 + w, y0], [x0 + w, y0 + h], [x0, y0 + h]];
  const closeP = (P) => P.concat([P[0]]);
  const disc = (x, cx, cy, r, col, a = 0.9) => { x.save(); x.fillStyle = rgba(col, a); x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill(); x.restore(); };
  const glow = (x, cx, cy, r, col, a) => {
    if (a <= 0.01) return; const g = x.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, rgba(col, 0.9 * a)); g.addColorStop(0.5, rgba(col, 0.35 * a)); g.addColorStop(1, rgba(col, 0));
    x.save(); x.fillStyle = g; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill(); x.restore();
  };
  const wheel = (x, cx, cy, r, seed, ry) => { const E = geo.ellipse(cx, cy, r, ry || r); paper(x, E); Ink.hatchFill(x, E, 1, B, 2); st(x, E, { w: 2.6, seed, amp: 0.3 }); disc(x, cx, cy, r * 0.28, B); };
  const zig = (x, a, b, n, amp, o) => { const P = []; for (let i = 0; i <= n; i++) { const u = i / n, px = lerp(a[0], b[0], u), py = lerp(a[1], b[1], u), s = i % 2 ? amp : -amp, dx = b[1] - a[1], dy = a[0] - b[0], d = Math.hypot(dx, dy) || 1; P.push([px + (dx / d) * s * (i && i < n ? 1 : 0), py + (dy / d) * s * (i && i < n ? 1 : 0)]); } st(x, P, Object.assign({ color: RD, w: 2.4, amp: 0.2 }, o)); };

  // ---------------------------------------------------------------------------------------------------------
  // the materials (everything taught in this workbook) and the six briefs
  // ---------------------------------------------------------------------------------------------------------
  const M = {
    graphene: 'Graphene', foam: 'Metal foam', ti: 'Titanium', sma: 'Shape memory alloy (nitinol)', thermo: 'Thermochromic pigment', photo: 'Photochromic pigment',
    concrete: 'Concrete', rc: 'Reinforced concrete', grp: 'GRP', cfrp: 'CFRP', cond: 'Conductive fabric', fr: 'Fire resistant fabric (Nomex)', kevlar: 'Kevlar', micro: 'Micro-encapsulated microfibre',
  };
  const TRAY = ['kevlar', 'concrete', 'thermo', 'ti', 'grp', 'micro', 'sma', 'rc', 'cond', 'graphene', 'photo', 'cfrp', 'fr', 'foam'];   // mixed on purpose
  const FAB = ['cond', 'fr', 'kevlar', 'micro'], PIG = ['thermo', 'photo'];
  const SHORT = (m) => M[m].split(' (')[0];
  const OK = (mode, msg) => ({ ok: true, mode, msg });
  const F = (mode, msg, mis) => ({ ok: false, mode, msg, mis: mis || '' });
  // things that cannot be built from the material at all
  const noMake = (m, thing) => (PIG.includes(m) ? F('nomake', `${SHORT(m)} is a <b>pigment</b>: a colouring that is mixed into, or printed onto, another material. You cannot build ${thing} out of it.`)
    : m === 'graphene' ? F('nomake', `Graphene is still expensive to make in large sheets, so nobody can build ${thing} from it yet.`) : null);
  const BR = [
    { tab: 'Baby spoon', text: 'A <b>baby’s feeding spoon</b> that <b>warns</b> the parent when the food is <b>too hot</b>.', D: 3.3,
      judge(m) {
        if (m === 'thermo') return OK('warn', 'The spoon changed colour in the hot food, so the parent waited. Thermochromic pigment changes colour with temperature, and changes back when it cools.');
        if (m === 'photo') return F('none', 'The food was too hot, but the spoon gave no warning. Photochromic pigment reacts to <b>light</b>, not to heat. Which pigment reacts to temperature?', 'stimulus-mixup');
        if (m === 'sma') return F('bend', 'The heat made the spoon change <b>shape</b>, but nobody noticed in time. The warning must be something a parent sees at a glance. Which smart material changes how it <b>looks</b> when it gets hot?');
        return F('none', `The food was too hot, but the spoon gave no warning: ${SHORT(m)} looks just the same hot or cold. This needs a <b>smart</b> material: one that reacts to a change in temperature.`, 'smart-meaning');
      } },
    { tab: 'F1 car body', text: 'The <b>body of a Formula 1 car</b>: as <b>strong, stiff and light</b> as possible. Cost is no problem.', D: 3.2,
      judge(m) {
        const q = ' Which composite is extremely strong and stiff for its weight?';
        if (m === 'cfrp') return OK('win', 'Fastest lap! CFRP is extremely strong and stiff for its weight: stronger than steel and much lighter. It is expensive, but in Formula 1 performance comes first.');
        if (m === 'grp') return F('second', 'GRP made a proper car body, but the rival car was lighter for the same strength, and beat you. GRP is the <b>cheaper</b> composite. Which one is stronger, stiffer and lighter?', 'gfrp-cfrp');
        if (m === 'ti') return F('second', 'Titanium is strong and light <i>for a metal</i>, but the rival car’s body was lighter still, and beat you.' + q);
        if (m === 'foam') return F('second', 'Metal foam is light, but its special trick is crumpling to absorb impact. The rival car’s body was stronger and stiffer for its weight, and beat you.' + q);
        if (m === 'sma') return F('second', 'Nitinol’s trick is going back to its remembered shape when heated: no help here, and the rival car’s body was much lighter.' + q);
        if (m === 'concrete' || m === 'rc') return F('heavy', 'Far too heavy! Concrete is for buildings and bridges: the car could hardly move.' + q);
        return noMake(m, 'a car body') || F('floppy', `${SHORT(m)} is a flexible fabric: the body flapped about in the wind. A car body must be <b>stiff</b>.` + q);
      } },
    { tab: 'Hip joint', text: 'A <b>replacement hip joint</b>: strong and light, it must <b>not corrode</b> and must <b>not be rejected</b> by the body.', D: 3.2,
      judge(m) {
        const q = ' Which modern metal is strong, light and biocompatible?';
        if (m === 'ti') return OK('ok', 'Still working after 20 years. Titanium is very strong, lightweight, has excellent corrosion resistance and is biocompatible: the body does not reject it.');
        if (m === 'foam') return OK('ok', 'Accepted: titanium <b>foam</b> is used for bone implants, because bone can grow into its pores. Solid titanium (strong, light, corrosion resistant, biocompatible) is the usual choice for the joint itself.');
        if (m === 'sma') return F('bend', 'Nitinol is used inside the body, but for parts that are meant to <b>change shape</b> (stents, braces). Warmed by the body, this joint changed shape too! A hip must stay exactly as it is.' + q);
        if (m === 'cfrp') return F('crack', 'CFRP is strong and light, but on a sudden impact it fails in a brittle way: one stumble and the joint cracked.' + q);
        if (m === 'concrete') return F('crack', 'Concrete is weak in tension, so the joint cracked as the patient walked (and it is far too heavy).' + q);
        if (m === 'rc' || m === 'grp') return F('reject', `${SHORT(m)} is made for ${m === 'rc' ? 'buildings and bridges' : 'boat hulls and body panels'}, not for the inside of a body. An implant must be <b>biocompatible</b> (not rejected by the body) and must never corrode.` + q);
        return noMake(m, 'a hip joint') || F('bend', `${SHORT(m)} is a flexible fabric: it cannot carry a person’s weight.` + q);
      } },
    { tab: 'Bridge deck', text: 'The <b>deck of a road bridge</b>: it must carry heavy lorries across a wide gap, last for decades and be <b>affordable</b>.', D: 3.3,
      judge(m) {
        const q = ' Which composite is used for buildings, bridges and roads?';
        if (m === 'rc') return OK('ok', 'The lorry crossed safely. Concrete is strong in compression but weak in tension, so steel bars (rebar) are cast inside to carry the tension. It is also cheap, durable and can be cast into any shape.');
        if (m === 'concrete') return F('crack', 'The deck cracked from <b>underneath</b>. As the lorry crosses, the bottom of the deck is stretched (tension), and concrete is weak in tension. What could be cast inside the concrete to carry that tension?', 'concrete-tension');
        if (m === 'cfrp' || m === 'ti' || m === 'sma') return F('cost', `Strong enough: the lorry crossed. But ${SHORT(m)} is expensive and a bridge deck is enormous: the council cannot afford it. Which composite is cheap, durable and can be cast into any shape?`);
        if (m === 'grp') return F('sag', 'GRP is good for boat hulls and body panels, but this deck was not stiff enough for a heavy lorry: it sagged.' + q);
        if (m === 'foam') return F('sag', 'Metal foam crumples to absorb impact, and that is just what it did under the lorry.' + q);
        return noMake(m, 'a bridge deck') || F('sag', `${SHORT(m)} is a flexible fabric: the deck sagged like a hammock.` + q);
      } },
    { tab: 'Crumple zone', text: 'The <b>crumple zone</b> at the front of a car: in a crash it must <b>absorb the impact energy</b> to protect the people inside.', D: 3.0,
      judge(m) {
        const q = ' Which modern material is designed to crumple and absorb impact energy?';
        if (m === 'foam') return OK('absorb', 'The foam crumpled and absorbed the impact energy, so the people were protected. Metal foam is full of gas bubbles: very lightweight, and it crumples steadily in a crash.');
        if (['ti', 'rc', 'concrete', 'sma'].includes(m)) return F('rigid', `${SHORT(m)} hardly crumpled at all, so the car stopped dead and the people took the whole jolt. A crumple zone has to <b>squash</b> to soak up the energy.` + q, 'metal-foam');
        if (m === 'cfrp') return F('shatter', 'CFRP is very stiff and fails in a sudden, brittle way on impact: it shattered instead of crumpling steadily.' + q);
        if (m === 'grp') return F('shatter', 'The GRP cracked and splintered instead of crumpling steadily.' + q);
        return noMake(m, 'a crumple zone') || F('floppy', `${SHORT(m)} is a flexible fabric: it gave no resistance, so nothing slowed the car before the cabin hit the wall.` + q);
      } },
    { tab: 'Police vest', text: 'A <b>vest for a police officer</b>: it must <b>stop a knife</b>, yet be light and flexible enough to wear all day.', D: 3.6,
      judge(m) {
        const q = ' Which technical textile is cut- and puncture-resistant?';
        if (m === 'kevlar') return OK('stop', 'The blade stopped, and the officer can still move. Kevlar has very high tensile strength and is cut- and puncture-resistant, yet lightweight and flexible.');
        if (m === 'fr') return F('through', 'Nomex is an aramid fibre too, but it is engineered to resist <b>flame</b>, not blades: the knife went through.' + q, 'tech-textile-mixup');
        if (m === 'cond') return F('through', 'Conductive fabric lets electricity flow: no help against a blade. The knife went through.' + q, 'tech-textile-mixup');
        if (m === 'micro') return F('through', 'Micro-encapsulated fabric releases a substance as it is worn: no help against a blade. The knife went through.' + q, 'tech-textile-mixup');
        return noMake(m, 'a vest') || F('stiff', `It stopped the knife, but ${SHORT(m)} makes a <b>rigid</b> plate${m === 'concrete' || m === 'rc' ? ' (and a very heavy one)' : ''}: the officer cannot bend, run or sit down in it. Which technical textile is strong, light and flexible?`);
      } },
  ];

  // ---------------------------------------------------------------------------------------------------------
  // the six scenes (860 × 300). paint = the still parts; live(x, t, mode, now) = what moves (t = seconds into the test)
  // ---------------------------------------------------------------------------------------------------------
  function lorry(x, cx, gy, tilt) {
    x.save(); x.translate(cx, gy); x.rotate(tilt || 0);
    const bx = geo.rect(-74, -70, 92, 50, 4), cab = [[22, -20], [22, -56], [44, -56], [58, -38], [58, -20]];
    paper(x, bx); Ink.hatchFill(x, bx, 1, B, 0.8); st(x, bx, { w: 2.6, seed: 201 }); paper(x, cab); st(x, closeP(cab), { w: 2.6, seed: 203 }); st(x, [[30, -50], [42, -50], [50, -38], [30, -38], [30, -50]], { w: 1.4, seed: 205, retrace: false });
    st(x, [[-74, -20], [58, -20]], { w: 2.4, seed: 207 }); [-52, -24, 38].forEach((wx, i) => wheel(x, wx, -11, 11, 209 + i));
    x.restore();
  }
  const SCENES = [
    // ---- 0: baby spoon in hot food ----
    { paint(x) {
        st(x, [[20, 264], [840, 264]], { w: 2.6, seed: 3 });
        const bowl = [[162, 178], ...geo.curve([162, 178], [170, 238], [210, 258], [240, 258], 12), [340, 258], ...geo.curve([340, 258], [370, 258], [410, 238], [418, 178], 12)];
        Ink.hatchShadow(x, bowl.concat([[162, 178]]), 1, 7, 5); paper(x, bowl.concat([[162, 178]])); st(x, bowl, { w: 3, seed: 5 }); Ink.hatchFill(x, [[176, 214], [404, 214], [370, 256], [210, 256]], 1, B, 1.1);
        const rim = geo.ellipse(290, 178, 128, 24, 0, TAU); paper(x, rim); st(x, closeP(rim), { w: 2.8, seed: 7 }); const soup = geo.ellipse(290, 181, 110, 17, 0, TAU); tint(x, soup, 'rgba(240,150,60,.3)'); st(x, closeP(soup), { w: 1.6, seed: 9, retrace: false });
        text(x, 'very hot food', 290, 292, { font: 'hand', size: 22 });
        // the baby
        st(x, geo.ellipse(700, 150, 64, 64), { w: 3, seed: 11 }); st(x, geo.curve([690, 88], [684, 66], [716, 66], [706, 86], 10), { w: 2, seed: 13 });
        st(x, geo.ellipse(634, 154, 9, 14), { w: 2, seed: 15 }); st(x, geo.ellipse(766, 154, 9, 14), { w: 2, seed: 17 });
        const bib = [[656, 214], ...geo.curve([656, 214], [660, 262], [740, 262], [744, 214], 12)]; st(x, bib, { w: 2.4, seed: 19 }); Ink.hatchFill(x, bib.concat([[656, 214]]), 1, B, 0.7);
      },
      live(x, t, mode, now) {
        [250, 290, 330].forEach((px, i) => { x.save(); x.strokeStyle = rgba(RD, 0.5); x.lineWidth = 2.2; x.lineCap = 'round'; x.beginPath(); for (let j = 0; j <= 14; j++) x.lineTo(px + Math.sin(j * 0.6 + now * 3 + i * 2) * 6, 150 - j * 5); x.stroke(); x.restore(); });
        const K = [[0, 470, 92], [0.9, 336, 166], [1.9, 336, 166], [2.7, 572, 168], [9, 572, 168]]; let i = 0; while (i < K.length - 2 && t > K[i + 1][0]) i++;
        const u = ease((t - K[i][0]) / (K[i + 1][0] - K[i][0])), hx = lerp(K[i][1], K[i + 1][1], u), hy = lerp(K[i][2], K[i + 1][2], u);
        const heat = clamp((t - 0.9) / 0.8), bend = mode === 'bend' ? clamp((t - 1.1) / 0.7) : 0, end = [hx + 150, hy - 84], Hd = [];
        for (let j = 0; j <= 16; j++) { const v = j / 16; Hd.push([lerp(hx + 22, end[0], v) + Math.sin(v * 9) * 16 * bend, lerp(hy - 10, end[1], v) + Math.cos(v * 7) * 14 * bend]); }
        st(x, Hd, { w: 5, seed: 31 });
        const head = geo.ellipse(hx, hy, 30, 17, 0, TAU); paper(x, head);
        if (mode === 'warn' && heat > 0) { tint(x, head, `rgba(235,60,60,${0.6 * heat})`); if (heat > 0.5) Ink.hatchFill(x, head, 1, RD, 1.8); }
        st(x, closeP(head), { w: 2.8, seed: 33, color: mode === 'warn' && heat > 0.5 ? RD : B });
        if (mode === 'warn' && t > 1.9) { for (let j = 0; j < 5; j++) { const a = -Math.PI / 2 + (j - 2) * 0.5; st(x, [[hx + Math.cos(a) * 36, hy + Math.sin(a) * 26], [hx + Math.cos(a) * 50, hy + Math.sin(a) * 38]], { w: 2.2, seed: 35 + j, color: RD, retrace: false }); } }
        // the baby's face
        const fin = t > 2.7 && mode !== 'idle', bad = fin && mode !== 'warn';
        if (bad) { st(x, [[668, 128], [682, 136]], { w: 2.4, seed: 41 }); st(x, [[732, 128], [718, 136]], { w: 2.4, seed: 43 }); st(x, geo.ellipse(700, 178, 15, 17), { w: 2.6, seed: 45, color: RD }); [[672, 150], [728, 150]].forEach(([px, py], k) => st(x, [[px, py], [px - 3, py + 12], [px + 3, py + 12], [px, py]], { w: 1.6, seed: 47 + k, retrace: false })); text(x, 'OUCH!', 700, 62, { size: 30, color: RD, rot: -0.06 }); }
        else { disc(x, 676, 138, 4.5, B); disc(x, 724, 138, 4.5, B); st(x, geo.curve([680, 172], [690, fin ? 190 : 180], [710, fin ? 190 : 180], [720, 172], 10), { w: 2.4, seed: 49 }); }
        if (fin && mode === 'warn') { text(x, '“Red spoon: too hot.', 600, 44, { font: 'hand', size: 22, color: RD }); text(x, 'Wait a minute!”', 600, 72, { font: 'hand', size: 22, color: RD }); }
        if (fin && mode === 'bend') text(x, 'it changed shape, not colour', 420, 44, { font: 'hand', size: 22, color: RD });
      } },
    // ---- 1: Formula 1 ----
    { paint(x) {
        st(x, [[20, 250], [840, 250]], { w: 2.8, seed: 3 }); st(x, [[20, 168], [840, 168]], { w: 1.6, seed: 5, retrace: false });
        for (let i = 0; i < 12; i++) st(x, [[40 + i * 70, 209], [70 + i * 70, 209]], { w: 1.4, seed: 7 + i, retrace: false });
        st(x, [[96, 168], [96, 250]], { w: 2.2, seed: 21 }); st(x, [[792, 250], [792, 96]], { w: 3, seed: 23 });
        const fl = box(792, 96, 50, 36); st(x, closeP(fl), { w: 2, seed: 25 }); for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) if ((r + c) % 2 === 0) { x.fillStyle = rgba(B, 0.85); x.fillRect(792 + c * 12.5, 96 + r * 12, 12.5, 12); }
        text(x, 'rival', 60, 150, { font: 'hand', size: 22 }); text(x, 'you', 56, 286, { font: 'hand', size: 22 });
      },
      car(x, cx, gy, mode, now, ghost) {
        const heavy = mode === 'heavy', fl = mode === 'floppy' ? 1 : 0, y = gy - (heavy ? 14 : 20);
        const wv = (px, py, k) => [px, py + (fl ? Math.sin(now * 14 + k * 1.3) * 9 * fl : 0)];
        const body = [[cx + 96, y + 8], wv(cx + 70, y - 8, 1), wv(cx + 22, y - 16, 2), wv(cx + 6, y - 32, 3), wv(cx - 24, y - 32, 4), wv(cx - 32, y - 18, 5), wv(cx - 84, y - 20, 6), [cx - 84, y + 8]];
        paper(x, body); if (!ghost) Ink.hatchFill(x, body, 1, B, heavy ? 2 : 0.9); st(x, closeP(body), { w: 2.6, seed: 31 + (fl ? Math.floor(now * 8) % 3 : 0) });
        st(x, [[cx - 84, y - 20], [cx - 92, y - 46], [cx - 62, y - 46]], { w: 2.6, seed: 37 }); st(x, [[cx + 86, y + 12], [cx + 110, y + 12]], { w: 3, seed: 39 });
        st(x, geo.ellipse(cx - 8, y - 36, 9, 9), { w: 2, seed: 41 });
        wheel(x, cx - 56, y, 20, 43, heavy ? 14 : 0); wheel(x, cx + 56, y, 20, 45, heavy ? 14 : 0);
        if (heavy) { st(x, [[cx, y - 96], [cx, y - 56]], { w: 4, seed: 47, color: RD }); st(x, [[cx - 10, y - 68], [cx, y - 54], [cx + 10, y - 68]], { w: 4, seed: 49, color: RD }); text(x, 'too heavy!', cx + 76, y - 78, { size: 22, color: RD }); }
      },
      live(x, t, mode, now) {
        const u = clamp(t / 2.8), you = { win: 120 + 600 * ease(u), second: 120 + 500 * u, heavy: 120 + 40 * u, floppy: 120 + 170 * u, idle: 120 }[mode], riv = mode === 'idle' ? 120 : mode === 'win' ? 120 + 500 * u : 120 + 600 * ease(u);
        x.save(); x.translate(0, 0); x.globalAlpha = 0.5; x.translate(riv * 0.25, 46); x.scale(0.75, 0.75); this.car(x, riv, 168, 'ok', now, true); x.restore();
        this.car(x, you, 250, mode, now);
        if (mode === 'win' && t > 0.3 && t < 2.8) [0, 1, 2].forEach((k) => st(x, [[you - 100 - k * 8, 200 + k * 14], [you - 150 - k * 14, 200 + k * 14]], { w: 2, seed: 51 + k, retrace: false }));
        if (t > 2.8 && mode !== 'idle') text(x, mode === 'win' ? 'YOU WIN!' : 'the rival wins', 640, 60, { size: 30, color: mode === 'win' ? GR : RD, rot: -0.05 });
        if (mode === 'floppy' && t > 0.6) text(x, 'flap flap flap…', you + 30, 196, { font: 'hand', size: 22, color: RD });
      } },
    // ---- 2: hip joint ----
    { paint(x) {
        const pel = [[196, 30], ...geo.curve([196, 30], [300, 10], [384, 40], [372, 96], 14), ...geo.curve([372, 96], [356, 74], [318, 60], [282, 78], 10), ...geo.curve([282, 78], [258, 94], [258, 124], [270, 146], 10), ...geo.curve([270, 146], [226, 150], [190, 100], [196, 30], 14)];
        Ink.hatchFill(x, pel, 1, B, 0.6); st(x, pel, { w: 2.8, seed: 3 });
        st(x, [[352, 150], ...geo.curve([352, 150], [392, 150], [404, 176], [398, 206], 10), [412, 292]], { w: 2.8, seed: 5 });
        st(x, [[296, 176], ...geo.curve([296, 176], [300, 220], [318, 250], [326, 292], 10)], { w: 2.8, seed: 7 });
        text(x, 'pelvis', 150, 60, { font: 'hand', size: 22 }); text(x, 'thigh bone', 236, 270, { font: 'hand', size: 22 });
        text(x, 'years in the body:', 640, 56, { size: 22 }); st(x, [[540, 264], [760, 264]], { w: 2.4, seed: 9 });
      },
      live(x, t, mode) {
        const tf = mode === 'ok' || mode === 'idle' ? 99 : 0.45, dead = t > tf, k = clamp((t - tf) / 0.6), years = mode === 'idle' ? 0 : Math.min(20, Math.round(Math.min(t, tf) * 7.2));
        if (mode === 'reject' && dead) glow(x, 326, 150, 110, [235, 60, 60], 0.5 * k);
        // implant: stem, neck and ball
        const dx = mode === 'crack' ? 10 * k : 0, dy = mode === 'crack' ? 12 * k : 0, bend = mode === 'bend' ? k : 0;
        const stem = []; for (let j = 0; j <= 10; j++) { const v = j / 10; stem.push([lerp(346, 368, v) - 9 * (1 - v) + Math.sin(v * 8) * 15 * bend + dx, lerp(162, 276 - 26 * bend, v) + dy]); } for (let j = 10; j >= 0; j--) { const v = j / 10; stem.push([lerp(346, 368, v) + 9 * (1 - v) + 3 + Math.sin(v * 8) * 15 * bend + dx, lerp(162, 276 - 26 * bend, v) + dy]); }
        paper(x, stem); Ink.hatchFill(x, stem, 1, B, 1.6); st(x, closeP(stem), { w: 2.4, seed: 21 });
        const neck = [[310, 118], [326, 108], [356 + dx, 158 + dy], [338 + dx, 166 + dy]]; paper(x, neck); Ink.hatchFill(x, neck, 1, B, 1.6); st(x, closeP(neck), { w: 2.4, seed: 23 });
        const ball = geo.ellipse(302, 110, 30, 30, 0, TAU); paper(x, ball); Ink.hatchFill(x, ball, 1, B, 1.1); st(x, closeP(ball), { w: 2.8, seed: 25 });
        if (mode === 'crack' && dead) { zig(x, [316, 148], [352, 132], 5, 6); text(x, 'CRACK!', 440, 130, { size: 26, color: RD, rot: -0.08 }); }
        if (mode === 'reject' && dead) { for (let j = 0; j < 7; j++) { const a = j * TAU / 7 + 0.3; zig(x, [326 + Math.cos(a) * 62, 160 + Math.sin(a) * 78], [326 + Math.cos(a) * 88, 160 + Math.sin(a) * 104], 3, 5, { w: 2 }); } text(x, 'rejected!', 470, 150, { size: 26, color: RD, rot: -0.08 }); }
        if (mode === 'bend' && dead) text(x, 'lost its shape!', 480, 200, { size: 26, color: RD, rot: -0.08 });
        // the patient
        text(x, String(years), 640, 104, { size: 44, color: dead ? RD : B });
        const px = 650, s = dead || mode === 'idle' ? 0 : Math.sin(t * 9) * 16;
        x.save(); x.strokeStyle = rgba(B, 0.92); x.lineWidth = 3; x.lineCap = 'round'; x.beginPath(); x.arc(px, 146, 13, 0, 7); x.stroke();
        x.beginPath(); x.moveTo(px, 160); x.lineTo(px, 214); x.moveTo(px, 214); x.lineTo(px + s, 262); x.moveTo(px, 214); x.lineTo(px - s, 262); x.moveTo(px, 174); x.lineTo(px - s * 0.8, 200); x.moveTo(px, 174); x.lineTo(px + s * 0.8 + (dead ? 22 : 0), 200); x.stroke(); x.restore();
        if (dead) { st(x, [[px + 24, 196], [px + 30, 262]], { w: 3, seed: 31, color: RD }); st(x, [[px + 14, 196], [px + 34, 196]], { w: 3, seed: 33, color: RD }); }
        else if (years >= 20) Ink.tick(x, 700, 150, 1.6);
      } },
    // ---- 3: bridge deck ----
    { paint(x) {
        const L = [[20, 152], [200, 152], [222, 292], [20, 292]], R = [[660, 152], [840, 152], [840, 292], [638, 292]];
        [L, R].forEach((P, i) => { Ink.hatchFill(x, P, 1, B, 0.7); st(x, closeP(P), { w: 2.8, seed: 3 + i }); });
        [[250, 274], [370, 282], [490, 272]].forEach(([px, py], i) => st(x, geo.curve([px, py], [px + 24, py - 10], [px + 50, py + 10], [px + 100, py], 12), { w: 1.8, seed: 7 + i, retrace: false }));
      },
      live(x, t, mode) {
        const mid = 430, fail = mode === 'crack' || mode === 'sag';
        const lx = mode === 'idle' ? 90 : fail ? lerp(90, mid, ease(t / 1.3)) : lerp(90, 800, clamp(t / 2.6));
        const A = mode === 'crack' ? 44 * ease((t - 1.2) / 0.5) : mode === 'sag' ? 78 * ease(t / 1.4) : (lx > 200 && lx < 660 ? 3 : 0);
        const sag = (px) => (px < 200 || px > 660 ? 0 : mode === 'crack' ? A * (1 - Math.abs(px - mid) / 230) : A * Math.sin(Math.PI * (px - 200) / 460));
        const top = [], bot = []; for (let px = 170; px <= 690; px += 10) { top.push([px, 134 + sag(px)]); bot.push([px, 152 + sag(px)]); }
        const deck = top.concat(bot.slice().reverse()); paper(x, deck); Ink.hatchFill(x, deck, 1, B, 0.9); st(x, closeP(deck), { w: 2.8, seed: 21 });
        if (mode === 'ok' && t > 0.2) { st(x, [[176, 147], [684, 147]], { w: 2.6, seed: 23, color: RD }); if (t > 2.6) { text(x, 'steel bars inside', 430, 198, { font: 'hand', size: 22, color: RD }); st(x, [[430, 176], [430, 154]], { w: 1.6, seed: 25, color: RD, retrace: false }); } }
        if (mode === 'crack' && t > 1.2) { [-26, 0, 24].forEach((d, i) => zig(x, [mid + d, 154 + sag(mid + d)], [mid + d * 0.6, 132 + sag(mid + d) + 6], 4, 5, { seed: 27 + i })); text(x, 'CRACK!', mid, 250, { size: 28, color: RD, rot: -0.06 }); }
        const y = 134 + sag(lx), tilt = fail && A > 4 ? Math.atan2(sag(lx + 30) - sag(lx - 30), 60) : 0;
        lorry(x, lx, y, tilt);
        if (mode === 'sag' && t > 1.4) text(x, 'it sagged!', mid, 60, { size: 28, color: RD, rot: -0.06 });
        if (mode === 'cost' && t > 2.3) { const k = ease((t - 2.3) / 0.4); x.save(); x.translate(430, 70); x.rotate(-0.1); x.scale(k, k); const tg = [[-150, -34], [130, -34], [160, 0], [130, 34], [-150, 34]]; paper(x, tg); st(x, closeP(tg), { w: 3, seed: 31, color: RD }); text(x, '£ £ £ £ £ £ £', -12, 11, { size: 30, color: RD }); x.restore(); }
        if ((mode === 'ok') && t > 2.6) Ink.tick(x, 720, 96, 1.8);
      } },
    // ---- 4: crumple zone ----
    { paint(x) {
        st(x, [[20, 250], [840, 250]], { w: 2.8, seed: 3 });
        const wall = box(724, 84, 64, 166); Ink.hatchShadow(x, wall, 1, 8, 0); paper(x, wall); st(x, closeP(wall), { w: 3, seed: 5 });
        for (let r = 0; r < 6; r++) { st(x, [[724, 110 + r * 26], [788, 110 + r * 26]], { w: 1.4, seed: 7 + r, retrace: false }); st(x, [[746 + (r % 2) * 20, 84 + r * 26], [746 + (r % 2) * 20, 110 + r * 26]], { w: 1.4, seed: 15 + r, retrace: false }); }
      },
      live(x, t, mode) {
        const ti = 1.2, v = 400, hit = t > ti, d = t - ti;
        let Lz = 120, front = mode === 'idle' ? 200 : Math.min(604, 124 + v * t);
        if (hit) {
          if (mode === 'absorb') Lz = lerp(120, 42, ease(d / 0.6)); else if (mode === 'floppy') Lz = lerp(120, 8, clamp(d / 0.25)); else if (mode === 'shatter') Lz = lerp(120, 14, clamp(d / 0.28));
          front = 724 - Lz;
        }
        const lurch = !hit || mode === 'absorb' ? (hit ? 5 * Math.sin(clamp(d / 0.6) * Math.PI) : 0) : 34 * clamp(d / 0.15), gy = 250;
        // cabin
        const cab = [[front - 150, gy - 22], [front - 150, gy - 74], [front - 132, gy - 112], [front - 52, gy - 112], [front - 22, gy - 74], [front, gy - 70], [front, gy - 22]];
        paper(x, cab); st(x, closeP(cab), { w: 2.8, seed: 21 }); st(x, [[front - 126, gy - 104], [front - 58, gy - 104], [front - 34, gy - 76], [front - 126, gy - 76], [front - 126, gy - 104]], { w: 1.6, seed: 23, retrace: false });
        st(x, geo.ellipse(front - 86 + lurch, gy - 88, 11, 11), { w: 2.4, seed: 25 }); st(x, [[front - 90 + lurch * 0.6, gy - 76], [front - 96, gy - 44]], { w: 2.6, seed: 27 });
        // the crumple zone
        if (mode === 'shatter' && hit) { for (let k = 0; k < 9; k++) { const a = -2.6 + k * 0.42, r = 30 + d * (150 + k * 22), fx = 690 + Math.cos(a) * r * 0.8, fy = gy - 46 + Math.sin(a) * r * 0.7 + d * d * 220; if (fy < gy) st(x, closeP([[fx - 9, fy - 5], [fx + 8, fy - 8], [fx + 5, fy + 8]]), { w: 2, seed: 31 + k, amp: 0.2 }); } }
        else {
          const z = box(front, gy - 64, Lz, 42); paper(x, z); tint(x, z, 'rgba(240,200,60,.3)'); st(x, closeP(z), { w: 2.6, seed: 41, color: RD });
          if (hit && mode === 'absorb') { const n = 9, P = []; for (let k = 0; k <= n; k++) P.push([front + (Lz * k) / n, gy - 43 + (k % 2 ? -17 : 17)]); st(x, P, { w: 2, seed: 43, color: RD, amp: 0.2 }); }
          else if (Lz > 30) [0.25, 0.5, 0.75].forEach((u, k) => st(x, geo.ellipse(front + Lz * u, gy - 43 + (k % 2 ? 6 : -6), 7, 7), { w: 1.4, seed: 45 + k, retrace: false, color: RD }));
        }
        wheel(x, front - 112, gy - 20, 20, 51); wheel(x, front - 22 + Math.min(0, Lz - 30), gy - 20, 20, 53);
        if (hit && d > 0.3 && mode !== 'absorb') { text(x, 'OUCH!', front - 80, gy - 150, { size: 30, color: RD, rot: -0.08 }); [[-30, -128], [-8, -140], [14, -126]].forEach(([sx, sy], k) => { const cx = front - 86 + lurch + sx + 30, cy = gy + sy + 20; st(x, [[cx - 6, cy], [cx + 6, cy]], { w: 1.8, seed: 55 + k, color: RD, retrace: false }); st(x, [[cx, cy - 6], [cx, cy + 6]], { w: 1.8, seed: 58 + k, color: RD, retrace: false }); }); }
        if (hit && d > 0.7 && mode === 'absorb') { text(x, 'impact absorbed', front - 60, gy - 146, { size: 26, color: GR }); Ink.tick(x, front + 60, gy - 150, 1.4); }
        if (hit && d > 0.4 && mode === 'rigid') text(x, 'no crumple: stopped dead', 380, 60, { font: 'hand', size: 22, color: RD });
        if (mode === 'idle') text(x, 'crumple zone', 260, 150, { font: 'hand', size: 22, color: RD });
      } },
    // ---- 5: police vest ----
    { paint(x) { st(x, [[240, 276], [720, 276]], { w: 2.6, seed: 3 }); text(x, 'test dummy', 630, 264, { font: 'hand', size: 22 }); st(x, [[30, 236], [30, 120]], { w: 3, seed: 5 }); st(x, [[20, 120], [56, 120]], { w: 3, seed: 7 }); },
      live(x, t, mode) {
        const stiff = mode === 'stiff', flex = mode === 'stop' && t > 1.9 ? 0.22 * Math.sin((t - 1.9) * 4.2) : stiff && t > 1.9 ? 0.012 * Math.sin(t * 40) : 0;
        x.save(); x.translate(430, 276); x.rotate(flex); x.translate(-430, -276);
        st(x, geo.ellipse(430, 56, 26, 28), { w: 2.8, seed: 21 }); st(x, [[420, 84], [420, 98]], { w: 2.4, seed: 23 }); st(x, [[440, 84], [440, 98]], { w: 2.4, seed: 25 });
        const torso = [[366, 100], [494, 100], [508, 152], [488, 276], [372, 276], [352, 152]]; paper(x, torso); st(x, closeP(torso), { w: 2.8, seed: 27 });
        st(x, [[352, 152], [330, 210]], { w: 2.6, seed: 29 }); st(x, [[508, 152], [530, 210]], { w: 2.6, seed: 31 });
        const vest = [[378, 110], [414, 110], [430, 128], [446, 110], [482, 110], [492, 160], [478, 252], [382, 252], [368, 160]]; tint(x, vest, 'rgba(120,140,235,.16)'); Ink.hatchFill(x, vest, 1, B, stiff ? 2 : 1.1); st(x, closeP(vest), { w: 2.8, seed: 33 });
        st(x, [[372, 196], [488, 196]], { w: 1.6, seed: 35, retrace: false });
        x.restore();
        // the knife on its test arm
        const reach = mode === 'through' ? 426 : 368, tip = mode === 'idle' ? 150 : t < 1 ? lerp(150, reach, ease(t / 1) ** 2) : t < 1.6 ? reach : lerp(reach, 150, ease((t - 1.6) / 0.4)), ky = 180;
        if (mode !== 'through' || t < 1) { const bl = [[tip, ky], [tip - 76, ky - 15], [tip - 86, ky - 4], [tip - 86, ky + 8], [tip - 12, ky + 8]]; paper(x, bl); st(x, closeP(bl), { w: 2.2, seed: 41, amp: 0.3 }); }
        else { const bl = [[368, ky - 8], [tip - 76, ky - 15], [tip - 86, ky - 4], [tip - 86, ky + 8], [368, ky + 8]]; paper(x, bl); st(x, closeP(bl), { w: 2.2, seed: 41, amp: 0.3 }); zig(x, [366, ky - 26], [372, ky + 26], 6, 6); text(x, 'it went through!', 200, 96, { size: 26, color: RD, rot: -0.06 }); }
        const hd = geo.rect(tip - 156, ky - 8, 70, 19, 7); paper(x, hd); Ink.hatchFill(x, hd, 1, B, 2); st(x, hd, { w: 2.4, seed: 43, amp: 0.3 }); st(x, [[30, 180], [tip - 156, ky + 2]], { w: 3, seed: 45 });
        if (mode !== 'through' && mode !== 'idle' && t > 1 && t < 1.6) [[-0.9, 18], [-0.3, 24], [0.4, 20], [1.0, 16]].forEach(([a, r], k) => st(x, [[362 - Math.cos(a) * 6, ky - Math.sin(a) * 6 - 6], [362 - Math.cos(a) * r, ky - Math.sin(a) * r - 6]], { w: 2, seed: 47 + k, color: RD, retrace: false }));
        if (mode !== 'through' && mode !== 'idle' && t > 1.1) text(x, 'blade stopped', 190, 96, { size: 24, color: GR });
        if (mode === 'stop' && t > 2.1) { text(x, 'and it bends', 690, 120, { size: 24, color: GR }); Ink.tick(x, 676, 170, 1.6); }
        if (stiff && t > 2.1) { text(x, 'but it cannot bend!', 700, 120, { size: 24, color: RD }); st(x, [[640, 160], [760, 160]], { w: 3, seed: 51, color: RD }); st(x, [[654, 150], [640, 160], [654, 170]], { w: 3, seed: 53, color: RD }); st(x, [[746, 150], [760, 160], [746, 170]], { w: 3, seed: 55, color: RD }); }
      } },
  ];

  // an interactive canvas with a render loop that sleeps off screen / when the page is hidden
  function Stage(parent) {
    const c = document.createElement('canvas'); parent.appendChild(c);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = Math.round(W * dpr); c.height = Math.round(HH * dpr);
    Object.assign(c.style, { width: '100%', height: 'auto', aspectRatio: W + ' / ' + HH, display: 'block', touchAction: 'manipulation', userSelect: 'none', webkitUserSelect: 'none' });
    const ctx = c.getContext('2d'), S = { c, ctx, render: () => false };
    S.layer = (paint) => { const L = document.createElement('canvas'); L.width = c.width; L.height = c.height; const x = L.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.lineCap = x.lineJoin = 'round'; paint(x); return L; };
    S.blit = (L) => ctx.drawImage(L, 0, 0, W, HH);
    const hidden = () => { const p = c.closest('.page'); return !p || p.classList.contains('hidden') || !c.offsetParent; };
    let raf = 0, wait = 0, last = 0, vis = true;
    if (window.IntersectionObserver) new IntersectionObserver((es) => { vis = es[es.length - 1].isIntersecting; if (vis) S.go(); }, { rootMargin: '120px' }).observe(c);
    const tick = (now) => {
      raf = 0;
      if (!vis) { last = 0; return; }
      if (hidden()) { last = 0; if (!wait) wait = setTimeout(() => { wait = 0; S.go(); }, 500); return; }
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60; last = now;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.globalCompositeOperation = 'source-over'; ctx.clearRect(0, 0, W, HH);
      ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = 1; ctx.lineCap = ctx.lineJoin = 'round';
      if (S.render(dt, now / 1000)) raf = requestAnimationFrame(tick); else last = 0;
    };
    S.go = () => { if (!raf) raf = requestAnimationFrame(tick); };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { S.onFonts && S.onFonts(); S.go(); });
    return S;
  }

  Book.page({ id: 'p08', title: 'Choose the material', build(ui, root) {
    const css = document.createElement('style');
    css.textContent = `
      .p08-bench{position:relative;margin:0 0 calc(var(--R)*1.4);padding:12px 14px 14px;background:rgba(251,250,245,.9)}
      .p08-bench>*{position:relative}
      .p08-tabs{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 10px}
      .p08-tab{font:700 16px Fredoka,system-ui;color:var(--ink);background:#fff;border:2px solid rgba(30,46,150,.4);border-radius:12px 12px 4px 4px;min-height:46px;padding:6px 12px;cursor:pointer;line-height:1.2;touch-action:manipulation}
      .p08-tab.on{background:var(--ink);color:#fff;border-color:var(--ink)}
      .p08-tab .tk{color:var(--green);margin-left:4px}.p08-tab.on .tk{color:#9df0b6}
      .p08-brief{display:flex;gap:12px;align-items:center;background:rgba(255,236,120,.45);border-left:5px solid rgba(240,200,60,.9);padding:8px 14px;margin:0 0 10px;line-height:1.45;font-size:19px;transform:rotate(-.3deg)}
      .p08-brief .n{font:700 15px Fredoka,system-ui;color:var(--red);white-space:nowrap;letter-spacing:.06em}
      .p08-brief b{font-family:Fredoka,system-ui;font-weight:600}
      .p08-tray{display:grid;grid-template-columns:repeat(auto-fill,minmax(148px,1fr));gap:8px;margin:0 0 8px}
      .p08-card{background:#fff;border:2px solid rgba(30,46,150,.4);border-radius:10px;padding:4px 8px;min-height:54px;cursor:pointer;font:600 15.5px Fredoka,system-ui;color:var(--ink);text-align:center;line-height:1.2;touch-action:manipulation}
      .p08-card.picked{border-color:var(--ink);background:#e8ecff;transform:rotate(-1.5deg) scale(1.04);box-shadow:0 4px 10px rgba(30,46,150,.25)}
      .p08-card.tried{border-color:rgba(178,28,38,.55);color:rgba(30,46,150,.55);text-decoration:line-through;text-decoration-color:var(--red)}
      .p08-card.won{border-color:var(--green);background:#e6f6ea}
      .p08-row{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin:0 0 8px}
      .p08-row .btn{margin-top:0}.p08-go{font-size:20px!important;padding:10px 26px!important}
      .p08-tip{font-size:16px;color:rgba(30,46,150,.75);line-height:1.4;flex:1 1 200px}
      .p08-stagewrap{position:relative;margin:0 0 4px}
      .p08-stamp{position:absolute;right:6px;top:-44px;z-index:2;font:700 26px Fredoka,system-ui;letter-spacing:.04em;padding:2px 14px;border:4px solid;border-radius:10px;transform:rotate(-7deg) scale(0);transition:transform .25s cubic-bezier(.3,1.6,.5,1);background:rgba(251,250,245,.85);pointer-events:none}
      .p08-stamp.on{transform:rotate(-7deg) scale(1)}.p08-stamp.good{color:var(--green)}.p08-stamp.bad{color:var(--red)}
      .p08-made{font:600 16px Fredoka,system-ui;color:var(--ink);min-height:44px;line-height:44px}
      .p08-bench .fb{font-size:18px;margin-top:4px}
      .p08-bench.recall .fb,.p08-bench.recall .p08-stagewrap,.p08-bench.recall .p08-tray,.p08-bench.recall .p08-made{filter:blur(7px);opacity:.5;pointer-events:none}
      @media (max-width:700px){.p08-card{font-size:14.5px}.p08-brief{font-size:18px}}`;
    root.appendChild(css);

    ui.h('Choose the material');
    ui.p('Now <b>you</b> are the designer. Six briefs have landed on your desk. For each one, pick a <b>material</b> from this lesson and press <b>TEST</b>: the test rig will show you whether it really does the job.');
    ui.p('If it fails, watch <b>why</b>, then choose again. <span class="key">Every test is recorded</span>, so think before you press!', 'small');

    const recs = BR.map((b, i) => ui.record('p08.b' + (i + 1), { label: `Brief ${i + 1}: ${b.tab} (choose the material)`, type: 'choose', max: 1 }));
    const ST = recs.map((r) => { const s = (r.get() || {}).sv || {}; return { tries: (s.tries || []).slice(), mis: (s.mis || []).slice() }; });
    const solved = (i) => ST[i].tries.some((t) => t.ok);
    let cur = Math.max(0, BR.findIndex((_, i) => !solved(i))), picked = null, run = null;

    const bench = ui.el('div', 'p08-bench'); requestAnimationFrame(() => Ink.frame(bench, { w: 2.4 }));
    const tabs = ui.el('div', 'p08-tabs', '', bench);
    const tabEls = BR.map((b, i) => { const t = ui.el('button', 'p08-tab', '', tabs); t.type = 'button'; t.onclick = () => { if (i === cur) return; Book.sfx('paper', { gain: 0.3, dur: 0.2 }); cur = i; picked = null; run = null; sync(); }; return t; });
    const brief = ui.el('div', 'p08-brief', '', bench);
    const tray = ui.el('div', 'p08-tray', '', bench);
    const cardEls = {};
    TRAY.forEach((m) => { const c = ui.el('button', 'p08-card', Book.esc(M[m]), tray); c.type = 'button'; cardEls[m] = c; c.onclick = () => { picked = picked === m ? null : m; Book.sfx('tick', { gain: 0.5 }); sync(); }; });
    const row = ui.el('div', 'p08-row', '', bench);
    const goBtn = ui.el('button', 'btn p08-go', 'TEST IT ▸', row); goBtn.type = 'button';
    const tip = ui.el('span', 'p08-tip', '', row);
    const nextBtn = ui.el('button', 'btn', 'Next brief ▸', row); nextBtn.type = 'button';
    const made = ui.el('div', 'p08-made', '', bench);
    const stageWrap = ui.el('div', 'p08-stagewrap', '', bench);
    const S = Stage(stageWrap);
    const stamp = ui.el('div', 'p08-stamp', '', stageWrap);
    const fb = ui.el('div', 'fb', '', bench);

    function commit(i) {
      const s = ST[i], ok = solved(i);
      recs[i].set({ answer: s.tries.map((t, k) => `${k + 1}) ${SHORT(t.m)} ${t.ok ? '✓ works' : '✗ fails'}`).join('; '), correct: ok, score: ok ? 1 : 0, max: 1, mis: s.mis.join(','), sv: { tries: s.tries, mis: s.mis } });
    }
    function sync() {
      BR.forEach((b, i) => { tabEls[i].innerHTML = `${i + 1}. ${b.tab}` + (solved(i) ? '<span class="tk">✓</span>' : ''); tabEls[i].classList.toggle('on', i === cur); });
      brief.innerHTML = `<span class="n">BRIEF ${cur + 1}</span><span>${BR[cur].text}</span>`;
      const s = ST[cur];
      TRAY.forEach((m) => { const t = s.tries.find((q) => q.m === m); cardEls[m].classList.toggle('picked', picked === m); cardEls[m].classList.toggle('tried', !!t && !t.ok); cardEls[m].classList.toggle('won', !!t && t.ok); });
      goBtn.disabled = !picked || (run && !run.verdict);
      const all = BR.every((_, i) => solved(i));
      nextBtn.style.display = solved(cur) && !all ? '' : 'none';
      tip.textContent = picked ? `Test ${SHORT(picked)}?` : solved(cur) ? (all ? 'All six briefs solved! You can still test other materials to see how they fail.' : 'Solved. Try the next brief (or test another material to see how it fails).') : 'Tap a material, then press TEST.';
      if (!run) { stamp.className = 'p08-stamp'; fb.className = 'fb'; fb.innerHTML = ''; made.textContent = ''; }
      S.go();
    }
    nextBtn.onclick = () => { const n = BR.findIndex((_, i) => !solved(i)); if (n < 0) return; cur = n; picked = null; run = null; sync(); bench.scrollIntoView({ block: 'start', behavior: 'smooth' }); };

    goBtn.onclick = () => {
      if (!picked) return;
      const i = cur, m = picked, res = BR[i].judge(m), s = ST[i];
      if (!solved(i)) {                                  // every different test counts until the brief is solved
        if (!s.tries.length || s.tries[s.tries.length - 1].m !== m) s.tries.push({ m, ok: res.ok });
        if (res.mis && !s.mis.includes(res.mis)) s.mis.push(res.mis);
        commit(i);
      }
      run = { i, m, res, t: 0, verdict: false }; picked = null;
      stamp.className = 'p08-stamp'; fb.className = 'fb'; fb.innerHTML = ''; made.textContent = `Made from: ${M[m]}`;
      Book.sfx('stamp', { gain: 0.5 }); sync();
      requestAnimationFrame(() => { const q = stageWrap.getBoundingClientRect(), sh = bench.closest('.sheet'); if (sh && q.bottom > innerHeight - 130) sh.scrollTop += q.bottom - (innerHeight - 190); });
    };
    function verdict() {
      run.verdict = true; const res = run.res;
      fb.className = 'fb on ' + (res.ok ? 'good' : 'bad'); fb.innerHTML = (res.ok ? '✓ ' : '✗ ') + res.msg;
      stamp.textContent = res.ok ? 'IT WORKS!' : 'NOT YET…'; stamp.className = 'p08-stamp on ' + (res.ok ? 'good' : 'bad');
      Book.sfx(res.ok ? 'success' : 'error', { gain: 0.4 }); sync();
      requestAnimationFrame(() => { const q = fb.getBoundingClientRect(), sh = bench.closest('.sheet'); if (sh && q.bottom > innerHeight - 110) sh.scrollTop += q.bottom - (innerHeight - 120); });
    }

    const layers = {};
    S.onFonts = () => { Object.keys(layers).forEach((k) => delete layers[k]); };
    S.render = (dt, now) => {
      const i = run ? run.i : cur, sc = SCENES[i], x = S.ctx;
      if (!layers[i]) layers[i] = S.layer((lx) => sc.paint(lx));
      S.blit(layers[i]);
      if (!run) { sc.live(x, 0, 'idle', now); return i === 0; }
      run.t += dt;
      if (run.res.mode === 'nomake') {
        sc.live(x, 0, 'idle', now);
        x.save(); x.globalCompositeOperation = 'source-over'; x.fillStyle = 'rgba(251,250,245,.72)'; x.fillRect(0, 0, W, HH); x.restore();
        const k = ease(run.t / 0.5); text(x, '?', 430, 150, { size: 120 * k + 1, color: RD, rot: -0.08 }); if (run.t > 0.6) text(x, 'nothing to test: it could not be built', 430, 232, { size: 26, color: RD, rot: -0.03 });
        if (!run.verdict && run.t > 1.2) verdict();
        return run.t < 1.4;
      }
      sc.live(x, run.t, run.res.mode, now);
      if (!run.verdict && run.t >= BR[i].D) verdict();
      return run.t < BR[i].D + 2.5 || i === 0;
    };
    sync();

    // ---- written answer ----
    ui.p('Finally, one to explain in words. <span class="small">(The test bench blurs while you write.)</span>');
    const wr = ui.write({
      id: 'p08.explain', label: 'Explain why CFRP is used for racing bike frames despite its cost', marks: 3, lines: 5,
      q: 'Explain why <b>CFRP</b> is used for <b>racing bike frames</b> even though it is expensive.',
      scheme: ['It is <b>extremely strong</b> (stronger than steel), so the frame can take the forces of racing without breaking', 'It is very <b>lightweight</b> (much lighter than steel), so the bike is faster / easier to accelerate and to ride uphill', 'It is very <b>stiff</b> for its weight, so the frame does not flex, OR: in racing the better performance is worth the high cost'],
      model: 'CFRP is extremely strong and stiff for its weight: it is stronger than steel but much lighter. A lighter frame is quicker to accelerate and easier to ride uphill, and the stiff frame does not flex when the rider pushes hard. In racing that extra performance is worth the high cost.',
    });
    const ta = wr.querySelector('textarea'), wb = wr.querySelector('.btn');
    ta.addEventListener('focus', () => { if (!wr.querySelector('.scheme.on')) bench.classList.add('recall'); });
    ta.addEventListener('blur', () => { if (!ta.value.trim()) bench.classList.remove('recall'); });
    wb.addEventListener('click', () => setTimeout(() => { if (wr.querySelector('.scheme.on')) bench.classList.remove('recall'); }, 30));
  } });
})();
