import React from "react";
import ReactPaginate from "react-paginate";
import styles from '../../assets/styles/Paginate.module.css'


function Paginate({pageCount, onPageChange}) {
  return (
    <>
      <ReactPaginate
        nextLabel="›"
        previousLabel="‹"
        breakLabel="..."
        pageCount={pageCount}
        marginPagesDisplayed={3}
        pageRangeDisplayed={3}
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
