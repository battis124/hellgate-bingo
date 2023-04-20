function Square({ value, isChecked, onSquareClick }) {
  return (
    <button
      onClick={onSquareClick}
      className={` 
      ${isChecked ? "bg-green-500  hover:bg-green-400  " : ""} 
      h-36 whitespace-pre-line rounded-lg bg-slate-300 px-2 font-semibold text-slate-950 transition hover:bg-slate-500  md:text-base xl:text-lg`}
    >
      {value}
    </button>
  );
}
export default Square;
