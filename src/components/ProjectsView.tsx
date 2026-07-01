import React, { useState } from 'react';
import { Plus, Trash2, Edit3, FolderKanban, CheckSquare, Layers, Calendar } from 'lucide-react';
import type { Project, Member } from '../types';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import moment from 'moment-timezone';

interface ProjectsViewProps {
  isDarkMode: boolean;
  projects: Project[];
  onCreateProject: (project: Project) => void;
  onUpdateProject: (id: string | number, fields: Partial<Project>) => void;
  onDeleteProject: (id: string | number) => void;
  availableManagers: Member[];
  onAssignManager: (projectId: string | number, managerId: string) => void;
  onUnassignManager: (projectId: string | number, managerId: string) => void;
}

const getTodayStr = () => new Date().toISOString().split('T')[0];
const getFutureStr = () => {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().split('T')[0];
};

const normalizeScope = (val: string) => {
  if (!val) return 'Frontend';
  const lower = val.toLowerCase();
  if (lower === 'frontend' || lower === 'frontent') return 'Frontend';
  if (lower === 'backend') return 'Backend';
  if (lower === 'database') return 'Database';
  if (lower === 'infrastructure') return 'Infrastructure';
  return 'Frontend';
};

export default function ProjectsView({
  isDarkMode,
  projects,
  onCreateProject,
  onUpdateProject,
  onDeleteProject,
  availableManagers,
  onAssignManager,
  onUnassignManager
}: ProjectsViewProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | number | null>(null); // holds project ID being edited
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [scope, setScope] = useState('Frontend');
  const [startDate, setStartDate] = useState(getTodayStr());
  const [endDate, setEndDate] = useState(getFutureStr());
  const [priority, setPriority] = useState('medium');
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreateProject({
      id: Date.now(),
      name,
      description,
      scope,
      tasksCount: 0,
      startDate,
      endDate,
      priority
    });
    setName('');
    setDescription('');
    setScope('Frontend');
    setStartDate(getTodayStr());
    setEndDate(getFutureStr());
    setPriority('medium');
    setIsAdding(false);
  };

  const handleStartEdit = (project: Project) => {
    setIsEditing(project.id);
    setName(project.name);
    setDescription(project.description || '');
    setScope(normalizeScope(project.scope));
    setStartDate(project.startDate || getTodayStr());
    setEndDate(project.endDate || getFutureStr());
    setPriority(project.priority || 'medium');
  };

  const handleSubmitEdit = (e: React.FormEvent, id: string | number) => {
    e.preventDefault();
    if (!name.trim()) return;
    onUpdateProject(id, {
      name,
      description,
      scope,
      startDate,
      endDate,
      priority
    });
    setIsEditing(null);
    setName('');
    setDescription('');
    setScope('Frontend');
    setStartDate(getTodayStr());
    setEndDate(getFutureStr());
    setPriority('medium');
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

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
              <div className="flex flex-col gap-1 col-span-2 sm:col-span-1">
                <span className="text-slate-500 font-medium">Scope Category</span>
                <select
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}
                  className="border rounded-lg px-2.5 py-1.5 text-[11px] font-semibold outline-none cursor-pointer bg-slate-50 dark:bg-[#151720] border-slate-200 dark:border-[#222535] text-slate-600 dark:text-slate-300"
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Database">Database</option>
                  <option value="Infrastructure">Infrastructure</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-slate-500 font-medium">Priority</span>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="border rounded-lg px-2.5 py-1.5 text-[11px] font-semibold outline-none cursor-pointer bg-slate-50 dark:bg-[#151720] border-slate-200 dark:border-[#222535] text-slate-600 dark:text-slate-300 animate-fade-in"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-slate-500 font-medium">Start Date</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border rounded-lg px-2 py-1 text-[11px] font-semibold outline-none cursor-pointer bg-slate-50 dark:bg-[#151720] border-slate-200 dark:border-[#222535] text-slate-600 dark:text-slate-300"
                />
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-slate-500 font-medium">End Date</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border rounded-lg px-2 py-1 text-[11px] font-semibold outline-none cursor-pointer bg-slate-50 dark:bg-[#151720] border-slate-200 dark:border-[#222535] text-slate-600 dark:text-slate-300"
                />
              </div>
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

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
                    <div className="flex flex-col gap-1 col-span-2 sm:col-span-1">
                      <span className="text-[10px] text-slate-500 font-medium">Scope</span>
                      <select
                        value={scope}
                        onChange={(e) => setScope(e.target.value)}
                        className="w-full border rounded-lg px-2 py-1 text-[11px] font-semibold outline-none bg-slate-50 dark:bg-[#151720] border-slate-200 dark:border-[#222535] text-slate-800 dark:text-white focus:border-indigo-500/50"
                      >
                        <option value="Frontend">Frontend</option>
                        <option value="Backend">Backend</option>
                        <option value="Database">Database</option>
                        <option value="Infrastructure">Infrastructure</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-slate-500 font-medium">Priority</span>
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-full border rounded-lg px-2 py-1 text-[11px] font-semibold outline-none bg-slate-50 dark:bg-[#151720] border-slate-200 dark:border-[#222535] text-slate-800 dark:text-white focus:border-indigo-500/50"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-slate-500 font-medium">Start</span>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full border rounded-lg px-2 py-0.5 text-[11px] font-semibold outline-none bg-slate-50 dark:bg-[#151720] border-slate-200 dark:border-[#222535] text-slate-800 dark:text-white focus:border-indigo-500/50"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-slate-500 font-medium">End</span>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full border rounded-lg px-2 py-0.5 text-[11px] font-semibold outline-none bg-slate-50 dark:bg-[#151720] border-slate-200 dark:border-[#222535] text-slate-800 dark:text-white focus:border-indigo-500/50"
                      />
                    </div>
                  </div>

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
                <div className="p-5 rounded-2xl border flex flex-col justify-between min-h-[220px] transition-all bg-white dark:bg-[#0f111a] border-slate-200 dark:border-[#1f2130] shadow-xs">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
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
                          onClick={() => setProjectToDelete(project)}
                          className="p-1 hover:bg-slate-100 dark:hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold truncate text-slate-800 dark:text-white">{project.name}</h3>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">{project.description}</p>
                    </div>

                    {/* Timeline & Priority Badges */}
                    <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                      <span className="flex items-center gap-1 text-[10px]">
                        <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                        {project.startDate && project.endDate ? `${moment(project.startDate).format('DD-MM-YYYY')} to ${moment(project.endDate).format('DD-MM-YYYY')} ` : 'No timeline'}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${project.priority === 'high' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                        project.priority === 'medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                        {project.priority || 'medium'}
                      </span>
                    </div>

                    {/* Manager Section */}
                    <div className="flex flex-col gap-1.5 mt-2 pt-2 border-t border-dashed dark:border-[#1f2130]/50 border-slate-100">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Manager</span>
                      <div className="flex flex-wrap gap-1.5 items-center">
                        {project.projectAssignments && project.projectAssignments.length > 0 ? (
                          project.projectAssignments.map(pa => (
                            <div key={pa.id} className="flex items-center gap-1 bg-slate-100 dark:bg-[#1a1c2a] border border-slate-200 dark:border-[#2e3146] rounded-lg px-2 py-0.5 text-[10px] text-slate-600 dark:text-slate-300">
                              <span>{pa.manager?.name || 'Unknown'}</span>
                              <button
                                type="button"
                                onClick={() => onUnassignManager(project.id, pa.managerId)}
                                className="text-slate-400 hover:text-rose-400 font-bold transition-colors ml-1 cursor-pointer"
                                title="Unassign Manager"
                              >
                                &times;
                              </button>
                            </div>
                          ))
                        ) : (
                          <span className="text-[10px] text-slate-400 dark:text-slate-600 italic">No manager assigned</span>
                        )}
                        
                        <div className="relative inline-block ml-auto">
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                onAssignManager(project.id, e.target.value);
                                e.target.value = '';
                              }
                            }}
                            className="bg-transparent border-none text-[10px] text-indigo-400 font-semibold cursor-pointer outline-none hover:text-indigo-300"
                            defaultValue=""
                          >
                            <option value="" disabled>+ Assign</option>
                            {availableManagers
                              .filter(m => !project.projectAssignments?.some(pa => pa.managerId === m.id))
                              .map(m => (
                                <option key={m.id} value={m.id} className="bg-[#0f111a] text-slate-300">
                                  {m.name}
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t dark:border-[#1f2130] border-slate-100 pt-3 mt-3">
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

      <ConfirmDeleteModal
        isOpen={projectToDelete !== null}
        onClose={() => setProjectToDelete(null)}
        onConfirm={() => {
          if (projectToDelete) {
            onDeleteProject(projectToDelete.id);
          }
        }}
        title="Delete Project"
        message={`Are you sure you want to delete project "${projectToDelete?.name}"? This action cannot be undone.`}
      />
    </div>
  );
}
