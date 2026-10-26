// public/js/views/homeView.js - Home Screen with Nearby-First Restaurant Display
(function () {

  function renderRestaurantCard(rest) {
    const distanceBadge = (rest.distanceKm !== null && rest.distanceKm !== undefined)
      ? `<span class="absolute top-3 right-3 bg-tertiary text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-0.5">
           <span class="material-symbols-outlined text-xs">near_me</span>
           ${rest.distanceKm} km
         </span>`
      : '';

    return `
      <div class="bg-surface-container-lowest border border-surface-variant rounded-2xl overflow-hidden card-shadow card-3d spotlight-card flex flex-col" style="position:relative;">
        <a href="#restaurant/${rest.id}" class="block relative h-48 w-full overflow-hidden group">
          <img src="${rest.heroImage}" alt="${rest.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy"/>
          <div class="absolute top-3 left-3 flex gap-1.5 flex-wrap">
            ${rest.type === 'food-cart' ? '<span class="bg-amber-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1"><span class="material-symbols-outlined text-xs">storefront</span>Cart</span>' : ''}
            ${(rest.type === 'cafe' || rest.isCafe) && rest.type !== 'food-cart' ? '<span class="bg-indigo-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1"><span class="material-symbols-outlined text-xs">local_cafe</span>Cafe</span>' : ''}
            ${rest.bestseller ? '<span class="bg-primary-container text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">Bestseller</span>' : ''}
            ${(rest.dietary && rest.dietary.includes('Vegetarian')) ? '<span class="bg-tertiary-container text-on-tertiary-container text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">Pure Veg</span>' : ''}
          </div>
          ${distanceBadge}
          <div class="absolute bottom-3 right-3 bg-surface-container-lowest/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-md text-on-surface">
            <span class="material-symbols-outlined text-secondary text-sm">schedule</span>
            <span>${rest.deliveryTime}</span>
          </div>
        </a>
        <div class="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div class="flex justify-between items-start mb-1">
              <a href="#restaurant/${rest.id}" class="font-bold text-lg text-on-surface hover:text-primary transition-colors">${rest.name}</a>
              <div class="flex items-center gap-1 bg-tertiary-container/20 text-tertiary px-2 py-0.5 rounded-md text-xs font-bold shrink-0 ml-2">
                <span class="material-symbols-outlined text-xs filled">star</span>
                <span>${rest.rating}</span>
              </div>
            </div>
            <div class="flex items-center gap-1.5 text-xs text-secondary mb-1">
              <span class="material-symbols-outlined text-xs text-primary">location_on</span>
              <span class="font-semibold text-on-surface truncate">${rest.area || rest.city}</span>
            </div>
            <p class="text-xs text-on-surface-variant line-clamp-1 mb-3 font-medium">${rest.headline}</p>
            <div class="flex items-center gap-2 text-xs text-secondary mb-4">
              <span>${rest.cuisines.slice(0,3).join(' \u2022 ')}</span>
              <span>\u2022</span>
              <span class="font-bold text-on-surface">${rest.priceTier}</span>
            </div>
          </div>
          <div class="flex items-center justify-between pt-3 border-t border-surface-variant/50 text-xs">
            <span class="text-on-surface-variant font-medium">Delivery: <strong class="text-on-surface">&#8377;${rest.deliveryFee}</strong></span>
            <a href="#restaurant/${rest.id}" class="bg-primary-container text-white font-bold px-4 py-2 rounded-lg hover:bg-primary transition-colors duration-200">View Menu</a>
          </div>
        </div>
      </div>
    `;
  }

  async function renderHomeView(container) {
    container.innerHTML = `
      <div class="fade-in">

        <!-- ═══ CANONICAL FOODLY HERO SECTION ═══════════════════════════════ -->
        <section class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-stack-lg relative pt-2">
          <div class="h-[500px] rounded-xl overflow-hidden relative flex items-center bg-surface-container-high shadow-md">
            <div class="absolute inset-0 bg-cover bg-center opacity-80" data-alt="Foodly dining feast" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuDP7dj6F7fHBFhjCn9WumkZlWQzPbsBvGQUpmuW4tsTmyNP9NWyZBo6O-qi5BMisoiHjz0oiBPV0g6FoNAsBb0oM6dN5n2oZ5JIz6KFUXfS9yY5rHYa0Es6U6fLF-zRBtPiOcSWrl-k5ylm0-XUJz0ghqjoCVp1Kf9QFhUKfVozNg3m5pYcTQx7_XRJ7qFP4YwMSxdal5B9EBl-dtJ9mBEK6HHxsSUrCnMw_RTgsuhRaa4_RaesdUBl')"></div>
            <div class="relative z-10 p-6 md:p-margin-desktop w-full max-w-2xl bg-surface-container-lowest/85 backdrop-blur-md rounded-xl md:rounded-r-xl h-full flex flex-col justify-center shadow-lg">
              <h1 class="font-display-lg text-3xl md:text-display-lg text-on-surface mb-stack-md font-extrabold tracking-tight">Food you love, delivered fast</h1>
              <p class="font-body-lg text-base md:text-body-lg text-on-surface-variant mb-stack-lg">Discover local favorites and track your order in real-time.</p>
              <div class="relative w-full max-w-lg">
                <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-secondary">location_on</span>
                <input id="hero-address-input" class="w-full pl-12 pr-28 md:pr-32 py-4 rounded-lg bg-surface-container-lowest border border-surface-variant focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 font-body-md text-on-surface shadow-sm transition-all duration-200 outline-none text-sm" placeholder="Enter your delivery address..." value="${window.foodlyStore.activeAddress}" type="text"/>
                <button id="hero-find-food-btn" class="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-container text-white font-label-lg text-xs md:text-label-lg px-4 md:px-6 py-2 rounded-md hover:bg-primary transition-colors cursor-pointer active:scale-95 shadow-sm">Find Food</button>
              </div>
              <div class="flex items-center gap-3 mt-4">
                <button id="hero-auto-location-chip" type="button" class="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container-low hover:bg-surface-container border border-surface-variant rounded-full text-xs font-semibold text-on-surface hover:text-primary transition-all cursor-pointer">
                  <span class="material-symbols-outlined text-sm text-primary">my_location</span>
                  <span id="auto-chip-label">Use GPS Location</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- NAVRATRI 2026 FESTIVAL FEATURE: Vrat & Satvik Feasts Showcase -->
        <section class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-10">
          <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-950 via-amber-950 to-orange-950 border-2 border-amber-500/40 p-6 md:p-8 shadow-2xl text-white">
            <!-- Background festive glow -->
            <div class="absolute -right-12 -top-12 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>
            <div class="absolute -left-12 -bottom-12 w-64 h-64 bg-red-500/15 rounded-full blur-3xl pointer-events-none"></div>

            <div class="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <div class="flex items-center gap-3.5">
                <div class="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 text-3xl shadow-inner shrink-0">
                  <span class="diya-flame-glow">🪔</span>
                </div>
                <div>
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[11px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
                      <span>✨ Navratri 2026 Special</span>
                    </span>
                    <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-extrabold border border-emerald-400/30">
                      100% Satvik Certified • Sendha Namak
                    </span>
                  </div>
                  <h2 class="text-2xl md:text-3xl font-black text-white mt-1 flex items-center gap-2">
                    <span>Shubh Navratri Fasting Feasts</span>
                    <span class="text-xl dandiya-left">🥢</span>
                    <span class="text-xl dandiya-right">🥢</span>
                  </h2>
                  <p class="text-xs md:text-sm text-amber-100/80 font-medium">
                    Pure Desi Ghee Sabudana Khichdi, Kuttu Pooris, and Makhana Kheer crafted for fasting devotees across GL Bajaj hostels.
                  </p>
                </div>
              </div>

              <!-- Promo Code Badge -->
              <div class="bg-white/10 backdrop-blur-md border border-amber-300/40 rounded-2xl p-3 shrink-0 flex items-center gap-3">
                <div class="text-right">
                  <span class="text-[10px] uppercase font-bold text-amber-300 block">Festive Coupon</span>
                  <span class="text-base font-black text-white">NAVRATRI25</span>
                </div>
                <button 
                  onclick="window.foodlyStore.applyCoupon({ code: 'NAVRATRI25', discountPercent: 25, maxDiscount: 120, description: '25% OFF Navratri Special' }); window.foodlyStore.toggleCart(true);"
                  class="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-amber-950 font-black text-xs px-3.5 py-2 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  Apply 25% OFF
                </button>
              </div>
            </div>

            <!-- Festive Dishes Grid (4 Top Dishes) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <!-- Dish 1 -->
              <div class="navratri-card-gold rounded-2xl p-4 flex flex-col justify-between text-on-surface card-3d">
                <div>
                  <div class="relative h-32 rounded-xl overflow-hidden mb-3">
                    <img src="https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80" alt="Sabudana Khichdi" class="w-full h-full object-cover"/>
                    <span class="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-white">Desi Ghee</span>
                    <span class="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-700 text-white">Pure Satvik</span>
                  </div>
                  <h4 class="font-extrabold text-sm text-on-surface leading-snug">Shahi Sabudana Khichdi</h4>
                  <p class="text-[11px] text-secondary mt-1 line-clamp-2">Slow-cooked tapioca with roasted crunchy peanuts and Sendha Namak.</p>
                </div>
                <div class="flex items-center justify-between mt-3 pt-2.5 border-t border-amber-200">
                  <span class="text-base font-black text-primary">₹140</span>
                  <button 
                    onclick="window.foodlyStore.addToCart({ id: 'vrat-1', name: 'Shahi Sabudana Khichdi (Desi Ghee)', price: 140, restaurantId: 'navratri-vrat-rasoi', restaurantName: 'Navratri Vrat & Satvik Rasoi 🪔', isVeg: true, calories: 340, protein: 12 });" 
                    class="bg-amber-600 hover:bg-amber-700 text-white text-xs font-black px-3 py-1.5 rounded-xl transition-all active:scale-95 flex items-center gap-1 shadow-sm cursor-pointer"
                  >
                    <span>+ Add</span>
                  </button>
                </div>
              </div>

              <!-- Dish 2 -->
              <div class="navratri-card-gold rounded-2xl p-4 flex flex-col justify-between text-on-surface card-3d">
                <div>
                  <div class="relative h-32 rounded-xl overflow-hidden mb-3">
                    <img src="https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80" alt="Kuttu Poori" class="w-full h-full object-cover"/>
                    <span class="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-black bg-orange-600 text-white">4 Pooris</span>
                    <span class="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-700 text-white">Vrat Classic</span>
                  </div>
                  <h4 class="font-extrabold text-sm text-on-surface leading-snug">Kuttu Ki Poori + Aloo Rassa</h4>
                  <p class="text-[11px] text-secondary mt-1 line-clamp-2">Buckwheat pooris served with tangy cumin spiced potato curry.</p>
                </div>
                <div class="flex items-center justify-between mt-3 pt-2.5 border-t border-amber-200">
                  <span class="text-base font-black text-primary">₹160</span>
                  <button 
                    onclick="window.foodlyStore.addToCart({ id: 'vrat-2', name: 'Kuttu Ki Poori with Aloo Rassa', price: 160, restaurantId: 'navratri-vrat-rasoi', restaurantName: 'Navratri Vrat & Satvik Rasoi 🪔', isVeg: true, calories: 420, protein: 14 });" 
                    class="bg-amber-600 hover:bg-amber-700 text-white text-xs font-black px-3 py-1.5 rounded-xl transition-all active:scale-95 flex items-center gap-1 shadow-sm cursor-pointer"
                  >
                    <span>+ Add</span>
                  </button>
                </div>
              </div>

              <!-- Dish 3 -->
              <div class="navratri-card-gold rounded-2xl p-4 flex flex-col justify-between text-on-surface card-3d">
                <div>
                  <div class="relative h-32 rounded-xl overflow-hidden mb-3">
                    <img src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80" alt="Falhari Thali" class="w-full h-full object-cover"/>
                    <span class="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-black bg-red-600 text-white">Royal Feast</span>
                    <span class="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-700 text-white">Complete Meal</span>
                  </div>
                  <h4 class="font-extrabold text-sm text-on-surface leading-snug">Royal Navratri Falhari Thali</h4>
                  <p class="text-[11px] text-secondary mt-1 line-clamp-2">4 Kuttu Pooris, Samak Pulao, Paneer Korma, Raita & Halwa.</p>
                </div>
                <div class="flex items-center justify-between mt-3 pt-2.5 border-t border-amber-200">
                  <span class="text-base font-black text-primary">₹250</span>
                  <button 
                    onclick="window.foodlyStore.addToCart({ id: 'vrat-4', name: 'Royal Navratri Falhari Maha Thali', price: 250, restaurantId: 'navratri-vrat-rasoi', restaurantName: 'Navratri Vrat & Satvik Rasoi 🪔', isVeg: true, calories: 580, protein: 22 });" 
                    class="bg-amber-600 hover:bg-amber-700 text-white text-xs font-black px-3 py-1.5 rounded-xl transition-all active:scale-95 flex items-center gap-1 shadow-sm cursor-pointer"
                  >
                    <span>+ Add</span>
                  </button>
                </div>
              </div>

              <!-- Dish 4 -->
              <div class="navratri-card-gold rounded-2xl p-4 flex flex-col justify-between text-on-surface card-3d">
                <div>
                  <div class="relative h-32 rounded-xl overflow-hidden mb-3">
                    <img src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80" alt="Makhana Kheer" class="w-full h-full object-cover"/>
                    <span class="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-600 text-white">Kesar Infused</span>
                    <span class="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-700 text-white">Dry Fruits</span>
                  </div>
                  <h4 class="font-extrabold text-sm text-on-surface leading-snug">Kesar Makhana Shahi Kheer</h4>
                  <p class="text-[11px] text-secondary mt-1 line-clamp-2">Lotus seeds simmered with cardamom, saffron, pistachios & almonds.</p>
                </div>
                <div class="flex items-center justify-between mt-3 pt-2.5 border-t border-amber-200">
                  <span class="text-base font-black text-primary">₹140</span>
                  <button 
                    onclick="window.foodlyStore.addToCart({ id: 'vrat-6', name: 'Shahi Kesar Makhana Kheer', price: 140, restaurantId: 'navratri-vrat-rasoi', restaurantName: 'Navratri Vrat & Satvik Rasoi 🪔', isVeg: true, calories: 290, protein: 8 });" 
                    class="bg-amber-600 hover:bg-amber-700 text-white text-xs font-black px-3 py-1.5 rounded-xl transition-all active:scale-95 flex items-center gap-1 shadow-sm cursor-pointer"
                  >
                    <span>+ Add</span>
                  </button>
                </div>
              </div>
            </div>

            <div class="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-amber-200/90 font-semibold border-t border-white/10 pt-4">
              <span class="flex items-center gap-1.5">
                <span class="diya-flame-glow">🪔</span>
                <span>All fasting meals prepared in separate dedicated Satvik kitchen with sendha namak.</span>
              </span>
              <a href="#search?cuisine=vrat-special" class="text-amber-300 font-bold hover:underline flex items-center gap-1">
                <span>View Full Navratri Menu (8 Dishes)</span>
                <span class="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
            </div>
          </div>
        </section>

        <!-- INNOVATION 1: GL Bajaj Campus Batch Pool Banner -->
        <section class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-8">
          <div class="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white rounded-2xl p-5 md:p-6 shadow-xl border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-3.5">
              <div class="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0">
                <span class="material-symbols-outlined text-2xl">school</span>
              </div>
              <div>
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[11px] font-extrabold uppercase tracking-wider border border-emerald-400/30">
                    GL Bajaj Campus Pool Active
                  </span>
                  <span class="text-xs text-emerald-200/80 font-semibold flex items-center gap-1">
                    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Next delivery pool leaves in 14 mins
                  </span>
                </div>
                <h3 class="text-base md:text-lg font-black text-white mt-1">₹0 Delivery Fee for GL Bajaj Hostels &amp; Knowledge Park III</h3>
                <p class="text-xs text-emerald-100/70 mt-0.5 font-medium">Hostel drop-zones combined to eliminate individual delivery charges and reduce carbon footprint!</p>
              </div>
            </div>
            <div class="flex items-center gap-2.5 shrink-0 w-full md:w-auto">
              <button onclick="window.foodlyGroupOrder.openModal('create')" class="flex-1 md:flex-none px-4 py-2.5 bg-white text-emerald-950 font-black text-xs rounded-xl hover:bg-emerald-50 transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer">
                <span class="material-symbols-outlined text-base">groups</span>
                <span>Hostel Group Order &amp; UPI Split</span>
              </button>
            </div>
          </div>
        </section>

        <!-- INNOVATION 2: AI Craving & Mood Matcher Widget -->
        <section class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-12">
          <div class="bg-surface-container-lowest border border-surface-variant rounded-2xl p-6 shadow-sm">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-xl">🔮</span>
                  <h2 class="text-xl md:text-2xl font-black text-on-surface">AI Craving &amp; Mood Matcher</h2>
                  <span class="px-2.5 py-0.5 bg-primary-container/15 text-primary font-extrabold text-[10px] rounded-full uppercase tracking-wider">Smart Engine</span>
                </div>
                <p class="text-xs text-on-surface-variant font-medium mt-0.5">Tell Foodly your vibe — get smart dish recommendations with live macro nutrition &amp; FairPrice savings.</p>
              </div>
              <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-tertiary-container/15 text-tertiary border border-tertiary/30 text-xs font-bold shrink-0">
                <span class="material-symbols-outlined text-sm filled">verified_user</span>
                <span>FairPrice Guarantee: Zero Surge Pricing</span>
              </div>
            </div>

            <!-- Mood Selector Pills -->
            <div class="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none" id="ai-mood-pills">
              <button data-mood="late_night" class="mood-pill active px-4 py-2 rounded-xl text-xs font-bold transition-all bg-primary-container text-white shadow-sm flex items-center gap-1.5 shrink-0 cursor-pointer">
                <span>🌙</span> Late Night Coding
              </button>
              <button data-mood="gym_protein" class="mood-pill px-4 py-2 rounded-xl text-xs font-bold transition-all bg-surface-container-low text-on-surface border border-surface-variant hover:border-primary flex items-center gap-1.5 shrink-0 cursor-pointer">
                <span>🏋️</span> Post-Gym Protein (&gt;25g)
              </button>
              <button data-mood="student_budget" class="mood-pill px-4 py-2 rounded-xl text-xs font-bold transition-all bg-surface-container-low text-on-surface border border-surface-variant hover:border-primary flex items-center gap-1.5 shrink-0 cursor-pointer">
                <span>💰</span> Broke Student (&lt; ₹199)
              </button>
              <button data-mood="comfort_cheat" class="mood-pill px-4 py-2 rounded-xl text-xs font-bold transition-all bg-surface-container-low text-on-surface border border-surface-variant hover:border-primary flex items-center gap-1.5 shrink-0 cursor-pointer">
                <span>🍕</span> Exam Stress Comfort
              </button>
              <button data-mood="clean_green" class="mood-pill px-4 py-2 rounded-xl text-xs font-bold transition-all bg-surface-container-low text-on-surface border border-surface-variant hover:border-primary flex items-center gap-1.5 shrink-0 cursor-pointer">
                <span>🥗</span> Clean &amp; Guilt-Free
              </button>
            </div>

            <!-- Matching Dishes Container -->
            <div id="ai-matching-dishes" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-3">
              <div class="col-span-full py-8 text-center text-secondary text-xs flex items-center justify-center gap-2">
                <span class="material-symbols-outlined animate-spin text-primary text-base">progress_activity</span>
                <span>Curating dishes for your mood...</span>
              </div>
            </div>
          </div>
        </section>

        <section class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-12">
          <div class="flex justify-between items-end mb-6">
            <div>
              <h2 class="text-2xl font-extrabold text-on-surface">Explore by Cuisine</h2>
              <p class="text-xs md:text-sm text-on-surface-variant mt-0.5">Satisfy your cravings from hand-picked culinary categories</p>
            </div>
            <a href="#search" class="text-primary font-bold text-sm hover:underline flex items-center gap-1">View All <span class="material-symbols-outlined text-base">arrow_forward</span></a>
          </div>
          <div id="home-categories-container" class="grid grid-cols-3 sm:grid-cols-6 gap-4"></div>
        </section>

        <section id="nearby-section" class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-14 hidden">
          <div class="flex justify-between items-end mb-6">
            <div>
              <h2 class="text-2xl font-extrabold text-on-surface flex items-center gap-2">
                <span class="material-symbols-outlined text-primary text-2xl filled">near_me</span>
                Near You
              </h2>
              <p class="text-xs md:text-sm text-on-surface-variant mt-0.5" id="nearby-subtitle">Restaurants, cafes & food carts within 30 km of your location</p>
            </div>
            <a href="#search" class="text-primary font-bold text-sm hover:underline flex items-center gap-1">See All <span class="material-symbols-outlined text-base">arrow_forward</span></a>
          </div>
          <div id="home-nearby-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
        </section>

        <section id="all-rest-section" class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-14">
          <div class="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
            <div>
              <h2 class="text-2xl font-extrabold text-on-surface" id="all-rest-heading">All Restaurants, Cafes & Food Carts</h2>
              <p class="text-xs md:text-sm text-on-surface-variant mt-0.5" id="all-rest-subtitle">Discover all 36 authentic culinary spots within 30 km</p>
            </div>

            <!-- Quick Category Filter Chips -->
            <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none" id="home-filter-chips">
              <button class="home-chip px-3.5 py-1.5 rounded-full text-xs font-bold transition-all bg-primary text-white shadow-sm cursor-pointer whitespace-nowrap" data-filter="all">All (36)</button>
              <button class="home-chip px-3.5 py-1.5 rounded-full text-xs font-bold transition-all bg-surface-container hover:bg-surface-container-high text-on-surface shadow-sm cursor-pointer flex items-center gap-1 whitespace-nowrap" data-filter="cart">
                <span class="material-symbols-outlined text-xs text-amber-600">storefront</span>Food Carts (7)
              </button>
              <button class="home-chip px-3.5 py-1.5 rounded-full text-xs font-bold transition-all bg-surface-container hover:bg-surface-container-high text-on-surface shadow-sm cursor-pointer flex items-center gap-1 whitespace-nowrap" data-filter="cafe">
                <span class="material-symbols-outlined text-xs text-indigo-600">local_cafe</span>Cafes (14)
              </button>
              <button class="home-chip px-3.5 py-1.5 rounded-full text-xs font-bold transition-all bg-surface-container hover:bg-surface-container-high text-on-surface shadow-sm cursor-pointer whitespace-nowrap" data-filter="south-indian">South Indian &amp; Dosa</button>
              <button class="home-chip px-3.5 py-1.5 rounded-full text-xs font-bold transition-all bg-surface-container hover:bg-surface-container-high text-on-surface shadow-sm cursor-pointer whitespace-nowrap" data-filter="biryani">Biryani &amp; Kebabs</button>
              <button class="home-chip px-3.5 py-1.5 rounded-full text-xs font-bold transition-all bg-surface-container hover:bg-surface-container-high text-on-surface shadow-sm cursor-pointer whitespace-nowrap flex items-center gap-1" data-filter="top-rated">
                <span class="material-symbols-outlined text-xs text-amber-500 filled">star</span>Top Rated (4.7+)
              </button>
            </div>
          </div>
          <div id="home-restaurants-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
        </section>

        <section class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-12">
          <div class="rounded-2xl bg-gradient-to-r from-primary to-primary-container p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between shadow-xl gap-6">
            <div class="max-w-xl">
              <span class="bg-white/20 text-white font-bold text-xs uppercase px-3 py-1 rounded-full mb-3 inline-block">Special Offer</span>
              <h3 class="text-3xl font-extrabold mb-2">Get 50% OFF your next culinary order</h3>
              <p class="text-white/90 text-sm mb-4">Use promo code <span class="font-bold underline tracking-wider">FOODLY50</span> at checkout to enjoy up to <strong>&#8377;100</strong> in instant savings!</p>
              <a href="#offers" class="bg-white text-primary font-bold text-sm px-6 py-3 rounded-xl hover:bg-surface-container-lowest transition-all shadow-md inline-block">View All Deals</a>
            </div>
            <div class="w-48 h-48 rounded-2xl overflow-hidden shadow-lg border-2 border-white/30 hidden md:block">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEmtMEe2h7zmllzirJWf797NPYkfVSq8-1vhRDNxAdfZLnSSvCMcWPsWd8cTyzmT63sAcK-BOTdwykS6UTFeNF2WrFVsRAICr2CURhzQ4OgWiBq1evDOjnZcL6zvQSVXLEgV3nF-h86LYnc4eCy87mA-oA-khBjlrjjFf_-u9-PzftiZHfEmrcZvSSiuDFYuGtKCU08WIbaEXH9UcGHI9aB6s2uR-tJQEw-C6tiGWUfYTbg0QVAl_y" class="w-full h-full object-cover" alt="Delicious food"/>
            </div>
          </div>
        </section>
      </div>
    `;

    const findFoodBtn = document.getElementById('hero-find-food-btn');
    const addressInput = document.getElementById('hero-address-input');
    const locateBtn = document.getElementById('hero-locate-me-btn');
    const locateIcon = document.getElementById('hero-locate-icon');
    const locateChip = document.getElementById('hero-auto-location-chip');
    const chipLabel = document.getElementById('auto-chip-label');

    const triggerAutoLocation = async () => {
      if (locateIcon) locateIcon.classList.add('animate-spin');
      if (chipLabel) chipLabel.innerText = 'Detecting GPS...';
      const res = await window.foodlyStore.detectCurrentLocation(false);
      if (locateIcon) locateIcon.classList.remove('animate-spin');
      if (chipLabel) chipLabel.innerText = res ? 'GPS Location Updated' : 'Use Current Location (GPS)';
      if (res && addressInput) addressInput.value = res;
      await loadHomeData();
    };

    if (locateBtn) locateBtn.addEventListener('click', triggerAutoLocation);
    if (locateChip) locateChip.addEventListener('click', triggerAutoLocation);

    window.foodlyStore.subscribe((event, payload) => {
      if (event === 'LOCATION_UPDATED' && addressInput) addressInput.value = payload;
    });

    if (findFoodBtn && addressInput) {
      findFoodBtn.addEventListener('click', () => {
        window.foodlyStore.activeAddress = addressInput.value.trim();
        window.location.hash = '#search';
      });
      addressInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          window.foodlyStore.activeAddress = addressInput.value.trim();
          window.location.hash = '#search';
        }
      });
    }

    async function loadHomeData() {
      try {
        const [catRes, restRes] = await Promise.all([
          window.foodlyApi.getCategories(),
          window.foodlyApi.getRestaurants()
        ]);

        const catContainer = document.getElementById('home-categories-container');
        if (catContainer && catRes.success) {
          catContainer.innerHTML = catRes.data.map(cat => `
            <a href="#search?cuisine=${encodeURIComponent(cat.id)}" class="bg-surface-container-lowest border border-surface-variant/70 rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-primary-container hover:shadow-md transition-all group cursor-pointer">
              <div class="w-16 h-16 rounded-full overflow-hidden bg-surface-container-low flex items-center justify-center group-hover:scale-105 transition-transform">
                <img src="${cat.image}" alt="${cat.name}" class="w-full h-full object-cover" loading="lazy"/>
              </div>
              <span class="font-bold text-sm text-on-surface group-hover:text-primary transition-colors text-center">${cat.name}</span>
            </a>
          `).join('');
        }

        if (!restRes.success) return;

        const allRestaurants = restRes.data;
        const nearbyRestaurants = allRestaurants.filter(r => r.isNearby);
        const otherRestaurants = allRestaurants.filter(r => !r.isNearby);

        const nearbySection = document.getElementById('nearby-section');
        const nearbyContainer = document.getElementById('home-nearby-container');
        const nearbySubtitle = document.getElementById('nearby-subtitle');
        const allRestHeading = document.getElementById('all-rest-heading');
        const allRestSection = document.getElementById('all-rest-section');
        const restContainer = document.getElementById('home-restaurants-container');

        if (nearbyRestaurants.length > 0 && nearbySection && nearbyContainer) {
          nearbySection.classList.remove('hidden');
          if (nearbySubtitle) {
            const n = nearbyRestaurants.length;
            nearbySubtitle.textContent = 'Closest dining spots near your GPS location';
          }
          // Display the top 6 closest places
          nearbyContainer.innerHTML = nearbyRestaurants.slice(0, 6).map(rest => renderRestaurantCard(rest)).join('');
        } else if (nearbySection) {
          nearbySection.classList.add('hidden');
        }

        if (restContainer && allRestSection) {
          allRestSection.classList.remove('hidden');
          
          let currentFilter = 'all';
          function applyFilter(filter) {
            currentFilter = filter;
            let filtered = allRestaurants;
            if (filter === 'cart') {
              filtered = allRestaurants.filter(r => r.type === 'food-cart');
            } else if (filter === 'cafe') {
              filtered = allRestaurants.filter(r => r.type === 'cafe' || r.isCafe);
            } else if (filter === 'south-indian') {
              filtered = allRestaurants.filter(r => r.cuisines.some(c => c.toLowerCase().includes('south indian') || c.toLowerCase().includes('dosa')));
            } else if (filter === 'biryani') {
              filtered = allRestaurants.filter(r => r.cuisines.some(c => c.toLowerCase().includes('biryani') || c.toLowerCase().includes('kebab')));
            } else if (filter === 'top-rated') {
              filtered = allRestaurants.filter(r => r.rating >= 4.7);
            }

            restContainer.innerHTML = filtered.map(rest => renderRestaurantCard(rest)).join('');

            // Update chips active state
            document.querySelectorAll('.home-chip').forEach(btn => {
              if (btn.dataset.filter === filter) {
                btn.className = 'home-chip px-3.5 py-1.5 rounded-full text-xs font-bold transition-all bg-primary text-white shadow-sm cursor-pointer whitespace-nowrap';
              } else {
                btn.className = 'home-chip px-3.5 py-1.5 rounded-full text-xs font-bold transition-all bg-surface-container hover:bg-surface-container-high text-on-surface shadow-sm cursor-pointer whitespace-nowrap flex items-center gap-1';
              }
            });
          }

          // Attach chip clicks
          document.querySelectorAll('.home-chip').forEach(btn => {
            btn.addEventListener('click', () => applyFilter(btn.dataset.filter));
          });

          // Initial render
          applyFilter('all');
        }

        // INNOVATION 2: Load AI Mood & Craving recommendations
        async function loadAiMoodDishes(mood = 'late_night') {
          const container = document.getElementById('ai-matching-dishes');
          if (!container) return;

          container.innerHTML = `
            <div class="col-span-full py-8 text-center text-secondary text-xs flex items-center justify-center gap-2">
              <span class="material-symbols-outlined animate-spin text-primary text-base">progress_activity</span>
              <span>Curating smart dishes for your mood...</span>
            </div>
          `;

          try {
            const res = await window.foodlyApi.getAiMoodMatcher(mood);
            if (!res.success || res.data.length === 0) {
              container.innerHTML = `<div class="col-span-full py-4 text-center text-xs text-secondary">No exact dishes found. Try another vibe!</div>`;
              return;
            }

            container.innerHTML = res.data.slice(0, 4).map(item => `
              <div class="bg-surface-container-low border border-surface-variant/80 rounded-2xl p-3.5 flex flex-col justify-between hover:border-primary/40 hover:shadow-md transition-all">
                <div>
                  <div class="h-32 rounded-xl overflow-hidden mb-2.5 relative">
                    <img src="${item.dish.image}" alt="${item.dish.name}" class="w-full h-full object-cover" loading="lazy"/>
                    <span class="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span>🔥</span> ${item.dish.nutrition ? item.dish.nutrition.calories : 350} kcal
                    </span>
                    <span class="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                      ${item.dish.nutrition ? item.dish.nutrition.protein : 22}g Protein
                    </span>
                  </div>

                  <div class="flex items-center gap-1.5 mb-1">
                    ${item.dish.veg 
                      ? '<span class="w-3.5 h-3.5 rounded-sm border-2 border-emerald-600 flex items-center justify-center shrink-0" title="Veg"><span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span></span>' 
                      : '<span class="w-3.5 h-3.5 rounded-sm border-2 border-rose-600 flex items-center justify-center shrink-0" title="Non-Veg"><span class="w-1.5 h-1.5 rounded-full bg-rose-600"></span></span>'
                    }
                    <h4 class="font-extrabold text-sm text-on-surface line-clamp-1">${item.dish.name}</h4>
                  </div>

                  <p class="text-[11px] text-secondary font-semibold truncate mb-1">From: ${item.restaurant.name}</p>
                  <p class="text-[10.5px] text-primary font-bold italic line-clamp-1 mb-2">${item.matchReason}</p>

                  <!-- FairPrice Audit Pill -->
                  <div class="p-2 rounded-xl bg-surface-container-lowest border border-surface-variant/50 text-[11px] mb-3">
                    <div class="flex justify-between items-center text-on-surface font-extrabold">
                      <span>Foodly (Dine-in):</span>
                      <span class="text-primary text-xs">&#8377;${item.dish.price}</span>
                    </div>
                    <div class="flex justify-between items-center text-on-surface-variant text-[10px] mt-0.5">
                      <span>Swiggy/Zomato est.:</span>
                      <span class="line-through text-error">&#8377;${item.dish.fairPrice ? item.dish.fairPrice.swiggyZomatoPrice : Math.round(item.dish.price * 1.25 + 15)}</span>
                    </div>
                    <div class="text-[10px] text-emerald-600 font-bold mt-1">
                      🎉 Save &#8377;${item.dish.fairPrice ? item.dish.fairPrice.savings : Math.round(item.dish.price * 0.25 + 15)} (No Surge Fee)
                    </div>
                  </div>
                </div>

                <button 
                  data-dish-json='${JSON.stringify(item.dish).replace(/'/g, "&apos;")}'
                  data-rest-json='${JSON.stringify(item.restaurant).replace(/'/g, "&apos;")}'
                  class="ai-dish-add-btn w-full py-2 bg-primary-container text-white font-extrabold text-xs rounded-xl hover:bg-primary transition-all shadow-sm active:scale-95 cursor-pointer flex items-center justify-center gap-1"
                >
                  <span class="material-symbols-outlined text-sm">add_shopping_cart</span>
                  <span>Add &bull; &#8377;${item.dish.price}</span>
                </button>
              </div>
            `).join('');

            // Wire Add to Cart buttons
            container.querySelectorAll('.ai-dish-add-btn').forEach(b => {
              b.addEventListener('click', () => {
                try {
                  const d = JSON.parse(b.getAttribute('data-dish-json'));
                  const r = JSON.parse(b.getAttribute('data-rest-json'));
                  window.foodlyStore.addToCart(d, r);
                } catch(e) {
                  console.error(e);
                }
              });
            });
          } catch (err) {
            console.error("AI mood load error", err);
          }
        }

        // Attach Mood Pill clicks
        document.querySelectorAll('.mood-pill').forEach(pill => {
          pill.addEventListener('click', () => {
            document.querySelectorAll('.mood-pill').forEach(p => {
              p.className = 'mood-pill px-4 py-2 rounded-xl text-xs font-bold transition-all bg-surface-container-low text-on-surface border border-surface-variant hover:border-primary flex items-center gap-1.5 shrink-0 cursor-pointer';
            });
            pill.className = 'mood-pill active px-4 py-2 rounded-xl text-xs font-bold transition-all bg-primary-container text-white shadow-sm flex items-center gap-1.5 shrink-0 cursor-pointer';
            loadAiMoodDishes(pill.dataset.mood);
          });
        });

        // Initial mood load
        loadAiMoodDishes('late_night');
      } catch (e) {
        console.error("Error loading home data", e);
      }
    }

    loadHomeData();
  }

  window.renderHomeView = renderHomeView;
})();
