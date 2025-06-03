import { parseTokensToParagraph } from "./parseTokensToParagraph.js";
import { composition } from "./state.js";
import { blink } from "./state.js";
import { render } from "./canvas/index.js";
import { handleClick } from "./input/handleClick.js";
import { setupMouseSelection } from "./input/setupMouseSelection.js";
import { loadComposition } from "./io.js";
import { wrapSelectionWithTokens, applyToSelectedPitches, getSelectedTokens, setOctave } from "./utils/composition_utils.js";
import { lexElement, parseElement } from "./lexer.js";

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

  
function updateAndRender() {
 // composition.lines[0] = 
//  parseTokensToParagraph(composition.lines[0].tokens)   //  ***NEW***
  render(canvas, composition);
  output.textContent = JSON.stringify(composition, null, 2);
}


  document.addEventListener("keydown", (event) => {
    console.log("keydown eventlistener. event=",event);
    const paragraph = composition.lines?.[0];
    const tokens = paragraph?.tokens || [];

    // Ensure selection is initialized
    if (!composition.selection) {
      composition.selection = { start: 0, end: 0 };
    }

    // --- ALT COMMANDS ---
    if (event.altKey && event.shiftKey) {
      switch (event.key.toLowerCase()) {
        case "u":
          getSelectedTokens(composition)
            .filter(t => t.type === "note")
            .forEach(setOctave(1));
          updateAndRender();
          event.preventDefault();
          return;

        case "l":   //L  
          console.log("***alt-L case")
          getSelectedTokens(composition)
            .filter(t => t.type === "note")
            .forEach(setOctave(-1));
          updateAndRender();
          event.preventDefault();
          return;

        case "0":
          getSelectedTokens(composition)
            .filter(t => t.type === "note")
            .forEach(setOctave(null));
          updateAndRender();
          event.preventDefault();
          return;
      }
    }
    if (event.key === "ArrowRight") {
      handleArrowKey(event, composition, "right", updateAndRender);
      updateAndRender()
      return
    }
    else if (event.key === "ArrowLeft") {
      handleArrowKey(event, composition, "left", updateAndRender);
      updateAndRender()
      return
    }
    // --- ARROW KEYS ---
    if (event.key === "zArrowLeft") {
      event.preventDefault();
      composition.cursorIndex = Math.max(0, composition.cursorIndex - 1);
      composition.selection.start = composition.cursorIndex;
      composition.selection.end = composition.cursorIndex;
      updateAndRender();
      return;
    }

    if (event.key === "zArrowRight") {
      event.preventDefault();
      composition.cursorIndex = Math.min(tokens.length, composition.cursorIndex + 1);
      composition.selection.start = composition.cursorIndex;
      composition.selection.end = composition.cursorIndex;
      updateAndRender();
      return;
    }

    // --- BACKSPACE ---
    if (event.key === "Backspace") {
      event.preventDefault();
      if (composition.cursorIndex > 0) {
        composition.tokens.splice(composition.cursorIndex - 1, 1);
        composition.cursorIndex--;
        composition.selection.start = composition.cursorIndex;
        composition.selection.end = composition.cursorIndex;
      }
      updateAndRender();
      return;
    }
    if (event.code === "Space") {
      event.preventDefault();
    }

    // Filter out standalone modifier keys
const ignoredKeys = ["Alt", "Meta", "Control", "Shift", "CapsLock", "Escape"];
if (ignoredKeys.includes(event.key)) {
  console.log("Ignoring modifier key:", event.key);
  return;
}

    // --- CHARACTER INSERTION ---
    //
    const token = parseElement(lexElement(event.key));
    if (token) {
      composition.lines[0].tokens.splice(composition.cursorIndex, 0, token);
      composition.cursorIndex++;
      composition.selection.start = composition.cursorIndex;
      composition.selection.end = composition.cursorIndex;
      updateAndRender();
    }
  });




  canvas.addEventListener("mousedown", (event) =>
    handleClick(event, composition, updateAndRender)
  );

  setupMouseSelection(
    canvas,
    composition,
    { value: composition.cursorIndex },
    composition.selection,
    updateAndRender
  );


  canvas.setAttribute("tabindex", "0");
  canvas.focus();

  updateAndRender();




  document.getElementById("octave-lower").addEventListener("click", () => {
    applyToSelectedPitches(composition, t => t.octave = -1);
    canvas.focus();
    updateAndRender();
  })

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
    const tokBegin= { type: "leftSlur" } 
    const tokEnd= { type: "rightSlur" }
    wrapSelectionWithTokens(composition, tokBegin, tokEnd)
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


export function handleArrowKey(event, composition, updateAndRender) {
  const paragraph = composition.lines[0];
  const { key, shiftKey } = event;
  let { cursorIndex, selection } = composition;

  if (key !== "ArrowLeft" && key !== "ArrowRight") return false;

  // Move cursor
  if (key === "ArrowLeft" && cursorIndex > 0) {
    cursorIndex--;
  } else if (key === "ArrowRight" && cursorIndex < paragraph.tokens.length) {
    cursorIndex++;
  }

  // Update selection
  if (shiftKey) {
    if (cursorIndex < selection.start) {
      selection.start = cursorIndex;
    } else {
      selection.end = cursorIndex;
    }
  } else {
    selection.start = selection.end = cursorIndex;
  }

  composition.cursorIndex = cursorIndex;
  updateAndRender();
  event.preventDefault();
  return true;
}

