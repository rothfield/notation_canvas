import { lexElement, parseElement } from "./lexer.js";

export function handleKeydown(event, composition, composition.cursorIndex, updateAndRender) {
  const paragraph = composition.paragraphs[0];

  if (event.key === "ArrowLeft") {
    composition.cursorIndex = Math.max(0, composition.cursorIndex - 1);
    event.preventDefault();
  } else if (event.key === "ArrowRight") {
    composition.cursorIndex = Math.min(paragraph.children.length, composition.cursorIndex + 1);
    event.preventDefault();
  } else if (event.key === "Backspace") {
    if (composition.cursorIndex > 0) {
      paragraph.children.splice(composition.cursorIndex - 1, 1);
      composition.cursorIndex--;
      event.preventDefault();
    }
  } else {
    insertCharacter(event.key, composition, composition.cursorIndex);
  }

  updateAndRender();
}

export function handleClick(event, composition, composition.cursorIndex, updateAndRender) {
  const canvas = event.currentTarget;
  const canvasRect = canvas.getBoundingClientRect();
  const clickX = event.clientX - canvasRect.left;

  const ctx = canvas.getContext("2d");
  ctx.font = '20px sans-serif';

  const paragraph = composition.paragraphs[0];
  let x = 10;
  composition.cursorIndex = 0;

  for (let i = 0; i < paragraph.children.length; i++) {
    const el = paragraph.children[i];
    const label = el.pitch || el.value || "?";
    const width = ctx.measureText(label).width + 4;

    if (clickX < x + width / 2) break;

    x += width;
    composition.cursorIndex++;
  }

  canvas.focus();
  updateAndRender();
}

function insertCharacter(char, composition, composition.cursorIndex) {
  const token = lexElement(char, composition.cursorIndex);
  const element = parseElement(token);
  if (!element) return;

  const paragraph = composition.paragraphs[0];
  paragraph.children.splice(composition.cursorIndex, 0, element);
  composition.cursorIndex++;
}
