import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";
import { useState } from "react";
import "./App.css";
import { Calendar } from "./components/Calendar";
import { GetClassInfo } from "./components/GetClassInfo";
import { GetStartAndEndDate } from "./components/GetStartAndEndDate";
import { GetSubjectNames } from "./components/GetSubjectNames";
import GetTodayAttendance from "./components/GetTodaysAttendance";
import {
  SetTimeTable,
  convertDefaultSubjectsToSubjectsValues,
  convertSubjectValuesToDefaultSubjectsValues,
} from "./components/SetTimeTable";
import { noOfDays, subjects } from "./config";
import { useStateContext } from "./context/stateContext";
import { isAllDataInserted } from "./utils";

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

function Info() {
  const { info, edit, setEdit, setInfo } = useStateContext();

  const [classNameValue, setClassNameValue] = useState(info?.className || "");
  const [datesValue, setDatesValue] = useState({
    startDate: info?.startDate || "",
    endDate: info?.endDate || "",
  });
  const [subjectNamesValue, setSubjectNamesValue] = useState(
    info?.subjects || subjects.map(({ name, id }) => ({ name, id }))
  );
  const [subjectsValues, setSubjectsValues] = useState(
    convertDefaultSubjectsToSubjectsValues(
      { subjects: subjectNamesValue, timeTable: info?.timeTable },
      noOfDays
    )
  );

  return (
    <>
      <div className="flex flex-row gap-4 justify-start flex-wrap">
        <GetClassInfo
          classNameValue={classNameValue}
          setClassNameValue={setClassNameValue}
        />
        <GetStartAndEndDate
          datesValue={datesValue}
          setDatesValue={setDatesValue}
        />
        <GetSubjectNames
          subjectNamesValue={subjectNamesValue}
          setSubjectNamesValue={setSubjectNamesValue}
        />
      </div>

      <SetTimeTable
        info={{ subjects: subjectNamesValue }}
        subjectsValues={subjectsValues}
        setSubjectsValues={setSubjectsValues}
      />

      <Card className="mt-auto flex flex-row p-4 gap-2 justify-end fixed bottom-2 inset-x-2">
        {edit && (
          <Button color="danger" variant="light" onClick={() => setEdit(false)}>
            Cancel
          </Button>
        )}
        <Button
          variant="flat"
          onClick={() => {
            setInfo({
              ...info,
              className: classNameValue,
              startDate: datesValue.startDate,
              endDate: datesValue.endDate,
              subjects: subjectNamesValue,
              timeTable: convertSubjectValuesToDefaultSubjectsValues(
                { subjects: subjectNamesValue },
                subjectsValues
              ),
            });
            setEdit(false);
          }}
        >
          {edit ? "Save" : "Submit"}
        </Button>
      </Card>
    </>
  );
}

export default App;
