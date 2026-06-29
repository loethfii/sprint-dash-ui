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
