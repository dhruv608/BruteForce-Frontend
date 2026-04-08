"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Bookmark as BookmarkIcon, ExternalLink, Edit2, Trash2, CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/Pagination';
import { bookmarkService, Bookmark, BookmarksResponse } from '@/services/bookmark.service';
import { BookmarkModal } from '@/components/student/bookmarks/BookmarkModal';
import { EditBookmarkModal } from '@/components/student/bookmarks/EditBookmarkModal';
import { DeleteModal } from '@/components/DeleteModal';
import { LeetCodeIcon, GeeksforGeeksIcon } from '@/components/platform/PlatformIcons';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [pagination, setPagination] = useState<BookmarksResponse['pagination']>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'recent' | 'old' | 'solved' | 'unsolved'>('recent');
  const [filterBy, setFilterBy] = useState<'all' | 'solved' | 'unsolved'>('all');
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deletingBookmark, setDeletingBookmark] = useState<Bookmark | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editDescription, setEditDescription] = useState('');
  const [updatingBookmark, setUpdatingBookmark] = useState(false);
  const isFetching = useRef(false);
  const lastFetchParams = useRef({ page: 1, limit: 10, sort: 'recent', filter: 'all' });

  const fetchBookmarks = async () => {
    const currentParams = { page: pagination.page, limit: pagination.limit, sort: sortBy, filter: filterBy };

    // Skip if already fetching with same params
    if (isFetching.current) {
      const sameParams =
        lastFetchParams.current.page === pagination.page &&
        lastFetchParams.current.limit === pagination.limit &&
        lastFetchParams.current.sort === sortBy &&
        lastFetchParams.current.filter === filterBy;

      if (sameParams) {
        return;
      }
    }

    isFetching.current = true;
    lastFetchParams.current = currentParams;

    try {
      setLoading(true);
      const response = await bookmarkService.getBookmarks({
        page: pagination.page,
        limit: pagination.limit,
        sort: sortBy,
        filter: filterBy
      });
      setBookmarks(response.bookmarks);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Failed to fetch bookmarks:', error);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, [pagination.page, pagination.limit, sortBy, filterBy]);

  const handleDeleteBookmark = (bookmark: Bookmark) => {
    setDeletingBookmark(bookmark);
    setShowDeleteModal(true);
  };

  const confirmDeleteBookmark = async () => {
    if (!deletingBookmark) return;

    try {
      await bookmarkService.deleteBookmark(deletingBookmark.question.id);
      fetchBookmarks();
    } catch (error) {
      console.error('Failed to delete bookmark:', error);
    } finally {
      setShowDeleteModal(false);
      setDeletingBookmark(null);
    }
  };

  const handleEditBookmark = (bookmark: Bookmark) => {
    setEditingBookmark(bookmark);
    setEditDescription(bookmark.description || '');
    setShowEditModal(true);
  };

  const handleUpdateBookmark = async (description: string) => {
    if (!editingBookmark) return;

    try {
      setUpdatingBookmark(true);
      await bookmarkService.updateBookmark(editingBookmark.question.id, description);
      setShowEditModal(false);
      setEditingBookmark(null);
      fetchBookmarks();
    } catch (error) {
      console.error('Failed to update bookmark:', error);
    } finally {
      setUpdatingBookmark(false);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level.toUpperCase()) {
      case 'EASY': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'MEDIUM': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'HARD': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getPlatformShort = (platform: string) => {
    if (!platform) return '';
    if (platform.toLowerCase().includes('leetcode')) return 'LeetCode';
    if (platform.toLowerCase().includes('gfg')) return 'GeeksForGeeks';
    return platform;
  };

  const getPlatformIcon = (platform: string) => {
    if (!platform) return null;
    if (platform.toLowerCase().includes('leetcode')) {
      return <LeetCodeIcon className="w-4 h-4 text-yellow-500" />;
    }
    if (platform.toLowerCase().includes('gfg')) {
      return <GeeksforGeeksIcon className="w-4 h-4 text-green-600" />;
    }
    return null;
  };

  return (
    <div className=" container mx-auto px-4 py-8 max-w-325 xl:max-w-275 2xl:max-w-325">
      {/* HEADER */}
      <div className="mb-8 px-5 py-4 backdrop-blur-sm rounded-2xl glass">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <BookmarkIcon className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">My <span className='text-primary'>Bookmarks</span></h1>
        </div>
        <p className="text-muted-foreground ml-11">Your saved questions for practice</p>
      </div>

      {/* FILTERS */}
      <div className="glass backdrop-blur-sm rounded-2xl  p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex items-center gap-3">
            <label className="text-m font-medium text-foreground whitespace-nowrap">Sort By:</label>
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-[140px] bg-transparent border border-border/40">
                <SelectValue placeholder="Select sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recent</SelectItem>
                <SelectItem value="old">Old</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-m font-medium text-foreground whitespace-nowrap">Filter By:</label>
            <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
              <SelectTrigger className="w-[140px]  bg-transparent border border-border/40">
                <SelectValue placeholder="Select filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="solved">Solved</SelectItem>
                <SelectItem value="unsolved">Unsolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* BOOKMARKS LIST */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 rounded-2xl border border-border animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="text-center py-12">
          <BookmarkIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No bookmarks yet</h3>
          <p className="text-muted-foreground">Start bookmarking questions to see them here</p>
        </div>
      ) : (
        <div className="space-y-3 p-5 rounded-2xl glass  backdrop-blur-md">

          {bookmarks.map((bookmark) => {

            const platform = bookmark.question.platform?.toLowerCase();

            const getPlatformData = () => {
              if (platform?.includes("leetcode")) {
                return {
                  name: "LeetCode",
                  icon: <LeetCodeIcon className="w-3.5 h-3.5 text-orange-500" />
                };
              }
              if (platform?.includes("gfg")) {
                return {
                  name: "GeeksForGeeks",
                  icon: <GeeksforGeeksIcon className="w-3.5 h-3.5 text-green-500" />
                };
              }
              return {
                name: bookmark.question.platform,
                icon: null
              };
            };

            const platformData = getPlatformData();

            return (
              <div
                key={bookmark.id}
                className="flex items-center justify-between  rounded-2xl border border-border/60 px-6 py-4 hover:border-primary/30 transition-all duration-300"
              >

                {/* LEFT */}
                <div className="flex flex-col gap-2 flex-1">

                  {/* TITLE */}
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-foreground">
                      {bookmark.question.question_name}
                    </h3>

                    {bookmark.isSolved && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>

                  {/* META BADGES */}
                  <div className="flex items-center gap-2 flex-wrap text-[11px]">

                    {/* LEVEL */}
                    <span className={`px-2 py-0.5 rounded-2xl border font-semibold ${getLevelColor(bookmark.question.level)}`}>
                      {bookmark.question.level}
                    </span>

                    {/* PLATFORM (ICON + TEXT 🔥) */}
                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-2xl border border-border bg-muted text-muted-foreground font-medium">
                      {platformData.icon}
                      {platformData.name}
                    </span>

                  </div>

                  {/* DESCRIPTION */}
                  {bookmark.description && (
                    <p className="text-xs text-muted-foreground">
                      {bookmark.description}
                    </p>
                  )}

                  {/* FOOTER */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">

                    <a
                      href={bookmark.question.question_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Solve
                    </a>

                    <span>
                      Bookmarked on{" "}
                      {new Date(bookmark.created_at).toLocaleDateString()}
                    </span>

                  </div>

                </div>

                {/* RIGHT ACTIONS */}
                <div className="flex items-center gap-2 ml-4">

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditBookmark(bookmark)}
                    disabled={updatingBookmark}
                    className="p-2 h-9 w-9 rounded-2xl hover:bg-accent/50"
                  >
                    {updatingBookmark ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Edit2 className="w-4 h-4" />
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteBookmark(bookmark)}
                    className="p-2 h-9 w-9 rounded-2xl hover:bg-destructive/10 text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* PAGINATION */}
      {bookmarks.length > 0 && (
        <div className="mt-8">
          <Pagination
            currentPage={pagination.page}
            totalItems={pagination.total}
            limit={pagination.limit}
            onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
          />
        </div>
      )}

      {/* EDIT MODAL */}
      {editingBookmark && (
        <EditBookmarkModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingBookmark(null);
          }}
          bookmark={editingBookmark}
          onSubmit={handleUpdateBookmark}
          loading={updatingBookmark}
        />
      )}

      {/* DELETE MODAL */}
      {deletingBookmark && (
        <DeleteModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setDeletingBookmark(null);
          }}
          onConfirm={confirmDeleteBookmark}
          submitting={false}
          title="Delete Bookmark"
          itemName={deletingBookmark.question.question_name}
          warningText="This will permanently remove this bookmark from your saved questions. You can always bookmark it again later."
        />
      )}
    </div>
  );
}
