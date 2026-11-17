/**
 * Exercise-book results server (Google Apps Script web app on the SCHOOL Google account).
 * Students' books POST each page's answers when they turn the page; the teacher dashboard reads them back.
 * Data lives in a Google Sheet in the owner's Drive ("Exercise book results"), one row per student per activity
 * (sheet "Latest"), plus a raw event log ("Log") and a student list with where they are now ("Students").
 *
 * Set-up: paste into a new Apps Script project → Project Settings → Script properties → add PIN = <teacher PIN>
 * → Deploy → New deployment → Web app → Execute as: Me → Who has access: Anyone → Deploy → copy the /exec link.
 * After editing: Deploy → Manage deployments → edit → Version: New version → Deploy (keeps the same link).
 */
const PROPS = PropertiesService.getScriptProperties();
const LATEST_COLS = ['key', 'lesson', 'email', 'name', 'class', 'pageN', 'pageId', 'pageTitle', 'itemId', 'label', 'type', 'answer', 'correct', 'first', 'score', 'max', 'attempts', 'mis', 'updated', 'answeredAt', 'lastChanged'];
const STUDENT_COLS = ['key', 'lesson', 'email', 'name', 'class', 'session', 'pageN', 'pageTitle', 'lastSeen', 'lastEvent', 'pagesVisited', 'secondsByPage', 'finished'];

function book() {
  let id = PROPS.getProperty('SHEET_ID'), ss = null;
  if (id) try { ss = SpreadsheetApp.openById(id); } catch (e) { ss = null; }
  if (!ss) {
    ss = SpreadsheetApp.create('Exercise book results');
    PROPS.setProperty('SHEET_ID', ss.getId());
    const l = ss.getSheets()[0]; l.setName('Latest'); l.appendRow(LATEST_COLS); l.setFrozenRows(1);
    const s = ss.insertSheet('Students'); s.appendRow(STUDENT_COLS); s.setFrozenRows(1);
    const g = ss.insertSheet('Log'); g.appendRow(['time', 'lesson', 'email', 'name', 'class', 'event', 'pageId', 'json']); g.setFrozenRows(1);
  }
  return ss;
}
const json = (o) => ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);

