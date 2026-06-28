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
  status: 'open' | 'working' | 'closed';
  priority: 'high' | 'medium' | 'low' | 'info';
  assignees: Assignee[];
  comments?: number;
  views?: number;
  commentsData?: Comment[];
  subtasks?: Task[];
}

export interface Project {
  id: number;
  name: string;
  description: string;
  scope: string;
  tasksCount: number;
}

export interface Member {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string;
}
