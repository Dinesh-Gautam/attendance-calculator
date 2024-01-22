import { useState } from "react";

export function useDarkMode(defaultMode = false) {
  const [theme, setTheme] = useState(
    JSON.parse(localStorage.getItem("theme") ?? defaultMode)
  );
  const toggleTheme = () => {
    localStorage.setItem("theme", JSON.stringify(!theme));
    setTheme((prev) => !prev);
  };
  return { theme, toggleTheme, value: theme ? "dark" : "" };
}
