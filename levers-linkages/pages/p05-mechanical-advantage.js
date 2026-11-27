// Page 5 — Mechanical advantage: MA = load ÷ effort, a wheelbarrow that shows "you never get something for
// nothing", three calculations that echo the student's own working, and two checks.
(function () {
  'use strict';
  const B = Ink.BLUE, RD = Ink.RED;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const ease = (u) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2);

  // wheelbarrow in its own coordinates: axle at (0,0), ground at y = 36, handle end at (340, -80), load centre x = 113
  function barrow(k, m, s, a) {
    const L = (pts) => pts.map(m), O = m([0, 0]);
    k.circle(O[0], O[1], 36 * s, a, a + 0.6, { w: 3.2 });
    k.circle(O[0], O[1], 27 * s, a + 0.5, a + 0.9, { w: 1.6, retrace: false });
    [0, 1, 2].forEach((i) => { const an = 0.4 + i * 2.094; k.line([[O[0] + Math.cos(an) * 6, O[1] + Math.sin(an) * 6], [O[0] + Math.cos(an) * 26 * s, O[1] + Math.sin(an) * 26 * s]], a + 0.8, a + 1.0, { w: 1.5, retrace: false }); });
    k.dot(O[0], O[1], 6, a + 0.9);
    k.line(L([[0, 0], [58, -24], [170, -24], [340, -80]]), a + 1.0, a + 1.7, { w: 3.6 });   // frame + handle
    k.line(L([[294, -65], [340, -80]]), a + 1.7, a + 1.9, { w: 7 });                         // grip
    k.line(L([[26, -90], [204, -90], [170, -26], [58, -26], [26, -90]]), a + 1.8, a + 2.5, { w: 3 });   // the tub
    k.hatch(L([[150, -90], [204, -90], [170, -26], [128, -26]]), a + 2.4, a + 2.8);
    k.line(L([[150, -24], [174, 36]]), a + 2.5, a + 2.8, { w: 3.2 });                        // leg
    k.line(L([[160, 36], [190, 36]]), a + 2.8, a + 2.9, { w: 3.2 });
    const heap = k.curve(m([34, -90]), m([62, -150]), m([160, -152]), m([196, -90]));       // the load: a heap of soil
    k.line(heap, a + 2.9, a + 3.4, { w: 2.8 });
    k.hatch(heap.concat([heap[0]]), a + 3.3, a + 3.8, { density: 1.5 });
  }
  const dashed = (k, x0, x1, y, a, b, col) => { const n = Math.round((x1 - x0) / 22); for (let i = 0; i < n; i++) k.line([[x0 + i * 22, y], [x0 + i * 22 + 12, y]], a + ((b - a) * i) / n, a + ((b - a) * (i + 1)) / n, { w: 1.6, color: col, retrace: false, seed: 5 + i }); };

  Book.page({
    id: 'p05',
    title: 'Mechanical advantage',
    build(ui, root) {
      const notes = [];
      const keep = (e) => { notes.push(e); return e; };

      ui.h('Mechanical advantage');
      ui.p('A lever can make a heavy job feel light. <b>Mechanical advantage (MA)</b> tells you <span class="key">how many times a lever multiplies your force</span>.');
      keep(ui.box('<b style="font:700 26px Fredoka">mechanical advantage = load ÷ effort</b><br>Load and effort are both forces, measured in <b>newtons (N)</b>. MA is a <b>ratio</b>, so it has <b>no units</b>: it is just a number.<br>Rearranged: <b>effort = load ÷ MA</b> &nbsp;and&nbsp; <b>load = effort × MA</b>.', { tag: 'Notes' }));
      keep(ui.box('A wheelbarrow carries a <b>load of 600&nbsp;N</b>. It needs an <b>effort of 200&nbsp;N</b>.<br>MA = load ÷ effort = 600 ÷ 200 = <b>3</b><br>The lever multiplies your force <b>3 times</b>.', { tag: 'Worked example', color: RD }));

      // ---------------------------------------------------------------- the catch
      ui.el('h2', '', 'You never get something for nothing');
      ui.p('So is the extra force free? <b>Tap the drawing</b> and watch how far the hand has to move.');
      const AX = 118, AY = 300, S = 1.22, TH = -0.215;
      const m = ([x, y]) => [AX + x * S, AY + y * S];
      const rot = ([x, y], th) => { const dx = x - AX, dy = y - AY, c = Math.cos(th), s = Math.sin(th); return [AX + dx * c - dy * s, AY + dx * s + dy * c]; };
      ui.anim({
        w: 860, h: 452, duration: 15, poster: 6.0,
        draw(k, t) {
          const th = TH * ease(clamp((t - 6.6) / 3));
          const gy = AY + 36 * S;
          k.line([[20, gy], [640, gy]], 0.1, 0.5, { w: 2.2, seed: 3 });
          k.ctx.save(); k.ctx.translate(AX, AY); k.ctx.rotate(th); k.ctx.translate(-AX, -AY);
          barrow(k, m, S, 0.4);
          k.ctx.restore();
          const peak0 = m([113, -138]), hand0 = m([340, -80]), peak = rot(peak0, th), hand = rot(hand0, th);
          // forces (they ride up with the barrow)
          k.arrow([[peak[0], peak[1] - 58], [peak[0], peak[1] - 6]], 4.4, 4.8, { w: 3.6, head: 15, seed: 21 });
          k.text('load 600 N', peak[0] + 14, peak[1] - 38, 4.6, 5.1, { size: 24 });
          k.arrow([[hand[0], hand[1] + 70], [hand[0], hand[1] + 10]], 5.1, 5.5, { w: 3.6, head: 15, color: RD, seed: 22 });
          k.text('effort 200 N', hand[0] - 8, hand[1] + 98, 5.3, 5.8, { size: 24, color: RD, align: 'center' });
          // where everything started
          dashed(k, hand0[0] + 64, hand0[0] + 124, hand0[1], 6.0, 6.3, RD);
          dashed(k, peak0[0] - 150, peak0[0] - 16, peak0[1], 6.3, 6.6, B);
          // how far each end moved
          const hx = hand0[0] + 96, handEnd = rot(hand0, TH), peakEnd = rot(peak0, TH), px = peak0[0] - 128;
          dashed(k, handEnd[0] + 6, hx + 24, handEnd[1], 9.7, 9.9, RD);
          k.arrow([[hx, hand0[1] - 4], [hx, handEnd[1] + 6]], 9.9, 10.5, { w: 3.4, head: 15, color: RD, seed: 23 });
          k.text('your hand moves', hx + 20, (hand0[1] + handEnd[1]) / 2 - 8, 10.3, 10.9, { size: 23, color: RD });
          k.text('a LONG way', hx + 20, (hand0[1] + handEnd[1]) / 2 + 24, 10.9, 11.4, { size: 26, color: RD });
          dashed(k, px - 20, peakEnd[0] - 14, peakEnd[1], 11.5, 11.7, B);
          k.arrow([[px, peak0[1] - 2], [px, peakEnd[1] + 3]], 11.7, 12.1, { w: 3.4, head: 11, seed: 24 });
          k.text('the load only', 22, peakEnd[1] - 44, 12.0, 12.5, { size: 23 });
          k.text('moves a little', 22, peakEnd[1] - 14, 12.5, 13.0, { size: 23 });
          k.text('More force… but more distance for your hand!', 24, 432, 13.2, 14.6, { size: 25, color: RD });
        },
        sound(k) {
          const st = (t, d, g = 0.42) => k.play('stroke', t, { material: 'pen', dur: d, gain: g });
          st(0.1, 3.9); st(4.4, 0.6); st(5.1, 0.6); st(6.0, 0.5); k.play('paper', 6.7, { dur: 2.6, gain: 0.25 });
          st(9.8, 0.7); st(10.4, 1.0); st(11.6, 0.5); st(12.0, 1.0); st(13.2, 1.4);
        },
      });
      keep(root.lastElementChild);
      keep(ui.box('<b>MA greater than 1</b>: the lever multiplies your force, so lifting is easier. But your hand moves <b>further</b> than the load.<br><b>MA less than 1</b>: you need <b>more effort than the load</b>. But the load moves further and faster (third-order levers).', { tag: 'Notes' }));

      // ---------------------------------------------------------------- calculations
      ui.el('h2', '', 'Your turn: three calculations');
      const echo = (act, k, word) => {                                  // show the student's own answer in the next line
        const inp = act.querySelectorAll('input.blank')[k], outs = act.querySelectorAll('.echo');
        const upd = () => outs.forEach((o) => (o.textContent = inp.value.trim() || word));
        inp.addEventListener('input', upd); upd();
      };
      const numeric = (act, idx) => act.querySelectorAll('input.blank').forEach((inp, i) => { if (!idx || idx.includes(i)) { inp.inputMode = 'decimal'; inp.style.width = '5.2em'; } });

      const c1 = ui.fill({
        id: 'p05.calc1', label: 'Find MA: crowbar, 45 kg slab, effort 90 N',
        q: '<b>1.</b> A crowbar lifts a paving slab with a mass of <b>45&nbsp;kg</b>. The effort needed is <b>90&nbsp;N</b>. <span class="small">(On Earth, 1&nbsp;kg weighs about 10&nbsp;N.)</span>',
        html: 'Load = 45 × 10 = {{450|450.0}} N<br>MA = load ÷ effort = <b class="echo"></b> ÷ 90 = {{5|5.0}}',
        explain: 'Load = 450 N, so MA = 450 ÷ 90 = <b>5</b>. No units: MA is a ratio.',
      });
      echo(c1, 0, '(your load)'); numeric(c1);

      const c2 = ui.fill({
        id: 'p05.calc2', label: 'Find effort: nutcracker, MA 4, load 120 N',
        q: '<b>2.</b> A nutcracker has a mechanical advantage of <b>4</b>. The nut cracks when the load on it reaches <b>120&nbsp;N</b>.',
        html: 'Effort = load ÷ MA = 120 ÷ 4 = {{30|30.0}} N<br>Cracking the nut with bare hands would take the full 120&nbsp;N.<br>So the nutcracker saves you 120 − <b class="echo"></b> = {{90|90.0}} N of effort.',
        explain: 'Effort = 120 ÷ 4 = <b>30 N</b>. That is 90 N less than doing it by hand.',
      });
      echo(c2, 0, '(your effort)'); numeric(c2);

      const c3 = ui.fill({
        id: 'p05.calc3', label: 'Third-order MA: fishing rod, load 20 N, effort 80 N',
        q: '<b>3.</b> A <b>fishing rod</b> is a third-order lever. The fish is a <b>load of 20&nbsp;N</b>. The angler pulls with an <b>effort of 80&nbsp;N</b>.',
        html: 'MA = load ÷ effort = 20 ÷ 80 = {{0.25|.25|0,25|1/4|¼}}<br>Your answer, <b class="echo"></b>, is {{less|smaller|lower}} than 1.<br>So the angler needs {{more|greater|bigger|larger}} effort than the load. In return, the fish moves further and faster.',
        explain: 'MA = 20 ÷ 80 = <b>0.25</b>. An MA less than 1 means more effort than load: the price of extra movement.',
      });
      echo(c3, 0, '(your MA)'); numeric(c3, [0]);

      // ---------------------------------------------------------------- checks (notes blur until both are done)
      ui.el('h2', '', 'Check');
      ui.p('<span class="small">The notes and the drawing blur while you answer these two.</span>');
      const q = ui.mcq({
        id: 'p05.upside', label: 'Which working gives the MA? (load 300 N, effort 60 N)',
        q: 'A lever lifts a <b>load of 300&nbsp;N</b> using an <b>effort of 60&nbsp;N</b>. Which working is correct?',
        options: [
          { t: 'MA = 300 ÷ 60 = 5', ok: true, why: 'Yes: load ÷ effort, and no units because MA is a ratio.' },
          { t: 'MA = 60 ÷ 300 = 0.2', mis: 'ma-upside-down', why: 'That is upside down: it is effort ÷ load. The load goes first. This lever makes lifting easier, so its MA must be more than 1.' },
          { t: 'MA = 300 ÷ 60 = 5 N', why: 'The division is the right way up, but MA has no units. Newtons ÷ newtons leaves just a number.' },
          { t: 'MA = 300 − 60 = 240', why: 'MA is a ratio, so you divide. It tells you how many times bigger the load is than the effort.' },
        ],
      });
      const tf = ui.tf({
        id: 'p05.free', label: 'T/F: MA of 3 gives 3× the force AND 3× the movement',
        statement: 'A lever with a mechanical advantage of 3 gives you 3 times the force, <b>and</b> it moves the load 3 times further than your hand moves.',
        answer: false, mis: 'ma-free-lunch',
        explain: 'False. You never get something for nothing: when a lever multiplies your force, your hand has to move <b>further</b> than the load does.',
      });
      {
        const it = (id) => Book.state.items[id];
        const qDone = () => { const a = it('p05.upside'); return !!a && (a.correct === true || a.attempts >= 3); };
        const done = () => qDone() && !!it('p05.free');
        const lock = (on) => notes.forEach((e) => e.classList.toggle('peek-lock', on));
        const start = () => { if (!done()) { lock(true); Ink.stopAll(root); } };
        [q, tf].forEach((e) => { e.addEventListener('pointerdown', start, { passive: true }); e.addEventListener('click', () => setTimeout(() => { if (done()) lock(false); }, 60)); });
        // the true/false is one tap, so blur as soon as it scrolls into view
        if ('IntersectionObserver' in window) new IntersectionObserver((en) => { if (en.some((x) => x.isIntersecting) && !root.closest('.page').classList.contains('hidden')) start(); }, { threshold: 0.4 }).observe(tf);
      }
    },
  });
})();
