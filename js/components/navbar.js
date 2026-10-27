// public/js/components/navbar.js - Original Pristine UI Design (Shared TopNavBar)
(function () {
  function renderNavbar() {
    const container = document.getElementById('navbar-container');
    if (!container) return;

    const store = window.foodlyStore;
    const cartCount = store ? store.getCartCount() : 0;
    const currentHash = window.location.hash || '#home';

    const isBrowseActive = currentHash === '#home' || currentHash.startsWith('#search') || currentHash.startsWith('#restaurant');
    const isOffersActive = currentHash === '#offers';
    const isOrdersActive = currentHash.startsWith('#orders') || currentHash.startsWith('#track');
    const isHelpActive = currentHash === '#help';

    container.innerHTML = `
      <!-- TopNavBar (Shared Component matching canonical design) -->
      <div class="bg-surface-container-lowest font-body-md text-body-md shadow-sm fixed top-0 w-full z-50">
        <div class="flex justify-between items-center h-20 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <!-- Brand Logo -->
          <a href="#home" class="font-display-lg text-headline-md font-extrabold text-primary cursor-pointer active:scale-95 transition-transform">
            Foodly
          </a>

          <!-- Navigation Links -->
          <nav class="hidden md:flex gap-gutter items-center">
            <a class="${isBrowseActive ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary'} cursor-pointer active:scale-95 transition-colors duration-200" href="#home">Browse</a>
            <a class="${isOffersActive ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary'} transition-colors duration-200 cursor-pointer active:scale-95" href="#offers">Offers</a>
            <a class="${isOrdersActive ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary'} transition-colors duration-200 cursor-pointer active:scale-95" href="#orders">Orders</a>
            <a class="${isHelpActive ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary'} transition-colors duration-200 cursor-pointer active:scale-95" href="#help">Help</a>
          </nav>

          <!-- Actions -->
          <div class="flex items-center gap-stack-md text-primary">
            <a href="#search" class="p-2 rounded-full hover:bg-surface-container-low transition-colors duration-200 cursor-pointer active:scale-95" title="Search">
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
      </div>
    `;

    // ── Cart trigger handler ──────────────────────────────────────────────────
    const cartBtn = document.getElementById('nav-cart-btn');
    if (cartBtn) {
      cartBtn.addEventListener('click', () => {
        if (window.foodlyStore && window.foodlyStore.toggleCart) {
          window.foodlyStore.toggleCart(true);
        }
      });
    }
  }

  // Subscribe to store updates
  if (window.foodlyStore) {
    window.foodlyStore.subscribe((event) => {
      if (event === 'CART_UPDATED') {
        renderNavbar();
      }
    });
  }

  window.addEventListener('hashchange', renderNavbar);
  window.renderNavbar = renderNavbar;
})();
