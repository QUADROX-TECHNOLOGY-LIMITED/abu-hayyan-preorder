'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, useReducedMotion } from 'framer-motion';
import CheckoutModal from '@/components/CheckoutModal'; // <-- Imported Modal

// The loading fallback
const Book3DModel = dynamic(() => import('@/components/Book3DModel'), {
  ssr: false,
  loading: () => <div className="h-[50vh] lg:h-[70vh] w-full" />
});

export default function Home() {
  const [modelLoaded, setModelLoaded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [modalMode, setModalMode] = useState<'preorder' | 'sponsor' | null>(null); // <-- Added Modal State
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

  // Kept just in case you still want to use it anywhere
  const scrollToPreorder = () => {
    document.getElementById('preorder')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white';

  return (
    <main className="min-h-screen selection:bg-amber-200 selection:text-stone-900 relative overflow-x-hidden font-sans bg-white text-stone-900">

      {/* CHECKOUT MODAL INJECTION */}
      <CheckoutModal mode={modalMode} onClose={() => setModalMode(null)} />

      {/* FULL SCREEN LOADING OVERLAY */}
      <div className={`fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center transition-opacity duration-1000 ${modelLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="relative flex flex-col items-center justify-center h-40 w-full max-w-sm overflow-hidden">
          <motion.div
            animate={{ x: [-30, 30, -30] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="text-amber-600/80 text-3xl sm:text-4xl font-serif mb-4 font-bold"
          >
            Abu Hayyãn
          </motion.div>
          <motion.div
            animate={{ x: [30, -30, 30] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="text-stone-900 text-5xl sm:text-6xl drop-shadow-sm"
            dir="rtl"
            style={{ fontFamily: "'Amiri', 'Uthmani', 'Traditional Arabic', serif", lineHeight: '1.5' }}
          >
            أبو حيان
          </motion.div>
        </div>
      </div>

      {/* SLIM TOP NAV */}
      <motion.header
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
        className="fixed top-0 inset-x-0 z-40 border-b border-stone-200 bg-white/90 backdrop-blur-lg shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full border-2 border-stone-900 flex items-center justify-center text-stone-900 font-serif text-sm font-bold">AH</span>
            <span className="hidden sm:block text-stone-500 text-xs uppercase tracking-[0.3em] font-bold">Abu Hayyãn</span>
          </div>
          <button
            onClick={() => setModalMode('preorder')} // <-- Trigger Modal
            className={`text-[10px] sm:text-xs uppercase tracking-[0.2em] font-bold text-stone-900 border-2 border-stone-900 px-5 sm:px-6 py-2 rounded-full hover:bg-stone-900 hover:text-white transition-colors ${focusRing}`}
          >
            Pre-Order
          </button>
        </div>
      </motion.header>

      {/* FLOATING SPONSOR SEAL (Hidden on Mobile) */}
      <motion.button
        onClick={() => setModalMode('sponsor')} // <-- Trigger Modal
        animate={shouldReduceMotion ? {} : { y: [0, -8, 0], rotate: [0, -2, 2, -2, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className={`hidden lg:flex fixed bottom-8 right-12 z-50 bg-stone-900 text-white px-5 py-3 rounded-full shadow-[0_15px_30px_rgba(0,0,0,0.2)] hover:scale-105 transition-transform items-center gap-3 group ${focusRing}`}
        aria-label="Sponsor copies for others"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 animate-pulse text-amber-500">
          <path d="M12 3c-1.2 0-2.4.4-3.3 1.1-.9-.7-2.1-1.1-3.3-1.1-2.6 0-4.7 2.1-4.7 4.7 0 3.2 2.9 5.8 7.3 9.7l.7.6.7-.6c4.4-3.9 7.3-6.5 7.3-9.7 0-2.6-2.1-4.7-4.7-4.7z" />
        </svg>
        <span className="text-xs font-black uppercase tracking-widest whitespace-nowrap">
          Sponsor Copies
        </span>
      </motion.button>

      {/* MOBILE STICKY CTA BAR */}
      <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-white/95 backdrop-blur-lg border-t border-stone-200 px-5 py-4 flex items-center justify-between gap-4 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <p className="text-stone-900 font-black text-xl leading-none">₦2,500</p>
            <span className="text-[8px] font-bold uppercase tracking-wider text-white bg-amber-600 px-1.5 py-0.5 rounded-sm">Save ₦500</span>
          </div>
          <p className="text-stone-500 text-[10px] uppercase tracking-wider mt-1.5 font-bold">Official Pre-Order</p>
        </div>
        <button
          onClick={() => setModalMode('preorder')} // <-- Trigger Modal
          className={`flex-1 max-w-[170px] rounded-full bg-stone-900 text-white font-bold py-3.5 px-4 uppercase tracking-[0.1em] text-xs shadow-lg shadow-stone-900/20 ${focusRing}`}
        >
          Secure Copy
        </button>
      </div>

      {/* 1. CINEMATIC HERO SECTION (WHITE) */}
      <section className="relative bg-white flex flex-col items-center justify-start pt-24 pb-12 lg:pb-16">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] bg-amber-500/5 rounded-[100%] blur-[120px] pointer-events-none" />

        <div className="absolute top-[12%] lg:top-[16%] w-full text-center z-0 pointer-events-none select-none overflow-hidden">
          <h1 className="text-[14vw] font-black leading-none text-stone-100">
            ABU HAYYAN
          </h1>
        </div>

        <motion.div initial="hidden" animate="visible" variants={revealUp} className="z-10 mt-6 lg:mt-10 flex flex-col items-center gap-4 text-center px-4">
          <h2 className="flex flex-col items-center text-amber-600 drop-shadow-sm font-bold" dir="rtl" style={{ fontFamily: "'Amiri', 'Uthmani', 'Traditional Arabic', serif", lineHeight: '1.2' }}>
            <span className="text-6xl sm:text-7xl lg:text-8xl">الجمان</span>
            <span className="text-3xl sm:text-5xl lg:text-6xl mt-2 sm:mt-4 text-amber-600/90">من بدائع أبي حيان</span>
          </h2>
          <div className="flex flex-col items-center mt-4">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-serif text-stone-900 uppercase tracking-[0.15em] leading-none font-black">Pearls</h1>
            <p className="text-stone-500 text-[10px] sm:text-xs lg:text-sm uppercase tracking-[0.3em] font-bold mt-4 text-center max-w-[80vw]">From the Masterpieces of Abu Hayyan</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative z-10 w-full max-w-5xl h-[45vh] sm:h-[55vh] lg:h-[60vh] mt-4 lg:mt-6 cursor-grab active:cursor-grabbing flex flex-col items-center justify-center"
        >
          <Book3DModel onLoaded={() => setModelLoaded(true)} />
          {modelLoaded && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="absolute bottom-0 flex items-center gap-2 text-stone-400 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 animate-pulse">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
              </svg>
              <span className="text-[9px] uppercase tracking-widest font-bold">Drag to rotate</span>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Purchase Card */}
      <div className="relative bg-white pb-16 lg:pb-24 px-6 z-20">
        <motion.div
          id="preorder"
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }}
          className="w-full max-w-4xl mx-auto scroll-mt-24"
        >
          <div className="bg-white border border-stone-200 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] rounded-3xl overflow-hidden p-6 sm:p-8 lg:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 text-center md:text-left w-full">
              <p className="text-[10px] text-stone-500 uppercase tracking-[0.2em] mb-3 font-bold">Official Pre-Order</p>
              <div className="flex items-center justify-center md:justify-start gap-4">
                <span className="text-4xl lg:text-5xl font-black text-stone-900 leading-none">₦2,500</span>
                <div className="flex flex-col items-start gap-1.5">
                  <span className="relative inline-block text-sm lg:text-base text-stone-400 font-bold leading-none">
                    <span className="absolute top-1/2 left-[-10%] w-[120%] h-[2px] bg-red-500 -rotate-12" />
                    ₦3,000
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white bg-amber-600 px-2 py-0.5 rounded-sm">Save ₦500</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block w-px h-28 bg-stone-200" />
            
            {/* Countdown Block */}
            <div className="flex-1 text-center w-full">
              <p className="text-[10px] text-stone-500 uppercase tracking-[0.2em] mb-4 font-bold">Pre-Order Closes In</p>
              {isMounted ? (
                <div className="flex items-center justify-center gap-3 lg:gap-5 text-stone-900 font-mono text-2xl lg:text-3xl font-bold">
                  <div className="flex flex-col items-center"><span className="font-light">{timeLeft.days}</span><span className="text-[9px] text-stone-400 mt-1 font-sans">DAYS</span></div>
                  <span className="text-stone-300 pb-3">:</span>
                  <div className="flex flex-col items-center"><span className="font-light">{timeLeft.hours}</span><span className="text-[9px] text-stone-400 mt-1 font-sans">HRS</span></div>
                  <span className="text-stone-300 pb-3">:</span>
                  <div className="flex flex-col items-center"><span className="font-light">{timeLeft.minutes}</span><span className="text-[9px] text-stone-400 mt-1 font-sans">MIN</span></div>
                  <span className="text-stone-300 pb-3">:</span>
                  <div className="flex flex-col items-center"><span className="font-light">{timeLeft.seconds}</span><span className="text-[9px] text-stone-400 mt-1 font-sans">SEC</span></div>
                </div>
              ) : (
                <div className="h-10 w-48 bg-stone-100 animate-pulse mx-auto rounded-full" />
              )}
            </div>
            
            {/* CTA Block with Secondary Button */}
            <div className="flex-1 w-full md:w-auto flex flex-col gap-3">
              <button 
                onClick={() => setModalMode('preorder')} // <-- Trigger Modal
                className={`w-full rounded-full bg-stone-900 text-white font-bold py-4 px-8 uppercase tracking-[0.15em] text-sm transition-all duration-300 hover:bg-amber-600 hover:shadow-[0_10px_25px_rgba(217,119,6,0.3)] active:scale-[0.98] ${focusRing}`}
              >
                Get your copy
              </button>
              
              <div className="flex items-center justify-center gap-3 py-1.5 opacity-70">
                <div className="w-10 h-px bg-stone-300"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-stone-500">OR</span>
                <div className="w-10 h-px bg-stone-300"></div>
              </div>

              <button 
                onClick={() => setModalMode('sponsor')} // <-- Trigger Modal
                className={`w-full rounded-full bg-white border-2 border-stone-200 text-stone-700 font-bold py-3 px-6 uppercase tracking-[0.1em] text-[10px] sm:text-xs transition-all duration-300 hover:bg-stone-50 hover:border-amber-300 hover:text-stone-900 flex items-center justify-center gap-2 shadow-sm ${focusRing}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-amber-500">
                  <path d="M12 3c-1.2 0-2.4.4-3.3 1.1-.9-.7-2.1-1.1-3.3-1.1-2.6 0-4.7 2.1-4.7 4.7 0 3.2 2.9 5.8 7.3 9.7l.7.6.7-.6c4.4-3.9 7.3-6.5 7.3-9.7 0-2.6-2.1-4.7-4.7-4.7z" />
                </svg>
                Buy for others as Sadaqah
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 2. REFINED HIGHLIGHTS STRIP */}
      <section className="bg-stone-50 py-16 lg:py-20 border-t border-b border-stone-200">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={staggerContainer}
          className="px-6 lg:px-24 max-w-7xl mx-auto"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
            
            <motion.div variants={revealUp} className="group bg-white p-8 rounded-3xl border-2 border-amber-200 shadow-xl shadow-amber-900/5 hover:shadow-2xl flex flex-col items-center text-center gap-3 transition-all duration-500 cursor-default">
              <span className="text-amber-600 text-4xl font-serif leading-none font-bold mb-2 group-hover:scale-110 transition-transform duration-500" dir="rtl" style={{ fontFamily: "'Amiri', 'Uthmani', serif" }}>العروض</span>
              <p className="text-stone-900 text-sm uppercase tracking-[0.15em] font-black">Classical Meter</p>
              <p className="text-stone-600 text-[11px] leading-relaxed font-medium">Composed strictly upon the traditional rules of Arabic Arud and Qawafi.</p>
            </motion.div>

            <motion.div variants={revealUp} className="group bg-white p-8 rounded-3xl border-2 border-amber-200 shadow-xl shadow-amber-900/5 hover:shadow-2xl flex flex-col items-center text-center gap-3 transition-all duration-500 cursor-default">
              <span className="text-amber-600 text-4xl font-serif leading-none font-bold mb-2 group-hover:scale-110 transition-transform duration-500" dir="rtl" style={{ fontFamily: "'Amiri', 'Uthmani', serif" }}>إجازة</span>
              <p className="text-stone-900 text-sm uppercase tracking-[0.15em] font-black">Vetted by Scholars</p>
              <p className="text-stone-600 text-[11px] leading-relaxed font-medium">Reviewed by people of knowledge for accuracy in language and pure Islamic meaning.</p>
            </motion.div>

            <motion.div variants={revealUp} className="group bg-white p-8 rounded-3xl border-2 border-amber-200 shadow-xl shadow-amber-900/5 hover:shadow-2xl flex flex-col items-center text-center gap-3 transition-all duration-500 cursor-default">
              <span className="text-amber-600 text-4xl font-serif leading-none font-bold mb-2 group-hover:scale-110 transition-transform duration-500" dir="rtl" style={{ fontFamily: "'Amiri', 'Uthmani', serif" }}>تراث</span>
              <p className="text-stone-900 text-sm uppercase tracking-[0.15em] font-black">Islamic Heritage</p>
              <p className="text-stone-600 text-[11px] leading-relaxed font-medium">A modern contribution to the rich, enduring legacy of classical Islamic literature.</p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* 3. THE LETTER FROM THE AUTHOR */}
      <section className="bg-white py-20 lg:py-32 px-6 relative">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={revealUp} 
          className="max-w-3xl mx-auto"
        >
          <div className="flex flex-col items-center text-center mb-16">
            <h3 className="text-[10px] font-black text-amber-600 uppercase tracking-[0.3em] mb-4">A Message from the Author</h3>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 leading-tight font-serif">
              Welcome to the World of <br className="hidden sm:block"/> <span className="text-amber-600 italic font-light">Classical Arabic Poetry</span>
            </h2>
          </div>

          <div className="space-y-6 text-stone-700 text-base sm:text-lg font-medium leading-relaxed font-serif">
            <p>
              <strong className="font-bold text-stone-900">Pearls from the Masterpieces of Abu Hayyan</strong> <span dir="rtl" className="text-xl mx-1 text-amber-600 font-bold" style={{ fontFamily: "'Amiri', 'Uthmani', serif" }}>(الجمان من بدائع أبي حيان)</span> is my debut collection of classical Arabic poetry.
            </p>
            <p>
              For a long time, my creative works were scattered across the digital space. This book was born out of a deep desire to gather those fleeting poetic thoughts into one beautifully preserved, tangible volume before they were lost to the vastness of the internet.
            </p>
            <p>
              Inside its pages, you will embark on a literary and spiritual journey. The collection features poems dedicated to profound Islamic wisdom, noble character and morals, and a deep, heartfelt devotion to the Prophet Muhammad (peace be upon him), alongside many other reflections on life and faith.
            </p>
            <p>
              Every single poem within this book is meticulously crafted using traditional Arabic meter and rhyme. My goal was not simply to write, but to bring out the true, unadulterated beauty and musicality of the classical Arabic language.
            </p>
            
            <div className="pl-6 border-l-4 border-amber-500 py-4 my-10 bg-amber-50 rounded-r-xl pr-6 shadow-sm">
              <p className="italic text-stone-900 font-bold">
                Alhamdulillah, this work was not published without rigorous review. The manuscript was thoroughly vetted by respected scholars who praised its rich vocabulary, the sweetness of its meanings, and its excellent eloquence.
              </p>
            </div>

            <p>
              By pre-ordering your copy today, you are doing more than just buying a book—you are directly supporting the revival and preservation of our beautiful Islamic and poetic heritage for generations to come.
            </p>
            
            <p>
              Finally, it would be my absolute honor to celebrate this milestone with you.
            </p>

            <div className="my-12 p-8 border-2 border-amber-200 rounded-3xl bg-white shadow-xl shadow-amber-900/5 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-amber-600">
                  <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="text-xl font-black text-stone-900 mb-3">Official Book Launch Ceremony</h4>
              <p className="text-base text-stone-600 max-w-md mx-auto font-sans">
                I personally invite you to join us in Ibadan, where we will gather to appreciate the beauty of knowledge, literature, and brotherhood.
              </p>
            </div>

            <p className="text-center font-black text-stone-900 mt-8 text-xl">
              Jazakumullahu Khayran for your continued support.
            </p>
            
            <div className="flex flex-col items-center mt-12 pt-10 border-t border-stone-200">
              <p className="text-amber-600 font-serif italic text-4xl mb-2 font-bold">Abu Hayyãn</p>
              <p className="text-[11px] uppercase tracking-widest text-stone-500 font-sans font-black">Yusuf Oyetunji</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 4. THE AUTHOR & CREDENTIALS */}
      <section className="bg-stone-50 py-20 lg:py-28 px-6 relative border-t border-stone-200">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={revealUp} 
          className="max-w-4xl mx-auto flex flex-col items-center text-center"
        >
          <h3 className="text-xs font-black text-amber-600 uppercase tracking-[0.3em] mb-8">About the Author</h3>
          
          <div className="space-y-5 text-stone-700 text-sm sm:text-base font-medium leading-relaxed font-serif max-w-2xl">
            <p>A dedicated writer, translator, and student of classical Arabic poetry. Graduate of the Institute of Islamic Sciences and Studies in Amuloko, Ibadan, Nigeria.</p>
            <p>Holding both a Bachelor of Arts and a Master of Arts in English from the University of Ibadan, currently furthering studies at Kuliyyah Imam Malik in Jegede, Ibadan.</p>
            <p>Passionate about sharing beneficial knowledge and preserving Islamic literary heritage, this debut collection reflects an extensive literary background and a deep, enduring love for classical Arabic poetry.</p>
          </div>

          <div className="flex flex-wrap gap-3 mt-12 justify-center max-w-3xl">
            <span className="text-[10px] uppercase tracking-wider text-stone-900 border-2 border-stone-200 px-4 py-2 rounded-full bg-white font-bold shadow-sm">Institute of Islamic Sciences &amp; Studies, Amuloko</span>
            <span className="text-[10px] uppercase tracking-wider text-stone-900 border-2 border-stone-200 px-4 py-2 rounded-full bg-white font-bold shadow-sm">B.A. English — University of Ibadan</span>
            <span className="text-[10px] uppercase tracking-wider text-stone-900 border-2 border-stone-200 px-4 py-2 rounded-full bg-white font-bold shadow-sm">M.A. English — University of Ibadan</span>
            <span className="text-[10px] uppercase tracking-wider text-stone-900 border-2 border-stone-200 px-4 py-2 rounded-full bg-white font-bold shadow-sm">Kuliyyah Imam Malik, Jegede (Ongoing)</span>
          </div>
        </motion.div>
      </section>

      {/* 5. FINAL CTA */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={revealUp}
        className="relative bg-white px-6 py-20 lg:py-28 border-t border-stone-200 text-center overflow-hidden"
      >
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60vw] h-[30vh] bg-amber-500/10 rounded-[100%] blur-[100px] pointer-events-none" />
        <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center gap-6">
          <p className="text-amber-600 uppercase tracking-[0.4em] text-[10px] lg:text-xs font-black">A Limited Allocation</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 leading-tight">Secure your copy of Abu Hayyãn's debut collection.</h2>
          <button
            onClick={() => setModalMode('preorder')} // <-- Trigger Modal
            className={`mt-6 rounded-full bg-stone-900 text-white font-bold py-5 px-12 uppercase tracking-[0.2em] text-sm hover:bg-amber-600 hover:shadow-[0_15px_30px_rgba(217,119,6,0.3)] transition-all duration-300 ${focusRing}`}
          >
            Get your copy — ₦2,500
          </button>
        </div>
      </motion.section>

      {/* FOOTER */}
      <footer className="relative bg-white pt-10 pb-28 lg:pb-12 px-6 flex justify-center z-10 border-t border-stone-100">
        <a 
          href="mailto:dev@quadroxtech.cloud" 
          className="text-stone-400 hover:text-stone-900 transition-colors text-[10px] sm:text-xs tracking-[0.2em] uppercase font-bold text-center"
        >
          &copy; QUADROX TECHNOLOGIES LIMITED 2026
        </a>
      </footer>

    </main>
  );
}
