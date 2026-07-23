'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ModalMode = 'preorder' | 'sponsor' | null;

export default function CheckoutModal({ 
  mode, 
  onClose 
}: { 
  mode: ModalMode; 
  onClose: () => void; 
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '', email: '', whatsapp: '', quantity: 1,
    deliveryMode: 'launch_pickup', // or 'home_delivery'
    state: '', city: '', address: '', nearestPark: ''
  });

  const basePrice = 2500;
  const deliveryFee = formData.deliveryMode === 'home_delivery' ? 3000 : 0; // Configurable
  const totalAmount = (formData.quantity * basePrice) + deliveryFee;

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
        setStep(3); // Move to Payment Transfer Screen
      } else {
        alert(data.message || 'An error occurred. Please try again.');
      }
    } catch (error) {
      alert('Network error. Please ensure you have a stable connection.');
    } finally {
      setLoading(false);
    }
  };

  const focusRing = "focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent";

  return (
    <AnimatePresence>
      {mode && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-stone-900/60 backdrop-blur-sm p-0 sm:p-6">
          <motion.div 
            initial={{ opacity: 0, y: "100%" }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-full max-w-xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-stone-100 bg-stone-50">
              <h3 className="font-bold text-stone-900 text-lg uppercase tracking-widest">
                {mode === 'preorder' ? 'Secure Your Copy' : 'Sponsor Copies'}
              </h3>
              <button onClick={onClose} className="p-2 bg-stone-200 rounded-full hover:bg-stone-300 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-stone-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* STEP 1: Basic Details */}
              {step === 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Full Name</label>
                    <input type="text" className={`w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 ${focusRing}`} placeholder={mode === 'sponsor' ? 'Anonymous (Optional)' : 'e.g. Abdullah Ibn Masud'} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Email Address</label>
                      <input type="email" className={`w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 ${focusRing}`} placeholder="For your receipt" onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">WhatsApp Number</label>
                      <input type="tel" className={`w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 ${focusRing}`} placeholder="0903..." onChange={(e) => setFormData({...formData, whatsapp: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Quantity (₦2,500 each)</label>
                    <input type="number" min="1" value={formData.quantity} className={`w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 ${focusRing}`} onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 1})} />
                  </div>
                  <button onClick={() => setStep(mode === 'preorder' ? 2 : 3)} className="w-full bg-stone-900 text-white font-bold py-4 rounded-xl uppercase tracking-widest text-sm hover:bg-amber-600 transition-colors mt-4">
                    Continue to {mode === 'preorder' ? 'Delivery' : 'Payment'}
                  </button>
                </motion.div>
              )}

              {/* STEP 2: Delivery Details (Pre-Order Only) */}
              {step === 2 && mode === 'preorder' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Delivery Method</label>
                    <select className={`w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 ${focusRing}`} onChange={(e) => setFormData({...formData, deliveryMode: e.target.value})}>
                      <option value="launch_pickup">Pickup at Launch Ceremony (Free)</option>
                      <option value="home_delivery">Home Delivery (Fees Apply)</option>
                    </select>
                    {formData.deliveryMode === 'launch_pickup' && (
                      <p className="text-[10px] text-amber-600 font-bold mt-2">*If you do not attend, standard delivery fees will apply later.</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="State (e.g. Oyo)" className={`w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 ${focusRing}`} onChange={(e) => setFormData({...formData, state: e.target.value})} />
                    <input type="text" placeholder="City (e.g. Ibadan)" className={`w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 ${focusRing}`} onChange={(e) => setFormData({...formData, city: e.target.value})} />
                  </div>
                  <input type="text" placeholder="Full Delivery Address" className={`w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 ${focusRing}`} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                  <input type="text" placeholder="Nearest Popular Park / Landmark" className={`w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 ${focusRing}`} onChange={(e) => setFormData({...formData, nearestPark: e.target.value})} />
                  
                  <div className="flex gap-4 mt-6">
                    <button onClick={() => setStep(1)} className="px-6 py-4 bg-stone-200 text-stone-700 font-bold rounded-xl text-sm uppercase tracking-widest hover:bg-stone-300">Back</button>
                    <button onClick={handleProcessCheckout} disabled={loading} className="flex-1 bg-stone-900 text-white font-bold py-4 rounded-xl uppercase tracking-widest text-sm hover:bg-amber-600 transition-colors disabled:opacity-50 flex justify-center items-center">
                      {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : `Pay ₦${totalAmount.toLocaleString()}`}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Payment Transfer Screen (Generated Virtual Account) */}
              {step === 3 && paymentData && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center text-center space-y-6">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-black text-stone-900">Transfer to Secure Order</h4>
                  <p className="text-sm text-stone-500">Please transfer exactly <span className="font-bold text-stone-900">₦{totalAmount.toLocaleString()}</span> to the account below. It will expire in 30 minutes.</p>
                  
                  <div className="w-full bg-stone-50 border-2 border-stone-200 rounded-2xl p-6 space-y-4">
                    <div className="flex justify-between items-center border-b border-stone-200 pb-3">
                      <span className="text-xs text-stone-500 uppercase tracking-widest font-bold">Bank</span>
                      <span className="font-black text-stone-900">{paymentData.bank_name}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-stone-200 pb-3">
                      <span className="text-xs text-stone-500 uppercase tracking-widest font-bold">Account No</span>
                      <div className="flex items-center gap-3">
                        <span className="font-black text-2xl text-amber-600 tracking-wider">{paymentData.account_number}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-stone-500 uppercase tracking-widest font-bold">Amount</span>
                      <span className="font-black text-stone-900 text-lg">₦{totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="w-full flex items-center justify-center gap-2 text-stone-400 text-xs font-bold uppercase tracking-widest mt-4">
                    <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse" />
                    Waiting for transfer confirmation...
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
