import { useState, createContext, ReactNode } from "react";

interface Settings {
  pathSteps: number;
  tolerance: number;
  precision: number;
  svgInput: string;
}
interface SettingsContextProps {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
}
const SettingsContext = createContext<SettingsContextProps | undefined>(
  undefined
);

interface Props {
  children: ReactNode;
}
const SettingsProvider = ({ children }: Props) => {
  const [settings, setSettings] = useState({
    pathSteps: 100,
    tolerance: 2.5,
    precision: 5,
    svgInput: "",
  });
  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings({ ...settings, ...newSettings });
  };
  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export { SettingsProvider, SettingsContext };
