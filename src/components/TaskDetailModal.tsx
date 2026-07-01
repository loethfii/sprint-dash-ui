import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  User,
  Tag,
  Flag,
  Layers,
  Plus,
  Trash2,
  Clock,
  CheckCircle2,
  Send
} from 'lucide-react';

import type { Task, Comment, Member } from '../types';

interface TaskDetailModalProps {
  task: Task | null;
  parentId: string | number | null;
  status: Task['status'];
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task, parentId: string | number | null) => Promise<void> | void;
  onDelete: (id: string | number) => void;
  members: Member[];
  projectName: string;
}

export default function TaskDetailModal({
  task,
  parentId,
  status,
  isOpen,
  onClose,
  onSave,
  onDelete,
  members,
  projectName
}: TaskDetailModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('low');
  const [taskStatus, setTaskStatus] = useState<Task['status']>('open');
  const [assigneeId, setAssigneeId] = useState<string | number>('');
  const [assigneeName, setAssigneeName] = useState('Unassigned');
  const [assigneeAvatar, setAssigneeAvatar] = useState('');
  const [subtasksList, setSubtasksList] = useState<Task[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [commentsList, setCommentsList] = useState<Comment[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setPriority(task.priority || 'low');
      setTaskStatus(task.status || 'open');
      if (task.assignees && task.assignees[0]) {
        setAssigneeId(task.assignees[0].id || '');
        setAssigneeName(task.assignees[0].name);
        setAssigneeAvatar(task.assignees[0].avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(task.assignees[0].name)}`);
      } else {
        setAssigneeId('');
        setAssigneeName('Unassigned');
        setAssigneeAvatar('');
      }
      setSubtasksList(task.subtasks || []);
      setCommentsList(task.commentsData || []);
      setStartTime(task.startTime || '');
      setEndTime(task.endTime || '');
    } else {
      setTitle('');
      setDescription('');
      setPriority('low');
      setTaskStatus(status || 'open');
      setAssigneeId('');
      setAssigneeName('Unassigned');
      setAssigneeAvatar('');
      setSubtasksList([]);
      setCommentsList([]);
      setStartTime('');
      setEndTime('');
    }
  }, [task, status, isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!title.trim()) {
      alert("Task title is required!");
      return;
    }
    setIsSaving(true);
    try {
      await onSave({
        id: task ? task.id : '',
        title,
        description,
        priority,
        status: taskStatus,
        assignees: assigneeId ? [{ id: assigneeId, name: assigneeName, avatar: assigneeAvatar }] : [],
        subtasks: subtasksList,
        comments: commentsList.length,
        commentsData: commentsList,
        views: task ? task.views : 0,
        startTime,
        endTime,
      }, parentId);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    const newSub: Task = {
      id: '',
      title: newSubtaskTitle,
      description: '',
      status: 'open',
      priority: 'low',
      assignees: assigneeId ? [{ id: assigneeId, name: assigneeName, avatar: assigneeAvatar }] : [],
      subtasks: [],
      comments: 0
    };
    setSubtasksList([...subtasksList, newSub]);
    setNewSubtaskTitle('');
  };

  const handleAddComment = () => {
    if (!newCommentText.trim()) return;
    const newComment: Comment = {
      id: Date.now(),
      author: 'User',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=User`,
      text: newCommentText,
      time: 'Just now'
    };
    setCommentsList([...commentsList, newComment]);
    setNewCommentText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#0f111a] border border-[#1f2130] w-full max-w-2xl rounded-2xl overflow-hidden flex flex-col shadow-2xl max-h-[90vh] text-slate-300">

        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#1f2130]">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {task ? 'Edit Task Details' : 'Create New Task'}
          </span>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#1c1e2a] rounded-lg text-slate-500 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">

          {/* Main Title & Description Inputs */}
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-[#151720] px-4 border-none outline-none font-bold text-xl text-white placeholder-slate-400 w-full focus:ring-1 focus:ring-indigo-500/20 py-1 rounded"
              required
            />
            <textarea
              placeholder="Task Description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-[#151720] border border-[#222535] rounded-xl px-4 py-3 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#151720]/50 p-4 rounded-xl border border-[#222535]">
            {/* Status Selector */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> Status
              </span>
              <select
                value={taskStatus}
                onChange={(e) => setTaskStatus(e.target.value as Task['status'])}
                className="bg-[#151720] border border-[#222535] rounded-lg px-2.5 py-1.5 text-slate-300 text-[11px] font-semibold outline-none cursor-pointer"
              >
                <option value="open">Open</option>
                <option value="working">Working</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {/* Priority Selector */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                <Flag className="w-3.5 h-3.5 text-amber-400" /> Priority
              </span>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Task['priority'])}
                className="bg-[#151720] border border-[#222535] rounded-lg px-2.5 py-1.5 text-slate-300 text-[11px] font-semibold outline-none cursor-pointer"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="info">Info</option>
              </select>
            </div>

            {/* Assignee Selector */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                <User className="w-3.5 h-3.5 text-emerald-400" /> Assignee
              </span>
              <div className="flex items-center gap-2">
                {assigneeAvatar && (
                  <img
                    src={assigneeAvatar}
                    alt={assigneeName}
                    className="w-5.5 h-5.5 rounded-full object-cover border border-slate-700"
                  />
                )}
                <select
                  value={assigneeId}
                  onChange={(e) => {
                    const val = e.target.value;
                    setAssigneeId(val);
                    const selected = members.find(m => String(m.id) === String(val));
                    if (selected) {
                      setAssigneeName(selected.name);
                      setAssigneeAvatar(selected.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(selected.name)}`);
                    } else {
                      setAssigneeName('Unassigned');
                      setAssigneeAvatar('');
                    }
                  }}
                  className="bg-[#151720] border border-[#222535] rounded-lg px-2.5 py-1.5 text-slate-300 text-[11px] font-semibold outline-none cursor-pointer"
                >
                  <option value="">Unassigned</option>
                  {members.map(member => (
                    <option key={member.id} value={member.id}>{member.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Simulated Workspace */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                <Layers className="w-3.5 h-3.5 text-rose-400" /> Project Scope
              </span>
              <span className="text-[11px] font-bold px-2.5 py-1.5 bg-[#20222f] border border-[#2e3146] rounded-lg text-slate-300">
                {projectName || 'No Project Selected'}
              </span>
            </div>

            {/* Date Range Selector */}
            <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4 border-t border-[#222535] pt-4 mt-2">
              <div className="flex flex-col gap-1.5 text-xs">
                <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" /> Start Date
                </span>
                <input
                  type="date"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="bg-[#151720] border border-[#222535] rounded-lg px-2.5 py-1.5 text-slate-300 text-[11px] font-semibold outline-none cursor-pointer focus:border-indigo-500/50"
                />
              </div>
              <div className="flex flex-col gap-1.5 text-xs">
                <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-rose-400" /> Due Date (End)
                </span>
                <input
                  type="date"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="bg-[#151720] border border-[#222535] rounded-lg px-2.5 py-1.5 text-slate-300 text-[11px] font-semibold outline-none cursor-pointer focus:border-indigo-500/50"
                />
              </div>
            </div>
          </div>

          {/* Subtasks Section */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              Subtasks ({subtasksList.length})
            </h4>
            <div className="space-y-2">
              {subtasksList.map((sub, idx) => (
                <div
                  key={sub.id || idx}
                  className="flex items-center justify-between bg-[#151720]/40 border border-[#222535] rounded-xl px-4 py-2.5"
                >
                  <span className="text-xs font-medium text-slate-200">{sub.title}</span>
                  <span className="text-[9px] bg-slate-800 text-slate-500 font-bold px-2 py-0.5 rounded border border-slate-700">
                    Subtask
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="text"
                placeholder="Add subtask title..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
                className="flex-1 bg-[#151720] border border-[#222535] rounded-xl px-3 py-2 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50"
              />
              <button
                onClick={handleAddSubtask}
                className="p-2 bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/20 text-indigo-400 hover:text-indigo-300 rounded-xl transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 border-t border-[#1f2130] bg-[#0c0d15] flex items-center justify-between">
          <div>
            {task && (
              <button
                onClick={() => onDelete(task.id)}
                className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 hover:border-rose-500/30 text-rose-400 hover:text-rose-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Task
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 hover:bg-[#1a1c2a] text-slate-400 hover:text-slate-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
             <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/15 transition-all active:scale-[0.98] disabled:scale-100 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center min-w-28"
            >
              {isSaving ? (
                <div className="flex items-center gap-1.5">
                  <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Saving...</span>
                </div>
              ) : 'Save Changes'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
