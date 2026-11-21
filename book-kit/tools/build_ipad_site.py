#!/usr/bin/env python3
"""Build the separate "iPad sites" website: only the open, no-data iPad versions of the student workbooks.

    python3 book-kit/tools/build_ipad_site.py /path/to/ipad-sites

Copies every <activity>/ipad/ folder plus exactly the files each one uses (taken from its sw.js list), keeping the same
folder layout so nothing needs rewriting. Results-server addresses and passwords are blanked in the copied settings.
No teacher tools, no logged-in pages, no backend code. The list page becomes the site's home page.
Run make_solo.py / make_solo_pages.py first if a workbook changed.
"""
import json, pathlib, re, shutil, sys

SRC = pathlib.Path(__file__).resolve().parents[2]


def main(dest):
    dest = pathlib.Path(dest).resolve()
    dest.mkdir(parents=True, exist_ok=True)
    for p in dest.iterdir():  # start clean, keep git and the domain file
        if p.name in ('.git', 'CNAME'):
            continue
        shutil.rmtree(p) if p.is_dir() else p.unlink()
    files = set()
    books = []
    for sw in sorted(SRC.glob('*/ipad/sw.js')):
        ipad = sw.parent
        books.append(ipad.parent.name)
        for f in ipad.iterdir():
            files.add(f.resolve())
        lst = json.loads(re.search(r'const FILES = (\[.*?\]);', sw.read_text(), re.S).group(1))
        for u in lst:
            if u in ('./',):
                continue
            files.add((ipad / u.split('?')[0]).resolve())
    for f in sorted(files):
        if not f.is_file():
            print('  missing:', f); continue
        rel = f.relative_to(SRC)
        out = dest / rel
        out.parent.mkdir(parents=True, exist_ok=True)
        if f.name == 'config.js':  # never point at the results server, no workbook passwords
            t = f.read_text()
            t = re.sub(r"backend:\s*'[^']*'", "backend: ''", t)
            t = re.sub(r"gateHash:\s*'[^']*'", "gateHash: ''", t)
            out.write_text(t)
        else:
            shutil.copy2(f, out)
    home = (SRC / 'ipad/index.html').read_text().replace('href="../', 'href="').replace('src="../', 'src="')
    (dest / 'index.html').write_text(home)
    (dest / '.nojekyll').write_text('')
    (dest / 'README.md').write_text(
        '# iPad sites (BSP D&T)\n\nOpen versions of the D&T student workbooks for iPads: no sign-in, nothing sent anywhere. '
        'Students add a workbook to their Home Screen (it shows them how), it works offline, and each page saves as a PDF for Showbie.\n\n'
        'Built from buryboy/bsp-dt-resources with `book-kit/tools/build_ipad_site.py`. Do not edit here: change the workbook there, '
        're-run make_solo.py / make_solo_pages.py, then rebuild this site.\n\n' + '\n'.join(f'- [{b}]({b}/ipad/)' for b in books) + '\n')
    # safety check: no results-server address anywhere in the built site
    bad = [str(p.relative_to(dest)) for p in dest.rglob('*') if p.is_file() and p.suffix in ('.js', '.html') and 'script.google.com' in p.read_text(errors='ignore')]
    print(f'{len(files)} files, {len(books)} workbooks -> {dest}')
    if bad:
        print('WARNING: results-server address still in:', bad)


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else '../ipad-sites')
