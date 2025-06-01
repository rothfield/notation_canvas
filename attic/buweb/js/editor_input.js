import { lexElement, TokenType } from "./lexer.js";
import { updateAndRender, composition, cursorIndexRef } from "./state.js";

export function handleKeydown(event) {
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
    insertCharacter(event.key);
  }

  updateAndRender();
}

export function handleClick(event) {
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

function insertCharacter(char) {
  const token = lexElement(char, cursorIndexRef.value);
  const paragraph = composition.paragraphs[0];
  let element;

  switch (token.type) {
    case TokenType.Pitch:
      element = { type: "note", pitch: token.value };
      break;
    case TokenType.Space:
      element = { type: "space" };
      break;
    case TokenType.Dash:
      element = { type: "dash" };
      break;
    case TokenType.Barline:
      element = { type: "barline" };
      break;
    default:
      return;
  }

  paragraph.children.splice(cursorIndexRef.value, 0, element);
  cursorIndexRef.value++;
}