function doPost(e) {
  let d;
  try { d = JSON.parse(e.postData.contents); } catch (err) { return json({ ok: false, error: 'bad json' }); }
  if (d && d.a === 'email') return sendResultEmail(d);
  if (d && d.a === 'img') return saveImage(d);
  if (d && d.a === 'imgdel') return deleteImage(d);
  if (d && d.a && String(d.a).indexOf('ds') === 0) return designStarterPost(d);
  if (d && d.a && String(d.a).indexOf('cv') === 0) return coverPost(d);
  // several saves in one request (a device catching up after being offline or slow)
  if (d && d.a === 'batch' && Array.isArray(d.list)) {
    const lock = LockService.getScriptLock(); if (!lock.tryLock(25000)) return json({ ok: false, error: 'busy' });
    try { const ss = book(); let n = 0; d.list.forEach((x) => { if (x && x.student && x.student.email && x.lesson) { saveOne(ss, x); n++; } }); return json({ ok: true, saved: n }); }
    finally { lock.releaseLock(); }
  }
  if (!d || !d.student || !d.student.email || !d.lesson) return json({ ok: false, error: 'missing student' });
  const lock = LockService.getScriptLock(); if (!lock.tryLock(25000)) return json({ ok: false, error: 'busy' });
  try { return json(saveOne(book(), d)); } finally { lock.releaseLock(); }
}
function saveOne(ss, d) {
  {
    const now = new Date(), st = d.student, email = String(st.email).toLowerCase().slice(0, 120);
    const clip = (s, n) => String(s == null ? '' : s).slice(0, n);
    // students sheet (upsert)
    const S = ss.getSheetByName('Students'), skey = d.lesson + '|' + email;
    const sv = S.getDataRange().getValues(); let srow = -1;
    for (let i = 1; i < sv.length; i++) if (sv[i][0] === skey) { srow = i + 1; break; }
    const prev = srow > 0 ? sv[srow - 1] : null;
    let visited = {}; try { visited = JSON.parse((prev && prev[10]) || '{}'); } catch (x) {}
    let secs = {}; try { secs = JSON.parse((prev && prev[11]) || '{}'); } catch (x) {}
    if (d.page && d.page.id) { visited[d.page.id] = 1; if (d.seconds != null) secs[d.page.id] = d.seconds; }
    const finished = (prev && prev[12]) || (d.event === 'finish' ? now : '');
    const srowVals = [skey, d.lesson, email, clip(st.name, 80), clip(st.cls, 20), clip(d.session, 20), d.page ? d.page.n : '', d.page ? clip(d.page.title, 80) : '', now, d.event, JSON.stringify(visited), JSON.stringify(secs), finished];
    if (srow > 0) S.getRange(srow, 1, 1, srowVals.length).setValues([srowVals]); else S.appendRow(srowVals);
    // latest answers (upsert per item)
    if (d.items && d.items.length) {
      const L = ss.getSheetByName('Latest');
      // older sheets: add the answeredAt / lastChanged headers once
      if (L.getLastColumn() < LATEST_COLS.length) L.getRange(1, 1, 1, LATEST_COLS.length).setValues([LATEST_COLS]);
      const lv = L.getRange(1, 1, Math.max(1, L.getLastRow()), 1).getValues(), index = {};
      const atCol = LATEST_COLS.indexOf('answeredAt') + 1, prevAt = L.getRange(1, atCol, Math.max(1, L.getLastRow()), 1).getValues();
      const lcCol = LATEST_COLS.indexOf('lastChanged') + 1, prevLast = L.getRange(1, lcCol, Math.max(1, L.getLastRow()), 1).getValues();
      const msOf = (x) => (x instanceof Date ? x.getTime() : Number(x) || 0);
      for (let i = 1; i < lv.length; i++) index[lv[i][0]] = i + 1;
      const appends = [];
      // the final quiz is one go only: ignore a second submission
      if (d.event === 'quiz' && index[d.lesson + '|' + email + '|' + d.items[0].id]) return { ok: true, ignored: 'quiz already submitted' };
      d.items.forEach((it) => {
        const key = d.lesson + '|' + email + '|' + it.id;
        // several devices: never let an older (or blank) copy of an answer overwrite a newer one saved from elsewhere
        if (index[key]) { const was = msOf(prevLast[index[key] - 1][0]); if (was && (!it.last || it.last < was)) return; }
        const row = [key, d.lesson, email, clip(st.name, 80), clip(st.cls, 20), d.page.n, d.page.id, clip(d.page.title, 80), clip(it.id, 60), clip(it.label, 160), clip(it.type, 20), clip(it.answer, 6000),
          it.correct == null ? '' : !!it.correct, it.first == null ? '' : !!it.first, it.score == null ? '' : it.score, it.max == null ? '' : it.max, it.attempts || 0, clip(it.mis, 120), now,
          (index[key] && prevAt[index[key] - 1][0]) || (it.at ? new Date(it.at) : ''), it.last ? new Date(it.last) : ''];
        if (index[key]) L.getRange(index[key], 1, 1, row.length).setValues([row]); else appends.push(row);
      });
      if (appends.length) L.getRange(L.getLastRow() + 1, 1, appends.length, appends[0].length).setValues(appends);
    }
    if (d.event !== 'ping') ss.getSheetByName('Log').appendRow([now, d.lesson, email, clip(st.name, 80), clip(st.cls, 20), d.event, d.page ? d.page.id : '', clip(JSON.stringify({ unanswered: d.unanswered, seconds: d.seconds, visits: d.visits }), 2000)]);
    return { ok: true };
  }
}

