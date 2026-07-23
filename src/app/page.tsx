'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

const Book3DModel = dynamic(() => import('@/components/Book3DModel'), {
  ssr: false,
  loading: () => <div className="h-[600px] w-full animate-pulse bg-navy-800 border border-amber-500/20 flex items-center justify-center text-amber-500 text-sm uppercase tracking-widest">Initializing 3D Render...</div>
});

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({ days: 31, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    let targetDate = localStorage.getItem('preorder_target');
    if (!targetDate) {
      const newTarget = new Date().getTime() + (31 * 24 * 60 * 60 * 1000);
      localStorage.setItem('preorder_target', newTarget.toString());
      targetDate = newTarget.toString();
    }

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = parseInt(targetDate as string) - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <main className="min-h-screen relative bg-navy-900 selection:bg-amber-400 selection:text-navy-900">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-24 pb-16 px-6 lg:px-24 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[90vh]">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex flex-col space-y-8 z-10">
          <div className="space-y-4">
            <div className="inline-block border border-amber-500/30 bg-navy-800 px-4 py-1">
              <h2 className="text-amber-400 tracking-[0.2em] uppercase text-xs font-bold">
                Official Pre-Release
              </h2>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Pearls from the Masterpieces of <br />
              <span className="amber-gradient-text">Abu Hayyan</span>
            </h1>
            <p className="text-lg text-slate-300 max-w-lg leading-relaxed border-l-4 border-amber-500 pl-4 bg-navy-800/30 py-2">
              A beautifully preserved volume of classical Arabic poetry dedicated to deep wisdom, noble Islamic morals, and excellent eloquence.
            </p>
          </div>

          <div className="bg-navy-800 border border-amber-500/40 p-8 shadow-2xl relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600"></div>
            
            <div className="flex justify-between items-end mb-8 border-b border-slate-700 pb-6">
              <div>
                <p className="text-sm text-slate-400 uppercase tracking-widest mb-1 font-semibold">Pre-Order Rate</p>
                <div className="flex items-center space-x-4">
                  <span className="text-4xl font-bold text-amber-400">₦2,500</span>
                  <span className="text-lg text-slate-500 line-through">₦3,000</span>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-xs text-slate-400 uppercase tracking-widest mb-2 font-semibold">Offer Expires In</p>
                <div className="flex space-x-3 text-white font-mono text-xl">
                  <div className="flex flex-col items-center"><span className="font-bold">{timeLeft.days}</span><span className="text-[10px] text-slate-500">D</span></div>
                  <span>:</span>
                  <div className="flex flex-col items-center"><span className="font-bold">{timeLeft.hours}</span><span className="text-[10px] text-slate-500">H</span></div>
                  <span>:</span>
                  <div className="flex flex-col items-center"><span className="font-bold">{timeLeft.minutes}</span><span className="text-[10px] text-slate-500">M</span></div>
                  <span>:</span>
                  <div className="flex flex-col items-center"><span className="font-bold">{timeLeft.seconds}</span><span className="text-[10px] text-slate-500">S</span></div>
                </div>
              </div>
            </div>
            
            <button className="w-full bg-amber-500 hover:bg-amber-400 text-navy-900 font-bold py-4 uppercase tracking-widest transition-colors shadow-[0_0_15px_rgba(255,191,0,0.2)] hover:shadow-[0_0_25px_rgba(255,191,0,0.4)]">
              Proceed to Pre-Order
            </button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="relative w-full h-[600px] lg:h-[700px] flex items-center justify-center cursor-grab active:cursor-grabbing">
          <div className="absolute inset-0 bg-gradient-radial from-amber-500/10 to-transparent opacity-50 z-0 pointer-events-none" />
          <Book3DModel />
        </motion.div>
      </section>

      {/* 2. ABOUT THE BOOK */}
      <section className="py-24 bg-navy-800 border-t border-b border-amber-500/10 relative">
        <div className="absolute left-0 top-0 w-1 h-full bg-amber-500/50"></div>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="space-y-8">
            <h3 className="text-3xl font-bold text-amber-400 uppercase tracking-widest">About The Book</h3>
            <div className="space-y-6 text-lg text-slate-300 leading-relaxed font-serif">
              <p>"Pearls from the Masterpieces of Abu Hayyan" is my debut collection of classical Arabic poetry.</p>
              <p>This book gathers my scattered poetic works into one beautifully preserved volume. Inside, you will find poems dedicated to deep wisdom, noble Islamic morals, love for the Prophet, and many more.</p>
              <p>Every poem in it is written using traditional Arabic meter and rhyme to bring out the true beauty of the language.</p>
              <div className="bg-navy-900/50 border border-amber-500/20 p-6 inline-block mt-4">
                <p className="text-white font-semibold italic">Alhamdulillah... It was vetted by a few scholars for its rich vocabulary, sweet meaning, and excellent eloquence.</p>
              </div>
              <p className="pt-4">Pre-order your copy today to support the preservation of our Islamic and poetic heritage. I personally also invite you to the BOOK LAUNCHING CEREMONY.</p>
              <p className="text-amber-400 font-bold tracking-widest pt-4 uppercase">Jazakumullahu Khayran.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. ABOUT THE AUTHOR & SPONSORSHIP */}
      <section className="py-24 px-6 lg:px-24 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="space-y-6 lg:pr-16 relative">
          <h3 className="text-2xl font-bold text-amber-400 uppercase tracking-widest mb-8">About The Author</h3>
          <h4 className="text-xl font-bold text-white border-b border-slate-700 pb-4">Yusuf Olalekan Oyetunji (Abu Hayyãn)</h4>
          <div className="space-y-4 text-slate-300 leading-relaxed">
            <p>A dedicated writer, translator, and student of classical Arabic poetry. He is a graduate of the Institute of Islamic Sciences and Studies in Amuloko, Ibadan, Nigeria.</p>
            <p>He holds both a Bachelor of Arts and a Master of Arts in English from the University of Ibadan, and is currently furthering his studies at Kuliyyah Imam Malik in Jegede, Ibadan.</p>
            <p>As a dedicated online educator and writer, he is passionate about sharing beneficial knowledge and preserving Islamic literary heritage. This debut collection reflects his extensive literary background and his deep love for classical Arabic poetry.</p>
          </div>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="flex flex-col justify-center bg-navy-800 p-10 border border-amber-500/20 shadow-xl">
          <div className="w-12 h-12 mb-6 text-amber-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">Corporate & Individual Sponsorship</h3>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Wish to distribute copies of this masterpiece to students of knowledge, institutions, or the general public? You can sponsor any amount of copies securely here.
          </p>
          <button className="w-full border-2 border-amber-500 text-amber-400 hover:bg-amber-500 hover:text-navy-900 font-bold py-4 uppercase tracking-widest transition-all">
             Sponsorship
          </button>
        </motion.div>

      </section>
    </main>
  );
}