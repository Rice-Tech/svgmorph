import simplifySvgPath from "@luncheon/simplify-svg-path";
import { useEffect, useRef, useState, useContext } from "react";
//import ExternalSvg from "./external.svg";
import { SettingsContext } from "./SettingsProvider";

const SVGProcess = () => {
  const { settings } = useContext(SettingsContext)!;
  const modifiedSVGRef = useRef<SVGSVGElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const modifiedPathRef = useRef<SVGPathElement>(null);
  //const svgPath = useRef<SVGPathElement>(null);
  const [modifiedPath, setModifiedPath] = useState<string>("");
  const inputSVGPlaceholder = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inputSVGPlaceholder.current) {
      if (inputSVGPlaceholder.current) {
        inputSVGPlaceholder.current.innerHTML = settings.svgInput;
      }

      const svgPath = inputSVGPlaceholder.current.querySelector("path");
      if (svgPath) {
        // Get the total length of the path
        const totalLength = svgPath.getTotalLength();

        // Number of points to sample along the path
        const numPoints = settings.pathSteps;

        // Extract points from the path, filtering out undefined values
        const points: { x: number; y: number }[] = Array.from(
          { length: numPoints },
          (_, index) => {
            const length = (index / (numPoints - 1)) * totalLength;
            const point = svgPath.getPointAtLength(length);
            return point?.x !== undefined && point?.y !== undefined
              ? { x: point.x, y: point.y }
              : undefined;
          }
        ).filter(Boolean) as { x: number; y: number }[];
        const simplfiedPath = simplifySvgPath(points, {
          tolerance: 1,
          precision: 2,
        });
        console.log(simplfiedPath);
        setModifiedPath(simplfiedPath);
      }
    }
  }, [settings]);

  //simplifySvgPath(svgPath.ge);
  return (
    <>
      <div ref={inputSVGPlaceholder}>
        <svg
          ref={svgRef}
          viewBox="0 0 43 42"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="input-SVG">
            <path
              d="M7.5 25.5C21.5 13 16.5 3.50005 26 14.5C35.5 25.5 38 33 33 36C29 38.4 35 39.3333 38.5 39.5"
              stroke="green"
            ></path>
          </g>
        </svg>
      </div>
      <svg
        ref={modifiedSVGRef}
        viewBox="0 0 43 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="resampled-SVG">
          <path ref={modifiedPathRef} d={modifiedPath} stroke="red"></path>
        </g>
      </svg>
    </>
  );
  {
    /*
    <div>
      <svg
        ref={svgRef}
        viewBox="0 0 43 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="input-SVG">
          <path
            ref={svgPath}
            d="M7.5 25.5C21.5 13 16.5 3.50005 26 14.5C35.5 25.5 38 33 33 36C29 38.4 35 39.3333 38.5 39.5"
            stroke="green"
          ></path>
        </g>
      </svg>

      <svg
        ref={modifiedSVGRef}
        viewBox="0 0 43 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="resampled-SVG">
          <path ref={modifiedPathRef} d={modifiedPath} stroke="red"></path>
        </g>
      </svg>
      <svg viewBox="0 0 43 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <use xlinkHref={{ ExternalSvg } + "#Group1000"}></use>
      </svg>
      <svg
        id="line"
        viewBox="0 0 538 189"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="Frame 2">
          <path
            pathLength="100"
            id="Vector1"
            d="M123.5 89.5H247"
            stroke="black"
          ></path>
          <path
            id="Vector2"
            d="M123.5 95.5H247"
            stroke="black"
            pathLength="100"
          ></path>
        </g>
      </svg>
      <svg
        id="morph"
        viewBox="0 0 1403 863"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="Frame 4">
          <path
            pathLength="100"
            id="Vector 2"
            d="M1 208.404C512.601 21.7943 753.287 -24.6847 877.622 256.27C1001.96 537.225 830.068 625.306 981.5 723.5C1173.5 848 1213.81 739.164 1341 525.5"
            stroke="black"
          ></path>
        </g>
      </svg>
    </div>
  );*/
  }
};

export default SVGProcess;
