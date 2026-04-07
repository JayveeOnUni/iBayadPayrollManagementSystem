import { api } from './api'
import type { LeaveApplication, LeaveBalance, LeaveApplicationFormData, PaginatedResponse, ApiResponse } from '../types'

export interface LeaveListParams {
  page?: number
  limit?: number
  employeeId?: string
  leaveType?: string
  status?: string
  year?: number
}

export const leaveService = {
  // Applications
  list: (params?: LeaveListParams) =>
    api.get<PaginatedResponse<LeaveApplication>>('/leave', params as Record<string, string | number | boolean>),

  getById: (id: string) =>
    api.get<ApiResponse<LeaveApplication>>(`/leave/${id}`),

  apply: (data: LeaveApplicationFormData) =>
    api.post<ApiResponse<LeaveApplication>>('/leave', data),

  cancel: (id: string) =>
    api.patch<ApiResponse<LeaveApplication>>(`/leave/${id}/cancel`),

  approve: (id: string) =>
    api.patch<ApiResponse<LeaveApplication>>(`/leave/${id}/approve`),

  reject: (id: string, reason: string) =>
    api.patch<ApiResponse<LeaveApplication>>(`/leave/${id}/reject`, { reason }),

  // Balances
  getBalances: (employeeId: string, year?: number) =>
    api.get<ApiResponse<LeaveBalance[]>>('/leave/balances', { employeeId, ...(year ? { year } : {}) }),

  getMyBalances: (year?: number) =>
    api.get<ApiResponse<LeaveBalance[]>>('/leave/my-balances', year ? { year } : {}),

  getMyApplications: (params?: LeaveListParams) =>
    api.get<PaginatedResponse<LeaveApplication>>('/leave/my-applications', params as Record<string, string | number | boolean>),

  // Calendar
  getCalendar: (month: number, year: number) =>
    api.get<ApiResponse<LeaveApplication[]>>('/leave/calendar', { month, year }),
}
