const express = require('express');
const axios = require('axios');
const Transaction = require('../../models/transaction');

const router = express.Router();

// Initialize Database
router.get('/initialize', async (req, res) => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const data = response.data;
    await Transaction.deleteMany({});
    await Transaction.insertMany(data);
    res.send('Database initialized successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error initializing database');
  }
});

// List Transactions
router.get('/transactions', async (req, res) => {
  const { month, search = '', page = 1, perPage = 10 } = req.query;
  const monthNumber = new Date(Date.parse(month + " 1, 2000")).getMonth() + 1;

  const query = {
    $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] },
  };

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { price: { $regex: search, $options: 'i' } },
    ];
  }

  try {
    const transactions = await Transaction.find(query)
      .skip((page - 1) * perPage)
      .limit(parseInt(perPage));
    const total = await Transaction.countDocuments(query);
    res.json({ transactions, total, page: parseInt(page), perPage: parseInt(perPage) });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching transactions');
  }
});

// Statistics
router.get('/statistics', async (req, res) => {
  const { month } = req.query;
  const monthNumber = new Date(Date.parse(month + " 1, 2000")).getMonth() + 1;

  try {
    const totalSaleAmount = await Transaction.aggregate([
      { $match: { $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] }, sold: true } },
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]);

    const totalSoldItems = await Transaction.countDocuments({
      $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] },
      sold: true,
    });

    const totalNotSoldItems = await Transaction.countDocuments({
      $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] },
      sold: false,
    });

    res.json({
      totalSaleAmount: totalSaleAmount[0]?.total || 0,
      totalSoldItems,
      totalNotSoldItems,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching statistics');
  }
});

// Bar Chart
router.get('/bar-chart', async (req, res) => {
  const { month } = req.query;
  const monthNumber = new Date(Date.parse(month + " 1, 2000")).getMonth() + 1;
  const ranges = [
    { min: 0, max: 100 },
    { min: 101, max: 200 },
    { min: 201, max: 300 },
    { min: 301, max: 400 },
    { min: 401, max: 500 },
    { min: 501, max: 600 },
    { min: 601, max: 700 },
    { min: 701, max: 800 },
    { min: 801, max: 900 },
    { min: 901, max: Infinity },
  ];

  try {
    const barData = await Promise.all(
      ranges.map(async (range) => {
        const count = await Transaction.countDocuments({
          $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] },
          price: {
            $gte: range.min,
            $lte: range.max === Infinity ? Number.MAX_SAFE_INTEGER : range.max,
          },
        });
        return { range: `${range.min}-${range.max === Infinity ? 'above' : range.max}`, count };
      })
    );
    res.json(barData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching bar chart data');
  }
});

// Pie Chart
router.get('/pie-chart', async (req, res) => {
  const { month } = req.query;
  const monthNumber = new Date(Date.parse(month + " 1, 2000")).getMonth() + 1;

  try {
    const pieData = await Transaction.aggregate([
      { $match: { $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] } } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);
    res.json(pieData.map((item) => ({ category: item._id, count: item.count })));
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching pie chart data');
  }
});

// Combined API
router.get('/combined', async (req, res) => {
  const { month } = req.query;
  try {
    const [statistics, barChart, pieChart] = await Promise.all([
      axios.get(`http://localhost:3000/api/statistics?month=${month}`),
      axios.get(`http://localhost:3000/api/bar-chart?month=${month}`),
      axios.get(`http://localhost:3000/api/pie-chart?month=${month}`),
    ]);
    res.json({
      statistics: statistics.data,
      barChart: barChart.data,
      pieChart: pieChart.data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching combined data');
  }
});

module.exports = router;