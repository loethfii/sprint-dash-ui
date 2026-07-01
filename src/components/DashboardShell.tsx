import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Bell, ChevronRight, HelpCircle, Plus, Sun, Moon } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';

interface DashboardShellProps {
  activeTab: string;
  title: string;
  children: (isDarkMode: boolean) => React.ReactNode;
}

export default function DashboardShell({ activeTab, title, children }: DashboardShellProps) {
  // We keep a simple client state to pass down for canvas/SVG elements if needed,
  // defaulting to true (dark) on the server to match initial render and updating in useEffect.
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const savedTheme = localStorage.getItem('sprint-dash-theme');
    setIsDarkMode(savedTheme !== 'light');
  }, []);

  const handleToggleTheme = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);

    localStorage.setItem('sprint-dash-theme', nextDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', nextDark ? 'dark' : 'light');
    if (nextDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.backgroundColor = '#090a0f';
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.backgroundColor = '#f4f6f9';
      document.documentElement.style.colorScheme = 'light';
    }
  };

  return (
    <div className="flex h-screen font-sans overflow-hidden bg-[#f4f6f9] dark:bg-[#090a0f] text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Sidebar Component */}
      <Sidebar activeTab={activeTab} isDarkMode={isDarkMode} />

      {/* Main Container */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top Header */}
        <header className="h-16 border-b px-8 flex items-center justify-between shrink-0 border-slate-200 dark:border-[#1f212a] bg-white dark:bg-[#0d0e12] transition-colors duration-200">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-medium">Workspace</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <h1 className="text-sm font-semibold capitalize text-slate-800 dark:text-slate-200">
              {title}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleToggleTheme}
              className="p-2 border rounded-xl transition-colors cursor-pointer relative bg-slate-100 dark:bg-[#151720] border-slate-200 dark:border-[#232634] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#1a1c26]"
              title="Toggle Theme"
            >
              {/* Show Sun in dark theme, Moon in light theme using pure CSS class matching */}
              <Sun className="w-4.5 h-4.5 hidden dark:block" />
              <Moon className="w-4.5 h-4.5 block dark:hidden" />
            </button>
            
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 border rounded-xl transition-colors cursor-pointer relative bg-slate-100 dark:bg-[#151720] border-slate-200 dark:border-[#232634] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#1a1c26]"
              >
                <Bell className="w-4.5 h-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full ring-2 bg-indigo-600 dark:bg-indigo-500 ring-white dark:ring-[#0d0e12]"></span>
                )}
              </button>
              <NotificationDropdown
                isOpen={isNotificationsOpen}
                onClose={() => setIsNotificationsOpen(false)}
                onUnreadCountChange={setUnreadCount}
              />
            </div>

            <button className="p-2 border rounded-xl transition-colors cursor-pointer bg-slate-100 dark:bg-[#151720] border-slate-200 dark:border-[#232634] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#1a1c26]">
              <HelpCircle className="w-4.5 h-4.5" />
            </button>
            <div className="h-6 w-px bg-slate-200 dark:bg-[#1f212a]"></div>
            <a
              href="/task"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-[0_4px_12px_rgba(99,102,241,0.25)] active:scale-[0.98] cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Go to Board
            </a>
          </div>
        </header>

        {/* Dynamic Inner View */}
        {children(isDarkMode)}

      </main>
    </div>
  );
}

