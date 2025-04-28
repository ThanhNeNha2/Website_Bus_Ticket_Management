import React from "react";
import ReactPaginate from "react-paginate";

const Pagination = ({ totalPages, handlePageClick }) => {
  return (
    <div>
      {/* Phân trang */}
      <ReactPaginate
        breakLabel="..."
        nextLabel=">"
        previousLabel="<"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        pageCount={totalPages}
        renderOnZeroPageCount={null}
        containerClassName="pagination flex justify-center space-x-2 mt-4"
        pageLinkClassName="px-3 py-1 border rounded hover:bg-blue-100"
        previousLinkClassName="px-3 py-1 border rounded hover:bg-blue-100"
        nextLinkClassName="px-3 py-1 border rounded hover:bg-blue-100"
        activeLinkClassName="bg-blue-500 text-white"
      />
    </div>
  );
};

export default Pagination;
