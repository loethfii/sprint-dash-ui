import type { Project, Member, Task } from '../types';

const API_BASE_URL = import.meta.env.BASE_URL_SPRINT_DASH_API;
const API_BASE = `${API_BASE_URL}/api/v1`;

export interface MenuItem {
  id: string;
  icon: string;
  path: string;
  label: string;
  badge?: number;
}

export interface UserMenu {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  metadata: MenuItem[] | null;
}

export interface User {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  metadata?: any;
  name: string;
  username: string;
  email: string;
  phoneNumber: string;
  role: string;
  menu?: UserMenu | null;
}

export interface LoginResponse {
  data: {
    accessToken: string;
    user: User;
  };
  timestamp: string;
}

export interface MeResponse {
  data: User;
  timestamp: string;
}

// Cookie Helper
export const cookies = {
  get(name: string): string | undefined {
    if (typeof document === 'undefined') return undefined;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return undefined;
  },

  set(name: string, value: string, maxAgeSeconds: number = 86400) {
    if (typeof document !== 'undefined') {
      document.cookie = `${name}=${value}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
    }
  },

  delete(name: string) {
    if (typeof document !== 'undefined') {
      document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
    }
  }
};

// Auth services
export function getMeDecoded(): User | null {
  const encodedUser = cookies.get('userProfile');
  if (!encodedUser) return null;
  try {
    return JSON.parse(decodeURIComponent(atob(encodedUser)));
  } catch (e) {
    console.error("Failed to decode user profile from cookie", e);
    return null;
  }
}

export async function loginUser(identifier: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ identifier, password }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.message || 'Login failed');
  }

  const result: LoginResponse = await response.json();

  // Set in cookie on success client-side
  if (result.data?.accessToken) {
    cookies.set('accessToken', result.data.accessToken);
    // Fetch and store user profile as well
    try {
      const user = await getMe(result.data.accessToken);
      cookies.set('userProfile', btoa(encodeURIComponent(JSON.stringify(user))));
    } catch (e) {
      console.error("Failed to pre-fetch user profile during login", e);
    }
  }

  return result;
}

export async function getMe(customToken?: string): Promise<User> {
  const token = customToken || cookies.get('accessToken');
  if (!token) {
    throw new Error('No access token found');
  }

  const response = await fetch(`${API_BASE}/auth/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user profile');
  }

  const result: MeResponse = await response.json();

  // Cache user profile in cookie
  try {
    cookies.set('userProfile', btoa(encodeURIComponent(JSON.stringify(result.data))));
  } catch (e) {
    console.error("Failed to cache user profile in cookie", e);
  }

  return result.data;
}

export function logoutUser() {
  cookies.delete('accessToken');
  cookies.delete('userProfile');
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  timestamp: string;
  pagination?: Pagination;
}

export interface ProjectPayload {
  projectName: string;
  description: string;
  startDate: string;
  endDate: string;
  priority: string;
  scopeCategory: string;
}

const mapScopeToFrontend = (val: string): string => {
  if (!val) return 'Frontend';
  const v = val.toLowerCase();
  if (v === 'frontend' || v === 'frontent') return 'Frontend';
  if (v === 'backend') return 'Backend';
  if (v === 'database') return 'Database';
  if (v === 'infrastructure') return 'Infrastructure';
  return 'Frontend';
};

const mapScopeToBackend = (val: string): string => {
  if (!val) return 'FRONTENT';
  const v = val.toLowerCase();
  if (v === 'frontend' || v === 'frontent') return 'FRONTENT';
  if (v === 'backend') return 'BACKEND';
  if (v === 'database') return 'DATABASE';
  if (v === 'infrastructure') return 'Infrastructure';
  return 'FRONTENT';
};

export async function fetchProjects(page = 1, limit = 10): Promise<ApiResponse<Project[]>> {
  const token = cookies.get('accessToken');
  const response = await fetch(`${API_BASE}/projects?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch projects');
  }

  const result = await response.json();
  if (result.data && Array.isArray(result.data)) {
    result.data = result.data.map((p: any) => ({
      ...p,
      name: p.projectName || p.name || '',
      scope: mapScopeToFrontend(p.scopeCategory || p.scope),
      tasksCount: p.tasksCount || 0
    }));
  }
  return result;
}

export async function fetchProjectById(id: string | number): Promise<ApiResponse<Project>> {
  const token = cookies.get('accessToken');
  const response = await fetch(`${API_BASE}/projects/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch project');
  }

  const result = await response.json();
  if (result.data) {
    result.data = {
      ...result.data,
      name: result.data.projectName || result.data.name || '',
      scope: mapScopeToFrontend(result.data.scopeCategory || result.data.scope),
      tasksCount: result.data.tasksCount || 0
    };
  }
  return result;
}

export async function createProject(payload: ProjectPayload): Promise<ApiResponse<Project>> {
  const token = cookies.get('accessToken');
  const mappedPayload = {
    ...payload,
    scopeCategory: mapScopeToBackend(payload.scopeCategory)
  };
  const response = await fetch(`${API_BASE}/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(mappedPayload),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.message || 'Failed to create project');
  }

  const result = await response.json();
  if (result.data) {
    result.data = {
      ...result.data,
      name: result.data.projectName || result.data.name || '',
      scope: mapScopeToFrontend(result.data.scopeCategory || result.data.scope),
      tasksCount: result.data.tasksCount || 0
    };
  }
  return result;
}

export async function updateProject(id: string | number, payload: ProjectPayload): Promise<ApiResponse<Project>> {
  const token = cookies.get('accessToken');
  const mappedPayload = {
    ...payload,
    scopeCategory: mapScopeToBackend(payload.scopeCategory)
  };
  const response = await fetch(`${API_BASE}/projects/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(mappedPayload),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.message || 'Failed to update project');
  }

  const result = await response.json();
  if (result.data) {
    result.data = {
      ...result.data,
      name: result.data.projectName || result.data.name || '',
      scope: mapScopeToFrontend(result.data.scopeCategory || result.data.scope),
      tasksCount: result.data.tasksCount || 0
    };
  }
  return result;
}

