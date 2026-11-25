# Critical path analysis (Y13 revision) source

`workbook-template.html` is the editable source (Edexcel 9DT0 topic 12.2a). `build.py` inlines IBM Plex fonts,
jsPDF 2.5.2 (`jspdf.umd.min.js`) and html2canvas 1.4.1 (download both next to it with `npm pack`) to make one
self-contained file that can be sent through Showbie. The website copy in `../ipad/index.html` is that file plus the
manifest/icon links, service-worker registration and `book-kit/updater.js`. Bump the cache name in `../ipad/sw.js`
when the page changes. Answers are stored on the iPad (localStorage key `cpa-y13-v1`); nothing is sent anywhere.
