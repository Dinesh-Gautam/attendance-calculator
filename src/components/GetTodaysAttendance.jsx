import React, { useMemo, useState } from "react";
import Chart from "react-google-charts";
import { TimeTable } from "../App";
import {
  Button,
  Card,
  Checkbox,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import {
  Edit2,
  Moon,
  Settings,
  Sun,
  Table as TableIcon,
  Trash,
} from "react-feather";
import { useStateContext } from "../context/stateContext";
import Header from "./Header";

const iconClasses = "";

function GetTodayAttendance() {
  const { showTimeTable, info, setInfo, days, setDays, todayDate } =
    useStateContext();

  const [sortCol, setSortCol] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  const [displayChart, setDisplayChart] = useState("Attended Lectures");

  const todayDateString = todayDate.toDateString();

  const attendedLectures = info.subjects.map((subject) => ({
    id: subject.id,
    values: [subject.name, getAttendedLectures(subject, days)],
  }));
  const subjectsNames = info.subjects.map((subject) => ({
    id: subject.id,
    values: [0, subject.name],
  }));
  const lectures = info.subjects.map((subject) => ({
    id: subject.id,
    values: [subject.name, getTotalLectures(subject, days)],
  }));
  const attendedPercentage = info.subjects.map((subject) => ({
    id: subject.id,
    values: [subject.name, getAttendancePercentage(subject, days)],
  }));
  const requiredLectures = info.subjects.map((subject) => ({
    id: subject.id,
    values: [subject.name, getRequiredLectures(subject, days)],
  }));
  const allowedHolidays = info.subjects.map((subject) => ({
    id: subject.id,
    values: [subject.name, getAllowedHolidays(subject, days)],
  }));
  const todayAttendance = info.subjects.map((subject) => ({
    id: subject.id,
    values: [
      subject.name,
      days[todayDateString]?.[subject.id]?.present
        ? 2
        : days[todayDateString]?.[subject.id]?.absent
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
    "Required Lectures": requiredLectures,
    "Allowed Holidays": allowedHolidays,
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
  }, [sortCol, sortOrder, todayDateString, info.subjects]);

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

  const commonOptions = {
    legend: "none",
    pieSliceText: "label",
    backgroundColor: {
      fill: "transparent",
      stroke: "red",
    },
    chartArea: {
      backgroundColor: "transparent",
    },
    titleTextStyle: {
      color: "white",
      fontName: "Inter",
    },
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
    <div>
      <Header />
      {showTimeTable ? (
        <div className="attendance-table">
          <TimeTable days={days} info={info} />
        </div>
      ) : (
        <Card className="p-4 mx-4 overflow-auto">
          <div className="flex items-center mb-4">
            <div>
              <p className="text-xs">Showing attendance</p>
              <span className="font-bold">{todayDateString}</span>
            </div>
            <div
              style={{
                marginLeft: "1em",
                display: "flex",
                gap: "4px",
                alignItems: "baseline",
              }}
            >
              <Checkbox
                type="checkbox"
                defaultSelected={!!info?.options?.showAllSubjects}
                onChange={(e) =>
                  setInfo((prev) => ({
                    ...prev,
                    options: {
                      ...prev.options,
                      showAllSubjects: e.target.checked,
                    },
                  }))
                }
              >
                Show All Subjects
              </Checkbox>
            </div>
          </div>

          <div className="flex gap-4">
            <Table
              className="w-full min-w-fit"
              sortDescriptor={{
                direction: sortOrder === 1 ? "descending" : "ascending",
                column: Object.keys(tableValues).indexOf(sortCol).toString(),
              }}
              onSortChange={(e) => {
                headingClickHandler(Object.keys(tableValues)[e.column]);
              }}
            >
              <TableHeader>
                {Object.keys(tableValues).map((heading, index) => {
                  return (
                    <TableColumn allowsSorting key={index}>
                      {heading}
                    </TableColumn>
                  );
                })}
              </TableHeader>
              <TableBody emptyContent={"No Subjects to display."}>
                {(!info?.options?.showAllSubjects
                  ? sortedData.filter((subject) =>
                      info?.subjects?.some(
                        (sub) =>
                          sub.id === subject.id &&
                          sub.lectures?.[todayDate.getDay()]
                      )
                    )
                  : sortedData
                ).map((subject) => {
                  return (
                    <TableRow key={subject.id}>
                      <TableCell style={{ whiteSpace: "nowrap" }}>
                        {subject.name}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-row gap-2 justify-start">
                          <Button
                            variant={
                              days?.[todayDateString]?.[subject.id]?.present
                                ? "shadow"
                                : "bordered"
                            }
                            color={
                              days?.[todayDateString]?.[subject.id]?.present
                                ? "success"
                                : "default"
                            }
                            onClick={(e) =>
                              setDays((prev) => ({
                                ...prev,
                                [todayDateString]: {
                                  ...prev[todayDateString],
                                  [subject.id]: {
                                    present:
                                      !prev?.[todayDateString]?.[subject.id]
                                        ?.present,

                                    absent: false,
                                  },
                                },
                              }))
                            }
                          >
                            Present
                          </Button>
                          <Button
                            variant={
                              days?.[todayDateString]?.[subject.id]?.absent
                                ? "shadow"
                                : "bordered"
                            }
                            color={
                              days?.[todayDateString]?.[subject.id]?.absent
                                ? "danger"
                                : "default"
                            }
                            onClick={(e) =>
                              setDays((prev) => ({
                                ...prev,
                                [todayDateString]: {
                                  ...prev[todayDateString],
                                  [subject.id]: {
                                    absent:
                                      !prev?.[todayDateString]?.[subject.id]
                                        ?.absent,
                                    present: false,
                                  },
                                },
                              }))
                            }
                          >
                            Absent
                          </Button>
                        </div>
                      </TableCell>

                      <TableCell>
                        {getAttendedLectures(subject, days)}
                      </TableCell>
                      <TableCell>{getTotalLectures(subject, days)}</TableCell>
                      <TableCell>
                        {getAttendancePercentage(subject, days).toFixed(1)}%
                      </TableCell>
                      <TableCell>
                        {getRequiredLectures(subject, days)}
                      </TableCell>
                      <TableCell>{getAllowedHolidays(subject, days)}</TableCell>
                    </TableRow>
                  );
                })}
                {console.log(
                  info.subjects.filter(
                    (sub) => sub.lectures[todayDate.getDay()]
                  )
                )}

                {(info?.options?.showAllSubjects ||
                  info.subjects.filter(
                    (sub) => sub.lectures[todayDate.getDay()]
                  ).length > 0) && (
                  <TableRow>
                    <TableCell />
                    <TableCell className="flex gap-2">
                      <Button
                        variant="flat"
                        onClick={(e) =>
                          setDays((prev) => ({
                            ...prev,
                            [todayDateString]: {
                              ...prev[todayDateString],
                              ...info.subjects.reduce((acc, subject) => {
                                if (
                                  (!info?.options?.showAllSubjects &&
                                    subject.lectures?.[todayDate.getDay()]) ||
                                  info?.options?.showAllSubjects
                                ) {
                                  acc[subject.id] = {
                                    present: true,
                                    absent: false,
                                  };
                                }
                                return acc;
                              }, {}),
                            },
                          }))
                        }
                      >
                        All present
                      </Button>
                      <Button
                        variant="flat"
                        onClick={(e) =>
                          setDays((prev) => ({
                            ...prev,
                            [todayDateString]: {
                              ...prev[todayDateString],
                              ...info.subjects.reduce((acc, subject) => {
                                if (
                                  (!info?.options?.showAllSubjects &&
                                    subject.lectures?.[todayDate.getDay()]) ||
                                  info?.options?.showAllSubjects
                                ) {
                                  acc[subject.id] = {
                                    present: false,
                                    absent: true,
                                  };
                                }
                                return acc;
                              }, {}),
                            },
                          }))
                        }
                      >
                        All Absent
                      </Button>
                    </TableCell>
                    <TableCell />
                    <TableCell />
                    <TableCell />
                    <TableCell />
                    <TableCell />
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <Card className="p-4 w-max flex flex-col gap-4 flex-nowrap min-w-fit shadow-small">
              <Select
                classNames={{
                  popoverContent: "bg-default-800 text-background",
                }}
                size="sm"
                className="w-full mw-max"
                label="Select chart type"
                selectedKeys={[displayChart]}
                onChange={(e) =>
                  e.target.value && setDisplayChart((prev) => e.target.value)
                }
              >
                {Object.keys(charts).map((val, index) => (
                  <SelectItem variant="faded" key={val} value={val}>
                    {val}
                  </SelectItem>
                ))}
              </Select>
              <div className="w-max">
                <Chart
                  chartType="PieChart"
                  data={charts[displayChart].data}
                  options={charts[displayChart].options}
                  width={"100%"}
                  height={"400px"}
                />
              </div>
            </Card>
          </div>
        </Card>
      )}
    </div>
  );
}

function getTotalLectures(subject, days) {
  return Object.values(days).reduce((total, day) => {
    return (
      total + (day[subject.id]?.present || day[subject.id]?.absent ? 1 : 0)
    );
  }, 0);
}

function getAttendedLectures(subject, days) {
  return Object.values(days).reduce((total, day) => {
    return total + (day[subject.id]?.present ? 1 : 0);
  }, 0);
}

function getAttendancePercentage(subject, days) {
  const total = getTotalLectures(subject, days);
  const attended = getAttendedLectures(subject, days);
  return total > 0 ? (attended / total) * 100 : 0;
}

function getRequiredLectures(subject, days) {
  const total = getTotalLectures(subject, days);
  const attended = getAttendedLectures(subject, days);

  const required = Math.ceil((0.75 * total - attended) / (1 - 0.75));
  return Math.max(required, 0);
}

function getAllowedHolidays(subject, days) {
  const total = getTotalLectures(subject, days);
  const attended = getAttendedLectures(subject, days);

  let allowed = 0;
  let percentage = (attended / (total + allowed)) * 100;

  while (percentage >= 75) {
    allowed++;
    percentage = (attended / (total + allowed)) * 100;
  }

  return Math.max(allowed - 1, 0);
}

export default GetTodayAttendance;
