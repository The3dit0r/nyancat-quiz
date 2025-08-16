import shuffle from "shuffle-array";
import { round } from "./others";

export class Question {
  protected __content: string = "No content given";
  protected __options: T_QOptions[] = [];
  protected __answers: string[] = [];
  readonly type: string;
  readonly group: string;

  constructor(props: Partial<T_Question>) {
    this.__content = props.content ?? "No question content given";
    this.__options = props.options ?? [];
    this.__answers = props.answers ?? [];
    this.type = props.type ?? "NA";
    this.group = props.group || "";
  }

  getContent() {
    return this.__content;
  }

  getOptions(randomize = false) {
    if (!randomize) {
      return [...this.__options];
    }

    return shuffle([...this.__options], { copy: true });
  }

  getAnswers(type: "letter" | "text" = "letter"): string[] {
    switch (type) {
      case "text":
        return this.__answers.map(
          (q) => this.__options.find((o) => o.id === q)!.text
        );

      case "letter":
      default:
        return [...this.__answers];
    }
  }

  isCorrectAnswer(input: string) {
    return this.__answers.includes(input);
  }

  getScoreFromInput(input: string[] = [], mustBePerfect = false) {
    const ansLen = this.__answers.length;
    let count = 0;

    for (const i of input) {
      if (this.__answers.includes(i)) count++;
      else count--;
    }

    return Math.max(
      0,
      mustBePerfect ? Math.floor(count / ansLen) : round(count / ansLen)
    );
  }
}

export class InteractableQuestion extends Question {
  protected __input: Set<string> = new Set();

  public static fromQuestion(props: T_Question | Question) {
    if (props instanceof Question) {
      return new InteractableQuestion({
        content: props.getContent(),
        options: props.getOptions(),
        answers: props.getAnswers("letter"),
      });
    }

    return new InteractableQuestion(props);
  }

  getInput() {
    return Array.from(this.__input);
  }

  hasInput() {
    return this.__input.size !== 0;
  }

  getScore(mustBePerfect = false) {
    return this.getScoreFromInput(this.getInput(), mustBePerfect);
  }

  isSelected(l: string) {
    return this.__input.has(l);
  }

  select(l: string) {
    this.__input.add(l);
  }

  deselect(l?: string) {
    if (!l) {
      return this.__input.clear();
    }

    this.__input.delete(l);
  }

  toggle(l: string) {
    if (this.__input.has(l)) {
      this.deselect(l);
      return;
    }

    this.select(l);
  }
}

export class QuestionBankGroups {
  items: Record<string, string | never> = {};

  constructor(props: { items: Record<string, string | never> | undefined }) {
    this.items = props.items ?? {};
  }

  get(id: string) {
    return this.items[id] || `<unknown_group_${id}>`;
  }

  set(id: string, name: string, override = false) {
    if (Object.hasOwn(this.items, id) && !override) {
      return;
    }

    this.items[id] = name;
  }
}

export class QuestionBank {
  name: string = "Unnamed Question Bank";
  questions: ReadonlyArray<T_Question> = [];
  groups: QuestionBankGroups;

  constructor(bank: T_BankDetails) {
    this.name = bank.name;
    this.questions = bank.questions;
    this.groups = new QuestionBankGroups({ items: bank.groups });
  }

  getRandomQuestions(length = 50) {
    const res = shuffle.pick([...this.questions], { picks: length });

    if (Array.isArray(res)) {
      return res;
    }

    return [res];
  }

  getQuestions(length = 50, random = false) {
    let questions: T_Question[] = [];

    if (random) {
      questions = this.getRandomQuestions(length);
    } else {
      questions = this.questions.slice(0, length);
    }

    return questions.map((q) => InteractableQuestion.fromQuestion(q));
  }
}

export class StarrableItem<T> {
  starrable: true = true;
  readonly data: T;
  isStarred = false;

  constructor(item: T, starred = false) {
    this.data = item;
    this.isStarred = starred;
  }

  star() {
    this.isStarred = true;
  }

  unstar() {
    this.isStarred = false;
  }

  toggle() {
    this.isStarred = !this.isStarred;
    return this.isStarred;
  }
}
