import { useContext, useRef, useState } from "react";
import { SettingsContext } from "./SettingsProvider";
import DOMPurify from "dompurify";
import { ProjectContext, SavedPath, SavedSVG } from "./ProjectProvider";

const SettingsForm = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { settings, updateSettings } = useContext(SettingsContext)!;
  const { project } = useContext(ProjectContext)!;
  const selectPath1 = useRef<HTMLSelectElement>(null);
  const selectPath2 = useRef<HTMLSelectElement>(null);

  const selectSVG1 = useRef<HTMLSelectElement>(null);
  const selectSVG2 = useRef<HTMLSelectElement>(null);
  const svgTextRef = useRef<HTMLTextAreaElement>(null);

  const handleSVGSelectChange = () => {
    try {
      if (!(selectSVG1.current && selectSVG2.current)) {
        return;
      }
      const svg1 = project.savedSVGs[parseInt(selectSVG1.current.value)];
      const svg2 = project.savedSVGs[parseInt(selectSVG2.current.value)];
      console.log(svg1.paths.length);
      console.log(svg2.paths.length);
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
  const handleSelectChange = () => {
    try {
      if (!(selectPath1.current && selectPath2.current)) {
        return;
      }
      const path1 = project.savedPaths[parseInt(selectPath1.current.value)];
      const path2 = project.savedPaths[parseInt(selectPath2.current.value)];
      animatePaths(path1, path2, 1);
    } catch {
      console.error("Could not create animation");
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
    const newSVG = animationSVG.cloneNode(true) as SVGSVGElement;
    newSVG.setAttribute("id", `morph${id}`);
    animationSVG.setAttribute("viewBox", path1.viewBox);
    const pathElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    pathElement.setAttribute("d", numberedpath1);
    pathElement.setAttribute("fill", path1.fill);
    pathElement.setAttribute("id", `morph${id}`);
    animationSVG.appendChild(pathElement);
  };

  const handleInputChange = async () => {
    console.log("Running input change process");
    setLoading((prev) => {
      console.log(prev);
      return prev;
    });

    if (!svgTextRef.current) {
      setLoading(false);
      return;
    }
    try {
      await new Promise((resolve) => setTimeout(resolve, 10));
      const value = svgTextRef.current.value;
      console.log("b4 dompurifuy");
      const newValue = DOMPurify.sanitize(value);
      console.log("after dompurify");
      updateSettings({ svgInput: newValue });
      console.log("afterupdate");
    } catch {
      console.error("Not able to process svg");
    } finally {
      console.log("Hello!");
      setLoading(false);
    }
  };

  return (
    <div className="form-settings">
      <h2>Inputs</h2>

      <div className="mb-3">
        <label htmlFor="formFile" className="form-label">
          Default file input example
        </label>
        <input className="form-control" type="file" id="formFile" />
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
        onChange={handleInputChange}
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
        onChange={handleInputChange}
      ></input>
      <button
        className="btn btn-primary"
        type="button"
        onClick={() => {
          setLoading(true);
          handleInputChange();
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
      <select
        ref={selectPath1}
        className="form-select"
        aria-label="Path"
        onChange={handleSelectChange}
      >
        <option disabled>Choose a Saved Path</option>
        {project.savedPaths.map((path, index) => (
          <option key={path.id + index} value={index}>
            {path.id + index}
          </option>
        ))}
      </select>
      <select
        ref={selectPath2}
        className="form-select"
        aria-label="Path"
        onChange={handleSelectChange}
      >
        <option disabled>Choose a Saved Path</option>
        {project.savedPaths.map((path, index) => (
          <option key={path.id + index} value={index}>
            {path.id + index}
          </option>
        ))}
      </select>

      <select
        ref={selectSVG1}
        className="form-select"
        aria-label="SVG 1 Select"
        onChange={() => console.log("select changed!")}
      >
        <option disabled>Choose a Saved SVG</option>
        {project.savedSVGs.map((svg, index) => (
          <option key={svg.paths[0].id + index} value={index}>
            {svg.paths[0].id + index}
          </option>
        ))}
      </select>
      <select
        ref={selectSVG2}
        className="form-select"
        aria-label="SVG 2 Select"
        onChange={() => console.log("select changed!")}
      >
        <option disabled>Choose a Saved SVG</option>
        {project.savedSVGs.map((svg, index) => (
          <option key={svg.paths[0].id + index} value={index}>
            {svg.paths[0].id + index}
          </option>
        ))}
      </select>
      <button
        className="btn btn-primary"
        type="button"
        onClick={() => {
          setLoading(true);
          handleSVGSelectChange();
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
          "Create Animation"
        )}
      </button>
    </div>
  );
};

export default SettingsForm;
