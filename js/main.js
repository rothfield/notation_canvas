import { composition } from "./state.js";
import { renderComposition } from "./canvas_renderer.js";
import { handleClick } from "./input/handleClick.js";
import { handleKeydown } from "./input/handleKeydown.js";
import { loadComposition } from "./io.js";

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas");
  const output = document.getElementById("data-model");

  if (!canvas || !output) {
    console.error("Canvas or output element not found.");
    return;
  }

  function updateAndRender() {
    console.log("updateAndRender called");
    renderComposition(canvas, composition);
    output.textContent = JSON.stringify(composition, null, 2);
  }

  canvas.addEventListener("mousedown", (event) =>
    handleClick(event, composition, updateAndRender)
  );

  canvas.addEventListener("keydown", (event) =>
    handleKeydown(event, composition, updateAndRender)
  );

  canvas.setAttribute("tabindex", "0");
  canvas.focus();

  updateAndRender();
});
