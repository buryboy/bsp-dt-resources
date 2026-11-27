/* Investment casting, milling, MIG welding and the CNC router in motion. See 01-motion-kit.js for the format. */
(() => {
 const K = Object.assign({ cast: '#b9c2cc' }, D.K), P = Math.PI, { sm, mix } = FIGX, G = '#9cc4a8';
 const num = (u, x, y, n) => FIGX.still ? '' : `<circle cx="${u.X(x)}" cy="${u.Y(y)}" r="11" fill="${K.ink2}" stroke="#fff" stroke-width="1.5"/><text x="${u.X(x)}" y="${u.Y(y) + 4.5}" font-family="Arial,sans-serif" font-size="12.5" font-weight="700" text-anchor="middle" fill="#fff">${n}</text>`;

 /* ---- investment (lost wax) casting ---- */
 { const u = U2(22, 230, 172), { X, Y, R, PG, AR, T } = u, W = 460, H = 310;
  const ST = [[0, .2, 'Make the wax tree', 'Wax patterns, each an exact copy of the part, are injection moulded and joined to a central wax runner to make a tree.'],
   [.2, .45, 'Build the shell', 'The tree is dipped again and again in ceramic slurry and coated with fine sand. This builds up a hard, heat-proof shell round the wax.'],
   [.45, .65, 'Melt out the wax', 'The shell is turned upside down and heated. The wax melts and runs out, which is why it is called lost wax casting. A hollow, one-piece mould is left.'],
   [.65, 1, 'Pour and break out', 'Molten metal is poured into the hot shell. When it has set, the shell is broken away and the castings are cut off the runner. They are very accurate, with a fine surface finish.', .8]];
  const shapes = [[[-1, 3.2], [1, 3.2], [.3, 2.4], [-.3, 2.4]], [[-.3, 2.4], [.3, 2.4], [.3, -2.2], [-.3, -2.2]]];
  [1.4, -.1, -1.6].forEach((y) => [1, -1].forEach((m) => shapes.push([[.3 * m, y + .13], [1.1 * m, y + .13], [1.1 * m, y - .13], [.3 * m, y - .13]], [[1.1 * m, y + .5], [2.3 * m, y + .5], [2.3 * m, y - .5], [1.1 * m, y - .5]])));
  const tree = (attr) => shapes.map((s) => `<polygon points="${s.map((p) => X(p[0]) + ',' + Y(p[1])).join(' ')}" ${attr}/>`).join('');
  const draw = (t, id) => { const o = [], shell = sm(.22, .44, t), dip = t >= .2 && t < .45 ? -Math.abs(Math.sin((t - .2) / .25 * 2 * P)) * 4.6 : 0, inv = sm(.45, .49, t) - sm(.62, .66, t), melt = sm(.5, .62, t), fill = sm(.69, .82, t), cool = sm(.83, .9, t), gone = sm(.9, .98, t), pour = sm(.66, .69, t) - sm(.81, .84, t);
   const inside = t < .5 ? K.yellow : fill > 0 ? mix(K.hot, K.cast, cool) : '#fff';
   o.push(`<defs><clipPath id="icf${id}"><rect x="0" y="${Y(-2.4 + fill * 5.8)}" width="${W}" height="${H}"/></clipPath><clipPath id="icw${id}"><rect x="0" y="0" width="${W}" height="${Y(3.3 - (1 - melt) * 5.6)}"/></clipPath></defs>`);
   if (t >= .45 && t < .65) o.push(R(-7.4, 7.4, -5, 6.6, '#fbd9d2', 10, 1.5), [-6.2, 6.2].map((x) => [-2.4, 1, 4.2].map((y) => R(x - .3, x + .3, y - 1, y + 1, 'hot', 4)).join('')).join(''));
   o.push(`<g transform="translate(0 ${(-(1.2 + dip) * 22).toFixed(1)}) rotate(${(inv * 180).toFixed(1)} ${X(0)} ${Y(.5)})">`);
   if (shell > 0) o.push(`<g opacity="${(1 - gone).toFixed(2)}">` + tree(`fill="none" stroke="${K.ink}" stroke-width="${(shell * 16 + 3).toFixed(1)}" stroke-linejoin="round"`) + tree(`fill="none" stroke="${K.sand}" stroke-width="${(shell * 16).toFixed(1)}" stroke-linejoin="round"`) + '</g>');
   if (t < .5) o.push(tree(`fill="${K.yellow}" stroke="${K.ink}" stroke-width="1.6" stroke-linejoin="round"`));
   else { o.push(tree(`fill="#fff" stroke="${K.ink}" stroke-width="1.2" stroke-linejoin="round"`)); if (melt < 1) o.push(`<g clip-path="url(#icw${id})">` + tree(`fill="${K.yellow}" stroke="none"`) + '</g>'); if (fill > 0) o.push(`<g clip-path="url(#icf${id})">` + tree(`fill="${inside}" stroke="${K.ink}" stroke-width="${gone > .2 ? 1.8 : 1}" stroke-linejoin="round"`) + '</g>'); }
   o.push('</g>');
   if (t >= .2 && t < .45) o.push(R(-4.4, 4.4, -6, -1.6, K.sand, 4).replace('<rect', '<rect opacity=".93"'), T(0, -4.2, 'ceramic slurry', 12));
   if (t >= .5 && t < .64) [0, 1, 2].forEach((k) => { const yy = -2.2 - (((t * 9) + k / 3) % 1) * 2.4; o.push(`<ellipse cx="${X((k - 1) * .35)}" cy="${Y(yy)}" rx="3.2" ry="5" fill="${K.yellow}" stroke="${K.ink}" stroke-width="1"/>`); });
   if (pour > .01) { o.push(`<g transform="rotate(${(40 * pour).toFixed(1)} ${X(-2.4)} ${Y(6.4)})">` + PG([[-4.6, 7.2], [-2.3, 7.2], [-2.6, 5.6], [-4.3, 5.6]], 'dark') + PG([[-4.4, 6.9], [-2.5, 6.9], [-2.7, 5.8], [-4.2, 5.8]], K.hot, 1.2) + '</g>'); if (pour > .9) o.push(R(-.5, -.2, 4.2, 5.8, K.hot, 0, 0).replace(/stroke="[^"]*"/, 'stroke="none"')); }
   if (t < .2) o.push(T(4.6, 2.6, 'wax pattern', 12), T(4.4, 5, 'wax runner', 12)); if (t >= .45 && t < .65) o.push(T(0, 5.9, 'furnace', 12)); if (gone > .9) o.push(T(0, -3.6, 'castings on the runner', 12));
   return o.join(''); };
  ANIMS['investment-casting'] = { stages: ST, draw, w: W, h: H, start: .3 }; }

 /* ---- vertical milling machine ---- */
 { const u = U2(22, 200, 170), { X, Y, R, PG, C, AR, T } = u, W = 440, H = 320;
  const draw = (t) => { const o = [], cutting = t < .8, s = cutting ? -2.9 + 5.8 * t / .8 : 2.9 - 5.8 * sm(.8, 1, t), a = Math.max(-.4, -2.2 + s), top = (x0, x1, y) => (x1 > x0 ? R(x0, x1, -.4, y, '#7fa3c9') : '');
   o.push(R(-4, 7.5, -6.4, -5.6, 'dark', 3), R(4.6, 7, -5.6, 6.4, G), R(-1.6, 7, 3.8, 6.4, G, 4), R(-.7, .7, 2.4, 3.8, 'steel'), R(-2.6, 4.6, -5, -3.6, G), R(-3.4, 3.4, -3.6, -2.8, 'steel'));
   o.push(R(-5 + s, 5 + s, -2.8, -2.1, 'dark', 2), R(-2.7 + s, 2.7 + s, -2.1, -.4, 'steel'));
   if (cutting) o.push(top(-2.2 + s, Math.min(-.4, 2.2 + s), .9), top(a, 2.2 + s, .6)); else o.push(top(-2.2 + s, 2.2 + s, .6));
   o.push(R(-.4, .4, .6, 2.4, 'pale', 2)); for (let k = 0; k < 4; k++) { const y = .7 + ((k * .45 + t * 14) % 1.7); o.push(`<line x1="${X(-.4)}" y1="${Y(y)}" x2="${X(.4)}" y2="${Y(Math.min(2.4, y + .3))}" stroke="${K.ink}" stroke-width="1.4"/>`); }
   if (cutting && 2.2 + s > -.4 && -2.2 + s < .4) [0, 1, 2].forEach((k) => { const q = ((t * 30) + k / 3) % 1; o.push(C(-.5 - q * 1.2, .9 + Math.sin(q * P) * .9, .08, K.ink, 0)); });
   o.push(u.ROT(0, 3.1, 1.3, 200, 340), AR(-7.5, 2.2, -5.5, 2.2), num(u, 2.8, 7, 1), num(u, -4.2, .4 + 0, 2), num(u, -7.6, -2.4, 3), num(u, 2, 1.5, 4));
   return o.join(''); };
  ANIMS['milling'] = { loop: true, dur: 9000, w: W, h: H, draw, watch: ['The motor in the head turns the spindle and the multi-tooth cutter.', 'The work is clamped firmly in a machine vice bolted to the table.', 'The table feeds the work slowly past the cutter. Handwheels or CNC motors move it in X and Y; the depth of cut is set in Z.', 'Each tooth cuts away a small chip. Milling makes flat faces, steps and slots, which is why it is a wasting process.'] }; }

 /* ---- MIG welding ---- */
 { const u = U2(22, 240, 150), { X, Y, R, PG, PL, C, AR, T } = u, W = 480, H = 300;
  const draw = (t) => { const o = [], tx = -7 + 14 * t, fl = .28 + .1 * Math.sin(t * 400);
   o.push(R(-10.4, 10.4, -2.6, -2, 'dark', 3), R(-9, 9, -2, -1.2, 'steel'), R(-10.4, -7.4, -6.2, -3.2, 'dark', 4), T(-8.9, -4.9, 'power', 11, 'middle', '#fff'), PL([[-7.4, -4.6], [8, -4.6], [8, -2]], 2.5), R(7.6, 8.4, -1.5, -.9, 'hot', 2));
   o.push(C(-8.6, 4.8, 1.3, 'steel'), C(-8.6, 4.8, .4, 'dark'), `<path d="M${X(-7.5)} ${Y(5.4)}Q${X(tx - 3)} ${Y(7.4)} ${X(tx - 1.25)} ${Y(2.2)}" fill="none" stroke="${K.ink}" stroke-width="5" stroke-linecap="round"/>`);
   for (let x = -7; x < tx - .1; x += .42) o.push(`<ellipse cx="${X(x)}" cy="${Y(-1.16)}" rx="7.5" ry="4.5" fill="${mix(K.hot, '#6b7480', Math.min(1, (tx - x) / 3))}" stroke="${K.ink}" stroke-width="1.1"/>`);
   o.push(`<g transform="rotate(-20 ${X(tx)} ${Y(-1.15)})">`, PG([[tx - .5, .1], [tx + .5, .1], [tx + 1.3, -1.15], [tx - 1.3, -1.15]], K.cool, 0).replace('<polygon', '<polygon opacity=".5"'), R(tx - .28, tx + .28, 1.3, 3.7, 'dark', 4), PG([[tx - .45, 1.4], [tx + .45, 1.4], [tx + .32, .1], [tx - .32, .1]], 'hot'), PL([[tx, .1], [tx, -.85]], 2.5, '#8a5a1c'), '</g>');
   o.push(`<polygon points="${Array.from({ length: 10 }, (_, i) => { const r = (i % 2 ? fl * .45 : fl) * 22, an = i * P / 5 + t * 60; return (X(tx) + r * Math.cos(an)).toFixed(1) + ',' + (Y(-1.12) + r * Math.sin(an)).toFixed(1); }).join(' ')}" fill="#ffd54a" stroke="${K.ink}" stroke-width="1"/>`);
   o.push(AR(1.5, 5.8, 4.5, 5.8), num(u, -6.4, 6.6, 1), num(u, tx + 1.6, -.2, 2), num(u, tx - 2.4, .4, 3), num(u, Math.max(-6.6, tx - 3.4), -3.3, 4));
   return o.join(''); };
  ANIMS['mig-welding'] = { loop: true, dur: 9000, w: W, h: H, draw, watch: ['The wire electrode is fed continuously from the reel through the torch. It is consumable: it melts to become the filler metal.', 'An electric arc between the tip of the wire and the work melts the wire and the edges of the parent metal into a weld pool.', 'Shielding gas, argon or an argon and CO₂ mix, flows from the nozzle to keep the air away from the hot metal so it does not oxidise.', 'Behind the torch the pool cools and sets as a weld bead that is fused to both pieces.'] }; }

 /* ---- CNC router ---- */
 { const u = U2(22, 240, 196), { X, Y, R, PG, C, AR, T } = u, W = 480, H = 330;
  const draw = (t) => { const o = [], cx = t < .15 ? -6 + 3 * sm(0, .15, t) : t < .3 ? -3 : t < .75 ? -3 + 6 * (t - .3) / .45 : t < .88 ? 3 : 3 - 9 * sm(.88, 1, t), zb = -.6 - 1.3 * (sm(.15, .3, t) - sm(.75, .88, t)), cutTo = t < .3 ? null : Math.min(3, -3 + 6 * (t - .3) / .45);
   o.push(R(-9.4, 9.4, -3, -2.2, 'dark', 3), R(-8.8, -7.8, -5.6, -3, 'steel'), R(7.8, 8.8, -5.6, -3, 'steel'), R(-6.5, 6.5, -2.2, -1.4, 'wood'), R(-6.9, -6.1, -1.4, -1.1, 'dark', 2), R(6.1, 6.9, -1.4, -1.1, 'dark', 2));
   if (cutTo != null) o.push(R(-3.2, cutTo + .2, -1.9, -1.4, '#fff', 0, 1.3));
   o.push(R(-8.6, -7.6, -2.2, 5.2, G), R(7.6, 8.6, -2.2, 5.2, G), R(-8.6, 8.6, 5.2, 6.4, 'steel', 3), R(cx - 1.3, cx + 1.3, 4.6, 7.1, 'dark', 3), R(cx - .7, cx + .7, zb + 1, zb + 3.8, 'steel', 4), R(cx - .16, cx + .16, zb, zb + 1, 'pale', 0, 1.4));
   if (zb < -1.5 && t >= .3 && t < .75) [0, 1, 2].forEach((k) => { const q = ((t * 30) + k / 3) % 1; o.push(C(cx - .3 - q, -1.3 + Math.sin(q * P) * .7, .07, K.ink, 0)); });
   o.push(AR(-6.2, 1.4, -4.4, 1.4), AR(-6.2, 1.4, -6.2, 3.2), AR(-6.2, 1.4, -5.2, 2.2), T(-4, 1.25, 'X', 12, 'middle', 'ink2'), T(-6.2, 3.5, 'Z', 12, 'middle', 'ink2'), T(-4.8, 2.4, 'Y', 12, 'middle', 'ink2'));
   o.push(num(u, 5.4, 7.6, 1), num(u, cx + 2.2, 6.2, 2), num(u, cx + 1.6, zb + 2.6, 3), num(u, cx + 1.2, zb + .2, 4));
   return o.join(''); };
  ANIMS['cnc-router'] = { loop: true, dur: 10000, w: W, h: H, draw, watch: ['The gantry spans the bed and moves along it from front to back. That is the Y axis.', 'The spindle carriage moves left and right along the gantry. That is the X axis.', 'The spindle moves down and up to set the depth of cut. That is the Z axis.', 'The spinning cutter removes material along the toolpath. CAM software turns the CAD drawing into the G-code that drives the three motors.'] }; }
})();
