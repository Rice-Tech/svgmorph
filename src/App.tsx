import SettingsForm from "./assets/components/SettingsForm";
import SVGProcess from "./assets/components/SVGProcess";
import {SettingsProvider} from "./assets/components/SettingsProvider";

export const App = () => {
  return (
    <>
      <SettingsProvider >
        <SettingsForm/>
        <SVGProcess />;
      </SettingsProvider>
    </>
  );
};
export default App;
