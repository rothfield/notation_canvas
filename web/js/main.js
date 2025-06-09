import { parseLineToLineWithBeats } from "./parseLineToLineWithBeats.js";
import * as state from "./state.js";
import { composition } from "./state.js";
import { blink } from "./state.js";
import { setupMouseEvents } from './input/mouse/index.js';
import { handleClick } from "./input/handleClick.js";
import { handleKeydown } from "./input/handleKeydown.js";
import { loadComposition } from "./io.js";
import { wrapSelectionWithTokens, applyToSelectedPitches } from "./utils/composition_utils.js";
import * as compositionRenderer from "./canvas/composition-renderer.js";

function enableCanvasCssHotReload(intervalMs = 500) {
  console.log("[DEV] Enabling canvas.css auto-reload");

  setInterval(() => {
    const oldLink = document.querySelector('link[href*="canvas.css"]');
    if (!oldLink) return;

    const newLink = oldLink.cloneNode();
    newLink.href = `css/canvas.css?v=${Date.now()}`;
    oldLink.replaceWith(newLink);
  }, intervalMs);
}

document.addEventListener("DOMContentLoaded", () => {
  if (window.location.search.includes("dev")) {
    enableCanvasCssHotReload();
  }

  const canvas = document.getElementById("canvas");
  const output = document.getElementById("data-model");

  if (!canvas || !output) {
    console.error("Canvas or output element not found.");
    return;
  }

  const context = {
    canvas,
    composition,
    selection: composition.selection,
    updateAndRender,
    isDragging: false,
    dragStartIndex: null,
    dragStartX: null
  };

  function updateAndRender() {
    compositionRenderer.render(canvas, composition);
    output.textContent = JSON.stringify(composition, null, 2);
  }

  document.addEventListener("keydown", (event) =>
    handleKeydown(event, composition, updateAndRender)
  );

  canvas.addEventListener("mousedown", (event) =>
    handleClick(event, composition, updateAndRender)
  );

  setupMouseEvents(canvas, context);

  canvas.setAttribute("tabindex", "0");
  canvas.focus();

  updateAndRender();

  document.getElementById("octave-lower").addEventListener("click", () => {
    applyToSelectedPitches(composition, t => t.octave = -1);
    canvas.focus();
    updateAndRender();
  });

  document.getElementById("octave-middle").addEventListener("click", () => {
    applyToSelectedPitches(composition, t => t.octave = null);
    canvas.focus();
    updateAndRender();
  });

  document.getElementById("octave-upper").addEventListener("click", () => {
    applyToSelectedPitches(composition, t => t.octave = 1);
    canvas.focus();
    updateAndRender();
  });

  document.getElementById("btn-slur").addEventListener("click", () => {
    const tokBegin = { type: "leftSlur" };
    const tokEnd = { type: "rightSlur" };
    wrapSelectionWithTokens(composition, tokBegin, tokEnd);
    canvas.focus();
    updateAndRender();
  });

  setInterval(() => {
    blink.visible = !blink.visible;
    if (blink.enabled) {
      updateAndRender();
    }
  }, 500);
});

