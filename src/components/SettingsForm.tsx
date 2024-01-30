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

  const getVertexCount = (path: string) => {
    const curveOperations = path.split("c");
    return curveOperations.length - 1;
  };
  const createStandardPath = (path: string, targetCount: number) => {
    const vertexCount = getVertexCount(path);
    console.log(vertexCount);
    const numberedVertexPath =
      path + "c0,0 0,0 0,0".repeat(targetCount - vertexCount);
    console.log(numberedVertexPath.split("c").length - 1);

    return numberedVertexPath;
  };

  const getMaxVertexCount = (
    paths: { path: SavedPath; animationPoints: number[] }[]
  ) => {
    const vertexCounts = paths.map((item) => getVertexCount(item.path.path));
    return Math.max(...vertexCounts);
  };

  const createAnimationSVG = async () => {
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
        let maxSVG = activeSVGs[0].svg;
        activeSVGs.forEach((item) => {
          //item.svg.paths = item.svg.paths.sort((a, b) => a.path.localeCompare(b.path));
          if (item.svg.paths.length > maxSVG.paths.length) {
            maxSVG = item.svg;
          }
        });
        const baseSVG = maxSVG;
        const max = baseSVG.paths.length;
        for await (const basePath of baseSVG.paths) {
          //svg1.paths.forEach((path, index) => {
          console.log("Progress:", index / max);
          setProgress(index / max);
          const animationPaths = activeSVGs.map((item) => {
            if (item.svg.paths[index]) {
              console.log(item.svg.paths[index]);
              return {
                path: item.svg.paths[index],
                animationPoints: item.animationPoints,
              };
            } else {
              const tempPath = {
                ...item.svg.paths[
                  Math.floor(item.svg.paths.length * Math.random())
                ],
              };
              tempPath.fill = "rgba(255,255,255,0)";
              tempPath.id += "placeholder";
              return {
                path: tempPath,
                animationPoints: item.animationPoints,
              };
            }
          });
          const option: string = "svg";
          if (option == "css") {
            animatePathsCSS(basePath, animationPaths, index);
          } else {
            animatePathsSVG(basePath, animationPaths, index);
          }

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

  const animatePathsSVG = (
    path1: SavedPath,
    otherPaths: { path: SavedPath; animationPoints: number[] }[],
    id: number
  ) => {
    const vertexCount = getMaxVertexCount(otherPaths);

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
    const generateAnimateElement = (
      name: string,
      keyframePoints: { value: string; time: number }[]
    ) => {
      let values = "";
      let keyTimes = "";
      keyframePoints
        .sort((a, b) => a.time - b.time)
        .forEach((point, index) => {
          if (index) {
            values += "; ";
            keyTimes += "; ";
          }
          values += point.value;
          keyTimes += point.time;
        });
      const animateElement = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "animate"
      );
      animateElement.setAttribute("attributeName", name);
      animateElement.setAttribute("dur", "4s");
      animateElement.setAttribute("repeatCount", "indefinite");
      animateElement.setAttribute("values", values);
      animateElement.setAttribute("keyTimes", keyTimes);
      return animateElement;
    };

    const keyframePointsPaths: { value: string; time: number }[] = [];
    numberedpaths.forEach((numPath) => {
      numPath.animationPoints.forEach((animPoint) => {
        keyframePointsPaths.push({
          value: numPath.standardPath,
          time: animPoint / 100,
        });
      });
    });
    const animateElementPaths = generateAnimateElement(
      "d",
      keyframePointsPaths
    );

    const keyframePointsFill: { value: string; time: number }[] = [];
    numberedpaths.forEach((numPath) => {
      numPath.animationPoints.forEach((animPoint) => {
        console.log(numPath.fill);
        let fill = numPath.fill;
        if (fill == "var(--path-fill)") {
          fill = "rgba(255,255,255,0)";
        }
        keyframePointsFill.push({
          value: fill,
          time: animPoint / 100,
        });
      });
    });

    const animateElementFill = generateAnimateElement(
      "fill",
      keyframePointsFill
    );
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
      pathElement.appendChild(animateElementPaths);
      pathElement.appendChild(animateElementFill);
      svgElement.appendChild(pathElement);
    };

    const newSVG = animationSVG.cloneNode(true) as SVGSVGElement;
    newSVG.setAttribute("id", `morph${id}`);

    addPathToSVG(numberedpath1, path1.fill, animationSVG, `morph${id}`);
  };

  // ANimate Paths SVG

  const animatePathsCSS = (
    path1: SavedPath,
    otherPaths: { path: SavedPath; animationPoints: number[] }[],
    id: number
  ) => {
    console.log(path1.fill);

    const vertexCount = getMaxVertexCount(otherPaths);

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
  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    if (!event.dataTransfer) {
      return;
    }
    if (event.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      [...event.dataTransfer.items].forEach((item, i) => {
        // If dropped items aren't files, reject them
        if (item.kind === "file") {
          const file = item.getAsFile();
          if (!file) {
            return;
          }
          console.log(`… file[${i}].name = ${file.name}`);
          readFile(file);
        }
      });
    } else {
      // Use DataTransfer interface to access the file(s)
      [...event.dataTransfer.files].forEach((file, i) => {
        console.log(`… file[${i}].name = ${file.name}`);
        readFile(file);
      });
    }
  };
  const handleFileInput = (event: ChangeEvent) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    readFile(file);
  };
  const readFile = (file: File | undefined) => {
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
    <div className="form-settings row justify-content-evenly">
      <h2>Options</h2>
      <div className="col col-7">
        <div className="mb-3">
          <label htmlFor="formFile" className="form-label">
            Import an SVG file
          </label>
          <input
            className="form-control"
            type="file"
            id="formFile"
            onChange={handleFileInput}
          />
        </div>
        <div className="form-floating">
          <div
            id="drop_zone"
            onDrop={(event) => handleDrop(event as unknown as DragEvent)}
          >
            <p>
              Drag one or more files to this <i>drop zone</i>.
            </p>

            <textarea
              className="form-control"
              placeholder="Import an SVG by selecting it above, writing or pasting the code here, or dropping it in the textbox. When you see the code, press Import SVG."
              id="svgInput"
              name="svgInput"
              onChange={() => console.log("I changed!")}
              ref={svgTextRef}
            ></textarea>

            <label htmlFor="svgInput">SVG Code</label>
          </div>
        </div>
      </div>
      <div className="col col-3">
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
      </div>
      
      <div className="row">
        <div className="col col-12">
          <AnimationTiming svgs={savedSVGs} />
          <button
            className="btn btn-primary"
            type="button"
            onClick={createAnimationSVG}
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
      </div>
    </div>
  );
};

export default SettingsForm;
