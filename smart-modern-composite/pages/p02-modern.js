// Page 2 — Modern materials. Three pen-drawn benches, each predict → test → conclude:
//   1 graphene (zoom into a pencil line and peel one layer, load it against foil, put it in a circuit)
//   2 metal foam (drop a weight on an egg under nothing / a solid block / a foam block, then a float test)
//   3 titanium (salt-water tank with a years slider, same-size blocks on a scale, a hip implant)
// The notes for each material only appear once its conclusion is right; they blur again for the final match.
(function () {
  'use strict';
  const B = Ink.BLUE, RD = Ink.RED, GR = Ink.GREEN, rgba = Ink.rgba, geo = Ink.geo;
  const HANDF = (s) => `400 ${s}px "Gloria Hallelujah", "Comic Sans MS", cursive`;
  const LABF = (s) => `600 ${s}px Fredoka, "Arial Rounded MT Bold", system-ui, sans-serif`;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const close = (P) => P.concat([P[0]]);
  const arc = (cx, cy, rx, ry, a0, a1, n = 20) => { const o = []; for (let i = 0; i <= n; i++) { const a = a0 + ((a1 - a0) * i) / n; o.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); } return o; };
  const box = (x0, y0, w, h) => [[x0, y0], [x0 + w, y0], [x0 + w, y0 + h], [x0, y0 + h]];
  const PAPER = '#fbfaf5', W = 860, HH = 360;

  if (!document.getElementById('p02-css')) {
    const s = document.createElement('style'); s.id = 'p02-css';
    s.textContent = `
      .smc-lab { position: relative; margin: 0 0 calc(var(--R) * .6); padding: 12px 16px 16px; background: rgba(251,250,245,.9); }
      .smc-lab > * { position: relative; }
      .smc-step { font: 700 14px Fredoka, system-ui; letter-spacing: .08em; text-transform: uppercase; color: var(--red); line-height: 22px; }
      .smc-task, .smc-q { font-size: 19px; line-height: 1.5; margin: 0 0 8px; }
      .smc-task b, .smc-q b { font-family: Fredoka, system-ui; font-weight: 600; }
      .smc-btns { display: flex; flex-wrap: wrap; gap: 10px; align-items: stretch; margin: 0 0 8px; }
      .smc-btns .opt { flex: 1 1 170px; text-align: center; min-height: 52px; }
      .smc-cvw { transition: opacity .3s; }
      .smc-cvw.locked { opacity: .35; pointer-events: none; }
      .smc-list { font-size: 17px; line-height: 1.5; margin: 4px 0; min-height: 26px; }
      .smc-say { font-size: 18px; line-height: 1.5; margin: 0 0 4px; min-height: 27px; }
      .smc-conc { display: none; margin-top: 6px; padding-top: 6px; border-top: 2px dashed rgba(30,46,150,.3); }
      .smc-conc.on { display: block; }
      .smc-conc .opts { grid-template-columns: 1fr 1fr; }
      .smc-locked { font-size: 17px; opacity: .75; }
      .smc-notes p { margin: 0 0 4px; }
    `;
    document.head.appendChild(s);
  }

  // ---------- small drawing helpers ----------
  function text(x, s, px, py, o = {}) {
    x.save(); x.font = (o.font === 'hand' ? HANDF : LABF)(o.size || 22);
    x.fillStyle = rgba(o.color || B, o.a ?? 0.92); x.textAlign = o.align || 'center'; x.textBaseline = 'alphabetic';
    x.translate(px, py); if (o.rot) x.rotate(o.rot); x.fillText(s, 0, 0); x.restore();
  }
  function pen(x, pts, o = {}) {
    const P = o.wob === false ? pts : geo.wob(geo.seg(pts, 3), o.seed ?? 11, o.amp ?? 0.6);
    x.save(); x.strokeStyle = rgba(o.color || B, o.a ?? 0.85); x.lineWidth = o.w ?? 1.6; x.lineCap = 'round'; x.lineJoin = 'round'; if (o.dash) x.setLineDash(o.dash); x.beginPath();
    P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.stroke(); x.restore();
  }
  const dot = (x, px, py, r, a = 0.9, c = B) => { x.fillStyle = rgba(c, a); x.beginPath(); x.arc(px, py, r, 0, 7); x.fill(); };
  function fill(x, pts, style) { x.save(); x.fillStyle = style; x.beginPath(); pts.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.closePath(); x.fill(); x.restore(); }
  function paper(x, pts) { x.save(); x.globalCompositeOperation = 'source-over'; fill(x, pts, PAPER); x.restore(); }
  const hint = (x, s, px, py) => text(x, s, px, py, { font: 'hand', size: 22, color: RD });
  // a slotted "kg" mass with a ring on top; (cx, by) = middle of its base
  function mass(x, cx, by, w = 52, h = 40, seed = 3) {
    const P = [[cx - w / 2, by], [cx - w / 2 + 7, by - h], [cx + w / 2 - 7, by - h], [cx + w / 2, by]];
    paper(x, P); Ink.hatchFill(x, P, 1, B, 1.1); Ink.stroke(x, close(P), { w: 2.4, seed });
    pen(x, arc(cx, by - h - 5, 6, 6, Math.PI * 0.9, Math.PI * 2.1, 8), { w: 2.2, wob: false });
    x.save(); x.globalCompositeOperation = 'source-over'; x.fillStyle = PAPER; x.fillRect(cx - 17, by - h / 2 - 12, 34, 24); x.restore();
    text(x, 'kg', cx, by - h / 2 + 7, { size: 22 });
  }

  // an interactive canvas with an on-demand render loop (stops when the page is hidden)
  function Stage(parent, Wd, Hh, touch) {
    const c = document.createElement('canvas'); c.className = 'lab-cv'; parent.appendChild(c);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = Math.round(Wd * dpr); c.height = Math.round(Hh * dpr);
    Object.assign(c.style, { width: '100%', height: 'auto', aspectRatio: Wd + ' / ' + Hh, display: 'block', touchAction: touch || 'manipulation', userSelect: 'none', webkitUserSelect: 'none', webkitTouchCallout: 'none', cursor: 'pointer' });
    const ctx = c.getContext('2d');
    const S = { c, ctx, W: Wd, H: Hh, dpr, render: () => false };
    S.pos = (e) => { const r = c.getBoundingClientRect(); return [((e.clientX - r.left) * Wd) / r.width, ((e.clientY - r.top) * Hh) / r.height]; };
    S.layer = (w, h, paint) => { const L = document.createElement('canvas'); L.width = Math.ceil(w * dpr); L.height = Math.ceil(h * dpr); const x = L.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.lineCap = 'round'; x.lineJoin = 'round'; paint(x); L.w = w; L.h = h; return L; };
    S.blit = (L, px, py) => ctx.drawImage(L, px, py, L.w, L.h);
    const hidden = () => { const p = c.closest('.page'); return !p || p.classList.contains('hidden'); };
    let raf = 0, wait = 0, last = 0;
    const tick = (now) => {
      raf = 0;
      if (hidden()) { last = 0; if (!wait) wait = setTimeout(() => { wait = 0; S.go(); }, 400); return; }
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60; last = now;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.globalCompositeOperation = 'source-over'; ctx.clearRect(0, 0, Wd, Hh);
      ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = 1; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      if (S.render(dt, now / 1000)) raf = requestAnimationFrame(tick); else last = 0;
    };
    S.go = () => { if (!raf) raf = requestAnimationFrame(tick); };
    c.addEventListener('contextmenu', (e) => e.preventDefault());
    if (document.fonts) document.fonts.ready.then(() => { S.onFonts && S.onFonts(); S.go(); });
    return S;
  }

  // ======================================================================================
  // Bench 1: graphene
  // ======================================================================================
  function sceneGraphene(S, api) {
    const had = api.had;
    let zoom = had('peel') ? 2 : 0, pz = zoom ? 1 : 0, pp = zoom === 2 ? 1 : 0;       // zoom stage and its animations
    const drop = [had('load') ? 2 : 0, had('load') ? 2 : 0], dy = [had('load') ? 1 : 0, had('load') ? 1 : 0];
    let strip = had('circuit'), sp = strip ? 1 : 0;
    const CXZ = 150, CYZ = 138, RZ = 108;
    let stat;
    const build = () => { stat = S.layer(W, HH, (x) => {
      // zone 1: pencil line + lens outline
      Ink.stroke(x, [[22, 302], [120, 300], [196, 302]], { w: 4.4, seed: 3 });
      const pb = [[200, 298], [262, 240], [276, 254], [214, 310]]; paper(x, pb); Ink.stroke(x, close(pb), { w: 2.2, seed: 4 });
      Ink.stroke(x, [[200, 298], [192, 304], [214, 310]], { w: 2, seed: 5, retrace: false }); pen(x, [[207, 304], [269, 247]], { w: 1.2, a: 0.6 });
      Ink.stroke(x, geo.ellipse(100, 301, 10, 10), { w: 2, seed: 6, retrace: false, color: RD });
      pen(x, [[91, 296], [58, 226]], { w: 1.4, color: RD, a: 0.6 }); pen(x, [[109, 296], [226, 218]], { w: 1.4, color: RD, a: 0.6 });
      Ink.hatchShadow(x, geo.ellipse(CXZ, CYZ, RZ, RZ), 1, 6, 6); paper(x, geo.ellipse(CXZ, CYZ, RZ, RZ)); Ink.stroke(x, geo.ellipse(CXZ, CYZ, RZ, RZ), { w: 3, seed: 7 });
      // zone 2: two frames on a bench
      Ink.stroke(x, [[306, 300], [590, 300]], { w: 2.8, seed: 11 });
      [322, 428, 462, 568].forEach((px, i) => Ink.stroke(x, [[px, 300], [px, 186]], { w: 3, seed: 12 + i }));
      text(x, 'kitchen foil', 375, 336); text(x, 'graphene', 515, 336);
      // zone 3: the circuit with a gap
      const cell = box(631, 150, 28, 80); Ink.hatchFill(x, cell, 1, B, 0.8); Ink.stroke(x, close(cell), { w: 2.4, seed: 21 });
      Ink.stroke(x, box(639, 142, 12, 8).concat([[639, 142]]), { w: 2, seed: 22, retrace: false }); text(x, '+', 645, 176, { size: 24 });
      Ink.stroke(x, [[645, 142], [645, 100], [718, 100]], { w: 2.6, seed: 23 }); Ink.stroke(x, [[762, 100], [830, 100], [830, 270], [776, 270]], { w: 2.6, seed: 24 });
      Ink.stroke(x, [[694, 270], [645, 270], [645, 230]], { w: 2.6, seed: 25 });
      Ink.stroke(x, [[718, 100], [730, 100], [730, 88], [750, 88], [750, 100], [762, 100]], { w: 2.4, seed: 26 });
      [700, 770].forEach((px, i) => { paper(x, geo.ellipse(px, 270, 6, 6)); Ink.stroke(x, geo.ellipse(px, 270, 6, 6), { w: 2, seed: 27 + i, retrace: false }); });
    }); };
    build(); S.onFonts = build;
    // hexagon lattice segments (flat-top hexagons)
    const HEX = []; { const R = 12, hw = R * Math.sqrt(3) / 2; for (let i = -6; i <= 6; i++) for (let j = -3; j <= 3; j++) { const cx = i * 1.5 * R, cy = (j + (Math.abs(i) % 2) / 2) * 2 * hw; HEX.push(arc(cx, cy, R, R, 0, Math.PI * 2, 6)); } }
    const sheetStrip = (x, P) => { pen(x, P, { w: 2.2, color: RD, wob: false, dash: [2, 5] }); pen(x, P.map(([a, b]) => [a, b + 2]), { w: 1, color: RD, wob: false, a: 0.5 }); };

    S.render = (dt, t) => {
      const x = S.ctx; let busy = false;
      S.blit(stat, 0, 0);
      // ---------------- zone 1: zoom and peel
      if (zoom >= 1 && pz < 1) { pz = Math.min(1, pz + dt / 0.6); busy = true; }
      if (zoom === 2 && pp < 1) { pp = Math.min(1, pp + dt / 1.4); busy = true; if (pp >= 1) { api.mark('peel'); api.say('One layer came away. From the side (red) it is a <b>single row of atoms</b>. Laid flat (top) you can see how its atoms are joined together.'); } }
      x.save(); x.beginPath(); x.arc(CXZ, CYZ, RZ - 4, 0, 7); x.clip();
      if (zoom === 0) { Ink.drawBubble(x, '?', CXZ, CYZ + 28, 80, B, 1, Math.sin(t * 2.5) * 0.05, 'center'); busy = true; }
      else {
        const lift = clamp(pp / 0.45), flat = clamp((pp - 0.45) / 0.55);
        for (let k = 0; k < 6; k++) { // the stack of layers, side-on: rows of atoms
          const top = k === 0, y = 172 + k * 13 - (top ? lift * 28 : 0), n = Math.round(lerp(0, 17, pz));
          for (let i = 0; i < n; i++) { const ax = 54 + i * 12 + (k % 2) * 6 + (top ? lift * 6 : 0); dot(x, ax, y, 3.3, 0.9, top && zoom === 2 ? RD : B); if (i) pen(x, [[ax - 12, y], [ax, y]], { w: 1.2, wob: false, color: top && zoom === 2 ? RD : B, a: 0.7 }); }
        }
        if (zoom === 2 && lift > 0.1) { const ty = 172 - lift * 28; const tp = [[238, ty - 9], [262, ty - 22], [266, ty - 14], [242, ty - 1]]; pen(x, close(tp), { w: 1.6, wob: false }); } // the sticky tape
        if (flat > 0) { // the same layer laid flat: hexagons
          x.save(); x.translate(CXZ, 92); x.rotate(-0.08); x.beginPath(); x.rect(-78, -40, 156 * flat, 80); x.clip();
          HEX.forEach((h) => { pen(x, h, { w: 1.5, wob: false, color: RD, a: 0.8 }); }); HEX.forEach((h) => h.slice(0, 6).forEach(([a, b]) => dot(x, a, b, 2.6, 0.9, RD)));
          x.restore();
        }
      }
      x.restore();
      if (zoom === 0) hint(x, 'tap the lens to zoom in', 150, 342); else if (zoom === 1 && pz >= 1) hint(x, 'tap to peel off one layer', 150, 342);
      // ---------------- zone 2: load the two sheets
      [0, 1].forEach((i) => {
        const cx = i ? 515 : 375, x0 = cx - 53, x1 = cx + 53, end = i ? 196 : 300;
        if (drop[i] === 1) { dy[i] = Math.min(1, dy[i] + dt * (1.4 + dy[i] * 5)); busy = true; if (dy[i] >= 1) { drop[i] = 2; Book.sfx(i ? 'tock' : 'thud', { gain: 0.5 }); if (drop[0] === 2 && drop[1] === 2) api.mark('load'); api.say(i ? 'The one-atom sheet <b>held</b> the weight. <span class="small">(A model: not to scale.)</span>' : 'The foil <b>tore</b> and the weight crashed through.'); } }
        const by = lerp(110, end, dy[i] * dy[i]), torn = !i && by > 192, sag = i ? clamp((by - 186) / 10) * 6 : 0;
        if (!i) { // foil: a thick shiny sheet
          if (torn) { Ink.stroke(x, [[x0, 190], [x0 + 26, 204], [x0 + 34, 236]], { w: 3.2, seed: 31 }); Ink.stroke(x, [[x1, 190], [x1 - 24, 206], [x1 - 30, 240]], { w: 3.2, seed: 32 }); }
          else { Ink.stroke(x, [[x0, 190], [x1, 190]], { w: 3.6, seed: 33 }); pen(x, [[x0 + 4, 194], [x1 - 4, 194]], { w: 1.2, a: 0.6 }); }
        } else sheetStrip(x, [[x0, 190], [cx - 26, 190 + sag], [cx + 26, 190 + sag], [x1, 190]]);
        mass(x, cx, by, 52, 40, 35 + i);
        if (drop[i] === 0) hint(x, 'tap', cx, 58);
      });
      // ---------------- zone 3: the circuit
      const spT = strip ? 1 : 0; if (Math.abs(spT - sp) > 0.01) { sp += clamp(spT - sp, -dt * 3, dt * 3); busy = true; if (strip && sp >= 0.99) { sp = 1; Book.sfx('click', { gain: 0.5 }); api.mark('circuit'); api.say('The bulb lit: the one-atom sheet lets <b>electricity flow</b> through it.'); } }
      const sy = lerp(318, 270, sp), lit = sp >= 0.99;
      sheetStrip(x, [[690, sy], [780, sy]]); pen(x, [[690, sy - 5], [780, sy - 5], [780, sy + 6], [690, sy + 6], [690, sy - 5]], { w: 1, color: RD, wob: false, a: 0.35 });
      if (lit) { const g = x.createRadialGradient(740, 66, 4, 740, 66, 60); g.addColorStop(0, 'rgba(255,222,40,.95)'); g.addColorStop(1, 'rgba(255,238,120,0)'); x.fillStyle = g; x.fillRect(676, 4, 128, 126); }
      Ink.stroke(x, arc(740, 66, 21, 21, Math.PI * 0.68, Math.PI * 2.32, 20), { w: 2.4, seed: 41 }); pen(x, [[733, 88], [735, 70], [740, 76], [745, 70], [747, 88]], { w: 1.4, wob: false });
      if (lit) { for (let i = 0; i < 7; i++) { const a = Math.PI * (1.05 + 0.15 * i), r1 = 40 + 4 * Math.sin(t * 5 + i); pen(x, [[740 + Math.cos(a) * 29, 66 + Math.sin(a) * 29], [740 + Math.cos(a) * r1, 66 + Math.sin(a) * r1]], { w: 2.2, color: RD, wob: false }); } busy = true; }
      if (!strip) { text(x, 'graphene', 735, 348); hint(x, 'tap', 812, 326); }
      return busy;
    };
    S.c.addEventListener('click', (e) => {
      const [px, py] = S.pos(e);
      if (px < 296) { if (zoom === 0) { zoom = 1; Book.sfx('pop', { gain: 0.4 }); } else if (zoom === 1 && pz >= 1) { zoom = 2; Book.sfx('tape', { gain: 0.5 }); } }
      else if (px < 600) { const i = px < 445 ? 0 : 1; if (drop[i] === 0) { drop[i] = 1; Book.sfx('tick', { gain: 0.4 }); } }
      else if (!strip) { strip = true; Book.sfx('tick', { gain: 0.4 }); }
      void py; S.go();
    });
  }

  // ======================================================================================
  // Bench 2: metal foam
  // ======================================================================================
  function sceneFoam(S, api) {
    const had = api.had, CXS = [100, 280, 460], BEN = 300;
    const col = CXS.map((_, i) => ({ ph: had('drop' + i) ? 2 : 0, p: had('drop' + i) ? 1 : 0, shake: 0 }));
    const cube = [{ ph: had('floatS') ? 2 : 0, p: had('floatS') ? 1 : 0 }, { ph: had('floatF') ? 2 : 0, p: had('floatF') ? 1 : 0 }];
    const END = [292, 204, 228];                                    // where the base of the weight ends up
    const rr = H.rng(23), PORES = []; for (let i = 0; i < 26; i++) PORES.push([rr.range(-42, 42), rr.range(0.1, 0.9), rr.range(3, 6.5)]);
    const CP = []; for (let i = 0; i < 9; i++) CP.push([rr.range(-14, 14), rr.range(-14, 14), rr.range(2, 4.4)]);
    let stat;
    const build = () => { stat = S.layer(W, HH, (x) => {
      Ink.stroke(x, [[14, BEN], [566, BEN]], { w: 2.8, seed: 3 });
      text(x, 'no block', 100, 336); text(x, 'solid aluminium', 280, 336); text(x, 'aluminium foam', 460, 336);
      // tank
      Ink.stroke(x, [[612, 150], [612, BEN], [842, BEN], [842, 150]], { w: 2.8, seed: 5 });
      pen(x, [[614, 186], [840, 186]], { w: 1.6, seed: 6 }); Ink.hatchFill(x, box(614, 188, 226, 110), 1, B, 0.35);
      text(x, 'solid', 665, 58); text(x, 'foam', 785, 58); text(x, 'water', 727, 336);
    }); };
    build(); S.onFonts = build;
    const SAY = ['No block: the egg took the whole blow.', 'The solid block <b>did not change shape</b>. The blow went straight through it: cracked egg.', 'The foam block was <b>crushed almost flat</b>, and stayed crushed. The egg underneath is fine.'];
    const egg = (x, cx, state) => {
      Ink.stroke(x, [[cx - 15, 284], [cx - 10, BEN - 1], [cx + 10, BEN - 1], [cx + 15, 284]], { w: 2.2, seed: 8 });
      if (state === 'ok') { const E = geo.ellipse(cx, 270, 15, 19); paper(x, E); Ink.stroke(x, E, { w: 2.2, seed: 9 }); }
      else if (state === 'crack') { const E = geo.ellipse(cx, 270, 15, 19); paper(x, E); Ink.stroke(x, E, { w: 2.2, seed: 9 }); pen(x, [[cx - 4, 252], [cx + 3, 260], [cx - 5, 267], [cx + 4, 275], [cx - 2, 284]], { w: 2.2, color: RD, wob: false }); pen(x, [[cx + 3, 260], [cx + 11, 263]], { w: 1.8, color: RD, wob: false });
        fill(x, geo.ellipse(cx + 20, 293, 9, 4), 'rgba(255,200,30,.8)'); pen(x, [[cx + 13, 278], [cx + 17, 290]], { w: 2, color: RD, wob: false }); }
      else { fill(x, geo.ellipse(cx, 295, 40, 6), 'rgba(255,200,30,.8)'); pen(x, geo.ellipse(cx, 295, 40, 6), { w: 1.6, wob: false }); [[-30, -8, -18, 2], [-8, -12, 4, -2], [20, -9, 32, 1]].forEach(([a, b, c, d], i) => pen(x, [[cx + a, 290 + b], [cx + (a + c) / 2, 284 + b + i], [cx + c, 290 + d]], { w: 2.2, wob: false })); }
    };
    S.render = (dt, t) => {
      const x = S.ctx; let busy = false;
      S.blit(stat, 0, 0);
      col.forEach((c, i) => {
        const cx = CXS[i];
        if (c.ph === 1) { c.p = Math.min(1, c.p + dt * (1.2 + c.p * 6)); busy = true; if (c.p >= 1) { c.ph = 2; c.shake = 0.35; Book.sfx(i === 1 ? 'impact' : 'thud', { gain: 0.6 }); api.mark('drop' + i); api.say(SAY[i]); } }
        if (c.shake > 0) { c.shake = Math.max(0, c.shake - dt); busy = true; }
        const by = lerp(86, END[i], c.p * c.p), hit = c.ph === 2, sh = c.shake > 0 ? Math.sin(t * 70) * c.shake * 8 : 0;
        egg(x, cx, !hit ? 'ok' : i === 0 ? 'splat' : i === 1 ? 'crack' : 'ok');
        if (i === 1) { const bl = box(cx - 48, 204, 96, 46); paper(x, bl); Ink.hatchFill(x, bl, 1, B, 1.5); Ink.stroke(x, close(bl), { w: 2.6, seed: 12 });
          if (c.shake > 0) [-24, 0, 24].forEach((dx) => pen(x, [[cx + dx, 256], [cx + dx - 5, 264], [cx + dx + 5, 270], [cx + dx, 278]], { w: 2, color: RD, wob: false })); }
        if (i === 2) { const top = Math.max(204, Math.min(228, by)), h = 250 - top, bl = box(cx - 48, top, 96, h); paper(x, bl); Ink.stroke(x, close(bl), { w: 2.6, seed: 13 });
          x.save(); x.beginPath(); x.rect(cx - 47, top + 1, 94, h - 2); x.clip(); PORES.forEach(([dx, fy, r], k) => pen(x, geo.ellipse(cx + dx, top + fy * h, r, r * h / 46), { w: 1.3, wob: false, a: 0.8, seed: k })); x.restore();
          if (hit) Ink.tick(x, cx + 62, 282, 0.9); }
        mass(x, cx + sh, by, 70, 46, 15 + i);
        if (c.ph === 0) hint(x, 'tap to drop', cx, 30);
      });
      // float test
      cube.forEach((c, i) => {
        const cx = i ? 785 : 665, end = i ? 180 : 279;
        if (c.ph === 1) { c.p = Math.min(1, c.p + dt * (1.1 + c.p * 3)); busy = true; if (c.p >= 1) { c.ph = 2; Book.sfx('pop', { gain: 0.4 }); api.mark(i ? 'floatF' : 'floatS'); api.say(i ? 'The foam cube <b>floats</b>.' : 'The solid cube <b>sank</b> straight to the bottom.'); } }
        const bob = c.ph === 2 && i ? Math.sin(t * 2.2) * 2.5 : 0, cy = lerp(96, end, c.p * c.p) + bob, q = box(cx - 19, cy - 19, 38, 38);
        paper(x, q); if (!i) Ink.hatchFill(x, q, 1, B, 1.5); else CP.forEach(([dx, dy2, r], k) => pen(x, geo.ellipse(cx + dx, cy + dy2, r, r), { w: 1.2, wob: false, a: 0.8, seed: k }));
        Ink.stroke(x, close(q), { w: 2.4, seed: 17 + i });
        if (c.ph === 0) hint(x, 'tap', cx, 142); if (c.ph === 2 && i) busy = true;
      });
      return busy;
    };
    S.c.addEventListener('click', (e) => {
      const [px] = S.pos(e);
      if (px < 580) { const i = px < 190 ? 0 : px < 370 ? 1 : 2; if (col[i].ph === 0) { col[i].ph = 1; Book.sfx('tick', { gain: 0.4 }); } }
      else { const i = px < 727 ? 0 : 1; if (cube[i].ph === 0) { cube[i].ph = 1; Book.sfx('tick', { gain: 0.4 }); } }
      S.go();
    });
  }

  // ======================================================================================
  // Bench 3: titanium
  // ======================================================================================
  function sceneTitanium(S, api) {
    const had = api.had;
    let yrs = had('tank') ? 20 : 0, drag = false, moved = had('tank');
    let on = -1, mv = 1; const seen = [had('weigh'), had('weigh')], GRAMS = ['790 g', '450 g'];
    let fit = had('implant'), fp = fit ? 1 : 0;
    const SL = { x0: 40, x1: 212, y: 328 };
    const rr = H.rng(31), BLOTS = []; for (let i = 0; i < 18; i++) BLOTS.push([rr.range(-14, 14), rr.range(0, 1), rr.range(2.5, 6)]);
    let stat;
    const build = () => { stat = S.layer(W, HH, (x) => {
      // tank of salt water
      Ink.stroke(x, [[20, 106], [20, 290], [310, 290], [310, 106]], { w: 2.8, seed: 3 }); pen(x, [[22, 138], [308, 138]], { w: 1.6, seed: 4 });
      Ink.hatchFill(x, box(22, 140, 286, 148), 1, B, 0.3);
      text(x, 'steel', 100, 60); text(x, 'titanium', 222, 60); text(x, 'salt', 276, 232, { size: 22, a: 0.7 }); text(x, 'water', 272, 258, { size: 22, a: 0.7 });
      Ink.stroke(x, [[SL.x0, SL.y], [SL.x1, SL.y]], { w: 3, seed: 5 }); for (let i = 0; i <= 4; i++) { const tx = lerp(SL.x0, SL.x1, i / 4); pen(x, [[tx, SL.y - 7], [tx, SL.y + 7]], { w: 1.5, wob: false, a: 0.7 }); }
      // shelf and scale
      Ink.stroke(x, [[378, 172], [562, 172]], { w: 2.8, seed: 7 }); pen(x, [[390, 172], [390, 186]], { w: 2 }); pen(x, [[550, 172], [550, 186]], { w: 2 });
      text(x, 'steel', 425, 78); text(x, 'titanium', 520, 78); text(x, 'same size', 470, 208, { font: 'hand', size: 22, a: 0.8 });
      const pl = box(408, 268, 124, 10); Ink.hatchFill(x, pl, 1, B, 1.6); Ink.stroke(x, close(pl), { w: 2.2, seed: 8 });
      const bd = [[400, 282], [540, 282], [552, 340], [388, 340]]; Ink.hatchShadow(x, bd, 1, 5, 5); paper(x, bd); Ink.stroke(x, close(bd), { w: 2.6, seed: 9 }); pen(x, [[470, 278], [470, 282]], { w: 4 });
      Ink.stroke(x, geo.rect(422, 294, 96, 36, 5), { w: 2, seed: 10, retrace: false });
      // hip: pelvis socket and thigh bone
      Ink.stroke(x, arc(742, 118, 40, 40, Math.PI * 0.95, Math.PI * 2.1, 22), { w: 2.8, seed: 12 }); pen(x, arc(742, 118, 52, 54, Math.PI * 1.05, Math.PI * 1.95, 18), { w: 1.6, a: 0.6 });
      Ink.stroke(x, [[716, 168], [690, 172], [684, 196], [700, 212], [706, 330]], { w: 2.6, seed: 13 }); Ink.stroke(x, [[760, 162], [770, 196], [764, 330]], { w: 2.6, seed: 14 });
      pen(x, [[716, 168], [760, 162]], { w: 2, a: 0.8 });
    }); };
    build(); S.onFonts = build;
    const bar = (x, cx, seed) => { const P = box(cx - 18, 78, 36, 196); paper(x, P); Ink.hatchFill(x, P, 1, B, 1.2); Ink.stroke(x, close(P), { w: 2.6, seed }); };
    const implant = (x, ox, oy) => {
      const st = [[742 + ox, 150 + oy], [752 + ox, 156 + oy], [742 + ox, 286 + oy], [732 + ox, 286 + oy], [728 + ox, 172 + oy]];
      paper(x, st); Ink.hatchFill(x, st, 1, B, 2.2); Ink.stroke(x, close(st), { w: 2.2, seed: 21 });
      Ink.stroke(x, [[736 + ox, 152 + oy], [742 + ox, 132 + oy]], { w: 5, seed: 22 });
      const bl = geo.ellipse(744 + ox, 122 + oy, 15, 15); paper(x, bl); Ink.hatchFill(x, bl, 1, B, 2); Ink.stroke(x, bl, { w: 2.4, seed: 23 });
    };
    S.render = (dt, t) => {
      const x = S.ctx; let busy = drag;
      // --- tank: steel rusts with the years, titanium does not
      const q = yrs / 20;
      bar(x, 100, 31); bar(x, 222, 32);
      if (q > 0.02) {
        const rz = box(82, 128, 36, 146); fill(x, rz, `rgba(200,84,20,${0.55 * q})`); Ink.hatchFill(x, rz, 1, RD, 0.6 + 2.4 * q);
        BLOTS.slice(0, Math.round(q * 18)).forEach(([dx, fy, r]) => { dot(x, 100 + dx, 132 + fy * 138, r * (0.5 + 0.5 * q), 0.75, [150, 50, 14]); });
        if (q > 0.45) { x.save(); x.globalCompositeOperation = 'source-over'; x.fillStyle = PAPER; [[82, 180, 7, 16], [112, 222, 7, 20], [82, 246, 6, 14]].slice(0, Math.round((q - 0.4) * 5)).forEach(([a, b, c, d]) => x.fillRect(a - 1, b, c, d)); x.restore();
          for (let i = 0; i < Math.round((q - 0.45) * 22); i++) pen(x, [[60 + (i * 37) % 86, 284 - (i % 3) * 2], [66 + (i * 37) % 86, 285 - (i % 3) * 2]], { w: 2.4, color: RD, wob: false }); }
      }
      S.blit(stat, 0, 0);
      const kx = lerp(SL.x0, SL.x1, q);
      x.save(); x.globalCompositeOperation = 'source-over'; x.fillStyle = PAPER; x.beginPath(); x.arc(kx, SL.y, 19, 0, 7); x.fill(); x.restore();
      Ink.stroke(x, geo.ellipse(kx, SL.y, 19, 19), { w: 3, color: RD, seed: 9 }); dot(x, kx, SL.y, 6, 0.9, RD);
      text(x, Math.round(yrs) + (Math.round(yrs) === 1 ? ' year' : ' years'), 240, 336, { size: 24, align: 'left', color: RD });
      if (!moved) hint(x, 'drag the years', 130, 310 - 12);
      // --- scale: same-size blocks
      if (mv < 1) { mv = Math.min(1, mv + dt * 3); busy = true; if (mv >= 1 && on >= 0) { Book.sfx('tock', { gain: 0.4 }); seen[on] = true; if (seen[0] && seen[1]) api.mark('weigh'); api.say(`Same size, but the ${on ? 'titanium' : 'steel'} block reads <b>${GRAMS[on]}</b>.` + (seen[0] && seen[1] ? ' Titanium is not far off <b>half the weight</b> of steel.' : '')); } }
      [0, 1].forEach((i) => {
        const hx = i ? 520 : 425, e = on === i ? mv : 0, cx = lerp(hx, 470, e), by = lerp(170, 266, e), P = box(cx - 24, by - 48, 48, 48);
        paper(x, P); Ink.hatchFill(x, P, 1, B, i ? 0.9 : 1.6); Ink.stroke(x, close(P), { w: 2.4, seed: 41 + i });
        if (seen[i]) text(x, GRAMS[i], hx, 108, { font: 'hand', size: 22, color: RD });
        else if (on !== i) hint(x, 'tap', hx, 108);
      });
      text(x, on >= 0 && mv >= 1 ? GRAMS[on] : '0 g', 470, 321, { size: 24 });
      // --- hip implant
      const fT = fit ? 1 : 0; if (Math.abs(fT - fp) > 0.01) { fp += clamp(fT - fp, -dt * 1.2, dt * 1.2); busy = true; if (fit && fp >= 0.99) { fp = 1; Book.sfx('success', { gain: 0.3 }); api.mark('implant'); api.say('Ten years on, the titanium hip joint is still in place: the body has <b>not rejected</b> it.'); } }
      const e2 = 1 - fp; implant(x, e2 * 74, -e2 * 20);
      if (!fit) { hint(x, 'tap to fit', 800, 250); text(x, 'titanium', 812, 60); }
      else if (fp >= 1) { text(x, '10 years on', 726, 44, { size: 24 }); Ink.tick(x, 808, 40, 1); }
      return busy;
    };
    const setY = (px) => { const ny = clamp((px - SL.x0) / (SL.x1 - SL.x0)) * 20; if (Math.round(ny) !== Math.round(yrs)) Book.sfx('tick', { gain: 0.25 }); yrs = ny; moved = true;
      if (yrs >= 15) { api.mark('tank'); api.say('After ' + Math.round(yrs) + ' years in salt water the steel bar is <b>eaten away by rust</b>. The titanium bar looks exactly as it did on day one.'); } };
    const onSl = (px, py) => px < 330 && py > 286;
    S.c.addEventListener('pointerdown', (e) => { const [px, py] = S.pos(e); if (onSl(px, py)) { drag = true; try { S.c.setPointerCapture(e.pointerId); } catch (er) {} setY(px); e.preventDefault(); S.go(); } });
    S.c.addEventListener('pointermove', (e) => { if (drag) { setY(S.pos(e)[0]); S.go(); } });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((ev) => S.c.addEventListener(ev, () => { drag = false; S.go(); }));
    S.c.addEventListener('click', (e) => {
      const [px, py] = S.pos(e); if (onSl(px, py)) return;
      if (px < 330) { yrs = yrs >= 15 ? 0 : 20; setY(lerp(SL.x0, SL.x1, yrs / 20)); }
      else if (px < 606) { const i = px < 472 ? 0 : 1; if (mv >= 1) { on = on === i ? (i ? 0 : 1) : i; mv = 0; Book.sfx('tick', { gain: 0.4 }); } }
      else if (!fit) { fit = true; Book.sfx('tick', { gain: 0.4 }); }
      S.go();
    });
  }

  // ======================================================================================
  // one bench: predict → test → conclude → notes
  // ======================================================================================
  function Bench(ui, cfg) {
    const el = ui.el, esc = Book.esc;
    const lab = el('div', 'smc-lab'); requestAnimationFrame(() => Ink.frame(lab, { shadow: false, w: 2.2 }));
    el('div', 'smc-step', cfg.step, lab); el('p', 'smc-task', cfg.task, lab);
    el('p', 'smc-q', '<b>Predict:</b> ' + cfg.predQ, lab);
    const predRow = el('div', 'smc-btns', '', lab);
    const cvw = el('div', 'smc-cvw', '', lab), S = Stage(cvw, W, HH, 'pan-y');
    const list = el('div', 'smc-list', '', lab), say = el('p', 'smc-say', '', lab);
    const conc = el('div', 'smc-conc', '', lab); el('p', 'smc-q', cfg.concQ, conc);
    const concRow = el('div', 'opts', '', conc), fb = el('div', 'fb', '', conc);
    const notes = ui.box(`<div class="smc-notes"><p class="smc-locked">🔒 Finish ${cfg.short} to unlock these notes.</p></div>`, { tag: 'Notes: ' + cfg.name });

    const r = ui.record(cfg.id, { label: cfg.label, type: 'experiment', max: 1 });
    const prev = r.get() || {};
    const st = { pred: prev.pred || '', tests: (prev.tests || []).slice(), conc: prev.conc || '', tries: prev.tries || 0, ok: prev.correct === true };
    const needAll = () => cfg.tests.every((g) => g.keys.every((k) => st.tests.includes(k)));
    const commit = () => {
      const tdone = cfg.tests.filter((g) => g.keys.every((k) => st.tests.includes(k))).length;
      r.set({ answer: `predicted "${st.pred}"; tests done ${tdone}/${cfg.tests.length}` + (st.conc ? `; concluded "${st.conc}" ${st.ok ? '✓' : '✗'}${st.tries > 1 ? ' (try ' + st.tries + ')' : ''}` : ''),
        correct: st.conc ? st.ok : null, score: st.ok ? 1 : 0, max: 1, mis: st.conc && !st.ok ? cfg.mis : '', pred: st.pred, tests: st.tests.slice(), conc: st.conc, tries: st.tries });
    };
    const show = () => {
      list.innerHTML = cfg.tests.map((g) => `<b>${g.keys.every((k) => st.tests.includes(k)) ? '☑' : '☐'}</b> ${g.name}`).join(' &nbsp; ');
      cvw.classList.toggle('locked', !st.pred);
      if (!st.pred) say.innerHTML = '<span class="small red">Make your prediction first: then the bench unlocks.</span>';
      else if (!say.dataset.said) say.innerHTML = needAll() ? '<span class="small">All tests done. You can still play with the bench.</span>' : '<span class="small">Tap the drawing to run each test.</span>';
      if (needAll() && !conc.classList.contains('on')) conc.classList.add('on');
      if (st.tests.length) predBtns.forEach((b) => (b.disabled = true));
    };
    const predBtns = cfg.predOpts.map((t) => { const b = el('button', 'opt', esc(t), predRow); b.type = 'button'; if (st.pred === t) b.classList.add('sel');
      b.onclick = () => { predBtns.forEach((q) => q.classList.remove('sel')); b.classList.add('sel'); st.pred = t; Book.scribble(0.12); commit(); show(); S.go(); }; return b; });
    const api = {
      had: (k) => st.tests.includes(k),
      mark(k) { if (st.tests.includes(k)) return; st.tests.push(k); if (!st.ok) commit(); if (needAll()) Book.sfx('paper', { gain: 0.4 }); show(); },
      say(html) { say.dataset.said = '1'; say.innerHTML = html; },
    };
    function finish(quiet) {
      notes.querySelector('.smc-notes').innerHTML = cfg.notes; concBtns.forEach((q) => (q.disabled = true));
      const pk = st.pred === cfg.predRight;
      fb.className = 'fb on good'; fb.innerHTML = `✓ ${cfg.right} ${st.pred ? (pk ? 'Your prediction was spot on.' : `You predicted “${esc(st.pred)}”: the bench has put that right.`) : ''} The notes are unlocked below.`;
      if (!quiet) Book.sfx('success', { gain: 0.35 });
    }
    const concBtns = Book.shuffle(cfg.concOpts, cfg.seed).map((op) => { const b = el('button', 'opt', esc(op.t), concRow); b.type = 'button'; b._op = op;
      b.onclick = () => {
        st.conc = op.t; st.tries++; st.ok = !!op.ok; b.classList.add(op.ok ? 'right' : 'wrong'); commit();
        if (op.ok) finish(); else { Book.sfx('error', { gain: 0.3 }); fb.className = 'fb on bad'; fb.innerHTML = '✗ ' + op.why; }
      }; return b; });
    cfg.scene(S, api);
    if (st.ok) { concBtns.forEach((b) => b._op.ok && b.classList.add('right')); finish(true); }
    show(); S.go();
    return { lab, notes };
  }

  // ======================================================================================
  Book.page({ id: 'p02', title: 'Modern materials', build(ui, root) {
    ui.h('Modern materials');
    ui.p('<b>Modern materials</b> have been developed through <b>new or improved processes</b>. Here are three. On each bench: <b>predict</b>, run every test, then say what you found. The notes unlock when you get it right.');

    const b1 = Bench(ui, {
      id: 'p02.graphene', seed: 5, key: 'graphene', name: 'graphene', short: 'bench 1', step: 'Bench 1 · graphene', label: 'Graphene bench: prediction, 3 tests, what graphene is', mis: 'graphene-structure',
      task: 'Pencil “lead” is <b>graphite</b>, a form of carbon. Zoom into a pencil line and peel off a single layer with sticky tape: that layer is called <b>graphene</b>. Then load it and put it in a circuit.',
      predQ: 'your peeled layer is far, far thinner than kitchen foil. With the same weight on each, the graphene will…',
      predOpts: ['tear before the foil does', 'hold when the foil tears', 'stretch like a rubber band'], predRight: 'hold when the foil tears',
      tests: [{ name: 'zoom in and peel a layer', keys: ['peel'] }, { name: 'load both sheets', keys: ['load'] }, { name: 'bridge the circuit', keys: ['circuit'] }],
      scene: sceneGraphene, concQ: 'From what you saw through the lens: <b>what is graphene?</b>',
      concOpts: [
        { t: 'One layer of carbon atoms, joined in hexagons', ok: true },
        { t: 'A very thin sheet of a strong, shiny metal', why: 'It conducts like a metal, but you peeled it off pencil graphite: it is carbon, not a metal. Look at the lens again.' },
        { t: 'A clear plastic film that is made from oil', why: 'It is almost see-through like a film, but it came off graphite: it is pure carbon atoms, not a polymer.' },
        { t: 'A thick stack of carbon layers, like graphite', why: 'The thick stack is the graphite. Graphene is the part you peeled off: how many layers was that?' },
      ],
      right: 'Graphene is a single layer of carbon atoms, one atom thick, in a hexagon (honeycomb) pattern.',
      notes: `<p><span class="key">Graphene</span>: a <b>single layer of carbon atoms</b> (one atom thick) arranged in a <b>hexagonal</b> (honeycomb) lattice.</p>
        <p><b>Properties:</b> extremely <b>strong</b> (about 200 times stronger than steel by weight), extremely <b>lightweight</b>, flexible, almost transparent, an excellent <b>conductor</b> of heat and electricity. Expensive to make in large sheets.</p>
        <p><b>Uses</b> (being developed): flexible touch screens, faster batteries and electronics, lightweight sports equipment (tennis racquets, bike frames), water filters, coatings.</p>`,
    });
    const b2 = Bench(ui, {
      id: 'p02.foam', seed: 2, key: 'foam', name: 'metal foam', short: 'bench 2', step: 'Bench 2 · metal foam', label: 'Metal foam bench: prediction, drop + float tests, why foam protects', mis: 'metal-foam',
      task: '<b>Metal foam</b> is a metal (often aluminium) with lots of <b>gas bubbles</b> trapped inside it, like a metal sponge. Drop the heavy weight on all three eggs, then try the float test.',
      predQ: 'a heavy weight is dropped towards an egg. Which block will protect the egg best?',
      predOpts: ['the solid aluminium block', 'the aluminium foam block', 'both the same: same metal'], predRight: 'the aluminium foam block',
      tests: [{ name: 'drop the weight on all three', keys: ['drop0', 'drop1', 'drop2'] }, { name: 'float test both cubes', keys: ['floatS', 'floatF'] }],
      scene: sceneFoam, concQ: '<b>Why</b> did the foam block protect the egg best?',
      concOpts: [
        { t: 'It crumpled, soaking up the energy of the blow', ok: true },
        { t: 'It is harder than solid metal, so nothing got by', why: 'Look at the foam block now: it was squashed, so it is not harder. The block that kept its shape let the blow straight through.' },
        { t: 'It bounced the weight back up, just like a spring', why: 'A spring would bounce back. The foam stayed crushed. Where did the energy of the falling weight go?' },
        { t: 'It is heavier than solid metal, so it stayed put', why: 'Check the float test: the foam cube floated, so it is much lighter than the solid one.' },
      ],
      right: 'The foam crumples, and crumpling absorbs the energy of the impact.',
      notes: `<p><span class="key">Metal foam</span>: a metal (often <b>aluminium</b>) full of gas bubbles (pores). Made by injecting gas into molten metal, or with a foaming agent.</p>
        <p><b>Properties:</b> very <b>lightweight</b> (low density: some float on water), stiff and strong for its weight, <b>absorbs impact energy</b> by crumpling, good heat and sound insulation, recyclable.</p>
        <p><b>Uses:</b> car crumple zones and bumper reinforcement, aerospace panels, sound-proofing, heat exchangers, bone implants (titanium foam lets bone grow in).</p>`,
    });
    const b3 = Bench(ui, {
      id: 'p02.titanium', seed: 9, key: 'titanium', name: 'titanium', short: 'bench 3', step: 'Bench 3 · titanium', label: 'Titanium bench: prediction, tank + scale + implant, titanium properties', mis: 'titanium-props',
      task: '<b>Titanium</b> is a very strong metal. Leave it in salt water next to steel (drag the years), weigh same-size blocks of each, then fit a titanium hip joint.',
      predQ: 'a steel bar and a titanium bar stand in salt water for 20 years. You will see…',
      predOpts: ['both bars rusting', 'only the steel rusting', 'only the titanium rusting'], predRight: 'only the steel rusting',
      tests: [{ name: '15+ years in the tank', keys: ['tank'] }, { name: 'weigh both blocks', keys: ['weigh'] }, { name: 'fit the hip joint', keys: ['implant'] }],
      scene: sceneTitanium, concQ: 'Which line sums up <b>titanium</b>?',
      concOpts: [
        { t: 'Strong, light, never rusts, safe in the body', ok: true },
        { t: 'Strong but heavy, and it rusts in salt water', why: 'Look at the scale and the tank again: the titanium block was the lighter one, and its bar never changed.' },
        { t: 'Light and safe in the body, but rusts quickly', why: 'Half right. But which bar was eaten away in the tank? It was not the titanium one.' },
        { t: 'Never rusts, but heavy and the body rejects it', why: 'The rust part is right. But the titanium block was lighter than steel, and the hip joint was still fine ten years on.' },
      ],
      right: 'Titanium is strong, lightweight, resists corrosion and is biocompatible.',
      notes: `<p><span class="key">Titanium</span>: a non-ferrous metal, usually used as an alloy.</p>
        <p><b>Properties:</b> very <b>strong</b>, <b>lightweight</b> (about half the density of steel), excellent <b>corrosion resistance</b>, <b>biocompatible</b> (not rejected by the body), high melting point. But <b>expensive</b> and hard to process.</p>
        <p><b>Uses:</b> hip and knee replacements, dental implants, aircraft and spacecraft parts, racing bikes, glasses frames, watches, jewellery.</p>`,
    });

    ui.h('Which modern material?', { size: 40 });
    ui.p('Match each product to the material a designer would pick, and why. <span class="small">The benches and notes blur while you match: recall them!</span>');
    const hide = [b1.notes, b2.notes, b3.notes, b1.lab, b2.lab, b3.lab];
    const m = ui.match({ id: 'p02.uses', label: 'Match 6 products to graphene / metal foam / titanium', q: 'Tap a product, then tap the material that suits it.',
      pairs: [
        ['Car crumple zone', 'metal foam: crumples to absorb the crash', 'modern-mixup'],
        ['Hip replacement', 'titanium: strong, and the body accepts it', 'modern-mixup'],
        ['Flexible touch screen', 'graphene: bends, see-through, conducts', 'modern-mixup'],
        ['Sound-proof panel', 'metal foam: light, and it deadens noise', 'modern-mixup'],
        ['Faster battery', 'graphene: superb conductor of electricity', 'modern-mixup'],
        ['Spacecraft part', 'titanium: light, with a high melting point', 'modern-mixup'],
      ] });
    // blur the benches and notes from the first tap until every pair is matched
    const mDone = () => { const it = Book.state.items['p02.uses']; return !!it && (it.correct === true || it.correct === false); };
    const lock = (on) => hide.forEach((e) => e.classList.toggle('peek-lock', on));
    m.addEventListener('pointerdown', () => { if (!mDone()) lock(true); }, { passive: true });
    m.addEventListener('click', () => setTimeout(() => { if (mDone()) lock(false); }, 60));
  } });
})();
