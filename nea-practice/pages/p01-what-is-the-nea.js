// p01: what the NEA is, the six sections and their marks, and how this practice book works.
Book.page({
  id: 'p01', title: 'What is the NEA?',
  build(ui) {
    ui.h('What is the NEA?', { size: 52 });
    ui.p('The <span class="key">non-exam assessment</span> is the coursework half of your GCSE: one substantial design-and-make project, worth <b>50%</b> of the qualification. You produce a <b>working prototype</b> and a concise <b>design folder</b> (about 20 A3 pages, or the digital equivalent) that shows how you got there.');
    ui.box(`<span class="tag">The numbers</span><table class="timeplan"><tr><th>Section</th><th>What you do</th><th>Marks</th></tr>
      ${NEA.sections.map((s) => `<tr><td><b>${s.key}</b></td><td>${s.title}</td><td>${s.marks}</td></tr>`).join('')}
      <tr><td></td><td><b>Total</b> · about 30–35 hours</td><td><b>100</b></td></tr></table>`);
    ui.el('span', 'note', 'Sections C, D, E and F are worth twice as much as A and B. Plan your time to match.');
    ui.box(`<span class="tag">How this book works</span>This is a practice run. Your teacher gives you a small project, and you work through it like real coursework, filling in each section as you go. Each section tells you <b>what it is</b>, <b>why it matters</b> and <b>what the moderator looks for</b>, then gives you boxes for your own entries. Sketches, models and photos still go in your sketchbook or folder: this book is for the thinking and writing that go with them.`);
    ui.predict({ id: 'p01.hardest', label: 'Which section do you expect to find hardest?', q: 'Before you start: which section do you expect to find hardest?', options: NEA.sections.map((s) => `${s.key}: ${s.title}`) });
  },
});
