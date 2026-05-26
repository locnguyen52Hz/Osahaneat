import React from "react";
import ReactPaginate from "react-paginate";
import styles from "../../assets/styles/Paginate.module.css";

function Paginate({
  pageCount,
  onPageChange,
  pageRangeDisplayed = 0,
  marginPagesDisplayed = 3,
  breakLabel = "...",
  nextLabel = ">",
  previousLabel = "<",
  forcePage,
}) {

  return (
    <>
      <ReactPaginate
        nextLabel={nextLabel}
        forcePage={forcePage}
        previousLabel={previousLabel}
        breakLabel={breakLabel}
        pageCount={pageCount}
        marginPagesDisplayed={marginPagesDisplayed}
        pageRangeDisplayed={pageRangeDisplayed}
        onPageChange={onPageChange}
        containerClassName={styles.paginateContainer}
        pageClassName={styles.pageItem}
        pageLinkClassName={styles.pageLink}
        previousClassName={styles.pageItem}
        previousLinkClassName={styles.pageLink}
        nextClassName={styles.pageItem}
        nextLinkClassName={styles.pageLink}
        breakClassName={styles.pageItem}
        breakLinkClassName={styles.pageLink}
        activeClassName={styles.activePage}
        disabledClassName={styles.disable}
        renderOnZeroPageCount={null}
      />
    </>
  );
}

export default Paginate;
