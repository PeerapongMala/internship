/**
 * Dispatch Center - Tab 1: จัดประเภท
 * Categorize incoming chats to departments or close as inquiry
 */

// ============================================
// Tab 1 Initialization
// ============================================
function initTab1() {
    initTab1DragDrop();
    initChannelFilter();
}

// ============================================
// Channel Filter
// ============================================
function initChannelFilter() {
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        const dropdown = document.getElementById('channel-filter-dropdown');
        const btn = document.getElementById('channel-filter-btn');
        if (dropdown && btn && !dropdown.contains(e.target) && !btn.contains(e.target)) {
            dropdown.classList.add('hidden');
        }
    });
}

function toggleChannelFilter() {
    const dropdown = document.getElementById('channel-filter-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('hidden');
    }
}

function filterByChannel() {
    const checkboxes = document.querySelectorAll('.channel-checkbox');
    const selectedChannels = [];

    checkboxes.forEach(cb => {
        if (cb.checked) {
            selectedChannels.push(cb.dataset.channel);
        }
    });

    // Update filter text
    const filterText = document.getElementById('channel-filter-text');
    if (filterText) {
        if (selectedChannels.length === 5) {
            filterText.textContent = 'ทุกช่องทาง';
        } else if (selectedChannels.length === 0) {
            filterText.textContent = 'ไม่เลือกช่องทาง';
        } else {
            filterText.textContent = `${selectedChannels.length} ช่องทาง`;
        }
    }

    // Filter cards
    const cards = document.querySelectorAll('#pending-queue .patient-card');
    cards.forEach(card => {
        const channel = card.dataset.channel;
        if (selectedChannels.includes(channel) || selectedChannels.length === 0) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

function initTab1DragDrop() {
    // Only init when Tab 1 is active
    if (DispatchState.currentTab !== 1) return;

    const pendingQueue = document.getElementById('pending-queue');
    if (!pendingQueue) return;

    // Setup drag on patient cards in pending queue
    pendingQueue.querySelectorAll('.patient-card').forEach(card => {
        setupCardDrag(card);
    });

    // Setup drop zones for Tab 1 (categories)
    document.querySelectorAll('#tab1-content .drop-zone').forEach(zone => {
        setupTab1DropZone(zone);
    });
}

function setupCardDrag(card) {
    // Remove old listeners first to prevent duplicates
    card.removeEventListener('dragstart', handleTab1DragStart);
    card.removeEventListener('dragend', handleTab1DragEnd);

    card.addEventListener('dragstart', handleTab1DragStart);
    card.addEventListener('dragend', handleTab1DragEnd);
}

function handleTab1DragStart(e) {
    this.classList.add('dragging');
    e.dataTransfer.setData('text/plain', this.dataset.patient);
    e.dataTransfer.setData('source', 'pending-queue');
    e.dataTransfer.effectAllowed = 'move';
}

function handleTab1DragEnd() {
    this.classList.remove('dragging');
    // Remove drag-over from all zones
    document.querySelectorAll('.drop-zone').forEach(z => z.classList.remove('drag-over'));
}

function setupTab1DropZone(zone) {
    zone.removeEventListener('dragover', handleTab1DragOver);
    zone.removeEventListener('dragleave', handleTab1DragLeave);
    zone.removeEventListener('drop', handleTab1Drop);

    zone.addEventListener('dragover', handleTab1DragOver);
    zone.addEventListener('dragleave', handleTab1DragLeave);
    zone.addEventListener('drop', handleTab1Drop);
}

function handleTab1DragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    this.classList.add('drag-over');
}

function handleTab1DragLeave(e) {
    // Only remove if leaving the zone entirely
    if (!this.contains(e.relatedTarget)) {
        this.classList.remove('drag-over');
    }
}

function handleTab1Drop(e) {
    e.preventDefault();
    e.stopPropagation();
    this.classList.remove('drag-over');

    const patientId = e.dataTransfer.getData('text/plain');
    const source = e.dataTransfer.getData('source');

    // Only accept drops from pending queue
    if (source !== 'pending-queue') return;

    const category = this.dataset.category;
    if (!category) return;

    // Find and remove the original card
    const originalCard = document.querySelector(`#pending-queue [data-patient="${patientId}"]`);
    if (!originalCard) return;

    // Process the categorization
    categorizePatient(patientId, category, originalCard, this);
}

// ============================================
// Categorize Logic
// ============================================
function categorizePatient(patientId, category, originalCard, dropZone) {
    const patient = DispatchState.patients[patientId];
    if (!patient) return;

    // Update patient data
    patient.category = category;
    patient.status = category === 'inquiry' ? 'closed' : 'categorized';

    // Remove from pending queue state
    const pendingIndex = DispatchState.pendingQueue.indexOf(patientId);
    if (pendingIndex > -1) {
        DispatchState.pendingQueue.splice(pendingIndex, 1);
    }

    // Add mini card to drop zone
    const dropArea = dropZone.querySelector('.drop-area');
    if (dropArea) {
        addMiniCardToDropArea(originalCard, dropArea, category);
    }

    if (category === 'inquiry') {
        // Close case immediately for inquiry
        showNotification('ปิดเคส (สอบถามเฉยๆ) แล้ว');
    } else {
        // Add to categorized queue for Tab 2
        DispatchState.categorizedQueue.push(patientId);

        // Add card to Tab 2's categorized queue
        addCardToCategorizedQueue(patientId, originalCard, category);

        showNotification(`จัดประเภทเป็น ${getCategoryName(category)} แล้ว`);
    }

    // Remove original card from pending queue
    originalCard.remove();

    // Update all counts
    updateAllCounts();
}

function addMiniCardToDropArea(card, dropArea, category) {
    // Clear placeholder if first drop
    const placeholder = dropArea.querySelector('.text-center');
    if (placeholder) {
        dropArea.innerHTML = '';
        dropArea.classList.remove('flex', 'items-center', 'justify-center');
    }

    const name = card.querySelector('.font-semibold')?.textContent || 'Unknown';
    const miniCard = document.createElement('div');
    miniCard.className = 'bg-dental-50 border border-dental-200 rounded-lg p-2 mb-2 text-sm';
    miniCard.innerHTML = `
        <div class="flex items-center justify-between">
            <span class="font-medium text-gray-800">${name}</span>
            <span class="text-xs ${getCategoryBadgeClass(category)} px-1.5 py-0.5 rounded">${getCategoryName(category)}</span>
        </div>
    `;
    dropArea.appendChild(miniCard);
}

function addCardToCategorizedQueue(patientId, originalCard, category) {
    const categorizedQueue = document.getElementById('categorized-queue');
    if (!categorizedQueue) return;

    // Remove empty message if exists
    const emptyMessage = categorizedQueue.querySelector('.empty-message');
    if (emptyMessage) emptyMessage.remove();

    // Get patient data
    const patient = DispatchState.patients[patientId];
    if (!patient) return;

    // Store category and summary in patient data
    patient.category = category;
    const summaryEl = originalCard.querySelector('.bg-gray-50 p.text-sm');
    if (summaryEl) {
        patient.summary = summaryEl.textContent;
    }

    // Create a clean card for Tab 2 (no onclick handlers)
    const cardHTML = `
        <div class="patient-card bg-white border-2 border-gray-200 rounded-xl p-4 cursor-grab hover:shadow-md hover:border-dental-300" draggable="true" data-patient="${patientId}" data-category="${category}">
            <div class="flex items-start justify-between mb-2">
                <div>
                    <p class="font-semibold text-gray-800">${patient.name}</p>
                    <p class="text-xs text-gray-500">${getChannelName(patient.channel)}</p>
                </div>
                <span class="px-2 py-0.5 text-xs rounded ${getCategoryBadgeClass(category)}">${getCategoryName(category)}</span>
            </div>
            <p class="text-xs text-gray-600 truncate">${patient.summary || ''}</p>
        </div>
    `;

    categorizedQueue.insertAdjacentHTML('beforeend', cardHTML);

    // Setup drag for Tab 2
    const newCard = categorizedQueue.querySelector(`[data-patient="${patientId}"]`);
    if (newCard && typeof setupTab2CardDrag === 'function') {
        setupTab2CardDrag(newCard);
    }
}
