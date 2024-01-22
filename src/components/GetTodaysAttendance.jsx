import React, { useMemo, useState } from "react";
import { TimeTable } from "../App";
import {
  Button,
  Card,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
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
import { Charts } from "./Charts";
import { TableOptions } from "./TableOptions";

const iconClasses = "";

function GetTodayAttendance() {
  const { showTimeTable, info, days, setDays, todayDate } = useStateContext();

  const [sortCol, setSortCol] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

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

  function AllButtonClickHandler(type) {
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
              present: type === "present",
              absent: type === "absent",
            };
          }
          return acc;
        }, {}),
      },
    }));
  }

  return (
    <div>
      <Header />
      {showTimeTable ? (
        <div className="attendance-table">
          <TimeTable days={days} info={info} />
        </div>
      ) : (
        <Card className="p-4 mx-4 overflow-auto">
          <TableOptions />

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
                        onClick={(e) => AllButtonClickHandler("present")}
                      >
                        All present
                      </Button>
                      <Button
                        variant="flat"
                        onClick={(e) => AllButtonClickHandler("absent")}
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

            <Charts />
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

export function getAttendedLectures(subject, days) {
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
