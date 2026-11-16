// Page 3 — Thermoforming vs thermosetting. The chain model lab: two test strips, each with a zoomed-in pen-drawn
// model of its chains (B's are tied by cross-links). Heat sliders: A's chains slide, the strip softens and can be
// re-shaped and cooled again and again; B's stay locked, the strip stays rigid and chars. Then a plastic memory demo
// (a vacuum-formed HIPS tray relaxes to flat), notes, a 10-card sort and fill-the-blanks with everything blurred.
(function () {
  'use strict';
  const B = Ink.BLUE, RD = Ink.RED, rgba = Ink.rgba, geo = Ink.geo;
  const PAPER = '#fbfaf5';
  const HANDF = (s) => `400 ${s}px "Gloria Hallelujah", "Comic Sans MS", cursive`;
  const LABF = (s) => `600 ${s}px Fredoka, "Arial Rounded MT Bold", system-ui, sans-serif`;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const sstep = (a, b, v) => { const u = clamp((v - a) / (b - a)); return u * u * (3 - 2 * u); };
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
  const dot = (x, px, py, r, a = 0.9, c = B) => { x.fillStyle = rgba(c, a); x.beginPath(); x.arc(px, py, r, 0, 7); x.fill(); };
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

  // centre line of a strip clamped at the left: angle along it = a1*s + a2*sin(2πs)
  function strip(x0, y0, len, a1, a2) {
    const C = [[x0, y0]]; let px = x0, py = y0;
    for (let u = 5; u <= len; u += 5) { const s = u / len, th = a1 * s + a2 * Math.sin(s * 6.283); px += Math.cos(th) * 5; py += Math.sin(th) * 5; C.push([px, py]); }
    return C;
  }
  function thick(C, h) {
    const L = [], R = [];
    C.forEach((p, i) => { const a = C[Math.max(0, i - 1)], b = C[Math.min(C.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1; L.push([p[0] - (dy / d) * h, p[1] + (dx / d) * h]); R.push([p[0] + (dy / d) * h, p[1] - (dx / d) * h]); });
    return L.concat(R.reverse());
  }

  Book.page({
    id: 'p03',
    title: 'Thermoforming vs thermosetting',
    build(ui, root) {
      ui.h('Two families');
      ui.p('Why did one plastic sag on the hot pan while the other stayed rigid? Zoom right in. Every polymer is made of <b>long chains</b>. Here are two test strips, <b>A</b> and <b>B</b>, each with a zoomed-in model of its chains.');

      const got = (id) => Book.state.items[id];
      const RIGHT = 'Only A: its chains are free to move';
      const lab = ui.el('div', ''); lab.style.cssText = 'position:relative;margin:0 0 10px;transition:opacity .3s';
      const pred = ui.predict({ id: 'p03.predict', label: 'Chain model prediction: which strip softens when heated?', q: '<b>Predict:</b> look closely at the two chain models above. Which strip will go <b>soft</b> when it is heated?',
        options: [RIGHT, 'Only B: its chains are tied together', 'Both: all plastics soften with heat', 'Neither: plastic strips only burn'], onPick: () => unlock() });
      const how = ui.p('Now go back up to the strips. <b>Drag each red slider</b> from cold to hot and watch the chains and the strip. When a strip is hot, <b>tap it</b> to try to bend it. Slide back to cold to cool it.');
      const lockMsg = ui.el('p', 'small red', 'Make your prediction first: then the heaters unlock.'); lockMsg.style.marginTop = '-6px';

      const W = 860, HH = 520, BOX = [222, 418], SY = 474;
      const S = Stage(lab, W, HH, 'pan-y');
      const r = ui.record('p03.lab', { label: 'Chain model lab: heated A (softens, re-shaped, cooled) and B (rigid, chars)', type: 'experiment', max: 4 });
      const prev = r.get() || {};
      const done = { soft: !!prev.soft, cooled: !!prev.cooled, char: !!prev.char, reshapes: prev.reshapes || 0 };
      const SHAPES = [[0, 0], [0.8, 0], [0, 0.8], [-0.7, 0]];
      const mk = (k, x0) => ({ k, x0, h: 0, sh: 0, a1: 0, a2: 0, char: 0, shake: 0, moved: false });
      const A = mk('A', 20), Bs = mk('B', 440), smp = [A, Bs];
      if (done.cooled) { A.sh = 1 + (done.reshapes % 3); [A.a1, A.a2] = SHAPES[A.sh]; }
      if (done.char) Bs.char = 1;
      let drag = null, last = 'A', hintTap = done.reshapes > 0;
      const concluded = () => { const it = got('p03.conclude'); return !!(it && it.correct === true); };

      const stat = ui.el('p', '', ''); stat.style.cssText = 'min-height:calc(var(--R) * 2);margin-bottom:0';
      const list = ui.el('p', 'small', '');

      // the chains: 7 wavy lines per sample; B's are tied to their neighbours by short links
      const rr = H.rng(21);
      const CH = smp.map(() => Array.from({ length: 7 }, (_, i) => ({ base: 246 + i * 24.5, p1: rr() * 6.3, p2: rr() * 6.3, f1: rr.range(0.028, 0.04), f2: rr.range(0.07, 0.1), dir: i % 2 ? 1 : -1, sp: rr.range(0.6, 1.1) })));
      const LINKS = []; for (let i = 0; i < 6; i++) for (let j = 0; j < 3; j++) LINKS.push([i, 62 + j * 118 + (i % 2) * 58 + rr.range(-14, 14)]);
      const chainY = (s, c, i, lx, t) => {
        const soft = s === A ? sstep(0.55, 0.9, s.h) : 0, amp = s === A ? 1.2 + 7 * s.h : 0.8 + 2.4 * s.h;
        const sx = lx - c.dir * soft * 46 * Math.sin(t * c.sp + i);
        return c.base + (i - 3) * 3.5 * soft + 15 * Math.sin(sx * c.f1 + c.p1) + 7 * Math.sin(sx * c.f2 + c.p2) + amp * Math.sin(t * (5 + i * 0.7) + lx * 0.055 + i * 2);
      };

      let sprStat;
      function buildArt() {
        sprStat = S.layer(W, HH, (x) => {
          smp.forEach((s, n) => {
            const x0 = s.x0;
            Ink.drawBubble(x, s.k, x0 + 22, 60, 44, B, 1, n ? 0.02 : -0.03);
            // clamp (a little bench vice holding the strip)
            const cl = geo.rect(x0 + 16, 84, 50, 52, 6); paper(x, cl); Ink.hatchShadow(x, cl, 1, 5, 5); Ink.hatchFill(x, cl, 1, B, 1.3); Ink.stroke(x, cl, { w: 2.6, seed: 5 + n });
            Ink.stroke(x, [[x0 + 41, 136], [x0 + 41, 168]], { w: 4, seed: 7 + n }); Ink.stroke(x, [[x0 + 22, 168], [x0 + 60, 168]], { w: 3, seed: 9 + n });
            // zoom box
            const bx = geo.rect(x0 + 10, BOX[0], 380, BOX[1] - BOX[0], 14); Ink.hatchShadow(x, bx, 1, 6, 6); Ink.stroke(x, bx, { w: 2.8, seed: 11 + n });
            pen(x, [[x0 + 78, 122], [x0 + 30, BOX[0]]], { w: 1.2, a: 0.45, seed: 3 }); pen(x, [[x0 + 100, 120], [x0 + 370, BOX[0]]], { w: 1.2, a: 0.45, seed: 4 });
            Ink.stroke(x, geo.ellipse(x0 + 88, 112, 12, 12), { w: 1.6, seed: 13 + n, retrace: false });
            // slider
            Ink.stroke(x, [[x0 + 80, SY], [x0 + 320, SY]], { w: 3, seed: 15 + n });
            for (let i = 0; i <= 6; i++) pen(x, [[x0 + 80 + i * 40, SY - 7], [x0 + 80 + i * 40, SY + 7]], { w: 1.5, wob: false, a: 0.7 });
            text(x, 'cold', x0 + 52, SY + 8, { font: 'hand', size: 22, align: 'right' }); text(x, 'hot', x0 + 350, SY + 8, { font: 'hand', size: 22, color: RD });
          });
          for (let y = 20; y < HH - 10; y += 22) pen(x, [[430, y], [430, y + 11]], { w: 1.4, a: 0.5, wob: false });
        });
      }
      buildArt(); S.onFonts = buildArt;

      S.render = (dt, t) => {
        const x = S.ctx; let busy = !!drag;
        S.blit(sprStat, 0, 0);
        smp.forEach((s, n) => {
          const x0 = s.x0, soft = s === A && s.h > 0.6;
          // --- the strip
          if (s === A) {
            if (soft && !A.wasSoft) { A.wasSoft = true; if (A.sh === 0) A.sh = 1; if (!done.soft) { done.soft = true; Book.sfx('pop', { gain: 0.4 }); commit(); } }
            if (!soft) A.wasSoft = false;
            if (soft) { const [t1, t2] = SHAPES[A.sh]; const d1 = t1 - A.a1, d2 = t2 - A.a2; if (Math.abs(d1) + Math.abs(d2) > 0.004) busy = true; A.a1 += Math.sign(d1) * Math.min(Math.abs(d1), dt * 1.3); A.a2 += Math.sign(d2) * Math.min(Math.abs(d2), dt * 1.3); }
            if (done.soft && !done.cooled && A.h < 0.2 && A.sh !== 0 && Math.abs(A.a1) + Math.abs(A.a2) > 0.5) { done.cooled = true; Book.sfx('tick', { gain: 0.5 }); commit(); }
          } else if (s.h > 0.9 && s.char < 1) { s.char = Math.min(1, s.char + dt * 0.35); busy = true; if (s.char >= 1 && !done.char) { done.char = true; Book.sfx('thud', { gain: 0.4 }); commit(); } }
          if (s.shake > 0) { s.shake = Math.max(0, s.shake - dt * 2.2); busy = true; }
          const wob = soft ? 0.03 * Math.sin(t * 5) : 0, shk = s.shake > 0 ? Math.sin(s.shake * 40) * 0.02 * s.shake : 0;
          const C = strip(x0 + 66, 110, 232, s.a1 + wob + shk, s.a2), P = thick(C, 7);
          paper(x, P);
          if (s.h > 0.05) { x.save(); x.fillStyle = `rgba(255,120,30,${0.55 * s.h})`; x.beginPath(); P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.fill(); x.restore(); }
          Ink.hatchFill(x, P, 1, B, 1.1 + s.char * 2);
          if (s.char > 0.3) Ink.hatchFill(x, P.map(([a, b]) => [a + 1.5, b]), 1, B, s.char * 2.4);
          pen(x, close(P), { w: 2.4, wob: false, a: 0.95 });
          if (s.char > 0.02) {
            x.save(); x.globalCompositeOperation = 'source-over'; x.strokeStyle = PAPER; x.lineWidth = 2; const q = H.rng(31);
            for (let i = 0; i < Math.ceil(s.char * 6); i++) { const p = C[6 + i * 7]; x.beginPath(); let cx = p[0], cy = p[1] - 7; x.moveTo(cx, cy); for (let j = 0; j < 3; j++) { cx += q.range(-5, 5); cy += 5; x.lineTo(cx, cy); } x.stroke(); }
            x.restore();
            for (let i = 0; i < 4; i++) { const sx = x0 + 110 + i * 52, pts = []; for (let j = 0; j <= 8; j++) pts.push([sx + Math.sin(j * 0.9 + t * 3 + i * 2) * (3 + j * 1.2), 98 - j * 9 * (0.4 + s.char * 0.6)]); pen(x, pts, { w: 2, a: s.char * 0.8, wob: false }); }
          }
          if (s.h > 0.3) { for (let i = 0; i < 4; i++) { const sx = x0 + 110 + i * 52, pts = []; for (let j = 0; j <= 4; j++) pts.push([sx + Math.sin(j * 1.4 + t * 6 + i) * 4, 196 - j * 6]); pen(x, pts, { w: 1.8, color: RD, a: 0.75 * s.h, wob: false }); } }
          // --- the chains in the zoom box
          x.save(); x.beginPath(); x.rect(x0 + 14, BOX[0] + 4, 372, BOX[1] - BOX[0] - 8); x.clip();
          if (s.h > 0.05) { x.fillStyle = `rgba(255,150,60,${0.16 * s.h})`; x.fillRect(x0 + 14, BOX[0], 372, 200); }
          CH[n].forEach((c, i) => { const pts = []; for (let lx = -60; lx <= 440; lx += 8) pts.push([x0 + 10 + lx, chainY(s, c, i, lx, t)]); pen(x, pts, { w: 3, wob: false, a: 0.85 }); });
          if (s === Bs) LINKS.forEach(([i, lx]) => { const ya = chainY(s, CH[n][i], i, lx, t), yb = chainY(s, CH[n][i + 1], i + 1, lx, t); pen(x, [[x0 + 10 + lx, ya], [x0 + 10 + lx, yb]], { w: 4, wob: false, color: RD, a: 0.9 }); dot(x, x0 + 10 + lx, ya, 4, 0.9, RD); dot(x, x0 + 10 + lx, yb, 4, 0.9, RD); });
          x.restore();
          if (concluded()) Ink.drawBubble(x, n ? 'cross-links' : 'no cross-links', x0 + 200, BOX[1] + 30, 24, RD, 1, -0.01, 'center');
          // --- slider knob
          const kx = x0 + 80 + 240 * s.h;
          x.save(); x.globalCompositeOperation = 'source-over'; x.fillStyle = PAPER; x.beginPath(); x.arc(kx, SY, 19, 0, 7); x.fill(); x.restore();
          Ink.stroke(x, geo.ellipse(kx, SY, 19, 19), { w: 3, color: RD, seed: 9 }); dot(x, kx, SY, 6, 0.9, RD);
          if (!s.moved && !done.soft && s === A) text(x, 'drag me!', kx + 30, SY - 24, { font: 'hand', size: 23, color: RD });
          if (s === A && soft && !hintTap) text(x, 'soft! tap the strip', x0 + 250, 52, { font: 'hand', size: 22, color: RD, align: 'center' });
          if (s === A && done.reshapes > 0) text(x, `re-shaped × ${done.reshapes}`, x0 + 396, 52, { font: 'hand', size: 22, color: RD, align: 'right' });
          if (s.h > 0.02) busy = true; // chains jiggle whenever there is heat
        });
        say();
        return busy;
      };

      let lastMsg = '', hold = 0;
      function say() {
        if (performance.now() < hold) return;
        const s = last === 'A' ? A : Bs; let m;
        if (!A.moved && !Bs.moved) m = 'Both strips are cold. The chains are hardly moving.';
        else if (s === A) m = A.h > 0.6 ? '<b>A</b> is hot: its chains wriggle and <b>slide past each other</b>, so the strip is soft. Tap the strip to bend it.' : A.h > 0.2 ? '<b>A</b> is warm: the chains are jiggling more…' : A.sh ? '<b>A</b> is cold: the chains have stopped sliding and the strip is <b>hard again</b>, in its new shape.' : '<b>A</b> is cold and stiff.';
        else m = Bs.char >= 1 ? '<b>B</b> has <b>charred</b>. Its chains never slid, and the strip never went soft.' : Bs.h > 0.9 ? '<b>B</b> is as hot as it gets: the chains shake but <b>stay locked together</b>. It is starting to smoke…' : Bs.h > 0.2 ? '<b>B</b> is heating up: the chains shake, but they are not sliding…' : '<b>B</b> is cold and stiff.';
        if (m !== lastMsg) { lastMsg = m; stat.innerHTML = m; }
      }
      function commit() {
        const re = done.reshapes >= 3, sc = (done.soft ? 1 : 0) + (re ? 1 : 0) + (done.cooled ? 1 : 0) + (done.char ? 1 : 0);
        r.set({ answer: `heated A until it softened: ${done.soft ? 'yes' : 'no'}; re-shaped A while hot: ${done.reshapes} time${done.reshapes === 1 ? '' : 's'}; cooled A in a new shape: ${done.cooled ? 'yes' : 'no'}; heated B until it charred (stayed rigid): ${done.char ? 'yes' : 'no'}`,
          correct: sc === 4 ? true : null, score: sc, max: 4, soft: done.soft, cooled: done.cooled, char: done.char, reshapes: done.reshapes });
        pred.querySelectorAll('.opt').forEach((b) => (b.disabled = true));
        status();
      }

      const setH = (s, px) => { const nh = clamp((px - s.x0 - 80) / 240); if (Math.floor(nh * 8) !== Math.floor(s.h * 8)) Book.sfx('tick', { gain: 0.3 }); s.h = nh; };
      S.c.addEventListener('pointerdown', (e) => {
        const [px, py] = S.pos(e), s = px < 430 ? A : Bs; last = s.k;
        if (py > SY - 44) { drag = s; s.moved = true; try { S.c.setPointerCapture(e.pointerId); } catch (er) {} setH(s, px); e.preventDefault(); S.go(); return; }
        if (py < 205) { // a tap on the strip: try to bend it
          if (s === A && A.h > 0.6) { A.sh = (A.sh % 3) + 1; done.reshapes++; hintTap = true; Book.sfx('pop', { gain: 0.4 }); commit(); }
          else { s.shake = 1; Book.sfx('tick', { gain: 0.6 }); hold = performance.now() + 2200; lastMsg = ''; stat.innerHTML = s === A ? 'You push on <b>A</b>: it is cold and <b>rigid</b>. Heat it first.' : `You push on <b>B</b>${Bs.h > 0.6 ? ', even though it is hot' : ''}: it is <b>rigid</b> and will not bend.`; }
          S.go();
        }
      });
      S.c.addEventListener('pointermove', (e) => { if (drag) { setH(drag, S.pos(e)[0]); S.go(); } });
      ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((ev) => S.c.addEventListener(ev, () => { drag = null; S.go(); }));

      // ------------------------------------------------------------------ conclude
      const rest = ui.el('div', '');
      const add = (e) => { rest.appendChild(e); return e; };
      const found = add(ui.box('', { tag: 'What you found' }));
      const conc = add(ui.mcq({ id: 'p03.conclude', label: 'Why did strip B stay rigid when heated? (cross-links)', q: 'Look at the red links in B\'s chain model. <b>Why did strip B stay rigid</b> when it was heated?',
        options: [
          { t: 'Links between its chains stop them sliding', ok: true },
          { t: 'With no links, its chains cannot slide apart', mis: 'crosslink', why: 'B is the one with the links: look at the red ties between its chains. It was A, with no links, whose chains could slide.' },
          { t: 'Its chains slide apart too easily to soften', mis: 'crosslink', why: 'B\'s chains did not slide at all: they shook but stayed locked. Sliding chains are what made A go soft.' },
          { t: 'Its chains are too short to wriggle about', mis: 'crosslink', why: 'The chains in A and B are the same length. Look for what B\'s model has that A\'s does not.' },
        ],
        explain: 'Those ties are called cross-links. They lock the chains together, so heat cannot make them slide: the polymer cannot soften.' }));
      conc.addEventListener('click', () => setTimeout(() => { S.go(); gate(); }, 80));

      // ------------------------------------------------------------------ plastic memory
      const memW = add(ui.el('div', ''));
      const madd = (e) => { memW.appendChild(e); return e; };
      madd(ui.el('h2', '', 'A strange trick'));
      madd(ui.p('This sheet of <b>HIPS</b> (a polymer like strip A) started flat. It was heated and <b>vacuum formed</b> into a tray, then cooled. Now it goes back under the heater, with nothing holding it…'));
      const MRIGHT = 'It tries to go back to a flat sheet';
      const mpred = madd(ui.predict({ id: 'p03.memory', label: 'Plastic memory prediction: a vacuum-formed HIPS tray is reheated', q: '<b>Predict:</b> what will the tray do as it warms up?',
        options: ['It stays in its tray shape for good', MRIGHT, 'It shrinks into a small hard lump', 'It chars and burns without softening'], onPick: () => memUnlock() }));
      const mlab = madd(ui.el('div', '')); mlab.style.cssText = 'position:relative;margin:0 0 6px;transition:opacity .3s';
      const MW = 860, MH = 300, S2 = Stage(mlab, MW, MH, 'manipulation');
      const mrec = ui.record('p03.memory', {});
      const mem = { m: 1, tgt: 1, heat: 0, heating: false, seen: !!(got('p03.memory') || {}).seen, wait: 0 };
      if (mem.seen) { mem.m = 0; mem.tgt = 0; }
      const mbtn = madd(ui.el('button', 'btn', '')); mbtn.type = 'button'; mbtn.style.cssText = 'margin:0 0 var(--R);min-height:52px';
      const mfound = madd(ui.box('', { tag: 'Plastic memory' }));
      let sprM;
      function buildM() {
        sprM = S2.layer(MW, MH, (x) => {
          // heater hood
          const hood = [[230, 22], [630, 22], [668, 62], [192, 62]]; paper(x, hood); Ink.hatchFill(x, hood, 1, B, 1.2); Ink.stroke(x, close(hood), { w: 2.6, seed: 4 });
          Ink.stroke(x, [[430, 4], [430, 22]], { w: 4, seed: 5 });
          text(x, 'HEATER', 430, 52, { size: 22, align: 'center' });
          // clamp frame holding the edges of the sheet
          [[150, 250], [610, 710]].forEach(([a, b], i) => { const c1 = geo.rect(a, 150, b - a, 14, 4), c2 = geo.rect(a, 176, b - a, 14, 4); [c1, c2].forEach((c, j) => { paper(x, c); Ink.hatchFill(x, c, 1, B, 1.4); Ink.stroke(x, c, { w: 2, seed: 8 + i * 2 + j, retrace: false }); }); Ink.stroke(x, [[(a + b) / 2, 190], [(a + b) / 2, 282]], { w: 3.4, seed: 14 + i }); });
          Ink.stroke(x, [[110, 284], [750, 284]], { w: 3, seed: 20 });
        });
      }
      buildM(); S2.onFonts = buildM;
      S2.render = (dt, t) => {
        const x = S2.ctx; let busy = false;
        const hT = mem.heating ? 1 : 0; if (Math.abs(hT - mem.heat) > 0.01) { mem.heat += (hT - mem.heat) * Math.min(1, dt * 3); busy = true; } else mem.heat = hT;
        if (mem.heating) { mem.wait += dt; busy = true; if (mem.wait > 1.1) { const d = mem.tgt - mem.m; mem.m += Math.sign(d) * Math.min(Math.abs(d), dt * 0.36); if (Math.abs(d) < 0.002) { mem.heating = false; if (!mem.seen && mem.tgt === 0) { mem.seen = true; const it = got('p03.memory') || {}; mrec.set({ answer: it.answer, correct: null, seen: true }); Book.sfx('success', { gain: 0.3 }); } memStatus(); gate(); } } }
        if (mem.heat > 0.03) { // glowing elements + heat rays
          for (let i = 0; i < 7; i++) { pen(x, [[252 + i * 52, 68], [288 + i * 52, 68]], { w: 4, color: RD, a: mem.heat, wob: false }); const pts = []; for (let j = 0; j <= 5; j++) pts.push([270 + i * 52 + Math.sin(j * 1.3 + t * 6 + i) * 4, 78 + j * 8]); pen(x, pts, { w: 1.8, color: RD, a: 0.7 * mem.heat, wob: false }); }
        }
        S2.blit(sprM, 0, 0);
        // the sheet: flat between the clamps, with a tray-shaped dip of depth 76*m (it wobbles a little while soft)
        const wob = mem.heating && mem.wait > 1.1 ? Math.sin(t * 9) * 2.5 * Math.min(1, mem.m * 3 + 0.2) : 0;
        const prof = (px) => { const u = sstep(250, 304, px) * (1 - sstep(556, 610, px)); return 170 + (76 * mem.m + wob * u) * u; };
        const top = [], bot = []; for (let px = 150; px <= 710; px += 6) { top.push([px, prof(px) - 5]); bot.push([px, prof(px) + 5]); }
        const P = top.concat(bot.reverse());
        paper(x, P); if (mem.heat > 0.05) { x.save(); x.fillStyle = `rgba(255,120,30,${0.5 * mem.heat})`; x.beginPath(); P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.fill(); x.restore(); }
        Ink.hatchFill(x, P, 1, B, 1.6); pen(x, close(P), { w: 2.4, wob: false, a: 0.95 });
        if (mem.seen && !mem.heating) text(x, mem.m < 0.05 ? 'flat again!' : 'formed again', 430, 130, { font: 'hand', size: 24, color: RD, align: 'center' });
        return busy;
      };
      mbtn.onclick = () => {
        if (mem.heating) return;
        if (mem.m > 0.5) { mem.tgt = 0; mem.heating = true; mem.wait = 0; Book.sfx('pop', { gain: 0.4 }); }
        else { mem.tgt = 1; mem.heating = true; mem.wait = 0.6; Book.scribble(0.5); }
        mpred.querySelectorAll('.opt').forEach((b) => (b.disabled = true));
        memStatus(); S2.go();
      };
      function memStatus() {
        mbtn.textContent = mem.heating ? '…' : mem.m > 0.5 ? '🔥 Switch the heater on' : '↻ Heat it and vacuum form it again';
        mbtn.disabled = mem.heating;
        mfound.style.display = mem.seen ? '' : 'none';
        if (mem.seen) {
          const p = (got('p03.memory') || {}).answer, ok = p === MRIGHT;
          mfound.innerHTML = '<span class="tag">Plastic memory</span>The tray went soft and pulled itself back to a <b>flat sheet</b>, the shape it had before it was formed. This is called <span class="key">plastic memory</span>. Heat it and form it again and it takes a new shape, as often as you like.'
            + (p ? `<br>You predicted “${Book.esc(p.toLowerCase())}”: <b class="${ok ? 'green' : 'red'}">${ok ? '✓ spot on' : '✗ not this time'}</b>.` : '');
          requestAnimationFrame(() => Ink.frame(mfound));
        }
      }
      function memUnlock() {
        const on = !!got('p03.memory');
        mlab.style.opacity = on ? 1 : 0.4; mbtn.style.display = on ? '' : 'none';
        if (mem.seen) mpred.querySelectorAll('.opt').forEach((b) => (b.disabled = true));
      }

      // ------------------------------------------------------------------ notes, sort, blanks
      const rest2 = ui.el('div', '');
      const add2 = (e) => { rest2.appendChild(e); return e; };
      add2(ui.el('h2', '', 'The two families'));
      const nA = add2(ui.box('<span class="key">Thermoforming polymers</span> (thermoplastics, like A)<br>'
        + '• <b>Soften when heated</b> and can be shaped; <b>harden when cooled</b>. This can be repeated again and again.<br>'
        + '• Their long chains are tangled but <b>not joined to each other</b> (no cross-links), so heat lets the chains slide.<br>'
        + '• Can be <b>recycled</b> by melting. They have <b>plastic memory</b>.', { tag: 'Notes' }));
      const nB = add2(ui.box('<span class="key">Thermosetting polymers</span> (thermosets, like B)<br>'
        + '• Shaped <b>once</b>: heat (or a chemical hardener) makes the chains form strong <b>cross-links</b>, setting them permanently.<br>'
        + '• <b>Cannot be softened or reshaped</b> by heating: they char or burn instead.<br>'
        + '• Usually hard, rigid, brittle, heat-resistant and good electrical insulators. <b>Cannot be recycled</b> by melting.', { tag: 'Notes' }));
      add2(ui.p('<span class="small">Everything above will blur while you sort and fill in. No peeking!</span>')).style.marginTop = '-10px';
      const sortEl = add2(ui.sort({ id: 'p03.sort', label: 'Sort 10 statements: thermoforming or thermosetting', q: 'Which family? Tap a card, then tap its box.',
        buckets: ['Thermoforming', 'Thermosetting'],
        items: [
          { t: 'Softens when it is heated', b: 0, mis: 'thermo-swap' },
          { t: 'Can be reshaped again and again', b: 0, mis: 'thermo-swap' },
          { t: 'Chains are not joined to each other', b: 0, mis: 'crosslink' },
          { t: 'Can be recycled by melting', b: 0, mis: 'thermoset-recycle' },
          { t: 'Has "plastic memory"', b: 0, mis: 'thermo-swap' },
          { t: 'Shaped once, then set for good', b: 1, mis: 'thermo-swap' },
          { t: 'Strong cross-links between the chains', b: 1, mis: 'crosslink' },
          { t: 'Chars or burns instead of softening', b: 1, mis: 'thermo-swap' },
          { t: 'Cannot be recycled by melting', b: 1, mis: 'thermoset-recycle' },
          { t: 'Usually rigid, brittle and heat-resistant', b: 1, mis: 'thermo-swap' },
        ],
        explain: 'Thermoforming: no cross-links, so it softens, reshapes and recycles. Thermosetting: cross-linked, set once, heat-resistant.' }));
      const blur = [lab, stat, found, conc, memW, nA, nB];
      ui.hideWhile(sortEl, 'p03.sort', blur);
      const fillEl = add2(ui.fill({ id: 'p03.blanks', label: 'Fill the blanks: soften / harden / cross-links / char', q: 'Fill in the missing words.',
        html: 'A thermoforming polymer will {{soften|melt|softens}} when it is heated and {{harden|set|solidify|stiffen|hardens}} again when it cools. In a thermosetting polymer the chains are locked together by strong {{cross-links|crosslinks|cross links|cross-link|crosslink|cross link|links}}, so heat cannot soften it: it will {{char|burn|scorch|chars|burns}} instead.',
        explain: 'Soften, harden, cross-links, char (or burn).' }));
      ui.hideWhile(fillEl, 'p03.blanks', blur.concat([sortEl]));

      function status() {
        const re = done.reshapes >= 3, all = done.soft && re && done.cooled && done.char;
        list.innerHTML = `<b>${done.soft ? '☑' : '☐'}</b> heat A &nbsp; <b>${re ? '☑' : '☐'}</b> re-shape A 3 times (${Math.min(3, done.reshapes)}/3) &nbsp; <b>${done.cooled ? '☑' : '☐'}</b> cool A in a new shape &nbsp; <b>${done.char ? '☑' : '☐'}</b> heat B fully and wait` + (all ? '' : '<br>Do all four to carry on.');
        rest.style.display = all ? '' : 'none';
        if (all) {
          const p = (got('p03.predict') || {}).answer, ok = p === RIGHT;
          found.innerHTML = '<span class="tag">What you found</span><b>A:</b> heat made its chains <b>slide past each other</b>, so the strip went soft. You re-shaped it, cooled it to set it, and could do that over and over.<br><b>B:</b> its chains shook but <b>stayed locked together</b>. The strip stayed rigid and finally charred.'
            + (p ? `<br>You predicted “${Book.esc(p.toLowerCase())}”: <b class="${ok ? 'green' : 'red'}">${ok ? '✓ spot on' : '✗ not this time'}</b>.` : '');
          requestAnimationFrame(() => Ink.frame(found));
        }
        gate();
      }
      function gate() {
        const it = got('p03.conclude'), cd = !!(it && (it.correct === true || it.attempts >= 2));
        rest2.style.display = rest.style.display !== 'none' && cd && mem.seen ? '' : 'none';
      }
      function unlock() {
        const on = !!got('p03.predict');
        S.c.style.pointerEvents = on ? '' : 'none'; lockMsg.style.display = on ? 'none' : ''; how.style.opacity = on ? 1 : 0.5;
        if (r.get()) pred.querySelectorAll('.opt').forEach((b) => (b.disabled = true));
      }
      unlock(); memUnlock(); memStatus(); status(); S.go(); S2.go();
    },
  });
})();
