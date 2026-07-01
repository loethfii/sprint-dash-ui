import React, { useState, useEffect, useRef } from 'react';
import { fetchNotifications, type Notification } from '../services/api';
import { Bell, CheckSquare, Clock, Loader2, AlertCircle } from 'lucide-react';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onUnreadCountChange: (count: number) => void;
}

export default function NotificationDropdown({ isOpen, onClose, onUnreadCountChange }: NotificationDropdownProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Initial load or when page changes
  const loadNotifications = async (targetPage: number, isInitial = false) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetchNotifications(targetPage, 10);
      const newItems = response.data || [];
      
      if (isInitial) {
        setNotifications(newItems);
        // Calculate unread count (pending status)
        const pendingCount = newItems.filter(n => n.status === 'pending').length;
        onUnreadCountChange(pendingCount);
      } else {
        setNotifications(prev => {
          // Avoid duplicate IDs
          const existingIds = new Set(prev.map(item => item.id));
          const filteredNew = newItems.filter(item => !existingIds.has(item.id));
          return [...prev, ...filteredNew];
        });
      }

      if (response.pagination) {
        setHasMore(response.pagination.page < response.pagination.totalPages);
      } else {
        setHasMore(newItems.length === 10);
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  // Fetch initial notifications on mount/open
  useEffect(() => {
    if (isOpen) {
      setPage(1);
      setHasMore(true);
      loadNotifications(1, true);
    }
  }, [isOpen]);

  // Fetch initial notification count periodically or once on mount to update badge
  useEffect(() => {
    // Only fetch for badge if not open
    if (!isOpen) {
      fetchNotifications(1, 10)
        .then(response => {
          const newItems = response.data || [];
          const pendingCount = newItems.filter(n => n.status === 'pending').length;
          onUnreadCountChange(pendingCount);
        })
        .catch(err => console.error('Error pre-fetching notifications count', err));
    }
  }, []);

  const handleScroll = () => {
    if (!scrollContainerRef.current || loading || !hasMore) return;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    // Trigger load more when 15px from bottom
    if (scrollHeight - scrollTop <= clientHeight + 15) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadNotifications(nextPage);
    }
  };

  if (!isOpen) return null;

  const formatRelativeTime = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString();
    } catch (e) {
      return '';
    }
  };

  const getNotificationText = (notif: Notification) => {
    if (notif.type === 'task_assigned') {
      return (
        <span>
          You have been assigned to task{' '}
          <strong className="font-semibold text-slate-900 dark:text-white">
            {notif.task?.title || 'Unknown Task'}
          </strong>
        </span>
      );
    }
    
    // Capitalize type as fallback
    const humanType = notif.type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return (
      <span>
        {humanType}{' '}
        {notif.task?.title && (
          <>
            on{' '}
            <strong className="font-semibold text-slate-900 dark:text-white">
              {notif.task.title}
            </strong>
          </>
        )}
      </span>
    );
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border shadow-xl bg-white dark:bg-[#0d0e12] border-slate-200 dark:border-[#232634] overflow-hidden z-50 flex flex-col max-h-120 animate-in fade-in slide-in-from-top-2 duration-200"
      style={{ top: '100%' }}
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 dark:border-[#1f212a]/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-indigo-500" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">Notifications</h3>
        </div>
        {notifications.length > 0 && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400">
            {notifications.length} Total
          </span>
        )}
      </div>

      {/* Notification List Container */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto max-h-87.5 divide-y divide-slate-100 dark:divide-[#1f212a]/50 custom-scrollbar"
      >
        {notifications.length === 0 && !loading && !error && (
          <div className="p-8 text-center flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-[#151720] flex items-center justify-center text-slate-400 dark:text-slate-600">
              <Bell className="w-5 h-5" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">No notifications found</p>
          </div>
        )}

        {notifications.map((notif) => {
          const isPending = notif.status === 'pending';
          return (
            <div
              key={notif.id}
              className={`p-4 flex gap-3 transition-colors hover:bg-slate-50 dark:hover:bg-[#151720]/50 relative ${
                isPending ? 'bg-indigo-50/20 dark:bg-indigo-500/5' : ''
              }`}
            >
              {/* Status Indicator Dot */}
              {isPending && (
                <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-500"></span>
              )}

              {/* Icon Container */}
              <div className="shrink-0 w-8 h-8 rounded-xl bg-slate-100 dark:bg-[#1a1c26] text-slate-600 dark:text-slate-400 flex items-center justify-center">
                {notif.type === 'task_assigned' ? (
                  <CheckSquare className="w-4 h-4 text-indigo-500" />
                ) : (
                  <Bell className="w-4 h-4" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <div className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 pr-3">
                  {getNotificationText(notif)}
                </div>
                
                {notif.task?.description && (
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                    {notif.task.description}
                  </p>
                )}

                <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-400 dark:text-slate-500">
                  <Clock className="w-3 h-3" />
                  <span>{formatRelativeTime(notif.createdAt)}</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Spinner */}
        {loading && (
          <div className="p-4 flex justify-center items-center gap-2 text-slate-500">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
            <span className="text-xs">Loading notifications...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 flex items-center gap-2 text-rose-500 bg-rose-500/5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="text-xs truncate">{error}</span>
          </div>
        )}

        {/* End of list */}
        {!hasMore && notifications.length > 0 && (
          <div className="p-3 text-center text-[10px] text-slate-400 dark:text-slate-600">
            You've reached the end of your notifications.
          </div>
        )}
      </div>
    </div>
  );
}
