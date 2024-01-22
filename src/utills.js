export function getWeekName(weekNo) {
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
export function isAllDataInserted(info) {
  return (
    info.className &&
    info.startDate &&
    info.endDate &&
    info.subjects &&
    info.timeTable
  );
}