function doGet(e) {
  const p = e.parameter || {};
  try {
    if (p.a === 'ping') return json({ ok: true, now: Date.now() });
    if (p.a === 'progress') { // what has this student already attempted? (lets the book unlock the quiz on another device)
      const em = String(p.email || '').toLowerCase(), lessonP = p.lesson || '';
      const v = book().getSheetByName('Latest').getDataRange().getValues(), done = [], items = {}; let qs = 0, qn = 0;
      const ms = (x) => (x instanceof Date ? x.getTime() : Number(x) || 0);
      for (let i = 1; i < v.length; i++) if (v[i][1] === lessonP && v[i][2] === em) {
        if (String(v[i][8]).indexOf('fq.') === 0) { qn++; qs += Number(v[i][14]) || 0; }
        else if (v[i][16] > 0 || v[i][11] !== '') done.push(v[i][8]);
        // full=1: send the saved answers back so the book can pick up where the student left off on another device
        if (p.full) items[v[i][8]] = { answer: v[i][11], correct: v[i][12] === '' ? null : v[i][12], score: v[i][14], max: v[i][15], attempts: Number(v[i][16]) || 0, mis: v[i][17], at: ms(v[i][19]), last: ms(v[i][20]) || ms(v[i][18]) };
      }
      return json({ ok: true, done: done, quiz: qn ? { submitted: true, score: qs, max: qn } : null, items: p.full ? items : undefined });
    }
    if (p.a === 'img') return getImage(p);
    if (p.a === 'dscount') return designStarterCount(p);
    if (p.a === 'cvinfo' || p.a === 'cvcount') return coverGet(p);
    const pin = PROPS.getProperty('PIN') || '';
    if (!pin || String(p.pin || '') !== pin) return json({ ok: false, error: 'Wrong PIN' });
    const ss = book(), lesson = p.lesson || '';
    const rows = (name) => { const v = ss.getSheetByName(name).getDataRange().getValues(), h = v[0]; return v.slice(1).filter((r) => !lesson || r[1] === lesson).map((r) => { const o = {}; h.forEach((k, i) => (o[k] = r[i] instanceof Date ? r[i].getTime() : r[i])); return o; }); };
    return json({ ok: true, now: Date.now(), sheet: ss.getUrl(), students: rows('Students'), latest: rows('Latest') });
  } catch (err) { return json({ ok: false, error: String(err.message || err) }); }
}

// Run once from the editor to create the results Sheet and grant permissions.
function setup() { Logger.log(book().getUrl()); }

// Teacher dashboard → email one student their final-quiz breakdown (sent from the teacher's school account).
function sendResultEmail(d) {
  const pin = PROPS.getProperty('PIN') || '';
  if (!pin || String(d.pin || '') !== pin) return json({ ok: false, error: 'Wrong PIN' });
  const to = String(d.to || '').toLowerCase();
  const sv = book().getSheetByName('Students').getDataRange().getValues();
  const known = sv.some(function (r) { return r[1] === d.lesson && r[2] === to; });
  if (!known) return json({ ok: false, error: 'Not a student in this workbook' });
  MailApp.sendEmail({ to: to, subject: String(d.subject || 'Your quiz result').slice(0, 150), htmlBody: String(d.html || '').slice(0, 40000), name: 'D&T exercise books' });
  return json({ ok: true, left: MailApp.getRemainingDailyQuota() });
}
// Run once from the editor after updating, to grant the "send email as you" permission.
function authoriseEmail() { Logger.log('emails left today: ' + MailApp.getRemainingDailyQuota()); }

// ---------------- photos (students' sketchbook / model / making photos) ----------------
// Saved privately in the owner's Drive: "Exercise book images" / <lesson> / <student email>. Never shared publicly.
// A student can read back only their own photos (file id + their email); the teacher reads any with the PIN.
function imgFolder(lesson, email) {
  const sub = (parent, name) => { const it = parent.getFoldersByName(name); return it.hasNext() ? it.next() : parent.createFolder(name); };
  let root = null, id = PROPS.getProperty('IMG_FOLDER');
  if (id) try { root = DriveApp.getFolderById(id); } catch (e) { root = null; }
  if (!root) { root = DriveApp.createFolder('Exercise book images'); PROPS.setProperty('IMG_FOLDER', root.getId()); }
  return sub(sub(root, String(lesson).slice(0, 80)), String(email).slice(0, 120));
}
function saveImage(d) {
  if (!d.student || !d.student.email || !d.lesson || !d.data) return json({ ok: false, error: 'missing data' });
  const email = String(d.student.email).toLowerCase();
  if (String(d.data).length > 8e6) return json({ ok: false, error: 'image too large' });
  const m = String(d.data).match(/^data:(image\/(jpeg|png|webp));base64,(.*)$/);
  if (!m) return json({ ok: false, error: 'not an image' });
  const stamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HHmm');
  const blob = Utilities.newBlob(Utilities.base64Decode(m[3]), m[1], [String(d.student.name || email).slice(0, 60), String(d.box || '').slice(0, 20), stamp].join(' · ') + '.' + (m[2] === 'jpeg' ? 'jpg' : m[2]));
  const f = imgFolder(d.lesson, email).createFile(blob);
  f.setDescription(JSON.stringify({ email: email, lesson: d.lesson, box: d.box || '', cap: String(d.cap || '').slice(0, 300), at: d.at || Date.now() }));
  return json({ ok: true, id: f.getId() });
}
function ownImage(id, email) {
  const f = DriveApp.getFileById(String(id));
  let meta = {}; try { meta = JSON.parse(f.getDescription() || '{}'); } catch (e) {}
  return { f: f, mine: !!email && meta.email === String(email).toLowerCase() };
}
function getImage(p) {
  const pin = PROPS.getProperty('PIN') || '', teacher = !!pin && String(p.pin || '') === pin;
  const o = ownImage(p.id, p.email);
  if (!teacher && !o.mine) return json({ ok: false, error: 'not allowed' });
  const b = p.size === 'thumb' ? (o.f.getThumbnail() || o.f.getBlob()) : o.f.getBlob();
  return json({ ok: true, data: 'data:' + (b.getContentType() || 'image/jpeg') + ';base64,' + Utilities.base64Encode(b.getBytes()) });
}
function deleteImage(d) {
  const o = ownImage(d.id, d.student && d.student.email);
  if (!o.mine) return json({ ok: false, error: 'not allowed' });
  o.f.setTrashed(true); return json({ ok: true });
}
// Run once from the editor after updating, to grant the Google Drive permission for photos.
function authoriseDrive() { Logger.log(DriveApp.getRootFolder().getName()); }

