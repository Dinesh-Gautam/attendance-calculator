import { Form, FormInput } from "./Forms";

export function GetClassInfo({
  classNameValue: value,
  setClassNameValue: setValue,
}) {
  return (
    <Form>
      <FormInput
        placeholder="1CE12"
        id="classNameInput"
        onChange={(e) => setValue(e.target.value)}
        value={value}
        label="Class Name"
      />

      {/* <FormButton>Submit</FormButton> */}
    </Form>
  );
}
