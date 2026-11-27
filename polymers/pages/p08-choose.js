// Page 8 — Choose the polymer: six design briefs. The student picks one of the eleven polymers, presses TEST and a
// pen-drawn scene shows the product working, or failing in a way that shows why. Then a 3-mark written answer.
(function () {
  'use strict';
  const B = Ink.BLUE, RD = Ink.RED, GR = Ink.GREEN, rgba = Ink.rgba, geo = Ink.geo;
  const HANDF = (s) => `400 ${s}px "Gloria Hallelujah", "Comic Sans MS", cursive`;
  const LABF = (s) => `600 ${s}px Fredoka, "Arial Rounded MT Bold", system-ui, sans-serif`;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const TAU = Math.PI * 2, AMBER = [255, 196, 40], TINT = 'rgba(120,140,235,0.12)';
  function text(x, s, px, py, o = {}) {
    x.save(); x.font = (o.font === 'hand' ? HANDF : LABF)(o.size || 22);
    x.fillStyle = rgba(o.color || B, o.a ?? 0.92); x.textAlign = o.align || 'center'; x.textBaseline = 'alphabetic';
    x.fillText(s, px, py); x.restore();
  }
  const path = (x, P) => { x.beginPath(); P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.closePath(); };
  const fillP = (x, P, style) => { x.save(); x.fillStyle = style; path(x, P); x.fill(); x.restore(); };
  const box = (x0, y0, w, h) => [[x0, y0], [x0 + w, y0], [x0 + w, y0 + h], [x0, y0 + h]];
  const closeP = (P) => P.concat([P[0]]);
  const disc = (x, cx, cy, r, col, a = 0.9) => { x.save(); x.fillStyle = rgba(col, a); x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill(); x.restore(); };
  const glow = (x, cx, cy, r, col, a) => {
    if (a <= 0.01) return; const g = x.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, rgba(col, 0.95 * a)); g.addColorStop(0.45, rgba(col, 0.4 * a)); g.addColorStop(1, rgba(col, 0));
    x.save(); x.fillStyle = g; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill(); x.restore();
  };
  let LW = 1; // pen width correction inside scaled drawings
  const st = (x, pts, o = {}) => Ink.stroke(x, pts, Object.assign({ amp: 0.4 }, o, { w: (o.w || 2.2) * LW }));
  // a wiggly rising line (heat, smoke), drawn straight on the context because it moves every frame
  const wiggle = (x, px, y0, y1, now, col, a = 0.6, amp = 5) => { x.save(); x.strokeStyle = rgba(col, a); x.lineWidth = 2.2; x.beginPath(); for (let y = y0; y >= y1; y -= 4) { const q = px + Math.sin(y * 0.16 + now * 6 + px) * amp; if (y === y0) x.moveTo(q, y); else x.lineTo(q, y); } x.stroke(); x.restore(); };
  const zig = (x, pts, seed) => st(x, pts, { seed, w: 2.6, color: RD, amp: 0.2, retrace: false });
  const caption = (x, s, cx, cy, col) => s.split('|').forEach((ln, i) => text(x, ln, cx, cy + i * 30, { font: 'hand', size: 24, color: col }));

  function Stage(parent, W, Hh) {
    const c = document.createElement('canvas'); parent.appendChild(c);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = Math.round(W * dpr); c.height = Math.round(Hh * dpr);
    Object.assign(c.style, { width: '100%', height: 'auto', aspectRatio: W + ' / ' + Hh, display: 'block', touchAction: 'manipulation', userSelect: 'none', webkitUserSelect: 'none' });
    const ctx = c.getContext('2d');
    const S = { c, ctx, W, H: Hh, render: () => false };
    const hidden = () => { const p = c.closest('.page'); return !p || p.classList.contains('hidden') || !c.offsetParent; };
    let raf = 0, wait = 0, last = 0, vis = true;
    if (window.IntersectionObserver) new IntersectionObserver((es) => { vis = es[es.length - 1].isIntersecting; if (vis) S.go(); }, { rootMargin: '120px' }).observe(c);
    const tick = (now) => {
      raf = 0;
      if (!vis) { last = 0; return; }
      if (hidden()) { last = 0; if (!wait) wait = setTimeout(() => { wait = 0; S.go(); }, 500); return; }
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60; last = now;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.globalCompositeOperation = 'source-over'; ctx.clearRect(0, 0, W, Hh);
      ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = 1; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      if (S.render(dt, now / 1000)) raf = requestAnimationFrame(tick); else last = 0;
    };
    S.go = () => { if (!raf) raf = requestAnimationFrame(tick); };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { S.onFonts && S.onFonts(); S.go(); });
    return S;
  }

  // =========================================================================================================
  // the eleven polymers (alphabetical, families mixed on purpose) and the verdict for each one in each brief
  // =========================================================================================================
  const POLY = [['acrylic', 'Acrylic', 'PMMA'], ['er', 'Epoxy resin', 'ER'], ['hdpe', 'High density polythene', 'HDPE'], ['hips', 'High impact polystyrene', 'HIPS'], ['mf', 'Melamine formaldehyde', 'MF'], ['pf', 'Phenol formaldehyde', 'PF'],
    ['pr', 'Polyester resin', 'PR'], ['pet', 'Polyethylene terephthalate', 'PET'], ['pp', 'Polypropylene', 'PP'], ['pvc', 'Polyvinyl chloride', 'PVC'], ['uf', 'Urea formaldehyde', 'UF']];
  const N = { acrylic: 'Acrylic', er: 'Epoxy resin', hdpe: 'HDPE', hips: 'HIPS', mf: 'Melamine formaldehyde', pf: 'Phenol formaldehyde', pr: 'Polyester resin', pet: 'PET', pp: 'Polypropylene', pvc: 'PVC', uf: 'Urea formaldehyde' };
  const SETS = ['er', 'mf', 'pf', 'pr', 'uf'], isSet = (p) => SETS.includes(p);
  // each verdict: [level (2 best, 1 works, 0 fails), scene mode, caption on the scene, feedback, misconception tags]
  const V = {
    1: (p) => ({
      pet: [2, 'ok', 'it bounced, and|the fizz stays in', 'PET is clear, tough, lightweight and food safe, and it is a good barrier: it keeps the fizz in.'],
      acrylic: [0, 'shatter', 'CRACK!', 'Acrylic is clear, but it is <b>brittle</b>: the bottle shattered when it was dropped.', 'acrylic-tough'],
      hdpe: [0, 'opaque', 'what is in it?', 'HDPE is tough, but it is <b>opaque</b>: nobody can see the drink (think of a milk bottle).', 'thermoform-mixup'],
      hips: [0, 'opaque', 'what is in it?', 'HIPS is tough and food safe, but it is not see-through: nobody can see the drink.', 'thermoform-mixup'],
      pp: [0, 'flat', 'psss… the drink|has gone flat', 'Polypropylene is tough and food safe, but it is not a good enough barrier: the fizz slowly escaped and the drink went flat.', 'thermoform-mixup'],
      pvc: [0, 'unsafe', 'safe to|drink from?', 'PVC can be tough and clear, but it is not the food-safe choice for a drink. Which clear polymer is food safe and keeps the fizz in?', 'thermoform-mixup'],
    }[p] || [0, 'shatter', 'CRACK!', `${N[p]} is a thermosetting polymer: hard but <b>brittle</b>, so the bottle shattered when it was dropped. (It also cannot be softened and shaped into a thin bottle.)`, 'thermo-swap']),
    2: (p) => ({
      pp: [2, 'ok', '5000 flips and the hinge is still fine', 'Polypropylene resists <b>fatigue</b>: its thin "living hinge" can bend thousands of times without breaking.'],
      acrylic: [0, 'snap', 'SNAP! first flip', 'Acrylic is hard but <b>brittle</b>: the hinge snapped the first time it was bent.', 'pp-hinge,acrylic-tough'],
      hips: [0, 'white', 'the hinge turned white, then cracked', 'HIPS is tough, but its hinge turned white and cracked after a few bends.', 'pp-hinge'],
      pvc: [0, 'white', 'the hinge turned white, then cracked', 'Rigid PVC is tough, but its hinge turned white and cracked after a few bends.', 'pp-hinge'],
      pet: [0, 'white', 'the hinge turned white, then cracked', 'PET is tough in a bottle, but its hinge turned white and cracked after a few bends.', 'pp-hinge'],
      hdpe: [0, 'split', 'the hinge wore out and split', 'HDPE is tough, but its hinge wore out and split. Only one polymer on the list is known for resisting <b>fatigue</b>.', 'pp-hinge'],
    }[p] || [0, 'snap', 'SNAP! first flip', `${N[p]} is a thermosetting polymer: rigid and <b>brittle</b>. The hinge snapped the first time it was bent.`, 'thermo-swap,pp-hinge']),
    3: (p) => ({
      uf: [2, 'ok', 'cool, safe and|still working', 'Urea formaldehyde is hard, heat-resistant, a good electrical insulator and white: it is what real plugs, sockets and switches are made from.'],
      mf: [1, 'ok', 'cool, safe and|still working', 'Melamine formaldehyde is a hard, heat-resistant thermoset that takes any colour. Real plugs, sockets and switches are usually <b>urea formaldehyde</b>.'],
      er: [1, 'ok', 'cool, safe and|still working', 'Epoxy resin is a hard, heat-resistant thermoset and an electrical insulator. Real plugs, sockets and switches are usually <b>urea formaldehyde</b>.'],
      pf: [0, 'dark', 'it works, but it|only comes in|dark colours', 'Right family! Phenol formaldehyde insulates and resists heat (older electrical fittings used it), but it comes in <b>dark colours only</b>: the customer wanted white.', 'thermoset-mixup'],
      pr: [0, 'crack', 'CRACK!', 'Right family! But polyester resin is <b>brittle</b> on its own: the thin switch cracked when it was pressed. It is the resin that gets reinforced with glass fibre.', 'thermoset-mixup'],
      pvc: [0, 'melt', 'the switch has|gone soft!', 'PVC is a good electrical insulator, but it is a thermoforming polymer: it <b>softens when heated</b>. When the wiring got hot, the switch sagged.', 'thermo-swap'],
    }[p] || [0, 'melt', 'the switch has|gone soft!', `${N[p]} is a thermoforming polymer: it <b>softens when heated</b>. When the wiring got hot, the switch sagged.`, 'thermo-swap']),
    4: (p) => ({
      hips: [2, 'ok', 'a crisp, cheap tray', 'HIPS is cheap, food safe and <b>very easy to vacuum form</b>: the classic choice for packaging trays.'],
      pet: [1, 'ok', 'a crisp, clear tray', 'PET is food safe and is used for food trays. The cheap one that is very easy to vacuum form is <b>HIPS</b>.'],
      pp: [1, 'ok', 'it formed', 'Polypropylene is a food-safe thermoforming polymer, so the hot sheet formed. Designers usually pick <b>HIPS</b>: cheap and very easy to vacuum form.'],
      hdpe: [1, 'ok', 'it formed', 'HDPE is a food-safe thermoforming polymer, so the hot sheet formed. Designers usually pick <b>HIPS</b>: cheap and very easy to vacuum form.'],
      pvc: [0, 'unsafe', 'it formed… but is it|safe next to food?', 'PVC vacuum forms well (blister packs), but it is not the food-safe choice to sit against chocolates.', 'thermoform-mixup'],
      acrylic: [0, 'crack', 'CRACK! it broke when a|chocolate was pushed out', 'Acrylic sheet softened and formed, but it is <b>brittle</b>: the thin tray cracked when a chocolate was pushed out.', 'acrylic-tough'],
    }[p] || [0, 'char', 'it will not soften:|it just chars', `${N[p]} is a thermosetting polymer: it <b>cannot be softened by heating</b>, so the sheet would not form. It just charred under the heater.`, 'thermo-swap']),
    5: (p) => ({
      pr: [2, 'ok', 'bump! not even a crack', 'Polyester resin reinforced with glass fibre is <b>GRP</b> (fibreglass): strong and light. It is the classic boat hull material.'],
      er: [1, 'ok', 'bump! not even a crack', 'Epoxy resin is very strong when it is reinforced with fibres (it bonds carbon fibre). Most boat hulls use <b>polyester resin</b> with glass fibre: GRP.'],
      hdpe: [1, 'ok', 'bump! it just bounced off', 'HDPE is stiff, strong and tough, and kayaks are moulded from it. Bigger hulls are usually GRP: <b>polyester resin</b> with glass fibre.'],
      acrylic: [0, 'crack', 'cracked on the rock:|it is letting in water', 'Acrylic is stiff, but it is <b>brittle</b>: the hull cracked on the first rock.', 'acrylic-tough'],
      pp: [0, 'flex', 'the hull buckled', 'Polypropylene is tough and light, but it is <b>flexible</b>: a big hull made from it is not stiff enough, and it buckled.', 'thermoform-mixup'],
      hips: [0, 'flex', 'the hull buckled', 'HIPS is only fairly rigid: fine for a yoghurt pot, but a big hull made from it buckled.', 'thermoform-mixup'],
      pvc: [0, 'flex', 'the hull buckled', 'Rigid PVC is tough and weather-resistant (gutters, window frames), but a thin PVC hull was not stiff and strong enough: it buckled.', 'thermoform-mixup'],
      pet: [0, 'flex', 'the hull buckled', 'PET is tough in a thin bottle, but a big hull made from it was not stiff enough: it buckled.', 'thermoform-mixup'],
    }[p] || [0, 'crack', 'cracked on the rock:|it is letting in water', `${N[p]} is hard and stiff, but <b>brittle</b>: with no fibre reinforcement the hull cracked on the first rock.`, 'thermoset-mixup']),
    6: (p) => ({
      acrylic: [2, 'ok', 'ten years on: still bright and shiny', 'Acrylic is hard, stiff, shiny, brightly coloured and <b>weather-resistant</b>: the standard choice for shop signs.'],
      pvc: [1, 'ok', 'ten years on: still doing its job', 'Rigid PVC is stiff and weather-resistant (window frames, gutters). Sign makers usually choose <b>acrylic</b> for its shiny, glass-like finish.'],
      pp: [0, 'bend', 'it bends and flaps in the wind', 'Polypropylene is tough, but it is <b>flexible</b>: the sign bowed and flapped in the wind.', 'thermoform-mixup'],
      hdpe: [0, 'dull', 'dull and waxy, not shiny', 'HDPE is tough, but its surface is <b>waxy</b> and dull, not shiny: nobody notices the sign.', 'thermoform-mixup'],
      hips: [0, 'cloudy', 'faded and brittle after years of sun', 'HIPS is cheap and easy to shape, but it is not the weather-resistant one: after years of sun the sign faded and went brittle.', 'thermoform-mixup'],
      pet: [0, 'cloudy', 'dull and cloudy after years of sun', 'PET is clear and tough, but it is not the weather-resistant one: after years outside the sign went dull and cloudy.', 'thermoform-mixup'],
      pf: [0, 'dark', 'dark colours only', 'Phenol formaldehyde comes in <b>dark colours only</b>: no good for a bright sign.', 'thermoset-mixup'],
      uf: [0, 'dull', 'white and pale colours only', 'Urea formaldehyde comes in <b>white or pale colours</b>, not bright ones. It is for plugs and switches, not signs.', 'thermoset-mixup'],
      mf: [0, 'crack', 'CRACK! it broke in a storm', 'Melamine takes bright colours, but like most thermosets it is <b>brittle</b>: the big thin sign cracked in a storm.', 'thermoset-mixup'],
    }[p] || [0, 'crack', 'CRACK! it broke in a storm', `${N[p]} is a thermoset: hard but <b>brittle</b>. The big thin sign cracked in a storm.`, 'thermoset-mixup']),
  };
  const BR = {
    1: { tab: 'Fizzy bottle', short: 'fizzy drink bottle', text: 'A <b>fizzy drink bottle</b>: <b>clear</b> so you can see the drink, <b>tough</b> if it is dropped, and it must <b>keep the fizz in</b>.', test: 'Drop test, then a fizz check.' },
    2: { tab: 'Flip-top cap', short: 'flip-top cap', text: 'A <b>flip-top cap</b> for a shampoo bottle. Lid and base are <b>one moulding</b>, joined by a thin hinge that bends <b>thousands of times</b>.', test: 'A machine flips the lid open and shut.' },
    3: { tab: 'Light switch', short: 'light switch', text: 'A <b>white light switch</b>. It must <b>not conduct electricity</b>, and it must <b>not go soft</b> if the wiring behind it gets hot.', test: 'Switch on, then the wiring heats up.' },
    4: { tab: 'Chocolate tray', short: 'vacuum-formed chocolate tray', text: 'The <b>tray inside a box of chocolates</b>: <b>vacuum formed</b> from a thin sheet, <b>food safe</b> and cheap.', test: 'Heat the sheet, then suck it down over the mould.' },
    5: { tab: 'Boat hull', short: 'boat hull', text: 'The <b>hull of a small boat</b>: <b>strong</b> and <b>stiff</b> but <b>light</b>. Sooner or later it will bump into a rock.', test: 'Launch it… straight at a rock.' },
    6: { tab: 'Shop sign', short: 'outdoor shop sign', text: 'An <b>outdoor shop sign</b>: <b>shiny</b>, <b>brightly coloured</b> and stiff. It stays out in sun, wind and rain for years.', test: 'Ten years of weather, speeded up.' },
  };
  const TEND = { 1: 2.5, 2: 3.0, 3: 2.9, 4: 3.1, 5: 2.6, 6: 3.0 };

  // =========================================================================================================
  // the scenes (860 × 330). m = mode ('idle' before a test), t = seconds since TEST, cap = caption once it is over
  // =========================================================================================================
  const W = 860, Hh = 330;
  function bottle(x, m, now, landed) {
    const P = [[-17, 0], [-19, -8], [-19, -56], [-8, -78], [-8, -90], [8, -90], [8, -78], [19, -56], [19, -8], [17, 0], [-17, 0]];
    fillP(x, P, TINT);
    if (m === 'opaque') { Ink.hatchFill(x, P, 1, B, 2.6); Ink.hatchFill(x, P, 1, B, 1.7); }
    st(x, P, { seed: 3 });
    const cap = box(-9, -99, 18, 9); Ink.hatchFill(x, cap, 1, RD, 2.4); st(x, closeP(cap), { seed: 5, w: 1.8, color: RD });
    if (m === 'opaque') return;
    st(x, [[-19, -62], [19, -62]], { seed: 7, w: 1.4, retrace: false });
    for (let i = 0; i < 7; i++) {
      const ph = (now * 26 + i * 23) % 56;
      if (m === 'flat' && landed) { const q = (now * 22 + i * 9) % 44; disc(x, 20 + q, -20 - i * 9 - q * 0.5, 2.4, B, 0.7 * (1 - q / 44)); }
      else disc(x, -12 + (i * 37) % 25, -6 - ph, 2.2, B, 0.55);
    }
  }
  let signLayer = null;
  const SC = {
    // ---- 1: drop the bottle off a table ----
    1(x, m, t, now, cap) {
      st(x, [[20, 302], [840, 302]], { seed: 3, w: 2.4 });
      const top = box(60, 190, 250, 12); Ink.hatchFill(x, top, 1, B, 1.6); st(x, closeP(top), { seed: 5 });
      st(x, [[84, 202], [80, 302]], { seed: 7 }); st(x, [[288, 202], [292, 302]], { seed: 9 });
      const u = clamp((t - 0.5) / 0.5), landed = t >= 1.0, a = t - 1.0;
      const bx = 268 + 170 * u; let by = 190 + 112 * u * u; const rot = Math.sin(u * Math.PI) * 0.45;
      if (landed) by -= Math.abs(Math.sin(a * 9)) * 34 * Math.exp(-a * 3.2);
      if (m === 'shatter' && landed) {
        const k = Math.min(1, a * 3.5), r = H.rng(41);
        fillP(x, geo.ellipse(438, 304, 88 * k, 8 * k, 0, TAU), TINT); st(x, geo.ellipse(438, 304, 88 * k, 8 * k), { seed: 11, w: 1.5 });
        for (let i = 0; i < 11; i++) { const an = -0.2 - i * 0.27, d = (26 + r.range(0, 60)) * k, cx = 438 + Math.cos(an) * d * 1.5, cy = 298 + Math.sin(an) * d * 0.55 * (1 - k * 0.55) - (1 - k) * 40, q = r.range(8, 17), ro = r.range(0, 3) + k * 2;
          st(x, closeP([[cx - q, cy], [cx + Math.cos(ro) * q, cy - q * 0.8], [cx + q * 0.5, cy + q * 0.3]]), { seed: 13 + i, w: 1.8, amp: 0.15 }); }
        if (a < 0.9) text(x, 'CRACK!', 438, 232, { size: 40, color: RD });
      } else { x.save(); x.translate(bx, by); x.rotate(rot); x.scale(1.3, 1.3); LW = 1 / 1.3; bottle(x, m, now, landed); LW = 1; x.restore(); }
      if (m !== 'idle' && u > 0 && u < 1) [0, 1, 2].forEach((i) => st(x, [[bx - 44 - i * 9, by - 120 + i * 30], [bx - 60 - i * 9, by - 150 + i * 30]], { seed: 31 + i, w: 1.5, retrace: false }));
      if (m === 'opaque' && landed) text(x, '?', 520, 260, { size: 70, color: RD });
      if (m === 'unsafe' && cap) Ink.cross(x, 524, 232, 2);
      if (cap) { caption(x, cap, 690, 130, m === 'ok' ? GR : RD); if (m === 'ok') Ink.tick(x, 520, 240, 1.8); }
    },
    // ---- 2: flip the cap open and shut ----
    2(x, m, t, now, cap) {
      st(x, geo.curve([262, 330], [262, 300], [330, 300], [352, 284], 16), { seed: 3 }); st(x, geo.curve([598, 330], [598, 300], [530, 300], [508, 284], 16), { seed: 5 });
      const base = geo.rect(350, 226, 160, 58, 10); fillP(x, base, TINT); st(x, base, { seed: 7, w: 2.6 });
      const noz = box(420, 214, 20, 12); Ink.hatchFill(x, noz, 1, B, 2.4); st(x, closeP(noz), { seed: 9, w: 1.8 });
      const NB = { snap: 1, white: 25, split: 300 }[m], tb = { snap: 0.55, white: 1.9, split: 2.3 }[m], broken = !!NB && t >= tb;
      let n = 0, th = 0;
      if (m !== 'idle' && t > 0.3) {
        if (NB === 1) { n = 1; th = 1.9 * clamp((t - 0.3) / 0.25); }
        else { n = NB ? Math.min(NB, Math.floor(1 + (NB - 1) * Math.pow(clamp((t - 0.3) / (tb - 0.3)), 2))) : Math.min(5000, Math.floor(1 + 4999 * Math.pow(clamp((t - 0.3) / 2.4), 2.2))); th = 1.9 * (0.5 - 0.5 * Math.cos((t - 0.3) * 15)); }
      }
      x.save();
      if (broken) { const a = t - tb; x.translate(Math.min(700, 560 + a * 150), Math.min(280, 150 - 70 * a + 420 * a * a)); x.rotate(1.9 + Math.min(a, 0.62) * 4.1); x.translate(80, 20); }
      else { x.translate(510, 226); x.rotate(th); }
      const lid = geo.rect(-160, -40, 160, 40, 10); fillP(x, lid, TINT); st(x, lid, { seed: 11, w: 2.6 });
      const plug = box(-88, -8, 16, 8); st(x, closeP(plug), { seed: 13, w: 1.6, retrace: false });
      x.restore();
      if (!broken) { st(x, geo.ellipse(510, 226, 6, 6), { seed: 15, w: 2 }); if (m === 'white' && t > 0.9) { st(x, geo.ellipse(510, 226, 24, 24), { seed: 17, color: RD, w: 2.4 }); text(x, 'going white…', 660, 220, { font: 'hand', size: 24, color: RD }); } }
      else { zig(x, [[502, 218], [510, 226], [504, 232]], 19); zig(x, [[516, 216], [512, 226], [520, 234]], 21); }
      text(x, 'flips', 130, 128, { size: 24 }); text(x, String(n) + (n >= 5000 ? '+' : ''), 130, 184, { size: 52, color: broken ? RD : B });
      if (cap) { caption(x, cap, 430, 40, m === 'ok' ? GR : RD); if (m === 'ok') Ink.tick(x, 116, 240, 1.8); }
    },
    // ---- 3: a light switch with hot wiring behind it ----
    3(x, m, t, now, cap) {
      const idle = m === 'idle', u = m === 'melt' ? clamp((t - 1.2) / 1.5) : 0, cracked = m === 'crack' && t > 0.6;
      const on = !idle && t > 0.5, lit = on && !cracked && (u < 0.55 || (u < 0.8 && Math.sin(now * 40) > 0));
      st(x, [[530, 160], [700, 160], [700, 148]], { seed: 3, w: 2.6 });
      if (lit) glow(x, 700, 96, 86, AMBER, 1);
      st(x, geo.ellipse(700, 96, 32, 32, 1.95, 1.95 + TAU - 0.75), { seed: 5 }); const cp = box(688, 126, 24, 22); Ink.hatchFill(x, cp, 1, B, 2); st(x, closeP(cp), { seed: 7, w: 1.8 });
      st(x, [[692, 126], [692, 104], [700, 94], [708, 104], [708, 126]], { seed: 9, w: 1.5, color: lit ? [226, 120, 20] : B, retrace: false });
      const warp = ([px, py]) => (u ? [px + u * 5 * Math.sin(py * 0.05), py + u * Math.pow(clamp((py - 60) / 200), 2) * (44 + 24 * Math.sin(px * 0.045))] : [px, py]);
      const P = geo.seg(geo.rect(330, 60, 200, 200, 18), 8).map(warp);
      fillP(x, P, TINT); if (m === 'dark') { Ink.hatchFill(x, P, 1, B, 2.8); Ink.hatchFill(x, P, 1, B, 1.9); Ink.hatchFill(x, P, 1, B, 1.3); }
      st(x, P, { seed: 11, w: 2.8 });
      const R = geo.seg(geo.rect(392, 108, 76, 104, 8), 8).map(warp); st(x, R, { seed: 13 });
      st(x, [[392, 160], [468, 160]].map(warp), { seed: 15, w: 1.6 });
      Ink.hatchFill(x, box(396, on ? 164 : 112, 68, 44).map(warp), 1, B, 1.5);
      [[352, 160], [508, 160]].forEach((q) => { const w = warp(q); disc(x, w[0], w[1], 3.2, B); });
      if (u > 0.25) [[378, 0.9], [436, 1.3], [498, 0.7]].forEach(([px, k], i) => { const y0 = warp([px, 260])[1]; st(x, geo.ellipse(px, y0 + 6 + u * 16 * k, 5, 8 + u * 12 * k), { seed: 17 + i, w: 1.8 }); });
      if (!idle && t > 0.9) { const h = clamp((t - 0.9) / 1.0); [356, 396, 436, 476, 506].forEach((px, i) => wiggle(x, px, 54, 54 - 40 * h, now, RD, 0.65)); text(x, 'hot wiring', 318, 40, { font: 'hand', size: 24, color: RD, a: h, align: 'right' }); }
      if (cracked) { zig(x, [[338, 96], [386, 122], [372, 150], [438, 170], [424, 204], [500, 222], [524, 248]], 23); zig(x, [[438, 170], [476, 142], [470, 112]], 25); if (t < 1.6) text(x, 'CRACK!', 430, 44, { size: 40, color: RD }); }
      if (cap) { caption(x, cap, 165, 130, m === 'ok' ? GR : RD); if (m === 'ok') Ink.tick(x, 150, 232, 1.8); }
    },
    // ---- 4: the vacuum former ----
    4(x, m, t, now, cap) {
      const idle = m === 'idle', char = m === 'char';
      const body = box(240, 214, 380, 100); Ink.hatchShadow(x, body, 1, 7, 7); st(x, closeP(body), { seed: 3, w: 2.6 });
      const domes = [330, 430, 530], dome = (px) => Math.max(...domes.map((cx) => 34 * Math.sqrt(Math.max(0, 1 - Math.pow((px - cx) / 36, 2)))));
      domes.forEach((cx, i) => { const D = geo.ellipse(cx, 214, 36, 34, Math.PI, TAU); Ink.hatchFill(x, D, 1, B, 1.2); st(x, D, { seed: 5 + i, w: 1.8 }); });
      const heater = geo.rect(270, 22, 320, 26, 8); st(x, heater, { seed: 9, w: 2.4 });
      const coil = []; for (let i = 0; i <= 30; i++) coil.push([284 + i * 9.7, 35 + (i % 2 ? 6 : -6)]); st(x, coil, { seed: 11, w: 1.6, color: RD, retrace: false, amp: 0.1 });
      [box(230, 140, 24, 22), box(606, 140, 24, 22)].forEach((c, i) => { Ink.hatchFill(x, c, 1, B, 2); st(x, closeP(c), { seed: 13 + i }); st(x, [[c[0][0] + 12, 162], [c[0][0] + 12, 214]], { seed: 17 + i, w: 2.4 }); });
      const heatU = idle ? 0 : clamp((t - 0.2) / 1.2), sagU = idle || char ? 0 : clamp((t - 1.4) / 0.8);
      if (!idle && t > 0.2 && t < (char ? 9 : 2.3)) [300, 352, 404, 456, 508, 560].forEach((px) => wiggle(x, px, 132, 58, now, RD, 0.5 * (char ? 1 : 1 - sagU)));
      const pts = [];
      for (let px = 254; px <= 606; px += 4) { const flat = 151 + (char ? 0 : Math.sin(Math.PI * (px - 254) / 352) * 12 * heatU), e = clamp(Math.min(px - 254, 606 - px) / 24), tgt = 151 + (Math.min(209, 207 - dome(px)) - 151) * e; pts.push([px, flat + (tgt - flat) * sagU]); }
      if (char && heatU > 0) { const sh = box(254, 146, 352, 10); Ink.hatchFill(x, sh, 1, B, 1 + 2.4 * heatU); if (heatU > 0.5) Ink.hatchFill(x, sh, 1, B, 2.2); if (heatU > 0.4) [300, 430, 560].forEach((px) => wiggle(x, px, 142, 142 - 70 * (heatU - 0.4), now * 0.5, B, 0.6, 9)); }
      st(x, pts, { seed: 21, w: 3.2, amp: 0.2 });
      text(x, 'heater', 660, 42, { font: 'hand', size: 22, align: 'left', a: 0.75 }); text(x, 'sheet', 660, 158, { font: 'hand', size: 22, align: 'left', a: 0.75 }); text(x, 'mould', 130, 206, { font: 'hand', size: 22, a: 0.75 }); st(x, [[166, 200], [286, 196]], { seed: 23, w: 1.4, retrace: false });
      if (m === 'crack' && t > 2.5) { zig(x, [[306, 204], [322, 184], [316, 172], [338, 162]], 25); zig(x, [[506, 198], [524, 186], [520, 170], [544, 166], [552, 190]], 27); }
      if (m === 'unsafe' && cap) Ink.cross(x, 660, 250, 1.8);
      if (cap) { caption(x, cap, 430, cap.includes('|') ? 262 : 276, m === 'ok' ? GR : RD); if (m === 'ok') Ink.tick(x, 650, 262, 1.8); }
    },
    // ---- 5: boat meets rock ----
    5(x, m, t, now, cap) {
      const rock = [[630, 268], [650, 196], [688, 170], [730, 186], [770, 268]]; Ink.hatchFill(x, rock, 1, B, 1.3); st(x, rock, { seed: 3, w: 2.6 });
      const e = (v) => v * v * (3 - 2 * v), u = m === 'idle' ? 0 : e(clamp((t - 0.3) / 1.1)), hit = m !== 'idle' && t >= 1.4, a = t - 1.4;
      let bx = 170 + 358 * u, by = 236 + Math.sin(now * 2.2) * 3, rot = Math.sin(now * 1.7) * 0.02, fold = 0;
      if (hit) {
        if (m === 'ok') { bx = 528 - 78 * (1 - Math.exp(-a * 3)); rot += Math.sin(a * 8) * 0.09 * Math.exp(-a * 2); }
        else if (m === 'crack') { rot = Math.min(0.2, a * 0.3); by += Math.min(26, a * 22); }
        else { fold = Math.min(0.55, a * 1.4); rot = -0.06; }
        if (a < 0.5) [[-0.5, 30], [-1.1, 36], [-1.7, 30]].forEach(([an, d], i) => st(x, [[652 + Math.cos(an) * 14, 196 + Math.sin(an) * 14], [652 + Math.cos(an) * d, 196 + Math.sin(an) * d]], { seed: 5 + i, w: 2, color: RD, retrace: false }));
      }
      x.save(); x.translate(bx, by); x.rotate(rot);
      const bend = ([px, py]) => { if (px <= 20 || !fold) return [px, py]; const dx = px - 20, dy = py - 10, c = Math.cos(-fold), s = Math.sin(-fold); return [20 + dx * c - dy * s, 10 + dx * s + dy * c]; };
      const hull = geo.seg([[-120, -34], [96, -34], [124, -40], [100, 10], [-104, 10], [-120, -34]], 10).map(bend);
      fillP(x, hull, TINT); Ink.hatchFill(x, geo.seg([[-112, -10], [112, -10], [100, 10], [-104, 10]], 10).map(bend), 1, B, 1.3); st(x, hull, { seed: 9, w: 2.8 });
      st(x, [[-10, -34], [-10, -150]], { seed: 11, w: 2.6 }); const sail = [[-4, -146], [-4, -48], [70, -48]]; fillP(x, sail, TINT); st(x, closeP(sail), { seed: 13 }); st(x, closeP([[-16, -140], [-16, -60], [-62, -60]]), { seed: 15, w: 1.8 });
      if (fold) zig(x, [[20, -36], [26, -16], [18, -4], [22, 10]], 17);
      if (m === 'crack' && hit) { zig(x, [[112, -38], [98, -22], [108, -12], [94, 4]], 19); zig(x, [[98, -22], [82, -18], [76, -4]], 21); [0, 1, 2].forEach((i) => { const q = (now * 1.6 + i * 0.33) % 1; disc(x, 104 + i * 6, -12 + q * 26, 2.6, B, 0.8 * (1 - q)); }); }
      x.restore();
      x.save(); x.strokeStyle = rgba(B, 0.85); x.lineWidth = 2.6; x.beginPath(); for (let px = 20; px <= 840; px += 8) { const y = 240 + Math.sin(px * 0.045 + now * 2.2) * 4; if (px === 20) x.moveTo(px, y); else x.lineTo(px, y); } x.stroke();
      x.strokeStyle = rgba(B, 0.4); x.lineWidth = 1.6; [270, 296].forEach((y0, j) => { x.beginPath(); for (let px = 60 + j * 90; px <= 800; px += 8) { const y = y0 + Math.sin(px * 0.05 + now * 1.6 + j * 2) * 3; if ((px + j * 40) % 200 < 110) x.lineTo(px, y); else x.moveTo(px + 8, y); } x.stroke(); }); x.restore();
      if (cap) { caption(x, cap, 430, cap.includes('|') ? 34 : 46, m === 'ok' ? GR : RD); if (m === 'ok') Ink.tick(x, 760, 120, 1.8); }
    },
    // ---- 6: ten years of weather on a shop sign ----
    6(x, m, t, now, cap) {
      const idle = m === 'idle', yr = idle ? 0 : clamp((t - 0.4) / 2.2), cracked = m === 'crack' && t > 1.7;
      st(x, [[130, 206], [730, 206]], { seed: 3, w: 2.6 }); st(x, closeP(box(170, 222, 300, 92)), { seed: 5 }); st(x, [[320, 222], [320, 314]], { seed: 7, w: 1.5 }); st(x, closeP(box(520, 222, 110, 100)), { seed: 9 }); disc(x, 536, 274, 3.2, B);
      [[196, 250, 224, 232], [206, 266, 246, 240], [350, 250, 378, 232]].forEach(([a, b, c, d], i) => st(x, [[a, b], [c, d]], { seed: 11 + i, w: 1.2, retrace: false }));
      // weather
      if (!idle) { const wet = Math.floor(yr * 10) % 2 === 1 && yr < 1;
        if (wet) { const cl = geo.curve([52, 110], [40, 84], [76, 70], [92, 86], 10).concat(geo.curve([92, 86], [106, 62], [146, 72], [142, 96], 10), geo.curve([142, 96], [166, 100], [164, 124], [140, 122], 8), [[52, 122], [52, 110]]); st(x, cl, { seed: 15 }); for (let i = 0; i < 5; i++) { const q = (now * 2 + i * 0.2) % 1; st(x, [[66 + i * 20, 134 + q * 30], [60 + i * 20, 148 + q * 30]], { seed: 17 + i, w: 1.6, retrace: false }); } }
        else { glow(x, 100, 100, 50, AMBER, 0.8); st(x, geo.ellipse(100, 100, 20, 20), { seed: 15 }); for (let i = 0; i < 8; i++) { const an = i * TAU / 8 + now * 0.4; st(x, [[100 + Math.cos(an) * 28, 100 + Math.sin(an) * 28], [100 + Math.cos(an) * 39, 100 + Math.sin(an) * 39]], { seed: 17 + i, w: 1.8, retrace: false }); } }
        text(x, 'year ' + Math.floor(yr * 10), 770, 110, { size: 30 });
        if (m === 'bend' || (m === 'crack' && t > 1.3 && t < 2.3)) [150, 176, 124].forEach((y, i) => { const q = (now * 1.4 + i * 0.3) % 1; st(x, [[640 + q * 60, y], [700 + q * 60, y - 4]], { seed: 27 + i, w: 1.6, retrace: false }); });
      }
      x.save(); x.translate(430, 134);
      if (m === 'bend') { const k = clamp((t - 0.4) / 0.6); x.rotate(0.05 * k * Math.sin(now * 5)); x.transform(1, 0.09 * k * Math.sin(now * 6.3), 0.12 * k * Math.sin(now * 4.1), 1, 0, 0); }
      if (cracked) x.rotate(0.03);
      const P = geo.rect(-200, -56, 400, 112, 10); Ink.hatchShadow(x, P, 1, 7, 7);
      const fade = m === 'cloudy' ? yr : 0;
      if (m === 'dark') { Ink.hatchFill(x, P, 1, B, 2.8); Ink.hatchFill(x, P, 1, B, 1.9); Ink.hatchFill(x, P, 1, B, 1.3); }
      if (m === 'dull') Ink.hatchFill(x, P, 1, B, 0.9);
      if (fade > 0.15) Ink.hatchFill(x, P, 1, B, 0.4 + 1.6 * fade);
      st(x, P, { seed: 31, w: 2.8 });
      // lettering: a bright red fill unless the polymer cannot do it
      const fill = m === 'dark' ? null : m === 'dull' ? 'rgba(110,120,150,0.16)' : rgba(RD, 0.5 * (1 - fade * 0.85));
      x.save(); x.font = '700 64px "Fredoka", "Arial Rounded MT Bold", system-ui'; const s = 'FISH BAR'; let w = 0; const pos = []; for (const ch of s) { pos.push(w); w += x.measureText(ch).width + 64 * 0.06; }
      if (fill) { x.fillStyle = fill; [...s].forEach((ch, i) => x.fillText(ch, -w / 2 + pos[i], 22)); } x.restore();
      if (!signLayer) { signLayer = document.createElement('canvas'); signLayer.width = 840; signLayer.height = 240; const g = signLayer.getContext('2d'); g.scale(2, 2); Ink.drawBubble(g, s, 210, 82, 64, B, 1, 0, 'center'); }
      x.drawImage(signLayer, -210, -60, 420, 120);
      if (m === 'ok' || idle) [[-178, -36], [176, -30], [150, 36]].forEach(([sx, sy], i) => { const k = 6 + 8 * Math.abs(Math.sin(now * 2.4 + i * 1.3)); st(x, [[sx - k, sy], [sx + k, sy]], { seed: 33 + i, w: 1.6, retrace: false }); st(x, [[sx, sy - k], [sx, sy + k]], { seed: 37 + i, w: 1.6, retrace: false }); });
      if (cracked) { zig(x, [[-60, -56], [-40, -20], [-64, 0], [-30, 30], [-44, 56]], 41); zig(x, [[-40, -20], [20, -30], [60, -8]], 43); zig(x, [[120, 56], [140, 20], [200, 10]], 45); }
      x.restore();
      if (cracked && t < 2.6) text(x, 'CRACK!', 740, 170, { size: 36, color: RD });
      if (cap) { caption(x, cap, 430, 36, m === 'ok' ? GR : RD); if (m === 'ok') Ink.tick(x, 676, 168, 1.6); }
    },
  };

  Book.page({
    id: 'p08',
    title: 'Choose the polymer',
    build(ui, root) {
      const css = document.createElement('style');
      css.textContent = `
        .p08-bench{position:relative;margin:0 0 calc(var(--R)*1.4);padding:12px 14px 14px;background:rgba(251,250,245,.9)}
        .p08-tabs{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 10px}
        .p08-tab{font:700 16px Fredoka;color:var(--ink);background:#fff;border:2px solid rgba(30,46,150,.4);border-radius:12px 12px 4px 4px;min-height:46px;padding:6px 12px;cursor:pointer;line-height:1.2;touch-action:manipulation}
        .p08-tab.on{background:var(--ink);color:#fff;border-color:var(--ink)}
        .p08-tab .tk{color:var(--green);margin-left:4px}.p08-tab.on .tk{color:#9df0b6}
        .p08-brief{display:flex;gap:12px;align-items:center;background:rgba(255,236,120,.45);border-left:5px solid rgba(240,200,60,.9);padding:8px 14px;margin:0 0 12px;line-height:1.45;font-size:19px;transform:rotate(-.3deg)}
        .p08-brief .n{font:700 15px Fredoka;color:var(--red);white-space:nowrap;letter-spacing:.06em}
        .p08-tray{display:grid;grid-template-columns:repeat(auto-fill,minmax(168px,1fr));gap:8px;margin:0 0 10px}
        .p08-card{display:flex;flex-direction:column;justify-content:center;background:#fff;border:2px solid rgba(30,46,150,.4);border-radius:10px;padding:5px 10px;min-height:56px;cursor:pointer;color:var(--ink);text-align:left;line-height:1.2;touch-action:manipulation;font:400 14.5px Fredoka}
        .p08-card b{font:700 19px Fredoka}
        .p08-card.picked{border-color:var(--ink);background:#e8ecff;transform:rotate(-1.2deg) scale(1.03);box-shadow:0 4px 10px rgba(30,46,150,.25)}
        .p08-card.tried{opacity:.5}.p08-card.tried b::after{content:' ✗';color:var(--red)}
        .p08-card.won b::after{content:' ✓';color:var(--green)}
        .p08-card:disabled{cursor:default}
        .p08-row{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin:0 0 8px}
        .p08-row .btn{margin-top:0}
        .p08-go{font-size:20px!important;padding:10px 26px!important}
        .p08-tip{font-size:16px;color:rgba(30,46,150,.75);line-height:1.4;flex:1 1 220px}
        .p08-stagewrap{position:relative;margin:0 0 4px}
        .p08-stamp{position:absolute;right:10px;bottom:8px;font:700 26px Fredoka;letter-spacing:.04em;padding:2px 14px;border:4px solid;border-radius:10px;transform:rotate(-7deg) scale(0);transition:transform .25s cubic-bezier(.3,1.6,.5,1);background:rgba(251,250,245,.85);pointer-events:none}
        .p08-stamp.on{transform:rotate(-7deg) scale(1)}.p08-stamp.good{color:var(--green)}.p08-stamp.bad{color:var(--red)}
        .p08-bench .fb{font-size:18px;margin-top:4px}
        .p08-bench.recall .fb,.p08-bench.recall .p08-stagewrap,.p08-bench.recall .p08-tray{filter:blur(7px);opacity:.5;pointer-events:none}
        @media (max-width:700px){.p08-brief{font-size:18px}.p08-tray{grid-template-columns:repeat(auto-fill,minmax(140px,1fr))}}`;
      root.appendChild(css);

      ui.h('Choose the polymer');
      ui.p('Six clients need a product. For each brief, pick the polymer you would use from <b>all eleven</b>, then press <b>TEST</b> and watch what happens to it.');
      ui.p('If it fails, watch <b>why</b>, then choose again. <span class="key">Every test is recorded</span>, so think about the properties before you press!', 'small');

      const IDS = [1, 2, 3, 4, 5, 6];
      const recs = {}; IDS.forEach((b) => (recs[b] = ui.record('p08.b' + b, { label: `Brief ${b}: polymer for a ${BR[b].short}`, type: 'choose', max: 1 })));
      const saved = (b) => recs[b].get() || {};
      const ST = {}; IDS.forEach((b) => (ST[b] = { sel: saved(b).sel || null, tries: (saved(b).tries || []).slice(), mis: (saved(b).mis || '').split(',').filter(Boolean) }));
      const solved = (b) => ST[b].tries.some((q) => q.lv > 0);
      let cur = IDS.find((b) => !solved(b)) || 1, sim = null;

      const bench = ui.el('div', 'p08-bench'); requestAnimationFrame(() => Ink.frame(bench, { w: 2.4 }));
      const tabs = ui.el('div', 'p08-tabs', '', bench), tabEls = {};
      IDS.forEach((b) => { const tb = ui.el('button', 'p08-tab', '', tabs); tb.type = 'button'; tabEls[b] = tb; tb.onclick = () => { if (b === cur || (sim && !sim.done)) return; Book.sfx('paper', { gain: 0.3, dur: 0.2 }); cur = b; sim = null; sync(); }; });
      const brief = ui.el('div', 'p08-brief', '', bench);
      const tray = ui.el('div', 'p08-tray', '', bench), cardEls = {};
      POLY.forEach(([id, name, ab]) => {
        const c = ui.el('button', 'p08-card', `<b>${ab}</b><span>${name}</span>`, tray); c.type = 'button'; cardEls[id] = c;
        c.onclick = () => { if (sim && !sim.done) return; if (sim) sim = null; ST[cur].sel = ST[cur].sel === id ? null : id; Book.sfx('tick', { gain: 0.5 }); sync(); };
      });
      const row = ui.el('div', 'p08-row', '', bench);
      const goBtn = ui.el('button', 'btn p08-go', 'TEST IT ▸', row); goBtn.type = 'button';
      const nextBtn = ui.el('button', 'btn', 'Next brief ▸', row); nextBtn.type = 'button';
      const tip = ui.el('span', 'p08-tip', '', row);
      const stageWrap = ui.el('div', 'p08-stagewrap', '', bench);
      const S = Stage(stageWrap, W, Hh);
      const stamp = ui.el('div', 'p08-stamp', '', stageWrap);
      const fb = ui.el('div', 'fb', '', bench);
      S.onFonts = () => { signLayer = null; };

      function commit(b) {
        const s = ST[b], ok = solved(b);
        recs[b].set({ answer: s.tries.map((q, i) => `${i + 1}) ${N[q.p]} ${q.lv === 2 ? '✓ best choice' : q.lv === 1 ? '✓ works' : '✗ fails'}`).join('; '), correct: ok, score: ok ? 1 : 0, max: 1, mis: s.mis.join(','), tries: s.tries, sel: s.sel });
      }
      function sync() {
        const s = ST[cur], busy = !!sim && !sim.done;
        IDS.forEach((b) => { tabEls[b].innerHTML = b + '. ' + BR[b].tab + (solved(b) ? '<span class="tk">✓</span>' : ''); tabEls[b].classList.toggle('on', b === cur); });
        brief.innerHTML = `<span class="n">BRIEF ${cur}</span><span>${BR[cur].text}</span>`;
        POLY.forEach(([id]) => { const c = cardEls[id], tr = s.tries.find((q) => q.p === id); c.classList.toggle('picked', s.sel === id); c.classList.toggle('tried', !!tr && tr.lv === 0 && s.sel !== id); c.classList.toggle('won', !!tr && tr.lv > 0); c.disabled = busy; });
        goBtn.disabled = !s.sel || busy || (!!sim && sim.done && sim.p === s.sel);
        const allDone = IDS.every(solved);
        nextBtn.style.display = solved(cur) && !busy && !allDone ? '' : 'none';
        tip.textContent = busy ? BR[cur].test : allDone && solved(cur) ? 'All six briefs solved. Now explain one in words below.' : solved(cur) ? 'Solved! You can still test other polymers to see what happens.' : sim && sim.done && sim.p === s.sel ? 'Choose a different polymer and test again.' : s.sel ? 'Happy with it? Press TEST. ' + BR[cur].test : 'Tap a polymer to choose it.';
        if (!sim) { stamp.className = 'p08-stamp'; fb.className = 'fb'; fb.innerHTML = ''; }
        S.go();
      }
      function verdict() {
        const v = sim.v; sim.done = true;
        const ok = v[0] > 0;
        fb.className = 'fb on ' + (ok ? 'good' : 'bad');
        fb.innerHTML = (v[0] === 2 ? '✓ Best choice! ' : v[0] === 1 ? '✓ It works. ' : '✗ ') + v[3];
        stamp.textContent = ok ? 'IT WORKS!' : 'NOT YET…'; stamp.className = 'p08-stamp on ' + (ok ? 'good' : 'bad');
        Book.sfx(ok ? 'success' : 'error', { gain: 0.4 });
        sync();
      }
      goBtn.onclick = () => {
        const b = cur, s = ST[b], p = s.sel; if (!p || (sim && !sim.done)) return;
        const v = V[b](p);
        if (!s.tries.length || s.tries[s.tries.length - 1].p !== p) s.tries.push({ p, lv: v[0] });
        (v[4] || '').split(',').filter(Boolean).forEach((m) => { if (!s.mis.includes(m)) s.mis.push(m); });
        commit(b);
        sim = { b, p, v, t: 0, done: false }; stamp.className = 'p08-stamp'; fb.className = 'fb'; fb.innerHTML = '';
        Book.sfx('stamp', { gain: 0.5 }); sync();
        requestAnimationFrame(() => { const r = stageWrap.getBoundingClientRect(), sh = bench.closest('.sheet'), lim = innerHeight - 150; if (sh && r.bottom > lim) sh.scrollTop += Math.min(r.bottom - lim, r.top - 12); });
      };
      nextBtn.onclick = () => { const n = IDS.find((b) => !solved(b)); if (n == null) return; cur = n; sim = null; sync(); bench.scrollIntoView({ block: 'start', behavior: 'smooth' }); };

      S.render = (dt, now) => {
        const x = S.ctx; LW = 1;
        if (sim && sim.b === cur) {
          sim.t += dt;
          SC[cur](x, sim.v[1], sim.t, now, sim.done ? sim.v[2] : null);
          if (!sim.done && sim.t >= TEND[cur]) verdict();
        } else { SC[cur](x, 'idle', 0, now, null); text(x, ST[cur].sel ? 'ready to test: ' + N[ST[cur].sel] : 'choose a polymer, then TEST', cur === 4 ? 430 : cur === 3 ? 165 : 430, cur === 4 ? 276 : cur === 3 ? 130 : cur === 1 ? 60 : 46, { font: 'hand', size: cur === 3 ? 22 : 24, a: 0.7 }); }
        return true;
      };
      sync();

      // ------------------------------------------------------------------ written answer ------------------------------------------------------------------
      ui.p('Last job: a new brief, answered in words like an exam question. <span class="small">(The test bench blurs while you write.)</span>');
      const wr = ui.write({
        id: 'p08.explain', label: 'Explain why polypropylene suits a lunch box with a hinged lid [3]', marks: 3, lines: 5,
        q: 'Explain why <b>polypropylene</b> is a good choice for a lunch box with a hinged lid.',
        scheme: ['I said polypropylene <b>resists fatigue</b> / is flexible', '…so the thin hinge can <b>bend many times</b> (open and shut every day) without snapping', 'I gave a <b>second property</b>: tough, lightweight, or heat- and chemical-resistant', '…and linked it to the lunch box: survives being dropped, easy to carry, or safe for food and the microwave'],
        model: 'Polypropylene resists fatigue, so the thin "living hinge" can be bent open and shut thousands of times without snapping. It is also tough, so the lunch box will not crack if it is dropped in a school bag, and it is lightweight and safe for food.',
      });
      const ta = wr.querySelector('textarea'), wb = wr.querySelector('.btn');
      ta.addEventListener('focus', () => { if (!wr.querySelector('.scheme.on')) bench.classList.add('recall'); });
      ta.addEventListener('blur', () => { if (!ta.value.trim()) bench.classList.remove('recall'); });
      wb.addEventListener('click', () => setTimeout(() => { if (wr.querySelector('.scheme.on')) bench.classList.remove('recall'); }, 30));
    },
  });
})();
