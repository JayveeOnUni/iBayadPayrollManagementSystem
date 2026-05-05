import { api } from './api'
import type { LeaveApplication, LeaveBalance, LeaveApplicationFormData, ApiResponse } from '../types'
import { mapLeave } from './mappers'

function mapLeaveBalance(row: Record<string, unknown>): LeaveBalance {
  const name = String(row.name ?? row.leave_type ?? row.leaveType ?? 'others')

  return {
    id: String(row.id ?? ''),
    employeeId: String(row.employee_id ?? row.employeeId ?? ''),
    leaveType: name.toLowerCase().replace(' leave', '').replace(/\s+/g, '_') as LeaveBalance['leaveType'],
    allocated: Number(row.allowance ?? row.allocated ?? 0),
    used: Number(row.taken ?? row.used ?? 0),
    remaining: Number(row.balance ?? row.remaining ?? 0),
    year: Number(row.year ?? new Date().getFullYear()),
  }
}

export interface LeaveListParams {
  page?: number
  limit?: number
  employeeId?: string
  leaveType?: string
  status?: string
  year?: number
}

export interface LeaveRequestPayload {
  employeeId?: string
  leaveTypeId: string
  startDate: string
  endDate: string
  reason: string
  isHalfDay?: boolean
}

export const leaveService = {
  // Applications
  list: (params?: LeaveListParams) =>
    api.get<ApiResponse<Record<string, unknown>[]>>('/leave/requests', params as Record<string, string | number | boolean>)
      .then((res) => ({
        success: res.success,
        data: res.data.map(mapLeave),
        total: res.data.length,
        page: params?.page ?? 1,
        limit: params?.limit ?? res.data.length,
        totalPages: 1,
      })),

  getById: (id: string) =>
    api.get<ApiResponse<LeaveApplication>>(`/leave/${id}`),

  apply: (data: LeaveApplicationFormData | LeaveRequestPayload) =>
    api.post<ApiResponse<Record<string, unknown>>>('/leave/requests', data)
      .then((res) => ({ ...res, data: mapLeave(res.data) })),

  cancel: (id: string) =>
    api.put<ApiResponse<Record<string, unknown>>>(`/leave/requests/${id}/cancel`)
      .then((res) => ({ ...res, data: mapLeave(res.data) })),

  approve: (id: string, remarks?: string) =>
    api.put<ApiResponse<Record<string, unknown>>>(`/leave/requests/${id}/review`, { action: 'approve', remarks })
      .then((res) => ({ ...res, data: mapLeave(res.data) })),

  reject: (id: string, reason: string) =>
    api.put<ApiResponse<Record<string, unknown>>>(`/leave/requests/${id}/review`, { action: 'reject', remarks: reason })
      .then((res) => ({ ...res, data: mapLeave(res.data) })),

  // Balances
  getBalances: (employeeId: string, year?: number) =>
    api.get<ApiResponse<Record<string, unknown>[]>>(`/leave/balance/${employeeId}`, year ? { year } : {})
      .then((res) => ({ ...res, data: res.data.map(mapLeaveBalance) })),

  getMyBalances: (year?: number) =>
    api.get<ApiResponse<Record<string, unknown>[]>>('/leave/balance', year ? { year } : {})
      .then((res) => ({ ...res, data: res.data.map(mapLeaveBalance) })),

  getMyApplications: (params?: LeaveListParams) =>
    api.get<ApiResponse<Record<string, unknown>[]>>('/leave/my-requests', params as Record<string, string | number | boolean>)
      .then((res) => ({
        success: res.success,
        data: res.data.map(mapLeave),
        total: res.data.length,
        page: params?.page ?? 1,
        limit: params?.limit ?? res.data.length,
        totalPages: 1,
      })),

  // Calendar
  getCalendar: (month: number, year: number) =>
    api.get<ApiResponse<Record<string, unknown>[]>>('/leave/calendar', { month, year })
      .then((res) => ({ ...res, data: res.data.map(mapLeave) })),

  getTypes: () =>
    api.get<ApiResponse<Array<{ id: string; name: string; code: string }>>>('/leave/types'),
}
