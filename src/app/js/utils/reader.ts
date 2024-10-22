async function readFileAsImage(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const img = new Image();
    reader.onload = () => {
      img.src = reader.result as string;
    };
    img.onload = () => resolve(img);
    img.onerror = reject;
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function readFileAsJSON(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(JSON.parse(reader.result as string));
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

export { readFileAsImage, readFileAsJSON };
