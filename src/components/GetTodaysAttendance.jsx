import {
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import React, { useMemo, useState } from "react";
import { TimeTable } from "../App";
import { useStateContext } from "../context/stateContext";
import { Charts } from "./Charts";
import Header from "./Header";
import { TableOptions } from "./TableOptions";

function GetTodayAttendance() {
  const { showTimeTable, info, days, setDays, todayDate } = useStateContext();
  const [sortCol, setSortCol] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const todayDateString = todayDate.toDateString();
  const tableValues = info.subjects.reduce((acc, subject) => {
    const subjectAttendance = days[todayDateString]?.[subject.id];
    const present = subjectAttendance?.present
      ? 2
      : subjectAttendance?.absent
      ? 1
      : 0;
    const subjectData = {
      Subjects: { id: subject.id, values: [0, subject.name] },
      "Today Attendance": { id: subject.id, values: [subject.name, present] },
      Attended: {
        id: subject.id,
        values: [subject.name, getAttendedLectures(subject, days)],
      },
      Lectures: {
        id: subject.id,
        values: [subject.name, getTotalLectures(subject, days)],
      },
      Percentage: {
        id: subject.id,
        values: [subject.name, getAttendancePercentage(subject, days)],
      },
      "Required Lectures": {
        id: subject.id,
        values: [subject.name, getRequiredLectures(subject, days)],
      },
      "Allowed Holidays": {
        id: subject.id,
        values: [subject.name, getAllowedHolidays(subject, days)],
      },
    };
    // Accumulate the data for each category
    Object.keys(subjectData).forEach((key) => {
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(subjectData[key]);
    });

    return acc;
  }, {});
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

  function getFilteredAndSortedTableValues() {
    return !info?.options?.showAllSubjects
      ? sortedData.filter((subject) =>
          info?.subjects?.some(
            (sub) => sub.id === subject.id && sub.lectures?.[todayDate.getDay()]
          )
        )
      : sortedData;
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
                {getFilteredAndSortedTableValues().map((subject) => {
                  return (
                    <TableRow key={subject.id}>
                      <TableCell style={{ whiteSpace: "nowrap" }}>
                        {subject.name}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-row gap-2 justify-start">
                          <AttendanceButtons subject={subject} />
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

                {shouldShowTableFooter(info, todayDate) && (
                  <TableRow>
                    {Object.values(tableValues).map((heading, index) => {
                      return index !== 1 ? (
                        <TableCell key={index} />
                      ) : (
                        <TableCell>
                          <MarkAllAttendanceButtons />
                        </TableCell>
                      );
                    })}
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
function shouldShowTableFooter(info, todayDate) {
  return (
    info?.options?.showAllSubjects ||
    info.subjects.filter((sub) => sub.lectures[todayDate.getDay()]).length > 0
  );
}
function MarkAllAttendanceButtons() {
  const { info, setDays, todayDate } = useStateContext();
  const todayDateString = todayDate.toDateString();
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
    <>
      <Button variant="flat" onClick={(e) => AllButtonClickHandler("present")}>
        All present
      </Button>
      <Button variant="flat" onClick={(e) => AllButtonClickHandler("absent")}>
        All Absent
      </Button>
    </>
  );
}

function AttendanceButtons({ subject }) {
  const { days, setDays, todayDate } = useStateContext();
  const todayDateString = todayDate.toDateString();

  function attendanceButtonClickHandler(type, subject) {
    setDays((prev) => ({
      ...prev,
      [todayDateString]: {
        ...prev[todayDateString],
        [subject.id]: {
          present: type === "present",
          absent: type === "absent",
          [type]: !prev?.[todayDateString]?.[subject.id]?.[type],
        },
      },
    }));
  }
  return ["present", "absent"].map((type) => {
    return (
      <Button
        className="capitalize"
        variant={
          days?.[todayDateString]?.[subject.id]?.[type] ? "shadow" : "bordered"
        }
        color={
          days?.[todayDateString]?.[subject.id]?.[type]
            ? type === "absent"
              ? "danger"
              : "success"
            : "default"
        }
        onClick={(e) => attendanceButtonClickHandler(type, subject)}
      >
        {type}
      </Button>
    );
  });
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
