import React from 'react';
import { Users, FolderKanban, CheckCircle2, TrendingUp } from 'lucide-react';

interface HomeViewProps {
  isDarkMode: boolean;
  membersCount: number;
  projectsCount: number;
  taskStats: {
    openPct: number;
    workingPct: number;
    closedPct: number;
    totalTasks: number;
  };
}

export default function HomeView({ membersCount, projectsCount, taskStats }: HomeViewProps) {
  const { openPct, workingPct, closedPct, totalTasks } = taskStats;

  // Mock data points for SVG line chart (representing project velocity over the week)
  const linePoints = "0,80 40,65 80,75 120,40 160,50 200,20 240,30 280,10 320,15 360,5";
  const areaPoints = "0,80 40,65 80,75 120,40 160,50 200,20 240,30 280,10 320,15 360,5 360,100 0,100";

  return (
    <div className="flex-1 p-8 overflow-y-auto custom-scrollbar space-y-8 bg-[#f4f6f9] dark:bg-[#090a0f] text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Welcome banner */}
      <div className="p-6 rounded-2xl relative overflow-hidden transition-all border bg-linear-to-r from-indigo-50/50 via-slate-50 to-white dark:from-indigo-950/40 dark:via-slate-900/60 dark:to-slate-900 border-slate-200 dark:border-[#1f2130]">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">
          Welcome back, Azunyan!
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-xl">
          Here is your agile workspace report for today. Your team completed 2 main releases last week.
        </p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Members */}
        <div className="p-5 rounded-2xl border transition-all bg-white dark:bg-[#0f111a] border-slate-200 dark:border-[#1f2130] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Members</span>
            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-800 dark:text-white">{membersCount}</span>
            <span className="text-[10px] text-emerald-500 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded">
              +12% this month
            </span>
          </div>
        </div>

        {/* Total Projects */}
        <div className="p-5 rounded-2xl border transition-all bg-white dark:bg-[#0f111a] border-slate-200 dark:border-[#1f2130] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Projects</span>
            <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400">
              <FolderKanban className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-800 dark:text-white">{projectsCount}</span>
            <span className="text-[10px] text-indigo-500 font-semibold bg-indigo-500/10 px-1.5 py-0.5 rounded">
              Active Scope
            </span>
          </div>
        </div>

        {/* Total Tasks */}
        <div className="p-5 rounded-2xl border transition-all bg-white dark:bg-[#0f111a] border-slate-200 dark:border-[#1f2130] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Tasks</span>
            <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-800 dark:text-white">{totalTasks}</span>
            <span className="text-[10px] text-slate-500 font-semibold">
              Across status columns
            </span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Project Velocity Area Chart */}
        <div className="p-6 rounded-2xl border lg:col-span-2 flex flex-col justify-between transition-all bg-white dark:bg-[#0f111a] border-slate-200 dark:border-[#1f2130] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Project Velocity</h3>
              <p className="text-[11px] text-slate-500">Weekly task completion rates</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-indigo-500 font-semibold">
              <TrendingUp className="w-4 h-4" /> +24% Velocity
            </div>
          </div>

          {/* SVG Vector Line Chart */}
          <div className="w-full h-48 relative mt-4">
            <svg viewBox="0 0 360 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grid Lines using Tailwind CSS classes */}
              <line x1="0" y1="25" x2="360" y2="25" className="stroke-slate-100 dark:stroke-[#1f2130]" strokeDasharray="3" />
              <line x1="0" y1="50" x2="360" y2="50" className="stroke-slate-100 dark:stroke-[#1f2130]" strokeDasharray="3" />
              <line x1="0" y1="75" x2="360" y2="75" className="stroke-slate-100 dark:stroke-[#1f2130]" strokeDasharray="3" />
              
              {/* Fill Area */}
              <polygon points={areaPoints} fill="url(#chartGlow)" />
              
              {/* Glowing Line */}
              <polyline points={linePoints} fill="none" stroke="#6366f1" strokeWidth="2.5" />
            </svg>
          </div>

          <div className="flex justify-between text-[10px] text-slate-500 mt-4 px-1">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>

        {/* Task Percentage Circular Gauges */}
        <div className="p-6 rounded-2xl border flex flex-col justify-between transition-all bg-white dark:bg-[#0f111a] border-slate-200 dark:border-[#1f2130] shadow-xs">
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Task Status Share</h3>
            <p className="text-[11px] text-slate-500">Distribution of current board tasks</p>
          </div>

          {/* Graphical circular progress breakdown */}
          <div className="flex items-center justify-center my-6">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                {/* Track */}
                <circle cx="72" cy="72" r="56" fill="transparent" className="stroke-slate-100 dark:stroke-[#181a26]" strokeWidth="10" />
                {/* Closed segment */}
                <circle cx="72" cy="72" r="56" fill="transparent" stroke="#2ec4b6" strokeWidth="10" 
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - closedPct / 100)}`}
                />
                {/* Working segment */}
                <circle cx="72" cy="72" r="44" fill="transparent" className="stroke-slate-100 dark:stroke-[#181a26]" strokeWidth="10" />
                <circle cx="72" cy="72" r="44" fill="transparent" stroke="#ff9f1c" strokeWidth="10" 
                  strokeDasharray={`${2 * Math.PI * 44}`}
                  strokeDashoffset={`${2 * Math.PI * 44 * (1 - workingPct / 100)}`}
                />
                {/* Open segment */}
                <circle cx="72" cy="72" r="32" fill="transparent" className="stroke-slate-100 dark:stroke-[#181a26]" strokeWidth="10" />
                <circle cx="72" cy="72" r="32" fill="transparent" stroke="#5f3afc" strokeWidth="10" 
                  strokeDasharray={`${2 * Math.PI * 32}`}
                  strokeDashoffset={`${2 * Math.PI * 32 * (1 - openPct / 100)}`}
                />
              </svg>
              <div className="absolute text-center flex flex-col items-center">
                <span className="text-base font-bold text-slate-800 dark:text-white">Share</span>
                <span className="text-[9px] text-slate-500">Board %</span>
              </div>
            </div>
          </div>

          {/* Labels & Percentages */}
          <div className="space-y-2 text-xs font-semibold text-slate-400">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#5f3afc]"></span>
                <span className="text-slate-700 dark:text-slate-300">Open</span>
              </div>
              <span className="text-slate-900 dark:text-slate-200">{Math.round(openPct)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff9f1c]"></span>
                <span className="text-slate-700 dark:text-slate-300">Working</span>
              </div>
              <span className="text-slate-900 dark:text-slate-200">{Math.round(workingPct)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2ec4b6]"></span>
                <span className="text-slate-700 dark:text-slate-300">Closed</span>
              </div>
              <span className="text-slate-900 dark:text-slate-200">{Math.round(closedPct)}%</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
