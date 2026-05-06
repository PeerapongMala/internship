/**
 * Dispatch Center - Tab 4: ข้อมูลรายบุคคล (Demo Admin แอน)
 * - Shows cards assigned to Admin แอน from Tab 2
 * - DO / DOING / DONE workflow
 */

// ============================================
// Tab 4 State - Synced with Tab 2 for dr-ann
// ============================================
const Tab4State = {
    tasks: {
        do: [],      // Cards from Tab 2 assigned to dr-ann
        doing: [],
        done: []
    }
};

// ============================================
// Tab 4 Initialization
// ============================================
function initTab4() {
    // Sync with Tab 2 assignments for dr-ann
    syncTab4WithTab2();
    renderTab4Cards();
    updateDemoCounts();
}

// ============================================
// Sync Tab 4 with Tab 2 Assignments
// ============================================
function syncTab4WithTab2() {
    if (typeof Tab2State === 'undefined') return;

    // Get all cards assigned to dr-ann from Tab 2
    const drAnnAssignments = Tab2State.staffAssignments['dr-ann'] || [];

    // Add new assignments to DO (if not already in any list)
    drAnnAssignments.forEach(patientId => {
        const inDo = Tab4State.tasks.do.includes(patientId);
        const inDoing = Tab4State.tasks.doing.includes(patientId);
        const inDone = Tab4State.tasks.done.includes(patientId);

        if (!inDo && !inDoing && !inDone) {
            Tab4State.tasks.do.push(patientId);
        }
    });
}

// ============================================
// Add Card to Tab 4 (called from Tab 2)
// ============================================
function addCardToTab4(patientId) {
    // Add to DO list if not already present
    if (!Tab4State.tasks.do.includes(patientId) &&
        !Tab4State.tasks.doing.includes(patientId) &&
        !Tab4State.tasks.done.includes(patientId)) {
        Tab4State.tasks.do.push(patientId);

        // Re-render if Tab 4 is visible
        if (DispatchState.currentTab === 4) {
            renderTab4Cards();
        }

        // Always update counts (important: this updates #tab4-count badge)
        updateDemoCounts();

        // Sync Tab 3
        if (typeof updateMonitorView === 'function') {
            updateMonitorView();
        }
    }
}

// ============================================
// Render Tab 4 Cards
// ============================================
function renderTab4Cards() {
    renderTab4Column('do', 'demo-do-list', 'border-blue-200');
    renderTab4Column('doing', 'demo-doing-list', 'border-yellow-200');
    renderTab4Column('done', 'demo-done-list', 'border-green-200');
}

function renderTab4Column(status, containerId, borderClass) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const tasks = Tab4State.tasks[status] || [];

    if (tasks.length === 0) {
        container.innerHTML = '<div class="empty-message text-center text-gray-300 py-8 text-xs">ยังไม่มีรายการ</div>';
        return;
    }

    container.innerHTML = tasks.map(patientId => {
        const patient = DispatchState.patients[patientId];
        const name = patient?.name || patientId;
        const channel = patient ? getChannelName(patient.channel) : '';
        const category = patient?.category;
        const categoryBadge = category
            ? `<span class="text-xs ${getCategoryBadgeClass(category)} px-2 py-0.5 rounded">${getCategoryName(category)}</span>`
            : '';

        if (status === 'done') {
            return `
                <div class="patient-card bg-white ${borderClass} border-2 rounded-xl p-3 opacity-75" data-patient="${patientId}">
                    <div class="flex items-start justify-between mb-2">
                        <div>
                            <p class="font-semibold text-gray-800 text-sm">${name}</p>
                            <p class="text-xs text-gray-500">${channel}</p>
                        </div>
                        <span class="text-xs text-green-600">✓ เสร็จสิ้น</span>
                    </div>
                    ${categoryBadge}
                </div>
            `;
        } else if (status === 'doing') {
            return `
                <div class="patient-card bg-white ${borderClass} border-2 rounded-xl p-3 cursor-grab" draggable="true" data-patient="${patientId}">
                    <div class="flex items-start justify-between mb-2">
                        <div>
                            <p class="font-semibold text-gray-800 text-sm">${name}</p>
                            <p class="text-xs text-gray-500">${channel}</p>
                        </div>
                        ${categoryBadge}
                    </div>
                    <div class="flex gap-2">
                        <button onclick="moveDemoCard('${patientId}', 'do')" class="flex-1 px-2 py-1.5 bg-blue-100 text-blue-700 text-xs rounded-lg hover:bg-blue-200">← DO</button>
                        <button onclick="moveDemoCard('${patientId}', 'done')" class="flex-1 px-2 py-1.5 bg-green-100 text-green-700 text-xs rounded-lg hover:bg-green-200">DONE →</button>
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="patient-card bg-white ${borderClass} border-2 rounded-xl p-3 cursor-grab" draggable="true" data-patient="${patientId}">
                    <div class="flex items-start justify-between mb-2">
                        <div>
                            <p class="font-semibold text-gray-800 text-sm">${name}</p>
                            <p class="text-xs text-gray-500">${channel}</p>
                        </div>
                        ${categoryBadge}
                    </div>
                    <button onclick="moveDemoCard('${patientId}', 'doing')" class="w-full px-3 py-1.5 bg-yellow-100 text-yellow-700 text-xs rounded-lg hover:bg-yellow-200">→ DOING</button>
                </div>
            `;
        }
    }).join('');
}

