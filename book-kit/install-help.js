// iPad versions: when a workbook is opened in Safari (e.g. from a Showbie link) rather than from its home-screen icon,
// step the student through "Add to Home Screen". Shown on iPads / iPhones only, never inside the home-screen app itself.
(function () {
  'use strict';
  const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const app = navigator.standalone === true || (window.matchMedia && matchMedia('(display-mode: standalone)').matches);
  const force = /[?&]howto\b/.test(location.search); // add ?howto to a link to preview the steps on any device
  if ((!ios || app) && !force) return;
  const KEY = 'install-help-seen';
  const seen = (() => { try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; } })();
  const title = (document.title || 'this workbook').split('·')[0].trim();

  const share = '<svg viewBox="0 0 48 48" width="54" height="54" aria-hidden="true"><rect x="10" y="18" width="28" height="24" rx="4" fill="none" stroke="#147efb" stroke-width="3.5"/><path d="M24 6v24M16 13l8-8 8 8" fill="none" stroke="#147efb" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const more = '<svg viewBox="0 0 48 48" width="54" height="54" aria-hidden="true"><circle cx="12" cy="24" r="4" fill="#147efb"/><circle cx="24" cy="24" r="4" fill="#147efb"/><circle cx="36" cy="24" r="4" fill="#147efb"/></svg>';
  const addbox = '<svg viewBox="0 0 48 48" width="54" height="54" aria-hidden="true"><rect x="8" y="8" width="32" height="32" rx="8" fill="none" stroke="#1d1d1f" stroke-width="3.5"/><path d="M24 16v16M16 24h16" stroke="#1d1d1f" stroke-width="3.5" stroke-linecap="round"/></svg>';
  const icon = (document.querySelector('link[rel="apple-touch-icon"]') || {}).href || '';
  const steps = [
    { pic: share + '<span class="ih-or">or</span>' + more, h: 'Tap the Share button', p: 'It is next to the address bar at the top of Safari: a square with an arrow pointing up. On newer iPads it is inside the <b>•••</b> menu. <br><small>No Share button? You are inside Showbie: tap <b>Open in Safari</b> (the compass) first.</small>' },
    { pic: addbox, h: 'Tap “Add to Home Screen”', p: 'Scroll down the list if you cannot see it straight away (you may need to tap <b>View More</b>).' },
    { pic: `<span class="ih-add">Add</span>`, h: 'Tap “Add”', p: `The workbook appears on your home screen as an app${icon ? ' with this icon' : ''}.${icon ? `<br><img class="ih-ico" src="${icon}" alt="">` : ''}` },
    { pic: icon ? `<img class="ih-ico big" src="${icon}" alt="">` : '📱', h: 'Always open it from the icon', p: 'Close Safari and tap the new icon. Your work is saved inside the app, on this iPad, and it works without Wi-Fi. At the end of each page, save it as a PDF and hand it in on Showbie.' },
  ];

  function css() {
    const s = document.createElement('style');
    s.textContent = `
    .ih-ov { position: fixed; inset: 0; z-index: 99999; display: grid; place-items: center; background: rgba(12,18,15,.7); padding: 18px; font: 400 17px/1.45 -apple-system, system-ui, sans-serif; }
    .ih-card { background: #fff; color: #1d1d1f; border-radius: 22px; width: min(460px, 100%); padding: 22px 22px 18px; box-shadow: 0 24px 60px rgba(0,0,0,.45); text-align: center; }
    .ih-k { font: 700 12px -apple-system, system-ui, sans-serif; letter-spacing: .12em; color: #1f4d36; text-transform: uppercase; }
    .ih-card h2 { font: 700 23px -apple-system, system-ui, sans-serif; margin: 8px 0 6px; }
    .ih-pic { height: 90px; display: flex; align-items: center; justify-content: center; gap: 14px; margin: 10px 0 4px; }
    .ih-or { font-size: 14px; color: #6e6e73; }
    .ih-add { font: 600 22px -apple-system, system-ui, sans-serif; color: #147efb; border: 2px solid #147efb; border-radius: 10px; padding: 6px 18px; }
    .ih-ico { width: 64px; height: 64px; border-radius: 15px; box-shadow: 0 3px 10px rgba(0,0,0,.25); margin-top: 8px; } .ih-ico.big { width: 84px; height: 84px; border-radius: 19px; margin: 0; }
    .ih-card p { margin: 6px 0 0; color: #3a3a3c; } .ih-card small { color: #6e6e73; font-size: 14px; }
    .ih-dots { display: flex; gap: 7px; justify-content: center; margin: 16px 0 12px; } .ih-dots i { width: 8px; height: 8px; border-radius: 50%; background: #d1d1d6; } .ih-dots i.on { background: #1f4d36; }
    .ih-row { display: flex; gap: 10px; } .ih-row button { flex: 1; font: 600 17px -apple-system, system-ui, sans-serif; border: 0; border-radius: 13px; padding: 13px; cursor: pointer; }
    .ih-go { background: #1f4d36; color: #fff; } .ih-skip { background: #f2f2f7; color: #1f4d36; }
    .ih-bar { position: fixed; left: 50%; transform: translateX(-50%); top: calc(10px + env(safe-area-inset-top)); z-index: 99998; display: flex; gap: 10px; align-items: center; background: #1f4d36; color: #fff; border-radius: 999px; padding: 8px 8px 8px 16px; box-shadow: 0 8px 22px rgba(0,0,0,.35); font: 600 15px -apple-system, system-ui, sans-serif; max-width: calc(100% - 24px); }
    .ih-bar button { font: 700 15px -apple-system, system-ui, sans-serif; border: 0; border-radius: 999px; padding: 8px 14px; background: #fff; color: #1f4d36; cursor: pointer; } .ih-bar .x { background: transparent; color: #fff; padding: 8px 10px; }`;
    document.head.appendChild(s);
  }

  function guide() {
    let i = -1;
    const ov = document.createElement('div'); ov.className = 'ih-ov'; ov.innerHTML = '<div class="ih-card"></div>'; document.body.appendChild(ov);
    const card = ov.querySelector('.ih-card');
    const paint = () => {
      if (i < 0) {
        card.innerHTML = `<div class="ih-k">Before you start</div><h2>Put “${title}” on your home screen</h2>
          <div class="ih-pic">${icon ? `<img class="ih-ico big" src="${icon}" alt="">` : '📱'}</div>
          <p>It then opens like an app, keeps your work on this iPad and works without Wi-Fi. It takes four taps.</p>
          <div class="ih-dots">${steps.map(() => '<i></i>').join('')}</div>
          <div class="ih-row"><button class="ih-skip" data-a="skip">Not now</button><button class="ih-go" data-a="next">Show me how</button></div>`;
        return;
      }
      const s = steps[i];
      card.innerHTML = `<div class="ih-k">Step ${i + 1} of ${steps.length}</div><div class="ih-pic">${s.pic}</div><h2>${s.h}</h2><p>${s.p}</p>
        <div class="ih-dots">${steps.map((_, k) => `<i class="${k === i ? 'on' : ''}"></i>`).join('')}</div>
        <div class="ih-row"><button class="ih-skip" data-a="back">${i ? 'Back' : 'Close'}</button><button class="ih-go" data-a="${i < steps.length - 1 ? 'next' : 'done'}">${i < steps.length - 1 ? 'Next' : 'Got it'}</button></div>`;
    };
    ov.addEventListener('click', (e) => {
      const a = (e.target.closest('button') || {}).dataset; if (!a || !a.a) return;
      if (a.a === 'next') i++;
      if (a.a === 'back') { if (i <= 0) return close(); i--; }
      if (a.a === 'skip' || a.a === 'done') return close();
      paint();
    });
    const close = () => { ov.remove(); try { localStorage.setItem(KEY, '1'); } catch (e) {} bar(); };
    paint();
  }
  // after the first time: a small reminder bar while they are still in Safari
  function bar() {
    if (document.querySelector('.ih-bar')) return;
    const b = document.createElement('div'); b.className = 'ih-bar';
    b.innerHTML = `<span>Using Safari: add this to your home screen</span><button data-a="how">How?</button><button class="x" data-a="x" aria-label="Hide">✕</button>`;
    b.addEventListener('click', (e) => { const a = (e.target.closest('button') || {}).dataset; if (!a) return; b.remove(); if (a.a === 'how') guide(); });
    document.body.appendChild(b);
  }
  const go = () => { css(); seen && !force ? bar() : guide(); };
  document.readyState === 'loading' ? addEventListener('DOMContentLoaded', go) : go();
})();
