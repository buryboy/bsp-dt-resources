// Page 1 — Starter: the hot pan test. Two near-identical black plastic kitchen parts (A, a spatula; B, a spare
// saucepan handle). Predict, then drag each onto a pen-drawn hot pan: A goes soft and sags (cools in its new shape,
// reheat and prod it to reshape), B stays rigid and finally chars. The two family names appear only afterwards.
(function () {
  'use strict';
  const B = Ink.BLUE, RD = Ink.RED, rgba = Ink.rgba, geo = Ink.geo;
  const PAPER = '#fbfaf5';
  const HANDF = (s) => `400 ${s}px "Gloria Hallelujah", "Comic Sans MS", cursive`;
  const LABF = (s) => `600 ${s}px Fredoka, "Arial Rounded MT Bold", system-ui, sans-serif`;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const close = (P) => P.concat([P[0]]);

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
  function paper(x, pts) {
    x.save(); x.globalCompositeOperation = 'source-over'; x.fillStyle = PAPER; x.beginPath();
    pts.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.closePath(); x.fill(); x.restore();
  }
  function Stage(parent, W, Hh, touch) {
    const c = document.createElement('canvas'); parent.appendChild(c);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = Math.round(W * dpr); c.height = Math.round(Hh * dpr);
    Object.assign(c.style, { width: '100%', height: 'auto', aspectRatio: W + ' / ' + Hh, display: 'block', touchAction: touch || 'manipulation', userSelect: 'none', webkitUserSelect: 'none', webkitTouchCallout: 'none', cursor: 'pointer' });
    const ctx = c.getContext('2d');
    const S = { c, ctx, W, H: Hh, dpr, render: () => false };
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
    c.addEventListener('contextmenu', (e) => e.preventDefault());
    if (document.fonts) document.fonts.ready.then(() => { S.onFonts && S.onFonts(); S.go(); });
    return S;
  }

  // centre line of a bar: 100 px lying flat (inside the pan), then 120 px overhanging in direction dir, drooping by `bend`
  function bar(dir, bend) {
    const C = [], U = [];
    for (let v = 100; v > 0; v -= 10) { C.push([-dir * v, 0]); U.push(-v); }
    let px = 0, py = 0; C.push([0, 0]); U.push(0);
    for (let u = 6; u <= 120; u += 6) { const th = bend * (u / 120); px += dir * Math.cos(th) * 6; py += Math.sin(th) * 6; C.push([px, py]); U.push(u); }
    return { C, U };
  }
  function outline(C, U, hw) {
    const L = [], R = [];
    C.forEach((p, i) => {
      const a = C[Math.max(0, i - 1)], b = C[Math.min(C.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1, h = hw(U[i]);
      L.push([p[0] - (dy / d) * h, p[1] + (dx / d) * h]); R.push([p[0] + (dy / d) * h, p[1] - (dx / d) * h]);
    });
    return L.concat(R.reverse());
  }

  Book.page({
    id: 'p01',
    title: 'Starter: the hot pan test',
    build(ui, root) {
      ui.h('The hot pan test');
      ui.p('Two black plastic kitchen parts: <b>A</b> is a spatula, <b>B</b> is a spare saucepan handle. They look and feel almost the same. Someone leaves each one resting on a <b>hot frying pan</b>…');

      const got = (id) => Book.state.items[id];
      const RIGHT = 'One goes soft, the other stays stiff';
      const pred = ui.predict({ id: 'p01.predict', label: 'Starter prediction: two black plastics left on a hot pan', q: '<b>Predict:</b> what happens to the two plastics on the hot pan?',
        options: ['Both go soft and droop', 'Both stay stiff and hard', RIGHT, 'Both burst into flames at once'], onPick: () => unlock() });

      ui.el('h2', '', 'Now test them');
      const how = ui.p('<b>Drag A onto the pan</b> and leave it there. Watch! Then drag it back to its shelf to cool. Do the same with <b>B</b> (be patient with it). <b>Tap</b> a part to prod it with the tongs.');
      const lab = ui.el('div', ''); lab.style.cssText = 'position:relative;margin:0 0 10px;transition:opacity .3s';
      const lockMsg = ui.el('p', 'small red', 'Make your prediction first: then the hob switches on.'); lockMsg.style.marginTop = '-6px';

      const W = 860, HH = 470, RIM = 296, HOB = 412;
      const S = Stage(lab, W, HH, 'none');
      const r = ui.record('p01.try', { label: 'Hot pan test: heated A (sags, cools in new shape) and B (stays rigid, chars)', type: 'experiment', max: 3 });
      const prev = r.get() || {};
      const done = { sag: !!prev.sag, cooled: !!prev.cooled, char: !!prev.char, reshapes: prev.reshapes || 0 };
      const mk = (k, dir, hx, sx) => ({ k, dir, home: [hx, 150], slot: [sx, RIM - 13], x: hx, y: 150, tx: hx, ty: 150, on: false, temp: 0, bend: 0, tgt: 0, char: 0, shake: 0 });
      const A = mk('A', -1, 176, 300), Bh = mk('B', 1, 684, 560), items = [A, Bh];
      if (done.cooled) { A.bend = A.tgt = 1.2; }
      if (done.char) Bh.char = 1;
      let drag = null, moved = done.sag || done.char, last = 'A', hintProd = done.reshapes > 0;

      const stat = ui.el('p', '', ''); stat.style.cssText = 'min-height:calc(var(--R) * 2);margin-bottom:0';
      const list = ui.el('p', 'small', '');

      let sprStat;
      function buildArt() {
        sprStat = S.layer(W, HH, (x) => {
          // hob top and front
          Ink.stroke(x, [[150, HOB], [710, HOB]], { w: 3, seed: 3 });
          Ink.stroke(x, [[150, HOB], [150, HH - 8]], { w: 2.4, seed: 4 }); Ink.stroke(x, [[710, HOB], [710, HH - 8]], { w: 2.4, seed: 5 });
          [330, 430, 530].forEach((kx, i) => { Ink.stroke(x, geo.ellipse(kx, HOB + 30, 15, 15), { w: 2, seed: 6 + i, retrace: false }); pen(x, [[kx, HOB + 30], [kx + (i === 1 ? 9 : 0), HOB + 19 + (i === 1 ? 4 : 0)]], { w: 2.4, wob: false }); });
          // burner ring + pan supports
          const ring = geo.rect(356, HOB - 16, 148, 16, 5); Ink.hatchFill(x, ring, 1, B, 1.6); Ink.stroke(x, ring, { w: 2.2, seed: 9 });
          [[306, 352], [554, 352]].forEach(([a, b], i) => Ink.stroke(x, [[a, b], [a + (i ? 14 : -14), HOB]], { w: 2.6, seed: 12 + i }));
          Ink.stroke(x, [[292, 352], [568, 352]], { w: 2.6, seed: 14 });
          // the frying pan (side view), handle pointing away from us
          const panP = [[296, RIM], [564, RIM], [546, 350], [314, 350]];
          paper(x, panP); Ink.hatchShadow(x, panP, 1, 6, 5); Ink.hatchFill(x, panP, 1, B, 1.1); Ink.stroke(x, close(panP), { w: 3, seed: 15 });
          pen(x, [[306, RIM + 8], [554, RIM + 8]], { w: 1.3, a: 0.6, seed: 2 });
          // two little wall shelves for the parts to cool on
          [[168, 296], [564, 692]].forEach(([a, b], i) => {
            Ink.stroke(x, [[a, 163], [b, 163]], { w: 3, seed: 21 + i });
            Ink.stroke(x, [[a + 20, 164], [a + 20, 196], [a + 46, 164]], { w: 2, seed: 23 + i, retrace: false });
            Ink.stroke(x, [[b - 20, 164], [b - 20, 196], [b - 46, 164]], { w: 2, seed: 25 + i, retrace: false });
          });
          Ink.drawBubble(x, 'A', 222, 96, 46, B, 1, -0.03, 'center'); Ink.drawBubble(x, 'B', 638, 96, 46, B, 1, 0.02, 'center');
          text(x, 'spatula', 222, 228, { font: 'hand', size: 22, align: 'center' }); text(x, 'pan handle', 638, 228, { font: 'hand', size: 22, align: 'center' });
          text(x, 'HOT!', 430, 334, { size: 26, align: 'center', color: RD });
        });
      }
      buildArt(); S.onFonts = buildArt;

      function drawItem(x, it, t) {
        const sh = it.shake > 0 ? Math.sin(it.shake * 40) * 3 * it.shake : 0;
        const { C, U } = bar(it.dir, it.bend);
        const isA = it.k === 'A';
        const hw = isA ? (u) => (u < -38 ? 19 : u < -14 ? 19 - ((u + 38) / 24) * 8 : 11) : (u) => (u < -74 ? 7 : 12);
        const P = outline(C, U, hw).map(([a, b]) => [a + it.x + sh, b + it.y]);
        paper(x, P);
        if (it.temp > 0.05) { x.save(); x.fillStyle = `rgba(255,120,30,${0.5 * it.temp})`; x.beginPath(); P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.fill(); x.restore(); }
        x.save(); x.fillStyle = rgba(B, 0.42); x.beginPath(); P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.fill(); x.restore();
        Ink.hatchFill(x, P, 1, B, 2.6); Ink.hatchFill(x, P.map(([a, b]) => [a + 1.5, b + 0.5]), 1, B, 2.2);
        pen(x, close(P), { w: 2.6, wob: false, a: 0.95 });
        const at = (u) => { const i = U.findIndex((v) => v >= u); const p = C[Math.max(0, i)]; return [p[0] + it.x + sh, p[1] + it.y]; };
        // hanging hole at the tip; slots in the spatula blade; a metal ferrule + screw on the handle
        const hp = at(106); x.save(); x.globalCompositeOperation = 'source-over'; x.fillStyle = PAPER; x.beginPath(); x.arc(hp[0], hp[1], 4.5, 0, 7); x.fill(); x.restore();
        if (isA) { x.save(); x.globalCompositeOperation = 'source-over'; x.strokeStyle = PAPER; x.lineWidth = 3.4; x.lineCap = 'round'; [-9, 0, 9].forEach((dy) => { x.beginPath(); x.moveTo(it.x + sh + 50, it.y + dy); x.lineTo(it.x + sh + 88, it.y + dy); x.stroke(); }); x.restore(); }
        else { x.save(); x.globalCompositeOperation = 'source-over'; x.fillStyle = PAPER; x.fillRect(it.x + sh - 99, it.y - 6, 24, 12); x.restore(); pen(x, [[it.x + sh - 100, it.y - 7], [it.x + sh - 74, it.y - 7], [it.x + sh - 74, it.y + 7], [it.x + sh - 100, it.y + 7], [it.x + sh - 100, it.y - 7]], { w: 2, wob: false }); pen(x, [[it.x + sh - 90, it.y - 3], [it.x + sh - 84, it.y + 3]], { w: 1.6, wob: false }); }
        // char: cracks, flakes and smoke
        if (it.char > 0.02) {
          x.save(); x.globalCompositeOperation = 'source-over'; x.strokeStyle = PAPER; x.lineWidth = 2; x.lineCap = 'round';
          const n = Math.ceil(it.char * 7), rr = H.rng(31);
          for (let i = 0; i < n; i++) { const p = at(-84 + i * 28); x.beginPath(); let cx = p[0], cy = p[1] - 11; x.moveTo(cx, cy); for (let j = 0; j < 4; j++) { cx += rr.range(-6, 6); cy += 6; x.lineTo(cx, cy); } x.stroke(); }
          x.restore();
          for (let i = 0; i < 4; i++) { const sx = it.x + sh + it.dir * (-50 + i * 44), a = it.char * 0.8; const pts = []; for (let j = 0; j <= 10; j++) { const yy = it.y - 20 - j * 9 * (0.5 + it.char * 0.5); pts.push([sx + Math.sin(j * 0.9 + t * 3 + i * 2) * (4 + j * 1.3), yy]); } pen(x, pts, { w: 2, a, wob: false }); }
        }
        // heat shimmer above a hot part
        if (it.temp > 0.3 && it.char < 0.1) for (let i = 0; i < 3; i++) { const sx = it.x + sh + it.dir * (-60 + i * 50), pts = []; for (let j = 0; j <= 5; j++) pts.push([sx + Math.sin(j * 1.4 + t * 6 + i) * 4, it.y - 22 - j * 6]); pen(x, pts, { w: 1.8, color: RD, a: 0.75 * it.temp, wob: false }); }
        // name tag
        const tp = [it.x + sh - it.dir * 22, it.y];
        x.save(); x.globalCompositeOperation = 'source-over'; x.fillStyle = PAPER; x.beginPath(); x.arc(tp[0], tp[1], 10, 0, 7); x.fill(); x.restore();
        text(x, it.k, tp[0], tp[1] + 6, { size: 18, align: 'center' });
      }

      S.render = (dt, t) => {
        const x = S.ctx;
        // flames under the pan (highlighter orange + red pen)
        for (let i = 0; i < 7; i++) {
          const fx = 368 + i * 21, h = 26 + 9 * Math.sin(t * 9 + i * 1.9) + 4 * Math.sin(t * 15 + i), top = HOB - 16 - h;
          const F = geo.curve([fx - 8, HOB - 16], [fx - 10, HOB - 30], [fx - 2, top + 8], [fx + 1, top], 8).concat(geo.curve([fx + 1, top], [fx + 5, top + 12], [fx + 10, HOB - 28], [fx + 8, HOB - 16], 8));
          x.fillStyle = 'rgba(255,170,40,.75)'; x.beginPath(); F.forEach(([a, b], j) => (j ? x.lineTo(a, b) : x.moveTo(a, b))); x.fill();
          pen(x, F, { w: 2, color: RD, wob: false, a: 0.9 });
        }
        S.blit(sprStat, 0, 0);
        items.forEach((it) => {
          if (drag !== it) { it.x += (it.tx - it.x) * Math.min(1, dt * 12); it.y += (it.ty - it.y) * Math.min(1, dt * 12); }
          const onPan = it.on && drag !== it && Math.hypot(it.x - it.slot[0], it.y - it.slot[1]) < 10;
          it.temp = clamp(it.temp + (onPan ? 0.4 : -0.3) * dt);
          if (it.shake > 0) it.shake = Math.max(0, it.shake - dt * 2.2);
          if (it === A) {
            const soft = A.temp > 0.5;
            if (soft && !A.started) { A.started = true; if (Math.abs(A.bend) < 0.1) A.tgt = 1.2; }
            if (!soft) A.started = false;
            if (soft) { const d = A.tgt - A.bend; A.bend += Math.sign(d) * Math.min(Math.abs(d), dt * 0.9); }
            if (soft && A.bend > 1.05 && !done.sag) { done.sag = true; Book.sfx('pop', { gain: 0.4 }); commit(); }
            if (done.sag && !done.cooled && !A.on && A.temp < 0.2 && Math.abs(A.bend) > 0.5) { done.cooled = true; Book.sfx('tick', { gain: 0.5 }); commit(); }
          } else {
            if (onPan && it.temp >= 0.98 && it.char < 1) { it.char = Math.min(1, it.char + dt * 0.3); if (it.char >= 1 && !done.char) { done.char = true; Book.sfx('thud', { gain: 0.4 }); commit(); } }
          }
        });
        items.forEach((it) => { if (it !== drag) drawItem(x, it, t); });
        if (drag) drawItem(x, drag, t);
        if (!moved && !drag) { text(x, 'drag me onto the pan', 60, 60, { font: 'hand', size: 23, color: RD }); pen(x, [[120, 70], [110, 100], [116, 124]], { w: 2.2, color: RD }); pen(x, [[106, 112], [116, 126], [124, 110]], { w: 2.2, color: RD, wob: false }); }
        if (A.on && A.temp > 0.5 && done.sag && !hintProd && !drag) text(x, 'A is soft: tap it to bend it!', 430, 60, { font: 'hand', size: 23, color: RD, align: 'center' });
        say();
        return true;
      };

      let lastMsg = '', hold = 0;
      function say() {
        if (performance.now() < hold) return;
        const it = last === 'A' ? A : Bh; let m;
        if (!moved) m = 'Nothing on the pan yet.';
        else if (it === A) {
          if (A.on) m = A.temp < 0.5 ? '<b>A</b> is warming up…' : Math.abs(A.tgt - A.bend) > 0.05 ? '<b>A</b> has gone <b>soft</b>: it is bending!' : '<b>A</b> is soft and floppy in its new shape. Drag it back to its shelf to cool, or tap it to bend it another way.';
          else m = A.temp > 0.2 ? '<b>A</b> is cooling down…' : Math.abs(A.bend) > 0.5 ? '<b>A</b> is cold and <b>hard again</b>, stuck in its new shape. Put it back on the pan to soften it again.' : '<b>A</b> is cold and hard.';
        } else {
          if (Bh.on) m = Bh.temp < 0.6 ? '<b>B</b> is warming up…' : Bh.temp < 0.98 ? '<b>B</b> is very hot now… and still stiff.' : Bh.char < 1 ? '<b>B</b> is scorching hot. It is still rigid, but it is starting to smoke…' : '<b>B</b> has <b>charred and burnt</b>, but it never went soft.';
          else m = Bh.temp > 0.2 ? '<b>B</b> is cooling down…' : Bh.char >= 1 ? '<b>B</b> is cold, charred and exactly the same shape as before.' : '<b>B</b> is cold and hard. Leave it on the pan for longer.';
        }
        if (m !== lastMsg) { lastMsg = m; stat.innerHTML = m; }
      }
      function commit() {
        const sc = (done.sag ? 1 : 0) + (done.cooled ? 1 : 0) + (done.char ? 1 : 0);
        r.set({ answer: `A on the pan until it went soft and sagged: ${done.sag ? 'yes' : 'no'}; cooled A in its new shape: ${done.cooled ? 'yes' : 'no'}; re-bent A while soft: ${done.reshapes} time${done.reshapes === 1 ? '' : 's'}; B on the pan until it charred (never softened): ${done.char ? 'yes' : 'no'}`,
          correct: sc === 3 ? true : null, score: sc, max: 3, sag: done.sag, cooled: done.cooled, char: done.char, reshapes: done.reshapes });
        pred.querySelectorAll('.opt').forEach((b) => (b.disabled = true));
        status();
      }

      // pointer: drag a part between its shelf and the pan; a quick tap prods it with the tongs
      const hit = (it, px, py) => { const { C } = bar(it.dir, it.bend); return C.some(([a, b]) => Math.hypot(px - a - it.x, py - b - it.y) < 34); };
      let down = null;
      S.c.addEventListener('pointerdown', (e) => {
        const [px, py] = S.pos(e); const it = hit(A, px, py) ? A : hit(Bh, px, py) ? Bh : null; if (!it) return;
        drag = it; last = it.k; down = { px, py, ox: it.x - px, oy: it.y - py, t: performance.now(), far: false };
        try { S.c.setPointerCapture(e.pointerId); } catch (er) {} e.preventDefault();
      });
      S.c.addEventListener('pointermove', (e) => {
        if (!drag) return; const [px, py] = S.pos(e);
        if (Math.hypot(px - down.px, py - down.py) > 12) down.far = true;
        if (down.far) { drag.x = clamp(px + down.ox, 130, W - 130); drag.y = clamp(py + down.oy, 40, HOB - 30); }
      });
      const drop = () => {
        if (!drag) return; const it = drag; drag = null;
        if (!down.far) { // a tap = a prod with the tongs
          if (it === A && A.on && A.temp > 0.5) { A.tgt = A.tgt > 0 ? -0.85 : 1.2; done.reshapes++; hintProd = true; Book.sfx('pop', { gain: 0.4 }); if (done.sag) commit(); }
          else { it.shake = 1; Book.sfx('tick', { gain: 0.6 }); hold = performance.now() + 2200; lastMsg = ''; stat.innerHTML = `You prod <b>${it.k}</b> with the tongs: it is <b>rigid</b> and will not bend.`; }
          it.x = it.tx; it.y = it.ty; return;
        }
        moved = true;
        const near = it.x > 236 && it.x < 624 && it.y > 190;
        it.on = near; [it.tx, it.ty] = near ? it.slot : it.home; Book.sfx(near ? 'thud' : 'paper', { gain: 0.35 });
      };
      ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((ev) => S.c.addEventListener(ev, drop));

      // ------------------------------------------------------------------ after the experiment
      const rest = ui.el('div', '');
      const add = (e) => { rest.appendChild(e); return e; };
      const found = add(ui.box('', { tag: 'What you found' }));
      add(ui.el('h2', '', 'Two families of polymer'));
      const fam = add(ui.box('Plastics are <b>polymers</b>, and they come in two families:<br>'
        + '<span class="key">Thermoforming polymers</span> <b>soften when heated</b> and harden when cooled, again and again.<br>'
        + '<span class="key">Thermosetting polymers</span> are shaped <b>once</b>. Heat <b>cannot soften</b> them: they char or burn instead.', { tag: 'The big idea' }));
      add(ui.p('<span class="small">The big idea will blur while you answer.</span>')).style.marginTop = '-12px';
      const check = add(ui.mcq({ id: 'p01.check', label: 'Which family is the spatula (A) that sagged and re-hardened?', q: 'Think about what <b>spatula A</b> did on the pan and back on its shelf. Which family is it from?',
        options: [
          { t: 'Thermoforming: heat softens it every time', ok: true },
          { t: 'Thermosetting: heat softens it every time', mis: 'thermo-swap', why: 'Right behaviour, wrong name. A polymer that softens each time it is heated can be formed with heat: which family name says that?' },
          { t: 'Thermosetting: once set it never softens', mis: 'thermo-swap', why: 'That describes B, the handle that stayed rigid and charred. A went soft, sagged, then hardened again.' },
          { t: 'Thermoforming: once set it never softens', mis: 'thermo-swap', why: 'Look again at what A did: it went soft on the pan, more than once if you put it back. So it does soften.' },
        ],
        explain: 'A is a thermoforming polymer: it softens when heated and hardens when cooled, over and over. B, the pan handle, is a thermosetting polymer.' }));
      ui.hideWhile(check, 'p01.check', [fam, found]);
      add(ui.rate({ id: 'p01.conf', label: 'Confidence: telling thermoforming from thermosetting', q: 'How confident are you that you could explain the difference between the two families?' }));

      function status() {
        const all = done.sag && done.cooled && done.char;
        list.innerHTML = `<b>${done.sag ? '☑' : '☐'}</b> leave A on the pan &nbsp; <b>${done.cooled ? '☑' : '☐'}</b> cool A on its shelf &nbsp; <b>${done.char ? '☑' : '☐'}</b> leave B on the pan until something happens` + (all ? '' : '<br>Do all three to carry on.');
        rest.style.display = all ? '' : 'none';
        if (!all) return;
        const p = (got('p01.predict') || {}).answer, ok = p === RIGHT;
        found.innerHTML = '<span class="tag">What you found</span><b>A</b> went <b>soft</b> and sagged on the hot pan. Back on its shelf it went <b>hard again</b>, stuck in its new shape, and it softened again when you reheated it.<br><b>B</b> stayed <b>rigid</b> however hot it got. In the end it <b>charred</b>, but it never went soft.'
          + (p ? `<br>You predicted “${Book.esc(p.toLowerCase())}”: <b class="${ok ? 'green' : 'red'}">${ok ? '✓ spot on' : '✗ not this time'}</b>.` : '');
        requestAnimationFrame(() => Ink.frame(found));
      }
      function unlock() {
        const on = !!got('p01.predict');
        lab.style.opacity = on ? 1 : 0.35; lab.style.pointerEvents = on ? '' : 'none';
        lockMsg.style.display = on ? 'none' : ''; how.style.opacity = on ? 1 : 0.5;
        if (r.get()) pred.querySelectorAll('.opt').forEach((b) => (b.disabled = true));
      }
      unlock(); status(); S.go();
    },
  });
})();
