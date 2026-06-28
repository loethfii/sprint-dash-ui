import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Mail, Shield, UserPlus, Key } from 'lucide-react';

import type { Member } from '../types';

interface TeamViewProps {
  isDarkMode: boolean;
  members: Member[];
  onCreateMember: (member: Member) => void;
  onUpdateMember: (id: number, fields: Partial<Member>) => void;
  onDeleteMember: (id: number) => void;
}

export default function TeamView({ 
  isDarkMode, 
  members, 
  onCreateMember, 
  onUpdateMember, 
  onDeleteMember 
}: TeamViewProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Developer');

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    
    // Choose a random avatar profile picture
    const avatarNumber = Math.floor(Math.random() * 50) + 10;
    const avatar = `https://images.unsplash.com/photo-${1500000000000 + avatarNumber * 100000}?q=80&w=100&auto=format&fit=crop`;
    
    onCreateMember({
      id: Date.now(),
      name,
      email,
      role,
      avatar
    });
    setName('');
    setEmail('');
    setRole('Developer');
    setIsAdding(false);
  };

  const handleStartEdit = (member: Member) => {
    setIsEditing(member.id);
    setName(member.name);
    setEmail(member.email);
    setRole(member.role);
  };

  const handleSubmitEdit = (e: React.FormEvent, id: number) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    onUpdateMember(id, {
      name,
      email,
      role
    });
    setIsEditing(null);
    setName('');
    setEmail('');
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto custom-scrollbar space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Team Management</h2>
          <p className="text-xs text-slate-500">IAM role provisioning, access keys, and active workspace contributors</p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-[0_4px_12px_rgba(99,102,241,0.25)] cursor-pointer"
          >
            <UserPlus className="w-4.5 h-4.5" /> Provision Member
          </button>
        )}
      </div>

      {/* Add Member Form Card */}
      {isAdding && (
        <form onSubmit={handleSubmitAdd} className="p-5 rounded-2xl border space-y-4 max-w-xl transition-all bg-white dark:bg-[#0f111a] border-slate-200 dark:border-[#1f2130] shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Provision Member Details
          </h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-xl px-4 py-2.5 text-xs outline-none transition-colors bg-slate-50 dark:bg-[#151720] border-slate-200 dark:border-[#222535] text-slate-800 dark:text-white focus:border-indigo-500/50"
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-xl px-4 py-2.5 text-xs outline-none transition-colors bg-slate-50 dark:bg-[#151720] border-slate-200 dark:border-[#222535] text-slate-800 dark:text-white focus:border-indigo-500/50"
              required
            />
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-500 font-medium">System Role</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="border rounded-lg px-2.5 py-1.5 text-[11px] font-semibold outline-none cursor-pointer bg-slate-50 dark:bg-[#151720] border-slate-200 dark:border-[#222535] text-slate-600 dark:text-slate-300"
              >
                <option value="Administrator">Administrator</option>
                <option value="Product Designer">Product Designer</option>
                <option value="Developer">Developer</option>
                <option value="QA Lead">QA Lead</option>
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
              Save Member
            </button>
          </div>
        </form>
      )}

      {/* Member Table Grid */}
      <div className="border rounded-2xl overflow-hidden transition-all bg-white dark:bg-[#0f111a] border-slate-200 dark:border-[#1f2130] shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] uppercase font-bold tracking-wider border-b border-slate-100 dark:border-[#1f2130] text-slate-400 dark:text-slate-500">
                <th className="py-4 px-6">Member Identity</th>
                <th className="py-4 px-6">Role & Scope</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-xs divide-slate-100 dark:divide-[#1f2130] text-slate-700 dark:text-slate-300">
              {members.map((member) => {
                const editingThis = isEditing === member.id;
                return (
                  <tr key={member.id} className="transition-colors hover:bg-slate-50/50 dark:hover:bg-[#151720]/30">
                    
                    {/* Identity Info */}
                    <td className="py-4 px-6">
                      {editingThis ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border rounded-lg px-2.5 py-1.5 text-xs outline-none bg-slate-50 dark:bg-[#151720] border-slate-200 dark:border-[#222535] text-slate-800 dark:text-white"
                          />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border rounded-lg px-2.5 py-1.5 text-xs outline-none block bg-slate-50 dark:bg-[#151720] border-slate-200 dark:border-[#222535] text-slate-800 dark:text-white"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-9 h-9 rounded-full object-cover border-2 border-indigo-500/20"
                          />
                          <div className="flex flex-col min-w-0">
                            <span className="font-semibold truncate text-slate-800 dark:text-white">
                              {member.name}
                            </span>
                            <span className="text-[10px] text-slate-500 flex items-center gap-1">
                              <Mail className="w-3 h-3" /> {member.email}
                            </span>
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Role Info */}
                    <td className="py-4 px-6">
                      {editingThis ? (
                        <select
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          className="border rounded-lg px-2 py-1 text-xs outline-none bg-slate-50 dark:bg-[#151720] border-slate-200 dark:border-[#222535] text-slate-600 dark:text-slate-300"
                        >
                          <option value="Administrator">Administrator</option>
                          <option value="Product Designer">Product Designer</option>
                          <option value="Developer">Developer</option>
                          <option value="QA Lead">QA Lead</option>
                        </select>
                      ) : (
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                          <Shield className="w-3.5 h-3.5 text-indigo-400" /> {member.role}
                        </div>
                      )}
                    </td>

                    {/* Status Info */}
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Active
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      {editingThis ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setIsEditing(null)}
                            className="px-2.5 py-1 hover:bg-slate-100 dark:hover:bg-[#1c1e2a] text-slate-400 rounded-lg"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={(e) => handleSubmitEdit(e, member.id)}
                            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleStartEdit(member)}
                            className="p-1.5 hover:bg-slate-100 dark:hover:bg-[#1c1e2a] text-slate-500 hover:text-indigo-400 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteMember(member.id)}
                            className="p-1.5 hover:bg-slate-100 dark:hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
