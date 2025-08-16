import {
  MagnifyingGlassMinusIcon,
  MagnifyingGlassPlusIcon,
} from "@phosphor-icons/react";

import { useApp } from "../../services/providers/data";
import { useState } from "react";
import { useSettings } from "../../services/settings";

export default function RightDisplay() {
  const app = useApp();

  const [catShown, showCat] = useState(false);

  if (!app) return <></>;

  const {
    currentIndex,
    questions,
    setCurrentIndex,
    toggleShowAnswers: _tgg,
    clearAllAnswers,
    showAnswers,
  } = app;

  const curQ = questions[currentIndex];
  if (!curQ) return <></>;

  function navQuestion(i: number) {
    return () => setCurrentIndex(i);
  }

  function toggleCat() {
    showCat((c) => !c);
  }

  function toggleShowAnswers() {
    const t = _tgg();
    if (t) return;

    clearAllAnswers();
  }

  const score = questions
    .map((q) => q.data.getScore(true))
    .reduce((p, c) => p + c);

  const perf = Math.round((score * 10000) / questions.length) / 100;

  return (
    <div
      id="right-display"
      className="display-panel flex coll usn overflow-hidden"
      style={{ "--bg": catShown ? "#0000" : "#000" } as any}
    >
      <div
        className="py-4 backdrop-blur-xs flex coll flex-1 gap-8"
        style={{
          opacity: catShown ? 0 : 1,
          pointerEvents: catShown ? "none" : "all",
          transition: "opacity 0.2s",
        }}
      >
        <div className="gap-2 grid grid-cols-8 overflow-y-auto px-4 py-2">
          {questions.map((__, _) => {
            const clss = ["btn btn-soft btn-active"];

            const props = {
              onClick: navQuestion(_),
              children: _ + 1,
              className: "btn",
            };

            if (showAnswers) {
              if (__.data.getScore() < 1) {
                clss.push("btn-error");
              } else {
                clss.push("btn-success");
              }
            } else if (__.data.hasInput()) {
              clss.push("btn-accent");
            }

            if (_ === currentIndex) {
              clss.push("outline-base-content outline-2");
            }

            props.className = clss.join(" ");

            return <button {...props} />;
          })}
        </div>
      </div>
      <div className="p-4 bg-base-100 flex aiend gap-4 rounded-t-box pt-8">
        <FontSizeAdjust />
        <div className="flex-1"></div>
        <div className="w-36 flex coll gap-2">
          <button
            className="btn btn-soft btn-success"
            onClick={toggleShowAnswers}
          >
            {showAnswers ? "Retry" : "Submit attempt"}
          </button>
          <button className="btn btn-accent" onClick={toggleCat}>
            {catShown ? "Show question" : "Show cat"}
          </button>
        </div>
      </div>

      {!showAnswers || (
        <div className="p-4 flex spbtw bg-black">
          <div>Final score:</div>
          <div className="font-bold">
            {score} / {questions.length} ({perf}%)
          </div>
        </div>
      )}
    </div>
  );
}

function FontSizeAdjust() {
  const { fontSize, setFontSize } = useSettings();
  const app = useApp();

  if (!app) return <></>;

  function incFontSize() {
    setFontSize((_) => Math.min(23, _ + 1));
  }

  function decFontSize() {
    setFontSize((_) => Math.max(8, _ - 1));
  }

  return (
    <div>
      <div className="text-sm mb-2">Font size</div>
      <div className="flex aictr gap-2">
        <button className="btn btn-square btn-sm" onClick={decFontSize}>
          <MagnifyingGlassMinusIcon size="1.3em" />
        </button>
        <div className="w-16 input">
          <input value={fontSize} className="tactr" />
        </div>
        <button className="btn btn-square btn-sm" onClick={incFontSize}>
          <MagnifyingGlassPlusIcon size="1.3em" />
        </button>
      </div>
    </div>
  );
}
