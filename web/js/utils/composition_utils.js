
export function apply_to_pitches(composition, fn, ...args) {
  const { selection, lines } = composition;
  if (!selection || selection.start == null || selection.end == null) return;

  const tokens = lines[0].tokens;
  const start = Math.min(selection.start, selection.end);
  const end = Math.max(selection.start, selection.end);

  for (let i = start; i <= end; i++) {
    const token = tokens[i];
    if (token.type === "pitch") {
      fn(token, ...args);
    }
  }
}
export function applyToSelectedPitches(composition, fn) {
  console.log("in applyToSelectedPitches")
  getSelectedTokens(composition)
    .filter(t => t.type === "note")
    .forEach(fn);
}

export const setOctave = value => token => {
  console.log("setOctave, value,token",value,token)
  token.octave = value;
};

export function getSelectedTokens(composition) {
  const tokens = composition.lines?.[0]?.tokens || [];
  console.log("getselection tokens=",tokens);
  const selection = composition.selection;
  if (!selection || selection.start == null || selection.end == null) return [];
  const start = Math.min(selection.start, selection.end);
  const end = Math.max(selection.start, selection.end);
  return tokens.slice(start, end); // corrected from end + 1
}


export function wrapSelectionWithTokens(composition, beginToken, endToken, options = {}) {
  const tokens = composition.lines[0].tokens;
  const { selection } = composition;
  if (!selection) return;

  let start = Math.min(selection.start, selection.end);
  let end = Math.max(selection.start, selection.end);

  // Expand end to include trailing annotations (like whitespace), stop at next musical token
  while (end < tokens.length && tokens[end].type === "Whitespace") {
    end++;
  }

  // Insert RightSlur AFTER the last selected token
  tokens.splice(end, 0, { ...endToken });

  // Insert LeftSlur BEFORE the first selected token
  tokens.splice(start, 0, { ...beginToken });

  // Cursor after the inserted RightSlur
  composition.cursorIndex = end + 1;

  composition.selection = { start: start, end: end };
}
