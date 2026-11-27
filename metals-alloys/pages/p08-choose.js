// Page 8 — Choose the metal. Six design briefs. For each one the student picks a metal from all ten and presses TEST:
// a pen-drawn scene shows the product working, or failing for a reason you can see (too heavy, rusts, too soft,
// cracks, melts...). Every sensible metal is accepted; every test is recorded. Then a 3-mark written answer.
(function () {
  'use strict';
  const B = Ink.BLUE, RD = Ink.RED, GR = Ink.GREEN, rgba = Ink.rgba, geo = Ink.geo;
  const HANDF = (s) => `400 ${s}px "Gloria Hallelujah", "Comic Sans MS", cursive`;
  const LABF = (s) => `600 ${s}px Fredoka, "Arial Rounded MT Bold", system-ui, sans-serif`;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const win = (p, a, b) => clamp((p - a) / (b - a));
  const ease = (k) => k * k * (3 - 2 * k);
  const TAU = Math.PI * 2;
  const RUST = [176, 84, 30], AMBER = [255, 190, 40], GREENISH = [70, 150, 120], WATER = [90, 150, 230];
  function text(x, s, px, py, o = {}) {
    x.save(); x.font = (o.font === 'hand' ? HANDF : LABF)(o.size || 22);
    x.fillStyle = rgba(o.color || B, o.a ?? 0.92); x.textAlign = o.align || 'left'; x.textBaseline = 'alphabetic';
    x.fillText(s, px, py); x.restore();
  }
  // a quick wobbly biro line (cheap enough to redraw every frame)
  function pen(x, pts, o = {}) {
    const P = o.wob === false ? pts : geo.wob(geo.seg(pts, 4), o.seed ?? 11, o.amp ?? 0.7);
    x.save(); x.strokeStyle = rgba(o.color || B, o.a ?? 0.88); x.lineWidth = o.w ?? 2.2; x.lineCap = 'round'; x.lineJoin = 'round';
    x.beginPath(); P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); if (o.close) x.closePath(); x.stroke(); x.restore();
  }
  const path = (x, P) => { x.beginPath(); P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.closePath(); };
  const fillP = (x, P, style) => { x.save(); x.fillStyle = style; path(x, P); x.fill(); x.restore(); };
  const box = (x0, y0, w, h) => [[x0, y0], [x0 + w, y0], [x0 + w, y0 + h], [x0, y0 + h]];
  const disc = (x, cx, cy, r, col, a = 0.9) => { x.save(); x.fillStyle = rgba(col, a); x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill(); x.restore(); };
  const hatch = (x, P, a = 0.4, gap = 6) => { // light 45° pen shading inside a shape
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; P.forEach(([a2, b]) => { x0 = Math.min(x0, a2); x1 = Math.max(x1, a2); y0 = Math.min(y0, b); y1 = Math.max(y1, b); });
    x.save(); path(x, P); x.clip(); x.strokeStyle = rgba(B, a); x.lineWidth = 1; x.beginPath(); for (let k = x0 - (y1 - y0); k < x1; k += gap) { x.moveTo(k, y1); x.lineTo(k + (y1 - y0), y0); } x.stroke(); x.restore();
  };
  const glow = (x, cx, cy, r, col, a) => {
    if (a <= 0.01) return; const g = x.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, rgba(col, 0.95 * a)); g.addColorStop(0.45, rgba(col, 0.4 * a)); g.addColorStop(1, rgba(col, 0));
    x.save(); x.fillStyle = g; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill(); x.restore();
  };
  // blotches (rust, patina) that spread inside a shape as e goes 0 → 1
  function blots(x, P, e, seed, n, col) {
    if (e <= 0) return; let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; P.forEach(([a, b]) => { x0 = Math.min(x0, a); x1 = Math.max(x1, a); y0 = Math.min(y0, b); y1 = Math.max(y1, b); });
    const r = H.rng(seed); x.save(); path(x, P); x.clip();
    for (let i = 0; i < n; i++) { const cx = r.range(x0, x1), cy = r.range(y0, y1), R = r.range(5, 15), rot = r() * 3, born = (i / n) * 0.7; const k = clamp((e - born) / 0.3); if (k <= 0) continue; x.fillStyle = rgba(col, 0.5); x.beginPath(); x.ellipse(cx, cy, R * k, R * 0.7 * k, rot, 0, 7); x.fill(); x.fillStyle = rgba(col, 0.35); x.beginPath(); x.ellipse(cx + 3, cy + 2, R * 0.5 * k, R * 0.4 * k, rot + 1, 0, 7); x.fill(); }
    x.restore();
  }
  const sparkle = (x, cx, cy, s, a, seed = 3) => { if (a <= 0) return; [[0, -1], [1, 0], [0, 1], [-1, 0]].forEach(([dx, dy], i) => pen(x, [[cx + dx * s * 0.25, cy + dy * s * 0.25], [cx + dx * s, cy + dy * s]], { seed: seed + i, w: 2, a: 0.8 * a, color: GR, amp: 0.2 })); [[0.7, -0.7], [0.7, 0.7], [-0.7, 0.7], [-0.7, -0.7]].forEach(([dx, dy], i) => pen(x, [[cx + dx * s * 0.3, cy + dy * s * 0.3], [cx + dx * s * 0.6, cy + dy * s * 0.6]], { seed: seed + 5 + i, w: 1.4, a: 0.6 * a, color: GR, amp: 0.2 })); };
  const burst = (x, cx, cy, r, a, seed = 5) => { if (a <= 0) return; for (let i = 0; i < 8; i++) { const an = i * TAU / 8 + 0.3; pen(x, [[cx + Math.cos(an) * r * 0.45, cy + Math.sin(an) * r * 0.45], [cx + Math.cos(an) * r, cy + Math.sin(an) * r]], { seed: seed + i, w: 2.4, color: RD, a: 0.9 * a, amp: 0.3 }); } };
  const zig = (x, pts, e, seed = 7) => { if (e <= 0) return; const P = geo.seg(pts, 3); pen(x, P.slice(0, Math.max(2, Math.ceil(P.length * e))), { seed, w: 2.6, color: RD, amp: 0.2, wob: false }); };
  const heat = (x, cx, cy, t, a, seed = 3) => { if (a <= 0) return; for (let i = -1; i <= 1; i++) { const P = []; for (let k = 0; k <= 10; k++) P.push([cx + i * 14 + Math.sin(k * 1.3 + t * 6 + i) * 4, cy - k * 3.4]); pen(x, P, { seed: seed + i, w: 1.8, color: RD, a: 0.75 * a, wob: false }); } };
  const drop = (x, cx, cy, r, col, a = 0.8) => { const P = [[cx, cy - r * 1.7]].concat(geo.ellipse(cx, cy, r, r, -0.6, Math.PI + 0.6)); fillP(x, P, rgba(col, 0.55 * a)); pen(x, P, { close: true, seed: 3, w: 1.4, a, amp: 0.2, color: col === WATER ? B : col }); };
  function priceTag(x, cx, cy, k) {
    if (k <= 0) return; x.save(); x.translate(cx, cy); x.rotate(-0.12); x.scale(k, k);
    const P = [[-66, -24], [50, -24], [70, 0], [50, 24], [-66, 24]]; fillP(x, P, 'rgba(255,236,120,0.9)'); pen(x, P, { close: true, seed: 5, w: 2.4, color: RD, amp: 0.4 });
    pen(x, geo.ellipse(52, 0, 5, 5), { seed: 7, w: 1.6, color: RD }); text(x, '£ £ £', -8, 10, { size: 30, color: RD, align: 'center' }); x.restore();
  }
  const caption = (x, s, a, cx = 430) => { if (a > 0) text(x, s, cx, 40, { font: 'hand', size: 24, align: 'center', a: 0.85 * a }); };

  // ---------------------------------------------------------------------------------------------------------
  // the ten metals. grp: F = ferrous metals, N = non-ferrous metals, A = alloys
  // ---------------------------------------------------------------------------------------------------------
  const MET = {
    al: { name: 'Aluminium', col: [196, 203, 212], grp: 'N' },
    brass: { name: 'Brass', col: [226, 184, 58], grp: 'A' },
    ci: { name: 'Cast iron', col: [92, 94, 102], grp: 'F' },
    cu: { name: 'Copper', col: [202, 110, 70], grp: 'N' },
    hcs: { name: 'High carbon steel', col: [132, 136, 148], grp: 'F' },
    hss: { name: 'High speed steel', col: [112, 118, 136], grp: 'A' },
    lcs: { name: 'Low carbon steel', col: [156, 159, 166], grp: 'F' },
    ss: { name: 'Stainless steel', col: [184, 194, 208], grp: 'A' },
    sn: { name: 'Tin', col: [222, 227, 232], grp: 'N' },
    zn: { name: 'Zinc', col: [146, 168, 198], grp: 'N' },
  };
  const NAMES = ['al', 'brass', 'ci', 'cu', 'hcs', 'hss', 'lcs', 'ss', 'sn', 'zn'];
  const MISTAG = { F: 'steel-mixup', N: 'nonferrous-mixup', A: 'alloy-mixup' };
  const WHAT = { W: 'works', A: 'works', heavy: 'too heavy', rust: 'rusts', soft: 'too soft', blunt: 'goes blunt', crack: 'cracks', snap: 'snaps', melt: 'melts', hot: 'poor conductor', cost: 'too costly' };
  const okCode = (c) => c === 'W' || c === 'A';

  // the briefs. v[metal] = [what happens, the explanation]. W = the metal really used, A = another sensible choice.
  const BR = [
    { n: 1, tab: 'Wing skin', short: 'aircraft wing skin', go: 'TEST: take off ▸', dur: 4.6, best: 'al',
      text: 'The <b>skin of an aircraft wing</b>: big thin sheets that have to fly, in all weathers, for 30 years.',
      hint: 'Which metal has a really low density?',
      v: {
        al: ['W', 'Lift-off! Aluminium has a low density (about a third of steel), so the plane is light enough to fly. It is corrosion-resistant too: a thin oxide layer protects it.'],
        lcs: ['heavy', 'Too heavy to take off! A steel skin has nearly three times the mass of the lightest metal here, and low carbon steel rusts easily.'],
        hcs: ['heavy', 'Too heavy to take off! Steel has a high density (7.8 g/cm³). Being very hard does not help a wing skin.'],
        ci: ['heavy', 'Too heavy to take off! Cast iron is heavy, and brittle too: it could crack.'],
        cu: ['heavy', 'Too heavy to take off! Copper is the densest metal on the shelf (8.9 g/cm³).'],
        sn: ['heavy', 'Too heavy to take off! Tin is dense (7.3 g/cm³), and soft and weak as well.'],
        zn: ['heavy', 'Too heavy to take off! Zinc is dense (7.1 g/cm³), and fairly weak and brittle.'],
        brass: ['heavy', 'Too heavy to take off! Brass is dense (8.5 g/cm³).'],
        ss: ['heavy', 'Too heavy to take off! Stainless steel will not rust, but it is still steel: far too dense.'],
        hss: ['heavy', 'Too heavy to take off! High speed steel is still steel: far too dense.'],
      } },
    { n: 2, tab: 'Sink', short: 'kitchen sink', go: 'TEST: a year of washing-up ▸', dur: 5, best: 'ss',
      text: 'A <b>kitchen sink</b>: wet every single day, bashed by heavy pans, and it must be easy to keep clean.',
      hint: 'Think: it must not rust, and it must be hard and tough.',
      v: {
        ss: ['W', 'Still gleaming after a year! Stainless steel does not rust, it is hard and tough enough for heavy pans, and it is hygienic.'],
        brass: ['A', 'It works: brass is corrosion-resistant and harder than copper. Real sinks are nearly always stainless steel, though: hard, tough, shiny and hygienic.'],
        lcs: ['rust', 'Rust! Low carbon steel rusts easily, and a sink always has water and air on it.'],
        hcs: ['rust', 'Rust! High carbon steel is very hard, but it still rusts where there is water and air.'],
        ci: ['rust', 'Rust! Cast iron rusts where there is water and air. It is brittle too: a dropped pan could crack it.'],
        hss: ['rust', 'Rust! High speed steel is made to stay hard when it is hot, not to stand up to water. It is ferrous, and it rusts.'],
        al: ['soft', 'No rust, but look at the dents and scratches! Aluminium is soft, so heavy pans soon batter it.'],
        cu: ['soft', 'No rust, but it is dented and slowly turning green. Copper is very malleable, so heavy pans knock it out of shape.'],
        sn: ['soft', 'No rust, but it is battered out of shape. Tin is soft and weak.'],
        zn: ['crack', 'No rust, but it has cracked! Zinc is fairly weak and brittle: the heavy pan was too much for it.'],
      } },
    { n: 3, tab: 'Drill bit', short: 'drill bit', go: 'TEST: drill the steel plate ▸', dur: 4.8, best: 'hss',
      text: 'A <b>drill bit</b> for a workshop machine: it cuts holes in steel all day, spinning fast and getting very hot.',
      hint: 'Think: which metals are made for cutting tools?',
      v: {
        hss: ['W', 'Straight through! High speed steel is very hard and wear-resistant, and it stays hard even when it is red hot from friction.'],
        hcs: ['A', 'It cuts! High carbon steel is very hard and keeps a sharp edge, so it is used for drill bits. For fast machine drilling there is an even better choice: an alloy that stays hard when it is red hot.'],
        lcs: ['blunt', 'Blunt already! Low carbon steel is no harder than the plate it is trying to cut, so the tip just rubs and wears away.'],
        ss: ['blunt', 'It soon went blunt. Stainless steel is hard, but not hard enough to keep a cutting edge against hot steel.'],
        ci: ['crack', 'Snap! Cast iron is hard but brittle: the twisting force cracked it.'],
        al: ['blunt', 'The tip has squashed flat! Aluminium is soft: far softer than the steel plate.'],
        cu: ['blunt', 'The tip has squashed flat! Copper is very malleable: far too soft to cut steel.'],
        brass: ['blunt', 'The tip has worn flat. Brass is harder than copper, but nowhere near hard enough to cut steel.'],
        zn: ['crack', 'Snap! Zinc is fairly weak and brittle.'],
        sn: ['melt', 'It melted! Tin melts at only 232 °C, and drilling makes a lot of heat from friction. It is soft and weak too.'],
      } },
    { n: 4, tab: 'Wiring', short: 'house wiring', go: 'TEST: switch on ▸', dur: 4.6, best: 'cu',
      text: 'The <b>wiring inside the walls of a house</b>: it carries electricity to every light and socket, and it has to bend round corners.',
      hint: 'Think: which metal is the best conductor of electricity, and bends easily?',
      v: {
        cu: ['W', 'Bright light! Copper is an excellent conductor of electricity, and so ductile that it is easily drawn into wire and bent round corners.'],
        al: ['A', 'The light is on: aluminium is a good conductor, and ductile. For house wiring electricians still pick a different metal, because it conducts even better.'],
        lcs: ['hot', 'Dim lamp, hot wire! Steel is a much poorer conductor than the best metals, so energy is wasted as heat. It rusts, too.'],
        hcs: ['hot', 'Dim lamp, hot wire! Steel is a much poorer conductor than the best metals. High carbon steel is also less ductile: hard to bend round corners.'],
        ss: ['hot', 'Dim lamp, hot wire! Stainless steel is a much poorer conductor than the best metals, and it is expensive.'],
        hss: ['hot', 'Dim lamp, hot wire! High speed steel is a much poorer conductor than the best metals, and very hard to make into wire.'],
        brass: ['hot', 'It conducts (brass is a good conductor), but not as well as the best metal for this job, so the wire warms up. Brass is also harder, so it is less easy to bend.'],
        ci: ['crack', 'It snapped at the first corner! Cast iron is brittle: it cannot be bent.'],
        zn: ['crack', 'It snapped at the corner! Zinc is fairly weak and brittle: no good for bending.'],
        sn: ['snap', 'It stretched and snapped as it was pulled through the wall. Tin is soft and weak.'],
      } },
    { n: 5, tab: 'Vice', short: 'vice body', go: 'TEST: tighten it hard ▸', dur: 5, best: 'ci',
      text: 'The <b>body of a workshop vice</b>: a chunky, complicated shape that gets squeezed really hard every day. Made by the thousand, so it must be cheap.',
      hint: 'Think: strong when it is squeezed, cheap, and easy to cast into a complicated shape.',
      v: {
        ci: ['W', 'Rock solid! Cast iron is very strong in compression (squeezing), it is cheap, and it melts and pours well, so the complicated shape is easy to cast.'],
        lcs: ['A', 'It holds! Low carbon steel is tough and strong. Most vice bodies use a different ferrous metal, though: one that pours easily into a mould to make this complicated shape.'],
        hcs: ['A', 'It holds! High carbon steel is hard and strong. Most vice bodies use a different ferrous metal, though: one that pours easily into a mould to make this complicated shape.'],
        ss: ['cost', 'It holds, but nobody would buy it! Stainless steel is expensive, and hard to cut and shape. A vice body has no need to be shiny.'],
        hss: ['cost', 'It holds, but what a waste! High speed steel is a special alloy for cutting tools (with tungsten, chromium and vanadium): costly, and very hard to shape.'],
        al: ['soft', 'The jaw is bending! Aluminium is soft: it cannot take that squeeze.'],
        cu: ['soft', 'The jaw is bending! Copper is very malleable: squeeze it hard and it changes shape.'],
        sn: ['soft', 'The jaw has squashed out of shape! Tin is soft and weak.'],
        brass: ['soft', 'The jaw is bending. Brass is harder than copper, but not strong enough for a squeeze like this.'],
        zn: ['crack', 'Crack! Zinc is fairly weak and brittle.'],
      } },
    { n: 6, tab: 'Tap', short: 'bathroom tap', go: 'TEST: ten years of use ▸', dur: 5, best: 'brass',
      text: 'A <b>bathroom tap</b>: full of water for years, turned on and off every day, with a detailed shape and a screw thread inside.',
      hint: 'Think: it must not rust, and it must cast and machine easily.',
      v: {
        brass: ['W', 'Still working, and no rust! Brass is corrosion-resistant and harder than copper, and it casts and machines well, so the detailed shape and thread are easy to make.'],
        ss: ['A', 'It works: stainless steel does not rust. Most taps use a different alloy, though, because stainless steel is hard to cut and shape, and expensive.'],
        cu: ['soft', 'No rust, but the thread has worn and now it drips. Copper is not hard enough for a thread that is turned every day.'],
        al: ['soft', 'No rust, but the thread has worn away and now it drips. Aluminium is soft.'],
        sn: ['soft', 'It has worn and bent out of shape, and now it drips. Tin is soft and weak.'],
        zn: ['crack', 'The handle snapped off! Zinc is fairly weak and brittle.'],
        lcs: ['rust', 'Rusty water! Low carbon steel is ferrous: it rusts easily when it meets water and air, and a tap has plenty of both.'],
        hcs: ['rust', 'Rusty water! High carbon steel is ferrous: it rusts when it meets water and air, and a tap has plenty of both.'],
        ci: ['rust', 'Rusty water! Cast iron is ferrous: it rusts when it meets water and air, and a tap has plenty of both.'],
        hss: ['rust', 'Rusty water! High speed steel is ferrous, and it is not made to resist water: it rusts.'],
      } },
  ];
  function misFor(b, m) {
    const R = BR[b - 1], code = R.v[m][0];
    if (okCode(code)) return '';
    if (MET[m].grp === MET[R.best].grp) return MISTAG[MET[m].grp];
    if (code === 'rust') return 'ferrous-meaning';
    return MISTAG[MET[m].grp];
  }
  // mass of a 10 000 cm³ wing skin panel in kg (density × 10), for the metals whose density is on the content sheet
  const PANEL = { al: 27, lcs: 78, hcs: 78, cu: 89, sn: 73, zn: 71, brass: 85 };

  // =========================================================================================================
  // the six scenes (860 × 300). s = { m, col, out, p (0..1 through the test), t (seconds) }
  // =========================================================================================================
  const W = 860, Hh = 300;
  const tint = (x, P, s, a = 0.55) => { if (s.col) fillP(x, P, rgba(s.col, a)); };
  const SCENES = {
    // ---- 1: take-off ----
    1(x, s) {
      const p = s.p, ok = okCode(s.out), G = 246;
      pen(x, [[20, G], [840, G]], { seed: 3, w: 2.6 });
      for (let k = 60; k < 800; k += 90) pen(x, [[k, G + 16], [k + 44, G + 16]], { seed: 5 + k, w: 2, a: 0.5 });
      [[470, 92], [680, 66]].forEach(([cx, cy], i) => pen(x, geo.curve([cx - 44, cy], [cx - 40, cy - 30], [cx - 4, cy - 34], [cx, cy - 14], 12).concat(geo.curve([cx, cy - 14], [cx + 14, cy - 36], [cx + 50, cy - 26], [cx + 46, cy], 12), [[cx - 44, cy]]), { seed: 9 + i, w: 1.6, a: 0.5 }));
      // fence at the end of the runway
      [800, 816, 832].forEach((fx, i) => pen(x, [[fx, G], [fx, G - 34]], { seed: 13 + i, w: 2.2 })); pen(x, [[794, G - 26], [838, G - 26]], { seed: 17 }); pen(x, [[794, G - 12], [838, G - 12]], { seed: 19 });
      let px = 120, py = G - 24, ang = 0;
      if (s.out) {
        if (ok) { const r = ease(win(p, 0, 0.5)), c = win(p, 0.42, 1); px = 120 + r * 300 + c * 290; py = G - 24 - c * c * 112; ang = -0.3 * ease(win(p, 0.4, 0.6)); }
        else { const r = win(p, 0, 0.82); px = 120 + (1 - (1 - r) * (1 - r)) * 560; ang = 0.07 * Math.sin(win(p, 0.8, 1) * Math.PI) + 0.03 * win(p, 0.85, 1); py = G - 24 + Math.sin(p * 60) * 1.2 * (1 - win(p, 0.8, 1)); }
      }
      x.save(); x.translate(px, py); x.rotate(ang);
      const fus = geo.curve([-86, 0], [-70, -20], [30, -22], [74, -2], 16).concat(geo.curve([74, -2], [60, 12], [-40, 14], [-86, 0], 16));
      const fin = [[-82, -4], [-100, -40], [-80, -40], [-58, -12]], wing = [[-6, 2], [26, 2], [-22, 40], [-44, 40]];
      fillP(x, fus, 'rgba(251,250,245,1)'); hatch(x, geo.curve([-86, 0], [-40, 6], [40, 6], [74, -2], 10).concat(geo.curve([74, -2], [60, 12], [-40, 14], [-86, 0], 10)), 0.3);
      pen(x, fus, { close: true, seed: 3, w: 2.4, amp: 0.4 }); pen(x, fin, { close: true, seed: 5, w: 2.2, amp: 0.4 }); hatch(x, fin, 0.3);
      for (let k = -40; k <= 30; k += 14) disc(x, k, -9, 2.4, B, 0.7);
      pen(x, [[50, -10], [62, -8], [56, -3], [46, -4]], { close: true, seed: 7, w: 1.6, amp: 0.3 });
      if (!ok || p < 0.5) { [[36, 20], [-34, 20]].forEach(([wx, wy], i) => { pen(x, [[wx, wy - 10], [wx, wy]], { seed: 9 + i, w: 2 }); pen(x, geo.ellipse(wx, wy, 5, 5), { seed: 11 + i, w: 2.2, amp: 0.2 }); }); }
      fillP(x, wing, 'rgba(251,250,245,1)'); tint(x, wing, s, 0.7); pen(x, wing, { close: true, seed: 13, w: 2.6, amp: 0.4 }); pen(x, [[2, 10], [-30, 36]], { seed: 15, w: 1.2, a: 0.5 });
      x.restore();
      if (s.out) {
        const a = win(p, 0.12, 0.25), kg = PANEL[s.m];
        if (a > 0) { text(x, 'wing skin: ' + (kg ? kg + ' kg' : 'far too heavy'), 30, 40, { size: 24, color: ok ? GR : RD, a }); text(x, 'most it can be to fly: 30 kg', 30, 70, { font: 'hand', size: 22, a: 0.8 * a }); }
        if (!ok) { const e = win(p, 0.84, 1); burst(x, 786, G - 50, 26, e * (1 - win(p, 0.97, 1) * 0.5)); if (e > 0) [[px - 110, G - 8], [px - 130, G - 16], [px - 150, G - 6]].forEach(([dx, dy], i) => pen(x, geo.ellipse(dx, dy, 8 + i * 2, 6), { seed: 21 + i, w: 1.4, a: 0.5 * e })); }
        else { const e = win(p, 0.5, 0.8); for (let i = 0; i < 3; i++) pen(x, [[px - 120 - i * 26, py + 8 + i * 5], [px - 170 - i * 26, py + 20 + i * 7]], { seed: 23 + i, w: 1.6, a: 0.5 * e }); }
      }
    },
    // ---- 2: kitchen sink ----
    2(x, s) {
      const p = s.p, e = s.out ? win(p, 0.62, 1) : 0, ok = okCode(s.out), dent = s.out === 'soft' ? ease(win(p, 0.38, 0.5)) : 0;
      const top = box(70, 118, 720, 22);
      const bowl = [[250, 140], [610, 140], [584 + dent * 6, 196], [578, 246], [500, 246 + dent * 12], [440, 246 + dent * 24], [380, 246 + dent * 9], [282, 246], [272 - dent * 7, 190]];
      hatch(x, top, 0.3); pen(x, top, { close: true, seed: 3, w: 2.4 });
      fillP(x, bowl, 'rgba(251,250,245,1)'); tint(x, bowl, s, 0.6); pen(x, bowl.slice(1).concat([bowl[0]]), { seed: 4, w: 2.4, amp: 0.4 }); tint(x, box(230, 112, 400, 8), s, 0.6); pen(x, box(230, 112, 400, 8), { close: true, seed: 5, w: 2, amp: 0.4 });
      pen(x, [[420, 248 + dent * 22], [420, 290]], { seed: 7 }); pen(x, [[448, 248 + dent * 22], [448, 290]], { seed: 9 });
      // cupboard below
      pen(x, [[90, 140], [90, 296]], { seed: 11, w: 2 }); pen(x, [[770, 140], [770, 296]], { seed: 13, w: 2 });
      // the tap
      const stem = box(520, 52, 16, 60), spout = geo.curve([528, 52], [528, 22], [440, 22], [440, 56], 16);
      hatch(x, stem, 0.35); pen(x, stem, { close: true, seed: 15, w: 2.2, amp: 0.4 }); pen(x, spout, { seed: 17, w: 5.5, a: 0.8 }); pen(x, [[540, 70], [562, 60]], { seed: 19, w: 3 });
      const run = s.out ? win(p, 0.04, 0.1) * (1 - win(p, 0.52, 0.6)) : 0;
      if (run > 0) for (let i = -1; i <= 1; i++) { const P = []; for (let k = 0; k <= 12; k++) P.push([440 + i * 4 + Math.sin(k * 1.1 + s.t * 14 + i) * 1.6, 60 + k * (182 / 12) * run]); pen(x, P, { seed: 21 + i, w: 1.8, color: WATER, a: 0.8, wob: false }); }
      if (s.out === 'rust') { blots(x, bowl, e, 31, 26, RUST); [[330, 150], [520, 160], [400, 170]].forEach(([dx, dy], i) => pen(x, [[dx, dy], [dx + 3, dy + 50 * e]], { seed: 33 + i, w: 2, color: RUST, a: 0.6 * e })); }
      if (s.out === 'soft') { [[330, 200, 30], [520, 190, 24], [450, 226, 34]].forEach(([dx, dy, r], i) => { pen(x, geo.ellipse(dx, dy, r, r * 0.5, 0.2, 2.9), { seed: 35 + i, w: 1.8, a: 0.8 * dent }); pen(x, [[dx - r, dy - 22], [dx - r + 30, dy - 30]], { seed: 39 + i, w: 1.2, a: 0.6 * dent }); }); if (s.m === 'cu') blots(x, bowl, e, 41, 18, GREENISH); }
      if (s.out === 'crack') { const c = win(p, 0.38, 0.5); zig(x, [[440, 246], [452, 222], [436, 204], [458, 182], [444, 160], [462, 141]], c); zig(x, [[440, 246], [410, 238], [396, 216], [366, 208]], c, 9); const d = win(p, 0.55, 1); if (d > 0) [0, 0.33, 0.66].forEach((o, i) => { const k = (d * 3 + o) % 1; drop(x, 434 + i * 6 - 20, 256 + k * 36, 4, WATER, 1 - k); }); }
      if (ok) [[320, 176, 16], [540, 170, 13], [430, 212, 18], [600, 100, 10]].forEach(([dx, dy, r], i) => sparkle(x, dx, dy, r, e, 43 + i * 9));
      // the heavy pan drops in
      if (s.out) { const k = win(p, 0.2, 0.38), up = win(p, 0.5, 0.62); if (k > 0 && up < 1) { const py = -60 + k * k * (300 + dent * 10) - up * 320 - Math.sin(win(p, 0.38, 0.5) * Math.PI) * 14; x.save(); x.translate(330, py - 76); const pan = [[0, 0], [110, 0], [102, 44], [8, 44]]; fillP(x, pan, 'rgba(251,250,245,1)'); hatch(x, pan, 0.45, 5); pen(x, pan, { close: true, seed: 51, w: 2.4, amp: 0.4 }); pen(x, [[110, 8], [176, 2]], { seed: 53, w: 5 }); x.restore(); burst(x, 440, 240, 30, Math.sin(win(p, 0.37, 0.46) * Math.PI)); } }
      caption(x, '1 year later…', s.out ? win(p, 0.6, 0.68) : 0, 220);
    },
    // ---- 3: drilling ----
    3(x, s) {
      const p = s.p, ok = okCode(s.out), o = s.out;
      const plate = box(220, 206, 420, 34), table = box(180, 240, 500, 16);
      hatch(x, table, 0.3); pen(x, table, { close: true, seed: 3, w: 2.2 }); pen(x, [[260, 256], [260, 296]], { seed: 5, w: 2.4 }); pen(x, [[600, 256], [600, 296]], { seed: 7, w: 2.4 });
      fillP(x, plate, 'rgba(150,153,161,0.4)'); hatch(x, plate, 0.4, 5); pen(x, plate, { close: true, seed: 9, w: 2.4 });
      text(x, 'steel plate', 652, 232, { font: 'hand', size: 22, a: 0.7 });
      let dy = 0, cut = 0;
      if (o) { dy = 22 * ease(win(p, 0, 0.22)); if (ok) { cut = win(p, 0.24, 0.72); dy += cut * 46 - ease(win(p, 0.8, 1)) * 60; } else dy += 2 * win(p, 0.24, 0.4) - (o === 'crack' ? 0 : ease(win(p, 0.86, 1)) * 14); }
      const fe = !o || ok ? 0 : o === 'crack' ? win(p, 0.36, 0.42) : win(p, 0.3, 0.8); // how far the failure has gone
      if (ok && cut > 0) { fillP(x, box(421, 206, 18, 34 * Math.min(1, cut * 1.1)), 'rgba(251,250,245,1)'); x.save(); x.globalCompositeOperation = 'destination-out'; x.fillStyle = '#000'; x.fillRect(422, 206, 16, 34 * Math.min(1, cut * 1.1)); x.restore(); pen(x, [[421, 206], [421, 206 + 34 * Math.min(1, cut * 1.1)]], { seed: 11, w: 1.6 }); pen(x, [[439, 206], [439, 206 + 34 * Math.min(1, cut * 1.1)]], { seed: 13, w: 1.6 }); }
      // the chuck
      x.save(); x.translate(0, dy);
      const body = box(392, -40, 76, 96), jaws = [[400, 56], [460, 56], [444, 82], [416, 82]];
      fillP(x, body, 'rgba(251,250,245,1)'); hatch(x, body, 0.35); pen(x, body, { close: true, seed: 15, w: 2.4 }); fillP(x, jaws, 'rgba(251,250,245,1)'); pen(x, jaws, { close: true, seed: 17, w: 2.4, amp: 0.4 });
      [408, 424, 440, 456].forEach((kx, i) => pen(x, [[kx, 40], [kx, 54]], { seed: 19 + i, w: 1.4, a: 0.6 }));
      // the bit: 14 wide, from y = 82 to the tip at y = 184
      let len = 90, tipH = 12, wide = 0, droop = 0;
      if (o === 'blunt') { len = 90 - 12 * fe; tipH = 12 * (1 - fe); wide = 5 * fe; }
      if (o === 'melt') { len = 90 - 46 * fe; tipH = 6 * (1 - fe); droop = fe; }
      if (o === 'crack' && fe > 0) { len = 44; tipH = 0; }
      const bx = 423, by = 82, spin = o && p < 0.84 && (ok || fe < 1) ? s.t * 60 : 0;
      const bit = [[bx, by], [bx + 14, by], [bx + 14 + wide, by + len], [bx + 7, by + len + tipH], [bx - wide, by + len]];
      fillP(x, bit, 'rgba(251,250,245,1)'); tint(x, bit, s, 0.65);
      x.save(); path(x, bit); x.clip(); x.strokeStyle = rgba(B, 0.75); x.lineWidth = 1.6; x.beginPath(); for (let k = -30 + (spin % 16); k < len + 30; k += 16) { x.moveTo(bx - 6, by + k + 12); x.lineTo(bx + 20, by + k - 6); } x.stroke(); x.restore();
      pen(x, bit, { close: true, seed: 23, w: 2.2, amp: o === 'crack' && fe > 0 ? 1.2 : 0.3 });
      if (o === 'melt' && droop > 0) { [0, 0.5].forEach((off, i) => { const k = (droop * 4 + off) % 1; drop(x, bx + 4 + i * 6, by + len + 8 + k * (184 - 82 - len), 4.5, s.col, 1); }); }
      if (s.m === 'hcs' && ok && cut > 0.3 && p < 0.8) glow(x, bx + 7, by + len - 4, 26, [240, 110, 30], 0.6);
      x.restore();
      // what the cutting looks like
      if (ok && cut > 0 && cut < 1) for (let i = 0; i < 4; i++) { const k = (s.t * 1.6 + i / 4) % 1, sd = i % 2 ? 1 : -1; const cx = 430 + sd * (16 + k * 60), cy = 204 - Math.sin(k * Math.PI) * 44; pen(x, geo.ellipse(cx, cy, 6, 6, k * 9, k * 9 + 4.6), { seed: 31 + i, w: 2, a: 1 - k, amp: 0.2 }); }
      if (o === 'blunt') { heat(x, 400, 196, s.t, fe * (1 - win(p, 0.9, 1))); heat(x, 462, 196, s.t + 1, fe * (1 - win(p, 0.9, 1)), 9); pen(x, [[422, 207], [438, 207]], { seed: 35, w: 2.4, a: fe }); }
      if (o === 'melt') { const pud = geo.ellipse(430, 204, 10 + 30 * fe, 2 + 5 * fe, 0, TAU); if (fe > 0) { fillP(x, pud, rgba(s.col, 0.8)); pen(x, pud, { close: true, seed: 37, w: 1.8, amp: 0.3 }); } heat(x, 470, 190, s.t, fe); heat(x, 388, 190, s.t + 2, fe, 9); }
      if (o === 'crack' && fe > 0) { const f = win(p, 0.36, 0.7), fx = 437 + f * 150, fy = 150 + dy - Math.sin(f * Math.PI) * 60 + f * 44; x.save(); x.translate(fx, fy); x.rotate(f * 7.4); const piece = [[-7, -22], [7, -22], [7, 18], [0, 28], [-7, 18]]; fillP(x, piece, 'rgba(251,250,245,1)'); tint(x, piece, s, 0.65); pen(x, piece, { close: true, seed: 41, w: 2, amp: 0.8 }); x.restore(); burst(x, 430, 130 + dy, 30, Math.sin(win(p, 0.36, 0.56) * Math.PI)); }
    },
    // ---- 4: house wiring ----
    4(x, s) {
      const p = s.p, o = s.out, ok = okCode(o), on = o ? win(p, 0.1, 0.16) : 0;
      pen(x, [[20, 44], [840, 44]], { seed: 3, w: 2.6 }); hatch(x, box(20, 30, 820, 14), 0.3);
      pen(x, [[60, 44], [60, 296]], { seed: 5, w: 2.2 }); [[60, 110, 90], [60, 190, 60], [60, 260, 80]].forEach(([ax, ay, l], i) => pen(x, [[ax, ay], [ax + l, ay]], { seed: 7 + i, w: 1.2, a: 0.35 }));
      const route = [[190, 214], [190, 86], [640, 86], [640, 128]];
      const brk = o === 'crack' ? [190, 86] : o === 'snap' ? [420, 86] : null; // where the wire has failed
      const P = geo.seg(route, 4), L = P.length;
      const drawWire = (a, b) => { const Q = P.slice(Math.floor(a * L), Math.max(Math.floor(a * L) + 2, Math.ceil(b * L))); if (s.col) pen(x, Q, { wob: false, w: 9, color: s.col, a: 0.75 }); pen(x, Q.map(([u, v]) => [u - 3.5, v - 3.5]), { seed: 13, w: 1.6, amp: 0.4 }); pen(x, Q.map(([u, v]) => [u + 3.5, v + 3.5]), { seed: 15, w: 1.6, amp: 0.4 }); };
      let stop = 1;
      if (brk) { const i = P.findIndex(([u, v]) => Math.abs(u - brk[0]) < 3 && Math.abs(v - brk[1]) < 3); stop = i / L; const gap = o === 'snap' ? 0.035 : 0.022; drawWire(0, stop - gap); drawWire(stop + gap, 1); burst(x, brk[0] + (o === 'snap' ? 0 : 4), brk[1] - (o === 'snap' ? 0 : 4), 26, 0.9); if (o === 'snap') { pen(x, [[392, 80], [410, 85]], { seed: 17, w: 1.4 }); pen(x, [[392, 92], [410, 87]], { seed: 19, w: 1.4 }); pen(x, [[448, 80], [430, 85]], { seed: 21, w: 1.4 }); pen(x, [[448, 92], [430, 87]], { seed: 23, w: 1.4 }); } }
      else drawWire(0, 1);
      if (o === 'hot') { const e = win(p, 0.3, 0.8); pen(x, P, { wob: false, w: 13, color: [240, 80, 30], a: 0.5 * e }); [280, 400, 520].forEach((hx, i) => heat(x, hx, 74, s.t + i, e, 5 + i * 3)); heat(x, 214, 170, s.t + 2, e, 17); }
      // current
      if (o && on >= 1 && p < 0.96) { const lim = brk ? stop - 0.04 : 1; for (let i = 0; i < 7; i++) { const k = ((s.t * 0.5 + i / 7) % 1) * lim, q = P[Math.min(L - 1, Math.floor(k * L))]; disc(x, q[0], q[1], 4.5, AMBER, 0.95); disc(x, q[0], q[1], 2, RD, 0.7); } }
      // the switch
      const plate = geo.rect(160, 208, 60, 60, 8); fillP(x, plate, 'rgba(251,250,245,1)'); Ink.hatchShadow(x, plate, 1, 5, 5); pen(x, plate, { seed: 25, w: 2.4 });
      const rk = on > 0.5 ? [[178, 226], [202, 222], [202, 254], [178, 250]] : [[178, 222], [202, 226], [202, 250], [178, 254]]; hatch(x, rk, 0.4, 5); pen(x, rk, { close: true, seed: 27, w: 2, amp: 0.3 });
      text(x, on > 0.5 ? 'ON' : 'OFF', 190, 290, { size: 22, align: 'center', color: on > 0.5 ? GR : B });
      // the lamp
      const lit = !o || brk ? 0 : (o === 'hot' ? 0.22 : 1) * ease(win(p, 0.2, 0.4));
      glow(x, 640, 176, 96, AMBER, lit);
      const holder = box(628, 128, 24, 20); hatch(x, holder, 0.5, 4); pen(x, holder, { close: true, seed: 29, w: 2, amp: 0.3 });
      pen(x, geo.ellipse(640, 176, 28, 30, -1.2, -1.2 + TAU - 0.75), { seed: 31, w: 2.4 }); pen(x, [[632, 150], [634, 172], [640, 164], [646, 172], [648, 150]], { seed: 33, w: 1.4, color: lit > 0.5 ? [226, 120, 20] : B });
      if (lit > 0.5) for (let i = 0; i < 9; i++) { const an = 0.35 + i * (Math.PI - 0.7) / 8; pen(x, [[640 + Math.cos(an) * 44, 180 + Math.sin(an) * 44], [640 + Math.cos(an) * 60, 180 + Math.sin(an) * 60]], { seed: 35 + i, w: 2, color: [226, 120, 20], a: lit }); }
      if (o && !brk && o === 'hot') text(x, 'dim…', 690, 186, { font: 'hand', size: 22, color: RD, a: win(p, 0.4, 0.6) });
      if (o && brk) text(x, 'no light', 690, 186, { font: 'hand', size: 22, color: RD, a: win(p, 0.4, 0.6) });
    },
    // ---- 5: the vice ----
    5(x, s) {
      const p = s.p, o = s.out, ok = okCode(o) || o === 'cost';
      pen(x, [[20, 252], [840, 252]], { seed: 3, w: 2.6 }); hatch(x, box(20, 252, 820, 14), 0.3);
      const close = o ? ease(win(p, 0.05, 0.32)) : 0, gap = 34 * (1 - close), sq = o ? win(p, 0.32, 0.6) : 0;
      const bend = o === 'soft' ? ease(sq) : 0, snap = o === 'crack' ? win(p, 0.4, 0.46) : 0;
      const base = [[330, 252], [344, 214], [560, 214], [574, 252]], beam = box(300 - gap, 176, 230 + gap, 30), fixed = [[492, 214], [488, 104], [530, 104], [548, 214]];
      const mj = snap > 0 ? [[406 - gap, 176], [406 - gap, 148], [420 - gap, 140], [432 - gap, 150], [450 - gap, 144], [450 - gap, 176]] : [[406 - gap, 176], [404 - gap - bend * 30, 104 + bend * 8], [446 - gap - bend * 30, 104 + bend * 2], [450 - gap, 176]];
      [base, beam, fixed, mj].forEach((P2, i) => { fillP(x, P2, 'rgba(251,250,245,1)'); tint(x, P2, s, 0.6); if (!s.col) hatch(x, P2, 0.18, 9); pen(x, P2, { close: true, seed: 5 + i * 2, w: 2.4, amp: 0.4 }); });
      // the screw and its handle
      pen(x, [[232 - gap, 191], [300 - gap, 191]], { seed: 15, w: 5, a: 0.8 }); const ha = o ? win(p, 0.05, 0.6) * 16 : 0.5, hl = 46 * Math.cos(ha);
      pen(x, [[240 - gap, 191 - hl], [240 - gap, 191 + hl]], { seed: 17, w: 3.4 }); disc(x, 240 - gap, 191 - hl, 5, B, 0.8); disc(x, 240 - gap, 191 + hl, 5, B, 0.8);
      // the steel block being held
      const slip = bend > 0 ? bend : snap > 0 ? ease(win(p, 0.42, 0.6)) : 0;
      x.save(); x.translate(469, 140 + slip * 26); x.rotate(-slip * 0.5); const blk = box(-19, -22, 38, 50); fillP(x, blk, 'rgba(251,250,245,1)'); hatch(x, blk, 0.55, 4); pen(x, blk, { close: true, seed: 19, w: 2.2, amp: 0.3 }); x.restore();
      if (sq > 0 && sq < 1 && !slip) { [[392 - gap, 150], [392 - gap, 130]].forEach(([ax, ay], i) => pen(x, [[ax - 26, ay], [ax, ay]], { seed: 21 + i, w: 2, color: RD, a: 0.7 })); [[566, 150], [566, 130]].forEach(([ax, ay], i) => pen(x, [[ax + 26, ay], [ax, ay]], { seed: 25 + i, w: 2, color: RD, a: 0.7 })); }
      if (snap > 0) { const f = win(p, 0.4, 0.75); x.save(); x.translate(420 - 80 * f, 122 + f * f * 116 - Math.sin(f * Math.PI) * 30); x.rotate(-f * 2.6); const pc = [[-21, -20], [21, -20], [24, 22], [8, 14], [-6, 24], [-20, 16]]; fillP(x, pc, 'rgba(251,250,245,1)'); tint(x, pc, s, 0.6); pen(x, pc, { close: true, seed: 29, w: 2.2, amp: 0.6 }); x.restore(); burst(x, 426, 140, 32, Math.sin(win(p, 0.4, 0.6) * Math.PI)); }
      if (bend > 0) { pen(x, geo.curve([380 - bend * 30, 96], [366 - bend * 30, 110], [366 - bend * 30, 130], [376 - bend * 26, 144], 10), { seed: 31, w: 2, color: RD, a: bend }); }
      // a hammer blow to prove it holds
      if (ok && o) { const h = win(p, 0.62, 0.82), sw = Math.sin(h * Math.PI); if (h > 0 && h < 1) { x.save(); x.translate(600, 60); x.rotate(-0.9 * sw); pen(x, [[0, 0], [-100, 30]], { seed: 33, w: 5, a: 0.8 }); const hd = box(-128, 12, 30, 44); fillP(x, hd, 'rgba(251,250,245,1)'); hatch(x, hd, 0.6, 4); pen(x, hd, { close: true, seed: 35, w: 2.4, amp: 0.3 }); x.restore(); burst(x, 470, 108, 26, sw > 0.9 ? 1 : 0); } if (o !== 'cost') sparkle(x, 470, 80, 20, win(p, 0.84, 0.95), 37); }
      if (o === 'cost') priceTag(x, 650, 120, ease(win(p, 0.82, 0.95)));
    },
    // ---- 6: the tap ----
    6(x, s) {
      const p = s.p, o = s.out, ok = okCode(o), e = o ? win(p, 0.6, 1) : 0;
      // the basin
      [box(500, 206, 210, 16), box(150, 206, 40, 16)].forEach((rim, i) => { hatch(x, rim, 0.3); pen(x, rim, { close: true, seed: 3 + i, w: 2.4 }); });
      const bowl = geo.curve([190, 208], [220, 300], [470, 300], [500, 208], 24); pen(x, bowl, { seed: 5, w: 2.2 });
      if (o === 'rust') { const stain = geo.ellipse(372, 272, 40 * e, 8 * e, 0, TAU); fillP(x, stain, rgba(RUST, 0.45)); }
      // the tap
      const body = [[536, 206], [540, 132], [588, 132], [592, 206]], spout = [[540, 140], [420, 124], [374, 136], [362, 166], [388, 168], [396, 152], [428, 146], [540, 164]], neck = box(550, 106, 28, 26);
      const droop = o === 'soft' ? ease(e) * 0.5 : 0, snapped = o === 'crack' ? win(p, 0.3, 0.36) : 0;
      [body, spout, neck].forEach((P2, i) => { fillP(x, P2, 'rgba(251,250,245,1)'); tint(x, P2, s, 0.6); if (!s.col) hatch(x, P2, 0.18, 9); pen(x, P2, { close: true, seed: 7 + i * 2, w: 2.4, amp: 0.4 }); });
      pen(x, [[540, 180], [592, 180]], { seed: 13, w: 1.4, a: 0.6 });
      // the cross handle: it turns while the tap is being used
      const turn = o ? win(p, 0.04, 0.5) : 0, hw = snapped > 0 ? 12 : 44 * (0.55 + 0.45 * Math.abs(Math.cos(turn * 12)));
      x.save(); x.translate(564, 98); x.rotate(droop); const hb = box(-hw, -9, hw * 2, 16); fillP(x, hb, 'rgba(251,250,245,1)'); tint(x, hb, s, 0.6); pen(x, hb, { close: true, seed: 15, w: 2.4, amp: snapped > 0 ? 1 : 0.4 }); x.restore();
      if (snapped > 0) { const f = win(p, 0.3, 0.6); x.save(); x.translate(610 + f * 60, 96 + f * f * 96 - Math.sin(f * Math.PI) * 26); x.rotate(f * 4.4); const pc = box(-26, -8, 52, 16); fillP(x, pc, 'rgba(251,250,245,1)'); tint(x, pc, s, 0.6); pen(x, pc, { close: true, seed: 17, w: 2.2, amp: 0.8 }); x.restore(); burst(x, 584, 96, 28, Math.sin(win(p, 0.3, 0.5) * Math.PI)); }
      // water
      const run = o ? win(p, 0.06, 0.12) * (1 - win(p, 0.5, 0.58)) * (snapped > 0 ? 1 - win(p, 0.3, 0.4) : 1) : 0, wcol = o === 'rust' && p > 0.3 ? RUST : WATER;
      if (run > 0) for (let i = -1; i <= 1; i++) { const P = []; for (let k = 0; k <= 10; k++) P.push([375 + i * 5 + Math.sin(k * 1.2 + s.t * 14 + i) * 1.6, 168 + k * 10.6 * run]); pen(x, P, { seed: 21 + i, w: 2, color: wcol, a: 0.8, wob: false }); }
      if (o === 'rust') { blots(x, body, e, 23, 9, RUST); blots(x, spout, e, 29, 12, RUST); if (e > 0) [0, 0.5].forEach((off) => { const k = (s.t * 0.9 + off) % 1; drop(x, 375, 178 + k * 86, 5, RUST, 1 - k * 0.6); }); }
      if (o === 'soft' && e > 0) { [0, 0.33, 0.66].forEach((off) => { const k = (s.t * 1.1 + off) % 1; drop(x, 375, 178 + k * 86, 5, WATER, 1 - k * 0.6); }); const k = (s.t * 0.7) % 1; drop(x, 546, 122 + k * 70, 4, WATER, 1 - k); pen(x, geo.curve([612, 70], [630, 78], [634, 98], [622, 112], 10), { seed: 31, w: 2, color: RD, a: e }); }
      if (ok) [[470, 120, 14], [566, 160, 16], [600, 84, 11]].forEach(([dx, dy, r], i) => sparkle(x, dx, dy, r, e, 33 + i * 9));
      caption(x, '10 years later…', o ? win(p, 0.56, 0.64) : 0, 220);
    },
  };

  // an interactive canvas with an on-demand render loop (sleeps when the page is hidden)
  function Stage(parent, Wd, Ht) {
    const c = document.createElement('canvas'); parent.appendChild(c);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = Math.round(Wd * dpr); c.height = Math.round(Ht * dpr);
    Object.assign(c.style, { width: '100%', height: 'auto', aspectRatio: Wd + ' / ' + Ht, display: 'block', touchAction: 'manipulation', userSelect: 'none', webkitUserSelect: 'none' });
    const ctx = c.getContext('2d');
    const S = { c, ctx, render: () => false };
    const hidden = () => { const p = c.closest('.page'); return !p || p.classList.contains('hidden'); };
    let raf = 0, wait = 0, last = 0;
    const tick = (now) => {
      raf = 0;
      if (hidden()) { last = 0; if (!wait) wait = setTimeout(() => { wait = 0; S.go(); }, 400); return; }
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60; last = now;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.globalCompositeOperation = 'source-over'; ctx.clearRect(0, 0, Wd, Ht);
      ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = 1; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      if (S.render(dt)) raf = requestAnimationFrame(tick); else last = 0;
    };
    S.go = () => { if (!raf) raf = requestAnimationFrame(tick); };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => S.go());
    return S;
  }

  Book.page({
    id: 'p08',
    title: 'Choose the metal',
    build(ui, root) {
      const css = document.createElement('style');
      css.textContent = `
        .p08-bench{position:relative;margin:0 0 calc(var(--R)*1.4);padding:12px 14px 14px;background:rgba(251,250,245,.9)}
        .p08-tabs{display:grid;grid-template-columns:repeat(6,1fr);gap:6px;margin:0 0 10px}
        .p08-tab{min-width:0;font:700 15.5px Fredoka;color:var(--ink);background:#fff;border:2px solid rgba(30,46,150,.4);border-radius:12px 12px 4px 4px;min-height:46px;padding:6px 9px;cursor:pointer;line-height:1.2;touch-action:manipulation}
        .p08-tab.on{background:var(--ink);color:#fff;border-color:var(--ink)}
        .p08-tab .tk{color:var(--green);margin-left:4px}.p08-tab.on .tk{color:#9df0b6}
        .p08-brief{display:flex;gap:12px;align-items:center;background:rgba(255,236,120,.45);border-left:5px solid rgba(240,200,60,.9);padding:8px 14px;margin:0 0 8px;line-height:1.45;font-size:19px;transform:rotate(-.3deg)}
        .p08-brief .n{font:700 15px Fredoka;color:var(--red);white-space:nowrap;letter-spacing:.06em}
        .p08-stagewrap{position:relative;margin:0 0 8px}
        .p08-stamp{position:absolute;right:10px;top:8px;font:700 26px Fredoka;letter-spacing:.04em;padding:2px 14px;border:4px solid;border-radius:10px;transform:rotate(-7deg) scale(0);transition:transform .25s cubic-bezier(.3,1.6,.5,1);background:rgba(251,250,245,.85);pointer-events:none}
        .p08-stamp.on{transform:rotate(-7deg) scale(1)}.p08-stamp.good{color:var(--green)}.p08-stamp.bad{color:var(--red)}
        .p08-ask{font:700 17px Fredoka;margin:0 0 6px;line-height:1.4}
        .p08-metals{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;margin:0 0 10px}
        .p08-metal{display:flex;align-items:center;gap:8px;background:#fff;border:2px solid rgba(30,46,150,.4);border-radius:10px;padding:4px 8px;min-height:48px;cursor:pointer;font:600 16px Fredoka;color:var(--ink);text-align:left;line-height:1.15;touch-action:manipulation}
        .p08-metal i{flex:0 0 22px;height:22px;border-radius:5px;border:2px solid rgba(30,46,150,.55)}
        .p08-metal.sel{border-color:var(--ink);background:#e8ecff;box-shadow:0 0 0 3px rgba(30,46,150,.18)}
        .p08-metal.right{border-color:var(--green);background:#e6f6ea}
        .p08-metal.wrong{border-color:var(--red);background:#fdeaea;text-decoration:line-through;text-decoration-color:var(--red)}
        .p08-metal:disabled{cursor:default;opacity:.75}
        .p08-row{display:flex;flex-wrap:wrap;gap:10px;align-items:center}
        .p08-row .btn{margin-top:0}
        .p08-go{font-size:19px!important;padding:10px 22px!important}
        .p08-tip{font-size:16px;color:rgba(30,46,150,.75);line-height:1.4;flex:1 1 200px}
        .p08-bench .fb{font-size:18px}
        @media (max-width:900px){.p08-tabs{grid-template-columns:repeat(3,1fr)}}
        @media (max-width:700px){.p08-brief{font-size:18px}.p08-metal{font-size:15px}}`;
      root.appendChild(css);

      ui.h('Choose the metal');
      ui.p('Now <b>you</b> are the designer. For each brief, pick a metal and press <b>TEST</b>. If it fails, look at <b>why</b> and choose again. <span class="key">Every test is recorded</span>, so think first!');

      const N = [1, 2, 3, 4, 5, 6];
      const recs = {}; N.forEach((b) => (recs[b] = ui.record('p08.b' + b, { label: `Brief ${b}: choose a metal for the ${BR[b - 1].short}`, type: 'choose', max: 1 })));
      const saved = (b) => recs[b].get() || {};
      const ST = {}; N.forEach((b) => (ST[b] = { sel: saved(b).sel || null, tries: (saved(b).tries || []).slice(), mis: (saved(b).mis || '').split(',').filter(Boolean) }));
      const solved = (b) => ST[b].tries.some((t) => t.ok);
      let cur = N.find((b) => !solved(b)) || 1, sim = null, frozen = null;

      const bench = ui.el('div', 'p08-bench'); requestAnimationFrame(() => Ink.frame(bench, { w: 2.4 }));
      const tabs = ui.el('div', 'p08-tabs', '', bench), tabEls = {};
      N.forEach((b) => { const t = ui.el('button', 'p08-tab', '', tabs); t.type = 'button'; tabEls[b] = t; t.onclick = () => { if (b === cur || running()) return; Book.sfx('paper', { gain: 0.3, dur: 0.2 }); cur = b; restore(); sync(); }; });
      const brief = ui.el('div', 'p08-brief', '', bench);
      const stageWrap = ui.el('div', 'p08-stagewrap', '', bench);
      const S = Stage(stageWrap, W, Hh);
      const stamp = ui.el('div', 'p08-stamp', '', stageWrap);
      ui.el('div', 'p08-ask', 'Pick a metal:', bench);
      const metals = ui.el('div', 'p08-metals', '', bench), metalEls = {};
      NAMES.forEach((m) => {
        const b = ui.el('button', 'p08-metal', `<i style="background:rgb(${MET[m].col.join(',')})"></i><span>${MET[m].name}</span>`, metals); b.type = 'button'; metalEls[m] = b;
        b.onclick = () => { if (running()) return; ST[cur].sel = m; sim = null; fb.className = 'fb'; fb.innerHTML = ''; stamp.className = 'p08-stamp'; Book.sfx('tick', { gain: 0.5 }); sync(); };
      });
      const row = ui.el('div', 'p08-row', '', bench);
      const goBtn = ui.el('button', 'btn p08-go', '', row); goBtn.type = 'button';
      const nextBtn = ui.el('button', 'btn ghost', 'Next brief ▸', row); nextBtn.type = 'button';
      const tip = ui.el('span', 'p08-tip', '', row);
      const fb = ui.el('div', 'fb', '', bench);
      const running = () => !!(sim && sim.p < 1);

      function commit(b) {
        const s = ST[b], ok = solved(b);
        recs[b].set({ answer: s.tries.map((t, i) => `${i + 1}) ${MET[t.m].name} ${t.ok ? '✓ works' : '✗ ' + WHAT[t.c]}`).join('; '), correct: ok, score: ok ? 1 : 0, max: 1, mis: s.mis.join(','), tries: s.tries, sel: s.sel });
      }
      function verdict(quiet) {
        const R = BR[cur - 1], [code, why] = R.v[sim.m], ok = okCode(code);
        fb.className = 'fb on ' + (ok ? 'good' : 'bad');
        fb.innerHTML = (ok ? '✓ ' : '✗ ') + why + (ok ? '' : ` <b style="font-family:Fredoka">${R.hint}</b>`);
        stamp.textContent = ok ? (code === 'W' ? 'IT WORKS!' : 'IT WORKS') : 'NOT YET…'; stamp.className = 'p08-stamp on ' + (ok ? 'good' : 'bad');
        if (!quiet) Book.sfx(ok ? 'success' : 'error', { gain: 0.4 });
        sync();
      }
      // show the brief as it was left: the last test (finished) if there was one
      function restore() {
        const s = ST[cur], last = s.tries[s.tries.length - 1];
        fb.className = 'fb'; fb.innerHTML = ''; stamp.className = 'p08-stamp'; sim = null;
        if (last && s.sel === last.m) { sim = { m: last.m, out: last.c, p: 1, t: 0 }; verdict(true); }
        S.go();
      }
      function startTest() {
        const s = ST[cur], m = s.sel; if (!m || running()) return;
        const code = BR[cur - 1].v[m][0], ok = okCode(code);
        s.tries.push({ m, c: code, ok }); const mis = misFor(cur, m); if (mis && !s.mis.includes(mis)) s.mis.push(mis);
        commit(cur);
        sim = { m, out: code, p: 0, t: 0, b: cur }; fb.className = 'fb'; fb.innerHTML = ''; stamp.className = 'p08-stamp';
        Book.sfx('stamp', { gain: 0.5 }); sync(); S.go();
        requestAnimationFrame(() => { const r = stageWrap.getBoundingClientRect(), sh = bench.closest('.sheet'); if (sh && (r.top < 0 || r.bottom > innerHeight - 90)) sh.scrollTop += r.top - 90; });
      }
      goBtn.onclick = startTest;
      nextBtn.onclick = () => { const n = N.find((b) => !solved(b)); if (n == null || running()) return; cur = n; restore(); sync(); bench.scrollIntoView({ block: 'start', behavior: 'smooth' }); };

      function sync() {
        const s = ST[cur], R = BR[cur - 1], run = running();
        N.forEach((b) => { tabEls[b].innerHTML = b + '. ' + BR[b - 1].tab + (solved(b) ? '<span class="tk">✓</span>' : ''); tabEls[b].classList.toggle('on', b === cur); });
        brief.innerHTML = `<span class="n">BRIEF ${cur}</span><span>${R.text}</span>`;
        NAMES.forEach((m) => {
          const b = metalEls[m], t = s.tries.find((q) => q.m === m);
          b.classList.toggle('sel', s.sel === m); b.classList.toggle('right', !!t && t.ok); b.classList.toggle('wrong', !!t && !t.ok); b.disabled = run;
        });
        const tested = s.sel && s.tries.some((q) => q.m === s.sel) && sim && sim.p >= 1;
        goBtn.textContent = R.go; goBtn.disabled = !s.sel || run || !!tested;
        const left = N.filter((b) => !solved(b)).length;
        nextBtn.style.display = solved(cur) && left && !run ? '' : 'none';
        tip.textContent = run ? 'Testing…' : !s.sel ? 'Pick a metal first.' : tested ? (solved(cur) ? (left ? 'Solved! You can try other metals to see how they fail, or move on.' : 'All six briefs solved. Now answer the question below.') : 'Pick a different metal and test again.') : `Ready to test ${MET[s.sel].name.toLowerCase()}?`;
        S.go();
      }
      S.render = (dt) => {
        const s = ST[cur]; let busy = false;
        const st = frozen || sim || { m: s.sel, out: null, p: 0, t: 0 };
        if (sim && sim.p < 1) { sim.t += dt; sim.p = Math.min(1, sim.t / BR[cur - 1].dur); busy = true; if (sim.p >= 1) verdict(); }
        else if (sim) { sim.t += dt; busy = ['rust', 'soft'].includes(sim.out) && cur === 6; } // drips keep dripping
        SCENES[cur](S.ctx, { m: st.m, col: st.m ? MET[st.m].col : null, out: st.out, p: st.p, t: st.t });
        if (!st.m) text(S.ctx, 'made of… ?', 220, 40, { font: 'hand', size: 24, align: 'center', a: 0.6 });
        return busy;
      };
      bench._show = (b, m, p) => { cur = b; ST[b].sel = m; frozen = m && p != null ? { m, out: BR[b - 1].v[m][0], p, t: p * BR[b - 1].dur } : null; sim = null; S.go(); }; // for checking the drawings
      restore(); sync();

      // ---------------- the written answer ----------------
      ui.p('Last job: explain a choice in words. <span class="small">(The test bench blurs while you write, so you have to remember what you saw.)</span>');
      const wr = ui.write({
        id: 'p08.explain', label: 'Explain: stainless steel (not low carbon steel) for a kitchen sink [3]', marks: 3, lines: 5,
        q: '<b>Explain why stainless steel is used for a kitchen sink instead of low carbon steel.</b>',
        scheme: [
          'A sink is wet all the time, and low carbon steel <b>rusts easily</b> where there is water and air',
          'Stainless steel <b>resists corrosion / does not rust</b> (its chromium forms a protective oxide layer)',
          'Stainless steel is <b>hygienic</b> and stays shiny / it is <b>hard and tough</b>, so heavy pans do not damage it',
        ],
        model: 'A kitchen sink is always wet. Low carbon steel rusts easily when it meets water and air, so it would soon corrode. Stainless steel contains chromium, which forms a protective oxide layer, so it does not rust. It is also hard, tough and hygienic, so it is not damaged by pans and is easy to keep clean.',
      });
      const checked = () => { const it = Book.state.items['p08.explain']; return !!(it && it.ticks); };
      wr.addEventListener('pointerdown', () => { if (!checked() && !running()) bench.classList.add('peek-lock'); }, { passive: true });
      wr.addEventListener('focusin', () => { if (!checked() && !running()) bench.classList.add('peek-lock'); });
      wr.addEventListener('click', () => setTimeout(() => { if (checked()) bench.classList.remove('peek-lock'); }, 60));
      wr.addEventListener('focusout', () => setTimeout(() => { const ta = wr.querySelector('textarea'); if (!ta.value.trim() && document.activeElement !== ta) bench.classList.remove('peek-lock'); }, 200)); // nothing written: let them back to the bench
    },
  });
})();
