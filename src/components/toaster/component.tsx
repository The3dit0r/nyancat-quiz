import { useEffect, useState } from "react";

import type { T_ToasterProps } from "./context";
import { merge } from "../../utils/string";
import { InfoIcon } from "@phosphor-icons/react";

function translateColor(color?: string) {
  switch (color) {
    case "primary":
      return "alert-primary";
    case "secondary":
      return "alert-secondary";
    case "accent":
      return "alert-accent";
    case "info":
      return "alert-info";
    case "success":
      return "alert-success";
    case "warning":
      return "alert-warning";
    case "error":
      return "alert-error";

    default:
    case "neutral":
      return "alert-neutral";
  }
}

export default function Toaster(props: T_ToasterProps & { active?: boolean }) {
  const [render, setRender] = useState(false);
  const { content, color, active } = props;

  const cColor = translateColor(color);
  const className = merge("alert", cColor);

  function toggle(a = false) {
    return () => setRender(a);
  }

  useEffect(() => {
    if (active) {
      toggle(true)();
      return;
    }

    const to = setTimeout(toggle(false), 2000);

    return () => {
      clearTimeout(to);
    };
  }, [active]);

  if (!render) {
    return;
  }

  const cs = content.split("<sub/>");

  return (
    <div
      className="toast toast-center h-32 transition-all z-100"
      style={{ opacity: active ? 1 : 0 }}
    >
      <div className={className}>
        <InfoIcon weight="fill" size="2rem" />
        <div className="flex coll pr-4">
          <span className="mb-0.5">{cs[0]}</span>
          <span className="text-xs font-mono">{cs[1]}</span>
        </div>
      </div>
    </div>
  );
}
