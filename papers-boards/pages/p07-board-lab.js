// Page 7 — The packaging test lab: three rigs (drop test, keep-it-hot, bridge test). Each one is predict → test →
// conclude: the rig only shows WHAT happened; the "why" is a question inside the rig, recorded with the rig.
(function () {
  'use strict';
  const B = Ink.BLUE, R = Ink.RED, G = Ink.GREEN, rgba = Ink.rgba, geo = Ink.geo;
  const PAPER = '#fbfaf5', YOLK = [240, 170, 20];
  const HAND = (s) => `400 ${s}px "Gloria Hallelujah", "Comic Sans MS", cursive`;
  const LAB = (s, w = 600) => `${w} ${s}px Fredoka, "Arial Rounded MT Bold", system-ui`;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const item = (id) => Book.state.items[id];

  function css() {
    if (document.getElementById('p07-css')) return;
    const s = document.createElement('style'); s.id = 'p07-css';
    s.textContent = `
      .p07-st { margin: 0 0 calc(var(--R) * 1.4); padding: 14px 18px 16px; }
      .p07-st h2 { margin: 0 0 4px; }
      .p07-st > p { margin: 0 0 10px; }
      .p07-st .act { margin: 0 0 12px; }
      .p07-body { transition: opacity .3s, filter .3s; }
      .p07-body.p07-wait { opacity: .35; filter: blur(2.5px); pointer-events: none; }
      .p07-pick { display: flex; flex-wrap: wrap; gap: 8px; margin: 0 0 10px; }
      .p07-pick .opt { flex: 1 1 150px; text-align: center; min-height: 48px; padding: 6px 8px; font-size: 18px; }
      .p07-pick .opt.done::after { content: ' \\2713'; color: var(--green); font-family: Fredoka; }
      .p07-cv { display: block; width: 100%; height: auto; touch-action: manipulation; user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; cursor: pointer; }
      .p07-row { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; margin: 8px 0 0; }
      .p07-row .btn { margin-top: 0; }
      .p07-out { flex: 1 1 240px; font-size: 18px; line-height: 1.45; min-height: var(--R); }
      .p07-out b { font-family: Fredoka; font-weight: 600; }
      .p07-tbl { border-collapse: collapse; margin: 12px 0 0; font: 500 16px Fredoka, system-ui; width: 100%; background: rgba(255,255,255,.6); }
      .p07-tbl th, .p07-tbl td { border: 1.5px solid rgba(30,46,150,.45); padding: 5px 8px; text-align: center; line-height: 1.3; }
      .p07-tbl th { font-weight: 600; }
      .p07-tbl td:first-child, .p07-tbl th:first-child { text-align: left; }
      .p07-tbl .y { color: var(--green); font-weight: 700; } .p07-tbl .n { color: var(--red); font-weight: 700; }
      .p07-concl { margin: 14px 0 0; padding-top: 10px; border-top: 2px dashed rgba(30,46,150,.35); }
      .p07-q { margin: 0 0 10px; } .p07-q b { font-family: Fredoka; font-weight: 600; }
      .p07-lab { font: 600 17px Fredoka, system-ui; white-space: nowrap; }
      .p07-range { -webkit-appearance: none; appearance: none; flex: 1 1 280px; height: 50px; background: transparent; margin: 0; cursor: pointer; }
      .p07-range::-webkit-slider-runnable-track { height: 12px; border-radius: 7px; background: rgba(30,46,150,.18); border: 1.5px solid var(--ink); }
      .p07-range::-webkit-slider-thumb { -webkit-appearance: none; width: 46px; height: 46px; border-radius: 50%; background: #fff; border: 3px solid var(--red); margin-top: -19px; box-shadow: 0 3px 0 rgba(120,20,26,.3); }
      .p07-range::-moz-range-track { height: 12px; border-radius: 7px; background: rgba(30,46,150,.18); border: 1.5px solid var(--ink); }
      .p07-range::-moz-range-thumb { width: 42px; height: 42px; border-radius: 50%; background: #fff; border: 3px solid var(--red); }
    `;
    document.head.appendChild(s);
  }

  // ---------- canvas helpers ----------
  function stage(parent, w, h) {
    const c = document.createElement('canvas'); c.className = 'p07-cv'; parent.appendChild(c);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = w * dpr; c.height = h * dpr; c.style.aspectRatio = w + ' / ' + h;
    const ctx = c.getContext('2d');
    const S = { c, ctx, w, h, dpr, visible: true, dirty: true };
    S.pos = (e) => { const r = c.getBoundingClientRect(); return [(e.clientX - r.left) * w / r.width, (e.clientY - r.top) * h / r.height]; };
    S.layer = () => { const L = document.createElement('canvas'); L.width = w * dpr; L.height = h * dpr; const x = L.getContext('2d'); L.x = x; L.reset = () => { x.setTransform(1, 0, 0, 1, 0, 0); x.globalCompositeOperation = 'source-over'; x.clearRect(0, 0, L.width, L.height); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.globalCompositeOperation = 'multiply'; x.lineCap = x.lineJoin = 'round'; }; L.reset(); return L; };
    S.begin = () => { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'source-over'; ctx.clearRect(0, 0, c.width, c.height); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.globalCompositeOperation = 'multiply'; ctx.lineCap = ctx.lineJoin = 'round'; };
    S.blit = (L) => { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(L, 0, 0); ctx.restore(); };
    if (window.IntersectionObserver) new IntersectionObserver((es) => { S.visible = es[es.length - 1].isIntersecting; if (S.visible) S.dirty = true; }).observe(c);
    return S;
  }
  // one rAF loop per rig; does no work while the page is hidden or the canvas is off screen
  function run(root, S, step) {
    let last = performance.now();
    const f = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const pg = root.closest('.page');
      if (!(pg && pg.classList.contains('hidden')) && S.visible) step(dt, now / 1000);
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
  // regular hatching anchored to the page (no shimmer when a shape moves)
  function hatch(ctx, pts, col = B, a = 0.4, sp = 6, dir = 1, lw = 1) {
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; pts.forEach(([x, y]) => { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); });
    ctx.save(); poly(ctx, pts); ctx.clip(); ctx.strokeStyle = rgba(col, a); ctx.lineWidth = lw; ctx.beginPath();
    if (dir > 0) { for (let c = Math.floor((x0 + y0) / sp) * sp; c < x1 + y1 + sp; c += sp) { ctx.moveTo(c - y0 + 2, y0 - 2); ctx.lineTo(c - y1 - 2, y1 + 2); } }
    else { for (let c = Math.floor((x0 - y1) / sp) * sp; c < x1 - y0 + sp; c += sp) { ctx.moveTo(c + y0 - 2, y0 - 2); ctx.lineTo(c + y1 + 2, y1 + 2); } }
    ctx.stroke(); ctx.restore();
  }
  const paperFill = (ctx, pts, col) => { ctx.save(); ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = col || PAPER; poly(ctx, pts); ctx.fill(); ctx.restore(); };
  const line = (ctx, pts, o = {}) => Ink.stroke(ctx, pts, Object.assign({ w: 2.4 }, o));
  const close = (P) => P.concat([P[0]]);
  const box = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
  const plain = (ctx, pts, col, a, lw) => { ctx.save(); ctx.strokeStyle = rgba(col, a); ctx.lineWidth = lw; ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); ctx.restore(); };
  const pops = (ctx, words, cx, cy) => words.forEach((w) => { const p = clamp(w.t / 0.15), sc = 1 + 0.4 * (1 - p); ctx.save(); ctx.globalAlpha = clamp(1.7 - w.t); ctx.translate(cx, cy); ctx.scale(sc, sc); Ink.drawBubble(ctx, w.s, 0, 0, w.s.length > 8 ? 34 : 46, w.col, 1, -0.06, 'center'); ctx.restore(); });

  // a "why did that happen?" question that lives inside a rig and is saved with the rig's own record
  function conclude(ui, host, o) {
    const d = ui.el('div', 'p07-concl', '', host); d.style.display = 'none';
    ui.el('div', 'p07-q', o.q, d);
    const opts = ui.el('div', 'opts', '', d), f = ui.el('div', 'fb', '', d);
    let tries = (o.prev && o.prev.tries) || 0;
    Book.shuffle(o.options, o.seed).forEach((op) => {
      const b = ui.el('button', 'opt', Book.esc(op.t), opts); b.type = 'button';
      const show = (ok) => { b.classList.add(ok ? 'right' : 'wrong'); if (ok) opts.querySelectorAll('.opt').forEach((x) => (x.disabled = true)); f.className = 'fb on ' + (ok ? 'good' : 'bad'); f.innerHTML = (ok ? '✓ ' : '✗ ') + op.why; };
      b.onclick = () => { const ok = !!op.ok; Book.sfx(ok ? 'success' : 'error', { gain: 0.35 }); Book.scribble(0.15); show(ok); o.onAnswer({ t: op.t, ok, mis: ok ? '' : op.mis || '', tries: ++tries }); };
      if (o.prev && o.prev.ok && o.prev.t === op.t) show(true);
    });
    return { show: () => { d.style.display = ''; } };
  }
  const tail = (pred, right, complete, concl) => (pred ? ` | predicted: ${pred}${complete ? (pred === right ? ' ✓' : ' ✗') : ''}` : '') + (concl ? ` | why: "${concl.t}" ${concl.ok ? '✓' : '✗'}` : '');
  const mark = (concl) => ({ correct: concl ? concl.ok : null, score: concl && concl.ok ? 1 : 0, max: 1, mis: concl && !concl.ok ? concl.mis : '' });

  // =====================================================================================
  // Rig 1: drop test
  // =====================================================================================
  function dropRig(ui, root, host, pred, changed) {
    const rec = ui.record('p07.drop', { label: 'Drop test: 4 boards tested + why corrugated card protected best', type: 'experiment', max: 1 });
    const HS = [0.5, 1, 1.5, 2];
    const BD = [
      { k: 'dup', name: 'Duplex board', lim: 1 }, { k: 'corr', name: 'Corrugated card', lim: 4 },
      { k: 'foil', name: 'Foil lined board', lim: 1 }, { k: 'solid', name: 'Solid white board', lim: 2 },
    ];
    const prev = rec.get() || {}, st = {};
    BD.forEach((b) => (st[b.k] = Object.assign({ n: 0, broken: false }, (prev.st || {})[b.k])));
    let concl = prev.concl || null;
    const done = (k) => st[k].broken || st[k].n >= 4, all = () => BD.every((b) => done(b.k));
    const pick = ui.el('div', 'p07-pick', '', host);
    const W = 860, Hh = 440, S = stage(host, W, Hh);
    const row = ui.el('div', 'p07-row', '', host), go = ui.el('button', 'btn', '', row), out = ui.el('div', 'p07-out', '', row); go.type = 'button';
    const tbl = ui.el('table', 'p07-tbl', '', host);
    const FLOOR = 396, yOf = (h) => FLOOR - h * 165, BX = 250, BW = 100, BH = 86, IX = 640, IY = 222, IR = 168;
    let cur = (BD.find((b) => !done(b.k)) || BD[0]).k, phase = 'idle', pt = 0, by = FLOOR, v = 0, target = FLOOR, from = FLOOR, sq = 0, words = [];
    const L = S.layer();

    function paintStatic() {
      L.reset(); const x = L.x;
      line(x, [[20, FLOOR], [440, FLOOR]], { w: 3, seed: 1 });
      hatch(x, box(20, FLOOR + 3, 420, 24), B, 0.3, 7, 1);
      // height pole
      const pole = box(112, 40, 12, FLOOR - 40); paperFill(x, pole); hatch(x, pole, B, 0.35, 5, -1); line(x, close(pole), { w: 2, seed: 2 });
      HS.forEach((h, i) => { line(x, [[124, yOf(h)], [168, yOf(h)]], { w: 2, seed: 3 + i, retrace: false }); text(x, h + ' m', 104, yOf(h) + 8, { font: 'lab', size: 22, align: 'right' }); });
      // the look-inside bubble
      line(x, geo.ellipse(IX, IY, IR, IR), { w: 2.8, seed: 9 });
      text(x, 'inside the box', IX, 36, { size: 24, align: 'center' });
    }
    function save() {
      const list = BD.filter((b) => done(b.k)).map((b) => `${b.name.toLowerCase()}: egg ${st[b.k].broken ? 'cracked at ' + HS[st[b.k].n - 1] + ' m' : 'survived 2 m'}`);
      rec.set(Object.assign({ answer: `tested ${list.length}/4` + (list.length ? ': ' + list.join('; ') : '') + tail(pred(), 'Corrugated card', all(), concl), st, concl }, mark(concl)));
      changed();
    }
    const q = conclude(ui, host, {
      q: 'Look at your results. <b>Why</b> did the corrugated card box protect the egg best?', seed: 71, prev: concl,
      options: [
        { t: 'Its wavy fluted layer squashes and absorbs the impact', ok: true, why: 'Yes! The fluted layer between the two liners squashes a little and absorbs the impact, so the knock never reaches the egg.' },
        { t: 'It is one thick, solid sheet that is too hard to dent', mis: 'corrugated-structure', why: 'Pick corrugated card again and look inside the box: the wall is not solid. What is between the two flat liners, and what happened to it?' },
        { t: 'Its smooth white coating lets the box slide to a stop', mis: 'board-mixup', why: 'A white coated face is there to be printed on. Pick corrugated card again and look at the wall under the egg after a drop.' },
        { t: 'Its thin layer of foil bounces the impact straight back', mis: 'foil-purpose', why: 'There is no foil in corrugated card. Pick it again and look at the wall under the egg after a drop.' },
      ],
      onAnswer: (a) => { concl = concl && concl.ok ? concl : a; save(); },
    });

    function sync() {
      const s = st[cur];
      pick.querySelectorAll('.opt').forEach((e) => { e.classList.toggle('sel', e.dataset.k === cur); e.classList.toggle('done', done(e.dataset.k)); });
      go.disabled = done(cur) || phase !== 'idle';
      go.textContent = done(cur) ? (all() ? 'All four tested ✓' : 'Pick another board') : `Drop it from ${HS[s.n]} m ▸`;
      tbl.innerHTML = '<tr><th>Egg packed in…</th>' + HS.map((h) => `<th>${h} m</th>`).join('') + '</tr>' + BD.map((z) => {
        const t = st[z.k]; return `<tr><td>${z.name}</td>` + HS.map((h, i) => (i < t.n ? (t.broken && i === t.n - 1 ? '<td class="n">✗ cracked</td>' : '<td class="y">✓ safe</td>') : `<td>${t.broken ? '–' : ''}</td>`)).join('') + '</tr>';
      }).join('');
      if (all()) q.show();
      S.dirty = true;
    }
    function land() {
      const s = st[cur], b = BD.find((z) => z.k === cur), h = HS[s.n]; s.n++; sq = 1;
      if (s.n > b.lim) { s.broken = true; Book.sfx('impact', { gain: 0.7 }); Book.sfx('glitch', { gain: 0.4 }); words.push({ s: 'CRACK!', col: R, t: 0 }); out.innerHTML = `Dropped from ${h} m: <b>the egg cracked</b>. ` + (all() ? '' : 'Pick another board.'); }
      else { Book.sfx('thud', { gain: 0.6 }); words.push({ s: 'SAFE!', col: G, t: 0 }); out.innerHTML = s.n >= 4 ? 'Dropped from 2 m and <b>the egg is still whole!</b> Look closely at the wall of the box under the egg.' : `Dropped from ${h} m: the egg is fine. Go higher!`; }
      save();
    }
    function drop() {
      if (phase !== 'idle' || done(cur)) return;
      phase = 'lift'; pt = 0; from = by; target = yOf(HS[st[cur].n]); Book.sfx('whoosh', { dur: 0.3, gain: 0.3 }); sync();
    }
    go.onclick = drop; S.c.addEventListener('click', drop);
    const choose = (k) => { if (phase !== 'idle') return; cur = k; by = FLOOR; sq = 0; words = []; Book.sfx('tock', { gain: 0.4 }); out.innerHTML = done(k) ? 'Already tested: your results are in the table.' : `A fresh egg, packed in a box made from <b>${BD.find((z) => z.k === k).name.toLowerCase()}</b>.`; sync(); };
    BD.forEach((b) => { const e = ui.el('button', 'opt', b.name, pick); e.type = 'button'; e.dataset.k = b.k; e.onclick = () => choose(b.k); });

    // the wall of the box, drawn as a slab from (x0,y0) w wide and th thick (horizontal) in the board's own make-up
    function wall(ctx, k, x0, x1, top, th, squash, seed) {
      const P = [], Q = [], bump = (x) => Math.exp(-Math.pow((x - IX) / 78, 2)) * squash;
      for (let x = x0; x <= x1; x += 6) { P.push([x, top + (k === 'corr' ? 11 * bump(x) : 0)]); Q.push([x, top + th]); }
      const slab = P.concat(Q.slice().reverse()); paperFill(ctx, slab);
      if (k === 'corr') {
        const wv = []; for (let x = x0; x <= x1; x += 3) { const a = (th / 2 - 4) * (1 - 0.9 * bump(x)), mid = top + th / 2 + 5 * bump(x); wv.push([x, mid + Math.sin(x * Math.PI * 2 / 44) * a]); }
        line(ctx, wv, { w: 2, seed: seed + 2, amp: 0.3, retrace: false });
      } else if (k === 'dup') hatch(ctx, [[x0, top + th / 2], [x1, top + th / 2], [x1, top + th], [x0, top + th]], B, 0.6, 3.5, 1);
      else if (k === 'foil') { plain(ctx, [[x0, top + 2.5], [x1, top + 2.5]], B, 0.9, 3.4); }
      line(ctx, P, { w: 2.2, seed, amp: 0.4 }); line(ctx, Q, { w: 2.2, seed: seed + 1, amp: 0.4 });
      if (k === 'dup') plain(ctx, [[x0, top + th / 2], [x1, top + th / 2]], B, 0.6, 1.2);
    }
    const TH = { corr: 42, solid: 13, dup: 10, foil: 10 };
    function inside(ctx) {
      const s = st[cur], th = TH[cur], GY = IY + 112, top = GY - th;
      ctx.save(); ctx.beginPath(); ctx.arc(IX, IY, IR - 3, 0, 7); ctx.clip();
      line(ctx, [[IX - IR, GY + 1], [IX + IR, GY + 1]], { w: 2.6, seed: 20 }); hatch(ctx, box(IX - IR, GY + 4, IR * 2, 60), B, 0.3, 7, 1);
      const squash = cur === 'corr' ? clamp(s.n * 0.24 + sq * 0.3) : 0;
      wall(ctx, cur, IX - 124, IX + 124, top, th, squash, 22);
      // side walls of the box
      [IX - 124, IX + 124].forEach((wx, i) => {
        const w = Math.max(9, th * 0.5), x0 = i ? wx : wx - w, P = box(x0, IY - IR, w, top + th - IY + IR); paperFill(ctx, P);
        if (cur === 'corr') { const z = []; for (let y = IY - IR; y < top + th; y += 3) z.push([x0 + w / 2 + Math.sin(y * Math.PI * 2 / 44) * (w / 2 - 3), y]); line(ctx, z, { w: 1.8, seed: 30 + i, amp: 0.3, retrace: false }); }
        else if (cur === 'dup') hatch(ctx, box(i ? x0 + w / 2 : x0, IY - IR, w / 2, top + th - IY + IR), B, 0.6, 3.5, 1);
        else if (cur === 'foil') plain(ctx, [[i ? x0 + 2.5 : x0 + w - 2.5, IY - IR], [i ? x0 + 2.5 : x0 + w - 2.5, top]], B, 0.9, 3.4);
        line(ctx, [[x0, IY - IR], [x0, top + th]], { w: 2, seed: 32 + i, amp: 0.4 }); line(ctx, [[x0 + w, IY - IR], [x0 + w, top + th]], { w: 2, seed: 34 + i, amp: 0.4 });
      });
      // the egg
      const ey = top - 60 + (cur === 'corr' ? 11 * squash : 0) + sq * 3, egg = [];
      for (let i = 0; i <= 48; i++) { const a = i / 48 * Math.PI * 2; egg.push([IX + 46 * Math.sin(a) * (1 - 0.16 * Math.cos(a)), ey - 60 * Math.cos(a)]); }
      if (s.broken) {
        const pool = geo.ellipse(IX + 18, top - 5, 92, 11, 0, Math.PI * 2);
        paperFill(ctx, pool, 'rgba(240,170,20,0.55)'); line(ctx, pool, { w: 1.8, seed: 40, color: YOLK.map((c) => c * 0.7) });
        paperFill(ctx, egg); line(ctx, egg, { w: 2.6, seed: 41 });
        line(ctx, [[IX - 40, ey + 6], [IX - 22, ey - 8], [IX - 10, ey + 12], [IX + 6, ey - 6], [IX + 20, ey + 14], [IX + 42, ey + 2]], { w: 2.6, color: R, seed: 42, retrace: false });
        line(ctx, [[IX + 6, ey - 6], [IX + 12, ey - 30], [IX + 2, ey - 44]], { w: 2, color: R, seed: 43, retrace: false });
        line(ctx, [[IX - 10, ey + 12], [IX - 16, ey + 34], [IX - 6, ey + 52]], { w: 2, color: R, seed: 44, retrace: false });
        const drip = geo.ellipse(IX + 22, ey + 40, 13, 20, 0, Math.PI * 2); paperFill(ctx, drip, 'rgba(240,170,20,0.7)');
      } else { paperFill(ctx, egg); line(ctx, egg, { w: 2.6, seed: 41 }); line(ctx, geo.curve([IX - 26, ey - 26], [IX - 20, ey - 40], [IX - 10, ey - 48], [IX, ey - 50], 10), { w: 1.6, seed: 45, retrace: false }); }
      ctx.restore();
    }
    function render() {
      S.begin(); const ctx = S.ctx; S.blit(L);
      const s = st[cur], held = phase === 'lift' || phase === 'hold';
      // grabber on a cable
      const gy = held ? by - BH - 16 : 26;
      line(ctx, [[BX, 0], [BX, gy]], { w: 2, seed: 50, amp: 0.3 });
      line(ctx, [[BX - 30, gy + 20], [BX - 30, gy], [BX + 30, gy], [BX + 30, gy + 20]], { w: 2.6, seed: 51, amp: 0.4 });
      // the box
      const k = phase === 'hit' ? 1 - 0.1 * sq : 1, bh = BH * k, P = geo.rect(BX - BW / 2, by - bh, BW, bh, 4);
      if (s.broken && phase === 'idle') { const pu = geo.ellipse(BX + 14, FLOOR - 3, 62, 7, 0, Math.PI * 2); paperFill(ctx, pu, 'rgba(240,170,20,0.6)'); line(ctx, pu, { w: 1.6, seed: 52, color: YOLK.map((c) => c * 0.7) }); }
      Ink.hatchShadow(ctx, P, 1, 6, 0, B); paperFill(ctx, P); line(ctx, P, { w: 2.8, seed: 53 });
      if (cur === 'corr') { const z = []; for (let x = BX - BW / 2 + 4; x <= BX + BW / 2 - 4; x += 3) z.push([x, by - bh + 5 + Math.sin(x * 0.9) * 2.6]); line(ctx, z, { w: 1.4, seed: 54, amp: 0.2, retrace: false }); plain(ctx, [[BX - BW / 2 + 3, by - bh + 10], [BX + BW / 2 - 3, by - bh + 10]], B, 0.8, 1.4); }
      else if (cur === 'dup') hatch(ctx, box(BX - BW / 2 + 2, by - bh + 2, BW - 4, 7), B, 0.6, 3.5, 1);
      else if (cur === 'foil') plain(ctx, [[BX - BW / 2 + 4, by - bh + 6], [BX + BW / 2 - 4, by - bh + 6]], B, 0.9, 3.2);
      const tape = box(BX - 9, by - bh + (cur === 'corr' ? 11 : 2), 18, 30); hatch(ctx, tape, B, 0.35, 4, -1); line(ctx, close(tape), { w: 1.4, seed: 55, retrace: false });
      line(ctx, geo.ellipse(BX, by - 24 * k, 11, 15), { w: 1.8, seed: 56, retrace: false });
      line(ctx, [[BX - 32, by - 14], [BX - 32, by - 36]], { w: 1.8, seed: 57, retrace: false }); line(ctx, geo.head([[BX - 32, by - 14], [BX - 32, by - 36]], 9), { w: 1.8, seed: 58, retrace: false });
      line(ctx, [[BX + 32, by - 14], [BX + 32, by - 36]], { w: 1.8, seed: 59, retrace: false }); line(ctx, geo.head([[BX + 32, by - 14], [BX + 32, by - 36]], 9), { w: 1.8, seed: 60, retrace: false });
      if (phase === 'fall') plain(ctx, [[BX - 62, by - bh - 30], [BX - 62, by - bh + 20]], B, 0.5, 1.6), plain(ctx, [[BX + 62, by - bh - 44], [BX + 62, by - bh + 6]], B, 0.5, 1.6);
      plain(ctx, [[BX + BW / 2 + 8, by - bh / 2], [IX - IR + 4, IY + 30]], B, 0.3, 1.3);
      inside(ctx);
      pops(ctx, words, BX + 20, 150);
    }
    run(root, S, (dt) => {
      let anim = false;
      if (phase === 'lift') { pt += dt / 0.45; const e = 1 - Math.pow(1 - Math.min(1, pt), 3); by = from + (target - from) * e; anim = true; if (pt >= 1) { phase = 'hold'; pt = 0; } }
      else if (phase === 'hold') { pt += dt / 0.3; anim = true; if (pt >= 1) { phase = 'fall'; v = 0; } }
      else if (phase === 'fall') { v += 2600 * dt; by += v * dt; anim = true; if (by >= FLOOR) { by = FLOOR; phase = 'hit'; pt = 0; land(); } }
      else if (phase === 'hit') { pt += dt / 0.35; sq = Math.max(0, 1 - pt); anim = true; if (pt >= 1) { phase = 'idle'; sq = 0; sync(); } }
      words.forEach((w) => (w.t += dt)); words = words.filter((w) => w.t < 1.7); if (words.length) anim = true;
      if (anim || S.dirty) { S.dirty = false; render(); }
    });
    paintStatic(); if (document.fonts) document.fonts.ready.then(() => { paintStatic(); S.dirty = true; });
    out.innerHTML = all() ? 'All four tested: your results are in the table.' : 'Pick a board, then tap the button (or the picture) to drop the box. Go higher each time until the egg cracks.';
    sync();
  }

  // =====================================================================================
  // Rig 2: keep it hot
  // =====================================================================================
  function hotRig(ui, root, host, pred, changed) {
    const rec = ui.record('p07.hot', { label: 'Keep-it-hot test: 3 lids for 20 min + why the foil lined lid kept the heat', type: 'experiment', max: 1 });
    const LIDS = [
      { k: 'solid', name: 'Solid white board', end: 48, sag: 11, cx: 150 }, { k: 'foil', name: 'Foil lined board', end: 62, sag: 0, cx: 430 }, { k: 'dup', name: 'Duplex board', end: 46, sag: 15, cx: 710 },
    ];
    LIDS.forEach((l) => (l.rate = Math.log(55 / (l.end - 20)) / 20));
    const temp = (l, t) => 20 + 55 * Math.exp(-l.rate * t); // every meal starts at 75 °C in a 20 °C room
    const prev = rec.get() || {};
    let ran = !!prev.ran, t = ran ? 20 : 0, concl = prev.concl || null; const lifted = new Set(prev.lifted || []), open = new Set(prev.lifted || []);
    const W = 860, Hh = 410, S = stage(host, W, Hh);
    const row = ui.el('div', 'p07-row', '', host); ui.el('span', 'p07-lab', '0 min', row);
    const rng = ui.el('input', 'p07-range', null, row); rng.type = 'range'; rng.min = 0; rng.max = 20; rng.step = 0.25; rng.value = t; rng.setAttribute('aria-label', 'Time in minutes');
    ui.el('span', 'p07-lab', '20 min', row);
    const out = ui.el('div', 'p07-out', '', host); out.style.marginTop = '8px';
    const L = S.layer(), CY = 324, CKX = 543, CKY = 48;

    function paintStatic() {
      L.reset(); const x = L.x;
      line(x, [[14, CY], [846, CY]], { w: 3, seed: 1 }); hatch(x, box(14, CY + 3, 832, 10), B, 0.3, 6, 1);
      LIDS.forEach((l, i) => {
        const c = l.cx, tray = [[c - 104, 238], [c - 94, 238], [c - 80, 318], [c + 80, 318], [c + 94, 238], [c + 104, 238]];
        line(x, tray, { w: 2.8, seed: 10 + i });
        const food = [[c - 88, 290]]; for (let u = 0; u <= 1.001; u += 0.05) food.push([c - 88 + 176 * u, 288 - 9 * Math.sin(u * Math.PI) - 3 * Math.sin(u * 19 + i)]); food.push([c + 79, 316], [c - 79, 316]);
        hatch(x, food, R, 0.45, 5, 1); hatch(x, food, B, 0.25, 7, -1); line(x, food.slice(0, -2), { w: 1.8, seed: 14 + i, retrace: false });
        [[-40, 300], [-8, 304], [26, 298], [52, 306], [-60, 308]].forEach(([dx, y], j) => line(x, geo.ellipse(c + dx, y, 6, 4), { w: 1.3, seed: 18 + i * 5 + j, retrace: false }));
        text(x, l.name, c, 360, { font: 'lab', size: 22, align: 'center' });
      });
      line(x, geo.ellipse(CKX, CKY, 32, 32), { w: 2.6, seed: 30 });
      for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; plain(x, [[CKX + Math.sin(a) * 25, CKY - Math.cos(a) * 25], [CKX + Math.sin(a) * 30, CKY - Math.cos(a) * 30]], B, 0.8, 1.6); }
    }
    function save() {
      rec.set(Object.assign({ answer: (ran ? 'ran 20 min: ' + LIDS.map((l) => `${l.name.toLowerCase()} lid ${l.end} °C`).join(', ') + `; lids lifted ${lifted.size}/3` : 'clock not run to 20 min') + tail(pred(), 'Foil lined board', ran, concl), ran, lifted: [...lifted], concl }, mark(concl)));
      changed();
    }
    const q = conclude(ui, host, {
      q: 'All three meals started at 75 °C. <b>Why</b> did the one under the foil lined lid stay hottest?', seed: 5, prev: concl,
      options: [
        { t: 'The foil reflects the heat back down onto the food', ok: true, why: 'Yes! The shiny foil reflects heat back to the food. It is also a barrier to moisture, so the steam cannot soak into the card.' },
        { t: 'The foil makes its own heat, like a small heater', mis: 'foil-purpose', why: 'Foil cannot make heat: that meal cooled down too, just more slowly. Watch what the heat does when it reaches the foil.' },
        { t: 'The foil soaks up the steam, like a kitchen sponge', mis: 'foil-purpose', why: 'Lift that lid again: the foil was dry. It does not soak anything up. Watch what the heat does when it reaches the foil.' },
        { t: 'The foil makes the lid thick, heavy and hard to lift', mis: 'foil-purpose', why: 'The foil layer is very thin. Drag the clock again and watch what the heat does when it reaches the foil.' },
      ],
      onAnswer: (a) => { concl = concl && concl.ok ? concl : a; save(); },
    });
    const prompt = () => { out.innerHTML = !ran ? 'Drag the clock from 0 to <b>20 minutes</b> and watch the three meals.' : lifted.size < 3 ? `Time's up! Now <b>tap each lid</b> to lift it and look underneath. (${lifted.size}/3)` : 'Tested! Tap a lid to look again, or drag the clock back and re-run it.'; };
    rng.addEventListener('input', () => {
      t = +rng.value; S.dirty = true;
      if (t >= 20 && !ran) { ran = true; Book.sfx('success', { gain: 0.3 }); save(); prompt(); }
    });
    S.c.addEventListener('click', (e) => {
      const [x] = S.pos(e), l = LIDS.find((z) => Math.abs(x - z.cx) < 135); if (!l) return;
      if (!ran) { out.innerHTML = 'Not yet: drag the clock to <b>20 minutes</b> first.'; return; }
      if (open.has(l.k)) open.delete(l.k); else open.add(l.k);
      Book.sfx('paper', { gain: 0.4, dur: 0.2 }); const first = !lifted.has(l.k); lifted.add(l.k); if (first) save(); prompt();
      if (open.has(l.k)) out.innerHTML += '<br>' + (l.k === 'foil' ? 'Under the foil lined lid: <b>shiny and dry</b>, and the lid is still flat.' : `Under the ${l.name.toLowerCase()} lid: <b>soggy</b>. The card soaked up the steam and the lid has sagged.`);
      if (lifted.size === 3) q.show(); S.dirty = true;
    });

    function lidBand(l, wet) {
      const top = [], bot = [], sag = l.sag * Math.pow(wet, 1.2);
      for (let u = 0; u <= 1.001; u += 0.05) { const x = l.cx - 114 + 228 * u, y = 226 + sag * Math.sin(u * Math.PI); top.push([x, y]); bot.push([x, y + 9]); }
      return { top, bot, P: top.concat(bot.slice().reverse()) };
    }
    function arrows(ctx, l, now, a) {
      if (a < 0.03) return;
      ctx.save(); ctx.strokeStyle = rgba(R, 0.75 * a); ctx.lineWidth = 2.4; ctx.setLineDash([9, 7]); ctx.lineDashOffset = -now * 34; ctx.lineCap = 'round';
      [-52, 0, 52].forEach((dx, i) => {
        const x = l.cx + dx; ctx.beginPath();
        if (l.k === 'foil' && !open.has(l.k)) { ctx.moveTo(x - 11, 280); ctx.lineTo(x - 11, 252); ctx.quadraticCurveTo(x, 236, x + 11, 252); ctx.lineTo(x + 11, 274); ctx.moveTo(x + 5, 266); ctx.lineTo(x + 11, 276); ctx.lineTo(x + 17, 266); }
        else { for (let y = 280; y >= 150; y -= 5) { const q = x + Math.sin(y * 0.11 + i) * 5; if (y === 280) ctx.moveTo(q, y); else ctx.lineTo(q, y); } const q = x + Math.sin(150 * 0.11 + i) * 5; ctx.moveTo(q - 7, 160); ctx.lineTo(q, 148); ctx.lineTo(q + 7, 160); }
        ctx.stroke();
      });
      ctx.restore();
    }
    function render(now) {
      S.begin(); const ctx = S.ctx; S.blit(L);
      // clock
      const a = t / 60 * Math.PI * 2;
      if (t > 0.1) { ctx.save(); ctx.fillStyle = rgba(R, 0.22); ctx.beginPath(); ctx.moveTo(CKX, CKY); ctx.arc(CKX, CKY, 26, -Math.PI / 2, a - Math.PI / 2); ctx.closePath(); ctx.fill(); ctx.restore(); }
      plain(ctx, [[CKX, CKY], [CKX + Math.sin(a) * 23, CKY - Math.cos(a) * 23]], R, 0.95, 3.2);
      text(ctx, Math.floor(t) + ' min', CKX, 110, { font: 'lab', size: 24, align: 'center' });
      LIDS.forEach((l, i) => {
        const T = temp(l, t), wet = l.k === 'foil' ? 0 : t / 20, isOpen = open.has(l.k);
        arrows(ctx, l, now, clamp(t / 3) * (0.35 + 0.65 * (T - 20) / 55) * (isOpen ? 0.6 : 1));
        const Lb = lidBand(l, wet);
        ctx.save();
        if (isOpen) { ctx.translate(l.cx - 114, 232); ctx.rotate(-0.5); ctx.translate(-(l.cx - 114), -232); }
        paperFill(ctx, Lb.P);
        if (l.k === 'dup') hatch(ctx, Lb.top.map(([x, y]) => [x, y + 4.5]).concat(Lb.bot.slice().reverse()), B, 0.6, 3.5, 1);
        if (wet > 0.05) hatch(ctx, Lb.P, B, 0.5 * wet, 3, -1);
        line(ctx, Lb.top, { w: 2.2, seed: 40 + i, amp: 0.3 + wet * 0.9 }); line(ctx, Lb.bot, { w: l.k === 'foil' ? 3.6 : 2.2, seed: 44 + i, amp: 0.3 + wet * 0.9 });
        plain(ctx, [Lb.top[0], Lb.bot[0]], B, 0.9, 2); plain(ctx, [Lb.top[Lb.top.length - 1], Lb.bot[Lb.bot.length - 1]], B, 0.9, 2);
        if (l.k !== 'foil') for (let d = 0; d < Math.min(3, Math.floor(t / 6)); d++) { const q = Lb.bot[[10, 5, 15][d]]; ctx.fillStyle = rgba(B, 0.55); ctx.beginPath(); ctx.moveTo(q[0], q[1] + 1); ctx.quadraticCurveTo(q[0] + 5, q[1] + 11, q[0], q[1] + 13); ctx.quadraticCurveTo(q[0] - 5, q[1] + 11, q[0], q[1] + 1); ctx.fill(); }
        ctx.restore();
        if (isOpen) {
          // a close look at the underside of the lid
          const X0 = l.cx - 118, sw = geo.rect(X0, 50, 124, 74, 6); Ink.hatchShadow(ctx, sw, 1, 5, 5, B); paperFill(ctx, sw);
          if (l.k === 'foil') { [8, 38, 66, 90].forEach((dx, j) => plain(ctx, [[X0 + dx, 116], [X0 + dx + 24, 58]], B, 0.55, j % 2 ? 1.4 : 2.4)); }
          else { [[34, 76, 24, 14], [84, 96, 28, 16], [96, 66, 16, 10], [40, 106, 20, 9]].forEach(([dx, y, rx, ry], j) => { const bl = geo.ellipse(X0 + dx, y, rx, ry, 0, Math.PI * 2); hatch(ctx, bl, B, 0.6, 3, 1); hatch(ctx, bl, B, 0.4, 4, -1); line(ctx, bl, { w: 1.3, seed: 60 + j + i * 4, amp: 1.6, retrace: false }); }); }
          line(ctx, sw, { w: 2.2, seed: 50 + i });
          text(ctx, 'underneath:', X0 + 62, 38, { size: 22, align: 'center' });
          text(ctx, l.k === 'foil' ? 'dry!' : 'soggy!', X0 + 56, 160, { size: 26, align: 'center', color: l.k === 'foil' ? G : R, rot: -0.04 });
        }
        text(ctx, Math.round(T) + ' °C', l.cx, 398, { font: 'lab', size: 32, align: 'center' });
      });
    }
    run(root, S, (dt, now) => { if (t > 0 || S.dirty) { S.dirty = false; render(now); } });
    paintStatic(); if (document.fonts) document.fonts.ready.then(() => { paintStatic(); S.dirty = true; });
    prompt(); if (lifted.size === 3) q.show();
  }

  // =====================================================================================
  // Rig 3: bridge test (stiffness for weight)
  // =====================================================================================
  function stiffRig(ui, root, host, pred, changed) {
    const rec = ui.record('p07.stiff', { label: 'Bridge test: 4 board strips loaded + which is stiffest for its weight', type: 'experiment', max: 1 });
    const D = {
      solid: { name: 'Solid white board', th: 5, g: 14, hold: 2, sag: 27 }, foam: { name: 'Foam core board', th: 15, g: 12, hold: 8, sag: 2 },
      dup: { name: 'Duplex board', th: 4, g: 10, hold: 1, sag: 46 }, corr: { name: 'Corrugated card', th: 11, g: 15, hold: 6, sag: 5 },
      corrX: { name: 'Corrugated card, flutes turned', th: 11, g: 15, hold: 2, sag: 13 },
    };
    const MAIN = ['solid', 'foam', 'dup', 'corr'], MAXW = 8;
    const prev = rec.get() || {}, st = {};
    Object.keys(D).forEach((k) => (st[k] = Object.assign({ n: 0, fell: false, done: false }, (prev.st || {})[k])));
    let concl = prev.concl || null;
    const all = () => MAIN.every((k) => st[k].done);
    const pick = ui.el('div', 'p07-pick', '', host);
    const W = 860, Hh = 430, S = stage(host, W, Hh);
    const row = ui.el('div', 'p07-row', '', host), add = ui.el('button', 'btn', '', row), turn = ui.el('button', 'btn ghost', '↻ Turn the flutes 90°', row), out = ui.el('div', 'p07-out', '', row); add.type = turn.type = 'button';
    const tbl = ui.el('table', 'p07-tbl', '', host);
    const TY = 384, YS = 250, XL = 250, XR = 750, GA = 370, GB = 630, MX = 500;
    let cur = MAIN.find((k) => !st[k].done) || 'solid', turned = false, sagNow = 0, col = 0, words = [];
    const key = () => (cur === 'corr' && turned ? 'corrX' : cur);
    const L = S.layer();

    function paintStatic() {
      L.reset(); const x = L.x;
      line(x, [[14, TY], [846, TY]], { w: 3, seed: 1 }); hatch(x, box(14, TY + 3, 832, 26), B, 0.3, 7, 1);
      [[300, 2], [630, 4]].forEach(([bx, sd]) => { const P = box(bx, YS, 70, TY - YS); paperFill(x, P); Ink.hatchFill(x, P, 1, B, 0.8); line(x, close(P), { w: 2.8, seed: sd }); plain(x, [[bx, YS + 44], [bx + 70, YS + 44]], B, 0.6, 1.4); plain(x, [[bx, YS + 88], [bx + 70, YS + 88]], B, 0.6, 1.4); });
      // the balance
      const body = geo.rect(36, 336, 188, 48, 6); Ink.hatchShadow(x, body, 1, 6, 0, B); paperFill(x, body); hatch(x, body, B, 0.25, 6, 1); line(x, body, { w: 2.6, seed: 6 });
      const pan = box(48, 322, 164, 9); paperFill(x, pan); line(x, close(pan), { w: 2, seed: 7 }); plain(x, [[130, 331], [130, 336]], B, 0.9, 5);
      const scr = geo.rect(84, 345, 92, 32, 4); paperFill(x, scr); line(x, scr, { w: 1.8, seed: 8 });
      text(x, 'balance', 130, 414, { size: 22, align: 'center', a: 0.8 });
    }
    // top and bottom edges of the strip for a given sag / collapse
    function strip(k, sag, c, x0 = XL, x1 = XR) {
      const d = D[k], top = [], bot = [], depth = TY - YS - 3;
      for (let x = x0; x <= x1; x += 5) {
        let dy = 0;
        if (x > GA && x < GB) { const v = (x - GA) / (GB - GA); dy = sag * Math.sin(v * Math.PI) * (1 - c) + c * depth * Math.pow(1 - Math.abs(2 * v - 1), k === 'corr' || k === 'corrX' ? 1 : 0.6); }
        else dy = -c * 0.3 * (x <= GA ? GA - x : x - GB);
        top.push([x, YS - d.th + dy]); bot.push([x, YS + dy]);
      }
      return { top, bot, P: top.concat(bot.slice().reverse()) };
    }
    function drawStrip(ctx, k, Sx, seed) {
      const d = D[k]; paperFill(ctx, Sx.P);
      if (k === 'dup') hatch(ctx, Sx.top.map(([x, y]) => [x, y + d.th / 2]).concat(Sx.bot.slice().reverse()), B, 0.65, 3, 1);
      else if (k === 'foam') { ctx.save(); ctx.fillStyle = rgba(B, 0.55); Sx.top.forEach(([x, y], i) => { for (let j = 0; j < 3; j++) { ctx.beginPath(); ctx.arc(x + ((i * 7 + j * 3) % 5) - 1, y + 4 + j * 3.6 + ((i + j) % 2), 0.9, 0, 7); ctx.fill(); } }); ctx.restore(); plain(ctx, Sx.top.map(([x, y]) => [x, y + 2.6]), B, 0.7, 1); plain(ctx, Sx.bot.map(([x, y]) => [x, y - 2.6]), B, 0.7, 1); }
      else if (k === 'corr') plain(ctx, Sx.top.map(([x, y]) => [x, y + d.th / 2]), B, 0.7, 1.2);
      else if (k === 'corrX') { const z = []; Sx.top.forEach(([x, y], i) => { z.push([x, y + d.th / 2 - 3.2], [x + 2.5, y + d.th / 2 + 3.2]); }); plain(ctx, z, B, 0.85, 1.3); }
      line(ctx, Sx.top, { w: 2.2, seed, amp: 0.3 }); line(ctx, Sx.bot, { w: 2.2, seed: seed + 1, amp: 0.3 });
      plain(ctx, [Sx.top[0], Sx.bot[0]], B, 0.9, 2); plain(ctx, [Sx.top[Sx.top.length - 1], Sx.bot[Sx.bot.length - 1]], B, 0.9, 2);
    }
    const held = (k) => Math.min(st[k].n, D[k].hold) * 100;
    function save() {
      const list = MAIN.filter((k) => st[k].done).map((k) => `${D[k].name.toLowerCase()} (${D[k].g} g strip) held ${held(k)} g${st[k].fell ? '' : ' without giving way'}`);
      rec.set(Object.assign({ answer: `tested ${list.length}/4` + (list.length ? ': ' + list.join('; ') : '') + (st.corrX.done ? `; bonus, flutes turned 90°: held ${held('corrX')} g` : '') + tail(pred(), 'Foam core board', all(), concl), st, concl }, mark(concl)));
      changed();
    }
    const q = conclude(ui, host, {
      q: 'Use your results table. Which board gives the most <b>stiffness for the least weight</b>, and why?', seed: 3, prev: concl,
      options: [
        { t: 'Foam core board: light polystyrene foam between two card faces', ok: true, why: 'Yes! Polystyrene foam sandwiched between two sheets of card makes a board that is rigid and very lightweight. (It dents easily, though.)' },
        { t: 'Corrugated card: it was the heaviest strip, so it held the most', mis: 'corrugated-structure', why: 'Check the table: corrugated card did well for its weight, but another strip was lighter and held even more.' },
        { t: 'Solid white board: solid card always beats a sandwich of layers', mis: 'board-mixup', why: 'Check the table: the solid white board strip bent to the table under a small load, though it was heavier than two of the others.' },
        { t: 'Duplex board: the lightest strip must be best for its weight', mis: 'board-mixup', why: 'It was the lightest strip, but check the table: it held the smallest load of all. Stiffness for weight needs both.' },
      ],
      onAnswer: (a) => { concl = concl && concl.ok ? concl : a; save(); },
    });
    function sync() {
      const k = key(), s = st[k];
      pick.querySelectorAll('.opt').forEach((e) => { e.classList.toggle('sel', e.dataset.k === cur); e.classList.toggle('done', st[e.dataset.k].done); });
      add.disabled = s.done; add.textContent = s.done ? (all() ? 'All four tested ✓' : 'Pick another board') : '＋ Add a 100 g weight';
      turn.style.display = cur === 'corr' ? '' : 'none';
      const rows = MAIN.concat(st.corrX.done ? ['corrX'] : []);
      tbl.innerHTML = '<tr><th>Strip (all the same size)</th><th>Strip weighs</th><th>Load it held</th></tr>' + rows.map((z) => `<tr><td>${D[z].name}</td><td>${st[z].done || st[z].n ? D[z].g + ' g' : ''}</td><td>${st[z].done ? `<span class="${st[z].fell ? '' : 'y'}">${held(z)} g${st[z].fell ? '' : ' (all 8 weights!)'}</span>` : ''}</td></tr>`).join('');
      if (all()) q.show();
      S.dirty = true;
    }
    function addW() {
      const k = key(), s = st[k], d = D[k]; if (s.done) return;
      s.n++;
      if (s.n > d.hold) {
        s.fell = s.done = true; Book.sfx('impact', { gain: 0.6 }); Book.sfx('thud', { gain: 0.5 });
        const thin = k === 'dup' || k === 'solid'; words.push({ s: thin ? 'FLOP!' : 'CREASE!', col: R, t: 0 });
        out.innerHTML = k === 'corrX' ? `With the flutes turned it <b>folded along a flute</b> and held only ${held(k)} g. Same card, different direction!` : thin ? `It bent right down to the table. It held <b>${held(k)} g</b>.` : `It creased in the middle. It held <b>${held(k)} g</b>: not bad for a ${d.g} g strip! <span class="small">Bonus: turn the flutes and test it again.</span>`;
      } else if (s.n >= MAXW) { s.done = true; Book.sfx('success', { gain: 0.35 }); out.innerHTML = `All eight weights (<b>800 g</b>) and it has hardly bent! Look closely at its top face, though.`; }
      else { Book.sfx('tock', { gain: 0.5 }); out.innerHTML = `${s.n * 100} g on a ${d.g} g strip. Keep going!`; }
      save(); sync();
    }
    add.onclick = addW; S.c.addEventListener('click', addW);
    const fresh = () => { const s = st[key()]; sagNow = s.fell ? 0 : s.n * D[key()].sag; col = s.fell ? 1 : 0; words = []; };
    const choose = (k) => { cur = k; turned = false; fresh(); Book.sfx('tock', { gain: 0.4 }); out.innerHTML = st[k].done ? 'Already tested: your result is in the table.' : `A strip of <b>${D[k].name.toLowerCase()}</b> bridges the gap. Tap to load it.`; sync(); };
    turn.onclick = () => { turned = !turned; fresh(); Book.sfx('paper', { gain: 0.4, dur: 0.2 }); const s = st[key()]; out.innerHTML = turned ? (s.done ? 'Flutes turned: already tested (see the table).' : 'Same card, but now the flutes run <b>across</b> the strip. Load it!') : 'The flutes run <b>along</b> the strip again, from support to support.'; sync(); };
    MAIN.forEach((k) => { const e = ui.el('button', 'opt', D[k].name, pick); e.type = 'button'; e.dataset.k = k; e.onclick = () => choose(k); });

    function weight(ctx, cx, yb, rot, i) {
      ctx.save(); ctx.translate(cx, yb); ctx.rotate(rot);
      const P = geo.rect(-33, -15, 66, 15, 3); paperFill(ctx, P); hatch(ctx, P, B, 0.5, 4, i % 2 ? 1 : -1); line(ctx, P, { w: 2, seed: 70 + i, amp: 0.3 });
      ctx.restore();
    }
    function render() {
      S.begin(); const ctx = S.ctx; S.blit(L);
      const k = key(), s = st[k], d = D[k];
      // twin strip on the balance
      const tw = { top: [], bot: [] }; for (let x = 56; x <= 204; x += 4) { tw.top.push([x, 322 - d.th]); tw.bot.push([x, 322]); } tw.P = tw.top.concat(tw.bot.slice().reverse());
      drawStrip(ctx, k, tw, 20);
      text(ctx, d.g + ' g', 130, 370, { font: 'lab', size: 24, align: 'center' });
      if (cur === 'corr') {
        // top view: which way do the flutes run?
        const tv = box(52, 206, 156, 54); paperFill(ctx, tv);
        ctx.save(); ctx.strokeStyle = rgba(B, 0.7); ctx.lineWidth = 1.3; ctx.beginPath();
        if (turned) for (let x = 60; x < 206; x += 8) { ctx.moveTo(x, 208); ctx.lineTo(x, 258); } else for (let y = 213; y < 258; y += 8) { ctx.moveTo(54, y); ctx.lineTo(206, y); }
        ctx.stroke(); ctx.restore(); line(ctx, close(tv), { w: 2, seed: 24 });
        text(ctx, 'top view: flutes', 130, 172, { size: 22, align: 'center' }); text(ctx, turned ? 'run across' : 'run along', 130, 198, { size: 22, align: 'center', color: R });
      }
      // the bridge
      const Sx = strip(k, sagNow, col); drawStrip(ctx, k, Sx, 30);
      const mid = Sx.top[Math.round((MX - XL) / 5)][1], n = Math.min(s.n, MAXW);
      for (let i = 0; i < n; i++) {
        const sx = MX + (i - (n - 1) / 2) * 44 + (i % 2 ? 9 : -9), yb = mid - i * 16;
        weight(ctx, MX + (sx - MX) * col, yb + (TY - 1 - (i % 2) * 15 - yb) * col, col * (i % 3 - 1) * 0.12, i);
      }
      if (k === 'foam' && s.done) { line(ctx, geo.ellipse(MX - 52, mid + 2, 22, 14), { w: 2, color: R, seed: 40 }); text(ctx, 'a dent!', MX - 150, mid - 16, { size: 24, color: R, rot: -0.05 }); }
      if (!s.n) text(ctx, 'tap to add a weight', MX, 150, { size: 24, color: R, align: 'center', rot: -0.02 });
      pops(ctx, words, MX, 110);
    }
    run(root, S, (dt) => {
      let anim = false; const s = st[key()], tgt = s.fell ? 0 : s.n * D[key()].sag;
      if (s.fell && col < 1) { col = Math.min(1, col + dt / 0.28); anim = true; }
      if (Math.abs(sagNow - tgt) > 0.2) { sagNow += (tgt - sagNow) * Math.min(1, dt * 12); anim = true; }
      words.forEach((w) => (w.t += dt)); words = words.filter((w) => w.t < 1.7); if (words.length) anim = true;
      if (anim || S.dirty) { S.dirty = false; render(); }
    });
    paintStatic(); if (document.fonts) document.fonts.ready.then(() => { paintStatic(); S.dirty = true; });
    fresh(); out.innerHTML = all() ? 'All four tested: your results are in the table.' : 'Pick a strip, then tap the bridge (or the button) to add 100 g weights until it gives way.';
    sync();
  }

  // =====================================================================================
  Book.page({
    id: 'p07',
    title: 'The packaging test lab',
    build(ui, root) {
      css();
      ui.h('The packaging test lab');
      ui.p('Packaging has a job to do. Three test rigs, three questions: which board <b>protects</b>, which keeps food <b>hot</b>, and which is <b>stiff but light</b>? For each rig, <b>predict first</b>, then test.');
      ui.p('The rigs only show you <b>what happens</b>. Working out <b>why</b> is your job!', 'small');

      const predOf = (id) => () => (item(id) || {}).answer || '';
      let notes = null, lam = null;
      const tried = (id) => { const it = item(id); return it && it.concl && (it.concl.ok || it.concl.tries >= 3); };
      const lamDone = () => { const it = item('p07.laminate'); return it && (it.correct === true || it.attempts >= 3); };
      const unlock = () => { if (notes && ['p07.drop', 'p07.hot', 'p07.stiff'].every(tried) && lamDone()) notes.classList.remove('peek-lock'); };

      const rig = (n, title, sub, predict, build) => {
        const d = ui.el('div', 'box p07-st'); requestAnimationFrame(() => Ink.frame(d));
        ui.el('span', 'tag', 'Rig ' + n, d); ui.el('h2', '', title, d); ui.el('p', '', sub, d);
        const body = document.createElement('div'); body.className = 'p07-body';
        if (!predOf(predict.id)()) body.classList.add('p07-wait');
        d.appendChild(ui.predict(Object.assign({ onPick: () => body.classList.remove('p07-wait') }, predict)));
        d.appendChild(body);
        build(ui, root, body, predOf(predict.id), unlock);
      };

      rig(1, 'Drop test', 'A raw egg is packed in a box made from each board. The box is dropped from higher and higher until the egg cracks.',
        { id: 'p07.drop-predict', label: 'Predict: which box protects the egg from the highest drop?', q: '<b>Predict:</b> which box will protect the egg from the <b>highest</b> drop?', options: ['Duplex board', 'Corrugated card', 'Foil lined board', 'Solid white board'] }, dropRig);

      rig(2, 'Keep it hot', 'Three hot takeaway meals, all at 75 °C, each under a lid made from a different board. A probe reads the temperature of each meal.',
        { id: 'p07.hot-predict', label: 'Predict: which lid keeps the meal hottest after 20 min?', q: '<b>Predict:</b> after 20 minutes, which lid will have kept its meal the <b>hottest</b>?', options: ['Solid white board', 'Foil lined board', 'Duplex board', 'No difference: all the same'] }, hotRig);

      rig(3, 'Bridge test', 'Four strips, all the same size, bridge a gap. Load each one with 100 g weights until it gives way. The balance shows what the strip itself weighs.',
        { id: 'p07.stiff-predict', label: 'Predict: which strip holds the most weight?', q: '<b>Predict:</b> which strip will hold the <b>most</b> weight before it gives way?', options: ['Solid white board', 'Foam core board', 'Duplex board', 'Corrugated card'] }, stiffRig);

      ui.h('One more layer', { size: 40 });
      ui.p('Boards can be <span class="key">laminated</span>: layered with another material to add a property the card does not have on its own.');
      lam = ui.mcq({ id: 'p07.laminate', label: 'Why laminate a juice carton with polythene and foil?', q: 'A <b>juice carton</b> is card laminated with a polythene film and a thin layer of aluminium foil. Why add those layers?',
        options: [
          { t: 'Polythene makes it waterproof and foil is a barrier to oxygen', ok: true, why: 'Yes! Card alone would soak up the juice. Polythene film makes it waterproof, and foil is a barrier against moisture and oxygen.' },
          { t: 'Polythene makes it stiffer and foil makes it easier to print', mis: 'foil-purpose', why: 'The card already gives the stiffness and the printing surface. Think about what card cannot do when it is full of liquid.' },
          { t: 'Polythene keeps the juice cold and foil is there for decoration', mis: 'foil-purpose', why: 'The foil is hidden inside the carton, so it is not decoration. Think about what card cannot do when it is full of liquid.' },
          { t: 'Polythene helps the card to rot and foil makes the carton lighter', mis: 'foil-purpose', why: 'Extra layers add a little weight, and they are not there to help it rot. Think about what card cannot do when it is full of liquid.' },
        ] });
      lam.addEventListener('click', () => setTimeout(unlock, 60));

      ui.p('<span class="small">The lab notes un-blur when you have finished all three rigs and the question above.</span>');
      notes = ui.box('<b>Corrugated card</b>: a fluted layer between two liners. It absorbs impacts and is strong and stiff for its weight (best with the flutes running along the span). <b>Foil lined board</b>: the foil reflects heat, so food stays hot, and it is a barrier against moisture and oxygen. <b>Foam core board</b>: polystyrene foam between two sheets of card: rigid and very lightweight, but it dents easily. <b>Laminating</b> adds a property: foil (barrier) or polythene film (waterproof).', { tag: 'Lab notes' });
      notes.classList.add('peek-lock'); unlock();
    },
  });
})();
