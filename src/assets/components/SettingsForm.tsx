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

      const animationSVG = document.getElementById(
        "morph"
      ) as SVGSVGElement | null;

      if (animationSVG) {
        animationSVG.innerHTML = "";
        animationSVG.setAttribute("viewBox", path1.viewBox);
        const pathElement = document.createElement("path");
        pathElement.setAttribute("d", path1.path);
        animationSVG.appendChild(pathElement);
        document.body.appendChild(animationSVG.cloneNode(true));
      }

      const morphStyleSheet = document.createElement("style");
      //getElementById("morphAnimationStyle") as HTMLStyleElement | null;
      if (morphStyleSheet) {
        morphStyleSheet.innerHTML =
          "@keyframes morphAnim {50%{d: path('" +
          path2.path +
          "' );}}#morph path{animation: morphAnim 2s ease 1s infinite alternate;}svg{width=50%}";
        document.head.appendChild(morphStyleSheet);
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