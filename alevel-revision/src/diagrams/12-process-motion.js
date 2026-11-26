/* Animations for extrusion, blow moulding, vacuum forming and pressure die casting. See 01-motion-kit.js for the format. */
(() => {
 const K = Object.assign({ melt: '#ec7a3c', trans: '#f8cf8f', cast: '#b9c2cc' }, D.K), { sm, mix } = FIGX;
 const num = (u, x, y, n) => `<circle cx="${u.X(x)}" cy="${u.Y(y)}" r="11" fill="${K.ink2}" stroke="#fff" stroke-width="1.5"/><text x="${u.X(x)}" y="${u.Y(y) + 4.5}" font-family="Arial,sans-serif" font-size="12.5" font-weight="700" text-anchor="middle" fill="#fff">${n}</text>`;
 const lerpP = (A, B, e) => A.map((p, i) => [p[0] + (B[i][0] - p[0]) * e, p[1] + (B[i][1] - p[1]) * e]);

 /* ---- extrusion: runs all the time ---- */
 { const u = U2(20, 352, 150), { X, Y, R, PG, C, SH, AR, ROT, T } = u, W = 776, H = 290;
  let seed = 5; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }; const GR = [], GB = [];
  for (let i = 0; i < 44; i++) { const y = 1.9 + rnd() * 3.5, hw = .5 + (y - 1.6) * .27 - .16; GR.push([-12.5 + (rnd() * 2 - 1) * hw, y]); } for (let i = 0; i < 24; i++) GB.push([-14.3 + rnd() * 3.2, (rnd() * 2 - 1) * .82]);
  const gran = (g, r) => `<circle cx="${X(g[0])}" cy="${Y(g[1])}" r="${r}" fill="${K.mat}" stroke="${K.ink}" stroke-width=".9"/>`;
  const draw = (t, id, still) => { const o = [], h = 'exh' + id, v = t * 3;
   o.push(`<defs>${u.hatchDef(h)}<clipPath id="exb${id}"><rect x="${X(-14.5)}" y="${Y(1)}" width="230" height="40"/></clipPath><clipPath id="exv${id}"><rect x="0" y="0" width="${X(20.9)}" height="${H}"/></clipPath></defs>`);
   o.push(R(-17.3, 20.9, -6.2, -4.5, 'dark', 4), R(-17, -2.4, -4.5, -1.9, 'pale'));
   o.push(R(-17, -15.6, -1.6, 1.6, 'dark', 6), R(-15.6, -14.5, -1.3, 1.3, 'steel', 3));
   o.push(R(-14.5, -3, -1.6, 1.6, 'steel'), `<rect x="${X(-14.5)}" y="${Y(1.6)}" width="230" height="64" fill="url(#${h})"/>`, R(-14.5, -3, -1, 1, 'pale', 0, 1.5));
   o.push(`<rect x="${X(-11.4)}" y="${Y(1)}" width="60" height="40" fill="${K.trans}"/><rect x="${X(-8.6)}" y="${Y(1)}" width="112" height="40" fill="${K.melt}"/><rect x="${X(-13.1) + 1}" y="${Y(1.62)}" width="22" height="14" fill="${K.pale}"/>`);
   o.push(`<g clip-path="url(#exb${id})">` + GB.map((g) => gran(g, 2.6)).join('') + R(-15.4, -3.6, -.5, .5, 'dark', 0, 1.6));
   for (let x = -15.8 + ((v * 1.2) % 1.2); x < -4.4; x += 1.2) o.push(PG([[x, -.95], [x + .26, -.95], [x + .86, .95], [x + .6, .95]], 'steel', 1.6));
   o.push('</g>'); [-10.5, -8.5, -6.5, -4.5].forEach((x) => o.push(R(x - .5, x + .5, 1.6, 1.92, 'hot', 3), R(x - .5, x + .5, -1.92, -1.6, 'hot', 3)));
   o.push(PG([[-14.4, 6], [-10.6, 6], [-11.9, 1.6], [-13.1, 1.6]], 'pale'), GR.map((g) => gran(g, 2.9)).join(''));
   // die: the melt is squeezed down to the shape of the opening
   [1, -1].forEach((m) => o.push(PG([[-3, 1 * m], [-3, 2.2 * m], [-1.4, 2.2 * m], [-1.4, .4 * m], [-2.2, .4 * m]], 'steel') + PG([[-3, 1 * m], [-3, 2.2 * m], [-1.4, 2.2 * m], [-1.4, .4 * m], [-2.2, .4 * m]], `url(#${h})`, 0)));
   o.push(PG([[-3, 1], [-2.2, .4], [-1.4, .4], [-1.4, -.4], [-2.2, -.4], [-3, -1]], K.melt, 1.5));
   // cooling trough, haul-off, cutter, the cut lengths
   o.push(`<g clip-path="url(#exv${id})">`, R(.4, 7.6, -1.5, .9, 'none'), `<rect x="${X(.4) + 1}" y="${Y(.55)}" width="142" height="40" fill="${K.cool}" opacity=".75"/>`);
   const end = 14 + (v % 3), hotEnd = 1.2;
   o.push(R(-1.4, hotEnd, -.4, .4, K.melt, 0, 1.6), R(hotEnd, end, -.4, .4, 'mat', 0, 1.6));
   for (let x = -1 + (v % 1); x < end - .2; x += 1) o.push(`<line x1="${X(x)}" y1="${Y(.4)}" x2="${X(x)}" y2="${Y(-.4)}" stroke="${K.ink}" stroke-width="1" opacity=".35"/>`);
   [0, 3].forEach((k) => { const a = end + .25 + k; o.push(R(a, a + 3, -.4, .4, 'mat', 0, 1.6)); });
   o.push(`<path d="M${X(.5)} ${Y(.55)} q9 -6 18 0 t18 0 t18 0 t18 0 t18 0 t18 0 t18 0 t14 0" fill="none" stroke="${K.ink}" stroke-width="1.3"/>`, '</g>');
   [1.15, -1.15].forEach((y, i) => { o.push(C(10.4, y, .75, 'dark')); const a = (v / .75) * (i ? 1 : -1); [0, 1, 2].forEach((k) => o.push(`<line x1="${X(10.4)}" y1="${Y(y)}" x2="${X(10.4 + .7 * Math.cos(a + k * 2.094))}" y2="${Y(y + .7 * Math.sin(a + k * 2.094))}" stroke="${K.ink}" stroke-width="1.6"/>`)); });
   o.push(R(8.4, 12.4, -4.5, -2.2, 'pale'), R(14.2, 20.6, -.75, -.4, 'pale', 0, 1.5), R(14.6, 15, -4.5, -.75, 'pale', 0, 1.5), R(19.6, 20, -4.5, -.75, 'pale', 0, 1.5));
   const f = v % 3, cutY = (f > 2.82 ? (f - 2.82) / .18 : f < .18 ? 1 - f / .18 : 0) * 1.5;
   o.push(R(13.6, 14.4, 3 - cutY, 3.6 - cutY, 'dark', 2), PG([[13.86, 3 - cutY], [14.14, 3 - cutY], [14, 1.3 - cutY]], 'steel', 1.6), R(13.4, 14.6, 3.6, 4.2, 'steel', 2));
   if (!still) o.push(num(u, -12.5, 6.9, 1), num(u, -7.5, 3.1, 2), num(u, -2.2, 3.3, 3), num(u, 4, 2, 4), num(u, 10.4, 3, 5), AR(15, 1.6, 18, 1.6));
   return o.join(''); };
  const mk = (x, y, s, tx, ty) => [X(x), Y(y), s, X(tx), Y(ty)];
  DIAGRAMS['extrusion'] = { t: 'Extrusion of a polymer', w: W, h: H, svg: draw(.4, 's', true), parts: [mk(-15.5, 6.2, 'Hopper of granules', -13.4, 4.6), mk(-16.3, 3.4, 'Motor', -16.3, 1.4), mk(-9.5, -3.2, 'Rotating screw', -9.5, -.3), mk(-6.5, 3.6, 'Heater bands', -6.5, 1.8), mk(-2.2, 4.2, 'Die (gives the cross-section)', -2.2, 1.6),
   mk(4, 2.6, 'Cooling water trough', 4, .7), mk(10.4, 3.6, 'Haul-off rollers', 10.4, 1.6), mk(15.6, 5, 'Cutter', 14.3, 3.3), mk(7.6, -3, 'Extrusion (constant cross-section)', 8.6, -.2)] };
  ANIMS['extrusion'] = { loop: true, dur: 5200, draw, watch: ['Granules fall from the hopper into the heated barrel.', 'The screw turns all the time. It carries the polymer forward while the heater bands and friction melt it.', 'The melt is forced through the die, which gives the extrusion its cross-section.', 'The extrusion passes through a water trough, so it cools and keeps its shape.', 'Haul-off rollers pull it along at a steady speed and a cutter cuts it to length.'] }; }

 /* ---- extrusion blow moulding ---- */
 { const u = U2(22, 250, 168), { X, Y, R, PG, C, AR, T } = u, W = 500, H = 340;
  const ST = [[0, .2, 'Extrude the parison', 'A tube of hot, soft polymer called a parison is extruded downwards between the two open halves of the mould.'],
   [.2, .34, 'Close the mould', 'The mould halves close on the parison. The bottom is pinched shut and sealed, and the top is gripped round the blow pin.'],
   [.34, .52, 'Blow', 'Compressed air is blown in through the blow pin. The parison inflates like a balloon until it presses against the cold walls of the mould.'],
   [.52, .72, 'Cool', 'The polymer cools against the water-cooled mould and sets in the shape of the cavity.'],
   [.72, 1, 'Open and eject', 'The mould opens and the bottle is removed. The waste pinched off at the top and bottom, called flash, is trimmed away.', .9]];
  const half = [[.6, 3.5], [4.6, 3.5], [4.6, -5.5], [0, -5.5], [0, -4.8], [1.9, -4.8], [1.9, 1], [.6, 2.2]];
  const bottle = [[.6, 3.5], [.6, 2.2], [1.9, 1], [1.9, -4.8], [0, -4.8]], tube = [[.5, 3.5], [.5, 2.2], [.5, 1], [.5, -4.8], [.5, -4.8]];
  const draw = (t, id) => { const o = [], h = 'bmh' + id, open = t < .5 ? 1 - sm(.2, .34, t) : sm(.72, .84, t), g = open * 3, len = t < .72 ? sm(0, .2, t) : 1, e = sm(.34, .5, t), cool = sm(.52, .72, t), drop = Math.pow(sm(.86, .99, t), 2) * 2.6, col = mix(K.hot, K.mat, cool), pinch = sm(.24, .34, t);
   o.push(`<defs>${u.hatchDef(h)}</defs>`, R(-11, 11, -7.4, -6.6, 'dark', 3));
   o.push(R(-10.6, -1.6, 4.9, 6.1, 'steel'), T(-6.4, 5.3, 'from the extruder', 12), AR(-4.2, 6.7, -2, 6.7), R(-1.6, 1.6, 4.5, 6.6, 'steel'), `<rect x="${X(-1.6)}" y="${Y(6.6)}" width="${3.2 * 22}" height="${2.1 * 22}" fill="url(#${h})"/>`);
   o.push(R(-.55, -.3, 4.5, 6.2, K.melt, 0, 1.2), R(.3, .55, 4.5, 6.2, K.melt, 0, 1.2));
   [1, -1].forEach((m) => { o.push(R(m > 0 ? 4.6 + g : -9.4, m > 0 ? 9.4 : -4.6 - g, -1.4, -.6, 'steel'), R(m > 0 ? 9.2 : -10.8, m > 0 ? 10.8 : -9.2, -2.4, .4, 'dark', 4)); });
   // parison or bottle (drawn behind the mould faces so the pinch looks right)
   const yb = 4.5 - len * 10.6, py = -drop;
   if (t >= .2 || len > 0) { if (t < .2) o.push(R(-.5, .5, yb, 4.5, K.hot), R(-.3, .3, yb - .02, 4.52, '#fff', 0, 0).replace(/stroke="[^"]*"/, 'stroke="none"'));
    else { const pf = lerpP(tube, bottle, e).map((p, i) => (i === 4 ? [p[0] * (1 - pinch), p[1]] : p)), inner = pf.map((p, i) => [Math.max(0, p[0] - .2), i === 3 || i === 4 ? p[1] + .2 : p[1]]);
     if (t < .84) o.push(R(-.5, .5, 3.5, 4.5, col)); if (drop < .05) o.push(R(-.5 * (1 - pinch) - .06, .5 * (1 - pinch) + .06, -6.1, -4.8, col, 0, 1.5));
     o.push(PG(u.both(pf.map((p) => [p[1], p[0]])).map((p) => [p[1], p[0]]), col, 2, 0, py), PG(u.both(inner.map((p) => [p[1], p[0]])).map((p) => [p[1], p[0]]), '#fff', 1.2, 0, py)); } }
   [1, -1].forEach((m) => { const pts = half.map((p) => [p[0] * m + m * g, p[1]]); o.push(PG(pts, 'steel'), PG(pts, `url(#${h})`, 0)); [[3.2, 2], [3.4, -1.5], [3.2, -4.4]].forEach((c) => o.push(C(c[0] * m + m * g, c[1], .2, 'cool', 1.3))); });
   o.push(R(-.13, .13, 2.9, 7.2, 'dark', 0, 1.4));
   if (t >= .34 && t < .52) o.push(AR(0, 8.4, 0, 7.3), AR(.4, -1, 1.5, -1), AR(-.4, -1, -1.5, -1), AR(.4, -3.4, 1.5, -3.4), AR(-.4, -3.4, -1.5, -3.4), T(1.2, 7.7, 'compressed air', 12, 'start', 'ink2'));
   if (t >= .2 && t < .34) o.push(AR(8.6, .9, 6.6, .9), AR(-8.6, .9, -6.6, .9)); if (t >= .72 && t < .86) o.push(AR(6.6, .9, 8.6, .9), AR(-6.6, .9, -8.6, .9)); if (t < .2) o.push(AR(1.4, 3, 1.4, .8));
   return o.join(''); };
  ANIMS['blow-moulding'] = { stages: ST, draw, w: W, h: H, start: .45 }; }

 /* ---- vacuum forming ---- */
 { const u = U2(24, 190, 112), { X, Y, R, PG, PL, AR, T } = u, W = 440, H = 300;
  const ST = [[0, .1, 'Clamp the sheet', 'A mould is placed on the platen. A sheet of thermoforming polymer, such as HIPS, is clamped in the frame above it so the edges are airtight.'],
   [.1, .32, 'Heat', 'The heater is moved over the sheet. The sheet softens and starts to sag when it is flexible enough to form.'],
   [.32, .48, 'Raise the platen', 'The heater is moved away and the platen is raised, pushing the mould up into the soft sheet.'],
   [.48, .64, 'Vacuum on', 'The pump removes the air from under the sheet. Air pressure above pushes the sheet tightly over the mould.'],
   [.64, .8, 'Cool', 'The sheet cools and becomes rigid in the shape of the mould.'],
   [.8, 1, 'Release and trim', 'The platen is lowered and the sheet is unclamped. Draft angles on the mould let it come away cleanly. The waste round the edge is trimmed off.', .92]];
  const draw = (t, id) => { const o = [], heatIn = sm(.1, .15, t) - sm(.3, .36, t), soft = sm(.12, .3, t) - sm(.64, .8, t), sag = (sm(.16, .32, t)) * .9, up = sm(.34, .47, t) - sm(.8, .9, t), tight = sm(.49, .62, t), lift = sm(.9, .99, t), top = -3.5 + up * 3.2 + 2.2, pyS = -3.5 + up * 3.2;
   o.push(R(-6.2, 6.2, -5.2, 0, 'pale', 4), R(-6.2, 6.2, -7, -5.2, 'dark', 4), T(0, -6.35, t >= .48 && t < .8 ? 'vacuum pump ON' : 'vacuum pump', 12, 'middle', '#fff'));
   o.push(R(-.3, .3, -5.2, pyS - .4, 'steel'), R(-4.4, 4.4, pyS - .4, pyS, 'steel'), PG([[-2.4, pyS], [-1.6, pyS + 2.2], [1.6, pyS + 2.2], [2.4, pyS]], 'wood'));
   [-3.4, -2.8, 2.8, 3.4].forEach((x) => o.push(`<line x1="${X(x)}" y1="${Y(pyS)}" x2="${X(x)}" y2="${Y(pyS - .4)}" stroke="${K.ink}" stroke-width="2.5"/>`));
   // the sheet: flat, sagging, lifted by the mould, then pulled tight
   const fin = t >= .8, T0 = fin ? 1.9 : top, P0 = fin ? -.3 : pyS, shape = [[4.9, 0], [3.8, 0], [2.7, 0], [1.6, 0], [0, 0]].map((p, i) => { const sg = -sag * [0, .5, .85, 1, 1][i] * (1 - tight), tent = T0 * [0, 1 / 3, 2 / 3, 1, 1][i], tg = [[4.9, 0], [4.3, P0], [2.45, P0], [1.6, T0], [0, T0]][i];
    const y0 = Math.max(sg, Math.min(tent, T0 > 0 ? tent : -9)); return [p[0] + (tg[0] - p[0]) * tight, (y0 + (tg[1] - y0) * tight) + lift * .9]; });
   const pts = shape.concat(shape.slice(0, 4).reverse().map((p) => [-p[0], p[1]])), sc = mix('#5b8fd9', K.hot, Math.max(0, soft));
   o.push(PL([[6.1, lift * .9]].concat(pts, [[-6.1, lift * .9]]), 7, K.ink), PL([[6.1, lift * .9]].concat(pts, [[-6.1, lift * .9]]), 4.2, sc));
   [1, -1].forEach((m) => o.push(R(m > 0 ? 4.9 : -6.4, m > 0 ? 6.4 : -4.9, -.5, -.1, 'dark', 2), R(m > 0 ? 4.9 : -6.4, m > 0 ? 6.4 : -4.9, .1 + lift * 1.5, .5 + lift * 1.5, 'dark', 2)));
   const hx = (1 - heatIn) * 13; if (heatIn > .01) { o.push(R(-5.6 + hx, 5.6 + hx, 2.7, 3.5, 'hot', 5)); if (heatIn > .9) [-4, -2, 0, 2, 4].forEach((x) => o.push(AR(x, 2.5, x, 1.3, 'hot'))); }
   if (t >= .34 && t < .48) o.push(AR(5.4, -3.6, 5.4, -1.4)); if (t >= .48 && t < .64) o.push(AR(-3.1, -1.2, -3.1, -4.4), AR(3.1, -1.2, 3.1, -4.4), AR(-3, 3.6, -2.2, 2.4, 'ink'), AR(3, 3.6, 2.2, 2.4, 'ink'), T(0, 3.9, 'air pressure', 12));
   if (t >= .64 && t < .8) o.push(T(0, 3.4, 'cooling', 12, 'middle', 'ink2')); if (t >= .8 && t < .9) o.push(AR(5.4, -1.4, 5.4, -3.6));
   return o.join(''); };
  ANIMS['vacuum-forming'] = { stages: ST, draw, w: W, h: H, start: .56 }; }

 /* ---- pressure die casting (cold chamber) ---- */
 { const u = U2(20, 300, 150), { X, Y, R, PG, C, SH, AR, T, both } = u, W = 640, H = 290;
  const ST = [[0, .1, 'Close the die', 'The two halves of the steel die are closed and locked together.'],
   [.1, .3, 'Ladle the metal', 'A measured amount of molten metal, usually an aluminium alloy, is ladled from a separate furnace into the shot sleeve. That is why it is called cold chamber.'],
   [.3, .44, 'Inject', 'A hydraulic plunger forces the metal into the die cavity at very high pressure, so it fills thin sections and fine detail.'],
   [.44, .62, 'Solidify', 'The pressure is held while the metal cools quickly against the water-cooled steel die and turns solid.'],
   [.62, .78, 'Open the die', 'The moving half of the die is pulled back. The casting stays on the moving half.'],
   [.78, 1, 'Eject', 'Ejector pins push the casting out. The plunger goes back, and the sprue and any flash are trimmed off and remelted.', .93]];
  const fixed = [[0, .9], [0, 3], [2.2, 3], [2.2, 2.2], [1.2, 2.2], [1.2, .9]], moving = [[2.2, 0], [2.2, 3], [4.8, 3], [4.8, 0]];
  const cast = [[0, .9], [1.2, .9], [1.2, 2.2], [2.2, 2.2], [2.2, 0], [0, 0]];
  const draw = (t, id) => { const o = [], h = 'dch' + id, open = t < .5 ? 1 - sm(0, .1, t) : sm(.62, .76, t), dx = open * 3, pour = sm(.12, .16, t) - sm(.26, .3, t), lvl = sm(.14, .28, t), inj = sm(.3, .43, t) - sm(.86, .98, t), cool = sm(.44, .62, t), push = sm(.78, .86, t) * 1.3, drop = Math.pow(sm(.86, .98, t), 2) * 3.2, col = mix(K.hot, K.cast, cool), has = t >= .3;
   o.push(`<defs>${u.hatchDef(h)}<clipPath id="dcf${id}"><rect x="${X(0)}" y="${Y(2.4)}" width="${(sm(.3, .42, t) * 46).toFixed(1)}" height="96"/></clipPath></defs>`);
   o.push(R(-14.6, 14.6, -6.4, -4.6, 'dark', 4), R(-14, -10.4, -1.5, 1.5, 'steel', 6), SH(-13.8, -10.6, .7, 1));
   [3.4, -3.4].forEach((y) => o.push(R(0, 11.6, y - .3, y + .3, 'steel')));
   // shot sleeve with its pouring hole, plunger and the metal in it
   o.push(R(-8, 0, -.9, .9, 'pale', 0, 1.5)); const px = -7.6 + inj * 6.9;
   if (!has && lvl > 0) o.push(`<rect x="${X(-6.9)}" y="${Y(-.9 + lvl * 1.1)}" width="${6.9 * 20}" height="${(lvl * 1.1 * 20).toFixed(1)}" fill="${K.hot}"/>`); if (has && inj < 1 && t < .5) o.push(`<rect x="${X(px + .7)}" y="${Y(.9)}" width="${Math.max(0, (-px - .7) * 20).toFixed(1)}" height="36" fill="${K.hot}"/>`);
   o.push(R(-10.4, px, -.3, .3, 'steel', 0, 1.6), R(px, px + .7, -.86, .86, 'dark', 2));
   o.push(R(-8, -5.6, .9, 1.4, 'steel'), R(-4.4, 0, .9, 1.4, 'steel'), R(-8, 0, -1.4, -.9, 'steel'), R(-1, 0, 1.4, 4.4, 'dark'), R(-1, 0, -4.4, -1.4, 'dark'));
   if (pour > .01) { const lx = -5, ly = 3.4; o.push(`<g transform="rotate(${(-48 * pour).toFixed(1)} ${X(lx)} ${Y(ly)})">` + PG([[lx - .2, ly + .9], [lx + 1.9, ly + .9], [lx + 1.6, ly - .7], [lx + .1, ly - .7]], 'dark') + PG([[lx, ly + .6], [lx + 1.8, ly + .6], [lx + 1.55, ly - .5], [lx + .2, ly - .5]], K.hot, 1.2) + R(lx + 1.9, lx + 4.6, ly + .2, ly + .5, 'steel') + '</g>'); if (pour > .9) o.push(R(-5.15, -4.85, -.6, 2.6, K.hot, 0, 0).replace(/stroke="[^"]*"/, 'stroke="none"')); }
   // die halves, cooling channels, clamp
   [fixed, fixed.map((p) => [p[0], -p[1]])].forEach((q) => o.push(PG(q, 'steel'), PG(q, `url(#${h})`, 0))); [[1.3, 2.7], [1.3, -2.7]].forEach((c) => o.push(C(c[0], c[1], .2, 'cool', 1.3)));
   o.push(R(8.6 + dx, 11.6 + dx, -.7, .7, 'steel'), R(11.6, 14.2, -1.6, 1.6, 'steel', 6), R(10.8, 11.6, -4.4, 4.4, 'dark'));
   const mv = both(moving.slice(1, 3)); o.push(PG(mv, 'steel', 2, dx), PG(mv, `url(#${h})`, 0, dx), C(3.9 + dx, 2.4, .2, 'cool', 1.3), C(3.9 + dx, -2.4, .2, 'cool', 1.3));
   o.push(R(4.8 + dx, 5.6 + dx, -4.4, 4.4, 'dark'), R(5.6 + dx, 8.2 + dx, 1.4, 1.9, 'dark'), R(5.6 + dx, 8.2 + dx, -1.9, -1.4, 'dark'), R(8.2 + dx, 8.6 + dx, -1.9, 1.9, 'dark'));
   [1.5, -1.5].forEach((y) => o.push(R(2.2 + dx - push, 7.8 + dx - push, y - .09, y + .09, 'pale', 0, 1.2))); o.push(R(7.6 + dx - push, 7.9 + dx - push, -1.2, 1.2, 'steel'));
   if (has) o.push(`<g${t < .43 ? ` clip-path="url(#dcf${id})"` : ''}>` + PG(both(cast.slice(0, 5)), col, 2, dx - push, -drop) + '</g>');
   if (t < .1) o.push(AR(9.6, -2.6, 7.4, -2.6)); if (t >= .3 && t < .44) o.push(AR(-9.6, -2.4, -6.4, -2.4)); if (t >= .62 && t < .78) o.push(AR(7.4, -2.6, 9.6, -2.6)); if (t >= .78 && t < .86) o.push(AR(8 + dx, 0, 7 + dx, 0));
   if (t >= .44 && t < .62) o.push(T(1.2, -4.1, 'cooling water', 12, 'middle', 'ink2'));
   return o.join(''); };
  ANIMS['die-casting'] = { stages: ST, draw, w: W, h: H, start: .37 }; }
})();
