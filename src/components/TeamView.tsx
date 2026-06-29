import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Mail, Shield, UserPlus, Key, X } from 'lucide-react';
import type { Member } from '../types';
import ConfirmDeleteModal from './ConfirmDeleteModal';

interface TeamViewProps {
  isDarkMode: boolean;
  members: Member[];
  onCreateMember: (member: Member) => Promise<void>;
  onUpdateMember: (id: string | number, fields: Partial<Member>) => Promise<void>;
  onDeleteMember: (id: string | number) => Promise<void>;
}

const getInitials = (name: string): string => {
  if (!name) return '';
  const words = name.trim().split(/\s+/);
  return words
    .slice(0, 3)
    .map(w => w.charAt(0).toUpperCase())
    .join('');
};

export default function TeamView({
  isDarkMode,
  members,
  onCreateMember,
  onUpdateMember,
  onDeleteMember
}: TeamViewProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | number | null>(null);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('staff');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);

  const handleSubmitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !username.trim() || !password.trim()) return;

    setError('');
    setIsSubmitting(true);
    try {
      await onCreateMember({
        id: Date.now(),
        name,
        username,
        password,
        email,
        phoneNumber,
        role
      });
      setName('');
      setUsername('');
      setPassword('');
      setEmail('');
      setPhoneNumber('');
      setRole('staff');
      setIsAdding(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create member.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEdit = (member: Member) => {
    setError('');
    setIsEditing(member.id);
    setName(member.name);
    setUsername(member.username || '');
    setPassword(''); // leave empty to not change unless typed
    setEmail(member.email);
    setPhoneNumber(member.phoneNumber || '');
    setRole(member.role);
  };

  const handleSubmitEdit = async (e: React.FormEvent, id: string | number) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !username.trim()) return;

    setError('');
    setIsSubmitting(true);
    try {
      const updateFields: Partial<Member> = {
        name,
        username,
        email,
        phoneNumber,
        role
      };
      if (password.trim()) {
        updateFields.password = password;
      }
      await onUpdateMember(id, updateFields);
      setIsEditing(null);
      setName('');
      setUsername('');
      setPassword('');
      setEmail('');
      setPhoneNumber('');
    } catch (err: any) {
      setError(err.message || 'Failed to update member.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGeneratePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(result);
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto custom-scrollbar space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Team Management</h2>
          <p className="text-xs text-slate-500">IAM role provisioning, access keys, and active workspace contributors</p>
        </div>
        <button
          onClick={() => {
            setIsEditing(null);
            setName('');
            setUsername('');
            setPassword('');
            setEmail('');
            setPhoneNumber('');
            setRole('staff');
            setIsAdding(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-[0_4px_12px_rgba(99,102,241,0.25)] cursor-pointer"
        >
          <UserPlus className="w-4.5 h-4.5" /> Provision Member
        </button>
      </div>

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
                return (
                  <tr key={member.id} className="transition-colors hover:bg-slate-50/50 dark:hover:bg-[#151720]/30">

                    {/* Identity Info */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-9 h-9 rounded-full flex items-center justify-center text-white font-extrabold text-[11px] shadow-sm border border-indigo-400/20 tracking-wider"
                          style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #a855f7 100%)' }}
                        >
                          {getInitials(member.name)}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold truncate text-slate-800 dark:text-white">
                            {member.name}
                          </span>
                          <span className="text-[10px] text-slate-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {member.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Role Info */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        <Shield className="w-3.5 h-3.5 text-indigo-400" /> {member.role}
                      </div>
                    </td>

                    {/* Status Info */}
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Active
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleStartEdit(member)}
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-[#1c1e2a] text-slate-500 hover:text-indigo-400 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setMemberToDelete(member)}
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Member Modal */}
      {(isAdding || isEditing !== null) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="dark:bg-[#0f111a] bg-white border border-slate-200 dark:border-[#1f2130] w-full max-w-md rounded-2xl overflow-hidden flex flex-col shadow-2xl text-slate-800 dark:text-slate-300">

            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-[#1f2130]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {isAdding ? 'Provision Member' : 'Edit Member'}
              </h3>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setIsEditing(null);
                }}
                className="p-1 hover:bg-slate-100 dark:hover:bg-[#1c1e2a] rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mx-5 mt-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs rounded-xl px-4 py-3 font-medium">
                {error}
              </div>
            )}

            {/* Content Form */}
            <form onSubmit={isAdding ? handleSubmitAdd : (e) => handleSubmitEdit(e, isEditing!)} className="p-5 space-y-4">
              <div className="space-y-3.5">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Full Name</span>
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border rounded-xl px-3.5 py-2.5 text-xs outline-none transition-colors bg-slate-50 dark:bg-[#151720] border-slate-200 dark:border-[#222535] text-slate-800 dark:text-white focus:border-indigo-500/50"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Username</span>
                  <input
                    type="text"
                    placeholder="e.g. johndoe123"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full border rounded-xl px-3.5 py-2.5 text-xs outline-none transition-colors bg-slate-50 dark:bg-[#151720] border-slate-200 dark:border-[#222535] text-slate-800 dark:text-white focus:border-indigo-500/50"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Email Address</span>
                  <input
                    type="email"
                    placeholder="e.g. john@sprintdash.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border rounded-xl px-3.5 py-2.5 text-xs outline-none transition-colors bg-slate-50 dark:bg-[#151720] border-slate-200 dark:border-[#222535] text-slate-800 dark:text-white focus:border-indigo-500/50"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                      {isAdding ? 'Password' : 'Password (leave empty to keep current)'}
                    </span>
                    <button
                      type="button"
                      onClick={handleGeneratePassword}
                      className="text-[10px] text-indigo-500 hover:text-indigo-400 font-bold uppercase cursor-pointer flex items-center gap-1 transition-colors"
                    >
                      <Key className="w-3 h-3" /> Generate
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder={isAdding ? 'e.g. 5-char password' : 'Enter new password...'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border rounded-xl px-3.5 py-2.5 text-xs outline-none transition-colors bg-slate-50 dark:bg-[#151720] border-slate-200 dark:border-[#222535] text-slate-800 dark:text-white focus:border-indigo-500/50"
                    required={isAdding}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Phone Number</span>
                    <input
                      type="text"
                      placeholder="e.g. 0899292921"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full border rounded-xl px-3.5 py-2.5 text-xs outline-none transition-colors bg-slate-50 dark:bg-[#151720] border-slate-200 dark:border-[#222535] text-slate-800 dark:text-white focus:border-indigo-500/50"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">System Role</span>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full border rounded-xl px-3.5 py-2.5 text-xs outline-none transition-colors bg-slate-50 dark:bg-[#151720] border-slate-200 dark:border-[#222535] text-slate-800 dark:text-white dark:focus:text-white focus:border-indigo-500/50 cursor-pointer"
                    >
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="staff">Staff</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-[#1f2130] mt-5">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => {
                    setIsAdding(false);
                    setIsEditing(null);
                  }}
                  className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-[#1c1e2a] text-slate-500 dark:text-slate-400 rounded-xl text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/15 cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmitting && (
                    <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {isAdding ? 'Provision Member' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={memberToDelete !== null}
        onClose={() => setMemberToDelete(null)}
        onConfirm={() => {
          if (memberToDelete) {
            onDeleteMember(memberToDelete.id);
            setMemberToDelete(null);
          }
        }}
        title="Delete Team Member"
        message={`Are you sure you want to delete member "${memberToDelete?.name}"? This action cannot be undone.`}
      />
    </div>
  );
}
