/* Offset lithography running. See 01-motion-kit.js for the format. */
(() => {
 const u = U2(22, 230, 196), { X, Y, R, PG, C, AR, T } = u, K = D.K, W = 460, H = 350, INK = '#2b4fa8', P = Math.PI;
 const arc = (cx, cy, r, a0, a1, col, w) => { const q = (a) => [X(cx + r * Math.cos(a)), Y(cy + r * Math.sin(a))], s = q(a0), e = q(a1); return `<path d="M${s[0]} ${s[1]}A${r * 22} ${r * 22} 0 ${Math.abs(a1 - a0) > P ? 1 : 0} ${a1 > a0 ? 0 : 1} ${e[0]} ${e[1]}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="butt"/>`; };
 const spoke = (cx, cy, r, a) => `<line x1="${X(cx)}" y1="${Y(cy)}" x2="${X(cx + r * Math.cos(a))}" y2="${Y(cy + r * Math.sin(a))}" stroke="${K.ink}" stroke-width="1.6" opacity=".6"/>`;
 const num = (x, y, n) => FIGX.still ? '' : `<circle cx="${X(x)}" cy="${Y(y)}" r="11" fill="${K.ink2}" stroke="#fff" stroke-width="1.5"/><text x="${X(x)}" y="${Y(y) + 4.5}" font-family="Arial,sans-serif" font-size="12.5" font-weight="700" text-anchor="middle" fill="#fff">${n}</text>`;
 const draw = (t, id) => { const o = [], th = 2 * P * t, half = .87;
  o.push(`<defs><clipPath id="olp${id}"><rect x="${X(0)}" y="0" width="${W}" height="${H}"/></clipPath></defs>`);
  // ink duct and water trough, with their roller trains
  o.push(PG([[2.9, 7.9], [5.3, 7.9], [4.9, 6.2], [3.2, 6.2]], INK), PG([[-2.9, 7.9], [-5.3, 7.9], [-4.9, 6.2], [-3.2, 6.2]], 'cool'));
  [[1.67, 5.99, 1], [2.59, 6.76, -1], [3.79, 6.76, 1]].forEach((c) => { o.push(C(c[0], c[1], .6, '#7f95cf'), spoke(c[0], c[1], .6, c[2] * th * 3.33), C(-c[0], c[1], .6, 'cool'), spoke(-c[0], c[1], .6, -c[2] * th * 3.33 + 1)); });
  // the three cylinders
  o.push(C(0, 4, 2, 'steel'), spoke(0, 4, 2, 1.5 * P - th + P), arc(0, 4, 2, 1.5 * P - th - half, 1.5 * P - th + half, INK, 7), C(0, 4, .3, 'dark'));
  o.push(C(0, 0, 2, '#b9d3c0'), spoke(0, 0, 2, .5 * P + th + P), arc(0, 0, 2, .5 * P + th - half, .5 * P + th + half, INK, 7), C(0, 0, .3, 'dark'));
  o.push(C(0, -4.1, 2, 'steel'), spoke(0, -4.1, 2, -th), C(0, -4.1, .3, 'dark'));
  // paper passing through the nip, printed after it
  o.push(R(-10.2, 10.2, -2.1, -2, '#fff', 0, 1.5), `<g clip-path="url(#olp${id})">`);
  [-1, 0, 1].forEach((k) => { const c = (t - .5 + k) * 4 * P; o.push(`<rect x="${X(c - 2 * half)}" y="${Y(-1.9) - 5}" width="${(4 * half * 22).toFixed(1)}" height="6" fill="${INK}"/>`); }); o.push('</g>');
  o.push(T(0, 4.9, 'plate', 12), T(0, .9, 'blanket', 12), T(0, -5.1, 'impression', 12), T(-7.6, -1.5, 'paper in', 12), AR(-9.4, -3, -6.4, -3), T(7.4, -1.2, 'printed', 12));
  o.push(num(-5.9, 6.2, 1), num(5.9, 6.2, 2), num(-3, 2.2, 3), num(3.2, -3.4, 4));
  return o.join(''); };
 ANIMS['offset-litho'] = { loop: true, dur: 6500, w: W, h: H, draw, watch: ['Dampening rollers wet the plate. The water stays on the non-image area and is repelled by the greasy image area.', 'Ink rollers coat the plate. The oil-based ink sticks only to the image area, because oil and water do not mix.',
  'The plate cylinder transfers (offsets) the inked image on to the rubber blanket cylinder. The image on the blanket is reversed.', 'The blanket cylinder prints the image on to the paper, which is pressed against it by the impression cylinder. The plate never touches the paper, so it lasts for long runs.'] };
})();
