import { useEffect } from "react";
import { useState } from "react";

function useUndo(state, setState) {
  const [history, setHistory] = useState([]);
  const [current, setCurrent] = useState(0);

  const canUndo = current > 1;
  const canRedo = current < history.length;

  useEffect(() => {
    addHistory();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const undo = () => {
    if (canUndo) {
      setCurrent((prev) => prev - 1);
      setState(history[current - 2]);
    }
  };
  const redo = () => {
    console.log(history, current);

    if (canRedo) {
      setCurrent((prev) => prev + 1);
      setState(history[current - 1]);
    }
  };
  const addHistory = () => {
    const newHistory = history.slice(0, current + 1);
    newHistory.push(state);
    setHistory(newHistory);
    setCurrent(current + 1);
  };
  const resetHistory = () => {
    setHistory([]);
    setCurrent(0);
  };
  return {
    canUndo,
    canRedo,
    undo,
    redo,
    addHistory,
    resetHistory,
  };
}

export default useUndo;
