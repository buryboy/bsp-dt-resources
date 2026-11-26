
## Diagrams

`src/diagrams/` holds every drawing used by both revision apps. `00-kit.js` is the drawing kit (shapes, arrows,
hatching, one palette); the other files each define a group of diagrams as `DIAGRAMS[id] = { t, w, h, svg, parts }`,
or `stages` for a process shown step by step. The engine adds the numbered markers, so one drawing serves as a
labelled figure (`{ fig: id }`), a label-the-diagram activity (`{ label: id }`), a put-the-pictures-in-order
activity (`{ stages: id }`) and the model sketch for a draw-on-paper exam question (fifth item of an exam entry).
`src/booklets/zz-diagrams.js` (and the GCSE copy) says which page gets which diagram. All drawn in-house: no
third-party images.
