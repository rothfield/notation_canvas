import { composition } from "../state.js";
import { lexElement, parseElement } from "../lexer.js";

export function handleKeydown(event, composition, updateAndRender) {
  console.log(`[handleKeydown] key=${event.key}`);
  const paragraph = composition.paragraphs[0];

  switch (event.key) {
    case "ArrowLeft":
      event.preventDefault();
      if (composition.cursorIndex > 0) composition.cursorIndex--;
      break;

    case "ArrowRight":
      event.preventDefault();
      if (composition.cursorIndex < paragraph.children.length) composition.cursorIndex++;
      break;

    case "Backspace":
      event.preventDefault();
      if (composition.cursorIndex > 0) {
        paragraph.children.splice(composition.cursorIndex - 1, 1);
        composition.cursorIndex--;
      }
      break;

    default:
      // Insert character at current cursor index
      const token = parseElement(lexElement(event.key));
      if (token) {
        paragraph.children.splice(composition.cursorIndex, 0, token);
        composition.cursorIndex++;
      }
  }

  updateAndRender();
}