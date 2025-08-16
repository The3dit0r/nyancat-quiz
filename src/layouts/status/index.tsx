import { CaretDownIcon, DatabaseIcon } from "@phosphor-icons/react";
import { useApp } from "../../services/providers/data";
import { GenerateQuizPrompt } from "../modal/GenerateQuizPrompt";
import { useModalState } from "../../hooks/useModalState";
import BankListModal from "../modal/BankListModal";

import NyanCat from "../../assets/icon.png";
import { useToaster } from "../../components/toaster/context";

export default function StatusBar() {
  const app = useApp();
  const toaster = useToaster();

  const genModal = useModalState();
  const listModal = useModalState();

  if (!app) {
    return (
      <div className="display-panel flex aictr jcctr" style={{ height: 64 }}>
        No App context is provided
      </div>
    );
  }

  function showBankList() {
    toaster.warn("Sorry, but this function is not available!");
  }

  return (
    <div className="flex-0 flex aictr gap-4 display-panel p-4">
      <img src={NyanCat} width={60} />
      <div
        onClick={showBankList}
        className="bg-primary/20 hover:bg-primary/70 active:brightness-75 p-2 pr-4 rounded-box flex aictr gap-4 transition-all cursor-pointer usn"
      >
        <DatabaseIcon size="3em" />
        <div>
          <div className="text-md font-semibold">
            Question Bank: {app.bankDetails.name}
          </div>
          <div className="text-xs">
            Bank size: {app.bankDetails.questions.length} questions
          </div>
        </div>
        <div className="ml-8 border-l-1 w-8 flex jcend border-l-base-content/20">
          <CaretDownIcon weight="fill" />
        </div>
      </div>

      <div className="flex flex-1 aictr jcend gap-2">
        <button className="btn btn-primary" onClick={genModal.open}>
          Generate quiz
        </button>
        <button className="btn btn-secondary" onClick={listModal.open}>
          Show Question Bank
        </button>
      </div>

      <GenerateQuizPrompt modal={genModal} />
      <BankListModal modal={listModal} />
    </div>
  );
}
