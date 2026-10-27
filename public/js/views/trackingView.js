// public/js/views/trackingView.js - Live Order Tracking Screen (Swiggy / Zomato / Zepto Inspired)
(function () {
  let activeSSE = null;
  let activeLeafletMap = null;
  let riderMarker = null;
  let routePolyline = null;
  let traveledPolyline = null;
  let simulationTimer = null;
  let simulationIndex = 0;
  let isSimulating = false;
  let simulationSpeed = 2600;
  let currentTileLayer = null;

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
        <span class="font-bold text-sm">Connecting to Swiggy/Zepto GPS live grid...</span>
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
        lat: 28.4685,
        lng: 77.4940
      };

      // Security PIN like Swiggy / Zomato order handover
      const deliveryOtp = order.otp || String(Math.floor(1000 + Math.random() * 9000));

      // Realistic GPS Waypoints from Kitchen -> Knowledge Park III -> GL Bajaj Hostel
      const routeWaypoints = [
        { lat: 28.4715, lng: 77.4915, name: order.restaurantName || "Kitchen", eta: 16, dist: "2.3 km", speed: 0, status: "confirmed", statusText: "Order packed in thermal tamper-proof bag at kitchen" },
        { lat: 28.4702, lng: 77.4925, name: "Knowledge Park III Circle", eta: 13, dist: "1.9 km", speed: 24, status: "preparing", statusText: "Rahul picked up meal; leaving restaurant parking" },
        { lat: 28.4686, lng: 77.4940, name: "Tech Hub Boulevard", eta: 9, dist: "1.4 km", speed: 36, status: "out_for_delivery", statusText: "Rahul is zipping down Knowledge Park III Main Road on EV" },
        { lat: 28.4668, lng: 77.4958, name: "GL Bajaj Academic Approach", eta: 5, dist: "0.8 km", speed: 28, status: "out_for_delivery", statusText: "Approaching GL Bajaj Academic Block & Gate 2 roundabout" },
        { lat: 28.4651, lng: 77.4973, name: "GL Bajaj Gate 2 Checkpost", eta: 2, dist: "0.3 km", speed: 18, status: "out_for_delivery", statusText: "Rahul entered GL Bajaj Campus Gate 2 with campus pass" },
        { lat: 28.4639, lng: 77.4988, name: order.deliveryAddress || "GL Bajaj Campus Drop Zone", eta: 0, dist: "0.0 km", speed: 0, status: "delivered", statusText: "Arrived at your designated drop zone! Share OTP to collect meal." }
      ];

      simulationIndex = 2; // Active Out for Delivery so user immediately sees rider moving along road!

      container.innerHTML = `
        <div class="fade-in min-h-[calc(100vh-80px)] flex flex-col lg:flex-row bg-background">
          <!-- Left Side: Swiggy / Zomato / Zepto Full Interactive Map -->
          <section class="flex-1 relative bg-surface-container-low min-h-[480px] lg:min-h-full border-r border-surface-variant/40 overflow-hidden flex flex-col">
            
            <!-- Map Container -->
            <div id="live-map-leaflet" class="w-full h-full min-h-[480px] lg:min-h-full z-0"></div>

            <!-- Top Floating Zepto / Swiggy Arrival Card -->
            <div class="absolute top-4 left-4 right-4 z-20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pointer-events-none">
              
              <!-- Zepto/Swiggy Big ETA Card -->
              <div class="pointer-events-auto bg-surface-container-lowest/95 backdrop-blur-md px-5 py-3.5 rounded-2xl shadow-2xl border border-surface-variant/80 flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-container text-white flex items-center justify-center shadow-md shrink-0">
                  <span class="material-symbols-outlined text-2xl filled animate-pulse">electric_moped</span>
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-[10px] font-black uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">⚡ Zepto-Fast Campus Pool</span>
                    <span class="text-[10px] text-tertiary font-bold flex items-center gap-0.5">
                      <span class="w-1.5 h-1.5 rounded-full bg-tertiary animate-ping"></span> Live GPS
                    </span>
                  </div>
                  <div class="flex items-baseline gap-1.5 mt-0.5">
                    <span class="text-2xl font-black text-on-surface tracking-tight" id="hud-eta-heading">
                      ${order.status === 'delivered' ? 'Delivered!' : `Arriving in ${routeWaypoints[simulationIndex].eta} mins`}
                    </span>
                  </div>
                  <p class="text-[11px] text-secondary font-medium truncate max-w-[220px]" id="hud-eta-sub">
                    ${routeWaypoints[simulationIndex].statusText}
                  </p>
                </div>
              </div>

              <!-- Swiggy Delivery OTP & Telemetry Badge -->
              <div class="pointer-events-auto bg-surface-container-lowest/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-surface-variant/80 flex items-center gap-3">
                <div class="text-left pr-3 border-r border-surface-variant/60">
                  <span class="text-[10px] font-bold text-secondary uppercase block">Delivery PIN</span>
                  <span class="text-lg font-black font-mono tracking-widest text-primary" id="order-delivery-otp">${deliveryOtp}</span>
                </div>
                <div class="text-xs font-bold text-on-surface flex flex-col gap-0.5">
                  <span class="flex items-center gap-1 text-primary">
                    <span class="material-symbols-outlined text-sm">speed</span>
                    <span id="hud-speed">${routeWaypoints[simulationIndex].speed} km/h</span>
                  </span>
                  <span class="flex items-center gap-1 text-secondary text-[11px]">
                    <span class="material-symbols-outlined text-sm">near_me</span>
                    <span id="hud-distance">${routeWaypoints[simulationIndex].dist} away</span>
                  </span>
                </div>
              </div>
            </div>

            <!-- Floating Map Layer Switcher (Street, Satellite, Dark Radar) -->
            <div class="absolute top-24 right-4 z-20 pointer-events-auto flex flex-col gap-1.5 bg-surface-container-lowest/95 backdrop-blur-md p-1.5 rounded-2xl shadow-xl border border-surface-variant/80">
              <button id="map-style-street" class="map-layer-btn p-2 rounded-xl text-primary bg-primary/10 hover:bg-primary/20 transition-all font-bold text-xs flex items-center gap-1.5" title="Google / Swiggy Street View">
                <span class="material-symbols-outlined text-base">map</span>
                <span class="hidden md:inline text-[11px]">Street</span>
              </button>
              <button id="map-style-sat" class="map-layer-btn p-2 rounded-xl text-secondary hover:text-on-surface hover:bg-surface-container transition-all font-bold text-xs flex items-center gap-1.5" title="Zepto Satellite View">
                <span class="material-symbols-outlined text-base">satellite_alt</span>
                <span class="hidden md:inline text-[11px]">Satellite</span>
              </button>
              <button id="map-style-dark" class="map-layer-btn p-2 rounded-xl text-secondary hover:text-on-surface hover:bg-surface-container transition-all font-bold text-xs flex items-center gap-1.5" title="Night Cyberpunk Radar">
                <span class="material-symbols-outlined text-base">dark_mode</span>
                <span class="hidden md:inline text-[11px]">Night</span>
              </button>
            </div>

            <!-- Bottom Floating Swiggy Action & Simulation Toolbar -->
            <div class="absolute bottom-6 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
              <!-- Live Route Player -->
              <div class="pointer-events-auto bg-surface-container-lowest/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-2xl border border-surface-variant/80 flex items-center gap-2">
                <button id="sim-play-btn" class="px-3 py-1.5 bg-primary text-white hover:bg-primary/90 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95">
                  <span class="material-symbols-outlined text-base" id="sim-play-icon">play_arrow</span>
                  <span id="sim-play-text">Simulate Bike</span>
                </button>
                <button id="sim-ff-btn" class="px-2.5 py-1.5 bg-surface-container-low hover:bg-surface-container border border-surface-variant text-on-surface rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer active:scale-95" title="Speed Up Movement">
                  <span class="material-symbols-outlined text-sm">fast_forward</span>
                  <span id="sim-speed-text">2x</span>
                </button>
                <button id="sim-reset-btn" class="p-1.5 bg-surface-container-low hover:bg-surface-container border border-surface-variant text-secondary hover:text-on-surface rounded-xl text-xs font-bold transition-all cursor-pointer" title="Reset Route">
                  <span class="material-symbols-outlined text-base">restart_alt</span>
                </button>
              </div>

              <!-- Recenter on Rider Crosshair FAB -->
              <div class="pointer-events-auto">
                <button id="map-recenter-btn" class="bg-surface-container-lowest hover:bg-surface-container text-primary border border-surface-variant shadow-2xl px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer active:scale-95">
                  <span class="material-symbols-outlined text-base filled">my_location</span>
                  <span>Center on Rider</span>
                </button>
              </div>
            </div>
          </section>

          <!-- Right Side: Order Status, Driver Card & Timeline (Swiggy / Zomato Style) -->
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
                <span class="bg-tertiary/10 text-tertiary text-[11px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span class="material-symbols-outlined text-xs filled">verified</span> Safe Handover
                </span>
              </div>

              <h1 id="tracking-heading" class="text-2xl font-black text-on-surface tracking-tight">
                ${order.status === 'delivered' ? 'Order Delivered!' : `Arriving in ${routeWaypoints[simulationIndex].eta} mins`}
              </h1>
              <p id="tracking-subheading" class="text-xs text-on-surface-variant mt-1 font-medium leading-relaxed">
                ${routeWaypoints[simulationIndex].statusText}
              </p>
            </div>

            <!-- Content Area -->
            <div class="p-6 flex-1 flex flex-col gap-6">
              
              <!-- Swiggy / Zomato Delivery Partner Card -->
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

                <!-- Tip Rider Feature (Swiggy / Zomato signature feature) -->
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

              <!-- Swiggy / Zomato Vertical Live Timeline -->
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
                <div id="step-confirmed" class="timeline-item ${order.status !== 'placed' ? 'completed' : ''} flex gap-3.5 items-start">
                  <div class="w-8 h-8 rounded-full ${order.status !== 'placed' ? 'bg-primary text-white' : 'bg-surface-container text-secondary'} flex items-center justify-center shrink-0 shadow-sm z-10 transition-colors text-sm">
                    <span class="material-symbols-outlined text-base filled">check_circle</span>
                  </div>
                  <div>
                    <h5 class="text-xs font-black text-on-surface">Restaurant Accepted</h5>
                    <p class="text-[11px] text-secondary">${order.restaurantName} accepted your order</p>
                  </div>
                </div>

                <!-- Step 3: Kitchen Preparing -->
                <div id="step-preparing" class="timeline-item ${order.status === 'preparing' || order.status === 'out_for_delivery' || order.status === 'delivered' ? 'completed' : ''} flex gap-3.5 items-start">
                  <div class="w-8 h-8 rounded-full ${order.status === 'preparing' || order.status === 'out_for_delivery' || order.status === 'delivered' ? 'bg-primary text-white' : 'bg-surface-container text-secondary'} flex items-center justify-center shrink-0 shadow-sm z-10 transition-colors text-sm">
                    <span class="material-symbols-outlined text-base filled">skillet</span>
                  </div>
                  <div>
                    <h5 class="text-xs font-black text-on-surface">Food Cooking in Kitchen</h5>
                    <p class="text-[11px] text-secondary">Chef is hand-cooking and packaging hot meals</p>
                  </div>
                </div>

                <!-- Step 4: Out for Delivery -->
                <div id="step-delivery" class="timeline-item ${order.status === 'out_for_delivery' || order.status === 'delivered' ? 'completed' : ''} flex gap-3.5 items-start">
                  <div class="w-8 h-8 rounded-full ${order.status === 'out_for_delivery' || order.status === 'delivered' ? 'bg-primary text-white' : 'bg-surface-container text-secondary'} flex items-center justify-center shrink-0 shadow-sm z-10 transition-colors text-sm">
                    <span class="material-symbols-outlined text-base filled">electric_moped</span>
                  </div>
                  <div>
                    <h5 class="text-xs font-black text-on-surface">Out for Delivery (Rahul is on EV Bike)</h5>
                    <p class="text-[11px] text-secondary">Live GPS map active on the left</p>
                  </div>
                </div>

                <!-- Step 5: Delivered -->
                <div id="step-delivered" class="timeline-item ${order.status === 'delivered' ? 'completed' : ''} flex gap-3.5 items-start">
                  <div class="w-8 h-8 rounded-full ${order.status === 'delivered' ? 'bg-tertiary text-white' : 'bg-surface-container text-secondary'} flex items-center justify-center shrink-0 shadow-sm z-10 transition-colors text-sm">
                    <span class="material-symbols-outlined text-base filled">home</span>
                  </div>
                  <div>
                    <h5 class="text-xs font-black text-on-surface">Order Delivered</h5>
                    <p class="text-[11px] text-secondary">Enjoy your fresh meal with zero campus delivery fee!</p>
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
          const startPt = routeWaypoints[simulationIndex];

          activeLeafletMap = L.map('live-map-leaflet', {
            center: [startPt.lat, startPt.lng],
            zoom: 15,
            zoomControl: false,
            attributionControl: false
          });

          // Default: CartoDB Voyager (Swiggy / Google Maps pastel road style)
          setMapTileStyle('street');

          // Custom Zoom Controls top-left
          L.control.zoom({ position: 'bottomright' }).addTo(activeLeafletMap);

          // 1. Restaurant Pin (Kitchen)
          const restPt = routeWaypoints[0];
          const restIcon = L.divIcon({
            className: 'custom-map-icon',
            html: `
              <div class="flex flex-col items-center">
                <div class="w-10 h-10 bg-surface-container-lowest rounded-2xl border-2 border-primary shadow-2xl flex items-center justify-center text-primary">
                  <span class="material-symbols-outlined text-xl">restaurant</span>
                </div>
                <div class="bg-surface-container-lowest text-[10px] font-black px-2 py-0.5 rounded-md shadow-md border border-surface-variant text-on-surface whitespace-nowrap mt-1">
                  ${order.restaurantName || 'Kitchen'}
                </div>
              </div>
            `,
            iconSize: [42, 60],
            iconAnchor: [21, 52]
          });
          L.marker([restPt.lat, restPt.lng], { icon: restIcon }).addTo(activeLeafletMap)
            .bindPopup(`<b>${order.restaurantName || 'Campus Kitchen'}</b><br/>Order prepared fresh`);

          // 2. Customer Destination Marker (Campus Drop Target)
          const destPt = routeWaypoints[routeWaypoints.length - 1];
          const destIcon = L.divIcon({
            className: 'custom-map-icon',
            html: `
              <div class="flex flex-col items-center">
                <div class="w-12 h-12 bg-primary text-white rounded-2xl border-2 border-white shadow-2xl flex items-center justify-center ring-4 ring-primary/20">
                  <span class="material-symbols-outlined text-2xl filled">home_pin</span>
                </div>
                <div class="bg-surface-container-lowest text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-lg border border-primary/30 text-primary whitespace-nowrap mt-1 flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                  <span>Your Drop Zone</span>
                </div>
              </div>
            `,
            iconSize: [48, 65],
            iconAnchor: [24, 58]
          });
          L.marker([destPt.lat, destPt.lng], { icon: destIcon }).addTo(activeLeafletMap)
            .bindPopup(`<b>GL Bajaj Drop Location</b><br/>${order.deliveryAddress || 'GL Bajaj Campus Drop Zone'}`);

          // 3. Multi-Layer Swiggy / Google Road Route
          const latlngs = routeWaypoints.map(pt => [pt.lat, pt.lng]);
          
          // Outer Soft Glow Casing (Casing effect like Google/Swiggy maps)
          L.polyline(latlngs, {
            color: '#ffdbcf',
            weight: 12,
            opacity: 0.8,
            lineCap: 'round',
            lineJoin: 'round'
          }).addTo(activeLeafletMap);

          // Inner Vibrant Core Route Line
          routePolyline = L.polyline(latlngs, {
            color: '#aa3700',
            weight: 6,
            dashArray: '10, 8',
            opacity: 0.95,
            lineCap: 'round',
            lineJoin: 'round'
          }).addTo(activeLeafletMap);

          // 4. Iconic Swiggy / Zepto Electric Bike Marker
          const bikeIcon = L.divIcon({
            className: 'custom-map-icon',
            html: `
              <div class="flex flex-col items-center relative">
                <!-- Forward Headlight Beam Cone (Authentic Swiggy night tracking) -->
                <div class="absolute -top-6 w-12 h-10 bg-gradient-to-t from-primary/30 to-transparent rounded-t-full pointer-events-none -z-10 rotate-12"></div>
                
                <!-- Radar Pulse Rings -->
                <div class="relative">
                  <div class="w-14 h-14 bg-gradient-to-tr from-primary to-primary-container rounded-2xl flex items-center justify-center shadow-2xl text-white border-2 border-white ring-4 ring-primary/30">
                    <span class="material-symbols-outlined text-3xl filled">two_wheeler</span>
                  </div>
                  <div class="absolute -inset-2 bg-primary/30 rounded-2xl animate-ping pointer-events-none"></div>
                </div>

                <!-- Floating Driver Tag -->
                <div class="bg-surface-container-lowest px-2.5 py-1 rounded-full shadow-2xl border border-primary/40 text-xs font-black text-on-surface flex items-center gap-1.5 whitespace-nowrap mt-1">
                  <span class="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
                  <span>Rahul (4.9 ★)</span>
                </div>
              </div>
            `,
            iconSize: [56, 80],
            iconAnchor: [28, 62]
          });

          riderMarker = L.marker([startPt.lat, startPt.lng], { icon: bikeIcon, zIndexOffset: 2000 }).addTo(activeLeafletMap);

          // Fit all waypoints nicely
          activeLeafletMap.fitBounds(L.latLngBounds(latlngs), { padding: [70, 70] });

        } catch (err) {
          console.error("Leaflet map initialization error:", err);
        }
      }

      function setMapTileStyle(style) {
        if (!activeLeafletMap) return;
        if (currentTileLayer) activeLeafletMap.removeLayer(currentTileLayer);

        // Google Maps Street (Standard Swiggy / Zomato vector style - 100% free, NO watermark)
        let tileUrl = 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
        
        if (style === 'sat') {
          // Google Maps Hybrid Satellite with road names & building outlines
          tileUrl = 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
        } else if (style === 'dark') {
          // High-contrast clean dark canvas without API key
          tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';
        }

        currentTileLayer = L.tileLayer(tileUrl, {
          maxZoom: 20,
          attribution: '&copy; Google Maps'
        }).addTo(activeLeafletMap);

        // Update active layer button styles
        document.querySelectorAll('.map-layer-btn').forEach(b => {
          b.classList.remove('bg-primary/10', 'text-primary');
          b.classList.add('text-secondary');
        });
        const activeBtn = document.getElementById(`map-style-${style}`);
        if (activeBtn) {
          activeBtn.classList.add('bg-primary/10', 'text-primary');
          activeBtn.classList.remove('text-secondary');
        }
      }

      setTimeout(initializeMap, 100);

      // ── Simulation Engine ────────────────────────────────────────────────────
      function updateRiderPosition(index) {
        if (index < 0 || index >= routeWaypoints.length) return;
        simulationIndex = index;
        const pt = routeWaypoints[index];

        if (riderMarker && activeLeafletMap) {
          riderMarker.setLatLng([pt.lat, pt.lng]);
          activeLeafletMap.panTo([pt.lat, pt.lng], { animate: true, duration: 1.2 });
        }

        // Update HUD
        const hudSpeed = document.getElementById('hud-speed');
        const hudDist = document.getElementById('hud-distance');
        const hudEta = document.getElementById('hud-eta-heading');
        const hudEtaSub = document.getElementById('hud-eta-sub');
        const heading = document.getElementById('tracking-heading');
        const subheading = document.getElementById('tracking-subheading');

        if (hudSpeed) hudSpeed.textContent = `${pt.speed} km/h`;
        if (hudDist) hudDist.textContent = `${pt.dist} away`;
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

      // Map layer styles
      document.getElementById('map-style-street')?.addEventListener('click', () => setMapTileStyle('street'));
      document.getElementById('map-style-sat')?.addEventListener('click', () => setMapTileStyle('sat'));
      document.getElementById('map-style-dark')?.addEventListener('click', () => setMapTileStyle('dark'));

      // Play/Pause simulation
      document.getElementById('sim-play-btn')?.addEventListener('click', () => {
        if (isSimulating) stopSimulation();
        else startSimulation();
      });

      // Fast-forward (2x / 3x)
      document.getElementById('sim-ff-btn')?.addEventListener('click', () => {
        simulationSpeed = simulationSpeed === 2600 ? 1100 : (simulationSpeed === 1100 ? 500 : 2600);
        const speedText = document.getElementById('sim-speed-text');
        if (speedText) speedText.textContent = simulationSpeed === 500 ? '3x' : (simulationSpeed === 1100 ? '2x' : '1x');
        if (isSimulating) startSimulation();
      });

      // Reset
      document.getElementById('sim-reset-btn')?.addEventListener('click', () => {
        stopSimulation();
        simulationIndex = 0;
        updateRiderPosition(0);
        if (window.foodlyStore && window.foodlyStore.showToast) {
          window.foodlyStore.showToast('Rider reset to kitchen dispatch point', 'info');
        }
      });

      // Recenter Map
      document.getElementById('map-recenter-btn')?.addEventListener('click', () => {
        if (activeLeafletMap && routeWaypoints[simulationIndex]) {
          const pt = routeWaypoints[simulationIndex];
          activeLeafletMap.panTo([pt.lat, pt.lng], { animate: true });
        }
      });

      // Call Driver
      document.getElementById('driver-call-btn')?.addEventListener('click', () => {
        alert(`Connecting secure masked call to Rahul Sharma (${driver.phone})...\nVehicle: ${driver.vehicle}\nSecret Delivery PIN: ${deliveryOtp}`);
      });

      // Message Driver
      document.getElementById('driver-msg-btn')?.addEventListener('click', () => {
        const msg = prompt("Send a quick WhatsApp delivery note to Rahul:", "I am waiting at the hostel entrance.");
        if (msg) {
          if (window.foodlyStore && window.foodlyStore.showToast) {
            window.foodlyStore.showToast(`Note dispatched to Rahul: "${msg}"`, 'success');
          }
        }
      });

      // Tip Driver Chips
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
