import simplifySvgPath from "@luncheon/simplify-svg-path";
import { useEffect, useRef, useContext } from "react";
//import ExternalSvg from "./external.svg";
import { SettingsContext } from "./SettingsProvider";

const SVGProcess = () => {
  const { settings } = useContext(SettingsContext)!;
  const inputSVGDiv = useRef<HTMLDivElement>(null);
  const modifiedSVGDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inputSVGDiv.current) {
      inputSVGDiv.current.innerHTML = settings.svgInput;
      const inputSVG = inputSVGDiv.current.querySelector(
        "svg"
      ) as SVGSVGElement | null;
      if (inputSVG && modifiedSVGDiv.current) {
        modifiedSVGDiv.current.innerHTML = "";
        const modifiedSVG = inputSVG.cloneNode(true) as SVGSVGElement;
        modifiedSVG.querySelectorAll("path").forEach((path) => path.remove());
        //const inputViewBox = inputSVG.viewBox;
        const svgPaths = inputSVG.querySelectorAll("path");
        svgPaths.forEach((svgPath) => {
          const points = getSVGPathPoints(svgPath);
          const simplfiedPath = simplifySvgPath(points, {
            tolerance: 1,
            precision: 2,
          });
          const modifiedSVGPath = svgPath.cloneNode(true) as SVGPathElement;
          modifiedSVGPath.setAttribute("d", simplfiedPath);
          modifiedSVG.appendChild(modifiedSVGPath);
        });
        modifiedSVGDiv.current!.appendChild(modifiedSVG);
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
      <div ref={inputSVGDiv}> </div>
      <div ref={modifiedSVGDiv}></div>
    </>
  );
};

export default SVGProcess;
