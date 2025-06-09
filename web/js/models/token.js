/**
 * @typedef {Object} Token
 * @property {string} type
 * @property {string} value
 * @property {number} column
 */

export function createToken(type, value, column) {
  return { type, value, column };
}
