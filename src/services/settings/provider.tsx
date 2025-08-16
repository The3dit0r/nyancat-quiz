import { useEffect, useMemo, useRef, useState } from "react";
import { AppSettingsContext, type T_AppSettings } from "./context";
import { LocalVariable } from "../../utils/storage";

const storage = new LocalVariable<T_AppSettings>("app-settings", {
  sidepanelWidth: 750,
  fontSize: 16,
  setFontSize() {},
});

export default function AppSettingsProvider(props: React.PropsWithChildren) {
  const saveQueueRef = useRef<any>(0);
  function queueSaveSettings() {
    clearTimeout(saveQueueRef.current);
    saveQueueRef.current = setTimeout(() => storage.save(), 500);
  }

  const [sidepanelWidth, __setSPW] = useState(
    storage.value.sidepanelWidth ?? 750
  );
  const [fontSize, _setFontSize] = useState(storage.value.fontSize ?? 16);

  useEffect(() => {
    storage.value.sidepanelWidth = sidepanelWidth;
    storage.value.fontSize = fontSize;
    queueSaveSettings();
  }, [sidepanelWidth, fontSize]);

  const setSidePanelWidth = useMemo(() => __setSPW, []);
  const value = {
    sidepanelWidth,
    setSidePanelWidth,
    setFontSize: _setFontSize,
    fontSize,
  };

  return (
    <AppSettingsContext.Provider value={value}>
      {props.children}
    </AppSettingsContext.Provider>
  );
}
