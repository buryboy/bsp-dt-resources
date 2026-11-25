# Tin can lamp workbook source

`workbook-template.html` is the editable source (engine shared with `grooved-pine/src`). `/*LIBS*/` is replaced with html2canvas 1.4.1 (the Save buttons make JPEG screenshots, one per page, not a PDF) to make one self-contained file. The live `../ipad/index.html` also carries the manifest/icon links, the service-worker line and book-kit/updater.js, all placed before the LAST `</body>` (the bundled libraries contain that tag too). Bump the cache name in `../ipad/sw.js` when the page changes.
