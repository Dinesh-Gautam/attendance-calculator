import React from "react";
import { Checkbox } from "@nextui-org/react";
import { useStateContext } from "../context/stateContext";

export function TableOptions() {
  const { info, setInfo, todayDate } = useStateContext();
  const todayDateString = todayDate.toDateString();
  console.log(!!info?.options?.showAllSubjects);
  return (
    <div className="flex items-center mb-3 gap-4">
      <div>
        <p className="text-xs">Showing attendance</p>
        <span className="font-bold">{todayDateString}</span>
      </div>
      <div className="flex flex-row gap-2 items-center">
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
  );
}
