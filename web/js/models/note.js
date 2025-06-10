import { Notation } from "./notation.js";
import { pitchAndNotationToPitchCode} from "../models/notation-utils.js";
/**
 * @typedef {Object} Note
 * @property {string} type - Always "note"
 * @property {string} pitch - Raw pitch (e.g. "S#", "D", "P")
 * @property {string} pitchCode - Normalized pitch (e.g. "1", "2b", "3")
 * @property {number} octave - Octave shift (0 = default, -1 = lower, +1 = upper)
 * @property {string} text - Original user input text
 * @property {string[]} syllables - Lyric syllables (aligned or extra)
 * @property {string|null} tala - Optional tala marker
 * @property {boolean} mordent - Whether this note has a mordent (~)
 * @property {Object} bbox - Bounding box for rendering
 * @property {number} bbox.x
 * @property {number} bbox.y
 * @property {number} bbox.width
 * @property {number} bbox.height
 * @property {number} line - Line number in source (1-based)
 * @property {number} col - Column position (1-based)
 * @property {number} index - Character offset in full input
 * @property {number} length - Number of characters in token
 */

/**
 * Create a note object with full fields
 * @param {Object} params - Initial values for the note
 * @returns {Note}
 */
export function createNote({
  pitch = "",
  pitchCode = "",
  octave = 0,
  text = "",
  syllables = [],
  tala = null,
  mordent = false,
  notation = Notation.SARGAM,
  bbox = { x: 0, y: 0, width: 0, height: 0 },
  line = 1,
  col = 1,
  index = 0,
  length = 1
} = {}) {
  console.log("createNote,",  {pitch,text,line,col})
  console.log("createNote,calling pitchAndNotationToPitchCode", pitch,notation )
  pitchCode = pitchAndNotationToPitchCode(pitch,notation) 
  return {
    type: "note",
    pitch,
    pitchCode,
    notation,
    octave,
    text,
    syllables,
    tala,
    mordent,
    bbox,
    line,
    col,
    index,
    length
  };
}
