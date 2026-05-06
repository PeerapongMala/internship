/**
 * Dispatch Center - Core JavaScript
 * Shared state and utilities across all tabs
 */

// ============================================
// Global State
// ============================================
const DispatchState = {
    currentTab: 1,
    currentTagPatientId: null,

    // Patient data store
    patients: {},

    // Track which cards are in which stage
    pendingQueue: [],      // Tab 1: waiting to categorize
    categorizedQueue: [],  // Tab 2: categorized, waiting for team
    teamAssignedQueue: [], // Tab 3: assigned to team

    // Team structure
    teams: {
        'team-general': {
            name: 'ทีมทันตกรรมทั่วไป',
            members: ['dr-ann', 'dr-ben'],
            forCategories: ['general']
        },
        'team-surgery': {
            name: 'ทีมศัลยกรรม',
            members: ['dr-david'],
            forCategories: ['surgery']
        },
        'team-ortho': {
            name: 'ทีมจัดฟัน',
            members: ['dr-cat', 'dr-fah'],
            forCategories: ['ortho']
        },
        'team-cosmetic': {
            name: 'ทีมเสริมความงาม',
            members: ['dr-emmy'],
            forCategories: ['cosmetic']
        }
    },

    // Staff data (all synced with Tab2 assignments, dr-ann also syncs with Tab4)
    staff: {
        'dr-ann': { name: 'Admin แอน', team: 'team-general', online: true, current: 0, closed: 0, color: 'pink' },
        'dr-ben': { name: 'Admin เบน', team: 'team-general', online: true, current: 0, closed: 0, color: 'blue' },
        'dr-cat': { name: 'Admin แคท', team: 'team-ortho', online: true, current: 0, closed: 0, color: 'purple' },
        'dr-david': { name: 'Admin เดวิด', team: 'team-surgery', online: true, current: 0, closed: 0, color: 'green' },
        'dr-emmy': { name: 'Admin เอมมี่', team: 'team-cosmetic', online: true, current: 0, closed: 0, color: 'pink' },
        'dr-fah': { name: 'Admin ฟ้า', team: 'team-ortho', online: false, current: 0, closed: 0, color: 'cyan' }
    },

    // Category names
    categoryNames: {
        'general': 'ทันตกรรมทั่วไป',
        'surgery': 'ศัลยกรรม',
        'ortho': 'จัดฟัน',
        'cosmetic': 'เสริมความงาม',
        'inquiry': 'สอบถามเฉยๆ'
    },

    // Channel names
    channelNames: {
        'line': 'LINE',
        'fb': 'Facebook',
        'ig': 'Instagram',
        'tiktok': 'TikTok',
        'whatsapp': 'WhatsApp'
    }
};

// ============================================
// Initialization
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    initPatientData();
    initModalEvents();
    updateAllCounts();

    // Initialize tab-specific features
    if (typeof initTab1 === 'function') initTab1();
    if (typeof initTab2 === 'function') initTab2();
    if (typeof initTab3 === 'function') initTab3();
    if (typeof initTab4 === 'function') initTab4();
});

function initPatientData() {
    const cards = document.querySelectorAll('#pending-queue .patient-card');
    cards.forEach(card => {
        const id = card.dataset.patient;
        DispatchState.patients[id] = {
            id: id,
            name: card.querySelector('.font-semibold')?.textContent || 'Unknown',
            channel: card.dataset.channel || 'line',
            category: '',
            team: '',
            assignedTo: '',
            status: 'pending'
        };
        DispatchState.pendingQueue.push(id);
    });
}

function initModalEvents() {
    document.getElementById('aiChatModal')?.addEventListener('click', function(e) {
        if (e.target === this) closeAIChatModal();
    });
    document.getElementById('tagEditorModal')?.addEventListener('click', function(e) {
        if (e.target === this) closeTagEditor();
    });
}

// ============================================
// Tab Switching
// ============================================
function switchTab(tabNum) {
    DispatchState.currentTab = tabNum;

    // Update tab buttons in header
    document.querySelectorAll('.tab-btn').forEach((btn, index) => {
        const num = index + 1;
        const circle = btn.querySelector('span:first-child');
        if (num === tabNum) {
            btn.classList.add('active');
            circle?.classList.remove('bg-gray-400');
            circle?.classList.add('bg-dental-500');
        } else {
            btn.classList.remove('active');
            circle?.classList.remove('bg-dental-500');
            circle?.classList.add('bg-gray-400');
        }
    });

    // Update sidebar sub-tabs
    document.querySelectorAll('.dispatch-sub-tab').forEach((tab, index) => {
        const num = index + 1;
        const circle = tab.querySelector('span:first-child');
        if (num === tabNum) {
            tab.classList.add('active-sub');
            tab.classList.remove('text-gray-600');
            tab.classList.add('bg-dental-100', 'text-dental-700', 'font-medium');
            circle?.classList.remove('bg-dental-100', 'text-dental-700');
            circle?.classList.add('bg-dental-500', 'text-white');
        } else {
            tab.classList.remove('active-sub', 'bg-dental-100', 'text-dental-700', 'font-medium');
            tab.classList.add('text-gray-600');
            circle?.classList.remove('bg-dental-500', 'text-white');
            circle?.classList.add('bg-dental-100', 'text-dental-700');
        }
    });

    // Show/hide tab content
    document.querySelectorAll('.tab-content').forEach((content, index) => {
        if (index + 1 === tabNum) {
            content.classList.remove('hidden');
        } else {
            content.classList.add('hidden');
        }
    });

    // Re-initialize drag handlers for current tab
    if (tabNum === 1 && typeof initTab1DragDrop === 'function') {
        initTab1DragDrop();
    } else if (tabNum === 2 && typeof initTab2DragDrop === 'function') {
        initTab2DragDrop();
    } else if (tabNum === 3 && typeof updateMonitorView === 'function') {
        // Refresh Tab 3 monitor data when switching to it
        updateMonitorView();
    } else if (tabNum === 4 && typeof renderTab4Cards === 'function') {
        // Render Tab 4 cards when switching to it
        renderTab4Cards();
        if (typeof updateDemoCounts === 'function') {
            updateDemoCounts();
        }
    }
}

