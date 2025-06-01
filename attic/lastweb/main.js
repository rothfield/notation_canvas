const STORAGE_KEY = "durableComposition";

let saveTimeout;
function saveCompositionDebounced() {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(composition));
    console.log("Autosaved composition.");
  }, 300);
}

function loadComposition() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      console.warn("Invalid saved composition. Resetting.");
    }
  }
  return {
    paragraphs: [
      {
        id: "paragraph-1",
        children: [
          { type: "note", pitch: "S", octave: -1 },
          { type: "space" },
          {
            type: "slur",
            children: [
              { type: "note", pitch: "S" },
              { type: "note", pitch: "S" },
              { type: "note", pitch: "r", octave: 1 }
            ]
          },
          { type: "barline" },
          { type: "note", pitch: "g" },
          { type: "note", pitch: "g" }
        ]
      }
    ]
  };
}

let composition = loadComposition();

function updateRawDataDisplay(comp) {
  document.getElementById("raw-data").textContent = JSON.stringify(comp, null, 2);
}

function renderComposition(comp) {
  const output = document.getElementById("html-output");
  output.textContent = ""; // Replace with actual rendering logic
}

function renderHTML(comp) {
  document.getElementById("html-raw").textContent = "<composition>...</composition>";
}

function updateAndRender() {
  saveCompositionDebounced();
  renderComposition(composition);
  updateRawDataDisplay(composition);
  renderHTML(composition);
}

window.addEventListener("DOMContentLoaded", () => {
  updateAndRender();
});