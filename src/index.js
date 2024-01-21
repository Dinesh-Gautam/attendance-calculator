import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { NextUIProvider } from "@nextui-org/react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <NextUIProvider>
      <Main />
    </NextUIProvider>
  </React.StrictMode>
);

function useDarkMode(defaultMode = false) {
  const [theme, setTheme] = useState(null);
  useEffect(() => {
    const mode = JSON.parse(localStorage.getItem("theme"));
    setTheme(mode ?? defaultMode);
  }, []);

  const toggleTheme = () => {
    localStorage.setItem("theme", JSON.stringify(!theme));
    setTheme((prev) => !prev);
  };
  return { theme, toggleTheme, value: theme ? "dark" : "" };
}

function Main() {
  const { toggleTheme, value } = useDarkMode(true);
  return (
    <main className={`${value} bg-background text-foreground`}>
      <App toggleTheme={toggleTheme} />
    </main>
  );
}
