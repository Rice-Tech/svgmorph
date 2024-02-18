import { ChangeEvent } from "react";
const readFile = (file: File | undefined): Promise<string> => {
  if (!file) {
    return Promise.resolve("");
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const fileContent = event.target?.result as string;
      resolve(fileContent);
    };
    reader.onerror = () => {
      reject(new Error("Error reading file"));
    };
    reader.readAsText(file);
  });
};

export const processDropFile = (event: DragEvent): Promise<string> => {
  event.preventDefault();
  if (!event.dataTransfer) {
    return Promise.resolve("");
  }

  const files = event.dataTransfer.items
    ? [...event.dataTransfer.items]
        .filter((item) => item.kind === "file")
        .map((item) => item.getAsFile())
    : [...event.dataTransfer.files];

  const fileContentPromises = files.map((file) => file && readFile(file));

  return Promise.all(fileContentPromises).then((fileContents) => {
    return fileContents.join("\n");
  });
};

export const processFileInput = (event: ChangeEvent): Promise<string> => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) {
    return Promise.resolve("");
  }

  return readFile(file);
};
