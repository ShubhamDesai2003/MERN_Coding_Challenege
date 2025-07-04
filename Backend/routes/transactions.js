const express = require('express');
const axios = require('axios');
const Transaction = require('../models/Transaction');

const router = express.Router();

const MONTHS = {
  January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
  July: 7, August: 8, September: 9, October: 10, November: 11, December: 12
};

function getMonthNumber(month) {
  return MONTHS[month];
}


router.get('/initialize', async (req, res) => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const data = response.data;

    const transformed = data.map(item => ({
      id: item.id,
      title: item.title, // or item.product_title if needed
      description: item.description, // or item.product_description
      price: item.price,
      category: item.category,
      sold: item.sold,
      image: item.image,
      dateOfSale: new Date(item.dateOfSale)
    }));

    await Transaction.deleteMany({});
    await Transaction.insertMany(transformed);

    res.send('Database initialized successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error initializing database');
  }
});


router.get('/transactions', async (req, res) => {
  const { month, search = '', page = 1, perPage = 10 } = req.query;
  const monthNumber = getMonthNumber(month);
  const trimmedSearch = search.trim();

  const monthFilter = { 
    $expr: { $eq: [ { $month: "$dateOfSale" }, monthNumber ] } 
  };

  let query = monthFilter;

  if (trimmedSearch) {
    const regex = new RegExp(trimmedSearch, 'i');
    const or = [
      { title:      { $regex: regex } },
      { description:{ $regex: regex } },
      { category:   { $regex: regex } } // include category
    ];
    if (!isNaN(Number(trimmedSearch))) {
      or.push({ price: Number(trimmedSearch) });
    }
    query = { $and: [ monthFilter, { $or: or } ] };
  }

  console.dir(query, { depth: null });

  const transactions = await Transaction.find(query)
    .skip((page - 1) * perPage)
    .limit(parseInt(perPage));
  const total = await Transaction.countDocuments(query);

  res.json({ transactions, total, page: +page, perPage: +perPage });
});



// Statistics
router.get('/statistics', async (req, res) => {
  const { month } = req.query;
  const monthNumber = getMonthNumber(month);

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
  const monthNumber = getMonthNumber(month);
  const ranges = [
    { min: 0, max: 100 }, { min: 101, max: 200 }, { min: 201, max: 300 },
    { min: 301, max: 400 }, { min: 401, max: 500 }, { min: 501, max: 600 },
    { min: 601, max: 700 }, { min: 701, max: 800 }, { min: 801, max: 900 },
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
  const monthNumber = getMonthNumber(month);

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
  try {
    const { month } = req.query;
    const monthNumber = getMonthNumber(month);

    const baseMatch = { $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] } };

    const [totalSaleAgg, totalSold, totalUnsold] = await Promise.all([
      Transaction.aggregate([
        { $match: { ...baseMatch, sold: true } },
        { $group: { _id: null, total: { $sum: "$price" } } },
      ]),
      Transaction.countDocuments({ ...baseMatch, sold: true }),
      Transaction.countDocuments({ ...baseMatch, sold: false }),
    ]);

    const stats = {
      totalSaleAmount: totalSaleAgg[0]?.total || 0,
      totalSoldItems: totalSold,
      totalNotSoldItems: totalUnsold,
    };

    const ranges = [
      { min: 0, max: 100 }, { min: 101, max: 200 }, { min: 201, max: 300 },
      { min: 301, max: 400 }, { min: 401, max: 500 }, { min: 501, max: 600 },
      { min: 601, max: 700 }, { min: 701, max: 800 }, { min: 801, max: 900 },
      { min: 901, max: Infinity }
    ];

    const barChart = await Promise.all(
      ranges.map(async (range) => {
        const count = await Transaction.countDocuments({
          ...baseMatch,
          price: {
            $gte: range.min,
            $lte: range.max === Infinity ? Number.MAX_SAFE_INTEGER : range.max,
          },
        });
        return {
          range: `${range.min}-${range.max === Infinity ? 'above' : range.max}`,
          count,
        };
      })
    );

    const pieChartRaw = await Transaction.aggregate([
      { $match: baseMatch },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    const pieChart = pieChartRaw.map(item => ({
      category: item._id,
      count: item.count
    }));

    res.json({ statistics: stats, barChart, pieChart });

  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching combined data');
  }
});


module.exports = router;
