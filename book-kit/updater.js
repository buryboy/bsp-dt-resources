// "Check for updates" for the iPad versions. Loaded by solo.js and solo-pages.js.
// Asks this website whether a newer copy of the workbook exists (sw.js changes whenever any of its files change).
// If so, the new pages are downloaded for offline use and the book reloads. Answers live in this iPad's storage,
// keyed by page and question, so they are kept: new pages simply appear. Nothing about the student is sent:
// the only request is the same plain download of sw.js that any visitor makes.
(function () {
  'use strict';
  if (window.BookUpdater) return;
  const hasSW = 'serviceWorker' in navigator && location.protocol === 'https:';

  function keepWork() { try { if (window.Book && Book.saveNow) Book.saveNow(); } catch (e) {} }
  function reload() { keepWork(); setTimeout(() => location.reload(), 150); }

  function note(html, actions) {
    document.querySelectorAll('.upd-note').forEach((n) => n.remove());
    const d = document.createElement('div'); d.className = 'upd-note';
    d.innerHTML = `<div>${html}</div><div class="upd-btns">${(actions || [['OK', 'close']]).map(([t, a]) => `<button data-a="${a}">${t}</button>`).join('')}</div>`;
    d.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.a === 'reload') reload();
      d.remove();
    });
    document.body.appendChild(d);
    return d;
  }

  // wait for a newly found version to finish downloading and take over
  function whenReady(reg) {
    const w = reg.installing || reg.waiting;
    if (!w) return Promise.resolve(true);
    if (w.state === 'activated') return Promise.resolve(true);
    return new Promise((res) => {
      const t = setTimeout(() => res(false), 60000);
      w.addEventListener('statechange', () => {
        if (w.state === 'activated') { clearTimeout(t); res(true); }
        if (w.state === 'redundant') { clearTimeout(t); res(false); }
      });
    });
  }

  async function check(btn) {
    if (!navigator.onLine) return note('<b>No internet</b><p>Connect to the school Wi-Fi, then tap <b>Check for updates</b> again.</p>');
    if (!hasSW) return reload();
    if (btn) { btn.disabled = true; btn.textContent = 'Checking…'; }
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      if (!reg) return reload();
      await reg.update();
      if (!reg.installing && !reg.waiting) return note('<b>You have the latest version</b><p>Nothing new has been added since you last opened it.</p>');
      note('<b>Downloading the new version…</b><p>Keep this open for a moment.</p>', []);
      const ok = await whenReady(reg);
      if (ok) note('<b>Updated</b><p>New pages and fixes are ready. Your answers are kept.</p>', [['Open the new version', 'reload']]);
      else note('<b>The update did not finish</b><p>Check the Wi-Fi and try again. Your answers are safe.</p>');
    } catch (e) {
      note('<b>Could not check right now</b><p>Try again in a minute. Your answers are safe.</p>');
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = '⟳ Check for updates'; }
    }
  }

  // quiet check each time the book is opened: if a newer version arrives, offer it (never reload in the middle of work)
  function quietCheck() {
    if (!hasSW || !navigator.onLine) return;
    navigator.serviceWorker.getRegistration().then((reg) => {
      if (!reg || !navigator.serviceWorker.controller) return; // very first visit: nothing to update yet
      reg.addEventListener('updatefound', () => whenReady(reg).then((ok) => {
        if (ok) note('<b>A new version is ready</b><p>New pages or fixes have been added. Your answers are kept.</p>', [['Load it now', 'reload'], ['Later', 'close']]);
      }));
      reg.update().catch(() => {});
    }).catch(() => {});
  }

  // workbooks: a chip in the bottom bar next to the name; other activities: a small floating button
  function addButton(tries) {
    if (document.querySelector('.upd-btn, .upd-chip')) return;
    const bar = document.getElementById('topbar'), at = document.getElementById('savechip');
    if (!bar && (tries || 0) < 20) return setTimeout(() => addButton((tries || 0) + 1), 250);
    const b = document.createElement(bar ? 'span' : 'button');
    b.className = bar ? 'chip upd-chip' : 'upd-btn'; b.textContent = '⟳ Check for updates';
    b.onclick = () => { if (!b.disabled) check(b); };
    if (bar) bar.insertBefore(b, at || null); else document.body.appendChild(b);
  }

  const css = document.createElement('style');
  css.textContent = `
  .upd-btn { position: fixed; left: 10px; bottom: 10px; z-index: 250; font: 600 13px system-ui, -apple-system, sans-serif; padding: 7px 11px; border-radius: 999px; border: 1px solid #1f4d3655; background: #ffffffe6; color: #1f4d36; box-shadow: 0 2px 8px #0002; opacity: .85; }
  .upd-btn:disabled { opacity: .6; }
  .upd-chip[disabled] { opacity: .6; }
  .upd-note { position: fixed; left: 50%; bottom: 56px; transform: translateX(-50%); z-index: 320; width: min(420px, calc(100% - 24px)); background: #fffdf7; color: #1d2b24; border-radius: 14px; padding: 16px 18px; box-shadow: 0 14px 36px rgba(0,0,0,.3); font: 400 16px/1.4 system-ui, -apple-system, sans-serif; }
  .upd-note b { font-size: 18px; } .upd-note p { margin: 6px 0 0; }
  .upd-btns { display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap; }
  .upd-btns button { font: 600 15px system-ui, -apple-system, sans-serif; padding: 8px 14px; border-radius: 10px; border: 0; background: #1f4d36; color: #fff; }
  .upd-btns button[data-a="close"] { background: #e4ebe6; color: #1f4d36; }
  @media print { .upd-btn, .upd-chip, .upd-note { display: none; } }`;
  document.head.appendChild(css);

  window.BookUpdater = { check };
  if (document.readyState === 'loading') addEventListener('DOMContentLoaded', addButton); else addButton();
  addEventListener('load', () => setTimeout(quietCheck, 1500));
})();
