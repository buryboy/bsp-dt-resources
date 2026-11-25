import base64, pathlib
F = pathlib.Path('../../fonts/files')
faces = [('IBM Plex Sans', w, f'ibm-plex-sans-latin-{w}-normal.woff2') for w in (400, 500, 600)] + [('IBM Plex Mono', w, f'ibm-plex-mono-latin-{w}-normal.woff2') for w in (400, 600)]
css = ''.join(f"@font-face{{font-family:'{n}';font-weight:{w};font-style:normal;font-display:swap;src:url(data:font/woff2;base64,{base64.b64encode((F/f).read_bytes()).decode()}) format('woff2')}}\n" for n, w, f in faces)
libs = pathlib.Path('jspdf.umd.min.js').read_text() + '\n' + pathlib.Path('html2canvas.min.js').read_text()
s = pathlib.Path('workbook-template.html').read_text()
assert s.count('/*FONTS*/') == 1 and s.count('/*LIBS*/') == 1
s = s.replace('/*FONTS*/', css).replace('<script>/*LIBS*/</script>', '<script>' + libs.replace('</script', '<\\/script') + '</script>')
pathlib.Path('Critical-Path-Analysis-Y13.html').write_text(s)
print(len(s)//1024, 'KB')
