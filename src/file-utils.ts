type FReaderConst = typeof FileReader;

export const readFileAsText = (FileReader: FReaderConst) => (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });
