import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import { ReactNode } from 'react'

export const metadata = {
  title: 'Task Management System',
  description: 'Production-ready task management application',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
