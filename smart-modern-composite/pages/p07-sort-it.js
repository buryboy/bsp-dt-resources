// Page 7 — Which group? A fast sorting game: 16 pen-drawn material cards fly in one at a time and the student flicks
// (or taps) each into modern / smart / composite / technical textile. First answer per card counts (max 16).
// Then a definitions match for the four groups.
(function () {
  'use strict';
  const B = Ink.BLUE, RD = Ink.RED, rgba = Ink.rgba, geo = Ink.geo;
  const TAU = Math.PI * 2;
  const st = (x, pts, o) => Ink.stroke(x, pts, Object.assign({ amp: 0.5 }, o));
  const box = (x0, y0, w, h) => [[x0, y0], [x0 + w, y0], [x0 + w, y0 + h], [x0, y0 + h]];
  const closeP = (P) => P.concat([P[0]]);
  const tint = (x, P, style) => { x.save(); x.fillStyle = style; x.beginPath(); P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.closePath(); x.fill(); x.restore(); };
  const flame = (x, cx, by, s, seed) => { const F = [...geo.curve([cx, by], [cx - 14 * s, by - 8 * s], [cx - 6 * s, by - 22 * s], [cx + 1 * s, by - 32 * s], 8), ...geo.curve([cx + 1 * s, by - 32 * s], [cx + 6 * s, by - 20 * s], [cx + 14 * s, by - 8 * s], [cx, by], 8)]; tint(x, F, 'rgba(255,170,40,.4)'); st(x, F, { w: 2, seed, color: RD }); };

  const GROUPS = ['Modern material', 'Smart material', 'Composite', 'Technical textile'];
  // icons are drawn in a 150 × 100 box
  const CARDS = [
    { t: 'Graphene', g: 0, why: 'a newly developed material: a single layer of carbon atoms.', draw(x) {
      [[52, 38], [78, 53], [52, 68], [104, 38], [104, 68]].forEach(([cx, cy], k) => { const P = []; for (let i = 0; i <= 6; i++) { const a = i * TAU / 6; P.push([cx + Math.cos(a) * 17, cy + Math.sin(a) * 17]); } st(x, P, { w: 2, seed: 3 + k, amp: 0.3 }); P.slice(0, 6).forEach(([px, py]) => { x.fillStyle = rgba(B, 0.9); x.beginPath(); x.arc(px, py, 3, 0, 7); x.fill(); }); });
    } },
    { t: 'Nitinol wire', g: 1, why: 'a shape memory alloy: heat makes it go back to its remembered shape.', draw(x) {
      st(x, [[20, 70], ...geo.curve([20, 70], [40, 10], [60, 100], [78, 46], 14), ...geo.curve([78, 46], [90, 10], [112, 20], [104, 52], 12), ...geo.curve([104, 52], [98, 80], [122, 84], [134, 62], 10)], { w: 3, seed: 5 });
    } },
    { t: 'CFRP (carbon fibre reinforced plastic)', g: 2, why: 'carbon fibres (reinforcement) held in epoxy resin (matrix).', draw(x) {
      const P = geo.rect(28, 20, 94, 60, 6); st(x, P, { w: 2.4, seed: 7 }); x.save(); x.beginPath(); P.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b))); x.clip();
      for (let i = -4; i < 8; i++) { st(x, [[28 + i * 16, 20], [88 + i * 16, 80]], { w: 3.2, seed: 9 + i, retrace: false, amp: 0.2 }); st(x, [[28 + i * 16 + 60, 20], [28 + i * 16, 80]], { w: 1.4, seed: 29 + i, retrace: false, amp: 0.2 }); } x.restore();
    } },
    { t: 'Kevlar', g: 3, why: 'an aramid fibre engineered for strength, not for looks.', draw(x) {
      const V = [[52, 14], [62, 14], [68, 28], [82, 28], [88, 14], [98, 14], [102, 40], [114, 46], [110, 88], [40, 88], [36, 46], [48, 40], [52, 14]]; tint(x, V, 'rgba(240,200,60,.4)'); Ink.hatchFill(x, V, 1, B, 0.9); st(x, V, { w: 2.4, seed: 11 });
      st(x, [[42, 62], [108, 62]], { w: 1.6, seed: 13, retrace: false });
    } },
    { t: 'Thermochromic pigment', g: 1, why: 'its colour changes with temperature, and changes back when it cools.', draw(x) {
      const M = [[44, 34], [48, 84], [96, 84], [100, 34]]; st(x, closeP(M), { w: 2.4, seed: 15 }); tint(x, box(46, 46, 52, 22), 'rgba(235,70,70,.45)'); Ink.hatchFill(x, box(46, 46, 52, 22), 1, RD, 1.6);
      st(x, geo.curve([100, 44], [124, 42], [124, 74], [98, 72], 10), { w: 2.2, seed: 17 }); [60, 76, 90].forEach((px, i) => st(x, geo.curve([px, 28], [px - 7, 22], [px + 7, 14], [px, 8], 8), { w: 1.6, seed: 19 + i, retrace: false }));
    } },
    { t: 'Metal foam', g: 0, why: 'a metal full of gas bubbles, made by a new process.', draw(x) {
      const P = geo.rect(30, 24, 90, 56, 5); st(x, P, { w: 2.6, seed: 21 }); [[46, 40, 8], [66, 36, 6], [86, 44, 9], [106, 36, 6], [52, 62, 9], [74, 58, 7], [94, 66, 7], [110, 58, 5], [38, 52, 4], [70, 72, 4]].forEach(([cx, cy, r], i) => st(x, geo.ellipse(cx, cy, r, r), { w: 1.6, seed: 23 + i, retrace: false, amp: 0.3 }));
    } },
    { t: 'Concrete', g: 2, why: 'cement (the matrix) binding aggregate: sand and stones.', draw(x) {
      const P = box(30, 26, 90, 54); Ink.hatchFill(x, P, 1, B, 0.5); st(x, closeP(P), { w: 2.6, seed: 25 });
      [[46, 42, 9, 6], [70, 38, 7, 5], [96, 46, 10, 7], [54, 64, 8, 6], [82, 66, 9, 5], [108, 68, 6, 5]].forEach(([cx, cy, a, b], i) => { const E = geo.ellipse(cx, cy, a, b, 0, TAU); tint(x, E, 'rgba(251,250,245,1)'); st(x, closeP(E), { w: 1.6, seed: 27 + i, retrace: false }); });
    } },
    { t: 'Conductive thread', g: 3, why: 'a textile engineered so that electricity can flow through it.', draw(x) {
      st(x, closeP(box(40, 22, 44, 8)), { w: 2.2, seed: 31 }); st(x, closeP(box(40, 72, 44, 8)), { w: 2.2, seed: 33 }); const sp = box(46, 30, 32, 42); Ink.hatchFill(x, sp, 1, B, 2); st(x, closeP(sp), { w: 2, seed: 35 });
      st(x, geo.curve([78, 60], [100, 84], [112, 60], [126, 30], 14), { w: 1.6, seed: 37, retrace: false }); st(x, [[126, 30], [132, 16]], { w: 2.4, seed: 39 });
      st(x, [[104, 30], [96, 46], [106, 46], [98, 62]], { w: 2.2, seed: 41, color: RD });
    } },
    { t: 'Titanium', g: 0, why: 'a modern metal: strong, light and it does not corrode.', draw(x) {
      st(x, geo.ellipse(52, 34, 17, 17), { w: 2.6, seed: 43 }); const S = [[64, 46], [78, 52], [120, 84], [112, 90], [66, 62], [58, 50]]; Ink.hatchFill(x, S, 1, B, 1.4); st(x, closeP(S), { w: 2.4, seed: 45 });
      st(x, [[42, 28], [50, 22]], { w: 1.4, seed: 47, retrace: false });
    } },
    { t: 'Photochromic lens', g: 1, why: 'it darkens in bright light and clears again when the light goes.', draw(x) {
      const L = geo.ellipse(48, 58, 22, 18), R = geo.ellipse(102, 58, 22, 18); st(x, L, { w: 2.4, seed: 49 }); st(x, R, { w: 2.4, seed: 51 }); Ink.hatchFill(x, R, 1, B, 2.4);
      st(x, geo.curve([70, 54], [74, 46], [78, 46], [80, 54], 6), { w: 2.2, seed: 53 }); st(x, [[26, 54], [14, 46]], { w: 2, seed: 55 }); st(x, [[124, 54], [138, 46]], { w: 2, seed: 57 });
      st(x, geo.ellipse(118, 18, 8, 8), { w: 1.8, seed: 59, color: RD }); for (let i = 0; i < 6; i++) { const a = i * TAU / 6; st(x, [[118 + Math.cos(a) * 12, 18 + Math.sin(a) * 12], [118 + Math.cos(a) * 17, 18 + Math.sin(a) * 17]], { w: 1.4, seed: 61 + i, color: RD, retrace: false }); }
    } },
    { t: 'GRP (glass reinforced plastic)', g: 2, why: 'glass fibres (reinforcement) held in polyester resin (matrix).', draw(x) {
      const Hh = [[14, 40], ...geo.curve([14, 40], [40, 78], [110, 78], [136, 40], 16), [14, 40]]; Ink.hatchFill(x, Hh, 1, B, 0.8); st(x, Hh, { w: 2.6, seed: 63 });
      st(x, geo.ellipse(75, 44, 22, 5), { w: 1.6, seed: 65, retrace: false }); [[8, 86], [56, 90], [100, 86]].forEach(([px, py], i) => st(x, geo.curve([px, py], [px + 10, py - 6], [px + 22, py + 6], [px + 36, py], 8), { w: 1.4, seed: 67 + i, retrace: false }));
    } },
    { t: 'Micro-encapsulated sock', g: 3, why: 'a textile engineered to release a substance as it is worn.', draw(x) {
      const S = [[48, 10], [82, 10], [82, 50], ...geo.curve([82, 50], [92, 62], [116, 60], [124, 72], 8), ...geo.curve([124, 72], [130, 86], [116, 92], [104, 92], 8), [58, 92], ...geo.curve([58, 92], [44, 88], [46, 70], [48, 60], 8), [48, 10]]; st(x, S, { w: 2.4, seed: 69 }); st(x, [[48, 22], [82, 22]], { w: 1.6, seed: 71, retrace: false });
      [[60, 40], [72, 56], [62, 74], [84, 76], [102, 78], [70, 34]].forEach(([cx, cy], i) => { x.fillStyle = 'rgba(235,110,160,.5)'; x.beginPath(); x.arc(cx, cy, 4, 0, 7); x.fill(); st(x, geo.ellipse(cx, cy, 4, 4), { w: 1.2, seed: 73 + i, color: RD, retrace: false, amp: 0.2 }); });
    } },
    { t: 'Fire resistant suit', g: 3, why: 'a textile engineered to resist flame, not chosen for its looks.', draw(x) {
      const J = [[52, 14], [88, 14], [98, 22], [116, 52], [104, 60], [94, 44], [94, 90], [46, 90], [46, 44], [36, 60], [24, 52], [42, 22], [52, 14]]; st(x, J, { w: 2.4, seed: 79 }); st(x, [[70, 16], [70, 90]], { w: 1.6, seed: 81, retrace: false });
      [58, 74].forEach((y, i) => { const P = box(46, y, 48, 6); Ink.hatchFill(x, P, 1, B, 2.4); st(x, closeP(P), { w: 1.2, seed: 83 + i, retrace: false }); }); flame(x, 126, 92, 0.9, 85);
    } },
    { t: 'Reinforced concrete', g: 2, why: 'concrete with steel bars cast inside: two materials combined.', draw(x) {
      const P = box(18, 34, 114, 34); Ink.hatchFill(x, P, 1, B, 0.5); st(x, closeP(P), { w: 2.6, seed: 87 });
      st(x, [[10, 58], [140, 58]], { w: 3, seed: 89, color: RD }); st(x, [[10, 46], [140, 46]], { w: 3, seed: 91, color: RD });
      [[34, 76], [116, 76]].forEach(([px, py], i) => st(x, closeP([[px - 10, py + 14], [px, py - 6], [px + 10, py + 14]]), { w: 2, seed: 93 + i }));
    } },
    { t: 'Plywood', g: 2, why: 'thin layers of wood glued together: different layers combined.', draw(x) {
      for (let i = 0; i < 4; i++) { const y = 28 + i * 12, P = [[22, y + 12], [22, y], [112, y], [112, y + 12]]; if (i % 2) Ink.hatchFill(x, box(22, y, 90, 12), 1, B, 1.8); st(x, closeP(P), { w: 1.8, seed: 95 + i, amp: 0.3 }); }
      st(x, [[22, 28], [44, 14], [134, 14], [112, 28]], { w: 2, seed: 101 }); st(x, [[134, 14], [134, 62], [112, 76]], { w: 2, seed: 103 });
      [1, 2, 3].forEach((i) => st(x, [[112, 28 + i * 12], [134, 14 + i * 12]], { w: 1.2, seed: 105 + i, retrace: false }));
    } },
    { t: 'Nomex', g: 3, why: 'a flame-resistant aramid fibre: a textile engineered for a job.', draw(x) {
      const G = [[44, 88], [44, 40], ...geo.curve([44, 40], [44, 8], [92, 8], [92, 40], 12), [92, 52], ...geo.curve([92, 52], [112, 40], [120, 56], [104, 66], 8), [92, 76], [92, 88], [44, 88]]; Ink.hatchFill(x, G, 1, B, 1); st(x, G, { w: 2.4, seed: 109 });
      st(x, [[44, 76], [92, 76]], { w: 1.6, seed: 111, retrace: false }); flame(x, 126, 40, 0.8, 113);
    } },
  ];
  const ORDER = Book.shuffle(CARDS.map((_, i) => i), 41);
  function iconCanvas(i) {
    const c = document.createElement('canvas'); c.width = 300; c.height = 200; c.className = 'p07-ic';
    const x = c.getContext('2d'); x.scale(2, 2); x.lineCap = x.lineJoin = 'round'; x.globalCompositeOperation = 'multiply'; CARDS[i].draw(x); return c;
  }

  Book.page({ id: 'p07', title: 'Which group?', build(ui, root) {
    const css = document.createElement('style');
    css.textContent = `
      .p07-game{position:relative;margin:0 0 calc(var(--R)*1.4);padding:12px 14px 16px;background:rgba(251,250,245,.9)}
      .p07-game>*{position:relative}
      .p07-top{display:flex;align-items:center;gap:12px;flex-wrap:wrap;font:600 17px Fredoka,system-ui;color:var(--ink);line-height:1.3;margin:0 0 4px}
      .p07-dots{display:flex;gap:4px;flex:1 1 220px;flex-wrap:wrap}
      .p07-dots i{width:15px;height:15px;border-radius:50%;border:2px solid rgba(30,46,150,.45);background:#fff;display:block}
      .p07-dots i.ok{background:var(--green);border-color:var(--green)}.p07-dots i.no{background:var(--red);border-color:var(--red)}.p07-dots i.cur{border-color:var(--ink);box-shadow:0 0 0 3px rgba(30,46,150,.2)}
      .p07-arena{height:206px;display:flex;align-items:center;justify-content:center;overflow:visible;z-index:3}
      .p07-card{width:min(330px,92%);min-height:176px;background:#fffef4;border:2.5px solid var(--ink);border-radius:14px;box-shadow:5px 6px 0 rgba(30,46,150,.22);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:6px 12px 10px;cursor:grab;touch-action:none;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none;will-change:transform}
      .p07-card.in{animation:p07in .45s cubic-bezier(.2,1.2,.4,1)}
      @keyframes p07in{from{transform:translate(-120vw,-40px) rotate(-25deg)}to{transform:none}}
      .p07-card.back{transition:transform .25s}
      .p07-card.away{transition:transform .4s ease-in,opacity .4s ease-in;opacity:0}
      .p07-card.right{border-color:var(--green);background:#e6f6ea}.p07-card.wrong{border-color:var(--red);background:#fdeaea}
      .p07-ic{width:150px;height:100px;display:block;pointer-events:none}
      .p07-name{font:700 22px Fredoka,system-ui;color:var(--ink);text-align:center;line-height:1.2;pointer-events:none}
      .p07-bins{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:6px 0 0}
      .p07-bin{font:700 18px Fredoka,system-ui;color:var(--ink);background:#fff;border:2.5px dashed rgba(30,46,150,.55);border-radius:14px;min-height:88px;padding:8px 6px;cursor:pointer;line-height:1.2;touch-action:manipulation;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px}
      .p07-bin.hot{background:#eef1ff;border-style:solid}
      .p07-bin.good{background:#e6f6ea;border-color:var(--green);border-style:solid}.p07-bin.bad{background:#fdeaea;border-color:var(--red);border-style:solid}
      .p07-game .fb{display:block;min-height:54px;font-size:18px;margin-top:8px}
      .p07-row{display:flex;gap:10px;flex-wrap:wrap;align-items:center;min-height:54px}.p07-row .btn{margin-top:0}
      .p07-end{font-size:18px;line-height:1.5}.p07-end b{font-family:Fredoka,system-ui}.p07-end ul{margin:4px 0 0;padding-left:22px}.p07-end li{margin:0}
      .p07-big{font:700 30px Fredoka,system-ui;color:var(--ink)}
      @media (max-width:760px){.p07-bins{grid-template-columns:repeat(2,1fr)}.p07-bin{min-height:70px}}`;
    root.appendChild(css);

    ui.h('Which group?');
    ui.p('<b>16 cards, four groups.</b> Each card flies in: <b>flick it</b> (or tap a box) to sort it into the right group. Your <span class="key">first answer</span> for each card is the one that counts, so think fast but think!');

    const r = ui.record('p07.sort', { label: 'Sort 16 materials into modern / smart / composite / technical textile', type: 'game', max: 16 });
    const sv = (r.get() || {}).sv || {};
    let ans = (sv.ans || []).slice();              // [card index, bin chosen] in the order played
    let practice = null, prac = sv.prac || null;   // practice = answers of a replay (not marked)
    const game = ui.el('div', 'p07-game'); requestAnimationFrame(() => Ink.frame(game, { w: 2.4 }));
    const top = ui.el('div', 'p07-top', '', game), dots = ui.el('div', 'p07-dots', '', top), score = ui.el('span', '', '', top), streakEl = ui.el('span', '', '', top);
    const arena = ui.el('div', 'p07-arena', '', game);
    const bins = ui.el('div', 'p07-bins', '', game);
    const fb = ui.el('div', 'fb', '', game);
    const row = ui.el('div', 'p07-row', '', game);
    const nextBtn = ui.el('button', 'btn', 'Next card ▸', row); nextBtn.type = 'button'; nextBtn.style.display = 'none';
    const end = ui.el('div', 'p07-end', '', game);
    const binEls = GROUPS.map((g, k) => { const b = ui.el('button', 'p07-bin', g, bins); b.type = 'button'; b.onclick = () => answer(k); return b; });

    const list = () => practice || ans;
    const nRight = (L) => L.filter(([c, b]) => CARDS[c].g === b).length;
    let card = null, locked = false, timer = 0;
    function commit() {
      const done = ans.length === 16, n = nRight(ans);
      r.set({ answer: `${n}/${ans.length}${done ? '' : ' so far'}: ` + ans.map(([c, b]) => `${CARDS[c].t.split(' (')[0]}→${GROUPS[b].split(' ')[0]} ${CARDS[c].g === b ? '✓' : '✗'}`).join('; ') + (prac ? `; practice replay: ${prac}` : ''),
        correct: done ? n === 16 : null, score: n, max: 16, mis: n < ans.length ? 'group-mixup' : '', sv: { ans, prac } });
    }
    function hud() {
      const L = list();
      dots.innerHTML = ORDER.map((_, i) => `<i class="${i < L.length ? (CARDS[L[i][0]].g === L[i][1] ? 'ok' : 'no') : i === L.length ? 'cur' : ''}"></i>`).join('');
      score.textContent = `${practice ? 'Practice: ' : 'Score: '}${nRight(L)} / ${L.length}`;
      let s = 0; for (let i = L.length - 1; i >= 0 && CARDS[L[i][0]].g === L[i][1]; i--) s++;
      streakEl.textContent = s >= 3 ? `🔥 ${s} in a row` : '';
    }
    function deal() {
      clearTimeout(timer); locked = false; nextBtn.style.display = 'none'; fb.className = 'fb'; fb.innerHTML = ''; binEls.forEach((b) => b.classList.remove('good', 'bad', 'hot'));
      arena.innerHTML = ''; card = null; hud();
      const L = list();
      if (L.length >= 16) return finish();
      end.innerHTML = ''; bins.style.display = '';
      const ci = ORDER[L.length];
      card = ui.el('div', 'p07-card in', '', arena); card.appendChild(iconCanvas(ci)); ui.el('div', 'p07-name', Book.esc(CARDS[ci].t), card); card._ci = ci;
      Book.sfx('paper', { gain: 0.3, dur: 0.2 });
      drag(card);
    }
    function answer(k, flyTo) {
      if (locked || !card) return; locked = true;
      const ci = card._ci, C = CARDS[ci], ok = C.g === k;
      list().push([ci, k]); if (!practice) commit(); hud();
      card.classList.remove('in', 'back'); card.classList.add(ok ? 'right' : 'wrong');
      binEls[C.g].classList.add('good'); if (!ok) binEls[k].classList.add('bad');
      Book.sfx(ok ? 'success' : 'error', { gain: 0.3 });
      const name = Book.esc(C.t.split(' (')[0]);
      fb.className = 'fb on ' + (ok ? 'good' : 'bad');
      fb.innerHTML = ok ? `✓ <b>${GROUPS[C.g]}</b>: ${C.why}` : `✗ ${name} is a <b>${GROUPS[C.g].toLowerCase()}</b>, not a ${GROUPS[k].toLowerCase()}: ${C.why}`;
      if (ok) {                                    // fly into the box, then the next card
        const cr = card.getBoundingClientRect(), br = binEls[k].getBoundingClientRect(), m = new DOMMatrix(getComputedStyle(card).transform);
        card.classList.add('away'); card.style.transform = `translate(${m.e + br.left + br.width / 2 - cr.left - cr.width / 2}px, ${m.f + br.top + br.height / 2 - cr.top - cr.height / 2}px) scale(.25)`;
        timer = setTimeout(deal, 950);
      } else { card.classList.add('back'); card.style.transform = 'rotate(-3deg)'; nextBtn.style.display = ''; nextBtn.textContent = list().length >= 16 ? 'See my score ▸' : 'Next card ▸'; }
    }
    nextBtn.onclick = deal;
    // flick / drag the card onto a box
    function drag(c) {
      let on = false, sx = 0, sy = 0, dx = 0, dy = 0;
      const over = (e) => binEls.findIndex((b) => { const q = b.getBoundingClientRect(); return e.clientX > q.left - 8 && e.clientX < q.right + 8 && e.clientY > q.top - 30 && e.clientY < q.bottom + 30; });
      c.addEventListener('pointerdown', (e) => { if (locked) return; on = true; sx = e.clientX; sy = e.clientY; dx = dy = 0; c.classList.remove('in', 'back'); try { c.setPointerCapture(e.pointerId); } catch (er) {} e.preventDefault(); });
      c.addEventListener('pointermove', (e) => { if (!on) return; dx = e.clientX - sx; dy = e.clientY - sy; c.style.transform = `translate(${dx}px, ${dy}px) rotate(${dx * 0.04}deg)`; const k = over(e); binEls.forEach((b, i) => b.classList.toggle('hot', i === k)); });
      const up = (e) => {
        if (!on) return; on = false; binEls.forEach((b) => b.classList.remove('hot'));
        let k = e.type === 'pointerup' ? over(e) : -1;
        if (k < 0 && e.type === 'pointerup' && dy > 70) {      // a flick downwards: the box it is heading for
          const tx = e.clientX + dx * 0.25; let best = 1e9; binEls.forEach((b, i) => { const q = b.getBoundingClientRect(), d = Math.abs(tx - (q.left + q.width / 2)) + (innerWidth <= 760 ? Math.abs(e.clientY - q.top) : 0); if (d < best) { best = d; k = i; } });
        }
        if (k >= 0) answer(k); else { c.classList.add('back'); c.style.transform = ''; }
      };
      c.addEventListener('pointerup', up); c.addEventListener('pointercancel', up);
    }
    function finish() {
      const L = list(), n = nRight(L), wrong = L.filter(([c, b]) => CARDS[c].g !== b);
      if (practice) { prac = n + '/16'; commit(); }
      bins.style.display = 'none';
      arena.innerHTML = `<div class="p07-big">${practice ? 'Practice: ' : ''}${n} / 16 ${n === 16 ? '★' : ''}</div>`;
      end.innerHTML = (wrong.length ? `<b>Check these:</b><ul>${wrong.map(([c]) => `<li><b>${Book.esc(CARDS[c].t)}</b> → ${GROUPS[CARDS[c].g]}: ${CARDS[c].why}</li>`).join('')}</ul>` : '<b>Every card in the right group.</b> ') + (practice ? '' : '<span class="small">Your score is saved. You can play again for practice.</span>');
      const again = ui.el('button', 'btn ghost', '↻ Play again (practice)', end); again.type = 'button'; again.style.display = 'block';
      again.onclick = () => { practice = []; deal(); };
      if (n === 16) Book.sfx('success', { gain: 0.4 });
    }
    deal();

    ui.h('What makes a group?', { size: 40 });
    ui.p('Now match each group to its definition. <span class="small">The game blurs while you match.</span>');
    const m = ui.match({ id: 'p07.define', label: 'Match the 4 material groups to their definitions', q: 'Tap a group, then tap its definition.',
      pairs: [
        ['Modern material', 'developed through a new or improved process', 'group-mixup'],
        ['Smart material', 'a property changes when its surroundings change, then changes back', 'smart-meaning'],
        ['Composite material', 'two or more different materials combined to improve the properties', 'composite-meaning'],
        ['Technical textile', 'a fabric engineered for what it does, not for how it looks', 'group-mixup'],
      ] });
    ui.hideWhile(m, 'p07.define', [game]);
  } });
})();
