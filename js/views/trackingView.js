// public/js/views/trackingView.js - Live Order Tracking Screen (1:1 Stitch UI Replication)
(function () {
  let activeSSE = null;

  async function renderTrackingView(container, orderId) {
    if (activeSSE) {
      activeSSE.close();
      activeSSE = null;
    }

    container.innerHTML = `
      <div class="py-20 flex justify-center items-center text-secondary">
        <span class="material-symbols-outlined text-4xl animate-spin text-primary mr-2">progress_activity</span>
        <span class="font-bold text-sm">Connecting to live delivery tracking...</span>
      </div>
    `;

    try {
      const res = await window.foodlyApi.getOrder(orderId);
      if (!res.success) {
        container.innerHTML = `<div class="p-8 text-center text-error">Order not found</div>`;
        return;
      }

      const order = res.data;
      const driver = order.driver;

      container.innerHTML = `
        <div class="fade-in min-h-[calc(100vh-80px)] flex flex-col md:flex-row">
          <!-- Left Side: Interactive Map (Direct from Stitch foodly-order-tracking.html) -->
          <section class="flex-1 relative bg-surface-container-low min-h-[420px] md:min-h-full border-r border-surface-variant/50 overflow-hidden">
            <!-- Simulated Map Image Location -->
            <img 
              class="w-full h-full object-cover grayscale opacity-85 mix-blend-multiply select-none" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIbPVXQx0JfimIThXqfc34s0Pn8QDJN3KmoIVZZAczOgAdDeiMVD4iKZgfXGlasB4iFrGFVrDFO9SrmAaVfn5q7h7GoVDxcER9RwNrFy90zcuYNn-fcnCkIOz5jyc3xpHRBDwyGp5t-XF081SLXxZBaJJtk2T-wvXc4zpWh-v5Bnc_cII4gPuJQs1a4eCK5V9mFGjqXjmojfPnlI6RcD6--Aa06YFYN093MB4jfDD4tXavZsTYno3n" 
              alt="Map view"
            />
            
            <!-- Map Overlays -->
            <div class="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/30 to-transparent pointer-events-none"></div>

            <!-- Delivery Partner Marker (Moving bike pin) -->
            <div 
              id="rider-marker" 
              class="absolute transition-all duration-1000 ease-linear flex flex-col items-center z-20"
              style="top: 50%; left: 50%; transform: translate(-50%, -50%);"
            >
              <div class="relative">
                <div class="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-2xl relative z-10 border-2 border-white ring-4 ring-primary/20">
                  <span class="material-symbols-outlined text-white text-2xl filled">directions_bike</span>
                </div>
                <div class="absolute inset-0 bg-primary/40 rounded-full pulse-ring -z-10"></div>
              </div>
              <div class="mt-2 bg-surface-container-lowest px-3 py-1 rounded-full shadow-lg border border-surface-variant text-xs text-on-surface font-extrabold flex items-center gap-1.5 whitespace-nowrap">
                <span class="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
                <span id="rider-badge-text">${driver.name.split(' ')[0]} is on the way</span>
              </div>
            </div>

            <!-- Destination Marker (Home) -->
            <div class="absolute top-[38%] left-[72%] flex flex-col items-center z-10">
              <div class="w-10 h-10 bg-surface-container-lowest rounded-full flex items-center justify-center shadow-lg border-2 border-primary">
                <span class="material-symbols-outlined text-primary text-xl filled">home</span>
              </div>
              <div class="mt-1 bg-surface-container-lowest px-2.5 py-0.5 rounded-full shadow-sm border border-surface-variant text-[11px] font-bold text-on-surface">
                Delivery Location
              </div>
            </div>

            <!-- Route Line (Decorative SVG dashed curve) -->
            <svg class="absolute top-0 left-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
              <path 
                id="route-path" 
                class="route-dash-animated opacity-70" 
                d="M 50% 50% Q 62% 44% 72% 38%" 
                fill="none" 
                stroke="#FF5E18" 
                stroke-width="5"
              />
            </svg>

            <!-- Map Controls overlay -->
            <div class="absolute top-4 left-4 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-surface-variant flex items-center gap-2 text-xs font-bold text-secondary">
              <span class="material-symbols-outlined text-primary text-sm filled">near_me</span>
              <span>Live GPS Broadcast</span>
            </div>
          </section>

          <!-- Right Side: Order Status & Timeline (Direct from Stitch foodly-order-tracking.html) -->
          <section class="w-full md:w-[480px] lg:w-[520px] bg-surface-container-lowest h-full overflow-y-auto shrink-0 flex flex-col shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.06)] z-30">
            <!-- Header Sticky -->
            <div class="sticky top-0 bg-surface-container-lowest/95 backdrop-blur-md z-30 p-6 md:p-8 border-b border-surface-variant/50">
              <div class="flex items-center gap-2.5 mb-2">
                <span class="px-3 py-1 bg-surface-container text-primary font-extrabold text-xs rounded-full">
                  Order #${order.id}
                </span>
                <span class="w-1.5 h-1.5 rounded-full bg-surface-variant"></span>
                <span class="text-xs font-semibold text-secondary">${order.restaurantName}</span>
              </div>
              <h1 id="tracking-heading" class="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight">
                ${order.status === 'delivered' ? 'Order Delivered!' : `Arriving in ${order.estimatedDelivery}`}
              </h1>
              <p id="tracking-subheading" class="text-xs md:text-sm text-on-surface-variant mt-1.5 font-medium">
                ${order.statusText}
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
                    <h4 class="font-extrabold text-sm text-on-surface">${driver.name}</h4>
                    <p class="text-xs text-secondary font-medium">${driver.vehicle}</p>
                    <p class="text-[11px] text-tertiary font-bold">${driver.deliveriesCount} successful drops</p>
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <button onclick="alert('Calling delivery partner Rahul at ${driver.phone}...')" class="w-10 h-10 rounded-full bg-surface-container-lowest border border-surface-variant hover:border-primary text-primary flex items-center justify-center transition-colors shadow-sm cursor-pointer" title="Call Driver">
                    <span class="material-symbols-outlined text-lg">call</span>
                  </button>
                  <button onclick="prompt('Send a quick message to Rahul:', 'I am waiting by the entrance lobby.')" class="w-10 h-10 rounded-full bg-surface-container-lowest border border-surface-variant hover:border-primary text-primary flex items-center justify-center transition-colors shadow-sm cursor-pointer" title="Message Driver">
                    <span class="material-symbols-outlined text-lg">chat</span>
                  </button>
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
                    <p class="text-xs text-secondary">Your order has been transmitted to the kitchen</p>
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
                    <h5 class="text-sm font-extrabold text-on-surface">Out for Delivery</h5>
                    <p class="text-xs text-secondary">Rahul is zipping across town on his scooter</p>
                  </div>
                </div>

                <!-- Step 5: Delivered -->
                <div id="step-delivered" class="timeline-item ${order.status === 'delivered' ? 'completed' : ''} flex gap-4 items-start">
                  <div class="w-10 h-10 rounded-full ${order.status === 'delivered' ? 'bg-tertiary text-white' : 'bg-surface-container text-secondary'} flex items-center justify-center shrink-0 shadow-sm z-10 transition-colors">
                    <span class="material-symbols-outlined text-lg filled">home</span>
                  </div>
                  <div>
                    <h5 class="text-sm font-extrabold text-on-surface">Delivered</h5>
                    <p class="text-xs text-secondary">Enjoy your piping hot meal!</p>
                  </div>
                </div>
              </div>

              <!-- Order Summary Receipt -->
              <div class="p-4 rounded-2xl bg-surface-container-low border border-surface-variant/60 text-xs">
                <h4 class="font-bold text-sm text-on-surface mb-3 flex items-center justify-between">
                  <span>Order Receipt</span>
                  <span class="text-secondary font-medium">${order.paymentMethod}</span>
                </h4>
                <div class="flex flex-col gap-2 mb-3">
                  ${order.items.map(item => `
                    <div class="flex justify-between items-center text-on-surface">
                      <span>${item.quantity}x ${item.name}</span>
                      <span class="font-bold">&#8377;${(item.price * item.quantity).toFixed(0)}</span>
                    </div>
                  `).join('')}
                </div>
                <div class="pt-2 border-t border-surface-variant/80 flex justify-between items-center font-extrabold text-sm text-on-surface">
                  <span>Total Paid</span>
                  <span class="text-primary text-base">&#8377;${order.bill.total.toFixed(0)}</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      `;

      // Connect to Live SSE Tracking Stream
      activeSSE = window.foodlyApi.connectLiveTracking(orderId, (event) => {
        const heading = document.getElementById('tracking-heading');
        const subheading = document.getElementById('tracking-subheading');
        const riderMarker = document.getElementById('rider-marker');
        const badgeText = document.getElementById('rider-badge-text');

        if (event.type === 'STATUS_UPDATE') {
          if (subheading) subheading.innerText = event.statusText;
          updateTimelineStage(event.status);
        } else if (event.type === 'DRIVER_MOVE') {
          if (heading) heading.innerText = `Arriving in ${event.remainingMinutes} min`;
          if (badgeText) badgeText.innerText = event.driverEtaText;
          if (riderMarker) {
            riderMarker.style.left = `${event.driverX}%`;
            riderMarker.style.top = `${event.driverY}%`;
          }
          updateTimelineStage('out_for_delivery');
        } else if (event.type === 'DELIVERED') {
          if (heading) heading.innerText = 'Order Delivered!';
          if (subheading) subheading.innerText = 'Rahul has arrived. Enjoy your meal!';
          if (riderMarker) {
            riderMarker.style.left = '72%';
            riderMarker.style.top = '38%';
          }
          if (badgeText) badgeText.innerText = 'Delivered!';
          updateTimelineStage('delivered');
          window.foodlyStore.showToast('Your meal has arrived! Enjoy!', 'success');
        }
      });

      function updateTimelineStage(status) {
        const conf = document.getElementById('step-confirmed');
        const prep = document.getElementById('step-preparing');
        const deliv = document.getElementById('step-delivery');
        const done = document.getElementById('step-delivered');

        if (status === 'confirmed' || status === 'preparing' || status === 'out_for_delivery' || status === 'delivered') {
          conf?.classList.add('completed');
          conf?.querySelector('div')?.classList.replace('bg-surface-container', 'bg-primary-container');
          conf?.querySelector('div')?.classList.replace('text-secondary', 'text-white');
        }
        if (status === 'preparing' || status === 'out_for_delivery' || status === 'delivered') {
          prep?.classList.add('completed');
          prep?.querySelector('div')?.classList.replace('bg-surface-container', 'bg-primary-container');
          prep?.querySelector('div')?.classList.replace('text-secondary', 'text-white');
        }
        if (status === 'out_for_delivery' || status === 'delivered') {
          deliv?.classList.add('completed');
          deliv?.querySelector('div')?.classList.replace('bg-surface-container', 'bg-primary-container');
          deliv?.querySelector('div')?.classList.replace('text-secondary', 'text-white');
        }
        if (status === 'delivered') {
          done?.classList.add('completed');
          done?.querySelector('div')?.classList.replace('bg-surface-container', 'bg-tertiary');
          done?.querySelector('div')?.classList.replace('text-secondary', 'text-white');
        }
      }
    } catch (e) {
      console.error("Error loading order tracking", e);
    }
  }

  window.renderTrackingView = renderTrackingView;
})();
