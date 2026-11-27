// Page 8 — Choose the paper or board: six designer briefs. For each one the student picks from all eleven papers and
// boards and presses TEST: a pen-drawn scene shows the job working, or failing in a way that shows why.
// Every test is recorded. Then a 3-mark written answer on corrugated card.
(function () {
  'use strict';
  const B = Ink.BLUE, RD = Ink.RED, GR = Ink.GREEN, rgba = Ink.rgba, geo = Ink.geo;
  const PAPER = '#fbfaf5', TAU = Math.PI * 2;
  const HANDF = (s) => `400 ${s}px "Gloria Hallelujah", "Comic Sans MS", cursive`;
  const LABF = (s) => `600 ${s}px Fredoka, "Arial Rounded MT Bold", system-ui, sans-serif`;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const ease = (u) => { u = clamp(u); return u * u * (3 - 2 * u); };
  const W = 860, Hh = 320, DUR = 2.7;

  // ---------- drawing helpers ----------
  function text(x, s, px, py, o = {}) {
    x.save(); x.font = (o.font === 'lab' ? LABF : HANDF)(o.size || 22);
    x.fillStyle = rgba(o.color || B, o.a ?? 0.92); x.textAlign = o.align || 'center'; x.textBaseline = 'alphabetic';
    x.translate(px, py); if (o.rot) x.rotate(o.rot); x.fillText(s, 0, 0); x.restore();
  }
  const path = (x, P) => { x.beginPath(); P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.closePath(); };
  const fill = (x, P, style) => { x.save(); x.globalCompositeOperation = 'source-over'; x.fillStyle = style || PAPER; path(x, P); x.fill(); x.restore(); };
  const st = (x, pts, seed, o = {}) => Ink.stroke(x, pts, Object.assign({ w: 2.2, amp: 0.5, seed }, o));
  const plain = (x, pts, col, a, lw, dash) => { x.save(); x.strokeStyle = rgba(col, a); x.lineWidth = lw; if (dash) x.setLineDash(dash); x.beginPath(); pts.forEach((p, i) => (i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1]))); x.stroke(); x.restore(); };
  const box = (x0, y0, w, h) => [[x0, y0], [x0 + w, y0], [x0 + w, y0 + h], [x0, y0 + h]];
  const closeP = (P) => P.concat([P[0]]);
  function hatch(x, pts, col = B, a = 0.4, sp = 6, dir = 1) {
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; pts.forEach(([px, py]) => { x0 = Math.min(x0, px); x1 = Math.max(x1, px); y0 = Math.min(y0, py); y1 = Math.max(y1, py); });
    x.save(); path(x, pts); x.clip(); x.strokeStyle = rgba(col, a); x.lineWidth = 1; x.beginPath();
    if (dir > 0) for (let c = Math.floor((x0 + y0) / sp) * sp; c < x1 + y1 + sp; c += sp) { x.moveTo(c - y0 + 2, y0 - 2); x.lineTo(c - y1 - 2, y1 + 2); }
    else for (let c = Math.floor((x0 - y1) / sp) * sp; c < x1 - y0 + sp; c += sp) { x.moveTo(c + y0 - 2, y0 - 2); x.lineTo(c + y1 + 2, y1 + 2); }
    x.stroke(); x.restore();
  }
  const dots = (x, P, n, seed, col = B, a = 0.6, r = 1) => { let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; P.forEach(([px, py]) => { x0 = Math.min(x0, px); x1 = Math.max(x1, px); y0 = Math.min(y0, py); y1 = Math.max(y1, py); }); const rr = H.rng(seed); x.save(); path(x, P); x.clip(); x.fillStyle = rgba(col, a); for (let i = 0; i < n; i++) { x.beginPath(); x.arc(x0 + rr() * (x1 - x0), y0 + rr() * (y1 - y0), r, 0, 7); x.fill(); } x.restore(); };
  const ground = (x, y) => { st(x, [[16, y], [844, y]], 1, { w: 2.6 }); hatch(x, box(16, y + 3, 828, 16), B, 0.28, 7); };
  const note = (x, s, px, py, ax, ay) => { text(x, s, px, py, { size: 24, color: RD, rot: -0.03 }); if (ax != null) { st(x, [[px, py + 8], [ax, ay]], 91, { w: 1.8, color: RD, retrace: false }); st(x, geo.head([[px, py + 8], [ax, ay]], 10), 92, { w: 1.8, color: RD, retrace: false }); } };
  const star = (cx, cy, r, n = 5, k = 0.45, rot = -Math.PI / 2) => { const P = []; for (let i = 0; i <= n * 2; i++) { const a = rot + i * Math.PI / n, q = i % 2 ? r * k : r; P.push([cx + Math.cos(a) * q, cy + Math.sin(a) * q]); } return P; };

  // ---------- the eleven papers and boards ----------
  const MATS = {
    layout: { name: 'Layout paper', paper: true }, tracing: { name: 'Tracing paper', paper: true }, bleed: { name: 'Bleed proof paper', paper: true },
    cart: { name: 'Cartridge paper', paper: true }, grid: { name: 'Grid paper', paper: true },
    corr: { name: 'Corrugated card', th: 10 }, dup: { name: 'Duplex board', th: 4 }, foil: { name: 'Foil lined board', th: 4 },
    foam: { name: 'Foam core board', th: 14 }, inkjet: { name: 'Ink jet card', th: 4 }, solid: { name: 'Solid white board', th: 5 },
  };
  const ORDER = ['dup', 'tracing', 'foam', 'cart', 'solid', 'grid', 'corr', 'layout', 'inkjet', 'bleed', 'foil']; // mixed on purpose
  const isPaper = (m) => !!MATS[m].paper, low = (m) => MATS[m].name.toLowerCase();
  // the cut edge of a board between two parallel edge lines (a→b is the top edge, th is the thickness, downwards)
  function edge(x, m, a, b, th, seed) {
    const P = [a, b, [b[0], b[1] + th], [a[0], a[1] + th]]; fill(x, P);
    const n = Math.max(4, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / 4)), at = (u, v) => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u + th * v];
    if (m === 'corr') { const z = []; for (let i = 0; i <= n; i++) z.push(at(i / n, i % 2 ? 0.85 : 0.15)); plain(x, z, B, 0.85, 1.2); }
    else if (m === 'foam') dots(x, P, n * 3, seed, B, 0.6, 0.9);
    else if (m === 'dup') hatch(x, [at(0, 0.5), at(1, 0.5), at(1, 1), at(0, 1)], B, 0.7, 2.6);
    else if (m === 'foil') plain(x, [at(0, 0.82), at(1, 0.82)], B, 0.95, Math.max(1.6, th * 0.3));
    st(x, closeP(P), seed, { w: 1.8, amp: 0.25, retrace: false });
  }
  function icon(m) {
    const c = document.createElement('canvas'); c.width = 132; c.height = 96; c.className = 'p08-ic';
    const x = c.getContext('2d'); x.lineCap = x.lineJoin = 'round'; x.translate(66, 50); x.scale(1.7, 1.7);
    const T = [[-30, -6], [16, -20], [32, -4], [-14, 10]], th = isPaper(m) ? 0 : MATS[m].th * 0.9;
    if (th) { edge(x, m, T[3], T[2], th, 5); edge(x, m, T[0], T[3], th, 7); }
    fill(x, T, m === 'tracing' ? 'rgba(251,250,245,0.35)' : PAPER);
    const at = (u, v) => [T[0][0] + (T[1][0] - T[0][0]) * u + (T[3][0] - T[0][0]) * v, T[0][1] + (T[1][1] - T[0][1]) * u + (T[3][1] - T[0][1]) * v];
    if (m === 'layout' || m === 'tracing') { const s = [[0.3, 0.3], [0.7, 0.3], [0.7, 0.75], [0.3, 0.75], [0.3, 0.3], [0.5, 0.1], [0.7, 0.3]].map(([u, v]) => at(u, v)); plain(x, s, B, m === 'tracing' ? 0.9 : 0.38, 1.3); }
    if (m === 'bleed') { x.save(); x.strokeStyle = rgba(RD, 0.8); x.lineWidth = 5; x.lineCap = 'butt'; x.beginPath(); const a = at(0.2, 0.55), b = at(0.8, 0.45); x.moveTo(a[0], a[1]); x.lineTo(b[0], b[1]); x.stroke(); x.restore(); }
    if (m === 'cart') { dots(x, T, 70, 3, B, 0.5, 0.6); hatch(x, [at(0.15, 0.2), at(0.6, 0.2), at(0.6, 0.8), at(0.15, 0.8)], B, 0.55, 2.4); }
    if (m === 'grid') for (let i = 1; i < 6; i++) { plain(x, [at(i / 6, 0), at(i / 6, 1)], B, 0.45, 0.7); if (i < 5) plain(x, [at(0, i / 5), at(1, i / 5)], B, 0.45, 0.7); }
    if (m === 'inkjet') { const f = [at(0.14, 0.16), at(0.86, 0.16), at(0.86, 0.84), at(0.14, 0.84)]; plain(x, closeP(f), B, 0.8, 1); plain(x, [at(0.14, 0.84), at(0.4, 0.4), at(0.55, 0.62), at(0.68, 0.45), at(0.86, 0.84)], B, 0.8, 1.1); x.fillStyle = rgba(RD, 0.75); const s = at(0.72, 0.3); x.beginPath(); x.arc(s[0], s[1], 2.6, 0, 7); x.fill(); }
    if (m === 'foil') { const f = [T[2], at(0.62, 1), at(0.86, 0.5)]; fill(x, f); [0.3, 0.6].forEach((u) => plain(x, [[f[1][0] + (f[0][0] - f[1][0]) * u, f[1][1] + (f[0][1] - f[1][1]) * u], [f[2][0], f[2][1]]], B, 0.8, 1)); hatch(x, f, B, 0.5, 2.2, -1); plain(x, closeP(f), B, 0.9, 1.2); }
    st(x, closeP(T), 3, { w: 1.5, amp: 0.25, retrace: false });
    return c;
  }

  // ---------- the six briefs: what each choice does ----------
  const ok = (msg, more) => ({ ok: true, kind: 'ok', msg, more });
  const no = (kind, mis, msg, tag) => ({ ok: false, kind, mis, msg, tag });
  const BR = [null,
    { tab: 'Mug box', short: 'box to post a mug', text: 'A box to <b>post a china mug</b> to a customer. It will be dropped, stacked and thrown about on the way.',
      judge: (m) => m === 'corr' ? ok('The box took the knocks and the mug arrived in one piece.')
        : isPaper(m) ? no('flop', 'board-mixup', `${MATS[m].name} is a thin sheet for drawing on. The "box" crumpled at once and the mug smashed. A posting box needs a board that is made to protect.`)
        : m === 'foam' ? no('smash', 'board-mixup', 'Foam core board dents easily: the corners crushed in the post and the mug broke. It is made for models and displays, not posting boxes.')
        : no('smash', 'corrugated-structure', `${MATS[m].name} folds into a neat box, but it is one flat sheet of card: nothing in it cushions a knock, so the mug smashed. Which board has a structure that protects?`) },
    { tab: 'Cereal box', short: 'cereal box', text: 'A <b>cereal box</b> for a supermarket shelf: bright printing on the <b>outside</b>, plain inside (nobody sees it), and as <b>cheap</b> as possible.',
      judge: (m) => m === 'dup' ? ok('Bright printing on the white coated side, plain grey inside where nobody looks, and cheaper than solid white board.')
        : m === 'solid' ? ok('Solid white board prints beautifully, so the box works.', 'But it is top-quality board, white all the way through: it costs more than this box needs. A designer would save money with duplex board.')
        : isPaper(m) ? no('flop', 'board-mixup', `${MATS[m].name} is a thin sheet for drawing on. The box cannot stand up, and it split when the cereal went in. Food cartons need a board.`)
        : m === 'corr' ? no('bulky', 'board-mixup', 'It holds the cereal, but corrugated card is thick: it is made to protect things in the post. The box is far too bulky for the shelf. Which thin board is coated white on one side for printing?', 'too thick!')
        : m === 'foam' ? no('bulky', 'board-mixup', 'Foam core board is thick and rigid: it is made for models and displays. The box is far too bulky for the shelf. Which thin board is coated white on one side for printing?', 'too thick!')
        : m === 'foil' ? no('note', 'foil-purpose', 'The box prints and folds, but dry cereal is not hot and not a liquid: the foil layer has no job to do here, and it adds cost. The brief says cheap!', 'foil? no need!')
        : no('note', 'board-mixup', 'Ink jet card gives sharp, vivid prints, but it is made for an ink-jet printer: fine for one photo or a greetings card, not for thousands of cheap food boxes.', 'thousands of boxes?') },
    { tab: 'Perfume box', short: 'perfume box, printed inside and out', text: '10 000 luxury <b>perfume boxes</b>: strong and stiff, with top-quality printing on the <b>inside and the outside</b>.',
      judge: (m) => m === 'solid' ? ok('Strong, stiff and white all the way through, with an excellent print surface on both sides.')
        : m === 'dup' ? no('grey', 'duplex-vs-solid', 'The outside looks great, but open the lid: the inside is dull grey. Duplex board is white and coated for printing on <b>one side only</b>. Which board is white all the way through?', 'grey inside!')
        : isPaper(m) ? no('flop', 'board-mixup', `${MATS[m].name} is a thin sheet for drawing on: the box collapsed under a glass bottle. Luxury packaging needs a strong, stiff board.`)
        : m === 'corr' || m === 'foam' ? no('bulky', 'board-mixup', `${MATS[m].name} is far too thick and clumsy for a small luxury box. The brief needs a strong, stiff board with a top-quality print surface on both sides.`, 'too thick!')
        : m === 'foil' ? no('note', 'foil-purpose', 'A foil lining is a barrier for food and drink. The perfume is already sealed in a glass bottle, so the foil has no job to do, and the brief needs top-quality printing on both sides.', 'foil? no need!')
        : no('note', 'board-mixup', 'Ink jet card prints sharp, vivid images, but on an ink-jet printer: fine for one greetings card, not for 10 000 strong, stiff boxes.', '10 000 boxes?') },
    { tab: 'Takeaway lid', short: 'takeaway lid', text: 'A <b>lid</b> for a tray of hot curry. It must keep the food <b>hot</b> for the 20-minute ride home and must not go <b>soggy</b>.',
      judge: (m) => m === 'foil' ? ok('The foil reflects heat back onto the curry, and it is a barrier to moisture, so the steam cannot soak into the lid.')
        : isPaper(m) ? no('soggy', 'foil-purpose', `${MATS[m].name} is a thin sheet for drawing on. It soaked up the steam at once and collapsed into the curry.`)
        : m === 'corr' ? no('soggy', 'foil-purpose', 'Corrugated card does insulate (think of pizza boxes), but it has no barrier layer: the steam from the sauce soaked in and the lid went soggy.')
        : m === 'foam' ? no('soggy', 'foil-purpose', 'The card faces of foam core board have no barrier layer, so they soaked up the steam and went soggy. It is made for models and displays.')
        : no('soggy', 'foil-purpose', `${MATS[m].name} has no barrier layer: the steam soaked into the card, the lid sagged and the heat escaped. Which board has an extra layer for this?`) },
    { tab: 'Model walls', short: "architect's model walls", text: 'Walls for an <b>architect’s model</b> to show a client: thick, smooth and white, <b>rigid</b> but very <b>light</b>, and easy to cut with a craft knife.',
      judge: (m) => m === 'foam' ? ok('Polystyrene foam between two sheets of card: very light, rigid and smooth, and it cuts cleanly with a craft knife.')
        : isPaper(m) ? no('flop', 'board-mixup', `${MATS[m].name} is far too thin to stand up as a wall: the model flopped over. Models need a rigid board.`)
        : m === 'corr' ? no('rough', 'board-mixup', 'Good thinking: corrugated card is light and stiff, so the walls stand up. But the brief says <b>smooth</b>: the wavy flutes show along every cut edge. Which board is rigid, light and smooth?', 'flutes show!')
        : no('bow', 'board-mixup', `${MATS[m].name} is a thin sheet of card. Tall walls cut from it bow and lean under the roof. The brief asks for thick, rigid walls that are still very light.`, 'walls bow!') },
    { tab: 'Trace a logo', short: 'tracing a logo', text: 'A designer must <b>trace</b> a client’s logo from a printed sheet, as accurately as possible.',
      judge: (m) => m === 'tracing' ? ok('Tracing paper is transparent: every line of the logo shows through, so the copy is accurate.')
        : m === 'layout' ? ok('Layout paper is thin and translucent, so the logo shows through well enough to trace.', 'Tracing paper is even clearer: it is transparent, and made for copying drawings.')
        : m === 'bleed' ? no('faint', 'bleed-meaning', 'Bleed proof paper is coated so that marker ink stays on the surface: it is for marker rendering. The logo hardly shows through it, so the tracing was a guess.', 'can hardly see it!')
        : m === 'grid' ? no('faint', 'paper-mixup', 'Grid paper is for scale drawings, graphs and nets. The logo hardly shows through it, and the printed grid gets in the way, so the tracing was a guess.', 'can hardly see it!')
        : m === 'cart' ? no('opaque', 'paper-mixup', 'Cartridge paper is thick and opaque: nothing shows through, so the tracing was a guess. It is for drawing and painting.', "can't see through!")
        : no('opaque', 'paper-mixup', `${MATS[m].name} is a board: far too thick to see through, so the tracing was a guess. Tracing needs a thin paper that a drawing shows through.`, "can't see through!") },
  ];

  // =========================================================================================================
  // the scenes (860 × 320). draw(x, t, r, m): t = seconds since TEST (or -1 = the job waiting), r = judge result
  // =========================================================================================================
  function mug(x, cx, by, s, broken, seed) {
    if (!broken) {
      const P = [[cx - 20 * s, by - 50 * s], [cx + 20 * s, by - 50 * s], [cx + 17 * s, by], [cx - 17 * s, by]]; fill(x, P); st(x, closeP(P), seed, { w: 2.4 });
      st(x, geo.curve([cx + 19 * s, by - 40 * s], [cx + 40 * s, by - 42 * s], [cx + 38 * s, by - 10 * s], [cx + 18 * s, by - 12 * s], 14), seed + 1, { w: 2.4 });
      hatch(x, [[cx + 4 * s, by - 50 * s], [cx + 20 * s, by - 50 * s], [cx + 17 * s, by], [cx + 4 * s, by]], B, 0.35, 5);
      st(x, [[cx - 12 * s, by - 34 * s], [cx - 4 * s, by - 26 * s], [cx - 12 * s, by - 18 * s]], seed + 2, { w: 1.6, color: RD, retrace: false });
    } else {
      [[[-30, 0], [-34, -30], [-14, -38], [-6, -12], [-14, 0]], [[2, 0], [-2, -20], [14, -44], [24, -18], [20, 0]], [[36, 0], [30, -14], [48, -22], [54, 0]]].forEach((Q, i) => { const P = Q.map(([a, b]) => [cx + a * s, by + b * s]); fill(x, P); hatch(x, P, B, 0.3, 5, i % 2 ? 1 : -1); st(x, closeP(P), seed + i, { w: 2.2 }); });
      st(x, geo.curve([cx - 52 * s, by - 2 * s], [cx - 70 * s, by - 16 * s], [cx - 56 * s, by - 30 * s], [cx - 44 * s, by - 20 * s], 10), seed + 4, { w: 2.2 });
      [[-8, -52], [22, -56], [44, -40]].forEach(([a, b], i) => st(x, [[cx + a * s, by + b * s], [cx + (a + 5) * s, by + (b - 12) * s]], seed + 6 + i, { w: 1.8, color: RD, retrace: false }));
    }
  }
  const SCENES = [null,
    // ---- 1: the parcel goes through the post ----
    function (x, t, r, m) {
      const FL = 284, BY = 122;
      ground(x, FL);
      st(x, [[40, BY], [322, BY]], 2, { w: 2.6 }); st(x, [[40, BY + 26], [322, BY + 26]], 3);
      [52, 142, 232, 310].forEach((cx, i) => st(x, geo.ellipse(cx, BY + 13, 11, 11), 4 + i, { w: 1.8 }));
      st(x, [[70, BY + 26], [62, FL]], 9, { w: 2.6 }); st(x, [[290, BY + 26], [298, FL]], 10, { w: 2.6 });
      text(x, 'POST', 180, 62, { font: 'lab', size: 26, a: 0.5 });
      if (!r) { mug(x, 150, BY, 1, false, 20); plain(x, closeP(box(100, BY - 92, 100, 92)), B, 0.6, 2, [8, 7]); text(x, 'box made of… ?', 150, BY - 104, { size: 22, color: RD }); return; }
      let cx = 150, by = BY, rot = 0; const landed = t >= 1.5;
      if (t < 0.9) cx = 150 + 180 * (t / 0.9); else if (!landed) { const u = (t - 0.9) / 0.6; cx = 330 + 90 * u; by = BY + (FL - BY) * u * u; rot = Math.sin(u * Math.PI) * 0.35; } else { cx = 420; by = FL; }
      const flop = r.kind === 'flop', th = isPaper(m) ? 0 : MATS[m].th;
      x.save(); x.translate(cx, by); x.rotate(rot);
      let P = flop ? [[-52, 0], [-47, -44], [-30, -58], [-4, -46], [24, -60], [46, -46], [53, 0]] : [[-48, 0], [-48, -84], [48, -84], [48, 0]];
      if (landed && !r.ok && !flop) P = [[-48, 0], [-48, -84], [44, -80], [50, -26], [38, -9], [34, 0]];
      if (landed && flop) P = [[-58, 0], [-50, -22], [-26, -34], [0, -24], [22, -36], [50, -22], [60, 0]];
      fill(x, P); st(x, closeP(P), 30, { w: 2.6 });
      if (th) edge(x, m, [-44, -84 - Math.min(th, 9)], [44, -84 - Math.min(th, 9) + (landed && !r.ok ? 4 : 0)], Math.min(th, 9), 33);
      if (!flop) { st(x, [[0, -84], [0, -52]], 34, { w: 1.6, retrace: false }); const lb = box(-30, -44, 44, 26); st(x, closeP(lb), 35, { w: 1.4, retrace: false }); plain(x, [[-24, -36], [6, -36]], B, 0.7, 1.2); plain(x, [[-24, -28], [-2, -28]], B, 0.7, 1.2); }
      else { st(x, [[-30, -50], [-18, -20]], 36, { w: 1.4, retrace: false }); st(x, [[24, -54], [10, -22]], 37, { w: 1.4, retrace: false }); }
      if (landed && !r.ok && !flop) [[40, -40, 30, -30], [46, -20, 30, -14], [36, -8, 26, -12]].forEach(([a, b, c, d], i) => st(x, [[a, b], [c, d]], 38 + i, { w: 1.6, color: RD, retrace: false }));
      x.restore();
      if (landed) {
        const a = clamp((t - 1.7) / 0.4); if (a <= 0) return;
        x.save(); x.globalAlpha = a; const CX = 660, CY = 150, RR = 112;
        plain(x, [[cx + 54, by - 50], [CX - RR, CY + 20]], B, 0.4, 1.4, [6, 6]);
        st(x, geo.ellipse(CX, CY, RR, RR), 50, { w: 2.6 }); text(x, 'inside the box:', CX, 26, { size: 22 });
        st(x, [[CX - 80, CY + 62], [CX + 80, CY + 62]], 51, { w: 1.8 }); x.beginPath(); x.arc(CX, CY, RR - 3, 0, 7); x.clip(); mug(x, CX + (r.ok ? -6 : 8), CY + 60, r.ok ? 2 : 1.6, !r.ok, 60);
        x.restore();
      }
    },
    // ---- 2: the cereal box on the shelf ----
    function (x, t, r, m) {
      const SY = 272; st(x, [[16, SY], [844, SY]], 1, { w: 2.6 }); const sh = box(16, SY + 3, 828, 14); hatch(x, sh, B, 0.35, 5); st(x, [[16, SY + 18], [844, SY + 18]], 2, { w: 1.8 });
      const bulky = r && r.kind === 'bulky', flop = r && r.kind === 'flop', bw = bulky ? 300 : 180, X0 = 430 - bw / 2;
      [[70, 0], [668, 1]].forEach(([nx, i]) => { x.save(); if (bulky) { x.translate(nx + (i ? 122 : 0), SY); x.rotate((i ? 1 : -1) * 0.12 * ease(t / 0.6)); x.translate(-(nx + (i ? 122 : 0)), -SY); } const P = box(nx, 82, 122, 190); fill(x, P); st(x, closeP(P), 4 + i, { w: 2.2 }); st(x, geo.ellipse(nx + 61, 140, 34, 26), 6 + i, { w: 1.6 }); [200, 216, 232].forEach((y) => plain(x, [[nx + 22, y], [nx + 100, y]], B, 0.5, 1.4)); x.restore(); });
      if (!r) { plain(x, closeP(box(340, 52, 180, 220)), B, 0.6, 2, [8, 7]); text(x, '?', 430, 180, { size: 60, color: RD }); text(x, 'box made of…', 430, 36, { size: 22, color: RD }); return; }
      const sag = flop ? ease((t - 0.9) / 0.9) : 0;
      let P = box(X0, 52, bw, 220);
      if (flop) P = [[X0 - 26 * sag, SY], [X0 - 10 * sag, 150 + 40 * sag], [X0 + 30 * sag, 52 + 70 * sag], [X0 + bw + 46 * sag, 52 + 110 * sag], [X0 + bw + 30 * sag, 180 + 20 * sag], [X0 + bw + 12 * sag, SY]];
      fill(x, P); st(x, closeP(P), 10, { w: 2.8 });
      if (bulky) { edge(x, m, [X0, 38], [X0 + bw, 38], 14, 12); const I = box(X0 + 22, 74, bw - 44, 176); plain(x, closeP(I), B, 0.5, 1.4, [6, 5]); }
      // the printing draws itself on the front
      const p = clamp(t / 0.9), cx = 430, k = 1 - sag * 0.25;
      x.save(); if (flop) { x.translate(cx, SY); x.transform(1, 0, 0.16 * sag, k, 0, 0); x.translate(-cx, -SY); }
      if (p > 0) { st(x, geo.ellipse(cx, 112, 30, 30), 14, { w: 2.2, p: clamp(p * 3), color: RD }); if (p > 0.3) for (let i = 0; i < 8; i++) { const a = i * TAU / 8; plain(x, [[cx + Math.cos(a) * 36, 112 + Math.sin(a) * 36], [cx + Math.cos(a) * 46, 112 + Math.sin(a) * 46]], RD, 0.85 * clamp((p - 0.3) * 4 - i * 0.2), 2.2); } }
      if (p > 0.5) Ink.drawBubble(x, 'CRUNCH', cx, 196, 34, B, clamp((p - 0.5) * 3), -0.03, 'center');
      if (p > 0.8) { st(x, geo.ellipse(cx, 232, 44, 12, 0, Math.PI), 16, { w: 2, p: clamp((p - 0.8) * 5) }); plain(x, [[cx - 44, 232], [cx + 44, 232]], B, 0.8, 1.6); }
      x.restore();
      // the cereal goes in
      if (t > 1.0) { const u = clamp((t - 1.0) / 1.2), rr = H.rng(7); x.save(); x.fillStyle = rgba([196, 130, 30], 0.85); for (let i = 0; i < 26; i++) { const ph = (rr() + t * 1.4) % 1, px = cx - 24 + rr() * 48; if (u < 1 || flop) { x.beginPath(); x.arc(px, 4 + ph * 44, 3.2, 0, 7); x.fill(); } } if (flop) for (let i = 0; i < 40 * sag; i++) { x.beginPath(); x.arc(X0 + bw + 40 + rr() * 150 - rr() * 30, SY - 4 - rr() * rr() * 46 * sag, 3.2, 0, 7); x.fill(); } x.restore(); }
      if (t > 2.1 && r.ok) { const c = [[X0 + bw, SY - 62], [X0 + bw, SY], [X0 + bw - 62, SY]]; fill(x, c); if (m === 'dup') hatch(x, c, B, 0.65, 3.4); st(x, closeP(c), 20, { w: 1.8 }); note(x, m === 'dup' ? 'inside: grey' : 'inside: white', X0 + bw + 78, 60, X0 + bw - 14, SY - 22); }
      if (t > 1.6 && r.tag) note(x, r.tag, 640, 40, bulky ? X0 + bw - 10 : 500, 60);
      if (bulky && t > 1.2) { st(x, [[X0 + 4, 26], [X0 + bw - 4, 26]], 22, { w: 1.8, color: RD, retrace: false }); st(x, geo.head([[X0 + 40, 26], [X0 + 4, 26]], 9), 23, { w: 1.8, color: RD, retrace: false }); st(x, geo.head([[X0 + bw - 40, 26], [X0 + bw - 4, 26]], 9), 24, { w: 1.8, color: RD, retrace: false }); }
    },
    // ---- 3: the perfume box opens ----
    function (x, t, r, m) {
      const TY = 276; ground(x, TY);
      const bulky = r && r.kind === 'bulky', flop = r && r.kind === 'flop', cx = 400, bw = bulky ? 250 : 170, X0 = cx - bw / 2, top = 168;
      const bottle = (bx, by, rot) => { x.save(); x.translate(bx, by); x.rotate(rot); const b = geo.rect(-30, -70, 60, 70, 8); fill(x, b); st(x, b, 30, { w: 2.2 }); hatch(x, box(-22, -40, 44, 34), RD, 0.35, 5); st(x, closeP(box(-10, -84, 20, 14)), 31, { w: 1.8 }); const s = geo.ellipse(0, -98, 13, 13); fill(x, s); st(x, s, 32, { w: 2 }); st(x, [[-18, -60], [-18, -48]], 33, { w: 1.4, retrace: false }); x.restore(); };
      if (!r) { bottle(cx, TY, 0); plain(x, closeP(box(cx - 85, top - 60, 170, TY - top + 60)), B, 0.6, 2, [8, 7]); text(x, 'box made of… ?', cx, 84, { size: 22, color: RD }); return; }
      const open = ease((t - 0.5) / 0.9), sag = flop ? ease((t - 1.2) / 0.8) : 0;
      // the inside of the lid, seen as the lid swings up and back
      if (open > 0.02 && !sag) {
        const h = 110 * open, L = box(X0, top - h, bw, h); fill(x, L);
        if (r.kind === 'grey') { hatch(x, L, B, 0.5, 3.2); hatch(x, L, B, 0.3, 4.4, -1); }
        else if (m === 'foil') { hatch(x, L, B, 0.4, 2.4, -1); }
        else if (!bulky) for (let i = 0; i < 5; i++) for (let j = 0; j < 3; j++) { const sx = X0 + 22 + i * (bw - 44) / 4, sy = top - h + 20 + j * 34; if (sy < top - 10) st(x, star(sx, sy, 9, 4, 0.4), 40 + i * 3 + j, { w: 1.3, color: RD, amp: 0.2, retrace: false }); }
        st(x, closeP(L), 36, { w: 2.4 });
      }
      if (!sag) bottle(cx, top + 62 - 30 * open, 0);
      // the base
      let P = box(X0, top, bw, TY - top);
      if (sag) P = [[X0 - 30 * sag, TY], [X0 - 14 * sag, top + 60 * sag], [cx - 20, top + 78 * sag], [X0 + bw + 20 * sag, top + 66 * sag], [X0 + bw + 34 * sag, TY]];
      fill(x, P); st(x, closeP(P), 37, { w: 2.8 });
      if (bulky) { edge(x, m, [X0, top - 14], [X0 + bw, top - 14], 14, 38); plain(x, closeP(box(X0 + 26, top + 8, bw - 52, TY - top - 30)), B, 0.5, 1.4, [6, 5]); }
      if (!sag) { for (let i = 0; i < 4; i++) st(x, star(X0 + 26 + i * (bw - 52) / 3, top + 26, 9, 4, 0.4), 60 + i, { w: 1.3, color: RD, amp: 0.2, retrace: false }); const lb = geo.ellipse(cx, top + 70, 46, 20); st(x, lb, 66, { w: 1.8 }); text(x, 'No. 8', cx, top + 78, { size: 22 }); }
      if (!open || sag) { /* closed lid / collapsed */ if (!sag) { const lid = box(X0 - 4, top - 30, bw + 8, 30); fill(x, lid); st(x, closeP(lid), 39, { w: 2.6 }); st(x, [[X0 + 20, top - 15], [X0 + bw - 20, top - 15]], 67, { w: 1.4, color: RD, retrace: false }); } else bottle(cx + 150 + 20 * sag, TY - 4, 1.45 * sag); }
      if (t > 1.5 && r.ok) note(x, 'printed inside too', 660, 70, X0 + bw - 20, top - 60);
      if (t > 1.5 && r.tag) note(x, r.tag, 660, 70, X0 + bw - 20, bulky ? top - 4 : top - 60);
    },
    // ---- 4: the takeaway on its 20-minute ride home ----
    function (x, t, r, m) {
      const CY = 272, c = 300; ground(x, CY);
      const tray = [[c - 144, 150], [c - 132, 150], [c - 112, 264], [c + 112, 264], [c + 132, 150], [c + 144, 150]]; st(x, tray, 2, { w: 2.8 });
      const food = [[c - 124, 216]]; for (let u = 0; u <= 1.001; u += 0.05) food.push([c - 124 + 248 * u, 214 - 10 * Math.sin(u * Math.PI) - 3 * Math.sin(u * 17)]); food.push([c + 112, 262], [c - 112, 262]);
      hatch(x, food, RD, 0.45, 5); hatch(x, food, B, 0.25, 7, -1); st(x, food.slice(0, -2), 3, { w: 1.8, retrace: false });
      [[-60, 232], [-12, 238], [40, 230], [78, 242], [-90, 244]].forEach(([dx, y], i) => st(x, geo.ellipse(c + dx, y, 8, 5), 4 + i, { w: 1.3, retrace: false }));
      const u = r ? clamp(t / 2.4) : 0, mins = Math.round(u * 20), hot = !r ? 1 : r.ok ? 1 - 0.22 * u : 1 - 0.62 * u;
      // clock and thermometer
      st(x, geo.ellipse(700, 84, 44, 44), 12, { w: 2.6 }); for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; plain(x, [[700 + Math.sin(a) * 36, 84 - Math.cos(a) * 36], [700 + Math.sin(a) * 42, 84 - Math.cos(a) * 42]], B, 0.8, 1.6); }
      const a = mins / 60 * TAU; plain(x, [[700, 84], [700 + Math.sin(a) * 32, 84 - Math.cos(a) * 32]], RD, 0.95, 3.4); text(x, mins + ' min', 700, 160, { font: 'lab', size: 24 });
      const TX = 560; st(x, [[TX - 8, 232], [TX - 8, 70], [TX, 60], [TX + 8, 70], [TX + 8, 232]], 14, { w: 2 }); st(x, geo.ellipse(TX, 244, 15, 15, -1.0, -1.0 + TAU - 1.1), 15, { w: 2 });
      x.save(); x.fillStyle = rgba([225, 50, 50], 0.8); x.beginPath(); x.arc(TX, 244, 10, 0, 7); x.fill(); x.fillRect(TX - 4, 234 - 150 * hot, 8, 150 * hot + 4); x.restore();
      text(x, 'hot', TX + 16, 92, { size: 22, align: 'left' }); text(x, 'cold', TX + 16, 232, { size: 22, align: 'left' });
      const heat = (bounce, al) => { x.save(); x.strokeStyle = rgba(RD, 0.7 * al); x.lineWidth = 2.4; x.setLineDash([9, 7]); x.lineDashOffset = -performance.now() / 1000 * 34; [-70, 0, 70].forEach((dx, i) => { const px = c + dx; x.beginPath(); if (bounce) { x.moveTo(px - 13, 206); x.lineTo(px - 13, 170); x.quadraticCurveTo(px, 152, px + 13, 170); x.lineTo(px + 13, 200); x.moveTo(px + 6, 190); x.lineTo(px + 13, 202); x.lineTo(px + 20, 190); } else { for (let y = 206; y >= 40; y -= 5) { const q = px + Math.sin(y * 0.1 + i) * 6; if (y === 206) x.moveTo(q, y); else x.lineTo(q, y); } } x.stroke(); }); x.restore(); };
      if (!r) { heat(false, 0.8); plain(x, closeP(box(c - 150, 126, 300, 14)), B, 0.6, 2, [8, 7]); text(x, 'lid made of… ?', c, 112, { size: 22, color: RD }); return; }
      heat(r.ok, 0.35 + 0.65 * hot);
      // the lid
      const th = isPaper(m) ? 3 : Math.max(6, MATS[m].th), sag = r.ok ? 0 : (isPaper(m) ? 62 : 24) * Math.pow(u, 1.3), top = [], bot = [];
      for (let v = 0; v <= 1.001; v += 0.04) { const px = c - 152 + 304 * v, y = 148 - th + sag * Math.sin(v * Math.PI); top.push([px, y]); bot.push([px, y + th]); }
      const P = top.concat(bot.slice().reverse()); fill(x, P);
      if (m === 'corr') { const z = []; top.forEach(([px, y], i) => z.push([px, y + (i % 2 ? th - 2 : 2)])); plain(x, z, B, 0.8, 1.2); } else if (m === 'foam') dots(x, P, 160, 5, B, 0.6, 0.9); else if (m === 'dup') hatch(x, top.map(([px, y]) => [px, y + th / 2]).concat(bot.slice().reverse()), B, 0.6, 3);
      if (!r.ok) hatch(x, P, B, 0.55 * u, 3, -1);
      st(x, top, 20, { w: 2.2, amp: 0.3 + (r.ok ? 0 : u) }); st(x, bot, 21, { w: m === 'foil' ? 3.8 : 2.2, amp: 0.3 + (r.ok ? 0 : u) }); plain(x, [top[0], bot[0]], B, 0.9, 2); plain(x, [top[top.length - 1], bot[bot.length - 1]], B, 0.9, 2);
      if (!r.ok) for (let d = 0; d < Math.floor(u * 4.2); d++) { const q = bot[[13, 6, 19, 10][d]]; x.fillStyle = rgba(B, 0.55); x.beginPath(); x.moveTo(q[0], q[1] + 1); x.quadraticCurveTo(q[0] + 6, q[1] + 13, q[0], q[1] + 15); x.quadraticCurveTo(q[0] - 6, q[1] + 13, q[0], q[1] + 1); x.fill(); }
      if (t > 2.4) note(x, r.ok ? 'still hot, lid dry' : 'cold and soggy!', 716, 206, r.ok ? null : c + 120, r.ok ? null : 170);
    },
    // ---- 5: the architect's model ----
    function (x, t, r, m) {
      const BYs = 270; ground(x, 292); const base = box(150, BYs, 560, 22); fill(x, base); hatch(x, base, B, 0.3, 6); st(x, closeP(base), 2, { w: 2.4 });
      // a scale figure and a tree
      st(x, geo.ellipse(110, 214, 9, 9), 3, { w: 1.8 }); st(x, [[110, 223], [110, 252], [102, 270]], 4, { w: 1.8 }); st(x, [[110, 252], [118, 270]], 5, { w: 1.8 }); st(x, [[98, 236], [122, 236]], 6, { w: 1.8 });
      st(x, [[770, 292], [770, 236]], 7, { w: 2.6 }); const cr = geo.ellipse(770, 206, 34, 40); hatch(x, cr, GR, 0.4, 5); st(x, cr, 8, { w: 2, color: GR });
      const XLw = 270, XRw = 590, Hw = 170;
      if (!r) { [XLw, XRw].forEach((wx) => plain(x, closeP(box(wx - 7, BYs - Hw, 14, Hw)), B, 0.6, 2, [8, 7])); plain(x, closeP(box(XLw - 30, BYs - Hw - 16, XRw - XLw + 60, 14)), B, 0.6, 2, [8, 7]); text(x, 'walls and roof made of… ?', 430, 60, { size: 22, color: RD }); return; }
      const th = isPaper(m) ? 2 : MATS[m].th, grow = ease(t / 0.8), down = ease((t - 0.9) / 0.7), flop = r.kind === 'flop', bow = r.kind === 'bow' ? ease((t - 1.5) / 0.7) : 0, fl = flop ? ease((t - 0.5) / 1.0) : 0;
      // back wall with windows (only while the walls stand)
      if (!fl) { const bk = box(XLw, BYs - Hw * grow, XRw - XLw, Hw * grow); plain(x, closeP(bk), B, 0.45, 1.4); if (grow > 0.95) for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) plain(x, closeP(box(XLw + 44 + i * 66, BYs - 140 + j * 66, 34, 40)), B, 0.45, 1.3); }
      const wallPts = (wx, dir) => { const L = [], Rr = [], h = Hw * grow; for (let v = 0; v <= 1.001; v += 0.05) { const y = BYs - h * v, off = dir * (22 * bow * Math.sin(v * Math.PI) + fl * 150 * v * v), dy = fl * 120 * v * v; L.push([wx - th / 2 + off, Math.min(BYs - 2, y + dy)]); Rr.push([wx + th / 2 + off, Math.min(BYs - 2, y + dy)]); } return { L, Rr, P: L.concat(Rr.slice().reverse()) }; };
      [[XLw, -1, 20], [XRw, 1, 24]].forEach(([wx, dir, sd]) => {
        const Wp = wallPts(wx, dir); fill(x, Wp.P);
        if (m === 'corr') { const z = []; Wp.L.forEach(([px, y], i) => z.push([px + (i % 2 ? th - 2 : 2), y])); plain(x, z, B, 0.85, 1.2); } else if (m === 'foam') dots(x, Wp.P, 110, sd, B, 0.6, 0.9); else if (m === 'dup') hatch(x, Wp.P, B, 0.5, 3); else if (m === 'foil') plain(x, Wp.Rr, B, 0.9, 2);
        st(x, Wp.L, sd, { w: 2, amp: 0.3 }); st(x, Wp.Rr, sd + 1, { w: 2, amp: 0.3 }); plain(x, [Wp.L[Wp.L.length - 1], Wp.Rr[Wp.Rr.length - 1]], B, 0.9, 2);
      });
      // the roof comes down
      if (t > 0.9) {
        const ry = flop ? BYs - 6 - (BYs - 60) * (1 - down) : BYs - Hw - 60 * (1 - down) + bow * 12, rot = flop ? 0.08 * down : bow * 0.035, rt = Math.max(th, 3);
        x.save(); x.translate(430, ry); x.rotate(rot); edge(x, m, [-196, -rt], [196, -rt], rt, 30); x.restore();
      }
      if (t > 2.2 && r.tag) note(x, r.tag, 720, 70, r.kind === 'rough' ? XRw + 14 : XRw + 30, r.kind === 'rough' ? 130 : 180);
      if (t > 2.2 && r.kind === 'rough') st(x, geo.ellipse(XRw, 150, 22, 34), 40, { w: 2, color: RD });
      if (t > 2.2 && r.ok) note(x, 'rigid, smooth, light', 720, 70);
    },
    // ---- 6: tracing the logo ----
    function (x, t, r, m) {
      ground(x, 296);
      const LX = 70, LY = 34, LS = 250, cx = LX + LS / 2, cy = LY + LS / 2;
      const logo = (ox, oy, s, col, a, p, wonk) => { const rr = H.rng(11), jig = (P) => (wonk ? P.map(([px, py]) => [px + (rr() - 0.5) * wonk * 2 + wonk * 0.6, py + (rr() - 0.5) * wonk * 2 - wonk * 0.4]) : P), tf = (P) => jig(P).map(([px, py]) => [ox + (px - cx) * s, oy + (py - cy) * s]); const ring = geo.ellipse(cx, cy, 92, 92), sp = star(cx, cy + 4, 70, 5, wonk ? 0.52 : 0.42); if (a <= 0) return; x.save(); x.globalAlpha = a; st(x, tf(wonk ? ring.filter((_, i) => i % 6 === 0).concat([ring[0]]) : ring), 40, { w: 3 * s, color: col, p: clamp(p * 2), amp: wonk ? 2.2 : 0.5 }); if (p > 0.5) st(x, tf(sp), 41, { w: 3 * s, color: col, p: clamp((p - 0.5) * 2), amp: wonk ? 2 : 0.5 }); x.restore(); };
      const sheet0 = box(LX, LY, LS, LS); Ink.hatchShadow(x, sheet0, 1, 6, 6, B); fill(x, sheet0); st(x, closeP(sheet0), 2, { w: 2.2 });
      logo(cx, cy, 1, RD, 1, 1, 0); text(x, "the client's logo", cx, 26, { size: 22 });
      if (!r) { text(x, 'trace it on… ?', 620, 150, { size: 26, color: RD }); return; }
      const see = { tracing: 0.9, layout: 0.55 }[m] || (r.kind === 'faint' ? 0.14 : 0), th = isPaper(m) ? 0 : MATS[m].th;
      const lift = ease((t - 2.0) / 0.6), slide = ease(t / 0.7), ox = (1 - slide) * 520 + lift * 470, oy = -lift * 6;
      const P = box(LX - 12 + ox, LY - 8 + oy, LS + 24, LS + 16);
      if (th) { edge(x, m, P[3], P[2], th, 44); }
      Ink.hatchShadow(x, P, 1, 5 + th * 0.4, 5 + th * 0.4, B);
      x.save(); x.globalCompositeOperation = 'source-over'; x.fillStyle = `rgba(251,250,245,${1 - see})`; path(x, P); x.fill(); x.restore();
      if (m === 'grid') for (let i = 1; i < 10; i++) { plain(x, [[P[0][0] + i * (LS + 24) / 10, P[0][1]], [P[0][0] + i * (LS + 24) / 10, P[3][1]]], B, 0.3, 0.9); plain(x, [[P[0][0], P[0][1] + i * (LS + 16) / 10], [P[1][0], P[0][1] + i * (LS + 16) / 10]], B, 0.3, 0.9); }
      if (m === 'cart') dots(x, P, 320, 9, B, 0.35, 0.8);
      if (m === 'tracing' || m === 'layout') { plain(x, [[P[0][0] + 30, P[0][1] + 60], [P[0][0] + 70, P[0][1] + 20]], B, 0.3, 1.4); plain(x, [[P[0][0] + 44, P[0][1] + 70], [P[0][0] + 96, P[0][1] + 18]], B, 0.3, 1.4); }
      st(x, closeP(P), 46, { w: 2.2 });
      // the pencil traces what the designer can see
      const p = clamp((t - 0.8) / 1.2);
      if (p > 0) logo(cx + ox, cy + oy, 1, B, 1, p, r.ok ? 0 : r.kind === 'faint' ? 12 : 20);
      if (p > 0 && p < 1) { const a = p * TAU * 2, px = cx + Math.cos(a) * 80, py = cy + Math.sin(a) * 80; st(x, [[px, py], [px + 46, py - 66]], 48, { w: 5 }); st(x, [[px, py], [px + 7, py - 10]], 49, { w: 2, color: RD, retrace: false }); }
      if (t > 2.5) { note(x, r.ok ? 'a perfect copy' : r.tag, cx + ox, 316 - 2, null); if (r.ok) Ink.tick(x, cx + ox + 120, LY + LS - 10, 1.4); else Ink.cross(x, cx + ox + 120, LY + LS - 20, 1.3); }
    },
  ];

  function Stage(parent) {
    const c = document.createElement('canvas'); parent.appendChild(c);
    const dpr = Math.min(2, window.devicePixelRatio || 1); c.width = Math.round(W * dpr); c.height = Math.round(Hh * dpr);
    Object.assign(c.style, { width: '100%', height: 'auto', aspectRatio: W + ' / ' + Hh, display: 'block', touchAction: 'manipulation', userSelect: 'none', webkitUserSelect: 'none' });
    const x = c.getContext('2d');
    return { c, paint(fn) { x.setTransform(dpr, 0, 0, dpr, 0, 0); x.globalCompositeOperation = 'source-over'; x.globalAlpha = 1; x.clearRect(0, 0, W, Hh); x.globalCompositeOperation = 'multiply'; x.lineCap = x.lineJoin = 'round'; fn(x); } };
  }

  Book.page({
    id: 'p08',
    title: 'Choose the paper or board',
    build(ui, root) {
      const css = document.createElement('style');
      css.textContent = `
        .p08-bench{position:relative;margin:0 0 calc(var(--R)*1.4);padding:12px 14px 14px;background:rgba(251,250,245,.9)}
        .p08-tabs{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 10px}
        .p08-tab{flex:1 1 auto;font:700 16px Fredoka,system-ui;color:var(--ink);background:#fff;border:2px solid rgba(30,46,150,.4);border-radius:12px 12px 4px 4px;min-height:46px;padding:6px 10px;cursor:pointer;line-height:1.2;touch-action:manipulation}
        .p08-tab.on{background:var(--ink);color:#fff;border-color:var(--ink)}
        .p08-tab .tk{color:var(--green);margin-left:4px}.p08-tab.on .tk{color:#9df0b6}
        .p08-brief{display:flex;gap:12px;align-items:center;background:rgba(255,236,120,.45);border-left:5px solid rgba(240,200,60,.9);padding:8px 14px;margin:0 0 10px;line-height:1.45;font-size:19px;transform:rotate(-.3deg)}
        .p08-brief .n{font:700 15px Fredoka,system-ui;color:var(--red);white-space:nowrap;letter-spacing:.06em}
        .p08-brief b{font-family:Fredoka;font-weight:600}
        .p08-stagewrap{position:relative;margin:0 0 8px}
        .p08-stamp{display:inline-block;font:700 26px Fredoka,system-ui;letter-spacing:.04em;padding:2px 14px;border:4px solid;border-radius:10px;transform:rotate(-7deg) scale(0);transition:transform .25s cubic-bezier(.3,1.6,.5,1);background:rgba(251,250,245,.85);pointer-events:none;margin-left:auto}
        .p08-stamp.on{transform:rotate(-7deg) scale(1)}.p08-stamp.good{color:var(--green)}.p08-stamp.bad{color:var(--red)}
        .p08-tray{display:grid;grid-template-columns:repeat(auto-fill,minmax(168px,1fr));gap:8px;margin:0 0 10px}
        .p08-card{display:flex;align-items:center;gap:6px;background:#fff;border:2px solid rgba(30,46,150,.4);border-radius:10px;padding:2px 8px 2px 2px;min-height:58px;cursor:pointer;font:600 15.5px Fredoka,system-ui;color:var(--ink);text-align:left;line-height:1.15;touch-action:manipulation}
        .p08-card .p08-ic{flex:0 0 62px;width:62px;height:45px}
        .p08-card.picked{border-color:var(--ink);background:#e8ecff;transform:rotate(-1.2deg) scale(1.03);box-shadow:0 4px 10px rgba(30,46,150,.25)}
        .p08-card.bad{border-color:rgba(178,28,38,.55);background:#fdf1f1}.p08-card.good{border-color:var(--green);background:#e6f6ea}
        .p08-card:disabled{cursor:default}
        .p08-row{display:flex;flex-wrap:wrap;gap:10px;align-items:center}
        .p08-row .btn{margin-top:0}
        .p08-go{font-size:20px!important;padding:10px 26px!important}
        .p08-tip{font-size:16px;color:rgba(30,46,150,.75);line-height:1.4;flex:1 1 220px}
        .p08-bench .fb{font-size:18px}.p08-bench .fb b{font-family:Fredoka;font-weight:600}
        .p08-bench.recall .fb,.p08-bench.recall .p08-stagewrap,.p08-bench.recall .p08-brief{filter:blur(7px);opacity:.5;pointer-events:none}
        @media (max-width:700px){.p08-card{font-size:14.5px}.p08-brief{font-size:18px}}`;
      root.appendChild(css);

      ui.h('Choose the paper or board');
      ui.p('Now <b>you</b> are the designer. Six clients, six jobs, and <b>eleven</b> papers and boards on your shelf. For each brief, tap the one you would use, then press <b>TEST</b> and watch what happens.');
      ui.p('If it fails, watch <b>why</b>, then choose again. <span class="key">Every test is saved for your teacher</span>, so think before you press!', 'small');

      const NB = [1, 2, 3, 4, 5, 6], recs = {};
      NB.forEach((b) => (recs[b] = ui.record('p08.b' + b, { label: `Brief ${b}: ${BR[b].short} (choose the paper/board)`, type: 'choose', max: 1 })));
      const ST = {}; NB.forEach((b) => { const s = recs[b].get() || {}; ST[b] = { sel: s.sel || null, tries: (s.tries || []).slice(), mis: (s.mis || '').split(',').filter(Boolean) }; });
      const solved = (b) => ST[b].tries.some((t) => t.ok);
      let cur = NB.find((b) => !solved(b)) || 1, run = null; // run = { b, m, r, t }

      const bench = ui.el('div', 'p08-bench'); requestAnimationFrame(() => Ink.frame(bench, { w: 2.4 }));
      const tabs = ui.el('div', 'p08-tabs', '', bench), tabEls = {};
      NB.forEach((b) => { const t = ui.el('button', 'p08-tab', '', tabs); t.type = 'button'; tabEls[b] = t; t.onclick = () => { if (b === cur) return; Book.sfx('paper', { gain: 0.3, dur: 0.2 }); cur = b; run = null; sync(); }; });
      const brief = ui.el('div', 'p08-brief', '', bench);
      const wrap = ui.el('div', 'p08-stagewrap', '', bench), S = Stage(wrap);
      const tray = ui.el('div', 'p08-tray', '', bench), cardEls = {};
      ORDER.forEach((m) => { const c = ui.el('button', 'p08-card', '', tray); c.type = 'button'; c.appendChild(icon(m)); ui.el('span', '', MATS[m].name, c); cardEls[m] = c; c.onclick = () => { if (run && run.t < DUR) return; ST[cur].sel = m; run = null; Book.sfx('tick', { gain: 0.5 }); sync(); }; });
      const row = ui.el('div', 'p08-row', '', bench);
      const goBtn = ui.el('button', 'btn p08-go', 'TEST IT ▸', row); goBtn.type = 'button';
      const nextBtn = ui.el('button', 'btn ghost', 'Next brief ▸', row); nextBtn.type = 'button';
      const tip = ui.el('span', 'p08-tip', '', row);
      const stamp = ui.el('div', 'p08-stamp', '', row);
      const fb = ui.el('div', 'fb', '', bench);

      function commit(b) {
        const s = ST[b], done = solved(b);
        recs[b].set({ answer: s.tries.map((t, i) => `${i + 1}) ${t.c} ${t.ok ? '✓ works' : '✗ fails'}`).join('; '), correct: done, score: done ? 1 : 0, max: 1, mis: s.mis.join(','), tries: s.tries, sel: s.sel });
      }
      const draw = () => S.paint((x) => SCENES[cur](x, run ? run.t : -1, run ? run.r : null, run ? run.m : null));
      function sync() {
        const s = ST[cur], busy = run && run.t < DUR;
        NB.forEach((b) => { tabEls[b].innerHTML = b + '. ' + BR[b].tab + (solved(b) ? '<span class="tk">✓</span>' : ''); tabEls[b].classList.toggle('on', b === cur); });
        brief.innerHTML = `<span class="n">BRIEF ${cur}</span><span>${BR[cur].text}</span>`;
        ORDER.forEach((m) => { const t = s.tries.find((q) => q.m === m); cardEls[m].classList.toggle('picked', s.sel === m); cardEls[m].classList.toggle('bad', !!t && !t.ok); cardEls[m].classList.toggle('good', !!t && t.ok); });
        goBtn.disabled = !s.sel || busy;
        nextBtn.style.display = solved(cur) && !busy ? '' : 'none'; nextBtn.textContent = NB.every(solved) ? 'All six solved ✓' : 'Next brief ▸'; nextBtn.disabled = NB.every(solved);
        tip.textContent = busy ? 'Testing…' : !s.sel ? 'Tap a paper or board, then test it.' : run ? (run.r.ok ? '' : 'Choose again and re-test.') : `Test ${low(s.sel)}?`;
        if (!run) { stamp.className = 'p08-stamp'; const won = s.tries.find((t) => t.ok); fb.className = won ? 'fb on good' : 'fb'; fb.innerHTML = won ? `✓ Solved with <b>${low(won.m)}</b>. You can still test the others to see what happens.` : ''; }
        draw();
      }
      function verdict() {
        const r = run.r;
        fb.className = 'fb on ' + (r.ok ? 'good' : 'bad');
        fb.innerHTML = (r.ok ? '✓ It works! ' : '✗ ') + r.msg + (r.more ? ` <span class="small">${r.more}</span>` : '');
        stamp.textContent = r.ok ? 'IT WORKS!' : 'NOT YET…'; stamp.className = 'p08-stamp on ' + (r.ok ? 'good' : 'bad');
        Book.sfx(r.ok ? 'success' : 'error', { gain: 0.4 }); sync();
        requestAnimationFrame(() => { const sh = bench.closest('.sheet'), rc = fb.getBoundingClientRect(); if (sh && rc.bottom > innerHeight - 90) sh.scrollTop += rc.bottom - (innerHeight - 96); });
      }
      const hidden = () => { const p = root.closest('.page'); return !p || p.classList.contains('hidden'); };
      let last = 0;
      function tick(now) {
        if (!run || run.done) return;
        if (hidden()) { last = 0; setTimeout(() => requestAnimationFrame(tick), 400); return; }
        const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60; last = now; const t0 = run.t;
        run.t += dt;
        if (run.b === 1 && t0 < 1.5 && run.t >= 1.5) { Book.sfx(run.r.ok ? 'thud' : 'impact', { gain: 0.6 }); if (!run.r.ok) Book.sfx('glitch', { gain: 0.4 }); }
        draw();
        if (t0 < DUR && run.t >= DUR) verdict();
        if (run.t > DUR + 0.8 && run.b !== 4) { run.done = true; return; }
        if (run.t > DUR + 6) { run.done = true; return; }
        requestAnimationFrame(tick);
      }
      goBtn.onclick = () => {
        const b = cur, s = ST[b], m = s.sel; if (!m || (run && run.t < DUR)) return;
        const r = BR[b].judge(m);
        s.tries.push({ m, c: MATS[m].name, ok: r.ok }); if (!r.ok && r.mis && !s.mis.includes(r.mis)) s.mis.push(r.mis);
        commit(b);
        run = { b, m, r, t: 0 }; last = 0; fb.className = 'fb'; fb.innerHTML = ''; stamp.className = 'p08-stamp';
        Book.sfx('stamp', { gain: 0.5 }); Book.scribble(0.3); sync(); requestAnimationFrame(tick);
        const rc = wrap.getBoundingClientRect(), sh = bench.closest('.sheet'); if (sh && rc.top < 60) sh.scrollTop += rc.top - 70;
      };
      nextBtn.onclick = () => { const n = NB.find((b) => !solved(b)); if (n == null) return; cur = n; run = null; Book.sfx('paper', { gain: 0.3, dur: 0.2 }); sync(); const sh = bench.closest('.sheet'), rc = bench.getBoundingClientRect(); if (sh) sh.scrollTop += rc.top - 70; };
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);
      sync();

      // ---- written answer ----
      ui.p('Last job: put one of your choices into words, like an exam answer. <span class="small">(The test bench blurs while you write.)</span>');
      const wr = ui.write({
        id: 'p08.explain', label: 'Explain why corrugated card is used for boxes sent through the post [3]', marks: 3, lines: 5,
        q: 'Explain why <b>corrugated card</b> is used for boxes that are sent through the post.',
        scheme: ['I described its structure: a wavy <b>fluted</b> layer between two flat <b>liners</b>', 'I said it <b>absorbs impacts</b>, so it protects what is inside from knocks and drops', 'I said it is <b>strong and stiff for its weight</b> / lightweight (so it is cheap to post)', '(Also accept) it is cheap / it can be recycled'],
        model: 'Corrugated card has a wavy fluted layer glued between two flat liners. The flutes absorb impacts, so the contents are protected if the box is dropped. It is also strong and stiff for its weight, so the box is light and cheap to post.',
      });
      const ta = wr.querySelector('textarea'), wb = wr.querySelector('.btn');
      ta.addEventListener('focus', () => { if (!wr.querySelector('.scheme.on')) bench.classList.add('recall'); });
      ta.addEventListener('blur', () => { if (!ta.value.trim()) bench.classList.remove('recall'); });
      wb.addEventListener('click', () => setTimeout(() => { if (wr.querySelector('.scheme.on')) bench.classList.remove('recall'); }, 30));
    },
  });
})();
