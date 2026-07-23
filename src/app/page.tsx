'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

const Book3DModel = dynamic(() => import('@/components/Book3DModel'), {
  ssr: false,
  loading: () => (
    <div className="h-[350px] lg:h-[600px] w-full animate-pulse bg-book-800/50 backdrop-blur-md rounded-xl border border-gold-500/20 flex items-center justify-center text-gold-500 text-xs sm:text-sm uppercase tracking-widest shadow-[0_0_30px_rgba(212,175,55,0.05)]">
      Initializing 3D Engine...
    </div>
  )
});

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setIsMounted(true);
    // Universal Fixed Target Date: August 22, 2026 (30 days from July 23)
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

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <main className="min-h-screen bg-book-900 selection:bg-gold-500 selection:text-book-900 pb-20 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-gold-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-gold-500/5 rounded-full blur-[150px] pointer-events-none"></div>

      {/* FLOATING SPONSOR SEAL (Highly Animated & Premium) */}
      <motion.button 
        animate={{ y: [0, -12, 0] }} 
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="fixed bottom-8 right-6 lg:right-12 z-50 bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 text-book-900 p-4 lg:p-5 rounded-full shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:shadow-[0_0_50px_rgba(212,175,55,0.7)] hover:scale-110 transition-all flex items-center justify-center group border-2 border-book-900"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 lg:w-8 lg:h-8">
          <path d="M9.375 3a1.875 1.875 0 0 0 0 3.75h1.875v4.5H3.375A1.875 1.875 0 0 1 1.5 9.375v-.75c0-1.036.84-1.875 1.875-1.875h3.193A3.375 3.375 0 0 1 12 2.753a3.375 3.375 0 0 1 5.432 3.997h3.193c1.035 0 1.875.84 1.875 1.875v.75c0 1.036-.84 1.875-1.875 1.875H12.75v-4.5h1.875a1.875 1.875 0 1 0-1.875-1.875V6.75h-1.5V4.875C11.25 3.839 10.41 3 9.375 3ZM11.25 12.75H3v6.75a2.25 2.25 0 0 0 2.25 2.25h6v-9ZM12.75 12.75v9h6a2.25 2.25 0 0 0 2.25-2.25v-6.75h-8.25Z" />
        </svg>
        <span className="absolute right-full mr-6 bg-book-800/90 backdrop-blur-sm text-gold-400 border border-gold-500/40 px-5 py-2 text-sm font-extrabold opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap pointer-events-none uppercase tracking-[0.2em] hidden sm:block shadow-2xl rounded-sm">
          Sponsor Copies
        </span>
      </motion.button>

      {/* HERO SECTION */}
      <section className="relative px-6 pt-12 pb-16 lg:px-24 max-w-7xl mx-auto flex flex-col-reverse lg:grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[90vh]">
        
        {/* Copy & CTA */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex flex-col space-y-10 z-10 w-full text-center lg:text-left">
          <div className="space-y-6">
            <div className="inline-block border border-gold-500/30 bg-book-800/60 backdrop-blur-sm px-5 py-2 mx-auto lg:mx-0 shadow-[0_0_15px_rgba(212,175,55,0.1)] rounded-sm">
              <h2 className="text-gold-500 tracking-[0.25em] uppercase text-[10px] sm:text-xs font-black">
                Official Pre-Release
              </h2>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-tight text-white drop-shadow-2xl">
              Pearls from the Masterpieces of <br className="hidden lg:block" />
              <span className="gold-gradient-text drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]">Abu Hayyan</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-300 max-w-lg mx-auto lg:mx-0 leading-relaxed border-t-2 lg:border-t-0 lg:border-l-4 border-gold-500 pt-6 lg:pt-0 lg:pl-6 bg-book-800/20 backdrop-blur-sm lg:py-4 rounded-r-xl">
              A beautifully preserved volume of classical Arabic poetry dedicated to deep wisdom, noble Islamic morals, and excellent eloquence.
            </p>
          </div>

          {/* Premium Pricing Box */}
          <div className="bg-book-800/40 backdrop-blur-xl border border-gold-500/30 p-8 sm:p-10 shadow-2xl relative w-full mx-auto max-w-md lg:max-w-none rounded-sm">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gold-400 to-transparent"></div>
            
            <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end gap-8 sm:gap-0 mb-10 border-b border-gray-700/50 pb-8">
              <div className="text-center sm:text-left">
                <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mb-2 font-bold">Pre-Order Rate</p>
                <div className="flex items-center justify-center sm:justify-start space-x-4">
                  <span className="text-4xl sm:text-5xl font-black text-gold-500 drop-shadow-md">₦2,500</span>
                  
                  {/* Slashed Original Price */}
                  <span className="relative inline-block text-lg sm:text-xl text-gray-500 font-bold ml-2">
                    <span className="absolute top-1/2 left-[-10%] w-[120%] h-[2px] bg-red-600 -rotate-12 shadow-[0_0_8px_rgba(220,38,38,0.8)]"></span>
                    ₦3,000
                  </span>
                </div>
              </div>
              
              <div className="text-center sm:text-right">
                <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mb-3 font-bold">Offer Expires In</p>
                {isMounted ? (
                  <div className="flex space-x-3 sm:space-x-4 text-white font-mono text-xl sm:text-2xl justify-center sm:justify-end">
                    <div className="flex flex-col items-center bg-book-900/80 px-3 py-2 rounded-md border border-gold-500/20 shadow-inner"><span className="font-bold">{timeLeft.days}</span><span className="text-[9px] sm:text-[10px] text-gray-500 mt-1">DAYS</span></div>
                    <span className="pt-2 text-gold-500/50">:</span>
                    <div className="flex flex-col items-center bg-book-900/80 px-3 py-2 rounded-md border border-gold-500/20 shadow-inner"><span className="font-bold">{timeLeft.hours}</span><span className="text-[9px] sm:text-[10px] text-gray-500 mt-1">HRS</span></div>
                    <span className="pt-2 text-gold-500/50">:</span>
                    <div className="flex flex-col items-center bg-book-900/80 px-3 py-2 rounded-md border border-gold-500/20 shadow-inner"><span className="font-bold">{timeLeft.minutes}</span><span className="text-[9px] sm:text-[10px] text-gray-500 mt-1">MIN</span></div>
                  </div>
                ) : (
                  <div className="h-12 w-48 bg-book-900/50 animate-pulse rounded-md"></div>
                )}
              </div>
            </div>
            
            <button className="relative w-full group overflow-hidden bg-gold-500 text-book-900 font-extrabold py-5 uppercase tracking-[0.3em] transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_40px_rgba(212,175,55,0.6)] rounded-sm">
              <span className="relative z-10 flex items-center justify-center gap-3">
                Proceed to Pre-Order
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-gold-400 via-gold-300 to-gold-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </motion.div>

        {/* 3D Book Area */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }} className="relative w-full h-[400px] sm:h-[500px] lg:h-[750px] flex items-center justify-center cursor-grab active:cursor-grabbing mx-auto">
          <Book3DModel />
        </motion.div>
      </section>

      {/* CONTENT SECTIONS */}
      <section className="px-6 lg:px-24 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 py-16 lg:py-24 border-t border-gold-500/10">
        
        {/* ABOUT THE BOOK */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} className="space-y-6">
          <h3 className="text-2xl font-black text-gold-500 uppercase tracking-widest mb-6 lg:mb-8 flex items-center gap-4">
            <span className="w-8 h-[2px] bg-gold-500"></span>
            About The Book
          </h3>
          <div className="space-y-5 text-base sm:text-lg text-gray-300 leading-relaxed font-serif text-justify sm:text-left">
            <p>"Pearls from the Masterpieces of Abu Hayyan" is my debut collection of classical Arabic poetry.</p>
            <p>This book gathers my scattered poetic works into one beautifully preserved volume. Inside, you will find poems dedicated to deep wisdom, noble Islamic morals, love for the Prophet, and many more.</p>
            <p>Every poem in it is written using traditional Arabic meter and rhyme to bring out the true beauty of the language.</p>
            <div className="bg-book-800/40 backdrop-blur-sm border border-gold-500/20 p-6 my-8 rounded-sm shadow-xl">
              <p className="text-gold-400 font-semibold italic text-base sm:text-lg leading-relaxed">"Alhamdulillah... It was vetted by a few scholars for its rich vocabulary, sweet meaning, and excellent eloquence."</p>
            </div>
            <p>Pre-order your copy today to support the preservation of our Islamic and poetic heritage. I personally also invite you to the BOOK LAUNCHING CEREMONY.</p>
            <p className="text-gold-500 font-black tracking-[0.2em] pt-4 uppercase text-sm sm:text-base text-center sm:text-left">Jazakumullahu Khayran.</p>
          </div>
        </motion.div>

        {/* ABOUT THE AUTHOR */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} className="space-y-6">
          <h3 className="text-2xl font-black text-gold-500 uppercase tracking-widest mb-6 lg:mb-8 flex items-center gap-4">
            <span className="w-8 h-[2px] bg-gold-500"></span>
            About The Author
          </h3>
          <h4 className="text-xl sm:text-2xl font-bold text-white text-center sm:text-left mb-6">Yusuf Olalekan Oyetunji <br className="sm:hidden" /><span className="text-gold-500 drop-shadow-md">(Abu Hayyãn)</span></h4>
          <div className="space-y-5 text-gray-300 leading-relaxed text-base text-justify sm:text-left">
            <p>A dedicated writer, translator, and student of classical Arabic poetry. He is a graduate of the Institute of Islamic Sciences and Studies in Amuloko, Ibadan, Nigeria.</p>
            <p>He holds both a Bachelor of Arts and a Master of Arts in English from the University of Ibadan, and is currently furthering his studies at Kuliyyah Imam Malik in Jegede, Ibadan.</p>
            <p className="bg-book-800/20 p-5 border-l-2 border-gold-500 rounded-r-md">As a dedicated online educator and writer, he is passionate about sharing beneficial knowledge and preserving Islamic literary heritage. This debut collection reflects his extensive literary background and his deep love for classical Arabic poetry.</p>
          </div>
        </motion.div>

      </section>
    </main>
  );
}