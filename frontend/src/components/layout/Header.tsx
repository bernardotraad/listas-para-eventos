import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components';
import { LogOut, User, Menu } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  onMenuToggle?: () => void;
  showMenuButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, showMenuButton = false }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 sm:py-4">
          <div className="flex items-center space-x-3 sm:space-x-4">
            {showMenuButton && (
              <button
                onClick={onMenuToggle}
                className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Toggle menu"
              >
                <Menu size={20} />
              </button>
            )}
            
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity duration-200">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-6 truncate">Listas para Eventos</h1>
                <p className="text-xs text-gray-500 leading-4 truncate">Sistema de Gerenciamento</p>
              </div>
            </Link>
          </div>

          {user && (
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden sm:flex items-center space-x-3 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <User size={16} className="text-gray-400 flex-shrink-0" />
                  <span className="font-medium text-gray-700 truncate max-w-[120px]">{user.full_name}</span>
                </div>
                <span className="text-gray-300">|</span>
                <span className="capitalize font-medium text-gray-700">{user.role}</span>
              </div>
              
              {/* Mobile user info */}
              <div className="sm:hidden flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User size={16} className="text-blue-600" />
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                icon={<LogOut size={16} />}
                className="hover:bg-red-50 hover:text-red-600 min-w-[44px] min-h-[44px] p-2"
              >
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 