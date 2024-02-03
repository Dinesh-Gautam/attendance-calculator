import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";
import { Input } from "@nextui-org/react";
// import useUndo from "../hooks/useUndo";

export function Form({ children, ...formProps }) {
  return (
    <Card className="p-4 w-fit max-w-full">
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

export function FormFooter({ state, setState, initialValue }) {
  // const { canUndo, canRedo, undo, redo } = useUndo(state);
  return (
    <div className="flex flex-row gap-1 justify-between m-top-auto">
      <FlexBox>
        {/* {canUndo && (
          <Button variant="flat" onClick={undo}>
            Undo
          </Button>
        )}
        {canRedo && (
          <Button variant="flat" onClick={redo}>
            Redo
          </Button>
        )} */}
      </FlexBox>
      {initialValue && (
        <FlexBox>
          <Button
            onClick={(e) => {
              e.preventDefault();
              window.confirm(
                "Are you sure you want to restore the default value?"
              ) && setState(initialValue);
            }}
            variant="flat"
          >
            Restore
          </Button>
        </FlexBox>
      )}
    </div>
  );
}

function FlexBox({ children }) {
  return <div className="flex flex-row gap-1">{children}</div>;
}
