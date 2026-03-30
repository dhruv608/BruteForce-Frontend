"use client";

import React, { Suspense, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ShieldCheck, AlertCircle, X, Sparkles } from "lucide-react";
import { Button } from "../../app/(auth)/shared/components/Button";
import { Input } from "../../app/(auth)/shared/components/Input";
import { useOtpVerification } from "../../app/(auth)/verify-otp/hooks/useOtpVerification";

interface VerifyOtpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function VerifyOtpModalContent({ isOpen, onClose }: VerifyOtpModalProps) {
  const {
    fpOtpArray,
    error,
    loading,
    handleOtpChange,
    handleOtpKeyDown,
    handleVerifyOtpLocal,
    router,
    firstOtpInputRef,
  } = useOtpVerification();

  // Auto-focus first input on mount
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => firstOtpInputRef.current?.focus(), 100);
    }
  }, [isOpen, firstOtpInputRef]);

  // AUTO-SUBMIT LOGIC: When all 6 digits are filled, trigger submit
  useEffect(() => {
    const isFull = fpOtpArray.every((digit) => digit !== "");
    if (isFull && !loading) {
      // Small delay for better UX so user sees the last digit enter
      const timer = setTimeout(() => {
        const form = document.getElementById("otp-form") as HTMLFormElement;
        form?.requestSubmit();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [fpOtpArray, loading]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 🔥 PREMIUM BACKDROP */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#050507]/80 backdrop-blur-md"
      />

      {/* 🔥 AMBIENT GLOW */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-[#CCFF00]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* 🔥 MODAL CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
        className="
          relative z-10 w-full max-w-[420px]
          bg-[#090A0F] border border-white/[0.06]
          rounded-[32px] overflow-hidden
          shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)]
        "
      >
        {/* TOP REFLECTION */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 p-2 rounded-full text-slate-500 hover:text-white hover:bg-white/5 transition-all z-20"
        >
          <X size={18} />
        </button>

        {/* HEADER */}
        <div className="relative px-8 pt-10 pb-4 text-center">
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#CCFF00]/10 border border-[#CCFF00]/20 mb-6 group"
          >
            <ShieldCheck className="text-[#CCFF00] group-hover:scale-110 transition-transform" size={28} />
          </motion.div>

          <h2 className="text-2xl font-bold text-white tracking-tight leading-tight">
            Verify <span className="text-[#CCFF00]">Identity</span>
          </h2>
          <p className="text-slate-500 text-sm mt-2 font-medium">
            We sent a 6-digit code to your inbox
          </p>
        </div>

        {/* BODY */}
        <div className="px-8 pb-10 pt-4">
          <form id="otp-form" onSubmit={handleVerifyOtpLocal} className="space-y-8">
            
            {/* ERROR MESSAGE */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center justify-center gap-2 p-3 rounded-xl bg-red-500/5 border border-red-500/20"
                >
                  <AlertCircle size={14} className="text-red-400" />
                  <p className="text-xs text-red-400 font-semibold uppercase tracking-wider">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 🔥 OTP INPUT GRID (ENHANCED VISIBILITY) */}
            <div className="flex justify-between gap-2 sm:gap-3">
              {fpOtpArray.map((digit, idx) => (
                <div key={idx} className="relative group">
                  <Input
                    ref={idx === 0 ? firstOtpInputRef : undefined}
                    id={`otp-${idx}`}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    disabled={loading}
                    maxLength={1}
                    required
                    className="
                      w-11 h-14 sm:w-12 sm:h-16
                      text-center text-2xl font-black
                      bg-white/[0.03] border-white/10 text-[#CCFF00]
                      rounded-2xl transition-all duration-300
                      focus:border-[#CCFF00]/50 focus:ring-[6px] focus:ring-[#CCFF00]/5
                      group-hover:border-white/20
                      p-0 flex items-center justify-center
                    "
                  />
                  {/* Subtle underline decoration */}
                  <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full transition-all duration-300 ${digit ? 'bg-[#CCFF00] w-6' : 'bg-white/10'}`} />
                </div>
              ))}
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col gap-4">
              <Button
                type="submit"
                disabled={loading}
                className="
                  w-full h-14 rounded-2xl
                  bg-[#CCFF00] text-black font-black text-sm uppercase tracking-widest
                  hover:bg-[#d9ff33] hover:shadow-[0_0_30px_rgba(204,255,0,0.2)]
                  active:scale-[0.98] transition-all duration-300
                  disabled:opacity-50 disabled:grayscale
                "
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    Authenticating
                  </div>
                ) : (
                  <span className="flex items-center gap-2">
                    Verify Code <Sparkles size={16} />
                  </span>
                )}
              </Button>

              <button
                type="button"
                onClick={() => router.push("/forgot-password")}
                disabled={loading}
                className="flex items-center justify-center gap-2 w-full py-2 text-slate-500 hover:text-white transition-all group"
              >
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Resend Code / Change Email</span>
              </button>
            </div>
          </form>
        </div>

        {/* BOTTOM DECORATIVE SCANLINE */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#CCFF00]/40 to-transparent" />
      </motion.div>

      {/* CUSTOM ANIMATION FOR INPUT BOXES */}
      <style jsx global>{`
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}

export function VerifyOtpModal(props: VerifyOtpModalProps) {
  return (
    <Suspense 
      fallback={
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#090A0F]">
          <div className="w-12 h-12 border-2 border-[#CCFF00]/10 border-t-[#CCFF00] rounded-full animate-spin" />
        </div>
      }
    >
      <VerifyOtpModalContent {...props} />
    </Suspense>
  );
}