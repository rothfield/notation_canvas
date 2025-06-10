import { Notation } from "./notation.js";

export function createComposition() {
  return {
    type: "composition",
    notation: Notation.SARGAM,
    name: "fugue",
    composer: "bach",
    lines: [
      {
        type: "line",
        lineName: "1.",
        notation: "sargam",
        tokens: [
          {
            type: "note",
            pitch: "S",
            pitchCode: "1",
            octave: -1,
            text: "S",
            syllable: "Happy",
            notation: "sargam",
            bbox: {
              x: 20,
              y: 94,
              width: 11.5,
              height: 17,
            },
          },
        ],
      },
    ],
    selection: {
      start: 0,
      end: 7,
    },
    cursorIndex: 0,
  };
}

