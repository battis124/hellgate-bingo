import React from "react";
import Square from "./Square";

function Board({ squares, setSquares }) {
  function handleClick(id) {
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
    calculateWinner(newSquares);
  }

  return (
    <div className="container mx-auto my-auto grid grid-cols-5 gap-4 px-4 py-4">
      {squares.map((square) => (
        <Square
          key={square.id}
          value={square.value}
          isChecked={square.isChecked}
          onSquareClick={() => handleClick(square.id)}
        />
      ))}
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
      console.log("win!");
      return true;
    }
  }

  return false;
}
export default Board;
