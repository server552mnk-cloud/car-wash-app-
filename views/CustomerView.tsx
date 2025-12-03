import React, { useState, useEffect } from 'react';
import { MapPin, Star, Clock, ChevronRight, CheckCircle } from 'lucide-react';
import { Shop, Service } from '../types';
import { mockService } from '../services/mockService';

const CustomerView: React.FC = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    const load = async () => {
      const data = await mockService.getShops();
      // Filter only verified shops for customers
      setShops(data.filter(s => s.isVerified));
      setLoading(false);
    };
    load();
  }, []);

  const handleBook = async () => {
    if (!selectedShop || !selectedService) return;
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setBookingSuccess(true);
      setLoading(false);
    }, 1500);
  };

  const reset = () => {
    setSelectedShop(null);
    setSelectedService(null);
    setBookingSuccess(false);
  };

  if (bookingSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-md mx-auto">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="text-emerald-600 w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Booking Confirmed!</h2>
        <p className="text-slate-500 mb-8">
          Your slot at <span className="font-semibold text-slate-900">{selectedShop?.name}</span> is reserved. 
          Order ID: #ORD-{Math.floor(Math.random() * 10000)}
        </p>
        <button 
          onClick={reset}
          className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium shadow-lg hover:bg-blue-700 transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }

  if (selectedShop) {
    return (
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={() => setSelectedShop(null)}
          className="text-sm text-slate-500 hover:text-blue-600 mb-4 flex items-center gap-1"
        >
          &larr; Back to Shops
        </button>

        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 mb-6">
          <img src={selectedShop.imageUrl} alt={selectedShop.name} className="w-full h-48 object-cover" />
          <div className="p-6">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">{selectedShop.name}</h1>
            <p className="text-slate-500 flex items-center gap-1.5 mb-4">
              <MapPin size={16} /> {selectedShop.location}
            </p>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <Star size={14} fill="currentColor" /> {selectedShop.rating} ({selectedShop.reviewCount})
              </div>
              <div className="text-emerald-600 text-sm font-medium bg-emerald-50 px-3 py-1 rounded-full">
                Open Now
              </div>
            </div>

            <h3 className="font-semibold text-slate-900 mb-4">Select Service</h3>
            <div className="space-y-3">
              {selectedShop.services.map(service => (
                <div 
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex justify-between items-center ${
                    selectedService?.id === service.id 
                    ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' 
                    : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <h4 className="font-medium text-slate-900">{service.name}</h4>
                    <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                      <Clock size={14} /> {service.durationMinutes} mins
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="block font-bold text-slate-900">₹{service.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-4 bg-slate-50 border-t border-slate-200 sticky bottom-0">
            <button 
              disabled={!selectedService || loading}
              onClick={handleBook}
              className="w-full py-3.5 bg-blue-600 disabled:bg-slate-300 text-white rounded-xl font-bold shadow-md hover:bg-blue-700 transition-colors flex justify-center items-center gap-2"
            >
              {loading ? 'Processing...' : `Pay ₹${selectedService?.price || 0} & Book`}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Nearby Washes</h2>
          <p className="text-slate-500">Verified partners around Kochi</p>
        </div>
        <div className="text-sm text-blue-600 font-medium">View Map</div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Finding best spots...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.map((shop) => (
            <div 
              key={shop.id}
              onClick={() => setSelectedShop(shop)}
              className="group bg-white rounded-2xl p-3 shadow-sm hover:shadow-md transition-all border border-slate-100 cursor-pointer flex flex-col"
            >
              <div className="relative h-40 rounded-xl overflow-hidden mb-3">
                <img src={shop.imageUrl} alt={shop.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
                  1.2 km
                </div>
              </div>
              
              <div className="px-1 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-lg text-slate-900 leading-tight">{shop.name}</h3>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                    <Star size={12} fill="currentColor" /> {shop.rating}
                  </div>
                </div>
                
                <p className="text-slate-500 text-sm mb-4 flex items-center gap-1">
                  <MapPin size={14} /> {shop.location}
                </p>

                <div className="mt-auto pt-3 border-t border-slate-50 flex justify-between items-center">
                   <div className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-md">
                     Next slot: 10:30 AM
                   </div>
                   <div className="p-2 bg-blue-50 text-blue-600 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
                     <ChevronRight size={18} />
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerView;
