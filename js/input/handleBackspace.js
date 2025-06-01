
export function handleBackspace(composition, composition.cursorIndex, composition.selection) {
  const children = composition.paragraphs[0].children;
  const index = composition.cursorIndex;

  if (composition.selection.start !== null && composition.selection.end !== null) {
    const selStart = Math.min(composition.selection.start, composition.selection.end);
    const selEnd = Math.max(composition.selection.start, composition.selection.end);
    children.splice(selStart, selEnd - selStart + 1);
    composition.cursorIndex = selStart;
    composition.selection.start = composition.selection.end = null;
  } else if (index > 0) {
    children.splice(index - 1, 1);
    composition.cursorIndex -= 1;
  }
}
