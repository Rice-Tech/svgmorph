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
    svgInput: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 239 75">
    <path fill-rule="evenodd" stroke="#000" stroke-linecap="round" stroke-width=".9" d="M10 74H0V4h10v30h34V4h10v70H44V42H10v32Zm103-22H76a24 24 0 0 0 1 5l4 6q5 4 11 4l9-1 6-2 3 8a41 41 0 0 1-5 1 52 52 0 0 1-4 1 39 39 0 0 1-5 1 52 52 0 0 1-5 0 28 28 0 0 1-7-1 21 21 0 0 1-10-6 24 24 0 0 1-6-9l-1-11a35 35 0 0 1 1-8 29 29 0 0 1 2-6 25 25 0 0 1 5-7 23 23 0 0 1 3-3 21 21 0 0 1 10-3 26 26 0 0 1 3 0q7 0 12 3t7 9a28 28 0 0 1 3 10 33 33 0 0 1 0 2 75 75 0 0 1 0 7 69 69 0 0 1 0 0Zm-37-8h29a24 24 0 0 0-1-4l-1-5a12 12 0 0 0-2-2 12 12 0 0 0-7-4 18 18 0 0 0-4 0 14 14 0 0 0-5 1 13 13 0 0 0-4 3q-4 4-5 11Zm48 14V0h9v57a21 21 0 0 0 1 3q0 3 2 5a7 7 0 0 0 4 2 11 11 0 0 0 2 0h4a22 22 0 0 0 1 0l2-1 2 7-3 1a35 35 0 0 1-1 1 24 24 0 0 1-4 0 31 31 0 0 1-2 0 21 21 0 0 1-5 0 18 18 0 0 1-4-2 13 13 0 0 1-5-4 16 16 0 0 1 0-1l-3-8a32 32 0 0 1 0-2Zm34 0V0h9v57a21 21 0 0 0 0 3l2 5a7 7 0 0 0 5 2 11 11 0 0 0 2 0h3a22 22 0 0 0 2 0l1-1 3 7-4 1a35 35 0 0 1-1 1 24 24 0 0 1-3 0 31 31 0 0 1-3 0 21 21 0 0 1-5 0 18 18 0 0 1-3-2 13 13 0 0 1-5-4 16 16 0 0 1-1-1q-2-3-2-8a32 32 0 0 1 0-2Zm42 14a25 25 0 0 0 5 2l9 1q7 0 13-3 6-4 9-10a26 26 0 0 0 3-7 34 34 0 0 0 0-7 35 35 0 0 0 0-6 26 26 0 0 0-3-9q-3-6-9-9a25 25 0 0 0-5-2 28 28 0 0 0-8-1 31 31 0 0 0-2 0 26 26 0 0 0-12 3q-6 3-9 10a26 26 0 0 0-3 7 35 35 0 0 0 0 7 35 35 0 0 0 0 4 27 27 0 0 0 3 10q3 6 9 10Zm14-5q7 0 12-5a19 19 0 0 0 4-8 27 27 0 0 0 0-6l-2-10a19 19 0 0 0-4-5 18 18 0 0 0-2-2l-8-2a19 19 0 0 0-6 0 14 14 0 0 0-7 5 18 18 0 0 0-3 7l-1 7q0 5 2 9a19 19 0 0 0 4 5 18 18 0 0 0 2 3q4 2 9 2Z" font-size="12" style="stroke:#000;stroke-width:.25mm;fill:#000" vector-effect="non-scaling-stroke"/>
  </svg>`,
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
