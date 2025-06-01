
export const composition = {
  paragraphs: [{
    id: "paragraph-1",
    children: [
      { type: "note", pitch: "S" },
      { type: "note", pitch: "r" },
      { type: "note", pitch: "R" },
      { type: "note", pitch: "g" },
      { type: "note", pitch: "G" }
    ]
  }]
};

export const cursorIndexRef = { value: 0 };
export const selectionRef = { start: null, end: null };