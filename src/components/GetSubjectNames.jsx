import { Form, FormInput } from "./Forms";

export function GetSubjectNames({
  subjectNamesValue: value,
  setSubjectNamesValue: setValue,
}) {
  return (
    <Form>
      <FormInput
        label="Subjects"
        id="subjectsInput"
        placeholder="subject1,subject2,subject3"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {/* <FormButton type="submit">Submit</FormButton> */}
    </Form>
  );
}
