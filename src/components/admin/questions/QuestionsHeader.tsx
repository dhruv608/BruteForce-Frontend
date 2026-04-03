"use client";

import React from 'react';
import { HelpCircle } from 'lucide-react';

interface QuestionsHeaderProps {
  totalRecords: number;
}

export default function QuestionsHeader({ totalRecords }: QuestionsHeaderProps) {
  return (
    <div className="glass rounded-2xl p-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <HelpCircle className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">
            Global Question Bank
          </h2>
        </div>
      </div>

      <div className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
        {totalRecords} Questions
      </div>
    </div>
  );
}
