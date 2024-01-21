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
  Listbox,
  ListboxItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectItem,
  SelectSection,
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
  Plus,
  Settings,
  Table as TableIcon,
  Trash,
  Trash2,
} from "react-feather";

// const iconClasses = "text-default-200 pointer-events-none flex-shrink-0";
const iconClasses = "";

function GetTodayAttendance({
  info,
  setInfo,
  days,
  setDays,
  todayDate,
  originalDate,
  setEdit,
  toggleTheme,
}) {
  const [showTimeTable, setShowTimeTable] = useState(false);
  const [sortCol, setSortCol] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "1em",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            flexDirection: "column",
          }}
        >
          <span className="text-xs">Today's Date </span>
          <span style={{ fontWeight: "bold" }}>
            {originalDate.toDateString()}
          </span>
        </div>
        <div
          className="flex flex-row gap-2"
          //   style={{
          //     display: "flex",
          //     flexWrap: "wrap",
          //     gap: "0.5em",
          //   }}
        >
          <Button
            // isIconOnly
            size="md"
            variant="flat"
            onClick={(e) => setShowTimeTable((prev) => !prev)}
          >
            <TableIcon />
            {showTimeTable ? "Hide" : "Show"}
            TimeTable
          </Button>
          <Dropdown
            className="bg-foreground text-background"
            placement="bottom"
          >
            <DropdownTrigger>
              <Button isIconOnly size="md" variant="light">
                <Settings />
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem
                key="edit"
                onClick={(e) => setEdit(true)}
                startContent={<Edit2 size="1.5em" className={iconClasses} />}
              >
                Edit
              </DropdownItem>
              <DropdownItem
                key="mode"
                onClick={toggleTheme}
                startContent={
                  "dark" ? (
                    <Moon size="1.5em" className={iconClasses} />
                  ) : (
                    <Edit2 size="1.5em" className={iconClasses} />
                  )
                }
              >
                Dark mode
              </DropdownItem>
              <DropdownItem
                key="clear"
                className="text-danger"
                color="danger"
                startContent={<Trash size="1.5em" className={iconClasses} />}
                onClick={(e) =>
                  window.confirm(
                    "Are you sure you want to delete all of the data?"
                  ) && setDays({})
                }
              >
                Clear Data
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>

          {/* <button onClick={(e) => setEdit(true)}>Edit</button>
          <button onClick={(e) => setShowTimeTable((prev) => !prev)}>
            {showTimeTable ? "Hide" : "Show"}
            TimeTable
                </button> */}
        </div>
      </div>
      {showTimeTable ? (
        <div className="attendance-table">
          <TimeTable days={days} info={info} />
        </div>
      ) : (
        <Card className="p-4 mx-4 overflow-auto">
          <div className="flex items-center mb-4">
            <div>
              <p className="text-xs">Showing attendance</p>
              <span className="font-bold">{todaysDate}</span>
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
              <TableBody>
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
                              days?.[todaysDate]?.[subject.id]?.present
                                ? "shadow"
                                : "bordered"
                            }
                            color={
                              days?.[todaysDate]?.[subject.id]?.present
                                ? "success"
                                : "default"
                            }
                            // style={
                            //   days?.[todaysDate]?.[subject.id]?.present
                            //     ? {
                            //         backgroundColor: "rgba(0,255,0,0.1)",
                            //       }
                            //     : {}
                            // }
                            onClick={(e) =>
                              setDays((prev) => ({
                                ...prev,
                                [todaysDate]: {
                                  ...prev[todaysDate],
                                  [subject.id]: {
                                    present:
                                      !prev?.[todaysDate]?.[subject.id]
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
                              days?.[todaysDate]?.[subject.id]?.absent
                                ? "shadow"
                                : "bordered"
                            }
                            color={
                              days?.[todaysDate]?.[subject.id]?.absent
                                ? "danger"
                                : "default"
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
                          </Button>
                        </div>
                      </TableCell>

                      <TableCell>
                        {getAttendedLecturesNumber(subject, days)}
                      </TableCell>
                      <TableCell>
                        {getTotalLecturesNumber(subject, days)}
                      </TableCell>
                      <TableCell>
                        {getAttendedLecturesPercentage(subject, days).toFixed(
                          1
                        )}
                        %
                      </TableCell>
                      <TableCell>
                        {getRequiredLectures(subject, days)}
                      </TableCell>
                      <TableCell>{getAllowedHolidays(subject, days)}</TableCell>
                    </TableRow>
                  );
                })}
                <TableRow>
                  <TableCell />
                  <TableCell className="flex gap-2">
                    <Button
                      variant="flat"
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
                    </Button>
                    <Button
                      variant="flat"
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
                    </Button>
                  </TableCell>
                  <TableCell />
                  <TableCell />
                  <TableCell />
                  <TableCell />
                  <TableCell />
                </TableRow>
              </TableBody>
              {/* <TableF>
         
              </TableF> */}
            </Table>

            <Card
              className="p-4 w-max flex flex-col gap-4 flex-nowrap min-w-fit shadow-small"
              //   style={{
              //     display: "flex",
              //     flexDirection: "column",
              //     alignItems: "flex-start",
              //     flex: 1,
              //   }}
            >
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
function getRequiredLectures(subject, days) {
  let attendedLectures = getAttendedLecturesNumber(subject, days);
  let totalLectures = getTotalLecturesNumber(subject, days);

  let requiredLectures = Math.ceil(
    (0.75 * totalLectures - attendedLectures) / (1 - 0.75)
  );

  return Math.max(requiredLectures, 0);
}

function getAllowedHolidays(subject, days) {
  let totalLectures = getTotalLecturesNumber(subject, days);
  let attendedLectures = getAttendedLecturesNumber(subject, days);

  // calculate the number of allowed holidays by still maintaining 75% attendance

  let allowedHolidays = 0;
  let percentage = (attendedLectures / totalLectures) * 100;
  while (percentage >= 75) {
    allowedHolidays += 1;
    totalLectures += 1;
    percentage = (attendedLectures / totalLectures) * 100;
  }

  return Math.max(allowedHolidays - 1, 0);
}
export default GetTodayAttendance;
