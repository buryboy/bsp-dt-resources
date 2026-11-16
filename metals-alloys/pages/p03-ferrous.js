// Page 3 — Ferrous metals & the carbon rule. The carbon lab: slide the carbon content of an iron sample from
// 0.1% to 3.5% and run three rigs on it (a press/dent test, a bend test and a drop test); log the results, conclude
// the carbon rule, then meet the three ferrous metals on the carbon line; sort ten products; fill the blanks.
(function () {
  'use strict';
  const B = Ink.BLUE, RD = Ink.RED, rgba = Ink.rgba, geo = Ink.geo;
  const HANDF = (s) => `400 ${s}px "Gloria Hallelujah", "Comic Sans MS", cursive`;
  const LABF = (s) => `600 ${s}px Fredoka, "Arial Rounded MT Bold", system-ui, sans-serif`;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const close = (P) => P.concat([P[0]]);
  const PAPER = '#fbfaf5';

  function text(x, s, px, py, o = {}) {
    x.save(); x.font = (o.font === 'hand' ? HANDF : LABF)(o.size || 22);
    x.fillStyle = rgba(o.color || B, o.a ?? 0.92); x.textAlign = o.align || 'left'; x.textBaseline = 'alphabetic';
    x.translate(px, py); if (o.rot) x.rotate(o.rot); x.fillText(s, 0, 0); x.restore();
  }
  function pen(x, pts, o = {}) {
    const P = o.wob === false ? pts : geo.wob(geo.seg(pts, 3), o.seed ?? 11, o.amp ?? 0.6);
    x.save(); x.strokeStyle = rgba(o.color || B, o.a ?? 0.85); x.lineWidth = o.w ?? 1.6; x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath();
    P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); if (o.close) x.closePath(); x.stroke(); x.restore();
  }
  // a flat felt-tip wash inside a closed shape (drawn before the ink so the ink sits on top)
  function wash(x, pts, css) { x.save(); x.fillStyle = css; x.beginPath(); pts.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.closePath(); x.fill(); x.restore(); }

  // an interactive canvas with an on-demand render loop (stops when the page is hidden)
  function Stage(parent, W, Hh) {
    const c = document.createElement('canvas'); parent.appendChild(c);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = Math.round(W * dpr); c.height = Math.round(Hh * dpr);
    Object.assign(c.style, { width: '100%', height: 'auto', aspectRatio: W + ' / ' + Hh, display: 'block', touchAction: 'pan-y', userSelect: 'none', webkitUserSelect: 'none', webkitTouchCallout: 'none', cursor: 'pointer' });
    const ctx = c.getContext('2d');
    const S = { c, ctx, W, H: Hh, render: () => false };
    S.pos = (e) => { const r = c.getBoundingClientRect(); return [((e.clientX - r.left) * W) / r.width, ((e.clientY - r.top) * Hh) / r.height]; };
    S.layer = (w, h, paint) => { const L = document.createElement('canvas'); L.width = Math.ceil(w * dpr); L.height = Math.ceil(h * dpr); const x = L.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.lineCap = 'round'; x.lineJoin = 'round'; paint(x); L.w = w; L.h = h; return L; };
    S.blit = (L, px, py) => ctx.drawImage(L, px, py, L.w, L.h);
    const hidden = () => { const p = c.closest('.page'); return !p || p.classList.contains('hidden'); };
    let raf = 0, wait = 0, last = 0;
    const tick = (now) => {
      raf = 0;
      if (hidden()) { last = 0; if (!wait) wait = setTimeout(() => { wait = 0; S.go(); }, 400); return; }
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60; last = now;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.globalCompositeOperation = 'source-over'; ctx.clearRect(0, 0, W, Hh);
      ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = 1; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      if (S.render(dt, now / 1000)) raf = requestAnimationFrame(tick); else last = 0;
    };
    S.go = () => { if (!raf) raf = requestAnimationFrame(tick); };
    // drag inside a hit zone: that touch no longer scrolls the page; everywhere else a vertical swipe still scrolls
    S.drag = (hit, on) => {
      let id = null;
      c.addEventListener('touchstart', (e) => { if (hit(S.pos(e.changedTouches[0]))) e.preventDefault(); }, { passive: false });
      c.addEventListener('pointerdown', (e) => { const p = S.pos(e); if (id !== null || !hit(p)) return; id = e.pointerId; try { c.setPointerCapture(id); } catch (er) {} on.start && on.start(p); S.go(); });
      c.addEventListener('pointermove', (e) => { if (e.pointerId !== id) return; on.move && on.move(S.pos(e)); S.go(); });
      ['pointerup', 'pointercancel'].forEach((ev) => c.addEventListener(ev, (e) => { if (e.pointerId !== id) return; id = null; on.end && on.end(S.pos(e)); S.go(); }));
      S.dragging = () => id !== null;
    };
    S.dragging = () => false;
    c.addEventListener('contextmenu', (e) => e.preventDefault());
    if (document.fonts) document.fonts.ready.then(() => { S.onFonts && S.onFonts(); S.go(); });
    return S;
  }

  const dot = (x, px, py, r, c = B, a = 0.9) => { x.fillStyle = rgba(c, a); x.beginPath(); x.arc(px, py, r, 0, 7); x.fill(); };
  const sstep = (a, b, v) => { const u = clamp((v - a) / (b - a)); return u * u * (3 - 2 * u); };
  if (!document.getElementById('ma3-css')) {
    const s = document.createElement('style'); s.id = 'ma3-css';
    s.textContent = `
      .m3-lab { position: relative; margin: 0 0 var(--R); }
      .m3-row { display: flex; flex-wrap: wrap; gap: 14px; align-items: center; margin: 4px 0 12px; }
      .m3-row .btn { margin-top: 0; min-height: 58px; min-width: 230px; font-size: 20px; }
      .m3-row .opt { flex: 0 0 auto; min-width: 64px; min-height: 58px; text-align: center; font: 700 24px Fredoka, system-ui; }
      .m3-stat { flex: 1 1 240px; font-size: 18px; line-height: 1.5; }
      .m3-stat b { font-family: Fredoka, system-ui; font-weight: 600; }
      .m3-log { width: 100%; border-collapse: collapse; margin: 0 0 var(--R); background: rgba(251,250,245,.9); font-size: 17px; line-height: 1.35; }
      .m3-log th { font: 700 15px Fredoka, system-ui; text-align: left; padding: 6px 8px; border-bottom: 2px solid rgba(30,46,150,.6); }
      .m3-log td { padding: 7px 8px; border-bottom: 1px dashed rgba(30,46,150,.35); vertical-align: top; }
      .m3-log td:first-child { font: 700 18px Fredoka, system-ui; white-space: nowrap; }
      .m3-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; margin: 0 0 6px; }
      .m3-cards .box { margin: 0 0 12px; font-size: 18px; line-height: 1.5; }
      .m3-cards .box b.n { font: 700 21px Fredoka, system-ui; display: block; }
      .m3-hide { display: none !important; }
    `;
    document.head.appendChild(s);
  }

  // ---------------------------------------------------------------- the model behind the three rigs
  // (illustrative figures, monotonic in carbon so the pattern is clear: see the page report)
  const dentMM = (c) => Math.round((2.1 - 0.5 * c) * 10) / 10;                        // dent depth under the same load
  const snapAt = (c) => (c <= 0.3 ? null : Math.max(3, Math.round(90 * Math.exp(-1.05 * (c - 0.3)))));  // bend angle when it snaps (null = bends to 90°)
  const hitRes = (c) => (c < 0.6 ? 0 : c < 2.2 ? 1 : 2);                              // 0 dented, 1 cracked, 2 broke in two
  const HIT = ['dented, no crack', 'cracked', 'broke in two'];
  const bendTxt = (c) => (snapAt(c) == null ? 'bent to 90°, no crack' : `snapped at ${snapAt(c)}°`);
  const fmt = (c) => c.toFixed(1) + '%';

  Book.page({
    id: 'p03',
    title: 'Ferrous metals & the carbon rule',
    build(ui, root) {
      const got = (id) => Book.state.items[id];
      ui.h('The carbon rule');
      const intro = ui.p('Low carbon steel, high carbon steel and cast iron are the three <b>ferrous metals</b> you need to know. All three are <b>iron</b> with a different amount of one extra ingredient stirred in: <b>carbon</b>. So what does carbon do to iron?');

      const RIGHT = 'Harder, but more likely to snap';
      const pred = ui.predict({ id: 'p03.predict', label: 'Carbon lab prediction: what more carbon does to iron', q: '<b>Predict:</b> as more carbon is added to iron, the metal will get…',
        options: ['Harder, and easier to bend', RIGHT, 'Softer, and easier to bend', 'Softer, but more likely to snap'], onPick: () => unlock() });

      // ------------------------------------------------------------------ the carbon lab
      const hLab = ui.el('h2', '', 'The carbon lab');
      const how = ui.p('<b>Drag the red knob</b> to choose how much carbon is in the sample, then press <b>TEST</b>. All three rigs test a fresh piece of that metal: one presses a point into it, one bends it, one drops a weight on it. Test a <b>low</b>, a <b>middle</b> and a <b>high</b> carbon sample.');
      const lab = ui.el('div', 'm3-lab');
      const W = 860, HH = 540, LY = 104, LX0 = 70, LX1 = 720;
      const CX = (c) => LX0 + ((LX1 - LX0) * c) / 3.5;
      const S = Stage(lab, W, HH);
      const row = ui.el('div', 'm3-row', '', lab);
      const minus = ui.el('button', 'opt', '−', row); minus.type = 'button'; minus.setAttribute('aria-label', 'less carbon');
      const plus = ui.el('button', 'opt', '+', row); plus.type = 'button'; plus.setAttribute('aria-label', 'more carbon');
      const testB = ui.el('button', 'btn', '▶ TEST this sample', row); testB.type = 'button';
      const stat = ui.el('span', 'm3-stat', '', row);
      const lockMsg = ui.el('p', 'small red', 'Make your prediction first: then the lab switches on.', lab); lockMsg.style.margin = '0 0 8px';
      const rL = ui.record('p03.lab', { label: 'Carbon lab: samples tested (dent / bend / hit)', type: 'experiment', max: 1 });
      const tests = ((rL.get() || {}).tests || []).filter((c) => typeof c === 'number').slice();
      const need = () => ({ low: tests.some((c) => c <= 0.4), mid: tests.some((c) => c >= 0.6 && c <= 2), high: tests.some((c) => c >= 3) });
      const labDone = () => { const n = need(); return n.low && n.mid && n.high; };
      const ruleOK = () => !!(got('p03.rule') && got('p03.rule').correct === true);
      let carbon = tests.length ? tests[tests.length - 1] : 0.1, shown = tests.length > 0, run = shown ? 1 : 0, running = false, moved = tests.length > 0, sprS;
      const logT = ui.el('table', 'm3-log', '', lab);

      // rig geometry
      const BENCH = 478, A = 155, Bx = 430, C = 705;
      function art() {
        sprS = S.layer(W, HH, (x) => {
          // the carbon line
          Ink.stroke(x, [[LX0, LY], [LX1 + 14, LY]], { w: 3, seed: 3 });
          for (let k = 0; k <= 7; k++) { const tx = CX(k * 0.5); pen(x, [[tx, LY - 9], [tx, LY + 9]], { w: 1.8, wob: false }); text(x, (k * 0.5).toFixed(1), tx, LY + 36, { size: 22, align: 'center' }); }
          for (let k = 1; k < 35; k++) if (k % 5) { const tx = CX(k * 0.1); pen(x, [[tx, LY - 4], [tx, LY + 4]], { w: 1, wob: false, a: 0.5 }); }
          text(x, '% carbon', LX1 + 30, LY + 36, { size: 22 });
          // bench
          Ink.stroke(x, [[14, BENCH], [W - 14, BENCH]], { w: 2.8, seed: 5 });
          const rr = H.rng(4); for (let i = 0; i < 20; i++) { const gx = rr.range(20, W - 60), gy = rr.range(BENCH + 6, BENCH + 13); pen(x, [[gx, gy], [gx + rr.range(14, 40), gy]], { w: 1, a: 0.3, wob: false }); }
          text(x, '1  press test', A, 196, { size: 23, align: 'center' }); text(x, '2  bend test', Bx, 196, { size: 23, align: 'center' }); text(x, '3  drop test', C, 196, { size: 23, align: 'center' });
          // rig 1: frame, anvil
          Ink.stroke(x, [[A - 84, BENCH], [A - 84, 222], [A + 84, 222], [A + 84, BENCH]], { w: 2.6, seed: 11 });
          pen(x, [[A - 14, 222], [A - 14, 250]], { w: 2, wob: false }); pen(x, [[A + 14, 222], [A + 14, 250]], { w: 2, wob: false });
          const anv = [[A - 66, 448], [A + 66, 448], [A + 66, BENCH], [A - 66, BENCH]]; Ink.hatchFill(x, anv, 1, B, 1.7); Ink.stroke(x, close(anv), { w: 2.4, seed: 12 });
          // rig 2: a vice
          [[-52, -8], [8, 52]].forEach(([a, b], i) => { const j = [[Bx + a, 408], [Bx + b, 408], [Bx + b, BENCH], [Bx + a, BENCH]]; wash(x, j, PAPER); Ink.hatchFill(x, j, 1, B, 1.7); Ink.stroke(x, close(j), { w: 2.4, seed: 14 + i }); });
          pen(x, [[Bx + 52, 440], [Bx + 92, 440]], { w: 3, wob: false }); pen(x, [[Bx + 92, 424], [Bx + 92, 456]], { w: 3, wob: false });
          // rig 3: two supports and the release clamp for the weight
          [-66, 66].forEach((d, i) => { const sp = [[C + d - 16, BENCH], [C + d, 432], [C + d + 16, BENCH]]; Ink.hatchFill(x, sp, 1, B, 1.7); Ink.stroke(x, close(sp), { w: 2.4, seed: 17 + i }); });
          Ink.stroke(x, [[C + 96, BENCH], [C + 96, 222], [C, 222], [C, 236]], { w: 2.6, seed: 19 });
        });
      }
      art(); S.onFonts = art;

      S.render = (dt, t) => {
        const x = S.ctx; let busy = S.dragging();
        if (running) { run = Math.min(1, run + dt / 1.9); busy = true; if (run >= 1) { running = false; shown = true; finishTest(); } }
        const c = carbon, u = run, live = running || shown;
        S.blit(sprS, 0, 0);
        // ---- the three named metals on the line (only once the rule has been worked out)
        if (ruleOK()) {
          const br = (c0, c1, y, label, lx, ly, al) => { pen(x, [[CX(c0), y + 10], [CX(c0), y], [CX(c1), y], [CX(c1), y + 10]], { w: 2.6, color: RD, wob: false }); text(x, label, lx, ly, { size: 22, color: RD, align: al }); };
          br(0.05, 0.3, 84, 'low carbon steel', LX0 - 6, 50, 'left'); pen(x, [[CX(0.17), 56], [CX(0.17), 82]], { w: 2, color: RD, wob: false }); br(0.8, 1.5, 84, 'high carbon steel', CX(0.8) - 4, 76, 'left');
          pen(x, [[CX(3.5), 70], [CX(3.5), 94]], { w: 2.6, color: RD, wob: false }); pen(x, [[CX(3.5) - 8, 84], [CX(3.5), 94], [CX(3.5) + 8, 84]], { w: 2.6, color: RD, wob: false }); text(x, 'cast iron', CX(3.5) + 10, 60, { size: 22, color: RD, align: 'right' });
        }
        // knob + read-out
        const kx = CX(c);
        x.save(); x.globalCompositeOperation = 'source-over'; x.fillStyle = PAPER; x.beginPath(); x.arc(kx, LY, 20, 0, 7); x.fill(); x.restore();
        Ink.stroke(x, geo.ellipse(kx, LY, 20, 20), { w: 3, color: RD, seed: 9 }); dot(x, kx, LY, 6.5, RD);
        if (!moved && got('p03.predict')) text(x, 'drag me →', kx + 30, LY - 22, { font: 'hand', size: 24, color: RD });
        if (!ruleOK()) text(x, `this sample: iron + ${fmt(c)} carbon`, W / 2, 44, { size: 26, align: 'center' });
        else text(x, `iron + ${fmt(c)} carbon`, W / 2, 30, { size: 22, align: 'center', a: 0.8 });

        // ================= rig 1: the same weight pushes a hard point into the sample
        const dpx = dentMM(c) * 11, sTop = 398;
        const fall = sstep(0.08, 0.3, u) - sstep(0.55, 0.85, u), tipRest = 332, tipY = tipRest + (sTop + dpx - tipRest) * (live ? fall : 0);
        const smp = [[A - 56, sTop], [A + 56, sTop], [A + 56, 448], [A - 56, 448]];
        wash(x, smp, PAPER);
        const dent = live && u > 0.3 ? dpx : live ? dpx * sstep(0.2, 0.3, u) : 0;
        const topEdge = dent > 0.5 ? [[A - 56, sTop], [A - dent * 0.62 - 2, sTop], [A, sTop + dent], [A + dent * 0.62 + 2, sTop], [A + 56, sTop]] : [[A - 56, sTop], [A + 56, sTop]];
        Ink.stroke(x, [[A - 56, sTop], [A - 56, 448]], { w: 2.4, seed: 21, amp: 0.3 }); Ink.stroke(x, [[A + 56, sTop], [A + 56, 448]], { w: 2.4, seed: 22, amp: 0.3 });
        pen(x, topEdge, { w: 2.6, wob: false });
        Ink.hatchFill(x, [[A + 12, sTop + 26], [A + 56, sTop + 26], [A + 56, 448], [A + 12, 448]], 1, B, 0.8);
        // the punch: a weight on a rod with a pointed tip
        const wt = geo.rect(A - 34, tipY - 92, 68, 52, 6); wash(x, wt, PAPER); Ink.hatchFill(x, wt, 1, B, 1.6); Ink.stroke(x, wt, { w: 2.4, seed: 23, amp: 0.3 });
        pen(x, [[A - 8, tipY - 40], [A - 8, tipY - 16], [A, tipY], [A + 8, tipY - 16], [A + 8, tipY - 40]], { w: 2.4, wob: false });
        pen(x, [[A, tipY - 92], [A, 250]], { w: 2, wob: false, a: 0.7 });
        if (shown) text(x, `dent ${dentMM(c).toFixed(1)} mm deep`, A, 516, { size: 22, align: 'center', color: RD });

        // ================= rig 2: a strip in the vice is pushed over
        const sn = snapAt(c), endA = sn == null ? 90 : sn, prog = live ? sstep(0.1, 0.1 + 0.55 * (endA / 90) + 0.05, u) : 0, ang = (endA * prog * Math.PI) / 180;
        const broke = live && sn != null && prog >= 1, PIVY = 408, LEN = 150;
        pen(x, [[Bx - 6, PIVY + 46], [Bx - 6, PIVY], [Bx + 6, PIVY], [Bx + 6, PIVY + 46]], { w: 2.2, wob: false });   // the part gripped in the jaws
        const strip = (a, len, ox = Bx, oy = PIVY) => { const s = Math.sin(a), k = Math.cos(a); return [[ox - 6 * k, oy - 6 * s], [ox - 6 * k + len * s, oy - 6 * s - len * k], [ox + 6 * k + len * s, oy + 6 * s - len * k], [ox + 6 * k, oy + 6 * s]]; };
        if (!broke) {
          const P = strip(ang, LEN); wash(x, P, PAPER); Ink.hatchFill(x, P, 1, B, 1.2); pen(x, P, { w: 2.4, wob: false });
          if (live && u > 0.05 && prog < 1 || (live && sn == null && u < 0.9)) { const hx = Bx + Math.sin(ang) * (LEN - 20) - 18, hy = PIVY - Math.cos(ang) * (LEN - 20) - 8; pen(x, [[hx - 58, hy - 8], [hx - 6, hy]], { w: 3.4, color: RD, wob: false }); pen(x, [[hx - 22, hy - 14], [hx - 4, hy], [hx - 20, hy + 10]], { w: 3.4, color: RD, wob: false }); }
        } else {
          // the stub left in the vice, with a jagged end, and the broken piece on the bench
          const tb = sstep(0.1 + 0.55 * (endA / 90) + 0.05, 0.95, u), a = ang;
          const st = strip(a, 16); pen(x, [st[0], st[1], [(st[1][0] + st[2][0]) / 2 + 2, (st[1][1] + st[2][1]) / 2 + 5], st[2], st[3]], { w: 2.4, wob: false });
          const fx = Bx + 26 + 62 * tb, fy = PIVY - 60 + (BENCH - 8 - (PIVY - 60)) * tb * tb, fa = a + (Math.PI / 2 - a) * tb + (tb < 1 ? tb * 3.2 : 0);
          const P = strip(fa, LEN - 18, fx - Math.sin(fa) * (LEN - 18) / 2, fy + Math.cos(fa) * (LEN - 18) / 2); wash(x, P, PAPER); Ink.hatchFill(x, P, 1, B, 1.2); pen(x, close(P), { w: 2.4, wob: false });
          if (tb < 0.5) Ink.drawBubble(x, 'SNAP!', Bx - 6, 292, 34, RD, 1, -0.06, 'center');
        }
        if (shown) text(x, bendTxt(c), Bx, 516, { size: 22, align: 'center', color: RD });

        // ================= rig 3: a weight is dropped on a plate resting on two supports
        const hr = hitRes(c), PY = 432, ballR = 22, hitU = 0.42;
        const dropP = live ? clamp((u - 0.1) / (hitU - 0.1)) : 0, hit = live && u >= hitU, after = live ? sstep(hitU, 0.9, u) : 0;
        let by = 262 + (PY - 16 - ballR - 262) * dropP * dropP;
        if (hit) by = hr === 2 ? PY - 16 - ballR + (BENCH - ballR - (PY - 16 - ballR)) * Math.min(1, after * 1.6) ** 2 : PY - 16 - ballR - Math.sin(Math.min(1, after * 1.4) * Math.PI) * (hr === 0 ? 10 : 22) + (hr === 0 ? 5 : 0);
        if (!hit || hr !== 2) {
          const sag = hit && hr === 0 ? 7 : 0;
          const top = [[C - 86, PY - 16], [C - 26, PY - 16], [C, PY - 16 + sag], [C + 26, PY - 16], [C + 86, PY - 16]], bot = [[C + 86, PY], [C + 26, PY], [C, PY + sag], [C - 26, PY], [C - 86, PY]];
          const pl = top.concat(bot); wash(x, pl, PAPER); Ink.hatchFill(x, pl, 1, B, 1.2); pen(x, close(pl), { w: 2.4, wob: false });
          if (hit && hr === 1) { const L = 6 + 6 * clamp((c - 0.6) / 1.6); pen(x, [[C + 2, PY], [C - 3, PY - L * 0.5], [C + 3, PY - L * 0.8], [C - 1, PY - L]], { w: 2.8, color: RD, wob: false }); if (after < 0.6) Ink.drawBubble(x, 'CRACK!', C - 20, 300, 30, RD, 1, -0.06, 'center'); }
        } else {
          const tl = Math.min(1, after * 1.5), a = tl * 0.62;
          [-1, 1].forEach((sg) => { x.save(); x.translate(C + sg * 66, PY - 8); x.rotate(-sg * a); const hp = [[-sg * 20, -8], [sg * 62, -8], [sg * 58, 0], [sg * 64, 8], [-sg * 20, 8]]; x.translate(0, tl * 4); wash(x, hp, PAPER); Ink.hatchFill(x, hp, 1, B, 1.2); pen(x, close(hp), { w: 2.4, wob: false }); x.restore(); });
          if (after < 0.6) Ink.drawBubble(x, 'CRACK!', C - 20, 300, 30, RD, 1, -0.06, 'center');
        }
        pen(x, [[C, 236], [C, by - ballR]], { w: 1.4, wob: false, a: dropP > 0 ? 0 : 0.8 });
        const ball = geo.ellipse(C, by, ballR, ballR); wash(x, ball, PAPER); Ink.hatchFill(x, ball, 1, B, 2.2); Ink.stroke(x, ball, { w: 2.4, seed: 31, amp: 0.3 });
        if (shown) text(x, HIT[hr], C, 516, { size: 22, align: 'center', color: RD });
        return busy;
      };

      function setCarbon(v) { v = Math.round(clamp(v, 0.1, 3.5) * 10) / 10; if (v === carbon || running) return; carbon = v; shown = false; run = 0; moved = true; Book.sfx('tick', { gain: 0.3 }); paint(); S.go(); }
      S.drag((p) => !running && !!got('p03.predict') && p[1] > LY - 46 && p[1] < LY + 50 && p[0] > LX0 - 40 && p[0] < LX1 + 40, { start: (p) => setCarbon(((p[0] - LX0) / (LX1 - LX0)) * 3.5), move: (p) => setCarbon(((p[0] - LX0) / (LX1 - LX0)) * 3.5) });
      minus.onclick = () => setCarbon(carbon - (carbon > 1.01 ? 0.5 : 0.1)); plus.onclick = () => setCarbon(carbon + (carbon >= 0.99 ? 0.5 : 0.1));
      testB.onclick = () => { if (running || shown) return; running = true; run = 0; pred.querySelectorAll('.opt').forEach((b) => (b.disabled = true)); Book.sfx('tick', { gain: 0.5 }); setTimeout(() => Book.sfx(snapAt(carbon) == null ? 'thud' : 'pop', { gain: 0.5 }), 800); paint(); S.go(); };
      function finishTest() {
        if (!tests.includes(carbon)) tests.push(carbon);
        const s = tests.slice().sort((a, b) => a - b);
        rL.set({ answer: `tested ${s.length} sample${s.length > 1 ? 's' : ''}: ` + s.map((c) => `${fmt(c)} C (dent ${dentMM(c).toFixed(1)} mm; ${bendTxt(c)}; ${HIT[hitRes(c)]})`).join(' | '), correct: labDone() ? true : null, score: labDone() ? 1 : 0, max: 1, tests: tests.slice() });
        paint();
      }

      // ------------------------------------------------------------------ conclusion
      const conc = ui.el('div', '');
      const add = (e, to = conc) => { to.appendChild(e); return e; };
      add(ui.el('h2', '', 'What is the rule?'));
      add(ui.p('Read down your results table: what changes as the carbon goes up?'));
      const rule = add(ui.mcq({ id: 'p03.rule', label: 'The carbon rule (conclusion from the lab)', q: '<b>Conclusion:</b> adding more carbon makes the metal…',
        options: [
          { t: 'Harder, but less ductile and more brittle', ok: true },
          { t: 'Softer, and so more ductile and less brittle', mis: 'carbon-rule', why: 'Check your table. As the carbon went up the dent got shallower, so the metal was getting harder, not softer. And did the high carbon samples bend, or snap?' },
          { t: 'Harder, and also more ductile and tougher', mis: 'carbon-rule', why: 'Harder is right: the dent got shallower. But look at tests 2 and 3. The high carbon samples snapped instead of bending, and cracked when they were hit.' },
          { t: 'Softer, but less ductile and more brittle', mis: 'carbon-rule', why: 'The second half is right: it snaps and cracks more easily. But a softer metal would dent more deeply. Which way did the dent depth go?' },
        ],
        explain: 'This is the carbon rule: more carbon → harder (and stronger), but less ductile and malleable, and more brittle.' }));
      const cmp = add(ui.p(''));
      rule.addEventListener('click', () => setTimeout(paint, 60));

      const after = ui.el('div', '');
      const hThree = add(ui.el('h2', '', 'Three ferrous metals, one rule'), after);
      const pThree = add(ui.p('Look back at the carbon line in the lab: the three metals are now marked on it in red. Slide the knob to each one and test it.'), after);
      const cards = add(ui.el('div', 'm3-cards'), after);
      const card = (h) => { const d = ui.el('div', 'box', h, cards); requestAnimationFrame(() => Ink.frame(d)); return d; };
      card('<span class="tag">up to about 0.3% carbon</span><b class="n">Low carbon steel</b><span class="small">(also called mild steel)</span><br>Tough, ductile and malleable. Easy to cut, bend, weld and machine. Cheap. Rusts easily.<br><b>Uses:</b> car bodies, nuts, bolts, screws, nails, girders, bike frames.');
      card('<span class="tag">about 0.8–1.5% carbon</span><b class="n">High carbon steel</b><span class="small">(also called tool steel)</span><br>Very hard and strong; keeps a sharp edge. Less ductile, more brittle. Can be hardened and tempered. Rusts.<br><b>Uses:</b> chisels, files, saw blades, hammers, knives, springs.');
      card('<span class="tag">about 3.5% carbon</span><b class="n">Cast iron</b><span class="small">(poured into moulds)</span><br>Hard, and very strong in compression, but brittle: it cracks if dropped or hit. Melts and pours well, so it is good for casting complex shapes. Cheap. Rusts.<br><b>Uses:</b> vices, drain covers, engine blocks, brake discs, pans, radiators.');

      add(ui.el('h2', '', 'Which metal made it?'), after);
      add(ui.p('<span class="small">The lab and the notes will blur while you sort and fill in.</span>'), after);
      const sort = add(ui.sort({ id: 'p03.uses', label: 'Sort 10 products: low carbon steel / high carbon steel / cast iron', q: 'Tap a product, then tap the ferrous metal it is made from.',
        buckets: ['Low carbon steel', 'High carbon steel', 'Cast iron'],
        items: [
          { t: 'car body panel', b: 0, mis: 'steel-mixup' }, { t: 'nuts and bolts', b: 0, mis: 'steel-mixup' }, { t: 'building girder', b: 0, mis: 'steel-mixup' }, { t: 'nails', b: 0, mis: 'steel-mixup' },
          { t: 'wood chisel', b: 1, mis: 'steel-mixup' }, { t: 'hand file', b: 1, mis: 'steel-mixup' }, { t: 'saw blade', b: 1, mis: 'steel-mixup' },
          { t: 'vice body', b: 2, mis: 'steel-mixup' }, { t: 'drain cover', b: 2, mis: 'steel-mixup' }, { t: 'engine block', b: 2, mis: 'steel-mixup' },
        ],
        explain: 'Bent or pressed into shape = low carbon steel. Needs a hard, sharp edge = high carbon steel. Poured into a mould as a chunky shape = cast iron.' }), after);
      const blurA = [hLab, how, lab, conc, hThree, pThree, cards];
      ui.hideWhile(sort, 'p03.uses', blurA);
      const fill = add(ui.fill({ id: 'p03.blanks', label: 'Fill the blanks: ferrous metals and the carbon rule (5)', q: 'Finish the summary. <span class="small">One word in each gap.</span>',
        html: 'All three ferrous metals are made of {{iron}} with some {{carbon}} added. The carbon rule: the more carbon, the {{harder|stronger|harder and stronger}} the metal becomes, but it is less ductile and more {{brittle}}. Low carbon steel has another name: {{mild}} steel.',
        explain: 'Iron + carbon. More carbon = harder but more brittle. Low carbon steel = mild steel.' }), after);
      ui.hideWhile(fill, 'p03.blanks', blurA.concat([intro, pred, sort]));

      function paint() {
        const on = !!got('p03.predict'), n = need(), done = labDone();
        testB.disabled = !on || running || shown; minus.disabled = plus.disabled = !on || running;
        testB.textContent = shown ? '✓ tested: move the knob' : running ? 'testing…' : `▶ TEST ${fmt(carbon)} carbon`;
        const tk = (b) => (b ? '☑' : '☐');
        stat.innerHTML = done ? '<span class="green">✓ Low, middle and high all tested.</span> Test more if you like.' : `Still to test: ${tk(n.low)} <b>low</b> (0.1–0.4%) &nbsp; ${tk(n.mid)} <b>middle</b> (0.6–2%) &nbsp; ${tk(n.high)} <b>high</b> (3–3.5%)`;
        const s = tests.slice().sort((a, b) => a - b);
        logT.innerHTML = s.length ? '<tr><th>carbon</th><th>1 press test</th><th>2 bend test</th><th>3 drop test</th></tr>' + s.map((c) => `<tr><td>${fmt(c)}</td><td>dent ${dentMM(c).toFixed(1)} mm deep</td><td>${bendTxt(c)}</td><td>${HIT[hitRes(c)]}</td></tr>`).join('') : '';
        logT.classList.toggle('m3-hide', !s.length);
        conc.classList.toggle('m3-hide', !done);
        const ok = ruleOK(); after.classList.toggle('m3-hide', !(done && ok));
        if (ok) { const p = (got('p03.predict') || {}).answer, good = p === RIGHT; cmp.innerHTML = p ? `You predicted “${Book.esc(p.toLowerCase())}”: <b class="${good ? 'green' : 'red'}">${good ? '✓ spot on' : '✗ not this time'}</b>.` : ''; } else cmp.innerHTML = '';
        if (done && ok) cards.querySelectorAll('.box').forEach((d) => requestAnimationFrame(() => Ink.frame(d)));
        S.go();
      }
      function unlock() {
        const on = !!got('p03.predict');
        S.c.style.opacity = on ? 1 : 0.4; lockMsg.classList.toggle('m3-hide', on); how.style.opacity = on ? 1 : 0.5;
        if (rL.get()) pred.querySelectorAll('.opt').forEach((b) => (b.disabled = true));
        paint();
      }
      unlock(); S.go();
    },
  });
})();
