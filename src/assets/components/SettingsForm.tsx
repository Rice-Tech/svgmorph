import { useContext, ChangeEvent } from "react";
import { SettingsContext } from "./SettingsProvider";
import DOMPurify from "dompurify";

const SettingsForm = () => {
  const { settings, updateSettings } = useContext(SettingsContext)!;

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
    </div>
  );
};

export default SettingsForm;
