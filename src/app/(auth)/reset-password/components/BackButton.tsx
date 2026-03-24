"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../shared/components/Button';

export function BackButton({ disabled }: { disabled?: boolean }) {
  const router = useRouter();
  return (
    <Button
      type="button"
      onClick={() => router.back()}
      disabled={disabled}
      variant="outline"
      className="flex-1 h-11 text-[14px] font-semibold tracking-wide border-2"
    >
      ← Back
    </Button>
  );
}
