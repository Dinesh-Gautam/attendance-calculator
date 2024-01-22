import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import {
  Edit2,
  Moon,
  Settings,
  Sun,
  Table as TableIcon,
  Trash,
} from "react-feather";
import { useStateContext } from "../context/stateContext";

function Header() {
  const {
    showTimeTable,
    setShowTimeTable,
    originalDate,
    setEdit,
    setDays,
    theme,
  } = useStateContext();

  return (
    <div className="flex flex-row gap-2 flex-wrap p-4 pb-4 items-center md:justify-between">
      <div className="flex flex-col">
        <span className="text-xs">Today's Date</span>
        <span style={{ fontWeight: "bold" }}>
          {originalDate.toDateString()}
        </span>
      </div>

      <div className="flex gap-2">
        <Button
          variant="flat"
          onClick={() => setShowTimeTable((prev) => !prev)}
        >
          <TableIcon />
          <div>
            <span>{showTimeTable ? "Hide " : "Show "}</span>
            <span>Timetable</span>
          </div>
        </Button>

        <Dropdown className="bg-foreground text-background" placement="bottom">
          <DropdownTrigger>
            <Button isIconOnly variant="light">
              <Settings />
            </Button>
          </DropdownTrigger>

          <DropdownMenu>
            <DropdownItem
              onClick={() => setEdit(true)}
              startContent={<Edit2 />}
            >
              Edit
            </DropdownItem>

            <DropdownItem
              onClick={theme.toggleTheme}
              startContent={theme.value === "dark" ? <Sun /> : <Moon />}
            >
              {theme.value === "dark" ? "Light" : "Dark"} Mode
            </DropdownItem>

            <DropdownItem
              className="text-danger"
              color="danger"
              startContent={<Trash />}
              onClick={() => window.confirm("Delete all data?") && setDays({})}
            >
              Clear Data
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
}

export default Header;
