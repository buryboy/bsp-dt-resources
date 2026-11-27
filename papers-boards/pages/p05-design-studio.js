// Page 5 — A day in the design studio. Follow a designer developing a desk lamp from first sketches to the
// presentation board. At each of six steps the student hands her a sheet of paper; her pen then draws on it, and a
// wrong paper visibly goes wrong (can't see through, lines drift, ink bleeds, paper wrinkles). Ends with a 2-mark
// written explanation.
(function () {
  'use strict';
  const B = Ink.BLUE, RD = Ink.RED, GR = Ink.GREEN, rgba = Ink.rgba, geo = Ink.geo;
  const HANDF = (s) => `400 ${s}px "Gloria Hallelujah", "Comic Sans MS", cursive`;
  const LABF = (s) => `600 ${s}px Fredoka, "Arial Rounded MT Bold", system-ui, sans-serif`;
  const W = 940, HH = 420, SX = 190, SY = 30, SW = 560, SH = 356;
  const ORANGE = [236, 124, 28], TEAL = [40, 150, 160], YEL = [246, 200, 50];
  const close = (P) => P.concat([P[0]]);
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));

  // fill = how the sheet looks; its alpha is what hides (or shows) a drawing underneath
  const PAPERS = [
    { k: 'layout', name: 'Layout', fill: 'rgba(255,255,255,0.62)', spread: 0.35 },
    { k: 'tracing', name: 'Tracing', fill: 'rgba(214,225,234,0.2)', spread: 0.25 },
    { k: 'bleed', name: 'Bleed proof', fill: 'rgba(255,255,255,0.93)', spread: 0 },
    { k: 'cart', name: 'Cartridge', fill: 'rgba(247,241,224,1)', spread: 0.8 },
    { k: 'grid', name: 'Grid', fill: 'rgba(255,255,255,0.96)', spread: 1 },
  ];
  const PK = {}; PAPERS.forEach((p) => (PK[p.k] = p));
  const N = (k) => PK[k].name + ' paper';

  // out = what the student sees happen: ok | cost | lines | blind | faint | nogrid | bleed | cockle
  const STEPS = [
    { time: '9:00 am', title: 'First ideas', ok: 'layout',
      story: 'New brief: a <b>desk lamp</b>. Maya wants to scribble <b>twenty quick ideas</b> before coffee. Most of the sheets will end up in the bin.',
      good: 'Layout paper is thin, lightweight and cheap, and it takes pencil and marker: just right for lots of quick sketches.',
      wrong: {
        tracing: ['cost', 'It works, but twenty sheets cost more than they need to. Which thin paper is the cheap one made for sketching?', 'layout-vs-tracing'],
        bleed: ['cost', 'A specially coated paper is wasted on throwaway sketches. Which paper is thin and cheap?', 'paper-mixup'],
        cart: ['cost', 'Thick, good-quality paper is wasted on twenty throwaway sketches. Which paper is thin and cheap?', 'paper-mixup'],
        grid: ['lines', 'The printed lines get in the way of fast, free sketching. Which plain paper is thin and cheap?', 'paper-mixup'],
      } },
    { time: '9:40 am', title: 'Develop the best idea', ok: 'layout',
      story: 'Idea 3 is the winner. Maya lays a <b>fresh sheet on top</b> of it and redraws it with improvements. She will do this a dozen times, sheet after sheet.',
      good: 'Layout paper is translucent: Maya can see idea 3 through it, keep the good parts and change the rest.',
      wrong: {
        tracing: ['cost', 'She can see idea 3 clearly, so it works. But for a dozen rough sheets designers use the cheap translucent paper. Which is that?', 'layout-vs-tracing'],
        bleed: ['blind', 'Maya can hardly see idea 3 through this sheet, so the new drawing wanders off. Which cheap paper can she see through?', 'paper-mixup'],
        cart: ['blind', 'This sheet is thick and opaque: idea 3 has vanished, so the new drawing wanders off. Which cheap paper can she see through?', 'paper-mixup'],
        grid: ['blind', 'Maya can hardly see idea 3 through this sheet, so the new drawing wanders off. Which cheap paper can she see through?', 'paper-mixup'],
      } },
    { time: '11:00 am', title: 'Copy the logo', ok: 'tracing',
      story: 'The client\'s logo goes on the lamp. It has to be <b>copied exactly</b>: every fine line, nothing missed.',
      good: 'Tracing paper is transparent, so every fine line shows through clearly for an exact copy.',
      wrong: {
        layout: ['faint', 'Through this sheet the logo is only faint, so the fine lines get missed. Which paper gives a really clear view?', 'layout-vs-tracing'],
        bleed: ['blind', 'Maya can hardly see the logo through this sheet. Which paper gives a really clear view?', 'paper-mixup'],
        cart: ['blind', 'This sheet is thick and opaque: the logo has vanished. Which paper gives a really clear view?', 'paper-mixup'],
        grid: ['blind', 'Maya can hardly see the logo through this sheet. Which paper gives a really clear view?', 'paper-mixup'],
      } },
    { time: '1:30 pm', title: 'Working drawing', ok: 'grid',
      story: 'The workshop needs an accurate <b>3D (isometric) drawing, to scale</b>: every edge at the right angle and the right length.',
      good: 'Grid paper is printed with faint isometric (or square) lines as a guide, so the drawing is accurate and to scale.',
      wrong: {
        layout: ['nogrid', 'With no guide lines to follow, the angles and lengths drift. Which paper has guide lines printed on it?', 'paper-mixup'],
        tracing: ['nogrid', 'With no guide lines to follow, the angles and lengths drift. Which paper has guide lines printed on it?', 'paper-mixup'],
        bleed: ['nogrid', 'With no guide lines to follow, the angles and lengths drift. Which paper has guide lines printed on it?', 'paper-mixup'],
        cart: ['nogrid', 'With no guide lines to follow, the angles and lengths drift. Which paper has guide lines printed on it?', 'paper-mixup'],
      } },
    { time: '3:00 pm', title: 'Render it in colour', ok: 'bleed',
      story: 'Time to colour the final design with <b>marker pens</b>. The colour must be flat and even, with sharp edges.',
      good: 'Bleed proof paper is coated, so marker ink stays on the surface: it does not spread or soak through.',
      wrong: {
        layout: ['bleed', 'The marker ink has crept over the lines. Which paper is coated to keep marker ink where it is put?', 'bleed-meaning'],
        tracing: ['bleed', 'The marker colour is streaky and has crept over the lines. Which paper is coated to keep marker ink where it is put?', 'bleed-meaning'],
        cart: ['bleed', 'The ink has soaked into the paper and spread over the lines. Which paper is coated to keep marker ink where it is put?', 'bleed-meaning'],
        grid: ['bleed', 'The ink has spread and soaked right through. Which paper is coated to keep marker ink where it is put?', 'bleed-meaning'],
      } },
    { time: '4:30 pm', title: 'Presentation board', ok: 'cart',
      story: 'For the client\'s presentation board, Maya makes a picture of the lamp glowing in a room, in <b>watercolour and pastel</b>.',
      good: 'Cartridge paper is thick, with a slightly textured surface that grips pastel, pencil, ink and watercolour.',
      wrong: {
        layout: ['cockle', 'This thin sheet has wrinkled under the wet paint, and the pastel will not grip. Which paper is thick and slightly textured?', 'paper-mixup'],
        tracing: ['cockle', 'This thin, hard sheet has wrinkled under the wet paint, and the pastel skids off. Which paper is thick and slightly textured?', 'paper-mixup'],
        bleed: ['cockle', 'This thin, smooth sheet has wrinkled under the wet paint, and the pastel will not grip. Which paper is thick and slightly textured?', 'paper-mixup'],
        grid: ['cockle', 'This thin sheet has wrinkled under the wet paint, and the pastel will not grip. Which paper is thick and slightly textured?', 'paper-mixup'],
      } },
  ];

  function css() {
    if (document.getElementById('p05-css')) return;
    const s = document.createElement('style'); s.id = 'p05-css';
    s.textContent = `
      .p05-st { position: relative; margin: 0 0 calc(var(--R) * 1.4); padding: 14px 18px 16px; background: rgba(251,250,245,.9); }
      .p05-top { position: relative; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 4px; }
      .p05-top .tag { font: 700 14px Fredoka; letter-spacing: .08em; text-transform: uppercase; color: var(--red); flex: 1 1 auto; }
      .p05-dots { display: flex; gap: 6px; }
      .p05-dots i { width: 30px; height: 30px; border-radius: 50%; border: 2px solid rgba(30,46,150,.45); font: 600 15px/26px Fredoka; text-align: center; font-style: normal; background: #fff; }
      .p05-dots i.now { border-color: var(--ink); background: #eef1ff; transform: scale(1.12); }
      .p05-dots i.done { border-color: var(--green); background: #e6f6ea; color: var(--green); }
      .p05-st h2 { position: relative; margin: 0 0 2px; }
      .p05-st h2 small { font: 600 17px Fredoka; color: var(--red); margin-right: 8px; }
      .p05-story { position: relative; margin: 0 0 8px !important; line-height: 1.5; font-size: 19px; min-height: 56px; }
      .p05-cv { position: relative; display: block; width: 100%; height: auto; user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; }
      .p05-ask { position: relative; font: 600 17px Fredoka; margin: 8px 0 4px; }
      .p05-pick { position: relative; display: flex; flex-wrap: wrap; gap: 8px; }
      .p05-pick .opt { flex: 1 1 110px; text-align: center; min-height: 50px; padding: 6px 6px; font-size: 18px; }
      .p05-fb { position: relative; min-height: 56px; font-size: 18.5px; line-height: 1.45; margin: 10px 0 0; }
      .p05-st .btn { position: relative; margin-top: 4px; }
      @media (max-width: 760px) { .p05-st { padding: 12px 10px 14px; } .p05-pick .opt { flex-basis: 30%; } }
    `;
    document.head.appendChild(s);
  }

  const text = (x, s, px, py, o = {}) => { x.save(); x.font = (o.font === 'lab' ? LABF : HANDF)(o.size || 24); x.fillStyle = rgba(o.color || B, o.a ?? 0.92); x.textAlign = o.align || 'left'; x.translate(px, py); if (o.rot) x.rotate(o.rot); x.fillText(s, 0, 0); x.restore(); };
  const path = (x, P) => { x.beginPath(); P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); };
  const plen = (P) => { let L = 0; for (let i = 1; i < P.length; i++) L += Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); return L; };
  // draw a list of pen strokes up to progress p (0..1); returns the pen tip while drawing
  function seq(x, list, p, o = {}) {
    const Ls = list.map(plen), T = Ls.reduce((a, b) => a + b, 0); let d = p * T, tip = null;
    for (let i = 0; i < list.length; i++) {
      if (d <= 0) break;
      const q = Math.min(1, d / Ls[i]);
      const e = Ink.stroke(x, list[i], Object.assign({ w: 2.6, seed: 7 + i * 13 + (o.seed || 0), amp: 0.7 }, o, { p: q }));
      if (q < 1) tip = e; d -= Ls[i];
    }
    return p < 1 ? tip || list[0][0] : null;
  }
  // a desk lamp as pen strokes. v: bend, h (height), shade: cone | dome | box | ball, sw (switch)
  function lamp(cx, by, s, v = {}) {
    const bend = v.bend ?? 1, h = v.h ?? 1, L = [];
    const j = [cx - 34 * s * bend, by - 112 * s * h], top = [cx + 44 * s, by - 190 * s * h];
    const base = geo.ellipse(cx, by, 54 * s, 14 * s);
    L.push(base, [[cx - 4 * s, by - 9 * s], j, top], geo.ellipse(j[0], j[1], 7 * s, 7 * s));
    let shade;
    if (v.shade === 'dome') { shade = geo.ellipse(top[0] + 26 * s, top[1] + 30 * s, 52 * s, 44 * s, Math.PI, Math.PI * 2); shade.push(shade[0]); }
    else if (v.shade === 'box') shade = [[top[0] - 26 * s, top[1] - 12 * s], [top[0] + 62 * s, top[1] - 12 * s], [top[0] + 62 * s, top[1] + 40 * s], [top[0] - 26 * s, top[1] + 40 * s], [top[0] - 26 * s, top[1] - 12 * s]];
    else if (v.shade === 'ball') shade = geo.ellipse(top[0] + 18 * s, top[1] + 18 * s, 38 * s, 38 * s);
    else shade = [[top[0] - 12 * s, top[1] - 14 * s], [top[0] + 20 * s, top[1] - 24 * s], [top[0] + 84 * s, top[1] + 36 * s], [top[0] - 34 * s, top[1] + 56 * s], [top[0] - 12 * s, top[1] - 14 * s]];
    L.push(shade);
    if (v.sw) L.push(geo.ellipse(cx + 22 * s, by - 2 * s, 9 * s, 4 * s));
    if (v.rays) [[-10, 78, -22, 112], [30, 70, 34, 108], [66, 56, 86, 88]].forEach(([a, b, c, d]) => L.push([[top[0] + a * s, top[1] + b * s], [top[0] + c * s, top[1] + d * s]]));
    return { L, shade, base, top };
  }
  // the client's logo: bold shapes plus fine detail
  function logo(cx, cy) {
    const big = [geo.ellipse(cx, cy, 104, 104)], fine = [];
    const star = []; for (let n = 0; n <= 10; n++) { const a = -Math.PI / 2 + (n * Math.PI) / 5, r = n % 2 ? 30 : 70; star.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); }
    big.push(star);
    fine.push(geo.ellipse(cx, cy, 88, 88));
    for (let n = 0; n < 16; n++) { const a = (n * Math.PI) / 8 + 0.2; fine.push([[cx + Math.cos(a) * 91, cy + Math.sin(a) * 91], [cx + Math.cos(a) * 102, cy + Math.sin(a) * 102]]); }
    fine.push(geo.ellipse(cx, cy + 4, 13, 13));
    return { big, fine };
  }
  // isometric block lamp. ax = [angle of i axis, angle of j axis, lean of verticals, scale] (true isometric: 30°, 30°, 0)
  function isoLamp(ox, oy, g, ax) {
    const ai = (ax[0] * Math.PI) / 180, aj = (ax[1] * Math.PI) / 180, lean = ax[2] || 0;
    const P = (i, j, k) => [ox + (i * Math.cos(ai) - j * Math.cos(aj)) * g + k * g * lean * (1 + i * 0.12), oy + (i * Math.sin(ai) + j * Math.sin(aj)) * g - k * g * (1 - Math.abs(lean) * (0.3 + j * 0.1))];
    const box = (i0, j0, k0, di, dj, dk, noTop) => { const i1 = i0 + di, j1 = j0 + dj, k1 = k0 + dk, o = [];
      if (!noTop) o.push([P(i0, j0, k1), P(i1, j0, k1), P(i1, j1, k1), P(i0, j1, k1), P(i0, j0, k1)]);
      o.push([P(i1, j0, k1), P(i1, j0, k0), P(i1, j1, k0), P(i0, j1, k0), P(i0, j1, k1)], [P(i1, j1, k1), P(i1, j1, k0)]); return o; };
    return [...box(0, 0, 0, 5, 4, 1), ...box(0, 0, 1, 1, 1, 4, true), ...box(0, 0, 5, 4, 1, 1)];
  }

  Book.page({
    id: 'p05',
    title: 'A day in the design studio',
    build(ui, root) {
      css();
      ui.h('A day in the design studio', { size: 48 });
      ui.p('Maya is a product designer. Today she takes a new product from <b>first scribbles</b> to the <b>presentation board</b>. At each step, <b>hand her the right paper</b> and watch what her pen does on it.');

      const st = ui.el('div', 'p05-st'); requestAnimationFrame(() => Ink.frame(st));
      const top = ui.el('div', 'p05-top', '<span class="tag">Maya\'s studio</span>', st), dots = ui.el('div', 'p05-dots', '', top);
      const dotEls = STEPS.map((s, i) => ui.el('i', '', String(i + 1), dots));
      const h2 = ui.el('h2', '', '', st), story = ui.el('p', 'p05-story', '', st);
      const c = document.createElement('canvas'); c.className = 'p05-cv'; st.appendChild(c);
      const dpr = Math.min(2, window.devicePixelRatio || 1); c.width = W * dpr; c.height = HH * dpr; c.style.aspectRatio = W + ' / ' + HH;
      const x = c.getContext('2d');
      const ask = ui.el('div', 'p05-ask', 'Hand Maya a sheet of…', st), pick = ui.el('div', 'p05-pick', '', st);
      const fb = ui.el('div', 'p05-fb', '', st);
      const next = ui.el('button', 'btn', 'Next job ▸', st); next.type = 'button';

      const rec = ui.record('p05.steps', { label: 'Design studio story: right paper handed over first time (6 steps)', type: 'game', max: 6 });
      const prev = rec.get() || {};
      const log = STEPS.map((s, i) => ((prev.log && prev.log[i]) || []).slice());
      const solved = (i) => log[i].length && log[i][log[i].length - 1] === STEPS[i].ok;
      let step = STEPS.findIndex((s, i) => !solved(i)); if (step < 0) step = STEPS.length;
      let cur = null; // { paper, out, t0, done }
      const DUR = 3.0;

      const btns = PAPERS.map((p) => { const b = ui.el('button', 'opt', p.name, pick); b.type = 'button'; b.onclick = () => choose(p.k); return b; });
      function commit() {
        const score = STEPS.filter((s, i) => log[i][0] === s.ok).length, all = STEPS.every((s, i) => solved(i)), mis = [];
        STEPS.forEach((s, i) => log[i].forEach((k) => { if (k !== s.ok && !mis.includes(s.wrong[k][2])) mis.push(s.wrong[k][2]); }));
        rec.set({ answer: STEPS.map((s, i) => (log[i].length ? `${i + 1} ${s.title}: ` + log[i].map((k) => PK[k].name + (k === s.ok ? ' ✓' : ' ✗')).join(', ') : '')).filter(Boolean).join(' | '), correct: all ? score === 6 : null, score, max: 6, mis: mis.join(','), log });
      }
      function choose(k) {
        if (step >= STEPS.length || (cur && !cur.done) || solved(step)) return;
        const s = STEPS[step], ok = k === s.ok;
        log[step].push(k); commit();
        cur = { paper: k, out: ok ? 'ok' : s.wrong[k][0], t0: performance.now() / 1000, done: false, ok };
        btns.forEach((b) => (b.disabled = true)); fb.innerHTML = ''; fb.className = 'p05-fb';
        Book.sfx('paper', { gain: 0.5 }); setTimeout(() => Book.sfx('stroke', { material: 'pen', dur: 1.6, gain: 0.4 }), 350);
        go();
      }
      function finishAnim() {
        const s = STEPS[step], k = cur.paper;
        cur.done = true;
        if (cur.ok) { Book.sfx('success', { gain: 0.35 }); fb.className = 'p05-fb fb on good'; fb.innerHTML = '✓ ' + s.good; next.style.visibility = 'visible'; next.textContent = step === STEPS.length - 1 ? 'Finish the day ▸' : 'Next job ▸'; dotEls[step].classList.add('done'); dotEls[step].textContent = '✓'; }
        else { Book.sfx('error', { gain: 0.35 }); fb.className = 'p05-fb fb on bad'; fb.innerHTML = '✗ <b>' + N(k) + '</b>: ' + s.wrong[k][1]; btns.forEach((b, i) => { b.disabled = log[step].includes(PAPERS[i].k); b.classList.toggle('wrong', b.disabled); }); }
      }
      function showStep() {
        cur = null; next.style.visibility = 'hidden'; fb.innerHTML = ''; fb.className = 'p05-fb';
        dotEls.forEach((d, i) => { d.classList.toggle('now', i === step); if (i < step) { d.classList.add('done'); d.textContent = '✓'; } });
        if (step >= STEPS.length) {
          h2.innerHTML = '<small>5:30 pm</small>Home time';
          story.innerHTML = 'Six jobs, and each one needed its own paper. The lamp goes to the client tomorrow. Now explain one of Maya\'s choices in your own words below.';
          ask.style.display = pick.style.display = 'none'; next.style.display = 'none';
          const first = STEPS.filter((s, i) => log[i][0] === s.ok).length;
          fb.className = 'p05-fb fb on good'; fb.innerHTML = `You handed Maya the right paper first time on <b>${first} of 6</b> jobs.`;
        } else {
          const s = STEPS[step];
          h2.innerHTML = `<small>${s.time}</small>${s.title}`; story.innerHTML = s.story;
          btns.forEach((b, i) => { b.disabled = log[step].includes(PAPERS[i].k); b.classList.toggle('wrong', b.disabled); });
        }
        go();
      }
      next.onclick = () => { step++; Book.sfx('paper', { gain: 0.5 }); showStep(); };

      // ------------------------------------------------------------------ drawing
      const SHEET = geo.rect(SX, SY, SW, SH, 6), cxm = SX + SW / 2;
      function sheet(k, opt = {}) {
        const p = PK[k];
        x.save(); x.globalCompositeOperation = 'source-over';
        Ink.hatchShadow(x, SHEET, 1, k === 'cart' ? 10 : 6, k === 'cart' ? 10 : 6);
        x.fillStyle = p.fill; path(x, SHEET); x.fill();
        x.globalCompositeOperation = 'multiply';
        x.save(); path(x, SHEET); x.clip();
        if (k === 'grid' && opt.iso) { x.strokeStyle = rgba(B, 0.2); x.lineWidth = 1; x.beginPath(); const g = 26, c30 = Math.cos(Math.PI / 6) * g, s30 = g / 2; for (let u = SX % c30; u < W; u += c30) { x.moveTo(u, SY); x.lineTo(u, SY + SH); } for (let v = -40; v < 60; v++) { const y0 = SY + v * g; x.moveTo(SX - 10, y0); x.lineTo(SX + SW + 10, y0 + ((SW + 20) / c30) * s30); x.moveTo(SX - 10, y0); x.lineTo(SX + SW + 10, y0 - ((SW + 20) / c30) * s30); } x.stroke(); }
        else if (k === 'grid') { x.strokeStyle = rgba(B, 0.2); x.lineWidth = 1; x.beginPath(); for (let u = SX + 20; u < SX + SW; u += 20) { x.moveTo(u, SY); x.lineTo(u, SY + SH); } for (let v = SY + 20; v < SY + SH; v += 20) { x.moveTo(SX, v); x.lineTo(SX + SW, v); } x.stroke(); }
        if (k === 'cart') { const r = H.rng(5); x.fillStyle = rgba(B, 0.12); for (let n = 0; n < 1500; n++) { x.beginPath(); x.arc(SX + r() * SW, SY + r() * SH, 0.9, 0, 7); x.fill(); } }
        if (k === 'tracing') { x.strokeStyle = rgba(B, 0.22); x.lineWidth = 1.6; x.beginPath(); x.moveTo(SX + 24, SY + 70); x.lineTo(SX + 70, SY + 20); x.moveTo(SX + 34, SY + 96); x.lineTo(SX + 100, SY + 24); x.stroke(); }
        if (opt.cockle) { x.strokeStyle = rgba(B, 0.28); x.lineWidth = 1.5; for (let n = 0; n < 7; n++) { x.beginPath(); for (let u = 0; u <= SW; u += 8) { const y = SY + 30 + n * 50 + Math.sin(u * 0.045 + n * 1.7) * 9 + Math.sin(u * 0.11 + n) * 4; u ? x.lineTo(SX + u, y) : x.moveTo(SX + u, y); } x.stroke(); } }
        x.restore();
        Ink.stroke(x, opt.cockle ? geo.wob(geo.seg(SHEET, 3), 5, 3.2, 0.06) : SHEET, { w: k === 'cart' ? 3.2 : 2.4, seed: 23, amp: 0.5 });
        x.restore();
        text(x, p.name.toLowerCase() + ' paper', SX - 16, SY + SH - 8, { size: 24, a: 0.6, rot: -Math.PI / 2 });
      }
      // the sheet underneath (steps 2 and 3), drawn in full strength; the top sheet's own fill then hides it
      function under(i) {
        if (i !== 1 && i !== 2) return;
        x.save(); x.translate(cxm, SY + SH / 2); x.rotate(-0.035); x.translate(-cxm, -(SY + SH / 2));
        const U = geo.rect(SX - 14, SY + 4, SW, SH, 6);
        x.globalCompositeOperation = 'source-over'; x.fillStyle = 'rgba(255,255,255,.9)'; path(x, U); x.fill();
        x.globalCompositeOperation = 'multiply'; Ink.stroke(x, U, { w: 2, seed: 31, amp: 0.5, retrace: false });
        if (i === 1) { seq(x, lamp(cxm - 10, SY + 300, 1.25, { shade: 'dome', bend: 1 }).L, 1, { w: 4.2, seed: 40 }); text(x, 'idea 3', SX + 22, SY + 46, { size: 24 }); }
        else { const g = logo(cxm, SY + SH / 2 + 4); seq(x, g.big, 1, { w: 4.4, seed: 50 }); seq(x, g.fine, 1, { w: 2.4, seed: 60, retrace: false }); }
        x.restore();
      }
      function marker(px, py) { x.save(); x.globalCompositeOperation = 'source-over'; x.translate(px, py); x.rotate(-0.9); x.fillStyle = rgba(ORANGE, 1); x.fillRect(-2, -6, 16, 12); x.fillStyle = '#2b2f3a'; x.beginPath(); x.roundRect(14, -12, 120, 24, 6); x.fill(); x.fillStyle = rgba(ORANGE, 1); x.fillRect(108, -12, 14, 24); x.restore(); }
      const note = (s, py, col = RD) => text(x, s, cxm, SY + SH + 29, { size: 27, color: col, align: 'center' });
      const tick = () => Ink.tick(x, SX + SW - 60, SY + 54, 1.5);
      // flat marker colour inside a shape (crisp), or creeping over its edge (spread > 0)
      function colour(P, col, p, spread, seed) {
        if (p <= 0) return;
        let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; P.forEach(([a, b]) => { x0 = Math.min(x0, a); x1 = Math.max(x1, a); y0 = Math.min(y0, b); y1 = Math.max(y1, b); });
        const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, r = H.rng(seed);
        let Q = P;
        if (spread) Q = geo.seg(P, 5).map(([a, b], n) => { const d = Math.hypot(a - cx, b - cy) || 1, o = 3 + spread * (9 + 13 * (0.5 + 0.5 * Math.sin(n * 0.9 + seed)) + r() * 10); return [a + ((a - cx) / d) * o, b + ((b - cy) / d) * o]; });
        const m = 40 * spread + 4, wv = (x1 - x0 + 2 * m) * p;
        x.save(); x.globalCompositeOperation = 'multiply'; path(x, Q); x.clip();
        x.fillStyle = rgba(col, 0.72); x.fillRect(x0 - m, y0 - m, wv, y1 - y0 + 2 * m);
        x.strokeStyle = rgba(col, 0.22); x.lineWidth = 5; x.beginPath(); for (let u = x0 - m + 9; u < x0 - m + wv; u += 15) { x.moveTo(u, y0 - m); x.lineTo(u - 8, y1 + m); } x.stroke();
        x.restore();
        if (spread) { x.save(); x.globalCompositeOperation = 'multiply'; x.strokeStyle = rgba(col, 0.6); const r2 = H.rng(seed + 3);
          geo.seg(P, 4).forEach(([a, b]) => { if (a > x0 - m + wv || !r2.chance(0.5)) return; const d = Math.hypot(a - cx, b - cy) || 1, l = 8 + r2() * 30 * spread; x.lineWidth = 0.8 + r2() * 1.6; x.beginPath(); x.moveTo(a, b); x.lineTo(a + ((a - cx) / d) * l + r2.range(-5, 5), b + ((b - cy) / d) * l + r2.range(-5, 5)); x.stroke(); }); x.restore(); }
      }

      // the scene for step i, with paper k (null = waiting for a paper), outcome out, at progress p
      function scene(i, k, out, p) {
        let tip = null, mk = null;
        under(i);
        if (!k) {
          // waiting: what is on the desk, and where the sheet will go
          x.save(); x.globalCompositeOperation = 'multiply'; x.setLineDash([10, 9]); x.strokeStyle = rgba(B, 0.5); x.lineWidth = 2; path(x, SHEET); x.stroke(); x.restore();
          if (i === 4) seq(x, lamp(cxm - 20, SY + 306, 1.3, { shade: 'cone', sw: true, h: 1.02 }).L, 1, { w: 3 });
          if (i !== 1 && i !== 2 && i !== 4) text(x, 'which paper?', cxm, SY + SH / 2 + 8, { size: 30, align: 'center', a: 0.55 });
          return null;
        }
        const end = p >= 1;
        if (i === 4 || i === 5) sheet(k, { cockle: i === 5 && out === 'cockle' && p > 0.45 }); else sheet(k, { iso: i === 3 });
        x.save(); x.globalCompositeOperation = 'multiply';
        if (i === 0) {
          const V = [{ shade: 'cone' }, { shade: 'ball', bend: -0.6 }, { shade: 'dome', bend: 1 }, { shade: 'box', bend: 0.2, h: 0.9 }], all = [];
          V.forEach((v, n) => all.push(...lamp(SX + 80 + n * 132, SY + 250 - (n % 2) * 26, 0.62, v).L));
          tip = seq(x, all, p, { w: 2.4 });
          V.forEach((v, n) => { if (p > (n + 0.9) / 4) text(x, String(n + 1), SX + 50 + n * 132, SY + 300 - (n % 2) * 26, { size: 24 }); });
          if (end) { if (out === 'ok') { tick(); note('20 ideas, hardly any cost', SY + 46, GR); } else if (out === 'cost') note('£££  …for sketches going in the bin?', SY + 46); else note('the printed lines get in the way', SY + 46); }
        } else if (i === 1) {
          const blind = out === 'blind', L = lamp(cxm - 10 + (blind ? 64 : 0), SY + 300 + (blind ? 22 : 0), 1.25, { shade: 'cone', bend: 1.25, h: 1.06, sw: true, rays: true }).L;
          if (blind) { x.translate(cxm, SY + 200); x.rotate(0.13); x.translate(-cxm, -(SY + 200)); }
          tip = seq(x, L, p, { w: 2.8, seed: 90 });
          if (blind) x.setTransform(dpr, 0, 0, dpr, 0, 0);
          if (end) { if (out === 'ok') { tick(); note('new shade, taller arm, a switch', SY + 44, GR); } else if (out === 'cost') note('works…  but £££ × 12 sheets', SY + 44); else note('where has idea 3 gone?', SY + 44); }
        } else if (i === 2) {
          const g = logo(cxm, SY + SH / 2 + 4);
          if (out === 'blind') { const P = geo.wob(geo.ellipse(cxm + 50, SY + SH / 2 + 26, 92, 80), 9, 9, 0.02); tip = seq(x, [P, [[cxm + 20, SY + 190], [cxm + 84, SY + 230], [cxm + 30, SY + 262]]], p, { w: 2.6 }); }
          else if (out === 'faint') tip = seq(x, g.big, p, { w: 2.6, seed: 71 });
          else tip = seq(x, [...g.big, ...g.fine], p, { w: 2.4, seed: 71 });
          if (end) { if (out === 'ok') { tick(); note('an exact copy', SY + SH - 14, GR); }
            else if (out === 'faint') { Ink.stroke(x, geo.ellipse(cxm + 96, SY + SH / 2 - 30, 26, 26), { color: RD, w: 2.6 }); Ink.stroke(x, geo.ellipse(cxm, SY + SH / 2 + 8, 24, 24), { color: RD, w: 2.6 }); note('fine lines missed', SY + SH - 14); }
            else note('guessing: can\'t see the logo', SY + SH - 14); }
        } else if (i === 3) {
          const good = out === 'ok', L = isoLamp(cxm - 20, SY + 210, 26, good ? [30, 30, 0] : [21, 39, 0.07]);
          tip = seq(x, L, p, { w: 2.8, seed: 12, amp: good ? 0.35 : 1.6 });
          if (end) { if (good) { tick(); note('every line follows the grid', SY + SH - 16, GR); } else { text(x, '?', cxm + 190, SY + 120, { size: 54, color: RD }); note('angles and lengths have drifted', SY + SH - 16); } }
        } else if (i === 4) {
          const M = lamp(cxm - 20, SY + 306, 1.3, { shade: 'cone', sw: true, h: 1.02 }), sp = PK[k].spread;
          x.restore(); x.save();
          const q1 = clamp(p / 0.55), q2 = clamp((p - 0.55) / 0.45);
          colour(M.shade, ORANGE, q1, sp, 3); colour(M.base, TEAL, q2, sp, 8);
          x.globalCompositeOperation = 'multiply';
          seq(x, M.L, 1, { w: 3 });
          if (!end) { let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; (p < 0.55 ? M.shade : M.base).forEach(([a, b]) => { x0 = Math.min(x0, a); x1 = Math.max(x1, a); y0 = Math.min(y0, b); y1 = Math.max(y1, b); }); const q = p < 0.55 ? q1 : q2; mk = [x0 + (x1 - x0) * q, (y0 + y1) / 2 + Math.sin(p * 60) * (y1 - y0) * 0.4]; }
          if (end) { if (out === 'ok') { tick(); note('flat colour, sharp edges', SY + 44, GR); } else note('the ink has bled over the lines!', SY + 44); }
        } else if (i === 5) {
          const bad = out === 'cockle', M = lamp(cxm - 70, SY + 300, 1.2, { shade: 'cone', h: 1.02 }), T = M.top, s = 1.2;
          x.restore(); x.save(); x.globalCompositeOperation = 'multiply';
          // watercolour: the glow of the lamp and a wall wash
          const q1 = clamp(p / 0.4), q2 = clamp((p - 0.35) / 0.35), q3 = clamp((p - 0.65) / 0.35);
          const cone = [[T[0] - 34 * s, T[1] + 56 * s], [T[0] + 84 * s, T[1] + 36 * s], [T[0] + 250 * s, SY + 318], [T[0] - 120 * s, SY + 318]];
          if (!bad) { x.globalAlpha = q1; x.fillStyle = rgba(YEL, 0.5); path(x, cone); x.fill(); x.fillStyle = rgba(TEAL, 0.16); x.fillRect(SX + 24, SY + 22, SW - 48, 296 * q1); x.globalAlpha = 1; }
          else { const r = H.rng(4); x.globalAlpha = q1; for (let n = 0; n < 9; n++) { const bx = T[0] - 80 + r() * 330, by = T[1] + 60 + r() * 150, P = geo.wob(geo.ellipse(bx, by, 26 + r() * 40, 18 + r() * 26), n, 7, 0.05); x.fillStyle = rgba(YEL, 0.3 + r() * 0.3); path(x, P); x.fill(); x.strokeStyle = rgba([190, 140, 20], 0.6); x.lineWidth = 1.6; path(x, P); x.stroke(); } x.globalAlpha = 1; }
          // table and lamp in ink
          tip = seq(x, [[[SX + 30, SY + 318], [SX + SW - 30, SY + 318]], ...M.L], q2, { w: 2.8, seed: 5 });
          // pastel on the shade: grainy on a textured sheet, thin and patchy on a smooth one
          if (q3 > 0) { const r = H.rng(9); x.save(); path(x, M.shade); x.clip(); x.fillStyle = rgba(ORANGE, bad ? 0.35 : 0.8); const n = (bad ? 160 : 1500) * q3; for (let d = 0; d < n; d++) { x.beginPath(); x.arc(T[0] - 40 + r() * 170, T[1] - 30 + r() * 110, 1 + r() * 1.6, 0, 7); x.fill(); } x.restore(); if (!end) tip = [T[0] - 30 + q3 * 110, T[1] + 10 + Math.sin(p * 70) * 26]; }
          if (end) { if (!bad) { tick(); note('paint and pastel both grip', SY + 44, GR); } else note('wrinkled by the paint; pastel won\'t grip', SY + 44); }
        }
        x.restore();
        if (mk) marker(mk[0], mk[1]); else if (tip && !end) Ink.pen(x, tip[0], tip[1]);
        return null;
      }

      let raf = 0;
      const hidden = () => { const p = c.closest('.page'); return !p || p.classList.contains('hidden'); };
      function frame(now) {
        raf = 0;
        if (hidden()) { setTimeout(go, 400); return; }
        x.setTransform(dpr, 0, 0, dpr, 0, 0); x.globalCompositeOperation = 'source-over'; x.globalAlpha = 1; x.clearRect(0, 0, W, HH); x.lineCap = x.lineJoin = 'round';
        if (step >= STEPS.length) { scene(5, 'cart', 'ok', 1); return; }
        if (!cur) { scene(step, null); return; }
        const p = cur.done ? 1 : clamp((now / 1000 - cur.t0 - 0.3) / DUR);
        scene(step, cur.paper, cur.out, p);
        if (p >= 1 && !cur.done) finishAnim();
        if (!cur.done) go();
      }
      function go() { if (!raf) raf = requestAnimationFrame(frame); }
      if (document.fonts) document.fonts.ready.then(go);
      showStep();

      // ------------------------------------------------------------------ written explanation
      ui.el('h2', '', 'Explain it like a designer');
      ui.p('<span class="small">The studio blurs while you write: this one is from memory.</span>');
      const wr = ui.write({
        id: 'p05.explain', label: 'Explain why a designer uses layout paper when developing ideas [2]',
        q: '<b>Explain</b> why a designer uses <b>layout paper</b> when developing ideas.', marks: 2, lines: 4,
        scheme: [
          'It is thin / translucent, so a drawing underneath can be seen through it',
          '…so a design can be traced through and refined / improved without starting again',
          'It is cheap (and lightweight), so lots of ideas can be sketched quickly',
        ],
        model: 'Layout paper is thin and translucent, so the designer can lay a new sheet over a sketch, see it through the paper and trace it with improvements. It is also cheap, so many ideas can be sketched.',
      });
      const ta = wr.querySelector('textarea'), checked = () => { const it = Book.state.items['p05.explain']; return !!(it && it.ticks); };
      const lockOn = (on) => { st.classList.toggle('peek-lock', on); };
      ta.addEventListener('focus', () => { if (!checked()) lockOn(true); });
      ta.addEventListener('blur', () => { if (!ta.value.trim()) lockOn(false); });
      wr.querySelector('.btn').addEventListener('click', () => setTimeout(() => { if (checked()) lockOn(false); }, 50));
    },
  });
})();
