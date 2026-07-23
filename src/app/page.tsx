'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, useReducedMotion } from 'framer-motion';

const Book3DModel = dynamic(() => import('@/components/Book3DModel'), {
  ssr: false,
  loading: () => (
    <div className="h-[50vh] lg:h-[70vh] w-full flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
      <div className="text-gold-500 text-xs sm:text-sm uppercase tracking-[0.3em]">Initializing Render...</div>
    </div>
  )
});

export default function Home() {
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
            <span className="w-8 h-8 border border-gold-500/40 flex items-center justify-center text-gold-500 font-serif text-sm">AH</span>
            <span className="hidden sm:block text-gray-300 text-xs uppercase tracking-[0.3em]">Abu Hayyãn</span>
          </div>
          <button
            onClick={scrollToPreorder}
            className={`text-[10px] sm:text-xs uppercase tracking-[0.2em] font-bold text-gold-500 border border-gold-500/40 px-4 sm:px-5 py-2 hover:bg-gold-500 hover:text-book-900 transition-colors ${focusRing}`}
          >
            Pre-Order
          </button>
        </div>
      </motion.header>

      {/* FLOATING SPONSOR SEAL */}
      <motion.button
        animate={shouldReduceMotion ? {} : { y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className={`fixed bottom-24 lg:bottom-8 right-6 lg:right-12 z-50 bg-gradient-to-b from-gold-400 to-gold-600 text-book-900 p-4 rounded-full shadow-[0_10px_30px_rgba(212,175,55,0.3)] hover:scale-110 transition-transform flex items-center justify-center group ${focusRing}`}
        aria-label="Sponsor copies for others"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 lg:w-7 lg:h-7">
          <path d="M9.375 3a1.875 1.875 0 0 0 0 3.75h1.875v4.5H3.375A1.875 1.875 0 0 1 1.5 9.375v-.75c0-1.036.84-1.875 1.875-1.875h3.193A3.375 3.375 0 0 1 12 2.753a3.375 3.375 0 0 1 5.432 3.997h3.193c1.035 0 1.875.84 1.875 1.875v.75c0 1.036-.84 1.875-1.875 1.875H12.75v-4.5h1.875a1.875 1.875 0 1 0-1.875-1.875V6.75h-1.5V4.875C11.25 3.839 10.41 3 9.375 3ZM11.25 12.75H3v6.75a2.25 2.25 0 0 0 2.25 2.25h6v-9ZM12.75 12.75v9h6a2.25 2.25 0 0 0 2.25-2.25v-6.75h-8.25Z" />
        </svg>
        <div className="absolute right-full mr-4 bg-book-900 text-gold-400 border border-gold-500/30 px-6 py-3 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-[0.2em] hidden sm:block shadow-2xl">
          Sponsor Copies
        </div>
      </motion.button>

      {/* MOBILE STICKY CTA BAR */}
      <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-book-900/95 backdrop-blur-lg border-t border-gold-500/20 px-4 py-3 flex items-center justify-between gap-4">
        <div>
          <p className="text-gold-500 font-black text-lg leading-none">₦2,500</p>
          <p className="text-gray-500 text-[10px] uppercase tracking-wider mt-0.5">Pre-Order Price</p>
        </div>
        <button
          onClick={scrollToPreorder}
          className={`flex-1 max-w-[200px] bg-gold-500 text-book-900 font-bold py-3 px-6 uppercase tracking-[0.15em] text-xs ${focusRing}`}
        >
          Secure Copy
        </button>
      </div>

      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative min-h-[100svh] flex flex-col items-center justify-start pt-24 pb-40 lg:pb-32">

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

        {/* Small Intro Badge */}
        <motion.div initial="hidden" animate="visible" variants={revealUp} className="z-10 mt-2 lg:mt-6 flex flex-col items-center gap-3 text-center">
          <p className="text-gold-500 uppercase tracking-[0.4em] text-[10px] lg:text-xs font-bold">The Debut Collection</p>
          <p className="text-gray-500 text-xs sm:text-sm font-serif italic">A Diwan of Classical Arabic Poetry</p>
        </motion.div>

        {/* Massive Centered 3D Book */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative z-10 w-full max-w-5xl h-[50vh] sm:h-[58vh] lg:h-[68vh] mt-4 cursor-grab active:cursor-grabbing"
        >
          <Book3DModel />
        </motion.div>

        {/* Purchase Card */}
        <motion.div
          id="preorder"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative z-20 -mt-10 sm:-mt-16 lg:-mt-20 w-[92%] max-w-4xl mx-auto scroll-mt-24"
        >
          <div className="bg-book-800/50 backdrop-blur-2xl border border-gold-500/20 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)]">

            {/* Savings ribbon */}
            <div className="flex items-center justify-center gap-2 border-b border-gold-500/10 py-2.5 bg-gold-500/[0.06]">
              <span className="w-1 h-1 rounded-full bg-gold-500" />
              <p className="text-gold-400 text-[10px] sm:text-xs uppercase tracking-[0.25em] font-bold">Save ₦500 on the Official Pre-Order Price</p>
              <span className="w-1 h-1 rounded-full bg-gold-500" />
            </div>

            <div className="p-6 sm:p-8 lg:p-10 flex flex-col md:flex-row items-center justify-between gap-8">

              {/* Price Block */}
              <div className="flex-1 text-center md:text-left">
                <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mb-2 font-bold">Official Pre-Order</p>
                <div className="flex items-end justify-center md:justify-start gap-4">
                  <span className="text-4xl lg:text-5xl font-black text-gold-500 leading-none">₦2,500</span>
                  <span className="relative inline-block text-lg lg:text-xl text-gray-500 font-bold leading-none pb-1">
                    <span className="absolute top-1/2 left-[-10%] w-[120%] h-[2px] bg-red-600 -rotate-12" />
                    ₦3,000
                  </span>
                </div>
              </div>

              {/* Vertical Divider (Desktop) */}
              <div className="hidden md:block w-px h-16 bg-gold-500/20" />

              {/* Countdown Block */}
              <div className="flex-1 text-center">
                <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mb-3 font-bold">Allocation Closes</p>
                {isMounted ? (
                  <div className="flex items-center justify-center gap-3 lg:gap-5 text-white font-mono text-xl lg:text-2xl">
                    <div className="flex flex-col items-center"><span className="font-light">{timeLeft.days}</span><span className="text-[9px] text-gold-500/80 mt-1 font-sans">DAYS</span></div>
                    <span className="text-gold-500/30 pb-3">:</span>
                    <div className="flex flex-col items-center"><span className="font-light">{timeLeft.hours}</span><span className="text-[9px] text-gold-500/80 mt-1 font-sans">HRS</span></div>
                    <span className="text-gold-500/30 pb-3">:</span>
                    <div className="flex flex-col items-center"><span className="font-light">{timeLeft.minutes}</span><span className="text-[9px] text-gold-500/80 mt-1 font-sans">MIN</span></div>
                    <span className="text-gold-500/30 pb-3">:</span>
                    <div className="flex flex-col items-center"><span className="font-light">{timeLeft.seconds}</span><span className="text-[9px] text-gold-500/80 mt-1 font-sans">SEC</span></div>
                  </div>
                ) : (
                  <div className="h-10 w-48 bg-white/5 animate-pulse mx-auto" />
                )}
              </div>

              {/* CTA Block */}
              <div className="flex-1 w-full md:w-auto">
                <button className={`w-full bg-gold-500 text-book-900 font-bold py-5 px-8 uppercase tracking-[0.2em] text-sm transition-all duration-300 hover:bg-gold-400 hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] active:scale-[0.98] ${focusRing}`}>
                  Secure Copy
                </button>
              </div>
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
        className="relative px-6 lg:px-24 max-w-7xl mx-auto pb-24 lg:pb-32"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-gold-500/10 border border-gold-500/10">
          <motion.div variants={revealUp} className="bg-book-900 p-6 sm:p-8 flex flex-col items-center text-center gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-6 h-6 text-gold-500">
              <path strokeLinecap="round" d="M6 17V9M12 17V5M18 17v-5" />
            </svg>
            <p className="text-gray-300 text-xs sm:text-sm uppercase tracking-[0.15em] leading-relaxed">Classical Arabic Meter &amp; Rhyme</p>
          </motion.div>
          <motion.div variants={revealUp} className="bg-book-900 p-6 sm:p-8 flex flex-col items-center text-center gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-6 h-6 text-gold-500">
              <circle cx="12" cy="12" r="8.25" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 12.5l2.5 2.5 4.5-5" />
            </svg>
            <p className="text-gray-300 text-xs sm:text-sm uppercase tracking-[0.15em] leading-relaxed">Vetted by Scholars</p>
          </motion.div>
          <motion.div variants={revealUp} className="bg-book-900 p-6 sm:p-8 flex flex-col items-center text-center gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-6 h-6 text-gold-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3L19 6L19 12C19 16.5 16 19.5 12 21C8 19.5 5 16.5 5 12L5 6Z" />
            </svg>
            <p className="text-gray-300 text-xs sm:text-sm uppercase tracking-[0.15em] leading-relaxed">Preserving Islamic Heritage</p>
          </motion.div>
        </div>
      </motion.section>

      {/* 3. ASYMMETRICAL EDITORIAL LAYOUT */}
      <section className="relative px-6 lg:px-24 max-w-7xl mx-auto pb-24 lg:pb-40">

        {/* The Masterpiece (Wide Focus) */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={revealUp} className="mb-32 lg:mb-48 relative">
          <div className="absolute left-0 top-0 w-[2px] h-32 bg-gradient-to-b from-gold-500 to-transparent" />
          <div className="pl-8 lg:pl-16 md:w-3/4 lg:w-2/3">
            <h3 className="text-xs font-bold text-gold-500 uppercase tracking-[0.3em] mb-6">01 — The Masterpiece</h3>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white leading-tight mb-10 font-serif">
              A beautifully preserved volume dedicated to <span className="text-gold-400 italic">deep wisdom</span>, noble Islamic morals, and the love for the Prophet.
            </h2>
            <div className="space-y-6 text-gray-400 text-sm sm:text-base lg:text-lg font-light leading-relaxed max-w-2xl">
              <p>Gathering scattered poetic works into one beautifully preserved volume. Every poem within is written using traditional Arabic meter and rhyme to bring out the true, unadulterated beauty of the language.</p>
              <p className="pl-6 border-l border-gold-500/30 text-gray-300 font-serif italic">
                Alhamdulillah... It was vetted by scholars for its rich vocabulary, sweet meaning, and excellent eloquence. Pre-order to support the preservation of our Islamic and poetic heritage.
              </p>
            </div>
          </div>
        </motion.div>

        {/* The Author (Offset Right) */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={revealUp} className="flex justify-end relative">
          <div className="absolute right-0 top-0 w-[2px] h-32 bg-gradient-to-b from-gold-500 to-transparent md:hidden" />
          <div className="pr-8 lg:pr-0 md:pl-16 lg:pl-32 md:border-l border-gold-500/20 md:w-3/4 lg:w-1/2">
            <h3 className="text-xs font-bold text-gold-500 uppercase tracking-[0.3em] mb-6">02 — The Author</h3>
            <h2 className="text-2xl sm:text-3xl font-light text-white mb-2">Yusuf Olalekan Oyetunji</h2>
            <p className="text-gold-600 font-serif italic text-xl mb-8">Abu Hayyãn</p>

            <div className="space-y-6 text-gray-400 text-sm sm:text-base font-light leading-relaxed">
              <p>A dedicated writer, translator, and student of classical Arabic poetry. Graduate of the Institute of Islamic Sciences and Studies in Amuloko, Ibadan, Nigeria.</p>
              <p>Holding both a Bachelor of Arts and a Master of Arts in English from the University of Ibadan, currently furthering studies at Kuliyyah Imam Malik in Jegede, Ibadan.</p>
              <p>Passionate about sharing beneficial knowledge and preserving Islamic literary heritage, this debut collection reflects an extensive literary background and a deep, enduring love for classical Arabic poetry.</p>
            </div>

            {/* Credential chips */}
            <div className="flex flex-wrap gap-2 mt-8 justify-end">
              <span className="text-[10px] uppercase tracking-wider text-gold-500/90 border border-gold-500/20 px-3 py-1.5">Institute of Islamic Sciences &amp; Studies, Amuloko</span>
              <span className="text-[10px] uppercase tracking-wider text-gold-500/90 border border-gold-500/20 px-3 py-1.5">B.A. English — University of Ibadan</span>
              <span className="text-[10px] uppercase tracking-wider text-gold-500/90 border border-gold-500/20 px-3 py-1.5">M.A. English — University of Ibadan</span>
              <span className="text-[10px] uppercase tracking-wider text-gold-500/90 border border-gold-500/20 px-3 py-1.5">Kuliyyah Imam Malik, Jegede (Ongoing)</span>
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
        className="relative px-6 py-24 lg:py-32 border-t border-gold-500/10 text-center overflow-hidden"
      >
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60vw] h-[30vh] bg-gold-500/10 rounded-[100%] blur-[100px] pointer-events-none" />
        <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center gap-6">
          <p className="text-gold-500 uppercase tracking-[0.4em] text-[10px] lg:text-xs font-bold">A Limited Allocation</p>
          <h2 className="text-2xl sm:text-3xl font-serif font-light text-white">Secure your copy of Abu Hayyãn's debut collection before the allocation closes.</h2>
          <button
            onClick={scrollToPreorder}
            className={`bg-gold-500 text-book-900 font-bold py-4 px-10 uppercase tracking-[0.2em] text-sm hover:bg-gold-400 hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all duration-300 ${focusRing}`}
          >
            Secure Copy — ₦2,500
          </button>
        </div>
      </motion.section>

      {/* FOOTER */}
      <footer className="relative border-t border-gold-500/10 py-10 pb-28 lg:pb-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-gray-600 text-xs tracking-[0.15em] uppercase">Yusuf Olalekan Oyetunji</p>
          <p className="text-gold-600/60 font-serif italic text-sm">Abu Hayyãn — The Debut Collection</p>
        </div>
      </footer>

    </main>
  );
}