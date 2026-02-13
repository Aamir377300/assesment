export interface User {
  _id: string
  name: string
  email: string
  role: 'user' | 'admin'
  createdAt: string
}

export interface UserWithTasks {
  user: User
  tasks: Task[]
}

export interface UsersResponse {
  success: boolean
  count: number
  data: User[]
}

export interface UserResponse {
  success: boolean
  data: User
}

export interface UserWithTasksResponse {
  success: boolean
  data: UserWithTasks
}

export interface Task {
  _id: string
  title: string
  description?: string
  status: 'pending' | 'completed'
  dueDate: string
  user: string
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  success: boolean
  data: {
    token: string
    _id: string
    name: string
    email: string
    role: 'user' | 'admin'
    createdAt: string
  }
}

export interface TasksResponse {
  success: boolean
  data: Task[]
}

export interface TaskResponse {
  success: boolean
  data: Task
}

export interface ApiError {
  error?: string
  errors?: string[]
}
