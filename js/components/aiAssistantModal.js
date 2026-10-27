// public/js/components/aiAssistantModal.js - Interactive Gemini Foodly AI Assistant
(function () {
  function initAiAssistant() {
    let container = document.getElementById('ai-assistant-modal-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'ai-assistant-modal-container';
      document.body.appendChild(container);
    }

    container.innerHTML = `
      <!-- Floating Trigger Button (Bottom Left on Mobile/Desktop) -->
      <button 
        id="open-ai-assistant-btn" 
        class="fixed bottom-20 md:bottom-8 left-4 md:left-8 z-40 bg-gradient-to-r from-purple-600 via-indigo-600 to-primary text-white font-extrabold text-xs px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border-2 border-white/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        title="Ask Foodly AI Campus Assistant"
      >
        <span class="text-base animate-pulse">✨</span>
        <span class="tracking-wide">Ask Foodly AI</span>
        <span class="bg-white/25 text-[10px] px-1.5 py-0.5 rounded-full font-black uppercase">Gemini</span>
      </button>

      <!-- Full Modal Backdrop -->
      <div id="ai-assistant-modal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden flex items-end sm:items-center justify-center p-0 sm:p-4 transition-opacity">
        <div class="bg-surface-container-lowest w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl border border-surface-variant flex flex-col max-h-[85vh] sm:max-h-[80vh] overflow-hidden fade-in">
          
          <!-- Modal Header -->
          <div class="p-4 sm:p-5 border-b border-surface-variant bg-gradient-to-r from-purple-900 via-indigo-950 to-neutral-900 text-white flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-xl shadow-inner">
                <span>✨</span>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="font-black text-sm sm:text-base">Foodly AI Assistant</h3>
                  <span id="ai-status-badge" class="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
                    AI Online
                  </span>
                </div>
                <p class="text-[11px] text-purple-200/80 font-medium">Campus Food Recommendations &amp; Gemini Neuro-Engine</p>
              </div>
            </div>
            <button id="close-ai-assistant-btn" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-colors">
              <span class="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          <!-- Chat Messages Body -->
          <div id="ai-chat-messages" class="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5 text-xs">
            <!-- Welcome message from AI -->
            <div class="flex items-start gap-2.5 max-w-[92%]">
              <div class="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 font-bold text-xs shadow-sm">
                AI
              </div>
              <div class="bg-purple-50 border border-purple-200 text-on-surface p-3.5 rounded-2xl rounded-tl-none shadow-sm leading-relaxed">
                <p class="font-semibold mb-1">Hey there! 👋 I am your Foodly Campus AI.</p>
                <p class="text-secondary text-[11px]">Tell me your mood, craving, budget, or dietary vibe — or pick a quick prompt below:</p>
              </div>
            </div>
          </div>

          <!-- Quick Prompts Row -->
          <div class="px-4 py-2 border-t border-surface-variant/40 bg-surface-container-low flex items-center gap-2 overflow-x-auto scrollbar-none">
            <button class="ai-quick-chip px-3 py-1.5 rounded-full bg-white hover:bg-purple-50 border border-purple-200 text-purple-900 text-[11px] font-bold whitespace-nowrap transition-colors shadow-2xs cursor-pointer flex items-center gap-1" data-prompt="Late night study coding snacks">
              <span>🌙</span> Late Night Coding
            </button>
            <button class="ai-quick-chip px-3 py-1.5 rounded-full bg-white hover:bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] font-bold whitespace-nowrap transition-colors shadow-2xs cursor-pointer flex items-center gap-1" data-prompt="High protein gym meals over 24g">
              <span>💪</span> High Protein (>24g)
            </button>
            <button class="ai-quick-chip px-3 py-1.5 rounded-full bg-white hover:bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-bold whitespace-nowrap transition-colors shadow-2xs cursor-pointer flex items-center gap-1" data-prompt="Pocket friendly meals under 150">
              <span>💰</span> Budget (&lt; ₹150)
            </button>
            <button class="ai-quick-chip px-3 py-1.5 rounded-full bg-white hover:bg-indigo-50 border border-indigo-200 text-indigo-900 text-[11px] font-bold whitespace-nowrap transition-colors shadow-2xs cursor-pointer flex items-center gap-1" data-prompt="Best cold coffee and desserts on campus">
              <span>☕</span> Cold Coffee
            </button>
            <button class="ai-quick-chip px-3 py-1.5 rounded-full bg-white hover:bg-rose-50 border border-rose-200 text-rose-900 text-[11px] font-bold whitespace-nowrap transition-colors shadow-2xs cursor-pointer flex items-center gap-1" data-prompt="Pure Satvik Navratri Vrat food">
              <span>🪔</span> Navratri Satvik
            </button>
          </div>

          <!-- Chat Input Bar -->
          <form id="ai-chat-form" class="p-3 border-t border-surface-variant bg-surface-container-lowest flex items-center gap-2">
            <input 
              id="ai-user-input" 
              type="text" 
              placeholder="Ask Foodly AI: 'spicy chicken under ₹180', 'best thali'..." 
              class="flex-1 bg-surface-container-low border border-surface-variant focus:border-purple-600 rounded-xl px-3.5 py-2.5 text-xs text-on-surface outline-none font-semibold transition-all"
            />
            <button 
              type="submit" 
              class="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-center hover:opacity-90 active:scale-95 shadow-md cursor-pointer shrink-0"
              title="Send to Foodly AI"
            >
              <span class="material-symbols-outlined text-lg">send</span>
            </button>
          </form>

          <!-- Gemini API Key Toggle Footer -->
          <div class="px-4 py-2 border-t border-surface-variant/30 bg-surface-container-low/50 flex items-center justify-between text-[11px] text-secondary">
            <span class="flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>100% Zero-fail client AI active</span>
            </span>
            <button id="toggle-api-key-panel-btn" type="button" class="text-purple-700 font-bold hover:underline flex items-center gap-0.5 cursor-pointer">
              <span class="material-symbols-outlined text-xs">key</span>
              <span id="api-key-btn-label">Gemini API Key</span>
            </button>
          </div>

          <!-- Collapsible API Key Drawer -->
          <div id="api-key-panel" class="hidden p-3 bg-purple-50/80 border-t border-purple-200 text-xs">
            <label class="block font-bold text-purple-950 mb-1">Optional: Your Google Gemini API Key</label>
            <div class="flex gap-2">
              <input 
                id="gemini-api-key-input" 
                type="password" 
                placeholder="AIzaSy..." 
                class="flex-1 bg-white border border-purple-300 rounded-lg px-2.5 py-1.5 text-xs font-mono outline-none"
              />
              <button id="save-gemini-key-btn" type="button" class="bg-purple-700 hover:bg-purple-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer">
                Save Key
              </button>
            </div>
            <p class="text-[10px] text-purple-800/80 mt-1">If empty, Foodly automatically uses its built-in offline semantic food engine.</p>
          </div>

        </div>
      </div>
    `;

    bindAiEvents();
  }

  function bindAiEvents() {
    const modal = document.getElementById('ai-assistant-modal');
    const openBtn = document.getElementById('open-ai-assistant-btn');
    const closeBtn = document.getElementById('close-ai-assistant-btn');
    const form = document.getElementById('ai-chat-form');
    const input = document.getElementById('ai-user-input');
    const messages = document.getElementById('ai-chat-messages');
    const keyPanel = document.getElementById('api-key-panel');
    const toggleKeyBtn = document.getElementById('toggle-api-key-panel-btn');
    const keyInput = document.getElementById('gemini-api-key-input');
    const saveKeyBtn = document.getElementById('save-gemini-key-btn');

    if (keyInput) {
      keyInput.value = localStorage.getItem('foodly_gemini_api_key') || '';
    }

    const openModal = () => {
      modal?.classList.remove('hidden');
      input?.focus();
    };

    const closeModal = () => {
      modal?.classList.add('hidden');
    };

    openBtn?.addEventListener('click', openModal);
    closeBtn?.addEventListener('click', closeModal);
    modal?.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    // Make trigger available globally
    window.openFoodlyAiAssistant = openModal;

    // Toggle API Key Panel
    toggleKeyBtn?.addEventListener('click', () => {
      keyPanel?.classList.toggle('hidden');
    });

    // Save API Key
    saveKeyBtn?.addEventListener('click', () => {
      const val = keyInput?.value?.trim() || '';
      localStorage.setItem('foodly_gemini_api_key', val);
      if (window.foodlyStore && window.foodlyStore.showToast) {
        window.foodlyStore.showToast(val ? 'Gemini API Key saved!' : 'Cleared API Key, using built-in AI', 'success');
      }
      keyPanel?.classList.add('hidden');
    });

    // Quick chip prompts
    document.querySelectorAll('.ai-quick-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const p = chip.dataset.prompt;
        if (input) input.value = p;
        handleUserMessage(p);
      });
    });

    // Submit form
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = input?.value?.trim();
      if (!val) return;
      handleUserMessage(val);
      input.value = '';
    });

    async function handleUserMessage(promptText) {
      if (!messages) return;

      // 1. Append user bubble
      const userBubble = document.createElement('div');
      userBubble.className = 'flex items-start justify-end gap-2 max-w-[92%] ml-auto';
      userBubble.innerHTML = `
        <div class="bg-primary text-white p-3 rounded-2xl rounded-tr-none shadow-sm font-semibold">
          ${promptText}
        </div>
      `;
      messages.appendChild(userBubble);
      messages.scrollTop = messages.scrollHeight;

      // 2. Append thinking indicator
      const thinkingBubble = document.createElement('div');
      thinkingBubble.className = 'flex items-start gap-2.5 max-w-[92%]';
      thinkingBubble.innerHTML = `
        <div class="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 font-bold text-xs">AI</div>
        <div class="bg-purple-50 border border-purple-200 text-purple-900 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
          <span class="material-symbols-outlined text-sm animate-spin text-purple-600">progress_activity</span>
          <span>Consulting campus menu vectors...</span>
        </div>
      `;
      messages.appendChild(thinkingBubble);
      messages.scrollTop = messages.scrollHeight;

      try {
        const response = await window.foodlyApi.askGeminiFoodly(promptText);
        thinkingBubble.remove();

        const aiBubble = document.createElement('div');
        aiBubble.className = 'flex items-start gap-2.5 max-w-[95%]';

        let dishesHtml = '';
        if (response.dishes && response.dishes.length > 0) {
          dishesHtml = `
            <div class="mt-2.5 flex flex-col gap-2">
              ${response.dishes.map(item => `
                <div class="bg-white border border-purple-200/80 rounded-xl p-2.5 flex items-center justify-between gap-3 shadow-2xs hover:border-purple-400 transition-all">
                  <div class="flex items-center gap-2.5 overflow-hidden">
                    <img 
                      src="${item.dish.image}" 
                      alt="${item.dish.name}" 
                      class="w-12 h-12 rounded-lg object-cover shrink-0"
                      onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80'"
                    />
                    <div class="truncate">
                      <h5 class="font-extrabold text-on-surface truncate text-xs">${item.dish.name}</h5>
                      <p class="text-[10px] text-secondary truncate">${item.restaurant.name} &bull; &#8377;${item.dish.price}</p>
                      <span class="text-[9.5px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">🔥 ${item.dish.nutrition ? item.dish.nutrition.calories : 350} kcal</span>
                    </div>
                  </div>
                  <button 
                    onclick="window.foodlyStore.addToCart({ id: '${item.dish.id}', name: '${item.dish.name.replace(/'/g, "\\'")}', price: ${item.dish.price}, isVeg: ${item.dish.veg ? 'true' : 'false'}, calories: ${item.dish.nutrition ? item.dish.nutrition.calories : 350}, protein: ${item.dish.nutrition ? item.dish.nutrition.protein : 18} }, { id: '${item.restaurant.id}', name: '${item.restaurant.name.replace(/'/g, "\\'")}', deliveryFee: 0 }); window.foodlyStore.showToast('Added ${item.dish.name.replace(/'/g, "\\'")} to cart!', 'success');"
                    class="px-2.5 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-white font-extrabold text-[11px] shrink-0 active:scale-95 shadow-sm cursor-pointer flex items-center gap-0.5"
                  >
                    <span>+ Add</span>
                  </button>
                </div>
              `).join('')}
            </div>
          `;
        }

        aiBubble.innerHTML = `
          <div class="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 font-bold text-xs shadow-sm">AI</div>
          <div class="bg-surface-container-low border border-purple-200 text-on-surface p-3.5 rounded-2xl rounded-tl-none shadow-sm leading-relaxed flex-1">
            <p class="font-semibold text-xs text-on-surface">${response.text}</p>
            ${dishesHtml}
          </div>
        `;
        messages.appendChild(aiBubble);
        messages.scrollTop = messages.scrollHeight;

      } catch (err) {
        thinkingBubble.remove();
        const errBubble = document.createElement('div');
        errBubble.className = 'flex items-start gap-2.5 max-w-[92%]';
        errBubble.innerHTML = `
          <div class="w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0 font-bold text-xs">AI</div>
          <div class="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-2xl rounded-tl-none text-xs">
            I ran into a momentary hitch, but you can explore delicious menus directly on <a href="#search" class="font-bold underline">Search</a>!
          </div>
        `;
        messages.appendChild(errBubble);
        messages.scrollTop = messages.scrollHeight;
      }
    }
  }

  // Auto initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAiAssistant);
  } else {
    initAiAssistant();
  }
})();