export async function deleteProject(id: string | number): Promise<ApiResponse<{ message: string }>> {
  const token = cookies.get('accessToken');
  const response = await fetch(`${API_BASE}/projects/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete project');
  }

  return response.json();
}

export interface MemberPayload {
  name: string;
  username: string;
  email: string;
  phoneNumber: string;
  role: string;
  password?: string;
}

export async function fetchMembers(page = 1, limit = 10): Promise<ApiResponse<Member[]>> {
  const token = cookies.get('accessToken');
  const response = await fetch(`${API_BASE}/users?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error || errData?.message || 'Failed to fetch members');
  }

  return response.json();
}

export async function createMember(payload: MemberPayload): Promise<ApiResponse<Member>> {
  const token = cookies.get('accessToken');
  const response = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error || errData?.message || 'Failed to create member');
  }

  return response.json();
}

export async function updateMember(id: string | number, payload: MemberPayload): Promise<ApiResponse<Member>> {
  const token = cookies.get('accessToken');
  const response = await fetch(`${API_BASE}/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error || errData?.message || 'Failed to update member');
  }

  return response.json();
}

export async function deleteMember(id: string | number): Promise<ApiResponse<{ message: string }>> {
  const token = cookies.get('accessToken');
  const response = await fetch(`${API_BASE}/users/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error || errData?.message || 'Failed to delete member');
  }

  return response.json();
}

export interface TaskPayload {
  projectId: string;
  parentTaskId?: string | null;
  title: string;
  description: string;
  status: string;
  startTime: string;
  endTime: string;
  priority: string;
  child?: TaskPayload[];
}

