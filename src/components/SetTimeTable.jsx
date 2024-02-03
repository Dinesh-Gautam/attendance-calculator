import { Button } from "@nextui-org/button";
import { Input, ScrollShadow, Select, SelectItem } from "@nextui-org/react";
import { useCallback, useMemo } from "react";
import { Plus, X } from "react-feather";
import { noOfDays, subjects } from "../config";
import { getWeekName } from "../utils";
import { Form, FormFooter } from "./Forms";

export function convertDefaultSubjectsToSubjectsValues(info, noOfDays) {
  const defaultSubjects = info?.timeTable || subjects;
  const subjectsValues = {};

  for (let day = 1; day <= noOfDays; day++) {
    subjectsValues[day] = [];

    for (const defaultSubject of defaultSubjects) {
      if (
        defaultSubject.lectures[day] &&
        info.subjects.find((s) => s.id === defaultSubject.id)
      ) {
        for (const lecture of defaultSubject.lectures[day]) {
          subjectsValues[day].push({
            name: info.subjects.find((s) => s.id === defaultSubject.id).name,
            id: info.subjects.find((s) => s.id === defaultSubject.id).id,
            startTime: lecture.startTime,
            endTime: lecture.endTime,
          });
        }
      }
    }
  }
  return subjectsValues;
}
export function convertSubjectValuesToDefaultSubjectsValues(
  info,
  subjectsValues
) {
  const days = Object.keys(subjectsValues);

  const res = info.subjects.map((sub) => {
    const lectures = {};
    for (const day of days) {
      if (!subjectsValues[day]) continue;
      if (!subjectsValues[day].find((s) => s.id === sub.id)) continue;
      if (lectures[day] === undefined) lectures[day] = [];
      for (const lecture of subjectsValues[day]) {
        if (lecture.id === sub.id) {
          lectures[day].push({
            startTime: +lecture.startTime,
            endTime: +lecture.endTime,
          });
        }
      }
    }
    return {
      name: sub.name,
      id: sub.id,
      lectures,
    };
  });
  return res;
}

