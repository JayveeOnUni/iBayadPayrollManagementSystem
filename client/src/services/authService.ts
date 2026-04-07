import { api } from './api'
import type { AuthResponse, LoginCredentials, User } from '../types'

export const authService = {
  login: (credentials: LoginCredentials) =>
    api.post<AuthResponse>('/auth/login', credentials),

  logout: () =>
    api.post<void>('/auth/logout'),

  me: () =>
    api.get<{ data: User }>('/auth/me'),

  refreshToken: (refreshToken: string) =>
    api.post<AuthResponse>('/auth/refresh', { refreshToken }),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.post<void>('/auth/change-password', { currentPassword, newPassword }),

  forgotPassword: (email: string) =>
    api.post<void>('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) =>
    api.post<void>('/auth/reset-password', { token, password }),
}
