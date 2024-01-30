import SettingsForm from "./components/SettingsForm";
import SVGProcess from "./components/SVGProcess";
import { SettingsProvider } from "./components/SettingsProvider";
import { ProjectProvider } from "./components/ProjectProvider";

export const App = () => {
  return (
    <>
      <SettingsProvider>
        <ProjectProvider>
          <h1 style={{ textAlign: "center" }}>SVG Morph Animator</h1>
          <SettingsForm />
          <div id="resultDiv">
            <svg
              id="morph"
              fill="none"
              stroke="black"
              xmlns="http://www.w3.org/2000/svg"
            ></svg>
          </div>
          <SVGProcess />;
        </ProjectProvider>
      </SettingsProvider>
    </>
  );
};
export default App;
