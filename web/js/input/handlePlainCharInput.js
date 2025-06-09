import { lexOneToken } from "../lexer/lexer.js";

/**
 * Handle plain character input and update composition in-place.
 * @param {string} char
 * @param {Object} composition
 * @param {string} notationKind
 * @returns {boolean} true if input caused a change
 */
export function handlePlainCharInput(char, composition, notationKind) {
  const line = composition.lines?.[0];
  if (!line) return false;

  const tokens = line.tokens || [];
  const index = composition.cursorIndex ?? 0;

  if (index > 0) {
    const prev = tokens[index - 1];
    if (prev?.text) {
      const combined = prev.text + char;
      const merged = lexOneToken(combined, notationKind);
      console.log("lexOneToken combined, returned", combined, merged);
      if (merged) {
        tokens.splice(index - 1, 1, merged);
        composition.cursorIndex = index;
        composition.selection.start = index;
        composition.selection.end = index;
        return true;
      }
    }
  }

  console.log("before lexOneToken");
  const newEl = lexOneToken(char, notationKind);
  if (newEl) {
    tokens.splice(index, 0, newEl);
    composition.cursorIndex = index + 1;
    composition.selection.start = index + 1;
    composition.selection.end = index + 1;
    return true;
  }

  return false;
}

