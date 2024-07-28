import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import {
  Edit2,
  Info,
  Moon,
  Settings,
  Sun,
  Table,
  Table as TableIcon,
  Trash,
} from "react-feather";
import { useStateContext } from "../context/stateContext";
import { motion } from "framer-motion";

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
    <motion.div
      layout="position"
      className="flex flex-row gap-2 flex-wrap p-4 pb-4 items-center md:justify-between"
    >
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

        <Dropdown placement="bottom">
          <DropdownTrigger>
            <Button isIconOnly variant="light">
              <Settings />
            </Button>
          </DropdownTrigger>

          <DropdownMenu>
            <DropdownItem
              onClick={() => setEdit({ type: "info" })}
              startContent={
                <CombinedIcon PrimaryIcon={Info} SecondaryIcon={Edit2} />
              }
            >
              Edit Info
            </DropdownItem>
            <DropdownItem
              onClick={() => setEdit({ type: "timetable" })}
              startContent={
                <CombinedIcon PrimaryIcon={Table} SecondaryIcon={Edit2} />
              }
            >
              Edit Timetable
            </DropdownItem>
            <DropdownItem
              onClick={theme.toggleTheme}
              startContent={
                theme.value === "dark" ? (
                  <CombinedIcon PrimaryIcon={Sun} />
                ) : (
                  <CombinedIcon PrimaryIcon={Moon} />
                )
              }
            >
              {theme.value === "dark" ? "Light" : "Dark"} Mode
            </DropdownItem>

            <DropdownItem
              className="text-danger"
              color="danger"
              startContent={<CombinedIcon PrimaryIcon={Trash} />}
              onClick={() => window.confirm("Delete all data?") && setDays({})}
            >
              Clear Data
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </motion.div>
  );
}
function CombinedIcon({ PrimaryIcon, SecondaryIcon }) {
  return (
    <div className="relative text-sm">
      {SecondaryIcon && (
        <div className="absolute -bottom-2 -right-2  scale-50">
          <SecondaryIcon strokeWidth="4px" />
        </div>
      )}
      <PrimaryIcon size="1.4em" />
    </div>
  );
}

export default Header;
