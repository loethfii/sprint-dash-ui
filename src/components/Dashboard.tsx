import React, { useState, useEffect } from 'react';
import DashboardShell from './DashboardShell';
import TaskTreeColumn from './TaskTreeColumn';
import TaskDetailModal from './TaskDetailModal';
import type { Task, Project, Member } from '../types';
import {
  fetchTasksTree,
  fetchProjects,
  fetchMembers,
  createTask,
  updateTask,
  deleteTask,
  assignTask,
  mapFrontendTaskToPayload
} from '../services/api';


export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [members, setMembers] = useState<Member[]>([]);

  // Filter States
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedAssigneeId, setSelectedAssigneeId] = useState<string>('');
  const [selectedPriority, setSelectedPriority] = useState<string>('');

  // Loading/Error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [modalParentId, setModalParentId] = useState<string | number | null>(null);
  const [modalStatus, setModalStatus] = useState<Task['status']>('open');

  // Fetch initial configuration
  useEffect(() => {
    async function init() {
      try {
        const pRes = await fetchProjects();
        const projectsList = pRes.data || [];
        setProjects(projectsList);
        if (projectsList.length > 0) {
          setSelectedProjectId(String(projectsList[0].id));
        }

        const mRes = await fetchMembers();
        setMembers(mRes.data || []);
      } catch (err: any) {
        console.error("Failed to initialize Dashboard data:", err);
      }
    }
    init();
  }, []);

  // Fetch tasks tree dynamically
  const loadTasks = async () => {
    if (!selectedProjectId) return;
    setIsLoading(true);
    setError('');
    try {
      const res = await fetchTasksTree({
        projectId: selectedProjectId,
        assignedUser: selectedAssigneeId || undefined,
        priority: selectedPriority || undefined,
      });
      setTasks(res.data || []);
    } catch (err: any) {
      console.error("Failed to load tasks:", err);
      setError(err.message || 'Gagal memuat task.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [selectedProjectId, selectedAssigneeId, selectedPriority]);

  // Filter tasks by root status
  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter(t => t.status === status);
  };

  // Open modal for adding task
  const handleAddTaskClick = (status: Task['status'], parentId: string | number | null = null) => {
    setSelectedTask(null);
    setModalParentId(parentId);
    setModalStatus(status);
    setIsModalOpen(true);
  };

  // Open modal for editing task
  const handleEditTaskClick = (task: Task) => {
    setSelectedTask(task);
    setModalParentId(null);
    setIsModalOpen(true);
  };

  // Save changes from modal
  const handleSaveTask = async (taskData: Task, parentId: string | number | null) => {
    try {
      let savedTask: Task;
      if (selectedTask) {
        // Edit mode
        const payload = mapFrontendTaskToPayload(taskData, selectedProjectId);
        const res = await updateTask(selectedTask.id, {
          ...payload,
          parentTaskId: selectedTask.parentTaskId ? String(selectedTask.parentTaskId) : null,
        });
        savedTask = res.data;

        // Assign user if changed
        const oldAssignee = selectedTask.assignees?.[0]?.id;
        const newAssignee = taskData.assignees?.[0]?.id;
        if (newAssignee && String(newAssignee) !== String(oldAssignee)) {
          await assignTask(savedTask.id, String(newAssignee));
        }
      } else {
        // Add mode
        const payload = mapFrontendTaskToPayload(taskData, selectedProjectId);
        const res = await createTask({
          ...payload,
          parentTaskId: parentId ? String(parentId) : null,
        });
        savedTask = res.data;

        // Assign user if selected
        const newAssignee = taskData.assignees?.[0]?.id;
        if (newAssignee) {
          await assignTask(savedTask.id, String(newAssignee));
        }
      }
      setIsModalOpen(false);
      loadTasks();
    } catch (err: any) {
      console.error("Failed to save task:", err);
      alert(err.message || 'Gagal menyimpan task.');
    }
  };

  // Delete task
  const handleDeleteTask = async (taskId: string | number) => {
    try {
      await deleteTask(taskId);
      setIsModalOpen(false);
      loadTasks();
    } catch (err: any) {
      console.error("Failed to delete task:", err);
      alert(err.message || 'Gagal menghapus task.');
    }
  };

  // Change status of a task
  const handleToggleStatus = async (taskId: string | number, newStatus: Task['status']) => {
    try {
      await updateTask(taskId, { status: newStatus });
      loadTasks();
    } catch (err: any) {
      console.error("Failed to toggle status:", err);
    }
  };

  const selectedProjectName = projects.find(p => String(p.id) === String(selectedProjectId))?.name || '';

  return (
    <DashboardShell activeTab="tasks" title="My Tasks">
      {() => (
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Sub-Header / Filters */}
          <div className="px-8 py-3.5 border-b flex flex-wrap gap-4 items-center justify-between shrink-0 transition-colors duration-200 border-slate-200 dark:border-[#1f212a] bg-white/80 dark:bg-[#0d0e12]/80">
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium">

              {/* Project Filter */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Project:</span>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="bg-slate-100 dark:bg-[#151720] border border-slate-200 dark:border-[#222535] rounded-xl px-3 py-1.5 text-slate-700 dark:text-slate-300 text-xs font-semibold outline-none cursor-pointer"
                >
                  <option value="" disabled>Select Project</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Assignee Filter */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Assignee:</span>
                <select
                  value={selectedAssigneeId}
                  onChange={(e) => setSelectedAssigneeId(e.target.value)}
                  className="bg-slate-100 dark:bg-[#151720] border border-slate-200 dark:border-[#222535] rounded-xl px-3 py-1.5 text-slate-700 dark:text-slate-300 text-xs font-semibold outline-none cursor-pointer"
                >
                  <option value="">All Assignees</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority Filter */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Priority:</span>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="bg-slate-100 dark:bg-[#151720] border border-slate-200 dark:border-[#222535] rounded-xl px-3 py-1.5 text-slate-700 dark:text-slate-300 text-xs font-semibold outline-none cursor-pointer"
                >
                  <option value="">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => loadTasks()}
                className="px-3 py-1.5 border rounded-xl text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer bg-slate-100 dark:bg-[#151720]/80 border-slate-200 dark:border-[#232634] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#151720]"
              >
                Refresh Board
              </button>
            </div>
          </div>

          {/* Kanban Columns Grid */}
          <div className="flex-1 p-8 overflow-x-auto select-none transition-colors duration-200 bg-[#f4f6f9] dark:bg-[#090a0f]">
            {error && (
              <div className="mb-6 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs rounded-xl px-4 py-3 font-medium">
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-slate-500">
                  <svg className="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-xs font-semibold">Memuat Task Board...</span>
                </div>
              </div>
            ) : (
              <div className="flex gap-6 min-w-250 h-full">
                <TaskTreeColumn
                  title="Open"
                  status="open"
                  tasks={getTasksByStatus('open')}
                  onSelectTask={handleEditTaskClick}
                  onAddTask={handleAddTaskClick}
                  onToggleStatus={handleToggleStatus}
                />
                <TaskTreeColumn
                  title="Working"
                  status="working"
                  tasks={getTasksByStatus('working')}
                  onSelectTask={handleEditTaskClick}
                  onAddTask={handleAddTaskClick}
                  onToggleStatus={handleToggleStatus}
                />
                <TaskTreeColumn
                  title="Closed"
                  status="closed"
                  tasks={getTasksByStatus('closed')}
                  onSelectTask={handleEditTaskClick}
                  onAddTask={handleAddTaskClick}
                  onToggleStatus={handleToggleStatus}
                />
                <TaskTreeColumn
                  title="Overdue"
                  status="overdue"
                  tasks={getTasksByStatus('overdue')}
                  onSelectTask={handleEditTaskClick}
                  onAddTask={handleAddTaskClick}
                  onToggleStatus={handleToggleStatus}
                />
              </div>
            )}
          </div>

          {/* Task Modal Overlay */}
          <TaskDetailModal
            task={selectedTask}
            parentId={modalParentId}
            status={modalStatus}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveTask}
            onDelete={handleDeleteTask}
            members={members}
            projectName={selectedProjectName}
          />
        </div>
      )}
    </DashboardShell>
  );
}
