// Settings for the A level NEA practice book (Pearson Edexcel 9DT0 Product Design, Component 2).
window.BOOK_CONFIG = {
  lesson: 'nea-practice-alevel',
  title: 'A level NEA practice',
  short: 'A level NEA practice',
  subtitle: 'An independent design and make project, one assessment grid at a time, laid out as A3 portfolio sheets.',
  course: 'Pearson Edexcel A level D&T: Product Design · Component 2 practice',
  emailDomain: 'bspcloud.net',
  classes: ['12A', '12B', '13A', '13B', 'Other'],
  backend: 'https://script.google.com/macros/s/AKfycbzKVTwGqoDJIE2n-dStzYwc44Vwfl4pSijs0ZcpP3AUZ90KYadLb_OHc0A8Ge_Oe7LQJQ/exec',
  hideScores: true,
  sync: true,       // pick up work saved on another device
  nea: true,
  // Light password lock (SHA-256 of the password). Set to '' to remove it.
  gateHash: '7b7136c52d85dc4847c64feeebc039f13645763395c808f6c601a7ab0bea274a',
  project: {
    title: 'Inclusive living',
    context: 'Many everyday tasks at home (opening, pouring, carrying, reaching, storing) are harder for people with reduced grip strength, limited reach or limited mobility. Identify a real client whose daily routine is affected, investigate their needs in depth, and design and make a prototype product that solves a specific problem for them, with potential for commercial manufacture.',
    rules: ['A real client you can consult at least four times; record every consultation.', 'Prototype to fit within 500 × 400 × 400 mm.', 'Must combine at least two material areas and include a working mechanism, fixing or adjustable feature.', 'Practice timescale: about 15 hours. The real NEA portfolio is about 40 A3 sides.'],
  },
  mis: { blank: 'Left blank', thin: 'Much shorter than expected', 'no-why': 'Decisions not justified', 'no-numbers': 'No measurements or data', 'short-list': 'Fewer points than expected', gaps: 'Misses half or more of the criteria', 'no-caption': 'Photo without a caption' },
};
