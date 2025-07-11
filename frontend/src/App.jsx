import React, { useState, useEffect } from "react";
import axios from "axios";
import TransactionTable from "./components/TransactionTable";
import Statistics from "./components/Statistics";
import BarChart from "./components/BarChart";
import PieChart from "./components/PieChart";
import "./App.css";

const App = () => {
  const [month, setMonth] = useState("March");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [transactions, setTransactions] = useState([]);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [statistics, setStatistics] = useState({});
  const [barChartData, setBarChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const transactionsRes = await axios.get(
          `http://localhost:4000/api/transactions?month=${month}&search=${search}&page=${page}&perPage=${perPage}`
        );

        console.log(" Fetched transactions:", `http://localhost:4000/api/transactions?month=${month}&search=${search}&page=${page}&perPage=${perPage} data:`, transactionsRes.data.transactions);

        setTransactions(transactionsRes.data.transactions);
        setTotalTransactions(transactionsRes.data.total);

        // Fetch combined chart/statistics separately (non-blocking)
        axios
          .get(`http://localhost:4000/api/combined?month=${month}`)
          .then((combinedRes) => {
            setStatistics(combinedRes.data.statistics);
            setBarChartData(combinedRes.data.barChart);
            setPieChartData(combinedRes.data.pieChart);
            console.log(" Combined data fetched.");
          })
          .catch((err) => {
            console.error(" Error fetching combined data:", err);
          });
      } catch (error) {
        console.error(" Error fetching transactions:", error);
      }
    };

    fetchData();
  }, [month, search, page, perPage]);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  return (
    <div className="container">
      <header className="header">
        <h1>Transaction Dashboard</h1>
        <div className="controls">
          <div className="control-group">
            <label>Select Month:</label>
            <select value={month} onChange={e => setMonth(e.target.value)}>
              {months.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="control-group">
            <label>Search:</label>
            <input
              type="text"
              placeholder="Search transactions"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </header>

      <main className="main-content">
        <section className="section table-section">
          <TransactionTable
            transactions={transactions}
            page={page}
            perPage={perPage}
            totalTransactions={totalTransactions}
            setPage={setPage}
            setPerPage={setPerPage}
          />
        </section>

        <section className="section stats-section">
          <Statistics statistics={statistics} month={month} />
        </section>

        <section className="section charts-section">
          <div className="chart-wrapper">
            <BarChart barChartData={barChartData} month={month} />
          </div>
          <div className="chart-wrapper">
            <PieChart pieChartData={pieChartData} month={month} />
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
