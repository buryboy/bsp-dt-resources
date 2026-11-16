// Settings for the NEA practice workbook (AQA GCSE D&T 8552 NEA, practice run).
window.BOOK_CONFIG = {
  lesson: 'nea-practice-y10',
  title: 'NEA practice run',
  short: 'GCSE NEA practice',
  subtitle: 'Your design folder, one section at a time: what each part is for, then your own practice entries.',
  course: 'AQA GCSE Design & Technology · NEA practice',
  emailDomain: 'bspcloud.net',
  classes: ['10A', '10B', '10C', '10D', '10E', '11A', '11B', 'Other'],
  backend: 'https://script.google.com/macros/s/AKfycbzKVTwGqoDJIE2n-dStzYwc44Vwfl4pSijs0ZcpP3AUZ90KYadLb_OHc0A8Ge_Oe7LQJQ/exec',
  hideScores: true, // students never see the indicative marks
  sync: true,       // pick up work saved on another device
  nea: true,        // the teacher dashboard shows the NEA tab for this book

  // Light password lock (SHA-256 of the password). Change it: ask Claude, or run
  //   printf '%s' 'new password' | sha256sum
  // and paste the hash here. Set to '' to remove the lock.
  gateHash: '7b7136c52d85dc4847c64feeebc039f13645763395c808f6c601a7ab0bea274a',

  // The practice project you give the class. Edit freely.
  project: {
    title: 'Small spaces, big lives',
    context: 'Many people live, study or work in small spaces: a shared bedroom, a studio flat, a school locker, a corner of the kitchen table. Design and make a product that helps someone organise, store or use their belongings better in a small space.',
    rules: ['Find a real client you can talk to at least three times.', 'Prototype size: fits inside a 400 × 300 × 300 mm box.', 'Materials from the workshop stock (timber, manufactured boards, acrylic, card, 3D print).', 'About 8 to 10 hours in total: a fast version of the 30–35 hour real thing.'],
  },

  mis: {
    blank: 'Left blank', thin: 'Much shorter than expected', 'no-why': 'Decisions not justified', 'no-numbers': 'No measurements or data',
    'short-list': 'Fewer points / ideas than expected', gaps: 'Misses half or more of the criteria', 'no-caption': 'Photo without a caption',
  },
};
