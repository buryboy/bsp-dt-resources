/* Casting, forming, machining and joining metals */
(() => { const { r, c, e, p, l, a, rot, t, hatch, dots } = D;

DIAGRAMS['die-casting'] = { t: 'Pressure die casting (cold chamber)', w: 720, h: 360,
 svg:
  r(40, 196, 110, 28, 'dark', 4) + a(60, 250, 130, 250) +                                                  // hydraulic ram
  r(150, 180, 210, 60, 'steel') + r(150, 194, 210, 32, 'pale', 0, 1.2) + r(150, 196, 46, 28, 'dark') +     // shot sleeve and plunger
  r(196, 196, 164, 28, 'hot', 0, 1.2) +                                                                      // molten metal in sleeve
  p('M236 180 L236 150 L262 150 L262 180', 'pale') + p('M270 86 L330 86 L322 126 L278 126 Z', 'steel') + p('M276 92 L324 92 L319 120 L281 120 Z', 'hot', 1.2) + p('M262 122 Q250 132 250 150', 'none', 4).replace('stroke="#1f2328"', 'stroke="#e4594d"') + // pouring hole and ladle
  r(360, 80, 80, 220, 'steel') + hatch(360, 80, 80, 220) + r(440, 80, 100, 220, 'steel') + hatch(440, 80, 100, 220) +   // die halves
  p('M360 196 L410 196 L410 130 L480 130 L480 270 L410 270 L410 224 L360 224 Z', 'hot') +                    // cavity filled
  l(480, 160, 560, 160, 3) + l(480, 240, 560, 240, 3) + r(560, 148, 12, 104, 'dark') +                      // ejector pins
  r(572, 180, 100, 40, 'dark', 4) + a(690, 250, 610, 250),
 parts: [[95, 150, 'Hydraulic ram', 95, 198], [173, 300, 'Plunger (piston)', 173, 220], [300, 300, 'Shot chamber (sleeve)', 300, 236], [300, 50, 'Ladle of molten metal', 300, 100], [200, 110, 'Pouring hole', 246, 160],
  [400, 44, 'Fixed die half', 400, 90], [500, 44, 'Moving die half', 500, 90], [445, 330, 'Die cavity filled with metal', 445, 255], [590, 100, 'Ejector pins', 530, 160], [660, 300, 'Clamping force', 650, 252]] };

DIAGRAMS['sand-casting'] = { t: 'Sand casting: the mould ready to pour', w: 700, h: 380,
 svg:
  r(120, 70, 460, 120, 'steel') + r(132, 82, 436, 108, 'sand', 0, 1.2) +                                    // cope
  r(120, 190, 460, 130, 'steel') + r(132, 190, 436, 118, 'sand', 0, 1.2) +                                  // drag
  l(120, 190, 580, 190, 2.5) +
  p('M250 150 L450 150 L450 230 L250 230 Z', 'paper') +                                                     // cavity
  p('M176 82 L204 82 L196 100 L196 205 L250 205 L250 190 L212 190 L212 100 Z', 'paper') + p('M168 70 L212 70 L204 86 L176 86 Z', 'paper') + // pouring basin, sprue, runner
  p('M400 82 L424 82 L424 150 L400 150 Z', 'paper') +                                                       // riser
  r(96, 120, 24, 16, 'dark') + r(580, 120, 24, 16, 'dark') + r(96, 240, 24, 16, 'dark') + r(580, 240, 24, 16, 'dark') + l(108, 136, 108, 240, 4) + l(592, 136, 592, 240, 4) + // locating pins
  p('M130 30 L190 30 L182 56 L150 56 Z', 'steel') + p('M182 50 Q192 58 190 72', 'none', 5).replace('stroke="#1f2328"', 'stroke="#e4594d"') + r(70, 320, 560, 14, 'wood'),
 parts: [[60, 100, 'Cope (top moulding box)', 124, 100], [60, 270, 'Drag (bottom moulding box)', 124, 270], [350, 30, 'Riser (shows the mould is full and feeds shrinkage)', 412, 100], [250, 30, 'Pouring basin and sprue', 204, 110], [226, 350, 'Runner and gate', 226, 198],
  [350, 350, 'Mould cavity, left by the pattern', 350, 215], [500, 350, 'Green sand, rammed round the pattern', 500, 280], [650, 190, 'Parting line', 582, 190], [650, 100, 'Locating pins', 594, 150], [100, 30, 'Crucible of molten metal', 150, 44]] };

const ic = (stage) => {
  const tree = (f, shell) => (shell ? r(96, 60, 128, 170, 'sand', 16) : '') + r(150, 70, 20, 150, f) + [[110, 100], [190, 100], [110, 160], [190, 160]].map(([x, y]) => r(x, y, 40, 28, f, 6) ).join('') + p('M140 56 L180 56 L170 76 L150 76 Z', f);
  if (stage === 1) return tree('yellow') + t(160, 250, 'wax patterns on a wax “tree”', 12);
  if (stage === 2) return tree('yellow', true) + r(60, 228, 200, 14, 'dark') + t(160, 258, 'dip in ceramic slurry, coat, dry', 12);
  if (stage === 3) return `<g transform="rotate(180 160 145)">${tree('paper', true)}</g>` + [140, 160, 180].map((x) => a(x, 236, x, 256, 'yellow', 2.5)).join('') + r(40, 30, 240, 12, 'hot', 4) + t(160, 22, 'heat: the wax melts and runs out', 12);
  return tree('hot', true) + p('M196 20 L250 20 L240 48 L206 48 Z', 'steel') + p('M206 44 Q176 46 164 58', 'none', 5).replace('stroke="#1f2328"', 'stroke="#e4594d"') + t(160, 252, 'pour metal; break the shell when cool', 12); };
DIAGRAMS['investment-casting'] = { t: 'Investment (lost wax) casting', w: 320, h: 266, stages: [
  [ic(1), 'Wax patterns are injection moulded and joined to a wax runner to make a “tree”.'],
  [ic(2), 'The tree is dipped repeatedly in ceramic slurry and coated with sand to build a hard shell.'],
  [ic(3), 'The shell is heated upside down. The wax melts and runs out, leaving a hollow mould.'],
  [ic(4), 'Molten metal is poured in. When it has set, the shell is broken away and the castings are cut off.']] };

DIAGRAMS['press-forming'] = { t: 'Press forming (deep drawing) sheet metal', w: 640, h: 360,
 svg:
  r(270, 20, 100, 40, 'dark', 4) + t(320, 46, 'press ram', 12, 'middle', '#fff') + a(210, 30, 210, 100) +
  p('M270 60 L370 60 L370 190 Q370 204 356 204 L284 204 Q270 204 270 190 Z', 'steel') +                     // punch
  r(150, 110, 100, 36, 'dark') + r(390, 110, 100, 36, 'dark') +                                             // blank holder
  p('M150 152 L246 152 Q258 152 258 164 L258 212 L382 212 L382 164 Q382 152 394 152 L490 152', 'none', 6).replace('stroke="#1f2328"', 'stroke="#f4a53f"') + // sheet being drawn
  p('M150 160 L240 160 Q250 160 250 170 L250 300 L150 300 Z', 'steel') + hatch(150, 160, 100, 140) + p('M490 160 L400 160 Q390 160 390 170 L390 300 L490 300 Z', 'steel') + hatch(390, 160, 100, 140) + // die
  r(150, 300, 340, 26, 'steel'),
 parts: [[90, 60, 'Force from the press', 208, 70], [560, 60, 'Punch', 368, 100], [90, 128, 'Blank holder (pressure pad)', 152, 128], [560, 180, 'Sheet metal blank being drawn into the die', 470, 152], [90, 240, 'Die', 152, 240], [560, 260, 'Die cavity', 320, 260]] };

DIAGRAMS['centre-lathe'] = { t: 'Centre lathe: turning', w: 720, h: 370,
 svg:
  r(40, 250, 640, 30, 'steel') + r(60, 280, 60, 50, 'dark') + r(600, 280, 60, 50, 'dark') +               // bed and legs
  r(50, 90, 130, 160, 'steel', 8) + c(96, 130, 9, 'dark') + c(126, 130, 9, 'dark') + r(80, 160, 70, 30, 'pale', 4) + // headstock
  r(180, 130, 46, 90, 'dark', 4) + l(226, 150, 240, 150, 6) + l(226, 200, 240, 200, 6) +                    // chuck and jaws
  r(226, 158, 250, 34, 'steel') + r(380, 164, 96, 22, 'steel') +                                             // workpiece, part turned down
  rot(250, 175, 34, 240, 120) +
  r(560, 130, 90, 120, 'steel', 6) + p('M560 168 L500 168 L476 175 L500 182 L560 182 Z', 'dark') + c(668, 175, 16, 'dark') + l(650, 175, 668, 175, 4) + // tailstock, centre, handwheel
  r(340, 222, 120, 28, 'dark', 4) + r(372, 200, 56, 22, 'steel') + p('M392 200 L392 190 L402 186 L412 190 L412 200 Z', 'hot') + // saddle, tool post, tool
  a(470, 216, 400, 216) + r(360, 280, 80, 30, 'pale', 4) + c(400, 295, 9, 'dark'),
 parts: [[115, 50, 'Headstock (motor and gears)', 115, 95], [203, 50, 'Chuck', 203, 134], [300, 50, 'Workpiece (rotates)', 300, 160], [402, 50, 'Cutting tool', 402, 190], [470, 110, 'Tool post', 424, 208],
  [605, 50, 'Tailstock', 605, 135], [530, 110, 'Centre (supports long work)', 492, 174], [250, 330, 'Saddle (carriage)', 350, 240], [520, 330, 'Bed', 520, 266], [690, 110, 'Handwheel', 668, 162]] };

DIAGRAMS['milling'] = { t: 'Vertical milling machine', w: 640, h: 380,
 svg:
  r(430, 40, 110, 300, 'steel', 6) + r(250, 40, 200, 70, 'steel', 6) +                                      // column and head
  r(292, 110, 56, 50, 'dark') + r(308, 160, 24, 44, 'pale') + [168, 180, 192].map((y) => l(308, y, 332, y - 8, 1.5)).join('') + // spindle and cutter
  rot(320, 150, 40, 200, 340) +
  r(230, 204, 180, 30, 'mat') + r(308, 204, 24, 12, 'paper', 0, 1.2) +                                      // workpiece with slot
  r(210, 196, 24, 50, 'dark') + r(406, 196, 24, 50, 'dark') + r(200, 246, 240, 14, 'dark') +               // vice
  r(120, 260, 400, 26, 'steel') + r(250, 286, 140, 54, 'steel') + c(104, 273, 14, 'dark') +               // table, knee, handwheel
  a(150, 240, 230, 240) + r(90, 340, 480, 16, 'dark'),
 parts: [[180, 60, 'Head (motor and gears)', 260, 75], [200, 135, 'Spindle', 294, 135], [200, 185, 'Rotating multi-tooth cutter', 310, 185], [560, 220, 'Workpiece', 400, 216], [560, 270, 'Machine vice', 428, 232],
  [70, 310, 'Table (moves the work past the cutter)', 180, 276], [590, 100, 'Column', 520, 100], [60, 222, 'Feed direction', 150, 240]] };

DIAGRAMS['mig-welding'] = { t: 'MIG welding', w: 680, h: 360,
 svg:
  r(40, 250, 600, 22, 'steel') + l(340, 250, 340, 272, 1.5) +                                               // two plates
  p('M250 250 Q300 236 340 250 Z', 'dark') + e(352, 250, 20, 7, 'hot') +                                   // weld bead and pool
  p('M470 60 L520 86 L400 232 L372 214 Z', 'steel') + p('M400 232 L372 214 L366 232 L384 244 Z', 'dark') + // torch and nozzle
  l(376, 238, 358, 250, 3) + p('M358 250 l-6 -10 l8 2 l-2 -10', 'none', 2).replace('stroke="#1f2328"', 'stroke="#f6d75a"') + // wire and arc
  p('M366 232 Q344 240 334 256 M384 244 Q380 254 372 262', 'none', 1.5, '5 5').replace('stroke="#1f2328"', 'stroke="#86bdea"') + // gas shield
  p('M495 73 Q560 30 620 60', 'none', 6) + r(560, 110, 90, 110, 'dark', 6) + t(605, 160, 'welder', 12, 'middle', '#fff') + c(590, 80, 22, 'pale') + c(590, 80, 5, 'dark') + // cable, power source, wire reel
  p('M560 200 Q480 300 120 272', 'none', 3) + r(104, 262, 26, 20, 'hot', 3) + a(330, 200, 270, 200),
 parts: [[440, 40, 'Welding torch', 470, 96], [300, 150, 'Consumable wire electrode', 368, 244], [250, 300, 'Electric arc', 356, 252], [420, 300, 'Shielding gas (argon / CO₂)', 378, 256], [200, 200, 'Weld bead', 290, 244],
  [80, 220, 'Parent metal', 80, 258], [640, 40, 'Wire feed reel', 592, 70], [650, 250, 'Power source', 620, 210], [60, 320, 'Earth clamp', 116, 276], [300, 180, 'Direction of travel', 300, 200]] };

DIAGRAMS['powder-coating'] = { t: 'Powder coating', w: 680, h: 340,
 svg:
  r(40, 30, 600, 16, 'dark') + [240, 300].map((x) => l(x, 46, x, 90, 3)).join('') + r(200, 90, 140, 150, 'steel', 6) +   // conveyor and part
  p('M214 76 q-14 -20 4 -22', 'none', 2) + t(270, 170, '−  earthed', 13) +
  p('M560 140 L470 140 L440 152 L440 168 L470 180 L560 180 Z', 'dark') + r(540, 180, 34, 80, 'dark', 4) +   // spray gun
  dots(350, 110, 86, 110, 'mat', 46, 11) + [120, 150, 180, 210].map((y) => a(430, y > 160 ? 166 : 154, 346, y, 'ink2', 2)).join('') +
  t(396, 100, '+ charged powder', 12) + p('M557 260 Q560 310 640 310', 'none', 4) + t(600, 300, 'air + powder', 11),
 parts: [[120, 70, 'Overhead conveyor', 160, 40], [120, 170, 'Metal part, cleaned and earthed', 204, 170], [394, 280, 'Polymer powder with an electrostatic charge', 394, 210], [600, 110, 'Spray gun', 520, 150], [120, 290, 'Next: an oven melts and cures the powder', 270, 240]] };
})();
