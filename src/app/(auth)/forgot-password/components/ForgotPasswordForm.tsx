"use client";
import React from 'react';
import { Button } from '../../shared/components/Button';
import { Input } from '../../shared/components/Input';
import { useForgotPassword } from '../hooks/useForgotPassword';
import { BackButton } from './BackButton';

export function ForgotPasswordForm() {
  const { email, setEmail, loading, error, handleSendOtp } = useForgotPassword();

 return (
  <div className="space-y-6">

    {/* 🔹 HEADER */}
    <div className="text-center space-y-2">
      <h1 className="
        font-serif italic text-3xl font-bold
        text-logo
        tracking-tight
      ">
        Forgot Password
      </h1>

      <p className="text-[13px] text-muted-foreground font-medium">
        Enter your email to receive an OTP.
      </p>
    </div>

    {/* 🔸 ERROR */}
    {error && (
      <div className="
        px-4 py-3 text-center
        bg-destructive/10 border border-destructive/20
        text-destructive text-[13px] font-medium
        rounded-xl backdrop-blur-md
      ">
        {error}
      </div>
    )}

    {/* 🔹 FORM */}
    <form onSubmit={handleSendOtp} className="space-y-5">

      {/* Email */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold text-muted-foreground tracking-wide">
          Email Address
        </label>

        <Input
          type="email"
          placeholder="student@pwioi.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={loading}
          className="
            w-full h-11
            rounded-xl
            bg-accent/40 backdrop-blur
            border border-border/30
            px-4
            text-sm
            focus:border-primary
            focus:shadow-[0_0_0_2px_rgba(204,255,0,0.2)]
            transition-all
          "
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={loading}
        className="
          w-full h-11
          rounded-xl
          text-sm font-semibold tracking-wide
          bg-primary text-primary-foreground
          hover:shadow-[0_0_20px_var(--hover-glow)]
          transition-all duration-200
          active:scale-[0.97]
        "
      >
        {loading ? (
          <span className="animate-pulse">Sending OTP...</span>
        ) : (
          "Send OTP"
        )}
      </Button>

    </form>
  </div>
);
}
