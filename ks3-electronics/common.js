/* Shared helpers for the KS3 Electronics workbook */
const STORE = 'bsp-ks3-electronics-v1';
const Stars = {
  all() { try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch (e) { return {}; } },
  set(lv, n) { try { const s = Stars.all(); s[lv] = Math.max(s[lv] || 0, n); localStorage.setItem(STORE, JSON.stringify(s)); } catch (e) {} },
  reset() { try { localStorage.removeItem(STORE); } catch (e) {} }
};

function h(tag, props, ...kids) {
  const e = document.createElement(tag);
  props = props || {};
  for (const k in props) {
    const v = props[k];
    if (v == null || v === false) continue;
    if (k === 'class') e.className = v;
    else if (k === 'html') e.innerHTML = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else if (k === 'style') e.style.cssText = v;
    else e.setAttribute(k, v);
  }
  for (const c of kids.flat()) { if (c == null || c === false) continue; e.append(c.nodeType ? c : document.createTextNode(c)); }
  return e;
}
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };

/* ---------- sound ---------- */
const Sfx = {
  ctx: null, buzzSet: new Set(), osc: null,
  ac() {
    if (!this.ctx) { try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; } }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  },
  tone(f, d, type = 'sine', v = .14, when = 0) {
    const c = this.ac(); if (!c) return;
    const t = c.currentTime + when, o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.value = f; g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.0001, t + d);
    o.connect(g).connect(c.destination); o.start(t); o.stop(t + d + .02);
  },
  good() { this.tone(660, .12, 'triangle'); this.tone(990, .2, 'triangle', .14, .1); },
  bad() { this.tone(190, .28, 'sawtooth', .06); },
  click() { this.tone(1400, .03, 'square', .035); },
  win() { [523, 659, 784, 1046].forEach((f, i) => this.tone(f, .22, 'triangle', .14, i * .12)); },
  pop() {
    const c = this.ac(); if (!c) return;
    const b = c.createBuffer(1, c.sampleRate * .25, c.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 3);
    const s = c.createBufferSource(), g = c.createGain(); g.gain.value = .35; s.buffer = b; s.connect(g).connect(c.destination); s.start();
  },
  buzz(id, on) {
    on ? this.buzzSet.add(id) : this.buzzSet.delete(id);
    const want = this.buzzSet.size > 0;
    if (want && !this.osc) {
      const c = this.ac(); if (!c) return;
      const o = c.createOscillator(), g = c.createGain(), lfo = c.createOscillator(), lg = c.createGain();
      o.type = 'square'; o.frequency.value = 420; g.gain.value = .045;
      lfo.frequency.value = 28; lg.gain.value = 60; lfo.connect(lg).connect(o.frequency);
      o.connect(g).connect(c.destination); o.start(); lfo.start(); this.osc = [o, lfo];
    } else if (!want && this.osc) { this.osc.forEach(o => { try { o.stop(); } catch (e) {} }); this.osc = null; }
  }
};

/* ---------- confetti ---------- */
function confetti(n = 110) {
  const cv = h('canvas', { style: 'position:fixed;inset:0;pointer-events:none;z-index:99' });
  document.body.append(cv); const W = cv.width = innerWidth, H = cv.height = innerHeight, x = cv.getContext('2d');
  const cols = ['#ffd23f', '#06d6a0', '#118ab2', '#ef476f', '#ff9f1c', '#7b5cff'];
  const P = Array.from({ length: n }, () => ({ x: W / 2, y: H * .45, vx: (Math.random() - .5) * 15, vy: -Math.random() * 15 - 4, r: Math.random() * 6.28, c: cols[Math.random() * 6 | 0], s: 6 + Math.random() * 7 }));
  let t = 0; (function f() {
    x.clearRect(0, 0, W, H); t++;
    P.forEach(p => { p.vy += .45; p.x += p.vx; p.y += p.vy; p.r += .2; x.save(); x.translate(p.x, p.y); x.rotate(p.r); x.fillStyle = p.c; x.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); x.restore(); });
    t < 110 ? requestAnimationFrame(f) : cv.remove();
  })();
}

