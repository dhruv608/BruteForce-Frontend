"use client";
import React from 'react';

export function Modal({ children, onClose, title, description, width = "max-w-[440px]" }: { children: React.ReactNode; onClose?: () => void; title?: string; description?: string, width?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`bg-card w-full ${width} p-10 rounded-3xl shadow-xl shadow-black/5 dark:shadow-black/40 border border-border/80 relative`}>
        {onClose && (
          <button onClick={onClose} className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors focus:outline-none">
            ✕
          </button>
        )}
        {(title || description) && (
          <div className="text-center mb-8">
            {title && <h1 className="font-serif italic text-3xl font-bold bg-gradient-to-br from-primary to-amber-600 bg-clip-text text-transparent mb-2">{title}</h1>}
            {description && <p className="text-[13px] text-muted-foreground font-medium">{description}</p>}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
