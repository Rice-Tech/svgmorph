import SettingsForm from "./components/SettingsForm";
import SVGProcess from "./components/SVGProcess";
import { SettingsProvider } from "./components/SettingsProvider";
import { ProjectProvider } from "./components/ProjectProvider";
import { DraggableStory } from "./components/DraggableStory";
import { useRef } from "react";
import { Button } from "./components/ui/button";

export const App = () => {
  const resultDiv = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    const divElement = resultDiv.current;
    if (!divElement) {
      return;
    }
    const svg = divElement.innerHTML;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "image.svg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyCode = () => {
    const divElement = resultDiv.current;
    if (!divElement) {
      return;
    }
    const svgCode = divElement.innerHTML;

    navigator.clipboard
      .writeText(svgCode)
      .then(() => {
        alert("SVG code copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <>
      <SettingsProvider>
        <ProjectProvider>
          <main className=" font-mono p-2">
            <h1 className=" text-center text-3xl">SVG Morph Animator</h1>
            <SettingsForm />
            <div id="resultDiv" ref={resultDiv}>
              <svg
                id="morph"
                fill="none"
                stroke="black"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="morphGroup"></g>
              </svg>
            </div>
            <div className=" flex gap-4">
              <Button id="downloadBtn" onClick={handleDownload}>
                Download
              </Button>
              <Button id="copyBtn" onClick={handleCopyCode}>
                Copy Code
              </Button>
            </div>
            <SVGProcess />
            <DraggableStory
              style={{ backgroundColor: "transparent", zIndex: "1000" }}
            />
          </main>
        </ProjectProvider>
      </SettingsProvider>
    </>
  );
};
export default App;
