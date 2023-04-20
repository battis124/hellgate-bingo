import { useState } from "react";
import "./App.css";
import Board from "./components/Board";
import { wordsList } from "./resources/wordsList";

function App() {
  const [squares, setSquares] = useState(
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      value: `${i + 1}`,
      isChecked: false,
    }))
  );

  function handleResetGameClick() {
    console.log("losu losu losu");
    let wordsBank = [...wordsList];

    const newSquares = squares.map((square) => {
      if (square.id === 12)
        return {
          ...square,
          isChecked: true,
          value: '(bingo)\n"Quazars jest za dobry"',
        };
      const index = Math.floor(Math.random() * wordsBank.length);
      const word = wordsBank[index];
      wordsBank.splice(index, 1);
      return { ...square, isChecked: false, value: word };
    });

    setSquares(newSquares);
  }

  return (
    <>
      <div className="container mx-auto my-auto px-4 py-4">
        <div className="w-100 rounded-lg  bg-slate-300 p-10 text-center text-2xl font-bold text-slate-950">
          HG Bingo!
        </div>
      </div>
      <Board squares={squares} setSquares={setSquares} />
      <div className="container mx-auto my-auto px-4 py-4 text-center">
        <button
          onClick={handleResetGameClick}
          className=" rounded-full bg-blue-600 px-16 py-4 font-bold text-white transition hover:bg-blue-500"
        >
          Losuj !
        </button>
      </div>
    </>
  );
}

export default App;
