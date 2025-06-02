export function renderToken(ctx, token, x, yOffset, layout, index, cursorIndex, blink) {
  const text = token.text || "";
  const metrics = ctx.measureText(text);
  const width = Math.ceil(metrics.width) + 2;
  const ascent = metrics.actualBoundingBoxAscent || layout.ascent;
  const descent = metrics.actualBoundingBoxDescent || layout.descent;
  const height = ascent + descent;

  const isSelected = token.isSelected;

  if (isSelected) {
    ctx.fillStyle = "#0033cc";
    ctx.fillRect(x - 1, yOffset - ascent, width, height);
    ctx.fillStyle = "white";
  } else {
    ctx.fillStyle = "black";
  }

  ctx.fillText(text, x, yOffset);

  const pitchWidth = width;

  if (token.octave === 1 || token.octave === -1) {
    const dot = "•";
    const dotWidth = ctx.measureText(dot).width;
    const dotX = x + (pitchWidth - dotWidth) / 2;
    const dotY = token.octave === 1
      ? yOffset - ascent - 4
      : yOffset + descent + 10;
    ctx.fillText(dot, dotX, dotY);
  }

  if (token.mordent) {
    const symbol = "~";
    const symbolWidth = ctx.measureText(symbol).width;
    const symbolX = x + (pitchWidth - symbolWidth) / 2;
    ctx.fillText(symbol, symbolX, yOffset - ascent - 18);
  }

  if (token.syllable) {
    const syllable = token.syllable;
    const syllableWidth = ctx.measureText(syllable).width;
    const syllableX = x + (pitchWidth - syllableWidth) / 2;
    ctx.fillText(syllable, syllableX, yOffset + descent + 24);
  }

  token.bbox = {
    x,
    y: yOffset - ascent,
    width,
    height,
  };

  if (blink.visible && cursorIndex === index) {
    ctx.beginPath();
    ctx.moveTo(x - 1, yOffset - ascent);
    ctx.lineTo(x - 1, yOffset + descent);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  return width;
}

