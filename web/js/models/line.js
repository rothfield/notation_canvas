/**
 * @typedef {Object} Line
 * @property {string} type
 * @property {string} lineName
 * @property {string} notation
 * @property {Array} tokens
 */

export function createLine(lineName = "", notation = "letter") {
  return {
    notation: notation,
    type: "line",
    lineName,
    tokens: []
  };
}