// ---------------- Design starter: collect every student's final sheet, email them to the teacher as ONE email, then delete ----------------
// Teacher (PIN) opens collection for a session code -> iPads upload their sheet (only while open) -> teacher presses send:
// one email (split only if attachments would be too big) goes to the script owner's address, and the uploads are trashed.
function dsCode(x) { return String(x || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12); }
function dsFolder(code, create) {
  const sub = (parent, name) => { const it = parent.getFoldersByName(name); return it.hasNext() ? it.next() : (create ? parent.createFolder(name) : null); };
  let root = null, id = PROPS.getProperty('DS_FOLDER');
  if (id) try { root = DriveApp.getFolderById(id); } catch (e) { root = null; }
  if (!root) { if (!create) return null; root = DriveApp.createFolder('Design starter uploads (temporary)'); PROPS.setProperty('DS_FOLDER', root.getId()); }
  return sub(root, code);
}
function dsTeacher(d) { const pin = PROPS.getProperty('PIN') || ''; return !!pin && String(d.pin || '') === pin; }
function designStarterPost(d) {
  const code = dsCode(d.session); if (!code) return json({ ok: false, error: 'no session' });
  const cache = CacheService.getScriptCache();
  if (d.a === 'dsopen') { if (!dsTeacher(d)) return json({ ok: false, error: 'Wrong PIN' }); cache.put('ds-open-' + code, '1', 3600); return json({ ok: true }); }
  if (d.a === 'dsup') {
    if (cache.get('ds-open-' + code) !== '1') return json({ ok: false, error: 'not collecting' });
    const m = String(d.data || '').match(/^data:(image\/(jpeg|png));base64,(.*)$/);
    if (!m || String(d.data).length > 6e6) return json({ ok: false, error: 'bad image' });
    const name = String(d.name || 'No name').replace(/[\\/:*?"<>|]/g, ' ').trim().slice(0, 60) || 'No name';
    const dev = String(d.device || '').replace(/[^a-z0-9]/gi, '').slice(0, 16);
    const folder = dsFolder(code, true);
    const old = folder.getFilesByName(name + ' ' + dev + '.' + (m[2] === 'jpeg' ? 'jpg' : 'png')); while (old.hasNext()) old.next().setTrashed(true); // re-send replaces
    if (folder.getFiles().hasNext()) { let n = 0; const it = folder.getFiles(); while (it.hasNext()) { it.next(); if (++n > 80) return json({ ok: false, error: 'too many' }); } }
    folder.createFile(Utilities.newBlob(Utilities.base64Decode(m[3]), m[1], name + ' ' + dev + '.' + (m[2] === 'jpeg' ? 'jpg' : 'png'))).setDescription(name);
    return json({ ok: true });
  }
  if (d.a === 'dssend') {
    if (!dsTeacher(d)) return json({ ok: false, error: 'Wrong PIN' });
    cache.remove('ds-open-' + code);
    const folder = dsFolder(code, false); if (!folder) return json({ ok: true, sent: 0 });
    const files = []; const it = folder.getFiles(); while (it.hasNext()) files.push(it.next());
    if (!files.length) { folder.setTrashed(true); return json({ ok: true, sent: 0 }); }
    files.sort((a, b) => a.getName().localeCompare(b.getName()));
    const to = Session.getEffectiveUser().getEmail(), when = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'd MMM yyyy HH:mm');
    const title = String(d.title || 'Design starter').slice(0, 80);
    const groups = []; let cur = [], size = 0;
    files.forEach((f) => { const b = f.getBlob(), n = b.getBytes().length; if (cur.length && size + n > 18e6) { groups.push(cur); cur = []; size = 0; } cur.push(b); size += n; });
    if (cur.length) groups.push(cur);
    groups.forEach((g, i) => MailApp.sendEmail({ to: to, name: 'D&T design starter',
      subject: title + ' · ' + when + ' · ' + files.length + ' sheets' + (groups.length > 1 ? ' (part ' + (i + 1) + ' of ' + groups.length + ')' : ''),
      htmlBody: '<p>' + g.length + ' design starter sheet' + (g.length === 1 ? '' : 's') + ' (session ' + code + '):</p><ul>' + g.map((b) => '<li>' + b.getName().replace(/</g, '&lt;') + '</li>').join('') + '</ul>',
      attachments: g }));
    folder.setTrashed(true);
    return json({ ok: true, sent: files.length, emails: groups.length });
  }
  return json({ ok: false, error: 'unknown' });
}
function designStarterCount(p) {
  if (!dsTeacher(p)) return json({ ok: false, error: 'Wrong PIN' });
  const folder = dsFolder(dsCode(p.session), false), names = [];
  if (folder) { const it = folder.getFiles(); while (it.hasNext()) names.push(it.next().getDescription()); }
  return json({ ok: true, open: CacheService.getScriptCache().get('ds-open-' + dsCode(p.session)) === '1', names: names.sort() });
}

// ---------------- Substitute teacher (cover work): students photograph their work, the absent teacher gets it by email ----------------
// The cover teacher's board needs the COVER CODE (script property COVER_CODE, set from the board with the dashboard PIN).
// Session details are held in the script cache for 4 hours; photos sit in a temporary Drive folder until sent, then are trashed.
function cvSession(x) { return String(x || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12); }
function cvCoverOK(d) { const c = PROPS.getProperty('COVER_CODE') || ''; return !!c && String(d.cover || '').trim().toLowerCase() === c.toLowerCase(); }
function cvInfo(code) { try { return JSON.parse(CacheService.getScriptCache().get('cv-' + code) || 'null'); } catch (e) { return null; } }
function cvFolder(code, create) {
  const sub = (parent, name) => { const it = parent.getFoldersByName(name); return it.hasNext() ? it.next() : (create ? parent.createFolder(name) : null); };
  let root = null, id = PROPS.getProperty('CV_FOLDER');
  if (id) try { root = DriveApp.getFolderById(id); } catch (e) { root = null; }
  if (!root) { if (!create) return null; root = DriveApp.createFolder('Cover work uploads (temporary)'); PROPS.setProperty('CV_FOLDER', root.getId()); }
  return sub(root, code);
}
function cvList(code) {
  const folder = cvFolder(code, false), by = {};
  if (folder) { const it = folder.getFiles(); while (it.hasNext()) { const f = it.next(); let m = {}; try { m = JSON.parse(f.getDescription() || '{}'); } catch (e) {} const k = (m.name || '?') + '|' + (m.device || ''); (by[k] = by[k] || { name: m.name || '?', files: [] }).files.push(f); } }
  return Object.keys(by).map((k) => by[k]).sort((a, b) => a.name.localeCompare(b.name));
}
function coverPost(d) {
  if (d.a === 'cvsetcode') { const pin = PROPS.getProperty('PIN') || ''; if (!pin || String(d.pin || '') !== pin) return json({ ok: false, error: 'Wrong PIN' }); const c = String(d.newCode || '').trim(); if (c.length < 4) return json({ ok: false, error: 'Code too short' }); PROPS.setProperty('COVER_CODE', c); return json({ ok: true }); }
  if (d.a === 'cvcheck') return json({ ok: cvCoverOK(d) });
  const code = cvSession(d.session); if (!code) return json({ ok: false, error: 'no session' });
  const cache = CacheService.getScriptCache();
  if (d.a === 'cvopen') {
    if (!cvCoverOK(d)) return json({ ok: false, error: 'Wrong cover code' });
    const to = String(d.teacher || '').trim().toLowerCase();
    if (!/^[a-z0-9._%+-]+@britishschool\.fr$/.test(to)) return json({ ok: false, error: 'Teacher email must end @britishschool.fr' });
    const info = { teacher: to, cls: String(d.cls || '').slice(0, 40), subject: String(d.subject || '').slice(0, 60), expected: Math.max(0, Math.min(60, Number(d.expected) || 0)), open: true, at: Date.now() };
    cache.put('cv-' + code, JSON.stringify(info), 14400); return json({ ok: true });
  }
  if (d.a === 'cvup') {
    const info = cvInfo(code); if (!info || !info.open) return json({ ok: false, error: 'not open' });
    const m = String(d.data || '').match(/^data:(image\/(jpeg|png));base64,(.*)$/);
    if (!m || String(d.data).length > 6e6) return json({ ok: false, error: 'bad image' });
    const name = String(d.name || '').replace(/[\\/:*?"<>|]/g, ' ').trim().slice(0, 60); if (!name) return json({ ok: false, error: 'no name' });
    const dev = String(d.device || '').replace(/[^a-z0-9]/gi, '').slice(0, 16), page = Math.max(1, Math.min(20, Number(d.page) || 1));
    const folder = cvFolder(code, true);
    let n = 0; const all = folder.getFiles(); while (all.hasNext()) { all.next(); if (++n > 400) return json({ ok: false, error: 'too many' }); }
    const fname = name + ' ' + dev + ' p' + page + '.' + (m[2] === 'jpeg' ? 'jpg' : 'png');
    const old = folder.getFilesByName(fname); while (old.hasNext()) old.next().setTrashed(true);
    folder.createFile(Utilities.newBlob(Utilities.base64Decode(m[3]), m[1], fname)).setDescription(JSON.stringify({ name: name, device: dev, page: page }));
    return json({ ok: true });
  }
  if (d.a === 'cvsend') {
    if (!cvCoverOK(d)) return json({ ok: false, error: 'Wrong cover code' });
    const info = cvInfo(code); if (!info) return json({ ok: false, error: 'session expired' });
    info.open = false; cache.put('cv-' + code, JSON.stringify(info), 14400);
    const people = cvList(code); if (!people.length) return json({ ok: true, sent: 0 });
    const when = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'EEE d MMM yyyy HH:mm');
    const head = [info.cls, info.subject].filter(String).join(' ') || 'Class';
    const note = String(d.note || '').slice(0, 3000).replace(/</g, '&lt;').replace(/\n/g, '<br>');
    const groups = []; let cur = [], size = 0, names = [];
    people.forEach((p) => p.files.sort((a, b) => a.getName().localeCompare(b.getName())).forEach((f) => { const b = f.getBlob(); b.setName(p.name + ' - ' + f.getName().replace(/^.* (p\d+\.\w+)$/, '$1')); const n = b.getBytes().length; if (cur.length && size + n > 18e6) { groups.push(cur); cur = []; size = 0; } cur.push(b); size += n; }));
    if (cur.length) groups.push(cur);
    const list = '<ul>' + people.map((p) => '<li>' + p.name.replace(/</g, '&lt;') + ' (' + p.files.length + ' photo' + (p.files.length === 1 ? '' : 's') + ')</li>').join('') + '</ul>';
    groups.forEach((g, i) => MailApp.sendEmail({ to: info.teacher, name: 'Cover work', replyTo: info.teacher,
      subject: head + ': cover work · ' + when + (groups.length > 1 ? ' (part ' + (i + 1) + ' of ' + groups.length + ')' : ''),
      htmlBody: '<p>Work handed in during your covered lesson: <b>' + people.length + '</b> student' + (people.length === 1 ? '' : 's') + (info.expected ? ' of ' + info.expected + ' expected' : '') + '.</p>' + (note ? '<p><b>Note from the cover teacher:</b><br>' + note + '</p>' : '') + list + (groups.length > 1 ? '<p>This is part ' + (i + 1) + ' of ' + groups.length + ' (the photos were too big for one email).</p>' : ''),
      attachments: g }));
    const folder = cvFolder(code, false); if (folder) folder.setTrashed(true);
    cache.remove('cv-' + code);
    return json({ ok: true, sent: people.length, emails: groups.length, to: info.teacher });
  }
  return json({ ok: false, error: 'unknown' });
}
function coverGet(p) {
  const code = cvSession(p.session), info = cvInfo(code);
  if (p.a === 'cvinfo') return json({ ok: true, open: !!(info && info.open), cls: info ? info.cls : '', subject: info ? info.subject : '' });
  if (!cvCoverOK(p)) return json({ ok: false, error: 'Wrong cover code' });
  return json({ ok: true, open: !!(info && info.open), expected: info ? info.expected : 0, people: cvList(code).map((x) => ({ name: x.name, photos: x.files.length })) });
}
