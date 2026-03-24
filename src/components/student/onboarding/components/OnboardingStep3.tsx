"use client";
import React from 'react';
import { Button } from '../../../../app/(auth)/shared/components/Button';

export function OnboardingStep3({ data, setStep, confirmChecked, setConfirmChecked, submitOnboarding, loading }: any) {
  const handleEdit = () => {
    console.log("Edit button clicked, going to step 2");
    setStep(2);
  };

  return (
    <>
      <div className="text-center mb-6">
        <h1 className="font-serif italic text-3xl font-bold bg-gradient-to-br from-primary to-amber-600 bg-clip-text text-transparent mb-2">Confirm Validation</h1>
        <p className="text-[13px] text-muted-foreground font-medium">Verify your endpoints carefully.</p>
      </div>
      <div className="space-y-6">
        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-[13px] font-medium p-4 rounded-xl">⚠️ If your usernames are incorrect, your evaluation will NOT work correctly. Review handles carefully: you cannot manually edit your username or ID tracking fields after completion.</div>
        <div className="space-y-4">
          <div className="p-3 bg-muted rounded-lg border flex justify-between items-center">
            <div><p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">LeetCode</p><p className="font-medium text-[14px] truncate max-w-[130px]" title={data.leetcode_id}>{data.leetcode_id}</p></div>
            <a href={`https://leetcode.com/u/${data.leetcode_id}/`} target="_blank" rel="noopener noreferrer" className="text-primary hover:bg-primary/5 transition-colors border-primary/20 border text-xs font-semibold px-3 py-1.5 bg-primary/10 rounded-md whitespace-nowrap">🔗 View Profile</a>
          </div>
          <div className="p-3 bg-muted rounded-lg border flex justify-between items-center">
            <div><p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">GeeksForGeeks</p><p className="font-medium text-[14px] truncate max-w-[130px]" title={data.gfg_id}>{data.gfg_id}</p></div>
            <a href={`https://auth.geeksforgeeks.org/user/${data.gfg_id}/`} target="_blank" rel="noopener noreferrer" className="text-primary hover:bg-primary/5 border border-primary/20 transition-colors text-xs font-semibold px-3 py-1.5 bg-primary/10 rounded-md whitespace-nowrap">🔗 View Profile</a>
          </div>
        </div>
        <div className="flex items-start gap-3 pt-2">
          <input type="checkbox" id="confirmData" checked={confirmChecked} onChange={e => setConfirmChecked(e.target.checked)} className="mt-0.5 w-4 h-4 text-primary cursor-pointer border-border rounded" />
          <label htmlFor="confirmData" className="text-xs text-muted-foreground leading-tight cursor-pointer">I confirm that the above URLs successfully open my actual profiles and the handles entered precisely match my accounts.</label>
        </div>
        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={handleEdit} disabled={loading} className="w-1/3 h-11">Edit</Button>
          <Button onClick={submitOnboarding} disabled={!confirmChecked || loading} className="w-2/3 h-11 bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90 text-primary-foreground font-semibold">{loading ? 'Saving securely...' : 'Confirm & Save'}</Button>
        </div>
      </div>
    </>
  );
}
