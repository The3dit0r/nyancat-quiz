import { useState } from "react";
import { PenNibIcon } from "@phosphor-icons/react/dist/ssr";

import type { PropsWithModal } from "../../hooks/useModalState";
import { useApp } from "../../services/providers/data";
import { useToaster } from "../../components/toaster/context";

export function GenerateQuizPrompt({ modal, onClose }: PropsWithModal) {
  const app = useApp();
  const toaster = useToaster();

  const [length, setLength] = useState(50);
  const [shuffled, setShuffled] = useState(true);
  const [offset, setOffset] = useState(0);

  if (!app) return <>App context not found</>;
  if (!modal.shown) return <></>;

  function shuffleInput(e: any) {
    setShuffled(e.target.checked);
  }

  function lengthInput(e: any) {
    setLength(e.target.value);
  }

  function offsetInput(e: any) {
    setOffset(e.target.value);
  }

  function validateLength() {
    setLength(Math.max(5, Math.min(questions.length, length)));
  }

  function validateOffset() {
    setOffset(Math.max(0, Math.min(questions.length - 6, offset)));
  }

  function generate() {
    app?.generateQuestionBank(length, offset, shuffled);
    toaster.success("New quiz generated!");
    modal.close();

    if (onClose) onClose(true);
  }

  const { bankDetails } = app;
  const questions = bankDetails.questions;

  return (
    <div className="modal-container fade-in" onClick={modal.close}>
      <div
        className="content w-3/7 min-w-120!"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex aictr spbtw">
          <div className="">
            <div className="text-lg font-semibold">Generate quiz</div>
            <sub>Bank: {bankDetails.name}</sub>
          </div>
          <PenNibIcon size="2rem" />
        </div>

        <div className="my-8 flex aictr spbtw">
          <div>
            <div className="font-semibold">Randomize questions</div>
            <sub>Whether or not question be shuffled</sub>
          </div>
          <label className="label">
            <span className="mr-4">{shuffled ? "Yes" : "No"}</span>
            <input
              type="checkbox"
              className="toggle"
              onInput={shuffleInput}
              defaultChecked={shuffled}
            />
          </label>
        </div>

        <div
          className="my-8 flex aictr spbtw"
          style={
            shuffled
              ? {
                  pointerEvents: "none",
                  opacity: 0.3,
                  cursor: "not-allowed",
                }
              : {}
          }
        >
          <div>
            <div className="font-semibold">
              Question offset (0 - {questions.length - 6})
            </div>
            <sub>
              The starting question from the bank (Not available when shuffled)
            </sub>
          </div>
          <input
            type="number"
            className="input w-24"
            placeholder="1"
            min={0}
            max={questions.length - 5}
            onInput={offsetInput}
            onBlur={validateOffset}
            value={offset}
          />
        </div>

        <div className="my-8 flex aictr spbtw">
          <div>
            <div className="font-semibold">
              Number of question (5 - {questions.length})
            </div>
            <sub>Number of question in the quiz</sub>
          </div>
          <input
            type="number"
            className="input w-24"
            placeholder="50"
            min={5}
            max={questions.length}
            onInput={lengthInput}
            onBlur={validateLength}
            value={length}
          />
        </div>

        <div className="flex jcend gap-4">
          <button className="btn" onClick={modal.close}>
            Cancel
          </button>

          <button className="btn btn-primary" onClick={generate}>
            Generate quiz
          </button>
        </div>
      </div>
    </div>
  );
}
