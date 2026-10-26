// public/js/components/cartDrawer.js - Slide-over Cart Drawer
(function () {
  function renderCartDrawer() {
    const container = document.getElementById('cart-drawer-container');
    if (!container) return;

    const store = window.foodlyStore;
    const isOpen = store.isCartOpen;
    const cart = store.cart;
    const bill = store.getBillDetails();
    const itemCount = store.getCartCount();

    if (!isOpen) {
      container.innerHTML = '';
      return;
    }

    container.innerHTML = `
      <div class="fixed inset-0 z-50 overflow-hidden">
        <!-- Backdrop -->
        <div id="cart-backdrop" class="absolute inset-0 bg-on-surface/40 backdrop-blur-sm transition-opacity duration-300"></div>

        <div class="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div class="w-screen max-w-md bg-surface-container-lowest shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
            <!-- Header -->
            <div class="p-6 border-b border-surface-variant bg-surface-container-low flex items-center justify-between">
              <div>
                <h3 class="font-bold text-xl text-on-surface flex items-center gap-2">
                  <span>Your Cart</span>
                  <span class="material-symbols-outlined text-primary text-2xl">shopping_basket</span>
                </h3>
                <p class="text-xs text-on-surface-variant mt-0.5 font-medium">
                  ${cart.restaurantName ? `From ${cart.restaurantName}` : 'No restaurant selected'}
                </p>
              </div>
              <button id="close-cart-btn" class="p-2 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>

            <!-- Cart Items List -->
            <div class="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              ${cart.items.length === 0 ? `
                <div class="flex-1 flex flex-col items-center justify-center text-center py-16 text-on-surface-variant">
                  <div class="w-20 h-20 rounded-full bg-surface-container-low flex items-center justify-center mb-4 text-primary">
                    <span class="material-symbols-outlined text-4xl">remove_shopping_cart</span>
                  </div>
                  <h4 class="font-bold text-lg text-on-surface mb-1">Your cart is empty</h4>
                  <p class="text-sm max-w-xs mb-6">Explore our top restaurants and add your favorite dishes!</p>
                  <a href="#search" onclick="window.foodlyStore.toggleCart(false)" class="bg-primary text-white font-semibold px-6 py-2.5 rounded-full hover:bg-primary/90 transition-colors">
                    Browse Restaurants
                  </a>
                </div>
              ` : cart.items.map(item => `
                <div class="flex justify-between items-center py-3 border-b border-surface-variant/40 last:border-none">
                  <div class="flex items-center gap-3">
                    <div class="flex items-center border border-surface-variant rounded-lg bg-surface-container-lowest overflow-hidden">
                      <button onclick="window.foodlyStore.updateQuantity('${item.id}', -1)" class="w-7 h-7 flex items-center justify-center text-on-surface-variant hover:bg-surface-container font-bold text-base transition-colors">-</button>
                      <span class="w-7 h-7 flex items-center justify-center text-xs font-bold text-on-surface">${item.quantity}</span>
                      <button onclick="window.foodlyStore.updateQuantity('${item.id}', 1)" class="w-7 h-7 flex items-center justify-center text-on-surface-variant hover:bg-surface-container font-bold text-base transition-colors">+</button>
                    </div>
                    <div>
                      <h5 class="font-semibold text-sm text-on-surface leading-tight">${item.name}</h5>
                      <span class="text-xs text-primary font-bold">&#8377;${(item.price * item.quantity).toFixed(0)}</span>
                    </div>
                  </div>
                  <button onclick="window.foodlyStore.removeFromCart('${item.id}')" class="text-error hover:text-error/80 text-xs font-medium p-1 transition-colors" title="Remove item">
                    <span class="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              `).join('')}

              ${cart.items.length > 0 ? `
                <!-- Coupon Section -->
                <div class="mt-4 p-4 rounded-xl bg-surface-container-low border border-surface-variant/60">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-bold text-on-surface flex items-center gap-1.5">
                      <span class="material-symbols-outlined text-primary text-base">local_offer</span>
                      ${store.appliedCoupon ? `Applied: ${store.appliedCoupon.code}` : 'Apply Promo Code'}
                    </span>
                    ${store.appliedCoupon ? `
                      <button onclick="window.foodlyStore.removeCoupon()" class="text-xs text-error font-semibold hover:underline">Remove</button>
                    ` : ''}
                  </div>
                  ${store.appliedCoupon ? `
                    <p class="text-xs text-tertiary font-semibold">${store.appliedCoupon.description}</p>
                  ` : `
                    <div class="flex gap-2">
                      <input id="cart-coupon-input" type="text" placeholder="e.g. FOODLY50" class="flex-1 bg-surface-container-lowest border border-surface-variant rounded-lg px-3 py-1.5 text-xs font-semibold uppercase outline-none focus:border-primary"/>
                      <button id="cart-apply-coupon-btn" class="bg-primary text-white text-xs font-semibold px-4 py-1.5 rounded-lg hover:bg-primary/90 transition-colors">Apply</button>
                    </div>
                  `}
                </div>
              ` : ''}
            </div>

            <!-- Footer / Bill Details & Checkout -->
            ${cart.items.length > 0 ? `
              <!-- Live Macro Nutrition Summary -->
              <div class="px-6 py-3 bg-amber-500/10 border-t border-amber-500/20 text-xs">
                <div class="flex justify-between items-center font-black text-on-surface mb-1">
                  <span class="flex items-center gap-1">
                    <span>🔥</span> Cart Nutrition (Grade: ${store.getNutritionSummary().healthGrade})
                  </span>
                  <span class="text-amber-800">${store.getNutritionSummary().calories} kcal</span>
                </div>
                <div class="flex justify-between text-[11px] text-on-surface-variant font-bold">
                  <span class="text-emerald-700">💪 Protein: ${store.getNutritionSummary().protein}g</span>
                  <span class="text-sky-700">🌾 Carbs: ${store.getNutritionSummary().carbs}g</span>
                  <span class="text-amber-700">🥑 Fats: ${store.getNutritionSummary().fats}g</span>
                </div>
              </div>

              <!-- FairPrice Savings Strip -->
              <div class="px-6 py-2 bg-emerald-50 border-t border-emerald-300 text-xs text-emerald-800 font-bold flex items-center justify-between">
                <span class="flex items-center gap-1">
                  <span class="material-symbols-outlined text-sm text-emerald-600 filled">verified</span>
                  FairPrice Audit:
                </span>
                <span class="text-emerald-700 font-extrabold">Save &#8377;${store.getFairPriceSummary().totalSavings} vs Swiggy</span>
              </div>

              <!-- Campus Delivery Toggle -->
              <div class="px-6 py-2.5 bg-surface-container-low border-t border-surface-variant flex items-center justify-between text-xs">
                <div class="flex items-center gap-1.5 font-bold text-on-surface">
                  <span class="material-symbols-outlined text-emerald-600 text-base">school</span>
                  <span>GL Bajaj Campus Drop:</span>
                </div>
                <button 
                  id="cart-campus-toggle"
                  class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${store.isCampusMode ? 'bg-emerald-600 text-white' : 'bg-surface-container text-on-surface border border-surface-variant'}"
                >
                  ${store.isCampusMode ? '₹0 Fee Active' : 'Enable (Save ₹40)'}
                </button>
              </div>

              <div class="p-6 border-t border-surface-variant bg-surface-container-low">
                <div class="flex flex-col gap-2 mb-4 text-sm text-on-surface-variant">
                  <div class="flex justify-between">
                    <span>Subtotal</span>
                    <span class="font-medium text-on-surface">&#8377;${bill.subtotal.toFixed(0)}</span>
                  </div>
                  ${bill.discount > 0 ? `
                    <div class="flex justify-between text-tertiary font-semibold">
                      <span>Discount</span>
                      <span>-&#8377;${bill.discount.toFixed(0)}</span>
                    </div>
                  ` : ''}
                  <div class="flex justify-between">
                    <span>Delivery Fee</span>
                    <span class="font-medium text-on-surface">${bill.deliveryFee === 0 ? '<span class="text-emerald-700 font-bold">FREE (Campus Mode)</span>' : `&#8377;${bill.deliveryFee.toFixed(0)}`}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Taxes & Fees</span>
                    <span class="font-medium text-on-surface">&#8377;${bill.taxes.toFixed(0)}</span>
                  </div>
                  <div class="h-px bg-surface-variant/80 my-1"></div>
                  <div class="flex justify-between items-center text-lg font-bold text-on-surface">
                    <span>Total</span>
                    <span class="text-primary text-xl">&#8377;${bill.total.toFixed(0)}</span>
                  </div>
                </div>

                <div class="flex flex-col gap-2">
                  <button 
                    id="cart-checkout-btn"
                    class="w-full bg-primary-container text-white font-bold py-3.5 rounded-xl hover:bg-primary transition-all duration-200 flex items-center justify-center gap-2 shadow-md active:scale-95 cursor-pointer"
                  >
                    <span>Proceed to Checkout</span>
                    <span class="material-symbols-outlined text-lg">arrow_forward</span>
                  </button>

                  <button 
                    id="cart-group-split-btn"
                    class="w-full py-2.5 rounded-xl border border-primary/40 bg-primary-fixed/20 hover:bg-primary-fixed/40 text-primary text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span class="material-symbols-outlined text-base">groups</span>
                    <span>Split Bill with Roommates (Group Order)</span>
                  </button>
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;

    // Event listeners
    document.getElementById('cart-backdrop')?.addEventListener('click', () => store.toggleCart(false));
    document.getElementById('close-cart-btn')?.addEventListener('click', () => store.toggleCart(false));

    document.getElementById('cart-checkout-btn')?.addEventListener('click', () => {
      store.toggleCart(false);
      window.location.hash = '#checkout';
    });

    document.getElementById('cart-apply-coupon-btn')?.addEventListener('click', () => {
      const input = document.getElementById('cart-coupon-input');
      const code = input?.value.trim().toUpperCase();
      if (!code) return;

      window.foodlyApi.getCoupons().then(res => {
        const coupon = res.data.find(c => c.code === code);
        if (coupon) {
          store.applyCoupon(coupon);
        } else {
          store.showToast('Invalid promo code', 'error');
        }
      });
    });

    document.getElementById('cart-campus-toggle')?.addEventListener('click', () => {
      const nextState = !store.isCampusMode;
      store.setCampusMode(nextState);
      store.showToast(
        nextState 
          ? '🎓 GL Bajaj Campus Mode Active: Delivery Fee waived to ₹0!' 
          : 'Standard Delivery Fee applied.',
        nextState ? 'success' : 'info'
      );
      renderCartDrawer();
    });

    document.getElementById('cart-group-split-btn')?.addEventListener('click', () => {
      store.toggleCart(false);
      if (window.foodlyGroupOrder) {
        window.foodlyGroupOrder.openModal('create');
      }
    });
  }

  window.foodlyStore.subscribe((event) => {
    if (event === 'CART_UPDATED' || event === 'CART_TOGGLED' || event === 'COUPON_APPLIED' || event === 'COUPON_REMOVED') {
      renderCartDrawer();
    }
  });

  window.renderCartDrawer = renderCartDrawer;
})();
