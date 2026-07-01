import React, { useState, useEffect } from 'react';
import DashboardShell from './DashboardShell';
import HomeView from './HomeView';
import { fetchDashboardWidgets } from '../services/api';

export default function HomeViewPage() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await fetchDashboardWidgets();
        setDashboardData(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadDashboard();
  }, []);

  return (
    <DashboardShell activeTab="home" title="Overview">
      {(isDarkMode) => {
        if (isLoading) {
          return (
            <div className="flex-1 flex items-center justify-center bg-[#f4f6f9] dark:bg-[#090a0f]">
              <div className="flex flex-col items-center gap-2 text-slate-500">
                <svg className="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-xs font-semibold">Memuat Dashboard...</span>
              </div>
            </div>
          );
        }

        const openPct = dashboardData?.taskStatusShare?.find((s: any) => s.status === 'open')?.percentage || 0;
        const workingPct = dashboardData?.taskStatusShare?.find((s: any) => s.status === 'working')?.percentage || 0;
        const closedPct = dashboardData?.taskStatusShare?.find((s: any) => s.status === 'closed')?.percentage || 0;

        const taskStats = {
          openPct,
          workingPct,
          closedPct,
          totalTasks: dashboardData?.totalTasks || 0
        };

        return (
          <HomeView
            isDarkMode={isDarkMode}
            membersCount={dashboardData?.totalMembers || 0}
            projectsCount={dashboardData?.totalProjects || 0}
            taskStats={taskStats}
            projectVelocity={dashboardData?.projectVelocity || {}}
            taskStatusShare={dashboardData?.taskStatusShare || []}
          />
        );
      }}
    </DashboardShell>
  );
}
