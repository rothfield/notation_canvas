// getCanvasFontFromCSS.js

let cachedFont = null;

/**
 * Gets the computed font string from a styled DOM element.
 * If no matching element is found, creates a hidden fallback.
 * Caches the result to avoid repeated DOM queries.
 *
 * @param {string} selector - A CSS selector (default: ".pitch-wrapper span")
 * @returns {string} A CSS font string, e.g. "normal 400 20px Inter, sans-serif"
 */
export function getCanvasFontFromCSS(selector = ".pitch-wrapper span") {
  if (cachedFont) return cachedFont;

  let reference = document.querySelector(selector);

  if (!reference) {
    // Create a hidden fallback element if needed
    const wrapper = document.createElement("span");
    wrapper.className = "pitch-wrapper";
    wrapper.style.position = "absolute";
    wrapper.style.visibility = "hidden";
    wrapper.style.height = "0";
    wrapper.style.overflow = "hidden";

    const span = document.createElement("span");
    span.textContent = "S"; // Representative glyph
    wrapper.appendChild(span);
    document.body.appendChild(wrapper);

    reference = span;
  }

  const style = getComputedStyle(reference);
  cachedFont = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  return cachedFont;
}

/**
 * Clears the cached font string. Call this after a font style change.
 */
export function resetFontCache() {
  cachedFont = null;
}

