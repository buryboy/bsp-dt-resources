# HEIC to JPEG

A one-page converter that runs entirely in the browser (no upload, no AI). Safari decodes HEIC itself; other
browsers fall back to `ipad/heic-to.js`, an unmodified copy of [heic-to](https://github.com/hoppergee/heic-to)
(libheif compiled to JavaScript, LGPL-3.0). To update it, replace that file with a newer `dist/iife/heic-to.js`.
