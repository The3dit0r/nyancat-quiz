import { createContext, useContext } from "react";

export type T_AppSettings = {
  sidepanelWidth: number;
  setFontSize: SetState<number>;
  fontSize: number;
};

export type T_AppMethod = {
  setSidePanelWidth: React.Dispatch<React.SetStateAction<number>>;
};

export type T_AppSettingsContext = (T_AppSettings & T_AppMethod) | null;

const AppSettingsContext = createContext<T_AppSettingsContext>(null);

export function useSettings() {
  const data = useContext(AppSettingsContext);

  if (!data) {
    throw new Error("Settings context is not found!");
  }

  return data;
}

export { AppSettingsContext };
