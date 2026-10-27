// js/components/navbar.js - Swiggy & Zomato Authentic Mobile & Desktop Navbar
(function () {
  // Common GL Bajaj Campus delivery hotspots
  const CAMPUS_LOCATIONS = [
    { title: 'GL Bajaj Boys Hostel', sub: 'Room 304, Block B, Knowledge Park III', tag: 'Hostel' },
    { title: 'GL Bajaj Girls Hostel', sub: 'Block A, Gate 1, Knowledge Park III', tag: 'Hostel' },
    { title: 'GL Bajaj Central Library & Admin', sub: 'Ground Floor Foyer, Knowledge Park III', tag: 'Campus' },
    { title: 'GL Bajaj Gate 2 Plaza', sub: 'Near Main Security Post & Food Carts', tag: 'Campus' },
    { title: 'Pari Chowk Metro Station', sub: 'Greater Noida Express Gate', tag: 'Metro' }
  ];

  function updateMobileBottomNav(currentHash) {
    const navHome = document.getElementById('mob-nav-home');
    const navDining = document.getElementById('mob-nav-dining');
    const navOrders = document.getElementById('mob-nav-orders');
    const navProfile = document.getElementById('mob-nav-profile');

    const resetClass = 'flex flex-col items-center gap-0.5 text-[10px] font-bold text-secondary hover:text-primary transition-colors';
    const activeClass = 'flex flex-col items-center gap-0.5 text-[10px] font-black text-primary transition-colors';

    if (navHome) navHome.className = (currentHash === '#home' || currentHash === '' || currentHash.startsWith('#restaurant')) ? activeClass : resetClass;
    if (navDining) navDining.className = currentHash.startsWith('#search') ? activeClass : resetClass;
    if (navOrders) navOrders.className = (currentHash.startsWith('#orders') || currentHash.startsWith('#track')) ? activeClass : resetClass;
    if (navProfile) navProfile.className = (currentHash === '#profile' || currentHash === '#settings') ? activeClass : resetClass;
  }

  function updateMobileFloatingCart() {
    try {
      const cartBar = document.getElementById('mobile-floating-cart-bar');
      if (!cartBar) return;

      const store = window.foodlyStore;
      const currentHash = window.location.hash || '#home';

      // Hide if cart is empty or user is already on checkout
      if (!store || !store.getCartCount || store.getCartCount() === 0 || currentHash === '#checkout') {
        cartBar.classList.add('hidden');
        return;
      }

      const count = store.getCartCount();
      let total = 0;
      if (typeof store.getCartTotal === 'function') {
        total = store.getCartTotal();
      } else if (typeof store.getBillDetails === 'function') {
        const b = store.getBillDetails();
        total = b ? b.total : 0;
      } else if (store.cart && store.cart.items) {
        total = store.cart.items.reduce((s, i) => s + ((i.price || 0) * (i.quantity || 1)), 0);
      }
      const safeTotal = typeof total === 'number' && !isNaN(total) ? total : 0;
      const items = (store.cart && store.cart.items) ? store.cart.items : [];
      const restName = (items[0] && items[0].restaurantName) ? items[0].restaurantName : 'GL Bajaj Campus Express';

      const countBadge = document.getElementById('mobile-cart-count-badge');
      const totalText = document.getElementById('mobile-cart-total-text');
      const subText = document.getElementById('mobile-cart-rest-sub');

      if (countBadge) countBadge.innerText = count;
      if (totalText) totalText.innerText = `₹${safeTotal.toFixed(0)}`;
      if (subText) subText.innerText = restName;

      cartBar.classList.remove('hidden');
    } catch (e) {
      console.warn('updateMobileFloatingCart safe error caught:', e);
    }
  }

  function renderNavbar() {
    const container = document.getElementById('navbar-container');
    if (!container) return;

    const store = window.foodlyStore;
    const cartCount = store ? store.getCartCount() : 0;
    const currentHash = window.location.hash || '#home';
    const activeAddress = store ? (store.activeAddress || 'GL Bajaj Boys Hostel, Rm 304') : 'GL Bajaj Boys Hostel';

    const isBrowseActive = currentHash === '#home' || currentHash.startsWith('#search') || currentHash.startsWith('#restaurant');
    const isOffersActive = currentHash === '#offers';
    const isOrdersActive = currentHash.startsWith('#orders') || currentHash.startsWith('#track');
    const isHelpActive = currentHash === '#help';

    container.innerHTML = `
      <!-- Desktop & Mobile Top Navigation Bar -->
      <div class="bg-surface-container-lowest/95 backdrop-blur-md font-body-md text-body-md shadow-sm fixed top-0 w-full z-50 border-b border-surface-variant/40">
        
        <!-- Desktop Layout (md:flex) -->
        <div class="hidden md:flex justify-between items-center h-20 px-margin-desktop max-w-container-max mx-auto">
          <!-- Brand Logo with Starting Animation Replay -->
          <a href="#home" class="flex items-center gap-2 cursor-pointer group active:scale-95 transition-transform" title="Foodly — Fast Fresh Food, Delivered">
            <img src="./images/foodly-logo.png" alt="Foodly Logo" class="foodly-nav-logo h-12 w-auto object-contain drop-shadow-sm"/>
          </a>

          <!-- Location Selector on Desktop -->
          <button id="nav-location-picker-btn" class="flex items-center gap-1.5 text-xs font-bold text-on-surface hover:text-primary transition-colors cursor-pointer max-w-[280px] truncate bg-surface-container-low px-3 py-1.5 rounded-full border border-surface-variant/50">
            <span class="material-symbols-outlined text-sm text-primary filled">location_on</span>
            <span class="truncate">${activeAddress}</span>
            <span class="material-symbols-outlined text-xs text-secondary">expand_more</span>
          </button>

          <!-- Navigation Links -->
          <nav class="flex gap-gutter items-center">
            <a class="${isBrowseActive ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary'} cursor-pointer active:scale-95 transition-colors duration-200" href="#home">Delivery</a>
            <a class="${(currentHash === '#dining' || currentHash.startsWith('#search')) ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary'} cursor-pointer active:scale-95 transition-colors duration-200" href="#dining">Dining Out</a>
            <a class="${isOffersActive ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary'} transition-colors duration-200 cursor-pointer active:scale-95" href="#offers">Offers</a>
            <a class="${isOrdersActive ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary'} transition-colors duration-200 cursor-pointer active:scale-95" href="#orders">Orders</a>
            <a class="${isHelpActive ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary'} transition-colors duration-200 cursor-pointer active:scale-95" href="#help">Help</a>
          </nav>

          <!-- Actions -->
          <div class="flex items-center gap-stack-md text-primary">
            <a href="#search" class="p-2 rounded-full hover:bg-surface-container-low transition-colors duration-200 cursor-pointer active:scale-95" title="Search Dishes & Restros">
              <span class="material-symbols-outlined">search</span>
            </a>
            <button id="nav-cart-btn" class="p-2 rounded-full hover:bg-surface-container-low transition-colors duration-200 cursor-pointer active:scale-95 relative" title="View Cart">
              <span class="material-symbols-outlined">shopping_cart</span>
              <span class="absolute top-1 right-1 bg-primary-container text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">${cartCount}</span>
            </button>
            <a href="#profile" class="p-2 rounded-full hover:bg-surface-container-low transition-colors duration-200 cursor-pointer active:scale-95 ${currentHash === '#profile' ? 'bg-surface-container-low text-primary font-bold' : ''}" title="Profile">
              <span class="material-symbols-outlined">person</span>
            </a>
            <a href="#settings" class="p-2 rounded-full hover:bg-surface-container-low transition-colors duration-200 cursor-pointer active:scale-95 ${currentHash === '#settings' ? 'bg-surface-container-low text-primary font-bold' : ''}" title="Settings">
              <span class="material-symbols-outlined">settings</span>
            </a>
          </div>
        </div>

        <!-- Mobile Layout: Authentic Swiggy / Zomato Top Bar (md:hidden) -->
        <div class="flex md:hidden items-center justify-between h-16 px-3">
          <!-- Left: Brand Logo & Swiggy/Zomato Location Switcher -->
          <div class="flex items-center gap-2 max-w-[68%]">
            <a href="#home" class="shrink-0 active:scale-95 transition-transform" title="Foodly">
              <img src="./images/foodly-logo.png" alt="Foodly" class="foodly-nav-logo h-9 w-auto object-contain drop-shadow-sm"/>
            </a>
            <div id="mob-top-location-btn" class="flex items-center gap-1.5 cursor-pointer active:opacity-80 truncate border-l border-surface-variant/60 pl-2">
              <div class="truncate">
                <div class="flex items-center gap-1">
                  <span class="text-[11px] font-black text-on-surface truncate">${activeAddress.split(',')[0]}</span>
                  <span class="material-symbols-outlined text-xs text-secondary shrink-0">expand_more</span>
                </div>
                <p class="text-[9px] text-secondary font-medium truncate">Knowledge Park III, Gr. Noida</p>
              </div>
            </div>
          </div>

          <!-- Right: Mobile Quick Actions (Search, Cart, Profile) -->
          <div class="flex items-center gap-1.5">
            <a href="#search" class="w-8 h-8 rounded-full bg-surface-container-low text-on-surface flex items-center justify-center cursor-pointer active:scale-90 transition-transform" title="Search">
              <span class="material-symbols-outlined text-base">search</span>
            </a>
            <button id="mob-top-cart-btn" class="w-8 h-8 rounded-full bg-surface-container-low text-on-surface flex items-center justify-center relative cursor-pointer active:scale-90 transition-transform" title="Cart">
              <span class="material-symbols-outlined text-base">shopping_cart</span>
              ${cartCount > 0 ? `<span class="absolute -top-1 -right-1 bg-primary text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">${cartCount}</span>` : ''}
            </button>
            <a href="#profile" class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-xs cursor-pointer active:scale-90 transition-transform" title="Profile">
              👤
            </a>
          </div>
        </div>
      </div>

      <!-- Campus Address Selector Modal (Swiggy / Zomato Bottom Sheet on Mobile) -->
      <div id="campus-location-modal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden flex items-end md:items-center justify-center p-0 md:p-4 animate-fade-in">
        <div class="bg-surface-container-lowest w-full md:max-w-md rounded-t-3xl md:rounded-3xl shadow-2xl border border-surface-variant p-5 max-h-[85vh] overflow-y-auto">
          <div class="flex justify-between items-center mb-4 pb-2 border-b border-surface-variant/40">
            <div>
              <h3 class="text-base font-black text-on-surface flex items-center gap-1.5">
                <span class="material-symbols-outlined text-primary text-lg filled">location_on</span>
                <span>Select Delivery Campus Hub</span>
              </h3>
              <p class="text-xs text-secondary font-medium">Fast ₹0 delivery across GL Bajaj campus & hostels</p>
            </div>
            <button id="close-location-modal-btn" class="w-8 h-8 rounded-full bg-surface-container-low text-secondary flex items-center justify-center hover:bg-surface-container cursor-pointer">
              <span class="material-symbols-outlined text-sm">close</span>
            </button>
          </div>

          <!-- GPS Auto Detect Option -->
          <button id="modal-gps-detect-btn" class="w-full mb-3 p-3 rounded-2xl bg-primary/10 hover:bg-primary/20 border border-primary/30 flex items-center gap-3 transition-colors text-left cursor-pointer active:scale-98">
            <div class="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-sm">
              <span class="material-symbols-outlined text-base">my_location</span>
            </div>
            <div>
              <h4 class="text-xs font-black text-primary">Use Current GPS Location</h4>
              <p class="text-[10.5px] text-secondary font-semibold">Automatically locate your hostel or campus building</p>
            </div>
          </button>

          <!-- Hotspot List -->
          <div class="space-y-2 mb-4">
            ${CAMPUS_LOCATIONS.map(loc => `
              <button 
                data-address="${loc.title}, ${loc.sub}"
                class="location-choice-btn w-full p-3 rounded-2xl bg-surface-container-low hover:bg-surface-container border border-surface-variant/40 flex items-center justify-between transition-all text-left cursor-pointer active:scale-98"
              >
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-secondary border border-surface-variant/30 shrink-0">
                    <span class="material-symbols-outlined text-sm">apartment</span>
                  </div>
                  <div>
                    <h5 class="text-xs font-black text-on-surface">${loc.title}</h5>
                    <p class="text-[10px] text-secondary font-medium">${loc.sub}</p>
                  </div>
                </div>
                <span class="px-2 py-0.5 rounded-full bg-surface-container text-[9px] font-extrabold text-secondary border border-surface-variant/50">${loc.tag}</span>
              </button>
            `).join('')}
          </div>

          <!-- Custom Address Input -->
          <div class="pt-2 border-t border-surface-variant/40">
            <label class="block text-[11px] font-bold text-secondary mb-1">Or enter room / custom location:</label>
            <div class="flex gap-2">
              <input id="custom-address-input" type="text" placeholder="e.g. GL Bajaj Hostel Room 412..." class="flex-1 bg-surface-container-low border border-surface-variant/60 rounded-xl px-3 py-2 text-xs font-semibold text-on-surface outline-none focus:border-primary"/>
              <button id="save-custom-address-btn" class="bg-primary text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-primary-container transition-colors cursor-pointer">Set</button>
            </div>
          </div>
        </div>
      </div>
    `;

    // ── Bind event handlers ──────────────────────────────────────────────────
    const openCart = () => {
      if (window.foodlyStore && window.foodlyStore.toggleCart) {
        window.foodlyStore.toggleCart(true);
      }
    };

    document.getElementById('nav-cart-btn')?.addEventListener('click', openCart);
    document.getElementById('mob-top-cart-btn')?.addEventListener('click', openCart);

    // Location Modal handlers
    const locModal = document.getElementById('campus-location-modal');
    const openLocModal = () => locModal?.classList.remove('hidden');
    const closeLocModal = () => locModal?.classList.add('hidden');

    document.getElementById('nav-location-picker-btn')?.addEventListener('click', openLocModal);
    document.getElementById('mob-top-location-btn')?.addEventListener('click', openLocModal);
    document.getElementById('close-location-modal-btn')?.addEventListener('click', closeLocModal);

    // Close on outside click
    locModal?.addEventListener('click', (e) => {
      if (e.target === locModal) closeLocModal();
    });

    // Handle hotspot choices
    container.querySelectorAll('.location-choice-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const addr = btn.dataset.address;
        if (addr && window.foodlyStore) {
          window.foodlyStore.activeAddress = addr;
          if (window.foodlyStore.emit) window.foodlyStore.emit('LOCATION_UPDATED', addr);
          closeLocModal();
          renderNavbar();
          if (window.foodlyStore.showToast) window.foodlyStore.showToast(`Delivery location set to ${addr.split(',')[0]}!`, 'success');
        }
      });
    });

    // Handle GPS button inside modal
    document.getElementById('modal-gps-detect-btn')?.addEventListener('click', async () => {
      closeLocModal();
      if (window.foodlyStore && window.foodlyStore.detectCurrentLocation) {
        const loc = await window.foodlyStore.detectCurrentLocation(false);
        renderNavbar();
        if (loc && window.foodlyStore.showToast) window.foodlyStore.showToast(`GPS Location: ${loc}`, 'success');
      }
    });

    // Handle custom address
    document.getElementById('save-custom-address-btn')?.addEventListener('click', () => {
      const input = document.getElementById('custom-address-input');
      const val = input ? input.value.trim() : '';
      if (val && window.foodlyStore) {
        window.foodlyStore.activeAddress = val;
        if (window.foodlyStore.emit) window.foodlyStore.emit('LOCATION_UPDATED', val);
        closeLocModal();
        renderNavbar();
      }
    });

    // Update bottom nav and floating cart bar
    updateMobileBottomNav(currentHash);
    updateMobileFloatingCart();
  }

  // Subscribe to store updates
  if (window.foodlyStore) {
    window.foodlyStore.subscribe((event) => {
      if (event === 'CART_UPDATED' || event === 'LOCATION_UPDATED') {
        renderNavbar();
      }
    });
  }

  window.addEventListener('hashchange', () => {
    const currentHash = window.location.hash || '#home';
    updateMobileBottomNav(currentHash);
    updateMobileFloatingCart();
  });

  window.renderNavbar = renderNavbar;
  window.updateMobileFloatingCart = updateMobileFloatingCart;
})();
