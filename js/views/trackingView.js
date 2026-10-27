// public/js/views/trackingView.js - Live Order Tracking with Real Street & Satellite Maps
(function () {
  let activeSSE = null;
  let activeLeafletMap = null;
  let riderMarker = null;
  let destMarker = null;
  let restMarker = null;
  let routePolyline = null;
  let traversedPolyline = null;
  let remainingPolyline = null;
  let baseRouteCasing = null;
  let distanceLine = null;
  let simulationTimer = null;
  let simulationIndex = 18; // Default starting index: in-transit (0.8 km away)
  let isSimulating = false;
  let simulationSpeed = 900;
  let currentTileLayer = null;
  let currentStyle = 'street'; // 'street' or 'sat'

  async function renderTrackingView(container, orderId) {
    if (activeSSE && activeSSE.close) {
      activeSSE.close();
      activeSSE = null;
    }
    if (simulationTimer) {
      clearInterval(simulationTimer);
      simulationTimer = null;
    }
    if (activeLeafletMap) {
      try {
        activeLeafletMap.remove();
      } catch (e) {}
      activeLeafletMap = null;
    }

    container.innerHTML = `
      <div class="py-24 flex flex-col justify-center items-center text-secondary gap-3">
        <span class="material-symbols-outlined text-4xl animate-spin text-primary">progress_activity</span>
        <span class="font-bold text-sm">Connecting to live delivery rider GPS broadcast...</span>
      </div>
    `;

    try {
      const res = await window.foodlyApi.getOrder(orderId);
      const order = res.data;
      const driver = order.driver || {
        name: "Rahul Sharma",
        phone: "+91 98112 34567",
        vehicle: "Bajaj Chetak EV • UP 16 BT 4821",
        deliveriesCount: 342,
        rating: "4.9",
        photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        lat: 28.4686,
        lng: 77.4940
      };

      const deliveryOtp = order.otp || String(Math.floor(1000 + Math.random() * 9000));

      // ── 1. DYNAMIC RESTAURANT ORIGIN RESOLUTION ──────────────────────────────
      const store = window.foodlyStore;
      let restLat = 28.4714;
      let restLng = 77.4924;
      let restName = order.restaurantName || "Campus Kitchen";
      let restType = "Kitchen";

      const KNOWN_RESTAURANTS = [
        { id: 'sagar-ratna', name: 'Sagar Ratna', lat: 28.4705, lng: 77.4945, type: 'Restro' },
        { id: 'bikanervala', name: 'Bikanervala', lat: 28.4735, lng: 77.4920, type: 'Sweets & Restro' },
        { id: 'haldiram', name: 'Haldiram', lat: 28.4742, lng: 77.4910, type: 'Restro' },
        { id: 'chai-point', name: 'Chai Point', lat: 28.4718, lng: 77.4935, type: 'Cafe' },
        { id: 'gl-bajaj-cafeteria', name: 'GL Bajaj Cafeteria', lat: 28.4665, lng: 77.4978, type: 'Campus Cafe' },
        { id: 'campus-roll-express', name: 'Campus Roll Express', lat: 28.4668, lng: 77.4982, type: 'Food Cart' },
        { id: 'radisson', name: 'Radisson Blu Hotel', lat: 28.4780, lng: 77.5040, type: 'Hotel Dining' },
        { id: 'crowne-plaza', name: 'Crowne Plaza', lat: 28.4755, lng: 77.5010, type: 'Hotel Dining' },
        { id: 'yellow-chilli', name: 'The Yellow Chilli', lat: 28.4722, lng: 77.4950, type: 'Restro' },
        { id: 'navratri', name: 'Navratri Satvik Rasoi', lat: 28.4690, lng: 77.4960, type: 'Satvik Rasoi' },
        { id: 'burger-king', name: 'Burger King', lat: 28.4765, lng: 77.5025, type: 'Restro' },
        { id: 'dominos', name: "Domino's Pizza", lat: 28.4710, lng: 77.4940, type: 'Restro' },
        { id: 'behrouz', name: 'Behrouz Biryani', lat: 28.4730, lng: 77.4930, type: 'Restro' }
      ];

      const rMatch = KNOWN_RESTAURANTS.find(k => 
        (order.restaurantId && order.restaurantId.toLowerCase().includes(k.id)) ||
        (restName.toLowerCase().includes(k.name.toLowerCase()))
      );
      if (rMatch) {
        restLat = rMatch.lat;
        restLng = rMatch.lng;
        restType = rMatch.type;
      } else if (order.restaurantCoords && order.restaurantCoords.lat) {
        restLat = order.restaurantCoords.lat;
        restLng = order.restaurantCoords.lng;
      }

      // ── 2. DYNAMIC CUSTOMER DESTINATION RESOLUTION ───────────────────────────
      let destLat = 28.4639;
      let destLng = 77.4988;
      let destAddress = order.deliveryAddress || (store ? store.activeAddress : 'GL Bajaj Boys Hostel, Room 304');
      const destLower = destAddress.toLowerCase();

      if (destLower.includes('girls') || destLower.includes('block d')) {
        destLat = 28.4658;
        destLng = 77.4996;
      } else if (destLower.includes('gate 2') || destLower.includes('academic') || destLower.includes('admin') || destLower.includes('library')) {
        destLat = 28.4664;
        destLng = 77.4975;
      } else if (destLower.includes('housing') || destLower.includes('kp3') || destLower.includes('student housing')) {
        destLat = 28.4695;
        destLng = 77.4925;
      } else if (destLower.includes('pari chowk') || destLower.includes('metro')) {
        destLat = 28.4760;
        destLng = 77.5020;
      } else if (store && store.userCoords && store.userCoords.lat) {
        destLat = store.userCoords.lat;
        destLng = store.userCoords.lng;
      }

      function haversineDist(c1, c2) {
        const R = 6371;
        const dLat = (c2[0] - c1[0]) * Math.PI / 180;
        const dLng = (c2[1] - c1[1]) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(c1[0] * Math.PI / 180) * Math.cos(c2[0] * Math.PI / 180) *
                  Math.sin(dLng / 2) * Math.sin(dLng / 2);
        return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
      }

      // ── 3. DYNAMIC ROAD-SNAPPED ROUTE GENERATION ────────────────────────────
      // Knowledge Park III arterial road coordinates (zero straight lines through buildings)
      const ROAD_SPINE = [
        [28.478000, 77.504000], // 0: Pari Chowk / Radisson North
        [28.476000, 77.502000], // 1: Metro Junction
        [28.474200, 77.491000], // 2: Haldirams / North Circle
        [28.473500, 77.492000], // 3: Bikanervala / KP3 Hub
        [28.471856, 77.493055], // 4: Chai Point / Sagar Ratna Junction
        [28.470689, 77.493910], // 5: Tech Park Circle
        [28.469499, 77.496110], // 6: Knowledge Park Boulevard
        [28.467845, 77.496183], // 7: Campus Outer Avenue
        [28.466436, 77.495889], // 8: Gate 2 Approach Road
        [28.465422, 77.497814], // 9: GL Bajaj Gate 2 Checkpoint
        [28.465184, 77.498743], // 10: Campus Internal Avenue
        [28.464644, 77.499541], // 11: Girls Hostel Plaza
        [28.463900, 77.498800]  // 12: Boys Hostel Drop Zone
      ];

      function buildDynamicRoadCoordinates(startCoord, endCoord) {
        let closestStartIdx = 0;
        let minStartDist = 999;
        ROAD_SPINE.forEach((sp, i) => {
          const d = haversineDist(startCoord, sp);
          if (d < minStartDist) { minStartDist = d; closestStartIdx = i; }
        });

        let closestEndIdx = ROAD_SPINE.length - 1;
        let minEndDist = 999;
        ROAD_SPINE.forEach((sp, i) => {
          const d = haversineDist(endCoord, sp);
          if (d < minEndDist) { minEndDist = d; closestEndIdx = i; }
        });

        const rawWaypoints = [[startCoord[0], startCoord[1]]];
        const step = closestStartIdx <= closestEndIdx ? 1 : -1;
        for (let i = closestStartIdx; i !== closestEndIdx + step; i += step) {
          rawWaypoints.push([ROAD_SPINE[i][0], ROAD_SPINE[i][1]]);
        }
        rawWaypoints.push([endCoord[0], endCoord[1]]);

        // Smooth interpolate to create 40+ turn-by-turn road points
        const smoothRoad = [];
        for (let i = 0; i < rawWaypoints.length - 1; i++) {
          const p1 = rawWaypoints[i];
          const p2 = rawWaypoints[i + 1];
          const segDist = haversineDist(p1, p2);
          const steps = Math.max(3, Math.min(8, Math.round(segDist * 22)));
          for (let s = 0; s < steps; s++) {
            const t = s / steps;
            smoothRoad.push([
              p1[0] + (p2[0] - p1[0]) * t,
              p1[1] + (p2[1] - p1[1]) * t
            ]);
          }
        }
        smoothRoad.push([endCoord[0], endCoord[1]]);
        return smoothRoad;
      }

      const ROAD_COORDINATES = buildDynamicRoadCoordinates([restLat, restLng], [destLat, destLng]);

      // Compute cumulative remaining road distance backwards from destination
      const distRemaining = new Array(ROAD_COORDINATES.length);
      distRemaining[ROAD_COORDINATES.length - 1] = 0;
      for (let i = ROAD_COORDINATES.length - 2; i >= 0; i--) {
        distRemaining[i] = distRemaining[i + 1] + haversineDist(ROAD_COORDINATES[i], ROAD_COORDINATES[i + 1]);
      }

      // Generate detailed waypoints along the street curves
      const totalPoints = ROAD_COORDINATES.length;
      const routeWaypoints = ROAD_COORDINATES.map((c, i) => {
        const rem = distRemaining[i];
        const isStart = i === 0;
        const isEnd = i === totalPoints - 1;
        const eta = isEnd ? 0 : Math.max(1, Math.round(rem * 3.6 + 1));
        const speed = isEnd ? 0 : (isStart ? 14 : (i < totalPoints * 0.6 ? 34 : 20));
        let status = 'out_for_delivery';
        let statusText = `Rahul is cruising down Knowledge Park III on EV`;

        if (isEnd) {
          status = 'delivered';
          statusText = `Arrived at ${destAddress.split(',')[0]}! Share OTP to collect meal.`;
        } else if (i < 3) {
          status = 'preparing';
          statusText = `Order collected hot from ${restName}; departing kitchen parking`;
        } else if (i < totalPoints * 0.45) {
          statusText = `Cruising along Knowledge Park arterial avenue with thermal bag`;
        } else if (i < totalPoints * 0.75) {
          statusText = `Navigating roundabout towards GL Bajaj campus gate`;
        } else if (i < totalPoints * 0.9) {
          statusText = `Rahul entered GL Bajaj Campus Gate with verified security pass`;
        } else {
          statusText = `Approaching ${destAddress.split(',')[0]} drop zone courtyard`;
        }

        return {
          lat: c[0],
          lng: c[1],
          eta,
          dist: rem < 0.05 ? '0.0 km' : `${rem.toFixed(1)} km`,
          speed,
          status,
          statusText
        };
      });

      // Start in transit (approx 45% through the route)
      simulationIndex = Math.min(18, Math.floor(totalPoints * 0.45));
      const initialPt = routeWaypoints[simulationIndex];

      container.innerHTML = `
        <div class="fade-in min-h-[calc(100vh-80px)] flex flex-col lg:flex-row bg-background">
          <!-- Left Side: Interactive Map (Street View & Satellite View) -->
          <section class="flex-1 relative bg-surface-container-low min-h-[500px] lg:min-h-full border-r border-surface-variant/40 overflow-hidden flex flex-col">
            
            <!-- Real Leaflet Map Container -->
            <div id="live-map-leaflet" class="w-full h-full min-h-[500px] lg:min-h-full z-0"></div>

            <!-- Top Right: ONLY Street View or Satellite View Toggle -->
            <div class="absolute top-4 right-4 z-20 pointer-events-auto">
              <div class="bg-surface-container-lowest/95 backdrop-blur-md p-1.5 rounded-2xl shadow-2xl border border-surface-variant flex items-center gap-1.5">
                <button id="map-style-street" class="px-3.5 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all bg-primary text-white shadow-sm cursor-pointer" title="Street View (Clear roads & landmarks)">
                  <span class="material-symbols-outlined text-base">map</span>
                  <span>Street View</span>
                </button>
                <button id="map-style-sat" class="px-3.5 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all text-secondary hover:text-on-surface hover:bg-surface-container cursor-pointer" title="Satellite View (Real aerial satellite imagery)">
                  <span class="material-symbols-outlined text-base">satellite_alt</span>
                  <span>Satellite View</span>
                </button>
              </div>
            </div>

            <!-- Bottom Floating Controls & Replay Toolbar -->
            <div class="absolute bottom-6 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
              <!-- Simulation Controls -->
              <div class="pointer-events-auto bg-surface-container-lowest/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-2xl border border-surface-variant flex items-center gap-2">
                <button id="sim-play-btn" class="px-3 py-1.5 bg-primary text-white hover:bg-primary/90 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95">
                  <span class="material-symbols-outlined text-base" id="sim-play-icon">play_arrow</span>
                  <span id="sim-play-text">Simulate Bike</span>
                </button>
                <button id="sim-ff-btn" class="px-2.5 py-1.5 bg-surface-container-low hover:bg-surface-container border border-surface-variant text-on-surface rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer active:scale-95" title="Speed Up">
                  <span class="material-symbols-outlined text-sm">fast_forward</span>
                  <span id="sim-speed-text">2x</span>
                </button>
                <button id="sim-reset-btn" class="px-3 py-1.5 bg-surface-container-low hover:bg-surface-container border border-surface-variant text-secondary hover:text-on-surface rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer" title="Replay from Kitchen (2.3 km)">
                  <span class="material-symbols-outlined text-base">restart_alt</span>
                  <span>Replay (2.3 km)</span>
                </button>
              </div>

              <!-- Center on Rider & Destination Button -->
              <div class="pointer-events-auto">
                <button id="map-recenter-btn" class="bg-surface-container-lowest hover:bg-surface-container text-primary border border-surface-variant shadow-2xl px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer active:scale-95">
                  <span class="material-symbols-outlined text-base filled">fit_screen</span>
                  <span>Show Both Rider &amp; Destination</span>
                </button>
              </div>
            </div>
          </section>

          <!-- Right Side: Order Status, Driver Card & Timeline (Canonically styled) -->
          <section class="w-full lg:w-[480px] xl:w-[520px] bg-surface-container-lowest min-h-full overflow-y-auto shrink-0 flex flex-col shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.06)] z-30">
            <!-- Header Sticky -->
            <div class="sticky top-0 bg-surface-container-lowest/95 backdrop-blur-md z-30 p-6 border-b border-surface-variant/50">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <span class="px-3 py-1 bg-primary/10 text-primary font-black text-xs rounded-full">
                    Order #${order.id}
                  </span>
                  <span class="w-1.5 h-1.5 rounded-full bg-surface-variant"></span>
                  <span class="text-xs font-bold text-on-surface truncate max-w-[180px]">${order.restaurantName}</span>
                </div>
                <!-- Delivery OTP Badge -->
                <div class="flex items-center gap-1.5 bg-surface-container-high px-3 py-1 rounded-full border border-surface-variant">
                  <span class="text-[10px] font-bold text-secondary uppercase">OTP PIN:</span>
                  <span class="text-xs font-black font-mono tracking-wider text-primary">${deliveryOtp}</span>
                </div>
              </div>

              <h1 id="tracking-heading" class="text-2xl font-black text-on-surface tracking-tight">
                Arriving in ${initialPt.eta} mins
              </h1>
              <p id="tracking-subheading" class="text-xs text-on-surface-variant mt-1 font-medium leading-relaxed">
                ${initialPt.statusText}
              </p>
            </div>

            <!-- Content Area -->
            <div class="p-6 flex-1 flex flex-col gap-6">
              
              <!-- Delivery Partner Card -->
              <div class="bg-surface-container-low rounded-2xl p-4.5 border border-surface-variant/60 shadow-sm relative overflow-hidden">
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center gap-3.5">
                    <div class="relative">
                      <div class="w-14 h-14 rounded-2xl bg-surface-container-high overflow-hidden border-2 border-primary/20 shadow-sm">
                        <img class="w-full h-full object-cover" src="${driver.photo}" alt="${driver.name}"/>
                      </div>
                      <div class="absolute -bottom-1 -right-1 bg-amber-500 text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-md flex items-center shadow-sm">
                        ${driver.rating} <span class="material-symbols-outlined text-[10px] ml-0.5 filled">star</span>
                      </div>
                    </div>
                    <div>
                      <div class="flex items-center gap-1.5">
                        <h4 class="font-extrabold text-sm text-on-surface">${driver.name}</h4>
                        <span class="material-symbols-outlined text-tertiary text-sm filled" title="Verified Driver">verified</span>
                      </div>
                      <p class="text-xs text-secondary font-medium mt-0.5">${driver.vehicle}</p>
                      <div class="flex items-center gap-2 mt-1">
                        <span class="text-[10px] bg-tertiary/10 text-tertiary font-bold px-2 py-0.5 rounded-full">Helmet Verified ✓</span>
                        <span class="text-[10px] text-secondary font-semibold">342 drops</span>
                      </div>
                    </div>
                  </div>

                  <div class="flex items-center gap-2">
                    <button id="driver-call-btn" class="w-10 h-10 rounded-2xl bg-primary text-white hover:bg-primary/90 flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer" title="Call Driver">
                      <span class="material-symbols-outlined text-lg">call</span>
                    </button>
                    <button id="driver-msg-btn" class="w-10 h-10 rounded-2xl bg-surface-container-lowest border border-surface-variant hover:border-primary text-primary flex items-center justify-center transition-all shadow-sm active:scale-95 cursor-pointer" title="WhatsApp Message">
                      <span class="material-symbols-outlined text-lg">chat</span>
                    </button>
                  </div>
                </div>

                <!-- Tip Rider Feature -->
                <div class="pt-3 border-t border-surface-variant/50 flex items-center justify-between text-xs">
                  <span class="text-secondary font-medium">Tip delivery partner:</span>
                  <div class="flex items-center gap-1.5">
                    <button class="tip-btn px-2.5 py-1 rounded-lg border border-surface-variant hover:border-primary text-primary text-[11px] font-bold hover:bg-primary/5 transition-all cursor-pointer" data-amt="20">+ ₹20</button>
                    <button class="tip-btn px-2.5 py-1 rounded-lg border border-surface-variant hover:border-primary text-primary text-[11px] font-bold hover:bg-primary/5 transition-all cursor-pointer" data-amt="30">+ ₹30</button>
                    <button class="tip-btn px-2.5 py-1 rounded-lg border border-surface-variant hover:border-primary text-primary text-[11px] font-bold hover:bg-primary/5 transition-all cursor-pointer" data-amt="50">+ ₹50</button>
                  </div>
                </div>
              </div>

              <!-- Campus Delivery Drop Zone Card -->
              <div class="p-4 rounded-2xl border border-primary/20 bg-primary/5 flex items-start gap-3">
                <div class="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-xl">school</span>
                </div>
                <div class="text-xs">
                  <span class="font-extrabold text-on-surface block">GL Bajaj Campus Drop Zone</span>
                  <span class="text-secondary leading-relaxed">${order.deliveryAddress || 'GL Bajaj Boys Hostel (Block A & B), Knowledge Park III, Greater Noida'}</span>
                  <div class="mt-1 flex items-center gap-2 text-[11px] text-tertiary font-bold">
                    <span>⚡ Free Batch Drop Active</span> &bull; <span>₹40 Delivery Fee Saved</span>
                  </div>
                </div>
              </div>

              <!-- Vertical Timeline -->
              <div class="flex flex-col gap-4 py-1" id="tracking-timeline">
                <!-- Step 1: Order Placed -->
                <div class="timeline-item completed flex gap-3.5 items-start">
                  <div class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shrink-0 shadow-sm z-10 text-sm">
                    <span class="material-symbols-outlined text-base filled">receipt_long</span>
                  </div>
                  <div>
                    <h5 class="text-xs font-black text-on-surface">Order Confirmed</h5>
                    <p class="text-[11px] text-secondary">Transmitted to kitchen in Knowledge Park III</p>
                  </div>
                </div>

                <!-- Step 2: Confirmed -->
                <div id="step-confirmed" class="timeline-item completed flex gap-3.5 items-start">
                  <div class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shrink-0 shadow-sm z-10 transition-colors text-sm">
                    <span class="material-symbols-outlined text-base filled">check_circle</span>
                  </div>
                  <div>
                    <h5 class="text-xs font-black text-on-surface">Restaurant Accepted</h5>
                    <p class="text-[11px] text-secondary">${order.restaurantName} accepted your order</p>
                  </div>
                </div>

                <!-- Step 3: Kitchen Preparing -->
                <div id="step-preparing" class="timeline-item completed flex gap-3.5 items-start">
                  <div class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shrink-0 shadow-sm z-10 transition-colors text-sm">
                    <span class="material-symbols-outlined text-base filled">skillet</span>
                  </div>
                  <div>
                    <h5 class="text-xs font-black text-on-surface">Food Cooked &amp; Packed</h5>
                    <p class="text-[11px] text-secondary">Packed in eco-friendly tamper-proof thermal box</p>
                  </div>
                </div>

                <!-- Step 4: Out for Delivery -->
                <div id="step-delivery" class="timeline-item completed flex gap-3.5 items-start">
                  <div class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shrink-0 shadow-sm z-10 transition-colors text-sm">
                    <span class="material-symbols-outlined text-base filled">electric_moped</span>
                  </div>
                  <div>
                    <h5 class="text-xs font-black text-on-surface">Out for Delivery (Rahul on EV Scooter)</h5>
                    <p class="text-[11px] text-secondary">Live GPS map tracking active on the left</p>
                  </div>
                </div>

                <!-- Step 5: Delivered -->
                <div id="step-delivered" class="timeline-item flex gap-3.5 items-start">
                  <div class="w-8 h-8 rounded-full bg-surface-container text-secondary flex items-center justify-center shrink-0 shadow-sm z-10 transition-colors text-sm">
                    <span class="material-symbols-outlined text-base filled">home</span>
                  </div>
                  <div>
                    <h5 class="text-xs font-black text-on-surface">Order Delivered</h5>
                    <p class="text-[11px] text-secondary">Collect package at campus drop zone</p>
                  </div>
                </div>
              </div>

              <!-- Order Summary Receipt -->
              <div class="p-4 rounded-2xl bg-surface-container-low border border-surface-variant/60 text-xs">
                <h4 class="font-extrabold text-sm text-on-surface mb-3 flex items-center justify-between">
                  <span>Order Items</span>
                  <span class="text-secondary font-medium">${order.paymentMethod || 'Foodly Wallet'}</span>
                </h4>
                <div class="flex flex-col gap-2 mb-3">
                  ${(order.items || []).map(item => `
                    <div class="flex justify-between items-center text-on-surface">
                      <span>${item.quantity || 1}x ${item.name}</span>
                      <span class="font-bold">₹${((item.price || 150) * (item.quantity || 1)).toFixed(0)}</span>
                    </div>
                  `).join('')}
                </div>
                <div class="pt-2 border-t border-surface-variant/80 flex justify-between items-center font-black text-sm text-on-surface">
                  <span>Total Amount Paid</span>
                  <span class="text-primary text-base font-black">₹${(order.bill ? order.bill.total : 230).toFixed(0)}</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      `;

      // ── Leaflet Interactive Map Initialization ────────────────────────────────
      function initializeMap() {
        const mapContainer = document.getElementById('live-map-leaflet');
        if (!mapContainer) return;

        if (typeof L === 'undefined') {
          setTimeout(initializeMap, 300);
          return;
        }

        try {
          const riderPt = routeWaypoints[simulationIndex];
          const destPt = routeWaypoints[routeWaypoints.length - 1];
          const restPt = routeWaypoints[0];

          activeLeafletMap = L.map('live-map-leaflet', {
            center: [(riderPt.lat + destPt.lat) / 2, (riderPt.lng + destPt.lng) / 2],
            zoom: 15,
            zoomControl: false,
            attributionControl: false
          });

          // Set default to Street View
          setMapTileStyle('street');

          L.control.zoom({ position: 'bottomright' }).addTo(activeLeafletMap);

          // 1. Restaurant Pin (Kitchen) - Sleek, round & compact
          const restIcon = L.divIcon({
            className: 'custom-map-icon',
            html: `
              <div class="relative flex items-center justify-center w-7 h-7">
                <div class="w-7 h-7 rounded-full bg-slate-900 border-2 border-white shadow-lg flex items-center justify-center text-white ring-1 ring-slate-700/50">
                  <span class="material-symbols-outlined text-xs filled">restaurant</span>
                </div>
              </div>
            `,
            iconSize: [28, 28],
            iconAnchor: [14, 14]
          });
          restMarker = L.marker([restPt.lat, restPt.lng], { icon: restIcon }).addTo(activeLeafletMap)
            .bindPopup(`<b>${restName}</b><br/>${restType} Kitchen • Dispatched Hot`);

          // 2. Customer Destination Marker (Drop Zone) - Sleek, round & compact
          const destIcon = L.divIcon({
            className: 'custom-map-icon',
            html: `
              <div class="relative flex items-center justify-center w-8 h-8">
                <div class="absolute -inset-1 bg-emerald-500/25 rounded-full pointer-events-none"></div>
                <div class="w-8 h-8 rounded-full bg-emerald-600 border-2 border-white shadow-xl flex items-center justify-center text-white ring-2 ring-emerald-500/40">
                  <span class="material-symbols-outlined text-sm font-black filled">home</span>
                </div>
              </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
          });
          destMarker = L.marker([destPt.lat, destPt.lng], { icon: destIcon, zIndexOffset: 1500 }).addTo(activeLeafletMap)
            .bindPopup(`<b>Your Drop Zone</b><br/>${destAddress}`);

          // 3. Real Turn-by-Turn Road Route Polylines (Snaps 100% to Knowledge Park roads, roundabouts & GL Bajaj campus gates)
          // Layer A: Outer road casing (clean white background buffer for high contrast against maps)
          baseRouteCasing = L.polyline(ROAD_COORDINATES, {
            color: '#ffffff',
            weight: 8,
            opacity: 0.95,
            lineCap: 'round',
            lineJoin: 'round'
          }).addTo(activeLeafletMap);

          // Layer B: Completed path (subtle slate road path)
          traversedPolyline = L.polyline(ROAD_COORDINATES.slice(0, simulationIndex + 1), {
            color: '#64748b',
            weight: 5,
            opacity: 0.85,
            lineCap: 'round',
            lineJoin: 'round'
          }).addTo(activeLeafletMap);

          // Layer C: Active remaining path (vibrant Swiggy/Zomato style delivery orange, dashed)
          remainingPolyline = L.polyline(ROAD_COORDINATES.slice(simulationIndex), {
            color: '#ff5200',
            weight: 5,
            dashArray: '8, 6',
            opacity: 0.98,
            lineCap: 'round',
            lineJoin: 'round'
          }).addTo(activeLeafletMap);

          // 4. Moving Delivery Partner (Bike) Marker - Small, round & sleek Swiggy/Zomato live rider dot
          const bikeIcon = L.divIcon({
            className: 'custom-map-icon',
            html: `
              <div class="relative flex items-center justify-center w-8 h-8">
                <div class="absolute -inset-1.5 bg-orange-500/30 rounded-full animate-ping pointer-events-none"></div>
                <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-500 border-2 border-white shadow-xl flex items-center justify-center text-white ring-2 ring-orange-500/50">
                  <span class="material-symbols-outlined text-sm font-black filled">two_wheeler</span>
                </div>
              </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
          });

          riderMarker = L.marker([riderPt.lat, riderPt.lng], { icon: bikeIcon, zIndexOffset: 2500 }).addTo(activeLeafletMap);

          // Frame BOTH rider and destination in camera view
          fitBothInView();

        } catch (err) {
          console.error("Leaflet map initialization error:", err);
        }
      }

      function fitBothInView() {
        if (!activeLeafletMap) return;
        const riderPt = routeWaypoints[simulationIndex];
        const destPt = routeWaypoints[routeWaypoints.length - 1];
        activeLeafletMap.fitBounds(L.latLngBounds([[riderPt.lat, riderPt.lng], [destPt.lat, destPt.lng]]), {
          padding: [110, 110],
          maxZoom: 16
        });
      }

      // Switch between ONLY Street View and Satellite View
      function setMapTileStyle(style) {
        if (!activeLeafletMap) return;
        if (currentTileLayer) activeLeafletMap.removeLayer(currentTileLayer);

        currentStyle = style;
        let tileUrl = '';

        if (style === 'sat') {
          // Guaranteed Working Esri Satellite Imagery
          tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
        } else {
          // Guaranteed Working Esri World Street Map (high contrast roads, building footprints, English labels, 0 watermarks)
          tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';
        }

        currentTileLayer = L.tileLayer(tileUrl, {
          maxZoom: 19,
          attribution: '&copy; Esri &amp; OpenStreetMap'
        }).addTo(activeLeafletMap);

        // Update button states
        const streetBtn = document.getElementById('map-style-street');
        const satBtn = document.getElementById('map-style-sat');

        if (style === 'street') {
          streetBtn?.classList.add('bg-primary', 'text-white', 'shadow-sm');
          streetBtn?.classList.remove('text-secondary', 'hover:bg-surface-container');
          satBtn?.classList.remove('bg-primary', 'text-white', 'shadow-sm');
          satBtn?.classList.add('text-secondary', 'hover:bg-surface-container');
        } else {
          satBtn?.classList.add('bg-primary', 'text-white', 'shadow-sm');
          satBtn?.classList.remove('text-secondary', 'hover:bg-surface-container');
          streetBtn?.classList.remove('bg-primary', 'text-white', 'shadow-sm');
          streetBtn?.classList.add('text-secondary', 'hover:bg-surface-container');
        }
      }

      setTimeout(initializeMap, 100);

      // ── Simulation Engine ────────────────────────────────────────────────────
      function updateRiderPosition(index) {
        if (index < 0 || index >= routeWaypoints.length) return;
        simulationIndex = index;
        const pt = routeWaypoints[index];
        const destPt = routeWaypoints[routeWaypoints.length - 1];

        if (riderMarker) {
          riderMarker.setLatLng([pt.lat, pt.lng]);
        }

        // Dynamically update road path segments: traversed vs remaining
        if (traversedPolyline && remainingPolyline) {
          traversedPolyline.setLatLngs(ROAD_COORDINATES.slice(0, index + 1));
          remainingPolyline.setLatLngs(ROAD_COORDINATES.slice(index));
        }

        // Keep both in view smoothly
        if (activeLeafletMap && pt.status !== 'delivered') {
          activeLeafletMap.panTo([(pt.lat + destPt.lat) / 2, (pt.lng + destPt.lng) / 2], { animate: true, duration: 1.2 });
        }

        // Update HUD
        const hudDistMap = document.getElementById('hud-map-distance');
        const hudSpeedMap = document.getElementById('hud-map-speed');
        const hudEta = document.getElementById('hud-eta-heading');
        const hudEtaSub = document.getElementById('hud-eta-sub');
        const heading = document.getElementById('tracking-heading');
        const subheading = document.getElementById('tracking-subheading');

        if (hudDistMap) hudDistMap.textContent = pt.dist;
        if (hudSpeedMap) hudSpeedMap.textContent = `${pt.speed} km/h`;
        if (hudEta) hudEta.textContent = pt.status === 'delivered' ? 'Delivered!' : `Arriving in ${pt.eta} mins`;
        if (hudEtaSub) hudEtaSub.textContent = pt.statusText;
        if (heading) heading.textContent = pt.status === 'delivered' ? 'Order Delivered!' : `Arriving in ${pt.eta} mins`;
        if (subheading) subheading.textContent = pt.statusText;

        updateTimelineStage(pt.status);

        if (pt.status === 'delivered') {
          stopSimulation();
          if (window.foodlyStore && window.foodlyStore.playSound) {
            window.foodlyStore.playSound('cash');
          }
          if (window.foodlyStore && window.foodlyStore.showToast) {
            window.foodlyStore.showToast('🎉 Your hot meal has been delivered! Enjoy!', 'success');
          }
        }
      }

      function startSimulation() {
        if (simulationTimer) clearInterval(simulationTimer);
        isSimulating = true;
        updateSimControls();

        if (simulationIndex >= routeWaypoints.length - 1) {
          simulationIndex = 0;
          updateRiderPosition(0);
        }

        simulationTimer = setInterval(() => {
          if (simulationIndex < routeWaypoints.length - 1) {
            simulationIndex++;
            updateRiderPosition(simulationIndex);
          } else {
            stopSimulation();
          }
        }, simulationSpeed);
      }

      function stopSimulation() {
        if (simulationTimer) {
          clearInterval(simulationTimer);
          simulationTimer = null;
        }
        isSimulating = false;
        updateSimControls();
      }

      function updateSimControls() {
        const playIcon = document.getElementById('sim-play-icon');
        const playText = document.getElementById('sim-play-text');
        if (playIcon) playIcon.textContent = isSimulating ? 'pause' : 'play_arrow';
        if (playText) playText.textContent = isSimulating ? 'Pause' : 'Simulate Bike';
      }

      function updateTimelineStage(status) {
        const conf = document.getElementById('step-confirmed');
        const prep = document.getElementById('step-preparing');
        const deliv = document.getElementById('step-delivery');
        const done = document.getElementById('step-delivered');

        const isAtLeast = (target) => {
          const ranks = { placed: 1, confirmed: 2, preparing: 3, out_for_delivery: 4, delivered: 5 };
          return (ranks[status] || 1) >= (ranks[target] || 1);
        };

        if (conf) {
          const dot = conf.querySelector('div');
          if (isAtLeast('confirmed')) {
            dot?.classList.replace('bg-surface-container', 'bg-primary');
            dot?.classList.replace('text-secondary', 'text-white');
          }
        }
        if (prep) {
          const dot = prep.querySelector('div');
          if (isAtLeast('preparing')) {
            dot?.classList.replace('bg-surface-container', 'bg-primary');
            dot?.classList.replace('text-secondary', 'text-white');
          }
        }
        if (deliv) {
          const dot = deliv.querySelector('div');
          if (isAtLeast('out_for_delivery')) {
            dot?.classList.replace('bg-surface-container', 'bg-primary');
            dot?.classList.replace('text-secondary', 'text-white');
          }
        }
        if (done) {
          const dot = done.querySelector('div');
          if (isAtLeast('delivered')) {
            dot?.classList.replace('bg-surface-container', 'bg-tertiary');
            dot?.classList.replace('text-secondary', 'text-white');
          }
        }
      }

      // ── Event Listeners ───────────────────────────────────────────────────────

      // 1. Street View vs Satellite View Toggle ONLY
      document.getElementById('map-style-street')?.addEventListener('click', () => setMapTileStyle('street'));
      document.getElementById('map-style-sat')?.addEventListener('click', () => setMapTileStyle('sat'));

      // 2. Play/Pause simulation
      document.getElementById('sim-play-btn')?.addEventListener('click', () => {
        if (isSimulating) stopSimulation();
        else startSimulation();
      });

      // 3. Fast-forward (2x / 4x)
      document.getElementById('sim-ff-btn')?.addEventListener('click', () => {
        simulationSpeed = simulationSpeed === 900 ? 450 : (simulationSpeed === 450 ? 220 : 900);
        const speedText = document.getElementById('sim-speed-text');
        if (speedText) speedText.textContent = simulationSpeed === 220 ? '4x' : (simulationSpeed === 450 ? '2x' : '1x');
        if (isSimulating) startSimulation();
      });

      // 4. Replay from Kitchen (1.6 km)
      document.getElementById('sim-reset-btn')?.addEventListener('click', () => {
        stopSimulation();
        simulationIndex = 0;
        updateRiderPosition(0);
        fitBothInView();
        if (window.foodlyStore && window.foodlyStore.showToast) {
          window.foodlyStore.showToast('Replaying journey from Kitchen (1.6 km away along road)', 'info');
        }
        setTimeout(startSimulation, 600);
      });

      // 5. Fit Both Rider & Destination
      document.getElementById('map-recenter-btn')?.addEventListener('click', fitBothInView);

      // 6. Call Driver
      document.getElementById('driver-call-btn')?.addEventListener('click', () => {
        alert(`Connecting secure masked call to Rahul Sharma (${driver.phone})...\nVehicle: ${driver.vehicle}\nSecret Delivery PIN: ${deliveryOtp}`);
      });

      // 7. Message Driver
      document.getElementById('driver-msg-btn')?.addEventListener('click', () => {
        const msg = prompt("Send a quick WhatsApp delivery note to Rahul:", "I am waiting at the hostel entrance.");
        if (msg) {
          if (window.foodlyStore && window.foodlyStore.showToast) {
            window.foodlyStore.showToast(`Note dispatched to Rahul: "${msg}"`, 'success');
          }
        }
      });

      // 8. Tip Driver Chips
      container.querySelectorAll('.tip-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const amt = btn.getAttribute('data-amt');
          btn.classList.add('bg-primary', 'text-white');
          if (window.foodlyStore && window.foodlyStore.showToast) {
            window.foodlyStore.showToast(`₹${amt} tip added for Rahul! Thank you for supporting your delivery partner.`, 'success');
            if (window.foodlyStore.playSound) window.foodlyStore.playSound('cash');
          }
        });
      });

      // Always auto-start live movement on load so user sees rider gliding along map!
      setTimeout(startSimulation, 800);

    } catch (e) {
      console.error("Error loading order tracking", e);
    }
  }

  window.renderTrackingView = renderTrackingView;
})();
