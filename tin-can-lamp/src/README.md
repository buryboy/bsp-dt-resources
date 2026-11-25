# Tin can lamp workbook source

`workbook-template.html` is the editable source (engine shared with `grooved-pine/src`). `/*LIBS*/` is replaced with jsPDF 2.5.2 and html2canvas 1.4.1 to make one self-contained file. The live `../ipad/index.html` also carries the manifest/icon links, the service-worker line and book-kit/updater.js, all placed before the LAST `</body>` (the bundled libraries contain that tag too). Bump the cache name in `../ipad/sw.js` when the page changes.
