import React, { useState } from 'react';
import DashboardShell from './DashboardShell';
import TaskTreeColumn from './TaskTreeColumn';
import TaskDetailModal from './TaskDetailModal';
import { SlidersHorizontal, FileDown } from 'lucide-react';
import type { Task } from '../types';

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Sprint Dash Design System Integration",
    description: "Build clean, reusable component tokens, themes, and CSS layouts matching Figma reference designs.",
    status: "working",
    priority: "high",
    assignees: [
      { name: "Azunyan U. Wu", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" }
    ],
    comments: 11,
    views: 187,
    startTime: "2026-06-01",
    endTime: "2026-06-15",
    commentsData: [
      { id: 1, author: "Lia Martinez", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop", text: "Looking very solid, especially the glass effect!", time: "2 hours ago" }
    ],
    subtasks: [
      {
        id: 2,
        title: "Create hierarchical status board mockup",
        description: "Draft structural schemas for nested tree lists grouped by Open, Working, and Closed columns.",
        status: "working",
        priority: "medium",
        assignees: [
          { name: "Lia Martinez", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop" }
        ],
        comments: 4,
        views: 32,
        startTime: "2026-06-02",
        endTime: "2026-06-10",
        subtasks: []
      },
      {
        id: 3,
        title: "Define global tailwind dark mode colors",
        description: "Specify semantic background colors like #090a0f, #0d0e12 and borders #1f212a.",
        status: "closed",
        priority: "info",
        assignees: [
          { name: "Ronaldo S.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop" }
        ],
        comments: 1,
        views: 14,
        startTime: "2026-06-01",
        endTime: "2026-06-03",
        subtasks: []
      },
      {
        id: 4,
        title: "Define global tailwind dark mode colors",
        description: "Specify semantic background colors like #090a0f, #0d0e12 and borders #1f212a.",
        status: "closed",
        priority: "info",
        assignees: [
          { name: "Ronaldo S.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop" }
        ],
        comments: 1,
        views: 14,
        startTime: "2026-06-01",
        endTime: "2026-06-03",
        subtasks: []
      }
    ]
  },
  {
    id: 4,
    title: "Security Scanner Integration (BFF)",
    description: "Incorporate SAST scanners into our CI pipelines to validate dependencies and script injections.",
    status: "open",
    priority: "high",
    assignees: [
      { name: "Ronaldo S.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop" }
    ],
    comments: 0,
    views: 8,
    startTime: "2026-06-10",
    endTime: "2026-06-25",
    subtasks: [
      {
        id: 5,
        title: "Resolve dependency vulnerabilities",
        description: "Review package registry files for malicious injections.",
        status: "open",
        priority: "medium",
        assignees: [],
        startTime: "2026-06-12",
        endTime: "2026-06-18",
        subtasks: []
      }
    ]
  },
  {
    id: 6,
    title: "Client Beta Release Package",
    description: "Compile and bundle release packages, coordinate with QA, and deploy preview environments.",
    status: "closed",
    priority: "low",
    assignees: [
      { name: "Azunyan U. Wu", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" },
      { name: "Lia Martinez", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop" }
    ],
    comments: 24,
    views: 912,
    startTime: "2026-06-20",
    endTime: "2026-06-28",
    subtasks: []
  },
  {
    id: 7,
    title: "Client Beta Release Package",
    description: "Compile and bundle release packages, coordinate with QA, and deploy preview environments.",
    status: "overdue",
    priority: "low",
    assignees: [
      { name: "Azunyan U. Wu", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" },
      { name: "Lia Martinez", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop" }
    ],
    comments: 24,
    views: 912,
    startTime: "2026-06-20",
    endTime: "2026-06-28",
    subtasks: []
  }
];

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [modalParentId, setModalParentId] = useState<number | null>(null);
  const [modalStatus, setModalStatus] = useState<Task['status']>('open');

  // Filter tasks by root status
  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter(t => t.status === status);
  };

  // Open modal for adding task
  const handleAddTaskClick = (status: Task['status'], parentId: number | null = null) => {
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

  // Recursive update helper
  const updateTaskInTree = (taskList: Task[], taskId: number, updatedFields: Partial<Task>): Task[] => {
    return taskList.map(task => {
      if (task.id === taskId) {
        return { ...task, ...updatedFields } as Task;
      }
      if (task.subtasks && task.subtasks.length > 0) {
        return {
          ...task,
          subtasks: updateTaskInTree(task.subtasks, taskId, updatedFields)
        };
      }
      return task;
    });
  };

  // Recursive delete helper
  const deleteTaskFromTree = (taskList: Task[], taskId: number): Task[] => {
    return taskList
      .filter(task => task.id !== taskId)
      .map(task => {
        if (task.subtasks && task.subtasks.length > 0) {
          return {
            ...task,
            subtasks: deleteTaskFromTree(task.subtasks, taskId)
          };
        }
        return task;
      });
  };

  // Recursive add helper
  const addTaskToTree = (taskList: Task[], parentId: number | null, newTask: Task): Task[] => {
    if (!parentId) {
      return [...taskList, newTask];
    }
    return taskList.map(task => {
      if (task.id === parentId) {
        return {
          ...task,
          subtasks: [...(task.subtasks || []), newTask]
        };
      }
      if (task.subtasks && task.subtasks.length > 0) {
        return {
          ...task,
          subtasks: addTaskToTree(task.subtasks, parentId, newTask)
        };
      }
      return task;
    });
  };

  // Save changes from modal
  const handleSaveTask = (taskData: Task, parentId: number | null) => {
    if (selectedTask) {
      // Edit mode
      const updated = updateTaskInTree(tasks, selectedTask.id, taskData);
      setTasks(updated);
    } else {
      // Add mode
      const newTask: Task = {
        ...taskData,
        id: Date.now(),
        subtasks: []
      };
      const updated = addTaskToTree(tasks, parentId, newTask);
      setTasks(updated);
    }
    setIsModalOpen(false);
  };

  // Delete task
  const handleDeleteTask = (taskId: number) => {
    const updated = deleteTaskFromTree(tasks, taskId);
    setTasks(updated);
    setIsModalOpen(false);
  };

  // Change status of a task
  const handleToggleStatus = (taskId: number, newStatus: Task['status']) => {
    const updated = updateTaskInTree(tasks, taskId, { status: newStatus });
    setTasks(updated);
  };

  return (
    <DashboardShell activeTab="tasks" title="My Tasks">
      {() => (
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Filter Tabs Sub-Header */}
          <div className="px-8 py-3.5 border-b flex items-center justify-between shrink-0 transition-colors duration-200 border-slate-200 dark:border-[#1f212a] bg-white/80 dark:bg-[#0d0e12]/80">
            <div className="flex items-center gap-6 text-xs text-slate-500 font-medium">
              <button className="text-indigo-400 border-b-2 border-indigo-500 pb-3 pt-1.5 px-1 font-semibold">
                By Status
              </button>
              <button className="pb-3 pt-1.5 px-1 transition-colors hover:text-slate-700 dark:hover:text-slate-300">
                By Assignee
              </button>
              <button className="pb-3 pt-1.5 px-1 transition-colors hover:text-slate-700 dark:hover:text-slate-300">
                Timeline View
              </button>
              <button className="pb-3 pt-1.5 px-1 transition-colors hover:text-slate-700 dark:hover:text-slate-300">
                List View
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 border rounded-xl text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer bg-slate-100 dark:bg-[#151720]/80 border-slate-200 dark:border-[#232634] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#151720]">
                <SlidersHorizontal className="w-3.5 h-3.5" /> Sort By: Newest
              </button>
              <button className="px-3 py-1.5 border rounded-xl text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer bg-slate-100 dark:bg-[#151720]/80 border-slate-200 dark:border-[#232634] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#151720]">
                <FileDown className="w-3.5 h-3.5" /> Export
              </button>
            </div>
          </div>

          {/* Kanban Columns Grid */}
          <div className="flex-1 p-8 overflow-x-auto select-none transition-colors duration-200 bg-[#f4f6f9] dark:bg-[#090a0f]">
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
          />
        </div>
      )}
    </DashboardShell>
  );
}
