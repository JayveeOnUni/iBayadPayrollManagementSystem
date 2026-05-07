import { api } from './api'
import type { AdminDashboardData, ApiResponse, EmployeeDashboardData } from '../types'

export const dashboardService = {
  getAdminDashboard: () =>
    api.get<ApiResponse<AdminDashboardData>>('/admin/dashboard'),

  getEmployeeDashboard: () =>
    api.get<ApiResponse<EmployeeDashboardData>>('/employees/dashboard'),
}
