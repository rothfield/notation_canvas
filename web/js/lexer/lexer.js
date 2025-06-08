export const TokenType = {
  Pitch: 'pitch',
  Dash: 'dash',
  LeftSlur: 'leftSlur',
  RightSlur: 'rightSlur',
  Space: 'space',
  Barline: 'barline',
  Unknown: 'unknown'
};

export function lexElement(char, index = 0) {
  console.log("lexelement char=",char)
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
  if (token.type ==="unknown")
    return null;

  switch (token.type) {
    case TokenType.Pitch:
      return {
        type: "note",
        pitch: token.value,
        octave: 0,
        text: token.value,
      };
    default:
      return { type: token.type, text: token.value };
  }
}


