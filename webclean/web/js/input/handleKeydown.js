
import { lexElement, parseElement } from "../lexer.js";
import { cursorIndexRef, selectionRef } from "../state.js";

export function handleKeydown(event, composition, cursorIndexRef, updateAndRender) {
  const paragraph = composition.paragraphs[0];
  console.log(`[handleKeydown] key=${event.key}`);

  if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
    if (hasSelection(selectionRef)) {
      overwriteSelection(paragraph, cursorIndexRef, selectionRef);
    }
    const token = lexElement(event.key, cursorIndexRef.value);
    const element = parseElement(token);
    if (!element) return;
    paragraph.children.splice(cursorIndexRef.value, 0, element);
    cursorIndexRef.value++;
    event.preventDefault();
    updateAndRender();
    return;
  }

  switch (event.key) {
    case "ArrowLeft":
      event.preventDefault();
      if (event.shiftKey) {
        extendSelection(cursorIndexRef, selectionRef, -1, paragraph.children.length);
      } else {
        clearSelection(selectionRef);
        cursorIndexRef.value = Math.max(0, cursorIndexRef.value - 1);
      }
      break;

    case "ArrowRight":
      event.preventDefault();
      if (event.shiftKey) {
        extendSelection(cursorIndexRef, selectionRef, +1, paragraph.children.length);
      } else {
        clearSelection(selectionRef);
        cursorIndexRef.value = Math.min(paragraph.children.length, cursorIndexRef.value + 1);
      }
      break;

    case "Backspace":
      event.preventDefault();
      handleBackspace(paragraph, cursorIndexRef);
      break;

    case "Enter":
      event.preventDefault();
      handleEnterKey(composition, cursorIndexRef);
      break;

    case "Delete":
      event.preventDefault();
      handleDeleteKey(paragraph, cursorIndexRef);
      break;

    default:
      // fallback
      break;
  }

  updateAndRender();
}

function hasSelection(selectionRef) {
  return selectionRef.start !== null && selectionRef.end !== null;
}

function overwriteSelection(paragraph, cursorIndexRef, selectionRef) {
  const selStart = Math.min(selectionRef.start, selectionRef.end);
  const selEnd = Math.max(selectionRef.start, selectionRef.end);
  paragraph.tokens.splice(selStart, selEnd - selStart + 1);
  cursorIndexRef.value = selStart;
  selectionRef.start = null;
  selectionRef.end = null;
}

function handleArrowLeft(cursorIndexRef) {
  cursorIndexRef.value = Math.max(0, cursorIndexRef.value - 1);
}

function handleArrowRight(paragraph, cursorIndexRef) {
  cursorIndexRef.value = Math.min(paragraph.children.length, cursorIndexRef.value + 1);
}

function handleBackspace(paragraph, cursorIndexRef) {
  console.log("Backspace key pressed");
  if (cursorIndexRef.value > 0) {
    paragraph.children.splice(cursorIndexRef.value - 1, 1);
    cursorIndexRef.value--;
  }
}

function handleEnterKey(composition, cursorIndexRef) {
  console.log("Enter key pressed");
}

function handleDeleteKey(paragraph, cursorIndexRef) {
  console.log("Delete key pressed");
}

function extendSelection(cursorRef, selRef, delta, maxLength) {
  if (selRef.start === null) {
    selRef.start = cursorRef.value;
  }
  cursorRef.value = Math.max(0, Math.min(cursorRef.value + delta, maxLength));
  selRef.end = cursorRef.value;
}

function clearSelection(selRef) {
  selRef.start = null;
  selRef.end = null;
}
