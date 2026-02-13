'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { tasksAPI } from '@/lib/api'
import { Task } from '@/types'
import TaskList from './TaskList'
import TaskForm from './TaskForm'
import DateFilter from './DateFilter'

export default function DashboardClient() {
  const router = useRouter()
  const { user, token, logout, loading: authLoading } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    if (!authLoading && !token) {
      router.push('/login')
      return
    }
    
    // Redirect admin users to admin dashboard
    if (!authLoading && user?.role === 'admin') {
      router.push('/admin')
      return
    }
  }, [authLoading, token, user, router])

  useEffect(() => {
    if (token) {
      fetchTasks()
    }
  }, [token, selectedDate])

  const fetchTasks = async () => {
    if (!token) return
    
    try {
      setLoading(true)
      const response = await tasksAPI.getAll(token, selectedDate)
      setTasks(response.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleDateChange = (date: string) => {
    setSelectedDate(date)
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const handleTaskCreated = () => {
    setShowForm(false)
    fetchTasks()
  }

  const handleTaskUpdated = () => {
    fetchTasks()
  }

  const handleTaskDeleted = () => {
    fetchTasks()
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Task Management
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {user.role === 'admin' && (
                <button
                  onClick={() => router.push('/admin')}
                  className="text-blue-600 hover:text-blue-800 px-4 py-2"
                >
                  Admin Dashboard
                </button>
              )}
              <span className="text-gray-600">
                Welcome, {user.name}
                {user.role === 'admin' && (
                  <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                    Admin
                  </span>
                )}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <DateFilter selectedDate={selectedDate} onDateChange={handleDateChange} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-800">Your Tasks</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {showForm ? 'Cancel' : 'New Task'}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {showForm && token && (
          <div className="mb-6">
            <TaskForm token={token} onTaskCreated={handleTaskCreated} />
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl text-gray-600">Loading tasks...</div>
          </div>
        ) : token ? (
          <TaskList
            tasks={tasks}
            token={token}
            onTaskUpdated={handleTaskUpdated}
            onTaskDeleted={handleTaskDeleted}
          />
        ) : null}
      </main>
    </div>
  )
}
