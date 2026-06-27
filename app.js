const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/products');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Backend is fully operational' });
});

app.use('/products', productRoutes);

module.exports = app;
