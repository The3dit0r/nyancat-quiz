import { useState } from "react";

import { MinusSquareIcon, StarIcon } from "@phosphor-icons/react";
import { formatRomanNumeralList } from "../utils/string";

import { StarrableItem, type InteractableQuestion } from "../utils/test";
import { useSettings } from "../services/settings";
import { useApp } from "../services/providers/data";

export function QuestionDisplay() {
  const app = useApp();
  const [_, updateYouDumbDumb] = useState({});
  const { fontSize } = useSettings();

  if (!app) return <></>;
  const { prevQuestion, nextQuestion, currentIndex, questions, showAnswers } =
    app;

  const item = questions[currentIndex];

  const isStarrable = item instanceof StarrableItem;
  const curQ = isStarrable ? item.data : item;

  function clearOption() {
    curQ.deselect();
    updateYouDumbDumb({});
  }

  function toggleStar() {
    if (!isStarrable) {
      return;
    }

    item.toggle();
    updateYouDumbDumb({});
  }

  function isStarred() {
    return isStarrable && item.isStarred;
  }

  const indexDis = currentIndex + 1;
  const qLength = questions.length;

  return (
    <div>
      <div className="mt-8 flex aictr gap-2">
        <div className="font-bold text-md">Question {indexDis}</div>
        <div>|</div>
        <div className="text-sm">Select {curQ.getAnswers().length} options</div>
        <div className="flex-1 targt"> </div>
        <div className="text-sm font-mono">
          Score: {showAnswers ? curQ.getScore() : "-"} / 1
        </div>
      </div>

      <div className="my-4 flex gap-4">
        {curQ.hasInput() ? (
          <button
            className="btn btn-warning text-sm flex-1"
            onClick={clearOption}
          >
            <MinusSquareIcon size="1.5em" /> Clear
          </button>
        ) : (
          <button className="btn btn-warning flex-1" disabled>
            <MinusSquareIcon size="1.5em" /> Clear
          </button>
        )}
        {isStarred() ? (
          <button
            className="btn btn-secondary flex-1 gap-2"
            onClick={toggleStar}
          >
            <StarIcon weight="fill" />
            Starred
          </button>
        ) : (
          <button
            className="btn btn-secondary btn-soft flex-1 gap-2"
            onClick={toggleStar}
          >
            <StarIcon weight="bold" />
            Star
          </button>
        )}

        <button className="btn btn-soft flex-1" onClick={prevQuestion}>
          <div className="flex-1">Previous</div>
          <div className="w-8 targt border-base-content/40 border-l-1">
            {getPrev(indexDis, qLength)}
          </div>
        </button>
        <button className="btn btn-soft flex-1" onClick={nextQuestion}>
          <div className="flex-1">Next</div>
          <div className="w-8 targt border-base-content/40 border-l-1">
            {getNext(indexDis, qLength)}
          </div>
        </button>
      </div>

      <p
        className="my-8 whitespace-pre-line leading-7"
        style={{ fontSize: fontSize * 1.08 }}
      >
        {formatRomanNumeralList(curQ.getContent())}
      </p>

      <div
        className="text-[1em]"
        style={{
          pointerEvents: showAnswers ? "none" : "auto",
        }}
      >
        {curQ.getOptions().map((o) => (
          <Option
            {...o}
            selected={curQ.isSelected(o.id)}
            onClick={() => {
              curQ.toggle(o.id);
              updateYouDumbDumb({});
            }}
            style={{ fontSize }}
            correct={showAnswers ? curQ.isCorrectAnswer(o.id) : null}
          />
        ))}
      </div>
    </div>
  );
}

function Option({
  text,
  id,
  selected,
  correct,
  ...rest
}: {
  text: string;
  id: string;
  selected: boolean;
  correct: boolean | null;
} & React.JSX.IntrinsicElements["div"]) {
  const base =
    "p-4 flex-1 outline-[#0000] cart py-4 font-normal rounded-field hover:outline-base-content/40 outline-1 ";

  return (
    <div className="flex gap-4 aictr px-0 my-6 usn" {...rest}>
      <div className="w-8 h-8 flex aictr jcctr rounded-md border-1 text-xl cursor-pointer">
        {selected ? (
          <span className="fade-in">✓</span>
        ) : (
          <span className="fade-out">✓</span>
        )}
      </div>
      <div
        className={base + getColor(selected, correct)}
        style={{ transition: "all 0.1s" }}
        key={id}
      >
        {text}
      </div>
    </div>
  );
}

function getColor(selected: boolean, correct: boolean | null): string {
  if (selected) {
    if (typeof correct !== "boolean") {
      return "bg-primary/60";
    }

    if (!correct) {
      return "bg-error text-error-content";
    }
  }

  if (correct) {
    return selected
      ? "bg-success text-success-content"
      : "bg-success/20 outline-success outline-1";
  }

  return "";
}

function getNext(a = 1, m = 50) {
  return a > m - 1 ? 1 : a + 1;
}

function getPrev(a = 1, m = 50) {
  return a < 2 ? m : a - 1;
}
