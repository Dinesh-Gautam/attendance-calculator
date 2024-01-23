import { createContext, useContext, useEffect, useState } from "react";
import { useDarkMode } from "../hooks/useDarkMode";

const stateContext = createContext();

export function useStateContext() {
  return useContext(stateContext);
}

export function StateProvider({ children }) {
  const [info, setInfo] = useState(null);
  const [days, setDays] = useState(null);
  const [todayDate, setToDayDate] = useState(new Date());
  const [originalDate, setOriginalDate] = useState(new Date());
  const [edit, setEdit] = useState(false);
  const [showTimeTable, setShowTimeTable] = useState(false);
  const [sortCol, setSortCol] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [displayChart, setDisplayChart] = useState("Attended Lectures");

  const theme = useDarkMode(true);

  useEffect(() => {
    // get info from localStorage
    const info = JSON.parse(localStorage.getItem("info"));
    const days = JSON.parse(localStorage.getItem("days"));
    console.log(info);
    setInfo(info ?? {});
    setDays(days ?? []);
  }, []);

  useEffect(() => {
    // save info to local storage
    if (!info) return;
    localStorage.setItem("info", JSON.stringify(info));
  }, [info]);

  useEffect(() => {
    // save info to local storage
    if (!days) return;
    localStorage.setItem("days", JSON.stringify(days));
  }, [days]);

  return (
    <stateContext.Provider
      value={{
        info,
        setInfo,
        days,
        setDays,
        todayDate,
        setToDayDate,
        originalDate,
        setOriginalDate,
        edit,
        setEdit,
        showTimeTable,
        setShowTimeTable,
        sortCol,
        setSortCol,
        sortOrder,
        setSortOrder,
        displayChart,
        setDisplayChart,
        theme,
      }}
    >
      {children}
    </stateContext.Provider>
  );
}
