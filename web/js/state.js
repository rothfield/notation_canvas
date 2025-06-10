import { createComposition } from "./models/composition.js";

export const composition = createComposition();
export const blink = { visible: true };

export function startBlinking(redrawFn) {
  setInterval(() => {
    blink.visible = !blink.visible;
    if (typeof redrawFn === "function") {
      redrawFn();  // trigger re-render
    }
  }, 500);
}
