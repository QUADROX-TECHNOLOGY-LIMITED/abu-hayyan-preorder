'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, useReducedMotion } from 'framer-motion';

// The loading fallback is now a tiny empty div because we are using a full-screen overlay
const Book3DModel = dynamic(() => import('@/components/Book3DModel'), {
  ssr: false,
  loading: () => <div className="h-[50vh] lg:h-[70vh] w-full" />
});

export default function Home() {
  const [modelLoaded, setModelLoaded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const shouldReduceMotion = useReducedMotion();

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

  const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } }
  };

  const scrollToPreorder = () => {
    document.getElementById('preorder')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-book-900';

  return (
    <main className="min-h-screen bg-book-900 selection:bg-gold-500 selection:text-book-900 relative overflow-hidden font-sans">

      {/* FULL SCREEN LOADING OVERLAY - Engaging Typographic Animation */}
      <div className={`fixed inset-0 z-[100] bg-book-900 flex flex-col items-center justify-center transition-opacity duration-1000 ${modelLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="relative flex flex-col items-center justify-center h-40 w-full max-w-sm overflow-hidden">
          <motion.div
            animate={{ x: [-30, 30, -30] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="text-gold-500/80 text-3xl sm:text-4xl font-serif mb-4"
          >
            Abu Hayyãn
          </motion.div>
          <motion.div
            animate={{ x: [30, -30, 30] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="text-white/80 text-4xl sm:text-5xl font-serif"
            dir="rtl"
          >
            أبي حيان
          </motion.div>
        </div>
      </div>

      {/* Ambient Luxury Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] bg-gold-500/10 rounded-[100%] blur-[120px] pointer-events-none" />

      {/* SLIM TOP NAV */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="fixed top-0 inset-x-0 z-40 border-b border-gold-500/10 bg-book-900/70 backdrop-blur-lg"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full border border-gold-500/40 flex items-center justify-center text-gold-500 font-serif text-sm">AH</span>
            <span className="hidden sm:block text-gray-300 text-xs uppercase tracking-[0.3em] font-serif">Abu Hayyãn</span>
          </div>
          <button
            onClick={scrollToPreorder}
            className={`text-[10px] sm:text-xs uppercase tracking-[0.2em] font-bold text-gold-500 border border-gold-500/40 px-5 sm:px-6 py-2 rounded-full hover:bg-gold-500 hover:text-book-900 transition-colors ${focusRing}`}
          >
            Pre-Order
          </button>
        </div>
      </motion.header>

      {/* FLOATING SPONSOR SEAL (Hidden on Mobile to prevent conflict) */}
      <motion.button
        animate={shouldReduceMotion ? {} : { y: [0, -8, 0], rotate: [0, -2, 2, -2, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className={`hidden lg:flex fixed bottom-8 right-12 z-50 bg-gradient-to-r from-gold-400 to-gold-600 text-book-900 px-5 py-3 rounded-full shadow-[0_10px_30px_rgba(212,175,55,0.4)] hover:scale-105 transition-transform items-center gap-3 group ${focusRing}`}
        aria-label="Sponsor copies for others"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 animate-pulse">
          <path d="M9.375 3a1.875 1.875 0 0 0 0 3.75h1.875v4.5H3.375A1.875 1.875 0 0 1 1.5 9.375v-.75c0-1.036.84-1.875 1.875-1.875h3.193A3.375 3.375 0 0 1 12 2.753a3.375 3.375 0 0 1 5.432 3.997h3.193c1.035 0 1.875.84 1.875 1.875v.75c0 1.036-.84 1.875-1.875 1.875H12.75v-4.5h1.875a1.875 1.875 0 1 0-1.875-1.875V6.75h-1.5V4.875C11.25 3.839 10.41 3 9.375 3ZM11.25 12.75H3v6.75a2.25 2.25 0 0 0 2.25 2.25h6v-9ZM12.75 12.75v9h6a2.25 2.25 0 0 0 2.25-2.25v-6.75h-8.25Z" />
        </svg>
        <span className="text-xs font-black uppercase tracking-widest whitespace-nowrap">
          Sponsor Copies
        </span>
      </motion.button>

      {/* MOBILE STICKY CTA BAR */}
      <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-book-900/95 backdrop-blur-lg border-t border-gold-500/20 px-5 py-4 flex items-center justify-between gap-4">
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <p className="text-gold-500 font-black text-xl leading-none">₦2,500</p>
            <span className="text-[8px] font-bold uppercase tracking-wider text-book-900 bg-gold-500 px-1.5 py-0.5 rounded-sm">Save ₦500</span>
          </div>
          <p className="text-gray-500 text-[10px] uppercase tracking-wider mt-1.5">Official Pre-Order</p>
        </div>
        <button
          onClick={scrollToPreorder}
          className={`flex-1 max-w-[170px] rounded-full bg-gold-500 text-book-900 font-bold py-3.5 px-4 uppercase tracking-[0.1em] text-xs ${focusRing}`}
        >
          Secure Copy
        </button>
      </div>

      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative min-h-[90svh] flex flex-col items-center justify-start pt-24 pb-16 lg:pb-12">

        {/* Background Typography Watermark */}
        <div className="absolute top-[12%] lg:top-[16%] w-full text-center z-0 pointer-events-none select-none overflow-hidden">
          <h1
            className="text-[14vw] font-black leading-none opacity-[0.15]"
            style={{
              WebkitTextStroke: '1px rgba(212, 175, 55, 0.5)',
              color: 'transparent'
            }}
          >
            ABU HAYYAN
          </h1>
        </div>

        {/* Official Book Title Intro */}
        <motion.div initial="hidden" animate="visible" variants={revealUp} className="z-10 mt-6 lg:mt-10 flex flex-col items-center gap-4 text-center px-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-gold-500 drop-shadow-md" dir="rtl">الجمان من بدائع أبي حيان</h2>
          <div className="flex flex-col items-center">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-serif text-white uppercase tracking-[0.15em] leading-none drop-shadow-lg">Pearls</h1>
            <p className="text-gray-300 text-[10px] sm:text-xs lg:text-sm uppercase tracking-[0.3em] font-light mt-3 text-center max-w-[80vw]">From the Masterpieces of Abu Hayyan</p>
          </div>
        </motion.div>

        {/* Massive Centered 3D Book */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative z-10 w-full max-w-5xl h-[45vh] sm:h-[55vh] lg:h-[60vh] mt-4 lg:mt-8 cursor-grab active:cursor-grabbing"
        >
          <Book3DModel onLoaded={() => setModelLoaded(true)} />
        </motion.div>

        {/* Purchase Card */}
        <motion.div
          id="preorder"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative z-20 -mt-10 sm:-mt-16 lg:-mt-20 w-[92%] max-w-4xl mx-auto scroll-mt-24"
        >
          <div className="bg-book-800/60 backdrop-blur-2xl border border-gold-500/20 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] rounded-3xl overflow-hidden p-6 sm:p-8 lg:p-10 flex flex-col md:flex-row items-center justify-between gap-8">

            {/* Price Block with natively positioned savings */}
            <div className="flex-1 text-center md:text-left w-full">
              <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mb-3 font-bold">Official Pre-Order</p>
              <div className="flex items-center justify-center md:justify-start gap-4">
                <span className="text-4xl lg:text-5xl font-black text-gold-500 leading-none">₦2,500</span>
                <div className="flex flex-col items-start gap-1.5">
                  <span className="relative inline-block text-sm lg:text-base text-gray-500 font-bold leading-none">
                    <span className="absolute top-1/2 left-[-10%] w-[120%] h-[1.5px] bg-red-500 -rotate-12" />
                    ₦3,000
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-book-900 bg-gold-500 px-2 py-0.5 rounded-sm">
                    Save ₦500
                  </span>
                </div>
              </div>
            </div>

            {/* Vertical Divider (Desktop) */}
            <div className="hidden md:block w-px h-20 bg-gold-500/20" />

            {/* Countdown Block */}
            <div className="flex-1 text-center w-full">
              <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mb-4 font-bold">Pre-Order Closes In</p>
              {isMounted ? (
                <div className="flex items-center justify-center gap-3 lg:gap-5 text-white font-mono text-2xl lg:text-3xl">
                  <div className="flex flex-col items-center"><span className="font-light">{timeLeft.days}</span><span className="text-[9px] text-gold-500/80 mt-1 font-sans">DAYS</span></div>
                  <span className="text-gold-500/30 pb-3">:</span>
                  <div className="flex flex-col items-center"><span className="font-light">{timeLeft.hours}</span><span className="text-[9px] text-gold-500/80 mt-1 font-sans">HRS</span></div>
                  <span className="text-gold-500/30 pb-3">:</span>
                  <div className="flex flex-col items-center"><span className="font-light">{timeLeft.minutes}</span><span className="text-[9px] text-gold-500/80 mt-1 font-sans">MIN</span></div>
                  <span className="text-gold-500/30 pb-3">:</span>
                  <div className="flex flex-col items-center"><span className="font-light">{timeLeft.seconds}</span><span className="text-[9px] text-gold-500/80 mt-1 font-sans">SEC</span></div>
                </div>
              ) : (
                <div className="h-10 w-48 bg-white/5 animate-pulse mx-auto rounded-full" />
              )}
            </div>

            {/* CTA Block (with inline Sponsor option) */}
            <div className="flex-1 w-full md:w-auto flex flex-col gap-3">
              <button className={`w-full rounded-full bg-gold-500 text-book-900 font-bold py-4 lg:py-5 px-8 uppercase tracking-[0.2em] text-sm transition-all duration-300 hover:bg-gold-400 hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] active:scale-[0.98] ${focusRing}`}>
                Secure Copy
              </button>
              
              <button className="w-full flex items-center justify-center gap-2 text-gold-500/80 hover:text-gold-400 transition-colors text-[10px] sm:text-xs font-bold uppercase tracking-widest py-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M9.375 3a1.875 1.875 0 0 0 0 3.75h1.875v4.5H3.375A1.875 1.875 0 0 1 1.5 9.375v-.75c0-1.036.84-1.875 1.875-1.875h3.193A3.375 3.375 0 0 1 12 2.753a3.375 3.375 0 0 1 5.432 3.997h3.193c1.035 0 1.875.84 1.875 1.875v.75c0 1.036-.84 1.875-1.875 1.875H12.75v-4.5h1.875a1.875 1.875 0 1 0-1.875-1.875V6.75h-1.5V4.875C11.25 3.839 10.41 3 9.375 3ZM11.25 12.75H3v6.75a2.25 2.25 0 0 0 2.25 2.25h6v-9ZM12.75 12.75v9h6a2.25 2.25 0 0 0 2.25-2.25v-6.75h-8.25Z" />
                </svg>
                Sponsor Copies Instead
              </button>
            </div>
            
          </div>
        </motion.div>
      </section>

      {/* 2. HIGHLIGHTS STRIP */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerContainer}
        className="relative px-6 lg:px-24 max-w-7xl mx-auto pt-8 pb-12 lg:pb-16"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-gold-500/10 border border-gold-500/10 rounded-2xl overflow-hidden">
          <motion.div variants={revealUp} className="bg-book-900/80 backdrop-blur-sm p-6 sm:p-8 flex flex-col items-center text-center gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-6 h-6 text-gold-500">
              <path strokeLinecap="round" d="M6 17V9M12 17V5M18 17v-5" />
            </svg>
            <p className="text-gray-300 text-xs sm:text-sm uppercase tracking-[0.15em] leading-relaxed font-serif">Classical Arabic Meter</p>
          </motion.div>
          <motion.div variants={revealUp} className="bg-book-900/80 backdrop-blur-sm p-6 sm:p-8 flex flex-col items-center text-center gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-6 h-6 text-gold-500">
              <circle cx="12" cy="12" r="8.25" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 12.5l2.5 2.5 4.5-5" />
            </svg>
            <p className="text-gray-300 text-xs sm:text-sm uppercase tracking-[0.15em] leading-relaxed font-serif">Vetted by Scholars</p>
          </motion.div>
          <motion.div variants={revealUp} className="bg-book-900/80 backdrop-blur-sm p-6 sm:p-8 flex flex-col items-center text-center gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-6 h-6 text-gold-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3L19 6L19 12C19 16.5 16 19.5 12 21C8 19.5 5 16.5 5 12L5 6Z" />
            </svg>
            <p className="text-gray-300 text-xs sm:text-sm uppercase tracking-[0.15em] leading-relaxed font-serif">Islamic Heritage</p>
          </motion.div>
        </div>
      </motion.section>

      {/* 3. ASYMMETRICAL EDITORIAL LAYOUT */}
      <section className="relative px-6 lg:px-24 max-w-7xl mx-auto pb-16 lg:pb-24">

        {/* The Masterpiece (Wide Focus) */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={revealUp} className="mb-20 lg:mb-28 relative">
          <div className="absolute left-0 top-0 w-[2px] h-24 bg-gradient-to-b from-gold-500 to-transparent rounded-full" />
          <div className="pl-8 lg:pl-16 md:w-3/4 lg:w-2/3">
            <h3 className="text-xs font-bold text-gold-500 uppercase tracking-[0.3em] mb-6">01 — The Masterpiece</h3>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white leading-tight mb-8 font-serif">
              A beautifully preserved volume dedicated to <span className="text-gold-400 italic">deep wisdom</span>, noble Islamic morals, and the love for the Prophet.
            </h2>
            <div className="space-y-6 text-gray-400 text-sm sm:text-base lg:text-lg font-light leading-relaxed max-w-2xl font-serif">
              <p>Gathering scattered poetic works into one beautifully preserved volume. Every poem within is written using traditional Arabic meter and rhyme to bring out the true, unadulterated beauty of the language.</p>
              <p className="pl-6 border-l-2 border-gold-500/40 text-gray-300 font-serif italic">
                Alhamdulillah... It was vetted by scholars for its rich vocabulary, sweet meaning, and excellent eloquence. Pre-order to support the preservation of our Islamic and poetic heritage.
              </p>
            </div>
          </div>
        </motion.div>

        {/* The Author (Offset Right) */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={revealUp} className="flex justify-end relative">
          <div className="absolute right-0 top-0 w-[2px] h-24 bg-gradient-to-b from-gold-500 to-transparent md:hidden rounded-full" />
          <div className="pr-8 lg:pr-0 md:pl-16 lg:pl-32 md:border-l-2 border-gold-500/20 md:w-3/4 lg:w-1/2">
            <h3 className="text-xs font-bold text-gold-500 uppercase tracking-[0.3em] mb-6">02 — The Author</h3>
            <h2 className="text-2xl sm:text-3xl font-light text-white mb-2 font-serif">Yusuf Oyetunji</h2>
            <p className="text-gold-600 font-serif italic text-xl mb-8">Abu Hayyãn</p>

            <div className="space-y-6 text-gray-400 text-sm sm:text-base font-light leading-relaxed font-serif">
              <p>A dedicated writer, translator, and student of classical Arabic poetry. Graduate of the Institute of Islamic Sciences and Studies in Amuloko, Ibadan, Nigeria.</p>
              <p>Holding both a Bachelor of Arts and a Master of Arts in English from the University of Ibadan, currently furthering studies at Kuliyyah Imam Malik in Jegede, Ibadan.</p>
              <p>Passionate about sharing beneficial knowledge and preserving Islamic literary heritage, this debut collection reflects an extensive literary background and a deep, enduring love for classical Arabic poetry.</p>
            </div>

            {/* Credential chips */}
            <div className="flex flex-wrap gap-2 mt-8 justify-end">
              <span className="text-[10px] uppercase tracking-wider text-gold-500/90 border border-gold-500/20 px-3 py-1.5 rounded-full bg-book-800/30">Institute of Islamic Sciences &amp; Studies, Amuloko</span>
              <span className="text-[10px] uppercase tracking-wider text-gold-500/90 border border-gold-500/20 px-3 py-1.5 rounded-full bg-book-800/30">B.A. English — University of Ibadan</span>
              <span className="text-[10px] uppercase tracking-wider text-gold-500/90 border border-gold-500/20 px-3 py-1.5 rounded-full bg-book-800/30">M.A. English — University of Ibadan</span>
              <span className="text-[10px] uppercase tracking-wider text-gold-500/90 border border-gold-500/20 px-3 py-1.5 rounded-full bg-book-800/30">Kuliyyah Imam Malik, Jegede (Ongoing)</span>
            </div>
          </div>
        </motion.div>

      </section>

      {/* 4. FINAL CTA */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={revealUp}
        className="relative px-6 py-16 lg:py-24 border-t border-gold-500/10 text-center overflow-hidden"
      >
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60vw] h-[30vh] bg-gold-500/10 rounded-[100%] blur-[100px] pointer-events-none" />
        <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center gap-6">
          <p className="text-gold-500 uppercase tracking-[0.4em] text-[10px] lg:text-xs font-bold">A Limited Allocation</p>
          <h2 className="text-2xl sm:text-3xl font-serif font-light text-white leading-relaxed">Secure your copy of Abu Hayyãn's debut collection before the pre-order closes.</h2>
          <button
            onClick={scrollToPreorder}
            className={`mt-4 rounded-full bg-gold-500 text-book-900 font-bold py-4 px-10 uppercase tracking-[0.2em] text-sm hover:bg-gold-400 hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all duration-300 ${focusRing}`}
          >
            Secure Copy — ₦2,500
          </button>
        </div>
      </motion.section>

      {/* QUADROX FOOTER */}
      <footer className="relative border-t border-gold-500/10 pt-10 pb-28 lg:pb-12 px-6 flex justify-center z-10 bg-book-900/50">
        <a 
          href="mailto:dev@quadroxtech.cloud" 
          className="text-gray-500 hover:text-gold-500 transition-colors text-[10px] sm:text-xs tracking-[0.2em] uppercase font-bold text-center"
        >
          &copy; QUADROX TECHNOLOGIES LIMITED 2026
        </a>
      </footer>

    </main>
  );
}
