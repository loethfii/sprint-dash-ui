import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  MessageSquare,
  Eye,
  Plus,
  CheckSquare,
  MoreHorizontal,
  Calendar
} from 'lucide-react';
import type { Task } from '../types';

interface TaskTreeColumnProps {
  title: string;
  status: Task['status'];
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onAddTask: (status: Task['status'], parentId: string | number | null) => void;
  onToggleStatus: (id: string | number, status: Task['status']) => void;
  isDarkMode?: boolean;
}

export default function TaskTreeColumn({
  title,
  status,
  tasks,
  onSelectTask,
  onAddTask,
  onToggleStatus
}: TaskTreeColumnProps) {
  const columnColorClass = {
    open: 'bg-[#5f3afc] border-[#5f3afc]',
    working: 'bg-[#ff9f1c] border-[#ff9f1c]',
    closed: 'bg-[#2ec4b6] border-[#2ec4b6]',
    overdue: 'bg-[#ff6b6b] border-[#ff6b6b]',
  }[status] || 'bg-slate-600 border-slate-600';

  const badgeColorClass = {
    open: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
    working: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    closed: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    overdue: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
  }[status] || 'bg-slate-500/10 text-slate-400 border border-slate-500/20';

  return (
    <div className="flex flex-col rounded-2xl w-full h-[calc(100vh-140px)] min-w-[320px] bg-white dark:bg-[#0f111a] border border-slate-200 dark:border-[#1f2130] shadow-sm">
      {/* Column Header */}
      <div className="p-4 border-b flex items-center justify-between border-slate-100 dark:border-[#1f2130]">
        <div className="flex items-center gap-2.5">
          <div className={`w-3.5 h-3.5 rounded-full ${columnColorClass.split(' ')[0]}`}></div>
          <h3 className="font-semibold text-sm capitalize text-slate-800 dark:text-slate-200">{title}</h3>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${badgeColorClass}`}>
            {tasks.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onAddTask(status, null)}
            className="p-1.5 rounded-lg transition-colors cursor-pointer hover:bg-slate-100 dark:hover:bg-[#1a1c2a] text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
            title="Add task"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded-lg transition-colors cursor-pointer hover:bg-slate-100 dark:hover:bg-[#1a1c2a] text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Task List (Tree Container) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {tasks.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 text-center border-slate-200 dark:border-[#1f2130]/50">
            <span className="text-xs font-medium text-slate-400 dark:text-slate-600">No tasks in this status</span>
            <button
              onClick={() => onAddTask(status, null)}
              className="mt-2 text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              + Create a task
            </button>
          </div>
        ) : (
          tasks.map(task => (
            <TreeNode
              key={task.id}
              node={task}
              level={0}
              onSelectTask={onSelectTask}
              onAddTask={onAddTask}
              onToggleStatus={onToggleStatus}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface TreeNodeProps {
  node: Task;
  level: number;
  onSelectTask: (task: Task) => void;
  onAddTask: (status: Task['status'], parentId: string | number | null) => void;
  onToggleStatus: (id: string | number, status: Task['status']) => void;
}

// Recursive Tree Node Component
function TreeNode({ node, level, onSelectTask, onAddTask, onToggleStatus }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = node.subtasks && node.subtasks.length > 0;

  const priorityColors = {
    high: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
    medium: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    low: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  };

  const getPriorityLabel = (priority: Task['priority']) => {
    if (!priority) return 'Low';
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  const formatDateRange = (start?: string, end?: string) => {
    if (!start && !end) return null;
    const formatDate = (dateStr?: string) => {
      if (!dateStr) return '';
      try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      } catch (e) {
        return dateStr;
      }
    };
    if (start && end) return `${formatDate(start)} - ${formatDate(end)}`;
    if (start) return `Start: ${formatDate(start)}`;
    return `Due: ${formatDate(end)}`;
  };

  return (
    <div className="flex flex-col">
      {/* Node Card */}
      <div
        onClick={() => onSelectTask(node)}
        style={{ paddingLeft: `${level * 16 + 12}px` }}
        className="group relative border rounded-xl p-3.5 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md flex flex-col gap-3 bg-white dark:bg-[#151720]/80 hover:bg-slate-50 dark:hover:bg-[#1a1d29] border-slate-200 dark:border-[#222535] hover:border-indigo-500/30"
      >
        {/* Connection Line Indicator */}
        {level > 0 && (
          <div
            className="absolute left-3 top-0 bottom-6 border-l border-slate-200 dark:border-[#2e3146]"
            style={{ left: `${(level - 1) * 16 + 20}px` }}
          ></div>
        )}

        {/* Header (Priority & Toggle Action) */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 min-w-0">
            {hasChildren && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
                className="p-0.5 rounded transition-colors hover:bg-slate-100 dark:hover:bg-[#222535] text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
              >
                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                )}
              </button>
            )}
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${priorityColors[node.priority] || priorityColors.low}`}>
              {getPriorityLabel(node.priority)}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddTask(node.status, node.id);
              }}
              className="p-1 rounded opacity-0 group-hover:opacity-100 transition-all cursor-pointer hover:bg-slate-100 dark:hover:bg-[#222535] text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400"
              title="Add subtask"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Task Title & Description */}
        <div className="flex flex-col gap-1 min-w-0">
          <h4 className="text-xs font-semibold transition-colors truncate text-slate-800 dark:text-slate-100 group-hover:text-slate-950 dark:group-hover:text-white">
            {node.title}
          </h4>
          {node.description && (
            <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
              {node.description}
            </p>
          )}
          {formatDateRange(node.startTime, node.endTime) && (
            <div className="flex items-center gap-1.5 text-[9px] text-slate-400 dark:text-slate-500 mt-1 font-medium bg-slate-100 dark:bg-slate-800/40 px-1.5 py-0.5 rounded w-fit">
              <Calendar className="w-2.5 h-2.5 text-indigo-400" />
              <span>{formatDateRange(node.startTime, node.endTime)}</span>
            </div>
          )}
        </div>

        {/* Footer (Assignee & Stats) */}
        <div className="flex items-center justify-between border-t pt-2.5 mt-0.5 border-slate-100 dark:border-[#202333]/50">
          <div className="flex items-center -space-x-1.5 overflow-hidden">
            {node.assignees && node.assignees.length > 0 ? (
              node.assignees.map((assignee, idx) => (
                <img
                  key={idx}
                  src={assignee.avatar}
                  alt={assignee.name}
                  className="w-5.5 h-5.5 rounded-full object-cover border border-white dark:border-[#151720]"
                  title={assignee.name}
                />
              ))
            ) : (
              <div className="w-5.5 h-5.5 rounded-full border border-dashed border-slate-600 bg-slate-800 flex items-center justify-center text-[8px] text-slate-400">
                U
              </div>
            )}
          </div>

          <div className="flex items-center gap-2.5 text-[10px] text-slate-500 font-medium">
            {hasChildren && (
              <span className="flex items-center gap-1 hover:text-slate-300">
                <CheckSquare className="w-3 h-3" />
                {node.subtasks?.length}
              </span>
            )}
            {node.comments !== undefined && (
              <span className="flex items-center gap-1 hover:text-slate-300">
                <MessageSquare className="w-3 h-3" />
                {node.comments}
              </span>
            )}
            {node.views !== undefined && (
              <span className="flex items-center gap-1 hover:text-slate-300">
                <Eye className="w-3 h-3" />
                {node.views}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Nested Children (Recursive) */}
      {hasChildren && isExpanded && (
        <div className="mt-2 flex flex-col gap-2">
          {node.subtasks?.map(child => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              onSelectTask={onSelectTask}
              onAddTask={onAddTask}
              onToggleStatus={onToggleStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}
