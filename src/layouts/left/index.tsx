import { QuestionDisplay } from "../../components/QusetionDisplay";
import { useApp } from "../../services/providers/data";
import { useSettings } from "../../services/settings";

export default function LeftDisplay() {
  const app = useApp();
  const settings = useSettings();

  if (!app) {
    return (
      <div className="left-display display-panel p-4 flex aictr jcctr">
        No context is provided
      </div>
    );
  }

  const { currentIndex, questions } = app;

  const curItem = questions[currentIndex];
  const curQ = curItem?.data;

  if (!curItem || !curQ) {
    return <></>;
  }

  return (
    <div
      id="left-display"
      className="display-panel p-4 px-6 overflow-y-auto"
      style={{ width: settings.sidepanelWidth }}
    >
      <QuestionDisplay />
    </div>
  );
}
