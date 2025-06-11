import * as selectionRenderer from "../canvas/selection-renderer.js";
import { drawNote } from "../canvas/drawNote.js";
import { blink } from "../state.js";
import { pitchCodeAndNotationToPitch } from "../models/notation-utils.js";

function getCSSValue(propName) {
  return getComputedStyle(document.documentElement).getPropertyValue(propName).trim();
}

function getCSSNumber(propName) {
  return parseFloat(getCSSValue(propName)) || 0;
}

function drawCursor(ctx, x, yOffset, ascent, descent) {
  ctx.beginPath();
  ctx.moveTo(x - 1, yOffset - ascent);
  ctx.lineTo(x - 1, yOffset + descent);
  ctx.strokeStyle = "red";
  ctx.lineWidth = 1;
  ctx.stroke();
}

export function render(canvas, composition, ctx) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const canvasFont = getCSSValue("--canvas-font");
  const lyricFont = getCSSValue("--lyric-font");

  const sampleMetrics = ctx.measureText("M");
  const ascent = sampleMetrics.actualBoundingBoxAscent || 15;
  const descent = sampleMetrics.actualBoundingBoxDescent || 5;
  const referenceMetrics = ctx.measureText("Mg");
  const refAscent = referenceMetrics.actualBoundingBoxAscent || 15;
  const refDescent = referenceMetrics.actualBoundingBoxDescent || 5;
  const yOffset = Math.floor(canvas.height / 2 + refAscent / 2);
  const referenceTopY = yOffset - referenceMetrics.actualBoundingBoxAscent;
  const xOffset = 20;

  const drawParams = {
    canvasFont,
    lyricFont,
    ascent,
    descent,
    refAscent,
    referenceTopY,
    dotAbove: getCSSNumber("--octave-dot-above"),
    dotBelow: getCSSNumber("--octave-dot-below"),
    mordentAbove: getCSSNumber("--mordent-above"),
    syllableBelow: getCSSNumber("--syllable-below"),
    slurVerticalGap: getCSSNumber("--slur-vertical-gap"),
    yOffset,
  };

  const tokens = composition.lines[0].tokens;
  const { cursorIndex, selection } = composition;

  selectionRenderer.render(ctx, tokens, selection);

  let x = xOffset;
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.type === "note") {
      x += drawNote(ctx, x, yOffset, token, drawParams);
    } else {
      let text = token.text || "";
      if (token.type === "unknown" || typeof text !== "string") continue;

      ctx.font = canvasFont;
      const metrics = ctx.measureText(text);
      const width = Math.ceil(metrics.width) + 0.5;
      const thisAscent = metrics.actualBoundingBoxAscent || refAscent;
      const thisDescent = metrics.actualBoundingBoxDescent || refDescent;

      const isSelected =
        selection?.start !== null &&
        selection?.end !== null &&
        i >= Math.min(selection.start, selection.end) &&
        i < Math.max(selection.start, selection.end);

      if (isSelected) {
        const top = yOffset - thisAscent - 15;
        const bottom = yOffset + thisDescent + 20;
        ctx.fillStyle = "#0033cc";
        ctx.fillRect(x - 2, top, width + 4, bottom - top);
        ctx.fillStyle = "white";
      } else {
        ctx.fillStyle = "black";
      }

      ctx.fillText(text, x, yOffset);

      token.bbox = {
        x,
        y: yOffset - thisAscent - 15,
        width,
        height: thisAscent + thisDescent + 35,
      };

      x += width;
    }
  }

  // Cursor rendering (second pass)
  if (blink.visible && cursorIndex !== null) {
    let cursorX = null;

    if (cursorIndex < tokens.length) {
      const bbox = tokens[cursorIndex]?.bbox;
      if (bbox) {
        cursorX = bbox.x;
      }
    } else if (cursorIndex === tokens.length && tokens.length > 0) {
      const last = tokens[tokens.length - 1].bbox;
      if (last) {
        cursorX = last.x + last.width;
      }
    } else if (tokens.length === 0) {
      cursorX = xOffset;
    }

    if (cursorX !== null) {
      drawCursor(ctx, cursorX, yOffset, refAscent, refDescent);
    }
  }

  renderSlurs(ctx, tokens, yOffset - refAscent - getCSSNumber("--slur-vertical-gap"));
}

function renderSlurs(ctx, tokens, arcY) {
  let slurStartX = null;
  let slurEndX = null;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.type === "leftSlur" && tokens[i + 1]?.bbox) {
      slurStartX = tokens[i + 1].bbox.x;
    }
    if (token.type === "rightSlur" && tokens[i - 1]?.bbox) {
      slurEndX = tokens[i - 1].bbox.x + tokens[i - 1].bbox.width;
      if (slurStartX !== null && slurEndX !== null) {
        const midX = (slurStartX + slurEndX) / 2;
        ctx.beginPath();
        ctx.moveTo(slurStartX, arcY);
        ctx.quadraticCurveTo(midX, arcY - 10, slurEndX, arcY);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
      slurStartX = null;
      slurEndX = null;
    }
  }
}

