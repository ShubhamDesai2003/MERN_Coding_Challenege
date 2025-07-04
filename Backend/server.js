const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const transactionRoutes = require('./transactions');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mern-challenge', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api', transactionRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});