/**
 * Dispatch Center - Tab 2: แบ่งทีม (Grid Layout)
 * - Staff drop zones in grid like Tab 1
 * - Drag cards from queue to staff zones
 */

// ============================================
// Tab 2 State
// ============================================
const Tab2State = {
    currentTeamFilter: 'all',
    staffAssignments: {} // { staffId: [patientId, ...] }
};

// ============================================
// Tab 2 Initialization
// ============================================
function initTab2() {
    initStaffAssignments();
    initTab2DragDrop();
    updateStaffCounts();
}

function initStaffAssignments() {
    // Initialize empty arrays for each staff
    Object.keys(DispatchState.staff).forEach(staffId => {
        if (!Tab2State.staffAssignments[staffId]) {
            Tab2State.staffAssignments[staffId] = [];
        }
    });
}

function initTab2DragDrop() {
    if (DispatchState.currentTab !== 2) return;

    // Setup drag on categorized queue cards
    const categorizedQueue = document.getElementById('categorized-queue');
    if (categorizedQueue) {
        categorizedQueue.querySelectorAll('.patient-card').forEach(card => {
            setupTab2CardDrag(card);
        });
    }

    // Setup drop zones on staff grid
    document.querySelectorAll('#staff-grid .drop-area').forEach(zone => {
        setupStaffDropZone(zone);
    });
}

// ============================================
// Drag & Drop for Cards
// ============================================
function setupTab2CardDrag(card) {
    card.removeEventListener('dragstart', handleTab2DragStart);
    card.removeEventListener('dragend', handleTab2DragEnd);

    card.addEventListener('dragstart', handleTab2DragStart);
    card.addEventListener('dragend', handleTab2DragEnd);
}

function handleTab2DragStart(e) {
    this.classList.add('dragging');
    e.dataTransfer.setData('text/plain', this.dataset.patient);
    e.dataTransfer.setData('source', this.closest('#categorized-queue') ? 'categorized-queue' : 'staff-zone');
    e.dataTransfer.effectAllowed = 'move';
}

function handleTab2DragEnd() {
    this.classList.remove('dragging');
    document.querySelectorAll('.drop-area').forEach(z => {
        z.classList.remove('drag-over', 'bg-dental-50', 'border-dental-400');
    });
}

// ============================================
// Staff Drop Zone
// ============================================
function setupStaffDropZone(zone) {
    zone.removeEventListener('dragover', handleStaffZoneDragOver);
    zone.removeEventListener('dragleave', handleStaffZoneDragLeave);
    zone.removeEventListener('drop', handleStaffZoneDrop);

    zone.addEventListener('dragover', handleStaffZoneDragOver);
    zone.addEventListener('dragleave', handleStaffZoneDragLeave);
    zone.addEventListener('drop', handleStaffZoneDrop);
}

function handleStaffZoneDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    this.classList.add('drag-over');
    this.classList.remove('border-gray-200');
    this.classList.add('border-dental-400', 'bg-dental-50');
}

function handleStaffZoneDragLeave(e) {
    if (!this.contains(e.relatedTarget)) {
        this.classList.remove('drag-over', 'border-dental-400', 'bg-dental-50');
        this.classList.add('border-gray-200');
    }
}

function handleStaffZoneDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    this.classList.remove('drag-over', 'border-dental-400', 'bg-dental-50');
    this.classList.add('border-gray-200');

    const patientId = e.dataTransfer.getData('text/plain');
    const source = e.dataTransfer.getData('source');
    const staffId = this.dataset.staff;

    if (!staffId) return;

    // Check if staff is online
    const staff = DispatchState.staff[staffId];
    if (!staff?.online) {
        showNotification('ไม่สามารถมอบหมายงานให้คนที่ออฟไลน์ได้');
        return;
    }

    if (source === 'categorized-queue') {
        const originalCard = document.querySelector(`#categorized-queue [data-patient="${patientId}"]`);
        if (!originalCard) return;

        assignToStaff(patientId, staffId, originalCard);
    }
}

// ============================================
// Team Tab Switching
// ============================================
function switchTeamTab(teamId) {
    Tab2State.currentTeamFilter = teamId;

    // Update tab buttons
    document.querySelectorAll('.team-tab').forEach(tab => {
        if (tab.dataset.team === teamId) {
            tab.classList.remove('bg-gray-100', 'text-gray-600');
            tab.classList.add('bg-dental-500', 'text-white', 'active-team');
        } else {
            tab.classList.add('bg-gray-100', 'text-gray-600');
            tab.classList.remove('bg-dental-500', 'text-white', 'active-team');
        }
    });

    // Filter staff zones
    document.querySelectorAll('#staff-grid .staff-drop-zone').forEach(zone => {
        const staffTeam = zone.dataset.team;
        if (teamId === 'all' || staffTeam === teamId) {
            zone.style.display = '';
        } else {
            zone.style.display = 'none';
        }
    });
}

