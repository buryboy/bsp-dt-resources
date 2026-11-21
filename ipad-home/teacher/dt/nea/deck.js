// NEA stage introductions: a board slideshow built from window.DECK (made by book-kit/tools/make_nea_decks.py).
// Tap / click the right half or press → / space to go on; left half or ← to go back. Example slides reveal their
// numbered notes one at a time before moving on. Nothing is stored or sent.
(function () {
  'use strict';
  const D = window.DECK, E = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const md = (s) => E(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/_(.+?)_/g, '<i>$1</i>');

  // simple line drawings for the example sheets (pencil style)
  const L = 'fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"';
  const DOODLE = {
    box: `<g ${L}><path d="M40 90 L40 45 L120 45 L120 90 Z"/><path d="M40 45 L70 25 L150 25 L120 45"/><path d="M150 25 L150 70 L120 90"/><path d="M60 45 L60 90 M85 45 L85 90"/><path d="M95 30 L95 18 M105 30 L108 12 M115 30 L120 16"/></g>`,
    mind: `<g ${L}><ellipse cx="100" cy="60" rx="34" ry="16"/><path d="M70 52 L30 25 M70 68 L28 98 M130 52 L172 24 M130 68 L172 98 M100 44 L100 12 M100 76 L100 108"/><circle cx="26" cy="22" r="8"/><circle cx="24" cy="100" r="8"/><circle cx="176" cy="22" r="8"/><circle cx="176" cy="100" r="8"/></g>`,
    chart: `<g ${L}><path d="M25 105 L180 105 M25 105 L25 15"/><rect x="40" y="55" width="22" height="50"/><rect x="75" y="30" width="22" height="75"/><rect x="110" y="70" width="22" height="35"/><rect x="145" y="45" width="22" height="60"/></g>`,
    ideas: `<g ${L}><rect x="8" y="20" width="56" height="70" rx="4"/><path d="M18 75 L54 75 M22 75 L30 40 L48 40 L46 75"/><rect x="72" y="20" width="56" height="70" rx="4"/><circle cx="100" cy="55" r="20"/><path d="M90 55 L110 55"/><rect x="136" y="20" width="56" height="70" rx="4"/><path d="M146 80 L182 80 L182 40 L164 30 L146 40 Z"/></g>`,
    model: `<g ${L}><path d="M30 95 L30 50 L100 30 L170 50 L170 95 L100 110 Z"/><path d="M30 50 L100 70 L170 50 M100 70 L100 110"/><path d="M55 58 L55 98 M140 60 L140 100" stroke-dasharray="4 5"/></g>`,
    lamp: `<g ${L}><path d="M60 105 L140 105 M100 105 L100 60 L130 30"/><path d="M118 18 L150 40 L140 50 L108 28 Z"/><circle cx="100" cy="60" r="4"/></g>`,
    ortho: `<g ${L}><rect x="15" y="25" width="70" height="45"/><rect x="100" y="25" width="40" height="45"/><rect x="15" y="80" width="70" height="30"/><path d="M15 18 L85 18 M15 14 L15 22 M85 14 L85 22" stroke-width="1.4"/><path d="M150 25 L190 25 L190 110 L150 110 Z" stroke-dasharray="3 4"/></g>`,
    gantt: `<g ${L}><path d="M20 15 L20 110 M20 110 L190 110"/><rect x="25" y="20" width="50" height="12"/><rect x="60" y="40" width="60" height="12"/><rect x="100" y="60" width="50" height="12"/><rect x="140" y="80" width="45" height="12"/></g>`,
    test: `<g ${L}><path d="M30 100 L170 100"/><path d="M60 100 L60 60 L140 60 L140 100"/><path d="M100 60 L100 30 M88 30 L112 30"/><path d="M100 22 L100 8 M94 14 L100 8 L106 14"/><path d="M150 40 Q165 25 175 40" /></g>`,
    person: `<g ${L}><circle cx="100" cy="30" r="14"/><path d="M100 44 L100 82 M100 54 L76 70 M100 54 L124 70 M100 82 L84 110 M100 82 L116 110"/><path d="M140 20 L185 20 L185 50 L160 50 L150 60 L152 50 L140 50 Z"/></g>`,
  };
  document.body.className = 'theme-' + D.theme;
  const root = document.getElementById('deck');

  // ---- slide builders: each returns {html, steps}
  const head = (kick, title) => `<div class="kick">${E(D.chip)} · ${E(kick)}</div><h1>${md(title)}</h1>`;
  function sTitle() {
    return { html: `<div class="title-slide"><div class="big-chip">${E(D.chip)}</div><h1 class="t">${E(D.title)}</h1>
      <div class="facts">${D.facts.map(([a, b]) => `<div><b>${E(a)}</b><span>${E(b)}</span></div>`).join('')}</div>
      <p class="lead">${md(D.lead)}</p></div>` };
  }
  function sWhat() {
    return { html: head('the job', 'What you need to do') + `<div class="cols"><div class="card big">${md(D.what)}</div>
      <div class="card why"><div class="lab">Why it matters</div>${md(D.why)}</div></div>`, steps: 1 };
  }
  function sTerms() {
    return { html: head('key terms', 'Words you need to use') + `<div class="terms">${D.terms.map(([t, d], i) => `<div class="term s${i + 1}"><b>${E(t)}</b><span>${md(d)}</span></div>`).join('')}</div>`, steps: D.terms.length };
  }
  function sLook() {
    return { html: head('marks', 'What the moderator is looking for') + `<ul class="look">${D.look.map((l, i) => `<li class="s${i + 1}">${md(l)}</li>`).join('')}</ul>
      <div class="band">${D.bands.map(([b, t]) => `<div><b>${E(b)}</b><span>${md(t)}</span></div>`).join('')}</div>`, steps: D.look.length };
  }
  function sPages() {
    return { html: head('where it goes', D.pagesNote && D.pagesNote.includes('Showbie') ? 'Where it goes: your workbook sheets' : 'Where it goes in your folder') + `<p class="sub">${md(D.pagesNote)}</p><div class="pages">${D.pages.map((p, i) => `<div class="pg s${i + 1}"><div class="thumb"><span>${i + 1}</span></div><b>${E(p[0])}</b><small>${md(p[1])}</small></div>`).join('')}</div>`, steps: D.pages.length };
  }
  function block(b) {
    const st = `left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px`;
    let inner = '';
    if (b.k === 'photo') inner = `<div class="ph"><span>📷 ${E(b.body)}</span></div>`;
    else if (b.k === 'sketch') inner = `<svg viewBox="0 0 200 120" preserveAspectRatio="xMidYMid meet" class="doodle">${DOODLE[b.d || 'box']}</svg>${b.body ? `<div class="ann">${md(b.body)}</div>` : ''}`;
    else if (b.k === 'list') inner = `<ol>${b.body.map((x) => `<li>${md(x)}</li>`).join('')}</ol>`;
    else if (b.k === 'table') inner = `<table>${b.body.map((r, i) => `<tr>${r.map((c) => i ? `<td>${md(c)}</td>` : `<th>${E(c)}</th>`).join('')}</tr>`).join('')}</table>`;
    else inner = `<p>${md(b.body)}</p>`;
    return `<div class="blk${b.k === 'note' ? ' note' : ''}" style="${st}">${b.t ? `<div class="bt">${E(b.t)}</div>` : ''}${inner}${b.n ? `<i class="pin" data-n="${b.n}">${b.n}</i>` : ''}</div>`;
  }
  function sExample(ex) {
    const html = head('example', ex.title) + `<div class="ex"><div class="a3-wrap"><div class="a3">
        <div class="a3-title"><span class="b-chip">${E(ex.chip)}</span>${E(ex.page)}</div>${ex.blocks.map(block).join('')}</div></div>
      <div class="notes"><div class="nlab">${E(ex.client)}</div><div class="zoom"></div>${ex.notes.map((n, i) => `<div class="nt s${i + 1}" data-n="${i + 1}"><i>${i + 1}</i><div><b>${md(n[0])}</b><span>${md(n[1])}</span></div></div>`).join('')}</div></div>`;
    return { html, steps: ex.notes.length, ex: true };
  }
  function sCompare() {
    const c = D.compare;
    return { html: head('weak vs strong', c.title) + `<div class="cmp"><div class="card weak s1"><div class="lab">Weak</div>${md(c.weak)}<p class="why-w">${md(c.weakWhy)}</p></div>
      <div class="card strong s2"><div class="lab">Strong</div>${md(c.strong)}<p class="why-w">${md(c.strongWhy)}</p></div></div>`, steps: 2 };
  }
  function sCheck() {
    return { html: head('before you move on', 'Checklist') + `<ul class="check">${D.check.map((c, i) => `<li class="s${i + 1}">${md(c)}</li>`).join('')}</ul>
      ${D.tips ? `<div class="tips">${D.tips.map((t) => `<div>${md(t)}</div>`).join('')}</div>` : ''}`, steps: D.check.length };
  }
  function sEnd() {
    return { html: `<div class="title-slide end"><div class="big-chip">${E(D.chip)}</div><h1 class="t">${E(D.endTitle || 'Your turn')}</h1><p class="lead">${md(D.end)}</p>${D.next ? `<p class="nextup">Next: ${E(D.next)}</p>` : ''}</div>` };
  }
  const slides = [sTitle(), sWhat(), sTerms(), sLook(), ...D.examples.map(sExample), sCompare(), sPages(), sCheck(), sEnd()];

  // ---- render
  root.innerHTML = slides.map((s, i) => `<section class="slide" data-i="${i}">${s.html}</section>`).join('') +
    `<div class="ctl"><a class="home" href="./">☰ NEA stages</a><span class="dots">${slides.map((_, i) => `<i data-i="${i}"></i>`).join('')}</span><button class="fs" title="Full screen">⤢</button></div>`;
  const els = [...root.querySelectorAll('.slide')], dots = [...root.querySelectorAll('.dots i')];
  let cur = 0, step = 0;
  function show() {
    els.forEach((el, i) => el.classList.toggle('on', i === cur));
    dots.forEach((d, i) => d.classList.toggle('on', i === cur));
    const el = els[cur];
    for (let k = 1; k <= 20; k++) el.querySelectorAll('.s' + k).forEach((x) => x.classList.toggle('shown', k <= step));
    el.querySelectorAll('.pin').forEach((p) => { const n = +p.dataset.n; p.classList.toggle('shown', n <= step); p.classList.toggle('now', n === step); });
    el.querySelectorAll('.nt').forEach((p) => p.classList.toggle('now', +p.dataset.n === step));
    const z = el.querySelector('.zoom');
    if (z) { // enlarged copy of the block being talked about, so the class can read it
      z.innerHTML = ''; const pin = el.querySelector(`.a3 .pin[data-n="${step}"]`);
      if (pin && step) {
        z.appendChild(pin.closest('.blk').cloneNode(true)); z.style.display = 'block';
      } else z.style.display = 'none';
    }
    fit();
    try { history.replaceState(null, '', '#' + (cur + 1)); } catch (e) {}
  }
  function next() { const s = slides[cur]; if (s.steps && step < s.steps) { step++; return show(); } if (cur < slides.length - 1) { cur++; step = 0; show(); } }
  function prev() { if (step > 0) { step--; return show(); } if (cur > 0) { cur--; step = slides[cur].steps || 0; show(); } }
  function fit() { // scale the A3 example to the space it has
    const el = els[cur], wrap = el.querySelector('.a3-wrap'), a3 = el.querySelector('.a3'); if (!wrap) return;
    const s = Math.min(wrap.clientWidth / 1600, wrap.clientHeight / 1131); a3.style.transform = `scale(${s})`;
    a3.parentElement.style.setProperty('--h', 1131 * s + 'px');
  }
  addEventListener('resize', fit);
  addEventListener('keydown', (e) => { if (['ArrowRight', ' ', 'PageDown', 'Enter'].includes(e.key)) { e.preventDefault(); next(); } if (['ArrowLeft', 'PageUp', 'Backspace'].includes(e.key)) { e.preventDefault(); prev(); } });
  root.addEventListener('click', (e) => {
    if (e.target.closest('.ctl')) { const d = e.target.closest('.dots i'); if (d) { cur = +d.dataset.i; step = 0; show(); } return; }
    (e.clientX > innerWidth * 0.33 ? next : prev)();
  });
  root.querySelector('.fs').onclick = () => { const d = document.documentElement; (document.fullscreenElement ? document.exitFullscreen() : (d.requestFullscreen || d.webkitRequestFullscreen || (() => {})).call(d)); };
  const h = parseInt(location.hash.slice(1), 10); if (h > 0 && h <= slides.length) cur = h - 1;
  show();

})();
