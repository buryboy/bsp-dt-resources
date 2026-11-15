// Page 5 — Gear ratio: teeth on driven ÷ teeth on driver, writing it as 3:1, output speed = input speed ÷ ratio.
// An animated worked example with turn counters, a tap-to-count-the-teeth pair, four calculations that echo the
// student's own working, two checks, and a mention-only box (bevel, worm, rack & pinion) with looping sketches.
// Uses window.GearKit (defined in p04-gears.js).
(function () {
  'use strict';
  const G = window.GearKit, B = Ink.BLUE, RD = Ink.RED, GR = Ink.GREEN, rgba = Ink.rgba, geo = Ink.geo, TAU = Math.PI * 2;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const ease = (u) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2);
  const W = 860;

  Book.page({
    id: 'p05',
    title: 'Gear ratio',
    build(ui, root) {
      if (!G) { ui.h('Gear ratio'); ui.p('This page needs the gears page to load first.'); return; }
      const notes = [];
      const keep = (e) => { notes.push(e); return e; };

      ui.h('Gear ratio');
      ui.p('How much slower (or faster) will the output turn? You do not need to build it to find out: just <b>count the teeth</b>.');
      keep(ui.box('<b style="font:700 25px Fredoka">gear ratio = teeth on DRIVEN ÷ teeth on DRIVER</b><br>A ratio of 3 is written <b>3:1</b> (say "three to one"): the driver turns 3 times for every 1 turn of the driven gear.<br><b style="font:700 25px Fredoka">output speed = input speed ÷ gear ratio</b><br>Speed of rotation is measured in <b>rpm</b> (revolutions per minute).', { tag: 'Notes' }));

      // ---------------------------------------------------------------- worked example (animated)
      ui.p('<b>Tap the drawing</b> to watch the worked example, and keep an eye on the two turn counters.');
      const m0 = 4.6, NA = 20, NB = 60, ax = 78, cy = 182, bx = ax + G.R(NA, m0) + G.R(NB, m0), a0 = -0.6;
      const spA = G.sprite(NA, m0), spB = G.sprite(NB, m0);
      const shift = (P, dx, dy, a) => P.map(([x, y]) => [dx + x * Math.cos(a) - y * Math.sin(a), dy + x * Math.sin(a) + y * Math.cos(a)]);
      const OA = shift(G.outline(NA, m0), ax, cy, a0), OB = shift(G.outline(NB, m0), bx, cy, G.mesh(a0, NA, NB, 0));
      const T0 = 9.4, T1 = 16.4, TX = 438;
      ui.anim({
        w: W, h: 372, duration: 21, poster: 9.2,
        draw(k, t) {
          const u = ease(clamp((t - T0) / (T1 - T0))), a = a0 + 3 * TAU * u, c = k.ctx;
          if (t < 2.4) k.line(OA, 0.2, 1.6, { w: 2.1, amp: 0.3, seed: NA * 3 + 1 });
          if (t < 4.6) k.line(OB, 1.7, 4.0, { w: 2.1, amp: 0.3, seed: NB * 3 + 1 });
          c.save(); c.globalAlpha = clamp((t - 1.6) / 0.6); if (t > 1.6) G.draw(c, spA, ax, cy, a); c.restore();
          c.save(); c.globalAlpha = clamp((t - 4.0) / 0.6); if (t > 4.0) G.draw(c, spB, bx, cy, G.mesh(a, NA, NB, 0)); c.restore();
          k.text('driver', ax, 350, 1.8, 2.2, { size: 23, align: 'center' });
          k.text('driven', bx, 356, 4.2, 4.6, { size: 23, align: 'center' });
          k.text('driver: 20 teeth', TX, 44, 4.8, 5.5, { size: 25 });
          k.text('driven: 60 teeth', TX, 80, 5.6, 6.3, { size: 25 });
          k.text('gear ratio = 60 ÷ 20 = 3', TX, 128, 6.6, 8.0, { size: 26, color: RD });
          k.text('3:1', TX + 40, 186, 8.2, 9.0, { size: 46, font: 'bubble', color: RD });
          if (t >= T0 - 0.3) {                                 // the two turn counters
            const tA = 3 * u, tB = u, f = (v) => (Math.floor(v * 10 + 1e-6) / 10).toFixed(1);
            [[TX, 'driver turns', tA], [TX + 210, 'driven turns', tB]].forEach(([x, lab, v], i) => {
              Ink.stroke(c, geo.rect(x, 218, 178, 62, 8), { w: 2, seed: 31 + i, amp: 0.5, retrace: false });
              G.text(c, lab, x + 89, 240, { size: 20, align: 'center' });
              G.text(c, f(v), x + 89, 271, { size: 28, align: 'center', color: RD });
            });
          }
          k.text('input 300 rpm', TX, 318, 16.9, 17.7, { size: 24 });
          k.text('output = 300 ÷ 3 = 100 rpm', TX, 354, 17.9, 19.6, { size: 24, color: RD });
        },
        sound(k) {
          const st = (t, d, g = 0.4) => k.play('stroke', t, { material: 'pen', dur: d, gain: g });
          st(0.2, 1.4); st(1.7, 2.3); st(4.8, 1.4); st(6.6, 1.4); st(8.2, 0.8); st(16.9, 0.8); st(17.9, 1.6);
          for (let i = 0; i < 28; i++) k.play('tick', T0 + 0.6 + i * 0.2, { gain: 0.16 });
        },
      });
      keep(root.lastElementChild);

      // ---------------------------------------------------------------- count the teeth
      ui.el('h2', '', 'Count the teeth');
      ui.p('<b>Tap a gear</b> to tick off its teeth one at a time, starting from the red tooth. Then write down what you counted.');
      const sh = G.shell(ui, { step: 'Tap to count' });
      const mc = 10.5, NC = [12, 24], RC = NC.map((n) => G.R(n, mc)), Hc = 318, cyc = 150, cxs = [300 - RC[0] + 40, 0]; cxs[1] = cxs[0] + RC[0] + RC[1];
      const angs = [-2.2, 0]; angs[1] = G.mesh(angs[0], NC[0], NC[1], 0);
      const spC = NC.map((n) => G.sprite(n, mc));
      const cnt = [0, 0], pulse = [0, 0];
      const stC = G.stage(sh.cv, W, Hc, (ctx, dt) => {
        let more = false;
        NC.forEach((n, i) => {
          G.draw(ctx, spC[i], cxs[i], cyc, angs[i]);
          const rr = RC[i] + mc * 0.15;
          for (let j = 0; j < cnt[i]; j++) {                    // a red dot on each tooth already counted
            const a = angs[i] + (j * TAU) / n, last = j === cnt[i] - 1, r = last ? 5.2 + pulse[i] * 5 : 4.4;
            ctx.fillStyle = rgba(last ? RD : GR, 0.92); ctx.beginPath(); ctx.arc(cxs[i] + Math.cos(a) * rr, cyc + Math.sin(a) * rr, r, 0, 7); ctx.fill();
          }
          if (pulse[i] > 0) { pulse[i] = Math.max(0, pulse[i] - dt * 5); more = true; }
          const lx = i ? cxs[1] + RC[1] + 96 : cxs[0] - RC[0] - 96;
          G.text(ctx, i ? 'DRIVEN' : 'DRIVER', lx, cyc - 34, { size: 23, align: 'center' });
          const P = geo.rect(lx - 62, cyc - 20, 124, 58, 8);
          Ink.stroke(ctx, P, { w: 2, seed: 51 + i, amp: 0.5, retrace: false });
          G.text(ctx, String(cnt[i]), lx, cyc + 23, { size: 38, align: 'center', color: RD });
          G.text(ctx, cnt[i] === n ? 'all the way round!' : cnt[i] ? 'counted so far' : 'tap the gear', lx, cyc + 66, { font: 'hand', size: 21, align: 'center', color: cnt[i] === n ? GR : B });
        });
        return more;
      });
      NC.forEach((n, i) => {
        const h = G.handle(sh.cv, W, Hc, cxs[i], cyc, RC[i] + 16); h.style.touchAction = 'manipulation'; h.style.cursor = 'pointer';
        h.addEventListener('click', () => { if (cnt[i] >= n) return; cnt[i]++; pulse[i] = 1; Book.sfx(cnt[i] === n ? 'success' : 'tick', { gain: cnt[i] === n ? 0.3 : 0.45 }); stC.go(); });
      });
      const again = G.button(ui, 'btn ghost', '↺ Start counting again', sh.btns);
      again.onclick = () => { cnt[0] = cnt[1] = 0; stC.go(); };

      const echo = (act, pairs) => pairs.forEach(([k, cls, word]) => {       // show the student's own answer in a later line
        const inp = act.querySelectorAll('input.blank')[k], outs = act.querySelectorAll('.' + cls);
        const upd = () => outs.forEach((o) => (o.textContent = inp.value.trim() || word));
        inp.addEventListener('input', upd); upd();
      });
      const numeric = (act, idx, w) => act.querySelectorAll('input.blank').forEach((inp, i) => { if (!idx || idx.includes(i)) { inp.inputMode = 'decimal'; inp.style.width = w || '4.6em'; } });

      const cAct = ui.fill({
        id: 'p05.count', label: 'Count the teeth: driver 12, driven 24, ratio 2',
        html: 'Teeth on the driver = {{12}} &nbsp; Teeth on the driven = {{24}}<br>Gear ratio = driven ÷ driver = <b class="cgp-echo e1"></b> ÷ <b class="cgp-echo e0"></b> = {{2|2.0|2:1}}',
        explain: 'The driver has 12 teeth and the driven gear has 24, so the gear ratio is 24 ÷ 12 = <b>2</b> (written 2:1).',
      });
      echo(cAct, [[0, 'e0', '(driver)'], [1, 'e1', '(driven)']]); numeric(cAct);

      // ---------------------------------------------------------------- calculations
      ui.el('h2', '', 'Your turn: four calculations');
      const c1 = ui.fill({
        id: 'p05.calc1', label: 'Calc 1: ratio, driver 12 / driven 48',
        q: '<b>1.</b> A clock has a <b>driver gear with 12 teeth</b> meshed with a <b>driven gear with 48 teeth</b>.',
        html: 'Gear ratio = teeth on driven ÷ teeth on driver = {{48}} ÷ {{12}} = {{4|4.0}}<br>Written as a ratio, your answer is <b class="cgp-echo e2"></b> : {{1|one}}<br>So the driver turns <b class="cgp-echo e2"></b> times for every one turn of the driven gear.',
        explain: 'Driven ÷ driver = 48 ÷ 12 = <b>4</b>, written <b>4:1</b>. The driver turns 4 times for each turn of the driven gear.',
      });
      echo(c1, [[2, 'e2', '(your ratio)']]); numeric(c1);

      const c2 = ui.fill({
        id: 'p05.calc2', label: 'Calc 2: ratio + output speed, 15 → 45, 600 rpm',
        q: '<b>2.</b> A food mixer motor turns a <b>15-tooth driver</b> at <b>600&nbsp;rpm</b>. It meshes with a <b>45-tooth driven</b> gear.',
        html: 'Gear ratio = 45 ÷ 15 = {{3|3.0|3:1}}<br>Output speed = input speed ÷ gear ratio = 600 ÷ <b class="cgp-echo e0"></b> = {{200|200.0}} rpm',
        explain: 'Ratio = 45 ÷ 15 = <b>3</b> (3:1). Output speed = 600 ÷ 3 = <b>200 rpm</b>: slower, but with more torque.',
      });
      echo(c2, [[0, 'e0', '(your ratio)']]); numeric(c2);

      const c3 = ui.fill({
        id: 'p05.calc3', label: 'Calc 3: gearing up, 60 → 30, 120 rpm',
        q: '<b>3.</b> A hand whisk: you turn a <b>60-tooth driver</b> at <b>120&nbsp;rpm</b>. It meshes with a <b>30-tooth driven</b> gear on the beater.',
        html: 'Gear ratio = 30 ÷ 60 = {{0.5|.5|0,5|1/2|½|1:2|0.50}} <span class="small">(a decimal or a fraction)</span><br>Output speed = 120 ÷ <b class="cgp-echo e0"></b> = {{240|240.0}} rpm<br>The output is {{faster|quicker|higher}} than the input, so this is gearing {{up}}.',
        explain: 'Ratio = 30 ÷ 60 = <b>0.5</b> (1:2). Output = 120 ÷ 0.5 = <b>240 rpm</b>. A ratio less than 1 means the output is faster: gearing up.',
      });
      echo(c3, [[0, 'e0', '(your ratio)']]); numeric(c3, [0, 1]);

      // calculation 4: an idler in the train (drawn, turning)
      const mi = 3.6, NT = [20, 10, 40], RT = NT.map((n) => G.R(n, mi)), tx = [290, 0, 0]; tx[1] = tx[0] + RT[0] + RT[1]; tx[2] = tx[1] + RT[1] + RT[2];
      const c4 = ui.fill({
        id: 'p05.calc4', label: 'Calc 4: idler in the train, 20 → 10 → 40, 400 rpm',
        q: '<b>4.</b> A gear train with an <b>idler</b>: driver <b>20 teeth</b> → idler <b>10 teeth</b> → driven <b>40 teeth</b>. The driver turns at <b>400&nbsp;rpm</b>. Work it out the long way, one pair at a time, then the short way.<div class="p05-train"></div>',
        html: '<b>Driver → idler:</b> ratio = 10 ÷ 20 = {{0.5|.5|0,5|1/2|½|1:2|0.50}}, so the idler turns at 400 ÷ <b class="cgp-echo e0"></b> = {{800}} rpm<br>' +
          '<b>Idler → driven:</b> ratio = 40 ÷ 10 = {{4|4.0|4:1}}, so the driven turns at <b class="cgp-echo e1"></b> ÷ <b class="cgp-echo e2"></b> = {{200}} rpm<br>' +
          '<b>Short way, ignoring the idler:</b> ratio = 40 ÷ 20 = {{2|2.0|2:1}}, so the driven turns at 400 ÷ <b class="cgp-echo e4"></b> = {{200}} rpm',
        explain: 'Both ways give <b>200 rpm</b>. The idler\'s teeth cancel out, so only the <b>driver</b> and the <b>driven</b> gear count. (The idler still changes the direction.)',
      });
      echo(c4, [[0, 'e0', '(ratio)'], [1, 'e1', '(idler speed)'], [2, 'e2', '(ratio)'], [4, 'e4', '(ratio)']]); numeric(c4);
      {
        const host = c4.querySelector('.p05-train'), Ht = 214, cyt = 122, sp = NT.map((n) => G.sprite(n, mi)); let a = 0.4;
        G.stage(host, W, Ht, (ctx, dt) => {
          a += dt * 1.5;
          const a1 = G.mesh(a, NT[0], NT[1], 0), a2 = G.mesh(a1, NT[1], NT[2], 0);
          G.draw(ctx, sp[0], tx[0], cyt, a); G.draw(ctx, sp[1], tx[1], cyt, a1); G.draw(ctx, sp[2], tx[2], cyt, a2);
          G.text(ctx, 'driver', tx[0] - RT[0] - 14, cyt - 30, { size: 22, align: 'right' }); G.text(ctx, '20 teeth', tx[0] - RT[0] - 14, cyt - 4, { font: 'hand', size: 22, align: 'right' });
          G.text(ctx, '400 rpm', tx[0] - RT[0] - 14, cyt + 26, { size: 22, align: 'right', color: RD });
          G.text(ctx, 'idler · 10 teeth', tx[1] - 20, cyt - RT[2] - 12, { font: 'hand', size: 22, align: 'center' });
          Ink.stroke(ctx, [[tx[1] - 6, cyt - RT[2] - 6], [tx[1], cyt - RT[1] - 8]], { w: 1.8, seed: 5, retrace: false });
          G.text(ctx, 'driven', tx[2] + RT[2] + 16, cyt - 30, { size: 22 }); G.text(ctx, '40 teeth', tx[2] + RT[2] + 16, cyt - 4, { font: 'hand', size: 22 });
          G.text(ctx, '? rpm', tx[2] + RT[2] + 16, cyt + 26, { size: 22, color: RD });
          return true;
        });
      }

      // ---------------------------------------------------------------- checks
      ui.el('h2', '', 'Check');
      ui.p('<span class="small">The notes and the worked example blur while you answer these two.</span>');
      const q1 = ui.mcq({
        id: 'p05.upside', label: 'Which working gives the gear ratio? (driver 16, driven 64)',
        q: 'A <b>driver gear with 16 teeth</b> meshes with a <b>driven gear with 64 teeth</b>. Which working is correct?',
        options: [
          { t: 'gear ratio = 64 ÷ 16 = 4, written 4:1', ok: true, why: 'Yes: teeth on the driven ÷ teeth on the driver.' },
          { t: 'gear ratio = 16 ÷ 64 = 0.25, written 1:4', mis: 'ratio-upside-down', why: 'That is upside down: it is driver ÷ driven. The DRIVEN gear goes on top. A small driver turning a big driven gear slows things down, so the ratio must be more than 1.' },
          { t: 'gear ratio = 64 − 16 = 48, written 48:1', why: 'A ratio compares by dividing, not subtracting. Divide the teeth on the driven gear by the teeth on the driver.' },
          { t: 'gear ratio = 64 × 16 = 1024, written 1024:1', why: 'A ratio compares by dividing, not multiplying. Divide the teeth on the driven gear by the teeth on the driver.' },
        ],
      });
      const q2 = ui.mcq({
        id: 'p05.speed', label: 'Output speed: input 800 rpm, gear ratio 5:1',
        q: 'A motor turns at <b>800&nbsp;rpm</b>. It drives a gear train with a gear ratio of <b>5:1</b>. What is the output speed?',
        options: [
          { t: '160 rpm', ok: true, why: 'Yes: output speed = input speed ÷ gear ratio = 800 ÷ 5 = 160 rpm.' },
          { t: '4000 rpm', mis: 'speed-multiply', why: 'You multiplied (800 × 5). A 5:1 ratio means the driver turns 5 times for 1 turn of the output, so the output is slower: divide.' },
          { t: '795 rpm', why: 'You subtracted. A ratio works by dividing: output speed = input speed ÷ gear ratio.' },
          { t: '805 rpm', why: 'You added. A ratio works by dividing: output speed = input speed ÷ gear ratio.' },
        ],
      });
      ui.hideWhile(q1, 'p05.upside', notes); ui.hideWhile(q2, 'p05.speed', notes);

      // ---------------------------------------------------------------- other gears (mention only)
      const box = ui.box('Spur gears are not the only kind. You only need to <b>recognise</b> these three:', { tag: 'Other types of gear (not tested today)' });
      const host = ui.el('div', 'cgp-cvwrap', '', box), Hs = 232, PX = [150, 430, 716];
      const spW = G.sprite(22, 4.2, { mark: false }), spP = G.sprite(12, 6, { mark: false });
      const line = (ctx, P, w = 2, col = B, a = 0.92) => { ctx.strokeStyle = rgba(col, a); ctx.lineWidth = w; ctx.beginPath(); P.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); };
      let ts = 0;
      G.stage(host, W, Hs, (ctx, dt) => {
        ts += dt;
        // --- bevel gears: two cones meeting at 90°
        { const ox = PX[0] + 22, oy = 96, ph = ts * 1.6, d0 = 26, d1 = 62;
          ctx.save(); ctx.translate(ox, oy);
          line(ctx, [[-d0, -d0], [-d1, -d1], [-d1, d1], [-d0, d0], [-d0, -d0]], 2.2);
          line(ctx, [[-d0, d0], [-d1, d1], [d1, d1], [d0, d0], [-d0, d0]], 2.2);
          for (let i = 0; i < 14; i++) {
            const p1 = ph + (i * TAU) / 14, p2 = -ph + ((i + 0.5) * TAU) / 14;
            if (Math.sin(p1) > 0) line(ctx, [[-d0, d0 * Math.cos(p1)], [-d1, d1 * Math.cos(p1)]], 1.5, B, 0.8);
            if (Math.sin(p2) > 0) line(ctx, [[d0 * Math.cos(p2), d0], [d1 * Math.cos(p2), d1]], 1.5, B, 0.8);
          }
          line(ctx, [[-d1, -7], [-d1 - 48, -7]], 2); line(ctx, [[-d1, 7], [-d1 - 48, 7]], 2);            // input shaft
          line(ctx, [[-7, d1], [-7, d1 + 40]], 2); line(ctx, [[7, d1], [7, d1 + 40]], 2);                // output shaft, at 90°
          ctx.restore();
          G.arc(ctx, ox - d1 - 30, oy, 20, -1.2, 1.2, 1, { w: 2.2, head: 9, seed: 3 });
        }
        // --- worm and worm wheel
        { const ox = PX[1], R = G.R(22, 4.2), wy = 56, wh = 30, p = Math.PI * 4.2, sft = (ts * 20) % p, wcY = wy + wh / 2 + R + 6;
          G.draw(ctx, spW, ox, wcY, (ts * 20) / R - Math.PI / 2 + Math.PI / 22);
          ctx.save(); ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = 'rgba(251,250,245,.96)'; ctx.fillRect(ox - 66, wy - wh / 2, 132, wh); ctx.restore();
          line(ctx, [[ox - 66, wy - wh / 2], [ox + 66, wy - wh / 2], [ox + 66, wy + wh / 2], [ox - 66, wy + wh / 2], [ox - 66, wy - wh / 2]], 2.2);
          ctx.save(); ctx.beginPath(); ctx.rect(ox - 66, wy - wh / 2, 132, wh); ctx.clip();
          for (let x = -90; x < 90; x += p) line(ctx, [[ox + x + sft - 5, wy + wh / 2], [ox + x + sft + 5, wy - wh / 2]], 2.4);
          ctx.restore();
          line(ctx, [[ox - 66, wy - 5], [ox - 108, wy - 5]], 2); line(ctx, [[ox - 66, wy + 5], [ox - 108, wy + 5]], 2);
          G.arc(ctx, ox - 92, wy, 17, -1.2, 1.2, 1, { w: 2.2, head: 9, seed: 5 });
          G.text(ctx, 'worm', ox + 74, wy + 7, { font: 'hand', size: 22 });
        }
        // --- rack and pinion
        { const ox = PX[2], m = 6, R = G.R(12, m), py = 84, th = 1.15 * Math.sin(ts * 1.25), p = Math.PI * m, yl = py + R;
          G.draw(ctx, spP, ox, py, Math.PI / 2 + th);
          const x0 = -R * th, tan = Math.tan((20 * Math.PI) / 180), ad = 0.92 * m, de = 1.2 * m, hw = p * 0.233, P = [];
          ctx.save(); ctx.beginPath(); ctx.rect(ox - 122, 0, 244, Hs); ctx.clip();
          for (let k = -9; k <= 9; k++) { const c = ox + x0 + (k + 0.5) * p; P.push([c - hw - de * tan, yl + de], [c - hw + ad * tan, yl - ad], [c + hw - ad * tan, yl - ad], [c + hw + de * tan, yl + de]); }
          const x1 = P[P.length - 1][0], xa = P[0][0];
          line(ctx, P.concat([[x1, yl + de + 16], [xa, yl + de + 16], [xa, yl + de]]), 2.2);
          ctx.restore();
          line(ctx, [[ox - 122, yl + de + 26], [ox + 122, yl + de + 26]], 1.4, B, 0.5);
          const ay = yl + de + 44; line(ctx, [[ox - 60, ay], [ox + 60, ay]], 2.2, RD); line(ctx, [[ox - 50, ay - 7], [ox - 60, ay], [ox - 50, ay + 7]], 2.2, RD); line(ctx, [[ox + 50, ay - 7], [ox + 60, ay], [ox + 50, ay + 7]], 2.2, RD);
          G.text(ctx, 'pinion', ox + R + 12, py - 14, { font: 'hand', size: 22 }); G.text(ctx, 'rack', ox - 118, yl - 12, { font: 'hand', size: 22 });
        }
        ['Bevel gears', 'Worm & worm wheel', 'Rack & pinion'].forEach((s, i) => G.text(ctx, s, PX[i], Hs - 8, { size: 22, align: 'center' }));
        return true;
      });
      ui.el('div', 'p05-types', '<div>Turn the drive through <b>90°</b>.<br><span class="small">e.g. a hand drill</span></div><div>A <b>very large speed reduction</b>, through 90°. The wheel cannot drive the worm.<br><span class="small">e.g. guitar tuning pegs</span></div><div>Changes <b>rotary ↔ linear</b> motion.<br><span class="small">e.g. pillar drill handle, steering</span></div>', box);
      if (!document.getElementById('p05-css')) {
        const s = document.createElement('style'); s.id = 'p05-css';
        s.textContent = '.p05-types { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px 16px; font-size: 17px; line-height: 1.45; text-align: center; } .p05-types b { font-family: Fredoka, system-ui; font-weight: 600; } .p05-train { margin-top: 6px; } @media (max-width: 700px) { .p05-types { font-size: 15px; gap: 6px 8px; } }';
        document.head.appendChild(s);
      }
    },
  });
})();
