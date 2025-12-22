import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

type PageItem = number | "...";

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  lastPage,
  onPageChange,
  className = "",
}) => {
  const getPageNumbers = (): PageItem[] => {
    const pages: PageItem[] = [];
    const maxVisiblePages = 5;

    if (lastPage <= maxVisiblePages) {
      for (let i = 1; i <= lastPage; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(lastPage - 1, currentPage + 1);

      if (currentPage <= 3) {
        end = 4;
      }

      if (currentPage >= lastPage - 2) {
        start = lastPage - 3;
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < lastPage - 2) {
        pages.push("...");
      }

      pages.push(lastPage);
    }

    return pages;
  };

  if (lastPage <= 1) return null;

  const pages = getPageNumbers();

  return (
    <div className={`flex items-center justify-center space-x-2 mt-8 ${className}`}>
      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

     {pages.map((page, index) =>
  page === "..." ? (
    <span
      key={`ellipsis-${index}`}
      className="px-3 py-2 text-gray-400"
    >
      ...
    </span>
  ) : (
    <button
      key={`page-${page}`}
      onClick={() => onPageChange(page)}
      className={`min-w-[40px] h-10 rounded-md border ${
        currentPage === page
          ? "bg-[#0d6838] border-[#0d6838] text-white"
          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
      }`}
    >
      {page}
    </button>
  )
)}


      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === lastPage}
        className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Pagination;
