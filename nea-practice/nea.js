// NEA practice book: sketchbook ink + fonts, the fill-in box used on every section page, and the light password lock.
(function () {
  'use strict';
  // graphite instead of blue biro (the arrays are shared with ink.js, so change them in place)
  const set = (a, v) => v.forEach((x, i) => (a[i] = x));
  set(Ink.BLUE, [44, 44, 48]); set(Ink.RED, [154, 74, 44]); set(Ink.GREEN, [47, 90, 60]);
  Ink.FONTS = { bubble: '"Caveat", "Segoe Print", cursive', hand: '"Caveat", "Segoe Print", cursive', bubbleWeight: 700 };

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  let lastPush = 0, pushT = null;
  const pushSoon = () => { // send to the teacher at most once a minute while someone is writing
    clearTimeout(pushT); const wait = Math.max(4000, 60000 - (Date.now() - lastPush));
    pushT = setTimeout(() => { lastPush = Date.now(); Book.saveNow && Book.saveNow(); }, wait);
  };

  // one practice box: prompt, hint, free writing, live word count. Score is worked out silently for the teacher.
  window.neaField = (ui, f) => {
    const r = ui.record('nea.' + f.id, { label: f.label, type: 'nea', max: f.max });
    const d = ui.el('div', 'act nea-field');
    d.innerHTML = `<p class="q"><b>${esc(f.label.split(' ')[0])}</b>${esc(f.label.split(' ').slice(1).join(' '))}</p><p>${esc(f.q)}</p><p class="hint">${esc(f.hint || '')}</p>`;
    const ta = document.createElement('textarea'); ta.className = 'sk'; ta.rows = Math.max(4, Math.min(12, Math.round(f.words / 22))); ta.placeholder = 'Write here…'; d.appendChild(ta);
    const wc = document.createElement('div'); wc.className = 'wc'; d.appendChild(wc);
    requestAnimationFrame(() => Ink.frame(d, { shadow: false }));
    const prev = r.get(); if (prev && prev.answer) ta.value = prev.answer;
    const paint = (saved) => {
      const w = NEA.words(ta.value), n = NEA.lines(ta.value), it = r.get();
      wc.innerHTML = `<span class="${w >= f.words ? 'ok' : ''}">${w} words · aim for about ${f.words}</span>` +
        (f.list ? `<span class="${n >= f.list ? 'ok' : ''}">${n} of ${f.list}+ lines</span>` : '') +
        (it && it.ts ? `<span class="save">${saved ? 'saved ✓' : 'last saved ' + new Date(it.ts).toLocaleString([], { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>` : '');
    };
    let t = null;
    const commit = () => {
      clearTimeout(t); const v = ta.value.trim(), it = r.get();
      if ((it ? it.answer || '' : '') === v) return;
      const s = NEA.score(f, v);
      r.set({ answer: v, correct: null, score: s.score, max: s.max, mis: s.flags.join(',') });
      paint(true); pushSoon();
    };
    ta.addEventListener('input', () => { paint(); clearTimeout(t); t = setTimeout(commit, 2500); });
    ta.addEventListener('blur', commit);
    paint();
    return d;
  };

  // section page: what / why / what the moderator looks for / tips, then the boxes
  window.neaSection = (sec, n) => Book.page({
    id: 'p' + String(n).padStart(2, '0'), title: `Section ${sec.key}: ${sec.title}`,
    build(ui) {
      ui.el('span', 'secmark', `SECTION ${sec.key}`); ui.el('span', 'secmark soft', `${sec.marks} OF 100 MARKS`); ui.el('span', 'secmark soft', `ABOUT ${sec.hours} H IN THE REAL NEA`);
      ui.h(sec.title, { size: 46 });
      ui.box(`<span class="tag">What is it?</span>${esc(sec.what)}`);
      ui.box(`<span class="tag">Why do it?</span>${esc(sec.why)}`);
      ui.box(`<span class="tag">What the moderator looks for</span><ul class="look">${sec.look.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`);
      sec.tips.forEach((x) => ui.el('span', 'note', esc(x)));
      ui.el('h2', '', 'Your practice entries');
      ui.p('<span class="small">Write in full sentences, as you would in your folder. Your work saves as you go, and you can come back and improve it any time.</span>');
      sec.fields.forEach((f) => neaField(ui, f));
    },
  });

  // light password lock: keeps casual visitors out. It is not real security (the page source is public).
  window.neaStart = async () => {
    const H = (window.BOOK_CONFIG || {}).gateHash, K = 'gate.' + BOOK_CONFIG.lesson;
    if (!H || localStorage.getItem(K) === H || window.__NOGATE) return Book.start();
    const g = document.createElement('div'); g.id = 'gate';
    g.innerHTML = `<form><h1>${esc(BOOK_CONFIG.title)}</h1><p>This workbook is locked for now. Enter the password from your teacher.</p><input type="password" autocomplete="off" autofocus placeholder="password"><div class="err"></div><button class="btn">Open</button></form>`;
    document.body.appendChild(g);
    const sha = async (s) => [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)))].map((b) => b.toString(16).padStart(2, '0')).join('');
    g.querySelector('form').onsubmit = async (e) => {
      e.preventDefault(); const v = g.querySelector('input').value;
      if ((await sha(v)) === H) { localStorage.setItem(K, H); g.remove(); Book.start(); }
      else { g.querySelector('.err').textContent = 'Not quite. Try again.'; g.querySelector('input').select(); }
    };
  };
})();
