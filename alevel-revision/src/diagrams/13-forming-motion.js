/* Rotational moulding, compression moulding, press forming and sand casting in motion. See 01-motion-kit.js for the format. */
(() => {
 const K = Object.assign({ cast: '#b9c2cc' }, D.K), P = Math.PI, { sm, mix } = FIGX;

 /* ---- rotational moulding ---- */
 { const u = U2(22, 230, 150), { X, Y, R, C, AR, ROT, T } = u, W = 460, H = 300;
  const ST = [[0, .15, 'Load', 'A measured amount of polymer powder, usually polyethylene, is put into the cold, open mould. The mould is then closed.'],
   [.15, .55, 'Heat and rotate', 'The mould is moved into an oven and turned slowly about two axes at once. The powder melts and coats the inside of the mould in an even layer.'],
   [.55, .8, 'Cool', 'The mould keeps turning while it is cooled with air or a water spray, so the wall stays an even thickness as it sets.'],
   [.8, 1, 'Unload', 'The mould is opened and the hollow, seamless product is taken out. Used for large hollow items such as water tanks, kayaks and traffic cones.', .93]];
  const half = (sg, dx, r0, r1, f) => { const cx = X(dx * sg), cy = Y(0), a = r0 * 22, b = r1 * 22, sw = sg > 0 ? 1 : 0; return `<path d="M${cx} ${cy - a}A${a} ${a} 0 0 ${sw} ${cx} ${cy + a}L${cx} ${cy + b}A${b} ${b} 0 0 ${1 - sw} ${cx} ${cy - b}Z" fill="${f}" ${u.sk(2)}/>`; };
  const draw = (t, id) => { const o = [], heat = sm(.15, .2, t) - sm(.55, .6, t), cool = sm(.56, .62, t) - sm(.8, .84, t), spin = t >= .15 && t < .8, th = spin ? (t - .15) * 1500 : 0, melt = sm(.2, .52, t), open = t < .15 ? (1 - sm(.1, .15, t)) * .22 : sm(.82, .92, t), dx = open * 2.2, col = mix(K.hot, K.mat, sm(.58, .78, t));
   o.push(`<defs><clipPath id="rmc${id}"><circle cx="${X(0)}" cy="${Y(0)}" r="${2.3 * 22}"/></clipPath></defs>`);
   o.push(R(-9.6, 9.6, -5.6, 5.6, mix('#ffffff', '#fbd9d2', heat), 10, 1.5).replace('stroke-width="1.5"', 'stroke-width="1.5" stroke-dasharray="6 5"'));
   if (cool > .05) o.push(R(-9.6, 9.6, -5.6, 5.6, K.cool, 10, 0).replace(/stroke="[^"]*"/, `stroke="none" opacity="${(cool * .28).toFixed(2)}"`));
   if (heat > .5) [-7.6, 7.6].forEach((x) => [-3, 0, 3].forEach((y) => o.push(R(x - .3, x + .3, y - 1, y + 1, 'hot', 4))));
   if (cool > .5) [[-7.6, 3], [7.6, 3], [-7.6, -3], [7.6, -3]].forEach((q) => o.push(AR(q[0], q[1], q[0] * .55, q[1] * .55, 'cool')));
   o.push(R(-9.6, -3, -.25, .25, 'dark'), R(3, 9.6, -.25, .25, 'dark'));
   o.push(`<g transform="rotate(${(th % 360).toFixed(1)} ${X(0)} ${Y(0)})">`, half(1, dx, 2.7, 2.3, K.steel), half(-1, dx, 2.7, 2.3, K.steel));
   [1, -1].forEach((sg) => [1, -1].forEach((m) => o.push(R(sg * dx + (sg > 0 ? 0 : -.35), sg * dx + (sg > 0 ? .35 : 0), m > 0 ? 2.7 : -3.4, m > 0 ? 3.4 : -2.7, 'dark', 2)))); o.push('</g>');
   if (melt > 0 && t < .82) o.push(`<circle cx="${X(0)}" cy="${Y(0)}" r="${(2.3 - melt * .16) * 22}" fill="none" stroke="${col}" stroke-width="${(melt * 7).toFixed(1)}"/>`);
   if (t >= .82) o.push(`<circle cx="${X(0)}" cy="${Y(0)}" r="${2.12 * 22}" fill="#fff" stroke="${K.mat}" stroke-width="7"/><circle cx="${X(0)}" cy="${Y(0)}" r="${2.28 * 22}" fill="none" ${u.sk(1.5)}/><circle cx="${X(0)}" cy="${Y(0)}" r="${1.96 * 22}" fill="none" ${u.sk(1.5)}/>`);
   if (t < .5) { const lvl = (1 - melt) * 1.1; o.push(`<g clip-path="url(#rmc${id})"><rect x="${X(-2.4)}" y="${Y(-2.3 + lvl)}" width="${4.8 * 22}" height="${(lvl * 22).toFixed(1)}" fill="${K.mat}" stroke="${K.ink}" stroke-width="1.2"/></g>`); }
   if (spin) o.push(ROT(0, 0, 3.9, 205, 245), ROT(0, 0, 3.9, 25, 65), `<ellipse cx="${X(-6)}" cy="${Y(0)}" rx="9" ry="26" fill="none" stroke="${K.ink2}" stroke-width="3"/>`, AR(-5.62, .9, -5.6, 1.25), T(0, -4.9, 'turning about two axes', 12, 'middle', 'ink2'));
   if (t < .1) o.push(AR(0, 4.6, 0, 2.2), T(1.9, 4.2, 'powder in', 12, 'start', 'ink2')); if (heat > .5) o.push(T(0, 4.8, 'oven', 12)); if (cool > .5) o.push(T(0, 4.8, 'cooling', 12, 'middle', 'ink2'));
   return o.join(''); };
  ANIMS['rotational-moulding'] = { stages: ST, draw, w: W, h: H, start: .36 }; }

 /* ---- compression moulding ---- */
 { const u = U2(22, 220, 150), { X, Y, R, PG, C, AR, T } = u, W = 440, H = 310;
  const ST = [[0, .2, 'Load the charge', 'A weighed amount of thermosetting polymer, called the charge or preform, is placed in the heated lower half of the mould.'],
   [.2, .42, 'Close', 'The upper half of the mould is pressed down. Heat and pressure make the charge soften and flow to fill the cavity.'],
   [.42, .7, 'Cure', 'The mould is held closed. Cross-links form between the polymer chains, so the thermoset sets hard and can never be remelted.'],
   [.7, 1, 'Open and eject', 'The mould opens and an ejector pin pushes the moulding out while it is still hot. The thin flash round the edge is trimmed off.', .9]];
  const outer = [[-2.5, -.5], [-2, -2.5], [2, -2.5], [2.5, -.5]], inner = [[2.1, -.5], [1.6, -2.1], [-1.6, -2.1], [-2.1, -.5]];
  const draw = (t, id) => { const o = [], h = 'cmh' + id, close = t < .5 ? sm(.2, .4, t) : 1 - sm(.7, .82, t), uy = (1 - close) * 3.6, flow = sm(.3, .4, t), cure = sm(.42, .7, t), ej = sm(.84, .94, t) * 1.8, col = mix(K.mat, '#b5651d', cure), drop = sm(.02, .14, t);
   o.push(`<defs>${u.hatchDef(h)}</defs>`, R(-6, 6, -5.6, -4.6, 'dark', 3), R(-.9, .9, 4.2 + uy * .0, 6.6, 'steel'), R(-6, 6, 6.2, 6.8, 'dark', 3));
   const low = [[-4.4, -4.6], [4.4, -4.6], [4.4, -.5], [2.5, -.5], [2, -2.5], [-2, -2.5], [-2.5, -.5], [-4.4, -.5]], up = [[-4.4, -.5], [-2.1, -.5], [-1.6, -2.1], [1.6, -2.1], [2.1, -.5], [4.4, -.5], [4.4, 2.6], [-4.4, 2.6]];
   o.push(PG(low, 'steel'), PG(low, `url(#${h})`, 0), R(-.2, .2, -4.6 + ej, -2.5 + ej, 'pale', 0, 1.3));
   [[-3.4, -1.6], [-3.4, -3.4], [3.4, -1.6], [3.4, -3.4], [0, -3.6]].forEach((c) => o.push(C(c[0], c[1], .22, 'hot', 1.3)));
   if (t < .3 || flow < 1 && t < .5) { const w = .9 + flow * .9, hh = 1 - flow * .55, y0 = -2.5 + (1 - drop) * 4; if (flow < .98) o.push(R(-w, w, y0, y0 + hh, K.mat, 5)); }
   if (flow > .5 && t < .99) o.push(PG(outer.concat(inner), col, 2, 0, ej)); if (flow > .5 && close > .9) o.push(R(-3, -2.5, -.56, -.44, col, 0, 1), R(2.5, 3, -.56, -.44, col, 0, 1));
   o.push(PG(up, 'steel', 2, 0, uy), PG(up, `url(#${h})`, 0, 0, uy), R(-.9, .9, 2.6 + uy, 6.2, 'steel')); [[-3.4, 1.4], [3.4, 1.4], [0, 1.4]].forEach((c) => o.push(C(c[0], c[1] + uy, .22, 'hot', 1.3)));
   if (t >= .2 && t < .42) o.push(AR(5.4, 4.6, 5.4, 2.4)); if (t >= .42 && t < .7) o.push(T(0, -6.2, 'heat and pressure held', 12, 'middle', 'ink2')); if (t >= .7 && t < .84) o.push(AR(5.4, 2.4, 5.4, 4.6)); if (t >= .84) o.push(AR(.9, -4, .9, -3));
   return o.join(''); };
  ANIMS['compression-moulding'] = { stages: ST, draw, w: W, h: H, start: .5 }; }

 /* ---- press forming (deep drawing) ---- */
 { const u = U2(22, 220, 130), { X, Y, R, PG, PL, AR, T } = u, W = 440, H = 300;
  const ST = [[0, .12, 'Place the blank', 'A flat sheet of ductile metal, the blank, is placed over the opening in the die.'],
   [.12, .28, 'Clamp', 'The blank holder (pressure pad) comes down on the edge of the blank. It stops the sheet wrinkling but still lets it slide inwards.'],
   [.28, .62, 'Draw', 'The punch pushes the sheet down into the die. The metal is stretched beyond its elastic limit, so it keeps the new shape.'],
   [.62, .8, 'Withdraw', 'The punch and blank holder lift clear.'],
   [.8, 1, 'Eject', 'An ejector lifts the pressing out of the die. The flange is trimmed if it is not needed.', .92]];
  const draw = (t, id) => { const o = [], h = 'pfh' + id, hold = t < .5 ? sm(.12, .26, t) : 1 - sm(.62, .74, t), d = sm(.28, .6, t) * 2.6, pun = t < .62 ? d : 2.6 - sm(.62, .78, t) * 5, ej = sm(.82, .96, t) * 2.9, w = 4.3 - d * .42;
   o.push(`<defs>${u.hatchDef(h)}</defs>`, R(-6, 6, -5.2, -4.4, 'dark', 3));
   [1, -1].forEach((m) => { const q = [[1.95 * m, 0], [5.2 * m, 0], [5.2 * m, -4.4], [1.95 * m, -4.4]]; o.push(PG(q, 'steel'), PG(q, `url(#${h})`, 0)); });
   o.push(R(-1.8, 1.8, -3.5 + ej, -3.1 + ej, 'pale'), R(-.25, .25, -4.4, -3.5 + ej, 'pale', 0, 1.3));
   const y = .1 + ej, sheet = [[-w, y], [-1.92, y], [-1.76, y - d], [1.76, y - d], [1.92, y], [w, y]]; o.push(PL(sheet, 7, K.ink), PL(sheet, 4.2, '#7fa3c9'));
   [1, -1].forEach((m) => o.push(R(m > 0 ? 2.25 : -5.2, m > 0 ? 5.2 : -2.25, .25 + (1 - hold) * 2.4, 1.3 + (1 - hold) * 2.4, 'dark', 2)));
   o.push(R(-1.6, 1.6, .22 - pun + (t < .28 ? 2.6 * (1 - sm(.14, .28, t)) : 0), 5.4, 'steel', 6), T(0, 4, 'punch', 12));
   o.push(T(-3.8, -2.4, 'die', 12), T(3.8, -2.4, 'die', 12)); if (t >= .12 && t < .28) o.push(AR(-5.6, 3.4, -5.6, 1.6), AR(5.6, 3.4, 5.6, 1.6)); if (t >= .28 && t < .62) o.push(AR(2.4, 5, 2.4, 3)); if (t >= .82) o.push(AR(.9, -4.3, .9, -3.3));
   return o.join(''); };
  ANIMS['press-forming'] = { stages: ST, draw, w: W, h: H, start: .46 }; }

 /* ---- sand casting ---- */
 { const u = U2(22, 280, 150), { X, Y, R, PG, AR, T } = u, W = 560, H = 310;
  const ST = [[0, .1, 'The mould is ready', 'The pattern has been taken out, leaving a cavity in the packed sand. The top box (cope) sits on the bottom box (drag).'],
   [.1, .5, 'Pour', 'Molten metal is poured into the pouring basin. It runs down the runner (sprue) and through the gate, fills the cavity and rises up the riser.'],
   [.5, .75, 'Solidify', 'The metal cools and shrinks. The riser holds extra molten metal to feed the casting as it shrinks, and lets air and gases escape.'],
   [.75, 1, 'Break out', 'The sand mould is broken away, so a new mould is needed for every casting. The runner and riser are cut off and the casting is cleaned up (fettling).', .92]];
  const chan = [[[-5.9, 3.5], [-4.7, 3.5], [-5, 2.6], [-5, -.5], [-3, -.5], [-3, -1], [-5.6, -1], [-5.6, 2.6]], [[-3, -1.5], [3, -1.5], [3, 1], [-3, 1]], [[3, -1], [5, -1], [5, 3.5], [4.2, 3.5], [4.2, -.5], [3, -.5]]];
  let seed = 3; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }; const spk = Array.from({ length: 150 }, () => [-7.7 + rnd() * 15.4, -3.3 + rnd() * 6.6]);
  const draw = (t, id) => { const o = [], pour = sm(.1, .14, t) - sm(.46, .5, t), lvl = -1.6 + sm(.16, .48, t) * 5.1, col = mix(K.hot, K.cast, sm(.5, .75, t)), gone = sm(.76, .9, t), op = (1 - gone).toFixed(2);
   o.push(`<defs><clipPath id="scl${id}"><rect x="0" y="${Y(lvl)}" width="${W}" height="${H}"/></clipPath></defs>`);
   o.push(`<g opacity="${op}">`, R(-8, 8, -3.5, 0, 'sand'), R(-8, 8, 0, 3.5, 'sand'), spk.map((s) => `<circle cx="${X(s[0])}" cy="${Y(s[1])}" r="1" fill="${K.ink}" opacity=".3"/>`).join(''), R(-8.4, -8, -3.5, 3.5, 'dark'), R(8, 8.4, -3.5, 3.5, 'dark'), R(-9, 9, -4.1, -3.5, 'dark', 3));
   chan.forEach((c) => o.push(PG(c, '#fff', 1.5))); o.push('</g>');
   if (t >= .14) o.push(`<g clip-path="url(#scl${id})">` + chan.map((c) => PG(c, col, gone > 0 ? 2 : 1.5)).join('') + '</g>');
   if (pour > .01) { o.push(`<g transform="rotate(${(38 * pour).toFixed(1)} ${X(-7.4)} ${Y(5)})">` + PG([[-9.6, 6], [-7.3, 6], [-7.6, 4.3], [-9.3, 4.3]], 'dark') + PG([[-9.4, 5.7], [-7.5, 5.7], [-7.7, 4.5], [-9.2, 4.5]], K.hot, 1.2) + '</g>'); if (pour > .9) o.push(R(-5.5, -5.15, Math.max(lvl, -1), 4.4, K.hot, 0, 0).replace(/stroke="[^"]*"/, 'stroke="none"')); }
   if (gone < .5) o.push(T(-6.9, .45, 'cope', 11), T(-6.9, -.75, 'drag', 11), T(0, 1.6, 'cavity', 11), T(2.6, 2.6, 'riser', 11), T(-3.4, 2.2, 'runner', 11)); if (t >= .5 && t < .75) o.push(AR(4.6, 4.9, 4.6, 6.2, 'ink'), T(6.3, 5.4, 'gases', 11));
   if (gone > .9) o.push(T(0, -2.6, 'casting, with the runner and riser still attached', 12));
   return o.join(''); };
  ANIMS['sand-casting'] = { stages: ST, draw, w: W, h: H, start: .34 }; }
})();
