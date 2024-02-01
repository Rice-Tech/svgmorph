import SettingsForm from "./components/SettingsForm";
import SVGProcess from "./components/SVGProcess";
import { SettingsProvider } from "./components/SettingsProvider";
import { ProjectProvider } from "./components/ProjectProvider";
import Credits from "./Credits";
import { DraggableStory } from "./components/DraggableStory";



export const App = () => {
  return (
    <>
      <SettingsProvider>
        <ProjectProvider>
          {/* <Credits/> */}
          <DraggableStory style={{backgroundColor:"transparent", zIndex:"1000"}}/>
          {/* <DNDarea/> */}
          <main className=" font-mono p-2">
            <h1 className=" text-center text-3xl">SVG Morph Animator</h1>
            <SettingsForm/>
            <div id="resultDiv">
              <svg
                id="morph"
                fill="none"
                stroke="black"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="morphGroup"></g>
              </svg>
            </div>
            
            <SVGProcess />;
          </main>
        </ProjectProvider>
      </SettingsProvider>
    </>
  );
};
export default App;
