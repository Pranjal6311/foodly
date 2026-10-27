// public/js/views/trackingView.js - Live Order Tracking with Real Street & Satellite Maps
(function () {
  let activeSSE = null;
  let activeLeafletMap = null;
  let riderMarker = null;
  let destMarker = null;
  let restMarker = null;
  let routePolyline = null;
  let distanceLine = null;
  let simulationTimer = null;
  let simulationIndex = 2; // Default starting index: in-transit (1.4 km away)
  let isSimulating = false;
  let simulationSpeed = 2600;
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

      // Realistic road waypoints from Kitchen -> Knowledge Park III -> GL Bajaj Hostel
      const routeWaypoints = [
        { lat: 28.4715, lng: 77.4915, name: order.restaurantName || "Kitchen", eta: 16, dist: "2.3 km", speed: 0, status: "confirmed", statusText: "Order packed in thermal tamper-proof bag at kitchen" },
        { lat: 28.4702, lng: 77.4925, name: "Knowledge Park III Circle", eta: 13, dist: "1.9 km", speed: 24, status: "preparing", statusText: "Rahul picked up meal; leaving restaurant parking" },
        { lat: 28.4686, lng: 77.4940, name: "Tech Hub Boulevard", eta: 9, dist: "1.4 km", speed: 36, status: "out_for_delivery", statusText: "Rahul is riding down Knowledge Park III Main Road on EV" },
        { lat: 28.4668, lng: 77.4958, name: "GL Bajaj Academic Approach", eta: 5, dist: "0.8 km", speed: 28, status: "out_for_delivery", statusText: "Approaching GL Bajaj Academic Block & Gate 2 roundabout" },
        { lat: 28.4651, lng: 77.4973, name: "GL Bajaj Gate 2 Checkpost", eta: 2, dist: "0.3 km", speed: 18, status: "out_for_delivery", statusText: "Rahul entered GL Bajaj Campus Gate 2 with campus pass" },
        { lat: 28.4639, lng: 77.4988, name: order.deliveryAddress || "GL Bajaj Campus Drop Zone", eta: 0, dist: "0.0 km", speed: 0, status: "delivered", statusText: "Arrived at your designated drop zone! Share OTP to collect meal." }
      ];

      // Start at waypoint 2 (1.4 km away from campus drop zone)
      simulationIndex = 2;
      const initialPt = routeWaypoints[simulationIndex];

      container.innerHTML = `
        <div class="fade-in min-h-[calc(100vh-80px)] flex flex-col lg:flex-row bg-background">
          <!-- Left Side: Interactive Map (Street View & Satellite View) -->
          <section class="flex-1 relative bg-surface-container-low min-h-[500px] lg:min-h-full border-r border-surface-variant/40 overflow-hidden flex flex-col">
            
            <!-- Real Leaflet Map Container -->
            <div id="live-map-leaflet" class="w-full h-full min-h-[500px] lg:min-h-full z-0"></div>

            <!-- Top Left: Live Distance & Arrival HUD Card -->
            <div class="absolute top-4 left-4 z-20 pointer-events-auto">
              <div class="bg-surface-container-lowest/95 backdrop-blur-md px-5 py-3.5 rounded-2xl shadow-2xl border border-surface-variant/80 flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-container text-white flex items-center justify-center shadow-md shrink-0">
                  <span class="material-symbols-outlined text-2xl filled animate-pulse">electric_moped</span>
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-[10px] font-black uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">⚡ Live GPS Tracking</span>
                    <span class="text-[10px] text-tertiary font-bold flex items-center gap-0.5">
                      <span class="w-1.5 h-1.5 rounded-full bg-tertiary animate-ping"></span> Active
                    </span>
                  </div>
                  <div class="flex items-baseline gap-1.5 mt-0.5">
                    <span class="text-2xl font-black text-on-surface tracking-tight" id="hud-eta-heading">
                      Arriving in ${initialPt.eta} mins
                    </span>
                  </div>
                  <p class="text-[11px] text-secondary font-medium truncate max-w-[240px]" id="hud-eta-sub">
                    ${initialPt.statusText}
                  </p>
                </div>
              </div>
            </div>

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

            <!-- Floating Live Distance Pill in Center Map Overlay -->
            <div class="absolute top-24 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
              <div class="bg-surface-container-lowest/95 backdrop-blur-md px-4 py-2 rounded-full shadow-2xl border-2 border-primary/40 flex items-center gap-2 text-xs font-black text-on-surface whitespace-nowrap">
                <span class="material-symbols-outlined text-base text-primary">distance</span>
                <span>Distance to Drop Zone:</span>
                <span class="text-primary font-black text-sm" id="hud-map-distance">${initialPt.dist}</span>
                <span class="text-secondary font-medium">•</span>
                <span class="text-tertiary font-bold" id="hud-map-speed">${initialPt.speed} km/h</span>
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

          // 1. Restaurant Pin (Kitchen)
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
          restMarker = L.marker([restPt.lat, restPt.lng], { icon: restIcon }).addTo(activeLeafletMap)
            .bindPopup(`<b>${order.restaurantName || 'Campus Kitchen'}</b><br/>Order dispatched hot`);

          // 2. Customer Destination Marker (Always prominently visible!)
          const destIcon = L.divIcon({
            className: 'custom-map-icon',
            html: `
              <div class="flex flex-col items-center">
                <div class="relative">
                  <div class="w-12 h-12 bg-emerald-600 text-white rounded-2xl border-2 border-white shadow-2xl flex items-center justify-center ring-4 ring-emerald-500/30">
                    <span class="material-symbols-outlined text-2xl filled">home</span>
                  </div>
                  <div class="absolute -inset-2 bg-emerald-500/30 rounded-2xl animate-ping pointer-events-none"></div>
                </div>
                <div class="bg-emerald-700 text-white text-[11px] font-black px-3 py-1 rounded-full shadow-2xl border border-white whitespace-nowrap mt-1 flex items-center gap-1">
                  <span>🏁 Drop Zone (Hostel)</span>
                </div>
              </div>
            `,
            iconSize: [52, 72],
            iconAnchor: [26, 62]
          });
          destMarker = L.marker([destPt.lat, destPt.lng], { icon: destIcon, zIndexOffset: 1500 }).addTo(activeLeafletMap)
            .bindPopup(`<b>GL Bajaj Drop Zone</b><br/>${order.deliveryAddress || 'GL Bajaj Boys Hostel, Room 304'}`);

          // 3. Road Route Polylines
          const latlngs = routeWaypoints.map(pt => [pt.lat, pt.lng]);
          
          // Outer casing
          L.polyline(latlngs, {
            color: '#ffdbcf',
            weight: 12,
            opacity: 0.85,
            lineCap: 'round',
            lineJoin: 'round'
          }).addTo(activeLeafletMap);

          // Inner vibrant route line
          routePolyline = L.polyline(latlngs, {
            color: '#aa3700',
            weight: 6,
            dashArray: '10, 8',
            opacity: 0.95,
            lineCap: 'round',
            lineJoin: 'round'
          }).addTo(activeLeafletMap);

          // 4. Moving Delivery Partner (Bike) Marker
          const bikeIcon = L.divIcon({
            className: 'custom-map-icon',
            html: `
              <div class="flex flex-col items-center relative">
                <div class="relative">
                  <div class="w-14 h-14 bg-gradient-to-tr from-primary to-primary-container rounded-2xl flex items-center justify-center shadow-2xl text-white border-2 border-white ring-4 ring-primary/40">
                    <span class="material-symbols-outlined text-3xl filled">two_wheeler</span>
                  </div>
                  <div class="absolute -inset-2 bg-primary/40 rounded-2xl animate-ping pointer-events-none"></div>
                </div>
                <div class="bg-surface-container-lowest px-2.5 py-1 rounded-full shadow-2xl border-2 border-primary text-xs font-black text-on-surface flex items-center gap-1.5 whitespace-nowrap mt-1">
                  <span class="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
                  <span>Rahul (4.9 ★)</span>
                </div>
              </div>
            `,
            iconSize: [56, 80],
            iconAnchor: [28, 62]
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

      // 3. Fast-forward (2x / 3x)
      document.getElementById('sim-ff-btn')?.addEventListener('click', () => {
        simulationSpeed = simulationSpeed === 2600 ? 1100 : (simulationSpeed === 1100 ? 500 : 2600);
        const speedText = document.getElementById('sim-speed-text');
        if (speedText) speedText.textContent = simulationSpeed === 500 ? '3x' : (simulationSpeed === 1100 ? '2x' : '1x');
        if (isSimulating) startSimulation();
      });

      // 4. Replay from Kitchen (2.3 km)
      document.getElementById('sim-reset-btn')?.addEventListener('click', () => {
        stopSimulation();
        simulationIndex = 0;
        updateRiderPosition(0);
        fitBothInView();
        if (window.foodlyStore && window.foodlyStore.showToast) {
          window.foodlyStore.showToast('Replaying journey from Kitchen (2.3 km away)', 'info');
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
