import { useEffect, useState } from "react";
import "./App.css";
import Chart from "react-google-charts";

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
    setDays(days ?? {});
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
  return info.className && info.startDate && info.endDate && info.subjects;
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
    info?.subjects?.map((s) => s.name).join(",") || ""
  );
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setInfo({
          ...info,
          subjects: value
            .split(",")
            .map((s, index) => ({ name: s.trim(), id: index + 1 })),
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

function GetTodayAttendance({
  info,
  days,
  setDays,
  todayDate,
  originalDate,
  setEdit,
}) {
  const [sortCol, setSortCol] = useState("Subjects");
  const [sortOrder, setSortOrder] = useState(1);
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

  function headingClickHandler(value) {
    if (value === sortCol) {
      setSortOrder(-sortOrder);
    } else {
      setSortCol(value);
      setSortOrder(1);
    }
  }

  const chartValues = [
    ["Subjects", "Attended Lectures"],
    ...attendedLectures.map((sub) => sub.values),
  ];

  const options = {
    legend: "none",
    pieSliceText: "label",
    title: "Attended Lectures",
    pieStartAngle: 100,
    is3D: true,
  };

  return (
    <div className="attendance-table-container">
      <div>
        <span>Today's Date :</span>
        <span className="bold">{originalDate.toDateString()}</span>
        <button
          onClick={(e) => setEdit(true)}
          style={{ marginLeft: "1em", display: "inline-block" }}
        >
          Edit
        </button>
      </div>
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
              {[...tableValues[sortCol]]
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
                .map(({ id }) =>
                  info.subjects.find((subject) => subject.id === id)
                )
                .map((subject) => {
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

          <div style={{ display: "block" }}>
            <Chart
              chartType="PieChart"
              data={chartValues}
              options={options}
              width={"100%"}
              height={"400px"}
            />
          </div>
        </div>
      </div>
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
