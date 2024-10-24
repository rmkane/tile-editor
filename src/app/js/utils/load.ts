async function loadImage(path: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = path;
    img.onload = () => {
      resolve(img);
    };
    img.onerror = reject;
  });
}

async function loadJSON<T>(filePath: string): Promise<T> {
  const response = await fetch(filePath);
  if (!response.ok) {
    throw new Error(`Failed to load JSON file. Status: ${response.status}`);
  }
  return response.json();
}

export { loadImage, loadJSON };
