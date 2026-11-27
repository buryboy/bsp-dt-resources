// Page 8 — Design the outfit. Six design briefs: pick a fibre and a construction (or a lining / a finish), press TEST
// and a pen-drawn scene shows whether it works. Every try is recorded. Ends with a 3-mark written explanation.
(function () {
  'use strict';
  const B = Ink.BLUE, RD = Ink.RED, GR = Ink.GREEN, rgba = Ink.rgba, geo = Ink.geo;
  const HANDF = (s) => `400 ${s}px "Gloria Hallelujah", "Comic Sans MS", cursive`;
  const LABF = (s) => `600 ${s}px Fredoka, "Arial Rounded MT Bold", system-ui, sans-serif`;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const mod = (a, n) => ((a % n) + n) % n;
  const ease = (u) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2);
  const got = (id) => Book.state.items[id];

  function text(x, s, px, py, o = {}) {
    x.save(); x.font = (o.font === 'hand' ? HANDF : LABF)(o.size || 22);
    x.fillStyle = rgba(o.color || B, o.a ?? 0.92); x.textAlign = o.align || 'left'; x.textBaseline = 'alphabetic';
    x.translate(px, py); if (o.rot) x.rotate(o.rot); x.fillText(s, 0, 0); x.restore();
  }
  function pen(x, pts, o = {}) {
    const P = o.wob === false ? pts : geo.wob(geo.seg(pts, 3), o.seed ?? 11, o.amp ?? 0.6);
    x.save(); x.strokeStyle = rgba(o.color || B, o.a ?? 0.85); x.lineWidth = o.w ?? 1.6; x.lineCap = 'round'; x.lineJoin = 'round';
    if (o.dash) x.setLineDash(o.dash);
    x.beginPath(); P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); if (o.close) x.closePath(); x.stroke(); x.restore();
  }
  const box4 = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]];

  // an interactive canvas with an on-demand render loop (stops when the page is hidden)
  function Stage(parent, W, Hh) {
    const c = document.createElement('canvas'); c.className = 'tc8-stage'; parent.appendChild(c);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = Math.round(W * dpr); c.height = Math.round(Hh * dpr);
    Object.assign(c.style, { width: '100%', height: 'auto', aspectRatio: W + ' / ' + Hh, display: 'block', touchAction: 'pan-y', userSelect: 'none', webkitUserSelect: 'none', webkitTouchCallout: 'none', cursor: 'pointer' });
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
    // drag inside a hit zone (that touch no longer scrolls the page); a touch that hardly moves is a tap
    S.drag = (hit, on) => {
      let id = null, p0 = null, moved = 0, tgt = null;
      c.addEventListener('touchstart', (e) => { if (hit(S.pos(e.changedTouches[0]))) e.preventDefault(); }, { passive: false });
      c.addEventListener('pointerdown', (e) => { const p = S.pos(e); tgt = hit(p); if (id !== null || !tgt) return; id = e.pointerId; p0 = p; moved = 0; try { c.setPointerCapture(id); } catch (er) {} on.start && on.start(p, tgt); S.go(); });
      c.addEventListener('pointermove', (e) => { if (e.pointerId !== id) return; const p = S.pos(e); moved += Math.hypot(p[0] - p0[0], p[1] - p0[1]); on.move && on.move(p, p0, tgt); p0 = p; S.go(); });
      ['pointerup', 'pointercancel'].forEach((ev) => c.addEventListener(ev, (e) => { if (e.pointerId !== id) return; id = null; S.dragged = performance.now(); on.end && on.end(moved < 10, tgt); S.go(); }));
      S.dragging = () => id !== null;
    };
    S.dragging = () => false; S.dragged = 0;
    // a plain tap that was not part of a drag
    S.tap = (fn) => c.addEventListener('click', (e) => { if (performance.now() - S.dragged < 350) return; fn(S.pos(e)); S.go(); });
    if (document.fonts) document.fonts.ready.then(() => { S.onFonts && S.onFonts(); S.go(); });
    return S;
  }

  function css() {
    if (document.getElementById('tc8-css')) return;
    const s = document.createElement('style'); s.id = 'tc8-css';
    s.textContent = `
      .tc8-lab { position: relative; margin: 0 0 calc(var(--R) * 1.2); padding: 12px 14px 14px; background: rgba(251,250,245,.9); }
      .tc8-step { font: 700 14px Fredoka, system-ui; letter-spacing: .08em; text-transform: uppercase; color: var(--red); line-height: 24px; margin-top: 6px; }
      .tc8-brief { font-size: 19px; line-height: 1.45; margin: 4px 0 8px; }
      .tc8-brief b { font-family: Fredoka, system-ui; font-weight: 600; }
      .tc8-row { display: flex; flex-wrap: wrap; gap: 8px; align-items: stretch; margin: 4px 0 8px; }
      .tc8-row .opt { flex: 1 1 150px; text-align: center; min-height: 50px; padding: 8px 10px; font-size: 17px; }
      .tc8-tabs .opt { flex: 1 1 120px; font: 600 16px Fredoka, system-ui; min-height: 48px; }
      .tc8-row .btn { margin-top: 0; min-height: 52px; min-width: 150px; }
      .tc8-verdict { font-size: 18px; line-height: 1.45; min-height: 30px; margin: 6px 0 2px; }
      .tc8-verdict.good { color: var(--green); } .tc8-verdict.bad { color: var(--red); }
      .tc8-small { font-size: 15px; opacity: .75; }
    `;
    document.head.appendChild(s);
  }

  // ======================================================================================
  // the briefs. Each option: t = text on the chip; then either ok, or { fx, why, mis } for the way it fails.
  // extra(a, b) can fail a pair of otherwise-fine choices.
  // ======================================================================================
  const BRIEFS = [
    { id: 'p08.b1', tab: 'Swimming costume', scene: 'swim', label: 'Brief 1: swimming costume (fibre + construction)',
      brief: 'A <b>swimming costume</b> for a school swimmer. It must fit closely, stretch as she moves, and dry quickly after the lesson.',
      la: 'Fibre', lb: 'Construction',
      a: [{ t: 'polyamide + elastane', ok: 1, good: 'polyamide is strong, smooth and quick drying, and a little elastane makes it stretch and spring back' },
        { t: 'polyester + elastane', ok: 1, good: 'polyester is durable and quick drying, and a little elastane makes it stretch and spring back' },
        { t: '100% elastane', fx: 'cross', cap: 'not made!', why: 'Elastane is not used on its own: it is added in small amounts (around 2–20%) to another fibre.', mis: 'elastane-alone' },
        { t: 'cotton', fx: 'sag', cap: 'soaked & saggy!', why: 'Cotton is absorbent and slow to dry: it soaked up the pool water, went heavy and sagged.', mis: 'natural-mixup' },
        { t: 'wool', fx: 'sag', cap: 'soaked & saggy!', why: 'Wool is absorbent and slow to dry, and it can shrink and felt if washed hot.', mis: 'natural-mixup' }],
      b: [{ t: 'warp knit', ok: 1, good: 'a warp knit stretches but is stable and will not ladder' },
        { t: 'weft knit', fx: 'ladder', cap: 'laddered!', why: 'It stretched on fine, but one snag on the poolside made a ladder, and it began to lose its shape.', mis: 'knit-type' },
        { t: 'plain weave', fx: 'stiff', cap: 'no stretch!', why: 'A woven fabric has very little stretch: it will not pull on closely or move with the swimmer.', mis: 'woven-vs-knit' }] },
    { id: 'p08.b2', tab: 'Hiker’s coat', scene: 'snow', label: 'Brief 2: winter coat for a hiker (outer + lining)',
      brief: 'A <b>winter coat for a hiker</b>. It must keep her <b>warm</b> on a freezing, wet hillside and stand up to hard wear. Choose the <b>outer</b> fabric and the <b>lining</b>.',
      la: 'Outer fabric', lb: 'Lining',
      a: [{ t: 'wool, twill weave', ok: 1, warm: 1, good: 'wool fibres trap air, so the outer is a warm insulator, and twill is hard-wearing' },
        { t: 'polyamide + water-repellent finish', ok: 1, good: 'polyamide is strong, hard-wearing and lightweight, and the finish keeps the rain out' },
        { t: 'cotton, plain weave', fx: 'wet', cap: 'soaked & cold!', why: 'Cotton is absorbent and slow to dry: the rain soaked in and stayed there.', mis: 'cotton-wool' },
        { t: 'linen, plain weave', fx: 'cold', cap: 'shivering!', why: 'Linen is a cool fabric for hot weather, and it creases very easily.', mis: 'natural-mixup' }],
      b: [{ t: 'polyester fleece (brushed knit)', ok: 1, warm: 1, good: 'the brushed, knitted fleece lining traps air, so it is warm and soft' },
        { t: 'polyester, satin weave', ok: 1, good: 'the smooth satin lining lets the coat slide on easily' },
        { t: 'linen, plain weave', fx: 'cold', cap: 'shivering!', why: 'A linen lining is cool against the body: the wrong choice for winter.', mis: 'natural-mixup' },
        { t: 'bonded non-woven', fx: 'rip', cap: 'lining tore!', why: 'A bonded fabric is weak, with little drape: the lining tore as she moved.', mis: 'nonwoven' }],
      extra: (a, b) => (!a.warm && !b.warm ? { fx: 'cold', cap: 'dry, but cold!', why: 'She stayed dry, but neither layer traps much air, so nothing kept her warm. One layer needs to insulate.', mis: 'property-word' } : null) },
    { id: 'p08.b3', tab: 'Jeans', scene: 'skate', label: 'Brief 3: a pair of jeans (fibre + weave)',
      brief: 'A pair of <b>jeans</b> (denim) for a skater. They must be strong, hard-wearing and comfortable against the skin.',
      la: 'Fibre', lb: 'Construction',
      a: [{ t: 'cotton', ok: 1, good: 'cotton is strong, soft and comfortable to wear' },
        { t: 'cotton + a little elastane', ok: 1, good: 'cotton is strong and comfortable, and a little elastane gives stretch jeans that keep their shape' },
        { t: 'polyester', fx: 'sweat', cap: 'sweaty!', why: 'Polyester has low absorbency and is not very breathable: his legs felt sweaty.', mis: 'synthetic-mixup' },
        { t: 'silk', fx: 'cost', cap: 'too costly!', why: 'Silk is a luxury fibre: expensive, weaker when wet, and it needs careful washing.', mis: 'natural-mixup' },
        { t: 'wool', fx: 'itch', cap: 'hot & itchy!', why: 'Wool is warm and can feel itchy, and it can shrink and felt if washed hot.', mis: 'cotton-wool' }],
      b: [{ t: 'twill weave', ok: 1, good: 'twill weave (denim) is strong, hard-wearing and hides dirt' },
        { t: 'plain weave', fx: 'cross', cap: 'not denim!', why: 'Strong enough, but this is not denim. Look closely at real jeans: the threads make a diagonal line.', mis: 'weave-type' },
        { t: 'satin weave', fx: 'rip', cap: 'snagged!', why: 'The long floats snagged on the first fall: this weave is less hard-wearing.', mis: 'weave-type' },
        { t: 'weft knit', fx: 'sag', cap: 'baggy knees!', why: 'A knitted fabric stretches and can lose its shape: baggy knees after one day.', mis: 'woven-vs-knit' }] },
    { id: 'p08.b4', tab: 'Face mask', scene: 'ward', label: 'Brief 4: disposable hospital face mask (fibre + construction)',
      brief: 'A <b>disposable face mask</b> for a hospital. It is worn once, then thrown away, so it must be very <b>cheap and quick to make</b>, and must not fray.',
      la: 'Fibre', lb: 'Construction',
      a: [{ t: 'polyester (a synthetic)', ok: 1, good: 'a web of cheap synthetic fibres can be bonded with heat, which melts the thermoplastic fibres together' },
        { t: 'cotton', ok: 1, good: 'a web of cotton fibres can be bonded with adhesive' },
        { t: 'wool', fx: 'itch', cap: 'itchy & costly!', why: 'Wool can feel itchy on the face, and it costs too much to throw away after one use.', mis: 'natural-mixup' },
        { t: 'silk', fx: 'cost', cap: 'too costly!', why: 'Silk is expensive: far too costly for something thrown away after one use.', mis: 'natural-mixup' }],
      b: [{ t: 'bonded (non-woven)', ok: 1, good: 'a bonded fabric is made straight from fibres: cheap, quick to make, and it does not fray' },
        { t: 'felt (non-woven)', fx: 'cross', cap: 'wrong fabric!', why: 'Felt is made by matting wool fibres together: thick, warm and weak. Not right for a thin throw-away mask.', mis: 'nonwoven' },
        { t: 'plain weave', fx: 'cost', cap: 'too slow to make!', why: 'Weaving needs the fibres spun into yarn first: too slow and costly for a throw-away product, and cut edges fray.', mis: 'nonwoven' },
        { t: 'weft knit', fx: 'cost', cap: 'too slow to make!', why: 'Knitting needs the fibres spun into yarn first: too slow and costly for a throw-away product.', mis: 'nonwoven' }] },
    { id: 'p08.b5', tab: 'Summer shirt', scene: 'sun', label: 'Brief 5: summer shirt for a hot country (fibre + construction)',
      brief: 'A <b>summer shirt</b> for a holiday in a very hot country. It must feel <b>cool</b> and soak up sweat.',
      la: 'Fibre', lb: 'Construction',
      a: [{ t: 'cotton', ok: 1, good: 'cotton is absorbent, breathable and cool to wear' },
        { t: 'linen', ok: 1, good: 'linen is absorbent, cool and fresh in hot weather (though it creases very easily)' },
        { t: 'polyester', fx: 'sweat', cap: 'sweaty!', why: 'Polyester has low absorbency and is not very breathable: it felt sweaty.', mis: 'synthetic-mixup' },
        { t: 'polyamide (nylon)', fx: 'sweat', cap: 'sweaty!', why: 'Polyamide has low absorbency: the sweat had nowhere to go.', mis: 'synthetic-mixup' },
        { t: 'wool', fx: 'sweat', cap: 'far too hot!', why: 'Wool fibres trap air, which makes it a warm insulator: far too hot here.', mis: 'cotton-wool' }],
      b: [{ t: 'plain weave', ok: 1, good: 'a plain weave makes a light, firm shirting' },
        { t: 'weft knit', ok: 1, good: 'a weft knit (jersey) makes a comfortable T-shirt style' },
        { t: 'bonded (non-woven)', fx: 'rip', cap: 'it tore!', why: 'A bonded fabric is weak, with little drape: it hung stiffly and tore.', mis: 'nonwoven' }] },
    { id: 'p08.b6', tab: 'Child’s pyjamas', scene: 'bed', label: 'Brief 6: child’s pyjamas (fibre + finish)',
      brief: '<b>Pyjamas for a young child</b>. They must be soft and comfortable, easy to wash, and <b>safe</b>. Choose the fibre and the <b>finish</b>.',
      la: 'Fibre', lb: 'Finish',
      a: [{ t: 'cotton', ok: 1, good: 'cotton is soft, comfortable and absorbent' },
        { t: 'polycotton', ok: 1, good: 'polycotton is comfortable like cotton but creases less and dries faster' },
        { t: 'wool', fx: 'itch', cap: 'itchy!', why: 'Wool can feel itchy, and it shrinks and felts if washed hot: not easy-care nightwear.', mis: 'natural-mixup' },
        { t: 'linen', fx: 'crease', cap: 'stiff & creased!', why: 'Linen is stiff and creases very easily: not soft enough for bed.', mis: 'natural-mixup' }],
      b: [{ t: 'flame retardant', ok: 1, good: 'cotton burns easily, so children’s nightwear is given a flame retardant finish' },
        { t: 'water repellent', fx: 'fire', cap: 'fire risk!', why: 'That finish is for keeping rain off a coat. Think about how easily cotton burns.', mis: 'property-word' },
        { t: 'stain resistant', fx: 'fire', cap: 'fire risk!', why: 'Handy for a school uniform, but it does nothing about how easily cotton burns.', mis: 'property-word' },
        { t: 'no finish', fx: 'fire', cap: 'fire risk!', why: 'Cotton burns easily: children’s nightwear must not be left untreated.', mis: 'property-word' }] },
  ];
  function judge(br, a, b) {
    if (!a.ok) return a; if (!b.ok) return b;
    const e = br.extra && br.extra(a, b); if (e) return e;
    return { ok: 1, fx: 'ok', cap: 'it works!', why: 'It works: ' + a.good + '; ' + b.good + '.' };
  }

  // ======================================================================================
  // the scene: a pen-drawn person wearing the product, with the result drawn on top
  // ======================================================================================
  const FX = 300; // the person stands at x = 300
  const TORSO = [[266, 130], [334, 130], [328, 232], [272, 232]];
  const ARM = (sg, y1 = 204, w = 9) => [[FX + sg * 34, 132], [FX + sg * (34 + w * 1.6), 138], [FX + sg * (66 + w), y1], [FX + sg * (66 - w), y1 + 6]];
  const LEG = (sg, y1 = 322) => [[FX + sg * 2, 232], [FX + sg * 28, 232], [FX + sg * 30, y1], [FX + sg * 8, y1]];
  const GARMENT = {
    swim: [[[274, 130], [286, 130], [300, 150], [314, 130], [326, 130], [328, 232], [318, 250], [300, 240], [282, 250], [272, 232]]],
    snow: [[[262, 126], [338, 126], [340, 270], [260, 270]], ARM(-1, 206, 13), ARM(1, 206, 13)],
    skate: [[[270, 228], [330, 228], [330, 240], [270, 240]], LEG(-1), LEG(1)],
    ward: [[[278, 92], [322, 92], [318, 116], [282, 116]]],
    sun: [TORSO, ARM(-1, 164, 11), ARM(1, 164, 11)],
    bed: [TORSO, ARM(-1, 200, 11), ARM(1, 200, 11), LEG(-1, 316), LEG(1, 316)],
  };
  const closeP = (P) => P.concat([P[0]]);
  function paintBack(x, scene) {
    pen(x, [[30, 332], [830, 334]], { w: 2.4, seed: 3 });
    if (scene === 'swim') { for (let r = 0; r < 4; r++) { const P = []; for (let q = 0; q <= 30; q++) P.push([470 + q * 12, 250 + r * 22 + Math.sin(q * 0.9 + r) * 5]); pen(x, P, { w: 2, seed: 5 + r, a: 0.7 }); } pen(x, [[500, 200], [500, 290]], { w: 2.6 }); pen(x, [[530, 200], [530, 290]], { w: 2.6, seed: 2 }); [215, 240, 265].forEach((y) => pen(x, [[500, y], [530, y]], { w: 2, wob: false })); text(x, 'pool', 640, 232, { font: 'hand', size: 24 }); }
    if (scene === 'snow') { Ink.stroke(x, [[440, 332], [560, 150], [620, 230], [690, 120], [830, 332]], { w: 2.6, seed: 9, amp: 1.2 }); pen(x, [[535, 188], [560, 150], [580, 178]], { w: 2, seed: 4 }); pen(x, [[665, 160], [690, 120], [718, 162]], { w: 2, seed: 6 }); const R = window.H.rng(4); for (let i = 0; i < 16; i++) { const px = R.range(60, 820), py = R.range(30, 300); if (Math.abs(px - FX) < 90) continue; [0, 1, 2].forEach((k) => { const a = (k * Math.PI) / 3; pen(x, [[px - Math.cos(a) * 8, py - Math.sin(a) * 8], [px + Math.cos(a) * 8, py + Math.sin(a) * 8]], { w: 1.5, wob: false, a: 0.7 }); }); } }
    if (scene === 'skate') { Ink.stroke(x, geo.curve([520, 332], [660, 332], [760, 300], [800, 170], 30), { w: 2.8, seed: 7 }); pen(x, [[800, 170], [830, 170], [830, 332]], { w: 2.4, seed: 8 }); pen(x, [[400, 322], [470, 322]], { w: 4, wob: false }); Ink.stroke(x, geo.ellipse(412, 328, 6, 6), { w: 2, retrace: false, seed: 1 }); Ink.stroke(x, geo.ellipse(458, 328, 6, 6), { w: 2, retrace: false, seed: 2 }); }
    if (scene === 'ward') { const P = geo.rect(560, 60, 110, 110, 10); Ink.stroke(x, P, { w: 2.6, seed: 5 }); const C = [[600, 80], [630, 80], [630, 100], [650, 100], [650, 130], [630, 130], [630, 150], [600, 150], [600, 130], [580, 130], [580, 100], [600, 100], [600, 80]]; Ink.hatchFill(x, C, 1, RD, 1.4); Ink.stroke(x, C, { w: 2.4, color: RD, seed: 6 }); Ink.stroke(x, [[500, 332], [500, 250], [800, 250], [800, 332]], { w: 2.6, seed: 8 }); pen(x, [[500, 282], [800, 282]], { w: 2, seed: 9 }); Ink.stroke(x, geo.rect(510, 228, 70, 22, 8), { w: 2, seed: 10, retrace: false }); }
    if (scene === 'sun') { Ink.stroke(x, geo.ellipse(700, 90, 44, 44), { w: 3, color: RD, seed: 3 }); for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6; pen(x, [[700 + Math.cos(a) * 56, 90 + Math.sin(a) * 56], [700 + Math.cos(a) * 78, 90 + Math.sin(a) * 78]], { w: 2.6, color: RD, wob: false }); } Ink.stroke(x, geo.curve([560, 332], [570, 280], [560, 230], [590, 190], 20), { w: 3, seed: 5 }); [[-70, 10], [-50, -34], [0, -46], [48, -28], [64, 14]].forEach(([dx, dy], i) => pen(x, geo.curve([590, 190], [590 + dx * 0.4, 190 + dy], [590 + dx * 0.8, 190 + dy], [590 + dx, 190 + dy + 26], 12), { w: 2.4, seed: 11 + i })); }
    if (scene === 'bed') { Ink.stroke(x, geo.ellipse(780, 130, 34, 34, 0.9, 5.2), { w: 2.8, seed: 3 }); pen(x, geo.curve([798, 102], [770, 120], [770, 150], [802, 156], 12), { w: 2.2, seed: 4 }); [[500, 110], [700, 150], [560, 170]].forEach(([sx, sy]) => { pen(x, [[sx - 8, sy], [sx + 8, sy]], { w: 2, wob: false }); pen(x, [[sx, sy - 8], [sx, sy + 8]], { w: 2, wob: false }); }); Ink.stroke(x, [[480, 332], [480, 220], [500, 220], [500, 270], [810, 270], [810, 332]], { w: 2.6, seed: 8 }); Ink.stroke(x, geo.rect(508, 246, 76, 24, 9), { w: 2, seed: 10, retrace: false }); pen(x, [[600, 270], [640, 290], [810, 290]], { w: 2, seed: 12 }); }
  }
  function paintPerson(x, scene, mood, worn) {
    // body
    const ink = (P, o) => Ink.stroke(x, P, Object.assign({ w: 2.6, amp: 0.5 }, o));
    ink(geo.ellipse(FX, 92, 30, 32), { seed: 3 });
    ink([[288, 122], [266, 130], [272, 232], [328, 232], [334, 130], [312, 122]], { seed: 4 });
    [-1, 1].forEach((sg, i) => { ink([[FX + sg * 34, 134], [FX + sg * 66, 206]], { seed: 5 + i }); ink([[FX + sg * 14, 232], [FX + sg * 19, 322], [FX + sg * 34, 328]], { seed: 8 + i }); });
    // face (covered by the mask in the ward scene)
    [-11, 11].forEach((o) => { x.fillStyle = rgba(B, 0.9); x.beginPath(); x.arc(FX + o, 86, 2.8, 0, 7); x.fill(); });
    if (scene !== 'ward') { const m = mood === 'happy' ? geo.curve([288, 102], [294, 112], [306, 112], [312, 102], 10) : mood === 'sad' ? geo.curve([288, 110], [294, 101], [306, 101], [312, 110], 10) : [[290, 106], [310, 106]]; pen(x, m, { w: 2.4, seed: 2 }); }
    if (mood === 'sad') { pen(x, [[282, 76], [294, 80]], { w: 2, wob: false }); pen(x, [[318, 76], [306, 80]], { w: 2, wob: false }); }
    // the product: dashed outline before any test, hatched once made
    GARMENT[scene].forEach((P, i) => {
      if (!worn) { pen(x, closeP(P), { w: 2, color: RD, dash: [7, 6], wob: false }); return; }
      x.save(); x.globalCompositeOperation = 'source-over'; x.fillStyle = 'rgba(255,255,255,.85)'; x.beginPath(); P.forEach(([a, b], k) => (k ? x.lineTo(a, b) : x.moveTo(a, b))); x.fill(); x.restore();
      Ink.hatchFill(x, P, 1, B, scene === 'bed' ? 0.7 : 1.3); ink(closeP(P), { seed: 20 + i, w: 2.8 });
    });
    if (scene === 'ward') [-1, 1].forEach((sg) => pen(x, [[FX + sg * 21, 98], [FX + sg * 30, 88]], { w: 1.8, wob: false }));
    if (!worn) text(x, '?', FX + 52, 120, { size: 44, color: RD });
  }
  const CAPX = 620;
  function paintFx(x, scene, fx, cap) {
    const G = GARMENT[scene], red = (P, o) => Ink.stroke(x, P, Object.assign({ w: 3, color: RD, amp: 0.6 }, o));
    const drop = (px, py, s = 1) => red(closeP([[px, py - 9 * s], [px + 6 * s, py + 3 * s], [px, py + 8 * s], [px - 6 * s, py + 3 * s]]), { w: 2, retrace: false, seed: (px + py) | 0 });
    const zig = (px, py, n = 4, s = 9) => { const P = []; for (let i = 0; i <= n; i++) P.push([px + i * s, py + (i % 2 ? s : 0)]); red(P, { w: 2.6, retrace: false, seed: px | 0 }); };
    const lowY = Math.max(...G.flat().map((p) => p[1]));
    if (fx === 'ok') { Ink.tick(x, 380, 110, 2.2); [[232, 70], [380, 200], [226, 230]].forEach(([px, py], i) => { pen(x, [[px - 10, py], [px + 10, py]], { w: 2.4, color: GR, wob: false }); pen(x, [[px, py - 10], [px, py + 10]], { w: 2.4, color: GR, wob: false }); }); }
    if (fx === 'sag') { red(geo.curve([268, lowY - 6], [280, lowY + 34], [320, lowY + 34], [332, lowY - 6], 14), {}); [278, 300, 322].forEach((px, i) => drop(px, lowY + 50 + (i % 2) * 14)); pen(x, [[236, lowY + 84], [366, lowY + 84]], { w: 2, color: RD, dash: [4, 6], wob: false }); }
    if (fx === 'wet') { for (let i = 0; i < 9; i++) pen(x, [[190 + i * 28, 20 + (i % 3) * 12], [178 + i * 28, 52 + (i % 3) * 12]], { w: 2, color: RD, wob: false }); [250, 300, 350].forEach((px, i) => drop(px, 292 + (i % 2) * 12)); }
    if (fx === 'cold' || fx === 'wet') [-1, 1].forEach((sg) => [150, 190, 230].forEach((py, i) => zig(FX + sg * 92 - 14, py, 3, 9)));
    if (fx === 'sweat') { [[250, 60], [350, 64], [244, 104], [356, 108], [300, 44]].forEach(([px, py]) => drop(px, py)); [-1, 1].forEach((sg) => red(geo.curve([FX + sg * 100, 240], [FX + sg * 112, 220], [FX + sg * 88, 200], [FX + sg * 100, 180], 10), { w: 2.2, retrace: false })); }
    if (fx === 'stiff') { red([[236, 180], [364, 180]], {}); pen(x, geo.head([[364, 180], [236, 180]]), { w: 3, color: RD, wob: false }); pen(x, geo.head([[236, 180], [364, 180]]), { w: 3, color: RD, wob: false }); pen(x, [[228, 160], [228, 200]], { w: 3.4, color: RD, wob: false }); pen(x, [[372, 160], [372, 200]], { w: 3.4, color: RD, wob: false }); }
    if (fx === 'ladder') { [-7, 7].forEach((o) => pen(x, [[300 + o, 150], [300 + o, 236]], { w: 2.4, color: RD, wob: false })); for (let py = 158; py < 236; py += 11) pen(x, [[293, py], [307, py]], { w: 2.2, color: RD, wob: false }); }
    if (fx === 'rip') { const cy = scene === 'skate' ? 276 : 190; zig(274, cy, 3, 8); zig(306, cy + 8, 3, 8); pen(x, [[272, cy + 16], [262, cy + 30]], { w: 2, color: RD, wob: false }); pen(x, [[330, cy + 24], [340, cy + 38]], { w: 2, color: RD, wob: false }); }
    if (fx === 'itch') [[244, 150], [356, 170], [250, 226], [352, 240], [300, 60]].forEach(([px, py], i) => { [0, 1, 2].forEach((k) => { const a = k * 1.05 + i; pen(x, [[px - Math.cos(a) * 11, py - Math.sin(a) * 11], [px + Math.cos(a) * 11, py + Math.sin(a) * 11]], { w: 2.2, color: RD, wob: false }); }); });
    if (fx === 'crease') [[274, 150], [296, 176], [278, 204], [300, 222]].forEach(([px, py]) => zig(px, py, 4, 7));
    if (fx === 'cost') { red(geo.rect(376, 150, 120, 62, 10), { w: 2.6 }); text(x, '£ £ £', 436, 192, { size: 30, color: RD, align: 'center' }); pen(x, [[376, 190], [346, 200]], { w: 2, color: RD, wob: false }); }
    if (fx === 'fire') { const T = [[430, 130], [486, 226], [374, 226], [430, 130]]; red(T, { w: 3.4 }); red(geo.curve([430, 212], [404, 196], [432, 180], [424, 158], 14).concat(geo.curve([424, 158], [452, 180], [454, 200], [430, 212], 14)), { w: 2.6, retrace: false }); }
    if (fx === 'cross') Ink.cross(x, 400, 150, 2.4);
    Ink.drawBubble(x, cap, CAPX, 52, 36, fx === 'ok' ? GR : RD, 1, -0.03, 'center');
  }

  function bench(ui, lab) {
    const W = 860, HH = 350;
    const recs = BRIEFS.map((b) => ui.record(b.id, { label: b.label, type: 'design', max: 1 }));
    const st = BRIEFS.map((b) => { const it = got(b.id) || {}; return { a: it.a ?? null, b: it.b ?? null, tries: (it.tries || []).slice(), passed: !!it.passed, shown: it.tries && it.tries.length ? it.tries[it.tries.length - 1] : null }; });
    let ci = Math.max(0, st.findIndex((s) => !s.passed)); if (ci < 0) ci = 0;
    const tabs = ui.el('div', 'tc8-row tc8-tabs', null, lab);
    const tabB = BRIEFS.map((b, k) => { const t = ui.el('button', 'opt', '', tabs); t.type = 'button'; t.onclick = () => { ci = k; Book.sfx('tick', { gain: 0.5 }); anim = 1; refresh(); }; return t; });
    const brief = ui.el('div', 'tc8-brief', '', lab);
    const la = ui.el('div', 'tc8-step', '', lab), rowA = ui.el('div', 'tc8-row', null, lab);
    const lb = ui.el('div', 'tc8-step', '', lab), rowB = ui.el('div', 'tc8-row', null, lab);
    const ctl = ui.el('div', 'tc8-row', null, lab);
    const go = ui.el('button', 'btn', '▶ TEST it', ctl); go.type = 'button';
    const count = ui.el('div', 'tc8-small', '', ctl); count.style.alignSelf = 'center';
    const box = ui.el('div', '', null, lab), S = Stage(box, W, HH);
    const verdict = ui.el('div', 'tc8-verdict', '', lab);
    let anim = 1; const layers = {};
    const layer = (key, paint) => layers[key] || (layers[key] = S.layer(W, HH, paint));
    S.onFonts = () => Object.keys(layers).forEach((k) => delete layers[k]);
    S.render = (dt) => {
      const br = BRIEFS[ci], s = st[ci], sh = s.shown, x = S.ctx;
      S.blit(layer('bg-' + br.scene, (c) => paintBack(c, br.scene)), 0, 0);
      const testing = anim < 1;
      if (testing) { anim = Math.min(1, anim + dt / 0.9); if (anim >= 1) setTimeout(refresh); }
      const res = sh && !testing ? judge(br, br.a[sh.a], br.b[sh.b]) : null;
      const mood = !res ? 'flat' : res.ok ? 'happy' : 'sad';
      S.blit(layer(`p-${br.scene}-${mood}-${sh ? 1 : 0}`, (c) => paintPerson(c, br.scene, mood, !!sh)), 0, 0);
      if (testing) { Ink.drawBubble(x, 'testing…', CAPX, 52, 36, B, anim, -0.03, 'center'); return true; }
      if (res) S.blit(layer(`fx-${br.scene}-${res.fx}-${res.cap}`, (c) => paintFx(c, br.scene, res.fx, res.cap)), 0, 0);
      else text(x, 'Choose, then press TEST', CAPX, 52, { font: 'hand', size: 24, align: 'center' });
      return false;
    };
    function save(k) {
      const br = BRIEFS[k], s = st[k];
      const answer = s.tries.map((t, i) => `${i + 1}) ${br.a[t.a].t} + ${br.b[t.b].t} ${t.ok ? '✓' : '✗'}`).join(' | ');
      const bad = s.tries.filter((t) => !t.ok).map((t) => judge(br, br.a[t.a], br.b[t.b]).mis).filter(Boolean);
      recs[k].set({ answer, correct: s.passed, score: s.passed ? 1 : 0, max: 1, mis: [...new Set(bad)].join(','), a: s.a, b: s.b, tries: s.tries, passed: s.passed });
    }
    go.onclick = () => {
      const br = BRIEFS[ci], s = st[ci]; if (s.a == null || s.b == null || anim < 1) return;
      const res = judge(br, br.a[s.a], br.b[s.b]), k = ci;
      const t = { a: s.a, b: s.b, ok: !!res.ok }; s.tries.push(t); s.shown = t; if (res.ok) s.passed = true;
      save(k); anim = 0; refresh(); Book.scribble(0.3);
      setTimeout(() => { Book.sfx(res.ok ? 'success' : 'error', { gain: 0.35 }); if (ci === k) refresh(); }, 920);
    };
    function chips(row, list, key) {
      row.innerHTML = '';
      list.forEach((o, i) => { const b = ui.el('button', 'opt' + (st[ci][key] === i ? ' sel' : ''), Book.esc(o.t), row); b.type = 'button'; b.onclick = () => { if (anim < 1) return; st[ci][key] = i; Book.scribble(0.1); refresh(); }; });
    }
    function refresh() {
      const br = BRIEFS[ci], s = st[ci];
      tabB.forEach((t, k) => { t.textContent = (st[k].passed ? '✓ ' : k + 1 + ' · ') + BRIEFS[k].tab; t.classList.toggle('sel', k === ci); t.classList.toggle('right', st[k].passed && k !== ci); });
      brief.innerHTML = `<b>Brief ${ci + 1}.</b> ` + br.brief;
      la.textContent = '1 · ' + br.la; lb.textContent = '2 · ' + br.lb;
      chips(rowA, br.a, 'a'); chips(rowB, br.b, 'b');
      go.disabled = s.a == null || s.b == null || anim < 1;
      count.textContent = s.tries.length ? `${s.tries.length} test${s.tries.length > 1 ? 's' : ''} so far${s.passed ? ' · solved ✓ (you can test other ideas)' : ''}` : 'Every test is saved for your teacher: think first!';
      const sh = s.shown;
      if (sh && anim >= 1) { const res = judge(br, br.a[sh.a], br.b[sh.b]); verdict.className = 'tc8-verdict ' + (res.ok ? 'good' : 'bad'); verdict.innerHTML = `<b>${Book.esc(br.a[sh.a].t)} + ${Book.esc(br.b[sh.b].t)}:</b> ` + (res.ok ? '✓ ' : '✗ ') + res.why + (res.ok ? '' : ' Change something and test again.'); }
      else { verdict.className = 'tc8-verdict'; verdict.innerHTML = sh ? 'Testing…' : ''; }
      S.go();
    }
    refresh();
  }

  Book.page({
    id: 'p08', title: 'Design the outfit',
    build(ui, root) {
      css();
      ui.h('Design the outfit');
      ui.p('You are the textile designer. For each brief, choose the fabric and press <b>TEST</b>: someone tries it out for real. Use what you know about <b>fibres</b>, <b>blends</b>, <b>finishes</b> and how fabrics are <b>constructed</b>.');
      const lab = ui.el('div', 'tc8-lab'); requestAnimationFrame(() => Ink.frame(lab, { shadow: false, w: 2.2 }));
      bench(ui, lab);
      ui.el('h2', '', 'Explain it');
      ui.write({ id: 'p08.explain', label: 'Explain why polycotton is used for school shirts [3]', marks: 3, lines: 5,
        q: 'Explain why a <b>polycotton blend</b> is used for school shirts.',
        scheme: ['The cotton makes it comfortable / soft / absorbent to wear', 'The polyester makes it stronger (more durable) or quicker to dry', 'It creases less than pure cotton, so it needs little or no ironing', 'It is cheaper than pure cotton'],
        model: 'Polycotton blends polyester and cotton fibres to combine their good properties. The cotton keeps the shirt comfortable and absorbent. The polyester makes it stronger and quicker to dry, and it creases less, so it needs little ironing. It is also cheaper.' });
    },
  });
})();
