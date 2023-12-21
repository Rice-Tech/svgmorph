import SettingsForm from "./assets/components/SettingsForm";
import SVGProcess from "./assets/components/SVGProcess";
import { SettingsProvider } from "./assets/components/SettingsProvider";
import { ProjectProvider } from "./assets/components/ProjectProvider";

export const App = () => {
  return (
    <>
      <SettingsProvider>
        <ProjectProvider>
          <SettingsForm />
          <div id="resultDiv">
            <svg
              id="morph"
              fill="none"
              stroke="black"
              xmlns="http://www.w3.org/2000/svg"
            >
              
            </svg>
          </div>
          <SVGProcess />;
        </ProjectProvider>
      </SettingsProvider>
    </>
  );
};
export default App;
