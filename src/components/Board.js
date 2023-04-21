import React from "react";
import Square from "./Square";
import winSound from "../resources/victory.mp3";
const audio = new Audio(winSound);
audio.volume = 0.3;

function playWinSound() {
  audio.play();
}

function Board({ squares, setSquares, gameStatus, setGameStatus }) {
  function setWinningSquares(lines) {
    console.log(lines);
    const newSquares = squares.map((square) => {
      if (lines.includes(square.id)) {
        return { ...square, isWinningBox: true };
      }
      return square;
    });
    setSquares(newSquares);
    setGameStatus(false);
  }

  function handleClick(id) {
    if (!gameStatus) return;
    if (id === 12) return; // bingo

    //  console.log(squares);
    //   if (calculateWinner(squares) || squares[id]) {
    //     return;
    //   }
    //  if (calculateWinner(squares)) {
    //    // return;
    //  }

    // why is this not working ?
    //  let newSquares = squares;
    //  newSquares[i].isChecked = !newSquares[i].isChecked;

    const newSquares = squares.map((square) => {
      if (square.id === id) {
        return { ...square, isChecked: !square.isChecked };
      }
      return square;
    });

    setSquares(newSquares);
    var [isWin, winningLines] = calculateWinner(newSquares);
    if (isWin) setWinningSquares(winningLines);
  }

  return (
    <div className="flex md:grow">
      <div className="container mx-auto my-auto grid h-full max-h-[40rem] auto-rows-fr grid-cols-5 gap-1 px-1 py-6 sm:gap-2 md:max-h-[50rem] md:gap-3 md:px-4 lg:gap-4 xl:max-h-[55rem]">
        {squares.map((square) => (
          <Square
            key={square.id}
            value={square.value}
            isChecked={square.isChecked}
            isWinningBox={square.isWinningBox}
            onSquareClick={() => handleClick(square.id)}
          />
        ))}
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    //horizontal
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24],

    //vertical
    [0, 5, 10, 15, 20],
    [1, 6, 11, 16, 21],
    [2, 7, 12, 17, 22],
    [3, 8, 13, 18, 23],
    [4, 9, 14, 19, 24],

    //diagonal
    [0, 6, 12, 18, 24],
    [4, 8, 12, 16, 20],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c, d, e] = lines[i];
    if (
      squares[a].isChecked === true &&
      squares[b].isChecked === true &&
      squares[c].isChecked === true &&
      squares[d].isChecked === true &&
      squares[e].isChecked === true
    ) {
      playWinSound();
      console.log("win!");

      return [true, lines[i]];
    }
  }

  return [false, false];
}
export default Board;
