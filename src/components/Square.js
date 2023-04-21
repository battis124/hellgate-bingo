function Square({ value, isChecked, onSquareClick, isWinningBox }) {
  return (
    <button
      onClick={onSquareClick}
      className={` 
       h-24 whitespace-pre-line rounded-lg px-2 text-sm font-semibold transition md:h-32 md:text-base lg:h-36 xl:text-lg
       ${isWinningBox && "bg-win"} 
       ${
         isChecked &&
         !isWinningBox &&
         "bg-blue-500 text-slate-200 hover:bg-blue-400 "
       } 
      ${
        !isChecked &&
        !isWinningBox &&
        "bg-slate-300 text-slate-950 hover:bg-slate-400"
      } 

      `}
    >
      {value}
    </button>
  );
}
export default Square;
