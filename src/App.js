import { useState } from "react";
import "./App.css";
import Board from "./components/Board";

function App() {
  const [squares, setSquares] = useState(
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      value: "",
      isChecked: false,
    }))
  );

  return (
    <>
      <Board squares={squares} setSquares={setSquares} />
    </>
  );
}

export default App;
