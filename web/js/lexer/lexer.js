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



export function lexOneToken(text, notationKind = "sargam") {
  const regex = singleTokenRegexes[notationKind];
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
        notationKind: notationKind});
    case 2: return { type: "barline", text: value };
    case 3: return { type: "dash", text: value };
    case 4: return { type: "left-slur", text: value };
    case 5: return { type: "right-slur", text: value };
    case 6: return { type: "whitespace", text: value };
    case 7: return { type: "unknown", text: value };
    default: return null;
  }
}


export function zzlexOneToken(text, notationKind = "western") {
  const regex = singleTokenRegexes[notationKind];
  const match = regex.exec(text);

  if (!match) return null;

  // Find which capturing group matched
  const matchedGroupIndex = match.findIndex((val, i) => i > 0 && val !== undefined);
  if (matchedGroupIndex === -1) return null;

  const value = match[matchedGroupIndex];

  switch (matchedGroupIndex) {
    case 1: return createNote(value);       // pitch
    case 2: return { type: "barline", text: value };
    case 3: return { type: "dash", text: value };
    case 4: return { type: "left-slur", text: value };
    case 5: return { type: "right-slur", text: value };
    case 6: return { type: "whitespace", text: value };
    case 7: return { type: "unknown", text: value };
    default: return null;
  }
}

export function zlexOneToken(text, notationKind) {
  const regex = singleTokenRegexes[notationKind];
  if (!regex) return null;

  regex.lastIndex = 0;
  const match = regex.exec(text);
  if (!match || match.index !== 0) return null;

  const types = [
    TokenType.Pitch,       // match[1]
    TokenType.Barline,     // match[2]
    TokenType.Dash,        // match[3]
    TokenType.LeftSlur,    // match[4]
    TokenType.RightSlur,   // match[5]
    TokenType.Space,       // match[6]
    TokenType.Unknown      // match[7]
  ];

  for (let i = 1; i < match.length; i++) {
    if (match[i]) {
      const type = types[i - 1];
      if (type === TokenType.Unknown) return null;
      if (type === TokenType.Pitch) {
        return createNote({ type: "note", pitch: match[i], text: match[i] });
      }
      return createElement({ type, text: match[i] });
    }
  }

  return null;
}

