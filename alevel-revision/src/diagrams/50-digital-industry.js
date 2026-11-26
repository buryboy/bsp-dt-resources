/* Digital manufacture, wood joints, and the charts used in industry and planning */
(() => { const { r, c, e, p, l, a, rot, t, hatch, dots } = D;
const axes = (x0, y0, x1, y1, xl, yl) => l(x0, y0, x0, y1, 2.5) + l(x0, y0, x1, y0, 2.5) + t((x0 + x1) / 2, y0 + 34, xl, 14) + `<g transform="rotate(-90 ${x0 - 30} ${(y0 + y1) / 2})">${t(x0 - 30, (y0 + y1) / 2, yl, 14)}</g>`;
const col = (s, k) => s.replace(/stroke="#1f2328"/g, `stroke="${k}"`);

DIAGRAMS['fdm-printer'] = { t: '3D printing: fused deposition modelling (FDM)', w: 660, h: 400,
 svg:
  r(100, 40, 20, 320, 'steel') + r(520, 40, 20, 320, 'steel') + r(100, 40, 440, 20, 'steel') + r(80, 350, 480, 20, 'dark') +    // frame
  r(120, 130, 400, 14, 'steel') + r(290, 110, 70, 60, 'dark', 4) + p('M312 170 L338 170 L330 196 L320 196 Z', 'hot') +           // gantry, print head, nozzle
  c(190, 80, 34, 'pale') + c(190, 80, 12, 'dark') + col(p('M222 86 Q300 60 324 110', 'none', 3), '#f4a53f') +                    // filament reel
  r(170, 300, 300, 16, 'hot', 3) + r(160, 316, 320, 12, 'dark') +                                                                 // heated bed
  [0, 1, 2, 3, 4, 5, 6, 7].map((k) => r(250, 292 - k * 12, k > 5 ? 90 : 150, 10, 'mat', 2, 1)).join('') + col(l(325, 196, 325, 206, 3), '#f4a53f') +
  a(380, 100, 450, 100) + a(380, 100, 380, 60) + t(462, 104, 'X', 13) + t(380, 52, 'Z', 13),
 parts: [[60, 80, 'Reel of thermoplastic filament (PLA, ABS)', 160, 80], [600, 140, 'Print head moves in X and Y', 358, 140], [600, 190, 'Heated nozzle melts and extrudes the filament', 328, 186], [600, 250, 'Part built up one layer at a time', 398, 250],
  [60, 308, 'Heated build plate (bed)', 180, 308], [60, 200, 'Frame and guide rails', 110, 200]] };

DIAGRAMS['sla-printer'] = { t: '3D printing: stereolithography (SLA)', w: 640, h: 400,
 svg:
  r(150, 150, 340, 200, 'pale') + r(154, 190, 332, 156, 'yellow', 0, 0) + r(150, 150, 340, 200, 'none') +                         // resin vat
  r(240, 250, 160, 12, 'dark') + l(320, 262, 320, 350, 5) + [0, 1, 2, 3, 4].map((k) => r(270, 238 - k * 12, 100, 10, 'mat', 2, 1)).join('') + a(350, 330, 350, 290) + // platform and part
  r(60, 40, 110, 46, 'dark', 4) + t(115, 68, 'UV laser', 13, 'middle', '#fff') + col(l(170, 63, 420, 63, 3), '#7048e8') + p('M404 46 L440 80', 'none', 6) + col(l(420, 63, 330, 188, 3), '#7048e8') + c(330, 188, 5, '#7048e8'),
 parts: [[90, 130, 'Ultraviolet laser', 110, 86], [520, 60, 'Moving mirror steers the beam', 428, 68], [560, 200, 'Vat of liquid photopolymer resin', 470, 220], [560, 130, 'The resin cures (hardens) where the laser touches the surface', 340, 180],
  [90, 230, 'Part: cured layers', 272, 222], [90, 300, 'Platform lowers by one layer each time', 250, 256]] };

DIAGRAMS['laser-cutter'] = { t: 'CNC laser cutter', w: 680, h: 380,
 svg:
  r(60, 300, 560, 30, 'dark') + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((k) => p(`M${90 + k * 40} 300 l10 -16 l10 16 Z`, 'steel')).join('') + r(150, 268, 380, 14, 'mat') + // honeycomb bed, work
  r(60, 40, 180, 40, 'dark', 4) + t(150, 66, 'CO₂ laser tube', 13, 'middle', '#fff') + col(l(240, 60, 560, 60, 3), '#e4594d') + p('M546 44 L576 76', 'none', 6) +
  col(l(560, 60, 560, 130, 3), '#e4594d') + p('M546 116 L576 146', 'none', 6) + col(l(560, 130, 380, 130, 3), '#e4594d') + p('M364 114 L394 146', 'none', 6) +
  r(350, 110, 60, 80, 'steel', 6) + e(380, 180, 18, 5, 'cool') + col(p('M380 130 L380 186 L380 266', 'none', 3), '#e4594d') + p('M366 190 L394 190 L384 216 L376 216 Z', 'dark') + // head, lens, nozzle
  r(100, 104, 500, 12, 'steel') + a(430, 150, 500, 150) + c(380, 268, 6, 'yellow') + r(600, 200, 50, 70, 'pale', 4) + a(590, 240, 560, 240, 'dark'),
 parts: [[60, 110, 'Laser tube produces the beam', 110, 80], [620, 44, 'Mirrors direct the beam to the head', 574, 70], [300, 160, 'Cutting head moves on X and Y rails', 352, 150], [300, 210, 'Lens focuses the beam to a fine point', 364, 182],
  [250, 250, 'Material is burned or vaporised along the CAD path', 376, 266], [110, 350, 'Honeycomb bed supports the work', 130, 290], [640, 300, 'Extraction removes fumes', 626, 268], [470, 200, 'Air assist nozzle clears smoke from the cut', 390, 204]] };

DIAGRAMS['cnc-router'] = { t: 'CNC router: the three axes', w: 660, h: 400,
 svg:
  p('M100 260 L420 260 L560 330 L240 330 Z', 'steel') + p('M240 330 L560 330 L560 350 L240 350 Z', 'dark') + p('M100 260 L240 330 L240 350 L100 280 Z', 'dark') +    // bed in oblique view
  p('M220 262 L400 262 L470 298 L290 298 Z', 'wood') +                                                                    // sheet
  r(150, 90, 20, 190, 'steel') + r(470, 150, 20, 190, 'steel') + p('M150 90 L170 90 L490 150 L470 150 Z', 'steel') + p('M150 104 L470 164 L470 190 L150 130 Z', 'steel') + // gantry
  r(290, 100, 60, 100, 'dark', 4) + r(310, 200, 20, 40, 'pale') + p('M314 240 L326 240 L320 270 Z', 'hot') + rot(320, 220, 26, 200, 340) +                                  // spindle and cutter
  a(520, 250, 600, 290) + a(380, 120, 450, 134) + a(250, 150, 250, 90) + t(612, 304, 'Y', 16) + t(462, 128, 'X', 16) + t(250, 80, 'Z', 16),
 parts: [[80, 60, 'Gantry carries the spindle across the bed', 190, 110], [420, 70, 'Spindle motor', 340, 120], [560, 200, 'Rotating cutter (router bit)', 322, 252], [90, 330, 'Sheet material held by clamps or a vacuum bed', 280, 286], [600, 370, 'Machine bed', 520, 320],
  [90, 200, 'X: left and right. Y: front to back. Z: up and down', 250, 130]] };

const joint = (x, y, kind) => { let o = '';
  if (kind === 0) o += r(x, y + 40, 110, 30, 'wood') + r(x + 110, y, 30, 110, 'sand');                                                           // butt
  if (kind === 1) o += r(x, y + 40, 96, 30, 'wood') + r(x + 96, y + 40, 44, 15, 'wood') + r(x + 110, y, 30, 110, 'sand') + r(x + 96, y + 55, 14, 15, 'sand', 0, 1.2); // lap / rebate
  if (kind === 2) o += r(x + 40, y, 30, 110, 'sand') + r(x + 70, y + 40, 70, 30, 'wood') + r(x + 52, y + 46, 18, 18, 'wood', 0, 1.2, ) + l(x + 52, y + 46, x + 52, y + 64, 1.5, '3 3');                    // mortise and tenon
  if (kind === 3) o += r(x, y + 20, 140, 28, 'wood') + r(x + 56, y + 48, 28, 62, 'sand') + r(x + 56, y + 36, 28, 12, 'sand', 0, 1.2);         // housing
  if (kind === 4) o += r(x, y + 40, 70, 30, 'wood') + r(x + 70, y + 40, 70, 30, 'sand') + [48, 62].map((q) => c(x + 70, y + q, 4, 'dark', 1)).join('') + l(x + 50, y + 48, x + 90, y + 48, 1.5, '3 3') + l(x + 50, y + 62, x + 90, y + 62, 1.5, '3 3'); // dowel
  if (kind === 5) o += r(x, y + 20, 30, 90, 'sand') + r(x + 30, y + 20, 110, 30, 'wood') + [0, 1, 2].map((k) => p(`M${x} ${y + 26 + k * 30} L${x + 30} ${y + 20 + k * 30} L${x + 30} ${y + 44 + k * 30} L${x} ${y + 38 + k * 30} Z`, 'wood', 1.2)).join(''); // dovetail
  return o; };
DIAGRAMS['wood-joints'] = { t: 'Common wood joints', w: 700, h: 370,
 svg: [['Butt joint', 'weak: needs pins or screws'], ['Lap (rebate) joint', 'bigger gluing area'], ['Mortise and tenon', 'strong: frames, chairs'], ['Housing joint', 'shelves and dividers'], ['Dowel joint', 'hidden pegs: flat-pack'], ['Dovetail joint', 'very strong: drawers']]
  .map(([n, s], i) => { const x = 50 + (i % 3) * 220, y = 20 + Math.floor(i / 3) * 180; return joint(x, y, i) + t(x + 70, y + 136, n, 15) + t(x + 70, y + 154, s, 12, 'middle', '#5b6478', false); }).join('') };

DIAGRAMS['laminating'] = { t: 'Laminating thin veneers round a former', w: 640, h: 340,
 svg:
  p('M120 280 L120 190 Q120 90 220 90 L420 90 Q520 90 520 190 L520 280 L470 280 L470 190 Q470 140 420 140 L220 140 Q170 140 170 190 L170 280 Z', 'steel') + // outer former
  p('M186 280 L186 196 Q186 158 224 158 L416 158 Q454 158 454 196 L454 280 Z', 'steel') +                                                                    // inner former
  [0, 1, 2].map((k) => col(p(`M${172 + k * 5} 280 L${172 + k * 5} 192 Q${172 + k * 5} ${143 + k * 5} ${222} ${143 + k * 5} L418 ${143 + k * 5} Q${468 - k * 5} ${143 + k * 5} ${468 - k * 5} 192 L${468 - k * 5} 280`, 'none', 4), k % 2 ? '#b08a52' : '#dfc08f')).join('') +
  r(80, 200, 40, 24, 'dark') + l(60, 212, 200, 212, 5) + r(520, 200, 40, 24, 'dark') + l(440, 212, 580, 212, 5) + a(40, 250, 110, 250) + a(600, 250, 530, 250),
 parts: [[60, 110, 'Outer former (mould)', 140, 130], [320, 240, 'Inner former', 320, 200], [320, 50, 'Thin veneers, each coated with adhesive', 320, 148], [600, 150, 'Clamps hold the shape until the glue sets', 560, 206], [60, 300, 'Pressure', 80, 250]] };

DIAGRAMS['control-chart'] = { t: 'Quality control chart', w: 680, h: 380,
 svg: axes(90, 320, 640, 40, 'Sample number (time)', 'Measured size') +
  col(l(90, 80, 640, 80, 2, '8 6'), '#e4594d') + col(l(90, 280, 640, 280, 2, '8 6'), '#e4594d') + col(l(90, 130, 640, 130, 1.5, '4 6'), '#f4a53f') + col(l(90, 230, 640, 230, 1.5, '4 6'), '#f4a53f') + l(90, 180, 640, 180, 1.5) +
  col(p('M120 186 L165 170 L210 192 L255 176 L300 184 L345 166 L390 158 L435 146 L480 132 L525 118 L570 96 L610 70', 'none', 2.5), '#3b5bdb') +
  [[120, 186], [165, 170], [210, 192], [255, 176], [300, 184], [345, 166], [390, 158], [435, 146], [480, 132], [525, 118], [570, 96]].map(([x, y]) => c(x, y, 4.5, 'ink2', 1)).join('') + c(610, 70, 6, 'hot'),
 parts: [[130, 254, 'Target (nominal) size', 130, 182], [660, 60, 'Upper tolerance limit', 600, 80], [660, 300, 'Lower tolerance limit', 600, 280], [200, 110, 'Warning limits: time to act', 240, 130], [250, 250, 'Normal variation around the target', 250, 180],
  [440, 220, 'A steady drift: tool wear, so adjust or replace the tool', 460, 138], [540, 30, 'Out of tolerance: reject, and stop production', 606, 66]] };

DIAGRAMS['product-life-cycle'] = { t: 'The product life cycle', w: 680, h: 360,
 svg: axes(80, 300, 650, 40, 'Time', 'Sales') +
  col(p('M80 296 Q150 290 200 250 Q280 110 380 96 Q470 88 520 130 Q580 190 640 250', 'none', 4), '#3b5bdb') +
  [200, 340, 500].map((x) => l(x, 300, x, 60, 1.2, '5 5')).join('') + ['Introduction', 'Growth', 'Maturity', 'Decline'].map((n, i) => t([140, 270, 420, 575][i], 322, n, 13)).join(''),
 parts: [[140, 200, 'Launch: low sales, high costs for development and promotion', 150, 284], [250, 80, 'Sales rise quickly as the product becomes known; profit begins', 270, 164], [420, 50, 'Sales peak and level off; competitors arrive; price falls', 420, 96],
  [590, 110, 'Sales fall as newer products replace it', 590, 196], [470, 220, 'Extension strategies (new version, new market, lower price) can delay decline', 510, 124]] };

DIAGRAMS['waste-hierarchy'] = { t: 'The waste hierarchy', w: 640, h: 360,
 svg: [['Prevent / reduce', 'green'], ['Re-use', '#b9dba0'], ['Recycle', 'yellow'], ['Recover energy', 'mat'], ['Dispose', 'hot']].map(([n, f], i) => { const y = 30 + i * 60, w0 = 520 - i * 96, w1 = 520 - (i + 1) * 96, cx = 300; return p(`M${cx - w0 / 2} ${y} L${cx + w0 / 2} ${y} L${cx + w1 / 2} ${y + 56} L${cx - w1 / 2} ${y + 56} Z`, f) + t(cx, y + 34, n, i > 3 ? 12 : 15); }).join('') +
  a(600, 320, 600, 40, 'dark') + `<g transform="rotate(-90 622 180)">${t(622, 180, 'better for the environment', 13)}</g>` };

DIAGRAMS['go-no-go'] = { t: 'Go / no-go gauge', w: 640, h: 300,
 svg:
  p('M60 120 L140 120 L140 200 L206 200 L206 120 L420 120 L420 200 L478 200 L478 120 L580 120 L580 260 L60 260 Z', 'steel') +
  t(173, 250, 'GO', 20) + t(449, 250, 'NO GO', 20) + t(173, 222, '20.1 mm', 12) + t(449, 222, '19.9 mm', 12) +
  c(173, 166, 31, 'mat') + c(449, 92, 31, 'mat') + a(173, 40, 173, 126) + a(449, 20, 449, 56) + t(300, 60, 'part: 20 mm ± 0.1', 13),
 parts: [[60, 60, 'GO gap, made to the largest size allowed: a good part drops in', 150, 150], [590, 60, 'NO GO gap, made to the smallest size allowed: a good part will not enter', 470, 130], [300, 180, 'Fits GO but not NO GO: the part is within tolerance', 204, 166]] };
})();
