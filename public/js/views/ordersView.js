// js/views/ordersView.js - Premium Swiggy/Zomato Style Orders View
(function () {
  async function renderOrdersView(container) {
    container.innerHTML = `
      <div class="fade-in" style="max-width:720px;margin:0 auto;padding:20px 16px 32px;">
        
        <!-- Header -->
        <div style="margin-bottom:20px;">
          <h1 style="font-size:22px;font-weight:900;color:#151c27;">Your Orders</h1>
          <p style="font-size:12px;color:#575e70;font-weight:500;margin-top:3px;">Track deliveries & reorder your favorites</p>
        </div>

        <!-- Loading state -->
        <div id="orders-list-container">
          ${[1,2,3].map(() => `
            <div class="skeleton" style="height:120px;border-radius:16px;margin-bottom:12px;"></div>
          `).join('')}
        </div>
      </div>
    `;

    try {
      const res = await window.foodlyApi.getOrders();
      const listContainer = document.getElementById('orders-list-container');
      if (!listContainer) return;

      if (!res.success || !res.data || res.data.length === 0) {
        listContainer.innerHTML = `
          <div style="background:#fff;border-radius:20px;padding:48px 24px;text-align:center;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
            <div style="font-size:56px;margin-bottom:12px;">🛵</div>
            <h3 style="font-size:18px;font-weight:900;color:#151c27;margin-bottom:6px;">No orders yet!</h3>
            <p style="font-size:13px;color:#575e70;font-weight:500;max-width:240px;margin:0 auto 20px;">Explore our campus cafes, restros & food carts and place your first order.</p>
            <a href="#search" style="background:#ff5e18;color:#fff;font-size:13px;font-weight:800;padding:12px 28px;border-radius:12px;display:inline-block;text-decoration:none;box-shadow:0 4px 12px rgba(255,94,24,0.3);">Explore Restaurants →</a>
          </div>
        `;
        return;
      }

      listContainer.innerHTML = res.data.map(order => {
        const isLive = order.status !== 'delivered';
        const statusColor = isLive ? '#ff5e18' : '#006c4a';
        const statusBg   = isLive ? 'rgba(255,94,24,0.1)' : 'rgba(0,108,74,0.1)';
        const statusLabel = isLive ? '🔴 Live Tracking' : '✅ Delivered';
        const timeStr = order.createdAt ? new Date(order.createdAt).toLocaleString('en-IN', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' }) : 'Just now';

        return `
          <div style="background:#fff;border-radius:18px;box-shadow:0 2px 12px rgba(0,0,0,0.07);overflow:hidden;margin-bottom:12px;transition:box-shadow 0.2s ease;" class="card-shadow">
            <!-- Top row -->
            <div style="padding:14px 16px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #f0f3ff;">
              <div style="display:flex;align-items:center;gap:10px;flex:1;min-width:0;">
                <div style="width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,#ff5e18,#aa3700);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                  <span class="material-symbols-outlined" style="font-size:22px;color:#fff;">electric_moped</span>
                </div>
                <div style="min-width:0;">
                  <h3 style="font-size:14px;font-weight:900;color:#151c27;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:200px;">${order.restaurantName}</h3>
                  <p style="font-size:11px;color:#575e70;font-weight:600;margin-top:1px;">Order #${order.id} • ${timeStr}</p>
                </div>
              </div>
              <div style="background:${statusBg};color:${statusColor};font-size:11px;font-weight:800;padding:4px 10px;border-radius:99px;white-space:nowrap;flex-shrink:0;">${statusLabel}</div>
            </div>

            <!-- Items -->
            <div style="padding:10px 16px;border-bottom:1px solid #f0f3ff;">
              <p style="font-size:12px;color:#575e70;font-weight:600;line-clamp:1;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;">
                ${order.items.map(i => `${i.quantity}x ${i.name}`).join(' • ')}
              </p>
            </div>

            <!-- Bottom row -->
            <div style="padding:12px 16px;display:flex;align-items:center;justify-content:space-between;gap:12px;">
              <div>
                <span style="font-size:11px;color:#575e70;font-weight:500;display:block;">Order Total</span>
                <span style="font-size:18px;font-weight:900;color:#aa3700;">₹${order.bill && order.bill.total ? order.bill.total.toFixed(0) : '---'}</span>
              </div>
              <div style="display:flex;gap:8px;">
                ${isLive ? `
                  <a href="#track/${order.id}" style="background:#ff5e18;color:#fff;font-size:12px;font-weight:800;padding:9px 18px;border-radius:10px;display:flex;align-items:center;gap:5px;text-decoration:none;box-shadow:0 3px 10px rgba(255,94,24,0.3);">
                    <span class="material-symbols-outlined" style="font-size:15px;">near_me</span>
                    <span>Track Live</span>
                  </a>
                ` : `
                  <button onclick="window.reorderFromHistory && window.reorderFromHistory('${order.id}')" style="background:#f0f3ff;color:#575e70;font-size:12px;font-weight:800;padding:9px 16px;border-radius:10px;border:none;cursor:pointer;display:flex;align-items:center;gap:5px;">
                    <span class="material-symbols-outlined" style="font-size:15px;">replay</span>
                    <span>Reorder</span>
                  </button>
                  <a href="#track/${order.id}" style="background:#151c27;color:#fff;font-size:12px;font-weight:800;padding:9px 16px;border-radius:10px;display:flex;align-items:center;gap:5px;text-decoration:none;">
                    <span class="material-symbols-outlined" style="font-size:15px;">receipt_long</span>
                    <span>Details</span>
                  </a>
                `}
              </div>
            </div>
          </div>
        `;
      }).join('');

    } catch (e) {
      console.error('Error loading orders', e);
      const listContainer = document.getElementById('orders-list-container');
      if (listContainer) {
        listContainer.innerHTML = `
          <div style="background:#fff;border-radius:20px;padding:32px;text-align:center;color:#575e70;">
            <span class="material-symbols-outlined" style="font-size:40px;display:block;margin-bottom:8px;color:#ef4444;">error_outline</span>
            <p style="font-size:13px;font-weight:600;">Could not load orders. Please try again.</p>
          </div>
        `;
      }
    }
  }

  window.renderOrdersView = renderOrdersView;
})();
