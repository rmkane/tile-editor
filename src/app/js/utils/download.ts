function downloadAsJSON<T>(data: T, filename: string = "data.json") {
  // Convert JSON object to string
  const jsonData = JSON.stringify(data, null, 2);

  // Create a Blob with the JSON data
  const blob = new Blob([jsonData], { type: "application/json" });

  // Create a temporary anchor element
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename; // Set the desired filename

  // Trigger the download
  link.click();

  // Clean up by revoking the object URL after a short delay
  setTimeout(() => {
    URL.revokeObjectURL(link.href);
  }, 100); // Delay added to ensure the download is completed
}

export { downloadAsJSON };
