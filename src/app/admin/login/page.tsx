'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [recoveryKey, setRecoveryKey] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);

  // --- LOGIN / SETUP HANDLER ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.status === 423 || data.status === 'locked') {
        setIsLocked(true);
        setErrorMsg(data.message || 'Account is locked due to excessive failed attempts.');
      } else if (data.status === 'success') {
        if (data.isSetup) {
          setSuccessMsg('Admin credentials created successfully! Redirecting...');
        } else {
          setSuccessMsg('Login successful! Redirecting to dashboard...');
        }
        setTimeout(() => {
          router.push('/admin');
          router.refresh();
        }, 1200);
      } else {
        setErrorMsg(data.message || 'Invalid credentials.');
      }
    } catch (err) {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // --- EMERGENCY UNLOCK HANDLER ---
  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/admin/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recoveryKey })
      });

      const data = await res.json();

      if (data.status === 'success') {
        setSuccessMsg(data.message);
        setIsLocked(false);
        setShowUnlockModal(false);
        setRecoveryKey('');
      } else {
        setErrorMsg(data.message || 'Invalid Recovery Key.');
      }
    } catch (err) {
      setErrorMsg('Network error during unlock.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full bg-stone-50 border-2 border-stone-200 rounded-xl px-4 py-3.5 text-stone-900 font-medium placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-colors text-sm";

  return (
    <main className="min-h-screen bg-stone-900 flex items-center justify-center p-4 selection:bg-amber-500 selection:text-stone-900 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden p-8 sm:p-10 border border-stone-800">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-full border-2 border-stone-900 flex items-center justify-center text-stone-900 font-serif text-lg font-bold mb-3 shadow-md">
            AH
          </div>
          <h1 className="text-xl font-black text-stone-900 uppercase tracking-widest">Admin Portal</h1>
          <p className="text-xs text-stone-500 font-bold uppercase tracking-wider mt-1">Abu Hayyãn Portal</p>
        </div>

        {/* Dynamic Alerts */}
        {errorMsg && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-xs font-bold p-4 rounded-xl leading-relaxed">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold p-4 rounded-xl leading-relaxed">
            {successMsg}
          </div>
        )}

        {/* Lockout Notice */}
        {isLocked && (
          <div className="mb-6 bg-amber-50 border border-amber-200 p-4 rounded-xl text-center">
            <p className="text-xs font-black text-amber-900 uppercase tracking-wider mb-2">Account Suspended</p>
            <p className="text-xs text-amber-700 font-medium mb-3">Too many invalid password attempts detected.</p>
            <button
              type="button"
              onClick={() => setShowUnlockModal(true)}
              className="text-xs font-black text-amber-800 underline uppercase tracking-wider hover:text-stone-900"
            >
              Use Emergency Recovery Key
            </button>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[10px] font-black text-stone-900 uppercase tracking-widest mb-2">Admin Email</label>
            <input
              type="email"
              required
              disabled={isLocked || loading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@abuhayyan.com"
              className={inputStyle}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-stone-900 uppercase tracking-widest mb-2">Password</label>
            <input
              type="password"
              required
              disabled={isLocked || loading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={isLocked || loading}
            className="w-full bg-stone-900 text-white font-black py-4 rounded-full uppercase tracking-[0.15em] text-xs hover:bg-amber-500 hover:text-stone-900 transition-colors shadow-lg disabled:opacity-40 disabled:hover:bg-stone-900 disabled:hover:text-white mt-2"
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-8 text-center pt-6 border-t border-stone-100">
          <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">
            First login automatically sets up master admin credentials.
          </p>
        </div>
      </div>

      {/* --- EMERGENCY UNLOCK MODAL --- */}
      <AnimatePresence>
        {showUnlockModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200"
            >
              <h3 className="text-base font-black text-stone-900 uppercase tracking-wider mb-2">Emergency Account Unlock</h3>
              <p className="text-xs text-stone-500 font-medium leading-relaxed mb-6">
                Enter the <span className="font-bold text-stone-900">ADMIN_RECOVERY_KEY</span> configured in your Railway environment variables to reactivate access.
              </p>

              <form onSubmit={handleUnlock} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-stone-900 uppercase tracking-widest mb-2">Secret Recovery Key</label>
                  <input
                    type="password"
                    required
                    value={recoveryKey}
                    onChange={(e) => setRecoveryKey(e.target.value)}
                    placeholder="Enter key..."
                    className={inputStyle}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowUnlockModal(false)}
                    className="flex-1 bg-stone-100 text-stone-700 font-bold py-3 rounded-full text-xs uppercase tracking-wider hover:bg-stone-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-amber-500 text-stone-900 font-black py-3 rounded-full text-xs uppercase tracking-wider hover:bg-amber-400 shadow-md"
                  >
                    {loading ? 'Unlocking...' : 'Unlock Account'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
