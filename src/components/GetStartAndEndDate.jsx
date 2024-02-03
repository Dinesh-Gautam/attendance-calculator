import { Form, FormInput } from "./Forms";

export function GetStartAndEndDate({
  datesValue: value,
  setDatesValue: setValue,
  initialValue,
}) {
  return (
    <Form>
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
    </Form>
  );
}
