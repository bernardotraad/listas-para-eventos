import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  Users, 
  Calendar, 
  ClipboardList, 
  Settings, 
  CheckSquare,
  UserPlus,
  BarChart3,
  X
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const adminMenuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/events', label: 'Eventos', icon: Calendar },
    { href: '/dashboard/users', label: 'Usuários', icon: Users },
    { href: '/dashboard/reports', label: 'Relatórios', icon: BarChart3 },
    { href: '/dashboard/settings', label: 'Configurações', icon: Settings },
  ];

  const portariaMenuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/checkin', label: 'Check-in', icon: CheckSquare },
    { href: '/dashboard/names', label: 'Cadastro de Nomes', icon: UserPlus },
    { href: '/dashboard/events', label: 'Eventos', icon: Calendar },
  ];

  const menuItems = user?.role === 'admin' ? adminMenuItems : portariaMenuItems;

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        'fixed top-0 left-0 h-full bg-white shadow-lg z-50 w-64 sm:w-72 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto border-r border-gray-200',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex flex-col h-full">
          {/* Logo and Close Button */}
          <div className="p-4 sm:p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                  <span className="text-white font-bold text-sm">L</span>
                </div>
                <div className="min-w-0">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 leading-6 truncate">Dashboard</h2>
                  <p className="text-xs text-gray-500 leading-4 truncate capitalize">{user?.role}</p>
                </div>
              </div>
              
              {/* Close button for mobile */}
              <button
                onClick={onClose}
                className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Menu */}
          <nav className="flex-1 p-3 sm:p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center space-x-3 px-3 py-3 sm:py-2.5 rounded-lg text-sm font-medium transition-all duration-200 min-h-[44px]',
                    isActive(item.href)
                      ? 'bg-blue-100 text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  )}
                >
                  <Icon size={18} className="flex-shrink-0" />
                  <span className="leading-5 truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-3 sm:p-4 border-t border-gray-200 bg-gray-50">
            <div className="text-xs text-gray-500 text-center leading-4">
              Sistema de Gerenciamento
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 