import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";
import { Input } from "@nextui-org/react";
import useUndo from "../hooks/useUndo";

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
  return (
    <input
      disableAnimation={true}
      variant="faded"
      type={props.type || "text"}
      {...props}
    />
  );
}

export function FormButton({ children, onClick }) {
  return (
    <Button variant="flat" type="submit" onClick={onClick}>
      {children}
    </Button>
  );
}

export function FormFooter({ state }) {
  return null;
  const { canUndo, canRedo, undo, redo } = useUndo(state);
  return (
    <Card className="p-1 flex flex-row gap-1 justify-between m-top-auto">
      <FlexBox>
        {canUndo && (
          <Button variant="flat" onClick={undo}>
            Undo
          </Button>
        )}
        {canRedo && (
          <Button variant="flat" onClick={redo}>
            Redo
          </Button>
        )}
      </FlexBox>
      <FlexBox>
        <Button variant="flat">Restore</Button>
      </FlexBox>
    </Card>
  );
}

function FlexBox({ children }) {
  return <div className="flex flex-row gap-1">{children}</div>;
}
