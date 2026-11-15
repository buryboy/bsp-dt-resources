#!/usr/bin/env python3
"""Local stand-in for backend/Code.gs (same JSON in/out) so the book + dashboard can be tested end to end.
python3 tools/mock_backend.py 8765   (PIN 1234)"""
import json, sys, time, http.server
L, S = {}, {}
class Hd(http.server.BaseHTTPRequestHandler):
    def log_message(self, *a): pass
    def _out(self, o):
        b = json.dumps(o).encode(); self.send_response(200); self.send_header('Content-Type', 'application/json'); self.send_header('Access-Control-Allow-Origin', '*'); self.send_header('Content-Length', len(b)); self.end_headers(); self.wfile.write(b)
    def do_POST(self):
        d = json.loads(self.rfile.read(int(self.headers['Content-Length'])))
        if d.get('a') == 'email': print('EMAIL to', d['to'], d['subject'], len(d['html'])); sys.stdout.flush(); return self._out({'ok': True})
        if d.get('event') == 'quiz' and (d['lesson'] + '|' + d['student']['email'].lower() + '|' + d['items'][0]['id']) in L: return self._out({'ok': True, 'ignored': 1})
        st = d['student']; em = st['email'].lower(); now = int(time.time() * 1000); sk = d['lesson'] + '|' + em
        prev = S.get(sk, {}); vis = json.loads(prev.get('pagesVisited', '{}'))
        if d.get('page'): vis[d['page']['id']] = 1
        S[sk] = dict(key=sk, lesson=d['lesson'], email=em, name=st['name'], **{'class': st['cls']}, session=d.get('session'), pageN=d['page']['n'] if d.get('page') else '', pageTitle=d['page']['title'] if d.get('page') else '', lastSeen=now, lastEvent=d['event'], pagesVisited=json.dumps(vis), secondsByPage='{}', finished=prev.get('finished') or (now if d['event'] == 'finish' else ''))
        for it in d.get('items', []):
            k = sk + '|' + it['id']
            L[k] = dict(key=k, lesson=d['lesson'], email=em, name=st['name'], **{'class': st['cls']}, pageN=d['page']['n'], pageId=d['page']['id'], pageTitle=d['page']['title'], itemId=it['id'], label=it['label'], type=it['type'], answer=it['answer'], correct='' if it['correct'] is None else it['correct'], first='' if it['first'] is None else it['first'], score='' if it['score'] is None else it['score'], max='' if it['max'] is None else it['max'], attempts=it['attempts'], mis=it['mis'], updated=now)
        self._out({'ok': True})
    def do_GET(self):
        from urllib.parse import urlparse, parse_qs
        q = {k: v[0] for k, v in parse_qs(urlparse(self.path).query).items()}
        if q.get('a') == 'progress':
            rows = [r for r in L.values() if r['lesson'] == q.get('lesson') and r['email'] == q.get('email', '').lower()]
            fq = [r for r in rows if r['itemId'].startswith('fq.')]
            return self._out({'ok': True, 'done': [r['itemId'] for r in rows if not r['itemId'].startswith('fq.') and (r['attempts'] or r['answer'])], 'quiz': {'submitted': True, 'score': sum(r['score'] or 0 for r in fq), 'max': len(fq)} if fq else None})
        if q.get('pin') != '1234': return self._out({'ok': False, 'error': 'Wrong PIN'})
        self._out({'ok': True, 'now': int(time.time() * 1000), 'sheet': 'about:blank', 'students': list(S.values()), 'latest': list(L.values())})
http.server.ThreadingHTTPServer(('127.0.0.1', int(sys.argv[1])), Hd).serve_forever()
