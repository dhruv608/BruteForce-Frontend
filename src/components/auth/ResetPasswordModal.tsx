"use client";

import React, { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Lock,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  X,
} from "lucide-react";
import { Button } from "../../app/(auth)/shared/components/Button";
import { Input } from "../../app/(auth)/shared/components/Input";
import { useResetPassword } from "../../app/(auth)/reset-password/hooks/useResetPassword";

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ResetPasswordModalContent({ isOpen, onClose }: ResetPasswordModalProps) {
  const {
    fpNewPassword,
    setFpNewPassword,
    fpConfirmPassword,
    setFpConfirmPassword,
    error,
    loading,
    handleResetPassword,
  } = useResetPassword();

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

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

      {/* 🔥 AMBIENT GLOW DECORATION */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-[#CCFF00]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* 🔥 MODAL CONTAINER */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
        className="
          relative z-10 w-full max-w-[420px]
          bg-[#090A0F] border border-white/[0.06]
          rounded-[28px] overflow-hidden
          shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)]
        "
      >
        {/* PREMIUM GLASS REFLECTION TOP LAYER */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

        {/* HEADER */}
        <div className="relative px-8 pt-10 pb-6 text-center">
          <motion.div 
            initial={{ rotate: -10, scale: 0.9 }}
            animate={{ rotate: 0, scale: 1 }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#CCFF00]/10 border border-[#CCFF00]/20 mb-6"
          >
            <ShieldCheck className="text-[#CCFF00]" size={28} />
          </motion.div>

          <h2 className="text-2xl font-bold text-white tracking-tight leading-tight">
            Reset <span className="text-[#CCFF00]">Password</span>
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            Enter your new secure access credentials
          </p>

          <button
            onClick={onClose}
            className="absolute right-6 top-6 p-2 rounded-full text-slate-500 hover:text-white hover:bg-white/5 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="px-8 pb-10">
          <form onSubmit={handleResetPassword} className="space-y-5">
            
            {/* ERROR UI */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/5 border border-red-500/20 shadow-sm"
                >
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <p className="text-xs text-red-400 font-medium">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* NEW PASSWORD */}
            <div className="space-y-2 group">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-[#CCFF00]">
                New Password
              </label>
              <div className="relative">
                <Lock 
                  size={16} 
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#CCFF00] transition-colors" 
                />
                <Input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={fpNewPassword}
                  onChange={(e) => setFpNewPassword(e.target.value)}
                  disabled={loading}
                  className="
                    !pl-11 w-full h-12 bg-white/[0.03] border-white/10 rounded-xl
                    focus:border-[#CCFF00]/40 focus:ring-4 focus:ring-[#CCFF00]/5
                    transition-all duration-300
                  "
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 active:scale-90 transition-all"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="space-y-2 group">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-[#CCFF00]">
                Confirm Password
              </label>
              <div className="relative">
                <Lock 
                  size={16} 
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#CCFF00] transition-colors" 
                />
                <Input
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  value={fpConfirmPassword}
                  onChange={(e) => setFpConfirmPassword(e.target.value)}
                  disabled={loading}
                  className="
                    !pl-11 w-full h-12 bg-white/[0.03] border-white/10 rounded-xl
                    focus:border-[#CCFF00]/40 focus:ring-4 focus:ring-[#CCFF00]/5
                    transition-all duration-300
                  "
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 active:scale-90 transition-all"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                onClick={() => router.back()}
                disabled={loading}
                variant="outline"
                className="
                  flex-1 h-12 rounded-xl order-2 sm:order-1
                  border-white/10 hover:bg-white/5 hover:text-white text-slate-400
                  transition-all duration-200 gap-2
                "
              >
                <ArrowLeft size={16} />
                Back
              </Button>

              <Button
                type="submit"
                disabled={loading}
                className="
                  flex-1 h-12 rounded-xl order-1 sm:order-2
                  bg-[#CCFF00] text-black font-bold
                  hover:bg-[#d9ff33] hover:shadow-[0_0_20px_rgba(204,255,0,0.3)]
                  active:scale-[0.98] transition-all duration-300
                "
              >
                {loading ? (
                   <span className="flex items-center gap-2">
                     <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                     Processing
                   </span>
                ) : "Reset Password"}
              </Button>
            </div>
          </form>
        </div>
        
        {/* FOOTER SCANLINE DECORATION */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#CCFF00]/30 to-transparent" />
      </motion.div>
    </div>
  );
}

export function ResetPasswordModal(props: ResetPasswordModalProps) {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#090A0F]">
        <div className="w-10 h-10 border-2 border-[#CCFF00]/20 border-t-[#CCFF00] rounded-full animate-spin" />
      </div>
    }>
      <ResetPasswordModalContent {...props} />
    </Suspense>
  );
}