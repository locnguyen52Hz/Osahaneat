import React, { useState } from "react";
import styles from "../../../assets/styles/OrdersTable.module.css";
import Paginate from "../../../components/common/Paginate";
import OrderStatusIcon from "../../orders/components/OrderStatusIcon";
import { formatDateTime, formatCurrency } from "../../../util/format";

const TABLE_HEAD = [
  { label: "Order ID", key: "orderID" },
  { label: "Customer", key: "partnerName" },
  { label: "Address", key: "address" },
  { label: "Status", key: "status" },
  { label: "Time", key: "time" },
  { label: "Total", key: "totalAmount" },
  { label: "Quantity", key: "totalQuantity" },
  { label: "Action", key: "" },
];

function OrdersTable({
  tableSize,
  pageCount = 0,
  onPageChange,
  data,
  onChangeTableSize,
  currentPage,
  totalElement,
  handleSort,
  sortType,
  search,
  handleSearch,
}) {
  const start = totalElement === 0 ? 0 : currentPage * tableSize + 1;
  const end = Math.min((currentPage + 1) * tableSize, totalElement);
  console.log(data);
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <i className="bi bi-table"></i>
        <p>RECENT {tableSize} ORDER</p>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.table}>
          <div className="tableWrapper">
            <div className={`${styles.row} ${styles.tableControl}`}>
              {/*================TABLE LENGTH ================ */}
              <div className={styles.column}>
                <div className={styles.tableLength} id="tableLength">
                  <label>
                    <p>Show</p>
                    <select
                      name="tableLength"
                      className={styles.formControl}
                      onChange={(e) =>
                        onChangeTableSize(Number(e.target.value))
                      }
                    >
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="30">30</option>
                      <option value="40">40</option>
                    </select>
                    <p>entries</p>
                  </label>
                </div>
              </div>
              {/*================TABLE SEARCH ================ */}
              <div className={styles.column}>
                <div className={styles.tableFilter}>
                  <label className={styles.table}>
                    <p>Search:</p>
                    <input
                      type="text"
                      name=""
                      id=""
                      className={styles.formControl}
                      value={search}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </label>
                </div>
              </div>
            </div>
            <table className={styles.tableBody}>
              <thead>
                <tr>
                  {TABLE_HEAD.map((item, i) => (
                    <th key={item.key} onClick={() => handleSort(item.key, i)}>
                      <div className={styles.thCell}>
                        {item.label}
                        <div>
                          {sortType.index !== i && (
                            <i className="bi bi-filter"></i>
                          )}
                          {sortType.index === i && sortType.type === "ASC" && (
                            <i
                              className={`bi bi-sort-up-alt ${
                                sortType.index === i && sortType.type === "ASC"
                                  ? styles.sortIcon
                                  : ""
                              }`}
                            ></i>
                          )}

                          {sortType.index === i && sortType.type === "DESC" && (
                            <i
                              className={`bi bi-sort-down ${
                                sortType.index === i && sortType.type === "DESC"
                                  ? styles.sortIcon
                                  : ""
                              }`}
                            ></i>
                          )}
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={TABLE_HEAD.length}
                      style={{ textAlign: "center" }}
                    >
                      No matching records found
                    </td>
                  </tr>
                ) : (
                  data.map((item, index) => (
                    <tr className={styles.tRow} key={index}>
                      <td>{item.orderID}</td>
                      <td>{item.partnerName}</td>
                      <td>{item.address}</td>
                      <td>
                        <OrderStatusIcon status={item.status.toUpperCase()} />
                      </td>
                      <td>{formatDateTime(item.time)}</td>
                      <td>{formatCurrency(item.totalAmount)}</td>
                      <td>{item.totalQuantity}</td>
                      <td>View</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className={styles.row}>
              <div className={styles.tableFooter}>
                {data.length > 0 && (
                  <>
                    <p>
                      Showing {start} to {end} of {tableSize} entries
                    </p>

                    <Paginate
                      forcePage={currentPage}
                      onPageChange={onPageChange}
                      pageCount={pageCount}
                      pageRangeDisplayed={0}
                      marginPagesDisplayed={0}
                      breakLabel={null}
                      nextLabel="Next"
                      previousLabel="Previous"
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrdersTable;
