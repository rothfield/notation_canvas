export function handleArrowKey(event, composition, updateAndRender) {
  const paragraph = composition.lines[0];
  const { key, shiftKey } = event;
  let { cursorIndex, selection } = composition;

  if (key === "ArrowLeft" && cursorIndex > 0) {
    cursorIndex--;
  } else if (key === "ArrowRight" && cursorIndex < paragraph.tokens.length) {
    cursorIndex++;
  } else {
    return false;
  }

  if (shiftKey) {
    if (cursorIndex < selection.start) {
      selection.start = cursorIndex;
    } else {
      selection.end = cursorIndex;
    }
  } else {
    selection.start = selection.end = cursorIndex;
  }

  composition.cursorIndex = cursorIndex;
  updateAndRender();
  event.preventDefault();
  return true;
}

