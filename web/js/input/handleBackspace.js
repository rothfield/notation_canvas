
export function handleBackspace(composition, composition.cursorIndex, composition.selection) {
  const tokens = composition.lines[0].tokens;
  const index = composition.cursorIndex;

  if (composition.selection.start !== null && composition.selection.end !== null) {
    const selStart = Math.min(composition.selection.start, composition.selection.end);
    const selEnd = Math.max(composition.selection.start, composition.selection.end);
    tokens.splice(selStart, selEnd - selStart + 1);
    composition.cursorIndex = selStart;
    composition.selection.start = composition.selection.end = null;
  } else if (index > 0) {
    tokens.splice(index - 1, 1);
    composition.cursorIndex -= 1;
  }
}
