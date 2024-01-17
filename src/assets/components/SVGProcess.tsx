import simplifySvgPath from "@luncheon/simplify-svg-path";
import { useEffect, useRef, useContext } from "react";
//import ExternalSvg from "./external.svg";
import { SettingsContext } from "./SettingsProvider";
import { ProjectContext } from "./ProjectProvider";
import { SavedPath } from "./ProjectProvider";

const SVGProcess = () => {
  const { settings } = useContext(SettingsContext)!;
  const { project } = useContext(ProjectContext)!;
  const inputSVGDiv = useRef<HTMLDivElement>(null);
  const modifiedSVGDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
          | "0 0 50 50";
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
            id: "testing",
            fill: svgPath.getAttribute("fill") || "none",
            stroke: "red",
          });
        });
        console.table(project.savedPaths);
        modifiedSVGDiv.current!.appendChild(modifiedSVG);
        project.addPaths(pathsToSave);
      }
    }
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
