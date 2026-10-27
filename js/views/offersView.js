// public/js/views/offersView.js - Offers & Deals Screen
(function () {
  async function renderOffersView(container) {
    container.innerHTML = `
      <div class="fade-in max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop py-8">
        <div class="mb-8 rounded-3xl bg-gradient-to-r from-red-950 via-amber-950 to-orange-950 border-2 border-amber-500/40 p-6 md:p-8 text-white shadow-xl relative overflow-hidden card-3d">
          <div class="flex items-center gap-2.5 mb-2">
            <span class="diya-flame-glow text-3xl">🪔</span>
            <span class="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 font-extrabold text-xs rounded-full uppercase tracking-wider shadow-sm">
              Shubh Deepavali Mahotsav 2026 ✨
            </span>
          </div>
          <h1 class="text-2xl md:text-4xl font-black mt-2 mb-2 tracking-tight">Diwali Offers &amp; Festive Feasts Discounts</h1>
          <p class="text-xs md:text-sm text-amber-100/90 font-medium">Celebrate with flat 30% OFF with code DIWALI30 on fresh Desi Ghee Mithai, ₹0 campus delivery fee, and exclusive GL Bajaj festive gift hampers.</p>
        </div>

        <div id="offers-list" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="py-12 col-span-2 text-center text-secondary">
            <span class="material-symbols-outlined text-4xl animate-spin text-primary mb-2">progress_activity</span>
            <p class="text-sm font-semibold">Loading deals...</p>
          </div>
        </div>
      </div>
    `;

    try {
      const res = await window.foodlyApi.getCoupons();
      const listContainer = document.getElementById('offers-list');
      if (!listContainer) return;

      if (!res.success || res.data.length === 0) {
        listContainer.innerHTML = `<div class="col-span-2 text-center text-secondary py-12">No active offers at this moment.</div>`;
        return;
      }

      listContainer.innerHTML = res.data.map(coupon => `
        <div class="bg-surface-container-lowest border border-surface-variant rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
          <div class="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-primary/5 pointer-events-none"></div>

          <div>
            <div class="flex justify-between items-start mb-3">
              <span class="px-3 py-1 bg-primary-container/15 text-primary text-xs font-extrabold rounded-lg tracking-wider border border-primary-container/30 uppercase">
                ${coupon.code}
              </span>
              <span class="material-symbols-outlined text-primary text-xl">loyalty</span>
            </div>

            <h3 class="font-extrabold text-lg text-on-surface mb-1">
              ${coupon.discountPercent ? `${coupon.discountPercent}% Instant Discount` : 'Free Delivery Voucher'}
            </h3>
            <p class="text-xs text-on-surface-variant mb-4 leading-relaxed font-medium">
              ${coupon.description}
            </p>
          </div>

          <div class="pt-4 border-t border-surface-variant/40 flex items-center justify-between">
            <span class="text-xs text-secondary font-semibold">
              Min. Order: &#8377;${coupon.minOrder ? coupon.minOrder : '0'}
            </span>
            <button 
              data-code="${coupon.code}"
              class="apply-offer-btn bg-primary text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
            >
              Apply to Cart
            </button>
          </div>
        </div>
      `).join('');

      container.querySelectorAll('.apply-offer-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const code = btn.dataset.code;
          const coupon = res.data.find(c => c.code === code);
          if (coupon) {
            const ok = window.foodlyStore.applyCoupon(coupon);
            if (ok) {
              window.foodlyStore.toggleCart(true);
            }
          }
        });
      });
    } catch (e) {
      console.error("Error loading offers", e);
    }
  }

  window.renderOffersView = renderOffersView;
})();
