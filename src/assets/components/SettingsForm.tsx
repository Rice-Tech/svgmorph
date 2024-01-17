import { useContext, ChangeEvent, useRef } from "react";
import { SettingsContext } from "./SettingsProvider";
import DOMPurify from "dompurify";
import { ProjectContext } from "./ProjectProvider";

const SettingsForm = () => {
  const { settings, updateSettings } = useContext(SettingsContext)!;
  const { project } = useContext(ProjectContext)!;
  const selectPath1 = useRef<HTMLSelectElement>(null);
  const selectPath2 = useRef<HTMLSelectElement>(null);
  const handleSelectChange = () => {
    if (selectPath1.current && selectPath2.current) {
      const path1 = project.savedPaths[parseInt(selectPath1.current.value)];
      const path2 = project.savedPaths[parseInt(selectPath2.current.value)];

      const getVertexCount = (path:string) =>{
        const curveOperations = path.split("c");
        return curveOperations.length - 1;
      }
      const createStandardPath = (path:string, targetCount) => {
        const vertexCount = getVertexCount(path)
        console.log(vertexCount);
        const numberedVertexPath =
          path + "c0,0 0,0 0,0".repeat(targetCount - vertexCount);
        console.log(numberedVertexPath.split("c").length - 1);
        return numberedVertexPath;
      };

      const vertexCount1 = getVertexCount(path1.path)
      const vertexCount2 = getVertexCount(path2.path)
      let vertexCount;
      if(vertexCount1>vertexCount2){
        vertexCount = vertexCount1;
      }
      else{
        vertexCount = vertexCount2;
      }
      const numberedpath1 = createStandardPath(path1.path, vertexCount);
      const numberedpath2 = createStandardPath(path2.path, vertexCount)

      const morphStyleSheet = document.getElementById("morphAnimationStyle");
      if (morphStyleSheet) {
        morphStyleSheet.innerHTML =
          "@keyframes morphAnim {50%{d: path('" +
          numberedpath2 +
          "' );}}#morph path{animation: morphAnim 2s ease 1s infinite alternate;}svg{width:50%;z-index:1;}";
        document.head.appendChild(morphStyleSheet);
      }
      const animationSVG = document.getElementById(
        "morph"
      ) as SVGSVGElement | null;

      if (animationSVG) {
        animationSVG.innerHTML = "";
        animationSVG.setAttribute("viewBox", path1.viewBox);
        const pathElement = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        pathElement.setAttribute("d", numberedpath1);
        animationSVG.appendChild(pathElement);
      }
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const newValue = name === "svgInput" ? DOMPurify.sanitize(value) : value;
    console.log(settings);
    updateSettings({ [name]: newValue });
  };

  return (
    <div className="form-settings">
      <h2>Inputs</h2>
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
      <div className="form-floating">
        <textarea
          className="form-control"
          placeholder="Leave a comment here"
          id="svgInput"
          name="svgInput"
          onChange={handleInputChange}
        ></textarea>
        <label htmlFor="svgInput">SVG Code</label>
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
    </div>
  );
};

export default SettingsForm;
