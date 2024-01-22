import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { NextUIProvider } from "@nextui-org/react";
import { StateProvider, useStateContext } from "./context/stateContext";

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
