// public/js/views/trackingView.js - Live Order Tracking Screen with Real Interactive GPS Map
(function () {
  let activeSSE = null;
  let activeLeafletMap = null;
  let riderMarker = null;
  let routePolyline = null;
  let simulationTimer = null;
  let simulationIndex = 0;
  let isSimulating = false;
  let simulationSpeed = 3000;

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
        lat: 28.4685,
        lng: 77.4940
      };

      // Waypoints along Knowledge Park III to GL Bajaj
      const routeWaypoints = [
        { lat: 28.4715, lng: 77.4915, name: order.restaurantName || "Kitchen", eta: 18, dist: "2.4 km", speed: 0, status: "confirmed", statusText: "Order packed in tamper-proof thermal box at kitchen" },
        { lat: 28.4700, lng: 77.4925, name: "Knowledge Park Circle", eta: 14, dist: "2.0 km", speed: 18, status: "preparing", statusText: "Rider Rahul picked up meal from kitchen counter" },
        { lat: 28.4685, lng: 77.4940, name: "Tech Hub Boulevard", eta: 10, dist: "1.5 km", speed: 32, status: "out_for_delivery", statusText: "Rahul is riding along Knowledge Park III main road" },
        { lat: 28.4665, lng: 77.4958, name: "GL Bajaj Academic Approach", eta: 6, dist: "0.9 km", speed: 28, status: "out_for_delivery", statusText: "Approaching GL Bajaj Main Academic Block Gate 2" },
        { lat: 28.4650, lng: 77.4974, name: "GL Bajaj Gate 2 Checkpost", eta: 2, dist: "0.3 km", speed: 15, status: "out_for_delivery", statusText: "Entering campus security gates with verified EV pass" },
        { lat: 28.4639, lng: 77.4988, name: order.deliveryAddress || "GL Bajaj Campus Drop Zone", eta: 0, dist: "0.0 km", speed: 0, status: "delivered", statusText: "Rahul arrived at your designated drop location! Enjoy your meal!" }
      ];

      simulationIndex = order.status === 'delivered' ? routeWaypoints.length - 1 : 2;

      container.innerHTML = `
        <div class="fade-in min-h-[calc(100vh-80px)] flex flex-col lg:flex-row">
          <!-- Left Side: Interactive GPS Map Viewport -->
          <section class="flex-1 relative bg-surface-container-low min-h-[460px] lg:min-h-full border-r border-surface-variant/50 overflow-hidden flex flex-col">
            
            <!-- Real Leaflet Map Container -->
            <div id="live-map-leaflet" class="w-full h-full min-h-[460px] lg:min-h-full z-0"></div>

            <!-- Top Floating GPS HUD Bar -->
            <div class="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
              <!-- Live Broadcast Badge -->
              <div class="pointer-events-auto bg-surface-container-lowest/90 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-lg border border-surface-variant flex items-center gap-2 text-xs font-extrabold text-on-surface">
                <span class="relative flex h-3 w-3">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
                <span>Live GPS Broadcast</span>
                <span class="text-secondary font-medium">&bull; GL Bajaj Campus Grid</span>
              </div>

              <!-- Speedometer & Telemetry -->
              <div class="pointer-events-auto bg-surface-container-lowest/90 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-lg border border-surface-variant flex items-center gap-3 text-xs font-bold text-on-surface">
                <div class="flex items-center gap-1 text-primary">
                  <span class="material-symbols-outlined text-base">speed</span>
                  <span id="hud-speed">28 km/h</span>
                </div>
                <span class="text-surface-variant">|</span>
                <div class="flex items-center gap-1 text-secondary">
                  <span class="material-symbols-outlined text-base">route</span>
                  <span id="hud-distance">1.4 km left</span>
                </div>
              </div>
            </div>

            <!-- Bottom Floating Map Controls & Simulation Bar -->
            <div class="absolute bottom-6 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
              <div class="pointer-events-auto bg-surface-container-lowest/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-surface-variant flex items-center gap-2">
                <button id="sim-play-btn" class="px-3 py-1.5 bg-primary text-white hover:bg-primary/90 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer active:scale-95">
                  <span class="material-symbols-outlined text-sm" id="sim-play-icon">play_arrow</span>
                  <span id="sim-play-text">Simulate Route</span>
                </button>
                <button id="sim-ff-btn" class="px-2.5 py-1.5 bg-surface-container-low hover:bg-surface-container border border-surface-variant text-on-surface rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer active:scale-95" title="Fast Forward">
                  <span class="material-symbols-outlined text-sm">fast_forward</span>
                  <span>2x Speed</span>
                </button>
                <button id="sim-reset-btn" class="px-2.5 py-1.5 bg-surface-container-low hover:bg-surface-container border border-surface-variant text-secondary hover:text-on-surface rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer" title="Reset Route">
                  <span class="material-symbols-outlined text-sm">restart_alt</span>
                </button>
              </div>

              <!-- Recenter Map Button -->
              <div class="pointer-events-auto">
                <button id="map-recenter-btn" class="bg-surface-container-lowest hover:bg-surface-container-low text-primary border border-surface-variant shadow-lg px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95">
                  <span class="material-symbols-outlined text-base">my_location</span>
                  <span>Center on Rider</span>
                </button>
              </div>
            </div>
          </section>

          <!-- Right Side: Order Status & Timeline (Canonically styled) -->
          <section class="w-full lg:w-[480px] xl:w-[520px] bg-surface-container-lowest min-h-full overflow-y-auto shrink-0 flex flex-col shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.06)] z-30">
            <!-- Header Sticky -->
            <div class="sticky top-0 bg-surface-container-lowest/95 backdrop-blur-md z-30 p-6 md:p-8 border-b border-surface-variant/50">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <span class="px-3 py-1 bg-surface-container text-primary font-extrabold text-xs rounded-full">
                    Order #${order.id}
                  </span>
                  <span class="w-1.5 h-1.5 rounded-full bg-surface-variant"></span>
                  <span class="text-xs font-semibold text-secondary truncate max-w-[160px]">${order.restaurantName}</span>
                </div>
                <span class="bg-tertiary/10 text-tertiary text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <span class="material-symbols-outlined text-xs filled">bolt</span> Batch Eco Drop
                </span>
              </div>

              <h1 id="tracking-heading" class="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight">
                ${order.status === 'delivered' ? 'Order Delivered!' : `Arriving in ${order.estimatedDelivery || '6 mins'}`}
              </h1>
              <p id="tracking-subheading" class="text-xs md:text-sm text-on-surface-variant mt-1.5 font-medium leading-relaxed">
                ${order.statusText || 'Rider is on the way to GL Bajaj Campus Drop Zone'}
              </p>
            </div>

            <!-- Content Area -->
            <div class="p-6 md:p-8 flex-1 flex flex-col gap-6">
              <!-- Driver Card -->
              <div class="bg-surface-container-low rounded-2xl p-4 flex items-center justify-between border border-surface-variant/50 shadow-sm">
                <div class="flex items-center gap-3.5">
                  <div class="relative">
                    <div class="w-14 h-14 rounded-full bg-surface-variant overflow-hidden border-2 border-white shadow-sm">
                      <img class="w-full h-full object-cover" src="${driver.photo}" alt="${driver.name}"/>
                    </div>
                    <div class="absolute -bottom-1 -right-1 bg-tertiary text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-md flex items-center shadow-sm">
                      ${driver.rating} <span class="material-symbols-outlined text-[10px] ml-0.5 filled">star</span>
                    </div>
                  </div>
                  <div>
                    <div class="flex items-center gap-1.5">
                      <h4 class="font-extrabold text-sm text-on-surface">${driver.name}</h4>
                      <span class="material-symbols-outlined text-tertiary text-sm filled" title="Verified Driver">verified</span>
                    </div>
                    <p class="text-xs text-secondary font-medium">${driver.vehicle}</p>
                    <p class="text-[11px] text-tertiary font-bold">${driver.deliveriesCount} successful drops</p>
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <button id="driver-call-btn" class="w-10 h-10 rounded-full bg-surface-container-lowest border border-surface-variant hover:border-primary text-primary flex items-center justify-center transition-colors shadow-sm cursor-pointer" title="Call Driver">
                    <span class="material-symbols-outlined text-lg">call</span>
                  </button>
                  <button id="driver-msg-btn" class="w-10 h-10 rounded-full bg-surface-container-lowest border border-surface-variant hover:border-primary text-primary flex items-center justify-center transition-colors shadow-sm cursor-pointer" title="Message Driver">
                    <span class="material-symbols-outlined text-lg">chat</span>
                  </button>
                </div>
              </div>

              <!-- Campus Delivery Target Card -->
              <div class="p-3.5 rounded-xl border border-primary/20 bg-primary/5 flex items-start gap-3">
                <span class="material-symbols-outlined text-primary text-xl mt-0.5">location_on</span>
                <div class="text-xs">
                  <span class="font-bold text-on-surface block">Delivery Target:</span>
                  <span class="text-secondary leading-relaxed">${order.deliveryAddress || 'GL Bajaj Boys Hostel, Room 304, Knowledge Park III, Greater Noida'}</span>
                </div>
              </div>

              <!-- Live Progress Stepper Timeline -->
              <div class="flex flex-col gap-5 py-2" id="tracking-timeline">
                <!-- Step 1: Order Placed -->
                <div class="timeline-item completed flex gap-4 items-start">
                  <div class="w-10 h-10 rounded-full bg-primary-container text-white flex items-center justify-center shrink-0 shadow-sm z-10">
                    <span class="material-symbols-outlined text-lg filled">receipt_long</span>
                  </div>
                  <div>
                    <h5 class="text-sm font-extrabold text-on-surface">Order Placed</h5>
                    <p class="text-xs text-secondary">Transmitted to kitchen in Knowledge Park III</p>
                  </div>
                </div>

                <!-- Step 2: Confirmed -->
                <div id="step-confirmed" class="timeline-item ${order.status !== 'placed' ? 'completed' : ''} flex gap-4 items-start">
                  <div class="w-10 h-10 rounded-full ${order.status !== 'placed' ? 'bg-primary-container text-white' : 'bg-surface-container text-secondary'} flex items-center justify-center shrink-0 shadow-sm z-10 transition-colors">
                    <span class="material-symbols-outlined text-lg filled">check_circle</span>
                  </div>
                  <div>
                    <h5 class="text-sm font-extrabold text-on-surface">Restaurant Accepted</h5>
                    <p class="text-xs text-secondary">${order.restaurantName} confirmed receipt</p>
                  </div>
                </div>

                <!-- Step 3: Kitchen Preparing -->
                <div id="step-preparing" class="timeline-item ${order.status === 'preparing' || order.status === 'out_for_delivery' || order.status === 'delivered' ? 'completed' : ''} flex gap-4 items-start">
                  <div class="w-10 h-10 rounded-full ${order.status === 'preparing' || order.status === 'out_for_delivery' || order.status === 'delivered' ? 'bg-primary-container text-white' : 'bg-surface-container text-secondary'} flex items-center justify-center shrink-0 shadow-sm z-10 transition-colors">
                    <span class="material-symbols-outlined text-lg filled">skillet</span>
                  </div>
                  <div>
                    <h5 class="text-sm font-extrabold text-on-surface">Food Cooking in Kitchen</h5>
                    <p class="text-xs text-secondary">Chef is hand-crafting and packing your items</p>
                  </div>
                </div>

                <!-- Step 4: Out for Delivery -->
                <div id="step-delivery" class="timeline-item ${order.status === 'out_for_delivery' || order.status === 'delivered' ? 'completed' : ''} flex gap-4 items-start">
                  <div class="w-10 h-10 rounded-full ${order.status === 'out_for_delivery' || order.status === 'delivered' ? 'bg-primary-container text-white' : 'bg-surface-container text-secondary'} flex items-center justify-center shrink-0 shadow-sm z-10 transition-colors">
                    <span class="material-symbols-outlined text-lg filled">electric_moped</span>
                  </div>
                  <div>
                    <h5 class="text-sm font-extrabold text-on-surface">Out for Delivery (EV Fleet)</h5>
                    <p class="text-xs text-secondary">Rahul is riding his EV scooter to GL Bajaj</p>
                  </div>
                </div>

                <!-- Step 5: Delivered -->
                <div id="step-delivered" class="timeline-item ${order.status === 'delivered' ? 'completed' : ''} flex gap-4 items-start">
                  <div class="w-10 h-10 rounded-full ${order.status === 'delivered' ? 'bg-tertiary text-white' : 'bg-surface-container text-secondary'} flex items-center justify-center shrink-0 shadow-sm z-10 transition-colors">
                    <span class="material-symbols-outlined text-lg filled">home</span>
                  </div>
                  <div>
                    <h5 class="text-sm font-extrabold text-on-surface">Delivered at Campus</h5>
                    <p class="text-xs text-secondary">Enjoy your fresh and delicious meal!</p>
                  </div>
                </div>
              </div>

              <!-- Order Summary Receipt -->
              <div class="p-4 rounded-2xl bg-surface-container-low border border-surface-variant/60 text-xs">
                <h4 class="font-bold text-sm text-on-surface mb-3 flex items-center justify-between">
                  <span>Order Receipt</span>
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
                <div class="pt-2 border-t border-surface-variant/80 flex justify-between items-center font-extrabold text-sm text-on-surface">
                  <span>Total Amount</span>
                  <span class="text-primary text-base">₹${(order.bill ? order.bill.total : 230).toFixed(0)}</span>
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

        // Ensure Leaflet is loaded
        if (typeof L === 'undefined') {
          console.warn("Leaflet library not ready yet, retrying in 300ms...");
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

          // Sleek CartoDB Voyager Map Tiles
          L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            maxZoom: 19,
            subdomains: 'abcd'
          }).addTo(activeLeafletMap);

          // Add Zoom controls in clean bottom-right spot
          L.control.zoom({ position: 'topright' }).addTo(activeLeafletMap);

          // 1. Restaurant Origin Marker
          const restPt = routeWaypoints[0];
          const restIcon = L.divIcon({
            className: 'custom-map-icon',
            html: `
              <div class="flex flex-col items-center">
                <div class="w-10 h-10 bg-surface-container-lowest rounded-full border-2 border-primary shadow-xl flex items-center justify-center text-primary">
                  <span class="material-symbols-outlined text-xl">restaurant</span>
                </div>
                <div class="bg-surface-container-lowest text-[10px] font-extrabold px-2 py-0.5 rounded shadow border border-surface-variant text-on-surface whitespace-nowrap mt-1">
                  ${order.restaurantName || 'Kitchen'}
                </div>
              </div>
            `,
            iconSize: [40, 55],
            iconAnchor: [20, 50]
          });
          L.marker([restPt.lat, restPt.lng], { icon: restIcon }).addTo(activeLeafletMap)
            .bindPopup(`<b>${order.restaurantName || 'Campus Kitchen'}</b><br/>Order prepared and dispatched`);

          // 2. Customer Destination Marker
          const destPt = routeWaypoints[routeWaypoints.length - 1];
          const destIcon = L.divIcon({
            className: 'custom-map-icon',
            html: `
              <div class="flex flex-col items-center">
                <div class="w-11 h-11 bg-primary text-white rounded-full border-2 border-white shadow-2xl flex items-center justify-center ring-4 ring-primary/20">
                  <span class="material-symbols-outlined text-xl filled">home_pin</span>
                </div>
                <div class="bg-surface-container-lowest text-[10px] font-extrabold px-2 py-0.5 rounded shadow border border-surface-variant text-primary whitespace-nowrap mt-1">
                  Campus Drop Zone
                </div>
              </div>
            `,
            iconSize: [44, 60],
            iconAnchor: [22, 55]
          });
          L.marker([destPt.lat, destPt.lng], { icon: destIcon }).addTo(activeLeafletMap)
            .bindPopup(`<b>Delivery Address</b><br/>${order.deliveryAddress || 'GL Bajaj Campus Drop Zone'}`);

          // 3. Polyline Road Route
          const latlngs = routeWaypoints.map(pt => [pt.lat, pt.lng]);
          
          // Outer glow line
          L.polyline(latlngs, {
            color: '#ffb59b',
            weight: 8,
            opacity: 0.6,
            lineCap: 'round',
            lineJoin: 'round'
          }).addTo(activeLeafletMap);

          // Inner dash line
          routePolyline = L.polyline(latlngs, {
            color: '#aa3700',
            weight: 4,
            dashArray: '8, 8',
            opacity: 0.95
          }).addTo(activeLeafletMap);

          // 4. Moving Delivery Partner (Bike) Marker
          const bikeIcon = L.divIcon({
            className: 'custom-map-icon',
            html: `
              <div class="flex flex-col items-center">
                <div class="relative">
                  <div class="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-2xl text-white border-2 border-white ring-4 ring-primary/30">
                    <span class="material-symbols-outlined text-2xl filled">two_wheeler</span>
                  </div>
                  <div class="absolute inset-0 bg-primary/40 rounded-full animate-ping pointer-events-none"></div>
                </div>
                <div class="bg-surface-container-lowest px-2.5 py-1 rounded-full shadow-lg border border-primary/40 text-xs font-extrabold text-on-surface flex items-center gap-1.5 whitespace-nowrap mt-1">
                  <span class="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
                  <span id="rider-badge-text">${driver.name.split(' ')[0]} (EV Bike)</span>
                </div>
              </div>
            `,
            iconSize: [48, 70],
            iconAnchor: [24, 58]
          });

          riderMarker = L.marker([startPt.lat, startPt.lng], { icon: bikeIcon, zIndexOffset: 1000 }).addTo(activeLeafletMap);

          // Fit route nicely into view
          activeLeafletMap.fitBounds(L.latLngBounds(latlngs), { padding: [60, 60] });

        } catch (err) {
          console.error("Leaflet map initialization error:", err);
        }
      }

      // Initialize map on next frame
      setTimeout(initializeMap, 100);

      // ── Simulation Engine ────────────────────────────────────────────────────
      function updateRiderPosition(index) {
        if (index < 0 || index >= routeWaypoints.length) return;
        simulationIndex = index;
        const pt = routeWaypoints[index];

        // Update Rider Marker on Leaflet
        if (riderMarker && activeLeafletMap) {
          riderMarker.setLatLng([pt.lat, pt.lng]);
          activeLeafletMap.panTo([pt.lat, pt.lng], { animate: true, duration: 1 });
        }

        // Update Telemetry HUD
        const hudSpeed = document.getElementById('hud-speed');
        const hudDist = document.getElementById('hud-distance');
        if (hudSpeed) hudSpeed.textContent = `${pt.speed} km/h`;
        if (hudDist) hudDist.textContent = `${pt.dist} left`;

        // Update Headings
        const heading = document.getElementById('tracking-heading');
        const subheading = document.getElementById('tracking-subheading');
        if (heading) {
          heading.textContent = pt.status === 'delivered' ? 'Order Delivered!' : `Arriving in ${pt.eta} mins`;
        }
        if (subheading) {
          subheading.textContent = pt.statusText;
        }

        // Update Stepper Timeline
        updateTimelineStage(pt.status);

        if (pt.status === 'delivered') {
          stopSimulation();
          if (window.foodlyStore && window.foodlyStore.playSound) {
            window.foodlyStore.playSound('cash');
          }
          if (window.foodlyStore && window.foodlyStore.showToast) {
            window.foodlyStore.showToast('🎉 Your meal has been delivered! Enjoy hot!', 'success');
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
        if (playText) playText.textContent = isSimulating ? 'Pause' : 'Simulate Route';
      }

      // Timeline Stage Highlighter
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
          conf.classList.toggle('completed', isAtLeast('confirmed'));
          const dot = conf.querySelector('div');
          if (isAtLeast('confirmed')) {
            dot?.classList.replace('bg-surface-container', 'bg-primary-container');
            dot?.classList.replace('text-secondary', 'text-white');
          }
        }
        if (prep) {
          prep.classList.toggle('completed', isAtLeast('preparing'));
          const dot = prep.querySelector('div');
          if (isAtLeast('preparing')) {
            dot?.classList.replace('bg-surface-container', 'bg-primary-container');
            dot?.classList.replace('text-secondary', 'text-white');
          }
        }
        if (deliv) {
          deliv.classList.toggle('completed', isAtLeast('out_for_delivery'));
          const dot = deliv.querySelector('div');
          if (isAtLeast('out_for_delivery')) {
            dot?.classList.replace('bg-surface-container', 'bg-primary-container');
            dot?.classList.replace('text-secondary', 'text-white');
          }
        }
        if (done) {
          done.classList.toggle('completed', isAtLeast('delivered'));
          const dot = done.querySelector('div');
          if (isAtLeast('delivered')) {
            dot?.classList.replace('bg-surface-container', 'bg-tertiary');
            dot?.classList.replace('text-secondary', 'text-white');
          }
        }
      }

      // ── Event Handlers ────────────────────────────────────────────────────────

      // Play / Pause Simulation
      document.getElementById('sim-play-btn')?.addEventListener('click', () => {
        if (isSimulating) {
          stopSimulation();
        } else {
          startSimulation();
        }
      });

      // Fast-forward (2x speed)
      document.getElementById('sim-ff-btn')?.addEventListener('click', () => {
        simulationSpeed = simulationSpeed === 3000 ? 1200 : 3000;
        const ffText = document.getElementById('sim-ff-btn')?.querySelector('span:last-child');
        if (ffText) ffText.textContent = simulationSpeed === 1200 ? 'Normal Speed' : '2x Speed';
        if (isSimulating) {
          startSimulation();
        }
      });

      // Reset Simulation
      document.getElementById('sim-reset-btn')?.addEventListener('click', () => {
        stopSimulation();
        simulationIndex = 0;
        updateRiderPosition(0);
        if (window.foodlyStore && window.foodlyStore.showToast) {
          window.foodlyStore.showToast('Rider reset to kitchen dispatch point', 'info');
        }
      });

      // Recenter on Rider
      document.getElementById('map-recenter-btn')?.addEventListener('click', () => {
        if (activeLeafletMap && routeWaypoints[simulationIndex]) {
          const pt = routeWaypoints[simulationIndex];
          activeLeafletMap.panTo([pt.lat, pt.lng], { animate: true });
        }
      });

      // Call Driver Button
      document.getElementById('driver-call-btn')?.addEventListener('click', () => {
        alert(`Connecting call to delivery partner Rahul (${driver.phone})...\nVehicle: ${driver.vehicle}`);
      });

      // Message Driver Button
      document.getElementById('driver-msg-btn')?.addEventListener('click', () => {
        const msg = prompt("Send a quick message to Rahul (e.g., 'Waiting at hostel reception' or 'Leave at Gate 2 security'):", "I am waiting at the hostel entrance.");
        if (msg) {
          if (window.foodlyStore && window.foodlyStore.showToast) {
            window.foodlyStore.showToast(`Message sent to Rahul: "${msg}"`, 'success');
          }
        }
      });

      // Auto-start live movement if order is actively out for delivery
      if (order.status !== 'delivered') {
        setTimeout(startSimulation, 1200);
      }

    } catch (e) {
      console.error("Error loading order tracking", e);
      container.innerHTML = `
        <div class="py-20 text-center max-w-md mx-auto px-4">
          <span class="material-symbols-outlined text-4xl text-error mb-2">error</span>
          <h3 class="text-lg font-bold text-on-surface mb-1">Could not load live tracking</h3>
          <p class="text-xs text-secondary mb-4">Please return to your orders history and select an active order.</p>
          <a href="#orders" class="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold inline-block">View Orders</a>
        </div>
      `;
    }
  }

  window.renderTrackingView = renderTrackingView;
})();
