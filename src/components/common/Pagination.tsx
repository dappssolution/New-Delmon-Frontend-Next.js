import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    lastPage: number;
    onPageChange: (page: number) => void;
    className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    lastPage,
    onPageChange,
    className = '',
}) => {
    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (lastPage <= maxVisiblePages) {
            for (let i = 1; i <= lastPage; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            if (currentPage > 3) {
                pages.push('...');
            }

            // Calculate start and end of visible range around current page
            let start = Math.max(2, currentPage - 1);
            let end = Math.min(lastPage - 1, currentPage + 1);

            // Adjust if near the beginning
            if (currentPage <= 3) {
                end = Math.min(lastPage - 1, 4);
            }

            // Adjust if near the end
            if (currentPage >= lastPage - 2) {
                start = Math.max(2, lastPage - 3);
            }

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < lastPage - 2) {
                pages.push('...');
            }

            // Always show last page
            pages.push(lastPage);
        }

        return pages;
    };

    const pages = getPageNumbers();

    if (lastPage <= 1) return null;

    return (
        <div className={`flex items-center justify-center space-x-2 mt-8 ${className}`}>
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous Page"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            {pages.map((page, index) => (
                <React.Fragment key={index}>
                    {page === '...' ? (
                        <span className="px-3 py-2 text-gray-400">...</span>
                    ) : (
                        <button
                            onClick={() => onPageChange(Number(page))}
                            className={`min-w-[40px] h-10 px-3 py-2 rounded-md border transition-colors ${currentPage === page
                                    ? 'bg-[#0d6838] border-[#0d6838] text-white'
                                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            {page}
                        </button>
                    )}
                </React.Fragment>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === lastPage}
                className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Next Page"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
};

export default Pagination;
