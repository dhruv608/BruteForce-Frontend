// src/components/student/profile/RecentActivity.tsx
import React from 'react';
import { Clock, Calendar, Target, CheckCircle2 } from 'lucide-react';
import { RecentActivity as RecentActivityType } from '@/types/student';

interface RecentActivityProps {
  recentActivity?: RecentActivityType[];
}

export function RecentActivity({ recentActivity }: RecentActivityProps) {
  return (
    <div className="glass p-8" style={{borderRadius: 'var(--radius-lg)'}}>
      <h3 
        className="font-bold mb-6 flex items-center gap-2" 
        style={{fontSize: 'var(--text-base)', color: 'var(--foreground)'}}
      >
        <Clock className="w-5 h-5" style={{color: 'var(--accent-primary)'}} />
        Recent Activity
      </h3>

      {recentActivity && recentActivity.length > 0 ? (
        <div className="space-y-4">
          {recentActivity.map((activity: RecentActivityType, idx: number) => {
            const levelBg = 'var(--accent-secondary)';
            const levelColor = 'var(--text-secondary)';

            return (
              <div 
                key={idx} 
                className="flex items-center justify-between p-5 hover-glow transition-all duration-200" 
                style={{
                  backgroundColor: levelBg,
                  borderRadius: 'var(--radius-lg)',
                  border: `1px solid var(--border)`
                }}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center" 
                    style={{
                      backgroundColor: 'var(--accent-primary)',
                      color: 'var(--primary-foreground)',
                      borderRadius: 'var(--radius-md)'
                    }}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div 
                      className="font-semibold cursor-pointer transition-colors" 
                      style={{fontSize: 'var(--text-base)', color: 'var(--foreground)'}}
                      onClick={() => activity.question_link && window.open(activity.question_link, '_blank', 'noopener,noreferrer')}
                    >
                      {activity.question_name}
                    </div>
                    <div 
                      className="font-mono mt-1 flex items-center gap-4" 
                      style={{fontSize: 'var(--text-xs)', color: 'var(--text-secondary)'}}
                    >
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(activity.solvedAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(activity.solvedAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div 
                  className="font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg" 
                  style={{
                    fontSize: 'var(--text-xs)',
                    backgroundColor: levelBg,
                    color: levelColor,
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  {activity.difficulty}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12" style={{color: 'var(--text-secondary)'}}>
          <Target className="w-12 h-12 mx-auto mb-4" style={{color: 'var(--text-secondary)'}} />
          <div style={{fontSize: 'var(--text-base)'}}>No recent submissions.</div>
          <div style={{fontSize: 'var(--text-sm)', marginTop: 'var(--spacing-sm)'}}>Start solving problems to see your activity here!</div>
        </div>
      )}
    </div>
  );
}