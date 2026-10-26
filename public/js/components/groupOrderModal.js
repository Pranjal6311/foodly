// public/js/components/groupOrderModal.js - Real-Time Group Ordering & Instant UPI Bill Split
(function () {
  let isModalOpen = false;
  let currentRoom = null;
  let activeTab = 'create'; // 'create' | 'join' | 'active'

  function openModal(tab = 'create') {
    isModalOpen = true;
    activeTab = tab;
    renderModal();
  }

  function closeModal() {
    isModalOpen = false;
    renderModal();
  }

  async function refreshActiveRoom() {
    if (!currentRoom || !currentRoom.code) return;
    try {
      const res = await window.foodlyApi.getGroupRoom(currentRoom.code);
      if (res.success) {
        currentRoom = res.data;
        renderModal();
      }
    } catch (e) {
      console.warn("Could not refresh group room", e);
    }
  }

  function renderModal() {
    const container = document.getElementById('group-order-modal-container');
    if (!container) return;

    if (!isModalOpen) {
      container.innerHTML = '';
      return;
    }

    container.innerHTML = `
      <div class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div id="group-modal-backdrop" class="fixed inset-0 bg-on-surface/50 backdrop-blur-sm transition-opacity"></div>

        <!-- Modal Card -->
        <div class="relative bg-surface-container-lowest rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-surface-variant z-10 fade-in">
          <!-- Header -->
          <div class="flex items-center justify-between pb-4 border-b border-surface-variant">
            <div class="flex items-center gap-2.5">
              <div class="w-10 h-10 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary">
                <span class="material-symbols-outlined text-2xl">groups</span>
              </div>
              <div>
                <h3 class="text-xl font-extrabold text-on-surface flex items-center gap-1.5">
                  <span>Campus Group Order</span>
                  <span class="text-base select-none">🥢</span>
                </h3>
                <p class="text-xs text-on-surface-variant font-semibold">Order together for Garba nights &amp; Vrat feasts • Split bill via UPI</p>
              </div>
            </div>
            <button id="close-group-modal" class="p-2 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <!-- Body -->
          <div class="py-5">
            ${currentRoom ? `
              <!-- Active Room View -->
              <div class="flex flex-col gap-5">
                <div class="p-4 rounded-2xl bg-primary-fixed/30 border border-primary/30 flex items-center justify-between">
                  <div>
                    <span class="text-xs font-bold text-primary uppercase tracking-wider">Active Group Room</span>
                    <h4 class="text-2xl font-black text-on-surface tracking-widest mt-0.5">${currentRoom.code}</h4>
                  </div>
                  <button 
                    id="copy-room-code-btn"
                    class="px-3.5 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                  >
                    <span class="material-symbols-outlined text-sm">content_copy</span>
                    <span>Copy Code</span>
                  </button>
                </div>

                <!-- Room Members -->
                <div>
                  <h5 class="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 flex items-center gap-1">
                    <span class="material-symbols-outlined text-sm">person</span>
                    <span>Room Members (${currentRoom.members ? currentRoom.members.length : 1})</span>
                  </h5>
                  <div class="flex flex-wrap gap-2">
                    ${(currentRoom.members || []).map(m => `
                      <span class="px-3 py-1.5 rounded-full bg-surface-container text-xs font-bold text-on-surface flex items-center gap-1 border border-surface-variant">
                        <span class="w-2 h-2 rounded-full bg-tertiary"></span>
                        <span>${m}</span>
                        ${m === currentRoom.hostName ? '<span class="text-[10px] text-primary font-black ml-0.5">(Host)</span>' : ''}
                      </span>
                    `).join('')}
                  </div>
                </div>

                <!-- Per-Person Bill Split & UPI Payment Share -->
                <div class="border border-surface-variant rounded-2xl p-4 bg-surface-container-low">
                  <div class="flex items-center justify-between mb-3">
                    <h5 class="text-xs font-bold text-on-surface uppercase tracking-wider flex items-center gap-1">
                      <span class="material-symbols-outlined text-sm text-primary">payments</span>
                      <span>Live UPI Bill Split</span>
                    </h5>
                    <span class="text-xs font-black text-tertiary bg-tertiary-container/20 px-2 py-0.5 rounded">₹0 Delivery Fee (Campus Batch)</span>
                  </div>

                  <div class="flex flex-col gap-2.5 max-h-48 overflow-y-auto pr-1">
                    ${currentRoom.memberSplits ? Object.entries(currentRoom.memberSplits).map(([member, split]) => `
                      <div class="p-2.5 rounded-xl bg-surface-container-lowest border border-surface-variant/60 flex items-center justify-between text-xs">
                        <div>
                          <strong class="text-on-surface text-sm block">${member}</strong>
                          <span class="text-[11px] text-on-surface-variant">${split.items.length} items (${split.items.map(i => i.name).join(', ') || 'Selecting...'})</span>
                        </div>
                        <div class="flex items-center gap-2">
                          <span class="font-extrabold text-sm text-primary">&#8377;${split.totalShare}</span>
                          ${split.totalShare > 0 ? `
                            <a 
                              href="${split.upiPaymentLink}" 
                              class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1"
                              title="Pay share via GPay / PhonePe / Paytm"
                            >
                              <span>UPI Pay</span>
                            </a>
                          ` : ''}
                        </div>
                      </div>
                    `).join('') : '<p class="text-xs text-secondary">No items added yet. Browse restaurants and click "Add to Room"!</p>'}
                  </div>

                  <div class="mt-3 pt-3 border-t border-surface-variant flex justify-between items-center text-sm font-extrabold">
                    <span>Grand Total:</span>
                    <span class="text-primary text-base">&#8377;${currentRoom.grandTotal || 0}</span>
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex gap-2.5">
                  <button 
                    id="refresh-room-btn" 
                    class="flex-1 py-2.5 rounded-xl border border-surface-variant hover:bg-surface-container text-xs font-bold text-on-surface flex items-center justify-center gap-1"
                  >
                    <span class="material-symbols-outlined text-sm">refresh</span>
                    <span>Refresh</span>
                  </button>
                  <button 
                    id="exit-room-btn" 
                    class="py-2.5 px-4 rounded-xl border border-error/30 text-error hover:bg-error-container/20 text-xs font-bold"
                  >
                    Leave Room
                  </button>
                </div>
              </div>
            ` : `
              <!-- Tabs: Host or Join -->
              <div class="flex rounded-xl bg-surface-container-low p-1 mb-5">
                <button 
                  id="tab-create-room" 
                  class="flex-1 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'create' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant'}"
                >
                  Host New Room
                </button>
                <button 
                  id="tab-join-room" 
                  class="flex-1 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'join' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant'}"
                >
                  Join with Code
                </button>
              </div>

              ${activeTab === 'create' ? `
                <div class="flex flex-col gap-4">
                  <div>
                    <label class="block text-xs font-bold text-on-surface mb-1.5">Your Name (Host)</label>
                    <input 
                      id="host-name-input" 
                      type="text" 
                      placeholder="e.g. Rahul (GL Bajaj)" 
                      value="Host"
                      class="w-full bg-surface-container-low border border-surface-variant focus:border-primary rounded-xl px-4 py-2.5 text-sm font-semibold outline-none"
                    />
                  </div>
                  <div class="p-3.5 rounded-xl bg-surface-container-low border border-surface-variant text-xs text-on-surface-variant leading-relaxed">
                    💡 <strong>How it works:</strong> Create a room &rarr; Share the 6-character code with your roommates &rarr; Everyone adds their food &rarr; Foodly calculates the split and gives everyone instant UPI payment links!
                  </div>
                  <button 
                    id="submit-create-room-btn"
                    class="w-full py-3 bg-primary-container hover:bg-primary text-white font-extrabold text-sm rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                  >
                    <span>Generate Group Room</span>
                    <span class="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              ` : `
                <div class="flex flex-col gap-4">
                  <div>
                    <label class="block text-xs font-bold text-on-surface mb-1.5">Room Code</label>
                    <input 
                      id="join-code-input" 
                      type="text" 
                      placeholder="e.g. GLB-409" 
                      class="w-full bg-surface-container-low border border-surface-variant focus:border-primary rounded-xl px-4 py-2.5 text-sm font-bold tracking-widest uppercase outline-none"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-on-surface mb-1.5">Your Name</label>
                    <input 
                      id="join-name-input" 
                      type="text" 
                      placeholder="e.g. Aman / Priya" 
                      class="w-full bg-surface-container-low border border-surface-variant focus:border-primary rounded-xl px-4 py-2.5 text-sm font-semibold outline-none"
                    />
                  </div>
                  <button 
                    id="submit-join-room-btn"
                    class="w-full py-3 bg-primary-container hover:bg-primary text-white font-extrabold text-sm rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                  >
                    <span>Join Room</span>
                    <span class="material-symbols-outlined text-sm">login</span>
                  </button>
                </div>
              `}
            `}
          </div>
        </div>
      </div>
    `;

    // Event wiring
    document.getElementById('group-modal-backdrop')?.addEventListener('click', closeModal);
    document.getElementById('close-group-modal')?.addEventListener('click', closeModal);

    document.getElementById('tab-create-room')?.addEventListener('click', () => {
      activeTab = 'create';
      renderModal();
    });

    document.getElementById('tab-join-room')?.addEventListener('click', () => {
      activeTab = 'join';
      renderModal();
    });

    document.getElementById('submit-create-room-btn')?.addEventListener('click', async () => {
      const name = document.getElementById('host-name-input')?.value.trim() || 'Host';
      try {
        const res = await window.foodlyApi.createGroupRoom(name);
        if (res.success) {
          currentRoom = res.data;
          window.foodlyStore.activeGroupRoom = currentRoom;
          window.foodlyStore.showToast(`Group Room ${currentRoom.code} created!`, 'success');
          renderModal();
        }
      } catch (err) {
        window.foodlyStore.showToast(err.message, 'error');
      }
    });

    document.getElementById('submit-join-room-btn')?.addEventListener('click', async () => {
      const code = document.getElementById('join-code-input')?.value.trim().toUpperCase();
      const name = document.getElementById('join-name-input')?.value.trim();
      if (!code || !name) {
        window.foodlyStore.showToast('Please enter both Room Code and your Name', 'error');
        return;
      }
      try {
        const res = await window.foodlyApi.joinGroupRoom(code, name);
        if (res.success) {
          const detailRes = await window.foodlyApi.getGroupRoom(code);
          currentRoom = detailRes.data;
          window.foodlyStore.activeGroupRoom = currentRoom;
          window.foodlyStore.showToast(`Joined room ${code} as ${name}!`, 'success');
          renderModal();
        }
      } catch (err) {
        window.foodlyStore.showToast(err.message, 'error');
      }
    });

    document.getElementById('copy-room-code-btn')?.addEventListener('click', () => {
      if (currentRoom) {
        navigator.clipboard.writeText(currentRoom.code);
        window.foodlyStore.showToast(`Room Code ${currentRoom.code} copied to clipboard!`, 'success');
      }
    });

    document.getElementById('refresh-room-btn')?.addEventListener('click', refreshActiveRoom);

    document.getElementById('exit-room-btn')?.addEventListener('click', () => {
      currentRoom = null;
      window.foodlyStore.activeGroupRoom = null;
      window.foodlyStore.showToast('Left group room', 'info');
      renderModal();
    });
  }

  window.foodlyGroupOrder = {
    openModal,
    closeModal,
    getActiveRoom: () => currentRoom,
    addItemToCurrentRoom: async (item, memberName) => {
      if (!currentRoom) return false;
      const res = await window.foodlyApi.addItemToGroupRoom(currentRoom.code, item, memberName || currentRoom.hostName);
      if (res.success) {
        await refreshActiveRoom();
        return true;
      }
      return false;
    }
  };
})();
