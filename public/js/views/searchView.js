// public/js/views/searchView.js - Swiggy Dineout Style Dining & Dish Search
(function () {
  async function renderSearchView(container, queryParams = {}) {
    const store = window.foodlyStore;
    if (queryParams.q) store.filters.q = queryParams.q;
    if (queryParams.cuisine) store.filters.cuisine = queryParams.cuisine;

    // Default to 'restaurants' tab for dining experience, or 'dishes' if query specifically looks like a dish
    let activeTab = queryParams.tab || (queryParams.q ? 'all' : 'restaurants');

    container.innerHTML = `
      <div class="fade-in max-w-container-max mx-auto px-3 sm:px-6 md:px-12 py-4 sm:py-6" style="min-height:90vh;background:#f9f9ff;">
        
        <!-- ══ SWIGGY DINEOUT PROMO BANNER ═══════════════════════════════ -->
        <div class="mb-5 bg-gradient-to-r from-amber-950 via-orange-950 to-neutral-900 text-white rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-sm border border-amber-900/40">
          <div class="absolute -right-8 -top-8 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
          <div class="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div class="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full mb-1 tracking-wider shadow-sm">
                🍽️ Foodly Dineout Specials
              </div>
              <h2 class="text-base sm:text-lg font-black leading-tight text-white">Save Up To 40% On Campus Dining Bills</h2>
              <p class="text-xs text-amber-200/80 font-medium">Pre-book a table or pay your dining bill through Foodly Dineout at counter</p>
            </div>
            <div class="flex items-center gap-2">
              <span class="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1">
                <span>⚡ Instant Table Confirmation</span>
              </span>
            </div>
          </div>
        </div>

        <!-- ══ SEARCH BAR & TAB SWITCHER ══════════════════════════════════ -->
        <div class="bg-surface-container-lowest p-3 sm:p-4 rounded-2xl border border-surface-variant/60 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-4">
          
          <!-- Search Field -->
          <div class="flex-1 relative">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary text-xl">search</span>
            <input 
              id="search-input-field"
              type="text" 
              placeholder="Search dining restros, cafes, buffets, or dishes (e.g. Biryani, Pizza)..." 
              value="${store.filters.q || ''}" 
              class="w-full bg-surface-container-low border border-surface-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-semibold outline-none text-on-surface"
            />
          </div>

          <!-- Swiggy Style Segmented Tabs Switcher -->
          <div class="flex items-center justify-center bg-surface-container-low p-1 rounded-xl border border-surface-variant/40 text-xs font-bold shrink-0" id="search-tab-switcher">
            <button class="search-tab-btn ${activeTab === 'restaurants' ? 'active' : ''} px-3.5 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5" data-tab="restaurants">
              <span>🍽️</span><span>Dining Places</span>
            </button>
            <button class="search-tab-btn ${activeTab === 'all' ? 'active' : ''} px-3.5 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5" data-tab="all">
              <span>✨</span><span>All</span>
            </button>
            <button class="search-tab-btn ${activeTab === 'dishes' ? 'active' : ''} px-3.5 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5" data-tab="dishes">
              <span>🍲</span><span>Dishes</span>
            </button>
          </div>
        </div>

        <!-- ══ HORIZONTAL SWIPEABLE FILTER CHIPS (Swiggy Style) ══════════ -->
        <div class="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none" id="dining-filter-chips">
          <button class="dining-chip active px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer border" data-chip="all">
            All Places
          </button>
          <button class="dining-chip px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer border flex items-center gap-1" data-chip="rating4">
            <span class="text-amber-500">★</span> 4.0+ Rated
          </button>
          <button class="dining-chip px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer border flex items-center gap-1" data-chip="veg">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span> Pure Veg
          </button>
          <button class="dining-chip px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer border flex items-center gap-1" data-chip="dineout-deal">
            <span>🏷️</span> Dineout 25% OFF
          </button>
          <button class="dining-chip px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer border flex items-center gap-1" data-chip="Cafe">
            <span>☕</span> Cafes
          </button>
          <button class="dining-chip px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer border flex items-center gap-1" data-chip="Restro">
            <span>🍽️</span> Restros & Buffets
          </button>
          <button class="dining-chip px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer border flex items-center gap-1" data-chip="Hotel">
            <span>🏨</span> Hotel Dining
          </button>
          <button class="dining-chip px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer border flex items-center gap-1" data-chip="Biryani">
            <span>🍲</span> Biryani
          </button>
          <button class="dining-chip px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer border flex items-center gap-1" data-chip="South Indian">
            <span>🥞</span> South Indian
          </button>
          <button class="dining-chip px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer border flex items-center gap-1" data-chip="Navratri Vrat Special">
            <span>🪔</span> Navratri Satvik
          </button>
        </div>

        <!-- ══ MAIN LAYOUT: DESKTOP ASIDE (HIDDEN ON MOBILE) + CONTENT ══ -->
        <div class="flex flex-col md:flex-row gap-6 items-start">
          
          <!-- Desktop-only filter sidebar (strictly hidden on mobile so it NEVER overlaps) -->
          <aside class="hidden md:block w-64 shrink-0 bg-surface-container-low p-5 rounded-2xl border border-surface-variant/50 sticky top-24 shadow-sm">
            <div class="flex justify-between items-baseline mb-4">
              <div>
                <h3 class="text-base font-extrabold text-on-surface">Dining Filters</h3>
                <p class="text-[11px] text-secondary">Campus restros & cafes</p>
              </div>
              <button id="desktop-clear-filters-btn" class="text-primary text-xs font-bold hover:underline cursor-pointer">
                Clear All
              </button>
            </div>

            <!-- Cuisine Radios for Desktop -->
            <div class="flex flex-col gap-1 text-xs font-semibold mb-5">
              <label class="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-container cursor-pointer transition-colors">
                <input type="radio" name="desktop-cuisine" value="" ${!store.filters.cuisine ? 'checked' : ''} class="accent-primary"/>
                <span class="text-on-surface">All Dining Places</span>
              </label>
              <label class="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-container cursor-pointer transition-colors">
                <input type="radio" name="desktop-cuisine" value="Cafe" ${store.filters.cuisine === 'Cafe' ? 'checked' : ''} class="accent-primary"/>
                <span class="text-on-surface">☕ Cafes & Coffee</span>
              </label>
              <label class="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-container cursor-pointer transition-colors">
                <input type="radio" name="desktop-cuisine" value="Restro" ${store.filters.cuisine === 'Restro' ? 'checked' : ''} class="accent-primary"/>
                <span class="text-on-surface">🍽️ Restros & Buffets</span>
              </label>
              <label class="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-container cursor-pointer transition-colors">
                <input type="radio" name="desktop-cuisine" value="Hotel" ${store.filters.cuisine === 'Hotel' ? 'checked' : ''} class="accent-primary"/>
                <span class="text-on-surface">🏨 Hotel Dining</span>
              </label>
              <label class="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-container cursor-pointer transition-colors">
                <input type="radio" name="desktop-cuisine" value="Biryani" ${store.filters.cuisine === 'Biryani' ? 'checked' : ''} class="accent-primary"/>
                <span class="text-on-surface">🍲 Biryani & Mughlai</span>
              </label>
              <label class="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-container cursor-pointer transition-colors">
                <input type="radio" name="desktop-cuisine" value="South Indian" ${store.filters.cuisine === 'South Indian' ? 'checked' : ''} class="accent-primary"/>
                <span class="text-on-surface">🥞 South Indian & Dosa</span>
              </label>
              <label class="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-container cursor-pointer transition-colors">
                <input type="radio" name="desktop-cuisine" value="Street Food" ${store.filters.cuisine === 'Street Food' ? 'checked' : ''} class="accent-primary"/>
                <span class="text-on-surface">🌮 Street Food & Carts</span>
              </label>
            </div>

            <!-- Pure Veg Toggle -->
            <div class="pt-3 border-t border-surface-variant/50">
              <label class="flex items-center justify-between p-2 rounded-xl bg-surface-container hover:bg-surface-container-high cursor-pointer transition-colors">
                <span class="text-xs font-bold text-on-surface flex items-center gap-2">
                  <span class="w-3.5 h-3.5 rounded-sm border-2 border-emerald-600 flex items-center justify-center"><span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span></span>
                  <span>Pure Veg Only</span>
                </span>
                <input type="checkbox" id="desktop-dietary-veg" ${store.filters.dietary === 'Vegetarian' ? 'checked' : ''} class="rounded text-emerald-600 focus:ring-emerald-500"/>
              </label>
            </div>
          </aside>

          <!-- Main Content Results Area -->
          <div class="flex-1 min-w-0 w-full" id="search-results-wrapper">
            <!-- Dynamically populated -->
          </div>
        </div>

      </div>

      <!-- ══ SWIGGY DINEOUT TABLE BOOKING MODAL ═════════════════════════ -->
      <div id="table-booking-modal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden flex items-end sm:items-center justify-center p-0 sm:p-4 transition-opacity">
        <div class="bg-surface-container-lowest w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl border border-surface-variant flex flex-col max-h-[90vh] overflow-hidden fade-in">
          
          <div class="p-4 sm:p-5 border-b border-surface-variant bg-gradient-to-r from-amber-950 via-orange-950 to-neutral-900 text-white flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <span class="text-2xl">🍽️</span>
              <div>
                <h3 class="font-black text-sm sm:text-base text-white" id="modal-rest-name">Book a Table</h3>
                <p class="text-[11px] text-amber-200/80 font-medium" id="modal-rest-loc">GL Bajaj Campus Partner Restro</p>
              </div>
            </div>
            <button id="close-booking-modal-btn" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer">
              <span class="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          <div class="p-4 sm:p-5 flex flex-col gap-4 overflow-y-auto">
            
            <!-- Dineout Discount Banner -->
            <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2 text-emerald-900">
              <span class="material-symbols-outlined text-emerald-600 text-lg">verified</span>
              <div class="text-xs">
                <strong class="font-extrabold text-emerald-800">Flat 25% OFF Auto-Applied!</strong>
                <p class="text-[10px] text-emerald-700">Instant reservation with zero booking fee.</p>
              </div>
            </div>

            <!-- Date Selector -->
            <div>
              <label class="block text-xs font-extrabold text-on-surface mb-2">Select Date</label>
              <div class="grid grid-cols-3 gap-2" id="booking-date-selector">
                <button class="booking-date-btn active p-2.5 rounded-xl border border-primary bg-primary/10 text-primary text-xs font-bold text-center cursor-pointer" data-val="Today">
                  <div>Today</div>
                  <div class="text-[10px] font-normal text-secondary">Oct 28</div>
                </button>
                <button class="booking-date-btn p-2.5 rounded-xl border border-surface-variant hover:bg-surface-container text-on-surface text-xs font-bold text-center cursor-pointer" data-val="Tomorrow">
                  <div>Tomorrow</div>
                  <div class="text-[10px] font-normal text-secondary">Oct 29</div>
                </button>
                <button class="booking-date-btn p-2.5 rounded-xl border border-surface-variant hover:bg-surface-container text-on-surface text-xs font-bold text-center cursor-pointer" data-val="Friday">
                  <div>Friday</div>
                  <div class="text-[10px] font-normal text-secondary">Oct 30</div>
                </button>
              </div>
            </div>

            <!-- Guests Count Selector -->
            <div>
              <label class="block text-xs font-extrabold text-on-surface mb-2">Number of Guests</label>
              <div class="flex items-center gap-2" id="booking-guests-selector">
                ${[1, 2, 4, 6, 8].map((g, idx) => `
                  <button class="booking-guest-btn ${idx === 1 ? 'active bg-primary text-white font-black' : 'bg-surface-container text-on-surface font-bold'} flex-1 py-2 rounded-xl text-xs border border-surface-variant/40 cursor-pointer transition-all" data-guests="${g}">
                    ${g} ${g === 1 ? 'Guest' : 'Guests'}
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Time Slots -->
            <div>
              <label class="block text-xs font-extrabold text-on-surface mb-2">Select Time Slot</label>
              <div class="grid grid-cols-3 gap-2" id="booking-time-selector">
                ${['1:00 PM', '2:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '9:45 PM'].map((t, idx) => `
                  <button class="booking-time-btn ${idx === 3 ? 'active bg-primary text-white font-black' : 'bg-surface-container text-on-surface font-semibold'} py-2 rounded-xl text-xs border border-surface-variant/40 cursor-pointer transition-all" data-time="${t}">
                    ${t}
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Guest Details Inputs -->
            <div class="flex flex-col gap-2">
              <input type="text" id="booking-name-input" placeholder="Your Name" value="Pranjal" class="w-full bg-surface-container-low border border-surface-variant/60 rounded-xl px-3 py-2 text-xs font-semibold outline-none text-on-surface"/>
              <input type="tel" id="booking-phone-input" placeholder="Phone Number (for booking SMS)" value="+91 98765 43210" class="w-full bg-surface-container-low border border-surface-variant/60 rounded-xl px-3 py-2 text-xs font-semibold outline-none text-on-surface"/>
            </div>

            <button id="confirm-reservation-btn" class="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-orange-600 hover:opacity-95 text-white font-black text-xs shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 cursor-pointer mt-1">
              <span>Confirm Table Reservation (25% OFF)</span>
              <span class="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    `;

    // ── Apply chip styling ──────────────────────────────────────────────────
    function updateChipStyles() {
      const currentCuisine = store.filters.cuisine || 'all';
      const isVeg = store.filters.dietary === 'Vegetarian';

      document.querySelectorAll('.dining-chip').forEach(btn => {
        const val = btn.dataset.chip;
        let isActive = false;
        if (val === 'all' && (!store.filters.cuisine || store.filters.cuisine === 'all') && !isVeg) {
          isActive = true;
        } else if (val === 'veg' && isVeg) {
          isActive = true;
        } else if (val === currentCuisine) {
          isActive = true;
        }

        if (isActive) {
          btn.style.background = '#ff5e18';
          btn.style.color = '#fff';
          btn.style.borderColor = '#ff5e18';
        } else {
          btn.style.background = '#fff';
          btn.style.color = '#151c27';
          btn.style.borderColor = '#dce2f3';
        }
      });
    }

    // ── Bind search and tabs ────────────────────────────────────────────────
    const searchInput = document.getElementById('search-input-field');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        store.setFilter('q', e.target.value);
        loadResults();
      });
    }

    // Tabs: Dining Places, All, Dishes
    document.querySelectorAll('.search-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.search-tab-btn').forEach(b => {
          b.classList.remove('active');
          b.style.background = 'transparent';
          b.style.color = '#575e70';
        });
        btn.classList.add('active');
        btn.style.background = '#ff5e18';
        btn.style.color = '#fff';
        activeTab = btn.getAttribute('data-tab');
        loadResults();
      });
    });

    // Horizontal Chips Click
    document.querySelectorAll('.dining-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const chip = btn.dataset.chip;
        if (chip === 'all') {
          store.clearFilters();
        } else if (chip === 'veg') {
          store.setFilter('dietary', store.filters.dietary === 'Vegetarian' ? '' : 'Vegetarian');
        } else if (chip === 'rating4') {
          store.setFilter('rating', 4.0);
        } else {
          store.setFilter('cuisine', store.filters.cuisine === chip ? '' : chip);
        }
        updateChipStyles();
        loadResults();
      });
    });

    // Desktop Radio Filters
    document.querySelectorAll('input[name="desktop-cuisine"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        store.setFilter('cuisine', e.target.value);
        updateChipStyles();
        loadResults();
      });
    });

    const desktopVeg = document.getElementById('desktop-dietary-veg');
    if (desktopVeg) {
      desktopVeg.addEventListener('change', (e) => {
        store.setFilter('dietary', e.target.checked ? 'Vegetarian' : '');
        updateChipStyles();
        loadResults();
      });
    }

    const clearBtn = document.getElementById('desktop-clear-filters-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        store.clearFilters();
        updateChipStyles();
        loadResults();
      });
    }

    // ── Modal Reservation Logic ─────────────────────────────────────────────
    let selectedDate = 'Today';
    let selectedGuests = 2;
    let selectedTime = '8:00 PM';
    let currentBookingRest = '';

    window.openFoodlyTableBooking = function (restName, restLoc) {
      currentBookingRest = restName;
      const modal = document.getElementById('table-booking-modal');
      const titleEl = document.getElementById('modal-rest-name');
      const locEl = document.getElementById('modal-rest-loc');
      if (titleEl) titleEl.textContent = `Book Table at ${restName}`;
      if (locEl) locEl.textContent = `${restLoc} • Foodly Dineout Partner`;
      if (modal) modal.classList.remove('hidden');
    };

    const closeModalBtn = document.getElementById('close-booking-modal-btn');
    if (closeModalBtn) {
      closeModalBtn.onclick = () => {
        document.getElementById('table-booking-modal')?.classList.add('hidden');
      };
    }

    document.querySelectorAll('.booking-date-btn').forEach(b => {
      b.onclick = () => {
        document.querySelectorAll('.booking-date-btn').forEach(btn => {
          btn.classList.remove('active', 'bg-primary/10', 'text-primary', 'border-primary');
          btn.classList.add('border-surface-variant', 'text-on-surface');
        });
        b.classList.add('active', 'bg-primary/10', 'text-primary', 'border-primary');
        selectedDate = b.dataset.val;
      };
    });

    document.querySelectorAll('.booking-guest-btn').forEach(b => {
      b.onclick = () => {
        document.querySelectorAll('.booking-guest-btn').forEach(btn => {
          btn.classList.remove('bg-primary', 'text-white', 'font-black');
          btn.classList.add('bg-surface-container', 'text-on-surface', 'font-bold');
        });
        b.classList.add('bg-primary', 'text-white', 'font-black');
        selectedGuests = b.dataset.guests;
      };
    });

    document.querySelectorAll('.booking-time-btn').forEach(b => {
      b.onclick = () => {
        document.querySelectorAll('.booking-time-btn').forEach(btn => {
          btn.classList.remove('bg-primary', 'text-white', 'font-black');
          btn.classList.add('bg-surface-container', 'text-on-surface', 'font-semibold');
        });
        b.classList.add('bg-primary', 'text-white', 'font-black');
        selectedTime = b.dataset.time;
      };
    });

    const confirmResBtn = document.getElementById('confirm-reservation-btn');
    if (confirmResBtn) {
      confirmResBtn.onclick = () => {
        document.getElementById('table-booking-modal')?.classList.add('hidden');
        window.foodlyStore.showToast(`🎉 Table Confirmed at ${currentBookingRest} for ${selectedGuests} Guests (${selectedTime}, ${selectedDate}) with 25% Dineout Discount!`, 'success');
      };
    }

    // ── Load Results ────────────────────────────────────────────────────────
    async function loadResults() {
      const wrapper = document.getElementById('search-results-wrapper');
      if (!wrapper) return;

      wrapper.innerHTML = `
        <div class="flex items-center justify-center p-12 text-secondary text-xs">
          <span class="material-symbols-outlined text-2xl text-primary animate-spin mr-2">progress_activity</span>
          <span>Loading Swiggy Dineout dining spots & menus...</span>
        </div>
      `;

      try {
        const query = {
          q: store.filters.q || '',
          cuisine: store.filters.cuisine || '',
          dietary: store.filters.dietary || ''
        };

        const [dishesRes, restRes] = await Promise.all([
          window.foodlyApi.searchDishes(query.q, query),
          window.foodlyApi.getRestaurants(query)
        ]);

        let dishes = (dishesRes && dishesRes.data) || [];
        let restaurants = (restRes && restRes.data) || [];

        // Apply 4.0+ rating filter if toggled
        if (store.filters.rating) {
          restaurants = restaurants.filter(r => r.rating >= store.filters.rating);
        }

        if (dishes.length === 0 && restaurants.length === 0) {
          wrapper.innerHTML = `
            <div class="bg-surface-container-lowest rounded-2xl border border-surface-variant flex flex-col items-center justify-center text-center p-12">
              <span class="material-symbols-outlined text-5xl text-secondary mb-3">search_off</span>
              <h3 class="text-base font-extrabold text-on-surface mb-1">No dining restros or dishes found</h3>
              <p class="text-xs text-secondary max-w-sm mb-4">Try clearing filters or search for popular dining cuisines like Cafes, North Indian, Buffet or Biryani.</p>
              <button onclick="window.foodlyStore.clearFilters(); location.hash = '#search';" class="bg-primary text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors cursor-pointer shadow-sm">
                Reset All Filters
              </button>
            </div>
          `;
          return;
        }

        let html = '';

        // 1. SWIGGY DINEOUT RESTAURANTS SECTION
        if ((activeTab === 'restaurants' || activeTab === 'all') && restaurants.length > 0) {
          html += `
            <section class="mb-8">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h3 class="text-lg font-black text-on-surface flex items-center gap-2">
                    <span>🍽️ Dining Out & Restros</span>
                    <span class="bg-primary/10 text-primary text-xs font-extrabold px-2.5 py-0.5 rounded-full">${restaurants.length} spots</span>
                  </h3>
                  <p class="text-xs text-secondary font-medium">Authentic campus dining with instant table reservation & bills cashback</p>
                </div>
              </div>

              <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
                ${restaurants.map(rest => renderSwiggyDineoutCard(rest)).join('')}
              </div>
            </section>
          `;
        }

        // 2. DISHES SECTION
        if ((activeTab === 'dishes' || activeTab === 'all') && dishes.length > 0) {
          html += `
            <section class="mb-8">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h3 class="text-lg font-black text-on-surface flex items-center gap-2">
                    <span>🍲 Popular Dishes</span>
                    <span class="bg-primary/10 text-primary text-xs font-extrabold px-2.5 py-0.5 rounded-full">${dishes.length} items</span>
                  </h3>
                  <p class="text-xs text-secondary font-medium">Order directly to campus drop points</p>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                ${dishes.slice(0, activeTab === 'all' ? 9 : 30).map(item => renderDishCard(item)).join('')}
              </div>
            </section>
          `;
        }

        wrapper.innerHTML = html;

        // Bind Add-to-Cart buttons for dishes
        wrapper.querySelectorAll('.search-dish-add-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            try {
              const dishData = JSON.parse(btn.getAttribute('data-dish'));
              const restData = JSON.parse(btn.getAttribute('data-rest'));
              window.foodlyStore.addToCart(dishData, restData);
              btn.innerHTML = '✓ Added';
              btn.style.background = '#059669';
              setTimeout(() => {
                btn.innerHTML = '+ Add';
                btn.style.background = '#ff5e18';
              }, 1200);
            } catch (err) {
              console.error('Error adding dish to cart:', err);
            }
          });
        });

      } catch (e) {
        console.error('Error loading search results:', e);
      }
    }

    // ── Swiggy Dineout Restaurant Card ──────────────────────────────────────
    function renderSwiggyDineoutCard(rest) {
      const isBuffet = (rest.type === 'hotel' || rest.name.toLowerCase().includes('buffet'));
      const discountText = isBuffet ? 'FLAT 35% OFF on Buffet' : (rest.rating >= 4.5 ? 'FLAT 25% OFF with Dineout Pay' : 'FLAT 20% OFF with Table Booking');

      return `
        <div class="bg-surface-container-lowest border border-surface-variant/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col group">
          
          <!-- Hero Image & Swiggy Dineout Discount Overlay -->
          <div class="relative h-48 sm:h-52 w-full overflow-hidden bg-neutral-900 cursor-pointer" onclick="window.location.hash='#restaurant/${rest.id}'">
            <img 
              src="${rest.heroImage}" 
              alt="${rest.name}" 
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              onerror="this.src='https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80'"
            />
            
            <!-- Category Tags Top Left -->
            <div class="absolute top-3 left-3 flex gap-1.5 flex-wrap z-10">
              ${rest.type === 'food-cart' ? '<span class="bg-amber-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md">Campus Cart</span>' : ''}
              ${(rest.type === 'cafe' || rest.isCafe) && rest.type !== 'food-cart' ? '<span class="bg-indigo-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md">Cafe & Hangout</span>' : ''}
              ${rest.bestseller ? '<span class="bg-primary text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md">Top Pick</span>' : ''}
              ${isBuffet ? '<span class="bg-emerald-700 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md">Buffet Available</span>' : ''}
            </div>

            <!-- Distance Pill Top Right -->
            <div class="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 z-10 shadow-sm">
              <span class="material-symbols-outlined text-xs">near_me</span>
              <span>${rest.distanceKm ? rest.distanceKm + ' km' : '0.8 km'}</span>
            </div>

            <!-- Swiggy Dineout Discount Pill Across Image Bottom -->
            <div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/55 to-transparent p-3 pt-6 flex items-center justify-between z-10">
              <span class="bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[11px] font-black px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                <span class="material-symbols-outlined text-xs">local_offer</span>
                <span>${discountText}</span>
              </span>
              <span class="bg-white/95 text-on-surface font-extrabold text-xs px-2 py-0.5 rounded-md flex items-center gap-0.5 shadow-sm">
                <span class="text-emerald-700 font-black">★ ${rest.rating}</span>
                <span class="text-secondary text-[10px] font-medium">(1.2k+)</span>
              </span>
            </div>
          </div>

          <!-- Restaurant Details Body -->
          <div class="p-4 flex-1 flex flex-col justify-between">
            <div>
              <div class="flex justify-between items-start mb-1">
                <h4 class="font-black text-base text-on-surface group-hover:text-primary transition-colors line-clamp-1">
                  ${rest.name}
                </h4>
              </div>
              <p class="text-xs text-secondary font-medium line-clamp-1 mb-1.5">
                ${(rest.cuisines || []).join(' • ')} • Casual Dining
              </p>
              <p class="text-[11px] text-on-surface-variant font-medium flex items-center gap-1">
                <span class="material-symbols-outlined text-xs text-secondary">location_on</span>
                <span>${rest.area || rest.city || 'Knowledge Park III, Greater Noida'} • ₹500 for two</span>
              </p>
            </div>

            <!-- Swiggy Action Row: Book Table + View Menu -->
            <div class="pt-3.5 mt-3 border-t border-surface-variant/40 flex items-center gap-2.5">
              <button 
                onclick="window.openFoodlyTableBooking('${rest.name.replace(/'/g, "\\'")}', '${(rest.area || 'Knowledge Park III').replace(/'/g, "\\'")}')" 
                class="flex-1 bg-gradient-to-r from-primary to-orange-600 hover:opacity-95 text-white font-black text-xs py-2.5 px-3.5 rounded-xl shadow-sm active:scale-95 transition-transform flex items-center justify-center gap-1 cursor-pointer"
              >
                <span class="material-symbols-outlined text-sm">event_seat</span>
                <span>Book Table</span>
              </button>
              <a 
                href="#restaurant/${rest.id}" 
                class="flex-1 bg-surface-container hover:bg-surface-container-high text-on-surface font-extrabold text-xs py-2.5 px-3.5 rounded-xl border border-surface-variant/60 transition-colors text-center flex items-center justify-center gap-1"
              >
                <span class="material-symbols-outlined text-sm">menu_book</span>
                <span>View Menu</span>
              </a>
            </div>
          </div>
        </div>
      `;
    }

    // ── Dish Card Renderer ─────────────────────────────────────────────────
    function renderDishCard(item) {
      const dish = item.dish;
      const rest = item.restaurant;
      const jsonDish = JSON.stringify(dish).replace(/"/g, '&quot;');
      const jsonRest = JSON.stringify(rest).replace(/"/g, '&quot;');

      return `
        <div class="bg-surface-container-lowest border border-surface-variant/80 rounded-2xl p-3.5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div class="relative h-36 w-full rounded-xl overflow-hidden bg-surface-container mb-3 group">
              <img 
                src="${dish.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'}" 
                alt="${dish.name}" 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'"
              />
              <span class="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                ${dish.veg 
                  ? '<span class="w-2 h-2 rounded-full bg-emerald-400"></span>Veg' 
                  : '<span class="w-2 h-2 rounded-full bg-rose-400"></span>Non-Veg'
                }
              </span>
              ${dish.nutrition ? `
                <span class="absolute bottom-2 left-2 bg-surface-container-lowest/90 backdrop-blur-sm text-on-surface text-[9px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                  🔥 ${dish.nutrition.calories || 350} kcal
                </span>
              ` : ''}
            </div>

            <h4 class="font-bold text-sm text-on-surface line-clamp-1 mb-1">${dish.name}</h4>
            <a href="#restaurant/${rest.id}" class="text-[11px] text-secondary hover:text-primary font-medium flex items-center gap-1 mb-2 line-clamp-1">
              <span class="material-symbols-outlined text-xs">storefront</span>
              <span>${rest.name}</span>
            </a>
            ${dish.description ? `<p class="text-[10.5px] text-on-surface-variant line-clamp-2 leading-relaxed mb-3">${dish.description}</p>` : ''}
          </div>

          <div class="flex items-center justify-between pt-2 border-t border-surface-variant/40 mt-auto">
            <span class="text-base font-black text-primary">₹${dish.price}</span>
            <button 
              data-dish="${jsonDish}" 
              data-rest="${jsonRest}" 
              class="search-dish-add-btn bg-primary hover:bg-primary-container text-white text-xs font-black px-4 py-1.5 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              + Add
            </button>
          </div>
        </div>
      `;
    }

    updateChipStyles();
    loadResults();
  }

  window.renderSearchView = renderSearchView;
})();
