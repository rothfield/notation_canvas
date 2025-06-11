import * as octaveRenderer from "./octave-renderer.js";
import { drawSyllable } from "./drawSyllable.js";
import { pitchCodeAndNotationToPitch } from "../models/notation-utils.js";
import { blink } from "../state.js";

export function drawNote(ctx, x, y, note, drawParams) {
  if (note.type !== "note") {
    throw new Error(`drawNote called with non-note token: ${note.type}`);
  }

  const {
    canvasFont,
    lyricFont,
    ascent,
    descent,
    refAscent,
    referenceTopY,
    dotAbove,
    dotBelow,
    mordentAbove,
    syllableBelow,
    slurVerticalGap,
  } = drawParams;

  const text = pitchCodeAndNotationToPitch(note.pitchCode, note.notation);

  ctx.font = canvasFont;
  const metrics = ctx.measureText(text);
  const width = Math.ceil(metrics.width) + 0.5;


//  const isSelected =
//    selection?.start !== null &&
//    selection?.end !== null &&
//    index >= Math.min(selection.start, selection.end) &&
//    index < Math.max(selection.start, selection.end);


//  const isCursor = blink.visible && cursorIndex === index;
//
//  if (isSelected) {
//    const top = y - ascent - 15;
//    const bottom = y + descent + 20;
//    ctx.fillStyle = "#0033cc";
//    ctx.fillRect(x - 2, top, width + 4, bottom - top);
//    ctx.fillStyle = "white";
//  } else {
//    ctx.fillStyle = "black";
//  }
//
//  if (isCursor) {
//    ctx.beginPath();
//    ctx.moveTo(x - 1, y - ascent - 15);
//    ctx.lineTo(x - 1, y + descent + 20);
//    ctx.strokeStyle = "red";
//    ctx.lineWidth = 1;
//    ctx.stroke();
//  }
//

  ctx.fillText(text, x, y);

  const pitchCenterX = x + width / 2;

  if (note.octave === 1) {
    octaveRenderer.renderUpper(ctx, pitchCenterX, referenceTopY - dotAbove, note);
  } else if (note.octave === -1) {
    octaveRenderer.renderLower(ctx, pitchCenterX, y + dotBelow, note);
  }

  if (note.mordent) {
    const symbol = "~";
    const symbolWidth = ctx.measureText(symbol).width;
    const symbolX = x + (width - symbolWidth) / 2;
    ctx.fillText(symbol, symbolX, referenceTopY - mordentAbove);
  }

  if (note.syllable) {
    const syllableY = y + descent + syllableBelow + refAscent;
    drawSyllable(ctx, x, syllableY, note.syllable, lyricFont);
  }

  note.bbox = {
    x,
    y: y - ascent - 15,
    width,
    height: ascent + descent + 35
  };

  return width;
}

