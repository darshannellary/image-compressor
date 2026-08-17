(() => {
  const QUALITY = 0.8; // fixed compression quality for JPEG/WebP re-encoding

  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("fileInput");
  const listActions = document.getElementById("listActions");
  const results = document.getElementById("results");
  const rowTemplate = document.getElementById("rowTemplate");
  const clearBtn = document.getElementById("clearBtn");

  const items = new Map();
  let idCounter = 0;

  dropzone.addEventListener("click", () => fileInput.click());

  ["dragenter", "dragover"].forEach((evt) =>
    dropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      dropzone.classList.add("dragover");
    })
  );

  ["dragleave", "drop"].forEach((evt) =>
    dropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      dropzone.classList.remove("dragover");
    })
  );

  dropzone.addEventListener("drop", (e) => {
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      /^image\/(png|jpeg|webp)$/.test(f.type)
    );
    handleFiles(files);
  });

  fileInput.addEventListener("change", () => {
    handleFiles(Array.from(fileInput.files));
    fileInput.value = "";
  });

  clearBtn.addEventListener("click", () => {
    for (const item of items.values()) {
      URL.revokeObjectURL(item.originalUrl);
      if (item.compressedUrl) URL.revokeObjectURL(item.compressedUrl);
    }
    items.clear();
    results.innerHTML = "";
    listActions.classList.add("hidden");
  });

  function handleFiles(files) {
    if (!files.length) return;
    listActions.classList.remove("hidden");

    for (const file of files) {
      const id = `img-${idCounter++}`;
      const originalUrl = URL.createObjectURL(file);
      const row = rowTemplate.content.firstElementChild.cloneNode(true);
      row.dataset.id = id;

      const nameEl = row.querySelector(".file-name");
      nameEl.textContent = file.name;
      nameEl.title = file.name;
      row.querySelector(".before-size").textContent = formatBytes(file.size);

      row.querySelector(".remove-btn").addEventListener("click", () => {
        const it = items.get(id);
        URL.revokeObjectURL(it.originalUrl);
        if (it.compressedUrl) URL.revokeObjectURL(it.compressedUrl);
        items.delete(id);
        row.remove();
        if (!items.size) listActions.classList.add("hidden");
      });

      row.querySelector(".download-btn").addEventListener("click", () => {
        const it = items.get(id);
        if (it.compressedBlob) triggerDownload(it.compressedBlob, it.file.name);
      });

      results.appendChild(row);

      const item = {
        id,
        file,
        originalUrl,
        compressedBlob: null,
        compressedUrl: null,
        row,
      };
      items.set(id, item);
      processItem(item);
    }
  }

  async function processItem(item) {
    try {
      const img = await loadImage(item.originalUrl);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      const type = item.file.type;
      if (type === "image/png") {
        posterize(ctx, canvas, 32);
      }

      let blob = await canvasToBlob(canvas, type);
      // Re-encoding can occasionally end up larger than the source (e.g. an
      // already-optimized PNG). Never ship something bigger than the original.
      if (blob.size >= item.file.size) blob = item.file;

      item.compressedBlob = blob;
      item.compressedUrl = URL.createObjectURL(blob);

      item.row.querySelector(".after-size").textContent = formatBytes(blob.size);

      const pct = item.file.size
        ? Math.max(0, Math.round((1 - blob.size / item.file.size) * 100))
        : 0;
      item.row.querySelector(".saved-pct").textContent = pct > 0 ? `-${pct}%` : "0%";

      item.row.querySelector(".download-btn").disabled = false;
      item.row.classList.add("done");
    } catch (err) {
      console.error("Failed to compress", item.file.name, err);
      item.row.querySelector(".file-status").textContent = "Compression failed";
    }
  }

  function posterize(ctx, canvas, levels) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const step = 255 / (levels - 1);
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.round(Math.round(data[i] / step) * step);
      data[i + 1] = Math.round(Math.round(data[i + 1] / step) * step);
      data[i + 2] = Math.round(Math.round(data[i + 2] / step) * step);
    }
    ctx.putImageData(imageData, 0, 0);
  }

  function loadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }

  function canvasToBlob(canvas, type) {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("toBlob failed"))),
        type,
        type === "image/png" ? undefined : QUALITY
      );
    });
  }

  function formatBytes(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  function triggerDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }
})();
