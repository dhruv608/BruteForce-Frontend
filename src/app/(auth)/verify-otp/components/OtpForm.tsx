"use client";
import React, { Suspense } from 'react';
import { Button } from '../../shared/components/Button';
import { Input } from '../../shared/components/Input';
import { useOtpVerification } from '../hooks/useOtpVerification';

function OtpFormContent() {
  const { fpOtpArray, error, loading, handleOtpChange, handleOtpKeyDown, handleVerifyOtpLocal, router } = useOtpVerification();

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="font-serif italic text-3xl font-bold bg-gradient-to-br from-primary to-amber-600 bg-clip-text text-transparent mb-2">
          Verify OTP
        </h1>
        <p className="text-[13px] text-muted-foreground font-medium">
          Enter the OTP sent to your email.
        </p>
      </div>
      {error && (
        <div className="mb-5 px-4 py-3 bg-destructive/10 border border-destructive/20 text-destructive text-[13px] font-medium rounded-xl text-center">
          {error}
        </div>
      )}
      <form onSubmit={handleVerifyOtpLocal} className="space-y-4">
        <div className="space-y-3">
          <label className="text-[12px] font-semibold text-foreground tracking-wide text-center block">Enter OTP</label>
          <div className="flex justify-between gap-2">
            {fpOtpArray.map((digit, idx) => (
              <Input
                key={idx}
                id={`otp-input-${idx}`}
                type="text"
                value={digit}
                onChange={e => handleOtpChange(idx, e.target.value)}
                onKeyDown={e => handleOtpKeyDown(idx, e)}
                disabled={loading}
                className="h-12 w-12 bg-muted/40 text-center text-xl font-mono p-0"
                maxLength={1}
                required
              />
            ))}
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <Button type="button" onClick={() => router.push('/forgot-password')} disabled={loading} variant="outline" className="flex-1 h-11 text-[14px] font-semibold tracking-wide border-2">
            ← Back
          </Button>
          <Button type="submit" disabled={loading} className="flex-1 h-11 text-[14px] font-semibold tracking-wide bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90 text-primary-foreground shadow-md transition-all active:scale-[0.98]">
            Verify OTP
          </Button>
        </div>
      </form>
    </>
  );
}

export function OtpForm() {
  return (
    <Suspense fallback={<div className="text-center p-4">Loading...</div>}>
      <OtpFormContent />
    </Suspense>
  );
}