/* ---------- level runner ---------- */
function Level(cfg) {
  const top = h('div', { class: 'top' },
    h('a', { class: 'back', href: 'index.html' }, '← Levels'),
    h('h1', {}, `Level ${cfg.n}: ${cfg.title}`),
    h('div', { class: 'dots' }, cfg.steps.map(() => h('span'))),
    h('div', { class: 'pill' }, '⚡ ', h('span', { id: 'sc' }, '0')));
  const stage = h('main', { class: 'stage' });
  document.body.append(top, stage);
  const dots = [...top.querySelectorAll('.dots span')];
  let i = -1;
  const api = {
    score: 0, max: 0, stage,
    add(p, m) { api.score += p; api.max += (m == null ? p : m); document.getElementById('sc').textContent = api.score; },
    next() {
      i++; Sfx.buzzSet.clear(); Sfx.buzz('x', false);
      dots.forEach((d, j) => d.className = j < i ? 'done' : j === i ? 'on' : '');
      stage.innerHTML = ''; scrollTo({ top: 0, behavior: 'smooth' });
      if (i < cfg.steps.length) cfg.steps[i](stage, api); else finish();
    },
    nextBtn(label = 'Next →') { return h('button', { class: 'btn go', onclick: () => api.next() }, label); }
  };
  function finish() {
    const r = api.max ? api.score / api.max : 1;
    const st = r >= .85 ? 3 : r >= .6 ? 2 : 1;
    Stars.set(cfg.n, st); Sfx.win(); confetti(160);
    const nxt = h('a', { class: 'btn go hide', href: `level${cfg.n + 1}.html`, style: 'text-decoration:none' }, `Level ${cfg.n + 1} →`);
    fetch(`level${cfg.n + 1}.html`, { cache: 'no-store' }).then(r => { if (r.ok) nxt.classList.remove('hide'); }).catch(() => {});
    stage.append(h('div', { class: 'card end' },
      h('div', { class: 'kicker' }, `Level ${cfg.n} complete`),
      h('h2', {}, cfg.title),
      h('div', { class: 'big' }, [0, 1, 2].map(k => h('span', { style: `animation-delay:${k * .25}s` }, k < st ? '⭐' : '☆'))),
      h('p', { class: 'lead' }, `You scored ${api.score} out of ${api.max}. ${st === 3 ? 'Brilliant – you really know your stuff!' : st === 2 ? 'Good work! Play again to try for three stars.' : 'Nice try. Have another go to boost your score.'}`),
      cfg.summary ? h('div', { class: 'fact', style: 'text-align:left;max-width:640px;margin:14px auto' }, h('b', {}, 'Remember: '), cfg.summary) : null,
      h('div', { class: 'row', style: 'justify-content:center;margin-top:18px' },
        h('button', { class: 'btn ghost', onclick: () => location.reload() }, '↻ Play again'),
        h('a', { class: 'btn', href: 'index.html', style: 'text-decoration:none' }, 'All levels'), nxt)));
  }
  api.next();
  return api;
}

/* ---------- multiple-choice helper ---------- */
function mcq(host, q, onDone) {
  // q: {q, opts:[...], a: index of correct, why}
  const box = h('div', {});
  box.append(h('p', { class: 'lead', style: 'font-weight:800' }, q.q));
  const order = shuffle(q.opts.map((t, i) => i));
  const grid = h('div', { class: 'opts' + (q.two ? ' two' : '') });
  let answered = false;
  order.forEach(i => {
    const b = h('button', { class: 'opt', onclick: () => {
      if (answered) return; answered = true;
      const ok = i === q.a;
      b.classList.add(ok ? 'right' : 'wrong');
      if (!ok) { grid.children[order.indexOf(q.a)].classList.add('right'); b.classList.add('shake'); Sfx.bad(); } else Sfx.good();
      [...grid.children].forEach(x => x.disabled = true);
      if (q.why) box.append(h('div', { class: 'msg ' + (ok ? 'good' : 'bad') }, (ok ? '✅ ' : '❌ ') + q.why));
      onDone && onDone(ok);
    } }, q.opts[i]);
    grid.append(b);
  });
  box.append(grid); host.append(box);
  return box;
}

/* Run a list of MCQs one after another inside a card */
function quiz(stage, api, cfg) {
  const card = h('div', { class: 'card' }); stage.append(card);
  let k = 0, right = 0;
  function show() {
    card.innerHTML = '';
    card.append(h('div', { class: 'kicker' }, `${cfg.title || 'Quick quiz'} · Question ${k + 1} of ${cfg.qs.length}`));
    const q = cfg.qs[k];
    if (q.pre) q.pre(card);
    mcq(card, q, ok => {
      if (ok) right++;
      api.add(ok ? 1 : 0, 1);
      const last = k === cfg.qs.length - 1;
      card.append(h('div', { class: 'row', style: 'margin-top:14px' }, h('button', { class: 'btn go', onclick: () => { if (last) { cfg.onEnd ? cfg.onEnd(right) : api.next(); } else { k++; show(); } } }, last ? 'Finish →' : 'Next question →')));
    });
  }
  show();
}
