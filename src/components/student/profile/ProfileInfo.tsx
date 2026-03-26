// src/components/student/profile/ProfileInfo.tsx
import React from 'react';
import { Users, Code, CheckCircle2 } from 'lucide-react';
import { StudentProfile } from '@/types/student';

interface ProfileInfoProps {
  student: StudentProfile;
}

export function ProfileInfo({ student }: ProfileInfoProps) {
  return (
    <div className="glass p-6" style={{borderRadius: 'var(--radius-lg)'}}>
      <h3 
        className="font-bold mb-6 flex items-center gap-2" 
        style={{fontSize: 'var(--text-base)', color: 'var(--foreground)'}}
      >
        <Users className="w-5 h-5" style={{color: 'var(--accent-primary)'}} />
        Profile Information
      </h3>

      <div className="space-y-4">
        <div className="flex justify-between items-center p-4 hover-glow transition-all duration-200" style={{backgroundColor: 'var(--accent-secondary)', borderRadius: 'var(--radius-lg)'}}>
          <span className="font-medium" style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)'}}>Name</span>
          <span className="font-bold" style={{fontSize: 'var(--text-base)', color: 'var(--foreground)'}}>{student.name || '-'}</span>
        </div>

        <div className="flex justify-between items-center p-4 hover-glow transition-all duration-200" style={{backgroundColor: 'var(--accent-secondary)', borderRadius: 'var(--radius-lg)'}}>
          <span className="font-medium" style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)'}}>Enrollment ID</span>
          <span className="font-mono" style={{fontSize: 'var(--text-sm)', color: 'var(--foreground)'}}>{student.enrollmentId || '-'}</span>
        </div>

        <div className="flex items-center gap-4 p-4 hover-glow transition-all duration-200" style={{
          backgroundColor: student.leetcode ? 'var(--accent-secondary)' : 'var(--muted)',
          borderRadius: 'var(--radius-lg)',
          border: `1px solid ${student.leetcode ? 'var(--border)' : 'var(--border)'}`
        }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold" style={{
            backgroundColor: student.leetcode ? 'var(--accent-primary)' : 'var(--muted)',
            color: student.leetcode ? 'var(--primary-foreground)' : 'var(--text-secondary)',
            borderRadius: 'var(--radius-md)'
          }}>
            <Code className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="font-bold" style={{fontSize: 'var(--text-sm)', color: 'var(--foreground)'}}>LeetCode</div>
            <div className="font-mono" style={{fontSize: 'var(--text-xs)', color: 'var(--text-secondary)'}}>{student.leetcode || 'Not linked'}</div>
          </div>
          {student.leetcode && <CheckCircle2 className="w-5 h-5" style={{color: 'var(--accent-primary)'}} />}
        </div>

        <div className="flex items-center gap-4 p-4 hover-glow transition-all duration-200" style={{
          backgroundColor: student.gfg ? 'var(--accent-secondary)' : 'var(--muted)',
          borderRadius: 'var(--radius-lg)',
          border: `1px solid ${student.gfg ? 'var(--border)' : 'var(--border)'}`
        }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold" style={{
            backgroundColor: student.gfg ? 'var(--accent-primary)' : 'var(--muted)',
            color: student.gfg ? 'var(--primary-foreground)' : 'var(--text-secondary)',
            borderRadius: 'var(--radius-md)'
          }}>
            <Code className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="font-bold" style={{fontSize: 'var(--text-sm)', color: 'var(--foreground)'}}>GeeksforGeeks</div>
            <div className="font-mono" style={{fontSize: 'var(--text-xs)', color: 'var(--text-secondary)'}}>{student.gfg || 'Not linked'}</div>
          </div>
          {student.gfg && <CheckCircle2 className="w-5 h-5" style={{color: 'var(--accent-primary)'}} />}
        </div>
      </div>
    </div>
  );
}