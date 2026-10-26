// server/routes/innovations.js
// Foodly Innovation Engine: Campus Batch Delivery, Nutrition Macros, FairPrice Audit, AI Mood Matcher & Group Ordering
const express = require('express');
const router = express.Router();
const db = require('../db');

// In-Memory Group Order Rooms Store
const groupRooms = new Map();

// Campus Drop Points for GL Bajaj & Knowledge Park III
const CAMPUS_DROP_ZONES = [
  {
    id: "glb-boys-hostel",
    name: "GL Bajaj Boys Hostel (Block A & B)",
    campus: "GL Bajaj Greater Noida",
    deliveryFee: 0,
    batchTime: "Next batch arrives in ~15 mins",
    savingsText: "Save ₹40 Delivery Fee",
    icon: "apartment"
  },
  {
    id: "glb-girls-hostel",
    name: "GL Bajaj Girls Hostel (Block D)",
    campus: "GL Bajaj Greater Noida",
    deliveryFee: 0,
    batchTime: "Next batch arrives in ~20 mins",
    savingsText: "Save ₹40 Delivery Fee",
    icon: "apartment"
  },
  {
    id: "glb-gate-2",
    name: "GL Bajaj Main Academic Block Gate 2",
    campus: "GL Bajaj Greater Noida",
    deliveryFee: 0,
    batchTime: "Express campus drop (~15 mins)",
    savingsText: "Save ₹40 Delivery Fee",
    icon: "school"
  },
  {
    id: "kp3-hostel-hub",
    name: "Knowledge Park III Student Housing Hub",
    campus: "Knowledge Park III",
    deliveryFee: 0,
    batchTime: "Batch moped pool (~25 mins)",
    savingsText: "Save ₹50 Delivery Fee",
    icon: "local_shipping"
  }
];

// Helper to calculate / generate nutrition data for an item
function getDishNutrition(item) {
  let calories = 320;
  let protein = 14;
  let carbs = 42;
  let fats = 10;
  let healthScore = "A";

  const name = item.name.toLowerCase();
  const desc = (item.description || "").toLowerCase();

  if (name.includes('salad') || desc.includes('quinoa') || desc.includes('sprouts')) {
    calories = 210; protein = 12; carbs = 28; fats = 5; healthScore = "A+";
  } else if (name.includes('protein') || name.includes('chicken') || name.includes('mutton') || name.includes('egg') || name.includes('tikka') || name.includes('kebab')) {
    calories = 460; protein = 34; carbs = 22; fats = 14; healthScore = "A";
  } else if (name.includes('paneer') || name.includes('dal') || name.includes('soya')) {
    calories = 390; protein = 24; carbs = 36; fats = 15; healthScore = "A";
  } else if (name.includes('pizza') || name.includes('burger') || name.includes('fries') || name.includes('nachos')) {
    calories = 580; protein = 18; carbs = 68; fats = 26; healthScore = "B";
  } else if (name.includes('biryani') || name.includes('rice') || name.includes('pulao')) {
    calories = 520; protein = 26; carbs = 65; fats = 16; healthScore = "B+";
  } else if (name.includes('shake') || name.includes('dessert') || name.includes('cake') || name.includes('ice cream')) {
    calories = 380; protein = 7; carbs = 58; fats = 18; healthScore = "C+";
  } else if (name.includes('coffee') || name.includes('tea') || name.includes('latte')) {
    calories = 140; protein = 5; carbs = 18; fats = 4; healthScore = "A";
  }

  return {
    calories,
    protein,
    carbs,
    fats,
    healthScore,
    isHighProtein: protein >= 25,
    isLowCalorie: calories <= 300
  };
}

