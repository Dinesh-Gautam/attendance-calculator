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
export function getMonthName(month) {
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
export function getWeekNames() {
  return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
}
