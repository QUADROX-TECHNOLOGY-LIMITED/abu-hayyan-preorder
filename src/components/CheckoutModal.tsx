'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { nigeriaStates } from '@/lib/nigeriaData';

type ModalMode = 'preorder' | 'sponsor' | null;

// Custom Dropdown for Delivery Method (Matches SearchableSelect)
function DropdownSelect({ 
  options, 
  value, 
  onChange 
}: { 
  options: { label: string, value: string }[]; 
  value: string; 
  onChange: (val: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border-2 border-stone-200 rounded-xl px-4 py-3.5 text-stone-900 font-medium flex justify-between items-center cursor-pointer hover:border-amber-500 transition-colors"
      >
        <span className={value ? "text-stone-900" : "text-stone-400"}>{selectedOption?.label || "Select option..."}</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-white border-2 border-stone-200 rounded-xl shadow-2xl overflow-hidden"
          >
            <ul className="max-h-48 overflow-y-auto">
              {options.map(opt => (
                <li 
                  key={opt.value} 
                  onClick={() => { onChange(opt.value); setIsOpen(false); }}
                  className="px-4 py-3 hover:bg-amber-50 cursor-pointer text-stone-700 text-sm font-medium border-b border-stone-50 last:border-0"
                >
                  {opt.label}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Custom Searchable Dropdown for States and Cities
function SearchableSelect({ 
  options, 
  placeholder, 
  value, 
  onChange 
}: { 
  options: string[]; 
  placeholder: string; 
  value: string; 
  onChange: (val: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt => opt.toLowerCase().includes(search.toLowerCase()));

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border-2 border-stone-200 rounded-xl px-4 py-3.5 text-stone-900 font-medium flex justify-between items-center cursor-pointer hover:border-amber-500 transition-colors"
      >
        <span className={value ? "text-stone-900" : "text-stone-400"}>{value || placeholder}</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-white border-2 border-stone-200 rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="p-2 border-b border-stone-100">
              <input 
                type="text" 
                autoFocus
                placeholder="Search..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <ul className="max-h-48 overflow-y-auto">
              {filteredOptions.length > 0 ? filteredOptions.map(opt => (
                <li 
                  key={opt} 
                  onClick={() => { onChange(opt); setSearch(''); setIsOpen(false); }}
                  className="px-4 py-3 hover:bg-amber-50 cursor-pointer text-stone-700 text-sm font-medium border-b border-stone-50 last:border-0"
                >
                  {opt}
                </li>
              )) : (
                <li className="px-4 py-3 text-stone-400 text-sm italic">No results found</li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CheckoutModal({ mode, onClose }: { mode: ModalMode; onClose: () => void; }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '', email: '', whatsapp: '', quantity: 1,
    deliveryMode: 'launch_pickup', 
    state: '', city: '', address: '', nearestPark: ''
  });

  const basePrice = 2500;
  // We no longer add delivery fees to the checkout amount, as it is strictly on them.
  const totalAmount = formData.quantity * basePrice; 

  const availableStates = Object.keys(nigeriaStates);
  const availableCities = formData.state ? nigeriaStates[formData.state] || [] : [];

  const handleProcessCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, mode, totalAmount })
      });
      const data = await res.json();
      
      if (data.status === 'success') {
        setPaymentData(data.accountDetails);
        setStep(3);
      } else {
        alert(data.message || 'An error occurred. Please try again.');
      }
    } catch (error) {
      alert('Network error. Please ensure you have a stable connection.');
    } finally {
      setLoading(false);
    }
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

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 bg-white">
              
              {/* SPONSORSHIP FLOW */}
              {mode === 'sponsor' && step === 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div>
                    <label className="block text-xs font-black text-stone-900 uppercase tracking-widest mb-2">Quantity (₦2,500 each)</label>
                    <input type="number" min="1" value={formData.quantity} className={inputStyle} onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 1})} />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-stone-900 uppercase tracking-widest mb-2">Email Address <span className="text-red-500">*</span></label>
                    <input type="email" className={inputStyle} placeholder="Required for your receipt" onChange={(e) => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <label className="block text-xs font-black text-stone-900 uppercase tracking-widest">Sponsor Name</label>
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Optional</span>
                    </div>
                    <input type="text" className={inputStyle} placeholder="Enter name or leave blank" onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  </div>
                  
                  <div className="pt-4 flex flex-col gap-3">
                    <button onClick={handleProcessCheckout} disabled={loading || !formData.email} className="w-full bg-stone-900 text-white font-bold py-4 rounded-full uppercase tracking-[0.15em] text-sm hover:bg-amber-500 hover:text-stone-900 transition-colors disabled:opacity-50 flex justify-center items-center">
                      {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : `Pay ₦${totalAmount.toLocaleString()}`}
                    </button>
                    {!formData.name && (
                      <button onClick={() => { setFormData({...formData, name: 'Anonymous'}); handleProcessCheckout(); }} disabled={loading || !formData.email} className="w-full bg-white border-2 border-stone-200 text-stone-500 font-bold py-3.5 rounded-full uppercase tracking-[0.1em] text-[10px] hover:border-stone-900 hover:text-stone-900 transition-colors disabled:opacity-50">
                        Skip Name & Pay Anonymously
                      </button>
                    )}
                  </div>
                </motion.div>
              )}

              {/* PRE-ORDER FLOW - STEP 1 */}
              {mode === 'preorder' && step === 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div>
                    <label className="block text-xs font-black text-stone-900 uppercase tracking-widest mb-2">Full Name</label>
                    <input type="text" className={inputStyle} placeholder="e.g. Abdullah Ibn Masud" onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-black text-stone-900 uppercase tracking-widest mb-2">Email Address</label>
                      <input type="email" className={inputStyle} placeholder="For your receipt" onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-stone-900 uppercase tracking-widest mb-2">WhatsApp Number</label>
                      <input type="tel" className={inputStyle} placeholder="0903..." onChange={(e) => setFormData({...formData, whatsapp: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-stone-900 uppercase tracking-widest mb-2">Quantity (₦2,500 each)</label>
                    <input type="number" min="1" value={formData.quantity} className={inputStyle} onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 1})} />
                  </div>
                  <button onClick={() => setStep(2)} className="w-full bg-stone-900 text-white font-bold py-4 rounded-full uppercase tracking-[0.15em] text-sm hover:bg-amber-500 hover:text-stone-900 transition-colors mt-4 shadow-lg shadow-stone-900/20">
                    Continue to Delivery
                  </button>
                </motion.div>
              )}

              {/* PRE-ORDER FLOW - STEP 2 */}
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
                    <button onClick={handleProcessCheckout} disabled={loading} className="flex-1 bg-stone-900 text-white font-bold py-4 rounded-full uppercase tracking-widest text-sm hover:bg-amber-500 hover:text-stone-900 transition-colors disabled:opacity-50 flex justify-center items-center shadow-lg shadow-stone-900/20">
                      {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : `Pay ₦${totalAmount.toLocaleString()}`}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* PAYMENT TRANSFER SCREEN */}
              {step === 3 && paymentData && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center text-center space-y-6 pb-4">
                  <div className="w-20 h-20 bg-stone-900 rounded-full flex items-center justify-center text-amber-500 shadow-xl shadow-stone-900/20 mb-2 border-4 border-white outline outline-2 outline-stone-100">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-10 h-10">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  
                  <div>
                    <h4 className="text-2xl font-black text-stone-900 uppercase tracking-wider mb-2">Make Transfer</h4>
                    <p className="text-sm text-stone-500 font-medium">Please transfer exactly <span className="font-black text-amber-600 text-lg mx-1">₦{totalAmount.toLocaleString()}</span> to secure your order.</p>
                  </div>
                  
                  <div className="w-full bg-stone-50 border-2 border-stone-200 rounded-2xl p-6 space-y-5 shadow-sm">
                    <div className="flex justify-between items-center border-b border-stone-200 pb-4">
                      <span className="text-xs text-stone-500 uppercase tracking-[0.15em] font-black">Bank Name</span>
                      <span className="font-black text-stone-900 text-sm uppercase">{paymentData.bank_name}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-stone-200 pb-4">
                      <span className="text-xs text-stone-500 uppercase tracking-[0.15em] font-black">Account Number</span>
                      <span className="font-black text-3xl text-amber-600 tracking-widest">{paymentData.account_number}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-stone-500 uppercase tracking-[0.15em] font-black">Total Amount</span>
                      <span className="font-black text-stone-900 text-xl">₦{totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="w-full flex justify-between items-center bg-amber-50 border border-amber-200 p-4 rounded-xl">
                    <div className="flex items-center gap-3 text-stone-900 text-xs font-black uppercase tracking-widest">
                      <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                      Awaiting Confirmation...
                    </div>
                    <span className="text-xs font-bold text-stone-500">Expires in {paymentData.expiry_date}</span>
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
