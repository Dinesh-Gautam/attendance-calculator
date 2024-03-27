import { NextUIProvider } from "@nextui-org/react";
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { StateProvider, useStateContext } from "./context/stateContext";
import "./index.css";

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

const App = React.lazy(() => import("./App"));
function Main() {
  const { theme } = useStateContext();
  return (
    <main className={`${theme.value} bg-background text-foreground`}>
      <Suspense>
        <App toggleTheme={theme.toggleTheme} />
      </Suspense>
    </main>
  );
}
(async () => {
  const serviceWorkerRegistration = await import("./serviceWorkerRegistration");
  serviceWorkerRegistration.register();
})();
