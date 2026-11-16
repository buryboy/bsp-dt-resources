// NEA kit: theme the drawing kit to match the sheets, then open the book (behind the light password lock if set).
(function () {
  const studio = document.body.classList.contains('theme-studio');
  const set = (a, v) => v.forEach((x, i) => (a[i] = x));
  set(Ink.BLUE, studio ? [31, 35, 40] : [44, 44, 48]); set(Ink.RED, [176, 64, 42]); set(Ink.GREEN, [47, 106, 67]);
  Ink.FONTS = studio ? { bubble: '"IBM Plex Sans", "Helvetica Neue", Arial, sans-serif', hand: '"Caveat", cursive', bubbleWeight: 600 } : { bubble: '"Caveat", "Segoe Print", cursive', hand: '"Caveat", "Segoe Print", cursive', bubbleWeight: 700 };
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  // light lock: keeps casual visitors out. Not real security (the files are public).
  window.neaStart = async () => {
    const C = window.BOOK_CONFIG || {}, H = C.gateHash, K = 'gate.' + C.lesson;
    if (!H || localStorage.getItem(K) === H || window.__NOGATE) return Book.start();
    const g = document.createElement('div'); g.id = 'gate';
    g.innerHTML = `<form><h1>${esc(C.title)}</h1><p>This workbook is locked for now. Enter the password from your teacher.</p><input type="password" autocomplete="off" autofocus placeholder="password"><div class="err"></div><button class="btn">Open</button></form>`;
    document.body.appendChild(g);
    const sha = async (s) => [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)))].map((b) => b.toString(16).padStart(2, '0')).join('');
    g.querySelector('form').onsubmit = async (e) => {
      e.preventDefault(); const v = g.querySelector('input').value;
      if ((await sha(v)) === H) { localStorage.setItem(K, H); g.remove(); Book.start(); }
      else { g.querySelector('.err').textContent = 'Not quite. Try again.'; g.querySelector('input').select(); }
    };
  };
})();
