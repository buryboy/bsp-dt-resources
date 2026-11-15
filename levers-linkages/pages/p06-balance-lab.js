// Page 6 — The balance lab: moments. A pen-drawn beam on a central fulcrum with pegs every 10 cm. First the
// student predicts which way three set-ups will tip, then balances five set challenges by hanging weights,
// then a moments calculation (echoing their own working) and a real-world question.
(function () {
  'use strict';
  const B = Ink.BLUE, RD = Ink.RED, GR = Ink.GREEN, rgba = Ink.rgba, geo = Ink.geo;
  const LABF = (s) => `600 ${s}px Fredoka, "Arial Rounded MT Bold", system-ui, sans-serif`;
  const HANDF = (s) => `400 ${s}px "Gloria Hallelujah", "Comic Sans MS", cursive`;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));

  const W = 860, CX = 430, CY = 150, GY = 338, SP = 72, BL = 380, MAXA = 0.17;
  const WW = 66, WH = { 100: 36, 200: 48, 300: 60, 400: 72 }, STR = 22, PAD = 12;

  if (!document.getElementById('p06-css')) {
    const s = document.createElement('style'); s.id = 'p06-css';
    s.textContent = `
      .p06-lab { position: relative; margin: 0 0 calc(var(--R) * 1.4); padding: 12px 16px 16px; background: rgba(251,250,245,.9); }
      .p06-lab > * { position: relative; }
      .p06-cv { display: block; width: 100%; height: auto; touch-action: none; user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; cursor: pointer; }
      .p06-step { font: 700 14px Fredoka, system-ui; letter-spacing: .08em; text-transform: uppercase; color: var(--red); line-height: 22px; }
      .p06-task { font-size: 20px; line-height: 1.5; margin: 0 0 4px; min-height: 60px; }
      .p06-task b { font-family: Fredoka, system-ui; font-weight: 600; }
      .p06-btns { display: flex; flex-wrap: wrap; gap: 10px; align-items: stretch; margin-top: 6px; }
      .p06-btns .opt { flex: 1 1 150px; text-align: center; min-height: 52px; }
      .p06-btns .btn { margin-top: 0; min-height: 52px; }
      .p06-res { display: none; margin-top: 12px; font-size: 18px; line-height: 1.5; }
      .p06-res.on { display: block; }
      .p06-mom { display: grid; grid-template-columns: 1fr auto 1fr; gap: 6px 12px; align-items: center; }
      .p06-mom .sd { background: #fff; border: 2px solid rgba(30,46,150,.35); border-radius: 12px; padding: 8px 12px; }
      .p06-mom .sd h5 { margin: 0; font: 700 14px Fredoka, system-ui; text-transform: uppercase; letter-spacing: .06em; color: var(--red); line-height: 20px; }
      .p06-mom .sd b { font-family: Fredoka, system-ui; font-weight: 700; white-space: nowrap; }
      .p06-mom .vs { font: 700 34px Fredoka, system-ui; }
      .p06-verdict { margin-top: 8px; }
      .p06-verdict.good { color: var(--green); } .p06-verdict.bad { color: var(--red); }
      .p06-hint { font-size: 16px; line-height: 1.5; margin-top: 6px; }
    `;
    document.head.appendChild(s);
  }

  function text(x, s, px, py, o = {}) {
    x.save(); x.font = (o.font === 'hand' ? HANDF : LABF)(o.size || 22);
    x.fillStyle = rgba(o.color || B, o.a ?? 0.92); x.textAlign = o.align || 'left'; x.textBaseline = 'alphabetic';
    x.fillText(s, px, py); x.restore();
  }

  // ======================================================================================
  // the beam: one canvas, cached ink layers, an on-demand render loop
  // ======================================================================================
  function Beam(parent, o = {}) {
    const Hh = o.tray ? 466 : 354, SHELF = Hh - 16;
    const c = document.createElement('canvas'); c.className = 'p06-cv'; parent.appendChild(c);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = W * dpr; c.height = Hh * dpr; c.style.aspectRatio = W + ' / ' + Hh; c.dataset.lw = W;
    if (!o.tray) c.style.touchAction = 'pan-y';                          // nothing to drag on the prediction beam: let the page scroll
    const ctx = c.getContext('2d');
    const layer = (w, h, paint) => { const L = document.createElement('canvas'); L.width = Math.ceil(w * dpr); L.height = Math.ceil(h * dpr); const x = L.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.lineCap = x.lineJoin = 'round'; paint(x); L.w = w; L.h = h; return L; };
    const pos = (e) => { const r = c.getBoundingClientRect(); return [((e.clientX - r.left) * W) / r.width, ((e.clientY - r.top) * Hh) / r.height]; };

    // ---- cached drawings ----
    let standL, beamL, verdictL = null; const wL = {};
    function paint() {
      standL = layer(W, Hh, (x) => {
        Ink.stroke(x, [[24, GY], [W - 24, GY]], { w: 2.4, seed: 4 });
        const T = [[CX, CY + 4], [CX + 48, GY], [CX - 48, GY], [CX, CY + 4]];
        Ink.hatchFill(x, T, 1, B, 1.2); Ink.stroke(x, T, { w: 3, seed: 9 });
        Ink.hatchShadow(x, [[CX - 48, GY], [CX + 48, GY], [CX + 48, GY + 1], [CX - 48, GY + 1]], 1, 9, 7);
        text(x, 'fulcrum', CX + 58, GY - 12, { font: 'hand', size: 23 });
        if (o.tray) { Ink.stroke(x, [[150, SHELF], [W - 150, SHELF]], { w: 2.8, seed: 13 }); Ink.hatchShadow(x, [[150, SHELF], [W - 150, SHELF], [W - 150, SHELF + 2], [150, SHELF + 2]], 1, 6, 6); }
      });
      beamL = layer(BL * 2 + 80, 120, (x) => {
        x.translate(BL + 40, 60);
        const R = geo.rect(-BL, -9, BL * 2, 18, 5);
        Ink.hatchFill(x, R, 0.55, B, 0.8); Ink.stroke(x, R, { w: 2.8, seed: 21 });
        for (let p = -5; p <= 5; p++) {
          if (!p) continue;
          const px = p * SP;
          Ink.stroke(x, [[px, -9], [px, -17]], { w: 2, seed: 30 + p, retrace: false });                 // scale mark
          text(x, String(Math.abs(p) * 10), px, -22, { size: 22, align: 'center' });
          Ink.stroke(x, [[px, 9], [px, 15], [px + 5, 19], [px + 1, 23]], { w: 2, seed: 50 + p, retrace: false });   // peg / hook
        }
        text(x, 'cm', -BL - 5, 7, { font: 'hand', size: 20, align: 'right' }); text(x, 'cm', BL + 5, 7, { font: 'hand', size: 20 });
        x.fillStyle = rgba(B, 0.95); x.beginPath(); x.arc(0, 0, 5.5, 0, 7); x.fill();                    // pivot bolt
        Ink.stroke(x, geo.ellipse(0, 0, 11, 11), { w: 2, seed: 71, retrace: false });
      });
      [100, 200, 300, 400].forEach((w) => [0, 1].forEach((red) => {
        const h = WH[w], col = red ? RD : B;
        wL[w + '.' + red] = layer(WW + PAD * 2, h + 14 + PAD * 2, (x) => {
          x.translate(PAD, PAD);
          Ink.stroke(x, geo.ellipse(WW / 2, 6, 6, 6), { w: 2, color: col, seed: w / 10 + red, retrace: false });       // ring on top
          const R = geo.rect(0, 14, WW, h, 6);
          Ink.hatchShadow(x, R, 1, 5, 5, col);
          x.save(); x.globalCompositeOperation = 'source-over'; x.fillStyle = 'rgba(251,250,245,.96)'; x.beginPath(); R.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.fill(); x.restore();
          Ink.hatchFill(x, R, 0.4 + w / 1000, col, 0.6 + w / 500);
          Ink.stroke(x, R, { w: 2.8, color: col, seed: w / 7 + red * 3 });
          x.save(); x.globalCompositeOperation = 'source-over'; x.fillStyle = 'rgba(251,250,245,.92)'; x.beginPath(); x.roundRect(4, 14 + h / 2 - 14, WW - 8, 28, 6); x.fill(); x.restore();
          text(x, w + ' N', WW / 2, 14 + h / 2 + 8, { size: 22, align: 'center', color: col });
        });
      }));
    }
    paint();

    // ---- state ----
    const S = { c, items: [], sides: 'right', phase: 'set', ang: 0, vel: 0, pin: 0, sel: null, drag: null, onChange: null, onSettle: null };
    let hit = false, settleT = 0;
    const hook = (p, a = S.ang) => { const lx = p * SP + 1, ly = 23, cs = Math.cos(a), sn = Math.sin(a); return [CX + lx * cs - ly * sn, CY + lx * sn + ly * cs]; };
    const trayXY = (it) => { const n = S.items.filter((i) => !i.fixed).length; return [CX + (it.slot - (n - 1) / 2) * 112, SHELF - WH[it.w] - 14]; };   // top-centre of the sprite body
    const allowed = (p) => p !== 0 && Math.abs(p) <= 5 && (S.sides === 'both' || p > 0);
    const at = (p) => S.items.find((i) => i.pos === p);
    const pegAt = (x, y) => { if (y < CY - 70 || y > GY + 8) return null; const p = Math.round((x - CX) / SP); return allowed(p) ? p : null; };
    const trayHit = (x, y) => S.items.find((i) => { if (i.fixed || i.pos != null) return false; const [tx, ty] = trayXY(i); return Math.abs(x - tx) < WW / 2 + 16 && y > ty - 14 && y < SHELF + 16; });

    S.load = (cfg) => {
      S.items = []; let slot = 0;
      (cfg.fixed || []).forEach(([w, p, red]) => S.items.push({ w, pos: p, fixed: true, red: red ? 1 : 0 }));
      (cfg.tray || []).forEach((w) => S.items.push({ w, pos: null, fixed: false, red: 0, slot: slot++ }));
      S.sides = cfg.sides || 'right'; S.relock(); verdictL = null;
    };
    S.relock = () => { S.phase = 'set'; S.ang = 0; S.vel = 0; S.pin = 0; S.sel = null; S.drag = null; verdictL = null; go(); };
    S.moments = () => {
      const side = (sg) => S.items.filter((i) => i.pos != null && Math.sign(i.pos) === sg).sort((a, b) => Math.abs(a.pos) - Math.abs(b.pos)).map((i) => ({ w: i.w, d: Math.abs(i.pos) * 10 }));
      const l = side(-1), r = side(1), sum = (a) => a.reduce((t, i) => t + i.w * i.d, 0);
      return { l, r, ml: sum(l), mr: sum(r) };
    };
    S.placed = () => S.items.filter((i) => !i.fixed && i.pos != null);
    S.free = () => S.items.filter((i) => !i.fixed && i.pos == null);
    S.test = () => { if (S.phase !== 'set') return; S.sel = null; S.drag = null; S.phase = 'swing'; hit = false; settleT = 0; const m = S.moments(); S.vel = m.ml === m.mr ? 0.55 : 0; Book.sfx('pop', { gain: 0.5 }); go(); };
    S.verdict = (s, col) => { verdictL = layer(W, 80, (x) => Ink.drawBubble(x, s, CX, 58, 40, col, 1, -0.02, 'center')); go(); };

    // ---- drawing ----
    function drawWeight(it, x, y, lift) {                 // (x, y) = top-centre of the ring
      const L = wL[it.w + '.' + it.red];
      ctx.drawImage(L, x - WW / 2 - PAD, y - PAD, L.w, L.h);
      if (lift) { ctx.save(); ctx.strokeStyle = rgba(RD, 0.85); ctx.lineWidth = 3; ctx.setLineDash([7, 6]); ctx.beginPath(); ctx.roundRect(x - WW / 2 - 7, y + 7, WW + 14, WH[it.w] + 14, 10); ctx.stroke(); ctx.restore(); }
    }
    function render(dt) {
      let more = false;
      // physics
      if (S.phase === 'swing') {
        more = true;
        S.pin = Math.min(1, S.pin + dt / 0.3);
        const m = S.moments(), d = m.mr - m.ml;
        if (d === 0) {                                                      // balanced: a gentle wobble that dies away
          S.vel += (-38 * S.ang - 3.2 * S.vel) * dt; S.ang += S.vel * dt; settleT += dt;
          if (settleT > 1.9) { S.ang = 0; S.vel = 0; S.phase = 'done'; }
        } else {
          const sg = Math.sign(d);
          S.vel += sg * (1.6 + 2.2 * Math.min(1, Math.abs(d) / 8000)) * dt; S.ang += S.vel * dt;
          if (Math.abs(S.ang) >= MAXA) { S.ang = sg * MAXA; if (!hit) { hit = true; Book.sfx('thud', { gain: 0.5 }); } S.vel = -S.vel * 0.3; if (Math.abs(S.vel) < 0.06) { S.vel = 0; S.phase = 'done'; } }
        }
        if (S.phase === 'done') { more = false; const mm = S.moments(); S.onSettle && S.onSettle(mm); }
      }
      // paint
      ctx.drawImage(standL, 0, 0, W, Hh);
      ctx.save(); ctx.translate(CX, CY); ctx.rotate(S.ang); ctx.drawImage(beamL, -(BL + 40), -60, beamL.w, beamL.h); ctx.restore();
      if (S.pin < 1) {                                                      // the red locking pin
        const u = S.pin, py = CY - 90 * u;
        ctx.save(); ctx.globalAlpha = 1 - u;
        Ink.stroke(ctx, [[CX, py + 2], [CX, py - 44]], { w: 3.6, color: RD, seed: 77 });
        Ink.stroke(ctx, geo.ellipse(CX, py - 55, 10, 10), { w: 2.6, color: RD, seed: 78, retrace: false });
        text(ctx, 'pin', CX + 17, py - 47, { font: 'hand', size: 22, color: RD });
        ctx.restore();
      }
      const tgt = S.drag && S.drag.moved ? pegAt(S.drag.x, S.drag.y) : null;
      if (S.phase === 'set' && (S.sel || S.drag)) {                         // show the free pegs
        for (let p = -5; p <= 5; p++) {
          if (!allowed(p) || (at(p) && at(p) !== (S.drag && S.drag.it))) continue;
          const [hx, hy] = hook(p), on = p === tgt;
          ctx.save(); ctx.strokeStyle = rgba(RD, on ? 0.95 : 0.55); ctx.lineWidth = on ? 3.4 : 2; ctx.setLineDash(on ? [] : [5, 5]); ctx.beginPath(); ctx.arc(hx, hy + 6, on ? 17 : 13, 0, 7); ctx.stroke(); ctx.restore();
        }
      }
      S.items.forEach((it) => {
        if (S.drag && S.drag.it === it && S.drag.moved) return;
        if (it.pos != null) {
          const [hx, hy] = hook(it.pos);
          ctx.save(); ctx.strokeStyle = rgba(it.red ? RD : B, 0.9); ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx + 0.6, hy + STR); ctx.stroke(); ctx.restore();
          drawWeight(it, hx, hy + STR - 2);
        } else { const [tx, ty] = trayXY(it); drawWeight(it, tx, ty - (S.sel === it ? 8 : 0), S.sel === it); }
      });
      if (S.drag && S.drag.moved) drawWeight(S.drag.it, S.drag.x, S.drag.y - 14 - WH[S.drag.it.w] / 2, true);
      if (o.tray && S.items.filter((i) => !i.fixed).length <= 2) text(ctx, 'your weights:', 158, SHELF - 16, { font: 'hand', size: 22 });
      if (verdictL) ctx.drawImage(verdictL, 0, 0, W, 80);
      return more;
    }
    const hidden = () => { const p = c.closest('.page'); return !p || p.classList.contains('hidden'); };
    let raf = 0, last = 0, wait = 0;
    function tick(now) {
      raf = 0;
      if (hidden()) { last = 0; if (!wait) wait = setTimeout(() => { wait = 0; go(); }, 400); return; }
      const dt = last ? Math.min(0.04, (now - last) / 1000) : 1 / 60; last = now;
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'source-over'; ctx.clearRect(0, 0, c.width, c.height);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.globalCompositeOperation = 'multiply'; ctx.lineCap = ctx.lineJoin = 'round';
      if (render(dt)) raf = requestAnimationFrame(tick); else last = 0;
    }
    function go() { if (!raf) raf = requestAnimationFrame(tick); }
    S.go = go;
    if (document.fonts) document.fonts.ready.then(() => { paint(); go(); });

    // ---- touch: drag a weight to a peg, or tap the weight then tap a peg; tap a hanging weight to take it off ----
    const changed = () => { S.onChange && S.onChange(); go(); };
    c.addEventListener('pointerdown', (e) => {
      if (S.phase !== 'set' || S.drag) return;
      const [x, y] = pos(e); let it = trayHit(x, y), from = 'tray';
      if (!it) {
        const p = pegAt(x, y), h = p != null && at(p);
        if (h && !h.fixed) { it = h; from = 'peg'; }
        else if (p != null && !h && S.sel) { S.sel.pos = p; S.sel = null; Book.sfx('pop', { gain: 0.45 }); e.preventDefault(); changed(); return; }
        else return;
      }
      e.preventDefault(); try { c.setPointerCapture(e.pointerId); } catch (_) {}
      S.drag = { it, from, x, y, x0: x, y0: y, moved: false }; Book.sfx('tick', { gain: 0.5 }); go();
    });
    c.addEventListener('pointermove', (e) => {
      if (!S.drag) return; e.preventDefault();
      const [x, y] = pos(e); S.drag.x = x; S.drag.y = y;
      if (!S.drag.moved && Math.hypot(x - S.drag.x0, y - S.drag.y0) > 14) { S.drag.moved = true; S.sel = null; }
      go();
    });
    const drop = (e) => {
      const d = S.drag; if (!d) return; S.drag = null;
      if (e.type === 'pointercancel') { go(); return; }
      if (!d.moved) {                                                      // a tap
        if (d.from === 'tray') S.sel = S.sel === d.it ? null : d.it;
        else { d.it.pos = null; Book.sfx('tick', { gain: 0.5 }); }
      } else {
        const p = pegAt(d.x, d.y), h = p != null && at(p);
        if (p != null && (!h || h === d.it)) { d.it.pos = p; Book.sfx('pop', { gain: 0.45 }); }
        else if (d.from === 'peg' && (p == null || h)) { if (d.y > GY) d.it.pos = null; }      // dropped back on the shelf
      }
      changed();
    };
    c.addEventListener('pointerup', drop); c.addEventListener('pointercancel', drop);
    go();
    return S;
  }

  // ---------- the results panel (only ever filled in AFTER a test) ----------
  const sideHTML = (name, arr, tot) => `<div class="sd"><h5>${name}</h5>` + (arr.length ? arr.map((a) => `${a.w} N × ${a.d} cm = ${arr.length > 1 ? a.w * a.d : `<b>${tot} Ncm</b>`}`).join('<br>') + (arr.length > 1 ? `<br>total = <b>${tot} Ncm</b>` : '') : 'nothing here: <b>0 Ncm</b>') + '</div>';
  const momHTML = (m) => `<div class="p06-mom">${sideHTML('Left side', m.l, m.ml)}<div class="vs">${m.ml === m.mr ? '=' : m.ml > m.mr ? '&gt;' : '&lt;'}</div>${sideHTML('Right side', m.r, m.mr)}</div>`;
  const outcome = (m) => (m.ml === m.mr ? 'it balances' : m.ml > m.mr ? 'left side drops' : 'right side drops');
  const describe = (arr) => arr.map((a) => `${a.w} N at ${a.d} cm`).join(' + ') || 'nothing';

  function shell(ui) {
    const d = ui.el('div', 'p06-lab'); requestAnimationFrame(() => Ink.frame(d));
    const step = ui.el('div', 'p06-step', '', d), task = ui.el('div', 'p06-task', '', d);
    const cvHost = ui.el('div', '', '', d), btns = ui.el('div', 'p06-btns', '', d), res = ui.el('div', 'p06-res', '', d);
    return { d, step, task, cvHost, btns, res };
  }
  const button = (ui, cls, label, parent) => { const b = ui.el('button', cls, label, parent); b.type = 'button'; return b; };

  // ======================================================================================
  Book.page({
    id: 'p06',
    title: 'The balance lab',
    build(ui) {
      const items = Book.state.items;
      ui.h('The balance lab');
      ui.p('A big weight always beats a small one… or does it? This beam turns on a <b>fulcrum</b> in the middle. It has a peg every <b>10&nbsp;cm</b>, and a red <b>pin</b> holds it level.');

      // ---------------------------------------------------------------- 1. predict
      ui.el('h2', '', 'Experiment: which way will it tip?');
      const SETUPS = [
        { L: [[200, -2]], R: [[200, 2 * 2]], say: 'Two <b>200&nbsp;N</b> weights. One hangs <b>20&nbsp;cm</b> from the fulcrum, the other <b>40&nbsp;cm</b>.', why: 'The weights are equal, but the right one hangs twice as far from the fulcrum, so its turning effect is twice as big.' },
        { L: [[300, -1]], R: [[100, 3]], say: 'A <b>300&nbsp;N</b> weight hangs <b>10&nbsp;cm</b> from the fulcrum. A <b>100&nbsp;N</b> weight hangs <b>30&nbsp;cm</b> away on the other side.', why: 'The small weight hangs three times further out, so its turning effect exactly matches the big weight.' },
        { L: [[200, -5]], R: [[400, 2]], say: 'A <b>200&nbsp;N</b> weight hangs <b>50&nbsp;cm</b> from the fulcrum. A <b>400&nbsp;N</b> weight hangs <b>20&nbsp;cm</b> away on the other side.', why: 'The lighter weight wins! It hangs so far from the fulcrum that its turning effect is the bigger one.' },
      ];
      const OPTS = ['left side drops', 'it balances', 'right side drops'];
      const rP = ui.record('p06.predict', { label: 'Predict which way the beam tips (3 set-ups)', type: 'experiment', max: 3 });
      const A = shell(ui), beamA = Beam(A.cvHost, { tray: false });
      const logA = ((rP.get() || {}).log || []).slice();
      let notesBox = null;
      let answering = false;                                // true while the last question is being answered
      const unlockNotes = () => { if (notesBox) notesBox.classList.toggle('peek-lock', logA.length < SETUPS.length || answering); };
      function setupA(i, demo) {
        const su = SETUPS[i]; let pick = null;
        beamA.load({ fixed: su.L.concat(su.R) });
        A.step.textContent = demo ? `Set-up ${i + 1} of ${SETUPS.length} (watch again)` : `Set-up ${i + 1} of ${SETUPS.length}`;
        A.task.innerHTML = su.say + (demo ? '' : ' <b>Predict:</b> what happens when the pin is pulled out?');
        A.btns.innerHTML = ''; A.res.className = 'p06-res'; A.res.innerHTML = '';
        const obs = demo ? [] : OPTS.map((t) => { const b = button(ui, 'opt', t, A.btns); b.onclick = () => { pick = t; obs.forEach((x) => x.classList.toggle('sel', x === b)); go.disabled = false; Book.scribble(0.12); }; return b; });
        const go = button(ui, 'btn', 'Pull the pin!', A.btns); go.disabled = !demo;
        go.onclick = () => { go.style.display = 'none'; obs.forEach((x) => (x.disabled = true)); beamA.test(); };
        beamA.onSettle = (m) => {
          const actual = outcome(m), ok = demo || pick === actual;
          beamA.verdict(m.ml === m.mr ? 'BALANCED!' : m.ml > m.mr ? 'left drops' : 'right drops', demo ? B : ok ? GR : RD);
          if (!demo) {
            Book.sfx(ok ? 'success' : 'error', { gain: 0.35 });
            obs.forEach((x) => { if (x.textContent === actual) x.classList.add('right'); else if (x.textContent === pick) x.classList.add('wrong'); x.classList.remove('sel'); });
            logA.push({ pred: pick, actual, ok });
            const n = logA.filter((g) => g.ok).length, fin = logA.length === SETUPS.length;
            rP.set({ answer: logA.map((g, j) => `${j + 1}: predicted "${g.pred}", actually ${g.actual} ${g.ok ? '✓' : '✗'}`).join('; '), correct: fin ? n === SETUPS.length : n < logA.length ? false : null, score: n, max: SETUPS.length, mis: n < logA.length ? 'moment-distance' : '', log: logA.slice() });
            unlockNotes();
          }
          A.res.className = 'p06-res on';
          A.res.innerHTML = '<div class="small" style="margin-bottom:6px">Turning effect of each side = <b style="font-family:Fredoka">force × distance from the fulcrum</b>:</div>' + momHTML(m) +
            `<div class="p06-verdict ${ok ? 'good' : 'bad'}">${demo ? '' : ok ? '✓ Good prediction. ' : '✗ Not what you predicted. '}${su.why}</div>`;
          const nx = button(ui, 'btn', '', A.btns), last = i === SETUPS.length - 1;
          nx.textContent = demo || !last ? (last ? '↻ Back to set-up 1' : 'Next set-up ▸') : '↻ Watch set-up 1 again';
          nx.onclick = () => setupA(last ? 0 : i + 1, demo || last);
          if (!demo && last) ui.el('div', 'p06-hint', 'All three tested. The notes below are now un-blurred: read them, then try the challenges.', A.res);
        };
      }
      setupA(Math.min(logA.length, SETUPS.length - 1) % SETUPS.length, logA.length >= SETUPS.length);

      // ---------------------------------------------------------------- 2. notes (blurred until the experiment is done)
      ui.p('<span class="small">Test all three set-ups to un-blur these notes.</span>');
      notesBox = ui.box('The turning effect of a force is called a <b>moment</b>.<br><b style="font:700 24px Fredoka">moment = force × distance from the fulcrum</b><br>Force in N × distance in cm gives <b>Ncm</b> (or N × m gives <b>Nm</b>).<br>A lever <b>balances</b> when <span class="key">effort × its distance = load × its distance</span>.<br>So the further from the fulcrum you push, the <b>less effort</b> you need.', { tag: 'Notes' });
      unlockNotes();

      // ---------------------------------------------------------------- 3. challenges
      ui.el('h2', '', 'Balance challenges');
      ui.p('The <span class="red"><b>red</b></span> loads are fixed. <b>Drag</b> a blue weight onto a peg (or tap the weight, then tap a peg). Tap a hanging weight to take it off. Work it out first: every test is recorded!');
      const CH = [
        { id: 'p06.c1', label: 'Challenge 1: balance 200 N at 20 cm with a 200 N weight', say: 'A <b>200&nbsp;N</b> load hangs <b>20&nbsp;cm</b> left of the fulcrum. Balance it using the <b>200&nbsp;N</b> weight.', fixed: [[200, -2, 1]], tray: [200] },
        { id: 'p06.c2', label: 'Challenge 2: balance 400 N at 10 cm with a 100 N weight', say: 'A <b>400&nbsp;N</b> load hangs <b>10&nbsp;cm</b> left of the fulcrum. Balance it using only the <b>100&nbsp;N</b> weight.', fixed: [[400, -1, 1]], tray: [100] },
        { id: 'p06.c3', label: 'Challenge 3: balance 300 N at 20 cm with a 200 N weight', say: 'A <b>300&nbsp;N</b> load hangs <b>20&nbsp;cm</b> left of the fulcrum. Balance it using only the <b>200&nbsp;N</b> weight.', fixed: [[300, -2, 1]], tray: [200] },
        { id: 'p06.c4', label: 'Challenge 4: balance 400 N at 20 cm with 100 N + 300 N', say: 'A <b>400&nbsp;N</b> load hangs <b>20&nbsp;cm</b> left of the fulcrum. Balance it using <b>both</b> the 100&nbsp;N and the 300&nbsp;N weight.', fixed: [[400, -2, 1]], tray: [100, 300], all: true },
        { id: 'p06.c5', label: 'Challenge 5: balance 300 N at 30 cm + 100 N at 10 cm', say: '<b>Two</b> loads: <b>300&nbsp;N</b> at <b>30&nbsp;cm</b> and <b>100&nbsp;N</b> at <b>10&nbsp;cm</b>, both left of the fulcrum. Balance them with the 200&nbsp;N and 400&nbsp;N weights (one or both).', fixed: [[300, -3, 1], [100, -1, 1]], tray: [200, 400] },
      ];
      const recs = CH.map((ch) => ui.record(ch.id, { label: ch.label, type: 'experiment', max: 1 }));
      const Bx = shell(ui), beamB = Beam(Bx.cvHost, { tray: true });
      let exBox = null;                                     // the worked example shares its ratio with challenge 2, so it stays blurred until then
      const exLock = () => { if (exBox) exBox.classList.toggle('peek-lock', !finished(1)); };
      const finished = (k) => { const it = items[CH[k].id]; return !!it && (it.correct === true || it.done === true); };
      function challenge(k) {
        const ch = CH[k], r = recs[k], tests = ((r.get() || {}).tests || []).slice();
        beamB.load({ fixed: ch.fixed, tray: ch.tray }); exLock();
        Bx.step.textContent = `Challenge ${k + 1} of ${CH.length}`;
        Bx.task.innerHTML = ch.say;
        Bx.btns.innerHTML = ''; Bx.res.className = 'p06-res'; Bx.res.innerHTML = '';
        const go = button(ui, 'btn', 'Pull the pin: test it!', Bx.btns); go.disabled = true;
        const again = button(ui, 'btn ghost', '↺ Put the pin back and try again', Bx.btns); again.style.display = 'none';
        const next = button(ui, 'btn', k === CH.length - 1 ? 'Finish ▸' : 'Next challenge ▸', Bx.btns); next.style.display = 'none';
        const ready = () => (ch.all ? beamB.free().length === 0 : beamB.placed().length > 0);
        beamB.onChange = () => { go.disabled = !ready(); };
        go.onclick = () => { if (!ready()) return; go.disabled = true; beamB.test(); };
        again.onclick = () => { beamB.relock(); again.style.display = 'none'; go.style.display = ''; go.disabled = !ready(); Bx.res.className = 'p06-res'; };
        next.onclick = () => { if (!finished(k)) { const it = r.get(); if (it) { it.done = true; r.set({ answer: it.answer + '; moved on without balancing' }); } } k + 1 < CH.length ? challenge(k + 1) : freePlay(); };
        beamB.onSettle = (m) => {
          const ok = m.ml === m.mr;
          tests.push({ put: describe(m.r), ok, out: outcome(m) });
          beamB.verdict(ok ? 'BALANCED!' : m.ml > m.mr ? 'left drops' : 'right drops', ok ? GR : RD);
          Book.sfx(ok ? 'success' : 'error', { gain: 0.35 });
          r.set({ answer: tests.map((t, j) => `test ${j + 1}: ${t.put} → ${t.ok ? 'balanced ✓' : t.out + ' ✗'}`).join('; '), correct: ok, score: ok ? 1 : 0, max: 1, mis: tests[0].ok ? '' : 'moment-distance', tests: tests.slice(), done: ok });
          Bx.res.className = 'p06-res on';
          Bx.res.innerHTML = momHTML(m) + `<div class="p06-verdict ${ok ? 'good' : 'bad'}">${ok ? `✓ Balanced${tests.length === 1 ? ' first time' : ''}! Both moments are the same.` : '✗ The moments are not equal, so the side with the bigger moment drops.'}</div>` +
            (!ok && tests.length >= 2 ? '<div class="p06-hint"><b>Hint:</b> work out the moment of the red side first (force × distance). Your side has to make exactly the same moment.</div>' : '');
          go.style.display = 'none';
          if (ok) next.style.display = ''; else { again.style.display = ''; if (tests.length >= 3) { next.style.display = ''; next.className = 'btn ghost'; next.textContent = 'Skip ▸'; } }
        };
      }
      function freePlay() {
        beamB.load({ fixed: [], tray: [100, 200, 300, 400], sides: 'both' }); exLock();
        Bx.step.textContent = 'Free play';
        Bx.task.innerHTML = 'All five challenges done! Now hang <b>any</b> weights on <b>either</b> side. Can you balance three weights at once?';
        Bx.btns.innerHTML = ''; Bx.res.className = 'p06-res'; Bx.res.innerHTML = '';
        const go = button(ui, 'btn', 'Pull the pin: test it!', Bx.btns); go.disabled = true;
        const again = button(ui, 'btn ghost', '↺ Put the pin back', Bx.btns); again.style.display = 'none';
        beamB.onChange = () => { go.disabled = beamB.placed().length === 0; };
        go.onclick = () => { go.disabled = true; beamB.test(); };
        again.onclick = () => { beamB.relock(); again.style.display = 'none'; go.style.display = ''; go.disabled = beamB.placed().length === 0; Bx.res.className = 'p06-res'; };
        beamB.onSettle = (m) => {
          const ok = m.ml === m.mr;
          beamB.verdict(ok ? 'BALANCED!' : m.ml > m.mr ? 'left drops' : 'right drops', ok ? GR : RD);
          Bx.res.className = 'p06-res on'; Bx.res.innerHTML = momHTML(m);
          go.style.display = 'none'; again.style.display = '';
        };
      }
      { const k = CH.findIndex((_, j) => !finished(j)); k < 0 ? freePlay() : challenge(k); }

      // ---------------------------------------------------------------- 4. calculation
      ui.el('h2', '', 'Calculate the effort');
      ui.p('<span class="small">This worked example un-blurs once you have finished challenge 2.</span>');
      exBox = ui.box('A <b>400&nbsp;N</b> load sits <b>0.5&nbsp;m</b> from the fulcrum of a see-saw. What effort balances it from <b>2&nbsp;m</b> away on the other side?<br>effort × 2 = 400 × 0.5 = 200<br>effort = 200 ÷ 2 = <b>100&nbsp;N</b>', { tag: 'Worked example', color: RD });
      exLock();
      const calc = ui.fill({
        id: 'p06.calc', label: 'Moments: effort to balance 600 N at 0.5 m from 1.5 m away',
        q: '<b>Your turn:</b> a <b>600&nbsp;N</b> rock sits <b>0.5&nbsp;m</b> from the fulcrum of a long lever. You push down <b>1.5&nbsp;m</b> from the fulcrum on the other side. What effort balances the rock?',
        html: 'Moment of the load = force × distance = 600 × 0.5 = {{300|300.0}} Nm<br>To balance: effort × 1.5 = <b class="echo"></b><br>So effort = <b class="echo"></b> ÷ 1.5 = {{200|200.0}} N',
        explain: 'Load moment = 600 × 0.5 = 300 Nm, so effort = 300 ÷ 1.5 = <b>200 N</b>. You push three times further from the fulcrum, so you need only a third of the force.',
      });
      {
        const inps = calc.querySelectorAll('input.blank'), outs = calc.querySelectorAll('.echo');
        const upd = () => outs.forEach((e) => (e.textContent = inps[0].value.trim() || '(your moment)'));
        inps.forEach((i) => { i.inputMode = 'decimal'; i.style.width = '5.2em'; }); inps[0].addEventListener('input', upd); upd();
      }

      // ---------------------------------------------------------------- 5. real world
      const q = ui.mcq({
        id: 'p06.spanner', label: 'Why a longer spanner makes a stuck nut easier to undo',
        q: 'A nut is stuck. You swap to a <b>longer spanner</b> and it turns easily. <b>Why?</b> <span class="small">(The notes blur while you answer.)</span>',
        options: [
          { t: 'Your push is further from the fulcrum, so its moment is bigger.', ok: true, why: 'Yes: moment = force × distance, so the same push further out gives a bigger turning effect. That is also why a longer crowbar helps, and why door handles are far from the hinge.' },
          { t: 'Your push is nearer the fulcrum, so its moment is bigger.', mis: 'moment-distance', why: 'On a longer spanner your hand is further from the nut (the fulcrum), not nearer. And a moment gets bigger with distance, not smaller.' },
          { t: 'A longer spanner is heavier, so its weight does the work.', mis: 'moment-distance', why: 'The weight of the spanner hardly matters. What changes is how far your push is from the fulcrum.' },
          { t: 'A longer spanner grips the nut tighter, so it cannot slip.', mis: 'moment-distance', why: 'The jaws grip the nut just the same. What changes is how far your push is from the fulcrum.' },
        ],
      });
      {
        const done = () => { const it = items['p06.spanner']; return !!it && (it.correct === true || it.attempts >= 3); };
        q.addEventListener('pointerdown', () => { if (!done()) { answering = true; unlockNotes(); } }, { passive: true });
        q.addEventListener('click', () => setTimeout(() => { if (done()) { answering = false; unlockNotes(); } }, 60));
      }
    },
  });
})();
