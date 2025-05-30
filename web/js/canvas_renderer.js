export function drawComposition(ctx, tokens, cursorIndex) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.font = '20px sans-serif';
  ctx.textBaseline = 'top';

  const lineHeight = 40;
  const padding = 10;
  const maxWidth = ctx.canvas.width - padding * 2;

  let x = padding;
  let y = padding;
  let index = 0;

  const beats = [];
  let currentBeat = [];

  for (const token of tokens) {
    if (token.value === ' ') {
      if (currentBeat.length > 0) {
        beats.push(currentBeat);
        currentBeat = [];
      }
    } else {
      currentBeat.push(token);
    }
  }
  if (currentBeat.length > 0) {
    beats.push(currentBeat);
  }

  for (const beat of beats) {
    const beatStartX = x;
    let beatEndX = x;
    let beatHasContent = false;
    let tokenCount = 0;

    for (const token of beat) {
      const value = token.value;
      const width = ctx.measureText(value).width;

      // Wrap line if needed
      if (x + width > maxWidth) {
        x = padding;
        y += lineHeight;
      }

      ctx.fillText(value, x, y);

      if (index === cursorIndex) {
        ctx.fillRect(x - 1, y - 2, 2, 24);
      }

      x += width;
      beatEndX = x;
      index++;
      tokenCount++;
    }

    // Draw loop (arc) under beat if it has multiple tokens
    if (tokenCount > 1) {
      const midX = (beatStartX + beatEndX) / 2;
      const arcHeight = 10;
      ctx.beginPath();
      ctx.moveTo(beatStartX, y + 26);
      ctx.quadraticCurveTo(midX, y + 26 + arcHeight, beatEndX, y + 26);
      ctx.strokeStyle = "black";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    x += ctx.measureText(' ').width;
    index++;
  }

  if (index === cursorIndex) {
    ctx.fillRect(x - 1, y - 2, 2, 24);
  }
}
