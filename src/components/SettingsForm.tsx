import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import { SettingsContext } from "./SettingsProvider";
import DOMPurify from "dompurify";
import { ProjectContext, SavedPath, SavedSVG } from "./ProjectProvider";
import AnimationTiming from "./AnimationTiming";

const SettingsForm = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [svgPathCSSVarsString, setSVGPathCSSVarsString] = useState("");
  const { settings, updateSettings } = useContext(SettingsContext)!;
  const { savedSVGs, animation } = useContext(ProjectContext)!;

  const svgTextRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const pathVarsStyleElement = document.getElementById("svgPathCSSVariables");
    if (!pathVarsStyleElement) {
      return;
    }
    pathVarsStyleElement.innerHTML = `
    :root{
      ${svgPathCSSVarsString}
    }`;
  }, [svgPathCSSVarsString]);

  const createAnimation = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 10));

    try {
      /* if (project.animation.length < 2) {
        return;
      } */
      const activeSVGs = animation.filter(
        (item) => item.animationPoints.length
      );
      if (activeSVGs.length < 2) {
        return;
      }

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
      setSVGPathCSSVarsString("");
      activeSVGs;
      const generateSVGAnimations = async (
        activeSVGs: {
          svg: SavedSVG;
          animationPoints: number[];
        }[]
      ) => {
        let index = 0;
        const baseSVG = activeSVGs[0].svg;
        const max = baseSVG.paths.length;
        for await (const basePath of baseSVG.paths) {
          //svg1.paths.forEach((path, index) => {
          console.log("Progress:", index / max);
          setProgress(index / max);
          const animationPaths = activeSVGs
            .map((item) => {
              if (item.svg.paths[index]) {
                return {
                  path: item.svg.paths[index],
                  animationPoints: item.animationPoints,
                };
              } else {
                return {
                  path: item.svg.paths[
                    Math.floor(item.svg.paths.length * Math.random())
                  ],
                  animationPoints: item.animationPoints,
                };
              }
            });
          animatePaths(basePath, animationPaths, index);
          index += 1;
        }
      };

      generateSVGAnimations(activeSVGs);
    } catch {
      console.error("could not create animations");
    } finally {
      setLoading(false);
    }
  };

  const animatePaths = (
    path1: SavedPath,
    otherPaths: { path: SavedPath; animationPoints: number[] }[],
    id: number
  ) => {
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
    const vertexCounts = otherPaths.map((item) =>
      getVertexCount(item.path.path)
    );
    vertexCounts.push(getVertexCount(path1.path));

    const vertexCount = Math.max(...vertexCounts);

    const numberedpath1 = createStandardPath(path1.path, vertexCount);

    const numberedpaths = otherPaths.map((item) => {
      const standardPath = createStandardPath(item.path.path, vertexCount);
      return {
        standardPath: standardPath,
        animationPoints: item.animationPoints,
        fill: item.path.fill,
        id: item.path.id,
      };
    });
    const morphStyleSheet = document.getElementById("morphAnimationStyle");
    if (!morphStyleSheet) {
      return;
    }
    numberedpaths.forEach((item) => {
      setSVGPathCSSVarsString(
        (prev) =>
          prev +
          " " +
          `--path${item.id + vertexCount}: path("${item.standardPath}");`
      );
    });
    const keyframes = numberedpaths
      .map(
        (item) => `
      ${item.animationPoints
        .map((keyframe) => String(keyframe) + "%")
        .join(", ")}{
        d: var(--path${item.id + vertexCount});
        fill:${item.fill};
      }
    `
      )
      .join("");
    morphStyleSheet.innerHTML += `@keyframes morphAnim${id} {
      ${keyframes}
    }`;

    morphStyleSheet.innerHTML += `#morph${id}{
      animation: morphAnim${id} var(--animation-duration) var(--animation-timing-function) var(--animation-delay) var(--animation-iteration-count) var(--animation-direction);
      animation-timeline: var(--animation-timeline);
    }`;
    // Add 2nd SVG as style animation
    document.head.appendChild(morphStyleSheet);

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

      <AnimationTiming svgs={savedSVGs} />
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
