import { composition } from "../state.js";

export function handleClick(event, composition, updateAndRender) {
  const canvas = event.currentTarget;
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const tokens = composition.paragraphs[0].children;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (x < token.x + token.width / 2) {
      composition.cursorIndex = i;
      updateAndRender();
      return;
    }
  }

  composition.cursorIndex = tokens.length;
  updateAndRender();
}