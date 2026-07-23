'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

const Book3DModel = dynamic(() => import('@/components/Book3DModel'), {
  ssr: false,
  loading: () => (
    <div className="h-[50vh] lg:h-[70vh] w-full animate-pulse flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-t-2 border-r-2 border-gold-500 rounded-full animate-spin"></div>
      <div className="text-gold-500 text-xs sm:text-sm uppercase tracking-[0.3em] font-light">Initializing Render...</div>
    </div>
  )
});

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setIsMounted(true);
    // Universal Fixed Target Date: August 22, 2026
    const targetDate = new Date('2026-08-22T00:00:00+01:00').getTime(); 

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

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

  const revealUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <main className="min-h-screen bg-book-900 selection:bg-gold-500 selection:text-book-900 relative overflow-hidden font-sans text-gray-200">
      
      {/* Abstract Luxury Lighting */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[100vw] h-[60vh] bg-gradient-to-b from-gold-500/15 to-transparent rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[50vw] h-[50vh] bg-gold-500/5 blur-[120px] pointer-events-none"></div>

      {/* FLOATING SPONSOR SEAL */}
      <motion.button 
        animate={{ y: [0, -8, 0] }} 
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        className="fixed bottom-8 right-6 lg:bottom-12 lg:right-12 z-50 bg-gradient-to-br from-gold-400 to-gold-600 text-book-900 p-4 rounded-full shadow-[0_8px_32px_rgba(212,175,55,0.25)] hover:shadow-[0_8px_32px_rgba(212,175,55,0.5)] hover:scale-105 transition-all duration-300 flex items-center justify-center group border border-gold-300/50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 lg:w-7 lg:h-7">
          <path d="M9.375 3a1.875 1.875 0 0 0 0 3.75h1.875v4.5H3.375A1.875 1.875 0 0 1 1.5 9.375v-.75c0-1.036.84-1.875 1.875-1.875h3.193A3.375 3.375 0 0 1 12 2.753a3.375 3.375 0 0 1 5.432 3.997h3.193c1.035 0 1.875.84 1.875 1.875v.75c0 1.036-.84 1.875-1.875 1.875H12.75v-4.5h1.875a1.875 1.875 0 1 0-1.875-1.875V6.75h-1.5V4.875C11.25 3.839 10.41 3 9.375 3ZM11.25 12.75H3v6.75a2.25 2.25 0 0 0 2.25 2.25h6v-9ZM12.75 12.75v9h6a2.25 2.25 0 0 0 2.25-2.25v-6.75h-8.25Z" />
        </svg>
        <div className="absolute right-full mr-6 bg-book-900/95 backdrop-blur-md text-gold-400 border border-gold-500/20 px-6 py-3 text-xs font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 whitespace-nowrap pointer-events-none uppercase tracking-[0.2em] hidden sm:block shadow-2xl">
          Sponsor Copies
        </div>
      </motion.button>

      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative min-h-[100svh] flex flex-col items-center justify-start pt-16 pb-32">
        
        {/* Background Typography Watermark */}
        <div className="absolute top-[8%] lg:top-[12%] w-full text-center z-0 pointer-events-none select-none overflow-hidden mix-blend-overlay">
          <h1 
            className="text-[14vw] font-black leading-none opacity-30"
            style={{ 
              WebkitTextStroke: '1px rgba(212, 175, 55, 0.3)', 
              color: 'transparent' 
            }}
          >
            ABU HAYYAN
          </h1>
        </div>

        {/* Small Intro Badge */}
        <motion.div initial="hidden" animate="visible" variants={revealUp} className="z-10 mt-2 lg:mt-6 mb-[-1rem] lg:mb-[-3rem] flex flex-col items-center gap-3">
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-gold-500/50"></div>
          <p className="text-gold-500 uppercase tracking-[0.5em] text-[10px] lg:text-xs font-semibold">The Debut Collection</p>
        </motion.div>

        {/* Massive Centered 3D Book */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.85, y: 20 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }} 
          className="relative z-10 w-full max-w-6xl h-[55vh] sm:h-[65vh] lg:h-[75vh] cursor-grab active:cursor-grabbing"
        >
          <Book3DModel />
        </motion.div>

        {/* Overlapping Glass Control Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          className="relative z-20 -mt-12 lg:-mt-20 w-[92%] max-w-5xl mx-auto bg-book-900/60 backdrop-blur-xl border border-white/5 p-8 lg:p-10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)] flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-12"
        >
          {/* Price Block */}
          <div className="flex-1 w-full text-center lg:text-left flex flex-col items-center lg:items-start">
            <p className="text-[10px] text-gold-500/70 uppercase tracking-[0.3em] mb-3 font-bold">Official Pre-Order</p>
            <div className="flex items-baseline justify-center lg:justify-start gap-4">
              <span className="text-5xl lg:text-6xl font-black text-white leading-none tracking-tight">₦2,500</span>
              <span className="relative inline-block text-xl text-gray-500 font-medium">
                <span className="absolute top-1/2 left-[-10%] w-[120%] h-[1px] bg-red-500/80 -rotate-12"></span>
                ₦3,000
              </span>
            </div>
          </div>

          {/* Vertical Divider (Desktop) / Horizontal (Mobile) */}
          <div className="hidden lg:block w-px h-24 bg-gradient-to-b from-transparent via-gold-500/20 to-transparent"></div>
          <div className="block lg:hidden w-full h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent -my-2"></div>

          {/* Countdown Block */}
          <div className="flex-1 w-full text-center">
             <p className="text-[10px] text-gold-500/70 uppercase tracking-[0.3em] mb-4 font-bold">Allocation Closes In</p>
             {isMounted ? (
                <div className="flex items-start justify-center gap-4 lg:gap-6 text-white font-mono text-3xl lg:text-4xl font-light">
                  <div className="flex flex-col items-center w-16">
                    <span>{timeLeft.days.toString().padStart(2, '0')}</span>
                    <span className="text-[9px] text-gray-400 mt-2 font-sans tracking-widest uppercase">Days</span>
                  </div>
                  <span className="text-gold-500/30 -mt-1">:</span>
                  <div className="flex flex-col items-center w-16">
                    <span>{timeLeft.hours.toString().padStart(2, '0')}</span>
                    <span className="text-[9px] text-gray-400 mt-2 font-sans tracking-widest uppercase">Hrs</span>
                  </div>
                  <span className="text-gold-500/30 -mt-1">:</span>
                  <div className="flex flex-col items-center w-16">
                    <span>{timeLeft.minutes.toString().padStart(2, '0')}</span>
                    <span className="text-[9px] text-gray-400 mt-2 font-sans tracking-widest uppercase">Min</span>
                  </div>
                  <span className="text-gold-500/30 -mt-1">:</span>
                  <div className="flex flex-col items-center w-16">
                    <span className="text-gold-400">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                    <span className="text-[9px] text-gray-400 mt-2 font-sans tracking-widest uppercase">Sec</span>
                  </div>
                </div>
             ) : (
                <div className="h-14 w-64 bg-white/5 animate-pulse mx-auto rounded-sm"></div>
             )}
          </div>

          {/* CTA Block */}
          <div className="flex-1 w-full lg:w-auto mt-2 lg:mt-0 flex justify-end">
            <button className="w-full lg:w-auto bg-gold-500 text-book-900 font-bold py-5 px-10 uppercase tracking-[0.25em] text-sm transition-all duration-500 hover:bg-white hover:text-black hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]">
              Secure Copy
            </button>
          </div>
        </motion.div>
      </section>

      {/* 2. ASYMMETRICAL EDITORIAL LAYOUT */}
      <section className="relative px-6 lg:px-24 max-w-7xl mx-auto py-24 lg:py-40">
        
        {/* The Masterpiece (Wide Focus) */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={revealUp} className="mb-32 lg:mb-48 relative">
          <div className="absolute left-0 top-2 w-[1px] h-full bg-gradient-to-b from-gold-500/50 via-gold-500/10 to-transparent"></div>
          <div className="pl-8 lg:pl-16 md:w-4/5 lg:w-2/3">
            <div className="flex items-center gap-4 mb-8">
              <span className="text-xs font-mono text-gold-500/50">01</span>
              <h3 className="text-xs font-bold text-gold-500 uppercase tracking-[0.4em]">The Masterpiece</h3>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl lg:leading-[1.2] font-light text-white mb-10 font-serif">
              A beautifully preserved volume dedicated to <span className="text-gold-400 italic font-medium">deep wisdom</span>, noble Islamic morals, and the love for the Prophet.
            </h2>
            <div className="space-y-8 text-gray-400 text-base lg:text-lg font-light leading-relaxed max-w-2xl">
              <p>Gathering scattered poetic works into one beautifully preserved volume. Every poem within is written using traditional Arabic meter and rhyme to bring out the true, unadulterated beauty of the language.</p>
              <div className="relative pl-8 py-2">
                <div className="absolute left-0 top-0 w-1 h-full bg-gold-500/30"></div>
                <p className="text-gray-300 italic">
                  Alhamdulillah... It was vetted by scholars for its rich vocabulary, sweet meaning, and excellent eloquence. Pre-order to support the preservation of our Islamic and poetic heritage.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* The Author (Offset Right) */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={revealUp} className="flex justify-end relative">
          <div className="absolute right-0 top-2 w-[1px] h-full bg-gradient-to-b from-gold-500/50 via-gold-500/10 to-transparent md:hidden"></div>
          <div className="pr-8 lg:pr-0 md:pl-16 lg:pl-32 md:border-l md:border-gold-500/20 md:w-3/4 lg:w-1/2">
            <div className="flex items-center gap-4 mb-8 md:flex-row-reverse md:justify-end lg:flex-row lg:justify-start">
              <span className="text-xs font-mono text-gold-500/50 lg:hidden">02</span>
              <h3 className="text-xs font-bold text-gold-500 uppercase tracking-[0.4em]">The Author</h3>
              <span className="text-xs font-mono text-gold-500/50 hidden lg:block">02</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-light text-white mb-2 tracking-wide">Yusuf Olalekan Oyetunji</h2>
            <p className="text-gold-500 font-serif italic text-2xl mb-10">Abu Hayyãn</p>
            
            <div className="space-y-6 text-gray-400 text-base font-light leading-relaxed">
              <p>A dedicated writer, translator, and student of classical Arabic poetry. Graduate of the Institute of Islamic Sciences and Studies in Amuloko, Ibadan, Nigeria.</p>
              <p>Holding both a Bachelor of Arts and a Master of Arts in English from the University of Ibadan, currently furthering studies at Kuliyyah Imam Malik in Jegede, Ibadan.</p>
              <p>Passionate about sharing beneficial knowledge and preserving Islamic literary heritage, this debut collection reflects an extensive literary background and a deep, enduring love for classical Arabic poetry.</p>
            </div>
          </div>
        </motion.div>

      </section>
    </main>
  );
}