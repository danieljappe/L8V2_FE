import React from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  MapPin, 
  Image, 
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  LogOut
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdminSection } from '../../types/admin';

interface SidebarProps {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  unreadMessages: number;
  onLogout: () => void;
}

const menuItems = [
  { id: 'dashboard' as AdminSection, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'events' as AdminSection, label: 'Events', icon: Calendar },
  { id: 'artists' as AdminSection, label: 'Artists', icon: Users },
  { id: 'venues' as AdminSection, label: 'Venues', icon: MapPin },
  { id: 'gallery' as AdminSection, label: 'Gallery', icon: Image },
  { id: 'messages' as AdminSection, label: 'Messages', icon: MessageSquare },
];

export default function Sidebar({ 
  activeSection, 
  onSectionChange, 
  isCollapsed, 
  onToggleCollapse,
  unreadMessages,
  onLogout
}: SidebarProps) {
  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } flex flex-col h-full`}>
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900">Admin Panel</span>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-500" />
          )}
        </button>
      </div>

      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            const showBadge = item.id === 'messages' && unreadMessages > 0;

            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : 'mr-3'} ${
                    isActive ? 'text-blue-600' : 'text-gray-500'
                  }`} />
                  {!isCollapsed && (
                    <>
                      <span className="font-medium">{item.label}</span>
                      {showBadge && (
                        <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                          {unreadMessages}
                        </span>
                      )}
                    </>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200 space-y-2">
        {/* Back to site button */}
        <Link
          to="/"
          className={`flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 ${
            isCollapsed ? 'justify-center' : 'space-x-3'
          }`}
        >
          <ArrowLeft className="w-5 h-5 text-gray-500" />
          {!isCollapsed && <span className="font-medium">Back to Site</span>}
        </Link>

        {/* Logout button */}
        <button
          onClick={onLogout}
          className={`flex items-center px-3 py-2 rounded-lg text-red-700 hover:bg-red-50 hover:text-red-900 transition-all duration-200 ${
            isCollapsed ? 'justify-center' : 'space-x-3'
          }`}
        >
          <LogOut className="w-5 h-5 text-red-500" />
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>

        {/* Admin user info */}
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700">A</span>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
              <p className="text-xs text-gray-500 truncate">admin@example.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 