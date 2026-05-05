import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { authService } from '../services/authService'
import type { LoginCredentials } from '../types'

export function useAuth() {
  const { user, isAuthenticated, isLoading, setAuth, logout: clearAuth, setLoading } = useAuthStore()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  const login = async (credentials: LoginCredentials) => {
    try {
      setError(null)
      setLoading(true)
      const response = await authService.login(credentials)
      setAuth(response.user, response.tokens)
      if (response.user.role === 'employee') {
        navigate('/employee/dashboard')
      } else {
        navigate('/admin/dashboard')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch {
      // ignore server error on logout
    } finally {
      clearAuth()
      navigate('/login')
    }
  }

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      setError(null)
      await authService.changePassword(currentPassword, newPassword)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change password.')
      return false
    }
  }

  const isAdmin = user?.role === 'admin'

  return {
    user,
    isAuthenticated,
    isLoading,
    isAdmin,
    error,
    login,
    logout,
    changePassword,
  }
}
