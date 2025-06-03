# Canvas Rendering Architecture

This folder contains the rendering logic for visualizing musical notation on a `<canvas>` element. The architecture is modular and organized by responsibility.

## Folder Structure

```
canvas/
├── index.js          # Entry point: sets up canvas and delegates to drawComposition
├── composition.js    # Coordinates layout: loops over tokens and calls pitch drawing
├── pitch.js          # Draws token glyphs, handles bounding boxes and slurs
├── octave.js         # Renders octave dots above/below notes
```

---

## Responsibilities

### `index.js`
- Exports `render(canvas, composition)`
- Clears the canvas and initiates rendering
- Delegates to `drawComposition()`

### `composition.js`
- Iterates over all tokens in a line
- Calculates initial offsets (`x`, `y`)
- Calls `drawToken()` for each token
- Handles cursor-at-end rendering

### `pitch.js`
- Draws each individual token (glyph)
- Highlights selected tokens
- Computes and stores token bounding boxes (`token.bbox`)
- Delegates to `octave.draw()` for octave dots

### `octave.js`
- Handles drawing of octave dots (`•`) for:
  - `octave === 1` → above the pitch
  - `octave === -1` → below the pitch
- Future: can support stacked dots or additional octaves

---

## Conventions

- All rendering is done relative to a vertical `yOffset`, horizontally advancing `x` as tokens are drawn
- `bbox` (bounding box) is stored on each token for later use (e.g., slurs, selection)
- `octave.js` exposes a single `draw(ctx, token, centerX, yOffset)` function
- Each module only owns a focused part of the rendering logic

---

## Example Usage

```js
import { render } from "./canvas/index.js";

render(canvasElement, compositionData);
```

---

## Future Growth

This structure scales well:
- Additional modules (e.g. `mordent.js`, `lyrics.js`) can follow the same pattern
- If `octave.js` or `pitch.js` becomes large, it can be split into submodules (e.g. `octave/draw.js`, `octave/layout.js`)
