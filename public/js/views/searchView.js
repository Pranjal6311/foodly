// public/js/views/searchView.js - Search & Filters Screen (1:1 Stitch UI Replication)
(function () {
  async function renderSearchView(container, queryParams = {}) {
    const store = window.foodlyStore;
    if (queryParams.q) store.filters.q = queryParams.q;
    if (queryParams.cuisine) store.filters.cuisine = queryParams.cuisine;

    container.innerHTML = `
      <div class="fade-in max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-6 flex flex-col md:flex-row gap-gutter">
        <!-- Filter Sidebar (Direct from Stitch foodly-search-results.html) -->
        <aside class="w-full md:w-72 shrink-0 bg-surface-container-low p-6 rounded-2xl border border-surface-variant/50 sticky top-24 h-fit">
          <div class="flex justify-between items-baseline mb-4">
            <div>
              <h2 class="text-xl font-extrabold text-on-surface">Filters</h2>
              <p class="text-xs text-on-surface-variant">Narrow your search</p>
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
                  <span>Hotel Kitchens & Buffets</span>
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
                <span class="text-on-surface">Street Food & Food Carts</span>
              </label>
              <label class="flex items-center gap-2.5 p-2 rounded-lg hover:bg-surface-container cursor-pointer transition-colors">
                <input type="radio" name="cuisine" value="North Indian" ${store.filters.cuisine === 'North Indian' || store.filters.cuisine === 'north-indian' ? 'checked' : ''} class="accent-primary"/>
                <span class="text-on-surface">North Indian & Kebabs</span>
              </label>
              <label class="flex items-center gap-2.5 p-2 rounded-lg hover:bg-surface-container cursor-pointer transition-colors">
                <input type="radio" name="cuisine" value="Asian" ${store.filters.cuisine === 'Asian' || store.filters.cuisine === 'asian' ? 'checked' : ''} class="accent-primary"/>
                <span class="text-on-surface">Asian & Momos</span>
              </label>
              <label class="flex items-center gap-2.5 p-2 rounded-lg hover:bg-surface-container cursor-pointer transition-colors">
                <input type="radio" name="cuisine" value="Pizza" ${store.filters.cuisine === 'Pizza' || store.filters.cuisine === 'pizza' ? 'checked' : ''} class="accent-primary"/>
                <span class="text-on-surface">Pizza & Continental</span>
              </label>
            </div>
          </div>

          <!-- Price Range Filter -->
          <div class="mb-6">
            <h4 class="text-xs uppercase font-extrabold text-secondary tracking-wider mb-2.5 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-sm">payments</span>
              <span>Price Range</span>
            </h4>
            <div class="grid grid-cols-3 gap-2">
              <button data-price="1" class="filter-price-btn py-2 border rounded-lg text-xs font-bold ${store.filters.price === '1' ? 'bg-primary text-white border-primary' : 'bg-surface-container-lowest border-surface-variant text-on-surface hover:border-primary'}">&#8377;</button>
              <button data-price="2" class="filter-price-btn py-2 border rounded-lg text-xs font-bold ${store.filters.price === '2' ? 'bg-primary text-white border-primary' : 'bg-surface-container-lowest border-surface-variant text-on-surface hover:border-primary'}">&#8377;&#8377;</button>
              <button data-price="3" class="filter-price-btn py-2 border rounded-lg text-xs font-bold ${store.filters.price === '3' ? 'bg-primary text-white border-primary' : 'bg-surface-container-lowest border-surface-variant text-on-surface hover:border-primary'}">&#8377;&#8377;&#8377;</button>
            </div>
          </div>

          <!-- Rating Filter -->
          <div class="mb-6">
            <h4 class="text-xs uppercase font-extrabold text-secondary tracking-wider mb-2.5 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-sm">star</span>
              <span>Minimum Rating</span>
            </h4>
            <div class="flex flex-col gap-1 text-sm font-medium">
              <label class="flex items-center gap-2.5 p-2 rounded-lg hover:bg-surface-container cursor-pointer transition-colors">
                <input type="radio" name="rating" value="4.8" ${store.filters.rating === '4.8' ? 'checked' : ''} class="accent-primary"/>
                <span class="text-on-surface flex items-center gap-1">4.8+ Stars <span class="material-symbols-outlined text-primary text-sm filled">star</span></span>
              </label>
              <label class="flex items-center gap-2.5 p-2 rounded-lg hover:bg-surface-container cursor-pointer transition-colors">
                <input type="radio" name="rating" value="4.5" ${store.filters.rating === '4.5' ? 'checked' : ''} class="accent-primary"/>
                <span class="text-on-surface flex items-center gap-1">4.5+ Stars <span class="material-symbols-outlined text-primary text-sm filled">star</span></span>
              </label>
              <label class="flex items-center gap-2.5 p-2 rounded-lg hover:bg-surface-container cursor-pointer transition-colors">
                <input type="radio" name="rating" value="" ${!store.filters.rating ? 'checked' : ''} class="accent-primary"/>
                <span class="text-on-surface">Any Rating</span>
              </label>
            </div>
          </div>

          <!-- Dietary Filter -->
          <div>
            <h4 class="text-xs uppercase font-extrabold text-secondary tracking-wider mb-2.5 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-sm">eco</span>
              <span>Dietary</span>
            </h4>
            <div class="flex flex-col gap-1 text-sm font-medium">
              <label class="flex items-center gap-2.5 p-2 rounded-lg hover:bg-surface-container cursor-pointer transition-colors">
                <input type="checkbox" id="dietary-veg" value="Vegetarian" ${store.filters.dietary.includes('Vegetarian') ? 'checked' : ''} class="accent-primary rounded"/>
                <span class="text-on-surface">Vegetarian</span>
              </label>
              <label class="flex items-center gap-2.5 p-2 rounded-lg hover:bg-surface-container cursor-pointer transition-colors">
                <input type="checkbox" id="dietary-halal" value="Halal" ${store.filters.dietary.includes('Halal') ? 'checked' : ''} class="accent-primary rounded"/>
                <span class="text-on-surface">Halal</span>
              </label>
            </div>
          </div>
        </aside>

        <!-- Search Results Grid & Controls -->
        <div class="flex-1 flex flex-col">
          <!-- Top Bar: Search Query & Sorter -->
          <div class="bg-surface-container-lowest p-4 rounded-2xl border border-surface-variant/60 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <div class="w-full sm:w-80 relative">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-base">search</span>
              <input 
                id="search-input-field"
                type="text" 
                placeholder="Search restaurants or dishes..." 
                value="${store.filters.q || ''}" 
                class="w-full bg-surface-container-low border-transparent focus:border-primary-container focus:ring-1 focus:ring-primary-container rounded-xl pl-9 pr-3 py-2 text-sm font-semibold outline-none"
              />
            </div>

            <div class="flex items-center gap-3 w-full sm:w-auto justify-end">
              <span class="text-xs font-bold text-secondary uppercase">Sort by:</span>
              <select id="sort-select" class="bg-surface-container-low border border-surface-variant rounded-xl px-3 py-2 text-xs font-bold text-on-surface outline-none cursor-pointer">
                <option value="" ${!store.filters.sortBy ? 'selected' : ''}>Recommended</option>
                <option value="rating" ${store.filters.sortBy === 'rating' ? 'selected' : ''}>Highest Rated</option>
                <option value="deliveryTime" ${store.filters.sortBy === 'deliveryTime' ? 'selected' : ''}>Fastest Delivery</option>
              </select>
            </div>
          </div>

          <!-- Active Filter Indicators -->
          <div id="active-filter-pills" class="flex flex-wrap gap-2 mb-4"></div>

          <!-- Restaurant Cards Grid -->
          <div id="search-results-grid" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Rendered dynamically -->
          </div>
        </div>
      </div>
    `;

    // Bind event handlers
    const searchInput = document.getElementById('search-input-field');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        store.setFilter('q', e.target.value);
        loadResults();
      });
    }

    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        store.setFilter('sortBy', e.target.value);
        loadResults();
      });
    }

    document.querySelectorAll('input[name="cuisine"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        store.setFilter('cuisine', e.target.value);
        loadResults();
      });
    });

    document.querySelectorAll('.filter-price-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.dataset.price;
        store.setFilter('price', store.filters.price === val ? '' : val);
        renderSearchView(container, queryParams);
      });
    });

    document.querySelectorAll('input[name="rating"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        store.setFilter('rating', e.target.value);
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

    async function loadResults() {
      const resultsContainer = document.getElementById('search-results-grid');
      const pillsContainer = document.getElementById('active-filter-pills');
      if (!resultsContainer) return;

      // Update pills
      if (pillsContainer) {
        const pills = [];
        if (store.filters.q) pills.push(`Query: "${store.filters.q}"`);
        if (store.filters.cuisine) pills.push(`Cuisine: ${store.filters.cuisine}`);
        if (store.filters.price) pills.push(`Price: ${'₹'.repeat(store.filters.price)}`);
        if (store.filters.rating) pills.push(`Rating: ${store.filters.rating}+`);
        if (store.filters.dietary) pills.push(`Dietary: ${store.filters.dietary}`);

        pillsContainer.innerHTML = pills.map(p => `
          <span class="bg-primary-fixed text-primary px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
            <span>${p}</span>
          </span>
        `).join('');
      }

      resultsContainer.innerHTML = `
        <div class="col-span-2 py-16 flex flex-col items-center justify-center text-secondary">
          <span class="material-symbols-outlined text-4xl animate-spin text-primary mb-2">progress_activity</span>
          <span class="text-sm font-semibold">Searching top restaurants, cafes & food carts...</span>
        </div>
      `;

      try {
        const query = { ...store.filters };
        if (store.userCoords) {
          query.lat = store.userCoords.lat;
          query.lng = store.userCoords.lng;
        }
        const res = await window.foodlyApi.getRestaurants(query);
        if (!res.success || res.data.length === 0) {
          resultsContainer.innerHTML = `
            <div class="col-span-2 py-16 bg-surface-container-lowest rounded-2xl border border-surface-variant flex flex-col items-center justify-center text-center p-8">
              <span class="material-symbols-outlined text-5xl text-secondary mb-3">search_off</span>
              <h3 class="text-lg font-bold text-on-surface mb-1">No places match your filters</h3>
              <p class="text-xs text-on-surface-variant max-w-sm mb-4">Try clearing some of your search filters or searching for another dish, cafe, or food cart.</p>
              <button onclick="window.foodlyStore.clearFilters(); location.hash = '#search';" class="bg-primary text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors">
                Reset Filters
              </button>
            </div>
          `;
          return;
        }

        resultsContainer.innerHTML = res.data.map(rest => {
          const distanceBadge = (rest.distanceKm !== null && rest.distanceKm !== undefined)
            ? `<span class="absolute top-3 right-3 bg-tertiary text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-0.5">
                 <span class="material-symbols-outlined text-xs">near_me</span>
                 ${rest.distanceKm} km
               </span>`
            : '';

          return `
          <div class="bg-surface-container-lowest border border-surface-variant rounded-2xl overflow-hidden card-shadow flex flex-col">
            <a href="#restaurant/${rest.id}" class="block relative h-48 w-full overflow-hidden group">
              <img src="${rest.heroImage}" alt="${rest.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
              <div class="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                ${rest.type === 'food-cart' ? '<span class="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-0.5"><span class="material-symbols-outlined text-[10px]">storefront</span>Cart</span>' : ''}
                ${(rest.type === 'cafe' || rest.isCafe) && rest.type !== 'food-cart' ? '<span class="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-0.5"><span class="material-symbols-outlined text-[10px]">local_cafe</span>Cafe</span>' : ''}
                ${rest.bestseller ? '<span class="bg-primary-container text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">Bestseller</span>' : ''}
                ${(rest.dietary && rest.dietary.includes('Vegetarian')) ? '<span class="bg-tertiary-container text-on-tertiary-container text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">Pure Veg</span>' : ''}
              </div>
              ${distanceBadge}
              <div class="absolute bottom-3 right-3 bg-surface-container-lowest/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-md text-on-surface">
                <span class="material-symbols-outlined text-secondary text-sm">schedule</span>
                <span>${rest.deliveryTime}</span>
              </div>
            </a>

            <div class="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-start mb-1">
                  <a href="#restaurant/${rest.id}" class="font-bold text-lg text-on-surface hover:text-primary transition-colors">
                    ${rest.name}
                  </a>
                  <div class="flex items-center gap-1 bg-tertiary-container/20 text-tertiary px-2 py-0.5 rounded-md text-xs font-bold">
                    <span class="material-symbols-outlined text-xs filled">star</span>
                    <span>${rest.rating}</span>
                    <span class="text-[10px] text-on-surface-variant font-normal">(${rest.reviewsCount})</span>
                  </div>
                </div>

                <p class="text-xs text-on-surface-variant line-clamp-1 mb-2 font-medium">${rest.headline}</p>

                <div class="flex items-center gap-2 text-xs text-secondary mb-4">
                  <span>${rest.cuisines.join(', ')}</span>
                  <span>•</span>
                  <span class="font-bold text-on-surface">${rest.priceTier}</span>
                  <span>•</span>
                  <span>Min &#8377;${rest.minOrder}</span>
                </div>
              </div>

              <div class="flex items-center justify-between pt-3 border-t border-surface-variant/50 text-xs">
                <span class="text-on-surface-variant font-medium">
                  Delivery: <strong class="text-on-surface">&#8377;${rest.deliveryFee}</strong>
                </span>
                <a href="#restaurant/${rest.id}" class="bg-primary text-white font-bold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
                  View Menu
                </a>
              </div>
            </div>
          </div>
          `;
        }).join('');
      } catch (e) {
        console.error("Error fetching search results", e);
      }
    }

    loadResults();
  }

  window.renderSearchView = renderSearchView;
})();