// FairPrice calculation vs Swiggy/Zomato markups
function getFairPriceAudit(itemPrice) {
  const dineInPrice = Math.round(itemPrice);
  const foodlyPrice = Math.round(itemPrice); // We match dine-in!
  const inflatedPrice = Math.round(itemPrice * 1.25 + 15); // Swiggy/Zomato markup + hidden platform charge
  const savings = Math.max(0, inflatedPrice - foodlyPrice);

  return {
    dineInPrice,
    foodlyPrice,
    swiggyZomatoPrice: inflatedPrice,
    savings,
    surgeFee: 0,
    hasNoSurgeGuarantee: true
  };
}

// 1. GET /api/innovations/campus-zones - List GL Bajaj batch drop zones
router.get('/campus-zones', (req, res) => {
  res.json({ success: true, count: CAMPUS_DROP_ZONES.length, data: CAMPUS_DROP_ZONES });
});

// 2. GET /api/innovations/ai-mood-matcher - Mood & Craving recommendations
router.get('/ai-mood-matcher', (req, res) => {
  try {
    const { mood = 'late_night', budget } = req.query;
    const allRestaurants = db.getRestaurants({});
    let matchingDishes = [];

    allRestaurants.forEach(rest => {
      rest.menu.forEach(item => {
        const name = item.name.toLowerCase();
        const desc = (item.description || '').toLowerCase();
        const nutrition = getDishNutrition(item);
        const fairPrice = getFairPriceAudit(item.price);
        let match = false;
        let matchReason = "";

        if (mood === 'late_night') {
          // Late night study / coding snacks: quick meals, caffeine, pizzas, rolls, burgers
          if (name.includes('pizza') || name.includes('burger') || name.includes('roll') || name.includes('coffee') || name.includes('sandwich') || name.includes('wings') || name.includes('momos')) {
            match = true;
            matchReason = "Perfect focus fuel for late-night coding or study sessions";
          }
        } else if (mood === 'gym_protein') {
          // High protein for athletes / gym goers
          if (nutrition.protein >= 24 || name.includes('chicken') || name.includes('paneer') || name.includes('egg') || name.includes('tikka') || name.includes('kebab')) {
            match = true;
            matchReason = `Power Protein: ${nutrition.protein}g protein to hit daily gym macros`;
          }
        } else if (mood === 'student_budget') {
          // Broke college student under ₹199
          if (item.price <= 220) {
            match = true;
            matchReason = `Pocket-friendly feast at just ₹${item.price}`;
          }
        } else if (mood === 'comfort_cheat') {
          // Weekend comfort / cheat day
          if (name.includes('biryani') || name.includes('pizza') || name.includes('shake') || name.includes('burger') || name.includes('cake') || name.includes('butter chicken')) {
            match = true;
            matchReason = "Ultimate indulgence comfort food for stressful exam weeks";
          }
        } else if (mood === 'clean_green') {
          // Healthy clean greens
          if (item.veg && (nutrition.healthScore === 'A+' || nutrition.healthScore === 'A' || name.includes('salad') || name.includes('juice') || name.includes('south indian') || name.includes('idli') || name.includes('dosa'))) {
            match = true;
            matchReason = "Nutrient-dense clean meal with zero bloat";
          }
        }

        if (budget && item.price > parseFloat(budget)) {
          match = false;
        }

        if (match) {
          matchingDishes.push({
            dish: {
              ...item,
              nutrition,
              fairPrice
            },
            restaurant: {
              id: rest.id,
              name: rest.name,
              area: rest.area,
              rating: rest.rating,
              deliveryTime: rest.deliveryTime,
              heroImage: rest.heroImage
            },
            matchReason
          });
        }
      });
    });

    // Shuffle and pick top 12 curated matches
    matchingDishes = matchingDishes.sort(() => 0.5 - Math.random()).slice(0, 12);

    res.json({
      success: true,
      mood,
      count: matchingDishes.length,
      data: matchingDishes
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. POST /api/innovations/group-room/create - Create Group Order Room
router.post('/group-room/create', (req, res) => {
  try {
    const { hostName = "Host", restaurantId, restaurantName } = req.body;
    const roomCode = `GLB-${Math.floor(100 + Math.random() * 900)}`;

    const newRoom = {
      code: roomCode,
      createdAt: new Date().toISOString(),
      hostName,
      restaurantId: restaurantId || null,
      restaurantName: restaurantName || null,
      members: [hostName],
      items: [],
      status: "active"
    };

    groupRooms.set(roomCode, newRoom);
    res.status(201).json({ success: true, data: newRoom });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. GET /api/innovations/group-room/:code - Get Group Order Room with Bill Split
router.get('/group-room/:code', (req, res) => {
  const code = req.params.code.toUpperCase();
  const room = groupRooms.get(code);

  if (!room) {
    return res.status(404).json({ success: false, error: "Room not found or expired" });
  }

  // Calculate per-member bill split
  const memberSplits = {};
  let subtotal = 0;

  room.members.forEach(member => {
    memberSplits[member] = {
      items: [],
      subtotal: 0,
      taxShare: 0,
      totalShare: 0,
      upiPaymentLink: ""
    };
  });

  room.items.forEach(item => {
    const member = item.addedBy || room.hostName;
    if (!memberSplits[member]) {
      memberSplits[member] = { items: [], subtotal: 0, taxShare: 0, totalShare: 0, upiPaymentLink: "" };
    }
    const itemCost = item.price * (item.quantity || 1);
    subtotal += itemCost;
    memberSplits[member].subtotal += itemCost;
    memberSplits[member].items.push(item);
  });

  const taxes = Math.round(subtotal * 0.05);
  const deliveryFee = 0; // Campus batch drop is free!
  const grandTotal = subtotal + taxes + deliveryFee;

  // Distribute taxes proportionally
  Object.keys(memberSplits).forEach(member => {
    const shareRatio = subtotal > 0 ? (memberSplits[member].subtotal / subtotal) : 0;
    const taxShare = Math.round(taxes * shareRatio);
    const totalShare = memberSplits[member].subtotal + taxShare;
    memberSplits[member].taxShare = taxShare;
    memberSplits[member].totalShare = totalShare;
    memberSplits[member].upiPaymentLink = `upi://pay?pa=foodly.campus@upi&pn=FoodlyGLBajaj&am=${totalShare}&cu=INR&tn=GroupOrder_${code}_${encodeURIComponent(member)}`;
  });

  res.json({
    success: true,
    data: {
      ...room,
      subtotal,
      taxes,
      deliveryFee,
      grandTotal,
      memberSplits
    }
  });
});

// 5. POST /api/innovations/group-room/:code/join - Join an existing room
router.post('/group-room/:code/join', (req, res) => {
  const code = req.params.code.toUpperCase();
  const { memberName } = req.body;

  if (!memberName) return res.status(400).json({ success: false, error: "Member name is required" });

  const room = groupRooms.get(code);
  if (!room) return res.status(404).json({ success: false, error: "Room not found" });

  if (!room.members.includes(memberName)) {
    room.members.push(memberName);
  }

  res.json({ success: true, data: room });
});

// 6. POST /api/innovations/group-room/:code/item - Add item to room
router.post('/group-room/:code/item', (req, res) => {
  const code = req.params.code.toUpperCase();
  const { item, memberName } = req.body;

  const room = groupRooms.get(code);
  if (!room) return res.status(404).json({ success: false, error: "Room not found" });

  const existingItemIndex = room.items.findIndex(i => i.id === item.id && i.addedBy === memberName);
  if (existingItemIndex > -1) {
    room.items[existingItemIndex].quantity += 1;
  } else {
    room.items.push({
      ...item,
      quantity: 1,
      addedBy: memberName
    });
  }

  res.json({ success: true, data: room });
});

module.exports = {
  router,
  getDishNutrition,
  getFairPriceAudit,
  CAMPUS_DROP_ZONES
};
