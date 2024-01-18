import { useEffect, useMemo, useState } from "react";
import "./App.css";
import Chart from "react-google-charts";

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

function TimeTable({ days, info }) {
  const subjects = info.timeTable;
  return (
    <div>
      <table className="timetable" style={{ borderCollapse: "collapse" }}>
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
                          backgroundColor: `rgba(${
                            presentRatio <= 75 ? 75 - presentRatio + 75 : 0
                          }%,${presentRatio > 75 ? presentRatio : 0}%,0%, ${
                            isNaN(presentRatio) ? "0" : "0.15"
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
    </div>
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
          if (time < lecture.endTime && time >= lecture.startTime) {
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
          if (time === lecture.startTime) {
            console.log(lecture);
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

function App() {
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
            id: index + 1,
            ...(subjects.find((s) => s.name === s) || {}),
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
    const defaultSubjects = subjects;
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
              startTime: lecture.startTime,
              endTime: lecture.endTime,
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
      onSubmit={(e) => {
        e.preventDefault();
        setInfo((prev) => ({
          ...prev,
          timeTable: convertSubjectValuesToDefaultSubjectsValues(),
        }));
      }}
    >
      {Array.from({ length: noOfDays }).map((_, day) => (
        <div key={day + 1}>
          <span>{getWeekName(day + 1)}</span>
          {subjectsValues[day + 1] &&
            subjectsValues[day + 1].map((subject, index) => (
              <div>
                <select
                  id="subjectsInput"
                  placeholder={"Subject " + (index + 1)}
                  value={subjectsValues[day + 1][index].name}
                  onChange={(e) => {
                    onChangeHandler(e.target.value, day + 1, index, "name");
                    onChangeHandler(
                      info.subjects.find((s) => s.name === e.target.value).id,
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
                <div>
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
                      onChangeHandler(e.target.value, day + 1, index, "endTime")
                    }
                  />
                </div>
              </div>
            ))}
          <button
            onClick={(e) =>
              setSubjectsValues((prev) => ({
                ...prev,
                [day + 1]: [
                  ...(prev[day + 1] || []),
                  { name: "", startTime: "", endTime: "" },
                ],
              }))
            }
          >
            Add
          </button>
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
  );
}

function GetTodayAttendance({
  info,
  days,
  setDays,
  todayDate,
  originalDate,
  setEdit,
}) {
  const [showTimeTable, setShowTimeTable] = useState(false);
  const [sortCol, setSortCol] = useState(null);
  const [sortOrder, setSortOrder] = useState(1);

  const [displayChart, setDisplayChart] = useState("Attended Lectures");

  const todaysDate = todayDate.toDateString();

  const attendedLectures = info.subjects.map((subject) => ({
    id: subject.id,
    values: [subject.name, getAttendedLecturesNumber(subject, days)],
  }));
  const subjectsNames = info.subjects.map((subject) => ({
    id: subject.id,
    values: [0, subject.name],
  }));
  const lectures = info.subjects.map((subject) => ({
    id: subject.id,
    values: [subject.name, getTotalLecturesNumber(subject, days)],
  }));
  const attendedPercentage = info.subjects.map((subject) => ({
    id: subject.id,
    values: [subject.name, getAttendedLecturesPercentage(subject, days)],
  }));
  const todayAttendance = info.subjects.map((subject) => ({
    id: subject.id,
    values: [
      subject.name,
      days[todaysDate]?.[subject.id]?.present
        ? 2
        : days[todaysDate]?.[subject.id]?.absent
        ? 1
        : 0,
    ],
  }));
  const tableValues = {
    Subjects: subjectsNames,
    "Today Attendance": todayAttendance,
    Attended: attendedLectures,
    Lectures: lectures,
    Percentage: attendedPercentage,
  };
  const sortedData = useMemo(() => {
    if (!sortCol) return info.subjects;
    return [...tableValues[sortCol]]
      .sort((a, b) =>
        sortOrder === 1
          ? a.values[1] < b.values[1]
            ? -1
            : a.values[1] > b.values[1]
            ? 1
            : 0
          : a.values[1] < b.values[1]
          ? 1
          : a.values[1] > b.values[1]
          ? -1
          : 0
      )
      .map(({ id }) => info.subjects.find((subject) => subject.id === id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortCol, sortOrder, todaysDate, info.subjects]);

  function headingClickHandler(value) {
    if (value === sortCol) {
      setSortOrder(-sortOrder);
    } else {
      setSortCol(value);
      setSortOrder(1);
    }
  }

  const chartAttendedLectures = [
    ["Subjects", "Attended Lectures"],
    ...attendedLectures.map((sub) => sub.values),
  ];
  const chartAttendanceRatio = [
    ["Ratio", "Attendance"],
    // get total present and absent and total number of lectures
    [
      "Total Present",

      info.subjects
        .map((subject) =>
          Object.values(days)
            .map((day) => {
              return day[subject.id]?.present ? 1 : 0;
            })
            .reduce((a, b) => a + b, 0)
        )
        .reduce((a, b) => a + b, 0),
    ],
    [
      "Total Absent",

      info.subjects
        .map((subject) =>
          Object.values(days)
            .map((day) => {
              return day[subject.id]?.absent ? 1 : 0;
            })
            .reduce((a, b) => a + b, 0)
        )
        .reduce((a, b) => a + b, 0),
    ],
    [
      "Lectures not taken",
      info.subjects
        .map((subject) =>
          Object.values(days)
            .map((day) => {
              return !day[subject.id]?.absent && !day[subject.id]?.present
                ? 1
                : 0;
            })
            .reduce((a, b) => a + b, 0)
        )
        .reduce((a, b) => a + b, 0),
    ],
  ];
  console.log(chartAttendanceRatio);

  const commonOptions = {
    legend: "none",
    pieSliceText: "label",
  };

  const charts = {
    "Attended Lectures": {
      chartType: "PieChart",
      data: chartAttendedLectures,
      options: {
        title: "Attended Lectures",

        ...commonOptions,
      },
    },
    "Attendance Ratio": {
      chartType: "PieChart",
      data: chartAttendanceRatio,
      options: {
        title: "Attendance Ratio",

        ...commonOptions,
      },
    },
  };

  return (
    <div className="attendance-table-container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingInline: "2em",
          alignItems: "center",
          marginTop: "-1em",
        }}
      >
        <div />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <span style={{ fontSize: "0.8em" }}>Today's Date </span>
          <span className="bold">{originalDate.toDateString()}</span>
        </div>
        <div>
          <button
            onClick={(e) => setEdit(true)}
            style={{ marginLeft: "1em", display: "inline-block" }}
          >
            Edit
          </button>
          <button
            onClick={(e) => setShowTimeTable((prev) => !prev)}
            style={{ marginLeft: "1em", display: "inline-block" }}
          >
            {showTimeTable ? "Hide" : "Show"}
            TimeTable
          </button>
        </div>
      </div>
      {showTimeTable ? (
        <div className="attendance-table">
          <TimeTable days={days} info={info} />
        </div>
      ) : (
        <div className="attendance-table">
          <div className="attendance-table-header">
            <span>Showing attendance: </span>
            <span className="bold">{todaysDate}</span>
            {/* <p>select subjects in which you were present</p> */}
          </div>

          <div style={{ display: "flex" }}>
            <table cellSpacing="0">
              <thead>
                <tr>
                  {Object.keys(tableValues).map((heading, index) => {
                    return (
                      <th
                        style={{ cursor: "pointer" }}
                        key={index}
                        onClick={() => headingClickHandler(heading)}
                      >
                        {heading}

                        {sortCol === heading && (
                          <span className="sort-icon">
                            {sortOrder === 1 ? "▼" : "▲"}
                          </span>
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {sortedData.map((subject) => {
                  return (
                    <tr key={subject.id}>
                      <td>{subject.name}</td>
                      <td style={{ display: "flex", gap: "1em" }}>
                        <button
                          style={
                            days?.[todaysDate]?.[subject.id]?.present
                              ? {
                                  backgroundColor: "rgba(0,255,0,0.1)",
                                }
                              : {}
                          }
                          onClick={(e) =>
                            setDays((prev) => ({
                              ...prev,
                              [todaysDate]: {
                                ...prev[todaysDate],
                                [subject.id]: {
                                  present:
                                    !prev?.[todaysDate]?.[subject.id]?.present,

                                  absent: false,
                                },
                              },
                            }))
                          }
                        >
                          Present
                        </button>
                        <button
                          style={
                            days?.[todaysDate]?.[subject.id]?.absent
                              ? {
                                  backgroundColor: "rgba(255,0,0,0.1)",
                                }
                              : {}
                          }
                          onClick={(e) =>
                            setDays((prev) => ({
                              ...prev,
                              [todaysDate]: {
                                ...prev[todaysDate],
                                [subject.id]: {
                                  absent:
                                    !prev?.[todaysDate]?.[subject.id]?.absent,
                                  present: false,
                                },
                              },
                            }))
                          }
                        >
                          Absent
                        </button>
                      </td>
                      <td>{getAttendedLecturesNumber(subject, days)}</td>
                      <td>{getTotalLecturesNumber(subject, days)}</td>
                      <td>
                        {getAttendedLecturesPercentage(subject, days).toFixed(
                          1
                        )}
                        %
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td />
                  <td style={{ display: "flex", gap: "1em" }}>
                    <button
                      onClick={(e) =>
                        setDays((prev) => ({
                          ...prev,
                          [todaysDate]: {
                            ...prev[todaysDate],
                            ...info.subjects.reduce((acc, subject) => {
                              acc[subject.id] = {
                                present: true,
                                absent: false,
                              };
                              return acc;
                            }, {}),
                          },
                        }))
                      }
                    >
                      All present
                    </button>
                    <button
                      onClick={(e) =>
                        setDays((prev) => ({
                          ...prev,
                          [todaysDate]: {
                            ...prev[todaysDate],
                            ...info.subjects.reduce((acc, subject) => {
                              acc[subject.id] = {
                                present: false,
                                absent: true,
                              };
                              return acc;
                            }, {}),
                          },
                        }))
                      }
                    >
                      All Absent
                    </button>
                  </td>
                </tr>
              </tfoot>
            </table>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                flex: 1,
              }}
            >
              <select
                value={displayChart}
                onChange={(e) => setDisplayChart(e.target.value)}
              >
                {Object.keys(charts).map((val, index) => (
                  <option key={index} value={val}>
                    {val}
                  </option>
                ))}
              </select>
              <div>
                <Chart
                  chartType="PieChart"
                  data={charts[displayChart].data}
                  options={charts[displayChart].options}
                  width={"100%"}
                  height={"400px"}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getTotalLecturesNumber(subject, days) {
  days = Object.values(days);
  const totalLectures = days.map((day) => {
    return day[subject.id]?.present || day[subject.id]?.absent ? 1 : 0;
  });
  return totalLectures.reduce((a, b) => a + b, 0);
}
function getAttendedLecturesNumber(subject, days) {
  days = Object.values(days);
  const totalLectures = days.map((day) => {
    return day[subject.id]?.present ? 1 : 0;
  });
  return totalLectures.reduce((a, b) => a + b, 0);
}
function getAttendedLecturesPercentage(subject, days) {
  const totalLectures = getTotalLecturesNumber(subject, days);
  const attendedLectures = getAttendedLecturesNumber(subject, days);
  return (attendedLectures / totalLectures) * 100;
}

function Calendar({ info, days, todayDate, setToDayDate, originalDate }) {
  const noOfMonth = getNoOfMonth(info.startDate, info.endDate);
  return (
    <div>
      {[...Array(noOfMonth)].map((_, monthNo) => {
        const date = new Date(info.startDate);
        date.setMonth(monthNo + 1);

        const noOfDays = getNoOfDays(monthNo + 1, date.getFullYear());

        return (
          <div
            key={monthNo}
            style={{
              display: "inline-block",
              margin: "10px",
              textAlign: "center",
            }}
          >
            <h3 style={{ marginBottom: ".5em" }}>{getMonthName(monthNo)}</h3>
            <table cellSpacing={2} className="calendar">
              <thead>
                <tr>
                  <th>Mon</th>
                  <th>Tue</th>
                  <th>Wed</th>
                  <th>Thu</th>
                  <th>Fri</th>
                  <th>Sat</th>
                  <th>Sun</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(Math.ceil(noOfDays / 7))].map((_, weekNo) => (
                  <tr key={monthNo + weekNo}>
                    {[...Array(7)].map((_, weekDayNo) => {
                      const day = getDate(
                        weekDayNo +
                          1 +
                          7 * weekNo -
                          getMonthStartOffset(monthNo, date.getFullYear()),

                        monthNo,
                        date.getFullYear()
                      );
                      const currentDate = new Date(
                        date.getFullYear(),
                        monthNo,
                        day
                      ).toDateString();
                      const presentRatio =
                        days?.[currentDate] !== undefined
                          ? (Object.values(days?.[currentDate])
                              ?.filter((sub) => sub?.present)
                              .reduce((a) => a + 1, 0) *
                              255) /
                            6
                          : 0;
                      const absentRatio =
                        days?.[currentDate] !== undefined
                          ? (Object.values(days?.[currentDate])
                              ?.filter((sub) => sub?.absent)
                              .reduce((a) => a + 1, 0) *
                              255) /
                            6
                          : 0;
                      return (
                        <td key={monthNo + weekNo + weekDayNo}>
                          {day && (
                            <button
                              style={
                                todayDate.toDateString() === currentDate
                                  ? {
                                      backgroundColor: "#0D65ff",
                                      color: "white",
                                    }
                                  : currentDate === originalDate.toDateString()
                                  ? {
                                      backgroundColor: "white",
                                    }
                                  : {
                                      backgroundColor: `rgba(${absentRatio},${presentRatio},0, ${
                                        absentRatio + presentRatio > 0
                                          ? "0.1"
                                          : "0.02"
                                      })`,
                                    }
                              }
                              disabled={isCalendarButtonDisabled(
                                day,
                                monthNo,
                                date.getFullYear(),
                                info.startDate,
                                info.endDate
                              )}
                              onClick={(e) =>
                                setToDayDate(new Date(currentDate))
                              }
                            >
                              {day}
                            </button>
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
