import { DateRangePicker } from "@nextui-org/date-picker";
import { Form, FormInput } from "./Forms";
import { parseDate } from "@internationalized/date";

export function GetStartAndEndDate({
  datesValue: value,
  setDatesValue: setValue,
  initialValue,
}) {
  return (
    <Form>
      {/* <FormInput
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
      /> */}
      <DateRangePicker
        className="bg-default-88 text-background"
        label="Semester duration"
        isRequired
        value={
          value.startDate && value.endDate
            ? {
                start: parseDate(getISODateString(new Date(value.startDate))),
                end: parseDate(getISODateString(new Date(value.endDate))),

                // end: parseDate(value.endDate),
              }
            : {}
        }
        onChange={(e) => {
          const { start, end } = e;
          setValue({
            startDate: start.toDate(),
            endDate: end.toDate(),
          });
        }}
        variant="faded"
        // defaultValue={{}}
        // className="max-w-xs"
      />
    </Form>
  );
}

function getISODateString(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month < 10 ? "0" + month : month}-${
    day < 10 ? "0" + day : day
  }`;
}