// ============================================
// Tag Management
// ============================================
function openTagEditor(patientId) {
    DispatchState.currentTagPatientId = patientId;
    const modal = document.getElementById('tagEditorModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.getElementById('tagInput')?.focus();
}

function closeTagEditor() {
    const modal = document.getElementById('tagEditorModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    const input = document.getElementById('tagInput');
    if (input) input.value = '';
    DispatchState.currentTagPatientId = null;
}

function selectTag(tagName) {
    if (!DispatchState.currentTagPatientId) return;
    addTagToPatient(DispatchState.currentTagPatientId, tagName);
    closeTagEditor();
}

function addNewTag() {
    const input = document.getElementById('tagInput');
    const tagName = input?.value.trim();
    if (tagName && DispatchState.currentTagPatientId) {
        addTagToPatient(DispatchState.currentTagPatientId, tagName);
        closeTagEditor();
    }
}

function addTagToPatient(patientId, tagName) {
    const tagsContainer = document.getElementById('tags-' + patientId);
    if (!tagsContainer) return;

    const colors = ['blue', 'green', 'purple', 'pink', 'yellow', 'red', 'indigo', 'cyan', 'orange'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    const addButton = tagsContainer.querySelector('button:last-child');
    const newTag = document.createElement('span');
    newTag.className = `tag px-2 py-0.5 bg-${color}-100 text-${color}-700 text-xs rounded flex items-center gap-1`;
    newTag.innerHTML = `${tagName}<button onclick="removeTag(this)" class="hover:text-${color}-900">&times;</button>`;

    if (addButton) {
        tagsContainer.insertBefore(newTag, addButton);
    } else {
        tagsContainer.appendChild(newTag);
    }
}

function removeTag(button) {
    button.parentElement.remove();
}

// ============================================
// AI Chat Modal
// ============================================
function openAIChatModal(patientName) {
    const modal = document.getElementById('aiChatModal');
    const nameEl = document.getElementById('modalPatientName');
    if (nameEl) nameEl.textContent = 'AI ซักประวัติ - คุณ' + patientName;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeAIChatModal() {
    const modal = document.getElementById('aiChatModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

// ============================================
// Count Updates
// ============================================
function updateAllCounts() {
    // Tab 1 count - pending queue
    const pendingCount = DispatchState.pendingQueue.length;
    updateElement('tab1-count', pendingCount);
    updateElement('sidebar-tab1', pendingCount);
    updateElement('queue-count', pendingCount + ' รายการ');
    updateElement('pendingCount', pendingCount);
    updateElement('sidebar-pending', pendingCount);

    // Tab 2 count - categorized queue
    const categorizedCount = DispatchState.categorizedQueue.length;
    updateElement('tab2-count', categorizedCount);
    updateElement('sidebar-tab2', categorizedCount);
    updateElement('categorized-count', categorizedCount + ' รายการ');

    // Tab 3 count - team assigned
    const assignedCount = DispatchState.teamAssignedQueue.length;
    updateElement('tab3-count', assignedCount);
    updateElement('team-assigned-count', assignedCount + ' รายการ');
}

function updateElement(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

// ============================================
// Helper Functions
// ============================================
function getCategoryName(category) {
    return DispatchState.categoryNames[category] || category;
}

function getTeamName(team) {
    return DispatchState.teams[team]?.name || team;
}

function getChannelName(channel) {
    return DispatchState.channelNames[channel] || channel;
}

function getStaffName(staffId) {
    return DispatchState.staff[staffId]?.name || staffId;
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-dental-500 text-white px-6 py-3 rounded-xl shadow-lg z-50';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 2500);
}

// ============================================
// Category Badge Colors
// ============================================
function getCategoryBadgeClass(category) {
    const classes = {
        'general': 'bg-blue-100 text-blue-700',
        'surgery': 'bg-red-100 text-red-700',
        'ortho': 'bg-purple-100 text-purple-700',
        'cosmetic': 'bg-pink-100 text-pink-700',
        'inquiry': 'bg-gray-100 text-gray-700'
    };
    return classes[category] || 'bg-gray-100 text-gray-700';
}
