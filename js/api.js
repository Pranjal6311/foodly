// public/js/api.js - Frontend API Service Client with GitHub Pages Fallback
(function () {
  const API_BASE = '/api';
  let staticDataPromise = null;

  async function getStaticData() {
    if (!staticDataPromise) {
      staticDataPromise = fetch('./data.json')
        .then(r => r.ok ? r.json() : null)
        .catch(() => null);
    }
    return await staticDataPromise;
  }

  function getSafeStorage(key) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch (e) {}
    return null;
  }

  function setSafeStorage(key, val) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, val);
      }
    } catch (e) {}
  }

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

  const api = {
    async getRestaurants(filters = {}) {
      try {
        const params = new URLSearchParams();
        if (filters.q) params.set('q', filters.q);
        if (filters.cuisine) params.set('cuisine', filters.cuisine);
        if (filters.price) params.set('price', filters.price);
        if (filters.rating) params.set('rating', filters.rating);
        if (filters.dietary) params.set('dietary', filters.dietary);
        if (filters.sortBy) params.set('sortBy', filters.sortBy);
        if (filters.type) params.set('type', filters.type);

        const coords = window.foodlyStore && window.foodlyStore.userCoords;
        if (coords && coords.lat && coords.lng) {
          params.set('lat', coords.lat);
          params.set('lng', coords.lng);
        }

        const url = `${API_BASE}/restaurants?${params.toString()}`;
        const res = await fetch(url);
        if (res.ok) return await res.json();
      } catch (e) {
        // Fall back to static data for GitHub Pages
      }

      // Static fallback
      const data = await getStaticData();
      if (!data || !data.restaurants) return { success: true, count: 0, data: [] };

      let list = [...data.restaurants];
      if (filters.q) {
        const q = filters.q.toLowerCase().trim();
        list = list.filter(r => {
          const matchName = r.name.toLowerCase().includes(q);
          const matchCuisines = (r.cuisines || []).some(c => c.toLowerCase().includes(q));
          const matchArea = (r.area || '').toLowerCase().includes(q);
          const matchType = (r.type || '').toLowerCase().includes(q);
          const matchHeadline = (r.headline || '').toLowerCase().includes(q);
          const matchMenu = (r.menu || []).some(m => m.name.toLowerCase().includes(q) || (m.description || '').toLowerCase().includes(q) || (m.category || '').toLowerCase().includes(q));
          const matchCafe = (q.includes('cafe') || q.includes('coffee')) && (r.isCafe || r.type === 'cafe' || (r.cuisines || []).some(c => c.toLowerCase().includes('cafe')));
          const matchHotel = (q.includes('hotel') || q.includes('stay') || q.includes('lounge')) && (r.name.toLowerCase().includes('hotel') || (r.cuisines || []).some(c => c.toLowerCase().includes('hotel')));
          const matchRestro = (q.includes('restro') || q.includes('resta')) && (r.type === 'restaurant' || (r.cuisines || []).some(c => c.toLowerCase().includes('restro')));

          return matchName || matchCuisines || matchArea || matchType || matchHeadline || matchMenu || matchCafe || matchHotel || matchRestro;
        });
      }

      if (filters.cuisine) {
        const c = filters.cuisine.toLowerCase().trim();
        list = list.filter(r => {
          if (c === 'cafe' || c === 'cafes & coffee' || c === 'coffee') {
            return r.isCafe || r.type === 'cafe' || (r.cuisines || []).some(x => x.toLowerCase().includes('cafe'));
          }
          if (c === 'hotel' || c === 'hotel kitchens' || c === 'hotel dining') {
            return (r.cuisines || []).some(x => x.toLowerCase().includes('hotel')) || r.name.toLowerCase().includes('hotel');
          }
          if (c === 'restro' || c === 'restaurant' || c === 'restros & dining') {
            return r.type === 'restaurant' || (r.cuisines || []).some(x => x.toLowerCase().includes('restro'));
          }
          if (c === 'vrat-special' || c === 'navratri vrat special' || c === 'satvik') {
            return (r.cuisines || []).some(x => x.toLowerCase().includes('vrat') || x.toLowerCase().includes('satvik'));
          }
          if (c === 'south-indian' || c === 'south indian') {
            return (r.cuisines || []).some(x => x.toLowerCase().includes('south indian') || x.toLowerCase().includes('dosa'));
          }
          if (c === 'north-indian' || c === 'north indian') {
            return (r.cuisines || []).some(x => x.toLowerCase().includes('north indian') || x.toLowerCase().includes('thali'));
          }
          if (c === 'street-food' || c === 'food-cart' || c === 'cart') {
            return r.type === 'food-cart' || (r.cuisines || []).some(x => x.toLowerCase().includes('street') || x.toLowerCase().includes('cart') || x.toLowerCase().includes('chaat'));
          }
          return (r.cuisines || []).some(item => item.toLowerCase().includes(c));
        });
      }

      if (filters.dietary) {
        const d = filters.dietary.toLowerCase();
        if (d === 'satvik') {
          list = list.filter(r => (r.dietary || []).some(flag => flag.toLowerCase().includes('satvik')) || (r.cuisines || []).some(c => c.toLowerCase().includes('satvik') || c.toLowerCase().includes('vrat')));
        } else if (d === 'vegetarian' || d === 'veg') {
          list = list.filter(r => (r.dietary || []).some(flag => flag.toLowerCase().includes('veg')) || (r.menu || []).some(m => m.veg === true));
        }
      }

      if (filters.rating) {
        const minRating = parseFloat(filters.rating);
        if (!isNaN(minRating)) {
          list = list.filter(r => (r.rating || 0) >= minRating);
        }
      }

      if (filters.sortBy === 'rating') {
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      } else if (filters.sortBy === 'deliveryTime') {
        list.sort((a, b) => parseInt(a.deliveryTime || '99') - parseInt(b.deliveryTime || '99'));
      }

      return { success: true, count: list.length, data: list };
    },

    async getRestaurant(id) {
      try {
        const url = `${API_BASE}/restaurants/${encodeURIComponent(id)}`;
        const res = await fetch(url);
        if (res.ok) return await res.json();
      } catch (e) {}

      // Static fallback
      const data = await getStaticData();
      if (data && data.restaurants) {
        // Direct ID match
        let found = data.restaurants.find(r => r.id === id);
        
        // Smart fuzzy / normalized match (e.g. 'gl-bajaj-central-cafeteria' -> 'gl-bajaj-cafeteria')
        if (!found) {
          const normTarget = (id || '').toLowerCase().replace(/[^a-z0-9]/g, '');
          found = data.restaurants.find(r => {
            const normId = r.id.toLowerCase().replace(/[^a-z0-9]/g, '');
            const normName = r.name.toLowerCase().replace(/[^a-z0-9]/g, '');
            return normId === normTarget || normName.includes(normTarget) || normTarget.includes(normId);
          });
        }

        if (found) {
          // Guarantee menuCategories is an array
          if (!found.menuCategories || found.menuCategories.length === 0) {
            found.menuCategories = [...new Set((found.menu || []).map(m => m.category).filter(Boolean))];
          }
          return { success: true, data: found };
        }
      }
      throw new Error('Restaurant not found');
    },

    async getCategories() {
      try {
        const res = await fetch(`${API_BASE}/restaurants/meta/categories`);
        if (res.ok) return await res.json();
      } catch (e) {}

      const data = await getStaticData();
      return { success: true, data: (data && data.categories) || [] };
    },

    async getCoupons() {
      try {
        const res = await fetch(`${API_BASE}/restaurants/meta/coupons`);
        if (res.ok) return await res.json();
      } catch (e) {}

      const data = await getStaticData();
      return { success: true, data: (data && data.coupons) || [] };
    },

    async getOrders() {
      try {
        const res = await fetch(`${API_BASE}/orders`);
        if (res.ok) return await res.json();
      } catch (e) {}

      const saved = localStorage.getItem('foodly_orders_history');
      return { success: true, count: 0, data: saved ? JSON.parse(saved) : [] };
    },

    async getOrder(id) {
      try {
        const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(id)}`);
        if (res.ok) {
          const json = await res.json();
          if (json && json.data) return json;
        }
      } catch (e) {}

      const saved = localStorage.getItem('foodly_orders_history');
      const orders = saved ? JSON.parse(saved) : [];
      let found = orders.find(o => o.id === id);
      if (!found && orders.length > 0) {
        found = orders[0];
      }
      if (!found) {
        found = {
          id: id || "FD-9204",
          createdAt: new Date().toISOString(),
          status: "out_for_delivery",
          restaurantName: "GL Bajaj Central Cafeteria",
          restaurantId: "gl-bajaj-cafeteria",
          deliveryAddress: "GL Bajaj Boys Hostel (Block A & B), Knowledge Park III, Greater Noida",
          paymentMethod: "Foodly Wallet",
          items: [
            { name: "Paneer Butter Masala Combo", quantity: 1, price: 180 },
            { name: "Butter Naan (2 pcs)", quantity: 1, price: 50 }
          ],
          bill: { total: 230, subtotal: 230, deliveryFee: 0, taxes: 12, discount: 12 }
        };
      }

      const defaultDriver = {
        name: "Rahul Sharma",
        phone: "+91 98112 34567",
        vehicle: "Bajaj Chetak EV • UP 16 BT 4821",
        deliveriesCount: 342,
        rating: "4.9",
        photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        lat: 28.4685,
        lng: 77.4930
      };

      // When viewing tracking, ensure the order is in active live delivery mode so the user can watch the live GPS movement
      const enriched = {
        ...found,
        status: "out_for_delivery",
        driver: found.driver || defaultDriver,
        statusText: "Rahul is riding down Knowledge Park III towards GL Bajaj campus (1.4 km away)",
        estimatedDelivery: "6 mins"
      };

      return { success: true, data: enriched };
    },

    async createOrder(orderPayload) {
      try {
        const res = await fetch(`${API_BASE}/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload)
        });
        if (res.ok) return await res.json();
      } catch (e) {}

      // Client-side fallback order creation for GitHub Pages
      const newOrder = {
        id: "ORD-" + Math.floor(1000 + Math.random() * 9000),
        createdAt: new Date().toISOString(),
        status: "placed",
        ...orderPayload
      };
      const saved = getSafeStorage('foodly_orders_history');
      const list = saved ? JSON.parse(saved) : [];
      list.unshift(newOrder);
      setSafeStorage('foodly_orders_history', JSON.stringify(list));
      return { success: true, data: newOrder };
    },

    connectLiveTracking(orderId, onUpdate, onComplete) {
      // Check if real SSE works
      let hasReceivedSSE = false;
      let source = null;

      try {
        source = new EventSource(`${API_BASE}/orders/${encodeURIComponent(orderId)}/live-tracking`);
        source.onmessage = (event) => {
          try {
            hasReceivedSSE = true;
            const data = JSON.parse(event.data);
            onUpdate(data);
            if (data.type === 'DELIVERED') {
              if (onComplete) onComplete(data);
              source.close();
            }
          } catch (e) {
            console.error("SSE parse error", e);
          }
        };

        source.onerror = (err) => {
          if (!hasReceivedSSE) {
            // Server SSE unavailable (GitHub Pages static host) -> simulate live stream smoothly
            source.close();
            simulateTracking(orderId, onUpdate, onComplete);
          }
        };
        return source;
      } catch (e) {
        simulateTracking(orderId, onUpdate, onComplete);
        return { close() {} };
      }
    },

    async getCampusDropZones() {
      try {
        const res = await fetch(`${API_BASE}/innovations/campus-zones`);
        if (res.ok) return await res.json();
      } catch (e) {}
      return { success: true, data: CAMPUS_DROP_ZONES };
    },

    async getAiMoodMatcher(mood = 'late_night', budget = '') {
      try {
        const params = new URLSearchParams({ mood });
        if (budget) params.set('budget', budget);
        const res = await fetch(`${API_BASE}/innovations/ai-mood-matcher?${params.toString()}`);
        if (res.ok) {
          const json = await res.json();
          if (json && json.data && json.data.length > 0 && json.data[0].dish) {
            return json;
          }
        }
      } catch (e) {}

      // Robust Client-Side AI Engine Fallback (Guaranteed to work 100% on static GitHub Pages)
      const data = await getStaticData();
      const restaurants = (data && data.restaurants) ? data.restaurants : [];
      const curated = runClientSideAiMatcher(restaurants, mood, budget);
      return {
        success: true,
        mood,
        count: curated.length,
        data: curated
      };
    },

    async askGeminiFoodly(userPrompt) {
      const apiKey = getSafeStorage('foodly_gemini_api_key') || '';
      
      // If user provided a Gemini API Key, attempt direct Gemini 1.5 Flash API call
      if (apiKey && apiKey.trim().length > 10) {
        try {
          const data = await getStaticData();
          const menuCatalog = (data && data.restaurants ? data.restaurants : [])
            .map(r => `${r.name} (${r.type}): ` + (r.menu || []).map(m => `${m.name} ₹${m.price}`).join(', '))
            .slice(0, 8).join('\n');

          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: `You are Foodly AI, the campus food genius for students at GL Bajaj & Knowledge Park. The user asked: "${userPrompt}". 
Here is a sample campus menu catalog:
${menuCatalog}
Provide a witty, student-friendly 2-sentence recommendation with exact dishes and prices, plus why it fits their vibe.`
                }]
              }]
            })
          });

          if (response.ok) {
            const result = await response.json();
            const reply = result.candidates?.[0]?.content?.parts?.[0]?.text;
            if (reply) {
              const matchedDishes = runClientSideAiMatcher((data && data.restaurants) ? data.restaurants : [], 'late_night').slice(0, 3);
              return { success: true, isGeminiLive: true, text: reply, dishes: matchedDishes };
            }
          }
        } catch (err) {
          console.warn("Gemini direct API error, using semantic matcher fallback:", err);
        }
      }

      // Built-in Semantic AI Parser Fallback (Zero API Key needed! Works 100% on GitHub Pages)
      const q = (userPrompt || '').toLowerCase();
      let detectedMood = 'late_night';
      let aiText = "Here are top-rated campus comfort picks to fuel your study sprint with maximum energy!";

      if (q.includes('protein') || q.includes('gym') || q.includes('workout') || q.includes('muscle')) {
        detectedMood = 'gym_protein';
        aiText = "Crush your daily macro targets! Here are power meals with verified high-protein counts.";
      } else if (q.includes('budget') || q.includes('cheap') || q.includes('broke') || q.includes('under') || q.includes('₹') || q.includes('save') || q.includes('150') || q.includes('100') || q.includes('200')) {
        detectedMood = 'student_budget';
        aiText = "Broke student special! Here are full, filling campus feasts kept under ₹199 with ₹0 delivery fee.";
      } else if (q.includes('coffee') || q.includes('tea') || q.includes('stress') || q.includes('cafe') || q.includes('tired')) {
        detectedMood = 'stress';
        aiText = "Dopamine boost incoming! Check out these frothy cold brews, artisan coffees, and sweet bakery bites.";
      } else if (q.includes('healthy') || q.includes('veg') || q.includes('satvik') || q.includes('vrat') || q.includes('clean') || q.includes('diet')) {
        detectedMood = 'clean_green';
        aiText = "Clean & guilt-free dining! 100% vegetarian, nutrient-dense dishes with zero post-meal bloat.";
      } else if (q.includes('cheat') || q.includes('pizza') || q.includes('biryani') || q.includes('burger') || q.includes('party')) {
        detectedMood = 'comfort_cheat';
        aiText = "Exam over? Weekend vibes! Treat yourself to loaded pizzas, rich dum biryanis, and decadent desserts.";
      }

      const data = await getStaticData();
      const restaurants = (data && data.restaurants) ? data.restaurants : [];
      const dishes = runClientSideAiMatcher(restaurants, detectedMood).slice(0, 4);

      return {
        success: true,
        isGeminiLive: false,
        text: aiText,
        detectedMood,
        dishes
      };
    },

    async createGroupRoom(hostName, restaurantId, restaurantName) {
      try {
        const res = await fetch(`${API_BASE}/innovations/group-room/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ hostName, restaurantId, restaurantName })
        });
        if (res.ok) return await res.json();
      } catch (e) {}

      const code = "GLB-" + Math.floor(100 + Math.random() * 900);
      const room = {
        code,
        hostName: hostName || "Host",
        restaurantId: restaurantId || "gl-bajaj-cafeteria",
        restaurantName: restaurantName || "GL Bajaj Central Cafeteria",
        members: [hostName || "Host"],
        items: []
      };
      setSafeStorage(`foodly_room_${code}`, JSON.stringify(room));
      return { success: true, data: room };
    },

    async getGroupRoom(code) {
      try {
        const res = await fetch(`${API_BASE}/innovations/group-room/${encodeURIComponent(code)}`);
        if (res.ok) return await res.json();
      } catch (e) {}

      let room = null;
      try {
        const saved = getSafeStorage(`foodly_room_${code}`);
        if (saved) room = JSON.parse(saved);
      } catch (e) {}

      if (!room) {
        room = { code, hostName: "Campus Host", members: ["You"], items: [], restaurantName: "GL Bajaj Central Cafeteria" };
      }
      return { success: true, data: room };
    },

    async joinGroupRoom(code, memberName) {
      try {
        const res = await fetch(`${API_BASE}/innovations/group-room/${encodeURIComponent(code)}/join`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ memberName })
        });
        if (res.ok) return await res.json();
      } catch (e) {}

      try {
        const saved = getSafeStorage(`foodly_room_${code}`);
        if (saved) {
          const room = JSON.parse(saved);
          if (!room.members.includes(memberName)) {
            room.members.push(memberName);
            setSafeStorage(`foodly_room_${code}`, JSON.stringify(room));
          }
        }
      } catch (e) {}

      return { success: true, data: { code, memberName } };
    },

    async addItemToGroupRoom(code, item, memberName) {
      try {
        const res = await fetch(`${API_BASE}/innovations/group-room/${encodeURIComponent(code)}/item`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ item, memberName })
        });
        if (res.ok) return await res.json();
      } catch (e) {}

      try {
        const saved = getSafeStorage(`foodly_room_${code}`);
        if (saved) {
          const room = JSON.parse(saved);
          room.items.push({
            id: item.id || `dish_${Date.now()}`,
            name: item.name,
            price: item.price,
            addedBy: memberName || "You"
          });
          setSafeStorage(`foodly_room_${code}`, JSON.stringify(room));
        }
      } catch (e) {}

      return { success: true };
    }
  };

  // Helper function to run intelligent semantic AI matching on client-side dishes
  function computeDishNutrition(item) {
    let calories = 320; let protein = 14; let carbs = 42; let fats = 10; let healthScore = "A";
    const name = (item.name || '').toLowerCase();
    const desc = (item.description || '').toLowerCase();

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
    } else if (name.includes('coffee') || name.includes('tea') || name.includes('latte') || name.includes('chai')) {
      calories = 140; protein = 5; carbs = 18; fats = 4; healthScore = "A";
    }

    return {
      calories,
      protein,
      carbs,
      fats,
      healthScore,
      isHighProtein: protein >= 24,
      isLowCalorie: calories <= 300
    };
  }

  function computeFairPrice(price) {
    const foodlyPrice = Math.round(price);
    const swiggyZomatoPrice = Math.round(price * 1.25 + 15);
    const savings = Math.max(0, swiggyZomatoPrice - foodlyPrice);
    return {
      dineInPrice: foodlyPrice,
      foodlyPrice,
      swiggyZomatoPrice,
      savings,
      surgeFee: 0
    };
  }

  function runClientSideAiMatcher(restaurants, mood = 'late_night', budget = '') {
    let matchingDishes = [];
    const maxBudget = budget ? parseFloat(budget) : null;

    restaurants.forEach(rest => {
      (rest.menu || []).forEach(item => {
        const name = (item.name || '').toLowerCase();
        const desc = (item.description || '').toLowerCase();
        const nutrition = item.nutrition || computeDishNutrition(item);
        const fairPrice = item.fairPrice || computeFairPrice(item.price);
        let match = false;
        let matchReason = '';

        if (mood === 'late_night' || mood === 'latenight') {
          if (name.includes('pizza') || name.includes('burger') || name.includes('roll') || name.includes('coffee') || name.includes('sandwich') || name.includes('maggie') || name.includes('momos') || name.includes('shake') || name.includes('wings')) {
            match = true;
            matchReason = "Study Fuel: Instant focus energy for late-night exam prep & coding";
          }
        } else if (mood === 'gym_protein' || mood === 'gym') {
          if (nutrition.protein >= 20 || name.includes('chicken') || name.includes('paneer') || name.includes('egg') || name.includes('tikka') || name.includes('kebab') || name.includes('soya')) {
            match = true;
            matchReason = `Power Protein: ${nutrition.protein}g protein to crush your campus fitness goals`;
          }
        } else if (mood === 'student_budget') {
          if (item.price <= 199) {
            match = true;
            matchReason = `Broke Student Saver: Full tasty portion at only ₹${item.price}`;
          }
        } else if (mood === 'comfort_cheat' || mood === 'comfort') {
          if (name.includes('biryani') || name.includes('pizza') || name.includes('shake') || name.includes('brownie') || name.includes('butter') || name.includes('chole bhature')) {
            match = true;
            matchReason = "Ultimate Comfort Feast: Decadent treat to melt away deadline stress";
          }
        } else if (mood === 'clean_green') {
          if (item.veg && (nutrition.healthScore === 'A+' || nutrition.healthScore === 'A' || name.includes('salad') || name.includes('khichdi') || name.includes('idli') || name.includes('dosa') || name.includes('chaas') || name.includes('coconut'))) {
            match = true;
            matchReason = "Clean & Guilt-Free: High-fiber pure satvik meal with zero post-lunch bloat";
          }
        } else if (mood === 'stress') {
          if (name.includes('coffee') || name.includes('chai') || name.includes('brownie') || name.includes('shake') || name.includes('pasta') || name.includes('sandwich')) {
            match = true;
            matchReason = "Dopamine & Chill: Mood-elevating snack designed to beat academic burnout";
          }
        } else if (mood === 'exam') {
          if (name.includes('kheer') || name.includes('thali') || name.includes('combo') || name.includes('sandwich') || name.includes('juice') || name.includes('dosa')) {
            match = true;
            matchReason = "Exam Stamina: Balanced carbs and proteins for sustained cognitive focus";
          }
        }

        if (maxBudget && item.price > maxBudget) match = false;

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
              area: rest.area || "Knowledge Park III",
              rating: rest.rating || 4.8,
              deliveryTime: rest.deliveryTime || "20-30 min",
              heroImage: rest.heroImage
            },
            matchReason
          });
        }
      });
    });

    if (matchingDishes.length === 0 && restaurants.length > 0) {
      restaurants.slice(0, 4).forEach(rest => {
        if (rest.menu && rest.menu[0]) {
          matchingDishes.push({
            dish: { ...rest.menu[0], nutrition: computeDishNutrition(rest.menu[0]), fairPrice: computeFairPrice(rest.menu[0].price) },
            restaurant: { id: rest.id, name: rest.name, area: rest.area, rating: rest.rating, deliveryTime: rest.deliveryTime, heroImage: rest.heroImage },
            matchReason: "Chef's daily campus recommendation"
          });
        }
      });
    }

    // Zero-fail safety net: if still empty (e.g. data.json loading or offline), provide authentic campus recommendations
    if (matchingDishes.length === 0) {
      matchingDishes.push(
        {
          dish: {
            id: "fallback-ai-1",
            name: "Artisan Cold Coffee & Chocolate Brownie",
            price: 140,
            image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80",
            veg: true,
            nutrition: { calories: 340, protein: 8, carbs: 46 },
            fairPrice: { dineInPrice: 140, swiggyZomatoPrice: 195, savings: 55 }
          },
          restaurant: {
            id: "gl-bajaj-cafeteria",
            name: "GL Bajaj Central Cafeteria",
            area: "Academic Block 2",
            rating: 4.8,
            deliveryTime: "15-20 min",
            heroImage: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80"
          },
          matchReason: "Instant Dopamine & Coding Caffeine Reboot"
        },
        {
          dish: {
            id: "fallback-ai-2",
            name: "High Protein Paneer Tikka Rice Bowl",
            price: 190,
            image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80",
            veg: true,
            nutrition: { calories: 510, protein: 29, carbs: 54 },
            fairPrice: { dineInPrice: 190, swiggyZomatoPrice: 260, savings: 70 }
          },
          restaurant: {
            id: "fit-fuel-kitchen",
            name: "FitFuel Campus Kitchen",
            area: "Knowledge Park III",
            rating: 4.9,
            deliveryTime: "20-25 min",
            heroImage: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80"
          },
          matchReason: "29g Clean Muscle Fuel & Sessional Stamina"
        },
        {
          dish: {
            id: "fallback-ai-3",
            name: "Cheese Burst Loaded Student Burger",
            price: 120,
            image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
            veg: true,
            nutrition: { calories: 460, protein: 16, carbs: 48 },
            fairPrice: { dineInPrice: 120, swiggyZomatoPrice: 175, savings: 55 }
          },
          restaurant: {
            id: "burger-club-kp3",
            name: "Burger Club Knowledge Park",
            area: "Near Gate 2",
            rating: 4.7,
            deliveryTime: "15-25 min",
            heroImage: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
          },
          matchReason: "Budget-Friendly Exam Comfort & Cheesy Goodness"
        },
        {
          dish: {
            id: "fallback-ai-4",
            name: "Desi Ghee Sabudana Khichdi (Satvik Vrat)",
            price: 110,
            image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80",
            veg: true,
            nutrition: { calories: 380, protein: 7, carbs: 62 },
            fairPrice: { dineInPrice: 110, swiggyZomatoPrice: 160, savings: 50 }
          },
          restaurant: {
            id: "satvik-bhoj-rasoi",
            name: "Satvik Rasoi GL Bajaj",
            area: "Boys Hostel Block A",
            rating: 4.9,
            deliveryTime: "10-20 min",
            heroImage: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80"
          },
          matchReason: "Sendha Namak Pure Navratri Fasting Delight"
        }
      );
    }

    return matchingDishes.slice(0, 10);
  }

  // Realistic client-side GPS simulation for static GitHub Pages and web preview
  function simulateTracking(orderId, onUpdate, onComplete) {
    const states = [
      {
        type: 'STATUS_UPDATE',
        status: 'placed',
        step: 1,
        statusText: 'Order sent to GL Bajaj Central Kitchen',
        remainingMinutes: 18,
        speedKmh: 0,
        distanceKm: '2.4 km',
        driverLat: 28.4715,
        driverLng: 77.4915,
        driverEtaText: '18 mins',
        progressPercent: 15
      },
      {
        type: 'STATUS_UPDATE',
        status: 'confirmed',
        step: 2,
        statusText: 'Kitchen confirmed order & chef preparing items',
        remainingMinutes: 15,
        speedKmh: 0,
        distanceKm: '2.4 km',
        driverLat: 28.4715,
        driverLng: 77.4915,
        driverEtaText: '15 mins',
        progressPercent: 30
      },
      {
        type: 'STATUS_UPDATE',
        status: 'preparing',
        step: 3,
        statusText: 'Chef packing meal into eco-friendly tamper-proof thermal box',
        remainingMinutes: 11,
        speedKmh: 12,
        distanceKm: '2.0 km',
        driverLat: 28.4705,
        driverLng: 77.4925,
        driverEtaText: '11 mins',
        progressPercent: 48
      },
      {
        type: 'DRIVER_MOVE',
        status: 'out_for_delivery',
        step: 4,
        statusText: 'Rahul picked up package; riding down Knowledge Park III Road',
        remainingMinutes: 7,
        speedKmh: 28,
        distanceKm: '1.4 km',
        driverLat: 28.4685,
        driverLng: 77.4940,
        driverEtaText: '7 mins away',
        progressPercent: 68
      },
      {
        type: 'DRIVER_MOVE',
        status: 'out_for_delivery',
        step: 4,
        statusText: 'Approaching GL Bajaj Gate 2 / Academic Block Roundabout',
        remainingMinutes: 3,
        speedKmh: 20,
        distanceKm: '0.5 km',
        driverLat: 28.4655,
        driverLng: 77.4970,
        driverEtaText: '3 mins away',
        progressPercent: 88
      },
      {
        type: 'DELIVERED',
        status: 'delivered',
        step: 5,
        statusText: 'Delivered at designated Campus Drop Zone! Enjoy your meal!',
        remainingMinutes: 0,
        speedKmh: 0,
        distanceKm: '0.0 km',
        driverLat: 28.4639,
        driverLng: 77.4988,
        driverEtaText: 'Delivered!',
        progressPercent: 100
      }
    ];

    let current = 0;
    onUpdate({ orderId, ...states[0] });

    const timer = setInterval(() => {
      current++;
      if (current < states.length) {
        onUpdate({ orderId, ...states[current] });
        if (states[current].type === 'DELIVERED') {
          clearInterval(timer);
          if (onComplete) onComplete(states[current]);
        }
      } else {
        clearInterval(timer);
      }
    }, 4000);

    return {
      close() {
        clearInterval(timer);
      }
    };
  }

  window.foodlyApi = api;
})();
