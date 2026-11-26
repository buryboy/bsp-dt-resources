/* Materials, forces and testing */
(() => { const { r, c, e, p, l, a, rot, t, hatch, dots } = D;
const axes = (x0, y0, x1, y1, xl, yl) => l(x0, y0, x0, y1, 2.5) + l(x0, y0, x1, y0, 2.5) + t((x0 + x1) / 2, y0 + 34, xl, 14) + `<g transform="rotate(-90 ${x0 - 30} ${(y0 + y1) / 2})">${t(x0 - 30, (y0 + y1) / 2, yl, 14)}</g>`;

DIAGRAMS['forces'] = { t: 'The five forces', w: 720, h: 250,
 svg: [['Tension', 0], ['Compression', 1], ['Bending', 2], ['Torsion', 3], ['Shear', 4]].map(([n, i]) => { const x = 20 + i * 140, cx = x + 64; let o = t(cx, 228, n, 15);
   if (i === 0) o += r(x + 34, 96, 60, 30, 'steel') + a(x + 34, 111, x + 4, 111) + a(x + 94, 111, x + 124, 111);
   if (i === 1) o += r(x + 34, 96, 60, 30, 'steel') + a(x + 4, 111, x + 32, 111) + a(x + 124, 111, x + 96, 111);
   if (i === 2) o += p(`M${x + 6} 100 Q${cx} 140 ${x + 122} 100 L${x + 122} 116 Q${cx} 158 ${x + 6} 116 Z`, 'steel') + a(cx, 50, cx, 104) + p(`M${x + 2} 150 l10 -18 l10 18 Z`, 'dark') + p(`M${x + 106} 150 l10 -18 l10 18 Z`, 'dark');
   if (i === 3) o += r(x + 24, 96, 80, 30, 'steel') + rot(x + 24, 111, 28, 60, 300) + rot(x + 104, 111, 28, 240, 120).replace(/1 1 /, '1 0 ');
   if (i === 4) o += r(x + 14, 84, 60, 26, 'steel') + r(x + 54, 110, 60, 26, 'steel') + a(x + 4, 97, x + 40, 97) + a(x + 124, 123, x + 88, 123);
   return o; }).join('') };

DIAGRAMS['stress-strain'] = { t: 'Stress–strain graph for a ductile metal (such as low carbon steel)', w: 680, h: 400,
 svg: axes(90, 330, 640, 40, 'Strain (extension ÷ original length)', 'Stress (force ÷ area)') +
  p('M90 330 L210 150 Q224 132 250 140 L270 144 Q380 60 470 62 Q540 66 580 110', 'none', 4).replace('stroke="#1f2328"', 'stroke="#3b5bdb"') +
  l(210, 150, 210, 330, 1.2, '5 5') + l(470, 62, 470, 330, 1.2, '5 5') + [[210, 150], [250, 140], [470, 62], [580, 110]].map(([x, y]) => c(x, y, 5, 'hot')).join('') +
  t(150, 318, 'elastic region', 12) + t(340, 318, 'plastic region', 12) + t(530, 318, 'necking', 12),
 parts: [[130, 200, 'Straight line: stress is proportional to strain (Hooke’s law). The gradient is Young’s modulus (stiffness)', 160, 226], [170, 110, 'Elastic limit: beyond here it will not return to its original length', 208, 148], [300, 190, 'Yield point: it stretches with little extra force', 252, 142],
  [470, 30, 'Ultimate tensile strength (UTS): the maximum stress', 470, 60], [620, 80, 'Fracture', 582, 108], [380, 130, 'Plastic deformation and work hardening', 370, 84]] };

DIAGRAMS['tensile-test'] = { t: 'Tensile test', w: 560, h: 420,
 svg:
  r(120, 20, 320, 30, 'dark') + r(120, 370, 320, 30, 'dark') + r(130, 50, 24, 320, 'steel') + r(406, 50, 24, 320, 'steel') +   // frame
  r(154, 110, 252, 26, 'steel') + a(280, 104, 280, 60) +                                                     // moving crosshead
  r(250, 136, 60, 40, 'dark') + r(250, 300, 60, 40, 'dark') + r(240, 340, 80, 30, 'pale') +                 // grips and load cell
  p('M262 176 L298 176 L298 196 L288 206 L288 270 L298 280 L298 300 L262 300 L262 280 L272 270 L272 206 L262 196 Z', 'mat') + // dog-bone specimen
  l(266, 215, 294, 215, 3) + l(266, 261, 294, 261, 3) + r(330, 208, 60, 60, 'pale', 4) + l(294, 238, 330, 238, 2),            // gauge marks, extensometer
 parts: [[60, 123, 'Moving crosshead pulls the specimen', 156, 123], [60, 156, 'Grips (jaws)', 252, 156], [60, 240, 'Test piece of standard size', 274, 240], [500, 215, 'Gauge length', 296, 215], [500, 260, 'Extensometer measures the extension', 388, 250], [500, 355, 'Load cell measures the force', 318, 355]] };

DIAGRAMS['hardness-test'] = { t: 'Hardness tests: an indenter is pressed into the surface', w: 720, h: 300,
 svg: [['Brinell', 'hardened steel ball', 0], ['Vickers', 'diamond pyramid', 1], ['Rockwell', 'diamond cone or ball', 2]].map(([n, s, i]) => { const x = 40 + i * 230, cx = x + 100; let o = t(cx, 270, n, 16) + t(cx, 290, s, 12, 'middle', '#5b6478', false) + r(x + 20, 170, 160, 60, 'steel') + a(cx, 24, cx, 70) + r(cx - 16, 70, 32, 60, 'dark');
   if (i === 0) o += c(cx, 152, 26, 'pale') + p(`M${cx - 22} 170 A26 26 0 0 0 ${cx + 22} 170 Z`, 'paper', 1.2);
   if (i === 1) o += p(`M${cx - 26} 130 L${cx + 26} 130 L${cx} 184 Z`, 'pale') + p(`M${cx - 7} 170 L${cx + 7} 170 L${cx} 184 Z`, 'paper', 1.2);
   if (i === 2) o += p(`M${cx - 18} 130 L${cx + 18} 130 L${cx + 4} 180 Q${cx} 186 ${cx - 4} 180 Z`, 'pale');
   return o; }).join('') + t(360, 16, 'A smaller or shallower dent means a harder material', 13, 'middle', '#5b6478', false) };

DIAGRAMS['impact-test'] = { t: 'Izod impact test (toughness)', w: 600, h: 400,
 svg:
  r(60, 350, 480, 24, 'dark') + r(280, 40, 24, 310, 'steel') + c(292, 70, 14, 'dark') +                    // base, column, pivot
  l(292, 70, 130, 150, 6) + p('M100 128 L150 138 L134 184 L88 172 Z', 'dark') +                              // pendulum raised
  l(292, 70, 292, 250, 3, '6 6') + c(292, 270, 22, 'none', 1.5, '6 6') + l(292, 70, 420, 180, 3, '6 6') +   // swing-through positions
  p('M150 190 Q220 290 290 292', 'none', 0) + rot(292, 70, 190, 150, 96) +
  r(250, 310, 84, 40, 'steel') + r(284, 262, 16, 60, 'mat') + p('M284 300 l6 4 l-6 4', 'none', 1.5) +       // vice and notched specimen
  p('M330 50 A120 120 0 0 1 400 150', 'none', 2) + l(292, 70, 372, 92, 2).replace('stroke="#1f2328"', 'stroke="#e4594d"') + t(430, 96, 'scale', 12),
 parts: [[70, 100, 'Pendulum hammer released from a set height', 112, 150], [200, 40, 'Pivot', 284, 68], [470, 290, 'Notched test piece held upright in a vice', 300, 290], [470, 220, 'Height of the swing after the break', 414, 176],
  [520, 130, 'Scale shows the energy absorbed: a tough material absorbs more, so the swing is lower', 396, 140]] };

DIAGRAMS['timber-conversion'] = { t: 'Converting a log: plain sawn and quarter sawn', w: 640, h: 300,
 svg: [0, 1].map((i) => { const cx = 170 + i * 300, cy = 130; let o = c(cx, cy, 100, 'wood') + [78, 56, 34, 14].map((q) => c(cx, cy, q, 'none', 1)).join('');
   if (i === 0) o += [-66, -33, 0, 33, 66].map((d) => l(cx - Math.sqrt(10000 - d * d), cy + d, cx + Math.sqrt(10000 - d * d), cy + d, 2.5)).join('');
   else o += l(cx - 100, cy, cx + 100, cy, 2.5) + l(cx, cy - 100, cx, cy + 100, 2.5) + [24, 48, 72].map((d) => l(cx + d, cy - Math.sqrt(10000 - d * d), cx + d, cy, 2) + l(cx - d, cy, cx - d, cy + Math.sqrt(10000 - d * d), 2) + l(cx, cy + d, cx + Math.sqrt(10000 - d * d), cy + d, 2) + l(cx - Math.sqrt(10000 - d * d), cy - d, cx, cy - d, 2)).join('');
   return o + t(cx, 262, i ? 'Quarter sawn' : 'Plain sawn (through and through)', 15) + t(cx, 284, i ? 'stable, attractive grain; slower, more waste' : 'quick, cheap, little waste; boards may cup', 12, 'middle', '#5b6478', false); }).join('') };

DIAGRAMS['manufactured-boards'] = { t: 'Manufactured boards in section', w: 700, h: 250,
 svg: [['Plywood', 0], ['Blockboard', 1], ['Chipboard', 2], ['MDF', 3]].map(([n, i]) => { const x = 20 + i * 172; let o = t(x + 75, 226, n, 15);
   if (i === 0) o += [0, 1, 2, 3, 4].map((k) => r(x, 70 + k * 18, 150, 18, k % 2 ? 'sand' : 'wood') + (k % 2 ? dots(x + 6, 74 + k * 18, 138, 10, 'wood', 10, k + 2) : [20, 60, 100, 130].map((q) => l(x + q, 79 + k * 18, x + q + 16, 79 + k * 18, 1)).join(''))).join('');
   if (i === 1) o += r(x, 70, 150, 90, 'wood') + [0, 1, 2, 3, 4].map((k) => r(x + k * 30, 84, 30, 62, 'sand')).join('') + r(x, 70, 150, 14, 'wood') + r(x, 146, 150, 14, 'wood');
   if (i === 2) o += r(x, 70, 150, 90, 'sand') + Array.from({ length: 34 }, (_, k) => { const px = x + 8 + (k * 37) % 134, py = 78 + (k * 23) % 74; return l(px, py, px + 12, py + (k % 3) * 3 - 3, 2.5).replace('stroke="#1f2328"', 'stroke="#b08a52"'); }).join('') + r(x, 70, 150, 90, 'none');
   if (i === 3) o += r(x, 70, 150, 90, 'wood') + Array.from({ length: 120 }, (_, k) => `<circle cx="${x + 5 + (k * 53) % 140}" cy="${74 + (k * 29) % 82}" r="1" fill="#b08a52"/>`).join('');
   return o; }).join('') + t(86, 40, 'veneers, grain at 90°', 12, 'middle', '#5b6478', false) + t(258, 40, 'softwood strips, veneer faces', 12, 'middle', '#5b6478', false) + t(430, 40, 'wood chips and resin', 12, 'middle', '#5b6478', false) + t(602, 40, 'fine fibres and resin', 12, 'middle', '#5b6478', false) };

const weave = (x, y, kind) => { let o = '', n = 6, s = 22; const over = (i, j) => kind === 0 ? (i + j) % 2 === 0 : kind === 1 ? ((i - j) % 4 + 4) % 4 < 2 : ((i * 2 + j) % 5 === 0);
  for (let i = 0; i < n; i++) o += r(x + i * s + 4, y, 14, n * s, 'cool', 0, 1.2);
  for (let j = 0; j < n; j++) { o += r(x, y + j * s + 4, n * s + 8, 14, 'mat', 0, 1.2); for (let i = 0; i < n; i++) if (over(i, j)) o += r(x + i * s + 4, y + j * s + 2, 14, 18, 'cool', 0, 1.2); }
  return o; };
DIAGRAMS['weaves'] = { t: 'Woven fabric structures', w: 660, h: 240,
 svg: [['Plain weave', 'over one, under one', 0], ['Twill weave', 'diagonal lines: denim', 1], ['Satin weave', 'long floats: smooth, shiny', 2]].map(([n, s, i]) => weave(50 + i * 210, 40, i) + t(120 + i * 210, 200, n, 15) + t(120 + i * 210, 220, s, 12, 'middle', '#5b6478', false)).join('') + t(24, 110, 'weft', 12, 'middle', '#b06a00') + t(120, 28, 'warp', 12, 'middle', '#2a6fb0') };

DIAGRAMS['composite-layup'] = { t: 'Laying up a fibre-reinforced composite (GRP or CFRP)', w: 660, h: 320,
 svg:
  p('M80 250 L580 250 L560 280 L100 280 Z', 'dark') + p('M120 250 Q330 110 540 250 Z', 'steel') +          // mould
  p('M112 250 Q330 98 548 250', 'none', 3).replace('stroke="#1f2328"', 'stroke="#86bdea"') +                // release agent / gel coat
  p('M104 250 Q330 86 556 250', 'none', 7, '10 4').replace('stroke="#1f2328"', 'stroke="#3b3f46"') +        // fibre mat
  p('M96 250 Q330 74 564 250', 'none', 5).replace('stroke="#1f2328"', 'stroke="#f4a53f"') +                 // resin
  r(404, 96, 70, 20, 'pale', 10) + l(440, 96, 480, 50, 4) + rot(439, 106, 20, 200, 340) + r(40, 200, 50, 50, 'pale', 4) + r(46, 222, 38, 26, 'mat', 0, 0),
 parts: [[60, 150, 'Mould (former), polished and waxed', 180, 220], [200, 60, 'Release agent, then gel coat for a smooth outer surface', 232, 200], [330, 40, 'Fibre mat: glass or carbon fibre gives the strength', 330, 166],
  [560, 90, 'Roller removes trapped air and works the resin in', 470, 106], [600, 190, 'Resin (polyester or epoxy) bonds the fibres and sets hard', 520, 204], [40, 290, 'Resin mixed with hardener', 64, 236]] };
})();
