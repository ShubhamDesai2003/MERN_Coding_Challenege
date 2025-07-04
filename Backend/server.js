require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const transactionRoutes = require('./routes/transactions');

const app = express();
const PORT = process.env.PORT || 4000;
const DB_URI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✔ MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api', transactionRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));