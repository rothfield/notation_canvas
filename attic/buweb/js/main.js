import { drawComposition } from "./canvas_renderer.js";
import { lexElement, TokenType } from "./lexer.js";
import { saveCompositionDebounced, loadComposition } from "./io.js";

let composition = loadComposition();
let cursorIndex = 0;

function renderComposition(comp) {
  const canvas = document.getElementById("notation-canvas");
  const ctx = canvas.getContext("2d");

  const paragraph = comp.paragraphs[0];
  const tokens = paragraph.children.map(el => {
    if (el.type === "note") return { value: el.pitch };
    if (el.type === "space") return { value: " " };
    if (el.type === "barline") return { value: "|" };
    if (el.type === "dash") return { value: "-" };
    return { value: "?" };
  });

  drawComposition(ctx, tokens, cursorIndex);
}

function updateParseTree(comp) {
  const out = document.getElementById("output-content");
  if (out) {
    out.textContent = JSON.stringify(comp, null, 2);
  }
}

function updateAndRender() {
  saveCompositionDebounced(composition);
  renderComposition(composition);
  updateParseTree(composition);
}

function insertCharacter(char) {
  const token = lexElement(char, cursorIndex);
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
      return; // silently ignore unknown
  }

  paragraph.children.splice(cursorIndex, 0, element);
  cursorIndex++;
  updateAndRender();
}

function handleKeydown(event) {
  const paragraph = composition.paragraphs[0];

  if (event.key === "ArrowLeft") {
    cursorIndex = Math.max(0, cursorIndex - 1);
    event.preventDefault();
  } else if (event.key === "ArrowRight") {
    cursorIndex = Math.min(paragraph.children.length, cursorIndex + 1);
    event.preventDefault();
  } else if (event.key === "Backspace") {
    if (cursorIndex > 0) {
      paragraph.children.splice(cursorIndex - 1, 1);
      cursorIndex--;
      event.preventDefault();
    }
  } else {
    insertCharacter(event.key);
  }

  updateAndRender();
}

canvas.addEventListener("click", (event) => {
  const canvasRect = canvas.getBoundingClientRect();
  const clickX = event.clientX - canvasRect.left;

  // Compute new cursor index based on token spacing
  const ctx = canvas.getContext("2d");
  ctx.font = '20px sans-serif';

  const paragraph = composition.paragraphs[0];
  let x = 10;
  cursorIndex = 0;

  for (let i = 0; i < paragraph.children.length; i++) {
    const el = paragraph.children[i];
    const width = ctx.measureText(el.pitch || el.value || "?").width + 4;

    if (clickX < x + width / 2) {
      break;
    }

    x += width;
    cursorIndex++;
  }
canvas.focus();
  updateAndRender();
});

window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("notation-canvas");
  canvas.setAttribute("tabindex", "0");
  canvas.focus();
  canvas.addEventListener("keydown", handleKeydown);

  updateAndRender();
});

