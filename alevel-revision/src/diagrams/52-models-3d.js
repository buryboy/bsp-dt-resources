/* 3D models: wood joints that pull apart, and a centre lathe turning a bar. See 01-motion-kit.js for the format. */
(() => {
 const { sm } = FIGX, WA = '#dfc08f', WB = '#c99b62', PEG = '#f0dfb0';
 /* ---- wood joints ---- */
 const JOINTS = [
  ['Butt', 'The end of one piece is simply glued against the other, often with nails or screws. Quick to make but weak: end grain glues poorly and the glue area is small.'],
  ['Dowel', 'A butt joint strengthened with wooden pegs glued into holes drilled in both pieces. The holes must line up exactly, so a jig is used. Common in flat-pack furniture.'],
  ['Mitre', 'Both ends are cut at 45°. It hides the end grain, so it looks neat on picture frames, but it is weak unless it is reinforced.'],
  ['Halving (lap)', 'Half the thickness is cut away from each piece so they overlap and finish flush. It has more glue area than a butt joint and is used in frames.'],
  ['Housing', 'A groove cut across one piece holds the end of the other. Used for shelves and dividers in cabinets and bookcases.'],
  ['Mortise and tenon', 'A tongue (the tenon) fits into a slot (the mortise). Very strong, with a large glue area. Used for tables, chairs and door frames.'],
  ['Finger (comb)', 'Square fingers interlock, giving a large glue area. Strong and decorative, used for boxes. It is easy to cut by machine or laser.'],
  ['Dovetail', 'Wedge-shaped tails lock between the pins. It can only come apart in one direction, so it resists pulling. Used for drawer fronts.']];
 MODELS['wood-joints'] = { variants: JOINTS.map((j) => j[0]), slider: 'Pull apart', start: .6, build(M, v) {
  const { THREE, tag, box, slab, rev, cyl, flat } = M, root = new THREE.Group(), A = new THREE.Group(), B = new THREE.Group(); root.add(A, B);
  const plan = (pts, h, c) => { const g = new THREE.Group(); g.add(slab(pts, 0, h, c)); g.rotation.x = -Math.PI / 2; return g; };                 // outline seen from above, pushed up to height h (z runs away from you)
  const side = (pts, x0, x1, c, holes) => { const g = new THREE.Group(); g.add(slab(pts, -x1, -x0, c, holes)); g.rotation.y = -Math.PI / 2; return g; }; // outline as [z, y], pushed along x
  let dir = [-1, 0, 0], dist = 5; const parts = { a: ['First piece', 'One of the two pieces being joined.'], b: ['Second piece', 'The other piece.'] };
  if (v === 0 || v === 1) { A.add(box(0, 10, 0, 6, 0, 2, WA)); B.add(box(10, 12, 0, 6, 0, 10, WB));
   if (v === 1) { [1.5, 3, 4.5].forEach((y) => { B.add(tag('peg', rev(cyl(8.6, 10, .36), PEG, { whole: true, oy: y, oz: 1 }).back)); const h = new THREE.Mesh(new THREE.CircleGeometry(.38, 20), flat('#6b5233')); h.rotation.y = Math.PI / 2; h.position.set(10.01, y, 1); A.add(tag('hole', h)); });
    parts.peg = ['Dowel', 'A round wooden peg, usually beech, with grooves to let glue and air escape.']; parts.hole = ['Dowel hole', 'Drilled to the same diameter as the dowel, in both pieces.']; } }
  if (v === 2) { A.add(plan([[0, 0], [12, 0], [10, 2], [0, 2]], 6, WA)); B.add(plan([[12, 0], [12, 10], [10, 10], [10, 2]], 6, WB)); A.scale.z = B.scale.z = -1; }
  if (v === 3) { A.add(slab([[0, 0], [10, 0], [10, 1], [6, 1], [6, 2], [0, 2]], 0, 4, WA)); B.add(side([[0, 1], [4, 1], [4, 0], [12, 0], [12, 2], [0, 2]], 6, 10, WB)); dir = [0, 1, 0]; dist = 4; }
  if (v === 4) { A.add(tag('groove', slab([[0, 0], [12, 0], [12, 2], [7, 2], [7, 1.2], [5, 1.2], [5, 2], [0, 2]], 0, 6, WA))); B.add(box(5, 7, 1.2, 9, 0, 6, WB)); dir = [0, 1, 0]; dist = 4; parts.groove = ['Housing', 'The groove is cut across the grain to the thickness of the shelf.']; delete parts.a; }
  if (v === 5) { A.add(tag('mortise', side([[0, 0], [3, 0], [3, 12], [0, 12]], 0, 4, WA, [[[1, 5], [2, 5], [2, 8], [1, 8]]]))); B.add(box(4, 13, 4.5, 8.5, 0, 3, WB), tag('tenon', box(.4, 4, 5, 8, 1, 2, WB))); dir = [1, 0, 0]; dist = 6;
   parts.mortise = ['Mortise', 'The slot, cut with a mortise chisel or a mortising machine.']; parts.tenon = ['Tenon', 'The tongue, about one third of the thickness of the wood. The flat faces round it are the shoulders.']; delete parts.a; }
  if (v === 6) { A.add(slab([[0, 0], [12, 0], [12, 1.2], [10, 1.2], [10, 2.4], [12, 2.4], [12, 3.6], [10, 3.6], [10, 4.8], [12, 4.8], [12, 6], [0, 6]], 0, 2, WA)); B.add(side([[10, 0], [10, 6], [2, 6], [2, 4.8], [0, 4.8], [0, 3.6], [2, 3.6], [2, 2.4], [0, 2.4], [0, 1.2], [2, 1.2], [2, 0]], 10, 12, WB)); dir = [0, 0, 1]; }
  if (v === 7) { A.add(tag('tails', slab([[0, 0], [10, 0], [10, .9], [12, .5], [12, 2.5], [10, 2.1], [10, 3.9], [12, 3.5], [12, 5.5], [10, 5.1], [10, 6], [0, 6]], 0, 2, WA))); B.add(box(10, 12, 0, 6, 2, 10, WB));
   [[[10, 0], [12, 0], [12, .5], [10, .9]], [[10, 2.1], [12, 2.5], [12, 3.5], [10, 3.9]], [[10, 5.1], [12, 5.5], [12, 6], [10, 6]]].forEach((p) => B.add(tag('pins', slab(p, 0, 2, WB)))); dir = [0, 0, 1];
   parts.tails = ['Tails', 'Wider at the end than at the base, like a dove’s tail, so they cannot pull straight out.']; parts.pins = ['Pins', 'Fit between the tails. The slope is about 1 in 6 for softwood and 1 in 8 for hardwood.']; delete parts.a; }
  A.children.forEach((c) => { if (!c.userData.part) tag('a', c); }); B.children.forEach((c) => { if (!c.userData.part) tag('b', c); });
  const mover = dir[0] < 0 ? A : B, frame = (e) => { mover.position.set(dir[0] * e * dist, dir[1] * e * dist, dir[2] * e * dist * (v === 2 ? -1 : 1)); };
  return { root, frame, parts, note: `<b>${JOINTS[v][0]} joint.</b> ${JOINTS[v][1]}`, home: { t: [7, 3.5, v === 2 ? -4 : 4], d: 46, v: [.42, .42, .8] } };
 } };

 /* ---- centre lathe ---- */
 const LST = [[0, .18, 'Set the tool', 'The work is held in the chuck and supported by the tailstock centre. The chuck turns the work. The cross-slide winds the tool in to set the depth of cut.'],
  [.18, .84, 'Turn', 'The carriage feeds the tool along the bed, parallel to the axis of the work. The tool stays still while the work turns, and a thin layer is cut away to leave a smaller diameter.'],
  [.84, 1, 'Wind back', 'The tool is wound out and the carriage is taken back to the start, ready for another cut.', .92]];
 MODELS['centre-lathe'] = { stages: LST, dur: 14000, build(M) {
  const { THREE, tag, box, rev, cyl, K } = M, root = new THREE.Group(), G = '#9cc4a8', spin = new THREE.Group(), car = new THREE.Group(), cross = new THREE.Group(); root.add(spin, car); car.add(cross);
  const R = (key, pf, c, o, to) => { const r = rev(pf, c, Object.assign({ whole: true }, o)); (to || root).add(tag(key, r.back)); return r.back; };
  root.add(tag('bed', box(-6, 16, -4, -3, -2, 2, 'steel')), tag('bed', box(-6, -1, -10, -4, -2.4, 2.4, G)), tag('bed', box(12, 16, -10, -4, -2.4, 2.4, G)), tag('bed', box(-1, 12, -5.2, -4.6, -2.6, 2.6, 'dark')));
  root.add(tag('head', box(-6, -1, -3, 2.4, -2.5, 2.5, G))); R('head', cyl(-1, -.4, 1.3), 'dark');
  R('chuck', cyl(-.4, 1.2, 2.3), 'dark', {}, spin); [0, 1, 2].forEach((k) => { const j = box(1.2, 1.9, 1.05, 2.1, -.35, .35, 'steel'), g = new THREE.Group(); g.add(j); g.rotation.x = k * 2.094; spin.add(tag('chuck', g)); });
  const thick = R('work', cyl(0, 1, 1.2), '#e3e7ec', { n: 32 }, spin), thin = R('work', cyl(0, 1, .92), '#f4f6f8', { n: 32 }, spin);
  [0, 1, 2, 3].forEach((k) => { const m = box(0, 1, 1.17, 1.215, -.05, .05, 'dark'), g = new THREE.Group(); g.add(m); g.rotation.x = k * 1.5708; g.userData.mark = 1; spin.add(g); });   // marks so the spin shows
  root.add(tag('tail', box(12.6, 15.4, -3, 1.4, -1.7, 1.7, G))); R('tail', cyl(11.7, 12.6, .6), 'steel'); R('centre', [[11, 0], [11.7, .5], [11.7, 0]], 'dark'); R('tail', cyl(15.4, 15.7, 1.3), 'dark');
  R('lead', cyl(-1, 12.6, .16), 'steel', { oy: -3.5, oz: 2.25 });
  car.add(tag('carriage', box(-1.7, 1.7, -3, -2.4, -2.7, 2.7, G)), tag('carriage', box(-1.7, 1.7, -5.4, -3, 2.3, 2.8, G))); R('carriage', cyl(0, .3, .8), 'dark', { oy: -4.2, oz: 3.1 }, car).rotation.y = -Math.PI / 2;
  cross.add(tag('cross', box(-1, 1, -2.4, -1.9, -.4, 3.4, 'steel')), tag('post', box(-.7, .7, -1.9, -.2, 1.1, 2.5, 'dark')), tag('tool', box(-.16, .16, -.3, .02, 0, 2.4, K.yellow))); R('cross', cyl(0, .3, .6), 'dark', { oy: -2.15, oz: 0 }, cross).position.set(0, 0, 3.7); cross.children[cross.children.length - 1].rotation.y = -Math.PI / 2;
  const parts = { bed: ['Bed', 'The rigid base. The carriage and tailstock slide along its accurately machined ways.'], head: ['Headstock', 'Holds the motor, gears and spindle that turn the chuck. Spindle speed is set here.'], chuck: ['Three-jaw chuck', 'Grips round bar. The three jaws move together, so the work is centred automatically.'],
   work: ['Workpiece', 'The bar being turned. It rotates while the tool stays still.'], tail: ['Tailstock', 'Slides along the bed and locks. It supports the end of long work, or holds a drill chuck.'], centre: ['Centre', 'A hardened point that sits in a centre-drilled hole to support the end of the work.'],
   carriage: ['Carriage (saddle)', 'Moves the tool along the bed, by handwheel or by automatic feed.'], cross: ['Cross-slide', 'Moves the tool in and out, at right angles to the work. It sets the depth of cut and is used for facing off.'], post: ['Tool post', 'Clamps the cutting tool at centre height.'],
   tool: ['Cutting tool', 'A single-point tool of high-speed steel or with a carbide tip.'], lead: ['Lead screw', 'Drives the carriage at a steady rate for automatic feed and for cutting screw threads.'] };
  const frame = (t) => { const inn = sm(.04, .16, t) - sm(.84, .9, t), cut = sm(.18, .84, t), back = sm(.9, .99, t), cx = 10.6 - cut * 8 + back * 8, done = 10.6 - cut * 8;
   spin.rotation.x = t * 75; car.position.x = cx; cross.position.z = 2.2 - inn * 1.28;
   thick.scale.x = Math.max(.01, done - .9); thick.position.x = .9; thin.scale.x = Math.max(.001, 11 - done); thin.position.x = done; thin.visible = cut > .001;
   spin.children.forEach((c) => { if (c.userData.mark) { c.scale.x = Math.max(.01, done - 1.9); c.position.x = 1.9; } }); };
  return { root, frame, parts, home: { t: [5, -2.4, 0], d: 50, v: [.3, .3, .9] } };
 } };
})();
