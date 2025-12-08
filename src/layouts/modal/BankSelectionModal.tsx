import { useState } from "react";

import type { PropsWithModal } from "../../hooks/useModalState";
import { getAvailableBanks } from "../../services/providers/bank";
import { useToaster } from "../../components/toaster/context";
import { useApp } from "../../services/providers/data";
import { DatabaseIcon } from "@phosphor-icons/react";

const AVAILABLE_BANKS = getAvailableBanks();

export default function BankSelectionModal({ modal }: PropsWithModal) {
  const app = useApp();
  const [current, setCurrent] = useState(-1);

  const toaster = useToaster();

  if (!app) return "No context provided";
  if (!modal.shown) return;

  const selectedBank = AVAILABLE_BANKS[current] ?? null;

  function confirm() {
    if (!selectedBank) {
      toaster.warn("Please select a bank first!");
      return;
    }

    app!.setBankDetails(selectedBank);
    toaster.success("Switched to " + selectedBank.name);
    modal.close();
  }

  return (
    <div className="modal-container" onClick={modal.close}>
      <div className="content w-1/2" onClick={(e) => e.stopPropagation()}>
        <div className="p-2 mb-4 flex aictr">
          <div className="flex-1 flex coll">
            <div className="modal-title">
              Select a question bank ({AVAILABLE_BANKS.length} available)
            </div>
            <div className="text-xs">
              {selectedBank
                ? "Selecting: " + selectedBank.name
                : "Not selected"}
            </div>
          </div>

          <DatabaseIcon size={40} />
        </div>

        <div className="space-y-2">
          {AVAILABLE_BANKS.map((bank, index) => {
            const qs = bank.questions;

            let className =
              "cursor-pointer p-4 bg-base-200 rounded-box outline-2 hover:outline-primary/65 outline-[#0000]";

            if (index === current) {
              className += " bg-primary/10 outline-primary!";
            }

            return (
              <div
                className={className}
                style={{ transition: "outline-color 0.1s" }}
                onClick={() => setCurrent(index)}
              >
                <div className="flex spbtw">
                  <div className="text-lg">{bank.name}</div>
                  <div>{qs.length} questions</div>
                </div>
                <div className="opacity-70 text-sm">
                  {qs.filter((c) => c.type === "MC").length} Multiple Choice
                  <span>, </span>
                  {qs.filter((c) => c.type === "TF").length} True/False
                </div>
              </div>
            );
          })}
        </div>

        <div className="my-4 *:btn space-x-2 *:w-35 flex jcend">
          <button className="btn-soft" onClick={modal.close}>
            Cancel
          </button>
          <button className="btn-primary" onClick={confirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
