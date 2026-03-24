import React from 'react';

export function ProgressBar({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8 mt-2">
      <div className="flex flex-col items-center gap-1.5 w-16">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>1</div>
        <span className={`text-[10px] font-semibold tracking-wider uppercase ${step >= 1 ? 'text-foreground' : 'text-muted-foreground'}`}>Username</span>
      </div>
      <div className={`h-[2px] w-10 mt-[-20px] rounded-full transition-colors ${step >= 2 ? 'bg-primary' : 'bg-muted/80'}`} />
      <div className="flex flex-col items-center gap-1.5 w-16">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>2</div>
        <span className={`text-[10px] font-semibold tracking-wider uppercase ${step >= 2 ? 'text-foreground' : 'text-muted-foreground'}`}>Profiles</span>
      </div>
      <div className={`h-[2px] w-10 mt-[-20px] rounded-full transition-colors ${step === 3 ? 'bg-primary' : 'bg-muted/80'}`} />
      <div className="flex flex-col items-center gap-1.5 w-16">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step === 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>3</div>
        <span className={`text-[10px] font-semibold tracking-wider uppercase ${step === 3 ? 'text-foreground' : 'text-muted-foreground'}`}>Confirm</span>
      </div>
    </div>
  );
}
