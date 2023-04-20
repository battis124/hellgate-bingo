function Square({ value, isChecked, onSquareClick }) {
  return (
    <button
      onClick={onSquareClick}
      className={` ${
        isChecked ? "bg-red-600 hover:bg-red-400" : ""
      } rounded bg-slate-300 px-2 py-10 font-semibold text-slate-950 transition hover:bg-slate-500 md:py-12 lg:py-16 `}
    >
      {value}
    </button>
  );
}
export default Square;
