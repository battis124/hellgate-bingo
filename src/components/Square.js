function Square({ value, isChecked, onSquareClick, isWinningBox }) {
  return (
    <button
      onClick={onSquareClick}
      className={` 
       min-h-[6rem] whitespace-pre-line rounded-sm px-2 text-xs font-semibold transition sm:rounded-md sm:text-sm md:h-full md:text-base 2xl:text-lg
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
