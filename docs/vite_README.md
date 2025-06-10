# Vite Setup for Modular JavaScript Canvas Project

This guide outlines how to use **Vite** to organize and run a modular JavaScript project, especially one using a canvas for rendering and cleanly structured input handlers.

---

## ✨ Why Vite?

Vite is a modern build tool that:

* Uses native ES modules during development (blazing fast)
* Builds with Rollup (highly optimized)
* Supports modular JavaScript without extra tooling
* Ideal for projects using `import/export`

---

## 📁 Recommended Project Structure

```
web/
├── index.html
├── js/
│   ├── main.js
│   ├── input/
│   │   └── mouse/
│   │       ├── handleDown.js
│   │       ├── handleMove.js
│   │       ├── handleUp.js
│   │       ├── setupMouseEvents.js
│   │       └── index.js
│   └── ... other modules
├── css/
│   └── styles.css
├── vite.config.js
└── package.json
```

---

## ⚙️ `vite.config.js`

```js
import { defineConfig } from 'vite';

export default defineConfig({
  root: './web',         // tells Vite where index.html is
  build: {
    outDir: '../dist',   // where to put production builds
    emptyOutDir: true
  }
});
```

---

## 📄 `index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Canvas App</title>
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <canvas id="canvas" width="800" height="200"></canvas>
  <script type="module" src="js/main.js"></script>
</body>
</html>
```

---

## ⚖️ Setup Instructions

```bash
npm init -y
npm install vite --save-dev
```

Then update `package.json`:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

---

## ▶️ Run the App

```bash
npm run dev
```

Visit: [http://localhost:5173](http://localhost:5173)

---

## 🔍 Notes

* `type="module"` is required in `<script>` to use `import`.
* Files should be served via HTTP (not `file://`). Vite handles that.
* Extensions in imports (`.js`) are required unless you use a bundler.

---

## 🔹 Example Modular Mouse Event Setup

* `setupMouseEvents.js` adds listeners
* `handleDown.js`, `handleMove.js`, `handleUp.js` define logic
* `index.js` re-exports for clean imports:

```js
export { setupMouseEvents } from './setupMouseEvents.js';
export { handleDown } from './handleDown.js';
```

Then in `main.js`:

```js
import { setupMouseEvents } from './input/mouse';
setupMouseEvents(canvas, context);
```

---

## 💪 Why This Helps

* Faster feedback (instant reload)
* Cleaner modular design
* Great DX (developer experience)

Let me know if you want a starter zip!

