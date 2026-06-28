import React, { useState } from 'react';
import { Plus, Trash2, Edit3, FolderKanban, CheckSquare, Layers } from 'lucide-react';

import type { Project } from '../types';

interface ProjectsViewProps {
  isDarkMode: boolean;
  projects: Project[];
  onCreateProject: (project: Project) => void;
  onUpdateProject: (id: number, fields: Partial<Project>) => void;
  onDeleteProject: (id: number) => void;
}

export default function ProjectsView({ 
  isDarkMode, 
  projects, 
  onCreateProject, 
  onUpdateProject, 
  onDeleteProject 
}: ProjectsViewProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<number | null>(null); // holds project ID being edited
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [scope, setScope] = useState('Core UI Refactoring');

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreateProject({
      id: Date.now(),
      name,
      description,
      scope,
      tasksCount: 0
    });
    setName('');
    setDescription('');
    setScope('Core UI Refactoring');
    setIsAdding(false);
  };

  const handleStartEdit = (project: Project) => {
    setIsEditing(project.id);
    setName(project.name);
    setDescription(project.description);
    setScope(project.scope || 'Core UI Refactoring');
  };

  const handleSubmitEdit = (e: React.FormEvent, id: number) => {
    e.preventDefault();
    if (!name.trim()) return;
    onUpdateProject(id, {
      name,
      description,
      scope
    });
    setIsEditing(null);
    setName('');
    setDescription('');
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto custom-scrollbar space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Projects Register</h2>
          <p className="text-xs text-slate-500">Manage your active workspaces and project scopes</p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-[0_4px_12px_rgba(99,102,241,0.25)] cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Project
          </button>
        )}
      </div>

      {/* Add Project Form Card */}
      {isAdding && (
        <form onSubmit={handleSubmitAdd} className="p-5 rounded-2xl border space-y-4 max-w-xl transition-all bg-white dark:bg-[#0f111a] border-slate-200 dark:border-[#1f2130] shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            New Project Details
          </h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Project Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-xl px-4 py-2.5 text-xs outline-none transition-colors bg-slate-50 dark:bg-[#151720] border-slate-200 dark:border-[#222535] text-slate-800 dark:text-white focus:border-indigo-500/50"
              required
            />
            <textarea
              placeholder="Project Description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full border rounded-xl px-4 py-2.5 text-xs outline-none transition-colors bg-slate-50 dark:bg-[#151720] border-slate-200 dark:border-[#222535] text-slate-800 dark:text-white focus:border-indigo-500/50"
            />
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-500 font-medium">Scope Category</span>
              <select
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                className="border rounded-lg px-2.5 py-1.5 text-[11px] font-semibold outline-none cursor-pointer bg-slate-50 dark:bg-[#151720] border-slate-200 dark:border-[#222535] text-slate-600 dark:text-slate-300"
              >
                <option value="Core UI Refactoring">Core UI Refactoring</option>
                <option value="Security BFF Integrations">Security BFF Integrations</option>
                <option value="Database Analytics">Database Analytics</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-[#1c1e2a] text-slate-400 rounded-xl text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/15"
            >
              Save Project
            </button>
          </div>
        </form>
      )}

      {/* Projects List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          const editingThis = isEditing === project.id;
          return (
            <div key={project.id}>
              {editingThis ? (
                <form onSubmit={(e) => handleSubmitEdit(e, project.id)} className="p-5 rounded-2xl border space-y-4 transition-all bg-white dark:bg-[#0f111a] border-slate-200 dark:border-[#1f2130] shadow-sm">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border rounded-xl px-3 py-2 text-xs outline-none bg-slate-50 dark:bg-[#151720] border-slate-200 dark:border-[#222535] text-slate-800 dark:text-white focus:border-indigo-500/50"
                    required
                  />
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    className="w-full border rounded-xl px-3 py-2 text-xs outline-none bg-slate-50 dark:bg-[#151720] border-slate-200 dark:border-[#222535] text-slate-800 dark:text-white focus:border-indigo-500/50"
                  />
                  <div className="flex justify-end gap-2 text-xs pt-1">
                    <button
                      type="button"
                      onClick={() => setIsEditing(null)}
                      className="px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-[#1a1c2a] text-slate-400 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-5 rounded-2xl border flex flex-col justify-between h-48 transition-all bg-white dark:bg-[#0f111a] border-slate-200 dark:border-[#1f2130] shadow-xs">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-400">
                          <FolderKanban className="w-4.5 h-4.5" />
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded border bg-slate-100 dark:bg-[#20222f] border-slate-200 dark:border-[#2e3146] text-slate-600 dark:text-slate-300">
                          {project.scope || 'Core UI Refactoring'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleStartEdit(project)}
                          className="p-1 hover:bg-slate-100 dark:hover:bg-[#1a1c2a] text-slate-500 hover:text-indigo-400 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-4.5 h-4.5" />
                        </button>
                        <button
                          onClick={() => onDeleteProject(project.id)}
                          className="p-1 hover:bg-slate-100 dark:hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </div>
                    <h3 className="text-sm font-bold truncate text-slate-800 dark:text-white">{project.name}</h3>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">{project.description}</p>
                  </div>

                  <div className="flex items-center justify-between border-t dark:border-[#1f2130] border-slate-100 pt-3">
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <CheckSquare className="w-3.5 h-3.5" /> {project.tasksCount} Tasks Registered
                    </span>
                    <span className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer">
                      View Board &rarr;
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
