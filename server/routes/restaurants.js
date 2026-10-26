const express = require('express');
const router = express.Router();
const db = require('../db');
const { getDishNutrition, getFairPriceAudit } = require('./innovations');

// GET /api/restaurants - list with filtering & search
router.get('/', (req, res) => {
  try {
    const { q, cuisine, price, rating, dietary, sortBy, lat, lng, type } = req.query;
    const results = db.getRestaurants({ q, cuisine, price, rating, dietary, sortBy, lat, lng, type });
    const enriched = results.map(r => ({
      ...r,
      menu: (r.menu || []).map(item => ({
        ...item,
        nutrition: getDishNutrition(item),
        fairPrice: getFairPriceAudit(item.price)
      }))
    }));
    res.json({ success: true, count: enriched.length, data: enriched });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/restaurants/:id - get restaurant detail and menu
router.get('/:id', (req, res) => {
  try {
    const { lat, lng } = req.query;
    const restaurant = db.getRestaurantById(req.params.id, { lat, lng });
    if (!restaurant) {
      return res.status(404).json({ success: false, error: 'Restaurant not found' });
    }
    const enrichedMenu = (restaurant.menu || []).map(item => ({
      ...item,
      nutrition: getDishNutrition(item),
      fairPrice: getFairPriceAudit(item.price)
    }));
    res.json({ success: true, data: { ...restaurant, menu: enrichedMenu } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/categories - get all cuisine categories
router.get('/meta/categories', (req, res) => {
  res.json({ success: true, data: db.getCategories() });
});

// GET /api/coupons - get active coupons
router.get('/meta/coupons', (req, res) => {
  res.json({ success: true, data: db.getCoupons() });
});

module.exports = router;
