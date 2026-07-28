'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // If we are on the login page, don't show the sidebar wrapper
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const navLinks = [
    { name: 'Dashboard', path: '/admin', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" /></svg>
    )},
    { name: 'Pre-Orders', path: '/admin/preorders', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
    )},
    { name: 'Sponsors', path: '/admin/sponsors', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
    )}
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-stone-900 text-stone-300">
      <div className="p-6 border-b border-stone-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-stone-700 bg-stone-800 flex items-center justify-center text-white font-serif font-bold shadow-md">
            AH
          </div>
          <div>
            <h2 className="text-white font-black uppercase tracking-widest text-sm">Admin Portal</h2>
            <p className="text-[10px] uppercase tracking-widest font-bold text-stone-500">Abu Hayyãn</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navLinks.map((link) => {
          const isActive = pathname === link.path;
          return (
            <Link key={link.name} href={link.path} onClick={() => setIsMobileMenuOpen(false)}>
              <div className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 ${isActive ? 'bg-amber-500 text-stone-900 font-black shadow-lg shadow-amber-900/20' : 'hover:bg-stone-800 hover:text-white font-medium'}`}>
                {link.icon}
                <span className="text-xs uppercase tracking-[0.1em]">{link.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-stone-800">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-stone-400 hover:bg-red-500/10 hover:text-red-500 transition-colors font-bold uppercase tracking-wider text-xs"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 flex font-sans selection:bg-amber-500 selection:text-stone-900">
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 h-screen sticky top-0 border-r border-stone-800">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 inset-x-0 h-16 bg-stone-900 flex items-center justify-between px-4 z-40 shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-stone-800 border-2 border-stone-700 flex items-center justify-center text-white font-serif font-bold text-xs">AH</div>
          <span className="text-white font-black uppercase tracking-widest text-xs">Admin</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-stone-300 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"} /></svg>
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-40 lg:hidden" 
            />
            <motion.div 
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 left-0 w-72 z-50 lg:hidden shadow-2xl"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        <div className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-10 pt-20 lg:pt-10">
          {children}
        </div>
      </main>

    </div>
  );
}
