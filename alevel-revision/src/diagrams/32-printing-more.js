/* Flexography, gravure and screen printing in motion. See 01-motion-kit.js for the format. */
(() => {
 const K = D.K, P = Math.PI, INK = '#2b4fa8', { sm } = FIGX;
 const kit = (u) => ({ arc: (cx, cy, r, a0, a1, col, w, dash) => { const q = (a) => [u.X(cx + r * Math.cos(a)), u.Y(cy + r * Math.sin(a))], s = q(a0), e = q(a1); return `<path d="M${s[0]} ${s[1]}A${r * u.S} ${r * u.S} 0 ${Math.abs(a1 - a0) > P ? 1 : 0} ${a1 > a0 ? 0 : 1} ${e[0]} ${e[1]}" fill="none" stroke="${col}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`; },
  spoke: (cx, cy, r, a) => `<line x1="${u.X(cx)}" y1="${u.Y(cy)}" x2="${u.X(cx + r * Math.cos(a))}" y2="${u.Y(cy + r * Math.sin(a))}" stroke="${K.ink}" stroke-width="1.6" opacity=".6"/>`,
  num: (x, y, n) => FIGX.still ? '' : `<circle cx="${u.X(x)}" cy="${u.Y(y)}" r="11" fill="${K.ink2}" stroke="#fff" stroke-width="1.5"/><text x="${u.X(x)}" y="${u.Y(y) + 4.5}" font-family="Arial,sans-serif" font-size="12.5" font-weight="700" text-anchor="middle" fill="#fff">${n}</text>` });

 /* ---- flexography ---- */
 { const u = U2(22, 240, 190), { X, Y, R, PG, C, AR, T } = u, { arc, spoke, num } = kit(u), W = 480, H = 330;
  const draw = (t, id) => { const o = [], th = 2 * P * t;
   o.push(`<defs><clipPath id="fxp${id}"><rect x="${X(.3)}" y="0" width="${W}" height="${H}"/></clipPath></defs>`);
   o.push(PG([[-6.4, -2.6], [-2.6, -2.6], [-3, -5], [-6, -5]], 'pale'), PG([[-6.3, -3.2], [-2.7, -3.2], [-3, -5], [-6, -5]], INK, 0));
   o.push(C(-4.4, -3.4, 1.1, '#7f95cf'), spoke(-4.4, -3.4, 1.1, -th * 1.82), C(-2.6, -1.9, 1.2, '#aab8e0'), arc(-2.6, -1.9, 1.2, 0, 1.99 * P, INK, 3, '2 3'), spoke(-2.6, -1.9, 1.2, th * 1.67));
   o.push(`<line x1="${X(-5.6)}" y1="${Y(.6)}" x2="${X(-3.45)}" y2="${Y(-1.05)}" stroke="${K.ink}" stroke-width="4" stroke-linecap="round"/>`);
   o.push(C(.3, -.55, 2, 'steel'), spoke(.3, -.55, 1.9, -th)); [0, 1, 2].forEach((j) => { const a = P / 2 - th + j * 2.094; o.push(arc(.3, -.55, 2.06, a - .4, a + .4, '#4a5560', 7), arc(.3, -.55, 2.2, a - .4, a + .4, INK, 3)); });
   o.push(C(.3, 3.55, 2, 'steel'), spoke(.3, 3.55, 2, th), C(.3, -.55, .3, 'dark'), C(.3, 3.55, .3, 'dark'));
   o.push(R(-10.6, 10.6, 1.46, 1.56, '#fff', 0, 1.5), `<g clip-path="url(#fxp${id})">`); [0, 1, 2].forEach((k) => { const c = .3 + (((3 * t) % 1) + k) * 4.189; o.push(`<rect x="${X(c - .8)}" y="${Y(1.44)}" width="${1.6 * 22}" height="5" fill="${INK}"/>`); }); o.push('</g>');
   o.push(T(.3, 4.5, 'impression', 12), T(.3, -1.9, 'plate', 12), T(-7.6, 2.1, 'substrate in', 12), AR(-9.6, .7, -6.8, .7), T(7.6, 2.1, 'printed', 12));
   o.push(num(-7.2, -3.8, 1), num(-5.2, -.2, 2), num(3.2, -1.9, 3), num(3.2, 2.6, 4)); return o.join(''); };
  ANIMS['flexography'] = { loop: true, dur: 6000, w: W, h: H, draw, watch: ['The fountain roller turns in the ink pan and carries thin, quick-drying ink upwards.', 'The anilox roller is engraved with tiny cells that hold a measured amount of ink. A doctor blade scrapes off the extra.', 'The flexible plate has a raised image (relief). Only the raised parts touch the anilox roller and pick up ink.', 'The plate prints directly on to the substrate, which is pressed against it by the impression cylinder. Used for packaging films, labels and corrugated card.'] }; }

 /* ---- gravure ---- */
 { const u = U2(22, 240, 178), { X, Y, R, PG, C, AR, T } = u, { arc, spoke, num } = kit(u), W = 480, H = 330;
  const draw = (t, id) => { const o = [], th = 2 * P * t;
   o.push(`<defs><clipPath id="grp${id}"><rect x="${X(0)}" y="0" width="${W}" height="${H}"/></clipPath></defs>`);
   o.push(PG([[-3.8, -1.9], [3.8, -1.9], [3.4, -4.9], [-3.4, -4.9]], 'pale'), PG([[-3.72, -2.5], [3.72, -2.5], [3.4, -4.9], [-3.4, -4.9]], INK, 0));
   o.push(C(0, -1.1, 2.2, 'steel'), spoke(0, -1.1, 2.1, -th)); [0, 1].forEach((j) => { const a = P / 2 - th + j * P; o.push(arc(0, -1.1, 2.08, a - .6, a + .6, INK, 6, '3 3')); });
   o.push(`<line x1="${X(-5.2)}" y1="${Y(1.2)}" x2="${X(-1.98)}" y2="${Y(-.2)}" stroke="${K.ink}" stroke-width="4" stroke-linecap="round"/>`);
   o.push(C(0, 3.25, 2, '#b9d3c0'), spoke(0, 3.25, 2, th * 1.1), C(0, -1.1, .3, 'dark'), C(0, 3.25, .3, 'dark'));
   o.push(R(-10.6, 10.6, 1.12, 1.22, '#fff', 0, 1.5), `<g clip-path="url(#grp${id})">`); [0, 1].forEach((k) => { const c = (((2 * t) % 1) + k) * 6.91; o.push(`<rect x="${X(c - 1.3)}" y="${Y(1.1)}" width="${2.6 * 22}" height="5" fill="${INK}"/>`); }); o.push('</g>');
   o.push(T(0, 4.2, 'impression', 12), T(6.9, -1.2, 'gravure cylinder', 12), T(6.9, -3.6, 'ink trough', 12), T(-7.6, 1.8, 'paper in', 12), AR(-9.6, .4, -6.8, .4), T(7.6, 1.8, 'printed', 12));
   o.push(num(4.9, -3.6, 1), num(-6, 1.7, 2), num(3.2, 2.4, 3)); return o.join(''); };
  ANIMS['gravure'] = { loop: true, dur: 6500, w: W, h: H, draw, watch: ['The image is engraved into the copper-plated cylinder as tiny cells. As it turns in the ink trough, the cells fill with thin ink.', 'The doctor blade wipes the surface clean, so ink is left only in the cells. Deeper cells hold more ink and print darker.', 'The rubber impression roller presses the paper on to the cylinder and the ink is drawn out of the cells. The cylinders are very expensive, so gravure is used for very long, high-quality runs such as magazines and packaging.'] }; }

 /* ---- screen printing ---- */
 { const u = U2(22, 280, 120), { X, Y, R, PG, PL, AR, T } = u, W = 560, H = 250;
  const ST = [[0, .16, 'Set up', 'The substrate is placed on the bed under the screen. A stencil blocks the mesh everywhere except the image area. Ink is poured along one edge.'],
   [.16, .62, 'Pull the squeegee', 'The squeegee is pulled across the screen. It presses the mesh down on to the substrate and forces ink through the open areas of the stencil.'],
   [.62, .8, 'Lift the screen', 'The screen is lifted clear, leaving the printed image on the substrate.'],
   [.8, 1, 'Dry and repeat', 'The print is dried or cured. Each colour needs its own screen, printed one after another in register.', .9]];
  const draw = (t) => { const o = [], pull = sm(.16, .62, t), bx = -5.6 + pull * 11.2, on = t >= .16 && t < .62, lift = sm(.62, .78, t) * 2.4, done = Math.max(-3, Math.min(3, bx));
   o.push(R(-9, 9, -2.4, -1.3, 'dark', 4), R(-5, 5, -1.3, -.75, '#fff'), T(0, -2, 'bed', 12, 'middle', '#fff'));
   if (pull > 0 && done > -3) o.push(`<rect x="${X(-3)}" y="${Y(-.75) - 4}" width="${((done + 3) * 22).toFixed(1)}" height="4" fill="${INK}"/>`);
   o.push(`<g transform="translate(0 ${(-lift * 22).toFixed(1)})">`, R(-8, -7, 0, .9, 'wood'), R(7, 8, 0, .9, 'wood'));
   const dip = on ? -.72 : 0, pts = on ? [[-7, 0], [bx, dip], [7, 0]] : [[-7, 0], [7, 0]];
   o.push(PL(pts, 2, K.ink, '3 3'), PL(on ? [[-7, .05], [Math.min(bx, -3), (Math.min(bx, -3) + 7) / (bx + 7) * dip + .05]] : [[-7, .05], [-3, .05]], 5, '#3f7d55'), PL(on && bx > 3 ? [[3, dip * (7 - 3) / (7 - bx) + .05], [7, .05]] : on ? [[Math.max(3, bx), .05 + (bx > 3 ? dip : dip * (7 - 3) / (7 - bx))], [7, .05]] : [[3, .05], [7, .05]], 5, '#3f7d55'));
   if (t < .62) { const ix = on ? bx + .7 : -5; o.push(`<ellipse cx="${X(ix)}" cy="${Y((on ? dip * .6 : 0) + .25)}" rx="${on ? 12 : 16}" ry="6" fill="${INK}"/>`); }
   if (t < .62) { const sx = on ? bx : -6.2, sy = on ? dip : .5; o.push(`<g transform="rotate(${on ? 18 : 0} ${X(sx)} ${Y(sy)})">` + R(sx - .18, sx + .18, sy, sy + 1.7, '#e8c25a', 2) + R(sx - .45, sx + .45, sy + 1.7, sy + 3, 'wood', 3) + '</g>'); }
   o.push('</g>'); if (on) o.push(AR(bx + 1.6, 3.6, bx + 3.6, 3.6)); if (t >= .62 && t < .8) o.push(AR(8.6, .4, 8.6, 2.4));
   o.push(T(-7.5, -lift + 1.5, 'frame', 12), T(0, -3.2, t >= .16 ? 'the print' : 'substrate', 12));
   return o.join(''); };
  ANIMS['screen-printing'] = { stages: ST, draw, w: W, h: H, start: .4 }; }
})();
