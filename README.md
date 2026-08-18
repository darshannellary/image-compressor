# 🗜️ Squish — Image Compressor

A lightweight, privacy-friendly image compressor that runs **entirely in your browser**.

Squish compresses **PNG, JPEG, and WebP** images locally using the browser's Canvas API. Your images are never uploaded to a server and never leave your device.

I built this project while learning **vibe coding and AI-assisted software development** using **Claude Code** and **Cursor**.

---

## 🚀 Live Demo

**Try Squish:**  
https://darshannellary.github.io/image-compressor/

---

## ✨ Features

- 🗜️ **Client-Side Image Compression** — Images are processed directly in your browser.
- 🔒 **Privacy First** — Images are never uploaded to a server.
- 🖼️ **Multiple Image Formats** — Supports PNG, JPEG, and WebP.
- 📚 **Batch Processing** — Compress multiple images in one session.
- 🖱️ **Drag & Drop** — Drop images directly into the compressor.
- 📂 **File Browser** — Click the drop zone to select images manually.
- 📉 **Compression Statistics** — See original and compressed file sizes.
- 💯 **Percentage Saved** — Displays the percentage reduction for each image.
- ⬇️ **Individual Downloads** — Download each compressed image separately.
- ❌ **Remove Images** — Remove individual images from the processing list.
- 🧹 **Clear All** — Clear all images at once.
- 🌗 **Automatic Dark Mode** — Adapts to the operating system's light/dark preference.
- 📱 **Responsive Interface** — Designed to work across different screen sizes.
- ⚡ **No Frameworks** — Built entirely with HTML, CSS, and vanilla JavaScript.

---

## 🔒 Privacy by Design

One of the key features of Squish is that **your images never leave your device**.

Traditional online image compressors may require an image to be uploaded to a remote server, processed, and downloaded again.

Squish takes a different approach:

```text
Select Image
     │
     ▼
Browser loads image
     │
     ▼
Canvas API processes image
     │
     ▼
Compressed Blob generated
     │
     ▼
Download locally
```

There is no server-side image processing.

Everything happens inside your browser.

---

## 🧠 How It Works

Squish uses the browser's **Canvas API** to process images.

When an image is selected:

1. The browser creates a local object URL for the image.
2. The image is loaded into memory.
3. A Canvas matching the image's original dimensions is created.
4. The image is drawn onto the Canvas.
5. The image is processed according to its format.
6. Canvas generates a new compressed image Blob.
7. Squish compares the compressed size with the original.
8. The compressed image becomes available for download.

### JPEG & WebP

JPEG and WebP images are re-encoded using a compression quality of:

```javascript
0.8
```

This provides a balance between image quality and file-size reduction.

### PNG

PNG uses lossless compression, so simply re-encoding it may not significantly reduce its size.

Squish therefore applies color quantization before re-encoding PNG images.

The current implementation reduces RGB color values to **32 levels per channel** before the image is exported.

---

## 🛡️ Size Protection

Re-encoding an image doesn't always make it smaller.

An image that has already been optimized, for example, could actually become **larger** after being processed again.

Squish checks for this automatically.

Conceptually:

```javascript
if (compressedSize >= originalSize) {
    useOriginalImage();
}
```

This ensures that Squish will not give you a larger file and call it "compressed."

---

## 📉 Compression Results

After processing an image, Squish displays:

```text
Original Size → Compressed Size    Percentage Saved
```

For example:

```text
2.40 MB → 1.15 MB    -52%
```

This makes the compression result immediately visible before downloading the image.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **HTML5** | Application structure and file input |
| **CSS3** | Responsive UI and light/dark themes |
| **JavaScript** | Image processing and application logic |
| **Canvas API** | Client-side image processing |
| **Blob API** | Creating downloadable compressed images |
| **Object URLs** | Handling images locally in the browser |
| **Claude Code** | AI-assisted development |
| **Cursor** | AI-assisted coding and iteration |
| **GitHub Pages** | Static deployment |

No external JavaScript frameworks or libraries are required.

---

## 📁 Project Structure

```text
image-compressor/
│
├── index.html
├── style.css
├── app.js
└── README.md
```

### `index.html`

Defines the application interface, including:

- Drag-and-drop area
- Multiple image file input
- Compression results
- File-size information
- Download controls
- Remove controls
- Clear-all functionality

### `style.css`

Contains the application's visual design, including:

- Responsive layout
- Drag-and-drop states
- Results list
- Buttons
- Compression badges
- Light theme
- Automatic dark theme

### `app.js`

Contains the core functionality:

- File handling
- Drag-and-drop events
- Image loading
- Canvas processing
- JPEG/WebP compression
- PNG color quantization
- Blob generation
- File-size calculations
- Download handling
- Object URL cleanup

---

## 💻 Running Locally

Squish requires no package manager, dependencies, or build process.

### 1. Clone the repository

```bash
git clone https://github.com/darshannellary/image-compressor.git
```

### 2. Enter the project directory

```bash
cd image-compressor
```

### 3. Open the application

Open:

```text
index.html
```

in a modern web browser.

That's it.

---

## 🎨 Design

Squish uses a deliberately minimal interface designed around one primary workflow:

**Drop → Compress → Download**

The interface includes:

- Clean centered layout
- Drag-and-drop upload area
- Original vs. compressed size comparison
- Compression percentage badges
- Individual download controls
- Automatic light/dark mode
- Responsive result rows

The goal is to keep the interface simple while making the compression result immediately understandable.

---

## 🤖 Built While Learning Vibe Coding

Squish was built as part of my exploration of **vibe coding and AI-assisted software development**.

I used:

- **Claude Code**
- **Cursor**

Rather than focusing only on generating code, the project was an opportunity to experiment with the complete development process:

**Idea → Prompt → Build → Test → Debug → Iterate → Deploy**

Building a practical utility like an image compressor also gave me an opportunity to explore browser capabilities beyond standard webpage interactions.

---

## 📚 What I Learned

This project helped me explore:

- Client-side file handling
- Browser APIs
- Image processing with Canvas
- JavaScript asynchronous operations
- Blob and Object URL management
- Drag-and-drop interfaces
- File-size calculations
- Responsive UI design
- Automatic light/dark themes
- Privacy-first application architecture
- AI-assisted development workflows
- Building useful applications without a backend

---

## 🔮 Possible Future Improvements

- [ ] Adjustable compression quality
- [ ] Image resizing controls
- [ ] Target file-size compression
- [ ] Before/after image preview
- [ ] Download all compressed images
- [ ] ZIP download for batch compression
- [ ] Additional image formats
- [ ] Image dimension display
- [ ] Compression presets
- [ ] EXIF metadata controls
- [ ] Improved PNG optimization
- [ ] PWA/offline support

---

## 🌐 Deployment

The application is deployed using **GitHub Pages**.

**Live application:**  
https://darshannellary.github.io/image-compressor/

---

## 👨‍💻 Author

**Darshan Nellary**

Built while learning **vibe coding, AI-assisted development, and browser-based application development**.

---

## 📄 License

This project currently does not specify a license.