import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";
import { useMemo, useState } from "react";
import { noOfDays, subjects } from "../config";
import { useStateContext } from "../context/stateContext";
import { GetClassInfo } from "./GetClassInfo";
import { GetStartAndEndDate } from "./GetStartAndEndDate";
import { GetSubjectNames } from "./GetSubjectNames";
import {
  SetTimeTable,
  convertDefaultSubjectsToSubjectsValues,
  convertSubjectValuesToDefaultSubjectsValues,
} from "./SetTimeTable";

const defaultValues = {
  className: "",
  startDate: "",
  endDate: "",
  subjects: subjects.map(({ name, id }) => ({ name, id })),
};

export function Info() {
  const { info, edit, setEdit, setInfo } = useStateContext();

  const initialValues = {
    className: info?.className || defaultValues.className,
    datesValue: {
      startDate: info?.startDate || defaultValues.startDate,
      endDate: info?.endDate || defaultValues.endDate,
    },
    subjects: info?.subjects || defaultValues.subjects,
  };

  const [classNameValue, setClassNameValue] = useState(initialValues.className);
  const [datesValue, setDatesValue] = useState(initialValues.datesValue);
  const [subjectNamesValue, setSubjectNamesValue] = useState(
    initialValues.subjects
  );

  initialValues.subjectsValues = useMemo(
    () =>
      convertDefaultSubjectsToSubjectsValues(
        { subjects: subjectNamesValue, timeTable: info?.timeTable },
        noOfDays
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [subjectsValues, setSubjectsValues] = useState(
    initialValues.subjectsValues
  );

  const subjectNames = subjectNamesValue;

  return (
    <>
      {(edit.type === "info" || !edit) && (
        <div className="flex flex-row gap-4 justify-start flex-wrap">
          <GetClassInfo
            classNameValue={classNameValue}
            setClassNameValue={setClassNameValue}
            initialValue={initialValues.className}
          />
          <GetStartAndEndDate
            datesValue={datesValue}
            setDatesValue={setDatesValue}
            initialValue={initialValues.datesValue}
          />
          <GetSubjectNames
            subjectNamesValue={subjectNamesValue}
            setSubjectNamesValue={setSubjectNamesValue}
            initialValue={initialValues.subjects}
          />
        </div>
      )}

      {edit.type === "timetable" && (
        <SetTimeTable
          info={{ subjects: subjectNames }}
          subjectsValues={subjectsValues}
          setSubjectsValues={setSubjectsValues}
          initialValue={convertDefaultSubjectsToSubjectsValues(
            { subjects: initialValues.subjects, timeTable: subjects },
            noOfDays
          )}
        />
      )}
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
