import { lexElement, parseElement } from "./lexer.js";

export function handleKeydown(event, composition, cursorIndexRef, updateAndRender) {
  const paragraph = composition.paragraphs[0];

  if (event.key === "ArrowLeft") {
    cursorIndexRef.value = Math.max(0, cursorIndexRef.value - 1);
    event.preventDefault();
  } else if (event.key === "ArrowRight") {
    cursorIndexRef.value = Math.min(paragraph.children.length, cursorIndexRef.value + 1);
    event.preventDefault();
  } else if (event.key === "Backspace") {
    if (cursorIndexRef.value > 0) {
      paragraph.children.splice(cursorIndexRef.value - 1, 1);
      cursorIndexRef.value--;
      event.preventDefault();
    }
  } else {
    insertCharacter(event.key, composition, cursorIndexRef);
  }

  updateAndRender();
}

export function handleClick(event, composition, cursorIndexRef, updateAndRender) {
  const canvas = event.currentTarget;
  const canvasRect = canvas.getBoundingClientRect();
  const clickX = event.clientX - canvasRect.left;

  const ctx = canvas.getContext("2d");
  ctx.font = '20px sans-serif';

  const paragraph = composition.paragraphs[0];
  let x = 10;
  cursorIndexRef.value = 0;

  for (let i = 0; i < paragraph.children.length; i++) {
    const el = paragraph.children[i];
    const label = el.pitch || el.value || "?";
    const width = ctx.measureText(label).width + 4;

    if (clickX < x + width / 2) break;

    x += width;
    cursorIndexRef.value++;
  }

  canvas.focus();
  updateAndRender();
}

function insertCharacter(char, composition, cursorIndexRef) {
  const token = lexElement(char, cursorIndexRef.value);
  const element = parseElement(token);
  if (!element) return;

  const paragraph = composition.paragraphs[0];
  paragraph.children.splice(cursorIndexRef.value, 0, element);
  cursorIndexRef.value++;
}
