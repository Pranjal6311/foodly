// server/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');

const restaurantRoutes = require('./routes/restaurants');
const orderRoutes = require('./routes/orders');
const { router: innovationRoutes } = require('./routes/innovations');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/innovations', innovationRoutes);

// Static files (frontend SPA)
app.use(express.static(path.join(__dirname, '../public')));

// Fallback to index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`Foodly Server running at http://localhost:${PORT}`);
});
