import React from 'react';

export function PasswordStrength({ password }: { password?: string }) {
  if (!password) return null;
  const score = password.length > 8 ? 3 : password.length > 5 ? 2 : 1;
  const colors = ['bg-red-500', 'bg-red-500', 'bg-amber-500', 'bg-emerald-500'];
  return (
    <div className="flex gap-1 mt-1.5 h-1 w-full">
      <div className={`flex-1 rounded-full ${score >= 1 ? colors[1] : 'bg-muted/50'}`} />
      <div className={`flex-1 rounded-full ${score >= 2 ? colors[2] : 'bg-muted/50'}`} />
      <div className={`flex-1 rounded-full ${score >= 3 ? colors[3] : 'bg-muted/50'}`} />
    </div>
  );
}
