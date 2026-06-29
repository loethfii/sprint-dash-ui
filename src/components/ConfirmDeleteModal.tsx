import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Project",
  message = "Are you sure you want to delete this project? This action cannot be undone."
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      {/* Modal Container */}
      <div className="bg-[#0f111a] border border-[#1f2130] w-full max-w-md rounded-2xl overflow-hidden flex flex-col shadow-2xl text-slate-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#1f2130]">
          <div className="flex items-center gap-2 text-rose-500 font-semibold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>{title}</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-[#1c1e2a] rounded-lg text-slate-500 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-sm text-slate-400 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Actions Footer */}
        <div className="flex justify-end gap-2 p-4 bg-[#151720]/40 border-t border-[#1f2130]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 hover:bg-[#1c1e2a] text-slate-400 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-rose-600/15 cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
