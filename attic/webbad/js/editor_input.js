import { getTokenIndexAt } from './canvas_renderer.js';
import { updateAndRender } from './main.js';

let isSelecting = false;
export let selectionStartIndex = null;
export let selectionEndIndex = null;
export let cursorIndex = 0;

export function handleMouseDown(event, canvas, tokens) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const tokenIndex = getTokenIndexAt(x, y);
  if (tokenIndex !== null) {
    cursorIndex = tokenIndex;
    selectionStartIndex = tokenIndex;
    selectionEndIndex = tokenIndex;
  }

  isSelecting = true;
  updateAndRender();
}

export function handleMouseMove(event, canvas) {
  if (!isSelecting) return;

  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const tokenIndex = getTokenIndexAt(x, y);
  if (tokenIndex !== null) {
    selectionEndIndex = tokenIndex;
    updateAndRender();
  }
}

export function handleMouseUp() {
  isSelecting = false;
}
