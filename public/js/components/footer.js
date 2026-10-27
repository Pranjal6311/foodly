// public/js/components/footer.js - Shared Application Footer
(function () {
  function renderFooter() {
    const container = document.getElementById('footer-container');
    if (!container) return;

    container.innerHTML = `
      <div class="bg-surface-container-highest dark:bg-inverse-surface font-sans text-sm w-full py-12 mt-16 border-t border-surface-variant/40">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <!-- Brand -->
          <div class="col-span-1">
            <div class="mb-3">
              <img src="./images/foodly-logo.png" alt="Foodly — Fast Fresh Food, Delivered" class="h-12 w-auto object-contain drop-shadow-sm"/>
            </div>
            <p class="text-on-surface-variant text-xs leading-relaxed max-w-xs mb-3">
              Premium food delivery made effortless. Fresh flavors, chef-crafted recipes, and real-time GPS tracking.
            </p>
            <p class="text-on-surface-variant text-xs font-medium">© 2026 Foodly Inc. All rights reserved.</p>
          </div>
          <!-- Links -->
          <div class="col-span-1 md:col-span-3 flex flex-wrap gap-6 md:justify-end items-center font-semibold text-xs md:text-sm">
            <a href="#home" class="text-on-surface-variant hover:text-primary transition-colors">Home</a>
            <a href="#search" class="text-on-surface-variant hover:text-primary transition-colors">Restaurants</a>
            <a href="#search?cuisine=street-food" class="text-on-surface-variant hover:text-primary transition-colors">Food Carts</a>
            <a href="#search?cuisine=cafe" class="text-on-surface-variant hover:text-primary transition-colors">Cafes & Desserts</a>
            <a href="#innovations" class="text-primary font-bold hover:text-primary transition-colors flex items-center gap-1">
              <span class="material-symbols-outlined text-sm">auto_awesome</span>
              <span>Innovations</span>
            </a>
            <a href="#partners" class="text-emerald-700 font-extrabold hover:text-emerald-800 transition-colors flex items-center gap-1">
              <span class="material-symbols-outlined text-sm">handshake</span>
              <span>College Tie-Ups &amp; Partners</span>
            </a>
            <a href="#offers" class="text-on-surface-variant hover:text-primary transition-colors">Special Offers</a>
            <a href="#orders" class="text-on-surface-variant hover:text-primary transition-colors">Orders</a>
            <a href="#profile" class="text-on-surface-variant hover:text-primary transition-colors">My Profile</a>
            <a href="#help" class="text-primary font-bold hover:underline flex items-center gap-1 transition-colors">
              <span class="material-symbols-outlined text-sm">support_agent</span>
              Help & Support
            </a>
          </div>
        </div>
      </div>
    `;
  }

  window.renderFooter = renderFooter;
})();
