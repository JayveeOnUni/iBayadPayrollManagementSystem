import { api } from './api'
import type { PayrollPeriod, PayrollRecord, ApiResponse } from '../types'
import { useAuthStore } from '../store/authStore'
import { mapPayrollPeriod, mapPayrollRecord } from './mappers'

export interface PayrollListParams {
  page?: number
  limit?: number
  periodId?: string
  employeeId?: string
  status?: string
}

export const payrollService = {
  // Periods
  listPeriods: (params?: Record<string, string | number | boolean>) =>
    api.get<ApiResponse<Record<string, unknown>[]>>('/payroll/periods', params)
      .then((res) => ({
        success: res.success,
        data: res.data.map(mapPayrollPeriod),
        total: res.data.length,
        page: Number(params?.page ?? 1),
        limit: Number(params?.limit ?? res.data.length),
        totalPages: 1,
      })),

  getPeriod: (id: string) =>
    api.get<ApiResponse<Record<string, unknown>>>(`/payroll/periods/${id}`)
      .then((res) => ({ ...res, data: mapPayrollPeriod(res.data) })),

  createPeriod: (data: Partial<PayrollPeriod>) =>
    api.post<ApiResponse<Record<string, unknown>>>('/payroll/periods', {
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate,
      payDate: data.payDate,
      payFrequency: data.frequency,
    }).then((res) => ({ ...res, data: mapPayrollPeriod(res.data) })),

  updatePeriod: (id: string, data: Partial<PayrollPeriod>) =>
    api.put<ApiResponse<PayrollPeriod>>(`/payroll/periods/${id}`, data),

  // Records
  listRecords: (params?: PayrollListParams) =>
    api.get<ApiResponse<Record<string, unknown>[]>>('/payroll/records', params as Record<string, string | number | boolean>)
      .then((res) => ({
        success: res.success,
        data: res.data.map(mapPayrollRecord),
        total: res.data.length,
        page: params?.page ?? 1,
        limit: params?.limit ?? res.data.length,
        totalPages: 1,
      })),

  getRecord: (id: string) =>
    api.get<ApiResponse<PayrollRecord>>(`/payroll/records/${id}`),

  processPayroll: (periodId: string) =>
    api.post<ApiResponse<{ processed: number; errors: Array<{ employeeId: string; error: string }>; message: string }>>('/payroll/process', { payrollPeriodId: periodId }),

  approvePayroll: (periodId: string) =>
    api.post<ApiResponse<PayrollPeriod>>(`/payroll/periods/${periodId}/approve`),

  markAsPaid: (periodId: string) =>
    api.post<ApiResponse<PayrollPeriod>>(`/payroll/periods/${periodId}/release`),

  generatePayslip: (recordId: string) =>
    fetch(`/api/payroll/records/${recordId}/payslip`, {
      headers: { Authorization: `Bearer ${useAuthStore.getState().tokens?.accessToken ?? ''}` },
    }),

  getMyPayslips: (params?: Record<string, string | number | boolean>) =>
    api.get<ApiResponse<Record<string, unknown>[]>>('/payroll/my-records', params)
      .then((res) => ({
        success: res.success,
        data: res.data.map(mapPayrollRecord),
        total: res.data.length,
        page: Number(params?.page ?? 1),
        limit: Number(params?.limit ?? res.data.length),
        totalPages: 1,
      })),
}
