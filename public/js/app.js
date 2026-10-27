// public/js/app.js - Main Application Bootstrap & Client Router
(function () {
  const appContainer = document.getElementById('app');

  function parseHash() {
    let rawHash = (window.location.hash.slice(1) || '').trim();
    if (!rawHash) {
      // Support path-based URLs like /profile, /help, /orders, /search, /checkout
      const pathname = window.location.pathname.replace(/^\/+|\/+$/g, '');
      if (pathname && pathname !== 'index.html') {
        rawHash = pathname.replace(/\.html$/, '');
      } else {
        rawHash = 'home';
      }
    }

    const [pathPart, queryPart] = rawHash.split('?');
    const segments = pathPart.split('/').filter(Boolean);

    const query = {};
    if (queryPart) {
      const sp = new URLSearchParams(queryPart);
      for (const [k, v] of sp.entries()) {
        query[k] = v;
      }
    }

    return {
      route: segments[0] || 'home',
      param: segments[1] || null,
      query
    };
  }

  function route() {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const { route, param, query } = parseHash();

    // Render Shared Components
    window.renderNavbar();
    window.renderCartDrawer();
    window.renderFooter();
    if (window.updateMobileFloatingCart) window.updateMobileFloatingCart();

    if (route === 'home') {
      window.renderHomeView(appContainer);
    } else if (route === 'search') {
      window.renderSearchView(appContainer, query);
    } else if (route === 'restaurant') {
      if (param) {
        window.renderRestaurantView(appContainer, param);
      } else {
        window.location.hash = '#search';
      }
    } else if (route === 'checkout') {
      window.renderCheckoutView(appContainer);
    } else if (route === 'track') {
      const activeId = param || (window.foodlyStore && window.foodlyStore.orders && window.foodlyStore.orders[0] ? window.foodlyStore.orders[0].id : 'FD-9204');
      window.renderTrackingView(appContainer, activeId);
    } else if (route === 'orders') {
      window.renderOrdersView(appContainer);
    } else if (route === 'offers') {
      window.renderOffersView(appContainer);
    } else if (route === 'innovations') {
      window.renderInnovationsView(appContainer);
    } else if (route === 'profile') {
      window.renderProfileView(appContainer);
    } else if (route === 'settings') {
      window.renderSettingsView(appContainer);
    } else if (route === 'partners' || route === 'partner') {
      window.renderPartnerView(appContainer);
    } else if (route === 'help') {
      window.renderHelpView(appContainer);
    } else {
      window.renderHomeView(appContainer);
    }
  }

  window.addEventListener('hashchange', route);
  window.addEventListener('DOMContentLoaded', route);

  // Initial call
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    route();
  }
})();
