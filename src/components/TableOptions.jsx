import React from "react";
import { Checkbox } from "@nextui-org/react";
import { useStateContext } from "../context/stateContext";

export function TableOptions() {
  const { todayDate } = useStateContext();
  const todayDateString = todayDate.toDateString();
  return (
    <div className="flex items-center mb-3 gap-4">
      <div style={{ whiteSpace: "nowrap" }}>
        <p className="text-xs">Showing attendance</p>
        <span className="font-bold">{todayDateString}</span>
      </div>
      <div className="flex flex-row gap-2 items-center">
        <Option optionKey="showAllSubjects" text={"Show all subjects"} />
      </div>
    </div>
  );
}

export function Option({ optionKey, text }) {
  const { info, setInfo } = useStateContext();
  return (
    <Checkbox
      style={{
        whiteSpace: "nowrap",
      }}
      type="checkbox"
      defaultSelected={!!info?.options?.[optionKey]}
      onChange={(e) =>
        setInfo((prev) => ({
          ...prev,
          options: {
            ...prev.options,
            [optionKey]: e.target.checked,
          },
        }))
      }
    >
      {text}
    </Checkbox>
  );
}
