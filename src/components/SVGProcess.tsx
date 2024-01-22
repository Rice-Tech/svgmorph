import simplifySvgPath from "@luncheon/simplify-svg-path";
import { useEffect, useRef, useContext } from "react";
//import ExternalSvg from "./external.svg";
import { SettingsContext } from "./SettingsProvider";
import { ProjectContext } from "./ProjectProvider";
import { SavedPath } from "./ProjectProvider";

function generateUniqueId(): string {
  const timestamp: number = new Date().getTime();
  const random: number = Math.floor(Math.random() * 1000000); // Adjust the range as needed
  const uniqueId: string = `${timestamp}-${random}`;
  return uniqueId;
}

const SVGProcess = () => {
  const { settings } = useContext(SettingsContext)!;
  const { project } = useContext(ProjectContext)!;
  const inputSVGDiv = useRef<HTMLDivElement>(null);
  const modifiedSVGDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const processInputSVG = async () => {
      console.log("starting useEffect");
      if (inputSVGDiv.current && modifiedSVGDiv.current) {
        inputSVGDiv.current.innerHTML = settings.svgInput;
        const inputSVG = inputSVGDiv.current.querySelector(
          "svg"
        ) as SVGSVGElement | null;
        modifiedSVGDiv.current.innerHTML = "";
        document.body
          .querySelectorAll("p")
          .forEach((element) => element.remove());
        if (inputSVG) {
          const modifiedSVG = inputSVG.cloneNode(true) as SVGSVGElement;
          modifiedSVG.querySelectorAll("path").forEach((path) => path.remove());
          const inputViewBox = inputSVG.getAttribute("viewBox") as
            | string
            | "0 0 100 100";
          const svgPaths = inputSVG.querySelectorAll("path");
          const pathsToSave = [] as SavedPath[];
          svgPaths.forEach((svgPath) => {
            const points = getSVGPathPoints(svgPath);
            const simplifiedPath = simplifySvgPath(points, {
              tolerance: 1,
              precision: 2,
            });

            //const outputText = document.createElement("p");
            //outputText.innerHTML = numberedVertexPath;
            //document.body.appendChild(outputText);
            const modifiedSVGPath = svgPath.cloneNode(true) as SVGPathElement;
            modifiedSVGPath.setAttribute("d", simplifiedPath);
            modifiedSVG.appendChild(modifiedSVGPath);

            pathsToSave.push({
              path: simplifiedPath,
              inputPath: svgPath.getAttribute("d")!,
              viewBox: inputViewBox,
              id: generateUniqueId(),
              fill: svgPath.getAttribute("fill") || "var(--path-fill)",
              stroke: "red",
            });
          });
          modifiedSVGDiv.current!.appendChild(modifiedSVG);
          project.addSVG({ paths: pathsToSave, id: generateUniqueId()});
        }
      }
    };

    processInputSVG();
  }, [settings]);

  function getSVGPathPoints(inputPath: SVGPathElement) {
    // Get the total length of the path
    const totalLength = inputPath.getTotalLength();

    // Number of points to sample along the path
    const numPoints = settings.pathSteps;

    // Extract points from the path, filtering out undefined values
    const points: { x: number; y: number }[] = Array.from(
      { length: numPoints },
      (_, index) => {
        const length = (index / (numPoints - 1)) * totalLength;
        const point = inputPath.getPointAtLength(length);
        return point?.x !== undefined && point?.y !== undefined
          ? { x: point.x, y: point.y }
          : undefined;
      }
    ).filter(Boolean) as { x: number; y: number }[];
    return points;
  }
  return (
    <>
      <div ref={inputSVGDiv} id="inputSVGDiv">
        {" "}
      </div>
      <div ref={modifiedSVGDiv} id="modifiedSVGDiv"></div>
    </>
  );
};

export default SVGProcess;
