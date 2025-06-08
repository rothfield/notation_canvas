# Music Notation Parsing Project Notes

## Lexer

- The initial lexer is implemented using regular expressions (regex).
- Regex-based lexer handles multiple pitch systems:
  - Western (a–g)
  - Number (1–7 with accidentals like 2b, 4#)
  - Solfege (minor: d, r, m, f, s, l, t)
  - Solfege (Guido-style: D, R, M, f, S, L, T)
  - Sargam (S, r, R, g, G, m, M, P, d, D, n, N)
  - LilyPond (c, db, d, eb, ..., b)
- Enharmonic variants (##, bb) are allowed but not grouped by equivalence.
- Position tracking is included in lexer output (line, column).

## Parser

- Structure parsing (beats, slurs, annotations) occurs in a second phase.
- Lexer does not reconcile columns; this happens during parsing.
- Octave dots, mordents, lyrics, and talas are parsed and folded during a later annotation phase.

## Rendering

- Textual rendering is monospaced for the input editor.
- HTML rendering uses proportional fonts with aligned notes.
- Canvas rendering supports annotation dots, lyric alignment, and selection.

## LilyPond

- Conversion to LilyPond is planned.
- Notation mapping table constructed for correspondence with LilyPond syntax.
- LilyPond octave notation (C = c, C4 = c', etc.) is supported in export.

## Tables and Data

- Full pitch equivalence table constructed and exported (includes flats, sharps, double accidentals).
- Full Guidonian Gamut chart created and mapped to LilyPond.
- All data exported as CSV for external use.

## Notes

- Use the regex-based lexer as the canonical implementation.
- Guido’s hand and medieval gamut are used for historical reference and pitch labeling.