import { useState } from "react";
import Chart from "react-google-charts";
import { Card, Select, SelectItem } from "@nextui-org/react";
import { useStateContext } from "../context/stateContext";
import { getAttendedLectures } from "./GetTodaysAttendance";

export function Charts() {
  const { days, info } = useStateContext();
  const [displayChart, setDisplayChart] = useState("Attended Lectures");

  const attendedLecturesData = getAttendedLecturesData(info, days);
  const attendanceRatioData = getAttendanceRatioData(info, days);

  const commonChartOptions = {
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
      data: attendedLecturesData,
      options: {
        title: "Attended Lectures",
        ...commonChartOptions,
      },
    },
    "Attendance Ratio": {
      chartType: "PieChart",
      data: attendanceRatioData,
      options: {
        title: "Attendance Ratio",
        ...commonChartOptions,
      },
    },
  };

  return (
    <Card className="p-4 w-max flex flex-col gap-4 flex-nowrap min-w-fit shadow-small">
      <Select
        classNames={{
          popoverContent: "bg-default-800 text-background",
        }}
        size="sm"
        className="w-full mw-max"
        label="Select chart type"
        selectedKeys={[displayChart]}
        onChange={(e) => e.target.value && setDisplayChart(e.target.value)}
      >
        {Object.keys(charts).map((key) => (
          <SelectItem variant="faded" key={key} value={key}>
            {key}
          </SelectItem>
        ))}
      </Select>

      <div className="w-max">
        <Chart
          chartType="PieChart"
          data={charts[displayChart].data}
          options={charts[displayChart].options}
          width="100%"
          height="400px"
        />
      </div>
    </Card>
  );

  function getAttendedLecturesData(info, days) {
    return [
      ["Subjects", "Attended Lectures"],
      ...info.subjects.map((subject) => {
        const attended = getAttendedLectures(subject, days);
        return [subject.name, attended];
      }),
    ];
  }

  function getAttendanceRatioData(info, days) {
    const totalPresent = getTotalPresent(info, days);
    const totalAbsent = getTotalAbsent(info, days);
    const totalMissed = getTotalMissed(info, days);

    return [
      ["Ratio", "Attendance"],
      ["Total Present", totalPresent],
      ["Total Absent", totalAbsent],
      ["Lectures not taken", totalMissed],
    ];
  }

  function getTotalPresent(info, days) {
    return info.subjects
      .map((subject) => getTotalPresentForSubject(subject, days))
      .reduce((a, b) => a + b, 0);
  }

  function getTotalAbsent(info, days) {
    return info.subjects
      .map((subject) => getTotalAbsentForSubject(subject, days))
      .reduce((a, b) => a + b, 0);
  }

  function getTotalMissed(info, days) {
    return info.subjects
      .map((subject) => getTotalMissedForSubject(subject, days))
      .reduce((a, b) => a + b, 0);
  }

  function getTotalPresentForSubject(subject, days) {
    return Object.values(days)
      .map((day) => (day[subject.id]?.present ? 1 : 0))
      .reduce((a, b) => a + b, 0);
  }

  function getTotalAbsentForSubject(subject, days) {
    return Object.values(days)
      .map((day) => (day[subject.id]?.absent ? 1 : 0))
      .reduce((a, b) => a + b, 0);
  }

  function getTotalMissedForSubject(subject, days) {
    return Object.values(days)
      .map((day) =>
        !day[subject.id]?.absent && !day[subject.id]?.present ? 1 : 0
      )
      .reduce((a, b) => a + b, 0);
  }
}
