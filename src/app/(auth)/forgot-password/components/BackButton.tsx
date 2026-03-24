"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

export function BackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push('/login')}
      className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
    >
      ✕
    </button>
  );
}
