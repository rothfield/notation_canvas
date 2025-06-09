import { handlePlainCharInput } from "./handlePlainCharInput.js";
const notationKind = "sargam";

import { getSelectedTokens, setOctave } from "../utils/composition_utils.js";
import { lexOneToken } from "../lexer/lexer.js";
import { handleArrowKey } from "./handleArrowKey.js";
import { handleBackspace } from "./handleBackspace.js";

export function handleKeydown(event, composition, updateAndRender) {
  const line = composition.lines?.[0];
  const tokens = line?.tokens || [];

  if (!composition.selection) {
    composition.selection = { start: 0, end: 0 };
  }

  if (event.altKey && event.shiftKey) {
    const octaveChange = { u: 1, l: -1, "0": null }[event.key.toLowerCase()];
    if (octaveChange !== undefined) {
      getSelectedTokens(composition)
        .filter(t => t.type === "note")
        .forEach(setOctave(octaveChange));
      updateAndRender();
      event.preventDefault();
      return;
    }
  }

  if (["ArrowRight", "ArrowLeft"].includes(event.key)) {
    handleArrowKey(event, composition, updateAndRender);
    return;
  }

  if (event.key === "Backspace") {
    handleBackspace(composition, updateAndRender);
    event.preventDefault();
    return;
  }

  if (event.code === "Space") {
    event.preventDefault();
  }

  const ignoredKeys = ["Alt", "Meta", "Control", "Shift", "CapsLock", "Escape"];
  if (ignoredKeys.includes(event.key)) return;
   console.log("calling handlePlainCharInput with", event.key);
  if (handlePlainCharInput(event.key, composition, notationKind)) {
    updateAndRender();
    return;
  }
}

