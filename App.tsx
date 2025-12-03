import React, { useState } from 'react';
import Layout from './components/Layout';
import CustomerView from './views/CustomerView';
import PartnerView from './views/PartnerView';
import AdminView from './views/AdminView';
import { UserRole } from './types';
import { Smartphone, Briefcase, ShieldCheck, ArrowRight } from 'lucide-react';

const App: React.FC = () => {
  // State tracks the currently active "App" (Role), or null for the Portal
  const [currentApp, setCurrentApp] = useState<UserRole | null>(null);

  // Portal View (Landing Page)
  if (!currentApp) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-flex items-center justify-center p-4 bg-blue-600 rounded-2xl mb-6 shadow-xl shadow-blue-200">
              <div className="w-8 h-8 border-4 border-white rounded-full"></div>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              WashConnect<span className="text-blue-600">.KL</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Kerala's first managed marketplace for vehicle washes. <br/>
              Select a portal to enter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {/* Customer Portal Card */}
            <button 
              onClick={() => setCurrentApp(UserRole.CUSTOMER)}
              className="group relative bg-white hover:bg-blue-50 border-2 border-slate-100 hover:border-blue-200 p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl text-left flex flex-col h-full"
            >
              <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                <Smartphone size={28} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Customer App</h2>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed flex-1">
                Book wash slots at verified centers near you. Real-time availability and instant booking.
              </p>
              <div className="flex items-center text-blue-600 font-bold text-sm group-hover:gap-2 transition-all mt-auto">
                Launch App <ArrowRight size={16} className="ml-1" />
              </div>
            </button>

            {/* Partner Portal Card */}
            <button 
              onClick={() => setCurrentApp(UserRole.PARTNER)}
              className="group relative bg-white hover:bg-purple-50 border-2 border-slate-100 hover:border-purple-200 p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl text-left flex flex-col h-full"
            >
              <div className="bg-purple-100 w-14 h-14 rounded-xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
                <Briefcase size={28} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Partner Dashboard</h2>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed flex-1">
                For Shop Owners. Manage walk-ins, view app bookings, and track daily revenue.
              </p>
              <div className="flex items-center text-purple-600 font-bold text-sm group-hover:gap-2 transition-all mt-auto">
                Partner Login <ArrowRight size={16} className="ml-1" />
              </div>
            </button>

            {/* Admin Portal Card */}
            <button 
              onClick={() => setCurrentApp(UserRole.ADMIN)}
              className="group relative bg-white hover:bg-slate-50 border-2 border-slate-100 hover:border-slate-300 p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl text-left flex flex-col h-full"
            >
              <div className="bg-slate-100 w-14 h-14 rounded-xl flex items-center justify-center text-slate-600 mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck size={28} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Admin Console</h2>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed flex-1">
                Internal Use. Verify new shops, manage commissions, and process partner payouts.
              </p>
              <div className="flex items-center text-slate-600 font-bold text-sm group-hover:gap-2 transition-all mt-auto">
                Admin Access <ArrowRight size={16} className="ml-1" />
              </div>
            </button>
          </div>
          
          <div className="mt-16 text-center text-slate-400 text-sm">
            © 2024 WashConnect Kerala. MVP Build v0.2
          </div>
        </div>
      </div>
    );
  }

  // Active App Render
  const renderView = () => {
    switch (currentApp) {
      case UserRole.PARTNER:
        return <PartnerView />;
      case UserRole.ADMIN:
        return <AdminView />;
      case UserRole.CUSTOMER:
      default:
        return <CustomerView />;
    }
  };

  return (
    <Layout role={currentApp} onLogout={() => setCurrentApp(null)}>
      {renderView()}
    </Layout>
  );
};

export default App;