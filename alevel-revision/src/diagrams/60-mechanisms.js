/* Mechanisms for GCSE (AQA 3.1.5): types of movement, linkages, cams and gear trains, each as a still and a running animation. */
(() => {
 const K = D.K, P = Math.PI, IN = K.ink2, OUT = K.hot;
 const bar = (u, a, b, c) => `<line x1="${u.X(a[0])}" y1="${u.Y(a[1])}" x2="${u.X(b[0])}" y2="${u.Y(b[1])}" stroke="${K.ink}" stroke-width="12" stroke-linecap="round"/><line x1="${u.X(a[0])}" y1="${u.Y(a[1])}" x2="${u.X(b[0])}" y2="${u.Y(b[1])}" stroke="${c || K.steel}" stroke-width="8" stroke-linecap="round"/>`;
 const fixedP = (u, x, y) => u.PG([[x, y], [x - .55, y - .95], [x + .55, y - .95]], 'dark') + `<line x1="${u.X(x - .8)}" y1="${u.Y(y - .95)}" x2="${u.X(x + .8)}" y2="${u.Y(y - .95)}" stroke="${K.ink}" stroke-width="2.5"/>` + u.C(x, y, .2, K.ink);
 const movP = (u, x, y) => u.C(x, y, .2, '#fff', 2);
 const head = (u, x, y, s, size, col) => u.T(x, y, s, size || 15, 'middle', col);
 const dirAr = (u, x, y, dx, dy, sgn, col) => u.AR(x - dx * sgn, y - dy * sgn, x + dx * sgn, y + dy * sgn, col);

 /* ---- the four types of movement ---- */
 { const u = U2(20, 0, 96), { X, Y, R, C, AR, ROT } = u, W = 720, H = 200;
  const draw = (t) => { const o = [], s = Math.sin(2 * P * t);
   [9, 18, 27].forEach((x) => o.push(`<line x1="${X(x)}" y1="14" x2="${X(x)}" y2="${H - 14}" stroke="${K.ink}" stroke-width="1" opacity=".25"/>`));
   // linear: a parcel on a conveyor
   o.push(R(1, 8, -.9, -.5, 'dark', 4), C(1.3, -.7, .42, 'steel'), C(7.7, -.7, .42, 'steel')); const lx = 1.2 + ((t * 2) % 1) * 5.4; o.push(R(lx, lx + 1.3, -.5, .7, 'wood'), AR(2.4, 2, 6.6, 2));
   // reciprocating: a saw blade moving backwards and forwards
   const rx = 13.5 + s * 2; o.push(R(rx - 2.2, rx + 2.2, -.2, .25, 'steel'), u.PG(Array.from({ length: 9 }, (_, i) => [[rx - 2.2 + i * .55, -.2], [rx - 1.93 + i * .55, -.6]]).flat().concat([[rx + 2.2, -.2]]), 'steel', 1.5), R(rx + 2.2, rx + 3.4, -.5, .55, 'wood', 4), AR(13.5, 2, 11, 2), AR(13.5, 2, 16, 2));
   // rotary: a wheel
   const a = -2 * P * t; o.push(C(22.5, 0, 1.9, 'steel'), C(22.5, 0, 1.45, 'pale'), [0, 1, 2, 3].map((k) => `<line x1="${X(22.5)}" y1="${Y(0)}" x2="${X(22.5 + 1.45 * Math.cos(a + k * P / 2))}" y2="${Y(1.45 * Math.sin(a + k * P / 2))}" stroke="${K.ink}" stroke-width="2.5"/>`).join(''), C(22.5, 0, .3, 'dark'), ROT(22.5, 0, 2.5, 215, 325));
   // oscillating: a pendulum
   const an = s * .6, bx = 31.5 + 3.2 * Math.sin(an), by = 2.6 - 3.2 * Math.cos(an); o.push(R(30.3, 32.7, 2.6, 2.9, 'dark'), `<line x1="${X(31.5)}" y1="${Y(2.6)}" x2="${X(bx)}" y2="${Y(by)}" stroke="${K.ink}" stroke-width="3"/>`, C(bx, by, .6, 'mat'), `<path d="M${X(29.4)} ${Y(-1.3)}Q${X(31.5)} ${Y(-2.2)} ${X(33.6)} ${Y(-1.3)}" fill="none" stroke="${IN}" stroke-width="3.5" stroke-linecap="round"/>`, AR(29.7, -1.42, 29.3, -1.2), AR(33.3, -1.42, 33.7, -1.2));
   [['Linear', 'one way, in a straight line'], ['Reciprocating', 'back and forth in a line'], ['Rotary', 'round in a circle'], ['Oscillating', 'swinging in an arc']].forEach((n, i) => o.push(head(u, 4.5 + 9 * i, 3.7, n[0]), u.T(4.5 + 9 * i, -3.6, n[1], 11.5, 'middle', '#5f6670')));
   return o.join(''); };
  DIAGRAMS['motion-types'] = { t: 'The four types of movement', w: W, h: H, svg: draw(.07) };
  ANIMS['motion-types'] = { loop: true, dur: 4000, draw, watch: ['Linear: the parcel keeps moving one way in a straight line.', 'Reciprocating: the saw blade moves backwards and forwards in a straight line.', 'Rotary: the wheel turns round and round.', 'Oscillating: the pendulum swings backwards and forwards in an arc.'] }; }

 /* ---- linkages ---- */
 { const u = U2(20, 0, 120), { X, Y, T } = u, W = 720, H = 250;
  const draw = (t) => { const o = [], al = Math.sin(2 * P * t) * .34, sg = Math.cos(2 * P * t) >= 0 ? 1 : -1, sn = Math.sin(al), cs = Math.cos(al), L = 1.7;
   [12, 24].forEach((x) => o.push(`<line x1="${X(x)}" y1="14" x2="${X(x)}" y2="${H - 14}" stroke="${K.ink}" stroke-width="1" opacity=".25"/>`));
   // reverse motion: one bar on a fixed pivot at its centre
   { const p = [6, 0], a = [p[0] + L * sn, L * cs], b = [p[0] - L * sn, -L * cs]; o.push(bar(u, [a[0] - 4.2, a[1]], a, '#9db4ea'), bar(u, b, [b[0] + 4.2, b[1]], '#f0a39b'), bar(u, a, b), fixedP(u, 6, 0), movP(u, a[0], a[1]), movP(u, b[0], b[1]), dirAr(u, 2.6, 3, 1, 0, sg, IN), dirAr(u, 9.4, -3, 1, 0, -sg, OUT)); }
   // parallel motion (push-pull): two bars joined by a link
   { const p1 = 16.4, p2 = 19.6, a1 = [p1 + L * sn, L * cs], b1 = [p1 - L * sn, -L * cs], a2 = [p2 + L * sn, L * cs], b2 = [p2 - L * sn, -L * cs];
    o.push(bar(u, [a1[0] - 3.4, a1[1]], a1, '#9db4ea'), bar(u, a2, [a2[0] + 3.4, a2[1]], '#f0a39b'), bar(u, b1, b2), bar(u, a1, b1), bar(u, a2, b2), fixedP(u, p1, 0), fixedP(u, p2, 0), [a1, b1, a2, b2].map((q) => movP(u, q[0], q[1])).join(''), dirAr(u, 14, 3, 1, 0, sg, IN), dirAr(u, 22, 3, 1, 0, sg, OUT)); }
   // bell crank: an L-shaped bar on a fixed pivot at its corner
   { const p = [29, -.4], a = [p[0] + L * sn, p[1] + L * cs], b = [p[0] + L * cs, p[1] - L * sn]; o.push(bar(u, [a[0] - 3.6, a[1]], a, '#9db4ea'), bar(u, b, [b[0], b[1] - 3.2], '#f0a39b'), bar(u, a, p), bar(u, p, b), fixedP(u, p[0], p[1]), movP(u, a[0], a[1]), movP(u, b[0], b[1]), dirAr(u, 26.4, 2.7, 1, 0, sg, IN), dirAr(u, 32.4, -2.6, 0, 1, -sg, OUT)); }
   [['Reverse motion', 'the output moves the opposite way'], ['Parallel motion (push/pull)', 'the output moves the same way'], ['Bell crank', 'the direction is turned through 90°']].forEach((n, i) => o.push(head(u, 6 + 12 * i, 5, n[0]), T(6 + 12 * i, -5.4, n[1], 11.5, 'middle', '#5f6670')));
   o.push(T(1.2, 2.2, 'IN', 12, 'middle', IN), T(10.8, -3.6, 'OUT', 12, 'middle', OUT), T(13.1, 2.2, 'IN', 12, 'middle', IN), T(22.9, 2.2, 'OUT', 12, 'middle', OUT), T(25.6, 1.8, 'IN', 12, 'middle', IN), T(33.6, -3.2, 'OUT', 12, 'middle', OUT));
   return o.join(''); };
  DIAGRAMS['linkages'] = { t: 'Linkages change the direction of a movement', w: W, h: H, svg: draw(.12) };
  ANIMS['linkages'] = { loop: true, dur: 3600, draw, watch: ['Blue is the input and red is the output. The dark triangles are fixed pivots; the white circles are moving pivots.', 'Reverse motion: push the input one way and the output moves the other way.', 'Parallel motion (push/pull): two bars and a link, so the output moves the same way as the input.', 'Bell crank: the movement is turned through 90°. Moving a pivot nearer one end changes the size of the output force and movement.'] }; }

 /* ---- cams and followers ---- */
 { const u = U2(20, 0, 170), { X, Y, R, C, T, ROT } = u, W = 720, H = 290;
  const prof = [(f) => 1.1 + 1.3 * Math.pow(Math.max(0, Math.cos(f)), 1.4), (f) => .7 * Math.cos(f) + Math.sqrt(2.25 - .49 * Math.sin(f) * Math.sin(f)), (f) => .9 + 1.5 * ((((f + P) % (2 * P)) + 2 * P) % (2 * P)) / (2 * P)];
  const draw = (t) => { const o = [], th = -2 * P * t;
   [12, 24].forEach((x) => o.push(`<line x1="${X(x)}" y1="14" x2="${X(x)}" y2="${H - 14}" stroke="${K.ink}" stroke-width="1" opacity=".25"/>`));
   prof.forEach((r, i) => { const cx = 6 + 12 * i, cy = 0, pts = []; for (let k = 0; k < 90; k++) { const f = k * P / 45; pts.push([cx + r(f) * Math.cos(f + th), cy + r(f) * Math.sin(f + th)]); }
    const h = r(P / 2 - th); o.push(u.PG(pts, 'mat'), C(cx, cy, .32, 'dark'), `<line x1="${X(cx)}" y1="${Y(cy)}" x2="${X(cx + .32 * Math.cos(th))}" y2="${Y(cy + .32 * Math.sin(th))}" stroke="#fff" stroke-width="2"/>`);
    o.push(R(cx - .22, cx + .22, cy + h + .3, cy + h + 4.6, 'steel'), u.PG([[cx - .22, cy + h + .3], [cx + .22, cy + h + .3], [cx, cy + h]], 'steel'), R(cx - .9, cx + .9, cy + h + 4.6, cy + h + 4.95, 'cool'));
    [1, -1].forEach((m) => o.push(R(cx + m * .22 + (m > 0 ? 0 : -.9), cx + m * .22 + (m > 0 ? .9 : 0), 4.3, 5.5, 'dark')));
    o.push(ROT(cx - .2, cy, 2.9, 150, 210)); });
   [['Pear cam', 'dwells, then rises and falls'], ['Eccentric (circular) cam', 'smooth rise and fall'], ['Snail (drop) cam', 'slow rise, sudden drop']].forEach((n, i) => o.push(T(6 + 12 * i, -3.6, n[0], 15), T(6 + 12 * i, -4.5, n[1], 11.5, 'middle', '#5f6670')));
   return o.join(''); };
  const mk = (x, y, s, tx, ty) => [X(x), Y(y), s, X(tx), Y(ty)];
  DIAGRAMS['cam-follower'] = { t: 'Cams and followers: rotary motion in, reciprocating motion out', w: W, h: H, svg: draw(.1), parts: [mk(2.2, -.8, 'Cam', 5, -.5), mk(2.6, 2.6, 'Follower', 5.75, 3.2), mk(9.4, 6.2, 'Guide (slide)', 7, 4.9), mk(9.6, -1.4, 'Shaft (rotary motion in)', 6.2, -.1)] };
  ANIMS['cam-follower'] = { loop: true, dur: 4200, draw, watch: ['The cam turns (rotary motion) and the follower moves up and down (reciprocating motion). The guide keeps the follower in a straight line.', 'Pear cam: the follower dwells for about half a turn, then rises and falls.', 'Eccentric cam: a circle turning off-centre gives a smooth, steady rise and fall.', 'Snail cam: a slow rise, then the follower drops suddenly. It can only turn in one direction.'] }; }

 /* ---- gear trains ---- */
 { const u = U2(21, 0, 128), { X, Y, C, T, ROT } = u, W = 680, H = 270, m = .28;
  const gear = (cx, cy, N, phi, col) => { const rp = N * m / 2, ro = rp + m, rr = rp - 1.2 * m, tau = 2 * P / N, pts = []; for (let k = 0; k < N; k++) { const a = phi + k * tau; [[rr, -.27], [ro, -.13], [ro, .13], [rr, .27]].forEach((q) => pts.push([cx + q[0] * Math.cos(a + q[1] * tau), cy + q[0] * Math.sin(a + q[1] * tau)])); }
   return u.PG(pts, col, 1.8) + C(cx, cy, .3, 'dark') + C(cx + (rr - .45) * Math.cos(phi), cy + (rr - .45) * Math.sin(phi), .17, K.ink, 0); };
  const next = (phi, N1, N2) => P - (N1 / N2) * phi - P / N2;                                                    // the angle that keeps the next gear in mesh
  const draw = (t) => { const o = [], a = -4 * P * t, b = next(a, 12, 24), c2 = next(a, 12, 24), c3 = next(c2, 24, 12);
   o.push(`<line x1="${X(14.4)}" y1="14" x2="${X(14.4)}" y2="${H - 14}" stroke="${K.ink}" stroke-width="1" opacity=".25"/>`);
   o.push(gear(3.4, 0, 12, a, K.mat), gear(8.44, 0, 24, b, K.cool), ROT(3.4, 0, 2.5, 240, 300), ROT(8.44, 0, 4.2, 285, 255, 'hot'));
   o.push(gear(17.6, 0, 12, a, K.mat), gear(22.64, 0, 24, c2, K.steel), gear(27.68, 0, 12, c3, K.cool), ROT(17.6, 0, 2.5, 240, 300), ROT(27.68, 0, 2.5, 240, 300, 'hot'));
   o.push(T(6.6, 5.1, 'Simple gear train', 15), T(3.4, -3.3, 'driver', 12.5), T(3.4, -4, '12 teeth', 11.5, 'middle', '#5f6670'), T(8.44, -4.6, 'driven', 12.5), T(8.44, -5.3, '24 teeth', 11.5, 'middle', '#5f6670'));
   o.push(T(22.6, 5.1, 'With an idler gear', 15), T(17.6, -3.3, 'driver', 12.5), T(17.6, -4, '12 teeth', 11.5, 'middle', '#5f6670'), T(22.64, -4.6, 'idler', 12.5), T(27.68, -3.3, 'driven', 12.5), T(27.68, -4, '12 teeth', 11.5, 'middle', '#5f6670'));
   return o.join(''); };
  DIAGRAMS['gear-train'] = { t: 'Gear trains', w: W, h: H, svg: draw(.03) };
  ANIMS['gear-train'] = { loop: true, dur: 9000, draw, watch: ['Gears that mesh turn in opposite directions. Watch the dot on each gear.', 'Gear ratio = teeth on the driven gear ÷ teeth on the driver gear = 24 ÷ 12 = 2, written 2:1. The driven gear turns at half the speed of the driver, but with more turning force.', 'An idler gear sits between the driver and the driven gear so they both turn the same way. It does not change the gear ratio: here 12 ÷ 12 = 1:1.'] }; }
})();
