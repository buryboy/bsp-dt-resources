// Page 4 — First, second & third order levers: three pen-drawn animations (what is in the middle?), the
// F-L-E → 1-2-3 memory aid, a 10-product sort and a question on why third-order levers need more effort.
(function () {
  'use strict';
  const B = Ink.BLUE, RD = Ink.RED;
  const tri = (x, y, s) => [[x, y], [x + s * 0.6, y + s], [x - s * 0.6, y + s], [x, y]];
  const map = (ax, ay, s) => ([x, y]) => [ax + x * s, ay + y * s];

  // ---------- shared bits for the three drawings ----------
  // a force arrow whose TIP touches (x, y); dir = +1 pushes down, -1 pushes up
  function force(k, x, y, dir, a, label, col, o = {}) {
    const len = o.len || 56, y0 = y - dir * len;
    k.arrow([[x, y0], [x, y - dir * 4]], a, a + 0.45, { color: col, w: 3.6, head: 15 });
    const lx = x + (o.dx || 0), ly = dir > 0 ? y0 - 10 : y0 + 28;
    k.text(label, lx, ly, a + 0.3, a + 0.75, { size: 24, color: col, align: o.align || 'center' });
  }
  function fulcrum(k, x, y, s, a) { const P = tri(x, y, s); k.hatch(P, a + 0.25, a + 0.7, { density: 1.3 }); k.line(P, a, a + 0.45, { w: 2.6 }); }
  // the letters under each drawing, lined up under the parts, with the middle one ringed in red
  function strip(k, parts, y, a) {
    parts.forEach((p, i) => k.text(p.ch, p.x, y, a + i * 0.3, a + i * 0.3 + 0.25, { size: 34, align: 'center', color: p.ch === 'E' ? RD : B }));
    const xs = parts.map((p) => p.x);
    k.line([[xs[0] + 22, y - 12], [xs[1] - 22, y - 12]], a + 0.2, a + 0.4, { w: 1.6, retrace: false });
    k.line([[xs[1] + 22, y - 12], [xs[2] - 22, y - 12]], a + 0.5, a + 0.7, { w: 1.6, retrace: false });
    k.circle(xs[1], y - 12, 25, a + 1.1, a + 1.6, { color: RD, w: 3, ry: 23 });
  }
  const strokes = (k, list) => list.forEach(([t, d]) => k.play('stroke', t, { material: 'pen', dur: d, gain: 0.42 }));

  // ---------- the six products ----------
  function seesaw(k, a) {
    const gy = 292, fx = 215, fy = 222;
    k.line([[40, gy], [395, gy]], a, a + 0.4, { w: 2.2 });
    fulcrum(k, fx, fy, gy - fy, a + 0.3);
    const y = (x) => fy - (x - fx) * 0.2;                                    // plank: right end up, ready to be pushed down
    const P = [[60, y(60) - 6], [370, y(370) - 6], [371, y(371) + 6], [61, y(61) + 6], [60, y(60) - 6]];
    k.line(P, a + 1.0, a + 1.7, { w: 2.6 });
    k.hatch(P, a + 1.6, a + 1.9);
    const bx = 70, by = y(95) - 6 - 46;                                      // crate on the left end
    const C = k.box(bx, by, 52, 46, a + 1.9, a + 2.5, { w: 2.6, radius: 4 });
    k.hatch(C, a + 2.4, a + 2.8);
    k.text('see-saw', 215, 42, a + 2.6, a + 3.0, { size: 26, align: 'center' });
  }
  function seesawLabels(k, a) {
    force(k, 96, 198, 1, a, 'load', B);
    force(k, 350, 186, 1, a + 0.6, 'effort', RD);
    k.text('fulcrum', 215, 322, a + 1.2, a + 1.6, { size: 24, align: 'center' });
  }
  function crowbar(k, a) {
    const gy = 292;
    k.line([[455, gy], [838, gy]], a, a + 0.4, { w: 2.2 });
    const C = k.box(742, 204, 84, 84, a + 0.4, a + 1.1, { w: 2.6, radius: 4 });      // heavy crate
    k.hatch(C, a + 1.0, a + 1.5);
    k.line([[742, 232], [826, 232]], a + 1.1, a + 1.3, { w: 1.6, retrace: false });
    k.line([[742, 260], [826, 260]], a + 1.2, a + 1.4, { w: 1.6, retrace: false });
    fulcrum(k, 700, 262, 28, a + 1.4);                                                // small block it pivots on
    // the bar: long straight handle, then the bent claw that hooks under the crate
    k.line([[478, 128], [700, 258], [730, 284], [752, 287]], a + 2.0, a + 2.8, { w: 4.6 });
    k.line([[481, 122], [703, 252]], a + 2.6, a + 2.9, { w: 1.6, retrace: false });
    k.text('crowbar', 640, 42, a + 2.6, a + 3.0, { size: 26, align: 'center' });
  }
  function crowbarLabels(k, a) {
    force(k, 480, 118, 1, a, 'effort', RD);
    force(k, 784, 198, 1, a + 0.6, 'load', B);
    k.text('fulcrum', 688, 322, a + 1.2, a + 1.6, { size: 24, align: 'center' });
  }

  // wheelbarrow in its own coordinates: axle at (0,0), ground at y = 36, handle end at (340, -80)
  function barrow(k, m, a) {
    const L = (pts) => pts.map(m);
    k.circle(m([0, 0])[0], m([0, 0])[1], 36 * (m([1, 0])[0] - m([0, 0])[0]), a, a + 0.6, { w: 3 });
    k.circle(m([0, 0])[0], m([0, 0])[1], 27 * (m([1, 0])[0] - m([0, 0])[0]), a + 0.5, a + 0.9, { w: 1.6, retrace: false });
    k.dot(m([0, 0])[0], m([0, 0])[1], 5, a + 0.9);
    k.line(L([[0, 0], [58, -24], [170, -24], [340, -80]]), a + 0.9, a + 1.6, { w: 3.4 });   // frame + handle
    k.line(L([[296, -66], [340, -80]]), a + 1.6, a + 1.8, { w: 6 });                         // grip
    const T = L([[26, -90], [204, -90], [170, -26], [58, -26], [26, -90]]);                  // the tub
    k.line(T, a + 1.7, a + 2.4, { w: 2.8 });
    k.hatch(L([[150, -90], [204, -90], [170, -26], [128, -26]]), a + 2.3, a + 2.7);
    k.line(L([[150, -24], [174, 36]]), a + 2.4, a + 2.7, { w: 3 });                          // leg
    k.line(L([[160, 36], [190, 36]]), a + 2.7, a + 2.8, { w: 3 });
    const heap = k.curve(m([34, -90]), m([62, -150]), m([160, -152]), m([196, -90]));       // the load: a heap of soil
    k.line(heap, a + 2.8, a + 3.3, { w: 2.6 });
    k.hatch(heap.concat([heap[0]]), a + 3.2, a + 3.7, { density: 1.5 });
  }
  function nutcracker(k, a) {
    const hx = 492, hy = 196;
    const up = k.curve([hx, hy - 6], [600, 168], [700, 140], [826, 124]);
    const lo = k.curve([hx, hy + 6], [600, 224], [700, 252], [826, 268]);
    k.line(up, a, a + 0.6, { w: 5 }); k.line(lo, a + 0.5, a + 1.1, { w: 5 });
    k.line(k.curve([700, 132], [745, 124], [790, 120], [826, 116]), a + 1.0, a + 1.2, { w: 2, retrace: false });   // handle grips
    k.line(k.curve([700, 260], [745, 268], [790, 272], [826, 276]), a + 1.1, a + 1.3, { w: 2, retrace: false });
    k.circle(hx, hy, 10, a + 1.2, a + 1.5, { w: 3 }); k.dot(hx, hy, 3.5, a + 1.5);       // hinge pin
    const N = k.ellipse(585, hy, 22, 21);                                                  // the walnut
    k.line(N, a + 1.6, a + 2.1, { w: 2.6 });
    k.hatch(N, a + 2.0, a + 2.4, { density: 1.4 });
    k.line(k.curve([569, hy - 2], [578, hy - 8], [590, hy + 6], [602, hy]), a + 2.2, a + 2.5, { w: 1.6, retrace: false });
    k.text('nutcracker', 655, 42, a + 2.5, a + 3.0, { size: 26, align: 'center' });
  }
  function tweezers(k, a) {
    const up = k.curve([58, 190], [150, 150], [270, 150], [392, 187]);
    const lo = k.curve([58, 198], [150, 238], [270, 238], [392, 201]);
    k.line(up, a, a + 0.7, { w: 4.4 }); k.line(lo, a + 0.6, a + 1.3, { w: 4.4 });
    k.line([[44, 186], [70, 186], [70, 202], [44, 202], [44, 186]], a + 1.3, a + 1.6, { w: 2.6 });   // the joined (welded) end
    k.hatch([[44, 186], [70, 186], [70, 202], [44, 202]], a + 1.6, a + 1.8, { density: 1.6 });
    [0, 1, 2, 3].forEach((i) => k.line([[196 + i * 12, 157], [202 + i * 12, 165]], a + 1.7 + i * 0.05, a + 1.8 + i * 0.05, { w: 1.6, retrace: false }));   // finger grip ridges
    [0, 1, 2, 3].forEach((i) => k.line([[196 + i * 12, 231], [202 + i * 12, 223]], a + 1.9 + i * 0.05, a + 2.0 + i * 0.05, { w: 1.6, retrace: false }));
    const S = k.ellipse(400, 194, 8, 7);                                                              // tiny bead held at the tips
    k.line(S, a + 2.2, a + 2.5, { w: 2.4 }); k.hatch(S, a + 2.4, a + 2.6, { density: 2 });
    k.text('tweezers', 215, 42, a + 2.5, a + 3.0, { size: 26, align: 'center' });
  }
  function rod(k, a) {
    const P0 = [486, 286], P1 = [776, 86];
    k.line([P0, P1], a, a + 0.9, { w: 3.6 });
    k.line([P0, [540, 251]], a + 0.9, a + 1.2, { w: 7 });                                  // cork handle
    k.circle(566, 246, 11, a + 1.2, a + 1.5, { w: 2.4 }); k.dot(566, 246, 3, a + 1.5);     // reel
    [0.45, 0.65, 0.85].forEach((u, i) => k.circle(P0[0] + (P1[0] - P0[0]) * u + 3, P0[1] + (P1[1] - P0[1]) * u + 5, 4, a + 1.5 + i * 0.1, a + 1.6 + i * 0.1, { w: 1.6, retrace: false }));
    k.line([P1, [776, 196]], a + 1.8, a + 2.2, { w: 1.4, retrace: false });                // the line
    const F = k.curve([776, 196], [806, 208], [806, 246], [776, 262]).concat(k.curve([776, 262], [746, 246], [746, 208], [776, 196]));   // the fish
    k.line(F, a + 2.2, a + 2.8, { w: 2.4 });
    k.hatch(F, a + 2.7, a + 3.0, { density: 1.3 });
    k.line([[776, 262], [760, 284], [792, 284], [776, 262]], a + 2.8, a + 3.0, { w: 2.2 });
    k.dot(769, 214, 2.6, a + 3.0);
    k.text('fishing rod', 610, 42, a + 2.6, a + 3.0, { size: 26, align: 'center' });
  }

  Book.page({
    id: 'p04',
    title: 'First, second & third order',
    build(ui, root) {
      const notes = [];                                    // everything that blurs during the sort and the question
      const keep = (e) => { notes.push(e); return e; };
      const anim = (spec) => {                              // before it is first played, the poster asks the question the pen will answer
        let played = false; const draw = spec.draw;
        spec.onPlay = () => { played = true; };
        spec.draw = (k, t) => { draw(k, t); if (!played) k.text('Where are the fulcrum, load and effort?', 28, 400, 0, 0.01, { size: 23 }); };
        ui.anim(spec); return keep(root.lastElementChild);
      };

      ui.h('First, second & third order');
      ui.p('Every lever has a <b>fulcrum</b>, an <b>effort</b> and a <b>load</b>. Levers come in three <b>orders</b> (classes). The order depends on <span class="key">which part is in the middle</span>.');
      keep(ui.box('<b style="font:700 28px Fredoka">F – L – E &nbsp;→&nbsp; 1 – 2 – 3</b><br><b>F</b>ulcrum in the middle = <b>1</b>st order. <b>L</b>oad in the middle = <b>2</b>nd order. <b>E</b>ffort in the middle = <b>3</b>rd order.', { tag: 'Memory aid' }));
      ui.p('<span class="small">Tap each drawing to watch the pen find the fulcrum, the load and the effort.</span>');

      // ---------------------------------------------------------------- 1st order
      keep(ui.el('h2', '', '1st order: fulcrum in the middle'));
      anim({
        w: 860, h: 452, duration: 13.5, poster: 6.2,
        draw(k) {
          seesaw(k, 0.1); crowbar(k, 3.1);
          seesawLabels(k, 6.4); crowbarLabels(k, 8.4);
          strip(k, [{ ch: 'L', x: 96 }, { ch: 'F', x: 215 }, { ch: 'E', x: 350 }], 398, 10.3);
          strip(k, [{ ch: 'E', x: 480 }, { ch: 'F', x: 694 }, { ch: 'L', x: 784 }], 398, 11.3);
        },
        sound(k) { strokes(k, [[0.1, 2.8], [3.1, 2.9], [6.4, 0.5], [7.0, 0.5], [7.6, 0.4], [8.4, 0.5], [9.0, 0.5], [9.6, 0.4], [10.3, 0.9], [11.4, 0.5], [11.3, 0.9], [12.4, 0.5]]); },
      });
      keep(ui.p('A first-order lever <b>changes the direction</b> of the force: push down and the load goes up. It can also <b>multiply your force</b>, if the effort is further from the fulcrum than the load is.'));

      // ---------------------------------------------------------------- 2nd order
      keep(ui.el('h2', '', '2nd order: load in the middle'));
      anim({
        w: 860, h: 452, duration: 13.5, poster: 6.2,
        draw(k) {
          const m = map(74, 254, 0.94);
          k.line([[24, 289], [410, 289]], 0.1, 0.4, { w: 2.2 });
          barrow(k, m, 0.3);
          k.text('wheelbarrow', 318, 60, 2.9, 3.3, { size: 26, align: 'center' });
          nutcracker(k, 3.1);
          // wheelbarrow forces
          force(k, m([113, 0])[0], 106, 1, 6.4, 'load', B, { len: 44 });
          force(k, m([332, 0])[0], m([0, -70])[1], -1, 7.0, 'effort', RD, { dx: -6 });
          k.text('fulcrum', m([0, 0])[0] + 4, 322, 7.6, 8.0, { size: 24, align: 'center' });
          // nutcracker forces: squeeze both handles, the nut pushes back
          force(k, 792, 122, 1, 8.4, 'effort', RD);
          force(k, 792, 276, -1, 8.6, '', RD, { len: 46 });
          k.arrow([[585, 126], [585, 170]], 9.1, 9.5, { w: 3.2, head: 13 });
          k.text('load', 585, 114, 9.3, 9.7, { size: 24, align: 'center' });
          k.text('fulcrum', 500, 250, 9.7, 10.1, { size: 24, align: 'center' });
          strip(k, [{ ch: 'F', x: m([0, 0])[0] }, { ch: 'L', x: m([113, 0])[0] }, { ch: 'E', x: m([332, 0])[0] }], 398, 10.3);
          strip(k, [{ ch: 'F', x: 496 }, { ch: 'L', x: 585 }, { ch: 'E', x: 792 }], 398, 11.3);
        },
        sound(k) { strokes(k, [[0.1, 3.0], [3.4, 2.6], [6.4, 0.5], [7.0, 0.5], [7.6, 0.4], [8.4, 0.6], [9.1, 0.5], [9.7, 0.4], [10.3, 0.9], [11.4, 0.5], [11.3, 0.9], [12.4, 0.5]]); },
      });
      keep(ui.p('The effort is always <b>further from the fulcrum</b> than the load is, so a second-order lever <b>always multiplies your force</b>.'));

      // ---------------------------------------------------------------- 3rd order
      keep(ui.el('h2', '', '3rd order: effort in the middle'));
      anim({
        w: 860, h: 452, duration: 13.5, poster: 6.2,
        draw(k) {
          tweezers(k, 0.1); rod(k, 3.1);
          // tweezers: fingers squeeze the middle
          force(k, 216, 148, 1, 6.4, 'effort', RD);
          force(k, 216, 240, -1, 6.6, '', RD, { len: 50 });
          k.arrow([[400, 128], [400, 178]], 7.1, 7.5, { w: 3.2, head: 13 });
          k.text('load', 400, 116, 7.3, 7.7, { size: 24, align: 'center' });
          k.text('fulcrum', 70, 250, 7.7, 8.1, { size: 24, align: 'center' });
          // fishing rod: one hand holds the end still, the other pulls up part-way along
          fulcrum(k, 488, 290, 26, 8.4);
          k.text('fulcrum', 500, 150, 8.7, 9.1, { size: 24, align: 'center' });
          k.arrow([[500, 160], [490, 268]], 8.9, 9.2, { w: 1.6, head: 9, retrace: false });
          force(k, 600, 222, -1, 9.2, 'effort', RD, { len: 62 });
          force(k, 818, 170, 1, 9.7, 'load', B, { len: 50 });
          strip(k, [{ ch: 'F', x: 62 }, { ch: 'E', x: 216 }, { ch: 'L', x: 400 }], 398, 10.3);
          strip(k, [{ ch: 'F', x: 488 }, { ch: 'E', x: 600 }, { ch: 'L', x: 776 }], 398, 11.3);
        },
        sound(k) { strokes(k, [[0.1, 2.8], [3.1, 2.9], [6.4, 0.6], [7.1, 0.5], [7.7, 0.4], [8.4, 0.7], [9.2, 0.5], [9.7, 0.5], [10.3, 0.9], [11.4, 0.5], [11.3, 0.9], [12.4, 0.5]]); },
      });
      keep(ui.p('The load moves <b>further and faster</b> than the effort, but it needs <b>more effort than the load</b>. Third-order levers are for small, precise, fast movements.'));

      // ---------------------------------------------------------------- sort
      ui.el('h2', '', 'Sort the levers');
      ui.p('For each product ask: <b>what is in the middle?</b> <span class="small">The notes and drawings above will blur while you sort, so use your memory!</span>');
      const sort = ui.sort({
        id: 'p04.orders', label: 'Sort 10 products into 1st / 2nd / 3rd order levers',
        q: 'Tap a product, then tap the order of lever it is.',
        buckets: ['1st order', '2nd order', '3rd order'],
        items: [
          { t: 'crowbar', b: 0, mis: 'lever-order' },
          { t: 'scissors', b: 0, mis: 'lever-order' },
          { t: 'pliers', b: 0, mis: 'lever-order' },
          { t: 'wheelbarrow', b: 1, mis: 'lever-order' },
          { t: 'nutcracker', b: 1, mis: 'lever-order' },
          { t: 'bottle opener', b: 1, mis: 'lever-order' },
          { t: 'door (hinge = fulcrum)', b: 1, mis: 'lever-order' },
          { t: 'tweezers', b: 2, mis: 'lever-order' },
          { t: 'kitchen tongs', b: 2, mis: 'lever-order' },
          { t: 'fishing rod', b: 2, mis: 'lever-order' },
        ],
        explain: 'All sorted! Fulcrum in the middle = 1st, load in the middle = 2nd, effort in the middle = 3rd.',
      });
      ui.hideWhile(sort, 'p04.orders', notes);

      // ---------------------------------------------------------------- check
      const q = ui.mcq({
        id: 'p04.third', label: 'Why tweezers need more effort than the load',
        q: 'Your fingers squeeze <b>tweezers</b> harder than the tips grip. <b>Why?</b>',
        options: [
          { t: 'The effort is in the middle, so it is nearer the fulcrum than the load is.', ok: true, why: 'Yes: tweezers are third order. The effort is between the fulcrum and the load, so you need more effort than the load. In return the tips move further and faster: perfect for small, precise jobs.' },
          { t: 'They don\'t: a third-order lever multiplies force, so the tips grip harder.', mis: 'third-order-ma', why: 'A third-order lever never multiplies force. The effort is always more than the load. What you gain is movement at the tips.' },
          { t: 'The load is in the middle, so it is nearer the fulcrum than the effort is.', mis: 'lever-order', why: 'Load in the middle is a second-order lever, like a wheelbarrow. Think about where your fingers squeeze tweezers.' },
          { t: 'The fulcrum is in the middle, so the force only changes its direction.', mis: 'lever-order', why: 'Fulcrum in the middle is a first-order lever, like a see-saw. The fulcrum of tweezers is the joined end.' },
        ],
      });
      ui.hideWhile(q, 'p04.third', notes);
    },
  });
})();
