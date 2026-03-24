"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../shared/components/Button';

export function BackButton({ onClick }: { onClick?: () => void }) {
  const router = useRouter();
  
  const handleClick = () => {
    if (onClick) onClick();
    else router.back();
  };

  return (
    <Button
      type="button"
      onClick={handleClick}
      variant="outline"
      className="flex-1 h-11 text-[14px] font-semibold tracking-wide border-2"
    >
      ← Back
    </Button>
  );
}
