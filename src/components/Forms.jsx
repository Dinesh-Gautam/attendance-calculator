import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";
import { Input } from "@nextui-org/react";

export function Form({ children, ...formProps }) {
  return (
    <Card className="p-4 w-fit">
      <form className="flex flex-col gap-4 max-w-fit" {...formProps}>
        {children}
      </form>
    </Card>
  );
}

export function FormInput({ ...props }) {
  return <Input variant="faded" type={props.type || "text"} {...props} />;
}

export function FormButton({ children, onClick }) {
  return (
    <Button variant="flat" type="submit" onClick={onClick}>
      {children}
    </Button>
  );
}
