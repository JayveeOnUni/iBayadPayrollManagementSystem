import { api } from './api'
import type { AttendanceRecord, AttendanceRequest, ApiResponse, OffsetBalance, OffsetCredit, OffsetUsage } from '../types'
import {
  mapAttendance,
  mapAttendanceRequest,
  mapOffsetBalance,
  mapOffsetCredit,
  mapOffsetUsage,
} from './mappers'

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
      totalOffsetEarnedHours: number
      totalOffsetUsedHours: number
      totalHoursWorked: number
    }>>(`/attendance/summary`, { employeeId, month, year }),

  getMyOffsetBalance: () =>
    api.get<ApiResponse<Record<string, unknown> | null>>('/attendance/my-offset-balance')
      .then((res) => ({ ...res, data: res.data ? mapOffsetBalance(res.data) : null })),

  listOffsetBalances: (params?: Record<string, string | number | boolean>) =>
    api.get<ApiResponse<Record<string, unknown>[]>>('/attendance/offset-balances', params)
      .then((res) => ({ ...res, data: res.data.map(mapOffsetBalance) as OffsetBalance[] })),

  listOffsetCredits: (params?: Record<string, string | number | boolean>) =>
    api.get<ApiResponse<Record<string, unknown>[]>>('/attendance/offset-credits', params)
      .then((res) => ({ ...res, data: res.data.map(mapOffsetCredit) as OffsetCredit[] })),

  approveOffsetCredit: (id: string, remarks?: string) =>
    api.put<ApiResponse<Record<string, unknown>>>(`/attendance/offset-credits/${id}`, { action: 'approve', remarks })
      .then((res) => ({ ...res, data: mapOffsetCredit(res.data) })),

  rejectOffsetCredit: (id: string, remarks?: string) =>
    api.put<ApiResponse<Record<string, unknown>>>(`/attendance/offset-credits/${id}`, { action: 'reject', remarks })
      .then((res) => ({ ...res, data: mapOffsetCredit(res.data) })),

  listOffsetUsages: (params?: Record<string, string | number | boolean>) =>
    api.get<ApiResponse<Record<string, unknown>[]>>('/attendance/offset-usages', params)
      .then((res) => ({ ...res, data: res.data.map(mapOffsetUsage) as OffsetUsage[] })),

  submitOffsetUsage: (data: { usageDate: string; requestedMinutes: number; reason: string; employeeId?: string }) =>
    api.post<ApiResponse<Record<string, unknown>>>('/attendance/offset-usages', data)
      .then((res) => ({ ...res, data: mapOffsetUsage(res.data) })),

  approveOffsetUsage: (id: string, approvedMinutes?: number, remarks?: string) =>
    api.put<ApiResponse<Record<string, unknown>>>(`/attendance/offset-usages/${id}`, { action: 'approve', approvedMinutes, remarks })
      .then((res) => ({ ...res, data: mapOffsetUsage(res.data) })),

  rejectOffsetUsage: (id: string, remarks?: string) =>
    api.put<ApiResponse<Record<string, unknown>>>(`/attendance/offset-usages/${id}`, { action: 'reject', remarks })
      .then((res) => ({ ...res, data: mapOffsetUsage(res.data) })),

  createOffsetAdjustment: (data: { employeeId: string; minutes: number; reason: string; date?: string }) =>
    api.post<ApiResponse<Record<string, unknown>>>('/attendance/offset-adjustments', data),
}
