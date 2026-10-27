// js/views/homeView.js - Premium Swiggy/Zomato Style Home View
(function () {

  // ── Swiggy-style restaurant card (vertical, mobile-first) ──────────────
  function renderRestaurantCard(rest) {
    const ratingColor = rest.rating >= 4.5 ? '#006c4a' : (rest.rating >= 4.0 ? '#2e7d32' : '#ef6c00');
    const tags = [];
    if (rest.bestseller) tags.push('<span class="promo-tag">Bestseller</span>');
    if (rest.type === 'food-cart') tags.push('<span class="promo-tag" style="background:linear-gradient(90deg,#f59e0b,#d97706)">Campus Cart</span>');
    if ((rest.type === 'cafe' || rest.isCafe) && rest.type !== 'food-cart') tags.push('<span class="promo-tag" style="background:linear-gradient(90deg,#6366f1,#8b5cf6)">Cafe</span>');
    if (rest.dietary && rest.dietary.includes('Vegetarian')) tags.push('<span class="promo-tag" style="background:linear-gradient(90deg,#22c55e,#16a34a)">Pure Veg</span>');

    const offerLine = rest.deliveryFee === 0
      ? '<div class="flex items-center gap-1 text-emerald-600 font-bold text-xs mt-1"><span class="material-symbols-outlined text-xs">local_offer</span><span>Free Delivery</span></div>'
      : `<div class="flex items-center gap-1 text-secondary font-semibold text-xs mt-1"><span class="material-symbols-outlined text-xs">delivery_dining</span><span>₹${rest.deliveryFee} delivery</span></div>`;

    return `
      <div class="rest-card card-shadow" onclick="window.location.hash='#restaurant/${rest.id}'" style="position:relative;cursor:pointer;">
        <div class="relative overflow-hidden" style="height:175px;">
          <img src="${rest.heroImage}" alt="${rest.name}" style="width:100%;height:100%;object-fit:cover;transition:transform 0.4s ease;" loading="lazy" 
            onerror="this.src='https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80'"/>
          <div class="absolute inset-0" style="background:linear-gradient(to top,rgba(0,0,0,0.25) 0%,transparent 50%);"></div>
          ${tags.length ? `<div class="absolute top-2.5 left-2.5 flex gap-1.5 flex-wrap">${tags.join('')}</div>` : ''}
          ${(rest.distanceKm !== null && rest.distanceKm !== undefined) ? `
            <div class="absolute top-2.5 right-2.5 bg-black/55 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <span class="material-symbols-outlined text-xs">near_me</span>${rest.distanceKm} km
            </div>` : ''}
          <div class="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-md text-xs font-bold flex items-center gap-1 text-on-surface shadow-sm">
            <span class="material-symbols-outlined text-secondary" style="font-size:13px;">schedule</span>
            <span>${rest.deliveryTime}</span>
          </div>
        </div>
        <div class="p-3.5">
          <div class="flex justify-between items-start">
            <h3 class="font-extrabold text-base text-on-surface leading-tight pr-2" style="max-width:calc(100% - 56px);">${rest.name}</h3>
            <div class="star-badge shrink-0">
              <span class="material-symbols-outlined filled" style="font-size:12px;color:#fff;">star</span>
              <span>${rest.rating}</span>
            </div>
          </div>
          <p class="text-xs text-secondary font-medium mt-0.5 line-clamp-1">${(rest.cuisines || []).slice(0,3).join(' • ')}</p>
          ${offerLine}
          <div class="mt-2 pt-2 border-t border-surface-variant/60 flex items-center justify-between">
            <span class="text-xs text-secondary font-medium">${rest.area || rest.city || 'GL Bajaj Campus'}</span>
            <span class="text-xs text-on-surface-variant font-semibold">${rest.priceTier || '₹₹'}</span>
          </div>
        </div>
      </div>
    `;
  }

  // ── Wide horizontal restaurant card for featured row ──────────────────
  function renderFeaturedCard(rest) {
    return `
      <div class="rest-card-h" style="min-width:280px;max-width:310px;" onclick="window.location.hash='#restaurant/${rest.id}'">
        <img src="${rest.heroImage}" alt="${rest.name}" 
          onerror="this.src='https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=300&q=80'"
          style="width:100px;height:100px;border-radius:12px;object-fit:cover;flex-shrink:0;"/>
        <div style="flex:1;min-width:0;">
          <h4 class="font-extrabold text-sm text-on-surface line-clamp-1">${rest.name}</h4>
          <p class="text-xs text-secondary font-medium mt-0.5 line-clamp-1">${(rest.cuisines || []).slice(0,2).join(' • ')}</p>
          <div class="flex items-center gap-2 mt-1.5 flex-wrap">
            <div class="star-badge"><span class="material-symbols-outlined filled" style="font-size:11px;color:#fff;">star</span><span>${rest.rating}</span></div>
            <span class="text-xs text-secondary font-medium">${rest.deliveryTime}</span>
            ${rest.deliveryFee === 0 ? '<span class="text-xs text-emerald-600 font-bold">Free Del.</span>' : ''}
          </div>
        </div>
      </div>
    `;
  }

  // ── Offer banner card (Creative 3D Visual Showcase) ────────────────────────
  const OFFERS = [
    {
      code: 'FREEDEL',
      discount: 0,
      max: 40,
      tag: '🚀 CAMPUS EXCLUSIVE • ZERO DELIVERY FEE',
      title: 'Zero Delivery Fee, Faster Than Ever',
      sub: 'Unlimited free delivery across all GL Bajaj hostels & academic blocks on ₹149+',
      gradient: 'linear-gradient(135deg, #1c084a 0%, #311475 32%, #4f46e5 72%, #7c3aed 100%)',
      img: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=400&q=80',
      badge1: '⚡ 18 Min Drop',
      badge2: '₹0 Delivery Fee',
      emoji: '🚀'
    },
    {
      code: 'FOODLY50',
      discount: 50,
      max: 100,
      tag: '🔥 HOSTELLER FAVORITE • ALL RESTROS',
      title: 'Flat 50% OFF Sizzling Feasts',
      sub: 'Save up to ₹100 on Biryanis, Pizzas, Burgers & Thalis from 40+ campus kitchens',
      gradient: 'linear-gradient(135deg, #180400 0%, #380d00 30%, #991b1b 68%, #ff5e18 100%)',
      img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
      badge1: '⭐ 4.9 Food Rating',
      badge2: 'FLAT 50% SAVED',
      emoji: '🍔'
    },
    {
      code: 'MIDNIGHT',
      discount: 25,
      max: 75,
      tag: '🌙 NIGHT OWL PASS • OPEN TILL 4 AM',
      title: 'Late Night Munchies? 25% OFF',
      sub: 'Hot rolls, steaming chai, Maggi & cold brew delivered straight to your room',
      gradient: 'linear-gradient(135deg, #030712 0%, #0f172a 35%, #1e1b4b 72%, #2563eb 100%)',
      img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80',
      badge1: '🌙 Open Till 4:00 AM',
      badge2: '15 Mins Hostel Drop',
      emoji: '🧋'
    },
    {
      code: 'NAVRATRI25',
      discount: 25,
      max: 120,
      tag: '🪔 100% SATVIK • DESI GHEE PREPARED',
      title: 'Shubh Navratri Fasting Feast (25% OFF)',
      sub: 'Pure Desi Ghee Sabudana Khichdi, Kuttu Pooris & Makhana Kheer with Sendha Namak',
      gradient: 'linear-gradient(135deg, #1b0700 0%, #451a03 30%, #9a3412 68%, #f59e0b 100%)',
      img: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80',
      badge1: '🪔 100% Satvik Pure',
      badge2: 'Desi Ghee Sendha Namak',
      emoji: '✨'
    }
  ];

  function renderOfferSlide(offer, idx) {
    return `
      <div class="offer-slide shrink-0 w-full" style="background:${offer.gradient};position:relative;overflow:hidden;padding:22px 24px;cursor:pointer;min-height:200px;display:flex;align-items:center;" onclick="window.foodlyStore.applyCoupon({code:'${offer.code}',discountPercent:${offer.discount},maxDiscount:${offer.max},description:'${offer.title}'}); window.foodlyStore.showToast('Coupon ${offer.code} applied!','success');">
        
        <!-- Glowing Ambient Mesh Orb in background -->
        <div style="position:absolute;top:-50px;right:18%;width:240px;height:240px;border-radius:50%;background:rgba(255,255,255,0.14);filter:blur(35px);pointer-events:none;" class="deal-glow-aura"></div>
        <div style="position:absolute;bottom:-30px;left:8%;width:160px;height:160px;border-radius:50%;background:rgba(0,0,0,0.25);filter:blur(25px);pointer-events:none;"></div>
        <!-- Subtle Pattern overlay -->
        <div style="position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px);background-size:20px 20px;opacity:0.25;pointer-events:none;"></div>

        <div style="position:relative;z-index:2;display:flex;align-items:center;justify-content:space-between;gap:20px;width:100%;">
          
          <!-- LEFT CONTENT: Badges, Big Headline & Shimmer Coupon Pill -->
          <div style="flex:1;max-width:560px;">
            <div style="display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,0.15);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.25);border-radius:99px;padding:3.5px 12px;margin-bottom:8px;">
              <span style="font-size:11px;">${offer.emoji}</span>
              <span style="color:#fff;font-size:10.5px;font-weight:900;letter-spacing:0.04em;">${offer.tag}</span>
            </div>

            <h3 style="color:#fff;font-size:22px;font-weight:900;line-height:1.2;margin-bottom:5px;letter-spacing:-0.02em;" class="sm:text-2xl">
              ${offer.title}
            </h3>

            <p style="color:rgba(255,255,255,0.85);font-size:11.5px;font-weight:500;line-height:1.45;margin-bottom:12px;max-width:480px;">
              ${offer.sub}
            </p>

            <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
              <!-- Shimmering Coupon Capsule -->
              <div class="coupon-tag-shimmer" style="display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,0.22);backdrop-filter:blur(12px);border:1.5px dashed rgba(255,255,255,0.85);border-radius:12px;padding:5px 14px;box-shadow:0 4px 16px rgba(0,0,0,0.15);">
                <span style="font-size:10.5px;font-weight:900;color:rgba(255,255,255,0.9);letter-spacing:0.06em;">TAP TO APPLY:</span>
                <span style="font-size:12.5px;font-weight:900;color:#fde047;letter-spacing:0.08em;text-decoration:underline;">${offer.code}</span>
              </div>
              <span style="background:#fff;color:#151c27;font-size:11px;font-weight:900;padding:6px 14px;border-radius:12px;box-shadow:0 4px 14px rgba(0,0,0,0.2);display:inline-flex;align-items:center;gap:4px;" class="hidden sm:inline-flex">
                <span>Claim Deal</span>
                <span>→</span>
              </span>
            </div>
          </div>

          <!-- RIGHT 3D CREATIVE SHOWCASE & FLOATING BADGES (Desktop & Tablet) -->
          <div class="deal-3d-scene hidden md:flex shrink-0" style="position:relative;width:240px;height:170px;align-items:center;justify-content:center;">
            
            <!-- 3D Levitating Image Card -->
            <div class="deal-3d-showcase" style="width:170px;height:135px;border-radius:20px;overflow:hidden;border:1.5px solid rgba(255,255,255,0.4);box-shadow:0 20px 45px rgba(0,0,0,0.45);position:relative;background:rgba(0,0,0,0.3);">
              <img src="${offer.img}" alt="${offer.title}" style="width:100%;height:100%;object-fit:cover;"/>
              <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.6) 0%,transparent 60%);"></div>
              <div style="position:absolute;bottom:8px;left:10px;color:#fff;font-size:10px;font-weight:800;">
                Foodly Verified
              </div>
            </div>

            <!-- Floating 3D Badge Top-Left -->
            <div class="deal-badge-float-1" style="position:absolute;top:-4px;left:-8px;background:rgba(255,255,255,0.95);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.8);border-radius:12px;padding:5px 10px;box-shadow:0 10px 25px rgba(0,0,0,0.25);display:flex;align-items:center;gap:6px;pointer-events:none;">
              <span style="font-size:13px;">⚡</span>
              <span style="font-size:10px;font-weight:900;color:#151c27;white-space:nowrap;">${offer.badge1}</span>
            </div>

            <!-- Floating 3D Badge Bottom-Right -->
            <div class="deal-badge-float-2" style="position:absolute;bottom:-6px;right:-10px;background:rgba(21,28,39,0.92);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.2);border-radius:12px;padding:5px 12px;box-shadow:0 10px 25px rgba(0,0,0,0.35);color:#fff;pointer-events:none;">
              <span style="font-size:10px;font-weight:900;color:#fde047;white-space:nowrap;">${offer.badge2}</span>
            </div>
          </div>

        </div>
      </div>
    `;
  }

  // ── Category pill ─────────────────────────────────────────────────────
  const CATEGORIES = [
    { id: 'biryani',      name: 'Biryani',     img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=300&q=80' },
    { id: 'cafe',         name: 'Cafes',        img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=300&q=80' },
    { id: 'pizza',        name: 'Pizza',        img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=300&q=80' },
    { id: 'burger',       name: 'Burgers',      img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80' },
    { id: 'thali',        name: 'Thalis',       img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=300&q=80' },
    { id: 'south-indian', name: 'South Indian', img: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=300&q=80' },
    { id: 'rolls',        name: 'Rolls',        img: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=300&q=80' },
    { id: 'dessert',      name: 'Desserts',     img: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=300&q=80' },
    { id: 'vrat-special', name: '🪔 Vrat',      img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=300&q=80' },
  ];

  // ── Main render ─────────────────────────────────────────────────────────
  async function renderHomeView(container) {
    const store = window.foodlyStore;

    container.innerHTML = `
      <div class="fade-in" style="background:#f9f9ff;min-height:100vh;">

        <!-- ══ CREATIVE VIBRANT MOBILE HERO BANNER (md:hidden) ════════════ -->
        <section style="background:linear-gradient(135deg,#130601 0%,#290d02 32%,#aa3700 70%,#ff5e18 100%);padding:22px 18px 32px;position:relative;overflow:hidden;" class="md:hidden">
          <!-- Background ambient circles -->
          <div style="position:absolute;top:-40px;right:-40px;width:180px;height:180px;border-radius:50%;background:radial-gradient(circle,rgba(255,110,30,0.3) 0%,transparent 70%);filter:blur(20px);pointer-events:none;"></div>
          <div style="position:absolute;bottom:-30px;left:-30px;width:140px;height:140px;border-radius:50%;background:rgba(0,0,0,0.2);pointer-events:none;"></div>

          <div style="position:relative;z-index:1;">
            <!-- Live Status Pill -->
            <div style="display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,0.14);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.25);border-radius:99px;padding:3px 10px;margin-bottom:10px;">
              <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#4ade80;"></span>
              <span style="color:#fff;font-size:11px;font-weight:800;">GL Bajaj Campus Express • 20-35m</span>
            </div>

            <h1 style="color:#fff;font-size:26px;font-weight:900;line-height:1.15;margin-bottom:14px;letter-spacing:-0.02em;">
              Craving Something <br><span style="background:linear-gradient(90deg,#ffedd5,#fde047,#ff9800);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Delicious? 🔥</span>
            </h1>

            <!-- Search Bar Capsule -->
            <div class="search-bar-hero" onclick="window.location.hash='#search'" style="cursor:pointer;background:#fff;border-radius:14px;padding:6px 6px 6px 14px;display:flex;align-items:center;gap:8px;box-shadow:0 10px 25px rgba(0,0,0,0.25);">
              <span class="material-symbols-outlined" style="color:#ff5e18;font-size:20px;">search</span>
              <span style="color:#9ca3af;font-size:12px;font-weight:600;flex:1;">Search dishes, restros, cafes...</span>
              <div style="background:linear-gradient(135deg,#ff5e18,#d44000);color:#fff;padding:6px 14px;border-radius:10px;font-size:11px;font-weight:800;">Search</div>
            </div>

            <!-- Quick Mobile Chips -->
            <div style="margin-top:10px;display:flex;gap:5px;overflow-x:auto;padding-bottom:2px;" class="scrollbar-none">
              ${[
                { label: 'Biryani', icon: '🍲', q: 'biryani' },
                { label: 'Pizza', icon: '🍕', q: 'pizza' },
                { label: 'Burgers', icon: '🍔', q: 'burger' },
                { label: 'Cold Coffee', icon: '🧋', q: 'coffee' },
              ].map(c => `
                <a href="#search?q=${c.q}" style="display:inline-flex;align-items:center;gap:3px;background:rgba(255,255,255,0.16);border:1px solid rgba(255,255,255,0.25);border-radius:99px;padding:3px 9px;color:#fff;font-size:10px;font-weight:700;text-decoration:none;white-space:nowrap;">
                  <span>${c.icon}</span><span>${c.label}</span>
                </a>
              `).join('')}
            </div>
          </div>
        </section>

        <!-- ══ CREATIVE 3D DESKTOP HERO SHOWCASE (hidden md:block) ═══════════ -->
        <section class="hidden md:block" style="position:relative;overflow:hidden;background:linear-gradient(135deg,#110501 0%,#260c02 28%,#6f1a00 65%,#ff5e18 100%);padding:52px 48px 60px;">
          
          <!-- Ambient 3D Glowing Mesh Spheres in Background -->
          <div style="position:absolute;top:-80px;right:15%;width:400px;height:400px;border-radius:50%;background:radial-gradient(circle,rgba(255,110,30,0.32) 0%,rgba(255,94,24,0) 70%);filter:blur(40px);pointer-events:none;animation:heroAuraPulse 6s ease-in-out infinite;"></div>
          <div style="position:absolute;bottom:-60px;left:8%;width:320px;height:320px;border-radius:50%;background:radial-gradient(circle,rgba(234,88,12,0.22) 0%,rgba(0,0,0,0) 70%);filter:blur(50px);pointer-events:none;"></div>
          <!-- Geometric Grid Subtle Pattern -->
          <div style="position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,0.14) 1px, transparent 1px);background-size:24px 24px;opacity:0.3;pointer-events:none;"></div>

          <div style="max-width:1280px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:40px;position:relative;z-index:2;">
            
            <!-- LEFT COLUMN: Typography & Interactive Search -->
            <div style="flex:1;max-width:580px;">
              
              <!-- Live Campus Status Pill -->
              <div style="display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,0.12);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.24);padding:6px 14px;border-radius:99px;margin-bottom:16px;box-shadow:0 4px 16px rgba(0,0,0,0.15);">
                <span style="position:relative;display:flex;height:8px;width:8px;">
                  <span style="position:absolute;display:inline-flex;height:100%;width:100%;border-radius:99px;background:#4ade80;opacity:0.75;animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></span>
                  <span style="position:relative;display:inline-flex;border-radius:99px;height:8px;width:8px;background:#22c55e;"></span>
                </span>
                <span style="color:#fff;font-size:12px;font-weight:800;letter-spacing:0.02em;">GL Bajaj Campus Express • Average 18-28 mins drop</span>
              </div>

              <!-- Main Hero Headline with Slogan & Gradient -->
              <h1 style="color:#fff;font-size:45px;font-weight:900;line-height:1.12;margin-bottom:14px;letter-spacing:-0.03em;">
                Craving Hot Feasts? <br>
                <span style="background:linear-gradient(90deg,#ffedd5 0%,#fde047 50%,#ff9800 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;text-shadow:0 10px 30px rgba(255,152,0,0.3);">Fast Fresh Food</span>, Delivered.
              </h1>

              <p style="color:rgba(255,255,255,0.85);font-size:14px;font-weight:500;line-height:1.5;margin-bottom:22px;">
                Direct from top campus restros, canteens, cafes & night carts right to your hostel room or gate.
              </p>

              <!-- Interactive Floating Search Capsule -->
              <div class="hero-search-capsule" style="background:#fff;border-radius:18px;padding:6px 8px 6px 18px;display:flex;align-items:center;gap:12px;box-shadow:0 16px 40px rgba(0,0,0,0.35);border:2px solid rgba(255,255,255,0.9);max-width:520px;transition:all 0.3s ease;">
                <span class="material-symbols-outlined" style="color:#ff5e18;font-size:24px;">search</span>
                <input 
                  id="hero-search-desktop" 
                  type="text" 
                  placeholder="Search for Biryani, Pizza, Burger, Dosa, Cafes..." 
                  onclick="window.location.hash='#search'" 
                  readonly 
                  style="flex:1;border:none;outline:none;font-size:14px;font-weight:600;color:#151c27;background:transparent;cursor:pointer;"
                />
                <button onclick="window.location.hash='#search'" style="background:linear-gradient(135deg,#ff5e18,#d44000);color:#fff;border:none;border-radius:12px;padding:12px 22px;font-size:13px;font-weight:900;cursor:pointer;display:flex;align-items:center;gap:6px;box-shadow:0 4px 14px rgba(255,94,24,0.4);transition:transform 0.2s ease;">
                  <span>Find Food</span>
                  <span class="material-symbols-outlined" style="font-size:16px;">arrow_forward</span>
                </button>
              </div>

              <!-- Quick Trending Search Chips (Clickable) -->
              <div style="margin-top:14px;display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                <span style="font-size:11px;font-weight:800;color:rgba(255,255,255,0.7);text-transform:uppercase;letter-spacing:0.05em;margin-right:2px;">Trending:</span>
                ${[
                  { label: 'Biryani', icon: '🍲', query: 'biryani' },
                  { label: 'Pizza', icon: '🍕', query: 'pizza' },
                  { label: 'Burgers', icon: '🍔', query: 'burger' },
                  { label: 'Cold Coffee', icon: '🧋', query: 'coffee' },
                  { label: 'Momos', icon: '🥟', query: 'rolls' },
                ].map(c => `
                  <a href="#search?q=${c.query}" style="display:inline-flex;align-items:center;gap:4px;background:rgba(255,255,255,0.14);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.25);border-radius:99px;padding:4px 11px;color:#fff;font-size:11px;font-weight:700;text-decoration:none;transition:all 0.2s ease;" class="hero-chip-hover">
                    <span>${c.icon}</span>
                    <span>${c.label}</span>
                  </a>
                `).join('')}
              </div>

              <!-- Campus Stats Row -->
              <div style="margin-top:22px;display:flex;align-items:center;gap:22px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.15);">
                <div>
                  <div style="font-size:19px;font-weight:900;color:#fff;letter-spacing:-0.02em;">12,000+</div>
                  <div style="font-size:11px;font-weight:600;color:rgba(255,255,255,0.75);">Orders Delivered</div>
                </div>
                <div style="width:1px;height:26px;background:rgba(255,255,255,0.2);"></div>
                <div>
                  <div style="font-size:19px;font-weight:900;color:#fff;letter-spacing:-0.02em;display:flex;align-items:center;gap:4px;">
                    <span>4.8</span>
                    <span style="color:#fde047;font-size:15px;">★</span>
                  </div>
                  <div style="font-size:11px;font-weight:600;color:rgba(255,255,255,0.75);">Campus Rating</div>
                </div>
                <div style="width:1px;height:26px;background:rgba(255,255,255,0.2);"></div>
                <div>
                  <div style="font-size:19px;font-weight:900;color:#fff;letter-spacing:-0.02em;">0 Fee</div>
                  <div style="font-size:11px;font-weight:600;color:rgba(255,255,255,0.75);">Select Campus Deals</div>
                </div>
              </div>

            </div>

            <!-- RIGHT COLUMN: 3D INTERACTIVE FOOD SHOWCASE & FLOATING BADGES -->
            <div class="hero-3d-scene" id="hero-3d-interactive-zone" style="flex:1;max-width:540px;height:380px;position:relative;display:flex;align-items:center;justify-content:center;">
              
              <!-- Floating 3D Emojis with Parallax -->
              <div class="hero-emoji-float float-e1" style="position:absolute;top:10px;left:20px;font-size:32px;filter:drop-shadow(0 8px 16px rgba(0,0,0,0.3));pointer-events:none;">🍕</div>
              <div class="hero-emoji-float float-e2" style="position:absolute;bottom:30px;left:10px;font-size:30px;filter:drop-shadow(0 8px 16px rgba(0,0,0,0.3));pointer-events:none;">🍔</div>
              <div class="hero-emoji-float float-e3" style="position:absolute;top:20px;right:25px;font-size:28px;filter:drop-shadow(0 8px 16px rgba(0,0,0,0.3));pointer-events:none;">🥟</div>
              <div class="hero-emoji-float float-e4" style="position:absolute;bottom:40px;right:20px;font-size:30px;filter:drop-shadow(0 8px 16px rgba(0,0,0,0.3));pointer-events:none;">🍟</div>

              <!-- Central 3D Perspective Hero Card -->
              <div class="hero-3d-card" id="hero-3d-card" style="width:360px;height:290px;border-radius:28px;position:relative;background:linear-gradient(145deg,rgba(255,255,255,0.18),rgba(255,255,255,0.06));backdrop-filter:blur(16px);border:1.5px solid rgba(255,255,255,0.35);box-shadow:0 30px 70px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.6);overflow:hidden;cursor:pointer;" onclick="window.location.hash='#search?q=pizza'">
                
                <!-- Food Image inside 3D Card with Shimmer & Steam -->
                <img 
                  src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=80" 
                  alt="Delicious Campus Pizza Feast" 
                  style="width:100%;height:100%;object-fit:cover;transition:transform 0.5s ease;"
                  class="hero-card-img"
                />
                
                <!-- Gradient overlay -->
                <div style="position:absolute;inset:0;background:linear-gradient(to top, rgba(17,6,1,0.85) 0%, rgba(17,6,1,0.2) 50%, transparent 100%);pointer-events:none;"></div>
                
                <!-- Sizzling Hot Badge Top Right of Image -->
                <div style="position:absolute;top:14px;right:14px;background:rgba(0,0,0,0.65);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.3);color:#fff;border-radius:99px;padding:4px 10px;font-size:11px;font-weight:800;display:flex;align-items:center;gap:4px;">
                  <span style="font-size:13px;">🔥</span>
                  <span>Woodfired & Fresh</span>
                </div>

                <!-- Bottom Label inside card -->
                <div style="position:absolute;bottom:16px;left:18px;right:18px;color:#fff;">
                  <div style="font-size:11px;font-weight:800;color:#fde047;text-transform:uppercase;letter-spacing:0.06em;">Campus Bestseller</div>
                  <div style="font-size:18px;font-weight:900;line-height:1.2;margin-top:2px;">Gourmet Cheesy Loaded Pizza</div>
                  <div style="display:flex;align-items:center;justify-content:space-between;margin-top:6px;">
                    <span style="font-size:13px;font-weight:800;color:#fff;">Starting ₹189</span>
                    <span style="background:#ff5e18;color:#fff;padding:3px 10px;border-radius:8px;font-size:10px;font-weight:900;">Order Now →</span>
                  </div>
                </div>
              </div>

              <!-- 3D FLOATING GLASS BADGE 1: Rating (Top-Left) -->
              <div class="hero-float-badge badge-pos-tl" style="position:absolute;top:-8px;left:12px;z-index:4;background:rgba(255,255,255,0.95);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,0.8);border-radius:18px;padding:10px 14px;box-shadow:0 18px 40px rgba(0,0,0,0.25);display:flex;align-items:center;gap:10px;pointer-events:none;">
                <div style="width:36px;height:36px;border-radius:12px;background:linear-gradient(135deg,#006c4a,#059669);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:900;font-size:15px;box-shadow:0 4px 12px rgba(5,150,105,0.3);">
                  4.9★
                </div>
                <div>
                  <div style="font-size:12px;font-weight:900;color:#151c27;line-height:1.2;">Top Student Pick</div>
                  <div style="font-size:10px;font-weight:600;color:#575e70;">5,400+ reviews</div>
                </div>
              </div>

              <!-- 3D FLOATING GLASS BADGE 2: Superfast Delivery (Bottom-Left) -->
              <div class="hero-float-badge badge-pos-bl" style="position:absolute;bottom:-12px;left:24px;z-index:4;background:rgba(255,255,255,0.95);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,0.8);border-radius:18px;padding:10px 14px;box-shadow:0 18px 40px rgba(0,0,0,0.25);display:flex;align-items:center;gap:10px;pointer-events:none;">
                <div style="width:36px;height:36px;border-radius:12px;background:linear-gradient(135deg,#ff5e18,#d44000);display:flex;align-items:center;justify-content:center;color:#fff;font-size:18px;box-shadow:0 4px 12px rgba(255,94,24,0.35);">
                  🛵
                </div>
                <div>
                  <div style="font-size:12px;font-weight:900;color:#151c27;line-height:1.2;display:flex;align-items:center;gap:4px;">
                    <span>⚡ 18 Min Drop</span>
                    <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#22c55e;"></span>
                  </div>
                  <div style="font-size:10px;font-weight:600;color:#575e70;">Direct to Hostel Gate</div>
                </div>
              </div>

              <!-- 3D FLOATING GLASS BADGE 3: Flat 50% OFF (Top-Right) -->
              <div class="hero-float-badge badge-pos-tr" style="position:absolute;top:16px;right:-14px;z-index:4;background:rgba(21,28,39,0.92);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,0.18);border-radius:16px;padding:8px 14px;box-shadow:0 18px 40px rgba(0,0,0,0.35);color:#fff;pointer-events:none;">
                <div style="display:flex;align-items:center;gap:6px;">
                  <span style="font-size:14px;">🏷️</span>
                  <span style="font-size:11px;font-weight:900;color:#fde047;letter-spacing:0.04em;">FLAT 50% OFF</span>
                </div>
                <div style="font-size:9px;font-weight:600;color:rgba(255,255,255,0.8);margin-top:2px;">Use code: <b style="color:#fff;text-decoration:underline;">FIRST50</b></div>
              </div>

            </div>
          </div>
        </section>

        <div style="max-width:1280px;margin:0 auto;padding:0 16px;" class="md:px-16">

          <!-- ══ OFFER BANNERS CAROUSEL WITH SLIDING TRANSITION ═══════════ -->
          <section style="margin-top:20px;margin-bottom:28px;position:relative;">
            <div class="flex items-center justify-between mb-3">
              <div>
                <h2 class="section-title">Deals for you 🔥</h2>
                <p class="section-sub">Exclusive campus coupon specials</p>
              </div>
              <a href="#offers" class="text-xs font-bold text-primary flex items-center gap-0.5 hover:underline">All offers <span class="material-symbols-outlined text-sm">arrow_forward</span></a>
            </div>

            <!-- Viewport & Sliding Track -->
            <div id="offer-carousel-viewport" style="overflow:hidden;border-radius:20px;box-shadow:0 4px 20px rgba(0,0,0,0.06);position:relative;">
              <div id="offer-carousel-track" style="display:flex;transition:transform 0.45s cubic-bezier(0.25, 1, 0.5, 1);will-change:transform;">
                ${OFFERS.map((o, i) => renderOfferSlide(o, i)).join('')}
              </div>
            </div>

            <!-- Carousel Pagination Dots -->
            <div id="offer-carousel-dots" style="display:flex;justify-content:center;align-items:center;gap:6px;margin-top:10px;">
              ${OFFERS.map((_, i) => `
                <button class="offer-carousel-dot ${i === 0 ? 'active' : ''}" data-idx="${i}" style="width:${i === 0 ? '24px' : '8px'};height:8px;border-radius:99px;background:${i === 0 ? '#ff5e18' : '#dce2f3'};border:none;cursor:pointer;transition:all 0.3s ease;" title="Slide ${i + 1}"></button>
              `).join('')}
            </div>
          </section>

          <!-- ══ WHAT'S ON YOUR MIND (CATEGORIES) ══════════════════════════ -->
          <section style="margin-bottom:28px;">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h2 class="section-title">What's on your mind?</h2>
                <p class="section-sub">Explore campus food categories</p>
              </div>
              <a href="#search" class="text-xs font-bold text-primary flex items-center gap-0.5">See all <span class="material-symbols-outlined text-sm">arrow_forward</span></a>
            </div>
            <div style="display:flex;gap:16px;overflow-x:auto;padding-bottom:8px;" class="scrollbar-none">
              ${CATEGORIES.map(cat => `
                <a href="#search?cuisine=${cat.id}" class="cat-pill">
                  <img class="cat-pill-img" src="${cat.img}" alt="${cat.name}" loading="lazy"/>
                  <span class="cat-pill-label">${cat.name}</span>
                </a>
              `).join('')}
            </div>
          </section>

          <!-- ══ NAVRATRI SPECIAL SECTION ════════════════════════════════ -->
          <section style="margin-bottom:28px;">
            <div style="background:linear-gradient(135deg,#1c0a00,#3d1400);border-radius:20px;overflow:hidden;position:relative;padding:20px;">
              <div style="position:absolute;top:-30px;right:-30px;width:150px;height:150px;border-radius:50%;background:rgba(251,191,36,0.08);pointer-events:none;"></div>
              <div style="position:absolute;bottom:-20px;left:-20px;width:100px;height:100px;border-radius:50%;background:rgba(239,68,68,0.08);pointer-events:none;"></div>
              <div style="position:relative;z-index:1;">
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;flex-wrap:wrap;">
                  <span class="diya-flame-glow" style="font-size:28px;">🪔</span>
                  <div>
                    <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                      <span style="background:linear-gradient(90deg,#f59e0b,#ef4444);color:#fff;font-size:10px;font-weight:900;padding:2px 10px;border-radius:99px;text-transform:uppercase;letter-spacing:0.08em;">✨ Navratri 2026 Special</span>
                      <span style="color:#86efac;font-size:10px;font-weight:700;background:rgba(34,197,94,0.12);border:1px solid rgba(34,197,94,0.25);padding:2px 8px;border-radius:99px;">100% Satvik • Sendha Namak</span>
                    </div>
                    <h3 style="color:#fff;font-size:18px;font-weight:900;margin-top:4px;">Shubh Navratri Fasting Feasts 🥢</h3>
                    <p style="color:rgba(255,255,255,0.7);font-size:11px;font-weight:500;">Pure Desi Ghee Sabudana, Kuttu Pooris & Makhana Kheer</p>
                  </div>
                </div>
                <!-- Dish Grid -->
                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;" class="md:grid-cols-4">
                  ${[
                    { name: 'Sabudana Khichdi', price: 140, img: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80', id: 'vrat-1', badge: 'Desi Ghee' },
                    { name: 'Kuttu Poori + Aloo', price: 160, img: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=400&q=80', id: 'vrat-2', badge: '4 Pooris' },
                    { name: 'Navratri Thali', price: 250, img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80', id: 'vrat-4', badge: 'Complete Meal' },
                    { name: 'Makhana Kheer', price: 140, img: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=400&q=80', id: 'vrat-6', badge: 'Kesar Infused' },
                  ].map(d => `
                    <div class="navratri-card-gold" style="border-radius:14px;overflow:hidden;">
                      <div style="position:relative;height:90px;">
                        <img src="${d.img}" alt="${d.name}" style="width:100%;height:100%;object-fit:cover;"/>
                        <span style="position:absolute;top:6px;left:6px;background:rgba(0,0,0,0.6);color:#fff;font-size:9px;font-weight:800;padding:2px 7px;border-radius:99px;">${d.badge}</span>
                      </div>
                      <div style="padding:10px 10px 8px;">
                        <h4 style="font-size:12px;font-weight:800;color:#1c0a00;line-height:1.3;">${d.name}</h4>
                        <div style="display:flex;align-items:center;justify-content:space-between;margin-top:8px;">
                          <span style="font-size:14px;font-weight:900;color:#aa3700;">₹${d.price}</span>
                          <button onclick="event.stopPropagation();window.foodlyStore.addToCart({id:'${d.id}',name:'${d.name}',price:${d.price},restaurantId:'navratri-vrat-rasoi',restaurantName:'Navratri Vrat & Satvik Rasoi 🪔',isVeg:true,calories:350,protein:12});" style="background:#f97316;color:#fff;border:none;border-radius:8px;padding:4px 10px;font-size:11px;font-weight:800;cursor:pointer;">+ Add</button>
                        </div>
                      </div>
                    </div>
                  `).join('')}
                </div>
                <div style="margin-top:14px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;">
                  <div style="background:rgba(255,255,255,0.1);border:1.5px dashed rgba(251,191,36,0.5);border-radius:8px;padding:4px 12px;display:inline-flex;align-items:center;gap:8px;">
                    <span style="color:#fde68a;font-size:10px;font-weight:600;">Festive Coupon</span>
                    <span style="color:#fff;font-size:13px;font-weight:900;letter-spacing:0.05em;">NAVRATRI25</span>
                  </div>
                  <button onclick="window.foodlyStore.applyCoupon({code:'NAVRATRI25',discountPercent:25,maxDiscount:120,description:'25% OFF Navratri Special'});window.foodlyStore.toggleCart(true);" style="background:linear-gradient(90deg,#f59e0b,#ef4444);color:#fff;border:none;border-radius:10px;padding:7px 16px;font-size:12px;font-weight:800;cursor:pointer;">Apply 25% OFF →</button>
                </div>
              </div>
            </div>
          </section>

          <!-- ══ CAMPUS POOL DELIVERY BANNER ════════════════════════════════ -->
          <section style="margin-bottom:28px;">
            <div style="background:linear-gradient(135deg,#022c22,#064e3b);border-radius:20px;padding:18px 20px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;">
              <div style="display:flex;align-items:center;gap:14px;">
                <div style="width:48px;height:48px;border-radius:16px;background:rgba(52,211,153,0.15);border:1px solid rgba(52,211,153,0.3);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                  <span class="material-symbols-outlined" style="font-size:24px;color:#6ee7b7;">school</span>
                </div>
                <div>
                  <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px;">
                    <span style="background:rgba(52,211,153,0.15);border:1px solid rgba(52,211,153,0.3);color:#6ee7b7;font-size:10px;font-weight:800;padding:2px 10px;border-radius:99px;text-transform:uppercase;letter-spacing:0.06em;">GL Bajaj Campus Pool Active</span>
                    <span style="color:#a7f3d0;font-size:10px;font-weight:600;display:flex;align-items:center;gap:4px;"><span style="width:6px;height:6px;border-radius:50%;background:#34d399;display:inline-block;animation:ping 1s cubic-bezier(0,0,0.2,1) infinite;"></span>Next batch in 14 min</span>
                  </div>
                  <h3 style="color:#fff;font-size:15px;font-weight:900;">₹0 Delivery for GL Bajaj Hostels</h3>
                  <p style="color:rgba(255,255,255,0.6);font-size:11px;font-weight:500;margin-top:2px;">Combined hostel drops — zero surcharges!</p>
                </div>
              </div>
              <button onclick="window.foodlyGroupOrder && window.foodlyGroupOrder.openModal('create')" style="background:#fff;color:#022c22;border:none;border-radius:12px;padding:10px 18px;font-size:12px;font-weight:900;cursor:pointer;display:flex;align-items:center;gap:6px;white-space:nowrap;box-shadow:0 4px 12px rgba(0,0,0,0.2);">
                <span class="material-symbols-outlined" style="font-size:18px;">groups</span>
                <span>Group Order & UPI Split</span>
              </button>
            </div>
          </section>

          <!-- ══ AI MOOD MATCHER ══════════════════════════════════════════ -->
          <section style="margin-bottom:28px;">
            <div style="background:#fff;border-radius:20px;padding:20px;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;flex-wrap:wrap;gap:8px;">
                <div>
                  <div style="display:flex;align-items:center;gap:8px;">
                    <span style="font-size:20px;">🔮</span>
                    <h2 class="section-title">Craving Matcher</h2>
                    <span style="background:rgba(170,55,0,0.1);color:#aa3700;font-size:9px;font-weight:800;padding:2px 8px;border-radius:99px;text-transform:uppercase;letter-spacing:0.06em;">Smart</span>
                  </div>
                  <p class="section-sub">Select your craving vibe to get instant campus dish recommendations</p>
                </div>
              </div>
              <!-- Mood Pills -->
              <div style="display:flex;gap:8px;overflow-x:auto;padding-bottom:8px;margin-bottom:14px;" class="scrollbar-none" id="ai-mood-pills">
                ${[
                  { id: 'late_night', emoji: '🌙', label: 'Late Night' },
                  { id: 'gym_protein', emoji: '🏋️', label: 'Post-Gym' },
                  { id: 'student_budget', emoji: '💰', label: 'Budget <₹199' },
                  { id: 'comfort_cheat', emoji: '🍕', label: 'Comfort Food' },
                  { id: 'clean_green', emoji: '🥗', label: 'Healthy' },
                ].map((m, i) => `
                  <button data-mood="${m.id}" class="mood-pill ${i===0?'active':''}" style="display:flex;align-items:center;gap:6px;padding:8px 16px;border-radius:99px;font-size:12px;font-weight:700;border:1.5px solid ${i===0?'#ff5e18':'#dce2f3'};background:${i===0?'#ff5e18':'#fff'};color:${i===0?'#fff':'#151c27'};cursor:pointer;white-space:nowrap;flex-shrink:0;transition:all 0.15s ease;">
                    <span>${m.emoji}</span><span>${m.label}</span>
                  </button>
                `).join('')}
              </div>
              <div id="ai-matching-dishes" style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;" class="md:grid-cols-4">
                <div style="grid-column:1/-1;padding:24px;text-align:center;color:#575e70;font-size:12px;display:flex;align-items:center;justify-content:center;gap:8px;">
                  <span class="material-symbols-outlined" style="font-size:20px;color:#ff5e18;animation:spin 1s linear infinite;">progress_activity</span>
                  <span>Curating dishes for your mood...</span>
                </div>
              </div>
            </div>
          </section>

          <!-- ══ FEATURED RESTAURANTS (HORIZONTAL SCROLL) ════════════════ -->
          <section style="margin-bottom:28px;">
            <div class="flex items-center justify-between mb-3">
              <div>
                <h2 class="section-title">Featured Near You ⚡</h2>
                <p class="section-sub">Top-rated spots on GL Bajaj campus</p>
              </div>
              <a href="#search" class="text-xs font-bold text-primary flex items-center gap-0.5">See all <span class="material-symbols-outlined text-sm">arrow_forward</span></a>
            </div>
            <div style="display:flex;gap:12px;overflow-x:auto;padding-bottom:8px;" class="scrollbar-none snap-scroll" id="featured-rest-row">
              <div style="padding:20px;color:#575e70;font-size:12px;display:flex;align-items:center;gap:6px;">
                <span class="material-symbols-outlined" style="font-size:18px;color:#ff5e18;animation:spin 1s linear infinite;">progress_activity</span>
                <span>Loading...</span>
              </div>
            </div>
          </section>

          <!-- ══ RESTAURANT FILTER + GRID ════════════════════════════════ -->
          <section style="margin-bottom:40px;" id="all-rest-section">
            <div style="margin-bottom:16px;">
              <div class="flex items-center justify-between mb-3">
                <div>
                  <h2 class="section-title" id="all-rest-heading">All Restaurants & Cafes</h2>
                  <p class="section-sub" id="all-rest-subtitle">Discover 43 authentic culinary spots</p>
                </div>
              </div>
              <!-- Filter Chips -->
              <div style="display:flex;gap:8px;overflow-x:auto;padding-bottom:6px;" class="scrollbar-none" id="home-filter-chips">
                <button class="filter-chip active home-chip" data-filter="all">All</button>
                <button class="filter-chip home-chip" data-filter="cafe" style="display:flex;align-items:center;gap:4px;"><span class="material-symbols-outlined" style="font-size:13px;color:#6366f1;">local_cafe</span>Cafes</button>
                <button class="filter-chip home-chip" data-filter="hotel" style="display:flex;align-items:center;gap:4px;"><span class="material-symbols-outlined" style="font-size:13px;color:#059669;">hotel</span>Hotels</button>
                <button class="filter-chip home-chip" data-filter="restro" style="display:flex;align-items:center;gap:4px;"><span class="material-symbols-outlined" style="font-size:13px;color:#ea580c;">restaurant</span>Restros</button>
                <button class="filter-chip home-chip" data-filter="cart" style="display:flex;align-items:center;gap:4px;"><span class="material-symbols-outlined" style="font-size:13px;color:#d97706;">storefront</span>Campus Carts</button>
                <button class="filter-chip home-chip" data-filter="south-indian">South Indian</button>
                <button class="filter-chip home-chip" data-filter="biryani">Biryani</button>
                <button class="filter-chip home-chip" data-filter="top-rated" style="display:flex;align-items:center;gap:4px;"><span class="material-symbols-outlined filled" style="font-size:13px;color:#f59e0b;">star</span>Top Rated</button>
              </div>
            </div>
            <div id="home-restaurants-container" style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px;" class="md:grid-cols-3 lg:grid-cols-4">
              ${[1,2,3,4,5,6].map(() => `
                <div class="skeleton" style="height:250px;border-radius:16px;"></div>
              `).join('')}
            </div>
          </section>

          <!-- ══ PROMO BOTTOM CTA ══════════════════════════════════════════ -->
          <section style="margin-bottom:32px;">
            <div style="background:linear-gradient(135deg,#ff5e18,#aa3700);border-radius:20px;padding:28px 24px;display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap;overflow:hidden;position:relative;">
              <div style="position:absolute;top:-40px;right:-40px;width:160px;height:160px;border-radius:50%;background:rgba(255,255,255,0.08);pointer-events:none;"></div>
              <div>
                <span style="background:rgba(255,255,255,0.2);color:#fff;font-size:10px;font-weight:800;padding:3px 12px;border-radius:99px;text-transform:uppercase;letter-spacing:0.07em;display:inline-block;margin-bottom:8px;">Special Offer</span>
                <h3 style="color:#fff;font-size:22px;font-weight:900;margin-bottom:6px;">Get 50% OFF your next order 🎉</h3>
                <p style="color:rgba(255,255,255,0.85);font-size:12px;font-weight:500;margin-bottom:14px;">Use code <strong>FOODLY50</strong> at checkout — save up to ₹100!</p>
                <a href="#offers" style="background:#fff;color:#aa3700;font-size:13px;font-weight:900;padding:10px 22px;border-radius:12px;display:inline-block;box-shadow:0 4px 12px rgba(0,0,0,0.15);">View All Deals →</a>
              </div>
              <div style="width:120px;height:120px;border-radius:16px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,0.25);flex-shrink:0;" class="hidden sm:block">
                <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=300&q=80" alt="Food" style="width:100%;height:100%;object-fit:cover;"/>
              </div>
            </div>
          </section>

        </div><!-- /max-width container -->
      </div>
    `;

    // ── Event handlers ─────────────────────────────────────────────────────
    const addressInput = document.getElementById('hero-address-input');
    if (addressInput && store) addressInput.value = store.activeAddress || '';

    initOfferCarousel();
    loadHomeData();
    bindMoodPills();

    // 3D Card Interactive Mouse Parallax
    const heroZone = document.getElementById('hero-3d-interactive-zone');
    const heroCard = document.getElementById('hero-3d-card');
    if (heroZone && heroCard) {
      heroZone.addEventListener('mousemove', (e) => {
        const rect = heroZone.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        heroCard.style.animation = 'none';
        heroCard.style.transform = `perspective(1000px) rotateY(${x * 24}deg) rotateX(${-y * 20}deg) translateY(-8px) scale(1.03)`;
      });
      heroZone.addEventListener('mouseleave', () => {
        heroCard.style.animation = 'heroCardFloat3D 5.5s ease-in-out infinite';
      });
    }
  }

  // ── Load dynamic data ──────────────────────────────────────────────────
  async function loadHomeData() {
    try {
      const restRes = await window.foodlyApi.getRestaurants();
      if (!restRes.success) return;
      const allRestaurants = restRes.data || [];

      // Featured row
      const featuredRow = document.getElementById('featured-rest-row');
      if (featuredRow) {
        const featured = allRestaurants.filter(r => r.rating >= 4.5 || r.bestseller).slice(0, 8);
        featuredRow.innerHTML = featured.length
          ? featured.map(r => renderFeaturedCard(r)).join('')
          : '<div style="padding:20px;color:#575e70;font-size:12px;">No featured spots found.</div>';
      }

      // Main grid + filter
      const restContainer = document.getElementById('home-restaurants-container');
      const allRestSection = document.getElementById('all-rest-section');
      if (restContainer && allRestSection) {
        allRestSection.classList.remove('hidden');
        let currentFilter = 'all';

        function applyFilter(filter) {
          currentFilter = filter;
          let filtered = allRestaurants;
          if (filter === 'cart')        filtered = allRestaurants.filter(r => r.type === 'food-cart');
          else if (filter === 'cafe')   filtered = allRestaurants.filter(r => r.type === 'cafe' || r.isCafe || (r.cuisines || []).some(c => c.toLowerCase().includes('cafe')));
          else if (filter === 'hotel')  filtered = allRestaurants.filter(r => (r.cuisines || []).some(c => c.toLowerCase().includes('hotel')) || r.name.toLowerCase().includes('hotel'));
          else if (filter === 'restro') filtered = allRestaurants.filter(r => r.type === 'restaurant');
          else if (filter === 'south-indian') filtered = allRestaurants.filter(r => r.cuisines.some(c => c.toLowerCase().includes('south indian') || c.toLowerCase().includes('dosa')));
          else if (filter === 'biryani') filtered = allRestaurants.filter(r => r.cuisines.some(c => c.toLowerCase().includes('biryani') || c.toLowerCase().includes('kebab')));
          else if (filter === 'top-rated') filtered = allRestaurants.filter(r => r.rating >= 4.7);

          restContainer.innerHTML = filtered.length
            ? filtered.map(r => renderRestaurantCard(r)).join('')
            : '<div style="grid-column:1/-1;padding:40px;text-align:center;color:#575e70;font-size:13px;font-weight:600;">No restaurants found for this filter.</div>';

          // Chips
          document.querySelectorAll('.home-chip').forEach(btn => {
            if (btn.dataset.filter === filter) {
              btn.classList.add('active');
            } else {
              btn.classList.remove('active');
            }
          });
        }

        document.querySelectorAll('.home-chip').forEach(btn => {
          btn.addEventListener('click', () => applyFilter(btn.dataset.filter));
        });
        applyFilter('all');
      }

      // Load AI mood dishes (initial)
      loadAiMoodDishes('late_night');

    } catch (e) {
      console.error('Error loading home data', e);
    }
  }

  // ── AI Mood Dish Loader ────────────────────────────────────────────────
  async function loadAiMoodDishes(mood) {
    const container = document.getElementById('ai-matching-dishes');
    if (!container) return;
    container.innerHTML = `<div style="grid-column:1/-1;padding:24px;text-align:center;color:#575e70;font-size:12px;display:flex;align-items:center;justify-content:center;gap:8px;"><span class="material-symbols-outlined" style="font-size:20px;color:#ff5e18;animation:spin 1s linear infinite;">progress_activity</span><span>Curating dishes for your mood...</span></div>`;
    try {
      const res = await window.foodlyApi.getAiMoodMatcher(mood);
      if (!res.success || !res.data || res.data.length === 0) {
        container.innerHTML = `<div style="grid-column:1/-1;padding:16px;text-align:center;color:#575e70;font-size:12px;">No exact dishes found. Try another vibe!</div>`;
        return;
      }
      container.style.gridTemplateColumns = 'repeat(2,1fr)';
      container.innerHTML = res.data.slice(0, 4).map(item => `
        <div style="background:#f9f9ff;border-radius:14px;overflow:hidden;border:1px solid #dce2f3;transition:box-shadow 0.2s ease;" class="card-shadow">
          <div style="position:relative;height:110px;">
            <img src="${item.dish.image}" alt="${item.dish.name}" style="width:100%;height:100%;object-fit:cover;" loading="lazy"
              onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'"/>
            <span style="position:absolute;top:6px;left:6px;background:rgba(0,0,0,0.6);color:#fff;font-size:9px;font-weight:800;padding:2px 7px;border-radius:99px;">🔥 ${item.dish.nutrition ? item.dish.nutrition.calories : 350} kcal</span>
            <span style="position:absolute;top:6px;right:6px;background:#059669;color:#fff;font-size:9px;font-weight:800;padding:2px 7px;border-radius:99px;">${item.dish.nutrition ? item.dish.nutrition.protein : 22}g P</span>
          </div>
          <div style="padding:10px;">
            <h4 style="font-size:12px;font-weight:800;color:#151c27;line-clamp:1;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;">${item.dish.name}</h4>
            <p style="font-size:10px;color:#575e70;font-weight:600;margin-top:2px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;">${item.restaurant.name}</p>
            <p style="font-size:10px;color:#aa3700;font-style:italic;font-weight:600;margin-top:2px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;">${item.matchReason}</p>
            <div style="display:flex;align-items:center;justify-content:space-between;margin-top:10px;">
              <span style="font-size:14px;font-weight:900;color:#aa3700;">₹${item.dish.price}</span>
              <button data-dish-json='${JSON.stringify(item.dish).replace(/'/g,"&apos;")}' data-rest-json='${JSON.stringify(item.restaurant).replace(/'/g,"&apos;")}' class="ai-dish-add-btn add-btn" style="padding:5px 12px;font-size:11px;">+ Add</button>
            </div>
          </div>
        </div>
      `).join('');

      container.querySelectorAll('.ai-dish-add-btn').forEach(b => {
        b.addEventListener('click', () => {
          try {
            const d = JSON.parse(b.getAttribute('data-dish-json').replace(/&apos;/g, "'"));
            const r = JSON.parse(b.getAttribute('data-rest-json').replace(/&apos;/g, "'"));
            window.foodlyStore.addToCart(d, r);
          } catch(e) { console.error(e); }
        });
      });
    } catch (err) {
      console.error('AI mood error', err);
      container.innerHTML = `<div style="grid-column:1/-1;padding:16px;text-align:center;color:#575e70;font-size:12px;">Could not load AI suggestions right now.</div>`;
    }
  }

  // ── Mood pill bindings ──────────────────────────────────────────────────
  function bindMoodPills() {
    document.querySelectorAll('.mood-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.mood-pill').forEach(p => {
          p.style.background = '#fff';
          p.style.borderColor = '#dce2f3';
          p.style.color = '#151c27';
        });
        pill.style.background = '#ff5e18';
        pill.style.borderColor = '#ff5e18';
        pill.style.color = '#fff';
        loadAiMoodDishes(pill.dataset.mood);
      });
    });
  }

  // ── Offer Carousel Slider Controller ─────────────────────────────────────
  let offerSlideTimer = null;
  function initOfferCarousel() {
    const track = document.getElementById('offer-carousel-track');
    const viewport = document.getElementById('offer-carousel-viewport');
    const dots = document.querySelectorAll('.offer-carousel-dot');
    if (!track || !viewport) return;

    if (offerSlideTimer) {
      clearInterval(offerSlideTimer);
      offerSlideTimer = null;
    }

    let currentIndex = 0;
    const totalSlides = OFFERS.length;

    function goToSlide(index) {
      currentIndex = (index + totalSlides) % totalSlides;
      track.style.transition = 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)';
      track.style.transform = `translateX(-${currentIndex * 100}%)`;

      dots.forEach((dot, idx) => {
        if (idx === currentIndex) {
          dot.style.width = '24px';
          dot.style.background = '#ff5e18';
        } else {
          dot.style.width = '8px';
          dot.style.background = '#dce2f3';
        }
      });
    }

    dots.forEach(dot => {
      dot.onclick = (e) => {
        e.stopPropagation();
        const idx = parseInt(dot.dataset.idx, 10);
        goToSlide(idx);
      };
    });

    // Automatically moves continuously on its own (never paused by cursor hover or touch)
    offerSlideTimer = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 2800);
  }

  window.renderHomeView = renderHomeView;
})();
