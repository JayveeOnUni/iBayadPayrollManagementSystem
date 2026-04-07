import { api } from './api'
import type { AttendanceRecord, AttendanceRequest, PaginatedResponse, ApiResponse } from '../types'

export interface AttendanceListParams {
  page?: number
  limit?: number
  employeeId?: string
  startDate?: string
  endDate?: string
  status?: string
}

export const attendanceService = {
  // Records
  list: (params?: AttendanceListParams) =>
    api.get<PaginatedResponse<AttendanceRecord>>('/attendance', params as Record<string, string | number | boolean>),

  getById: (id: string) =>
    api.get<ApiResponse<AttendanceRecord>>(`/attendance/${id}`),

  getMyAttendance: (params?: AttendanceListParams) =>
    api.get<PaginatedResponse<AttendanceRecord>>('/attendance/me', params as Record<string, string | number | boolean>),

  clockIn: () =>
    api.post<ApiResponse<AttendanceRecord>>('/attendance/clock-in'),

  clockOut: () =>
    api.post<ApiResponse<AttendanceRecord>>('/attendance/clock-out'),

  update: (id: string, data: Partial<AttendanceRecord>) =>
    api.put<ApiResponse<AttendanceRecord>>(`/attendance/${id}`, data),

  // Requests
  listRequests: (params?: Record<string, string | number | boolean>) =>
    api.get<PaginatedResponse<AttendanceRequest>>('/attendance/requests', params),

  submitRequest: (data: Omit<AttendanceRequest, 'id' | 'status' | 'employeeId' | 'createdAt' | 'updatedAt'>) =>
    api.post<ApiResponse<AttendanceRequest>>('/attendance/requests', data),

  approveRequest: (id: string) =>
    api.patch<ApiResponse<AttendanceRequest>>(`/attendance/requests/${id}/approve`),

  rejectRequest: (id: string, reason: string) =>
    api.patch<ApiResponse<AttendanceRequest>>(`/attendance/requests/${id}/reject`, { reason }),

  // Summary
  getSummary: (employeeId: string, month: number, year: number) =>
    api.get<ApiResponse<{
      totalPresent: number
      totalAbsent: number
      totalLate: number
      totalOvertimeHours: number
      totalHoursWorked: number
    }>>(`/attendance/summary`, { employeeId, month, year }),
}
