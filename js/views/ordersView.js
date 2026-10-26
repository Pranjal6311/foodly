// public/js/views/ordersView.js - Order History View
(function () {
  async function renderOrdersView(container) {
    container.innerHTML = `
      <div class="fade-in max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop py-8">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h1 class="text-2xl md:text-3xl font-extrabold text-on-surface">Your Orders</h1>
            <p class="text-xs md:text-sm text-on-surface-variant mt-0.5">Track your active deliveries or repeat your favorite feasts</p>
          </div>
        </div>

        <div id="orders-list-container" class="flex flex-col gap-4">
          <div class="py-16 text-center text-secondary">
            <span class="material-symbols-outlined text-4xl animate-spin text-primary mb-2">progress_activity</span>
            <p class="text-sm font-semibold">Loading orders...</p>
          </div>
        </div>
      </div>
    `;

    try {
      const res = await window.foodlyApi.getOrders();
      const listContainer = document.getElementById('orders-list-container');
      if (!listContainer) return;

      if (!res.success || res.data.length === 0) {
        listContainer.innerHTML = `
          <div class="bg-surface-container-lowest border border-surface-variant rounded-2xl p-12 text-center text-secondary">
            <span class="material-symbols-outlined text-5xl mb-2 opacity-50">receipt_long</span>
            <h3 class="text-lg font-bold text-on-surface mb-1">No orders yet</h3>
            <p class="text-xs text-on-surface-variant max-w-xs mx-auto mb-6">Explore our curated menus and place your very first order.</p>
            <a href="#search" class="bg-primary text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors inline-block">
              Browse Restaurants
            </a>
          </div>
        `;
        return;
      }

      listContainer.innerHTML = res.data.map(order => {
        const isLive = order.status !== 'delivered';
        const statusBadge = order.status === 'delivered' ? 
          '<span class="bg-tertiary-container/20 text-tertiary px-3 py-1 rounded-full text-xs font-bold">Delivered</span>' :
          '<span class="bg-primary-container text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span> Live Tracking</span>';

        return `
          <div class="bg-surface-container-lowest border border-surface-variant rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-primary/40 transition-colors">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-1.5">
                <h3 class="font-extrabold text-lg text-on-surface">${order.restaurantName}</h3>
                ${statusBadge}
              </div>
              <p class="text-xs text-secondary mb-2">Order #${order.id} • Placed ${new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              
              <div class="text-xs text-on-surface-variant font-medium">
                ${order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
              </div>
            </div>

            <div class="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end pt-3 md:pt-0 border-t md:border-t-0 border-surface-variant/40">
              <div class="text-right">
                <span class="text-xs text-secondary block">Total Amount</span>
                <span class="text-lg font-extrabold text-primary">&#8377;${order.bill.total.toFixed(0)}</span>
              </div>

              <div class="flex items-center gap-2">
                <a href="#track/${order.id}" class="bg-primary-container text-white font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-primary transition-colors flex items-center gap-1 shadow-sm">
                  <span class="material-symbols-outlined text-sm">near_me</span>
                  <span>Track</span>
                </a>
              </div>
            </div>
          </div>
        `;
      }).join('');
    } catch (e) {
      console.error("Error loading orders", e);
    }
  }

  window.renderOrdersView = renderOrdersView;
})();
