/**
 * Message Logs JavaScript
 * View message IN/OUT logs, webhook events, and AI conversations
 */

const MessageLogsState = {
    currentTab: 'messages',
    filters: {
        direction: '',
        channel: '',
        date: '',
        search: ''
    }
};

function initMessageLogs() {
    console.log('Message Logs initialized');
}

// Tab Switching
function switchLogTab(tabName) {
    MessageLogsState.currentTab = tabName;

    // Update tab buttons
    document.querySelectorAll('.log-tab').forEach(tab => {
        if (tab.dataset.tab === tabName) {
            tab.classList.remove('border-gray-200', 'text-gray-600');
            tab.classList.add('border-dental-500', 'bg-dental-50', 'text-dental-700', 'active-log');
        } else {
            tab.classList.add('border-gray-200', 'text-gray-600');
            tab.classList.remove('border-dental-500', 'bg-dental-50', 'text-dental-700', 'active-log');
        }
    });

    // Show/hide tab content
    document.querySelectorAll('.log-tab-content').forEach(content => {
        content.classList.add('hidden');
    });

    const targetContent = document.getElementById(tabName + '-tab');
    if (targetContent) {
        targetContent.classList.remove('hidden');
    }
}

// AI Conversation Modal
function openAIConvoModal() {
    const modal = document.getElementById('ai-convo-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeAIConvoModal() {
    const modal = document.getElementById('ai-convo-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initMessageLogs);
