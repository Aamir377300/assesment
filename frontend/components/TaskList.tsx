'use client'

import { useState } from 'react'
import { tasksAPI } from '@/lib/api'
import { Task } from '@/types'
import TaskForm from './TaskForm'

interface TaskListProps {
  tasks: Task[]
  token: string
  onTaskUpdated: () => void
  onTaskDeleted: () => void
}

export default function TaskList({ tasks, token, onTaskUpdated, onTaskDeleted }: TaskListProps) {
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return

    try {
      setDeletingId(id)
      await tasksAPI.delete(id, token)
      onTaskDeleted()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setDeletingId(null)
    }
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
  }

  const handleTaskUpdated = () => {
    setEditingTask(null)
    onTaskUpdated()
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-xl text-gray-600">No tasks yet. Create your first task!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {editingTask && (
        <div className="mb-6">
          <TaskForm
            token={token}
            task={editingTask}
            onTaskCreated={handleTaskUpdated}
          />
          <button
            onClick={() => setEditingTask(null)}
            className="mt-2 text-gray-600 hover:text-gray-800"
          >
            Cancel Editing
          </button>
        </div>
      )}

      {tasks.map((task) => (
        <div
          key={task._id}
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {task.title}
              </h3>
              {task.description && (
                <p className="text-gray-600 mb-3">{task.description}</p>
              )}
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span
                  className={`px-3 py-1 rounded-full ${
                    task.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {task.status}
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </span>
                <span>
                  Created: {new Date(task.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex space-x-2 ml-4">
              <button
                onClick={() => handleEdit(task)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(task._id)}
                disabled={deletingId === task._id}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition disabled:bg-red-300"
              >
                {deletingId === task._id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
