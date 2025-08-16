type T_QOptions = {
  text: string; // Question's option text
  id: string; // The letter of the option
};

type T_Question = {
  content: string; // Question content
  options: Array<T_QOptions>;
  answers: Array<string>; // The answer(s) to the question
  type: string; // Multiple Choice: MC, True/False: TF
  group: string; // MOOC id according to the question's group;
};

type T_BankDetails = {
  name: string;
  questions: Array<T_Question>;
  groups: Record<string, string | never>;
};

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;
