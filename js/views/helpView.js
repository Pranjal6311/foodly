// public/js/views/helpView.js - Customer Support & Help Center View
(function () {
  function renderHelpView(container) {
    const store = window.foodlyStore;
    const recentOrders = store.orders.slice(0, 3);

    container.innerHTML = `
      <div class="fade-in max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8">
        <!-- Support Hero Header -->
        <div class="rounded-3xl bg-gradient-to-r from-primary to-primary-container text-white p-8 md:p-12 shadow-xl mb-10 text-center relative overflow-hidden">
          <div class="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div class="relative z-10 max-w-2xl mx-auto">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              <span class="material-symbols-outlined text-sm">support_agent</span>
              24/7 Priority Customer Support
            </span>
            <h1 class="text-3xl md:text-5xl font-extrabold mb-3 tracking-tight">How can we assist you?</h1>
            <p class="text-white/90 text-sm md:text-base font-medium mb-6">
              Instant answers, live delivery rider assistance, refund queries, and direct agent support.
            </p>

            <div class="relative max-w-md mx-auto">
              <span class="material-symbols-outlined absolute left-4 top-3.5 text-secondary text-xl">search</span>
              <input 
                type="text" 
                id="help-faq-search"
                placeholder="Search topics: e.g. refund, order delay, UPI..." 
                class="w-full bg-surface-container-lowest text-on-surface rounded-full py-3 pl-12 pr-4 text-sm font-medium outline-none shadow-lg focus:ring-2 focus:ring-amber-300"
              />
            </div>
          </div>
        </div>

        <!-- 4 Quick Support Action Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <!-- 1. Live Chat -->
          <div id="open-live-chat-card" class="bg-surface-container-lowest border border-surface-variant rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-primary transition-all cursor-pointer group flex flex-col justify-between">
            <div>
              <div class="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-colors">
                <span class="material-symbols-outlined text-2xl">chat</span>
              </div>
              <h3 class="font-bold text-base text-on-surface mb-1">Live Chat Support</h3>
              <p class="text-xs text-secondary leading-relaxed">Chat with our automated support bot & executive in under 60 seconds.</p>
            </div>
            <span class="text-xs font-bold text-primary mt-4 flex items-center gap-1">
              Start Chat <span class="material-symbols-outlined text-sm">arrow_forward</span>
            </span>
          </div>

          <!-- 2. Toll-Free Hotline -->
          <a href="tel:1800366359" class="bg-surface-container-lowest border border-surface-variant rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-primary transition-all group flex flex-col justify-between">
            <div>
              <div class="w-12 h-12 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center mb-3 group-hover:bg-tertiary group-hover:text-white transition-colors">
                <span class="material-symbols-outlined text-2xl">call</span>
              </div>
              <h3 class="font-bold text-base text-on-surface mb-1">Toll-Free Helpline</h3>
              <p class="text-xs text-secondary leading-relaxed">Speak directly to an agent on 1800-FOODLY (1800-366-359).</p>
            </div>
            <span class="text-xs font-bold text-tertiary mt-4 flex items-center gap-1">
              Call Now <span class="material-symbols-outlined text-sm">arrow_forward</span>
            </span>
          </a>

          <!-- 3. WhatsApp Support -->
          <a href="https://wa.me/919876543210?text=Hi%20Foodly%20Support,%20I%20need%20help%20with%20my%20order" target="_blank" class="bg-surface-container-lowest border border-surface-variant rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-primary transition-all group flex flex-col justify-between">
            <div>
              <div class="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <span class="material-symbols-outlined text-2xl">sms</span>
              </div>
              <h3 class="font-bold text-base text-on-surface mb-1">WhatsApp Assistant</h3>
              <p class="text-xs text-secondary leading-relaxed">Fast updates, photos of delivered orders, and instant resolution.</p>
            </div>
            <span class="text-xs font-bold text-emerald-700 mt-4 flex items-center gap-1">
              Message WhatsApp <span class="material-symbols-outlined text-sm">arrow_forward</span>
            </span>
          </a>

          <!-- 4. Email Escalations -->
          <a href="mailto:support@foodly.in?subject=Foodly%20Order%20Help" class="bg-surface-container-lowest border border-surface-variant rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-primary transition-all group flex flex-col justify-between">
            <div>
              <div class="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <span class="material-symbols-outlined text-2xl">mail</span>
              </div>
              <h3 class="font-bold text-base text-on-surface mb-1">Email Support</h3>
              <p class="text-xs text-secondary leading-relaxed">Official correspondence at support@foodly.in with 15-min SLA.</p>
            </div>
            <span class="text-xs font-bold text-indigo-700 mt-4 flex items-center gap-1">
              Send Email <span class="material-symbols-outlined text-sm">arrow_forward</span>
            </span>
          </a>
        </div>

        <!-- Recent Order Instant Resolver -->
        ${recentOrders.length > 0 ? `
          <div class="bg-surface-container-lowest border border-surface-variant rounded-2xl p-6 shadow-sm mb-10">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-primary text-xl">receipt_long</span>
                <h3 class="text-lg font-extrabold text-on-surface">Issue with a Recent Order?</h3>
              </div>
              <span class="text-xs font-semibold text-secondary">Select an issue for 1-click resolution</span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              ${recentOrders.slice(0, 2).map(order => `
                <div class="p-4 bg-surface-container-low rounded-xl border border-surface-variant flex flex-col justify-between gap-3">
                  <div>
                    <div class="flex justify-between items-start mb-1">
                      <span class="font-bold text-sm text-on-surface">${order.restaurantName}</span>
                      <span class="bg-primary/10 text-primary text-[11px] font-bold px-2 py-0.5 rounded-full">${order.id}</span>
                    </div>
                    <p class="text-xs text-secondary font-medium">&#8377;${order.bill ? order.bill.total : 0} &bull; ${order.statusText || 'Delivered'}</p>
                  </div>

                  <div class="flex flex-wrap gap-2 pt-2 border-t border-surface-variant/60">
                    <button class="px-2.5 py-1 bg-surface-container-lowest hover:bg-surface-variant text-[11px] font-bold rounded-lg border border-surface-variant text-on-surface transition-colors cursor-pointer quick-issue-btn" data-issue="Missing Items" data-order="${order.id}">
                      Missing Items
                    </button>
                    <button class="px-2.5 py-1 bg-surface-container-lowest hover:bg-surface-variant text-[11px] font-bold rounded-lg border border-surface-variant text-on-surface transition-colors cursor-pointer quick-issue-btn" data-issue="Late Delivery" data-order="${order.id}">
                      Delivery Delayed
                    </button>
                    <button class="px-2.5 py-1 bg-surface-container-lowest hover:bg-surface-variant text-[11px] font-bold rounded-lg border border-surface-variant text-on-surface transition-colors cursor-pointer quick-issue-btn" data-issue="Food Quality Issue" data-order="${order.id}">
                      Quality Issue
                    </button>
                    <a href="#track/${order.id}" class="px-2.5 py-1 bg-primary text-white text-[11px] font-bold rounded-lg hover:bg-primary/90 transition-colors ml-auto">
                      Live Track
                    </a>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- 2 Column Layout: FAQs & Submit Ticket Form -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <!-- FAQs Accordion (7 cols) -->
          <div class="lg:col-span-7">
            <h3 class="text-xl font-extrabold text-on-surface mb-4 flex items-center gap-2">
              <span class="material-symbols-outlined text-primary">quiz</span>
              <span>Frequently Asked Questions</span>
            </h3>

            <div class="flex flex-col gap-3" id="faq-accordion-list">
              <!-- Q1 -->
              <div class="bg-surface-container-lowest border border-surface-variant rounded-2xl overflow-hidden shadow-sm faq-item">
                <button class="w-full text-left p-4 font-bold text-sm text-on-surface flex justify-between items-center hover:text-primary transition-colors cursor-pointer faq-toggle">
                  <span>How does Foodly track delivery riders live?</span>
                  <span class="material-symbols-outlined text-base transition-transform duration-200 faq-icon">expand_more</span>
                </button>
                <div class="p-4 pt-0 text-xs text-secondary leading-relaxed border-t border-surface-variant/40 hidden faq-content">
                  Foodly uses real-time Server-Sent Events (SSE) and GPS telemetry. Once your order leaves the kitchen, you can track the rider's exact scooter coordinates, speed, and real-time route path live on our interactive tracking map.
                </div>
              </div>

              <!-- Q2 -->
              <div class="bg-surface-container-lowest border border-surface-variant rounded-2xl overflow-hidden shadow-sm faq-item">
                <button class="w-full text-left p-4 font-bold text-sm text-on-surface flex justify-between items-center hover:text-primary transition-colors cursor-pointer faq-toggle">
                  <span>What Indian payment methods are accepted?</span>
                  <span class="material-symbols-outlined text-base transition-transform duration-200 faq-icon">expand_more</span>
                </button>
                <div class="p-4 pt-0 text-xs text-secondary leading-relaxed border-t border-surface-variant/40 hidden faq-content">
                  We support all standard Indian payment options: Instant UPI (Google Pay, PhonePe, Paytm, BHIM, QR code scan), Credit & Debit cards (Visa, MasterCard, RuPay), Net Banking across 50+ banks, Pay Later / No-Cost EMI (Simpl, LazyPay), and Cash on Delivery (COD).
                </div>
              </div>

              <!-- Q3 -->
              <div class="bg-surface-container-lowest border border-surface-variant rounded-2xl overflow-hidden shadow-sm faq-item">
                <button class="w-full text-left p-4 font-bold text-sm text-on-surface flex justify-between items-center hover:text-primary transition-colors cursor-pointer faq-toggle">
                  <span>What is Foodly's 30 km radius delivery coverage?</span>
                  <span class="material-symbols-outlined text-base transition-transform duration-200 faq-icon">expand_more</span>
                </button>
                <div class="p-4 pt-0 text-xs text-secondary leading-relaxed border-t border-surface-variant/40 hidden faq-content">
                  We calculate distances using high-precision Haversine GPS mathematics from your location. Foodly connects you to all authentic restaurants, specialty cafes, and certified street food carts within a 30 km radius with insulated thermal bags ensuring hot food delivery.
                </div>
              </div>

              <!-- Q4 -->
              <div class="bg-surface-container-lowest border border-surface-variant rounded-2xl overflow-hidden shadow-sm faq-item">
                <button class="w-full text-left p-4 font-bold text-sm text-on-surface flex justify-between items-center hover:text-primary transition-colors cursor-pointer faq-toggle">
                  <span>How do refunds work if my payment failed or order was cancelled?</span>
                  <span class="material-symbols-outlined text-base transition-transform duration-200 faq-icon">expand_more</span>
                </button>
                <div class="p-4 pt-0 text-xs text-secondary leading-relaxed border-t border-surface-variant/40 hidden faq-content">
                  For UPI transactions, refunds are processed instantly within 15 minutes. For Debit/Credit cards, funds reflect within 2 to 4 business days per banking regulations. Alternatively, you can opt for an instant refund directly to your Foodly Cash Wallet with zero waiting time!
                </div>
              </div>

              <!-- Q5 -->
              <div class="bg-surface-container-lowest border border-surface-variant rounded-2xl overflow-hidden shadow-sm faq-item">
                <button class="w-full text-left p-4 font-bold text-sm text-on-surface flex justify-between items-center hover:text-primary transition-colors cursor-pointer faq-toggle">
                  <span>Are street food carts and chaat vendors hygienic?</span>
                  <span class="material-symbols-outlined text-base transition-transform duration-200 faq-icon">expand_more</span>
                </button>
                <div class="p-4 pt-0 text-xs text-secondary leading-relaxed border-t border-surface-variant/40 hidden faq-content">
                  Yes! All listed food carts are FSSAI-registered and verified. For chaats like Pani Puri, only certified packaged mineral water is used, and street food carts are provided with tamper-proof food-grade hygiene packaging.
                </div>
              </div>
            </div>
          </div>

          <!-- Submit a Support Ticket Form (5 cols) -->
          <div class="lg:col-span-5">
            <div class="bg-surface-container-lowest border border-surface-variant rounded-2xl p-6 shadow-sm sticky top-24">
              <h3 class="text-lg font-extrabold text-on-surface mb-1 flex items-center gap-2">
                <span class="material-symbols-outlined text-primary">report_problem</span>
                <span>Raise a Support Ticket</span>
              </h3>
              <p class="text-xs text-secondary mb-4">Our specialized resolution team will respond to your ticket immediately.</p>

              <form id="help-ticket-form" class="space-y-3">
                <div>
                  <label class="block text-xs font-bold text-secondary uppercase mb-1">Issue Category</label>
                  <select id="ticket-category" class="w-full bg-surface-container-low border border-surface-variant rounded-xl px-3 py-2 text-xs font-semibold text-on-surface outline-none focus:border-primary">
                    <option>Order Delay / Delivery Status</option>
                    <option>Missing Items / Wrong Dish</option>
                    <option>Food Quality or Packaging Issue</option>
                    <option>Payment Debited but Order Not Placed</option>
                    <option>Refund or Coupon Code Query</option>
                    <option>Other Feedback / Suggestion</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-bold text-secondary uppercase mb-1">Related Order ID (Optional)</label>
                  <input 
                    type="text" 
                    id="ticket-order-id"
                    placeholder="e.g. FD-8924"
                    value="${recentOrders[0] ? recentOrders[0].id : ''}"
                    class="w-full bg-surface-container-low border border-surface-variant rounded-xl px-3 py-2 text-xs font-semibold text-on-surface outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold text-secondary uppercase mb-1">Detailed Description</label>
                  <textarea 
                    id="ticket-description"
                    rows="3"
                    placeholder="Describe what happened so we can assist you faster..."
                    required
                    class="w-full bg-surface-container-low border border-surface-variant rounded-xl px-3 py-2 text-xs font-medium text-on-surface outline-none focus:border-primary resize-none"
                  ></textarea>
                </div>

                <button type="submit" class="w-full bg-primary text-white font-bold py-2.5 rounded-xl hover:bg-primary/90 transition-all shadow-md active:scale-95 text-xs flex items-center justify-center gap-1.5 cursor-pointer">
                  <span class="material-symbols-outlined text-sm">send</span>
                  <span>Submit Ticket</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        <!-- Live Chat Modal / Drawer Simulation -->
        <div id="live-chat-modal" class="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] bg-surface-container-lowest border border-surface-variant rounded-3xl shadow-2xl z-50 overflow-hidden hidden flex flex-col h-[480px]">
          <!-- Chat Header -->
          <div class="bg-primary p-4 text-white flex justify-between items-center shrink-0">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <span class="material-symbols-outlined text-base">smart_toy</span>
              </div>
              <div>
                <span class="font-bold text-xs block">Foodly Assistant</span>
                <span class="text-[10px] text-white/80 flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>Online 24/7</span>
              </div>
            </div>
            <button id="close-live-chat-btn" class="text-white hover:opacity-80 cursor-pointer">
              <span class="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          <!-- Chat Message Thread -->
          <div id="chat-messages-thread" class="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            <div class="bg-surface-container-low text-on-surface p-3 rounded-2xl rounded-tl-none max-w-[85%]">
              Namaste! 🙏 I'm your Foodly Care Assistant. How can I help with your order or delivery today?
            </div>
            <div class="flex flex-wrap gap-1.5 mt-2">
              <button class="chat-quick-prompt px-2.5 py-1 bg-surface-variant hover:bg-primary hover:text-white rounded-full text-[10px] font-bold text-on-surface transition-colors cursor-pointer">
                Track my latest order
              </button>
              <button class="chat-quick-prompt px-2.5 py-1 bg-surface-variant hover:bg-primary hover:text-white rounded-full text-[10px] font-bold text-on-surface transition-colors cursor-pointer">
                Where is my refund?
              </button>
              <button class="chat-quick-prompt px-2.5 py-1 bg-surface-variant hover:bg-primary hover:text-white rounded-full text-[10px] font-bold text-on-surface transition-colors cursor-pointer">
                Talk to human agent
              </button>
            </div>
          </div>

          <!-- Chat Input -->
          <div class="p-3 border-t border-surface-variant flex items-center gap-2 shrink-0 bg-surface-container-lowest">
            <input 
              type="text" 
              id="live-chat-input"
              placeholder="Type your question..."
              class="flex-1 bg-surface-container-low border-none rounded-xl px-3 py-2 text-xs text-on-surface outline-none"
            />
            <button id="live-chat-send-btn" class="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary/90 cursor-pointer">
              <span class="material-symbols-outlined text-sm">send</span>
            </button>
          </div>
        </div>
      </div>
    `;

    // Event Listeners
    // 1. FAQ Accordions
    document.querySelectorAll('.faq-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const content = item.querySelector('.faq-content');
        const icon = item.querySelector('.faq-icon');
        const isOpen = !content.classList.contains('hidden');

        // Close all
        document.querySelectorAll('.faq-content').forEach(c => c.classList.add('hidden'));
        document.querySelectorAll('.faq-icon').forEach(i => i.classList.remove('rotate-180'));

        if (!isOpen) {
          content.classList.remove('hidden');
          icon.classList.add('rotate-180');
        }
      });
    });

    // 2. FAQ Real-time Search filter
    const faqSearch = document.getElementById('help-faq-search');
    if (faqSearch) {
      faqSearch.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase().trim();
        document.querySelectorAll('.faq-item').forEach(item => {
          const text = item.textContent.toLowerCase();
          item.style.display = text.includes(term) ? 'block' : 'none';
        });
      });
    }

    // 3. Quick issue buttons
    document.querySelectorAll('.quick-issue-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const issue = btn.dataset.issue;
        const orderId = btn.dataset.order;
        store.showToast(`Issue reported for #${orderId} (${issue}). Our support executive is reviewing your order.`, 'info');
      });
    });

    // 4. Ticket form submit
    const ticketForm = document.getElementById('help-ticket-form');
    if (ticketForm) {
      ticketForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const cat = document.getElementById('ticket-category').value;
        const ticketId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
        store.showToast(`Support Ticket #${ticketId} created for "${cat}". We will contact you within 15 minutes!`, 'success');
        document.getElementById('ticket-description').value = '';
      });
    }

    // 5. Live Chat Modal handlers
    const chatModal = document.getElementById('live-chat-modal');
    const openChatCard = document.getElementById('open-live-chat-card');
    const closeChatBtn = document.getElementById('close-live-chat-btn');
    const chatInput = document.getElementById('live-chat-input');
    const chatSendBtn = document.getElementById('live-chat-send-btn');
    const chatThread = document.getElementById('chat-messages-thread');

    if (openChatCard) {
      openChatCard.addEventListener('click', () => chatModal.classList.remove('hidden'));
    }
    if (closeChatBtn) {
      closeChatBtn.addEventListener('click', () => chatModal.classList.add('hidden'));
    }

    function sendChatMessage(msg) {
      if (!msg.trim()) return;
      const userBubble = document.createElement('div');
      userBubble.className = 'bg-primary text-white p-3 rounded-2xl rounded-tr-none max-w-[85%] ml-auto text-xs';
      userBubble.textContent = msg;
      chatThread.appendChild(userBubble);
      chatThread.scrollTop = chatThread.scrollHeight;

      // Simulated Bot Reply
      setTimeout(() => {
        const botBubble = document.createElement('div');
        botBubble.className = 'bg-surface-container-low text-on-surface p-3 rounded-2xl rounded-tl-none max-w-[85%] text-xs';
        
        const lower = msg.toLowerCase();
        if (lower.includes('track') || lower.includes('order')) {
          botBubble.innerHTML = `Your latest order <strong>#${recentOrders[0] ? recentOrders[0].id : 'FD-8924'}</strong> is on the way! <br/><a href="#track/${recentOrders[0] ? recentOrders[0].id : 'FD-8924'}" class="text-primary underline font-bold mt-1 inline-block">Click here to open live GPS map</a>`;
        } else if (lower.includes('refund')) {
          botBubble.textContent = "Refunds to UPI are instant. We have credited ₹100 Foodly Cash to your wallet as courtesy compensation!";
          store.showToast('₹100 credited to wallet', 'success');
        } else {
          botBubble.textContent = "Thank you for reaching out. Support Agent Priya Sharma has joined this chat session and is checking your account.";
        }
        chatThread.appendChild(botBubble);
        chatThread.scrollTop = chatThread.scrollHeight;
      }, 600);
    }

    if (chatSendBtn && chatInput) {
      chatSendBtn.addEventListener('click', () => {
        sendChatMessage(chatInput.value);
        chatInput.value = '';
      });
      chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          sendChatMessage(chatInput.value);
          chatInput.value = '';
        }
      });
    }

    document.querySelectorAll('.chat-quick-prompt').forEach(btn => {
      btn.addEventListener('click', () => {
        sendChatMessage(btn.textContent.trim());
      });
    });
  }

  window.renderHelpView = renderHelpView;
})();
