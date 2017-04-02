export const readFileAsText = (FReader: { prototype: FileReader; new (): FileReader; }) =>
  (file: File) =>
    new Promise((resolve, reject) => {
      const reader = new FReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });
