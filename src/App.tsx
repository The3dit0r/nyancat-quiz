import { useEffect, useRef, useState } from "react";
import "./App.css";

import RightDisplay from "./layouts/right";
import LeftDisplay from "./layouts/left";
import StatusBar from "./layouts/status";

import { useSettings } from "./services/settings";

function App() {
  return (
    <div className="app-wrapper gap-main">
      <StatusBar />
      <div className="flex aictr flex-1 h-full">
        <LeftDisplay />
        <ResizingDivider />
        <RightDisplay />
      </div>
    </div>
  );
}

export function ResizingDivider() {
  const originX = useRef(0);
  const { setSidePanelWidth, sidepanelWidth } = useSettings();

  const [holding, setHolding] = useState(false);

  function handleMouseMove(e: MouseEvent) {
    setSidePanelWidth(sidepanelWidth + e.clientX - originX.current);
  }

  function handleMouseUp() {
    setHolding(false);
  }

  function handleMouseDown(e: React.MouseEvent) {
    e.preventDefault();
    setHolding(true);

    originX.current = e.clientX;
  }

  useEffect(() => {
    if (!holding) {
      const t = document.getElementById("left-display");
      if (!t) return;

      setSidePanelWidth(t.getBoundingClientRect().width);

      return;
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [holding]);

  return (
    <div
      className="w-4 h-1/2 m-auto hover:*:bg-base-content hover:*:h-full cursor-grab flex aictr jcctr"
      onMouseDown={handleMouseDown}
    >
      <div className="w-1 h-16 bg-base-200 rounded-xl transition-all"></div>
    </div>
  );
}

export default App;
