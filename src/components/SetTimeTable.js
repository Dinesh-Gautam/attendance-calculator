import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";
import { Input, ScrollShadow, Select, SelectItem } from "@nextui-org/react";
import { useState } from "react";
import { subjects } from "../config";
import { getWeekName } from "../utills";
import { FormButton } from "./Forms";
import { useStateContext } from "../context/stateContext";

export function SetTimeTable() {
  const { info, setInfo } = useStateContext();
  const noOfDays = 5;
  const [subjectsValues, setSubjectsValues] = useState(
    convertDefaultSubjectsToSubjectsValues()
  );
  function convertDefaultSubjectsToSubjectsValues() {
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
  function convertSubjectValuesToDefaultSubjectsValues() {
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
  function onChangeHandler(value, day, index, key) {
    setSubjectsValues((prev) => ({
      ...prev,
      [day]: [
        ...prev[day].map((s, i) => (i === index ? { ...s, [key]: value } : s)),
      ],
    }));
  }

  return (
    <Card className="p-4 w-full mb-20">
      <form
        className="max-w-full w-full"
        onSubmit={(e) => {
          e.preventDefault();
          setInfo((prev) => ({
            ...prev,
            timeTable: convertSubjectValuesToDefaultSubjectsValues(),
          }));
        }}
      >
        {Array.from({ length: noOfDays }).map((_, day) => (
          <div className="w-full max-w-full mb-2" key={day + 1}>
            <span className="font-bold text-sm p-2">
              {getWeekName(day + 1)}
            </span>
            {/* <div className="flex flex-col gap-2 items-start md:items-center md:flex-row"> */}
            <ScrollShadow
              orientation="horizontal"
              className=" flex-1 flex flex-row gap-2 p-2 bg-default-100 rounded-2xl shadow-inner shadow-md overflow-auto items-center"
            >
              {subjectsValues[day + 1] &&
                subjectsValues[day + 1].map((subject, index) => (
                  <div
                    key={subject.id + index + day}
                    className="flex flex-col gap-1 bg-default-50 p-1 rounded-xl shadow-small focus-within:border-l-3"
                    style={{
                      minWidth: 200,
                      // minWidth:
                      //   100 * ((subject.endTime - subject.startTime) * 2),
                      borderColor: "hsl(var(--nextui-danger))",
                    }}
                  >
                    <div className="flex flex-row gap-1 flex-1 ">
                      <Select
                        variant="flat"
                        size="sm"
                        aria-label="Subject"
                        id="subjectsInput"
                        placeholder={"Subject " + (index + 1)}
                        selectedKeys={[subjectsValues[day + 1][index].name]}
                        onChange={(e) => {
                          onChangeHandler(
                            e.target.value,
                            day + 1,
                            index,
                            "name"
                          );
                          onChangeHandler(
                            info.subjects.find((s) => s.name === e.target.value)
                              .id,
                            day + 1,
                            index,
                            "id"
                          );
                        }}
                      >
                        {info?.subjects?.map((s) => (
                          <SelectItem key={s.name} value={s.name}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </Select>
                      <Button
                        variant="light"
                        isIconOnly
                        onClick={(e) => {
                          e.preventDefault();
                          setSubjectsValues((prev) => ({
                            ...prev,
                            [day + 1]: [
                              ...prev[day + 1].filter((s, i) => i !== index),
                            ],
                          }));
                        }}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          width="12"
                          height="12"
                          stroke="currentColor"
                          stroke-width="2"
                          fill="none"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="css-i6dzq1"
                        >
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </Button>
                    </div>

                    <div className="flex flex-row gap-1">
                      <Input
                        size="sm"
                        type={"number"}
                        min={8}
                        max={17}
                        placeholder="Start Time"
                        value={subjectsValues[day + 1][index].startTime}
                        onChange={(e) =>
                          onChangeHandler(
                            e.target.value,
                            day + 1,
                            index,
                            "startTime"
                          )
                        }
                      />
                      <Input
                        size="sm"
                        type={"number"}
                        min={8}
                        max={17}
                        placeholder="End Time"
                        value={subjectsValues[day + 1][index].endTime}
                        onChange={(e) =>
                          onChangeHandler(
                            e.target.value,
                            day + 1,
                            index,
                            "endTime"
                          )
                        }
                      />
                    </div>
                  </div>
                ))}

              <Button
                variant="flat"
                onClick={(e) => {
                  e.preventDefault();
                  setSubjectsValues((prev) => ({
                    ...prev,
                    [day + 1]: [
                      ...(prev[day + 1] || []),
                      { name: "", startTime: "", endTime: "" },
                    ],
                  }));
                }}
              >
                Add
              </Button>
            </ScrollShadow>
          </div>
          // </div>
        ))}
        <FormButton type="submit">Submit</FormButton>
      </form>
    </Card>
  );
}
