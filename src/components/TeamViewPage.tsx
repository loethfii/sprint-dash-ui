import React, { useState, useEffect } from 'react';
import DashboardShell from './DashboardShell';
import TeamView from './TeamView';
import type { Member } from '../types';
import { fetchMembers, createMember, updateMember, deleteMember } from '../services/api';

export default function TeamViewPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadMembers = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetchMembers();
      setMembers(res.data || []);
    } catch (err: any) {
      console.error("Failed to load team members:", err);
      setError(err.message || 'Gagal memuat anggota tim.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const handleCreateMember = async (member: Member) => {
    try {
      const res = await createMember({
        name: member.name,
        username: member.username || '',
        password: member.password || '',
        email: member.email,
        phoneNumber: member.phoneNumber || '',
        role: member.role
      });
      setMembers(prev => [...prev, res.data]);
    } catch (err: any) {
      console.error("Failed to create member:", err);
      throw err;
    }
  };

  const handleUpdateMember = async (id: string | number, fields: Partial<Member>) => {
    try {
      const existing = members.find(m => m.id === id);
      if (!existing) return;

      const res = await updateMember(id, {
        name: fields.name || existing.name,
        username: fields.username || existing.username || '',
        password: fields.password || '',
        email: fields.email || existing.email,
        phoneNumber: fields.phoneNumber !== undefined ? fields.phoneNumber : (existing.phoneNumber || ''),
        role: fields.role || existing.role
      });

      setMembers(prev => prev.map(m => m.id === id ? res.data : m));
    } catch (err: any) {
      console.error("Failed to update member:", err);
      throw err;
    }
  };

  const handleDeleteMember = async (id: string | number) => {
    try {
      await deleteMember(id);
      setMembers(prev => prev.filter(m => m.id !== id));
    } catch (err: any) {
      console.error("Failed to delete member:", err);
      alert(err.message || 'Gagal menghapus anggota.');
    }
  };

  return (
    <DashboardShell activeTab="team" title="Team Management">
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
                <span className="text-xs font-semibold">Memuat Anggota Tim...</span>
              </div>
            </div>
          ) : (
            <TeamView
              isDarkMode={isDarkMode}
              members={members}
              onCreateMember={handleCreateMember}
              onUpdateMember={handleUpdateMember}
              onDeleteMember={handleDeleteMember}
            />
          )}
        </div>
      )}
    </DashboardShell>
  );
}
