// Sidebar Component - Dental Plus Chat Management
// Usage: Add <div id="sidebar-container"></div> and include this script

(function() {
  const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
  let isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';

  const menuItems = {
    headAdmin: {
      label: 'Head Admin',
      items: [
        { href: 'ai-chatbot.html', name: 'AI Chatbot', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />' },
        { href: 'chat-dispatch-center.html', name: 'Chat Dispatch', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />' },
        { href: 'chat-management.html', name: 'Chat Management', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />' },
        { href: 'clinic.html', name: 'Clinic Management', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />' },
        { href: 'analytics.html', name: 'Analytics', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />' },
        { href: 'settings.html', name: 'Settings', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />' },
        { href: 'quick-replies.html', name: 'Quick Replies', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />' },
        { href: 'message-logs.html', name: 'Message Logs', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />' }
      ]
    },
    admin: {
      label: 'Admin',
      items: [
        { href: 'chat-task-management.html', name: 'Admin-Chat', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />' }
      ]
    },
    staffClinic: {
      label: 'Staff Clinic',
      items: [
        { href: 'clinic-branch.html', name: 'Clinic On-site', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />' }
      ]
    }
  };

  function createMenuItem(item, collapsed) {
    const isActive = currentPage === item.href;
    const activeClass = isActive
      ? 'bg-dental-50 text-dental-700'
      : 'text-gray-600 transition-all hover:bg-dental-50';

    if (collapsed) {
      return `
        <a href="${item.href}" class="sidebar-menu-item w-full h-10 flex items-center justify-center rounded-xl ${activeClass} cursor-pointer" title="${item.name}">
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            ${item.icon}
          </svg>
        </a>
      `;
    }

    return `
      <a href="${item.href}" class="sidebar-menu-item w-full h-10 flex items-center gap-3 px-4 rounded-xl text-left ${activeClass} cursor-pointer">
        <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          ${item.icon}
        </svg>
        <span class="font-medium">${item.name}</span>
      </a>
    `;
  }

  function createSection(section, collapsed) {
    const itemsHtml = section.items.map(item => createMenuItem(item, collapsed)).join('');

    if (collapsed) {
      return `
        <div class="mb-4">
          <div class="h-6 flex items-center justify-center">
            <div class="w-8 border-t border-gray-200"></div>
          </div>
          <div class="space-y-1">
            ${itemsHtml}
          </div>
        </div>
      `;
    }

    return `
      <div class="mb-4">
        <p class="h-6 flex items-center px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">${section.label}</p>
        <div class="space-y-1">
          ${itemsHtml}
        </div>
      </div>
    `;
  }

  function createSidebar(collapsed) {
    const widthClass = collapsed ? 'w-20' : 'w-64';
    const toggleIcon = collapsed
      ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />'
      : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />';

    const headerContent = collapsed
      ? `
        <div class="h-20 border-b border-gray-100 flex items-center justify-center">
          <div class="w-10 h-10 bg-dental-500 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
        </div>
      `
      : `
        <div class="h-20 border-b border-gray-100 flex items-center px-5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-dental-500 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <h1 class="text-xl font-bold text-dental-700">Dental Plus</h1>
              <p class="text-xs text-gray-400">Chat Management</p>
            </div>
          </div>
        </div>
      `;

    const userSection = collapsed
      ? `
        <div class="h-16 border-t border-gray-100 flex items-center justify-center">
          <div class="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center" title="Admin Ann">
            <span class="text-orange-700 font-semibold">A</span>
          </div>
        </div>
      `
      : `
        <div class="h-16 border-t border-gray-100 flex items-center px-4">
          <div class="flex items-center gap-3 w-full">
            <div class="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <span class="text-orange-700 font-semibold">A</span>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-800">Admin Ann</p>
              <p class="text-xs text-orange-500">Head Admin</p>
            </div>
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
        </div>
      `;

    return `
      <div class="relative h-full">
        <aside id="sidebar" class="${widthClass} bg-white border-r border-gray-200 flex flex-col shadow-sm transition-all duration-300 h-full">
          ${headerContent}

          <nav class="flex-1 p-3 overflow-y-auto">
            ${createSection(menuItems.headAdmin, collapsed)}
            ${createSection(menuItems.admin, collapsed)}
            ${createSection(menuItems.staffClinic, collapsed)}
          </nav>

          ${userSection}
        </aside>

        <!-- Toggle Button - ยื่นออกมาข้างๆ -->
        <button id="sidebar-toggle" class="absolute top-1/2 -right-3 transform -translate-y-1/2 w-6 h-12 bg-white border border-gray-200 rounded-r-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors z-10" title="${collapsed ? 'ขยาย' : 'พับเก็บ'}">
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            ${toggleIcon}
          </svg>
        </button>
      </div>
    `;
  }

  function toggleSidebar() {
    isCollapsed = !isCollapsed;
    localStorage.setItem('sidebarCollapsed', isCollapsed);
    renderSidebar();
  }

  function renderSidebar() {
    const container = document.getElementById('sidebar-container');
    if (container) {
      container.innerHTML = createSidebar(isCollapsed);

      // Add toggle event listener
      const toggleBtn = document.getElementById('sidebar-toggle');
      if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleSidebar);
      }
    }
  }

  // Initialize sidebar when DOM is ready
  document.addEventListener('DOMContentLoaded', renderSidebar);
})();
