# Squish — Image Compressor

A browser-based image compressor. Drag in PNG, JPEG, or WebP files and get smaller versions back — no server, no upload, no build step. It's three static files (`index.html`, `style.css`, `app.js`) that run entirely on the Canvas API.

**Try it live**: [https://darshannellary.github.io/image-compressor/](https://darshannellary.github.io/image-compressor/) 

## Features

- Drag-and-drop or file picker, filtered to PNG / JPEG / WebP  
- Compresses entirely client-side — nothing is ever uploaded  
- Never makes a file bigger: falls back to the original if compression doesn't help  
- Per-file progress, compressed size, and "-N%" saved badge  
- One-click download or "Clear all"  
- Light/dark theme, automatic based on system preference

## How it works

1. **Drop or pick files** — `index.html` has a dropzone (`#dropzone`) and a hidden file input. `app.js` listens for `dragenter`/`dragover`/`drop` on the dropzone and for `change` on the input, filtering to `image/png`, `image/jpeg`, and `image/webp`.  
2. **Render a row per file** — each selected file gets a row cloned from the `<template id="rowTemplate">` in `index.html`, showing the filename, original size, and a "Compressing…" status.  
3. **Compress on canvas** — for each file, `processItem()`:  
   - loads the file into an `<img>` via an object URL,  
   - draws it onto a same-size `<canvas>`,  
   - for PNGs, runs `posterize()` first, which quantizes each RGB channel to 32 levels using `getImageData`/`putImageData` — this is what actually shrinks PNGs, since re-encoding alone doesn't (lossless format),  
   - calls `canvas.toBlob()` to re-encode the canvas back to the file's original MIME type, using a fixed **quality of 0.8** for JPEG/WebP.  
4. **Never make it bigger** — if the re-encoded blob ends up larger than the original (e.g. an already-optimized file), the app just keeps the original blob instead.  
5. **Show the result** — the row updates with the compressed size and a "-N%" saved badge, and the Download button is enabled.  
6. **Download or remove** — Download triggers a synthetic `<a download>` click on an object URL for the compressed blob; Remove revokes the object URLs for that item and removes its row. "Clear all" does the same for every item.

All state lives in a `Map` (`items`) keyed by a generated id, holding the original `File`, its object URL, and the compressed `Blob`/URL once ready.

## Design choices

- **No dependencies, no build tool.** Just `<script src="app.js">` — open `index.html` directly or serve the folder statically.  
- **Privacy by construction.** Nothing ever leaves the browser; compression happens with the Canvas API, which is why the footer says so explicitly.  
- **Object URLs are revoked** on remove/clear (and after download, via a `setTimeout`) to avoid leaking memory across many files.  
- **Light/dark theme** via `prefers-color-scheme`, using CSS custom properties defined in `:root` in `style.css`.

## Running it

No install needed — it's static HTML/CSS/JS:

\# just open it

open index.html        \# macOS

start index.html        \# Windows

\# or serve it (needed if drag/drop or file APIs act up over file://)

npx serve .

## Known limitations

- JPEG/WebP quality (`0.8`) is fixed in `app.js`, not user-adjustable.  
- PNG "compression" is lossy posterization (32 color levels per channel), not true lossless optimization — it trades a bit of color fidelity for a smaller file.  
- No resizing/downscaling — only re-encoding at the original dimensions.

