import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";
import { useStateContext } from "../context/stateContext";
import { getMonthName } from "../utils";
import { getWeekNames } from "../utils";
import { holidays } from "../config";
import { useMemo } from "react";

export default function Calendar() {
  const { info } = useStateContext();

  const noOfMonth = useMemo(
    () => getMonthsBetween(info.startDate, info.endDate),
    [info.startDate, info.endDate]
  );

  const offset = useMemo(
    () => new Date(info.startDate).getMonth(),
    [info.startDate]
  );

  return (
    <div className="p-4">
      <Card className="p-2 flex flex-row gap-2 flex-wrap justify-center md:justify-between">
        {[...Array(noOfMonth)].map((_, monthNo) => {
          return <CalenderMonth monthNo={monthNo + offset} key={monthNo} />;
        })}
      </Card>
    </div>
  );
}
function CalenderMonth({ monthNo }) {
  const { info } = useStateContext();

  const startDate = useMemo(() => new Date(info.startDate), [info.startDate]);

  const noOfDays = useMemo(
    () => getNumberOfDays(monthNo + 1, startDate.getFullYear()),
    [monthNo, startDate]
  );

  return (
    <div className="p-4 text-center">
      <h3 className="font-semibold" style={{ marginBottom: ".5em" }}>
        {getMonthName(monthNo)}
      </h3>
      <table cellSpacing={2} className="calendar">
        <thead>
          <tr>
            {getWeekNames().map((day) => (
              <td className="text-xs font-semibold" key={day}>
                {day}
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(Math.round(noOfDays / 5))].map((_, weekNo) => (
            <tr key={monthNo + weekNo}>
              <CalenderWeek {...{ startDate, weekNo, monthNo }} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CalenderWeek({ startDate, weekNo, monthNo }) {
  return [...Array(7)].map((_, weekDayNo) => {
    return (
      <td key={monthNo + weekNo + weekDayNo}>
        <CalenderButton
          {...{ startDate, weekNo, weekDayNo }}
          monthNo={monthNo}
          date={startDate}
        />
      </td>
    );
  });
}

function getPresentAndAbsentCount(type, days, currentDate, selected) {
  return (
    (Object.entries(days?.[currentDate] ?? {})?.filter(([id, day]) =>
      selected ? selected === id && day[type] : day[type]
    ).length ?? 0) + (selected ? 10 : 0)
  );
}

function CalenderButton({ startDate, weekNo, weekDayNo, monthNo, date }) {
  const { info, days, todayDate, setToDayDate, originalDate, selectedSubject } =
    useStateContext();

  const year = useMemo(() => startDate.getFullYear(), [startDate]);

  const day = useMemo(
    () =>
      getDate(
        weekDayNo +
          1 +
          7 * (weekNo - 1) -
          getFirstDayOffset(monthNo, startDate.getFullYear()),
        monthNo,
        year
      ),
    [monthNo, weekNo, weekDayNo, year, startDate]
  );

  const currentDate = useMemo(
    () => new Date(year, monthNo, day).toDateString(),
    [year, monthNo, day]
  );

  const presentCount = useMemo(
    () =>
      getPresentAndAbsentCount("present", days, currentDate, selectedSubject),
    [days, currentDate, selectedSubject]
  );

  const absentCount = useMemo(
    () =>
      getPresentAndAbsentCount("absent", days, currentDate, selectedSubject),
    [days, currentDate, selectedSubject]
  );

  const presentRatio = (presentCount * 255) / 6;
  const absentRatio = (absentCount * 255) / 6;

  const isHoliday = useMemo(
    () => isHolidayDate(day, monthNo, date.getFullYear()),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  function isCurrentDateSelected() {
    return todayDate.toDateString() === currentDate;
  }

  const backgroundColor = isHoliday
    ? `hsl(var(--nextui-warning-100))`
    : `hsl(${
        absentRatio > 0 && absentRatio > presentRatio
          ? "var(--nextui-danger)"
          : "var(--nextui-success)"
      } / ${
        selectedSubject
          ? 1
          : (absentRatio > 0 && presentRatio < absentRatio
              ? absentRatio - presentRatio
              : presentRatio - absentRatio) /
            (255 * 2)
      })`;

  return (
    day && (
      <Button
        disableRipple
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
          isCurrentDateSelected()
            ? "shadow"
            : originalDate.toDateString() === currentDate
            ? "solid"
            : "light"
        }
        color={isCurrentDateSelected() ? "primary" : "default"}
        style={
          (!selectedSubject ||
            ((days[currentDate]?.[selectedSubject]?.present ||
              days[currentDate]?.[selectedSubject]?.absent) &&
              presentRatio + absentRatio > 0)) &&
          originalDate.toDateString() !== currentDate &&
          !isCurrentDateSelected()
            ? {
                backgroundColor,
              }
            : {}
        }
        onClick={() => setToDayDate(new Date(currentDate))}
      >
        {day}
      </Button>
    )
  );
}

function isHolidayDate(day, month, year) {
  const date = new Date(year, month, day);
  return holidays.some((holiday) => {
    const [day, month, year] = holiday.date.split("-");
    return (
      new Date(year, month - 1, day).toDateString() === date.toDateString()
    );
  });
}

function isCalendarButtonDisabled(day, month, year, startDate, endDate) {
  const date = new Date(year, month, day);
  return date < new Date(startDate) || date > new Date(endDate);
}

function getFirstDayOffset(month, year) {
  const date = new Date(year, month, 1);
  return date.getDay() - 1;
}

function getDate(day, month, year) {
  const date = new Date(year, month, day);
  return date.getMonth() === month ? date.getDate() : null;
}

function getNumberOfDays(month, year) {
  return new Date(year, month + 1, 0).getDate();
}

function getMonthsBetween(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return end.getMonth() - start.getMonth() + 1;
}
