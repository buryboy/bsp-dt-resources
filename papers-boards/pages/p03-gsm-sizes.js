// Page 3 — gsm, microns & A sizes: weigh 1 m² sheets on a balance, cut an A0 down to A5, close a micrometer on
// four boards, then four calculations that echo the student's own working.
(function () {
  'use strict';
  const B = Ink.BLUE, RD = Ink.RED, GR = Ink.GREEN, rgba = Ink.rgba, geo = Ink.geo;
  const HANDF = (s) => `400 ${s}px "Gloria Hallelujah", "Comic Sans MS", cursive`;
  const LABF = (s) => `600 ${s}px Fredoka, "Arial Rounded MT Bold", system-ui, sans-serif`;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const ease = (u) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2);
  const hsh = (a, b = 0) => { const s = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453; return s - Math.floor(s); };

  function text(x, s, px, py, o = {}) {
    x.save(); const f = o.font === 'hand' ? HANDF : LABF; x.font = f(o.size || 22);
    x.fillStyle = rgba(o.color || B, o.a ?? 0.92); x.textAlign = o.align || 'left'; x.textBaseline = 'alphabetic';
    x.translate(px, py); if (o.rot) x.rotate(o.rot); x.fillText(s, 0, 0); x.restore();
  }
  function pen(x, pts, o = {}) {
    const P = o.wob === false ? pts : geo.wob(geo.seg(pts, 3), o.seed ?? 11, o.amp ?? 0.6);
    x.save(); x.strokeStyle = rgba(o.color || B, o.a ?? 0.85); x.lineWidth = o.w ?? 1.8; x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath();
    P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); if (o.close) x.closePath(); x.stroke(); x.restore();
  }
  const close = (P) => P.concat([P[0]]);
  const circ = (x, cx, cy, r, o = {}) => pen(x, geo.ellipse(cx, cy, r, o.ry || r), Object.assign({ amp: 0.4 }, o));
  const drop = (x, px, py, o = {}) => pen(x, [[px, py - 5], [px - 2.5, py], [px, py + 2.5], [px + 2.5, py], [px, py - 5]], Object.assign({ w: 1.4, wob: false }, o));
  const star = (x, px, py, s, o = {}) => { pen(x, [[px - s, py], [px + s, py]], Object.assign({ w: 1.8, wob: false }, o)); pen(x, [[px, py - s], [px, py + s]], Object.assign({ w: 1.8, wob: false }, o)); };

  function Stage(parent, W, Hh, touch) {
    const c = document.createElement('canvas'); parent.appendChild(c);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = Math.round(W * dpr); c.height = Math.round(Hh * dpr);
    Object.assign(c.style, { width: '100%', height: 'auto', aspectRatio: W + ' / ' + Hh, display: 'block', touchAction: touch || 'manipulation', userSelect: 'none', webkitUserSelect: 'none', cursor: 'pointer' });
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

  // the five A sizes cut from one A0 (drawn at 0.37 px per mm)
  const A0 = { x: 30, y: 44, w: 311, h: 440 };
  function pieces(cuts) {                          // -> { named: [{x,y,w,h,n}], rest: {x,y,w,h}, line: [[x,y],[x,y]] }
    let R = Object.assign({}, A0); const named = [];
    for (let k = 1; k <= cuts; k++) {
      if (R.h > R.w) { named.push({ x: R.x, y: R.y, w: R.w, h: R.h / 2, n: k }); R = { x: R.x, y: R.y + R.h / 2, w: R.w, h: R.h / 2 }; }
      else { named.push({ x: R.x, y: R.y, w: R.w / 2, h: R.h, n: k }); R = { x: R.x + R.w / 2, y: R.y, w: R.w / 2, h: R.h }; }
    }
    const line = R.h > R.w ? [[R.x, R.y + R.h / 2], [R.x + R.w, R.y + R.h / 2]] : [[R.x + R.w / 2, R.y], [R.x + R.w / 2, R.y + R.h]];
    return { named, rest: R, line };
  }
  function scissors(x, px, py, ang, open) {
    x.save(); x.translate(px, py); x.rotate(ang);
    [-1, 1].forEach((s) => { pen(x, [[-30, s * 9], [14, -s * (2 + open * 7)]], { w: 2.4, color: RD, wob: false }); pen(x, geo.ellipse(-36, s * 11, 7, 6), { w: 2.2, color: RD, wob: false }); });
    x.restore();
  }

  Book.page({
    id: 'p03',
    title: 'gsm, microns & A sizes',
    build(ui, root) {
      const got = (id) => Book.state.items[id];
      const held = new Map();
      const lock = (els, key, on) => els.forEach((e) => { const s = held.get(e) || held.set(e, new Set()).get(e); on ? s.add(key) : s.delete(key); e.classList.toggle('peek-lock', s.size > 0); });
      const guard = (actEl, id, els) => {
        const done = () => { const it = got(id); return !!it && (it.correct === true || it.attempts >= 3); };
        if (done()) return;
        actEl.addEventListener('pointerdown', () => { if (!done()) lock(els, id, true); }, { passive: true });
        actEl.addEventListener('click', () => setTimeout(() => { if (done()) lock(els, id, false); }, 60));
      };
      const frame = (e) => requestAnimationFrame(() => Ink.frame(e));
      const numeric = (act) => act.querySelectorAll('input.blank').forEach((inp) => { inp.inputMode = 'decimal'; inp.style.width = '5.2em'; });
      const echo = (src, k, outs, word) => { const inp = src.querySelectorAll('input.blank')[k]; const upd = () => outs.forEach((o) => (o.textContent = inp.value.trim() || word)); inp.addEventListener('input', upd); upd(); };
      const tagMis = (act, id, mis) => act.querySelector('.btn').addEventListener('click', () => setTimeout(() => { const it = got(id); if (it) it.mis = it.correct ? '' : mis; }, 30));

      ui.h('gsm, microns & A sizes');
      ui.p('Three numbers describe any sheet of paper or board: how <b>heavy</b> it is, how <b>thick</b> it is and what <b>size</b> it is.');

      // ================================================================== (a) gsm: the balance
      ui.el('h2', '', '1. How heavy? Weigh a square metre');
      ui.p('Four different sheets. Every one is <b>exactly 1 metre × 1 metre</b>.');
      const PAPERS = [{ n: 'printer paper', g: 80, th: 2 }, { n: 'thin card', g: 250, th: 6 }, { n: 'layout paper', g: 50, th: 1.2 }, { n: 'cartridge paper', g: 140, th: 3.6 }];
      const gp = ui.predict({ id: 'p03.gsm-predict', label: 'Prediction: which 1 m² sheet is heaviest?', q: '<b>Predict:</b> which sheet will be the <b>heaviest</b>?', options: PAPERS.map((p) => p.n[0].toUpperCase() + p.n.slice(1)), onPick: () => balGate() });
      const bl = ui.el('div', ''); bl.style.cssText = 'position:relative;margin:0 0 6px;transition:opacity .3s';
      const S = Stage(bl, 860, 390);
      const rBal = ui.record('p03.balance', { label: 'Balance: 1 m² sheets weighed (4)', type: 'experiment', max: 1 });
      const weighed = new Set(((rBal.get() || {}).weighed || []));
      const bal = { on: -1, fly: 1, shown: 0 };
      const cellAt = (i) => [14 + (i % 2) * 206, 50 + Math.floor(i / 2) * 168];
      const rhombus = (cx, cy, hw, hh) => [[cx - hw, cy], [cx, cy - hh], [cx + hw, cy], [cx, cy + hh]];
      function sheet(x, cx, cy, hw, hh, P, big) {
        const R = rhombus(cx, cy, hw, hh), th = P.th * (big ? 1.5 : 1);
        x.save(); x.globalCompositeOperation = 'source-over'; x.fillStyle = P.n === 'layout paper' ? 'rgba(255,255,255,.6)' : '#fff'; x.beginPath(); R.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.fill(); x.restore();
        if (P.n === 'cartridge paper') for (let k = 0; k < (big ? 150 : 60); k++) { const u = hsh(k, 1) - 0.5, v = (hsh(k, 2) - 0.5) * (1 - Math.abs(u) * 2); x.fillStyle = rgba(B, 0.3); x.fillRect(cx + u * 2 * hw, cy + v * 2 * hh, 1.6, 1.6); }
        pen(x, close(R), { w: P.n === 'layout paper' ? 1.4 : 2.2, a: P.n === 'layout paper' ? 0.6 : 0.9, seed: 5 });
        if (th > 1.5) { const E = [[cx - hw, cy], [cx - hw, cy + th], [cx, cy + hh + th], [cx + hw, cy + th], [cx + hw, cy]]; pen(x, E, { w: 1.8, seed: 6 }); pen(x, [[cx, cy + hh], [cx, cy + hh + th]], { w: 1.4, wob: false }); if (th > 4) Ink.hatchFill(x, [[cx - hw, cy], [cx, cy + hh], [cx + hw, cy], [cx + hw, cy + th], [cx, cy + hh + th], [cx - hw, cy + th]], 1, B, 2.4); }
      }
      let bStat;
      const buildB = () => { bStat = S.layer(860, 390, (x) => {
        text(x, 'tap a sheet to weigh it', 14, 28, { font: 'hand', size: 22, a: 0.75 });
        // the balance: pan, stem, body, display
        const pan = [[470, 222], [476, 234], [824, 234], [830, 222]]; Ink.stroke(x, pan, { w: 3, seed: 3 });
        pen(x, close([[636, 234], [664, 234], [664, 262], [636, 262]]), { w: 2.2 });
        const body = geo.rect(506, 262, 288, 96, 12); Ink.hatchShadow(x, body, 1, 8, 8); x.save(); x.globalCompositeOperation = 'source-over'; x.fillStyle = '#fbfaf5'; x.fillRect(508, 264, 284, 92); x.restore(); Ink.stroke(x, body, { w: 2.8, seed: 4 });
        Ink.stroke(x, geo.rect(570, 280, 160, 56, 6), { w: 2.2, seed: 7 });
        pen(x, geo.ellipse(760, 308, 9, 9), { w: 2 }); pen(x, geo.ellipse(540, 308, 9, 9), { w: 2 });
        pen(x, [[520, 358], [520, 368], [548, 368], [548, 358]], { w: 2 }); pen(x, [[752, 358], [752, 368], [780, 368], [780, 358]], { w: 2 }); pen(x, [[440, 369], [850, 369]], { w: 2, seed: 9 });
      }); };
      buildB(); S.onFonts = buildB;
      S.render = (dt) => {
        const x = S.ctx; let busy = false; S.blit(bStat, 0, 0);
        PAPERS.forEach((P, i) => {
          const [cx, cy] = cellAt(i);
          if (i !== bal.on) sheet(x, cx + 100, cy + 52, 78, 34, P); else pen(x, close(rhombus(cx + 100, cy + 52, 78, 34)), { w: 1.2, a: 0.3 });
          text(x, P.n, cx + 100, cy + 118, { size: 22, align: 'center' });
          if (weighed.has(i)) text(x, P.g + ' g ✓', cx + 100, cy + 146, { font: 'hand', size: 22, align: 'center', color: GR });
        });
        let val = 0;
        if (bal.on >= 0) {
          const P = PAPERS[bal.on], [cx, cy] = cellAt(bal.on);
          if (bal.fly < 1) { bal.fly = Math.min(1, bal.fly + dt / 0.45); busy = true; if (bal.fly >= 1) Book.sfx('thud', { gain: 0.2 }); }
          const u = ease(bal.fly), px = cx + 100 + (650 - cx - 100) * u, py = cy + 52 + (172 - cy - 52) * u - Math.sin(u * Math.PI) * 40;
          sheet(x, px, py, 78 + 92 * u, 34 + 12 * u, P, u > 0.5);
          if (bal.fly >= 1) { if (bal.shown < P.g) { bal.shown = Math.min(P.g, bal.shown + dt * P.g / 0.5); busy = true; if (bal.shown >= P.g) landed(); } val = Math.round(bal.shown); }
        }
        text(x, val + ' g', 650, 320, { size: 34, align: 'center', color: val ? B : [120, 130, 170] });
        return busy;
      };
      function landed() {
        weighed.add(bal.on); Book.sfx('pop', { gain: 0.35 });
        const all = weighed.size === 4;
        rBal.set({ answer: 'weighed: ' + [...weighed].map((i) => `${PAPERS[i].n} ${PAPERS[i].g} g`).join('; '), correct: all ? true : null, score: all ? 1 : 0, max: 1, weighed: [...weighed] });
        gp.querySelectorAll('.opt').forEach((b) => (b.disabled = true)); balGate();
      }
      S.c.addEventListener('click', (e) => {
        if (!got('p03.gsm-predict')) return;
        const [px, py] = S.pos(e); if (px > 430) return;
        const i = clamp(Math.floor((px - 14) / 206), 0, 1) + (py > 212 ? 2 : 0);
        if (i === bal.on) return;
        bal.on = i; bal.fly = 0; bal.shown = 0; Book.sfx('paper', { gain: 0.4, dur: 0.3 }); S.go();
      });
      const bstat = ui.p('', 'small');
      const gFound = ui.box('', { tag: 'Result' });
      const gNotes = ui.box('Paper is graded by its weight in <span class="key">gsm = grams per square metre</span>: the mass of <b>one 1 m × 1 m sheet</b>.<br>Normal printer paper is about <b>80 gsm</b>. Above about <b>200 gsm</b> it is called <b>board</b> (card).', { tag: 'Notes' });
      const gQ = ui.mcq({ id: 'p03.gsm', label: 'What does 80 gsm mean?', q: 'A pack of paper is labelled <b>80 gsm</b>. What does that tell you? <span class="small">(The balance and notes blur while you answer.)</span>',
        options: [
          { t: 'A sheet of it measuring 1 m × 1 m has a mass of 80 grams', ok: true, why: 'Yes: gsm is grams per square metre.' },
          { t: 'Every single A4 sheet in the pack has a mass of 80 grams', mis: 'gsm-meaning', why: 'Not one sheet of any size: gsm is the mass of a full square metre. An A4 sheet is far smaller, so it is far lighter.' },
          { t: 'Each sheet in the pack is 80 thousandths of a mm thick', mis: 'gsm-meaning', why: 'gsm is about mass, not thickness. The g stands for grams. Think about what you put on the balance.' },
          { t: 'The whole pack of 500 sheets has a mass of 80 grams', mis: 'gsm-meaning', why: 'gsm is not the mass of a pack. Think about the size of the sheets you put on the balance.' },
        ] });
      guard(gQ, 'p03.gsm', [bl, gFound, gNotes]);
      function balGate() {
        const on = !!got('p03.gsm-predict'), all = weighed.size === 4;
        bl.style.opacity = on ? 1 : 0.35;
        bstat.innerHTML = !on ? '<span class="red">Make your prediction first: then the balance unlocks.</span>' : all ? 'All four weighed.' : `Sheets weighed: <b>${weighed.size} / 4</b>. Weigh all four to carry on.`;
        if (weighed.size) gp.querySelectorAll('.opt').forEach((b) => (b.disabled = true));
        [gFound, gNotes, gQ].forEach((e) => (e.style.display = all ? '' : 'none'));
        if (all) {
          const p = (got('p03.gsm-predict') || {}).answer, ok = p === 'Thin card';
          gFound.innerHTML = '<span class="tag">Result</span>Same area, very different masses: layout paper <b>50 g</b>, printer paper <b>80 g</b>, cartridge paper <b>140 g</b>, thin card <b>250 g</b>.' + (p ? `<br>You predicted “${Book.esc(p.toLowerCase())}”: <b class="${ok ? 'green' : 'red'}">${ok ? '✓ spot on' : '✗ not this time'}</b>.` : '');
          frame(gFound);
        }
        S.go();
      }

      // ================================================================== (b) A sizes: cut an A0 in half, again and again
      ui.el('h2', '', '2. What size? Cut up an A0');
      ui.p('The biggest sheet is <b>A0</b>. <b>Cut it in half</b>, then cut one of the halves in half again… and watch the sizes appear.');
      const al = ui.el('div', ''); al.style.cssText = 'position:relative;margin:0 0 6px';
      const A = Stage(al, 860, 500);
      const rCut = ui.record('p03.cut', { label: 'A sizes: A0 cut down to A5 (5 cuts)', type: 'experiment', max: 1 });
      const cs = { cuts: Math.min(5, (rCut.get() || {}).cuts || 0), u: 0, going: false };
      const arow = ui.el('div', ''); arow.style.cssText = 'display:flex;gap:14px;align-items:center;flex-wrap:wrap;margin:0 0 var(--R)';
      const abtn = ui.el('button', 'btn', '', arow); abtn.type = 'button'; abtn.style.cssText = 'margin-top:0;min-height:60px;min-width:210px;font-size:21px';
      const astat = ui.el('span', 'small', '', arow); astat.style.flex = '1 1 240px';
      let aStat;
      const buildA = () => { aStat = A.layer(860, 500, (x) => {
        const { named, rest } = pieces(cs.cuts), O = [[A0.x, A0.y], [A0.x + A0.w, A0.y], [A0.x + A0.w, A0.y + A0.h], [A0.x, A0.y + A0.h]];
        Ink.hatchShadow(x, O, 1, 9, 9);
        x.save(); x.globalCompositeOperation = 'source-over'; x.fillStyle = '#fff'; x.fillRect(A0.x, A0.y, A0.w, A0.h); x.restore();
        const Rr = [[rest.x, rest.y], [rest.x + rest.w, rest.y], [rest.x + rest.w, rest.y + rest.h], [rest.x, rest.y + rest.h]];
        if (cs.cuts < 5) Ink.hatchFill(x, Rr, 1, B, 0.55);
        Ink.stroke(x, close(O), { w: 2.8, seed: 3 });
        const lab = (q, s) => text(x, s, q.x + q.w / 2, q.y + q.h / 2 + Math.min(14, q.h * 0.2), { size: clamp(q.h * 0.3, 22, 46), align: 'center' });
        named.forEach((q) => { pen(x, q.h < q.w && q.n % 2 ? [[q.x, q.y + q.h], [q.x + q.w, q.y + q.h]] : [[q.x + q.w, q.y], [q.x + q.w, q.y + q.h]], { w: 2.2, seed: q.n }); lab(q, 'A' + q.n); });
        if (cs.cuts >= 5) lab(rest, 'A5');
        text(x, cs.cuts ? 'one whole A0, cut ' + cs.cuts + (cs.cuts > 1 ? ' times' : ' time') : 'one whole A0 sheet', A0.x, 30, { font: 'hand', size: 22 });
        text(x, 'A0:  area = 1 m²', 384, 78, { size: 25 });
        for (let k = 1; k <= cs.cuts; k++) text(x, `A${k}:  ${2 ** k} of these fit in one A0`, 384, 78 + k * 54, { size: 22, a: 0.85 });
        if (cs.cuts >= 4) text(x, 'A4 measures 210 × 297 mm', 384, 78 + 6 * 54 + 30, { size: 25, color: RD });
      }); };
      buildA(); A.onFonts = buildA;
      A.render = (dt, t) => {
        const x = A.ctx; A.blit(aStat, 0, 0);
        if (cs.cuts >= 5) return false;
        const { line, rest } = pieces(cs.cuts), [p, q] = line, horiz = p[1] === q[1], L = Math.hypot(q[0] - p[0], q[1] - p[1]);
        if (cs.going) { cs.u = Math.min(1, cs.u + dt / 0.6); if (cs.u >= 1) { cs.going = false; cs.u = 0; cs.cuts++; buildA(); cutDone(); return true; } }
        const n = Math.floor(L / 14);
        for (let k = Math.ceil(cs.u * n); k < n; k++) { const a = k / n, b = (k + 0.55) / n; pen(x, [[p[0] + (q[0] - p[0]) * a, p[1] + (q[1] - p[1]) * a], [p[0] + (q[0] - p[0]) * b, p[1] + (q[1] - p[1]) * b]], { w: 2.4, color: RD, wob: false }); }
        if (cs.u > 0) pen(x, [p, [p[0] + (q[0] - p[0]) * cs.u, p[1] + (q[1] - p[1]) * cs.u]], { w: 2.4, wob: false });
        const sx = p[0] + (q[0] - p[0]) * cs.u, sy = p[1] + (q[1] - p[1]) * cs.u;
        scissors(x, sx - (horiz ? 4 : 0), sy - (horiz ? 0 : 4), horiz ? 0 : Math.PI / 2, cs.going ? Math.abs(Math.sin(t * 16)) : 0.5 + 0.5 * Math.sin(t * 4));
        if (!cs.going && rest.w > 120) text(x, 'cut here', rest.x + rest.w / 2 + (horiz ? 0 : 12), (horiz ? p[1] - 12 : rest.y + 34), { font: 'hand', size: 22, align: horiz ? 'center' : 'left', color: RD });
        return true;
      };
      const doCut = () => { if (cs.going || cs.cuts >= 5) return; cs.going = true; cs.u = 0; Book.sfx('stroke', { material: 'pen', dur: 0.5, gain: 0.5 }); abtn.disabled = true; A.go(); };
      abtn.onclick = doCut; A.c.addEventListener('click', doCut);
      const aNotes = ui.box('<b>A0 has an area of 1 m².</b> Each A size is <span class="key">half the one before</span>: cut the long side in half.<br>A0 → A1 → A2 → A3 → A4 → A5. The <b>bigger the number, the smaller the sheet</b>.<br><b>A4 = 210 × 297 mm.</b> Two A4 sheets side by side make one A3.', { tag: 'Notes' });
      const aQ = ui.mcq({ id: 'p03.asize', label: 'Which statement about A sizes is correct?', q: 'Which statement about A sizes is correct? <span class="small">(The cutting diagram and notes blur while you answer.)</span>',
        options: [
          { t: 'A3 is twice the area of A4, and A5 is half the area of A4', ok: true, why: 'Yes: going down a number doubles the sheet, going up a number halves it.' },
          { t: 'A5 is twice the area of A4, and A3 is half the area of A4', mis: 'a-size', why: 'That is the wrong way round. Think about your cuts: did the pieces get bigger or smaller as the A number went up?' },
          { t: 'A3 is three times the area of A1, and A5 is five times it', mis: 'a-size', why: 'The number is not a multiplier. Every cut halved the sheet and added 1 to the A number.' },
          { t: 'A3 is one size up from A4, so it is 1 cm bigger all round', mis: 'a-size', why: 'A sizes do not grow by a fixed amount. Think about what each cut did to the area of the sheet.' },
        ] });
      guard(aQ, 'p03.asize', [al, aNotes]);

      const c1 = ui.fill({ id: 'p03.calc1', label: 'Calc: mass of one A4 sheet of 80 gsm paper',
        q: '<b>Calculation 1.</b> What is the mass of <b>one A4 sheet</b> of <b>80 gsm</b> printer paper?',
        html: 'One A0 sheet (1 m²) of this paper has a mass of {{80|80.0|80g|80 g}} g<br>Number of A4 sheets that fit in one A0 = {{16|sixteen}}<br>So one A4 sheet = <b class="ea"></b> ÷ <b class="eb"></b> = {{5|5.0|5g|5 g}} g',
        explain: 'One A0 is 1 m², so it has a mass of 80 g. Sixteen A4 sheets fit in an A0, so one A4 = 80 ÷ 16 = <b>5 g</b>.' });
      numeric(c1); echo(c1, 0, c1.querySelectorAll('.ea'), '(mass of A0)'); echo(c1, 1, c1.querySelectorAll('.eb'), '(number of A4s)');
      guard(c1, 'p03.calc1', [al, aNotes, bl, gFound, gNotes]);
      const c2 = ui.fill({ id: 'p03.calc2', label: 'Calc: mass of a ream (500 sheets) of 120 gsm A4',
        q: '<b>Calculation 2.</b> A <b>ream</b> is a pack of <b>500 sheets</b>. What is the mass of a ream of A4 cartridge paper graded <b>120 gsm</b>?',
        html: 'One A4 sheet = 120 ÷ <b class="eb"></b> = {{7.5|7,5|7.50}} g<br>500 sheets = 500 × <b class="e1"></b> = {{3750|3 750|3,750|3750.0}} g<br>In kilograms: <b class="e2"></b> ÷ 1000 = {{3.75|3,75}} kg',
        explain: 'One A4 = 120 ÷ 16 = 7.5 g. A ream = 500 × 7.5 = 3750 g = <b>3.75 kg</b>.' });
      numeric(c2); echo(c1, 1, c2.querySelectorAll('.eb'), '(number of A4s)'); echo(c2, 0, c2.querySelectorAll('.e1'), '(one sheet)'); echo(c2, 1, c2.querySelectorAll('.e2'), '(your grams)');
      guard(c2, 'p03.calc2', [al, aNotes]);
      const aBits = [aNotes, aQ, c1, c2];
      function cutDone(first) {
        const all = cs.cuts >= 5;
        if (!first) { Book.sfx(all ? 'success' : 'tick', { gain: 0.4 }); rCut.set({ answer: `made ${cs.cuts} of 5 cuts (A0 down to A${cs.cuts})`, correct: all ? true : null, score: all ? 1 : 0, max: 1, cuts: cs.cuts }); }
        abtn.disabled = all; abtn.textContent = all ? 'All cut ✓' : '✂ Cut it in half';
        astat.innerHTML = all ? 'From A0 all the way down to A5.' : cs.cuts ? `Now cut the shaded piece in half again. Cuts so far: <b>${cs.cuts} / 5</b>.` : 'Tap the button (or the sheet) to cut along the red line.';
        aBits.forEach((e) => (e.style.display = all ? '' : 'none'));
        if (all) frame(aNotes);
        A.go();
      }

      // ================================================================== (c) microns: the micrometer
      ui.el('h2', '', '3. How thick? Measure with a micrometer');
      ui.p('Board is too thick to grade by weight alone, so its <b>thickness</b> is measured. Pick something, then <b>close the micrometer</b> on it. <span class="small">(Drag the handle sideways, or use the button.)</span>');
      const THINGS = [{ n: 'birthday card', t: 300 }, { n: 'cereal box', t: 450 }, { n: 'drinks mat', t: 1200 }, { n: 'book cover board', t: 2000 }];
      const pick = ui.el('div', ''); pick.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:8px;margin:0 0 8px';
      const ml = ui.el('div', ''); ml.style.cssText = 'position:relative;margin:0 0 6px';
      const M = Stage(ml, 860, 300, 'pan-y');
      const rMic = ui.record('p03.micrometer', { label: 'Micrometer: thicknesses measured (4 boards)', type: 'experiment', max: 1 });
      const measured = new Set(((rMic.get() || {}).measured || []));
      const mm = { on: -1, gap: 150, auto: false, drag: null, hit: false };
      const PXU = 0.045, AX = 258, AY = 120, tpx = () => (mm.on < 0 ? 0 : THINGS[mm.on].t * PXU);
      const mrow = ui.el('div', ''); mrow.style.cssText = 'display:flex;gap:14px;align-items:center;flex-wrap:wrap;margin:0 0 var(--R)';
      const mbtn = ui.el('button', 'btn', '⇤ Close the micrometer', mrow); mbtn.type = 'button'; mbtn.style.cssText = 'margin-top:0;min-height:60px;min-width:250px;font-size:21px';
      const mstat = ui.el('span', 'small', '', mrow); mstat.style.flex = '1 1 220px';
      const pbtn = THINGS.map((T, i) => { const b = ui.el('button', 'btn ghost', '', pick); b.type = 'button'; b.style.cssText = 'margin-top:0;min-height:52px;padding:6px 8px;font-size:17px'; b.onclick = () => { mm.on = i; mm.gap = 150; mm.auto = false; mm.hit = false; Book.sfx('paper', { gain: 0.4, dur: 0.25 }); micGate(); M.go(); }; return b; });
      let mStat;
      const buildM = () => { mStat = M.layer(860, 300, (x) => {
        const F = [[196, 86], [236, 86], [236, 196], [428, 196], [428, 94], [464, 94], [464, 240], [196, 240]];
        Ink.hatchShadow(x, F, 1, 8, 8); Ink.hatchFill(x, F, 1, B, 0.9); Ink.stroke(x, close(F), { w: 2.8, seed: 3 });
        pen(x, close([[236, AY - 9], [AX, AY - 9], [AX, AY + 9], [236, AY + 9]]), { w: 2.2 });           // anvil
        x.save(); x.globalCompositeOperation = 'source-over'; x.fillStyle = '#fff'; x.fillRect(250, 203, 164, 31); x.restore();
        Ink.stroke(x, geo.rect(250, 203, 164, 31, 5), { w: 2, seed: 5, retrace: false });
        pen(x, close([[464, AY - 16], [640, AY - 16], [640, AY + 16], [464, AY + 16]]), { w: 2.2, seed: 6 });  // sleeve
        pen(x, [[470, AY], [636, AY]], { w: 1.2, a: 0.6 });
        for (let k = 0; k <= 16; k++) pen(x, [[474 + k * 10, AY], [474 + k * 10, AY - (k % 5 ? 6 : 11)]], { w: 1.2, wob: false });
      }); };
      buildM(); M.onFonts = buildM;
      M.render = (dt) => {
        const x = M.ctx; let busy = !!mm.drag; M.blit(mStat, 0, 0);
        const t = tpx();
        if (mm.auto) { mm.gap = Math.max(t, mm.gap - dt * 230); busy = true; if (mm.gap <= t) mm.auto = false; }
        const touching = mm.on >= 0 && mm.gap <= t + 0.6;
        if (touching && !mm.hit) { mm.hit = true; touched(); }
        if (mm.on >= 0) {                               // the sample, edge on
          const P = [[AX, 26], [AX + t, 26], [AX + t, 190], [AX, 190]];
          x.save(); x.globalCompositeOperation = 'source-over'; x.fillStyle = '#fff'; x.fillRect(AX, 26, t, 164); x.restore();
          if (t > 16) Ink.hatchFill(x, P, 1, B, 1.3); pen(x, close(P), { w: 2, seed: 8 });
          text(x, THINGS[mm.on].n, AX + t / 2 + 40, 22, { font: 'hand', size: 22, align: 'center' });
        } else text(x, 'pick something to measure ↑', 300, 60, { font: 'hand', size: 22, color: RD });
        const g = mm.gap, tx = 520 + g;
        pen(x, close([[AX + g, AY - 7], [428, AY - 7], [428, AY + 7], [AX + g, AY + 7]]), { w: 2.2, seed: 9 });   // spindle
        const Th = [[tx, AY - 22], [tx + 14, AY - 27], [tx + 150, AY - 27], [tx + 150, AY + 27], [tx + 14, AY + 27], [tx, AY + 22]];
        x.save(); x.globalCompositeOperation = 'source-over'; x.fillStyle = '#fbfaf5'; x.beginPath(); Th.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.fill(); x.restore();
        Ink.hatchFill(x, [[tx + 50, AY - 27], [tx + 150, AY - 27], [tx + 150, AY + 27], [tx + 50, AY + 27]], 1, B, 2.2);
        pen(x, close(Th), { w: 2.6, seed: 10 }); pen(x, [[tx + 14, AY - 27], [tx + 14, AY + 27]], { w: 1.4 });
        pen(x, close([[tx + 150, AY - 13], [tx + 172, AY - 13], [tx + 172, AY + 13], [tx + 150, AY + 13]]), { w: 2.2, seed: 11 });
        if (mm.on >= 0 && !touching && !mm.auto && !mm.drag) { pen(x, [[tx + 120, AY + 52], [tx + 40, AY + 52]], { w: 2.6, color: RD, wob: false }); pen(x, [[tx + 52, AY + 44], [tx + 40, AY + 52], [tx + 52, AY + 60]], { w: 2.6, color: RD, wob: false }); text(x, 'drag', tx + 128, AY + 60, { font: 'hand', size: 22, color: RD }); }
        text(x, touching ? THINGS[mm.on].t + ' microns' : '– – –', 332, 227, { size: 22, align: 'center', color: touching ? GR : B });
        text(x, 'reading', 332, 268, { font: 'hand', size: 22, align: 'center', a: 0.7 });
        return busy;
      };
      function touched() {
        Book.sfx('tick', { gain: 0.6 }); measured.add(mm.on);
        const all = measured.size === 4;
        rMic.set({ answer: 'measured: ' + [...measured].map((i) => `${THINGS[i].n} ${THINGS[i].t} microns`).join('; '), correct: all ? true : null, score: all ? 1 : 0, max: 1, measured: [...measured] });
        micGate();
      }
      mbtn.onclick = () => { if (mm.on < 0) return; mm.auto = true; Book.sfx('swish', { gain: 0.2 }); M.go(); };
      M.c.addEventListener('pointerdown', (e) => { if (mm.on < 0) return; mm.auto = false; mm.drag = { x0: M.pos(e)[0], g0: mm.gap }; try { M.c.setPointerCapture(e.pointerId); } catch (er) {} M.go(); });
      M.c.addEventListener('pointermove', (e) => { if (!mm.drag) return; mm.gap = clamp(mm.drag.g0 + M.pos(e)[0] - mm.drag.x0, tpx(), 150); if (mm.gap > tpx() + 0.6) mm.hit = false; M.go(); });
      ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((ev) => M.c.addEventListener(ev, () => { mm.drag = null; }));
      const mNotes = ui.box('The thickness of board is measured in <span class="key">microns</span>.<br><b>1000 microns = 1 mm</b>, so 500 microns = 0.5 mm.<br><span class="small">To change microns into mm, divide by 1000. To change mm into microns, multiply by 1000.</span>', { tag: 'Notes' });
      const c3 = ui.fill({ id: 'p03.calc3', label: 'Calc: microns ↔ mm (1200, 750 microns; 1.5 mm)',
        q: '<b>Calculation 3.</b> Convert between microns and millimetres. <span class="small">(The notes blur while you work.)</span>',
        html: 'The drinks mat you measured: 1200 microns = {{1.2|1,2|1.20}} mm<br>A sheet of mounting board: 750 microns = {{0.75|.75|0,75}} mm<br>A sheet of thick grey board: 1.5 mm = {{1500|1 500|1,500}} microns',
        explain: '1200 ÷ 1000 = <b>1.2 mm</b>. 750 ÷ 1000 = <b>0.75 mm</b>. 1.5 × 1000 = <b>1500 microns</b>.' });
      numeric(c3); tagMis(c3, 'p03.calc3', 'micron-convert'); guard(c3, 'p03.calc3', [mNotes]);
      const endH = ui.el('h2', '', 'One last sum');
      const c4 = ui.fill({ id: 'p03.calc4', label: 'Calc: A3 and A5 dimensions from A4 (210 × 297 mm)',
        q: '<b>Calculation 4.</b> A4 paper measures <b>210 × 297 mm</b>. Work out the sizes either side of it. <span class="small">(Think back to your cuts.)</span>',
        html: 'Two A4 sheets side by side make one A3.<br>A3 = 297 × {{420|420.0}} mm<br>Cut an A4 in half across its long side to make two A5 sheets.<br>A5 = {{148|148.5|148,5|149}} × 210 mm',
        explain: 'A3 = 297 × <b>420</b> mm (210 × 2). A5 = <b>148</b> × 210 mm (297 ÷ 2 = 148.5, which is rounded down).' });
      numeric(c4); tagMis(c4, 'p03.calc4', 'a-size'); guard(c4, 'p03.calc4', [al, aNotes]);
      function micGate() {
        const all = measured.size === 4, t = tpx(), touching = mm.on >= 0 && mm.gap <= t + 0.6;
        THINGS.forEach((T, i) => { pbtn[i].innerHTML = Book.esc(T.n) + (measured.has(i) ? `<br><span style="font:400 15px 'Gloria Hallelujah'">${T.t} microns ✓</span>` : ''); pbtn[i].style.background = i === mm.on ? '#e8ecff' : ''; });
        mbtn.disabled = mm.on < 0 || touching;
        mstat.innerHTML = all ? 'All four measured.' : `Measured: <b>${measured.size} / 4</b>. Measure all four to carry on.`;
        [mNotes, c3, endH, c4].forEach((e) => (e.style.display = all ? '' : 'none'));
        if (all) frame(mNotes);
      }

      balGate(); cutDone(true); micGate(); S.go(); A.go(); M.go();
    },
  });
})();
