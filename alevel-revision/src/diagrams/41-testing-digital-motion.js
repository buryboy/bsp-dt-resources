/* Materials tests (tensile, Izod impact, hardness) and digital manufacture (FDM, SLA, laser cutter) in motion, plus a 3D model of an FDM printer. */
(() => {
 const K = D.K, P = Math.PI, { sm, mix } = FIGX;
 const num = (u, x, y, n) => `<circle cx="${u.X(x)}" cy="${u.Y(y)}" r="11" fill="${K.ink2}" stroke="#fff" stroke-width="1.5"/><text x="${u.X(x)}" y="${u.Y(y) + 4.5}" font-family="Arial,sans-serif" font-size="12.5" font-weight="700" text-anchor="middle" fill="#fff">${n}</text>`;

 /* ---- tensile test, with the force–extension graph drawn as it goes ---- */
 { const u = U2(22, 130, 160), { X, Y, R, PG, PL, C, AR, T } = u, W = 600, H = 320;
  const ST = [[0, .25, 'Elastic', 'The test piece is pulled with a steadily increasing force. At first it stretches in proportion to the force, and it would spring back if the force were removed.'],
   [.25, .6, 'Yield and plastic deformation', 'Past the yield point the metal stretches permanently. The force needed keeps rising until it reaches the ultimate tensile strength (UTS).'],
   [.6, .88, 'Necking', 'After the UTS the test piece narrows at one place, called necking, and less force is needed to keep stretching it.'],
   [.88, 1, 'Fracture', 'The test piece breaks at the neck. A ductile material shows a lot of stretch before it breaks; a brittle one snaps with almost none.', .95]];
  const curve = (p) => (p < .25 ? [.1 * p / .25, .6 * p / .25] : p < .6 ? [.1 + .45 * (p - .25) / .35, .6 + .35 * Math.sin((p - .25) / .35 * P / 2)] : [.55 + .3 * (p - .6) / .28, .95 - .17 * Math.pow((p - .6) / .28, 1.6)]);
  const draw = (t) => { const o = [], p = Math.min(t, .88), ext = curve(p)[0] * 2.6, neck = sm(.6, .88, t), brk = t >= .88, gap = brk ? .5 + sm(.88, .96, t) * .5 : 0, top = 2.2 + ext + gap, wN = .3 - neck * .2;
   o.push(R(-3.4, 3.4, -5.6, -4.8, 'dark', 3), R(-3, -2.5, -4.8, 5.6, 'steel'), R(2.5, 3, -4.8, 5.6, 'steel'), R(-3.4, 3.4, 5.6, 6.2, 'dark', 3), R(-1.1, 1.1, -4.8, -3.2, 'dark', 3), R(-3, 3, top + 1.1, top + 1.7, 'dark', 2), R(-1.1, 1.1, top - .5, top + 1.1, 'dark', 3));
   const mid = (-2.2 + top - 1) / 2 + .5 - gap / 2;
   if (!brk) o.push(PG([[-.6, -3.4], [.6, -3.4], [.6, -2.4], [.3, -2], [wN, mid], [.3, top - 1.2], [.6, top - .8], [.6, top + .3], [-.6, top + .3], [-.6, top - .8], [-.3, top - 1.2], [-wN, mid], [-.3, -2], [-.6, -2.4]], '#7fa3c9'));
   else { const m0 = (-2.2 + 2.2 + ext - 1) / 2 + .5; o.push(PG([[-.6, -3.4], [.6, -3.4], [.6, -2.4], [.3, -2], [.1, m0], [0, m0 - .12], [-.1, m0], [-.3, -2], [-.6, -2.4]], '#7fa3c9'), PG([[.1, m0 + gap], [.3, top - 1.2], [.6, top - .8], [.6, top + .3], [-.6, top + .3], [-.6, top - .8], [-.3, top - 1.2], [-.1, m0 + gap], [0, m0 + gap - .12]], '#7fa3c9')); }
   if (!brk) o.push(AR(-4.4, top - .4, -4.4, top + 1.4), T(-4.4, top - 1.1, 'force', 12, 'middle', 'ink2'));
   // the graph
   const gx = (v) => 7 + v * 13, gy = (v) => -4.6 + v * 9.2, pts = []; for (let q = 0; q <= p + .0001; q += .01) { const c = curve(q); pts.push([gx(c[0]), gy(c[1])]); }
   o.push(PL([[7, 5.6], [7, -4.6], [20.6, -4.6]], 2.5), T(13.8, -5.9, 'Extension', 13), `<text transform="translate(${X(6.1)} ${Y(.5)}) rotate(-90)" font-family="Arial,sans-serif" font-size="13" font-weight="600" text-anchor="middle" fill="${K.ink}">Force</text>`);
   if (pts.length > 1) o.push(PL(pts, 3.5, K.hot)); const c = curve(p); o.push(C(gx(c[0]), gy(c[1]), .22, K.hot, 1.5));
   if (t >= .25) o.push(C(gx(.1), gy(.6), .14, K.ink, 0), T(gx(.1) + .4, gy(.6) - .7, 'yield point', 12, 'start')); if (t >= .6) o.push(C(gx(.55), gy(.95), .14, K.ink, 0), T(gx(.55), gy(.95) + .5, 'UTS', 12)); if (brk) o.push(T(gx(.85), gy(.78) + .6, 'fracture', 12));
   if (t < .25) o.push(T(gx(.1) + 1.2, gy(.2), 'elastic region', 12, 'start', 'ink2'));
   return o.join(''); };
  ANIMS['tensile-test'] = { stages: ST, draw, w: W, h: H, start: .5 }; }

 /* ---- Izod impact test ---- */
 { const u = U2(22, 250, 150), { X, Y, R, PG, PL, C, AR, T } = u, W = 500, H = 360, L = 5.4, A0 = 1.75, A1 = 1.0;
  const ST = [[0, .2, 'Raise the pendulum', 'A notched test piece is clamped upright in the vice. The pendulum is lifted to a set height, so it always starts with the same energy.'],
   [.2, .44, 'Release', 'The pendulum is released and swings down, gaining speed.'],
   [.44, .72, 'Strike', 'It strikes the test piece just above the notch and breaks it. Breaking the test piece takes energy out of the pendulum, so it does not swing as high on the other side.'],
   [.72, 1, 'Read the scale', 'The difference between the start height and the finish height shows the energy absorbed. A tough material absorbs a lot of energy; a brittle one absorbs very little.', .88]];
  const draw = (t) => { const o = [], th = t < .2 ? A0 * sm(0, .2, t) : t < .44 ? A0 * Math.cos((t - .2) / .24 * P / 2) : -A1 * Math.sin(Math.min(1, (t - .44) / .28) * P / 2), bx = L * Math.sin(th), by = 4 - L * Math.cos(th), hit = t >= .44, fly = sm(.44, .7, t);
   o.push(R(-7, 7, -5.2, -4.4, 'dark', 3), R(-.5, .5, -4.4, 4.4, 'steel'), R(-1.5, 1.5, -4.4, -3.2, 'dark', 2), R(-1.3, -.3, -3.2, -2.3, 'steel'), R(.3, 1.3, -3.2, -2.3, 'steel'));
   const pos = (a, r) => [r * Math.sin(a), 4 - r * Math.cos(a)]; const arcP = []; for (let a = -A0; a <= A0 + .01; a += .1) arcP.push(pos(a, L + 1.2)); o.push(PL(arcP, 1.5, K.ink, '2 5'));
   const m0 = pos(A0, L + 1.2), m1 = pos(-A1, L + 1.2); o.push(C(m0[0], m0[1], .16, K.ink2, 0), T(m0[0] + .3, m0[1] + .5, 'start', 12, 'start', 'ink2')); if (t >= .7) o.push(C(m1[0], m1[1], .16, K.hot, 0), T(m1[0] - .3, m1[1] + .5, 'finish', 12, 'end', 'hot'));
   o.push(R(-.3, .3, -3.2, hit ? -2 : -.9, '#7fa3c9'), PG([[.3, -2.1], [.08, -2], [.3, -1.9]], '#fff', 1.2));
   if (hit) o.push(`<g transform="translate(${(-fly * 70).toFixed(1)} ${(-Math.sin(fly * P) * 26 + fly * 40).toFixed(1)}) rotate(${(-fly * 200).toFixed(0)} ${X(0)} ${Y(-1.45)})">` + R(-.3, .3, -2, -.9, '#7fa3c9') + '</g>');
   o.push(`<line x1="${X(0)}" y1="${Y(4)}" x2="${X(bx)}" y2="${Y(by)}" stroke="${K.ink}" stroke-width="5" stroke-linecap="round"/>`, `<g transform="rotate(${(-th * 180 / P).toFixed(1)} ${X(bx)} ${Y(by)})">` + R(bx - .8, bx + .8, by - .5, by + .5, 'dark', 4) + '</g>', C(0, 4, .3, 'dark'));
   if (t >= .72) o.push(PL([[-7.8, m0[1]], [-7.8, m1[1]]], 2.5, K.hot), PL([[-8.1, m0[1]], [-7.5, m0[1]]], 2.5, K.hot), PL([[-8.1, m1[1]], [-7.5, m1[1]]], 2.5, K.hot), PL([[-7.5, m0[1]], [m0[0], m0[1]]], 1.2, K.hot, '4 4'), T(-8.2, (m0[1] + m1[1]) / 2 + .1, 'energy', 12, 'end', 'hot'), T(-8.2, (m0[1] + m1[1]) / 2 - .6, 'absorbed', 12, 'end', 'hot'));
   o.push(T(2.6, -2.9, 'vice', 12), T(1.6, -1.6, 'notch', 12, 'start'));
   return o.join(''); };
  ANIMS['impact-test'] = { stages: ST, draw, w: W, h: H, start: .1 }; }

 /* ---- hardness: the same load on a softer and a harder material ---- */
 { const u = U2(22, 240, 110), { X, Y, R, C, AR, T, PL } = u, W = 480, H = 260;
  const ST = [[0, .2, 'Position', 'A hardened steel ball or a diamond point, called the indenter, is placed over the flat, polished surface of each sample.'],
   [.2, .55, 'Apply the load', 'The same known force is pressed on to each indenter for a set time.'],
   [.55, .75, 'Remove', 'The indenter is lifted away, leaving a dent in the surface.'],
   [.75, 1, 'Measure', 'The size of the dent is measured. The softer material has the larger dent; the harder material has the smaller dent. Brinell, Vickers and Rockwell tests all work this way.', .9]];
  const draw = (t) => { const o = [], press = sm(.2, .5, t), up = sm(.55, .72, t), show = t >= .75;
   [[-5, 1, 'softer material', '#c9d8ea'], [5, .4, 'harder material', '#8fa2b8']].forEach(([cx, dmax, name, col]) => { const d = dmax * press, w = Math.sqrt(Math.max(0, 2 * 1.3 * d - d * d)), by = -1 + 1.3 - d + up * 2.6 + (1 - sm(.04, .18, t)) * 1.6;
    o.push(`<path d="M${X(cx - 3.6)} ${Y(-4)}L${X(cx - 3.6)} ${Y(-1)}L${X(cx - w)} ${Y(-1)}A${1.3 * 22} ${1.3 * 22} 0 0 0 ${X(cx + w)} ${Y(-1)}L${X(cx + 3.6)} ${Y(-1)}L${X(cx + 3.6)} ${Y(-4)}Z" fill="${col}" ${u.sk(2)}/>`);
    o.push(R(cx - .5, cx + .5, by + .9, by + 3.4, 'steel'), C(cx, by, 1.3, 'dark'), T(cx, -4.8, name, 13));
    if (t >= .2 && t < .55) o.push(AR(cx + 1.9, 3.9, cx + 1.9, 2.1), T(cx + 2.3, 3.4, 'same force', 11.5, 'start', 'ink2'));
    if (show) o.push(PL([[cx - w, -.4], [cx + w, -.4]], 2.5, K.hot), PL([[cx - w, -.7], [cx - w, -.1]], 2.5, K.hot), PL([[cx + w, -.7], [cx + w, -.1]], 2.5, K.hot), T(cx, .1, dmax > .5 ? 'large dent' : 'small dent', 12, 'middle', 'hot')); });
   return o.join(''); };
  ANIMS['hardness-test'] = { stages: ST, draw, w: W, h: H, start: .4 }; }

 /* ---- FDM 3D printer ---- */
 const LAY = [1.9, 2.1, 2.2, 2.1, 1.8, 1.5, 1.3, 1.3, 1.5, 1.8], FW = ['The filament, a thermoplastic such as PLA, is pulled off the spool by the drive gear in the print head.', 'The heated nozzle melts the filament and squeezes out a thin bead.', 'The head follows the path worked out by the slicing software from the CAD model, drawing one layer.', 'The gap between nozzle and bed then increases by one layer thickness and the next layer is fused on top. Overhangs need support material.'];
 { const u = U2(22, 230, 232), { X, Y, R, PG, C, AR, T, PL } = u, W = 460, H = 320;
  const draw = (t) => { const o = [], n = LAY.length, li = Math.min(n - 1, Math.floor(t * n)), f = (t * n) % 1, dir = li % 2 ? -1 : 1, w = LAY[li], hx = dir * (-w + f * 2 * w), bedY = 3.2 - li * .32;
   o.push(R(-7.6, 7.6, -1.6, -.9, 'dark', 3), R(-7, -6.4, -.9, 8.6, 'steel'), R(6.4, 7, -.9, 8.6, 'steel'), R(-7.4, 7.4, 8.6, 9.2, 'dark', 3), R(-7, 7, 5.9, 6.4, 'steel'));
   o.push(C(-4.6, 10, 1.3, 'mat'), C(-4.6, 10, .45, '#fff'), PL([[-3.6, 9.2], [hx - .1, 8.4], [hx, 6.9]], 2.5, K.mat));
   o.push(R(-.25, .25, -.9, bedY - .3, 'steel'), R(-4.6, 4.6, bedY - .3, bedY, 'dark', 2));
   for (let k = 0; k < li; k++) o.push(R(-LAY[k], LAY[k], bedY + k * .32, bedY + (k + 1) * .32, 'mat', 2, 1.2));
   const a = dir > 0 ? -w : hx, b = dir > 0 ? hx : w; if (b - a > .02) o.push(R(a, b, bedY + li * .32, bedY + (li + 1) * .32, K.hot, 2, 1.2));
   o.push(R(hx - .9, hx + .9, 5.3, 6.9, 'dark', 3), PG([[hx - .35, 5.3], [hx + .35, 5.3], [hx + .08, 4.5], [hx - .08, 4.5]], 'hot'));
   o.push(AR(hx - dir * 1.2, 7.5, hx + dir * 1.2, 7.5), num(u, -2.4, 10.3, 1), num(u, hx + 1.7, 4.9, 2), num(u, 5.4, 7.3, 3), num(u, 5.6, bedY - .2, 4));
   return o.join(''); };
  ANIMS['fdm-printer'] = { loop: true, dur: 14000, w: W, h: H, draw, watch: FW }; }
 MODELS['fdm-printer'] = { stages: [[0, 1, 'Printing', 'The head moves left and right and the bed moves forwards and backwards, so the nozzle can draw any shape in a layer. After each layer the head rises by one layer thickness. Here the layers are drawn much thicker than real ones, which are about 0.2 mm.', .5]], dur: 20000, build(M) {
  const { THREE, tag, box, rev, cyl } = M, root = new THREE.Group(), gan = new THREE.Group(), head = new THREE.Group(), bed = new THREE.Group(); root.add(gan, bed); gan.add(head);
  root.add(tag('frame', box(-7, 7, -1, 0, -6, 6, 'dark')), tag('frame', box(-6.6, -5.8, 0, 12, -.4, .4, 'steel')), tag('frame', box(5.8, 6.6, 0, 12, -.4, .4, 'steel')), tag('frame', box(-6.6, 6.6, 12, 12.8, -.4, .4, 'steel')));
  root.add(tag('spool', rev(cyl(-.5, .5, 2), 'mat', { whole: true, oy: 14.4, oz: 0 }).back));
  gan.add(tag('gantry', box(-5.8, 5.8, 0, .6, -.3, .3, 'steel'))); head.add(tag('head', box(-.9, .9, -.2, 1.6, .3, 1.7, 'dark')), tag('nozzle', rev([[0, 0], [.6, .45], [.6, 0]], 'hot', { whole: true, axis: 'y', cx: 0, oz: 1 }).back)); head.children[1].position.y = -.8;
  bed.add(tag('bed', box(-4.2, 4.2, .3, .6, -4.2, 4.2, '#5b6470')));
  const layers = LAY.map((r, k) => { const g = tag('part', rev(cyl(0, 1, r), 'mat', { whole: true, axis: 'y', n: 32 }).back); g.children.forEach((c) => { c.geometry.translate(0, 0, 0); }); g.scale.y = .42; g.position.y = .6 + k * .42; bed.add(g); return g; });
  const parts = { frame: ['Frame', 'Holds everything square and rigid, so the layers line up.'], spool: ['Filament spool', 'A reel of thermoplastic filament such as PLA or ABS, usually 1.75 mm thick.'], gantry: ['X-axis gantry', 'The head slides left and right along it. The whole gantry rises on the Z axis after each layer.'],
   head: ['Print head (extruder)', 'A drive gear pushes the filament into the hot end.'], nozzle: ['Heated nozzle', 'Melts the filament at about 200 °C and lays down a thin bead.'], bed: ['Print bed', 'Moves forwards and backwards (the Y axis). It is often heated so the first layer sticks and does not warp.'], part: ['The print', 'Built up in layers from the bottom. Each new layer fuses to the one below.'] };
  const frame = (t) => { const n = LAY.length, li = Math.min(n - 1, Math.floor(t * n)), f = (t * n) % 1, r = LAY[li], a = f * 2 * P; layers.forEach((g, k) => { g.visible = k <= li; g.scale.y = k < li ? .42 : .42 * Math.max(.05, f); });
   gan.position.y = 1.9 + li * .42 + .42 * f; head.position.x = r * Math.cos(a); bed.position.z = 1 - r * Math.sin(a); };
  return { root, frame, parts, home: { t: [0, 6, 0], d: 52, v: [.35, .25, .9] } };
 } };

 /* ---- SLA ---- */
 { const u = U2(22, 230, 210), { X, Y, R, PG, C, AR, T, PL } = u, W = 460, H = 320, SL = [1.2, 1.5, 1.9, 2.2, 2.2, 1.9, 1.5, 1.2];
  const draw = (t) => { const o = [], n = SL.length, li = Math.min(n - 1, Math.floor(t * n)), f = (t * n) % 1, w = SL[li], sx = -w + (f < .8 ? f / .8 : 1) * 2 * w, top = 3, py = top - (li + 1) * .34;
   o.push(R(-6, 6, -3.4, 3.6, 'pale', 3), `<rect x="${X(-5.9)}" y="${Y(top)}" width="${11.8 * 22}" height="${(top + 3.3) * 22}" fill="${K.cool}" opacity=".55"/>`, PL([[-5.9, top], [5.9, top]], 1.5));
   o.push(R(4.4, 4.9, py - .3, 6.6, 'steel'), R(-4, 4.9, py - .3, py, 'dark', 2));
   for (let k = 0; k < li; k++) o.push(R(-SL[k], SL[k], py + k * .34, py + (k + 1) * .34, 'mat', 0, 1.2));
   if (f < .8) o.push(R(-w, sx, py + li * .34, top, K.hot, 0, 1.2)); else o.push(R(-w, w, py + li * .34, top, 'mat', 0, 1.2));
   o.push(R(-8.6, -5.4, 7.2, 8.4, 'dark', 4), T(-7, 7.6, 'UV laser', 11, 'middle', '#fff'), PG([[-.2, 8.6], [.9, 7.5], [.6, 7.2], [-.5, 8.3]], 'steel'));
   if (f < .8) o.push(PL([[-5.4, 7.8], [.2, 7.9], [sx, top]], 2.5, '#8a3ffc'), C(sx, top, .16, '#8a3ffc', 0));
   o.push(num(u, -3.6, 9, 1), num(u, 2, 8.6, 2), num(u, sx + 1.1, top + .8, 3), num(u, 6.2, py + 1.4, 4), T(0, -2.6, 'liquid photopolymer resin', 12));
   return o.join(''); };
  ANIMS['sla-printer'] = { loop: true, dur: 13000, w: W, h: H, draw, watch: ['An ultraviolet laser makes a fine beam of light.', 'A computer-controlled mirror steers the beam across the surface of the resin, following the shape of one layer.', 'Where the light hits, the liquid photopolymer cures and turns solid.', 'The platform moves down by one layer thickness, fresh resin covers the top, and the next layer is cured on to it. The finished part is washed and given a final cure. SLA gives a smoother, more detailed finish than FDM.'] }; }

 /* ---- CNC laser cutter ---- */
 { const u = U2(22, 240, 190), { X, Y, R, PG, C, AR, T, PL } = u, W = 480, H = 300;
  const CUTS = [-3.6, -1.2, 1.2, 3.6];
  const draw = (t) => { const o = [], k = Math.min(3, Math.floor(t * 4)), f = (t * 4) % 1, hx = f < .3 ? (k ? CUTS[k - 1] : -5) + ((CUTS[k]) - (k ? CUTS[k - 1] : -5)) * sm(0, .3, f) : CUTS[k], cutting = f >= .35, depth = cutting ? sm(.35, .9, f) : 0;
   o.push(R(-8.4, 8.4, -5, 6.4, 'pale', 6), R(-8.4, 8.4, -5.8, -5, 'dark', 3), R(-6.6, 6.6, -2.2, -1.8, 'dark'), [...Array(14)].map((_, i) => `<line x1="${X(-6.3 + i * .97)}" y1="${Y(-1.8)}" x2="${X(-6.3 + i * .97)}" y2="${Y(-2.2)}" stroke="#fff" stroke-width="1.5"/>`).join(''));
   o.push(R(-5.6, 5.6, -1.8, -1.3, 'wood')); CUTS.forEach((c, i) => { if (i < k || (i === k && depth > 0)) o.push(`<rect x="${X(c) - 1.5}" y="${Y(-1.3)}" width="3" height="${((i < k ? 1 : depth) * 11).toFixed(1)}" fill="${K.ink}"/>`); });
   o.push(R(-8, -5.2, 4.3, 5.5, 'dark', 4), T(-6.6, 4.7, 'laser tube', 10.5, 'middle', '#fff'), R(-7.8, 7.8, 3.2, 3.7, 'steel'), R(hx - .8, hx + .8, 2.4, 5.6, 'dark', 3), PG([[hx - .4, 2.4], [hx + .4, 2.4], [hx + .15, 1.5], [hx - .15, 1.5]], 'steel'), PG([[hx - .45, 5.2], [hx + .1, 4.65], [hx - .1, 4.45], [hx - .65, 5]], '#fff', 1.3), `<ellipse cx="${X(hx)}" cy="${Y(2.9)}" rx="8" ry="3" fill="${K.cool}" stroke="${K.ink}" stroke-width="1.2"/>`);
   if (cutting) o.push(PL([[-5.2, 4.9], [hx - .25, 4.9], [hx, 4.7], [hx, 2.9]], 2.5, K.hot), PG([[hx - .28, 2.9], [hx + .28, 2.9], [hx, -1.3]], K.hot, 0).replace('<polygon', '<polygon opacity=".8"'), C(hx, -1.3, .2, '#ffd54a', 1), PL([[hx + .3, -1], [hx + .9, -.2], [hx + .7, .5]], 1.5, '#8b949e', '3 3'));
   o.push(R(5.4, 7.9, -4.6, -3.2, 'steel', 4), T(6.65, -4.1, 'extraction', 10.5), AR(3.4, -3.9, 5.2, -3.9, 'dark'));
   o.push(num(u, -8.6, 6.5, 1), num(u, hx + 1.6, 5.6, 2), num(u, hx + 1.5, 2.3, 3), num(u, 0, -.4, 4), T(0, -3.4, 'honeycomb bed', 11));
   return o.join(''); };
  ANIMS['laser-cutter'] = { loop: true, dur: 9000, w: W, h: H, draw, watch: ['The CO₂ laser tube produces an intense beam of infrared light.', 'Mirrors reflect the beam along the gantry to the cutting head.', 'A lens focuses the beam to a tiny spot on the material, where it burns or vaporises a narrow slot called the kerf. Lower power or higher speed only marks the surface (engraving).', 'The head moves along the gantry (X) and the gantry moves front to back (Y), following the vector lines of the CAD drawing. Fumes are extracted and filtered.'] }; }
})();
