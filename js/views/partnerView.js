// public/js/views/partnerView.js - College Tie-Ups & Institutional Partner Portal
(function () {
  const PARTNER_COLLEGES = [
    {
      id: 'gl-bajaj',
      name: 'GL Bajaj Institute of Technology & Management',
      location: 'Plot No. 2, Knowledge Park III, Greater Noida',
      status: 'Active Flagship Partner',
      students: '12,500+',
      cafeterias: '14 Outlets',
      since: '2023',
      isCurrent: true,
      badge: 'Official Campus Tie-Up',
      rating: '4.9/5.0',
      zones: ['Boys Hostel 1 & 2', 'Girls Hostel Block', 'Audi Academic Block', 'Mechanical Block', 'Admin Block']
    },
    {
      id: 'bennett',
      name: 'Bennett University (Times Group)',
      location: 'TechZone II, Greater Noida',
      status: 'Partner Campus',
      students: '8,200+',
      cafeterias: '9 Outlets',
      since: '2024',
      isCurrent: false,
      badge: 'Verified Tie-Up',
      rating: '4.8/5.0',
      zones: ['Mess Hall 1', 'Hostel Wing A-D', 'Incubation Centre']
    },
    {
      id: 'galgotias',
      name: 'Galgotias University & College of Engineering',
      location: 'Plot 1, Knowledge Park II, Greater Noida',
      status: 'Partner Campus',
      students: '16,000+',
      cafeterias: '18 Outlets',
      since: '2024',
      isCurrent: false,
      badge: 'Verified Tie-Up',
      rating: '4.7/5.0',
      zones: ['Campus Food Court', 'Block E Canteen', 'Girls Campus Hostel']
    },
    {
      id: 'niet',
      name: 'NIET (Noida Institute of Engg. & Technology)',
      location: '19, Knowledge Park II, Greater Noida',
      status: 'Partner Campus',
      students: '9,400+',
      cafeterias: '11 Outlets',
      since: '2024',
      isCurrent: false,
      badge: 'Verified Tie-Up',
      rating: '4.8/5.0',
      zones: ['Main Canteen', 'Pyramid Canteen', 'Hostel Quad']
    },
    {
      id: 'sharda',
      name: 'Sharda University Campus',
      location: 'Plot 32-34, Knowledge Park III, Greater Noida',
      status: 'Partner Campus',
      students: '14,000+',
      cafeterias: '16 Outlets',
      since: '2025',
      isCurrent: false,
      badge: 'Verified Tie-Up',
      rating: '4.8/5.0',
      zones: ['Sunken Food Court', 'Mandela Hostel', 'Block 3 Canteen']
    }
  ];

  function renderPartnerView(container) {
    if (!container) return;

    container.innerHTML = `
      <div class="min-h-screen bg-surface pb-20">
        <!-- Top Institutional Hero -->
        <section class="bg-gradient-to-b from-surface-container-high/60 via-surface to-surface border-b border-surface-variant/80 py-12 md:py-16 px-margin-mobile md:px-margin-desktop">
          <div class="max-w-container-max mx-auto">
            
            <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black">
                <span class="material-symbols-outlined text-sm">verified</span>
                <span>Institutional &amp; College Tie-Up Network</span>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-xs font-semibold text-secondary">Active Tie-Up:</span>
                <span class="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-800 dark:text-emerald-300 text-xs font-extrabold rounded-full flex items-center gap-1.5 shadow-sm">
                  <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>GL Bajaj Institute of Tech &amp; Mgmt (GLBITM)</span>
                </span>
              </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div class="lg:col-span-8 space-y-4">
                <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black text-on-surface tracking-tight leading-tight">
                  Official College Partnerships &amp; <br/>
                  <span class="text-primary bg-gradient-to-r from-primary to-primary-container bg-clip-text text-transparent">Institutional Campus Hub</span>
                </h1>
                <p class="text-sm md:text-base text-secondary max-w-2xl leading-relaxed">
                  Foodly partners directly with colleges and universities across Knowledge Park &amp; Greater Noida. We digitize campus cafeterias, offer ₹0 batch delivery to hostels, integrate student ID billing, and empower student delivery runners.
                </p>
                
                <div class="flex flex-wrap items-center gap-3 pt-2">
                  <a href="#partner-form" class="px-5 py-2.5 bg-primary text-white font-extrabold text-xs md:text-sm rounded-xl shadow-md hover:bg-primary/90 transition-all flex items-center gap-2 active:scale-95">
                    <span class="material-symbols-outlined text-base">handshake</span>
                    <span>Tie-Up Your College</span>
                  </a>
                  <button id="open-canteen-portal-btn" class="px-5 py-2.5 bg-surface-container-lowest text-on-surface border border-surface-variant font-extrabold text-xs md:text-sm rounded-xl hover:border-primary hover:text-primary transition-all flex items-center gap-2 shadow-sm active:scale-95 cursor-pointer">
                    <span class="material-symbols-outlined text-base">storefront</span>
                    <span>Cafeteria Partner Portal</span>
                  </button>
                  <button id="open-fleet-portal-btn" class="px-5 py-2.5 bg-surface-container-lowest text-on-surface border border-surface-variant font-extrabold text-xs md:text-sm rounded-xl hover:border-primary hover:text-primary transition-all flex items-center gap-2 shadow-sm active:scale-95 cursor-pointer">
                    <span class="material-symbols-outlined text-base">pedal_bike</span>
                    <span>Student Fleet Partner</span>
                  </button>
                </div>
              </div>

              <!-- Quick Metrics Card -->
              <div class="lg:col-span-4 bg-surface-container-lowest border border-surface-variant/90 rounded-2xl p-6 shadow-md space-y-5">
                <div class="flex items-center justify-between pb-3 border-b border-surface-variant">
                  <span class="text-xs font-bold text-secondary uppercase tracking-wider">Campus Network Impact</span>
                  <span class="text-[10px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-full">LIVE</span>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div class="bg-surface-container-low p-3.5 rounded-xl">
                    <div class="text-2xl font-black text-on-surface">5+</div>
                    <div class="text-[11px] font-bold text-secondary mt-0.5">Tie-Up Colleges</div>
                  </div>
                  <div class="bg-surface-container-low p-3.5 rounded-xl">
                    <div class="text-2xl font-black text-primary">68+</div>
                    <div class="text-[11px] font-bold text-secondary mt-0.5">Campus Outlets</div>
                  </div>
                  <div class="bg-surface-container-low p-3.5 rounded-xl">
                    <div class="text-2xl font-black text-emerald-700">₹0</div>
                    <div class="text-[11px] font-bold text-secondary mt-0.5">Campus Batch Delivery</div>
                  </div>
                  <div class="bg-surface-container-low p-3.5 rounded-xl">
                    <div class="text-2xl font-black text-amber-600">62,000+</div>
                    <div class="text-[11px] font-bold text-secondary mt-0.5">Students Served</div>
                  </div>
                </div>
                <div class="text-[11px] text-secondary font-medium leading-relaxed bg-surface-container-low/50 p-2.5 rounded-lg border border-surface-variant/60">
                  ⚡ <strong>GL Bajaj ITM Students:</strong> Enjoy 100% free delivery to all hostel blocks with verified GLBITM campus credentials.
                </div>
              </div>
            </div>

          </div>
        </section>

        <!-- Partner Colleges Grid -->
        <section class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12">
          <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span class="text-xs font-black uppercase tracking-wider text-primary">Institutional Network</span>
              <h2 class="text-2xl md:text-3xl font-black text-on-surface tracking-tight mt-1">Our Partnered Colleges &amp; Campuses</h2>
              <p class="text-xs md:text-sm text-secondary mt-1">Direct institutional tie-ups providing on-campus cafeteria ordering &amp; hostel deliveries.</p>
            </div>
            <div class="text-xs font-bold text-secondary">
              Showing <strong>${PARTNER_COLLEGES.length} Connected Campuses</strong>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${PARTNER_COLLEGES.map(col => `
              <div class="bg-surface-container-lowest border ${col.isCurrent ? 'border-primary ring-2 ring-primary/20' : 'border-surface-variant/90'} rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden">
                ${col.isCurrent ? `
                  <div class="absolute top-0 right-0 bg-primary text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-sm flex items-center gap-1">
                    <span class="material-symbols-outlined text-xs">star</span>
                    <span>Your Active Campus</span>
                  </div>
                ` : ''}

                <div>
                  <div class="flex items-center gap-3 mb-3">
                    <div class="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                      <span class="material-symbols-outlined text-2xl">school</span>
                    </div>
                    <div>
                      <h3 class="font-bold text-on-surface text-base leading-snug">${col.name}</h3>
                      <span class="text-[11px] font-semibold text-secondary flex items-center gap-1">
                        <span class="material-symbols-outlined text-xs">pin_drop</span>
                        <span>${col.location}</span>
                      </span>
                    </div>
                  </div>

                  <div class="grid grid-cols-3 gap-2 py-3 border-y border-surface-variant my-4 text-center">
                    <div>
                      <div class="text-[10px] uppercase font-bold text-secondary">Students</div>
                      <div class="font-black text-xs text-on-surface mt-0.5">${col.students}</div>
                    </div>
                    <div>
                      <div class="text-[10px] uppercase font-bold text-secondary">Cafeterias</div>
                      <div class="font-black text-xs text-on-surface mt-0.5">${col.cafeterias}</div>
                    </div>
                    <div>
                      <div class="text-[10px] uppercase font-bold text-secondary">Rating</div>
                      <div class="font-black text-xs text-amber-600 mt-0.5">${col.rating}</div>
                    </div>
                  </div>

                  <div class="space-y-1.5">
                    <div class="text-[11px] font-bold text-secondary">Supported Campus Drop Zones:</div>
                    <div class="flex flex-wrap gap-1.5">
                      ${col.zones.map(z => `
                        <span class="px-2 py-0.5 bg-surface-container-low text-secondary text-[10px] font-semibold rounded-md border border-surface-variant/60">
                          ${z}
                        </span>
                      `).join('')}
                    </div>
                  </div>
                </div>

                <div class="pt-6 mt-4 border-t border-surface-variant flex items-center justify-between">
                  <span class="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                    <span class="material-symbols-outlined text-xs">check_circle</span>
                    <span>${col.status}</span>
                  </span>
                  ${col.isCurrent ? `
                    <a href="#home" class="px-3.5 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/90 transition-all flex items-center gap-1 shadow-sm">
                      <span>Order Food</span>
                      <span class="material-symbols-outlined text-xs">arrow_forward</span>
                    </a>
                  ` : `
                    <button onclick="window.foodlyStore.showToast('Switching active campus to ${col.name}...', 'info'); setTimeout(() => { window.foodlyStore.activeAddress = '${col.name}, Greater Noida'; window.location.hash='#home'; }, 700);" class="px-3.5 py-1.5 bg-surface-container-low border border-surface-variant text-on-surface rounded-lg text-xs font-bold hover:border-primary hover:text-primary transition-all flex items-center gap-1 cursor-pointer">
                      <span>Switch Campus</span>
                    </button>
                  `}
                </div>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- Institutional Partnership Benefits Section -->
        <section class="bg-surface-container-lowest border-y border-surface-variant/80 py-12 px-margin-mobile md:px-margin-desktop">
          <div class="max-w-container-max mx-auto">
            <div class="text-center max-w-2xl mx-auto mb-10">
              <span class="text-xs font-black uppercase tracking-wider text-primary">Why Colleges Tie-Up With Foodly</span>
              <h2 class="text-2xl md:text-3xl font-black text-on-surface tracking-tight mt-1">Transforming Campus Dining Experience</h2>
              <p class="text-xs md:text-sm text-secondary mt-2">Foodly eliminates cafeteria overcrowding, ensures transparent student pricing, and generates on-campus earnings.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="p-6 rounded-2xl bg-surface-container-low border border-surface-variant/70 space-y-3">
                <div class="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-950/40 text-primary flex items-center justify-center font-bold">
                  <span class="material-symbols-outlined text-2xl">point_of_sale</span>
                </div>
                <h3 class="font-extrabold text-base text-on-surface">Zero-Commission Canteen POS</h3>
                <p class="text-xs text-secondary leading-relaxed">
                  Campus canteens pay 0% extortionate commission. Unlike commercial apps that charge 25-30%, Foodly keeps on-campus dining affordable for students.
                </p>
                <div class="text-[11px] font-bold text-primary flex items-center gap-1 pt-1">
                  <span>Guaranteed College Pricing</span>
                  <span class="material-symbols-outlined text-xs">verified</span>
                </div>
              </div>

              <div class="p-6 rounded-2xl bg-surface-container-low border border-surface-variant/70 space-y-3">
                <div class="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 flex items-center justify-center font-bold">
                  <span class="material-symbols-outlined text-2xl">group_work</span>
                </div>
                <h3 class="font-extrabold text-base text-on-surface">Campus Batch Delivery Fleet</h3>
                <p class="text-xs text-secondary leading-relaxed">
                  Orders to hostels are aggregated into scheduled batch drops (Lunch 1:15 PM, Dinner 8:30 PM, Night Canteen 11:30 PM), reducing delivery traffic to ₹0.
                </p>
                <div class="text-[11px] font-bold text-emerald-700 flex items-center gap-1 pt-1">
                  <span>Eco-friendly &amp; ₹0 Student Fee</span>
                  <span class="material-symbols-outlined text-xs">eco</span>
                </div>
              </div>

              <div class="p-6 rounded-2xl bg-surface-container-low border border-surface-variant/70 space-y-3">
                <div class="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/40 text-blue-700 flex items-center justify-center font-bold">
                  <span class="material-symbols-outlined text-2xl">badge</span>
                </div>
                <h3 class="font-extrabold text-base text-on-surface">Student Peer Earning Program</h3>
                <p class="text-xs text-secondary leading-relaxed">
                  Campus deliveries are fulfilled by verified GL Bajaj student runners between classes, helping them earn ₹3,000 - ₹8,000 monthly pocket money right on campus.
                </p>
                <div class="text-[11px] font-bold text-blue-700 flex items-center gap-1 pt-1">
                  <span>Earn While You Learn</span>
                  <span class="material-symbols-outlined text-xs">payments</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Tie-Up Request Form -->
        <section id="partner-form" class="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-14">
          <div class="bg-surface-container-lowest border border-surface-variant rounded-3xl p-6 md:p-10 shadow-lg">
            <div class="text-center space-y-2 mb-8">
              <span class="text-xs font-black uppercase tracking-wider text-primary">Campus Administration &amp; Canteens</span>
              <h2 class="text-2xl md:text-3xl font-black text-on-surface tracking-tight">Request an Official College Tie-Up</h2>
              <p class="text-xs md:text-sm text-secondary">
                Are you a College Dean, Mess Committee Head, Canteen Contractor, or Student Council Representative? Fill out this tie-up form and our campus operations director will schedule an on-campus briefing within 24 hours.
              </p>
            </div>

            <form id="college-tieup-form" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-on-surface mb-1.5">College / Institution Name *</label>
                  <input type="text" id="tieup-college-name" required placeholder="e.g. GL Bajaj, Galgotias, etc." class="w-full px-3.5 py-2.5 rounded-xl border border-surface-variant bg-surface-container-low focus:bg-surface-container-lowest text-xs text-on-surface outline-none focus:border-primary transition-all" value="GL Bajaj Institute of Technology & Management"/>
                </div>
                <div>
                  <label class="block text-xs font-bold text-on-surface mb-1.5">Campus Location / Area *</label>
                  <input type="text" id="tieup-location" required placeholder="e.g. Knowledge Park III, Greater Noida" class="w-full px-3.5 py-2.5 rounded-xl border border-surface-variant bg-surface-container-low focus:bg-surface-container-lowest text-xs text-on-surface outline-none focus:border-primary transition-all" value="Knowledge Park III, Greater Noida"/>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-on-surface mb-1.5">Representative Name &amp; Designation *</label>
                  <input type="text" id="tieup-rep-name" required placeholder="Dr. S. Sharma / Mess Head / Canteen Owner" class="w-full px-3.5 py-2.5 rounded-xl border border-surface-variant bg-surface-container-low focus:bg-surface-container-lowest text-xs text-on-surface outline-none focus:border-primary transition-all"/>
                </div>
                <div>
                  <label class="block text-xs font-bold text-on-surface mb-1.5">Official Email / Phone *</label>
                  <input type="text" id="tieup-contact" required placeholder="name@glbitm.ac.in or +91 98..." class="w-full px-3.5 py-2.5 rounded-xl border border-surface-variant bg-surface-container-low focus:bg-surface-container-lowest text-xs text-on-surface outline-none focus:border-primary transition-all"/>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-on-surface mb-1.5">Partnership Category *</label>
                  <select id="tieup-category" class="w-full px-3.5 py-2.5 rounded-xl border border-surface-variant bg-surface-container-low focus:bg-surface-container-lowest text-xs text-on-surface outline-none focus:border-primary transition-all">
                    <option value="official-college">Official College / University Tie-Up</option>
                    <option value="campus-canteen">On-Campus Canteen / Food Court Partner</option>
                    <option value="hostel-night-canteen">Hostel Night Canteen Digitization</option>
                    <option value="student-club">Student Fest / Hackathon Catering Partner</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-bold text-on-surface mb-1.5">Estimated Student / Resident Capacity</label>
                  <select id="tieup-capacity" class="w-full px-3.5 py-2.5 rounded-xl border border-surface-variant bg-surface-container-low focus:bg-surface-container-lowest text-xs text-on-surface outline-none focus:border-primary transition-all">
                    <option>5,000 - 10,000 Students</option>
                    <option selected>10,000 - 20,000 Students</option>
                    <option>20,000+ Students</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-on-surface mb-1.5">Message / Requirements</label>
                <textarea id="tieup-notes" rows="3" placeholder="Tell us about your campus cafeterias, hostel mess, or specific delivery requirements..." class="w-full px-3.5 py-2.5 rounded-xl border border-surface-variant bg-surface-container-low focus:bg-surface-container-lowest text-xs text-on-surface outline-none focus:border-primary transition-all"></textarea>
              </div>

              <div class="pt-2">
                <button type="submit" class="w-full py-3.5 bg-primary text-white font-black text-sm rounded-xl shadow-md hover:bg-primary/90 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer">
                  <span class="material-symbols-outlined text-base">send</span>
                  <span>Submit Campus Partnership Request</span>
                </button>
              </div>
            </form>
          </div>
        </section>

      </div>

      <!-- Partner Console Modal (Interactive simulation for Canteens & Fleets) -->
      <div id="partner-modal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden items-center justify-center p-4">
        <div class="bg-surface-container-lowest border border-surface-variant rounded-2xl max-w-xl w-full p-6 shadow-2xl relative">
          <button id="close-partner-modal" class="absolute top-4 right-4 text-secondary hover:text-on-surface p-1">
            <span class="material-symbols-outlined">close</span>
          </button>
          
          <div id="partner-modal-content">
            <!-- Dynamically injected -->
          </div>
        </div>
      </div>
    `;

    // ── Form submission handler ───────────────────────────────────────────────
    const form = document.getElementById('college-tieup-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const repName = document.getElementById('tieup-rep-name').value || 'Representative';
        const college = document.getElementById('tieup-college-name').value || 'Institution';
        
        window.foodlyStore.showToast(`🎉 Partnership request received for ${college}! Our team will contact ${repName} shortly.`, 'success');
        form.reset();
      });
    }

    // ── Interactive Canteen Portal Simulator ──────────────────────────────────
    const canteenBtn = document.getElementById('open-canteen-portal-btn');
    const fleetBtn = document.getElementById('open-fleet-portal-btn');
    const modal = document.getElementById('partner-modal');
    const modalContent = document.getElementById('partner-modal-content');
    const closeBtn = document.getElementById('close-partner-modal');

    if (canteenBtn && modal && modalContent) {
      canteenBtn.addEventListener('click', () => {
        modalContent.innerHTML = `
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                <span class="material-symbols-outlined">storefront</span>
              </div>
              <div>
                <h3 class="font-black text-lg text-on-surface">GL Bajaj Cafeteria Partner Live Board</h3>
                <p class="text-xs text-secondary">Simulated Kitchen Display System (KDS) &amp; Live Order Acceptance</p>
              </div>
            </div>

            <div class="bg-surface-container-low p-4 rounded-xl border border-surface-variant space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-extrabold text-on-surface">Central Canteen #GLB-104</span>
                <span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full">KITCHEN OPEN</span>
              </div>
              
              <div class="space-y-2 text-xs">
                <div class="p-2.5 bg-surface-container-lowest rounded-lg border border-surface-variant/80 flex items-center justify-between">
                  <div>
                    <strong class="text-on-surface">Order #GLB-8831</strong> (Boys Hostel B, Room 302)
                    <div class="text-[11px] text-secondary">2x Paneer Butter Masala + 4x Butter Roti</div>
                  </div>
                  <span class="px-2 py-1 bg-amber-100 text-amber-900 font-bold text-[10px] rounded">PREPARING (8m)</span>
                </div>

                <div class="p-2.5 bg-surface-container-lowest rounded-lg border border-surface-variant/80 flex items-center justify-between">
                  <div>
                    <strong class="text-on-surface">Order #GLB-8832</strong> (Audi Block AB-1)
                    <div class="text-[11px] text-secondary">1x Navratri Sabudana Khichdi + Curd</div>
                  </div>
                  <button onclick="window.foodlyStore.showToast('Order #GLB-8832 Accepted! Kitchen ticket printed.', 'success'); this.innerText='ACCEPTED ✓'; this.className='px-2 py-1 bg-emerald-600 text-white font-bold text-[10px] rounded';" class="px-2.5 py-1 bg-primary text-white font-bold text-[10px] rounded cursor-pointer">
                    ACCEPT ORDER
                  </button>
                </div>
              </div>
            </div>

            <p class="text-[11px] text-secondary leading-relaxed">
              Every on-campus kitchen partner gets a dedicated touch dashboard with automated sound alerts, inventory toggles, and live runner tracking.
            </p>
          </div>
        `;
        modal.classList.remove('hidden');
        modal.classList.add('flex');
      });
    }

    if (fleetBtn && modal && modalContent) {
      fleetBtn.addEventListener('click', () => {
        modalContent.innerHTML = `
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <span class="material-symbols-outlined">pedal_bike</span>
              </div>
              <div>
                <h3 class="font-black text-lg text-on-surface">GL Bajaj Student Delivery Partner Hub</h3>
                <p class="text-xs text-secondary">Earn pocket money by delivering food across campus &amp; hostels</p>
              </div>
            </div>

            <div class="bg-surface-container-low p-4 rounded-xl border border-surface-variant space-y-3">
              <div class="flex items-center justify-between text-xs font-bold">
                <span class="text-secondary">Today's Earnings</span>
                <span class="text-base font-black text-emerald-700">₹420.00</span>
              </div>
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div class="p-2.5 bg-surface-container-lowest rounded-lg">
                  <div class="text-[10px] text-secondary">Deliveries Done</div>
                  <div class="font-black text-sm">7 Orders</div>
                </div>
                <div class="p-2.5 bg-surface-container-lowest rounded-lg">
                  <div class="text-[10px] text-secondary">Rating</div>
                  <div class="font-black text-sm text-amber-600">4.9 ★</div>
                </div>
              </div>

              <button onclick="window.foodlyStore.showToast('Student Runner Registration opened! Check WhatsApp/Email for verification.', 'success');" class="w-full py-2.5 bg-emerald-700 text-white font-bold text-xs rounded-xl shadow cursor-pointer hover:bg-emerald-800 transition-all">
                Register as Campus Student Runner (GL Bajaj ID Required)
              </button>
            </div>
          </div>
        `;
        modal.classList.remove('hidden');
        modal.classList.add('flex');
      });
    }

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
      });
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.add('hidden');
          modal.classList.remove('flex');
        }
      });
    }
  }

  window.renderPartnerView = renderPartnerView;
})();
