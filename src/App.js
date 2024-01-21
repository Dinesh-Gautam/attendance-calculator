import { useEffect, useMemo, useState } from "react";
import "./App.css";
import Chart from "react-google-charts";
import GetTodayAttendance from "./components/GetTodaysAttendance";
import { Card } from "@nextui-org/card";
import { Button } from "@nextui-org/button";

const subjects = [
  {
    id: 2,
    name: "OS",
    lectures: {
      1: [
        {
          startTime: 9,
          endTime: 10,
        },
      ],
      2: [{ startTime: 9, endTime: 10 }],
      5: [{ startTime: 10, endTime: 11 }],
    },
  },
  {
    id: 1,
    name: "BI",
    lectures: {
      1: [
        {
          startTime: 10,
          endTime: 11,
        },
      ],
      2: [{ startTime: 14, endTime: 15 }],
      5: [{ startTime: 9, endTime: 10 }],
    },
  },
  {
    id: 6,
    name: "SE",
    lectures: {
      1: [
        {
          startTime: 11,
          endTime: 12,
        },
      ],
      3: [{ startTime: 10, endTime: 11 }],
      5: [{ startTime: 14, endTime: 15 }],
    },
  },
  {
    id: 5,
    name: "DBMS",
    lectures: {
      1: [
        {
          startTime: 12,
          endTime: 13,
        },
      ],
      2: [{ startTime: 10, endTime: 11 }],
      5: [{ startTime: 12, endTime: 13 }],
    },
  },
  {
    id: 4,
    name: "AAD",
    lectures: {
      1: [
        {
          startTime: 14,
          endTime: 15,
        },
      ],
      3: [{ startTime: 14, endTime: 15 }],
      4: [{ startTime: 14, endTime: 15 }],
    },
  },
  {
    id: 3,
    name: "DA",
    lectures: {
      3: [{ startTime: 9, endTime: 10 }],
      5: [{ startTime: 11, endTime: 12 }],
    },
  },
  {
    id: 9,
    name: "DBMS Lab",
    lectures: {
      2: [{ startTime: 11, endTime: 13 }],
      4: [{ startTime: 15, endTime: 17 }],
    },
  },
  {
    id: 7,
    name: "OS Lab",
    lectures: {
      3: [{ startTime: 11, endTime: 13 }],
      4: [{ startTime: 9, endTime: 11 }],
    },
  },
  {
    id: 8,
    name: "AAD Lab",
    lectures: {
      2: [{ startTime: 15, endTime: 17 }],
      4: [{ startTime: 11, endTime: 13 }],
    },
  },
];

