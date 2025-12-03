import React from 'react';
import { UserRole } from '../types';
import { User, LogOut, ChevronLeft } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  role: UserRole;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, role, onLogout }) => {
  const getHeaderConfig = () => {
    switch (role) {
      case UserRole.PARTNER:
        return {
          title: 'Partner Central',
          badge: 'BUSINESS',
          badgeColor: 'bg-purple-100 text-purple-700',
          borderColor: 'border-purple-200',
          bgColor: 'bg-purple-600'
        };
      case UserRole.ADMIN:
        return {
          title: 'Admin Console',
          badge: 'INTERNAL',
          badgeColor: 'bg-orange-100 text-orange-800',
          borderColor: 'border-orange-200',
          bgColor: 'bg-slate-800'
        };
      case UserRole.CUSTOMER:
      default:
        return {
          title: 'WashConnect',
          badge: '',
          badgeColor: 'hidden',
          borderColor: 'border-blue-200',
          bgColor: 'bg-blue-600'
        };
    }
  };

  const config = getHeaderConfig();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className={`sticky top-0 z-50 bg-white border-b ${config.borderColor} shadow-sm transition-all duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
             {/* Back to Portal Button (Mobile) */}
            <button 
              onClick={onLogout}
              className="p-1 -ml-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              <ChevronLeft size={24} />
            </button>
            
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg ${config.bgColor}`}>
                <div className="w-4 h-4 border-2 border-white rounded-full"></div>
              </div>
              <span className="font-bold text-lg text-slate-800 tracking-tight">
                {config.title}
                {role === UserRole.CUSTOMER && <span className="text-blue-600">.KL</span>}
              </span>
              {config.badge && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${config.badgeColor}`}>
                  {config.badge}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="hidden md:flex flex-col items-end mr-2">
               <span className="text-xs font-semibold text-slate-900">
                  {role === UserRole.CUSTOMER ? 'Guest User' : role === UserRole.PARTNER ? 'Cochin Car Care' : 'Super Admin'}
               </span>
               <span className="text-[10px] text-slate-500 uppercase">{role} VIEW</span>
             </div>
            <button 
              onClick={onLogout}
              className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-red-600 transition-colors bg-slate-50 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-transparent hover:border-red-100"
            >
              <LogOut size={16} />
              <span className="hidden lg:inline">Exit App</span>
            </button>
            <div className="md:hidden">
               <User size={20} className="text-slate-400" />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fade-in">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          &copy; 2024 WashConnect Kerala.
        </div>
      </footer>
    </div>
  );
};

export default Layout;