'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

type Sponsor = {
  id: string;
  orderNumber: string;
  name: string | null;
  email: string;
  quantity: number;
  totalAmount: number;
  paymentStatus: string;
  createdAt: string;
};

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const res = await fetch('/api/admin/sponsors');
        const json = await res.json();
        if (json.status === 'success') {
          setSponsors(json.data);
        }
      } catch (err) {
        console.error('Failed to fetch sponsors', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSponsors();
  }, []);

  const filteredSponsors = sponsors.filter(s => {
    const sponsorName = s.name || 'Anonymous';
    return (
      sponsorName.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.orderNumber.toLowerCase().includes(search.toLowerCase())
    );
  });

  // Calculate totals currently visible on the screen
  const visibleTotalQty = filteredSponsors.reduce((sum, s) => sum + s.quantity, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black text-stone-900 uppercase tracking-wider">Sponsors</h1>
          <p className="text-sm font-bold text-stone-500 uppercase tracking-widest">Sadaqah Contributions</p>
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
        
        {/* Table Header Summary */}
        <div className="bg-stone-50 border-b-2 border-stone-100 p-6 flex justify-between items-center">
          <h3 className="text-xs font-black text-stone-900 uppercase tracking-widest">Transaction Records</h3>
          <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full border border-emerald-200">
            {visibleTotalQty} Copies Sponsored
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-white border-b-2 border-stone-100">
                <th className="py-5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-stone-500">Date & Order ID</th>
                <th className="py-5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-stone-500">Sponsor Details</th>
                <th className="py-5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 text-center">Qty Sponsored</th>
                <th className="py-5 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 text-right">Amount Paid</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-stone-400 font-bold uppercase tracking-widest text-xs animate-pulse">Loading records...</td>
                </tr>
              ) : filteredSponsors.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-stone-400 font-bold uppercase tracking-widest text-xs">No matching sponsors found.</td>
                </tr>
              ) : (
                filteredSponsors.map((sponsor, idx) => {
                  const isAnonymous = !sponsor.name || sponsor.name.trim().toLowerCase() === 'anonymous';
                  
                  return (
                    <motion.tr 
                      key={sponsor.id} 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      transition={{ delay: idx * 0.05 }}
                      className="border-b border-stone-50 hover:bg-emerald-50/30 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <p className="text-xs font-bold text-stone-500 mb-1">{new Date(sponsor.createdAt).toLocaleDateString()}</p>
                        <p className="text-sm font-black tracking-widest text-amber-600">{sponsor.orderNumber}</p>
                      </td>
                      <td className="py-4 px-6">
                        <p className={`text-sm font-black capitalize ${isAnonymous ? 'text-stone-400 italic' : 'text-stone-900'}`}>
                          {isAnonymous ? 'Anonymous Donor' : sponsor.name}
                        </p>
                        <p className="text-[10px] font-bold text-stone-500">{sponsor.email}</p>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-black text-sm">
                          {sponsor.quantity}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <p className="text-base font-black text-stone-900">₦{sponsor.totalAmount.toLocaleString()}</p>
                        <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mt-1">✓ PAID</p>
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
