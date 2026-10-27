// public/js/views/settingsView.js - Application Settings & User Preferences Screen
(function () {
  function renderSettingsView(container) {
    const store = window.foodlyStore;

    // Load or initialize user settings from localStorage
    const defaultSettings = {
      darkMode: document.documentElement.classList.contains('dark'),
      soundAlerts: true,
      pushNotifications: true,
      whatsappUpdates: true,
      smsReceipts: false,
      promoAlerts: true,
      defaultDropZone: localStorage.getItem('foodly_campus_zone') || 'glb-boys-hostel',
      autoApplyCoupons: true,
      defaultPayment: 'upi',
      calorieWarning: false,
      satvikMode: store ? store.isVratMode : false,
      pureVegMode: false,
      saveSearchHistory: true,
      locationTracking: true
    };

    let userSettings = { ...defaultSettings };
    try {
      const saved = localStorage.getItem('foodly_app_settings');
      if (saved) userSettings = { ...userSettings, ...JSON.parse(saved) };
    } catch (e) {}

    container.innerHTML = `
      <div class="fade-in max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8">
        <!-- Top Settings Header & Navigation Breadcrumb -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div class="flex items-center gap-2 text-xs font-bold text-secondary uppercase tracking-wider mb-1">
              <a href="#home" class="hover:text-primary transition-colors">Home</a>
              <span>/</span>
              <a href="#profile" class="hover:text-primary transition-colors">Profile</a>
              <span>/</span>
              <span class="text-primary">Settings</span>
            </div>
            <h1 class="text-2xl md:text-3xl font-extrabold text-on-surface flex items-center gap-2.5">
              <span class="material-symbols-outlined text-primary text-3xl">settings</span>
              <span>Account &amp; App Settings</span>
            </h1>
            <p class="text-xs md:text-sm text-secondary mt-1">
              Customize your campus ordering preferences, notifications, theme, and privacy controls.
            </p>
          </div>

          <!-- Quick Tabs: Profile vs Settings -->
          <div class="flex items-center bg-surface-container-high p-1.5 rounded-2xl border border-surface-variant shrink-0">
            <a href="#profile" class="px-4 py-2 rounded-xl text-xs font-bold text-secondary hover:text-on-surface transition-all flex items-center gap-1.5">
              <span class="material-symbols-outlined text-base">person</span>
              <span>Profile</span>
            </a>
            <a href="#settings" class="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5">
              <span class="material-symbols-outlined text-base">tune</span>
              <span>Settings</span>
            </a>
          </div>
        </div>

        <!-- Main Settings Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <!-- Left Column: Settings Sections (8 Cols) -->
          <div class="lg:col-span-8 flex flex-col gap-6">

            <!-- 1. Appearance & Theme Settings -->
            <div class="bg-surface-container-lowest border border-surface-variant rounded-2xl p-6 shadow-sm">
              <div class="flex items-center justify-between pb-4 mb-4 border-b border-surface-variant/50">
                <div class="flex items-center gap-2.5">
                  <span class="material-symbols-outlined text-primary text-xl">palette</span>
                  <h3 class="text-base font-extrabold text-on-surface">Appearance &amp; Theme</h3>
                </div>
                <span class="text-[11px] font-bold text-secondary uppercase tracking-wider">UI Display</span>
              </div>

              <div class="space-y-4">
                <div class="flex items-center justify-between py-1">
                  <div>
                    <span class="text-sm font-bold text-on-surface block">Dark Mode</span>
                    <span class="text-xs text-secondary">Switch between high-contrast dark theme and crisp daytime light mode</span>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="setting-dark-mode" ${userSettings.darkMode ? 'checked' : ''} class="sr-only peer">
                    <div class="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div class="flex items-center justify-between py-1 border-t border-surface-variant/40 pt-3">
                  <div>
                    <span class="text-sm font-bold text-on-surface block">Sound Effects</span>
                    <span class="text-xs text-secondary">Play subtle audio chime when cart updates and driver arrives</span>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="setting-sound" ${userSettings.soundAlerts ? 'checked' : ''} class="sr-only peer">
                    <div class="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>

            <!-- 2. Campus Batch & Delivery Preferences -->
            <div class="bg-surface-container-lowest border border-surface-variant rounded-2xl p-6 shadow-sm">
              <div class="flex items-center justify-between pb-4 mb-4 border-b border-surface-variant/50">
                <div class="flex items-center gap-2.5">
                  <span class="material-symbols-outlined text-primary text-xl">school</span>
                  <h3 class="text-base font-extrabold text-on-surface">Campus Drop Zone Defaults</h3>
                </div>
                <span class="bg-primary/10 text-primary text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">GL Bajaj Special</span>
              </div>

              <div class="space-y-4">
                <div>
                  <label class="block text-xs font-bold text-secondary uppercase mb-2">Primary Campus Drop Location</label>
                  <select id="setting-drop-zone" class="w-full bg-surface-container-low border border-surface-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-2.5 text-sm font-bold text-on-surface outline-none transition-all">
                    <option value="glb-boys-hostel" ${userSettings.defaultDropZone === 'glb-boys-hostel' ? 'selected' : ''}>GL Bajaj Boys Hostel (Block A &amp; B) - Free Batch Drop</option>
                    <option value="glb-girls-hostel" ${userSettings.defaultDropZone === 'glb-girls-hostel' ? 'selected' : ''}>GL Bajaj Girls Hostel (Block D) - Free Batch Drop</option>
                    <option value="glb-gate-2" ${userSettings.defaultDropZone === 'glb-gate-2' ? 'selected' : ''}>GL Bajaj Main Academic Block Gate 2 - Express</option>
                    <option value="kp3-hostel-hub" ${userSettings.defaultDropZone === 'kp3-hostel-hub' ? 'selected' : ''}>Knowledge Park III Housing Hub - Pool Delivery</option>
                  </select>
                  <p class="text-[11px] text-tertiary font-semibold mt-1.5 flex items-center gap-1">
                    <span class="material-symbols-outlined text-xs">savings</span>
                    Saves &#8377;40 delivery fee on every order delivered to campus drop zones.
                  </p>
                </div>

                <div class="flex items-center justify-between py-1 border-t border-surface-variant/40 pt-3">
                  <div>
                    <span class="text-sm font-bold text-on-surface block">Auto-Apply Smart Campus Coupons</span>
                    <span class="text-xs text-secondary">Automatically calculate and apply maximum savings promo codes at checkout</span>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="setting-auto-coupon" ${userSettings.autoApplyCoupons ? 'checked' : ''} class="sr-only peer">
                    <div class="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div class="border-t border-surface-variant/40 pt-3">
                  <label class="block text-xs font-bold text-secondary uppercase mb-2">Preferred Payment Method</label>
                  <div class="grid grid-cols-3 gap-3">
                    <label class="border border-surface-variant rounded-xl p-3 flex flex-col items-center gap-1.5 cursor-pointer hover:border-primary transition-all text-center">
                      <input type="radio" name="setting-payment" value="upi" ${userSettings.defaultPayment === 'upi' ? 'checked' : ''} class="text-primary focus:ring-primary">
                      <span class="material-symbols-outlined text-xl text-primary">qr_code_scanner</span>
                      <span class="text-xs font-bold text-on-surface">UPI / QR</span>
                    </label>
                    <label class="border border-surface-variant rounded-xl p-3 flex flex-col items-center gap-1.5 cursor-pointer hover:border-primary transition-all text-center">
                      <input type="radio" name="setting-payment" value="wallet" ${userSettings.defaultPayment === 'wallet' ? 'checked' : ''} class="text-primary focus:ring-primary">
                      <span class="material-symbols-outlined text-xl text-amber-500">account_balance_wallet</span>
                      <span class="text-xs font-bold text-on-surface">Foodly Wallet</span>
                    </label>
                    <label class="border border-surface-variant rounded-xl p-3 flex flex-col items-center gap-1.5 cursor-pointer hover:border-primary transition-all text-center">
                      <input type="radio" name="setting-payment" value="cod" ${userSettings.defaultPayment === 'cod' ? 'checked' : ''} class="text-primary focus:ring-primary">
                      <span class="material-symbols-outlined text-xl text-tertiary">payments</span>
                      <span class="text-xs font-bold text-on-surface">Cash on Drop</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- 3. Notification & Alert Channels -->
            <div class="bg-surface-container-lowest border border-surface-variant rounded-2xl p-6 shadow-sm">
              <div class="flex items-center justify-between pb-4 mb-4 border-b border-surface-variant/50">
                <div class="flex items-center gap-2.5">
                  <span class="material-symbols-outlined text-primary text-xl">notifications</span>
                  <h3 class="text-base font-extrabold text-on-surface">Notifications &amp; Telemetry Alerts</h3>
                </div>
                <span class="text-[11px] font-bold text-secondary uppercase tracking-wider">Channels</span>
              </div>

              <div class="space-y-4">
                <div class="flex items-center justify-between py-1">
                  <div>
                    <span class="text-sm font-bold text-on-surface block">Live SSE Telemetry Updates</span>
                    <span class="text-xs text-secondary">Real-time driver location stream during active deliveries</span>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="setting-push" ${userSettings.pushNotifications ? 'checked' : ''} class="sr-only peer">
                    <div class="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div class="flex items-center justify-between py-1 border-t border-surface-variant/40 pt-3">
                  <div>
                    <span class="text-sm font-bold text-on-surface block">WhatsApp Arrival Notifications</span>
                    <span class="text-xs text-secondary">Receive message when the courier reaches GL Bajaj campus gate</span>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="setting-whatsapp" ${userSettings.whatsappUpdates ? 'checked' : ''} class="sr-only peer">
                    <div class="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tertiary"></div>
                  </label>
                </div>

                <div class="flex items-center justify-between py-1 border-t border-surface-variant/40 pt-3">
                  <div>
                    <span class="text-sm font-bold text-on-surface block">Promotions &amp; Flash Night Canteen Deals</span>
                    <span class="text-xs text-secondary">Alerts about late-night study meal discounts in Knowledge Park</span>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="setting-promo" ${userSettings.promoAlerts ? 'checked' : ''} class="sr-only peer">
                    <div class="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>

            <!-- 4. Privacy, Security & Data Controls -->
            <div class="bg-surface-container-lowest border border-surface-variant rounded-2xl p-6 shadow-sm">
              <div class="flex items-center justify-between pb-4 mb-4 border-b border-surface-variant/50">
                <div class="flex items-center gap-2.5">
                  <span class="material-symbols-outlined text-primary text-xl">shield</span>
                  <h3 class="text-base font-extrabold text-on-surface">Privacy &amp; Data Storage</h3>
                </div>
                <span class="text-[11px] font-bold text-secondary uppercase tracking-wider">Storage</span>
              </div>

              <div class="space-y-4">
                <div class="flex items-center justify-between py-1">
                  <div>
                    <span class="text-sm font-bold text-on-surface block">Save Search History</span>
                    <span class="text-xs text-secondary">Keep recent cuisine searches for faster re-ordering</span>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="setting-search-hist" ${userSettings.saveSearchHistory ? 'checked' : ''} class="sr-only peer">
                    <div class="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div class="flex items-center justify-between py-1 border-t border-surface-variant/40 pt-3">
                  <div>
                    <span class="text-sm font-bold text-on-surface block">Clear Offline Cache &amp; Storage</span>
                    <span class="text-xs text-secondary">Reset saved cart items, cached restaurant listings, and order history</span>
                  </div>
                  <button id="clear-cache-btn" class="px-3.5 py-1.5 border border-error/40 text-error hover:bg-error hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer">
                    <span class="material-symbols-outlined text-sm">delete_sweep</span>
                    <span>Clear Cache</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Save All Settings Button -->
            <div class="flex justify-end gap-3 mt-2">
              <button id="save-settings-btn" class="bg-primary text-white font-bold px-8 py-3 rounded-xl hover:bg-primary/90 transition-all shadow-md active:scale-95 text-sm flex items-center gap-2 cursor-pointer">
                <span class="material-symbols-outlined text-base">check_circle</span>
                <span>Save All Preferences</span>
              </button>
            </div>

          </div>

          <!-- Right Column: Quick Account Overview & Support (4 Cols) -->
          <div class="lg:col-span-4 flex flex-col gap-6">

            <!-- Profile Summary Widget -->
            <div class="bg-surface-container-lowest border border-surface-variant rounded-2xl p-6 shadow-sm">
              <div class="text-center pb-4 border-b border-surface-variant/60">
                <div class="w-16 h-16 rounded-full ring-2 ring-primary mx-auto mb-2 overflow-hidden bg-surface-container-high">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTVPjBUv_wcuhbheNrpWtOJTfwPc5mjW5LWm-zjNqKTUgTAL9UtstSBmeEyHbsI1cnBGZyyzkp6nW7uyo1vK4N9TBBv9wByq5BPFO4YKzYlTGi-49I1x7ElqwuoTy94NaofPVU-5lTgrJmCeNrao97jk4bPcTUxHx05ML5JJcWhvkpdVHfE9mMa3Zh6xc0DeyQdfs1NqHbxp6WndVzkREV6PtzcmeTryjtq2tH-difGhyow6tk9j7P" class="w-full h-full object-cover" alt="User Avatar">
                </div>
                <h4 class="font-extrabold text-base text-on-surface">Prakhar Srivastava</h4>
                <p class="text-xs text-secondary">GL Bajaj Campus Resident</p>
                <div class="mt-2 inline-flex items-center gap-1 bg-amber-400/10 text-amber-600 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold">
                  <span class="material-symbols-outlined text-xs filled">workspace_premium</span>
                  <span>Gold Member</span>
                </div>
              </div>

              <div class="space-y-3 mt-4 text-xs font-semibold">
                <div class="flex items-center justify-between text-secondary">
                  <span>Account Status</span>
                  <span class="text-tertiary font-bold flex items-center gap-1">
                    <span class="material-symbols-outlined text-xs filled">check_circle</span> Active
                  </span>
                </div>
                <div class="flex items-center justify-between text-secondary">
                  <span>Campus Zone</span>
                  <span class="text-on-surface font-bold">GLB Boys Hostel</span>
                </div>
                <div class="flex items-center justify-between text-secondary">
                  <span>App Version</span>
                  <span class="text-on-surface font-bold">v2.4.0 (Campus Release)</span>
                </div>
              </div>

              <div class="mt-6 pt-4 border-t border-surface-variant/60">
                <a href="#profile" class="w-full bg-surface-container-low hover:bg-surface-container text-on-surface font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 text-center">
                  <span class="material-symbols-outlined text-sm">edit</span>
                  <span>Edit Personal Details</span>
                </a>
              </div>
            </div>

            <!-- Quick Links -->
            <div class="bg-surface-container-lowest border border-surface-variant rounded-2xl p-6 shadow-sm">
              <h4 class="font-extrabold text-sm text-on-surface mb-3 uppercase tracking-wide">Quick Support</h4>
              <div class="flex flex-col gap-2">
                <a href="#help" class="p-3 rounded-xl hover:bg-surface-container-low transition-colors flex items-center justify-between text-xs font-bold text-on-surface">
                  <span class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary text-base">help_center</span>
                    <span>Help &amp; FAQs</span>
                  </span>
                  <span class="material-symbols-outlined text-sm text-secondary">chevron_right</span>
                </a>
                <a href="#orders" class="p-3 rounded-xl hover:bg-surface-container-low transition-colors flex items-center justify-between text-xs font-bold text-on-surface">
                  <span class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary text-base">receipt_long</span>
                    <span>Order History</span>
                  </span>
                  <span class="material-symbols-outlined text-sm text-secondary">chevron_right</span>
                </a>
                <a href="#offers" class="p-3 rounded-xl hover:bg-surface-container-low transition-colors flex items-center justify-between text-xs font-bold text-on-surface">
                  <span class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary text-base">local_offer</span>
                    <span>Coupons &amp; Deals</span>
                  </span>
                  <span class="material-symbols-outlined text-sm text-secondary">chevron_right</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    `;

    // ── Event Handlers ────────────────────────────────────────────────────────
    const darkModeToggle = document.getElementById('setting-dark-mode');
    if (darkModeToggle) {
      darkModeToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      });
    }

    const clearCacheBtn = document.getElementById('clear-cache-btn');
    if (clearCacheBtn) {
      clearCacheBtn.addEventListener('click', () => {
        if (confirm("Clear local cache, recent searches, and saved cart items?")) {
          localStorage.removeItem('foodly_cart');
          localStorage.removeItem('foodly_recent_searches');
          localStorage.removeItem('foodly_orders_history');
          if (store && store.showToast) {
            store.showToast('Local cache and search history cleared!', 'success');
          }
        }
      });
    }

    const saveSettingsBtn = document.getElementById('save-settings-btn');
    if (saveSettingsBtn) {
      saveSettingsBtn.addEventListener('click', () => {
        const dropZone = document.getElementById('setting-drop-zone').value;
        const sound = document.getElementById('setting-sound').checked;
        const isDark = darkModeToggle ? darkModeToggle.checked : false;
        const autoCoupon = document.getElementById('setting-auto-coupon').checked;
        const pushNotif = document.getElementById('setting-push').checked;
        const whatsapp = document.getElementById('setting-whatsapp').checked;
        const promo = document.getElementById('setting-promo').checked;
        const searchHist = document.getElementById('setting-search-hist').checked;
        const paymentRadio = document.querySelector('input[name="setting-payment"]:checked');
        const paymentVal = paymentRadio ? paymentRadio.value : 'upi';

        const updatedSettings = {
          darkMode: isDark,
          soundAlerts: sound,
          defaultDropZone: dropZone,
          autoApplyCoupons: autoCoupon,
          pushNotifications: pushNotif,
          whatsappUpdates: whatsapp,
          promoAlerts: promo,
          saveSearchHistory: searchHist,
          defaultPayment: paymentVal
        };

        try {
          localStorage.setItem('foodly_app_settings', JSON.stringify(updatedSettings));
          localStorage.setItem('foodly_campus_zone', dropZone);
          if (store && store.setCampusMode) {
            store.setCampusMode(true, dropZone);
          }
        } catch (e) {}

        if (store && store.showToast) {
          store.showToast('✅ All settings saved successfully!', 'success');
        }
      });
    }
  }

  window.renderSettingsView = renderSettingsView;
})();
