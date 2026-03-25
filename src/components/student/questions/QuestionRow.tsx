import React from 'react';
import { CheckCircle2, Circle, ExternalLink, Code2 } from 'lucide-react';

interface QuestionRowProps {
  questionName: string;
  platform: string;
  level: string;
  type: string; // 'CLASSWORK' | 'HOMEWORK'
  isSolved: boolean;
  link?: string;
  topicName?: string;
}

export const QuestionRow: React.FC<QuestionRowProps> = ({
  questionName,
  platform,
  level,
  type,
  isSolved,
  link,
  topicName
}) => {

  const getLevelColor = (l: string) => {
    switch (l.toUpperCase()) {
      case 'EASY': return 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'MEDIUM': return 'text-amber-600 dark:text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'HARD': return 'text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-muted-foreground bg-secondary border-border';
    }
  };

  const getPlatformIcon = (p: string) => {
    // We stick to lucid-react for all per instruction, using Code2 as generic tech icon
    // Real SAAS might use specific SVGs, but Code2 works great identically
    return <Code2 className="w-3.5 h-3.5 mr-1" />;
  };

  const isHomework = type.toUpperCase() === 'HOMEWORK';

  return (
    <div className={`group flex flex-col sm:flex-row sm:items-center justify-between p-5 sm:p-6 rounded-2xl border transition-all duration-300 ${
      isSolved 
        ? 'bg-gradient-to-br from-emerald-50/80 to-emerald-100/40 dark:from-emerald-950/20 dark:to-emerald-900/10 border-emerald-200/60 dark:border-emerald-800/40 hover:shadow-lg hover:shadow-emerald-500/10' 
        : 'bg-gradient-to-br from-card to-card/60 dark:from-card dark:to-card/40 border-border/60 dark:border-border/40 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:scale-[1.01]'
    }`}>
      
      <div className="flex items-start sm:items-center gap-4 mb-3 sm:mb-0">
        <div className="mt-1 sm:mt-0 shrink-0">
          {isSolved ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-500 drop-shadow-sm" />
          ) : (
            <Circle className="w-6 h-6 text-muted-foreground/30 group-hover:text-primary/40 transition-colors" />
          )}
        </div>
        
        <div>
          <div className="flex flex-wrap items-center gap-2.5 mb-2">
            <h4 className={`text-[15px] font-semibold leading-tight ${
              isSolved 
                ? 'text-foreground/70 line-through decoration-emerald-500/60 decoration-2' 
                : 'text-foreground group-hover:text-primary/90 transition-colors'
            }`}>
              {questionName}
            </h4>
            {isHomework && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/15 dark:bg-primary/20 px-2 py-1 rounded-md border border-primary/20 dark:border-primary/30 shadow-sm">
                HW
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-2.5 text-[11px] font-medium uppercase tracking-wider font-mono">
            {topicName && (
              <>
                <span className="text-muted-foreground/80 bg-muted/50 px-2 py-1 rounded-md border border-border/50">
                  {topicName}
                </span>
                <span className="text-border/40 mx-1">•</span>
              </>
            )}
            <span className={`px-2.5 py-1 rounded-md border font-semibold shadow-sm ${getLevelColor(level)}`}>
              {level}
            </span>
            <span className="text-border/40 mx-1">•</span>
            <span className="text-muted-foreground/80 bg-muted/50 px-2 py-1 rounded-md border border-border/50 flex items-center">
              {getPlatformIcon(platform)}
              {platform}
            </span>
          </div>
        </div>
      </div>

      <div className="pl-10 sm:pl-0 flex items-center gap-3">
        {link ? (
          <a 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-[13px] font-semibold transition-all duration-200 shadow-md hover:shadow-lg ${
              isSolved 
                ? 'bg-muted/80 text-muted-foreground hover:bg-muted border border-border/50 hover:border-border/70'
                : 'bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02] border border-primary/20'
            }`}
          >
            {isSolved ? 'View Solution' : 'Solve Problem'} <ExternalLink className="w-4 h-4 ml-1" />
          </a>
        ) : (
          <span className="text-[12px] text-muted-foreground/60 italic px-4 py-3 bg-muted/50 border border-border/50 rounded-xl">
            No link provided
          </span>
        )}
      </div>

    </div>
  );
};