// ============================================
// Assign to Staff
// ============================================
function assignToStaff(patientId, staffId, originalCard) {
    const patient = DispatchState.patients[patientId];
    if (!patient) return;

    // Update patient data
    patient.assignedTo = staffId;
    patient.status = 'assigned';

    // Update staff workload
    if (DispatchState.staff[staffId]) {
        DispatchState.staff[staffId].current++;
    }

    // Remove from categorized queue state
    const catIndex = DispatchState.categorizedQueue.indexOf(patientId);
    if (catIndex > -1) {
        DispatchState.categorizedQueue.splice(catIndex, 1);
    }

    // Add to staff assignments
    if (!Tab2State.staffAssignments[staffId]) {
        Tab2State.staffAssignments[staffId] = [];
    }
    Tab2State.staffAssignments[staffId].push(patientId);

    // Add to team assigned queue
    DispatchState.teamAssignedQueue.push(patientId);

    // Remove original card from queue
    originalCard.remove();

    // Add card to staff zone
    addCardToStaffZone(patientId, staffId);

    // Check if categorized queue is empty
    const categorizedQueue = document.getElementById('categorized-queue');
    if (categorizedQueue && categorizedQueue.querySelectorAll('.patient-card').length === 0) {
        categorizedQueue.innerHTML = '<div class="empty-message text-center text-gray-400 py-4"><p class="text-xs">ว่าง</p></div>';
    }

    // Update UI
    updateStaffCounts();
    updateAllCounts();

    // Sync with Tab 4 if assigning to dr-ann
    if (staffId === 'dr-ann') {
        console.log('[Tab2] Assigning to dr-ann, calling addCardToTab4 for:', patientId);
        if (typeof addCardToTab4 === 'function') {
            addCardToTab4(patientId);
        } else {
            console.warn('[Tab2] addCardToTab4 function not found!');
        }
    }

    if (typeof updateMonitorView === 'function') {
        updateMonitorView();
    }

    const staffName = getStaffName(staffId);
    showNotification(`มอบหมายให้ ${staffName} แล้ว`);
}

// ============================================
// Add Card to Staff Zone
// ============================================
function addCardToStaffZone(patientId, staffId) {
    const patient = DispatchState.patients[patientId];
    if (!patient) return;

    const dropZone = document.querySelector(`#staff-grid .drop-area[data-staff="${staffId}"]`);
    if (!dropZone) return;

    // Remove empty message if exists
    const emptyMsg = dropZone.querySelector('.empty-message');
    if (emptyMsg) {
        emptyMsg.remove();
    }

    // Create patient card
    const categoryBadge = patient.category ?
        `<span class="text-xs ${getCategoryBadgeClass(patient.category)} px-2 py-0.5 rounded">${getCategoryName(patient.category)}</span>` : '';

    const cardHTML = `
        <div class="patient-card bg-white border-2 border-gray-200 rounded-lg p-2 cursor-grab hover:shadow-md text-xs" draggable="true" data-patient="${patientId}">
            <div class="flex items-center justify-between mb-1">
                <span class="font-medium text-gray-800">${patient.name}</span>
                ${categoryBadge}
            </div>
            <div class="flex items-center justify-between">
                <span class="text-gray-500">${getChannelName(patient.channel)}</span>
            </div>
        </div>
    `;

    dropZone.insertAdjacentHTML('beforeend', cardHTML);

    // Setup drag on new card
    const newCard = dropZone.querySelector(`[data-patient="${patientId}"]`);
    if (newCard) {
        setupTab2CardDrag(newCard);
    }
}

// ============================================
// Update Staff Counts
// ============================================
function updateStaffCounts() {
    Object.keys(DispatchState.staff).forEach(staffId => {
        const assignments = Tab2State.staffAssignments[staffId] || [];
        const countEl = document.querySelector(`.staff-count[data-staff="${staffId}"]`);
        if (countEl) {
            countEl.textContent = assignments.length;
        }
    });
}

// ============================================
// Legacy (kept for compatibility)
// ============================================
function filterByDepartment() {
    // Replaced by switchTeamTab
}
