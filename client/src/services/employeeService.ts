import { api } from './api'
import type { Employee, EmployeeFormData, PaginatedResponse, ApiResponse } from '../types'

export interface EmployeeListParams {
  page?: number
  limit?: number
  search?: string
  departmentId?: string
  status?: string
  employmentType?: string
}

export const employeeService = {
  list: (params?: EmployeeListParams) =>
    api.get<PaginatedResponse<Employee>>('/employees', params as Record<string, string | number | boolean>),

  getById: (id: string) =>
    api.get<ApiResponse<Employee>>(`/employees/${id}`),

  create: (data: EmployeeFormData) =>
    api.post<ApiResponse<Employee>>('/employees', data),

  update: (id: string, data: Partial<EmployeeFormData>) =>
    api.put<ApiResponse<Employee>>(`/employees/${id}`, data),

  deactivate: (id: string) =>
    api.patch<ApiResponse<Employee>>(`/employees/${id}/deactivate`),

  activate: (id: string) =>
    api.patch<ApiResponse<Employee>>(`/employees/${id}/activate`),

  delete: (id: string) =>
    api.delete<ApiResponse<void>>(`/employees/${id}`),

  exportCsv: () =>
    fetch('/api/employees/export/csv', {
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
    }),
}
