import { useState } from "react";

import { useApp } from "../../services/providers/data";
import { filterQuestionFunc } from "../../utils/question";
import { useModalState, type PropsWithModal } from "../../hooks/useModalState";
import { GenerateQuizPrompt } from "./GenerateQuizPrompt";
import { XIcon } from "@phosphor-icons/react";

export default function BankListModal({ modal }: PropsWithModal) {
  const app = useApp();

  const genModal = useModalState();
  const [query, setQuery] = useState("");

  if (!app) return <>App context not found!</>;
  if (!modal.shown) return;

  const { bankDetails } = app;

  function handleInput(e: any) {
    setQuery(e.target.value);
  }

  function togglePrompt() {
    genModal.open();
  }

  const filtered = bankDetails.questions.filter(filterQuestionFunc(query));

  return (
    <div className="modal-container" onClick={modal.close}>
      <div
        className="content w-4/5 h-9/10 flex coll"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex aictr gap-4">
          <button
            className="btn btn-warning btn-square btn-sm btn-soft"
            onClick={modal.close}
          >
            <XIcon />
          </button>
          <div className="">
            <sub>
              Question Bank | Showing {filtered.length} out of{" "}
              {bankDetails.questions.length} questions
            </sub>
            <div className="modal-title">{bankDetails.name}</div>
          </div>
          <div className="flex-1"></div>
          <div className="input outline-none!">
            <input
              placeholder="Search"
              onInput={handleInput}
              onChange={handleInput}
              value={query}
            />
          </div>

          <button className="btn btn-primary btn-soft" onClick={togglePrompt}>
            Generate quiz
          </button>
        </div>

        <div className="h-8"></div>

        <div className="flex-1 overflow-y-scroll">
          {filtered.length ? (
            <div
              className="grid grid-cols-3 gap-4"
              style={{
                gridTemplateRows: `repeat(${Math.ceil(
                  filtered.length / 3
                )}, min(300px, 30%))`,
              }}
            >
              {filtered.map((q) => {
                return (
                  <div
                    className="card border-2 border-transparent rounded-field p-2 hover:border-primary transition-all"
                    style={{
                      backgroundColor:
                        q.type === "TF"
                          ? "var(--color-secondary)"
                          : "var(--color-base-200)",
                    }}
                  >
                    <div className="text-sm line-clamp-4 text-white/80">
                      Q: {q.content}
                    </div>
                    <div className="flex-1"></div>
                    <div className="text-sm font-semibold line-clamp-2">
                      A:{" "}
                      {q.answers
                        .map((a) => q.options.find((o) => o.id === a)?.text)
                        .join(", ")}
                    </div>

                    <div className="flex jcend mt-2 gap-1">
                      <div className="badge badge-sm badge-info font-bold">
                        {q.group}
                      </div>
                      <div className="badge badge-sm badge-warning font-bold">
                        {q.type}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="tactr w-full self-center">
              <div className="font-semibold">No question found with query</div>
              <div>'{query}'</div>
            </div>
          )}
        </div>
      </div>

      <GenerateQuizPrompt
        modal={genModal}
        onClose={(success) => !success || modal.close()}
      />
    </div>
  );
}
