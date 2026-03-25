"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { studentPracticeService, PracticeFilters } from '@/services/student/practice.service';
import { QuestionRow } from '@/components/student/questions/QuestionRow';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pagination } from '@/components/Pagination';

export default function PracticePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize filters from URL
  const [filters, setFilters] = useState<PracticeFilters>({
    search: searchParams.get('search') || '',
    topic: searchParams.get('topic') || '',
    level: searchParams.get('level') || '',
    platform: searchParams.get('platform') || '',
    type: searchParams.get('type') || '',
    solved: searchParams.get('solved') || '',
    page: Number(searchParams.get('page')) || 1,
    limit: 10
  });

  const [questions, setQuestions] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterOptions, setFilterOptions] = useState<{
    topics: any[];
    levels: string[];
    platforms: string[];
    types: string[];
  }>({
    topics: [],
    levels: [],
    platforms: [],
    types: []
  });

  // Check if any filters are active (excluding page and limit)
  const hasActiveFilters = !!(filters.search || filters.topic || filters.level || filters.platform || filters.type || filters.solved);

  // Sync state to URL and fetch
  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await studentPracticeService.getQuestions(filters);
      console.log('Practice API Response:', data); // Debug log
      setQuestions(data.questions || []);
      
      // Extract total items from backend response structure
      const totalItemsCount = data.pagination?.totalQuestions || data.totalItems || data.totalCount || 0;
      const totalPagesCount = data.pagination?.totalPages || data.totalPages || 1;
      
      console.log('Pagination Data:', { totalItemsCount, totalPagesCount }); // Debug log
      
      setTotalPages(totalPagesCount);
      setTotalItems(totalItemsCount);
      
      // Set filter options from API response
      if (data.filters) {
        setFilterOptions({
          topics: data.filters.topics || [],
          levels: data.filters.levels || [],
          platforms: data.filters.platforms || [],
          types: data.filters.types || []
        });
      }

      // Update URL safely
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, val]) => {
        if (val) params.set(key, String(val));
      });
      router.replace(`?${params.toString()}`, { scroll: false });
      
    } catch (e) {
      console.error("Failed to fetch practice questions", e);
    } finally {
      setLoading(false);
    }
  }, [filters, router]);

  useEffect(() => {
    // Debounce search text changes
    const timeout = setTimeout(() => {
      fetchQuestions();
    }, 400);
    return () => clearTimeout(timeout);
  }, [filters, fetchQuestions]);

  const handleFilterChange = (key: keyof PracticeFilters, value: any) => {
    setFilters(prev => ({ 
      ...prev, 
      [key]: value,
      // Reset to page 1 only when changing filters other than page
      ...(key !== 'page' ? { page: 1 } : {})
    }));
  };

  const clearFilters = () => {
    setFilters({ search: '', topic: '', level: '', platform: '', type: '', solved: '', page: 1, limit: 10 });
  };

  // Extract unique topics from the current list (Ideally this comes from a dedicated endpoint in a real app)
  // But for MVP, we just use static options or let them search.

  return (
    <div className="flex flex-col mx-auto max-w-[1100px] w-full pb-12 px-7 sm:px-10 lg:px-12 pt-8">
      
      <div className="mb-8">
        <h1 className="font-serif italic text-3xl font-bold text-foreground mb-2">
          Practice <span className="bg-gradient-to-br from-primary to-amber-600 bg-clip-text text-transparent">Problems</span>
        </h1>
        <p className="text-[14px] text-muted-foreground">
          Filter and search through all assigned questions to master specific concepts.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="bg-gradient-to-br from-card to-card/80 border border-border/60 p-6 rounded-2xl mb-6 shadow-lg backdrop-blur-sm">
        
        {/* Search */}
        <div className="relative mb-4">
          <div className="flex bg-background/80 border border-border/60 rounded-xl p-1 overflow-hidden focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary/40 transition-all shadow-sm">
            <Search className="w-4 h-4 text-muted-foreground/70 ml-4 mr-3 flex-shrink-0" />
            <input 
              type="text" 
              placeholder="Search questions by name or topic..." 
              className="flex-1 bg-transparent border-none text-[14px] outline-none px-2 py-3 placeholder:text-muted-foreground/50"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {/* Topic Filter */}
          <Select 
            value={filters.topic || "ALL"} 
            onValueChange={(val) => handleFilterChange('topic', val === "ALL" ? "" : val)}
          >
            <SelectTrigger className="bg-background/80 border-border/60 hover:bg-background/90 hover:border-primary/40 focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all text-[13px] h-10 shadow-sm">
              <SelectValue placeholder="All Topics" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Topics</SelectItem>
              {filterOptions.topics.map((topic: any) => (
                <SelectItem key={topic.id} value={topic.slug}>
                  {topic.topic_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Level Filter */}
          <Select 
            value={filters.level || "ALL"} 
            onValueChange={(val) => handleFilterChange('level', val === "ALL" ? "" : val)}
          >
            <SelectTrigger className="bg-background/80 border-border/60 hover:bg-background/90 hover:border-primary/40 focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all text-[13px] h-10 shadow-sm">
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Levels</SelectItem>
              {filterOptions.levels.map((level: string) => (
                <SelectItem key={level} value={level}>
                  {level.charAt(0) + level.slice(1).toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Platform Filter */}
          <Select 
            value={filters.platform || "ALL"} 
            onValueChange={(val) => handleFilterChange('platform', val === "ALL" ? "" : val)}
          >
            <SelectTrigger className="bg-background/80 border-border/60 hover:bg-background/90 hover:border-primary/40 focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all text-[13px] h-10 shadow-sm">
              <SelectValue placeholder="All Platforms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Platforms</SelectItem>
              {filterOptions.platforms.map((platform: string) => (
                <SelectItem key={platform} value={platform}>
                  {platform.charAt(0) + platform.slice(1).toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Type Filter */}
          <Select 
            value={filters.type || "ALL"} 
            onValueChange={(val) => handleFilterChange('type', val === "ALL" ? "" : val)}
          >
            <SelectTrigger className="bg-background/80 border-border/60 hover:bg-background/90 hover:border-primary/40 focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all text-[13px] h-10 shadow-sm">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              {filterOptions.types.map((type: string) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0) + type.slice(1).toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Solved Status Filter */}
          <Select 
            value={filters.solved || "ALL"} 
            onValueChange={(val) => handleFilterChange('solved', val === "ALL" ? "" : val)}
          >
            <SelectTrigger className="bg-background/80 border-border/60 hover:bg-background/90 hover:border-primary/40 focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all text-[13px] h-10 shadow-sm">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="true">Solved ✓</SelectItem>
              <SelectItem value="false">Unsolved</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
          <button 
            onClick={clearFilters}
            className="bg-gradient-to-r from-red-500/10 to-red-600/10 hover:from-red-500/20 hover:to-red-600/20 border border-red-500/30 hover:border-red-500/50 text-red-600 dark:text-red-400 rounded-lg px-4 py-2.5 text-[12.5px] font-semibold transition-all duration-200 shadow-sm hover:shadow-md hover:scale-[1.02]"
          >
            Clear Filters
          </button>
        )}
        </div>
      </div>

      {/* Results List */}
      <div className="flex flex-col gap-3 min-h-[400px]">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
             <div className="animate-pulse flex gap-2 text-primary font-mono text-[13px]">
               Loading<span className="animate-bounce inline-block">.</span><span className="animate-bounce inline-block" style={{animationDelay: '0.1s'}}>.</span><span className="animate-bounce inline-block" style={{animationDelay: '0.2s'}}>.</span>
             </div>
          </div>
        ) : questions.length > 0 ? (
          questions.map((q: any, idx) => (
            <div key={q.id} className="animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${idx * 20}ms`, animationFillMode: 'both' }}>
              <QuestionRow 
                questionName={q.question_name}
                platform={q.platform}
                level={q.level}
                type={q.type}
                isSolved={q.isSolved || false}
                link={q.question_link}
                topicName={q.topic?.topic_name}
              />
            </div>
          ))
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground bg-card rounded-2xl border border-border border-dashed p-10">
            <Search className="w-10 h-10 mb-4 opacity-50 text-muted-foreground" />
            <div className="font-semibold text-foreground mb-1">No questions found</div>
            <div className="text-[13px]">Try adjusting your search or filters.</div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && questions.length > 0 && (
        <div className="mt-8">
          <Pagination 
            currentPage={filters.page || 1}
            totalItems={totalItems}
            limit={filters.limit || 10}
            onPageChange={(page) => handleFilterChange('page', page)}
            onLimitChange={(limit) => handleFilterChange('limit', limit)}
            showLimitSelector={true}
          />
        </div>
      )}

    </div>
  );
}
