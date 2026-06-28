import React from 'react';
import DashboardShell from './DashboardShell';
import HomeView from './HomeView';

export default function HomeViewPage() {
  // Mock statistics for the home page overview
  const membersCount = 3;
  const projectsCount = 2;
  const taskStats = {
    openPct: 40,
    workingPct: 40,
    closedPct: 20,
    totalTasks: 5
  };

  return (
    <DashboardShell activeTab="home" title="Overview">
      {(isDarkMode) => (
        <HomeView
          isDarkMode={isDarkMode}
          membersCount={membersCount}
          projectsCount={projectsCount}
          taskStats={taskStats}
        />
      )}
    </DashboardShell>
  );
}
