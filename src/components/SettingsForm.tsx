import { ChangeEvent, useContext, useRef, useState } from "react";
import { SettingsContext } from "./SettingsProvider";
import DOMPurify from "dompurify";
import { ProjectContext, SavedPath, SavedSVG } from "./ProjectProvider";
import AnimationTiming from "./AnimationTiming";

const SettingsForm = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { settings, updateSettings } = useContext(SettingsContext)!;
  const { project } = useContext(ProjectContext)!;

  const svgTextRef = useRef<HTMLTextAreaElement>(null);

  const createAnimation = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 10));

    try {
      /* if (project.animation.length < 2) {
        return;
      } */
      const activeSVGs = project.animation
        .filter((item) => item.animationPoints.length)
        .map((item) => item.svg);
      if (activeSVGs.length < 2) {
        return;
      }
      const svg1 = activeSVGs[0];
      const svg2 = activeSVGs[1];

      const clearPreviousAnimations = () => {
        const animationSVG = document.getElementById(
          "morph"
        ) as SVGSVGElement | null;
        if (animationSVG) {
          animationSVG.innerHTML = "";
        }

        const morphStyleSheet = document.getElementById("morphAnimationStyle");
        if (morphStyleSheet) {
          morphStyleSheet.innerHTML = "";
        }
      };

      clearPreviousAnimations();

      const generateSVGAnimations = async (svg1: SavedSVG, svg2: SavedSVG) => {
        let index = 0;
        const max = svg1.paths.length;
        for await (const path of svg1.paths) {
          //svg1.paths.forEach((path, index) => {
          console.log("Progress:", index / max);
          setProgress(index / max);
          if (svg2.paths[index]) {
            animatePaths(svg2.paths[index], path, index);
          } else {
            animatePaths(
              svg2.paths[Math.floor(svg2.paths.length * Math.random())],
              path,
              index
            );
          }
          index += 1;
        }
      };

      if (svg1.paths.length < svg2.paths.length) {
        generateSVGAnimations(svg2, svg1);
      } else {
        generateSVGAnimations(svg1, svg2);
      }
    } catch {
      console.error("could not create animations");
    } finally {
      setLoading(false);
    }
  };

  const animatePaths = (path1: SavedPath, path2: SavedPath, id: number) => {
    const getVertexCount = (path: string) => {
      const curveOperations = path.split("c");
      return curveOperations.length - 1;
    };
    console.log(path1.fill);
    const createStandardPath = (path: string, targetCount: number) => {
      const vertexCount = getVertexCount(path);
      console.log(vertexCount);
      const numberedVertexPath =
        path + "c0,0 0,0 0,0".repeat(targetCount - vertexCount);
      console.log(numberedVertexPath.split("c").length - 1);

      return numberedVertexPath;
    };

    const vertexCount1 = getVertexCount(path1.path);
    const vertexCount2 = getVertexCount(path2.path);
    let vertexCount;
    if (vertexCount1 > vertexCount2) {
      vertexCount = vertexCount1;
    } else {
      vertexCount = vertexCount2;
    }
    const numberedpath1 = createStandardPath(path1.path, vertexCount);
    const numberedpath2 = createStandardPath(path2.path, vertexCount);

    // Add 2nd SVG as style animation
    const morphStyleSheet = document.getElementById("morphAnimationStyle");
    if (morphStyleSheet) {
      morphStyleSheet.innerHTML += `@keyframes morphAnim${id} {
          to{
            d: path('${numberedpath2}' ); 
            fill:${path2.fill}
          }
        }
        #morph${id}{
          animation: morphAnim${id} var(--animation-duration) var(--animation-timing-function) var(--animation-delay) var(--animation-iteration-count) var(--animation-direction);
          animation-timeline: var(--animation-timeline);
        }
        svg{width:50%;
          z-index:1;
        }`;
      document.head.appendChild(morphStyleSheet);
    }

    // add first svg as svg on page
    const animationSVG = document.getElementById(
      "morph"
    ) as SVGSVGElement | null;
    if (!animationSVG) {
      return;
    }
    animationSVG.setAttribute("viewBox", path1.viewBox);
    const addPathToSVG = (
      pathString: string,
      pathFill: string,
      svgElement: SVGElement,
      id: string
    ) => {
      const pathElement = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      pathElement.setAttribute("d", pathString);
      pathElement.setAttribute("fill", pathFill);
      pathElement.setAttribute("id", id);
      svgElement.appendChild(pathElement);
    };

    const newSVG = animationSVG.cloneNode(true) as SVGSVGElement;
    newSVG.setAttribute("id", `morph${id}`);

    addPathToSVG(numberedpath1, path1.fill, animationSVG, `morph${id}`);
  };

  const handleAddSVG = async () => {
    console.log("Running input change");

    if (!svgTextRef.current) {
      setLoading(false);
      return;
    }
    try {
      await new Promise((resolve) => setTimeout(resolve, 10));
      const value = svgTextRef.current.value;
      const newValue = DOMPurify.sanitize(value);
      updateSettings({ svgInput: newValue });
    } catch {
      console.error("Not able to process svg");
    } finally {
      console.log("Hello!");
      setLoading(false);
    }
  };

  const handleFileInput = (event: ChangeEvent) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const fileContent = e.target?.result as string;
      if (svgTextRef.current && fileContent) {
        svgTextRef.current.value = fileContent;
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="form-settings">
      <h2>Inputs</h2>

      <div className="mb-3">
        <label htmlFor="formFile" className="form-label">
          Default file input example
        </label>
        <input
          className="form-control"
          type="file"
          id="formFile"
          onChange={handleFileInput}
        />
      </div>
      <div className="form-floating">
        <textarea
          className="form-control"
          placeholder="Leave a comment here"
          id="svgInput"
          name="svgInput"
          onChange={() => console.log("I changed!")}
          ref={svgTextRef}
        ></textarea>
        <label htmlFor="svgInput">SVG Code</label>
      </div>
      <label htmlFor="pathStepsInput" className="form-label">
        Path Steps for initial processing
      </label>
      <input
        type="range"
        className="form-range"
        min="2"
        max="1000"
        step="1"
        id="pathStepsInput"
        name="pathSteps"
        defaultValue={settings.pathSteps}
      ></input>
      <label htmlFor="toleranceInput" className="form-label">
        Resampling Tolerance
      </label>
      <input
        type="range"
        className="form-range"
        min=".5"
        max="10"
        step=".5"
        id="toleranceInput"
        name="tolerance"
        defaultValue={settings.tolerance}
      ></input>
      <button
        className="btn btn-primary"
        type="button"
        onClick={() => {
          setLoading(true);
          handleAddSVG();
        }}
        disabled={loading}
      >
        {loading ? (
          <>
            <span
              className="spinner-border spinner-border-sm"
              aria-hidden="true"
            ></span>
            <span role="status">Loading...</span>
          </>
        ) : (
          "Process SVG"
        )}
      </button>
      <div className="progress" role="progressbar" aria-label="Basic example">
        <div
          className="progress-bar"
          style={{ width: 100 * progress + "%" }}
        ></div>
      </div>

      <AnimationTiming svgs={project.savedSVGs} />
      <button
        className="btn btn-primary"
        type="button"
        onClick={createAnimation}
        disabled={loading}
      >
        {loading ? (
          <>
            <span
              className="spinner-border spinner-border-sm"
              aria-hidden="true"
            ></span>
            <span role="status">Loading...</span>
          </>
        ) : (
          "Create Animation"
        )}
      </button>
    </div>
  );
};

export default SettingsForm;