export function SetTimeTable({
  info,
  subjectsValues,
  setSubjectsValues,
  initialValue,
}) {
  const onChangeHandler = useCallback((value, day, index, key) => {
    setSubjectsValues((prev) => ({
      ...prev,
      [day]: prev[day].map((s, i) =>
        i === index ? { ...s, [key]: value } : s
      ),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const daysArray = useMemo(() => Array.from({ length: noOfDays }), []);
  return (
    <Form className="mb-14">
      {daysArray.map((_, day) => (
        <DayKey
          key={day + 1}
          day={day + 1}
          subjectsValues={subjectsValues}
          onChangeHandler={onChangeHandler}
          setSubjectsValues={setSubjectsValues}
          info={info}
        />
      ))}
      <FormFooter
        state={subjectsValues}
        setState={setSubjectsValues}
        initialValue={initialValue}
      />
      {/* <FormButton type="submit">Submit</FormButton> */}
    </Form>
  );
}

function DayKey({
  day,
  subjectsValues,
  onChangeHandler,
  setSubjectsValues,
  info,
}) {
  return (
    <div className="w-full max-w-full mb-2">
      <DayLabel day={day} />

      <SubjectsList
        day={day}
        subjectsValues={subjectsValues}
        onChangeHandler={onChangeHandler}
        setSubjectsValues={setSubjectsValues}
        info={info}
      />
    </div>
  );
}

function DayLabel({ day }) {
  const weekName = useMemo(() => getWeekName(day), [day]);
  return <span className="font-bold text-sm p-2">{weekName}</span>;
}

function SubjectsList({
  day,
  subjectsValues,
  onChangeHandler,
  setSubjectsValues,
  info,
}) {
  return (
    <ScrollShadow
      orientation="horizontal"
      className="flex-1 flex flex-row gap-2 p-2 bg-default-100 rounded-2xl shadow-inner overflow-auto items-center"
    >
      {subjectsValues[day] &&
        subjectsValues[day].map((subject, index) => (
          <SubjectKey
            key={`${subject.id}-${index}-${day}`}
            day={day}
            index={index}
            subject={subject}
            onChangeHandler={onChangeHandler}
            setSubjectsValues={setSubjectsValues}
            info={info}
          />
        ))}

      <AddSubjectButton day={day} setSubjectsValues={setSubjectsValues} />
    </ScrollShadow>
  );
}

function AddSubjectButton({ day, setSubjectsValues }) {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Button
        isIconOnly
        size="lg"
        variant="flat"
        onClick={(e) => {
          setSubjectsValues((prev) => ({
            ...prev,
            [day]: prev[day].concat({
              name: "",
              id: "",
              startTime: "",
              endTime: "",
            }),
          }));
        }}
      >
        <Plus />
      </Button>
    </div>
  );
}

function SubjectKey({
  day,
  index,
  subject,
  onChangeHandler,
  setSubjectsValues,
  info,
}) {
  return (
    <div
      className="flex flex-col gap-1 bg-default-50 p-1 rounded-xl shadow-md focus-within:border-l-3"
      style={{
        width: 200,
        minWidth: 200,
        borderColor: "hsl(var(--nextui-danger))",
      }}
    >
      <SubjectNameInput
        day={day}
        index={index}
        subjectId={subject.id}
        subjects={info?.subjects}
        setSubjectsValues={setSubjectsValues}
        onChangeHandler={onChangeHandler}
      />

      <StartTimeEndTimeInputs
        day={day}
        index={index}
        startTime={subject.startTime}
        endTime={subject.endTime}
        onChangeHandler={onChangeHandler}
      />
    </div>
  );
}

function StartTimeEndTimeInputs({
  day,
  index,
  startTime,
  endTime,
  onChangeHandler,
}) {
  const minStartTime = 8;
  const maxEndTime = 22;
  return (
    <div className="flex flex-row gap-2">
      <Input
        type="number"
        size="sm"
        aria-label="Start Time"
        id="startTimeInput"
        placeholder={"Start Time " + (index + 1)}
        value={startTime}
        min={minStartTime}
        max={maxEndTime}
        onChange={(e) =>
          onChangeHandler(e.target.value, day, index, "startTime")
        }
      />
      <Input
        type="number"
        size="sm"
        aria-label="End Time"
        id="endTimeInput"
        placeholder={"End Time " + (index + 1)}
        value={endTime}
        min={minStartTime}
        max={maxEndTime}
        onChange={(e) => onChangeHandler(e.target.value, day, index, "endTime")}
      />
    </div>
  );
}

function SubjectNameInput({
  day,
  index,
  subjectId,
  subjects,
  setSubjectsValues,
  onChangeHandler,
}) {
  const selectedKey = useMemo(
    () => subjects.find((s) => s.id === subjectId)?.name,
    [subjectId, subjects]
  );
  return (
    <div className="flex flex-row gap-2">
      <Select
        variant="flat"
        size="sm"
        aria-label="Subject"
        id="subjectsInput"
        placeholder={"Subject " + (index + 1)}
        selectedKeys={[selectedKey]}
        onChange={(e) => {
          onChangeHandler(e.target.value, day, index, "name");
          onChangeHandler(
            subjects.find((s) => s.name === e.target.value).id,
            day,
            index,
            "id"
          );
        }}
      >
        {subjects?.map((s) => (
          <SelectItem key={s.name} value={s.name}>
            {s.name}
          </SelectItem>
        ))}
      </Select>
      <RemoveSubjectButton
        day={day}
        index={index}
        setSubjectsValues={setSubjectsValues}
      />
    </div>
  );
}

function RemoveSubjectButton({ day, index, setSubjectsValues }) {
  return (
    <Button
      variant="light"
      size="sm"
      isIconOnly
      onClick={(e) => {
        setSubjectsValues((prev) => ({
          ...prev,
          [day]: prev[day].filter((s, i) => i !== index),
        }));
      }}
    >
      <X size="1.2em" opacity="0.5" />
    </Button>
  );
}
