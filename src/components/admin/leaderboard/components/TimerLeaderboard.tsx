"use client";
import React, { useState, useEffect } from 'react';
import { Clock, RefreshCw } from 'lucide-react';

interface TimerLeaderboardProps {
  lastUpdated?: string; // ISO timestamp from backend (last_calculated)
  refreshInterval?: number; // in hours, default 4
  onRefresh?: () => void; // Optional callback for manual refresh
}

export const TimerLeaderboard: React.FC<TimerLeaderboardProps> = ({ 
  lastUpdated,
  refreshInterval = 4, 
  onRefresh 
}) => {
  const [timeUntilRefresh, setTimeUntilRefresh] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Convert hours to milliseconds
  const refreshIntervalMs = refreshInterval * 60 * 60 * 1000;

  useEffect(() => {
    const calculateTimeUntilRefresh = () => {
      const now = Date.now();
      let lastUpdateTime: number;

      if (lastUpdated) {
        lastUpdateTime = new Date(lastUpdated).getTime();
      } else {
        // Fallback: assume last update was at the top of the current hour
        const currentHour = new Date().getHours();
        const today = new Date();
        today.setHours(currentHour, 0, 0, 0);
        lastUpdateTime = today.getTime();
      }

      // Calculate next refresh time = last updated + 4 hours
      const nextRefreshTime = lastUpdateTime + refreshIntervalMs;
      
      // Time remaining = next refresh - current time
      const timeRemaining = nextRefreshTime - now;

      // If time has passed, return 0 (refresh should happen now)
      return Math.max(0, timeRemaining);
    };

    const updateTimer = () => {
      const remaining = calculateTimeUntilRefresh();
      setTimeUntilRefresh(Math.max(0, remaining));

      // Auto-refresh when timer reaches zero
      if (remaining <= 1000 && onRefresh && !isRefreshing) {
        setIsRefreshing(true);
        onRefresh();
        setTimeout(() => setIsRefreshing(false), 2000); // Reset after 2 seconds
      }
    };

    // Update immediately
    updateTimer();

    // Update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [lastUpdated, refreshIntervalMs, onRefresh, isRefreshing]);

  // Format time display
  const formatTime = (milliseconds: number): string => {
    if (milliseconds <= 0) return 'Refreshing...';
    
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  // Get status color based on time remaining using theme colors
  const getStatusColor = (): string => {
    const totalSeconds = timeUntilRefresh / 1000;
    const intervalSeconds = refreshInterval * 3600;
    const percentageRemaining = (totalSeconds / intervalSeconds) * 100;

    if (percentageRemaining > 50) return 'text-primary';
    if (percentageRemaining > 25) return 'text-accent-primary';
    if (percentageRemaining > 10) return 'text-orange-500';
    return 'text-red-500';
  };

  // Format last updated time (show actual time)
  const formatLastUpdated = (): string => {
    if (!lastUpdated) return 'Unknown';
    
    const lastUpdateDate = new Date(lastUpdated);
    // Show actual time in readable format
    return lastUpdateDate.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate exact time remaining until next refresh
  const getTimeUntilNextRefresh = (): number => {
    if (!lastUpdated) return 0;
    
    const lastUpdateDate = new Date(lastUpdated);
    const now = new Date();
    
    // Next refresh time = last updated + 4 hours
    const nextRefreshTime = new Date(lastUpdateDate.getTime() + (4 * 60 * 60 * 1000));
    
    // Time remaining = next refresh - current time
    const timeRemainingMs = nextRefreshTime.getTime() - now.getTime();
    
    // If time has passed, return 0 (refresh should happen now)
    return Math.max(0, timeRemainingMs);
  };

  // Calculate hours elapsed since last update
  const getHoursElapsed = (): string => {
    if (!lastUpdated) return '0.00';
    
    const lastUpdateDate = new Date(lastUpdated);
    const now = new Date();
    const diffMs = now.getTime() - lastUpdateDate.getTime();
    const diffHours = diffMs / (1000 * 60 * 60); // Convert to hours
    
    return diffHours.toFixed(2);
  };

  return (
    <div className="flex items-center gap-2 text-xs font-mono">
      {/* Main timer display */}
      <div className="flex items-center gap-1.5 text-muted-foreground bg-muted/30 px-3 py-1.5 border border-border rounded-full shadow-sm">
        <Clock className={`w-3.5 h-3.5 ${getStatusColor()}`} />
        <span className="flex items-center gap-1">
          {isRefreshing ? (
            <>
              <RefreshCw className="w-3 h-3 animate-spin text-primary" />
              <span className="text-primary">Refreshing...</span>
            </>
          ) : (
            <>
              <span>Refresh in:</span>
              <span className={`font-bold ${getStatusColor()}`}>
                {formatTime(timeUntilRefresh)}
              </span>
            </>
          )}
        </span>
      </div>

      {/* Last updated info */}
      <div className="text-muted-foreground/70 text-[10px]">
        Updated at: {formatLastUpdated()} 
      </div>

      {/* Progress ring indicator */}
      <div className="relative w-4 h-4">
        <svg className="transform -rotate-90 w-4 h-4">
          <circle
            cx="8"
            cy="8"
            r="6"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            className="text-muted/30"
          />
        </svg>
      </div>
    </div>
  );
};
