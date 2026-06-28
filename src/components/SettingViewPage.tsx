import React from 'react';
import DashboardShell from './DashboardShell';

export default function SettingViewPage() {
  return (
    <DashboardShell activeTab="settings" title="System Settings">
      {(isDarkMode) => (
        <div className={`flex-1 p-8 overflow-y-auto flex flex-col justify-center items-center text-center ${
          isDarkMode ? 'bg-[#090a0f]' : 'bg-[#f4f6f9]'
        }`}>
          <div className="max-w-md space-y-4">
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>System Settings</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Configure Sprint Dash credentials, IAM profiles, and workspace themes here.
            </p>
            <a 
              href="/"
              className="mt-2 inline-block text-xs font-semibold px-4 py-2 bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/20 text-indigo-400 rounded-xl transition-all cursor-pointer"
            >
              Back to Overview
            </a>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
