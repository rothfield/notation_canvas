/**
 * @typedef {Object} BoundingBox
 * @property {number} x
 * @property {number} y
 * @property {number} width
 * @property {number} height
 */

/**
 * @typedef {Object} Element
 * @property {string} type
 * @property {string} text
 * @property {string=} pitch
 * @property {number=} octave
 * @property {BoundingBox=} bbox
 */

export function createElement({ type, text, pitch = null, octave = null, bbox = null }) {
  return { type, text, pitch, octave, bbox };
}
