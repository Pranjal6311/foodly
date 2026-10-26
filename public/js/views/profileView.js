// public/js/views/profileView.js - User Profile & Account Settings Screen
(function () {
  function renderProfileView(container) {
    const store = window.foodlyStore;

    // Load or initialize user profile data from localStorage
    let profileData = {
      name: "Prakhar Srivastava",
      email: "prakhar.s@foodly.in",
      phone: "+91 98765 43210",
      dob: "1998-08-15",
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

    const recentOrders = store.orders.slice(0, 3);

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
                  <h1 class="text-2xl md:text-3xl font-extrabold text-on-surface" id="profile-name-display">${profileData.name}</h1>
                  <p class="text-xs md:text-sm text-secondary font-medium mt-0.5 flex items-center justify-center md:justify-start gap-2">
                    <span class="flex items-center gap-1"><span class="material-symbols-outlined text-xs">mail</span>${profileData.email}</span>
                    <span>&bull;</span>
                    <span class="flex items-center gap-1"><span class="material-symbols-outlined text-xs">phone</span>${profileData.phone}</span>
                  </p>
                </div>
                <div class="flex items-center justify-center gap-2">
                  <a href="#help" class="px-3.5 py-1.5 border border-surface-variant hover:border-primary rounded-xl text-xs font-bold text-on-surface hover:text-primary transition-all flex items-center gap-1 shadow-sm">
                    <span class="material-symbols-outlined text-base">support_agent</span>
                    <span>Need Help?</span>
                  </a>
                </div>
              </div>

              <!-- Quick Perks Bar -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-surface-variant/60">
                <div class="bg-surface-container-lowest/80 p-3 rounded-xl border border-surface-variant/40 text-center">
                  <span class="text-[11px] font-bold text-secondary uppercase block">Wallet Balance</span>
                  <span class="text-lg font-extrabold text-primary" id="profile-wallet-val">&#8377;${profileData.walletBalance}</span>
                </div>
                <div class="bg-surface-container-lowest/80 p-3 rounded-xl border border-surface-variant/40 text-center">
                  <span class="text-[11px] font-bold text-secondary uppercase block">Orders Placed</span>
                  <span class="text-lg font-extrabold text-on-surface">${store.orders.length}</span>
                </div>
                <div class="bg-surface-container-lowest/80 p-3 rounded-xl border border-surface-variant/40 text-center">
                  <span class="text-[11px] font-bold text-secondary uppercase block">Saved with Coupons</span>
                  <span class="text-lg font-extrabold text-tertiary">&#8377;1,420</span>
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
          <!-- Left Column: Forms and Preferences (8 Cols) -->
          <div class="lg:col-span-8 flex flex-col gap-8">
            <!-- 1. Personal Information Card -->
            <div class="bg-surface-container-lowest border border-surface-variant rounded-2xl p-6 shadow-sm">
              <div class="flex items-center justify-between mb-5">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-primary text-xl">person</span>
                  <h3 class="text-lg font-extrabold text-on-surface">Personal Information</h3>
                </div>
                <span class="text-xs font-semibold text-tertiary flex items-center gap-1">
                  <span class="material-symbols-outlined text-xs filled">verified</span> Phone Verified
                </span>
              </div>

              <form id="profile-details-form" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-secondary uppercase mb-1">Full Name</label>
                  <input 
                    type="text" 
                    id="profile-input-name"
                    value="${profileData.name}" 
                    class="w-full bg-surface-container-low border border-surface-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-2.5 text-sm font-medium text-on-surface outline-none transition-all"
                  />
                </div>
                <div>
                  <label class="block text-xs font-bold text-secondary uppercase mb-1">Email Address</label>
                  <input 
                    type="email" 
                    id="profile-input-email"
                    value="${profileData.email}" 
                    class="w-full bg-surface-container-low border border-surface-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-2.5 text-sm font-medium text-on-surface outline-none transition-all"
                  />
                </div>
                <div>
                  <label class="block text-xs font-bold text-secondary uppercase mb-1">Mobile Phone</label>
                  <input 
                    type="tel" 
                    id="profile-input-phone"
                    value="${profileData.phone}" 
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
                <div class="sm:col-span-2 flex justify-end mt-2">
                  <button type="submit" class="bg-primary text-white font-bold px-6 py-2.5 rounded-xl hover:bg-primary/90 transition-all shadow-md active:scale-95 text-xs flex items-center gap-1.5 cursor-pointer">
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
                <button id="add-new-address-btn" class="text-primary text-xs font-bold hover:underline flex items-center gap-1 cursor-pointer">
                  <span class="material-symbols-outlined text-base">add</span>
                  <span>Add New</span>
                </button>
              </div>

              <div class="flex flex-col gap-3" id="saved-addresses-list">
                <!-- Address 1: Default Current -->
                <div class="p-4 rounded-xl border border-primary bg-primary/5 flex items-start justify-between gap-3">
                  <div class="flex items-start gap-3">
                    <span class="material-symbols-outlined text-primary text-2xl mt-0.5">apartment</span>
                    <div>
                      <div class="flex items-center gap-2 mb-0.5">
                        <span class="font-bold text-sm text-on-surface">Primary Delivery Location</span>
                        <span class="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Default</span>
                      </div>
                      <p class="text-xs text-secondary leading-relaxed" id="profile-active-addr">${store.activeAddress}</p>
                    </div>
                  </div>
                  <button id="profile-auto-gps-btn" class="px-3 py-1.5 bg-surface-container-lowest border border-primary/40 text-primary hover:bg-primary hover:text-white rounded-lg text-xs font-bold transition-colors shrink-0 flex items-center gap-1 shadow-sm cursor-pointer">
                    <span class="material-symbols-outlined text-xs">my_location</span>
                    <span>Update GPS</span>
                  </button>
                </div>

                <!-- Address 2: Work -->
                <div class="p-4 rounded-xl border border-surface-variant bg-surface-container-lowest hover:border-primary/50 transition-colors flex items-start justify-between gap-3">
                  <div class="flex items-start gap-3">
                    <span class="material-symbols-outlined text-secondary text-2xl mt-0.5">work</span>
                    <div>
                      <div class="flex items-center gap-2 mb-0.5">
                        <span class="font-bold text-sm text-on-surface">Office / Work</span>
                      </div>
                      <p class="text-xs text-secondary leading-relaxed">EcoSpace Business Park, Bellandur Outer Ring Road, Bengaluru, Karnataka 560103</p>
                    </div>
                  </div>
                  <button class="text-xs text-secondary hover:text-primary font-bold px-2.5 py-1 rounded-md border border-surface-variant hover:border-primary transition-colors cursor-pointer" onclick="window.foodlyStore.setAddress('EcoSpace Business Park, Bellandur Outer Ring Road, Bengaluru'); window.foodlyStore.showToast('Delivery address switched to Office', 'success'); location.reload();">
                    Select
                  </button>
                </div>
              </div>
            </div>

            <!-- 3. Dietary & Notification Preferences -->
            <div class="bg-surface-container-lowest border border-surface-variant rounded-2xl p-6 shadow-sm">
              <div class="flex items-center gap-2 mb-4">
                <span class="material-symbols-outlined text-primary text-xl">tune</span>
                <h3 class="text-lg font-extrabold text-on-surface">Dining & Order Preferences</h3>
              </div>

              <div class="space-y-4">
                <!-- Pure Veg Toggle -->
                <div class="flex items-center justify-between py-2 border-b border-surface-variant/50">
                  <div class="flex items-start gap-3">
                    <span class="material-symbols-outlined text-tertiary text-xl mt-0.5">eco</span>
                    <div>
                      <span class="text-sm font-bold text-on-surface block">Pure Vegetarian Mode</span>
                      <span class="text-xs text-secondary">Only show vegetarian dishes and pure veg restaurants across Foodly</span>
                    </div>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="pref-veg-toggle" ${profileData.vegMode ? 'checked' : ''} class="sr-only peer">
                    <div class="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tertiary"></div>
                  </label>
                </div>

                <!-- Cutlery Opt-out -->
                <div class="flex items-center justify-between py-2 border-b border-surface-variant/50">
                  <div class="flex items-start gap-3">
                    <span class="material-symbols-outlined text-secondary text-xl mt-0.5">forest</span>
                    <div>
                      <span class="text-sm font-bold text-on-surface block">Green Planet Initiative</span>
                      <span class="text-xs text-secondary">Do not send disposable plastic cutlery (reduce plastic waste)</span>
                    </div>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="pref-eco-toggle" ${profileData.ecoCutlery ? 'checked' : ''} class="sr-only peer">
                    <div class="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <!-- WhatsApp Live Tracking -->
                <div class="flex items-center justify-between py-2">
                  <div class="flex items-start gap-3">
                    <span class="material-symbols-outlined text-tertiary text-xl mt-0.5">chat</span>
                    <div>
                      <span class="text-sm font-bold text-on-surface block">WhatsApp Live Tracking</span>
                      <span class="text-xs text-secondary">Receive rider location link and preparation alerts on WhatsApp</span>
                    </div>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="pref-wa-toggle" ${profileData.whatsappUpdates ? 'checked' : ''} class="sr-only peer">
                    <div class="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tertiary"></div>
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
                  <h3 class="text-3xl font-extrabold mt-1">&#8377;${profileData.walletBalance}.00</h3>
                </div>
                <span class="material-symbols-outlined text-3xl text-white/70">account_balance_wallet</span>
              </div>

              <div class="flex items-center gap-2 mb-4">
                <button id="add-wallet-100-btn" class="flex-1 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold transition-all backdrop-blur-sm cursor-pointer">+ ₹100</button>
                <button id="add-wallet-500-btn" class="flex-1 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold transition-all backdrop-blur-sm cursor-pointer">+ ₹500</button>
                <button id="add-wallet-1000-btn" class="flex-1 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold transition-all backdrop-blur-sm cursor-pointer">+ ₹1000</button>
              </div>

              <p class="text-[11px] text-white/80 flex items-center gap-1">
                <span class="material-symbols-outlined text-xs">info</span>
                Instant 1-tap checkout with zero OTP delays
              </p>
            </div>

            <!-- Saved Payment Cards Preview -->
            <div class="bg-surface-container-lowest border border-surface-variant rounded-2xl p-5 shadow-sm">
              <h4 class="text-sm font-extrabold text-on-surface mb-3 flex items-center gap-1.5">
                <span class="material-symbols-outlined text-base text-primary">credit_card</span>
                <span>Saved Payment Options</span>
              </h4>

              <div class="flex flex-col gap-2.5 text-xs">
                <div class="p-3 bg-surface-container-low rounded-xl border border-surface-variant/50 flex items-center justify-between">
                  <div class="flex items-center gap-2.5">
                    <span class="material-symbols-outlined text-primary text-xl">qr_code_scanner</span>
                    <div>
                      <span class="font-bold text-on-surface block">Google Pay / PhonePe UPI</span>
                      <span class="text-secondary text-[11px]">prakhar@okaxis</span>
                    </div>
                  </div>
                  <span class="text-primary font-extrabold text-[10px] bg-primary/10 px-2 py-0.5 rounded-full">Active</span>
                </div>

                <div class="p-3 bg-surface-container-low rounded-xl border border-surface-variant/50 flex items-center justify-between">
                  <div class="flex items-center gap-2.5">
                    <span class="material-symbols-outlined text-secondary text-xl">credit_card</span>
                    <div>
                      <span class="font-bold text-on-surface block">HDFC Regalia Credit Card</span>
                      <span class="text-secondary text-[11px]">&bull;&bull;&bull;&bull; 4921 &bull; Exp 09/28</span>
                    </div>
                  </div>
                  <span class="text-secondary text-[11px]">Visa</span>
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
                    <div class="p-3 bg-surface-container-low rounded-xl border border-surface-variant/50 flex flex-col gap-2">
                      <div class="flex justify-between items-start">
                        <div>
                          <span class="font-bold text-xs text-on-surface block">${order.restaurantName}</span>
                          <span class="text-[11px] text-secondary font-medium">&#8377;${order.bill ? order.bill.total : 0} &bull; ${order.items ? order.items.length : 1} item(s)</span>
                        </div>
                        <a href="#track/${order.id}" class="text-[11px] font-bold text-primary hover:underline bg-primary/10 px-2.5 py-1 rounded-lg">
                          Track
                        </a>
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

    // Event Listeners
    // 1. Profile details form submit
    const profileForm = document.getElementById('profile-details-form');
    if (profileForm) {
      profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        profileData.name = document.getElementById('profile-input-name').value.trim() || profileData.name;
        profileData.email = document.getElementById('profile-input-email').value.trim() || profileData.email;
        profileData.phone = document.getElementById('profile-input-phone').value.trim() || profileData.phone;
        profileData.dob = document.getElementById('profile-input-dob').value || profileData.dob;
        
        localStorage.setItem('foodly_user_profile', JSON.stringify(profileData));
        document.getElementById('profile-name-display').textContent = profileData.name;
        store.showToast('Profile information successfully updated!', 'success');
      });
    }

    // 2. Preferences checkboxes
    const vegToggle = document.getElementById('pref-veg-toggle');
    if (vegToggle) {
      vegToggle.addEventListener('change', (e) => {
        profileData.vegMode = e.target.checked;
        localStorage.setItem('foodly_user_profile', JSON.stringify(profileData));
        store.setFilter('dietary', profileData.vegMode ? 'Vegetarian' : '');
        store.showToast(profileData.vegMode ? 'Pure Veg Mode enabled' : 'All dietary items visible', 'info');
      });
    }

    // 3. Wallet Add Cash Buttons
    function addCash(amt) {
      profileData.walletBalance += amt;
      localStorage.setItem('foodly_user_profile', JSON.stringify(profileData));
      document.getElementById('profile-wallet-val').textContent = `₹${profileData.walletBalance}`;
      store.showToast(`₹${amt} successfully added to your Foodly Cash wallet!`, 'success');
    }

    document.getElementById('add-wallet-100-btn')?.addEventListener('click', () => addCash(100));
    document.getElementById('add-wallet-500-btn')?.addEventListener('click', () => addCash(500));
    document.getElementById('add-wallet-1000-btn')?.addEventListener('click', () => addCash(1000));

    // 4. Update GPS Button
    document.getElementById('profile-auto-gps-btn')?.addEventListener('click', async () => {
      await store.detectCurrentLocation(false);
      document.getElementById('profile-active-addr').textContent = store.activeAddress;
      store.showToast('Primary address updated to current GPS location', 'success');
    });
  }

  window.renderProfileView = renderProfileView;
})();
