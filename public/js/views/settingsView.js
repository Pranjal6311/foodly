// public/js/views/settingsView.js - Application Settings & User Preferences Screen
(function () {
  function renderSettingsView(container) {
    const store = window.foodlyStore;

    // Load user settings from localStorage
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

    // Synchronize current dark mode state with documentElement
    userSettings.darkMode = document.documentElement.classList.contains('dark');

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
                  <h3 class="text-base font-extrabold text-on-surface">Appearance &amp; Sound</h3>
                </div>
                <span class="text-[11px] font-bold text-secondary uppercase tracking-wider">UI Display</span>
              </div>

              <div class="space-y-4">
                <div class="flex items-center justify-between py-1">
                  <div>
                    <span class="text-sm font-bold text-on-surface block">Dark Theme Mode</span>
                    <span class="text-xs text-secondary">Switch between high-contrast dark theme and crisp daytime light mode</span>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="setting-dark-mode" ${userSettings.darkMode ? 'checked' : ''} class="sr-only peer">
                    <div class="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div class="flex items-center justify-between py-1 border-t border-surface-variant/40 pt-3">
                  <div class="flex-1 pr-4">
                    <div class="flex items-center gap-2">
                      <span class="text-sm font-bold text-on-surface">Sound Effects &amp; Chimes</span>
                      <button id="test-sound-btn" class="px-2 py-0.5 text-[10px] font-bold bg-primary/10 text-primary hover:bg-primary/20 rounded-md transition-colors cursor-pointer flex items-center gap-0.5">
                        <span class="material-symbols-outlined text-xs">volume_up</span> Test Chime
                      </button>
                    </div>
                    <span class="text-xs text-secondary">Play subtle audio chime when cart updates, coins earned, and driver arrives</span>
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
                    Saves ₹40 delivery fee on every order delivered to campus drop zones.
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
                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <label class="border border-surface-variant rounded-xl p-3 flex flex-col items-center gap-1.5 cursor-pointer hover:border-primary transition-all text-center ${userSettings.defaultPayment === 'upi' ? 'border-primary bg-primary/5' : ''}">
                      <input type="radio" name="setting-payment" value="upi" ${userSettings.defaultPayment === 'upi' ? 'checked' : ''} class="text-primary focus:ring-primary">
                      <span class="material-symbols-outlined text-xl text-primary">qr_code_scanner</span>
                      <span class="text-xs font-bold text-on-surface">UPI / QR</span>
                    </label>
                    <label class="border border-surface-variant rounded-xl p-3 flex flex-col items-center gap-1.5 cursor-pointer hover:border-primary transition-all text-center ${userSettings.defaultPayment === 'wallet' ? 'border-primary bg-primary/5' : ''}">
                      <input type="radio" name="setting-payment" value="wallet" ${userSettings.defaultPayment === 'wallet' ? 'checked' : ''} class="text-primary focus:ring-primary">
                      <span class="material-symbols-outlined text-xl text-amber-500">account_balance_wallet</span>
                      <span class="text-xs font-bold text-on-surface">Foodly Cash</span>
                    </label>
                    <label class="border border-surface-variant rounded-xl p-3 flex flex-col items-center gap-1.5 cursor-pointer hover:border-primary transition-all text-center ${userSettings.defaultPayment === 'card' ? 'border-primary bg-primary/5' : ''}">
                      <input type="radio" name="setting-payment" value="card" ${userSettings.defaultPayment === 'card' ? 'checked' : ''} class="text-primary focus:ring-primary">
                      <span class="material-symbols-outlined text-xl text-secondary">credit_card</span>
                      <span class="text-xs font-bold text-on-surface">Card</span>
                    </label>
                    <label class="border border-surface-variant rounded-xl p-3 flex flex-col items-center gap-1.5 cursor-pointer hover:border-primary transition-all text-center ${userSettings.defaultPayment === 'cod' ? 'border-primary bg-primary/5' : ''}">
                      <input type="radio" name="setting-payment" value="cod" ${userSettings.defaultPayment === 'cod' ? 'checked' : ''} class="text-primary focus:ring-primary">
                      <span class="material-symbols-outlined text-xl text-tertiary">payments</span>
                      <span class="text-xs font-bold text-on-surface">COD</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- 3. Dietary & Health Filters -->
            <div class="bg-surface-container-lowest border border-surface-variant rounded-2xl p-6 shadow-sm">
              <div class="flex items-center justify-between pb-4 mb-4 border-b border-surface-variant/50">
                <div class="flex items-center gap-2.5">
                  <span class="material-symbols-outlined text-primary text-xl">restaurant_menu</span>
                  <h3 class="text-base font-extrabold text-on-surface">Dietary &amp; Health Filters</h3>
                </div>
                <span class="text-[11px] font-bold text-secondary uppercase tracking-wider">Nutrition</span>
              </div>

              <div class="space-y-4">
                <div class="flex items-center justify-between py-1">
                  <div>
                    <span class="text-sm font-bold text-on-surface block">Navratri Satvik &amp; Vrat Mode</span>
                    <span class="text-xs text-secondary">Instantly show 100% Satvik, Sendha Namak, zero-onion garlic food across campus</span>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="setting-satvik" ${store && store.isVratMode ? 'checked' : ''} class="sr-only peer">
                    <div class="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                  </label>
                </div>

                <div class="flex items-center justify-between py-1 border-t border-surface-variant/40 pt-3">
                  <div>
                    <span class="text-sm font-bold text-on-surface block">Pure Vegetarian Filter</span>
                    <span class="text-xs text-secondary">Permanently filter out non-vegetarian items across all cafeteria menus</span>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="setting-pure-veg" ${userSettings.pureVegMode ? 'checked' : ''} class="sr-only peer">
                    <div class="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tertiary"></div>
                  </label>
                </div>

                <div class="flex items-center justify-between py-1 border-t border-surface-variant/40 pt-3">
                  <div>
                    <span class="text-sm font-bold text-on-surface block">High Calorie Warnings</span>
                    <span class="text-xs text-secondary">Show gentle alert tag on meal combinations exceeding 900 kcal</span>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="setting-calorie" ${userSettings.calorieWarning ? 'checked' : ''} class="sr-only peer">
                    <div class="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>

            <!-- 4. Notification & Alerts -->
            <div class="bg-surface-container-lowest border border-surface-variant rounded-2xl p-6 shadow-sm">
              <div class="flex items-center justify-between pb-4 mb-4 border-b border-surface-variant/50">
                <div class="flex items-center gap-2.5">
                  <span class="material-symbols-outlined text-primary text-xl">notifications</span>
                  <h3 class="text-base font-extrabold text-on-surface">Notifications &amp; Alerts</h3>
                </div>
                <button id="test-notif-btn" class="text-xs font-bold text-primary hover:underline cursor-pointer">Test Notification</button>
              </div>

              <div class="space-y-4">
                <div class="flex items-center justify-between py-1">
                  <div>
                    <span class="text-sm font-bold text-on-surface block">Browser Push Notifications</span>
                    <span class="text-xs text-secondary">Receive real-time live kitchen preparation and dispatch alerts</span>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="setting-push" ${userSettings.pushNotifications ? 'checked' : ''} class="sr-only peer">
                    <div class="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div class="flex items-center justify-between py-1 border-t border-surface-variant/40 pt-3">
                  <div>
                    <span class="text-sm font-bold text-on-surface block">WhatsApp Live Delivery Tracking</span>
                    <span class="text-xs text-secondary">Receive rider live GPS map link and order delivery pin via WhatsApp</span>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="setting-whatsapp" ${userSettings.whatsappUpdates ? 'checked' : ''} class="sr-only peer">
                    <div class="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tertiary"></div>
                  </label>
                </div>

                <div class="flex items-center justify-between py-1 border-t border-surface-variant/40 pt-3">
                  <div>
                    <span class="text-sm font-bold text-on-surface block">Promotional Alerts &amp; Free Night Drops</span>
                    <span class="text-xs text-secondary">Notify me when flash midnight discounts occur at campus cafeteria</span>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="setting-promo" ${userSettings.promoAlerts ? 'checked' : ''} class="sr-only peer">
                    <div class="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>

            <!-- 5. Data Privacy & Account Actions -->
            <div class="bg-surface-container-lowest border border-surface-variant rounded-2xl p-6 shadow-sm">
              <div class="flex items-center justify-between pb-4 mb-4 border-b border-surface-variant/50">
                <div class="flex items-center gap-2.5">
                  <span class="material-symbols-outlined text-primary text-xl">shield</span>
                  <h3 class="text-base font-extrabold text-on-surface">Data Privacy &amp; Cache</h3>
                </div>
                <span class="text-[11px] font-bold text-secondary uppercase tracking-wider">Storage</span>
              </div>

              <div class="space-y-4">
                <div class="flex items-center justify-between py-1">
                  <div>
                    <span class="text-sm font-bold text-on-surface block">Save Search History</span>
                    <span class="text-xs text-secondary">Keep your recent dish and restaurant searches for quick 1-tap re-queries</span>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="setting-search-hist" ${userSettings.saveSearchHistory ? 'checked' : ''} class="sr-only peer">
                    <div class="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div class="flex flex-wrap items-center gap-3 border-t border-surface-variant/40 pt-4">
                  <button id="clear-cache-btn" class="px-4 py-2 border border-surface-variant hover:border-error/50 hover:bg-error-container/10 text-error rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer">
                    <span class="material-symbols-outlined text-base">delete_sweep</span>
                    <span>Clear Search &amp; Cart Cache</span>
                  </button>

                  <button id="reset-settings-btn" class="px-4 py-2 border border-surface-variant hover:border-secondary hover:bg-surface-container text-secondary rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer">
                    <span class="material-symbols-outlined text-base">restart_alt</span>
                    <span>Reset Settings to Defaults</span>
                  </button>

                  <button id="export-data-btn" class="px-4 py-2 border border-surface-variant hover:border-primary text-primary hover:bg-primary/5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer">
                    <span class="material-symbols-outlined text-base">download</span>
                    <span>Export Profile Data (JSON)</span>
                  </button>
                </div>
              </div>
            </div>

          </div>

          <!-- Right Column: Save Action & Shortcuts (4 Cols) -->
          <div class="lg:col-span-4 flex flex-col gap-6">

            <!-- Sticky Save Changes Card -->
            <div class="bg-gradient-to-br from-surface-container-low to-surface-container border border-surface-variant rounded-2xl p-6 shadow-md sticky top-28">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <span class="material-symbols-outlined text-2xl">save</span>
                </div>
                <div>
                  <h4 class="font-extrabold text-sm text-on-surface">Save Preferences</h4>
                  <p class="text-xs text-secondary">Settings are stored on this device</p>
                </div>
              </div>

              <p class="text-xs text-secondary leading-relaxed mb-6">
                Your campus batch drop zone, dark theme choice, and dietary restrictions will automatically apply across all orders.
              </p>

              <button id="save-settings-btn" class="w-full bg-primary text-white font-extrabold py-3.5 px-6 rounded-xl hover:bg-primary/90 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 text-sm cursor-pointer">
                <span class="material-symbols-outlined text-base">check</span>
                <span>Save All Preferences</span>
              </button>

              <div class="mt-4 pt-4 border-t border-surface-variant/60 flex items-center justify-between text-[11px] text-secondary font-medium">
                <span class="flex items-center gap-1">
                  <span class="material-symbols-outlined text-xs text-tertiary filled">check_circle</span> Auto-sync active
                </span>
                <span>Foodly Web v2.4</span>
              </div>
            </div>

            <!-- Quick Navigation Shortcuts -->
            <div class="bg-surface-container-lowest border border-surface-variant rounded-2xl p-5 shadow-sm">
              <h4 class="text-sm font-extrabold text-on-surface mb-3 flex items-center gap-1.5">
                <span class="material-symbols-outlined text-base text-primary">link</span>
                <span>Quick Links</span>
              </h4>

              <div class="flex flex-col gap-1.5">
                <a href="#profile" class="p-3 rounded-xl hover:bg-surface-container-low transition-colors flex items-center justify-between text-xs font-bold text-on-surface">
                  <span class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary text-base">account_circle</span>
                    <span>My User Profile</span>
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
                <a href="#innovations" class="p-3 rounded-xl hover:bg-surface-container-low transition-colors flex items-center justify-between text-xs font-bold text-on-surface">
                  <span class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary text-base">electric_bike</span>
                    <span>Batch Pooling</span>
                  </span>
                  <span class="material-symbols-outlined text-sm text-secondary">chevron_right</span>
                </a>
                <a href="#help" class="p-3 rounded-xl hover:bg-surface-container-low transition-colors flex items-center justify-between text-xs font-bold text-on-surface">
                  <span class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary text-base">help_center</span>
                    <span>Help &amp; FAQs</span>
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

    // 1. Dark Mode Toggle
    const darkModeToggle = document.getElementById('setting-dark-mode');
    if (darkModeToggle) {
      darkModeToggle.addEventListener('change', (e) => {
        const isDark = e.target.checked;
        if (isDark) {
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('light');
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.classList.add('light');
        }
        userSettings.darkMode = isDark;
        saveSettings();
        if (store && store.playSound) store.playSound('chime');
        if (store && store.showToast) {
          store.showToast(isDark ? '🌙 Dark theme enabled' : '☀️ Light theme enabled', 'info');
        }
      });
    }

    // 2. Sound Toggle & Test Button
    const soundToggle = document.getElementById('setting-sound');
    if (soundToggle) {
      soundToggle.addEventListener('change', (e) => {
        userSettings.soundAlerts = e.target.checked;
        saveSettings();
        if (userSettings.soundAlerts && store && store.playSound) {
          store.playSound('chime');
        }
        if (store && store.showToast) {
          store.showToast(userSettings.soundAlerts ? '🔊 Sound alerts turned ON' : '🔇 Sound alerts turned OFF', 'info');
        }
      });
    }

    const testSoundBtn = document.getElementById('test-sound-btn');
    if (testSoundBtn) {
      testSoundBtn.addEventListener('click', () => {
        if (store && store.playSound) {
          store.playSound('cash');
          if (store.showToast) store.showToast('♪ Audio chime preview played', 'success');
        }
      });
    }

    // 3. Drop Zone Change
    const dropZoneSelect = document.getElementById('setting-drop-zone');
    if (dropZoneSelect) {
      dropZoneSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        userSettings.defaultDropZone = val;
        saveSettings();
        if (store && store.setCampusMode) {
          store.setCampusMode(true, val);
        }
        if (store && store.showToast) {
          store.showToast(`Default Drop Zone set to: ${dropZoneSelect.options[dropZoneSelect.selectedIndex].text}`, 'success');
        }
      });
    }

    // 4. Satvik / Vrat Mode
    const satvikToggle = document.getElementById('setting-satvik');
    if (satvikToggle) {
      satvikToggle.addEventListener('change', (e) => {
        if (store && store.setVratMode) {
          store.setVratMode(e.target.checked);
        }
      });
    }

    // 5. Pure Veg Mode
    const pureVegToggle = document.getElementById('setting-pure-veg');
    if (pureVegToggle) {
      pureVegToggle.addEventListener('change', (e) => {
        userSettings.pureVegMode = e.target.checked;
        saveSettings();
        if (store && store.setFilter) {
          store.setFilter('dietary', userSettings.pureVegMode ? 'Vegetarian' : '');
        }
        if (store && store.showToast) {
          store.showToast(userSettings.pureVegMode ? '🌱 Pure Vegetarian filter activated' : 'All dietary menus visible', 'info');
        }
      });
    }

    // 6. Test Notification Toast
    const testNotifBtn = document.getElementById('test-notif-btn');
    if (testNotifBtn) {
      testNotifBtn.addEventListener('click', () => {
        if (store && store.showToast) {
          store.showToast('🔔 Order #FD-9204: Rider Rahul is 2 mins away at GL Bajaj Gate 2!', 'success');
          if (store.playSound) store.playSound('cash');
        }
      });
    }

    // 7. Clear Cache Button
    const clearCacheBtn = document.getElementById('clear-cache-btn');
    if (clearCacheBtn) {
      clearCacheBtn.addEventListener('click', () => {
        if (confirm("Clear local cache, recent searches, and saved cart items? (Profile & Order history remain safe)")) {
          localStorage.removeItem('foodly_cart');
          localStorage.removeItem('foodly_recent_searches');
          if (store && store.clearCart) store.clearCart();
          if (store && store.showToast) {
            store.showToast('Local cache and search history cleared successfully!', 'success');
          }
        }
      });
    }

    // 8. Reset Settings to Defaults
    const resetSettingsBtn = document.getElementById('reset-settings-btn');
    if (resetSettingsBtn) {
      resetSettingsBtn.addEventListener('click', () => {
        if (confirm("Reset all settings and delivery zone preferences to default?")) {
          userSettings = { ...defaultSettings };
          saveSettings();
          document.documentElement.classList.remove('dark');
          document.documentElement.classList.add('light');
          if (store && store.showToast) {
            store.showToast('All settings restored to factory defaults', 'info');
          }
          renderSettingsView(container);
        }
      });
    }

    // 9. Export Profile & Account Data
    const exportDataBtn = document.getElementById('export-data-btn');
    if (exportDataBtn) {
      exportDataBtn.addEventListener('click', () => {
        const exportObj = {
          user: store && store.getUser ? store.getUser() : null,
          settings: userSettings,
          orders: store && store.orders ? store.orders : [],
          savedAddresses: store && store.getSavedAddresses ? store.getSavedAddresses() : [],
          exportedAt: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `foodly_account_data_${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        if (store && store.showToast) {
          store.showToast('Account data exported as JSON file!', 'success');
        }
      });
    }

    // 10. Save All Preferences Button
    function saveSettings() {
      try {
        localStorage.setItem('foodly_app_settings', JSON.stringify(userSettings));
        if (userSettings.defaultDropZone) {
          localStorage.setItem('foodly_campus_zone', userSettings.defaultDropZone);
        }
      } catch (e) {}
    }

    const saveSettingsBtn = document.getElementById('save-settings-btn');
    if (saveSettingsBtn) {
      saveSettingsBtn.addEventListener('click', () => {
        const dropZone = document.getElementById('setting-drop-zone')?.value || userSettings.defaultDropZone;
        const sound = document.getElementById('setting-sound')?.checked ?? true;
        const isDark = darkModeToggle ? darkModeToggle.checked : false;
        const autoCoupon = document.getElementById('setting-auto-coupon')?.checked ?? true;
        const pushNotif = document.getElementById('setting-push')?.checked ?? true;
        const whatsapp = document.getElementById('setting-whatsapp')?.checked ?? true;
        const promo = document.getElementById('setting-promo')?.checked ?? true;
        const searchHist = document.getElementById('setting-search-hist')?.checked ?? true;
        const calorie = document.getElementById('setting-calorie')?.checked ?? false;
        const pureVeg = document.getElementById('setting-pure-veg')?.checked ?? false;
        const paymentRadio = document.querySelector('input[name="setting-payment"]:checked');
        const paymentVal = paymentRadio ? paymentRadio.value : 'upi';

        userSettings = {
          darkMode: isDark,
          soundAlerts: sound,
          defaultDropZone: dropZone,
          autoApplyCoupons: autoCoupon,
          pushNotifications: pushNotif,
          whatsappUpdates: whatsapp,
          promoAlerts: promo,
          saveSearchHistory: searchHist,
          calorieWarning: calorie,
          pureVegMode: pureVeg,
          defaultPayment: paymentVal
        };

        saveSettings();

        if (store && store.setCampusMode) {
          store.setCampusMode(true, dropZone);
        }
        if (store && store.setFilter) {
          store.setFilter('dietary', pureVeg ? 'Vegetarian' : '');
        }

        saveSettingsBtn.innerHTML = `
          <span class="material-symbols-outlined text-base">task_alt</span>
          <span>Preferences Saved!</span>
        `;
        setTimeout(() => {
          saveSettingsBtn.innerHTML = `
            <span class="material-symbols-outlined text-base">check</span>
            <span>Save All Preferences</span>
          `;
        }, 2000);

        if (store && store.playSound) store.playSound('cash');
        if (store && store.showToast) {
          store.showToast('✅ All settings & campus preferences successfully saved!', 'success');
        }
      });
    }
  }

  window.renderSettingsView = renderSettingsView;
})();
