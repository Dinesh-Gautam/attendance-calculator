import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";
import { useState } from "react";
import { GetClassInfo } from "./GetClassInfo";
import { GetStartAndEndDate } from "./GetStartAndEndDate";
import { GetSubjectNames } from "./GetSubjectNames";
import {
  SetTimeTable,
  convertDefaultSubjectsToSubjectsValues,
  convertSubjectValuesToDefaultSubjectsValues,
} from "./SetTimeTable";
import { noOfDays, subjects } from "../config";
import { useStateContext } from "../context/stateContext";

export function Info() {
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
        <div className="flex flex-row gap-2">
          {edit && (
            <Button
              color="danger"
              variant="light"
              onClick={() => setEdit(false)}
            >
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
        </div>
      </Card>
    </>
  );
}
