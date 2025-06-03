# Pure Layout vs Canvas Rendering

This document outlines a clean separation between **pure layout** logic and **impure canvas rendering**, which is useful in graphics and notation systems.

---

## 📌 Goal

Separate your code into:

- **Pure function:** `layoutComposition(composition)`
  - Computes token positions and bounding boxes
  - No DOM access, no canvas
  - Fully testable and reusable

- **Impure function:** `drawComposition(ctx, layout)`
  - Draws tokens on the canvas
  - Uses `ctx.fillText`, `ctx.measureText`, etc.

---

## ✅ layoutComposition(composition)

A pure function that:

- Accepts a `composition` object
- Computes `x`, `y`, and bounding box for each token
- Returns a new array of token layout objects
- Accepts a `measureWidth` callback for text width estimation

### Example signature

```js
function layoutComposition(composition, options = {
  measureWidth: (text) => text.length * 8  // default fallback
})
```

### Returns

```js
[
  {
    token: { type: 'note', text: 'S', ... },
    x: 20,
    y: 100,
    bbox: { x: 20, y: 85, width: 11, height: 17 }
  },
  ...
]
```

---

## ❌ Why drawing is not pure

Canvas rendering functions like:

```js
ctx.fillText(token.text, x, y);
```

… are **not pure** because they:
- Modify the DOM (canvas buffer)
- Depend on external state (fonts, transform, color)
- Produce no return value

---

## ✅ Suggested Flow

```js
const layout = layoutComposition(composition, {
  measureWidth: (text) => ctx.measureText(text).width
});

drawComposition(ctx, layout);
```

This structure:
- Makes layout logic testable in isolation
- Allows reuse in HTML/SVG/print
- Keeps drawing code minimal and focused

---

## 🔧 Optional Enhancements

- Add baseline metrics to options (ascent, descent)
- Cache widths of common glyphs
- Unit test `layoutComposition` with stub width calculators

---

## Benefits

| Feature          | layoutComposition | drawComposition |
|------------------|-------------------|-----------------|
| Pure             | ✅                | ❌              |
| Testable         | ✅                | ❌ (canvas needed) |
| Reusable         | ✅                | ❌              |
| Fast to refactor | ✅                | ❌              |

---

## Summary

Use this pattern to keep your codebase clean, modular, and testable:

- `layoutComposition()` — pure data transformation
- `drawComposition()` — impure side-effects (canvas only)

