// server/routes/orders.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/orders - list user orders
router.get('/', (req, res) => {
  try {
    const orders = db.getOrders();
    res.json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/orders/:id - get single order
router.get('/:id', (req, res) => {
  try {
    const order = db.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/orders - place new order
router.post('/', (req, res) => {
  try {
    const { restaurantId, restaurantName, items, bill, deliveryAddress, paymentMethod } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Cart is empty' });
    }

    const newOrder = db.createOrder({
      restaurantId,
      restaurantName,
      items,
      bill,
      deliveryAddress,
      paymentMethod
    });

    res.status(201).json({ success: true, data: newOrder });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/orders/:id/live-tracking (SSE for live driver movement and status updates)
router.get('/:id/live-tracking', (req, res) => {
  const orderId = req.params.id;
  const order = db.getOrderById(orderId);

  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Send initial tracking state
  let progressPercent = order.status === 'delivered' ? 100 : (order.status === 'out_for_delivery' ? 65 : 25);
  let stage = order.status;

  const sendEvent = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  sendEvent({
    type: 'INIT',
    orderId,
    status: order.status,
    statusText: order.statusText,
    estimatedMinutes: 12,
    driver: order.driver,
    progressPercent
  });

  // Simulated timer to incrementally update driver position and progress
  const interval = setInterval(() => {
    if (stage === 'placed') {
      stage = 'confirmed';
      db.updateOrderStatus(orderId, stage, 'Spice Symphony has confirmed your order');
      sendEvent({ type: 'STATUS_UPDATE', status: stage, statusText: 'Order confirmed by restaurant', progressPercent: 20 });
    } else if (stage === 'confirmed') {
      stage = 'preparing';
      db.updateOrderStatus(orderId, stage, 'Kitchen is preparing your food with care');
      sendEvent({ type: 'STATUS_UPDATE', status: stage, statusText: 'Food is being freshly prepared', progressPercent: 45 });
    } else if (stage === 'preparing') {
      stage = 'out_for_delivery';
      db.updateOrderStatus(orderId, stage, `${order.driver.name} is on the way on their bike`);
      sendEvent({ type: 'STATUS_UPDATE', status: stage, statusText: `${order.driver.name} has picked up your order`, progressPercent: 65 });
    } else if (stage === 'out_for_delivery') {
      progressPercent += 5;
      if (progressPercent >= 100) {
        stage = 'delivered';
        db.updateOrderStatus(orderId, stage, 'Order has been delivered. Enjoy your meal!');
        sendEvent({ type: 'DELIVERED', status: stage, statusText: 'Order delivered safely at your door!', progressPercent: 100 });
        clearInterval(interval);
      } else {
        const remainingMin = Math.max(1, Math.round((100 - progressPercent) * 0.25));
        sendEvent({
          type: 'DRIVER_MOVE',
          progressPercent,
          remainingMinutes: remainingMin,
          driverEtaText: `${order.driver.name.split(' ')[0]} is ${remainingMin} mins away`,
          // Interpolated coordinate offset along the route
          driverX: 50 + ((65 - 50) * (progressPercent - 65) / 35),
          driverY: 50 - ((50 - 40) * (progressPercent - 65) / 35)
        });
      }
    }
  }, 4000);

  req.on('close', () => {
    clearInterval(interval);
    res.end();
  });
});

module.exports = router;
