"use client";

import React, { useState } from 'react';
import { VerifyOtpModal } from '../../../components/auth/VerifyOtpModal';

export default function VerifyOtpPage() {
  const [isModalOpen, setIsModalOpen] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <VerifyOtpModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
