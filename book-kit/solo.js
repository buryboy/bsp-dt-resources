// iPad version of a workbook: no sign-in, nothing sent anywhere.
// Loaded straight after the workbook's config.js by <workbook>/ipad/index.html (made by book-kit/tools/make_solo.py).
// - switches the results server off and keeps this version's answers separate from the logged-in version
// - adds "Save this page as PDF" to the end of every page: a picture of the page (with name, page and time on it)
//   in an A4 PDF, handed to the iPad's share sheet (Save to Files, Showbie…)
// - registers the offline cache (sw.js) so the workbook keeps working without Wi-Fi once opened
(function () {
  'use strict';
  const C = window.BOOK_CONFIG || (window.BOOK_CONFIG = {});
  C.solo = true; C.backend = ''; C.sync = false; C.gateHash = ''; // no workbook password in the iPad versions C.lesson = (C.lesson || 'lesson') + '-ipad';
  const KIT = new URL('.', document.currentScript.src).href; // …/book-kit/
  const VENDOR = new URL('../nea-kit/vendor/', KIT).href;
  { const s = document.createElement('script'); s.src = KIT + 'install-help.js'; document.head.appendChild(s); } // how to add it to the home screen
  if ('serviceWorker' in navigator && location.protocol === 'https:') addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const loadScript = (src) => new Promise((res, rej) => { if ([...document.scripts].some((s) => s.src === src)) return res(); const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => rej(new Error('could not load ' + src)); document.head.appendChild(s); });
  const libs = () => Promise.all([loadScript(VENDOR + 'html2canvas.min.js'), loadScript(VENDOR + 'jspdf.umd.min.js')]);
  const stamp = () => new Date().toLocaleString([], { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const safe = (s) => String(s || '').replace(/[\\/:*?"<>|]+/g, '').replace(/\s+/g, ' ').trim().slice(0, 60);

  function overlay(html) {
    const d = document.createElement('div'); d.className = 'solo-ov'; d.innerHTML = `<div class="solo-card">${html}</div>`;
    document.body.appendChild(d); return d;
  }
  // the PDF is ready: one more tap opens the share sheet (iPads only allow sharing straight after a tap)
  function offer(file, pdf) {
    const ov = overlay(`<b>Your PDF is ready</b><p>${esc(file.name)}</p><p class="solo-small">Tap <b>Share / save</b>, then choose <b>Showbie</b> to hand it in, or <b>Save to Files</b>.</p><div class="solo-btns"><button class="btn" data-a="share">Share / save</button><button class="btn ghost" data-a="close">Close</button></div>`);
    ov.addEventListener('click', async (e) => {
      const a = e.target.closest('button'); if (!a) return;
      if (a.dataset.a === 'close') return ov.remove();
      try {
        if (navigator.canShare && navigator.canShare({ files: [file] })) await navigator.share({ files: [file], title: file.name });
        else pdf.save(file.name);
        ov.remove();
      } catch (err) { if (err && err.name === 'AbortError') return; pdf.save(file.name); ov.remove(); }
    });
  }

  // picture of a book page (the whole page, not just what is on screen) with a name / page / time header
  async function pageCanvas(p, n) {
    const el = p.el.querySelector('.content'), st = (window.Book && Book.state) || {}, who = st.student || {};
    const head = `<div class="solo-head"><b>${esc(who.name || 'No name')}</b>${who.cls ? ' · ' + esc(who.cls) : ''}<span>${esc(C.title || '')} · page ${n}: ${esc(p.title || '')}</span><span>${esc(stamp())}</span></div>`;
    return window.html2canvas(el, {
      scale: 1.6, backgroundColor: '#fbfaf5', logging: false, useCORS: true,
      onclone: (doc, clone) => {
        clone.querySelectorAll('.solo-save').forEach((x) => x.remove());
        clone.insertAdjacentHTML('afterbegin', head);
        // let the page grow to its full height in the copy that is photographed
        for (let a = clone; a && a !== doc.body; a = a.parentElement) {
          a.style.transform = 'none'; a.style.maxHeight = 'none'; a.style.overflow = 'visible'; a.style.animation = 'none';
          if (a !== clone && a.classList && (a.classList.contains('sheet') || a.classList.contains('page'))) { a.style.position = 'relative'; a.style.height = 'auto'; a.style.inset = 'auto'; }
        }
      },
    });
  }
  // a tall picture split over A4 pages
  function addTall(pdf, canvas, first) {
    const W = 210, H = 297, M = 8, iw = W - 2 * M, pxPerMm = canvas.width / iw, sliceH = Math.floor((H - 2 * M) * pxPerMm);
    for (let y = 0, i = 0; y < canvas.height; y += sliceH, i++) {
      const h = Math.min(sliceH, canvas.height - y), c = document.createElement('canvas'); c.width = canvas.width; c.height = h;
      c.getContext('2d').drawImage(canvas, 0, y, canvas.width, h, 0, 0, canvas.width, h);
      if (!(first && i === 0)) pdf.addPage('a4', 'portrait');
      pdf.addImage(c.toDataURL('image/jpeg', 0.8), 'JPEG', M, M, iw, h / pxPerMm);
    }
  }

  async function savePage(p) {
    const st = (window.Book && Book.state) || {};
    if (!st.student) return Book.toast('Write your name on the cover first');
    const ov = overlay('<b>Making your PDF…</b><p class="solo-small">This takes a few seconds.</p>');
    try {
      await libs(); if (document.fonts && document.fonts.ready) await document.fonts.ready;
      const n = Book.pages ? Book.pages.indexOf(p) : 0;
      let pdf;
      if (p.solo && p.solo.sheetPDF) pdf = await p.solo.sheetPDF(); // NEA sheets make their own A3 page
      else { pdf = new window.jspdf.jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true }); addTall(pdf, await pageCanvas(p, n), true); }
      const name = `${safe(st.student.name)} - ${safe(C.short || C.title)} - p${n} ${safe(p.title)}.pdf`;
      const file = new File([pdf.output('blob')], name, { type: 'application/pdf' });
      ov.remove(); offer(file, pdf);
    } catch (e) { console.error(e); ov.remove(); Book.toast('Sorry, the PDF could not be made: ' + (e.message || e)); }
  }

  window.BookSolo = {
    savePage, offer,
    // called by book.js after each page is built
    pageAdded(p, content) {
      if (p.solo && p.solo.noBox) return;
      const box = document.createElement('div'); box.className = 'solo-save';
      box.innerHTML = `<button class="btn">📄 Save this page as PDF</button><span>Finished this page? Save it and hand it in on Showbie.</span>`;
      box.querySelector('button').onclick = () => savePage(p);
      content.appendChild(box);
    },
  };

  const css = document.createElement('style');
  css.textContent = `
  .solo-save { margin: 34px 0 10px; padding: 16px 18px; border: 2px dashed currentColor; border-radius: 12px; display: flex; gap: 14px; align-items: center; flex-wrap: wrap; opacity: .92; }
  .solo-save .btn { font-size: 18px; }
  .solo-save span { font-size: 16px; }
  .solo-head { display: flex; flex-wrap: wrap; gap: 6px 18px; align-items: baseline; padding: 0 0 10px; margin: 0 0 16px; border-bottom: 2px solid #1f4d36; font: 600 15px system-ui, -apple-system, sans-serif; color: #1f2a24; }
  .solo-head b { font-size: 18px; } .solo-head span { color: #4b5a51; }
  .solo-ov { position: fixed; inset: 0; z-index: 300; display: grid; place-items: center; background: rgba(15, 20, 17, .55); padding: 20px; }
  .solo-card { background: #fffdf7; color: #1d2b24; border-radius: 16px; padding: 22px 24px; max-width: 420px; width: 100%; box-shadow: 0 18px 40px rgba(0,0,0,.35); font: 400 17px/1.4 system-ui, -apple-system, sans-serif; }
  .solo-card b { font-size: 20px; } .solo-card p { margin: 8px 0; word-break: break-word; } .solo-small { font-size: 15px; color: #4b5a51; }
  .solo-btns { display: flex; gap: 10px; margin-top: 14px; } .solo-btns .btn { font-size: 17px; }`;
  document.head.appendChild(css);
})();
