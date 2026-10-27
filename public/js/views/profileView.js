// public/js/views/profileView.js - User Profile & Account Settings Screen
(function () {
  function renderProfileView(container) {
    const store = window.foodlyStore;

    // Load user profile data
    let profileData = {
      name: "Prakhar Srivastava",
      email: "prakhar.s@foodly.in",
      phone: "+91 98765 43210",
      dob: "1998-08-15",
      campusId: "GLB/2023/CS/412",
      vegMode: false,
      spiceLevel: "Medium",
      ecoCutlery: true,
      whatsappUpdates: true,
      smsUpdates: true,
      walletBalance: 350
    };

    try {
      const saved = localStorage.getItem('foodly_user_profile');
      if (saved) profileData = { ...profileData, ...JSON.parse(saved) };
    } catch (e) {}

    // Safe recent orders access
    const ordersList = (store && store.orders ? store.orders : (store && store.loadOrders ? store.loadOrders() : []));
    const recentOrders = ordersList.slice(0, 3);
    const savedAddresses = store && store.getSavedAddresses ? store.getSavedAddresses() : [];

    container.innerHTML = `
      <div class="fade-in max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8">
        <!-- Top Profile Banner -->
        <div class="bg-gradient-to-r from-surface-container-lowest via-surface-container-low to-surface-container border border-surface-variant rounded-3xl p-6 md:p-8 shadow-lg mb-8 relative overflow-hidden">
          <div class="absolute -right-12 -top-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div class="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
            <!-- Avatar with VIP Badge -->
            <div class="relative shrink-0">
              <div class="w-24 h-24 md:w-28 md:h-28 rounded-full ring-4 ring-primary/20 overflow-hidden shadow-md bg-surface-container-high">
                <img 
                  id="profile-avatar-img"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTVPjBUv_wcuhbheNrpWtOJTfwPc5mjW5LWm-zjNqKTUgTAL9UtstSBmeEyHbsI1cnBGZyyzkp6nW7uyo1vK4N9TBBv9wByq5BPFO4YKzYlTGi-49I1x7ElqwuoTy94NaofPVU-5lTgrJmCeNrao97jk4bPcTUxHx05ML5JJcWhvkpdVHfE9mMa3Zh6xc0DeyQdfs1NqHbxp6WndVzkREV6PtzcmeTryjtq2tH-difGhyow6tk9j7P" 
                  alt="${profileData.name}"
                  class="w-full h-full object-cover"
                />
              </div>
              <span class="absolute bottom-0 right-0 bg-primary text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-0.5">
                <span class="material-symbols-outlined text-xs filled text-amber-300">workspace_premium</span>
                Gold
              </span>
            </div>

            <!-- Profile Info & Metrics -->
            <div class="flex-1 text-center md:text-left">
              <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                <div>
                  <div class="flex items-center justify-center md:justify-start gap-2">
                    <h1 class="text-2xl md:text-3xl font-extrabold text-on-surface" id="profile-name-display">${profileData.name}</h1>
                    <span class="bg-primary/10 text-primary text-[11px] font-bold px-2 py-0.5 rounded-full">GL Bajaj Scholar</span>
                  </div>
                  <p class="text-xs md:text-sm text-secondary font-medium mt-1 flex flex-wrap items-center justify-center md:justify-start gap-2">
                    <span class="flex items-center gap-1"><span class="material-symbols-outlined text-xs">mail</span><span id="profile-email-display">${profileData.email}</span></span>
                    <span>&bull;</span>
                    <span class="flex items-center gap-1"><span class="material-symbols-outlined text-xs">phone</span><span id="profile-phone-display">${profileData.phone}</span></span>
                    <span>&bull;</span>
                    <span class="flex items-center gap-1 text-tertiary font-bold"><span class="material-symbols-outlined text-xs">school</span>${profileData.campusId || 'GLB/2023/CS/412'}</span>
                  </p>
                </div>
                <div class="flex items-center justify-center gap-2">
                  <a href="#settings" class="px-3.5 py-1.5 bg-surface-container-high hover:bg-surface-container border border-surface-variant hover:border-primary rounded-xl text-xs font-bold text-on-surface hover:text-primary transition-all flex items-center gap-1.5 shadow-sm">
                    <span class="material-symbols-outlined text-base text-primary">settings</span>
                    <span>Settings</span>
                  </a>
                  <a href="#help" class="px-3.5 py-1.5 border border-surface-variant hover:border-primary rounded-xl text-xs font-bold text-on-surface hover:text-primary transition-all flex items-center gap-1 shadow-sm">
                    <span class="material-symbols-outlined text-base">support_agent</span>
                    <span>Need Help?</span>
                  </a>
                </div>
              </div>

              <!-- Quick Perks Bar -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-surface-variant/60">
                <div class="bg-surface-container-lowest/80 p-3 rounded-xl border border-surface-variant/40 text-center">
                  <span class="text-[11px] font-bold text-secondary uppercase block">Wallet Cash</span>
                  <span class="text-lg font-extrabold text-primary" id="profile-wallet-val">₹${profileData.walletBalance}</span>
                </div>
                <div class="bg-surface-container-lowest/80 p-3 rounded-xl border border-surface-variant/40 text-center">
                  <span class="text-[11px] font-bold text-secondary uppercase block">Orders Placed</span>
                  <span class="text-lg font-extrabold text-on-surface" id="profile-orders-count">${ordersList.length}</span>
                </div>
                <div class="bg-surface-container-lowest/80 p-3 rounded-xl border border-surface-variant/40 text-center">
                  <span class="text-[11px] font-bold text-secondary uppercase block">Saved with Coupons</span>
                  <span class="text-lg font-extrabold text-tertiary">₹1,420</span>
                </div>
                <div class="bg-surface-container-lowest/80 p-3 rounded-xl border border-surface-variant/40 text-center">
                  <span class="text-[11px] font-bold text-secondary uppercase block">Reward Points</span>
                  <span class="text-lg font-extrabold text-amber-500">680 pts</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Profile Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <!-- Left Column: Forms and Addresses (8 Cols) -->
          <div class="lg:col-span-8 flex flex-col gap-8">
            <!-- 1. Personal Information Card -->
            <div class="bg-surface-container-lowest border border-surface-variant rounded-2xl p-6 shadow-sm">
              <div class="flex items-center justify-between mb-5">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-primary text-xl">person</span>
                  <h3 class="text-lg font-extrabold text-on-surface">Personal Information</h3>
                </div>
                <span class="text-xs font-semibold text-tertiary flex items-center gap-1">
                  <span class="material-symbols-outlined text-xs filled">verified</span> Account Verified
                </span>
              </div>

              <form id="profile-details-form" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-secondary uppercase mb-1">Full Name</label>
                  <input 
                    type="text" 
                    id="profile-input-name"
                    value="${profileData.name}" 
                    required
                    class="w-full bg-surface-container-low border border-surface-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-2.5 text-sm font-medium text-on-surface outline-none transition-all"
                  />
                </div>
                <div>
                  <label class="block text-xs font-bold text-secondary uppercase mb-1">Email Address</label>
                  <input 
                    type="email" 
                    id="profile-input-email"
                    value="${profileData.email}" 
                    required
                    class="w-full bg-surface-container-low border border-surface-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-2.5 text-sm font-medium text-on-surface outline-none transition-all"
                  />
                </div>
                <div>
                  <label class="block text-xs font-bold text-secondary uppercase mb-1">Mobile Phone</label>
                  <input 
                    type="tel" 
                    id="profile-input-phone"
                    value="${profileData.phone}" 
                    required
                    class="w-full bg-surface-container-low border border-surface-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-2.5 text-sm font-medium text-on-surface outline-none transition-all"
                  />
                </div>
                <div>
                  <label class="block text-xs font-bold text-secondary uppercase mb-1">Date of Birth</label>
                  <input 
                    type="date" 
                    id="profile-input-dob"
                    value="${profileData.dob}" 
                    class="w-full bg-surface-container-low border border-surface-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-2.5 text-sm font-medium text-on-surface outline-none transition-all"
                  />
                </div>
                <div class="sm:col-span-2">
                  <label class="block text-xs font-bold text-secondary uppercase mb-1">College Roll No / Campus ID</label>
                  <input 
                    type="text" 
                    id="profile-input-campus-id"
                    value="${profileData.campusId || 'GLB/2023/CS/412'}" 
                    placeholder="e.g. GLB/2023/CS/412"
                    class="w-full bg-surface-container-low border border-surface-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-2.5 text-sm font-medium text-on-surface outline-none transition-all"
                  />
                </div>
                <div class="sm:col-span-2 flex items-center justify-between pt-2">
                  <span class="text-xs text-secondary">Last updated: <span class="font-medium text-on-surface">Today</span></span>
                  <button type="submit" id="save-profile-btn" class="bg-primary text-white font-bold px-6 py-2.5 rounded-xl hover:bg-primary/90 transition-all shadow-md active:scale-95 text-xs flex items-center gap-1.5 cursor-pointer">
                    <span class="material-symbols-outlined text-sm">save</span>
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </div>

            <!-- 2. Saved Delivery Addresses -->
            <div class="bg-surface-container-lowest border border-surface-variant rounded-2xl p-6 shadow-sm">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-primary text-xl">home_pin</span>
                  <h3 class="text-lg font-extrabold text-on-surface">Saved Delivery Addresses</h3>
                </div>
                <div class="flex items-center gap-2">
                  <button id="profile-auto-gps-btn" class="px-3 py-1.5 bg-surface-container-low hover:bg-surface-container border border-surface-variant text-primary rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer">
                    <span class="material-symbols-outlined text-xs">my_location</span>
                    <span>GPS Auto-Locate</span>
                  </button>
                  <button id="add-new-address-btn" class="bg-primary text-white text-xs font-bold px-3.5 py-1.5 rounded-xl hover:bg-primary/90 transition-all flex items-center gap-1 cursor-pointer shadow-sm">
                    <span class="material-symbols-outlined text-sm">add</span>
                    <span>Add New</span>
                  </button>
                </div>
              </div>

              <!-- Inline Add New Address Form (Hidden by default) -->
              <div id="new-address-form-box" class="hidden mb-4 p-4 rounded-xl border border-primary/40 bg-primary/5 transition-all">
                <h4 class="text-xs font-extrabold text-primary uppercase tracking-wider mb-3 flex items-center gap-1">
                  <span class="material-symbols-outlined text-sm">add_location_alt</span>
                  <span>Add New Delivery Address</span>
                </h4>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                  <div>
                    <label class="block text-[11px] font-bold text-secondary uppercase mb-1">Tag / Label</label>
                    <input type="text" id="new-addr-tag" placeholder="e.g. Hostel Room, Library, Lab" class="w-full bg-surface-container-lowest border border-surface-variant rounded-lg px-3 py-2 text-xs font-medium text-on-surface outline-none focus:border-primary"/>
                  </div>
                  <div class="sm:col-span-2">
                    <label class="block text-[11px] font-bold text-secondary uppercase mb-1">Full Delivery Address</label>
                    <input type="text" id="new-addr-text" placeholder="Building, Room Number, Landmark, Campus Block" class="w-full bg-surface-container-lowest border border-surface-variant rounded-lg px-3 py-2 text-xs font-medium text-on-surface outline-none focus:border-primary"/>
                  </div>
                </div>
                <div class="flex justify-end gap-2">
                  <button type="button" id="cancel-add-addr-btn" class="px-3 py-1.5 text-xs font-bold text-secondary hover:text-on-surface border border-surface-variant rounded-lg cursor-pointer">Cancel</button>
                  <button type="button" id="submit-add-addr-btn" class="px-4 py-1.5 text-xs font-bold bg-primary text-white rounded-lg hover:bg-primary/90 transition-all shadow-sm cursor-pointer">Save Address</button>
                </div>
              </div>

              <!-- Addresses List -->
              <div class="flex flex-col gap-3" id="saved-addresses-list">
                ${savedAddresses.map(addr => {
                  const isCurrent = store && store.activeAddress === addr.address;
                  return `
                    <div class="p-4 rounded-xl border ${isCurrent ? 'border-primary bg-primary/5' : 'border-surface-variant bg-surface-container-lowest hover:border-primary/40'} flex items-start justify-between gap-3 transition-colors">
                      <div class="flex items-start gap-3 flex-1">
                        <span class="material-symbols-outlined ${isCurrent ? 'text-primary' : 'text-secondary'} text-2xl mt-0.5">
                          ${addr.tag && addr.tag.toLowerCase().includes('hostel') ? 'apartment' : (addr.tag && addr.tag.toLowerCase().includes('gate') ? 'door_front' : 'location_on')}
                        </span>
                        <div>
                          <div class="flex items-center gap-2 mb-1">
                            <span class="font-bold text-sm text-on-surface">${addr.tag}</span>
                            ${isCurrent ? '<span class="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Active Delivery Target</span>' : ''}
                          </div>
                          <p class="text-xs text-secondary leading-relaxed">${addr.address}</p>
                        </div>
                      </div>
                      <div class="flex items-center gap-2 shrink-0">
                        ${!isCurrent ? `
                          <button class="select-address-btn text-xs font-bold px-3 py-1.5 rounded-lg border border-surface-variant hover:border-primary text-primary hover:bg-primary/5 transition-all cursor-pointer" data-address="${encodeURIComponent(addr.address)}">
                            Select
                          </button>
                        ` : `
                          <span class="text-xs font-bold text-tertiary flex items-center gap-0.5 py-1.5 px-2">
                            <span class="material-symbols-outlined text-sm filled">check_circle</span> Active
                          </span>
                        `}
                        ${!addr.isPrimary ? `
                          <button class="delete-address-btn text-secondary hover:text-error p-1.5 rounded-lg transition-colors cursor-pointer" title="Delete address" data-id="${addr.id}">
                            <span class="material-symbols-outlined text-sm">delete</span>
                          </button>
                        ` : ''}
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- 3. Dietary & Notification Preferences -->
            <div class="bg-surface-container-lowest border border-surface-variant rounded-2xl p-6 shadow-sm">
              <div class="flex items-center gap-2 mb-4">
                <span class="material-symbols-outlined text-primary text-xl">tune</span>
                <h3 class="text-lg font-extrabold text-on-surface">Dining &amp; Order Preferences</h3>
              </div>

              <div class="space-y-4">
                <!-- Pure Veg Toggle -->
                <div class="flex items-center justify-between py-2 border-b border-surface-variant/50">
                  <div class="flex items-start gap-3">
                    <span class="material-symbols-outlined text-tertiary text-xl mt-0.5">eco</span>
                    <div>
                      <span class="text-sm font-bold text-on-surface block">Pure Vegetarian Mode</span>
                      <span class="text-xs text-secondary">Only show vegetarian meals and pure veg restaurants across Foodly</span>
                    </div>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="pref-veg-toggle" ${profileData.vegMode ? 'checked' : ''} class="sr-only peer">
                    <div class="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tertiary"></div>
                  </label>
                </div>

                <!-- Green Cutlery Opt-out -->
                <div class="flex items-center justify-between py-2 border-b border-surface-variant/50">
                  <div class="flex items-start gap-3">
                    <span class="material-symbols-outlined text-secondary text-xl mt-0.5">forest</span>
                    <div>
                      <span class="text-sm font-bold text-on-surface block">Green Planet Initiative</span>
                      <span class="text-xs text-secondary">Do not include disposable plastic cutlery (reduce plastic campus waste)</span>
                    </div>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="pref-eco-toggle" ${profileData.ecoCutlery ? 'checked' : ''} class="sr-only peer">
                    <div class="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <!-- WhatsApp Live Tracking -->
                <div class="flex items-center justify-between py-2 border-b border-surface-variant/50">
                  <div class="flex items-start gap-3">
                    <span class="material-symbols-outlined text-tertiary text-xl mt-0.5">chat</span>
                    <div>
                      <span class="text-sm font-bold text-on-surface block">WhatsApp Live Tracking</span>
                      <span class="text-xs text-secondary">Receive rider live GPS map link and order delivery pin via WhatsApp</span>
                    </div>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="pref-wa-toggle" ${profileData.whatsappUpdates ? 'checked' : ''} class="sr-only peer">
                    <div class="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tertiary"></div>
                  </label>
                </div>

                <!-- Navratri Vrat Mode -->
                <div class="flex items-center justify-between py-2">
                  <div class="flex items-start gap-3">
                    <span class="material-symbols-outlined text-amber-600 text-xl mt-0.5">temple_hindu</span>
                    <div>
                      <span class="text-sm font-bold text-on-surface block">Navratri Satvik &amp; Vrat Food</span>
                      <span class="text-xs text-secondary">Sendha namak, buckwheat, and zero onion/garlic preparation</span>
                    </div>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="pref-vrat-toggle" ${store && store.isVratMode ? 'checked' : ''} class="sr-only peer">
                    <div class="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Wallet & Recent Orders Quick Reorder (4 Cols) -->
          <div class="lg:col-span-4 flex flex-col gap-6">
            <!-- Foodly Wallet Card -->
            <div class="bg-gradient-to-br from-primary to-primary-container text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div class="flex justify-between items-start mb-6">
                <div>
                  <span class="text-xs font-semibold text-white/80 block uppercase tracking-wider">Foodly Cash Wallet</span>
                  <h3 class="text-3xl font-extrabold mt-1" id="wallet-big-val">₹${profileData.walletBalance}.00</h3>
                </div>
                <span class="material-symbols-outlined text-3xl text-white/70">account_balance_wallet</span>
              </div>

              <div class="flex items-center gap-2 mb-3">
                <button type="button" class="quick-wallet-btn flex-1 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold transition-all backdrop-blur-sm cursor-pointer" data-amt="100">+ ₹100</button>
                <button type="button" class="quick-wallet-btn flex-1 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold transition-all backdrop-blur-sm cursor-pointer" data-amt="500">+ ₹500</button>
                <button type="button" class="quick-wallet-btn flex-1 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold transition-all backdrop-blur-sm cursor-pointer" data-amt="1000">+ ₹1000</button>
              </div>

              <!-- Custom Amount Input -->
              <div class="flex items-center gap-2 mb-4">
                <input type="number" id="custom-wallet-input" placeholder="Custom ₹" min="50" max="10000" class="w-full bg-white/10 border border-white/30 text-white placeholder-white/60 text-xs font-bold rounded-lg px-3 py-1.5 outline-none"/>
                <button type="button" id="custom-wallet-btn" class="bg-white text-primary text-xs font-extrabold px-3 py-1.5 rounded-lg hover:bg-white/90 transition-all shrink-0 cursor-pointer shadow-sm">Add Cash</button>
              </div>

              <p class="text-[11px] text-white/80 flex items-center gap-1">
                <span class="material-symbols-outlined text-xs">bolt</span>
                Instant 1-tap checkout with zero OTP delays
              </p>
            </div>

            <!-- Saved Payment Cards Preview -->
            <div class="bg-surface-container-lowest border border-surface-variant rounded-2xl p-5 shadow-sm">
              <div class="flex items-center justify-between mb-3">
                <h4 class="text-sm font-extrabold text-on-surface flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-base text-primary">credit_card</span>
                  <span>Payment Methods</span>
                </h4>
                <button id="add-upi-btn" class="text-primary text-xs font-bold hover:underline cursor-pointer">+ Add UPI</button>
              </div>

              <div class="flex flex-col gap-2.5 text-xs" id="payment-methods-list">
                <div class="p-3 bg-surface-container-low rounded-xl border border-surface-variant/50 flex items-center justify-between">
                  <div class="flex items-center gap-2.5">
                    <span class="material-symbols-outlined text-primary text-xl">qr_code_scanner</span>
                    <div>
                      <span class="font-bold text-on-surface block">Google Pay / PhonePe UPI</span>
                      <span class="text-secondary text-[11px]">prakhar@okaxis</span>
                    </div>
                  </div>
                  <span class="text-primary font-extrabold text-[10px] bg-primary/10 px-2 py-0.5 rounded-full">Primary</span>
                </div>

                <div class="p-3 bg-surface-container-low rounded-xl border border-surface-variant/50 flex items-center justify-between">
                  <div class="flex items-center gap-2.5">
                    <span class="material-symbols-outlined text-secondary text-xl">credit_card</span>
                    <div>
                      <span class="font-bold text-on-surface block">HDFC Regalia Credit Card</span>
                      <span class="text-secondary text-[11px]">•••• 4921 • Exp 09/28</span>
                    </div>
                  </div>
                  <span class="text-secondary text-[11px] font-bold">Visa</span>
                </div>
              </div>
            </div>

            <!-- Recent Orders & Quick Reorder -->
            <div class="bg-surface-container-lowest border border-surface-variant rounded-2xl p-5 shadow-sm">
              <div class="flex justify-between items-center mb-4">
                <h4 class="text-sm font-extrabold text-on-surface flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-base text-primary">history</span>
                  <span>Recent Orders</span>
                </h4>
                <a href="#orders" class="text-primary text-xs font-bold hover:underline">View All</a>
              </div>

              ${recentOrders.length === 0 ? `
                <p class="text-xs text-secondary py-4 text-center">No previous orders yet.</p>
              ` : `
                <div class="flex flex-col gap-3">
                  ${recentOrders.map(order => `
                    <div class="p-3 bg-surface-container-low rounded-xl border border-surface-variant/50 flex flex-col gap-2.5">
                      <div class="flex justify-between items-start">
                        <div>
                          <span class="font-bold text-xs text-on-surface block">${order.restaurantName}</span>
                          <span class="text-[11px] text-secondary font-medium">₹${order.bill ? order.bill.total : 0} • ${order.items ? order.items.length : 1} item(s)</span>
                        </div>
                        <span class="text-[10px] font-bold text-tertiary bg-tertiary/10 px-2 py-0.5 rounded-full uppercase">
                          ${order.status || 'Delivered'}
                        </span>
                      </div>
                      <div class="flex items-center gap-2">
                        <a href="#track/${order.id}" class="flex-1 text-center text-[11px] font-bold text-primary hover:bg-primary/10 border border-primary/30 py-1.5 rounded-lg transition-colors">
                          Track Live
                        </a>
                        <button class="reorder-btn flex-1 text-center text-[11px] font-bold bg-primary text-white hover:bg-primary/90 py-1.5 rounded-lg transition-colors cursor-pointer shadow-sm" data-order='${JSON.stringify({ restaurantName: order.restaurantName, items: order.items || [] }).replace(/'/g, "&apos;")}'>
                          Reorder
                        </button>
                      </div>
                    </div>
                  `).join('')}
                </div>
              `}
            </div>
          </div>
        </div>
      </div>
    `;

    // ── Interactive Handlers ──────────────────────────────────────────────────

    // 1. Profile details form submit
    const profileForm = document.getElementById('profile-details-form');
    if (profileForm) {
      profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        profileData.name = document.getElementById('profile-input-name').value.trim() || profileData.name;
        profileData.email = document.getElementById('profile-input-email').value.trim() || profileData.email;
        profileData.phone = document.getElementById('profile-input-phone').value.trim() || profileData.phone;
        profileData.dob = document.getElementById('profile-input-dob').value || profileData.dob;
        profileData.campusId = document.getElementById('profile-input-campus-id').value.trim() || profileData.campusId;

        if (store && store.updateProfile) {
          store.updateProfile(profileData);
        } else {
          localStorage.setItem('foodly_user_profile', JSON.stringify(profileData));
        }

        document.getElementById('profile-name-display').textContent = profileData.name;
        document.getElementById('profile-email-display').textContent = profileData.email;
        document.getElementById('profile-phone-display').textContent = profileData.phone;

        if (store && store.showToast) {
          store.showToast('✅ Profile information updated successfully!', 'success');
          store.playSound('chime');
        }
      });
    }

    // 2. Add New Address Drawer/Form Toggle
    const addAddrBtn = document.getElementById('add-new-address-btn');
    const formBox = document.getElementById('new-address-form-box');
    const cancelAddBtn = document.getElementById('cancel-add-addr-btn');
    const submitAddBtn = document.getElementById('submit-add-addr-btn');

    if (addAddrBtn && formBox) {
      addAddrBtn.addEventListener('click', () => {
        formBox.classList.remove('hidden');
        document.getElementById('new-addr-tag').focus();
      });
    }

    if (cancelAddBtn && formBox) {
      cancelAddBtn.addEventListener('click', () => {
        formBox.classList.add('hidden');
      });
    }

    if (submitAddBtn && formBox) {
      submitAddBtn.addEventListener('click', () => {
        const tag = document.getElementById('new-addr-tag').value.trim();
        const text = document.getElementById('new-addr-text').value.trim();
        if (!text) {
          if (store && store.showToast) store.showToast('Please enter an address line', 'error');
          return;
        }

        if (store && store.addSavedAddress) {
          store.addSavedAddress(tag || 'Campus Place', text);
        }
        formBox.classList.add('hidden');
        document.getElementById('new-addr-tag').value = '';
        document.getElementById('new-addr-text').value = '';

        if (store && store.showToast) {
          store.showToast('New delivery address saved!', 'success');
        }
        renderProfileView(container);
      });
    }

    // 3. Select Delivery Address
    container.querySelectorAll('.select-address-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const addrText = decodeURIComponent(btn.getAttribute('data-address'));
        if (store && store.setAddress) {
          store.setAddress(addrText);
        }
        if (store && store.showToast) {
          store.showToast(`Active delivery address switched to: ${addrText.slice(0, 35)}...`, 'success');
        }
        renderProfileView(container);
      });
    });

    // 4. Delete Address
    container.querySelectorAll('.delete-address-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm("Remove this saved address?")) {
          if (store && store.deleteSavedAddress) {
            store.deleteSavedAddress(id);
          }
          if (store && store.showToast) {
            store.showToast('Address removed', 'info');
          }
          renderProfileView(container);
        }
      });
    });

    // 5. GPS Auto-Locate Button
    const gpsBtn = document.getElementById('profile-auto-gps-btn');
    if (gpsBtn) {
      gpsBtn.addEventListener('click', async () => {
        gpsBtn.disabled = true;
        gpsBtn.innerHTML = `<span class="material-symbols-outlined text-xs animate-spin">progress_activity</span><span>Locating...</span>`;
        if (store && store.detectCurrentLocation) {
          await store.detectCurrentLocation(false);
        }
        gpsBtn.disabled = false;
        gpsBtn.innerHTML = `<span class="material-symbols-outlined text-xs">my_location</span><span>GPS Auto-Locate</span>`;
        renderProfileView(container);
      });
    }

    // 6. Preferences checkboxes
    const vegToggle = document.getElementById('pref-veg-toggle');
    if (vegToggle) {
      vegToggle.addEventListener('change', (e) => {
        profileData.vegMode = e.target.checked;
        if (store && store.updateProfile) store.updateProfile(profileData);
        if (store && store.setFilter) {
          store.setFilter('dietary', profileData.vegMode ? 'Vegetarian' : '');
        }
        if (store && store.showToast) {
          store.showToast(profileData.vegMode ? '🌱 Pure Vegetarian mode enabled!' : 'Showing all dietary options', 'info');
        }
      });
    }

    const ecoToggle = document.getElementById('pref-eco-toggle');
    if (ecoToggle) {
      ecoToggle.addEventListener('change', (e) => {
        profileData.ecoCutlery = e.target.checked;
        if (store && store.updateProfile) store.updateProfile(profileData);
        if (store && store.showToast) {
          store.showToast(profileData.ecoCutlery ? '🌍 Plastic cutlery opt-out active. Thank you!' : 'Cutlery preference updated', 'info');
        }
      });
    }

    const waToggle = document.getElementById('pref-wa-toggle');
    if (waToggle) {
      waToggle.addEventListener('change', (e) => {
        profileData.whatsappUpdates = e.target.checked;
        if (store && store.updateProfile) store.updateProfile(profileData);
        if (store && store.showToast) {
          store.showToast(profileData.whatsappUpdates ? '💬 WhatsApp live order alerts enabled' : 'WhatsApp alerts paused', 'info');
        }
      });
    }

    const vratToggle = document.getElementById('pref-vrat-toggle');
    if (vratToggle) {
      vratToggle.addEventListener('change', (e) => {
        if (store && store.setVratMode) {
          store.setVratMode(e.target.checked);
        }
      });
    }

    // 7. Wallet Top Up Handlers
    function updateWalletUI(newBal) {
      profileData.walletBalance = newBal;
      const bigVal = document.getElementById('wallet-big-val');
      const pillVal = document.getElementById('profile-wallet-val');
      if (bigVal) bigVal.textContent = `₹${newBal}.00`;
      if (pillVal) pillVal.textContent = `₹${newBal}`;
    }

    container.querySelectorAll('.quick-wallet-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const amt = Number(btn.getAttribute('data-amt'));
        if (store && store.addWalletBalance) {
          const newBal = store.addWalletBalance(amt);
          updateWalletUI(newBal);
        }
      });
    });

    const customWalletBtn = document.getElementById('custom-wallet-btn');
    const customWalletInput = document.getElementById('custom-wallet-input');
    if (customWalletBtn && customWalletInput) {
      customWalletBtn.addEventListener('click', () => {
        const amt = Number(customWalletInput.value);
        if (!amt || amt < 10) {
          if (store && store.showToast) store.showToast('Please enter a valid amount (min ₹10)', 'error');
          return;
        }
        if (store && store.addWalletBalance) {
          const newBal = store.addWalletBalance(amt);
          updateWalletUI(newBal);
        }
        customWalletInput.value = '';
      });
    }

    // 8. Add UPI ID prompt
    const addUpiBtn = document.getElementById('add-upi-btn');
    if (addUpiBtn) {
      addUpiBtn.addEventListener('click', () => {
        const upiId = prompt("Enter your UPI VPA (e.g. yourname@oksbi):");
        if (upiId && upiId.includes('@')) {
          const list = document.getElementById('payment-methods-list');
          if (list) {
            const item = document.createElement('div');
            item.className = "p-3 bg-surface-container-low rounded-xl border border-surface-variant/50 flex items-center justify-between";
            item.innerHTML = `
              <div class="flex items-center gap-2.5">
                <span class="material-symbols-outlined text-primary text-xl">qr_code_scanner</span>
                <div>
                  <span class="font-bold text-on-surface block">UPI AutoPay</span>
                  <span class="text-secondary text-[11px]">${upiId}</span>
                </div>
              </div>
              <span class="text-tertiary font-extrabold text-[10px] bg-tertiary/10 px-2 py-0.5 rounded-full">Linked</span>
            `;
            list.appendChild(item);
          }
          if (store && store.showToast) {
            store.showToast(`UPI ID ${upiId} linked successfully!`, 'success');
          }
        }
      });
    }

    // 9. Quick Reorder
    container.querySelectorAll('.reorder-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        try {
          const raw = btn.getAttribute('data-order');
          const data = JSON.parse(raw);
          if (data && data.items && data.items.length > 0 && store) {
            data.items.forEach(item => {
              store.addToCart(
                { id: 'item-' + Math.random().toString(36).substr(2, 5), name: item.name, price: item.price || 120, image: '' },
                { id: 'rest-reorder', name: data.restaurantName || 'Campus Partner' }
              );
            });
            store.toggleCart(true);
            store.showToast(`Items from ${data.restaurantName} added to cart!`, 'success');
          }
        } catch (e) {
          console.error("Reorder failed", e);
        }
      });
    });
  }

  window.renderProfileView = renderProfileView;
})();
