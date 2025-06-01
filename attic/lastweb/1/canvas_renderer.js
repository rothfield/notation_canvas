// canvas_renderer.js

export function drawComposition(ctx, tokens, cursorIndex) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.font = '20px sans-serif';
  ctx.textBaseline = 'top';

  const xStart = 10;
  const yStart = 10;
  let x = xStart;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    ctx.fillStyle = 'black';
    ctx.fillText(token.value, x, yStart);

    if (i === cursorIndex) {
      ctx.fillStyle = 'red';
      ctx.fillRect(x - 1, yStart, 2, 20);
    }

    x += ctx.measureText(token.value).width + 4;
  }

  if (cursorIndex === tokens.length) {
    ctx.fillStyle = 'red';
    ctx.fillRect(x - 1, yStart, 2, 20);
  }
}
