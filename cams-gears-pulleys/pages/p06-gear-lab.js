// Page 6 — The gearbox challenge. A motor shaft at a fixed 600 rpm, an output shaft with a rev counter, and a
// tray of gears (10, 20, 30, 40, 60 teeth) to tap onto the driver, idler and driven positions. Five challenges;
// the rev counter only shows the result after RUN, and every run is recorded. Then a 2-mark written answer.
// Uses window.GearKit (defined in p04-gears.js).
(function () {
  'use strict';
  const G = window.GearKit, B = Ink.BLUE, RD = Ink.RED, GR = Ink.GREEN, rgba = Ink.rgba, geo = Ink.geo, TAU = Math.PI * 2;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const W = 860, Hh = 352, M = 3.8, DX = 128, CY = 210, MOTOR = 600, TRAY = [10, 20, 30, 40, 60];
  const SLOTS = ['driver', 'idler', 'driven'], NAME = { driver: 'Driver', idler: 'Idler', driven: 'Driven' };

  if (!document.getElementById('p06-css')) {
    const s = document.createElement('style'); s.id = 'p06-css';
    s.textContent = `
      .p06-slots { display: grid; grid-template-columns: repeat(3, 1fr) auto; gap: 8px; margin-top: 6px; }
      .p06-slots .opt { text-align: center; font-family: Fredoka, system-ui; font-weight: 600; font-size: 18px; min-height: 54px; padding: 6px 8px; line-height: 1.25; }
      .p06-slots .opt small { display: block; font: 700 12px Fredoka, system-ui; letter-spacing: .07em; text-transform: uppercase; color: var(--red); }
      .p06-slots .opt.sel { box-shadow: 0 0 0 3px rgba(178,28,38,.75); border-color: var(--red); }
      .p06-tray { display: flex; flex-wrap: wrap; gap: 8px; align-items: stretch; margin-top: 8px; }
      .p06-tray .opt { flex: 1 1 96px; display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 6px; text-align: center; font-family: Fredoka, system-ui; font-weight: 600; font-size: 19px; padding: 4px 6px; min-height: 64px; }
      .p06-tray .opt small { font-size: 13px; font-weight: 600; }
      .p06-tray .opt canvas { display: block; pointer-events: none; flex: none; }
      .p06-tray .opt.none { flex: 0 1 110px; color: var(--red); font-size: 16px; }
      .p06-traylab { font: 700 13px Fredoka, system-ui; letter-spacing: .07em; text-transform: uppercase; color: var(--red); margin-top: 10px; line-height: 18px; }
      .p06-dots { float: right; font: 700 15px Fredoka, system-ui; letter-spacing: .12em; color: var(--ink); }
      .p06-dots .ok { color: var(--green); } .p06-dots .no { color: var(--red); }
      .p06-hint { font-size: 16px; line-height: 1.5; margin-top: 6px; color: var(--ink); }
      .p06-run { min-width: 120px; font-size: 21px !important; letter-spacing: .06em; margin-top: 0 !important; }
      @media (max-width: 700px) { .p06-slots .opt { font-size: 15px; } .p06-run { min-width: 84px; padding: 8px 10px !important; } .p06-tray .opt { flex: 1 1 28%; min-height: 56px; } }
    `;
    document.head.appendChild(s);
  }

  const CH = [
    { id: 'p06.c1', label: 'Challenge 1: 600 rpm → 200 rpm', target: 200,
      say: '<b>Food mixer.</b> The motor spins at <b>600&nbsp;rpm</b>: far too fast for a dough hook. Build a gear train that makes the output turn at <b>200&nbsp;rpm</b>.',
      hint: '200 is 3 times slower than 600. So the driven gear needs 3 times as many teeth as the driver.' },
    { id: 'p06.c2', label: 'Challenge 2: 600 rpm → 1200 rpm (gear up)', target: 1200,
      say: '<b>Desk fan.</b> The blades must spin faster than the motor. Make the output turn at <b>1200&nbsp;rpm</b>.',
      hint: '1200 is twice as fast as 600. To gear UP, the driver must be the bigger gear: twice as many teeth as the driven.' },
    { id: 'p06.c3', label: 'Challenge 3: 150 rpm, same direction as motor', target: 150, same: true,
      say: '<b>Conveyor belt.</b> The roller must turn at <b>150&nbsp;rpm</b>, and in the <b>SAME direction</b> as the motor.',
      hint: '600 ÷ 150 = 4, so the driven gear needs 4 times as many teeth as the driver. Two meshed gears turn opposite ways: what can you put between them?' },
    { id: 'p06.c4', label: 'Challenge 4: winch, most torque possible', torque: true,
      say: '<b>Boat winch.</b> It has to drag a heavy boat up the beach. Build the gear train that gives the <b>most torque</b> you can get from these gears.',
      hint: 'More torque always costs speed. Which two gears give the slowest output of all?' },
    { id: 'p06.c5', label: 'Challenge 5: 900 rpm, same direction as motor', target: 900, same: true,
      say: '<b>Pillar drill.</b> The chuck must turn at exactly <b>900&nbsp;rpm</b>, in the <b>SAME direction</b> as the motor.',
      hint: '900 is 1½ times faster than 600, so the driver needs 3 teeth for every 2 on the driven gear. And do not forget the direction.' },
  ];
  const near = (a, b) => Math.abs(a - b) < 1e-9;
  const rpmOf = (t) => (MOTOR * t.driver) / t.driven;
  const fmt = (v) => (Math.round(v * 10) / 10).toString();
  const trainStr = (t) => t.driver + ' → ' + (t.idler ? '(idler ' + t.idler + ') → ' : '') + t.driven;
  function judge(ch, t) {                                  // -> { ok, mis[] }
    const ratio = t.driven / t.driver, mis = [];
    if (ch.torque) { const ok = t.driver === 10 && t.driven === 60; if (!ok && ratio < 1) mis.push('speed-torque'); return { ok, mis }; }
    const want = MOTOR / ch.target, okSpeed = near(ratio, want), okDir = !ch.same || !!t.idler;
    if (!okSpeed) {
      if (near(ratio, 1 / want)) mis.push('ratio-upside-down');
      else if ((want > 1 && ratio < 1) || (want < 1 && ratio > 1)) mis.push('big-is-fast');
      if (t.idler && (near(t.idler / t.driver, want) || near(t.driven / t.idler, want))) mis.push('idler-ratio');
    }
    if (!okDir) mis.push('gear-direction');
    return { ok: okSpeed && okDir, mis };
  }

  Book.page({
    id: 'p06',
    title: 'The gearbox challenge',
    build(ui, root) {
      if (!G) { ui.h('The gearbox challenge'); ui.p('This page needs the gears page to load first.'); return; }
      const items = Book.state.items;
      ui.h('The gearbox challenge');
      ui.p('You are the engineer. The <b>motor</b> always turns at <b>600&nbsp;rpm</b>, clockwise. Pick gears from the tray to make the <b>output shaft</b> do each job.');
      ui.p('<span class="small">Remember: gear ratio = teeth on driven ÷ teeth on driver, and output speed = input speed ÷ gear ratio. The rev counter only shows the answer when you press RUN, and <b>every run is recorded</b>, so work it out first!</span>');

      const recs = CH.map((ch) => ui.record(ch.id, { label: ch.label, type: 'experiment', max: 1 }));
      const sh = G.shell(ui);
      const dots = ui.el('span', 'p06-dots', '', sh.step), stepTxt = ui.el('span', '', '', sh.step);

      // ---------------------------------------------------------------- the bench
      const T = { driver: 0, idler: 0, driven: 0 };
      const S = { slot: 'driver', run: false, a: -0.5, t: 0, shown: 0, free: false, k: 0, locked: false };
      const motorL = G.layer(110, 110, (x) => {
        x.translate(55, 55);
        const P = geo.rect(-40, -40, 80, 80, 12);
        Ink.hatchShadow(x, P, 1, 6, 6); Ink.stroke(x, P, { w: 2.4, seed: 4 });
        Ink.stroke(x, geo.ellipse(0, 0, 30, 30), { w: 2, seed: 6, amp: 0.4, retrace: false });
        [[-30, -30], [30, -30], [30, 30], [-30, 30]].forEach(([a, b]) => { x.fillStyle = rgba(B, 0.85); x.beginPath(); x.arc(a, b, 3.2, 0, 7); x.fill(); });
      });
      const layout = () => {                                // centres + radii of what is on the bench
        const rd = G.R(T.driver || 20, M), ghost = !T.idler && S.slot === 'idler' && !S.run, ni = T.idler || (ghost ? 20 : 0), ri = ni ? G.R(ni, M) : 0, rn = G.R(T.driven || 20, M);
        return { rd, ri, rn, ix: DX + rd + ri, nx: DX + rd + 2 * ri + rn, ghost };
      };
      const box = (ctx, x, y, w, h, seed) => {
        const P = geo.rect(x - w / 2, y, w, h, 8);
        ctx.save(); ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = 'rgba(255,255,255,.92)'; G.path(ctx, P); ctx.fill(); ctx.restore();
        Ink.stroke(ctx, P, { w: 2, seed, amp: 0.5, retrace: false });
      };
      const ring = (ctx, x, y, r, on) => { ctx.save(); ctx.strokeStyle = rgba(RD, on ? 0.9 : 0.5); ctx.lineWidth = on ? 3 : 2; ctx.setLineDash([8, 7]); ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.stroke(); ctx.restore(); };
      const stage = G.stage(sh.cv, W, Hh, (ctx, dt) => {
        const L = layout(); let more = false;
        if (S.run) { S.t += dt; S.a += TAU * 0.3 * dt; more = true; tick(TAU * 0.3 * dt); }
        // rail, motor
        Ink.stroke(ctx, geo.rect(DX - 60, CY - 7, W - DX + 20, 14, 7), { w: 1.4, seed: 3, amp: 0.5, retrace: false });
        ctx.drawImage(motorL, DX - 55, CY - 55, 110, 110);
        // gears
        const aI = T.idler ? G.mesh(S.a, T.driver || 20, T.idler, 0) : 0;
        if (T.driver) G.draw(ctx, G.sprite(T.driver, M), DX, CY, S.a); else { ring(ctx, DX, CY, L.rd, S.slot === 'driver'); G.text(ctx, 'driver?', DX, CY + L.rd + 28, { font: 'hand', size: 22, align: 'center', color: RD }); }
        if (T.idler) G.draw(ctx, G.sprite(T.idler, M), L.ix, CY, aI); else if (L.ghost) { ring(ctx, L.ix, CY, L.ri, true); G.text(ctx, 'idler?', L.ix, CY + L.ri + 28, { font: 'hand', size: 22, align: 'center', color: RD }); }
        if (T.driven) G.draw(ctx, G.sprite(T.driven, M), L.nx, CY, T.driver ? (T.idler ? G.mesh(aI, T.idler, T.driven, 0) : G.mesh(S.a, T.driver, T.driven, 0)) : 0.3);
        else { ring(ctx, L.nx, CY, L.rn, S.slot === 'driven'); G.text(ctx, 'driven?', L.nx, CY + L.rn + 28, { font: 'hand', size: 22, align: 'center', color: RD }); }
        if (!S.run && !S.locked) {                          // which position the next gear will go on
          const s = S.slot, x = s === 'driver' ? DX : s === 'idler' ? L.ix : L.nx, r = s === 'driver' ? L.rd : s === 'idler' ? L.ri : L.rn;
          if ((s === 'driver' && T.driver) || (s === 'idler' && T.idler) || (s === 'driven' && T.driven)) ring(ctx, x, CY, r + M + 7, true);
        }
        // read-outs
        const ox = clamp(L.nx, DX + 214, W - 112);
        box(ctx, DX, 30, 190, 48, 11); G.text(ctx, 'MOTOR SHAFT', DX, 22, { size: 20, align: 'center' });
        G.text(ctx, MOTOR + ' rpm', DX - 14, 64, { size: 27, align: 'center' }); G.text(ctx, '↻', DX + 70, 65, { size: 28, align: 'center', color: RD });
        box(ctx, ox, 30, 210, 48, 12); G.text(ctx, 'OUTPUT · REV COUNTER', ox, 22, { size: 20, align: 'center' });
        if (S.run && T.driver && T.driven) {
          const full = rpmOf(T), u = clamp(S.t / 0.9), v = u >= 1 ? full : Math.round((full * u) / 10) * 10;
          G.text(ctx, fmt(v) + ' rpm', ox - 14, 64, { size: 27, align: 'center', color: u >= 1 ? B : RD });
          if (u >= 1) G.text(ctx, T.idler ? '↻' : '↺', ox + 80, 65, { size: 28, align: 'center', color: RD });
          // arrows on the gears while they spin
          G.arc(ctx, DX, CY, L.rd + M + 12, -2.2, -1.1, 1, { seed: 21, w: 2.6, head: 12 });
          if (u >= 1) G.arc(ctx, L.nx, CY, L.rn + M + 12, -2.1, -1.0, T.idler ? 1 : -1, { seed: 25, w: 2.6, head: 12 });
          if (!S.shown && S.t > 1.05) { S.shown = 1; result(); }
        } else { G.text(ctx, '? rpm', ox, 64, { size: 27, align: 'center', color: RD }); }
        // tooth counts under the gears
        const labs = [];
        const lab = (x, r, s, col) => {
          let y = Math.min(Hh - 6, CY + r + M + 24);
          labs.forEach(([lx, ly]) => { if (Math.abs(lx - x) < 86 && Math.abs(ly - y) < 20) y = Math.min(Hh - 6, Math.max(y, ly) + 22); });
          labs.push([x, y]);
          ctx.save(); ctx.font = G.LABF(21); const tw = ctx.measureText(s).width + 12; ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = 'rgba(251,250,245,.9)'; ctx.beginPath(); ctx.roundRect(x - tw / 2, y - 19, tw, 25, 6); ctx.fill(); ctx.restore();
          G.text(ctx, s, x, y, { size: 21, align: 'center', color: col || B });
        };
        if (T.driver) lab(DX, L.rd, T.driver + ' teeth');
        if (T.driven) lab(L.nx, L.rn, T.driven + ' teeth');
        if (T.idler) lab(L.ix, L.ri, 'idler ' + T.idler, RD);
        return more;
      });
      let tAcc = 0; const tick = (d) => { tAcc += d; const p = TAU / (T.driver || 20); if (tAcc >= p) { tAcc %= p; Book.sfx('tick', { gain: 0.12 }); } };
      stage.c.style.cursor = 'pointer';
      stage.c.addEventListener('click', (e) => {            // tap a position on the bench to choose it
        if (S.locked) return; const [x, y] = stage.pos(e), L = layout(); if (y < 84) return;
        const c = [['driver', DX, L.rd], ['driven', L.nx, L.rn]]; if (L.ri) c.push(['idler', L.ix, L.ri]);
        const hit = c.map(([s, cx, r]) => [s, Math.hypot(x - cx, y - CY) - r]).sort((a, b) => a[1] - b[1])[0];
        if (hit[1] < 26) pickSlot(hit[0]);
      });

      // ---------------------------------------------------------------- controls
      const res = sh.res, runRow = sh.btns; sh.d.insertBefore(res, runRow);
      const pick = ui.el('div', 'p06-pick', '', sh.d); ui.el('div', 'p06-traylab', 'Tap a position, then tap a gear to fit on it', pick);
      const slotRow = ui.el('div', 'p06-slots', '', pick), trayRow = ui.el('div', 'p06-tray', '', pick);
      const slotB = {}; SLOTS.forEach((s) => { slotB[s] = G.button(ui, 'opt', '', slotRow); slotB[s].onclick = () => pickSlot(s); });
      const trayB = TRAY.map((n) => {
        const b = G.button(ui, 'opt', '', trayRow), sp = G.sprite(n, 0.9, { mark: false }), c = document.createElement('canvas');
        c.width = sp.width; c.height = sp.height; c.style.width = sp.w + 'px'; c.style.height = sp.h + 'px'; c.getContext('2d').drawImage(sp, 0, 0);
        b.appendChild(c); const sp2 = document.createElement('span'); sp2.innerHTML = n + '<small> teeth</small>'; b.appendChild(sp2); b.onclick = () => put(n); return b;
      });
      const noneB = G.button(ui, 'opt none', '✕ no idler', trayRow); noneB.onclick = () => put(0);
      const runB = G.button(ui, 'btn p06-run', '▶ RUN', slotRow), againB = G.button(ui, 'btn ghost', '↺ Change the gears', runRow), nextB = G.button(ui, 'btn', 'Next challenge ▸', runRow);
      const sync = () => {
        SLOTS.forEach((s) => {
          slotB[s].innerHTML = `<small>${s === 'driver' ? 'Driver · on the motor' : s === 'idler' ? 'Idler · optional' : 'Driven · output'}</small>${T[s] ? T[s] + ' teeth' : s === 'idler' ? 'none' : 'empty'}`;
          slotB[s].classList.toggle('sel', S.slot === s && !S.locked); slotB[s].disabled = S.locked;
        });
        trayB.forEach((b) => (b.disabled = S.locked)); noneB.disabled = S.locked || S.slot !== 'idler' || !T.idler;
        runB.disabled = S.locked || !T.driver || !T.driven; pick.style.display = S.locked ? 'none' : '';
        stage.go();
      };
      const pickSlot = (s) => { if (S.locked) return; S.slot = s; Book.sfx('tick', { gain: 0.4 }); sync(); };
      const put = (n) => {
        if (S.locked) return; T[S.slot] = n; Book.sfx(n ? 'pop' : 'tick', { gain: 0.45 });
        if (S.slot === 'driver' && !T.driven) S.slot = 'driven'; else if (S.slot === 'driven' && !T.driver) S.slot = 'driver';
        sync();
      };
      const unlock = () => { S.locked = false; S.run = false; S.shown = 0; S.t = 0; res.className = 'cgp-res'; res.innerHTML = ''; againB.style.display = 'none'; sync(); };
      againB.onclick = unlock;
      runB.onclick = () => { if (!T.driver || !T.driven) return; S.locked = true; S.run = true; S.t = 0; S.shown = 0; Book.sfx('pop', { gain: 0.5 }); sync(); try { sh.d.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (_) {} };

      // ---------------------------------------------------------------- challenges
      const finished = (k) => { const it = items[CH[k].id]; return !!it && (it.correct === true || it.done === true); };
      const drawDots = () => { dots.innerHTML = CH.map((c, k) => { const it = items[c.id]; return it && it.correct ? '<span class="ok">✓</span>' : it && it.done ? '<span class="no">✗</span>' : k === S.k && !S.free ? '●' : '○'; }).join(' '); };
      let tests = [];
      function challenge(k) {
        S.k = k; S.free = false; tests = ((recs[k].get() || {}).tests || []).slice();
        T.driver = T.idler = T.driven = 0; S.slot = 'driver';
        stepTxt.textContent = `Challenge ${k + 1} of ${CH.length}`; sh.task.innerHTML = CH[k].say;
        nextB.style.display = 'none'; nextB.className = 'btn'; nextB.textContent = k === CH.length - 1 ? 'Finish ▸' : 'Next challenge ▸';
        nextB.onclick = () => {
          if (!finished(k)) { const it = recs[k].get(); if (it) recs[k].set({ answer: it.answer + '; moved on without solving', done: true }); }
          k + 1 < CH.length ? challenge(k + 1) : freePlay();
        };
        drawDots(); unlock();
      }
      function freePlay() {
        S.free = true; T.driver = T.idler = T.driven = 0; S.slot = 'driver';
        stepTxt.textContent = 'Free play'; sh.task.innerHTML = 'All five challenges done! Now build <b>any</b> gear train you like. What is the fastest output you can make? The slowest?';
        nextB.style.display = 'none'; drawDots(); unlock();
      }
      function result() {
        const t = { driver: T.driver, idler: T.idler, driven: T.driven }, rpm = rpmOf(t), ratio = t.driven / t.driver, dir = t.idler ? 'same direction as the motor' : 'opposite direction to the motor';
        const tq = ratio >= 1 ? `torque × ${fmt(ratio)}` : `torque ÷ ${fmt(1 / ratio)}`;
        againB.style.display = '';
        if (S.free) { res.className = 'cgp-res on'; res.innerHTML = `<b style="font-family:Fredoka">${trainStr(t)}</b>: output <b>${fmt(rpm)} rpm</b>, ${dir} (${tq}).`; Book.sfx('tick', { gain: 0.4 }); return; }
        const ch = CH[S.k], r = recs[S.k], j = judge(ch, t);
        tests.push({ s: trainStr(t), rpm, same: !!t.idler, ok: j.ok, mis: j.mis });
        const mis = [...new Set(tests.filter((x) => !x.ok).flatMap((x) => x.mis))].join(',');
        r.set({ answer: tests.map((x, i) => `run ${i + 1}: ${x.s} = ${fmt(x.rpm)} rpm, ${x.same ? 'same' : 'opposite'} direction ${x.ok ? '✓' : '✗'}`).join('; '), correct: j.ok, score: j.ok ? 1 : 0, max: 1, mis, tests: tests.slice(), done: j.ok });
        Book.sfx(j.ok ? 'success' : 'error', { gain: 0.35 });
        let msg;
        if (j.ok) msg = `✓ ${tests.length === 1 ? 'First time! ' : 'Got it. '}` + (ch.torque ? `The smallest driver and the biggest driven gear give the slowest output (${fmt(rpm)} rpm), and so the most torque: ${fmt(ratio)} times the motor's.` : `${trainStr(t)} gives ${fmt(rpm)} rpm, ${dir}.`);
        else if (ch.torque) msg = `✗ That gives ${fmt(rpm)} rpm (${tq}). These gears can give more torque than that.`;
        else {
          const sp = near(rpm, ch.target), fails = [];
          if (!sp) fails.push(`the output turns at ${fmt(rpm)} rpm, not ${ch.target} rpm (${rpm > ch.target ? 'too fast' : 'too slow'})`);
          if (ch.same && !t.idler) fails.push((sp ? 'the speed is right, but ' : '') + 'it turns the opposite way to the motor');
          msg = '✗ Not yet: ' + fails.join(', and ') + '.';
        }
        res.className = 'cgp-res on ' + (j.ok ? 'good' : 'bad');
        res.innerHTML = msg + (!j.ok && tests.length >= 2 ? `<div class="p06-hint"><b>Hint:</b> ${ch.hint}</div>` : '');
        if (j.ok) { againB.style.display = 'none'; nextB.style.display = ''; }
        else if (tests.length >= 3) { nextB.style.display = ''; nextB.className = 'btn ghost'; nextB.textContent = 'Skip ▸'; }
        drawDots();
      }
      { const k = CH.findIndex((_, j) => !finished(j)); k < 0 ? freePlay() : challenge(k); }

      // ---------------------------------------------------------------- explain
      ui.el('h2', '', 'Explain it');
      ui.p('<span class="small">The gearbox above blurs while you write, so explain it in your own words.</span>');
      const w = ui.write({
        id: 'p06.explain', label: 'Explain: why a winch uses a small driver and a large driven gear', marks: 2, lines: 4,
        q: 'A winch uses a <b>small driver gear</b> and a <b>large driven gear</b>. Explain why.',
        scheme: ['A small driver turning a large driven gear makes the output turn <b>slower</b> (it gears down / has a high gear ratio)', 'A slower output has <b>more torque</b> (turning force), so the winch can pull or lift a heavy load'],
        model: 'The small driver has to turn many times to turn the large driven gear once, so the output is much slower than the motor. Slower output means more torque, so the winch can pull a heavy load that the motor could not move on its own.',
      });
      const checked = () => { const it = items['p06.explain']; return !!it && !!it.ticks; };
      w.querySelector('textarea').addEventListener('focus', () => { if (!checked()) sh.d.classList.add('peek-lock'); });
      w.addEventListener('click', () => setTimeout(() => { if (checked()) sh.d.classList.remove('peek-lock'); }, 60));
      w.querySelector('textarea').addEventListener('blur', () => setTimeout(() => { if (!w.querySelector('textarea').value.trim()) sh.d.classList.remove('peek-lock'); }, 80));
    },
  });
})();
