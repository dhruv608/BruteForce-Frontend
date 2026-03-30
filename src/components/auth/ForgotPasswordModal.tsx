"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowRight, X, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "../../app/(auth)/shared/components/Button";
import { Input } from "../../app/(auth)/shared/components/Input";
import { useForgotPassword } from "../../app/(auth)/forgot-password/hooks/useForgotPassword";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
  const { email, setEmail, loading, error, handleSendOtp } = useForgotPassword();
  const router = useRouter();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* 🔥 HIGH-END BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#050507]/85 backdrop-blur-xl"
          />

          {/* 🔥 AMBIENT RADIAL GLOW */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-[#CCFF00]/5 rounded-full blur-[120px] pointer-events-none" />

          {/* 🔥 MODAL CARD */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="
              relative z-10 w-full max-w-[420px]
              bg-[#090A0F] border border-white/[0.06]
              rounded-[32px] overflow-hidden
              shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)]
            "
          >
            {/* TOP GLASS REFLECTION */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

            {/* HEADER */}
            <div className="relative px-8 pt-10 pb-6 text-center">
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#CCFF00]/10 border border-[#CCFF00]/20 mb-6 group"
              >
                <Mail className="text-[#CCFF00] group-hover:scale-110 transition-transform duration-300" size={30} />
              </motion.div>

              <h2 className="text-2xl font-bold text-white tracking-tight leading-tight">
                Forgot <span className="text-[#CCFF00]">Password?</span>
              </h2>
              <p className="text-slate-500 text-sm mt-2 font-medium">
                No worries, we'll send you reset instructions.
              </p>

              {/* CLOSE BUTTON */}
              <button
                onClick={() => {
                  onClose();
                  router.push("/login");
                }}
                className="absolute right-6 top-6 p-2 rounded-full text-slate-500 hover:text-white hover:bg-white/5 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* BODY */}
            <div className="px-8 pb-10">
              <form onSubmit={handleSendOtp} className="space-y-6">
                
                {/* ERROR MESSAGE */}
                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/5 border border-red-500/20 shadow-sm"
                    >
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                      <p className="text-xs text-red-400 font-medium leading-tight">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* INPUT FIELD */}
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1 transition-colors group-focus-within:text-[#CCFF00]">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail 
                      size={16} 
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#CCFF00] transition-colors" 
                    />
                    <Input
                      type="email"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      className="
                        !pl-11 w-full h-12 bg-white/[0.03] border-white/10 rounded-xl
                        text-white placeholder:text-slate-600 outline-none
                        focus:border-[#CCFF00]/40 focus:ring-4 focus:ring-[#CCFF00]/5
                        transition-all duration-300 group-hover:border-white/20
                      "
                      required
                    />
                  </div>
                </div>

                {/* SUBMIT BUTTON */}
                <Button
                  type="submit"
                  disabled={loading || !email}
                  className="
                    relative w-full h-14 rounded-2xl overflow-hidden
                    bg-[#CCFF00] text-black font-black text-sm uppercase tracking-widest
                    hover:bg-[#d9ff33] hover:shadow-[0_0_30px_rgba(204,255,0,0.25)]
                    active:scale-[0.98] transition-all duration-300
                    disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed
                    group/btn
                  "
                >
                  <div className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                       <>
                        <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        Sending Code...
                       </>
                    ) : (
                      <>
                        Get Verification OTP <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                  
                  {/* BUTTON SHINE EFFECT */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-in-out" />
                </Button>

                {/* BOTTOM CAPTION */}
                <p className="text-center text-[10px] text-slate-600 uppercase tracking-widest flex items-center justify-center gap-2">
                   <Sparkles size={10} className="text-[#CCFF00]/50" /> Secure Encryption Active
                </p>
              </form>
            </div>

            {/* DECORATIVE FOOTER ACCENT */}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}