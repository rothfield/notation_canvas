export const TokenType = {
  Pitch: 'Pitch',
  Dash: 'Dash',
  LeftSlur: 'LeftSlur',
  RightSlur: 'RightSlur',
  Space: 'Space',
  Barline: 'Barline',
  Unknown: 'Unknown'
};

export function lexElement(char, index = 0) {
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

  return { type, value: char, column: index };
}

export function parseElement(token) {
  switch (token.type) {
    case TokenType.Pitch:
      return { type: "note", pitch: token.value };
    case TokenType.Space:
      return { type: "space" };
    case TokenType.Dash:
      return { type: "dash" };
    case TokenType.Barline:
      return { type: "barline" };
    default:
      return null;
  }
}
