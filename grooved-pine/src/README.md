# Grooved Pine booklet source

`booklet-template.html` is the editable source. `/*LIBS*/` is replaced with jsPDF 2.5.2 (`jspdf.umd.min.js`) and html2canvas 1.4.1 to make one self-contained file, which goes to `../ipad/index.html` (plus the manifest/icon links and service-worker registration). Bump the cache name in `../ipad/sw.js` when the page changes.