export function TimeTable({ days, info }) {
  const subjects = info.timeTable;
  return (
    <Card className="mx-4 p-4 flex flex-row justify-center overflow-auto min-w-fit">
      <table className="timetable" borderSpacing="1">
        <thead>
          <tr>
            <td />
            {Array.from({ length: getNoOfWeeks(subjects) }).map((_, weekNo) => {
              return <th>{getWeekName(weekNo + 1)}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {Array.from({
            length:
              getMaxEndTimeOfSubjects(subjects) -
              getMinStartTimeOfSubjects(subjects),
          }).map((_, time) => {
            return (
              <tr>
                <th>
                  <span>
                    {formatTimeTo12HourFormat(
                      time + getMinStartTimeOfSubjects(subjects)
                    )}
                  </span>
                  -
                  <span>
                    {formatTimeTo12HourFormat(
                      time + 1 + getMinStartTimeOfSubjects(subjects)
                    )}
                  </span>
                </th>
                {Array.from({ length: getNoOfWeeks(subjects) }).map(
                  (_, weekNo) => {
                    const subject = getSubjectAtTime(
                      subjects,
                      time + getMinStartTimeOfSubjects(subjects),
                      weekNo
                    );
                    const prevSubject = findSubjectWhosEndTimeIsBeforeTime(
                      subjects,
                      time + getMinStartTimeOfSubjects(subjects),
                      weekNo
                    );

                    if (!subject && prevSubject) return null;
                    if (!subject) return <td />;
                    console.log(subject);
                    const presentRatio = getSubjectPresentRatio(
                      subject.id,
                      days
                    );
                    return (
                      <td
                        style={{
                          // backgroundColor: `hsl(${
                          //   presentRatio <= 75 ? 75 - presentRatio + 75 : 0
                          // }%,${presentRatio > 75 ? presentRatio : 0}%,0%, ${
                          //   isNaN(presentRatio) ? "0" : "0.15"
                          // })`,

                          backgroundColor: `hsl(${
                            presentRatio <= 75
                              ? "var(--nextui-danger)"
                              : "var(--nextui-success)"
                          } / ${
                            Math.min(
                              Math.abs(presentRatio / 100 - 0.75) + 0.75,
                              1
                            ) - 0.35
                          })`,
                        }}
                        rowSpan={subject.endTime - subject.startTime}
                      >
                        {subject.subjectName}
                        {!isNaN(presentRatio) && (
                          <span
                            style={{ fontSize: "0.8em", marginLeft: "auto" }}
                          >
                            {presentRatio.toFixed(0)}%
                          </span>
                        )}
                      </td>
                    );
                  }
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}

function getSubjectPresentRatio(subjectId, days, att) {
  days = Object.values(days)
    .map((day) => Object.entries(day))
    .flat();
  console.log(days);
  const totalPresent = days
    ?.filter(([subId, att]) => att?.present && +subId === subjectId)
    .reduce((a) => a + 1, 0);
  const totalAbsent = days
    ?.filter(([subId, att]) => att?.absent && +subId === subjectId)
    .reduce((a) => a + 1, 0);
  const total = totalPresent + totalAbsent;

  const colorValue = (totalPresent / total) * 100;
  console.log(colorValue);
  return colorValue;
}
function formatTimeTo12HourFormat(twentyFourHourTime) {
  const hour = twentyFourHourTime % 12 || 12;
  const suffix = twentyFourHourTime < 12 ? "AM" : "PM";
  return (
    <>
      <span>{hour}</span>
      <span className="timeSuffix">{suffix}</span>
    </>
  );
}

function findSubjectWhosEndTimeIsBeforeTime(subjects, time, weekNo) {
  for (let subject of subjects) {
    for (let week of Object.keys(subject.lectures)) {
      if (weekNo + 1 === +week) {
        for (let lecture of subject.lectures[week]) {
          if (time < lecture.endTime && time > lecture.startTime) {
            return { ...lecture, subjectName: subject.name };
          }
        }
      }
    }
  }
  return null;
}

function getSubjectAtTime(subjects, time, weekNo) {
  for (let subject of subjects) {
    for (let week of Object.keys(subject.lectures)) {
      if (weekNo + 1 === +week) {
        for (let lecture of subject.lectures[week]) {
          console.log(time, lecture.startTime);
          if (!time || time === lecture.startTime) {
            return { ...lecture, subjectName: subject.name, id: subject.id };
          }
        }
      }
    }
  }
  return null;
}

function getWeekName(weekNo) {
  const weekNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return weekNames[weekNo];
}

function getNoOfWeeks(subjects) {
  let max = 0;
  for (let subject of subjects) {
    for (let week of Object.keys(subject.lectures)) {
      if (week > max) {
        max = week;
      }
    }
  }
  return max;
}

function getMaxEndTimeOfSubjects(subjects) {
  let max = 0;
  for (let subject of subjects) {
    for (let week of Object.keys(subject.lectures)) {
      for (let lecture of subject.lectures[week]) {
        if (lecture.endTime > max) {
          max = lecture.endTime;
        }
      }
    }
  }
  return max;
}
function getMinStartTimeOfSubjects(subjects) {
  let min = 100;
  for (let subject of subjects) {
    for (let week of Object.keys(subject.lectures)) {
      for (let lecture of subject.lectures[week]) {
        if (lecture.startTime < min) {
          min = lecture.startTime;
        }
      }
    }
  }
  return min;
}

function App({ toggleTheme }) {
  const [info, setInfo] = useState(null);
  const [days, setDays] = useState(null);
  const [edit, setEdit] = useState(false);
  const originalDate = new Date();

  const [todayDate, setToDayDate] = useState(originalDate);
  useEffect(() => {
    // get info from localStorage
    const info = JSON.parse(localStorage.getItem("info"));
    const days = JSON.parse(localStorage.getItem("days"));
    console.log(info);
    setInfo(info || {});
    setDays(days || {});
  }, []);

  useEffect(() => {
    // save info to local storage
    if (!info) return;
    localStorage.setItem("info", JSON.stringify(info));
  }, [info]);

  useEffect(() => {
    // save info to local storage
    if (!days) return;
    localStorage.setItem("days", JSON.stringify(days));
  }, [days]);

  return (
    info !== null && (
      <div className="App">
        {(edit || !info?.className) && (
          <GetClassInfo info={info} setInfo={setInfo} />
        )}
        {(edit || !info?.startDate || !info?.endDate) && (
          <GetStartAndEndDate info={info} setInfo={setInfo} />
        )}
        {(edit || !info?.subjects) && (
          <GetSubjectNames info={info} setInfo={setInfo} />
        )}
        {(edit || !info?.timeTable) && info?.subjects && (
          <SetTimeTable info={info} setInfo={setInfo} />
        )}
        {edit && <button onClick={() => setEdit(false)}>Save Edit</button>}

        {!edit && isAllDataInserted(info) && (
          <>
            <GetTodayAttendance
              info={info}
              setInfo={setInfo}
              days={days}
              setDays={setDays}
              todayDate={todayDate}
              setToDayDate={setToDayDate}
              originalDate={originalDate}
              setEdit={setEdit}
              toggleTheme={toggleTheme}
            />
            <Calendar
              info={info}
              days={days}
              setDays={setDays}
              todayDate={todayDate}
              setToDayDate={setToDayDate}
              originalDate={originalDate}
            />
          </>
        )}
      </div>
    )
  );
}

function isAllDataInserted(info) {
  return (
    info.className &&
    info.startDate &&
    info.endDate &&
    info.subjects &&
    info.timeTable
  );
}

function GetClassInfo({ info, setInfo }) {
  const [value, setValue] = useState(info?.className || "");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setInfo({ ...info, className: value });
      }}
    >
      <label for="classNameInput">Class Name</label>
      <input
        id="classNameInput"
        placeholder="1CE12"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  );
}

function GetStartAndEndDate({ info, setInfo }) {
  const [value, setValue] = useState({
    startDate: info?.startDate || "",
    endDate: info?.endDate || "",
  });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setInfo({ ...info, ...value });
      }}
    >
      <label for="startDateInput">Start Date</label>
      <input
        id="startDateInput"
        type="date"
        value={value.startDate}
        onChange={(e) =>
          setValue((prev) => ({
            ...prev,
            startDate: e.target.value,
          }))
        }
      />
      <label for="endDateInput">End Date</label>
      <input
        id="endDateInput"
        type="date"
        value={value.endDate}
        onChange={(e) =>
          setValue((prev) => ({ ...prev, endDate: e.target.value }))
        }
      />
      <button type="submit">Submit</button>
    </form>
  );
}

function GetSubjectNames({ info, setInfo }) {
  const [value, setValue] = useState(
    info?.subjects?.map((s) => s.name).join(",") ||
      [...subjects]
        .sort((a, b) => a.id - b.id)
        .map((s) => s.name)
        .join(",") ||
      ""
  );
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setInfo({
          ...info,
          subjects: value.split(",").map((s, index) => ({
            name: s.trim(),
            id: Math.max(...(subjects.map((sub) => sub.id) || [] || 0)) + index,
            ...(subjects.find((sub) => sub.name === s.trim()) || {}),
          })),
        });
      }}
    >
      <label for="subjectsInput">Class Name</label>
      <input
        id="subjectsInput"
        placeholder="subject1,subject2,subject3"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  );
}

function SetTimeTable({ info, setInfo }) {
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
    <form
      style={{
        width: "90%",
      }}
      onSubmit={(e) => {
        e.preventDefault();
        setInfo((prev) => ({
          ...prev,
          timeTable: convertSubjectValuesToDefaultSubjectsValues(),
        }));
      }}
    >
      {Array.from({ length: noOfDays }).map((_, day) => (
        <div className="timeTable-editor" key={day + 1}>
          <span>{getWeekName(day + 1)}</span>
          <div className="timeTable-editor-row">
            {subjectsValues[day + 1] &&
              subjectsValues[day + 1].map((subject, index) => (
                <div
                  className="timeTable-editor-subject"
                  style={{
                    minWidth: 100 * ((subject.endTime - subject.startTime) * 2),
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "4px",
                    }}
                  >
                    <select
                      style={{ flex: 1 }}
                      id="subjectsInput"
                      placeholder={"Subject " + (index + 1)}
                      value={subjectsValues[day + 1][index].name}
                      onChange={(e) => {
                        onChangeHandler(e.target.value, day + 1, index, "name");
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
                        <option key={s.id} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                    <button
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
                    </button>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "0.5em",
                    }}
                  >
                    <input
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
                    <input
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
          </div>
          <button
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
          </button>
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
  );
}

function Calendar({ info, days, todayDate, setToDayDate, originalDate }) {
  const noOfMonth = getNoOfMonth(info.startDate, info.endDate);
  return (
    <div className="p-4">
      <Card className="p-2 flex flex-row gap-2 flex-wrap  justify-between">
        {[...Array(noOfMonth)].map((_, monthNo) => {
          const date = new Date(info.startDate);
          date.setMonth(monthNo + 1);

          const noOfDays = getNoOfDays(monthNo + 1, date.getFullYear());

          return (
            <div
              key={monthNo}
              style={{
                // display: "inline-block",
                margin: "10px",
                textAlign: "center",
              }}
            >
              <h3 className="font-semibold" style={{ marginBottom: ".5em" }}>
                {getMonthName(monthNo)}
              </h3>
              <table cellSpacing={2} className="calendar">
                <thead>
                  <tr>
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                      (day) => (
                        <td className="text-xs font-semibold" key={day}>
                          {day}
                        </td>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {[...Array(Math.ceil(noOfDays / 7))].map((_, weekNo) => (
                    <tr key={monthNo + weekNo}>
                      {[...Array(7)].map((_, weekDayNo) => {
                        const year = date.getFullYear();
                        const day = getDate(
                          weekDayNo +
                            1 +
                            7 * weekNo -
                            getMonthStartOffset(monthNo, date.getFullYear()),

                          monthNo,
                          year
                        );
                        const currentDate = new Date(
                          year,
                          monthNo,
                          day
                        ).toDateString();
                        const presentCount =
                          Object.values(days?.[currentDate] ?? {})?.filter(
                            (day) => day.present
                          ).length ?? 0;
                        const absentCount =
                          Object.values(days?.[currentDate] ?? {})?.filter(
                            (day) => day.absent
                          ).length ?? 0;

                        const presentRatio = (presentCount * 255) / 6;
                        const absentRatio = (absentCount * 255) / 6;

                        return (
                          <td key={monthNo + weekNo + weekDayNo}>
                            {day && (
                              <Button
                                isDisabled={isCalendarButtonDisabled(
                                  day,
                                  monthNo,
                                  date.getFullYear(),
                                  info.startDate,
                                  info.endDate
                                )}
                                size="sm"
                                isIconOnly
                                variant={
                                  todayDate.toDateString() === currentDate
                                    ? "shadow"
                                    : originalDate.toDateString() ===
                                      currentDate
                                    ? "solid"
                                    : "light"
                                }
                                color={
                                  todayDate.toDateString() === currentDate
                                    ? "primary"
                                    : "default"
                                }
                                style={
                                  todayDate.toDateString() !== currentDate &&
                                  presentRatio + absentRatio > 0 &&
                                  currentDate !== originalDate.toDateString()
                                    ? {
                                        backgroundColor: `hsl(${
                                          absentRatio > 0 &&
                                          absentRatio > presentRatio
                                            ? "var(--nextui-danger)"
                                            : "var(--nextui-success)"
                                        } / ${
                                          (absentRatio > 0 &&
                                          presentRatio < absentRatio
                                            ? absentRatio - presentRatio
                                            : presentRatio - absentRatio) /
                                          (255 * 2)
                                        })`,
                                      }
                                    : {}
                                }
                                onClick={(e) =>
                                  setToDayDate(new Date(currentDate))
                                }
                              >
                                {day}
                              </Button>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </Card>
    </div>
  );
}

function isCalendarButtonDisabled(day, month, year, startDate, endDate) {
  const date = new Date(year, month, day + 1);

  return (
    date < new Date(startDate) ||
    date > new Date(endDate).setDate(new Date(endDate).getDate() + 1)
  );
}

function getMonthName(month) {
  return [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ][month];
}

function getMonthStartOffset(month, year) {
  const date = new Date(year, month, 1);
  return date.getDay() - 1;
}

function getDate(day, month, year) {
  const date = new Date(year, month, day);
  return date.getMonth() === month ? date.getDate() : null;
}

function getNoOfDays(month, year) {
  return new Date(year, month + 1, 0).getDate();
}

function getNoOfMonth(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return end.getMonth() - start.getMonth() + 1;
}

export default App;
