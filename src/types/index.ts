export interface Assignee {
  name: string;
  avatar: string;
}

export interface Comment {
  id: number;
  author: string;
  avatar: string;
  text: string;
  time: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'open' | 'working' | 'closed' | 'overdue';
  priority: 'high' | 'medium' | 'low' | 'info';
  assignees: Assignee[];
  comments?: number;
  views?: number;
  commentsData?: Comment[];
  subtasks?: Task[];
  startTime?: string;
  endTime?: string;
}

export interface Project {
  id: string | number;
  name: string;
  description: string | null;
  scope: string;
  tasksCount: number;
  projectName?: string;
  scopeCategory?: string;
  startDate?: string;
  endDate?: string;
  priority?: string;
}

export interface Member {
  id: string | number;
  name: string;
  username?: string;
  email: string;
  phoneNumber?: string;
  role: string;
  avatar?: string;
  password?: string;
}
