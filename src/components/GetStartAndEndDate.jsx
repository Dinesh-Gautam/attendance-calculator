import { useState } from "react";
import { Form } from "./Forms";
import { FormInput, FormButton } from "./Forms";
import { useStateContext } from "../context/stateContext";

export function GetStartAndEndDate() {
  const { info, setInfo } = useStateContext();

  const [value, setValue] = useState({
    startDate: info?.startDate || "",
    endDate: info?.endDate || "",
  });
  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        setInfo({ ...info, ...value });
      }}
    >
      <FormInput
        label="Start Date"
        id="startDateInput"
        type="date"
        value={value.startDate}
        onChange={(e) =>
          setValue((prev) => ({
            ...prev,
            startDate: e.target.value,
          }))
        }
      />
      <FormInput
        label="End Date"
        id="endDateInput"
        type="date"
        value={value.endDate}
        onChange={(e) =>
          setValue((prev) => ({ ...prev, endDate: e.target.value }))
        }
      />
      <FormButton type="submit">Submit</FormButton>
    </Form>
  );
}
