import { NextUIProvider } from "@nextui-org/react";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { StateProvider, useStateContext } from "./context/stateContext";
import "./index.css";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <NextUIProvider>
      <StateProvider>
        <Main />
      </StateProvider>
    </NextUIProvider>
  </React.StrictMode>
);

function Main() {
  const { theme } = useStateContext();
  return (
    <main className={`${theme.value} bg-background text-foreground`}>
      <App toggleTheme={theme.toggleTheme} />
    </main>
  );
}

serviceWorkerRegistration.register();
