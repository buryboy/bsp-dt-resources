/* Injection moulding three ways: a still, an animation of one cycle and a 3D model, all drawn from the same measurements.
   Units are roughly centimetres on a small machine; x runs along the machine axis, the axis is y = 0. */
(() => {
 const K = Object.assign({ melt: '#ec7a3c', trans: '#f8cf8f' }, D.K), { sm, mix } = FIGX;
 const STAGES = [
  [0, .12, 'Clamp', 'The moving platen closes the mould. The hydraulic clamp holds the two halves shut against the injection pressure.'],
  [.12, .30, 'Inject', 'The screw stops turning and is pushed forward like a ram. It forces a measured shot of molten polymer through the nozzle and sprue into the cavity.'],
  [.30, .50, 'Hold and cool', 'Pressure is held to pack the cavity as the polymer shrinks. Water in the cooling channels takes the heat away and the moulding turns solid.'],
  [.50, .68, 'Recharge', 'While the moulding is still cooling, the screw turns again. It draws granules from the hopper, melts them with the heater bands and friction, and moves back as the next shot builds up in front of it.'],
  [.68, .82, 'Open', 'The clamp pulls the moving half back. The moulding has shrunk on to the core, so it travels with the moving half.'],
  [.82, 1, 'Eject', 'Ejector pins push the moulding off the core and it drops clear. The sprue is trimmed off and the cycle starts again.', .94]];
 const OPEN = 3.4, STROKE = 1.5, PUSH = 1.5, DROP = 2.6;
 const cyc = (t) => { const s = { open: t < .5 ? 1 - sm(0, .12, t) : sm(.68, .82, t), fwd: sm(.12, .30, t) - sm(.50, .68, t), rot: sm(.50, .68, t) * Math.PI * 6, fill: sm(.12, .29, t), cool: sm(.30, .50, t),
   push: sm(.82, .90, t) * PUSH, drop: Math.pow(sm(.89, .99, t), 2), part: t >= .12, stage: STAGES.findIndex((g) => t >= g[0] && t < g[1]) }; s.off = -STROKE * (1 - s.fwd); if (s.stage < 0) s.stage = 5; return s; };
 // outlines as [x along the machine, radius]; the drawing and the model both use them
 const PF = { fixed: [[3.6, .2], [3.6, 3.2], [6, 3.2], [6, 1.9], [4.4, 1.6], [4.4, .3]], moving: [[4.7, 0], [4.7, 1.3], [6, 1.6], [6, 3.2], [8.4, 3.2], [8.4, 0]],
  part: [[4.4, 0], [4.4, 1.6], [6, 1.9], [6, 1.6], [4.7, 1.3], [4.7, 0]], sprue: [[3.6, 0], [3.6, .2], [4.4, .3], [4.4, 0]], nozzle: [[2, 1], [2, 1.6], [3.6, .5], [3.6, .2]],
  barrel: [[-10.5, 1], [-10.5, 1.6], [2, 1.6], [2, 1]], melt: [[-5, 0], [-5, 1], [2, 1], [3.6, .2], [3.6, 0]] };
 const BANDS = [-6.5, -4.5, -2.5, -.5], CHAN_F = [[5.2, 2.6], [4, 1.3]], CHAN_M = [[7.3, 2.3]];

 /* ---- the drawing ---- */
 const { X, Y, R, PG, C, SH, AR, T, both, sk, hatchDef } = U2(20, 352, 172), W = 776, H = 320;
 let seed = 11; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
 const GR = [], GB = []; for (let i = 0; i < 46; i++) { const y = 1.9 + rnd() * 3.5, hw = .5 + (y - 1.6) * .27 - .16; GR.push([-8.5 + (rnd() * 2 - 1) * hw, y]); } for (let i = 0; i < 26; i++) GB.push([-10.3 + rnd() * 3.2, (rnd() * 2 - 1) * .82]);
 const sides = (pf, f, hid, dx) => [pf, pf.map((p) => [p[0], -p[1]])].map((q) => PG(q, f, 2, dx) + PG(q, `url(#${hid})`, 0, dx)).join('');
 const gran = (g, r) => `<circle cx="${X(g[0])}" cy="${Y(g[1])}" r="${r}" fill="${K.mat}" stroke="${K.ink}" stroke-width=".9"/>`;
 function draw(t, id, still) {
  const s = cyc(t), dx = s.open * OPEN, o = [], h = 'imh' + id;
  o.push(`<defs>${hatchDef(h)}<clipPath id="imb${id}"><rect x="${X(-10.5)}" y="${Y(1)}" width="250" height="40"/></clipPath><clipPath id="imf${id}"><rect x="${X(3.6)}" y="${Y(2.2)}" width="${(s.fill * 49).toFixed(1)}" height="88"/></clipPath></defs>`);
  o.push(R(-17, 20.8, -6.5, -4.5, 'dark', 4), R(-16.5, 2.4, -4.5, -1.9, 'pale'));                                             // bed and pedestal
  [3.6, -3.6].forEach((y) => o.push(R(3.6, 16.4, y - .35, y + .35, 'steel'), SH(3.6, 15.4, y + .08, y + .22)));                // tie bars
  o.push(R(-16, -12, -1.9, 1.9, 'dark', 8), SH(-15.8, -12.2, 1, 1.4), [-15, -14, -13].map((x) => `<line x1="${X(x)}" y1="${Y(1.9)}" x2="${X(x)}" y2="${Y(-1.9)}" stroke="${K.ink}" stroke-width="1" opacity=".5"/>`).join(''));
  o.push(R(-10.5, 2, -1.6, 1.6, 'steel'), `<rect x="${X(-10.5)}" y="${Y(1.6)}" width="250" height="64" fill="url(#${h})"/>`, R(-10.5, 2, -1, 1, 'pale', 0, 1.5));   // barrel
  o.push(`<rect x="${X(-7.4)}" y="${Y(1)}" width="68" height="40" fill="${K.trans}"/><rect x="${X(-4.6)}" y="${Y(1)}" width="132" height="40" fill="${K.melt}"/><rect x="${X(-9.1) + 1}" y="${Y(1.62)}" width="22" height="14" fill="${K.pale}"/>`);
  o.push(`<g clip-path="url(#imb${id})">` + GB.map((g) => gran(g, 2.6)).join(''));
  const ph = ((s.rot / (2 * Math.PI)) * 1.2) % 1.2, x0 = -10.6 + s.off, x1 = .2 + s.off;                                       // screw: the flights shift along as it turns
  o.push(R(-11.6 + s.off, x1, -.5, .5, 'dark', 0, 1.6));
  for (let x = x0 - 1.2 + ph; x < x1 - .8; x += 1.2) if (x > x0 - .3) o.push(PG([[x, -.95], [x + .26, -.95], [x + .86, .95], [x + .6, .95]], 'steel', 1.6));
  o.push(PG([[x1, .5], [x1 + .9, 0], [x1, -.5]], 'dark', 1.6), '</g>', R(-12, -10.5, -1.5, 1.5, 'steel', 3));
  BANDS.forEach((x) => o.push(R(x - .5, x + .5, 1.6, 1.92, 'hot', 3), R(x - .5, x + .5, -1.92, -1.6, 'hot', 3)));
  o.push(PG([[-10.4, 6], [-6.6, 6], [-7.9, 1.6], [-9.1, 1.6]], 'pale'), GR.map((g) => gran(g, 2.9)).join(''));
  o.push(sides(PF.nozzle, 'steel', h), PG([[2, 1], [3.6, .2], [3.6, -.2], [2, -1]], K.melt, 1.5));
  o.push(R(2.6, 3.6, 1.8, 4.5, 'dark'), R(2.6, 3.6, -4.5, -1.8, 'dark'), sides(PF.fixed, 'steel', h));
  CHAN_F.forEach((c) => [1, -1].forEach((m) => o.push(C(c[0], c[1] * m, .23, 'cool', 1.4))));
  o.push(R(11.8 + dx, 16.6 + dx, -.8, .8, 'steel'), SH(11.9 + dx, 16.4 + dx, .3, .5), R(16.4, 20.2, -1.7, 1.7, 'steel', 6), SH(16.6, 20, .9, 1.2), R(15.4, 16.4, -4.5, 4.5, 'dark'));
  const mv = both(PF.moving.slice(1, 5)), cc = mix(K.hot, K.mat, s.cool);
  o.push(PG(mv, 'steel', 2, dx), PG(mv, `url(#${h})`, 0, dx)); CHAN_M.forEach((c) => [1, -1].forEach((m) => o.push(C(c[0] + dx, c[1] * m, .23, 'cool', 1.4)))); o.push(C(5.7 + dx, 0, .23, 'cool', 1.4));
  o.push(R(8.4 + dx, 9.2 + dx, -4.5, 4.5, 'dark'), R(9.2 + dx, 11.4 + dx, 1.5, 2.1, 'dark'), R(9.2 + dx, 11.4 + dx, -2.1, -1.5, 'dark'), R(11.4 + dx, 11.8 + dx, -2.1, 2.1, 'dark'));
  [.8, -.8].forEach((y) => o.push(R(4.7 + dx - s.push, 11 + dx - s.push, y - .1, y + .1, 'pale', 0, 1.2))); o.push(R(10.9 + dx - s.push, 11.2 + dx - s.push, -1.3, 1.3, 'steel'));
  if (s.part) { const px = dx - s.push, py = -s.drop * DROP; o.push(`<g${s.fill < 1 ? ` clip-path="url(#imf${id})"` : ''}>` + PG(both(PF.part.slice(1, 5)), cc, 2, px, py) + PG(both(PF.sprue.slice(1, 3)), cc, 1.5, px, py) + '</g>'); }
  if (!still) { const st = s.stage;
   if (st === 0) o.push(AR(15, -2.6, 12.6, -2.6)); if (st === 1) o.push(AR(-7, -2.9, -3.6, -2.9)); if (st === 2) o.push(AR(13.4, -2.6, 12.2, -2.6), T(5.2, -4.1, 'cooling water', 13, 'middle', 'ink2'));
   if (st === 3) o.push(AR(-3.6, -2.9, -7, -2.9), `<path d="M${X(-11.25)} ${Y(2.3)}A11 46 0 0 1 ${X(-11.25)} ${Y(-2.3)}" fill="none" stroke="${K.ink2}" stroke-width="3.5" stroke-linecap="round"/>` + AR(-11, -2.05, -11.3, -2.4));
   if (st === 4) o.push(AR(12.6, -2.6, 15, -2.6)); if (st === 5) o.push(AR(10.6 + dx, 0, 9.6 + dx, 0)); }
  return o.join('');
 }
 const MARK = [[-12.3, 6.9, 'Hopper', -9.7, 4.6], [-5.6, 6.9, 'Polymer granules', -8.2, 4.4], [-15.6, 4.2, 'Motor and gearbox (turn the screw)', -14.6, 1.7], [-5.5, -5.5, 'Reciprocating screw', -5.5, -.3], [-9.6, -5.5, 'Heated barrel', -9.6, -1.3],
  [-2.5, 4.4, 'Heater bands', -2.5, 1.85], [.6, -5.5, 'Nozzle', 2.9, -.9], [.9, 6.9, 'Fixed platen', 3.1, 4.1], [4.3, 6.9, 'Fixed half of the mould (cavity)', 4.4, 2.75], [2.9, -5.5, 'Sprue', 4, -.12],
  [5.4, -5.5, 'Moulding in the cavity', 5.3, -1.6], [7.7, 6.9, 'Moving half of the mould (core)', 7.5, 2.9], [7.9, -5.5, 'Cooling channels', 7.3, -2.3], [10.4, -5.5, 'Ejector pins', 9.9, -.8],
  [10.9, 6.9, 'Moving platen', 8.8, 4.1], [13.9, 6.9, 'Tie bars', 13.3, 3.7], [19.2, 4.6, 'Hydraulic clamp', 18.6, 1.7]];
 DIAGRAMS['injection-moulding'] = { t: 'Injection moulding', w: W, h: H, svg: draw(.42, 's', true), parts: MARK.map((m) => [X(m[0]), Y(m[1]), m[2], X(m[3]), Y(m[4])]) };
 ANIMS['injection-moulding'] = { stages: STAGES, draw: (t, id) => draw(t, id) };

 /* ---- the model ---- */
 const PARTS = {
  hopper: ['Hopper', 'Holds the polymer granules and feeds them into the barrel by gravity.'], granules: ['Polymer granules', 'The thermoplastic raw material. Pigment can be mixed in to colour the moulding.'],
  motor: ['Motor and gearbox', 'Turn the screw during recharging.'], screw: ['Reciprocating screw', 'Turns to carry and melt the polymer, then is pushed forward as a ram to inject the shot.'],
  barrel: ['Heated barrel', 'The tube the screw turns in. The polymer melts as it moves along it.'], heaters: ['Heater bands', 'Electric heaters around the barrel. Friction from the screw adds more heat.'],
  melt: ['Molten polymer', 'The shot of melted polymer waiting in front of the screw.'], nozzle: ['Nozzle', 'Seals against the mould and passes the melt into the sprue.'],
  fplaten: ['Fixed platen', 'Carries the fixed half of the mould. It does not move.'], fmould: ['Fixed half of the mould (cavity)', 'Forms the outside of the moulding. The sprue runs through it.'],
  mmould: ['Moving half of the mould (core)', 'Forms the inside of the moulding. It carries the ejector pins.'], cooling: ['Cooling channels', 'Water flows through the mould to take heat out of the moulding quickly.'],
  part: ['Moulding and sprue', 'The finished product. The sprue is the waste left in the feed channel and is trimmed off.'], pins: ['Ejector pins', 'Push the cooled moulding off the core when the mould opens. They leave small round marks.'],
  mplaten: ['Moving platen', 'Carries the moving half of the mould and slides along the tie bars.'], tiebars: ['Tie bars', 'Guide the moving platen and take the clamping force.'],
  clamp: ['Hydraulic clamp', 'Opens and closes the mould and holds it shut during injection.'], bed: ['Machine bed', 'The frame that carries the injection unit and the clamp unit.'] };
 MODELS['injection-moulding'] = { stages: STAGES, build(M) {
  const { THREE, toon, flat, ink, tag, rev, cyl, box, strip, line, rnd } = M;
  const root = new THREE.Group(), front = new THREE.Group(), mov = new THREE.Group(), movFront = new THREE.Group(), ej = new THREE.Group(), part = new THREE.Group(), partFront = new THREE.Group(), screw = new THREE.Group();
  root.add(front, mov, part, screw); mov.add(movFront, ej); part.add(partFront);
  const add = (key, pf, color, o, backTo, frontTo) => { const r = rev(pf, color, o); (backTo || root).add(tag(key, r.back)); if (r.front) (frontTo || front).add(tag(key, r.front)); };
  root.add(tag('bed', box(-17, 20.8, -6.5, -4.5, -4.6, 4.6, 'dark')), tag('bed', box(-16.5, 2.4, -4.5, -1.95, -2, 2, 'pale')));
  add('motor', cyl(-16, -12, 1.9), 'dark', { whole: true }); root.add(tag('motor', box(-12, -10.5, -1.5, 1.5, -1.5, 1.5, 'steel')));
  add('barrel', PF.barrel, 'steel', { hatch: true }); BANDS.forEach((x) => add('heaters', [[x - .5, 1.6], [x - .5, 1.92], [x + .5, 1.92], [x + .5, 1.6]], 'hot'));
  add('nozzle', PF.nozzle, 'steel', { hatch: true }); add('melt', PF.melt, K.melt, { cap: K.melt }, root, new THREE.Group());
  add('hopper', [[6, 1.9], [6, 1.78], [1.6, .55], [1.6, .67]], 'pale', { axis: 'y', cx: -8.5 });
  const gm = toon('mat'), sg = new THREE.SphereGeometry(.15, 10, 8), mk = (list) => { const im = new THREE.InstancedMesh(sg, gm, list.length), mt = new THREE.Matrix4(); list.forEach((p, i) => { mt.makeTranslation(p[0], p[1], p[2]); im.setMatrixAt(i, mt); }); return tag('granules', im); };
  const gb = [], gf = []; for (let i = 0; i < 520; i++) { const y = 1.75 + rnd() * 3.7, rr = (.5 + (y - 1.6) * .28 - .17) * Math.sqrt(rnd()), an = rnd() * Math.PI * 2, p = [-8.5 + rr * Math.cos(an), y, rr * Math.sin(an)]; (p[2] < 0 ? gb : gf).push(p); }
  for (let i = 0; i < 70; i++) { const an = Math.PI + rnd() * Math.PI, rr = .62 + rnd() * .26; gb.push([-10.2 + rnd() * 3, rr * Math.cos(an), rr * Math.sin(an)]); }
  root.add(mk(gb)); front.add(mk(gf));
  // screw: shaft, tip and a flight swept round it in a helix
  { screw.add(rev([[-11.6, 0], [-11.6, .5], [.2, .5], [1.1, 0]], 'dark', { whole: true }).back);
   const m = toon('steel'), P = 1.2, xa = -10.3, xb = -.1, n = Math.round((xb - xa) / P * 36), Cn = [[-.1, .48], [.1, .48], [.1, .95], [-.1, .95]];
   const at = (k, c) => { const x = xa + (xb - xa) * k / n, a = 2 * Math.PI * x / P; return [x + Cn[c][0], Cn[c][1] * Math.cos(a), Cn[c][1] * Math.sin(a)]; };
   [[1, 2], [2, 3], [3, 0]].forEach((f) => { const pos = []; for (let k = 0; k <= n; k++) pos.push(...at(k, f[0]), ...at(k, f[1])); screw.add(strip(pos, n, m)); });
   [2, 3].forEach((c) => { const lp = []; for (let k = 0; k <= n; k++) lp.push(at(k, c)); screw.add(line(lp)); }); tag('screw', screw); }
  // fixed platen: a plate with a hole for the nozzle, made in two halves
  const plate = (sign) => { const sh = new THREE.Shape(); sh.moveTo(0, 4.5); sh.lineTo(4.5 * sign, 4.5); sh.lineTo(4.5 * sign, -4.5); sh.lineTo(0, -4.5); sh.lineTo(0, -1.8); sh.absarc(0, 0, 1.8, -Math.PI / 2, Math.PI / 2, sign < 0); sh.lineTo(0, 4.5);
   const g = new THREE.ExtrudeGeometry(sh, { depth: 1, bevelEnabled: false, curveSegments: 20 }); g.rotateY(Math.PI / 2); const m = new THREE.Mesh(g, toon('dark')); m.position.x = 2.6; m.add(new THREE.LineSegments(new THREE.EdgesGeometry(g, 30), ink())); return m; };
  root.add(tag('fplaten', plate(1))); front.add(tag('fplaten', plate(-1))); add('fmould', PF.fixed, 'steel', { hatch: true });
  const disc = (x, y, to) => { const d = new THREE.Mesh(new THREE.CircleGeometry(.24, 20), flat('cool')); d.position.set(x, y, .02); const ring = []; for (let k = 0; k <= 20; k++) ring.push([.24 * Math.cos(k * Math.PI / 10), .24 * Math.sin(k * Math.PI / 10), .005]); d.add(line(ring)); to.add(tag('cooling', d)); };
  CHAN_F.forEach((c) => { disc(c[0], c[1], root); disc(c[0], -c[1], root); });
  [[3.6, -3.6], [-3.6, -3.6]].forEach((p) => add('tiebars', cyl(3.6, 16.4, .35), 'steel', { whole: true, oy: p[0], oz: p[1] }));
  [[3.6, 3.6], [-3.6, 3.6]].forEach((p) => front.add(tag('tiebars', rev(cyl(3.6, 16.4, .35), 'steel', { whole: true, oy: p[0], oz: p[1] }).back)));
  root.add(tag('clamp', box(15.4, 16.4, -4.5, 4.5, -4.5, 4.5, 'dark'))); add('clamp', cyl(16.4, 20.2, 1.7), 'steel', { whole: true });
  add('mmould', PF.moving, 'steel', { hatch: true }, mov, movFront); CHAN_M.forEach((c) => { disc(c[0], c[1], mov); disc(c[0], -c[1], mov); }); disc(5.7, 0, mov);
  mov.add(tag('mplaten', box(8.4, 9.2, -4.5, 4.5, -4.5, 0, 'dark'))); movFront.add(tag('mplaten', box(8.4, 9.2, -4.5, 4.5, 0, 4.5, 'dark')));
  mov.add(tag('clamp', box(9.2, 11.4, 1.5, 2.1, -2.1, 2.1, 'dark')), tag('clamp', box(9.2, 11.4, -2.1, -1.5, -2.1, 2.1, 'dark')), tag('clamp', box(11.4, 11.8, -2.1, 2.1, -2.1, 2.1, 'dark')));
  add('clamp', cyl(11.8, 16.6, .8), 'steel', { whole: true }, mov);
  [.8, -.8].forEach((y) => ej.add(tag('pins', rev(cyl(4.7, 11, .11), 'pale', { whole: true, oy: y }).back))); ej.add(tag('pins', box(10.9, 11.2, -1.3, 1.3, -1.3, 1.3, 'steel')));
  // moulding and sprue, uncovered by a clipping plane as the cavity fills
  const fillPlane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 99), mats = [];
  [PF.part, PF.sprue].forEach((pf) => { const r = rev(pf, 'hot', { cap: K.hot }); part.add(tag('part', r.back)); partFront.add(tag('part', r.front)); });
  part.traverse((o) => { if (o.material) { o.material.clippingPlanes = [fillPlane]; if (o.isMesh) mats.push(o.material); } });
  const frame = (t) => { const s = cyc(t), dx = s.open * OPEN; mov.position.x = dx; ej.position.x = -s.push; screw.position.x = s.off; screw.rotation.x = -s.rot;
   part.visible = s.part; part.position.set(dx - s.push, -s.drop * DROP, 0); fillPlane.constant = s.fill < 1 ? 3.6 + s.fill * 2.45 : 99; const c = new THREE.Color(mix(K.hot, K.mat, s.cool)); mats.forEach((m) => m.color.copy(c)); };
  return { root, frame, parts: PARTS, front: [front, movFront, partFront], home: { t: [1.7, -1.2, 0], d: 56 } };
 } };
})();
