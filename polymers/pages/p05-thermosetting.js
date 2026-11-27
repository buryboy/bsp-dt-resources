// Page 5 — The thermosetting five: mix a two-part epoxy and try to reheat it, then explore five exhibits that each
// need a thermoset (pan handle, plug, picnic plate, GRP boat hull, circuit board) and match the polymer to each.
(function () {
  'use strict';
  const B = Ink.BLUE, R = Ink.RED, G = Ink.GREEN, rgba = Ink.rgba, geo = Ink.geo;
  const PAPER = '#fbfaf5';
  const HAND = (s) => `400 ${s}px "Gloria Hallelujah", "Comic Sans MS", cursive`;
  const LAB = (s, w = 600) => `${w} ${s}px Fredoka, "Arial Rounded MT Bold", system-ui`;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  function css() {
    if (document.getElementById('p05-css')) return;
    const s = document.createElement('style'); s.id = 'p05-css';
    s.textContent = `
      .p05-st { margin: 0 0 calc(var(--R) * 1.4); padding: 14px 18px 16px; }
      .p05-st p { margin: 0 0 8px; }
      .p05-cv { display: block; width: 100%; height: auto; touch-action: none; user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; cursor: pointer; }
      .p05-out { min-height: 57px; font-size: 19px; line-height: 1.5; margin: 6px 0 0; }
      .p05-out b { font-family: Fredoka; font-weight: 600; }
      .p05-pick { display: flex; flex-wrap: wrap; gap: 8px; margin: 0 0 8px; }
      .p05-pick .opt { flex: 1 1 120px; text-align: center; min-height: 48px; padding: 6px 4px; font-size: 17px; }
      .p05-pick .opt.done::after { content: ' \\2713'; color: var(--green); font-family: Fredoka; }
      .p05-st .btn { margin-top: 6px; }
      .p05-gate { font-size: 18px; color: var(--red); margin: 0 0 8px; }
    `;
    document.head.appendChild(s);
  }

  // ---------- canvas helpers ----------
  function stage(parent, w, h, cls) {
    const c = document.createElement('canvas'); c.className = cls; parent.appendChild(c);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = w * dpr; c.height = h * dpr; c.style.aspectRatio = w + ' / ' + h;
    const ctx = c.getContext('2d');
    const S = { c, ctx, w, h, visible: true, dirty: true };
    S.pos = (e) => { const r = c.getBoundingClientRect(); return [(e.clientX - r.left) * w / r.width, (e.clientY - r.top) * h / r.height]; };
    S.begin = () => { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'source-over'; ctx.clearRect(0, 0, c.width, c.height); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.globalCompositeOperation = 'multiply'; ctx.lineCap = ctx.lineJoin = 'round'; };
    if (window.IntersectionObserver) new IntersectionObserver((es) => { S.visible = es[es.length - 1].isIntersecting; if (S.visible) S.dirty = true; }).observe(c);
    return S;
  }
  function run(root, S, step) {
    let last = performance.now();
    const f = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const pg = root.closest('.page');
      if (!(pg && pg.classList.contains('hidden')) && S.visible) step(dt);
      requestAnimationFrame(f);
    };
    requestAnimationFrame(f);
  }
  function text(ctx, s, x, y, o = {}) {
    ctx.save(); ctx.globalCompositeOperation = 'multiply';
    ctx.font = o.font === 'lab' ? LAB(o.size || 22) : HAND(o.size || 22);
    ctx.fillStyle = rgba(o.color || B, o.a ?? 0.92); ctx.textAlign = o.align || 'left'; ctx.textBaseline = 'alphabetic';
    ctx.translate(x, y); if (o.rot) ctx.rotate(o.rot); ctx.fillText(s, 0, 0); ctx.restore();
  }
  const poly = (ctx, pts) => { ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); };
  function hatch(ctx, pts, col = B, a = 0.4, sp = 6, dir = 1, lw = 1) {
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; pts.forEach(([x, y]) => { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); });
    ctx.save(); poly(ctx, pts); ctx.clip(); ctx.strokeStyle = rgba(col, a); ctx.lineWidth = lw; ctx.beginPath();
    if (dir > 0) { for (let c = Math.floor((x0 + y0) / sp) * sp; c < x1 + y1 + sp; c += sp) { const j = ((c * 7919) % 7) / 7 - 0.5; ctx.moveTo(c - y0 + 2 + j, y0 - 2); ctx.lineTo(c - y1 - 2 + j, y1 + 2); } }
    else { for (let c = Math.floor((x0 - y1) / sp) * sp; c < x1 - y0 + sp; c += sp) { const j = ((c * 7919) % 7) / 7 - 0.5; ctx.moveTo(c + y0 - 2 + j, y0 - 2); ctx.lineTo(c + y1 + 2 + j, y1 + 2); } }
    ctx.stroke(); ctx.restore();
  }
  const paperFill = (ctx, pts) => { ctx.save(); ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = PAPER; poly(ctx, pts); ctx.fill(); ctx.restore(); };
  const line = (ctx, pts, o = {}) => Ink.stroke(ctx, pts, Object.assign({ w: 2.4 }, o));
  const rot = (pts, cx, cy, a) => pts.map(([x, y]) => { const dx = x - cx, dy = y - cy; return [cx + dx * Math.cos(a) - dy * Math.sin(a), cy + dx * Math.sin(a) + dy * Math.cos(a)]; });
  const closed = (P) => P.concat([P[0]]);

  const arch = (cx, cy, rx, ry, n = 28) => { const o = []; for (let i = 0; i <= n; i++) { const a = Math.PI + Math.PI * i / n; o.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); } return o; };
  const wavy = (x, y0, y1, amp, ph) => { const o = []; for (let y = y0; y >= y1; y -= 6) o.push([x + Math.sin((y0 - y) * 0.09 + ph) * amp, y]); return o; };
  function hintTxt(ctx, s, x, y) { text(ctx, s, x, y, { size: 23, color: R, align: 'center' }); }

  // =====================================================================================
  // Part 1: mix a two-part epoxy, watch it set, then try to reheat it
  // =====================================================================================
  function mixStation(ui, root, host) {
    const rec = ui.record('p05.mix', { label: 'Epoxy demo: mixed resin + hardener, let it set, reheated it', type: 'experiment', max: 0 });
    const W = 860, Hh = 330, S = stage(host, W, Hh, 'p05-cv'), out = ui.el('div', 'p05-out', '', host);
    const again = ui.el('button', 'btn ghost', '↻ Mix a new batch', host); again.type = 'button';
    // stage: 0 squeeze, 1 stir, 2 setting, 3 reheat, 4 finished
    let M;
    const SAY = [
      'Tap <b>each tube</b> to squeeze some onto the mixing card.',
      'Now <b>stir</b> the two blobs together with your finger.',
      'Mixed! Watch what the hardener does…',
      'It has <b>set</b>: hard and rigid. Can heat soften it again? <b>Press and hold</b> to fire the heat gun at it.',
      'It scorched and charred, but it <b>never went soft</b>. Mixing in the hardener made <b>cross-links</b> between the chains, and they set it permanently. A thermosetting polymer is shaped <b>once</b>.',
    ];
    const fresh = (st) => { M = { st, a: st > 0 ? 1 : 0, b: st > 0 ? 1 : 0, stir: st > 1 ? 1 : 0, set: st > 2 ? 1 : 0, heat: st > 3 ? 1 : 0, hold: false, last: null, t: 0 }; out.innerHTML = SAY[st]; again.style.display = st === 4 ? '' : 'none'; S.dirty = true; };
    const go = (st) => { M.st = st; out.innerHTML = SAY[st]; again.style.display = st === 4 ? '' : 'none'; S.dirty = true; if (st === 4) { rec.set({ answer: 'mixed resin + hardener, it set hard; reheated: charred but did not soften', correct: true }); Book.sfx('success', { gain: 0.3 }); } };
    again.onclick = () => { fresh(0); Book.sfx('paper', { gain: 0.4 }); };

    const CX = 450, CY = 232;
    S.c.addEventListener('pointerdown', (e) => {
      e.preventDefault(); try { S.c.setPointerCapture(e.pointerId); } catch (_) {}
      const [x, y] = S.pos(e); M.hold = true; M.last = [x, y]; S.dirty = true;
      if (M.st === 0) {
        const k = x < 150 ? 'a' : x < 290 ? 'b' : x < 430 ? (M.a < 1 ? 'a' : 'b') : (M.b < 1 ? 'b' : 'a');
        if (M[k] === 0) { M[k] = 0.01; Book.sfx('pop', { gain: 0.3 }); }
      }
    });
    S.c.addEventListener('pointermove', (e) => {
      if (!M.hold) return; e.preventDefault(); const [x, y] = S.pos(e);
      if (M.st === 1) { const d = Math.hypot(x - M.last[0], y - M.last[1]); if (d > 2 && Math.abs(x - CX) < 230 && Math.abs(y - CY) < 110) { M.stir = Math.min(1, M.stir + d / 900); if (Math.random() < 0.15) Book.sfx('stroke', { material: 'pen', dur: 0.1, gain: 0.3 }); if (M.stir >= 1) { go(2); Book.sfx('tick', { gain: 0.5 }); } } M.stick = [x, y]; }
      M.last = [x, y]; S.dirty = true;
    });
    const up = () => { M.hold = false; M.stick = null; S.dirty = true; };
    S.c.addEventListener('pointerup', up); S.c.addEventListener('pointercancel', up);

    function tube(ctx, x, name, col, sq) {
      const P = [[x - 26, 60], [x + 26, 60], [x + 20 - sq * 6, 190], [x + 9, 204], [x + 9, 222], [x - 9, 222], [x - 9, 204], [x - 20 + sq * 6, 190]];
      const cr = geo.rect(x - 30, 46, 60, 16, 3);
      Ink.hatchShadow(ctx, P, 1, 6, 6, B); paperFill(ctx, P); hatch(ctx, P, col, 0.3, 7, 1); line(ctx, closed(P), { w: 2.4, seed: x });
      paperFill(ctx, cr); hatch(ctx, cr, B, 0.5, 4, -1); line(ctx, cr, { w: 2, seed: x + 1 });
      text(ctx, name, x, 34, { font: 'lab', size: 22, align: 'center', color: col });
    }
    function render() {
      S.begin(); const ctx = S.ctx;
      tube(ctx, 90, 'resin', B, M.a > 0 && M.a < 1 ? 1 : 0); tube(ctx, 220, 'hardener', R, M.b > 0 && M.b < 1 ? 1 : 0);
      // mixing card
      const card = [[250, 160], [690, 160], [660, 305], [280, 305]];
      Ink.hatchShadow(ctx, card, 1, 7, 7, B); paperFill(ctx, card); line(ctx, closed(card), { w: 2.4, seed: 12 });
      text(ctx, 'mixing card', 300, 152, { size: 21 });
      const k = M.stir, ax = CX - 60 * (1 - k), bx = CX + 60 * (1 - k);
      if (M.st === 0) {
        // beads travelling from each tube to the card
        if (M.a > 0 && M.a < 1) line(ctx, geo.curve([90, 224], [90, 300], [330, 300], [ax, CY], 20).slice(0, Math.max(2, Math.ceil(21 * M.a))), { w: 3, color: B, seed: 14 });
        if (M.b > 0 && M.b < 1) line(ctx, geo.curve([220, 224], [220, 290], [400, 300], [bx, CY], 20).slice(0, Math.max(2, Math.ceil(21 * M.b))), { w: 3, color: R, seed: 15 });
      }
      if (M.st <= 1) {
        if (M.a >= 1) { const P = geo.ellipse(ax, CY, 46 + 30 * k, 28 + 12 * k); hatch(ctx, P, B, 0.5, 5, 1); line(ctx, P, { w: 2.2, seed: 16, retrace: false }); }
        if (M.b >= 1) { const P = geo.ellipse(bx, CY + 4, 40 + 36 * k, 24 + 16 * k); hatch(ctx, P, R, 0.5, 5, -1); line(ctx, P, { w: 2.2, color: R, seed: 17, retrace: false }); }
        if (M.st === 1 && k > 0.05) { const sw = []; for (let i = 0; i < 40 * k; i++) { const a = i * 0.5, r = 6 + i * 1.6; sw.push([CX + Math.cos(a) * r, CY + Math.sin(a) * r * 0.5]); } if (sw.length > 2) line(ctx, sw, { w: 1.6, seed: 18, retrace: false }); }
      } else {
        // one mixed puddle that becomes a hard block
        const P = geo.ellipse(CX, CY, 78, 40), s = M.set, h = M.heat;
        if (s >= 1) Ink.hatchShadow(ctx, P, 1, 5, 5, B);
        paperFill(ctx, P); hatch(ctx, P, B, 0.4, 6, 1); hatch(ctx, P, R, 0.4, 6, -1);
        if (h > 0.5) { hatch(ctx, P, B, (h - 0.5) * 1.4, 3.2, 1, 1.2); hatch(ctx, P, B, (h - 0.5) * 1.2, 3.6, -1, 1.2); }
        line(ctx, P, { w: 2.2 + s * 1.2, seed: 19 });
        if (s > 0 && s < 1) {
          // a little clock while it sets
          const c = [760, 235]; line(ctx, geo.ellipse(c[0], c[1], 34, 34), { w: 2.4, seed: 21 }); const a = -Math.PI / 2 + s * Math.PI * 2;
          line(ctx, [c, [c[0] + Math.cos(a) * 24, c[1] + Math.sin(a) * 24]], { w: 2.4, color: R, seed: 22 }); line(ctx, [c, [c[0], c[1] - 16]], { w: 2, seed: 23 });
          text(ctx, 'setting…', 760, 300, { size: 22, align: 'center' });
        }
        if (s >= 1 && M.st === 3 && M.heat === 0) text(ctx, 'set hard', CX, CY - 52, { size: 22, align: 'center' });
      }
      if (M.stick) { const [x, y] = M.stick; line(ctx, [[x, y], [x + 60, y - 110]], { w: 5, seed: 24 }); }
      if (M.st >= 3) {
        // heat gun, pointing at the block
        const gx = 760, gy = 120, body = [[gx - 60, gy - 22], [gx + 40, gy - 30], [gx + 52, gy + 8], [gx + 30, gy + 20], [gx + 44, gy + 92], [gx + 8, gy + 98], [gx - 2, gy + 26], [gx - 56, gy + 16]];
        ctx.save(); ctx.translate(gx, gy); ctx.rotate(-0.5); ctx.translate(-gx, -gy);
        Ink.hatchShadow(ctx, body, 1, 5, 5, B); paperFill(ctx, body); hatch(ctx, body, B, 0.4, 6, 1); line(ctx, closed(body), { w: 2.4, seed: 26 });
        const noz = geo.rect(gx - 96, gy - 16, 38, 26, 3); paperFill(ctx, noz); hatch(ctx, noz, B, 0.55, 4, -1); line(ctx, noz, { w: 2, seed: 27 });
        ctx.restore();
        text(ctx, 'heat gun', 760, 40, { size: 22, align: 'center' });
        if (M.hold && M.st === 3) for (let i = 0; i < 4; i++) { const ph = performance.now() / 120 + i; line(ctx, [0, 1, 2, 3, 4, 5, 6, 7].map((j) => [660 - j * 17 + Math.sin(ph + j) * 3, 170 + i * 9 + j * (4 + i * 2) + Math.cos(ph + j) * 3]), { w: 1.6, color: R, seed: 30 + i, retrace: false }); }
        // heat bar
        const bar = geo.rect(300, 60, 300, 20, 6); line(ctx, bar, { w: 2, seed: 35 }); if (M.heat > 0.02) hatch(ctx, geo.rect(302, 62, 296 * M.heat, 16, 4), R, 0.75, 3.4, 1, 1.3);
        text(ctx, 'cool', 300, 50, { size: 20 }); text(ctx, 'very hot', 600, 50, { size: 20, align: 'right', color: R });
        if (M.heat > 0.55) [0, 1, 2].forEach((i) => line(ctx, wavy(CX - 40 + i * 40, CY - 40, CY - 70 - 40 * M.heat, 6, i * 2 + performance.now() / 300), { w: 1.6, seed: 40 + i, retrace: false }));
        if (M.heat >= 1) text(ctx, 'charred… but still hard', CX, 124, { size: 23, color: R, align: 'center' });
      }
      if (M.st === 0 && M.a === 0 && M.b === 0) hintTxt(ctx, '← tap each tube', 420, 110);
      if (M.st === 1 && M.stir < 0.05) hintTxt(ctx, 'stir round and round here', CX, 292);
      if (M.st === 3 && M.heat === 0 && !M.hold) hintTxt(ctx, 'press and hold →', 560, 124);
    }
    run(root, S, (dt) => {
      let anim = false;
      if (M.st === 0) { ['a', 'b'].forEach((k) => { if (M[k] > 0 && M[k] < 1) { M[k] = Math.min(1, M[k] + dt / 0.6); anim = true; } }); if (M.a >= 1 && M.b >= 1) go(1); }
      else if (M.st === 2) { M.set = Math.min(1, M.set + dt / 3.2); anim = true; if (M.set >= 1) { go(3); Book.sfx('thud', { gain: 0.3 }); } }
      else if (M.st === 3 && M.hold) { M.heat = Math.min(1, M.heat + dt / 3.4); anim = true; if (M.heat >= 1) go(4); }
      if (anim || S.dirty) { S.dirty = false; render(); }
    });
    fresh(rec.get() && rec.get().correct ? 4 : 0);
    if (document.fonts) document.fonts.ready.then(() => (S.dirty = true));
  }

  // =====================================================================================
  // Part 2: five exhibits
  // =====================================================================================
  const EX = [
    { k: 'pan', name: 'Pan handle', how: '<b>Press and hold</b> to turn the hob up to full heat. Watch the handle.',
      seen: 'The pan is far too hot to touch, but the handle is still hard and rigid. It has not softened at all.',
      label: 'This handle is <b>phenol formaldehyde</b>: hard and <b>very heat-resistant</b>, a good electrical insulator. It only comes in dark colours.' },
    { k: 'plug', name: 'Plug', how: '<b>Tap the switch</b> on the socket to turn the power on.',
      seen: 'Electricity flows through the metal pins and the wire, and the lamp lights. None flows through the case: it is safe to touch.',
      label: 'This plug case is <b>urea formaldehyde</b>: a <b>good electrical insulator</b>, hard, stiff and heat-resistant. It comes in white and pale colours.' },
    { k: 'plate', name: 'Picnic plate', how: '<b>Drag</b> the knife back and forth across the plate, hard.',
      seen: 'No scratches from the knife. The hot curry left no stain and no heat mark: the plate wiped clean.',
      label: 'This plate is <b>melamine formaldehyde</b>: hard, <b>scratch-, heat- and stain-resistant</b> and food safe. It takes bright colours.' },
    { k: 'hull', name: 'Boat hull', how: '<b>Tap the glass fibre mat</b> to lay a layer on your hull and brush resin in. Then <b>tap a weight</b> to test both hulls.',
      seen: 'The hull made of resin alone cracked. Your hull, with glass fibre set inside the resin, took the hit.',
      label: 'This hull is <b>polyester resin</b>: hard and stiff, but brittle on its own. <b>Reinforced with glass fibre</b> it becomes GRP (fibreglass), which is strong and light.' },
    { k: 'pcb', name: 'Circuit board', how: '<b>Tap the soldering iron</b> to solder the last joint.',
      seen: 'The iron was hot enough to melt solder, but the board was not harmed. The current only flows along the copper tracks, and the LED lights.',
      label: 'This board is made with <b>epoxy resin</b>: an <b>electrical insulator</b> that resists heat and chemicals. Like your mix, it starts as resin + hardener.' },
  ];

  function exhibits(ui, root, host, pick, label, onChange) {
    const rec = ui.record('p05.explore', { label: 'Exhibits explored (5 thermoset products)', type: 'experiment', max: 0 });
    const W = 860, Hh = 330, S = stage(host, W, Hh, 'p05-cv'), out = ui.el('div', 'p05-out', '', host);
    host.appendChild(label);
    const done = new Set((rec.get() && rec.get().done) || []);
    let ei = 0, T;
    const ex = () => EX[ei];
    const btns = EX.map((e, i) => { const b = ui.el('button', 'opt', e.name, pick); b.type = 'button'; b.onclick = () => { select(i); Book.sfx('tick', { gain: 0.5 }); }; return b; });
    const paint = () => btns.forEach((b, i) => { b.classList.toggle('sel', i === ei); b.classList.toggle('done', done.has(EX[i].k)); });
    function showLabel() { label.innerHTML = done.has(ex().k) ? '<span class="tag">Museum label</span>' + ex().label : '<span class="tag">Museum label</span><span class="small">Finish this exhibit to turn over its label.</span>'; }
    function finish() {
      if (T.done) return; T.done = true; T.dt = 0;
      const first = !done.has(ex().k); done.add(ex().k);
      if (first) rec.set({ answer: `explored ${done.size}/5: ` + EX.filter((e) => done.has(e.k)).map((e) => e.name).join(', '), correct: done.size === 5 ? true : null, done: [...done] });
      Book.sfx('success', { gain: 0.3 }); out.innerHTML = ex().seen; showLabel(); paint(); onChange(done.size);
    }
    function select(i) {
      ei = i; T = { done: false, dt: 0, heat: 0, hold: false, on: false, t: 0, dist: 0, last: null, tool: null, marks: [], food: -1, layers: 0, drop: -1, crackL: false, crackR: false, laying: 0, iron: -1, msg: '' };
      out.innerHTML = ex().how; showLabel(); paint(); S.dirty = true;
    }
    S.c.addEventListener('pointerdown', (e) => {
      e.preventDefault(); try { S.c.setPointerCapture(e.pointerId); } catch (_) {}
      const [x, y] = S.pos(e), k = ex().k; T.hold = true; T.last = null; S.dirty = true;
      if (k === 'plug') { if (!T.on) { T.on = true; T.t = 0; Book.sfx('tick', { gain: 0.6 }); } else if (T.done && T.dt > 1) select(ei); }
      else if (k === 'plate') { if (T.done && T.dt > 1.5) select(ei); else moveKnife(x, y); }
      else if (k === 'hull') {
        if (T.drop >= 0 && T.drop < 1.6) return;
        if (T.drop >= 1.6) { const keep = T.crackR ? T.layers : 0; const d = T.done; select(ei); T.layers = d ? 0 : keep; if (d) T.done = false; return; }
        if (y < 120 && x < 700) { T.drop = 0; T.msg = ''; Book.sfx('tick', { gain: 0.5 }); }
        else if (T.layers < 3 && T.laying === 0) { T.laying = 0.01; Book.sfx('paper', { gain: 0.4 }); }
      }
      else if (k === 'pcb') { if (T.iron < 0) { T.iron = 0; Book.sfx('tick', { gain: 0.5 }); } else if (T.done && T.dt > 1) select(ei); }
    });
    S.c.addEventListener('pointermove', (e) => { if (!T.hold) return; e.preventDefault(); const [x, y] = S.pos(e); if (ex().k === 'plate' && !T.done && T.food < 0) moveKnife(x, y); });
    const up = () => { T.hold = false; T.last = null; T.tool = null; S.dirty = true; };
    S.c.addEventListener('pointerup', up); S.c.addEventListener('pointercancel', up);
    const PL = [430, 170, 200, 122];
    function moveKnife(x, y) {
      const tip = [x - 40, y - 34]; T.tool = tip;
      const inside = (p) => ((p[0] - PL[0]) / PL[2]) ** 2 + ((p[1] - PL[1]) / PL[3]) ** 2 < 0.9;
      if (T.last && inside(tip) && inside(T.last)) { const d = Math.hypot(tip[0] - T.last[0], tip[1] - T.last[1]); if (d > 2) { T.marks.push({ a: T.last, b: tip, t: 0 }); T.dist += d; if (T.marks.length % 4 === 0) Book.sfx('stroke', { material: 'pen', dur: 0.08, gain: 0.4 }); T.last = tip; } if (T.dist > 420 && T.food < 0) { T.food = 0; T.tool = null; } }
      else T.last = tip;
      S.dirty = true;
    }

    // ---------- the five scenes ----------
    function drawPan(ctx) {
      const h = T.heat, now = performance.now() / 1000;
      // hob
      const hob = geo.rect(150, 262, 420, 46, 5); Ink.hatchShadow(ctx, hob, 1, 6, 6, B); paperFill(ctx, hob); hatch(ctx, hob, B, 0.4, 6, 1); line(ctx, hob, { w: 2.6, seed: 3 });
      const ring = geo.rect(250, 250, 200, 12, 4); paperFill(ctx, ring); hatch(ctx, ring, B, 0.6, 3.5, -1); line(ctx, ring, { w: 2, seed: 4 });
      line(ctx, geo.ellipse(520, 285, 13, 13), { w: 2, seed: 5 }); const ka = -2.2 + h * 2.6; line(ctx, [[520, 285], [520 + Math.cos(ka) * 12, 285 + Math.sin(ka) * 12]], { w: 2.4, color: R, seed: 6 });
      // flames
      for (let i = 0; i < 9; i++) { const x = 262 + i * 22, fh = (6 + 30 * h) * (0.75 + 0.25 * Math.sin(now * 9 + i * 1.7)); line(ctx, [[x - 6, 250], [x - 3, 250 - fh * 0.5], [x, 250 - fh], [x + 4, 250 - fh * 0.45], [x + 6, 250]], { w: 1.8, color: R, seed: 10 + i, retrace: false }); }
      // pan
      const pan = [[240, 130], [460, 130], [452, 212], [248, 212]];
      paperFill(ctx, pan); hatch(ctx, pan, B, 0.3, 7, 1); line(ctx, closed(pan), { w: 2.8, seed: 20 }); line(ctx, [[232, 130], [468, 130]], { w: 3.4, seed: 21 });
      if (h > 0.4) [0, 1, 2, 3].forEach((i) => line(ctx, wavy(280 + i * 46, 120, 120 - 70 * h, 7, i * 1.9 + now * 3), { w: 1.6, seed: 24 + i, retrace: false }));
      // the handle: long, dark, bolted to the pan
      const brk = [[460, 140], [492, 144], [492, 166], [458, 164]]; paperFill(ctx, brk); hatch(ctx, brk, B, 0.5, 4, 1); line(ctx, closed(brk), { w: 2, seed: 28 });
      const hd = [[490, 138], [720, 128], [738, 138], [738, 160], [720, 170], [490, 172]];
      Ink.hatchShadow(ctx, hd, 1, 5, 5, B); paperFill(ctx, hd); hatch(ctx, hd, B, 0.7, 3.4, 1, 1.2); hatch(ctx, hd, B, 0.6, 3.8, -1, 1.2); line(ctx, closed(hd), { w: 2.6, seed: 29 });
      line(ctx, geo.ellipse(712, 149, 7, 7), { w: 1.8, seed: 30 });
      text(ctx, 'handle', 610, 112, { size: 22, align: 'center' }); text(ctx, 'hob', 180, 252, { size: 22 });
      // heat bar
      const bar = geo.rect(560, 40, 260, 20, 6); line(ctx, bar, { w: 2, seed: 35 }); if (h > 0.02) hatch(ctx, geo.rect(562, 42, 256 * h, 16, 4), R, 0.75, 3.4, 1, 1.3);
      text(ctx, 'low', 560, 30, { size: 20 }); text(ctx, 'full heat', 820, 30, { size: 20, align: 'right', color: R });
      if (h === 0 && !T.hold) hintTxt(ctx, 'press and hold to heat', 200, 60);
      if (T.done) { text(ctx, 'too hot to touch!', 350, 60, { size: 23, color: R, align: 'center' }); Ink.tick(ctx, 560, 212, 1.2); text(ctx, 'still hard and rigid', 596, 216, { size: 22, color: G }); }
    }
    function drawPlug(ctx) {
      const now = performance.now() / 1000, on = T.on;
      // socket plate on the wall
      const plate = geo.rect(110, 60, 330, 210, 14); Ink.hatchShadow(ctx, plate, 1, 7, 7, B); paperFill(ctx, plate); line(ctx, plate, { w: 2.6, seed: 3 });
      const sw = geo.rect(140, 120, 70, 90, 8); paperFill(ctx, sw); line(ctx, sw, { w: 2.2, seed: 4 });
      const rk = on ? [[150, 130], [200, 136], [200, 200], [150, 188]] : [[150, 136], [200, 130], [200, 188], [150, 200]]; hatch(ctx, rk, on ? R : B, on ? 0.6 : 0.3, 5, 1); line(ctx, closed(rk), { w: 2, color: on ? R : B, seed: 5 });
      text(ctx, on ? 'ON' : 'OFF', 175, 108, { font: 'lab', size: 22, align: 'center', color: on ? R : B });
      // the plug (we see its back), pushed into the socket
      const body = [[262, 96], [398, 96], [412, 120], [412, 214], [372, 244], [288, 244], [248, 214], [248, 120]];
      Ink.hatchShadow(ctx, body, 1, 6, 6, B); paperFill(ctx, body); line(ctx, closed(body), { w: 2.8, seed: 8 });
      line(ctx, geo.ellipse(330, 160, 9, 9), { w: 1.8, seed: 9 }); line(ctx, [[324, 160], [336, 160]], { w: 1.6, seed: 10 });
      line(ctx, [[300, 122], [360, 122]], { w: 1.4, seed: 11 }); line(ctx, [[300, 196], [360, 196]], { w: 1.4, seed: 12 });
      text(ctx, 'plug case', 330, 50, { size: 22, align: 'center' });
      // cable to a lamp
      const cab = geo.curve([330, 244], [330, 330], [640, 330], [700, 240], 40); line(ctx, cab, { w: 4.5, seed: 13 });
      const bulb = geo.ellipse(700, 150, 44, 50); if (on && T.t > 0.5) { ctx.save(); ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = 'rgba(255,235,90,.55)'; poly(ctx, bulb); ctx.fill(); ctx.restore(); }
      line(ctx, bulb, { w: 2.4, seed: 14 }); const cap = geo.rect(682, 196, 36, 44, 4); paperFill(ctx, cap); hatch(ctx, cap, B, 0.5, 4, 1); line(ctx, cap, { w: 2, seed: 15 });
      line(ctx, [[688, 196], [690, 160], [697, 148], [704, 160], [711, 148], [712, 196]], { w: 1.6, color: on && T.t > 0.5 ? R : B, seed: 16, retrace: false });
      text(ctx, 'lamp', 700, 80, { size: 22, align: 'center' });
      if (on) {
        // current: dots running along the cable
        ctx.save(); ctx.fillStyle = rgba(R, 0.9); for (let i = 0; i < 7; i++) { const u = ((now * 0.5 + i / 7) % 1) * Math.min(1, T.t / 0.5), p = cab[Math.floor(u * (cab.length - 1))]; ctx.beginPath(); ctx.arc(p[0], p[1], 4.5, 0, 7); ctx.fill(); } ctx.restore();
        if (T.t > 0.5) for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5 + 0.2; if (a > 0.9 && a < 2.3) continue; line(ctx, [[700 + Math.cos(a) * 54, 150 + Math.sin(a) * 60], [700 + Math.cos(a) * 72, 150 + Math.sin(a) * 78]], { w: 2, color: R, seed: 40 + i, retrace: false }); }
      }
      // a finger resting on the case
      const fx = 412 + (on && T.t > 0.9 ? 0 : 34), fing = [[fx, 158], [fx + 14, 150], [fx + 120, 150], [fx + 120, 188], [fx + 14, 188], [fx, 180]];
      paperFill(ctx, fing); line(ctx, [[fx + 120, 150], [fx + 14, 150], [fx, 158], [fx, 180], [fx + 14, 188], [fx + 120, 188]], { w: 2.4, seed: 18 }); line(ctx, [[fx + 4, 160], [fx + 24, 158], [fx + 26, 172]], { w: 1.4, seed: 19 }); line(ctx, [[fx + 62, 156], [fx + 64, 166]], { w: 1.3, seed: 20 });
      if (!on) hintTxt(ctx, '↑ tap the switch', 180, 302);
      if (T.done) { Ink.tick(ctx, 450, 132, 1.2); text(ctx, 'no shock!', 484, 136, { size: 23, color: G }); }
    }
    function drawPlate(ctx) {
      const [cx, cy, rx, ry] = PL;
      const outer = geo.ellipse(cx, cy, rx, ry), inner = geo.ellipse(cx, cy, rx * 0.68, ry * 0.66);
      Ink.hatchShadow(ctx, outer, 1, 8, 8, B); paperFill(ctx, outer);
      // bright rim pattern
      ctx.save(); ctx.beginPath(); outer.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); inner.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.clip('evenodd');
      for (let i = 0; i < 24; i++) { const a = i * Math.PI / 12; const tri = [[cx + Math.cos(a) * rx * 0.72, cy + Math.sin(a) * ry * 0.72], [cx + Math.cos(a + 0.13) * rx * 0.98, cy + Math.sin(a + 0.13) * ry * 0.98], [cx + Math.cos(a - 0.13) * rx * 0.98, cy + Math.sin(a - 0.13) * ry * 0.98]]; hatch(ctx, tri, i % 2 ? R : B, 0.7, 3.2, 1, 1.2); }
      ctx.restore();
      line(ctx, outer, { w: 2.8, seed: 3 }); line(ctx, inner, { w: 2, seed: 4 });
      // knife marks fade away: nothing is left behind
      ctx.save(); T.marks.forEach((m) => { ctx.strokeStyle = rgba(B, 0.5 * (1 - m.t / 0.7)); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(m.a[0], m.a[1]); ctx.lineTo(m.b[0], m.b[1]); ctx.stroke(); }); ctx.restore();
      if (T.food >= 0) {
        const f = T.food;
        if (f < 2.2) { const k = clamp(f / 0.3, 0, 1), wipe = clamp((f - 1.5) / 0.7, 0, 1), bl = geo.wob(geo.seg(geo.ellipse(cx, cy, 80 * k, 44 * k), 6), 7, 5, 0.05); if (k > 0.1 && wipe < 1) { ctx.save(); ctx.beginPath(); ctx.rect(cx - 100 + 200 * wipe, cy - 60, 200, 120); ctx.clip(); hatch(ctx, bl, R, 0.6, 4, 1, 1.3); hatch(ctx, bl, R, 0.4, 5, -1); line(ctx, closed(bl), { w: 1.8, color: R, seed: 8, retrace: false }); ctx.restore(); }
          if (wipe === 0) { [0, 1, 2].forEach((i) => line(ctx, wavy(cx - 36 + i * 36, cy - 30, cy - 80, 6, i * 2 + f * 4), { w: 1.5, color: R, seed: 12 + i, retrace: false })); text(ctx, 'hot curry!', cx, cy - 92, { size: 23, color: R, align: 'center' }); }
          else { const wx = cx - 100 + 200 * wipe, cl = geo.rect(wx - 30, cy - 46, 44, 92, 10); paperFill(ctx, cl); hatch(ctx, cl, B, 0.3, 5, 1); line(ctx, cl, { w: 2, seed: 16 }); } }
      }
      // the knife
      const k = T.tool || [120, 150];
      ctx.save(); ctx.translate(k[0], k[1]); ctx.rotate(0.7); const bl = [[0, 0], [14, -9], [86, -9], [86, 7], [8, 7]], hd = geo.rect(86, -11, 70, 20, 8);
      paperFill(ctx, bl); line(ctx, closed(bl), { w: 1.8, seed: 20 }); paperFill(ctx, hd); hatch(ctx, hd, B, 0.5, 4, 1); line(ctx, hd, { w: 2, seed: 21 }); ctx.restore();
      if (T.dist < 5) hintTxt(ctx, 'drag the knife across the plate', 640, 312);
      if (T.done) { Ink.tick(ctx, 660, 60, 1.2); text(ctx, 'no scratch', 696, 50, { size: 22, color: G }); text(ctx, 'no stain', 696, 80, { size: 22, color: G }); }
    }
    const HIT_L = 286 - 120 - 18, hitR = () => 286 - (T.layers ? 111 + 9 * T.layers : 108) - 18;
    function hullShape(ctx, cx, n, mould, cracked, seed) {
      const by = 286;
      if (mould) { const m = arch(cx, by, 98, 108).concat([[cx + 98, by], [cx - 98, by]]); hatch(ctx, m, B, 0.16, 9, 1); line(ctx, arch(cx, by, 98, 108), { w: 1.4, seed: seed + 9, retrace: false }); text(ctx, 'mould', cx, by - 30, { size: 21, align: 'center', a: 0.7 }); }
      for (let i = 0; i < n; i++) {
        const r0 = 101 + i * 9, o = arch(cx, by, r0 + 9, r0 + 19), inn = arch(cx, by, r0, r0 + 10).reverse();
        if (cracked) {
          const half = (s) => { const P = o.filter((p) => (p[0] - cx) * s >= 0).concat(inn.filter((p) => (p[0] - cx) * s >= 0)); const Q = rot(P, cx + s * (r0 + 4), by, s * 0.16).map(([x, y]) => [x + s * 8, y]); paperFill(ctx, Q); hatch(ctx, Q, B, 0.3, 6, 1); line(ctx, closed(Q), { w: 2.2, seed: seed + i }); };
          half(-1); half(1);
        } else { const P = o.concat(inn); paperFill(ctx, P); if (mould) { hatch(ctx, P, B, 0.5, 4, 1); hatch(ctx, P, B, 0.5, 4, -1); } else hatch(ctx, P, B, 0.3, 6, 1); line(ctx, closed(P), { w: 2.2, seed: seed + i }); }
      }
    }
    function drawHull(ctx) {
      line(ctx, [[20, 288], [840, 288]], { w: 2.8, seed: 3 });
      const d = T.drop, hitL = HIT_L, topR = hitR();
      hullShape(ctx, 220, 1, false, T.crackL, 40);
      text(ctx, 'A: resin alone', 220, 318, { size: 22, align: 'center' });
      if (T.layers === 0 && T.laying === 0) hullShape(ctx, 520, 0, true, false, 60); else hullShape(ctx, 520, T.layers, !T.crackR, T.crackR, 60);
      if (T.laying > 0) { const r0 = 101 + T.layers * 9, A = arch(520, 286, r0 + 5, r0 + 15, 40); line(ctx, A.slice(0, Math.max(2, Math.ceil(A.length * T.laying))), { w: 5, seed: 70, retrace: false }); }
      text(ctx, `B: yours, ${T.layers} glass fibre layer${T.layers === 1 ? '' : 's'}`, 520, 318, { size: 22, align: 'center' });
      // weights
      const g = (cx, hit, cr) => {
        let y = 46;
        if (d >= 0) { const fall = 46 + 1200 * d * d, th = Math.sqrt((hit - 46) / 1200); y = cr ? Math.min(fall, 268) : d < th ? fall : hit - Math.abs(Math.sin((d - th) * 9)) * 34 * Math.exp(-(d - th) * 3.5); }
        const P = geo.rect(cx - 22, y - 18, 44, 36, 5); paperFill(ctx, P); hatch(ctx, P, B, 0.6, 3.6, 1, 1.2); line(ctx, P, { w: 2.4, seed: cx }); if (d < 0) line(ctx, [[cx, 28], [cx, 4]], { w: 1.8, seed: cx + 1 });
      };
      g(220, hitL, T.crackL); g(520, topR, T.crackR);
      if (T.crackL) text(ctx, 'CRACK!', 300, 110, { size: 30, color: R, rot: -0.1 });
      if (T.crackR) text(ctx, 'CRACK!', 600, 110, { size: 30, color: R, rot: -0.1 });
      if (T.done) { Ink.tick(ctx, 716, 268, 1.2); text(ctx, 'B: strong!', 750, 272, { size: 23, color: G }); }
      // roll of glass fibre mat
      const roll = geo.rect(726, 150, 110, 84, 10); Ink.hatchShadow(ctx, roll, 1, 6, 6, B); paperFill(ctx, roll); hatch(ctx, roll, B, 0.4, 5, 1); hatch(ctx, roll, B, 0.4, 5, -1); line(ctx, roll, { w: 2.4, seed: 80 }); line(ctx, geo.ellipse(836, 192, 10, 42), { w: 2, seed: 81 });
      text(ctx, 'glass fibre', 781, 126, { size: 21, align: 'center' }); text(ctx, 'mat', 781, 146, { size: 21, align: 'center' });
      if (d < 0 && T.layers < 3 && T.laying === 0) hintTxt(ctx, T.layers ? 'tap: add a layer' : 'tap: lay it up', 781, 262);
      if (d < 0 && T.laying === 0) hintTxt(ctx, 'tap a weight to test ↑', 370, 34);
      if (T.msg) text(ctx, T.msg, 370, 34, { size: 22, color: R, align: 'center' });
    }
    function drawPcb(ctx) {
      const brd = geo.rect(210, 60, 420, 210, 10), it = T.iron, lit = it >= 1.5;
      Ink.hatchShadow(ctx, brd, 1, 7, 7, B); paperFill(ctx, brd); hatch(ctx, brd, G, 0.3, 7, 1); line(ctx, brd, { w: 2.6, seed: 3 });
      // battery
      const bat = geo.rect(40, 120, 110, 90, 8); Ink.hatchShadow(ctx, bat, 1, 5, 5, B); paperFill(ctx, bat); hatch(ctx, bat, B, 0.35, 6, -1); line(ctx, bat, { w: 2.4, seed: 5 }); text(ctx, '9V', 95, 176, { font: 'lab', size: 30, align: 'center' });
      line(ctx, geo.curve([150, 140], [180, 140], [190, 110], [240, 110], 16), { w: 2.6, color: R, seed: 6 }); line(ctx, geo.curve([150, 190], [180, 190], [190, 230], [240, 230], 16), { w: 2.6, seed: 7 });
      // copper tracks (red pen)
      const tr = [[[240, 110], [330, 110], [360, 140], [410, 140]], [[470, 140], [520, 140], [550, 110], [580, 110]], [[580, 150], [580, 230], [440, 230]], [[400, 230], [240, 230]]];
      tr.forEach((t, i) => { line(ctx, t, { w: 4.2, color: R, seed: 10 + i }); [t[0], t[t.length - 1]].forEach((p, j) => line(ctx, geo.ellipse(p[0], p[1], 6, 6), { w: 2, color: R, seed: 20 + i * 2 + j, retrace: false })); });
      // resistor and LED
      const rs = geo.rect(410, 130, 60, 20, 4); paperFill(ctx, rs); hatch(ctx, rs, B, 0.5, 4, 1); line(ctx, rs, { w: 2, seed: 30 });
      const led = geo.ellipse(580, 130, 20, 20); if (lit) { ctx.save(); ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = 'rgba(255,120,110,.6)'; poly(ctx, led); ctx.fill(); ctx.restore(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 + 0.3; line(ctx, [[580 + Math.cos(a) * 28, 130 + Math.sin(a) * 28], [580 + Math.cos(a) * 42, 130 + Math.sin(a) * 42]], { w: 2, color: R, seed: 50 + i, retrace: false }); } }
      else paperFill(ctx, led);
      line(ctx, led, { w: 2.4, seed: 31 }); text(ctx, 'LED', 580, 92, { size: 21, align: 'center' });
      text(ctx, 'copper track', 250, 96, { size: 21 }); text(ctx, 'board', 250, 190, { size: 21 });
      // the unsoldered gap at (420, 230)
      if (it >= 1) { const bl = geo.ellipse(420, 230, 24, 10); paperFill(ctx, bl); hatch(ctx, bl, B, 0.7, 3, 1, 1.2); line(ctx, bl, { w: 2, seed: 33 }); }
      else text(ctx, 'gap', 420, 262, { size: 21, align: 'center', color: R });
      // soldering iron
      const k = it < 0 ? 0 : it < 0.5 ? it / 0.5 : it < 1.2 ? 1 : it < 1.7 ? 1 - (it - 1.2) / 0.5 : 0, tx = 700 - (700 - 428) * k, ty = 250 - (250 - 226) * k;
      ctx.save(); ctx.translate(tx, ty); ctx.rotate(0.5); const tipP = [[0, 0], [40, -5], [40, 5]], sh = geo.rect(40, -4, 50, 8, 2), hd = geo.rect(90, -13, 90, 26, 9);
      paperFill(ctx, tipP); line(ctx, closed(tipP), { w: 1.8, seed: 36 }); paperFill(ctx, sh); line(ctx, sh, { w: 1.6, seed: 37 }); paperFill(ctx, hd); hatch(ctx, hd, B, 0.6, 4, 1); line(ctx, hd, { w: 2.2, seed: 38 }); ctx.restore();
      if (it < 0) { text(ctx, 'soldering iron', 730, 226, { size: 21, align: 'center' }); text(ctx, '(very hot)', 730, 204, { size: 20, align: 'center', color: R }); hintTxt(ctx, 'tap the iron', 730, 60); }
      if (it >= 0.5 && it < 1.3) [0, 1].forEach((i) => line(ctx, wavy(416 + i * 14, 212, 150, 6, i * 2 + it * 6), { w: 1.5, seed: 40 + i, retrace: false }));
      if (T.done) { Ink.tick(ctx, 250, 302, 1.1); text(ctx, 'board not harmed by the heat', 284, 306, { size: 22, color: G }); }
    }
    function render() { S.begin(); const k = ex().k; (k === 'pan' ? drawPan : k === 'plug' ? drawPlug : k === 'plate' ? drawPlate : k === 'hull' ? drawHull : drawPcb)(S.ctx); if (T.done && T.dt > 1.6 && k !== 'pan') text(S.ctx, 'tap to run it again', 20, 22, { size: 19, a: 0.65 }); }
    run(root, S, (dt) => {
      let anim = false; const k = ex().k;
      if (T.done) { T.dt += dt; if (T.dt < 1.8) anim = true; }
      if (k === 'pan') { if (T.hold && T.heat < 1) { T.heat = Math.min(1, T.heat + dt / 3); if (T.heat >= 1) finish(); } if (T.heat > 0) anim = true; }
      else if (k === 'plug') { if (T.on) { T.t += dt; anim = true; if (T.t > 1.3) finish(); } }
      else if (k === 'plate') {
        if (T.marks.length) { T.marks.forEach((m) => (m.t += dt)); T.marks = T.marks.filter((m) => m.t < 0.7); anim = true; }
        if (T.food >= 0 && T.food < 2.3) { T.food += dt; anim = true; if (T.food >= 2.2) finish(); }
      } else if (k === 'hull') {
        if (T.laying > 0) { T.laying += dt / 0.6; anim = true; if (T.laying >= 1) { T.laying = 0; T.layers++; Book.sfx('pop', { gain: 0.3 }); } }
        if (T.drop >= 0 && T.drop < 1.7) {
          const before = T.drop; T.drop += dt; anim = true;
          const tL = Math.sqrt((HIT_L - 46) / 1200), tR = Math.sqrt((hitR() - 46) / 1200);
          if (before < tL && T.drop >= tL) { T.crackL = true; Book.sfx('thud', { gain: 0.6 }); }
          if (before < tR && T.drop >= tR) { if (T.layers < 2) { T.crackR = true; } Book.sfx('thud', { gain: 0.5 }); }
          if (before < 1.2 && T.drop >= 1.2) { if (T.layers === 0) T.msg = 'B has no hull yet: lay up some glass fibre'; else if (T.crackR) T.msg = 'B cracked too: one layer is too thin. Tap, add more.'; else finish(); }
        }
      } else if (k === 'pcb') { if (T.iron >= 0 && T.iron < 1.8) { const b = T.iron; T.iron += dt; anim = true; if (b < 0.5 && T.iron >= 0.5) Book.sfx('stroke', { material: 'pen', dur: 0.4, gain: 0.3 }); if (T.iron >= 1.7) finish(); } }
      if (anim || S.dirty) { S.dirty = false; render(); }
    });
    select(0);
    if (document.fonts) document.fonts.ready.then(() => (S.dirty = true));
    return done;
  }

  // =====================================================================================
  Book.page({
    id: 'p05',
    title: 'The thermosetting five',
    build(ui, root) {
      css();
      ui.h('The thermosetting five');
      ui.p('Thermosetting polymers are shaped <b>once</b> and then set for good. Start by making one yourself: a <b>two-part epoxy</b>, the kind sold as strong glue.');

      const s1 = ui.el('div', 'box p05-st'); requestAnimationFrame(() => Ink.frame(s1));
      ui.el('span', 'tag', 'Mix it', s1);
      mixStation(ui, root, s1);

      ui.h('Five exhibits', { size: 40 });
      ui.p('AQA wants you to know <b>five thermosetting polymers</b>. Each exhibit below is a product that <b>needs</b> one. Try all five, and read each museum label: you will need the names in a moment.');
      const s2 = ui.el('div', 'box p05-st'); requestAnimationFrame(() => Ink.frame(s2));
      ui.el('span', 'tag', 'Exhibits', s2);
      const pick = ui.el('div', 'p05-pick', '', s2);
      const label = document.createElement('div'); label.className = 'box'; label.style.margin = '8px 0 0';
      const gate = document.createElement('p');
      const it = (id) => Book.state.items[id];
      let matchEl = null;
      const setGate = (n) => { if (!matchEl) return; const open = n >= 5 || !!it('p05.exhibits'); matchEl.classList.toggle('peek-lock', !open); gate.className = 'p05-gate'; gate.textContent = open ? '' : `Locked: explore all five exhibits first (${n} of 5 done).`; gate.style.display = open ? 'none' : ''; };
      const done = exhibits(ui, root, s2, pick, label, (n) => setGate(n));
      requestAnimationFrame(() => Ink.frame(label, { shadow: false, w: 2 }));

      ui.h('Which polymer?', { size: 40 });
      ui.p('<span class="small">The museum labels blur while you answer these three.</span>');
      root.appendChild(gate);
      const acts = [];
      matchEl = ui.match({ id: 'p05.exhibits', label: 'Match the thermosetting polymer to each exhibit', q: 'Tap an exhibit, then tap the polymer it was made from.',
        pairs: [
          ['Saucepan handle', 'Phenol formaldehyde', 'thermoset-mixup'],
          ['Electrical plug', 'Urea formaldehyde', 'thermoset-mixup'],
          ['Picnic plate', 'Melamine formaldehyde', 'thermoset-mixup'],
          ['Boat hull', 'Polyester resin', 'thermoset-mixup'],
          ['Circuit board', 'Epoxy resin', 'thermoset-mixup'],
        ] });
      acts.push(matchEl);
      setGate(done.size);
      acts.push(ui.mcq({ id: 'p05.grp', label: 'What GRP is and why glass fibre is added', q: 'Boat hulls are made from <b>GRP</b>. What is GRP, and what does the glass fibre do?',
        options: [
          { t: 'Polyester resin reinforced with glass fibre: makes it strong and light', ok: true, why: 'Yes! GRP = glass reinforced plastic (fibreglass). Polyester resin is brittle alone; the glass fibre makes it strong and light.' },
          { t: 'Polyester resin mixed with glass powder: makes it clear and shiny', mis: 'thermoset-mixup', why: 'The glass goes in as fibres (a mat), not powder, and it is not there for looks. Think about hull A and hull B.' },
          { t: 'Epoxy resin heated with glass fibre: makes it soft and flexible', mis: 'thermoset-mixup', why: 'Wrong resin, and the hull must be stiff. Think about what happened to hull A and hull B when the weight hit.' },
          { t: 'Polypropylene coated with glass fibre: makes it easy to remelt', mis: 'thermo-swap', why: 'Polypropylene is a thermoforming polymer. GRP uses a thermosetting resin, and it cannot be remelted.' },
        ] }));
      acts.push(ui.mcq({ id: 'p05.why', label: 'Why a pan handle is a thermoset, not thermoforming', q: 'Why is a saucepan handle made from a <b>thermosetting</b> polymer and not a thermoforming one?',
        options: [
          { t: 'A thermoset will not soften when it gets hot', ok: true, why: 'Yes! Its cross-links lock the chains, so heat cannot soften it. A thermoforming handle would soften and droop.' },
          { t: 'A thermoset softens to fit the shape of your hand', mis: 'thermo-swap', why: 'Thermosets never soften once set. It is thermoforming polymers that soften with heat.' },
          { t: 'A thermoforming polymer would char on a hot hob', mis: 'thermo-swap', why: 'A thermoforming polymer softens when heated. Think about which family stays rigid on a hot hob.' },
          { t: 'A thermoset can be melted down and recycled later', mis: 'thermoset-recycle', why: 'Thermosets cannot be remelted or recycled by melting: once set, they stay set.' },
        ] }));

      ui.p('<span class="small">The notes un-blur when all three are done. They blur again while you fill in the last blanks.</span>');
      const notes = ui.box(`<b>ER, epoxy resin</b>: mixed from resin + hardener; very strong adhesive, hard, electrical insulator, heat- and chemical-resistant. <i>Two-part adhesives, printed circuit boards.</i><br>
        <b>MF, melamine formaldehyde</b>: hard, scratch-, heat- and stain-resistant, food safe, bright colours. <i>Kitchen worktop laminates, picnic tableware.</i><br>
        <b>PF, phenol formaldehyde</b>: hard, brittle, very heat-resistant, electrical insulator, dark colours only. <i>Saucepan handles and knobs, snooker balls.</i><br>
        <b>PR, polyester resin</b>: hard, stiff, brittle alone; reinforced with glass fibre = <span class="key">GRP</span>, strong and light. <i>Boat hulls, car body panels, garden ponds.</i><br>
        <b>UF, urea formaldehyde</b>: hard, stiff, brittle, heat-resistant, electrical insulator, white or pale colours. <i>Plugs, sockets and switches, toilet seats.</i><br>
        All five are <span class="key">thermosets</span>: shaped once, they cannot be softened by heat or recycled by melting.`, { tag: 'Notes: the thermosetting five' });
      const fill = ui.fill({ id: 'p05.names', label: 'Abbreviations to names: ER, MF, PF, PR, UF', q: 'What do the abbreviations stand for? Type the missing word.',
        html: 'ER = {{epoxy|epoxi}} resin<br>MF = {{melamine|melamin}} formaldehyde<br>PF = {{phenol|phenolic}} formaldehyde<br>PR = {{polyester|poly ester|polyster}} resin<br>UF = {{urea}} formaldehyde',
        explain: 'ER, MF, PF, PR, UF: learn all five names.' });

      // labels blur while the three questions are being answered; notes stay blurred until they are done
      const qDone = () => { const m = it('p05.exhibits'); return !!(m && m.correct != null) && ['grp', 'why'].every((k) => it('p05.' + k) && it('p05.' + k).correct === true); };
      const fDone = () => { const f = it('p05.names'); return !!(f && (f.correct === true || f.attempts >= 3)); };
      let asking = false, filling = false;
      const sync = () => { label.classList.toggle('peek-lock', asking && !qDone()); notes.classList.toggle('peek-lock', !qDone() || (filling && !fDone())); };
      sync();
      acts.forEach((a) => { a.addEventListener('pointerdown', () => { asking = true; sync(); }, { passive: true }); a.addEventListener('click', () => setTimeout(sync, 50)); });
      fill.addEventListener('pointerdown', () => { filling = true; sync(); }, { passive: true });
      fill.addEventListener('click', () => setTimeout(sync, 50));
    },
  });
})();
