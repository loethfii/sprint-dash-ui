import React, { useState, useEffect } from 'react';
import DashboardShell from './DashboardShell';
import ProjectsView from './ProjectsView';
import type { Project, Member } from '../types';
import { fetchProjects, createProject, updateProject, deleteProject, fetchManagers, assignProjectManager, unassignProjectManager } from '../services/api';

const getTodayStr = () => new Date().toISOString().split('T')[0];
const getFutureStr = () => {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().split('T')[0];
};

export default function ProjectsViewPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [managers, setManagers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProjects = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetchProjects();
      setProjects(res.data || []);
    } catch (err: any) {
      console.error("Failed to load projects:", err);
      setError(err.message || 'Gagal memuat proyek.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadManagers = async () => {
    try {
      const res = await fetchManagers(1, 50);
      setManagers(res.data || []);
    } catch (err) {
      console.error("Failed to load managers:", err);
    }
  };

  useEffect(() => {
    loadProjects();
    loadManagers();
  }, []);

  const handleAssignManager = async (projectId: string | number, managerId: string) => {
    try {
      await assignProjectManager(projectId, managerId);
      await loadProjects();
    } catch (err: any) {
      console.error("Failed to assign manager:", err);
      alert(err.message || 'Gagal menetapkan manajer.');
    }
  };

  const handleUnassignManager = async (projectId: string | number, managerId: string) => {
    try {
      await unassignProjectManager(projectId, managerId);
      await loadProjects();
    } catch (err: any) {
      console.error("Failed to unassign manager:", err);
      alert(err.message || 'Gagal menghapus penugasan manajer.');
    }
  };


  const handleCreateProject = async (project: Project) => {
    try {
      const res = await createProject({
        projectName: project.name,
        description: project.description || '',
        startDate: project.startDate || getTodayStr(),
        endDate: project.endDate || getFutureStr(),
        priority: project.priority || 'medium',
        scopeCategory: project.scope
      });
      setProjects(prev => [...prev, res.data]);
    } catch (err: any) {
      console.error("Failed to create project:", err);
      alert(err.message || 'Gagal membuat proyek.');
    }
  };

  const handleUpdateProject = async (id: string | number, fields: Partial<Project>) => {
    try {
      const existing = projects.find(p => p.id === id);
      if (!existing) return;

      const res = await updateProject(id, {
        projectName: fields.name || existing.name,
        description: fields.description !== undefined ? (fields.description || '') : (existing.description || ''),
        startDate: fields.startDate || existing.startDate || getTodayStr(),
        endDate: fields.endDate || existing.endDate || getFutureStr(),
        priority: fields.priority || existing.priority || 'medium',
        scopeCategory: fields.scope || existing.scope || 'Frontend'
      });

      setProjects(prev => prev.map(p => p.id === id ? res.data : p));
    } catch (err: any) {
      console.error("Failed to update project:", err);
      alert(err.message || 'Gagal memperbarui proyek.');
    }
  };

  const handleDeleteProject = async (id: string | number) => {
    try {
      await deleteProject(id);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      console.error("Failed to delete project:", err);
      alert(err.message || 'Gagal menghapus proyek.');
    }
  };

  return (
    <DashboardShell activeTab="projects" title="Projects">
      {(isDarkMode) => (
        <div className="flex flex-col h-full">
          {error && (
            <div className="mx-8 mt-6 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs rounded-xl px-4 py-3 font-medium">
              {error}
            </div>
          )}
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2 text-slate-500">
                <svg className="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-xs font-semibold">Memuat Proyek...</span>
              </div>
            </div>
          ) : (
            <ProjectsView
              isDarkMode={isDarkMode}
              projects={projects}
              onCreateProject={handleCreateProject}
              onUpdateProject={handleUpdateProject}
              onDeleteProject={handleDeleteProject}
              availableManagers={managers}
              onAssignManager={handleAssignManager}
              onUnassignManager={handleUnassignManager}
            />
          )}
        </div>
      )}
    </DashboardShell>
  );
}
