import { composition } from "../state.js";

export function handleClick(event, composition, updateAndRender) {
  const canvas = event.target;
  const rect = canvas.getBoundingClientRect();
  const xClick = event.clientX - rect.left;

  const tokens = composition.paragraphs[0].children;

  console.log("🖱️ Click x =", xClick);
  console.log("🔴 Before: cursorIndex =", composition.cursorIndex);

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const bbox = token.bbox;
    if (!bbox) continue;

    const left = bbox.x;
    const right = bbox.x + bbox.width;
    const mid = (left + right) / 2;

    console.log(`  token ${i}: left=${left}, right=${right}, mid=${mid}`);

    if (xClick >= left && xClick <= right) {
      const placingRight = xClick >= mid;
      const newIndex = placingRight ? i + 1 : i;
      console.log(`  ✅ Clicked inside token ${i}, ${placingRight ? "right" : "left"} half → setting cursorIndex = ${newIndex}`);
      composition.cursorIndex = newIndex;
      composition.selection.start = newIndex;
      composition.selection.end = newIndex;
      updateAndRender();
      console.log("🟢 After: cursorIndex =", composition.cursorIndex);
      return;
    }

    if (xClick < left) {
      console.log(`  ↪ Clicked before token ${i} → setting cursorIndex = ${i}`);
      composition.cursorIndex = i;
      composition.selection.start = i;
      composition.selection.end = i;
      updateAndRender();
      console.log("🟢 After: cursorIndex =", composition.cursorIndex);
      return;
    }
  }

  // Clicked after last token
  console.log("  ↪ Clicked after all tokens → setting cursorIndex =", tokens.length);
  composition.cursorIndex = tokens.length;
  composition.selection.start = tokens.length;
  composition.selection.end = tokens.length;
  updateAndRender();
  console.log("🟢 After: cursorIndex =", composition.cursorIndex);
}

