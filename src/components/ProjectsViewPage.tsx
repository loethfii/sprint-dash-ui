import React, { useState } from 'react';
import DashboardShell from './DashboardShell';
import ProjectsView from './ProjectsView';
import type { Project } from '../types';

export default function ProjectsViewPage() {
  const [projects, setProjects] = useState<Project[]>([
    { id: 1, name: "Sprint Dash Platform", description: "Design tokens, layouts, and dynamic themes.", scope: "Core UI Refactoring", tasksCount: 3 },
    { id: 2, name: "CI Pipeline Scanner", description: "Incorporate BFF security and dependencies validations.", scope: "Security BFF Integrations", tasksCount: 1 }
  ]);

  const handleCreateProject = (project: Project) => {
    setProjects([...projects, project]);
  };

  const handleUpdateProject = (id: number, fields: Partial<Project>) => {
    setProjects(projects.map(p => p.id === id ? { ...p, ...fields } as Project : p));
  };

  const handleDeleteProject = (id: number) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  return (
    <DashboardShell activeTab="projects" title="Projects">
      {(isDarkMode) => (
        <ProjectsView
          isDarkMode={isDarkMode}
          projects={projects}
          onCreateProject={handleCreateProject}
          onUpdateProject={handleUpdateProject}
          onDeleteProject={handleDeleteProject}
        />
      )}
    </DashboardShell>
  );
}
