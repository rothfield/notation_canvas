// models/notation.js



// Central definition of notation kinds
export const Notation = {
  SARGAM: "sargam",
  NUMBER: "number",
  WESTERN: "western",
};

export const CANONICAL_NOTATION = Notation.NUMBER;

// Ordered list for dropdowns, menus, or cycling notation
export const NotationList = [
  Notation.SARGAM,
  Notation.NUMBER,
  Notation.WESTERN,
];

// Optional: reverse lookup if you switch to enums later
export const NotationName = {
  [Notation.SARGAM]: "sargam",
  [Notation.NUMBER]: "number",
  [Notation.WESTERN]: "western",
};

// Optional: readable labels for UI
export function getNotationLabel(kind) {
  return NotationName[kind] || kind;
}

