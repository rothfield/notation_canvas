import { lexElement, parseElement } from "./lexer.js";

export function handleClick(event, composition, updateAndRender) {
  console.log("handleClick")
  const canvas = event.currentTarget;
  const canvasRect = canvas.getBoundingClientRect();
  const clickX = event.clientX - canvasRect.left;

  const ctx = canvas.getContext("2d");
  ctx.font = '20px sans-serif'; // Optionally fetch dynamically if you changed this

  const paragraph = composition.paragraphs[0];
  let x = 10;
  let index = 0;

  for (let i = 0; i < paragraph.children.length; i++) {

    const el = paragraph.children[i];
    const label = el.pitch || el.value || "?";
    const width = ctx.measureText(label).width;
    cursorIndex=index;
    console.log("i=",i)
    if (clickX < x + width / 2) break;

    x += width;
    index++;
  }

  // 🔥 Sync cursor and selection
//  composition.cursorIndex = index;
  composition.cursorIndex = cursorIndex;
  composition.selection.start = index;
  composition.selection.end = index;

  canvas.focus();
  updateAndRender();
}

