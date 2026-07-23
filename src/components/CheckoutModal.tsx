'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { nigeriaStates } from '@/lib/nigeriaData';

type ModalMode = 'preorder' | 'sponsor' | null;

// --- Custom Dropdown Components ---
function DropdownSelect({ options, value, onChange }: { options: { label: string, value: string }[]; value: string; onChange: (val: string) => void; }) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) { if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) setIsOpen(false); }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const selectedOption = options.find(opt => opt.value === value);
  return (
    <div ref={wrapperRef} className="relative w-full">
      <div onClick={() => setIsOpen(!isOpen)} className="w-full bg-white border-2 border-stone-200 rounded-xl px-4 py-3.5 text-stone-900 font-medium flex justify-between items-center cursor-pointer hover:border-amber-500 transition-colors">
        <span className={value ? "text-stone-900" : "text-stone-400"}>{selectedOption?.label || "Select option..."}</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute z-50 w-full mt-2 bg-white border-2 border-stone-200 rounded-xl shadow-2xl overflow-hidden">
            <ul className="max-h-48 overflow-y-auto">
              {options.map(opt => (
                <li key={opt.value} onClick={() => { onChange(opt.value); setIsOpen(false); }} className="px-4 py-3 hover:bg-amber-50 cursor-pointer text-stone-700 text-sm font-medium border-b border-stone-50 last:border-0">{opt.label}</li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SearchableSelect({ options, placeholder, value, onChange }: { options: string[]; placeholder: string; value: string; onChange: (val: string) => void; }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) { if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) setIsOpen(false); }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const filteredOptions = options.filter(opt => opt.toLowerCase().includes(search.toLowerCase()));
  return (
    <div ref={wrapperRef} className="relative w-full">
      <div onClick={() => setIsOpen(!isOpen)} className="w-full bg-white border-2 border-stone-200 rounded-xl px-4 py-3.5 text-stone-900 font-medium flex justify-between items-center cursor-pointer hover:border-amber-500 transition-colors">
        <span className={value ? "text-stone-900" : "text-stone-400"}>{value || placeholder}</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute z-50 w-full mt-2 bg-white border-2 border-stone-200 rounded-xl shadow-2xl overflow-hidden">
            <div className="p-2 border-b border-stone-100"><input type="text" autoFocus placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500" /></div>
            <ul className="max-h-48 overflow-y-auto">
              {filteredOptions.length > 0 ? filteredOptions.map(opt => (
                <li key={opt} onClick={() => { onChange(opt); setSearch(''); setIsOpen(false); }} className="px-4 py-3 hover:bg-amber-50 cursor-pointer text-stone-700 text-sm font-medium border-b border-stone-50 last:border-0">{opt}</li>
              )) : <li className="px-4 py-3 text-stone-400 text-sm italic">No results found</li>}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
// --- End Custom Dropdowns ---

export default function CheckoutModal({ mode, onClose }: { mode: ModalMode; onClose: () => void; }) {
  const [step, setStep] = useState<1 | 2 | 'generating' | 3 | 'verifying' | 4>(1);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  
  const [payTime, setPayTime] = useState({ m: 60, s: 0 });
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [formData, setFormData] = useState({
    name: '', email: '', whatsapp: '', quantity: 1,
    deliveryMode: 'launch_pickup', state: '', city: '', address: '', nearestPark: ''
  });

  const basePrice = 2500;
  const totalAmount = formData.quantity * basePrice; 

  const availableStates = Object.keys(nigeriaStates);
  const availableCities = formData.state ? nigeriaStates[formData.state] || [] : [];

  // --- STRICT VALIDATION LOGIC ---
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const isValidPhone = /^\d{11}$/.test(formData.whatsapp);
  
  const isPreorderStep1Valid = formData.name.trim() !== '' && isValidEmail && isValidPhone && formData.quantity > 0;
  const isSponsorStep1Valid = isValidEmail && formData.quantity > 0;

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 11);
    setFormData({...formData, whatsapp: val});
  };

  // Cleanup polling if component unmounts unexpectedly
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  // --- API GENERATION (FLUTTERWAVE) ---
  const handleProcessCheckout = async () => {
    setStep('generating');
    try {
      // Set absolute 1-hour expiry in localStorage
      const expiryTime = Date.now() + (60 * 60 * 1000);
      localStorage.setItem('quadrox_pay_expiry', expiryTime.toString());

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, mode, totalAmount })
      });
      const data = await res.json();
      
      if (data.status === 'success') {
        setPaymentData(data.accountDetails);
        setTimeout(() => {
          setStep(3);
        }, 1500); // Slight delay so the user enjoys the animation
      } else {
        alert(data.message || 'An error occurred. Please try again.');
        setStep(mode === 'preorder' ? 2 : 1);
      }
    } catch (error) {
      alert('Network error. Please try again.');
      setStep(mode === 'preorder' ? 2 : 1);
    }
  };

  // --- STRICT BACKGROUND COUNTDOWN LOGIC ---
  useEffect(() => {
    if (step === 3) {
      const interval = setInterval(() => {
        const storedExpiry = localStorage.getItem('quadrox_pay_expiry');
        if (storedExpiry) {
          const distance = parseInt(storedExpiry) - Date.now(); 
          
          if (distance <= 0) {
            // TIME IS UP: Wipe session and kick them out immediately
            clearInterval(interval);
            setPayTime({ m: 0, s: 0 });
            localStorage.removeItem('quadrox_pay_expiry');
            alert('The 1-hour payment window has expired. Please initiate a new order.');
            onClose(); 
          } else {
            setPayTime({
              m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
              s: Math.floor((distance % (1000 * 60)) / 1000)
            });
          }
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step, onClose]);

  const handleCopy = () => {
    if (paymentData?.account_number) {
      navigator.clipboard.writeText(paymentData.account_number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // --- REAL VERIFICATION POLLING ---
  const handleVerification = () => {
    setStep('verifying');
    
    pollIntervalRef.current = setInterval(async () => {
      try {
        const res = await fetch('/api/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            accountNumber: paymentData.account_number, 
            mode 
          })
        });
        
        const data = await res.json();
        
        if (data.isPaid) {
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          setStep(4); // Success Screen
          localStorage.removeItem('quadrox_pay_expiry'); 
        }
      } catch (error) {
        console.error("Polling check failed", error);
      }
    }, 5000); // Check every 5 seconds
  };

  const inputStyle = "w-full bg-white border-2 border-stone-200 rounded-xl px-4 py-3.5 text-stone-900 font-medium placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors";

  return (
    <AnimatePresence>
      {mode && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-stone-900/60 backdrop-blur-md p-0 sm:p-6">
          <motion.div 
            initial={{ opacity: 0, y: "100%" }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-full max-w-xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh]"
          >
            {/* Header */}
            {(step === 1 || step === 2 || step === 3) && (
              <div className="flex justify-between items-center p-6 border-b border-stone-100 bg-white">
                <h3 className="font-black text-stone-900 text-lg uppercase tracking-[0.15em]">
                  {mode === 'preorder' ? 'Secure Your Copy' : 'Sponsor Copies'}
                </h3>
                <button onClick={onClose} className="p-2 bg-stone-100 rounded-full hover:bg-stone-200 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-stone-900">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 bg-white relative">
              
              {/* --- SPONSORSHIP FLOW STEP 1 --- */}
              {mode === 'sponsor' && step === 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div>
                    <label className="block text-xs font-black text-stone-900 uppercase tracking-widest mb-2">Quantity (₦2,500 each)</label>
                    <input type="number" min="1" value={formData.quantity} className={inputStyle} onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 1})} />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-stone-900 uppercase tracking-widest mb-2">Email Address <span className="text-red-500">*</span></label>
                    <input type="email" className={`${inputStyle} ${formData.email && !isValidEmail ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`} placeholder="Required for your receipt" onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    {formData.email && !isValidEmail && <p className="text-[10px] text-red-500 font-bold mt-1">Please enter a valid email.</p>}
                  </div>
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <label className="block text-xs font-black text-stone-900 uppercase tracking-widest">Sponsor Name</label>
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Optional</span>
                    </div>
                    <input type="text" className={inputStyle} placeholder="Enter name or leave blank" onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  </div>
                  
                  <div className="pt-4 flex flex-col gap-3">
                    <button onClick={handleProcessCheckout} disabled={!isSponsorStep1Valid} className="w-full bg-stone-900 text-white font-bold py-4 rounded-full uppercase tracking-[0.15em] text-sm hover:bg-amber-500 hover:text-stone-900 transition-colors disabled:opacity-40 disabled:hover:bg-stone-900 disabled:hover:text-white">
                      Pay ₦{totalAmount.toLocaleString()}
                    </button>
                    {!formData.name && (
                      <button onClick={() => { setFormData({...formData, name: 'Anonymous'}); handleProcessCheckout(); }} disabled={!isSponsorStep1Valid} className="w-full bg-white border-2 border-stone-200 text-stone-500 font-bold py-3.5 rounded-full uppercase tracking-[0.1em] text-[10px] hover:border-stone-900 hover:text-stone-900 transition-colors disabled:opacity-40">
                        Skip Name & Pay Anonymously
                      </button>
                    )}
                  </div>
                </motion.div>
              )}

              {/* --- PRE-ORDER FLOW STEP 1 --- */}
              {mode === 'preorder' && step === 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div>
                    <label className="block text-xs font-black text-stone-900 uppercase tracking-widest mb-2">Full Name</label>
                    <input type="text" className={inputStyle} placeholder="e.g. Abdullah Ibn Masud" onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-black text-stone-900 uppercase tracking-widest mb-2">Email Address</label>
                      <input type="email" className={`${inputStyle} ${formData.email && !isValidEmail ? 'border-red-300 focus:border-red-500' : ''}`} placeholder="For your receipt" onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-stone-900 uppercase tracking-widest mb-2">WhatsApp Number</label>
                      <input type="tel" value={formData.whatsapp} className={`${inputStyle} ${formData.whatsapp && !isValidPhone ? 'border-red-300 focus:border-red-500' : ''}`} placeholder="11 Digits Only" onChange={handlePhoneInput} />
                      {formData.whatsapp && !isValidPhone && <p className="text-[10px] text-red-500 font-bold mt-1">Must be exactly 11 digits.</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-stone-900 uppercase tracking-widest mb-2">Quantity (₦2,500 each)</label>
                    <input type="number" min="1" value={formData.quantity} className={inputStyle} onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 1})} />
                  </div>
                  <button onClick={() => setStep(2)} disabled={!isPreorderStep1Valid} className="w-full bg-stone-900 text-white font-bold py-4 rounded-full uppercase tracking-[0.15em] text-sm hover:bg-amber-500 hover:text-stone-900 transition-colors mt-4 shadow-lg shadow-stone-900/20 disabled:opacity-40 disabled:hover:bg-stone-900 disabled:hover:text-white">
                    Continue to Delivery
                  </button>
                </motion.div>
              )}

              {/* --- PRE-ORDER FLOW STEP 2 (Delivery) --- */}
              {mode === 'preorder' && step === 2 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div>
                    <label className="block text-xs font-black text-stone-900 uppercase tracking-widest mb-2">Delivery Method</label>
                    <DropdownSelect 
                      options={[
                        { label: 'Pickup at Launch Ceremony', value: 'launch_pickup' },
                        { label: 'Home Delivery', value: 'home_delivery' }
                      ]} 
                      value={formData.deliveryMode} 
                      onChange={(val) => setFormData({...formData, deliveryMode: val})} 
                    />
                    {formData.deliveryMode === 'launch_pickup' ? (
                      <p className="text-[10px] text-amber-600 font-bold mt-2 bg-amber-50 p-2 rounded-md border border-amber-100 uppercase tracking-wider">
                        *If you don't show up for pickup, the delivery fee is on you ooo.
                      </p>
                    ) : (
                      <p className="text-[10px] text-amber-600 font-bold mt-2 bg-amber-50 p-2 rounded-md border border-amber-100 uppercase tracking-wider">
                        *Delivery fee is on you ooo.
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-black text-stone-900 uppercase tracking-widest mb-2">State</label>
                      <SearchableSelect options={availableStates} placeholder="Select State" value={formData.state} onChange={(val) => setFormData({...formData, state: val, city: ''})} />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-stone-900 uppercase tracking-widest mb-2">City / LGA</label>
                      <SearchableSelect options={availableCities} placeholder="Select City" value={formData.city} onChange={(val) => setFormData({...formData, city: val})} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-stone-900 uppercase tracking-widest mb-2">Full Address</label>
                    <input type="text" placeholder="House number and street" className={inputStyle} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-stone-900 uppercase tracking-widest mb-2">Nearest Landmark / Park</label>
                    <input type="text" placeholder="e.g. Challenge Garage" className={inputStyle} onChange={(e) => setFormData({...formData, nearestPark: e.target.value})} />
                  </div>
                  
                  <div className="flex gap-4 pt-4">
                    <button onClick={() => setStep(1)} className="px-6 py-4 bg-stone-100 text-stone-900 font-bold rounded-full text-sm uppercase tracking-widest hover:bg-stone-200">Back</button>
                    <button onClick={handleProcessCheckout} className="flex-1 bg-stone-900 text-white font-bold py-4 rounded-full uppercase tracking-widest text-sm hover:bg-amber-500 hover:text-stone-900 transition-colors shadow-lg shadow-stone-900/20">
                      Pay ₦{totalAmount.toLocaleString()}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* --- GENERATING ANIMATION --- */}
              {step === 'generating' && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-20 space-y-8">
                  <div className="flex gap-6 text-6xl">
                    <motion.div animate={{ y: [0, -30, 0] }} transition={{ repeat: Infinity, duration: 0.6, ease: "easeOut" }}>🪆</motion.div>
                    <motion.div animate={{ y: [0, -30, 0] }} transition={{ repeat: Infinity, duration: 0.6, ease: "easeOut", delay: 0.2 }}>✨</motion.div>
                    <motion.div animate={{ y: [0, -30, 0] }} transition={{ repeat: Infinity, duration: 0.6, ease: "easeOut", delay: 0.4 }}>📦</motion.div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-stone-900 font-black tracking-[0.2em] uppercase text-sm animate-pulse">Generating Secure Account...</p>
                    <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest">Please don't close this window</p>
                  </div>
                </motion.div>
              )}

              {/* --- PAYMENT TRANSFER SCREEN --- */}
              {step === 3 && paymentData && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center text-center pb-4">
                  <div className="w-16 h-16 bg-stone-900 rounded-full flex items-center justify-center text-amber-500 shadow-xl mb-4 border-4 border-white outline outline-2 outline-stone-100">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-xl font-black text-stone-900 uppercase tracking-wider mb-2">Make Transfer</h4>
                    <p className="text-xs text-stone-500 font-medium">Transfer exactly <span className="font-black text-amber-600 text-sm mx-1">₦{totalAmount.toLocaleString()}</span> to the account below.</p>
                  </div>
                  
                  <div className="w-full bg-stone-50 border-2 border-stone-200 rounded-2xl p-5 space-y-4 shadow-sm mb-6">
                    <div className="flex justify-between items-center border-b border-stone-200 pb-3">
                      <span className="text-[10px] text-stone-500 uppercase tracking-[0.15em] font-black">Account Name</span>
                      <span className="font-black text-stone-900 text-xs uppercase text-right">{paymentData.account_name}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-stone-200 pb-3">
                      <span className="text-[10px] text-stone-500 uppercase tracking-[0.15em] font-black">Bank Name</span>
                      <span className="font-black text-stone-900 text-xs uppercase">{paymentData.bank_name}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-stone-200 pb-3">
                      <span className="text-[10px] text-stone-500 uppercase tracking-[0.15em] font-black">Account No.</span>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-2xl text-amber-600 tracking-widest">{paymentData.account_number}</span>
                        <button onClick={handleCopy} className="p-1.5 bg-stone-200 hover:bg-amber-100 rounded-lg transition-colors group">
                          {copied ? (
                            <span className="text-green-600 text-xs font-bold block px-1">✓</span>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-stone-600 group-hover:text-amber-600"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" /></svg>
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-stone-500 uppercase tracking-[0.15em] font-black">Amount</span>
                      <span className="font-black text-stone-900 text-lg">₦{totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="w-full flex justify-between items-center bg-red-50 border border-red-100 px-4 py-3 rounded-xl mb-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-red-800">Time Remaining</span>
                    <span className="text-sm font-black text-red-600 font-mono tracking-widest">{payTime.m}M : {payTime.s < 10 ? `0${payTime.s}` : payTime.s}S</span>
                  </div>

                  <button onClick={handleVerification} className="w-full bg-stone-900 text-white font-bold py-4 rounded-full uppercase tracking-[0.15em] text-sm hover:bg-amber-500 hover:text-stone-900 transition-colors shadow-lg">
                    I Have Paid
                  </button>

                  <div className="mt-8">
                     <a href="mailto:dev@quadroxtech.cloud" className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase font-black text-stone-400 hover:text-amber-500 transition-colors">
                       &copy; QUADROX TECHNOLOGIES LIMITED 2026
                     </a>
                  </div>
                </motion.div>
              )}

              {/* --- VERIFYING ANIMATION --- */}
              {step === 'verifying' && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-24 space-y-6">
                  <div className="w-16 h-16 border-4 border-stone-100 border-t-amber-500 rounded-full animate-spin" />
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-stone-900 font-black tracking-[0.2em] uppercase text-sm animate-pulse">Verifying Payment...</p>
                    <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest text-center">Confirming with the bank network.<br/>This may take a moment.</p>
                  </div>
                </motion.div>
              )}

              {/* --- SUCCESS SCREENS --- */}
              {step === 4 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center text-center py-10 space-y-6">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-12 h-12"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  </div>

                  {mode === 'preorder' ? (
                    <>
                      <h4 className="text-2xl font-black text-stone-900 uppercase tracking-wider">Payment Confirmed!</h4>
                      <p className="text-sm text-stone-600 font-medium max-w-sm leading-relaxed">Jazakumullahu Khayran for your pre-order. We have successfully received your payment.</p>
                      
                      <div className="w-full bg-stone-50 border-2 border-stone-200 rounded-2xl p-6 mt-4">
                        <p className="text-[10px] text-stone-500 uppercase tracking-[0.2em] font-black mb-2">Your Unique Order ID</p>
                        <p className="text-2xl font-black text-amber-600 tracking-widest">{paymentData?.order_id}</p>
                      </div>

                      <p className="text-xs text-stone-500 font-bold bg-amber-50 p-4 rounded-xl border border-amber-100 mt-4 leading-relaxed">
                        A detailed receipt containing this Order ID and your pickup/delivery instructions has been sent to <span className="text-stone-900">{formData.email}</span>.
                      </p>
                    </>
                  ) : (
                    <>
                      <h4 className="text-2xl font-black text-stone-900 uppercase tracking-wider">Jazakumullahu Khayran!</h4>
                      <p className="text-base text-stone-600 font-medium max-w-sm leading-relaxed">Your sponsorship has been successfully received. May Allah reward you abundantly for spreading beneficial knowledge.</p>
                      
                      <p className="text-xs text-stone-500 font-bold mt-4 leading-relaxed">
                        An appreciation email and receipt have been sent to <span className="text-stone-900">{formData.email}</span>.
                      </p>
                    </>
                  )}

                  <button onClick={onClose} className="w-full mt-8 bg-stone-900 text-white font-bold py-4 rounded-full uppercase tracking-[0.15em] text-sm hover:bg-stone-800 transition-colors">
                    Close Page
                  </button>

                  <div className="mt-6">
                     <a href="mailto:dev@quadroxtech.cloud" className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase font-black text-stone-400 hover:text-amber-500 transition-colors">
                       &copy; QUADROX TECHNOLOGIES LIMITED 2026
                     </a>
                  </div>
                </motion.div>
              )}

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
