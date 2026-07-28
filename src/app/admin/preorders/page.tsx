'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

type Order = {
  id: string;
  orderNumber: string;
  name: string;
  email: string;
  whatsapp: string;
  quantity: number;
  deliveryMode: string;
  state: string;
  city: string;
  paymentStatus: string;
  deliveryStatus: string;
  createdAt: string;
};

export default function PreOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/admin/preorders');
        const json = await res.json();
        if (json.status === 'success') {
          setOrders(json.data);
        }
      } catch (err) {
        console.error('Failed to fetch orders', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleMarkDelivered = async (id: string, currentStatus: string) => {
    // Only allow changing from PENDING to DELIVERED to prevent accidents
    if (currentStatus === 'DELIVERED') return;
    
    // Optimistic UI update
    setOrders(orders.map(o => o.id === id ? { ...o, deliveryStatus: 'DELIVERED' } : o));

    try {
      await fetch('/api/admin/preorders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, deliveryStatus: 'DELIVERED' })
      });
    } catch (err) {
      alert('Failed to update status on server.');
    }
  };

  const filteredOrders = orders.filter(o => 
    o.name.toLowerCase().includes(search.toLowerCase()) ||
    o.email.toLowerCase().includes(search.toLowerCase()) ||
    o.orderNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black text-stone-900 uppercase tracking-wider">Pre-Orders</h1>
          <p className="text-sm font-bold text-stone-500 uppercase tracking-widest">Manage Logistics & Fulfillment</p>
        </div>

        <div className="w-full md:w-80">
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
            <input 
              type="text" 
              placeholder="Search Name, Email, or Order ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border-2 border-stone-200 rounded-full pl-12 pr-4 py-3 text-sm text-stone-900 font-bold placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white border-2 border-stone-100 rounded-3xl overflow-hidden shadow-xl shadow-stone-200/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-stone-50 border-b-2 border-stone-100">
                <th className="py-5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-stone-500">Date & Order ID</th>
                <th className="py-5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-stone-500">Customer</th>
                <th className="py-5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-stone-500">Qty</th>
                <th className="py-5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-stone-500">Delivery Method</th>
                <th className="py-5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-stone-500">Location</th>
                <th className="py-5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 text-right">Fulfillment</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400 font-bold uppercase tracking-widest text-xs animate-pulse">Loading records...</td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400 font-bold uppercase tracking-widest text-xs">No matching orders found.</td>
                </tr>
              ) : (
                filteredOrders.map((order, idx) => {
                  const isDelivered = order.deliveryStatus === 'DELIVERED';
                  return (
                    <motion.tr 
                      key={order.id} 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      transition={{ delay: idx * 0.05 }}
                      className={`border-b border-stone-100 transition-colors ${isDelivered ? 'bg-stone-50/50 opacity-60' : 'hover:bg-amber-50/50'}`}
                    >
                      <td className="py-4 px-6">
                        <p className="text-xs font-bold text-stone-500 mb-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                        <p className={`text-sm font-black tracking-widest ${isDelivered ? 'text-stone-500' : 'text-amber-600'}`}>{order.orderNumber}</p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-sm font-black text-stone-900 capitalize">{order.name}</p>
                        <p className="text-[10px] font-bold text-stone-500">{order.email}</p>
                        <p className="text-[10px] font-bold text-stone-500">{order.whatsapp}</p>
                      </td>
                      <td className="py-4 px-6 text-sm font-black text-stone-900">{order.quantity}</td>
                      <td className="py-4 px-6">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-sm ${order.deliveryMode === 'launch_pickup' ? 'bg-stone-900 text-white' : 'bg-stone-200 text-stone-700'}`}>
                          {order.deliveryMode === 'launch_pickup' ? 'Launch Pickup' : 'Home Delivery'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-xs font-bold text-stone-900">{order.city || 'N/A'}</p>
                        <p className="text-[10px] font-bold text-stone-500 uppercase">{order.state || 'N/A'}</p>
                      </td>
                      <td className="py-4 px-6 text-right">
                        {isDelivered ? (
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
                            Delivered
                          </span>
                        ) : (
                          <button 
                            onClick={() => handleMarkDelivered(order.id, order.deliveryStatus)}
                            className="text-[10px] font-black uppercase tracking-widest text-stone-600 bg-white border-2 border-stone-200 px-4 py-2 rounded-full hover:border-amber-500 hover:text-stone-900 transition-colors shadow-sm"
                          >
                            Mark Picked Up
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
