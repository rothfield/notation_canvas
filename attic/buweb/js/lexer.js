export const TokenType = {
  Pitch: 'Pitch',
  Dash: 'Dash',
  LeftSlur: 'LeftSlur',
  RightSlur: 'RightSlur',
  Space: 'Space',
  Barline: 'Barline',
  Unknown: 'Unknown'
};

// ✅ Parse a single character into a token
export function lexElement(char, index = 0) {
  // Normalize lowercase input for Sargam
  if (char === 's') char = 'S';
  if (char === 'p') char = 'P';

  let type;

  switch (char) {
    case 'S': case 'r': case 'R': case 'g': case 'G':
    case 'm': case 'M': case 'P': case 'd': case 'D':
    case 'n': case 'N':
      type = TokenType.Pitch;
      break;
    case '-':
      type = TokenType.Dash;
      break;
    case '(':
      type = TokenType.LeftSlur;
      break;
    case ')':
      type = TokenType.RightSlur;
      break;
    case '|':
      type = TokenType.Barline;
      break;
    case ' ':
      type = TokenType.Space;
      break;
    default:
      type = TokenType.Unknown;
  }

  return {
    type,
    value: char,
    column: index
  };
}

// ✅ Tokenize a full string by repeatedly calling lexElement
export function lex(input) {
  const tokens = [];
  for (let i = 0; i < input.length; i++) {
    tokens.push(lexElement(input[i], i));
  }
  return tokens;
}

