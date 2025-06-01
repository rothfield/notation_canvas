import { drawComposition } from "./canvas_renderer.js";
import { saveCompositionDebounced } from "./io.js";
import { composition, cursorIndexRef } from "./state.js";
import { handleKeydown, handleClick } from "./editor_input.js";

function updateAndRender() {
  saveCompositionDebounced(composition);
  renderComposition(composition);
  updateParseTree(composition);
}

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

  drawComposition(ctx, tokens, cursorIndexRef.value);
}

function updateParseTree(comp) {
  const out = document.getElementById("output-content");
  if (out) {
    out.textContent = JSON.stringify(comp, null, 2);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("notation-canvas");
  canvas.setAttribute("tabindex", "0");
  canvas.focus();

  canvas.addEventListener("keydown", e =>
    handleKeydown(e, composition, cursorIndexRef, updateAndRender)
  );
  canvas.addEventListener("click", e =>
    handleClick(e, composition, cursorIndexRef, updateAndRender)
  );

  updateAndRender();
});
