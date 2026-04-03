"use client";

import React from 'react';
import { Users } from 'lucide-react';

interface StudentsHeaderProps {
  totalRecords: number;
  selectedBatch: { name: string } | null;
}

export default function StudentsHeader({ totalRecords, selectedBatch }: StudentsHeaderProps) {
  return (
    <div className="glass rounded-2xl p-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Users className="w-6 h-6 text-primary" />
        </div>

        <div>
          <h2 className="text-xl font-semibold">Student Management</h2>
          <p className="text-sm text-muted-foreground">
            {selectedBatch?.name} • {totalRecords} Enrollments
          </p>
        </div>
      </div>

      <div className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
        {totalRecords} Students
      </div>
    </div>
  );
}
