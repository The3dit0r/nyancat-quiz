import { MoonIcon, SunIcon, type Icon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

const THEMES: Record<string, { icon: Icon; toggle: string }> = {
  light: { icon: SunIcon, toggle: "dark" },
  dark: { icon: MoonIcon, toggle: "light" },
};

const VALID = Object.keys(THEMES);

function fetchTheme() {
  const t = window.localStorage.getItem("data-theme") ?? "";

  if (!THEMES[t]) {
    return VALID[0];
  }

  return t;
}

function saveTheme(theme: string) {
  window.localStorage.setItem("data-theme", theme);
  document.documentElement.setAttribute("data-theme", "my-" + theme);
}

export default function ToggleThemeButton() {
  const [curTheme, setCurTheme] = useState(fetchTheme());

  useEffect(() => {
    saveTheme(curTheme);
  }, [curTheme]);

  const Theme = THEMES[curTheme];
  return (
    <div className="coll">
      <button
        className="btn btn-primary btn-soft"
        onClick={() => setCurTheme(Theme.toggle)}
      >
        <Theme.icon size={20} />
      </button>
    </div>
  );
}
