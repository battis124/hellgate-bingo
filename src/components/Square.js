function Square({ value, isChecked, onSquareClick }) {
  return (
    <button
      onClick={onSquareClick}
      className={` 
      h-36 whitespace-pre-line rounded-lg  px-2 font-semibold  transition   md:text-base xl:text-lg
      ${
        isChecked
          ? "bg-green-500  text-slate-950 hover:bg-green-400 "
          : "bg-slate-300 text-slate-950 hover:bg-slate-400"
      } 

      `}
    >
      {value}
    </button>
  );
}
export default Square;
