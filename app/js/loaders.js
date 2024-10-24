async function loadImage(path) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = path;
    img.onload = () => {
      resolve(img);
    };
    img.onerror = reject;
  });
}

async function loadJSON(filePath) {
  const response = await fetch(filePath);
  if (!response.ok) {
    throw new Error(`Failed to load JSON file. Status: ${response.status}`);
  }
  return response.json();
}

export { loadImage, loadJSON };
