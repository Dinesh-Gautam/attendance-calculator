import React, { Suspense } from "react";
import "./App.css";
import { useStateContext } from "./context/stateContext";
import { isAllDataInserted } from "./utils";

const GetTodayAttendance = React.lazy(() =>
  import("./components/GetTodaysAttendance")
);
const Info = React.lazy(() => import("./components/Info"));
const Calendar = React.lazy(() => import("./components/Calendar"));

function App() {
  const { info, edit } = useStateContext();

  return (
    info !== null && (
      <>
        {(edit || !isAllDataInserted(info)) && (
          <div className="p-4 flex flex-col gap-4 items-start">
            <Suspense>
              <Info />
            </Suspense>
          </div>
        )}

        {!edit && isAllDataInserted(info) && (
          <>
            <Suspense>
              <GetTodayAttendance />
              <Calendar />
            </Suspense>
          </>
        )}
      </>
    )
  );
}

export default App;
