import { api } from './api'
import type { AttendanceRecord, AttendanceRequest, ApiResponse } from '../types'
import { mapAttendance, mapAttendanceRequest } from './mappers'

export interface AttendanceListParams {
  page?: number
  limit?: number
  employeeId?: string
  startDate?: string
  endDate?: string
  status?: string
}

export interface AttendanceRequestPayload {
  date: string
  requestedStatus?: AttendanceRecord['status']
  requestedTimeIn?: string
  requestedTimeOut?: string
  reason: string
  type?: AttendanceRequest['type']
}

export const attendanceService = {
  // Records
  list: (params?: AttendanceListParams) =>
    api.get<ApiResponse<Record<string, unknown>[]>>('/attendance', params as Record<string, string | number | boolean>)
      .then((res) => ({
        success: res.success,
        data: res.data.map(mapAttendance),
        total: res.data.length,
        page: params?.page ?? 1,
        limit: params?.limit ?? res.data.length,
        totalPages: 1,
      })),

  getById: (id: string) =>
    api.get<ApiResponse<AttendanceRecord>>(`/attendance/${id}`),

  getMyAttendance: (params?: AttendanceListParams) =>
    api.get<ApiResponse<Record<string, unknown>[]>>('/attendance/my-logs', params as Record<string, string | number | boolean>)
      .then((res) => ({
        success: res.success,
        data: res.data.map(mapAttendance),
        total: res.data.length,
        page: params?.page ?? 1,
        limit: params?.limit ?? res.data.length,
        totalPages: 1,
      })),

  clockIn: () =>
    api.post<ApiResponse<AttendanceRecord>>('/attendance/clock-in'),

  clockOut: () =>
    api.post<ApiResponse<AttendanceRecord>>('/attendance/clock-out'),

  update: (id: string, data: Partial<AttendanceRecord>) =>
    api.put<ApiResponse<AttendanceRecord>>(`/attendance/${id}`, data),

  // Requests
  listRequests: (params?: Record<string, string | number | boolean>) =>
    api.get<ApiResponse<Record<string, unknown>[]>>('/attendance/requests', params)
      .then((res) => ({
        success: res.success,
        data: res.data.map(mapAttendanceRequest),
        total: res.data.length,
        page: Number(params?.page ?? 1),
        limit: Number(params?.limit ?? res.data.length),
        totalPages: 1,
      })),

  submitRequest: (data: AttendanceRequestPayload) =>
    api.post<ApiResponse<Record<string, unknown>>>('/attendance/requests', data)
      .then((res) => ({ ...res, data: mapAttendanceRequest(res.data) })),

  approveRequest: (id: string, remarks?: string) =>
    api.put<ApiResponse<Record<string, unknown>>>(`/attendance/requests/${id}`, { action: 'approve', remarks })
      .then((res) => ({ ...res, data: mapAttendanceRequest(res.data) })),

  rejectRequest: (id: string, reason: string) =>
    api.put<ApiResponse<Record<string, unknown>>>(`/attendance/requests/${id}`, { action: 'reject', remarks: reason })
      .then((res) => ({ ...res, data: mapAttendanceRequest(res.data) })),

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
