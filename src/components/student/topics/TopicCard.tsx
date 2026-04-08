"use client";

import React from "react";
import Link from "next/link";
import { Calendar, CheckCircle2, Lock } from "lucide-react";

interface TopicCardProps {
  topicSlug: string;
  topicName: string;
  photoUrl?: string;
  totalQuestions: number;
  solvedQuestions: number;
  totalClasses: number;
  progressPercentage?: number;
}

export function TopicCard({
  topicSlug,
  topicName,
  photoUrl,
  totalQuestions,
  solvedQuestions,
  totalClasses,
  progressPercentage,
}: TopicCardProps) {
  const progress = progressPercentage !== undefined 
    ? progressPercentage 
    : (totalQuestions === 0 ? 0 : (solvedQuestions / totalQuestions) * 100);

  const isLocked = totalClasses === 0;

  const CardContent = () => (
   <div
  className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-xl transition-all duration-300 glass
  ${isLocked ? 'opacity-80 cursor-not-allowed' : 'hover:shadow-primary/10'}
`}
>

     {/* LOCK OVERLAY */}
{isLocked && (
  <div className="absolute inset-0 bg-background/70 backdrop-blur-md z-10 flex items-center justify-center rounded-2xl border border-border/50">
    <div className="flex flex-col items-center gap-2 text-center">
      <Lock className="w-7 h-7 text-primary/80" />
      <span className="text-sm font-medium text-foreground">
        {topicName}
      </span>
      <span className="text-xs text-muted-foreground">
        Locked
      </span>
    </div>
  </div>
)}

      {/* IMAGE */}
      <div className="relative h-[150px] overflow-hidden border-b border-border/50">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={topicName}
            className={`w-full h-full object-cover transition-transform duration-500 ${
  isLocked ? 'opacity-40 scale-100' : 'group-hover:scale-105'
}`}
          />
        ) : (
          <div className={`w-full h-full ${isLocked ? 'bg-muted/50' : 'bg-muted'}`} />
        )}

        
      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col gap-3">

        {/* TITLE */}
        <h3 className={`text-base font-semibold line-clamp-1 transition-colors ${
          isLocked ? 'text-muted-foreground' : 'text-foreground group-hover:text-primary'
        }`}>
          {topicName}
        </h3>

        {/* STATS */}
        <div className="flex items-center justify-between text-[12px] text-muted-foreground">

          {/* CLASSES */}
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{totalClasses} classes</span>
          </div>

          {/* QUESTIONS */}
          <div className="px-2 py-0.5 rounded-2xl bg-muted/40 border border-border/50">
            {solvedQuestions}/{totalQuestions}
          </div>
        </div>

        {/* PROGRESS */}
        {!isLocked && (
  <div>
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                isLocked ? 'bg-muted-foreground/30' : 'bg-primary shadow-[0_0_6px_rgba(34,197,94,0.4)]'
              }`}
              style={{ width: `${isLocked ? 0 : progress}%` }}
            />
          </div>

          <div className="mt-1 text-right text-[11px] text-muted-foreground">
            {isLocked ? '0%' : `${Math.round(progress)}%`}
          </div>
        </div>)}

      </div>
    </div>
  );

  return (
    <>
      {isLocked ? (
        <div className="glass rounded-2xl block cursor-not-allowed opacity-75">
          <CardContent />
        </div>
      ) : (
        <Link href={`/topics/${topicSlug}`} className="glass rounded-2xl block">
          <CardContent />
        </Link>
      )}
    </>
  );
}
