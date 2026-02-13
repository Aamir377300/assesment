import { AuthResponse, TasksResponse, TaskResponse, ApiError, UsersResponse, UserWithTasksResponse } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002/api/v1'

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>
}

/**
 * Generic API request handler
 */
async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const url = `${API_URL}${endpoint}`

  const config: RequestOptions = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()

    if (!response.ok) {
      const errorData = data as ApiError
      throw new Error(errorData.error || errorData.errors?.[0] || 'Something went wrong')
    }

    return data as T
  } catch (error) {
    throw error
  }
}

/**
 * Authentication API calls
 */
export const authAPI = {
  register: async (userData: { name: string; email: string; password: string }): Promise<AuthResponse> => {
    return apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  },

  login: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    return apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  },
}

/**
 * Tasks API calls
 */
export const tasksAPI = {
  getAll: async (token: string, date?: string): Promise<TasksResponse> => {
    const url = date ? `/tasks?date=${date}` : '/tasks'
    return apiRequest<TasksResponse>(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  },

  getOne: async (id: string, token: string): Promise<TaskResponse> => {
    return apiRequest<TaskResponse>(`/tasks/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  },

  create: async (taskData: { title: string; description?: string; status?: string; dueDate?: string }, token: string): Promise<TaskResponse> => {
    return apiRequest<TaskResponse>('/tasks', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(taskData),
    })
  },

  update: async (id: string, taskData: { title?: string; description?: string; status?: string; dueDate?: string }, token: string): Promise<TaskResponse> => {
    return apiRequest<TaskResponse>(`/tasks/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(taskData),
    })
  },

  delete: async (id: string, token: string): Promise<{ success: boolean }> => {
    return apiRequest<{ success: boolean }>(`/tasks/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  },
}


/**
 * Users API calls (Admin)
 */
export const usersAPI = {
  getAll: async (token: string): Promise<UsersResponse> => {
    return apiRequest<UsersResponse>('/users', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  },

  getById: async (id: string, token: string): Promise<UserWithTasksResponse> => {
    return apiRequest<UserWithTasksResponse>(`/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  },

  updateRole: async (id: string, role: 'user' | 'admin', token: string): Promise<{ success: boolean }> => {
    return apiRequest<{ success: boolean }>(`/users/${id}/role`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role }),
    })
  },

  delete: async (id: string, token: string): Promise<{ success: boolean }> => {
    return apiRequest<{ success: boolean }>(`/users/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  },
}
