/**
 * Handles Backspace by deleting the token before the cursor,
 * and updating the cursor and selection to match.
 */
export function handleBackspace(composition, updateAndRender) {
  const paragraph = composition.lines?.[0];
  const tokens = paragraph?.tokens;

  if (!tokens || composition.cursorIndex <= 0) return;

  // Delete token before cursor
  tokens.splice(composition.cursorIndex - 1, 1);

  // Move cursor and mutate selection in-place
  composition.cursorIndex--;
  composition.selection.start = composition.cursorIndex;
  composition.selection.end = composition.cursorIndex;

  updateAndRender();
}

