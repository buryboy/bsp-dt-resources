#!/usr/bin/env python3
"""Home-screen icons for the iPad versions: one per workbook, drawn here (no outside images).
    python3 book-kit/tools/make_icons.py          -> book-kit/icons/<folder>-{180,192,512}.png
"""
import math, pathlib
from PIL import Image, ImageDraw, ImageFilter

OUT = pathlib.Path(__file__).resolve().parents[1] / 'icons'
S = 1024  # drawn at 1024 then scaled down for smooth edges
W = (255, 255, 255, 255)
SH = (0, 0, 0, 70)


def base(c1, c2):
    im = Image.new('RGBA', (S, S))
    px = im.load()
    for y in range(S):
        for x in range(S):
            t = (x * 0.35 + y * 0.65) / S
            px[x, y] = tuple(int(c1[i] + (c2[i] - c1[i]) * t) for i in range(3)) + (255,)
    hl = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    ImageDraw.Draw(hl).ellipse([-300, -420, 900, 420], fill=(255, 255, 255, 34))  # soft highlight
    im.alpha_composite(hl.filter(ImageFilter.GaussianBlur(30)))
    return im


def layer():
    return Image.new('RGBA', (S, S), (0, 0, 0, 0))


def finish(im, glyph, name):
    sh = glyph.copy()
    alpha = sh.split()[3].point(lambda a: int(a * 0.35))
    shadow = Image.new('RGBA', (S, S), (0, 0, 0, 255)); shadow.putalpha(alpha)
    shadow = shadow.filter(ImageFilter.GaussianBlur(14))
    im.alpha_composite(shadow, (0, 18))
    im.alpha_composite(glyph)
    for n in (512, 192, 180):
        im.convert('RGB').resize((n, n), Image.LANCZOS).save(OUT / f'{name}-{n}.png')


def gear(d, cx, cy, r, teeth, fill, hole_fill, rot=0):
    pts = []
    for i in range(teeth * 4):
        a = rot + i * math.pi * 2 / (teeth * 4)
        rr = r if (i % 4) in (0, 1) else r * 0.8
        pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a)))
    d.polygon(pts, fill=fill)
    d.ellipse([cx - r * 0.68, cy - r * 0.68, cx + r * 0.68, cy + r * 0.68], fill=fill)
    d.ellipse([cx - r * 0.22, cy - r * 0.22, cx + r * 0.22, cy + r * 0.22], fill=hole_fill)


