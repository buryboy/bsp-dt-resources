// Page 7 — Myth busters: a quick MYTH / FACT card game built from the common misconceptions.
(function () {
  'use strict';
  const B = Ink.BLUE, R = Ink.RED, G = Ink.GREEN, rgba = Ink.rgba, geo = Ink.geo;
  const PAPER = '#fbfaf5';
  const HAND = (s) => `400 ${s}px "Gloria Hallelujah", "Comic Sans MS", cursive`;
  const LAB = (s, w = 600) => `${w} ${s}px Fredoka, "Arial Rounded MT Bold", system-ui`;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const TIME = 15; // seconds per card (gentle)

  const CARDS = [
    { id: 'c01', s: 'Glass is hard, so it must be tough.', fact: false, mis: 'hard-vs-tough', why: 'Glass is hard (it resists scratches) but brittle: it shatters when hit. Hard and tough are different.' },
    { id: 'c02', s: 'Copper is ductile, so it can be drawn into electrical wires.', fact: true, mis: 'malleable-vs-ductile', why: 'Ductile = can be stretched out into a thin wire. Copper is also a great electrical conductor.' },
    { id: 'c03', s: 'A huge oak log is heavy, so oak must be denser than water.', fact: false, mis: 'density-vs-weight', why: 'Density is mass for its size. Oak is 0.75 g/cm³ and water is 1.00, so even a huge oak log floats.' },
    { id: 'c04', s: 'Elastic means it returns to its original shape.', fact: true, mis: 'elastic-vs-stretchy', why: 'Elastic = springs back when the force is removed, like rubber. It doesn’t just mean “stretchy”.' },
    { id: 'c05', s: 'Malleable means it can be stretched into a wire.', fact: false, mis: 'malleable-vs-ductile', why: 'That’s ductile. Malleable = shaped by compression (hammered, pressed, rolled) without cracking.' },
    { id: 'c06', s: 'Metals feel cold because they are colder than wood.', fact: false, mis: 'metal-feels-cold', why: 'They are the same temperature as the room. Metal conducts heat away from your hand faster, so it feels cold.' },
    { id: 'c07', s: 'Toughness is the opposite of brittleness.', fact: true, mis: 'hard-vs-tough', why: 'Tough = absorbs an impact without breaking. Brittle = cracks or shatters instead.' },
    { id: 'c08', s: 'Strength and hardness mean the same thing.', fact: false, mis: 'strong-vs-hard', why: 'Strength = withstanding a force without breaking. Hardness = resisting scratches, wear and dents.' },
    { id: 'c09', s: 'Thermosetting polymers can’t be melted down again.', fact: true, mis: 'fusibility-thermoset', why: 'Thermosets don’t melt when heated: they char. That’s why they make good saucepan handles.' },
    { id: 'c10', s: 'Brittle materials are always weak.', fact: false, mis: 'brittle-vs-weak', why: 'Cast iron and concrete are brittle but very strong in compression (squashing). They snap or shatter under impact.' },
    { id: 'c11', s: 'All metals conduct electricity.', fact: true, mis: 'conductor-insulator', why: 'All metals conduct electricity and heat. Polymers, wood, glass and ceramics are insulators.' },
    { id: 'c12', s: 'Absorbency only matters for paper and fabrics.', fact: false, mis: 'absorbency', why: 'It matters for timber too: wood outdoors soaks up water, swells and rots. Paint or preservative reduces absorbency.' },
  ];

  function css() {
    if (document.getElementById('p07-css')) return;
    const s = document.createElement('style'); s.id = 'p07-css';
    s.textContent = `
      .p07-cv { position: relative; display: block; width: 100%; height: auto; touch-action: manipulation; user-select: none; -webkit-user-select: none; }
      .p07-why { min-height: calc(var(--R) * 2); font-size: 19px; line-height: var(--R); margin: 4px 0 8px; }
      .p07-why b { font-family: Fredoka; font-weight: 600; }
      .p07-why.good b.v { color: var(--green); } .p07-why.bad b.v { color: var(--red); }
      .p07-row { display: flex; gap: 14px; margin: 0 0 var(--R); }
      .p07-row button { flex: 1 1 0; min-height: 76px; font: 700 32px Fredoka, system-ui; letter-spacing: .04em; border-radius: 18px; background: #fff; cursor: pointer; touch-action: manipulation; }
      .p07-row button:active { transform: translateY(3px); }
      .p07-myth { color: var(--red); border: 4px solid var(--red); box-shadow: 0 5px 0 #7d1119; }
      .p07-fact { color: var(--green); border: 4px solid var(--green); box-shadow: 0 5px 0 #0e4525; }
      .p07-go { color: #fff; background: var(--ink) !important; border: 4px solid var(--ink); box-shadow: 0 5px 0 #0c1660; }
      .p07-row button[hidden] { display: none; }
      .p07-miss { font-size: 17px; line-height: 1.5; margin: 0 0 var(--R); }
      .p07-miss li { margin: 0 0 8px; } .p07-miss b { font-family: Fredoka; font-weight: 600; }
    `;
    document.head.appendChild(s);
  }
  const poly = (ctx, pts) => { ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); };
  function text(ctx, s, x, y, o = {}) {
    ctx.save(); ctx.globalCompositeOperation = 'multiply';
    ctx.font = o.font === 'lab' ? LAB(o.size || 22, o.weight) : HAND(o.size || 22);
    ctx.fillStyle = rgba(o.color || B, o.a ?? 0.92); ctx.textAlign = o.align || 'left';
    ctx.translate(x, y); if (o.rot) ctx.rotate(o.rot); ctx.fillText(s, 0, 0); ctx.restore();
  }
  function wrap(ctx, s, maxW, font) {
    ctx.save(); ctx.font = font; const out = []; let cur = '';
    s.split(' ').forEach((w) => { const t = cur ? cur + ' ' + w : w; if (ctx.measureText(t).width > maxW && cur) { out.push(cur); cur = w; } else cur = t; });
    if (cur) out.push(cur); ctx.restore(); return out;
  }

  Book.page({
    id: 'p07',
    title: 'Myth busters',
    build(ui, root) {
      css();
      ui.h('Myth busters');
      ui.p('12 statements about materials. Some are <b>facts</b>, some are <b>myths</b> lots of people believe. Stamp each one before the timer runs out!');

      const recs = {}; CARDS.forEach((c) => (recs[c.id] = ui.record('p07.' + c.id, { label: c.s, type: 'myth/fact', max: 1 })));
      const scoreRec = ui.record('p07.score', { label: 'Myth busters: score out of 12 (first go)', type: 'game', max: 0 });

      // ---------- stage ----------
      const W = 860, Hh = 380, dpr = Math.min(2, window.devicePixelRatio || 1);
      const cv = ui.el('canvas', 'p07-cv'); cv.width = W * dpr; cv.height = Hh * dpr; cv.style.aspectRatio = W + ' / ' + Hh;
      const ctx = cv.getContext('2d');
      const why = ui.el('div', 'p07-why', '');
      const row = ui.el('div', 'p07-row');
      const bM = ui.el('button', 'p07-myth', 'MYTH', row), bF = ui.el('button', 'p07-fact', 'FACT', row), bGo = ui.el('button', 'p07-go', 'Start ▸', row);
      [bM, bF, bGo].forEach((b) => (b.type = 'button'));
      const missBox = ui.el('div', '', '');
      let visible = true; if (window.IntersectionObserver) new IntersectionObserver((es) => { visible = es[es.length - 1].isIntersecting; dirty = true; }).observe(cv);

      const CARD = geo.rect(70, 66, 720, 296, 14);
      const L = document.createElement('canvas'); L.width = cv.width; L.height = cv.height; const lx = L.getContext('2d');
      const firstScore = () => CARDS.filter((c) => (recs[c.id].get() || {}).first === true).length;
      const firstDone = () => CARDS.filter((c) => recs[c.id].get()).length;
      const prevScore = scoreRec.get();
      let topStreak = (prevScore && prevScore.topStreak) || 0, plays = (prevScore && prevScore.plays) || 0, best = (prevScore && prevScore.best) || 0;

      let state = 'ready', order = CARDS.slice(), idx = 0, score = 0, streak = 0, bestStreak = 0, left = TIME, lastTick = 99;
      let slide = 0, stamp = null, mark = null, pops = [], dirty = true, missed = [];

      function paintCard() {
        lx.setTransform(1, 0, 0, 1, 0, 0); lx.globalCompositeOperation = 'source-over'; lx.clearRect(0, 0, L.width, L.height);
        lx.setTransform(dpr, 0, 0, dpr, 0, 0); lx.lineCap = lx.lineJoin = 'round';
        lx.save(); lx.translate(430, 214); lx.rotate(state === 'play' || state === 'shown' ? ((idx % 3) - 1) * 0.012 : -0.008); lx.translate(-430, -214);
        lx.globalCompositeOperation = 'multiply';
        Ink.hatchShadow(lx, CARD, 1, 9, 9, B);
        lx.globalCompositeOperation = 'source-over'; lx.fillStyle = PAPER; poly(lx, CARD); lx.fill();
        lx.globalCompositeOperation = 'multiply';
        Ink.stroke(lx, CARD, { w: 3.2, seed: 7 + idx });
        Ink.stroke(lx, geo.rect(82, 78, 696, 272, 8), { w: 1.4, seed: 17 + idx, retrace: false });
        if (state === 'ready') {
          Ink.drawBubble(lx, 'MYTH or FACT?', 430, 180, 62, B, 1, 0, 'center');
          const done = firstDone();
          text(lx, done >= 12 ? `First go: ${firstScore()} / 12.  Can you beat it?` : '12 cards. 15 seconds each. Ready?', 430, 250, { size: 28, align: 'center' });
          text(lx, 'Tap Start!', 430, 304, { size: 28, align: 'center', color: R });
        } else if (state === 'end') {
          Ink.drawBubble(lx, `You busted ${score} / 12!`, 430, 170, 58, score >= 10 ? G : B, 1, 0, 'center');
          const msg = score === 12 ? 'Myth-busting legend!' : score >= 10 ? 'Sharp eyes! Nearly perfect.' : score >= 7 ? 'Good going. Replay to beat it!' : 'Some tricky ones! Check below, then replay.';
          text(lx, msg, 430, 236, { size: 28, align: 'center' });
          text(lx, `best streak: ${bestStreak}` + (plays > 1 ? `   ·   first go: ${firstScore()} / 12` : ''), 430, 290, { size: 24, align: 'center', color: R });
          // doodle stars
          [[130, 120, 20], [735, 130, 24], [150, 300, 16], [720, 300, 18]].forEach(([x, y, r], i) => { const P = []; for (let k = 0; k <= 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, rr = k % 2 ? r * 0.45 : r; P.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]); } Ink.stroke(lx, P, { w: 2, seed: 30 + i }); });
        } else {
          const c = order[idx], font = HAND(36), ls = wrap(lx, c.s, 620, font), lh = 50;
          let y = 200 - (ls.length - 1) * lh / 2 + (ls.length > 3 ? 6 : 0);
          text(lx, '“', 104, 134, { size: 60, a: 0.5 });
          ls.forEach((s) => { text(lx, s, 430, y, { size: 36, align: 'center' }); y += lh; });
        }
        lx.restore();
      }
      function header() {
        if (state === 'play' || state === 'shown') {
          text(ctx, `Card ${idx + 1} / 12`, 74, 44, { font: 'lab', size: 26 });
          text(ctx, `score ${score}`, 430, 44, { font: 'lab', size: 26, align: 'center' });
          if (streak >= 2) Ink.drawBubble(ctx, `streak x${streak}`, 786, 46, 30, R, 1, -0.03, 'right');
          else text(ctx, 'streak ' + streak, 786, 44, { font: 'lab', size: 26, align: 'right', a: 0.6 });
        }
      }
      function render() {
        ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'source-over'; ctx.clearRect(0, 0, cv.width, cv.height);
        const off = slide > 0 ? Math.pow(slide, 2) * 900 : 0;
        ctx.save(); ctx.translate(off * dpr, 0); if (slide > 0) { ctx.translate(cv.width / 2, cv.height / 2); ctx.rotate(slide * 0.12); ctx.translate(-cv.width / 2, -cv.height / 2); }
        ctx.drawImage(L, 0, 0); ctx.restore();
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.globalCompositeOperation = 'multiply'; ctx.lineCap = ctx.lineJoin = 'round';
        header();
        if (state === 'play' && slide <= 0) {
          // timer ring, top-right corner of the card
          const cx = 748, cy = 110, r = 24, f = clamp(left / TIME, 0, 1), col = left <= 4 ? R : B;
          Ink.stroke(ctx, geo.ellipse(cx, cy, r, r, 0, Math.PI * 2), { w: 1.2, seed: 3, retrace: false, color: col });
          ctx.strokeStyle = rgba(col, 0.85); ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(cx, cy, r - 6, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * f); ctx.stroke();
          text(ctx, String(Math.ceil(left)), cx, cy + 46, { font: 'lab', size: 22, align: 'center', color: col });
        }
        if (stamp) {
          const p = clamp(stamp.t / 0.14, 0, 1), sc = 2.4 - 1.4 * p * p, col = stamp.fact ? G : R, s = stamp.fact ? 'FACT!' : 'MYTH!';
          ctx.save(); ctx.globalAlpha = 0.35 + 0.65 * p; ctx.translate(610, 292); ctx.rotate(-0.2); ctx.scale(sc, sc);
          const bx = geo.rect(-128, -50, 256, 96, 12);
          Ink.stroke(ctx, bx, { w: 5, color: col, seed: 51 }); Ink.stroke(ctx, geo.rect(-118, -41, 236, 78, 8), { w: 2, color: col, seed: 52, retrace: false });
          Ink.drawBubble(ctx, s, 0, 24, 68, col, 1, 0, 'center');
          ctx.restore();
        }
        if (mark && mark.t > 0.1) {
          if (mark.ok) { Ink.tick(ctx, 130, 310, 2); text(ctx, '+1', 196, 326, { font: 'lab', size: 34, color: G, weight: 700 }); }
          else if (mark.timeout) text(ctx, 'time’s up!', 110, 326, { size: 28, color: R });
          else { Ink.cross(ctx, 140, 306, 1.8); text(ctx, 'you said ' + mark.said, 174, 318, { size: 24, color: R }); }
        }
        pops.forEach((w) => { const p = clamp(w.t / 0.15, 0, 1); ctx.save(); ctx.globalAlpha = clamp(1.8 - w.t, 0, 1); ctx.translate(430, 110 - w.t * 14); ctx.scale(1 + 0.4 * (1 - p), 1 + 0.4 * (1 - p)); Ink.drawBubble(ctx, w.s, 0, 0, 34, R, 1, -0.03, 'center'); ctx.restore(); });
      }

      function saveScore(final) {
        const fs = firstScore(), fd = firstDone(); topStreak = Math.max(topStreak, bestStreak);
        if (final) { plays++; best = Math.max(best, score); }
        scoreRec.set({ answer: fd < 12 ? `in progress: ${fs}/${fd} right so far` : `first go ${fs}/12` + (plays > 1 ? `; ${plays} goes, best ${best}/12` : '') + `; best streak ${topStreak}`, correct: null, score: fs, max: 12, plays, best, topStreak });
      }
      function showCard() {
        state = 'play'; left = TIME; lastTick = 99; stamp = null; mark = null; slide = 1; paintCard();
        why.className = 'p07-why'; why.innerHTML = '';
        bM.hidden = bF.hidden = false; bM.disabled = bF.disabled = false; bGo.hidden = true;
        Book.sfx('paper', { dur: 0.3, gain: 0.6 }); dirty = true;
      }
      function start() {
        order = plays === 0 && firstDone() === 0 ? CARDS.slice() : Book.shuffle(CARDS, 11 + plays * 7 + (Date.now() % 97));
        idx = 0; score = 0; streak = 0; bestStreak = 0; missed = []; pops = []; missBox.innerHTML = '';
        showCard();
      }
      function answer(said) { // said: true = FACT, false = MYTH, null = ran out of time
        if (state !== 'play') return;
        const c = order[idx], ok = said === c.fact;
        state = 'shown'; stamp = { fact: c.fact, t: 0 }; mark = { ok, timeout: said == null, said: said ? 'FACT' : 'MYTH', t: 0 };
        Book.sfx('stamp', { gain: 0.9 });
        setTimeout(() => Book.sfx(ok ? 'success' : 'error', { gain: ok ? 0.3 : 0.22 }), 160);
        if (ok) { score++; streak++; bestStreak = Math.max(bestStreak, streak); if (streak === 3) pops.push({ s: 'On a roll!', t: 0 }); else if (streak === 5) pops.push({ s: 'Unstoppable!', t: 0 }); else if (streak === 8) pops.push({ s: 'Myth-busting machine!', t: 0 }); else if (streak === 12) pops.push({ s: 'PERFECT!', t: 0 }); }
        else { streak = 0; missed.push(c); }
        if (!recs[c.id].get()) recs[c.id].set({ answer: said == null ? 'no answer (ran out of time)' : said ? 'FACT' : 'MYTH', correct: ok, score: ok ? 1 : 0, mis: ok ? '' : said == null ? '' : c.mis });
        saveScore(false);
        why.className = 'p07-why ' + (ok ? 'good' : 'bad');
        why.innerHTML = `<b class="v">${ok ? '✓ Correct' : said == null ? '✗ Out of time' : '✗ Not quite'}: it’s a ${c.fact ? 'FACT' : 'MYTH'}.</b> ${c.why}`;
        bM.hidden = bF.hidden = true; bGo.hidden = false; bGo.textContent = idx === 11 ? 'See my score ▸' : 'Next card ▸';
        dirty = true;
      }
      function next() {
        if (state === 'ready' || state === 'end') return start();
        if (state !== 'shown') return;
        if (idx < 11) { idx++; showCard(); return; }
        state = 'end'; stamp = null; mark = null; pops = []; saveScore(true); paintCard(); slide = 1;
        Book.sfx(score >= 10 ? 'powerup' : 'success', { gain: 0.4 });
        why.className = 'p07-why'; why.innerHTML = score === 12 ? 'Every single one right. Nothing gets past you!' : 'Your first-go answers are saved for your teacher. Replaying is great practice.';
        bGo.textContent = '↻ Play again';
        missBox.innerHTML = missed.length ? '<p style="margin:0 0 6px"><b style="font-family:Fredoka">The ones that caught you out:</b></p><ul class="p07-miss">' + missed.map((c) => `<li>“${Book.esc(c.s)}” <b class="${c.fact ? 'green' : 'red'}">${c.fact ? 'FACT' : 'MYTH'}</b>. ${c.why}</li>`).join('') + '</ul>' : '';
        dirty = true;
      }
      bM.onclick = () => answer(false); bF.onclick = () => answer(true); bGo.onclick = next;
      bM.hidden = bF.hidden = true;
      if (firstDone() >= 12) bGo.textContent = '↻ Play again';

      paintCard();
      if (document.fonts) document.fonts.ready.then(() => { paintCard(); dirty = true; });
      let last = performance.now();
      const loop = (now) => {
        const dt = Math.min(0.05, (now - last) / 1000); last = now;
        const pg = root.closest('.page');
        if (!(pg && pg.classList.contains('hidden'))) { // the timer pauses while the page is turned away
          let anim = false;
          if (slide > 0) { slide = Math.max(0, slide - dt / 0.3); anim = true; }
          if (state === 'play' && slide <= 0) {
            left -= dt; anim = true;
            const sec = Math.ceil(left); if (sec !== lastTick && sec <= 3 && sec > 0) Book.sfx('tick', { gain: 0.3 }); lastTick = sec;
            if (left <= 0) answer(null);
          }
          if (stamp && stamp.t < 0.3) { stamp.t += dt; anim = true; }
          if (mark && mark.t < 0.3) { mark.t += dt; anim = true; }
          if (pops.length) { pops.forEach((w) => (w.t += dt)); pops = pops.filter((w) => w.t < 1.8); anim = true; }
          if ((anim || dirty) && visible) { dirty = false; render(); }
        }
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    },
  });
})();
