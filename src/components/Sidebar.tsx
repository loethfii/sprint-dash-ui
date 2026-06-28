import React from 'react';
import {
  FolderKanban,
  CheckSquare,
  Users,
  BarChart3,
  Settings,
  Search,
  LogOut,
  Home
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  isDarkMode?: boolean;
}

export default function Sidebar({ activeTab }: SidebarProps) {
  const menuItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'projects', label: 'Projects', icon: FolderKanban, path: '/project' },
    { id: 'tasks', label: 'My Tasks', icon: CheckSquare, badge: 12, path: '/task' },
    { id: 'team', label: 'Team Management', icon: Users, path: '/team' },
    { id: 'reports', label: 'Reports', icon: BarChart3, path: '/report' },
    { id: 'settings', label: 'System Settings', icon: Settings, path: '/setting' },
  ];

  return (
    <aside className="w-64 border-r flex flex-col h-full select-none transition-colors duration-300 bg-white dark:bg-[#0d0e12] border-slate-200 dark:border-[#1f212a] text-slate-600 dark:text-slate-300">
      {/* Header / Brand */}
      <div className="p-6 flex items-center gap-3 border-b transition-colors duration-300 border-slate-100 dark:border-[#1f212a]/50">
        <img src="/assets/logo-bg-removed.png" className="w-12 h-12 animate-pulse" alt="logo" />
        <div className="flex flex-col">
          <span className="text-lg font-bold tracking-tight flex items-center gap-1.5 transition-colors text-slate-800 dark:text-white">
            Sprint Dash
          </span>
          <span className="text-xs text-slate-500">Agile Workspace</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 pt-6 pb-2">
        <div className="relative flex items-center border rounded-xl px-3 py-2 transition-all duration-200 bg-slate-50 dark:bg-[#151720] border-slate-200 dark:border-[#232634] focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/20">
          <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search dashboard..."
            className="bg-transparent border-none outline-none text-xs w-full text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600"
          />
        </div>
      </div>

      {/* Menu List */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <a
              key={item.id}
              href={item.path}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
                  : 'hover:bg-slate-50 dark:hover:bg-[#151720]/60 hover:text-slate-900 dark:hover:text-slate-100 border border-transparent text-slate-500 dark:text-slate-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4.5 h-4.5 transition-colors ${isActive ? 'text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isActive 
                    ? 'bg-indigo-500/20 text-indigo-300' 
                    : 'bg-slate-100 dark:bg-[#1e2030] text-slate-500 dark:text-slate-400'
                }`}>
                  {item.badge}
                </span>
              )}
            </a>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t flex items-center justify-between gap-3 transition-colors duration-300 border-slate-100 dark:border-[#1f212a] bg-slate-50/50 dark:bg-[#090a0f]">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="relative shrink-0">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop"
              className="w-10 h-10 rounded-full border-2 border-indigo-500/30 object-cover"
              alt="Avatar"
            />
            <div className="absolute right-0 bottom-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-[#090a0f]"></div>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold truncate text-slate-700 dark:text-slate-200">Azunyan U. Wu</span>
            <span className="text-[10px] text-slate-500 truncate">Basic Member</span>
          </div>
        </div>
        <button className="p-2 rounded-lg transition-colors cursor-pointer hover:bg-slate-100 dark:hover:bg-[#1a1c26] text-slate-400 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-400">
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
