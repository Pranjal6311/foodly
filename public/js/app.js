// public/js/app.js - Main Application Bootstrap & Client Router (Resilient Edition)
(function () {
  function getAppContainer() {
    return document.getElementById('app');
  }

  function parseHash() {
    let rawHash = (window.location.hash.slice(1) || '').trim();
    if (!rawHash) {
      // Support path-based URLs like /profile, /help, /orders, /search, /checkout
      let pathname = (window.location.pathname || '').replace(/^\/+|\/+$/g, '');
      // Strip repo name prefix for GitHub Pages (e.g. foodly/ or foodly/index.html)
      pathname = pathname.replace(/^foodly\/?/i, '');
      if (pathname && pathname !== 'index.html') {
        rawHash = pathname.replace(/\.html$/, '');
      } else {
        rawHash = 'home';
      }
    }

    const [pathPart, queryPart] = rawHash.split('?');
    const segments = (pathPart || 'home').split('/').filter(Boolean);

    const query = {};
    if (queryPart) {
      try {
        const sp = new URLSearchParams(queryPart);
        for (const [k, v] of sp.entries()) {
          query[k] = v;
        }
      } catch (e) {}
    }

    const routeName = segments[0] || 'home';
    return {
      route: (routeName === 'foodly' || routeName === '') ? 'home' : routeName,
      param: segments[1] || null,
      query
    };
  }

  function route() {
    try { window.scrollTo({ top: 0, behavior: 'instant' }); } catch (e) {}
    const { route, param, query } = parseHash();

    // 1. Render Shared Shell Components safely
    try { if (typeof window.renderNavbar === 'function') window.renderNavbar(); } catch (e) { console.error('Navbar error:', e); }
    try { if (typeof window.renderCartDrawer === 'function') window.renderCartDrawer(); } catch (e) { console.error('CartDrawer error:', e); }
    try { if (typeof window.renderFooter === 'function') window.renderFooter(); } catch (e) { console.error('Footer error:', e); }
    try { if (typeof window.updateMobileFloatingCart === 'function') window.updateMobileFloatingCart(); } catch (e) { console.error('FloatingCart error:', e); }

    // 2. Locate Main Container
    const appContainer = getAppContainer();
    if (!appContainer) {
      console.error('#app container element not found in DOM');
      return;
    }

    // 3. Dispatch to Active View
    try {
      if (route === 'home') {
        if (typeof window.renderHomeView === 'function') window.renderHomeView(appContainer);
      } else if (route === 'search' || route === 'dining') {
        if (typeof window.renderSearchView === 'function') window.renderSearchView(appContainer, query);
      } else if (route === 'restaurant') {
        if (param) {
          if (typeof window.renderRestaurantView === 'function') window.renderRestaurantView(appContainer, param);
        } else {
          window.location.hash = '#search';
        }
      } else if (route === 'checkout') {
        if (typeof window.renderCheckoutView === 'function') window.renderCheckoutView(appContainer);
      } else if (route === 'track') {
        const activeId = param || (window.foodlyStore && window.foodlyStore.orders && window.foodlyStore.orders[0] ? window.foodlyStore.orders[0].id : 'FD-9204');
        if (typeof window.renderTrackingView === 'function') window.renderTrackingView(appContainer, activeId);
      } else if (route === 'orders') {
        if (typeof window.renderOrdersView === 'function') window.renderOrdersView(appContainer);
      } else if (route === 'offers') {
        if (typeof window.renderOffersView === 'function') window.renderOffersView(appContainer);
      } else if (route === 'innovations') {
        if (typeof window.renderInnovationsView === 'function') window.renderInnovationsView(appContainer);
      } else if (route === 'profile') {
        if (typeof window.renderProfileView === 'function') window.renderProfileView(appContainer);
      } else if (route === 'settings') {
        if (typeof window.renderSettingsView === 'function') window.renderSettingsView(appContainer);
      } else if (route === 'partners' || route === 'partner') {
        if (typeof window.renderPartnerView === 'function') window.renderPartnerView(appContainer);
      } else if (route === 'help') {
        if (typeof window.renderHelpView === 'function') window.renderHelpView(appContainer);
      } else {
        if (typeof window.renderHomeView === 'function') window.renderHomeView(appContainer);
      }
    } catch (err) {
      console.error('Error during view rendering:', err);
      appContainer.innerHTML = `
        <div class="fade-in max-w-lg mx-auto p-8 my-12 text-center bg-surface-container-lowest rounded-3xl border border-surface-variant shadow-lg">
          <div class="text-4xl mb-3">🍔</div>
          <h2 class="text-xl font-black text-on-surface mb-2">Foodly Campus Feast</h2>
          <p class="text-xs text-secondary mb-6">Explore all fresh dishes, cafes, restros and food carts across GL Bajaj campus.</p>
          <a href="#home" class="inline-block px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-xl shadow-md">Reload Menu</a>
        </div>
      `;
    }
  }

  window.addEventListener('hashchange', route);
  document.addEventListener('DOMContentLoaded', route);
  window.addEventListener('DOMContentLoaded', route);

  // Immediate or next-tick execution
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    route();
  } else {
    setTimeout(route, 20);
  }

  // Expose global router for external triggers
  window.foodlyRoute = route;
})();
