// parser.js

/**
 * Parse a flat token sequence into a structured paragraph.
 * Groups tokens into beats separated by whitespace or barlines.
 *
 * Input: [token, token, token, ...]
 * Output: {
 *   type: 'paragraph',
 *   tokens: [ { type: 'beat', tokens: [...] }, barline, ... ]
 * }
 */

export function parseTokensToParagraph(tokens) {
  const out_tokens = [];
  let currentBeat = [];

  for (const token of tokens) {
    if (token.type === 'whitespace' || token.type === 'barline') {
      // End current beat if it exists
      if (currentBeat.length > 0) {
        out_tokens.push({
          type: 'beat',
          tokens: currentBeat,
        });
        currentBeat = [];
      }

      // Push the separating token as its own element
      out_tokens.push(token);
    } else {
      currentBeat.push(token);
    }
  }

  // Final beat at end
  if (currentBeat.length > 0) {
    out_tokens.push({
      type: 'beat',
      tokens: currentBeat,
    });
  }

  return {
    type: 'paragraph',
    out_tokens,
  };
}

