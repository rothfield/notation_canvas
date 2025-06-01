import { loadComposition } from "./io.js";

export let composition = loadComposition();

if (!composition.editor) {
  composition.editor = {
    cursorIndex: 0,
    selection: {
      start: null,
      end: null
    }
  };
}

export const cursorIndexRef = {
  get value() { return composition.editor.cursorIndex },
  set value(v) { composition.editor.cursorIndex = v }
};

export const selectionRef = composition.editor.selection;
