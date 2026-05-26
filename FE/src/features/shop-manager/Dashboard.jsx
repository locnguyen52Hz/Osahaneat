import React, { useEffect, useMemo, useState } from "react";
import ShopCard from "../shops/ShopCard";
import { apiGet } from "../../api/api";
import endpoints from "../../api/endpoints";
import ShopDetail from "../shops/ShopDetail";
import DashboardSummary from "../../components/DashboardSummary";
import styles from "../../assets/styles/Dashboard.module.css";
import CustomChart from "../../components/CustomChart";
import {
  getDaysFromStartOfMonthToTodayUTC,
  getMonthsFromStartOfYearToNowUTC,
  getStartOfMonthUTC,
  getStartOfYearUTC,
} from "../../util/DateTime";
import { data } from "react-router-dom";
import OrdersTable from "../orders/components/OrdersTable";
import { formatCurrency, formatDateTime } from "../../util/format";

const EARNINGS_THIS_MONTH = [
  { data: [12, 19, 3, 5, 2, 3], backgroundColor: "#0175d8" },
];

function Dashboard() {
  const [monthlyRevenue, setMonthlyRevenue] = useState({
    labels: [],
    data: [],
  });
  const [dailyRevenue, setDailyRevenue] = useState({
    labels: [],
    data: [],
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [tableSize, setTableSize] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalElement, setTotalElement] = useState(0);
  const [sortType, setSortType] = useState({
    key: null,
    type: "ASC",
    index: null,
  });

  useEffect(() => {
    const startDate = getStartOfMonthUTC();
    const startMonth = getStartOfYearUTC();
    const fetchRevenue = async () => {
      try {
        const [dailyRevenueRes, monthlyRevenueRes] = await Promise.all([
          apiGet(`${endpoints.chart.dailyRevenue}?startDate=${startDate}`),
          apiGet(`${endpoints.chart.monthlyRevenue}?startMonth=${startMonth}`),
        ]);

        const days = dailyRevenueRes.data.data.labels.map((d) =>
          new Date(d + "T00:00:00Z").toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            timeZone: "UTC",
          }),
        );

        const months = monthlyRevenueRes.data.data.labels.map((m) =>
          new Date(m + "T00:00:00Z").toLocaleDateString("en-US", {
            month: "short",
            timeZone: "UTC",
          }),
        );

        setDailyRevenue({
          ...dailyRevenueRes.data.data,
          labels: days,
          borderColor: "#057adb",
          backgroundColor: "#cce2f7",
          borderWidth: 2,
        });

        setMonthlyRevenue({
          ...monthlyRevenueRes.data.data,
          labels: months,
          borderColor: "#057adb",
          backgroundColor: "#0175d8",
          borderWidth: 2,
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchRevenue();
  }, []);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const ordersRes = await apiGet(
          `${endpoints.order.get_orders}/all?page=${currentPage}&pageSize=${tableSize}&includeTotalQuantity=true`,
        );
        const { list, page, size, totalElement, totalPages } =
          ordersRes.data.data;

        setTableSize(size);
        setTotalElement(totalElement);
        setRecentOrders(list);
        setTotalPage(totalPages);
        setCurrentPage(page);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRecentOrders();
  }, [currentPage, tableSize]);

  const handleOnchangePage = (newPage) => {
    setCurrentPage(newPage.selected);
  };
  const handleOnchangeTableSize = (size) => {
    setTableSize(size);
  };

  const handleSort = (key, index) => {
    if (!key) return;
    let type = "ASC";

    if (sortType.key === key && sortType.type === "ASC") {
      type = "DESC";
    }

    setSortType({ key, type, index });
  };

  const displayedData = useMemo(() => {
    let result = [...recentOrders];

    //search
    if (search.trim()) {
      const keyword = search.toLowerCase();

      result = result.filter((item) => {
        for (const [key, field] of Object.entries(item)) {
          if (field === null || field === undefined) continue;

          let text = "";

          // cho time
          if (key === "time") {
            text = formatDateTime(field).toLowerCase();
          } else {
            text = field.toString().toLowerCase();
          }

          if (text.includes(keyword)) {
            return true;
          }
        }

        return false;
      });
    }

    // sort
    if (sortType.key) {
      result.sort((a, b) => {
        let valueA = a[sortType.key];
        let valueB = b[sortType.key];

        // date
        if (sortType.key === "time") {
          valueA = new Date(valueA).getTime();
          valueB = new Date(valueB).getTime();
        }

        // string
        if (typeof valueA === "string") {
          return sortType.type === "ASC"
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        }

        // number
        return sortType.type === "ASC" ? valueA - valueB : valueB - valueA;
      });
    }

    return result;
  }, [recentOrders, search, sortType]);

  return (
    <>
      <div className="container">
        <h1 className={styles.title}>Dashboard</h1>
        <div className={styles.row}>
          <DashboardSummary
            title="New messages"
            count={26}
            backGroupColor1="rgb(23, 58, 197)"
            backGroupColor2="rgb(40 80 255)"
          />
          <DashboardSummary
            title="New messages"
            count={26}
            backGroupColor1="rgb(229 144 6)"
            backGroupColor2="rgb(252 227 7)"
          />
        </div>

        <div className={styles.row}>
          <div className={styles.column}>
            <CustomChart
              type="line"
              title="Sales earnings this month"
              datasets={[dailyRevenue]}
              label={false}
              xAxis={dailyRevenue.labels}
              icon={<i className="bi bi-graph-up"></i>}
              valueFormatter={formatCurrency}
            />
          </div>

          <div className={styles.column}>
            <CustomChart
              type="bar"
              title="All Time Earnings"
              datasets={[monthlyRevenue]}
              xAxis={monthlyRevenue.labels}
              label={false}
              icon={<i className="bi bi-bar-chart-line-fill"></i>}
              valueFormatter={formatCurrency}
            />
          </div>
        </div>
        <OrdersTable
          tableSize={tableSize}
          pageCount={totalPage}
          data={displayedData}
          onPageChange={handleOnchangePage}
          onChangeTableSize={handleOnchangeTableSize}
          currentPage={currentPage}
          totalElement={totalElement}
          handleSort={handleSort}
          sortType={sortType}
          search={search}
          handleSearch={setSearch}
        />
      </div>
      {/* <ShopDetail/> */}
    </>
  );
}

export default Dashboard;
