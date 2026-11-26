/* Polymer moulding and forming */
(() => { const { r, c, p, l, a, rot, t, hatch, dots } = D;

DIAGRAMS['injection-moulding'] = { t: 'Injection moulding', w: 720, h: 360,
 svg:
  r(30, 150, 90, 60, 'dark', 6) + t(75, 185, 'motor', 13) +                         // drive
  r(120, 150, 330, 60, 'steel') + r(128, 164, 322, 32, 'pale', 0, 1.2) +             // barrel and bore
  p('M132 180 ' + Array.from({ length: 15 }, (_, i) => `L${142 + i * 20} ${i % 2 ? 194 : 166}`).join(' ') + ' L440 180', 'none', 2.5) + l(128, 180, 440, 180, 1.5) + // screw
  [170, 250, 330, 400].map((x) => r(x, 138, 36, 12, 'hot', 3) + r(x, 210, 36, 12, 'hot', 3)).join('') +   // heater bands
  p('M150 60 L230 60 L205 150 L175 150 Z', 'pale') + dots(162, 68, 56, 60, 'mat', 26, 5) +               // hopper and granules
  p('M450 150 L478 170 L478 190 L450 210 Z', 'steel') +                                                     // nozzle
  r(478, 90, 62, 180, 'steel') + hatch(478, 90, 62, 180) + r(540, 90, 70, 180, 'steel') + hatch(540, 90, 70, 180) + // mould halves
  p('M478 174 L512 174 L512 130 L566 130 L566 230 L512 230 L512 186 L478 186 Z', 'mat') +                   // sprue and cavity filled with polymer
  l(566, 150, 610, 150, 3) + l(566, 210, 610, 210, 3) + r(610, 140, 12, 80, 'dark') +                      // ejector pins and plate
  r(622, 165, 70, 30, 'dark', 4) + a(700, 222, 640, 222) +                                                 // clamp ram
  a(292, 238, 372, 238) + rot(75, 180, 44, 200, 340),
 parts: [[190, 30, 'Hopper', 190, 78], [300, 30, 'Polymer granules', 205, 100], [75, 110, 'Motor (turns the screw)', 75, 150], [250, 300, 'Screw', 262, 182], [150, 300, 'Heated barrel', 150, 205], [350, 110, 'Heater bands', 348, 142],
  [430, 300, 'Nozzle', 464, 185], [470, 50, 'Fixed half of the mould', 505, 100], [600, 50, 'Moving half of the mould', 585, 100], [545, 320, 'Mould cavity', 545, 215], [640, 320, 'Ejector pins', 590, 210], [690, 130, 'Hydraulic clamp', 660, 170]] };

DIAGRAMS['extrusion'] = { t: 'Extrusion of a polymer', w: 720, h: 330,
 svg:
  r(24, 140, 80, 60, 'dark', 6) + t(64, 175, 'motor', 13) + rot(64, 170, 42, 200, 340) +
  r(104, 140, 300, 60, 'steel') + r(112, 154, 292, 32, 'pale', 0, 1.2) +
  p('M116 170 ' + Array.from({ length: 14 }, (_, i) => `L${126 + i * 20} ${i % 2 ? 184 : 156}`).join(' ') + ' L400 170', 'none', 2.5) + l(112, 170, 400, 170, 1.5) +
  [150, 230, 310].map((x) => r(x, 128, 36, 12, 'hot', 3) + r(x, 200, 36, 12, 'hot', 3)).join('') +
  p('M130 50 L210 50 L185 140 L155 140 Z', 'pale') + dots(142, 58, 56, 60, 'mat', 26, 9) +
  r(404, 130, 34, 80, 'steel') + hatch(404, 130, 34, 80) + r(404, 162, 34, 16, 'mat', 0, 1.2) +            // die
  r(438, 162, 262, 16, 'mat') +                                                                              // extrudate
  p('M470 150 L470 215 L580 215 L580 150', 'none') + r(472, 185, 106, 28, 'cool', 0, 0) + p('M472 185 q13 -8 26 0 t26 0 t26 0 t28 0', 'none', 1.5) + r(472, 162, 106, 16, 'mat') + // cooling trough
  c(620, 146, 14, 'dark') + c(620, 194, 14, 'dark') + rot(620, 146, 22, 250, 20) +                          // haul-off rollers
  l(676, 120, 676, 210, 4) + p('M668 120 L684 120 L676 136 Z', 'dark') +                                     // cutter
  a(250, 228, 340, 228) + a(600, 110, 680, 110),
 parts: [[170, 24, 'Hopper of granules', 170, 70], [64, 100, 'Motor', 64, 140], [240, 290, 'Rotating screw', 246, 172], [330, 100, 'Heater bands', 328, 132], [421, 290, 'Die (gives the cross-section)', 421, 200],
  [525, 290, 'Cooling water trough', 525, 205], [620, 250, 'Haul-off rollers', 620, 205], [700, 250, 'Cutter', 678, 200], [520, 110, 'Extrusion (constant cross-section)', 452, 166]] };

const vf = (stage) => {                                           // one frame of the vacuum former
  const sheetY = 96, up = stage >= 2, mouldY = up ? 110 : 150;
  let o = r(40, 60, 240, 190, 'pale', 6) + r(52, 220, 216, 22, 'dark') + t(160, 236, stage >= 3 ? 'vacuum pump ON' : 'vacuum pump', 12, 'middle', '#fff');
  o += r(70, mouldY + 52, 180, 12, 'steel') + p(`M110 ${mouldY + 52} L122 ${mouldY} L198 ${mouldY} L210 ${mouldY + 52} Z`, 'wood');   // platen and mould
  if (stage === 1) o += r(60, 44, 200, 12, 'hot', 4) + [90, 130, 170, 210].map((x) => a(x, 60, x, 84, 'hot', 2.5)).join('') + p(`M52 ${sheetY} Q160 ${sheetY + 26} 268 ${sheetY}`, 'none', 5);
  if (stage === 2) o += p(`M52 ${sheetY} L100 ${sheetY} Q122 ${mouldY - 6} 160 ${mouldY - 6} Q198 ${mouldY - 6} 220 ${sheetY} L268 ${sheetY}`, 'none', 5) + a(160, 210, 160, 180);
  if (stage >= 3) o += p(`M52 ${sheetY} L84 ${sheetY} L106 ${mouldY + 50} L112 ${mouldY + 50} L122 ${mouldY - 3} L198 ${mouldY - 3} L208 ${mouldY + 50} L214 ${mouldY + 50} L236 ${sheetY} L268 ${sheetY}`, 'none', 5);
  if (stage === 3) o += a(92, 150, 92, 205, 'ink2', 2.5) + a(228, 150, 228, 205, 'ink2', 2.5);
  if (stage === 4) o += a(20, 130, 44, 130, 'cool') + a(300, 130, 276, 130, 'cool') + t(160, 36, 'cool, then release', 13);
  o += r(40, sheetY - 8, 14, 16, 'dark') + r(266, sheetY - 8, 14, 16, 'dark');                         // clamps
  return o; };
DIAGRAMS['vacuum-forming'] = { t: 'Vacuum forming', w: 320, h: 262, stages: [
  [vf(1), 'The sheet (often HIPS) is clamped and the heater softens it until it sags.'],
  [vf(2), 'The heater is moved away and the platen raises the mould into the soft sheet.'],
  [vf(3), 'The vacuum pump removes the air, so air pressure pushes the sheet tightly onto the mould.'],
  [vf(4), 'The sheet cools and hardens. It is unclamped, the mould is removed and the waste is trimmed.']] };

const bm = (stage) => {
  const open = stage === 1 || stage === 4, gap = open ? 46 : 0;
  const half = (side) => { const x = side < 0 ? 60 - gap : 160 + gap; return r(x, 70, 100, 170, 'steel') + hatch(x, 70, 100, 170) + (side < 0 ? p(`M${x + 100} 92 L${x + 84} 92 L${x + 84} 104 Q${x + 44} 120 ${x + 44} 150 L${x + 44} 222 L${x + 100} 222 Z`, 'paper') : p(`M${x} 92 L${x + 16} 92 L${x + 16} 104 Q${x + 56} 120 ${x + 56} 150 L${x + 56} 222 L${x} 222 Z`, 'paper')); };
  let o = r(120, 14, 80, 34, 'dark', 4) + t(160, 36, 'extruder', 12, 'middle', '#fff') + half(-1) + half(1);
  if (stage === 1) o += r(148, 48, 24, 180, 'mat', 6) + a(160, 244, 160, 258, 'ink2', 2) + a(40 - gap + 30, 155, 40 - gap + 56, 155) + a(280 + gap - 30, 155, 280 + gap - 56, 155);
  if (stage === 2) o += r(148, 48, 24, 174, 'mat', 6) + l(150, 222, 170, 222, 4);
  if (stage >= 3) o += p('M144 92 L144 104 Q104 120 104 150 L104 222 L216 222 L216 150 Q216 120 176 104 L176 92 Z', stage === 3 ? 'mat' : 'mat') + p('M150 98 L150 108 Q112 124 112 152 L112 214 L208 214 L208 152 Q208 124 170 108 L170 98 Z', 'paper', 1.2);
  if (stage === 3) o += r(155, 48, 10, 60, 'cool', 0, 1.2) + a(160, 120, 160, 160, 'ink2', 2.5) + a(150, 170, 122, 180, 'ink2', 2.5) + a(170, 170, 198, 180, 'ink2', 2.5) + t(160, 200, 'air', 13);
  if (stage === 4) o += a(160, 236, 160, 258) ;
  return o; };
DIAGRAMS['blow-moulding'] = { t: 'Extrusion blow moulding', w: 320, h: 262, stages: [
  [bm(1), 'A hot tube of polymer, called a parison, is extruded down between the open mould halves.'],
  [bm(2), 'The mould closes, sealing the bottom of the parison and gripping the top.'],
  [bm(3), 'Compressed air is blown in, forcing the parison out against the cold mould walls.'],
  [bm(4), 'The polymer cools, the mould opens and the bottle is ejected. Flash is trimmed off.']] };

DIAGRAMS['compression-moulding'] = { t: 'Compression moulding (thermosetting polymers)', w: 620, h: 340,
 svg:
  r(250, 20, 120, 40, 'dark', 4) + t(310, 46, 'hydraulic ram', 12, 'middle', '#fff') + a(200, 30, 200, 90) +
  r(170, 60, 280, 50, 'steel') + hatch(170, 60, 280, 50) + p('M230 110 L390 110 L370 170 L250 170 Z', 'steel') +     // top (male) half
  r(170, 200, 280, 90, 'steel') + hatch(170, 200, 280, 90) + p('M222 200 L398 200 L376 262 L244 262 Z', 'paper') +   // bottom (female) half
  p('M270 262 L350 262 L344 240 Q310 228 276 240 Z', 'mat') +                                                         // charge of polymer
  [182, 420].map((x) => r(x, 72, 18, 26, 'hot', 3) + r(x, 232, 18, 26, 'hot', 3)).join('') +
  l(310, 262, 310, 300, 4) + r(296, 300, 28, 12, 'dark'),
 parts: [[90, 85, 'Upper mould half (heated)', 172, 85], [90, 245, 'Lower mould half (heated)', 172, 245], [530, 100, 'Heaters', 438, 85], [530, 250, 'Charge (slug) of thermosetting polymer', 330, 250], [530, 180, 'Mould cavity', 385, 215], [530, 310, 'Ejector pin', 312, 290], [100, 30, 'Pressure applied', 198, 60]] };

const rm = (stage) => {
  let o = '';
  const mould = (x, y, fill) => r(x - 60, y - 44, 120, 88, 'steel', 14) + r(x - 50, y - 34, 100, 68, fill || 'paper', 10, 1.2);
  if (stage === 1) o += mould(160, 140) + dots(118, 150, 84, 18, 'mat', 22, 3) + p('M120 60 L200 60 L175 100 L145 100 Z', 'pale') + a(160, 100, 160, 124) + t(160, 232, 'load powder', 13);
  if (stage === 2) o += r(40, 40, 240, 200, 'hot', 10, 2) + r(52, 52, 216, 176, 'paper', 6, 0) + mould(160, 140) + r(110, 106, 100, 68, 'none', 10, 6).replace('stroke="#1f2328"', 'stroke="#f4a53f"') + rot(160, 140, 78, 210, 330) + rot(160, 140, 78, 30, 150) + l(40, 140, 100, 140, 4) + t(160, 256, 'heat and rotate on two axes', 12);
  if (stage === 3) o += mould(160, 140) + r(110, 106, 100, 68, 'none', 10, 6).replace('stroke="#1f2328"', 'stroke="#f4a53f"') + [80, 120, 160, 200, 240].map((x) => a(x, 40, x, 82, 'cool', 2.5)).join('') + rot(160, 140, 78, 30, 150) + t(160, 232, 'cool with air or water', 13);
  if (stage === 4) o += r(100, 60, 120, 40, 'steel', 14) + r(100, 190, 120, 40, 'steel', 14) + r(112, 112, 96, 64, 'mat', 10) + r(120, 120, 80, 48, 'paper', 8, 1.2) + a(230, 144, 286, 144) + t(160, 252, 'open and remove', 13);
  return o; };
DIAGRAMS['rotational-moulding'] = { t: 'Rotational moulding', w: 320, h: 266, stages: [
  [rm(1), 'A measured amount of polymer powder is loaded into the cold mould, which is then closed.'],
  [rm(2), 'The mould is heated in an oven while it turns slowly about two axes. The powder melts and coats the inside evenly.'],
  [rm(3), 'Still turning, the mould is cooled so the polymer sets as a hollow shell of even thickness.'],
  [rm(4), 'The mould is opened and the hollow product is removed.']] };
})();
