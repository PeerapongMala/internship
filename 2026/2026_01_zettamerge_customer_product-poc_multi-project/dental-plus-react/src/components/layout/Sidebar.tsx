import { Link, useLocation } from 'react-router-dom';
import {
  Lightbulb,
  ArrowLeftRight,
  MessageCircle,
  Building2,
  BarChart3,
  Settings,
  Zap,
  FileText,
  ClipboardCheck,
  Heart,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import { useSidebar } from '../../context/SidebarContext';
import { MenuItem, MenuSection } from '../../types';

const menuItems: { headAdmin: MenuSection; admin: MenuSection; staffClinic: MenuSection } = {
  headAdmin: {
    label: 'Head Admin',
    items: [
      { href: '/ai-chatbot', name: 'AI Chatbot', icon: Lightbulb },
      { href: '/chat-dispatch-center', name: 'Chat Dispatch', icon: ArrowLeftRight },
      { href: '/chat-management', name: 'Chat Management', icon: MessageCircle },
      { href: '/clinic', name: 'Clinic Management', icon: Building2 },
      { href: '/analytics', name: 'Analytics', icon: BarChart3 },
      { href: '/settings', name: 'Settings', icon: Settings },
      { href: '/quick-replies', name: 'Quick Replies', icon: Zap },
      { href: '/faq', name: 'FAQ', icon: HelpCircle },
      { href: '/message-logs', name: 'Message Logs', icon: FileText },
    ],
  },
  admin: {
    label: 'Admin',
    items: [
      { href: '/chat-task-management', name: 'Admin-Chat', icon: ClipboardCheck },
    ],
  },
  staffClinic: {
    label: 'Staff Clinic',
    items: [
      { href: '/clinic-branch', name: 'Clinic On-site', icon: Building2 },
    ],
  },
};

interface MenuItemProps {
  item: MenuItem;
  isCollapsed: boolean;
  isActive: boolean;
}

function SidebarMenuItem({ item, isCollapsed, isActive }: MenuItemProps) {
  const Icon = item.icon;
  const activeClass = isActive
    ? 'bg-dental-50 text-dental-700'
    : 'text-gray-600 hover:bg-dental-50';

  if (isCollapsed) {
    return (
      <Link
        to={item.href}
        className={`sidebar-menu-item w-full h-10 flex items-center justify-center rounded-xl ${activeClass} cursor-pointer transition-all`}
        title={item.name}
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
      </Link>
    );
  }

  return (
    <Link
      to={item.href}
      className={`sidebar-menu-item w-full h-10 flex items-center gap-3 px-4 rounded-xl text-left ${activeClass} cursor-pointer transition-all`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="font-medium">{item.name}</span>
    </Link>
  );
}

interface MenuSectionProps {
  section: MenuSection;
  isCollapsed: boolean;
  currentPath: string;
}

function SidebarSection({ section, isCollapsed, currentPath }: MenuSectionProps) {
  return (
    <div className="mb-4">
      {isCollapsed ? (
        <div className="h-6 flex items-center justify-center">
          <div className="w-8 border-t border-gray-200"></div>
        </div>
      ) : (
        <p className="h-6 flex items-center px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {section.label}
        </p>
      )}
      <div className="space-y-1">
        {section.items.map((item) => (
          <SidebarMenuItem
            key={item.href}
            item={item}
            isCollapsed={isCollapsed}
            isActive={currentPath === item.href || (currentPath === '/' && item.href === '/ai-chatbot')}
          />
        ))}
      </div>
    </div>
  );
}

export function Sidebar() {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="relative h-full">
      <aside
        className={`${
          isCollapsed ? 'w-20' : 'w-64'
        } bg-white border-r border-gray-200 flex flex-col shadow-sm transition-all duration-300 h-full`}
      >
        {/* Header */}
        {isCollapsed ? (
          <div className="h-20 border-b border-gray-100 flex items-center justify-center">
            <div className="w-10 h-10 bg-dental-500 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
          </div>
        ) : (
          <div className="h-20 border-b border-gray-100 flex items-center px-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-dental-500 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-dental-700">Dental Plus</h1>
                <p className="text-xs text-gray-400">Chat Management</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-3 overflow-y-auto">
          <SidebarSection section={menuItems.headAdmin} isCollapsed={isCollapsed} currentPath={currentPath} />
          <SidebarSection section={menuItems.admin} isCollapsed={isCollapsed} currentPath={currentPath} />
          <SidebarSection section={menuItems.staffClinic} isCollapsed={isCollapsed} currentPath={currentPath} />
        </nav>

        {/* User Section */}
        {isCollapsed ? (
          <div className="h-16 border-t border-gray-100 flex items-center justify-center">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center" title="Admin Ann">
              <span className="text-orange-700 font-semibold">A</span>
            </div>
          </div>
        ) : (
          <div className="h-16 border-t border-gray-100 flex items-center px-4">
            <div className="flex items-center gap-3 w-full">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-700 font-semibold">A</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Admin Ann</p>
                <p className="text-xs text-orange-500">Head Admin</p>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          </div>
        )}
      </aside>

      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute top-1/2 -right-3 transform -translate-y-1/2 w-6 h-12 bg-white border border-gray-200 rounded-r-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
        title={isCollapsed ? 'ขยาย' : 'พับเก็บ'}
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-gray-500" />
        )}
      </button>
    </div>
  );
}
