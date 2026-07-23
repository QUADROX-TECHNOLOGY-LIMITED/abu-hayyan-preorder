'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

// Dynamically load the 3D model to prevent Server-Side Rendering issues
const Book3DModel = dynamic(() => import('@/components/Book3DModel'), {
  ssr: false,
  loading: () => <div className="h-[600px] w-full animate-pulse bg-[#2a1b15]/50 border border-[#d4af37]/20 flex items-center justify-center text-[#d4af37] text-sm uppercase tracking-widest">Loading 3D Experience...</div>
});

export default function Home() {
  // Persistent Countdown Logic (31 Days)
  const [timeLeft, setTimeLeft] = useState({ days: 31, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // We set a target date in localStorage so it survives page refreshes
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

  // Reusable Animation Variants for serious, corporate entry
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-24 pb-16 px-6 lg:px-24 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[90vh]">
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={fadeUp} 
          className="flex flex-col space-y-8 z-10"
        >
          <div className="space-y-4">
            <div className="inline-block border border-[#d4af37]/30 bg-[#2a1b15] px-4 py-1">
              <h2 className="text-[#d4af37] tracking-[0.2em] uppercase text-xs font-semibold">
                Official Pre-Release
              </h2>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Pearls from the Masterpieces of <br />
              <span className="text-[#d4af37]">Abu Hayyan</span>
            </h1>
            <p className="text-lg text-gray-300 max-w-lg leading-relaxed border-l-2 border-[#d4af37] pl-4">
              A beautifully preserved volume of classical Arabic poetry dedicated to deep wisdom, noble Islamic morals, and excellent eloquence.
            </p>
          </div>

          {/* Pricing & Pre-Order Box */}
          <div className="bg-[#1a100c] border border-[#d4af37]/40 p-8 shadow-2xl relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#b8860b] via-[#f9f295] to-[#b8860b]"></div>
            
            <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-6">
              <div>
                <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Pre-Order Price</p>
                <div className="flex items-center space-x-4">
                  <span className="text-4xl font-bold text-[#d4af37]">₦2,500</span>
                  <span className="text-lg text-gray-500 line-through">₦3,000</span>
                </div>
              </div>
              
              {/* Countdown */}
              <div className="text-right">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Offer Ends In</p>
                <div className="flex space-x-3 text-[#fcf8f2] font-mono text-lg">
                  <div className="flex flex-col items-center"><span className="font-bold">{timeLeft.days}</span><span className="text-[10px] text-gray-500">D</span></div>
                  <span>:</span>
                  <div className="flex flex-col items-center"><span className="font-bold">{timeLeft.hours}</span><span className="text-[10px] text-gray-500">H</span></div>
                  <span>:</span>
                  <div className="flex flex-col items-center"><span className="font-bold">{timeLeft.minutes}</span><span className="text-[10px] text-gray-500">M</span></div>
                  <span>:</span>
                  <div className="flex flex-col items-center"><span className="font-bold">{timeLeft.seconds}</span><span className="text-[10px] text-gray-500">S</span></div>
                </div>
              </div>
            </div>
            
            <button className="w-full bg-[#d4af37] hover:bg-[#b8860b] text-[#1a100c] font-bold py-4 uppercase tracking-widest transition-colors">
              Proceed to Pre-Order
            </button>
          </div>
        </motion.div>

        {/* 3D Book Interactive Area */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 1 }}
          className="relative w-full h-[600px] lg:h-[700px] flex items-center justify-center cursor-grab active:cursor-grabbing"
        >
          <div className="absolute inset-0 bg-gradient-radial from-[#d4af37]/10 to-transparent opacity-50 z-0 pointer-events-none" />
          <Book3DModel />
        </motion.div>
      </section>

      {/* 2. ABOUT THE BOOK */}
      <section className="py-24 bg-[#140b08] border-t border-b border-[#d4af37]/10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="space-y-8">
            <h3 className="text-3xl font-bold text-[#d4af37] uppercase tracking-widest">About The Book</h3>
            <div className="space-y-6 text-lg text-gray-300 leading-relaxed font-serif">
              <p>"Pearls from the Masterpieces of Abu Hayyan" is my debut collection of classical Arabic poetry.</p>
              <p>This book gathers my scattered poetic works into one beautifully preserved volume. Inside, you will find poems dedicated to deep wisdom, noble Islamic morals, love for the Prophet, and many more.</p>
              <p>Every poem in it is written using traditional Arabic meter and rhyme to bring out the true beauty of the language.</p>
              <p className="text-[#fcf8f2] font-semibold italic">Alhamdulillah... It was vetted by a few scholars for its rich vocabulary, sweet meaning, and excellent eloquence.</p>
              <p>Pre-order your copy today to support the preservation of our Islamic and poetic heritage. I personally also invite you to the BOOK LAUNCHING CEREMONY.</p>
              <p className="text-[#d4af37] font-bold pt-4">Jazakumullahu Khayran.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. ABOUT THE AUTHOR & SPONSORSHIP (Split Layout) */}
      <section className="py-24 px-6 lg:px-24 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Author Profile */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="space-y-6 border-r-0 lg:border-r border-[#d4af37]/20 lg:pr-16">
          <h3 className="text-2xl font-bold text-[#d4af37] uppercase tracking-widest mb-8">About The Author</h3>
          <h4 className="text-xl font-bold text-white">Yusuf Olalekan Oyetunji (Abu Hayyãn)</h4>
          <p className="text-gray-300 leading-relaxed">
            A dedicated writer, translator, and student of classical Arabic poetry. He is a graduate of the Institute of Islamic Sciences and Studies in Amuloko, Ibadan, Nigeria.
          </p>
          <p className="text-gray-300 leading-relaxed">
            He holds both a Bachelor of Arts and a Master of Arts in English from the University of Ibadan, and is currently furthering his studies at Kuliyyah Imam Malik in Jegede, Ibadan.
          </p>
          <p className="text-gray-300 leading-relaxed">
            As a dedicated online educator and writer, he is passionate about sharing beneficial knowledge and preserving Islamic literary heritage. This debut collection reflects his extensive literary background and his deep love for classical Arabic poetry.
          </p>
        </motion.div>

        {/* Sponsorship Action */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="flex flex-col justify-center bg-[#2a1b15]/30 p-10 border border-[#d4af37]/20">
          <div className="w-12 h-12 mb-6 text-[#d4af37]">
            {/* Minimalist Corporate Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">Sponsor Copies</h3>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Wish to distribute copies of this masterpiece to students of knowledge, institutions, or the general public? You can sponsor any amount of copies securely here.
          </p>
          <button className="w-full border-2 border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#1a100c] font-bold py-4 uppercase tracking-widest transition-all">
             Sponsor
          </button>
        </motion.div>

      </section>
    </main>
  );
}