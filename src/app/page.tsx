'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

// Load 3D model safely
const Book3DModel = dynamic(() => import('@/components/Book3DModel'), {
  ssr: false,
  loading: () => <div className="h-[350px] lg:h-[600px] w-full animate-pulse bg-book-800 border border-gold-500/20 flex items-center justify-center text-gold-500 text-xs sm:text-sm uppercase tracking-widest">Loading 3D Experience...</div>
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <main className="min-h-screen bg-book-900 selection:bg-gold-500 selection:text-book-900 pb-20">
      
      {/* FLOATING SPONSOR ICON */}
      <button className="fixed bottom-6 right-6 z-50 bg-gold-500 text-book-900 p-4 rounded-full shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-110 transition-transform flex items-center justify-center group">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
        </svg>
        <span className="absolute right-full mr-4 bg-book-800 text-gold-500 border border-gold-500/30 px-3 py-1 rounded text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-widest hidden sm:block">
          Sponsor Copies
        </span>
      </button>

      {/* HERO SECTION (Mobile: Book First | Desktop: Text First) */}
      <section className="relative px-6 pt-12 pb-16 lg:px-24 max-w-7xl mx-auto flex flex-col-reverse lg:grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[90vh]">
        
        {/* Copy & CTA */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex flex-col space-y-8 z-10 w-full text-center lg:text-left">
          <div className="space-y-4">
            <div className="inline-block border border-gold-500/30 bg-book-800 px-4 py-1 mx-auto lg:mx-0">
              <h2 className="text-gold-500 tracking-[0.2em] uppercase text-[10px] sm:text-xs font-bold">
                Official Pre-Release
              </h2>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white">
              Pearls from the Masterpieces of <br className="hidden lg:block" />
              <span className="gold-gradient-text">Abu Hayyan</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-300 max-w-lg mx-auto lg:mx-0 leading-relaxed border-t-2 lg:border-t-0 lg:border-l-4 border-gold-500 pt-4 lg:pt-0 lg:pl-4 bg-book-800/30 lg:py-2">
              A beautifully preserved volume of classical Arabic poetry dedicated to deep wisdom, noble Islamic morals, and excellent eloquence.
            </p>
          </div>

          {/* Pricing Box */}
          <div className="bg-book-800 border border-gold-500/40 p-6 sm:p-8 shadow-2xl relative w-full mx-auto max-w-md lg:max-w-none">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600"></div>
            
            <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end gap-6 sm:gap-0 mb-8 border-b border-gray-700 pb-6">
              <div className="text-center sm:text-left">
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-1 font-semibold">Pre-Order Rate</p>
                <div className="flex items-center justify-center sm:justify-start space-x-3">
                  <span className="text-3xl sm:text-4xl font-bold text-gold-500">₦2,500</span>
                  <span className="text-base sm:text-lg text-gray-500 line-through">₦3,000</span>
                </div>
              </div>
              
              <div className="text-center sm:text-right">
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-2 font-semibold">Offer Expires In</p>
                <div className="flex space-x-2 sm:space-x-3 text-white font-mono text-lg sm:text-xl justify-center sm:justify-end">
                  <div className="flex flex-col items-center"><span className="font-bold">{timeLeft.days}</span><span className="text-[9px] sm:text-[10px] text-gray-500">D</span></div>
                  <span>:</span>
                  <div className="flex flex-col items-center"><span className="font-bold">{timeLeft.hours}</span><span className="text-[9px] sm:text-[10px] text-gray-500">H</span></div>
                  <span>:</span>
                  <div className="flex flex-col items-center"><span className="font-bold">{timeLeft.minutes}</span><span className="text-[9px] sm:text-[10px] text-gray-500">M</span></div>
                  <span>:</span>
                  <div className="flex flex-col items-center"><span className="font-bold">{timeLeft.seconds}</span><span className="text-[9px] sm:text-[10px] text-gray-500">S</span></div>
                </div>
              </div>
            </div>
            
            <button className="w-full bg-gold-500 hover:bg-gold-400 text-book-900 font-bold py-4 uppercase tracking-widest transition-colors shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)]">
              Proceed to Pre-Order
            </button>
          </div>
        </motion.div>

        {/* 3D Book Area */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="relative w-full h-[350px] sm:h-[450px] lg:h-[700px] flex items-center justify-center cursor-grab active:cursor-grabbing mx-auto">
          <div className="absolute inset-0 bg-gradient-radial from-gold-500/15 to-transparent opacity-50 z-0 pointer-events-none" />
          <Book3DModel />
        </motion.div>
      </section>

      {/* CONTENT SECTIONS (Side-by-side on desktop, stacked on mobile) */}
      <section className="px-6 lg:px-24 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 py-16 lg:py-24 border-t border-gold-500/10">
        
        {/* ABOUT THE BOOK */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} className="space-y-6">
          <h3 className="text-xl sm:text-2xl font-bold text-gold-500 uppercase tracking-widest mb-6 lg:mb-8 border-b border-book-700 pb-4">About The Book</h3>
          <div className="space-y-4 text-base sm:text-lg text-gray-300 leading-relaxed font-serif text-justify sm:text-left">
            <p>"Pearls from the Masterpieces of Abu Hayyan" is my debut collection of classical Arabic poetry.</p>
            <p>This book gathers my scattered poetic works into one beautifully preserved volume. Inside, you will find poems dedicated to deep wisdom, noble Islamic morals, love for the Prophet, and many more.</p>
            <p>Every poem in it is written using traditional Arabic meter and rhyme to bring out the true beauty of the language.</p>
            <div className="bg-book-800/80 border-l-2 border-gold-500 p-4 my-6">
              <p className="text-white font-semibold italic text-sm sm:text-base">Alhamdulillah... It was vetted by a few scholars for its rich vocabulary, sweet meaning, and excellent eloquence.</p>
            </div>
            <p>Pre-order your copy today to support the preservation of our Islamic and poetic heritage. I personally also invite you to the BOOK LAUNCHING CEREMONY.</p>
            <p className="text-gold-500 font-bold tracking-widest pt-2 uppercase text-sm sm:text-base text-center sm:text-left">Jazakumullahu Khayran.</p>
          </div>
        </motion.div>

        {/* ABOUT THE AUTHOR */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} className="space-y-6">
          <h3 className="text-xl sm:text-2xl font-bold text-gold-500 uppercase tracking-widest mb-6 lg:mb-8 border-b border-book-700 pb-4">About The Author</h3>
          <h4 className="text-lg sm:text-xl font-bold text-white text-center sm:text-left">Yusuf Olalekan Oyetunji <br className="sm:hidden" /><span className="text-gold-500">(Abu Hayyãn)</span></h4>
          <div className="space-y-4 text-gray-300 leading-relaxed text-sm sm:text-base text-justify sm:text-left">
            <p>A dedicated writer, translator, and student of classical Arabic poetry. He is a graduate of the Institute of Islamic Sciences and Studies in Amuloko, Ibadan, Nigeria.</p>
            <p>He holds both a Bachelor of Arts and a Master of Arts in English from the University of Ibadan, and is currently furthering his studies at Kuliyyah Imam Malik in Jegede, Ibadan.</p>
            <p>As a dedicated online educator and writer, he is passionate about sharing beneficial knowledge and preserving Islamic literary heritage. This debut collection reflects his extensive literary background and his deep love for classical Arabic poetry.</p>
          </div>
        </motion.div>

      </section>
    </main>
  );
}