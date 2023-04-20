import React from "react";
import Square from "./Square";

function Board({ squares, setSquares }) {
  function handleClick(id) {
    console.log(squares);
    //  if (calculateWinner(squares) || squares[id]) {
    //    return;
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
  }

  return (
    <div className="container mx-auto my-auto grid grid-cols-5 gap-4 px-4 py-4">
      {squares.map((square) => (
        <Square
          key={square.id}
          value={square.id}
          isChecked={square.isChecked}
          onSquareClick={() => handleClick(square.id)}
        />
      ))}
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
export default Board;
