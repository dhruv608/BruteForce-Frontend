"use client";
import React from 'react';
import Link from 'next/link';
import { CalendarDays, Flame } from 'lucide-react';
import { TableCell, TableRow } from "@/components/ui/table";

interface LeaderboardTableRowProps {
  entry: any;
  index: number;
  selectedCity: string;
}

export const LeaderboardTableRow: React.FC<LeaderboardTableRowProps> = ({ entry, index, selectedCity }) => {
  // Determine rank value and label based on city selection
  const isGlobalView = selectedCity === 'All Cities';
  const rankValue = isGlobalView ? (entry.global_rank || 0) : (entry.city_rank || 0);
  const rankLabel = isGlobalView ? 'Global Rank' : 'City Rank';
  const hardComp = Number(entry.hard_completion || 0);
  const medComp = Number(entry.medium_completion || 0);
  const easyComp = Number(entry.easy_completion || 0);
  const totalCompletion = ((hardComp + medComp + easyComp) / 3).toFixed(1);

  return (
    <TableRow className={`group hover:bg-muted/40 transition-all duration-200 hover:scale-[1.002] cursor-default ${Number(rankValue) <= 3 && "bg-primary/5 hover:bg-primary/10"}`}>
      <TableCell className="text-center">
        <span className={`text-base font-bold ${Number(rankValue) === 1 ? 'text-yellow-500' : Number(rankValue) === 2 ? 'text-slate-400' : Number(rankValue) === 3 ? 'text-amber-600' : 'text-muted-foreground'}`}>
          {rankValue}
        </span>
      </TableCell>

      <TableCell>
        <div className="flex flex-row items-center gap-3">
          <div className={`w-10 h-10 rounded-full overflow-hidden border ${Number(rankValue) === 1 ? 'border-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 'border-border'} shadow-sm group-hover:border-primary/50 transition-colors`}>
            <img src={entry.profile_image_url || `https://api.dicebear.com/7.x/initials/svg?seed=${entry.username}&backgroundColor=1e293b&textColor=f8fafc`} alt={entry.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <Link href={`/admin/students/${entry.username}`} className="font-semibold text-foreground hover:text-primary transition-colors">
              {entry.name}
            </Link>
            <span className="text-xs text-muted-foreground font-mono">@{entry.username}</span>
          </div>
        </div>
      </TableCell>

      <TableCell>
        <div className="flex flex-col gap-0.5 items-start">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full border border-border bg-muted/60 text-foreground/80">{entry.city_name}</span>
          <span className="text-[11px] text-muted-foreground opacity-80 flex items-center gap-1 mt-1 font-medium"><CalendarDays className="w-3 h-3" /> Batch {entry.batch_year}</span>
        </div>
      </TableCell>

      <TableCell className="text-center">
        <span className="font-black text-primary text-xl tracking-tight drop-shadow-sm">{entry.score}</span>
      </TableCell>

      <TableCell>
        <div className="w-full flex flex-col gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-2 text-[10px] w-full border-border/50 pb-0.5 mb-0.5 justify-between">
            <span className="font-bold text-foreground">Total: {totalCompletion}%</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] w-full">
            <span className="w-3 font-bold text-red-500/90 text-right">H</span>
            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-red-500" style={{ width: `${hardComp}%` }} />
            </div>
            <span className="w-6 text-right font-mono font-medium text-red-500/70">{Math.round(hardComp)}%</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] w-full">
            <span className="w-3 font-bold text-orange-500/90 text-right">M</span>
            <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-orange-500" style={{ width: `${medComp}%` }} />
            </div>
            <span className="w-6 text-right font-mono font-medium text-orange-500/70">{Math.round(medComp)}%</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] w-full">
            <span className="w-3 font-bold text-green-500/90 text-right">E</span>
            <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-green-500" style={{ width: `${easyComp}%` }} />
            </div>
            <span className="w-6 text-right font-mono font-medium text-green-500/70">{Math.round(easyComp)}%</span>
          </div>
        </div>
      </TableCell>

      <TableCell className="text-center">
        <div className="flex justify-center">
          {entry.max_streak > 0 ? (
            <div className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm transition-all duration-300 group-hover:scale-110 ${entry.max_streak >= 5 ? 'bg-red-500/15 text-red-500 border border-red-500/30' : 'bg-orange-500/15 text-orange-500 border border-orange-500/30'}`}>
              <Flame className={`w-3.5 h-3.5 ${entry.max_streak >= 5 ? 'animate-bounce text-red-500' : 'text-orange-500'}`} />
              {entry.max_streak}
            </div>
          ) : (
            <span className="text-muted-foreground/50 text-xs font-medium">-</span>
          )}
        </div>
      </TableCell>

      <TableCell className="text-center">
        <div className="flex flex-col items-center gap-1">
          <span className="font-bold text-foreground text-sm tracking-tight">{entry.total_solved} <span className="text-[10px] text-muted-foreground font-normal">solved</span></span>
        </div>
      </TableCell>
    </TableRow>
  );
};
