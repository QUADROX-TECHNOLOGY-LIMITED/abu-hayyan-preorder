'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const [data, setData] = useState({ booksSold: 0, sponsoredCopies: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch('/api/admin/data');
        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();
        if (json.status === 'success') {
          setData(json.data);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-200 font-bold text-sm">
        Failed to load dashboard metrics. Please refresh the page.
      </div>
    );
  }

  const metrics = [
    {
      title: 'Total Net Revenue',
      value: `₦${data.totalRevenue.toLocaleString()}`,
      subtitle: 'Calculated strictly on ₦2,500 base capital',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-amber-600"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      )
    },
    {
      title: 'Total Books Sold',
      value: data.booksSold.toLocaleString(),
      subtitle: 'Successful pre-order copies',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-stone-900"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
      )
    },
    {
      title: 'Sponsored Copies',
      value: data.sponsoredCopies.toLocaleString(),
      subtitle: 'Sadaqah contributions received',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-emerald-600"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
      )
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-stone-900 uppercase tracking-wider">Dashboard Overview</h1>
        <p className="text-sm font-bold text-stone-500 uppercase tracking-widest">Live Business Metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric, idx) => (
          <motion.div 
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white border-2 border-stone-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-stone-200/20"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100">
                {metric.icon}
              </div>
            </div>
            <div>
              {loading ? (
                <div className="h-10 w-1/2 bg-stone-100 animate-pulse rounded-lg mb-2" />
              ) : (
                <p className="text-4xl font-black text-stone-900 leading-none mb-2">{metric.value}</p>
              )}
              <h3 className="text-xs font-black uppercase tracking-widest text-stone-900 mb-1">{metric.title}</h3>
              <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">{metric.subtitle}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
