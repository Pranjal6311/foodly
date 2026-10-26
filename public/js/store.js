// public/js/store.js - Centralized Reactive State Store
(function () {
  const STORAGE_KEY_CART = 'foodly_cart';
  const STORAGE_KEY_ORDERS = 'foodly_recent_orders';
  const STORAGE_KEY_ADDRESS = 'foodly_active_address';
  const STORAGE_KEY_COORDS = 'foodly_user_coords';

  class Store {
    constructor() {
      this.listeners = [];
      this.cart = this.loadCart();
      this.activeAddress = localStorage.getItem(STORAGE_KEY_ADDRESS) || "Flat 402, Sunrise Towers, 100 Feet Rd, Indiranagar, Bengaluru";
      const savedCoords = localStorage.getItem(STORAGE_KEY_COORDS);
      this.userCoords = savedCoords ? JSON.parse(savedCoords) : { lat: 12.9784, lng: 77.6408 };
      this.isDetectingLocation = false;
      this.appliedCoupon = null;
      this.isCartOpen = false;
      this.activeOrder = null;
      this.isCampusMode = localStorage.getItem('foodly_campus_mode') !== 'false'; // Default TRUE for GL Bajaj
      this.selectedCampusZone = localStorage.getItem('foodly_campus_zone') || 'glb-boys-hostel';
      this.isVratMode = false;
      this.activeGroupRoom = null;
      this.filters = {
        q: '',
        cuisine: '',
        price: '',
        rating: '',
        dietary: '',
        sortBy: '',
        type: '',
        mood: ''
      };
    }

    setVratMode(enabled) {
      this.isVratMode = typeof enabled === 'boolean' ? enabled : !this.isVratMode;
      if (this.isVratMode) {
        this.filters.dietary = 'Satvik';
        this.showToast('🪔 Navratri Vrat Mode Active! Showing 100% Satvik & Sendha Namak meals.', 'success');
      } else {
        this.filters.dietary = '';
        this.showToast('All dietary menus visible', 'info');
      }
      this.notify('VRAT_MODE_CHANGED', this.isVratMode);
      this.notify('FILTERS_CHANGED', this.filters);
    }

    setCampusMode(enabled, zoneId) {
      this.isCampusMode = enabled;
      if (zoneId) this.selectedCampusZone = zoneId;
      try {
        localStorage.setItem('foodly_campus_mode', enabled);
        if (zoneId) localStorage.setItem('foodly_campus_zone', zoneId);
      } catch(e) {}
      this.notify('CAMPUS_MODE_CHANGED', { isCampusMode: this.isCampusMode, zoneId: this.selectedCampusZone });
      this.notify('CART_UPDATED', this.cart);
    }

    getNutritionSummary() {
      let totalCalories = 0;
      let totalProtein = 0;
      let totalCarbs = 0;
      let totalFats = 0;

      this.cart.items.forEach(item => {
        const qty = item.quantity || 1;
        const nut = item.nutrition || { calories: 350, protein: 16, carbs: 45, fats: 12 };
        totalCalories += (nut.calories || 350) * qty;
        totalProtein += (nut.protein || 16) * qty;
        totalCarbs += (nut.carbs || 45) * qty;
        totalFats += (nut.fats || 12) * qty;
      });

      let healthGrade = "A+";
      if (totalCalories > 1200) healthGrade = "B";
      else if (totalCalories > 800) healthGrade = "A";

      return {
        calories: Math.round(totalCalories),
        protein: Math.round(totalProtein),
        carbs: Math.round(totalCarbs),
        fats: Math.round(totalFats),
        healthGrade
      };
    }

    getFairPriceSummary() {
      let totalFoodly = 0;
      let totalSwiggyZomato = 0;

      this.cart.items.forEach(item => {
        const qty = item.quantity || 1;
        const fp = item.fairPrice || {
          foodlyPrice: item.price,
          swiggyZomatoPrice: Math.round(item.price * 1.25 + 15),
          savings: Math.round(item.price * 0.25 + 15)
        };
        totalFoodly += (fp.foodlyPrice || item.price) * qty;
        totalSwiggyZomato += (fp.swiggyZomatoPrice || Math.round(item.price * 1.25 + 15)) * qty;
      });

      const totalSavings = Math.max(0, totalSwiggyZomato - totalFoodly) + (this.isCampusMode ? 40 : 0); // Include delivery savings if in campus mode!

      return {
        totalFoodly,
        totalSwiggyZomato,
        totalSavings,
        zeroSurgeGuarantee: true
      };
    }

    getBillDetails(deliveryFee = 40) {
      const subtotal = this.cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // Campus Batch Mode grants FREE Delivery Fee (₹0)
      let calculatedDeliveryFee = subtotal > 0 ? (this.isCampusMode ? 0 : deliveryFee) : 0;
      let discount = 0;

      if (this.appliedCoupon) {
        if (this.appliedCoupon.discountDelivery) {
          calculatedDeliveryFee = 0;
        } else if (this.appliedCoupon.discountPercent) {
          discount = Math.min((subtotal * this.appliedCoupon.discountPercent) / 100, this.appliedCoupon.maxDiscount || 999);
        }
      }

      const taxable = Math.max(0, subtotal - discount);
      // Indian GST for restaurant food: 5%
      const taxes = subtotal > 0 ? Math.round(taxable * 0.05) : 0;
      const total = Math.max(0, Math.round(subtotal - discount + calculatedDeliveryFee + taxes));

      return {
        subtotal: Math.round(subtotal),
        deliveryFee: Math.round(calculatedDeliveryFee),
        taxes,
        discount: Math.round(discount),
        total,
        isCampusFreeDelivery: this.isCampusMode && subtotal > 0
      };
    }

    async detectCurrentLocation(silent = false) {
      if (!navigator.geolocation) {
        if (!silent) this.showToast('Geolocation is not supported by your browser', 'error');
        return null;
      }

      this.isDetectingLocation = true;
      this.notify('LOCATION_DETECTING', true);
      if (!silent) this.showToast('Accessing GPS location...', 'info');

      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            let detectedAddress = `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;

            try {
              const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
              if (res.ok) {
                const data = await res.json();
                if (data && data.address) {
                  const a = data.address;
                  const locality = a.suburb || a.neighbourhood || a.road || a.residential || '';
                  const city = a.city || a.town || a.village || a.state_district || a.county || '';
                  const state = a.state || '';
                  const postcode = a.postcode ? ` - ${a.postcode}` : '';
                  const parts = [locality, city, state].filter(Boolean);
                  if (parts.length > 0) {
                    detectedAddress = parts.join(', ') + postcode;
                  } else if (data.display_name) {
                    detectedAddress = data.display_name.split(',').slice(0, 3).join(',');
                  }
                }
              }
            } catch (err) {
              console.warn('Reverse geocoding fallback to coordinates', err);
            }

            // Save actual GPS coords for nearby sorting
            this.userCoords = { lat: latitude, lng: longitude };
            try { localStorage.setItem(STORAGE_KEY_COORDS, JSON.stringify(this.userCoords)); } catch(e) {}

            this.activeAddress = detectedAddress;
            this.isDetectingLocation = false;
            try {
              localStorage.setItem(STORAGE_KEY_ADDRESS, detectedAddress);
            } catch (e) {}
            this.notify('LOCATION_UPDATED', detectedAddress);
            this.notify('LOCATION_DETECTING', false);
            this.showToast(`Delivery location set to: ${detectedAddress}`, 'success');
            resolve(detectedAddress);
          },
          (err) => {
            this.isDetectingLocation = false;
            this.notify('LOCATION_DETECTING', false);
            console.warn('Geolocation error:', err.message);
            if (!silent) {
              if (err.code === 1) {
                this.showToast('Location permission denied. You can still type your address manually.', 'error');
              } else {
                this.showToast('Unable to retrieve location. Please check your GPS settings.', 'error');
              }
            }
            resolve(null);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
        );
      });
    }

    loadCart() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_CART);
        return saved ? JSON.parse(saved) : { restaurantId: null, restaurantName: null, items: [] };
      } catch (e) {
        return { restaurantId: null, restaurantName: null, items: [] };
      }
    }

    saveCart() {
      try {
        localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(this.cart));
      } catch (e) {
        console.error("Could not save cart to localStorage", e);
      }
    }

    subscribe(callback) {
      this.listeners.push(callback);
      return () => {
        this.listeners = this.listeners.filter(cb => cb !== callback);
      };
    }

    notify(eventType, payload) {
      this.listeners.forEach(cb => cb(eventType, payload, this));
    }

    // Cart actions
    addToCart(item, restaurant) {
      if (this.cart.restaurantId && this.cart.restaurantId !== restaurant.id && this.cart.items.length > 0) {
        const confirmClear = confirm(`Your cart contains items from "${this.cart.restaurantName}". Would you like to clear your cart and start an order from "${restaurant.name}"?`);
        if (!confirmClear) return false;
        this.cart = { restaurantId: restaurant.id, restaurantName: restaurant.name, items: [] };
      }

      this.cart.restaurantId = restaurant.id;
      this.cart.restaurantName = restaurant.name;

      const existing = this.cart.items.find(i => i.id === item.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        this.cart.items.push({
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: 1
        });
      }

      this.saveCart();
      this.notify('CART_UPDATED', this.cart);
      this.showToast(`Added ${item.name} to your cart`, 'success');
      return true;
    }

    updateQuantity(itemId, delta) {
      const item = this.cart.items.find(i => i.id === itemId);
      if (!item) return;

      item.quantity += delta;
      if (item.quantity <= 0) {
        this.cart.items = this.cart.items.filter(i => i.id !== itemId);
      }

      if (this.cart.items.length === 0) {
        this.cart.restaurantId = null;
        this.cart.restaurantName = null;
        this.appliedCoupon = null;
      }

      this.saveCart();
      this.notify('CART_UPDATED', this.cart);
    }

    removeFromCart(itemId) {
      this.cart.items = this.cart.items.filter(i => i.id !== itemId);
      if (this.cart.items.length === 0) {
        this.cart.restaurantId = null;
        this.cart.restaurantName = null;
        this.appliedCoupon = null;
      }
      this.saveCart();
      this.notify('CART_UPDATED', this.cart);
    }

    clearCart() {
      this.cart = { restaurantId: null, restaurantName: null, items: [] };
      this.appliedCoupon = null;
      this.saveCart();
      this.notify('CART_UPDATED', this.cart);
    }

    toggleCart(isOpen) {
      this.isCartOpen = typeof isOpen === 'boolean' ? isOpen : !this.isCartOpen;
      this.notify('CART_TOGGLED', this.isCartOpen);
    }

    getCartCount() {
      return this.cart.items.reduce((sum, item) => sum + item.quantity, 0);
    }


    applyCoupon(coupon) {
      const subtotal = this.cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      if (coupon.minOrder && subtotal < coupon.minOrder) {
        this.showToast(`Minimum order amount for ${coupon.code} is \u20B9${coupon.minOrder}`, 'error');
        return false;
      }
      this.appliedCoupon = coupon;
      this.notify('COUPON_APPLIED', coupon);
      this.showToast(`Coupon ${coupon.code} applied successfully!`, 'success');
      return true;
    }

    removeCoupon() {
      this.appliedCoupon = null;
      this.notify('COUPON_REMOVED', null);
      this.showToast('Coupon removed', 'info');
    }

    setFilter(key, value) {
      this.filters[key] = value;
      this.notify('FILTERS_CHANGED', this.filters);
    }

    clearFilters() {
      this.filters = { q: '', cuisine: '', price: '', rating: '', dietary: '', sortBy: '' };
      this.notify('FILTERS_CHANGED', this.filters);
    }

    showToast(message, type = 'info') {
      const container = document.getElementById('toast-container');
      if (!container) return;

      const toast = document.createElement('div');
      const bgClass = type === 'success' ? 'bg-tertiary-container text-on-tertiary-container border-tertiary' :
                      type === 'error' ? 'bg-error-container text-on-error-container border-error' :
                      'bg-surface-container-high text-on-surface border-surface-variant';
      
      const icon = type === 'success' ? 'check_circle' :
                   type === 'error' ? 'error' : 'info';

      toast.className = `${bgClass} pointer-events-auto border px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 text-sm font-semibold toast-animate max-w-sm`;
      toast.innerHTML = `
        <span class="material-symbols-outlined filled text-lg">${icon}</span>
        <span class="flex-1">${message}</span>
      `;

      container.appendChild(toast);

      setTimeout(() => {
        toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-10px)';
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }

    // Authentication & Profile helpers
    isLoggedIn() {
      return localStorage.getItem('foodly_user_logged_in') === 'true';
    }

    getUser() {
      try {
        const saved = localStorage.getItem('foodly_user_profile');
        if (saved) return JSON.parse(saved);
      } catch (e) {}
      return {
        name: "Prakhar Srivastava",
        email: "prakhar.s@foodly.in",
        phone: "+91 98765 43210",
        walletBalance: 350
      };
    }

    login(credentials = {}) {
      let profile = this.getUser();
      if (credentials.email) profile.email = credentials.email;
      if (credentials.phone) profile.phone = credentials.phone;
      if (credentials.name) profile.name = credentials.name;

      localStorage.setItem('foodly_user_logged_in', 'true');
      localStorage.setItem('foodly_user_profile', JSON.stringify(profile));
      localStorage.setItem('foodly_has_seen_auth_prompt', 'true');
      this.notify('AUTH_CHANGED', profile);
      this.showToast(`Welcome back, ${profile.name}! 👋`, 'success');
      return profile;
    }

    signup(details = {}) {
      const profile = {
        name: details.name || "Foodly Explorer",
        email: details.email || "explorer@foodly.in",
        phone: details.phone || "+91 98765 43210",
        dob: "1998-01-01",
        vegMode: false,
        spiceLevel: "Medium",
        ecoCutlery: true,
        whatsappUpdates: true,
        smsUpdates: true,
        walletBalance: 450 // Includes ₹100 free welcome bonus
      };

      localStorage.setItem('foodly_user_logged_in', 'true');
      localStorage.setItem('foodly_user_profile', JSON.stringify(profile));
      localStorage.setItem('foodly_has_seen_auth_prompt', 'true');
      this.notify('AUTH_CHANGED', profile);
      this.showToast(`Account created! Welcome, ${profile.name}! ₹100 Welcome Cash added 🎁`, 'success');
      return profile;
    }

    logout() {
      localStorage.removeItem('foodly_user_logged_in');
      this.notify('AUTH_CHANGED', null);
      this.showToast('Logged out successfully', 'info');
    }

    shouldShowFirstVisitModal() {
      const hasSeen = localStorage.getItem('foodly_has_seen_auth_prompt');
      const isLoggedIn = this.isLoggedIn();
      return !hasSeen && !isLoggedIn;
    }

    dismissFirstVisitModal() {
      localStorage.setItem('foodly_has_seen_auth_prompt', 'true');
    }
  }

  window.foodlyStore = new Store();
})();
