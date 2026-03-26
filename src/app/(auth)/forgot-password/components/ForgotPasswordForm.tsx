"use client";
import React from 'react';
import { Button } from '../../shared/components/Button';
import { Input } from '../../shared/components/Input';
import { useForgotPassword } from '../hooks/useForgotPassword';

export function ForgotPasswordForm() {
  const { email, setEmail, loading, error, handleSendOtp } = useForgotPassword();

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="font-serif italic text-3xl font-bold bg-gradient-to-br from-primary to-amber-600 bg-clip-text text-transparent mb-2">
          Forget Password
        </h1>
        <p className="text-[13px] text-muted-foreground font-medium">
          Enter your email to receive an OTP.
        </p>
      </div>

      {error && (
        <div className="mb-5 px-4 py-3 bg-destructive/10 border border-destructive/20 text-destructive text-[13px] font-medium rounded-xl text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSendOtp} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[12px] font-semibold text-foreground tracking-wide">Email Address</label>
          <Input
            type="email"
            placeholder="student@pwioi.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={loading}
            className="h-11"
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 mt-4 text-[14px] font-semibold tracking-wide"
        >
          {loading ? 'Sending OTP...' : 'Send OTP'}
        </Button>
      </form>
    </>
  );
}