// ============================================
// Move Demo Card Between Columns
// ============================================
function moveDemoCard(cardId, targetStatus) {
    // Find current status
    let currentStatus = null;
    for (const status of ['do', 'doing', 'done']) {
        if (Tab4State.tasks[status].includes(cardId)) {
            currentStatus = status;
            break;
        }
    }

    if (!currentStatus || currentStatus === targetStatus) return;

    // Remove from current status
    const currentIndex = Tab4State.tasks[currentStatus].indexOf(cardId);
    if (currentIndex > -1) {
        Tab4State.tasks[currentStatus].splice(currentIndex, 1);
    }

    // Add to target status
    Tab4State.tasks[targetStatus].push(cardId);

    // Re-render
    renderTab4Cards();
    updateDemoCounts();

    // Sync with Tab 3 Monitor
    if (typeof updateMonitorView === 'function') {
        updateMonitorView();
    }

    // Show notification
    const statusNames = { do: 'รอดำเนินการ', doing: 'กำลังทำ', done: 'เสร็จแล้ว' };
    showNotification(`เปลี่ยนสถานะเป็น ${statusNames[targetStatus]}`);
}

// ============================================
// Update Demo Counts
// ============================================
function updateDemoCounts() {
    const doCount = Tab4State.tasks.do.length;
    const doingCount = Tab4State.tasks.doing.length;
    const doneCount = Tab4State.tasks.done.length;
    const totalActive = doCount + doingCount;

    // Update header totals
    const doTotal = document.getElementById('demo-do-total');
    const doingTotal = document.getElementById('demo-doing-total');
    const doneTotal = document.getElementById('demo-done-total');

    if (doTotal) doTotal.textContent = doCount;
    if (doingTotal) doingTotal.textContent = doingCount;
    if (doneTotal) doneTotal.textContent = doneCount;

    // Update Tab 4 button badge (notification)
    const tab4Count = document.getElementById('tab4-count');
    if (tab4Count) {
        tab4Count.textContent = totalActive;
    }

    // Update column count badges
    document.querySelectorAll('#tab4-content .bg-blue-50 .bg-blue-200').forEach(el => el.textContent = doCount);
    document.querySelectorAll('#tab4-content .bg-yellow-50 .bg-yellow-200').forEach(el => el.textContent = doingCount);
    document.querySelectorAll('#tab4-content .bg-green-50 .bg-green-200').forEach(el => el.textContent = doneCount);
}

// ============================================
// Helper: Get Card Patient Name (legacy support)
// ============================================
function getCardPatientName(cardId) {
    const patient = DispatchState.patients[cardId];
    if (patient) return patient.name;
    return cardId;
}
