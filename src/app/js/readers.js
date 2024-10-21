async function readFileAsImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const img = new Image();
    reader.onload = () => {
      img.src = reader.result;
    };
    img.onload = () => resolve(img);
    img.onerror = reject;
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function readFileAsJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(JSON.parse(reader.result));
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

export { readFileAsImage, readFileAsJSON };
