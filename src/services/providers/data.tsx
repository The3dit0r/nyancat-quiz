import React, { createContext, useContext, useEffect, useState } from "react";

import {
  QuestionBank,
  InteractableQuestion,
  StarrableItem,
} from "../../utils/test";

import { bank } from "./bank";

type T_AppContext = {
  bankDetails: QuestionBank;
  currentIndex: number;
  questions: StarrableItem<InteractableQuestion>[];

  nextQuestion(): void;
  prevQuestion(): void;
  setCurrentIndex: SetState<number>;

  showAnswers: boolean;
  toggleShowAnswers(b?: boolean): boolean;
  generateQuestionBank(
    length?: number,
    offset?: number,
    shuffle?: boolean
  ): void;

  clearAllAnswers(): void;
};

const AppContext = createContext<T_AppContext | null>(null);

export function AppContextProvider(props: React.PropsWithChildren) {
  const [bankDetails, _setBankDetails] = useState(new QuestionBank(bank));
  const [currentIndex, _setCurrentIndex] = useState(0);
  const [questions, _setQuestions] = useState<
    StarrableItem<InteractableQuestion>[]
  >([]);
  const [_showAnswers, _setShowAnswers] = useState(false);

  function generateQuestionBank(length = 50, offset = 0, shuffle = false) {
    console.log(
      "Generating",
      length,
      "questions starting from",
      offset + 1,
      shuffle ? "(Shuffled)" : ""
    );

    _setQuestions(
      bankDetails
        .getQuestions(length, offset, shuffle)
        .map((q) => new StarrableItem(q))
    );
    _setShowAnswers(false);
  }

  useEffect(() => {
    generateQuestionBank();
  }, []);

  function nextQuestion() {
    _setCurrentIndex((i) => (i + 1 >= questions.length ? 0 : i + 1));
  }

  function prevQuestion() {
    _setCurrentIndex((i) => (i - 1 < 0 ? questions.length - 1 : i - 1));
  }

  function toggleShowAnswers(b?: boolean) {
    b ??= !_showAnswers;
    _setShowAnswers(b);

    return b;
  }

  const value = {
    bankDetails,
    currentIndex,
    questions,

    prevQuestion,
    nextQuestion,
    setCurrentIndex: _setCurrentIndex,

    showAnswers: _showAnswers,
    toggleShowAnswers,

    clearAllAnswers() {
      questions.forEach((q) => q.data.deselect());
    },
    generateQuestionBank,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
}

export function useApp() {
  const data = useContext(AppContext);
  return data;
}

export function useShownAnswer() {
  const data = useContext(AppContext);

  if (data) {
    const { showAnswers, toggleShowAnswers } = data;
    return { showAnswers, toggleShowAnswers };
  }

  return null;
}