export function mapFrontendTaskToPayload(task: Task, defaultProjectId: string): TaskPayload {
  const projectId = task.projectId || defaultProjectId;
  return {
    projectId,
    parentTaskId: task.parentTaskId ? String(task.parentTaskId) : null,
    title: task.title,
    description: task.description || '',
    status: task.status || 'open',
    startTime: task.startTime || new Date().toISOString().split('T')[0],
    endTime: task.endTime || new Date().toISOString().split('T')[0],
    priority: task.priority || 'low',
    child: task.subtasks && task.subtasks.length > 0
      ? task.subtasks.map(sub => mapFrontendTaskToPayload(sub, projectId))
      : undefined
  };
}


export function mapBackendTaskToFrontend(task: any): Task {
  return {
    id: task.id,
    title: task.title,
    description: task.description || '',
    status: task.status || 'open',
    priority: task.priority || 'low',
    startTime: task.startTime ? task.startTime.split('T')[0] : '',
    endTime: task.endTime ? task.endTime.split('T')[0] : '',
    parentTaskId: task.parentTaskId || null,
    projectId: task.projectId,
    assignees: task.taskAssignment && task.taskAssignment.user
      ? [{
          name: task.taskAssignment.user.name,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(task.taskAssignment.user.name)}`
        }]
      : [],
    subtasks: task.child && Array.isArray(task.child)
      ? task.child.map(mapBackendTaskToFrontend)
      : [],
    comments: task.comments || 0,
    views: task.views || 0,
    commentsData: task.commentsData || []
  };
}

export async function fetchTasksTree(filters: {
  projectId?: string;
  assignedUser?: string;
  priority?: string;
  status?: string;
}): Promise<ApiResponse<Task[]>> {
  const token = cookies.get('accessToken');
  const params = new URLSearchParams();
  if (filters.projectId) params.append('projectId', filters.projectId);
  if (filters.assignedUser) params.append('assignedUser', filters.assignedUser);
  if (filters.priority) params.append('priority', filters.priority);
  if (filters.status) params.append('status', filters.status);

  const response = await fetch(`${API_BASE}/tasks/tree?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error || errData?.message || 'Failed to fetch tasks tree');
  }

  const result = await response.json();
  if (result.data && Array.isArray(result.data)) {
    result.data = result.data.map(mapBackendTaskToFrontend);
  }
  return result;
}

export async function fetchTaskById(id: string | number): Promise<ApiResponse<Task>> {
  const token = cookies.get('accessToken');
  const response = await fetch(`${API_BASE}/tasks/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error || errData?.message || 'Failed to fetch task');
  }

  const result = await response.json();
  if (result.data) {
    result.data = mapBackendTaskToFrontend(result.data);
  }
  return result;
}

export async function createTask(payload: Partial<TaskPayload>): Promise<ApiResponse<Task>> {
  const token = cookies.get('accessToken');
  const response = await fetch(`${API_BASE}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error || errData?.message || 'Failed to create task');
  }

  const result = await response.json();
  if (result.data) {
    result.data = mapBackendTaskToFrontend(result.data);
  }
  return result;
}

export async function updateTask(id: string | number, payload: Partial<TaskPayload>): Promise<ApiResponse<Task>> {
  const token = cookies.get('accessToken');
  const response = await fetch(`${API_BASE}/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error || errData?.message || 'Failed to update task');
  }

  const result = await response.json();
  if (result.data) {
    result.data = mapBackendTaskToFrontend(result.data);
  }
  return result;
}

export async function deleteTask(id: string | number): Promise<ApiResponse<{ message: string }>> {
  const token = cookies.get('accessToken');
  const response = await fetch(`${API_BASE}/tasks/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error || errData?.message || 'Failed to delete task');
  }

  return response.json();
}

export async function assignTask(taskId: string | number, userId: string): Promise<ApiResponse<any>> {
  const token = cookies.get('accessToken');
  const response = await fetch(`${API_BASE}/tasks/${taskId}/assign`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error || errData?.message || 'Failed to assign task');
  }

  return response.json();
}
