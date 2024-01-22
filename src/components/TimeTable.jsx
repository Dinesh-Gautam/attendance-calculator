import { Card } from "@nextui-org/card";
import { getWeekName } from "../utills";

export function TimeTable({ days, info }) {
  const subjects = info.timeTable;

  return (
    <Card className="mx-4 p-4 flex flex-row justify-center overflow-auto min-w-fit">
      <table className="timetable" borderspacing="1">
        <thead>
          <tr>
            <td />
            {Array.from({ length: getNoOfWeeks(subjects) }).map((_, weekNo) => (
              <th key={weekNo}>{getWeekName(weekNo + 1)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({
            length:
              getMaxEndTimeOfSubjects(subjects) -
              getMinStartTimeOfSubjects(subjects),
          }).map((_, time) => (
            <tr key={time}>
              <th>
                <span>
                  {formatTime(time + getMinStartTimeOfSubjects(subjects))}
                </span>
                -
                <span>
                  {formatTime(time + 1 + getMinStartTimeOfSubjects(subjects))}
                </span>
              </th>
              {Array.from({ length: getNoOfWeeks(subjects) }).map(
                (_, weekNo) => {
                  const subject = getSubjectAtTime(
                    subjects,
                    time + getMinStartTimeOfSubjects(subjects),
                    weekNo
                  );
                  const prevSubject = findPrevSubject(
                    subjects,
                    time + getMinStartTimeOfSubjects(subjects),
                    weekNo
                  );

                  if (!subject && prevSubject) return null;
                  if (!subject) return <td key={weekNo} />;

                  const presentRatio = getSubjectPresentRatio(subject.id, days);

                  return (
                    <td
                      key={`${subject.id}_${weekNo}${time}`}
                      style={{
                        backgroundColor: getPresentRatioColor(presentRatio),
                      }}
                      rowSpan={subject.endTime - subject.startTime}
                    >
                      {subject.name}
                      {!isNaN(presentRatio) && (
                        <span style={{ fontSize: "0.8em", marginLeft: "auto" }}>
                          {presentRatio.toFixed(0)}%
                        </span>
                      )}
                    </td>
                  );
                }
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function getSubjectPresentRatio(subjectId, days) {
  const daysData = Object.values(days).flatMap((day) => Object.entries(day));

  const totalPresent = daysData.filter(
    ([id, att]) => att?.present && +id === subjectId
  ).length;

  const totalAbsent = daysData.filter(
    ([id, att]) => att?.absent && +id === subjectId
  ).length;

  return (totalPresent / (totalPresent + totalAbsent)) * 100;
}

function formatTime(twentyFourHourTime) {
  const hour = twentyFourHourTime % 12 || 12;
  const suffix = twentyFourHourTime < 12 ? "AM" : "PM";

  return (
    <>
      <span>{hour}</span>
      <span className="timeSuffix">{suffix}</span>
    </>
  );
}

function findPrevSubject(subjects, time, weekNo) {
  return subjects.find((subject) => {
    return subject.lectures[weekNo + 1]?.some((lecture) => {
      return time < lecture.endTime && time > lecture.startTime;
    });
  });
}

function getSubjectAtTime(subjects, time, weekNo) {
  const subject = subjects.find((subject) => {
    return subject.lectures[weekNo + 1]?.some((lecture) => {
      return !time || time === lecture.startTime;
    });
  });
  if (!subject) return null;
  return {
    id: subject.id,
    name: subject.name,
    startTime: subject.lectures[weekNo + 1][0].startTime,
    endTime: subject.lectures[weekNo + 1][0].endTime,
  };
}

function getPresentRatioColor(presentRatio) {
  return `hsl(${
    presentRatio <= 75 ? "var(--nextui-danger)" : "var(--nextui-success)"
  } / ${Math.min(Math.abs(presentRatio / 100 - 0.75) + 0.75, 1) - 0.35})`;
}

function getNoOfWeeks(subjects) {
  const max = Math.max(
    ...subjects.map((subject) => Math.max(...Object.keys(subject.lectures)))
  );
  return max;
}

function getMaxEndTimeOfSubjects(subjects) {
  return subjects.reduce((maxEndTime, subject) => {
    for (const lectureArray of Object.values(subject.lectures)) {
      const maxLectureEndTime = lectureArray.reduce((currentMax, lecture) => {
        return Math.max(currentMax, lecture.endTime);
      }, 0);
      maxEndTime = Math.max(maxEndTime, maxLectureEndTime);
    }
    return maxEndTime;
  }, 0);
}

function getMinStartTimeOfSubjects(subjects) {
  return subjects.reduce((minStartTime, subject) => {
    for (const lectureArray of Object.values(subject.lectures)) {
      const minLectureStartTime = lectureArray.reduce((currentMin, lecture) => {
        return Math.min(currentMin, lecture.startTime);
      }, minStartTime);
      minStartTime = Math.min(minStartTime, minLectureStartTime);
    }
    return minStartTime;
  }, Infinity);
}
