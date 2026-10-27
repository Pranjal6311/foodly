// public/js/views/searchView.js - Search Dishes & Restaurants with Rich UI
(function () {
  async function renderSearchView(container, queryParams = {}) {
    const store = window.foodlyStore;
    if (queryParams.q) store.filters.q = queryParams.q;
    if (queryParams.cuisine) store.filters.cuisine = queryParams.cuisine;

    let activeTab = 'all'; // 'all', 'dishes', 'restaurants'

    container.innerHTML = `
      <div class="fade-in max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-6 flex flex-col md:flex-row gap-gutter" style="min-height:85vh;background:#f9f9ff;">
        <!-- Filter Sidebar -->
        <aside class="w-full md:w-72 shrink-0 bg-surface-container-low p-6 rounded-2xl border border-surface-variant/50 sticky top-24 h-fit shadow-sm">
          <div class="flex justify-between items-baseline mb-4">
            <div>
              <h2 class="text-xl font-extrabold text-on-surface">Filters</h2>
              <p class="text-xs text-on-surface-variant">Filter dishes & dining</p>
            </div>
            <button id="clear-filters-btn" class="text-primary text-xs font-bold hover:underline cursor-pointer">
              Clear All
            </button>
          </div>

          <!-- Cuisine Filter -->
          <div class="mb-6">
            <h4 class="text-xs uppercase font-extrabold text-secondary tracking-wider mb-2.5 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-sm">restaurant</span>
              <span>Cuisine</span>
            </h4>
            <div class="flex flex-col gap-1 text-sm font-medium" id="filter-cuisine-group">
              <label class="flex items-center gap-2.5 p-2 rounded-lg hover:bg-surface-container cursor-pointer transition-colors">
                <input type="radio" name="cuisine" value="" ${!store.filters.cuisine ? 'checked' : ''} class="accent-primary"/>
                <span class="text-on-surface">All Cuisines</span>
              </label>
              <label class="flex items-center gap-2.5 p-2 rounded-lg bg-amber-50 hover:bg-amber-100/70 border border-amber-300/60 cursor-pointer transition-colors">
                <input type="radio" name="cuisine" value="Navratri Vrat Special" ${store.filters.cuisine === 'Navratri Vrat Special' || store.filters.cuisine === 'vrat-special' ? 'checked' : ''} class="accent-amber-600"/>
                <span class="text-amber-900 font-extrabold flex items-center gap-1.5">
                  <span class="diya-flame-glow text-sm">🪔</span>
                  <span>Navratri Vrat Special</span>
                </span>
              </label>
              <label class="flex items-center gap-2.5 p-2 rounded-lg hover:bg-surface-container cursor-pointer transition-colors">
                <input type="radio" name="cuisine" value="Cafe" ${store.filters.cuisine === 'Cafe' || store.filters.cuisine === 'cafe' ? 'checked' : ''} class="accent-primary"/>
                <span class="text-on-surface flex items-center gap-1.5">
                  <span class="text-indigo-600 font-bold">☕</span>
                  <span>Cafes & Coffee</span>
                </span>
              </label>
              <label class="flex items-center gap-2.5 p-2 rounded-lg hover:bg-surface-container cursor-pointer transition-colors">
                <input type="radio" name="cuisine" value="Restro" ${store.filters.cuisine === 'Restro' || store.filters.cuisine === 'restro' ? 'checked' : ''} class="accent-primary"/>
                <span class="text-on-surface flex items-center gap-1.5">
                  <span class="text-orange-600 font-bold">🍽️</span>
                  <span>Restros & Dining</span>
                </span>
              </label>
              <label class="flex items-center gap-2.5 p-2 rounded-lg hover:bg-surface-container cursor-pointer transition-colors">
                <input type="radio" name="cuisine" value="Hotel" ${store.filters.cuisine === 'Hotel' || store.filters.cuisine === 'hotel' ? 'checked' : ''} class="accent-primary"/>
                <span class="text-on-surface flex items-center gap-1.5">
                  <span class="text-emerald-600 font-bold">🏨</span>
                  <span>Hotel Kitchens</span>
                </span>
              </label>
              <label class="flex items-center gap-2.5 p-2 rounded-lg hover:bg-surface-container cursor-pointer transition-colors">
                <input type="radio" name="cuisine" value="South Indian" ${store.filters.cuisine === 'South Indian' || store.filters.cuisine === 'south-indian' ? 'checked' : ''} class="accent-primary"/>
                <span class="text-on-surface">South Indian & Dosa</span>
              </label>
              <label class="flex items-center gap-2.5 p-2 rounded-lg hover:bg-surface-container cursor-pointer transition-colors">
                <input type="radio" name="cuisine" value="Biryani" ${store.filters.cuisine === 'Biryani' || store.filters.cuisine === 'biryani' ? 'checked' : ''} class="accent-primary"/>
                <span class="text-on-surface">Biryani & Mughlai</span>
              </label>
              <label class="flex items-center gap-2.5 p-2 rounded-lg hover:bg-surface-container cursor-pointer transition-colors">
                <input type="radio" name="cuisine" value="Street Food" ${store.filters.cuisine === 'Street Food' || store.filters.cuisine === 'street-food' ? 'checked' : ''} class="accent-primary"/>
                <span class="text-on-surface">Street Food & Carts</span>
              </label>
              <label class="flex items-center gap-2.5 p-2 rounded-lg hover:bg-surface-container cursor-pointer transition-colors">
                <input type="radio" name="cuisine" value="North Indian" ${store.filters.cuisine === 'North Indian' || store.filters.cuisine === 'north-indian' ? 'checked' : ''} class="accent-primary"/>
                <span class="text-on-surface">North Indian & Curries</span>
              </label>
            </div>
          </div>

          <!-- Pure Veg Filter -->
          <div class="mb-6 pt-4 border-t border-surface-variant/50">
            <label class="flex items-center justify-between p-2 rounded-xl bg-surface-container hover:bg-surface-container-high cursor-pointer transition-colors">
              <span class="text-xs font-bold text-on-surface flex items-center gap-2">
                <span class="w-3.5 h-3.5 rounded-sm border-2 border-emerald-600 flex items-center justify-center"><span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span></span>
                <span>Pure Veg Only</span>
              </span>
              <input type="checkbox" id="dietary-veg" ${store.filters.dietary === 'Vegetarian' ? 'checked' : ''} class="rounded text-emerald-600 focus:ring-emerald-500"/>
            </label>
          </div>
        </aside>

        <!-- Main Content Area -->
        <div class="flex-1 flex flex-col min-w-0">
          <!-- Search Bar & Controls -->
          <div class="bg-surface-container-lowest p-4 rounded-2xl border border-surface-variant/60 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
            <div class="w-full sm:w-96 relative">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary text-xl">search</span>
              <input 
                id="search-input-field"
                type="text" 
                placeholder="Search any dish, cafe, restro, or hotel..." 
                value="${store.filters.q || ''}" 
                class="w-full bg-surface-container-low border border-surface-variant/40 focus:border-primary-container focus:ring-1 focus:ring-primary-container rounded-xl pl-10 pr-3 py-2.5 text-sm font-semibold outline-none text-on-surface"
              />
            </div>

            <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
              <!-- Result Tabs Switcher -->
              <div class="flex bg-surface-container-low p-1 rounded-xl border border-surface-variant/40 text-xs font-bold" id="search-tab-switcher">
                <button class="search-tab-btn active px-3 py-1.5 rounded-lg transition-all" data-tab="all">All</button>
                <button class="search-tab-btn px-3 py-1.5 rounded-lg transition-all" data-tab="dishes">Dishes</button>
                <button class="search-tab-btn px-3 py-1.5 rounded-lg transition-all" data-tab="restaurants">Places</button>
              </div>
            </div>
          </div>

          <!-- Active Filter Indicators -->
          <div id="active-filter-pills" class="flex flex-wrap gap-2 mb-4"></div>

          <!-- Search Results Container -->
          <div id="search-results-wrapper" class="flex flex-col gap-8">
            <!-- Dynamically populated -->
          </div>
        </div>
      </div>
    `;

    // ── Bind event listeners ───────────────────────────────────────────────
    const searchInput = document.getElementById('search-input-field');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        store.setFilter('q', e.target.value);
        loadResults();
      });
    }

    // Tab buttons
    document.querySelectorAll('.search-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.search-tab-btn').forEach(b => {
          b.classList.remove('active', 'bg-primary', 'text-white', 'shadow-sm');
          b.classList.add('text-secondary');
        });
        btn.classList.add('active', 'bg-primary', 'text-white', 'shadow-sm');
        btn.classList.remove('text-secondary');
        activeTab = btn.dataset.tab;
        loadResults();
      });
    });

    document.querySelectorAll('input[name="cuisine"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        store.setFilter('cuisine', e.target.value);
        loadResults();
      });
    });

    document.getElementById('dietary-veg')?.addEventListener('change', (e) => {
      store.setFilter('dietary', e.target.checked ? 'Vegetarian' : '');
      loadResults();
    });

    document.getElementById('clear-filters-btn')?.addEventListener('click', () => {
      store.clearFilters();
      renderSearchView(container);
    });

    // ── Load Results ───────────────────────────────────────────────────────
    async function loadResults() {
      const wrapper = document.getElementById('search-results-wrapper');
      const pillsContainer = document.getElementById('active-filter-pills');
      if (!wrapper) return;

      if (pillsContainer) {
        const pills = [];
        if (store.filters.q) pills.push(`"${store.filters.q}"`);
        if (store.filters.cuisine) pills.push(`${store.filters.cuisine}`);
        if (store.filters.dietary) pills.push(`${store.filters.dietary}`);

        pillsContainer.innerHTML = pills.map(p => `
          <span class="bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
            <span>${p}</span>
          </span>
        `).join('');
      }

      wrapper.innerHTML = `
        <div class="py-16 flex flex-col items-center justify-center text-secondary">
          <span class="material-symbols-outlined text-4xl animate-spin text-primary mb-2">progress_activity</span>
          <span class="text-xs font-bold">Searching campus dishes, restros, cafes & hotels...</span>
        </div>
      `;

      try {
        const query = { ...store.filters };
        const [dishesRes, restRes] = await Promise.all([
          window.foodlyApi.searchDishes ? window.foodlyApi.searchDishes(store.filters.q, store.filters) : { success: true, data: [] },
          window.foodlyApi.getRestaurants(query)
        ]);

        const dishes = (dishesRes && dishesRes.data) || [];
        const restaurants = (restRes && restRes.data) || [];

        if (dishes.length === 0 && restaurants.length === 0) {
          wrapper.innerHTML = `
            <div class="bg-surface-container-lowest rounded-2xl border border-surface-variant flex flex-col items-center justify-center text-center p-12">
              <span class="material-symbols-outlined text-5xl text-secondary mb-3">search_off</span>
              <h3 class="text-lg font-bold text-on-surface mb-1">No exact dishes or restaurants found</h3>
              <p class="text-xs text-secondary max-w-sm mb-4">Try searching for popular items like "Dosa", "Biryani", "Cold Coffee", "Sandwich", or "Rolls".</p>
              <button onclick="window.foodlyStore.clearFilters(); location.hash = '#search';" class="bg-primary text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors cursor-pointer">
                Reset Search
              </button>
            </div>
          `;
          return;
        }

        let html = '';

        // 1. MATCHING DISHES SECTION
        if ((activeTab === 'all' || activeTab === 'dishes') && dishes.length > 0) {
          html += `
            <section>
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h3 class="text-lg font-black text-on-surface flex items-center gap-2">
                    <span>🍽️ Dishes</span>
                    <span class="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">${dishes.length} items</span>
                  </h3>
                  <p class="text-xs text-secondary font-medium">Order directly to your hostel room or campus gate</p>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                ${dishes.slice(0, activeTab === 'all' ? 9 : 30).map(item => renderDishCard(item)).join('')}
              </div>
            </section>
          `;
        }

        // 2. MATCHING RESTAURANTS SECTION
        if ((activeTab === 'all' || activeTab === 'restaurants') && restaurants.length > 0) {
          html += `
            <section>
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h3 class="text-lg font-black text-on-surface flex items-center gap-2">
                    <span>🏪 Restaurants, Cafes & Hotels</span>
                    <span class="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">${restaurants.length} spots</span>
                  </h3>
                  <p class="text-xs text-secondary font-medium">Browse authentic dining kitchens</p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                ${restaurants.map(rest => renderRestaurantCard(rest)).join('')}
              </div>
            </section>
          `;
        }

        wrapper.innerHTML = html;

        // Bind Add-to-Cart buttons
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

    // ── Restaurant Card Renderer ───────────────────────────────────────────
    function renderRestaurantCard(rest) {
      return `
        <div class="bg-surface-container-lowest border border-surface-variant/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
          <a href="#restaurant/${rest.id}" class="block relative h-44 w-full overflow-hidden group">
            <img src="${rest.heroImage}" alt="${rest.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onerror="this.src='https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80'"/>
            <div class="absolute top-3 left-3 flex gap-1.5 flex-wrap">
              ${rest.type === 'food-cart' ? '<span class="bg-amber-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-md">Campus Cart</span>' : ''}
              ${(rest.type === 'cafe' || rest.isCafe) && rest.type !== 'food-cart' ? '<span class="bg-indigo-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-md">Cafe</span>' : ''}
              ${rest.bestseller ? '<span class="bg-primary text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-md">Bestseller</span>' : ''}
            </div>
            <div class="absolute bottom-3 right-3 bg-surface-container-lowest/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-md text-on-surface">
              <span class="material-symbols-outlined text-secondary text-sm">schedule</span>
              <span>${rest.deliveryTime}</span>
            </div>
          </a>

          <div class="p-4.5 flex-1 flex flex-col justify-between">
            <div>
              <div class="flex justify-between items-start mb-1">
                <a href="#restaurant/${rest.id}" class="font-extrabold text-base text-on-surface hover:text-primary transition-colors">
                  ${rest.name}
                </a>
                <div class="flex items-center gap-1 bg-emerald-600 text-white px-2 py-0.5 rounded-md text-xs font-bold">
                  <span class="material-symbols-outlined text-xs filled">star</span>
                  <span>${rest.rating}</span>
                </div>
              </div>
              <p class="text-xs text-secondary line-clamp-1 mb-2 font-medium">${(rest.cuisines || []).join(' • ')}</p>
            </div>

            <div class="flex items-center justify-between pt-3 border-t border-surface-variant/40 text-xs">
              <span class="text-secondary font-medium">
                ${rest.deliveryFee === 0 ? '<strong class="text-emerald-700">Free Campus Drop</strong>' : `Delivery: <strong>₹${rest.deliveryFee}</strong>`}
              </span>
              <a href="#restaurant/${rest.id}" class="bg-primary text-white font-bold px-3.5 py-1.5 rounded-xl hover:bg-primary/90 transition-colors shadow-sm">
                View Menu →
              </a>
            </div>
          </div>
        </div>
      `;
    }

    loadResults();
  }

  window.renderSearchView = renderSearchView;
})();
