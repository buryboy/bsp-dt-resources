/* Diagram kit: every diagram in the revision apps is drawn with these helpers, so they all share one look.
   A diagram is DIAGRAMS[id] = { t: title, w, h, svg: '...', parts: [[markerX, markerY, 'Label', targetX, targetY], ...] }.
   The engine adds the numbered markers and leader lines, so the same drawing serves as a labelled figure,
   a label-the-diagram activity and a model sketch. A process shown in steps has stages: [[svg, caption], ...] instead.
   Colours are written into each shape (not CSS classes) so the diagrams also come out in the saved PDF. */
const DIAGRAMS = {};
const D = (() => {
  const ink = '#1f2328', K = { ink, steel: '#cfd5dc', dark: '#98a2b0', mat: '#f4a53f', hot: '#e4594d', cool: '#86bdea', wood: '#dfc08f', paper: '#ffffff', green: '#8cc79a', sand: '#ead9a6', pale: '#eef1f4', ink2: '#3b5bdb', yellow: '#f6d75a' };
  const n = (v) => Math.round(v * 10) / 10;
  const st = (w) => `stroke="${ink}" stroke-width="${w == null ? 2 : w}" stroke-linejoin="round" stroke-linecap="round"`;
  const r = (x, y, w, h, f, rx, sw) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx || 0}" fill="${K[f] || f || 'none'}" ${st(sw)}/>`;
  const c = (x, y, rad, f, sw) => `<circle cx="${x}" cy="${y}" r="${rad}" fill="${K[f] || f || 'none'}" ${st(sw)}/>`;
  const e = (x, y, rx, ry, f, sw) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${K[f] || f || 'none'}" ${st(sw)}/>`;
  const p = (d, f, sw, dash) => `<path d="${d}" fill="${K[f] || f || 'none'}" ${st(sw)}${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
  const l = (x1, y1, x2, y2, sw, dash) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${st(sw)}${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
  // an arrow showing movement or flow; col defaults to blue so it is never mistaken for part of the machine
  const a = (x1, y1, x2, y2, col, sw) => { col = K[col] || col || K.ink2; sw = sw || 3; const an = Math.atan2(y2 - y1, x2 - x1), s = 11, bx = x2 - Math.cos(an) * s, by = y2 - Math.sin(an) * s;
    return `<line x1="${n(x1)}" y1="${n(y1)}" x2="${n(bx)}" y2="${n(by)}" stroke="${col}" stroke-width="${sw}" stroke-linecap="round"/><polygon points="${n(x2)},${n(y2)} ${n(bx - Math.sin(an) * 6)},${n(by + Math.cos(an) * 6)} ${n(bx + Math.sin(an) * 6)},${n(by - Math.cos(an) * 6)}" fill="${col}"/>`; };
  // a curved arrow for rotation: centre, radius, start and end angle in degrees (clockwise positive on screen)
  const rot = (cx, cy, rad, a0, a1, col) => { col = K[col] || col || K.ink2; const q = (d) => [cx + rad * Math.cos(d * Math.PI / 180), cy + rad * Math.sin(d * Math.PI / 180)], s = q(a0), en = q(a1), big = Math.abs(a1 - a0) > 180 ? 1 : 0, sweep = a1 > a0 ? 1 : 0, t = (a1 + (sweep ? 90 : -90)) * Math.PI / 180, bx = en[0] - Math.cos(t) * 10, by = en[1] - Math.sin(t) * 10;
    return `<path d="M${n(s[0])} ${n(s[1])}A${rad} ${rad} 0 ${big} ${sweep} ${n(en[0])} ${n(en[1])}" fill="none" stroke="${col}" stroke-width="3" stroke-linecap="round"/><polygon points="${n(en[0] + Math.cos(t) * 3)},${n(en[1] + Math.sin(t) * 3)} ${n(bx - Math.sin(t) * 6)},${n(by + Math.cos(t) * 6)} ${n(bx + Math.sin(t) * 6)},${n(by - Math.cos(t) * 6)}" fill="${col}"/>`; };
  const t = (x, y, s, size, anchor, col, bold) => `<text x="${x}" y="${y}" font-family="Arial, Helvetica, sans-serif" font-size="${size || 15}" text-anchor="${anchor || 'middle'}" fill="${K[col] || col || ink}"${bold === false ? '' : ' font-weight="600"'}>${s}</text>`;
  // diagonal hatching inside a rectangle, used for cut sections of moulds and dies
  const hatch = (x, y, w, h, gap) => { let o = ''; gap = gap || 12; for (let k = -h; k < w; k += gap) { const x1 = Math.max(x, x + k), y1 = y + (k < 0 ? -k : 0), x2 = Math.min(x + w, x + k + h), y2 = y + Math.min(h, w - k); if (x2 > x1) o += `<line x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2)}" y2="${n(y2)}" stroke="${ink}" stroke-width="0.8" opacity=".45"/>`; } return o; };
  // little circles for granules or powder inside a box
  const dots = (x, y, w, h, f, count, seed) => { let o = '', s = seed || 7; const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; for (let k = 0; k < (count || 30); k++) o += `<circle cx="${n(x + rnd() * w)}" cy="${n(y + rnd() * h)}" r="3.2" fill="${K[f] || f}" stroke="${ink}" stroke-width="1"/>`; return o; };
  return { K, r, c, e, p, l, a, rot, t, hatch, dots };
})();
