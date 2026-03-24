"use client";
import React from 'react';
import { useToast } from '../hooks/useToast';

export function Toast() {
  const { toasts } = useToast();
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className={`px-5 py-3 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border text-[13.5px] font-medium animate-in slide-in-from-right-8 fade-in duration-300 pointer-events-auto flex items-center gap-2 ${t.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' : 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800'} `}>
          {t.message}
        </div>
      ))}
    </div>
  );
}
