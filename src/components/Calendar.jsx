import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";
import { useStateContext } from "../context/stateContext";
import { getMonthName } from "../utils";
import { getWeekNames } from "../utils";
import { holidays } from "../config";
import { useMemo } from "react";

export function Calendar() {
  const { info } = useStateContext();
  const noOfMonth = getMonthsBetween(info.startDate, info.endDate);
  return (
    <div className="p-4">
      <Card className="p-2 flex flex-row gap-2 flex-wrap justify-center md:justify-between">
        {[...Array(noOfMonth)].map((_, monthNo) => {
          return <CalenderMonth monthNo={monthNo} key={monthNo} />;
        })}
      </Card>
    </div>
  );
}
function CalenderMonth({ monthNo }) {
  const { info } = useStateContext();
  const startDate = new Date(info.startDate);
  startDate.setMonth(monthNo + 1);

  const noOfDays = getNumberOfDays(monthNo + 1, startDate.getFullYear());

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
          {[...Array(Math.ceil(noOfDays / 7))].map((_, weekNo) => (
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
    const year = startDate.getFullYear();
    const day = getDate(
      weekDayNo +
        1 +
        7 * weekNo -
        getFirstDayOffset(monthNo, startDate.getFullYear()),
      monthNo,
      year
    );
    const currentDate = new Date(year, monthNo, day).toDateString();

    return (
      <td key={monthNo + weekNo + weekDayNo}>
        {day && (
          <CalenderButton
            day={day}
            monthNo={monthNo}
            date={startDate}
            currentDate={currentDate}
          />
        )}
      </td>
    );
  });
}

function getPresentAndAbsentCount(type, days, currentDate) {
  return (
    Object.values(days?.[currentDate] ?? {})?.filter((day) => day[type])
      .length ?? 0
  );
}

function CalenderButton({ day, monthNo, date, currentDate }) {
  const { info, days, todayDate, setToDayDate, originalDate } =
    useStateContext();
  const presentCount = getPresentAndAbsentCount("present", days, currentDate);
  const absentCount = getPresentAndAbsentCount("absent", days, currentDate);
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
  return (
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
        isCurrentDateSelected()
          ? "shadow"
          : originalDate.toDateString() === currentDate
          ? "solid"
          : "light"
      }
      color={isCurrentDateSelected() ? "primary" : "default"}
      style={
        !isCurrentDateSelected() &&
        presentRatio + absentRatio > 0 &&
        currentDate !== originalDate.toDateString()
          ? {
              backgroundColor: `hsl(${
                absentRatio > 0 && absentRatio > presentRatio
                  ? "var(--nextui-danger)"
                  : "var(--nextui-success)"
              } / ${
                (absentRatio > 0 && presentRatio < absentRatio
                  ? absentRatio - presentRatio
                  : presentRatio - absentRatio) /
                (255 * 2)
              })`,
            }
          : isHoliday
          ? { backgroundColor: "hsl(var(--nextui-warning-100))" }
          : {}
      }
      onClick={() => setToDayDate(new Date(currentDate))}
    >
      {day}
    </Button>
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
  const date = new Date(year, month, day + 1);

  return (
    date < new Date(startDate) ||
    date > new Date(endDate).setDate(new Date(endDate).getDate() + 1)
  );
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
