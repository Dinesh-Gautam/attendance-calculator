import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";
import { useStateContext } from "../context/stateContext";

export function Calendar() {
  const { info, days, todayDate, setToDayDate, originalDate } =
    useStateContext();
  const noOfMonth = getNoOfMonth(info.startDate, info.endDate);
  return (
    <div className="p-4">
      <Card className="p-2 flex flex-row gap-2 flex-wrap justify-center md:justify-between">
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
