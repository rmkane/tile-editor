function getFormByName(name: string): HTMLFormElement | undefined {
  const forms = document.forms as unknown as { [key: string]: HTMLFormElement };
  return forms[name] || undefined;
}

function getFile(form: HTMLFormElement, name: string) {
  const fileInput = form.elements.namedItem(name) as HTMLInputElement;
  const { files } = fileInput;
  if (!files) {
    throw new Error(`File is not selected for "${name}" input`);
  }
  return files[0];
}

export { getFile, getFormByName };
