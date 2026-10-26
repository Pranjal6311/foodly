// public/js/views/checkoutView.js - Interactive Checkout Screen
(function () {
  function renderCheckoutView(container) {
    const store = window.foodlyStore;
    const cart = store.cart;
    const bill = store.getBillDetails();
    const nutrition = store.getNutritionSummary();
    const fairPrice = store.getFairPriceSummary();

    window.setCampusDropAddress = (addr) => {
      const input = document.getElementById('checkout-address-input');
      if (input) input.value = addr;
      store.activeAddress = addr;
      store.setCampusMode(true);
      store.showToast(`Selected ${addr.split(',')[0]} (₹0 Delivery Fee Applied!)`, 'success');
      renderCheckoutView(container);
    };

    if (cart.items.length === 0) {
      container.innerHTML = `
        <div class="fade-in max-w-xl mx-auto py-20 px-4 text-center">
          <div class="w-20 h-20 rounded-full bg-surface-container-low mx-auto flex items-center justify-center text-primary mb-4">
            <span class="material-symbols-outlined text-4xl">shopping_cart</span>
          </div>
          <h2 class="text-2xl font-extrabold text-on-surface mb-2">Your cart is empty</h2>
          <p class="text-sm text-on-surface-variant mb-6">Select a restaurant and add some items to proceed with checkout.</p>
          <a href="#search" class="bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors inline-block">
            Browse Restaurants
          </a>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="fade-in max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop py-8">
        <div class="flex items-center gap-2 mb-6">
          <a href="#restaurant/${cart.restaurantId}" class="p-2 rounded-full hover:bg-surface-container text-secondary transition-colors">
            <span class="material-symbols-outlined">arrow_back</span>
          </a>
          <h1 class="text-2xl md:text-3xl font-extrabold text-on-surface">Secure Checkout</h1>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-8">
          <!-- Left Column: Address, Delivery Instructions, Payment -->
          <div class="md:col-span-7 flex flex-col gap-6">
            <!-- Delivery Address Card -->
            <div class="bg-surface-container-lowest p-6 rounded-2xl border border-surface-variant shadow-sm">
              <div class="flex justify-between items-center mb-3">
                <h3 class="text-base font-extrabold text-on-surface flex items-center gap-2">
                  <span class="material-symbols-outlined text-primary text-xl">location_on</span>
                  <span>Delivery Address</span>
                </h3>
                <span class="text-xs bg-tertiary-container/20 text-tertiary font-bold px-2 py-0.5 rounded">Standard (25-35 min)</span>
              </div>
              
              <div class="relative">
                <input 
                  id="checkout-address-input" 
                  type="text" 
                  value="${store.activeAddress}"
                  class="w-full bg-surface-container-low border border-surface-variant focus:border-primary rounded-xl px-4 py-3 text-sm font-semibold text-on-surface outline-none"
                  placeholder="Street address, apartment, suite..."
                />
              </div>

              <!-- Quick Presets & Auto-Detect -->
              <div class="flex flex-wrap items-center gap-2 mt-3 text-xs font-semibold">
                <button 
                  id="checkout-detect-gps-btn" 
                  type="button" 
                  class="px-3 py-1.5 rounded-lg border border-primary/50 bg-primary-fixed text-primary hover:bg-primary-fixed/80 transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95 font-bold"
                >
                  <span id="checkout-gps-icon" class="material-symbols-outlined text-sm filled">my_location</span>
                  <span id="checkout-gps-label">Use Current Location</span>
                </button>
                <button onclick="document.getElementById('checkout-address-input').value = 'Flat 402, Sunrise Towers, 100 Feet Rd, Indiranagar, Bengaluru'" class="px-3 py-1.5 rounded-lg border border-surface-variant bg-surface-container-lowest hover:border-primary text-on-surface transition-colors flex items-center gap-1">
                  <span class="material-symbols-outlined text-sm">home</span> Home
                </button>
                <button onclick="document.getElementById('checkout-address-input').value = 'Tower B, 8th Floor, Cyber City, Phase 2'" class="px-3 py-1.5 rounded-lg border border-surface-variant bg-surface-container-lowest hover:border-primary text-on-surface transition-colors flex items-center gap-1">
                  <span class="material-symbols-outlined text-sm">apartment</span> Office
                </button>
              </div>

              <!-- GL Bajaj Campus Drop Presets -->
              <div class="mt-3 pt-3 border-t border-surface-variant/60">
                <p class="text-xs font-black text-emerald-800 mb-2 flex items-center gap-1">
                  <span class="material-symbols-outlined text-sm text-emerald-600">school</span>
                  <span>GL Bajaj Campus &amp; Hostel Drop Points (₹0 Delivery Fee):</span>
                </p>
                <div class="flex flex-wrap gap-2 text-xs font-bold">
                  <button type="button" onclick="window.setCampusDropAddress('GL Bajaj Boys Hostel (Block A/B), Greater Noida')" class="px-3 py-1.5 rounded-xl border border-emerald-500/40 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-all flex items-center gap-1 shadow-sm cursor-pointer">
                    <span>🏢 Boys Hostel</span>
                    <span class="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-black">₹0 Fee</span>
                  </button>
                  <button type="button" onclick="window.setCampusDropAddress('GL Bajaj Girls Hostel (Block D), Greater Noida')" class="px-3 py-1.5 rounded-xl border border-emerald-500/40 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-all flex items-center gap-1 shadow-sm cursor-pointer">
                    <span>🏢 Girls Hostel</span>
                    <span class="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-black">₹0 Fee</span>
                  </button>
                  <button type="button" onclick="window.setCampusDropAddress('GL Bajaj Academic Block Gate 2, Greater Noida')" class="px-3 py-1.5 rounded-xl border border-emerald-500/40 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-all flex items-center gap-1 shadow-sm cursor-pointer">
                    <span>🎓 Gate 2</span>
                    <span class="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-black">₹0 Fee</span>
                  </button>
                  <button type="button" onclick="window.setCampusDropAddress('Knowledge Park III Student Housing Hub, Greater Noida')" class="px-3 py-1.5 rounded-xl border border-emerald-500/40 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-all flex items-center gap-1 shadow-sm cursor-pointer">
                    <span>🛵 Knowledge Park III</span>
                    <span class="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-black">₹0 Fee</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Delivery Instructions -->
            <div class="bg-surface-container-lowest p-6 rounded-2xl border border-surface-variant shadow-sm">
              <h3 class="text-base font-extrabold text-on-surface flex items-center gap-2 mb-3">
                <span class="material-symbols-outlined text-primary text-xl">notes</span>
                <span>Delivery Instructions</span>
              </h3>
              <div class="grid grid-cols-2 gap-3 mb-3 text-xs font-semibold">
                <label class="flex items-center gap-2 p-3 rounded-xl border border-surface-variant hover:bg-surface-container-low cursor-pointer">
                  <input type="radio" name="delivery_option" value="hand" checked class="accent-primary"/>
                  <span>Hand it to me</span>
                </label>
                <label class="flex items-center gap-2 p-3 rounded-xl border border-surface-variant hover:bg-surface-container-low cursor-pointer">
                  <input type="radio" name="delivery_option" value="door" class="accent-primary"/>
                  <span>Leave at door</span>
                </label>
              </div>
              <input 
                id="checkout-instructions" 
                type="text" 
                placeholder="Gate code, landmark, or specific requests..." 
                class="w-full bg-surface-container-low border border-surface-variant focus:border-primary rounded-xl px-4 py-2.5 text-xs font-medium outline-none"
              />
            </div>

            <!-- Payment Method -->
            <div class="bg-surface-container-lowest p-6 rounded-2xl border border-surface-variant shadow-sm">
              <h3 class="text-base font-extrabold text-on-surface flex items-center gap-2 mb-4">
                <span class="material-symbols-outlined text-primary text-xl">payments</span>
                <span>Payment Method</span>
                <span class="ml-auto text-xs font-bold bg-tertiary-container/30 text-tertiary px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span class="material-symbols-outlined text-xs filled">lock</span> 100% Secure
                </span>
              </h3>

              <div class="flex flex-col gap-3" id="payment-options-list">

                <!-- 1. UPI (Google Pay / PhonePe / Paytm / BHIM) -->
                <div class="payment-method-card rounded-xl border-2 border-primary bg-primary-fixed/30 overflow-hidden" data-method="upi">
                  <label class="flex items-center gap-3 p-4 cursor-pointer">
                    <input type="radio" name="payment_method" value="UPI (Google Pay)" checked class="accent-primary shrink-0"/>
                    <div class="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm border border-surface-variant shrink-0 text-lg font-black text-primary">₹</div>
                    <div class="flex-1">
                      <p class="font-extrabold text-sm text-on-surface">UPI</p>
                      <p class="text-xs text-on-surface-variant">Google Pay, PhonePe, Paytm, BHIM &amp; more</p>
                    </div>
                    <span class="text-[10px] font-extrabold bg-primary-container text-white px-2 py-0.5 rounded-full shrink-0">Recommended</span>
                  </label>
                  <!-- UPI Detail Panel -->
                  <div class="upi-panel px-4 pb-4">
                    <div class="bg-white rounded-xl p-4 border border-surface-variant/60">
                      <div class="flex gap-3 items-stretch">
                        <!-- QR Code Section -->
                        <div class="flex flex-col items-center justify-center bg-surface-container-low rounded-xl p-3 border border-surface-variant min-w-[100px]">
                          <!-- SVG QR code (stylized demo) -->
                          <svg width="76" height="76" viewBox="0 0 76 76" fill="none" xmlns="http://www.w3.org/2000/svg" class="rounded">
                            <rect width="76" height="76" fill="white"/>
                            <rect x="4" y="4" width="28" height="28" rx="3" fill="#aa3700"/>
                            <rect x="8" y="8" width="20" height="20" rx="2" fill="white"/>
                            <rect x="11" y="11" width="14" height="14" rx="1" fill="#aa3700"/>
                            <rect x="44" y="4" width="28" height="28" rx="3" fill="#aa3700"/>
                            <rect x="48" y="8" width="20" height="20" rx="2" fill="white"/>
                            <rect x="51" y="11" width="14" height="14" rx="1" fill="#aa3700"/>
                            <rect x="4" y="44" width="28" height="28" rx="3" fill="#aa3700"/>
                            <rect x="8" y="48" width="20" height="20" rx="2" fill="white"/>
                            <rect x="11" y="51" width="14" height="14" rx="1" fill="#aa3700"/>
                            <rect x="36" y="36" width="6" height="6" fill="#aa3700"/>
                            <rect x="44" y="36" width="6" height="6" fill="#aa3700"/>
                            <rect x="52" y="36" width="6" height="6" fill="#aa3700"/>
                            <rect x="60" y="36" width="6" height="6" fill="#aa3700"/>
                            <rect x="36" y="44" width="6" height="6" fill="#aa3700"/>
                            <rect x="52" y="44" width="6" height="6" fill="#aa3700"/>
                            <rect x="44" y="52" width="6" height="6" fill="#aa3700"/>
                            <rect x="60" y="52" width="6" height="6" fill="#aa3700"/>
                            <rect x="36" y="60" width="6" height="6" fill="#aa3700"/>
                            <rect x="52" y="60" width="6" height="6" fill="#aa3700"/>
                            <rect x="60" y="60" width="6" height="6" fill="#aa3700"/>
                          </svg>
                          <p class="text-[9px] font-bold text-on-surface-variant mt-1.5 text-center">Scan &amp; Pay</p>
                        </div>
                        <!-- OR Divider + UPI ID input -->
                        <div class="flex-1 flex flex-col gap-2.5">
                          <p class="text-xs font-bold text-secondary text-center">— or enter UPI ID —</p>
                          <input id="upi-id-input" type="text" placeholder="yourname@okicici" class="w-full bg-surface-container-low border border-surface-variant focus:border-primary rounded-lg px-3 py-2 text-xs font-semibold outline-none"/>
                          <!-- UPI Apps Row -->
                          <div class="grid grid-cols-4 gap-1.5">
                            <button type="button" onclick="document.getElementById('upi-id-input').placeholder='yourname@okaxis'; this.closest('.grid').querySelectorAll('button').forEach(b=>b.classList.remove('ring-2','ring-primary')); this.classList.add('ring-2','ring-primary')" class="flex flex-col items-center gap-0.5 p-1.5 rounded-lg border border-surface-variant hover:bg-primary-fixed/30 transition-all">
                              <span class="text-lg">🇬</span>
                              <span class="text-[9px] font-bold text-on-surface-variant">GPay</span>
                            </button>
                            <button type="button" onclick="document.getElementById('upi-id-input').placeholder='yourname@ybl'; this.closest('.grid').querySelectorAll('button').forEach(b=>b.classList.remove('ring-2','ring-primary')); this.classList.add('ring-2','ring-primary')" class="flex flex-col items-center gap-0.5 p-1.5 rounded-lg border border-surface-variant hover:bg-primary-fixed/30 transition-all">
                              <span class="text-lg">📱</span>
                              <span class="text-[9px] font-bold text-on-surface-variant">PhonePe</span>
                            </button>
                            <button type="button" onclick="document.getElementById('upi-id-input').placeholder='yourname@paytm'; this.closest('.grid').querySelectorAll('button').forEach(b=>b.classList.remove('ring-2','ring-primary')); this.classList.add('ring-2','ring-primary')" class="flex flex-col items-center gap-0.5 p-1.5 rounded-lg border border-surface-variant hover:bg-primary-fixed/30 transition-all">
                              <span class="text-lg">💙</span>
                              <span class="text-[9px] font-bold text-on-surface-variant">Paytm</span>
                            </button>
                            <button type="button" onclick="document.getElementById('upi-id-input').placeholder='yourname@upi'; this.closest('.grid').querySelectorAll('button').forEach(b=>b.classList.remove('ring-2','ring-primary')); this.classList.add('ring-2','ring-primary')" class="flex flex-col items-center gap-0.5 p-1.5 rounded-lg border border-surface-variant hover:bg-primary-fixed/30 transition-all">
                              <span class="text-lg">🏛️</span>
                              <span class="text-[9px] font-bold text-on-surface-variant">BHIM</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 2. Credit / Debit Card -->
                <div class="payment-method-card rounded-xl border border-surface-variant overflow-hidden" data-method="card">
                  <label class="flex items-center gap-3 p-4 cursor-pointer">
                    <input type="radio" name="payment_method" value="Credit/Debit Card" class="accent-primary shrink-0"/>
                    <span class="material-symbols-outlined text-2xl text-secondary">credit_card</span>
                    <div class="flex-1">
                      <p class="font-extrabold text-sm text-on-surface">Credit / Debit Card</p>
                      <p class="text-xs text-on-surface-variant">Visa, Mastercard, RuPay, Amex</p>
                    </div>
                    <div class="flex gap-1 shrink-0">
                      <span class="text-xs bg-blue-100 text-blue-700 font-bold px-1.5 py-0.5 rounded">VISA</span>
                      <span class="text-xs bg-red-50 text-red-600 font-bold px-1.5 py-0.5 rounded">MC</span>
                      <span class="text-xs bg-orange-50 text-orange-600 font-bold px-1.5 py-0.5 rounded">RuPay</span>
                    </div>
                  </label>
                  <!-- Card Detail Panel (hidden by default) -->
                  <div class="card-panel hidden px-4 pb-4">
                    <!-- Visual card preview -->
                    <div class="w-full h-36 rounded-xl bg-gradient-to-br from-primary to-primary-container p-4 mb-3 relative overflow-hidden shadow-lg">
                      <div class="absolute inset-0 opacity-10">
                        <div class="absolute top-0 right-0 w-40 h-40 rounded-full bg-white -translate-y-10 translate-x-10"></div>
                        <div class="absolute bottom-0 left-0 w-28 h-28 rounded-full bg-white translate-y-8 -translate-x-8"></div>
                      </div>
                      <div class="relative z-10 h-full flex flex-col justify-between">
                        <div class="flex justify-between items-start">
                          <span class="text-white/80 text-xs font-bold tracking-widest uppercase">Foodly</span>
                          <span id="card-preview-network" class="text-white font-black text-sm">VISA</span>
                        </div>
                        <div>
                          <p id="card-preview-number" class="text-white text-base font-mono tracking-widest mb-1">•••• •••• •••• ••••</p>
                          <div class="flex justify-between items-end">
                            <div>
                              <p class="text-white/60 text-[9px] uppercase">Card Holder</p>
                              <p id="card-preview-name" class="text-white text-xs font-bold tracking-wider uppercase">YOUR NAME</p>
                            </div>
                            <div class="text-right">
                              <p class="text-white/60 text-[9px] uppercase">Expires</p>
                              <p id="card-preview-expiry" class="text-white text-xs font-bold">MM/YY</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- Card input fields -->
                    <div class="grid grid-cols-1 gap-2.5">
                      <input id="card-number-input" type="text" maxlength="19" placeholder="Card Number (1234 5678 9012 3456)" class="w-full bg-surface-container-low border border-surface-variant focus:border-primary rounded-lg px-3 py-2.5 text-xs font-mono font-semibold outline-none tracking-widest"/>
                      <input id="card-name-input" type="text" placeholder="Name on Card" class="w-full bg-surface-container-low border border-surface-variant focus:border-primary rounded-lg px-3 py-2.5 text-xs font-semibold outline-none uppercase"/>
                      <div class="grid grid-cols-2 gap-2.5">
                        <input id="card-expiry-input" type="text" maxlength="5" placeholder="MM/YY" class="w-full bg-surface-container-low border border-surface-variant focus:border-primary rounded-lg px-3 py-2.5 text-xs font-semibold outline-none"/>
                        <input id="card-cvv-input" type="password" maxlength="4" placeholder="CVV" class="w-full bg-surface-container-low border border-surface-variant focus:border-primary rounded-lg px-3 py-2.5 text-xs font-semibold outline-none"/>
                      </div>
                      <label class="flex items-center gap-2 text-xs text-on-surface-variant font-medium cursor-pointer">
                        <input type="checkbox" class="accent-primary rounded"/> Save card for future orders (secured)
                      </label>
                    </div>
                  </div>
                </div>

                <!-- 3. Net Banking -->
                <div class="payment-method-card rounded-xl border border-surface-variant overflow-hidden" data-method="netbanking">
                  <label class="flex items-center gap-3 p-4 cursor-pointer">
                    <input type="radio" name="payment_method" value="Net Banking" class="accent-primary shrink-0"/>
                    <span class="material-symbols-outlined text-2xl text-secondary">account_balance</span>
                    <div class="flex-1">
                      <p class="font-extrabold text-sm text-on-surface">Net Banking</p>
                      <p class="text-xs text-on-surface-variant">All Indian banks supported</p>
                    </div>
                  </label>
                  <!-- Net Banking Panel (hidden by default) -->
                  <div class="netbanking-panel hidden px-4 pb-4">
                    <p class="text-xs font-bold text-secondary mb-2">Popular Banks</p>
                    <div class="grid grid-cols-4 gap-2 mb-2">
                      <button type="button" onclick="document.getElementById('netbank-select').value='sbi'; this.closest('.grid').querySelectorAll('button').forEach(b=>b.classList.remove('border-primary','bg-primary-fixed/30')); this.classList.add('border-primary','bg-primary-fixed/30')" class="flex flex-col items-center gap-1 p-2 rounded-lg border border-surface-variant hover:border-primary transition-all text-center">
                        <span class="text-xl">🏦</span>
                        <span class="text-[9px] font-bold text-on-surface">SBI</span>
                      </button>
                      <button type="button" onclick="document.getElementById('netbank-select').value='hdfc'; this.closest('.grid').querySelectorAll('button').forEach(b=>b.classList.remove('border-primary','bg-primary-fixed/30')); this.classList.add('border-primary','bg-primary-fixed/30')" class="flex flex-col items-center gap-1 p-2 rounded-lg border border-surface-variant hover:border-primary transition-all text-center">
                        <span class="text-xl">🏛️</span>
                        <span class="text-[9px] font-bold text-on-surface">HDFC</span>
                      </button>
                      <button type="button" onclick="document.getElementById('netbank-select').value='icici'; this.closest('.grid').querySelectorAll('button').forEach(b=>b.classList.remove('border-primary','bg-primary-fixed/30')); this.classList.add('border-primary','bg-primary-fixed/30')" class="flex flex-col items-center gap-1 p-2 rounded-lg border border-surface-variant hover:border-primary transition-all text-center">
                        <span class="text-xl">🏧</span>
                        <span class="text-[9px] font-bold text-on-surface">ICICI</span>
                      </button>
                      <button type="button" onclick="document.getElementById('netbank-select').value='axis'; this.closest('.grid').querySelectorAll('button').forEach(b=>b.classList.remove('border-primary','bg-primary-fixed/30')); this.classList.add('border-primary','bg-primary-fixed/30')" class="flex flex-col items-center gap-1 p-2 rounded-lg border border-surface-variant hover:border-primary transition-all text-center">
                        <span class="text-xl">💳</span>
                        <span class="text-[9px] font-bold text-on-surface">Axis</span>
                      </button>
                    </div>
                    <select id="netbank-select" class="w-full bg-surface-container-low border border-surface-variant focus:border-primary rounded-lg px-3 py-2 text-xs font-semibold outline-none">
                      <option value="">-- Other Banks (select) --</option>
                      <option value="sbi">State Bank of India (SBI)</option>
                      <option value="hdfc">HDFC Bank</option>
                      <option value="icici">ICICI Bank</option>
                      <option value="axis">Axis Bank</option>
                      <option value="kotak">Kotak Mahindra Bank</option>
                      <option value="yes">Yes Bank</option>
                      <option value="pnb">Punjab National Bank (PNB)</option>
                      <option value="bob">Bank of Baroda</option>
                      <option value="canara">Canara Bank</option>
                      <option value="iob">Indian Overseas Bank</option>
                    </select>
                  </div>
                </div>

                <!-- 4. Pay Later / EMI -->
                <div class="payment-method-card rounded-xl border border-surface-variant overflow-hidden" data-method="emilater">
                  <label class="flex items-center gap-3 p-4 cursor-pointer">
                    <input type="radio" name="payment_method" value="Pay Later / EMI" class="accent-primary shrink-0"/>
                    <span class="material-symbols-outlined text-2xl text-secondary">calendar_month</span>
                    <div class="flex-1">
                      <p class="font-extrabold text-sm text-on-surface">Pay Later / EMI</p>
                      <p class="text-xs text-on-surface-variant">LazyPay, Simpl, Ola Money, Bajaj EMI</p>
                    </div>
                    <span class="text-[10px] font-extrabold bg-tertiary-container text-on-tertiary-container px-2 py-0.5 rounded-full shrink-0">0% Interest</span>
                  </label>
                  <!-- Pay Later Panel (hidden by default) -->
                  <div class="emilater-panel hidden px-4 pb-4">
                    <div class="grid grid-cols-2 gap-2 mb-3">
                      <label class="flex items-center gap-2 p-3 rounded-xl border border-surface-variant hover:bg-surface-container-low cursor-pointer text-xs font-bold">
                        <input type="radio" name="paylater_provider" value="LazyPay" class="accent-primary"/>
                        <span>🔵 LazyPay</span>
                      </label>
                      <label class="flex items-center gap-2 p-3 rounded-xl border border-surface-variant hover:bg-surface-container-low cursor-pointer text-xs font-bold">
                        <input type="radio" name="paylater_provider" value="Simpl" class="accent-primary"/>
                        <span>🟢 Simpl</span>
                      </label>
                      <label class="flex items-center gap-2 p-3 rounded-xl border border-surface-variant hover:bg-surface-container-low cursor-pointer text-xs font-bold">
                        <input type="radio" name="paylater_provider" value="Ola Money" class="accent-primary"/>
                        <span>🟡 Ola Money</span>
                      </label>
                      <label class="flex items-center gap-2 p-3 rounded-xl border border-surface-variant hover:bg-surface-container-low cursor-pointer text-xs font-bold">
                        <input type="radio" name="paylater_provider" value="Bajaj EMI" class="accent-primary"/>
                        <span>🔶 Bajaj EMI</span>
                      </label>
                    </div>
                    <div class="bg-tertiary-container/20 border border-tertiary/30 rounded-xl p-3 flex items-start gap-2">
                      <span class="material-symbols-outlined text-tertiary text-base filled shrink-0 mt-0.5">info</span>
                      <p class="text-xs text-on-surface-variant leading-relaxed">Enjoy 0% interest EMI on orders above ₹499. Your credit limit will be verified after order placement.</p>
                    </div>
                  </div>
                </div>

                <!-- 5. Cash on Delivery -->
                <div class="payment-method-card rounded-xl border border-surface-variant overflow-hidden" data-method="cod">
                  <label class="flex items-center gap-3 p-4 cursor-pointer">
                    <input type="radio" name="payment_method" value="Cash on Delivery" class="accent-primary shrink-0"/>
                    <span class="material-symbols-outlined text-2xl text-secondary">local_atm</span>
                    <div class="flex-1">
                      <p class="font-extrabold text-sm text-on-surface">Cash on Delivery</p>
                      <p class="text-xs text-on-surface-variant">Pay in cash when your order arrives</p>
                    </div>
                    <span class="text-[10px] font-extrabold bg-surface-container text-secondary px-2 py-0.5 rounded-full shrink-0">+₹10 COD fee</span>
                  </label>
                  <!-- COD Detail Panel (hidden) -->
                  <div class="cod-panel hidden px-4 pb-4">
                    <div class="bg-surface-container-low border border-surface-variant rounded-xl p-3 flex items-start gap-2">
                      <span class="material-symbols-outlined text-secondary text-base filled shrink-0 mt-0.5">warning</span>
                      <p class="text-xs text-on-surface-variant leading-relaxed">A small ₹10 Cash on Delivery convenience fee will be added. Please keep exact change ready. The delivery partner cannot return change above ₹500.</p>
                    </div>
                  </div>
                </div>

              </div>

              <!-- Security trust badges -->
              <div class="mt-4 pt-3 border-t border-surface-variant/50 flex items-center justify-center gap-4 text-[10px] text-secondary font-semibold">
                <span class="flex items-center gap-1">
                  <span class="material-symbols-outlined text-xs text-tertiary filled">verified_user</span> PCI DSS Secured
                </span>
                <span class="flex items-center gap-1">
                  <span class="material-symbols-outlined text-xs text-tertiary filled">lock</span> 256-bit SSL
                </span>
                <span class="flex items-center gap-1">
                  <span class="material-symbols-outlined text-xs text-tertiary filled">shield</span> RBI Compliant
                </span>
              </div>
            </div>
          </div>

          <!-- Right Column: Order Review & Total -->
          <div class="md:col-span-5 flex flex-col gap-6">
            <!-- INNOVATION 1: Live Macro Nutrition Tracker Card -->
            <div class="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 shadow-sm">
              <div class="flex justify-between items-center mb-3">
                <h4 class="text-xs font-black text-on-surface uppercase tracking-wider flex items-center gap-1.5">
                  <span>🔥</span>
                  <span>Live Macro Nutrition Tracker</span>
                </h4>
                <span class="px-2.5 py-0.5 bg-amber-500 text-white font-black text-[10px] rounded-md">Health Grade: ${nutrition.healthGrade}</span>
              </div>
              <div class="grid grid-cols-4 gap-2 text-center">
                <div class="bg-surface-container-lowest p-2 rounded-xl border border-amber-500/20 shadow-xs">
                  <span class="block text-sm font-black text-amber-800">${nutrition.calories}</span>
                  <span class="text-[10px] text-secondary font-bold">Calories</span>
                </div>
                <div class="bg-surface-container-lowest p-2 rounded-xl border border-amber-500/20 shadow-xs">
                  <span class="block text-sm font-black text-emerald-700">${nutrition.protein}g</span>
                  <span class="text-[10px] text-secondary font-bold">Protein</span>
                </div>
                <div class="bg-surface-container-lowest p-2 rounded-xl border border-amber-500/20 shadow-xs">
                  <span class="block text-sm font-black text-sky-700">${nutrition.carbs}g</span>
                  <span class="text-[10px] text-secondary font-bold">Carbs</span>
                </div>
                <div class="bg-surface-container-lowest p-2 rounded-xl border border-amber-500/20 shadow-xs">
                  <span class="block text-sm font-black text-amber-700">${nutrition.fats}g</span>
                  <span class="text-[10px] text-secondary font-bold">Fats</span>
                </div>
              </div>
            </div>

            <!-- INNOVATION 2: FairPrice Audit vs Swiggy/Zomato Guarantee Card -->
            <div class="bg-emerald-50 border border-emerald-300 rounded-2xl p-5 shadow-sm">
              <div class="flex items-center gap-2 mb-2.5">
                <span class="material-symbols-outlined text-emerald-600 filled text-xl">verified</span>
                <div>
                  <h4 class="text-xs font-black text-emerald-950 uppercase tracking-wider">FairPrice Price Audit Guarantee</h4>
                  <p class="text-[11px] text-emerald-800 font-semibold">Zero surge multipliers &bull; Pure dine-in menu pricing</p>
                </div>
              </div>
              <div class="flex justify-between text-xs font-bold text-emerald-900 mb-1">
                <span>Swiggy / Zomato est. total:</span>
                <span class="line-through text-error font-extrabold">&#8377;${fairPrice.totalSwiggyZomato}</span>
              </div>
              <div class="flex justify-between text-xs font-black text-emerald-950 mb-2.5">
                <span>Foodly True Cost:</span>
                <span class="text-emerald-700 text-sm">&#8377;${bill.total}</span>
              </div>
              <div class="p-2.5 bg-emerald-100 rounded-xl text-center text-xs font-black text-emerald-900 shadow-xs">
                🎉 You are saving &#8377;${fairPrice.totalSavings} compared to commercial aggregators!
              </div>
            </div>

            <div class="bg-surface-container-lowest p-6 rounded-2xl border border-surface-variant shadow-sm">
              <div class="flex justify-between items-center mb-4 pb-3 border-b border-surface-variant">
                <div>
                  <h3 class="font-extrabold text-base text-on-surface">Order Summary</h3>
                  <p class="text-xs text-primary font-bold">${cart.restaurantName}</p>
                </div>
                <span class="text-xs bg-surface-container px-2.5 py-1 rounded-full font-bold text-secondary">
                  ${store.getCartCount()} items
                </span>
              </div>

              <!-- Cart Item List -->
              <div class="flex flex-col gap-3 max-h-56 overflow-y-auto pr-1 mb-4">
                ${cart.items.map(item => `
                  <div class="flex justify-between items-center text-xs">
                    <div class="flex items-center gap-2">
                      <span class="w-5 h-5 rounded bg-surface-container flex items-center justify-center font-bold text-on-surface">${item.quantity}x</span>
                      <span class="font-bold text-on-surface">${item.name}</span>
                    </div>
                    <span class="font-extrabold text-on-surface">&#8377;${(item.price * item.quantity).toFixed(0)}</span>
                  </div>
                `).join('')}
              </div>

              <!-- Bill Breakdown -->
              <div class="flex flex-col gap-2 pt-3 border-t border-surface-variant text-xs text-on-surface-variant">
                <div class="flex justify-between">
                  <span>Item Total</span>
                  <span class="font-semibold text-on-surface">&#8377;${bill.subtotal.toFixed(0)}</span>
                </div>
                ${bill.discount > 0 ? `
                  <div class="flex justify-between text-tertiary font-bold">
                    <span>Coupon Discount</span>
                    <span>-&#8377;${bill.discount.toFixed(0)}</span>
                  </div>
                ` : ''}
                <div class="flex justify-between">
                  <span>Delivery Partner Fee</span>
                  <span class="font-semibold text-on-surface">${bill.deliveryFee === 0 ? '<strong class="text-tertiary">FREE</strong>' : `&#8377;${bill.deliveryFee.toFixed(0)}`}</span>
                </div>
                <div class="flex justify-between">
                  <span>Taxes & Restaurant Charges</span>
                  <span class="font-semibold text-on-surface">&#8377;${bill.taxes.toFixed(0)}</span>
                </div>
                <div class="h-px bg-surface-variant my-1"></div>
                <div class="flex justify-between items-center text-base font-extrabold text-on-surface">
                  <span>To Pay</span>
                  <span class="text-primary text-xl font-black">&#8377;${bill.total.toFixed(0)}</span>
                </div>
              </div>

              <!-- Place Order Button -->
              <button 
                id="place-order-btn"
                class="w-full mt-6 bg-primary-container text-white font-extrabold py-4 rounded-xl hover:bg-primary transition-all duration-200 flex items-center justify-center gap-2 shadow-lg active:scale-95 cursor-pointer text-sm"
              >
                <span class="material-symbols-outlined text-lg">verified</span>
                <span>Place Order & Track Live</span>
              </button>

              <p class="text-[11px] text-center text-secondary mt-3">
                By placing this order you agree to Foodly's Terms of Service and refund policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    `;

    // Hook GPS auto-detect button
    const gpsBtn = document.getElementById('checkout-detect-gps-btn');
    const gpsIcon = document.getElementById('checkout-gps-icon');
    const gpsLabel = document.getElementById('checkout-gps-label');
    const checkoutAddressInput = document.getElementById('checkout-address-input');

    if (gpsBtn) {
      gpsBtn.addEventListener('click', async () => {
        if (gpsIcon) gpsIcon.classList.add('animate-spin');
        if (gpsLabel) gpsLabel.innerText = 'Detecting...';
        const detected = await window.foodlyStore.detectCurrentLocation(false);
        if (gpsIcon) gpsIcon.classList.remove('animate-spin');
        if (gpsLabel) gpsLabel.innerText = 'Use Current Location';
        if (detected && checkoutAddressInput) {
          checkoutAddressInput.value = detected;
        }
      });
    }

    // ── Payment Method Accordion Logic ───────────────────────────────────────
    const PANEL_MAP = {
      'UPI (Google Pay)': '.upi-panel',
      'Credit/Debit Card': '.card-panel',
      'Net Banking':      '.netbanking-panel',
      'Pay Later / EMI':  '.emilater-panel',
      'Cash on Delivery': '.cod-panel',
    };

    const ACTIVE_BORDER = ['border-2', 'border-primary', 'bg-primary-fixed/30'];
    const INACTIVE_BORDER = ['border', 'border-surface-variant'];

    function activatePaymentCard(selectedValue) {
      document.querySelectorAll('.payment-method-card').forEach(card => {
        const radio = card.querySelector('input[type="radio"]');
        const panelSelector = PANEL_MAP[radio?.value] || null;

        // Toggle border
        ACTIVE_BORDER.forEach(c => card.classList.remove(c));
        INACTIVE_BORDER.forEach(c => card.classList.remove(c));
        if (radio?.value === selectedValue) {
          ACTIVE_BORDER.forEach(c => card.classList.add(c));
        } else {
          INACTIVE_BORDER.forEach(c => card.classList.add(c));
        }

        // Toggle panel visibility
        if (panelSelector) {
          const panel = card.querySelector(panelSelector.replace('.', '').split(' ').map(c => '.' + c).join(''));
          // querySelector by class directly on card
          const panelEl = card.querySelector('[class*="-panel"]');
          if (panelEl) {
            if (radio?.value === selectedValue) {
              panelEl.classList.remove('hidden');
            } else {
              panelEl.classList.add('hidden');
            }
          }
        }
      });
    }

    // Wire up radio change events
    document.querySelectorAll('input[name="payment_method"]').forEach(radio => {
      radio.addEventListener('change', () => activatePaymentCard(radio.value));
    });

    // Set initial state (UPI selected by default)
    activatePaymentCard('UPI (Google Pay)');

    // ── Card Preview Live Update ──────────────────────────────────────────────
    const cardNumberInput = document.getElementById('card-number-input');
    const cardNameInput   = document.getElementById('card-name-input');
    const cardExpiryInput = document.getElementById('card-expiry-input');
    const cardPreviewNum  = document.getElementById('card-preview-number');
    const cardPreviewName = document.getElementById('card-preview-name');
    const cardPreviewExp  = document.getElementById('card-preview-expiry');
    const cardPreviewNet  = document.getElementById('card-preview-network');

    if (cardNumberInput) {
      cardNumberInput.addEventListener('input', (e) => {
        // Format: groups of 4 digits separated by space
        let v = e.target.value.replace(/\D/g, '').slice(0, 16);
        e.target.value = v.replace(/(.{4})/g, '$1 ').trim();
        // Update preview
        const masked = (v + '•'.repeat(Math.max(0, 16 - v.length))).replace(/(.{4})/g, '$1 ').trim();
        if (cardPreviewNum) cardPreviewNum.textContent = masked || '•••• •••• •••• ••••';
        // Detect card network
        if (cardPreviewNet) {
          if (v.startsWith('4')) cardPreviewNet.textContent = 'VISA';
          else if (v.startsWith('5') || v.startsWith('2')) cardPreviewNet.textContent = 'MC';
          else if (v.startsWith('6')) cardPreviewNet.textContent = 'RuPay';
          else if (v.startsWith('3')) cardPreviewNet.textContent = 'AMEX';
          else cardPreviewNet.textContent = 'CARD';
        }
      });
    }

    if (cardNameInput && cardPreviewName) {
      cardNameInput.addEventListener('input', (e) => {
        cardPreviewName.textContent = e.target.value.toUpperCase() || 'YOUR NAME';
      });
    }

    if (cardExpiryInput && cardPreviewExp) {
      cardExpiryInput.addEventListener('input', (e) => {
        let v = e.target.value.replace(/\D/g, '').slice(0, 4);
        if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
        e.target.value = v;
        cardPreviewExp.textContent = v || 'MM/YY';
      });
    }

    // Hook place order button
    const placeOrderBtn = document.getElementById('place-order-btn');
    if (placeOrderBtn) {
      placeOrderBtn.addEventListener('click', async () => {
        placeOrderBtn.disabled = true;
        placeOrderBtn.innerHTML = `
          <span class="material-symbols-outlined animate-spin text-lg">progress_activity</span>
          <span>Placing Order...</span>
        `;

        const address = document.getElementById('checkout-address-input')?.value.trim() || store.activeAddress;
        const paymentMethod = document.querySelector('input[name="payment_method"]:checked')?.value || 'Credit Card';

        try {
          const res = await window.foodlyApi.createOrder({
            restaurantId: cart.restaurantId,
            restaurantName: cart.restaurantName,
            items: cart.items,
            bill: bill,
            deliveryAddress: address,
            paymentMethod: paymentMethod
          });

          if (res.success) {
            store.clearCart();
            store.showToast('Order placed successfully! Tracking your delivery partner now.', 'success');
            window.location.hash = `#track/${res.data.id}`;
          } else {
            alert('Could not place order: ' + res.error);
            placeOrderBtn.disabled = false;
            placeOrderBtn.innerHTML = `<span>Place Order & Track Live</span>`;
          }
        } catch (e) {
          alert('Error placing order: ' + e.message);
          placeOrderBtn.disabled = false;
          placeOrderBtn.innerHTML = `<span>Place Order & Track Live</span>`;
        }
      });
    }
  }

  window.renderCheckoutView = renderCheckoutView;
})();
