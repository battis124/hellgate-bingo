import { useState } from "react";
import Board from "./components/Board";
import { wordsList } from "./resources/wordsList";
import soundFile1 from "./resources/trudne-wylosowało.mp3";
import soundFile2 from "./resources/losu-losu.mp3";

const audio = [new Audio(soundFile1), new Audio(soundFile2)];
audio.map((sound) => {
  return (sound.volume = 0.2);
});

function playRandomizationSound() {
  var maximum = 1;
  var minimum = 0;
  var randomnumber =
    Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
  audio[randomnumber].play();
}

function App() {
  const [gameStatus, setGameStatus] = useState(false);
  const [squares, setSquares] = useState(
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      value: `${i + 1}`,
      isChecked: false,
      isWinningBox: false,
    }))
  );

  function handleResetGameClick() {
    setGameStatus(true);
    console.log("losu losu losu");
    playRandomizationSound();
    let wordsBank = [...wordsList];

    const newSquares = squares.map((square) => {
      if (square.id === 12)
        return {
          ...square,
          isChecked: true,
          isWinningBox: false,
          value: '(bingo)\n"Quazars jest za dobry"',
        };
      const index = Math.floor(Math.random() * wordsBank.length);
      const word = wordsBank[index];
      wordsBank.splice(index, 1);
      return { ...square, isChecked: false, isWinningBox: false, value: word };
    });

    setSquares(newSquares);
  }

  return (
    <div className="flex h-screen columns-1 flex-col">
      <div className="container mx-auto my-auto px-1 py-4 md:px-4">
        <div className="rounded bg-slate-300  p-6 text-center font-bold text-slate-950  sm:rounded-md sm:text-lg md:p-10 lg:text-2xl">
          HG Bingo!
        </div>
      </div>
      <Board
        squares={squares}
        setSquares={setSquares}
        gameStatus={gameStatus}
        setGameStatus={setGameStatus}
      />
      <div className="container mx-auto my-auto px-4 py-8 text-center">
        <button
          onClick={handleResetGameClick}
          className="rounded-full bg-blue-600 px-16 py-4 text-sm font-bold text-white transition hover:bg-blue-500 md:text-base"
        >
          Losuj !
        </button>
      </div>
    </div>
  );
}

export default App;
