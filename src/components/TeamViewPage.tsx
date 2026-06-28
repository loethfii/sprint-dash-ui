import React, { useState } from 'react';
import DashboardShell from './DashboardShell';
import TeamView from './TeamView';
import type { Member } from '../types';

export default function TeamViewPage() {
  const [members, setMembers] = useState<Member[]>([
    { id: 1, name: "Azunyan U. Wu", email: "azunyan@sprintdash.com", role: "Product Designer", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" },
    { id: 2, name: "Ronaldo S.", email: "ronaldo@sprintdash.com", role: "Developer", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop" },
    { id: 3, name: "Lia Martinez", email: "lia@sprintdash.com", role: "QA Lead", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop" }
  ]);

  const handleCreateMember = (member: Member) => {
    setMembers([...members, member]);
  };

  const handleUpdateMember = (id: number, fields: Partial<Member>) => {
    setMembers(members.map(m => m.id === id ? { ...m, ...fields } as Member : m));
  };

  const handleDeleteMember = (id: number) => {
    setMembers(members.filter(m => m.id !== id));
  };

  return (
    <DashboardShell activeTab="team" title="Team Management">
      {(isDarkMode) => (
        <TeamView
          isDarkMode={isDarkMode}
          members={members}
          onCreateMember={handleCreateMember}
          onUpdateMember={handleUpdateMember}
          onDeleteMember={handleDeleteMember}
        />
      )}
    </DashboardShell>
  );
}
