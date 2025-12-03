import React, { useEffect, useState } from 'react';
import { Shop } from '../types';
import { mockService } from '../services/mockService';
import { CheckCircle, XCircle, AlertCircle, DollarSign } from 'lucide-react';

const AdminView: React.FC = () => {
  const [shops, setShops] = useState<Shop[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await mockService.getShops();
      setShops(data);
    };
    load();
  }, []);

  const handleApprove = async (id: string) => {
    await mockService.approveShop(id);
    setShops(shops.map(s => s.id === id ? { ...s, pendingApproval: false, isVerified: true } : s));
  };

  const pendingShops = shops.filter(s => s.pendingApproval);
  const activeShops = shops.filter(s => !s.pendingApproval);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Admin Console</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
           <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
             <div className="text-slate-500 text-sm mb-1">Total Active Shops</div>
             <div className="text-2xl font-bold">{activeShops.length}</div>
           </div>
           <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
             <div className="text-slate-500 text-sm mb-1">Pending Approvals</div>
             <div className="text-2xl font-bold text-orange-500">{pendingShops.length}</div>
           </div>
           <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
             <div className="text-slate-500 text-sm mb-1">Total Commission (Today)</div>
             <div className="text-2xl font-bold text-emerald-600">₹1,245</div>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
            <AlertCircle size={20} className="text-orange-500" /> Pending Approvals
          </h3>
        </div>
        
        {pendingShops.length === 0 ? (
          <div className="p-8 text-center text-slate-400">No pending approvals.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-6 py-3">Shop Name</th>
                  <th className="px-6 py-3">Location</th>
                  <th className="px-6 py-3">Commission %</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingShops.map(shop => (
                  <tr key={shop.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{shop.name}</td>
                    <td className="px-6 py-4 text-slate-600">{shop.location}</td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-50 text-blue-700 py-1 px-2 rounded text-xs font-bold">
                        {shop.commissionRate}%
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button 
                        onClick={() => handleApprove(shop.id)}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Approve">
                        <CheckCircle size={20} />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Reject">
                        <XCircle size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
             <DollarSign size={20} className="text-emerald-500"/> Partner Payouts
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-3">Shop</th>
                <th className="px-6 py-3">Total Revenue</th>
                <th className="px-6 py-3">Commission Due</th>
                <th className="px-6 py-3">Payout Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeShops.slice(0, 3).map((shop, i) => (
                <tr key={shop.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">{shop.name}</td>
                  <td className="px-6 py-4 text-slate-600">₹{12000 + (i * 4500)}</td>
                  <td className="px-6 py-4 font-mono text-red-600">-₹{(12000 + (i * 4500)) * (shop.commissionRate/100)}</td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 text-slate-600 py-1 px-3 rounded-full text-xs font-medium">
                      Scheduled Fri
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminView;
