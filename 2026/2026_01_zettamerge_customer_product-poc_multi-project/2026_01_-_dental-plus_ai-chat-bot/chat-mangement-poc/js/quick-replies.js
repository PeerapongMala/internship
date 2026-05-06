/**
 * Quick Replies JavaScript
 * Manage quick reply templates
 */

const QuickRepliesState = {
    currentCategory: 'all',
    replies: []
};

function initQuickReplies() {
    console.log('Quick Replies initialized');
}

// Category Switching
function switchCategory(category) {
    QuickRepliesState.currentCategory = category;

    // Update tab buttons
    document.querySelectorAll('.quick-tab').forEach(tab => {
        if (tab.dataset.category === category) {
            tab.classList.remove('bg-gray-100', 'text-gray-600');
            tab.classList.add('bg-dental-500', 'text-white');
        } else {
            tab.classList.add('bg-gray-100', 'text-gray-600');
            tab.classList.remove('bg-dental-500', 'text-white');
        }
    });

    // Filter cards
    document.querySelectorAll('.quick-reply-card').forEach(card => {
        const cardCategory = card.dataset.category;
        if (category === 'all' || cardCategory === category) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

// Modal Functions
function openAddModal() {
    const modal = document.getElementById('quick-reply-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeModal() {
    const modal = document.getElementById('quick-reply-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initQuickReplies);
