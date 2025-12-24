import React from "react";

interface SortAndPaginationProps {
  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  itemsPerPage: number;
  setItemsPerPage: React.Dispatch<React.SetStateAction<number>>;
  currentPage: number;
  totalItems: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  sortOptions: { value: string; label: string }[];
  itemsPerPageOptions: number[];
  children: React.ReactNode; // To accept the GalleryGrid or any other content
}

const SortAndPagination: React.FC<SortAndPaginationProps> = ({
  sortBy,
  setSortBy,
  itemsPerPage,
  setItemsPerPage,
  currentPage,
  totalItems,
  totalPages,
  setCurrentPage,
  sortOptions,
  itemsPerPageOptions,
  children,
}) => {
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      {/* Sorting and Pagination Controls */}
      <div className="mb-6 flex justify-between items-center">
        <p className="text-gray-600">
          Showing {totalItems > 0 ? totalItems : 0} items
        </p>

        {/* Sort By Dropdown */}
        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setCurrentPage(1); // Reset to first page on sort change
          }}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Grid Content (Passed as children) */}
      {children}

      <div className="mt-6 flex justify-between items-center">
        {/* Items Per Page Dropdown */}
        <div className="flex items-center gap-4">
          <span className="text-gray-700">Items per page:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1); // Reset to first page on items per page change
            }}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {itemsPerPageOptions.map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <nav className="flex justify-center gap-2 mt-6">
            <button
              onClick={() => {
                handlePageChange(currentPage - 1);
              }}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
            >
              Previous
            </button>

            {/* Pagination numbers */}
            {(() => {
              const pages = [];
              const maxVisible = 5;

              if (totalPages <= maxVisible) {
                for (let i = 1; i <= totalPages; i++) {
                  pages.push(i);
                }
              } else {
                pages.push(1);

                let start = Math.max(2, currentPage - 1);
                let end = Math.min(totalPages - 1, currentPage + 1);

                if (currentPage <= 3) {
                  end = Math.min(totalPages - 1, 4);
                } else if (currentPage >= totalPages - 2) {
                  start = Math.max(2, totalPages - 3);
                }

                if (start > 2) {
                  pages.push("...");
                }

                for (let i = start; i <= end; i++) {
                  pages.push(i);
                }

                if (end < totalPages - 1) {
                  pages.push("...");
                }

                if (totalPages > 1) {
                  pages.push(totalPages);
                }
              }

              return pages.map((page, index) =>
                page === "..." ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-4 py-2 text-gray-500"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => {
                      handlePageChange(page as number);
                    }}
                    className={`px-4 py-2 border rounded-md transition ${
                      page === currentPage
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ),
              );
            })()}

            <button
              onClick={() => {
                handlePageChange(currentPage + 1);
              }}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
            >
              Next
            </button>
          </nav>
        )}
      </div>
    </div>
  );
};

export default SortAndPagination;
