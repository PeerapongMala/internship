/**
 * Settings Page - JavaScript
 * Manages settings data
 */

// Settings State
const SettingsState = {
    categories: [
        { id: 'general', name: 'ทันตกรรมทั่วไป', description: 'อุดฟัน ขูดหินปูน ถอนฟัน', color: 'blue', active: true },
        { id: 'surgery', name: 'ศัลยกรรม', description: 'ผ่าฟันคุด ศัลยกรรมช่องปาก', color: 'red', active: true },
        { id: 'ortho', name: 'จัดฟัน', description: 'ทันตกรรมจัดฟัน Invisalign', color: 'purple', active: true },
        { id: 'cosmetic', name: 'เสริมความงาม', description: 'วีเนียร์ ฟอกสีฟัน', color: 'pink', active: true },
        { id: 'inquiry', name: 'สอบถามเฉยๆ', description: 'สอบถามข้อมูล ไม่ต้องการรักษา', color: 'gray', active: true }
    ],
    teams: [
        { id: 'team-general', name: 'ทีมทันตกรรมทั่วไป', category: 'general', members: ['dr-ann', 'dr-ben'], color: 'blue' },
        { id: 'team-surgery', name: 'ทีมศัลยกรรม', category: 'surgery', members: ['dr-david'], color: 'red' },
        { id: 'team-ortho', name: 'ทีมจัดฟัน', category: 'ortho', members: ['dr-cat', 'dr-fa'], color: 'purple' },
        { id: 'team-cosmetic', name: 'ทีมเสริมความงาม', category: 'cosmetic', members: ['dr-emmy'], color: 'pink' }
    ],
    members: [
        { id: 'dr-ann', name: 'Admin แอน', team: 'team-general', status: 'online' },
        { id: 'dr-ben', name: 'Admin เบน', team: 'team-general', status: 'online' },
        { id: 'dr-cat', name: 'Admin แคท', team: 'team-ortho', status: 'online' },
        { id: 'dr-david', name: 'Admin เดวิด', team: 'team-surgery', status: 'online' },
        { id: 'dr-emmy', name: 'Admin เอมมี่', team: 'team-cosmetic', status: 'online' },
        { id: 'dr-fa', name: 'Admin ฟ้า', team: 'team-ortho', status: 'offline' }
    ],
    channels: [
        { id: 'line', name: 'LINE Official', status: 'connected', icon: 'L', color: 'green' },
        { id: 'facebook', name: 'Facebook Messenger', status: 'connected', icon: 'F', color: 'blue' },
        { id: 'instagram', name: 'Instagram DM', status: 'connected', icon: 'I', color: 'pink' },
        { id: 'tiktok', name: 'TikTok', status: 'connected', icon: 'T', color: 'gray' },
        { id: 'whatsapp', name: 'WhatsApp', status: 'disconnected', icon: 'W', color: 'green' }
    ]
};

function initSettings() {
    console.log('Settings initialized');
}

// ============================================
// Tab Switching
// ============================================
function switchSettingsTab(tabNumber) {
    // Update tab buttons
    document.querySelectorAll('.settings-tab').forEach((tab, index) => {
        if (index + 1 === tabNumber) {
            tab.classList.remove('bg-gray-100', 'text-gray-600');
            tab.classList.add('bg-dental-500', 'text-white', 'active');
        } else {
            tab.classList.add('bg-gray-100', 'text-gray-600');
            tab.classList.remove('bg-dental-500', 'text-white', 'active');
        }
    });

    // Hide all tab contents
    document.querySelectorAll('.settings-tab-content').forEach(content => {
        content.classList.add('hidden');
    });

    // Show target tab content
    const targetTab = document.getElementById(`settings-tab-${tabNumber}`);
    if (targetTab) {
        targetTab.classList.remove('hidden');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initSettings);
