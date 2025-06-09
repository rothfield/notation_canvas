
export function render(ctx, token) {
  if (token.type !== "note") return;

  const { octave } = token;
  if (![1, 2, -1, -2, 0].includes(octave)) {
    console.warn(`octave-renderer: unsupported octave value "${octave}" in token:`, token);
    return;
  }

  if (octave === 0 || octave == null) return;  // No dots for base octave

  const centerX = token.x + token.width / 2;
  const yOffset = token.y; // baseline of the note

  if (octave === 1) {
    renderUpper(ctx, centerX, yOffset, token);
  } else if (octave === 2) {
    renderUpper(ctx, centerX, yOffset, token);
    renderUpper(ctx, centerX, yOffset - 8, token);
  } else if (octave === -1) {
    renderLower(ctx, centerX, yOffset, token);
  } else if (octave === -2) {
    renderLower(ctx, centerX, yOffset, token);
    renderLower(ctx, centerX, yOffset + 8, token);
  }
}

export function renderUpper(ctx, centerX, yOffset, token) {
  console.log("octave.js/renderUpper")
  const dot = "•";
  const dotWidth = ctx.measureText(dot).width;
  const metrics = ctx.measureText(token.text);
  const ascent = metrics.actualBoundingBoxAscent || 0;
  const dotX = centerX - dotWidth / 2;
  const dotY = yOffset - 1;  // yOffset is now top of glyph
  ctx.fillText(dot, dotX, dotY);
}


export function renderLower(ctx, centerX, yOffset, token) {
  console.log("octave.js/renderLower");

  const dot = "•";
  const dotMetrics = ctx.measureText(dot);
  const dotWidth = dotMetrics.width;

  const noteMetrics = ctx.measureText(token.text);
  const descent = noteMetrics.actualBoundingBoxDescent || 0;

  const dotX = centerX - dotWidth / 2;

  // The top of the dot sits just below the bottom of the note
  const dotY = yOffset + descent + 1 + dotMetrics.actualBoundingBoxAscent;

  ctx.fillText(dot, dotX, dotY);
}

export function zzzzrenderLower(ctx, centerX, yOffset, token) {
  console.log("octave.js/renderLower");

  const dot = "•";
  const dotMetrics = ctx.measureText(dot);
  const dotWidth = dotMetrics.width;
  const dotHeight = dotMetrics.actualBoundingBoxAscent + dotMetrics.actualBoundingBoxDescent;

  const noteMetrics = ctx.measureText(token.text);
  const descent = noteMetrics.actualBoundingBoxDescent || 0;

  const dotX = centerX - dotWidth / 2;
  const dotY = yOffset + descent + 1; // baseline + descent + spacing

  // Adjust dotY so that the *top* of the dot sits just below the note’s lowest visual point
  const adjustedDotY = dotY + dotHeight / 2;

  ctx.fillText(dot, dotX, adjustedDotY);
}

export function zzrenderLower(ctx, centerX, yOffset, token) {
  console.log("octave.js/renderLower");

  const dot = "•";
  const dotWidth = ctx.measureText(dot).width;

  const metrics = ctx.measureText(token.text);
  const descent = metrics.actualBoundingBoxDescent || 0;

  const dotX = centerX - dotWidth / 2;
  const dotY = yOffset + descent + 2; // hangs *below* descender

  ctx.fillText(dot, dotX, dotY);
}

export function zrenderLower(ctx, centerX, yOffset, token) {
  console.log("octave.js/renderLower");
  const dot = "•";
  const dotWidth = ctx.measureText(dot).width;
  const metrics = ctx.measureText(token.text);
  const descent = metrics.actualBoundingBoxDescent || 0;
  const dotX = centerX - dotWidth / 2;
  const dotY = yOffset + descent + 1;  // dot sits just below the bottom of the character
  ctx.fillText(dot, dotX, dotY);
}

