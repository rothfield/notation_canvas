// lexer.js

export const TokenType = {
  Pitch: 'Pitch',
  Dash: 'Dash',
  LeftSlur: 'LeftSlur',
  RightSlur: 'RightSlur',
  Space: 'Space',
  Barline: 'Barline',
  Unknown: 'Unknown'
};

export function lex(input) {
  const tokens = [];
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
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

    tokens.push({ type, value: char, column: i });
  }
  return tokens;
}