/**
 * Dispatch Center - Tab 3: ข้อมูลรายทีม
 * View-only monitoring of staff workload per team
 * Syncs with Tab 4 (ข้อมูลรายบุคคล) for Admin แอน's data
 */

// ============================================
// Tab 3 Initialization
// ============================================
function initTab3() {
    updateMonitorView();
    initTab3Filter();
}

// ============================================
// Monitor View Update
// ============================================
function updateMonitorView() {
    // Update each staff card in monitor view
    Object.keys(DispatchState.staff).forEach(staffId => {
        const staff = DispatchState.staff[staffId];
        const card = document.querySelector(`.staff-monitor-card[data-staff="${staffId}"]`);
        if (!card) return;

        // Get real data - for Admin แอน use Tab4State, for others use Tab2State
        let currentCount = 0;
        let closedCount = 0;

        if (staffId === 'dr-ann' && typeof Tab4State !== 'undefined') {
            // Use Tab4State for Admin แอน (ข้อมูลรายบุคคล tab)
            currentCount = Tab4State.tasks.do.length + Tab4State.tasks.doing.length;
            closedCount = Tab4State.tasks.done.length;
        } else if (typeof Tab2State !== 'undefined' && Tab2State.staffAssignments[staffId]) {
            // Use Tab2State for other staff
            currentCount = Tab2State.staffAssignments[staffId].length;
            closedCount = staff.closed || 0;
        } else {
            currentCount = staff.current || 0;
            closedCount = staff.closed || 0;
        }

        // Update current count
        const currentEl = card.querySelector('.current-count');
        if (currentEl) currentEl.textContent = currentCount;

        // Update closed count
        const closedEl = card.querySelector('.closed-count');
        if (closedEl) closedEl.textContent = closedCount;

        // Update progress bar
        const total = currentCount + closedCount;
        const progress = total > 0 ? Math.round((closedCount / total) * 100) : 0;

        const progressBar = card.querySelector('.progress-bar-fill');
        if (progressBar) {
            progressBar.style.width = progress + '%';

            // Change color based on progress
            progressBar.classList.remove('bg-red-500', 'bg-yellow-500', 'bg-green-500');
            if (progress >= 70) {
                progressBar.classList.add('bg-green-500');
            } else if (progress >= 40) {
                progressBar.classList.add('bg-yellow-500');
            } else {
                progressBar.classList.add('bg-red-500');
            }
        }

        // Update assigned cards list
        const cardsList = card.querySelector('.assigned-cards-list');
        if (cardsList) {
            updateStaffCardsList(staffId, cardsList);
        }
    });
}

function updateStaffCardsList(staffId, container) {
    let assignedPatients = [];

    if (staffId === 'dr-ann' && typeof Tab4State !== 'undefined') {
        // For Admin แอน, show DO and DOING tasks from Tab4
        const doTasks = Tab4State.tasks.do.map(id => ({ id, name: getCardPatientName(id), status: 'DO' }));
        const doingTasks = Tab4State.tasks.doing.map(id => ({ id, name: getCardPatientName(id), status: 'DOING' }));
        assignedPatients = [...doingTasks, ...doTasks];
    } else {
        // For others, show from DispatchState.patients
        assignedPatients = Object.values(DispatchState.patients)
            .filter(p => p.assignedTo === staffId && p.status === 'assigned')
            .map(p => ({ id: p.id, name: p.name, category: p.category, status: 'assigned' }));
    }

    if (assignedPatients.length > 0) {
        container.innerHTML = assignedPatients.map(p => {
            const statusBadge = p.status === 'DOING'
                ? '<span class="text-yellow-600 bg-yellow-100 px-1 rounded text-xs">DOING</span>'
                : p.status === 'DO'
                ? '<span class="text-blue-600 bg-blue-100 px-1 rounded text-xs">DO</span>'
                : `<span class="${getCategoryBadgeClass(p.category)} px-1 rounded text-xs">${getCategoryName(p.category)}</span>`;

            return `
                <div class="text-xs bg-gray-50 rounded px-2 py-1.5 flex items-center justify-between">
                    <span class="font-medium">${p.name}</span>
                    ${statusBadge}
                </div>
            `;
        }).join('');
    } else {
        container.innerHTML = '<p class="text-xs text-gray-400">ไม่มีงานในคิว</p>';
    }
}

// Helper to get patient name for Tab4 demo cards
function getCardPatientNameForTab3(cardId) {
    if (typeof getCardPatientName === 'function') {
        return getCardPatientName(cardId);
    }
    const names = {
        'demo-1': 'คุณสมชาย',
        'demo-2': 'คุณวิภา',
        'demo-3': 'คุณพิมพ์',
        'demo-4': 'คุณลิซ่า',
        'demo-5': 'คุณแก้ว',
        'demo-6': 'คุณนิด',
        'demo-7': 'คุณต้น',
        'demo-8': 'คุณฝน',
        'demo-9': 'คุณเอ'
    };
    return names[cardId] || 'Unknown';
}

// ============================================
// Filter
// ============================================
function initTab3Filter() {
    // Filter is already in HTML with onchange
}

function filterMonitorByTeam() {
    const filter = document.getElementById('monitor-team-filter')?.value || 'all';

    document.querySelectorAll('.staff-monitor-card').forEach(card => {
        const staffTeam = card.dataset.team;
        if (filter === 'all' || staffTeam === filter) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}
