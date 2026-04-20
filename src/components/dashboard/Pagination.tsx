interface PaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onNext: () => void;
  onPrev: () => void;
}

export function Pagination({ currentPage, pageSize, totalItems, onNext, onPrev }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  return (
    <div className="flex items-center justify-between rounded-3xl border border-blue-100 bg-white px-5 py-4 shadow-sm">
      <p className="text-sm text-slate-600">
        Showing page <span className="font-semibold text-slate-900">{currentPage}</span> of <span className="font-semibold text-slate-900">{totalPages}</span>
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onPrev}
          disabled={currentPage === 1}
          className="rounded-2xl border border-blue-100 px-4 py-2 text-sm font-semibold text-slate-700 transition enabled:hover:border-sky-300/30 enabled:hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={currentPage >= totalPages}
          className="rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-slate-50 transition enabled:hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}