// src/components/student/profile/ProblemSolvingStats.tsx
import React from 'react';
import { TrendingUp } from 'lucide-react';

interface ProblemSolvingStatsProps {
  codingStats?: {
    totalSolved?: number;
    easy?: { solved?: number; assigned?: number };
    medium?: { solved?: number; assigned?: number };
    hard?: { solved?: number; assigned?: number };
  };
}

export function ProblemSolvingStats({ codingStats }: ProblemSolvingStatsProps) {
  return (
    <div className="glass p-8" style={{borderRadius: 'var(--radius-lg)'}}>
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 
            className="font-bold mb-2 flex items-center gap-3" 
            style={{fontSize: 'var(--text-3xl)', color: 'var(--foreground)'}}
          >
            <TrendingUp className="w-8 h-8" style={{color: 'var(--accent-primary)'}} />
            Problem Solving Stats
          </h2>
          <p style={{fontSize: 'var(--text-sm)', color: 'var(--text-secondary)'}}>Track your coding journey across all difficulty levels.</p>
        </div>
        <div className="text-right">
          <div 
            className="font-black" 
            style={{fontSize: 'var(--text-5xl)', color: 'var(--accent-primary)'}}
          >
            {codingStats?.totalSolved || 0}
          </div>
          <div 
            className="font-mono mt-1" 
            style={{fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em'}}
          >
            Total Solved
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="p-6 text-center hover-glow transition-all duration-200" style={{
          backgroundColor: 'var(--accent-secondary)', 
          borderRadius: 'var(--radius-lg)'
        }}>
          <div 
            className="font-bold mb-3" 
            style={{fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em'}}
          >
            Easy
          </div>
          <div 
            className="font-bold" 
            style={{fontSize: 'var(--text-3xl)', color: 'var(--foreground)'}}
          >
            {codingStats?.easy?.solved || 0}
          </div>
          <div 
            className="mt-2" 
            style={{fontSize: 'var(--text-xs)', color: 'var(--text-secondary)'}}
          >
            / {codingStats?.easy?.assigned || 0} assigned
          </div>
          <div 
            className="w-full rounded-full mt-3" 
            style={{height: 'var(--spacing-xs)', backgroundColor: 'var(--border)', borderRadius: 'var(--radius-full)'}}
          >
            <div
              className="rounded-full"
              style={{
          width: `${codingStats?.easy?.assigned ? ((codingStats.easy?.solved || 0) / codingStats.easy.assigned) * 100 : 0}%`,
                backgroundColor: 'var(--accent-primary)',
                borderRadius: 'var(--radius-full)'
              }}
            />
          </div>
        </div>

        <div className="p-6 text-center hover-glow transition-all duration-200" style={{
          backgroundColor: 'var(--accent-secondary)', 
          borderRadius: 'var(--radius-lg)'
        }}>
          <div 
            className="font-bold mb-3" 
            style={{fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em'}}
          >
            Medium
          </div>
          <div 
            className="font-bold" 
            style={{fontSize: 'var(--text-3xl)', color: 'var(--foreground)'}}
          >
            {codingStats?.medium?.solved || 0}
          </div>
          <div 
            className="mt-2" 
            style={{fontSize: 'var(--text-xs)', color: 'var(--text-secondary)'}}
          >
            / {codingStats?.medium?.assigned || 0} assigned
          </div>
          <div 
            className="w-full rounded-full mt-3" 
            style={{height: 'var(--spacing-xs)', backgroundColor: 'var(--border)', borderRadius: 'var(--radius-full)'}}
          >
            <div
              className="rounded-full"
              style={{
             width: `${codingStats?.medium?.assigned ? ((codingStats.medium?.solved || 0) / codingStats.medium.assigned) * 100 : 0}%`,
                height: '100%',
                backgroundColor: 'var(--accent-primary)',
                borderRadius: 'var(--radius-full)'
              }}
            />
          </div>
        </div>

        <div className="p-6 text-center hover-glow transition-all duration-200" style={{
          backgroundColor: 'var(--accent-secondary)', 
          borderRadius: 'var(--radius-lg)'
        }}>
          <div 
            className="font-bold mb-3" 
            style={{fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em'}}
          >
            Hard
          </div>
          <div 
            className="font-bold" 
            style={{fontSize: 'var(--text-3xl)', color: 'var(--foreground)'}}
          >
            {codingStats?.hard?.solved || 0}
          </div>
          <div 
            className="mt-2" 
            style={{fontSize: 'var(--text-xs)', color: 'var(--text-secondary)'}}
          >
            / {codingStats?.hard?.assigned || 0} assigned
          </div>
          <div 
            className="w-full rounded-full mt-3" 
            style={{height: 'var(--spacing-xs)', backgroundColor: 'var(--border)', borderRadius: 'var(--radius-full)'}}
          >
            <div
              className="rounded-full"
              style={{
              width: `${codingStats?.hard?.assigned ? ((codingStats.hard?.solved || 0) / codingStats.hard.assigned) * 100 : 0}%`,
                height: '100%',
                backgroundColor: 'var(--accent-primary)',
                borderRadius: 'var(--radius-full)'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}