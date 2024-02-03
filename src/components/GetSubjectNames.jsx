import {
  Button,
  Autocomplete,
  AutocompleteItem,
  Card,
} from "@nextui-org/react";
import { Form, FormFooter, FormInput } from "./Forms";
import { Plus, X } from "react-feather";
import { v4 as uuidv4 } from "uuid";
export function GetSubjectNames({
  subjectNamesValue: value,
  setSubjectNamesValue: setValue,
  initialValue,
}) {
  return (
    <Form>
      <div className="flex flex-row gap-2 max-w-fit flex-1 flex-wrap items-center">
        {value.map(({ id, name }, i) => (
          <Card
            key={i}
            className="relative flex flex-row items-start gap-1 p-1"
          >
            <FormInput
              className="max-w-40 min-w-20"
              ariaLabel="Subjects"
              id="subjectsInput"
              placeholder={"subject " + (i + 1)}
              value={name}
              onChange={(e) =>
                setValue((prev) => [
                  ...prev.slice(0, i),
                  { id, name: e.target.value },
                  ...prev.slice(i + 1),
                ])
              }
            />
            {/* <Autocomplete
              size="sm"
              placeholder={"subject " + (i + 1)}
              defaultSelectedKey={name}
            >
              {value.map(({ id, name }) => (
                <AutocompleteItem key={name} value={name}>
                  {name}
                </AutocompleteItem>
              ))}
            </Autocomplete> */}
            <Button
              // className="absolute top-0 right-0"
              isIconOnly
              size="sm"
              variant="light"
              onClick={() =>
                setValue((prev) => [...prev.filter((v) => v.id !== id)])
              }
            >
              <X size={"1.2rem"} opacity={0.5} />
            </Button>
          </Card>
        ))}
        {/* <FormButton type="submit">Submit</FormButton> */}
        <Button
          isIconOnly
          variant="flat"
          size="lg"
          onClick={() =>
            setValue((prev) => [...prev, { id: uuidv4(), name: "" }])
          }
        >
          <Plus />
        </Button>
      </div>
      <FormFooter
        state={value}
        setState={setValue}
        initialValue={initialValue}
      />
    </Form>
  );
}
