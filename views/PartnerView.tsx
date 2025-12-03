import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Smartphone, 
  Users, 
  CheckSquare, 
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { Booking, BookingSource, BookingStatus, RevenueStats, Service } from '../types';
import { mockService } from '../services/mockService';
import { getBusinessInsights } from '../services/geminiService';
import DashboardCard from '../components/DashboardCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const PartnerView: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<RevenueStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddWalkIn, setShowAddWalkIn] = useState(false);
  const [geminiTip, setGeminiTip] = useState<string>("");
  const [tipLoading, setTipLoading] = useState(false);
  
  // Hardcoded current shop ID for demo
  const SHOP_ID = 'shop1'; 
  const services = mockService.getShopById(SHOP_ID)?.services || [];

  const refreshData = async () => {
    const b = await mockService.getBookingsForShop(SHOP_ID);
    setBookings(b);
    setStats(mockService.getRevenueStats(SHOP_ID));
    setLoading(false);
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 10000); // Poll for "Real-time"
    return () => clearInterval(interval);
  }, []);

  const handleStatusUpdate = async (id: string, status: BookingStatus) => {
    await mockService.updateBookingStatus(id, status);
    refreshData();
  };

  const handleAddWalkIn = async (service: Service) => {
    setLoading(true);
    await mockService.addBooking({
      shopId: SHOP_ID,
      customerName: 'Walk-in Guest',
      serviceId: service.id,
      startTime: new Date().toISOString(),
      status: BookingStatus.IN_PROGRESS,
      source: BookingSource.WALK_IN,
      price: service.price,
      commission: 0
    });
    setShowAddWalkIn(false);
    refreshData();
  };

  const fetchGeminiInsight = async () => {
    if (!stats) return;
    setTipLoading(true);
    const tip = await getBusinessInsights(stats);
    setGeminiTip(tip);
    setTipLoading(false);
  };

  const pendingBookings = bookings.filter(b => b.status === BookingStatus.CONFIRMED || b.status === BookingStatus.PENDING);
  const inProgressBookings = bookings.filter(b => b.status === BookingStatus.IN_PROGRESS);
  const completedBookings = bookings.filter(b => b.status === BookingStatus.COMPLETED);

  const chartData = stats ? [
    { name: 'App', revenue: stats.todayApp },
    { name: 'Walk-in', revenue: stats.todayWalkIn },
  ] : [];

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-900">Partner Dashboard</h2>
           <p className="text-slate-500">Cochin Car Care</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={fetchGeminiInsight}
            disabled={tipLoading}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg shadow-md hover:opacity-90 transition-all text-sm font-medium"
          >
            <Sparkles size={16} />
            {tipLoading ? "Thinking..." : "AI Advisor"}
          </button>
          <button 
             onClick={() => setShowAddWalkIn(!showAddWalkIn)}
             className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg shadow-md hover:bg-slate-800 transition-all text-sm font-medium"
          >
            <Plus size={16} />
            Log Walk-in
          </button>
        </div>
      </div>

      {geminiTip && (
        <div className="bg-purple-50 border border-purple-100 p-4 rounded-xl flex items-start gap-3 animate-fade-in">
          <div className="p-2 bg-purple-100 rounded-lg text-purple-600 shrink-0">
             <Sparkles size={18} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-purple-900">Gemini Insight</h4>
            <p className="text-sm text-purple-700 mt-1">{geminiTip}</p>
          </div>
        </div>
      )}
      
      {showAddWalkIn && (
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-lg animate-slide-down mb-6">
           <h3 className="font-bold text-lg mb-4">Select Service for Walk-in</h3>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
             {services.map(s => (
               <button 
                key={s.id}
                onClick={() => handleAddWalkIn(s)}
                className="p-4 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-blue-500 text-left transition-all"
               >
                 <div className="font-semibold text-slate-900">{s.name}</div>
                 <div className="text-sm text-slate-500">₹{s.price}</div>
               </button>
             ))}
           </div>
           <button onClick={() => setShowAddWalkIn(false)} className="mt-4 text-sm text-red-500 underline">Cancel</button>
         </div>
      )}

      {/* Revenue Snapshot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard 
          title="App Revenue (Today)" 
          value={`₹${stats?.todayApp || 0}`} 
          icon={<Smartphone size={24} />} 
          color="blue"
        />
        <DashboardCard 
          title="Walk-in Revenue" 
          value={`₹${stats?.todayWalkIn || 0}`} 
          icon={<Users size={24} />} 
          color="orange"
        />
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 h-40">
           <p className="text-sm font-medium text-slate-500 mb-2">Revenue Split</p>
           <div className="h-24 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={chartData} layout="vertical">
                 <XAxis type="number" hide />
                 <YAxis dataKey="name" type="category" width={60} tick={{fontSize: 12}} />
                 <Tooltip />
                 <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : '#f97316'} />
                    ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* Operations Board - The CTO Priority */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        
        {/* Column 1: App Requests */}
        <div className="bg-slate-100 p-4 rounded-xl flex flex-col gap-3 min-h-[400px]">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-slate-700 flex items-center gap-2">
              <Smartphone size={18} /> App Requests
            </h3>
            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{pendingBookings.length}</span>
          </div>
          {pendingBookings.length === 0 && <div className="text-center text-slate-400 mt-10">No new requests</div>}
          {pendingBookings.map(b => (
            <div key={b.id} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
               <div className="flex justify-between items-start mb-2">
                 <span className="font-bold text-slate-900">{b.customerName}</span>
                 <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded font-mono">{b.id.slice(-4)}</span>
               </div>
               <div className="text-sm text-slate-600 mb-3">
                 {services.find(s => s.id === b.serviceId)?.name}
               </div>
               <button 
                onClick={() => handleStatusUpdate(b.id, BookingStatus.IN_PROGRESS)}
                className="w-full py-2 bg-blue-600 text-white text-sm font-semibold rounded hover:bg-blue-700"
               >
                 Start Job
               </button>
            </div>
          ))}
        </div>

        {/* Column 2: In Progress */}
        <div className="bg-slate-100 p-4 rounded-xl flex flex-col gap-3 min-h-[400px]">
           <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-slate-700 flex items-center gap-2">
              <TrendingUp size={18} /> In Progress
            </h3>
            <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{inProgressBookings.length}</span>
          </div>
           {inProgressBookings.map(b => (
            <div key={b.id} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-amber-500">
               <div className="flex justify-between items-start mb-2">
                 <span className="font-bold text-slate-900">{b.customerName}</span>
                 {b.source === BookingSource.APP ? 
                   <Smartphone size={14} className="text-blue-500"/> : 
                   <Users size={14} className="text-orange-500"/>
                 }
               </div>
               <div className="text-sm text-slate-600 mb-3">
                 {services.find(s => s.id === b.serviceId)?.name}
               </div>
               <button 
                onClick={() => handleStatusUpdate(b.id, BookingStatus.COMPLETED)}
                className="w-full py-2 bg-emerald-500 text-white text-sm font-semibold rounded hover:bg-emerald-600"
               >
                 Mark Complete
               </button>
            </div>
          ))}
        </div>

        {/* Column 3: Completed */}
        <div className="bg-slate-100 p-4 rounded-xl flex flex-col gap-3 min-h-[400px]">
           <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-slate-700 flex items-center gap-2">
              <CheckSquare size={18} /> Completed (Today)
            </h3>
            <span className="bg-emerald-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{completedBookings.length}</span>
          </div>
           {completedBookings.slice(0, 5).map(b => (
            <div key={b.id} className="bg-white p-3 rounded-lg shadow-sm opacity-75">
               <div className="flex justify-between items-center">
                 <span className="font-medium text-slate-900">{b.customerName}</span>
                 <span className="text-sm font-bold text-slate-700">₹{b.price}</span>
               </div>
               <div className="text-xs text-slate-500 mt-1 flex justify-between">
                 <span>{b.source}</span>
                 <span>{new Date(b.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
               </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default PartnerView;
