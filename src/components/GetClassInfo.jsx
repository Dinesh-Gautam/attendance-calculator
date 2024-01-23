import { useState } from "react";
import { Form } from "./Forms";
import { FormInput, FormButton } from "./Forms";
import { useStateContext } from "../context/stateContext";

export function GetClassInfo() {
  const { info, setInfo } = useStateContext();
  const [value, setValue] = useState(info?.className || "");
  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        setInfo({ ...info, className: value });
      }}
    >
      <FormInput
        placeholder="1CE12"
        id="classNameInput"
        onChange={(e) => setValue(e.target.value)}
        value={value}
        label="Class Name"
      />

      <FormButton>Submit</FormButton>
    </Form>
  );
}
