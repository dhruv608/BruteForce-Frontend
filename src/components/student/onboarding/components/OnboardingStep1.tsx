"use client";
import React from 'react';
import { Input } from '../../../../app/(auth)/shared/components/Input';
import { Button } from '../../../../app/(auth)/shared/components/Button';

export function OnboardingStep1({ data, setData, setStep }: { data: any, setData: any, setStep: any }) {
  return (
    <>
      <div className="text-center mb-6">
        <h1 className="font-serif italic text-3xl font-bold bg-gradient-to-br from-primary to-amber-600 bg-clip-text text-transparent mb-2">Set Username</h1>
        <p className="text-[13px] text-muted-foreground font-medium">Choose or verify your unique username to continue.</p>
      </div>
      <form onSubmit={e => { e.preventDefault(); if (data.username) setStep(2); }} className="space-y-6">
        <div className="space-y-1.5">
          <label className="text-[12px] font-semibold text-foreground tracking-wide">Username <span className="text-red-500">*</span></label>
          <Input type="text" placeholder="e.g. jdoe_bruteforce" value={data.username} onChange={e => setData({ ...data, username: e.target.value })} className="h-11 bg-muted/40" required />
        </div>
        <Button type="submit" disabled={!data.username} className="w-full h-11 bg-primary text-primary-foreground font-semibold">Next</Button>
      </form>
    </>
  );
}