def icons():
    OUT.mkdir(exist_ok=True)
    # Levers & linkages: a lever on a fulcrum with a load and an effort arrow
    im, g = base((255, 170, 60), (220, 80, 40)), layer(); d = ImageDraw.Draw(g)
    d.polygon([(512, 560), (420, 760), (604, 760)], fill=W)
    bar = [(170, 470), (860, 600)]
    d.line(bar, fill=W, width=46); d.ellipse([480, 500, 544, 564], fill=(230, 110, 50, 255))
    d.rounded_rectangle([190, 330, 330, 450], 18, fill=W)
    d.line([(800, 330), (800, 520)], fill=W, width=34); d.polygon([(760, 500), (840, 500), (800, 570)], fill=W)
    d.rectangle([300, 760, 724, 800], fill=W)
    finish(im, g, 'levers-linkages')

    # Material properties: a test bar being stretched, with arrows
    im, g = base((90, 200, 220), (40, 90, 180)), layer(); d = ImageDraw.Draw(g)
    d.rounded_rectangle([300, 450, 724, 574], 30, fill=W)
    d.rounded_rectangle([200, 400, 330, 624], 24, fill=W); d.rounded_rectangle([694, 400, 824, 624], 24, fill=W)
    for x, s in ((150, -1), (874, 1)):
        d.line([(x, 512), (x + s * 110, 512)], fill=W, width=34)
        d.polygon([(x + s * 160, 512), (x + s * 100, 462), (x + s * 100, 562)], fill=W)
    d.ellipse([440, 230, 584, 374], outline=W, width=26); d.line([(560, 350), (640, 430)], fill=W, width=30)
    finish(im, g, 'material-properties')

    # Cams, gears & pulleys: two meshing gears
    im, g = base((120, 220, 140), (30, 120, 90)), layer(); d = ImageDraw.Draw(g)
    gear(d, 400, 560, 230, 12, W, (40, 140, 100, 255))
    gear(d, 690, 330, 160, 9, W, (40, 140, 100, 255), rot=0.2)
    finish(im, g, 'cams-gears-pulleys')

    # Systems & electronics: input → process → output with an LED glow
    im, g = base((120, 110, 240), (50, 30, 140)), layer(); d = ImageDraw.Draw(g)
    for x in (140, 412, 684):
        d.rounded_rectangle([x, 400, x + 200, 600], 36, outline=W, width=26)
    for x in (340, 612):
        d.line([(x + 6, 500), (x + 62, 500)], fill=W, width=22)
    d.ellipse([200, 460, 280, 540], fill=W)                                    # input: button
    d.line([(450, 540), (500, 450), (540, 540), (580, 460)], fill=W, width=20)  # process: chip / signal
    d.ellipse([744, 440, 824, 520], fill=(255, 240, 150, 255)); d.rectangle([770, 520, 798, 560], fill=W)  # output: LED
    d.ellipse([700, 396, 868, 564], outline=(255, 240, 150, 120), width=12)
    finish(im, g, 'systems-electronics')

    # Metals & alloys: stacked ingots
    im, g = base((200, 205, 215), (90, 100, 120)), layer(); d = ImageDraw.Draw(g)
    def ingot(x, y, c):
        d.polygon([(x, y + 120), (x + 60, y), (x + 300, y), (x + 360, y + 120)], fill=c)
        d.polygon([(x + 60, y), (x + 300, y), (x + 280, y + 30), (x + 80, y + 30)], fill=(255, 255, 255, 120))
    ingot(160, 600, W); ingot(500, 600, (255, 220, 140, 255)); ingot(330, 450, (250, 190, 150, 255))
    finish(im, g, 'metals-alloys')

    # Polymers: a chain of linked molecules
    im, g = base((255, 120, 170), (170, 40, 120)), layer(); d = ImageDraw.Draw(g)
    pts = [(170, 620), (300, 420), (450, 600), (580, 400), (730, 580), (860, 380)]
    d.line(pts, fill=W, width=34, joint='curve')
    for i, (x, y) in enumerate(pts):
        r = 62 if i % 2 == 0 else 48
        d.ellipse([x - r, y - r, x + r, y + r], fill=W if i % 2 == 0 else (255, 220, 235, 255))
    finish(im, g, 'polymers')

    # Papers & boards: a folded sheet and corrugated card
    im, g = base((240, 200, 140), (180, 120, 60)), layer(); d = ImageDraw.Draw(g)
    d.polygon([(250, 230), (640, 230), (774, 364), (774, 620), (250, 620)], fill=W)
    d.polygon([(640, 230), (774, 364), (640, 364)], fill=(230, 210, 180, 255))
    for i in range(4): d.line([(310, 320 + i * 70), (600, 320 + i * 70)], fill=(200, 170, 120, 255), width=16)
    d.rectangle([200, 700, 824, 790], fill=W)
    wave = [(200 + i * 12, 745 + 34 * math.sin(i * 0.5)) for i in range(53)]
    d.line(wave, fill=(200, 150, 90, 255), width=14)
    finish(im, g, 'papers-boards')

    # Textiles: woven threads with a needle
    im, g = base((150, 120, 230), (230, 90, 150)), layer(); d = ImageDraw.Draw(g)
    for i in range(5):
        y = 300 + i * 100; d.rounded_rectangle([220, y, 804, y + 54], 27, fill=W)
    for j in range(5):
        x = 260 + j * 120
        for i in range(5):
            if (i + j) % 2 == 0:
                d.rounded_rectangle([x, 280 + i * 100, x + 54, 374 + i * 100], 20, fill=(255, 210, 240, 255))
    d.line([(700, 200), (880, 140)], fill=W, width=18); d.ellipse([860, 120, 900, 160], outline=W, width=8)
    finish(im, g, 'textiles')

    # Smart, modern & composite: carbon-fibre hexagons with a spark
    im, g = base((60, 70, 90), (20, 25, 35)), layer(); d = ImageDraw.Draw(g)
    def hexa(cx, cy, r, c):
        d.polygon([(cx + r * math.cos(a), cy + r * math.sin(a)) for a in [i * math.pi / 3 + math.pi / 6 for i in range(6)]], fill=c)
    for (cx, cy, c) in ((380, 460, W), (560, 360, (120, 220, 255, 255)), (560, 560, (200, 200, 210, 255)), (740, 460, (120, 255, 200, 255)), (380, 660, (200, 200, 210, 255))):
        hexa(cx, cy, 104, c)
    d.polygon([(760, 150), (790, 240), (880, 270), (790, 300), (760, 390), (730, 300), (640, 270), (730, 240)], fill=(255, 230, 120, 255))
    finish(im, g, 'smart-modern-composite')

    # GCSE NEA practice: sketchbook with a pencil
    im, g = base((240, 225, 190), (170, 140, 90)), layer(); d = ImageDraw.Draw(g)
    d.rounded_rectangle([180, 260, 844, 760], 26, fill=(250, 245, 232, 255))
    for x in range(220, 820, 60): d.ellipse([x, 236, x + 28, 284], outline=(60, 60, 64, 255), width=10)
    d.line([(260, 640), (360, 470), (470, 580), (600, 400)], fill=(60, 60, 64, 255), width=16)
    d.polygon([(560, 820), (860, 520), (920, 580), (620, 880)], fill=(255, 190, 60, 255))
    d.polygon([(560, 820), (620, 880), (520, 900)], fill=(240, 210, 170, 255)); d.polygon([(520, 900), (545, 875), (550, 893)], fill=(50, 50, 50, 255))
    finish(im, g, 'nea-practice')

    # A level NEA: drafting set square and compass on a grid
    im, g = base((40, 70, 110), (15, 25, 45)), layer(); d = ImageDraw.Draw(g)
    for k in range(160, 900, 80):
        d.line([(k, 140), (k, 880)], fill=(255, 255, 255, 40), width=3); d.line([(140, k), (880, k)], fill=(255, 255, 255, 40), width=3)
    d.polygon([(200, 820), (200, 300), (720, 820)], fill=(255, 255, 255, 230)); d.polygon([(290, 730), (290, 520), (500, 730)], fill=(30, 50, 80, 255))
    d.line([(700, 200), (600, 640)], fill=(255, 150, 120, 255), width=24); d.line([(700, 200), (830, 620)], fill=(255, 150, 120, 255), width=24)
    d.ellipse([672, 172, 728, 228], fill=W)
    finish(im, g, 'nea-alevel')

    # Woods & timbers: a log end with growth rings and a leaf
    im, g = base((150, 200, 90), (60, 120, 50)), layer(); d = ImageDraw.Draw(g)
    d.ellipse([200, 260, 760, 820], fill=(214, 160, 100, 255))
    for k, c in enumerate([(236, 190, 130, 255), (214, 160, 100, 255), (236, 190, 130, 255), (214, 160, 100, 255), (236, 190, 130, 255)]):
        r = 230 - k * 44; d.ellipse([480 - r, 540 - r, 480 + r, 540 + r], outline=(150, 100, 55, 255), width=12)
    d.ellipse([200, 260, 760, 820], outline=W, width=26)
    d.line([(480, 540), (600, 380)], fill=(120, 75, 40, 255), width=14)
    d.ellipse([650, 170, 870, 330], fill=W); d.line([(680, 300), (840, 200)], fill=(80, 150, 70, 255), width=10)
    finish(im, g, 'woods-and-timbers')

    # KS3 electronics: a glowing bulb with a lightning bolt
    im, g = base((255, 200, 70), (240, 120, 30)), layer(); d = ImageDraw.Draw(g)
    d.ellipse([290, 180, 734, 624], fill=W)
    d.rounded_rectangle([400, 600, 624, 700], 20, fill=(240, 240, 245, 255))
    for y in (712, 760): d.rounded_rectangle([410, y, 614, y + 34], 14, fill=W)
    d.polygon([(540, 240), (420, 440), (510, 440), (470, 590), (610, 370), (520, 370), (580, 240)], fill=(255, 170, 40, 255))
    for a in range(0, 360, 45):
        if 100 < a < 260: continue
        x, y = 512 + 300 * math.cos(math.radians(a - 90)), 400 + 300 * math.sin(math.radians(a - 90))
        x2, y2 = 512 + 370 * math.cos(math.radians(a - 90)), 400 + 370 * math.sin(math.radians(a - 90))
        d.line([(x, y), (x2, y2)], fill=W, width=26)
    finish(im, g, 'ks3-electronics')


if __name__ == '__main__':
    icons(); print('icons written to', OUT)
