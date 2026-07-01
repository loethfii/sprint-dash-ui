import React, { useState, useEffect } from 'react';
import {
  FolderKanban,
  CheckSquare,
  Users,
  BarChart3,
  Settings,
  Search,
  LogOut,
  Home,
  BriefcaseBusiness,
} from 'lucide-react';
import { getMe, getMeDecoded, logoutUser, type User } from '../services/api';

interface SidebarProps {
  activeTab: string;
  isDarkMode?: boolean;
}

const getInitials = (name: string): string => {
  if (!name) return '';
  const words = name.trim().split(/\s+/);
  return words
    .slice(0, 3)
    .map(w => w.charAt(0).toUpperCase())
    .join('');
};

export default function Sidebar({ activeTab }: SidebarProps) {
  const [user, setUser] = useState<User | null>(() => getMeDecoded());
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!user) {
      getMe()
        .then(data => setUser(data))
        .catch(() => {
          logoutUser();
        });
    }
  }, [user]);

  const iconMap: Record<string, React.ComponentType<any>> = {
    FolderKanban,
    CheckSquare,
    Users,
    BarChart3,
    Settings,
    Home,
    BriefcaseBusiness
  };


  const menuItems = user?.menu?.metadata
    ? user.menu.metadata.map((item) => ({
      id: item.id,
      label: item.label,
      icon: iconMap[item.icon] || Home,
      path: item.path,
      badge: item.badge
    }))
    : [
    ];

  return (
    <aside className="w-64 border-r flex flex-col h-full select-none transition-colors duration-300 bg-white dark:bg-[#0d0e12] border-slate-200 dark:border-[#1f212a] text-slate-600 dark:text-slate-300" >
      {/* Header / Brand */}
      < div className="p-6 flex items-center gap-3 border-b transition-colors duration-300 border-slate-100 dark:border-[#1f212a]/50" >
        <img src="/assets/logo-bg-removed.png" className="w-12 h-12 animate-pulse" alt="logo" />
        <div className="flex flex-col">
          <span className="text-lg font-bold tracking-tight flex items-center gap-1.5 transition-colors text-slate-800 dark:text-white">
            Sprint Dash
          </span>
          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
            Workspace Hub
          </span>
        </div>
      </div >

      {/* Search Bar */}
      <div className="px-4 pt-6 pb-2">
        <div className="relative flex items-center border rounded-xl px-3 py-2 transition-all duration-200 bg-slate-50 dark:bg-[#151720] border-slate-200 dark:border-[#232634] focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/20">
          <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search dashboard..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-xs w-full text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600"
          />
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 overflow-y-auto custom-scrollbar flex flex-col gap-1 px-3">
        {user?.menu?.metadata && user.menu.metadata.map((item) => ({
          id: item.id,
          label: item.label,
          icon: iconMap[item.icon] || Home,
          path: item.path,
          badge: item.badge
        })).filter(item => 
          item.label.toLowerCase().includes(searchQuery.toLowerCase())
        ).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <a
              key={item.id}
              href={item.path}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 group cursor-pointer ${isActive
                ? 'bg-indigo-600 text-white shadow-[0_4px_12px_rgba(99,102,241,0.25)]'
                : 'hover:bg-slate-100 dark:hover:bg-[#181a24] text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4.5 h-4.5 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-500'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${isActive ? 'bg-white/20 text-white' : 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400'}`}>
                  {item.badge}
                </span>
              )}
            </a>
          );
        })}
        {user?.menu?.metadata && user.menu.metadata.map((item) => ({
          id: item.id,
          label: item.label,
          icon: iconMap[item.icon] || Home,
          path: item.path,
          badge: item.badge
        })).filter(item => 
          item.label.toLowerCase().includes(searchQuery.toLowerCase())
        ).length === 0 && (
          <div className="text-[11px] text-slate-400 dark:text-slate-500 text-center py-6">
            No items found
          </div>
        )}
      </div>

      {/* User Profile */}
      < div className="p-4 border-t flex items-center justify-between gap-3 transition-colors duration-300 border-slate-100 dark:border-[#1f212a] bg-slate-50/50 dark:bg-[#090a0f]" >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="relative shrink-0">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-extrabold text-xs shadow-sm border border-indigo-400/20 tracking-wider shrink-0 animate-fade-in"
              style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #a855f7 100%)' }}
            >
              {getInitials(user?.name || '')}
            </div>
            <div className="absolute right-0 bottom-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-[#090a0f]"></div>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold truncate text-slate-700 dark:text-slate-200">
              {user ? user.name : 'Loading...'}
            </span>
            <span className="text-[10px] text-slate-500 truncate capitalize">
              {user ? user.role : 'Basic Member'}
            </span>
          </div>
        </div>
        <button
          onClick={logoutUser}
          className="p-2 rounded-lg transition-colors cursor-pointer hover:bg-slate-100 dark:hover:bg-[#1a1c26] text-slate-400 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-400"
          title="Keluar"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div >
    </aside >
  );
}
