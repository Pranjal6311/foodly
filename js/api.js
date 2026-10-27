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
        const q = filters.q.toLowerCase();
        list = list.filter(r => r.name.toLowerCase().includes(q) || (r.cuisines || []).some(c => c.toLowerCase().includes(q)));
      }
      if (filters.cuisine) {
        const c = filters.cuisine.toLowerCase();
        list = list.filter(r => (r.cuisines || []).some(item => item.toLowerCase().includes(c)));
      }
      if (filters.dietary && filters.dietary.toLowerCase() === 'satvik') {
        list = list.filter(r => r.isPureVeg || (r.dietaryFlags || []).includes('Satvik'));
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
        const found = data.restaurants.find(r => r.id === id);
        if (found) return { success: true, data: found };
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
      const saved = localStorage.getItem('foodly_orders_history');
      const list = saved ? JSON.parse(saved) : [];
      list.unshift(newOrder);
      localStorage.setItem('foodly_orders_history', JSON.stringify(list));
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
        if (res.ok) return await res.json();
      } catch (e) {}

      const data = await getStaticData();
      const list = (data && data.restaurants) ? data.restaurants.slice(0, 4) : [];
      return { success: true, mood, count: list.length, data: list };
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

      const code = "ROOM-" + Math.floor(100 + Math.random() * 900);
      return {
        success: true,
        data: {
          code,
          hostName,
          restaurantId,
          restaurantName,
          members: [hostName],
          items: []
        }
      };
    },

    async getGroupRoom(code) {
      try {
        const res = await fetch(`${API_BASE}/innovations/group-room/${encodeURIComponent(code)}`);
        if (res.ok) return await res.json();
      } catch (e) {}
      return { success: true, data: { code, members: ["You"], items: [] } };
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
      return { success: true };
    }
  };

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
