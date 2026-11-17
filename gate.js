/* Site password screen (BSP D&T). Included first in every page's <head>.
   Once the right password is entered it is remembered on that device/browser for the whole site.
   Not real security: it keeps casual visitors out; anyone who reads the page code could get round it.
   To change the password: put the SHA-256 of the new password (lower case, no spaces) in H. */
(function () {
  var H = 'e6148a925a1d24ea191e7960eda136d22716d869639e501911e607e36f1e346d', K = 'bsp-hub-ok';
  if (/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname)) return; // local testing only
  try { if (localStorage.getItem(K) === H.slice(0, 16)) return; } catch (e) {}
  var root = document.documentElement; root.classList.add('bsp-locked');
  var st = document.createElement('style');
  st.textContent = 'html.bsp-locked body>*:not(#bsp-gate){display:none!important}html.bsp-locked,html.bsp-locked body{overflow:hidden!important;background:#d3e9c6!important}' +
    '#bsp-gate{position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:20px;background:radial-gradient(1400px 800px at 50% -10%,#eef8e6,#d3e9c6 55%,#b5d4a4);font-family:Nunito,Fredoka,system-ui,sans-serif;color:#1d2b24}' +
    '#bsp-gate form{background:#fff8ec;border:3px solid #e8d9bd;border-radius:26px;box-shadow:0 8px 0 #d9c7a3,0 14px 24px #0002;padding:28px 26px;max-width:380px;width:100%;text-align:center}' +
    '#bsp-gate .t{font:700 13px system-ui,sans-serif;letter-spacing:.1em;color:#6b7c72;margin:0 0 6px}#bsp-gate h1{font:700 28px Fredoka,system-ui,sans-serif;color:#1f4d36;margin:0 0 6px}#bsp-gate p{margin:0 0 16px;color:#3d5246}' +
    '#bsp-gate input{width:100%;box-sizing:border-box;font:600 20px system-ui,sans-serif;padding:12px 14px;border:3px solid #e8d9bd;border-radius:14px;text-align:center;background:#fff;color:#1d2b24}' +
    '#bsp-gate button{margin-top:12px;width:100%;font:700 20px system-ui,sans-serif;padding:12px;border:0;border-radius:14px;background:#1f4d36;color:#fff;cursor:pointer}#bsp-gate .e{color:#b21c26;font-weight:700;min-height:22px;margin-top:10px}';
  (document.head || root).appendChild(st);
  function hex(buf) { return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ('0' + b.toString(16)).slice(-2); }).join(''); }
  function mount() {
    var g = document.createElement('div'); g.id = 'bsp-gate';
    g.innerHTML = '<form autocomplete="off"><div class="t">THE BRITISH SCHOOL OF PARIS</div><h1>Class resources</h1><p>Enter the password your teacher gave you.</p>' +
      '<input type="password" placeholder="Password" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="Password"><button type="submit">Open</button><div class="e"></div></form>';
    document.body.appendChild(g);
    var f = g.querySelector('form'), pw = g.querySelector('input'), err = g.querySelector('.e');
    setTimeout(function () { pw.focus(); }, 50);
    f.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var v = pw.value.trim().toLowerCase().replace(/\s+/g, '');
      crypto.subtle.digest('SHA-256', new TextEncoder().encode(v)).then(function (b) {
        if (hex(b) === H) {
          try { localStorage.setItem(K, H.slice(0, 16)); } catch (x) {}
          root.classList.remove('bsp-locked'); g.remove(); window.dispatchEvent(new Event('resize'));
        } else { err.textContent = 'That password is not right.'; pw.select(); }
      });
    });
  }
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
})();
