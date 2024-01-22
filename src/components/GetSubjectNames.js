import { useState } from "react";
import { subjects } from "../config";
import { Form } from "./Forms";
import { FormInput, FormButton } from "./Forms";
import { useStateContext } from "../context/stateContext";

export function GetSubjectNames() {
  const { info, setInfo } = useStateContext();

  const [value, setValue] = useState(
    info?.subjects?.map((s) => s.name).join(",") ||
      [...subjects]
        .sort((a, b) => a.id - b.id)
        .map((s) => s.name)
        .join(",") ||
      ""
  );
  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        setInfo({
          ...info,
          subjects: value.split(",").map((s, index) => ({
            name: s.trim(),
            id: Math.max(...(subjects.map((sub) => sub.id) || [] || 0)) + index,
            ...(subjects.find((sub) => sub.name === s.trim()) || {}),
          })),
        });
      }}
    >
      <FormInput
        label="Subjects"
        id="subjectsInput"
        placeholder="subject1,subject2,subject3"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <FormButton type="submit">Submit</FormButton>
    </Form>
  );
}
