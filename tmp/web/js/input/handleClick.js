export function handleClick(event, composition, cursorIndexRef, updateAndRender) {
  console.log("[handleClick] event triggered");
  logClickContext(event);
  const canvas = event.currentTarget;
  const index = getCursorIndexFromClick(event, composition, canvas);
  cursorIndexRef.value = index;
  canvas.focus();
  updateAndRender();
}

function getCursorIndexFromClick(event, composition, canvas) {
  const canvasRect = canvas.getBoundingClientRect();
  const clickX = event.clientX - canvasRect.left;
  const ctx = canvas.getContext("2d");
  ctx.font = '20px sans-serif';
  const paragraph = composition.paragraphs[0];
  let x = 10;
  let index = 0;
  for (let i = 0; i < paragraph.children.length; i++) {
    const el = paragraph.children[i];
    const label = el.pitch || el.value || "?";
    const width = ctx.measureText(label).width + 4;
    if (clickX < x + width / 2) break;
    x += width;
    index++;
  }
  return index;
}

function logClickContext(event) {
  console.log("Canvas clicked at", event.clientX, event.clientY);
}
