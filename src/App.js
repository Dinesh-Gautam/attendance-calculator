import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";
import "./App.css";
import { Calendar } from "./components/Calendar";
import { GetClassInfo } from "./components/GetClassInfo";
import { GetStartAndEndDate } from "./components/GetStartAndEndDate";
import { GetSubjectNames } from "./components/GetSubjectNames";
import GetTodayAttendance from "./components/GetTodaysAttendance";
import { SetTimeTable } from "./components/SetTimeTable";
import { useStateContext } from "./context/stateContext";
import { isAllDataInserted } from "./utils";

function App() {
  const { info, edit, setEdit } = useStateContext();

  return (
    info !== null && (
      <>
        {(edit || !isAllDataInserted(info)) && (
          <div className="p-4 flex flex-col gap-4 items-start">
            <Card className="flex flex-row gap-2 justify-between">
              <GetClassInfo />
              <GetStartAndEndDate />
              <GetSubjectNames />
            </Card>
            <SetTimeTable />

            <Card className="mt-auto flex flex-row p-4 gap-2 justify-end fixed bottom-4 inset-x-4">
              <Button
                color="danger"
                variant="light"
                onClick={() => setEdit(false)}
              >
                Cancel
              </Button>
              <Button variant="flat" onClick={() => setEdit(false)}>
                Save Edit
              </Button>
            </Card>
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
