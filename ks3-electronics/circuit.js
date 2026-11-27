/* Circuit simulator + interactive circuit-diagram board
   Grid of nodes; components sit on the edges between neighbouring nodes.
   Edge keys: 'h-r-c' joins (r,c)->(r,c+1); 'v-r-c' joins (r,c)->(r+1,c).
   Each edge has an 'a' end (left/top) and a 'b' end (right/bottom).        */
const Circuit = (() => {
  const INFO = {
    wire: { name: 'Wire' },
    cell: { name: 'Cell', V: 1.5, r: .4, polar: 1 },
    battery: { name: 'Battery', V: 3, r: .4, polar: 1 },
    bulb: { name: 'Bulb', R: 10 },
    motor: { name: 'Motor', R: 8 },
    buzzer: { name: 'Buzzer', R: 40 },
    resistor: { name: 'Resistor', R: 100 },
    switch: { name: 'Switch' },
    push: { name: 'Push switch' },
    led: { name: 'LED', Vf: 1.9, R: 15, polar: 1 }
  };
  const RVALS = [10, 22, 47, 100, 220, 470];
  const BULB_PNOM = .8, BULB_BLOW = 2.6, LED_BURN = .05, LED_LIT = .001, SHORT_I = 1.5, MOTOR_NOM = .35, BUZZ_MIN = .03;

  /* hidden defs for glows */
  if (!document.getElementById('circuit-defs')) {
    const d = document.createElement('div');
    d.innerHTML = `<svg id="circuit-defs" width="0" height="0" style="position:absolute"><defs>
      <radialGradient id="gY"><stop offset="0" stop-color="#fff6b0"/><stop offset=".45" stop-color="#ffd23f" stop-opacity=".8"/><stop offset="1" stop-color="#ffd23f" stop-opacity="0"/></radialGradient>
      <radialGradient id="gR"><stop offset="0" stop-color="#ff8080"/><stop offset=".5" stop-color="#ef476f" stop-opacity=".6"/><stop offset="1" stop-color="#ef476f" stop-opacity="0"/></radialGradient>
      <radialGradient id="gH"><stop offset="0" stop-color="#ff5a1f" stop-opacity=".8"/><stop offset="1" stop-color="#ff5a1f" stop-opacity="0"/></radialGradient>
    </defs></svg>`;
    document.body.append(d.firstElementChild);
  }

  const ends = (k, cols) => { const [d, r, c] = k.split('-'); const a = +r * cols + +c; return [a, d === 'h' ? a + 1 : a + cols]; };
  function allEdges(cols, rows) {
    const e = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols - 1; c++) e.push(`h-${r}-${c}`);
    for (let r = 0; r < rows - 1; r++) for (let c = 0; c < cols; c++) e.push(`v-${r}-${c}`);
    return e;
  }
  /* 'battery!' locked, 'led~' flipped, 'switch+' closed, 'resistor:470' */
  function parse(spec) {
    if (typeof spec !== 'string') return Object.assign({}, spec);
    const m = spec.match(/^([a-z]+)/); const p = { type: m[1] };
    if (spec.includes('!')) p.locked = true;
    if (spec.includes('~')) p.flip = true;
    if (spec.includes('+')) p.on = true;
    if (spec.includes('#')) p.blown = p.burnt = true;
    const v = spec.match(/:(\d+)/); if (v) p.value = +v[1];
    const l = spec.match(/@(\w+)/); if (l) p.label = l[1];
    if (p.type === 'resistor' && !p.value) p.value = 100;
    return p;
  }

  function gauss(A, b, n) {
    for (let i = 0; i < n; i++) {
      let mx = i; for (let r = i + 1; r < n; r++) if (Math.abs(A[r][i]) > Math.abs(A[mx][i])) mx = r;
      [A[i], A[mx]] = [A[mx], A[i]]; [b[i], b[mx]] = [b[mx], b[i]];
      const pv = A[i][i]; if (Math.abs(pv) < 1e-15) continue;
      for (let r = i + 1; r < n; r++) { const f = A[r][i] / pv; if (!f) continue; for (let c = i; c < n; c++) A[r][c] -= f * A[i][c]; b[r] -= f * b[i]; }
    }
    const x = new Float64Array(n);
    for (let i = n - 1; i >= 0; i--) { let s = b[i]; for (let c = i + 1; c < n; c++) s -= A[i][c] * x[c]; x[i] = Math.abs(A[i][i]) < 1e-15 ? 0 : s / A[i][i]; }
    return x;
  }
  /* element model: current a->b = g*(Va-Vb) - j */
  function model(p, k, ledOn) {
    switch (p.type) {
      case 'wire': return [1000, 0];
      case 'switch': return p.on ? [1000, 0] : [0, 0];
      case 'push': return p.pressed ? [1000, 0] : [0, 0];
      case 'bulb': return p.blown ? [0, 0] : [1 / INFO.bulb.R, 0];
      case 'motor': return [1 / INFO.motor.R, 0];
      case 'buzzer': return [1 / INFO.buzzer.R, 0];
      case 'resistor': return [1 / (p.value || 100), 0];
      case 'battery': case 'cell': { const f = INFO[p.type], g = 1 / f.r; return [g, g * f.V * (p.flip ? -1 : 1)]; }
      case 'led': { if (p.burnt) return [0, 0]; if (!ledOn.has(k)) return [1e-7, 0]; const g = 1 / INFO.led.R; return [g, g * INFO.led.Vf * (p.flip ? -1 : 1)]; }
    }
    return [0, 0];
  }
  function solve(cols, rows, parts) {
    const N = cols * rows, els = [];
    parts.forEach((p, k) => { const [a, b] = ends(k, cols); els.push({ k, p, a, b, I: 0 }); });
    const ledOn = new Set();
    for (let it = 0; it < 16; it++) {
      const G = []; for (let i = 0; i < N; i++) { G.push(new Float64Array(N)); G[i][i] = 1e-6; }
      const J = new Float64Array(N);
      for (const e of els) {
        const m = model(e.p, e.k, ledOn); e.g = m[0]; e.j = m[1]; if (!e.g) continue;
        G[e.a][e.a] += e.g; G[e.b][e.b] += e.g; G[e.a][e.b] -= e.g; G[e.b][e.a] -= e.g; J[e.a] += e.j; J[e.b] -= e.j;
      }
      const V = gauss(G, J, N);
      let changed = false;
      for (const e of els) {
        e.I = e.g ? e.g * (V[e.a] - V[e.b]) - e.j : 0;
        if (e.p.type === 'led' && !e.p.burnt) {
          const sgn = e.p.flip ? -1 : 1, iak = sgn * e.I, vak = sgn * (V[e.a] - V[e.b]);
          if (ledOn.has(e.k)) { if (iak < 0) { ledOn.delete(e.k); changed = true; } }
          else if (vak > INFO.led.Vf + 1e-3) { ledOn.add(e.k); changed = true; }
        }
      }
      if (!changed) break;
    }
    const res = { edges: new Map(), short: false, blow: [], burn: [] };
    for (const e of els) {
      const p = e.p, I = Math.abs(e.I) < 1e-6 ? 0 : e.I, s = { I, type: p.type };
      if (p.type === 'bulb' && !p.blown) { const P = I * I * INFO.bulb.R; s.bright = Math.min(1.3, P / BULB_PNOM); s.on = s.bright > .03; if (P > BULB_BLOW) res.blow.push(e.k); }
      if (p.type === 'motor') { s.speed = Math.min(2.5, Math.abs(I) / MOTOR_NOM) * Math.sign(I); s.on = Math.abs(I) > .04; }
      if (p.type === 'buzzer') s.on = Math.abs(I) > BUZZ_MIN;
      if (p.type === 'led' && !p.burnt) { const iak = (p.flip ? -1 : 1) * I; s.iak = iak; s.on = iak > LED_LIT; s.bright = Math.min(1, iak / .02); if (iak > LED_BURN) res.burn.push(e.k); }
      if ((p.type === 'battery' || p.type === 'cell') && Math.abs(I) > SHORT_I) { s.short = true; res.short = true; }
      res.edges.set(e.k, s);
    }
    return res;
  }

  /* ---------- symbols (local coords: along x, a end at -H, b end at +H) ---------- */
  function sym(p, s, H) {
    s = s || {};
    const L = (x1, x2) => `<line x1="${x1}" y1="0" x2="${x2}" y2="0"/>`;
    const leads = w => L(-H, -w) + L(w, H);
    let o = '', pre = '';
    switch (p.type) {
      case 'wire': o = L(-H, H); break;
      case 'cell':
        if (s.short) pre = `<circle r="30" fill="url(#gH)" class="pulse"/>`;
        o = leads(5) + `<line x1="-5" y1="-17" x2="-5" y2="17"/><line x1="5" y1="-9" x2="5" y2="9" style="stroke-width:6"/>`; break;
      case 'battery':
        if (s.short) pre = `<circle r="34" fill="url(#gH)" class="pulse"/>`;
        o = leads(14) + `<line x1="-14" y1="-17" x2="-14" y2="17"/><line x1="-6" y1="-9" x2="-6" y2="9" style="stroke-width:6"/><line x1="-6" y1="0" x2="6" y2="0" style="stroke-dasharray:2 4;stroke-width:2.5"/><line x1="6" y1="-17" x2="6" y2="17"/><line x1="14" y1="-9" x2="14" y2="9" style="stroke-width:6"/>`; break;
      case 'bulb': {
        const b = Math.min(1, s.bright || 0);
        if (b > .03) pre = `<circle r="${20 + 24 * b}" fill="url(#gY)" opacity="${.35 + .65 * b}"/>`;
        o = leads(16) + `<circle r="16" style="fill:${p.blown ? '#d9dde3' : 'var(--paper)'}"/>` + (b > .03 ? `<circle r="14" style="fill:rgba(255,214,64,${.25 + .75 * b});stroke:none"/>` : '') +
          (p.blown ? `<path d="M-11,-11 L-3,-3 M3,3 L11,11 M-11,11 L-3,3 M3,-3 L11,-11" style="stroke:#8793a3"/>` : `<path d="M-11.3,-11.3 L11.3,11.3 M-11.3,11.3 L11.3,-11.3"/>`);
        break;
      }
      case 'motor':
        o = leads(16) + `<circle r="16" style="fill:var(--paper)"/>` +
          (s.on ? `<g class="rotor">${[0, 120, 240].map(a => `<path transform="rotate(${a})" d="M24,0 A24,24 0 0 1 15.4,18.4" style="stroke:var(--blue);stroke-width:3.5"/><path transform="rotate(${a})" d="M15.4,18.4 l1,-7 M15.4,18.4 l6.5,-2" style="stroke:var(--blue);stroke-width:3"/>`).join('')}</g>` : '');
        break;
      case 'buzzer':
        o = leads(9) + `<path d="M-17,0 A17,17 0 0 1 17,0 Z" style="fill:var(--paper)"/>` +
          (s.on ? `<g class="waves"><path d="M-13,-25 Q0,-34 13,-25" style="stroke:var(--purple)"/><path d="M-20,-32 Q0,-46 20,-32" style="stroke:var(--purple)"/></g>` : ''); break;
      case 'resistor': o = leads(20) + `<rect x="-20" y="-8" width="40" height="16" style="fill:var(--paper)"/>`; break;
      case 'switch':
        o = leads(14) + `<line x1="-14" y1="0" x2="14" y2="0" transform="rotate(${p.on ? 0 : -32} -14 0)"/><circle cx="-14" r="4" style="fill:var(--ink)"/><circle cx="14" r="4" style="fill:var(--ink)"/>`; break;
      case 'push': {
        const d = p.pressed ? 7 : 0;
        o = leads(14) + `<circle cx="-14" r="4" style="fill:var(--ink)"/><circle cx="14" r="4" style="fill:var(--ink)"/><g transform="translate(0,${d})"><line x1="-19" y1="-8" x2="19" y2="-8"/><line x1="0" y1="-8" x2="0" y2="-22"/><line x1="-8" y1="-22" x2="8" y2="-22"/></g>`; break;
      }
      case 'led': {
        const b = s.on ? Math.max(.3, s.bright || 0) : 0;
        if (b) pre = `<circle r="${24 + 14 * b}" fill="url(#gR)" opacity="${.45 + .55 * b}"/>`;
        o = `<circle r="18" style="fill:${p.burnt ? '#5b5f66' : b ? `rgba(255,90,90,${.35 + .5 * b})` : 'var(--paper)'}"/>` + leads(9) +
          `<path d="M-9,-11 L-9,11 L9,0 Z" style="fill:var(--ink)"/><line x1="9" y1="-11" x2="9" y2="11"/>` +
          `<path d="M3,-15 L11,-25 M6.5,-24.5 L11,-25 L10.5,-20.5 M10,-12 L18,-22 M13.5,-21.5 L18,-22 L17.5,-17.5" style="stroke-width:2.2"/>` +
          (p.burnt ? `<g style="opacity:.55"><circle cx="-6" cy="-30" r="6" style="fill:#9aa3ad;stroke:none"/><circle cx="4" cy="-36" r="8" style="fill:#b5bcc4;stroke:none"/></g>` : '');
        break;
      }
    }
    if (p.flip && INFO[p.type] && INFO[p.type].polar) o = `<g transform="scale(-1,1)">${o}</g>`;
    return pre + `<g class="sy">${o}</g>`;
  }

  function icon(t) {
    if (t === 'bin') return `<svg viewBox="-48 -26 96 52"><g class="sy"><path d="M-12,-14 h24 M-5,-14 v-4 h10 v4 M-10,-14 l2,28 h16 l2,-28 M-3,-8 v16 M3,-8 v16" style="stroke:var(--red)"/></g></svg>`;
    const p = parse(t);
    return `<svg viewBox="-48 -26 96 52">${sym(p, {}, 44)}${p.type === 'motor' ? '<text x="0" y="6.5" text-anchor="middle" style="font:800 18px Nunito,sans-serif;fill:var(--ink)">M</text>' : ''}${p.type === 'battery' || p.type === 'cell' ? `<text x="${p.type === 'battery' ? -25 : -15}" y="-14" text-anchor="middle" style="font:800 13px Nunito,sans-serif;fill:var(--ink)">+</text>` : ''}</svg>`;
  }

  let BID = 0;
  class Board {
    constructor(host, o = {}) {
      this.id = 'b' + (++BID);
      Object.assign(this, { cols: o.cols || 3, rows: o.rows || 2, S: o.S || 110, M: o.M || 50, mode: o.mode || 'build', power: o.power !== false, showFlow: o.flow !== false });
      this.editable = o.editable !== false && this.mode === 'build';
      this.allowed = o.slots ? new Set(o.slots) : null;
      this.onChange = o.onChange; this.onInspect = o.onInspect; this.onPartTap = o.onPartTap;
      this.parts = new Map(); this.tool = null; this.flowOff = {}; this.rot = {}; this.events = []; this.statusMode = o.statusMode || 'full';
      this.wrap = h('div', { class: 'board' + (o.small ? ' small' : '') });
      host.append(this.wrap);
      this.statusEl = h('div', { class: 'status' + (o.noStatus ? ' hide' : '') }); host.append(this.statusEl);
      const W = (this.cols - 1) * this.S + 2 * this.M, Ht = (this.rows - 1) * this.S + 2 * this.M;
      this.wrap.innerHTML = `<svg viewBox="0 0 ${W} ${Ht}"></svg>`;
      this.svg = this.wrap.firstChild;
      this.svg.addEventListener('pointerdown', e => { const k = e.target.dataset && e.target.dataset.k; if (k) { e.preventDefault(); this.tap(k); } });
      this._up = () => { if (this._pressed) { const p = this.parts.get(this._pressed); if (p) p.pressed = false; this._pressed = null; this.changed(); } };
      addEventListener('pointerup', this._up); addEventListener('pointercancel', this._up);
      this.load(o.parts || {});
      this.draw(); this.loop();
    }
    load(obj) { this.parts.clear(); for (const k in obj) this.parts.set(k, parse(obj[k])); }
    set(k, spec) { spec == null ? this.parts.delete(k) : this.parts.set(k, parse(spec)); this.changed(); }
    pos(n) { return [this.M + (n % this.cols) * this.S, this.M + Math.floor(n / this.cols) * this.S]; }
    clone() { return new Map([...this.parts].map(([k, p]) => [k, Object.assign({}, p)])); }
    simulate(mod) { const c = this.clone(); c.forEach(p => { p.burnt = false; p.blown = false; }); if (mod) mod(c); return { parts: c, res: solve(this.cols, this.rows, c) }; }
    summary(parts = this.parts, res = this.res) {
      const out = { bulbs: [], motors: [], buzzers: [], leds: [], switches: [], pushes: [], resistors: [], batteries: [], short: !!(res && res.short), burn: !!(res && res.burn.length) };
      const map = { bulb: 'bulbs', motor: 'motors', buzzer: 'buzzers', led: 'leds', switch: 'switches', push: 'pushes', resistor: 'resistors', battery: 'batteries', cell: 'batteries' };
      parts.forEach((p, k) => { if (map[p.type]) out[map[p.type]].push({ k, p, s: (res && res.edges.get(k)) || {} }); });
      return out;
    }
    /* every combination of switch / push states */
    combos() {
      const ks = [...this.parts].filter(([k, p]) => p.type === 'switch' || p.type === 'push').map(([k]) => k);
      const out = [];
      for (let m = 0; m < (1 << ks.length); m++) {
        const st = {}; ks.forEach((k, i) => st[k] = !!(m & (1 << i)));
        const { parts, res } = this.simulate(c => ks.forEach(k => { const p = c.get(k); p.on = p.pressed = st[k]; }));
        out.push({ st, parts, res, sum: this.summary(parts, res) });
      }
      return out;
    }
    tap(k) {
      Sfx.ac();
      if (this.mode === 'view') return;
      if (this.mode === 'inspect') { this.onInspect && this.onInspect(k); return; }
      const p = this.parts.get(k);
      if (p) {
        if (this.tool === 'bin' && this.editable) {
          if (p.locked) { this.flash('That part is fixed in place for this task.'); return; }
          this.parts.delete(k); Sfx.click(); this.changed(); return;
        }
        if (this.onPartTap && this.onPartTap(k, p) === false) return;
        if (p.burnt || p.blown) { p.burnt = p.blown = false; Sfx.click(); this.events.push('replaced'); this.changed(); return; }
        if (p.type === 'switch') { p.on = !p.on; Sfx.click(); this.changed(); return; }
        if (p.type === 'push') { p.pressed = true; this._pressed = k; Sfx.click(); this.changed(); return; }
        if (INFO[p.type].polar && !p.noflip) { p.flip = !p.flip; Sfx.click(); this.events.push('flip'); this.changed(); return; }
        if (p.type === 'resistor' && !p.fixed) { const i = RVALS.indexOf(p.value); p.value = RVALS[(i + 1) % RVALS.length]; Sfx.click(); this.changed(); return; }
        return;
      }
      if (!this.editable || (this.allowed && !this.allowed.has(k))) return;
      if (!this.tool || this.tool === 'bin') { this.flash('Pick a component from the toolbox, then tap a dotted gap.'); return; }
      this.parts.set(k, parse(this.tool)); Sfx.click(); this.changed();
    }
    flash(m) { this.statusEl.textContent = m; this.statusEl.style.color = '#7a4f00'; clearTimeout(this._ft); this._ft = setTimeout(() => this.setStatus(), 2600); }
    changed() { this.draw(); this.onChange && this.onChange(this.res, this); }
    setStatus() {
      const r = this.res, full = this.statusMode === 'full'; let m = '';
      const any = t => [...this.parts.values()].some(t);
      if (r && r.short) m = '⚠️ Short circuit! The current is taking a shortcut straight back to the battery – it is getting hot.';
      else if (any(p => p.burnt)) m = '💥 An LED has burnt out – too much current went through it.' + (full ? ' Tap it to fit a new one.' : '');
      else if (any(p => p.blown)) m = '💥 A bulb has blown.' + (full ? ' Tap it to fit a new one.' : '');
      this.statusEl.textContent = m; this.statusEl.style.color = '';
    }
    draw() {
      const { cols, rows, S } = this, H = S / 2;
      let res = null;
      if (this.power) {
        for (let n = 0; n < 4; n++) {
          res = solve(cols, rows, this.parts);
          if (!res.burn.length && !res.blow.length) break;
          res.burn.forEach(k => { this.parts.get(k).burnt = true; this.events.push('burn'); });
          res.blow.forEach(k => { this.parts.get(k).blown = true; this.events.push('blow'); });
          Sfx.pop();
        }
      }
      this.res = res;
      const deg = new Array(cols * rows).fill(0);
      this.parts.forEach((p, k) => { const [a, b] = ends(k, cols); deg[a]++; deg[b]++; });
      let slots = '', flow = '', parts = '', labels = '', nodes = '', hits = '';
      const build = this.mode === 'build';
      for (const k of allEdges(cols, rows)) {
        const [a, b] = ends(k, cols), [x1, y1] = this.pos(a), [x2, y2] = this.pos(b), mx = (x1 + x2) / 2, my = (y1 + y2) / 2, vert = k[0] === 'v';
        const p = this.parts.get(k), s = res && res.edges.get(k);
        const okSlot = this.editable && (!this.allowed || this.allowed.has(k));
        if (!p && okSlot) slots += `<line class="slot" x1="${x1 + (vert ? 0 : 12)}" y1="${y1 + (vert ? 12 : 0)}" x2="${x2 - (vert ? 0 : 12)}" y2="${y2 - (vert ? 12 : 0)}"/>`;
        if (p) {
          if (s && this.showFlow && Math.abs(s.I) > 2e-3) {
            const fw = s.I > 0, v = Math.max(18, Math.min(260, 25 + 70 * Math.log10(1 + Math.abs(s.I) * 30)));
            flow += `<line class="flow" data-f="${k}" data-v="${v.toFixed(0)}" x1="${fw ? x1 : x2}" y1="${fw ? y1 : y2}" x2="${fw ? x2 : x1}" y2="${fw ? y2 : y1}"/>`;
          }
          parts += `<g transform="translate(${mx},${my}) rotate(${vert ? 90 : 0})"${p.flash ? ' class="flashk"' : ''}${p.type === 'motor' && s && s.on ? ` data-m="${k}"` : ''}>${sym(p, s, H)}</g>`;
          // labels in global coords
          if (p.type === 'motor') labels += `<text class="lbl m" x="${mx}" y="${my + 6.5}" text-anchor="middle">M</text>`;
          if (p.type === 'resistor') labels += vert ? `<text class="lbl" x="${mx + 16}" y="${my + 5}">${p.value}Ω</text>` : `<text class="lbl" x="${mx}" y="${my - 15}" text-anchor="middle">${p.value}Ω</text>`;
          if (p.type === 'battery' || p.type === 'cell') {
            const ax = (p.type === 'battery' ? 25 : 15) * (p.flip ? 1 : -1);
            labels += vert ? `<text class="lbl" x="${mx + 17}" y="${my + ax + 5}">+</text>` : `<text class="lbl" x="${mx + ax}" y="${my - 18}" text-anchor="middle">+</text>`;
          }
          if (p.label) labels += vert ? `<text class="lbl tag" x="${mx - 26}" y="${my + 5}" text-anchor="end">${p.label}</text>` : `<text class="lbl tag" x="${mx}" y="${my + 36}" text-anchor="middle">${p.label}</text>`;
        }
        if (this.mode === 'inspect' || (build && (p || okSlot)))
          hits += `<g transform="translate(${mx},${my}) rotate(${vert ? 90 : 0})"><rect class="hit" data-k="${k}" x="${-H + 12}" y="-26" width="${2 * H - 24}" height="52" rx="10" fill="transparent"/></g>`;
      }
      for (let n = 0; n < cols * rows; n++) {
        const [x, y] = this.pos(n);
        if (deg[n] >= 3) nodes += `<circle cx="${x}" cy="${y}" r="6.5" fill="var(--ink)"/>`;
        else if (deg[n] === 1) nodes += `<circle cx="${x}" cy="${y}" r="5.5" fill="#fff" stroke="var(--ink)" stroke-width="2.6"/>`;
        else if (deg[n] === 0 && this.editable) nodes += `<circle cx="${x}" cy="${y}" r="4" fill="#bccde3"/>`;
      }
      this.svg.innerHTML = `<g>${slots}</g><g>${flow}</g><g>${parts}</g><g>${labels}</g><g>${nodes}</g><g>${hits}</g>`;
      this.flowEls = [...this.svg.querySelectorAll('.flow')].map(el => ({ el, k: el.dataset.f, v: +el.dataset.v }));
      this.rotEls = [...this.svg.querySelectorAll('[data-m]')].map(g => ({ el: g.querySelector('.rotor'), k: g.dataset.m, v: 360 * res.edges.get(g.dataset.m).speed }));
      const buzzing = res && [...res.edges.values()].some(s => s.type === 'buzzer' && s.on);
      Sfx.buzz(this.id, !!buzzing);
      this.setStatus();
    }
    loop() {
      let last = performance.now();
      const f = t => {
        if (!document.body.contains(this.wrap)) { Sfx.buzz(this.id, false); removeEventListener('pointerup', this._up); return; }
        const dt = Math.min(.05, (t - last) / 1000); last = t;
        for (const o of this.flowEls) { this.flowOff[o.k] = ((this.flowOff[o.k] || 0) - o.v * dt) % 2200; o.el.setAttribute('stroke-dashoffset', this.flowOff[o.k].toFixed(1)); }
        for (const o of this.rotEls) { const r = this.rot[o.k] || (this.rot[o.k] = { a: 0 }); r.a = (r.a + o.v * dt) % 360; o.el.setAttribute('transform', `rotate(${r.a.toFixed(1)})`); }
        requestAnimationFrame(f);
      };
      requestAnimationFrame(f);
    }
    palette(host, tools) {
      const wrap = h('div', { class: 'palette' });
      tools.forEach((t, i) => {
        const b = h('button', { class: 'tool', html: icon(t) + `<span>${t === 'bin' ? 'Remove' : INFO[parse(t).type].name}</span>`, onclick: () => { this.tool = t; [...wrap.children].forEach(x => x.classList.toggle('sel', x === b)); Sfx.ac(); Sfx.click(); } });
        if (i === 0) { b.classList.add('sel'); this.tool = t; }
        wrap.append(b);
      });
      host.append(wrap); return wrap;
    }
  }

  /* each bulb (or other output) controlled by its own switch? */
  function pairCheck(board, outKey = 'bulbs') {
    const cs = board.combos(); if (!cs.length) return null;
    const outs = board.summary()[outKey].map(x => x.k), sws = [...board.parts].filter(([k, p]) => p.type === 'switch').map(([k]) => k);
    const used = new Set(), pairs = {};
    for (const o of outs) {
      const sw = sws.find(s => !used.has(s) && cs.every(c => !!c.res.edges.get(o).on === c.st[s]));
      if (!sw) return null; used.add(sw); pairs[o] = sw;
    }
    return pairs;
  }

  /* Standard challenge layout: instructions + live goals on the left, board on the right */
  function challenge(stage, api, c) {
    const wrap = h('div', { class: 'split' });
    const left = h('div', { class: 'card' }), right = h('div', { class: 'card' });
    wrap.append(left, right); stage.append(wrap);
    left.append(h('div', { class: 'kicker' }, c.kicker || 'Challenge'), h('h2', {}, c.title), h('div', { class: 'lead', html: c.text }));
    const goals = h('ul', { class: 'goals' }, (c.goals || []).map(g => h('li', { html: g })));
    left.append(goals);
    const msg = h('div', { class: 'msg hide' }); left.append(msg);
    const extra = h('div', {}); left.append(extra);
    const nxt = h('div', { class: 'row hide', style: 'margin-top:14px' }, c.noNext ? null : api.nextBtn(c.nextLabel)); left.append(nxt);
    let done = false;
    const say = (t, k) => { msg.className = 'msg ' + (k || ''); msg.innerHTML = t; };
    const board = new Board(right, Object.assign({}, c.board, {
      onChange: () => {
        const ev = board.events.splice(0);
        if (done) { c.after && c.after(board, say, ev); return; }
        const r = c.check(board, ev, say) || {};
        (r.g || []).forEach((v, i) => goals.children[i] && goals.children[i].classList.toggle('done', !!v));
        if (r.msg) say(r.msg, r.kind || 'warn'); else if (!r.keep) msg.className = 'msg hide';
        if (r.done) {
          done = true; Sfx.good(); confetti(70);
          say(c.win, 'good'); nxt.classList.remove('hide');
          api.add(c.points == null ? 1 : c.points);
          c.onWin && c.onWin(board, extra, say);
        }
      }
    }));
    if (c.tools) board.palette(right, c.tools);
    if (c.hint) right.append(h('p', { style: 'margin:6px 2px 0;color:#5a6f8c;font-weight:600;font-size:15px', html: c.hint }));
    board.onChange();
    return board;
  }

  return { INFO, RVALS, Board, solve, sym, icon, parse, pairCheck, challenge };
})();
