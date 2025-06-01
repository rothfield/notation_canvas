import { lexElement, parseElement } from "../lexer.js";

export function handleKeydown(event, composition, cursorIndexRef, updateAndRender) {
  console.log(`[handleKeydown] key=${event.key}`);
  const paragraph = composition.paragraphs[0];

  switch (event.key) {
    case "ArrowLeft":
      event.preventDefault();
      handleArrowLeft(cursorIndexRef);
      break;

    case "ArrowRight":
      event.preventDefault();
      handleArrowRight(paragraph, cursorIndexRef);
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
      insertCharacter(event.key, paragraph, cursorIndexRef);
  }

  updateAndRender();
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

function insertCharacter(char, paragraph, cursorIndexRef) {
  const token = lexElement(char, cursorIndexRef.value);
  const element = parseElement(token);
  if (!element) return;

  paragraph.children.splice(cursorIndexRef.value, 0, element);
  cursorIndexRef.value++;
}
