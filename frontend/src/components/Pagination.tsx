interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ page, totalPages, onPageChange }: PaginationProps) => {
  const isPreviousDisabled = page <= 1;
  const isNextDisabled = page >= totalPages;

  return (
    <div className="flex items-center justify-between gap-3 pt-4">
      <button
        type="button"
        className="btn-secondary"
        onClick={() => onPageChange(page - 1)}
        disabled={isPreviousDisabled}
      >
        Previous
      </button>

      <span className="text-sm text-ink/70 font-medium">
        Page {page} of {totalPages}
      </span>

      <button
        type="button"
        className="btn-secondary"
        onClick={() => onPageChange(page + 1)}
        disabled={isNextDisabled}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
