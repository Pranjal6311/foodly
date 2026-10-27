// public/js/views/restaurantView.js - Restaurant Detail View (Interactive Menu & Instant Cart)
(function () {
  async function renderRestaurantView(container, restaurantId) {
    container.innerHTML = `
      <div class="py-20 flex justify-center items-center text-secondary">
        <span class="material-symbols-outlined text-4xl animate-spin text-primary mr-2">progress_activity</span>
        <span class="font-bold text-sm">Loading restaurant & cafe menu...</span>
      </div>
    `;

    try {
      const res = await window.foodlyApi.getRestaurant(restaurantId);
      if (!res.success || !res.data) {
        container.innerHTML = `
          <div class="p-12 text-center bg-surface-container-lowest max-w-lg mx-auto rounded-3xl border border-surface-variant my-12 shadow-sm">
            <span class="material-symbols-outlined text-5xl text-secondary mb-3">restaurant_menu</span>
            <h3 class="text-xl font-black text-on-surface mb-2">Restaurant Menu Unavailable</h3>
            <p class="text-xs text-secondary mb-6">We could not load this dining spot right now. Please browse other top campus cafes, restros, and hotels.</p>
            <a href="#search" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs shadow-md">
              <span class="material-symbols-outlined text-sm">arrow_back</span>
              <span>Back to Food Explore</span>
            </a>
          </div>
        `;
        return;
      }

      const rest = res.data;
      const store = window.foodlyStore;

      // Safe fallback for menu items
      let menu = (Array.isArray(rest.menu) && rest.menu.length > 0) ? rest.menu : (function () {
        const isCafe = rest.isCafe || rest.type === 'cafe';
        if (isCafe) {
          return [
            { id: rest.id + '-1', name: 'Artisan Cold Frappe Coffee', category: 'Coffees & Shakes', price: 140, description: 'Chilled Arabica espresso blended with ice cream and dark cocoa.', image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80', veg: true, tags: ['Bestseller'], nutrition: { calories: 280, protein: 7, carbs: 38 } },
            { id: rest.id + '-2', name: 'Cheese Grilled Club Sandwich', category: 'Sandwiches & Snacks', price: 120, description: 'Triple decker sandwich stuffed with veggies and melted mozzarella.', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80', veg: true, tags: ['Cheesy'], nutrition: { calories: 390, protein: 14, carbs: 46 } },
            { id: rest.id + '-3', name: 'Hot Chocolate Fudge Brownie', category: 'Desserts', price: 95, description: 'Dense warm chocolate brownie with hot fudge sauce.', image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80', veg: true, tags: ['Sweet'], nutrition: { calories: 340, protein: 5, carbs: 48 } }
          ];
        }
        return [
          { id: rest.id + '-1', name: 'Special Paneer Butter Masala Combo', category: 'Combos & Thalis', price: 180, description: 'Paneer butter masala served with 2 butter naans, jeera rice, and salad.', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80', veg: true, tags: ['Bestseller'], nutrition: { calories: 620, protein: 24, carbs: 70 } },
          { id: rest.id + '-2', name: 'Amritsari Chole Bhature (2 pcs)', category: 'Combos & Thalis', price: 130, description: 'Fluffy bhaturas with spiced chickpeas and pickled onions.', image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80', veg: true, tags: ['Popular'], nutrition: { calories: 540, protein: 17, carbs: 74 } },
          { id: rest.id + '-3', name: 'Fresh Masala Chaas (Spiced Buttermilk)', category: 'Beverages', price: 40, description: 'Chilled churned curd seasoned with roasted cumin and mint.', image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80', veg: true, tags: ['Refreshing'], nutrition: { calories: 80, protein: 4, carbs: 8 } }
        ];
      })();

      // Safely compute menu categories
      let menuCategories = (Array.isArray(rest.menuCategories) && rest.menuCategories.length > 0)
        ? [...new Set(rest.menuCategories.filter(Boolean))]
        : [...new Set(menu.map(m => m.category).filter(Boolean))];

      if (menuCategories.length === 0) {
        menuCategories = ["Chef's Specials", "Main Course", "Beverages"];
      }

      // Filter state inside this view
      let searchQuery = '';
      let vegOnly = false;

      function renderFullView() {
        container.innerHTML = `
          <div class="fade-in">
            <!-- Hero Section -->
            <section class="relative w-full h-[360px] md:h-[420px] bg-surface-container overflow-hidden">
              <div 
                class="absolute inset-0 bg-cover bg-center w-full h-full transform hover:scale-105 transition-transform duration-700" 
                style="background-image: url('${rest.heroImage || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80'}')"
              ></div>
              <div class="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
              
              <div class="absolute bottom-0 w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pb-6">
                <div class="bg-surface-container-lowest/95 backdrop-blur-md p-6 md:p-8 rounded-2xl shadow-xl border border-surface-variant max-w-2xl inline-block">
                  <div class="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span class="bg-primary-container text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                      ${rest.type === 'food-cart' ? 'Food Cart' : ((rest.type === 'cafe' || rest.isCafe) ? 'Cafe' : 'Restaurant')}
                    </span>
                    <span class="text-xs font-semibold text-secondary">${rest.area ? rest.area + ' &bull; ' : ''}${(rest.cuisines || []).join(' &bull; ')}</span>
                  </div>
                  <h1 class="text-2xl md:text-4xl font-extrabold text-on-surface mb-2 tracking-tight">${rest.name}</h1>
                  <p class="text-xs md:text-sm text-on-surface-variant mb-4 font-medium">${rest.headline || ''}</p>
                  
                  <div class="flex flex-wrap gap-4 items-center text-xs md:text-sm font-bold text-on-surface">
                    <div class="flex items-center gap-1.5 text-primary">
                      <span class="material-symbols-outlined text-primary-container text-lg filled">star</span>
                      <span>${rest.rating || '4.8'} (${rest.reviewsCount || '1.2k+'})</span>
                    </div>
                    <div class="h-4 w-px bg-surface-variant"></div>
                    <div class="flex items-center gap-1.5 text-secondary">
                      <span class="material-symbols-outlined text-base">schedule</span>
                      <span>${rest.deliveryTime || '20-30 min'}</span>
                    </div>
                    <div class="h-4 w-px bg-surface-variant"></div>
                    <span class="px-2.5 py-0.5 bg-secondary-container/50 text-on-secondary-container rounded-full">${rest.priceTier || '₹₹'}</span>
                    <div class="h-4 w-px bg-surface-variant"></div>
                    <span class="text-secondary font-medium">Delivery: ${rest.deliveryFee === 0 ? '<strong class="text-emerald-700">₹0 Free Campus Pool</strong>' : '₹' + rest.deliveryFee}</span>
                  </div>
                </div>
              </div>
            </section>

            <!-- Main Layout: Sidebar Categories + Menu Items + Live Sticky Cart -->
            <div class="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-8 grid grid-cols-12 gap-gutter relative">
              <!-- Left Sticky Category Navigation (Desktop) -->
              <aside class="col-span-12 lg:col-span-2 hidden lg:block sticky top-28 h-fit">
                <h3 class="text-lg font-extrabold mb-3 text-on-surface flex items-center justify-between">
                  <span>Menu</span>
                  <span class="text-xs font-bold text-secondary bg-surface-container px-2 py-0.5 rounded-full">${menu.length} items</span>
                </h3>
                <nav class="flex flex-col gap-1 text-sm font-semibold">
                  ${menuCategories.map((cat, idx) => `
                    <a 
                      href="#cat-${cat.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}" 
                      class="px-4 py-2 rounded-xl transition-all ${idx === 0 ? 'bg-primary-container/15 text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'}"
                    >
                      ${cat}
                    </a>
                  `).join('')}
                </nav>
              </aside>

              <!-- Center Column: Search/Filter Controls + Menu Items List -->
              <div class="col-span-12 lg:col-span-6 xl:col-span-7 flex flex-col gap-6">
                
                <!-- Menu Filter & Dish Search Toolbar -->
                <div class="bg-surface-container-lowest p-3.5 rounded-2xl border border-surface-variant shadow-sm flex flex-col sm:flex-row items-center gap-3">
                  <div class="relative flex-1 w-full">
                    <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-base">search</span>
                    <input 
                      id="menu-search-input" 
                      type="text" 
                      placeholder="Search in this menu (e.g. coffee, burger, thali, dosa)..." 
                      value="${searchQuery}" 
                      class="w-full bg-surface-container-low border border-surface-variant/40 focus:border-primary-container rounded-xl pl-9 pr-3 py-2 text-xs font-semibold outline-none text-on-surface"
                    />
                  </div>
                  <button 
                    id="menu-veg-toggle" 
                    class="w-full sm:w-auto px-4 py-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${vegOnly ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' : 'bg-surface-container-low text-on-surface border-surface-variant hover:border-emerald-600'}"
                  >
                    <span class="w-3 h-3 rounded-full ${vegOnly ? 'bg-white' : 'bg-emerald-600'}"></span>
                    <span>Pure Veg Only</span>
                  </button>
                </div>

                <!-- Mobile Horizontal Category Chips Bar -->
                <div class="lg:hidden flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                  ${menuCategories.map(cat => `
                    <a 
                      href="#cat-${cat.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}" 
                      class="px-3.5 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container border border-surface-variant text-on-surface text-xs font-bold whitespace-nowrap transition-colors"
                    >
                      ${cat}
                    </a>
                  `).join('')}
                </div>

                <!-- Category Sections -->
                <div id="menu-sections-wrapper" class="flex flex-col gap-8">
                  ${renderFilteredSections()}
                </div>
              </div>

              <!-- Right Sticky Cart Sidebar -->
              <aside class="col-span-12 lg:col-span-4 xl:col-span-3">
                <div class="bg-surface-container-lowest border border-surface-variant rounded-2xl sticky top-28 shadow-sm flex flex-col max-h-[calc(100vh-140px)] overflow-hidden">
                  <div class="p-4 border-b border-surface-variant bg-surface-container-low flex justify-between items-center">
                    <div>
                      <h3 class="font-bold text-base text-on-surface flex items-center gap-1.5">
                        <span>Your Cart</span>
                        <span class="material-symbols-outlined text-primary text-xl">shopping_basket</span>
                      </h3>
                      <p class="text-xs text-on-surface-variant font-semibold truncate max-w-[180px]">${rest.name}</p>
                    </div>
                    <span id="side-cart-count" class="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      ${store.getCartCount()}
                    </span>
                  </div>

                  <div id="side-cart-items" class="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                    <!-- Rendered dynamically -->
                  </div>

                  <div id="side-cart-bill" class="p-4 border-t border-surface-variant bg-surface-container-low">
                    <!-- Rendered dynamically -->
                  </div>
                </div>
              </aside>
            </div>
          </div>
        `;

        bindMenuEvents();
        updateSideCart();
      }

      function renderDishActionButton(item) {
        const cartItem = store.cart.items.find(i => i.id === item.id);
        if (cartItem && cartItem.quantity > 0) {
          return `
            <div class="dish-stepper flex items-center justify-between w-full bg-emerald-600 text-white rounded-xl shadow-md overflow-hidden p-0.5 border border-emerald-500">
              <button data-dish-id="${item.id}" class="dish-qty-dec flex-1 py-1.5 flex items-center justify-center font-black text-sm hover:bg-emerald-700 active:scale-90 transition-all cursor-pointer" title="Decrease">
                <span class="material-symbols-outlined text-sm">remove</span>
              </button>
              <span class="px-2 font-black text-xs min-w-[20px] text-center">${cartItem.quantity}</span>
              <button data-dish-id="${item.id}" class="dish-qty-inc flex-1 py-1.5 flex items-center justify-center font-black text-sm hover:bg-emerald-700 active:scale-90 transition-all cursor-pointer" title="Increase">
                <span class="material-symbols-outlined text-sm">add</span>
              </button>
            </div>
          `;
        }
        return `
          <button 
            data-dish-id="${item.id}"
            class="add-to-cart-btn w-full bg-surface-container-lowest border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-600 hover:text-white font-black text-xs py-1.5 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer flex items-center justify-center gap-1"
          >
            <span class="material-symbols-outlined text-sm">add</span>
            <span>ADD</span>
          </button>
        `;
      }

      function renderFilteredSections() {
        let q = searchQuery.toLowerCase().trim();
        let renderedSectionsHtml = '';
        let totalRenderedDishes = 0;

        menuCategories.forEach(cat => {
          let items = menu.filter(item => {
            const matchesCat = item.category === cat || (item.category || '').toLowerCase() === cat.toLowerCase();
            return matchesCat;
          });

          // Apply filters
          if (vegOnly) {
            items = items.filter(item => item.veg === true);
          }
          if (q) {
            items = items.filter(item => 
              item.name.toLowerCase().includes(q) || 
              (item.description || '').toLowerCase().includes(q)
            );
          }

          if (items.length === 0) return;
          totalRenderedDishes += items.length;

          renderedSectionsHtml += `
            <section id="cat-${cat.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}" class="scroll-mt-28">
              <h2 class="text-xl font-extrabold mb-4 text-on-surface flex items-center gap-2">
                <span>${cat}</span>
                <span class="text-xs font-bold text-secondary bg-surface-container px-2 py-0.5 rounded-full">${items.length}</span>
              </h2>
              
              <div class="flex flex-col gap-4">
                ${items.map(item => `
                  <div class="bg-surface-container-lowest border border-surface-variant rounded-2xl p-4 md:p-5 flex gap-4 hover:shadow-md transition-shadow">
                    <div class="flex-1 flex flex-col justify-between">
                      <div>
                        <div class="flex items-center gap-2 mb-1">
                          ${item.veg 
                            ? '<span class="w-4 h-4 rounded-sm border-2 border-emerald-600 flex items-center justify-center shrink-0" title="Pure Veg"><span class="w-2 h-2 rounded-full bg-emerald-600"></span></span>' 
                            : '<span class="w-4 h-4 rounded-sm border-2 border-rose-600 flex items-center justify-center shrink-0" title="Non-Vegetarian"><span class="w-2 h-2 rounded-full bg-rose-600"></span></span>'
                          }
                          <h4 class="font-bold text-base text-on-surface">${item.name}</h4>
                        </div>
                        <p class="text-sm font-extrabold text-primary mb-1.5">&#8377;${item.price.toFixed(0)}</p>
                        <p class="text-xs text-on-surface-variant leading-relaxed line-clamp-2">${item.description || ''}</p>
                      </div>

                      <div class="mt-2.5 flex items-center gap-1.5 flex-wrap">
                        <span class="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 font-extrabold text-[10px] flex items-center gap-0.5">
                          🔥 ${item.nutrition ? item.nutrition.calories : 350} kcal
                        </span>
                        <span class="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 font-extrabold text-[10px] flex items-center gap-0.5">
                          💪 ${item.nutrition ? item.nutrition.protein : 18}g Protein
                        </span>
                        <span class="px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-700 font-extrabold text-[10px]">
                          🌾 ${item.nutrition ? item.nutrition.carbs : 45}g Carbs
                        </span>
                      </div>

                      <div class="mt-2 text-[10.5px] font-semibold text-emerald-700 flex items-center gap-1">
                        <span class="material-symbols-outlined text-xs filled text-emerald-600">verified</span>
                        <span>FairPrice: Dine-in match! (Swiggy/Zomato: &#8377;${item.fairPrice ? item.fairPrice.swiggyZomatoPrice : Math.round(item.price * 1.25 + 15)})</span>
                      </div>

                      <div class="mt-3 flex flex-wrap gap-2">
                        ${item.tags ? item.tags.map(tag => `
                          <span class="px-2 py-0.5 rounded-full text-[11px] font-bold ${tag === 'Bestseller' ? 'bg-primary-container/15 text-primary' : tag === 'Spicy' ? 'bg-error-container/40 text-error' : 'bg-surface-container text-secondary'}">${tag}</span>
                        `).join('') : ''}
                      </div>
                    </div>

                    <div class="w-28 md:w-32 flex flex-col items-center gap-2 shrink-0">
                      <div class="w-28 h-28 md:w-32 md:h-32 rounded-xl overflow-hidden bg-surface-container-high relative">
                        <img 
                          src="${item.image}" 
                          alt="${item.name}" 
                          class="w-full h-full object-cover"
                          onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'"
                        />
                      </div>
                      <div class="w-full" id="dish-action-slot-${item.id}">
                        ${renderDishActionButton(item)}
                      </div>
                      ${window.foodlyStore.activeGroupRoom ? `
                        <button 
                          data-dish-id="${item.id}"
                          class="add-to-room-btn w-full bg-emerald-50 border border-emerald-500 text-emerald-700 font-bold text-[10px] py-1 rounded-lg hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-95 cursor-pointer flex items-center justify-center gap-0.5"
                          title="Add to shared Group Room (${window.foodlyStore.activeGroupRoom.code})"
                        >
                          <span>+ Group Room</span>
                        </button>
                      ` : ''}
                    </div>
                  </div>
                `).join('')}
              </div>
            </section>
          `;
        });

        // Also check unmapped items if any
        const unmappedItems = menu.filter(item => {
          const matchesKnownCat = menuCategories.some(cat => cat.toLowerCase() === (item.category || '').toLowerCase());
          if (matchesKnownCat) return false;
          if (vegOnly && !item.veg) return false;
          if (q && !item.name.toLowerCase().includes(q) && !(item.description || '').toLowerCase().includes(q)) return false;
          return true;
        });

        if (unmappedItems.length > 0) {
          totalRenderedDishes += unmappedItems.length;
          renderedSectionsHtml += `
            <section id="cat-more-delicacies" class="scroll-mt-28">
              <h2 class="text-xl font-extrabold mb-4 text-on-surface flex items-center gap-2">
                <span>More Delicacies</span>
                <span class="text-xs font-bold text-secondary bg-surface-container px-2 py-0.5 rounded-full">${unmappedItems.length}</span>
              </h2>
              <div class="flex flex-col gap-4">
                ${unmappedItems.map(item => `
                  <div class="bg-surface-container-lowest border border-surface-variant rounded-2xl p-4 md:p-5 flex gap-4 hover:shadow-md transition-shadow">
                    <div class="flex-1 flex flex-col justify-between">
                      <div>
                        <div class="flex items-center gap-2 mb-1">
                          ${item.veg 
                            ? '<span class="w-4 h-4 rounded-sm border-2 border-emerald-600 flex items-center justify-center shrink-0" title="Pure Veg"><span class="w-2 h-2 rounded-full bg-emerald-600"></span></span>' 
                            : '<span class="w-4 h-4 rounded-sm border-2 border-rose-600 flex items-center justify-center shrink-0" title="Non-Vegetarian"><span class="w-2 h-2 rounded-full bg-rose-600"></span></span>'
                          }
                          <h4 class="font-bold text-base text-on-surface">${item.name}</h4>
                        </div>
                        <p class="text-sm font-extrabold text-primary mb-1.5">&#8377;${item.price.toFixed(0)}</p>
                        <p class="text-xs text-on-surface-variant leading-relaxed line-clamp-2">${item.description || ''}</p>
                      </div>
                    </div>
                    <div class="w-28 md:w-32 flex flex-col items-center gap-2 shrink-0">
                      <div class="w-28 h-28 md:w-32 md:h-32 rounded-xl overflow-hidden bg-surface-container-high relative">
                        <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover"/>
                      </div>
                      <div class="w-full">
                        ${renderDishActionButton(item)}
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </section>
          `;
        }

        if (totalRenderedDishes === 0) {
          return `
            <div class="p-12 text-center bg-surface-container-lowest rounded-2xl border border-surface-variant">
              <span class="material-symbols-outlined text-4xl text-secondary mb-2">search_off</span>
              <h4 class="font-black text-sm text-on-surface mb-1">No dishes match your filter</h4>
              <p class="text-xs text-secondary mb-4">Try clearing the dish search or toggle pure veg off.</p>
              <button id="reset-menu-filters-btn" class="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl cursor-pointer">
                Reset Menu Filters
              </button>
            </div>
          `;
        }

        return renderedSectionsHtml;
      }

      function bindMenuEvents() {
        // Dish Search input
        const searchInput = document.getElementById('menu-search-input');
        if (searchInput) {
          searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            const wrapper = document.getElementById('menu-sections-wrapper');
            if (wrapper) wrapper.innerHTML = renderFilteredSections();
            bindCartButtons();
          });
        }

        // Veg Only toggle
        const vegToggle = document.getElementById('menu-veg-toggle');
        if (vegToggle) {
          vegToggle.addEventListener('click', () => {
            vegOnly = !vegOnly;
            renderFullView();
          });
        }

        // Reset filter button
        document.getElementById('reset-menu-filters-btn')?.addEventListener('click', () => {
          searchQuery = '';
          vegOnly = false;
          renderFullView();
        });

        bindCartButtons();
      }

      function refreshDishesUI() {
        const wrapper = document.getElementById('menu-sections-wrapper');
        if (wrapper) wrapper.innerHTML = renderFilteredSections();
        bindCartButtons();
        updateSideCart();
        if (window.updateMobileFloatingCart) window.updateMobileFloatingCart();
      }

      function bindCartButtons() {
        // Add to Cart buttons
        container.querySelectorAll('.add-to-cart-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const dishId = btn.dataset.dishId;
            const dish = menu.find(d => d.id === dishId);
            if (dish) {
              store.addToCart(dish, rest);
              refreshDishesUI();
            }
          });
        });

        // Stepper Quantity Increase
        container.querySelectorAll('.dish-qty-inc').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const dishId = btn.dataset.dishId;
            const item = store.cart.items.find(i => i.id === dishId);
            if (item) {
              store.updateQuantity(dishId, item.quantity + 1);
              refreshDishesUI();
            }
          });
        });

        // Stepper Quantity Decrease
        container.querySelectorAll('.dish-qty-dec').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const dishId = btn.dataset.dishId;
            const item = store.cart.items.find(i => i.id === dishId);
            if (item) {
              store.updateQuantity(dishId, item.quantity - 1);
              refreshDishesUI();
            }
          });
        });

        // Add to Group Room buttons
        container.querySelectorAll('.add-to-room-btn').forEach(btn => {
          btn.addEventListener('click', async () => {
            const dishId = btn.dataset.dishId;
            const dish = menu.find(d => d.id === dishId);
            if (dish && window.foodlyGroupOrder) {
              const added = await window.foodlyGroupOrder.addItemToCurrentRoom(dish);
              if (added && store.showToast) {
                store.showToast(`Added ${dish.name} to Group Room!`, 'success');
              }
            }
          });
        });
      }

      function updateSideCart() {
        const itemsContainer = document.getElementById('side-cart-items');
        const billContainer = document.getElementById('side-cart-bill');
        const countBadge = document.getElementById('side-cart-count');

        if (!itemsContainer || !billContainer) return;

        const cart = store.cart;
        const bill = store.getBillDetails(rest.deliveryFee || 0);
        const nutrition = store.getNutritionSummary();
        const fairPrice = store.getFairPriceSummary();

        if (countBadge) countBadge.innerText = store.getCartCount();

        if (cart.items.length === 0) {
          itemsContainer.innerHTML = `
            <div class="py-8 text-center text-secondary text-xs">
              <span class="material-symbols-outlined text-3xl mb-1 opacity-50">shopping_bag</span>
              <p>Add delicious items from the menu to build your feast!</p>
            </div>
          `;
          billContainer.innerHTML = `
            <div class="text-xs text-secondary text-center py-2 font-medium">Cart is currently empty</div>
          `;
          return;
        }

        itemsContainer.innerHTML = `
          <!-- Live Macro Nutrition Bar -->
          <div class="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs mb-1">
            <div class="flex justify-between items-center font-extrabold text-on-surface mb-1">
              <span class="flex items-center gap-1">
                <span>🔥</span> Macros (Health: ${nutrition.healthGrade})
              </span>
              <span class="text-amber-800">${nutrition.calories} kcal</span>
            </div>
            <div class="flex justify-between text-[11px] text-on-surface-variant font-bold">
              <span class="text-emerald-700">💪 Protein: ${nutrition.protein}g</span>
              <span class="text-sky-700">🌾 Carbs: ${nutrition.carbs}g</span>
              <span class="text-amber-700">🥑 Fats: ${nutrition.fats}g</span>
            </div>
          </div>

          <!-- FairPrice Audit Strip -->
          <div class="p-2 rounded-xl bg-emerald-50 border border-emerald-300 text-[11px] text-emerald-800 font-bold flex items-center justify-between">
            <span class="flex items-center gap-1">
              <span class="material-symbols-outlined text-sm text-emerald-600 filled">verified</span>
              FairPrice Guarantee:
            </span>
            <span class="text-emerald-700 font-extrabold">Save &#8377;${fairPrice.totalSavings} vs Zomato</span>
          </div>

          ${cart.items.map(item => `
            <div class="flex justify-between items-start text-xs border-b border-surface-variant/40 pb-2.5 last:border-none">
              <div class="flex gap-2">
                <div class="flex items-center border border-surface-variant rounded bg-surface-container-lowest">
                  <button onclick="window.foodlyStore.updateQuantity('${item.id}', -1)" class="w-5 h-5 flex items-center justify-center text-secondary hover:bg-surface-container font-bold cursor-pointer">-</button>
                  <span class="w-5 h-5 flex items-center justify-center font-bold">${item.quantity}</span>
                  <button onclick="window.foodlyStore.updateQuantity('${item.id}', 1)" class="w-5 h-5 flex items-center justify-center text-secondary hover:bg-surface-container font-bold cursor-pointer">+</button>
                </div>
                <div>
                  <h5 class="font-bold text-on-surface leading-tight">${item.name}</h5>
                  <button onclick="window.foodlyStore.removeFromCart('${item.id}')" class="text-[10px] text-error hover:underline mt-0.5 cursor-pointer">Remove</button>
                </div>
              </div>
              <span class="font-bold text-on-surface">&#8377;${(item.price * item.quantity).toFixed(0)}</span>
            </div>
          `).join('')}
        `;

        billContainer.innerHTML = `
          <div class="flex flex-col gap-1.5 mb-3 text-xs text-on-surface-variant">
            <div class="flex justify-between">
              <span>Subtotal</span>
              <span class="font-semibold text-on-surface">&#8377;${bill.subtotal.toFixed(0)}</span>
            </div>
            ${bill.discount > 0 ? `
              <div class="flex justify-between text-tertiary font-bold">
                <span>Discount</span>
                <span>-&#8377;${bill.discount.toFixed(0)}</span>
              </div>
            ` : ''}
            <div class="flex justify-between">
              <span>Delivery Fee</span>
              <span class="font-semibold text-on-surface">${bill.deliveryFee === 0 ? '<strong class="text-emerald-700">FREE (Campus Mode)</strong>' : `&#8377;${bill.deliveryFee.toFixed(0)}`}</span>
            </div>
            <div class="flex justify-between">
              <span>Taxes & Fees</span>
              <span class="font-semibold text-on-surface">&#8377;${bill.taxes.toFixed(0)}</span>
            </div>
            <div class="h-px bg-surface-variant/80 my-1"></div>
            <div class="flex justify-between items-center text-sm font-extrabold text-on-surface">
              <span>Total</span>
              <span class="text-primary text-base">&#8377;${bill.total.toFixed(0)}</span>
            </div>
          </div>

          <button 
            id="side-cart-checkout-btn"
            class="w-full bg-primary-container text-white font-bold text-xs py-3 rounded-xl hover:bg-primary transition-colors flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
          >
            <span>Proceed to Checkout</span>
            <span class="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        `;

        document.getElementById('side-cart-checkout-btn')?.addEventListener('click', () => {
          window.location.hash = '#checkout';
        });
      }

      renderFullView();

      // Listen for cart changes
      store.subscribe((event) => {
        if (event === 'CART_UPDATED') {
          updateSideCart();
        }
      });
    } catch (e) {
      console.error("Error loading restaurant detail", e);
      container.innerHTML = `
        <div class="p-12 text-center text-error bg-surface-container-lowest max-w-md mx-auto my-12 rounded-2xl border border-surface-variant">
          Failed to load restaurant details. Please refresh or try another restaurant.
        </div>
      `;
    }
  }

  window.renderRestaurantView = renderRestaurantView;
})();
