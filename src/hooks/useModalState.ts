import { useState } from "react";

export function useModalState() {
  const [shown, setShown] = useState(false);

  function open() {
    setShown(true);
  }

  function close() {
    setShown(false);
  }

  return { shown, open, close };
}

export type ModalState = ReturnType<typeof useModalState>;
export type PropsWithModal<T = unknown> = T & {
  modal: ModalState;
  onClose?: (...data: any[]) => void;
};
