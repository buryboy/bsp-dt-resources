# Drawing to SVG

Photo of a black and red pen drawing to a two-colour SVG, entirely in the browser (no upload, no AI).
It evens out the lighting and sorts pixels into black, red or paper. Black pen lines are thinned to their centre line and saved as hairline strokes with no fill (cut lines); red is traced as filled shapes (engrave) with
[imagetracer.js](https://github.com/jankovicsandras/imagetracerjs) v1.2.6 (public domain), which is pasted into `ipad/index.html`.
