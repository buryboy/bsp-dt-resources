// p09: self-assessment per section.
Book.page({
  id: 'p09', title: 'Check yourself',
  build(ui) {
    ui.h('Check yourself', { size: 52 });
    ui.p('Be honest. How confident are you that each section of your practice folder would convince a moderator?');
    NEA.sections.forEach((s) => ui.rate({ id: 'p09.conf-' + s.key, label: `Confidence: section ${s.key}`, q: `<b>${s.key}</b> · ${s.title}`, scale: ['not yet', 'getting there', 'fairly sure', 'confident'] }));
    neaField(ui, { id: 'p9-targets', label: 'T1 My targets for the real NEA', q: 'Write three targets for your real NEA, based on this practice run.', hint: 'One per line. Make them specific: “Interview my client before writing the spec”.', words: 50, max: 0, list: 3, kw: [['targets', 'will|need to|should|must|aim']] });
  },
});
