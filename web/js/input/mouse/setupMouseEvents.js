import { handleDown } from './handleDown.js';
import { handleMove } from './handleMove.js';
import { handleUp } from './handleUp.js';

/**
 * Sets up mouse event listeners on a canvas.
 * 
 * @param {HTMLCanvasElement} canvas 
 * @param {object} context - Shared data, e.g., { composition, selection, updateAndRender }
 */
export function setupMouseEvents(canvas, context) {
  console.log("/web/js/input/mouse/setupMouseEvents")
  canvas.addEventListener('mousedown', (event) => handleDown(event, context));
  canvas.addEventListener('mousemove', (event) => handleMove(event, context));
  canvas.addEventListener('mouseup', (event) => handleUp(event, context));
}

