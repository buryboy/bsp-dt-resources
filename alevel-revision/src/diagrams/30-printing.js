/* Printing processes */
(() => { const { r, c, e, p, l, a, rot, t, hatch, dots } = D;
const web = (y, x1, x2) => l(x1, y, x2, y, 5).replace('stroke="#1f2328"', 'stroke="#98a2b0"');

DIAGRAMS['offset-litho'] = { t: 'Offset lithography', w: 700, h: 400,
 svg:
  c(330, 120, 56, 'steel') + c(330, 232, 56, 'dark') + c(330, 344, 50, 'steel') + web(288, 60, 640) + a(80, 310, 160, 310) + // plate, blanket, impression
  [[240, 50], [270, 30], [205, 80]].map(([x, y]) => c(x, y, 16, 'ink2')).join('') + r(180, 20, 30, 20, 'ink2', 4) +          // ink rollers
  [[420, 50], [448, 78]].map(([x, y]) => c(x, y, 16, 'cool')).join('') + r(460, 96, 70, 22, 'cool', 4) +                    // damping rollers and water
  rot(330, 120, 30, 200, 20) + rot(330, 232, 30, 20, 200) + rot(330, 344, 28, 200, 20) +
  t(330, 126, 'plate', 13) + t(330, 238, 'blanket', 13, 'middle', '#fff') + t(330, 350, 'impression', 12),
 parts: [[140, 120, 'Plate cylinder (carries the image)', 278, 120], [140, 232, 'Rubber blanket cylinder (image is offset onto it)', 276, 232], [140, 360, 'Impression cylinder (presses the paper on)', 284, 350], [130, 60, 'Ink rollers (oil-based ink sticks to the image area)', 196, 74],
  [590, 60, 'Damping rollers (water keeps ink off the non-image area)', 458, 76], [590, 230, 'Paper or board', 560, 286], [590, 120, 'Water (fount solution)', 520, 108]] };

DIAGRAMS['flexography'] = { t: 'Flexography', w: 700, h: 380,
 svg:
  r(120, 300, 150, 50, 'pale') + r(124, 322, 142, 26, 'ink2', 0, 0) + c(195, 300, 40, 'dark') +          // ink trough and fountain roller
  c(275, 240, 40, 'steel') + c(275, 240, 34, 'none', 1, '2 4') + l(318, 196, 290, 214, 4) +               // anilox roller, doctor blade
  c(360, 170, 52, 'steel') + c(360, 170, 52, 'none', 7, '10 12').replace('stroke="#1f2328"', 'stroke="#e4594d"') + // plate cylinder with raised flexible plate
  c(470, 110, 52, 'dark') + l(356, 32, 474, 248, 5).replace('stroke="#1f2328"', 'stroke="#98a2b0"') + a(500, 236, 530, 290) +
  rot(360, 170, 30, 20, 200) + rot(470, 110, 30, 200, 20) + rot(275, 240, 22, 200, 20),
 parts: [[70, 330, 'Ink trough', 140, 334], [70, 270, 'Fountain roller (picks up ink)', 160, 290], [120, 190, 'Anilox roller (tiny cells meter the ink)', 242, 228], [380, 300, 'Doctor blade (scrapes off extra ink)', 304, 206],
  [250, 90, 'Plate cylinder with a flexible raised (relief) plate', 328, 134], [560, 90, 'Impression cylinder', 500, 100], [600, 300, 'Substrate: film, foil, card or paper from a reel', 466, 232]] };

DIAGRAMS['gravure'] = { t: 'Gravure (rotogravure)', w: 680, h: 380,
 svg:
  r(180, 270, 320, 80, 'pale') + r(184, 300, 312, 48, 'ink2', 0, 0) +                                     // ink bath
  c(340, 250, 72, 'steel') + c(340, 250, 66, 'none', 2, '3 5') + c(340, 110, 56, 'dark') +                 // engraved cylinder, impression roller
  web(170, 40, 640) + a(560, 150, 630, 150) + l(440, 180, 404, 216, 5) + r(436, 168, 60, 14, 'dark') +    // web and doctor blade
  rot(340, 250, 40, 200, 20) + rot(340, 110, 30, 20, 200) + r(540, 180, 90, 34, 'hot', 4) + t(585, 202, 'dryer', 12, 'middle', '#fff'),
 parts: [[110, 110, 'Impression roller (rubber covered)', 286, 110], [110, 240, 'Gravure cylinder: the image is engraved as tiny cells', 270, 240], [110, 330, 'Ink bath (thin, fast-drying ink)', 200, 326],
  [570, 260, 'Doctor blade wipes the surface, leaving ink only in the cells', 424, 198], [570, 100, 'Substrate (web)', 520, 168], [610, 320, 'Heated dryer', 600, 214]] };

DIAGRAMS['screen-printing'] = { t: 'Screen printing', w: 680, h: 340,
 svg:
  r(100, 250, 480, 22, 'wood') + r(140, 236, 400, 14, 'paper') +                                           // bed and substrate
  r(120, 150, 24, 60, 'wood') + r(536, 150, 24, 60, 'wood') + l(144, 206, 536, 206, 2, '3 3') +           // frame and mesh
  l(144, 209, 250, 209, 5) + l(330, 209, 420, 209, 5) + l(470, 209, 536, 209, 5) +                         // stencil (blocked areas)
  p('M300 110 L330 110 L352 200 L338 206 Z', 'dark') + r(286, 80, 60, 30, 'wood', 6) +                     // squeegee
  p('M352 200 Q372 176 420 196 L430 206 L340 206 Z', 'ink2') + a(360, 130, 450, 130) +                     // ink in front of squeegee
  l(254, 212, 254, 234, 3).replace('stroke="#1f2328"', 'stroke="#3b5bdb"') + l(300, 212, 300, 234, 3).replace('stroke="#1f2328"', 'stroke="#3b5bdb"') + r(250, 232, 78, 5, 'ink2', 0, 0),
 parts: [[70, 180, 'Frame', 124, 180], [200, 110, 'Squeegee', 310, 130], [500, 110, 'Ink', 400, 196], [610, 180, 'Fine mesh screen', 500, 206], [200, 300, 'Stencil blocks the mesh where no ink is wanted', 200, 210],
  [400, 300, 'Ink forced through the open mesh', 278, 224], [600, 300, 'Substrate: paper, card, fabric, polymer', 520, 242], [450, 60, 'Direction of pull', 420, 130]] };
})();
