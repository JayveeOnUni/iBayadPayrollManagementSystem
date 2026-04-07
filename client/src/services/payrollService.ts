import { api } from './api'
import type { PayrollPeriod, PayrollRecord, PaginatedResponse, ApiResponse } from '../types'

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
    api.get<PaginatedResponse<PayrollPeriod>>('/payroll/periods', params),

  getPeriod: (id: string) =>
    api.get<ApiResponse<PayrollPeriod>>(`/payroll/periods/${id}`),

  createPeriod: (data: Partial<PayrollPeriod>) =>
    api.post<ApiResponse<PayrollPeriod>>('/payroll/periods', data),

  updatePeriod: (id: string, data: Partial<PayrollPeriod>) =>
    api.put<ApiResponse<PayrollPeriod>>(`/payroll/periods/${id}`, data),

  // Records
  listRecords: (params?: PayrollListParams) =>
    api.get<PaginatedResponse<PayrollRecord>>('/payroll/records', params as Record<string, string | number | boolean>),

  getRecord: (id: string) =>
    api.get<ApiResponse<PayrollRecord>>(`/payroll/records/${id}`),

  processPayroll: (periodId: string) =>
    api.post<ApiResponse<PayrollRecord[]>>(`/payroll/periods/${periodId}/process`),

  approvePayroll: (periodId: string) =>
    api.patch<ApiResponse<PayrollPeriod>>(`/payroll/periods/${periodId}/approve`),

  markAsPaid: (periodId: string) =>
    api.patch<ApiResponse<PayrollPeriod>>(`/payroll/periods/${periodId}/paid`),

  generatePayslip: (recordId: string) =>
    fetch(`/api/payroll/records/${recordId}/payslip`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
    }),

  getMyPayslips: (params?: Record<string, string | number | boolean>) =>
    api.get<PaginatedResponse<PayrollRecord>>('/payroll/my-payslips', params),
}
