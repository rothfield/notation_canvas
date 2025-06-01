let saveTimeout;
const STORAGE_KEY = "durableComposition";

export function saveCompositionDebounced(composition) {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(composition));
    console.log("Autosaved composition.");
  }, 300);
}

export function loadComposition() {
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
        children: []
      }
    ]
  };
}
