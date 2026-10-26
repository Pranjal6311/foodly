// public/js/views/restaurantView.js - Restaurant Detail View (1:1 Stitch UI Replication)
(function () {
  async function renderRestaurantView(container, restaurantId) {
    container.innerHTML = `
      <div class="py-20 flex justify-center items-center text-secondary">
        <span class="material-symbols-outlined text-4xl animate-spin text-primary mr-2">progress_activity</span>
        <span class="font-bold text-sm">Loading restaurant menu...</span>
      </div>
    `;

    try {
      const res = await window.foodlyApi.getRestaurant(restaurantId);
      if (!res.success) {
        container.innerHTML = `<div class="p-8 text-center text-error">Restaurant not found</div>`;
        return;
      }

      const rest = res.data;
      const store = window.foodlyStore;

      container.innerHTML = `
        <div class="fade-in">
          <!-- Hero Section (Direct from Stitch foodly-restaurant-detail.html) -->
          <section class="relative w-full h-[380px] md:h-[420px] bg-surface-container overflow-hidden">
            <div 
              class="absolute inset-0 bg-cover bg-center w-full h-full transform hover:scale-105 transition-transform duration-700" 
              style="background-image: url('${rest.heroImage}')"
            ></div>
            <div class="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
            
            <div class="absolute bottom-0 w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pb-6">
              <div class="bg-surface-container-lowest/95 backdrop-blur-md p-6 md:p-8 rounded-2xl shadow-xl border border-surface-variant max-w-2xl inline-block">
                <div class="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span class="bg-primary-container text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                    ${rest.type === 'food-cart' ? 'Food Cart' : ((rest.type === 'cafe' || rest.isCafe) ? 'Cafe' : 'Restaurant')}
                  </span>
                  <span class="text-xs font-semibold text-secondary">${rest.area ? rest.area + ' &bull; ' : ''}${rest.cuisines.join(' &bull; ')}</span>
                </div>
                <h1 class="text-2xl md:text-4xl font-extrabold text-on-surface mb-2 tracking-tight">${rest.name}</h1>
                <p class="text-xs md:text-sm text-on-surface-variant mb-4 font-medium">${rest.headline}</p>
                
                <div class="flex flex-wrap gap-4 items-center text-xs md:text-sm font-bold text-on-surface">
                  <div class="flex items-center gap-1.5 text-primary">
                    <span class="material-symbols-outlined text-primary-container text-lg filled">star</span>
                    <span>${rest.rating} (${rest.reviewsCount})</span>
                  </div>
                  <div class="h-4 w-px bg-surface-variant"></div>
                  <div class="flex items-center gap-1.5 text-secondary">
                    <span class="material-symbols-outlined text-base">schedule</span>
                    <span>${rest.deliveryTime}</span>
                  </div>
                  <div class="h-4 w-px bg-surface-variant"></div>
                  <span class="px-2.5 py-0.5 bg-secondary-container/50 text-on-secondary-container rounded-full">${rest.priceTier}</span>
                  <div class="h-4 w-px bg-surface-variant"></div>
                  <span class="text-secondary font-medium">Delivery: &#8377;${rest.deliveryFee.toFixed(0)}</span>
                </div>
              </div>
            </div>
          </section>

          <!-- Main Layout: Sidebar Categories + Menu Items + Live Sticky Cart -->
          <div class="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-8 grid grid-cols-12 gap-gutter relative">
            <!-- Left Sticky Category Navigation -->
            <aside class="col-span-12 lg:col-span-2 hidden lg:block sticky top-28 h-fit">
              <h3 class="text-lg font-extrabold mb-3 text-on-surface">Menu</h3>
              <nav class="flex flex-col gap-1 text-sm font-semibold">
                ${rest.menuCategories.map((cat, idx) => `
                  <a 
                    href="#cat-${cat.replace(/\s+/g, '-').toLowerCase()}" 
                    class="px-4 py-2.5 rounded-xl transition-all ${idx === 0 ? 'bg-primary-container/15 text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'}"
                  >
                    ${cat}
                  </a>
                `).join('')}
              </nav>
            </aside>

            <!-- Menu Items List -->
            <div class="col-span-12 lg:col-span-6 xl:col-span-7 flex flex-col gap-8">
              ${rest.menuCategories.map(cat => {
                const items = rest.menu.filter(item => item.category === cat);
                if (items.length === 0) return '';

                return `
                  <section id="cat-${cat.replace(/\s+/g, '-').toLowerCase()}" class="scroll-mt-28">
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
                              <p class="text-xs text-on-surface-variant leading-relaxed line-clamp-2">${item.description}</p>
                            </div>

                            <div class="mt-2.5 flex items-center gap-1.5 flex-wrap">
                              <span class="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 font-extrabold text-[10px] flex items-center gap-0.5">
                                🔥 ${item.nutrition ? item.nutrition.calories : 350} kcal
                              </span>
                              <span class="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 font-extrabold text-[10px] flex items-center gap-0.5">
                                💪 ${item.nutrition ? item.nutrition.protein : 20}g Protein
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
                              <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover"/>
                            </div>
                            <button 
                              data-dish-id="${item.id}"
                              class="add-to-cart-btn w-full bg-surface-container-lowest border border-primary-container text-primary-container font-bold text-xs py-2 rounded-xl hover:bg-primary-container hover:text-white transition-all shadow-sm active:scale-95 cursor-pointer flex items-center justify-center gap-1"
                            >
                              <span class="material-symbols-outlined text-sm">add</span> Add
                            </button>
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
              }).join('')}
            </div>

            <!-- Right Sticky Cart Sidebar (1:1 Stitch replication) -->
            <aside class="col-span-12 lg:col-span-4 xl:col-span-3">
              <div class="bg-surface-container-lowest border border-surface-variant rounded-2xl sticky top-28 shadow-sm flex flex-col max-h-[calc(100vh-140px)] overflow-hidden">
                <div class="p-4 border-b border-surface-variant bg-surface-container-low flex justify-between items-center">
                  <div>
                    <h3 class="font-bold text-base text-on-surface flex items-center gap-1.5">
                      <span>Your Cart</span>
                      <span class="material-symbols-outlined text-primary text-xl">shopping_basket</span>
                    </h3>
                    <p class="text-xs text-on-surface-variant font-semibold">${rest.name}</p>
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

      // Wire Add to Cart buttons
      container.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const dishId = btn.dataset.dishId;
          const dish = rest.menu.find(d => d.id === dishId);
          if (dish) {
            store.addToCart(dish, rest);
            updateSideCart();
          }
        });
      });

      // Wire Add to Group Room buttons
      container.querySelectorAll('.add-to-room-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const dishId = btn.dataset.dishId;
          const dish = rest.menu.find(d => d.id === dishId);
          if (dish && window.foodlyGroupOrder) {
            const added = await window.foodlyGroupOrder.addItemToCurrentRoom(dish);
            if (added) {
              store.showToast(`Added ${dish.name} to Group Room!`, 'success');
            }
          }
        });
      });

      function updateSideCart() {
        const itemsContainer = document.getElementById('side-cart-items');
        const billContainer = document.getElementById('side-cart-bill');
        const countBadge = document.getElementById('side-cart-count');

        if (!itemsContainer || !billContainer) return;

        const cart = store.cart;
        const bill = store.getBillDetails(rest.deliveryFee);
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
                  <button onclick="window.foodlyStore.updateQuantity('${item.id}', -1)" class="w-5 h-5 flex items-center justify-center text-secondary hover:bg-surface-container font-bold">-</button>
                  <span class="w-5 h-5 flex items-center justify-center font-bold">${item.quantity}</span>
                  <button onclick="window.foodlyStore.updateQuantity('${item.id}', 1)" class="w-5 h-5 flex items-center justify-center text-secondary hover:bg-surface-container font-bold">+</button>
                </div>
                <div>
                  <h5 class="font-bold text-on-surface leading-tight">${item.name}</h5>
                  <button onclick="window.foodlyStore.removeFromCart('${item.id}')" class="text-[10px] text-error hover:underline mt-0.5">Remove</button>
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
            <span>Checkout</span>
            <span class="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        `;

        document.getElementById('side-cart-checkout-btn')?.addEventListener('click', () => {
          window.location.hash = '#checkout';
        });
      }

      updateSideCart();

      // Listen for cart changes
      store.subscribe((event) => {
        if (event === 'CART_UPDATED') {
          updateSideCart();
        }
      });
    } catch (e) {
      console.error("Error loading restaurant detail", e);
    }
  }

  window.renderRestaurantView = renderRestaurantView;
})();
