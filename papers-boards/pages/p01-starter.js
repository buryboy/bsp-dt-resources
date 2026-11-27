// Page 1 — Starter: the marker test. Predict, then draw with the same marker on four unlabelled sheets and flip
// each one over: one goes patchy (thick, rough), one feathers and soaks through, one stays crisp, one is see-through.
(function () {
  'use strict';
  const B = Ink.BLUE, RD = Ink.RED, rgba = Ink.rgba, geo = Ink.geo;
  const HANDF = (s) => `400 ${s}px "Gloria Hallelujah", "Comic Sans MS", cursive`;
  const LABF = (s) => `600 ${s}px Fredoka, "Arial Rounded MT Bold", system-ui, sans-serif`;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const hsh = (a, b = 0) => { const s = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453; return s - Math.floor(s); };

  function text(x, s, px, py, o = {}) {
    x.save(); const f = o.font === 'hand' ? HANDF : LABF; x.font = f(o.size || 22);
    x.fillStyle = rgba(o.color || B, o.a ?? 0.92); x.textAlign = o.align || 'left'; x.textBaseline = 'alphabetic';
    x.translate(px, py); if (o.rot) x.rotate(o.rot); x.fillText(s, 0, 0); x.restore();
  }
  function pen(x, pts, o = {}) {
    const P = o.wob === false ? pts : geo.wob(geo.seg(pts, 3), o.seed ?? 11, o.amp ?? 0.6);
    x.save(); x.strokeStyle = rgba(o.color || B, o.a ?? 0.8); x.lineWidth = o.w ?? 1.4; x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath();
    P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); if (o.close) x.closePath(); x.stroke(); x.restore();
  }
  const close = (P) => P.concat([P[0]]);

  // an interactive canvas with an on-demand render loop (stops when the page is hidden)
  function Stage(parent, W, Hh, touch) {
    const c = document.createElement('canvas'); parent.appendChild(c);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = Math.round(W * dpr); c.height = Math.round(Hh * dpr);
    Object.assign(c.style, { width: '100%', height: 'auto', aspectRatio: W + ' / ' + Hh, display: 'block', touchAction: touch || 'manipulation', userSelect: 'none', webkitUserSelect: 'none' });
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
    if (document.fonts) document.fonts.ready.then(() => { S.onFonts && S.onFonts(); S.go(); });
    return S;
  }

  // ---------- the desk ----------
  const W = 860, HH = 446, SW = 170, SH = 290, SY = 76, SX = [30, 240, 450, 660], MG = 8, CAP = 240;
  // A thick and rough · B ordinary thin paper · C coated · D thin and see-through   (never named on this page)
  const SHEETS = [
    { k: 'A', kind: 'rough', front: 'rough and patchy', back: 'back: clean', said: 'the line came out <b>rough and patchy</b>, and the back stayed clean' },
    { k: 'B', kind: 'soak', front: 'ink spreads out!', back: 'soaked through!', said: 'the ink <b>spread out</b> into a fuzzy line and <b>soaked through</b> to the back' },
    { k: 'C', kind: 'crisp', front: 'crisp and sharp', back: 'back: clean', said: 'the line stayed <b>crisp and sharp</b>, and the back stayed clean' },
    { k: 'D', kind: 'thin', front: 'sharp line', back: 'faint shadow', said: 'the line was sharp, and the sheet is so thin you can <b>see the drawing underneath</b> through it' },
  ];
  // the bold printed design lying on the desk under all four sheets
  function design(x, a) {
    const wave = []; for (let px = 6; px <= W - 6; px += 6) wave.push([px, 268 + 24 * Math.sin(px / 19)]);
    x.save(); x.strokeStyle = rgba(B, a); x.lineCap = 'round'; x.lineJoin = 'round';
    x.lineWidth = 6; x.beginPath(); wave.forEach(([p, q], i) => (i ? x.lineTo(p, q) : x.moveTo(p, q))); x.stroke();
    x.lineWidth = 5; [222, 316].forEach((y) => { x.beginPath(); x.moveTo(6, y); x.lineTo(W - 6, y + 2); x.stroke(); });
    x.lineWidth = 4; for (let px = 26; px < W; px += 52) { x.beginPath(); x.arc(px, 340, 11, 0, 7); x.stroke(); }
    x.restore();
  }

  function sheetSprite(S, i) {
    const sh = SHEETS[i];
    return S.layer(SW + MG * 2, SH + MG * 2, (x) => {
      x.translate(MG, MG);
      const R = [[0, 0], [SW, 0], [SW, SH], [0, SH]];
      x.fillStyle = sh.kind === 'rough' ? '#f7f1df' : sh.kind === 'thin' ? 'rgba(255,255,255,0.5)' : '#ffffff';
      x.fillRect(0, 0, SW, SH);
      x.globalCompositeOperation = 'multiply';
      if (sh.kind === 'thin') {                      // the design under the sheet shows through
        x.save(); x.beginPath(); x.rect(0, 0, SW, SH); x.clip(); x.translate(-SX[i], -SY); design(x, 0.34); x.restore();
        pen(x, close(R), { w: 1.3, a: 0.6, seed: 40 + i, amp: 0.5 });
        pen(x, [[SW - 22, SH], [SW - 4, SH - 6], [SW, SH - 22]], { w: 1.1, a: 0.5 });   // a curling corner
      } else if (sh.kind === 'rough') {              // thick sheet with a toothy surface
        for (let n = 0; n < 520; n++) { const px = hsh(n, 1) * SW, py = hsh(n, 2) * SH; x.fillStyle = rgba(B, 0.1 + 0.16 * hsh(n, 3)); x.fillRect(px, py, 1.6, 1.6); }
        Ink.stroke(x, close(R), { w: 2.4, seed: 40 + i });
        pen(x, [[3, SH + 4], [SW + 4, SH + 4], [SW + 4, 3]], { w: 1.6, a: 0.8, seed: 7 });
        pen(x, [[SW, SH], [SW + 4, SH + 4]], { w: 1.4, wob: false });
      } else Ink.stroke(x, close(R), { w: 1.9, seed: 40 + i, retrace: false });
    });
  }

  // ---------- the marker line on each kind of paper (sheet coordinates) ----------
  const trace = (x, s, mir) => { x.beginPath(); s.forEach(([a, b], i) => { const px = mir ? SW - a : a; i ? x.lineTo(px, b) : x.moveTo(px, b); }); };
  const age = (p, now) => (p[2] == null ? 1 : clamp((now - p[2]) / 1.8));
  function inkFront(x, sh, now) {
    x.lineCap = 'round'; x.lineJoin = 'round';
    sh.strokes.forEach((s, si) => {
      if (s.length < 2) return;
      if (sh.kind === 'rough') {                     // dry, broken streaks: the ink only catches the high spots
        x.strokeStyle = rgba(RD, 0.8); x.lineWidth = 2.1;
        [-4, -2, 0, 2, 4].forEach((o, oi) => {
          x.beginPath();
          for (let i = 0; i < s.length - 1; i++) {
            if (hsh(i * 7 + si * 31, oi) < 0.36) continue;
            const dx = s[i + 1][0] - s[i][0], dy = s[i + 1][1] - s[i][1], d = Math.hypot(dx, dy) || 1, nx = (-dy / d) * o, ny = (dx / d) * o;
            x.moveTo(s[i][0] + nx, s[i][1] + ny); x.lineTo(s[i + 1][0] + nx, s[i + 1][1] + ny);
          }
          x.stroke();
        });
        return;
      }
      x.strokeStyle = rgba(RD, sh.kind === 'thin' ? 0.8 : 0.88); x.lineWidth = 9; trace(x, s); x.stroke();
      if (sh.kind !== 'soak') return;
      // feathering: the ink creeps outwards along the fibres
      s.forEach((p, i) => {
        const sp = age(p, now); if (sp <= 0) return;
        const q = s[Math.min(s.length - 1, i + 1)], r0 = s[Math.max(0, i - 1)], dx = q[0] - r0[0], dy = q[1] - r0[1], d = Math.hypot(dx, dy) || 1, nx = -dy / d, ny = dx / d;
        for (let j = 0; j < 3; j++) {
          const side = hsh(i, j + si) < 0.5 ? -1 : 1, off = side * sp * (3 + 9 * hsh(i * 3, j)), rad = sp * (4 + 5 * hsh(i, j * 5 + 2));
          x.fillStyle = rgba(RD, 0.13); x.beginPath(); x.arc(p[0] + nx * off, p[1] + ny * off, rad, 0, 7); x.fill();
        }
        const L = sp * (7 + 15 * hsh(i * 5, si + 9)), sd = hsh(i, 77) < 0.5 ? -1 : 1, sk = (hsh(i, 5) - 0.5) * 8;
        x.strokeStyle = rgba(RD, 0.42); x.lineWidth = 1.1; x.beginPath(); x.moveTo(p[0], p[1]); x.lineTo(p[0] + nx * L * sd + sk, p[1] + ny * L * sd + sk * 0.5); x.stroke();
      });
    });
  }
  function inkBack(x, sh, now) {
    x.lineCap = 'round'; x.lineJoin = 'round';
    sh.strokes.forEach((s, si) => {
      if (s.length < 2) return;
      if (sh.kind === 'thin') { x.strokeStyle = rgba(RD, 0.2); x.lineWidth = 8; trace(x, s, true); x.stroke(); }
      if (sh.kind === 'soak') {
        x.strokeStyle = rgba(RD, 0.3); x.lineWidth = 6; trace(x, s, true); x.stroke();
        s.forEach((p, i) => { const sp = age(p, now); x.fillStyle = rgba(RD, 0.3 * sp); x.beginPath(); x.arc(SW - p[0] + (hsh(i, si) - 0.5) * 8, p[1] + (hsh(i, 3) - 0.5) * 8, 3 + 6 * hsh(i, 5 + si), 0, 7); x.fill(); });
      }
    });
  }
  function markerPen(x, px, py) {
    x.save(); x.translate(px, py); x.rotate(-0.9);
    const body = [[10, -9], [86, -9], [86, 9], [10, 9]], cap = [[86, -10], [112, -10], [112, 10], [86, 10]];
    x.globalCompositeOperation = 'source-over'; x.fillStyle = '#fff'; x.fillRect(10, -9, 76, 18); x.globalCompositeOperation = 'multiply';
    Ink.hatchFill(x, cap, 1, RD, 2.2); pen(x, close(cap), { w: 2, color: RD, wob: false });
    pen(x, close(body), { w: 2, wob: false }); pen(x, [[10, -9], [0, -4], [0, 4], [10, 9]], { w: 2, color: RD, wob: false });
    x.restore();
  }

  Book.page({
    id: 'p01',
    title: 'Starter: the marker test',
    build(ui, root) {
      ui.h('The marker test');
      ui.p('Four sheets of paper lie on a desk, on top of a bold printed design. They all look much the same. You have <b>one marker pen</b>.');

      const got = (id) => Book.state.items[id];
      const pred = ui.predict({ id: 'p01.predict', label: 'Starter prediction: will a marker line look the same on four papers?',
        q: '<b>Predict:</b> you draw a line with the <b>same marker</b> on each sheet. Will the four lines look the same?',
        options: ['Yes: all four will look the same', 'No: they will look different', 'Not sure'], onPick: () => unlock() });

      ui.el('h2', '', 'Now test it');
      const how = ui.p('<b>Draw a line on each sheet with your finger.</b> Then <b>flip</b> each sheet over to look at the back. <span class="small">(Scroll with the margin or the gaps between the sheets.)</span>');
      const lab = ui.el('div', ''); lab.style.cssText = 'position:relative;margin:0 0 8px;transition:opacity .3s';
      const S = Stage(lab, W, HH, 'manipulation');
      const r = ui.record('p01.try', { label: 'Marker test: sheets drawn on and backs checked (A–D)', type: 'experiment', max: 1 });
      const prev = r.get() || {};
      const sheets = SHEETS.map((d, i) => Object.assign({}, d, { i, strokes: ((prev.strokes || [])[i] || []).map((s) => s.map((p) => [p[0], p[1]])), f: 0, to: 0, seen: !!(prev.seen || [])[i], lastT: -9 }));
      const len = (sh) => sh.strokes.reduce((a, s) => a + s.reduce((b, p, i) => (i ? b + Math.hypot(p[0] - s[i - 1][0], p[1] - s[i - 1][1]) : 0), 0), 0);
      const count = (sh) => sh.strokes.reduce((a, s) => a + s.length, 0);
      const drawn = (sh) => len(sh) >= 50;
      let drawing = null, tip = null, hint = null, hintT = 0;

      let under, sprites;
      function buildArt() {
        sprites = sheets.map((sh, i) => sheetSprite(S, i));
        under = S.layer(W, HH, (x) => {
          design(x, 0.85);
          SX.forEach((sx) => Ink.hatchShadow(x, [[sx, SY], [sx + SW, SY], [sx + SW, SY + SH], [sx, SY + SH]], 1, 9, 9));
          sheets.forEach((sh, i) => Ink.drawBubble(x, sh.k, SX[i] + SW / 2, 56, 44, B, 1, i % 2 ? 0.04 : -0.04, 'center'));
        });
      }
      buildArt(); S.onFonts = buildArt;

      S.render = (dt, t) => {
        const x = S.ctx; let busy = !!drawing;
        S.blit(under, 0, 0);
        sheets.forEach((sh, i) => {
          if (sh.f !== sh.to) { sh.f += Math.sign(sh.to - sh.f) * Math.min(Math.abs(sh.to - sh.f), dt / 0.45); busy = true; }
          const sc = Math.max(0.02, Math.abs(Math.cos(Math.PI * sh.f))), back = sh.f > 0.5;
          x.save(); x.translate(SX[i] + SW / 2, SY); x.scale(sc, 1); x.translate(-SW / 2, 0);
          x.globalCompositeOperation = 'source-over'; x.drawImage(sprites[i], -MG, -MG, SW + MG * 2, SH + MG * 2);
          x.globalCompositeOperation = 'multiply'; x.beginPath(); x.rect(0, 0, SW, SH); x.clip();
          if (back) { inkBack(x, sh, t); text(x, 'back', SW / 2, 30, { size: 22, align: 'center', a: 0.45 }); } else inkFront(x, sh, t);
          x.restore();
          if (sh.kind === 'soak' && t - sh.lastT < 2.1) busy = true;
          if (drawn(sh)) text(x, back ? sh.back : sh.front, SX[i] + SW / 2, SY + SH + 38, { font: 'hand', size: 22, align: 'center', color: back ? RD : B });
          else if (unlocked()) text(x, 'draw on me', SX[i] + SW / 2, SY + SH + 38, { font: 'hand', size: 22, align: 'center', a: 0.5 });
        });
        if (hint && t - hintT < 1.8) { text(x, hint.s, SX[hint.i] + SW / 2, SY + SH / 2, { font: 'hand', size: 22, align: 'center', color: RD }); busy = true; }
        if (drawing && tip) markerPen(x, SX[drawing.i] + tip[0], SY + tip[1]);
        return busy;
      };

      // finger drawing: one touch pad over each sheet (the gaps and the margin still scroll the page)
      const save = () => {
        const nD = sheets.filter(drawn).length, nS = sheets.filter((s) => s.seen).length, done = nD === 4 && nS === 4;
        r.set({ answer: `drew on ${sheets.filter(drawn).map((s) => s.k).join(', ') || 'none'}; checked the back of ${sheets.filter((s) => s.seen).map((s) => s.k).join(', ') || 'none'}`,
          correct: done ? true : null, score: done ? 1 : 0, max: 1, strokes: sheets.map((s) => s.strokes.map((q) => q.map((p) => [Math.round(p[0]), Math.round(p[1])]))), seen: sheets.map((s) => s.seen) });
        pred.querySelectorAll('.opt').forEach((b) => (b.disabled = true));
        status();
      };
      sheets.forEach((sh, i) => {
        const pad = ui.el('div', '', '', lab);
        pad.style.cssText = `position:absolute;left:${(SX[i] / W) * 100}%;top:${(SY / HH) * 100}%;width:${(SW / W) * 100}%;height:${(SH / HH) * 100}%;touch-action:none;cursor:crosshair;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none`;
        const at = (e) => { const [px, py] = S.pos(e); return [clamp(px - SX[i], 0, SW), clamp(py - SY, 0, SH)]; };
        let cur = null;
        pad.addEventListener('pointerdown', (e) => {
          if (!unlocked() || drawing) return;
          e.preventDefault();
          const now = performance.now() / 1000;
          if (sh.to === 1) { hint = { i, s: 'flip me back first' }; hintT = now; S.go(); return; }
          if (count(sh) >= CAP) { hint = { i, s: 'enough ink here!' }; hintT = now; S.go(); return; }
          try { pad.setPointerCapture(e.pointerId); } catch (er) {}
          const p = at(e); cur = [[p[0], p[1], now]]; sh.strokes.push(cur); drawing = sh; tip = p; Book.scribble(0.3); S.go();
        });
        pad.addEventListener('pointermove', (e) => {
          if (drawing !== sh || !cur) return;
          const p = at(e), q = cur[cur.length - 1], now = performance.now() / 1000; tip = p;
          if (Math.hypot(p[0] - q[0], p[1] - q[1]) >= 4 && count(sh) < CAP) { cur.push([p[0], p[1], now]); sh.lastT = now; if (cur.length % 12 === 0) Book.scribble(0.25); }
          S.go();
        });
        const end = () => {
          if (drawing !== sh) return;
          drawing = null; tip = null;
          if (cur && cur.length < 2) sh.strokes.splice(sh.strokes.indexOf(cur), 1);
          cur = null; sh.lastT = performance.now() / 1000; save(); S.go();
        };
        ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((ev) => pad.addEventListener(ev, end));
      });

      const flips = ui.el('div', ''); flips.style.cssText = `display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:0 0 10px`;
      const fbtn = sheets.map((sh) => {
        const b = ui.el('button', 'btn ghost', '↻ flip ' + sh.k, flips); b.type = 'button'; b.style.cssText = 'margin-top:0;min-height:52px;padding:8px 6px';
        b.onclick = () => { sh.to = sh.to ? 0 : 1; if (sh.to) sh.seen = true; Book.sfx('paper', { gain: 0.5, dur: 0.3 }); save(); S.go(); };
        return b;
      });
      const stat = ui.p('', 'small');
      const lockMsg = ui.el('p', 'small red', 'Make your prediction first: then the marker is yours.'); lockMsg.style.marginTop = '-6px';

      // ------------------------------------------------------------------ after the test
      const rest = ui.el('div', '');
      const add = (e) => { rest.appendChild(e.closest('.ink-anim-wrap') || e); return e; };
      add(ui.el('h2', '', 'What did you find?'));
      const found = add(ui.box('', { tag: 'Result' }));
      const check = add(ui.mcq({ id: 'p01.check', label: 'Which test sheet is best for neat marker colouring?', shuffle: false,
        q: 'A designer wants to colour a drawing <b>neatly with marker pens</b>, with sharp edges and no mess on the page below. Which sheet from your test should they use?',
        options: [
          { t: 'Sheet A', mis: 'bleed-meaning', why: 'On A the rough surface broke the line up. Look for the sheet where the line stayed sharp and the back stayed clean.' },
          { t: 'Sheet B', mis: 'bleed-meaning', why: 'On B the ink spread out sideways and soaked through to the back. That is the mess the designer wants to avoid!' },
          { t: 'Sheet C', ok: true, why: 'Yes: on C the ink stayed on the surface, so the line was crisp and the back was clean.' },
          { t: 'Sheet D', mis: 'bleed-meaning', why: 'D kept a sharp line, but look at its back again. Its special trick is being see-through. One sheet gave a sharp line and a perfectly clean back.' },
        ],
        explain: 'Sheet C was made that way on purpose.' }));
      const notes = add(ui.box('Paper is not just paper. Each kind is <span class="key">engineered for a job</span>.<br>Some papers are <b>coated</b> so marker ink stays on the surface. Some are <b>thin enough to see a drawing through</b>. Some are <b>thick, with a slightly textured surface</b> that grips pencil and paint.<br><span class="small">You will meet all of them by name later in this book, along with the boards used for packaging.</span>', { tag: 'Notes' }));
      add(ui.rate({ id: 'p01.conf', label: 'Confidence: different papers behave differently', q: 'How confident are you that you could explain why the four lines looked different?' }));
      const answered = () => { const it = got('p01.check'); return !!(it && it.correct === true); };
      if (!answered()) { notes.classList.add('peek-lock'); check.addEventListener('click', () => setTimeout(() => { if (answered()) notes.classList.remove('peek-lock'); }, 50)); }

      function unlocked() { return !!got('p01.predict'); }
      function status() {
        const nD = sheets.filter(drawn).length, nS = sheets.filter((s) => s.seen).length, done = nD === 4 && nS === 4;
        sheets.forEach((sh, i) => { fbtn[i].disabled = !unlocked() || !drawn(sh); fbtn[i].textContent = (sh.to ? '↺ front of ' : '↻ flip ') + sh.k; });
        stat.innerHTML = done ? 'All four sheets tested, front and back. Keep drawing if you like!' : `Sheets drawn on: <b>${nD} / 4</b> · Backs checked: <b>${nS} / 4</b><br>Draw on all four <b>and</b> flip all four to carry on.`;
        rest.style.display = done ? '' : 'none';
        if (!done) return;
        const p = (got('p01.predict') || {}).answer, ok = p === 'No: they will look different';
        found.innerHTML = '<span class="tag">Result</span>Same marker, four papers, <b>four different results</b>:<br>' + sheets.map((s) => `<b>${s.k}</b>: ${s.said}.`).join('<br>')
          + (p ? `<br>You predicted “${Book.esc(p.toLowerCase())}”: <b class="${ok ? 'green' : 'red'}">${ok ? '✓ spot on' : p === 'Not sure' ? 'now you know!' : '✗ not this time'}</b>.` : '');
        requestAnimationFrame(() => Ink.frame(found));
      }
      function unlock() {
        const on = unlocked();
        lab.style.opacity = on ? 1 : 0.35; lab.style.pointerEvents = on ? '' : 'none'; flips.style.opacity = on ? 1 : 0.35;
        lockMsg.style.display = on ? 'none' : ''; how.style.opacity = on ? 1 : 0.5; stat.style.display = on ? '' : 'none';
        if (sheets.some(drawn)) pred.querySelectorAll('.opt').forEach((b) => (b.disabled = true));
        status(); S.go();
      }
      unlock();
    },
  });
})();
