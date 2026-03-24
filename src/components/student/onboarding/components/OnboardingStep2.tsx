"use client";
import React from 'react';
import { Input } from '../../../../app/(auth)/shared/components/Input';
import { Button } from '../../../../app/(auth)/shared/components/Button';

export function OnboardingStep2({ data, setData, setStep }: { data: any, setData: any, setStep: any }) {
  return (
    <>
      <div className="text-center mb-6">
        <h1 className="font-serif italic text-3xl font-bold bg-gradient-to-br from-primary to-amber-600 bg-clip-text text-transparent mb-2">Coding Profiles</h1>
        <p className="text-[13px] text-muted-foreground font-medium">Connect your coding profiles for automated evaluation tracking.</p>
      </div>
      <form onSubmit={e => { e.preventDefault(); if (data.leetcode_id && data.gfg_id) setStep(3); }} className="space-y-5">
        <div className="space-y-1.5">
          <div className="flex justify-between items-center"><label className="text-[12px] font-semibold text-foreground tracking-wide">LeetCode Username</label><span className="text-[10px] uppercase font-bold text-red-500 tracking-wider">Mandatory</span></div>
          <Input type="text" value={data.leetcode_id} onChange={e => setData({ ...data, leetcode_id: e.target.value })} className="h-11 bg-muted/40" required placeholder="LeetCode Handle" />
          <p className="text-[11px] text-muted-foreground italic">These are required for evaluation</p>
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between items-center"><label className="text-[12px] font-semibold text-foreground tracking-wide">GFG Username</label><span className="text-[10px] uppercase font-bold text-red-500 tracking-wider">Mandatory</span></div>
          <Input type="text" value={data.gfg_id} onChange={e => setData({ ...data, gfg_id: e.target.value })} className="h-11 bg-muted/40" required placeholder="GeeksForGeeks Handle" />
          <p className="text-[11px] text-muted-foreground italic">These are required for evaluation</p>
        </div>

        <Button type="submit" disabled={!data.leetcode_id || !data.gfg_id} className="w-full h-11 bg-primary text-primary-foreground font-semibold mt-4">Submit</Button>
      </form>
    </>
  );
}
