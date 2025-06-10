// @ts-check

import { TokenType } from "../models/index.js";
import { createElement } from "../models/index.js";
import { createNote } from "../models/note.js";
import { singleTokenRegexes} from "./lineRegexes.js";

/**
 * Lex a character sequence (e.g., "P#", "|:", "2b") into a structured element.
 * @param {string} text
 * @param {string} notationKind - one of "sargam", "western", "number", "solfege"
 * @returns {import('./models/element.js').Element|null}
 */



export function lexOneToken(text, notation = "sargam") {
  const regex = singleTokenRegexes[notation];
  const match = regex.exec(text);
  if (!match) return null;

  // Find exactly one non-null group
  const matchedGroups = match.slice(1).map((m, i) => m ? i + 1 : null).filter(i => i !== null);
  if (matchedGroups.length !== 1) return null;  // Reject ambiguous or partial

  const i = matchedGroups[0];
  console.log("chosen i =", i, "value =", match[i]);
  if (match[0] !== text) return null;  // Require exact match
  const value = match[i];
  console.log("before switch, value=",value, " i=",i)
  switch (i) {
    case 1: 
      return createNote({
        pitch: value, 
        text: value,
        notation: notation});
    case 2: return { type: "barline", text: value };
    case 3: return { type: "dash", text: value };
    case 4: return { type: "left-slur", text: value };
    case 5: return { type: "right-slur", text: value };
    case 6: return { type: "whitespace", text: value };
    case 7: return { type: "unknown", text: value };
    default: return null;
  }
}



