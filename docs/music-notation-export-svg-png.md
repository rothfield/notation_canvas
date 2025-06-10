# Music Notation Export Strategy Summary

## Why `<canvas>` Was Chosen
- Fast, low-overhead rendering for interactive typing/editing
- Fine control via `ctx.measureText()` for accurate placement
- Simple repaint model: render everything from state per frame

## Limitations of Canvas
- Cannot export directly to SVG (only to raster PNG)
- Harder to integrate with publishing workflows (LaTeX, InDesign, etc.)
- Overlap issues: highlight and cursor may obscure other elements

## Fixes Implemented
1. **Syllables**
   - Aligned flush-left with note
   - Used `ctx.measureText("Mg")` to vertically align below note

2. **Highlight Box**
   - Enlarged to include syllables, octave dots, mordents

3. **Blinking Cursor**
   - Extended to match full vertical height of token
   - Rendered after highlight box

4. **Bounding Box (`token.bbox`)**
   - Now covers entire vertical range: pitch, octave, lyric, etc.

## Export Options

### PNG
- Use `canvas.toDataURL("image/png")`
- Good for screenshots or digital use
- ❌ Not scalable for print

### SVG
- Build a `toSVG(composition)` function
- Use `<text>`, `<circle>`, `<path>` elements
- Reuse layout from existing `token.bbox` data
- Serialize with `XMLSerializer` for download

## Recommendation
- ✅ Use `<canvas>` for editing
- ✅ Implement `toSVG()` for export
- Ideal hybrid approach for real-world publishing

