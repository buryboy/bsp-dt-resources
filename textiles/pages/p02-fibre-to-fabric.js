// Page 2 — Fibre → yarn → fabric. Zoom a magnifier into a jumper (fabric, then yarn, then fibres), twist loose fibres
// into a yarn on a spinning wheel and pull-test it, pull short staple fibres from a tuft and unwind one long filament
// from a cocoon. Then put the stages in order and match the six key words (notes and drawings blur while you do).
(function () {
  'use strict';
  const B = Ink.BLUE, RD = Ink.RED, GR = Ink.GREEN, rgba = Ink.rgba, geo = Ink.geo;
  const PAPER = '#fbfaf5';
  const HANDF = (s) => `400 ${s}px "Gloria Hallelujah", "Comic Sans MS", cursive`;
  const LABF = (s) => `600 ${s}px Fredoka, "Arial Rounded MT Bold", system-ui, sans-serif`;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const sstep = (a, b, v) => { const u = clamp((v - a) / (b - a)); return u * u * (3 - 2 * u); };
  const close = (P) => P.concat([P[0]]);
  const mirror = (L) => L.concat(L.slice().reverse().map(([x, y]) => [-x, y]));
  const at = (P, cx, cy, s = 1) => P.map(([x, y]) => [cx + x * s, cy + y * s]);

  function text(x, s, px, py, o = {}) {
    x.save(); x.font = (o.font === 'hand' ? HANDF : LABF)(o.size || 22);
    x.fillStyle = rgba(o.color || B, o.a ?? 0.92); x.textAlign = o.align || 'left'; x.textBaseline = 'alphabetic';
    x.translate(px, py); if (o.rot) x.rotate(o.rot); x.fillText(s, 0, 0); x.restore();
  }
  function pen(x, pts, o = {}) {
    const P = o.wob === false ? pts : geo.wob(geo.seg(pts, 3), o.seed ?? 11, o.amp ?? 0.6);
    x.save(); x.strokeStyle = rgba(o.color || B, o.a ?? 0.8); x.lineWidth = o.w ?? 1.4; x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath();
    P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.stroke(); x.restore();
  }
  // a hollow "tube" line: ink outline with a paper core, so strands look like fibres/yarns and can cross over each other
  function tube(x, pts, w, o = {}) {
    x.save(); x.lineCap = 'round'; x.lineJoin = 'round';
    const path = () => { x.beginPath(); pts.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); };
    x.globalCompositeOperation = 'source-over'; x.strokeStyle = rgba(o.color || B, o.a ?? 0.9); x.lineWidth = w; path(); x.stroke();
    x.strokeStyle = PAPER; x.lineWidth = Math.max(0.5, w - (o.edge || 2.6)); path(); x.stroke(); x.restore();
  }
  const dot = (x, px, py, r, a = 0.9, c = B) => { x.fillStyle = rgba(c, a); x.beginPath(); x.arc(px, py, r, 0, 7); x.fill(); };
  function paper(x, P) { x.save(); x.globalCompositeOperation = 'source-over'; x.fillStyle = PAPER; x.beginPath(); P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.closePath(); x.fill(); x.restore(); }

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
  // only stop the page scrolling when the finger starts on something draggable
  const grab = (S, hit) => S.c.addEventListener('touchstart', (e) => { const t = e.touches[0]; if (t && hit(...S.pos(t))) e.preventDefault(); }, { passive: false });

  Book.page({
    id: 'p02',
    title: 'Fibre → yarn → fabric',
    build(ui, root) {
      ui.h('From fibre to fabric');
      ui.p('What is a jumper <b>really</b> made of? Get the magnifying glass out and keep zooming in.');
      const got = (id) => Book.state.items[id];

      // ================================================================== 1. the magnifier
      const zoomWrap = ui.el('div', ''); zoomWrap.style.cssText = 'position:relative;margin:0 0 6px';
      const ZW = 860, ZH = 404, LX = 596, LY = 184, LR = 160;
      const Z = Stage(zoomWrap, ZW, ZH, 'pan-y');
      const zr = ui.record('p02.zoom', { label: 'Magnifier: zoomed in to see fabric, yarn and fibres', type: 'experiment', max: 0 });
      const seen = new Set(((zr.get() || {}).seen || []));
      let z = 0;
      const srow = ui.el('div', ''); srow.style.cssText = 'display:flex;align-items:center;gap:12px;margin:0 0 var(--R)';
      ui.el('b', '', '🔍 zoom', srow).style.fontFamily = 'Fredoka';
      const slider = ui.el('input', '', null, srow); slider.type = 'range'; slider.min = 0; slider.max = 300; slider.value = 0; slider.setAttribute('aria-label', 'zoom');
      slider.style.cssText = 'flex:1;height:48px;accent-color:#1e2e96;touch-action:none';
      ui.el('b', '', 'closer ▸', srow).style.fontFamily = 'Fredoka';
      const JUMPER = mirror([[0, 10], [-16, 0], [-38, 6], [-64, 84], [-48, 90], [-34, 44], [-34, 104], [0, 104]]);
      let sprZ;
      function buildZ() {
        sprZ = Z.layer(ZW, ZH, (x) => {
          const P = at(JUMPER, 170, 84, 2.1); Ink.hatchShadow(x, P, 1, 7, 7); paper(x, P); Ink.hatchFill(x, P, 1, B, 0.6); Ink.stroke(x, close(P), { w: 2.8, seed: 5 });
          const L = (pts, o) => pen(x, at(pts, 170, 84, 2.1), Object.assign({ w: 1.6 }, o));
          for (let i = -30; i <= 30; i += 5) L([[i, 95], [i, 104]], { wob: false });
          L([[-16, 0], [-8, 11], [0, 14], [8, 11], [16, 0]], { w: 2.2 }); L([[-34, 94], [34, 94]]);
          [-1, 1].forEach((m) => { for (let i = 0; i < 3; i++) L([[m * (51 + i * 4.5), 80 + i * 1.5], [m * (53 + i * 4.5), 88 + i * 1.2]], { wob: false }); });
          // the lens: rim, handle
          const rim = geo.ellipse(LX, LY, LR, LR); Ink.hatchShadow(x, rim, 1, 8, 8); Ink.stroke(x, rim, { w: 3.4, seed: 9 });
          Ink.stroke(x, geo.ellipse(LX, LY, LR + 9, LR + 9), { w: 2, seed: 10, retrace: false });
          const hd = [[LX + 118, LY + 124], [LX + 196, LY + 196], [LX + 180, LY + 212], [LX + 104, LY + 138]]; Ink.hatchFill(x, hd, 1, B, 1.6); Ink.stroke(x, close(hd), { w: 2.6, seed: 12 });
        });
      }
      buildZ(); Z.onFonts = buildZ;
      const rr0 = H.rng(77), FUZZ = Array.from({ length: 46 }, () => [rr0.range(-1, 1), rr0() < 0.5 ? -1 : 1, rr0.range(0.3, 1), rr0.range(-0.6, 0.6)]);
      const LEVELS = [['FABRIC', 'yarns looped together (knitted)'], ['YARN', 'fibres twisted together'], ['FIBRES', 'very fine, hair-like strands']];
      Z.render = () => {
        const x = Z.ctx, f = z * 3;
        const aF = 1 - sstep(0.85, 1.15, f), aY = sstep(0.85, 1.15, f) * (1 - sstep(1.85, 2.15, f)), aH = sstep(1.85, 2.15, f);
        // where the lens is looking
        const tr = 16 - 9 * z; Ink.stroke(x, geo.ellipse(170, 196, tr, tr), { w: 2.4, color: RD, seed: 3 });
        pen(x, [[170, 196 - tr], [LX - 60, LY - LR + 12]], { w: 1.4, color: RD, a: 0.6 }); pen(x, [[170, 196 + tr], [LX - 60, LY + LR - 12]], { w: 1.4, color: RD, a: 0.6 });
        x.save(); x.beginPath(); x.arc(LX, LY, LR - 4, 0, 7); x.clip(); x.globalCompositeOperation = 'source-over'; x.fillStyle = PAPER; x.fillRect(LX - LR, LY - LR, LR * 2, LR * 2);
        if (aF > 0.01) { // knitted fabric: rows of interlocking loops
          x.globalAlpha = aF; const sc = 0.75 + f * 0.95, P = 44 * sc, hh = 17 * sc, rowGap = 22 * sc;
          for (let ry = -LR - hh; ry < LR + hh * 2; ry += rowGap) {
            const pts = []; for (let u = -LR - P; u <= LR + P; u += 3) { const t = (u / P) * Math.PI * 2; pts.push([LX + u + 0.2 * P * Math.sin(2 * t) * 0.5 + P * 0.25, LY + ry - hh * Math.cos(t)]); }
            tube(x, pts, 7.5 * sc, { edge: 2.4 });
          }
        }
        if (aY > 0.01) { // one yarn: a twisted strand with stray hairs
          x.globalAlpha = aY; const sc = 0.6 + (f - 1) * 1.0, hw = 36 * sc;
          x.save(); x.translate(LX, LY); x.rotate(-0.32); x.globalCompositeOperation = 'multiply';
          pen(x, [[-LR - 30, -hw], [LR + 30, -hw]], { w: 2.6, seed: 4, a: 0.9 }); pen(x, [[-LR - 30, hw], [LR + 30, hw]], { w: 2.6, seed: 6, a: 0.9 });
          for (let u = -LR - 80; u < LR + 40; u += 19 * sc) pen(x, geo.curve([u, hw], [u + 14 * sc, hw * 0.5], [u + 34 * sc, -hw * 0.5], [u + 48 * sc, -hw], 10), { w: 1.6, wob: false, a: 0.8 });
          FUZZ.forEach(([u, sd, len, lean]) => { const px = u * (LR + 10), py = sd * hw; pen(x, geo.curve([px, py], [px + 8 * lean, py + sd * 8 * len], [px + 26 * lean, py + sd * 14 * len], [px + 40 * lean, py + sd * 13 * len * sc], 8), { w: 1.1, wob: false, a: 0.6 }); });
          x.restore();
        }
        if (aH > 0.01) { // separate fibres: fine, wavy, hair-like
          x.globalAlpha = aH; const sc = 0.65 + (f - 2) * 0.75;
          for (let i = 0; i < 7; i++) {
            const pts = [], base = (i - 3) * 50 * sc + 8 * Math.sin(i * 2.3), ph = i * 1.9, sl = (i % 3 - 1) * 0.12;
            for (let u = -LR - 10; u <= LR + 10; u += 4) pts.push([LX + u, LY + base + u * sl + 9 * sc * Math.sin(u / (24 * sc) + ph) + 5 * Math.sin(u / 61 + ph * 2)]);
            tube(x, pts, 6.5 * sc, { edge: 2.2 });
          }
        }
        x.restore();
        Z.blit(sprZ, 0, 0);
        const lv = f < 1 ? 0 : f < 2 ? 1 : 2, shown = lv === 0 ? aF > 0.6 : lv === 1 ? aY > 0.6 : aH > 0.6;
        if (shown) { Ink.drawBubble(x, LEVELS[lv][0], 24, ZH - 54, 34, RD, 1, -0.02); text(x, LEVELS[lv][1], 26, ZH - 18, { font: 'hand', size: 22 }); }
        return false;
      };
      slider.addEventListener('input', () => {
        z = slider.value / 300; const f = z * 3, lv = f < 0.85 ? 0 : f > 1.15 && f < 1.85 ? 1 : f > 2.15 ? 2 : -1;
        if (lv >= 0 && !seen.has(lv)) { seen.add(lv); Book.sfx('pop', { gain: 0.35 }); zr.set({ answer: 'saw: ' + [...seen].sort().map((k) => LEVELS[k][0].toLowerCase()).join(', ') + ` (${seen.size}/3)`, correct: seen.size === 3 ? true : null, seen: [...seen] }); gate(); }
        Z.go();
      });

      // ================================================================== 2. the spinning wheel
      ui.el('h2', '', 'Spin a yarn');
      ui.p('The fibres in the jumper were once a loose, fluffy bundle like this one. A <b>spinning wheel</b> twists them together.');
      const sr = ui.record('p02.spin', { label: 'Spinning lab: predicted, pull-tested loose fibres and a twisted yarn', type: 'experiment', max: 1 });
      const sp = sr.get() || {};
      const spin = { pred: sp.pred || '', loose: !!sp.loose, held: !!sp.held, log: (sp.log || []).slice() };
      const RIGHT = 'It will make the strand stronger';
      const sAct = ui.el('div', 'act'); sAct.dataset.id = 'p02.spin'; requestAnimationFrame(() => Ink.frame(sAct, { shadow: false, w: 2.2 }));
      ui.el('div', 'q', '<b>Predict:</b> what will twisting do to this bundle of loose fibres?', sAct);
      const pbox = ui.el('div', 'opts', '', sAct);
      const pbtns = [RIGHT, 'It will make the strand weaker', 'It will not change its strength'].map((t) => { const b = ui.el('button', 'opt', t, pbox); b.type = 'button'; if (spin.pred === t) b.classList.add('sel');
        b.onclick = () => { if (spin.log.length) return; pbtns.forEach((q) => q.classList.remove('sel')); b.classList.add('sel'); spin.pred = t; Book.scribble(0.12); commitSpin(); gateSpin(); }; return b; });
      const sLab = ui.el('div', '', '', sAct); sLab.style.cssText = 'position:relative;margin:12px 0 0;transition:opacity .3s';
      const SW = 860, SH = 330, CY = 186, X0 = 104, X1 = 620, WX = 728, WR = 86;
      const P = Stage(sLab, SW, SH, 'pan-y');
      let T = 0, th = 0, spinDrag = null, pull = null, msg = '', msgCol = B, seed = 3, strands = [];
      const mk = () => { const r = H.rng(seed * 31 + 7); strands = Array.from({ length: 20 }, (_, i) => { const len = r.range(150, 230), sx = i < 3 ? X0 : i > 16 ? X1 - len : r.range(X0, X1 - len); return { sx, len, oy: r.range(-1, 1), ph: r.range(0, 6.283) }; }); };
      mk();
      const srow2 = ui.el('div', '', '', sAct); srow2.style.cssText = 'display:flex;gap:14px;align-items:center;flex-wrap:wrap;margin-top:8px';
      const pullBtn = ui.el('button', 'btn', '↔ Pull test', srow2); pullBtn.style.cssText = 'margin-top:0;min-width:170px;min-height:56px;font-size:20px';
      const sStat = ui.el('span', 'small', '', srow2); sStat.style.flex = '1 1 260px';
      let sprP;
      function buildP() {
        sprP = P.layer(SW, SH, (x) => {
          // a peg holding the left end, the wheel stand on the right
          const peg = geo.rect(34, CY - 34, 74, 68, 8); Ink.hatchShadow(x, peg, 1, 6, 6); paper(x, peg); Ink.hatchFill(x, peg, 1, B, 1.2); Ink.stroke(x, peg, { w: 2.6, seed: 5 });
          Ink.stroke(x, [[WX - 60, SH - 12], [WX, CY], [WX + 60, SH - 12]], { w: 2.8, seed: 8 }); Ink.stroke(x, [[WX - 84, SH - 12], [WX + 84, SH - 12]], { w: 2.8, seed: 9 });
          // pull-force gauge
          Ink.stroke(x, geo.rect(250, 30, 330, 26, 6), { w: 2.2, seed: 12 });
          text(x, 'pull:', 190, 51, { size: 22 }); text(x, 'gentle', 250, 82, { size: 22, a: 0.75 }); text(x, 'hard', 580, 82, { size: 22, align: 'right', a: 0.75 });
        });
      }
      buildP(); P.onFonts = buildP;
      const twist = () => clamp(Math.abs(T) / 4);
      P.render = (dt, t) => {
        const x = P.ctx; let busy = !!spinDrag;
        P.blit(sprP, 0, 0);
        const tw = twist(), turns = Math.abs(T);
        let gap = 0, gauge = 0, shake = 0;
        if (pull) {
          pull.p = Math.min(1, pull.p + dt / 1.5); busy = true;
          gauge = Math.min(pull.p, pull.str); if (pull.str < 1 && pull.p > pull.str) gap = (pull.p - pull.str) * 150; else shake = Math.sin(t * 40) * 1.2 * pull.p;
          if (pull.p >= 1) endPull();
        } else if (P.lastGauge) gauge = P.lastGauge;
        if (gauge > 0.01) { const R = [[253, 33], [253 + 324 * gauge, 33], [253 + 324 * gauge, 53], [253, 53]]; Ink.hatchFill(x, R, 1, gauge >= 0.99 ? GR : B, 2.4); }
        // the bundle: 20 short fibres, lying side by side when loose, wound into a helix as the twist goes in
        const spread = 30 - 21 * tw - (pull && !gap ? 3 * pull.p : 0), k = 0.018 + 0.05 * tw;
        strands.forEach((s, i) => {
          const mid = s.sx + s.len / 2, sh = gap ? (mid < (X0 + X1) / 2 ? -gap : gap) * (0.6 + 0.4 * Math.abs(s.oy)) : 0, pts = [];
          for (let u = 0; u <= s.len; u += 6) { const px = s.sx + u; pts.push([px + sh, CY + shake + spread * (s.oy * (1 - tw) + tw * Math.sin(px * k + s.ph + th)) + (1 - tw) * 4 * Math.sin(px / 30 + s.ph)]); }
          tube(x, pts, 4.6, { edge: 2 }); void i;
        });
        // the hook and the wheel
        pen(x, [[X1 - 4 + (gap ? gap : 0), CY], [WX, CY]], { w: 2.4, seed: 4, a: 0.9 });
        const rim = geo.ellipse(WX, CY, WR, WR); Ink.stroke(x, rim, { w: 3.2, seed: 21 }); Ink.stroke(x, geo.ellipse(WX, CY, WR - 10, WR - 10), { w: 1.6, seed: 22, retrace: false });
        for (let i = 0; i < 6; i++) { const a = th + (i / 6) * 6.283; pen(x, [[WX + Math.cos(a) * 10, CY + Math.sin(a) * 10], [WX + Math.cos(a) * (WR - 10), CY + Math.sin(a) * (WR - 10)]], { w: 2, wob: false, a: 0.85 }); }
        dot(x, WX, CY, 9, 0.9);
        const hx = WX + Math.cos(th) * 58, hy = CY + Math.sin(th) * 58;
        x.save(); x.globalCompositeOperation = 'source-over'; x.fillStyle = PAPER; x.beginPath(); x.arc(hx, hy, 19, 0, 7); x.fill(); x.restore();
        Ink.stroke(x, geo.ellipse(hx, hy, 19, 19), { w: 3, color: RD, seed: 31 }); dot(x, hx, hy, 6, 0.9, RD);
        if (turns < 0.3 && spin.loose && !pull) { pen(x, geo.ellipse(WX, CY, WR + 22, WR + 22, -1.2, 0.4), { w: 2.2, color: RD, wob: false }); const e = [WX + Math.cos(0.4) * (WR + 22), CY + Math.sin(0.4) * (WR + 22)]; pen(x, [[e[0] + 12, e[1] - 10], e, [e[0] - 13, e[1] - 6]], { w: 2.2, color: RD, wob: false }); text(x, 'drag me round!', WX - 4, 46, { font: 'hand', size: 22, color: RD, align: 'center' }); }
        else text(x, `turns: ${Math.floor(turns)}`, WX, 46, { size: 24, align: 'center' });
        if (pull) [[60, -1], [X1 + 20, 1]].forEach(([ax, d]) => { const y = CY - 54, a = ax - d * 20, b2 = ax + d * 30; pen(x, [[a, y], [b2, y]], { w: 3, color: RD, wob: false }); pen(x, [[b2 - d * 12, y - 9], [b2, y], [b2 - d * 12, y + 9]], { w: 3, color: RD, wob: false }); });
        if (msg) text(x, msg, 40, SH - 22, { font: 'hand', size: 24, color: msgCol });
        return busy;
      };
      function endPull() {
        const held = pull.str >= 1, turns = Math.floor(Math.abs(T)); P.lastGauge = Math.min(1, pull.str);
        Book.sfx(held ? 'success' : 'thud', { gain: 0.4 });
        msg = held ? 'It holds! The twisted yarn is strong.' : turns === 0 ? 'The loose fibres just slid apart.' : 'It slid apart… try more twist.'; msgCol = held ? GR : RD;
        if (turns === 0) spin.loose = true; if (held) spin.held = true;
        spin.log.push(`${turns === 0 ? 'loose' : turns + ' turn' + (turns > 1 ? 's' : '')} → ${held ? 'held' : 'slid apart'}`);
        const broke = !held; pull = null; commitSpin(); gateSpin(); gate();
        if (broke) setTimeout(() => { T = 0; th = 0; seed++; mk(); P.lastGauge = 0; P.go(); }, 1300);
      }
      pullBtn.onclick = () => { if (pull || !spin.pred) return; pull = { p: 0, str: twist() }; msg = ''; P.lastGauge = 0; Book.sfx('stroke', { material: 'pen', dur: 0.8, gain: 0.5 }); pbtns.forEach((b) => (b.disabled = true)); P.go(); };
      const onWheel = (px, py) => Math.hypot(px - WX, py - CY) < WR + 34;
      grab(P, onWheel);
      P.c.addEventListener('pointerdown', (e) => { const [px, py] = P.pos(e); if (pull || !spin.loose || !onWheel(px, py)) return; spinDrag = { a: Math.atan2(py - CY, px - WX) }; try { P.c.setPointerCapture(e.pointerId); } catch (er) {} msg = ''; P.lastGauge = 0; P.go(); });
      P.c.addEventListener('pointermove', (e) => {
        if (!spinDrag) return; const [px, py] = P.pos(e); if (Math.hypot(px - WX, py - CY) < 14) return;
        const a = Math.atan2(py - CY, px - WX); let d = a - spinDrag.a; if (d > Math.PI) d -= 6.283185; if (d < -Math.PI) d += 6.283185; spinDrag.a = a;
        const before = Math.floor(Math.abs(T)); T = clamp(T + d / 6.283185, -6, 6); th += d; if (Math.floor(Math.abs(T)) !== before) Book.sfx('tick', { gain: 0.4 });
        P.go();
      });
      ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((ev) => P.c.addEventListener(ev, () => { if (spinDrag) { spinDrag = null; gateSpin(); P.go(); } }));
      function commitSpin() {
        const done = spin.loose && spin.held, ok = spin.pred === RIGHT;
        sr.set({ answer: `predicted "${spin.pred}"${done ? (ok ? ' ✓' : ' ✗') : ''}; pull tests: ${spin.log.length ? spin.log.slice(-8).join('; ') : 'none yet'}`, correct: done ? true : null, score: done ? 1 : 0, max: 1, pred: spin.pred, loose: spin.loose, held: spin.held, log: spin.log.slice(-8) });
      }
      const twistQ = ui.mcq({ id: 'p02.twist', label: 'Why is a twisted yarn stronger than loose fibres?', q: 'Think about what the loose fibres did when you pulled. <b>Why</b> is the twisted yarn stronger?',
        options: [
          { t: 'The twist makes the fibres grip each other, so they cannot slide apart', ok: true },
          { t: 'The twist makes every single fibre thicker, so each is harder to snap', why: 'Each fibre is exactly the same as before. Look again at what the loose fibres did when pulled: did they snap, or do something else?' },
          { t: 'The twist melts the fibres together, so they become one solid strand', why: 'Nothing was heated: you can still untwist a yarn back into separate fibres. What stopped them sliding past each other?' },
          { t: 'The twist stretches the short fibres out, so each becomes much longer', why: 'The fibres stay the same length. The loose ones slid past each other: what does twisting do to stop that?' },
        ],
        explain: 'Twisting is called spinning. It gives a yarn its strength.' });
      function gateSpin() {
        const on = !!spin.pred; sLab.style.opacity = on ? 1 : 0.35; sLab.style.pointerEvents = on ? '' : 'none'; pullBtn.disabled = !on;
        if (spin.log.length) pbtns.forEach((b) => (b.disabled = true));
        const done = spin.loose && spin.held;
        sStat.innerHTML = !on ? '<span class="red">Make your prediction first.</span>' : !spin.loose ? '<b>1.</b> Press <b>Pull test</b> to pull on the loose fibres.' : !spin.held ? `<b>2.</b> Drag the red handle <b>round and round</b> to twist, then pull again. ${Math.abs(T) >= 0.5 ? '(More turns = more twist.)' : ''}` : `<b class="green">Done!</b> You predicted “${Book.esc(spin.pred.toLowerCase())}”: ${spin.pred === RIGHT ? '✓ you were right' : '✗ the twisted yarn was stronger'}. Keep experimenting if you like.`;
        twistQ.style.display = done ? '' : 'none';
      }

      // ================================================================== 3. short fibres and one very long one
      ui.el('h2', '', 'Short or long?');
      ui.p('Not all fibres are the same length. <b>Tap the fluffy tuft</b> a few times to pull fibres out. Then <b>drag from the cocoon</b> and see how far its fibre goes.');
      const lenWrap = ui.el('div', ''); lenWrap.style.cssText = 'position:relative;margin:0 0 var(--R)';
      const LW = 860, LH = 310, TX = 112, TY = 136, CX = 512, CYY = 140;
      const Lg = Stage(lenWrap, LW, LH, 'pan-y');
      const lr = ui.record('p02.lengths', { label: 'Staple vs filament: pulled short fibres from a tuft, unwound a cocoon', type: 'experiment', max: 0 });
      const lp = lr.get() || {};
      let tufts = lp.tufts || 0, fil = !!lp.fil, path = fil ? [[CX + 40, CYY], [640, 60], [800, 90], [820, 200], [660, 230], [600, 150], [720, 130], [790, 160]] : [], plen = fil ? 900 : 0, lDrag = false, fly = 0;
      const commitLen = () => { lr.set({ answer: `pulled ${Math.min(tufts, 5)} short fibres from the tuft; cocoon ${fil ? 'unwound: one long continuous fibre' : 'not unwound yet'}`, correct: tufts >= 3 && fil ? true : null, tufts, fil }); gate(); };
      let sprL;
      function buildL() {
        sprL = Lg.layer(LW, LH, (x) => {
          // a fluffy tuft: a cloud of little arcs
          const r = H.rng(5), bumps = []; for (let i = 0; i < 11; i++) { const a = (i / 11) * 6.283; bumps.push([TX + Math.cos(a) * 62, TY + Math.sin(a) * 50, r.range(20, 28)]); }
          const out = []; bumps.forEach(([bx, by, br], i) => { const a0 = (i / 11) * 6.283 - 1.5; for (let j = 0; j <= 8; j++) { const a = a0 + (j / 8) * 3.0; out.push([bx + Math.cos(a) * br, by + Math.sin(a) * br]); } });
          paper(x, out); Ink.stroke(x, close(out), { w: 2.4, seed: 7 });
          for (let i = 0; i < 16; i++) { const a = r.range(0, 6.283), d = r.range(0, 46), px = TX + Math.cos(a) * d, py = TY + Math.sin(a) * d * 0.8; pen(x, geo.ellipse(px, py, 9, 7, a, a + 2.6), { w: 1.2, wob: false, a: 0.55 }); }
          pen(x, [[430, 16], [430, LH - 60]], { w: 1.4, a: 0.4, seed: 2 });
          // the cocoon
          const co = geo.ellipse(CX, CYY, 44, 28); Ink.hatchShadow(x, co, 1, 6, 6); paper(x, co); Ink.stroke(x, co, { w: 2.6, seed: 13 });
          for (let i = 0; i < 9; i++) { const u = -36 + i * 9; pen(x, geo.curve([CX + u, CYY - 26 + Math.abs(u) * 0.25], [CX + u + 12, CYY - 8], [CX + u - 10, CYY + 8], [CX + u + 6, CYY + 26 - Math.abs(u) * 0.25], 8), { w: 1.1, wob: false, a: 0.55 }); }
        });
      }
      buildL(); Lg.onFonts = buildL;
      Lg.render = (dt) => {
        const x = Lg.ctx; let busy = lDrag;
        if (path.length > 1) pen(x, path, { w: 1.8, wob: false, a: 0.9 });
        Lg.blit(sprL, 0, 0);
        if (fly > 0) { fly = Math.max(0, fly - dt / 0.45); busy = true; }
        for (let i = 0; i < Math.min(tufts, 5); i++) {
          const k = i === Math.min(tufts, 5) - 1 ? 1 - fly : 1, bx = TX + 60 + (232 - TX - 60) * k, by = TY + (58 + i * 38 - TY) * k, pts = [];
          for (let u = 0; u <= 78 + (i % 3) * 14; u += 6) pts.push([bx + u, by + 5 * Math.sin(u / 13 + i * 2)]);
          tube(x, pts, 5, { edge: 2 });
        }
        if (tufts < 1) text(x, 'tap me!', TX, TY + 92, { font: 'hand', size: 24, color: RD, align: 'center' });
        if (!path.length) text(x, 'drag from me!', CX + 6, CYY + 66, { font: 'hand', size: 24, color: RD, align: 'center' });
        if (tufts >= 3) { Ink.drawBubble(x, 'STAPLE', 22, LH - 40, 30, RD, 1, -0.02); text(x, 'short fibres', 152, LH - 42, { font: 'hand', size: 22 }); text(x, 'e.g. cotton, wool', 22, LH - 12, { font: 'hand', size: 22 }); }
        if (fil) { Ink.drawBubble(x, 'FILAMENT', 446, LH - 40, 30, RD, 1, -0.02); text(x, 'one very long fibre', 612, LH - 42, { font: 'hand', size: 22 }); text(x, 'e.g. silk: and it keeps on going!', 446, LH - 12, { font: 'hand', size: 22 }); }
        return busy;
      };
      const onCocoon = (px, py) => Math.hypot(px - CX, py - CYY) < 64;
      grab(Lg, onCocoon);
      Lg.c.addEventListener('pointerdown', (e) => {
        const [px, py] = Lg.pos(e);
        if (onCocoon(px, py)) { lDrag = true; path = [[CX + 40, CYY]]; plen = 0; try { Lg.c.setPointerCapture(e.pointerId); } catch (er) {} Lg.go(); return; }
        if (Math.hypot(px - TX, py - TY) < 96) { tufts++; fly = 1; Book.sfx('pop', { gain: 0.4 }); if (tufts <= 5) commitLen(); Lg.go(); }
      });
      Lg.c.addEventListener('pointermove', (e) => {
        if (!lDrag) return; const [px0, py0] = Lg.pos(e), px = clamp(px0, 446, LW - 8), py = clamp(py0, 8, LH - 74), q = path[path.length - 1], d = Math.hypot(px - q[0], py - q[1]);
        if (d > 7 && plen < 3200) { path.push([px, py]); plen += d; if (((plen / 120) | 0) !== (((plen - d) / 120) | 0)) Book.sfx('tick', { gain: 0.2 }); if (!fil && plen > 650) { fil = true; Book.sfx('success', { gain: 0.3 }); commitLen(); } }
        Lg.go();
      });
      ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((ev) => Lg.c.addEventListener(ev, () => { lDrag = false; Lg.go(); }));

      // ================================================================== notes, then recall
      const notes = ui.box('', { tag: 'Notes' });
      const NOTES = '<span class="tag">Notes</span>A <span class="key">fibre</span> is a very fine, hair-like strand.<br>Fibres are <span class="key">spun</span> (twisted together) into a <span class="key">yarn</span> (thread). Twisting gives the yarn its <b>strength</b>.<br>Yarns are <b>woven</b> or <b>knitted</b> into a <span class="key">fabric</span>. (Some fabrics are made straight from fibres: <b>non-woven</b>.)<br><span class="key">Staple</span> fibres are <b>short</b> (cotton, wool). <span class="key">Filament</span> fibres are <b>very long and continuous</b> (silk, and synthetic fibres as they are made).';
      function gate() {
        const all = seen.size === 3 && spin.loose && spin.held && tufts >= 3 && fil;
        const todo = [seen.size === 3 ? '' : 'zoom all the way in', spin.loose && spin.held ? '' : 'finish the spinning test', tufts >= 3 && fil ? '' : 'try the tuft and the cocoon'].filter(Boolean);
        notes.innerHTML = all ? NOTES : `<span class="tag">Notes</span><span class="small">🔒 Your notes appear here when you have finished the experiments above. Still to do: ${todo.join(', ')}.</span>`;
        requestAnimationFrame(() => Ink.frame(notes));
      }
      ui.el('h2', '', 'Now without looking');
      ui.p('<span class="small">The notes and drawings above go blurry while you answer. No peeking!</span>');
      const hide = [notes, zoomWrap, srow, lenWrap];
      const seq = ui.sort({ id: 'p02.sequence', label: 'Sort 6 things into the 3 stages: fibre, yarn, fabric', q: 'From sheep to jumper in <b>three stages</b>. Tap a card, then tap the stage it belongs to.',
        buckets: ['Stage 1: the start', 'Stage 2: made from stage 1', 'Stage 3: ready to cut and sew'],
        items: [
          { t: 'a single hair from a fleece', b: 0, mis: 'fibre-yarn-fabric' }, { t: 'one strand unwound from a cocoon', b: 0, mis: 'fibre-yarn-fabric' },
          { t: 'a ball of knitting wool', b: 1, mis: 'fibre-yarn-fabric' }, { t: 'a reel of sewing thread', b: 1, mis: 'fibre-yarn-fabric' },
          { t: 'a roll of denim', b: 2, mis: 'fibre-yarn-fabric' }, { t: 'knitted jersey for T-shirts', b: 2, mis: 'fibre-yarn-fabric' },
        ],
        explain: 'Stage 1 is fibres. They are spun into yarns (stage 2), and yarns are woven or knitted into fabrics (stage 3).' });
      ui.hideWhile(seq, 'p02.sequence', hide);
      const words = ui.match({ id: 'p02.words', label: 'Match 6 key words: fibre, yarn, fabric, spinning, staple, filament', q: 'Tap a word, then tap its meaning.',
        pairs: [
          ['fibre', 'a very fine, hair-like strand', 'fibre-yarn-fabric'],
          ['yarn', 'a thread made of fibres twisted together', 'fibre-yarn-fabric'],
          ['fabric', 'a sheet made by weaving or knitting yarns', 'fibre-yarn-fabric'],
          ['spinning', 'the job of twisting fibres together'],
          ['staple', 'a short fibre, like cotton or wool'],
          ['filament', 'a very long, continuous fibre, like silk'],
        ] });
      ui.hideWhile(words, 'p02.words', hide);

      gateSpin(); gate(); Z.go(); P.go(); Lg.go();
    },
  });
})();
