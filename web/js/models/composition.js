export function oldcreateComposition() {
  return {
    type: "composition",
    name: "fugue",
    composer: "bach",
    lines: [
      {
        type: "line",
        lineName: "1.",
        notation_kind: "letter",
        tokens: [] // editable token stream
        // no parse_tree here — computed on the fly for rendering
      }
    ],
    selection: { start: 0, end: 0 },
    cursorIndex: 0
  };
}

export function createComposition() {
  return {
  "type": "composition",
  "name": "fugue",
  "composer": "bach",
  "lines": [
    {
      "type": "line",
      "lineName": "1.",
      "notation_kind": "letter",
      "tokens": [
        {
          "type": "note",
          "pitch": "S",
          "octave": -1,
          "text": "S",
          "bbox": {
            "x": 20,
            "y": 94,
            "width": 11.5,
            "height": 17
          }
        },
        {
          "type": "note",
          "pitch": "g",
          "octave": -1,
          "text": "g",
          "bbox": {
            "x": 31.5,
            "y": 97,
            "width": 10.5,
            "height": 12
          }
        },
        {
          "type": "space",
          "text": " ",
          "bbox": {
            "x": 42,
            "y": 94,
            "width": 5.5,
            "height": 17
          }
        },
        {
          "type": "space",
          "text": " ",
          "bbox": {
            "x": 47.5,
            "y": 94,
            "width": 5.5,
            "height": 17
          }
        },
        {
          "type": "note",
          "pitch": "M",
          "octave": 1,
          "text": "M",
          "bbox": {
            "x": 53,
            "y": 94,
            "width": 15.5,
            "height": 17
          }
        },
        {
          "type": "note",
          "pitch": "P",
          "octave": 1,
          "text": "P",
          "bbox": {
            "x": 68.5,
            "y": 94,
            "width": 11.5,
            "height": 17
          }
        },
        {
          "type": "note",
          "pitch": "r",
          "octave": 1,
          "text": "r",
          "bbox": {
            "x": 80,
            "y": 97,
            "width": 7.5,
            "height": 14
          }
        },
        {
          "type": "dash",
          "text": "-",
          "bbox": {
            "x": 87.5,
            "y": 99,
            "width": 8.5,
            "height": 3
          }
        },
        {
          "type": "space",
          "text": " ",
          "bbox": {
            "x": 96,
            "y": 94,
            "width": 5.5,
            "height": 17
          }
        },
        {
          "type": "space",
          "text": " ",
          "bbox": {
            "x": 101.5,
            "y": 94,
            "width": 5.5,
            "height": 17
          }
        },
        {
          "type": "space",
          "text": " ",
          "bbox": {
            "x": 107,
            "y": 94,
            "width": 5.5,
            "height": 17
          }
        },
        {
          "type": "space",
          "text": " ",
          "bbox": {
            "x": 112.5,
            "y": 94,
            "width": 5.5,
            "height": 17
          }
        },
        {
          "type": "space",
          "text": " ",
          "bbox": {
            "x": 118,
            "y": 94,
            "width": 5.5,
            "height": 17
          }
        },
        {
          "type": "space",
          "text": " ",
          "bbox": {
            "x": 123.5,
            "y": 94,
            "width": 5.5,
            "height": 17
          }
        },
        {
          "type": "space",
          "text": " ",
          "bbox": {
            "x": 129,
            "y": 94,
            "width": 5.5,
            "height": 17
          }
        },
        {
          "type": "space",
          "text": " ",
          "bbox": {
            "x": 134.5,
            "y": 94,
            "width": 5.5,
            "height": 17
          }
        }
      ]
    }
  ],
  "selection": {
    "start": 0,
    "end": 7
  },
  "cursorIndex": 0
}
}
