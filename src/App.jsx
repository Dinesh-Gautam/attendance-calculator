import "./App.css";
import { Calendar } from "./components/Calendar";
import GetTodayAttendance from "./components/GetTodaysAttendance";
import { useStateContext } from "./context/stateContext";
import { isAllDataInserted } from "./utils";
import { Info } from "./components/Info";

function App() {
  const { info, edit } = useStateContext();

  return (
    info !== null && (
      <>
        {(edit || !isAllDataInserted(info)) && (
          <div className="p-4 flex flex-col gap-4 items-start">
            <Info />
          </div>
        )}

        {!edit && isAllDataInserted(info) && (
          <>
            <GetTodayAttendance />
            <Calendar />
          </>
        )}
      </>
    )
  );
}

export default App;
