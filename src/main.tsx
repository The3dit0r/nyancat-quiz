import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";
import AppSettingsProvider from "./services/settings/provider.tsx";

import { AppContextProvider } from "./services/providers/data.tsx";
import { ToasterProvider } from "./components/toaster/context.tsx";

import "./styles/index.css";
import "./styles/theme.css";
import "./styles/app.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppSettingsProvider>
      <AppContextProvider>
        <ToasterProvider>
          <App />
        </ToasterProvider>
      </AppContextProvider>
    </AppSettingsProvider>
  </StrictMode>
);
