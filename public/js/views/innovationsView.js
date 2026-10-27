// public/js/views/innovationsView.js - Campus Innovations Hub & GL Bajaj Features
(function () {
  function renderInnovationsView(container) {
    // Read or initialize persistent state
    const coins = parseInt(localStorage.getItem('foodly_coins') || '180', 10);
    const calorieGoal = parseInt(localStorage.getItem('foodly_calorie_goal') || '2200', 10);
    const todayKey = new Date().toISOString().slice(0, 10);
    const todayCals = parseInt(localStorage.getItem(`foodly_cals_${todayKey}`) || '1380', 10);
    const todayProtein = parseInt(localStorage.getItem(`foodly_prot_${todayKey}`) || '54', 10);
    const scheduledOrders = JSON.parse(localStorage.getItem('foodly_scheduled') || '[]');
    const ecoOrders = parseInt(localStorage.getItem('foodly_eco_orders') || '8', 10);

    const calPercent = Math.min(100, Math.round((todayCals / calorieGoal) * 100));
    const circumference = 2 * Math.PI * 45; // r=45
    const strokeDashoffset = circumference - (calPercent / 100) * circumference;

    // User Tier
    let tier = 'Silver';
    let tierColor = 'text-slate-300';
    let nextTierCoins = 500;
    if (coins >= 1000) { tier = 'Platinum'; tierColor = 'text-cyan-300'; nextTierCoins = 1000; }
    else if (coins >= 500) { tier = 'Gold'; tierColor = 'text-amber-400'; nextTierCoins = 1000; }
    else if (coins >= 200) { tier = 'Silver'; tierColor = 'text-slate-300'; nextTierCoins = 500; }
    else { tier = 'Bronze'; tierColor = 'text-amber-600'; nextTierCoins = 200; }

    container.innerHTML = `
      <div class="fade-in max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8">
        
        <!-- Header Banner with 3D styling -->
        <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 border border-purple-500/30 p-8 md:p-12 mb-10 shadow-2xl text-white">
          <div class="absolute -right-10 -bottom-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
          <div class="absolute -left-10 -top-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
          
          <div class="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 text-xs font-extrabold uppercase tracking-wider mb-4">
                <span class="material-symbols-outlined text-sm">auto_awesome</span>
                <span>GL Bajaj Campus Innovation Lab</span>
              </div>
              <h1 class="text-3xl md:text-5xl font-black tracking-tight mb-3">
                Smart Campus <span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400">Innovations</span>
              </h1>
              <p class="text-slate-300 max-w-xl text-sm md:text-base leading-relaxed">
                6 cutting-edge solutions built specifically for GL Bajaj students — from zero-delivery fee lecture batch pools to AI mood matching and daily hostel nutrition tracking.
              </p>
            </div>

            <!-- Quick Coins Card -->
            <div class="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 shrink-0 flex items-center gap-4 card-3d">
              <div class="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-inner">
                <span class="material-symbols-outlined text-3xl filled">toll</span>
              </div>
              <div>
                <div class="text-xs uppercase font-extrabold text-amber-300 tracking-wider flex items-center gap-1.5">
                  <span>Foodly Coins</span>
                  <span class="px-2 py-0.2 rounded-full bg-amber-500/30 text-[10px] ${tierColor} font-black">${tier} Tier</span>
                </div>
                <div class="text-3xl font-black text-white flex items-center gap-1">
                  <span id="current-coins-display">${coins}</span>
                  <span class="text-xs text-slate-400 font-normal">pts</span>
                </div>
                <div class="text-[11px] text-slate-300">
                  ${Math.max(0, nextTierCoins - coins)} pts to next tier
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 6 Innovation Cards Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          <!-- INNOVATION 1: Lecture Break Pre-Scheduling -->
          <div class="bg-surface-container-lowest rounded-3xl p-6 md:p-8 border border-surface-variant/60 shadow-lg flex flex-col justify-between card-3d">
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <span class="material-symbols-outlined text-2xl">schedule</span>
                  </div>
                  <div>
                    <h2 class="text-xl font-black text-on-surface">Lecture Break Pre-Scheduler</h2>
                    <p class="text-xs text-secondary font-semibold">Zero-Wait Delivery Right at Bell Ring</p>
                  </div>
                </div>
                <span class="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">+10 Coins</span>
              </div>
              <p class="text-xs text-on-surface-variant mb-6 leading-relaxed">
                Order before class starts. Kitchen prepares in sync with your lecture timetable and delivers directly to your specific block zone right when your teacher dismisses class.
              </p>

              <!-- Slot Selector -->
              <div class="space-y-4 mb-6">
                <div>
                  <label class="block text-xs font-black uppercase text-secondary tracking-wider mb-2">Select College Timetable Slot</label>
                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-2" id="schedule-slots-group">
                    <button type="button" data-slot="10:50 AM Short Break" class="schedule-slot-btn px-3 py-2.5 rounded-xl border-2 border-primary bg-primary/10 text-primary text-xs font-bold transition-all text-center">
                      10:50 AM<br/><span class="text-[10px] font-medium">Tea Break</span>
                    </button>
                    <button type="button" data-slot="01:15 PM Lunch Break" class="schedule-slot-btn px-3 py-2.5 rounded-xl border border-surface-variant bg-surface-container-low hover:border-primary text-on-surface text-xs font-bold transition-all text-center">
                      01:15 PM<br/><span class="text-[10px] font-medium">Lunch Break</span>
                    </button>
                    <button type="button" data-slot="03:30 PM Evening Break" class="schedule-slot-btn px-3 py-2.5 rounded-xl border border-surface-variant bg-surface-container-low hover:border-primary text-on-surface text-xs font-bold transition-all text-center">
                      03:30 PM<br/><span class="text-[10px] font-medium">Snack Time</span>
                    </button>
                    <button type="button" data-slot="05:00 PM Post-Class" class="schedule-slot-btn px-3 py-2.5 rounded-xl border border-surface-variant bg-surface-container-low hover:border-primary text-on-surface text-xs font-bold transition-all text-center">
                      05:00 PM<br/><span class="text-[10px] font-medium">Campus Gate</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-black uppercase text-secondary tracking-wider mb-2">GL Bajaj Delivery Zone</label>
                  <select id="schedule-zone-select" class="w-full bg-surface-container-low border border-surface-variant rounded-xl py-2.5 px-3 text-xs font-bold text-on-surface focus:border-primary outline-none">
                    <option value="Mechanical Block - Lawn Bench Area">Mechanical Block — Lawn Bench Area</option>
                    <option value="CS & IT Lab Block - Ground Floor Gazebo">CS & IT Lab Block — Ground Floor Gazebo</option>
                    <option value="Main Auditorium Gate 1 - Waiting Point">Main Auditorium Gate 1 — Waiting Point</option>
                    <option value="Boys Hostel 1 & 2 - Security Post">Boys Hostel 1 & 2 — Security Post</option>
                    <option value="Girls Hostel Gate - Verification Desk">Girls Hostel Gate — Verification Desk</option>
                    <option value="Central Library Steps">Central Library Steps</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-black uppercase text-secondary tracking-wider mb-2">Order Notes / Roll No.</label>
                  <input id="schedule-notes" type="text" placeholder="e.g. Roll No. 42, B.Tech CSE 3rd Year" class="w-full bg-surface-container-low border border-surface-variant rounded-xl py-2 px-3 text-xs text-on-surface placeholder:text-secondary outline-none focus:border-primary" />
                </div>
              </div>
            </div>

            <div>
              <button id="save-schedule-btn" class="w-full bg-primary hover:bg-primary/90 text-white font-extrabold py-3 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 text-xs">
                <span class="material-symbols-outlined text-base">alarm_on</span>
                <span>Lock Schedule Slot (+10 Coins)</span>
              </button>
              <div id="scheduled-summary" class="mt-3 text-center text-xs font-semibold text-tertiary ${scheduledOrders.length > 0 ? '' : 'hidden'}">
                Active Slot: <span class="font-extrabold" id="active-slot-text">${scheduledOrders[0]?.slot || ''}</span> at <span id="active-zone-text">${scheduledOrders[0]?.zone || ''}</span>
              </div>
            </div>
          </div>

          <!-- INNOVATION 2: AI Mood & Craving Matcher -->
          <div class="bg-surface-container-lowest rounded-3xl p-6 md:p-8 border border-surface-variant/60 shadow-lg flex flex-col justify-between card-3d">
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600">
                    <span class="material-symbols-outlined text-2xl">psychology</span>
                  </div>
                  <div>
                    <h2 class="text-xl font-black text-on-surface">AI Mood & Craving Matcher</h2>
                    <p class="text-xs text-secondary font-semibold">Gemini Neuro-Food Recommendation Engine</p>
                  </div>
                </div>
                <span class="px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-black">AI Live</span>
              </div>
              <p class="text-xs text-on-surface-variant mb-6 leading-relaxed">
                Feeling burnt out from coding or prepping for sessional exams? Tap your vibe and our neural engine pairs your current neurotransmitter state with campus meals.
              </p>

              <!-- Mood Chips -->
              <div class="flex flex-wrap gap-2 mb-6" id="mood-chips-container">
                <button type="button" data-mood="stress" class="mood-pill-btn px-3 py-1.5 rounded-full border border-purple-300 bg-purple-50 text-purple-700 text-xs font-bold hover:bg-purple-100 transition-all flex items-center gap-1.5">
                  <span>🤯</span> <span>Stress Buster</span>
                </button>
                <button type="button" data-mood="exam" class="mood-pill-btn px-3 py-1.5 rounded-full border border-amber-300 bg-amber-50 text-amber-800 text-xs font-bold hover:bg-amber-100 transition-all flex items-center gap-1.5">
                  <span>📚</span> <span>Exam Fuel</span>
                </button>
                <button type="button" data-mood="comfort" class="mood-pill-btn px-3 py-1.5 rounded-full border border-pink-300 bg-pink-50 text-pink-700 text-xs font-bold hover:bg-pink-100 transition-all flex items-center gap-1.5">
                  <span>🍕</span> <span>Comfort Cheesy</span>
                </button>
                <button type="button" data-mood="gym" class="mood-pill-btn px-3 py-1.5 rounded-full border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-all flex items-center gap-1.5">
                  <span>💪</span> <span>High Protein</span>
                </button>
                <button type="button" data-mood="latenight" class="mood-pill-btn px-3 py-1.5 rounded-full border border-indigo-300 bg-indigo-50 text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition-all flex items-center gap-1.5">
                  <span>🌙</span> <span>Late Night Craving</span>
                </button>
              </div>

              <!-- Recommendation Card -->
              <div id="ai-mood-result-card" class="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-4 mb-4">
                <div class="flex items-start justify-between gap-3">
                  <div class="flex items-center gap-3">
                    <span class="text-3xl" id="ai-dish-emoji">☕</span>
                    <div>
                      <div class="text-[11px] font-black uppercase text-purple-600 tracking-wider" id="ai-mood-reason">Dopamine & Energy Reboot</div>
                      <div class="text-sm font-black text-on-surface" id="ai-dish-title">Filter Coffee & Hot Brownie</div>
                      <div class="text-xs text-secondary font-medium" id="ai-dish-rest">Café Coffee Day • ₹140</div>
                    </div>
                  </div>
                  <button id="ai-add-to-cart-btn" class="bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold px-3 py-1.5 rounded-xl shadow-sm transition-all active:scale-95 shrink-0 flex items-center gap-1">
                    <span class="material-symbols-outlined text-sm">add_shopping_cart</span>
                    <span>Order</span>
                  </button>
                </div>
              </div>
            </div>

            <div class="text-center mt-3">
              <button onclick="window.openFoodlyAiAssistant ? window.openFoodlyAiAssistant() : null" class="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all active:scale-95">
                <span class="material-symbols-outlined text-sm animate-pulse">auto_awesome</span>
                <span>Launch Interactive Gemini AI Food Assistant</span>
              </button>
              <span class="text-[10px] text-secondary font-medium block mt-1.5">Powered by Google Gemini 1.5 Flash & Offline Neural Matcher</span>
            </div>
          </div>

          <!-- INNOVATION 3: Student Nutrition & Calorie Ring -->
          <div class="bg-surface-container-lowest rounded-3xl p-6 md:p-8 border border-surface-variant/60 shadow-lg flex flex-col justify-between card-3d">
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
                    <span class="material-symbols-outlined text-2xl">monitoring</span>
                  </div>
                  <div>
                    <h2 class="text-xl font-black text-on-surface">Daily Hostel Nutrition Tracker</h2>
                    <p class="text-xs text-secondary font-semibold">Automatic Macro Calculation on Every Bite</p>
                  </div>
                </div>
                <span class="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">+5 Coins/Log</span>
              </div>
              <p class="text-xs text-on-surface-variant mb-6 leading-relaxed">
                Hostel mess food makes tracking protein difficult. Foodly calculates calories, protein, and carbs for every ordered dish and updates your daily intake ring automatically.
              </p>

              <!-- Progress Ring & Macros -->
              <div class="flex flex-col sm:flex-row items-center justify-center gap-8 mb-6">
                <!-- SVG Calorie Ring -->
                <div class="relative w-32 h-32 shrink-0">
                  <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" stroke="#e2e8f0" stroke-width="8" fill="transparent"></circle>
                    <circle cx="50" cy="50" r="45" stroke="#006c4a" stroke-width="8" stroke-linecap="round" fill="transparent"
                      stroke-dasharray="${circumference}"
                      stroke-dashoffset="${strokeDashoffset}"
                      class="transition-all duration-1000 ease-out"
                    ></circle>
                  </svg>
                  <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span class="text-xl font-black text-on-surface" id="daily-cals-count">${todayCals}</span>
                    <span class="text-[10px] font-extrabold uppercase text-secondary">/ ${calorieGoal} kcal</span>
                  </div>
                </div>

                <!-- Macro Bars -->
                <div class="w-full space-y-3">
                  <div>
                    <div class="flex justify-between text-xs font-bold text-on-surface mb-1">
                      <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-emerald-500"></span> Protein</span>
                      <span id="protein-stat">${todayProtein}g / 75g</span>
                    </div>
                    <div class="w-full h-2 rounded-full bg-surface-container-high overflow-hidden">
                      <div class="h-full bg-emerald-500 rounded-full" style="width: ${Math.min(100, Math.round((todayProtein/75)*100))}%;"></div>
                    </div>
                  </div>
                  <div>
                    <div class="flex justify-between text-xs font-bold text-on-surface mb-1">
                      <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-amber-500"></span> Carbs</span>
                      <span>165g / 240g</span>
                    </div>
                    <div class="w-full h-2 rounded-full bg-surface-container-high overflow-hidden">
                      <div class="h-full bg-amber-500 rounded-full" style="width: 68%;"></div>
                    </div>
                  </div>
                  <div>
                    <div class="flex justify-between text-xs font-bold text-on-surface mb-1">
                      <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-cyan-500"></span> Healthy Fats</span>
                      <span>38g / 60g</span>
                    </div>
                    <div class="w-full h-2 rounded-full bg-surface-container-high overflow-hidden">
                      <div class="h-full bg-cyan-500 rounded-full" style="width: 63%;"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex gap-2">
              <button id="quick-log-salad-btn" class="flex-1 bg-surface-container-low hover:bg-surface-container border border-surface-variant/80 rounded-xl py-2 px-3 text-xs font-bold text-on-surface transition-all active:scale-95 flex items-center justify-center gap-1">
                <span class="material-symbols-outlined text-sm text-tertiary">add_circle</span>
                <span>Log Protein Shake (+25g)</span>
              </button>
              <button id="reset-cals-btn" class="bg-surface-container-low hover:bg-surface-container border border-surface-variant/80 rounded-xl py-2 px-3 text-xs font-bold text-secondary transition-all" title="Reset Today's Log">
                <span class="material-symbols-outlined text-sm">restart_alt</span>
              </button>
            </div>
          </div>

          <!-- INNOVATION 4: Eco Carbon Batch Pooling -->
          <div class="bg-surface-container-lowest rounded-3xl p-6 md:p-8 border border-surface-variant/60 shadow-lg flex flex-col justify-between card-3d">
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600">
                    <span class="material-symbols-outlined text-2xl">eco</span>
                  </div>
                  <div>
                    <h2 class="text-xl font-black text-on-surface">Eco Batch Delivery Tracker</h2>
                    <p class="text-xs text-secondary font-semibold">Green Campus Carbon Neutral Deliveries</p>
                  </div>
                </div>
                <span class="px-2.5 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-black">73% Less CO₂</span>
              </div>
              <p class="text-xs text-on-surface-variant mb-6 leading-relaxed">
                Instead of 10 delivery bikes rushing to GL Bajaj gates every 5 minutes, our routing batch engine combines orders into 1 single electric trip, eliminating traffic and emission.
              </p>

              <!-- Eco Stats Grid -->
              <div class="grid grid-cols-3 gap-3 mb-6">
                <div class="bg-teal-50/60 border border-teal-200/80 rounded-2xl p-3 text-center">
                  <span class="text-2xl font-black text-teal-700 block" id="eco-saved-kg">${(ecoOrders * 0.42).toFixed(1)}</span>
                  <span class="text-[10px] font-black uppercase text-teal-800 tracking-wider">Kg CO₂ Saved</span>
                </div>
                <div class="bg-teal-50/60 border border-teal-200/80 rounded-2xl p-3 text-center">
                  <span class="text-2xl font-black text-teal-700 block" id="eco-orders-count">${ecoOrders}</span>
                  <span class="text-[10px] font-black uppercase text-teal-800 tracking-wider">Pooled Trips</span>
                </div>
                <div class="bg-teal-50/60 border border-teal-200/80 rounded-2xl p-3 text-center">
                  <span class="text-2xl font-black text-teal-700 block">₹0</span>
                  <span class="text-[10px] font-black uppercase text-teal-800 tracking-wider">Delivery Fee</span>
                </div>
              </div>

              <!-- Campus Pool Progress Bar -->
              <div class="bg-surface-container-low border border-surface-variant rounded-2xl p-4">
                <div class="flex items-center justify-between text-xs font-bold text-on-surface mb-2">
                  <span class="flex items-center gap-1.5 text-teal-700">
                    <span class="material-symbols-outlined text-base animate-pulse">electric_moped</span>
                    <span>Next Batch Leaving Knowledge Park III</span>
                  </span>
                  <span class="font-extrabold text-teal-800">14 min window</span>
                </div>
                <div class="w-full h-2.5 rounded-full bg-surface-container-high overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full animate-pulse" style="width: 78%;"></div>
                </div>
                <div class="text-[11px] text-secondary mt-2 flex justify-between">
                  <span>Pool Threshold: 5+ orders (8 joined)</span>
                  <span class="text-emerald-700 font-bold">✓ Free Delivery Unlocked</span>
                </div>
              </div>
            </div>

            <div class="mt-4">
              <a href="#search" class="w-full bg-teal-700 hover:bg-teal-800 text-white font-extrabold py-3 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 text-xs">
                <span class="material-symbols-outlined text-base">join_inner</span>
                <span>Join Current Campus Batch Order</span>
              </a>
            </div>
          </div>
        </div>

        <!-- INNOVATION 5: Foodly Coins Rewards Store -->
        <div class="bg-gradient-to-br from-amber-950 via-slate-900 to-amber-950 text-white rounded-3xl p-8 mb-12 border border-amber-500/30 shadow-2xl">
          <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-extrabold uppercase tracking-wider mb-2">
                <span class="material-symbols-outlined text-sm">stars</span>
                <span>Foodly Loyalty Vault</span>
              </div>
              <h2 class="text-2xl md:text-3xl font-black">Redeem Campus Rewards</h2>
              <p class="text-slate-300 text-xs md:text-sm">Earn 1 Coin for every ₹10 spent, +10 for scheduled orders, +15 for eco batch pools.</p>
            </div>

            <div class="flex items-center gap-3">
              <button id="claim-daily-coin-btn" class="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-1.5">
                <span class="material-symbols-outlined text-base">redeem</span>
                <span>Claim Daily +25 Bonus</span>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Reward 1 -->
            <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-3">
                  <span class="text-2xl">🎟️</span>
                  <span class="px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-extrabold border border-amber-400/30">100 Coins</span>
                </div>
                <h3 class="font-extrabold text-base text-white mb-1">FLAT ₹50 OFF Meal Coupon</h3>
                <p class="text-xs text-slate-300 mb-4">Valid on orders above ₹199 from any cafeteria or partner restaurant.</p>
              </div>
              <button data-cost="100" data-code="CAMPUS50" class="redeem-reward-btn w-full bg-white/20 hover:bg-white/30 text-white text-xs font-bold py-2 rounded-xl transition-all border border-white/30">
                Redeem for 100 Coins
              </button>
            </div>

            <!-- Reward 2 -->
            <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-3">
                  <span class="text-2xl">🥤</span>
                  <span class="px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-extrabold border border-amber-400/30">80 Coins</span>
                </div>
                <h3 class="font-extrabold text-base text-white mb-1">Free Iced Coffee / Chai</h3>
                <p class="text-xs text-slate-300 mb-4">Claim 1 free beverage at Café Coffee Day or Campus Kiosk.</p>
              </div>
              <button data-cost="80" data-code="FREECHAI" class="redeem-reward-btn w-full bg-white/20 hover:bg-white/30 text-white text-xs font-bold py-2 rounded-xl transition-all border border-white/30">
                Redeem for 80 Coins
              </button>
            </div>

            <!-- Reward 3 -->
            <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-3">
                  <span class="text-2xl">⚡</span>
                  <span class="px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-extrabold border border-amber-400/30">150 Coins</span>
                </div>
                <h3 class="font-extrabold text-base text-white mb-1">Priority VIP Delivery Pass</h3>
                <p class="text-xs text-slate-300 mb-4">First-drop priority during busy 1:15 PM lunch break rush.</p>
              </div>
              <button data-cost="150" data-code="VIAPASS" class="redeem-reward-btn w-full bg-white/20 hover:bg-white/30 text-white text-xs font-bold py-2 rounded-xl transition-all border border-white/30">
                Redeem for 150 Coins
              </button>
            </div>
          </div>
        </div>

        <!-- INNOVATION 6: GL Bajaj vs Swiggy vs Zomato Comparison Matrix -->
        <div class="bg-surface-container-lowest rounded-3xl p-6 md:p-8 border border-surface-variant/60 shadow-lg">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <span class="material-symbols-outlined text-2xl">balance</span>
            </div>
            <div>
              <h2 class="text-xl font-black text-on-surface">Why Foodly Wins Over Swiggy & Zomato</h2>
              <p class="text-xs text-secondary font-semibold">Purpose-Built for College Hostels & Knowledge Park III Students</p>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs border-collapse">
              <thead>
                <tr class="border-b border-surface-variant text-secondary font-extrabold uppercase">
                  <th class="py-3 px-4">Feature / Fee</th>
                  <th class="py-3 px-4 text-primary bg-primary/5 rounded-t-xl font-black">Foodly (GL Bajaj)</th>
                  <th class="py-3 px-4">Swiggy</th>
                  <th class="py-3 px-4">Zomato</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-surface-variant/40 font-medium text-on-surface">
                <tr>
                  <td class="py-3 px-4 font-bold">Platform Fee</td>
                  <td class="py-3 px-4 text-emerald-700 font-extrabold bg-primary/5">₹0 Forever</td>
                  <td class="py-3 px-4 text-red-600">₹6 - ₹10 per order</td>
                  <td class="py-3 px-4 text-red-600">₹6 - ₹11 per order</td>
                </tr>
                <tr>
                  <td class="py-3 px-4 font-bold">Rain / Midnight Surge</td>
                  <td class="py-3 px-4 text-emerald-700 font-extrabold bg-primary/5">₹0 (Zero Surge Policy)</td>
                  <td class="py-3 px-4 text-red-600">₹30 - ₹75 surge</td>
                  <td class="py-3 px-4 text-red-600">₹25 - ₹80 surge</td>
                </tr>
                <tr>
                  <td class="py-3 px-4 font-bold">Hostel Verification Delivery</td>
                  <td class="py-3 px-4 text-emerald-700 font-extrabold bg-primary/5">Direct Gate & Block Zones</td>
                  <td class="py-3 px-4 text-secondary">Outside Main Highway Gate</td>
                  <td class="py-3 px-4 text-secondary">Outside Main Highway Gate</td>
                </tr>
                <tr>
                  <td class="py-3 px-4 font-bold">Group Order UPI Bill Split</td>
                  <td class="py-3 px-4 text-emerald-700 font-extrabold bg-primary/5">Built-in Multi-Payer Room</td>
                  <td class="py-3 px-4 text-secondary">Single Payer Only</td>
                  <td class="py-3 px-4 text-secondary">Single Payer Only</td>
                </tr>
                <tr>
                  <td class="py-3 px-4 font-bold">Timetable Lecture Scheduling</td>
                  <td class="py-3 px-4 text-emerald-700 font-extrabold bg-primary/5">Synced to College Bell</td>
                  <td class="py-3 px-4 text-secondary">Generic 45-min ETA</td>
                  <td class="py-3 px-4 text-secondary">Generic 45-min ETA</td>
                </tr>
                <tr>
                  <td class="py-3 px-4 font-bold">Daily Nutrition & Calories</td>
                  <td class="py-3 px-4 text-emerald-700 font-extrabold bg-primary/5">Automatic Hostel Macro Ring</td>
                  <td class="py-3 px-4 text-secondary">None</td>
                  <td class="py-3 px-4 text-secondary">None</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;

    // Hook Events

    // 1. Timetable Slot Buttons
    const slotBtns = container.querySelectorAll('.schedule-slot-btn');
    let selectedSlot = '10:50 AM Short Break';
    slotBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        slotBtns.forEach(b => {
          b.classList.remove('border-primary', 'bg-primary/10', 'text-primary', 'border-2');
          b.classList.add('border-surface-variant', 'bg-surface-container-low', 'text-on-surface', 'border');
        });
        btn.classList.add('border-primary', 'bg-primary/10', 'text-primary', 'border-2');
        btn.classList.remove('border-surface-variant', 'bg-surface-container-low', 'text-on-surface', 'border');
        selectedSlot = btn.dataset.slot;
      });
    });

    // 2. Lock Schedule Button
    const saveScheduleBtn = container.querySelector('#save-schedule-btn');
    if (saveScheduleBtn) {
      saveScheduleBtn.addEventListener('click', () => {
        const zone = container.querySelector('#schedule-zone-select').value;
        const notes = container.querySelector('#schedule-notes').value.trim();
        const newSchedule = { slot: selectedSlot, zone, notes, timestamp: Date.now() };
        
        const existing = JSON.parse(localStorage.getItem('foodly_scheduled') || '[]');
        existing.unshift(newSchedule);
        localStorage.setItem('foodly_scheduled', JSON.stringify(existing.slice(0, 5)));

        // Reward 10 coins
        const currentCoins = parseInt(localStorage.getItem('foodly_coins') || '180', 10) + 10;
        localStorage.setItem('foodly_coins', currentCoins.toString());
        container.querySelector('#current-coins-display').textContent = currentCoins;

        window.foodlyStore.showToast(`Slot locked for ${selectedSlot}! +10 Foodly Coins awarded!`, 'success');
        
        container.querySelector('#scheduled-summary').classList.remove('hidden');
        container.querySelector('#active-slot-text').textContent = selectedSlot;
        container.querySelector('#active-zone-text').textContent = zone.split('—')[0].trim();
      });
    }

    // 3. AI Mood Chips
    const moodPresets = {
      stress: { emoji: '☕', reason: 'Cortisol Reducing Warm Tryptophan', dish: 'Filter Coffee & Hot Brownie', rest: 'Café Coffee Day • ₹140', id: 4 },
      exam: { emoji: '🧠', reason: 'Choline & High Omega Mental Clarity', dish: 'Paneer Tikka Roll & Badam Milk', rest: 'Rolls King • ₹180', id: 2 },
      comfort: { emoji: '🍕', reason: 'High Serotonin Cheesy Comfort', dish: 'Double Cheese Margherita Pizza', rest: 'Pizza Hut Express • ₹299', id: 1 },
      gym: { emoji: '💪', reason: '38g Clean Protein Lean Fuel', dish: 'Grilled Chicken / Soya Protein Bowl', rest: 'Subway Fresh • ₹240', id: 5 },
      latenight: { emoji: '🌙', reason: 'Instant Warm Hostel Night Carb Fix', dish: 'Butter Maggi & Cold Coffee', rest: 'Campus Night Kiosk • ₹90', id: 3 }
    };

    const moodBtns = container.querySelectorAll('.mood-pill-btn');
    moodBtns.forEach(btn => {
      btn.addEventListener('click', async () => {
        const mood = btn.dataset.mood;
        const preset = moodPresets[mood] || moodPresets.stress;
        
        container.querySelector('#ai-dish-emoji').textContent = preset.emoji;
        container.querySelector('#ai-mood-reason').textContent = preset.reason;
        container.querySelector('#ai-dish-title').textContent = preset.dish;
        container.querySelector('#ai-dish-rest').textContent = preset.rest;

        window.foodlyStore.showToast(`AI matched neural mood: ${preset.reason}`, 'info');
      });
    });

    const aiAddBtn = container.querySelector('#ai-add-to-cart-btn');
    if (aiAddBtn) {
      aiAddBtn.addEventListener('click', () => {
        const dishTitle = container.querySelector('#ai-dish-title').textContent;
        window.foodlyStore.addToCart({
          id: 'ai-dish-' + Date.now(),
          name: dishTitle,
          price: 150,
          restaurantId: 1,
          restaurantName: 'GL Bajaj Partner Kitchen',
          isVeg: true,
          calories: 380,
          protein: 18
        });
        window.foodlyStore.showToast(`Added ${dishTitle} to cart!`, 'success');
      });
    }

    // 4. Quick Nutrition Logger
    const logSaladBtn = container.querySelector('#quick-log-salad-btn');
    if (logSaladBtn) {
      logSaladBtn.addEventListener('click', () => {
        const cals = parseInt(localStorage.getItem(`foodly_cals_${todayKey}`) || '1380', 10) + 180;
        const prot = parseInt(localStorage.getItem(`foodly_prot_${todayKey}`) || '54', 10) + 25;
        localStorage.setItem(`foodly_cals_${todayKey}`, cals.toString());
        localStorage.setItem(`foodly_prot_${todayKey}`, prot.toString());

        // +5 coins
        const currentCoins = parseInt(localStorage.getItem('foodly_coins') || '180', 10) + 5;
        localStorage.setItem('foodly_coins', currentCoins.toString());
        container.querySelector('#current-coins-display').textContent = currentCoins;

        container.querySelector('#daily-cals-count').textContent = cals;
        container.querySelector('#protein-stat').textContent = `${prot}g / 75g`;
        window.foodlyStore.showToast('Protein logged (+25g)! +5 Foodly Coins earned!', 'success');
      });
    }

    const resetCalsBtn = container.querySelector('#reset-cals-btn');
    if (resetCalsBtn) {
      resetCalsBtn.addEventListener('click', () => {
        localStorage.setItem(`foodly_cals_${todayKey}`, '0');
        localStorage.setItem(`foodly_prot_${todayKey}`, '0');
        container.querySelector('#daily-cals-count').textContent = '0';
        container.querySelector('#protein-stat').textContent = '0g / 75g';
        window.foodlyStore.showToast("Today's calories reset", 'info');
      });
    }

    // 5. Claim Daily Bonus
    const claimDailyBtn = container.querySelector('#claim-daily-coin-btn');
    if (claimDailyBtn) {
      claimDailyBtn.addEventListener('click', () => {
        const lastClaim = localStorage.getItem('foodly_last_daily_claim');
        if (lastClaim === todayKey) {
          window.foodlyStore.showToast("You've already claimed your daily 25 bonus coins today! Check back tomorrow.", 'info');
          return;
        }
        localStorage.setItem('foodly_last_daily_claim', todayKey);
        const currentCoins = parseInt(localStorage.getItem('foodly_coins') || '180', 10) + 25;
        localStorage.setItem('foodly_coins', currentCoins.toString());
        container.querySelector('#current-coins-display').textContent = currentCoins;
        window.foodlyStore.showToast('🎉 +25 Foodly Daily Bonus Coins added to your vault!', 'success');
      });
    }

    // 6. Redeem Reward Buttons
    const redeemBtns = container.querySelectorAll('.redeem-reward-btn');
    redeemBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const cost = parseInt(btn.dataset.cost, 10);
        const code = btn.dataset.code;
        let currentCoins = parseInt(localStorage.getItem('foodly_coins') || '180', 10);

        if (currentCoins < cost) {
          window.foodlyStore.showToast(`Need ${cost - currentCoins} more coins to unlock this coupon!`, 'error');
          return;
        }

        currentCoins -= cost;
        localStorage.setItem('foodly_coins', currentCoins.toString());
        container.querySelector('#current-coins-display').textContent = currentCoins;

        // Apply coupon automatically to store
        window.foodlyStore.applyCoupon({
          code: code,
          discountPercent: 20,
          maxDiscount: 50,
          description: `Redeemed ${code} Reward Coupon`
        });

        window.foodlyStore.showToast(`Unlocked coupon ${code}! Applied to your cart.`, 'success');
      });
    });
  }

  window.renderInnovationsView = renderInnovationsView;
})();
