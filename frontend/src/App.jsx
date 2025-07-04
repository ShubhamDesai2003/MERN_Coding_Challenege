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
  // const [perPage, setPerPage] = useState(5);
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
        setTransactions(transactionsRes.data.transactions);
        setTotalTransactions(transactionsRes.data.total);

        const combinedRes = await axios.get(
          `http://localhost:4000/api/combined?month=${month}`
        );
        setStatistics(combinedRes.data.statistics);
        setBarChartData(combinedRes.data.barChart);
        setPieChartData(combinedRes.data.pieChart);

        console.log("App.js: ", transactions);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [month, search, page, perPage]);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // const initializeDb = async () => {
  //   try {
  //     await axios.get("http://localhost:4000/api/initialize");
  //     alert("Database seeded!");
  //   } catch (err) {
  //     console.error("Init error", err);
  //     alert("Failed to initialize DB");
  //   }
  // };

  return (
    <div className="container">
      <h1>Transaction Dashboard</h1>
      <div className="controls">
        <label>Select Month: </label>
        <select value={month} onChange={(e) => setMonth(e.target.value)}>
          {months.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search transactions"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-box"
        />
      </div>

      {/* <div className="container">
        <h1>Transaction Dashboard</h1>
        <button onClick={initializeDb}>Seed Database</button>
      </div> */}

      <TransactionTable
        transactions={transactions}
        page={page}
        perPage={perPage}
        totalTransactions={totalTransactions}
        setPage={setPage}
        setPerPage={setPerPage}
      />

      <Statistics statistics={statistics} month={month} />

      <BarChart barChartData={barChartData} month={month} />

      <PieChart pieChartData={pieChartData} month={month} />
    </div>
  );
};

export default App;
