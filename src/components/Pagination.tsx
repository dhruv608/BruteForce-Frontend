import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  showLimitSelector?: boolean;
  loading?: boolean;
}

export function Pagination({ currentPage, totalItems, limit, onPageChange, onLimitChange, showLimitSelector = false, loading = false }: PaginationProps) {
  const totalPages = Math.ceil(totalItems / limit) || 1;

  // Shimmer loading state
  if (loading) {
    return (
      <div className="flex items-center justify-between px-4 py-3 border-t">
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-32" />
          {showLimitSelector && (
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-[70px]" />
              <Skeleton className="h-4 w-12" />
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-8 rounded" />
          <div className="flex items-center space-x-1">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-8 w-8 rounded" />
            ))}
          </div>
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </div>
    );
  }

  // Always show pagination when there's data
  // if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t bg-background/50">
      <div className="flex items-center gap-6">
        <div className="text-sm text-muted-foreground font-medium">
          Showing <span className="text-foreground font-semibold">{(currentPage - 1) * limit + 1}</span> to <span className="text-foreground font-semibold">{Math.min(currentPage * limit, totalItems)}</span> of <span className="text-foreground font-semibold">{totalItems}</span> results
        </div>
        {showLimitSelector && onLimitChange && (
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted-foreground font-medium">Show</span>
            <Select 
              value={String(limit)} 
              onValueChange={(value) => {
                onLimitChange(Number(value));
                onPageChange(1); // Reset to first page when changing limit
              }}
            >
              <SelectTrigger className="w-[70px] h-9 border-border/50 bg-background hover:bg-accent/50 transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-border/50">
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-muted-foreground font-medium">per page</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-9 px-3 border-border/50 hover:bg-accent/50 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center space-x-1">
          {Array.from({ length: totalPages }).map((_, i) => {
            const page = i + 1;
            const isActive = page === currentPage;
            
            if (
              totalPages > 5 &&
              page !== 1 &&
              page !== totalPages &&
              (page < currentPage - 1 || page > currentPage + 1)
            ) {
              if (page === currentPage - 2 || page === currentPage + 2) {
                return <span key={page} className="px-2 text-muted-foreground text-sm font-medium">...</span>;
              }
              return null;
            }

            return (
              <Button
                key={page}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page)}
                className={`h-9 w-9 text-sm font-medium transition-all ${
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "border-border/50 hover:bg-accent/50"
                }`}
              >
                {page}
              </Button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-9 px-3 border-border/50 hover:bg-accent/50 transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
