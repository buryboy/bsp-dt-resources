// p02: the practice project (set in config.js) and a time plan.
Book.page({
  id: 'p02', title: 'Your practice project',
  build(ui) {
    const P = BOOK_CONFIG.project || {};
    ui.h('Your practice project', { size: 50 });
    ui.el('span', 'secmark', 'CONTEXT');
    ui.h(P.title || 'Practice context', { size: 38 });
    ui.box(`${P.context || ''}${P.rules && P.rules.length ? `<ul class="look">${P.rules.map((r) => `<li>${r}</li>`).join('')}</ul>` : ''}`, { tag: 'The challenge' });
    ui.el('span', 'note', 'In the real NEA, AQA publishes three contextual challenges on 1 June and you pick one.');
    ui.box(`<span class="tag">Suggested time split (real NEA, 35 h)</span><table class="timeplan"><tr><th>Section</th><th>Hours</th><th>Share</th></tr>
      ${NEA.sections.map((s) => `<tr><td>${s.key}: ${s.title}</td><td>${s.hours}</td><td>${Math.round((s.hours / 35) * 100)}%</td></tr>`).join('')}</table>`);
    neaField(ui, { id: 'p0-plan', label: 'P1 Time plan', q: 'Plan your practice project. Which lessons will you spend on each section, and what will you have finished by the end of each one?', hint: 'One line per lesson or week.', words: 60, max: 0, list: 4, kw: [['dates / lessons', 'lesson|week|\\d'], ['sections', '\\b[A-F]\\b|research|spec|ideas|develop|make|evaluat']] });
    neaField(ui, { id: 'p0-client', label: 'P2 Your client', q: 'Who will be your client for this practice project, and when can you talk to them?', hint: 'It must be a real person you can reach at least three times.', words: 40, max: 0, kw: [['a person', '[A-Z][a-z]+|my |client|user'], ['when', 'lesson|break|lunch|evening|weekend|monday|tuesday|wednesday|thursday|friday|week']] });
  },
});
